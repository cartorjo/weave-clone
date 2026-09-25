// Usage: node tools/visual/pixdiff.mjs <baseDir> <curDir> <outDir> [--only=home,kontakt] [--threshold=24]
// Pixel-compares shots/*.png in headless Chrome (no deps). Writes, per changed shot,
// up to 6 region crops side by side: base | current | diff-mask (red), and prints bands.
import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { launch } from './lib.mjs';

const args = process.argv.slice(2);
const [baseDir, curDir, outDir] = args.filter(a => !a.startsWith('--'));
const opt = k => args.find(a => a.startsWith(`--${k}=`))?.split('=')[1];
const only = opt('only')?.split(',');
const TH = Number(opt('threshold') || 24);
mkdirSync(outDir, { recursive: true });
const files = readdirSync(`${baseDir}/shots`).filter(f => f.endsWith('.png') && (!only || only.some(o => f.startsWith(o + '@'))));
const browser = await launch();
const page = await browser.newPage();
await page.goto('about:blank');
const results = [];
for (const f of files) {
  if (!existsSync(`${curDir}/shots/${f}`)) { results.push({ f, missing: true }); continue; }
  const a = 'data:image/png;base64,' + readFileSync(`${baseDir}/shots/${f}`).toString('base64');
  const b = 'data:image/png;base64,' + readFileSync(`${curDir}/shots/${f}`).toString('base64');
  const r = await page.evaluate(async (a, b, TH) => {
    const load = src => new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = () => rej(new Error('load')); i.src = src; });
    const [ia, ib] = await Promise.all([load(a), load(b)]);
    const W = Math.max(ia.width, ib.width), H = Math.max(ia.height, ib.height);
    const w = Math.min(ia.width, ib.width), h = Math.min(ia.height, ib.height);
    const mk = (img) => { const c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d', { willReadFrequently: true }); x.fillStyle = '#ff00ff'; x.fillRect(0, 0, W, H); x.drawImage(img, 0, 0); return x; };
    const xa = mk(ia), xb = mk(ib);
    const rowHas = new Uint8Array(H); const rowMin = new Int32Array(H).fill(W), rowMax = new Int32Array(H).fill(-1);
    let diff = 0;
    const mask = document.createElement('canvas'); mask.width = W; mask.height = H; const xm = mask.getContext('2d');
    const BAND = 512;
    for (let y0 = 0; y0 < H; y0 += BAND) {
      const bh = Math.min(BAND, H - y0);
      const da = xa.getImageData(0, y0, W, bh).data, db = xb.getImageData(0, y0, W, bh).data;
      const md = xm.createImageData(W, bh); const m = md.data;
      for (let y = 0; y < bh; y++) for (let x = 0; x < W; x++) {
        const i = (y * W + x) * 4;
        const d = Math.max(Math.abs(da[i] - db[i]), Math.abs(da[i + 1] - db[i + 1]), Math.abs(da[i + 2] - db[i + 2]));
        if (d > TH || (y0 + y) >= h || x >= w) { diff++; rowHas[y0 + y] = 1; if (x < rowMin[y0 + y]) rowMin[y0 + y] = x; if (x > rowMax[y0 + y]) rowMax[y0 + y] = x; m[i] = 255; m[i + 3] = 255; }
        else { const g = (da[i] + da[i + 1] + da[i + 2]) / 3; m[i] = m[i + 1] = m[i + 2] = 180 + g / 4; m[i + 3] = 255; }
      }
      xm.putImageData(md, 0, y0);
    }
    const bands = []; let cur = null;
    for (let y = 0; y < H; y++) {
      if (rowHas[y]) { if (cur && y - cur.y1 <= 24) { cur.y1 = y; cur.x0 = Math.min(cur.x0, rowMin[y]); cur.x1 = Math.max(cur.x1, rowMax[y]); } else { cur = { y0: y, y1: y, x0: rowMin[y], x1: rowMax[y] }; bands.push(cur); } }
    }
    const crops = bands.slice(0, 6).map(bd => {
      const pad = 40, cx = Math.max(0, bd.x0 - pad), cy = Math.max(0, bd.y0 - pad);
      const cw = Math.min(W, bd.x1 + pad) - cx, ch = Math.min(Math.min(H, bd.y1 + pad) - cy, 1400);
      const out = document.createElement('canvas'); out.width = cw * 3 + 20; out.height = ch; const xo = out.getContext('2d');
      xo.fillStyle = '#222'; xo.fillRect(0, 0, out.width, ch);
      xo.drawImage(xa.canvas, cx, cy, cw, ch, 0, 0, cw, ch); xo.drawImage(xb.canvas, cx, cy, cw, ch, cw + 10, 0, cw, ch); xo.drawImage(mask, cx, cy, cw, ch, 2 * cw + 20, 0, cw, ch);
      return out.toDataURL('image/png');
    });
    return { sizeA: [ia.width, ia.height], sizeB: [ib.width, ib.height], diff, ratio: diff / (W * H), bands: bands.map(b => [b.x0, b.y0, b.x1, b.y1]), crops };
  }, a, b, TH).catch(e => ({ error: e.message }));
  const name = f.replace('.png', '');
  (r.crops || []).forEach((c, i) => writeFileSync(`${outDir}/${name}-r${i}.png`, Buffer.from(c.split(',')[1], 'base64')));
  delete r.crops;
  results.push({ f, ...r });
}
await browser.close();
writeFileSync(`${outDir}/pixdiff.json`, JSON.stringify(results, null, 1));
const NOISE = 50;
const changed = results.filter(r => r.missing || r.error || r.diff > NOISE);
const noise = results.filter(r => r.diff && r.diff <= NOISE);
console.log(`# pixel diff (threshold ${TH}, noise floor ${NOISE}px): ${results.length} shots, ${changed.length} changed, ${noise.length} noise-only → crops in ${outDir}`);
for (const r of changed) {
  if (r.missing || r.error) { console.log(`- ${r.f}: ${r.missing ? 'MISSING' : r.error}`); continue; }
  console.log(`- ${r.f}: ${r.diff} px (${(r.ratio * 100).toFixed(3)}%) size ${r.sizeA.join('x')}→${r.sizeB.join('x')} bands ${r.bands.length}: ${r.bands.slice(0, 8).map(b => `[x${b[0]}-${b[2]} y${b[1]}-${b[3]}]`).join(' ')}`);
}
