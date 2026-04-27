import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

export function CustomCursor() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      setVisible(true);
    };
    const leave = () => setVisible(false);

    const over = () => setHovering(true);
    const out = () => setHovering(false);

    window.addEventListener("mousemove", move);
    document.addEventListener("mouseleave", leave);

    const observe = () => {
      document.querySelectorAll("[data-cursor='view']").forEach((el) => {
        el.addEventListener("mouseenter", over);
        el.addEventListener("mouseleave", out);
      });
    };

    observe();
    const observer = new MutationObserver(observe);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseleave", leave);
      observer.disconnect();
    };
  }, []);

  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-0 z-[999999] mix-blend-difference"
      animate={{
        x: pos.x - (hovering ? 36 : 5),
        y: pos.y - (hovering ? 36 : 5),
        width: hovering ? 72 : 10,
        height: hovering ? 72 : 10,
      }}
      transition={{ type: "spring", stiffness: 500, damping: 30, mass: 0.5 }}
      style={{ display: visible ? "flex" : "none" }}
    >
      <div
        className="flex h-full w-full items-center justify-center rounded-full bg-white"
      >
        <AnimatePresence>
          {hovering && (
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="text-black"
              style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "9px", letterSpacing: "0.1em", textTransform: "uppercase" }}
            >
              View
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
