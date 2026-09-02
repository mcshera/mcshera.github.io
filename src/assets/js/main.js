/* matthewshera.com — motion & interaction
   Vendored: gsap, ScrollTrigger, SplitText, Lenis (all loaded as globals before this module). */

const html = document.documentElement;
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(pointer: fine)').matches;
const hasGsap = typeof gsap !== 'undefined';

if (hasGsap) {
  gsap.registerPlugin(ScrollTrigger, SplitText);
  gsap.defaults({ ease: 'power4.out', duration: 1.2 });
}

/* ---------------- Lenis smooth scroll ---------------- */
let lenis = null;
function initLenis() {
  if (reduced || !hasGsap || typeof Lenis === 'undefined') return;
  lenis = new Lenis({ lerp: 0.16, wheelMultiplier: 1, smoothWheel: true, syncTouch: false });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}

function scrollToTarget(target, immediate = false) {
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (!el) return;
  const offset = -24;
  if (lenis) lenis.scrollTo(el, { offset, immediate, duration: 1.4, easing: (t) => 1 - Math.pow(1 - t, 4) });
  else el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
}

/* ---------------- Clock (Toronto) ---------------- */
function initClock() {
  const els = document.querySelectorAll('[data-clock]');
  if (!els.length) return;
  const fmt = new Intl.DateTimeFormat('en-CA', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'America/Toronto' });
  const tick = () => {
    const now = new Date();
    const s = fmt.format(now).replace(/^24/, '00');
    els.forEach((el) => { el.textContent = s; el.setAttribute('datetime', now.toISOString()); });
  };
  tick();
  setInterval(tick, 15000);
}

/* ---------------- Veil: page transitions (first load has no curtain) ---------------- */
const veil = document.querySelector('.veil');
const arrivedViaVeil = html.classList.contains('veil-cover');
try { sessionStorage.removeItem('ms-veil'); } catch (_) { /* noop */ }

function veilOut() {
  if (!veil || !hasGsap || !arrivedViaVeil) return Promise.resolve();
  if (reduced) { html.classList.remove('veil-cover'); return Promise.resolve(); }
  veil.style.animation = 'none';
  return gsap.to(veil, { yPercent: -101, duration: 0.55, ease: 'power3.inOut', onComplete: () => { veil.style.visibility = 'hidden'; html.classList.remove('veil-cover'); } }).then();
}
function veilIn() {
  if (!veil || !hasGsap || reduced) return Promise.resolve();
  try { sessionStorage.setItem('ms-veil', '1'); } catch (_) { /* noop */ }
  veil.style.animation = 'none';
  veil.style.visibility = 'visible';
  gsap.set(veil, { yPercent: 101 });
  return gsap.to(veil, { yPercent: 0, duration: 0.45, ease: 'power3.inOut' }).then();
}

function initTransitions() {
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[data-transition]');
    if (!a) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || a.target === '_blank') return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin) return;
    // same page + hash → smooth scroll instead
    if (url.pathname === location.pathname && url.hash) {
      e.preventDefault();
      closeMenu();
      scrollToTarget(url.hash);
      history.replaceState(null, '', url.hash);
      return;
    }
    e.preventDefault();
    veilIn().then(() => { location.href = url.href; });
  });

  document.querySelectorAll('[data-top]').forEach((a) => a.addEventListener('click', (e) => {
    e.preventDefault();
    if (lenis) lenis.scrollTo(0, { duration: 1.6, easing: (t) => 1 - Math.pow(1 - t, 4) });
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  }));

  // Back/forward cache: make sure the veil is not stuck
  window.addEventListener('pageshow', (e) => { if (e.persisted && veil) { gsap.set(veil, { yPercent: -101 }); veil.style.visibility = 'hidden'; html.classList.remove('veil-cover'); try { sessionStorage.removeItem('ms-veil'); } catch (_) {} } });
}

/* ---------------- Menu (mobile) ---------------- */
const menu = document.querySelector('[data-menu]');
const menuToggle = document.querySelector('[data-menu-toggle]');
function closeMenu() {
  if (!menu || !menu.classList.contains('is-open')) return;
  menu.classList.remove('is-open');
  menu.setAttribute('inert', '');
  html.classList.remove('menu-open');
  menuToggle?.setAttribute('aria-expanded', 'false');
  const t = document.querySelector('[data-menu-text]'); if (t) t.textContent = 'Menu';
  lenis?.start();
}
function openMenu() {
  if (!menu) return;
  menu.classList.add('is-open');
  menu.removeAttribute('inert');
  html.classList.add('menu-open');
  menuToggle?.setAttribute('aria-expanded', 'true');
  const t = document.querySelector('[data-menu-text]'); if (t) t.textContent = 'Close';
  lenis?.stop();
}
function initMenu() {
  if (!menu || !menuToggle) return;
  menuToggle.addEventListener('click', () => (menu.classList.contains('is-open') ? closeMenu() : openMenu()));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });
}

