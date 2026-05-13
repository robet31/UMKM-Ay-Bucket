/// <reference types="vite/client" />
import { generatedInitialProducts } from "./generated_products";
import { ALL_ASSET_PATHS } from "./asset_index";

// ==========================================
// AY BUCKET - KATALOG TERBARU 2026
// ==========================================

// ---- BRANDING & LOGO ----
export const BRAND_LOGO = {
  name: "Ay Bucket",
  tagline: "Wujudkan Hadiah Impianmu",
  whatsapp: "6285880021020",
  location: "Ruko Jambu Raya Perumnas Kamal",
  instagram: "@ay.bucket",
  logo: "/assets/logo-fix.png",
};

// Memory-only cache keys (NO localStorage — semua data dari cloud Google Sheets)
const ADMIN_STORAGE_KEY = "aybucket_config_v1";
const PRODUCTS_STORAGE_KEY = "aybucket_products_v1";
const VIDEOS_STORAGE_KEY = "aybucket_videos_v1";
const GALLERY_STORAGE_KEY = "aybucket_gallery_v1";

export type AllowedKey = "site_config" | "products" | "videos" | "gallery_projects";

// Cloud API URL — Google Sheets sebagai database gratis dan unlimited
// Prioritas: VITE_GSHEET_API_URL (Google Sheets) → /api/config (Vercel/Neon fallback)
const GSHEET_API_URL = import.meta.env.VITE_GSHEET_API_URL || '';
export const NEON_API_URL = GSHEET_API_URL || '/api/config';
const USE_GSHEET = !!GSHEET_API_URL;

// Developer Contact Information (shown when storage is full)
export const DEVELOPER_CONTACT = {
  whatsapp: '081515450611',
  whatsappLink: 'https://wa.me/6281515450611?text=Halo%20Kak%20Arraffi%2C%20saya%20perlu%20bantuan%20upgrade%20storage%20website%20Ay%20Bucket.',
  linkedin: 'https://www.linkedin.com/in/arraffi-abqori-nur-azizi/',
  name: 'Arraffi Abqori Nur Azizi',
};

export function normalizeAssetUrl(url?: string): string {
  if (!url) return "";
  let normalized = String(url).trim().replace(/\\/g, "/");
  try { normalized = decodeURIComponent(normalized); } catch { }
  try { return encodeURI(normalized); } catch { return normalized; }
}

function migrateLegacyAssetUrl(url?: string): string {
  const normalized = normalizeAssetUrl(url);
  if (!normalized) return "";
  const legacyMap: Record<string, string> = {
    "/assets/buket-satin-rp20000-item-01.jpg": "/assets/Buket Bunga Asli Premium - Rp 350.00000.png",
    "/assets/money-bouquet-rp50000-item-01.jpg": "/assets/Mawar Candy (Bunga Asli) - Rp 170.000,00.png",
    "/assets/snack-bouquet-rp35000-item-01.jpg": "/assets/Donat buket tart - Rp 100.00000 - isi 7 donat bomboloni isi coklat topping glaze bisa request warna. silahkan chat admin.png",
    "/assets/catalog-home-rp150000-item-02.jpg": "/assets/Akrilik frame mini - Rp 95.00000 - akrilik dome ukuran A5 standing lampu warna putih bisa request warna foto and tulisan.png",
  };
  return legacyMap[normalized] || normalized;
}

function normalizeForMatching(value: string): string {
  return String(value || "").toLowerCase().replace(/\u00a0/g, " ").replace(/%[0-9a-f]{2}/gi, " ").replace(/[()\[\]{}.,:+\-_/\\]/g, " ").replace(/\brp\b/g, " ").replace(/\d+/g, " ").replace(/\s+/g, " ").trim();
}

const MATCH_STOP_WORDS = new Set(["rp", "dan", "untuk", "bisa", "yang", "dengan", "big", "small", "premium", "ukuran", "harga", "sewa", "jam", "hari", "item", "promo", "bunga", "bucket", "buket"]);

function extractMatchKeywords(value: string): string[] {
  return normalizeForMatching(value).split(" ").filter((word) => word.length >= 3 && !MATCH_STOP_WORDS.has(word));
}

function scoreAssetForProduct(productName: string, assetPath: string): number {
  const keywords = extractMatchKeywords(productName);
  if (keywords.length === 0) return 0;
  const assetName = normalizeForMatching(assetPath.split("/").pop() || assetPath);
  let score = 0;
  for (const keyword of keywords) { if (assetName.includes(keyword)) score += 1; }
  if (/karangan bunga/i.test(productName) && assetName.includes("karangan") && assetName.includes("bunga")) score += 2;
  if (/standing akrilik/i.test(productName) && assetName.includes("akrilik")) score += 1;
  if (/selempang/i.test(productName) && assetName.includes("selempang")) score += 2;
  return score;
}

function findRelatedAssetPaths(productName: string): string[] {
  const keywords = extractMatchKeywords(productName);
  const results = ALL_ASSET_PATHS.map((assetPath) => ({ assetPath, score: scoreAssetForProduct(productName, assetPath) })).filter((entry) => entry.score >= 1).sort((a, b) => b.score - a.score || a.assetPath.length - b.assetPath.length);
  if (results.length === 0 && keywords.length > 0) {
    const firstWord = keywords[0];
    return ALL_ASSET_PATHS.filter(p => normalizeForMatching(p).includes(firstWord)).map(p => migrateLegacyAssetUrl(p)).slice(0, 12);
  }
  return results.map((entry) => migrateLegacyAssetUrl(entry.assetPath)).slice(0, 18);
}

