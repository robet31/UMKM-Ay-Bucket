#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Price extraction from filename (Indonesian Rupiah format: Rp 95.000,00)
function extractPrice(filename) {
  const match = filename.match(/rp[\s\.]?(\d+(?:\.\d{3})*(?:,\d{2})?)/i);
  if (match) {
    // Remove dots (thousands separator) and take only integer part (before comma)
    const numStr = match[1].replace(/\./g, '').split(',')[0];
    return parseInt(numStr, 10);
  }
  return 0;
}

// Extract friendly name from filename
function extractName(filename) {
  // Remove file extension
  let name = filename.replace(/\.[^/.]+$/, '');
  // Remove trailing numbers (versions like (2), (3), etc)
  name = name.replace(/\s*\(\d+\)\s*$/, '');
  // Replace underscores/hyphens with spaces
  name = name.replace(/[-_]/g, ' ');
  // Title case
  name = name.replace(/\b\w/g, c => c.toUpperCase());
  return name;
}

// Generate category from folder name or filename
function extractCategory(folderName) {
  const folderLower = folderName.toLowerCase();
  
  if (folderLower.includes('akrilik') || folderLower.includes('frame')) return 'accessories';
  if (folderLower.includes('bucket') || folderLower.includes('buket')) return 'buckets';
  if (folderLower.includes('bunga mawar')) return 'fresh-flower';
  if (folderLower.includes('bunga white')) return 'fresh-flower';
  if (folderLower.includes('mawar') && folderLower.includes('palsu')) return 'artificial-flower';
  if (folderLower.includes('peony')) return 'fresh-flower';
  if (folderLower.includes('rose') || folderLower.includes('gonie')) return 'fresh-flower';
  if (folderLower.includes('donat')) return 'special';
  if (folderLower.includes('karang')) return 'wreaths';
  if (folderLower.includes('packing')) return 'packaging';
  if (folderLower.includes('sela')) return 'ribbons';
  if (folderLower.includes('wisuda')) return 'ribbons';
  if (folderLower.includes('sewa') || folderLower.includes('rental')) return 'rental';
  if (folderLower.includes('standing') || folderLower.includes('akrilik')) return 'standing';
  if (folderLower.includes('luxury')) return 'buckets';
  
  return 'catalog-home';
}

// Generate description based on category
function generateDescription(name, category, price) {
  const descriptions = {
    accessories: `Aksesori dekorasi berkualitas tinggi untuk melengkapi rangkaian bunga Anda. Harga: ${price ? `Rp ${price.toLocaleString('id-ID')}` : 'Hubungi untuk detail'}`,
    buckets: `Buket bunga premium dengan wadah berkualitas. Rangkaian indah untuk hadiah istimewa. Harga: ${price ? `Rp ${price.toLocaleString('id-ID')}` : 'Hubungi untuk detail'}`,
    'fresh-flower': `Rangkaian bunga segar pilihan terbaik. Kesegaran alami untuk momen spesial. Harga: ${price ? `Rp ${price.toLocaleString('id-ID')}` : 'Hubungi untuk detail'}`,
    'artificial-flower': `Bunga artificial premium yang awet dan elegan. Pilihan tepat untuk dekorasi jangka panjang. Harga: ${price ? `Rp ${price.toLocaleString('id-ID')}` : 'Hubungi untuk detail'}`,
    special: `Kombinasi unik bunga dengan snack atau hadiah spesial. Hadiah yang berkesan. Harga: ${price ? `Rp ${price.toLocaleString('id-ID')}` : 'Hubungi untuk detail'}`,
    wreaths: `Karangan bunga papan untuk berbagai acara. Elegan dan berkesan. Harga: ${price ? `Rp ${price.toLocaleString('id-ID')}` : 'Hubungi untuk detail'}`,
    packaging: `Packing mewah untuk hadiah premium. Presentasi pertama yang mengesankan. Harga: ${price ? `Rp ${price.toLocaleString('id-ID')}` : 'Hubungi untuk detail'}`,
    ribbons: `Pita dan selempang berkualitas untuk melengkapi rangkaian. Finishing yang sempurna. Harga: ${price ? `Rp ${price.toLocaleString('id-ID')}` : 'Hubungi untuk detail'}`,
    rental: `Sewa dekorasi standing untuk acara Anda. Harga bervariasi sesuai durasi. Harga: ${price ? `Rp ${price.toLocaleString('id-ID')}` : 'Hubungi untuk detail'}`,
    standing: `Standing akrilik custom untuk berbagai keperluan. Elegan dan modern. Harga: ${price ? `Rp ${price.toLocaleString('id-ID')}` : 'Hubungi untuk detail'}`,
    'catalog-home': `Paket premium ay buket untuk hadiah istimewa. Harga: ${price ? `Rp ${price.toLocaleString('id-ID')}` : 'Hubungi untuk detail'}`,
  };
  
  return descriptions[category] || `Produk berkualitas premium ay buket. Harga: ${price ? `Rp ${price.toLocaleString('id-ID')}` : 'Hubungi untuk detail'}`;
}

// Generate friendly alt text
function generateAlt(name, category) {
  return `${name} - ay buket`;
}

function main() {
  const importMapPath = path.join(process.cwd(), 'public', 'assets', 'import-map.json');
  
  if (!fs.existsSync(importMapPath)) {
    console.error('❌ import-map.json not found. Run import-assets first.');
    process.exit(1);
  }
  
  const importMap = JSON.parse(fs.readFileSync(importMapPath, 'utf-8'));
  console.log(`📋 Processing ${importMap.length} files...`);
  
  const catalogIndex = importMap.map((entry, idx) => {
    const filename = entry.filename;
    const fromPath = entry.from;
    
    // Extract folder name (parent directory)
    const folderName = path.basename(path.dirname(fromPath));
    
    const price = extractPrice(filename);
    const name = extractName(filename);
    const category = extractCategory(folderName);
    const description = generateDescription(name, category, price);
    const alt = generateAlt(name, category);
    
    return {
      id: `ay-${category}-${idx + 1}`,
      filename,
      name,
      category,
      price,
      priceLabel: price ? `Rp ${price.toLocaleString('id-ID')}` : 'Hubungi untuk detail',
      description,
      alt,
      source: fromPath,
      sourceFolder: folderName,
    };
  });
  
  // Group by category
  const byCategory = {};
  catalogIndex.forEach(item => {
    if (!byCategory[item.category]) byCategory[item.category] = [];
    byCategory[item.category].push(item);
  });
  
  console.log('\n📊 Summary by category:');
  Object.entries(byCategory).forEach(([cat, items]) => {
    console.log(`  ${cat}: ${items.length} items`);
  });
  
  const indexPath = path.join(process.cwd(), 'public', 'assets', 'catalog-index.json');
  fs.writeFileSync(indexPath, JSON.stringify(catalogIndex, null, 2));
  
  console.log(`\n✅ Catalog index generated!`);
  console.log(`📋 Written to: ${indexPath}`);
  console.log(`📦 Total products indexed: ${catalogIndex.length}`);
}

main();
