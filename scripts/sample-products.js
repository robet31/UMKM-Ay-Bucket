#!/usr/bin/env node
import fs from 'fs';

const catalog = JSON.parse(fs.readFileSync('./public/assets/catalog-index.json', 'utf8'));

const byCategory = {};
catalog.forEach(p => {
  if (!byCategory[p.category]) byCategory[p.category] = [];
  byCategory[p.category].push(p);
});

console.log('\n🎯 CURATED PRODUCT SAMPLES FOR MERGE:\n');

const samples = [];

Object.entries(byCategory).forEach(([category, items]) => {
  console.log(`📦 ${category} (${items.length} total):`);
  // Take first unique (different source folder)
  const unique = [];
  const seen = new Set();
  items.forEach(item => {
    if (!seen.has(item.sourceFolder)) {
      seen.add(item.sourceFolder);
      unique.push(item);
      if (unique.length <= 2) {
        console.log(`  ✓ ${item.sourceFolder}`);
        console.log(`    Price: ${item.priceLabel} | ${item.description.substring(0, 50)}...`);
        samples.push(item);
      }
    }
  });
  console.log('');
});

console.log(`\n📊 TOTAL UNIQUE ITEMS TO MERGE: ${samples.length}`);
console.log(`   (Sampling 1-2 per category for variety)\n`);

// Export merged data
const mergedProducts = samples.map((p, idx) => ({
  by: {
    userId: p.sourceFolder.toLowerCase().includes('luxury') ? 'merchant-premium' : 'merchant-standard',
    name: p.sourceFolder.split(' ')[0],
  },
  created: '2026-05-03',
  description: p.description,
  likes: 0,
  id: `ay-product-${idx + 1}`,
  isStarred: idx < 3, // Star first 3 for showcase
  images: [
    {
      url: `/assets/${p.filename}`,
      caption: p.alt,
    },
  ],
  items: [
    {
      type: p.category,
      name: p.sourceFolder,
      count: 1,
    },
  ],
  source: p.sourceFolder,
  price: `Rp ${(p.price / 1000).toLocaleString('id-ID')}K`,
  tags: [p.category, 'ready-order'],
}));

fs.writeFileSync('./scripts/curated-products-merge.json', JSON.stringify(mergedProducts, null, 2));
console.log('✅ Curated products saved to: scripts/curated-products-merge.json');
