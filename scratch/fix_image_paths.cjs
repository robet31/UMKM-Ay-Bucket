
const fs = require('fs');
const path = require('path');

const assetsDir = path.join(process.cwd(), 'public', 'assets');
const productsFile = path.join(process.cwd(), 'src', 'app', 'generated_products.ts');

const assets = fs.readdirSync(assetsDir);

let content = fs.readFileSync(productsFile, 'utf8');

// Function to find the best matching filename
function findBestAsset(targetPath) {
  if (!targetPath) return targetPath;
  const targetName = path.basename(targetPath);
  
  // 1. Direct match
  if (assets.includes(targetName)) return targetPath;
  
  // 2. Try adding '00' to the price part (e.g. Rp 95.000 -> Rp 95.00000)
  const withExtraZeros = targetName.replace(/(Rp\s\d+\.\d+)/g, '$100');
  if (assets.includes(withExtraZeros)) {
    return path.join(path.dirname(targetPath), withExtraZeros).replace(/\\/g, '/');
  }
  
  // 3. Try fuzzy match (if the start of the name matches)
  const basePrefix = targetName.split(' - ')[0];
  const fuzzy = assets.find(a => a.startsWith(basePrefix));
  if (fuzzy) return path.join(path.dirname(targetPath), fuzzy).replace(/\\/g, '/');

  return targetPath;
}

const updatedContent = content.replace(/export const generatedInitialProducts = (\[[\s\S]*?\]);/, (match, jsonPart) => {
  try {
    const products = JSON.parse(jsonPart);
    const updated = products.map(p => {
      return {
        ...p,
        image: findBestAsset(p.image),
        images: (p.images || []).map(img => findBestAsset(img))
      };
    });
    return `export const generatedInitialProducts = ${JSON.stringify(updated, null, 2)};`;
  } catch (e) {
    console.error("JSON Parse error", e);
    return match;
  }
});

fs.writeFileSync(productsFile, updatedContent);
console.log("Successfully fixed image paths in generated_products.ts");
