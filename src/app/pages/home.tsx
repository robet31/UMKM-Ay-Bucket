import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { categories, formatRupiah, getProducts, getSiteConfig, getWhatsAppOrderLink, type Product, type ProductCategory } from "../data";
import { PageTransition } from "../components/page-transition";
import { Footer } from "../components/footer";
import AnimatedPetals from "../components/animated-petals";
import { VideoGallery } from "../components/video-gallery";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useLanguage } from "../language";

function useAdminSync() {
  const [, setTick] = useState(0);
  useEffect(() => {
    const handler = () => setTick((t) => t + 1);
    window.addEventListener("siteConfigChanged", handler);
    return () => window.removeEventListener("siteConfigChanged", handler);
  }, []);
}

export function Home() {
  useAdminSync();
  const [language] = useLanguage();
  const config = getSiteConfig();
  const products = getProducts();

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

  const filteredProducts = activeCategory === "all" ? products : products.filter((p) => p.category === activeCategory);
  const displayedProducts = showAll ? filteredProducts : filteredProducts.slice(0, 12);
  const activeInfo = activeCategory !== "all" ? categories.find((c) => c.key === activeCategory) : null;
  const selectedCategoryInfo = selectedCategory ? categories.find((c) => c.key === selectedCategory) ?? null : null;
  const selectedCategoryProducts = selectedCategory ? products.filter((p) => p.category === selectedCategory) : [];
  const polaroidCards = useMemo(() => {
    return displayedProducts.slice(0, 6).map((product, index) => {
      const seed = product.id.split("").reduce((acc, char) => acc + char.charCodeAt(0), index * 31);
      const rotate = ((seed % 13) - 6) * 0.7;
      const x = ((seed % 9) - 4) * 2;
      const y = ((seed % 7) - 3) * 2;
      const delay = (seed % 5) * 0.15;

      return { product, index, rotate, x, y, delay };
    });
  }, [displayedProducts]);

  const getCategoryAccent = (category: ProductCategory) => {
    const accentMap: Record<ProductCategory, string> = {
      "buket-satin": "#d48a6a",
      "snack-bouquet": "#c98b3f",
      "money-bouquet": "#7d5ba6",
      "chocolate-bouquet": "#7a4f2c",
      "fresh-flower": "#c05d5d",
      "artificial-flower": "#4f8f7a",
      "catalog-home": "#b85c3b",
    };
    return accentMap[category];
  };

  const heroFrames = products.length > 0
    ? products.slice(0, 6)
    : [{
      id: "hero-fallback",
      name: config.heroTitle || config.businessName || "El Bouquet",
      category: "catalog-home" as ProductCategory,
      description: config.heroSubtitle || config.tagline || (language === "id" ? "Katalog polaroid yang bergerak mengikuti scroll." : "Polaroid catalog that moves with scroll."),
      image: config.heroFallbackImage || "/assets/catalog-home-rp150000-item-02.jpg",
      images: [config.heroFallbackImage || "/assets/catalog-home-rp150000-item-02.jpg"],
      price: "",
      priceLabel: language === "id" ? "Katalog" : "Catalog",
      tag: "hero",
      variant: "hero",
    } as Product];
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

        <div ref={heroRef} style={{ paddingTop: "clamp(100px, 10vw, 140px)", paddingBottom: "clamp(96px, 10vw, 140px)", position: "relative", zIndex: 2 }}>
          <div className="mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.15 }} style={{ maxWidth: "620px" }}>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(249,249,247,0.8)", margin: "0 0 12px 0", fontWeight: 600 }}>
                🌸 {language === "id" ? "Buket Bunga Premium" : "Premium Flower Bouquets"}
              </p>
              <h1 style={{ fontFamily: "'Dancing Script', cursive", fontSize: "clamp(56px, 11vw, 120px)", fontWeight: 800, color: "#F9F9F7", letterSpacing: "-0.03em", margin: "0 0 8px 0", lineHeight: 0.88, textShadow: "3px 3px 6px rgba(0,0,0,0.18), 0 0 30px rgba(200,130,100,0.2)" }}>
                {config.heroTitle || "Koleksi Segar Pilihan"}
              </h1>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(22px, 3.5vw, 38px)", fontWeight: 400, fontStyle: "italic", color: "#F9F9F7", margin: "0 0 18px 0", letterSpacing: "0.05em", opacity: 0.95 }}>
                {config.heroSubtitle || (language === "id" ? "Rangkaian segar, snack unik, money bouquet eksklusif" : "Fresh arrangements, unique snacks, exclusive money bouquets")}
              </p>
              <p style={{ maxWidth: "540px", color: "rgba(249,249,247,0.92)", fontFamily: "'Inter', sans-serif", fontSize: "15px", lineHeight: 1.8, margin: "0 0 20px 0" }}>
                {config.heroSubtitle || (language === "id" ? "Scroll untuk melihat setiap frame polaroid unik. Satu polaroid = satu koleksi pilihan. Dibuat dengan perhatian penuh untuk moment spesial Anda." : "Scroll to see each unique polaroid frame. One polaroid = one curated collection. Made with full care for your special moments.")}
              </p>

              <div style={{ display: "flex", gap: "16px", marginTop: "28px", alignItems: "center" }}>
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

              <motion.div aria-hidden animate={{ y: [0, -12, 0], opacity: [0.5, 0.9, 0.5] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} style={{ position: "absolute", top: "15%", right: "8%", width: "12px", height: "12px", borderRadius: "999px", background: "rgba(255,255,255,0.75)", boxShadow: "0 0 24px rgba(255,255,255,0.9), 0 0 48px rgba(255,150,100,0.3)" }} />
              <motion.div aria-hidden animate={{ y: [0, 10, 0], opacity: [0.3, 0.65, 0.3], scale: [0.8, 1.1, 0.8] }} transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }} style={{ position: "absolute", left: "10%", bottom: "12%", width: "16px", height: "16px", borderRadius: "999px", background: "rgba(255,255,255,0.5)", boxShadow: "0 0 20px rgba(255,255,255,0.6)" }} />
              <motion.div aria-hidden animate={{ y: [0, -8, 0], opacity: [0.4, 0.7, 0.4] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1.5 }} style={{ position: "absolute", top: "35%", right: "18%", width: "8px", height: "8px", borderRadius: "999px", background: "rgba(255,255,255,0.6)", boxShadow: "0 0 16px rgba(255,200,150,0.5)" }} />

              <div style={{ position: "relative", width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <motion.div
                  aria-hidden
                  initial={{ opacity: 0, x: -20, y: 24, rotateZ: -10, scale: 0.92 }}
                  animate={{ opacity: 0.7, x: -20, y: 24, rotateZ: -10, scale: 0.92 }}
                  transition={{ duration: 0.9, delay: 0.42, ease: [0.22, 1, 0.36, 1] }}
                  style={{ position: "absolute", left: "2%", top: "18%", width: "min(34vw, 250px)", pointerEvents: "none" }}
                >
                  <PolaroidCard product={previousHero} compact />
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
                    <PolaroidCard product={currentHero} accent={heroAccent} />
                  </motion.div>
                </AnimatePresence>

                <motion.div
                  aria-hidden
                  initial={{ opacity: 0, x: 24, y: 18, rotateZ: 12, scale: 0.9 }}
                  animate={{ opacity: 0.45, x: 24, y: 18, rotateZ: 12, scale: 0.9 }}
                  transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  style={{ position: "absolute", right: "2%", bottom: "8%", width: "min(34vw, 250px)", pointerEvents: "none" }}
                >
                  <PolaroidCard product={nextHero} compact />
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

          <div style={{ marginBottom: "10px" }}>
            {/* Category list removed — previews now open from the polaroid frames below */}
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
              {activeInfo.canvaLink && (
                <a href={activeInfo.canvaLink} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", marginTop: "18px", fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", padding: "10px 20px", border: `1px solid ${getCategoryAccent(activeInfo.key)}`, backgroundColor: getCategoryAccent(activeInfo.key), color: "#fff", cursor: "pointer", textDecoration: "none", transition: "all 0.3s ease", borderRadius: "8px", fontWeight: 600 }}>
                  📋 {language === "id" ? "Lihat Katalog Lengkap" : "View Full Catalog"} →
                </a>
              )}
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

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 18 }}>
            {displayedProducts && displayedProducts.length > 0 ? (
              displayedProducts.map((p) => (
                <div key={p.id} onClick={() => setSelectedProduct(p)} style={{ cursor: "pointer" }}>
                  <ProductCard product={p} onClick={() => setSelectedProduct(p)} />
                </div>
              ))
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

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "22px", alignItems: "start" }}>
            {polaroidCards.length > 0 ? (
              polaroidCards.map(({ product: p, index, rotate, x, y, delay }) => (
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
        {selectedProduct && <ProductDetailModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
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
    </PageTransition>
  );
}

function PolaroidCard({ product, accent, compact = false }: { product: Product; accent?: string; compact?: boolean }) {
  const frameAccent = accent || "#b85c3b";

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
          alt={product.name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
          onError={(e) => {
            e.currentTarget.src = `https://placehold.co/800x1000/f3f0eb/1a1a1a?text=${encodeURIComponent(product.name)}`;
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
          {product.name}
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
          {compact ? "Preview frame" : product.priceLabel || "Polaroid frame"}
        </p>
      </div>
    </div>
  );
}

function ProductCard({ product, onClick }: { product: Product; onClick: () => void }) {
  const accent = {
    "buket-satin": "#d48a6a",
    "snack-bouquet": "#c98b3f",
    "money-bouquet": "#7d5ba6",
    "chocolate-bouquet": "#7a4f2c",
    "fresh-flower": "#c05d5d",
    "artificial-flower": "#4f8f7a",
    "catalog-home": "#b85c3b",
  }[product.category] || "#999";

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
            aspectRatio: "4/5",
            overflow: "hidden",
            backgroundColor: "#ebebe9",
          }}
        >
          <img
            src={(product.images && product.images[0]) || product.image}
            alt={product.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
            onError={(e) => {
              e.currentTarget.src = `https://placehold.co/800x1000/ebebe9/1a1a1a?text=${encodeURIComponent(product.name)}`;
            }}
          />
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
            {product.category}
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
              {product.name}
            </h3>
            <p
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "11px",
                fontWeight: 600,
                color: accent,
                margin: 0,
                whiteSpace: "nowrap",
              }}
            >
              {product.priceLabel}
            </p>
          </div>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "14px",
              margin: "6px 0 0 0",
              color: "#555",
            }}
          >
            Hadiah premium untuk momen istimewa.
          </p>
        </div>
      </div>
    </button>
  );
}

