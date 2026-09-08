# Phase 0 — Inventory and baseline

Measured **7 September 2026**, against the existing working tree in `/Users/jose/workspace/emposo-new-website/weave-clone`. Local preview: `http://localhost:8080`. No production URL was supplied.

Scope: six existing static pages, their assets, source/build configuration and JavaScript. This is an inventory, not the Phase 1 audit. No website files were changed, no build was run, and no dependencies were installed. Existing modified/untracked files were preserved. Only this report was added to the project. Final SHA-256 comparisons confirmed all 71 inventoried payload files were unchanged.

## 1. File tree and pages

```text
weave-clone/
├── index.html
├── expertise/index.html
├── portfolio/index.html
├── case-studies/
│   ├── index.html
│   └── data2ai-platform/index.html
├── about-us/index.html
├── sections/                         15 homepage fragments
│   ├── 00-skip.html, 01-header.html, 02-hero.html, 02a-journeys.html
│   ├── 03-models.html, 04-about.html, 05-industries.html, 06-work.html
│   ├── 07-slider.html, 07a-quote.html, 07aa-faq.html, 07ab-career.html
│   └── 07b-sales-cta.html, 08-footer.html, 99-close.html
├── styles/
│   ├── main.css, 00-components.css, 00-base-remainder.css
│   └── 08-editorial.css, 09-page-templates.css
├── css/                              browser-loaded stylesheets
│   └── 00-fonts.css, site.css
├── js/
│   ├── 00-core.js, 01-header.js, 02-intent-links.js
│   └── 03-connection-system.js, 06-work.js
├── assets/
│   ├── brand/                        23 files: 2 PNG logos, 7 JPEGs, 14 AVIFs
│   ├── generated/                    32 files: 8 PNGs, 8 JPEGs, 16 AVIFs
│   ├── fonts/                        Inter latin + latin-ext WOFF2
│   └── vendor/lenis.min.js
├── tools/                            optimize-images.mjs, optimize-brand-images.mjs
├── assemble.mjs, package.json, package-lock.json, README.md
└── .git/, .gitignore, node_modules/   excluded from payload totals
```

All six documents contain `lang="de"` and `noindex, nofollow`. Titles are at line 6; homepage robots metadata is at `index.html:9`, other pages at line 8. Fragments are not counted as standalone pages.

| ID used below | Route | Source/title location | HTML bytes | Anchor elements |
|---|---|---|---:|---:|
| H | `/` | `index.html:6` | 30,677 | 44 |
| E | `/expertise/` | `expertise/index.html:6` | 14,668 | 46 |
| P | `/portfolio/` | `portfolio/index.html:6` | 13,643 | 38 |
| C | `/case-studies/` | `case-studies/index.html:6` | 15,550 | 37 |
| D | `/case-studies/data2ai-platform/` | `case-studies/data2ai-platform/index.html:6` | 10,072 | 39 |
| A | `/about-us/` | `about-us/index.html:6` | 10,546 | 37 |

Titles, in the same order: “Emposo | Die Outcome Factory der Hays-Gruppe”; “Expertise | Emposo”; “Portfolio | Emposo”; “Case Studies | Emposo”; “Data2AI Plattform | Case Study | Emposo”; “Über uns | Emposo”.

`assemble.mjs:9` reads ordered homepage fragments; `assemble.mjs:28` writes only the homepage. The five other documents are standalone HTML files. Shared navigation/footer markup exists in all six documents.

## 2. Bytes: available files versus transferred payload

All sizes below are bytes, not KB. Filesystem counts use Node `statSync`; each physical file is counted once. HTML includes inline SVG, inline attributes and comments. Source CSS, section fragments, build tools, package files, dependencies and repository metadata are excluded.

### Available browser-asset pool on disk

This is the directory-deploy candidate pool, **not** the amount downloaded on a page load. The actual deployment manifest is unknown.

| Type | Files | Uncompressed bytes |
|---|---:|---:|
| HTML | 6 | 95,156 |
| CSS | 2 | 64,591 |
| JS | 6 | 26,965 |
| images | 55 | 129,821,321 |
| fonts | 2 | 133,704 |
| **Total** | **71** | **130,141,737** |

The 23 brand images total **113,379,038 B** and are referenced by the six HTML documents or compiled CSS, including responsive alternatives and JPEG fallbacks. The 32 generated images total **16,442,283 B**; no references to them were found in those delivered HTML/CSS files. Alternative formats/sizes are not additive page downloads.

