import { useParams, Link } from "react-router";
import { motion } from "motion/react";
import { products, categories, getWhatsAppOrderLink, businessInfo } from "../data";
import { PageTransition } from "../components/page-transition";
import { Footer } from "../components/footer";
import AnimatedPetals from "../components/animated-petals";
import { useLanguage } from "../language";

const mono = {
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: "9px" as const,
  letterSpacing: "0.12em",
  textTransform: "uppercase" as const,
  color: "#999",
};

const serif = {
  fontFamily: "'Cormorant Garamond', serif",
};

export function CaseStudy() {
  const { slug } = useParams();
  const catKey = slug;
  const category = categories.find((c) => c.key === catKey);
  const catProducts = products.filter((p) => p.category === catKey);
  const [language] = useLanguage();

  if (!category || catProducts.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center flex-col gap-4">
        <p style={{ ...mono, color: "#1a1a1a" }}>
          {language === "id" ? "Kategori tidak ditemukan" : "Category not found"}
        </p>
        <Link to="/" style={{ ...mono, color: "#1a1a1a" }}>
          &larr; {language === "id" ? "Kembali ke Katalog" : "Back to Catalog"}
        </Link>
      </div>
    );
  }

  return (
    <PageTransition>
      <div style={{ padding: "0 clamp(24px, 8vw, 120px)" }}>
        {/* Header */}
        <div style={{ paddingTop: "160px", paddingBottom: "60px" }}>
          <Link to="/" style={{ ...mono, textDecoration: "none", display: "inline-block", marginBottom: "20px" }}>
            &larr; {language === "id" ? "Kembali ke Katalog" : "Back to Catalog"}
          </Link>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            style={mono}
          >
            {category.emoji} {category.label}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            style={{
              ...serif,
              fontSize: "clamp(36px, 6vw, 72px)",
              fontWeight: 300,
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              color: "#1a1a1a",
              marginTop: "12px",
            }}
          >
            {category.label}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "15px",
              lineHeight: 1.8,
              color: "#666",
              marginTop: "20px",
              maxWidth: "560px",
            }}
          >
            {category.description}
          </motion.p>
          {category.noted && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              style={{
                marginTop: "20px",
                padding: "16px 20px",
                backgroundColor: "rgba(0,0,0,0.02)",
                borderLeft: "3px solid #1a1a1a",
                maxWidth: "500px",
              }}
            >
              <p style={{ ...mono, fontSize: "9px", lineHeight: 1.8, color: "#888" }}>
                {language === "id" ? "📝 Noted: " : "📝 Note: "}{category.noted}
              </p>
            </motion.div>
          )}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 gap-5 pb-20 md:grid-cols-3 lg:grid-cols-4">
          {catProducts.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.05 }}
            >
              <CategoryProductCard product={product} />
            </motion.div>
          ))}
        </div>

        {/* Other Categories */}
        <div
          className="border-t"
          style={{
            borderColor: "rgba(0,0,0,0.08)",
            paddingTop: "60px",
            paddingBottom: "80px",
          }}
        >
          <p style={mono}>{language === "id" ? "Kategori Lainnya" : "Other Categories"}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            {categories
              .filter((c) => c.key !== catKey)
              .map((c) => (
                <Link
                  key={c.key}
                  to={`/work/${c.key}`}
                  style={{
                    ...mono,
                    fontSize: "9px",
                    padding: "8px 16px",
                    border: "1px solid rgba(0,0,0,0.1)",
                    textDecoration: "none",
                    transition: "all 0.3s ease",
                  }}
                  className="case-study-link-hover"
                >
                  {c.emoji} {c.label}
                </Link>
              ))}
          </div>
        </div>
      </div>
      <div style={{ marginTop: 48 }}>
        <AnimatedPetals />
      </div>
      <Footer />
    </PageTransition>
  );
}

function CategoryProductCard({ product }: { product: typeof products[0] }) {
  const [language] = useLanguage();
  return (
    <div className="group" style={{ cursor: "pointer" }}>
      <div
        style={{
          overflow: "hidden",
          boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
          transition: "all 0.5s ease",
          position: "relative",
        }}
        className="group-hover:shadow-lg group-hover:-translate-y-1"
      >
        {product.tag && (
          <div
            style={{
              position: "absolute",
              top: "10px",
              left: "10px",
              zIndex: 10,
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "8px",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              padding: "3px 8px",
              backgroundColor: "#1a1a1a",
              color: "#fff",
            }}
          >
            {product.tag}
          </div>
        )}
        <div style={{ aspectRatio: "3/4", overflow: "hidden", backgroundColor: "#eee" }}>
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full transition-transform duration-[1.2s] ease-out group-hover:scale-105"
            style={{ objectFit: "cover" }}
            onError={(e) => {
              e.currentTarget.src = `https://placehold.co/800x1000/ebebe9/1a1a1a?text=${encodeURIComponent(product.name)}`;
            }}
          />
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "14px",
            background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
            opacity: 0,
            transition: "opacity 0.4s ease",
            display: "flex",
            justifyContent: "center",
          }}
          className="group-hover:opacity-100"
        >
          <a
            href={getWhatsAppOrderLink(product.name, product.priceLabel)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "9px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              padding: "8px 16px",
              backgroundColor: "#25D366",
              color: "#fff",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            {language === "id" ? "Pesan" : "Order"}
          </a>
        </div>
      </div>

      <div className="mt-3">
        <span style={{ ...mono, fontSize: "8px", color: "#bbb" }}>
          {product.variant || product.category}
        </span>
        <h3
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(14px, 1.5vw, 20px)",
            fontWeight: 400,
            color: "#1a1a1a",
            marginTop: "2px",
            letterSpacing: "-0.02em",
            lineHeight: 1.3,
          }}
        >
          {product.name}
        </h3>
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "13px",
            fontWeight: 600,
            color: "#1a1a1a",
            marginTop: "4px",
          }}
        >
          {product.priceLabel}
        </p>
        {product.description && (
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "10px",
              color: "#999",
              marginTop: "4px",
              lineHeight: 1.5,
            }}
          >
            {product.description}
          </p>
        )}
      </div>
    </div>
  );
}
