HyperFrames composition for Pesona Florist
========================================

Quick notes
-----------
- Location: `public/hyperframes/portfolio-composition`
- Entry: `index.html` (composition now includes slideshow + petals)

Preview
-------
Uses the HyperFrames CLI via `npx` (no global install required):

```bash
npm run hf:preview
# or directly
npx hyperframes preview public/hyperframes/portfolio-composition --open
```

Render
------
Render to a folder (script added to `package.json`):

```bash
npm run hf:render
# or directly
npx hyperframes render public/hyperframes/portfolio-composition --out dist/hf-render
```

Notes
-----
- The `index.html` now includes an image slideshow (pulls images from `public/assets`) and a decorative animated petals emitter.
- For full HyperFrames features install the CLI: `npm i -g @heygen/hyperframes-cli` or use `npx`.
- Next steps I can take: optimize images for render, wire captions from your catalog JSON, or add TTS/subtitles for a narrated render.
