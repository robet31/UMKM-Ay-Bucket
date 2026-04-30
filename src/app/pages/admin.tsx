import { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  getSiteConfig,
  saveSiteConfig,
  resetSiteConfig,
  getProducts,
  saveProducts,
  resetProducts,
  defaultProducts,
  categories,
  getVideos,
  saveVideos,
  resetVideos,
  defaultVideos,
  detectVideoSource,
  type SiteConfig,
  type Product,
  type VideoItem,
  type VideoSource,
  type VideoOrientation,
} from "../data";

const mono = {
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: "10px" as const,
  letterSpacing: "0.08em",
  textTransform: "uppercase" as const,
};

const inputStyle: React.CSSProperties = {
  fontFamily: "'Inter', sans-serif",
  fontSize: "14px",
  padding: "10px 14px",
  border: "1px solid rgba(0,0,0,0.12)",
  backgroundColor: "#fff",
  color: "#1a1a1a",
  width: "100%",
  outline: "none",
  transition: "border-color 0.3s ease",
};

const labelStyle: React.CSSProperties = {
  ...mono,
  fontSize: "9px",
  color: "#999",
  marginBottom: "6px",
  display: "block",
};

const btnStyle: React.CSSProperties = {
  ...mono,
  fontSize: "10px",
  padding: "10px 20px",
  border: "1px solid #1a1a1a",
  backgroundColor: "#1a1a1a",
  color: "#fff",
  cursor: "pointer",
  transition: "all 0.3s ease",
};

const btnOutlineStyle: React.CSSProperties = {
  ...btnStyle,
  backgroundColor: "transparent",
  color: "#1a1a1a",
};

const sectionStyle: React.CSSProperties = {
  borderBottom: "1px solid rgba(0,0,0,0.08)",
  paddingBottom: "40px",
  marginBottom: "40px",
};

type Tab = "general" | "products" | "navbar" | "footer" | "hero" | "videos";

