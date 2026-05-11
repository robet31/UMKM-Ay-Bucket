import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { PageTransition } from "../components/page-transition";
import { Footer } from "../components/footer";
import AnimatedPetals from "../components/animated-petals";
import { StudioVideoSection } from "../components/video-gallery";
import { getSiteConfig, categories, getWhatsAppLink, BRAND_LOGO, getGalleryProjects, normalizeAssetUrl, type GalleryProject } from "../data";
import { useLanguage } from "../language";

const mono = {
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: "9px" as const,
  letterSpacing: "0.12em",
  textTransform: "uppercase" as const,
  color: "#999",
};

const serif = {
  fontFamily: "'Cormorant Garamond', serif",
};

const body = {
  fontFamily: "'Inter', sans-serif",
  fontSize: "15px",
  lineHeight: 2,
  color: "#555",
  maxWidth: "520px",
};

// ---- Original Atelier masonry gallery data moved to data.ts for admin customization ----

const gridPositions = [
  { col: "1 / 5", mt: 0 },
  { col: "6 / 10", mt: 180 },
  { col: "2 / 7", mt: 40 },
  { col: "7 / 11", mt: 120 },
  { col: "1 / 6", mt: 60 },
  { col: "5 / 10", mt: 200 },
];

const steps = [
  { num: "01", title: "Jelajahi Katalog", titleEn: "Explore Catalog", text: "Pilih dari berbagai kategori bunga premium kami — buket satin, money bouquet, snack bouquet, fresh flower, chocolate bouquet, dan vas cantik. Setiap produk berkualitas tinggi.", textEn: "Choose from various premium flower categories — satin bouquets, money bouquets, snack bouquets, fresh flowers, chocolate bouquets, and beautiful vases. Every product is high quality." },
  { num: "02", title: "Custom Pesanan Anda", titleEn: "Customize Your Order", text: "Ingin request warna, jenis bunga, atau packaging khusus? Kami siap mewujudkan buket impian Anda dengan sentuhan personal yang sempurna.", textEn: "Want to request colors, flower types, or special packaging? We're ready to bring your dream bouquet to life with perfect personal touches." },
  { num: "03", title: "Hubungi Kami via WhatsApp", titleEn: "Contact Us via WhatsApp", text: "Hubungi tim Ay Bucket & Gift melalui WhatsApp untuk konfirmasi pesanan, detail, dan pembayaran. Kami siap membantu dengan cepat dan profesional.", textEn: "Contact the Ay Bucket & Gift team via WhatsApp for order confirmation, details, and payment. We're ready to help quickly and professionally." },
  { num: "04", title: "Terima Keindahan", titleEn: "Receive Beauty", text: "Setiap buket dirancang dengan penuh perhatian dan cinta. Kami mengantarkan bunga segar langsung ke alamat tujuan Anda.", textEn: "Every bouquet is designed with full attention and love. We deliver fresh flowers directly to your destination." },
];

// Legacy catalog links removed – catalog now directs to WhatsApp via nav/footer

