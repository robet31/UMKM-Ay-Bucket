import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { categories, formatRupiah, getProducts, getSiteConfig, mergeProductsByNameAndPrice, syncAllWithTurso, isProduction, getGalleryProjects, getVideos, defaultGalleryProjects, type Product, type ProductCategory, type Category } from "../data";
import { PageTransition } from "../components/page-transition";
import { Footer } from "../components/footer";
import AnimatedPetals from "../components/animated-petals";
import { VideoGallery } from "../components/video-gallery";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useLanguage, type Language } from "../language";

// Helper to truncate description for listing view (show only first ~120 chars)
function truncateDescription(desc: string | undefined, maxLength: number = 80): string {
  if (!desc) return "";
  const text = desc.trim();
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "...";
}

// Helper to deduplicate products by normalized name + price and merge their images
function deduplicateProducts(products: Product[]): Product[] {
  return mergeProductsByNameAndPrice(products);
}

function useAdminSync() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const handler = () => {
      setTick((t) => t + 1);
    };

    window.addEventListener("siteConfigChanged", handler);
    window.addEventListener("storage", (e) => {
      if (e.key?.includes("aybucket")) handler();
    });

    // Cross-device sync: Poll Turso DB every 15 seconds
    const interval = setInterval(() => {
      if (isProduction) {
        syncAllWithTurso().then((changed) => {
          if (changed) handler();
        });
      }
    }, 15000);

    return () => {
      window.removeEventListener("siteConfigChanged", handler);
      window.removeEventListener("storage", handler);
      clearInterval(interval);
    };
  }, []);
  return tick;
}

