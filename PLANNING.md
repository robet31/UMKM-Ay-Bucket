# PLANNING.md - Pesona Florist Portfolio Project

## Project Overview
High-end florist portfolio website for **Pesona Florist** (Krian, Sidoarjo, East Java, Indonesia). A production-ready e-commerce catalog and showcase site built with React, TypeScript, and Tailwind CSS.

---

## 📊 Current Tech Stack

### **Core Framework**
- **React 18.3** - Component-based UI library
- **React Router 7.13.0** - Client-side routing with data router pattern
- **Vite 6.3.5** - Fast build tool and dev server
- **TypeScript** - Full type safety across the codebase

### **Styling & Design System**
- **Tailwind CSS 4.1.12** - Utility-first CSS framework (via `@tailwindcss/vite` plugin)
- **CSS Custom Properties** - OKLCH color space for perceptual uniformity
- **Custom fonts**: 
  - Cormorant Garamond (serif, headings)
  - Inter (sans-serif, body)
  - JetBrains Mono (monospace, meta data)

### **UI Component Libraries**
- **Radix UI** (30+ unstyled primitives): accordion, dialog, dropdown-menu, tabs, tooltip
- **Material UI 7.3.5** - Icons and select UI components
- **Class Variance Authority (CVA 0.7.1)** - Component variant management
- **Lucide React 0.487.0** - Icon library
- **Sonner 2.0.3** - Toast notifications
- **Next-themes 0.4.6** - Dark/light mode support

### **Animations & Interactions**
- **Framer Motion 12.23.24** - Page transitions, scroll-triggered animations, hover effects, modal dialogs
- **Embla Carousel 8.6.0** - Product image carousels in modal dialogs (with autoplay)

### **State & Data Persistence**
- **localStorage** - Client-side data storage (config, products, categories, videos)
- **Custom Event Bus Pattern** - `window.dispatchEvent(new Event("siteConfigChanged"))` for reactive updates without Zustand/Redux

### **Deployment**
- **Vercel** - Edge-optimized deployment with `vercel.json` config

---

## 🏗️ Current Architecture

### **File Structure**
```
src/
├── main.tsx                    # Entry point (React root)
├── app/
│   ├── App.tsx                 # Router provider wrapper
│   ├── layout.tsx              # Root layout with global overlays
│   ├── routes.tsx              # React Router v7 route definitions
│   ├── data.ts                 # Central data store (config, products, categories, videos)
│   ├── pages/
│   │   ├── home.tsx            # Main catalog (953 lines) - category filtering, product grid, modals
│   │   ├── case-study.tsx      # Category-specific product showcase
│   │   ├── studio.tsx          # About page with masonry gallery, process, maps
│   │   ├── contact.tsx         # Contact page
│   │   └── admin.tsx           # Full admin panel (1000 lines) - CRUD for all content
│   ├── components/
│   │   ├── nav.tsx             # Responsive navigation (mobile fullscreen menu)
│   │   ├── footer.tsx          # Site footer with WhatsApp CTA
│   │   ├── custom-cursor.tsx   # Animated custom cursor (hover interactions)
│   │   ├── grain-overlay.tsx   # Subtle noise texture overlay
│   │   ├── page-transition.tsx # Route transition wrapper
│   │   ├── whatsapp-float.tsx  # Floating WhatsApp button with tooltip
│   │   ├── video-gallery.tsx   # Pinterest-style masonry video gallery (lazy-loaded)
│   │   └── figma/ImageWithFallback.tsx # Figma image component with SVG fallback
│   └── ui/                     # 40+ Radix-based UI components (Button, Card, Tabs, etc.)
├── styles/
│   ├── index.css               # Fonts + Tailwind + Theme imports
│   ├── fonts.css               # Google Fonts (@import)
│   ├── tailwind.css            # Tailwind v4 config with @theme blocks
│   └── theme.css               # Design system theme (light/dark OKLCH colors)
└── ...
```

### **Routing Pattern**
```tsx
// Layout route wraps all pages with global components
<Root>
  <CustomCursor />
  <GrainOverlay />
  <Nav />
  <Outlet />  {/* Page content */}
  <WhatsAppFloat />
</Root>
```

