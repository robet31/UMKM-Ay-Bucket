// ================================================================
// PROMO CONFIG - DEMO EXAMPLES
// Uncomment dan sesuaikan untuk mengaktifkan promo di products
// ================================================================

/**
 * CONTOH SETUP PROMO
 * 
 * Struktur:
 * {
 *   "Nama Produk Sesuai File": {
 *     originalPrice: [harga asli],
 *     promoPrice: [harga promo],
 *     label: "[optional] Text label untuk promo"
 *   }
 * }
 * 
 * Catatan:
 * - Nama produk HARUS SAMA dengan nama di file produk
 * - Harga harus berupa angka (tidak perlu Rp atau titik ribuan)
 * - Label opsional, jika kosong akan terisi "PROMO"
 * - Promo hanya muncul jika originalPrice > promoPrice
 */

export const PROMO_CONFIG = {
  // ═══════════════════════════════════════════════════════════
  // CONTOH 1: Akrilik Frame Mini - Flash Sale
  // ═══════════════════════════════════════════════════════════
  // Uncomment untuk aktifkan:
  /*
  "Akrilik frame mini": {
    originalPrice: 150000,
    promoPrice: 95000,
    label: "FLASH SALE 37%"
  },
  */

  // ═══════════════════════════════════════════════════════════
  // CONTOH 2: Selempang Wisuda - Promo Spesial
  // ═══════════════════════════════════════════════════════════
  // Uncomment untuk aktifkan:
  /*
  "Selempang Wisuda 3 Titik": {
    originalPrice: 120000,
    promoPrice: 85000,
    label: "PROMO SPESIAL WISUDA"
  },
  */

  // ═══════════════════════════════════════════════════════════
  // CONTOH 3: Mawar Candy - Early Bird Discount
  // ═══════════════════════════════════════════════════════════
  // Uncomment untuk aktifkan:
  /*
  "Mawar Candy (Bunga Asli)": {
    originalPrice: 220000,
    promoPrice: 170000,
    label: "EARLY BIRD 23%"
  },
  */

  // ═══════════════════════════════════════════════════════════
  // CONTOH 4: Peony Rose Medium - Limited Time
  // ═══════════════════════════════════════════════════════════
  // Uncomment untuk aktifkan:
  /*
  "Peony rose medium": {
    originalPrice: 120000,
    promoPrice: 80000,
    label: "LIMITED TIME OFFER"
  },
  */

  // ═══════════════════════════════════════════════════════════
  // TEMPLATE UNTUK MENAMBAH PROMO BARU
  // ═══════════════════════════════════════════════════════════
  /*
  "[NAMA PRODUK DI FILE]": {
    originalPrice: [HARGA ASLI],
    promoPrice: [HARGA BARU],
    label: "[LABEL PROMO]"
  },
  */
};

// ════════════════════════════════════════════════════════════
// AUTO-APPLY PROMO FUNCTION (jangan diubah)
// ════════════════════════════════════════════════════════════

export function applyPromoToProduct(product) {
  const promoConfig = PROMO_CONFIG[product.name];

  if (!promoConfig) {
    return product; // Tidak ada promo, return product normal
  }

  // Calculate discount percentage
  const diskoun = Math.round(
    ((promoConfig.originalPrice - promoConfig.promoPrice) /
      promoConfig.originalPrice) *
      100
  );

  return {
    ...product,
    isPromo: true,
    originalPrice: promoConfig.originalPrice,
    promoLabel: promoConfig.label || "PROMO",
    price: promoConfig.promoPrice,
    priceLabel: `Rp ${promoConfig.promoPrice.toLocaleString("id-ID")}`,
    // Tambahan info untuk debugging:
    _discount_percent: diskoun,
  };
}

// ════════════════════════════════════════════════════════════
// STEP-BY-STEP GUIDE: Cara Menambah Promo
// ════════════════════════════════════════════════════════════
/*

STEP 1: Tentukan Produk
  - Lihat list produk di /src/app/generated_products.ts
  - Copy nama produk PERSIS (case-sensitive!)
  - Misal: "Akrilik frame mini"

STEP 2: Tentukan Harga
  - Original Price: berapa harga normalnya? (biasanya dari priceLabel)
  - Promo Price: berapa harga diskon? (yang ingin dijual)
  - Discount otomatis dihitung: (ori - promo) / ori * 100%

STEP 3: Tambah ke PROMO_CONFIG
  "Akrilik frame mini": {
    originalPrice: 150000,
    promoPrice: 95000,
    label: "PROMO SPECIAL"
  },

STEP 4: Simpan file

STEP 5: Refresh browser (atau reload dev server)

STEP 6: Cek di halaman - Anda akan lihat:
  - Harga lama dengan garis coret
  - Badge merah dengan persentase diskon
  - Harga baru yang menonjol

*/

// ════════════════════════════════════════════════════════════
// TIPS & TRICKS
// ════════════════════════════════════════════════════════════
/*

✅ UNTUK MENONAKTIFKAN PROMO:
   - Hapus atau comment (/* ... */) entry di PROMO_CONFIG
   - Atau ubah originalPrice = promoPrice

✅ UNTUK MENGAKTIFKAN SEMUA PROMO:
   - Uncomment semua contoh di atas
   - Refresh page

✅ UNTUK CARI NAMA PRODUK YANG BENAR:
   - Buka DevTools (F12)
   - Console: search nama di ASSETS-AY BUCKET
   - Atau buka src/app/generated_products.ts dan cari

✅ DISKON OTOMATIS DIHITUNG:
   - Anda hanya perlu set originalPrice & promoPrice
   - System otomatis hitung persentasenya
   - Contoh: Rp 150.000 → Rp 95.000 = -37%

✅ MOBILE RESPONSIVE:
   - Promo display sudah responsive
   - Terlihat baik di semua ukuran layar

✅ PROMO TIDAK MUNCUL JIKA:
   - Nama produk tidak cocok (typo)
   - originalPrice <= promoPrice
   - Produk tidak ada di PROMO_CONFIG

*/
