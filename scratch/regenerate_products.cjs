/**
 * Regenerate generated_products.ts by scanning the ACTUAL files in public/assets/
 * and mapping them to products. This ensures 100% path accuracy.
 */
const fs = require('fs');
const path = require('path');

const ASSETS_DIR = path.join(__dirname, '..', 'public', 'assets');
const OUTPUT_FILE = path.join(__dirname, '..', 'src', 'app', 'generated_products.ts');

// Read all actual asset files
const allFiles = fs.readdirSync(ASSETS_DIR)
  .filter(f => /\.(png|jpg|jpeg|webp|gif)$/i.test(f))
  .sort();

console.log(`Found ${allFiles.length} asset files in public/assets/`);

// Category definitions with keywords for auto-classification
const categoryDefs = [
  { key: 'accessories', label: 'Aksesoris', keywords: ['akrilik frame', 'frame birthday'], descDefault: 'Aksesori custom yang rapi dan estetik untuk hadiah personal.' },
  { key: 'artificial-flower', label: 'Bunga Artificial', keywords: ['bunga artificial', 'bunga mawar palsu', 'kawat bulu', 'peony rose', 'rose gonie', 'bunga mawar palsu small'], descDefault: 'Bunga artificial premium yang awet dan tetap menawan.' },
  { key: 'bloom-box', label: 'Bloom Box', keywords: ['bloom box'], descDefault: 'Rangkaian bunga dalam kotak premium (bloom box), cocok untuk hadiah ulang tahun & anniversary.' },
  { key: 'bucket-unik', label: 'Bucket Unik', keywords: ['bucket rokok', 'tabung boneka', 'bucket shine muscat'], descDefault: 'Kreasi bucket unik dan anti-mainstream, hadiah yang berbeda dari biasanya.' },
  { key: 'buckets', label: 'Buckets', keywords: ['buket bunga', 'buket cilla', 'buket kawat', 'buket skripsi', 'hand-bucket', 'round bucket', 'round elegant'], descDefault: 'Rangkaian bucket premium dengan komposisi yang elegan.' },
  { key: 'fresh-flower', label: 'Bunga Segar', keywords: ['bunga mawar medium', 'bunga white sedap', 'mawar candy', 'pinky pearl'], descDefault: 'Rangkaian bunga segar pilihan dengan nuansa mewah.' },
  { key: 'money-bouquet', label: 'Money Bouquet', keywords: ['bucket uang'], descDefault: 'Hadiah eksklusif berupa buket uang dengan dekorasi bunga yang cantik.' },
  { key: 'snack-bouquet', label: 'Snack Bouquet', keywords: ['donat buket'], descDefault: 'Buket snack & makanan kreatif, cocok untuk kejutan unik.' },
  { key: 'packaging', label: 'Packaging', keywords: ['packing luxury'], descDefault: 'Packing premium untuk melengkapi hadiah Anda.' },
  { key: 'ribbons', label: 'Selempang & Pita', keywords: ['flowers sash', 'round pita satin', 'selempang'], descDefault: 'Selempang & pita wisuda berkualitas untuk melengkapi momen spesial.' },
  { key: 'sewa', label: 'Sewa', keywords: ['akrilik bulat', 'akrilik marble', 'akrilik persegi', 'sewa kostum', 'sewa standing', 'standing akrilik'], descDefault: 'Layanan sewa standing akrilik & dekorasi untuk segala acara.' },
  { key: 'wreaths', label: 'Karangan Bunga', keywords: ['karangan bunga'], descDefault: 'Karangan bunga papan untuk berbagai acara.' },
  { key: 'thumbelina', label: 'Thumbelina', keywords: ['thumbelina', 'thmbelina'], descDefault: 'Koleksi Thumbelina — miniatur buket cantik untuk hadiah spesial.' },
  { key: 'vas-dekorasi', label: 'Vas & Dekorasi', keywords: ['vas keranjang', 'vas lily'], descDefault: 'Vas bunga premium dan dekorasi untuk mempercantik ruangan.' },
];

