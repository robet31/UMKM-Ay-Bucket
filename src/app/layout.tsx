import { Outlet, useLocation } from "react-router";
import { useEffect } from "react";
import { AnimatePresence } from "motion/react";
import { Nav } from "./components/nav";
import { CustomCursor } from "./components/custom-cursor";
import { GrainOverlay } from "./components/grain-overlay";
import { WhatsAppFloat } from "./components/whatsapp-float";

export function Root() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [location.pathname]);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#F9F9F7",
        cursor: "none",
      }}
    >
      <CustomCursor />
      <GrainOverlay />
      <Nav />
      <AnimatePresence mode="wait">
        <Outlet key={location.pathname} />
      </AnimatePresence>
      <WhatsAppFloat />
    </div>
  );
}