/* ---------------- Nav: hide on scroll down ---------------- */
function initNav() {
  const nav = document.querySelector('[data-nav]');
  if (!nav || !hasGsap) return;
  let last = 0;
  const onScroll = (y) => {
    if (y > last && y > 120) nav.classList.add('is-hidden');
    else nav.classList.remove('is-hidden');
    last = y;
  };
  if (lenis) lenis.on('scroll', ({ scroll }) => onScroll(scroll));
  else window.addEventListener('scroll', () => onScroll(window.scrollY), { passive: true });
}

/* ---------------- Split lines ---------------- */
function wrapLines(lines) {
  lines.forEach((line) => {
    const mask = document.createElement('div');
    mask.className = 'line-mask';
    line.parentNode.insertBefore(mask, line);
    mask.appendChild(line);
  });
}

function splitHeading(el, { trigger = true, delay = 0 } = {}) {
  if (!hasGsap) { el.classList.add('is-split'); return null; }
  if (reduced) { el.classList.add('is-split'); return null; }
  return SplitText.create(el, {
    type: 'lines',
    linesClass: 'line',
    autoSplit: true,
    onSplit(self) {
      wrapLines(self.lines);
      el.classList.add('is-split');
      const vars = { yPercent: 130, duration: trigger ? 1.5 : 1.3, stagger: 0.085, ease: 'power4.out', delay };
      if (trigger) vars.scrollTrigger = { trigger: el, start: 'top 88%', once: true };
      return gsap.from(self.lines, vars);
    },
  });
}

/* ---------------- Reveals ---------------- */
function initReveals() {
  const items = document.querySelectorAll('[data-reveal]:not([data-hero]), [data-fade]');
  if (!hasGsap || reduced) {
    items.forEach((el) => el.classList.add('is-in'));
    document.querySelectorAll('[data-split]').forEach((el) => el.classList.add('is-split'));
    return;
  }
  items.forEach((el) => {
    ScrollTrigger.create({
      trigger: el, start: 'top 90%', once: true,
      onEnter: () => el.classList.add('is-in'),
    });
  });
  document.querySelectorAll('[data-split]:not([data-hero])').forEach((el) => splitHeading(el));

  // Staggered groups
  document.querySelectorAll('[data-stagger]').forEach((group) => {
    const kids = group.children;
    gsap.from(kids, {
      y: 28, opacity: 0, duration: 1.1, stagger: 0.08, ease: 'power3.out',
      scrollTrigger: { trigger: group, start: 'top 85%', once: true },
    });
  });
}

/* ---------------- Hero intro ---------------- */
function initHero() {
  const hero = document.querySelector('[data-hero-root]');
  const heroHeadings = document.querySelectorAll('[data-split][data-hero]');
  const heroReveals = document.querySelectorAll('[data-reveal][data-hero]');
  const nav = document.querySelector('[data-nav]');

  if (!hasGsap || reduced) {
    heroHeadings.forEach((el) => el.classList.add('is-split'));
    heroReveals.forEach((el) => el.classList.add('is-in'));
    veilOut();
    return;
  }
  if (nav) gsap.set(nav, { opacity: 0 });

  veilOut();
  const base = arrivedViaVeil ? 0.2 : 0.05; // start immediately (or as the curtain lifts)
  heroHeadings.forEach((el) => splitHeading(el, { trigger: false, delay: base + 0.2 }));
  gsap.delayedCall(base + 0.05, () => { if (nav) gsap.to(nav, { opacity: 1, duration: 1.2 }); });
  heroReveals.forEach((el, i) => gsap.delayedCall(base + 0.35 + i * 0.08, () => el.classList.add('is-in')));
  if (hero) hero.classList.add('is-ready');
}

