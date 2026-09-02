# matthewshera.com — build plan

## Positioning
Matthew Shera — Game Director · Systems & Economy Designer · Toronto.
Throughline: a competitive card player since age four who now "builds doors for other people."
Hero line: **Games that earn the years you give them.**

## Proof (from resume, founder bio, public posts)
- Founder & sole developer, Shipless Inc. — SHIPLESS (2026): seeded deterministic dice crawler, 66-card set,
  free digital client + metagame, print pipeline, 1,800+ agentic playtests.
- Game Director, Anomaly Games (2024–2026): Pocket Knights (mobile CCG), Don't Die (dice roguelike),
  Goonville, Gmeow, Moo.F.O.; MCTS/CFR balancing; first-15-minutes onboarding; hiring, GTM, live ops.
- Lead Game Designer, Horizon Blockchain Games (2020–2024): Skyweaver — 7 designers; Clash of Inventors,
  Hexbound Invasion; Hero Abilities, Quests 2.0, Ranked 2.0, Economy 2.0; retention +240%, satisfaction +47%,
  ARPU $0.23 → $2.41; 2023 GAM3 Awards nominee (Best Mobile / Card / Strategy).
- Clevrer (Systems & Economy Designer, 2024), P1 Games (Systems Designer — Final Melody, 2024).
- Consulting since 2018: EVE Frontier (CCP Games), Marvel Snap (Second Dinner), Palphabet, Netflix (NDA).
- Speaker: NextGen Play — AI & Web3 Gaming Summit (SuiPlay), panel "The Future of Game Ownership".
- TCG competitor & coach since 2010 (Magic, Yu-Gi-Oh!, Chaotic, Lorcana; Top 64 DLC Toronto).
- BEng Mechatronics (Hons), Ontario Tech; PSM; ELVTR Game Writing; Google UX.
- Contact: matthewshera@gmail.com · linkedin.com/in/matthew-shera-5949b3141

## Rights
- SHIPLESS imagery = Matthew's own IP → used freely.
- Skyweaver / Pocket Knights / Don't Die → NO third-party assets shipped. Each case study gets an animated
  hairline "system diagram" plate (data-as-art) + an optional image slot the owner can fill later.
- No internal analytics or confidential doc content; resume-level facts only.

## Design system
- Paper #F4F1EA · Ink #101010 · Muted #6B675F · Hairline rgba(16,16,16,.14) · Accent (garnet) #8B1E2D
- Dark plate #0B0B0C with bone text #ECE8DF (work section morphs page background light → dark → light).
- Type: Instrument Serif (display, italics for emphasis) · Geist (text) · Geist Mono (labels), self-hosted.
- Fluid type via clamp(); 12-col grid; margins clamp(20px,5vw,96px); hairline rules; huge whitespace.

## Motion
- Lenis smooth scroll + GSAP ScrollTrigger (vendored). prefers-reduced-motion → static.
- Hero: staggered line-mask reveal; kinetic parallax; featured plate scrub-zooms from inset to full-bleed.
- Work index: editorial rows, cursor-following image preview, magnetic hover.
- Numbers: count-up on enter. Diagrams: stroke draw-on on enter. Section bg colour morph.
- Custom cursor (dot → "View" label). Marquee credits strip. Toronto local clock in nav/footer.

## Pages
/            home: hero · credits marquee · selected work · numbers · principles · about · contact
/work/shipless/  /work/skyweaver/  /work/pocket-knights/  /work/dont-die/   case studies + next-project
/404.html    · sitemap.xml · robots.txt · og.jpg (generated) · favicon.svg

## Stack
Eleventy 3 (Nunjucks) → _site/. Vanilla ES modules. No runtime deps besides vendored gsap/lenis.
Deploy anywhere static (Cloudflare Pages recommended — domain already on Cloudflare).

## Validation gates
build clean · html-validate · Playwright screenshots @1440/1024/390 for every page (viewed) ·
no console errors · no horizontal overflow · Lighthouse ≥ 95 a11y/SEO/best-practices, perf ≥ 90 ·
reduced-motion pass · links resolve.
