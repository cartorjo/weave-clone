// Metadata gate. Fails on: missing required head tags, duplicate titles or
// descriptions, a share image that does not exist, invalid JSON-LD, a 404
// without noindex. Reports (does not fail) length guidance, because fixing a
// length means rewriting text, which is the owner's call.
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import pages from '../pages.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const failures = [], owner = [];
const seen = { title: new Map(), description: new Map() };
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
  const ld = attr(html, /<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  if (!ld) failures.push(`${f}: JSON-LD missing`);
  else try { const g = JSON.parse(ld)['@graph']; if (!g?.some(n => n['@type'] === 'WebPage')) failures.push(`${f}: JSON-LD has no WebPage`); }
  catch (e) { failures.push(`${f}: JSON-LD invalid (${e.message})`); }
}
if (owner.length) console.log(`Metadata length guidance, NEEDS-OWNER (not a failure, fixing means rewriting):\n${owner.map(o => '  ' + o).join('\n')}`);
if (failures.length) { console.error(failures.join('\n')); process.exitCode = 1; }
else console.log(`Metadata check passed: ${pages.length} pages; tags, uniqueness, share images, JSON-LD, 404 noindex.`);
