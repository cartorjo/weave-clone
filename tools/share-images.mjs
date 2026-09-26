// Share images at 1200x630 (1.91:1, the summary_large_image / og ratio), cut
// from each hero's 1600w JPEG with the same centre crop the hero uses
// (object-fit: cover). No new photography. Output: assets/share/<key>-1200x630.jpg
//   node tools/share-images.mjs   (every page's share key, content/share.mjs; stale crops removed)
import { readFileSync, mkdirSync, existsSync, readdirSync, rmSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import pages from '../pages.mjs';
import { shareKey, shareSrc, SHARE } from '../content/share.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const images = JSON.parse(readFileSync(resolve(root, 'assets/supplied/manifest.json'), 'utf8'));
const out = resolve(root, 'assets/share'); mkdirSync(out, { recursive: true });
const keys = [...new Set(pages.map(page => shareKey(root, page)))].sort();
const wanted = new Set(keys.map(k => shareSrc(k).split('/').pop()));
for (const f of readdirSync(out)) if (!wanted.has(f)) rmSync(`${out}/${f}`);
for (const key of keys) {
  const src = resolve(root, images[key].src.slice(1));
  if (!existsSync(src)) { console.error(`skip ${key}: ${images[key].src} missing`); continue; }
  await sharp(src).resize(SHARE.width, SHARE.height, { fit: 'cover', position: 'centre' }).jpeg({ quality: 80, mozjpeg: true }).toFile(resolve(root, shareSrc(key).slice(1)));
}
console.log(`share images: ${keys.length} → assets/share/`);
