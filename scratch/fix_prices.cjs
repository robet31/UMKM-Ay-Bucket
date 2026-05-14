const fs = require('fs');
const path = require('path');

const filePath = 'd:/SEMESTER 6 (MBKM) dll/PROJECT-DEPLOY-COBA BOT/AY BUCKET LANDING PAGE/High-End Portfolio Design/src/app/generated_products.ts';
let content = fs.readFileSync(filePath, 'utf8');

// Find the array
const startMatch = content.indexOf('[');
const endMatch = content.lastIndexOf(']');
const arrayStr = content.substring(startMatch, endMatch + 1);

let products = JSON.parse(arrayStr);

products = products.map(p => {
  let price = p.price;
  
  // Rule: if price looks like it has extra zeros (e.g. 17,000,000 instead of 170,000)
  // or if priceLabel has way more zeros than price suggests.
  
  // Most buckets are 20k - 500k. 
  // If price > 1,000,000 and it's not a money-bouquet with specific high value,
  // it's probably multiplied by 100.
  
  if (price >= 1000000) {
     // Check if it ends in at least 4 zeros and is a multiple of 100
     if (price % 100 === 0) {
        // Fallback: 17,000,000 -> 170,000
        // 10,000,000 -> 100,000
        const normalized = price / 100;
        if (normalized >= 10000 && normalized <= 1000000) {
           price = normalized;
        }
     }
  }

  // Also fix cases where price is small but priceLabel is huge
  // Example: price: 95000, priceLabel: "Rp 9.500.000"
  // We should just let the app format the price.
  
  return {
    ...p,
    price: price,
    priceLabel: `Rp ${price.toLocaleString('id-ID').replace(/,/g, '.')}`
  };
});

// For special case "Chat Admin"
products = products.map(p => {
  if (p.price === 0) {
    p.priceLabel = "Chat Admin";
  }
  return p;
});

const newContent = content.substring(0, startMatch) + JSON.stringify(products, null, 2) + content.substring(endMatch + 1);
fs.writeFileSync(filePath, newContent);
console.log('Fixed prices for ' + products.length + ' products.');