export function Studio() {
  const [, setTick] = useState(0);
  const [language] = useLanguage();
  const [galleryProjects, setGalleryProjects] = useState<GalleryProject[]>([]);

  useEffect(() => {
    setGalleryProjects(getGalleryProjects());
    const handler = () => {
      setTick((t) => t + 1);
      setGalleryProjects(getGalleryProjects());
    };
    window.addEventListener("siteConfigChanged", handler);
    window.addEventListener("galleryProjectsChanged", handler);
    return () => {
      window.removeEventListener("siteConfigChanged", handler);
      window.removeEventListener("galleryProjectsChanged", handler);
    };
  }, []);

  const config = getSiteConfig();
  const heroImages = config.heroFallbackImage ? config.heroFallbackImage.split('|SEP|') : [];
  const studioImageFallback = normalizeAssetUrl(heroImages[0] || "");

  return (
    <PageTransition>
      <div style={{ padding: "0 clamp(24px, 8vw, 120px)" }}>
        {/* Header */}
        <div style={{ paddingTop: "80px", paddingBottom: "100px", position: "relative", overflow: "hidden" }}>
          {/* Animated flower decorations */}
          <motion.div
            animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            style={{
              position: "absolute",
              top: "20px",
              left: "5%",
              fontSize: "40px",
              opacity: 0.3,
            }}
          >
            🌹
          </motion.div>
          <motion.div
            animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            style={{
              position: "absolute",
              top: "60px",
              right: "8%",
              fontSize: "36px",
              opacity: 0.25,
            }}
          >
            💐
          </motion.div>
          <motion.div
            animate={{ y: [0, -25, 0], rotate: [0, 8, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            style={{
              position: "absolute",
              bottom: "40px",
              right: "12%",
              fontSize: "44px",
              opacity: 0.2,
            }}
          >
            🌸
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            style={mono}
          >
            {language === "id" ? "Tentang Kami" : "About Us"}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            style={{
              ...serif,
              fontSize: "clamp(36px, 5vw, 64px)",
              fontWeight: 300,
              lineHeight: 1.15,
              letterSpacing: "-0.03em",
              color: "#1a1a1a",
              marginTop: "16px",
              maxWidth: "700px",
              position: "relative",
              zIndex: 2,
            }}
          >
            {language === "id" ? (
              <>
                Rangkai keindahan
                <br />
                dengan sepenuh{" "}
                <em>hati</em>
              </>
            ) : (
              <>
                Arrange beauty
                <br />
                with all our{" "}
                <em>heart</em>
              </>
            )}
          </motion.h1>
        </div>

        {/* Intro */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="studio-intro-grid grid grid-cols-1 gap-12 md:grid-cols-12"
          style={{ paddingBottom: "120px" }}
        >
          <div className="md:col-span-10 md:col-start-2" style={{ marginBottom: "10px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr)", gap: "18px", padding: "22px", border: "1px solid rgba(0,0,0,0.08)", borderRadius: "18px", background: "linear-gradient(135deg, rgba(255,255,255,0.82), rgba(255,248,244,0.74))", boxShadow: "0 16px 36px rgba(0,0,0,0.05)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "18px", flexWrap: "wrap" }}>
                <div style={{ width: "108px", height: "108px", padding: "10px", borderRadius: "999px", background: "rgba(255,255,255,0.92)", border: "1px solid rgba(184,92,59,0.14)", boxShadow: "0 10px 24px rgba(0,0,0,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <img src={config.brandLogoUrl || BRAND_LOGO.logo} alt="Ay Bucket & Gift logo" loading="lazy" decoding="async" style={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: "999px", mixBlendMode: "multiply" }} />
                </div>
                <div>
                  <p style={{ margin: 0, fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(34px, 5vw, 48px)", lineHeight: 1, color: "#1a1a1a" }}>Ay Bucket & Gift</p>
                  <p style={{ margin: "8px 0 0 0", fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: "#8a6a52" }}>
                    Kamal · Telang · Bangkalan
                  </p>
                </div>
              </div>
              <p style={{ margin: 0, fontFamily: "'Inter', sans-serif", fontSize: "15px", lineHeight: 1.85, color: "#555", maxWidth: "780px" }}>
                {language === "id"
                  ? "Ay Bucket & Gift adalah florist lokal yang fokus pada rangkaian premium: buket fresh/artificial, standing akrilik, karangan bunga papan, selempang wisuda, dan gift custom. Kami mengutamakan detail, ketepatan waktu, serta kemudahan request desain agar setiap pesanan terasa personal."
                  : "Ay Bucket & Gift is a local florist focused on premium arrangements: fresh/artificial bouquets, acrylic stands, flower boards, graduation sashes, and custom gifts. We prioritize detail, punctuality, and flexible design requests so each order feels personal."}
              </p>
            </div>
          </div>

          <div className="md:col-span-5 md:col-start-2">
            <p style={body}>
              <strong style={{ color: "#1a1a1a" }}>{config.businessName}</strong> {language === "id" ? "adalah" : "is"}
              {language === "id"
                ? " studio florist yang spesialis dalam menciptakan rangkaian bunga premium untuk setiap momen spesial Anda &mdash; dari buket satin elegan hingga money bouquet unik, snack bouquet kreatif, dan berbagai pilihan premium lainnya."
                : " a florist studio specializing in premium flower arrangements for every special moment &mdash; from elegant satin bouquets to unique money bouquets, creative snack bouquets, and other premium selections."}
            </p>
          </div>
          <div className="md:col-span-4 md:col-start-8">
            <p style={body}>
              {language === "id"
                ? "Kami berkomitmen menggunakan bunga segar berkualitas tertinggi dengan sentuhan artistik yang elegan. Setiap rangkaian dirancang dengan cinta dan perhatian penuh, karena kami percaya bunga adalah cara terindah untuk mengekspresikan perasaan."
                : "We are committed to using the freshest, highest quality flowers with elegant artistic touches. Every arrangement is designed with love and full attention, because we believe flowers are the most beautiful way to express feelings."}
            </p>
          </div>
        </motion.div>

        {/* Removed Detail Katalog section */}
        {/* Removed Kategori Produk & Layanan sections */}

        {/* ===== ORIGINAL ATELIER MASONRY GALLERY ===== */}
        <div
          className="border-t"
          style={{
            borderColor: "rgba(0,0,0,0.08)",
            paddingTop: "80px",
            paddingBottom: "80px",
          }}
        >
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            style={{ ...mono, marginBottom: "16px" }}
          >
            {language === "id" ? "Galeri Karya Kami" : "Our Works Gallery"}
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              ...serif,
              fontSize: "clamp(28px, 4vw, 48px)",
              fontWeight: 300,
              lineHeight: 1.15,
              letterSpacing: "-0.03em",
              color: "#1a1a1a",
              marginBottom: "60px",
              maxWidth: "500px",
            }}
          >
            {language === "id" ? (
              <>
                Setiap rangkaian adalah{" "}
                <em style={{ fontWeight: 300 }}>karya seni</em>
              </>
            ) : (
              <>
                Every arrangement is a{" "}
                <em style={{ fontWeight: 300 }}>work of art</em>
              </>
            )}
          </motion.p>

          {/* Desktop Masonry Grid */}
          <div
            className="hidden md:grid"
            style={{
              gridTemplateColumns: "repeat(10, 1fr)",
              gap: "24px",
              paddingBottom: "40px",
            }}
          >
            {galleryProjects.map((project, i) => {
              const pos = gridPositions[i % gridPositions.length];
              const rotation = ((project.id.charCodeAt(project.id.length - 1) % 5) - 2) * 0.6;
              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: i * 0.1 }}
                  style={{
                    gridColumn: pos.col,
                    marginTop: `${pos.mt}px`,
                  }}
                >
                  <div
                    className="group"
                    style={{
                      transform: `rotate(${rotation}deg)`,
                      transition: "transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
                      boxShadow: "0 8px 40px rgba(0,0,0,0.06)",
                    }}
                  >
                    <div
                      style={{
                        aspectRatio: project.aspect,
                        overflow: "hidden",
                        backgroundColor: "#eee",
                      }}
                    >
                      <img
                        src={normalizeAssetUrl(project.image)}
                        alt={project.title}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full transition-transform duration-[1.2s] ease-out group-hover:scale-105"
                        style={{ objectFit: "cover" }}
                        onError={(event) => {
                          const target = event.currentTarget;
                          if (studioImageFallback && target.src !== studioImageFallback) {
                            target.src = studioImageFallback;
                          }
                        }}
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex items-baseline justify-between">
                    <span style={{ ...mono, fontSize: "9px", color: "#999" }}>
                      {project.category}
                    </span>
                  </div>
                  <h3
                    style={{
                      ...serif,
                      fontSize: "clamp(18px, 2vw, 28px)",
                      fontWeight: 400,
                      color: "#1a1a1a",
                      marginTop: "4px",
                      letterSpacing: "-0.02em",
                      lineHeight: 1.2,
                    }}
                  >
                    {project.title}
                  </h3>
                </motion.div>
              );
            })}
          </div>

          {/* Mobile stack */}
          <div className="gallery-mobile-grid flex flex-col gap-16 pb-8 md:hidden">
            {galleryProjects.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.04 }}
              >
                <div
                  style={{
                    aspectRatio: "1/1",
                    overflow: "hidden",
                    backgroundColor: "#eee",
                    borderRadius: "12px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                  }}
                >
                  <img
                    src={normalizeAssetUrl(project.image)}
                    alt={project.title}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full"
                    style={{ objectFit: "cover" }}
                    onError={(event) => {
                      const target = event.currentTarget;
                      if (studioImageFallback && target.src !== studioImageFallback) {
                        target.src = studioImageFallback;
                      }
                    }}
                  />
                </div>
                <div className="mt-2">
                  <span style={{ ...mono, fontSize: "8px", color: "#999" }}>{project.category}</span>
                  <h3 style={{ ...serif, fontSize: "14px", fontWeight: 400, color: "#1a1a1a", marginTop: "2px", letterSpacing: "-0.01em", lineHeight: 1.2 }}>
                    {project.title}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Removed Kategori Produk and Layanan Kami sections */}

        {/* ===== ORDERING PROCESS SECTION ===== */}
        <div
          className="border-t"
          style={{ borderColor: "rgba(0,0,0,0.08)", marginTop: "80px", paddingTop: "80px", paddingBottom: "120px" }}
        >
          <p style={{ ...mono, marginBottom: "60px" }}>{language === "id" ? "Cara Pemesanan" : "Ordering Process"}</p>
          <div className="studio-steps-container flex flex-col gap-20 md:ml-[16.6%]" style={{ maxWidth: "520px" }}>
            {steps.map((step, i) => {
              const stepIcons = ["📋", "🎨", "💬", "🌸"];
              const stepColors = ["#d48a6a", "#c98b3f", "#7d5ba6", "#c05d5d"];
              return (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: i * 0.05 }}
                  style={{ display: "flex", gap: "24px" }}
                >
                  <motion.div
                    animate={{ y: [0, -8, 0], scale: [1, 1.1, 1] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
                    style={{
                      minWidth: "60px",
                      width: "60px",
                      height: "60px",
                      borderRadius: "50%",
                      background: `linear-gradient(135deg, ${stepColors[i]} 0%, ${stepColors[i]}dd 100%)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "28px",
                      boxShadow: `0 8px 24px ${stepColors[i]}40`,
                      position: "relative",
                    }}
                  >
                    {stepIcons[i]}
                    <motion.div
                      animate={{ opacity: [0.3, 0.8, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      style={{
                        position: "absolute",
                        inset: 0,
                        borderRadius: "50%",
                        border: `2px solid ${stepColors[i]}`,
                      }}
                    />
                  </motion.div>
                  <div>
                    <span style={{ ...mono, color: stepColors[i], fontSize: "10px", fontWeight: 700 }}>STEP {step.num}</span>
                    <h3 style={{ ...serif, fontSize: "28px", fontWeight: 400, color: "#1a1a1a", marginTop: "8px", marginBottom: "16px", letterSpacing: "-0.02em", lineHeight: 1.3 }}>
                      {language === "id" ? step.title : step.titleEn}
                    </h3>
                    <p style={{ ...body, fontSize: "14px" }}>{language === "id" ? step.text : step.textEn}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* CTA WhatsApp */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ marginTop: "80px", textAlign: "center" }}
          >
            <a
              href={getWhatsAppLink(`Halo ${config.businessName}! Saya ingin memesan bunga. Bisa dibantu? 🌸`)}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "11px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                padding: "16px 40px",
                backgroundColor: "#25D366",
                color: "#fff",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                transition: "all 0.3s ease",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              {language === "id" ? "Hubungi via WhatsApp" : "Contact via WhatsApp"}
            </a>
          </motion.div>
        </div>

        {/* ===== VIDEO SECTION ===== */}
        <StudioVideoSection />

        {/* ===== MAPS SECTION ===== */}
        {(() => {
          const mapUrl = config.mapsEmbedUrl || `https://maps.google.com/maps?q=${encodeURIComponent(config.address || "Pertokoan Pasar Senenan Bangkalan")}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
          return (
          <div
            className="border-t"
            style={{
              borderColor: "rgba(0,0,0,0.08)",
              paddingTop: "80px",
              paddingBottom: "80px",
            }}
          >
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              style={{ ...mono, marginBottom: "16px" }}
            >
              {language === "id" ? "Lokasi Kami" : "Our Location"}
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{
                ...serif,
                fontSize: "clamp(24px, 3vw, 40px)",
                fontWeight: 300,
                lineHeight: 1.2,
                letterSpacing: "-0.02em",
                color: "#1a1a1a",
                marginBottom: "40px",
                maxWidth: "500px",
              }}
            >
              {language === "id" ? "Kunjungi" : "Visit"} <em style={{ fontWeight: 300 }}>{config.businessName}</em>
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              style={{
                position: "relative",
                overflow: "hidden",
                borderRadius: "16px",
                boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
                backgroundColor: "#f8f8f8",
              }}
              whileHover={{
                boxShadow: "0 30px 80px rgba(0,0,0,0.18)",
              }}
            >
              {/* Map container with smooth aspect ratio */}
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  paddingBottom: "56.25%",
                  height: 0,
                  overflow: "hidden",
                  borderRadius: "16px",
                }}
              >
                <iframe
                  src={mapUrl}
                  width="100%"
                  height="100%"
                  className="map-iframe-hover"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    border: 0,
                    display: "block",
                    filter: "grayscale(15%) contrast(1.1) brightness(1.05)",
                    transition: "filter 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
                  }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={language === "id" ? "Lokasi Ay Bucket" : "Ay Bucket Location"}
                />
              </div>

              {/* Map decoration overlay */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(135deg, rgba(192, 93, 93, 0.05) 0%, rgba(201, 139, 63, 0.03) 100%)",
                  pointerEvents: "none",
                  borderRadius: "16px",
                }}
              />
            </motion.div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: "24px",
                paddingTop: "40px",
              }}
              className="mt-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between studio-footer-grid"
            >
              {/* Address card */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                style={{
                  padding: "24px",
                  background: "linear-gradient(135deg, rgba(192, 93, 93, 0.08), rgba(201, 139, 63, 0.05))",
                  borderRadius: "12px",
                  border: "1px solid rgba(192, 93, 93, 0.15)",
                }}
              >
                <p style={{ ...mono, color: "#bbb", marginBottom: "8px" }}>{language === "id" ? "Alamat" : "Address"}</p>
                <p style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "clamp(13px, 1.5vw, 16px)",
                  color: "#1a1a1a",
                  lineHeight: 1.6,
                  fontWeight: 500,
                  whiteSpace: "pre-wrap",
                }}>
                  📍 {config.address}
                </p>
              </motion.div>

              {/* Google Maps button */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                style={{ display: "flex", alignItems: "center", justifyContent: "flex-start" }}
              className="studio-nav-btn-container"
              >
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(config.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    ...mono,
                    fontSize: "10px",
                    padding: "12px 28px",
                    border: "1px solid #1a1a1a",
                    color: "#1a1a1a",
                    textDecoration: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    transition: "all 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
                    borderRadius: "8px",
                    background: "transparent",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#1a1a1a";
                    e.currentTarget.style.color = "#fff";
                    e.currentTarget.style.boxShadow = "0 8px 24px rgba(26, 26, 26, 0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "#1a1a1a";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <span>{language === "id" ? "Navigasi ke Lokasi" : "Navigate to Location"}</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </motion.div>
            </div>

            {/* Hours or additional info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{
                marginTop: "32px",
                padding: "24px",
                background: "rgba(255,255,255,0.4)",
                borderRadius: "12px",
                border: "1px solid rgba(0,0,0,0.06)",
                backdropFilter: "blur(4px)",
              }}
            >
              <p style={{ ...mono, marginBottom: "12px", color: "#999" }}>{language === "id" ? "Jam Operasional" : "Operating Hours"}</p>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                gap: "16px",
              }}>
                <div>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", color: "#1a1a1a", fontWeight: 600 }}>
                    {language === "id" ? "Senin - Jum'at" : "Monday - Friday"}
                  </p>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", color: "#999" }}>09:00 - 18:00</p>
                </div>
                <div>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", color: "#1a1a1a", fontWeight: 600 }}>
                    {language === "id" ? "Sabtu - Minggu" : "Saturday - Sunday"}
                  </p>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", color: "#999" }}>10:00 - 17:00</p>
                </div>
              </div>
            </motion.div>
          </div>
          );
        })()}
      </div>
      <div style={{ marginTop: 48 }}>
        <AnimatedPetals />
      </div>
      <style>{`
        @media (min-width: 768px) {
          .studio-footer-grid {
            grid-template-columns: 1fr 1fr !important;
          }
          .studio-nav-btn-container {
            justify-content: flex-end !important;
          }
        }
      `}</style>
      <Footer />
    </PageTransition>
  );
}