// Extract product name from filename
function extractProductName(filename) {
  // Remove extension
  let name = filename.replace(/\.(png|jpg|jpeg|webp|gif)$/i, '');
  // Remove trailing variant numbers like " 2", " 3", " 10"
  name = name.replace(/\s+\d+$/, '');
  // Remove price patterns like "- Rp 95.00000" or "- 200k" or "- 150K"
  name = name.replace(/\s*-\s*Rp\s*[\d.,]+.*$/, '');
  name = name.replace(/\s*-\s*\d+[kK]\s*.*$/, '');
  name = name.replace(/\s*-\s*Start\s*\d+[kK]\s*.*$/, '');
  // Remove description parts after " - " 
  // Actually let's keep it simpler - just get the base product name
  return name.trim();
}

// Get a more aggressive base name for grouping
function getGroupKey(filename) {
  let name = filename.replace(/\.(png|jpg|jpeg|webp|gif)$/i, '');
  // Remove trailing variant numbers
  name = name.replace(/\s+\d+$/, '');
  // For files with descriptions, group by the part before descriptions
  // e.g., "Akrilik frame mini - Rp 95.00000 - description here" -> "Akrilik frame mini - Rp 95.00000"
  
  // Split by " - " and take the first 2 parts (name and price)
  const parts = name.split(/\s+-\s+/);
  if (parts.length >= 2) {
    return parts.slice(0, 2).join(' - ').trim();
  }
  return parts[0].trim();
}

// Group files by product
const productGroups = {};
for (const file of allFiles) {
  const key = getGroupKey(file);
  if (!productGroups[key]) {
    productGroups[key] = [];
  }
  productGroups[key].push(file);
}

console.log(`\nGrouped into ${Object.keys(productGroups).length} product groups:`);

// Determine category for a filename
function getCategory(filename) {
  const lower = filename.toLowerCase();
  for (const cat of categoryDefs) {
    for (const kw of cat.keywords) {
      if (lower.startsWith(kw.toLowerCase()) || lower.includes(kw.toLowerCase())) {
        return cat;
      }
    }
  }
  return { key: 'catalog-home', descDefault: 'Produk pilihan dari Ay Bucket.' };
}

// Extract price from filename
function extractPrice(filename) {
  // Match "Rp XX.00000" pattern
  let match = filename.match(/Rp\s*([\d.,]+)\.00000/);
  if (match) {
    const priceStr = match[1].replace(/\./g, '').replace(/,/g, '');
    return parseInt(priceStr, 10);
  }
  // Match "XXXk" or "XXXK" pattern
  match = filename.match(/[\s-](\d+)[kK][\s.]/);
  if (match) {
    return parseInt(match[1], 10) * 1000;
  }
  match = filename.match(/[\s-](\d+)[kK]$/);
  if (match) {
    return parseInt(match[1], 10) * 1000;
  }
  // Match "Start XXXk"
  match = filename.match(/Start\s*(\d+)[kK]/);
  if (match) {
    return parseInt(match[1], 10) * 1000;
  }
  // Match patterns like "Rp X.XXX.00000"
  match = filename.match(/Rp\s*([\d.]+)\.00000/);
  if (match) {
    const priceStr = match[1].replace(/\./g, '');
    return parseInt(priceStr, 10);
  }
  return 0;
}

// Extract clean product name
function cleanProductName(groupKey) {
  let name = groupKey;
  // Remove price info
  name = name.replace(/\s*-\s*Rp\s*[\d.,]+.*$/, '');
  name = name.replace(/\s*-\s*\d+[kK]\s*$/, '');
  name = name.replace(/\s*-\s*Start\s*\d+[kK]\s*$/, '');
  name = name.replace(/\s*-\s*sewa.*$/i, '');
  name = name.replace(/\s*-\s*harga.*$/i, '');
  return name.trim();
}

