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
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import pages from './pages.mjs';
import { escape, picture, fragment, projectPage } from './content/render.mjs';
import { projects, disciplines } from './content/site-data.mjs';

const root = dirname(fileURLToPath(import.meta.url));
// The production origin every page declares as canonical (the site stays
// noindex until launch; this only fixes which URL a page claims to be).
const SITE_ORIGIN = 'https://emposo.de';
const images = JSON.parse(readFileSync(join(root, 'assets', 'supplied', 'manifest.json'), 'utf8'));
// Organization facts are the Impressum's, nothing more.
const organization = { '@type': 'Organization', '@id': `${SITE_ORIGIN}/#organization`, name: 'Emposo GmbH', url: `${SITE_ORIGIN}/`,
  email: 'info@emposo.eu', telephone: '+49 621 1788 0',
  address: { '@type': 'PostalAddress', streetAddress: 'Glücksteinallee 67', postalCode: '68163', addressLocality: 'Mannheim', addressCountry: 'DE' },
  parentOrganization: { '@type': 'Organization', name: 'Hays Holding GmbH' } };
const website = { '@type': 'WebSite', '@id': `${SITE_ORIGIN}/#website`, name: 'Emposo', url: `${SITE_ORIGIN}/`, inLanguage: 'de-DE', publisher: { '@id': organization['@id'] } };
// Share image: the page's own hero photo (case studies: the project image), else the homepage hero.
const shareImage = page => {
  const key = page.content.startsWith?.('project:') ? projects.find(p => p.slug === page.content.slice(8))?.image
    : (Array.isArray(page.content) ? page.content : [page.content]).map(f => readFileSync(join(root, f), 'utf8').match(/\{\{image:([a-z0-9-]+):hero\}\}/)?.[1]).find(Boolean);
  return images[key] || images['hero-flow'];
};
// BreadcrumbList from the page's own visible breadcrumb (existing labels only).
const unescape = t => t.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').trim();
const breadcrumb = (body, url) => {
  const crumb = body.match(/<p class="page-breadcrumb">([\s\S]*?)<\/p>/)?.[1];
  if (!crumb) return null;
  const links = [...crumb.matchAll(/<a href="([^"]+)">([\s\S]*?)<\/a>/g)].map(([, href, name]) => ({ name: unescape(name), item: `${SITE_ORIGIN}${href}` }));
  const tail = crumb.slice(crumb.lastIndexOf('</span>') + 7);
  // A trail that ends at its parent link names the page by its own H1.
  const current = /<a /.test(tail) ? unescape(body.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1] || '') : unescape(tail);
  const items = [...links, ...(current ? [{ name: current, item: url }] : [])];
  return { '@type': 'BreadcrumbList', itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: it.item })) };
};
const seoMeta = (page, body) => {
  const path = canonicalPath(page.out);
  if (!path) return '  <meta name="robots" content="noindex">\n';
  const url = `${SITE_ORIGIN}${path}`, img = shareImage(page);
  const tags = [['og:type', 'website'], ['og:site_name', 'Emposo'], ['og:locale', 'de_DE'], ['og:title', page.title], ['og:description', page.description], ['og:url', url],
    ['og:image', `${SITE_ORIGIN}${img.src}`], ['og:image:width', img.width], ['og:image:height', img.height], ['og:image:alt', img.alt]]
    .map(([p, v]) => `  <meta property="${p}" content="${escape(String(v))}">`);
  tags.push('  <meta name="twitter:card" content="summary_large_image">');
  const graph = { '@context': 'https://schema.org', '@graph': [organization, website,
    { '@type': 'WebPage', '@id': url, url, name: page.title, description: page.description, inLanguage: 'de-DE', isPartOf: { '@id': website['@id'] }, primaryImageOfPage: `${SITE_ORIGIN}${img.src}` }] };
  const crumbs = breadcrumb(body, url);
  if (crumbs) { graph['@graph'].push(crumbs); graph['@graph'][2].breadcrumb = { '@id': `${url}#breadcrumb` }; crumbs['@id'] = `${url}#breadcrumb`; }
  // Leistungen: one Service per discipline, with the name and topic line the page shows.
  if (page.out === 'portfolio/index.html') for (const d of disciplines)
    graph['@graph'].push({ '@type': 'Service', name: d.name, description: d.topics, provider: { '@id': organization['@id'] }, areaServed: 'DE' });
  // Case study: Article from the project data (no author/date: the data has none).
  const project = page.content.startsWith?.('project:') && projects.find(p => p.slug === page.content.slice(8));
  if (project) graph['@graph'].push({ '@type': 'Article', '@id': `${url}#article`, headline: project.name, description: project.headline, image: `${SITE_ORIGIN}${img.src}`, inLanguage: 'de-DE', publisher: { '@id': organization['@id'] }, mainEntityOfPage: { '@id': url } });
  // JSON-LD is a data block, not script: the CSP's script-src does not apply.
  tags.push(`  <script type="application/ld+json">${JSON.stringify(graph).replace(/</g, '\\u003c')}</script>`);
  return tags.join('\n') + '\n';
};
const canonicalPath = out => out === 'index.html' ? '/' : out.endsWith('/index.html') ? `/${out.slice(0, -'index.html'.length)}` : null;
const partial = (name) => readFileSync(join(root, 'partials', `${name}.html`), 'utf8');

