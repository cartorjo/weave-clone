// Copy gate: the technical track never changes wording. Collects every
// human-readable string from the built pages (text nodes incl. screen-reader
// text, alt/aria-label/title/placeholder, <title>, meta description, og:*,
// JSON-LD text, mailto subjects) and UI strings in js/, and compares them with
// tools/copy-baseline.json. Order-only changes (moves) pass with a note, as
// do added strings that already exist elsewhere on the site (reuse, e.g. a
// breadcrumb label repeated in JSON-LD). New wording or removed strings fail.
//   node tools/check-copy.mjs            check
//   node tools/check-copy.mjs --accept   rewrite the baseline (owner-approved copy only;
//                                        the baseline diff is what the owner reviews)
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import pages from '../pages.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const baselinePath = resolve(root, 'tools', 'copy-baseline.json');
const norm = s => s.replace(/&nbsp;| /g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/\s+/g, ' ').trim();
const human = s => /\p{L}/u.test(s) && !/^(https?:|\/|#|mailto:[^?]*$|tel:|data:)/.test(s);

// JSON-LD keys whose values are identifiers or codes, not copy.
const MACHINE_KEYS = new Set(['@type', '@id', '@context', 'inLanguage', 'addressCountry', 'areaServed']);

function strings(html) {
  const out = [];
  const push = s => { s = norm(s); if (s && human(s)) out.push(s); };
  for (const [, json] of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    const walk = v => { if (typeof v === 'string') push(v); else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) if (!MACHINE_KEYS.has(k)) walk(x); };
    walk(JSON.parse(json));
  }
  const title = html.match(/<title>([\s\S]*?)<\/title>/); if (title) push(title[1]);
  for (const [, name, content] of html.matchAll(/<meta (?:name|property)="(description|og:[a-z:]+|twitter:[a-z:]+)" content="([^"]*)"/g)) if (!/url|image$|width|height|type|locale|card/.test(name)) push(content);
  for (const [, subject] of html.matchAll(/href="mailto:[^"?]*\?subject=([^"]*)"/g)) push(decodeURIComponent(subject));
  const body = html.slice(html.indexOf('<body'))
    .replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '').replace(/<!--[\s\S]*?-->/g, '');
  for (const [, tag] of body.matchAll(/<([a-z][^>]*)>/g))
    for (const [, attr, value] of tag.matchAll(/\b(alt|aria-label|title|placeholder)="([^"]*)"/g)) push(value);
  for (const text of body.replace(/<[^>]+>/g, '\u0000').split('\u0000')) push(text);
  return out;
}

const route = out => out === 'index.html' ? '/' : out.endsWith('/index.html') ? '/' + out.slice(0, -'index.html'.length) : '/' + out;
const current = { pages: {}, js: {} };
for (const page of pages) current.pages[route(page.out)] = strings(readFileSync(resolve(root, page.out), 'utf8'));
for (const file of readdirSync(resolve(root, 'js')).filter(f => f.endsWith('.js')).sort()) {
  const src = readFileSync(resolve(root, 'js', file), 'utf8').replace(/\/\*[\s\S]*?\*\/|\/\/[^\n]*/g, '');
  current.js[file] = [...src.matchAll(/'((?:[^'\\\n]|\\.)*)'/g)].map(m => norm(m[1])).filter(s => s.includes(' ') && /\p{Lu}/u.test(s) && !/[(){};=]/.test(s));
}

if (process.argv.includes('--accept')) {
  writeFileSync(baselinePath, JSON.stringify(current, null, 1) + '\n');
  console.log(`copy baseline written: ${Object.keys(current.pages).length} pages, ${Object.values(current.pages).reduce((n, a) => n + a.length, 0)} strings`);
  process.exit(0);
}

const baseline = JSON.parse(readFileSync(baselinePath, 'utf8'));
const failures = [], moved = [], reused = [];
const known = new Set([...Object.values(baseline.pages).flat(), ...Object.values(baseline.js).flat()]);
const count = list => list.reduce((m, s) => m.set(s, (m.get(s) || 0) + 1), new Map());
const compare = (label, before = [], after = []) => {
  const a = count(before), b = count(after);
  const removed = [...a].filter(([s, n]) => (b.get(s) || 0) < n).map(([s]) => s);
  const added = [...b].filter(([s, n]) => (a.get(s) || 0) < n).map(([s]) => s);
  for (const s of removed) failures.push(`${label}: removed "${s.slice(0, 90)}"`);
  for (const s of added) (known.has(s) ? reused : failures).push(`${label}: added "${s.slice(0, 90)}"`);
  if (!removed.length && !added.filter(s => !known.has(s)).length && before.join('\n') !== after.join('\n')) moved.push(label);
};
for (const key of new Set([...Object.keys(baseline.pages), ...Object.keys(current.pages)])) compare(key, baseline.pages[key], current.pages[key]);
for (const key of new Set([...Object.keys(baseline.js), ...Object.keys(current.js)])) compare(`js/${key}`, baseline.js[key], current.js[key]);

if (moved.length) console.log(`copy: order changed (moves allowed) on ${moved.join(', ')}`);
if (reused.length) console.log(`copy: ${reused.length} existing string(s) reused (allowed), e.g. ${reused.slice(0, 3).join(' · ')}`);
if (failures.length) {
  console.error(`Copy check FAILED: wording changed. Revert it, or if the owner approved it run \`npm run copy:accept\` so the baseline diff shows it.\n${failures.join('\n')}`);
  process.exitCode = 1;
} else console.log(`Copy check passed: ${Object.keys(current.pages).length} pages, wording identical to tools/copy-baseline.json.`);
