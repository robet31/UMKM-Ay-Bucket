# 📋 PLANNING — Tambah Produk Baru & Sesuaikan Kategori

> **Tanggal:** 8 Mei 2026  
> **Status:** 🔲 Menunggu Persetujuan

---

## 🎯 Objective

Menambahkan **58 produk baru** dari folder `BARU TAMBAH ATAU SESAUIKAN KATEGORI PRODUKNYA` ke dalam website, **menyesuaikan kategori** produk yang sudah ada, menambahkan **harga & keterangan** (Pre-Order, dll), dan memastikan **semua asset gambar** dari 22 folder sudah masuk ke web.

---

## 📊 AUDIT: Status Asset yang SUDAH Ada Sebelum Penambahan Baru

### ✅ Angka Penting (Sebelum Update)

| Komponen | Jumlah | Keterangan |
|----------|--------|------------|
| Folder asset sumber (ASSETS-AY BUCKET) | 22 | 20 berisi gambar, 1 kosong (Bucket Aesthetic), 1 folder baru |
| Total gambar di 20 folder lama | **127** | Tidak termasuk 58 baru & folder kosong |
| Gambar di `public/assets/` | **256 PNG** | 127 asli + 127 duplikat (`-1.png`) + 2 non-produk |
| Entry di `asset_index.ts` | **127** | ✅ Match 100% dengan 127 gambar sumber |
| Entry di `generated_products.ts` | **127** | ✅ Match 100% (1 entry per gambar) |
| Produk unik (setelah merge name+price) | **36** | Sistem merge otomatis: gambar sama nama+harga → 1 produk |

### ✅ Kesimpulan: Semua 127 gambar dari 20 folder SUDAH masuk ke web

> **Ya, semua asset dari folder-folder yang sudah ada (sebelum folder BARU) sudah 100% masuk ke website.** Setiap gambar sudah:
> 1. ✅ Di-copy ke `public/assets/`
> 2. ✅ Terdaftar di `asset_index.ts` (127 path)
> 3. ✅ Punya entry produk di `generated_products.ts` (127 entry)
> 4. ✅ Format penamaan sudah sesuai: `NamaProduk - Rp Harga - Deskripsi.png`

### 📋 Detail Per Folder (Sudah Ada)

| # | Folder Sumber | Gambar | Produk Unik | Kategori Saat Ini | Status |
|---|---------------|--------|-------------|--------------------|--------|
| 1 | Akrilik frame mini | 10 | 1 (Akrilik frame mini, Rp 95k) | accessories | ✅ OK |
| 2 | Bucket Aesthetic | 0 | - | - | ⚠️ Folder kosong |
| 3 | Bucket Bunga Gradoll Big Mesh | 3 | 1 (Rp 170k) | buckets | ✅ OK |
| 4 | Bucket Bunga Mawar Medium | 5 | 1 (Bunga Mawar Medium, Rp 100k) | buckets | ⚠️ Harusnya `fresh-flower` |
| 5 | Buket Cilla Estetik Mesh | 4 | 1 (Rp 150k) | buckets | ✅ OK |
| 6 | Buket skripsi glitter 20 tangkai | 5 | 1 (Rp 170k) | buckets | ✅ OK |
| 7 | Bunga Mawar Palsu | 12 | 2 (Big Rp 250k + Small Rp 50k) | artificial-flower | ✅ OK |
| 8 | Bunga White Sedap | 3 | 1 (Rp 125k) | fresh-flower | ✅ OK |
| 9 | Donat Bucket Tart | 3 | 1 (Rp 100k) | snack-bouquet | ✅ OK |
| 10 | Frame Birthday Edelweis | 4 | 1 (Rp 150k) | catalog-home | ⚠️ Harusnya `accessories` |
| 11 | Karangan Bunga | 12 | 5 (1 Titik Rp 500k, 2 Titik Rp 600k, 3 Titik Rp 750k, 4 Titik Rp 1jt, Full Mega Rp 2jt) | wreaths | ✅ OK |
| 12 | Luxury Bucket | 8 | 4 (Buket Asli Rp 350k, Mawar Candy Big Rp 200k, Round Dior Mahkota Rp 350k, Round Dior non Mahkota Rp 320k) | buckets | ✅ OK |
| 13 | Mawar Candy (Bunga Asli) | 2 | 1 (Rp 170k) | fresh-flower | ✅ OK |
| 14 | packing Luxury Elegant | 3 | 1 (Rp 25k) | packaging | ✅ OK |
| 15 | Peony Rose Medium | 4 | 1 (Rp 80k) | artificial-flower | ✅ OK |
| 16 | Rose Gonie Pink | 2 | 1 (Rp 120k) | artificial-flower | ✅ OK |
| 17 | Selempang List Pita | 4 | 2 (Selempang Rp 75k + Round Pita Satin Rp 100k) | ribbons | ✅ OK |
| 18 | Selempang Wisuda 3 Titik | 10 | 2 (3 Titik Rp 95k + 3 Titik Garis Rp 105k) | ribbons | ✅ OK |
| 19 | Sewa Per Jam Standing Akrilik Bulat | 6 | 1 (Sewa Standing Bulat) | sewa | ✅ OK |
| 20 | Sewa Standing Akrilik (PROMO) | 10 | 1 (Rp 40k) | sewa | ✅ OK |
| 21 | Standing Akrilik | 17 | 6 (Baby Blue, Blue Gold, Dusty Blue, Marble Pink, Persegi Orange, Dome — Rp 65-70k) | accessories ⚠️ | ⚠️ Harusnya `sewa` |

