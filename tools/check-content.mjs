// Verify the generated site as a connected set of documents. No server needed.
import { readFileSync, existsSync, realpathSync, statSync, readdirSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import pages from '../pages.mjs';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const failures = [];
const documents = new Map(pages.map(page=>[page.out,readFileSync(resolve(root,page.out),'utf8')]));
for (const [file,html] of documents) {
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
  if (new Set(ids).size !== ids.length) failures.push(`${file}: duplicate IDs`);
  if ([...html.matchAll(/<h1\b/g)].length !== 1) failures.push(`${file}: expected exactly one h1`);
  if (/\{\{|<!-- (?:content|partial):/.test(html)) failures.push(`${file}: unresolved template`);
  // The privacy policy is the group's legal text, taken verbatim; it may name the Hays-Gruppe.
  if ((file === 'datenschutzerklaerung/index.html' ? /↗/ : /Hays-Gruppe|↗/).test(html)) failures.push(`${file}: superseded branding or arrow`);
  // Retired component classes (canon: styles/11-components.css + docs/components.md).
  // case-facets is the one live case-* class; everything else of that family is gone.
  for (const [,classes] of html.matchAll(/\bclass="([^"]+)"/g)) {
    const retired = classes.match(/\b(?:page-eyebrow|page-kicker|page-display|page-title|page-cta__title|display-hero|page-link|lede-boxes|portfolio-model|about-principles|about-facts|expertise-proof|expertise-case-strip|header-careers|mobile-menu__label|page-rule|fact-grid--stats|management-card__more|about-locations(?:__[a-z]+)?|location-list|case-(?!facets\b)[a-z][a-z-]*)\b/);
    if (retired) { failures.push(`${file}: retired class "${retired[0]}"`); break; }
  }
  // No-JS safety: content never depends on JS. Only the filter bar (useless
  // without its handlers) may ship hidden as .js-only, and every Kennzahl
  // carries its final value in the HTML (the countup only animates it).
  for (const [, cls] of html.matchAll(/\bclass="([^"]*\bjs-only\b[^"]*)"/g))
    if (!/\bwork-filter\b/.test(cls)) failures.push(`${file}: .js-only on "${cls}" hides content without JS`);
  const facts = [...html.matchAll(/class="company-facts__value"[^>]*>([^<]*)</g)].map(m => m[1]);
  if (html.includes('class="company-facts"') && !facts.length) failures.push(`${file}: Kennzahlen without .company-facts__value`);
  for (const value of facts) if (!/[1-9]/.test(value)) failures.push(`${file}: Kennzahl "${value}" is not its final value in HTML`);
  for (const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    const href = match[1];
    if (/^(?:https?:|mailto:|tel:|data:)/.test(href)) continue;
    if (href === '#') { failures.push(`${file}: placeholder link`); continue; }
    const url = new URL(href, `https://local.test/${file}`);
    const pathname = decodeURIComponent(url.pathname);
    const target = pathname.endsWith('/') ? pathname.slice(1)+'index.html' : pathname.slice(1);
    const targetPath = resolve(root,target);
    if (!existsSync(targetPath)) { failures.push(`${file}: missing ${href}`); continue; }
    // existsSync is case-insensitive on APFS; a case-sensitive host would 404.
    if (realpathSync.native(targetPath) !== targetPath) { failures.push(`${file}: wrong-case path ${href}`); continue; }
    if (url.hash && target.endsWith('.html')) {
      const targetHtml = documents.get(target) || readFileSync(resolve(root,target),'utf8');
      const anchor = decodeURIComponent(url.hash.slice(1));
      if (!targetHtml.includes(`id="${anchor}"`)) failures.push(`${file}: missing anchor ${href}`);
    }
  }
  for (const [,srcset] of html.matchAll(/\bsrcset="([^"]+)"/g)) {
    for (const variant of srcset.split(',')) {
      const [src] = variant.trim().split(/\s+/);
      if (!existsSync(resolve(root,src.slice(1)))) failures.push(`${file}: missing responsive image ${src}`);
    }
  }
}
// Shared frames are rendered, never hand-written: page sources use
// <page-hero> / <page-crumb> (content/render.mjs pageHero(), breadcrumb()).
for (const dir of ['pages', 'sections']) for (const f of readdirSync(resolve(root, dir)).filter(f => f.endsWith('.html'))) {
  const src = readFileSync(resolve(root, dir, f), 'utf8');
  if (/class="page-hero[ "]/.test(src)) failures.push(`${dir}/${f}: hand-written page hero (use <page-hero>)`);
  if (/class="page-breadcrumb"/.test(src)) failures.push(`${dir}/${f}: hand-written breadcrumb (use <page-crumb> or <page-hero crumb>)`);
  if (/class="page-cta[ "]/.test(src)) failures.push(`${dir}/${f}: hand-written CTA (use <!-- content:cta-<name> -->)`);
  if (/class="trust-strip"/.test(src)) failures.push(`${dir}/${f}: hand-written trust strip (use <!-- content:trust-strip -->)`);
}
// SEO migration: every redirect lands on a real page, and every old emposo.de
// URL (docs/legacy-urls.txt) is either still a page or 301s somewhere real.
// Matching mirrors serve-handler: trailing slash stripped, `*` = any rest.
const serveConfig = JSON.parse(readFileSync(resolve(root,'serve.json'),'utf8'));
const redirects = serveConfig.redirects || [];
const pageFile = pathname => { const p = decodeURIComponent(pathname); return p.endsWith('/') ? p.slice(1)+'index.html' : p.slice(1); };
const isPage = pathname => existsSync(resolve(root, pageFile(pathname)));
for (const {source, destination} of redirects) {
  const target = new URL(destination, 'https://local.test');
  if (!isPage(target.pathname)) failures.push(`serve.json: redirect ${source} → missing ${destination}`);
  if (target.hash && !documents.get(pageFile(target.pathname))?.includes(`id="${target.hash.slice(1)}"`)) failures.push(`serve.json: redirect ${source} → missing anchor ${destination}`);
}
const strip = p => p.length > 1 ? p.replace(/\/$/, '') : p;
const redirected = path => redirects.find(({source}) => new RegExp(`^${source.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace('*', '.*')}$`).test(strip(path)));
const legacy = readFileSync(resolve(root,'docs','legacy-urls.txt'),'utf8').split('\n').filter(l => l && !l.startsWith('#'));
for (const path of legacy) {
  const rule = redirected(path);
  if (rule && isPage(path)) failures.push(`legacy ${path}: is a live page but also redirected by ${rule.source}`);
  if (!rule && !isPage(path)) failures.push(`legacy ${path}: neither a page nor redirected`);
}
// Performance budget: the stylesheet stays small (images are budgeted in smoke).
const CSS_BUDGET = { raw: 64 * 1024, gzip: 14 * 1024 };
const css = readFileSync(resolve(root, 'css', 'site.css'));
const cssSize = { raw: css.length, gzip: gzipSync(css).length };
if (cssSize.raw > CSS_BUDGET.raw || cssSize.gzip > CSS_BUDGET.gzip) failures.push(`css/site.css ${(cssSize.raw / 1024).toFixed(1)} KiB (${(cssSize.gzip / 1024).toFixed(1)} KiB gzip) exceeds budget 64/14 KiB`);
if (failures.length) { console.error(failures.join('\n')); process.exitCode=1; }
else console.log(`Content check passed: ${documents.size} pages; local links, anchors, images, headings and templates; ${redirects.length} redirects, ${legacy.length} legacy URLs; css ${(cssSize.raw / 1024).toFixed(1)} KiB / ${(cssSize.gzip / 1024).toFixed(1)} KiB gzip.`);
