// Build script: regenerate asset_index.ts and generated_products.ts
const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, 'public', 'assets');

// Get all PNG files (exclude -1 duplicates, logo, import-map)
const allFiles = fs.readdirSync(assetsDir)
  .filter(f => f.endsWith('.png') && !f.endsWith('-1.png') && !f.includes('logo') && !f.includes('import-map') && !f.includes('favicon'))
  .sort();

console.log(`Found ${allFiles.length} unique asset files`);

// Build asset_index.ts
const assetPaths = allFiles.map(f => `/assets/${f}`);
const assetIndexContent = `export const ALL_ASSET_PATHS = [\n${assetPaths.map(p => `    "${p.replace(/&/g, '\\u0026')}"`).join(',\n')}\n] as const;\n`;
fs.writeFileSync(path.join(__dirname, 'src', 'app', 'asset_index.ts'), assetIndexContent);
console.log(`asset_index.ts: ${assetPaths.length} entries written`);

// Parse product info from filename
function parseFilename(filename) {
  // Remove .png extension
  let name = filename.replace(/\.png$/, '');
  
  // Remove duplicate number suffix like (2), (3), etc — but NOT (PO H-7) or (Pre Order) or (PROMO) etc
  name = name.replace(/\s*\((\d+)\)\s*$/, '').trim();
  
  // Extract price from multiple formats:
  let price = 0;
  let priceLabel = '';
  
  // Format 1: "Rp XX.XXX,XX" or "Rp XX.XXX"
  const rpMatch = name.match(/Rp\s*([\d.]+),?\d*/);
  if (rpMatch) {
    const priceStr = rpMatch[1].replace(/\./g, '');
    price = parseInt(priceStr, 10) || 0;
  }
  
  // Format 2: "XXXk" or "XXXK" (shorthand: 200k = Rp 200.000)
  if (price === 0) {
    const kMatch = name.match(/[\s-]+(\d+)[kK]\s*/);
    if (kMatch) {
      price = parseInt(kMatch[1], 10) * 1000;
    }
  }
  
  // Format 3: "Start Rp XXX.XXX" 
  if (price === 0) {
    const startMatch = name.match(/Start\s+Rp\s*([\d.]+)/i);
    if (startMatch) {
      price = parseInt(startMatch[1].replace(/\./g, ''), 10) || 0;
      priceLabel = `Mulai Rp ${price.toLocaleString('id-ID')}`;
    }
  }
  
  // Detect "Start" prefix for "Mulai" pricing
  const hasStartPrefix = /Start\s/i.test(name);
  
  // Build priceLabel
  if (!priceLabel && price > 0) {
    priceLabel = hasStartPrefix 
      ? `Mulai Rp ${price.toLocaleString('id-ID')}` 
      : `Rp ${price.toLocaleString('id-ID')}`;
  }
  
  // Extract product name (before first price marker)
  let productName = name
    .split(/\s*-\s*Rp\s/)[0]       // Split on "- Rp"
    .split(/\s*-\s*\d+[kK]\s*/)[0]  // Split on "- 200k"
    .split(/\s*-\s*Start\s/i)[0]    // Split on "- Start"
    .trim();
  
  // Also try splitting on " - " for description
  let description = '';
  const parts = name.split(/\s*-\s*/);
  if (parts.length > 1) {
    productName = parts[0].trim();
    // Find description (skip price parts)
    const descParts = parts.slice(1).filter(p => 
      !p.match(/^Rp\s/) && 
      !p.match(/^\d+[kK]\s*$/) && 
      !p.match(/^Start\s/i) &&
      !p.match(/^\d+k$/i)
    );
    description = descParts.join('. ').trim();
    // Clean trailing dots and spaces
    description = description.replace(/\.\s*$/, '').trim();
  }
  
  return { productName, price, priceLabel, description };
}