export function Home() {
  const syncTick = useAdminSync();
  const [language] = useLanguage();
  const config = useMemo(() => getSiteConfig(), [syncTick]);
  const rawProducts = useMemo(() => getProducts(), [syncTick]);
  const products = useMemo(() => deduplicateProducts(rawProducts), [rawProducts]);

  const [activeCategory, setActiveCategory] = useState<ProductCategory | "all">("all");
  const [showAll, setShowAll] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | null>(null);
  const [heroIndex, setHeroIndex] = useState(0);

  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (!heroRef.current || products.length === 0) return;

    const heroImages = products.slice(0, 6);
    const total = Math.max(heroImages.length - 1, 1);

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: heroRef.current,
        start: "top center",
        end: "+=1400",
        scrub: 1.2,
        onUpdate: (self) => {
          const idx = Math.min(total, Math.round(self.progress * total));
          setHeroIndex(idx);
        },
      });
    }, heroRef);

    return () => ctx.revert();
  }, [products]);

  useEffect(() => {
    syncAllWithTurso().catch(console.error);
  }, []);

  useEffect(() => {
    if (selectedProduct || selectedCategory) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflowY = "scroll"; // Keep scrollbar space
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflowY = "";
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || "0") * -1);
      }
    }
  }, [selectedProduct, selectedCategory]);

  const filteredProducts = activeCategory === "all" ? products : products.filter((p: Product) => p.category === activeCategory);
  const displayedProducts = showAll ? filteredProducts : filteredProducts.slice(0, 12);
  
  const currentCategories = useMemo(() => {
    return (config.customCategories && config.customCategories.length > 0) ? config.customCategories : categories;
  }, [config.customCategories]);

  const activeInfo = activeCategory !== "all" ? currentCategories.find((c: Category) => c.key === activeCategory) : null;
  const selectedCategoryInfo = selectedCategory ? currentCategories.find((c: Category) => c.key === selectedCategory) ?? null : null;
  const selectedCategoryProducts = selectedCategory ? products.filter((p: Product) => p.category === selectedCategory) : [];

  const categoriesWithProducts = useMemo(() => {
    return currentCategories
      .map((category: Category) => ({
        ...category,
        count: products.filter((product: Product) => product.category === category.key).length,
      }))
      .filter((category) => category.count > 0);
  }, [products, currentCategories]);

  const polaroidCards = useMemo(() => {
    return categoriesWithProducts.map((category: any, index: number) => {
      const product = products.find((item: Product) => item.category === category.key);
      if (!product) return null;

      const seed = product.id.split("").reduce((acc, char) => acc + char.charCodeAt(0), index * 31);
      const rotate = ((seed % 13) - 6) * 0.7;
      const x = ((seed % 9) - 4) * 2;
      const y = ((seed % 7) - 3) * 2;
      const delay = (seed % 5) * 0.15;

      return { product, category, index, rotate, x, y, delay };
    });
  }, [categoriesWithProducts, products]).filter(Boolean) as Array<{
    product: Product;
    category: { key: ProductCategory; label: string; emoji: string; description: string; count: number };
    index: number;
    rotate: number;
    x: number;
    y: number;
    delay: number;
  }>;

  const getCategoryAccent = (category: ProductCategory) => {
    const accentMap: Record<ProductCategory, string> = {
      "buket-satin": "#d48a6a",
      "snack-bouquet": "#c98b3f",
      "money-bouquet": "#7d5ba6",
      "chocolate-bouquet": "#7a4f2c",
      "fresh-flower": "#c05d5d",
      "artificial-flower": "#4f8f7a",
      "catalog-home": "#b85c3b",
      "accessories": "#8a6a52",
      "buckets": "#b85c3b",
      "wreaths": "#7a8f4f",
      "packaging": "#6f6f8d",
      "ribbons": "#b66aa0",
      "sewa": "#5a8fa6",
      "bloom-box": "#d48a6a",
      "thumbelina": "#c98b3f",
      "bucket-unik": "#b85c3b",
      "vas-dekorasi": "#4f8f7a",
    };
    return accentMap[category] || "#b85c3b";
  };

  const heroFrames = (() => {
    // 1. Get from new heroSettings
    const settingsHeroes: Product[] = (config.heroSettings || []).map((slot, idx) => {
      const linkedProduct = products.find(p => p.id === slot.productId);
      const img = slot.image || linkedProduct?.image || "";
      if (!img && !linkedProduct) return null;
      
      return {
        id: `hero-slot-${idx}`,
        name: linkedProduct?.name || config.heroTitle || config.businessName || "Ay Bucket",
        category: linkedProduct?.category || ("catalog-home" as ProductCategory),
        description: linkedProduct ? formatRupiah(linkedProduct.price) : (config.heroSubtitle || ""),
        image: img,
        images: [img],
        price: linkedProduct?.price || 0,
        priceLabel: linkedProduct ? formatRupiah(linkedProduct.price) : (language === "id" ? "Katalog" : "Catalog"),
        tag: "hero",
        variant: "hero",
      } as Product;
    }).filter((p): p is Product => p !== null);

    // 2. Fallback to legacy heroFallbackImage if settings are empty
    const adminImages = config.heroFallbackImage ? config.heroFallbackImage.split('|SEP|').map(s => s.trim()).filter(Boolean) : [];
    const legacyHeroes: Product[] = settingsHeroes.length > 0 ? [] : adminImages.map((img, idx) => ({
      id: `hero-legacy-${idx}`,
      name: config.heroTitle || config.businessName || "Ay Bucket",
      category: "catalog-home" as ProductCategory,
      description: config.heroSubtitle || "",
      image: img,
      images: [img],
      price: 0,
      priceLabel: language === "id" ? "Katalog" : "Catalog",
      tag: "hero",
      variant: "hero",
    }));

    // 3. Use gallery projects as fallback if still empty
    const galleryHeroes: Product[] = settingsHeroes.length === 0 && legacyHeroes.length === 0 
      ? getGalleryProjects().slice(0, 6).map((gal, idx) => ({
          id: `hero-gallery-${idx}`,
          name: gal.title || "Gallery",
          category: "catalog-home" as ProductCategory,
          description: gal.category || "",
          image: gal.image,
          images: [gal.image],
          price: 0,
          priceLabel: language === "id" ? "Lihat" : "View",
          tag: "hero",
          variant: "hero",
        }))
      : [];

    const adminHeroes = [...settingsHeroes, ...legacyHeroes, ...galleryHeroes];

    if (adminHeroes.length === 0) {
      adminHeroes.push({
        id: "hero-fallback",
        name: config.heroTitle || config.businessName || "Ay Bucket",
        category: "catalog-home" as ProductCategory,
        description: config.heroSubtitle || config.tagline || "",
        image: "https://placehold.co/600x800/ebebe9/1a1a1a?text=Hero",
        images: ["https://placehold.co/600x800/ebebe9/1a1a1a?text=Hero"],
        price: 0,
        priceLabel: language === "id" ? "Katalog" : "Catalog",
      });
    }

    const validProducts = Array.from(new Map(products.filter((p) => p.image).map((p) => [p.image, p])).values());
    const needed = Math.max(0, 6 - adminHeroes.length);

    return [...adminHeroes, ...validProducts.slice(0, needed)];
  })();

  const heroTitleText = config.heroTitle || (language === "id" ? "Buket Bunga Premium" : "Premium Flower Bouquets");
  const heroSubtitleText = config.heroSubtitle || (language === "id" ? "Hadiah terbaik untuk momen spesial Anda." : "The best gift for your special moments.");
  const heroCount = heroFrames.length;
  const currentHero = heroFrames[heroIndex % heroCount];
  const previousHero = heroFrames[(heroIndex - 1 + heroCount) % heroCount];
  const nextHero = heroFrames[(heroIndex + 1) % heroCount];
  const heroAccent = getCategoryAccent(currentHero.category);

  return (
    <PageTransition>
      <div style={{ padding: "0 clamp(24px, 8vw, 120px)", backgroundImage: "linear-gradient(135deg, #b85c3b 0%, #d17047 50%, #c97047 100%)", borderRadius: "20px", marginBottom: "120px", overflow: "hidden", position: "relative" }}>
        <motion.div aria-hidden style={{ position: "absolute", top: "-20%", right: "-15%", width: "600px", height: "600px", borderRadius: "50%", background: "radial-gradient(circle, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.03) 100%)", filter: "blur(80px)" }} animate={{ y: [0, 30, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} />
        <motion.div aria-hidden style={{ position: "absolute", bottom: "-10%", left: "-10%", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(200,100,80,0.15) 0%, rgba(200,100,80,0.02) 100%)", filter: "blur(100px)" }} animate={{ y: [0, -40, 0] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 0.5 }} />

        <div ref={heroRef} style={{ paddingTop: "clamp(40px, 6vw, 80px)", paddingBottom: "clamp(96px, 10vw, 140px)", position: "relative", zIndex: 2 }}>
          <div className="mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.15 }} style={{ maxWidth: "620px" }}>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(249,249,247,0.8)", margin: "0 0 16px 0", fontWeight: 600 }}>
                🌸 {language === "id" ? "Buket Bunga Premium" : "Premium Flower Bouquets"}
              </p>
              <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(42px, 8vw, 80px)", fontWeight: 300, color: "#F9F9F7", letterSpacing: "-0.02em", margin: "0 0 8px 0", lineHeight: 1.05, textShadow: "2px 2px 4px rgba(0,0,0,0.15)" }}>
                {heroTitleText}
              </h1>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "clamp(16px, 2.5vw, 22px)", fontWeight: 400, color: "rgba(249,249,247,0.92)", margin: "0 0 20px 0", letterSpacing: "0.02em", lineHeight: 1.5 }}>
                {heroSubtitleText}
              </p>
              <p style={{ maxWidth: "540px", color: "rgba(249,249,247,0.85)", fontFamily: "'Inter', sans-serif", fontSize: "14px", lineHeight: 1.8, margin: "0 0 20px 0" }}>
                {language === "id"
                  ? "Hadiah terbaik untuk momen spesial — dari buket bunga segar, bucket premium, hingga karangan bunga eksklusif."
                  : "The finest gifts for your special moments — from fresh bouquets, premium buckets, to exclusive flower arrangements."}
              </p>

              <div style={{ display: "flex", gap: "16px", marginTop: "28px", alignItems: "center", flexWrap: "wrap" }}>
                <motion.button
                  onClick={() => document.getElementById('hero-section')?.scrollIntoView({ behavior: 'smooth' })}
                  whileHover={{ scale: 1.06, boxShadow: "0 16px 40px rgba(249,249,247,0.3)" }}
                  whileTap={{ scale: 0.94 }}
                  style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "10px", fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase", padding: "16px 40px", backgroundColor: "#F9F9F7", color: heroAccent, border: "none", cursor: "pointer", transition: "all 0.4s cubic-bezier(0.22,1,0.36,1)", fontWeight: 800, borderRadius: "12px", boxShadow: "0 12px 30px rgba(0,0,0,0.2)" }}
                >
                  ↓ {language === "id" ? "Scroll untuk Jelajahi" : "Scroll to Explore"}
                </motion.button>
              </div>
            </motion.div>

            <div style={{ position: "relative", width: "100%", minHeight: "clamp(540px, 58vw, 720px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <motion.div aria-hidden initial={{ opacity: 0 }} animate={{ opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }} style={{ position: "absolute", top: "8%", right: "12%", width: "120px", height: "120px", borderRadius: "50%", background: "radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)", filter: "blur(40px)" }} />
              <motion.div aria-hidden initial={{ opacity: 0 }} animate={{ opacity: [0.3, 0.6, 0.3], y: [0, -20, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }} style={{ position: "absolute", bottom: "10%", left: "8%", width: "100px", height: "100px", borderRadius: "50%", background: "radial-gradient(circle, rgba(255,200,150,0.15) 0%, transparent 70%)", filter: "blur(50px)" }} />

              <motion.div aria-hidden initial={{ opacity: 0, x: -18, y: 22, rotateZ: -11 }} animate={{ opacity: 0.34, x: -18, y: 22, rotateZ: -11, scale: [1, 1.02, 1] }} transition={{ duration: 1, delay: 0.25, scale: { duration: 4, repeat: Infinity, ease: "easeInOut" } }} style={{ position: "absolute", left: "3%", top: "16%", width: "min(42vw, 230px)", aspectRatio: "4/5", background: "rgba(255,255,255,0.16)", borderRadius: "8px", filter: "blur(0.3px)", boxShadow: "0 20px 30px rgba(0,0,0,0.12)", pointerEvents: "none" }} />
              <motion.div aria-hidden initial={{ opacity: 0, x: 18, y: 10, rotateZ: 10 }} animate={{ opacity: 0.24, x: 18, y: 10, rotateZ: 10, scale: [1, 1.01, 1] }} transition={{ duration: 1, delay: 0.35, scale: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.3 } }} style={{ position: "absolute", right: "1%", bottom: "12%", width: "min(40vw, 220px)", aspectRatio: "4/5", background: "rgba(255,255,255,0.12)", borderRadius: "8px", boxShadow: "0 16px 26px rgba(0,0,0,0.10)", pointerEvents: "none" }} />

              {activeInfo ? (
                <>
                  {activeInfo.emoji} {getCategoryLabel(activeInfo.key, activeInfo.label, language)}
                </>
              ) : null}
              <motion.div aria-hidden animate={{ y: [0, 10, 0], opacity: [0.3, 0.65, 0.3], scale: [0.8, 1.1, 0.8] }} transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }} style={{ position: "absolute", left: "10%", bottom: "12%", width: "16px", height: "16px", borderRadius: "999px", background: "rgba(255,255,255,0.5)", boxShadow: "0 0 20px rgba(255,255,255,0.6)" }} />
              <motion.div aria-hidden animate={{ y: [0, -8, 0], opacity: [0.4, 0.7, 0.4] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1.5 }} style={{ position: "absolute", top: "35%", right: "18%", width: "8px", height: "8px", borderRadius: "999px", background: "rgba(255,255,255,0.6)", boxShadow: "0 0 16px rgba(255,200,150,0.5)" }} />
              {activeInfo ? getCategoryDescription(activeInfo.key, activeInfo.description, language) : null}
              <div style={{ position: "relative", width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <motion.div
                  aria-hidden
                  initial={{ opacity: 0, x: -20, y: 24, rotateZ: -10, scale: 0.92 }}
                  animate={{ opacity: 0.7, x: -20, y: 24, rotateZ: -10, scale: 0.92 }}
                  transition={{ duration: 0.9, delay: 0.42, ease: [0.22, 1, 0.36, 1] }}
                  style={{ position: "absolute", left: "2%", top: "18%", width: "min(34vw, 250px)", pointerEvents: "none" }}
                >
                  <PolaroidCard product={previousHero} compact loading="eager" />
                </motion.div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={heroIndex}
                    initial={{ opacity: 0, x: 50, y: 24, rotateZ: 8, scale: 0.93 }}
                    animate={{ opacity: 1, x: 0, y: 0, rotateZ: 2, scale: 1 }}
                    exit={{ opacity: 0, x: -50, y: -20, rotateZ: -10, scale: 0.92 }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    style={{ position: "relative", zIndex: 2, width: "min(100%, 460px)" }}
                  >
                    <PolaroidCard product={currentHero} accent={heroAccent} loading="eager" />
                  </motion.div>
                </AnimatePresence>

                <motion.div
                  aria-hidden
                  initial={{ opacity: 0, x: 24, y: 18, rotateZ: 12, scale: 0.9 }}
                  animate={{ opacity: 0.45, x: 24, y: 18, rotateZ: 12, scale: 0.9 }}
                  transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  style={{ position: "absolute", right: "2%", bottom: "8%", width: "min(34vw, 250px)", pointerEvents: "none" }}
                >
                  <PolaroidCard product={nextHero} compact loading="eager" />
                </motion.div>
              </div>

              <div style={{ position: "absolute", left: "50%", bottom: "-4px", transform: "translateX(-50%)", display: "inline-flex", alignItems: "center", gap: "10px", padding: "10px 14px", borderRadius: "999px", backgroundColor: "rgba(249,249,247,0.16)", backdropFilter: "blur(8px)", color: "#fff", fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                <span style={{ width: "28px", height: "1px", backgroundColor: "rgba(255,255,255,0.55)" }} />
                {language === "id" ? "scroll untuk berganti frame" : "scroll to change frame"}
                <span style={{ width: "28px", height: "1px", backgroundColor: "rgba(255,255,255,0.55)" }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: "0 clamp(24px, 8vw, 120px)" }}>
        <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} style={{ marginBottom: "68px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "28px", maxWidth: "860px" }}>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "9px", letterSpacing: "0.14em", textTransform: "uppercase", color: "#999", margin: 0 }}>
              {language === "id" ? "Koleksi Pilihan" : "Selected Collection"}
            </p>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(28px, 4vw, 48px)", lineHeight: 1, margin: 0, color: "#1a1a1a" }}>
              {language === "id" ? "Jelajahi koleksi, lihat ringkasan, lalu buka preview detail tiap kategori." : "Explore collections, view summaries, then open detailed previews for each category."}
            </h2>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "16px", lineHeight: 1.8, color: "#555", margin: 0, maxWidth: "720px" }}>
              {language === "id" ? "Klik kartu kategori untuk melihat isi produk, lalu lanjut ke katalog lengkap jika ingin detail lebih banyak." : "Click a category card to see products, then continue to the full catalog for more details."}
            </p>
          </div>

          <div style={{ marginBottom: "12px", display: "flex", flexWrap: "wrap", gap: "10px" }}>
            <button
              type="button"
              onClick={() => {
                setActiveCategory("all");
                setShowAll(false);
              }}
              style={{
                border: `1px solid ${activeCategory === "all" ? "#1a1a1a" : "rgba(0,0,0,0.12)"}`,
                background: activeCategory === "all" ? "#1a1a1a" : "#fff",
                color: activeCategory === "all" ? "#fff" : "#666",
                borderRadius: "999px",
                padding: "8px 14px",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "10px",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                cursor: "pointer",
              }}
            >
              {language === "id" ? "Semua" : "All"} ({products.length})
            </button>
            {categoriesWithProducts.map((category) => {
              const isActive = activeCategory === category.key;
              return (
                <button
                  key={category.key}
                  type="button"
                  onClick={() => {
                    setActiveCategory(category.key);
                    setShowAll(false);
                  }}
                  style={{
                    border: `1px solid ${isActive ? getCategoryAccent(category.key) : "rgba(0,0,0,0.12)"}`,
                    background: isActive ? getCategoryAccent(category.key) : "#fff",
                    color: isActive ? "#fff" : "#666",
                    borderRadius: "999px",
                    padding: "8px 14px",
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "10px",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                  }}
                >
                  {getCategoryLabel(category.key, category.label, language)} ({category.count})
                </button>
              );
            })}
          </div>

          {activeInfo && (
            <motion.div key={activeInfo.key} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.4 }} style={{ padding: "32px 40px", backgroundColor: "rgba(0,0,0,0.02)", borderLeft: `4px solid ${getCategoryAccent(activeInfo.key)}`, borderRadius: "12px" }}>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "32px", fontWeight: 500, color: "#1a1a1a", margin: "0 0 12px 0", letterSpacing: "-0.01em" }}>
                {activeInfo.emoji} {activeInfo.label}
              </p>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "16px", color: "#555", lineHeight: 1.8, margin: "0 0 16px 0", maxWidth: "800px" }}>
                {activeInfo.description}
              </p>
              {activeInfo.noted && <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "#888", margin: "12px 0 0 0", lineHeight: 1.6 }}>💡 {activeInfo.noted}</p>}

            </motion.div>
          )}
        </motion.section>

        {/* Product grid */}
        <div style={{ marginTop: 20, marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <p style={{ margin: 0, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#666", letterSpacing: "0.12em", textTransform: "uppercase" }}>{language === "id" ? "Produk" : "Products"}</p>
            <div style={{ marginLeft: "auto" }}>
              <button onClick={() => setShowAll((s) => !s)} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, padding: "8px 12px", borderRadius: 8, border: "1px solid rgba(0,0,0,0.12)", background: showAll ? "#1a1a1a" : "transparent", color: showAll ? "#fff" : "#666", cursor: "pointer" }}>{showAll ? (language === "id" ? "Tampilkan sedikit" : "Show less") : (language === "id" ? "Lihat semua" : "Show all")}</button>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 260px))", justifyContent: "center", justifyItems: "stretch", gap: 18 }}>
            {displayedProducts && displayedProducts.length > 0 ? (
              displayedProducts.map((p, idx) => {
                // Calculate if product is on the last row with odd count
                const itemsPerRow = Math.max(1, Math.floor((typeof window !== "undefined" ? window.innerWidth : 1200) / 280));
                const totalRows = Math.ceil(displayedProducts.length / itemsPerRow);
                const currentRow = Math.floor(idx / itemsPerRow) + 1;
                const isLastRow = currentRow === totalRows;
                const itemsInLastRow = displayedProducts.length % itemsPerRow || itemsPerRow;
                const shouldCenter = isLastRow && itemsInLastRow % 2 === 1;

                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedProduct(p)}
                    style={{
                      cursor: "pointer",
                      ...(shouldCenter && idx === displayedProducts.length - 1
                        ? { gridColumn: `${Math.floor(itemsPerRow / 2) + 1} / span 1`, justifySelf: "center" }
                        : {})
                    }}
                  >
                    <ProductCard product={p} onClick={() => setSelectedProduct(p)} />
                  </div>
                );
              })
            ) : (
              <div style={{ color: "#999", fontFamily: "'Inter', sans-serif" }}>{language === "id" ? "Tidak ada produk untuk ditampilkan." : "No products to display."}</div>
            )}
          </div>
        </div>

        <div style={{ marginTop: 28 }}>
          <AnimatedPetals />
        </div>

        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.8 }} style={{ marginTop: "84px", marginBottom: "60px", paddingBottom: "60px" }}>
          <div style={{ textAlign: "center", marginBottom: "34px" }}>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(30px, 5vw, 52px)", fontWeight: 400, color: "#1a1a1a", margin: "0 0 14px 0", letterSpacing: "0.02em" }}>
              {language === "id" ? "Setiap Polaroid Menceritakan Kisah" : "Every Polaroid Tells a Story"}
            </p>
            <p style={{ maxWidth: "720px", margin: "0 auto", color: "#555", fontFamily: "'Inter', sans-serif", fontSize: "16px", lineHeight: 1.8 }}>
              {language === "id" ? "Setiap kartu dibuat lebih besar, sedikit acak, dan bergerak seperti tumpukan polaroid yang hidup. Siluet lembut di belakangnya memberi kesan layered yang lebih mewah." : "Each card is made larger, slightly randomized, and moves like a living stack of polaroids. Soft silhouettes behind them create a more luxurious layered feel."}
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 260px))", justifyContent: "center", justifyItems: "stretch", gap: "22px", alignItems: "start" }}>
            {polaroidCards.length > 0 ? (
              polaroidCards.map(({ product: p, category, index, rotate, x, y, delay }) => (
                <motion.button
                  key={p.id}
                  type="button"
                  onClick={() => { setSelectedCategory(p.category); setSelectedProduct(null); }}
                  initial={{ opacity: 0, y: 34, rotate: rotate - 3, x: x - 8 }}
                  whileInView={{ opacity: 1, y: 0, rotate, x }}
                  whileHover={{ scale: 1.06, y: -8, rotate: rotate + 1.5 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.7, delay: delay + index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    border: "none",
                    background: "transparent",
                    padding: 0,
                    cursor: "pointer",
                    position: "relative",
                    width: "100%",
                    maxWidth: "280px",
                    justifySelf: "center",
                  }}
                >
                  <motion.div
                    aria-hidden
                    animate={{ x: [0, 8, 0], y: [0, -4, 0], opacity: [0.28, 0.42, 0.28] }}
                    transition={{ duration: 6 + index * 0.5, repeat: Infinity, ease: "easeInOut", delay: delay }}
                    style={{
                      position: "absolute",
                      inset: "12% 10% 10% 10%",
                      borderRadius: "999px",
                      background: `radial-gradient(circle, ${getCategoryAccent(p.category)} 0%, rgba(255,255,255,0) 68%)`,
                      filter: "blur(34px)",
                      zIndex: 0,
                      pointerEvents: "none",
                    }}
                  />
                  <motion.div
                    aria-hidden
                    animate={{ rotate: [0, 3, 0, -2, 0] }}
                    transition={{ duration: 8 + index * 0.35, repeat: Infinity, ease: "easeInOut", delay: delay * 0.5 }}
                    style={{
                      position: "absolute",
                      inset: "8% 10% 4% 10%",
                      borderRadius: "50%",
                      background: "rgba(0,0,0,0.08)",
                      filter: "blur(10px)",
                      transform: "scale(0.9)",
                      zIndex: 1,
                      pointerEvents: "none",
                    }}
                  />
                  <div style={{ position: "relative", zIndex: 2 }}>
                    <PolaroidCard product={p} compact={false} />
                    <div
                      style={{
                        position: "absolute",
                        left: "12px",
                        top: "12px",
                        borderRadius: "999px",
                        padding: "4px 10px",
                        background: "rgba(255,255,255,0.92)",
                        color: "#1a1a1a",
                        border: "1px solid rgba(0,0,0,0.08)",
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "9px",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        pointerEvents: "none",
                      }}
                    >
                      {category.emoji} {getCategoryLabel(category.key, category.label, language)}
                    </div>
                    <div style={{ position: "absolute", top: "12px", right: "12px", width: "28px", height: "28px", borderRadius: "999px", background: "rgba(255,255,255,0.9)", border: "1px solid rgba(0,0,0,0.08)", display: "flex", alignItems: "center", justifyContent: "center", color: getCategoryAccent(p.category), boxShadow: "0 8px 18px rgba(0,0,0,0.08)", pointerEvents: "none" }}>
                      ↗
                    </div>
                  </div>
                </motion.button>
              ))
            ) : (
              <div style={{ color: "#999", fontFamily: "'Inter', sans-serif" }}>{language === "id" ? "Tidak ada produk untuk ditampilkan." : "No products to display."}</div>
            )}
          </div>
        </motion.section>
      </div>

      <AnimatePresence>
        {selectedProduct && (
          <ProductDetailModal
            key={selectedProduct.id}
            product={selectedProduct}
            allProducts={displayedProducts}
            onClose={() => setSelectedProduct(null)}
            onNavigate={setSelectedProduct}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {selectedCategoryInfo && (
          <CategoryPreviewModal
            category={selectedCategoryInfo}
            products={selectedCategoryProducts}
            onClose={() => setSelectedCategory(null)}
            onSelectProduct={(product) => {
              setSelectedProduct(product);
              setSelectedCategory(null);
            }}
          />
        )}
      </AnimatePresence>
      <Footer />
      <ScrollToTop />
    </PageTransition>
  );
}

