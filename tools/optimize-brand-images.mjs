// Build responsive AVIF derivatives for the curated Emposo source imagery.
// JPGs remain as fallbacks; the site prefers the smaller AVIF variants.
import sharp from 'sharp';
import { readdirSync, statSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = join(dirname(fileURLToPath(import.meta.url)), '..', 'assets', 'brand');
const sources = readdirSync(dir).filter((file) => file.endsWith('.jpg'));
const widths = [1600, 900];

let sourceBytes = 0;
let outputBytes = 0;
for (const source of sources) {
  const src = join(dir, source);
  const name = basename(source, '.jpg');
  const meta = await sharp(src).metadata();
  sourceBytes += statSync(src).size;

  for (const requestedWidth of widths) {
    const info = await sharp(src)
      .resize({ width: requestedWidth, withoutEnlargement: true })
      .avif({ quality: 58, effort: 5 })
      .toFile(join(dir, `${name}-${requestedWidth}.avif`));
    outputBytes += info.size;
    console.log(`${name}-${requestedWidth}.avif  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)}KB`);
  }
}

console.log(`\n${sources.length} source JPGs (${(sourceBytes / 1048576).toFixed(1)}MB) → ${sources.length * widths.length} AVIF files (${(outputBytes / 1048576).toFixed(1)}MB)`);