function enrichProductWithMatchedAssets(product: Product): Product {
  const existingImages = (product.images || (product.image ? [product.image] : [])).filter(Boolean).map((item) => migrateLegacyAssetUrl(item));
  
  // Only enrich if the product has NO images. This allows admins to delete images permanently.
  if (existingImages.length > 0) {
    return { ...product, image: existingImages[0], images: existingImages };
  }

  const matchedAssets = findRelatedAssetPaths(product.name);
  const mergedImages = Array.from(new Set([...existingImages, ...matchedAssets]));
  return { ...product, image: mergedImages[0] || migrateLegacyAssetUrl(product.image) || "", images: mergedImages };
}

export function enrichProductsWithMatchedAssets(products: Product[]): Product[] {
  return products.map((product) => enrichProductWithMatchedAssets(product));
}

export interface HeroSetting {
  productId?: string;
  image?: string;
}

export interface SiteConfig {
  businessName: string;
  tagline: string;
  year: string;
  address: string;
  whatsappNumber: string;
  whatsappDisplay: string;
  whatsappNumber2?: string;
  whatsappDisplay2?: string;
  instagram: string;
  tiktok: string;
  navLinks: Array<{ to: string; label: string }>;
  footerText: string;
  heroTitle: string;
  heroSubtitle: string;
  heroFallbackImage: string; // Legacy
  heroSettings?: HeroSetting[];
  brandLogoUrl: string;
  mapsEmbedUrl: string;
  catalogLink: string;
  catalogLinkType: "wa" | "link" | "pdf";
  adminUsername?: string;
  adminPassword?: string;
  customCategories?: Category[];
}

export function getCatalogWhatsAppLink(): string {
  const config = getSiteConfig();
  const link = config.catalogLink;
  if (!link || config.catalogLinkType !== "wa") return "";
  const message = encodeURIComponent(`Halo ${config.businessName}! 🌸\n\nSaya ingin melihat katalog produk Anda.`);
  return `https://wa.me/${link.replace(/[^0-9]/g, "")}?text=${message}`;
}

const defaultConfig: SiteConfig = {
  businessName: "Ay Bucket",
  tagline: "Wujudkan Hadiah Impianmu",
  year: "2026",
  address: "Toko: Ruko Jambu Raya Perumnas Kamal\nHomestore Madura: Jl Jeruk 6 no 4 Perumnas Kamal Bangkalan\nHomestore Surabaya: Jl Wonorejo 3 Tegalsari Surabaya",
  whatsappNumber: "6285880021020",
  whatsappDisplay: "0858-8002-1020",
  whatsappNumber2: "6287853094053",
  whatsappDisplay2: "0878-5309-4053",
  instagram: "@ay.bucket",
  tiktok: "",
  navLinks: [
    { to: "/", label: "Katalog" },
    { to: "/studio", label: "Tentang" },
    { to: "/contact", label: "Kontak" },
  ],
  footerText: "© 2026 Ay Bucket & Gift. Dibuat dengan penuh cinta.",
  heroTitle: "Ay Bucket & Gift",
  heroSubtitle: "Pilihan Hadiah Premium Untuk Momen Spesial Anda.",
  heroFallbackImage: "/assets/Buket Bunga Asli Premium - Rp 350.00000.png",
  heroSettings: [],
  brandLogoUrl: "/assets/logo-fix.png",
  mapsEmbedUrl: "https://maps.google.com/maps?q=Pertokoan+Pasar+Senenan+Bangkalan&t=&z=15&ie=UTF8&iwloc=&output=embed",
  catalogLink: "6285880021020",
  catalogLinkType: "wa",
  adminUsername: "admin",
  adminPassword: "AyBucket2026!",
  customCategories: [],
};

// fetchFromCloud — mengambil data ringan dari Google Sheets / Vercel API untuk sinkronisasi lintas perangkat
export async function fetchFromNeon(key: AllowedKey): Promise<any | null> {
  try {
    if (USE_GSHEET) {
      // Untuk Google Sheets, gunakan GET agar lebih lancar menghindari CORS
      const url = `${NEON_API_URL}?action=get&key=${key}`;
      const res = await fetch(url, { method: "GET", redirect: "follow" });
      if (res.ok) {
        const json = await res.json();
        if (json?.success && json?.data !== undefined) return json.data;
      }
    } else {
      // Fallback untuk Neon/Vercel API
      const res = await fetch(NEON_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "get", key }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json?.success && json?.data !== undefined) return json.data;
      }
    }
  } catch (err) {
    console.warn(`[Cloud Sync] Gagal mengambil ${key}:`, err);
  }
  return null;
}

let activeAdminUsername = "";
let activeAdminPassword = "";

export function setAdminCredentials(user: string, pass: string) {
  activeAdminUsername = user;
  activeAdminPassword = pass;
}

