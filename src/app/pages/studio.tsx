import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { PageTransition } from "../components/page-transition";
import { Footer } from "../components/footer";
import { StudioVideoSection } from "../components/video-gallery";
import { getSiteConfig, categories, getWhatsAppLink } from "../data";

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

// ---- Original Atelier masonry gallery data ----
const galleryProjects = [
  {
    id: "gallery-1",
    title: "Rose Classic Collection",
    category: "Bouquet Classic",
    aspect: "3/4" as const,
    image: "https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=800&q=80",
  },
  {
    id: "gallery-2",
    title: "Premium Wedding Arrangement",
    category: "Bouquet Wedding",
    aspect: "1/1" as const,
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
  },
  {
    id: "gallery-3",
    title: "Standing Flower Grand",
    category: "Standing Flower",
    aspect: "16/9" as const,
    image: "https://images.unsplash.com/photo-1523693916903-027d144a2b7d?w=800&q=80",
  },
  {
    id: "gallery-4",
    title: "Bloom Box Gift",
    category: "Bloom Box",
    aspect: "3/4" as const,
    image: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=800&q=80",
  },
  {
    id: "gallery-5",
    title: "Premium Rose Bouquet",
    category: "Bouquet Premium",
    aspect: "1/1" as const,
    image: "https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=800&q=80",
  },
  {
    id: "gallery-6",
    title: "Elegant Table Arrangement",
    category: "Bunga Meja",
    aspect: "16/9" as const,
    image: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=800&q=80",
  },
];

const gridPositions = [
  { col: "1 / 5", mt: 0 },
  { col: "6 / 10", mt: 180 },
  { col: "2 / 7", mt: 40 },
  { col: "7 / 11", mt: 120 },
  { col: "1 / 6", mt: 60 },
  { col: "5 / 10", mt: 200 },
];

const steps = [
  { num: "01", title: "Pilih Produk", text: "Jelajahi katalog lengkap kami — dari bouquet classic yang affordable hingga rangkaian premium eksklusif. Setiap produk dirancang dengan bunga segar berkualitas." },
  { num: "02", title: "Custom Pesanan", text: "Bebas request nuansa warna, jenis bunga, wrapping, dan kartu ucapan sesuai keinginan Anda. Kami siap membantu mewujudkan rangkaian bunga impian." },
  { num: "03", title: "Konfirmasi via WhatsApp", text: "Hubungi kami melalui WhatsApp untuk konfirmasi pesanan, diskusi detail, dan pembayaran. Tim kami siap melayani dengan cepat dan ramah." },
  { num: "04", title: "Pengiriman & Bahagia", text: "Pesanan dirangkai dengan penuh cinta dan ketelitian. Kami akan mengantarkan kebahagiaan langsung ke tempat tujuan." },
];

