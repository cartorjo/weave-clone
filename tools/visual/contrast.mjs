// Usage: node tools/visual/contrast.mjs [--out=report.json]
// Measures text contrast (4.5:1, 3:1 for large text) and UI-boundary contrast
// (3:1: outlines, underlines, focus ring) for every interactive component in
// rest / hover / focus-visible / pressed, against the real background behind it
// (ancestor grounds composited, state-layer overlay included). Exit 1 below AA.
import { writeFileSync } from 'node:fs';
import { BASE, launch } from './lib.mjs';

const COMPONENTS = [
  ['nav link', '/', 1400, '.site-nav > a:not([aria-current])', {}],
  ['header CTA', '/', 1400, '.header-contact', { border: false }],
  ['mobile menu toggle', '/', 390, '#mobile-menu > summary', {}],
  ['mobile menu link', '/', 390, '#mobile-menu .mobile-menu__panel a:not(.mobile-menu__cta)', { open: '#mobile-menu' }],
  ['mobile menu CTA', '/', 390, '#mobile-menu .mobile-menu__cta', { open: '#mobile-menu' }],
  ['filter chip', '/branchen/', 1400, '.filter-button:not(.is-active)', { boundary: true }],
  ['filter chip selected', '/branchen/', 1400, '.filter-button.is-active', { boundary: true }],
  ['reference card', '/branchen/', 1400, '.reference-card:not([hidden])', { text: '.reference-card__copy h3' }],
  ['text link (light)', '/barrierefreiheit/', 1400, '.text-link:not(.text-link--light)', {}],
  ['text link (on dark)', '/portfolio/', 1400, '.text-link--light', {}],
  ['expander toggle', '/about-us/', 1400, '.expander summary', {}],
  ['breadcrumb link (on dark)', '/portfolio/', 1400, '.page-breadcrumb a', {}],
  ['breadcrumb link (light)', '/impressum/', 1400, '.page-breadcrumb a', {}],
  ['footer link', '/', 1400, '.site-footer nav a', {}],
  ['text field', '/kontakt/', 1400, '.contact-form input[name=name]', { underline: true }],
  ['form submit', '/kontakt/', 1400, '.contact-form button[type=submit]', {}],
  ['expertise card', '/404.html', 1400, 'a.expertise-card', { text: 'h3' }],
  ['tag (static)', '/karriere/', 1400, '.tag', { states: ['rest'] }],
];

const measure = (sel, opts) => {
  const parse = c => { const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return null; const [r, g, b, a = 1] = m[1].split(/[ ,/]+/).filter(Boolean).map(Number); return { r, g, b, a }; };
  const over = (top, under) => ({ r: top.r * top.a + under.r * (1 - top.a), g: top.g * top.a + under.g * (1 - top.a), b: top.b * top.a + under.b * (1 - top.a), a: 1 });
  const lum = c => { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b); };
  // translucent colours are composited over the ground before measuring
const ratio = (a, b) => { a = over(a, b); const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
  const ground = el => { // composite ancestor backgrounds, bottom-up
    const chain = []; for (let e = el; e; e = e.parentElement) chain.push(e);
    let c = { r: 255, g: 255, b: 255, a: 1 };
    for (const e of chain.reverse()) { const bg = parse(getComputedStyle(e).backgroundColor); if (bg && bg.a) c = over(bg, c); }
    return c;
  };
  const host = document.querySelector(sel); if (!host) return { missing: true };
  const textEl = opts.text ? host.querySelector(opts.text) || host : host;
  const cs = getComputedStyle(textEl);
  let bg = ground(textEl);
  const layer = getComputedStyle(host, '::before'); // state layer overlay
  const layerColor = parse(layer.backgroundColor || ''), op = parseFloat(layer.opacity || '0');
  if (layer.content !== 'none' && layerColor && op) bg = over({ ...layerColor, a: layerColor.a * op }, bg);
  const size = parseFloat(cs.fontSize), bold = +cs.fontWeight >= 700;
  const large = size >= 24 || (size >= 18.66 && bold);
  const out = { text: +ratio(parse(cs.color), bg).toFixed(2), need: large ? 3 : 4.5 };
  const hs = getComputedStyle(host);
  if (opts.boundary) out.boundary = +ratio(parse(hs.borderTopColor), ground(host.parentElement)).toFixed(2);
  if (opts.underline) out.boundary = +ratio(parse(hs.borderBottomColor), ground(host)).toFixed(2);
  if (hs.outlineStyle !== 'none' && parseFloat(hs.outlineWidth) > 0) out.focusRing = +Math.max(ratio(parse(hs.outlineColor), ground(host.parentElement)), ratio(parse(hs.boxShadow) || parse(hs.outlineColor), ground(host.parentElement))).toFixed(2);
  return out;
};

const browser = await launch();
const rows = [], failures = [];
for (const [name, route, width, sel, opts] of COMPONENTS) {
  const page = await browser.newPage();
  await page.setViewport({ width, height: 900 });
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await page.goto(BASE + route, { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.addEventListener('click', e => e.preventDefault(), true));
  if (opts.open) await page.evaluate(s => { document.querySelector(s).open = true; }, opts.open);
  await page.evaluate(s => document.querySelector(s)?.scrollIntoView({ block: 'center' }), sel);
  const wait = () => new Promise(r => setTimeout(r, 250));
  const states = {};
  for (const state of opts.states || ['rest', 'hover', 'focus', 'press']) {
    await page.mouse.move(0, 0); await page.evaluate(() => document.activeElement?.blur());
    if (state === 'hover' || state === 'press') await page.hover(sel);
    if (state === 'press') await page.mouse.down();
    if (state === 'focus') { await page.evaluate(s => { const t = document.createElement('button'); t.id = '__probe'; document.querySelector(s).before(t); t.focus(); }, sel); await page.keyboard.press('Tab'); }
    await wait();
    states[state] = await page.evaluate(measure, sel, opts);
    if (state === 'press') await page.mouse.up();
    if (state === 'focus') await page.evaluate(() => document.getElementById('__probe')?.remove());
  }
  await page.close();
  for (const [state, m] of Object.entries(states)) {
    if (m.missing) { failures.push(`${name}: ${sel} not found`); break; }
    if (m.text < m.need) failures.push(`${name} [${state}]: text ${m.text}:1 < ${m.need}:1`);
    if (m.boundary !== undefined && m.boundary < 3) failures.push(`${name} [${state}]: boundary ${m.boundary}:1 < 3:1`);
    if (state === 'focus' && m.focusRing !== undefined && m.focusRing < 3) failures.push(`${name} [focus]: focus ring ${m.focusRing}:1 < 3:1`);
  }
  rows.push({ name, route, width, states });
}
await browser.close();
const opt = process.argv.find(a => a.startsWith('--out='))?.split('=')[1];
if (opt) writeFileSync(opt, JSON.stringify(rows, null, 1));
for (const r of rows) console.log(`${r.name.padEnd(26)} ${Object.entries(r.states).map(([s, m]) => `${s} ${m.text}${m.boundary !== undefined ? '/b' + m.boundary : ''}${m.focusRing !== undefined ? '/ring' + m.focusRing : ''}`).join(' · ')}`);
console.log(failures.length ? `FAIL (${failures.length}):\n${failures.join('\n')}` : `PASS: ${rows.length} components × states meet WCAG AA (text 4.5/3, boundaries 3).`);
process.exitCode = failures.length ? 1 : 0;
