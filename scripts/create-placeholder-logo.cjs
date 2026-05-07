const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

(async () => {
  const svgImage = Buffer.from(
    '<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">' +
    '<rect width="200" height="200" fill="none"/>' +
    '<circle cx="100" cy="100" r="80" fill="#b85c3b" opacity="0.9"/>' +
    '<text x="100" y="110" font-size="32" font-family="serif" text-anchor="middle" fill="white">AY</text>' +
    '</svg>'
  );
  const out = path.resolve('./ASSETS-AY BUCKET/logo-source.png');
  await sharp(svgImage).png().toFile(out);
  console.log('✓ Created placeholder:', out);
})();