Largest image on disk: `assets/brand/pharma.jpg`, **26,580,990 B**. Largest image actually requested in these navigations: `assets/brand/data.jpg`, **9,825,912 B** decoded resource size / **9,826,188 B** transferred; its CSS reference is `styles/09-page-templates.css:330`.

### Browser-observed transfer, per navigation

Source: Lighthouse `resource-summary` and `network-requests` records. Transfer includes encoded response payload and reported HTTP overhead. These are local-server navigation totals during Lighthouse's collection window, **not a full-scroll or all-interactions asset budget**. Lazy images outside that window can add bytes later. Shared assets are counted again for each cold navigation.

| Page | Profile | HTML | CSS | JS | Images | Fonts | Total | Requests |
|---|---|---:|---:|---:|---:|---:|---:|---:|
| H | mobile | 8,471 | 14,256 | 10,892 | 143,558 | 48,719 | 225,896 | 14 |
| E | mobile | 4,364 | 14,256 | 7,261 | 124,050 | 48,719 | 198,650 | 11 |
| P | mobile | 4,429 | 14,256 | 7,261 | 9,889,899 | 48,719 | 9,964,564 | 11 |
| C | mobile | 4,402 | 14,256 | 8,707 | 63,711 | 48,719 | 139,795 | 11 |
| D | mobile | 3,587 | 14,256 | 7,261 | 95,505 | 48,719 | 169,328 | 10 |
| A | mobile | 3,630 | 14,256 | 7,261 | 80,045 | 48,719 | 153,911 | 10 |
| H | desktop | 8,471 | 14,256 | 10,892 | 95,505 | 48,719 | 177,843 | 13 |
| E | desktop | 4,364 | 14,256 | 7,261 | 124,050 | 48,719 | 198,650 | 11 |
| P | desktop | 4,429 | 14,256 | 7,261 | 9,858,180 | 48,719 | 9,932,845 | 10 |
| C | desktop | 4,402 | 14,256 | 8,707 | 63,711 | 48,719 | 139,795 | 11 |
| D | desktop | 3,587 | 14,256 | 7,261 | 95,505 | 48,719 | 169,328 | 10 |
| A | desktop | 3,630 | 14,256 | 7,261 | 80,045 | 48,719 | 153,911 | 10 |

All recorded page/resource requests returned HTTP 200 over local HTTP/1.1; no navigation redirects were recorded for these trailing-slash URLs. Production HTTP version, cache policy, compression and response headers have not been measured. A local HEAD request returned `Content-Length: 30677`, `ETag`, `Vary: Accept-Encoding` and `Accept-Ranges: bytes`; that is not evidence of production configuration.

### JavaScript files and independently encoded sizes

Gzip level 9 and Brotli quality 11 were calculated in memory with Node zlib. These are reproducible encoding sizes, **not claimed hosting transfer sizes**. The final column is the actual local browser transfer.

| File | Raw | Gzip 9 | Brotli 11 | Observed transfer |
|---|---:|---:|---:|---:|
| `assets/vendor/lenis.min.js:1` | 14,348 | 3,982 | 3,559 | 4,424 |
| `js/00-core.js:1` | 2,593 | 1,130 | 922 | 1,491 |
| `js/01-header.js:1` | 2,916 | 1,020 | 812 | 1,346 |
| `js/02-intent-links.js:1` | 1,160 | 557 | 424 | 896 |
| `js/03-connection-system.js:1` | 2,936 | 924 | 748 | 1,289 |
| `js/06-work.js:1` | 3,012 | 1,109 | 864 | 1,446 |
| **All scripts, homepage** | **26,965** | **8,722** | **7,329** | **10,892** |

CSS total: **64,591 B raw**, **12,524 B gzip 9**, **11,023 B Brotli 11**, **14,256 B observed transfer** across two stylesheet requests.

## 3. Third-party code, fonts and stylesheets

**Zero external-origin script, font or stylesheet requests** appeared in the twelve measured navigations. No external resource tags were found in the six documents. Third-party-authored resources are self-hosted:

| Resource | Provenance/version observed | Raw bytes | Observed transfer | Render blocking / loading |
|---|---|---:|---:|---|
| `assets/vendor/lenis.min.js:1` | Lenis; embedded `lenisVersion="1.2.3"` | 14,348 | 4,424 | Deferred classic script on every page; not parser/render-blocking |
| `assets/fonts/inter-var-latin.woff2` | Inter variable, declared weights 300–600 | 48,432 | 48,719 | Preloaded on all pages; `font-display: swap`, not a blocking stylesheet |
| `assets/fonts/inter-var-latin-ext.woff2` | Inter variable extended subset | 85,272 | 0 in measured runs | Conditional unicode-range font; not requested in these runs |
| `css/00-fonts.css:6` | Local Inter `@font-face` declarations | 1,090 | 883 | Render-blocking stylesheet in the head |
| `css/site.css:1` | Locally compiled Tailwind + project CSS | 63,501 | 13,373 | Render-blocking stylesheet in the head; no browser-side Tailwind engine |

Resource tags: `index.html:15`, `index.html:17`, `index.html:21`, `index.html:252`; subpage examples at `expertise/index.html:10` and `case-studies/index.html:16`. Font definitions: `css/00-fonts.css:6` and `css/00-fonts.css:15`.

The Google Fonts URL at `css/00-fonts.css:3` is a regeneration comment, not a network import. The body font stack starts with `"Roboto", "Inter", Arial, sans-serif` (`styles/main.css:270`, `styles/08-editorial.css:18`); no Roboto font file or remote import is configured.

## 4. Tailwind and build baseline

| Item | Current configuration / evidence |
|---|---|
| Installed versions | `npm ls --depth=0`: `tailwindcss@4.3.3`, `@tailwindcss/cli@4.3.3` |
| Delivery | CLI-built, minified `css/site.css`; no Play CDN |
| Build | `package.json:6`: `tailwindcss -i ./styles/main.css -o ./css/site.css --minify` |
| Assembly | `package.json:13`: homepage assembly followed by CSS build |
| Layers/imports | `styles/main.css:38`: theme, base, components, utilities; imports theme and utilities, excludes Preflight |
| Source scanning | `styles/main.css:55`: `source(none)`; explicit `@source` entries at lines 58–60 for `sections/`, root `index.html`, `js/` |
| Scanning coverage | The five subpage documents under `expertise/`, `portfolio/`, `case-studies/` and `about-us/` are **not scanned**. Existing compiled utilities were not regenerated or exhaustively matched to every class in Phase 0. Scanning coverage is not complete for the current page tree. |
| Theme configuration | CSS-first `@theme` at `styles/main.css:110`; no project `tailwind.config.js` |
| Other styling | `styles/00-components.css:29` uses `@apply`; `styles/main.css:372` imports three handwritten CSS files, including the editorial/page-template rules |
| Commands not executed | `npm run build` and `npm run check` both write generated files; excluded from this read-only baseline |

Complete project `@theme` declarations below, comments omitted. Tailwind's imported default theme remains in addition to these overrides.

```css
@theme {
  --breakpoint-xs: 480px;
  --breakpoint-lg: 992px;
  --breakpoint-xl: 1440px;
  --color-lemon: #f7911e;
  --color-lemon-100: #f7911e;
  --color-ink: #00143d;
  --color-ink-strong: #00143d;
  --color-ink-inverse: #ffffff;
  --color-stone: #666666;
  --color-label-dim: #737373;
  --color-heading-ghost: #acacac;
  --color-bg: #ffffff;
  --color-bg-dark: #00143d;
  --color-bg-dark-2: #000d29;
  --color-banner-black: #00143d;
  --color-paper: #f5f0eb;
  --color-surface-eggshell: #f5f0eb;
  --color-surface-ash: #8fa8c8;
  --color-chip-bg: #ffffff;
  --color-btn-hover-text: #ffffff;
  --color-grey-150: #f5f5f3;
  --color-grey-200: #e5e5e2;
  --color-border-soft: #c9c9c5;
  --color-french-gray: #d4d4d0;
  --color-leader-line: #d1d1cd;
  --ease-out-quad: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  --ease-snap: cubic-bezier(0.77, 0, 0.175, 1);
}
```

Additional `:root` aliases/composite tokens are at `styles/main.css:152`: palette aliases; overlays; graph-paper geometry; `--gutter: 4.5vw`; `--container-max: 93.6111rem`; `--banner-h: 3.40278rem`. Root font-size rules are at `styles/main.css:348`: 1vw, 14.4px at ≥1440px, 1.8vw at ≤600px.