function ProductDetailModal({ product, onClose }: { product: Product; onClose: () => void }) {
  const images = product.images && product.images.length > 0 ? product.images : product.image ? [product.image] : [];
  const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 3000, stopOnInteraction: false })]);
  const categoryInfo = categories.find((cat) => cat.key === product.category);
  const [isMobile, setIsMobile] = useState(() => (typeof window !== "undefined" ? window.innerWidth < 768 : false));

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: "fixed", inset: 0, zIndex: 9999, backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: isMobile ? "flex-start" : "center", justifyContent: "center", padding: isMobile ? "12px" : "clamp(16px, 4vw, 40px)", overflowY: "auto" }} onClick={onClose}>
      <motion.div initial={{ y: 40, scale: 0.95 }} animate={{ y: 0, scale: 1 }} exit={{ y: 20, scale: 0.95 }} transition={{ type: "spring", damping: 25, stiffness: 300 }} onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: isMobile ? "100%" : "900px", backgroundColor: "#F9F9F7", display: "flex", flexDirection: isMobile ? "column" : "row", flexWrap: "wrap", maxHeight: isMobile ? "92dvh" : "90vh", overflowY: "auto", position: "relative", boxShadow: "0 24px 60px rgba(0,0,0,0.2)", borderRadius: isMobile ? "16px" : "18px" }}>
        <button onClick={onClose} aria-label="Close" style={{ position: "absolute", top: "16px", right: "16px", zIndex: 10, width: "36px", height: "36px", borderRadius: "999px", border: "none", background: "rgba(255,255,255,0.9)", cursor: "pointer" }}>×</button>
        <div style={{ flex: isMobile ? "0 0 auto" : "1 1 400px", minHeight: isMobile ? "220px" : "300px", aspectRatio: isMobile ? "4 / 3" : undefined, position: "relative", backgroundColor: "#ebebe9", overflow: "hidden" }}>
          <div className="embla" ref={emblaRef} style={{ width: "100%", height: "100%" }}>
            <div className="embla__container" style={{ display: "flex", width: "100%", height: "100%" }}>
              {images.map((img, index) => (
                <div key={index} className="embla__slide" style={{ flex: "0 0 100%", height: "100%", minWidth: 0, position: "relative" }}>
                  <img src={img} alt={`${product.name} ${index + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} onError={(e) => { e.currentTarget.src = `https://placehold.co/600x800/ebebe9/1a1a1a?text=${encodeURIComponent(product.name)}`; }} />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{ flex: "1 1 320px", padding: isMobile ? "18px" : "28px", display: "flex", flexDirection: "column", gap: "14px", justifyContent: "center" }}>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "9px", color: "#999", textTransform: "uppercase", margin: 0 }}>{categoryInfo?.label || product.category}</p>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isMobile ? "clamp(28px, 8vw, 36px)" : "clamp(32px, 4vw, 50px)", lineHeight: 1, margin: 0, color: "#1a1a1a" }}>{product.name}</h2>
          <p style={{ fontFamily: "'Inter', sans-serif", color: "#555", lineHeight: 1.8, margin: 0 }}>
            {product.description || categoryInfo?.description || "Detail produk ini tersedia di katalog lengkap dan bisa dibuka dari tombol di bawah."}
          </p>
          <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, color: "#1a1a1a", margin: 0 }}>{product.priceLabel || formatRupiah(product.price || 0)}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "8px" }}>
            {categoryInfo?.canvaLink && (
              <a href={categoryInfo.canvaLink} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", flex: isMobile ? "1 1 100%" : "0 1 auto", padding: "12px 18px", backgroundColor: "transparent", color: "#1a1a1a", border: "1px solid rgba(0,0,0,0.14)", textDecoration: "none", textAlign: "center", borderRadius: "8px", fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                Menuju Katalog
              </a>
            )}
            <a href={getWhatsAppOrderLink(product.name, product.priceLabel || String(product.price || ""))} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", flex: isMobile ? "1 1 100%" : "0 1 auto", padding: "12px 18px", backgroundColor: "#1a1a1a", color: "#fff", textDecoration: "none", textAlign: "center", borderRadius: "8px", fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase" }}>Pesan via WhatsApp</a>
          </div>
        </div>
      </motion.div>
    </motion.div>
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
              {count} produk
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
  const previewProducts = products.slice(0, 6);
  const [isMobile, setIsMobile] = useState(() => (typeof window !== "undefined" ? window.innerWidth < 900 : false));

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 900);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: "fixed", inset: 0, zIndex: 9998, backgroundColor: "rgba(0,0,0,0.58)", backdropFilter: "blur(4px)", display: "flex", alignItems: isMobile ? "flex-start" : "center", justifyContent: "center", padding: isMobile ? "10px" : "clamp(16px, 4vw, 40px)", overflowY: "auto" }} onClick={onClose}>
      <motion.div initial={{ y: 40, scale: 0.96 }} animate={{ y: 0, scale: 1 }} exit={{ y: 20, scale: 0.96 }} transition={{ type: "spring", damping: 25, stiffness: 280 }} onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: "980px", backgroundColor: "#F9F9F7", display: "grid", gridTemplateColumns: isMobile ? "minmax(0, 1fr)" : "minmax(0, 1.05fr) minmax(320px, 0.95fr)", maxHeight: isMobile ? "92dvh" : "90vh", overflow: isMobile ? "auto" : "hidden", position: "relative", boxShadow: "0 24px 60px rgba(0,0,0,0.22)", borderRadius: isMobile ? "16px" : "20px" }}>
        <button onClick={onClose} aria-label="Close" style={{ position: "absolute", top: "16px", right: "16px", zIndex: 10, width: "36px", height: "36px", borderRadius: "999px", border: "none", background: "rgba(255,255,255,0.92)", cursor: "pointer" }}>×</button>
        <div style={{ padding: isMobile ? "18px" : "28px", background: "linear-gradient(180deg, rgba(184,92,59,0.10), rgba(249,249,247,0.02))", overflowY: "auto" }}>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "9px", color: "#999", textTransform: "uppercase", letterSpacing: "0.12em", margin: 0 }}>
            Preview kategori
          </p>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isMobile ? "clamp(28px, 8vw, 38px)" : "clamp(32px, 4vw, 52px)", lineHeight: 1, margin: "10px 0 12px 0", color: "#1a1a1a" }}>
            {category.emoji} {category.label}
          </h2>
          <p style={{ fontFamily: "'Inter', sans-serif", color: "#555", lineHeight: 1.8, margin: 0 }}>
            {category.description}
          </p>
          {category.noted && <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "#8a6d3b", margin: "14px 0 0 0", lineHeight: 1.6 }}>💡 {category.noted}</p>}

          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "22px" }}>
            <div style={{ padding: "10px 14px", borderRadius: "999px", background: "rgba(0,0,0,0.05)", fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", letterSpacing: "0.08em", textTransform: "uppercase", color: "#666" }}>
              {products.length} produk tersedia
            </div>
            {category.canvaLink && (
              <a href={category.canvaLink} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "10px 14px", borderRadius: "999px", background: "#1a1a1a", color: "#fff", textDecoration: "none", fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                Menuju katalog
              </a>
            )}
          </div>

          <div style={{ marginTop: "24px", display: "grid", gridTemplateColumns: `repeat(auto-fit, minmax(${isMobile ? "120px" : "140px"}, 1fr))`, gap: "14px" }}>
            {previewProducts.map((product) => (
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
                    alt={product.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    onError={(e) => {
                      e.currentTarget.src = `https://placehold.co/600x800/efefec/1a1a1a?text=${encodeURIComponent(product.name)}`;
                    }}
                  />
                </div>
                <p style={{ margin: "0 0 4px 0", fontFamily: "'Cormorant Garamond', serif", fontSize: "18px", lineHeight: 1.1, color: "#1a1a1a" }}>{product.name}</p>
                <p style={{ margin: 0, fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", letterSpacing: "0.08em", textTransform: "uppercase", color: "#7a7a7a" }}>{product.priceLabel}</p>
              </button>
            ))}
          </div>
        </div>

        <div style={{ padding: isMobile ? "18px" : "28px", background: "#f2ede7", overflowY: "auto", borderLeft: isMobile ? "none" : "1px solid rgba(0,0,0,0.06)", borderTop: isMobile ? "1px solid rgba(0,0,0,0.06)" : "none" }}>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "9px", color: "#999", textTransform: "uppercase", letterSpacing: "0.12em", margin: 0 }}>
            Ringkasan isi kategori
          </p>
          <div style={{ marginTop: "14px", display: "grid", gap: "12px" }}>
            {products.length > 0 ? (
              products.map((product) => (
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
                    <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isMobile ? "18px" : "20px", color: "#1a1a1a", lineHeight: 1.1 }}>{product.name}</span>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.08em", color: "#7a7a7a", whiteSpace: "nowrap" }}>{product.priceLabel}</span>
                  </div>
                  <p style={{ margin: "8px 0 0 0", fontFamily: "'Inter', sans-serif", fontSize: "13px", lineHeight: 1.6, color: "#666" }}>
                    {product.tag || "Klik untuk melihat detail produk ini."}
                  </p>
                </button>
              ))
            ) : (
              <div style={{ color: "#777", fontFamily: "'Inter', sans-serif" }}>Belum ada produk di kategori ini.</div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}