function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, y: 20, x: "-50%" }}
          whileHover={{ scale: 1.1, y: -5 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          style={{
            position: "fixed",
            bottom: "30px",
            left: "50%",
            zIndex: 9999,
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "64px",
              borderRadius: "20px",
              border: "2px solid rgba(255, 255, 255, 0.4)",
              backgroundColor: "rgba(26, 26, 26, 0.4)",
              backdropFilter: "blur(12px)",
              display: "flex",
              justifyContent: "center",
              paddingTop: "10px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <motion.div
              animate={{
                y: [0, 15, 0],
                opacity: [1, 0.5, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                width: "4px",
                height: "10px",
                backgroundColor: "#fff",
                borderRadius: "2px",
              }}
            />
            {/* Pulsing rings around the mouse icon */}
            <motion.div
              animate={{ scale: [1, 1.4, 1], opacity: [0, 0.3, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "20px",
                border: "1px solid #fff",
                pointerEvents: "none",
              }}
            />
          </div>
          <span style={{ 
            fontFamily: "'JetBrains Mono', monospace", 
            fontSize: "9px", 
            color: "#fff", 
            textTransform: "uppercase", 
            letterSpacing: "0.1em",
            textShadow: "0 2px 4px rgba(0,0,0,0.3)",
            backgroundColor: "rgba(0,0,0,0.2)",
            padding: "2px 8px",
            borderRadius: "4px",
            backdropFilter: "blur(4px)"
          }}>
            Back to Top
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function PolaroidCard({ product, accent, compact = false, loading = "lazy" }: { product: Product; accent?: string; compact?: boolean; loading?: "lazy" | "eager" }) {
  const [language] = useLanguage();
  const frameAccent = accent || "#b85c3b";
  const displayName = getProductDisplayName(product, language);

  return (
    <div
      style={{
        backgroundColor: "#fff",
        padding: compact ? "10px 10px 14px" : "12px 12px 18px",
        boxShadow: compact ? "0 16px 34px rgba(0,0,0,0.18)" : "0 28px 64px rgba(0,0,0,0.30)",
        width: "100%",
        borderRadius: "2px",
        transform: compact ? "rotate(0deg)" : "rotate(2deg)",
      }}
    >
      <div
        style={{
          width: "100%",
          aspectRatio: "4 / 5",
          overflow: "hidden",
          backgroundColor: "#f3f0eb",
          position: "relative",
          borderRadius: "1px",
        }}
      >
        <img
          src={(product.images && product.images[0]) || product.image}
          alt={displayName}
          loading={loading}
          decoding={loading === "eager" ? "sync" : "async"}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
          onError={(e) => {
            e.currentTarget.src = `https://placehold.co/800x1000/f3f0eb/1a1a1a?text=${encodeURIComponent(displayName)}`;
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(0,0,0,0.02) 100%)",
            pointerEvents: "none",
          }}
        />
      </div>
      <div style={{ padding: compact ? "10px 4px 0" : "14px 6px 0", textAlign: "center" }}>
        <p
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: compact ? "12px" : "14px",
            fontStyle: "italic",
            color: frameAccent,
            margin: "0 0 4px 0",
            lineHeight: 1.25,
          }}
        >
          {displayName}
        </p>
        <p
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: compact ? "9px" : "10px",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: compact ? "#9f9f9f" : "rgba(26,26,26,0.55)",
            margin: 0,
            lineHeight: 1.5,
          }}
        >
          {compact ? (language === "id" ? "Pratinjau frame" : "Preview frame") : product.priceLabel || (language === "id" ? "Frame polaroid" : "Polaroid frame")}
        </p>
      </div>
    </div>
  );
}

function ProductCard({ product, onClick }: { product: Product; onClick: () => void }) {
  const [language] = useLanguage();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const displayName = getProductDisplayName(product, language);
  const description = getProductDescription(product, language);
  const priceLabel = getProductPriceLabel(product, language);
  const images = product.images && product.images.length > 0 ? product.images : product.image ? [product.image] : [];
  const hasMultipleImages = images.length > 1;
  const currentImage = images[currentImageIndex] || product.image;

  const accentMap: Record<ProductCategory, string> = {
    "buket-satin": "#d48a6a",
    "snack-bouquet": "#c98b3f",
    "money-bouquet": "#7d5ba6",
    "chocolate-bouquet": "#7a4f2c",
    "fresh-flower": "#c05d5d",
    "artificial-flower": "#4f8f7a",
    "catalog-home": "#b85c3b",
    "accessories": "#8a6a52",
    "buckets": "#b85c3b",
    "wreaths": "#7a8f4f",
    "packaging": "#6f6f8d",
    "ribbons": "#b66aa0",
    "sewa": "#5a8fa6",
    "bloom-box": "#d48a6a",
    "thumbelina": "#c98b3f",
    "bucket-unik": "#b85c3b",
    "vas-dekorasi": "#4f8f7a",
  };
  const accent = accentMap[product.category] || "#999";

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((i) => (i - 1 + images.length) % images.length);
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((i) => (i + 1) % images.length);
  };

  return (
    <button
      onClick={onClick}
      style={{
        border: "none",
        background: "transparent",
        padding: 0,
        width: "100%",
        textAlign: "left",
        cursor: "pointer",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        <div
          style={{
            position: "relative",
            aspectRatio: "4/5",
            overflow: "hidden",
            backgroundColor: "#ebebe9",
            borderRadius: "2px",
          }}
        >
          <img
            src={currentImage}
            alt={displayName}
            loading="lazy"
            decoding="async"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
            onError={(e) => {
              e.currentTarget.src = `https://placehold.co/800x1000/ebebe9/1a1a1a?text=${encodeURIComponent(displayName)}`;
            }}
          />
          {/* Image counter - no arrows in card view, arrows only in popup */}
          {hasMultipleImages && (
            <div
              style={{
                position: "absolute",
                bottom: "8px",
                left: "50%",
                transform: "translateX(-50%)",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                padding: "4px 8px",
                borderRadius: "999px",
                backgroundColor: "rgba(0,0,0,0.4)",
                color: "#fff",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "8px",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              {currentImageIndex + 1}/{images.length}
            </div>
          )}
        </div>
        <div style={{ paddingRight: "6px" }}>
          <p
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "9px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: accent,
              margin: "0 0 6px 0",
            }}
          >
            {getCategoryLabel(product.category, product.category, language)}
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "12px",
              alignItems: "baseline",
            }}
          >
            <h3
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "20px",
                fontWeight: 500,
                margin: 0,
                color: "#1a1a1a",
                lineHeight: 1.05,
                flex: "1 1 auto",
              }}
            >
              {displayName}
            </h3>
            <div style={{ flex: "0 1 auto" }}>
              {renderPriceDisplay(product, language)}
            </div>
          </div>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "14px",
              margin: "6px 0 0 0",
              color: "#555",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
            title={product.description}
          >
            {truncateDescription(description, 100) || (language === "id" ? "Hadiah premium untuk momen istimewa." : "Premium gifts for special moments.")}
          </p>
        </div>
      </div>
    </button>
  );
}