export function Admin() {
  const [config, setConfig] = useState<SiteConfig>(getSiteConfig());
  const [products, setProductsList] = useState<Product[]>(getProducts());
  const [videos, setVideosList] = useState<VideoItem[]>(getVideos());
  const [activeTab, setActiveTab] = useState<Tab>("general");
  const [saved, setSaved] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingVideo, setEditingVideo] = useState<VideoItem | null>(null);
  const [authed, setAuthed] = useState<boolean>(sessionStorage.getItem("elbouquet_admin_authed") === "1");
  const [passwordInput, setPasswordInput] = useState("");

  const showSaved = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleSaveConfig = () => {
    saveSiteConfig(config);
    showSaved();
  };

  const handleSaveProducts = () => {
    saveProducts(products);
    showSaved();
  };

  const handleSaveVideos = () => {
    saveVideos(videos);
    showSaved();
  };

  const handleResetAll = () => {
    if (confirm("Reset semua pengaturan ke default?")) {
      resetSiteConfig();
      resetProducts();
      resetVideos();
      setConfig(getSiteConfig());
      setProductsList(defaultProducts);
      setVideosList(defaultVideos);
      showSaved();
    }
  };

  // add noindex meta to avoid indexing admin page
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex,nofollow";
    document.head.appendChild(meta);
    return () => {
      try { document.head.removeChild(meta); } catch {}
    };
  }, []);

  const handleDeleteProduct = (id: string) => {
    const updated = products.filter((p) => p.id !== id);
    setProductsList(updated);
    saveProducts(updated);
  };

  const handleUpdateProduct = (updated: Product) => {
    const newList = products.map((p) => (p.id === updated.id ? updated : p));
    setProductsList(newList);
    setEditingProduct(null);
  };

  const handleAddProduct = () => {
    const newProduct: Product = {
      id: `custom-${Date.now()}`,
      name: "Produk Baru",
      category: "bouquet-classic",
      price: 100000,
      priceLabel: "Rp 100.000",
      image: "https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=600&q=80",
    };
    setProductsList([...products, newProduct]);
    setEditingProduct(newProduct);
  };

  const handleAddVideo = () => {
    const newVideo: VideoItem = {
      id: `vid-${Date.now()}`,
      url: "",
      source: "youtube",
      orientation: "horizontal",
      caption: "Video baru",
      featured: false,
    };
    setVideosList([...videos, newVideo]);
    setEditingVideo(newVideo);
  };

  const handleDeleteVideo = (id: string) => {
    const updated = videos.filter((v) => v.id !== id);
    setVideosList(updated);
    saveVideos(updated);
  };

  const handleUpdateVideo = (updated: VideoItem) => {
    const newList = videos.map((v) => (v.id === updated.id ? updated : v));
    setVideosList(newList);
    setEditingVideo(null);
  };

  const tabs: { key: Tab; label: string }[] = [
    { key: "general", label: "Umum" },
    { key: "hero", label: "Hero" },
    { key: "navbar", label: "Navbar" },
    { key: "products", label: "Produk" },
    { key: "videos", label: "Video" },
    { key: "footer", label: "Footer" },
  ];

  if (!authed) {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#F9F9F7",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
        }}
      >
        <div style={{position: 'fixed', inset:0, zIndex:20000, backgroundColor: 'rgba(0,0,0,0.6)', display:'flex', alignItems:'center', justifyContent:'center'}}>
          <div style={{background:'#fff', padding:24, width:360, borderRadius:8}}>
            <h3 style={{fontFamily: "'Cormorant Garamond', serif", marginBottom:12}}>Admin Login</h3>
            <p style={{fontFamily:"'Inter',sans-serif", fontSize:12, color:'#666'}}>Masukkan password admin untuk melanjutkan.</p>
            <input aria-label="Password admin" value={passwordInput} onChange={(e)=>setPasswordInput(e.target.value)} type="password" style={{...inputStyle, marginTop:12}} />
            <div style={{display:'flex', gap:8, marginTop:12}}>
              <button onClick={()=>{
                const cfg = getSiteConfig();
                const pass = cfg.adminPassword || 'elbouquet';
                if(passwordInput === pass){ sessionStorage.setItem('elbouquet_admin_authed','1'); setAuthed(true); }
                else alert('Password salah');
              }} style={btnStyle}>Masuk</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#F9F9F7",
        padding: "0 clamp(24px, 6vw, 80px)",
      }}
    >
      {/* Header */}
      <div
        style={{
          paddingTop: "40px",
          paddingBottom: "30px",
          borderBottom: "1px solid rgba(0,0,0,0.08)",
          marginBottom: "40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div>
          <p style={{ ...mono, fontSize: "9px", color: "#bbb", marginBottom: "4px" }}>
            Admin Panel
          </p>
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "28px",
              fontWeight: 300,
              color: "#1a1a1a",
              letterSpacing: "-0.02em",
            }}
          >
            🛠️ Pengaturan Website
          </h1>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <Link
            to="/"
            style={{
              ...btnOutlineStyle,
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            ← Lihat Website
          </Link>
          <button onClick={handleResetAll} style={{ ...btnOutlineStyle, borderColor: "#d44", color: "#d44" }}>
            Reset Semua
          </button>
        </div>
      </div>

      {/* Saved Toast */}
      <AnimatePresence>
        {saved && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              position: "fixed",
              top: "24px",
              right: "24px",
              zIndex: 10000,
              backgroundColor: "#1a1a1a",
              color: "#fff",
              padding: "12px 24px",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "11px",
              letterSpacing: "0.05em",
            }}
          >
            ✅ Tersimpan!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2" style={{ marginBottom: "40px" }}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              ...mono,
              fontSize: "10px",
              padding: "8px 16px",
              border: "1px solid",
              borderColor: activeTab === tab.key ? "#1a1a1a" : "rgba(0,0,0,0.12)",
              backgroundColor: activeTab === tab.key ? "#1a1a1a" : "transparent",
              color: activeTab === tab.key ? "#fff" : "#666",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={{ maxWidth: "700px", paddingBottom: "80px" }}>
        {activeTab === "general" && (
          <div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "24px", fontWeight: 400, color: "#1a1a1a", marginBottom: "30px" }}>
              Pengaturan Umum
            </h2>
            <div style={sectionStyle}>
              <FieldInput label="Nama Bisnis" value={config.businessName} onChange={(v) => setConfig({ ...config, businessName: v })} />
              <FieldInput label="Tagline" value={config.tagline} onChange={(v) => setConfig({ ...config, tagline: v })} />
              <FieldInput label="Tahun" value={config.year} onChange={(v) => setConfig({ ...config, year: v })} />
              <FieldInput label="Alamat" value={config.address} onChange={(v) => setConfig({ ...config, address: v })} />
            </div>
            <div style={sectionStyle}>
              <FieldInput label="Nomor WhatsApp (format: 628xxx)" value={config.whatsappNumber} onChange={(v) => setConfig({ ...config, whatsappNumber: v })} />
              <FieldInput label="Nomor WhatsApp Display (format: 08xxx)" value={config.whatsappDisplay} onChange={(v) => setConfig({ ...config, whatsappDisplay: v })} />
              <FieldInput label="Instagram" value={config.instagram} onChange={(v) => setConfig({ ...config, instagram: v })} />
              <FieldInput label="TikTok" value={config.tiktok} onChange={(v) => setConfig({ ...config, tiktok: v })} />
            </div>
            <button onClick={handleSaveConfig} style={btnStyle}>Simpan Pengaturan</button>
          </div>
        )}

        {activeTab === "hero" && (
          <div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "24px", fontWeight: 400, color: "#1a1a1a", marginBottom: "30px" }}>
              Hero Section
            </h2>
            <div style={sectionStyle}>
              <FieldTextarea label="Judul Hero (gunakan Enter untuk baris baru)" value={config.heroTitle} onChange={(v) => setConfig({ ...config, heroTitle: v })} />
              <FieldTextarea label="Subtitle Hero" value={config.heroSubtitle} onChange={(v) => setConfig({ ...config, heroSubtitle: v })} />
            </div>
            <button onClick={handleSaveConfig} style={btnStyle}>Simpan Hero</button>
          </div>
        )}

        {activeTab === "navbar" && (
          <div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "24px", fontWeight: 400, color: "#1a1a1a", marginBottom: "30px" }}>
              Navbar
            </h2>
            <div style={sectionStyle}>
              <FieldInput label="Nama Brand (di navbar)" value={config.businessName} onChange={(v) => setConfig({ ...config, businessName: v })} />
              <p style={labelStyle}>Link Navigasi</p>
              {config.navLinks.map((link, i) => (
                <div key={i} className="flex gap-3 mb-3">
                  <div style={{ flex: 1 }}>
                    <input
                      style={inputStyle}
                      value={link.label}
                      onChange={(e) => {
                        const updated = [...config.navLinks];
                        updated[i] = { ...updated[i], label: e.target.value };
                        setConfig({ ...config, navLinks: updated });
                      }}
                      placeholder="Label"
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <input
                      style={inputStyle}
                      value={link.to}
                      onChange={(e) => {
                        const updated = [...config.navLinks];
                        updated[i] = { ...updated[i], to: e.target.value };
                        setConfig({ ...config, navLinks: updated });
                      }}
                      placeholder="Path (e.g. /studio)"
                    />
                  </div>
                  <button
                    onClick={() => {
                      const updated = config.navLinks.filter((_, j) => j !== i);
                      setConfig({ ...config, navLinks: updated });
                    }}
                    style={{ ...btnOutlineStyle, borderColor: "#d44", color: "#d44", padding: "8px 12px" }}
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                onClick={() => setConfig({ ...config, navLinks: [...config.navLinks, { to: "/", label: "Baru" }] })}
                style={{ ...btnOutlineStyle, marginTop: "8px" }}
              >
                + Tambah Link
              </button>
            </div>
            <button onClick={handleSaveConfig} style={btnStyle}>Simpan Navbar</button>
          </div>
        )}

        {activeTab === "footer" && (
          <div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "24px", fontWeight: 400, color: "#1a1a1a", marginBottom: "30px" }}>
              Footer
            </h2>
            <div style={sectionStyle}>
              <FieldInput label="Nama Bisnis" value={config.businessName} onChange={(v) => setConfig({ ...config, businessName: v })} />
              <FieldInput label="Alamat" value={config.address} onChange={(v) => setConfig({ ...config, address: v })} />
              <FieldInput label="Instagram" value={config.instagram} onChange={(v) => setConfig({ ...config, instagram: v })} />
              <FieldInput label="TikTok" value={config.tiktok} onChange={(v) => setConfig({ ...config, tiktok: v })} />
              <FieldInput label="Nomor WhatsApp Display" value={config.whatsappDisplay} onChange={(v) => setConfig({ ...config, whatsappDisplay: v })} />
              <FieldTextarea label="Teks Tambahan Footer" value={config.footerText} onChange={(v) => setConfig({ ...config, footerText: v })} />
            </div>
            <div style={sectionStyle}>
              <p style={{ ...mono, fontSize: "10px", color: "#666", marginBottom: "8px" }}>
                🗺️ Google Maps
              </p>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", color: "#999", marginBottom: "12px", lineHeight: 1.6 }}>
                Cara mendapatkan URL: Buka Google Maps → cari lokasi toko → klik "Share" → "Embed a map" → copy URL dari src="..."
              </p>
              <FieldTextarea
                label="Google Maps Embed URL"
                value={config.mapsEmbedUrl}
                onChange={(v) => setConfig({ ...config, mapsEmbedUrl: v })}
              />
              {config.mapsEmbedUrl && (
                <div style={{ marginBottom: "16px" }}>
                  <p style={labelStyle}>Preview Maps</p>
                  <div style={{ overflow: "hidden", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}>
                    <iframe
                      src={config.mapsEmbedUrl}
                      width="100%"
                      height="200"
                      style={{ border: 0, display: "block", filter: "grayscale(20%)" }}
                      loading="lazy"
                      title="Maps Preview"
                    />
                  </div>
                </div>
              )}
            </div>
            <button onClick={handleSaveConfig} style={btnStyle}>Simpan Footer & Maps</button>
          </div>
        )}

        {activeTab === "products" && (
          <div>
            <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "24px", fontWeight: 400, color: "#1a1a1a" }}>
                Produk ({products.length})
              </h2>
              <div className="flex gap-2">
                <button onClick={handleAddProduct} style={btnStyle}>+ Tambah Produk</button>
                <button onClick={handleSaveProducts} style={{ ...btnStyle, backgroundColor: "#25D366", borderColor: "#25D366" }}>
                  💾 Simpan Semua
                </button>
              </div>
            </div>

            {/* Edit Modal */}
            <AnimatePresence>
              {editingProduct && (
                <ProductEditor
                  product={editingProduct}
                  onSave={(p) => {
                    handleUpdateProduct(p);
                    saveProducts(products.map((pr) => (pr.id === p.id ? p : pr)));
                    showSaved();
                  }}
                  onCancel={() => setEditingProduct(null)}
                />
              )}
            </AnimatePresence>

            {/* Product List */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {products.map((product) => (
                <div
                  key={product.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "12px 16px",
                    border: "1px solid rgba(0,0,0,0.06)",
                    backgroundColor: "#fff",
                    transition: "box-shadow 0.3s ease",
                  }}
                >
                  <img
                    src={product.image}
                    alt=""
                    style={{ width: "48px", height: "48px", objectFit: "cover", flexShrink: 0 }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "#1a1a1a",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {product.name}
                    </p>
                    <p style={{ ...mono, fontSize: "9px", color: "#999" }}>
                      {categories.find((c) => c.key === product.category)?.label || product.category} · {product.priceLabel}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingProduct(product)}
                      style={{ ...btnOutlineStyle, padding: "6px 12px", fontSize: "9px" }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      style={{ ...btnOutlineStyle, padding: "6px 12px", fontSize: "9px", borderColor: "#d44", color: "#d44" }}
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ====== VIDEOS TAB ====== */}
        {activeTab === "videos" && (
          <div>
            <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "24px", fontWeight: 400, color: "#1a1a1a" }}>
                🎬 Video & Konten ({videos.length})
              </h2>
              <div className="flex gap-2">
                <button onClick={handleAddVideo} style={btnStyle}>+ Tambah Video</button>
                <button onClick={handleSaveVideos} style={{ ...btnStyle, backgroundColor: "#25D366", borderColor: "#25D366" }}>
                  💾 Simpan Semua
                </button>
              </div>
            </div>

            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", color: "#999", marginBottom: "16px", lineHeight: 1.7 }}>
              Tambah video dari <strong>YouTube</strong>, <strong>Instagram</strong>, <strong>TikTok</strong>, atau upload <strong>file video</strong> langsung.
              Video bertanda ⭐ akan ditampilkan di homepage. Sisanya tampil di halaman Tentang Kami dan saat user klik &ldquo;Lihat Semua&rdquo;.
            </p>

            <p style={{ ...mono, fontSize: "9px", color: "#666", marginBottom: "16px" }}>
              ⭐ Featured: {videos.filter(v => v.featured).length} / {videos.length} video
            </p>

            {/* Edit Modal */}
            <AnimatePresence>
              {editingVideo && (
                <VideoEditor
                  video={editingVideo}
                  onSave={(v) => {
                    handleUpdateVideo(v);
                    saveVideos(videos.map((vid) => (vid.id === v.id ? v : vid)));
                    showSaved();
                  }}
                  onCancel={() => setEditingVideo(null)}
                />
              )}
            </AnimatePresence>

            {/* Video List */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {videos.map((video) => {
                const srcColor = video.source === "youtube" ? "#FF0000" : video.source === "instagram" ? "#E1306C" : video.source === "tiktok" ? "#000" : "#555";
                return (
                  <div
                    key={video.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "12px 16px",
                      border: video.featured ? "1px solid rgba(255,180,0,0.3)" : "1px solid rgba(0,0,0,0.06)",
                      backgroundColor: video.featured ? "rgba(255,245,220,0.5)" : "#fff",
                      transition: "all 0.3s ease",
                    }}
                  >
                    {/* Featured toggle */}
                    <button
                      onClick={() => {
                        const updated = videos.map((v) =>
                          v.id === video.id ? { ...v, featured: !v.featured } : v
                        );
                        setVideosList(updated);
                        saveVideos(updated);
                      }}
                      title={video.featured ? "Hapus dari unggulan" : "Tampilkan di homepage"}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "18px",
                        flexShrink: 0,
                        opacity: video.featured ? 1 : 0.3,
                        transition: "opacity 0.2s ease",
                      }}
                    >
                      ⭐
                    </button>
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        backgroundColor: "#111",
                        flexShrink: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="rgba(255,255,255,0.6)">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: "13px",
                          fontWeight: 600,
                          color: "#1a1a1a",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {video.caption || "(Tanpa caption)"}
                      </p>
                      <div className="flex items-center gap-2" style={{ marginTop: "2px" }}>
                        <span style={{ ...mono, fontSize: "8px", padding: "1px 6px", backgroundColor: srcColor, color: "#fff" }}>
                          {video.source}
                        </span>
                        <span style={{ ...mono, fontSize: "8px", color: "#bbb" }}>
                          {video.orientation}
                        </span>
                        {video.featured && (
                          <span style={{ ...mono, fontSize: "7px", color: "#b8860b" }}>
                            homepage
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingVideo(video)}
                        style={{ ...btnOutlineStyle, padding: "6px 12px", fontSize: "9px" }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteVideo(video.id)}
                        style={{ ...btnOutlineStyle, padding: "6px 12px", fontSize: "9px", borderColor: "#d44", color: "#d44" }}
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ---- Sub-components ----

function FieldInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <label style={labelStyle}>{label}</label>
      <input
        style={inputStyle}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={(e) => { e.target.style.borderColor = "#1a1a1a"; }}
        onBlur={(e) => { e.target.style.borderColor = "rgba(0,0,0,0.12)"; }}
      />
    </div>
  );
}

function FieldTextarea({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <label style={labelStyle}>{label}</label>
      <textarea
        style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={(e) => { (e.target as HTMLTextAreaElement).style.borderColor = "#1a1a1a"; }}
        onBlur={(e) => { (e.target as HTMLTextAreaElement).style.borderColor = "rgba(0,0,0,0.12)"; }}
      />
    </div>
  );
}

function ProductEditor({ product, onSave, onCancel }: { product: Product; onSave: (p: Product) => void; onCancel: () => void }) {
  // support multiple images per product
  const initial: Product = {
    ...product,
    images: (product as any).images || (product.image ? [product.image] : []),
  };
  const [form, setForm] = useState<Product>(initial);
  const fileRef = useRef<HTMLInputElement>(null);
  const urlRef = useRef<HTMLInputElement>(null);

  const updatePrice = (val: string) => {
    const num = parseInt(val.replace(/\D/g, "")) || 0;
    setForm({ ...form, price: num, priceLabel: `Rp ${num.toLocaleString("id-ID")}` });
  };

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const max = 5 * 1024 * 1024;
    const readers: Promise<string>[] = [];
    Array.from(files).forEach((file) => {
      if (file.size > max) return;
      readers.push(new Promise((res) => {
        const r = new FileReader();
        r.onloadend = () => res(r.result as string);
        r.readAsDataURL(file);
      }));
    });
    Promise.all(readers).then((dataUrls) => {
      setForm({ ...form, images: [...(form.images || []), ...dataUrls] });
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => handleFiles(e.target.files);

  const addImageUrl = (url: string) => {
    if (!url) return;
    setForm({ ...form, images: [...(form.images || []), url] });
    if (urlRef.current) urlRef.current.value = "";
  };

  const removeImageAt = (idx: number) => {
    const imgs = [...(form.images || [])];
    imgs.splice(idx, 1);
    setForm({ ...form, images: imgs });
  };

  const setPrimary = (idx: number) => {
    const imgs = [...(form.images || [])];
    const primary = imgs.splice(idx, 1)[0];
    imgs.unshift(primary);
    setForm({ ...form, images: imgs });
  };

  useEffect(() => {
    // ensure priceLabel consistent
    if (form.price && !form.priceLabel) setForm({ ...form, priceLabel: `Rp ${form.price.toLocaleString('id-ID')}` });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10000,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "#F9F9F7",
          padding: "32px",
          maxWidth: "680px",
          width: "100%",
          maxHeight: "80vh",
          overflow: "auto",
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
        }}
      >
        <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "22px", fontWeight: 400, color: "#1a1a1a", marginBottom: "24px" }}>
          Edit Produk
        </h3>
        <FieldInput label="Nama Produk" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
        <div style={{ marginBottom: "16px" }}>
          <label style={labelStyle}>Kategori</label>
          <select
            style={inputStyle}
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value as any })}
          >
            {categories.map((cat) => (
              <option key={cat.key} value={cat.key}>
                {cat.emoji} {cat.label}
              </option>
            ))}
          </select>
        </div>

        <FieldInput label="Harga (angka saja)" value={(form.price || 0).toString()} onChange={(v) => updatePrice(v)} />

        {/* Images manager */}
        <div style={{ marginBottom: "16px" }}>
          <label style={labelStyle}>Gambar Produk (multiple)</label>
          <div style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
            {(form.images || []).map((src, i) => (
              <div key={i} style={{ width: 96, height: 96, position: 'relative', borderRadius: 8, overflow: 'hidden', border: i===0? '2px solid #1a1a1a' : '1px solid rgba(0,0,0,0.06)'}}>
                <img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={`img-${i}`} />
                <div style={{ position: 'absolute', top: 6, right: 6, display: 'flex', gap: 6 }}>
                  <button onClick={() => setPrimary(i)} style={{ fontSize: 11, padding: '4px 6px', borderRadius: 6, border: 'none', background: 'rgba(0,0,0,0.5)', color:'#fff' }} title="Set primary">●</button>
                  <button onClick={() => removeImageAt(i)} style={{ fontSize: 11, padding: '4px 6px', borderRadius: 6, border: 'none', background: '#d44', color:'#fff' }} title="Hapus">✕</button>
                </div>
              </div>
            ))}
          </div>

          <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleFileUpload} style={{ display: 'none' }} />
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => fileRef.current?.click()} style={{ ...btnOutlineStyle, padding: '10px 12px' }}>📁 Upload (multiple)</button>
            <input ref={urlRef} placeholder="Tambah URL gambar" style={{ ...inputStyle, flex: 1 }} />
            <button onClick={() => addImageUrl(urlRef.current?.value || '')} style={{ ...btnStyle, padding: '10px 12px' }}>+ Add</button>
          </div>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", color: "#bbb", marginTop: "8px" }}>Urutan gambar menentukan gambar utama (pertama). Klik ● pada thumbnail untuk set primary.</p>
        </div>

        <FieldInput label="Tag (opsional)" value={form.tag || ""} onChange={(v) => setForm({ ...form, tag: v || undefined })} />
        <FieldInput label="Varian (opsional)" value={form.variant || ""} onChange={(v) => setForm({ ...form, variant: v || undefined })} />
        <FieldTextarea label="Deskripsi (opsional)" value={form.description || ""} onChange={(v) => setForm({ ...form, description: v || undefined })} />

        <div className="flex gap-3 mt-6">
          <button onClick={() => {
            // ensure image primary is set
            const out = { ...form, image: (form.images && form.images[0]) || form.image } as Product;
            onSave(out);
          }} style={btnStyle}>Simpan</button>
          <button onClick={onCancel} style={btnOutlineStyle}>Batal</button>
        </div>
      </div>
    </motion.div>
  );
}

