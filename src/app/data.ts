// ==========================================
// AY BUCKET - KATALOG TERBARU 2026
// Instagram: @aybuket
// Premium Flower & Gift Arrangements
// ==========================================


import { generatedInitialProducts } from "./generated_products";
import { ALL_ASSET_PATHS } from "./asset_index";

// ---- BRANDING & LOGO ----
export const BRAND_LOGO = {
  name: "ay buket",
  tagline: "Wujudkan Hadiah Impianmu",
  whatsapp: "6282257827867",
  location: "Pertokoan pasar senenan Bangkalan",
  instagram: "@aybuket",
  logo: "/assets/ay-logo-5.png",
  canvaCatalog: "https://catalog-aybucket.my.canva.site/",
  canvaChocolate: "https://chocolate-bouquet-aybucket.my.canva.site/"
};

export function normalizeAssetUrl(url?: string): string {
  if (!url) return "";

  let normalized = String(url).trim().replace(/\\/g, "/");

  try {
    normalized = decodeURIComponent(normalized);
  } catch { }

  if (normalized.startsWith("/assets/")) {
    normalized = normalized.replace(/Rp /g, "Rp\u00A0");
  }

  // Ensure the URL is safe for use in <img src=> by encoding spaces and
  // other characters while preserving the path structure. Use `encodeURI`
  // so that slashes are not encoded.
  try {
    return encodeURI(normalized);
  } catch {
    return normalized;
  }
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
  return String(value || "")
    .toLowerCase()
    .replace(/\u00a0/g, " ")
    .replace(/%[0-9a-f]{2}/gi, " ")
    .replace(/[()\[\]{}.,:+\-_/\\]/g, " ")
    .replace(/\brp\b/g, " ")
    .replace(/\d+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const MATCH_STOP_WORDS = new Set([
  "rp", "dan", "untuk", "bisa", "yang", "dengan", "big", "small", "premium", "ukuran", "harga", "sewa", "jam", "hari", "item", "promo", "bunga", "bucket", "buket"
]);

function extractMatchKeywords(value: string): string[] {
  return normalizeForMatching(value)
    .split(" ")
    .filter((word) => word.length >= 3 && !MATCH_STOP_WORDS.has(word));
}

function scoreAssetForProduct(productName: string, assetPath: string): number {
  const keywords = extractMatchKeywords(productName);
  if (keywords.length === 0) return 0;

  const assetName = normalizeForMatching(assetPath.split("/").pop() || assetPath);
  let score = 0;
  for (const keyword of keywords) {
    if (assetName.includes(keyword)) score += 1;
  }

  if (/karangan bunga/i.test(productName) && assetName.includes("karangan") && assetName.includes("bunga")) {
    score += 2;
  }
  if (/standing akrilik/i.test(productName) && assetName.includes("akrilik")) {
    score += 1;
  }
  if (/selempang/i.test(productName) && assetName.includes("selempang")) {
    score += 2;
  }

  return score;
}

function findRelatedAssetPaths(productName: string): string[] {
  const keywords = extractMatchKeywords(productName);
  const minScore = keywords.length >= 4 ? 2 : 1;

  return ALL_ASSET_PATHS
    .map((assetPath) => ({
      assetPath,
      score: scoreAssetForProduct(productName, assetPath),
    }))
    .filter((entry) => entry.score >= minScore)
    .sort((a, b) => b.score - a.score || a.assetPath.length - b.assetPath.length)
    .map((entry) => migrateLegacyAssetUrl(entry.assetPath))
    .slice(0, 18);
}

function enrichProductWithMatchedAssets(product: Product): Product {
  const existingImages = (product.images || (product.image ? [product.image] : []))
    .filter(Boolean)
    .map((item) => migrateLegacyAssetUrl(item));
  const matchedAssets = findRelatedAssetPaths(product.name);
  const mergedImages = Array.from(new Set([...existingImages, ...matchedAssets]));

  return {
    ...product,
    image: mergedImages[0] || migrateLegacyAssetUrl(product.image) || "",
    images: mergedImages,
  };
}

function enrichProductsWithMatchedAssets(products: Product[]): Product[] {
  return products.map((product) => enrichProductWithMatchedAssets(product));
}

// ---- Admin Config Store (localStorage-based) ----
const ADMIN_STORAGE_KEY = "aybucket_admin_v1";

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
  heroFallbackImage: string;
  brandLogoUrl: string;
  mapsEmbedUrl: string;
  catalogLink: string;
  catalogLinkType: "wa" | "pdf" | "link";
  adminUsername?: string;
  adminPassword?: string;
}

const defaultConfig: SiteConfig = {
  businessName: "ay buket",
  tagline: "Wujudkan Hadiah Impianmu",
  year: "2026",
  address: "",
  whatsappNumber: "",
  whatsappDisplay: "",
  instagram: "@aybuket",
  tiktok: "",
  navLinks: [
    { to: "/", label: "Katalog" },
    { to: "/studio", label: "Tentang" },
    { to: "/contact", label: "Kontak" },
  ],
  footerText: "",
  heroTitle: "Buket Bunga Premium\nUntuk Setiap Momen",
  heroSubtitle: "Rangkaian bunga segar pilihan, snack bouquet unik, money bouquet eksklusif, dan vas cantik. Dibuat dengan perhatian penuh untuk moment spesial Anda.",
  heroFallbackImage: "/assets/Akrilik frame mini - Rp\u00A095.000,00 - akrilik dome ukuran A5 standing lampu warna putih, bisa request warna, foto & tulisan.png",
  brandLogoUrl: "/assets/ay-logo-5.png",
  mapsEmbedUrl: "",
  catalogLink: "",
  catalogLinkType: "wa",
  adminUsername: "admin",
  adminPassword: "admin123",
};

export function getSiteConfig(): SiteConfig {
  try {
    const stored = localStorage.getItem(ADMIN_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as Partial<SiteConfig>;
      const merged = { ...defaultConfig, ...parsed } as SiteConfig;
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
    const merged = {
      ...current,
      ...config,
      heroFallbackImage: migrateLegacyAssetUrl(config.heroFallbackImage ?? current.heroFallbackImage),
      brandLogoUrl: migrateLegacyAssetUrl(config.brandLogoUrl ?? current.brandLogoUrl ?? defaultConfig.brandLogoUrl),
    };
    localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(merged));
    window.dispatchEvent(new Event("siteConfigChanged"));
  } catch { }
}

export function resetSiteConfig() {
  localStorage.removeItem(ADMIN_STORAGE_KEY);
  window.dispatchEvent(new Event("siteConfigChanged"));
}

// Products stored in localStorage
const PRODUCTS_STORAGE_KEY = "aybucket_products_v1";
const CATEGORIES_STORAGE_KEY = "aybucket_categories_v1";

// Legacy compat
export const WHATSAPP_NUMBER = "";
export const WHATSAPP_DISPLAY = "";

export const businessInfo = {
  get name() { return getSiteConfig().businessName; },
  get tagline() { return getSiteConfig().tagline; },
  get year() { return getSiteConfig().year; },
  get address() { return getSiteConfig().address; },
  get whatsapp() { return getSiteConfig().whatsappNumber; },
  get whatsappDisplay() { return getSiteConfig().whatsappDisplay; },
  get instagram() { return getSiteConfig().instagram; },
  get tiktok() { return getSiteConfig().tiktok; },
  get catalogLink() { return getSiteConfig().catalogLink; },
  get catalogLinkType() { return getSiteConfig().catalogLinkType || "wa"; },
};

export function getCatalogWhatsAppLink(): string {
  const config = getSiteConfig();
  const link = config.catalogLink;
  if (!link || config.catalogLinkType !== "wa") return "";
  const message = encodeURIComponent(`Halo ${config.businessName}! 🌸\n\nSaya ingin melihat katalog produk Anda.`);
  return `https://wa.me/${link.replace(/[^0-9]/g, "")}?text=${message}`;
}

export type ProductCategory =
  | "buket-satin"
  | "snack-bouquet"
  | "money-bouquet"
  | "chocolate-bouquet"
  | "fresh-flower"
  | "artificial-flower"
  | "catalog-home"
  | "accessories"
  | "buckets"
  | "wreaths"
  | "packaging"
  | "ribbons"
  | "sewa";


export interface Category {
  key: ProductCategory;
  label: string;
  emoji: string;
  description: string;
  noted?: string;
  canvaLink?: string;
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  priceLabel: string;
  description?: string;
  image: string;
  images?: string[];
  tag?: string;
  variant?: string;
  isPromo?: boolean;
  originalPrice?: number;
  promoLabel?: string;
}

export function normalizeProductRecord(product: any): Product {
  const numericPrice = typeof product?.price === "number"
    ? product.price
    : parseInt(String(product?.price || 0).replace(/\D/g, ""), 10) || 0;
  const normalizedLabel = typeof product?.priceLabel === "string" && product.priceLabel.trim().length > 0
    ? (product.priceLabel.toLowerCase().includes("rp") ? product.priceLabel : formatRupiah(product.priceLabel))
    : formatRupiah(numericPrice);

  const images = Array.isArray(product?.images)
    ? product.images.filter(Boolean).map((item: string) => migrateLegacyAssetUrl(item))
    : product?.image
      ? [migrateLegacyAssetUrl(product.image)]
      : [];

  return {
    ...product,
    price: numericPrice,
    priceLabel: normalizedLabel,
    image: migrateLegacyAssetUrl(product?.image) || images[0] || "",
    images,
  } as Product;
}

export function normalizeStoredProducts(stored: any[]): Product[] {
  return stored.map((product) => normalizeProductRecord(product));
}

function toMergeableName(name: string | undefined): string {
  return String(name || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ");
}

function toMergeablePrice(product: Partial<Product>): number {
  if (typeof product.price === "number" && Number.isFinite(product.price)) return product.price;
  return parseInt(String(product.priceLabel || "").replace(/\D/g, ""), 10) || 0;
}

function getMergeKey(product: Partial<Product>): string {
  return `${toMergeableName(product.name)}::${toMergeablePrice(product)}`;
}

export function mergeProductsByNameAndPrice(products: Product[]): Product[] {
  const map = new Map<string, Product>();

  for (const product of products) {
    const key = getMergeKey(product);
    const incomingImages = (product.images || (product.image ? [product.image] : []))
      .filter(Boolean)
      .map((item) => migrateLegacyAssetUrl(item));

    if (!map.has(key)) {
      map.set(key, {
        ...product,
        image: migrateLegacyAssetUrl(product.image) || incomingImages[0] || "",
        images: Array.from(new Set(incomingImages)),
      });
      continue;
    }

    const existing = map.get(key)!;
    const existingImages = (existing.images || (existing.image ? [existing.image] : []))
      .filter(Boolean)
      .map((item) => migrateLegacyAssetUrl(item));

    const mergedImages = Array.from(new Set([...existingImages, ...incomingImages]));
    existing.images = mergedImages;
    existing.image = mergedImages[0] || existing.image || product.image;

    if ((!existing.description || existing.description.length < (product.description || "").length) && product.description) {
      existing.description = product.description;
    }
    if (!existing.tag && product.tag) existing.tag = product.tag;
    if (!existing.variant && product.variant) existing.variant = product.variant;
  }

  return Array.from(map.values());
}

export const categories: Category[] = [
  {
    key: "buket-satin",
    label: "Buket Satin",
    emoji: "💐",
    description: "Buket satin berkualitas tinggi dengan rangkaian bunga pilihan. Sempurna untuk berbagai momen spesial.",
    canvaLink: "https://catalog-aybucket.my.canva.site/buket-satin"
  },
  {
    key: "snack-bouquet",
    label: "Snack Bouquet",
    emoji: "🎁",
    description: "Kombinasi unik bunga dengan snack premium. Hadiah yang berkesan dan fungsional.",
    canvaLink: "https://catalog-aybucket.my.canva.site/snack-bouquet"
  },
  {
    key: "money-bouquet",
    label: "Money Bouquet",
    emoji: "💰",
    description: "Buket uang yang elegan untuk momen istimewa. Hadiah yang praktis dan berkesan.",
    canvaLink: "https://chocolate-bouquet-aybucket.my.canva.site/pricelist-money"
  },
  {
    key: "chocolate-bouquet",
    label: "Chocolate Bouquet",
    emoji: "🍫",
    description: "Bunga dengan cokelat premium berkualitas tinggi. Sempurna untuk gift istimewa.",
    canvaLink: "https://chocolate-bouquet-aybucket.my.canva.site/"
  },
  {
    key: "fresh-flower",
    label: "Fresh Flower",
    emoji: "🌹",
    description: "Rangkaian bunga segar pilihan terbaik dengan berbagai kombinasi warna.",
    canvaLink: "https://chocolate-bouquet-aybucket.my.canva.site/fresh-flowe"
  },
  {
    key: "artificial-flower",
    label: "Artificial Flower",
    emoji: "✨",
    description: "Rangkaian bunga artificial premium yang awet dan elegan.",
    canvaLink: "https://catalog-aybucket.my.canva.site/vase"
  },
  {
    key: "catalog-home",
    label: "Premium Packages",
    emoji: "👑",
    description: "Paket premium untuk acara spesial dan kebutuhan khusus.",
    canvaLink: "https://catalog-aybucket.my.canva.site/"
  },
  // add simple categories for generated assets
  { key: "accessories", label: "Accessories", emoji: "🧾", description: "Aksesoris & perlengkapan pelengkap." },
  { key: "buckets", label: "Buckets", emoji: "🪣", description: "Bucket & rangkaian berukuran sedang hingga besar." },
  { key: "wreaths", label: "Wreaths", emoji: "🌿", description: "Karangan bunga & papan ucapan." },
  { key: "packaging", label: "Packaging", emoji: "🎁", description: "Layanan packaging premium dan aksesoris hadiah." },
  { key: "ribbons", label: "Ribbons & Sashes", emoji: "🎗️", description: "Selempang & pita khusus acara." },
  { key: "sewa", label: "Sewa (Rental)", emoji: "⏱️", description: "Layanan sewa per jam untuk standing dan dekorasi acara." },
];

// ============================================
// GALLERY PROJECTS - Admin Customizable
// ============================================
export interface GalleryProject {
  id: string;
  title: string;
  category: string;
  aspect: "3/4" | "1/1" | "16/9";
  image: string;
}

const GALLERY_STORAGE_KEY = "aybucket_gallery_v1";

export const defaultGalleryProjects: GalleryProject[] = [
  {
    id: "gallery-1",
    title: "Buket Satin Collection",
    category: "Buket Satin",
    aspect: "3/4",
    image: "/assets/Buket Bunga Asli Premium - Rp\u00A0350.000,00.png",
  },
  {
    id: "gallery-2",
    title: "Money Bouquet Premium",
    category: "Money Bouquet",
    aspect: "1/1",
    image: "/assets/Mawar Candy (Bunga Asli) - Rp\u00A0170.000,00.png",
  },
  {
    id: "gallery-3",
    title: "Snack Bouquet Unik",
    category: "Snack Bouquet",
    aspect: "16/9",
    image: "/assets/Donat buket tart - Rp\u00A0100.000,00 - isi 7 donat bomboloni isi coklat topping glaze, bisa request warna. silahkan chat admin.png",
  },
  {
    id: "gallery-4",
    title: "Fresh Flower Arrangement",
    category: "Fresh Flower",
    aspect: "3/4",
    image: "/assets/Akrilik frame mini - Rp\u00A095.000,00 - akrilik dome ukuran A5 standing lampu warna putih, bisa request warna, foto & tulisan.png",
  },
  {
    id: "gallery-5",
    title: "Chocolate Bouquet Premium",
    category: "Chocolate Bouquet",
    aspect: "1/1",
    image: "/assets/Bunga Mawar Medium - Rp\u00A0100.000,00 - Bunga mawar asli, isi 7tangkai mekar + tambahan kain salju 20.000 (120.000).png",
  },
  {
    id: "gallery-6",
    title: "Artificial Flower Collection",
    category: "Artificial Flower",
    aspect: "16/9",
    image: "/assets/Bunga Mawar Palsu Premium (ukuran Big) - Rp\u00A0250.000,00.png",
  },
];

export function getGalleryProjects(): GalleryProject[] {
  if (typeof window === "undefined") return defaultGalleryProjects;
  const stored = localStorage.getItem(GALLERY_STORAGE_KEY);
  if (!stored) return defaultGalleryProjects;
  try {
    const parsed = JSON.parse(stored) as GalleryProject[];
    const normalized = parsed.map((item) => ({
      ...item,
      image: migrateLegacyAssetUrl(item.image),
    }));
    return normalized.map((item, index) => ({
      ...item,
      image: item.image || defaultGalleryProjects[index % defaultGalleryProjects.length].image,
    }));
  } catch {
    return defaultGalleryProjects;
  }
}

export function setGalleryProjects(projects: GalleryProject[]): void {
  if (typeof window === "undefined") return;
  const normalized = projects.map((item) => ({
    ...item,
    image: migrateLegacyAssetUrl(item.image),
  }));
  localStorage.setItem(GALLERY_STORAGE_KEY, JSON.stringify(normalized));
  window.dispatchEvent(new Event("galleryProjectsChanged"));
}

export function resetGalleryProjects(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(GALLERY_STORAGE_KEY);
  window.dispatchEvent(new Event("galleryProjectsChanged"));
}

const initialProducts: Product[] = generatedInitialProducts as any;

export const defaultProducts: Product[] = initialProducts.map((p) => ({
  ...p,
  image: migrateLegacyAssetUrl(p.image),
  images: Array.from(new Set([
    ...(Array.isArray((p as any).images) ? (p as any).images : []),
    p.image,
  ].filter(Boolean).map((item) => migrateLegacyAssetUrl(item as string)))),
})).map((product) => enrichProductWithMatchedAssets(product));

export function getProducts(): Product[] {
  try {
    const stored = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (stored) {
      const parsed: any[] = JSON.parse(stored);
      const normalized = normalizeStoredProducts(parsed);
      const merged = enrichProductsWithMatchedAssets(mergeProductsByNameAndPrice(normalized));
      const migrated = JSON.stringify(parsed) !== JSON.stringify(merged);
      if (migrated) {
        try {
          localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(merged));
        } catch { }
      }
      return merged as Product[];
    }
  } catch { }
  return mergeProductsByNameAndPrice(defaultProducts);
}

export function saveProducts(prods: Product[]) {
  const normalized = normalizeStoredProducts(prods as any[]);
  const merged = enrichProductsWithMatchedAssets(mergeProductsByNameAndPrice(normalized));
  localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(merged));
  window.dispatchEvent(new Event("siteConfigChanged"));
}

