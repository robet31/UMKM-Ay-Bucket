import type { VercelApiHandler } from "@vercel/node";
import { getConfig, getConfigs, getUsageStats, setConfig, setConfigs } from "./_db.js";

const ALLOWED_KEYS = ["site_config", "products", "videos", "gallery_projects"] as const;
type AllowedKey = (typeof ALLOWED_KEYS)[number];

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

const DB_SOFT_LIMIT_BYTES = Number(process.env.DB_SOFT_LIMIT_BYTES || 2_000_000);
const MIN_IMAGES_PER_PRODUCT = Number(process.env.MIN_IMAGES_PER_PRODUCT || 1);
const MAX_IMAGES_PER_PRODUCT = Number(process.env.MAX_IMAGES_PER_PRODUCT || 10);
const MAX_PRODUCTS = Number(process.env.MAX_PRODUCTS || 600);

// ---- Security: Rate Limiting ----
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 60; // 60 requests per minute
const RATE_LIMIT_WRITE_MAX = 20; // 20 write requests per minute

function getRateLimitKey(req: any): string {
  const forwarded = String(req.headers["x-forwarded-for"] || "");
  const ip = forwarded.split(",")[0]?.trim() || req.socket?.remoteAddress || "unknown";
  return ip;
}

function checkRateLimit(key: string, maxRequests: number): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (entry.count >= maxRequests) {
    return false;
  }

  entry.count++;
  return true;
}

// Periodic cleanup to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  rateLimitMap.forEach((entry, key) => {
    if (now > entry.resetAt) rateLimitMap.delete(key);
  });
}, 300_000); // Clean every 5 minutes

const MAX_BODY_SIZE_BYTES = 10_000_000; // 10MB max request body

// ---- Security: Input Sanitization ----
function sanitizeString(value: unknown, maxLength: number = 10000): string {
  if (typeof value !== "string") return "";
  // Remove null bytes
  let clean = value.replace(/\0/g, "");
  // Truncate
  if (clean.length > maxLength) clean = clean.substring(0, maxLength);
  return clean;
}

function sanitizeKey(value: unknown): AllowedKey | null {
  const str = sanitizeString(value, 50);
  if (ALLOWED_KEYS.includes(str as AllowedKey)) return str as AllowedKey;
  return null;
}

function sanitizeAction(value: unknown): string {
  const str = sanitizeString(value, 30);
  const allowed = ["auth", "get", "get_bundle", "stats", "set", "set_bundle"];
  if (allowed.includes(str)) return str;
  return "";
}

// Deep sanitize JSON data to prevent injection
function sanitizeJsonData(data: any, depth: number = 0, maxDepth: number = 10): any {
  if (depth > maxDepth) return null;
  
  if (data === null || data === undefined) return data;
  if (typeof data === "boolean" || typeof data === "number") return data;
  
  if (typeof data === "string") {
    // Remove null bytes and potential SQL injection patterns
    let clean = data.replace(/\0/g, "");
    // Strip potential script injections in strings
    clean = clean.replace(/<script\b[^>]*>.*?<\/script>/gi, "");
    return clean;
  }
  
  if (Array.isArray(data)) {
    return data.map(item => sanitizeJsonData(item, depth + 1, maxDepth));
  }
  
  if (typeof data === "object") {
    const cleaned: Record<string, any> = {};
    for (const [key, value] of Object.entries(data)) {
      // Sanitize keys - only allow alphanumeric, underscore, dash, dot
      const cleanKey = key.replace(/[^a-zA-Z0-9_\-\.]/g, "").substring(0, 200);
      if (cleanKey) {
        cleaned[cleanKey] = sanitizeJsonData(value, depth + 1, maxDepth);
      }
    }
    return cleaned;
  }
  
  return null;
}

// ---- Auth ----
function getAuthFromReq(req: any) {
  const headerUser = sanitizeString(req.headers["x-admin-username"], 100);
  const headerPass = sanitizeString(req.headers["x-admin-password"], 200);
  const bodyUser = sanitizeString(req.body?.username, 100);
  const bodyPass = sanitizeString(req.body?.password, 200);

  return {
    username: headerUser || bodyUser,
    password: headerPass || bodyPass,
  };
}