// Category mapping rules
function categorize(productName, filename) {
  const lname = productName.toLowerCase();
  const lfname = filename.toLowerCase();
  
  // Bloom Box
  if (lname.includes('bloom box')) return 'bloom-box';
  
  // Thumbelina
  if (lname.includes('thumbelina') || lname.includes('thmbelina')) return 'thumbelina';
  
  // Bucket Unik (rokok, tabung)
  if (lname.includes('bucket rokok') || lname.includes('tabung boneka')) return 'bucket-unik';
  
  // Money Bouquet
  if (lname.includes('bucket uang') || lname.includes('money')) return 'money-bouquet';
  
  // Sewa / Rental
  if (lname.includes('sewa') || (lname.includes('standing akrilik') && (lfname.includes('sewa') || lfname.includes('per 24jam') || lfname.includes('per jam')))) return 'sewa';
  if (lname.includes('standing akrilik bulat') || lname.includes('standing akrilik dome')) return 'sewa';
  if (lname.includes('akrilik bulat') && lfname.includes('sewa')) return 'sewa';
  if (lname.includes('akrilik marble') || lname.includes('akrilik persegi')) return 'sewa';
  if (lname.includes('akrilik bulat baby') || lname.includes('akrilik bulat blue') || lname.includes('akrilik bulat dusty')) return 'sewa';
  if (lname.includes('kostum kayla')) return 'sewa';
  
  // Standing Akrilik (all remaining) → sewa
  if (lname.includes('standing akrilik')) return 'sewa';
  
  // Vas & Dekorasi
  if (lname.includes('vas ')) return 'vas-dekorasi';
  
  // Karangan Bunga / Wreaths
  if (lname.includes('karangan bunga')) return 'wreaths';
  
  // Selempang / Ribbons
  if (lname.includes('selempang') || lname.includes('flowers sash')) return 'ribbons';
  
  // Packing
  if (lname.includes('packing')) return 'packaging';
  
  // Frame → accessories
  if (lname.includes('frame')) return 'accessories';
  
  // Akrilik frame mini → accessories
  if (lname.includes('akrilik frame mini')) return 'accessories';
  
  // Fresh Flower
  if (lname.includes('bunga mawar medium') || lname.includes('bunga white sedap') || lname.includes('mawar candy') || 
      lname.includes('pinky pearl') || lname.includes('hand-bucket anggrek') || lname.includes('hand-bucket anthurium') || 
      lname.includes('hand-bucket rose') || (lname.includes('fresh flower') || lfname.includes('fresh flower'))) return 'fresh-flower';
  
  // Artificial Flower
  if (lname.includes('bunga mawar palsu') || lname.includes('peony rose') || lname.includes('rose gonie') || 
      lname.includes('bunga artificial') || lname.includes('hand-bucket artificial') || lname.includes('hand-bucket pearl') ||
      lname.includes('kawat bulu')) return 'artificial-flower';
  
  // Snack Bouquet
  if (lname.includes('donat') || lname.includes('shine muscat')) return 'snack-bouquet';
  
  // Round Pita Satin → ribbons  
  if (lname.includes('round pita satin') && !lname.includes('bucket')) return 'ribbons';
  
  // Default to buckets (buket bunga)
  return 'buckets';
}

// Category descriptions
const categoryDescriptions = {
  'bloom-box': 'Rangkaian bunga dalam kotak premium (bloom box), cocok untuk hadiah ulang tahun & anniversary.',
  'thumbelina': 'Koleksi buket custom desain Thumbelina dengan variasi tema dan desain unik.',
  'bucket-unik': 'Kreasi bucket unik dan anti-mainstream, hadiah yang berbeda dari biasanya.',
  'vas-dekorasi': 'Vas bunga premium dan dekorasi ruangan dengan bunga berkualitas.',
  'buckets': 'Rangkaian bucket premium dengan komposisi yang elegan.',
  'snack-bouquet': 'Bouquet snack kreatif dengan susunan menarik dan kekinian.',
  'money-bouquet': 'Hadiah eksklusif berupa buket uang dengan dekorasi bunga yang cantik.',
  'wreaths': 'Karangan bunga papan dengan tampilan rapi dan profesional.',
  'accessories': 'Aksesori custom yang rapi dan estetik untuk hadiah personal.',
  'fresh-flower': 'Rangkaian bunga segar pilihan dengan nuansa mewah.',
  'artificial-flower': 'Bunga artificial premium yang awet dan tetap menawan.',
  'sewa': 'Layanan sewa standing akrilik & dekorasi untuk segala acara.',
  'packaging': 'Packing premium untuk melengkapi hadiah Anda.',
  'ribbons': 'Selempang & pita wisuda berkualitas untuk melengkapi momen spesial.',
  'catalog-home': 'Produk pilihan dari katalog utama.'
};

