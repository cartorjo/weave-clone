// Builds the deployable image set from the masters in assets/src/{brand,generated}:
//   NAME-<w>.avif  (q58, effort 5)  at 1600w and 900w
//   NAME-<w>.webp  (q80)            at 1600w and 900w   (pre-AVIF Safari)
//   NAME-<w>.jpg   (q80, mozjpeg)   at 1600w            (<img src> fallback)
// Widths never upscale; file names always carry the REAL output width so
// srcset descriptors stay truthful. Emits assets/images-manifest.json with
// the actual dimensions for markup generation. Run: npm run build:img
import sharp from 'sharp';
import { readdirSync, statSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname, extname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const kinds = ['brand', 'generated'];
const manifest = {};
let inBytes = 0;
let outBytes = 0;
let files = 0;

for (const kind of kinds) {
  const srcDir = join(root, 'assets', 'src', kind);
  const outDir = join(root, 'assets', kind);
  mkdirSync(outDir, { recursive: true });
  const masters = readdirSync(srcDir).filter((f) => /\.(jpe?g|png)$/i.test(f));
  // Prefer a PNG master when both exist for the same base name.
  const byBase = new Map();
  for (const f of masters) {
    const base = basename(f, extname(f));
    if (!byBase.has(base) || extname(f).toLowerCase() === '.png') byBase.set(base, f);
  }

  for (const [base, file] of byBase) {
    const src = join(srcDir, file);
    const meta = await sharp(src).metadata();
    inBytes += statSync(src).size;
    const widths = [...new Set([Math.min(1600, meta.width), Math.min(900, meta.width)])];
    const entry = { kind, variants: {} };

    for (const width of widths) {
      for (const [format, options] of [
        ['avif', { quality: 58, effort: 5 }],
        ['webp', { quality: 80 }],
      ]) {
        const out = join(outDir, `${base}-${width}.${format}`);
        const info = await sharp(src).resize({ width, withoutEnlargement: true })[format](options).toFile(out);
        if (info.width !== width) throw new Error(`${out}: expected ${width}px, got ${info.width}px`);
        outBytes += info.size;
        files += 1;
        entry.variants[`${format}-${width}`] = { width: info.width, height: info.height, bytes: info.size };
      }
    }
    const jpgWidth = widths[0];
    const out = join(outDir, `${base}-${jpgWidth}.jpg`);
    const info = await sharp(src).resize({ width: jpgWidth, withoutEnlargement: true }).jpeg({ quality: 80, mozjpeg: true, progressive: true }).toFile(out);
    outBytes += info.size;
    files += 1;
    entry.variants[`jpg-${jpgWidth}`] = { width: info.width, height: info.height, bytes: info.size };
    manifest[base] = entry;
    console.log(`${kind}/${base}: ${Object.keys(entry.variants).join(', ')}`);
  }
}

writeFileSync(join(root, 'assets', 'images-manifest.json'), JSON.stringify(manifest, null, 1));
console.log(`\n${Object.keys(manifest).length} masters (${(inBytes / 1048576).toFixed(1)}MB) -> ${files} files (${(outBytes / 1048576).toFixed(1)}MB)`);