export function Studio() {
  const [, setTick] = useState(0);
  useEffect(() => {
    const handler = () => setTick((t) => t + 1);
    window.addEventListener("siteConfigChanged", handler);
    return () => window.removeEventListener("siteConfigChanged", handler);
  }, []);

  const config = getSiteConfig();

  return (
    <PageTransition>
      <div style={{ padding: "0 clamp(24px, 8vw, 120px)" }}>
        {/* Header */}
        <div style={{ paddingTop: "160px", paddingBottom: "100px" }}>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            style={mono}
          >
            Tentang Kami
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
            }}
          >
            Rangkai keindahan
            <br />
            dengan sepenuh{" "}
            <em>hati</em>
          </motion.h1>
        </div>

        {/* Intro */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="grid grid-cols-1 gap-12 md:grid-cols-12"
          style={{ paddingBottom: "120px" }}
        >
          <div className="md:col-span-5 md:col-start-2">
            <p style={body}>
              <strong style={{ color: "#1a1a1a" }}>{config.businessName}</strong> adalah
              florist profesional yang berlokasi di {config.address}. Kami
              menyediakan beragam rangkaian bunga segar untuk berbagai momen spesial &mdash;
              dari hadiah romantis hingga dekorasi acara besar.
            </p>
          </div>
          <div className="md:col-span-4 md:col-start-8">
            <p style={body}>
              Dengan pengalaman dan dedikasi, setiap rangkaian kami dibuat dengan
              bunga segar berkualitas tinggi dan sentuhan artistik yang elegan.
              Kami percaya bahwa bunga adalah bahasa universal kebahagiaan.
            </p>
          </div>
        </motion.div>

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
            Galeri Karya Kami
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
            Setiap rangkaian adalah{" "}
            <em style={{ fontWeight: 300 }}>karya seni</em>
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
                        src={project.image}
                        alt={project.title}
                        className="h-full w-full transition-transform duration-[1.2s] ease-out group-hover:scale-105"
                        style={{ objectFit: "cover" }}
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
          <div className="flex flex-col gap-16 pb-8 md:hidden">
            {galleryProjects.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.05 }}
              >
                <div
                  style={{
                    aspectRatio: project.aspect,
                    overflow: "hidden",
                    backgroundColor: "#eee",
                    boxShadow: "0 8px 40px rgba(0,0,0,0.06)",
                  }}
                >
                  <img
                    src={project.image}
                    alt={project.title}
                    className="h-full w-full"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className="mt-3">
                  <span style={{ ...mono, fontSize: "9px", color: "#999" }}>{project.category}</span>
                  <h3 style={{ ...serif, fontSize: "22px", fontWeight: 400, color: "#1a1a1a", marginTop: "4px", letterSpacing: "-0.02em" }}>
                    {project.title}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div
          className="border-t"
          style={{ borderColor: "rgba(0,0,0,0.08)", paddingTop: "80px", paddingBottom: "40px" }}
        >
          <p style={mono}>Kategori Produk</p>
          <div className="mt-10 grid grid-cols-2 gap-x-8 gap-y-4 md:grid-cols-4" style={{ maxWidth: "700px" }}>
            {categories.map((cat) => (
              <span key={cat.key} style={{ ...mono, fontSize: "8px", lineHeight: 2.4 }}>
                {cat.emoji} {cat.label}
              </span>
            ))}
          </div>
        </div>

        {/* Services */}
        <div
          className="border-t"
          style={{ borderColor: "rgba(0,0,0,0.08)", paddingTop: "80px", paddingBottom: "40px" }}
        >
          <p style={mono}>Layanan Kami</p>
          <div className="mt-10 grid grid-cols-2 gap-x-8 gap-y-4 md:grid-cols-4" style={{ maxWidth: "600px" }}>
            {["Bouquet Fresh Flower", "Hampers & Gift Box", "Standing Flower", "Bunga Meja", "Money Bouquet", "Bloom Box", "Wedding Bouquet", "Bunga Mobil", "Papan Karangan", "Bunga Salib", "Custom Order", "Free Kartu Ucapan"].map((s) => (
              <span key={s} style={{ ...mono, fontSize: "8px", lineHeight: 2.4 }}>{s}</span>
            ))}
          </div>
        </div>

        {/* The Process */}
        <div
          className="border-t"
          style={{ borderColor: "rgba(0,0,0,0.08)", marginTop: "80px", paddingTop: "80px", paddingBottom: "120px" }}
        >
          <p style={{ ...mono, marginBottom: "60px" }}>Cara Pemesanan</p>
          <div className="flex flex-col gap-20 md:ml-[16.6%]" style={{ maxWidth: "520px" }}>
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: i * 0.05 }}
              >
                <span style={{ ...mono, color: "#ccc" }}>{step.num}</span>
                <h3 style={{ ...serif, fontSize: "28px", fontWeight: 400, color: "#1a1a1a", marginTop: "8px", marginBottom: "16px", letterSpacing: "-0.02em", lineHeight: 1.3 }}>
                  {step.title}
                </h3>
                <p style={{ ...body, fontSize: "14px" }}>{step.text}</p>
              </motion.div>
            ))}
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
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Hubungi via WhatsApp
            </a>
          </motion.div>
        </div>

        {/* ===== VIDEO SECTION ===== */}
        <StudioVideoSection />

        {/* ===== MAPS SECTION ===== */}
        {config.mapsEmbedUrl && (
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
              Lokasi Kami
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
              Kunjungi <em style={{ fontWeight: 300 }}>{config.businessName}</em>
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              style={{
                position: "relative",
                overflow: "hidden",
                boxShadow: "0 12px 48px rgba(0,0,0,0.08)",
              }}
            >
              <iframe
                src={config.mapsEmbedUrl}
                width="100%"
                height="400"
                style={{
                  border: 0,
                  display: "block",
                  filter: "grayscale(30%) contrast(1.05)",
                  transition: "filter 0.5s ease",
                }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Lokasi Pesona Florist"
                onMouseEnter={(e) => {
                  (e.target as HTMLIFrameElement).style.filter = "grayscale(0%) contrast(1)";
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLIFrameElement).style.filter = "grayscale(30%) contrast(1.05)";
                }}
              />
            </motion.div>

            <div
              className="mt-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between"
              style={{ paddingTop: "24px" }}
            >
              <div>
                <p style={{ ...mono, color: "#bbb", marginBottom: "4px" }}>Alamat</p>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", color: "#555" }}>
                  📍 {config.address}
                </p>
              </div>
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(config.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  ...mono,
                  fontSize: "10px",
                  padding: "10px 20px",
                  border: "1px solid #1a1a1a",
                  color: "#1a1a1a",
                  textDecoration: "none",
                  display: "inline-block",
                  transition: "all 0.3s ease",
                  marginTop: "12px",
                }}
              >
                Buka di Google Maps →
              </a>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </PageTransition>
  );
}
