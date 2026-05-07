import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { getWhatsAppLink, businessInfo } from "../data";
import { useLanguage } from "../language";

export function WhatsAppFloat() {
  const [showTooltip, setShowTooltip] = useState(false);
  const [pulse, setPulse] = useState(true);
  const [language] = useLanguage();
  const defaultMessage = language === "id" ? "Halo Ay Bucket! Saya mau pesan bunga 🌸" : "Hello Ay Bucket! I'd like to order flowers 🌸";

  return (
    <div
      style={{
        position: "fixed",
        bottom: "clamp(16px, 4vw, 32px)",
        right: "clamp(16px, 4vw, 32px)",
        zIndex: 9000,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: "12px",
      }}
    >
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            aria-live="polite"
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{
              backgroundColor: "#fff",
              padding: "16px 20px",
              boxShadow: "0 8px 40px rgba(0,0,0,0.12)",
              maxWidth: "260px",
              borderLeft: "3px solid #25D366",
            }}
          >
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "13px",
                fontWeight: 600,
                color: "#1a1a1a",
                marginBottom: "4px",
              }}
            >
              {language === "id" ? "Halo! 👋" : "Hello! 👋"}
            </p>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "12px",
                color: "#666",
                lineHeight: 1.6,
                marginBottom: "12px",
              }}
            >
              {language === "id" ? "Ada yang bisa kami bantu? Chat langsung via WhatsApp untuk pemesanan bunga." : "How can we help? Chat directly via WhatsApp to place your flower order."}
            </p>
            <a
              href={getWhatsAppLink(defaultMessage)}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "10px",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                padding: "8px 16px",
                backgroundColor: "#25D366",
                color: "#fff",
                textDecoration: "none",
                display: "inline-block",
                transition: "background-color 0.3s ease",
              }}
              className="whatsapp-btn-hover"
            >
              {language === "id" ? "Chat Sekarang" : "Chat Now"}
            </a>
            <p
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "9px",
                color: "#bbb",
                marginTop: "8px",
              }}
            >
              📞 {businessInfo.whatsappDisplay}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.a
        href={getWhatsAppLink(defaultMessage)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={language === "id" ? "Chat dengan Ay Bucket di WhatsApp" : "Chat with Ay Bucket on WhatsApp"}
        title={language === "id" ? "Chat dengan Ay Bucket di WhatsApp" : "Chat with Ay Bucket on WhatsApp"}
        onMouseEnter={() => { setShowTooltip(true); setPulse(false); }}
        onMouseLeave={() => setShowTooltip(false)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        style={{
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          backgroundColor: "#25D366",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 6px 24px rgba(37, 211, 102, 0.4)",
          cursor: "pointer",
          textDecoration: "none",
          position: "relative",
        }}
      >
        {pulse && (
          <motion.div
            aria-hidden="true"
            animate={{
              scale: [1, 1.6, 1.6],
              opacity: [0.6, 0, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut",
            }}
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              border: "2px solid #25D366",
            }}
          />
        )}
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="#fff"
          aria-hidden="true"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </motion.a>
    </div>
  );
}
