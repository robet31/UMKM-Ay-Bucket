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
  location: "Pertokoan pasar senenan Bangkalan",
  instagram: "@ay.bucket",
  logo: "/assets/ay-logo-5.png",
};

// Storage Keys
const CONFIG_STORAGE_KEY = "aybucket_config_v1";
const ADMIN_STORAGE_KEY = "aybucket_config_v1"; // Consolidated
const PRODUCTS_STORAGE_KEY = "aybucket_products_v1";
const VIDEOS_STORAGE_KEY = "aybucket_videos_v1";
const GALLERY_STORAGE_KEY = "aybucket_gallery_v1";

export type AllowedKey = "site_config" | "products" | "videos" | "gallery_projects";

// Neon API Configuration
export const NEON_API_URL = (import.meta as any).env?.VITE_NEON_API_URL || '/api/config';

export function normalizeAssetUrl(url?: string): string {
  if (!url) return "";
  let normalized = String(url).trim().replace(/\\/g, "/");
  try { normalized = decodeURIComponent(normalized); } catch { }
  if (normalized.startsWith("/assets/")) {
    normalized = normalized.replace(/Rp /g, "Rp\u00A0");
  }
  try { return encodeURI(normalized); } catch { return normalized; }
}

function migrateLegacyAssetUrl(url?: string): string {
  const normalized = normalizeAssetUrl(url);
  if (!normalized) return "";
  const legacyMap: Record<string, string> = {
    "/assets/buket-satin-rp20000-item-01.jpg": "/assets/Buket Bunga Asli Premium - Rp\u00A0350.000,00.png",
    "/assets/money-bouquet-rp50000-item-01.jpg": "/assets/Mawar Candy (Bunga Asli) - Rp\u00A0170.000,00.png",
    "/assets/snack-bouquet-rp35000-item-01.jpg": "/assets/Donat buket tart - Rp\u00A0100.000,00 - isi 7 donat bomboloni isi coklat topping glaze, bisa request warna. silahkan chat admin.png",
    "/assets/catalog-home-rp150000-item-02.jpg": "/assets/Akrilik frame mini - Rp\u00A095.000,00 - akrilik dome ukuran A5 standing lampu warna putih, bisa request warna, foto & tulisan.png",
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
  address: "Pertokoan pasar senenan Bangkalan",
  whatsappNumber: "6285880021020",
  whatsappDisplay: "0858-8002-1020",
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
  heroFallbackImage: "/assets/Buket Bunga Asli Premium - Rp\u00A0350.000,00.png",
  heroSettings: [],
  brandLogoUrl: "/assets/ay-logo-5.png",
  mapsEmbedUrl: "https://maps.google.com/maps?q=Pertokoan+Pasar+Senenan+Bangkalan&t=&z=15&ie=UTF8&iwloc=&output=embed",
  catalogLink: "6285880021020",
  catalogLinkType: "wa",
  adminUsername: "admin",
  adminPassword: "AyBucket2026!",
};

export async function fetchFromNeon(key: AllowedKey): Promise<any | null> {
  try {
    const res = await fetch(NEON_API_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'get', key }), });
    const data = await res.json();
    return data.success ? data.data : null;
  } catch (e) { console.error(`Failed to fetch ${key}:`, e); return null; }
}

export async function saveToNeon(key: AllowedKey, data: any): Promise<boolean> {
  try {
    const res = await fetch(NEON_API_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'set', key, data }), });
    const result = await res.json();
    return result.success;
  } catch (e) { console.error(`Failed to save ${key}:`, e); return false; }
}

export const fetchSiteConfigFromNeon = () => fetchFromNeon('site_config');
export const saveSiteConfigToNeon = (config: any) => saveToNeon('site_config', config);
export const isProduction = (import.meta as any).env?.PROD === 'true' || (import.meta as any).env?.VITE_VERCEL === '1';

