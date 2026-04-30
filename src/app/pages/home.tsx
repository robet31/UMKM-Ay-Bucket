import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { categories, getProducts, getSiteConfig, getWhatsAppOrderLink, type ProductCategory, type Product } from "../data";
import { PageTransition } from "../components/page-transition";
import { Footer } from "../components/footer";
import { VideoGallery } from "../components/video-gallery";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

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
  const [activeCategory, setActiveCategory] = useState<ProductCategory | "all">("all");
  const [showAll, setShowAll] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const config = getSiteConfig();
  const products = getProducts();

  const filteredProducts = activeCategory === "all"
    ? products
    : products.filter((p) => p.category === activeCategory);

  const displayedProducts = showAll ? filteredProducts : filteredProducts.slice(0, 12);
  const activeInfo = activeCategory !== "all"
    ? categories.find((c) => c.key === activeCategory)
    : null;

  return (
    <PageTransition>
      <div style={{ padding: "0 clamp(24px, 8vw, 120px)" }}>
        {/* Hero */}
        <div style={{ paddingTop: "160px", paddingBottom: "60px", display: "flex", flexDirection: "column", gap: "40px" }}>
          
          <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "40px" }}>
            <div style={{ flex: "1 1 500px", zIndex: 2 }}>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.3 }}
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "9px",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "#999",
                }}
              >
                Katalog {config.year} &mdash; Fresh Flowers &amp; Gifts
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "clamp(40px, 6vw, 80px)",
                  fontWeight: 300,
                  lineHeight: 1.1,
                  letterSpacing: "-0.03em",
                  color: "#1a1a1a",
                  maxWidth: "800px",
                  marginTop: "16px",
                  whiteSpace: "pre-line",
                }}
              >
                {config.heroTitle.split('\n').map((line, i, arr) => (
                  <span key={i}>
                    {i === arr.length - 1 ? <em style={{ fontStyle: "italic", fontWeight: 300 }}>{line}</em> : line}
                    {i < arr.length - 1 && <br />}
                  </span>
                ))}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.8 }}
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "15px",
                  lineHeight: 1.8,
                  color: "#777",
                  marginTop: "24px",
                  maxWidth: "560px",
                }}
              >
                {config.heroSubtitle}
              </motion.p>
              
              <motion.a
                href="#kategori"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1 }}
                style={{
                  display: "inline-block",
                  marginTop: "32px",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "10px",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  padding: "14px 32px",
                  backgroundColor: "#1a1a1a",
                  color: "#fff",
                  textDecoration: "none",
                  transition: "background-color 0.3s ease",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#333"; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#1a1a1a"; }}
              >
                Lihat Koleksi
              </motion.a>
            </div>

            {/* Hero Image / Animation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, rotate: -2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.6 }}
              style={{
                flex: "1 1 300px",
                maxWidth: "500px",
                position: "relative",
              }}
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  aspectRatio: "3/4",
                  overflow: "hidden",
                  boxShadow: "0 24px 60px rgba(0,0,0,0.1)",
                  border: "1px solid rgba(0,0,0,0.05)",
                  backgroundColor: "#f5f5f5",
                }}
              >
                <img 
                  src="/assets/bouquet_classic.png" 
                  alt="El Bouquet Premium Bouquet"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={(e) => {
                    e.currentTarget.src = "https://placehold.co/800x1066/ebebe9/1a1a1a?text=Premium+Bouquet";
                  }}
                />
              </motion.div>
              {/* Decorative element */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 1.2 }}
                style={{
                  position: "absolute",
                  bottom: "-20px",
                  left: "-20px",
                  backgroundColor: "#fff",
                  padding: "16px 24px",
                  boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "18px",
                  fontStyle: "italic",
                  color: "#1a1a1a",
                }}
              >
                Best quality blooms 🌸
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Category Pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          style={{ marginBottom: "48px" }}
        >
          <p
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "9px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#999",
              marginBottom: "16px",
            }}
          >
            Kategori
          </p>
          <div
            className="flex flex-wrap gap-2"
            style={{ maxWidth: "900px" }}
          >
            <button
              onClick={() => { setActiveCategory("all"); setShowAll(false); }}
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "10px",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                padding: "8px 16px",
                border: "1px solid",
                borderColor: activeCategory === "all" ? "#1a1a1a" : "rgba(0,0,0,0.12)",
                backgroundColor: activeCategory === "all" ? "#1a1a1a" : "transparent",
                color: activeCategory === "all" ? "#fff" : "#666",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            >
              Semua
            </button>
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => { setActiveCategory(cat.key); setShowAll(false); }}
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "10px",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  padding: "8px 16px",
                  border: "1px solid",
                  borderColor: activeCategory === cat.key ? "#1a1a1a" : "rgba(0,0,0,0.12)",
                  backgroundColor: activeCategory === cat.key ? "#1a1a1a" : "transparent",
                  color: activeCategory === cat.key ? "#fff" : "#666",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
              >
                {cat.emoji} {cat.label}
              </button>
            ))}
          </div>

          {/* Category Info & Popular Product */}
          <AnimatePresence mode="wait">
            {activeInfo && (
              <motion.div
                key={activeInfo.key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                style={{
                  marginTop: "20px",
                  padding: "24px 32px",
                  backgroundColor: "rgba(0,0,0,0.02)",
                  borderLeft: "3px solid #1a1a1a",
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: "32px",
                  alignItems: "center",
                }}
              >
                <div style={{ flex: "1 1 300px" }}>
                  <p style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "24px",
                    fontWeight: 400,
                    color: "#1a1a1a",
                    marginBottom: "12px",
                  }}>
                    {activeInfo.emoji} {activeInfo.label}
                  </p>
                  <p style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "14px",
                    color: "#555",
                    lineHeight: 1.7,
                  }}>
                    {activeInfo.description}
                  </p>
                  {activeInfo.noted && (
                    <p style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "10px",
                      color: "#999",
                      marginTop: "16px",
                      lineHeight: 1.8,
                      letterSpacing: "0.02em",
                    }}>
                      Noted: {activeInfo.noted}
                    </p>
                  )}
                  
                  {/* Link ke Canva Catalog */}
                  {activeInfo.canvaLink && (
                    <a
                      href={activeInfo.canvaLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "inline-block",
                        marginTop: "16px",
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "11px",
                        letterSpacing: "0.05em",
                        textTransform: "uppercase",
                        padding: "8px 14px",
                        border: "1px solid #1a1a1a",
                        backgroundColor: "transparent",
                        color: "#1a1a1a",
                        cursor: "pointer",
                        textDecoration: "none",
                        transition: "all 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#1a1a1a";
                        e.currentTarget.style.color = "#fff";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.color = "#1a1a1a";
                      }}
                    >
                      📋 Lihat Katalog
                    </a>
                  )}
                </div>
                
                {/* Popular product example */}
                {filteredProducts.length > 0 && (
                  <div style={{ flex: "0 0 160px", display: "flex", flexDirection: "column", gap: "10px" }}>
                    <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "9px", color: "#999", textTransform: "uppercase" }}>
                      Contoh Populer
                    </p>
                    <div style={{ aspectRatio: "3/4", overflow: "hidden", backgroundColor: "#eee" }}>
                      <img 
                        src={filteredProducts[0].image} 
                        alt={filteredProducts[0].name}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        onError={(e) => {
                          e.currentTarget.src = `https://placehold.co/600x800/ebebe9/1a1a1a?text=${encodeURIComponent(filteredProducts[0].name)}`;
                        }}
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Products Count */}
        <div style={{ marginBottom: "24px" }}>
          <p
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "9px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#ccc",
            }}
          >
            {filteredProducts.length} produk ditemukan
          </p>
        </div>

        {/* Product Grid */}
        <div
          className="grid grid-cols-2 gap-4 pb-16 md:grid-cols-3 lg:grid-cols-4"
          style={{ gap: "20px" }}
        >
          <AnimatePresence mode="popLayout">
            {displayedProducts.map((product, i) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: i * 0.03 }}
              >
                <ProductCard product={product} onClick={() => setSelectedProduct(product)} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Show More */}
        {filteredProducts.length > 12 && !showAll && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ textAlign: "center", paddingBottom: "60px" }}
          >
            <button
              onClick={() => setShowAll(true)}
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "10px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                padding: "14px 32px",
                border: "1px solid rgba(0,0,0,0.15)",
                backgroundColor: "transparent",
                color: "#555",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#1a1a1a";
                e.currentTarget.style.color = "#fff";
                e.currentTarget.style.borderColor = "#1a1a1a";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "#555";
                e.currentTarget.style.borderColor = "rgba(0,0,0,0.15)";
              }}
            >
              Lihat Semua ({filteredProducts.length} produk) &rarr;
            </button>
          </motion.div>
        )}

        {/* Price Table Section for Classic Bouquets */}
        {activeCategory === "bouquet-classic" && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{ paddingBottom: "80px" }}
          >
            <PriceTable />
          </motion.div>
        )}

        {/* Money Bouquet Price Table */}
        {activeCategory === "money-bouquet" && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{ paddingBottom: "80px" }}
          >
            <MoneyBouquetTable />
          </motion.div>
        )}
        {/* Video Gallery Section */}
        <VideoGallery />
      </div>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <ProductDetailModal 
            product={selectedProduct} 
            onClose={() => setSelectedProduct(null)} 
          />
        )}
      </AnimatePresence>
      <Footer />
    </PageTransition>
  );
}

