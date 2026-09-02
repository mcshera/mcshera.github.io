import { chromium } from 'playwright-core';
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const browser = await chromium.launch({ executablePath: CHROME, headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on('pageerror', (e) => errors.push('PAGEERROR ' + e.message));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
await page.goto('http://127.0.0.1:8089/work/skyweaver/', { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
await page.click('.nav__links a[href="/#work"]');
await page.waitForURL('**/#work'); await page.waitForTimeout(2500);
const a = await page.evaluate(() => ({ url: location.href, y: Math.round(window.scrollY), theme: document.documentElement.getAttribute('data-theme'), veil: getComputedStyle(document.querySelector('.veil')).transform }));
await page.screenshot({ path: '.scratch/scenes/nav-to-work.png' });
// click a work row
await page.hover('.work-row[data-slug="dont-die"]'); await page.waitForTimeout(600);
await page.screenshot({ path: '.scratch/scenes/hover-dontdie.png' });
await page.click('.work-row[data-slug="dont-die"]');
await page.waitForURL('**/work/dont-die/'); await page.waitForTimeout(2500);
const b = await page.evaluate(() => ({ url: location.href, y: Math.round(window.scrollY), theme: document.documentElement.getAttribute('data-theme'), title: document.title }));
await page.screenshot({ path: '.scratch/scenes/after-click.png' });
// back button
await page.goBack(); await page.waitForTimeout(1500);
const c = await page.evaluate(() => ({ url: location.href, veilVisible: getComputedStyle(document.querySelector('.veil')).transform, y: Math.round(window.scrollY) }));
console.log(JSON.stringify({ a, b, c, errors }));
await browser.close();
