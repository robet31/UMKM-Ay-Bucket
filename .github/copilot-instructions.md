# Project Guidelines

## Code Style
- Use TypeScript + React functional components with Vite entry points in [src/main.tsx](src/main.tsx) and [src/app/App.tsx](src/app/App.tsx).
- Prefer explicit interfaces and small pure helpers for catalog/config logic, following the patterns in [src/app/data.ts](src/app/data.ts) and [src/app/routes.tsx](src/app/routes.tsx).
- Match the existing formatting style: double quotes, semicolons, and compact imports.
- Keep generated artifacts out of manual edits, especially [src/app/generated_products.ts](src/app/generated_products.ts) and asset-derived outputs under [public/assets](public/assets).

## Architecture
- The app is a single-page React app with router-based navigation defined in [src/app/routes.tsx](src/app/routes.tsx).
- Most business logic lives in [src/app/data.ts](src/app/data.ts), which normalizes products, categories, videos, site config, and storage-backed state.
- Server-side configuration is handled in [api/config.ts](api/config.ts) with database access helpers in [api/_db.ts](api/_db.ts) and schema in [api/schema.sql](api/schema.sql).
- The cloud data layer uses Turso / LibSQL for JSON and metadata persistence; keep image uploads on ImgBB and store only URLs in Turso.
- Asset ingestion and catalog generation are handled by scripts in [scripts](scripts) and source images under [ASSETS-AY BUCKET](ASSETS-AY%20BUCKET).

## Build and Test
- Install dependencies with `npm i`.
- Start local development with `npm run dev`.
- Build production assets with `npm run build`.
- Run tests with `npm run test`.
- Refresh imported assets with `npm run import-assets`.
- Regenerate logo outputs with `npm run process-logo`.
- Preview or render HyperFrames content with `npm run hf:preview` and `npm run hf:render`.

## Project Conventions
- Reuse existing normalization and merge helpers in [src/app/data.ts](src/app/data.ts) instead of introducing parallel catalog logic.
- Treat files marked as generated as build outputs; update the source scripts or data pipeline instead of editing them directly.
- Keep routes, layout, and app shell changes aligned with the current React Router setup in [src/app/routes.tsx](src/app/routes.tsx).
- Use the `@` alias from [vite.config.ts](vite.config.ts) for imports from `src`.

## Integration Points
- Vite is configured for the `@` alias, `figma:asset/*` resolution, Tailwind v4, and SVG/CSV imports in [vite.config.ts](vite.config.ts).
- The client data layer calls `/api/config` for Turso-backed reads and writes, and uploads images to ImgBB from [src/app/data.ts](src/app/data.ts).
- The API depends on Turso/LibSQL environment variables, especially `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN`, through [api/_db.ts](api/_db.ts).

## Security
- Treat [api/config.ts](api/config.ts) as sensitive: it includes auth checks, sanitization, body-size limits, rate limiting, and security headers.
- Default admin credentials are present in the project history and README files; verify and replace them before production use.
- Never hardcode secrets in client code; prefer environment variables and server-side persistence.