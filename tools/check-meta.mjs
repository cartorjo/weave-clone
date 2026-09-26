// Metadata gate. Fails on: missing required head tags, duplicate titles or
// descriptions, a share image that does not exist, invalid JSON-LD, a 404
// without noindex. Reports (does not fail) length guidance, because fixing a
// length means rewriting text, which is the owner's call.
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import pages from '../pages.mjs';
import { shareSrc, SHARE } from '../content/share.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const failures = [], owner = [];
const seen = { title: new Map(), description: new Map() };
const lastmods = new Map([...readFileSync(resolve(root, 'sitemap.xml'), 'utf8').matchAll(/<loc>([^<]+)<\/loc><lastmod>([^<]+)<\/lastmod>/g)].map(m => [m[1], m[2]]));
const attr = (html, re) => html.match(re)?.[1];
for (const page of pages) {
  const html = readFileSync(resolve(root, page.out), 'utf8'), f = page.out;
  if (!/<html lang="de">/.test(html)) failures.push(`${f}: html lang="de" missing`);
  const title = attr(html, /<title>([^<]*)<\/title>/), description = attr(html, /<meta name="description" content="([^"]*)"/);
  if (!title) failures.push(`${f}: <title> missing`);
  if (!description) failures.push(`${f}: meta description missing`);
  if (f === '404.html') { if (!/<meta name="robots" content="noindex">/.test(html)) failures.push(`${f}: noindex missing`); continue; }
  for (const [key, value] of [['title', title], ['description', description]]) {
    if (!value) continue;
    if (seen[key].has(value)) failures.push(`${f}: duplicate ${key} (also ${seen[key].get(value)})`); else seen[key].set(value, f);
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
    const crumbs = g?.find(n => n['@type'] === 'BreadcrumbList');
    if (f !== 'index.html' && !crumbs) failures.push(`${f}: JSON-LD has no BreadcrumbList`);
    if (crumbs && crumbs.itemListElement.some((it, i) => it.position !== i + 1 || !it.name || !/^https:\/\//.test(it.item))) failures.push(`${f}: BreadcrumbList malformed`);
    if (f.startsWith('case-studies/') && f !== 'case-studies/index.html' && !g.some(n => n['@type'] === 'Article')) failures.push(`${f}: case study without Article`);
    if (f === 'portfolio/index.html' && !g.some(n => n['@type'] === 'Service')) failures.push(`${f}: Leistungen without Service`);
    for (const svc of g.filter(n => n['@type'] === 'Service')) { const id = svc.url?.split('#')[1]; if (!id || !html.includes(`id="${id}"`)) failures.push(`${f}: Service "${svc.name}" url has no anchor on the page`); }
  }
  catch (e) { failures.push(`${f}: JSON-LD invalid (${e.message})`); }
}
if (owner.length) console.log(`Metadata length guidance, NEEDS-OWNER (not a failure, fixing means rewriting):\n${owner.map(o => '  ' + o).join('\n')}`);
if (failures.length) { console.error(failures.join('\n')); process.exitCode = 1; }
else console.log(`Metadata check passed: ${pages.length} pages; tags, uniqueness, share images, JSON-LD, 404 noindex.`);
