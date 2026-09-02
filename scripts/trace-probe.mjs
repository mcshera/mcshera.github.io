import { chromium } from 'playwright-core';
import fs from 'node:fs';
const [,, url, label = 'run', dsf = '2'] = process.argv;
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const browser = await chromium.launch({ executablePath: CHROME, headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: +dsf });
const page = await ctx.newPage();
await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForTimeout(2500);
const cdp = await ctx.newCDPSession(page);
const chunks = [];
cdp.on('Tracing.dataCollected', (d) => chunks.push(...d.value));
await cdp.send('Tracing.start', { categories: 'devtools.timeline,disabled-by-default-devtools.timeline,disabled-by-default-devtools.timeline.frame', options: 'sampling-frequency=10000' });
await page.mouse.move(700, 450);
const total = await page.evaluate(() => document.documentElement.scrollHeight);
for (let y = 0; y < total; y += 120) { await page.mouse.wheel(0, 120); await page.mouse.move(700 + (y % 200) / 4, 450 + (y % 300) / 6); await page.waitForTimeout(16); }
await page.waitForTimeout(1200);
for (let y = total; y > 0; y -= 240) { await page.mouse.wheel(0, -240); await page.waitForTimeout(16); }
await page.waitForTimeout(800);
const done = new Promise((r) => cdp.once('Tracing.tracingComplete', r));
await cdp.send('Tracing.end'); await done;
const sum = {}; const count = {};
for (const e of chunks) {
  if (e.ph !== 'X' || !e.dur) continue;
  sum[e.name] = (sum[e.name] || 0) + e.dur / 1000; count[e.name] = (count[e.name] || 0) + 1;
}
const keys = ['Paint', 'RasterTask', 'UpdateLayerTree', 'UpdateLayer', 'Layout', 'UpdateLayoutTree', 'CompositeLayers', 'PrePaint', 'FunctionCall', 'Animation', 'HitTest', 'DecodeImage', 'ImageDecodeTask', 'Commit'];
const out = {}; for (const k of keys) if (sum[k]) out[k] = { ms: Math.round(sum[k]), n: count[k] };
const frames = chunks.filter((e) => e.name === 'DrawFrame' || e.name === 'BeginFrame').length;
console.log(label, JSON.stringify({ frames, ...out }));
await browser.close();
