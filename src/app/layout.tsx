import { Outlet, useLocation } from "react-router";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Nav } from "./components/nav";
import { CustomCursor } from "./components/custom-cursor";
import { GrainOverlay } from "./components/grain-overlay";
import { WhatsAppFloat } from "./components/whatsapp-float";

export function Root() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [location.pathname]);

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
        backgroundColor: "#F9F9F7",
        cursor: "none",
        backgroundImage:
          "radial-gradient(#e8e6e1 1px, transparent 1px)",
        backgroundSize: "40px 40px",
        backgroundPosition: "0 0, 20px 20px",
        transition: "background 0.5s ease",
      }}
    >
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
            "radial-gradient(circle, rgba(168, 182, 209, 0.12) 0%, transparent 60%)",
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
            "radial-gradient(circle, rgba(226, 216, 240, 0.15) 0%, transparent 60%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <CustomCursor />
      <GrainOverlay opacity={scrolled ? 0.025 : 0.035} />
      <Nav scrolled={scrolled} />
      <AnimatePresence mode="wait">
        <Outlet key={location.pathname} />
      </AnimatePresence>
      <WhatsAppFloat />
    </div>
  );
}
