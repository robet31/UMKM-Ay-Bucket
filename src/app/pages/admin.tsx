import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  defaultGalleryProjects,
  getSiteConfig,
  getGalleryProjects,
  saveSiteConfig,
  setGalleryProjects,
  resetGalleryProjects,
  resetSiteConfig,
  getProducts,
  saveProducts,
  resetProducts,
  defaultProducts,
  mergeProductsByNameAndPrice,
  categories,
  getVideos,
  saveVideos,
  resetVideos,
  defaultVideos,
  detectVideoSource,
  formatRupiah,
  getSiteConfigWithNeon,
  syncAllWithNeon,
  setAdminCredentials,
  cleanMapsUrl,
  compressImage,
  type GalleryProject,
  type SiteConfig,
  type Product,
  type VideoItem,
  type VideoSource,
  type VideoOrientation,
  type HeroSetting,
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

type Tab = "general" | "products" | "navbar" | "footer" | "hero" | "videos" | "gallery";

export function Admin() {
  const [config, setConfig] = useState<SiteConfig>(getSiteConfig());
  const [products, setProductsList] = useState<Product[]>(() => mergeProductsByNameAndPrice(getProducts()));
  const [videos, setVideosList] = useState<VideoItem[]>(getVideos());
  const [galleryProjects, setGalleryProjectsList] = useState<GalleryProject[]>(getGalleryProjects());
  const [activeTab, setActiveTab] = useState<Tab>("general");
  const [saved, setSaved] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingVideo, setEditingVideo] = useState<VideoItem | null>(null);
  const [authed, setAuthed] = useState<boolean>(false);
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    if (!authed) {
      const htmlElem = document.documentElement;
      const bodyElem = document.body;
      const prevHtmlOverflow = htmlElem.style.overflow;
      const prevBodyOverflow = bodyElem.style.overflow;
      htmlElem.style.overflow = "hidden";
      bodyElem.style.overflow = "hidden";
      return () => {
        htmlElem.style.overflow = prevHtmlOverflow;
        bodyElem.style.overflow = prevBodyOverflow;
      };
    }
  }, [authed]);

  const showSaved = () => {
    setSaved(true);
    setShowSuccessModal(true);
    setTimeout(() => setSaved(false), 3000);
    setTimeout(() => setShowSuccessModal(false), 4000);
  };

  const handleSaveConfig = async () => {
    const normalizedConfig = {
      ...config,
      instagram: config.instagram?.startsWith('@@') ? config.instagram.substring(1) : config.instagram,
      tiktok: config.tiktok?.startsWith('@@') ? config.tiktok.substring(1) : config.tiktok,
    };
    try {
      await saveSiteConfig(normalizedConfig);
      showSaved();
      alert("Pengaturan Website berhasil disimpan!");
    } catch (e: any) {
      alert(e.message || "Gagal menyimpan pengaturan.");
    }
  };

  const uploadBrandLogo = async (file: File | null) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran gambar maksimal 5MB");
      return;
    }
    try {
      const dataUrl = await compressImage(file, 800, 0.8);
      setConfig((prev) => ({ ...prev, brandLogoUrl: dataUrl }));
    } catch (e) {
      alert("Gagal memproses gambar");
    }
  };

  const uploadHeroImage = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const fileArray = Array.from(files).slice(0, 10);
    const results: string[] = [];
    for (const file of fileArray) {
      if (file.size > 5 * 1024 * 1024) continue;
      try {
        const dataUrl = await compressImage(file, 1200, 0.8);
        if (dataUrl) results.push(dataUrl);
      } catch (e) {
        console.error("Failed to compress image:", e);
      }
    }
    if (results.length > 0) {
      const currentSettings = config.heroSettings || [];
      const newSettings = [...currentSettings];
      results.forEach((url) => {
        newSettings.push({ image: url });
      });
      setConfig((prev) => ({ ...prev, heroSettings: newSettings.slice(0, 10) }));
    }
  };

  const updateHeroSlot = (index: number, patch: Partial<HeroSetting>) => {
    const current = [...(config.heroSettings || [])];
    while (current.length <= index) current.push({});
    current[index] = { ...current[index], ...patch };
    setConfig({ ...config, heroSettings: current });
  };

  const removeHeroSlot = (index: number) => {
    if (window.confirm("Hapus slot hero ini?")) {
      const current = (config.heroSettings || []).filter((_, i) => i !== index);
      setConfig({ ...config, heroSettings: current });
      alert("Slot Hero dihapus (jangan lupa klik Simpan Pengaturan)");
    }
  };

  const handleSaveProducts = async () => {
    const merged = mergeProductsByNameAndPrice(products);
    try {
      await saveProducts(merged);
      setProductsList(merged);
      showSaved();
      alert("Data Produk berhasil disimpan!");
    } catch (e: any) {
      alert(e.message || "Gagal menyimpan produk.");
    }
  };

  const handleSaveVideos = async () => {
    try {
      await saveVideos(videos);
      showSaved();
      alert("Data Video berhasil disimpan!");
    } catch (e: any) {
      alert(e.message || "Gagal menyimpan video.");
    }
  };

  const handleSaveGallery = async () => {
    try {
      await setGalleryProjects(galleryProjects);
      showSaved();
      alert("Data Galeri berhasil disimpan!");
    } catch (e: any) {
      alert(e.message || "Gagal menyimpan galeri.");
    }
  };

  const handleResetAll = () => {
    if (confirm("Reset semua pengaturan ke default?")) {
      resetSiteConfig();
      resetProducts();
      resetVideos();
      resetGalleryProjects();
      setConfig(getSiteConfig());
      setProductsList(mergeProductsByNameAndPrice(defaultProducts));
      setVideosList(defaultVideos);
      setGalleryProjectsList(defaultGalleryProjects);
      showSaved();
    }
  };

  // add noindex meta to avoid indexing admin page
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex,nofollow";
    document.head.appendChild(meta);
    const canonical = document.createElement("meta");
    canonical.name = "googlebot";
    canonical.content = "noindex,nofollow,noarchive";
    document.head.appendChild(canonical);
    return () => {
      try { document.head.removeChild(meta); } catch { }
      try { document.head.removeChild(canonical); } catch { }
    };
  }, []);

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm("Hapus produk ini secara permanen?")) {
      const updated = mergeProductsByNameAndPrice(products.filter((p) => p.id !== id));
      try {
        await saveProducts(updated);
        setProductsList(updated);
        alert("Produk berhasil dihapus!");
      } catch (e: any) {
        alert(e.message || "Gagal menghapus produk dari server.");
      }
    }
  };

  const handleUpdateProduct = (updated: Product) => {
    const newList = mergeProductsByNameAndPrice(products.map((p) => (p.id === updated.id ? updated : p)));
    setProductsList(newList);
    setEditingProduct(null);
  };

  const handleAddProduct = () => {
    const newProduct: Product = {
      id: `custom-${Date.now()}`,
      name: "Produk Baru",
      category: "catalog-home",
      price: 100000,
      priceLabel: "Rp 100.000",
      image: "https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=600&q=80",
      images: ["https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=600&q=80"],
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

  const handleDeleteVideo = async (id: string) => {
    if (window.confirm("Hapus video ini?")) {
      const updated = videos.filter((v) => v.id !== id);
      try {
        await saveVideos(updated);
        setVideosList(updated);
        alert("Video berhasil dihapus!");
      } catch (e: any) {
        alert(e.message || "Gagal menghapus video dari server.");
      }
    }
  };

  const handleUpdateVideo = (updated: VideoItem) => {
    const newList = videos.map((v) => (v.id === updated.id ? updated : v));
    setVideosList(newList);
    setEditingVideo(null);
  };

  const handleAddGalleryProject = () => {
    const newItem: GalleryProject = {
      id: `gallery-${Date.now()}`,
      title: "Gallery Baru",
      category: "Kategori",
      aspect: "3/4",
      image: "",
    };
    setGalleryProjectsList([...galleryProjects, newItem]);
  };

  const updateGalleryProject = (id: string, patch: Partial<GalleryProject>) => {
    setGalleryProjectsList((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  };

  const removeGalleryProject = (id: string) => {
    if (window.confirm("Hapus item galeri ini?")) {
      setGalleryProjectsList((prev) => prev.filter((item) => item.id !== id));
      alert("Item galeri dihapus (jangan lupa klik Simpan Galeri)");
    }
  };

  const uploadGalleryImage = async (id: string, file: File | null) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran gambar maksimal 5MB");
      return;
    }
    try {
      const dataUrl = await compressImage(file, 1000, 0.8);
      updateGalleryProject(id, { image: dataUrl });
    } catch (e) {
      alert("Gagal memproses gambar");
    }
  };

  const tabs: { key: Tab; label: string }[] = [
    { key: "general", label: "Umum" },
    { key: "hero", label: "Hero" },
    { key: "navbar", label: "Navbar" },
    { key: "products", label: "Produk" },
    { key: "gallery", label: "Galeri" },
    { key: "videos", label: "Video" },
    { key: "footer", label: "Footer" },
  ];

  if (!authed) {
    const handleLogin = async () => {
      if (isLoggingIn) return;
      setIsLoggingIn(true);
      setLoginError("");
      
      try {
        const cfg = await getSiteConfigWithNeon();
        const username = cfg.adminUsername || 'admin';
        const pass = cfg.adminPassword || 'AyBucket2026!';
        
        if (usernameInput === username && passwordInput === pass) {
          setAuthed(true);
          setAdminCredentials(usernameInput, passwordInput);
          // Sync all data from Neon DB so the admin sees the latest remote changes
          syncAllWithNeon().then(() => {
            setConfig(getSiteConfig());
            setProductsList(mergeProductsByNameAndPrice(getProducts()));
            setVideosList(getVideos());
            setGalleryProjectsList(getGalleryProjects());
          });
        } else {
          setLoginError("Username atau password salah!");
          setPasswordInput("");
        }
      } catch (err) {
        setLoginError("Koneksi gagal, silakan coba lagi.");
      } finally {
        setIsLoggingIn(false);
      }
    };

    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #1a1a1a 0%, #2d2016 50%, #1a1a1a 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{
            background: '#fff',
            padding: '40px 32px',
            width: '100%',
            maxWidth: '380px',
            borderRadius: '20px',
            boxShadow: '0 30px 80px rgba(0,0,0,0.4)',
          }}
        >
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'linear-gradient(135deg, #b85c3b, #d17047)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '24px' }}>
              🔐
            </div>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '26px', fontWeight: 400, color: '#1a1a1a', margin: '0 0 4px 0' }}>Admin Panel</h3>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#999', margin: 0 }}>
              Ay Bucket & Gift
            </p>
          </div>

          {/* Error message */}
          <AnimatePresence>
            {loginError && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{
                  padding: '10px 14px',
                  backgroundColor: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: '10px',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span style={{ fontSize: '14px' }}>⚠️</span>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', color: '#dc2626', margin: 0 }}>{loginError}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#999', display: 'block', marginBottom: '6px' }}>Username</label>
              <input
                aria-label="Username admin"
                value={usernameInput}
                onChange={(e) => { setUsernameInput(e.target.value); setLoginError(""); }}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                type="text"
                placeholder="Masukkan username"
                autoComplete="username"
                style={{ ...inputStyle, borderRadius: '10px', padding: '12px 14px', fontSize: '14px', border: '1px solid rgba(0,0,0,0.1)', width: '100%', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#999', display: 'block', marginBottom: '6px' }}>Password</label>
              <input
                aria-label="Password admin"
                value={passwordInput}
                onChange={(e) => { setPasswordInput(e.target.value); setLoginError(""); }}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                type="password"
                placeholder="Masukkan password"
                autoComplete="current-password"
                style={{ ...inputStyle, borderRadius: '10px', padding: '12px 14px', fontSize: '14px', border: '1px solid rgba(0,0,0,0.1)', width: '100%', boxSizing: 'border-box' }}
              />
            </div>
            <motion.button
              onClick={handleLogin}
              disabled={isLoggingIn}
              whileHover={isLoggingIn ? {} : { scale: 1.02 }}
              whileTap={isLoggingIn ? {} : { scale: 0.98 }}
              style={{
                ...btnStyle,
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                fontSize: '11px',
                letterSpacing: '0.12em',
                marginTop: '4px',
                background: isLoggingIn ? '#666' : 'linear-gradient(135deg, #1a1a1a, #333)',
                boxShadow: isLoggingIn ? 'none' : '0 8px 20px rgba(0,0,0,0.15)',
                cursor: isLoggingIn ? 'not-allowed' : 'pointer',
              }}
            >
              {isLoggingIn ? "MEMERIKSA..." : "MASUK"}
            </motion.button>
          </div>

          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '10px', color: '#ccc', textAlign: 'center', marginTop: '20px', lineHeight: 1.5 }}>
            Hanya administrator yang berwenang yang dapat mengakses halaman ini.
          </p>
        </motion.div>
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

      {/* Success Toast Notification */}
      {createPortal(
        <AnimatePresence>
          {showSuccessModal && (
            <motion.div
              key="success-toast"
              initial={{ opacity: 0, y: -60, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: -60, x: "-50%" }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              style={{
                position: 'fixed',
                top: '24px',
                left: '50%',
                zIndex: 2147483647,
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '16px 24px',
                backgroundColor: '#fff',
                borderRadius: '16px',
                boxShadow: '0 12px 40px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.04)',
                maxWidth: '460px',
                width: 'calc(100vw - 32px)',
                cursor: 'pointer',
                overflow: 'hidden',
              }}
              onClick={() => setShowSuccessModal(false)}
            >
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', color: '#22c55e', fontSize: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                ✅
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', fontWeight: 700, color: '#1a1a1a', margin: '0 0 2px 0' }}>Berhasil Disimpan!</p>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', color: '#888', margin: 0, lineHeight: 1.4 }}>
                  Perubahan tersimpan ke database.
                </p>
              </div>
              <span style={{ color: '#ccc', fontSize: '18px', fontWeight: 300, flexShrink: 0 }}>×</span>
              {/* Auto-dismiss progress bar */}
              <motion.div
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{ duration: 4, ease: "linear" }}
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '3px',
                  backgroundColor: '#22c55e',
                  transformOrigin: 'left',
                  borderRadius: '0 0 16px 16px',
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

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
              <FieldInput label="Brand Logo URL" value={config.brandLogoUrl || ""} onChange={(v) => setConfig({ ...config, brandLogoUrl: v })} />
              <div style={{ marginBottom: "16px" }}>
                <label style={labelStyle}>Upload Brand Logo</label>
                <label style={{ ...btnOutlineStyle, padding: "8px 12px", cursor: "pointer", display: "inline-block" }}>
                  Pilih Logo
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => uploadBrandLogo(e.target.files?.[0] || null)}
                  />
                </label>
              </div>
              {config.brandLogoUrl ? (
                <img
                  src={config.brandLogoUrl}
                  alt="Brand logo preview"
                  style={{ width: "160px", height: "160px", objectFit: "contain", border: "1px solid rgba(0,0,0,0.08)", borderRadius: "16px", background: "#fff", padding: "8px" }}
                />
              ) : null}
            </div>
            <div style={sectionStyle}>
              <FieldInput label="Nomor WhatsApp (format: 628xxx)" value={config.whatsappNumber} onChange={(v) => setConfig({ ...config, whatsappNumber: v })} />
              <FieldInput label="Nomor WhatsApp Display (format: 08xxx)" value={config.whatsappDisplay} onChange={(v) => setConfig({ ...config, whatsappDisplay: v })} />
              <FieldInput label="Instagram" value={config.instagram} onChange={(v) => setConfig({ ...config, instagram: v })} />
              <FieldInput label="TikTok" value={config.tiktok} onChange={(v) => setConfig({ ...config, tiktok: v })} />
            </div>
            <div style={sectionStyle}>
              <FieldInput label="Google Maps Embed URL" value={config.mapsEmbedUrl || ""} onChange={(v) => setConfig({ ...config, mapsEmbedUrl: v })} />
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", color: "#999", marginTop: "-8px", marginBottom: "12px", lineHeight: 1.5 }}>
                💡 Kosongkan untuk menggunakan embed otomatis dari alamat. Atau paste URL embed Google Maps dari Google Maps → Share → Embed a map.
              </p>
              {(config.mapsEmbedUrl || config.address) && (
                <div style={{ borderRadius: "12px", overflow: "hidden", border: "1px solid rgba(0,0,0,0.08)", marginBottom: "8px" }}>
                  <iframe
                    src={cleanMapsUrl(config.mapsEmbedUrl) || `https://maps.google.com/maps?q=${encodeURIComponent(config.address || "Pertokoan Pasar Senenan Bangkalan")}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                    style={{ width: "100%", height: "200px", border: 0, display: "block" }}
                    loading="lazy"
                    title="Maps Preview"
                  />
                </div>
              )}
            </div>
            <div style={sectionStyle}>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", color: "#888", marginBottom: "12px", lineHeight: 1.6 }}>
                💡 Tombol "Pesan Sekarang" di navbar dan footer akan mengarahkan pengunjung ke WhatsApp dengan nomor yang terdaftar di atas.
              </p>
            </div>
            <div style={sectionStyle}>
              <FieldInput label="Username Admin" value={config.adminUsername || "admin"} onChange={(v) => setConfig({ ...config, adminUsername: v })} />
              <FieldInput label="Password Admin" value={config.adminPassword || "admin123"} onChange={(v) => setConfig({ ...config, adminPassword: v })} />
            </div>
            <button onClick={handleSaveConfig} style={btnStyle}>Simpan Pengaturan</button>
          </div>
        )}

        {activeTab === "hero" && (
          <HeroSlotManager
            config={config}
            setConfig={setConfig}
            products={products}
            updateHeroSlot={updateHeroSlot}
            removeHeroSlot={removeHeroSlot}
            onSave={handleSaveConfig}
          />
        )}

        {activeTab === "gallery" && (
          <GalleryManager
            items={galleryProjects}
            onUpdate={setGalleryProjectsList}
            onSave={handleSaveGallery}
            onAddItem={handleAddGalleryProject}
            onRemoveItem={removeGalleryProject}
            onUploadImage={uploadGalleryImage}
          />
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

            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", color: "#888", marginBottom: "14px", lineHeight: 1.7 }}>
              Gambar pertama pada daftar produk adalah gambar utama (cover) di katalog. Buka <strong>Edit</strong> lalu klik ● pada thumbnail untuk memilih cover produk.
            </p>

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

            {/* Product List — Card Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "14px" }}>
              {products.map((product) => {
                const catInfo = categories.find((c) => c.key === product.category);
                return (
                  <div
                    key={product.id}
                    style={{
                      border: "1px solid rgba(0,0,0,0.06)",
                      backgroundColor: "#fff",
                      borderRadius: "14px",
                      overflow: "hidden",
                      transition: "box-shadow 0.3s ease, transform 0.2s ease",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}
                  >
                    {/* Image */}
                    <div style={{ position: "relative", width: "100%", aspectRatio: "4/3", backgroundColor: "#f3f0eb", overflow: "hidden" }}>
                      <img
                        src={product.image}
                        alt={product.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                      {/* Category badge */}
                      <span style={{
                        position: "absolute", top: "8px", left: "8px",
                        padding: "4px 10px", borderRadius: "999px",
                        backgroundColor: "rgba(0,0,0,0.6)", color: "#fff",
                        fontFamily: "'JetBrains Mono', monospace", fontSize: "8px",
                        letterSpacing: "0.08em", textTransform: "uppercase",
                      }}>
                        {catInfo?.emoji} {catInfo?.label || product.category}
                      </span>
                      {/* Image count */}
                      {(product.images?.length || 0) > 1 && (
                        <span style={{
                          position: "absolute", bottom: "8px", right: "8px",
                          padding: "3px 8px", borderRadius: "6px",
                          backgroundColor: "rgba(0,0,0,0.55)", color: "#fff",
                          fontFamily: "'JetBrains Mono', monospace", fontSize: "9px",
                        }}>
                          📷 {product.images?.length}
                        </span>
                      )}
                    </div>
                    {/* Info */}
                    <div style={{ padding: "12px 14px" }}>
                      <p style={{
                        fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 600,
                        color: "#1a1a1a", margin: "0 0 4px 0",
                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                      }}>
                        {product.name}
                      </p>
                      <p style={{
                        fontFamily: "'JetBrains Mono', monospace", fontSize: "12px",
                        color: "#b85c3b", fontWeight: 700, margin: "0 0 10px 0",
                      }}>
                        {product.priceLabel}
                      </p>
                      <div style={{ display: "flex", gap: "6px" }}>
                        <button
                          onClick={() => setEditingProduct(product)}
                          style={{ ...btnOutlineStyle, padding: "7px 14px", fontSize: "9px", flex: 1, borderRadius: "8px" }}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          style={{ ...btnOutlineStyle, padding: "7px 14px", fontSize: "9px", borderColor: "#d44", color: "#d44", borderRadius: "8px" }}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
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

function FieldInput({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <label style={labelStyle}>{label}</label>
      <input
        style={inputStyle}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onFocus={(e) => { e.target.style.borderColor = "#1a1a1a"; }}
        onBlur={(e) => { e.target.style.borderColor = "rgba(0,0,0,0.12)"; }}
      />
    </div>
  );
}

function FieldSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: Array<{ value: string; label: string }> }) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <label style={labelStyle}>{label}</label>
      <select
        style={{ ...inputStyle, cursor: "pointer" }}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
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

// ---- Hero Slot Manager ----
function HeroSlotManager({
  config,
  setConfig,
  products,
  updateHeroSlot,
  removeHeroSlot,
  onSave,
}: {
  config: SiteConfig;
  setConfig: (c: SiteConfig) => void;
  products: Product[];
  updateHeroSlot: (index: number, patch: Partial<HeroSetting>) => void;
  removeHeroSlot: (index: number) => void;
  onSave: () => void;
}) {
  const MAX_HERO_SLOTS = 3;
  const heroSlots = config.heroSettings || [];
  const [slotCategoryFilters, setSlotCategoryFilters] = useState<Record<number, string>>({});

  const getFilteredProducts = (idx: number) => {
    const cat = slotCategoryFilters[idx];
    if (!cat || cat === "all") return products;
    return products.filter(p => p.category === cat);
  };

  const uniqueCategories = Array.from(new Set(products.map(p => p.category)));

  return (
    <div>
      <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "24px", fontWeight: 400, color: "#1a1a1a", marginBottom: "12px" }}>
        🎡 Hero Carousel
      </h2>
      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", color: "#666", lineHeight: 1.7, marginBottom: "28px" }}>
        Atur gambar yang tampil di Hero Section. Maksimal <strong>{MAX_HERO_SLOTS} slot</strong>. 
        Setiap slot bisa menggunakan <strong>gambar custom</strong> atau <strong>mengambil otomatis dari produk</strong> yang dipilih. 
        Jika produk dipilih, nama dan harga akan otomatis muncul di hero.
      </p>

      <div style={sectionStyle}>
        <FieldTextarea label="Judul Hero (Tampil jika slot tidak terhubung ke produk)" value={config.heroTitle} onChange={(v) => setConfig({ ...config, heroTitle: v })} />
        <FieldTextarea label="Subtitle Hero" value={config.heroSubtitle} onChange={(v) => setConfig({ ...config, heroSubtitle: v })} />
      </div>

      <div style={{ marginBottom: '40px' }}>
        <p style={{ ...mono, color: '#666', marginBottom: '20px' }}>Hero Slides ({heroSlots.length}/{MAX_HERO_SLOTS})</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {heroSlots.map((slot, idx) => {
            const linkedProduct = products.find(p => p.id === slot.productId);
            const previewImage = slot.image || linkedProduct?.image || "";
            const previewName = linkedProduct?.name || config.heroTitle || "Ay Bucket";
            const previewPrice = linkedProduct ? formatRupiah(linkedProduct.price) : "";
            const filteredProducts = getFilteredProducts(idx);

            return (
              <div key={idx} style={{ 
                padding: '20px', 
                backgroundColor: '#fff', 
                border: linkedProduct ? '2px solid rgba(184,92,59,0.3)' : '1px solid rgba(0,0,0,0.08)', 
                borderRadius: '16px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ 
                      width: '32px', height: '32px', borderRadius: '50%', 
                      background: 'linear-gradient(135deg, #b85c3b, #d17047)', 
                      color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', fontWeight: 700 
                    }}>
                      {idx + 1}
                    </span>
                    <p style={{ ...mono, fontSize: '11px', color: '#1a1a1a', margin: 0 }}>Slide #{idx + 1}</p>
                  </div>
                  <button onClick={() => removeHeroSlot(idx)} style={{ border: 'none', background: '#fee2e2', color: '#dc2626', cursor: 'pointer', fontSize: '11px', padding: '6px 12px', borderRadius: '6px', fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>
                    🗑️ Hapus
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '20px' }}>
                  {/* Preview Image */}
                  <div style={{ position: 'relative' }}>
                    <div style={{ width: '140px', height: '180px', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#f3f0eb', border: '1px solid rgba(0,0,0,0.08)' }}>
                      {previewImage ? (
                        <img src={previewImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#bbb', fontFamily: "'Inter', sans-serif", fontSize: '12px', textAlign: 'center', padding: '12px' }}>
                          Belum ada gambar
                        </div>
                      )}
                    </div>
                    <label style={{ 
                      position: 'absolute', bottom: '8px', left: '50%', transform: 'translateX(-50%)',
                      cursor: 'pointer', padding: '4px 10px', borderRadius: '6px',
                      backgroundColor: 'rgba(0,0,0,0.7)', color: '#fff', 
                      fontFamily: "'Inter', sans-serif", fontSize: '10px', fontWeight: 600,
                      whiteSpace: 'nowrap',
                    }}>
                      📷 Upload
                      <input type="file" accept="image/*" style={{ display: 'none' }} onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.size > 5 * 1024 * 1024) { alert("Maksimal 5MB"); return; }
                          try {
                            const dataUrl = await compressImage(file, 1200, 0.8);
                            updateHeroSlot(idx, { image: dataUrl });
                          } catch (err) {
                            alert("Gagal memproses gambar");
                          }
                        }
                      }} />
                    </label>
                    {/* Preview info */}
                    {linkedProduct && (
                      <div style={{ marginTop: '8px', textAlign: 'center' }}>
                        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', fontWeight: 600, color: '#1a1a1a', margin: '0 0 2px 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{previewName}</p>
                        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: '#b85c3b', margin: 0 }}>{previewPrice}</p>
                      </div>
                    )}
                  </div>

                  {/* Controls */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {/* Category Filter */}
                    <div>
                      <label style={labelStyle}>Filter Kategori Produk</label>
                      <select
                        style={{ ...inputStyle, fontSize: '13px' }}
                        value={slotCategoryFilters[idx] || "all"}
                        onChange={(e) => {
                          setSlotCategoryFilters(prev => ({ ...prev, [idx]: e.target.value }));
                          // Reset product if switching category
                          if (slot.productId) {
                            const prod = products.find(p => p.id === slot.productId);
                            if (prod && e.target.value !== "all" && prod.category !== e.target.value) {
                              updateHeroSlot(idx, { productId: "" });
                            }
                          }
                        }}
                      >
                        <option value="all">📋 Semua Kategori</option>
                        {uniqueCategories.map(cat => {
                          const catInfo = categories.find(c => c.key === cat);
                          return (
                            <option key={cat} value={cat}>{catInfo?.emoji || "📦"} {catInfo?.label || cat}</option>
                          );
                        })}
                      </select>
                    </div>

                    {/* Product Picker */}
                    <div>
                      <label style={labelStyle}>Pilih Produk</label>
                      <select
                        style={{ ...inputStyle, fontSize: '13px' }}
                        value={slot.productId || ""}
                        onChange={(e) => {
                          const prodId = e.target.value;
                          const prod = products.find(p => p.id === prodId);
                          // Auto-set image from product if no custom image
                          if (prod && !slot.image) {
                            updateHeroSlot(idx, { productId: prodId, image: prod.image });
                          } else {
                            updateHeroSlot(idx, { productId: prodId });
                          }
                        }}
                      >
                        <option value="">-- Pilih Produk --</option>
                        {filteredProducts.map(p => (
                          <option key={p.id} value={p.id}>
                            {p.name} — {formatRupiah(p.price)}
                          </option>
                        ))}
                      </select>
                    </div>

                    {linkedProduct && (
                      <div style={{ 
                        padding: '10px 14px', borderRadius: '10px', 
                        background: 'linear-gradient(135deg, rgba(184,92,59,0.08), rgba(209,112,71,0.04))',
                        border: '1px solid rgba(184,92,59,0.15)',
                      }}>
                        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', color: '#1a1a1a', fontWeight: 600, margin: '0 0 4px 0' }}>
                          ✅ Terhubung: {linkedProduct.name}
                        </p>
                        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: '#b85c3b', margin: 0 }}>
                          {formatRupiah(linkedProduct.price)} • {categories.find(c => c.key === linkedProduct.category)?.label || linkedProduct.category}
                        </p>
                      </div>
                    )}

                    {!linkedProduct && (
                      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', color: '#999', fontStyle: 'italic', margin: 0 }}>
                        💡 Pilih produk agar nama & harga otomatis muncul, atau biarkan kosong untuk info default.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {heroSlots.length < MAX_HERO_SLOTS && (
          <button
            onClick={() => setConfig({ ...config, heroSettings: [...heroSlots, {}] })}
            style={{ 
              ...btnOutlineStyle, 
              marginTop: '20px', 
              width: '100%', 
              padding: '14px',
              borderRadius: '12px',
              borderStyle: 'dashed',
              fontSize: '11px',
            }}
          >
            + Tambah Slide Hero ({heroSlots.length}/{MAX_HERO_SLOTS})
          </button>
        )}

        {heroSlots.length >= MAX_HERO_SLOTS && (
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', color: '#999', textAlign: 'center', marginTop: '16px' }}>
            Maksimal {MAX_HERO_SLOTS} slide hero telah tercapai.
          </p>
        )}
      </div>

      <button onClick={onSave} style={{ ...btnStyle, borderRadius: '10px', padding: '14px 28px' }}>
        💾 Simpan Hero
      </button>
    </div>
  );
}

// GalleryManager component dengan drag-and-drop
interface GalleryManagerProps {
  items: GalleryProject[];
  onUpdate: (items: GalleryProject[]) => void;
  onSave: () => void;
  onAddItem: () => void;
  onRemoveItem: (id: string) => void;
  onUploadImage: (id: string, file: File | null) => void;
}

function GalleryManager({
  items,
  onUpdate,
  onSave,
  onAddItem,
  onRemoveItem,
  onUploadImage,
}: GalleryManagerProps) {
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<GalleryProject | null>(null);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id);
    e.dataTransfer!.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer!.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedId || draggedId === targetId) {
      setDraggedId(null);
      return;
    }

    const draggedIndex = items.findIndex((i) => i.id === draggedId);
    const targetIndex = items.findIndex((i) => i.id === targetId);

    if (draggedIndex !== -1 && targetIndex !== -1) {
      const newItems = [...items];
      [newItems[draggedIndex], newItems[targetIndex]] = [
        newItems[targetIndex],
        newItems[draggedIndex],
      ];
      onUpdate(newItems);
    }

    setDraggedId(null);
  };

  const handleFieldChange = (id: string, field: string, value: any) => {
    const newItems = items.map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    );
    onUpdate(newItems);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "24px", fontWeight: 400, color: "#1a1a1a" }}>
          Asset Gambar Galeri ({items.length})
        </h2>
        <div className="flex gap-2 flex-wrap">
          <button onClick={onAddItem} style={btnStyle}>+ Tambah Item</button>
          <button onClick={onSave} style={{ ...btnStyle, backgroundColor: "#25D366", borderColor: "#25D366" }}>💾 Simpan Galeri</button>
        </div>
      </div>

      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", color: "#888", marginBottom: "16px", lineHeight: 1.7 }}>
        Gambar di tab ini dipakai oleh halaman Studio/Galeri. Kamu bisa geser-geser untuk mengubah urutan. Setiap item bisa diubah judul, kategori, rasio, dan gambar (URL atau upload file).
      </p>

      <div style={{ display: "grid", gap: "14px" }}>
        {items.map((item, idx) => (
          <div
            key={item.id}
            draggable
            onDragStart={(e) => handleDragStart(e, item.id)}
            onDragOver={(e) => handleDragOver(e)}
            onDrop={(e) => handleDrop(e, item.id)}
            onDragEnd={() => setDraggedId(null)}
            style={{
              border: draggedId === item.id ? "2px solid #4a5568" : "1px solid rgba(0,0,0,0.08)",
              background: draggedId === item.id ? "#f7fafc" : "#fff",
              padding: "14px",
              cursor: "grab",
              opacity: draggedId === item.id ? 0.7 : 1,
              transition: "all 0.2s",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", fontWeight: 500, color: "#888" }}>
                #{idx + 1} • 🔀 Geser untuk mengurutkan
              </span>
            </div>
            <div style={{ display: "grid", gap: "10px" }}>
              <FieldInput label="Judul" value={item.title} onChange={(v) => handleFieldChange(item.id, "title", v)} />
              <FieldInput label="Kategori" value={item.category} onChange={(v) => handleFieldChange(item.id, "category", v)} />
              <div>
                <label style={labelStyle}>Rasio</label>
                <select
                  style={inputStyle}
                  value={item.aspect}
                  onChange={(e) => handleFieldChange(item.id, "aspect", e.target.value as any)}
                >
                  <option value="3/4">3 / 4</option>
                  <option value="1/1">1 / 1</option>
                  <option value="16/9">16 / 9</option>
                </select>
              </div>
              <FieldInput label="URL Gambar" value={item.image} onChange={(v) => handleFieldChange(item.id, "image", v)} />
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
                <label style={{ ...btnOutlineStyle, padding: "8px 12px", cursor: "pointer" }}>
                  Upload Gambar
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => onUploadImage(item.id, e.target.files?.[0] || null)}
                  />
                </label>
                <button onClick={() => onRemoveItem(item.id)} style={{ ...btnOutlineStyle, borderColor: "#d44", color: "#d44", padding: "8px 12px" }}>
                  Hapus
                </button>
              </div>
              {item.image ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedItem(item);
                  }}
                  style={{
                    padding: 0,
                    border: "none",
                    background: "transparent",
                    textAlign: "left",
                    cursor: "zoom-in",
                  }}
                  title="Klik untuk melihat detail gambar"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    style={{ width: "100%", maxWidth: "280px", height: "160px", objectFit: "cover", border: "1px solid rgba(0,0,0,0.06)" }}
                  />
                </button>
              ) : null}

              <button
                type="button"
                onClick={() => setSelectedItem(item)}
                style={{ ...btnOutlineStyle, padding: "8px 12px", width: "fit-content" }}
              >
                👁️ Lihat Detail
              </button>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {selectedItem && createPortal(
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 2147483647,
              background: "rgba(0,0,0,0.72)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 20,
            }}
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ scale: 0.96, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: "#fff",
                maxWidth: 920,
                width: "100%",
                maxHeight: "90vh",
                overflow: "auto",
                padding: 20,
                boxShadow: "0 30px 80px rgba(0,0,0,0.35)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "start", marginBottom: 16 }}>
                <div>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 400, margin: 0, color: "#1a1a1a" }}>
                    {selectedItem.title}
                  </h3>
                  <p style={{ margin: "6px 0 0", color: "#777", fontFamily: "'Inter', sans-serif", fontSize: 12 }}>
                    {selectedItem.category} • rasio {selectedItem.aspect}
                  </p>
                </div>
                <button onClick={() => setSelectedItem(null)} style={{ ...btnOutlineStyle, padding: "8px 12px" }}>
                  Tutup
                </button>
              </div>

              {selectedItem.image ? (
                <img
                  src={selectedItem.image}
                  alt={selectedItem.title}
                  style={{ width: "100%", maxHeight: 520, objectFit: "contain", background: "#f7f7f7", border: "1px solid rgba(0,0,0,0.08)" }}
                />
              ) : null}

              <div style={{ marginTop: 16, display: "grid", gap: 8, color: "#333", fontFamily: "'Inter', sans-serif", fontSize: 13 }}>
                <div><strong>ID:</strong> {selectedItem.id}</div>
                <div><strong>Judul:</strong> {selectedItem.title}</div>
                <div><strong>Kategori:</strong> {selectedItem.category}</div>
                <div><strong>Rasio:</strong> {selectedItem.aspect}</div>
                <div><strong>URL:</strong> {selectedItem.image}</div>
              </div>
            </motion.div>
          </motion.div>,
          document.body
        )}
      </AnimatePresence>
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
  const [isMobile, setIsMobile] = useState(() => (typeof window !== "undefined" ? window.innerWidth < 768 : false));
  const [draggedImageIndex, setDraggedImageIndex] = useState<number | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const urlRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const updatePrice = (val: string) => {
    const num = parseInt(val.replace(/\D/g, "")) || 0;
    setForm({ ...form, price: num, priceLabel: formatRupiah(num) });
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const max = 5 * 1024 * 1024;
    const promises: Promise<string>[] = [];
    Array.from(files).forEach((file) => {
      if (file.size > max) {
        alert("Beberapa gambar lebih dari 5MB dan dilewati");
        return;
      }
      promises.push(compressImage(file, 1000, 0.8));
    });
    try {
      const dataUrls = await Promise.all(promises);
      setForm({ ...form, images: [...(form.images || []), ...dataUrls] });
    } catch (e) {
      alert("Gagal memproses gambar");
    }
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

  const reorderImages = (fromIdx: number, toIdx: number) => {
    const imgs = [...(form.images || [])];
    if (fromIdx === toIdx) return;
    const [movedImg] = imgs.splice(fromIdx, 1);
    imgs.splice(toIdx, 0, movedImg);
    setForm({ ...form, images: imgs });
  };

  useEffect(() => {
    // ensure priceLabel consistent
    if (form.price && !form.priceLabel) setForm({ ...form, priceLabel: formatRupiah(form.price) });
  }, []);

  return createPortal(
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 2147483647,
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: isMobile ? "flex-start" : "center",
          justifyContent: "center",
          padding: isMobile ? "10px" : "24px",
          overflow: "auto",
        }}
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "#F9F9F7",
          padding: isMobile ? "18px" : "32px",
          maxWidth: "680px",
          width: "100%",
          maxHeight: isMobile ? "92dvh" : "85vh",
          overflowY: "auto",
          overflowX: "hidden",
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
          borderRadius: "16px",
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
          <label style={labelStyle}>Gambar Produk (geser untuk mengurutkan)</label>
          <div style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
            {(form.images || []).map((src, i) => (
              <div
                key={`${src}-${i}`}
                draggable
                onDragStart={() => setDraggedImageIndex(i)}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.currentTarget.style.opacity = "0.6";
                }}
                onDragLeave={(e) => {
                  e.currentTarget.style.opacity = "1";
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.currentTarget.style.opacity = "1";
                  if (draggedImageIndex !== null && draggedImageIndex !== i) {
                    reorderImages(draggedImageIndex, i);
                  }
                  setDraggedImageIndex(null);
                }}
                onDragEnd={() => setDraggedImageIndex(null)}
                onClick={() => setSelectedImageIndex(i)}
                title="Klik untuk lihat detail gambar"
                style={{
                  width: 96,
                  height: 96,
                  position: 'relative',
                  borderRadius: 8,
                  overflow: 'hidden',
                  border: i === 0 ? '2px solid #1a1a1a' : '1px solid rgba(0,0,0,0.06)',
                  cursor: 'zoom-in',
                  opacity: draggedImageIndex === i ? 0.5 : 1,
                  transition: 'opacity 0.2s',
                }}
              >
                <img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={`img-${i}`} />
                <div style={{ position: 'absolute', top: 6, right: 6, display: 'flex', gap: 6 }}>
                  <button type="button" onClick={(e) => { e.stopPropagation(); setPrimary(i); }} style={{ fontSize: 11, padding: '4px 6px', borderRadius: 6, border: 'none', background: 'rgba(0,0,0,0.5)', color: '#fff' }} title="Set primary">●</button>
                  <button type="button" onClick={(e) => { e.stopPropagation(); removeImageAt(i); }} style={{ fontSize: 11, padding: '4px 6px', borderRadius: 6, border: 'none', background: '#d44', color: '#fff' }} title="Hapus">✕</button>
                </div>
              </div>
            ))}
          </div>

          <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleFileUpload} style={{ display: 'none' }} />
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button type="button" onClick={() => fileRef.current?.click()} style={{ ...btnOutlineStyle, padding: '10px 12px', width: isMobile ? '100%' : undefined }}>📁 Upload (multiple)</button>
            <input ref={urlRef} placeholder="Tambah URL gambar" style={{ ...inputStyle, flex: 1, minWidth: isMobile ? '100%' : '200px' }} />
            <button type="button" onClick={() => addImageUrl(urlRef.current?.value || '')} style={{ ...btnStyle, padding: '10px 12px', width: isMobile ? '100%' : undefined }}>+ Add</button>
          </div>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", color: "#bbb", marginTop: "8px" }}>Urutan gambar menentukan gambar utama (pertama). Klik thumbnail untuk lihat detail, klik ● untuk set primary, atau geser gambar untuk mengubah urutan.</p>
        </div>

        <AnimatePresence>
          {selectedImageIndex !== null && form.images?.[selectedImageIndex] && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 2147483647,
                background: "rgba(0,0,0,0.72)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 20,
                overflow: "hidden",
              }}
              onClick={() => setSelectedImageIndex(null)}
            >
              <motion.div
                initial={{ scale: 0.96, y: 10 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.96, y: 10 }}
                onClick={(e) => e.stopPropagation()}
                style={{
                  background: "#fff",
                  maxWidth: 920,
                  width: "100%",
                  maxHeight: "90vh",
                  overflow: "hidden",
                  padding: 20,
                  boxShadow: "0 30px 80px rgba(0,0,0,0.35)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "start", marginBottom: 16 }}>
                  <div>
                    <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 400, margin: 0, color: "#1a1a1a" }}>
                      Detail Gambar {selectedImageIndex + 1}
                    </h3>
                    <p style={{ margin: "6px 0 0", color: "#777", fontFamily: "'Inter', sans-serif", fontSize: 12 }}>
                      Produk: {form.name}
                    </p>
                  </div>
                  <button onClick={() => setSelectedImageIndex(null)} style={{ ...btnOutlineStyle, padding: "8px 12px" }}>
                    Tutup
                  </button>
                </div>

                <img
                  src={form.images[selectedImageIndex]}
                  alt={`detail-${selectedImageIndex}`}
                  style={{ width: "100%", maxHeight: 560, objectFit: "contain", background: "#f7f7f7", border: "1px solid rgba(0,0,0,0.08)" }}
                />

                <div style={{ marginTop: 16, display: "grid", gap: 8, color: "#333", fontFamily: "'Inter', sans-serif", fontSize: 13 }}>
                  <div><strong>Index:</strong> {selectedImageIndex}</div>
                  <div><strong>Utama:</strong> {selectedImageIndex === 0 ? "Ya" : "Tidak"}</div>
                  <div><strong>URL/Sumber:</strong> {form.images[selectedImageIndex]}</div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <FieldInput label="Tag (opsional)" value={form.tag || ""} onChange={(v) => setForm({ ...form, tag: v || undefined })} />
        <FieldInput label="Varian (opsional)" value={form.variant || ""} onChange={(v) => setForm({ ...form, variant: v || undefined })} />
        <FieldTextarea label="Deskripsi (opsional)" value={form.description || ""} onChange={(v) => setForm({ ...form, description: v || undefined })} />

        <div className="flex gap-3 mt-6" style={{ flexWrap: "wrap" }}>
          <button onClick={() => {
            // ensure image primary is set
            const out = { ...form, image: (form.images && form.images[0]) || form.image } as Product;
            onSave(out);
          }} style={{ ...btnStyle, width: isMobile ? "100%" : undefined }}>Simpan</button>
          <button onClick={() => { if(window.confirm("Batalkan perubahan?")) onCancel(); }} style={{ ...btnOutlineStyle, width: isMobile ? "100%" : undefined }}>Batal</button>
        </div>
      </div>
    </motion.div>,
    document.body
  );
}

function VideoEditor({ video, onSave, onCancel }: { video: VideoItem; onSave: (v: VideoItem) => void; onCancel: () => void }) {
  const [form, setForm] = useState<VideoItem>({ ...video });
  const [isMobile, setIsMobile] = useState(() => (typeof window !== "undefined" ? window.innerWidth < 768 : false));
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 50 * 1024 * 1024) {
      alert("File terlalu besar! Maksimal 50MB untuk video.");
      return;
    }
    
    if (file.type.startsWith('image/')) {
      try {
        const dataUrl = await compressImage(file, 1000, 0.8);
        setForm({ ...form, url: dataUrl, source: "file" });
      } catch (err) {
        alert("Gagal memproses gambar");
      }
    } else {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({
          ...form,
          url: reader.result as string,
          source: "file",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return createPortal(
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 2147483647,
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: isMobile ? "flex-start" : "center",
          justifyContent: "center",
          padding: isMobile ? "10px" : "24px",
          overflow: "auto",
        }}
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "#F9F9F7",
          padding: isMobile ? "18px" : "32px",
          maxWidth: "500px",
          width: "100%",
          maxHeight: isMobile ? "92dvh" : "85vh",
          overflowY: "auto",
          overflowX: "hidden",
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
          borderRadius: "16px",
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

        <div className="flex gap-3 mt-6" style={{ flexWrap: "wrap" }}>
          <button onClick={() => onSave(form)} style={{ ...btnStyle, width: isMobile ? "100%" : undefined }}>Simpan</button>
          <button onClick={() => { if(window.confirm("Batalkan perubahan?")) onCancel(); }} style={{ ...btnOutlineStyle, width: isMobile ? "100%" : undefined }}>Batal</button>
        </div>
      </div>
    </motion.div>,
    document.body
  );
}
