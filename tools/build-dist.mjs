// Assembles the production webroot in dist/: only what the site ships.
// Needs no build tools — it copies the committed outputs, so `npm start`
// works on any host whether or not it ran `npm run build` first.
import { cpSync, mkdirSync, rmSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import pages from '../pages.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
rmSync(dist, { recursive: true, force: true });
mkdirSync(dist);

const copy = (path, filter) => cpSync(join(root, path), join(dist, path), { recursive: true, filter });
for (const page of pages) copy(page.out);
copy('css');
copy('js');
copy('serve.json');
copy('robots.txt');
copy('sitemap.xml');
// Masters, superseded art and build-time inputs stay out of the webroot:
// icons are inlined into the HTML, manifests are read by the generators.
const SKIP_ASSETS = /\/assets\/(src|archive|icons)(\/|$)|\.png$|manifest\.json$/;
copy('assets', src => !SKIP_ASSETS.test(src));
// Indexing is a deployment decision, safe by default: every host (Railway
// previews included) sends noindex unless it sets INDEXABLE=true, which only
// the emposo.de production deployment should.
const indexable = process.env.INDEXABLE === 'true';
if (!indexable) {
  const config = JSON.parse(readFileSync(join(dist, 'serve.json'), 'utf8'));
  config.headers.find(h => h.source === '**/*').headers.push({ key: 'X-Robots-Tag', value: 'noindex, nofollow' });
  writeFileSync(join(dist, 'serve.json'), JSON.stringify(config, null, 2) + '\n');
}
if (!existsSync(join(dist, '404.html'))) throw new Error('dist: 404.html missing');
console.log(`dist: ${pages.length} pages + css, js, assets — ${indexable ? 'INDEXABLE' : 'noindex (set INDEXABLE=true to publish)'}`);