// saveToCloud — menyimpan data ke Google Sheets
// Untuk menghindari CORS error dan limitasi URL length pada GET,
// kita gunakan POST dengan form-urlencoded (diizinkan di mode no-cors).
export async function saveToNeon(key: AllowedKey, data: any): Promise<boolean> {
  try {
    console.log(`[Cloud Sync] Menyimpan ke ${key}...`);

    if (USE_GSHEET) {
      const payloadObj = {
        action: "set", key, data,
        username: activeAdminUsername || "admin",
        password: activeAdminPassword || "AyBucket2026!"
      };
      const payloadStr = JSON.stringify(payloadObj);
      const encodedData = `payload=${encodeURIComponent(payloadStr)}`;
      
      console.log(`[Cloud Sync] Mengirim ${key} (${payloadStr.length} chars) via form-encoded POST...`);
      
      try {
        // Mode no-cors mengizinkan Content-Type: application/x-www-form-urlencoded
        // Ini adalah cara paling reliable untuk kirim data besar ke Apps Script tanpa error CORS
        await fetch(NEON_API_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: encodedData
        });
        
        console.log(`✅ [Cloud Sync] ${key} berhasil dikirim ke antrean server!`);
        return true;
      } catch (postErr) {
        console.warn(`[Cloud Sync] POST gagal untuk ${key}:`, postErr);
      }
    } else {
      // Non-GSheet: Vercel API
      const res = await fetch(NEON_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "set", key, data }),
      });
      if (res.ok) {
        console.log(`✅ [Cloud Sync] ${key} berhasil disimpan.`);
        return true;
      }
    }
  } catch (err) {
    console.warn(`❌ [Cloud Sync] Gagal menyimpan ${key}:`, err);
  }
  return false;
}

/**
 * Mengirim gambar kustom ke ImgBB API secara otomatis di background.
 * Mengembalikan URL pendek (e.g. https://i.ibb.co/...) agar kuota database teks tetap ringan.
 * Jika ImgBB gagal/offline, otomatis fallback ke lokal Base64 terkompresi.
 */
export async function uploadToImgBB(file: File): Promise<string> {
  const apiKey = (import.meta as any).env?.VITE_IMGBB_API_KEY || "cfd0c641eb9b46571fa0b5557704df34";
  const formData = new FormData();
  formData.append("key", apiKey);
  formData.append("image", file);

  try {
    const res = await fetch("https://api.imgbb.com/1/upload", {
      method: "POST",
      body: formData,
    });
    if (!res.ok) throw new Error("ImgBB HTTP error");
    const json = await res.json();
    if (json?.data?.url) {
      return json.data.url;
    }
    throw new Error("Invalid ImgBB response");
  } catch (err) {
    console.warn("Upload ImgBB gagal, melakukan fallback instan ke lokal WebP Base64:", err);
    return await compressImage(file, 1000, 0.8);
  }
}

// ---- Smart Image Compression System ----
// Compression statistics for UI feedback
export interface CompressionStats {
  originalSizeKB: number;
  compressedSizeKB: number;
  reductionPercent: number;
  outputFormat: string;
  outputWidth: number;
  outputHeight: number;
}

// Cloud storage — semua gambar di-upload ke ImgBB, URL pendek disimpan di Google Sheets
export const STORAGE_LIMITS = {
  LOCALSTORAGE_LIMIT_MB: 999, // Unlimited — data di cloud, bukan localStorage
  TARGET_IMAGE_SIZE_KB: 80,
  MAX_IMAGE_SIZE_KB: 150,
  WARNING_THRESHOLD_PERCENT: 75,
  CRITICAL_THRESHOLD_PERCENT: 90,
};

// Cloud-based storage stats (no longer localStorage dependent)
export function getStorageUsageStats(): {
  totalDataUrlSizeKB: number;
  totalDataUrlCount: number;
  localStorageUsedKB: number;
  localStorageLimitKB: number;
  localStoragePercent: number;
  warningLevel: "safe" | "warning" | "critical" | "full";
  breakdown: { key: string; sizeKB: number; count: number }[];
} {
  // Semua data tersimpan di Google Sheets (cloud), bukan localStorage
  return {
    totalDataUrlSizeKB: 0, totalDataUrlCount: 0,
    localStorageUsedKB: 0, localStorageLimitKB: STORAGE_LIMITS.LOCALSTORAGE_LIMIT_MB * 1024,
    localStoragePercent: 0, warningLevel: "safe", breakdown: [],
  };
}

/**
 * Smart Adaptive Image Compression
 * 
 * Compresses images with intelligent quality adjustment to hit a target file size
 * while preserving visual quality. Uses multi-step downscaling (Lanczos-like)
 * and WebP format for optimal compression.
 * 
 * @param file - The image file to compress
 * @param maxWidth - Maximum output width in pixels (default: 1024)
 * @param quality - Initial quality hint 0-1 (default: 0.82)
 * @param targetSizeKB - Target file size in KB (default: 80KB)
 * @returns Promise with the compressed Data URL string
 */
