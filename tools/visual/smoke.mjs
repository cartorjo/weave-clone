// Usage: node tools/visual/smoke.mjs [--out=smoke.json] [--widths=320,390,700,1000,1240,1400] [--routes=all|core]
// Functional + platform smoke over the served site. Exit 1 on any failure.
import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { BASE, CORE, allRoutes, slug, launch, pool, settle } from './lib.mjs';

const args = process.argv.slice(2);
const opt = k => args.find(a => a.startsWith(`--${k}=`))?.split('=')[1];
const routes = (opt('routes') || 'all') === 'all' ? await allRoutes() : CORE;
const widths = (opt('widths') || '320,390,700,1000,1240,1400').split(',').map(Number);
const AXE = readFileSync(createRequire(import.meta.url).resolve('axe-core/axe.min.js'), 'utf8');
const fails = [], info = {};
const fail = m => fails.push(m);
const browser = await launch();

async function open(route, width, { bypassCSP = false, motion = 'no-preference' } = {}) {
  const page = await browser.newPage();
  await page.setCacheEnabled(false);
  const log = { console: [], errors: [], failed: [], csp: [] };
  if (bypassCSP) await page.setBypassCSP(true);
  await page.evaluateOnNewDocument(() => { window.__csp = []; document.addEventListener('securitypolicyviolation', e => window.__csp.push(`${e.violatedDirective} ${e.blockedURI}`)); });
  page.on('console', m => { if (m.type() === 'error') log.console.push(m.text()); });
  page.on('pageerror', e => log.errors.push(e.message));
  page.on('requestfailed', r => { if (!r.url().startsWith('mailto:')) log.failed.push(`${r.url()} ${r.failure()?.errorText}`); });
  await page.setViewport({ width, height: 900 });
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: motion }]);
  const res = await page.goto(BASE + route, { waitUntil: 'networkidle0', timeout: 45000 });
  await settle(page, 300);
  log.csp = await page.evaluate(() => window.__csp);
  return { page, log, res };
}

// 1. platform: status, overflow, console, CSP, failed requests — every route × width
const jobs = routes.flatMap(r => widths.map(w => ({ r, w })));
await pool(jobs, 6, async ({ r, w }) => {
  const { page, log, res } = await open(r, w);
  const tag = `${slug(r)}@${w}`;
  try {
    if (res.status() >= 400) fail(`${tag}: HTTP ${res.status()}`);
    const ov = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    if (ov > 1) fail(`${tag}: horizontal overflow ${ov}px`);
    for (const m of log.console) fail(`${tag}: console error: ${m}`);
    for (const m of log.errors) fail(`${tag}: pageerror: ${m}`);
    for (const m of log.failed) fail(`${tag}: request failed: ${m}`);
    for (const m of log.csp) fail(`${tag}: CSP violation: ${m}`);
    if (w === 1240) (info.navAt1240 ??= {})[slug(r)] = await page.evaluate(() => {
      const s = document.querySelector('#mobile-menu > summary');
      return s && getComputedStyle(document.getElementById('mobile-menu')).display !== 'none' && s.getClientRects().length ? 'mobile-menu' : 'inline-nav';
    });
  } finally { await page.close(); }
});

// 2. axe on every route (CSP bypassed only here so axe can be injected)
await pool(routes.flatMap(r => [390, 1400].map(w => ({ r, w }))), 4, async ({ r, w }) => {
  const { page } = await open(r, w, { bypassCSP: true, motion: 'reduce' });
  try {
    await page.evaluate(AXE);
    const v = await page.evaluate(async () => (await axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] })).violations.map(x => ({ id: x.id, impact: x.impact, n: x.nodes.length, sel: x.nodes.slice(0, 2).map(n => n.target.join(' ')) })));
    (info.axe ??= {})[`${slug(r)}@${w}`] = v;
    for (const x of v) fail(`${slug(r)}@${w}: axe ${x.id} (${x.impact}) ×${x.n} e.g. ${x.sel.join(' | ')}`);
  } finally { await page.close(); }
});