function ProductDetailModal({ product, onClose, allProducts, onNavigate }: { product: Product; onClose: () => void; allProducts?: Product[]; onNavigate?: (p: Product) => void }) {
  const [language] = useLanguage();
  const displayName = getProductDisplayName(product, language);
  const description = getProductDescription(product, language);
  const priceLabel = getProductPriceLabel(product, language);
  const images = product.images && product.images.length > 0 ? product.images : product.image ? [product.image] : [];
  const carouselImages = images.length > 0 ? images : [`https://placehold.co/600x800/ebebe9/1a1a1a?text=${encodeURIComponent(displayName)}`];
  const autoplayRef = useRef(Autoplay({ delay: 3000, stopOnInteraction: false, stopOnMouseEnter: true }));
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: carouselImages.length > 1 },
    carouselImages.length > 1 ? [autoplayRef.current] : [],
  );
  const categoryInfo = categories.find((cat) => cat.key === product.category);
  const [isMobile, setIsMobile] = useState(() => (typeof window !== "undefined" ? window.innerWidth < 768 : false));
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  // Product navigation
  const currentIndex = allProducts ? allProducts.findIndex((p) => p.id === product.id) : -1;
  const canNavigatePrev = allProducts ? currentIndex > 0 : false;
  const canNavigateNext = allProducts ? currentIndex < allProducts.length - 1 : false;
  const prevProduct = canNavigatePrev && allProducts ? allProducts[currentIndex - 1] : null;
  const nextProduct = canNavigateNext && allProducts ? allProducts[currentIndex + 1] : null;

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    const updateControls = () => {
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
    };

    updateControls();
    emblaApi.on("select", updateControls);
    emblaApi.on("reInit", updateControls);
    return () => {
      emblaApi.off("select", updateControls);
      emblaApi.off("reInit", updateControls);
    };
  }, [emblaApi]);

  return createPortal(
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: "fixed", inset: 0, zIndex: 999999, backgroundColor: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: isMobile ? "8px" : "clamp(16px, 3vw, 32px)", overflow: "hidden" }} onClick={onClose}>
      
      {/* Previous Product Silhouette */}
      {!isMobile && onNavigate && prevProduct && (
        <button onClick={(e) => { e.stopPropagation(); onNavigate(prevProduct); }} style={{ position: "absolute", left: "2vw", top: "50%", transform: "translateY(-50%)", width: "80px", aspectRatio: "4/5", background: `url(${prevProduct.images?.[0] || prevProduct.image}) center/cover`, borderRadius: "12px", border: "2px solid rgba(255,255,255,0.4)", cursor: "pointer", opacity: 0.6, filter: "brightness(0.6) blur(2px)", transition: "all 0.3s ease", zIndex: 10 }} onMouseEnter={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.filter = "brightness(1) blur(0px)"; e.currentTarget.style.transform = "translateY(-50%) scale(1.05)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.9)"; }} onMouseLeave={(e) => { e.currentTarget.style.opacity = "0.6"; e.currentTarget.style.filter = "brightness(0.6) blur(2px)"; e.currentTarget.style.transform = "translateY(-50%) scale(1)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)"; }} />
      )}

      {/* Next Product Silhouette */}
      {!isMobile && onNavigate && nextProduct && (
        <button onClick={(e) => { e.stopPropagation(); onNavigate(nextProduct); }} style={{ position: "absolute", right: "2vw", top: "50%", transform: "translateY(-50%)", width: "80px", aspectRatio: "4/5", background: `url(${nextProduct.images?.[0] || nextProduct.image}) center/cover`, borderRadius: "12px", border: "2px solid rgba(255,255,255,0.4)", cursor: "pointer", opacity: 0.6, filter: "brightness(0.6) blur(2px)", transition: "all 0.3s ease", zIndex: 10 }} onMouseEnter={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.filter = "brightness(1) blur(0px)"; e.currentTarget.style.transform = "translateY(-50%) scale(1.05)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.9)"; }} onMouseLeave={(e) => { e.currentTarget.style.opacity = "0.6"; e.currentTarget.style.filter = "brightness(0.6) blur(2px)"; e.currentTarget.style.transform = "translateY(-50%) scale(1)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)"; }} />
      )}

      <motion.div initial={{ y: 40, scale: 0.95 }} animate={{ y: 0, scale: 1 }} exit={{ y: 20, scale: 0.95 }} transition={{ type: "spring", damping: 25, stiffness: 300 }} onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: isMobile ? "100%" : "900px", backgroundColor: "#F9F9F7", display: "flex", flexDirection: isMobile ? "column" : "row", maxHeight: isMobile ? "calc(100dvh - 16px)" : "88vh", overflow: "hidden", position: "relative", boxShadow: "0 24px 60px rgba(0,0,0,0.28)", borderRadius: isMobile ? "16px" : "20px", zIndex: 20 }}>
        {/* Navigation Buttons (Mobile Only) */}
        {isMobile && onNavigate && allProducts && allProducts.length > 1 && (
          <>
            <button
              onClick={() => prevProduct && onNavigate(prevProduct)}
              disabled={!canNavigatePrev}
              aria-label={language === "id" ? "Produk sebelumnya" : "Previous product"}
              style={{ position: "absolute", top: "14px", left: "14px", zIndex: 12, width: "36px", height: "36px", borderRadius: "999px", border: "none", background: "rgba(255,255,255,0.9)", cursor: canNavigatePrev ? "pointer" : "not-allowed", fontSize: "20px", fontWeight: "bold", display: "flex", alignItems: "center", justifyContent: "center", opacity: canNavigatePrev ? 1 : 0.4 }}
            >
              ‹
            </button>
            <button
              onClick={() => nextProduct && onNavigate(nextProduct)}
              disabled={!canNavigateNext}
              aria-label={language === "id" ? "Produk selanjutnya" : "Next product"}
              style={{ position: "absolute", top: "14px", left: "58px", zIndex: 12, width: "36px", height: "36px", borderRadius: "999px", border: "none", background: "rgba(255,255,255,0.9)", cursor: canNavigateNext ? "pointer" : "not-allowed", fontSize: "20px", fontWeight: "bold", display: "flex", alignItems: "center", justifyContent: "center", opacity: canNavigateNext ? 1 : 0.4 }}
            >
              ›
            </button>
          </>
        )}
        <button onClick={onClose} aria-label={language === "id" ? "Tutup" : "Close"} style={{ position: "absolute", top: "14px", right: "14px", zIndex: 12, width: "36px", height: "36px", borderRadius: "999px", border: "none", background: "rgba(255,255,255,0.9)", cursor: "pointer", fontSize: "20px", fontWeight: "bold", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
        <div style={{ flex: isMobile ? "0 0 240px" : "1 1 400px", minHeight: isMobile ? "200px" : "300px", aspectRatio: isMobile ? "4 / 3" : undefined, position: "relative", backgroundColor: "#ebebe9", overflow: "hidden", flexShrink: 0 }}>
          <div className="embla" ref={emblaRef} style={{ width: "100%", height: "100%" }}>
            <div className="embla__container" style={{ display: "flex", width: "100%", height: "100%" }}>
              {carouselImages.map((img, index) => (
                <div key={index} className="embla__slide" style={{ flex: "0 0 100%", height: "100%", minWidth: 0, position: "relative" }}>
                  <img src={img} alt={`${displayName} ${index + 1}`} loading={index === 0 ? "eager" : "lazy"} decoding="async" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} onError={(e) => { e.currentTarget.src = `https://placehold.co/600x800/ebebe9/1a1a1a?text=${encodeURIComponent(displayName)}`; }} />
                </div>
              ))}
            </div>
          </div>
          {carouselImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => emblaApi?.scrollPrev()}
                aria-label={language === "id" ? "Gambar sebelumnya" : "Previous image"}
                disabled={!canScrollPrev}
                style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", width: "42px", height: "42px", borderRadius: "999px", border: "1px solid rgba(0,0,0,0.08)", background: "rgba(255,255,255,0.88)", color: "#1a1a1a", cursor: canScrollPrev ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", boxShadow: "0 10px 24px rgba(0,0,0,0.12)", opacity: canScrollPrev ? 1 : 0.35 }}>
                ‹
              </button>
              <button
                type="button"
                onClick={() => emblaApi?.scrollNext()}
                aria-label={language === "id" ? "Gambar selanjutnya" : "Next image"}
                disabled={!canScrollNext}
                style={{ position: "absolute", right: "16px", top: "50%", transform: "translateY(-50%)", width: "42px", height: "42px", borderRadius: "999px", border: "1px solid rgba(0,0,0,0.08)", background: "rgba(255,255,255,0.88)", color: "#1a1a1a", cursor: canScrollNext ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", boxShadow: "0 10px 24px rgba(0,0,0,0.12)", opacity: canScrollNext ? 1 : 0.35 }}>
                ›
              </button>
            </>
          )}
        </div>
        <div style={{ flex: "1 1 280px", padding: isMobile ? "16px 18px" : "28px", display: "flex", flexDirection: "column", gap: "12px", justifyContent: "flex-start", overflow: "auto", overscrollBehavior: "contain" }}>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "9px", color: "#999", textTransform: "uppercase", margin: 0 }}>{getCategoryLabel(product.category, categoryInfo?.label || product.category, language)}</p>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isMobile ? "clamp(28px, 8vw, 36px)" : "clamp(32px, 4vw, 50px)", lineHeight: 1, margin: 0, color: "#1a1a1a" }}>{displayName}</h2>
          <p style={{ fontFamily: "'Inter', sans-serif", color: "#555", lineHeight: 1.8, margin: 0 }}>
            {description || getCategoryDescription(product.category, categoryInfo?.description || "", language) || (language === "id" ? "Detail produk ini tersedia di katalog lengkap dan bisa dibuka dari tombol di bawah." : "This product detail is available in the full catalog and can be opened using the button below.")}
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {renderPriceDisplayWithPromo(product, language)}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "8px" }}>
            {(() => {
              const cfg = getSiteConfig();
              const imgUrl = product.images?.[0] || product.image || "";
              const productUrl = typeof window !== 'undefined' ? window.location.origin : '';
              const msg = `Halo ${cfg.businessName}! 🌸\n\nSaya tertarik untuk memesan:\n\n📦 Produk: ${displayName}\n💰 Harga: ${product.priceLabel || formatRupiah(product.price)}\n${product.description ? `📝 Detail: ${product.description.substring(0, 100)}\n` : ""}${imgUrl ? `🖼️ Foto: ${imgUrl.startsWith('data:') ? '(lihat di website)' : imgUrl}\n` : ""}${productUrl ? `🌐 Website: ${productUrl}\n` : ""}\nBisa dibantu untuk proses pemesanannya? Terima kasih! 🙏`;
              
              const baseLink1 = `https://wa.me/${cfg.whatsappNumber}?text=${encodeURIComponent(msg)}`;
              const baseLink2 = cfg.whatsappNumber2 ? `https://wa.me/${cfg.whatsappNumber2}?text=${encodeURIComponent(msg)}` : "";
              const btnStyle = { display: "inline-block", flex: isMobile ? "1 1 100%" : "1 1 0", padding: "14px 22px", backgroundColor: "#25D366", color: "#fff", textDecoration: "none", textAlign: "center" as const, borderRadius: "10px", fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase" as const, boxShadow: "0 6px 16px rgba(37,211,102,0.3)", transition: "all 0.2s ease" };

              return (
                <>
                  <a href={baseLink1} target="_blank" rel="noopener noreferrer" style={btnStyle}>
                    💬 {cfg.whatsappNumber2 ? (language === "id" ? "Pesan via Pusat/Madura" : "Order via HQ/Madura") : (language === "id" ? "Pesan via WhatsApp" : "Order via WhatsApp")}
                  </a>
                  {cfg.whatsappNumber2 && (
                    <a href={baseLink2} target="_blank" rel="noopener noreferrer" style={btnStyle}>
                      💬 {language === "id" ? "Pesan via Surabaya" : "Order via Surabaya"}
                    </a>
                  )}
                </>
              );
            })()}
          </div>
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
}

