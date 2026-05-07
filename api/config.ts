import type { VercelApiHandler } from "@vercel/node";
import { getConfig, getConfigs, getUsageStats, setConfig, setConfigs } from "./db";

const ALLOWED_KEYS = ["site_config", "products", "videos", "gallery_projects"] as const;
type AllowedKey = (typeof ALLOWED_KEYS)[number];

const DB_SOFT_LIMIT_BYTES = Number(process.env.DB_SOFT_LIMIT_BYTES || 2_000_000);
const MIN_IMAGES_PER_PRODUCT = Number(process.env.MIN_IMAGES_PER_PRODUCT || 1);
const MAX_IMAGES_PER_PRODUCT = Number(process.env.MAX_IMAGES_PER_PRODUCT || 10);
const MAX_PRODUCTS = Number(process.env.MAX_PRODUCTS || 600);

function getAuthFromReq(req: any) {
  const headerUser = String(req.headers["x-admin-username"] || "");
  const headerPass = String(req.headers["x-admin-password"] || "");
  const bodyUser = String(req.body?.username || "");
  const bodyPass = String(req.body?.password || "");

  return {
    username: headerUser || bodyUser,
    password: headerPass || bodyPass,
  };
}

function isAuthorized(req: any): boolean {
  const expectedUser = process.env.ADMIN_PANEL_USERNAME || "admin";
  const expectedPass = process.env.ADMIN_PANEL_PASSWORD || "admin123";
  const auth = getAuthFromReq(req);
  return auth.username === expectedUser && auth.password === expectedPass;
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

const handler: VercelApiHandler = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const action = String(req.body?.action || "");

    if (action === "auth") {
      return res.status(200).json({ success: isAuthorized(req) });
    }

    if (action === "get") {
      const key = String(req.body?.key || "site_config") as AllowedKey;
      if (!ALLOWED_KEYS.includes(key)) {
        return res.status(400).json({ success: false, error: "Invalid key" });
      }
      const data = await getConfig(key);
      return res.status(200).json({ success: true, data });
    }

    if (action === "get_bundle") {
      const data = await getConfigs([...ALLOWED_KEYS]);
      return res.status(200).json({ success: true, data });
    }

    if (action === "stats") {
      if (!isAuthorized(req)) {
        return res.status(401).json({ success: false, error: "Unauthorized" });
      }
      const stats = await getUsageStats();
      return res.status(200).json({ success: true, data: toUsagePayload(stats.usedBytes, stats.itemCount) });
    }

    if (action === "set") {
      if (!isAuthorized(req)) {
        return res.status(401).json({ success: false, error: "Unauthorized" });
      }
      const key = String(req.body?.key || "site_config") as AllowedKey;
      if (!ALLOWED_KEYS.includes(key)) {
        return res.status(400).json({ success: false, error: "Invalid key" });
      }
      await setConfig(key, req.body?.data ?? null);
      const stats = await getUsageStats();
      return res.status(200).json({ success: true, data: toUsagePayload(stats.usedBytes, stats.itemCount) });
    }

    if (action === "set_bundle") {
      if (!isAuthorized(req)) {
        return res.status(401).json({ success: false, error: "Unauthorized" });
      }

      const payload = (req.body?.payload || {}) as Record<string, any>;
      const sanitized: Record<string, any> = {};

      for (const key of ALLOWED_KEYS) {
        if (payload[key] !== undefined) sanitized[key] = payload[key];
      }

      const errors = validateBundle(sanitized);
      if (errors.length) {
        return res.status(400).json({ success: false, error: errors.join(" ") });
      }

      const bundleBytes = Buffer.byteLength(JSON.stringify(sanitized), "utf8");
      if (bundleBytes > DB_SOFT_LIMIT_BYTES) {
        return res.status(413).json({ success: false, error: "Data terlalu besar untuk batas project saat ini." });
      }

      await setConfigs(sanitized);
      const stats = await getUsageStats();
      return res.status(200).json({ success: true, data: toUsagePayload(stats.usedBytes, stats.itemCount) });
    }

    return res.status(400).json({ success: false, error: "Invalid action" });
  } catch (error: any) {
    console.error("API Error:", error);
    return res.status(500).json({ success: false, error: error?.message || "Server error" });
  }
};

export default handler;