### ⚠️ Distribusi Kategori Saat Ini (127 entries, 36 produk unik)

| Kategori | Jumlah Entry | Jumlah Produk Unik |
|----------|-------------|-------------------|
| accessories | 27 | 8 (Akrilik mini + 6 Standing + 1 Persegi) |
| artificial-flower | 18 | 4 (Mawar Big, Mawar Small, Peony, Rose Gonie) |
| buckets | 25 | 7 (Gradoll, Mawar Medium, Cilla, Skripsi, Asli Premium, Dior Mahkota/non) |
| catalog-home | 4 | 1 (Frame Birthday — **SALAH KATEGORI**) |
| fresh-flower | 5 | 2 (Bunga White Sedap, Mawar Candy) |
| packaging | 3 | 1 (Packing Luxury) |
| ribbons | 14 | 4 (Selempang List Pita, Round Satin, 3 Titik, 3 Titik Garis) |
| sewa | 16 | 2 (Sewa Standing PROMO, Sewa Standing Bulat) |
| snack-bouquet | 3 | 1 (Donat Buket Tart) |
| wreaths | 12 | 5 (Karangan 1-4 Titik + Full Mega) |
| **TOTAL** | **127** | **36** |

### 🔴 Masalah Kategori Yang Perlu Diperbaiki

| Produk | Kategori SALAH | Kategori BENAR | Jumlah Entry |
|--------|---------------|----------------|-------------|
| Standing akrilik bulat | `accessories` | `sewa` | 3 entry |
| Standing akrilik Dome | `accessories` | `sewa` | 6 entry |
| Bunga Mawar Medium | `buckets` | `fresh-flower` | 5 entry |
| Frame Birthday Edelweis | `catalog-home` | `accessories` | 4 entry |
| **Total yang salah** | | | **18 entry** |

---

## 🆕 Produk BARU dari Folder `BARU TAMBAH ATAU SESAUIKAN KATEGORI PRODUKNYA` (58 gambar)

