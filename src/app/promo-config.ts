// Promo Configuration - Edit this file to add/update promos
// Format: { productName: { originalPrice: number, promoPrice: number, label?: string } }

export const PROMO_CONFIG: Record<string, { originalPrice: number; promoPrice: number; label?: string }> = {
  // Example promo:
  // "Akrilik frame mini": {
  //   originalPrice: 150000,
  //   promoPrice: 95000,
  //   label: "PROMO SPESIAL 35%"
  // },

  // Add your promos below:
};

export function applyPromoToProduct(product: any): any {
  const promoConfig = PROMO_CONFIG[product.name];

  if (!promoConfig) {
    return product;
  }

  return {
    ...product,
    isPromo: true,
    originalPrice: promoConfig.originalPrice,
    promoLabel: promoConfig.label || "PROMO",
    price: promoConfig.promoPrice,
    priceLabel: `Rp ${promoConfig.promoPrice.toLocaleString('id-ID')}`,
  };
}
