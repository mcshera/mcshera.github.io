import { chromium } from 'playwright-core';
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const browser = await chromium.launch({ executablePath: CHROME, headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://127.0.0.1:8089/', { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
const res = await page.evaluate(async () => {
  const el = document.querySelector('.work-more__list li span:last-child');
  const read = () => getComputedStyle(el).color + ' | bg ' + getComputedStyle(document.body).backgroundColor + ' | transition: ' + getComputedStyle(el).transitionProperty;
  const out = [read()];
  document.documentElement.setAttribute('data-theme', 'ink');
  out.push(read());
  await new Promise((r) => setTimeout(r, 300)); out.push(read());
  await new Promise((r) => setTimeout(r, 1200)); out.push(read());
  return out;
});
console.log(res.join('\n'));
await browser.close();