export async function compressImage(file: File, maxWidth = 1024, quality = 0.82, targetSizeKB?: number): Promise<string> {
  const effectiveTargetKB = targetSizeKB || STORAGE_LIMITS.TARGET_IMAGE_SIZE_KB;
  const maxSizeKB = STORAGE_LIMITS.MAX_IMAGE_SIZE_KB;
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Multi-step downscaling for better quality (halve dimensions iteratively)
        let srcCanvas: HTMLCanvasElement | HTMLImageElement = img;
        let srcWidth = width;
        let srcHeight = height;

        while (srcWidth > maxWidth * 2) {
          const stepCanvas = document.createElement("canvas");
          const halfW = Math.round(srcWidth / 2);
          const halfH = Math.round(srcHeight / 2);
          stepCanvas.width = halfW;
          stepCanvas.height = halfH;
          const stepCtx = stepCanvas.getContext("2d");
          if (stepCtx) {
            stepCtx.imageSmoothingEnabled = true;
            stepCtx.imageSmoothingQuality = "high";
            stepCtx.drawImage(srcCanvas, 0, 0, halfW, halfH);
          }
          srcCanvas = stepCanvas;
          srcWidth = halfW;
          srcHeight = halfH;
        }

        // Final resize to target width
        if (srcWidth > maxWidth) {
          height = Math.round((srcHeight * maxWidth) / srcWidth);
          width = maxWidth;
        } else {
          width = srcWidth;
          height = srcHeight;
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";
          ctx.drawImage(srcCanvas, 0, 0, width, height);
        }

        // Adaptive quality: try WebP first, then adjust quality to hit target size
        const tryCompress = (q: number): string => {
          const webpResult = canvas.toDataURL('image/webp', q);
          if (webpResult.startsWith('data:image/webp')) return webpResult;
          return canvas.toDataURL('image/jpeg', q);
        };

        // First attempt at requested quality
        let result = tryCompress(quality);
        let resultSizeKB = Math.round((result.length * 0.75) / 1024);

        // If result exceeds max allowed size, iteratively reduce quality
        // while still keeping it above 0.5 to prevent visible degradation
        if (resultSizeKB > maxSizeKB) {
          let q = quality;
          for (let i = 0; i < 5 && resultSizeKB > maxSizeKB && q > 0.5; i++) {
            q -= 0.08;
            result = tryCompress(q);
            resultSizeKB = Math.round((result.length * 0.75) / 1024);
          }
          // If still too large, reduce resolution as last resort
          if (resultSizeKB > maxSizeKB && width > 600) {
            const scale = 0.7;
            canvas.width = Math.round(width * scale);
            canvas.height = Math.round(height * scale);
            const ctx2 = canvas.getContext("2d");
            if (ctx2) {
              ctx2.imageSmoothingEnabled = true;
              ctx2.imageSmoothingQuality = "high";
              ctx2.drawImage(srcCanvas, 0, 0, canvas.width, canvas.height);
            }
            result = tryCompress(Math.max(q, 0.6));
            resultSizeKB = Math.round((result.length * 0.75) / 1024);
          }
        }
        // If result is well under target and quality was reduced, try bumping quality back up
        // to maximize visual quality within the size budget
        else if (resultSizeKB < effectiveTargetKB * 0.5 && quality < 0.9) {
          const higherQ = Math.min(quality + 0.1, 0.92);
          const betterResult = tryCompress(higherQ);
          const betterSizeKB = Math.round((betterResult.length * 0.75) / 1024);
          if (betterSizeKB <= maxSizeKB) {
            result = betterResult;
          }
        }

        resolve(result);
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
}

/**
 * Compress image and return both the Data URL and compression statistics.
 * Useful for showing before/after feedback in the admin dashboard.
 */
export async function compressImageWithStats(file: File, maxWidth = 1024, quality = 0.82): Promise<{ dataUrl: string; stats: CompressionStats }> {
  const originalSizeKB = Math.round(file.size / 1024);
  const dataUrl = await compressImage(file, maxWidth, quality);
  const compressedSizeKB = Math.round((dataUrl.length * 0.75) / 1024);
  const reductionPercent = originalSizeKB > 0 ? Math.round(((originalSizeKB - compressedSizeKB) / originalSizeKB) * 100) : 0;
  
  // Detect output dimensions from the data url (approximate from canvas)
  const outputFormat = dataUrl.startsWith('data:image/webp') ? 'WebP' : 'JPEG';
  
  return {
    dataUrl,
    stats: {
      originalSizeKB,
      compressedSizeKB,
      reductionPercent: Math.max(0, reductionPercent),
      outputFormat,
      outputWidth: 0, // filled by caller if needed
      outputHeight: 0,
    },
  };
}

// [LEGACY] Kept for backward compatibility — these are now no-ops
export const fetchSiteConfigFromNeon = () => Promise.resolve(null);
export const saveSiteConfigToNeon = (_config: any) => Promise.resolve(true);

// Fix: import.meta.env.PROD is a boolean in Vite production builds
export const isProduction = 
  (import.meta as any).env?.PROD === true || 
  (import.meta as any).env?.PROD === 'true' || 
  (import.meta as any).env?.VITE_VERCEL === '1';

let memoryCache: Record<string, any> = {};

