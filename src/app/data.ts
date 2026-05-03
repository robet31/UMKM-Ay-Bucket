// ==========================================
// EL BOUQUET - KATALOG TERBARU 2026
// Instagram: @elbouket
// Premium Flower & Gift Arrangements
// ==========================================

// ---- BRANDING & LOGO ----
export const BRAND_LOGO = {
  name: "ay buket",
  tagline: "Wujudkan Hadiah Impianmu",
  whatsapp: "6282257827867",
  location: "Pertokoan pasar senenan Bangkalan",
  instagram: "@aybuket",
  // Path to the logo file. Place `5.jpg` (or a processed/transparent version)
  // into `public/assets/ay-logo-5.jpg` to have it served at runtime.
  logo: "/assets/ay-logo-5.jpg",
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
  heroFallbackImage: string;
  mapsEmbedUrl: string;
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
  heroFallbackImage: "/assets/catalog-home-rp150000-item-02.jpg",
  mapsEmbedUrl: "",
  adminUsername: "admin",
  adminPassword: "admin123",
};

export function getSiteConfig(): SiteConfig {
  try {
    const stored = localStorage.getItem(ADMIN_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as Partial<SiteConfig>;
      const merged = { ...defaultConfig, ...parsed } as SiteConfig;
      if (!merged.adminUsername) merged.adminUsername = "admin";
      if (!merged.adminPassword || merged.adminPassword === "elbouquet") merged.adminPassword = "admin123";
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
    const merged = { ...current, ...config };
    localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(merged));
    window.dispatchEvent(new Event("siteConfigChanged"));
  } catch { }
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
  const numericPrice = typeof product?.price === "number"
    ? product.price
    : parseInt(String(product?.price || 0).replace(/\D/g, ""), 10) || 0;
  const normalizedLabel = typeof product?.priceLabel === "string" && product.priceLabel.trim().length > 0
    ? (product.priceLabel.toLowerCase().includes("rp") ? product.priceLabel : formatRupiah(product.priceLabel))
    : formatRupiah(numericPrice);

  const images = Array.isArray(product?.images)
    ? product.images.filter(Boolean)
    : product?.image
      ? [product.image]
      : [];

  return {
    ...product,
    price: numericPrice,
    priceLabel: normalizedLabel,
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
    description: "Buket uang yang elegan untuk momen istimewa. Hadiah yang praktis dan berkesan.",
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

const GALLERY_STORAGE_KEY = "elbouquet_gallery_v1";

export const defaultGalleryProjects: GalleryProject[] = [
  {
    id: "gallery-1",
    title: "Buket Satin Collection",
    category: "Buket Satin",
    aspect: "3/4",
    image: "/assets/buket-satin-rp20000-item-01.jpg",
  },
  {
    id: "gallery-2",
    title: "Money Bouquet Premium",
    category: "Money Bouquet",
    aspect: "1/1",
    image: "/assets/money-bouquet-rp50000-item-01.jpg",
  },
  {
    id: "gallery-3",
    title: "Snack Bouquet Unik",
    category: "Snack Bouquet",
    aspect: "16/9",
    image: "/assets/snack-bouquet-rp35000-item-01.jpg",
  },
  {
    id: "gallery-4",
    title: "Fresh Flower Arrangement",
    category: "Fresh Flower",
    aspect: "3/4",
    image: "/assets/catalog-home-rp150000-item-02.jpg",
  },
  {
    id: "gallery-5",
    title: "Chocolate Bouquet Premium",
    category: "Chocolate Bouquet",
    aspect: "1/1",
    image: "/assets/catalog-home-rp150000-item-02.jpg",
  },
  {
    id: "gallery-6",
    title: "Artificial Flower Collection",
    category: "Artificial Flower",
    aspect: "16/9",
    image: "/assets/catalog-home-rp150000-item-02.jpg",
  },
];

export function getGalleryProjects(): GalleryProject[] {
  if (typeof window === "undefined") return defaultGalleryProjects;
  const stored = localStorage.getItem(GALLERY_STORAGE_KEY);
  if (!stored) return defaultGalleryProjects;
  try {
    return JSON.parse(stored) as GalleryProject[];
  } catch {
    return defaultGalleryProjects;
  }
}

export function setGalleryProjects(projects: GalleryProject[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(GALLERY_STORAGE_KEY, JSON.stringify(projects));
  window.dispatchEvent(new Event("galleryProjectsChanged"));
}

export function resetGalleryProjects(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(GALLERY_STORAGE_KEY);
  window.dispatchEvent(new Event("galleryProjectsChanged"));
}

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

  // ======= AY BUKET — CURATED PREMIUM COLLECTION (11 items) =======
  { id: "ay-accessories-1", name: "Akrilik Frame Mini", category: "accessories", price: 95000, priceLabel: "Rp 95.000", image: "/assets/Akrilik frame mini - Rp 95.000,00 - akrilik dome ukuran A5 standing lampu warna putih, bisa request warna, foto & tulisan (10).png", tag: "Favorit Kami" },
  { id: "ay-accessories-2", name: "Sewa Per Jam Standing Akrilik Bulat", category: "accessories", price: 40000, priceLabel: "Rp 40.000", image: "/assets/Sewa Standing Akrilik bulat (PROMO) - sewa 3 jam Rp 40.000 - sewa 12 jam Rp 50.000 - sewa 24jam Rp 75.000 - bisa untuk segala acara Ready set (2).png", tag: "Favorit Kami" },
  { id: "ay-buckets-3", name: "Bucket Aesthetic", category: "buckets", price: 100000, priceLabel: "Rp 100.000", image: "/assets/Round Pita Satin - Rp 100.000,00 (2).png", tag: "Favorit Kami" },
  { id: "ay-buckets-4", name: "Bucket Bunga Gradoll (Graduation Doll) Big Mesh", category: "buckets", price: 170000, priceLabel: "Rp 170.000", image: "/assets/Buket Bunga Gradoll (Graduation Doll) Big Mesh - Rp 170.000,00 - bunga palsu mix isian tidak bisa sama persis, ukuran & jumlah bu (2).png" },
  { id: "ay-fresh-flower-5", name: "Bunga Mawar Palsu", category: "fresh-flower", price: 250000, priceLabel: "Rp 250.000", image: "/assets/Bunga Mawar Palsu Premium (ukuran Big) - Rp 250.000,00 (2).png" },
  { id: "ay-fresh-flower-6", name: "Bunga White Sedap", category: "fresh-flower", price: 125000, priceLabel: "Rp 125.000", image: "/assets/bunga white sedap - Rp 125.000,00 - 125ribu hanya bunga asli saja (10tangkai sedap malam & 10tangkai asteria) (2).png" },
  { id: "ay-catalog-home-7", name: "Frame Birthday Edelweis", category: "catalog-home", price: 150000, priceLabel: "Rp 150.000", image: "/assets/Frame Birthday Edelweis - Rp 150.000,00 - frame ukuran 25cm x 35cm - bisa request tulisan + 2 foto - bunga edelweis mini (2).png" },
  { id: "ay-catalog-home-8", name: "Mawar Candy (Bunga Asli)", category: "catalog-home", price: 170000, priceLabel: "Rp 170.000", image: "/assets/Mawar Candy (Bunga Asli) - Rp 170.000,00 (2).png" },
  { id: "ay-wreaths-9", name: "Karangan Bunga", category: "wreaths", price: 500000, priceLabel: "Rp 500.000", image: "/assets/Karangan Bunga Bunga Papan 1 Titik - Rp 500.000,00 - Karangan Bunga Bunga Papan bisa untuk segala acara Ready setiap hari bisa dikirim Kamal Telang Socah Bangkala (2).png" },
  { id: "ay-packaging-10", name: "Packing Luxury Elegant", category: "packaging", price: 25000, priceLabel: "Rp 25.000", image: "/assets/packing luxury elegant - Rp 25.000,00 - packing box + kertas + pita organza (2).png" },
  { id: "ay-ribbons-11", name: "Selempang Wisuda 3 Titik", category: "ribbons", price: 95000, priceLabel: "Rp 95.000", image: "/assets/Selempang Wisuda 3 Titik - Rp 95.000,00 (2).png" },
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
        } catch { }
      }
      return normalized as Product[];
    }
  } catch { }
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
