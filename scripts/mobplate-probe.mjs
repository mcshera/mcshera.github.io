import { chromium } from 'playwright-core';
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const browser = await chromium.launch({ executablePath: CHROME, headless: true });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
const page = await ctx.newPage();
await page.goto('http://127.0.0.1:8089/', { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
const plate = await page.$('.plate'); const bb = await plate.boundingBox();
await page.evaluate((y) => window.scrollTo(0, y), bb.y - 60); await page.waitForTimeout(1500);
await page.screenshot({ path: '.scratch/scenes/mob-plate.png' });
// reduced motion desktop check
const ctx2 = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
const p2 = await ctx2.newPage(); await p2.goto('http://127.0.0.1:8089/', { waitUntil: 'networkidle' }); await p2.waitForTimeout(600);
await p2.evaluate(() => window.scrollTo(0, 600)); await p2.waitForTimeout(400);
await p2.screenshot({ path: '.scratch/scenes/rm-plate.png' });
const pv = await p2.evaluate(() => getComputedStyle(document.querySelector('.plate')).getPropertyValue('--p'));
console.log('reduced-motion --p:', pv.trim());
await browser.close();
