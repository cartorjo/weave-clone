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
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import pagesDe from './pages.mjs';
import { pagesEn } from './pages.en.mjs';
import { BUILD_EN, PUBLISHED, localizePath, t, untranslated } from './content/i18n.mjs';
import { escape, picture, fragment, projectPage, pageHero, setLocale, localizedData, imageAlt, breadcrumb as breadcrumbMarkup } from './content/render.mjs';
import { shareKey, shareSrc, SHARE } from './content/share.mjs';
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
  // Standalone PNG of the header logo (ink on white, tagline rendered, B-31).
  logo: { '@type': 'ImageObject', url: `${SITE_ORIGIN}/assets/brand/emposo-logo-organization.png`, width: 896, height: 288 },
  contactPoint: { '@type': 'ContactPoint', contactType: 'customer service', email: 'info@emposo.eu', telephone: '+49 621 1788 0' },
  // The profile emposo.de links today (owner-approved 2026-09-26, B-46).
  sameAs: ['https://www.linkedin.com/company/emposo/'],
  parentOrganization: { '@type': 'Organization', name: 'Hays Holding GmbH' } };
const LANG_TAG = { de: 'de-DE', en: 'en-US' };
const OG_LOCALE = { de: 'de_DE', en: 'en_US' };
const website = { '@type': 'WebSite', '@id': `${SITE_ORIGIN}/#website`, name: 'Emposo', url: `${SITE_ORIGIN}/`, inLanguage: 'de-DE', publisher: { '@id': organization['@id'] } };
// Share image: a 1200x630 crop of the page's hero (content/share.mjs, B-32).
const shareImage = page => { const key = shareKey(root, page); return { src: shareSrc(key), width: SHARE.width, height: SHARE.height, alt: imageAlt(key) }; };
// BreadcrumbList from the page's own visible breadcrumb (existing labels only).
const unescape = t => t.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').trim();
const breadcrumb = (body, url) => {
  const crumb = body.match(/<nav class="page-breadcrumb"[^>]*>([\s\S]*?)<\/nav>/)?.[1];
  if (!crumb) return null;
  const links = [...crumb.matchAll(/<a href="([^"]+)">([\s\S]*?)<\/a>/g)].map(([, href, name]) => ({ name: unescape(name), item: `${SITE_ORIGIN}${href}` }));
  // A trail that ends at its parent link names the page by its own H1.
  const own = crumb.match(/<span aria-current="page">([\s\S]*?)<\/span>/)?.[1];
  const current = own ? unescape(own) : unescape(body.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1] || '');
  const items = [...links, ...(current ? [{ name: current, item: url }] : [])];
  return { '@type': 'BreadcrumbList', itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: it.item })) };
};
const seoMeta = (page, body) => {
  const path = canonicalPath(page.out);
  if (!path) return '  <meta name="robots" content="noindex">\n';
  const url = `${SITE_ORIGIN}${path}`, img = shareImage(page);
  const tags = [['og:type', 'website'], ['og:site_name', 'Emposo'], ['og:locale', OG_LOCALE[page.locale]], ['og:title', page.title], ['og:description', page.description], ['og:url', url],
    ['og:image', `${SITE_ORIGIN}${img.src}`], ['og:image:width', img.width], ['og:image:height', img.height], ['og:image:alt', img.alt]]
    .map(([p, v]) => `  <meta property="${p}" content="${escape(String(v))}">`);
  tags.push('  <meta name="twitter:card" content="summary_large_image">');
  const graph = { '@context': 'https://schema.org', '@graph': [organization, website,
    { '@type': 'WebPage', '@id': url, url, name: page.title, description: page.description, inLanguage: LANG_TAG[page.locale], isPartOf: { '@id': website['@id'] }, primaryImageOfPage: `${SITE_ORIGIN}${img.src}`, dateModified: lastModified(page) }] };
  const crumbs = breadcrumb(body, url);
  if (crumbs) { graph['@graph'].push(crumbs); graph['@graph'][2].breadcrumb = { '@id': `${url}#breadcrumb` }; crumbs['@id'] = `${url}#breadcrumb`; }
  // Leistungen: one Service per discipline, with the name and topic line the page shows.
  if (page.twinOut === 'portfolio/index.html' || page.out === 'portfolio/index.html') for (const d of localizedData('disciplines'))
    graph['@graph'].push({ '@type': 'Service', '@id': `${url}#${d.slug}`, url: `${url}#${d.slug}`, name: d.name, description: d.topics, provider: { '@id': organization['@id'] }, areaServed: 'DE' });
  // Case study: Article from the project data. Author is the organization;
  // datePublished is the day the case study went online on this site (B-46).
  const project = page.content.startsWith?.('project:') && localizedData('projects').find(p => p.slug === page.content.slice(8));
  if (project) graph['@graph'].push({ '@type': 'Article', '@id': `${url}#article`, headline: project.name, description: project.headline, image: `${SITE_ORIGIN}${img.src}`, inLanguage: LANG_TAG[page.locale], author: { '@id': organization['@id'] }, publisher: { '@id': organization['@id'] }, datePublished: firstPublished(page), dateModified: lastModified(page), mainEntityOfPage: { '@id': url } });
  // JSON-LD is a data block, not script: the CSP's script-src does not apply.
  tags.push(`  <script type="application/ld+json">${JSON.stringify(graph).replace(/</g, '\\u003c')}</script>`);
  return tags.join('\n') + '\n';
};
// Last modified = the day of the last commit touching a page's sources (its
// own files, the shared partials, the content layer). Uncommitted changes
// count as today, the day their commit lands, so committed outputs stay
// reproducible. Day granularity; CI checks out full history.
const git = args => execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim();
const today = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
const pageSources = page => [...(Array.isArray(page.content) ? page.content : page.content.startsWith('project:') ? [] : [page.content]), 'partials', 'content', 'pages.mjs', ...(page.locale === 'de' ? [] : ['pages.en.mjs'])];
// Without a repository (Railway's build snapshot ships no .git) the committed
// sitemap.xml already holds the dates git would answer: reuse them so the
// rebuilt output equals the committed one; a page not listed there (404) is today.
const gitAvailable = (() => { try { return git(['rev-parse', '--is-inside-work-tree']) === 'true'; } catch { return false; } })();
const committedLastmod = new Map(gitAvailable || !existsSync(join(root, 'sitemap.xml')) ? [] : [...readFileSync(join(root, 'sitemap.xml'), 'utf8').matchAll(/<loc>([^<]+)<\/loc><lastmod>([^<]+)<\/lastmod>/g)].map(m => [m[1], m[2]]));
const lastModified = page => {
  if (!gitAvailable) return committedLastmod.get(`${SITE_ORIGIN}${canonicalPath(page.out)}`) ?? today();
  const files = pageSources(page);
  if (git(['status', '--porcelain', '--', ...files])) return today();
  return git(['log', '-1', '--format=%cs', '--', ...files]);
};
// First published = the day of the commit that first added the page's output
// (owner decision 2026-09-26, B-46); a page not yet committed counts as today.
// Without a repository the committed page already carries that date.
const committedPublished = page => { try { return readFileSync(join(root, page.out), 'utf8').match(/"datePublished":"(\d{4}-\d{2}-\d{2})"/)?.[1]; } catch { return undefined; } };
const firstPublished = page => (gitAvailable ? git(['log', '--diff-filter=A', '--format=%cs', '--', page.out]).split('\n').filter(Boolean).pop() : committedPublished(page)) || today();
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