// syncAllWithCloud — sinkronisasi data dari Google Sheets ke memori lokal
// Data cloud SELALU menimpa data lokal untuk memastikan konsistensi lintas perangkat
export async function syncAllWithNeon(): Promise<boolean> {
  try {
    // Coba bundle fetch dulu (lebih efisien, 1 request)
    let bundleData: Record<string, any> | null = null;
    try {
      if (USE_GSHEET) {
        const url = `${NEON_API_URL}?action=get_bundle`;
        const res = await fetch(url, { method: "GET", redirect: "follow" });
        if (res.ok) {
          const json = await res.json();
          if (json?.success && json?.data) bundleData = json.data;
        }
      } else {
        const res = await fetch(NEON_API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "get_bundle" }),
        });
        if (res.ok) {
          const json = await res.json();
          if (json?.success && json?.data) bundleData = json.data;
        }
      }
    } catch (err) {
      console.warn("[Cloud Sync] Bundle fetch gagal, mencoba fetch satuan:", err);
    }

    let cfg: any = null, prods: any = null, vids: any = null, gal: any = null;

    if (bundleData) {
      cfg = bundleData.site_config ?? null;
      prods = bundleData.products ?? null;
      vids = bundleData.videos ?? null;
      gal = bundleData.gallery_projects ?? null;
    } else {
      // Fallback: fetch each key individually
      [cfg, prods, vids, gal] = await Promise.all([
        fetchFromNeon("site_config"),
        fetchFromNeon("products"),
        fetchFromNeon("videos"),
        fetchFromNeon("gallery_projects")
      ]);
    }

    let synced = false;
    // Cloud data → langsung ke memoryCache (TANPA localStorage)
    if (cfg && typeof cfg === 'object') {
      const merged = { ...defaultConfig, ...cfg };
      memoryCache[ADMIN_STORAGE_KEY] = merged;
      synced = true;
    }
    if (prods && Array.isArray(prods) && prods.length > 0) {
      memoryCache[PRODUCTS_STORAGE_KEY] = prods;
      synced = true;
    }
    if (vids && Array.isArray(vids)) {
      memoryCache[VIDEOS_STORAGE_KEY] = vids;
      synced = true;
    }
    if (gal && Array.isArray(gal)) {
      memoryCache[GALLERY_STORAGE_KEY] = gal;
      synced = true;
    }
    if (synced) {
      console.log("✅ Cloud sync berhasil — data terbaru dimuat dari Google Sheets");
      window.dispatchEvent(new Event("siteConfigChanged"));
      window.dispatchEvent(new Event("galleryProjectsChanged"));
      return true;
    } else {
      console.warn("⚠️ Cloud sync: tidak ada data baru dari server (mungkin belum diisi)");
    }
  } catch (err) {
    console.warn("❌ Gagal sinkronisasi dengan Cloud DB:", err);
  }
  window.dispatchEvent(new Event("siteConfigChanged"));
  window.dispatchEvent(new Event("galleryProjectsChanged"));
  return false;
}

export async function getSiteConfigWithNeon(): Promise<SiteConfig> {
  const remote = await fetchFromNeon("site_config");
  if (remote) {
    const merged = { ...defaultConfig, ...remote };
    memoryCache[ADMIN_STORAGE_KEY] = merged;
    return merged;
  }
  return getSiteConfig();
}

export function getSiteConfig(): SiteConfig {
  try {
    const cached = memoryCache[ADMIN_STORAGE_KEY];
    if (cached) {
      const merged = { ...defaultConfig, ...cached } as SiteConfig;
      if (!merged.mapsEmbedUrl) merged.mapsEmbedUrl = defaultConfig.mapsEmbedUrl;
      else merged.mapsEmbedUrl = cleanMapsUrl(merged.mapsEmbedUrl);
      merged.heroFallbackImage = migrateLegacyAssetUrl(merged.heroFallbackImage);
      merged.brandLogoUrl = migrateLegacyAssetUrl(merged.brandLogoUrl || defaultConfig.brandLogoUrl);
      if (!merged.adminUsername) merged.adminUsername = "admin";
      if (!merged.adminPassword || merged.adminPassword === "aybucket") merged.adminPassword = "admin123";
      if (merged.brandLogoUrl === "/assets/ay-logo-5.png") merged.brandLogoUrl = "/assets/logo-fix.png";
      return merged;
    }
  } catch { }
  return defaultConfig;
}

export function formatRupiah(value: number | string): string {
  const parsed = typeof value === "number" ? value : parseInt(String(value).replace(/\D/g, ""), 10);
  const amount = Number.isFinite(parsed) ? parsed : 0;
  if (amount === 0) return "Chat Admin";
  return `Rp ${amount.toLocaleString("id-ID")}`;
}

export function cleanMapsUrl(url: string | undefined): string {
  if (!url) return "";
  let clean = url.trim();
  const match = clean.match(/src="([^"]+)"/);
  if (match && match[1]) {
    clean = match[1];
  }
  if (!clean.startsWith("http://") && !clean.startsWith("https://")) {
    clean = "https://" + clean;
  }
  return clean;
}

export async function saveSiteConfig(config: Partial<SiteConfig>): Promise<void> {
  const current = getSiteConfig();
  const merged = { ...current, ...config, heroFallbackImage: migrateLegacyAssetUrl(config.heroFallbackImage ?? current.heroFallbackImage), brandLogoUrl: migrateLegacyAssetUrl(config.brandLogoUrl ?? current.brandLogoUrl ?? defaultConfig.brandLogoUrl), };
  
  memoryCache[ADMIN_STORAGE_KEY] = merged;
  saveToNeon("site_config", merged);
  window.dispatchEvent(new Event("siteConfigChanged"));
}

