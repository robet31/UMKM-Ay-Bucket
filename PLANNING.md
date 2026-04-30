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