| # | Nama Produk | Harga | Kategori | Keterangan | Gambar |
|---|-------------|-------|----------|------------|--------|
| 1 | Bloom Box Bule Gold | Rp 200.000 | 🎀 Bloom Box | - | 1 |
| 2 | Bloom Box Disgompie | Rp 190.000 | 🎀 Bloom Box | - | 1 |
| 3 | Bloom Box Disianthus | Rp 200.000 | 🎀 Bloom Box | - | 1 |
| 4 | Bloom Box Gompie | Rp 250.000 | 🎀 Bloom Box | - | 1 |
| 5 | Bloom Box Lili Rose | Rp 170.000 | 🎀 Bloom Box | - | 1 |
| 6 | Bloom Box Lily Kris | Rp 180.000 | 🎀 Bloom Box | - | 1 |
| 7 | Bloom Box MarieGold | Rp 200.000 | 🎀 Bloom Box | - | 1 |
| 8 | Bloom Box Medium + Akrilik | Rp 200.000 | 🎀 Bloom Box | - | 1 |
| 9 | Bucket Rokok + Kopi | Chat Admin | 🎁 Bucket Unik | - | 1 |
| 10 | Bucket Rokok 5 Pcs | Chat Admin | 🎁 Bucket Unik | - | 1 |
| 11 | Bucket Rokok 6 Pcs | Chat Admin | 🎁 Bucket Unik | - | 1 |
| 12 | Bucket Rokok Love | Chat Admin | 🎁 Bucket Unik | **Pre Order** | 1 |
| 13 | Bucket Shine Muscat | Rp 150.000 | 🍭 Snack & Food Bouquet | - | 1 |
| 14 | Bucket Uang Berdiri + Fresh Flowers | Chat Admin | 💸 Money Bouquet | - | 1 |
| 15 | Bucket Uang Berdiri 30 Lembar | Chat Admin | 💸 Money Bouquet | - | 1 |
| 16 | Bucket Uang Kipas + Fresh Flowers | Chat Admin | 💸 Money Bouquet | - | 1 |
| 17 | Buket Kawat | Chat Admin | 🌸 Buket Bunga Premium | **Pre Order (PO H-7)** | 1 |
| 18 | Buket Skripsi | Chat Admin | 🌸 Buket Bunga Premium | **Pre Order (PO H-7)** | 1 |
| 19 | Bunga Artificial MIX | Rp 50.000 | 🌼 Bunga Artificial | - | 1 |
| 20 | Flowers Sash Ayca | Rp 150.000 | ✨ Gift & Accessories | - | 1 |
| 21 | Hand-Bucket Anggrek Lily | Rp 450.000 | 🌹 Bunga Segar (Fresh) | - | 1 |
| 22 | Hand-Bucket Anthurium | Rp 425.000 | 🌹 Bunga Segar (Fresh) | - | 1 |
| 23 | Hand-Bucket Artificial | Rp 150.000 | 🌼 Bunga Artificial | - | 1 |
| 24 | Hand-Bucket Pearl White | Rp 120.000 | 🌼 Bunga Artificial | - | 1 |
| 25 | Hand-Bucket Rose | Rp 300.000 | 🌹 Bunga Segar (Fresh) | - | 1 |
| 26 | Hand-Bucket Sofy | Rp 280.000 | 🌸 Buket Bunga Premium | - | 1 |
| 27 | Kawat Bulu Lily | Rp 130.000 | 🌼 Bunga Artificial | - | 1 |
| 28 | Pinky Pearl (Fresh Flowers) | Rp 500.000 | 🌹 Bunga Segar (Fresh) | - | 1 |
| 29 | Round Bucket Aisyah | Rp 200.000 | 🌸 Buket Bunga Premium | - | 1 |
| 30 | Round Bucket Rose | Rp 150.000 | 🌸 Buket Bunga Premium | - | 1 |
| 31 | Round Bucket Viphone | Rp 250.000 | 🌸 Buket Bunga Premium | iPhone dari Customer | 1 |
| 32 | Round Pita Satin 8 Tangkai | Rp 150.000 | 🌸 Buket Bunga Premium | - | 1 |
| 33 | Sewa Kostum Kayla (Var 1) | Start Rp 300.000 | ⏱️ Sewa (Rental) | Harga mulai dari | 1 |
| 34 | Sewa Kostum Kayla (Var 2) | Start Rp 350.000 | ⏱️ Sewa (Rental) | Harga mulai dari | 1 |
| 35 | Standing Akrilik Bulat (Baru-1) | Chat Admin | ⏱️ Sewa (Rental) | - | 1 |
| 36 | Standing Akrilik Bulat (Baru-2) | Chat Admin | ⏱️ Sewa (Rental) | - | 1 |
| 37 | Tabung Boneka isi Perhiasan | Chat Admin | 🎁 Bucket Unik | **Pre Order** | 1 |
| 38 | Thmbelina Miuw (350k) | Rp 350.000 | 💐 Thumbelina Series | - | 1 |
| 39 | Thumbelina Aycaa | Rp 350.000 | 💐 Thumbelina Series | - | 1 |
| 40 | Thumbelina Ayu | Rp 150.000 | 💐 Thumbelina Series | - | 1 |
| 41 | Thumbelina Bebebb | Rp 400.000 | 💐 Thumbelina Series | - | 1 |
| 42 | Thumbelina BlueBaby | Rp 180.000 | 💐 Thumbelina Series | - | 1 |
| 43 | Thumbelina Butterfly Holo | Rp 400.000 | 💐 Thumbelina Series | - | 1 |
| 44 | Thumbelina Duolily | Rp 300.000 | 💐 Thumbelina Series | - | 1 |
| 45 | Thumbelina Faza | Rp 135.000 | 💐 Thumbelina Series | - | 1 |
| 46 | Thumbelina Kriwil | Rp 200.000 | 💐 Thumbelina Series | - | 1 |
| 47 | Thumbelina Lily Love | Rp 180.000 | 💐 Thumbelina Series | - | 1 |
| 48 | Thumbelina Mini Rose | Rp 100.000 | 💐 Thumbelina Series | - | 1 |
| 49 | Thumbelina Miuw (300k) | Rp 300.000 | 💐 Thumbelina Series | - | 1 |
| 50 | Thumbelina Nanat | Chat Admin | 💐 Thumbelina Series | - | 1 |
| 51 | Thumbelina Ntan Fresh Flowers | Rp 500.000 | 💐 Thumbelina Series | Menggunakan bunga segar | 1 |
| 52 | Thumbelina Round | Rp 250.000 | 💐 Thumbelina Series | - | 1 |
| 53 | Thumbelina Round Lily | Rp 250.000 | 💐 Thumbelina Series | - | 1 |
| 54 | Thumbelina Sassy | Rp 100.000 | 💐 Thumbelina Series | - | 1 |
| 55 | Thumbelina Small | Rp 100.000 | 💐 Thumbelina Series | - | 1 |
| 56 | Thumbelina Sofi | Rp 220.000 | 💐 Thumbelina Series | - | 1 |
| 57 | Vas Keranjang Loveely (Bunga Import) | Rp 500.000 | 🏺 Vas & Dekorasi | Bunga import premium | 1 |
| 58 | Vas Lily Premium | Rp 400.000 | 🏺 Vas & Dekorasi | - | 1 |

