// Generate src/assets/Matthew-Shera-Resume.pdf from the /resume/ page (print CSS) using system Chrome.
import { chromium } from 'playwright-core';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('_site');
const CHROME = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
if (!fs.existsSync(CHROME)) { console.log('resume: Chrome not found, skipping (set CHROME_PATH).'); process.exit(0); }
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.woff2': 'font/woff2', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml' };
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p.endsWith('/')) p += 'index.html';
  const file = path.join(root, p);
  if (!file.startsWith(root) || !fs.existsSync(file)) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'content-type': types[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const port = server.address().port;
try {
  const browser = await chromium.launch({ executablePath: CHROME, headless: true });
  const page = await browser.newPage({ viewport: { width: 1100, height: 1400 }, reducedMotion: 'reduce' });
  await page.goto(`http://127.0.0.1:${port}/resume/`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.emulateMedia({ media: 'print' });
  await page.waitForTimeout(200);
  const out = path.resolve('src/assets/Matthew-Shera-Resume.pdf');
  await page.pdf({ path: out, format: 'Letter', printBackground: true, preferCSSPageSize: true, displayHeaderFooter: false });
  fs.copyFileSync(out, path.join(root, 'assets/Matthew-Shera-Resume.pdf'));
  await browser.close();
  console.log('resume: wrote', out);
} finally { server.close(); }
