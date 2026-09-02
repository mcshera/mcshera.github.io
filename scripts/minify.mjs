// Post-build: minify CSS + JS in _site (sources in src/ stay readable).
import { build } from 'esbuild';
import fs from 'node:fs';
const targets = [
  { file: '_site/assets/css/main.css', loader: 'css' },
  { file: '_site/assets/js/main.js', loader: 'js' },
];
for (const t of targets) {
  if (!fs.existsSync(t.file)) continue;
  const before = fs.statSync(t.file).size;
  await build({ entryPoints: [t.file], outfile: t.file, allowOverwrite: true, minify: true, bundle: false, write: true, logLevel: 'silent', target: ['es2020', 'chrome100', 'safari15', 'firefox100'], legalComments: 'none' });
  const after = fs.statSync(t.file).size;
  console.log(`${t.file}: ${before} -> ${after} bytes`);
}