// <page-hero id crumb [parent="href|label"] [modifier] [figure-class] [image]>copy</page-hero>
// and <page-crumb label="…"> expand to the shared renderers, so page sources
// hold only their copy while the frame is defined once.
const attrs = raw => Object.fromEntries([...raw.matchAll(/([a-z-]+)="([^"]*)"/g)].map(([, k, v]) => [k, v]));
const expandComponents = html => html
  .replace(/<page-hero\b([^>]*)>([\s\S]*?)<\/page-hero>/g, (_, raw, copy) => {
    const a = attrs(raw);
    return pageHero({ id: a.id, crumb: a.crumb, parent: a.parent?.split('|'), modifier: a.modifier, figureClass: a['figure-class'],
      copy: copy.trim(), figure: a.image ? `{{image:${a.image}:hero}}` : null });
  })
  .replace(/<page-crumb label="([^"]*)"><\/page-crumb>/g, (_, label) => breadcrumbMarkup(label));

const inlinePartials = (html) => expandComponents(html)
  .replace(/<!-- partial:([a-z0-9-]+) -->/g, (_, name) => partial(name).trim())
  .replace(/<!-- content:([a-z0-9-]+) -->/g, (_, name) => fragment(name))
  .replace(/\{\{brand:([a-z0-9-]+)\}\}/g, (_, name) => brand(name))
  .replace(/\{\{icon:([a-z0-9-]+)\}\}/g, (_, name) => icon(name))
  .replace(/\{\{image:([a-z0-9-]+)(:hero)?\}\}/g, (_, name, hero) => picture(name, hero ? '(max-width: 900px) 100vw, 65vw' : undefined, !!hero));

// {{t:key}} and {{href:/path/}} in partials resolve per page locale.
const localizeTokens = (html, locale) => html
  .replace(/\{\{t:([a-zA-Z0-9.]+)\}\}/g, (_, key) => t(locale, key))
  .replace(/\{\{href:([^}]*)\}\}/g, (_, path) => localizePath(path, locale));