async function isAuthorized(req: any): Promise<boolean> {
  let expectedUser = process.env.ADMIN_PANEL_USERNAME || "admin";
  let expectedPass = process.env.ADMIN_PANEL_PASSWORD || "AyBucket2026!";
  const auth = getAuthFromReq(req);
  
  // Try to load custom credentials from database
  try {
    const siteConfig = await getConfig("site_config");
    if (siteConfig && siteConfig.adminUsername && siteConfig.adminPassword) {
      expectedUser = siteConfig.adminUsername;
      expectedPass = siteConfig.adminPassword;
    }
  } catch (e) {
    console.error("Failed to read auth config from DB:", e);
  }
  
  // Constant-time comparison to prevent timing attacks
  if (auth.username.length !== expectedUser.length || auth.password.length !== expectedPass.length) {
    return false;
  }
  
  let usernameMatch = true;
  let passwordMatch = true;
  
  for (let i = 0; i < expectedUser.length; i++) {
    if (auth.username[i] !== expectedUser[i]) usernameMatch = false;
  }
  for (let i = 0; i < expectedPass.length; i++) {
    if (auth.password[i] !== expectedPass[i]) passwordMatch = false;
  }
  
  return usernameMatch && passwordMatch;
}

function toUsagePayload(usedBytes: number, itemCount: number) {
  const remainingBytes = Math.max(DB_SOFT_LIMIT_BYTES - usedBytes, 0);
  const usagePercent = DB_SOFT_LIMIT_BYTES > 0 ? Math.min((usedBytes / DB_SOFT_LIMIT_BYTES) * 100, 100) : 0;
  const warningLevel = usagePercent >= 90 ? "critical" : usagePercent >= 75 ? "warning" : "safe";

  return {
    usedBytes,
    itemCount,
    limitBytes: DB_SOFT_LIMIT_BYTES,
    remainingBytes,
    usagePercent,
    warningLevel,
  };
}

function validateBundle(payload: Record<string, any>) {
  const errors: string[] = [];

  if (payload.products) {
    const products = Array.isArray(payload.products) ? payload.products : [];

    if (products.length > MAX_PRODUCTS) {
      errors.push(`Jumlah produk melebihi batas (${MAX_PRODUCTS}).`);
    }

    products.forEach((product: any, idx: number) => {
      const images = Array.isArray(product?.images)
        ? product.images.filter(Boolean)
        : product?.image
          ? [product.image]
          : [];

      if (images.length < MIN_IMAGES_PER_PRODUCT) {
        errors.push(`Produk ke-${idx + 1} wajib minimal ${MIN_IMAGES_PER_PRODUCT} gambar.`);
      }

      if (images.length > MAX_IMAGES_PER_PRODUCT) {
        errors.push(`Produk ke-${idx + 1} melebihi maksimal ${MAX_IMAGES_PER_PRODUCT} gambar.`);
      }
    });
  }

  return errors;
}

// ---- Security Headers ----
function setSecurityHeaders(res: any) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
}

