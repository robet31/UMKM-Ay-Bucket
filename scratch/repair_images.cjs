
const fs = require('fs');
const path = require('path');

const productsFile = path.join(process.cwd(), 'src', 'app', 'generated_products.ts');
let content = fs.readFileSync(productsFile, 'utf8');

// Fix the image paths by restoring the extra zeros for prices in filenames
const fixedContent = content.replace(/"(image|images)":\s*(["\[][\s\S]*?["\]])/g, (match, key, value) => {
  if (value.startsWith('"')) {
    // Single string
    return `"${key}": ${value.replace(/(Rp\s\d+\.\d+)(?!\d)/g, '$100')}`;
  } else {
    // Array
    return `"${key}": ${value.replace(/(Rp\s\d+\.\d+)(?!\d)/g, '$100')}`;
  }
});

fs.writeFileSync(productsFile, fixedContent);
console.log("Successfully restored extra zeros in image paths");
