// Usage: node tools/visual/components.mjs <outDir>                  capture element shots
//        node tools/visual/components.mjs --compose <before> <after> <outDir>   side-by-side PNGs
// Element-level screenshots of the key components, for before/after review of
// aesthetic changes (full-page crops merge into one band once layout shifts).
import { mkdirSync, readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { BASE, launch } from './lib.mjs';

export const SHOTS = [
  ['header', '/', 1400, '.site-header'], ['header-mobile', '/', 390, '.site-header'],
  ['hero', '/', 1400, '.hero'], ['page-hero', '/portfolio/', 1400, '.page-hero'],
  ['expertise', '/', 1400, '.expertise-intro, .services'], ['industry-tiles', '/', 1400, '.industry-cards'],
  ['reference-cards', '/', 1400, '.reference-grid'], ['company-facts', '/about-us/', 1400, '.company-facts'],
  ['filter-chips', '/branchen/', 1400, '.work-filter'], ['filter-chips-mobile', '/branchen/', 390, '.work-filter'],
  ['fact-grid', '/portfolio/', 1400, '.fact-grid'], ['disciplines', '/portfolio/', 1400, '.discipline-table'],
  ['management', '/about-us/', 1400, '.management-card'], ['jobs', '/karriere/', 1400, '.job-card'],
  ['cta', '/portfolio/', 1400, '.page-cta'], ['contact-form', '/kontakt/', 1400, '.contact-form'],
  ['contact-form-mobile', '/kontakt/', 390, '.contact-form'], ['case-facets', '/case-studies/data2ai-platform/', 1400, '.case-facets, .company-values'],
  ['footer', '/', 1400, '.site-footer'], ['footer-mobile', '/', 390, '.site-footer'], ['legal', '/impressum/', 1400, '.legal-copy'],
];

const args = process.argv.slice(2);
const browser = await launch();
const page = await browser.newPage();
await page.setCacheEnabled(false);
if (args[0] === '--compose') {
  const [, before, after, out] = args; mkdirSync(out, { recursive: true });
  await page.goto('about:blank');
  for (const f of readdirSync(before).filter(f => f.endsWith('.png'))) {
    if (!existsSync(`${after}/${f}`)) continue;
    const a = 'data:image/png;base64,' + readFileSync(`${before}/${f}`).toString('base64');
    const b = 'data:image/png;base64,' + readFileSync(`${after}/${f}`).toString('base64');
    const url = await page.evaluate(async (a, b) => {
      const load = s => new Promise(r => { const i = new Image(); i.onload = () => r(i); i.src = s; });
      const [x, y] = await Promise.all([load(a), load(b)]);
      const gap = 24, head = 28, c = document.createElement('canvas');
      c.width = x.width + y.width + gap; c.height = Math.max(x.height, y.height) + head;
      const g = c.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, c.width, c.height);
      g.fillStyle = '#222'; g.font = '600 16px system-ui'; g.fillText('before', 4, 19); g.fillText('after', x.width + gap + 4, 19);
      g.drawImage(x, 0, head); g.drawImage(y, x.width + gap, head);
      g.fillStyle = '#e33'; g.fillRect(x.width + gap / 2 - 1, head, 2, c.height - head);
      return c.toDataURL('image/png');
    }, a, b);
    writeFileSync(`${out}/${f}`, Buffer.from(url.split(',')[1], 'base64'));
  }
  console.log(`composed → ${out}`);
} else {
  const out = args[0]; mkdirSync(out, { recursive: true });
  for (const [name, route, width, selector] of SHOTS) {
    await page.setViewport({ width, height: 900 });
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    await page.goto(BASE + route, { waitUntil: 'networkidle0' });
    await page.evaluate(async () => { for (const i of document.images) i.loading = 'eager'; await Promise.all([...document.images].map(i => i.decode().catch(() => {}))); await document.fonts.ready; });
    const el = await page.$(selector);
    if (!el) { console.log(`skip ${name}: ${selector} not found`); continue; }
    await el.evaluate(e => e.scrollIntoView({ block: 'start' }));
    // the sticky header would cover the top of every other component (CSSOM, CSP-safe)
    await page.evaluate(own => { const h = document.querySelector('.site-header'); if (h && !own) h.style.visibility = 'hidden'; }, name.startsWith('header'));
    await new Promise(r => setTimeout(r, 300));
    await el.screenshot({ path: `${out}/${name}.png` });
  }
  console.log(`captured ${SHOTS.length} component shots → ${out}`);
}
await browser.close();
