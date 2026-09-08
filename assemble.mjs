// Generates every shipped HTML document from shared partials plus per-page
// content, driven by pages.mjs. Run after any content/partial change:
//   node assemble.mjs
//
// Layout contract (formerly documented in sections/00-skip.html): the skip
// link and <header> render OUTSIDE <main> — a banner landmark must not live
// inside main, and the skip link must actually skip the nav. assemble wraps
// each page's content in <main id="main" tabindex="-1"> itself; content
// sources must not open or close <main>.
//
// Template syntax (partials + content):
//   {{TITLE}} {{DESCRIPTION}} {{BODY_CLASS}} {{SCRIPTS}}   head substitutions
//   {{CUR:key: payload}}   payload emitted when page.nav === key (class stamping)
//   {{CURATTR:key}}        aria-current="page" when page.nav === key
//                          (aria-current="true" when the page sets navExact: false)
//   <!-- partial:name -->  inlines partials/name.html (e.g. the contact form)
import { readFileSync, writeFileSync, readdirSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import pages from './pages.mjs';

const root = dirname(fileURLToPath(import.meta.url));
const partial = (name) => readFileSync(join(root, 'partials', `${name}.html`), 'utf8');

const head = partial('head');
const header = partial('header');
const footer = partial('footer');

const sectionsDir = join(root, 'sections');
const sectionBody = () =>
  readdirSync(sectionsDir)
    .filter((f) => f.endsWith('.html'))
    .sort()
    .map((f) => `<!-- ${f} -->\n${readFileSync(join(sectionsDir, f), 'utf8').trim()}`)
    .join('\n\n');

const inlinePartials = (html) =>
  html.replace(/<!-- partial:([a-z0-9-]+) -->/g, (_, name) => partial(name).trim());

const stampNav = (html, page) => {
  const current = page.navExact === false ? 'aria-current="true"' : 'aria-current="page"';
  return html
    .replace(/\{\{CUR:([a-z-]+):([^}]*)\}\}/g, (_, key, payload) => (key === page.nav ? payload : ''))
    .replace(/\{\{CURATTR:([a-z-]+)\}\}/g, (_, key) => (key === page.nav ? ` ${current}` : ''));
};

for (const page of pages) {
  const scripts = page.scripts.map((s) => `  <script defer src="/js/${s}.js"></script>`).join('\n');
  const pageHead = head
    .replaceAll('{{TITLE}}', page.title)
    .replaceAll('{{DESCRIPTION}}', page.description)
    .replaceAll('{{BODY_CLASS}}', page.bodyClass)
    .replaceAll('{{SCRIPTS}}', scripts);
  const content =
    page.content === 'sections'
      ? sectionBody()
      : readFileSync(join(root, page.content), 'utf8').trim();
  const html =
    pageHead +
    stampNav(header, page) +
    '<main id="main" tabindex="-1">\n' +
    inlinePartials(content) +
    '\n</main>\n' +
    footer;
  const outPath = join(root, page.out);
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, html);
}
console.log(`assembled: ${pages.length} pages`);
