import { chromium } from 'playwright-core';
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const browser = await chromium.launch({ executablePath: CHROME, headless: true });
for (const [w, h] of [[1920, 1080], [1440, 900], [1280, 800], [1100, 760], [390, 844]]) {
  const page = await browser.newPage({ viewport: { width: w, height: h }, reducedMotion: 'reduce' });
  await page.goto('http://127.0.0.1:8089/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  const m = await page.evaluate(() => {
    const plate = document.querySelector('.plate').getBoundingClientRect();
    const h1 = document.querySelector('.hero__title');
    const lines = h1.querySelectorAll('.line').length || Math.round(h1.getBoundingClientRect().height / parseFloat(getComputedStyle(h1).lineHeight));
    const fs = getComputedStyle(h1).fontSize;
    const intro = document.querySelector('.hero__intro').getBoundingClientRect();
    const introLines = Math.round(intro.height / parseFloat(getComputedStyle(document.querySelector('.hero__intro')).lineHeight));
    return { plateTop: Math.round(plate.top), h1Lines: lines, h1FontSize: fs, introLines, h1Text: h1.innerText.replace(/\n/g, ' / ') };
  });
  console.log(w + 'x' + h, JSON.stringify(m));
  await page.close();
}
await browser.close();