function CollectionCategoryCard({
  label,
  emoji,
  description,
  count,
  accent,
  active,
  onClick,
  noted,
}: {
  label: string;
  emoji: string;
  description: string;
  count: number;
  accent: string;
  active: boolean;
  onClick: () => void;
  noted?: string;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      aria-pressed={active}
      style={{
        border: `1px solid ${active ? accent : "rgba(0,0,0,0.10)"}`,
        background: active ? "rgba(184,92,59,0.06)" : "rgba(255,255,255,0.82)",
        color: "#1a1a1a",
        borderRadius: "18px",
        padding: "20px 18px",
        textAlign: "left",
        cursor: "pointer",
        boxShadow: active ? "0 16px 36px rgba(0,0,0,0.08)" : "0 10px 24px rgba(0,0,0,0.04)",
        backdropFilter: "blur(10px)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", alignItems: "flex-start" }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
            <span style={{ fontSize: "18px" }}>{emoji}</span>
            <p style={{ margin: 0, fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", color: accent, fontWeight: 700 }}>
              {count} {"produk"}
            </p>
          </div>
          <h3 style={{ margin: "0 0 8px 0", fontFamily: "'Cormorant Garamond', serif", fontSize: "28px", lineHeight: 1, fontWeight: 600 }}>
            {label}
          </h3>
          <p style={{ margin: 0, color: "#5f5f5f", fontFamily: "'Inter', sans-serif", fontSize: "14px", lineHeight: 1.7 }}>
            {description}
          </p>
          {noted && <p style={{ margin: "10px 0 0 0", color: "#8a6d3b", fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", letterSpacing: "0.04em" }}>💡 {noted}</p>}
        </div>
        <span aria-hidden style={{ color: accent, fontSize: "18px", fontWeight: 700 }}>↗</span>
      </div>
      <div style={{ marginTop: "16px", display: "inline-flex", alignItems: "center", gap: "8px", padding: "8px 12px", borderRadius: "999px", background: "rgba(0,0,0,0.04)", fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", letterSpacing: "0.08em", textTransform: "uppercase", color: accent }}>
        Lihat preview
      </div>
    </motion.button>
  );
}

function CategoryPreviewModal({
  category,
  products,
  onClose,
  onSelectProduct,
}: {
  category: Category;
  products: Product[];
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
}) {
  const [language] = useLanguage();
  const previewProducts = products.slice(0, 6);
  const [isMobile, setIsMobile] = useState(() => (typeof window !== "undefined" ? window.innerWidth < 900 : false));

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 900);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return createPortal(
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: "fixed", inset: 0, zIndex: 999999, backgroundColor: "rgba(0,0,0,0.58)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: isMobile ? "8px" : "clamp(16px, 4vw, 40px)", overflow: "hidden" }} onClick={onClose}>
    <motion.div initial={{ y: 40, scale: 0.96 }} animate={{ y: 0, scale: 1 }} exit={{ y: 20, scale: 0.96 }} transition={{ type: "spring", damping: 25, stiffness: 280 }} onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: "980px", backgroundColor: "#F9F9F7", display: "grid", gridTemplateColumns: isMobile ? "minmax(0, 1fr)" : "minmax(0, 1.05fr) minmax(320px, 0.95fr)", height: isMobile ? "calc(100dvh - 16px)" : "88vh", maxHeight: isMobile ? "calc(100dvh - 16px)" : "900px", overflow: "hidden", position: "relative", boxShadow: "0 24px 60px rgba(0,0,0,0.22)", borderRadius: isMobile ? "16px" : "20px" }}>
        <button onClick={onClose} aria-label={language === "id" ? "Tutup" : "Close"} style={{ position: "absolute", top: "16px", right: "16px", zIndex: 10, width: "36px", height: "36px", borderRadius: "999px", border: "none", background: "rgba(255,255,255,0.92)", cursor: "pointer" }}>×</button>
        <div style={{ minHeight: 0, padding: isMobile ? "18px" : "28px", background: "linear-gradient(180deg, rgba(184,92,59,0.10), rgba(249,249,247,0.02))", overflow: "auto", overscrollBehavior: "contain" }}>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "9px", color: "#999", textTransform: "uppercase", letterSpacing: "0.12em", margin: 0 }}>
            {language === "id" ? "Preview kategori" : "Category preview"}
          </p>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isMobile ? "clamp(28px, 8vw, 38px)" : "clamp(32px, 4vw, 52px)", lineHeight: 1, margin: "10px 0 12px 0", color: "#1a1a1a" }}>
            {category.emoji} {getCategoryLabel(category.key, category.label, language)}
          </h2>
          <p style={{ fontFamily: "'Inter', sans-serif", color: "#555", lineHeight: 1.8, margin: 0 }}>
            {getCategoryDescription(category.key, category.description, language)}
          </p>
          {category.noted && <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "#8a6d3b", margin: "14px 0 0 0", lineHeight: 1.6 }}>💡 {category.noted}</p>}

          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "22px" }}>
            <div style={{ padding: "10px 14px", borderRadius: "999px", background: "rgba(0,0,0,0.05)", fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", letterSpacing: "0.08em", textTransform: "uppercase", color: "#666" }}>
              {products.length} {language === "id" ? "produk tersedia" : "products available"}
            </div>

          </div>

          <div style={{ marginTop: "24px", display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${isMobile ? "120px" : "140px"}, 1fr))`, gap: "14px" }}>
            {previewProducts.map((product) => (
              (() => {
                const previewName = getProductDisplayName(product, language);
                return (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => onSelectProduct(product)}
                    style={{
                      border: "1px solid rgba(0,0,0,0.08)",
                      background: "#fff",
                      borderRadius: "16px",
                      padding: "10px",
                      textAlign: "left",
                      cursor: "pointer",
                      boxShadow: "0 10px 24px rgba(0,0,0,0.05)",
                    }}
                  >
                    <div style={{ aspectRatio: "4/5", overflow: "hidden", borderRadius: "12px", background: "#efefec", marginBottom: "10px" }}>
                      <img
                        src={(product.images && product.images[0]) || product.image}
                        alt={previewName}
                        loading="lazy"
                        decoding="async"
                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                        onError={(e) => {
                          e.currentTarget.src = `https://placehold.co/600x800/efefec/1a1a1a?text=${encodeURIComponent(previewName)}`;
                        }}
                      />
                    </div>
                    <p style={{ margin: "0 0 4px 0", fontFamily: "'Cormorant Garamond', serif", fontSize: "18px", lineHeight: 1.1, color: "#1a1a1a" }}>{previewName}</p>
                    <p style={{ margin: 0, fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", letterSpacing: "0.08em", textTransform: "uppercase", color: "#7a7a7a" }}>{product.priceLabel}</p>
                  </button>
                );
              })()
            ))}
          </div>
        </div>

        <div style={{ minHeight: 0, padding: isMobile ? "18px" : "28px", background: "#f2ede7", overflow: "auto", overscrollBehavior: "contain", borderLeft: isMobile ? "none" : "1px solid rgba(0,0,0,0.06)", borderTop: isMobile ? "1px solid rgba(0,0,0,0.06)" : "none" }}>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "9px", color: "#999", textTransform: "uppercase", letterSpacing: "0.12em", margin: 0 }}>
            {language === "id" ? "Ringkasan isi kategori" : "Category content summary"}
          </p>
          <div style={{ marginTop: "14px", display: "grid", gap: "12px" }}>
            {products.length > 0 ? (
              products.map((product) => (
                (() => {
                  const displayName = getProductDisplayName(product, language);
                  const displayTag = getProductTag(product.tag, language);
                  return (
                    <button
                      key={product.id}
                      type="button"
                      onClick={() => onSelectProduct(product)}
                      style={{
                        border: "none",
                        background: "rgba(255,255,255,0.82)",
                        borderRadius: "14px",
                        padding: "12px 14px",
                        cursor: "pointer",
                        textAlign: "left",
                        boxShadow: "0 8px 20px rgba(0,0,0,0.04)",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", alignItems: "baseline" }}>
                        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isMobile ? "18px" : "20px", color: "#1a1a1a", lineHeight: 1.1 }}>{displayName}</span>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.08em", color: "#7a7a7a", whiteSpace: "nowrap" }}>{product.priceLabel}</span>
                      </div>
                      <p style={{ margin: "8px 0 0 0", fontFamily: "'Inter', sans-serif", fontSize: "13px", lineHeight: 1.6, color: "#666" }}>
                        {truncateDescription(getProductDescription(product, language), 90) || displayTag || (language === "id" ? "Klik untuk melihat detail produk ini." : "Click to view this product detail.")}
                      </p>
                    </button>
                  );
                })()
              ))
            ) : (
              <div style={{ color: "#777", fontFamily: "'Inter', sans-serif" }}>{language === "id" ? "Belum ada produk di kategori ini." : "No products in this category yet."}</div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
}

const CATEGORY_LABEL_EN: Record<string, string> = {
  "buket-satin": "Satin Bouquet",
  "snack-bouquet": "Snack Bouquet",
  "money-bouquet": "Money Bouquet",
  "chocolate-bouquet": "Chocolate Bouquet",
  "fresh-flower": "Fresh Flower",
  "artificial-flower": "Artificial Flower",
  "catalog-home": "Premium Packages",
  "accessories": "Accessories",
  "buckets": "Buckets",
  "wreaths": "Wreaths",
  "packaging": "Packaging",
  "ribbons": "Ribbons & Sashes",
};

const CATEGORY_DESCRIPTION_EN: Record<string, string> = {
  "buket-satin": "High-quality satin bouquets with curated blooms. Perfect for your special moments.",
  "snack-bouquet": "A unique blend of flowers and premium snacks. A memorable and functional gift.",
  "money-bouquet": "Elegant money bouquets for special occasions. Practical and meaningful.",
  "chocolate-bouquet": "Flowers paired with premium chocolate. Ideal for special gifting.",
  "fresh-flower": "Selected fresh flower arrangements with beautiful color combinations.",
  "artificial-flower": "Premium artificial flower arrangements that are elegant and long-lasting.",
  "catalog-home": "Premium packages for special events and custom needs.",
  "accessories": "Supporting accessories with elegant finishing for personalized gifts.",
  "buckets": "Medium to large bouquet collections with premium styling.",
  "wreaths": "Formal flower board arrangements for ceremonies and events.",
  "packaging": "Premium packaging add-ons to elevate gift presentation.",
  "ribbons": "Decorative sashes and ribbons tailored to event themes.",
};

const PRODUCT_NAME_EN: Record<string, string> = {
  "Akrilik Frame Mini": "Mini Acrylic Frame",
  "Sewa Per Jam Standing Akrilik Bulat": "Round Acrylic Stand Rental",
  "Bucket Aesthetic": "Aesthetic Bouquet",
  "Bucket Bunga Gradoll (Graduation Doll) Big Mesh": "Graduation Doll Bouquet (Big Mesh)",
  "Bunga Mawar Palsu": "Premium Artificial Rose Bouquet",
  "Bunga White Sedap": "White Sedap Flower Bouquet",
  "Frame Birthday Edelweis": "Edelweis Birthday Frame",
  "Mawar Candy (Bunga Asli)": "Candy Rose (Fresh Flower)",
  "Karangan Bunga": "Flower Board Arrangement",
  "Packing Luxury Elegant": "Luxury Elegant Packaging",
  "Selempang Wisuda 3 Titik": "3-Point Graduation Sash",
};

const PRODUCT_TAG_EN: Record<string, string> = {
  "Favorit Kami": "Our Favorite",
  "Populer": "Popular",
  "Eksklusif": "Exclusive",
  "Terlaris": "Best Seller",
};

function renderPriceDisplay(product: Product, language: Language) {
  if (!product.isPromo || !product.originalPrice || product.originalPrice <= product.price) {
    return (
      <p style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "11px",
        fontWeight: 600,
        color: "#b85c3b",
        margin: 0,
        whiteSpace: "nowrap",
      }}>
        {getProductPriceLabel(product, language)}
      </p>
    );
  }

  // Display promo with original price strikethrough
  const originalLabel = formatRupiah(product.originalPrice);
  const currentLabel = getProductPriceLabel(product, language);
  const discountPercent = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "10px",
          color: "#aaa",
          textDecoration: "line-through",
          fontWeight: 500,
        }}>
          {originalLabel}
        </span>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "10px",
          backgroundColor: "#ff4444",
          color: "#fff",
          padding: "2px 6px",
          borderRadius: "4px",
          fontWeight: 700,
          whiteSpace: "nowrap",
        }}>
          -{discountPercent}%
        </span>
      </div>
      <p style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "12px",
        fontWeight: 700,
        color: "#d17047",
        margin: 0,
        whiteSpace: "nowrap",
      }}>
        {currentLabel}
      </p>
    </div>
  );
}