**Routes:**
- `/` - Home catalog (category pills, product grid, modals)
- `/work/:slug` - Category page (product showcase per category)
- `/studio` - About (masonry gallery, services, process, Google Maps)
- `/contact` - Contact (WhatsApp CTA, address, socials)
- `/admin` - Admin panel (6 tabs for full content management)
- `/*` - Fallback to home

---

## 📦 Data Model

### **SiteConfig** (Admin-configurable)
- Business name, tagline, year
- Address, WhatsApp numbers (display + link), Instagram, TikTok
- Navigation links
- Hero text (title + subtitle)
- Footer text
- Google Maps embed URL

### **Product Categories** (12 types)
1. `bouquet-classic` - Classic bouquets (3-20 roses)
2. `bouquet-premium-medium` - Medium premium (Rp 85k–800k)
3. `bouquet-premium-big` - Big premium (Rp 600k–1M)
4. `money-bouquet` - Money bouquets (0-200 bills)
5. `bouquet-wedding` - Wedding bouquets (Rp 85k–550k)
6. `bunga-mobil` - Car decoration
7. `bunga-meja` - Table arrangement
8. `bloom-box` - Gift boxes
9. `standing-flower` - Standing arrangements
10. `bunga-salib` - Cross arrangements
11. `paket-duka` - Funeral packages
12. (Future: Custom/Seasonal)

### **Product Fields**
- id, name, category, price, priceLabel
- image (main), images[] (carousel)
- tag, variant, description

### **VideoItem Fields**
- url, source (youtube/instagram/tiktok/file)
- orientation (portrait/landscape)
- caption, thumbnail, featured (homepage vs studio only)

---

## ✨ Unique Features (Already Implemented)

1. **Custom Cursor** - Circular dot that expands showing "VIEW" on hoverable cards
2. **Grain Overlay** - Opacity 0.035 noise texture for tactile feel
3. **Framer Motion** - FLIP animations, staggered transitions, scroll-triggered reveals, sibling coordination
4. **Price Comparison Tables** - Dynamic tables for Classic Bouquet and Money Bouquet categories
5. **Product Detail Modal** - Fullscreen lightbox with Embla carousel, WhatsApp order button
6. **Masonry Video Gallery** - Lazy-loaded embedded videos, auto-orientation detection, 1-3 column responsive
7. **LocalStorage Admin** - Full CMS without backend - changes persist across tabs
8. **Mobile Menu** - Fullscreen overlay with staggered link animations
9. **Real-time Sync** - localStorage event listener broadcasts changes to all open tabs
10. **WhatsApp Deep Links** - Pre-filled order messages with product info
11. **Google Maps Embed** - Grayscale → color on hover

---

## 🎨 Design System

### **Typography**
- **Cormorant Garamond** (serif): Headings, hero, brand - elegant, high-end boutique feel
- **Inter** (sans-serif): Body text, labels, buttons - clean, modern readability
- **JetBrains Mono** (monospace): Meta data, prices, tags - technical precision

### **Color Palette** (OKLCH)
- **Background**: `#F9F9F7` - Off-white cream (warm, paper-like)
- **Foreground**: `oklch(0.145 0 0)` - Near-black
- **Primary**: `#030213` - Deep black-blue (navigation, buttons)
- **Secondary**: `oklch(0.95 0.0058 264.53)` - Lilac tint (accents)
- **Accent**: `#e9ebef` - Light gray
- **Destructive**: `#d4183d` - Red (errors, warnings)
- **WhatsApp Green**: `#25D366` / `#128C7E` - Brand primary action

**Border Radius**: `--radius: 0.625rem` (10px) - Consistent across components

### **Spacing & Fluid Typography**
- Uses `clamp(min, preferred, max)` for fluid type and spacing
- Responsive breakpoints: `md:`, `lg:` (Tailwind defaults)
- Inline styles over Tailwind classes for custom, non-standard values

---

## 🚀 Recommended Feature Expansions

