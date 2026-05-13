// Script sementara untuk menginisialisasi Google Sheets dengan data default
const https = require('https');
const http = require('http');

const GSHEET_URL = "https://script.google.com/macros/s/AKfycbzqbMtZ3KLyeGv7Aj_RPQV-QxhPeHLmTS6WWWc2l2W9UH37ptFBEgm0U_9WgMPslvAU/exec";

function postToGsheet(payload) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payload);
    const url = new URL(GSHEET_URL);
    
    const options = {
      hostname: url.hostname,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = https.request(options, (res) => {
      // Follow redirects
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        const redirectUrl = new URL(res.headers.location);
        const redirectOptions = {
          hostname: redirectUrl.hostname,
          path: redirectUrl.pathname + redirectUrl.search,
          method: 'GET',
          headers: {}
        };
        const req2 = https.request(redirectOptions, (res2) => {
          let body = '';
          res2.on('data', (chunk) => body += chunk);
          res2.on('end', () => {
            try { resolve(JSON.parse(body)); }
            catch { resolve({ raw: body }); }
          });
        });
        req2.on('error', reject);
        req2.end();
        return;
      }
      
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(body)); }
        catch { resolve({ raw: body }); }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function main() {
  // Read the generated products
  const fs = require('fs');
  const path = require('path');
  
  // Get default products from the generated file
  const genPath = path.join(__dirname, '..', 'src', 'app', 'generated_products.ts');
  let genContent = fs.readFileSync(genPath, 'utf8');
  
  // Extract the array from the TypeScript file
  const match = genContent.match(/export const generatedInitialProducts\s*=\s*(\[[\s\S]*\])\s*(?:as any)?;/);
  if (!match) {
    console.error("Could not find products array in generated_products.ts");
    process.exit(1);
  }
  
  // Parse the products (they're JS-compatible)
  let products;
  try {
    products = eval(match[1]);
  } catch (e) {
    console.error("Could not parse products:", e.message);
    process.exit(1);
  }
  
  console.log(`Found ${products.length} default products`);
  
  // Save products to Google Sheets
  console.log("Saving products to Google Sheets...");
  const result = await postToGsheet({
    action: "set",
    key: "products",
    data: products,
    username: "admin",
    password: "AyBucket2026!"
  });
  console.log("Products save result:", JSON.stringify(result));
  
  // Restore correct site config
  console.log("\nRestoring site config...");
  const configResult = await postToGsheet({
    action: "set",
    key: "site_config",
    data: {
      businessName: "Ay Bucket",
      tagline: "Wujudkan Hadiah Impianmu",
      year: "2026",
      address: "Toko: Ruko Jambu Raya Perumnas Kamal\nHomestore Madura: Jl Jeruk 6 no 4 Perumnas Kamal Bangkalan\nHomestore Surabaya: Jl Wonorejo 3 Tegalsari Surabaya",
      whatsappNumber: "6285880021020",
      whatsappDisplay: "0858-8002-1020",
      whatsappNumber2: "6287853094053",
      whatsappDisplay2: "0878-5309-4053",
      instagram: "@ay.bucket",
      tiktok: "",
      navLinks: [
        { to: "/", label: "Katalog" },
        { to: "/studio", label: "Tentang" },
        { to: "/contact", label: "Kontak" }
      ],
      footerText: "© 2026 Ay Bucket & Gift. Dibuat dengan penuh cinta.",
      heroTitle: "Ay Bucket & Gift",
      heroSubtitle: "Pilihan Hadiah Premium Untuk Momen Spesial Anda.",
      heroFallbackImage: "/assets/Buket Bunga Asli Premium - Rp 350.00000.png",
      heroSettings: [],
      brandLogoUrl: "/assets/logo-fix.png",
      mapsEmbedUrl: "https://maps.google.com/maps?q=Pertokoan+Pasar+Senenan+Bangkalan&t=&z=15&ie=UTF8&iwloc=&output=embed",
      catalogLink: "6285880021020",
      catalogLinkType: "wa",
      adminUsername: "admin",
      adminPassword: "AyBucket2026!",
      customCategories: []
    },
    username: "admin",
    password: "AyBucket2026!"
  });
  console.log("Config save result:", JSON.stringify(configResult));
  
  // Save default videos
  console.log("\nSaving default videos...");
  const videosResult = await postToGsheet({
    action: "set",
    key: "videos",
    data: [
      { id: "v-1", url: "https://www.youtube.com/watch?v=AKEXXIh-244", source: "youtube", orientation: "horizontal", caption: "Behind the Scenes — Proses merangkai buket premium Ay Bucket 🌸", featured: true },
      { id: "v-2", url: "https://www.youtube.com/shorts/-0SM7Ihvxyo", source: "youtube", orientation: "vertical", caption: "Tutorial Buket Satin (Layout Vertikal) 💐", featured: true },
      { id: "v-3", url: "https://www.youtube.com/watch?v=mFlD1VNrIUg", source: "youtube", orientation: "horizontal", caption: "Ide Bisnis Rangkaian Bunga & Buket 💒", featured: true },
      { id: "v-4", url: "https://www.youtube.com/shorts/_Wbq-ium2GE", source: "youtube", orientation: "vertical", caption: "Money Bouquet Tutorial (Layout Vertikal) 💰", featured: true }
    ],
    username: "admin",
    password: "AyBucket2026!"
  });
  console.log("Videos save result:", JSON.stringify(videosResult));
  
  // Save default gallery
  console.log("\nSaving default gallery...");
  const galleryResult = await postToGsheet({
    action: "set",
    key: "gallery_projects",
    data: [
      { id: "gallery-1", title: "Premium Satin Bouquet", category: "Buket Satin", aspect: "3/4", image: "/assets/Round Pita Satin - Rp 100.00000.png" },
      { id: "gallery-2", title: "Exclusive Money Bouquet", category: "Money Bouquet", aspect: "1/1", image: "/assets/Mawar Candy (Bunga Asli) - Rp 170.000,00.png" },
      { id: "gallery-3", title: "Creative Donut Tart", category: "Snack Bouquet", aspect: "16/9", image: "/assets/Donat buket tart - Rp 100.00000 - isi 7 donat bomboloni isi coklat topping glaze bisa request warna. silahkan chat admin.png" },
      { id: "gallery-4", title: "Elegant Acrylic Dome", category: "Premium Packages", aspect: "3/4", image: "/assets/Akrilik frame mini - Rp 95.00000 - akrilik dome ukuran A5 standing lampu warna putih bisa request warna foto and tulisan.png" },
      { id: "gallery-5", title: "Fresh Flower White Sedap", category: "Fresh Flower", aspect: "1/1", image: "/assets/bunga white sedap - Rp 125.000,00 - 125ribu hanya bunga asli saja (10tangkai sedap malam & 10tangkai asteria).png" },
      { id: "gallery-6", title: "Big Rose Artificial", category: "Artificial Flower", aspect: "16/9", image: "/assets/Bunga Mawar Palsu Premium (ukuran Big) - Rp 250.000,00.png" }
    ],
    username: "admin",
    password: "AyBucket2026!"
  });
  console.log("Gallery save result:", JSON.stringify(galleryResult));
  
  // Final verification
  console.log("\n=== FINAL VERIFICATION ===");
  const bundle = await postToGsheet({ action: "get_bundle" });
  if (bundle.data) {
    const p = Array.isArray(bundle.data.products) ? bundle.data.products.length : 0;
    const v = Array.isArray(bundle.data.videos) ? bundle.data.videos.length : 0;
    const g = Array.isArray(bundle.data.gallery_projects) ? bundle.data.gallery_projects.length : 0;
    console.log(`Products: ${p} | Videos: ${v} | Gallery: ${g} | Config: ${bundle.data.site_config ? 'OK' : 'MISSING'}`);
  }
}

main().catch(console.error);