// Detect tags
function getTag(filename) {
  const lfname = filename.toLowerCase();
  if (lfname.includes('pre order') || lfname.includes('(po ') || lfname.includes('po h-')) return 'Pre Order';
  if (lfname.includes('promo')) return 'Promo';
  return undefined;
}

// Build products - group by productName + price
const productMap = new Map();

for (const file of allFiles) {
  const parsed = parseFilename(file);
  const category = categorize(parsed.productName, file);
  const tag = getTag(file);
  const assetPath = `/assets/${file}`;
  
  // Merge key: name + price
  const mergeKey = `${parsed.productName.toLowerCase().trim()}::${parsed.price}`;
  
  if (!productMap.has(mergeKey)) {
    // Build good description
    let desc = parsed.description || '';
    if (desc) {
      desc = desc.charAt(0).toUpperCase() + desc.slice(1);
    }
    const catDesc = categoryDescriptions[category] || '';
    const fullDesc = desc ? `${catDesc} ${desc}.` : catDesc;
    
    productMap.set(mergeKey, {
      name: parsed.productName,
      category,
      price: parsed.price,
      priceLabel: parsed.price > 0 ? parsed.priceLabel : 'Chat Admin',
      description: fullDesc,
      images: [assetPath],
      tag
    });
  } else {
    // Add image to existing product
    const existing = productMap.get(mergeKey);
    if (!existing.images.includes(assetPath)) {
      existing.images.push(assetPath);
    }
    // Keep tag if found
    if (tag && !existing.tag) existing.tag = tag;
    // Upgrade description if longer
    if (parsed.description && (!existing.description || parsed.description.length > existing.description.length)) {
      const catDesc = categoryDescriptions[category] || '';
      existing.description = `${catDesc} ${parsed.description.charAt(0).toUpperCase() + parsed.description.slice(1)}.`;
    }
  }
}

// Generate products array
const products = [];
let idCounter = 1;

for (const [key, product] of productMap) {
  products.push({
    id: `${product.category}-${idCounter}`,
    name: product.name,
    category: product.category,
    price: product.price,
    priceLabel: product.priceLabel,
    description: product.description,
    image: product.images[0],
    images: product.images,
    ...(product.tag ? { tag: product.tag } : {})
  });
  idCounter++;
}

// Sort by category then name
products.sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));

// Re-assign IDs after sort
products.forEach((p, i) => { p.id = `${p.category}-${i + 1}`; });

const generatedContent = `// GENERATED FILE - do not edit by hand\n// Generated: ${new Date().toISOString()}\n// Total: ${products.length} unique products from ${allFiles.length} asset files\nexport const generatedInitialProducts = ${JSON.stringify(products, null, 2)} as any;\n`;

fs.writeFileSync(path.join(__dirname, 'src', 'app', 'generated_products.ts'), generatedContent);
console.log(`generated_products.ts: ${products.length} unique products written`);

// Print category stats
const catStats = {};
for (const p of products) {
  catStats[p.category] = (catStats[p.category] || 0) + 1;
}
console.log('\nCategory distribution:');
for (const [cat, count] of Object.entries(catStats).sort()) {
  console.log(`  ${cat}: ${count} products`);
}

// Print products with tags
const tagged = products.filter(p => p.tag);
if (tagged.length > 0) {
  console.log(`\nTagged products:`);
  tagged.forEach(p => console.log(`  [${p.tag}] ${p.name} - ${p.priceLabel}`));
}