// For popup detail: always show promo-style strikethrough price (fake original = price + 10-25%)
function renderPriceDisplayWithPromo(product: Product, language: Language) {
  const currentLabel = getProductPriceLabel(product, language);
  const currentPrice = product.price || parseInt(String(product.priceLabel || "").replace(/\D/g, ""), 10) || 0;

  // If already has explicit promo data, use it
  if (product.isPromo && product.originalPrice && product.originalPrice > product.price) {
    const originalLabel = formatRupiah(product.originalPrice);
    const discountPercent = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "#bbb", textDecoration: "line-through", fontWeight: 500 }}>{originalLabel}</span>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", backgroundColor: "#e53535", color: "#fff", padding: "2px 6px", borderRadius: "4px", fontWeight: 700 }}>-{discountPercent}%</span>
        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "15px", fontWeight: 700, color: "#d17047", margin: 0 }}>{currentLabel}</p>
      </div>
    );
  }

  // For all products, simulate a "promo" look with a fake higher original price
  if (currentPrice > 0) {
    // Add 15-25% to get "original" price, rounded to nearest 5000
    const seed = product.id ? product.id.charCodeAt(0) : 0;
    const addPercent = 15 + (seed % 11); // 15-25%
    const fakeOriginal = Math.ceil((currentPrice * (100 + addPercent)) / 100 / 5000) * 5000;
    const fakeOriginalLabel = formatRupiah(fakeOriginal);
    const discountPercent = Math.round(((fakeOriginal - currentPrice) / fakeOriginal) * 100);
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "#bbb", textDecoration: "line-through", fontWeight: 500 }}>{fakeOriginalLabel}</span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", backgroundColor: "#e53535", color: "#fff", padding: "2px 7px", borderRadius: "4px", fontWeight: 700 }}>-{discountPercent}%</span>
        </div>
        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "15px", fontWeight: 700, color: "#d17047", margin: 0 }}>{currentLabel}</p>
      </div>
    );
  }

  return (
    <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "15px", fontWeight: 700, color: "#b85c3b", margin: 0 }}>
      {currentLabel}
    </p>
  );
}

