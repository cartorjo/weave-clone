// Usage: node tools/visual/snapshot.mjs <outDir> [--routes=all|core|/a/,/b/] [--widths=390,1000,1400] [--no-shots] [--no-dump]
// Computed-style dump runs with motion allowed (real transition values), before any scroll.
// Screenshots run under prefers-reduced-motion (countup + Lenis skipped → deterministic).
import { mkdirSync, writeFileSync } from 'node:fs';
import { BASE, CORE, PROPS, allRoutes, slug, launch, pool, dumpInPage, settle } from './lib.mjs';

const args = process.argv.slice(2);
const outDir = args.find(a => !a.startsWith('--'));
if (!outDir) { console.error('outDir required'); process.exit(2); }
const opt = k => args.find(a => a.startsWith(`--${k}=`))?.split('=')[1];
const flag = k => args.includes(`--${k}`);
const routesArg = opt('routes') || 'all';
const routes = routesArg === 'all' ? await allRoutes() : routesArg === 'core' ? CORE : routesArg.split(',');
const widths = (opt('widths') || '390,1000,1400').split(',').map(Number);
mkdirSync(`${outDir}/dump`, { recursive: true });
mkdirSync(`${outDir}/shots`, { recursive: true });

const browser = await launch();
const jobs = routes.flatMap(r => widths.map(w => ({ r, w })));
const problems = [];
await pool(jobs, 6, async ({ r, w }) => {
  const name = `${slug(r)}@${w}`;
  const page = await browser.newPage();
  await page.setCacheEnabled(false);
  try {
    if (!flag('no-dump')) {
      await page.setViewport({ width: w, height: 900 });
      await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }]);
      const res = await page.goto(BASE + r, { waitUntil: 'networkidle0', timeout: 45000 });
      if (res.status() >= 400 && !r.startsWith('/404')) problems.push(`${name}: HTTP ${res.status()}`);
      await settle(page, 1500);
      const data = await page.evaluate(dumpInPage, PROPS);
      writeFileSync(`${outDir}/dump/${name}.json`, JSON.stringify(data));
    }
    if (!flag('no-shots')) {
      await page.setViewport({ width: w, height: 900 });
      await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
      await page.goto(BASE + r, { waitUntil: 'networkidle0', timeout: 45000 });
      await page.evaluate(async () => {
        const imgs = [...document.images];
        imgs.forEach(i => { i.loading = 'eager'; });
        await Promise.all(imgs.map(i => (i.complete ? Promise.resolve() : new Promise(res => { i.addEventListener('load', res, { once: true }); i.addEventListener('error', res, { once: true }); })).then(() => i.decode().catch(() => {}))));
        const frame = () => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
        for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight / 2) { scrollTo(0, y); await frame(); }
        scrollTo(0, 0); await frame();
        await Promise.all(imgs.map(i => i.decode().catch(() => {})));
        await frame();
      });
      await settle(page, 400);
      await page.screenshot({ path: `${outDir}/shots/${name}.png`, fullPage: true, captureBeyondViewport: true });
    }
  } catch (e) { problems.push(`${name}: ${e.message}`); }
  finally { await page.close(); }
});
await browser.close();
writeFileSync(`${outDir}/meta.json`, JSON.stringify({ routes, widths, props: PROPS, problems }, null, 1));
console.log(`snapshot: ${routes.length} routes × ${widths.length} widths → ${outDir}${problems.length ? `\nPROBLEMS:\n${problems.join('\n')}` : ''}`);
process.exitCode = problems.length ? 1 : 0;
