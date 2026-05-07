const data = require('./src/app/generated_products.ts').generatedInitialProducts;

// Group by name caseless
const byName = {};
data.forEach(p => {
  const key = p.name.toLowerCase().trim();
  if(!byName[key]) byName[key] = [];
  byName[key].push(p);
});

// Find duplicates
const dupes = Object.entries(byName).filter(([name, products]) => products.length > 1);

console.log('\n=== ANALISIS DUPLIKASI PRODUK ===');
console.log(`Total produk: ${data.length}`);
console.log(`Duplikasi ditemukan: ${dupes.length}\n`);

dupes.forEach(([name, products]) => {
  console.log(`📌 "${name}" - ${products.length} items:`);
  products.forEach(p => {
    const imgCount = p.images ? p.images.length : 1;
    console.log(`   - ${p.id} | ${imgCount} gambar | Rp ${p.price}`);
  });
  console.log('');
});