function getProductPriceLabel(product: Product, language: Language) {
  if (language === "id") return product.priceLabel || formatRupiah(product.price || 0);
  const amount = Number.isFinite(product.price) ? product.price : parseInt(String(product.priceLabel || "").replace(/\D/g, ""), 10) || 0;
  return `Rp ${amount.toLocaleString("en-US")}`;
}

function getProductDescription(product: Product, language: Language) {
  const productName = getProductDisplayName(product, language);
  const base = (product.description || "").trim();
  const localizedBase = language === "en"
    ? translateBaseDescription(base, product)
    : looksMostlyEnglish(base)
      ? ""
      : base;
  const detail = getProductDetailSentence(product, language);
  const intro = language === "id"
    ? getProductIntroId(product)
    : getProductIntroEn(product);

  return [localizedBase || intro, detail]
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ")
    .replace(new RegExp(`^${escapeRegExp(productName)}\s*`, "i"), productName + " ");
}

function translateBaseDescription(description: string, product: Product) {
  if (!description) return "";

  const productName = getProductDisplayName(product, "en" as Language);
  const replacements: Array<[RegExp, string]> = [
    [/Aksesori custom yang rapi dan estetik untuk hadiah personal\./gi, "A neat, aesthetic custom accessory for personal gifts."],
    [/Rangkaian bunga artificial premium yang awet dan tetap menawan\./gi, "A premium artificial flower arrangement that stays beautiful for a long time."],
    [/Rangkaian bunga segar pilihan dengan nuansa mewah\./gi, "A curated fresh flower arrangement with a luxurious feel."],
    [/Rangkaian bucket premium dengan komposisi yang elegan\./gi, "A premium bouquet arrangement with an elegant composition."],
    [/Kemasan premium untuk meningkatkan kesan hadiah\./gi, "Premium packaging that elevates the gift presentation."],
    [/Selempang dan pita dekoratif untuk melengkapi momen spesial\./gi, "Decorative sash and ribbon pieces that complete special moments."],
    [/Produk unggulan untuk momen hadiah yang berkesan\./gi, "A featured product for memorable gifting moments."],
    [/Bunga artificial premium yang awet dan tetap menawan\./gi, "Premium artificial flowers that remain beautiful for a long time."],
    [/Bunga segar pilihan dengan nuansa mewah\./gi, "Selected fresh flowers with a luxurious feel."],
    [/dirangkai dengan perhatian pada detail\./gi, "is arranged with close attention to detail."],
    [/Cocok untuk hadiah jangka panjang\./gi, "Ideal for long-lasting gifting."],
    [/Dirangkai rapi agar tampil cantik saat diberikan\./gi, "Neatly arranged so it looks beautiful when gifted."],
    [/Bisa request warna, tema, dan ucapan sesuai momen\./gi, "You can request colors, themes, and messages to match the occasion."],
    [/bisa request tulisan & warna bunga bisa diambil dikirim kurir ay jek/gi, "You can request wording and flower colors, with pickup or courier delivery available."],
    [/bisa request warna, foto & tulisan\./gi, "You can request colors, photos, and wording."],
    [/bisa request tulisan \+ 2 foto\./gi, "You can request wording plus two photos."],
    [/isi 7 tangkai mekar \+ tambahan kain salju 20\.000 \(120\.000\)\./gi, "contains 7 blooming stems plus an optional snow-fabric add-on."]
  ];

  let translated = description;
  for (const [pattern, replacement] of replacements) {
    translated = translated.replace(pattern, replacement);
  }

  if (/standing akrilik/i.test(product.name)) {
    translated = translated.replace(/harga sewa per 24jam/gi, "24-hour rental price");
    translated = translated.replace(/bisa untuk segala acara/gi, "suitable for all kinds of events");
  }

  if (productName && translated && !translated.includes(productName)) {
    translated = `${productName} — ${translated}`;
  }

  return translated.replace(/\s+/g, " ").trim();
}