export function resetProducts() {
  localStorage.removeItem(PRODUCTS_STORAGE_KEY);
  window.dispatchEvent(new Event("siteConfigChanged"));
}

// alias for backward compat
export const products = defaultProducts;

// Helper function to generate WhatsApp order link
export function getWhatsAppOrderLink(productName: string, price: string): string {
  const config = getSiteConfig();
  const message = encodeURIComponent(
    `Halo ${config.businessName}! 🌸\n\nSaya tertarik untuk memesan:\n\n📦 Produk: ${productName}\n💰 Harga: ${price}\n\nBisa dibantu untuk proses pemesanannya? Terima kasih! 🙏`
  );
  return `https://wa.me/${config.whatsappNumber}?text=${message}`;
}

export function getWhatsAppLink(customMessage?: string): string {
  const config = getSiteConfig();
  const message = encodeURIComponent(
    customMessage || `Halo ${config.businessName}! 🌸 Saya ingin bertanya tentang produk Anda.`
  );
  return `https://wa.me/${config.whatsappNumber}?text=${message}`;
}

// ---- Video Gallery ----
const VIDEOS_STORAGE_KEY = "aybucket_videos_v1";

export type VideoSource = "youtube" | "instagram" | "tiktok" | "file";
export type VideoOrientation = "vertical" | "horizontal" | "square";

