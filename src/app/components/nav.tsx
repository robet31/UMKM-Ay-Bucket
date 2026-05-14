import { Link, useLocation } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { BRAND_LOGO, getSiteConfig, getCatalogWhatsAppLink } from "../data";
import { useLanguage } from "../language";

export function Nav({ scrolled = false }: { scrolled?: boolean }) {
  const location = useLocation();
  const [, setTick] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [language, setLanguage] = useLanguage();
  const [logoFailed, setLogoFailed] = useState(false);

  useEffect(() => {
    const handler = () => setTick((t) => t + 1);
    window.addEventListener("siteConfigChanged", handler);
    return () => window.removeEventListener("siteConfigChanged", handler);
  }, []);

  const toggleLanguage = () => {
    setLanguage(language === "id" ? "en" : "id");
  };

  const getNavLabel = (to: string) => {
    if (to === "/") return language === "id" ? "Katalog" : "Catalog";
    if (to === "/studio") return language === "id" ? "Tentang" : "About";
    if (to === "/contact") return language === "id" ? "Kontak" : "Contact";
    return to;
  };

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  const config = getSiteConfig();
  const hasLogo = Boolean((config.brandLogoUrl || BRAND_LOGO.logo)) && !logoFailed;
  const brandDisplayName = config.businessName || "Ay Bucket & Gift";

  return (
    <>
      <motion.nav
        aria-label="Primary navigation"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="sticky top-0 z-50 flex items-center justify-between"
        style={{
          padding: "20px clamp(16px, 6vw, 120px)",
          fontFamily: "'Inter', sans-serif",
          backdropFilter: "blur(12px)",
          background: "linear-gradient(180deg, rgba(255,240,243,1) 0%, rgba(255,240,243,0.95) 100%)",
          borderBottom: "1px solid rgba(184,92,59,0.18)",
          boxShadow: "0 10px 26px rgba(0,0,0,0.06)",
        }}
      >
        <Link
          to="/"
          aria-label={language === "id" ? "Beranda Ay Bucket & Gift" : "Ay Bucket & Gift home"}
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(18px, 3vw, 22px)",
            fontWeight: 400,
            letterSpacing: "-0.02em",
            color: "#1a1a1a",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            zIndex: 60,
          }}
        >
          {hasLogo ? (
            <img
              src={config.brandLogoUrl || BRAND_LOGO.logo}
              alt={`${config.businessName} logo`}
              onError={() => setLogoFailed(true)}
              style={{ width: "48px", height: "48px", objectFit: "contain", borderRadius: "12px", mixBlendMode: "multiply", backgroundColor: "transparent", flexShrink: 0 }}
            />
          ) : (
            <span
              aria-hidden
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "14px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, rgba(184,92,59,0.14), rgba(26,26,26,0.04))",
                border: "1px solid rgba(0,0,0,0.08)",
                color: "#b85c3b",
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "20px",
                fontWeight: 700,
                letterSpacing: "0.08em",
              }}
            >
              {brandDisplayName.substring(0, 2).toLowerCase()}
            </span>
          )}
          <span style={{ display: "flex", flexDirection: "column", marginLeft: 8, lineHeight: 1, minWidth: 0, overflow: "hidden" }}>
            <span
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(24px, 3.5vw, 32px)",
                fontWeight: 600,
                letterSpacing: "0.02em",
                textTransform: "none",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {brandDisplayName}
            </span>
            <span
              className="brand-address"
              style={{
                marginTop: "2px",
                fontFamily: "'Inter', sans-serif",
                fontSize: "9px",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "#8a6a52",
              }}
            >
              {(() => {
                const rawAddr = (config.address || "").split('\n')[0] || BRAND_LOGO.location || "";
                return rawAddr.replace(/^toko:\s*/i, "").trim() || "Ruko Jambu Raya Perumnas Kamal";
              })()}
            </span>
          </span>
        </Link>

        <div
          className="items-center gap-6"
          style={{ display: "none" }}
          id="desktop-nav"
        >
          {config.navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              aria-current={location.pathname === link.to ? "page" : undefined}
              className="relative"
              style={{
                fontSize: "11px",
                fontWeight: 500,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: location.pathname === link.to ? "#1a1a1a" : "#777",
                transition: "all 0.4s ease",
                textDecoration: "none",
                padding: "6px 10px",
                borderRadius: "999px",
                backgroundColor: location.pathname === link.to ? "rgba(184,92,59,0.14)" : "transparent",
              }}
            >
              {getNavLabel(link.to)}
            </Link>
          ))}

          {/* Combined: Language + CTA in a compact group */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginLeft: "4px" }}>
            <button
              type="button"
              onClick={toggleLanguage}
              aria-label={language === "id" ? "Switch to English" : "Ganti ke Bahasa Indonesia"}
              style={{
                fontSize: "10px",
                fontWeight: 500,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#777",
                backgroundColor: "rgba(0,0,0,0.03)",
                border: "1px solid rgba(0,0,0,0.10)",
                padding: "8px 12px",
                borderRadius: "999px",
                cursor: "pointer",
                transition: "all 0.3s ease",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#1a1a1a";
                e.currentTarget.style.color = "#1a1a1a";
                e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.06)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(0,0,0,0.10)";
                e.currentTarget.style.color = "#777";
                e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.03)";
              }}
            >
              {language === "id" ? "🇮🇩" : "🇬🇧"}
            </button>

            <a
              href={`https://wa.me/${(config.whatsappNumber || "6285880021020").replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Halo ${config.businessName}! 🌸\nSaya ingin melihat katalog produk Anda.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: "10px",
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#fff",
                backgroundColor: "#25D366",
                textDecoration: "none",
                padding: "10px 18px",
                borderRadius: "999px",
                boxShadow: "0 6px 16px rgba(37,211,102,0.2)",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                transition: "all 0.3s ease",
                whiteSpace: "nowrap",
              }}
            >
              💬 {language === "id" ? "Pesan Sekarang" : "Order Now"}
            </a>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          id="mobile-menu-btn"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu-overlay"
          style={{
            display: "none",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: "8px",
            zIndex: 60,
          }}
        >
          <div style={{ width: "22px", height: "16px", position: "relative" }}>
            <span
              style={{
                display: "block",
                width: "100%",
                height: "1.5px",
                backgroundColor: "#1a1a1a",
                position: "absolute",
                top: menuOpen ? "7px" : "0",
                transition: "all 0.3s ease",
                transform: menuOpen ? "rotate(45deg)" : "none",
              }}
            />
            <span
              style={{
                display: "block",
                width: "100%",
                height: "1.5px",
                backgroundColor: "#1a1a1a",
                position: "absolute",
                top: "7px",
                opacity: menuOpen ? 0 : 1,
                transition: "opacity 0.2s ease",
              }}
            />
            <span
              style={{
                display: "block",
                width: "100%",
                height: "1.5px",
                backgroundColor: "#1a1a1a",
                position: "absolute",
                top: menuOpen ? "7px" : "14px",
                transition: "all 0.3s ease",
                transform: menuOpen ? "rotate(-45deg)" : "none",
              }}
            />
          </div>
        </button>
      </motion.nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={language === "id" ? "Menu navigasi" : "Navigation menu"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            id="mobile-menu-overlay"
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 45,
              background: "linear-gradient(180deg, rgba(255,240,243,0.99) 0%, rgba(255,235,240,0.98) 100%)",
              backdropFilter: "blur(24px)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "24px",
              gap: "0px",
            }}
          >
            {/* Glassmorphism card container */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              style={{
                width: "100%",
                maxWidth: "360px",
                background: "rgba(255,255,255,0.85)",
                borderRadius: "24px",
                padding: "32px 28px",
                boxShadow: "0 20px 60px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)",
                backdropFilter: "blur(16px)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "6px",
              }}
            >
              {/* Nav links */}
              {config.navLinks.map((link, i) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ delay: i * 0.06 + 0.15 }}
                  style={{ width: "100%" }}
                >
                  <Link
                    to={link.to}
                    onClick={() => setMenuOpen(false)}
                    aria-current={location.pathname === link.to ? "page" : undefined}
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "28px",
                      fontWeight: location.pathname === link.to ? 600 : 400,
                      letterSpacing: "-0.01em",
                      color: location.pathname === link.to ? "#1a1a1a" : "#888",
                      textDecoration: "none",
                      transition: "all 0.3s ease",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "12px 0",
                      borderRadius: "12px",
                      background: location.pathname === link.to ? "rgba(184,92,59,0.08)" : "transparent",
                    }}
                  >
                    {getNavLabel(link.to)}
                  </Link>
                </motion.div>
              ))}

              {/* Divider */}
              <div style={{ width: "60%", height: "1px", background: "rgba(0,0,0,0.08)", margin: "8px 0" }} />

              {/* Language + CTA row */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: config.navLinks.length * 0.06 + 0.2 }}
                style={{ display: "flex", gap: "10px", width: "100%", marginTop: "4px" }}
              >
                <button
                  type="button"
                  onClick={toggleLanguage}
                  aria-label={language === "id" ? "Switch to English" : "Ganti ke Bahasa Indonesia"}
                  style={{
                    flex: "0 0 auto",
                    fontSize: "11px",
                    fontWeight: 500,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "#555",
                    backgroundColor: "rgba(0,0,0,0.04)",
                    border: "1px solid rgba(0,0,0,0.10)",
                    padding: "12px 16px",
                    borderRadius: "12px",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                >
                  {language === "id" ? "🇮🇩 ID" : "🇬🇧 EN"}
                </button>

                <a
                  href={`https://wa.me/${(config.whatsappNumber || "6285880021020").replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Halo ${config.businessName}! 🌸\nSaya ingin melihat katalog produk Anda.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMenuOpen(false)}
                  style={{
                    flex: "1 1 auto",
                    fontSize: "11px",
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "#fff",
                    backgroundColor: "#25D366",
                    textDecoration: "none",
                    padding: "12px 20px",
                    borderRadius: "12px",
                    boxShadow: "0 6px 20px rgba(37,211,102,0.25)",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                  }}
                >
                  💬 {language === "id" ? "Pesan Sekarang" : "Order Now"}
                </a>
              </motion.div>
            </motion.div>

            {/* Address below card */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              style={{ marginTop: "20px", textAlign: "center", maxWidth: "320px" }}
            >
              <p
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "8px",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#aaa",
                  whiteSpace: "pre-wrap",
                  lineHeight: 1.8,
                }}
              >
                📍 {config.address}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (min-width: 768px) {
          #desktop-nav { display: flex !important; }
          #mobile-menu-btn { display: none !important; }
        }
        @media (max-width: 767px) {
          #desktop-nav { display: none !important; }
          #mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </>
  );
}
