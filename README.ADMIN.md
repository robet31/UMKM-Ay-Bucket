# AY Buket Admin Panel Guide

## Quick Start

### Accessing the Admin Panel
1. Open your browser and navigate to `/admin` on your website
   - Full URL: `https://yourwebsite.com/admin`
   - Local development: `http://localhost:5173/admin`

2. **Default Login Credentials:**
   - **Username:** `admin`
   - **Password:** `admin123`
   - ⚠️ **Change these credentials immediately in production!** (See "Security" section below)

---

## Admin Features

### 1. Brand Customization (General Tab)

#### General Settings
- **Business Name:** Your business/brand name displayed throughout the site
- **Tagline:** Brand tagline shown in headers and marketing materials
- **Year:** Current year for copyright notices
- **Address:** Business location address
- **WhatsApp Number:** Contact number for customer inquiries
- **Instagram Handle:** Social media handle (format: @username)
- **TikTok Handle:** TikTok social media handle

#### Logo Customization
🎨 **Upload Brand Logo:**
1. Click the **"Upload Brand Logo"** file input button
2. Select a PNG, JPEG, or WebP image file from your computer
3. The logo will display as a preview immediately
4. Logo is automatically saved to browser storage (localStorage)
5. Logo persists across page reloads and browser sessions

**Logo Requirements:**
- Format: PNG, JPEG, or WebP (recommended: PNG with transparent background)
- Size: Recommended 200x200px minimum, max 2MB
- Aspect Ratio: Square (1:1) works best, but any ratio is supported
- Current Default: `/assets/ay-logo-5.png` (brown "AY" logo with transparent background)

**Logo Display Locations:**
- Navigation bar (top left)
- Footer (bottom left)
- About/Studio page
- Admin panel header

#### Hero Section Settings
- **Hero Title:** Main headline on the homepage
- **Hero Subtitle:** Description text under the hero title
- **Hero Fallback Image:** Background image for hero section

#### Navigation Links
Customize the main navigation menu:
- Edit link destinations (e.g., `/`, `/studio`, `/contact`)
- Edit link labels (e.g., "Katalog", "Tentang", "Kontak")

#### Footer Text
Custom footer content displayed at the bottom of all pages.

#### Google Maps Embedding
- Add an embed URL for Google Maps to display your business location
- Gets embedded in Contact page

---

### 2. Products Management

#### View All Products (127 Total)
- Browse all products imported from the ASSETS-AY BUCKET system
- Products are automatically categorized into:
  - **Accessories** (standing akrilik, frames, displays)
  - **Buckets** (buket aesthetic, luxury bucket, etc.)
  - **Wreaths** (karangan bunga)
  - **Fresh Flowers** (bunga asli)
  - **Artificial Flowers** (bunga palsu)
  - **Ribbons/Sashes** (selempang)
  - **Snack Bouquets** (donat, dessert buckets)
  - **Packaging** (packing luxury elegant)
  - **Catalog** (showcase items)

#### Add/Edit Products
- **Name:** Product name/title
- **Category:** Product category for filtering
- **Price:** Numeric price in Rupiah (e.g., 95000)
- **Description:** Detailed product description
- **Image:** Primary product image
- **Multiple Images:** Add gallery images for product showcase

#### Delete Products
- Remove products from catalog (careful: action is permanent)

---

### 3. Security Settings

#### Change Admin Credentials ⚠️ **IMPORTANT**
1. Navigate to Admin Panel → Security/Auth Tab (if available)
2. Change admin username and password from defaults
3. **Recommended:** Use a strong password (mix of letters, numbers, special characters)
4. Save changes - credentials are remembered in localStorage

**How credentials are stored:**
- Currently stored in browser localStorage (client-side)
- For production, recommend backend authentication (see "Production Deployment" below)

#### Current Admin Structure
```typescript
// src/app/data.ts
const defaultConfig: SiteConfig = {
  adminUsername: "admin",
  adminPassword: "admin123",
  // ... other config
};
```

---

## How the Logo System Works

### Current Logo Setup

**Logo File Location:**
- `/public/assets/ay-logo-5.png` (primary, transparent PNG)
- `/public/assets/ay-logo-5.webp` (WebP variant for modern browsers)

**Logo Processing Pipeline:**
1. **Source:** `ASSETS-AY BUCKET/logo-source.png` (placeholder/real logo)
2. **Process:** `npm run process-logo` script removes white background using sharp
3. **Output:** Generates transparent PNG + WebP variants
4. **Display:** Components load from `SiteConfig.brandLogoUrl` (localStorage)

### To Replace Logo (for Developers)

If you want to replace the default placeholder logo with your real logo:

1. Place your logo image in `ASSETS-AY BUCKET/` folder
2. Name it `logo-source.png` (or update the script to detect your filename)
3. Run: `npm run process-logo`
4. New logo generated at `/public/assets/ay-logo-5.png`
5. Rebuild: `npm run build`

