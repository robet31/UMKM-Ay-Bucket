const fs = require('fs');
const path = require('path');
const gen = path.resolve(__dirname, '..', 'src', 'app', 'generated_products.ts');
const assetsDir = path.resolve(__dirname, '..', 'public', 'assets');
if (!fs.existsSync(gen)) { console.log('MISSING_GENERATED_PRODUCTS'); process.exit(0); }
const src = fs.readFileSync(gen,'utf8');
const re = /\/assets\/([^\"']+\.(png|jpg|jpeg|webp|gif))/gi;
let m;
const files = new Set();
while ((m = re.exec(src)) !== null) files.add(m[1]);
const all = Array.from(files).sort();
let found = 0, missing = 0;
const missingList = [];
for (const f of all) {
  const p = path.join(assetsDir, f);
  if (fs.existsSync(p)) found++; else { missing++; missingList.push(f); }
}
console.log(`SUMMARY: Found=${found} Missing=${missing} Total=${all.length}`);
if (missing > 0) {
  console.log('MISSING_EXAMPLES:');
  console.log(missingList.slice(0,10).join('\n'));
}
process.exit(0);