Installed tooling also includes `serve@14.2.6`, `concurrently@9.2.4`, `esbuild@0.28.2`, `sharp@0.35.4`. Only Lenis and the five project scripts are browser-loaded; these npm tools are not included in the JS payload.

## 5. Behavior inventory

Source inspection only unless explicitly identified as a measured navigation. No contact message was submitted, no mail client was opened, and no end-to-end behavior pass is claimed.

| Source | Existing JavaScript behavior | Native equivalent / effect without this JS |
|---|---|---|
| `js/00-core.js:35`, vendored Lenis | Wheel smoothing with continuous requestAnimationFrame; skipped when reduced motion is set at initialization | Native scrolling works without it; CSS smooth anchor scrolling is available, but not identical wheel interpolation |
| `js/00-core.js:54` | Immediate Lenis scroll for the skip link | Native `href="#main"` remains |
| `js/00-core.js:21` | Shared ready queue and global media-query/Lenis handles | Deferred scripts/DOMContentLoaded provide native lifecycle primitives; deleting the core file alone prevents the dependent callbacks from registering |
| `js/01-header.js:12` | Close mobile disclosure after link click or expansion past 1120px | Opening/closing is already native `details/summary`; those automatic close conditions are enhancements |
| `js/01-header.js:22` | Close desktop nav disclosures on link, Escape or outside click; Escape restores summary focus | Native details supplies disclosure; popover supplies light-dismiss, but is not equivalent across the entire iOS 16+ target |
| `js/01-header.js:42` | Toggle scrolled-header appearance after 12px | Sticky positioning is CSS; this exact threshold class is JS-driven |
| `js/01-header.js:48` | Scroll-based active-section tracking and `aria-current` | No `data-section-link` consumers in current HTML; `:target` represents URL target, not live viewport position |
| `js/02-intent-links.js:14` | Career CTA preselects contact interest and reveals a live hint | Anchor navigation remains; cross-control preselection/live text has no direct HTML equivalent |
| `js/03-connection-system.js:11` | Start/settle hero route animation after 1,650ms; reduced-motion branch | CSS keyframes and reduced-motion media queries can represent this timed decorative state |
| `js/03-connection-system.js:25` | Five industry buttons activate SVG paths on hover/focus/click and update pressed state; arrow keys cycle focus | CSS hover/focus can highlight; a native radio group can model exclusive selection, but current buttons/ARIA require JS |
| `js/03-connection-system.js:61` | IntersectionObserver starts network drawing once, at 25% visibility | CSS animations handle drawing; exact viewport-triggered behavior is not a universal native replacement across this browser target |
| `js/06-work.js:9` | Combined industry/outcome filters hide project cards; updates count, empty state and pressed states | All cards exist in HTML; CSS radio/`:checked` filtering is possible, but computed count/live announcements need additional logic |
| `js/06-work.js:51` | Outcome preselection via `data-project-filter` links | No matching links in current HTML |
| `js/06-work.js:57` | Validate form; construct encoded mailto subject/body and hand off to mail client | Native validation and mailto action exist; JS supplies the formatted subject/body, not a server submission |

Page coverage: core/header/Lenis on all six pages; intent-links and connection-system on homepage only; work script on homepage and Case Studies index. Homepage has six project cards; Case Studies has ten. Default filter state is `all/all`. Both provide industry/outcome controls (`sections/06-work.html:5`, `case-studies/index.html:84`).

Already-native interactions: two desktop navigation disclosures and one mobile disclosure per page; four FAQ disclosures on homepage (`sections/07aa-faq.html:2`). No JS carousel/modal/video-embed behavior was found in the loaded scripts.

### Form, tracking and redirect contract

One form at `index.html:240`, authored in `sections/07b-sales-cta.html:2`:

- `action="mailto:jose.caravaca@emposo.eu"`, `method="post"`, `enctype="text/plain"`.
- Required fields: `name` (autocomplete name), `company` (organization), `email` (email type/autocomplete), `interest` (select), `message` (textarea).
- Interest options: Optimierung einer bestehenden Leistung; Transformation / AI-Use-Case; Skalierung eines Programms; Karriere bei Emposo; Anderes Anliegen.
- JS subject: `Emposo Anfrage: {interest}`; body includes all five fields, encoded with `encodeURIComponent` (`js/06-work.js:63`).
- Career preselection source: `sections/07ab-career.html:5`.
- No HTTP form backend is configured; README explicitly documents mailto (`README.md:26`). Delivery depends on the visitor's mail client and was not tested.
- No analytics tags, tracking-event calls, fetch/XHR/beacon calls, cookie/storage writes or service-worker registration were found in the delivered markup and project scripts. This does not establish production consent/privacy compliance.
- The only project-script location assignment is the mailto handoff (`js/06-work.js:72`). No redirect configuration file was found in the site tree; deployment-level rules remain unknown.