function ProductDetailModal({ product, onClose }: { product: Product; onClose: () => void }) {
  const images = product.images || [product.image];
  const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 3000, stopOnInteraction: false })]);

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        backgroundColor: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(16px, 4vw, 40px)",
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 40, scale: 0.95 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: 20, scale: 0.95 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "900px",
          backgroundColor: "#F9F9F7",
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          maxHeight: "90vh",
          overflowY: "auto",
          position: "relative",
          boxShadow: "0 24px 60px rgba(0,0,0,0.2)",
        }}
        className="modal-container"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            backgroundColor: "#fff",
            border: "1px solid rgba(0,0,0,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            zIndex: 10,
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="square">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* Left: Image Carousel */}
        <div style={{ flex: "1 1 400px", minHeight: "300px", position: "relative", backgroundColor: "#ebebe9", overflow: "hidden" }}>
          <div className="embla" ref={emblaRef} style={{ width: "100%", height: "100%" }}>
            <div className="embla__container" style={{ display: "flex", width: "100%", height: "100%" }}>
              {images.map((img, index) => (
                <div className="embla__slide" key={index} style={{ flex: "0 0 100%", height: "100%", minWidth: 0, position: "relative" }}>
                  <img 
                    src={img} 
                    alt={`${product.name} ${index + 1}`}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    onError={(e) => {
                      e.currentTarget.src = `https://placehold.co/600x800/ebebe9/1a1a1a?text=${encodeURIComponent(product.name)}\n(Image+Blocked)`;
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
          {product.tag && (
            <div style={{
              position: "absolute",
              top: "20px",
              left: "20px",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "9px",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              padding: "6px 12px",
              backgroundColor: "#1a1a1a",
              color: "#fff",
              zIndex: 10,
            }}>
              {product.tag}
            </div>
          )}
          {images.length > 1 && (
            <div style={{
              position: "absolute",
              bottom: "20px",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: "6px",
              zIndex: 10
            }}>
              {images.map((_, i) => (
                <div key={i} style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.7)", boxShadow: "0 1px 3px rgba(0,0,0,0.3)" }} />
              ))}
            </div>
          )}
        </div>

        {/* Right: Details */}
        <div style={{ flex: "1 1 350px", padding: "clamp(24px, 4vw, 48px)", display: "flex", flexDirection: "column" }}>
          <div>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "9px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#999",
            }}>
              {categories.find((c) => c.key === product.category)?.label}
            </span>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(24px, 3vw, 36px)",
              fontWeight: 400,
              color: "#1a1a1a",
              marginTop: "8px",
              lineHeight: 1.1,
            }}>
              {product.name}
            </h2>
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "clamp(18px, 2vw, 22px)",
              fontWeight: 600,
              color: "#1a1a1a",
              marginTop: "12px",
            }}>
              {product.priceLabel}
            </p>
          </div>

          <div style={{ marginTop: "32px", flexGrow: 1 }}>
            <div style={{ marginBottom: "24px" }}>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", color: "#999", textTransform: "uppercase", marginBottom: "8px" }}>Detail Produk</p>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", color: "#555", lineHeight: 1.6 }}>
                {product.description || "Bunga segar dirangkai secara eksklusif dengan wrapping premium dan kartu ucapan kustom. Ideal untuk hadiah, perayaan, dan momen spesial."}
              </p>
              {product.variant && (
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", color: "#555", marginTop: "8px" }}>
                  <strong>Varian:</strong> {product.variant}
                </p>
              )}
            </div>

            <div>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", color: "#999", textTransform: "uppercase", marginBottom: "8px" }}>Info Pengiriman</p>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", color: "#555", lineHeight: 1.6 }}>
                &bull; Pengiriman instan (GoSend/GrabExpress) area Krian, Sidoarjo, dan sekitarnya.<br/>
                &bull; Harap pesan minimal H-1 untuk request warna spesifik atau custom buket.
              </p>
            </div>
          </div>

          <div style={{ marginTop: "40px" }}>
            <a
              href={getWhatsAppOrderLink(product.name, product.priceLabel)}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                width: "100%",
                padding: "16px",
                backgroundColor: "#25D366",
                color: "#fff",
                fontFamily: "'Inter', sans-serif",
                fontSize: "14px",
                fontWeight: 600,
                textDecoration: "none",
                transition: "background-color 0.3s ease",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#128C7E"; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#25D366"; }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Pesan Sekarang
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ProductCard({ product, onClick }: { product: Product; onClick?: () => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="group"
      data-cursor="view"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      style={{ cursor: "pointer" }}
    >
      <div
        style={{
          overflow: "hidden",
          boxShadow: hovered
            ? "0 12px 40px rgba(0,0,0,0.12)"
            : "0 4px 20px rgba(0,0,0,0.04)",
          transition: "box-shadow 0.5s ease, transform 0.5s ease",
          transform: hovered ? "translateY(-4px)" : "translateY(0)",
          position: "relative",
        }}
      >
        {/* Tag badge */}
        {product.tag && (
          <div
            style={{
              position: "absolute",
              top: "12px",
              left: "12px",
              zIndex: 10,
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "8px",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              padding: "4px 10px",
              backgroundColor: "#1a1a1a",
              color: "#fff",
            }}
          >
            {product.tag}
          </div>
        )}

        <div
          style={{
            aspectRatio: "3/4",
            overflow: "hidden",
            backgroundColor: "#eee",
          }}
        >
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full"
            style={{
              objectFit: "cover",
              transition: "transform 1.2s ease-out",
              transform: hovered ? "scale(1.08)" : "scale(1)",
            }}
            onError={(e) => {
              e.currentTarget.src = `https://placehold.co/600x800/ebebe9/1a1a1a?text=${encodeURIComponent(product.name)}`;
            }}
          />
        </div>

        {/* Order overlay */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "16px",
            background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.4s ease",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <a
            href={getWhatsAppOrderLink(product.name, product.priceLabel)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "9px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              padding: "10px 20px",
              backgroundColor: "#25D366",
              color: "#fff",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              transition: "background-color 0.3s ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#128C7E"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#25D366"; }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Pesan via WhatsApp
          </a>
        </div>
      </div>

      {/* Product info */}
      <div className="mt-3">
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "8px",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#bbb",
          }}
        >
          {categories.find((c) => c.key === product.category)?.label}
          {product.variant && ` · ${product.variant}`}
        </span>
        <h3
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(16px, 1.8vw, 22px)",
            fontWeight: 400,
            color: "#1a1a1a",
            marginTop: "2px",
            letterSpacing: "-0.02em",
            lineHeight: 1.3,
          }}
        >
          {product.name}
        </h3>
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "14px",
            fontWeight: 600,
            color: "#1a1a1a",
            marginTop: "4px",
          }}
        >
          {product.priceLabel}
        </p>
        {product.description && (
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "11px",
              color: "#999",
              marginTop: "4px",
              lineHeight: 1.5,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {product.description}
          </p>
        )}
      </div>
    </div>
  );
}