---

## 🏷️ Sistem Kategori (Setelah Update)

### Kategori Tetap
| Key | Label | Emoji | Produk Lama | Produk Baru |
|-----|-------|-------|-------------|-------------|
| `buckets` | Buket Bunga Premium | 🌸 | 5 | +6 = 11 |
| `snack-bouquet` | Snack & Food Bouquet | 🍭 | 1 | +1 = 2 |
| `money-bouquet` | Money Bouquet | 💸 | 0 | +3 = 3 |
| `wreaths` | Bunga Papan & Standing | 🌿 | 5 | 0 = 5 |
| `accessories` | Gift & Accessories | ✨ | 2 (+1 pindahan) | +1 = 4 |
| `fresh-flower` | Bunga Segar (Fresh) | 🌹 | 2 (+1 pindahan) | +4 = 7 |
| `artificial-flower` | Bunga Artificial | 🌼 | 4 | +4 = 8 |
| `sewa` | Sewa (Rental) | ⏱️ | 2 (+2 pindahan) | +4 = 8 |
| `packaging` | Packing & Gift Box | 📦 | 1 | 0 = 1 |
| `ribbons` | Selempang & Pita | 🎀 | 4 | 0 = 4 |

### 🆕 Kategori BARU
| Key | Label | Emoji | Produk Baru |
|-----|-------|-------|-------------|
| `bloom-box` | Bloom Box | 🎀 | 8 |
| `thumbelina` | Thumbelina Series | 💐 | 19 |
| `bucket-unik` | Bucket Unik & Kreasi | 🎁 | 5 |
| `vas-dekorasi` | Vas & Dekorasi | 🏺 | 2 |

---

## 🔄 Penyesuaian Kategori Produk Lama (18 entries)

| Produk | Kategori SALAH | → Kategori BENAR | Entry |
|--------|---------------|-------------------|-------|
| Standing akrilik bulat (3 varian) | `accessories` | → `sewa` | 3 |
| Standing akrilik Dome (6 varian) | `accessories` | → `sewa` | 6 |
| Bunga Mawar Medium (5 gambar) | `buckets` | → `fresh-flower` | 5 |
| Frame Birthday Edelweis (4 gambar) | `catalog-home` | → `accessories` | 4 |

---

## 📝 Langkah Implementasi

### Phase 1: Copy 58 Asset Gambar Baru ke `public/assets/`
### Phase 2: Update `asset_index.ts` (+58 path baru)
### Phase 3: Update `generated_products.ts` (+58 produk baru + fix 18 kategori lama)
### Phase 4: Update `data.ts` (tambah 4 kategori baru + update `ProductCategory` type)
### Phase 5: Testing Lokal (`npm run dev`)
### Phase 6: Git Push → Vercel Deploy

---

## ⚙️ Aturan Penting

1. **Produk Sama = 1 Entry, Banyak Gambar**: Merge by name+price → 1 produk, array `images[]`
2. **Harga "Chat Admin"**: `price: 0`, `priceLabel: "Chat Admin"`
3. **Pre Order**: `tag: "Pre Order"` + deskripsi
4. **Promo**: `isPromo: true` + `promoLabel`
5. **Deskripsi**: Dari info di nama file (bahan, ukuran, isi, dll)

---

## 📊 Ringkasan Final

| Metrik | Sebelum | Sesudah |
|--------|---------|---------|
| Total gambar di `public/assets/` | 127 | **185** (+58) |
| Entry di `asset_index.ts` | 127 | **185** (+58) |
| Entry di `generated_products.ts` | 127 | **185** (+58) |
| Produk unik (setelah merge) | 36 | **~94** (+58 baru) |
| Kategori | 8 aktif (+2 jarang) | **12** (+4 baru) |
| Produk dengan kategori salah | 18 | **0** (diperbaiki) |
