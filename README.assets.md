# Asset Integration Workflow — AY Buket

This document describes the complete workflow for managing, optimizing, and integrating assets into the AY Buket portfolio website.

## Quick Start

```bash
# 1. Import all assets from ASSETS-AY BUCKET
npm run import-assets

# 2. Generate catalog index with prices & descriptions
node ./scripts/generate-catalog-index.js

# 3. Review the generated mappings
cat public/assets/import-map.json
cat public/assets/catalog-index.json

# 4. Update data.ts (manual or scripted)
# [See "Update Product Data" section below]

# 5. Build and verify
npm run build
npm run dev
```

---

## File Organization

```
public/assets/
├── import-map.json              # Mapping of source → destination filenames
├── catalog-index.json           # Product metadata (price, description, category, alt text)
├── ay-logo-5.jpg                # Site logo (renamed from 5.jpg)
├── akrilik-frame-mini-*.png     # Accessories
├── buket-bunga-gradoll-*.png    # Buckets
├── bunga-mawar-*.png            # Fresh flowers
├── standing-akrilik-*.png       # Standing displays
├── selempang-*.png              # Ribbons
├── karangan-bunga-*.png         # Wreaths
├── peony-rose-*.png             # Fresh flower varieties
└── ...127 total image files
```

---

## Workflow Steps

### 1) List & Inventory Assets

After running `npm run import-assets`, verify all files were copied:

```bash
# Count files
ls -la public/assets/ | grep -E '\.(jpg|png|webp|gif)$' | wc -l

# View mapping
cat public/assets/import-map.json | jq '.[] | .filename' | head -20
```

**Expected outcome**: 127 image files in `public/assets`.

### 2) Generate Product Catalog Index

Script: `scripts/generate-catalog-index.js`

This script:
- Reads `import-map.json`
- Extracts **price** from filename (e.g., `rp170000` → 170000)
- Extracts **category** from folder name
- Generates **friendly name** by removing file extension & version numbers
- Creates **description** based on category
- Generates **alt text** for accessibility

Output: `public/assets/catalog-index.json` with 127 product entries.

#### Example entry:
```json
{
  "id": "ay-accessories-1",
  "filename": "Akrilik frame mini - Rp 95.000,00 - akrilik dome ukuran A5 standing lampu warna putih, bisa request warna, foto & tulisan.png",
  "name": "Akrilik Frame Mini - Rp 95.000,00 - Akrilik Dome Ukuran A5 Standing Lampu Warna Putih, Bisa Request Warna, Foto & Tulisan",
  "category": "accessories",
  "price": 95000,
  "priceLabel": "Rp 95.000",
  "description": "Aksesori dekorasi berkualitas tinggi untuk melengkapi rangkaian bunga Anda. Harga: Rp 95.000",
  "alt": "Akrilik Frame Mini - ay buket",
  "source": "ASSETS-AY BUCKET/Akrilik frame mini/...",
  "sourceFolder": "Akrilik frame mini"
}
```

### 3) Review & Manually Verify

Open `public/assets/catalog-index.json` and spot-check entries:

- ✓ Prices extracted correctly (Rp 50,000 – Rp 2,000,000)
- ✓ Categories assigned appropriately
- ✓ Descriptions are meaningful
- ✓ Alt text is descriptive

If corrections needed, edit `catalog-index.json` directly or re-run the script with adjusted heuristics.

### 4) Update Product Data (`src/app/data.ts`)

**Current state**: `src/app/data.ts` has hardcoded product entries (12 items).

**Goal**: Merge catalog-index.json entries into `data.ts` products array, or replace entirely.

#### Option A: Replace existing products (fastest)
1. Export catalog-index.json entries as TypeScript Product[] array
2. Replace `defaultProducts` in `data.ts` with new entries
3. Verify TypeScript compilation

#### Option B: Merge selectively
1. Keep existing 12 items as-is
2. Add 30-50 new items from catalog, prioritizing buckets & fresh flowers
3. Manually curate names, descriptions, and images

#### Script to generate TypeScript code:
```bash
node -e "
const fs = require('fs');
const idx = JSON.parse(fs.readFileSync('public/assets/catalog-index.json', 'utf-8'));
const products = idx.map((p, i) => ({
  id: p.id,
  name: p.name.substring(0, 50) + (p.name.length > 50 ? '...' : ''),
  category: p.category,
  price: p.price,
  priceLabel: p.priceLabel,
  description: p.description,
  image: '/assets/' + p.filename,
  tag: i % 5 === 0 ? 'Popular' : undefined,
}));
console.log(JSON.stringify(products, null, 2));
"
```

### 5) Image Optimization (Optional)

If you want responsive variants (400px, 800px, 1600px) and WebP format, add this script:

