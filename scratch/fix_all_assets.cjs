const fs = require('fs');
const path = require('path');

const publicAssetsDir = path.join(process.cwd(), 'public', 'assets');
const assetIndexFile = path.join(process.cwd(), 'src', 'app', 'asset_index.ts');
const generatedProductsFile = path.join(process.cwd(), 'src', 'app', 'generated_products.ts');

// 1. Rename files on disk
const files = fs.readdirSync(publicAssetsDir);
let renamedCount = 0;
for (const file of files) {
  if (file.includes('.00000')) {
    const newName = file.replace(/\.00000/g, '.000');
    fs.renameSync(path.join(publicAssetsDir, file), path.join(publicAssetsDir, newName));
    renamedCount++;
  }
}
console.log(`Renamed ${renamedCount} files on disk.`);

// 2. Update asset_index.ts
if (fs.existsSync(assetIndexFile)) {
  let assetIndexContent = fs.readFileSync(assetIndexFile, 'utf8');
  assetIndexContent = assetIndexContent.replace(/\.00000/g, '.000');
  fs.writeFileSync(assetIndexFile, assetIndexContent);
  console.log('Updated asset_index.ts');
}

// 3. Update generated_products.ts
if (fs.existsSync(generatedProductsFile)) {
  let generatedProductsContent = fs.readFileSync(generatedProductsFile, 'utf8');
  generatedProductsContent = generatedProductsContent.replace(/\.00000/g, '.000');
  fs.writeFileSync(generatedProductsFile, generatedProductsContent);
  console.log('Updated generated_products.ts');
}