export async function syncAllWithNeon(): Promise<boolean> {
  if (!isProduction) return false;
  try {
    const res = await fetch(NEON_API_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'get_bundle' }), });
    const result = await res.json();
    if (result.success && result.data) {
      const { site_config, products, videos, gallery_projects } = result.data;
      if (site_config) localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(site_config));
      if (products) localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
      if (videos) localStorage.setItem(VIDEOS_STORAGE_KEY, JSON.stringify(videos));
      if (gallery_projects) localStorage.setItem(GALLERY_STORAGE_KEY, JSON.stringify(gallery_projects));
      window.dispatchEvent(new Event("siteConfigChanged"));
      window.dispatchEvent(new Event("galleryProjectsChanged"));
      return true;
    }
  } catch (e) { console.error('Global sync failed:', e); }
  return false;
}

export async function getSiteConfigWithNeon(): Promise<SiteConfig> {
  if (isProduction) {
    const remote = await fetchSiteConfigFromNeon();
    if (remote) { localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(remote)); return { ...defaultConfig, ...remote } as SiteConfig; }
  }
  return getSiteConfig();
}

export function getSiteConfig(): SiteConfig {
  try {
    const stored = localStorage.getItem(ADMIN_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as Partial<SiteConfig>;
      const merged = { ...defaultConfig, ...parsed } as SiteConfig;
      
      // Migration: Convert comma-separated heroFallbackImage to |SEP| if it contains data URLs or multiple items
      if (merged.heroFallbackImage && !merged.heroFallbackImage.includes("|SEP|")) {
        const value = merged.heroFallbackImage;
        // If it starts with data: and has multiple commas, it's likely a list
        if (value.includes("data:") && (value.match(/,/g) || []).length > 1) {
           // This is tricky to split accurately by comma if data URLs are involved,
           // but since we only supported max 3 images, we can try to find 'data:' prefixes
           const parts = value.split(/,(?=data:)/);
           merged.heroFallbackImage = parts.join("|SEP|");
        } else if (!value.includes("data:") && value.includes(",")) {
           // Regular URLs separated by comma
           merged.heroFallbackImage = value.split(",").join("|SEP|");
        }
      }

      merged.heroFallbackImage = migrateLegacyAssetUrl(merged.heroFallbackImage);
      merged.brandLogoUrl = migrateLegacyAssetUrl(merged.brandLogoUrl || defaultConfig.brandLogoUrl);
      if (!merged.adminUsername) merged.adminUsername = "admin";
      if (!merged.adminPassword || merged.adminPassword === "aybucket") merged.adminPassword = "admin123";
      return merged;
    }
  } catch { }
  return defaultConfig;
}

export function formatRupiah(value: number | string): string {
  const parsed = typeof value === "number" ? value : parseInt(String(value).replace(/\D/g, ""), 10);
  const amount = Number.isFinite(parsed) ? parsed : 0;
  return `Rp ${amount.toLocaleString("id-ID")}`;
}

export function saveSiteConfig(config: Partial<SiteConfig>) {
  try {
    const current = getSiteConfig();
    const merged = { ...current, ...config, heroFallbackImage: migrateLegacyAssetUrl(config.heroFallbackImage ?? current.heroFallbackImage), brandLogoUrl: migrateLegacyAssetUrl(config.brandLogoUrl ?? current.brandLogoUrl ?? defaultConfig.brandLogoUrl), };
    localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(merged));
    if (isProduction && typeof fetch !== 'undefined') { saveSiteConfigToNeon(merged).catch(console.error); }
    window.dispatchEvent(new Event("siteConfigChanged"));
  } catch { }
}

export function resetSiteConfig() { localStorage.removeItem(ADMIN_STORAGE_KEY); window.dispatchEvent(new Event("siteConfigChanged")); }