### **High Priority** (Core E-commerce Features)

1. **Product Quick-View Modal**
   - Hover-triggered mini-preview on product cards
   - Add to WhatsApp pre-filled message
   - Small carousel of additional images
   - Reduces clicks to purchase intent

2. **Search & Advanced Filtering**
   - Search bar with live results
   - Filter by: price range, occasion (wedding, birthday, funeral), color, size
   - Sort by: price, popularity, newest
   - Improves catalog navigation (grows to 50+ SKUs)

3. **Wishlist / Saved Items**
   - Heart icon on each product card
   - LocalStorage persistence
   - "Send to WhatsApp" for saved items
   - User retention and comparison shopping

4. **Order Tracking System**
   - Generate order ID on WhatsApp inquiry
   - Track: Confirmed → Preparing → Out for Delivery → Delivered
   - Simple status display on contact page
   - Builds trust and reduces WhatsApp follow-ups

5. **Shopping Cart / Bundle Builder**
   - Multi-item checkout builder
   - Combine bouquets + hampers + cards
   - Quantity selection
   - Single WhatsApp message with entire order summary
   - Increases average order value

### **Medium Priority** (UX & Engagement)

6. **Customer Reviews & Ratings**
   - Star ratings on product cards
   - Review modal with photo upload
   - Social proof for conversion
   - Display verified purchases

7. **Occasion-Based Collections**
   - Landing pages: "Wedding Season", "Valentine's", "Sympathy"
   - Curated bundles with thematic pricing
   - Improves discoverability for gift-givers

8. **Live WhatsApp Chat Widget**
   - Floating button (alternative to simple link)
   - Business hours indicator (online/offline)
   - Offline form for after-hours inquiries
   - Faster response times

9. **Newsletter Signup**
   - Modal or footer signup
   - Email marketing integration
   - SMS/WA broadcast for promotions
   - Customer retention channel

10. **Delivery Calculator**
    - Input address → instant shipping estimate
    - Same-day delivery indicator
    - Coverage area map
    - Reduces cart abandonment

### **Low Priority** (Advanced Features)

