import { chromium } from 'playwright-core';
const [,, url, label = 'run', dsf = '2'] = process.argv;
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const browser = await chromium.launch({ executablePath: CHROME, headless: true, args: ['--enable-gpu-rasterization'] });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: +dsf });
const page = await ctx.newPage();
await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForTimeout(2500);
const cdp = await ctx.newCDPSession(page);
await cdp.send('Performance.enable');
const m0 = (await cdp.send('Performance.getMetrics')).metrics.reduce((a, m) => (a[m.name] = m.value, a), {});
// frame sampler
await page.evaluate(() => {
  window.__frames = []; window.__long = [];
  let last = performance.now();
  const loop = (t) => { window.__frames.push(t - last); last = t; requestAnimationFrame(loop); };
  requestAnimationFrame(loop);
  try { new PerformanceObserver((l) => l.getEntries().forEach((e) => window.__long.push(e.duration))).observe({ type: 'longtask', buffered: true }); } catch (_) {}
});
await page.mouse.move(700, 450);
const total = await page.evaluate(() => document.documentElement.scrollHeight);
const t0 = Date.now();
for (let y = 0; y < total; y += 120) { await page.mouse.wheel(0, 120); await page.mouse.move(700 + (y % 200) / 4, 450 + (y % 300) / 6); await page.waitForTimeout(16); }
await page.waitForTimeout(1500);
for (let y = total; y > 0; y -= 240) { await page.mouse.wheel(0, -240); await page.waitForTimeout(16); }
await page.waitForTimeout(1200);
const res = await page.evaluate(() => {
  const f = window.__frames.slice(5).sort((a, b) => a - b);
  const p = (q) => f[Math.floor(f.length * q)];
  return { frames: f.length, p50: +p(0.5).toFixed(1), p95: +p(0.95).toFixed(1), p99: +p(0.99).toFixed(1), over32: f.filter((x) => x > 32).length, over50: f.filter((x) => x > 50).length, longTasks: window.__long.length, longTotalMs: Math.round(window.__long.reduce((a, b) => a + b, 0)) };
});
const m1 = (await cdp.send('Performance.getMetrics')).metrics.reduce((a, m) => (a[m.name] = m.value, a), {});
const d = (k) => +((m1[k] || 0) - (m0[k] || 0)).toFixed(3);
console.log(label, JSON.stringify({ ...res, elapsedMs: Date.now() - t0, layouts: d('LayoutCount'), styleRecalcs: d('RecalcStyleCount'), scriptS: d('ScriptDuration'), layoutS: d('LayoutDuration'), styleS: d('RecalcStyleDuration'), taskS: d('TaskDuration') }));
await browser.close();
