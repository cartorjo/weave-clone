// Verify the generated site as a connected set of documents. No server needed.
import { readFileSync, existsSync, realpathSync } from 'node:fs';
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
if (failures.length) { console.error(failures.join('\n')); process.exitCode=1; }
else console.log(`Content check passed: ${documents.size} pages; local links, anchors, images, headings and templates.`);