11. **Seasonal Promotional Banners**
    - Admin-configurable hero banners
    - Countdown timers for limited offers
    - Holiday themes (Christmas, Eid, Valentine's)

12. **Loyalty Program**
    - Points system per purchase
    - Tiered rewards (Silver/Gold/Platinum)
    - Birthday bouquets for members

13. **Multi-language / Multi-currency**
    - Indonesian / English toggle
    - Export to regional markets
    - Currency conversion

14. **Augmented Reality Preview**
    - Phone camera → AR placement of bouquets
    - "See in your space" feature
    - Differentiates from competitors

15. **Subscription Service**
    - Weekly/Monthly flower subscriptions
    - Corporate office programs
    - Recurring revenue model

---

## 🎯 UI/UX Improvements

### **Header & Navigation**
- **Fix Desktop Nav**: Currently `display: none` - enable with proper hover states
- **Active State Indicator**: Animated underline on current page (like cursor trail)
- **Sticky Nav Enhancement**: Shadow on scroll, smooth transition
- **Search Icon**: Add to nav (triggers search modal)
- **Cart Icon**: If implementing cart/bundle builder

### **Hero Section**
- **Add CTA Buttons**: Dual buttons ("Shop Now" + "Custom Quote")
- **Video Background Option**: Loop short flower arrangement video for premium feel
- **Scroll Indicator**: Animated bounce arrow pointing to categories
- **Trust Badges**: "Locally Sourced", "Fresh Daily", "Same-Day Delivery" icons

### **Category Pills**
- **All States**: Better hover/focus states
- **Scrollable**: Horizontal scroll on mobile with snap
- **Icons**: Add emoji/icons to all pills (currently text only)
- **Animated Selection**: Scale transform on category change

### **Product Cards**
- **Quick-View Button**: Eye icon on hover
- **Wishlist Heart**: Top-right corner
- **Price Badge**: Prominent with strikethrough for original price (if discounted)
- **Stock Indicator**: Limited quantity badges
- **Hover Lift**: 3D transform with shadow elevation

### **Product Detail Modal**
- **Full-Screen Option**: Toggle between modal and fullscreen
- **Related Products**: Carousel at bottom "You may also like"
- **Share Button**: Copy link, WhatsApp share
- **Quantity Selector**: If implementing cart
- **Size Options**: If variants exist

### **Mobile Responsiveness**
- **Nav Menu**: Test hamburger → fullscreen transition
- **Product Grid**: 2 columns on mobile, 3 tablet, 4 desktop
- **Filters**: Slide-out drawer on mobile
- **Font Scaling**: Ensure all text readable on small screens
- **Touch Targets**: Minimum 44px for buttons

### **Accessibility**
- **Focus Indicators**: Visible focus rings (currently removed with `cursor: none`)
- **ARIA Labels**: On icon-only buttons (quick-view, wishlist)
- **Keyboard Navigation**: Tab through product cards, Esc to close modals
- **Screen Reader**: Alt text on images, semantic HTML
- **Color Contrast**: Verify WCAG AA compliance (especially text on colored buttons)
- **Reduced Motion**: Respect `prefers-reduced-motion` for Framer animations

### **Loading States**
- **Skeleton Screens**: Product grid loading placeholders
- **Image Lazy Loading**: Native `loading="lazy"`
- **Skeleton for Modal**: While Embla carousel loads
- **Error Boundaries**: Fallback UI for failed images

### **Empty States**
- **No Search Results**: Illustration + "Try different filters" message
- **Empty Category**: Suggest related categories
- **No Wishlist**: Illustration encouraging first save

---

## 🛠️ Technical Debt & Refactoring Opportunities

### **State Management**
- **Current**: localStorage + Event bus (works, but limited)
- **Option 1**: Zustand for global state (lightweight, React-specific)
- **Option 2**: Jotai for atomic state (if granular updates needed)
- **Benefit**: Type-safe, devtools, better performance

### **Inline Styles → Tailwind Classes**
- **Current**: 70%+ inline styles for custom values
- **Approach**: Extract to CSS variables or theme extensions
- **Benefit**: Better maintainability, smaller bundle, purging

### **Component Reusability**
- **Extract**: PriceTable, ProductCard, CategoryPill, StatStep
- **Props**: Fully typed with defaults
- **Storybook**: Visual testing/documentation (optional)

### **Animation Performance**
- **Current**: Framer Motion on many elements
- **Optimize**: `layoutId` for shared elements, reduce simultaneous animations
- **Consider**: CSS animations for simple hover states

### **Bundle Size**
- **Current**: ~200KB+ (with all dependencies)
- **Optimize**: Code-splitting by route, dynamic imports for admin panel
- **Tree-shake**: Remove unused MUI components, Radix primitives

### **Type Safety**
- **Current**: Good coverage, but some `any` in admin panel
- **Improve**: Strict mode on, exhaustive type checks

### **Testing**
- **Add**: Vitest for unit tests, Playwright for E2E
- **Coverage**: Critical paths (checkout flow, admin save/load)

---

## 📈 Migration Strategy

If converting to full SSR framework (Next.js):

1. **App Router**: `app/` structure similar to current
2. **Server Components**: Static pages (studio, contact) as SSG
3. **Client Components**: Interactive (home, cart, product modal)
4. **API Routes**: `/api/products`, `/api/orders` for dynamic features
5. **Database**: Replace localStorage with Drizzle ORM + SQLite/PostgreSQL
6. **Deployment**: Vercel Edge Functions

---

## 🎬 Implementation Roadmap

### **Phase 1: Foundation** (Week 1-2)
- Fix admin panel bugs
- Enable desktop nav
- Add search functionality
- Implement wishlists

### **Phase 2: E-commerce Features** (Week 3-4)
- Shopping cart / bundle builder
- Order tracking system
- Enhanced product modals
- Quick-view on cards

---

## Asset Integration — Session Notes (AY Buket)

Summary
- Imported assets plan created and implemented partially during this session.
- Added an `import-assets` script to copy images from `ASSETS-AY BUCKET` into `public/assets`.
- Updated branding to `ay buket` and wired a `BRAND_LOGO.logo` path; nav renders logo when available.

Files added/modified in this session
- `scripts/import-assets.js` — copies image files recursively from the ASSETS folder into `public/assets` and writes `public/assets/import-map.json`.
- `package.json` — new npm script: `import-assets`.
- `src/app/data.ts` — branding updated: businessName, tagline, and `BRAND_LOGO.logo` set to `/assets/ay-logo-5.jpg`.
- `src/app/components/nav.tsx` — now renders `BRAND_LOGO.logo` (image) with a text/emoji fallback.

What the import script does
- Recursively scans the provided `ASSETS-AY BUCKET` folder for image files (jpg, png, webp, gif).
- Copies images into `public/assets`, avoiding name collisions by suffixing `-1`, `-2`, ... when necessary.
- Produces `public/assets/import-map.json` listing {from, to} mappings for easy verification.

Category mapping (proposed)
- Akrilik frame mini -> `accessories/akrilik-frame`
- Bucket Aesthetic -> `buckets/aesthetic`
- Bucket Bunga Gradoll (Graduation Doll) Big Mesh -> `buckets/gradoll-big-mesh`
- Bucket Bunga Mawar Medium -> `buckets/mawar-medium`
- Buket Cilla Estetik Mesh -> `buckets/cilla-estetik`
- Buket skripsi glitter 20 tangkai -> `buckets/graduation-skripsi`
- Bunga Mawar Palsu -> `artificial-flower/mawar-palsu`
- Bunga White Sedap -> `fresh-flower/white-sedap`
- Donat Bucket Tart -> `special/donat-bucket`
- Frmae Birthday Edelweis -> `accessories/frame-birthday-edelweis`
- Karangan Bunga -> `wreaths/karangan-bunga`
- Luxury Bucket -> `buckets/luxury`
- Mawar Candy (Bunga Asli) -> `fresh-flower/mawar-candy`
- packing Luxury Elegant -> `packaging/luxury-elegant`
- Peony Rose Medium -> `fresh-flower/peony-rose-medium`
- Rose Gonie Pink -> `fresh-flower/rose-gonie-pink`
- Selempang List Pita -> `ribbons/selempang-list-pita`
- Selempang Wisuda 3 Titik -> `ribbons/selempang-wisuda`
- Sewa Per Jam Standing Akrilik Bulat -> `rental/standing-akrilik-bulat`
- Sewa Standing Akrilik (PROMO) -> `rental/standing-akrilik-promo`
- Standing Akrilik -> `standing/akrilik`

Next code changes recommended
- Run `npm run import-assets` (or `node ./scripts/import-assets.js "ASSETS-AY BUCKET"`) to populate `public/assets`.
- Optionally auto-rename `5.jpg` -> `ay-logo-5.jpg` after import and ensure `BRAND_LOGO.logo` points to it.
- Update `src/app/data.ts` product `image` fields to point to the newly copied filenames (use `public/assets/import-map.json` to match originals).
- Add categories to `src/app/data.ts` to include `buckets`, `luxury`, `rental`, `packaging`, `accessories`, `standing`, etc., or map assets into existing categories if preferred.

Optimization & background removal options
- Fast, local optimization: add `scripts/optimize-assets.js` using `sharp` to create thumbnails and WebP variants and to compress images.
- Background removal: fully automatic removal is unreliable with `sharp` alone. Best results come from manual tools (Photoshop/Photopea) or 3rd-party APIs (remove.bg). I can add an integration script for remove.bg if you provide an API key.

How I can proceed (pick one)
- A) I run `node ./scripts/import-assets.js "ASSETS-AY BUCKET"` now and produce `import-map.json` and a report. (requires permission to run scripts in the workspace).
- B) I modify the import script to auto-rename `5.jpg` -> `ay-logo-5.jpg` and generate thumbnails (adds `sharp` dependency).
- C) You run `npm run import-assets` locally and share `public/assets/import-map.json`; I'll then update `src/app/data.ts` to map product entries to the new asset filenames.

