// i18n gate: builds the English twins (EN=1, into the git-ignored en/) and
// checks them against their German pages.
//   - every German page has exactly one English twin, at its mapped path;
//   - <html lang="en">, the canonical is the English URL, and hreflang names
//     both twins (reciprocal once English is published);
//   - no English page links to a German page path;
//   - DE and EN twins (except the verbatim legal documents) share one tag skeleton: the same elements with the same
//     classes and ids in the same order, so only text, hrefs and localized
//     attributes differ. Layout parity holds by construction.
// Reports the German fallbacks still in the English build (.i18n/untranslated.json);
// `--complete` fails while any remain (the gate for publishing English).
//   node tools/check-i18n.mjs [--complete]
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import pages from '../pages.mjs';
import { PUBLISHED, localizePath } from '../content/i18n.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
execFileSync('node', ['assemble.mjs'], { cwd: root, env: { ...process.env, EN: '1' }, stdio: 'pipe' });

const failures = [];
const read = out => readFileSync(resolve(root, out), 'utf8');
const pathOf = out => out === 'index.html' ? '/' : `/${out.replace(/index\.html$/, '')}`;
const outOf = path => `${path.replace(/^\//, '')}index.html`;
const LOCALIZED_ATTRS = /\s(?:href|alt|aria-label|title|content|placeholder|hreflang|lang|srcset|sizes|action|value|datetime|data-filter-value)="[^"]*"/g;
// Tag skeleton: element names plus class/id, in document order. Text and
// localized attribute values are dropped; alternate links are head metadata.
const skeleton = html => [...html.replace(/<link rel="alternate"[^>]*>/g, '').replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g, '').matchAll(/<\/?[a-z][a-z0-9-]*(?:\s[^>]*)?>/g)]
  .map(([tag]) => tag.replace(LOCALIZED_ATTRS, '').replace(/\s+/g, ' '));

// Legal documents are Hays' own texts in each language, reproduced verbatim
// (owner decision 2026-09-27), not translations of our markup: they keep every
// check except the shared tag skeleton.
const VERBATIM_LEGAL = new Set(['impressum/index.html', 'datenschutzerklaerung/index.html', 'nutzungsbestimmungen/index.html']);

let pairs = 0;
for (const page of pages) {
  const enOut = page.out === '404.html' ? 'en/404.html' : outOf(localizePath(pathOf(page.out), 'en'));
  if (!existsSync(resolve(root, enOut))) { failures.push(`${page.out}: no English twin at ${enOut}`); continue; }
  pairs += 1;
  const de = read(page.out), en = read(enOut);
  if (!/<html lang="en">/.test(en)) failures.push(`${enOut}: <html lang> is not "en"`);
  if (page.out !== '404.html') {
    const url = `https://emposo.de${pathOf(enOut)}`;
    if (!en.includes(`<link rel="canonical" href="${url}">`)) failures.push(`${enOut}: canonical is not ${url}`);
    for (const [lang, href] of [['de', `https://emposo.de${pathOf(page.out)}`], ['en', url]]) {
      if (!en.includes(`hreflang="${lang}" href="${href}"`)) failures.push(`${enOut}: missing hreflang ${lang} -> ${href}`);
      if (PUBLISHED.includes('en') && !de.includes(`hreflang="${lang}" href="${href}"`)) failures.push(`${page.out}: missing hreflang ${lang} -> ${href}`);
    }
  }
  for (const [, href] of en.matchAll(/href="(\/[^"#?]*)/g)) {
    if (!href.startsWith('/en/') && !/^\/(assets|css|js)\//.test(href)) failures.push(`${enOut}: links to German path ${href}`);
  }
  const a = VERBATIM_LEGAL.has(page.out) ? [] : skeleton(de), b = VERBATIM_LEGAL.has(page.out) ? [] : skeleton(en);
  const at = a.findIndex((tag, i) => tag !== b[i]);
  if (at !== -1 || a.length !== b.length) {
    const i = at === -1 ? Math.min(a.length, b.length) : at;
    failures.push(`${enOut}: tag skeleton differs from ${page.out} at tag ${i}: DE ${a[i] ?? '(end)'} | EN ${b[i] ?? '(end)'}`);
  }
}

const untranslated = JSON.parse(readFileSync(resolve(root, '.i18n', 'untranslated.json'), 'utf8'));
const byKind = Object.keys(untranslated).reduce((m, k) => ({ ...m, [k.split(':')[0]]: (m[k.split(':')[0]] ?? 0) + 1 }), {});
const remaining = Object.keys(untranslated).length;
if (process.argv.includes('--complete') && remaining) failures.push(`${remaining} German fallback(s) left in the English build (.i18n/untranslated.json)`);

if (failures.length) {
  console.error(`i18n check failed (${failures.length}):`);
  for (const f of failures.slice(0, 40)) console.error(`  - ${f}`);
  if (failures.length > 40) console.error(`  … ${failures.length - 40} more`);
  process.exit(1);
}
console.log(`i18n check passed: ${pairs} DE/EN twins, lang, canonical, hreflang, links and tag skeletons; ${remaining} German fallback(s) left${remaining ? ` (${Object.entries(byKind).map(([k, n]) => `${n} ${k}`).join(', ')})` : ''}; published: ${PUBLISHED.join(', ')}.`);
