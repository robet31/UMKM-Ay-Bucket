// ================================================================
// PROMO CONFIG - DEMO EXAMPLES
// File ini hanya contoh dan dibuat aman untuk TypeScript.
// Un-comment contoh yang dibutuhkan untuk mengaktifkan promo.
// ================================================================

type PromoConfigItem = {
  originalPrice: number;
  promoPrice: number;
  label?: string;
};

export const PROMO_CONFIG: Record<string, PromoConfigItem> = {
  // "Akrilik frame mini": {
  //   originalPrice: 150000,
  //   promoPrice: 95000,
  //   label: "FLASH SALE 37%",
  // },
  // "Selempang Wisuda 3 Titik": {
  //   originalPrice: 120000,
  //   promoPrice: 85000,
  //   label: "PROMO SPESIAL WISUDA",
  // },
  // "Mawar Candy (Bunga Asli)": {
  //   originalPrice: 220000,
  //   promoPrice: 170000,
  //   label: "EARLY BIRD 23%",
  // },
  // "Peony rose medium": {
  //   originalPrice: 120000,
  //   promoPrice: 80000,
  //   label: "LIMITED TIME OFFER",
  // },
};

export function applyPromoToProduct(product: { name: string; [key: string]: any }) {
  const promoConfig = PROMO_CONFIG[product.name];

  if (!promoConfig) {
    return product;
  }

  const discountPercent = Math.round(
    ((promoConfig.originalPrice - promoConfig.promoPrice) / promoConfig.originalPrice) * 100,
  );

  return {
    ...product,
    isPromo: true,
    originalPrice: promoConfig.originalPrice,
    promoLabel: promoConfig.label || "PROMO",
    price: promoConfig.promoPrice,
    priceLabel: `Rp ${promoConfig.promoPrice.toLocaleString("id-ID")}`,
    _discount_percent: discountPercent,
  };
}

/*
Cara tambah promo:
1. Buka /src/app/generated_products.ts
2. Copy nama produk persis
3. Tambahkan entry di PROMO_CONFIG
4. Isi originalPrice, promoPrice, dan label bila perlu

Tips:
- Gunakan angka tanpa Rp dan titik.
- Promo muncul hanya jika originalPrice > promoPrice.
- File ini aman untuk TypeScript meski semua contoh masih di-comment.
*/