Acceptance criteria
- `public/assets` contains the copied images and `import-map.json`.
- Navigation shows the logo at the top (logo file exists and `BRAND_LOGO.logo` points to it).
- Product images referenced in `src/app/data.ts` match the filenames in `public/assets` (manual or automated mapping).

Notes
- Vitest extension warnings are unrelated to asset work — you can ignore for now; tests are not required to verify assets.
- I preserved existing code style: the nav uses inline styles; data changes were minimal (branding only). If you want Tailwind-only changes, I can refactor those.

---

If you'd like, I will now run the import (option A) and produce the mapping — say "Run import" and I'll proceed. If you prefer to run locally, choose option C.

---

## Asset Integration — Detailed Flow

This section explains the full step-by-step flow I will (or you can) run to import, standardize, optimize, categorize, and integrate images into the site. Each step includes commands, expected output, and verification checks.

1) Discovery & Inventory
   - Action: Read folder names under `ASSETS-AY BUCKET` and collect image counts.
   - Tool: `scripts/import-assets.js` (dry-run feature disabled by default). I will first run the script to copy files and then inspect `public/assets/import-map.json` which lists all copied files.
   - Verification: `public/assets/import-map.json` with mapping entries; total images count matches expectation.

2) Copy & Standardize (what `import-assets` does)
   - Action: Copy all images to `public/assets` recursively. Avoid filename collisions by adding suffixes (`-1`, `-2`).
   - Command:
     ```powershell
     npm run import-assets
     # or explicitly
     node ./scripts/import-assets.js "ASSETS-AY BUCKET"
     ```
   - Expected result: files copied to `public/assets` and `public/assets/import-map.json` created.

