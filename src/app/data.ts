// ==========================================
// EL BOUQUET - KATALOG TERBARU 2026
// Instagram: @elbouket
// Premium Flower & Gift Arrangements
// ==========================================

// ---- BRANDING & LOGO ----
export const BRAND_LOGO = {
  name: "El Bouquet",
  tagline: "Elegant Flowers & Premium Gifts",
  whatsapp: "6282257827867",
  location: "Pertokoan pasar senenan Bangkalan",
  instagram: "@elbouket",
  canvaCatalog: "https://catalog-elbouket.my.canva.site/",
  canvaChocolate: "https://chocolate-bouquet-elbouket.my.canva.site/"
};

// ---- Admin Config Store (localStorage-based) ----
const ADMIN_STORAGE_KEY = "elbouquet_admin_v1";

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
  mapsEmbedUrl: string;
  adminPassword?: string;
}

const defaultConfig: SiteConfig = {
  businessName: "El Bouquet",
  tagline: "Elegant Flowers & Premium Gifts",
  year: "2026",
  address: "",
  whatsappNumber: "",
  whatsappDisplay: "",
  instagram: "@elbouket",
  tiktok: "",
  navLinks: [
    { to: "/", label: "Katalog" },
    { to: "/studio", label: "Tentang" },
    { to: "/contact", label: "Kontak" },
  ],
  footerText: "",
  heroTitle: "Buket Bunga Premium\nUntuk Setiap Momen",
  heroSubtitle: "Rangkaian bunga segar pilihan, snack bouquet unik, money bouquet eksklusif, dan vas cantik. Dibuat dengan perhatian penuh untuk moment spesial Anda.",
  mapsEmbedUrl: "",
  adminPassword: "elbouquet",
};

export function getSiteConfig(): SiteConfig {
  try {
    const stored = localStorage.getItem(ADMIN_STORAGE_KEY);
    if (stored) return { ...defaultConfig, ...JSON.parse(stored) };
  } catch {}
  return defaultConfig;
}

export function saveSiteConfig(config: Partial<SiteConfig>) {
  try {
    const current = getSiteConfig();
    const merged = { ...current, ...config };
    localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(merged));
    window.dispatchEvent(new Event("siteConfigChanged"));
  } catch {}
}

export function resetSiteConfig() {
  localStorage.removeItem(ADMIN_STORAGE_KEY);
  window.dispatchEvent(new Event("siteConfigChanged"));
}

// Products stored in localStorage
const PRODUCTS_STORAGE_KEY = "elbouquet_products_v1";
const CATEGORIES_STORAGE_KEY = "elbouquet_categories_v1";

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
};

export type ProductCategory =
  | "buket-satin"
  | "snack-bouquet"
  | "money-bouquet"
  | "chocolate-bouquet"
  | "fresh-flower"
  | "artificial-flower"
  | "catalog-home";

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
}

export function normalizeProductRecord(product: any): Product {
  const images = Array.isArray(product?.images)
    ? product.images.filter(Boolean)
    : product?.image
      ? [product.image]
      : [];

  return {
    ...product,
    image: product?.image || images[0] || "",
    images,
  } as Product;
}

export function normalizeStoredProducts(stored: any[]): Product[] {
  return stored.map((product) => normalizeProductRecord(product));
}

export const categories: Category[] = [
  { 
    key: "buket-satin", 
    label: "Buket Satin", 
    emoji: "💐", 
    description: "Buket satin berkualitas tinggi dengan rangkaian bunga pilihan. Sempurna untuk berbagai momen spesial.",
    canvaLink: "https://catalog-elbouket.my.canva.site/buket-satin"
  },
  { 
    key: "snack-bouquet", 
    label: "Snack Bouquet", 
    emoji: "🎁", 
    description: "Kombinasi unik bunga dengan snack premium. Hadiah yang berkesan dan fungsional.",
    canvaLink: "https://catalog-elbouket.my.canva.site/snack-bouquet"
  },
  { 
    key: "money-bouquet", 
    label: "Money Bouquet", 
    emoji: "💰", 
    description: "Buket uang yang elegan untuk momen istimewa. Hadiah yang praktis dan bersesan.",
    canvaLink: "https://chocolate-bouquet-elbouket.my.canva.site/pricelist-money"
  },
  { 
    key: "chocolate-bouquet", 
    label: "Chocolate Bouquet", 
    emoji: "🍫", 
    description: "Bunga dengan cokelat premium berkualitas tinggi. Sempurna untuk gift istimewa.",
    canvaLink: "https://chocolate-bouquet-elbouket.my.canva.site/"
  },
  { 
    key: "fresh-flower", 
    label: "Fresh Flower", 
    emoji: "🌹", 
    description: "Rangkaian bunga segar pilihan terbaik dengan berbagai kombinasi warna.",
    canvaLink: "https://chocolate-bouquet-elbouket.my.canva.site/fresh-flowe"
  },
  { 
    key: "artificial-flower", 
    label: "Artificial Flower", 
    emoji: "✨", 
    description: "Rangkaian bunga artificial premium yang awet dan elegan.",
    canvaLink: "https://catalog-elbouket.my.canva.site/vase"
  },
  { 
    key: "catalog-home", 
    label: "Premium Packages", 
    emoji: "👑", 
    description: "Paket premium untuk acara spesial dan kebutuhan khusus.",
    canvaLink: "https://catalog-elbouket.my.canva.site/"
  },
];