export function resetSiteConfig() {
  memoryCache[ADMIN_STORAGE_KEY] = { ...defaultConfig };
  saveToNeon("site_config", defaultConfig);
  window.dispatchEvent(new Event("siteConfigChanged"));
}

export type ProductCategory = "snack-bouquet" | "money-bouquet" | "fresh-flower" | "artificial-flower" | "catalog-home" | "accessories" | "buckets" | "wreaths" | "packaging" | "ribbons" | "sewa" | "bloom-box" | "thumbelina" | "bucket-unik" | "vas-dekorasi";

// Image limit per product (enforced in admin dashboard)
export const MAX_IMAGES_PER_PRODUCT = 12;

export interface Category {
  key: ProductCategory; label: string; emoji: string; description: string; noted?: string; canvaLink?: string;
}

export interface Product {
  id: string; name: string; category: ProductCategory; price: number; priceLabel: string; description?: string; image: string; images?: string[]; tag?: string; variant?: string; isPromo?: boolean; originalPrice?: number; promoLabel?: string;
}

export function normalizeProductRecord(product: any): Product {
  const numericPrice = typeof product?.price === "number" ? product.price : parseInt(String(product?.price || 0).replace(/\D/g, ""), 10) || 0;
  const normalizedLabel = typeof product?.priceLabel === "string" && product.priceLabel.trim().length > 0 ? (product.priceLabel.toLowerCase().includes("rp") ? product.priceLabel : formatRupiah(product.priceLabel)) : formatRupiah(numericPrice);
  const images = Array.isArray(product?.images) ? product.images.filter(Boolean).map((item: string) => migrateLegacyAssetUrl(item)) : product?.image ? [migrateLegacyAssetUrl(product.image)] : [];
  return { ...product, price: numericPrice, priceLabel: normalizedLabel, image: migrateLegacyAssetUrl(product?.image) || images[0] || "", images, } as Product;
}

export function normalizeStoredProducts(stored: any[]): Product[] { return stored.map((product) => normalizeProductRecord(product)); }

function toMergeableName(name: string | undefined): string { return String(name || "").toLowerCase().trim().replace(/[^a-z0-9]+/g, " ").replace(/\s+/g, " "); }
function toMergeablePrice(product: Partial<Product>): number { if (typeof product.price === "number" && Number.isFinite(product.price)) return product.price; return parseInt(String(product.priceLabel || "").replace(/\D/g, ""), 10) || 0; }
function getMergeKey(product: Partial<Product>): string { return `${toMergeableName(product.name)}::${toMergeablePrice(product)}`; }

export function mergeProductsByNameAndPrice(products: Product[]): Product[] {
  const map = new Map<string, Product>();
  for (const product of products) {
    const key = getMergeKey(product);
    const incomingImages = (product.images || (product.image ? [product.image] : [])).filter(Boolean).map((item) => migrateLegacyAssetUrl(item));
    if (!map.has(key)) { map.set(key, { ...product, image: migrateLegacyAssetUrl(product.image) || incomingImages[0] || "", images: Array.from(new Set(incomingImages)), }); continue; }
    const existing = map.get(key)!;
    const existingImages = (existing.images || (existing.image ? [existing.image] : [])).filter(Boolean).map((item) => migrateLegacyAssetUrl(item));
    const mergedImages = Array.from(new Set([...existingImages, ...incomingImages]));
    existing.images = mergedImages; existing.image = mergedImages[0] || existing.image || product.image;
    if ((!existing.description || existing.description.length < (product.description || "").length) && product.description) { existing.description = product.description; }
    if (!existing.tag && product.tag) existing.tag = product.tag;
    if (!existing.variant && product.variant) existing.variant = product.variant;
  }
  return Array.from(map.values());
}