3) Auto-rename logo
   - Action: If `5.jpg` exists in the ASSETS source, rename a copy to `ay-logo-5.jpg` in `public/assets` and ensure `BRAND_LOGO.logo` points to `/assets/ay-logo-5.jpg`.
   - Note: I can modify the import script to detect `5.jpg` and produce `ay-logo-5.jpg` automatically, or perform a rename pass after import.

4) Generate responsive variants (optional but recommended)
   - Sizes: thumbnail 400px, medium 800px, large 1600px. Also generate WebP for modern browsers.
   - Tools: `sharp` (Node). Example pipeline (pseudocode):
     - `sharp(input).resize(400).webp({quality:80}).toFile(name+'-400.webp')`
     - create `-800.jpg`, `-1600.jpg`, and corresponding `-400.webp`, `-800.webp`, `-1600.webp`.
   - Output: `public/assets/<name>-400.jpg`, `<name>-800.jpg`, `<name>-1600.jpg`, and WebP variants.
   - Benefit: faster LCP, smaller bandwidth, srcset support.

5) Background removal / logo cleanup (recommended manual + optional automation)
   - Recommendation: For a polished logo, use a manual editor (Photopea, Photoshop) to remove background and export a PNG with alpha channel. Automated options:
     - `remove.bg` API (best balance between quality & automation) — requires API key.
     - Local model (u2net) wrappers exist but require setup and have mixed results.
   - I can add an integration script that calls the remove.bg API and saves `ay-logo-5.png` into `public/assets` if you provide a key.

6) Mapping assets → categories
   - Action: Use `public/assets/import-map.json` and the folder names to assign category tags according to the proposed mapping in this doc.
   - Automation approach: small Node script reads mapping file and constructs an index `public/assets/catalog-index.json` with entries like:
     ```json
     { "filename": "buket-aesthetic-01.jpg", "category": "buckets/aesthetic", "source": "ASSETS-AY BUCKET/Bucket Aesthetic/buket-aesthetic-01.jpg" }
     ```
   - Manual review: Open `public/assets/catalog-index.json` and confirm 1–2 random images per category.

