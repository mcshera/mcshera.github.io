# matthewshera.com — Design & Copy Review

Review-only pass. No project files were changed except this one.
Basis: full-page captures in `.scratch/shots-static/` (home, 4 case studies, 404 × desktop 1440 / laptop 1280 / mobile 390), motion captures in `.scratch/scenes/`, source copy in `src/index.njk`, `src/work/*.njk`, `src/_includes/partials/{nav,footer}.njk`, `src/_includes/case.njk`, `src/404.njk`, `src/_data/site.json`, and the résumé PDF at `src/assets/Matthew-Shera-Resume.pdf` (used as the fact source).
Snapshot: source files as of 2026-09-02 13:05. Note: `nav.njk` and `main.css` were being edited during the review; copy files were stable.

Capture note: the black boxes in the static SHIPLESS captures (crew strip, gallery) are `loading="lazy"` images not triggered by the full-page screenshot. The `scenes/work-shipless-*` captures confirm they load. Not a bug.

Brief in one line: the bones are right — paper/ink, Instrument Serif + Geist, hairlines, one garnet accent. What weakens "expensive and timeless" is (1) claims that do not match the résumé, (2) a Gmail address set at 49 px, (3) three agency-template tics (marquee, count-up counters, cursor-following preview), and (4) line-break hygiene.

---

## (a) Top 10 highest-impact fixes

### 1. Claims that are not in the résumé — verify or remove
A director-level reader will open the PDF résumé (it is linked twice) and compare. Anything on the site that the PDF does not support reads as inflation.

| Where | Site says | Résumé says | Change |
|---|---|---|---|
| `index.njk` "Also" list, About ¶2, timeline "2018 —" | **Netflix** as a consulting client (3 mentions; "Unannounced (NDA) · Netflix") | Freelance projects: "Eve: Frontier (CCP Games), Palphabet, Marvel Snap (Second Dinner)". No Netflix. | Remove all three mentions, or add Netflix to the PDF first. Do not list an NDA client by name unless the NDA allows it. |
| `index.njk` Recognition | "**Speaker** — NextGen Play: AI & Web3 Gaming Summit, 'The Future of Game Ownership'" | Not present. | Remove, or add to the PDF. |
| `skyweaver.njk` "How it went"; `index.njk` numbers "7 Designers led — A junior team grown into a senior one" | "seven junior designers become **senior** ones" | "managing a team of 7 Junior Game Designers" | Use the home-page wording everywhere: "seven junior designers who became better designers". Number label → "Seven junior designers, led for four years". |
| Timeline "2024 — 26 Game Director, Anomaly Games"; case meta "2024 — 2026" | Anomaly role ended 2026 | "Game Director - Anomaly 2024-Ongoing" | Confirm the end date with Matthew. If he is still at Anomaly, use "2024 —". |
| Case meta / timeline "Anomaly Games" vs prose "Anomaly" (14 vs 7 uses) | Two names for one studio | "Anomaly" | Pick the legal/brand name once in meta and timeline; short form "Anomaly" in prose is fine (as done for Horizon). |
| `shipless.njk` lede "Designed, built, **illustrated** and balanced" | Build section says "I directed the art" | — | "Designed, built, art-directed and balanced end to end by one person". Do not claim illustration if the art was directed/generated. |
| PDF résumé itself | No Shipless Inc. entry, still "Anomaly 2024-Ongoing" | — | Update the PDF so it agrees with the site (Shipless Inc. 2026 —, Anomaly end date). The site and PDF currently tell two different stories. |

Personal details with no source (fine if true, confirm with Matthew): "I was four when my sister handed me my first pack of Magic cards"; "+47% player satisfaction — Skyweaver **player surveys**" (résumé gives the number, not the method — drop "player surveys"); SHIPLESS process numbers (1,800 / 66 / 11× / 45 pts) come from the project, not the résumé.

### 2. `matthewshera@gmail.com` set at 49 px in the footer (and in the mobile menu)
After the headline, the largest text in the footer is a Gmail address. Nothing on the site says "inexpensive" faster.
Change: set up `hello@matthewshera.com` (domain forwarding to Gmail is free with most registrars / Cloudflare Email Routing), update `site.json → email`. Everything else (footer, menu, JSON-LD) follows.

