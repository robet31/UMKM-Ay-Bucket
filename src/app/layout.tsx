import { Outlet, useLocation } from "react-router";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Nav } from "./components/nav";
import { CustomCursor } from "./components/custom-cursor";
import { GrainOverlay } from "./components/grain-overlay";
import { WhatsAppFloat } from "./components/whatsapp-float";
import { ScrollToTop } from "./components/scroll-to-top";

export function Root() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);

    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "instant" as ScrollBehavior });
    window.requestAnimationFrame(() => {
      document.getElementById("main-content")?.focus();
    });
  }, [location.pathname, prefersReducedMotion]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#FFF0F3",
        cursor: prefersReducedMotion ? "auto" : "none",
        backgroundImage:
          "radial-gradient(#f5d5dc 1px, transparent 1px)",
        backgroundSize: "40px 40px",
        backgroundPosition: "0 0, 20px 20px",
        transition: "background 0.5s ease",
      }}
    >
      <a
        href="#main-content"
        className="skip-link"
      >
        Skip to content
      </a>

      {!prefersReducedMotion && (
        <>
          {/* Subtle ambient glow */}
          <motion.div
            className="ambient-glow"
            animate={{
              x: [0, 50, 0],
              y: [0, 30, 0],
              scale: [1, 1.05, 1],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            style={{
              position: "fixed",
              top: "-30%",
              right: "-10%",
              width: "600px",
              height: "600px",
              background:
                "radial-gradient(circle, rgba(255, 182, 193, 0.18) 0%, transparent 60%)",
              pointerEvents: "none",
              zIndex: 0,
            }}
          />

          <motion.div
            className="ambient-glow-2"
            animate={{
              x: [0, -30, 0],
              y: [0, -40, 0],
              scale: [1, 1.02, 1],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
            style={{
              position: "fixed",
              bottom: "-20%",
              left: "-10%",
              width: "500px",
              height: "500px",
              background:
                "radial-gradient(circle, rgba(255, 192, 203, 0.20) 0%, transparent 60%)",
              pointerEvents: "none",
              zIndex: 0,
            }}
          />
        </>
      )}

      <CustomCursor />
      <GrainOverlay opacity={scrolled ? 0.025 : 0.035} />
      <Nav scrolled={scrolled} />
      <main id="main-content" tabIndex={-1} style={{ position: "relative", zIndex: 1 }}>
        <AnimatePresence mode="wait">
          <Outlet key={location.pathname} />
        </AnimatePresence>
      </main>
      <ScrollToTop />
    </div>
  );
}