// Extract description from filename
function extractDescription(filename, catDesc) {
  let desc = '';
  // Get the part after "Rp XX.00000 - " or "XXk - " or "XXk ."
  let match = filename.match(/Rp\s*[\d.,]+\.00000\s*-\s*(.+?)(?:\s*\d+)?\.(?:png|jpg)/i);
  if (match) {
    desc = match[1].trim();
  }
  if (!match) {
    match = filename.match(/\d+[kK]\s*-\s*(.+?)(?:\s*\d+)?\.(?:png|jpg)/i);
    if (match) {
      desc = match[1].trim();
    }
  }
  
  if (desc) {
    // Clean up the description
    desc = desc.replace(/\s+\d+$/, ''); // Remove trailing number
    // Capitalize first letter
    desc = desc.charAt(0).toUpperCase() + desc.slice(1);
    return catDesc + ' ' + desc + '.';
  }
  return catDesc;
}

// Build product list
const products = [];
let idCounter = {};

for (const [groupKey, files] of Object.entries(productGroups)) {
  const catDef = getCategory(files[0]);
  const catKey = catDef.key;
  
  if (!idCounter[catKey]) idCounter[catKey] = 0;
  idCounter[catKey]++;
  
  const price = extractPrice(files[0]);
  const name = cleanProductName(groupKey);
  const id = `${catKey}-${idCounter[catKey]}`;
  
  // Format price label
  let priceLabel;
  if (price === 0) {
    priceLabel = 'Chat Admin';
  } else {
    priceLabel = 'Rp ' + price.toLocaleString('id-ID');
  }
  
  // Get description from the first file with a description
  let description = catDef.descDefault || '';
  for (const f of files) {
    const extracted = extractDescription(f, '');
    if (extracted) {
      description = catDef.descDefault + ' ' + extracted;
      break;
    }
  }
  
  // Check for tags
  let tag = undefined;
  if (files[0].toLowerCase().includes('pre order') || files[0].toLowerCase().includes('po h')) {
    tag = 'Pre Order';
  }
  if (files[0].toLowerCase().includes('promo')) {
    tag = 'Promo';
  }
  
  // Build images array with /assets/ prefix
  const images = files.map(f => `/assets/${f}`);
  
  const product = {
    id,
    name,
    category: catKey,
    price,
    priceLabel,
    description: description.trim(),
    image: images[0],
    images,
  };
  if (tag) product.tag = tag;
  
  products.push(product);
}

// Sort by category then name
products.sort((a, b) => {
  if (a.category < b.category) return -1;
  if (a.category > b.category) return 1;
  return a.name.localeCompare(b.name);
});

// Re-assign IDs after sorting
idCounter = {};
for (const p of products) {
  if (!idCounter[p.category]) idCounter[p.category] = 0;
  idCounter[p.category]++;
  p.id = `${p.category}-${idCounter[p.category]}`;
}

console.log(`\nGenerated ${products.length} products`);
console.log('\nBy category:');
const catCounts = {};
for (const p of products) {
  catCounts[p.category] = (catCounts[p.category] || 0) + 1;
}
for (const [cat, count] of Object.entries(catCounts)) {
  console.log(`  ${cat}: ${count}`);
}

// Generate TypeScript output
const tsContent = `// GENERATED FILE - do not edit by hand
// Generated: ${new Date().toISOString()}
// Total: ${products.length} unique products from ${allFiles.length} asset files
export const generatedInitialProducts = ${JSON.stringify(products, null, 2)};
`;

fs.writeFileSync(OUTPUT_FILE, tsContent, 'utf-8');
console.log(`\nWrote ${OUTPUT_FILE}`);

// Verify: check that every image path corresponds to an actual file
let missingCount = 0;
for (const p of products) {
  for (const img of p.images) {
    const filePath = path.join(__dirname, '..', 'public', img);
    if (!fs.existsSync(filePath)) {
      console.error(`MISSING FILE: ${img}`);
      missingCount++;
    }
  }
}
if (missingCount === 0) {
  console.log('\n✅ ALL image paths verified - every path maps to a real file!');
} else {
  console.error(`\n❌ ${missingCount} image paths don't map to real files!`);
}