### 3. Hero: zero imagery above the fold at 1440×900 and 1280×800
Measured: the featured plate starts at y=901 (desktop) and y=827 (laptop). The first screen is type only, with a 151 px dead band under the intro paragraph. The only scroll cue is a 15 px "Selected work ↓".
Change: `.plate-wrap { margin-top: clamp(40px, 5vw, 72px); }` (from `clamp(64px, 10vw, 160px)`) and `.hero__row { margin-top: clamp(32px, 4.5vw, 64px); }` so ~120 px of the plate crests the fold. The clip-path reveal then also starts on screen, which is where it belongs.

### 4. Hero eyebrow / status cluster says the same thing three times
- Nav brand already reads "Matthew Shera / GAME DIRECTOR"; 110 px below it the eyebrow repeats "GAME DIRECTOR & SYSTEMS DESIGNER".
- "PORTFOLIO — 2020 · 2026" uses a middle dot as a range.
- The pulsing garnet dot (a "live/available" convention) sits next to a job title, "FOUNDER, SHIPLESS INC.", which is not a status.
Change: eyebrow left → "Selected work, 2020–2026" (drop the role; the nav has it); eyebrow right → "Toronto" or drop; status → `{{ site.availability }}` = "Open to director-level conversations" so the dot means what dots mean. Footer keeps the long form.

### 5. Work-row meta breaks years across lines (all breakpoints)
Seen at 1440 and 1280: "FOUNDER, DIRECTOR & SOLE DEVELOPER · SHIPLESS INC. · / 2026 —" and "HORIZON BLOCKCHAIN GAMES · 2020 — / 2024". On 390 the tags run to three lines of tracked uppercase mono under every row.
Change in `index.njk`: wrap the years — `<span class="nowrap">{{ w.data.years }}</span>` with `.nowrap { white-space: nowrap }`; write ranges with a closed en dash ("2020–2024") so they cannot break. On ≤860 px show role only: `.work-row__tags { … }` → output `{{ w.data.role }}` and hide studio/years, or `display:none` for the whole tags line — the case page has the full meta table.

### 6. Remove the marquee
It is the one element that reads "agency template", it runs forever, and it flattens "directed" titles with consulting credits (Marvel Snap and EVE Frontier scroll past at the same weight as Goonville). The "Also" list 200 px below already lists every name with its correct role. Delete `.marquee` from `index.njk` (CSS already excludes it from print).

### 7. Remove the count-up counters
"$0.00 → $2.41", "0 → 7", "0 → 3" ticking for 2.2 s is a landing-page trope. A timeless site states the number. Drop `data-count`/`data-prefix`/`data-suffix` and keep the existing `data-stagger` fade, which is enough motion for that grid.

### 8. Work hover preview: invisible card in the ink theme, and it covers the copy
Measured contrast of the preview plate `#17171A` on the ink background `#0B0B0C` is **1.10:1** — the card edge disappears; only "+240%" floats. Because it follows the cursor, it lands on the row's description text when the pointer is over the title (see `scenes/home-y2200.png`).
Change: `.work-preview { border: 1px solid var(--line); }` plus `--plate: #1C1C1F` in ink; anchor x to the row's arrow column (fixed right edge, `y` follows the cursor) instead of `clientX + 40`. Better: show previews only where there is an image (SHIPLESS) and use the three diagram SVGs as previews for the rest — the "n → ∞" text plate does not explain Don’t Die to anyone.

### 9. Line-break hygiene (orphans, split titles)
- `.display-s` section heads orphan the last word: "…earn its place in a / **pocket.**" (Pocket Knights), "…a ladder you / **climb.**" (Don’t Die), "…and everything / **on top of it.**" (SHIPLESS). `.display-xl/-l/-m` have `text-wrap: balance`; `.display-s` does not. Add it, and `max-width: 20ch`.
- Hero intro at 1280 breaks the game title: "Don’t / Die". Set `.hero__intro a { white-space: nowrap }` (the three title links) or use `Don’t&nbsp;Die` wherever the title appears in running text.
- Footer title breaks "Let’s make / something *worth* / *mastering.*" (14ch). Set `max-width: 21ch` → "Let’s make something / *worth mastering.*"
- Hero H1 ends line 1 on an article: "Games that earn the / years you give them." Insert `<br class="desk">` after "earn" (hide on ≤700 px): "Games that *earn* / the years you give them."