function PriceTable() {
  const classicPrices = [
    { qty: "3 Mawar", price: "Rp 20.000" },
    { qty: "4 Mawar", price: "Rp 25.000" },
    { qty: "5 Mawar", price: "Rp 30.000" },
    { qty: "6 Mawar", price: "Rp 35.000" },
    { qty: "7 Mawar", price: "Rp 40.000" },
    { qty: "8 Mawar", price: "Rp 45.000" },
    { qty: "9 Mawar", price: "Rp 50.000" },
    { qty: "10 Mawar", price: "Rp 55.000" },
    { qty: "11 Mawar", price: "Rp 60.000" },
    { qty: "12 Mawar", price: "Rp 65.000" },
    { qty: "13 Mawar", price: "Rp 70.000" },
    { qty: "14 Mawar", price: "Rp 75.000" },
    { qty: "15 Mawar", price: "Rp 80.000" },
    { qty: "20 Mawar", price: "Rp 105.000" },
  ];

  return (
    <div style={{ maxWidth: "500px" }}>
      <p
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "9px",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "#999",
          marginBottom: "20px",
        }}
      >
        Daftar Harga Bouquet Classic
      </p>
      <div
        style={{
          borderTop: "1px solid rgba(0,0,0,0.08)",
        }}
      >
        {classicPrices.map((item) => (
          <div
            key={item.qty}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "12px 0",
              borderBottom: "1px solid rgba(0,0,0,0.06)",
              fontFamily: "'Inter', sans-serif",
              fontSize: "14px",
            }}
          >
            <span style={{ color: "#555" }}>{item.qty}</span>
            <span style={{ fontWeight: 600, color: "#1a1a1a" }}>{item.price}</span>
          </div>
        ))}
      </div>
      <p
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "9px",
          color: "#bbb",
          marginTop: "16px",
          lineHeight: 1.8,
        }}
      >
        * Bebas pilih nuansa warna dan custom warna. Kecuali warna ungu, biru, gold, dan hitam harga berbeda.
      </p>
    </div>
  );
}