// 2b. no-JS: every text visible with JS is visible without it (the filter bar,
// shipped .js-only because it does nothing without JS, is the one exception).
const visibleLines = () => {
  const skip = el => el.closest('.work-filter, [data-contact-hint]');
  const out = new Set();
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n; (n = walker.nextNode());) {
    const el = n.parentElement, t = n.textContent.replace(/\s+/g, ' ').trim();
    if (!t || skip(el) || !el.getClientRects().length || getComputedStyle(el).visibility === 'hidden') continue;
    out.add(t);
  }
  return [...out];
};
for (const r of CORE) {
  const off = await browser.newPage(); await off.setJavaScriptEnabled(false); await off.setViewport({ width: 1400, height: 900 });
  await off.goto(BASE + r, { waitUntil: 'networkidle0' });
  const noJs = new Set(await off.evaluate(visibleLines)); await off.close();
  const { page } = await open(r, 1400, { motion: 'reduce' });
  const withJs = await page.evaluate(visibleLines); await page.close();
  const missing = withJs.filter(t => !noJs.has(t));
  for (const t of missing.slice(0, 5)) fail(`no-js ${slug(r)}: "${t.slice(0, 60)}" only visible with JS`);
}

// 2c. image weight budget per core page (all lazy images loaded), desktop and phone ×2.
const IMAGE_BUDGET = 750 * 1024;
for (const [w, dpr] of [[1400, 1], [390, 2]]) for (const r of CORE) {
  const page = await browser.newPage(); await page.setCacheEnabled(false); await page.setViewport({ width: w, height: 900, deviceScaleFactor: dpr });
  let bytes = 0; const pending = [];
  page.on('response', res => { if (res.request().resourceType() === 'image') pending.push(res.buffer().then(b => { bytes += b.length; }).catch(() => {})); });
  await page.goto(BASE + r, { waitUntil: 'networkidle0' });
  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { scrollTo(0, y); await new Promise(x => setTimeout(x, 60)); } });
  await new Promise(x => setTimeout(x, 800)); await Promise.all(pending); await page.close();
  (info.imageKiB ??= {})[`${slug(r)}@${w}x${dpr}`] = Math.round(bytes / 1024);
  if (bytes > IMAGE_BUDGET) fail(`${slug(r)}@${w}x${dpr}: images ${Math.round(bytes / 1024)} KiB exceed the 750 KiB budget`);
}

// 2d. 200% text: no content in main may extend past the viewport (WCAG 1.4.4/1.4.10).
await pool(routes.flatMap(r => [390, 1400].map(w => ({ r, w }))), 4, async ({ r, w }) => {
  const page = await browser.newPage(); await page.setCacheEnabled(false);
  const cdp = await page.createCDPSession(); await cdp.send('Page.setFontSizes', { fontSizes: { standard: 32 } });
  await page.setViewport({ width: w, height: 900 }); await page.goto(BASE + r, { waitUntil: 'networkidle0' });
  const over = await page.evaluate(() => [...document.querySelectorAll('main *')].filter(e => { const b = e.getBoundingClientRect(); return b.width && b.right > innerWidth + 0.5 && !e.closest('.legal-table'); })
    .slice(0, 2).map(e => `${e.tagName.toLowerCase()}.${[...e.classList].slice(0, 2).join('.')} to x=${Math.round(e.getBoundingClientRect().right)}`));
  for (const o of over) fail(`${slug(r)}@${w} 200% text: ${o} (viewport ${w})`);
  await page.close();
});