function getProductIntroId(product: Product) {
  const name = product.name;

  if (/standing akrilik/i.test(name)) {
    return `${name} adalah pilihan display premium yang cocok untuk acara wisuda, ucapan, maupun dekorasi meja. Detail tulisan dan warna bunga bisa disesuaikan supaya tampil lebih personal.`;
  }

  if (/akrilik frame mini|frame birthday/i.test(name)) {
    return `${name} dirancang dengan tampilan clean dan estetik untuk hadiah personal. Ukuran frame, foto, dan tulisan bisa disesuaikan agar lebih berkesan.`;
  }

  if (/karangan bunga/i.test(name)) {
    return `${name} dibuat sebagai papan ucapan formal yang cocok untuk duka cita, opening, kelulusan, dan perayaan penting lainnya. Komposisi, tulisan, dan jumlah titik bisa disesuaikan.`;
  }

  if (/buket skripsi/i.test(name)) {
    return `${name} dirangkai khusus untuk momen wisuda dan sidang. Isian glitter, warna pita, dan pesan ucapan dapat dibuat sesuai permintaan.`;
  }

  if (/bunga white sedap/i.test(name)) {
    return `${name} menonjolkan kesan mewah dan segar dengan komposisi bunga asli yang rapi. Cocok untuk hadiah elegan dan acara spesial.`;
  }

  if (/mawar candy|bunga mawar medium|bunga mawar palsu|peony|rose gonie/i.test(name)) {
    return `${name} menghadirkan rangkaian yang manis, rapi, dan mudah disesuaikan dengan tema hadiah. Pilihan ini pas untuk momen ulang tahun, wisuda, dan kejutan spesial.`;
  }

  if (/packing/i.test(name)) {
    return `${name} memberi finishing premium dengan box, kertas, dan pita organza. Cocok untuk membuat hadiah terlihat lebih mewah saat diterima.`;
  }

  if (/selempang/i.test(name)) {
    return `${name} dibuat sebagai pelengkap momen wisuda atau perayaan. Desain bisa mengikuti tema acara agar hasilnya serasi dan rapi.`;
  }

  if (/donat buket/i.test(name)) {
    return `${name} berisi donat bomboloni dengan tampilan manis dan warna glaze yang menarik. Cocok untuk hadiah yang unik dan mengenyangkan.`;
  }

  if (/bucket|buket/i.test(name)) {
    return `${name} dirangkai dengan komposisi premium dan kesan estetik. Pilihan ini cocok untuk hadiah yang ingin terlihat mewah sekaligus hangat.`;
  }

  return `${name} dirancang dengan perhatian pada detail agar cocok untuk momen hadiah yang berkesan.`;
}

function getProductIntroEn(product: Product) {
  const name = getProductDisplayName(product, "en" as Language);

  if (/standing akrilik/i.test(product.name)) {
    return `${name} is a premium display piece that works well for graduations, messages, and tabletop decoration. Text and floral colors can be customized for a more personal touch.`;
  }

  if (/akrilik frame mini|frame birthday/i.test(product.name)) {
    return `${name} is styled with a clean, elegant look for personal gifting. The frame size, photo, and wording can be customized to make it more memorable.`;
  }

  if (/karangan bunga/i.test(product.name)) {
    return `${name} is designed as a formal flower board for condolences, openings, graduations, and other important events. The composition, wording, and point count can be tailored.`;
  }

  if (/buket skripsi/i.test(product.name)) {
    return `${name} is made for graduation and thesis-defense moments. The glitter filling, ribbon color, and message can all be customized.`;
  }

  if (/bunga white sedap/i.test(product.name)) {
    return `${name} gives a refined, fresh look through a neatly arranged composition of real flowers. It is ideal for elegant gifting and special occasions.`;
  }

  if (/mawar candy|bunga mawar medium|bunga mawar palsu|peony|rose gonie/i.test(product.name)) {
    return `${name} offers a sweet, polished arrangement that is easy to match with your gift theme. It is a great choice for birthdays, graduations, and surprise deliveries.`;
  }

  if (/packing/i.test(product.name)) {
    return `${name} adds a premium finishing touch with a box, wrapping paper, and organza ribbon. It helps the gift feel more luxurious the moment it is received.`;
  }

  if (/selempang/i.test(product.name)) {
    return `${name} complements graduation and celebration moments. The design can follow the event theme so the result feels coordinated and neat.`;
  }

  if (/donat buket/i.test(product.name)) {
    return `${name} features bomboloni donuts with a sweet, eye-catching glaze finish. It is a fun and filling gift option for special moments.`;
  }

  if (/bucket|buket/i.test(product.name)) {
    return `${name} is arranged with a premium composition and an elegant visual feel. It is suitable when you want a gift that feels both warm and luxurious.`;
  }

  return `${name} is crafted with careful detail so it fits beautifully into memorable gifting moments.`;
}

function getProductDetailSentence(product: Product, language: Language) {
  const name = getProductDisplayName(product, language);

  if (language === "id") {
    if (/standing akrilik bulat|standing akrilik dome|sewa standing akrilik/i.test(product.name)) {
      return "Produk ini cocok untuk sewa harian, display acara, dan kebutuhan papan ucapan yang ingin tampil bersih serta premium.";
    }
    if (/akrilik frame mini|frame birthday/i.test(product.name)) {
      return "Detail tambahan seperti foto, teks, dan warna bisa disesuaikan agar hasil akhir terasa benar-benar personal.";
    }
    if (/karangan bunga/i.test(product.name)) {
      return "Setiap papan dapat menyesuaikan ucapan, ukuran, dan komposisi sesuai kebutuhan acara.";
    }
    if (/buket skripsi/i.test(product.name)) {
      return "Pilihan ini sangat pas untuk momen kelulusan, sidang, dan hadiah apresiasi yang berkesan.";
    }
    if (/bunga white sedap/i.test(product.name)) {
      return "Aroma dan tampilannya memberi kesan bersih, lembut, dan sangat cocok untuk hadiah yang lebih formal.";
    }
    if (/packing/i.test(product.name)) {
      return "Finishing ini membantu rangkaian utama tampil lebih mewah saat diantar ke penerima.";
    }
    if (/selempang/i.test(product.name)) {
      return "Cocok untuk wisuda, foto wisudawan, dan kebutuhan acara yang memerlukan aksen dekoratif.";
    }
    if (/donat buket/i.test(product.name)) {
      return "Hadiah ini unik karena memadukan tampilan manis dengan isi yang bisa langsung dinikmati.";
    }
    return `${name} dibuat agar mudah disesuaikan dengan tema acara dan kebutuhan hadiah.`;
  }

  if (/standing akrilik bulat|standing akrilik dome|sewa standing akrilik/i.test(product.name)) {
    return "Ideal for daily rental, event displays, and message boards that should feel clean and premium.";
  }
  if (/akrilik frame mini|frame birthday/i.test(product.name)) {
    return "Extra details such as photos, wording, and colors can be adjusted so the final result feels truly personal.";
  }
  if (/karangan bunga/i.test(product.name)) {
    return "Each board can be adapted in wording, size, and composition to suit the event needs.";
  }
  if (/buket skripsi/i.test(product.name)) {
    return "This option is especially suitable for graduation, thesis defense, and appreciation gifts with meaning.";
  }
  if (/bunga white sedap/i.test(product.name)) {
    return "Its fragrance and appearance create a clean, soft, and formal impression.";
  }
  if (/packing/i.test(product.name)) {
    return "This finishing helps the main arrangement look more luxurious when it is delivered.";
  }
  if (/selempang/i.test(product.name)) {
    return "It is suitable for graduation photos, ceremonies, and any event that needs a decorative accent.";
  }
  if (/donat buket/i.test(product.name)) {
    return "A unique gift that combines a sweet visual presentation with something enjoyable to eat.";
  }

  return `${name} is designed so it can be adapted to the event theme and gifting need.`;
}

function escapeRegExp(value: string) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getCategoryLabel(categoryKey: string, fallbackLabel: string, language: Language) {
  if (language === "id") return fallbackLabel;
  return CATEGORY_LABEL_EN[categoryKey] || fallbackLabel;
}

function getCategoryDescription(categoryKey: string, fallbackDescription: string, language: Language) {
  if (language === "id") return fallbackDescription;
  return CATEGORY_DESCRIPTION_EN[categoryKey] || fallbackDescription;
}

function getProductDisplayName(product: Product, language: Language) {
  if (language === "id") return product.name;
  return PRODUCT_NAME_EN[product.name] || product.name;
}

function getProductTag(tag: string | undefined, language: Language) {
  if (!tag) return "";
  if (language === "id") return tag;
  return PRODUCT_TAG_EN[tag] || tag;
}

function looksMostlyEnglish(value: string) {
  if (!value) return false;
  const englishHint = /\b(premium|fresh|flower|arrangement|custom|gift|daily|delivery|chat|admin|perfect|elegant|luxury|special|bouquet)\b/i;
  const indonesianHint = /\b(dengan|untuk|dan|yang|bisa|harga|sewa|warna|bunga|hadiah|pilihan|hari|acara|katalog)\b/i;
  return englishHint.test(value) && !indonesianHint.test(value);
}