**Alternative - Upload via Admin:**
- Simply use the Admin Panel's "Upload Brand Logo" feature
- Admin-uploaded logos stored in localStorage persist automatically

---

## Configuration Storage

### localStorage Keys
- **Primary:** `aybucket_admin_v1`
- Contains: businessName, brandLogoUrl, navigation links, all settings
- Browser-specific: Does NOT sync across devices or browsers
- Persists: Until browser cache is cleared

### Data Structure
```typescript
interface SiteConfig {
  businessName: string;
  tagline: string;
  year: string;
  address: string;
  whatsappNumber: string;
  whatsappDisplay: string;
  instagram: string;
  tiktok: string;
  navLinks: Array<{ to: string; label: string }>;
  footerText: string;
  heroTitle: string;
  heroSubtitle: string;
  heroFallbackImage: string;
  brandLogoUrl: string;  // ← Logo URL stored here
  mapsEmbedUrl: string;
  adminUsername: string;
  adminPassword: string;
}
```

---

## Troubleshooting

### Logo Not Showing
1. **Check:** Admin panel → Brand section → verify logo upload worked
2. **Try:** Clear browser cache (Ctrl+Shift+Delete or Cmd+Shift+Delete)
3. **Try:** Hard refresh page (Ctrl+F5 or Cmd+Shift+R)
4. **Check:** Browser console for errors (F12 → Console tab)
5. **Try:** Upload logo again or use default `/assets/ay-logo-5.png`

### Logo Appears Pixelated
- Ensure logo file is high resolution (at least 200x200px)
- Recommended: 400x400px or larger
- Use PNG or WebP format for best quality

### Changes Not Saving
1. Check browser console for errors
2. Verify localStorage is enabled (check browser settings)
3. Try clearing browser storage and re-entering settings
4. Check browser storage limit (usually 5-10MB per domain)

### Admin Panel Won't Load
1. Clear browser cache
2. Check URL: should be `/admin`
3. Check browser console for JavaScript errors
4. Try incognito/private browse mode (rules out extensions)

### Can't Login
- Credentials reset to defaults: admin / admin123
- Check that caps lock is OFF
- Try clearing localStorage: Open DevTools → Storage → LocalStorage → delete all

---

## Best Practices

### ✅ DO:
- ✓ Change admin credentials from defaults immediately
- ✓ Backup product catalog periodically (export as JSON)
- ✓ Use high-quality product images (at least 1000x1000px)
- ✓ Keep logo files in PNG with transparent background
- ✓ Test changes on mobile devices
- ✓ Document any custom product categories you create

### ❌ DON'T:
- ✗ Share admin credentials or URL publicly
- ✗ Use admin username/password as default forever
- ✗ Upload extremely large images (>5MB)
- ✗ Delete products without backup verification
- ✗ Rely on localStorage for permanent backups on single browsers
- ✗ Clear browser storage without exporting product data first

---

## Production Deployment Notes

### For Vercel Deployment:

1. **Environment Variables:** Set admin credentials as env vars instead of hardcoded
   ```bash
   VITE_ADMIN_USERNAME=yoursecureadmin
   VITE_ADMIN_PASSWORD=yoursecurepassword123
   ```

2. **Production Logo:** 
   - Upload real logo via admin panel on production site
   - Changes persist in browser's localStorage (per user)
   - For global changes, update build-time default in `src/app/data.ts`

3. **Security Enhancement:**
   - Consider moving admin authentication to backend (NextAuth, Firebase Auth)
   - Use database/backend for product storage Instead of localStorage
   - Implement secure image upload with CDN

4. **Build & Deploy:**
   ```bash
   npm run build
   vercel deploy
   ```

---

## Adding New Products

### For Developers:

1. **Add Product Images to Folder:**
   - Create folder in `ASSETS-AY BUCKET/` (e.g., `ASSETS-AY BUCKET/New Category/`)
   - Add PNG images with pricing in filename: `Product Name - Rp 50.000,00 - description.png`

2. **Update Category Mapping:**
   - Edit `scripts/generate_products.cjs`
   - Add to `folderToCategory` mapping (line ~20):
     ```javascript
     "New Category": "your-category",
     ```

3. **Regenerate Products:**
   ```bash
   npm run import-assets
   node ./scripts/generate_products.cjs
   ```

4. **Verify & Build:**
   ```bash
   npm run build
   ```

---

## Support & Customization

For additional admin features or customization needs:
- Logo colors/sizing adjustments
- Database integration for products
- Backend authentication
- API integrations
- Email notifications

Contact development team for implementation.

---

**Last Updated:** 2025  
**Admin System Version:** 1.0  
**Total Products:** 127  
**Categories:** 9
