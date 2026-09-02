import { chromium } from 'playwright-core';
import fs from 'node:fs';

const [,, baseUrl, outDir, mode = 'static'] = process.argv;
fs.mkdirSync(outDir, { recursive: true });
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const pages = ['/', '/work/shipless/', '/work/skyweaver/', '/work/pocket-knights/', '/work/dont-die/', '/404.html'];
const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'laptop', width: 1280, height: 800 },
  { name: 'mobile', width: 390, height: 844, mobile: true },
];
const browser = await chromium.launch({ executablePath: CHROME, headless: true });
const report = [];
for (const vp of viewports) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: 1, isMobile: !!vp.mobile, hasTouch: !!vp.mobile, reducedMotion: mode === 'static' ? 'reduce' : 'no-preference' });
  for (const path of pages) {
    const page = await ctx.newPage();
    const errors = [];
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('pageerror', (e) => errors.push('PAGEERROR ' + e.message));
    page.on('requestfailed', (r) => errors.push('REQFAIL ' + r.url()));
    await page.goto(baseUrl + path, { waitUntil: 'networkidle' });
    await page.waitForTimeout(mode === 'static' ? 600 : 2600);
    if (mode !== 'static') {
      // scroll through to fire reveals
      const total = await page.evaluate(() => document.documentElement.scrollHeight);
      for (let y = 0; y < total; y += vp.height * 0.6) { await page.evaluate((yy) => window.scrollTo(0, yy), y); await page.waitForTimeout(220); }
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(1200);
    }
    const metrics = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth, innerWidth: window.innerWidth,
      scrollHeight: document.documentElement.scrollHeight,
      title: document.title,
      fonts: Array.from(document.fonts).filter(f => f.status === 'loaded').map(f => f.family + ' ' + f.style).filter((v,i,a)=>a.indexOf(v)===i),
      unsplit: document.querySelectorAll('[data-split]:not(.is-split)').length,
      hiddenReveals: Array.from(document.querySelectorAll('[data-reveal]')).filter(el => getComputedStyle(el).opacity === '0').length,
    }));
    const slug = (path === '/' ? 'home' : path.replace(/\W+/g, '-').replace(/^-|-$/g, '')) + '-' + vp.name;
    await page.screenshot({ path: `${outDir}/${slug}.png`, fullPage: true });
    report.push({ path, vp: vp.name, errors, ...metrics });
    await page.close();
  }
  await ctx.close();
}
await browser.close();
fs.writeFileSync(`${outDir}/report.json`, JSON.stringify(report, null, 2));
for (const r of report) console.log(`${r.vp.padEnd(8)} ${r.path.padEnd(22)} w=${r.scrollWidth}/${r.innerWidth} h=${r.scrollHeight} unsplit=${r.unsplit} hiddenReveals=${r.hiddenReveals} errors=${r.errors.length}${r.errors.length ? ' :: ' + r.errors.slice(0,3).join(' | ') : ''}`);