export const defaultCategories: Category[] = [
  { key: "buckets", label: "Buket Bunga Premium", emoji: "🌸", description: "Rangkaian bunga segar (Fresh) & bunga palsu (Artificial) berkualitas tinggi.", noted: "Bisa request warna bunga & kain pembungkus (wrapping)." },
  { key: "bloom-box", label: "Bloom Box", emoji: "🎀", description: "Rangkaian bunga dalam kotak premium, cocok untuk hadiah ulang tahun & anniversary.", noted: "Tersedia berbagai pilihan bunga & warna." },
  { key: "thumbelina", label: "Thumbelina Series", emoji: "💐", description: "Koleksi buket custom desain Thumbelina dengan variasi tema dan desain unik.", noted: "Setiap desain Thumbelina adalah karya eksklusif Ay Bucket." },
  { key: "fresh-flower", label: "Bunga Segar (Fresh)", emoji: "🌹", description: "Rangkaian bunga mawar, sedap malam, dan asteria yang segar & harum.", noted: "Disarankan pesan H-1 untuk menjaga kesegaran maksimal." },
  { key: "artificial-flower", label: "Bunga Artificial", emoji: "🌼", description: "Rangkaian bunga tiruan premium yang awet dan tetap indah selamanya.", noted: "Sangat cocok untuk pajangan rumah atau hadiah jangka panjang." },
  { key: "snack-bouquet", label: "Snack & Food Bouquet", emoji: "🍭", description: "Pilihan hadiah unik dengan susunan snack, cokelat, hingga donat favorit.", noted: "Isian snack bisa disesuaikan dengan budget Anda." },
  { key: "money-bouquet", label: "Money Bouquet", emoji: "💸", description: "Hadiah eksklusif berupa buket uang dengan dekorasi bunga yang cantik.", noted: "Jumlah & nominal uang bisa dicustom sesuai keinginan." },
  { key: "bucket-unik", label: "Bucket Unik & Kreasi", emoji: "🎁", description: "Kreasi bucket unik & anti-mainstream: bucket rokok, tabung boneka, dan lainnya.", noted: "Beberapa item berstatus Pre Order." },
  { key: "wreaths", label: "Bunga Papan & Standing", emoji: "🌿", description: "Karangan bunga papan & standing akrilik untuk segala ucapan acara resmi.", noted: "Gratis ongkir untuk wilayah tertentu (Kamal & Telang)." },
  { key: "accessories", label: "Gift & Accessories", emoji: "✨", description: "Koleksi hadiah pelengkap seperti frame akrilik, dan gift box.", noted: "Pengerjaan cepat & hasil rapi." },
  { key: "ribbons", label: "Selempang & Pita", emoji: "🎗️", description: "Selempang wisuda & pita premium untuk momen spesial.", noted: "Bisa request tulisan & warna." },
  { key: "sewa", label: "Sewa (Rental)", emoji: "⏱️", description: "Layanan sewa standing akrilik & kostum untuk segala acara.", noted: "Tersedia paket 3 jam, 12 jam, hingga 24 jam." },
  { key: "vas-dekorasi", label: "Vas & Dekorasi", emoji: "🏺", description: "Vas bunga premium dan dekorasi ruangan dengan bunga import berkualitas.", noted: "Cocok untuk pajangan rumah atau kantor." },
  { key: "packaging", label: "Packing & Gift Box", emoji: "📦", description: "Packing premium box + kertas + pita organza untuk melengkapi hadiah.", noted: "Tambahan Rp 25.000 per box." }
];

export const categories: Category[] = typeof window !== 'undefined' ? ((getSiteConfig().customCategories && (getSiteConfig().customCategories as Category[]).length > 0) ? (getSiteConfig().customCategories as Category[]) : defaultCategories) : defaultCategories;

export interface GalleryProject { id: string; title: string; category: string; aspect: "3/4" | "1/1" | "16/9"; image: string; productId?: string; }

export const defaultGalleryProjects: GalleryProject[] = [
  { id: "gallery-1", title: "Premium Satin Bouquet", category: "Buket Satin", aspect: "3/4", image: "/assets/Round Pita Satin - Rp 100.00000.png", },
  { id: "gallery-2", title: "Exclusive Money Bouquet", category: "Money Bouquet", aspect: "1/1", image: "/assets/Mawar Candy (Bunga Asli) - Rp 170.000,00.png", },
  { id: "gallery-3", title: "Creative Donut Tart", category: "Snack Bouquet", aspect: "16/9", image: "/assets/Donat buket tart - Rp 100.00000 - isi 7 donat bomboloni isi coklat topping glaze bisa request warna. silahkan chat admin.png", },
  { id: "gallery-4", title: "Elegant Acrylic Dome", category: "Premium Packages", aspect: "3/4", image: "/assets/Akrilik frame mini - Rp 95.00000 - akrilik dome ukuran A5 standing lampu warna putih bisa request warna foto and tulisan.png", },
  { id: "gallery-5", title: "Fresh Flower White Sedap", category: "Fresh Flower", aspect: "1/1", image: "/assets/bunga white sedap - Rp 125.000,00 - 125ribu hanya bunga asli saja (10tangkai sedap malam & 10tangkai asteria).png", },
  { id: "gallery-6", title: "Big Rose Artificial", category: "Artificial Flower", aspect: "16/9", image: "/assets/Bunga Mawar Palsu Premium (ukuran Big) - Rp 250.000,00.png", },
];

export function getGalleryProjects(): GalleryProject[] {
  if (typeof window === "undefined") return defaultGalleryProjects;
  const cached = memoryCache[GALLERY_STORAGE_KEY];
  if (cached) return cached;
  return defaultGalleryProjects;
}

export async function setGalleryProjects(projects: GalleryProject[]): Promise<void> {
  if (typeof window === "undefined") return;
  const dataToSave = projects.map(p => ({ ...p, image: migrateLegacyAssetUrl(p.image) }));
  memoryCache[GALLERY_STORAGE_KEY] = dataToSave;
  saveToNeon("gallery_projects", dataToSave);
  window.dispatchEvent(new Event("galleryProjectsChanged"));
}
export function resetGalleryProjects(): void {
  if (typeof window === "undefined") return;
  memoryCache[GALLERY_STORAGE_KEY] = defaultGalleryProjects;
  saveToNeon("gallery_projects", defaultGalleryProjects);
  window.dispatchEvent(new Event("galleryProjectsChanged"));
}

const initialProducts: Product[] = generatedInitialProducts as any;
export const defaultProducts: Product[] = initialProducts.map((p) => ({ ...p, image: migrateLegacyAssetUrl(p.image), images: Array.from(new Set([...(Array.isArray((p as any).images) ? (p as any).images : []), p.image].filter(Boolean).map((item) => migrateLegacyAssetUrl(item as string)))), })).map((product) => enrichProductWithMatchedAssets(product));

