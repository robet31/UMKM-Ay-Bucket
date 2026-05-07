import { Link, useLocation } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { BRAND_LOGO, getSiteConfig, getCatalogWhatsAppLink } from "../data";
import { useLanguage } from "../language";

export function Nav() {
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
          background: "linear-gradient(180deg, rgba(249,249,247,1) 0%, rgba(249,249,247,0.95) 100%)",
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
              style={{ width: "44px", height: "44px", objectFit: "contain", borderRadius: "12px", mixBlendMode: "multiply", backgroundColor: "transparent" }}
            />
          ) : (
            <span
              aria-hidden
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "14px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, rgba(184,92,59,0.14), rgba(26,26,26,0.04))",
                border: "1px solid rgba(0,0,0,0.08)",
                color: "#b85c3b",
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "18px",
                fontWeight: 700,
                letterSpacing: "0.08em",
              }}
            >
              {brandDisplayName.substring(0, 2).toLowerCase()}
            </span>
          )}
          <span style={{ display: "flex", flexDirection: "column", marginLeft: 8, lineHeight: 1 }}>
            <span
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(22px, 3vw, 28px)",
                fontWeight: 600,
                letterSpacing: "0.02em",
                textTransform: "none",
              }}
            >
              {brandDisplayName}
            </span>
            <span
              style={{
                marginTop: "2px",
                fontFamily: "'Inter', sans-serif",
                fontSize: "9px",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "#8a6a52",
              }}
            >
              {config.address || BRAND_LOGO.location || "Floral Portfolio"}
            </span>
          </span>
        </Link>

        <div
          className="items-center gap-8"
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
                fontWeight: 400,
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

          <button
            type="button"
            onClick={toggleLanguage}
            aria-label={language === "id" ? "Switch to English" : "Ganti ke Bahasa Indonesia"}
            style={{
              fontSize: "11px",
              fontWeight: 500,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#999",
              backgroundColor: "transparent",
              border: "1px solid rgba(0,0,0,0.12)",
              padding: "8px 12px",
              borderRadius: "6px",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#1a1a1a";
              e.currentTarget.style.color = "#1a1a1a";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(0,0,0,0.12)";
              e.currentTarget.style.color = "#999";
            }}
          >
            {language === "id" ? "🇮🇩 ID" : "🇬🇧 ENG"}
          </button>

          <a
            href={`https://wa.me/${(config.whatsappNumber || "6285880021020").replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Halo ${config.businessName}! 🌸\nSaya ingin melihat katalog produk Anda.`)}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#fff",
              backgroundColor: "#25D366",
              textDecoration: "none",
              padding: "10px 16px",
              borderRadius: "999px",
              boxShadow: "0 8px 20px rgba(37,211,102,0.2)",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            💬 {language === "id" ? "Pesan Sekarang" : "Order Now"}
          </a>
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
              backgroundColor: "rgba(249, 249, 247, 0.98)",
              backdropFilter: "blur(20px)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
            }}
          >
            {config.navLinks.map((link, i) => (
              <motion.div
                key={link.to}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ delay: i * 0.08 + 0.1 }}
              >
                <Link
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  aria-current={location.pathname === link.to ? "page" : undefined}
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "32px",
                    fontWeight: 300,
                    letterSpacing: "-0.02em",
                    color: location.pathname === link.to ? "#1a1a1a" : "#999",
                    textDecoration: "none",
                    transition: "color 0.3s ease",
                    display: "block",
                    padding: "8px 0",
                  }}
                >
                  {getNavLabel(link.to)}
                </Link>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: config.navLinks.length * 0.08 + 0.15 }}
              style={{ marginTop: "24px" }}
            >
              <button
                type="button"
                onClick={toggleLanguage}
                aria-label={language === "id" ? "Switch to English" : "Ganti ke Bahasa Indonesia"}
                style={{
                  fontSize: "11px",
                  fontWeight: 500,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#1a1a1a",
                  backgroundColor: "rgba(0,0,0,0.04)",
                  border: "1px solid rgba(0,0,0,0.12)",
                  padding: "10px 16px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.04)";
                }}
              >
                {language === "id" ? "🇮🇩 Bahasa Indonesia" : "🇬🇧 English"}
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: config.navLinks.length * 0.08 + 0.25 }}
              style={{ marginTop: "8px" }}
            >
              <a
                href={`https://wa.me/${(config.whatsappNumber || "6285880021020").replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Halo ${config.businessName}! 🌸\nSaya ingin melihat katalog produk Anda.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenuOpen(false)}
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#fff",
                  backgroundColor: "#25D366",
                  textDecoration: "none",
                  padding: "14px 32px",
                  borderRadius: "999px",
                  boxShadow: "0 8px 24px rgba(37,211,102,0.25)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                💬 {language === "id" ? "Pesan Sekarang" : "Order Now"}
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              style={{ marginTop: "32px", textAlign: "center" }}
            >
              <p
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "9px",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#bbb",
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