export type ProductCategory = "buket-satin" | "snack-bouquet" | "money-bouquet" | "chocolate-bouquet" | "fresh-flower" | "artificial-flower" | "catalog-home" | "accessories" | "buckets" | "wreaths" | "packaging" | "ribbons" | "sewa";

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

export const categories: Category[] = [
  { key: "buckets", label: "Buket Bunga Premium", emoji: "🌸", description: "Rangkaian bunga segar (Fresh) & bunga palsu (Artificial) berkualitas tinggi.", noted: "Bisa request warna bunga & kain pembungkus (wrapping)." },
  { key: "snack-bouquet", label: "Snack & Food Bouquet", emoji: "🍭", description: "Pilihan hadiah unik dengan susunan snack, cokelat, hingga donat favorit.", noted: "Isian snack bisa disesuaikan dengan budget Anda." },
  { key: "money-bouquet", label: "Money Bouquet", emoji: "💸", description: "Hadiah eksklusif berupa buket uang dengan dekorasi bunga yang cantik.", noted: "Jumlah & nominal uang bisa dicustom sesuai keinginan." },
  { key: "wreaths", label: "Bunga Papan & Standing", emoji: "🌿", description: "Karangan bunga papan & standing akrilik untuk segala ucapan acara resmi.", noted: "Gratis ongkir untuk wilayah tertentu (Kamal & Telang)." },
  { key: "accessories", label: "Gift & Accessories", emoji: "✨", description: "Koleksi hadiah pelengkap seperti selempang wisuda, frame akrilik, dan gift box.", noted: "Pengerjaan cepat & hasil rapi." },
  { key: "fresh-flower", label: "Bunga Segar (Fresh)", emoji: "🌹", description: "Rangkaian bunga mawar, sedap malam, dan asteria yang segar & harum.", noted: "Disarankan pesan H-1 untuk menjaga kesegaran maksimal." },
  { key: "artificial-flower", label: "Bunga Artificial", emoji: "🌼", description: "Rangkaian bunga tiruan premium yang awet dan tetap indah selamanya.", noted: "Sangat cocok untuk pajangan rumah atau hadiah jangka panjang." },
  { key: "sewa", label: "Sewa (Rental)", emoji: "⏱️", description: "Layanan sewa per jam untuk standing dan dekorasi acara.", noted: "Tersedia paket 3 jam, 12 jam, hingga 24 jam." }
];

export interface GalleryProject { id: string; title: string; category: string; aspect: "3/4" | "1/1" | "16/9"; image: string; }

export const defaultGalleryProjects: GalleryProject[] = [
  { id: "gallery-1", title: "Premium Satin Bouquet", category: "Buket Satin", aspect: "3/4", image: "/assets/Round Pita Satin - Rp\u00A0100.000,00.png", },
  { id: "gallery-2", title: "Exclusive Money Bouquet", category: "Money Bouquet", aspect: "1/1", image: "/assets/Mawar Candy (Bunga Asli) - Rp\u00A0170.000,00.png", },
  { id: "gallery-3", title: "Creative Donut Tart", category: "Snack Bouquet", aspect: "16/9", image: "/assets/Donat buket tart - Rp\u00A0100.000,00 - isi 7 donat bomboloni isi coklat topping glaze, bisa request warna. silahkan chat admin.png", },
  { id: "gallery-4", title: "Elegant Acrylic Dome", category: "Premium Packages", aspect: "3/4", image: "/assets/Akrilik frame mini - Rp\u00A095.000,00 - akrilik dome ukuran A5 standing lampu warna putih, bisa request warna, foto & tulisan.png", },
  { id: "gallery-5", title: "Fresh Flower White Sedap", category: "Fresh Flower", aspect: "1/1", image: "/assets/bunga white sedap - Rp\u00A0125.000,00 - 125ribu hanya bunga asli saja (10tangkai sedap malam & 10tangkai asteria).png", },
  { id: "gallery-6", title: "Big Rose Artificial", category: "Artificial Flower", aspect: "16/9", image: "/assets/Bunga Mawar Palsu Premium (ukuran Big) - Rp\u00A0250.000,00.png", },
];