function VideoEditor({ video, onSave, onCancel }: { video: VideoItem; onSave: (v: VideoItem) => void; onCancel: () => void }) {
  const [form, setForm] = useState<VideoItem>({ ...video });
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUrlChange = (url: string) => {
    const source = detectVideoSource(url);
    const isShorts = /shorts|reel|tiktok/i.test(url);
    setForm({
      ...form,
      url,
      source,
      orientation: isShorts ? "vertical" : form.orientation,
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 50 * 1024 * 1024) {
      alert("File terlalu besar! Maksimal 50MB untuk video.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm({
        ...form,
        url: reader.result as string,
        source: "file",
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10000,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "#F9F9F7",
          padding: "32px",
          maxWidth: "500px",
          width: "100%",
          maxHeight: "80vh",
          overflow: "auto",
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
        }}
      >
        <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "22px", fontWeight: 400, color: "#1a1a1a", marginBottom: "24px" }}>
          🎬 Edit Video
        </h3>

        {/* URL Input */}
        <FieldInput
          label="URL Video (YouTube / Instagram / TikTok)"
          value={form.url.startsWith("data:") ? "(file uploaded)" : form.url}
          onChange={handleUrlChange}
        />

        {/* File Upload */}
        <div style={{ marginBottom: "16px" }}>
          <label style={labelStyle}>Atau Upload File Video</label>
          <input
            ref={fileRef}
            type="file"
            accept="video/*"
            onChange={handleFileUpload}
            style={{ display: "none" }}
          />
          <button
            onClick={() => fileRef.current?.click()}
            style={{
              ...btnOutlineStyle,
              width: "100%",
              padding: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            🎥 Pilih File Video
          </button>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", color: "#bbb", marginTop: "4px" }}>
            Format: MP4, WebM, MOV. Maks 50MB.
          </p>
        </div>

        {/* Auto-detected source */}
        <div style={{ marginBottom: "16px" }}>
          <label style={labelStyle}>Source (Auto-detect)</label>
          <div className="flex gap-2">
            {(["youtube", "instagram", "tiktok", "file"] as VideoSource[]).map((src) => {
              const colors: Record<VideoSource, string> = { youtube: "#FF0000", instagram: "#E1306C", tiktok: "#000", file: "#555" };
              return (
                <button
                  key={src}
                  onClick={() => setForm({ ...form, source: src })}
                  style={{
                    ...mono,
                    fontSize: "9px",
                    padding: "6px 12px",
                    border: form.source === src ? `2px solid ${colors[src]}` : "1px solid rgba(0,0,0,0.12)",
                    backgroundColor: form.source === src ? colors[src] : "transparent",
                    color: form.source === src ? "#fff" : "#666",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                >
                  {src}
                </button>
              );
            })}
          </div>
        </div>

        {/* Orientation */}
        <div style={{ marginBottom: "16px" }}>
          <label style={labelStyle}>Orientasi Video</label>
          <div className="flex gap-2">
            {(["horizontal", "vertical", "square"] as VideoOrientation[]).map((ori) => {
              const icons: Record<VideoOrientation, string> = { horizontal: "▬", vertical: "▮", square: "■" };
              return (
                <button
                  key={ori}
                  onClick={() => setForm({ ...form, orientation: ori })}
                  style={{
                    ...mono,
                    fontSize: "10px",
                    padding: "8px 16px",
                    border: form.orientation === ori ? "2px solid #1a1a1a" : "1px solid rgba(0,0,0,0.12)",
                    backgroundColor: form.orientation === ori ? "#1a1a1a" : "transparent",
                    color: form.orientation === ori ? "#fff" : "#666",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                >
                  {icons[ori]} {ori}
                </button>
              );
            })}
          </div>
        </div>

        {/* Caption */}
        <FieldTextarea
          label="Caption / Keterangan"
          value={form.caption}
          onChange={(v) => setForm({ ...form, caption: v })}
        />
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", color: "#bbb", marginTop: "-8px", marginBottom: "16px" }}>
          Isi caption manual atau biarkan kosong. Caption akan tampil di bawah video.
        </p>

        {/* Featured toggle */}
        <div
          onClick={() => setForm({ ...form, featured: !form.featured })}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "12px 16px",
            border: form.featured ? "1px solid rgba(255,180,0,0.4)" : "1px solid rgba(0,0,0,0.1)",
            backgroundColor: form.featured ? "rgba(255,245,220,0.7)" : "transparent",
            cursor: "pointer",
            transition: "all 0.3s ease",
            marginBottom: "16px",
          }}
        >
          <span style={{ fontSize: "18px", opacity: form.featured ? 1 : 0.3 }}>⭐</span>
          <div>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 600, color: "#1a1a1a" }}>
              {form.featured ? "Video Unggulan" : "Video Biasa"}
            </p>
            <p style={{ ...mono, fontSize: "8px", color: "#999" }}>
              {form.featured ? "Tampil di homepage" : "Hanya tampil di halaman Tentang Kami & Lihat Semua"}
            </p>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={() => onSave(form)} style={btnStyle}>Simpan</button>
          <button onClick={onCancel} style={btnOutlineStyle}>Batal</button>
        </div>
      </div>
    </motion.div>
  );
}