### Complete anchor destination inventory

**241 anchor elements**: 223 resolve statically to an existing page/fragment, plus 18 `href="#"` placeholders. Every footer's Impressum, Datenschutz and Barrierefreiheit currently uses `#`. This is a target inventory, not a keyboard/click test.

Cells contain source line numbers in the page identified in §1; `×N` counts multiple anchors on that line. Thus every current anchor occurrence is represented, including local and root-relative variants. The logo links with no text have image/ARIA labels in markup.

| Literal href | H | E | P | C | D | A |
|---|---|---|---|---|---|---|
| `#main` | 33 | 18 | 18 | 19 | 18 | 18 |
| `/` | 38 | 21, 61 | 21, 61 | 22, 50 | 21, 49 | 21, 49 |
| `/expertise/` | 44, 68, 244 | 27, 51, 197 | 27, 51, 177 | 27, 41, 159 | 26, 40, 122 | 26, 40, 114 |
| `/expertise/#engineering` | 45 | — | 28 | 27 | 26 | 26 |
| `/expertise/#technology` | 46 | — | 29 | 27 | 26 | 26 |
| `/portfolio/` | 52, 68, 244 | 35, 51, 163, 197 | 35, 51, 177 | 31, 41, 159 | 30, 40, 122 | 30, 40, 114 |
| `/portfolio/#optimieren` | 53, 112, 133 | 36, 88, 94 | — | 31 | 30 | 30 |
| `/portfolio/#transformieren` | 54, 113, 134 | 37, 100, 118, 124 | — | 31 | 30, 110 | 30 |
| `/portfolio/#skalieren` | 55, 114, 135 | 38, 106, 136 | — | 31 | 30 | 30 |
| `/portfolio/#verzahnen` | 56, 136 | 39, 130 | — | 31 | 30 | 30 |
| `/#industries` | 59, 68, 244 | 42, 51, 197 | 42, 51, 177 | 33, 41, 159 | 32, 40, 122 | 32, 40, 114 |
| `/case-studies/` | 60, 68, 82, 244 | 43, 51, 197 | 43, 51, 177 | 34, 41, 159 | 33, 40, 49, 117, 122 | 33, 40, 114 |
| `/about-us/` | 61, 68, 244 | 44, 51, 197 | 44, 51, 177 | 35, 41, 159 | 34, 40, 122 | 34, 40, 114 |
| `/#career` | 63, 68, 244 | 46, 51, 197 | 46, 51, 177 | 37, 41, 159 | 36, 40, 122 | 36, 40, 114 |
| `/#contact` | 64, 68, 244 | 47, 51, 192, 197 | 47, 51, 172, 177 | 38, 41, 154, 159 | 37, 40, 122 | 37, 40, 109, 114 |
| `/portfolio/#delivery-model` | 123, 244 | 197 | — | 159 | 122 | 95, 114 |
| `#contact` | 233 | — | — | — | — | — |
| `/#faq` | 244 | 197 | 177 | 159 | 122 | 114 |
| `#` | 244×3 | 197×3 | 177×3 | 159×3 | 122×3 | 114×3 |
| `#engineering` | — | 28 | — | — | — | — |
| `#technology` | — | 29 | — | — | — | — |
| `/case-studies/data2ai-platform/` | — | 183 | 164 | 106 | — | — |
| `#optimieren` | — | — | 36 | — | — | — |
| `#transformieren` | — | — | 37 | — | — | — |
| `#skalieren` | — | — | 38 | — | — | — |
| `#verzahnen` | — | — | 39 | — | — | — |
| `/about-us/#delivery` | — | — | 148 | — | — | — |
| `#delivery-model` | — | — | 177 | — | — | — |
| `/expertise/#ai-data` | — | — | — | — | 110 | — |

## 6. Lighthouse and Core Web Vitals baseline

### Measurement method

