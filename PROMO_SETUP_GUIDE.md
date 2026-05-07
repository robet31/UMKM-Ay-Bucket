# 📋 Panduan Fitur PROMO & Perubahan Kategorisasi

## ✨ Perubahan yang Dilakukan

### 1. **Logo Baru**
- ✅ Logo baru (dari `logo-source.png`) sudah menggantikan logo lama
- Logo sekarang ditampilkan di navbar dengan styling modern
- File logo disimpan di: `/public/assets/ay-logo-5.png`

### 2. **Perbaikan Kategorisasi & Naming**
- ✅ **"Frmae Birthday Edelweis"** → **"Frame Birthday Edelweis"** (fix typo)
- ✅ **"Round Pita Satin"** dipindahkan dari "Bucket Aesthetic" ke **"Selempang List Pita"**
- ✅ **"packing Luxury Elegant"** → konsisten dengan naming
- ✅ **"Bucket Aesthetic"** folder dihapus (file sudah dipindahkan ke kategori yang tepat)
- ✅ Script generasi produk (`generate_products.cjs`) sudah di-update
- ✅ Regenerasi file `generated_products.ts` (127 produk)

### 3. **Fitur PROMO dengan Harga Coret**
Sistem promo yang fleksibel sudah ditambahkan! Setiap produk sekarang bisa menampilkan:
- **Harga lama** (dengan garis coret) 
- **Diskon percentage** (badge merah dengan persentase)
- **Harga baru** dalam warna menonjol

### 4. **Hero Section**
- ✅ Tulisan lama dihapus:
  - **Lama**: "Scroll untuk melihat setiap frame polaroid unik..."
  - **Baru**: "Scroll ke bawah untuk menemukan koleksi pilihan terbaik. Setiap hadiah dirancang dengan penuh cinta untuk membuat momen Anda spesial."

---

## 🎯 Cara Menggunakan Fitur PROMO

### Setup Promo untuk Produk

Edit file: `src/app/promo-config.ts`

```typescript
export const PROMO_CONFIG: Record<string, { originalPrice: number; promoPrice: number; label?: string }> = {
  "Akrilik frame mini": {
    originalPrice: 150000,          // Harga asli (akan dicoret)
    promoPrice: 95000,              // Harga promo (ditampilkan besar)
    label: "PROMO SPESIAL 35%"      // Label (opsional)
  },
  
  "Selempang Wisuda 3 Titik": {
    originalPrice: 120000,
    promoPrice: 85000,
    label: "FLASH SALE"
  },
  
  // Tambah promo lainnya di sini...
};
```

### Cara Kerjanya

1. Ketika produk ada di `PROMO_CONFIG`, sistem akan:
   - ✅ Menampilkan harga lama dengan garis coret (warna abu)
   - ✅ Menampilkan diskon percentage dalam badge merah
   - ✅ Menampilkan harga baru dalam warna gold/oranye

2. Jika tidak ada di `PROMO_CONFIG`:
   - Produk ditampilkan normal (hanya harga sekarang)

3. Promo ditampilkan di:
   - **Kartu produk** (list view)
   - **Modal detail produk** (saat di-klik)

### Contoh Hasil

```
┌─────────────────────┐
│    [Produk Image]   │
├─────────────────────┤
│ Akrilik frame mini  │
│                     │
│ Rp 150.000 -35%    │
│ Rp 95.000 💰       │
│                     │
│ [Pesan via WhatsApp]│
└─────────────────────┘
```

---

## 📂 Struktur File yang Berubah

### Diperbarui:
- `src/app/data.ts` - Tambahan field promo di interface Product
- `src/app/pages/home.tsx` - Komponən renderPriceDisplay, PolaroidCard update
- `scripts/generate_products.cjs` - Update folderToCategory mapping

### Baru Dibuat:
- `src/app/promo-config.ts` - Konfigurasi promo (mudah di-edit!)

---

## 🚀 Next Steps (Opsional)

Untuk deploy ke live, jalankan:

```bash
npm run build
npm run preview
```

Atau deploy ke Vercel:
```bash
npm run build && vercel
```

---

## 💡 Tips

1. **Harga Promo harus lebih rendah** dari harga original, jika tidak promo tidak ditampilkan
2. **Label opsional** - jika tidak ada, otomatis terisi "PROMO"
3. **Regenerasi produk** setelah perubahan:
   ```bash
   node scripts/generate_products.cjs
   ```
4. **Clear localStorage** jika cache lama mengganggu (buka DevTools → Application → localStorage → hapus `elbouquet_products_v1`)

---

## 📝 Catatan Teknis

- Promo hanya berjalan di runtime (tidak mempengaruhi generated_products.ts)
- Sistem backward compatible - produk lama tetap berfungsi normal
- Promo info disimpan di setiap product object saat diakses
- Semua styling responsive dan mobile-friendly

---

**Status**: ✅ Semua task selesai!
- ✅ Logo ganti
- ✅ Kategorisasi perbaiki  
- ✅ Naming standardize
- ✅ Promo system aktif
- ✅ Hero section update

**Build Status**: ✅ Berhasil (127 produk, no errors)
