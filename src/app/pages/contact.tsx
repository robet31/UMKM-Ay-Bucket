import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { PageTransition } from "../components/page-transition";
import { getSiteConfig, getWhatsAppLink } from "../data";

const mono = {
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: "9px" as const,
  letterSpacing: "0.12em",
  textTransform: "uppercase" as const,
  color: "#999",
};

export function Contact() {
  const [, setTick] = useState(0);
  useEffect(() => {
    const handler = () => setTick((t) => t + 1);
    window.addEventListener("siteConfigChanged", handler);
    return () => window.removeEventListener("siteConfigChanged", handler);
  }, []);
  const config = getSiteConfig();
  return (
    <PageTransition>
      <div
        className="flex min-h-screen flex-col justify-between"
        style={{ padding: "0 clamp(24px, 8vw, 120px)" }}
      >
        <div style={{ paddingTop: "200px" }}>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            style={mono}
          >
            Hubungi Kami
          </motion.p>
          <motion.a
            href={getWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 block"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(28px, 5vw, 64px)",
              fontWeight: 300,
              color: "#1a1a1a",
              lineHeight: 1.2,
              letterSpacing: "-0.03em",
              textDecoration: "none",
              borderBottom: "1px solid rgba(0,0,0,0.12)",
              paddingBottom: "8px",
              display: "inline-flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="#25D366" style={{ flexShrink: 0 }}>
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            {config.whatsappDisplay}
          </motion.a>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="mt-16 flex flex-col gap-6 md:flex-row md:gap-20"
          >
            <div>
              <p style={{ ...mono, marginBottom: "12px", color: "#ccc" }}>Kunjungi</p>
              <p style={{ ...mono, lineHeight: 2.2 }}>
                {config.address}
              </p>
            </div>
            <div>
              <p style={{ ...mono, marginBottom: "12px", color: "#ccc" }}>Media Sosial</p>
              <p style={{ ...mono, lineHeight: 2.2 }}>
                Instagram: {config.instagram}<br />
                TikTok: {config.tiktok}
              </p>
            </div>
            <div>
              <p style={{ ...mono, marginBottom: "12px", color: "#ccc" }}>WhatsApp</p>
              <p style={{ ...mono, lineHeight: 2.2 }}>
                {config.whatsappDisplay}<br />
                Senin &ndash; Minggu
              </p>
            </div>
          </motion.div>

          {/* WhatsApp CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            style={{ marginTop: "60px" }}
          >
            <a
              href={getWhatsAppLink("Halo El Bouquet! Saya ingin bertanya tentang produk dan pemesanan bunga 🌸")}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "10px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                padding: "14px 32px",
                backgroundColor: "#25D366",
                color: "#fff",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#128C7E"; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#25D366"; }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Chat di WhatsApp
            </a>
          </motion.div>
        </div>

        <div style={{ paddingBottom: "40px", paddingTop: "80px" }}>
          <p style={{ ...mono, color: "#ccc" }}>&copy; {config.businessName} {config.year}. All rights reserved.</p>
        </div>
      </div>
    </PageTransition>
  );
}