```bash
# scripts/optimize-assets.js (pseudocode)
# Requires: npm install sharp

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function optimizeImage(src) {
  const name = path.basename(src, path.extname(src));
  const dest = path.dirname(src);
  
  // Resize to 400px
  await sharp(src).resize(400, 400, { fit: 'inside' }).jpeg({ quality: 85 }).toFile(`${dest}/${name}-400.jpg`);
  
  // Resize to 800px
  await sharp(src).resize(800, 800, { fit: 'inside' }).jpeg({ quality: 90 }).toFile(`${dest}/${name}-800.jpg`);
  
  // WebP for modern browsers
  await sharp(src).resize(800, 800, { fit: 'inside' }).webp({ quality: 80 }).toFile(`${dest}/${name}-800.webp`);
}

// Process all images in public/assets
const files = fs.readdirSync('public/assets').filter(f => /\.(jpg|png)$/i.test(f));
files.forEach(optimizeImage);
```

Run: `npm run optimize-assets` (after adding to package.json).

### 6) Logo Setup

Filename `5.jpg` (if present) should be renamed or copied as:
```bash
cp "public/assets/5.jpg" "public/assets/ay-logo-5.jpg" 2>/dev/null || echo "5.jpg not found"
```

Then verify in nav:
- Open `src/app/components/nav.tsx`
- Logo displays if `BRAND_LOGO.logo = "/assets/ay-logo-5.jpg"` points to an existing file
- Falls back to emoji if file missing

Background removal (optional): Use Photopea or remove.bg API to create transparent PNG version.

---

## Testing & Verification

### Manual Tests
1. **Dev Server**: `npm run dev` → check nav logo, product images load
2. **Product Pages**: Click category → verify images per category
3. **Responsive**: Resize browser → check images scale properly
4. **Alt Text**: Inspect element → confirm `alt` attribute present

### Automated Tests
```bash
# Unit tests (pricing, data normalization)
npm test

# E2E (Playwright, if configured)
npx playwright test

# Security: audit dependencies
npm audit --audit-level=low

# XSS check: grep for unsafe patterns
grep -R "innerHTML\|dangerouslySetInnerHTML\|eval(" src || echo "No unsafe patterns found"

# Build
npm run build
```

---

## Troubleshooting

### Import fails: "Source folder not found"
- Ensure `ASSETS-AY BUCKET` folder exists in project root (or provide absolute path)
- Command: `node ./scripts/import-assets.js "/absolute/path/to/ASSETS-AY BUCKET"`

### Prices not extracted
- Filename must contain `rp<number>` pattern (e.g., `rp150000` or `rp 150.000`)
- Manually edit `catalog-index.json` if needed

### Images don't load in browser
- Check file exists: `ls -la public/assets/<filename>`
- Verify path in data.ts matches: `/assets/<filename>`
- Check browser DevTools → Network tab for 404 errors

### Category mismatch
- Edit `extractCategory()` in `generate-catalog-index.js`
- Re-run: `node ./scripts/generate-catalog-index.js`

---

## Best Practices

- ✅ Keep `import-map.json` and `catalog-index.json` in version control (reference only)
- ✅ Comment out `public/assets/*.png` and `public/assets/*.jpg` from git tracking (binary files)
- ✅ Add `.gitignore`: `public/assets/*.{jpg,png,webp,gif}`
- ✅ Commit `public/assets/import-map.json` and `catalog-index.json` for CI/CD (text format)
- ✅ Responsively size images: use `-400.jpg` for mobile, `-800.jpg` for tablet, original for desktop
- ✅ Use WebP for modern browsers (fallback to JPEG/PNG)
- ✅ Always provide `alt` text (SEO + accessibility)

---

## Performance Tips

- Images: 50–300 KB each (JPG quality 85–90, PNG optimized)
- Lazy loading: `loading="lazy"` on img tags
- srcset for responsive images (example below)
- Deploy to CDN: set `BRAND_LOGO.logo` to CDN URL if using external hosting

### Responsive Image Example

```tsx
<img
  src="/assets/buket-aesthetic-800.jpg"
  srcSet="/assets/buket-aesthetic-400.jpg 400w, /assets/buket-aesthetic-800.jpg 800w, /assets/buket-aesthetic-1600.jpg 1600w"
  sizes="(max-width: 600px) 100vw, (max-width: 1024px) 50vw, 33vw"
  alt="Buket Aesthetic - ay buket"
  loading="lazy"
/>
```

---

## Maintenance

- **Weekly**: Review sales data → create promotional bundles → add to data.ts
- **Monthly**: Optimize slow-loading images → regenerate `-400` & `-800` variants
- **Quarterly**: Audit alt text & descriptions for SEO
- **Before major deployment**: Run full test suite + security audit

---

## Related Commands

```bash
# Asset import & generation
npm run import-assets
node ./scripts/generate-catalog-index.js

# Build & test
npm run build
npm test
npm run dev

# Audit security
npm audit
npm audit fix --force (use with caution)

# Check for unsafe patterns
grep -r "innerHTML\|eval\|dangerouslySetInnerHTML" src || echo "✓ No unsafe patterns"

# File count
find public/assets -type f \( -name "*.jpg" -o -name "*.png" -o -name "*.webp" \) | wc -l
```

---

*Last Updated: May 2026*
*Maintained by: Development Team*
*Contact: ay-buket-admin*
