import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Show button when page is scrolled down
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, y: 40, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.8 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          onClick={scrollToTop}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          title="Kembali ke atas"
          aria-label="Scroll ke atas"
          style={{
            position: "fixed",
            bottom: "40px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 999,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "none",
            background: "transparent",
            padding: 0,
          }}
        >
          {/* Glass container */}
          <motion.div
            animate={
              isHovered
                ? { y: -6, boxShadow: "0 16px 48px rgba(0, 0, 0, 0.22)" }
                : { y: 0, boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)" }
            }
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "16px",
              backgroundColor: "rgba(255, 255, 255, 0.92)",
              border: "1px solid rgba(0, 0, 0, 0.06)",
              backdropFilter: "blur(12px)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Subtle shimmer effect on hover */}
            <motion.div
              aria-hidden
              animate={
                isHovered
                  ? { x: ["100%", "-100%"], opacity: [0, 0.4, 0] }
                  : { x: "100%", opacity: 0 }
              }
              transition={
                isHovered
                  ? { duration: 0.8, ease: "easeInOut" }
                  : { duration: 0 }
              }
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.7) 50%, transparent 100%)",
                pointerEvents: "none",
              }}
            />

            {/* Mouse shape */}
            <div
              style={{
                width: "18px",
                height: "28px",
                border: "2px solid #1a1a1a",
                borderRadius: "9px",
                position: "relative",
                display: "flex",
                justifyContent: "center",
              }}
            >
              {/* Scroll wheel — animated upward to indicate scroll-to-top */}
              <motion.div
                animate={{
                  y: [8, 2, 8],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{
                  width: "3px",
                  height: "6px",
                  backgroundColor: "#1a1a1a",
                  borderRadius: "1.5px",
                  marginTop: "4px",
                }}
              />
            </div>
          </motion.div>

          {/* Label that fades in on hover */}
          <AnimatePresence>
            {isHovered && (
              <motion.span
                initial={{ opacity: 0, x: -8, width: 0 }}
                animate={{ opacity: 1, x: 0, width: "auto" }}
                exit={{ opacity: 0, x: -8, width: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  position: "absolute",
                  top: "-34px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "9px",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#1a1a1a",
                  whiteSpace: "nowrap",
                  backgroundColor: "rgba(255,255,255,0.95)",
                  padding: "5px 10px",
                  borderRadius: "8px",
                  border: "1px solid rgba(0,0,0,0.06)",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                  pointerEvents: "none",
                }}
              >
                ↑ Ke Atas
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
