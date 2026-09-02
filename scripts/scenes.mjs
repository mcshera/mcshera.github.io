import { chromium } from 'playwright-core';
import fs from 'node:fs';
const [,, baseUrl, outDir, path = '/', width = '1440', height = '900', stopsArg = '0'] = process.argv;
fs.mkdirSync(outDir, { recursive: true });
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const browser = await chromium.launch({ executablePath: CHROME, headless: true });
const ctx = await browser.newContext({ viewport: { width: +width, height: +height }, deviceScaleFactor: 1 });
const page = await ctx.newPage();
const errors = [];
page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errors.push(m.type() + ': ' + m.text()); });
page.on('pageerror', (e) => errors.push('PAGEERROR ' + e.message));
await page.goto(baseUrl + path, { waitUntil: 'networkidle' });
await page.mouse.move(+width / 2, +height / 2);
const slug = (path === '/' ? 'home' : path.replace(/\W+/g, '-').replace(/^-|-$/g, ''));
// intro frames
await page.waitForTimeout(350); await page.screenshot({ path: `${outDir}/${slug}-intro-a.png` });
await page.waitForTimeout(700); await page.screenshot({ path: `${outDir}/${slug}-intro-b.png` });
await page.waitForTimeout(1800); await page.screenshot({ path: `${outDir}/${slug}-intro-c.png` });
const stops = stopsArg.split(',').map(Number);
for (const s of stops) {
  // emulate wheel scrolling so Lenis handles it
  const cur = await page.evaluate(() => window.scrollY);
  const delta = s - cur;
  const steps = Math.max(1, Math.round(Math.abs(delta) / 400));
  for (let i = 0; i < steps; i++) { await page.mouse.wheel(0, delta / steps); await page.waitForTimeout(60); }
  await page.waitForTimeout(2200);
  const y = await page.evaluate(() => Math.round(window.scrollY));
  const theme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
  await page.screenshot({ path: `${outDir}/${slug}-y${s}.png` });
  console.log(`stop ${s} -> y=${y} theme=${theme}`);
}
console.log('errors:', JSON.stringify(errors));
await browser.close();