const head = partial('head');
// header/footer run through the same inliner as page content (for {{brand:…}});
// inlinePartials is defined below but only invoked lazily inside the loop.
const header = partial('header');
const footer = partial('footer');

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
// Their <style> blocks are dropped: the strict CSP forbids inline styles, so the
// logo's rules live in styles/11-components.css.
const brand = (name) => readFileSync(join(root, 'assets', 'brand', `${name}.svg`), 'utf8').replace(/\s*<style>[\s\S]*?<\/style>/g, '').trim();

const inlinePartials = (html) => html
  .replace(/<!-- partial:([a-z0-9-]+) -->/g, (_, name) => partial(name).trim())
  .replace(/<!-- content:([a-z0-9-]+) -->/g, (_, name) => fragment(name))
  .replace(/\{\{brand:([a-z0-9-]+)\}\}/g, (_, name) => brand(name))
  .replace(/\{\{icon:([a-z0-9-]+)\}\}/g, (_, name) => icon(name))
  .replace(/\{\{image:([a-z0-9-]+)(:hero)?\}\}/g, (_, name, hero) => picture(name, hero ? '(max-width: 900px) 100vw, 65vw' : undefined, !!hero));

const pageContent = page => {
  if (Array.isArray(page.content)) return page.content.map(file=>readFileSync(join(root,file),'utf8').trim()).join('\n\n');
  if (page.content.startsWith('project:')) return projectPage(page.content.slice(8));
  return readFileSync(join(root,page.content),'utf8').trim();
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
  const body = inlinePartials(pageContent(page));
  const scripts = page.scripts.map((s) => `  <script defer src="/js/${s}.js"></script>`).join('\n');
  // Escaped, and via replacer functions so `$…` in copy is never treated as
  // a replacement pattern.
  const pageHead = head
    .replaceAll('{{TITLE}}', () => escape(page.title))
    .replaceAll('{{DESCRIPTION}}', () => escape(page.description))
    .replaceAll('{{META}}', () => seoMeta(page, body))
    .replaceAll('{{CANONICAL}}', () => { const path = canonicalPath(page.out); return path ? `  <link rel="canonical" href="${SITE_ORIGIN}${path}">\n` : ''; })
    .replaceAll('{{BODY_CLASS}}', () => page.bodyClass)
    .replaceAll('{{SCRIPTS}}', () => scripts);
  const html =
    pageHead +
    stampNav(headerInlined, page) +
    '<main id="main" tabindex="-1">\n' +
    body +
    '\n</main>\n' +
    footerInlined;
  const outPath = join(root, page.out);
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, html);
}
const routes = pages.map(p => canonicalPath(p.out)).filter(Boolean);
writeFileSync(join(root, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.map(r => `  <url><loc>${SITE_ORIGIN}${r}</loc></url>`).join('\n')}\n</urlset>\n`);
writeFileSync(join(root, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE_ORIGIN}/sitemap.xml\n`);
console.log(`assembled: ${pages.length} pages, sitemap.xml (${routes.length} URLs), robots.txt`);
