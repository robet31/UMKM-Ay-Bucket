import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { getSiteConfig, getWhatsAppLink, BRAND_LOGO, categories, type Category } from "../data";
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

  const currentCategories = (config.customCategories && config.customCategories.length > 0) 
    ? config.customCategories 
    : categories;

  return (
    <footer
      className="border-t"
      style={{
        padding: "clamp(48px, 8vw, 80px) clamp(16px, 6vw, 120px)",
        borderColor: "rgba(0,0,0,0.06)",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "48px" }}>
        {/* Brand + CTA Row */}
        <div id="footer-brand" style={{ display: "grid", gap: "32px" }}>
          {/* Brand Card */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: "16px", flexWrap: "wrap" }}>
            <img
              src={config.brandLogoUrl || BRAND_LOGO.logo}
              alt={`${brandDisplayName} logo`}
              style={{ width: "64px", height: "64px", objectFit: "contain", borderRadius: "16px", mixBlendMode: "multiply", flexShrink: 0, background: "rgba(255,255,255,0.8)", padding: "4px" }}
            />
            <div style={{ flex: 1, minWidth: "200px" }}>
              <p style={{ margin: 0, fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(26px, 5vw, 34px)", lineHeight: 1.1, color: "#1a1a1a", fontWeight: 400 }}>{brandDisplayName}</p>
              <p style={{ margin: "6px 0 0 0", fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: "#8a6a52" }}>
                Florist Kamal · Telang · Bangkalan
              </p>
              <p style={{ margin: "12px 0 0 0", fontFamily: "'Inter', sans-serif", fontSize: "13px", lineHeight: 1.75, color: "#666", maxWidth: "520px" }}>
                {language === "id"
                  ? "Kami merangkai buket, standing akrilik, karangan bunga, selempang wisuda, hingga gift custom dengan pendekatan personal."
                  : "We craft bouquets, acrylic stands, flower boards, graduation sashes, and custom gifts with a personal approach."}
              </p>
            </div>
          </div>

          {/* WhatsApp CTA */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
            {(() => {
              const waIcon = (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              );
              const btnStyle = {
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                padding: "14px 28px",
                backgroundColor: "#25D366",
                color: "#fff",
                textDecoration: "none",
                borderRadius: "12px",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "11px",
                letterSpacing: "0.1em",
                textTransform: "uppercase" as const,
                fontWeight: 700,
                boxShadow: "0 6px 20px rgba(37,211,102,0.25)",
                transition: "all 0.3s ease",
              };

              return (
                <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "center" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <a href={getWhatsAppLink(undefined, 1)} target="_blank" rel="noopener noreferrer" style={btnStyle} className="whatsapp-btn-hover">
                      {waIcon} {config.whatsappNumber2 ? (language === "id" ? "Pusat / Madura" : "HQ / Madura") : (language === "id" ? "Hubungi Kami" : "Contact Us")}
                    </a>
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", color: "#555" }}>{config.whatsappDisplay}</span>
                  </div>
                  
                  {config.whatsappNumber2 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <a href={getWhatsAppLink(undefined, 2)} target="_blank" rel="noopener noreferrer" style={btnStyle} className="whatsapp-btn-hover">
                        {waIcon} {language === "id" ? "Cabang Surabaya" : "Surabaya Branch"}
                      </a>
                      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", color: "#555" }}>{config.whatsappDisplay2}</span>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        </div>

        {/* Services Quick Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "14px",
        }}>
          {currentCategories.slice(0, 4).map((cat) => ({
            emoji: cat.emoji,
            title: cat.label,
            desc: cat.description,
            msg: language === "id" 
              ? `Halo ${config.businessName}! Saya tertarik dengan ${cat.label}.` 
              : `Hello ${config.businessName}! I'm interested in ${cat.label}.`,
          })).map((item) => (
            <div
              key={item.title}
              style={{
                textDecoration: "none",
                padding: "18px",
                backgroundColor: "rgba(0,0,0,0.02)",
                border: "1px solid rgba(0,0,0,0.06)",
                borderRadius: "14px",
                display: "block",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.06)";
                e.currentTarget.style.borderColor = "rgba(184,92,59,0.2)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.borderColor = "rgba(0,0,0,0.06)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                <span style={{ fontSize: "18px" }}>{item.emoji}</span>
                <strong style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", color: "#1a1a1a" }}>{item.title}</strong>
              </div>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", color: "#666", margin: "0 0 10px 0", lineHeight: 1.7 }}>
                {item.desc}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <a href={getWhatsAppLink(item.msg, 1)} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "9px", letterSpacing: "0.08em", textTransform: "uppercase", color: "#25D366", display: "inline-flex", alignItems: "center", gap: "6px", textDecoration: "none" }} className="whatsapp-btn-hover">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                  {language === "id" ? "Pesan Sekarang" : "Order Now"}
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Info Grid */}
        <div
          id="footer-info"
          style={{
            display: "grid",
            gap: "24px",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "10px",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#999",
            lineHeight: 2,
            paddingTop: "24px",
            borderTop: "1px solid rgba(0,0,0,0.06)",
          }}
        >
          <div>
            <span style={{ color: "#bbb", display: "block", marginBottom: "4px", fontSize: "9px" }}>{language === "id" ? "Alamat" : "Address"}</span>
            <span style={{ color: "#555", fontSize: "11px", textTransform: "none", letterSpacing: "0.02em", whiteSpace: "pre-wrap" }}>{config.address}</span>
          </div>
          <div>
            <span style={{ color: "#bbb", display: "block", marginBottom: "4px", fontSize: "9px" }}>{language === "id" ? "Sosial Media" : "Social Media"}</span>
            <a href={`https://instagram.com/${(config.instagram || "ay.bucket").replace(/^@/, "")}`} target="_blank" rel="noopener noreferrer" style={{ color: "#555", display: "block", textDecoration: "none", fontSize: "11px", textTransform: "none", letterSpacing: "0.02em" }}>
              📸 Instagram: {config.instagram?.startsWith('@') ? config.instagram : `@${config.instagram}`}
            </a>
            <a href="https://instagram.com/karanganbungakamaltelang" target="_blank" rel="noopener noreferrer" style={{ color: "#555", display: "block", textDecoration: "none", fontSize: "11px", textTransform: "none", letterSpacing: "0.02em", marginTop: "2px" }}>
              📸 Instagram: @karanganbungakamaltelang
            </a>
            {config.tiktok && (
              <a href={`https://tiktok.com/@${(config.tiktok || "").replace(/^@/, "")}`} target="_blank" rel="noopener noreferrer" style={{ color: "#555", display: "block", textDecoration: "none", fontSize: "11px", textTransform: "none", letterSpacing: "0.02em", marginTop: "2px" }}>
                🎵 TikTok: {config.tiktok?.startsWith('@') ? config.tiktok : `@${config.tiktok}`}
              </a>
            )}
          </div>
          <div>
            <span style={{ color: "#bbb", display: "block", marginBottom: "4px", fontSize: "9px" }}>{language === "id" ? "Jam Operasional" : "Opening Hours"}</span>
            <span style={{ color: "#555", fontSize: "11px", textTransform: "none", letterSpacing: "0.02em" }}>
              {language === "id" ? "Senin – Minggu · 09:00 – 21:00" : "Monday – Sunday · 09:00 – 21:00"}
            </span>
          </div>
        </div>

        {/* Developer Credit Section */}
        <div style={{ 
          textAlign: "center", 
          marginTop: "40px", 
          padding: "20px 0",
          borderTop: "1px solid rgba(0,0,0,0.04)"
        }}>
          <p style={{ 
            fontFamily: "'JetBrains Mono', monospace", 
            fontSize: "9px", 
            letterSpacing: "0.12em", 
            textTransform: "uppercase", 
            color: "#bbb", 
            margin: "0 0 12px 0" 
          }}>
            &copy; {brandDisplayName} {config.year}. All rights reserved.
          </p>
          <div style={{ 
            display: "flex", 
            justifyContent: "center", 
            alignItems: "center", 
            gap: "12px",
            flexWrap: "wrap"
          }}>
            <span style={{ 
              fontFamily: "'Inter', sans-serif", 
              fontSize: "10px", 
              color: "#ccc",
              letterSpacing: "0.02em"
            }}>
              Developed by
            </span>
            <a 
              href="https://www.linkedin.com/in/arraffi-abqori-nur-azizi/" 
              target="_blank" 
              rel="noopener noreferrer" 
              style={{ 
                color: "#ff96ad", 
                textDecoration: "none", 
                fontSize: "11px", 
                fontWeight: 600,
                fontFamily: "'Inter', sans-serif",
                transition: "all 0.2s ease",
                borderBottom: "1px solid transparent"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#ff7a99";
                e.currentTarget.style.borderBottomColor = "#ff7a99";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#ff96ad";
                e.currentTarget.style.borderBottomColor = "transparent";
              }}
            >
              Ravnxx
            </a>
            <span style={{ color: "#eee" }}>|</span>
            <a 
              href="https://github.com/robet31" 
              target="_blank" 
              rel="noopener noreferrer" 
              style={{ 
                color: "#888", 
                textDecoration: "none", 
                fontSize: "11px",
                fontFamily: "'JetBrains Mono', monospace",
                transition: "color 0.2s ease"
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = "#333"}
              onMouseLeave={(e) => e.currentTarget.style.color = "#888"}
            >
              github
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          #footer-info {
            grid-template-columns: 1fr 1fr 1fr !important;
          }
          #footer-brand {
            grid-template-columns: 1fr auto !important;
            align-items: center;
          }
        }
        @media (max-width: 767px) {
          #footer-info {
            grid-template-columns: 1fr !important;
          }
          #footer-brand {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}