7) Update `src/app/data.ts` product references
   - Action: For product entries already in `src/app/data.ts`, update `image` and `images[]` fields to point to the new filenames in `/assets`.
   - Automation: I can produce a script that attempts best-match by filename (strip spaces, lower-case, replace underscores/hyphens) and patch `data.ts` entries. Manual oversight required for accuracy.
   - Verification: Run `npm run dev` and open product pages to confirm images load.

8) Accessibility & SEO
   - Action: Ensure every image has `alt` text. Strategy:
     - Use filename → generate friendly alt: `Rose Gonie Pink bouquet` from `rose-gonie-pink-01.jpg`.
     - For logos, alt: `ay buket logo`.
   - Implementation: When generating `catalog-index.json`, include an `alt` field with a suggested alt string.

9) Frontend integration & srcset
   - HTML/JSX pattern for responsive images (example):
     ```tsx
     <img
       src="/assets/rose-gonie-pink-800.jpg"
       srcSet="/assets/rose-gonie-pink-400.jpg 400w, /assets/rose-gonie-pink-800.jpg 800w, /assets/rose-gonie-pink-1600.jpg 1600w"
       sizes="(max-width: 600px) 100vw, 50vw"
       alt="Rose Gonie Pink bouquet"
       loading="lazy"
     />
     ```
   - Update product card component(s) to use `srcSet` and `loading="lazy"`.

10) Preview & QA
   - Steps:
     1. Run `npm run dev`.
     2. Confirm nav shows logo (top-left). If transparent PNG used, check against both light/dark.
     3. Browse 5–10 products from different categories to check images, alt text, and performance.
     4. Inspect `public/assets/import-map.json` and `public/assets/catalog-index.json`.

11) Commit & cleanup
   - Commit changes: `git add . && git commit -m "Import assets, add asset scripts, wire ay-logo"`.
   - Optional: add `public/assets` to `.gitignore` if files are large; instead keep `public/assets/import-map.json` and `catalog-index.json` tracked.

12) Rollback plan
   - If unwanted: remove added files in `public/assets` and restore `src/app/data.ts` from Git:
     ```powershell
     git restore --source=HEAD --staged --worktree src/app/data.ts
     git rm -r --cached public/assets && git checkout -- public/assets
     ```

Operational Notes
- Keep `public/assets` under a size threshold; prefer generating thumbnails and WebP for production deployment.
- If the project will be deployed on Vercel or CDN, consider pushing optimized assets to a CDN bucket and updating `BRAND_LOGO.logo` to point to the CDN URL.
- For large imports, break the work into batches and validate `import-map.json` after each batch.

If you agree, I can now either run the import here (say "Run import") or modify the import script to auto-rename `5.jpg` to `ay-logo-5.jpg` and optionally add `sharp`-based resizing (say "Add optimization").

### **Phase 3: Polish** (Week 5-6)
- Mobile responsiveness fixes
- Accessibility improvements
- Loading/error states
- Performance optimization

### **Phase 4: Growth** (Week 7-8)
- Customer reviews
- Newsletter signup
- WhatsApp widget upgrade
- SEO optimization

### **Phase 5: Advanced** (Week 9-12)
- Subscription service
- Loyalty program
- AR preview feature
- Multi-language expansion

---

## 📊 Success Metrics

- **Conversion Rate**: WhatsApp inquiries → sales
- **Average Order Value**: Before/after bundle builder
- **Mobile Traffic**: % of users (target: 60%+ with good UX)
- **Page Load Time**: <2s on 3G connections
- **Core Web Vitals**: LCP <2.5s, CLS <0.1, INP <200ms
- **Customer Retention**: Repeat purchase rate

---

## 💡 Design Philosophy

**"Boutique Luxury Meets Modern Tech"**

- **Elegant & Minimal**: Cormorant Garamond, generous whitespace, restrained palette
- **Tactile & Human**: Grain overlay, organic shapes, natural motion curves
- **Functional & Fast**: Every animation serves purpose, progressive enhancement
- **Local & Personal**: WhatsApp-first communication, neighborhood florist feel
- **Scalable & Robust**: From 12 to 120 products without redesign

---

## 🔗 Related Resources

