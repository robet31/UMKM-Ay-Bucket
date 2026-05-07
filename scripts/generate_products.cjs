const fs = require('fs');
const path = require('path');

const srcRoot = path.resolve('./ASSETS-AY BUCKET');
const outFile = path.resolve('./src/app/generated_products.ts');

const folderToCategory = {
  'Akrilik frame mini': 'accessories',
  'Bucket Bunga Gradoll (Graduation Doll) Big Mesh': 'buckets',
  'Bucket Bunga Mawar Medium': 'buckets',
  'Buket Cilla Estetik Mesh': 'buckets',
  'Buket skripsi glitter 20 tangkai': 'buckets',
  'Bunga Mawar Palsu': 'artificial-flower',
  'Bunga White Sedap': 'fresh-flower',
  'Donat Bucket Tart': 'snack-bouquet',
  'Frame Birthday Edelweis': 'catalog-home',
  'Karangan Bunga': 'wreaths',
  'Luxury Bucket': 'buckets',
  'Mawar Candy (Bunga Asli)': 'fresh-flower',
  'Packing Luxury Elegant': 'packaging',
  'Peony Rose Medium': 'artificial-flower',
  'Rose Gonie Pink': 'artificial-flower',
  'Selempang List Pita': 'ribbons',
  'Selempang Wisuda 3 Titik': 'ribbons',
  'Sewa Per Jam Standing Akrilik Bulat': 'sewa',
  'Sewa Standing Akrilik (PROMO)': 'sewa',
  'Standing Akrilik': 'accessories',
  // Legacy support for backward compatibility
  'Frmae Birthday Edelweis': 'catalog-home',
  'packing Luxury Elegant': 'packaging',
  'Bucket Aesthetic': 'ribbons', // Redirected - files moved to Selempang List Pita
};

function normalizeWhitespace(value) {
  return String(value || '').replace(/\u00A0/g, ' ').replace(/\s+/g, ' ').trim();
}

function parsePriceFromName(name) {
  const normalized = normalizeWhitespace(name);
  const m = normalized.match(/Rp\s*([0-9\.]+)/i);
  if (!m) return 0;
  const amount = parseInt((m[1] || '').replace(/\./g, ''), 10);
  return Number.isFinite(amount) ? amount : 0;
}

function toSentenceCase(text) {
  if (!text) return '';
  const cleaned = normalizeWhitespace(text)
    .replace(/[,_]+/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
  if (!cleaned) return '';
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

function splitFileMeta(filename) {
  const raw = normalizeWhitespace(filename.replace(/\.[^.]+$/, '').replace(/\(\d+\)\s*$/, '').trim());
  const parts = raw.split(/\s+-\s+/).map((item) => normalizeWhitespace(item)).filter(Boolean);

  const titleRaw = parts[0] || raw;
  const detailParts = parts.slice(1).filter((part) => !/Rp\s*[0-9\.]+/i.test(part));

  return {
    title: toSentenceCase(titleRaw),
    detail: toSentenceCase(detailParts.join('. ')),
  };
}

function compactDetail(detail) {
  if (!detail) return '';
  const words = normalizeWhitespace(detail).split(' ');
  if (words.length <= 18) return detail;
  return `${words.slice(0, 18).join(' ')}...`;
}

const categoryCopy = {
  accessories: {
    lead: 'Aksesori custom yang rapi dan estetik untuk hadiah personal.',
    cta: 'Cocok untuk wisuda, ulang tahun, dan surprise spesial.',
  },
  buckets: {
    lead: 'Rangkaian bucket premium dengan komposisi yang elegan.',
    cta: 'Bisa request warna, tema, dan ucapan sesuai momen.',
  },
  wreaths: {
    lead: 'Karangan bunga papan dengan tampilan rapi dan profesional.',
    cta: 'Tersedia untuk ucapan duka, selamat, dan acara resmi.',
  },
  packaging: {
    lead: 'Kemasan premium untuk meningkatkan kesan hadiah.',
    cta: 'Finishing clean dan siap kirim.',
  },
  ribbons: {
    lead: 'Selempang dan pita dekoratif untuk melengkapi momen spesial.',
    cta: 'Desain menyesuaikan tema acara.',
  },
  'snack-bouquet': {
    lead: 'Bouquet snack kreatif dengan susunan menarik dan kekinian.',
    cta: 'Pilihan tepat untuk hadiah fun namun tetap elegan.',
  },
  'fresh-flower': {
    lead: 'Rangkaian bunga segar pilihan dengan nuansa mewah.',
    cta: 'Dirangkai rapi agar tampil cantik saat diberikan.',
  },
  'artificial-flower': {
    lead: 'Bunga artificial premium yang awet dan tetap menawan.',
    cta: 'Praktis untuk hadiah jangka panjang.',
  },
  'catalog-home': {
    lead: 'Produk unggulan untuk momen hadiah yang berkesan.',
    cta: 'Tampilan estetik dan siap custom.',
  },
  default: {
    lead: 'Produk premium dengan detail rapi dan tampilan elegan.',
    cta: 'Siap jadi hadiah terbaik untuk orang tersayang.',
  },
};

function buildDescription(category, detail, title) {
  const copy = categoryCopy[category] || categoryCopy.default;
  const shortDetail = compactDetail(detail);
  if (shortDetail) {
    return `${copy.lead} ${shortDetail}. ${copy.cta}`;
  }
  return `${copy.lead} ${title} dirangkai dengan perhatian pada detail. ${copy.cta}`;
}

const products = [];
let counter = 1;
for(const folder of fs.readdirSync(srcRoot)){
  const folderPath = path.join(srcRoot, folder);
  if(!fs.statSync(folderPath).isDirectory()) continue;
  const files = fs.readdirSync(folderPath).filter(f=>/\.(png|jpg|jpeg|webp)$/i.test(f));
  for(const f of files){
    const filename = f;
    const parsedName = normalizeWhitespace(f);
    const { title, detail } = splitFileMeta(parsedName);
    const name = title;
    const price = parsePriceFromName(parsedName) || 0;
    const category = folderToCategory[folder] || 'catalog-home';
    const id = (category + '-' + counter).toLowerCase().replace(/[^a-z0-9-_]/g,'-');
    const image = '/assets/' + filename;
    const priceLabel = price ? ('Rp ' + price.toLocaleString('id-ID')) : '';
    const description = buildDescription(category, detail, title);
    products.push({ id, name, category, price, priceLabel, description, image, images: [image] });
    counter++;
  }
}

const fileContent = `// GENERATED FILE - do not edit by hand\nexport const generatedInitialProducts = ${JSON.stringify(products, null, 2)} as any;\n`;
fs.writeFileSync(outFile, fileContent, 'utf8');
console.log('Wrote', outFile, 'with', products.length, 'products');