- Used **already-cached Lighthouse 12.8.2**, Node **24.16.0**, installed **HeadlessChrome 152.0.0.0**. No download/install.
- Twelve sequential navigations, one per page/profile; **not a median or p75**. Started 18:35:47–18:37:05 UTC (20:35:47–20:37:05 Europe/Berlin).
- Temporary clean Chrome profile, default Lighthouse storage/cache reset, local `serve` server, no interaction script. Local asset-inventory work also ran during collection; this was not an isolated performance machine.
- Mobile: Lighthouse default Moto G Power (2022) user-agent profile, **412×823 CSS px, DPR 1.75**, simulated **150ms RTT / 1,638.4 Kbps / 4× CPU slowdown**.
- Desktop: Lighthouse desktop config, **1350×940 CSS px, DPR 1**, simulated **40ms RTT / 10,240 Kbps / 1× CPU**.
- Lighthouse uses `throttlingMethod: simulate`: reported throttled LCP is the tool's model output from the collected trace, **not directly timed production traffic or a physical Moto G measurement**. Actual local unthrottled observed LCP was 43–133ms across these traces.
- No Lighthouse run warnings/runtime errors. Category scores below are tool output, not manually estimated. Lighthouse accessibility scores do not establish full WCAG conformance.

### Results

LCP below is Lighthouse's simulated-throttling result in seconds. CLS is the navigation trace result. TBT is milliseconds and **not INP**.

| Page | Profile | Performance | Accessibility | Best practices | SEO | LCP s | CLS | TBT ms |
|---|---|---:|---:|---:|---:|---:|---:|---:|
| H | mobile | 99 | 93 | 96 | 63 | 2.180 | 0 | 0 |
| E | mobile | 99 | 90 | 96 | 63 | 1.954 | 0 | 0 |
| P | mobile | 75 | 90 | 96 | 63 | 49.881 | 0 | 6 |
| C | mobile | 99 | 92 | 96 | 63 | 1.953 | 0 | 8 |
| D | mobile | 99 | 91 | 96 | 63 | 2.104 | 0 | 0 |
| A | mobile | 99 | 90 | 96 | 63 | 1.954 | 0 | 14 |
| H | desktop | 100 | 97 | 100 | 63 | 0.444 | 0 | 0 |
| E | desktop | 100 | 95 | 100 | 63 | 0.423 | 0 | 0 |
| P | desktop | 75 | 95 | 100 | 63 | 8.085 | 0 | 0 |
| C | desktop | 100 | 96 | 100 | 63 | 0.444 | 0 | 0 |
| D | desktop | 100 | 95 | 100 | 63 | 0.444 | 0 | 0 |
| A | desktop | 100 | 95 | 100 | 63 | 0.404 | 0 | 0 |

All documents are currently marked noindex/nofollow; the reported SEO scores are for that exact preview state, not a hypothetical launch configuration.

| Core Web Vital | Available evidence | Field p75 status |
|---|---|---|
| LCP | Lab values above | Not measured: no production URL, CrUX or RUM dataset supplied |
| CLS | 0 in all twelve initial-navigation traces | Not measured; full-session/interaction shifts were not tested |
| INP | Not measured; no real-user interaction sample | Unavailable; no substitution with TBT or a guessed value |

Raw Lighthouse JSON and the measurement runner are in `/private/tmp/emposo-baseline.ZqIlaH/`: `{mobile,desktop}-{home,expertise,portfolio,case-studies,case-studies-data2ai-platform,about-us}.json`, and `measure.mjs`. These are temporary local evidence files, not shipped assets. Reproduction with the cached tooling: `node /private/tmp/emposo-baseline.ZqIlaH/measure.mjs` while this same preview server and working tree are available.

## 7. Context needed before Phase 1

1. Production/staging URL, launch status and hosting/deploy platform, including any configuration outside this repository.
2. Primary audience and expected desktop/mobile split.
3. Authoritative brand manual and immutable logo/colour/typeface requirements. The current CSS declares Roboto first but supplies Inter; identify which typeface is required.
4. Owner's known pain points and priorities. Confirm whether preview noindex and mail-client-only contact are intentional for launch or temporary.

Not yet performed: the Phase 1 dimension-by-dimension audit, standalone raw axe run, keyboard/no-JS/form-submission tests, contrast measurement, full viewport matrix, HTML validation or production header checks. No findings severity, fix plan, dependency proposal or code batch is issued in this phase.

**Gate: stop here. Phase 1 requires explicit approval.**