- **Radix UI Docs**: https://www.radix-ui.com/docs
- **Framer Motion**: https://www.framer.com/motion/
- **Tailwind CSS v4**: https://tailwindcss.com/docs
- **Embla Carousel**: https://www.embla-carousel.com
- **React Router v7**: https://reactrouter.com

---

*Last Updated: April 2026*
*Project: Pesona Florist High-End Portfolio*
*Location: Krian, Sidoarjo, East Java, Indonesia*

---

## Price & Description Mapping (from filenames)

Plan
- Use filename heuristics to infer `price` and `description` for products. Filenames often include price or category hints like `catalog-home-rp150000-item-05.jpg`.
- Automated rules:
  - If filename contains `rp` or `rp<digits>`, extract numeric value as price (e.g., `rp150000` → `150000`).
  - If filename contains category keywords (e.g., `buket-satin`, `money-bouquet`, `snack-bouquet`), map to product category.
  - Otherwise use folder-to-category mapping from this plan.
- Generate a `public/assets/catalog-index.json` with fields: `filename`, `category`, `price`, `priceLabel`, `description`, `alt`.

Description generation
- Create short descriptions from filename tokens (replace dashes/underscores with spaces, capitalize). Examples:
  - `buket-satin-rp20000-item-01.jpg` → `Buket Satin - Rp 20.000` with description `Buket satin berkualitas tinggi dengan rangkaian bunga pilihan.`
  - `catalog-home-rp150000-item-05.jpg` → `Premium Package 5 - Rp 150.000` with description `Paket premium untuk hadiah spesial.`
- Allow manual overrides in `public/assets/catalog-index.json`.

Implementation steps
1. After import, run a small Node script `scripts/generate-catalog-index.js` that reads `public/assets/import-map.json`, applies heuristics, and writes `public/assets/catalog-index.json`.
2. Review `catalog-index.json` and adjust any wrong prices or descriptions.
3. Run a script to patch `src/app/data.ts` product entries by best-match on filenames; manual review required.

---

## Build, Testing & Security Plan

Goals
- Ensure site builds cleanly, images are integrated, UI works, and code is robust.
- Add unit tests (Vitest), E2E tests (Playwright), and security checks (dependency audit, basic SAST/XSS scanning).

Commands & CI flow
1. Install dependencies (if not installed):
```bash
npm install
```
2. Import assets (local step):
```bash
npm run import-assets
```
3. Build production bundle:
```bash
npm run build
```
4. Run unit tests (Vitest):
```bash
npm test
```
Note: Vitest extension in VS Code may be limited, but CLI works.

5. Run E2E (Playwright recommended):
```bash
npx playwright install
npx playwright test
```
(Will require writing basic end-to-end tests covering navigation, product modal, and image loading.)

6. Security checks:
- Dependency audit:
```bash
npm audit --audit-level=low
```
- Static analysis for XSS and injection patterns: run a simple grep for suspicious patterns (e.g., `dangerouslySetInnerHTML`, `innerHTML`, unsanitized template literals) and add a lint rule:
```bash
grep -R "dangerouslySetInnerHTML\|innerHTML\|eval(" src || true
```
- Automated SAST: Integrate tools like `semgrep` or `eslint-plugin-security` in CI.
- Dynamic scanning (optional): run OWASP ZAP or Nikto against dev server to catch XSS issues.

7. TDD workflow:
- Write failing Vitest unit tests for critical components (data normalization, product card rendering, price formatting).
- Implement code changes until tests pass.
- Add Playwright tests to cover core user flows.

Acceptance criteria
- `npm run build` completes without errors.
- All Vitest unit tests pass (`npm test`).
- Playwright E2E tests pass locally in CI.
- No high-severity `npm audit` issues remaining or documented mitigations.
- No unsafe use of `innerHTML` or unsanitized template constructions in source files.

---

## Final Notes
- I will not run the import script without your confirmation. Say "Run import" when you want me to execute it here. For now I added the price/description generation and testing/security plan to this document.
- When ready I will: import assets, generate `catalog-index.json`, patch `src/app/data.ts` (with preview), run `npm run build`, run tests, and provide a security report.
