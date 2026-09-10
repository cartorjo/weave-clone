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
import { escape, picture, fragment, projectPage, industryPage, disciplinePage } from './content/render.mjs';

const root = dirname(fileURLToPath(import.meta.url));
const partial = (name) => readFileSync(join(root, 'partials', `${name}.html`), 'utf8');

const head = partial('head');
// header/footer run through the same inliner as page content (for {{brand:…}});
// inlinePartials is defined below but only invoked lazily inside the loop.
const header = partial('header');
const footer = partial('footer');

const sectionsDir = join(root, 'sections');
const sectionBody = () =>
  readdirSync(sectionsDir)
    .filter((f) => f.endsWith('.html'))
    .sort()
    .map((f) => `<!-- ${f} -->\n${readFileSync(join(sectionsDir, f), 'utf8').trim()}`)
    .join('\n\n');

// Supplied outline icons (Hays Glow set, assets/icons/): 72×72 stroked SVGs
// with a hardcoded orange. Inline them with currentColor so CSS decides the
// color (CD handbook: icons in Emposo weiß, orange, blau).
const icon = (name) => readFileSync(join(root, 'assets', 'icons', `${name}.svg`), 'utf8')
  .replace('<svg ', '<svg aria-hidden="true" focusable="false" ')
  .replace(/\swidth="72"\sheight="72"/, '')
  .replaceAll('stroke="#E8730E"', 'stroke="currentColor"')
  .replaceAll('fill="#E8730E"', 'fill="currentColor"')
  .trim();

// Brand SVGs (assets/brand/) are inlined verbatim: the logo uses currentColor
// for its ink parts, so it renders dark blue in the header and white in the
// footer, and its live "The Outcome Factory" text uses the page's Roboto.
const brand = (name) => readFileSync(join(root, 'assets', 'brand', `${name}.svg`), 'utf8').trim();

const inlinePartials = (html) => html
  .replace(/<!-- partial:([a-z0-9-]+) -->/g, (_, name) => partial(name).trim())
  .replace(/<!-- content:([a-z0-9-]+) -->/g, (_, name) => fragment(name))
  .replace(/\{\{brand:([a-z0-9-]+)\}\}/g, (_, name) => brand(name))
  .replace(/\{\{icon:([a-z0-9-]+)\}\}/g, (_, name) => icon(name))
  .replace(/\{\{image:([a-z0-9-]+)(:hero)?\}\}/g, (_, name, hero) => picture(name, hero ? '(max-width: 900px) 100vw, 65vw' : undefined, !!hero));

const pageContent = page => {
  if (Array.isArray(page.content)) return page.content.map(file=>readFileSync(join(root,file),'utf8').trim()).join('\n\n');
  if (page.content.startsWith('project:')) return projectPage(page.content.slice(8));
  if (page.content.startsWith('industry:')) return industryPage(page.content.slice(9));
  if (page.content.startsWith('discipline:')) return disciplinePage(page.content.slice(11));
  return page.content === 'sections' ? sectionBody() : readFileSync(join(root,page.content),'utf8').trim();
};

const stampNav = (html, page) => {
  // page.nav: the item that IS this page (aria-current="page", or "true"
  // when navExact:false marks a same-section sibling like a case detail).
  // page.navGroup: the megamenu group an inner page belongs to — the group
  // and its Übersicht link get ancestor state (is-current / aria-current="true").
  const exact = page.navExact === false ? 'aria-current="true"' : 'aria-current="page"';
  return html
    .replace(/\{\{CUR:([a-z-]+):([^}]*)\}\}/g, (_, key, payload) =>
      key === page.nav || key === page.navGroup ? payload : '')
    .replace(/\{\{CURATTR:([a-z-]+)\}\}/g, (_, key) => {
      if (key === page.nav) return ` ${exact}`;
      if (key === page.navGroup) return ' aria-current="true"';
      return '';
    });
};

const headerInlined = inlinePartials(header);
const footerInlined = inlinePartials(footer);

for (const page of pages) {
  const scripts = page.scripts.map((s) => `  <script defer src="/js/${s}.js"></script>`).join('\n');
  // Escaped, and via replacer functions so `$…` in copy is never treated as
  // a replacement pattern.
  const pageHead = head
    .replaceAll('{{TITLE}}', () => escape(page.title))
    .replaceAll('{{DESCRIPTION}}', () => escape(page.description))
    .replaceAll('{{BODY_CLASS}}', () => page.bodyClass)
    .replaceAll('{{SCRIPTS}}', () => scripts);
  const content = pageContent(page);
  const html =
    pageHead +
    stampNav(headerInlined, page) +
    '<main id="main" tabindex="-1">\n' +
    inlinePartials(content) +
    '\n</main>\n' +
    footerInlined;
  const outPath = join(root, page.out);
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, html);
}
console.log(`assembled: ${pages.length} pages`);
