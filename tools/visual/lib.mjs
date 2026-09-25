// Shared harness for visual/smoke checks against the served site (read-only).
import puppeteer from 'puppeteer-core';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';

export const REPO = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
export const BASE = process.env.BASE || 'http://localhost:8080';
export const CHROME = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

export const CORE = ['/', '/portfolio/', '/branchen/', '/case-studies/', '/case-studies/data2ai-platform/', '/about-us/', '/karriere/', '/kontakt/', '/404.html'];

export async function allRoutes() {
  const pages = (await import(pathToFileURL(`${REPO}/pages.mjs`).href + `?t=${process.hrtime.bigint()}`)).default;
  return pages.map(p => p.out === 'index.html' ? '/' : p.out.endsWith('/index.html') ? '/' + p.out.slice(0, -'index.html'.length) : '/' + p.out);
}

export const slug = r => r === '/' ? 'home' : r.replace(/^\/|\/$/g, '').replaceAll('/', '_').replace('.html', '');

export function launch() {
  return puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--hide-scrollbars'] });
}

export async function pool(items, n, fn) {
  const out = new Array(items.length); let i = 0;
  await Promise.all(Array.from({ length: n }, async () => { while (i < items.length) { const k = i++; out[k] = await fn(items[k], k); } }));
  return out;
}

export const PROPS = ['display', 'position', 'top', 'right', 'bottom', 'left', 'color', 'background-color', 'background-image', 'background-position', 'background-size',
  'border-top-width', 'border-right-width', 'border-bottom-width', 'border-left-width', 'border-top-style', 'border-right-style', 'border-bottom-style', 'border-left-style',
  'border-top-color', 'border-right-color', 'border-bottom-color', 'border-left-color',
  'border-top-left-radius', 'border-top-right-radius', 'border-bottom-right-radius', 'border-bottom-left-radius', 'box-shadow',
  'font-family', 'font-size', 'font-weight', 'font-style', 'line-height', 'letter-spacing', 'text-transform', 'text-decoration-line', 'text-decoration-color', 'text-decoration-thickness', 'text-underline-offset', 'text-align', 'white-space',
  'padding-top', 'padding-right', 'padding-bottom', 'padding-left', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left', 'row-gap', 'column-gap',
  'grid-template-columns', 'grid-template-rows', 'grid-column-start', 'grid-column-end', 'flex-direction', 'flex-wrap', 'justify-content', 'align-items', 'align-self', 'order',
  'width', 'height', 'min-height', 'min-width', 'max-width', 'max-height', 'aspect-ratio', 'object-fit', 'object-position',
  'opacity', 'visibility', 'transform', 'transform-origin', 'translate', 'scale', 'rotate', 'filter', 'mix-blend-mode',
  'transition-property', 'transition-duration', 'transition-timing-function', 'transition-delay', 'animation-name', 'animation-duration',
  'outline-style', 'outline-width', 'outline-color', 'outline-offset', 'z-index', 'cursor', 'pointer-events', 'overflow-x', 'overflow-y',
  'mask-image', 'fill', 'stroke', 'stroke-width', 'content', 'list-style-type', 'direction', 'unicode-bidi', 'writing-mode'];

// Runs in the page. Keys survive sibling insertions of a different signature.
export function dumpInPage(PROPS) {
  const sig = el => el.tagName.toLowerCase() + (el.classList.length ? '.' + [...el.classList].sort().join('.') : '');
  const keyOf = (el, tagOnly) => {
    const parts = [];
    for (let e = el; e && e !== document.documentElement; e = e.parentElement) {
      const s = tagOnly ? e.tagName.toLowerCase() : sig(e);
      let i = 0; for (let p = e.previousElementSibling; p; p = p.previousElementSibling) if ((tagOnly ? p.tagName.toLowerCase() : sig(p)) === s) i++;
      parts.unshift(`${s}[${i}]`);
    }
    return parts.join('>');
  };
  const r1 = n => Math.round(n * 10) / 10;
  const out = {};
  const els = [document.documentElement, ...document.querySelectorAll('body, body *')];
  for (const el of els) {
    const rects = el.getClientRects();
    if (!rects.length && el !== document.documentElement) continue;
    const b = el.getBoundingClientRect();
    const k = keyOf(el, false);
    const rec = (cs) => PROPS.map(p => cs.getPropertyValue(p));
    const text = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent).join('').trim().slice(0, 40);
    out[k] = { t: keyOf(el, true), c: el.getAttribute('class') || '', x: text, r: [r1(b.x + scrollX), r1(b.y + scrollY), r1(b.width), r1(b.height)], v: rec(getComputedStyle(el)) };
    for (const pseudo of ['::before', '::after', '::marker']) {
      const cs = getComputedStyle(el, pseudo);
      const content = cs.getPropertyValue('content');
      if (pseudo === '::marker' ? el.tagName !== 'SUMMARY' && el.tagName !== 'LI' : (!content || content === 'none' || content === 'normal')) continue;
      out[k + pseudo] = { t: keyOf(el, true) + pseudo, c: el.getAttribute('class') || '', x: '', r: null, v: rec(cs) };
    }
  }
  return { url: location.pathname, w: innerWidth, docH: document.documentElement.scrollHeight, docW: document.documentElement.scrollWidth, n: Object.keys(out).length, els: out };
}

export async function settle(page, ms = 600) {
  await page.evaluate(() => document.fonts.ready);
  await new Promise(r => setTimeout(r, ms));
}