export function getGalleryProjects(): GalleryProject[] {
  if (typeof window === "undefined") return defaultGalleryProjects;
  const stored = localStorage.getItem(GALLERY_STORAGE_KEY);
  if (!stored) return defaultGalleryProjects;
  try {
    const parsed = JSON.parse(stored) as GalleryProject[];
    return parsed.map((item, index) => ({ ...item, image: migrateLegacyAssetUrl(item.image) || defaultGalleryProjects[index % defaultGalleryProjects.length].image, }));
  } catch { return defaultGalleryProjects; }
}

export function setGalleryProjects(projects: GalleryProject[]): void { if (typeof window === "undefined") return; localStorage.setItem(GALLERY_STORAGE_KEY, JSON.stringify(projects.map(p => ({ ...p, image: migrateLegacyAssetUrl(p.image) })))); window.dispatchEvent(new Event("galleryProjectsChanged")); }
export function resetGalleryProjects(): void { if (typeof window === "undefined") return; localStorage.removeItem(GALLERY_STORAGE_KEY); window.dispatchEvent(new Event("galleryProjectsChanged")); }

const initialProducts: Product[] = generatedInitialProducts as any;
export const defaultProducts: Product[] = initialProducts.map((p) => ({ ...p, image: migrateLegacyAssetUrl(p.image), images: Array.from(new Set([...(Array.isArray((p as any).images) ? (p as any).images : []), p.image].filter(Boolean).map((item) => migrateLegacyAssetUrl(item as string)))), })).map((product) => enrichProductWithMatchedAssets(product));

export function getProducts(): Product[] {
  try {
    const stored = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (stored) {
      const parsed: any[] = JSON.parse(stored);
      const merged = enrichProductsWithMatchedAssets(mergeProductsByNameAndPrice(normalizeStoredProducts(parsed)));
      return merged as Product[];
    }
  } catch { }
  return mergeProductsByNameAndPrice(defaultProducts);
}

export function saveProducts(prods: Product[]) { localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(enrichProductsWithMatchedAssets(mergeProductsByNameAndPrice(normalizeStoredProducts(prods as any[]))))); window.dispatchEvent(new Event("siteConfigChanged")); }
export function resetProducts() { localStorage.removeItem(PRODUCTS_STORAGE_KEY); window.dispatchEvent(new Event("siteConfigChanged")); }
export const products = defaultProducts;

export function getWhatsAppOrderLink(productName: string, price: string): string {
  const config = getSiteConfig();
  const message = encodeURIComponent(`Halo ${config.businessName}! 🌸\n\nSaya tertarik untuk memesan:\n\n📦 Produk: ${productName}\n💰 Harga: ${price}\n\nBisa dibantu untuk proses pemesanannya? Terima kasih! 🙏`);
  return `https://wa.me/${config.whatsappNumber}?text=${message}`;
}

export function getWhatsAppLink(customMessage?: string): string {
  const config = getSiteConfig();
  const message = encodeURIComponent(customMessage || `Halo ${config.businessName}! 🌸 Saya ingin bertanya tentang produk Anda.`);
  return `https://wa.me/${config.whatsappNumber}?text=${message}`;
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

export function getVideos(): VideoItem[] { try { const stored = localStorage.getItem(VIDEOS_STORAGE_KEY); if (stored) return JSON.parse(stored); } catch { } return defaultVideos; }
export function saveVideos(vids: VideoItem[]) { localStorage.setItem(VIDEOS_STORAGE_KEY, JSON.stringify(vids)); window.dispatchEvent(new Event("siteConfigChanged")); }
export function resetVideos() { localStorage.removeItem(VIDEOS_STORAGE_KEY); window.dispatchEvent(new Event("siteConfigChanged")); }