const initialProducts: Product[] = [
  // ======= BUKET SATIN (4 items @ Rp 20.000) =======
  { id: "bs-01", name: "Buket Satin Style 1", category: "buket-satin", price: 20000, priceLabel: "Rp 20.000", image: "/assets/buket-satin-rp20000-item-01.jpg" },
  { id: "bs-02", name: "Buket Satin Style 2", category: "buket-satin", price: 20000, priceLabel: "Rp 20.000", image: "/assets/buket-satin-rp20000-item-02.jpg", tag: "Populer" },
  { id: "bs-03", name: "Buket Satin Style 3", category: "buket-satin", price: 20000, priceLabel: "Rp 20.000", image: "/assets/buket-satin-rp20000-item-03.jpg" },
  { id: "bs-04", name: "Buket Satin Style 4", category: "buket-satin", price: 20000, priceLabel: "Rp 20.000", image: "/assets/buket-satin-rp20000-item-03.jpg" },

  // ======= SNACK BOUQUET (2 items @ Rp 35.000) =======
  { id: "sb-01", name: "Snack Bouquet Deluxe", category: "snack-bouquet", price: 35000, priceLabel: "Rp 35.000", image: "/assets/snack-bouquet-rp35000-item-01.jpg", tag: "Unik" },
  { id: "sb-02", name: "Snack Bouquet Premium", category: "snack-bouquet", price: 35000, priceLabel: "Rp 35.000", image: "/assets/snack-bouquet-rp35000-item-01.jpg", tag: "Best Seller" },

  // ======= MONEY BOUQUET (9 items @ Rp 50.000) =======
  { id: "mb-01", name: "Money Bouquet Type 1", category: "money-bouquet", price: 50000, priceLabel: "Rp 50.000", image: "/assets/money-bouquet-rp50000-item-01.jpg" },
  { id: "mb-02", name: "Money Bouquet Type 2", category: "money-bouquet", price: 50000, priceLabel: "Rp 50.000", image: "/assets/money-bouquet-rp50000-item-02.jpg" },
  { id: "mb-03", name: "Money Bouquet Type 3", category: "money-bouquet", price: 50000, priceLabel: "Rp 50.000", image: "/assets/money-bouquet-rp50000-item-03.jpg" },
  { id: "mb-04", name: "Money Bouquet Type 4", category: "money-bouquet", price: 50000, priceLabel: "Rp 50.000", image: "/assets/money-bouquet-rp50000-item-04.jpg", tag: "Favorit" },
  { id: "mb-05", name: "Money Bouquet Type 5", category: "money-bouquet", price: 50000, priceLabel: "Rp 50.000", image: "/assets/money-bouquet-rp50000-item-05.png" },
  { id: "mb-06", name: "Money Bouquet Type 6", category: "money-bouquet", price: 50000, priceLabel: "Rp 50.000", image: "/assets/money-bouquet-rp50000-item-06.jpg", tag: "🔥 Terlaris" },
  { id: "mb-07", name: "Money Bouquet Type 7", category: "money-bouquet", price: 50000, priceLabel: "Rp 50.000", image: "/assets/money-bouquet-rp50000-item-07.png" },
  { id: "mb-08", name: "Money Bouquet Type 8", category: "money-bouquet", price: 50000, priceLabel: "Rp 50.000", image: "/assets/money-bouquet-rp50000-item-08.jpg" },
  { id: "mb-09", name: "Money Bouquet Type 9", category: "money-bouquet", price: 50000, priceLabel: "Rp 50.000", image: "/assets/money-bouquet-rp50000-item-09.png", tag: "Premium" },

  // ======= CHOCOLATE BOUQUET (2 items @ Rp 20.000) =======
  { id: "cb-01", name: "Chocolate Bouquet Classic", category: "chocolate-bouquet", price: 20000, priceLabel: "Rp 20.000", image: "/assets/chocolate-bouquet-rp20000-item-01.jpg" },
  { id: "cb-02", name: "Chocolate Bouquet Premium", category: "chocolate-bouquet", price: 20000, priceLabel: "Rp 20.000", image: "/assets/chocolate-bouquet-rp20000-item-01.jpg", tag: "Best Seller" },

  // ======= FRESH FLOWER (2 items @ Rp 30.000) =======
  { id: "ff-01", name: "Fresh Flower Arrangement", category: "fresh-flower", price: 30000, priceLabel: "Rp 30.000", image: "/assets/fresh-flower-rp30000-item-01.jpg" },
  { id: "ff-02", name: "Fresh Flower Premium", category: "fresh-flower", price: 30000, priceLabel: "Rp 30.000", image: "/assets/fresh-flower-rp30000-item-01.jpg", tag: "Populer" },

  // ======= ARTIFICIAL FLOWER (1 item @ Rp 175.000) =======
  { id: "af-01", name: "Artificial Flower Premium", category: "artificial-flower", price: 175000, priceLabel: "Rp 175.000", image: "/assets/artificial-flower-rp175000-item-01.jpg", tag: "Eksklusif" },

  // ======= CATALOG-HOME / PREMIUM PACKAGES (11 items @ Rp 150.000) =======
  { id: "ch-01", name: "Premium Package 1", category: "catalog-home", price: 150000, priceLabel: "Rp 150.000", image: "/assets/catalog-home-rp150000-item-02.jpg" },
  { id: "ch-02", name: "Premium Package 2", category: "catalog-home", price: 150000, priceLabel: "Rp 150.000", image: "/assets/catalog-home-rp150000-item-02.jpg", tag: "Populer" },
  { id: "ch-03", name: "Premium Package 3", category: "catalog-home", price: 150000, priceLabel: "Rp 150.000", image: "/assets/catalog-home-rp150000-item-04.png" },
  { id: "ch-04", name: "Premium Package 4", category: "catalog-home", price: 150000, priceLabel: "Rp 150.000", image: "/assets/catalog-home-rp150000-item-04.png" },
  { id: "ch-05", name: "Premium Package 5", category: "catalog-home", price: 150000, priceLabel: "Rp 150.000", image: "/assets/catalog-home-rp150000-item-05.jpg" },
  { id: "ch-06", name: "Premium Package 6", category: "catalog-home", price: 150000, priceLabel: "Rp 150.000", image: "/assets/catalog-home-rp150000-item-06.jpg", tag: "Best Seller" },
  { id: "ch-07", name: "Premium Package 7", category: "catalog-home", price: 150000, priceLabel: "Rp 150.000", image: "/assets/catalog-home-rp150000-item-07.jpg" },
  { id: "ch-08", name: "Premium Package 8", category: "catalog-home", price: 150000, priceLabel: "Rp 150.000", image: "/assets/catalog-home-rp150000-item-08.jpg" },
  { id: "ch-09", name: "Premium Package 9", category: "catalog-home", price: 150000, priceLabel: "Rp 150.000", image: "/assets/catalog-home-rp150000-item-09.jpg" },
  { id: "ch-10", name: "Premium Package 10", category: "catalog-home", price: 150000, priceLabel: "Rp 150.000", image: "/assets/catalog-home-rp150000-item-10.jpg" },
  { id: "ch-11", name: "Premium Package 11", category: "catalog-home", price: 150000, priceLabel: "Rp 150.000", image: "/assets/catalog-home-rp150000-item-11.jpg", tag: "👑 Premium" },
];

export const defaultProducts: Product[] = initialProducts.map((p) => ({
  ...p,
  images: p.image ? [p.image] : [],
}));

export function getProducts(): Product[] {
  try {
    const stored = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (stored) {
      const parsed: any[] = JSON.parse(stored);
      const normalized = normalizeStoredProducts(parsed);
      const migrated = JSON.stringify(parsed) !== JSON.stringify(normalized);
      if (migrated) {
        try {
          localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(normalized));
        } catch {}
      }
      return normalized as Product[];
    }
  } catch {}
  return defaultProducts;
}

export function saveProducts(prods: Product[]) {
  localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(prods));
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
const VIDEOS_STORAGE_KEY = "elbouquet_videos_v1";

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
    caption: "Behind the Scenes — Proses merangkai buket premium El Bouquet 🌸",
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
  } catch {}
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
