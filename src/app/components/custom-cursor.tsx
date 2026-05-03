import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

export function CustomCursor() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const pointerQuery = window.matchMedia("(pointer: fine) and (hover: hover)");
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const updateEnabled = () => {
      setEnabled(pointerQuery.matches && !motionQuery.matches);
    };

    updateEnabled();
    pointerQuery.addEventListener("change", updateEnabled);
    motionQuery.addEventListener("change", updateEnabled);

    return () => {
      pointerQuery.removeEventListener("change", updateEnabled);
      motionQuery.removeEventListener("change", updateEnabled);
    };
  }, []);

  useEffect(() => {
    if (!enabled) {
      setVisible(false);
      setHovering(false);
      return;
    }

    const updateHoverState = (target: EventTarget | null) => {
      const element = target instanceof Element ? target.closest("[data-cursor='view']") : null;
      setHovering(Boolean(element));
    };

    const move = (e: PointerEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      setVisible(true);
      updateHoverState(e.target);
    };

    const leave = () => {
      setVisible(false);
      setHovering(false);
    };

    const over = (e: PointerEvent) => updateHoverState(e.target);
    const out = (e: PointerEvent) => updateHoverState(e.relatedTarget);

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    document.addEventListener("pointerover", over);
    document.addEventListener("pointerout", out);

    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
      document.removeEventListener("pointerover", over);
      document.removeEventListener("pointerout", out);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[999999] mix-blend-difference"
      animate={{
        x: pos.x - (hovering ? 36 : 5),
        y: pos.y - (hovering ? 36 : 5),
        width: hovering ? 72 : 10,
        height: hovering ? 72 : 10,
      }}
      transition={{ type: "spring", stiffness: 800, damping: 20, mass: 0.3 }}
      style={{ display: visible ? "flex" : "none" }}
    >
      <div className="flex h-full w-full items-center justify-center rounded-full bg-white">
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