// 2e. keyboard: a Tab walk through each template reaches the footer, never
// sticks on one element, and every stop shows a visible outline.
for (const r of ['/', '/branchen/', '/case-studies/data2ai-platform/', '/about-us/', '/karriere/', '/kontakt/', '/impressum/']) for (const w of [390, 1400]) {
  const { page } = await open(r, w, { motion: 'reduce' });
  const seen = []; let problem = null;
  for (let i = 0; i < 90 && !problem; i++) {
    await page.keyboard.press('Tab');
    const st = await page.evaluate(() => { const e = document.activeElement; if (!e || e === document.body) return null; const c = getComputedStyle(e);
      return { id: `${e.tagName}#${[...document.querySelectorAll('*')].indexOf(e)} ${(e.getAttribute('href') || e.name || e.textContent.trim()).slice(0, 24)}`, outline: c.outlineStyle !== 'none' && parseFloat(c.outlineWidth) > 0, inFooter: !!e.closest('footer') }; });
    if (!st) continue;
    if (!st.outline) problem = `stop "${st.id}" has no visible outline`;
    seen.push(st.id);
    if (st.inFooter) break;
    if (seen.length > 3 && seen.slice(-3).every(x => x === st.id)) problem = `focus stuck on "${st.id}"`;
  }
  if (!problem && !seen.length) problem = 'no focusable stop reached';
  if (problem) fail(`keyboard ${slug(r)}@${w}: ${problem}`);
  await page.close();
}

// 2f. one URL form: every sitemap URL answers 200 at its canonical (trailing
// slash) form, and the slashless form redirects to it (serve.json trailingSlash).
{
  const sitemap = readFileSync(new URL('../../sitemap.xml', import.meta.url), 'utf8');
  for (const loc of [...sitemap.matchAll(/<loc>https?:\/\/[^/]+([^<]*)<\/loc>/g)].map(m => m[1])) {
    const ok = await fetch(BASE + loc, { redirect: 'manual' });
    if (ok.status !== 200) fail(`url ${loc}: ${ok.status}, expected 200`);
    if (loc !== '/') {
      const bare = await fetch(BASE + loc.replace(/\/$/, ''), { redirect: 'manual' });
      const to = bare.headers.get('location') || '';
      if (bare.status !== 301 || new URL(to, BASE).pathname !== loc) fail(`url ${loc.replace(/\/$/, '')}: ${bare.status} -> ${to || '-'}, expected 301 -> ${loc}`);
    }
  }
}