function MoneyBouquetTable() {
  const moneyPrices = [
    { qty: "0-10 lembar", price: "Rp 85.000" },
    { qty: "11-20 lembar", price: "Rp 100.000" },
    { qty: "21-30 lembar", price: "Rp 150.000" },
    { qty: "31-40 lembar", price: "Rp 200.000" },
    { qty: "41-50 lembar", price: "Rp 250.000" },
    { qty: "51-60 lembar", price: "Rp 300.000" },
    { qty: "61-70 lembar", price: "Rp 350.000" },
    { qty: "71-80 lembar", price: "Rp 400.000" },
    { qty: "81-90 lembar", price: "Rp 450.000" },
    { qty: "91-100 lembar", price: "Rp 500.000" },
    { qty: "150 lembar", price: "Rp 750.000" },
    { qty: "200 lembar", price: "Rp 1.000.000" },
  ];

  return (
    <div style={{ maxWidth: "500px" }}>
      <p
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "9px",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "#999",
          marginBottom: "20px",
        }}
      >
        Daftar Harga Money Bouquet (biaya jasa rangkai)
      </p>
      <div style={{ borderTop: "1px solid rgba(0,0,0,0.08)" }}>
        {moneyPrices.map((item) => (
          <div
            key={item.qty}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "12px 0",
              borderBottom: "1px solid rgba(0,0,0,0.06)",
              fontFamily: "'Inter', sans-serif",
              fontSize: "14px",
            }}
          >
            <span style={{ color: "#555" }}>{item.qty}</span>
            <span style={{ fontWeight: 600, color: "#1a1a1a" }}>{item.price}</span>
          </div>
        ))}
      </div>
      <div
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "9px",
          color: "#bbb",
          marginTop: "16px",
          lineHeight: 2,
        }}
      >
        <p>Noted:</p>
        <p>1. Harga di atas adalah biaya jasa rangkai, belum termasuk uang yang akan dibuket</p>
        <p>2. Harga mawar warna merah, putih, pink soft, peach. Selain itu 15rb/tangkai</p>
        <p>3. Model royal & runcing tambahan biaya 25rb-50rb</p>
        <p>4. Bebas request warna bunga, wrapping, dan kartu ucapan</p>
        <p>5. Model bulat & uang contong ada biaya tambahan</p>
      </div>
    </div>
  );
}
