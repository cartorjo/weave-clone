// Metadata gate. Fails on: missing required head tags, duplicate titles or
// descriptions, a share image that does not exist, invalid JSON-LD, a 404
// without noindex. Reports (does not fail) length guidance, because fixing a
// length means rewriting text, which is the owner's call.
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import pagesDe from '../pages.mjs';
import { pagesEn } from '../pages.en.mjs';
import { PUBLISHED } from '../content/i18n.mjs';
// Published English pages are checked like the German ones (docs/i18n.md).
const pages = [...pagesDe, ...(PUBLISHED.includes('en') ? pagesEn(pagesDe) : [])];
import { shareSrc, SHARE } from '../content/share.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const failures = [], owner = [];
// Titles and descriptions are unique per language: a name like "Cookies" is the same word in both.
const seen = { de: { title: new Map(), description: new Map() }, en: { title: new Map(), description: new Map() } };
const lastmods = new Map([...readFileSync(resolve(root, 'sitemap.xml'), 'utf8').matchAll(/<loc>([^<]+)<\/loc><lastmod>([^<]+)<\/lastmod>/g)].map(m => [m[1], m[2]]));
const attr = (html, re) => html.match(re)?.[1];
for (const page of pages) {
  const html = readFileSync(resolve(root, page.out), 'utf8'), f = page.out;
  const locale = page.locale ?? 'de';
  if (!html.includes(`<html lang="${locale}">`)) failures.push(`${f}: html lang="${locale}" missing`);
  const title = attr(html, /<title>([^<]*)<\/title>/), description = attr(html, /<meta name="description" content="([^"]*)"/);
  if (!title) failures.push(`${f}: <title> missing`);
  if (!description) failures.push(`${f}: meta description missing`);
  if (f === '404.html' || f === 'en/404.html') { if (!/<meta name="robots" content="noindex">/.test(html)) failures.push(`${f}: noindex missing`); continue; }
  for (const [key, value] of [['title', title], ['description', description]]) {
    if (!value) continue;
    const bucket = seen[locale][key];
    if (bucket.has(value)) failures.push(`${f}: duplicate ${key} (also ${bucket.get(value)})`); else bucket.set(value, f);
  }
  if (title && title.length > 60) owner.push(`${f}: title ${title.length} chars (> 60): "${title}"`);
  if (description && (description.length < 140 || description.length > 160)) owner.push(`${f}: description ${description.length} chars (140-160)`);
  for (const tag of ['<link rel="canonical"', 'property="og:title"', 'property="og:description"', 'property="og:url"', 'property="og:type"', 'property="og:image"', 'name="twitter:card" content="summary_large_image"'])
    if (!html.includes(tag)) failures.push(`${f}: ${tag} missing`);
  const image = attr(html, /property="og:image" content="https?:\/\/[^/]+([^"]+)"/);
  if (image && !existsSync(resolve(root, image.slice(1)))) failures.push(`${f}: og:image ${image} does not exist`);
  // The share image is the 1200x630 crop of the page's own hero whenever it has one (B-32).
  const hero = attr(html, /<img src="\/assets\/supplied\/([a-z0-9-]+)-\d+\.jpg"[^>]*fetchpriority="high"/);
  if (hero && image && image !== shareSrc(hero)) failures.push(`${f}: og:image ${image} is not the crop of the page's hero (${shareSrc(hero)})`);
  if (attr(html, /property="og:image:width" content="(\d+)"/) !== String(SHARE.width) || attr(html, /property="og:image:height" content="(\d+)"/) !== String(SHARE.height)) failures.push(`${f}: og:image is not ${SHARE.width}x${SHARE.height}`);
  const ld = attr(html, /<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  if (!ld) failures.push(`${f}: JSON-LD missing`);
  else try {
    const g = JSON.parse(ld)['@graph'];
    const webPage = g?.find(n => n['@type'] === 'WebPage');
    if (!webPage) failures.push(`${f}: JSON-LD has no WebPage`);
    else if (!/^\d{4}-\d{2}-\d{2}$/.test(webPage.dateModified || '')) failures.push(`${f}: WebPage.dateModified missing`);
    else if (lastmods.get(webPage.url) !== webPage.dateModified) failures.push(`${f}: dateModified ${webPage.dateModified} != sitemap lastmod ${lastmods.get(webPage.url)}`);
    const org = g?.find(n => n['@type'] === 'Organization');
    const logo = org?.logo?.url?.replace(/^https?:\/\/[^/]+\//, '');
    if (!logo || !existsSync(resolve(root, logo))) failures.push(`${f}: Organization.logo ${org?.logo?.url} does not exist`);
    if (!org?.contactPoint?.email) failures.push(`${f}: Organization.contactPoint missing`);
    const crumbs = g?.find(n => n['@type'] === 'BreadcrumbList');
    if (f !== 'index.html' && f !== 'en/index.html' && !crumbs) failures.push(`${f}: JSON-LD has no BreadcrumbList`);
    if (crumbs && crumbs.itemListElement.some((it, i) => it.position !== i + 1 || !it.name || !/^https:\/\//.test(it.item))) failures.push(`${f}: BreadcrumbList malformed`);
    if (String(page.content).startsWith('project:') && !g.some(n => n['@type'] === 'Article')) failures.push(`${f}: case study without Article`);
    for (const a of g.filter(n => n['@type'] === 'Article')) if (!/^\d{4}-\d{2}-\d{2}$/.test(a.datePublished || '') || !a.author || a.dateModified < a.datePublished) failures.push(`${f}: Article needs author, datePublished <= dateModified`);
    if ((page.twinOut ?? f) === 'portfolio/index.html' && !g.some(n => n['@type'] === 'Service')) failures.push(`${f}: Leistungen without Service`);
    for (const svc of g.filter(n => n['@type'] === 'Service')) { const id = svc.url?.split('#')[1]; if (!id || !html.includes(`id="${id}"`)) failures.push(`${f}: Service "${svc.name}" url has no anchor on the page`); }
  }
  catch (e) { failures.push(`${f}: JSON-LD invalid (${e.message})`); }
}
if (owner.length) console.log(`Metadata length guidance, NEEDS-OWNER (not a failure, fixing means rewriting):\n${owner.map(o => '  ' + o).join('\n')}`);
if (failures.length) { console.error(failures.join('\n')); process.exitCode = 1; }
else console.log(`Metadata check passed: ${pages.length} pages; tags, uniqueness, share images, JSON-LD, 404 noindex.`);
