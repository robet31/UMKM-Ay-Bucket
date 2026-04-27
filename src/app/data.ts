// ==========================================
// PESONA FLORIST - KATALOG TERBARU 2026
// WhatsApp: 081515450611
// Instagram: @pesonaflorist
// Tiktok: @pesonafloristsidoarjo
// Jl. Raya Imam Bonjol No. 05 Krian, Sidoarjo
// ==========================================

// ---- Admin Config Store (localStorage-based) ----
const ADMIN_STORAGE_KEY = "pesona_florist_admin_v3";

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
}

const defaultConfig: SiteConfig = {
  businessName: "Pesona Florist",
  tagline: "Rangkai Keindahan di Setiap Momen",
  year: "2026",
  address: "Jl. Raya Imam Bonjol No. 05 Krian, Sidoarjo",
  whatsappNumber: "6281515450611",
  whatsappDisplay: "081515450611",
  instagram: "@pesonaflorist",
  tiktok: "@pesonafloristsidoarjo",
  navLinks: [
    { to: "/", label: "Katalog" },
    { to: "/studio", label: "Tentang" },
    { to: "/contact", label: "Kontak" },
  ],
  footerText: "",
  heroTitle: "Rangkai Keindahan\ndi Setiap Momen",
  heroSubtitle: "Buket bunga segar, hampers elegan, standing flower, dan rangkaian bunga premium untuk setiap momen spesial Anda. Handcrafted with love.",
  mapsEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3955.5!2d112.5805!3d-7.4087!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zN8KwMjQnMzEuMyJTIDExMsKwMzQnNDkuOCJF!5e0!3m2!1sid!2sid!4v1",
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
const PRODUCTS_STORAGE_KEY = "pesona_florist_products_v3";
const CATEGORIES_STORAGE_KEY = "pesona_florist_categories_v3";

// Legacy compat
export const WHATSAPP_NUMBER = "6281515450611";
export const WHATSAPP_DISPLAY = "081515450611";

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
  | "bouquet-classic"
  | "bouquet-premium-medium"
  | "bouquet-premium-big"
  | "money-bouquet"
  | "bouquet-wedding"
  | "bunga-mobil"
  | "bunga-meja"
  | "bloom-box"
  | "standing-flower"
  | "bunga-salib"
  | "paket-duka"
  | "papan-karangan";

export interface Category {
  key: ProductCategory;
  label: string;
  emoji: string;
  description: string;
  noted?: string;
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

// ---- Curated flower images per category ----
const BASE = "https://images.pexels.com/photos/";
const SUFFIX = "?auto=compress&cs=tinysrgb&w=600&h=800&fit=crop";

const IMG = {
  classic: [
    BASE + "736230/pexels-photo-736230.jpeg" + SUFFIX,
    BASE + "56866/garden-rose-red-pink-56866.jpeg" + SUFFIX,
    BASE + "931166/pexels-photo-931166.jpeg" + SUFFIX,
    BASE + "1083822/pexels-photo-1083822.jpeg" + SUFFIX,
    BASE + "87840/daisy-pollen-flower-nature-87840.jpeg" + SUFFIX,
  ],
  premium: [
    BASE + "67857/daisy-flower-spring-marguerite-67857.jpeg" + SUFFIX,
    BASE + "132474/pexels-photo-132474.jpeg" + SUFFIX,
    BASE + "69776/tulips-bed-colorful-color-69776.jpeg" + SUFFIX,
    BASE + "133472/pexels-photo-133472.jpeg" + SUFFIX,
    BASE + "1058771/pexels-photo-1058771.jpeg" + SUFFIX,
    BASE + "85773/pexels-photo-85773.jpeg" + SUFFIX,
  ],
  wedding: [
    BASE + "2567221/pexels-photo-2567221.jpeg" + SUFFIX,
    BASE + "1083822/pexels-photo-1083822.jpeg" + SUFFIX,
    BASE + "295826/pexels-photo-295826.jpeg" + SUFFIX,
  ],
  money: [
    BASE + "2072165/pexels-photo-2072165.jpeg" + SUFFIX,
    BASE + "2508735/pexels-photo-2508735.jpeg" + SUFFIX, 
  ],
  mobil: [
    BASE + "1408196/pexels-photo-1408196.jpeg" + SUFFIX,
    BASE + "1043952/pexels-photo-1043952.jpeg" + SUFFIX,
  ],
  meja: [
    BASE + "1005058/pexels-photo-1005058.jpeg" + SUFFIX,
    BASE + "870170/pexels-photo-870170.jpeg" + SUFFIX,
  ],
  bloombox: [
    BASE + "39517/rose-flower-blossom-bloom-39517.jpeg" + SUFFIX, 
    BASE + "736230/pexels-photo-736230.jpeg" + SUFFIX,
  ],
  standing: [
    BASE + "112396/pexels-photo-112396.jpeg" + SUFFIX,
    BASE + "1083822/pexels-photo-1083822.jpeg" + SUFFIX,
  ],
  salib: [
    BASE + "133472/pexels-photo-133472.jpeg" + SUFFIX,
    BASE + "931166/pexels-photo-931166.jpeg" + SUFFIX,
  ],
  papan: [
    BASE + "67857/daisy-flower-spring-marguerite-67857.jpeg" + SUFFIX,
    BASE + "56866/garden-rose-red-pink-56866.jpeg" + SUFFIX,
  ],
};
const pick = (arr: string[], i: number) => arr[i % arr.length];

export const categories: Category[] = [
  { key: "bouquet-classic", label: "Bouquet Classic", emoji: "💐", description: "Buket simple yang sampai sekarang tetap menjadi idola. Affordable & bebas pilih nuansa warna.", noted: "Bebas pilih nuansa warna dan custom warna. Kecuali warna ungu, biru, gold, dan hitam harga berbeda." },
  { key: "bouquet-premium-medium", label: "Bouquet Premium", emoji: "🌹", description: "Full fresh flower dengan rangkaian premium. Medium size dengan pilihan warna yang beragam.", noted: "Full Fresh Flower. Bebas pilih nuansa warna dan custom warna." },
  { key: "bouquet-premium-big", label: "Bouquet Premium Big", emoji: "🌺", description: "Bouquet premium ukuran besar untuk momen spesial. Full fresh flower arrangement.", noted: "Full Fresh Flower. Big size." },
  { key: "money-bouquet", label: "Money Bouquet", emoji: "💰", description: "Buket uang custom yang unik. Tersedia model Royal & Runcing.", noted: "Harga adalah biaya jasa rangkai, belum termasuk uang. Model royal & runcing tambahan 25rb-50rb." },
  { key: "bouquet-wedding", label: "Bouquet Wedding", emoji: "💒", description: "Bouquet pernikahan premium. Fresh & artificial flower mix.", noted: "Bebas pilih nuansa warna. Kecuali ungu, biru, gold, hitam harga berbeda." },
  { key: "bunga-mobil", label: "Bunga Mobil", emoji: "🚗", description: "Dekorasi bunga mobil full fresh flower untuk pernikahan.", noted: "Tambah handle 15rb/handle. Tile model V 50rb, tile bawah bunga 30rb." },
  { key: "bunga-meja", label: "Bunga Meja", emoji: "🏵️", description: "Rangkaian bunga meja elegan. Full fresh flower & anggrek.", noted: "Free kartu ucapan. Bebas pilih nuansa warna." },
  { key: "bloom-box", label: "Bloom Box", emoji: "🎁", description: "Gift box rangkaian bunga segar. Cocok untuk Grand Opening, ulang tahun, wisuda.", noted: "Bebas Request Nuansa Warna & Ucapan." },
  { key: "standing-flower", label: "Standing Flowers", emoji: "🌸", description: "Standing flower untuk berbagai event dan ucapan.", noted: "For all events. Bebas request nuansa warna & ucapan." },
  { key: "bunga-salib", label: "Bunga Salib", emoji: "✝️", description: "Rangkaian bunga salib full fresh flowers.", noted: "Free ongkir radius max 10km." },
  { key: "paket-duka", label: "Paket Duka Cita", emoji: "🕊️", description: "Paket lengkap: 1 Bunga Salib, 2 Standing XL, 2 Standing L, 2 Bunga Meja, 1 Bunga Taman." },
  { key: "papan-karangan", label: "Papan Karangan Bunga", emoji: "📋", description: "Papan karangan bunga berbagai ukuran untuk ucapan." },
];

const initialProducts: Product[] = [
  // ======= BOUQUET CLASSIC =======
  { id: "bc-01", name: "Bouquet Classic 3 Mawar", category: "bouquet-classic", price: 20000, priceLabel: "Rp 20.000", image: pick(IMG.classic,0), variant: "3 Mawar" },
  { id: "bc-02", name: "Bouquet Classic 5 Mawar", category: "bouquet-classic", price: 30000, priceLabel: "Rp 30.000", image: pick(IMG.classic,1), variant: "5 Mawar" },
  { id: "bc-03", name: "Bouquet Classic 7 Mawar", category: "bouquet-classic", price: 40000, priceLabel: "Rp 40.000", image: pick(IMG.classic,2), variant: "7 Mawar" },
  { id: "bc-04", name: "Bouquet Classic 10 Mawar", category: "bouquet-classic", price: 55000, priceLabel: "Rp 55.000", image: pick(IMG.classic,3), variant: "10 Mawar" },
  { id: "bc-05", name: "Bouquet Classic 12 Mawar", category: "bouquet-classic", price: 65000, priceLabel: "Rp 65.000", image: pick(IMG.classic,4), variant: "12 Mawar" },
  { id: "bc-06", name: "Bouquet Classic 15 Mawar", category: "bouquet-classic", price: 80000, priceLabel: "Rp 80.000", image: pick(IMG.classic,0), variant: "15 Mawar", tag: "Populer" },
  { id: "bc-07", name: "Bouquet Classic 20 Mawar", category: "bouquet-classic", price: 105000, priceLabel: "Rp 105.000", image: pick(IMG.classic,1), variant: "20 Mawar" },
  { id: "bc-m1", name: "Bouquet Classic Medium", category: "bouquet-classic", price: 55000, priceLabel: "Rp 55.000", image: pick(IMG.classic,2), variant: "Medium" },
  { id: "bc-m2", name: "Bouquet Classic Medium", category: "bouquet-classic", price: 60000, priceLabel: "Rp 60.000", image: pick(IMG.classic,3), variant: "Medium" },
  { id: "bc-m3", name: "Bouquet Classic Medium", category: "bouquet-classic", price: 70000, priceLabel: "Rp 70.000", image: pick(IMG.classic,4), variant: "Medium" },

  // ======= BOUQUET PREMIUM MEDIUM =======
  { id: "bp-01", name: "Bouquet Premium Unicorn", category: "bouquet-premium-medium", price: 300000, priceLabel: "Rp 300.000", image: pick(IMG.premium,0), description: "Mawar Putih, Daun Ruskus, Mawar Pink Soft, Babybreath. Full Fresh Flower.", tag: "✨ Premium" },
  { id: "bp-02", name: "Bouquet Premium Soft", category: "bouquet-premium-medium", price: 85000, priceLabel: "Rp 85.000", image: pick(IMG.premium,1) },
  { id: "bp-03", name: "Bouquet Premium Elegant", category: "bouquet-premium-medium", price: 100000, priceLabel: "Rp 100.000", image: pick(IMG.premium,2) },
  { id: "bp-04", name: "Bouquet Premium Bloom", category: "bouquet-premium-medium", price: 120000, priceLabel: "Rp 120.000", image: pick(IMG.premium,3), tag: "Best Seller" },
  { id: "bp-05", name: "Bouquet Premium Classic", category: "bouquet-premium-medium", price: 135000, priceLabel: "Rp 135.000", image: pick(IMG.premium,4) },
  { id: "bp-06", name: "Bouquet Premium Luxe", category: "bouquet-premium-medium", price: 150000, priceLabel: "Rp 150.000", image: pick(IMG.premium,5) },
  { id: "bp-07", name: "Bouquet Premium Royal", category: "bouquet-premium-medium", price: 175000, priceLabel: "Rp 175.000", image: pick(IMG.premium,6) },
  { id: "bp-08", name: "Bouquet Premium Grand", category: "bouquet-premium-medium", price: 200000, priceLabel: "Rp 200.000", image: pick(IMG.premium,7) },
  { id: "bp-09", name: "Bouquet Premium Deluxe", category: "bouquet-premium-medium", price: 250000, priceLabel: "Rp 250.000", image: pick(IMG.premium,0), tag: "🔥 Terlaris" },
  { id: "bp-10", name: "Bouquet Premium Majestic", category: "bouquet-premium-medium", price: 300000, priceLabel: "Rp 300.000", image: pick(IMG.premium,1) },
  { id: "bp-11", name: "Bouquet Premium Aurora", category: "bouquet-premium-medium", price: 350000, priceLabel: "Rp 350.000", image: pick(IMG.premium,2) },
  { id: "bp-12", name: "Bouquet Premium Infinity", category: "bouquet-premium-medium", price: 450000, priceLabel: "Rp 450.000", image: pick(IMG.premium,3) },
  { id: "bp-13", name: "Bouquet Premium Supreme", category: "bouquet-premium-medium", price: 550000, priceLabel: "Rp 550.000", image: pick(IMG.premium,4) },
  { id: "bp-14", name: "Bouquet Premium Imperial", category: "bouquet-premium-medium", price: 700000, priceLabel: "Rp 700.000", image: pick(IMG.premium,5) },
  { id: "bp-15", name: "Bouquet Premium Dynasty", category: "bouquet-premium-medium", price: 800000, priceLabel: "Rp 800.000", image: pick(IMG.premium,6), tag: "⭐ Eksklusif" },

  // ======= BOUQUET PREMIUM BIG =======
  { id: "bpb-01", name: "Bouquet Big Rose", category: "bouquet-premium-big", price: 600000, priceLabel: "Rp 600.000", image: pick(IMG.premium,0), description: "Full Fresh Flower. Wrap hitam list gold." },
  { id: "bpb-02", name: "Bouquet Big Garden", category: "bouquet-premium-big", price: 750000, priceLabel: "Rp 750.000", image: pick(IMG.premium,2) },
  { id: "bpb-03", name: "Bouquet Big Royal", category: "bouquet-premium-big", price: 800000, priceLabel: "Rp 800.000", image: pick(IMG.premium,4), tag: "✨ Signature" },
  { id: "bpb-04", name: "Bouquet Big Grand", category: "bouquet-premium-big", price: 850000, priceLabel: "Rp 850.000", image: pick(IMG.premium,6) },
  { id: "bpb-05", name: "Bouquet Big Majestic", category: "bouquet-premium-big", price: 1000000, priceLabel: "Rp 1.000.000", image: pick(IMG.premium,1), tag: "👑 Premium" },

  // ======= MONEY BOUQUET =======
  { id: "mb-01", name: "Money Bouquet 0-10 Lembar", category: "money-bouquet", price: 85000, priceLabel: "Rp 85.000", image: pick(IMG.money,0), variant: "0-10 lembar" },
  { id: "mb-02", name: "Money Bouquet 11-20 Lembar", category: "money-bouquet", price: 100000, priceLabel: "Rp 100.000", image: pick(IMG.money,1), variant: "11-20 lembar" },
  { id: "mb-03", name: "Money Bouquet 21-30 Lembar", category: "money-bouquet", price: 150000, priceLabel: "Rp 150.000", image: pick(IMG.money,0), variant: "21-30 lembar" },
  { id: "mb-04", name: "Money Bouquet 41-50 Lembar", category: "money-bouquet", price: 250000, priceLabel: "Rp 250.000", image: pick(IMG.money,1), variant: "41-50 lembar", tag: "Populer" },
  { id: "mb-05", name: "Money Bouquet 91-100 Lembar", category: "money-bouquet", price: 500000, priceLabel: "Rp 500.000", image: pick(IMG.money,0), variant: "91-100 lembar" },
  { id: "mb-06", name: "Money Bouquet 200 Lembar", category: "money-bouquet", price: 1000000, priceLabel: "Rp 1.000.000", image: pick(IMG.money,1), variant: "200 lembar", tag: "👑 Mega" },

  // ======= BOUQUET WEDDING =======
  { id: "bw-01", name: "Wedding Bouquet Simple", category: "bouquet-wedding", price: 85000, priceLabel: "Rp 85.000", image: pick(IMG.wedding,0) },
  { id: "bw-02", name: "Wedding Bouquet Elegant", category: "bouquet-wedding", price: 200000, priceLabel: "Rp 200.000", image: pick(IMG.wedding,1), tag: "Favorit" },
  { id: "bw-03", name: "Wedding Bouquet Royal", category: "bouquet-wedding", price: 350000, priceLabel: "Rp 350.000", image: pick(IMG.wedding,2) },
  { id: "bw-04", name: "Wedding Orchid Premium", category: "bouquet-wedding", price: 450000, priceLabel: "Rp 450.000", image: pick(IMG.wedding,3), description: "Gompie coklat, Carnation merah, Mawar peach, Anggrek, baby breath.", tag: "✨ Signature" },
  { id: "bw-05", name: "Wedding Bouquet Luxury", category: "bouquet-wedding", price: 550000, priceLabel: "Rp 550.000", image: pick(IMG.wedding,0) },

  // ======= BUNGA MOBIL =======
  { id: "bm-01", name: "Bunga Mobil Classic", category: "bunga-mobil", price: 250000, priceLabel: "Rp 250.000", image: pick(IMG.mobil,0) },
  { id: "bm-02", name: "Bunga Mobil Elegant", category: "bunga-mobil", price: 300000, priceLabel: "Rp 300.000", image: pick(IMG.mobil,1), tag: "Best Seller" },
  { id: "bm-03", name: "Bunga Mobil Grand", category: "bunga-mobil", price: 350000, priceLabel: "Rp 350.000", image: pick(IMG.mobil,0) },

  // ======= BUNGA MEJA =======
  { id: "bmj-01", name: "Bunga Meja Classic", category: "bunga-meja", price: 300000, priceLabel: "Rp 300.000", image: pick(IMG.meja,0) },
  { id: "bmj-02", name: "Bunga Meja Premium", category: "bunga-meja", price: 400000, priceLabel: "Rp 400.000", image: pick(IMG.meja,1), tag: "Populer" },
  { id: "bmj-03", name: "Bunga Meja Grand", category: "bunga-meja", price: 500000, priceLabel: "Rp 500.000", image: pick(IMG.meja,2) },
  { id: "bmj-04", name: "Bunga Meja Anggrek", category: "bunga-meja", price: 1000000, priceLabel: "Rp 1.000.000", image: pick(IMG.meja,3), description: "Full Anggrek Fresh. Look So Elegant.", tag: "⭐ Eksklusif" },
  { id: "bmj-05", name: "Bunga Meja Anggrek Royal", category: "bunga-meja", price: 3000000, priceLabel: "Rp 3.000.000", image: pick(IMG.meja,0), tag: "👑 Super Premium" },
  { id: "bmj-06", name: "Bunga Meja XL", category: "bunga-meja", price: 1250000, priceLabel: "Rp 1.250.000", image: pick(IMG.meja,1) },
  { id: "bmj-07", name: "Bunga Meja Mega", category: "bunga-meja", price: 2250000, priceLabel: "Rp 2.250.000", image: pick(IMG.meja,2), tag: "👑 Mega" },

  // ======= BLOOM BOX =======
  { id: "bb-01", name: "Bloom Box Classic", category: "bloom-box", price: 400000, priceLabel: "Rp 400.000", image: pick(IMG.bloombox,0) },
  { id: "bb-02", name: "Bloom Box Premium", category: "bloom-box", price: 550000, priceLabel: "Rp 550.000", image: pick(IMG.bloombox,1), tag: "Populer" },
  { id: "bb-03", name: "Bloom Box Grand", category: "bloom-box", price: 750000, priceLabel: "Rp 750.000", image: pick(IMG.bloombox,0), tag: "🔥 Best Seller" },

  // ======= STANDING FLOWER =======
  { id: "sf-01", name: "Standing Flower Classic", category: "standing-flower", price: 500000, priceLabel: "Rp 500.000", image: pick(IMG.standing,0) },
  { id: "sf-02", name: "Standing Flower Premium", category: "standing-flower", price: 750000, priceLabel: "Rp 750.000", image: pick(IMG.standing,1), tag: "Best Seller" },
  { id: "sf-03", name: "Standing Flower Grand", category: "standing-flower", price: 1300000, priceLabel: "Rp 1.300.000", image: pick(IMG.standing,2) },
  { id: "sf-04", name: "Standing Flower Imperial", category: "standing-flower", price: 2300000, priceLabel: "Rp 2.300.000", image: pick(IMG.standing,0), tag: "👑 Imperial" },

  // ======= BUNGA SALIB =======
  { id: "bs-01", name: "Bunga Salib Classic", category: "bunga-salib", price: 350000, priceLabel: "Rp 350.000", image: pick(IMG.salib,0) },
  { id: "bs-02", name: "Bunga Salib Premium", category: "bunga-salib", price: 450000, priceLabel: "Rp 450.000", image: pick(IMG.salib,1) },
  { id: "bs-03", name: "Bunga Salib Grand", category: "bunga-salib", price: 500000, priceLabel: "Rp 500.000", image: pick(IMG.salib,0) },

  // ======= PAKET DUKA CITA =======
  { id: "pd-01", name: "Paket Duka Cita Lengkap", category: "paket-duka", price: 4000000, priceLabel: "Rp 4.000.000", image: pick(IMG.salib,1), description: "1 Bunga Salib, 2 Standing XL, 2 Standing L, 2 Bunga Meja, 1 Bunga Taman.", tag: "Paket Lengkap" },

  // ======= PAPAN KARANGAN BUNGA =======
  { id: "pk-01", name: "Papan Karangan S", category: "papan-karangan", price: 450000, priceLabel: "Rp 450.000", image: pick(IMG.papan,0) },
  { id: "pk-02", name: "Papan Karangan M", category: "papan-karangan", price: 600000, priceLabel: "Rp 600.000", image: pick(IMG.papan,1) },
  { id: "pk-03", name: "Papan Karangan L", category: "papan-karangan", price: 750000, priceLabel: "Rp 750.000", image: pick(IMG.papan,0) },
  { id: "pk-04", name: "Papan Karangan Grand", category: "papan-karangan", price: 1000000, priceLabel: "Rp 1.000.000", image: pick(IMG.papan,1), tag: "Best Seller" },
  { id: "pk-05", name: "Papan Karangan Imperial", category: "papan-karangan", price: 2000000, priceLabel: "Rp 2.000.000", image: "", tag: "👑 Premium" },
];

function getLocalImage(category: string): string {
  switch(category) {
    case "bouquet-classic":
    case "bouquet-premium-medium":
    case "bouquet-premium-big":
    case "bloom-box":
    case "paket-duka":
      return "/assets/bouquet_classic.png";
    case "money-bouquet":
      return "/assets/money_bouquet.png";
    case "bunga-mobil":
      return "/assets/bunga_mobil.png";
    case "bunga-meja":
    case "standing-flower":
      return "/assets/bunga_meja.png";
    case "bunga-salib":
      return "/assets/bunga_salib.png";
    case "papan-karangan":
      return "/assets/papan_karangan.png";
    default:
      return "/assets/bouquet_classic.png";
  }
}

export const defaultProducts: Product[] = initialProducts.map((p) => {
  const localImage = getLocalImage(p.category);
  return {
    ...p,
    image: localImage,
    images: [localImage, localImage, localImage]
  };
});

export function getProducts(): Product[] {
  try {
    const stored = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (stored) return JSON.parse(stored);
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
const VIDEOS_STORAGE_KEY = "pesona_florist_videos_v6";

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
    caption: "Behind the Scenes — Proses merangkai buket premium Pesona Florist 🌸",
    featured: true,
  },
  {
    id: "v-2",
    url: "https://www.youtube.com/shorts/-0SM7Ihvxyo",
    source: "youtube",
    orientation: "vertical",
    caption: "Tutorial Mini Bouquet (Layout Vertikal) 💐",
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
