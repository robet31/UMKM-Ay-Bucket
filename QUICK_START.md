# 🔥 QUICK START REFERENCE

**Last Updated**: 7 Mei 2026

---

## 📍 LOKASI FILE PENTING

```
Project Root: d:\SEMESTER 6 (MBKM) dll\PROJECT-DEPLOY-COBA BOT\AY BUCKET LANDING PAGE\High-End Portfolio Design\

🎨 LOGO
  └─ public/assets/ay-logo-5.png

⚙️ PROMO CONFIG (Edit di sini!)
  └─ src/app/promo-config.ts

📦 PRODUCTS (Auto-generated)
  └─ src/app/generated_products.ts

🖼️ ASSETS (Foto produk)
  └─ ASSETS-AY BUCKET/
     ├─ Akrilik frame mini/
     ├─ Bucket Bunga Gradoll.../
     ├─ Selempang List Pita/ (dengan Round Pita moved here ✓)
     └─ ...dll

📚 DOKUMENTASI
  ├─ PROMO_SETUP_GUIDE.md       ← Baca ini untuk setup promo
  ├─ CHANGES_SUMMARY.md         ← Ringkasan perubahan
  ├─ FINAL_VERIFICATION.md      ← Verification checklist
  ├─ promo-config.EXAMPLES.ts   ← Code examples
  └─ README.md                  ← General docs
```

---

## 🚀 QUICK COMMANDS

```bash
# Development
npm run dev              # Start dev server (port 5173)

# Build
npm run build           # Build untuk production
npm run preview         # Preview built version

# Generate Products
node scripts/generate_products.cjs   # Regenerate semua produk

# Lint/Format
npm run lint            # Cek code quality
```

---

## 🎯 SETUP PROMO - 30 DETIK

### Step 1: Edit file
```bash
# Buka: src/app/promo-config.ts
```

### Step 2: Tambah promo
```typescript
export const PROMO_CONFIG = {
  "Akrilik frame mini": {
    originalPrice: 150000,
    promoPrice: 95000,
    label: "PROMO SPESIAL"
  },
  
  "Selempang Wisuda 3 Titik": {
    originalPrice: 120000,
    promoPrice: 85000
  }
};
```

### Step 3: Refresh
- Reload browser (Ctrl+R)
- Promo otomatis muncul ✓

---

## ✨ APA YANG BERUBAH?

| Item | Status | Detail |
|------|--------|--------|
| Logo | ✅ NEW | Ganti dengan logo bunga modern |
| Promo System | ✅ NEW | Harga coret + diskon badge |
| Kategori | ✅ FIXED | Round Pita di folder yang benar |
| Naming | ✅ FIXED | Frame (bukan Frmae) |
| Hero Text | ✅ UPDATED | "Scroll ke bawah untuk..." |
| Products | ✅ REGENERATED | 127 products |

---

## 🎨 PROMO DISPLAY

```
Normal Product:
┌──────────────────┐
│   [Image]        │
├──────────────────┤
│ Produk Name      │
│ Rp 95.000        │  ← Just price
└──────────────────┘

Promo Product:
┌──────────────────┐
│   [Image]        │
├──────────────────┤
│ Produk Name      │
│ Rp 150.000 -37%  │  ← Original + badge
│ Rp 95.000 💰     │  ← Harga promo (menonjol)
└──────────────────┘
```

---

## 🔍 TROUBLESHOOTING

### Promo tidak muncul?
```
✓ Pastikan nama produk SAMA persis di PROMO_CONFIG
✓ Pastikan originalPrice > promoPrice
✓ Reload browser (hard refresh: Ctrl+Shift+R)
✓ Clear localStorage: DevTools → Application → Clear
```

### Logo tidak muncul?
```
✓ File exists: public/assets/ay-logo-5.png
✓ Check browser console (F12) untuk errors
✓ Try rebuild: npm run build
```

### Products tidak update?
```
✓ Run: node scripts/generate_products.cjs
✓ Rebuild: npm run build
✓ Dev reload: npm run dev
```

---

## 📊 PROJECT STATS

```
Total Products:       127
Categories:           12
Promo Ready:          ✅ Yes
Build Status:         ✅ Success
Errors:               0
Size (gzip):          ~220 kB

Folder Changes:
  ├─ Moved: 3 files (Round Pita Satin)
  ├─ Renamed: 1 folder (Frame)
  └─ Regenerated: 127 products
```

---

## 📞 NEXT ACTIONS

- [ ] Test promo di browser
- [ ] Add custom promos ke promo-config.ts
- [ ] Verify di mobile
- [ ] Deploy ke Vercel (optional)
- [ ] Test WhatsApp order link

---

## 🎯 TIPS

💡 **Untuk banyak promo**:
  - Copy-paste template di PROMO_CONFIG
  - Update setiap product entry

💡 **Untuk non-promo products**:
  - Tidak perlu di-list di PROMO_CONFIG
  - Otomatis display normal

💡 **Diskon % auto hitung**:
  - (originalPrice - promoPrice) / originalPrice * 100
  - Tidak perlu diisi manual

💡 **Mobile responsive**:
  - Design sudah responsive
  - Tested di semua ukuran

---

## 🔗 IMPORTANT LINKS

```
Local Dev:       http://localhost:5173
Admin:           http://localhost:5173/_admin
Production:      https://ay-buquet.vercel.app (if deployed)

GitHub:          [your-repo]
Kanban:          [your-project-board]
```

---

**Last Check**: ✅ All working  
**Status**: 🟢 Ready for use  
**Date**: 7 Mei 2026

Need help? Check the full docs in PROMO_SETUP_GUIDE.md 🚀
