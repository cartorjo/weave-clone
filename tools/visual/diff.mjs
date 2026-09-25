// Usage: node tools/visual/diff.mjs <baseDir> <curDir> [--out=report.json] [--only=home,kontakt] [--examples=3]
// Compares computed-style dumps. Style props are compared exactly; geometry props
// (resolved sizes/offsets) are reported separately because one upstream change shifts them all.
import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';

const args = process.argv.slice(2);
const [baseDir, curDir] = args.filter(a => !a.startsWith('--'));
const opt = k => args.find(a => a.startsWith(`--${k}=`))?.split('=').slice(1).join('=');
const only = opt('only')?.split(',');
const EX = Number(opt('examples') || 3);
const meta = JSON.parse(readFileSync(`${baseDir}/meta.json`, 'utf8'));
const PROPS = meta.props;
const GEOM = new Set(['width', 'height', 'top', 'right', 'bottom', 'left', 'transform-origin', 'grid-template-columns', 'grid-template-rows', 'min-width', 'max-height']);

const files = readdirSync(`${baseDir}/dump`).filter(f => f.endsWith('.json') && (!only || only.some(o => f.startsWith(o + '@'))));
const agg = { style: {}, geom: {} };
const pages = [];
const short = k => k.split('>').slice(-3).join('>');
for (const f of files) {
  if (!existsSync(`${curDir}/dump/${f}`)) { pages.push({ page: f, missing: true }); continue; }
  const A = JSON.parse(readFileSync(`${baseDir}/dump/${f}`, 'utf8'));
  const B = JSON.parse(readFileSync(`${curDir}/dump/${f}`, 'utf8'));
  const bKeys = new Set(Object.keys(B.els));
  const pairs = [], unA = [];
  for (const [k, a] of Object.entries(A.els)) { if (B.els[k]) { pairs.push([k, a, B.els[k]]); bKeys.delete(k); } else unA.push(k); }
  // secondary match: tag-only path, among the leftovers
  const byT = new Map(); for (const k of bKeys) { const t = B.els[k].t; if (!byT.has(t)) byT.set(t, []); byT.get(t).push(k); }
  const stillA = [];
  for (const k of unA) { const cand = byT.get(A.els[k].t); if (cand?.length) { const kb = cand.shift(); bKeys.delete(kb); pairs.push([k, A.els[k], B.els[kb], kb]); } else stillA.push(k); }
  const pg = { page: f, docH: [A.docH, B.docH], docW: [A.docW, B.docW], matched: pairs.length, removed: stillA.map(short).slice(0, 12), removedN: stillA.length, added: [...bKeys].map(short).slice(0, 12), addedN: bKeys.size, reclassed: 0, style: {}, sizeChanged: 0, firstShift: null };
  for (const [k, a, b, kb] of pairs) {
    if (kb) pg.reclassed++;
    PROPS.forEach((p, i) => {
      const va = a.v[i], vb = b.v[i];
      if (va === vb) return;
      const bucket = GEOM.has(p) ? 'geom' : 'style';
      const tr = `${p}: ${va} → ${vb}`;
      const ag = (agg[bucket][tr] ??= { n: 0, pages: new Set(), ex: [] });
      ag.n++; ag.pages.add(f.split('@')[0]);
      if (ag.ex.length < EX) ag.ex.push(`${f} ${short(kb || k)} .${(b.c || '').split(' ').slice(0, 3).join('.')}${b.x ? ` "${b.x}"` : ''}`);
      if (bucket === 'style') pg.style[p] = (pg.style[p] || 0) + 1;
    });
    if (a.r && b.r) {
      if (Math.abs(a.r[2] - b.r[2]) > 0.5 || Math.abs(a.r[3] - b.r[3]) > 0.5) pg.sizeChanged++;
      if (!pg.firstShift && (Math.abs(a.r[0] - b.r[0]) > 0.5 || Math.abs(a.r[1] - b.r[1]) > 0.5 || Math.abs(a.r[2] - b.r[2]) > 0.5 || Math.abs(a.r[3] - b.r[3]) > 0.5))
        pg.firstShift = `${short(kb || k)} .${b.c.split(' ').slice(0, 3).join('.')} rect ${a.r.join(',')} → ${b.r.join(',')}`;
    }
  }
  pages.push(pg);
}
const fmt = bucket => Object.entries(agg[bucket]).sort((x, y) => y[1].n - x[1].n)
  .map(([tr, v]) => ({ transition: tr, n: v.n, pages: [...v.pages].length, ex: v.ex }));
const report = { base: baseDir, cur: curDir, pages, style: fmt('style'), geom: fmt('geom') };
if (opt('out')) writeFileSync(opt('out'), JSON.stringify(report, null, 1));

const changedPages = pages.filter(p => p.missing || Object.keys(p.style).length || p.removedN || p.addedN || p.sizeChanged || p.docH[0] !== p.docH[1] || p.docW[0] !== p.docW[1]);
console.log(`# computed-style diff: ${files.length} page@width files, ${changedPages.length} with any change`);
console.log(`style transitions: ${report.style.length} distinct, ${report.style.reduce((s, t) => s + t.n, 0)} element-props · geometry transitions: ${report.geom.length} distinct`);
console.log('\n## style transitions (all)');
for (const t of report.style) console.log(`- ×${t.n} on ${t.pages} route(s) | ${t.transition}\n    e.g. ${t.ex.join('\n         ')}`);
console.log('\n## pages');
for (const p of changedPages) {
  if (p.missing) { console.log(`- ${p.page}: MISSING in current`); continue; }
  console.log(`- ${p.page}: docH ${p.docH[0]}→${p.docH[1]}${p.docW[0] !== p.docW[1] ? ` docW ${p.docW[0]}→${p.docW[1]}` : ''} · sizeChanged ${p.sizeChanged} · +${p.addedN}/-${p.removedN} els (reclassed ${p.reclassed}) · style ${JSON.stringify(p.style)}`);
  if (p.firstShift) console.log(`    first geometry change: ${p.firstShift}`);
  if (p.removedN) console.log(`    removed e.g.: ${p.removed.slice(0, 4).join(' | ')}`);
  if (p.addedN) console.log(`    added e.g.: ${p.added.slice(0, 4).join(' | ')}`);
}