// 3. functional flows
const flows = [
  ['nav', '/', async (page, w) => {
    const r = await page.evaluate(() => {
      const menu = document.getElementById('mobile-menu'), s = menu?.querySelector('summary');
      const menuShown = !!(s && getComputedStyle(menu).display !== 'none' && s.getClientRects().length);
      const inline = [...document.querySelectorAll('.site-nav a, .site-nav summary')].filter(a => a.getClientRects().length && getComputedStyle(a).visibility !== 'hidden').length;
      return { menuShown, inline };
    });
    if (w >= 1400 && (r.menuShown || !r.inline)) return `wide: expected inline nav, got ${JSON.stringify(r)}`;
    if (w <= 1000) {
      if (!r.menuShown) return `narrow: mobile menu summary not shown ${JSON.stringify(r)}`;
      await page.click('#mobile-menu > summary');
      await new Promise(x => setTimeout(x, 200));
      const opened = await page.evaluate(() => ({ open: document.getElementById('mobile-menu').open, links: [...document.querySelectorAll('#mobile-menu a')].filter(a => a.getClientRects().length).length, label: document.querySelector('#mobile-menu > summary').getAttribute('aria-label') }));
      if (!opened.open || opened.links < 3) return `mobile menu did not open with links ${JSON.stringify(opened)}`;
      await page.keyboard.press('Escape');
      if (await page.evaluate(() => document.getElementById('mobile-menu').open)) return 'Escape did not close mobile menu';
    }
  }],
  ['skip-link', '/kontakt/', async (page) => {
    await page.keyboard.press('Tab');
    const a = await page.evaluate(() => ({ href: document.activeElement?.getAttribute('href'), txt: document.activeElement?.textContent.trim() }));
    if (a.href !== '#main') return `first Tab stop is ${JSON.stringify(a)}, expected skip link`;
  }],
  ...['/branchen/', '/case-studies/'].map(route => ['filters', route, async (page) => {
    const before = await page.evaluate(() => ({ chips: document.querySelectorAll('.filter-button').length, visible: [...document.querySelectorAll('[data-project]')].filter(p => !p.hidden).length, total: document.querySelectorAll('[data-project]').length }));
    if (!before.chips) return 'no filter chips';
    const target = await page.evaluate(() => { const b = [...document.querySelectorAll('.filter-button[data-filter-value]')].find(b => b.dataset.filterValue !== 'all'); b.scrollIntoView({ block: 'center' }); return b.dataset.filterGroup + '=' + b.dataset.filterValue; });
    const [g, v] = target.split('=');
    await page.click(`.filter-button[data-filter-group="${g}"][data-filter-value="${v}"]`);
    const after = await page.evaluate((g, v) => ({ pressed: document.querySelector(`.filter-button[data-filter-group="${g}"][data-filter-value="${v}"]`).getAttribute('aria-pressed'), visible: [...document.querySelectorAll('[data-project]')].filter(p => !p.hidden).length, count: document.getElementById('project-count')?.textContent }), g, v);
    if (after.pressed !== 'true') return `chip ${target} not pressed after click`;
    if (after.visible > before.total) return 'visible > total';
    await page.click(`.filter-button[data-filter-group="${g}"][data-filter-value="all"]`);
    const reset = await page.evaluate(() => [...document.querySelectorAll('[data-project]')].filter(p => !p.hidden).length);
    if (reset !== before.visible) return `reset shows ${reset}, expected ${before.visible}`;
  }]),
  ...['/about-us/', '/karriere/'].map(route => ['expander', route, async (page) => {
    const n = await page.evaluate(() => { const d = document.querySelector('details.expander'); d?.scrollIntoView({ block: 'center' }); return document.querySelectorAll('details.expander').length; });
    if (!n) return 'no expanders';
    await page.click('details.expander > summary');
    await new Promise(x => setTimeout(x, 150));
    if (!(await page.evaluate(() => document.querySelector('details.expander').open))) return 'expander did not open';
  }]),
  ...['/', '/kontakt/'].map(route => ['form', route, async (page) => {
    const r = await page.evaluate(() => {
      const f = document.querySelector('[data-contact-form]'); if (!f) return { missing: true };
      const empty = f.checkValidity();
      f.name.value = 'Test Person'; f.email.value = 'test@example.com'; f.interest.selectedIndex = 1; f.message.value = 'Hallo';
      return { empty, filled: f.checkValidity(), fields: f.querySelectorAll('input,select,textarea').length };
    });
    if (r.missing) return 'no contact form';
    if (r.empty !== false || r.filled !== true) return `validity wrong ${JSON.stringify(r)}`;
  }]),
];
for (const [name, route, fn] of flows) for (const w of [390, 1000, 1400]) {
  const { page } = await open(route, w, { motion: 'reduce' });
  try { const m = await fn(page, w); if (m) fail(`flow ${name} ${slug(route)}@${w}: ${m}`); }
  catch (e) { fail(`flow ${name} ${slug(route)}@${w}: threw ${e.message}`); }
  finally { await page.close(); }
}
await browser.close();
if (opt('out')) writeFileSync(opt('out'), JSON.stringify({ fails, info }, null, 1));
console.log(`# smoke: ${routes.length} routes × ${widths.length} widths, axe ${routes.length}×2, 200% text ${routes.length}×2, keyboard 7×2, no-JS text ${CORE.length}, ${flows.length} flows ×3 widths`);
console.log(`image KiB (max ${Math.max(...Object.values(info.imageKiB || {0: 0}))} of 750): ${JSON.stringify(info.imageKiB)}`);
console.log(`nav at 1240: ${JSON.stringify(Object.entries(info.navAt1240 || {}).reduce((m, [, v]) => (m[v] = (m[v] || 0) + 1, m), {}))}`);
console.log(fails.length ? `FAIL (${fails.length}):\n` + fails.map(f => '- ' + f).join('\n') : 'PASS: no failures');
process.exitCode = fails.length ? 1 : 0;