// An English page reads its twin source (pages/en/x.html) when it exists and
// falls back to the German one (recorded) until the translation lands.
const source = (page, file) => {
  if (page.locale === 'de') return file;
  const twin = file.replace(/^(pages|sections)\//, '$1/en/');
  if (existsSync(join(root, twin))) return twin;
  untranslated.set(`file:${file}`, file);
  return file;
};
const pageContent = page => {
  if (Array.isArray(page.content)) return page.content.map(file=>readFileSync(join(root,source(page, file)),'utf8').trim()).join('\n\n');
  if (page.content.startsWith('project:')) return projectPage(page.content.slice(8));
  return readFileSync(join(root,source(page, page.content)),'utf8').trim();
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

// The German pages, then (EN=1 or once published) their English twins.
const pages = [...pagesDe.map(page => ({ ...page, locale: 'de' })), ...(BUILD_EN ? pagesEn(pagesDe) : [])];
const twinPath = page => page.twinOut && canonicalPath(page.twinOut);
const published = page => PUBLISHED.includes(page.locale);
// hreflang pairs: on German pages only once English is published, so the
// German output stays byte-identical until then.
const alternates = page => {
  const twin = pages.find(p => p !== page && (p.twinOut === page.out || page.twinOut === p.out));
  if (!twin || !canonicalPath(page.out) || !(published(twin) || page.locale !== 'de')) return '';
  const de = page.locale === 'de' ? page : twin, en = page.locale === 'de' ? twin : page;
  return [[ 'de', de ], [ 'en', en ], [ 'x-default', de ]].map(([lang, p]) => `  <link rel="alternate" hreflang="${lang}" href="${SITE_ORIGIN}${canonicalPath(p.out)}">\n`).join('');
};

// The language switch (owner design 2026-09-27): a plain link to the twin page,
// named in the target language, with the grid globe. It appears once both
// languages are published; before that only the English preview carries it,
// so the German output stays byte-identical. The names are endonyms, the same
// in both locales, as the owner supplied them.
const SWITCH_LABEL = { en: '<span>English</span> <span class="lang-switch__region">United States</span>', de: '<span>Deutsch</span>' };
const langSwitch = (page, slot) => {
  const twin = pages.find(p => p !== page && (p.twinOut === page.out || page.twinOut === p.out));
  if (!twin || !(published(twin) || page.locale !== 'de')) return '';
  const path = canonicalPath(twin.out) ?? (twin.locale === 'de' ? '/' : '/en/');
  const cls = slot === 'header' ? 'lang-switch max-nav:hidden min-h-11' : 'lang-switch lang-switch--menu min-h-11';
  return `<a class="${cls}" href="${path}" hreflang="${twin.locale}" lang="${twin.locale}"><span class="lang-switch__icon" aria-hidden="true">${icon('globe-grid-line')}</span>${SWITCH_LABEL[twin.locale]}</a>`;
};

for (const page of pages) {
  setLocale(page.locale);
  const headerInlined = localizeTokens(inlinePartials(header), page.locale)
    // An absent switch leaves no trace, not even its line, so German output is unchanged.
    .replace(/\n[ ]*\{\{LANGSWITCH:([a-z]+)\}\}/g, (_, slot) => { const html = langSwitch(page, slot); return html ? `\n${slot === 'header' ? '    ' : '        '}${html}` : ''; });
  const footerInlined = localizeTokens(inlinePartials(footer), page.locale);
  let body = localizeTokens(inlinePartials(pageContent(page)), page.locale);
  // English bodies keep German source paths; the route map localizes them.
  if (page.locale !== 'de') body = body.replace(/href="(\/[^"]*)"/g, (_, path) => `href="${localizePath(path, page.locale)}"`);
  const scripts = page.scripts.map((s) => `  <script defer src="/js/${s}.js"></script>`).join('\n');
  // Escaped, and via replacer functions so `$…` in copy is never treated as
  // a replacement pattern.
  const pageHead = head
    .replaceAll('{{LANG}}', () => page.locale)
    .replaceAll('{{ALTERNATES}}', () => alternates(page))
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
const routes = pages.filter(published).map(p => canonicalPath(p.out)).filter(Boolean);
const indexed = pages.filter(p => canonicalPath(p.out) && published(p));
writeFileSync(join(root, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${indexed.map(p => `  <url><loc>${SITE_ORIGIN}${canonicalPath(p.out)}</loc><lastmod>${lastModified(p)}</lastmod></url>`).join('\n')}\n</urlset>\n`);
writeFileSync(join(root, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE_ORIGIN}/sitemap.xml\n`);
if (BUILD_EN) {
  mkdirSync(join(root, '.i18n'), { recursive: true });
  writeFileSync(join(root, '.i18n', 'untranslated.json'), JSON.stringify(Object.fromEntries(untranslated), null, 1) + '\n');
}
console.log(`assembled: ${pages.length} pages, sitemap.xml (${routes.length} URLs), robots.txt${BUILD_EN ? `; English fallbacks: ${untranslated.size} (.i18n/untranslated.json)` : ''}`);