### 10. Mobile (390) — three fixes
- Hero plate is 4:5 with `object-fit: cover`; the Erebus sits right of centre in the 16:9 art, so half the ship is cropped off the right edge. Add `object-position: 72% 50%` on `.plate__media` at ≤700 px (same for `.case-plate img` on the SHIPLESS page).
- `.principle { grid-template-columns: 56px 1fr }` costs 72 px (18 %) of a 350 px content width; titles wrap to two lines and body runs ~7 words/line. At ≤480 px stack: `grid-template-columns: 1fr; .principle__num { margin-bottom: 10px }`.
- `.section-head` wraps its labels: "SELECTED / WORK" and "04 CASE STUDIES · 2020 — / 2026". At ≤480 px: `flex-direction: column; gap: 6px; align-items: flex-start`, and drop the case count on mobile.

---

## (b) Typography & layout notes per breakpoint

Computed from the tokens: display-xl / -l / -m / -s and body sizes are 135 / 89 / 52 / 27 / 20 px at 1440; 120 / 79 / 46 / 24 / 19.7 px at 1280; 48 / 38 / 30 / 22 / 17 px at 390. Mono is fixed at 12 px, tracked +0.12 em, uppercase. Contrast: `--ink-2` 7.7:1, `--ink-3` 5.0:1 on paper; 9.4:1 and 5.8:1 in ink. All pass.

