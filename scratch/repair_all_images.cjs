
const fs = require('fs');
const path = require('path');

const productsFile = path.join(process.cwd(), 'src', 'app', 'generated_products.ts');
let content = fs.readFileSync(productsFile, 'utf8');

// Replace all occurrences of Rp X.XXX with Rp X.XXX00 ONLY if they are inside double quotes
const fixedContent = content.replace(/"([^"]*?Rp\s\d+\.\d+[^"]*?\.png)"/g, (match, inner) => {
  return `"${inner.replace(/(Rp\s\d+\.\d+)(?!\d)/g, '$100')}"`;
});

fs.writeFileSync(productsFile, fixedContent);
console.log("Global image path fix completed");
