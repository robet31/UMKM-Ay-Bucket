const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function findSource() {
  const base = path.resolve(process.cwd(), 'ASSETS-AY BUCKET');
  const candidates = ['logo-source.png','logo-source.jpg','logo-source.jpeg','logo-source.webp','5.jpg','5.png'];
  for (const c of candidates) {
    const p = path.join(base, c);
    if (fs.existsSync(p)) return p;
  }
  // fallback: try to find any file that looks like 'logo' in filenames
  const all = fs.readdirSync(base);
  for (const f of all) {
    if (/logo|ay[-_ ]?logo/i.test(f)) return path.join(base, f);
  }
  return null;
}

async function removeWhiteBackground(srcPath, outPath) {
  const img = sharp(srcPath).ensureAlpha();
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info; // channels should be 4 after ensureAlpha
  const out = Buffer.alloc(width * height * 4);

  for (let i = 0; i < width * height; i++) {
    const r = data[i * channels + 0];
    const g = data[i * channels + 1];
    const b = data[i * channels + 2];
    let a = channels >= 4 ? data[i * channels + 3] : 255;

    // Compute luminance-ish metric and if very close to white, make transparent
    const maxRGB = Math.max(r, g, b);
    const minRGB = Math.min(r, g, b);
    const isNearWhite = (maxRGB >= 245 && (maxRGB - minRGB) <= 10);

    out[i * 4 + 0] = r;
    out[i * 4 + 1] = g;
    out[i * 4 + 2] = b;
    out[i * 4 + 3] = isNearWhite ? 0 : a;
  }

  await sharp(out, { raw: { width, height, channels: 4 } }).png().toFile(outPath);
}

async function main(){
  try {
    const src = await findSource();
    if (!src) {
      console.error('No source logo found. Place your file at ASSETS-AY BUCKET/logo-source.png (or one of the common names).');
      process.exit(2);
    }
    const outPath = path.resolve(process.cwd(), 'public', 'assets', 'ay-logo-5.png');
    console.log('Processing:', src);
    await removeWhiteBackground(src, outPath);
    console.log('Wrote transparent logo:', outPath);
    // Optionally create webp variant
    await sharp(outPath).webp({ quality: 90 }).toFile(outPath.replace(/\.png$/, '.webp'));
    console.log('Also wrote webp variant');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(3);
  }
}

main();
