# matthewshera.com

Portfolio of Matthew Shera — game director & systems designer. Static site, built with [Eleventy](https://www.11ty.dev/) 3, vanilla CSS/JS, GSAP + Lenis (vendored), self-hosted fonts (Instrument Serif · Geist · Geist Mono).

## Commands

```bash
npm install          # once
npm run dev          # local dev server with live reload → http://localhost:8080
npm run build        # production build → _site/  (minified CSS/JS)
npm run check        # HTML validation of the build
npm run og           # regenerate src/og.jpg (the social share image) — needs Google Chrome installed
npm run resume       # regenerate the résumé PDF from /resume/ (print CSS → src/assets/Matthew-Shera-Resume.pdf)
```

## Deploy (Cloudflare Pages — the domain is already on Cloudflare)

1. Push this folder to a Git repo (GitHub/GitLab).
2. Cloudflare dashboard → Workers & Pages → Create → Pages → connect the repo.
3. Build settings: **Framework preset:** None · **Build command:** `npm run build` · **Build output directory:** `_site` · **Node version:** 22 (set `NODE_VERSION=22` in environment variables).
4. Custom domains → add `matthewshera.com` and `www.matthewshera.com`. Done. `_headers` (security + immutable asset caching) is picked up automatically.

Any other static host works too (Netlify: same command/output; GitHub Pages: publish `_site`; Vercel: output `_site`).

## Editing content

| What | Where |
|---|---|
| Name, email, LinkedIn, status line, availability | `src/_data/site.json` |
| Home page copy (hero, numbers, principles, about, timeline) | `src/index.njk` |
| Case studies (front matter = meta; body = sections) | `src/work/*.njk` — add a new one by copying a file and setting `order`, `slug`, `permalink` |
| Contact / footer | `src/_includes/partials/footer.njk` |
| Nav + mobile menu | `src/_includes/partials/nav.njk` |
| Design tokens (colours, type scale, spacing) | top of `src/assets/css/main.css` |
| Motion | `src/assets/js/main.js` (every effect is a small `init*()` you can remove) |
| Diagrams (Skyweaver / Pocket Knights / Don't Die plates) | `src/_includes/diagrams/*.njk` (plain SVG) |
| Résumé (web page + PDF) | `src/resume/index.njk` — edit the HTML, then `npm run resume` to regenerate the PDF (same typography, 2 pages Letter) |

### Adding real screenshots to a case study
Third-party game assets were deliberately **not** shipped (Skyweaver, Pocket Knights, Don't Die use illustrative diagrams). To use official imagery you have rights to:
1. Drop images in `src/assets/work/<slug>/` (WebP, ≤1920px wide).
2. In `src/work/<slug>.njk` set `heroImage`, `heroAlt` (and optionally `heroSrcset`) in the front matter — the diagram is replaced automatically — and/or add a `<div class="case-gallery">…</div>` block like the one in `src/work/shipless.njk`.
3. Optional: set `previewImage` for the hover preview on the home page.

### Portrait
The About section is designed to work without a photo. To add one, place `src/assets/portrait.webp` and add inside `.about__side` (top) in `src/index.njk`:
```html
<figure class="about__portrait"><img src="/assets/portrait.webp" alt="Matthew Shera" width="1200" height="1500" loading="lazy"></figure>
```

## Facts to confirm before launch
- Anomaly Games end date is shown as **2024–2026** (the April 2026 résumé still said "Ongoing").
- The **speaker credit** (NextGen Play: AI & Web3 Gaming Summit panel) comes from your LinkedIn post, not the résumé.
- **Netflix (NDA)** is listed as a consulting client because it appears in `Matthew_Shera_Resume_2026-04_Updated.docx`; drop it if the NDA forbids naming.
- Email is `matthewshera@gmail.com`; a domain address (e.g. `hello@matthewshera.com` via Cloudflare Email Routing) reads better — change `site.json → email` only.
- The hero marquee lists only titles you directed or led. Remove the `.marquee` block in `src/index.njk` if you prefer a stiller page.

## Accessibility & performance
- `prefers-reduced-motion` disables the veil, smooth scroll, parallax and reveals (content is shown immediately).
- Lighthouse (local build): desktop 100 / 100 / 100 / 100 · mobile 94 / 100 / 100 / 100. Remaining mobile points are the deliberate ~1s intro.
- No third-party requests at runtime — fonts, GSAP and Lenis are served from `/assets`.

## Structure
```
src/
  _data/site.json         global data
  _includes/base.njk      HTML shell (head, nav, footer, scripts)
  _includes/case.njk      case-study layout
  _includes/partials/     nav, footer
  _includes/diagrams/     SVG plates
  assets/{css,js,fonts,vendor,work}
  index.njk  work/*.njk  404.njk  sitemap.njk  robots.txt  _headers
scripts/  minify.mjs · og.mjs · shots.mjs (screenshot QA)
```
