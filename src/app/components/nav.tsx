import { Link, useLocation } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { getSiteConfig } from "../data";

export function Nav() {
  const location = useLocation();
  const [, setTick] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setTick((t) => t + 1);
    window.addEventListener("siteConfigChanged", handler);
    return () => window.removeEventListener("siteConfigChanged", handler);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const config = getSiteConfig();

  return (
    <>
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="fixed top-0 right-0 left-0 z-50 flex items-center justify-between"
        style={{
          padding: "20px clamp(16px, 6vw, 120px)",
          fontFamily: "'Inter', sans-serif",
          backdropFilter: "blur(12px)",
          backgroundColor: "rgba(249, 249, 247, 0.85)",
        }}
      >
        <Link
          to="/"
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
          <span style={{ fontSize: "clamp(20px, 3vw, 24px)" }}>🌸</span>
          {config.businessName}
        </Link>

        {/* Desktop nav links */}
        <div
          className="items-center gap-8"
          style={{ display: "none" }}
          id="desktop-nav"
        >
          {config.navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="relative"
              style={{
                fontSize: "11px",
                fontWeight: 400,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: location.pathname === link.to ? "#1a1a1a" : "#999",
                transition: "color 0.4s ease",
                textDecoration: "none",
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Hamburger button (mobile) */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          id="mobile-menu-btn"
          aria-label="Menu"
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

      {/* Mobile fullscreen menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
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
                  {link.label}
                </Link>
              </motion.div>
            ))}

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

      {/* Responsive CSS */}
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