### Desktop 1440 (viewport 900)
- Hero: H1 at 135 px, two lines, left 65 % of the width. Good. Right column is empty from the eyebrow rule down to the status block — ~600 × 500 px of paper. It reads as intentional restraint only if the plate crests the fold (fix #3).
- Case-study body column: 7 of 12 columns = 744 px at 20 px Geist ≈ 74 characters/line. Upper edge of comfortable. Cap it: `.case-section__body { max-width: 34em }` (≈ 68 ch) and let the right margin breathe.
- Case section head (`.display-s`, 27 px) vs body (20 px): the hierarchy gap is too small; the head reads as a subtitle and the mono label above it does the real work. Either move heads to `--fs-m` at 1440 (52 px, 2 lines in 4 columns) or keep 27 px and make the head italic to separate it from body weight.
- Case meta (`.case-meta`, 5 equal columns): "Disciplines" wraps to 3 lines and hyphenates "go-to-/market"; the row reads uneven. Use `grid-template-columns: repeat(4, 1fr) 2fr` or cut disciplines to four words.
- Case hero repeats the years twice within 250 px: eyebrow right ("2026 —") and meta "Years 2026 —". Put studio or platform in the eyebrow instead, or drop the Years cell.
- Numbers grid (`.numbers`, 3×2): the mono labels sit at different heights across a row ("RETENTION LIFT" at y≈375 vs "ARPU, FROM $0.23" at y≈397) because `.number` is `justify-content: space-between` and the `<small>` lines differ (2 vs 1). Use `justify-content: flex-start; gap: 18px` so labels hug the numerals and align; same for `.case-numbers`.
- Diagram plates (Skyweaver, Pocket Knights, Don’t Die): 16:9 black plates with the drawing occupying ~55 % of the height — ~90 px of dead black above and ~160 px below (Pocket Knights). Use `aspect-ratio: 2 / 1` for `.case-plate--diagram`, or scale the SVG to fill.
- Principle bodies: the inline `<q>` at 1.12 em italic serif inside 20 px Geist gives uneven leading in the last 2–3 lines and orphans ("…want to be / heroes.”"). Set `q { display: block; margin-top: .8em; font-size: 1.25em; line-height: 1.25 }` so the quote is its own line — it is the best sentence in each block and deserves the room.
- "Also" list, two columns: reading order is row-wise (Goonville | Gmeow; Moo.F.O. | Arena MMO…), so the Consulting entries split across columns. Either one column ordered by relationship (Directed → Systems → Consulting → Personal) or `grid-auto-flow: column` with an explicit `grid-template-rows: repeat(5, auto)`.
- "Palphabet — CONSULTING" is the only entry with no studio; it looks unfinished next to nine complete rows. "Consulting · Independent", or fold Palphabet into the freelance timeline line only.
- Work rows: at `64px 1fr 36% 48px` the titles (52 px) and description (15 px, 36 ch) are well balanced. Keep.
- Footer: 200 px top padding on top of the About section's own bottom space makes a ~450 px empty band between the facts grid and "Contact". Trim `.footer { padding-block: clamp(80px, 10vw, 140px) 40px }`.

### Laptop 1280 (viewport 800)
- Same fold problem (plate at y=827) and the same meta wrapping as 1440 — the 36 % meta column is 415 px, and the mono line ("LEAD GAME DESIGNER · HORIZON BLOCKCHAIN GAMES · 2020 — 2024") needs ~470 px.
- Hero intro (`.measure` 34em at 25 px = 850 px, but grid-limited to 6 columns ≈ 560 px) wraps to four lines and splits "Don’t / Die" (fix #9).
- "Also" list: "Arena MMO battler" title and its "SYSTEMS & ECONOMY · CLEVRER" tag are 16 px apart; near-collision. Tags in this list should be allowed to drop under the title below 1000 px (`flex-wrap: wrap`).
- Case body column: 661 px ≈ 67 ch. Correct here; the 1440 cap above makes both consistent.
- Everything else scales cleanly; the fluid tokens are doing their job.

### Mobile 390 (viewport 844)
- H1 at 48 px (the clamp floor) against a 18.7 px lede: the hero loses the drama it has on desktop. Raise the floor: `--fs-xl: clamp(3.4rem, 9.4vw, 10.5rem)` (54 px) — two lines still fit at 15ch.
- Work rows: title 30 px + 15 px description + 3 lines of 12 px tracked mono. The mono is the heaviest visual element on the mobile list. Role only, or hide (fix #5).
- Numbers: single column, six cells × ~170 px = 1,000 px of scrolling for six numbers. Use the 2-column grid down to 390 (the 4-up `.case-numbers` already does this and the 2-line labels fit).
- Gallery (SHIPLESS): `.g-4` squares become full-width 350 × 350 blocks stacked three high. Keep the two 16:10 shots full width and put the three squares in a 3-up row (`.g-4 { grid-column: span 4 }` at ≤700 px), or a horizontal scroll strip.
- Timeline `when` column at 96 px is fine; `.facts` collapses to one column correctly.
- Hero plate crop, principle indent, section-head wrap: fix #10.
- Menu overlay (`scenes/mob-menu.png`): 48 px serif links with 12 px mono numbers, blurb, mail, clock. Well judged. The blurb is the third instance of the same sentence on one screen-height (hero intro is directly beneath the overlay); consider replacing it with the availability line.
- `.footer__mail { word-break: break-all }` will split the address mid-word at very narrow widths; use `overflow-wrap: anywhere`.

### Cross-breakpoint
- Date ranges use spaced em dashes ("2020 — 2024") in meta, abbreviated in the timeline ("2020 — 24", "2024 — 26"), and a middle dot in the hero eyebrow ("2020 · 2026"). Pick one: closed en dash ("2020–2024", "2026–") everywhere, full years. Reserve the em dash for prose.
- Role string for SHIPLESS appears three ways: "Founder · Director · Sole developer" (plate), "Founder, Director & sole developer" (case meta / work row), "Founder & Director, Shipless Inc." (timeline). Use "Founder, director & sole developer" (sentence case) in plate and meta.
- "1,800" (lede, principle, Don’t Die) vs "1,800+" (both number grids). One or the other.
- Footer link "Shipless" → "SHIPLESS" (the game is always set in caps elsewhere) or "shipless.ca".
- `site.json → description` uses a straight apostrophe ("Don't Die"); everywhere else it is curly.

---

## (c) Copy edits (current → proposed)

Style note: the Canadian spelling is consistent (behaviour, centre, armoury, rigour, monetization). Keep it. "Agentic" appears 8 times (home labels and principle, About, SHIPLESS, Pocket Knights, Don’t Die, JSON-LD). It is a 2025 word and will date the site; the résumé needs it for search, the site does not. Keep it once (About) and say "AI agents" / "AI playtests" elsewhere.

**Home — hero**
- "Portfolio — 2020 · 2026" → "Selected work, 2020–2026"
- Status: "Founder, Shipless Inc." (with pulsing dot) → "Open to director-level conversations"
- Plate alt: "The Erebus, a **derelict** mining hauler, drifting against a star field" → "The Erebus, a mining hauler adrift against a star field" (the SHIPLESS case head says "She isn’t derelict.")
- Plate link: "Founder · Director · Sole developer" → "Founder, director & sole developer"

**Home — work**
- "04 case studies · 2020 — 2026" → "04 case studies · 2020–2026"
- "Titles directed, systems shaped, and studios advised along the way." → keep, or "Directed, designed, or advised."
- "Unannounced (NDA) — Consulting · Netflix" → remove (see fix #1)
- "Palphabet — Consulting" → "Palphabet — Consulting · Independent"

**Home — numbers**
- Section head right: "Live games, real players" → contradicted by "Agentic playtests" (AI) and "Years competing" (not a live game). → "Selected results · 2020–2026"
- "Agentic playtests / Full AI playthroughs of SHIPLESS before launch" → "AI playtests / Full playthroughs of SHIPLESS by AI agents before launch"
- "Player satisfaction / Skyweaver player surveys" → "Player satisfaction / Skyweaver"
- "Designers led / A junior team grown into a senior one" → "Junior designers led / Four years, Horizon Blockchain Games"

**Home — approach**
- Principle 04: "…I lead with experience, respect, empathy — and above all, kindness." → cut the sentence. The previous sentence ("feedback that makes someone sharper instead of smaller") already shows it; listing virtues tells it.
- Principle 02: keep the body; set the `<q>` on its own line (see (b)).

**Home — about**
- "…and consulted for CCP Games, Second Dinner and Netflix." → "…and consulted for CCP Games and Second Dinner." (unless Netflix is verified)
- "I use agentic AI workflows every day — for simulation, prototyping and balance —" → "I work with AI agents daily — simulation, prototyping, balance —"
- "When I am not designing games I am usually playing them, badly and then less badly, at a card table somewhere in Toronto." → false modesty two screens after "Top 64, DLC Toronto". → "When I am not designing games I am usually playing them, for keeps, at a card table somewhere in Toronto."
- Timeline "Freelance game designer — CCP Games, Second Dinner, Netflix, Palphabet" → "CCP Games, Second Dinner, Palphabet"
- Recognition "Speaker — NextGen Play…" → remove unless added to the résumé
- Timeline years "2024 — 26", "2020 — 24", "2015 — 18" → "2024–2026", "2020–2024", "2015–2018" (match the case meta)

**Footer**
- "Open to director-level conversations — director and lead roles, studio consulting on systems and economies, or a long conversation about card games." ("director" ×2, "conversation" ×2) → "Open to director and lead roles, studio consulting on systems and economies — or a long conversation about card games."
- Link "Shipless" → "SHIPLESS"

**SHIPLESS (`shipless.njk`)**
- Lede: "Designed, built, illustrated and balanced end to end by one person" → "Designed, built, art-directed and balanced end to end by one person"
- Process head: "We had an AI play it 1,800 times." → "I had AI agents play it 1,800 times." (there is no "we" on a solo project; the rest of the page is "I")
- "I could point skilled agents at it" → "I could point AI agents at it"
- "The result is a small game that is fair at every player count, and a process I would run again on anything I direct." → keep. Good closing line.
- Numbers "1,800+" → "1,800" (match the prose) or change the prose to "more than 1,800 times"

**Skyweaver (`skyweaver.njk`)**
- Lede: "ranked and quests reimagined" → "Ranked 2.0 and Quests 2.0 rebuilt" ("reimagined" is press-release language)
- Context head: "A card game players truly own." → "A card game its players own." ("truly" is filler)
- "What I led" head: "Two expansions and four systems rebuilt from the ground up." → "Two expansions. Four systems rebuilt."
- "How it went" ¶1: "Retention rose 240 percent. Player satisfaction rose 47 percent. Average revenue per user went from twenty-three cents to two dollars and forty-one — on an economy built to reward play." → the grid 120 px above already states all three numbers, and "two dollars and forty-one" is missing "cents". → "Those numbers came from an economy built to reward play, not spend. In 2023 Skyweaver was nominated for Best Mobile Game, Best Card Game and Best Strategy Game at the GAM3 Awards."
- "How it went" ¶2: "Over four years I watched seven junior designers become senior ones. I learned how to hand people the keys to something I could have kept for myself, and how to give feedback…" → the second sentence is repeated verbatim as the pull quote 300 px below. → "Over four years I watched seven junior designers become better designers. I learned to give away work I could have kept, and to give feedback that makes someone sharper instead of smaller." (pull quote unchanged)

**Pocket Knights (`pocket-knights.njk`)**
- "Economy & progression. **Owned** the currency model…" → "Designed the currency model…"
- "Agentic AI workflows. **Architected** MCTS- and CFR-inspired simulation…" → "Simulation. Built MCTS- and CFR-inspired simulation…"
- "I wrote the design docs, ran the reviews, **sat in** the analytics" → "lived in the analytics"
- "I also **proactively** listed what was broken before anyone found it — a habit that keeps trust high **when the pace is**." → the elision reads as a typo. → "I also listed what was broken before anyone found it — a habit that holds trust when the pace is high."
- Summary/lede "from concept to live" → confirm Pocket Knights is live; otherwise "from concept to launch".

**Don’t Die (`dont-die.njk`)**
- "Simulation framework. **Architected** an MCTS- and CFR-inspired harness" → "Built an MCTS- and CFR-inspired harness"
- "Ranked PvP. Directed the ranked mode from spec to review, shipping with the caveats listed up front — functional first, polished next." → reads as an apology. → "Ranked PvP. Directed the ranked mode from spec to ship."
- "Cross-functional direction. Design, engineering and art on one roadmap, with reviews that kept the game’s intent legible to everyone touching it." → "Direction. One roadmap for design, engineering and art, and reviews that kept the game’s intent legible to everyone on it."
- "Why it matters" head: "The method outlived the game." → tells the reader the game is dead (not in the résumé; Anomaly lists it as a live title). → "The method outgrew the game."
- Context ¶2 ends "You cannot feel your way to that. You have to count." and the pull quote is "You cannot feel your way to a thousand runs. You have to count." → acceptable echo; if you want one, keep the pull quote and end the paragraph at "…can quietly warp a thousand runs."

**404 (`404.njk`)**
- "The page you were looking for has been shuffled away. Head back to the start." + link "Back to the beginning" → two CTAs saying the same thing. → body "The page you were looking for has been shuffled away." + link "Back to the beginning"

**Meta**
- `site.json → description`: "Don't Die" → "Don’t Die"
- JSON-LD `knowsAbout` "Agentic AI workflows" → "AI-assisted design" (or keep; not user-visible)

---

## (d) Motion / UX notes

- **Intro**: veil lift 0.85 s + line rise 1.5 s (stagger 0.085) + reveals; hero settles at ~2.1 s. Acceptable once. It replays on every internal navigation (veil in 0.7 s + load + veil out 0.85 s ≈ 1.6 s+ per page). Trim `veilIn` to 0.45 s and `veilOut` to 0.6 s; keep the hero sequence only on first load (`sessionStorage` flag).
- **Theme morph** (paper → ink over the work list and numbers, 900 ms): the best motion on the site. Keep. Trigger at `top 55%` means the "Selected work" rule flips while half visible; `top 65%` would flip it just as the first row enters.
- **Featured plate**: clip-path 22 % → 0 scrub between `top 90%` and `top 20%`, plus ±5 % parallax. Elegant. It currently begins below the fold at 1440/1280, so the first thing a visitor scrolls into is the reveal already half done. Fix #3 solves it.
- **Counters**: remove (fix #7).
- **Marquee**: remove (fix #6). If kept: 70 s is the right speed; restrict the list to titles directed or led.
- **Hover preview**: contrast and anchoring (fix #8). Also `scale .92 → 1` plus 0.6 s `quickTo` lag makes the card trail the cursor by ~60 px; anchoring it fixes this too.
- **Custom cursor** (difference-blend dot, "View" label on plates/rows, hidden on the mail link): restrained, correctly disabled for coarse pointers and reduced motion. Keep. Consider not enlarging to 84 px over the work rows — the row already translates its title 12 px and shows the arrow; two hover signals plus a cursor label is one too many.
- **Lenis** `lerp: 0.09`: slightly floaty; long pages (home is 8,988 px) feel heavier. Try `0.11`–`0.12`. `syncTouch: false` is correct.
- **Nav hide on scroll-down** at y>120: standard; on mobile the "Menu" button disappears until the user scrolls up. Fine, but the 0.6 s hide transition is slow for a 72 px bar; 0.35 s.
- **Split-line masks** (`SplitText` lines, `yPercent: 130`): clean, and `autoSplit` handles resize. One risk: `once: true` at `top 88%` — on a fast scroll to an anchor (`/#about`) the heads inside the target arrive already past the trigger and animate late, over content that is visible. `initHashArrival` refreshes ScrollTrigger; also call `ScrollTrigger.refresh()` after `lenis.scrollTo(..., immediate)` resolves, or skip reveal delays when arriving via hash.
- **Diagram draw-on** (2.2 s stroke, dots `back.out`, labels fade): good, and legible on the paper caption below. Keep.
- **Status dot pulse** (2.4 s infinite): perpetual motion in the hero. Keep only if the label becomes an availability statement (fix #4); otherwise remove the animation.
- **Reduced motion**: every effect has a fallback and `[data-theme-zone]` stays on paper. Exemplary — mention nothing, change nothing.
- **Accessibility**: `inert` on the closed menu, `aria-expanded`, skip link, `<dl>` meta, `aria-labelledby` on sections, `aria-hidden` on decorative SVG and marquee. Solid. `.work-preview` and `.cursor` are `aria-hidden`. Good.
- **Gallery UI shots** (SHIPLESS "The bar between runs", "A fight, mid-roll"): saturated green/cyan buttons ("RESUME RUN", "EXECUTE") are the only colours on the site outside paper/ink/garnet, and they clash with the editorial frame. Prefer shots with less chrome, crop tighter to the painted art, or apply a 6–8 % paper-toned multiply overlay to the two UI captures.

---

## (e) What already works — keep

- The type system: Instrument Serif at 0.94 leading and −0.025 em for display, Geist for reading, Geist Mono at 12 px / +0.12 em for labels. The three voices never fight. The italic `em` used once per headline ("earn", "worth mastering", "isn’t in the deck", "whole team", "hand people the keys") is the signature — do not add more.
- Palette: paper `#F4F1EA`, ink `#111110`, one garnet `#8B1E2D` used for the path in diagrams, the bullets, and the dot. Hairlines at 14 % ink. Nothing else. This is the "expensive" part; protect it.
- Hero line "Games that earn the years you give them." — specific, earned, and it explains the whole portfolio in nine words.
- Case-study skeleton: eyebrow → title → 30em lede → 5-cell meta → plate → mono label + serif head on the left, body on the right → numbers → pull quote → "Next — 02 / 04". Consistent across four pages, so the reader learns it once.
- The three illustrative diagrams for NDA/no-asset titles (retention curve, 15′ session timeline, roll decision tree). Mono labels, hairlines, one garnet path, and an honest caption ("The releases are real; the curve is drawn, not plotted."). This is the right answer to "no screenshots" and the honesty is on-brand.
- The paper → ink theme morph over Work + Numbers, and the numbers grid itself (bordered cells, serif numerals with tabular figures).
- SHIPLESS art direction: the Erebus plate, the six crew portraits in a 2:3 strip, the die / corridor / boss triptych, the caption "Her crew didn’t die. They changed."
- Pull quotes at `--fs-l` with 24ch measure and a mono attribution. Every one of them is a real sentence, not a slogan.
- Footer: "Let’s make something worth mastering." + big mail link + Toronto clock. Correct ending.
- Copy voice overall: first person, short declaratives, concrete nouns (a Tuesday, a train, a laptop at midnight). The weak spots listed in (c) are the exceptions, not the rule.
- Timeline + facts grid on About; `<dl>` meta on case pages; the 404 ("This chapter isn’t in the deck.").
- Engineering hygiene: preloaded subset fonts, `srcset` on the hero, `fetchpriority="high"`, lazy gallery, JSON-LD Person, canonical/OG per page, `prefers-reduced-motion` respected everywhere.
