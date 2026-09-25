// Usage: node tools/visual/shadowed.mjs [--apply]
// Finds declarations in styles/07..11 (one layer, import order) that a LATER rule with the
// identical selector overrides in the same or a broader context. --apply deletes them in place.
import { readFileSync, writeFileSync } from 'node:fs';
import { REPO } from './lib.mjs';

const FILES = ['07-header.css', '08-editorial.css', '09-page-templates.css', '10-feedback.css', '11-components.css'];
const FAMILY = { padding: /^padding(-(top|right|bottom|left|block|inline)(-start|-end)?)?$/, margin: /^margin(-(top|right|bottom|left|block|inline)(-start|-end)?)?$/,
  gap: /^(gap|row-gap|column-gap)$/, background: /^background(-color|-image|-position|-size|-repeat)?$/, transition: /^transition(-[a-z]+)?$/,
  'border-radius': /^border-(top|bottom)-(left|right)-radius$|^border-radius$/, inset: /^(inset|top|right|bottom|left)$/, overflow: /^overflow(-x|-y)?$/ };
// later shorthand kills earlier longhand; later longhand kills only the same longhand
const kills = (later, earlier) => later === earlier || (FAMILY[later] && FAMILY[later].test(earlier));

function parse(file) {
  const src = readFileSync(`${REPO}/styles/${file}`, 'utf8');
  const rules = []; let i = 0; const ctx = [];
  const skipComment = () => { if (src.startsWith('/*', i)) { i = src.indexOf('*/', i) + 2; return true; } return false; };
  function block(depth) {
    while (i < src.length) {
      if (skipComment()) continue;
      if (src[i] === '}') { i++; return; }
      if (/\s/.test(src[i])) { i++; continue; }
      let start = i, prelude = '';
      while (i < src.length && src[i] !== '{' && src[i] !== ';' && src[i] !== '}') { if (skipComment()) continue; prelude += src[i++]; }
      if (src[i] === ';') { i++; continue; }
      if (src[i] === '}') continue;
      i++; // {
      prelude = prelude.trim().replace(/\s+/g, ' ');
      if (prelude.startsWith('@')) { ctx.push(prelude); block(depth + 1); ctx.pop(); continue; }
      const bodyStart = i; let decls = [];
      while (i < src.length && src[i] !== '}') {
        if (skipComment()) continue;
        if (/\s|;/.test(src[i])) { i++; continue; }
        const ds = i; let d = '', paren = 0;
        while (i < src.length && !((src[i] === ';' || src[i] === '}') && paren === 0)) { if (src[i] === '(') paren++; if (src[i] === ')') paren--; d += src[i++]; }
        const end = src[i] === ';' ? i + 1 : i;
        const m = d.match(/^\s*([a-z-]+)\s*:\s*([\s\S]*)$/);
        if (m) decls.push({ prop: m[1], value: m[2].trim(), start: ds, end });
        if (src[i] === ';') i++;
      }
      i++; // }
      rules.push({ file, ctx: ctx.join(' | '), sel: prelude, decls, start, end: i });
    }
  }
  block(0);
  return { src, rules };
}
const parsed = Object.fromEntries(FILES.map(f => [f, parse(f)]));
const all = FILES.flatMap(f => parsed[f].rules.map((r, k) => ({ ...r, order: FILES.indexOf(f) * 1e4 + k })));
const norm = s => s.split(',').map(x => x.trim()).sort().join(',');
const dead = [];
for (const r of all) {
  if (/:(hover|focus|active|focus-visible|focus-within)|\[open\]|\.is-/.test(r.sel)) continue;
  for (const d of r.decls) {
    if (d.value.includes('!important')) continue;
    const killer = all.find(l => l.order > r.order && norm(l.sel) === norm(r.sel) && (l.ctx === r.ctx || l.ctx === '') && l.decls.some(x => kills(x.prop, d.prop) && !x.value.includes('!important')));
    if (killer) dead.push({ file: r.file, sel: r.sel, ctx: r.ctx, prop: d.prop, value: d.value, start: d.start, end: d.end, by: `${killer.file} ${killer.ctx ? '[' + killer.ctx + '] ' : ''}${killer.sel}` });
  }
}
for (const d of dead) console.log(`${d.file}: ${d.ctx ? '[' + d.ctx + '] ' : ''}${d.sel} { ${d.prop}: ${d.value} }  ← ${d.by}`);
console.log(`${dead.length} shadowed declarations`);
if (process.argv.includes('--apply')) {
  for (const f of FILES) {
    let { src, rules } = parsed[f];
    const cuts = [];
    for (const r of rules) {
      const mine = dead.filter(x => x.file === f && x.start >= r.start && x.end <= r.end);
      if (!mine.length) continue;
      if (mine.length === r.decls.length) { let e = r.end; if (src[e] === '\n') e++; cuts.push([r.start, e]); continue; }
      for (const d of mine) {
        let s0 = d.start, e0 = d.end;
        while (s0 > 0 && (src[s0 - 1] === ' ' || src[s0 - 1] === '\t')) s0--;
        if (src[s0 - 1] === '\n' && src[e0] === '\n') e0++;          // own line: drop the line
        else if (src[e0] === ' ') { s0 = d.start; e0++; }              // inline: drop "decl; "
        cuts.push([s0, e0]);
      }
    }
    for (const [a, b] of cuts.sort((x, y) => y[0] - x[0])) src = src.slice(0, a) + src.slice(b);
    writeFileSync(`${REPO}/styles/${f}`, src);
  }
}
