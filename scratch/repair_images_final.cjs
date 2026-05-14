
const fs = require('fs');
const path = require('path');

const productsFile = path.join(process.cwd(), 'src', 'app', 'generated_products.ts');
let content = fs.readFileSync(productsFile, 'utf8');

// Fix the image paths by restoring the extra zeros for prices in filenames
// This regex will find any string inside "image" or "images" that looks like a price with only 3 zeros
// and add the missing 2 zeros.
const fixedContent = content.replace(/"(image|images)":\s*(["\[][\s\S]*?)(?=\s*[,\]\}])/g, (match, key, value) => {
  // Replace globally within the value (handles both single string and array strings)
  const fixedValue = value.replace(/(Rp\s\d+\.\d+)(?!\d)/g, '$100');
  return `"${key}": ${fixedValue}`;
});

fs.writeFileSync(productsFile, fixedContent);
console.log("Successfully restored extra zeros in all image paths");