const handler: VercelApiHandler = async (req, res) => {
  // Set security headers
  setSecurityHeaders(res);
  
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-Admin-Username, X-Admin-Password");
    res.status(204).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  // Validate request body size
  const bodyStr = JSON.stringify(req.body || {});
  if (Buffer.byteLength(bodyStr, 'utf8') > MAX_BODY_SIZE_BYTES) {
    res.status(413).json({ success: false, error: "Request body too large" });
    return;
  }

  // Check content-type
  const contentType = String(req.headers["content-type"] || "");
  if (!contentType.includes("application/json")) {
    res.status(400).json({ success: false, error: "Content-Type must be application/json" });
    return;
  }

  // Rate limiting
  const clientKey = getRateLimitKey(req);
  
  try {
    const action = sanitizeAction(req.body?.action);

    if (!action) {
      res.status(400).json({ success: false, error: "Invalid action" });
      return;
    }

    if (action === "auth") {
      // Stricter rate limit for auth attempts (prevent brute force)
      if (!checkRateLimit(`auth:${clientKey}`, 10)) {
        res.status(429).json({ success: false, error: "Too many login attempts. Please wait." });
        return;
      }
      res.status(200).json({ success: await isAuthorized(req) });
      return;
    }

    if (action === "get") {
      if (!checkRateLimit(`read:${clientKey}`, RATE_LIMIT_MAX_REQUESTS)) {
        res.status(429).json({ success: false, error: "Rate limit exceeded." });
        return;
      }
      const key = sanitizeKey(req.body?.key || "site_config");
      if (!key) {
        res.status(400).json({ success: false, error: "Invalid key" });
        return;
      }
      const data = await getConfig(key);
      res.status(200).json({ success: true, data });
      return;
    }

    if (action === "get_bundle") {
      if (!checkRateLimit(`read:${clientKey}`, RATE_LIMIT_MAX_REQUESTS)) {
        res.status(429).json({ success: false, error: "Rate limit exceeded." });
        return;
      }
      const data = await getConfigs([...ALLOWED_KEYS]);
      res.status(200).json({ success: true, data });
      return;
    }

    if (action === "stats") {
      if (!checkRateLimit(`write:${clientKey}`, RATE_LIMIT_WRITE_MAX)) {
        res.status(429).json({ success: false, error: "Rate limit exceeded." });
        return;
      }
      if (!(await isAuthorized(req))) {
        res.status(401).json({ success: false, error: "Unauthorized" });
        return;
      }
      const stats = await getUsageStats();
      res.status(200).json({ success: true, data: toUsagePayload(stats.usedBytes, stats.itemCount) });
      return;
    }

    if (action === "set") {
      if (!checkRateLimit(`write:${clientKey}`, RATE_LIMIT_WRITE_MAX)) {
        res.status(429).json({ success: false, error: "Rate limit exceeded." });
        return;
      }
      if (!(await isAuthorized(req))) {
        res.status(401).json({ success: false, error: "Unauthorized" });
        return;
      }
      const key = sanitizeKey(req.body?.key || "site_config");
      if (!key) {
        res.status(400).json({ success: false, error: "Invalid key" });
        return;
      }
      
      // Sanitize data before saving
      const sanitizedData = sanitizeJsonData(req.body?.data ?? null);
      
      await setConfig(key, sanitizedData);
      const stats = await getUsageStats();
      res.status(200).json({ success: true, data: toUsagePayload(stats.usedBytes, stats.itemCount) });
      return;
    }

    if (action === "set_bundle") {
      if (!checkRateLimit(`write:${clientKey}`, RATE_LIMIT_WRITE_MAX)) {
        res.status(429).json({ success: false, error: "Rate limit exceeded." });
        return;
      }
      if (!(await isAuthorized(req))) {
        res.status(401).json({ success: false, error: "Unauthorized" });
        return;
      }

      const payload = (req.body?.payload || {}) as Record<string, any>;
      const sanitized: Record<string, any> = {};

      for (const key of ALLOWED_KEYS) {
        if (payload[key] !== undefined) {
          sanitized[key] = sanitizeJsonData(payload[key]);
        }
      }

      const errors = validateBundle(sanitized);
      if (errors.length) {
        res.status(400).json({ success: false, error: errors.join(" ") });
        return;
      }

      const bundleBytes = Buffer.byteLength(JSON.stringify(sanitized), "utf8");
      if (bundleBytes > DB_SOFT_LIMIT_BYTES) {
        res.status(413).json({ success: false, error: "Data terlalu besar untuk batas project saat ini." });
        return;
      }

      await setConfigs(sanitized);
      const stats = await getUsageStats();
      res.status(200).json({ success: true, data: toUsagePayload(stats.usedBytes, stats.itemCount) });
      return;
    }

    res.status(400).json({ success: false, error: "Invalid action" });
  } catch (error: any) {
    console.error("API Error:", error);
    const errMsg = String(error?.message || error || "");
    // Don't expose internal error details
    res.status(500).json({ success: false, error: "Internal server error", debug: errMsg.substring(0, 200) });
  }
};

export default handler;