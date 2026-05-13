// Script: Restore products data ke Google Sheets
// Jalankan via: node scripts/restore_products.cjs

const https = require('https');
const fs = require('fs');
const path = require('path');

const GSHEET_URL = 'https://script.google.com/macros/s/AKfycbzlqawXDkQnkL0ACaNIqmueeGK_zqgJ24JyDNlhGqLpB8ISVQBPj_T3syG3NObSegRq/exec';

// Baca products dari data/products.json
const productsPath = path.join(__dirname, '..', 'data', 'products.json');
let products;
try {
  products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
  console.log(`Loaded ${products.length} products from products.json`);
} catch (e) {
  console.error('Cannot read products.json:', e.message);
  process.exit(1);
}

// Kirim per chunk (15 produk per request) via GET
const CHUNK_SIZE = 15;
const totalChunks = Math.ceil(products.length / CHUNK_SIZE);

async function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const handler = (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        // Follow redirect
        https.get(res.headers.location, handler).on('error', reject);
        return;
      }
      let data = '';
      res.on('data', d => data += d);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } 
        catch { resolve(data); }
      });
    };
    https.get(url, handler).on('error', reject);
  });
}

async function main() {
  console.log(`\nRestoring ${products.length} products in ${totalChunks} chunks...\n`);
  
  // 1. Save meta
  const metaPayload = JSON.stringify({
    action: "set", key: "products__meta",
    data: { totalChunks, totalItems: products.length, updatedAt: new Date().toISOString() },
    username: "admin", password: "AyBucket2026!"
  });
  const metaUrl = `${GSHEET_URL}?action=set&key=products__meta&payload=${encodeURIComponent(metaPayload)}`;
  const metaRes = await fetchUrl(metaUrl);
  console.log('Meta saved:', metaRes?.success ? '✅' : '❌');
  
  // 2. Save each chunk
  for (let i = 0; i < totalChunks; i++) {
    const chunk = products.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
    const chunkPayload = JSON.stringify({
      action: "set", key: `products__chunk_${i}`,
      data: chunk,
      username: "admin", password: "AyBucket2026!"
    });
    const chunkUrl = `${GSHEET_URL}?action=set&key=products__chunk_${i}&payload=${encodeURIComponent(chunkPayload)}`;
    const chunkRes = await fetchUrl(chunkUrl);
    console.log(`Chunk ${i+1}/${totalChunks} (${chunk.length} items): ${chunkRes?.success ? '✅' : '❌'}`);
    
    // Rate limit: tunggu 1 detik antar request
    await new Promise(r => setTimeout(r, 1000));
  }
  
  // 3. Save full products as main key (for get_bundle compatibility)
  console.log('\nSaving full products array...');
  const fullPayload = JSON.stringify({
    action: "set", key: "products",
    data: products,
    username: "admin", password: "AyBucket2026!"
  });
  // POST via https
  const postUrl = new URL(GSHEET_URL);
  const postOptions = {
    hostname: postUrl.hostname,
    path: postUrl.pathname,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(fullPayload) }
  };
  
  await new Promise((resolve, reject) => {
    const req = https.request(postOptions, (res) => {
      // Follow redirects
      if (res.statusCode >= 300 && res.statusCode < 400) {
        console.log('POST redirected (normal for Apps Script)');
        resolve();
        return;
      }
      let data = '';
      res.on('data', d => data += d);
      res.on('end', () => { console.log('POST response:', data.substring(0, 100)); resolve(); });
    });
    req.on('error', reject);
    req.write(fullPayload);
    req.end();
  });
  
  console.log('\n✅ Done! Products restored to Google Sheets.');
  
  // 4. Verify
  console.log('\nVerifying...');
  const verifyRes = await fetchUrl(`${GSHEET_URL}?action=get&key=products__meta`);
  console.log('Meta:', verifyRes?.data);
}

main().catch(console.error);