/* ---------------- Featured plate scrub + living Erebus ---------------- */
function initPlates() {
  if (!hasGsap || reduced) return;
  document.querySelectorAll('.plate').forEach((plate) => {
    // One CSS variable drives frame (scaleX p) and inner (scaleX 1/p): compositor-only, no repaint.
    gsap.to(plate, { '--p': 1, ease: 'none', scrollTrigger: { trigger: plate, start: 'top 90%', end: 'top 20%', scrub: 0.5 } });
    const scene = plate.querySelector('.erebus');
    if (scene) gsap.fromTo(scene, { yPercent: -4 }, { yPercent: 4, ease: 'none', scrollTrigger: { trigger: plate, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
  document.querySelectorAll('.case-plate img, .about__portrait img, .case-plate--scene .erebus').forEach((el) => {
    gsap.fromTo(el, { yPercent: -4 }, { yPercent: 4, ease: 'none', scrollTrigger: { trigger: el.closest('figure') || el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
  // Cursor parallax on the ship (desktop only): the station leans away from the pointer.
  if (!finePointer) return;
  document.querySelectorAll('.erebus').forEach((scene) => {
    const ship = scene.querySelector('[data-parallax-ship]');
    const space = scene.querySelector('.erebus__space');
    if (!ship) return;
    const host = scene.closest('.plate, .case-plate') || scene;
    const xTo = gsap.quickTo(ship, 'x', { duration: 1.2, ease: 'power2.out' });
    const yTo = gsap.quickTo(ship, 'y', { duration: 1.2, ease: 'power2.out' });
    host.addEventListener('mousemove', (e) => {
      const r = host.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - 0.5;
      const ny = (e.clientY - r.top) / r.height - 0.5;
      xTo(nx * -28); yTo(ny * -20);
    }, { passive: true });
    host.addEventListener('mouseleave', () => { xTo(0); yTo(0); });
  });
}

/* ---------------- Theme morph ---------------- */
function initTheme() {
  const zones = document.querySelectorAll('[data-theme-zone]');
  if (!zones.length) return;
  if (!hasGsap || reduced) return; // stay on the page's default theme
  const base = html.getAttribute('data-theme') || 'paper';
  zones.forEach((zone) => {
    const theme = zone.getAttribute('data-theme-zone');
    ScrollTrigger.create({
      trigger: zone, start: 'top 65%', end: 'bottom 35%',
      onToggle: (self) => html.setAttribute('data-theme', self.isActive ? theme : base),
    });
  });
}

/* ---------------- Diagrams: draw-on ---------------- */
function initDiagrams() {
  document.querySelectorAll('.diagram').forEach((svg) => {
    const paths = svg.querySelectorAll('.draw');
    const dots = svg.querySelectorAll('.dot, .dot--accent, .pop');
    const labels = svg.querySelectorAll('text');
    if (!hasGsap || reduced) return;
    paths.forEach((p) => {
      const len = p.getTotalLength ? p.getTotalLength() : 1000;
      p.style.strokeDasharray = len;
      p.style.strokeDashoffset = len;
    });
    gsap.set(dots, { scale: 0, transformOrigin: '50% 50%' });
    gsap.set(labels, { opacity: 0 });
    const tl = gsap.timeline({ scrollTrigger: { trigger: svg, start: 'top 75%', once: true } });
    tl.to(paths, { strokeDashoffset: 0, duration: 2.2, ease: 'power2.inOut', stagger: 0.12 }, 0)
      .to(dots, { scale: 1, duration: 0.6, ease: 'back.out(2)', stagger: 0.05 }, 0.9)
      .to(labels, { opacity: 1, duration: 0.8, stagger: 0.04 }, 1.1);
  });
}

/* ---------------- Cursor ---------------- */
function initCursor() {
  const cursor = document.querySelector('.cursor');
  if (!cursor || !finePointer || reduced || !hasGsap) return;
  html.classList.add('has-cursor');
  const label = cursor.querySelector('.cursor__label');
  const xTo = gsap.quickTo(cursor, 'x', { duration: 0.28, ease: 'power3.out' });
  const yTo = gsap.quickTo(cursor, 'y', { duration: 0.28, ease: 'power3.out' });
  let shown = false;
  window.addEventListener('mousemove', (e) => {
    xTo(e.clientX); yTo(e.clientY);
    if (!shown) { shown = true; gsap.to(cursor, { opacity: 1, duration: 0.4 }); }
  }, { passive: true });
  document.addEventListener('mouseleave', () => gsap.to(cursor, { opacity: 0, duration: 0.3 }));
  document.addEventListener('mouseenter', () => { if (shown) gsap.to(cursor, { opacity: 1, duration: 0.3 }); });
  document.addEventListener('mouseover', (e) => {
    const t = e.target.closest('[data-cursor]');
    cursor.classList.remove('is-view', 'is-hidden');
    cursor.classList.toggle('is-on-plate', !!e.target.closest('.plate, .case-plate, .work-preview'));
    if (!t) return;
    const mode = t.getAttribute('data-cursor');
    if (mode === 'hide') cursor.classList.add('is-hidden');
    else { label.textContent = mode === 'view' ? 'View' : mode; cursor.classList.add('is-view'); }
  });
}

/* ---------------- Work hover preview ---------------- */
function initWorkPreview() {
  const box = document.querySelector('.work-preview');
  const rows = document.querySelectorAll('.work-row[data-slug]');
  if (!box || !rows.length || !finePointer || reduced || !hasGsap) return;
  const xTo = gsap.quickTo(box, 'x', { duration: 0.45, ease: 'power3.out' });
  const yTo = gsap.quickTo(box, 'y', { duration: 0.45, ease: 'power3.out' });
  const baseWidth = box.offsetWidth;
  let activeRow = null;
  const textRect = (el) => { const r = document.createRange(); r.selectNodeContents(el); return r.getBoundingClientRect(); };
  const place = (e) => {
    if (!activeRow) return;
    const meta = activeRow.querySelector('.work-row__meta');
    const title = activeRow.querySelector('.work-row__title');
    const maxRight = (meta ? meta.getBoundingClientRect().left : window.innerWidth) - 24;
    const minLeft = (title ? textRect(title).right : 0) + 24;
    // Fit the card into the gap between the title and the description; never cover either.
    const gap = maxRight - minLeft;
    const w = Math.max(200, Math.min(baseWidth, gap));
    box.style.width = w + 'px';
    const h = w * 5 / 8;
    let x = e.clientX + 32 + w / 2;
    if (x + w / 2 > maxRight) x = maxRight - w / 2;
    if (x - w / 2 < minLeft) x = minLeft + w / 2;
    const y = Math.max(h / 2 + 16, Math.min(window.innerHeight - h / 2 - 16, e.clientY));
    xTo(x); yTo(y);
  };
  window.addEventListener('mousemove', place, { passive: true });
  rows.forEach((row) => {
    row.addEventListener('mouseenter', (e) => {
      const slug = row.getAttribute('data-slug');
      box.querySelectorAll('.work-preview__item').forEach((it) => it.classList.toggle('is-active', it.getAttribute('data-preview') === slug));
      activeRow = row;
      place(e);
      gsap.to(box, { opacity: 1, scale: 1, duration: 0.45, ease: 'power3.out', overwrite: 'auto' });
    });
    row.addEventListener('mouseleave', () => {
      activeRow = null;
      gsap.to(box, { opacity: 0, scale: 0.96, duration: 0.35, ease: 'power3.out', overwrite: 'auto' });
    });
  });
}

/* ---------------- Marquee ---------------- */
function initMarquee() {
  document.querySelectorAll('.marquee__track').forEach((track) => {
    const clone = track.innerHTML;
    track.innerHTML = clone + clone; // two copies → translateX(-50%) loops seamlessly
  });
}

/* ---------------- Hash on arrival ---------------- */
function initHashArrival() {
  if (!location.hash) return;
  const target = document.querySelector(location.hash);
  if (!target) return;
  // Let layout settle, then jump (no smooth) so the veil lifts on the right section
  requestAnimationFrame(() => {
    if (lenis) lenis.scrollTo(target, { immediate: true, offset: -24, force: true });
    else target.scrollIntoView();
    ScrollTrigger.refresh();
    setTimeout(() => ScrollTrigger.refresh(), 300);
  });
}

/* ---------------- Boot ---------------- */
async function boot() {
  initClock();
  initMenu();
  initMarquee();
  initLenis();
  initTransitions();
  initNav();

  try { await document.fonts.ready; } catch (_) { /* noop */ }

  initHashArrival();
  initHero();
  initReveals();
  initPlates();
  initTheme();
  initDiagrams();
  initCursor();
  initWorkPreview();

  if (hasGsap) {
    window.addEventListener('load', () => ScrollTrigger.refresh());
    // images/fonts may shift layout after we measured — refresh once more shortly after
    setTimeout(() => ScrollTrigger.refresh(), 800);
  }
}

boot();
