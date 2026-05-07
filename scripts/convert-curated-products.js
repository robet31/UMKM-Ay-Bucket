#!/usr/bin/env node
import fs from 'fs';

const curated = JSON.parse(fs.readFileSync('./scripts/curated-products-merge.json', 'utf8'));

const products = curated.map((p, idx) => {
  const imageUrl = p.images[0].url;
  const category = p.items[0]?.type || 'catalog-home';
  
  // Extract price label from description
  const priceMatch = p.description.match(/Rp ([\d.]+)/);
  const priceLabel = priceMatch ? `Rp ${priceMatch[1]}` : p.price;
  
  // Extract numeric price
  let price = 0;
  if (priceMatch) {
    const numStr = priceMatch[1].replace(/\./g, '').replace(',', '');
    price = parseInt(numStr, 10);
  }
  
  // Create product name from source
  const name = p.source
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');

  return {
    id: `ay-${category}-${idx + 1}`,
    name,
    category,
    price,
    priceLabel,
    image: imageUrl,
    tag: idx < 3 ? "Favorit Kami" : undefined,
  };
});

// Generate TypeScript code
let tsCode = `
  // ======= AY BUKET — CURATED PREMIUM COLLECTION (${products.length} items) =======\n`;

products.forEach(p => {
  const tagStr = p.tag ? `, tag: "${p.tag}"` : '';
  tsCode += `  { id: "${p.id}", name: "${p.name}", category: "${p.category}", price: ${p.price}, priceLabel: "${p.priceLabel}", image: "${p.image}"${tagStr} },\n`;
});

// Write to output
fs.writeFileSync('./scripts/curated-products-typesafe.ts', tsCode);

console.log('✅ Converted products for data.ts');
console.log(`📦 Total products: ${products.length}`);
console.log(`📄 Output file: scripts/curated-products-typesafe.ts`);
console.log('\n📋 Preview (first 3):');
console.log(products.slice(0, 3).map(p => `  ${p.name} | ${p.priceLabel}`).join('\n'));
console.log('\n💾 Ready to copy-paste into src/app/data.ts initialProducts array');
