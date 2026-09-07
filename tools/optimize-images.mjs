// Generates AVIF variants for every JPG in assets/generated/ at a full-size
// and a half-size tier (no upscaling — descriptors always carry the REAL
// output width). Run after adding/replacing source JPGs: npm run build:img
// Markup consumes these via <picture><source type="image/avif" srcset sizes>.
import sharp from 'sharp';
import { readdirSync, statSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = join(dirname(fileURLToPath(import.meta.url)), '..', 'assets', 'generated');
const jpgs = readdirSync(dir).filter((f) => f.endsWith('.jpg'));

let inBytes = 0;
let outBytes = 0;
for (const file of jpgs) {
  const src = join(dir, file);
  const name = basename(file, '.jpg');
  const meta = await sharp(src).metadata();
  inBytes += statSync(src).size;
  for (const width of [meta.width, Math.round(meta.width / 2)]) {
    const out = join(dir, `${name}-${width}.avif`);
    const info = await sharp(src)
      .resize({ width, withoutEnlargement: true })
      .avif({ quality: 55 })
      .toFile(out);
    if (info.width !== width) throw new Error(`${out}: expected ${width}px, got ${info.width}px`);
    outBytes += info.size;
    console.log(`${name}-${width}.avif  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)}KB`);
  }
}
console.log(`\n${jpgs.length} JPGs (${(inBytes / 1048576).toFixed(2)}MB) -> ${jpgs.length * 2} AVIFs (${(outBytes / 1048576).toFixed(2)}MB)`);