export interface VideoItem {
  id: string;
  url: string;
  source: VideoSource;
  orientation: VideoOrientation;
  caption: string;
  thumbnail?: string;
  featured: boolean;
}

export function detectVideoSource(url: string): VideoSource {
  if (/youtube\.com|youtu\.be/i.test(url)) return "youtube";
  if (/instagram\.com/i.test(url)) return "instagram";
  if (/tiktok\.com/i.test(url)) return "tiktok";
  return "file";
}

export function getYouTubeEmbedUrl(url: string): string {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([^?&/]+)/);
  if (match) return `https://www.youtube.com/embed/${match[1]}?autoplay=1&mute=1&loop=1&playlist=${match[1]}&controls=0&showinfo=0`;
  return url;
}

export function getTikTokEmbedUrl(url: string): string {
  const match = url.match(/tiktok\.com\/@[^/]+\/video\/(\d+)/);
  if (match) return `https://www.tiktok.com/embed/v2/${match[1]}`;
  return url;
}

export function getInstagramEmbedUrl(url: string): string {
  const match = url.match(/instagram\.com\/(?:p|reel|tv)\/([^/?]+)/);
  if (match) return `https://www.instagram.com/p/${match[1]}/embed/?hidecaption=true`;
  return url;
}

export const defaultVideos: VideoItem[] = [
  {
    id: "v-1",
    url: "https://www.youtube.com/watch?v=AKEXXIh-244",
    source: "youtube",
    orientation: "horizontal",
    caption: "Behind the Scenes — Proses merangkai buket premium Ay Bucket 🌸",
    featured: true,
  },
  {
    id: "v-2",
    url: "https://www.youtube.com/shorts/-0SM7Ihvxyo",
    source: "youtube",
    orientation: "vertical",
    caption: "Tutorial Buket Satin (Layout Vertikal) 💐",
    featured: true,
  },
  {
    id: "v-3",
    url: "https://www.youtube.com/watch?v=mFlD1VNrIUg",
    source: "youtube",
    orientation: "horizontal",
    caption: "Ide Bisnis Rangkaian Bunga & Buket 💒",
    featured: true,
  },
  {
    id: "v-4",
    url: "https://www.youtube.com/shorts/_Wbq-ium2GE",
    source: "youtube",
    orientation: "vertical",
    caption: "Money Bouquet Tutorial (Layout Vertikal) 💰",
    featured: true,
  },
];

export function getVideos(): VideoItem[] {
  try {
    const stored = localStorage.getItem(VIDEOS_STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch { }
  return defaultVideos;
}

export function saveVideos(vids: VideoItem[]) {
  localStorage.setItem(VIDEOS_STORAGE_KEY, JSON.stringify(vids));
  window.dispatchEvent(new Event("siteConfigChanged"));
}

export function resetVideos() {
  localStorage.removeItem(VIDEOS_STORAGE_KEY);
  window.dispatchEvent(new Event("siteConfigChanged"));
}
