import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { getSiteConfig, getWhatsAppLink, BRAND_LOGO } from "../data";
import { useLanguage } from "../language";

export function Footer() {
  const [, setTick] = useState(0);
  const [language] = useLanguage();
  useEffect(() => {
    const handler = () => setTick((t) => t + 1);
    window.addEventListener("siteConfigChanged", handler);
    return () => window.removeEventListener("siteConfigChanged", handler);
  }, []);

  const config = getSiteConfig();
  const brandDisplayName = config.businessName || "Ay Bucket & Gift";

  return (
    <footer
      className="border-t"
      style={{
        padding: "clamp(40px, 8vw, 80px) clamp(16px, 6vw, 120px)",
        borderColor: "rgba(0,0,0,0.08)",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "40px",
        }}
      >
        {/* Brand Card */}
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr)", gap: "14px", padding: "18px", border: "1px solid rgba(0,0,0,0.08)", borderRadius: "14px", background: "rgba(255,255,255,0.7)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <img src={config.brandLogoUrl || BRAND_LOGO.logo} alt={`${brandDisplayName} logo`} style={{ width: "56px", height: "56px", objectFit: "contain", borderRadius: "999px", mixBlendMode: "multiply" }} />
            <div>
              <p style={{ margin: 0, fontFamily: "'Cormorant Garamond', serif", fontSize: "30px", lineHeight: 1, color: "#1a1a1a" }}>{brandDisplayName}</p>
              <p style={{ margin: "4px 0 0 0", fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: "#8a6a52" }}>
                Florist Kamal · Telang · Bangkalan
              </p>
            </div>
          </div>
          <p style={{ margin: 0, fontFamily: "'Inter', sans-serif", fontSize: "14px", lineHeight: 1.8, color: "#555" }}>
            {language === "id"
              ? "Kami merangkai buket, standing akrilik, karangan bunga, selempang wisuda, hingga gift custom dengan pendekatan personal. Setiap pesanan disiapkan rapi, cepat, dan bisa menyesuaikan tema acara Anda."
              : "We craft bouquets, acrylic stands, flower boards, graduation sashes, and custom gifts with a personal approach. Every order is prepared neatly, quickly, and tailored to your event theme."}
          </p>
        </div>

        {/* WhatsApp CTA */}
        <div>
          <a
            href={getWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(20px, 4vw, 48px)",
              fontWeight: 300,
              color: "#1a1a1a",
              lineHeight: 1.2,
              textDecoration: "none",
              borderBottom: "1px solid rgba(0,0,0,0.15)",
              paddingBottom: "4px",
              transition: "border-color 0.4s ease",
              display: "inline-flex",
              alignItems: "center",
              gap: "clamp(8px, 2vw, 12px)",
              flexWrap: "wrap",
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#25D366" style={{ flexShrink: 0 }}>
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            {config.whatsappDisplay}
          </a>
          {config.footerText && (
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "clamp(12px, 2vw, 13px)",
              color: "#777",
              marginTop: "16px",
              maxWidth: "400px",
              lineHeight: 1.6,
            }}>
              {config.footerText}
            </p>
          )}
        </div>

        {/* Services Quick Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "16px",
          paddingTop: "8px",
        }}>
          {[
            {
              emoji: "🌸",
              title: language === "id" ? "Buket Premium" : "Premium Bouquets",
              desc: language === "id" ? "Rangkaian bunga segar & artificial berkualitas tinggi untuk momen spesial Anda." : "High-quality fresh & artificial flower arrangements for your special moments.",
              link: getWhatsAppLink(language === "id" ? `Halo ${config.businessName}! Saya tertarik dengan buket premium. Bisa dibantu?` : `Hello ${config.businessName}! I'm interested in premium bouquets. Can you help?`),
            },
            {
              emoji: "🍭",
              title: language === "id" ? "Snack & Money Bouquet" : "Snack & Money Bouquet",
              desc: language === "id" ? "Hadiah unik dengan susunan snack, cokelat, atau uang yang cantik dan berkesan." : "Unique gifts with beautifully arranged snacks, chocolates, or money bouquets.",
              link: getWhatsAppLink(language === "id" ? `Halo ${config.businessName}! Saya tertarik dengan snack/money bouquet. Bisa dibantu?` : `Hello ${config.businessName}! I'm interested in snack/money bouquets. Can you help?`),
            },
            {
              emoji: "✨",
              title: language === "id" ? "Gift & Accessories" : "Gift & Accessories",
              desc: language === "id" ? "Selempang wisuda, frame akrilik, standing, dan aksesoris hadiah lainnya." : "Graduation sashes, acrylic frames, stands, and other gift accessories.",
              link: getWhatsAppLink(language === "id" ? `Halo ${config.businessName}! Saya tertarik dengan gift & accessories. Bisa dibantu?` : `Hello ${config.businessName}! I'm interested in gifts & accessories. Can you help?`),
            },
          ].map((item) => (
            <a
              key={item.title}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                textDecoration: "none",
                padding: "18px",
                backgroundColor: "rgba(0,0,0,0.02)",
                border: "1px solid rgba(0,0,0,0.06)",
                borderRadius: "12px",
                display: "block",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)";
                e.currentTarget.style.borderColor = "rgba(184,92,59,0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.borderColor = "rgba(0,0,0,0.06)";
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                <span style={{ fontSize: "18px" }}>{item.emoji}</span>
                <strong style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", color: "#1a1a1a" }}>{item.title}</strong>
              </div>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", color: "#666", margin: "0 0 10px 0", lineHeight: 1.7 }}>
                {item.desc}
              </p>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "9px", letterSpacing: "0.08em", textTransform: "uppercase", color: "#25D366", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                {language === "id" ? "Tanya via WhatsApp" : "Ask via WhatsApp"}
              </span>
            </a>
          ))}
        </div>

        {/* Info grid */}
        <div
          id="footer-info"
          style={{
            display: "grid",
            gap: "24px",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "9px",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#999",
            lineHeight: 2,
          }}
        >
          <div>
            <span style={{ color: "#bbb", display: "block", marginBottom: "4px" }}>{language === "id" ? "Alamat" : "Address"}</span>
            <span style={{ color: "#666" }}>{config.address}</span>
          </div>
          <div>
            <span style={{ color: "#bbb", display: "block", marginBottom: "4px" }}>{language === "id" ? "Sosial Media" : "Social Media"}</span>
            <a href={`https://instagram.com/${(config.instagram || "aybuket").replace(/^@/, "")}`} target="_blank" rel="noopener noreferrer" style={{ color: "#666", display: "block", textDecoration: "none" }}>
              IG: {config.instagram?.startsWith('@') ? config.instagram : `@${config.instagram}`}
            </a>
            {config.tiktok && (
              <a href={`https://tiktok.com/@${(config.tiktok || "").replace(/^@/, "")}`} target="_blank" rel="noopener noreferrer" style={{ color: "#666", display: "block", textDecoration: "none" }}>
                TikTok: {config.tiktok?.startsWith('@') ? config.tiktok : `@${config.tiktok}`}
              </a>
            )}
          </div>
          <div>
            <span style={{ color: "#ccc" }}>&copy; {brandDisplayName} {config.year}. All rights reserved.</span>
            <span style={{ color: "#666", display: "block", marginTop: "4px" }}>{BRAND_LOGO.location}</span>
          </div>
        </div>
      </div>

      {/* Operating Hours + Quick Links */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.25 }}
      >
        <h4 style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", color: "#1a1a1a", fontWeight: 700, margin: "0 0 12px 0" }}>{language === "id" ? "Jam Operasional" : "Opening Hours"}</h4>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", color: "#555", margin: 0 }}>{language === "id" ? "Senin – Minggu · 09:00 – 21:00" : "Monday – Sunday · 09:00 – 21:00"}</p>

        <div style={{ marginTop: "18px" }}>
          <h4 style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", color: "#1a1a1a", fontWeight: 700, margin: "0 0 12px 0" }}>{language === "id" ? "Link Cepat" : "Quick Links"}</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {getSiteConfig().navLinks?.map((nl) => (
              <a key={nl.to} href={nl.to} style={{ color: "#555", textDecoration: "none", fontFamily: "'Inter', sans-serif" }}>
                {nl.to === "/" ? (language === "id" ? "Katalog" : "Catalog") : nl.to === "/studio" ? (language === "id" ? "Tentang" : "About") : nl.to === "/contact" ? (language === "id" ? "Kontak" : "Contact") : nl.label}
              </a>
            ))}
          </div>
        </div>
      </motion.div>
      <style>{`
        @media (min-width: 768px) {
          #footer-info {
            grid-template-columns: 1fr 1fr auto !important;
            align-items: end;
          }
        }
        @media (max-width: 767px) {
          #footer-info {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}
