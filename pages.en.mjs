// English page manifest, derived from pages.mjs: same content sources (their
// English twins in pages/en/ and sections/en/ when present), English paths
// from content/i18n.mjs, and English titles and descriptions from META below.
// A page without an English title or description keeps the German one and is
// listed in .i18n/untranslated.json. Titles and descriptions are copy: the
// owner approves them (docs/i18n.md).
import { localizePath, untranslated } from './content/i18n.mjs';

// Keyed by the German page's `out`: { title, description }.
export const META = {};

const pathOf = out => out === 'index.html' ? '/' : `/${out.replace(/index\.html$/, '')}`;
const outOf = path => `${path.replace(/^\//, '')}index.html`;

export function pagesEn(pagesDe) {
  return pagesDe.map(page => {
    const out = page.out === '404.html' ? 'en/404.html' : outOf(localizePath(pathOf(page.out), 'en'));
    const meta = META[page.out] ?? {};
    for (const field of ['title', 'description']) if (!meta[field]) untranslated.set(`meta:${page.out}.${field}`, page[field]);
    return { ...page, locale: 'en', out, twinOut: page.out, title: meta.title ?? page.title, description: meta.description ?? page.description };
  });
}
