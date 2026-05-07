import { useState, useEffect, useMemo } from "react";
import { motion } from "motion/react";
import { PageTransition } from "../components/page-transition";
import { getSiteConfig, getWhatsAppLink } from "../data";
import AnimatedPetals from "../components/animated-petals";
import { useLanguage } from "../language";

const mono = {
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: "9px" as const,
  letterSpacing: "0.12em",
  textTransform: "uppercase" as const,
  color: "#999",
};

export function Contact() {
  const [, setTick] = useState(0);
  const [language] = useLanguage();
  useEffect(() => {
    const handler = () => setTick((t) => t + 1);
    window.addEventListener("siteConfigChanged", handler);
    return () => window.removeEventListener("siteConfigChanged", handler);
  }, []);
  const config = getSiteConfig();
  const testimonials = useMemo(
    () => [
      { id: "t1", quote: "Pelayanan cepat dan buketnya sangat cantik, recommended!", name: "Budi Santoso", role: language === "id" ? "Pelanggan" : "Customer" },
      { id: "t2", quote: "Produk sesuai foto, packing rapi. Terima kasih!", name: "Sari Wulandari", role: language === "id" ? "Pelanggan" : "Customer" },
      { id: "t3", quote: "Kualitas bunga sangat bagus, kirim tepat waktu.", name: "Ahmad Fauzi", role: language === "id" ? "Pelanggan" : "Customer" },
      { id: "t4", quote: "Customer service ramah dan bantu penyesuaian warna.", name: "Rina", role: language === "id" ? "Pelanggan" : "Customer" },
    ],
    [language],
  );
  return (
    <PageTransition>
      <div
        className="flex min-h-screen flex-col justify-between overflow-x-hidden"
        style={{ padding: "0 clamp(20px, 5vw, 60px)" }}
      >
        <div style={{ paddingTop: "200px", maxWidth: "1280px", margin: "0 auto", width: "100%" }}>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            style={mono}
          >
            {language === "id" ? "Hubungi Kami" : "Contact Us"}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45, duration: 0.6 }}
            style={{ marginTop: "12px", marginBottom: "24px" }}
          >
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", lineHeight: 1.6, color: "#666" }}>
              {language === "id"
                ? "Hubungi kami melalui WhatsApp untuk pertanyaan, pemesanan, atau custom arrangement. Tim kami siap membantu 24/7."
                : "Contact us via WhatsApp for inquiries, orders, or custom arrangements. Our team is ready to help around the clock."}
            </p>
          </motion.div>

          <motion.a
            href={getWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="mt-4 block"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(28px, 5vw, 64px)",
              fontWeight: 300,
              color: "#1a1a1a",
              lineHeight: 1.2,
              letterSpacing: "-0.03em",
              textDecoration: "none",
              borderBottom: "2px solid #ff96ad",
              paddingBottom: "12px",
              display: "inline-flex",
              alignItems: "center",
              gap: "16px",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as any).style.color = "#ff96ad";
              (e.currentTarget as any).style.paddingBottom = "14px";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as any).style.color = "#1a1a1a";
              (e.currentTarget as any).style.paddingBottom = "12px";
            }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="#25D366" style={{ flexShrink: 0 }}>
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            {config.whatsappDisplay}
          </motion.a>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="mt-20 grid gap-8 xl:grid-cols-[1.15fr_0.85fr] items-start"
          >
            <div className="grid gap-6 min-w-0">
              {/* Decorative divider */}
              <div style={{ height: "1px", background: "linear-gradient(90deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.05) 50%, transparent 100%)", marginBottom: "8px" }} />

              <div style={{ paddingTop: "16px" }}>
                <p style={{ ...mono, marginBottom: "16px", color: "#ff96ad", letterSpacing: "0.15em" }}>
                  📍 {language === "id" ? "Kunjungi Toko Kami" : "Visit Our Store"}
                </p>
                <div style={{ background: "rgba(255, 150, 173, 0.04)", border: "1px solid rgba(255, 150, 173, 0.15)", borderRadius: "8px", padding: "16px", marginBottom: "16px" }}>
                  <p style={{ ...mono, lineHeight: 2.2, marginBottom: 0, color: "#333" }}>
                    <strong>{config.address || "Pertokoan Pasar Senenan, Bangkalan"}</strong><br />
                    <span style={{ color: "#999", fontSize: "11px" }}>{language === "id" ? "Buka setiap hari" : "Open daily"}</span>
                  </p>
                </div>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", lineHeight: 1.6, color: "#777", marginTop: "12px" }}>
                  {language === "id"
                    ? "Kunjungi showroom kami untuk melihat langsung koleksi bunga segar dan berbagai pilihan arrangements eksklusif."
                    : "Visit our showroom to see our fresh flower collection and exclusive arrangement options in person."}
                </p>
              </div>

              <div style={{ paddingTop: "12px", borderTopWidth: "1px", borderTopStyle: "solid", borderTopColor: "rgba(0,0,0,0.06)" }}>
                <p style={{ ...mono, color: "#ccc", marginBottom: "14px" }}>{language === "id" ? "Tentang Brand" : "About Brand"}</p>
                <div style={{ background: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.06)", borderRadius: "8px", padding: "18px", transition: "all 0.3s ease" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as any).style.background = "rgba(0,0,0,0.035)";
                    (e.currentTarget as any).style.borderColor = "rgba(0,0,0,0.12)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as any).style.background = "rgba(0,0,0,0.02)";
                    (e.currentTarget as any).style.borderColor = "rgba(0,0,0,0.06)";
                  }}
                >
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "24px", margin: 0, color: "#1a1a1a", fontWeight: 400, letterSpacing: "-0.02em" }}>
                    {config.businessName}
                  </p>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", lineHeight: 1.8, color: "#666", marginTop: "12px", marginBottom: 0 }}>
                    {language === "id"
                      ? "Kami menghadirkan buket premium, snack bouquet, money bouquet, dan rangkaian custom terbaik untuk hadiah istimewa, momen berharga, dan kebutuhan acara spesial Anda. Setiap produk dibuat dengan detail dan kualitas terbaik."
                      : "We offer premium bouquets, snack bouquets, money bouquets, and custom arrangements crafted with excellence. Perfect for gifts, special moments, and event needs. Every product is created with meticulous detail and premium quality."}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-6 min-w-0">
              {/* Decorative divider */}
              <div style={{ height: "1px", background: "linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.05) 50%, rgba(0,0,0,0.1) 100%)", marginBottom: "8px" }} />

              <div style={{ paddingTop: "16px" }}>
                <p style={{ ...mono, color: "#ccc", marginBottom: "14px" }}>{language === "id" ? "Hubungi Kami" : "Quick Links"}</p>
                <div style={{ background: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.06)", borderRadius: "8px", padding: "18px", transition: "all 0.3s ease" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as any).style.background = "rgba(0,0,0,0.035)";
                    (e.currentTarget as any).style.borderColor = "rgba(0,0,0,0.12)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as any).style.background = "rgba(0,0,0,0.02)";
                    (e.currentTarget as any).style.borderColor = "rgba(0,0,0,0.06)";
                  }}
                >
                  <div style={{ marginBottom: "14px" }}>
                    <span style={{ ...mono, color: "#999", fontSize: "10px", marginBottom: "6px", display: "block" }}>📱 WhatsApp</span>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", margin: 0, color: "#1a1a1a", fontWeight: 500 }}>
                      {config.whatsappDisplay}
                    </p>
                  </div>
                  <div style={{ marginBottom: "14px", paddingTop: "12px", borderTopWidth: "1px", borderTopStyle: "solid", borderTopColor: "rgba(0,0,0,0.06)" }}>
                    <span style={{ ...mono, color: "#999", fontSize: "10px", marginBottom: "6px", display: "block" }}>📸 Instagram</span>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", margin: 0, color: "#1a1a1a", fontWeight: 500 }}>
                      @{config.instagram}
                    </p>
                  </div>
                  <div style={{ paddingTop: "12px", borderTopWidth: "1px", borderTopStyle: "solid", borderTopColor: "rgba(0,0,0,0.06)" }}>
                    <span style={{ ...mono, color: "#999", fontSize: "10px", marginBottom: "6px", display: "block" }}>🎨 Katalog</span>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", margin: 0, color: "#777" }}>
                      {language === "id" ? "Canva / Pinterest" : "Canva / Pinterest"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Map + Service Area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="mt-20 grid gap-8"
          >
            {/* Decorative divider */}
            <div style={{ height: "1px", background: "linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.08) 50%, transparent 100%)" }} />

            <div className="min-w-0">
              <p style={{ ...mono, color: "#ff96ad", marginBottom: "16px", letterSpacing: "0.15em" }}>
                🗺️ {language === "id" ? "Lokasi Kami" : "Our Location"}
              </p>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", lineHeight: 1.6, color: "#777", marginBottom: "16px" }}>
                {language === "id"
                  ? "Temukan kami di Pertokoan Pasar Senenan, Bangkalan. Klik map di bawah untuk rute ke lokasi kami."
                  : "Find us at Pertokoan Pasar Senenan, Bangkalan. Click the map below to get directions to our location."}
              </p>
              <div
                style={{
                  borderRadius: 14,
                  overflow: "hidden",
                  boxShadow: "0 18px 40px rgba(0,0,0,0.08)",
                  border: "1px solid rgba(0,0,0,0.05)",
                  background: "#fff",
                }}
              >
                <iframe
                  title="Ay Bucket Location"
                  src={config.mapsEmbedUrl || `https://www.google.com/maps?q=${encodeURIComponent(config.address || "Pertokoan Pasar Senenan, Bangkalan")}&output=embed`}
                  className="map-iframe-hover"
                  style={{ width: "100%", height: 420, border: 0, display: "block" }}
                  loading="lazy"
                />
              </div>
            </div>

            <div>
              <p style={{ ...mono, color: "#159c4e", marginBottom: "16px", letterSpacing: "0.15em" }}>
                🚚 {language === "id" ? "Area Pengiriman" : "Delivery Areas"}
              </p>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", lineHeight: 1.6, color: "#777", marginBottom: "14px" }}>
                {language === "id"
                  ? "Kami melayani pengiriman ke berbagai area untuk memastikan produk sampai dengan aman dan tepat waktu."
                  : "We deliver to various areas ensuring your order arrives safely and on time."}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {["Sidoarjo Kota", "Waru", "Gedangan", "Sedati", "Buduran", "Candi", "Tanggulangin", "Porong", "Surabaya Selatan"].map((item) => (
                  <span
                    key={item}
                    style={{
                      padding: "10px 18px",
                      borderRadius: "999px",
                      border: "1.5px solid #bfe7ca",
                      background: "linear-gradient(135deg, rgba(200,245,210,0.5) 0%, rgba(200,245,210,0.25) 100%)",
                      color: "#159c4e",
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "13px",
                      fontWeight: 500,
                      transition: "all 0.3s ease",
                      cursor: "default",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as any).style.background = "rgba(200,245,210,0.6)";
                      (e.currentTarget as any).style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as any).style.background = "linear-gradient(135deg, rgba(200,245,210,0.5) 0%, rgba(200,245,210,0.25) 100%)";
                      (e.currentTarget as any).style.transform = "translateY(0)";
                    }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Customer Feedback (Full Width) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            className="mt-20"
          >
            {/* Decorative divider */}
            <div style={{ height: "1px", background: "linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.08) 50%, transparent 100%)", marginBottom: "20px" }} />

            <p style={{ ...mono, color: "#ff96ad", marginBottom: "16px", letterSpacing: "0.15em" }}>
              ⭐ {language === "id" ? "Kepuasan Pelanggan" : "Customer Reviews"}
            </p>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", lineHeight: 1.6, color: "#777", marginBottom: "18px" }}>
              {language === "id"
                ? "Dengarkan pengalaman pelanggan kami yang puas dengan produk dan layanan Ay Bucket. Testimoni mereka adalah bukti komitmen kami terhadap kualitas."
                : "Hear from our satisfied customers about their experience with Ay Bucket products and service. Their testimonials speak to our commitment to quality."}
            </p>
            <div style={{ position: "relative", overflow: "hidden", padding: "16px 0", width: "100%" }}>
              <style>{`
                .feedback-track{ display:flex; gap:18px; width:max-content; min-width:100%; animation: feedbackMove 24s linear infinite; }
                .feedback-track:hover{ animation-play-state: paused; }
                .feedback-card{ width: clamp(280px, 24vw, 340px); flex: 0 0 clamp(280px, 24vw, 340px); border-radius: 12px; background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 248, 250, 0.9) 100%); border: 1px solid rgba(255, 150, 173, 0.2); box-shadow: 0 8px 28px rgba(255, 150, 173, 0.08); padding: 20px 22px; transition: all 0.3s ease; }
                .feedback-card:hover{ transform: translateY(-4px); box-shadow: 0 12px 40px rgba(255, 150, 173, 0.15); border-color: rgba(255, 150, 173, 0.35); }
                .feedback-card-header{ display: flex; align-items: center; gap: 12; margin-bottom: 14px; }
                .feedback-avatar{ width: 48px; height: 48px; border-radius: 999px; background: linear-gradient(135deg, #ff96ad 0%, #ff6aa2 50%, #ff5a8f 100%); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 18px; }
                .feedback-name{ font-weight: 600; color: #1a1a1a; font-size: 15px; }
                .feedback-role{ font-size: 12px; color: #999; }
                .feedback-quote{ margin-top: 14px; font-family: 'Inter', sans-serif; font-size: 14px; line-height: 1.6; color: #555; font-style: italic; }
                @keyframes feedbackMove { from { transform: translateX(0); } to { transform: translateX(-50%); } }
              `}</style>
              <div className="feedback-track">
                {[...testimonials, ...testimonials].map((item, idx) => (
                  <div key={`${item.id}-${idx}`} className="feedback-card">
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 48, height: 48, borderRadius: 999, background: "linear-gradient(135deg, #ff96ad, #ff6aa2)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "18px" }}>
                        {item.name.charAt(0)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: "#1a1a1a", fontSize: "15px" }}>{item.name}</div>
                        <div style={{ fontSize: 12, color: "#999" }}>{item.role}</div>
                      </div>
                    </div>
                    <p style={{ marginTop: 14, fontFamily: "'Inter', sans-serif", fontSize: 14, lineHeight: 1.6, color: "#555", fontStyle: "italic", marginBottom: 0 }}>
                      &ldquo;{item.quote}&rdquo;
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* WhatsApp CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8, duration: 0.8 }}
            style={{ marginTop: "72px", textAlign: "center", paddingTop: "48px", borderTopWidth: "1px", borderTopStyle: "solid", borderTopColor: "rgba(0,0,0,0.05)" }}
          >
            <p style={{ ...mono, color: "#ccc", marginBottom: "16px" }}>{language === "id" ? "Siap Memesan?" : "Ready to Order?"}</p>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(24px, 4vw, 40px)", lineHeight: 1.3, color: "#1a1a1a", margin: "0 0 20px 0", fontWeight: 300, letterSpacing: "-0.02em" }}>
              {language === "id"
                ? "Hubungi kami sekarang melalui WhatsApp"
                : "Contact us now on WhatsApp"}
            </p>
            <a
              href={getWhatsAppLink("Halo Ay Bucket! Saya ingin bertanya tentang produk dan pemesanan bunga 🌸")}
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
                borderRadius: "4px",
                transition: "all 0.3s ease",
                fontWeight: 600,
              }}
              className="whatsapp-btn-hover"
              onMouseEnter={(e) => {
                (e.currentTarget as any).style.backgroundColor = "#1fba50";
                (e.currentTarget as any).style.transform = "translateY(-2px)";
                (e.currentTarget as any).style.boxShadow = "0 8px 20px rgba(37, 211, 102, 0.3)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as any).style.backgroundColor = "#25D366";
                (e.currentTarget as any).style.transform = "translateY(0)";
                (e.currentTarget as any).style.boxShadow = "none";
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              {language === "id" ? "Chat WhatsApp Sekarang" : "Chat on WhatsApp Now"}
            </a>
          </motion.div>

          {/* Decorative animated petals to fill whitespace */}
          <div style={{ marginTop: 48 }}>
            <AnimatedPetals />
          </div>

        </div>

        <div style={{ paddingBottom: "40px", paddingTop: "80px", textAlign: "center", borderTopWidth: "1px", borderTopStyle: "solid", borderTopColor: "rgba(0,0,0,0.05)" }}>
          <p style={{ ...mono, color: "#bbb", marginBottom: "8px" }}>© {config.businessName} {config.year}. All rights reserved.</p>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", color: "#999", margin: 0 }}>
            {language === "id" ? "Dibuat dengan ❤️ untuk setiap momen istimewa Anda" : "Crafted with ❤️ for every special moment of yours"}
          </p>
        </div>
      </div>
    </PageTransition>
  );
}
