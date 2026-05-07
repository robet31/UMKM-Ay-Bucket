#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function isImage(name) {
  return /\.(jpe?g|png|webp|gif)$/i.test(name);
}

function ensureDir(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

function copyRecursive(src, dest, mapping) {
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const e of entries) {
    const srcPath = path.join(src, e.name);
    if (e.isDirectory()) {
      copyRecursive(srcPath, dest, mapping);
      continue;
    }
    if (!isImage(e.name)) continue;
    let base = e.name;
    // avoid collisions by prefixing with index if duplicate
    let targetName = base;
    let i = 1;
    while (fs.existsSync(path.join(dest, targetName))) {
      const ext = path.extname(base);
      const nameOnly = path.basename(base, ext);
      targetName = `${nameOnly}-${i}${ext}`;
      i++;
    }
    const destPath = path.join(dest, targetName);
    fs.copyFileSync(srcPath, destPath);
    mapping.push({ from: srcPath, to: destPath, filename: targetName });
    console.log(`✓ Copied: ${e.name} → ${targetName}`);
  }
}

function main() {
  const argv = process.argv.slice(2);
  const src = argv[0] || path.join(process.cwd(), '../ASSETS-AY BUCKET');
  const dest = argv[1] || path.join(process.cwd(), 'public', 'assets');

  if (!fs.existsSync(src)) {
    console.error('❌ Source folder not found:', src);
    process.exit(2);
  }
  console.log(`📁 Importing from: ${src}`);
  console.log(`📂 Destination: ${dest}\n`);
  
  ensureDir(dest);
  const mapping = [];
  copyRecursive(src, dest, mapping);
  const mapFile = path.join(dest, 'import-map.json');
  fs.writeFileSync(mapFile, JSON.stringify(mapping, null, 2));
  console.log(`\n✅ Import complete!`);
  console.log(`📊 Total files copied: ${mapping.length}`);
  console.log(`📋 Mapping written to: ${mapFile}`);
}

main();