export function getProducts(): Product[] {
  try {
    const cached = memoryCache[PRODUCTS_STORAGE_KEY];
    if (cached) return cached;
  } catch { }
  return mergeProductsByNameAndPrice(defaultProducts);
}

export async function saveProducts(prods: Product[]): Promise<void> {
  const dataToSave = mergeProductsByNameAndPrice(normalizeStoredProducts(prods as any[]));
  memoryCache[PRODUCTS_STORAGE_KEY] = dataToSave;
  saveToNeon("products", dataToSave);
  window.dispatchEvent(new Event("siteConfigChanged"));
}
export async function resetProducts() {
  const merged = mergeProductsByNameAndPrice(defaultProducts);
  memoryCache[PRODUCTS_STORAGE_KEY] = merged;
  await saveToNeon("products", merged);
  window.dispatchEvent(new Event("siteConfigChanged"));
}
export const products = defaultProducts;

export function getWhatsAppOrderLink(productName: string, price: string, adminIndex: number = 1): string {
  const config = getSiteConfig();
  const message = encodeURIComponent(`Halo ${config.businessName}! 🌸\n\nSaya tertarik untuk memesan:\n\n📦 Produk: ${productName}\n💰 Harga: ${price}\n\nBisa dibantu untuk proses pemesanannya? Terima kasih! 🙏`);
  const num = adminIndex === 2 && config.whatsappNumber2 ? config.whatsappNumber2 : config.whatsappNumber;
  return `https://wa.me/${num}?text=${message}`;
}

export function getWhatsAppLink(customMessage?: string, adminIndex: number = 1): string {
  const config = getSiteConfig();
  const message = encodeURIComponent(customMessage || `Halo ${config.businessName}! 🌸 Saya ingin bertanya tentang produk Anda.`);
  const num = adminIndex === 2 && config.whatsappNumber2 ? config.whatsappNumber2 : config.whatsappNumber;
  return `https://wa.me/${num}?text=${message}`;
}

export type VideoSource = "youtube" | "instagram" | "tiktok" | "file";
export type VideoOrientation = "vertical" | "horizontal" | "square";
export interface VideoItem { id: string; url: string; source: VideoSource; orientation: VideoOrientation; caption: string; thumbnail?: string; featured: boolean; }
export function detectVideoSource(url: string): VideoSource { if (/youtube\.com|youtu\.be/i.test(url)) return "youtube"; if (/instagram\.com/i.test(url)) return "instagram"; if (/tiktok\.com/i.test(url)) return "tiktok"; return "file"; }
export function getYouTubeEmbedUrl(url: string): string { const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([^?&/]+)/); if (match) return `https://www.youtube.com/embed/${match[1]}?autoplay=1&mute=1&loop=1&playlist=${match[1]}&controls=0&showinfo=0`; return url; }
export function getTikTokEmbedUrl(url: string): string { const match = url.match(/tiktok\.com\/@[^/]+\/video\/(\d+)/); if (match) return `https://www.tiktok.com/embed/v2/${match[1]}`; return url; }
export function getInstagramEmbedUrl(url: string): string { const match = url.match(/instagram\.com\/(?:p|reel|tv)\/([^/?]+)/); if (match) return `https://www.instagram.com/p/${match[1]}/embed/?hidecaption=true`; return url; }

export const defaultVideos: VideoItem[] = [
  { id: "v-1", url: "https://www.youtube.com/watch?v=AKEXXIh-244", source: "youtube", orientation: "horizontal", caption: "Behind the Scenes — Proses merangkai buket premium Ay Bucket 🌸", featured: true, },
  { id: "v-2", url: "https://www.youtube.com/shorts/-0SM7Ihvxyo", source: "youtube", orientation: "vertical", caption: "Tutorial Buket Satin (Layout Vertikal) 💐", featured: true, },
  { id: "v-3", url: "https://www.youtube.com/watch?v=mFlD1VNrIUg", source: "youtube", orientation: "horizontal", caption: "Ide Bisnis Rangkaian Bunga & Buket 💒", featured: true, },
  { id: "v-4", url: "https://www.youtube.com/shorts/_Wbq-ium2GE", source: "youtube", orientation: "vertical", caption: "Money Bouquet Tutorial (Layout Vertikal) 💰", featured: true, },
];

export function getVideos(): VideoItem[] { 
  try { 
    const cached = memoryCache[VIDEOS_STORAGE_KEY];
    if (cached) return cached;
  } catch { } 
  return defaultVideos; 
}
export async function saveVideos(vids: VideoItem[]): Promise<void> {
  memoryCache[VIDEOS_STORAGE_KEY] = vids;
  saveToNeon("videos", vids);
  window.dispatchEvent(new Event("siteConfigChanged"));
}

/**
 * Check if admin can still upload more images.
 * Cloud-based: always allowed (ImgBB handles images, Google Sheets stores URLs)
 */
export function canUploadImage(): { allowed: boolean; remainingImages: number; usagePercent: number } {
  return {
    allowed: true,
    remainingImages: 9999,
    usagePercent: 0,
  };
}
export function resetVideos() {
  memoryCache[VIDEOS_STORAGE_KEY] = defaultVideos;
  saveToNeon("videos", defaultVideos);
  window.dispatchEvent(new Event("siteConfigChanged"));
}
