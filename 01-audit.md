# Phase 1 — Website audit

Audited 7–8 September 2026. Scope: the six pages in `weave-clone`, served locally at `http://localhost:8080`. Findings only: **no website source, asset, dependency or configuration changes**. This report and its diagnostic evidence are the only additions. Production URL, hosting details, brand/typeface authority and launch decisions remain unspecified.

## Executive summary

**30 findings: 0 P0 identified, 4 P1, 9 P2, 17 P3.** Untested environments are not assumed defect-free. The five priorities are:

1. **Restore readable, scalable text.** At 390px the root is 7.02px and menu text is 5.48px. In the 200%-equivalent reflow test, the root halves, cancelling enlargement. Fixing this affects site-wide layout.
2. **Separate decorative orange from readable text orange.** The current orange measures 2.32:1 on white and 2.05:1 on paper; every page has contrast violations, including selected and hover states.
3. **Increase touch-target size/spacing.** Eight footer links fail axe target-size checks on each mobile page; two additional related links fail on the case detail.
4. **Stop downloading the original Portfolio hero JPEG.** It transfers 9.83 MB. Lighthouse reports 75 performance and 49.881s simulated mobile LCP for Portfolio; these are lab/model results, not production timings.
5. **Resolve the contact and legal launch paths.** Contact only hands off to a mail client; eighteen legal/privacy/accessibility links point to `#`. Backend and notice content require owner decisions.

The first four items are P1. Contact/legal readiness is P2 because the current site explicitly identifies itself as a preview and mailto is documented as intentional.

Effort: S ≈ up to half a day; M ≈ 1–2 days; L ≈ several days. These are planning estimates, not measured implementation times. Findings are grouped by dimension, with P1-bearing groups first and severities sorted within each group.

## Evidence and limits

- [Raw axe results](audit-evidence/axe-raw.json) contain **all violation objects and affected nodes**, their HTML/selectors, rule checks, failure messages, contrast/target-size data, and separate incomplete/manual-review results from fourteen runs.
- [Measurements](audit-evidence/measurements.json) contain responsive layouts, document structure, interaction results, zoom-equivalent samples, source/CSS/image inventory, and the mocked mailto test.
- [Phase 0 baseline](00-baseline.md) contains twelve Lighthouse runs, payloads and the complete 241-anchor inventory. It has not been overwritten.
- Browser: **Chrome 152.0.7977.76**, cached Puppeteer and **axe-core 4.13.0**. Initial axe runs used WCAG 2 A/AA, 2.1 A/AA, 2.2 AA and best-practice tags at **1440×900** and **390×844**. Additional runs exercised Expertise hover and the mobile menu open state.
- Tested all pages at widths **320, 375, 390, 768, 1024, 1280, 1440, 1920**, plus **844×390 landscape** and the **600/601px** boundary.
- Tested 1440×900/1×, 720×450/2× and 360×225/4× device-metrics layouts. These are **200%/400% reflow-equivalent emulations**, not OS/browser UI zoom or Safari text resizing. No horizontal document overflow occurred in these samples; that does not mean text actually enlarged sufficiently.
- No production/field CWV, real-device Safari/iOS, Firefox, Edge, screen-reader session or W3C validator run was available. No HTML validator dependency was installed and no preview HTML was uploaded to an external validation service.
- Body-copy character counts per line and every text-over-image/gradient contrast combination were not exhaustively measured. axe's incomplete image/gradient cases remain manual verification work, not passes.
- Native form validation and mailto formatting were tested without sending mail. Receipt, delivery, no-handler behavior and server-side spam/security controls were not tested; no HTTP backend exists.
- Temporary runners, full-page screenshots and additional raw DOM captures remain in `/private/tmp/emposo-audit.v51nqR/`. A [mobile contact/career capture](/private/tmp/emposo-audit.v51nqR/contact-390.png) shows the small form typography and the actual career image. Reports/evidence are review artifacts, not production assets.

### Raw axe rule index

Counts are **affected node occurrences**, not unique defects; repeated shared markup is counted on each page. Read the raw JSON for every failed element rather than treating this table as the violation list.

| Page | Contrast nodes, 1440px | Contrast nodes, 390px | Target-size nodes, 390px |
|---|---:|---:|---:|
| Home | 19 | 19 | 8 |
| Expertise | 14 | 13 | 8 |
| Portfolio | 9 | 8 | 8 |
| Case index | 24 | 23 | 8 |
| Case detail | 7 | 6 | 10 |
| About | 11 | 10 | 8 |

Desktop default-state target-size violations: zero. Expertise hover: **17 contrast nodes** versus 14 at rest. Open mobile menu run: **19 contrast nodes and 8 target-size nodes** on the homepage; it introduced no additional target-size violations in that run.

`aria-prohibited-attr` and unresolved image/gradient `color-contrast` results appear under **incomplete**, not in the automatic violation counts. They are not silently promoted to confirmed WCAG failures or marked passing.

### Checks already correct or working

| Check | Observed result |
|---|---|
| Document basics | One h1 per page; no skipped heading levels, duplicate IDs or dangling labelledby/describedby/controls references in the six documents. |
| Metadata basics | All pages declare German; titles are 17–44 characters, descriptions 82–121, and all are unique. |
| Navigation and keyboard | Six pages load; skip links become visible after their transition and focus main. Desktop disclosures open via Enter and close via Escape with focus restored. A dropdown link was reached using Tab. |
| Focus styling | No missing outline-and-shadow pair in the six desktop Tab traversals. Form inputs remove outline but retain a visible white 2px focus shadow and orange border; no false “missing focus” finding is raised. |
| Mobile disclosure | Opens natively, closes after navigation; Escape does not close it, but the summary still does. This was not a keyboard trap. |
| Project filters | All **40** industry/outcome combinations matched expected counts; **8** empty combinations displayed the empty state correctly. |
| Contact intent | Career CTA selects “Karriere bei Emposo” and exposes the live hint; empty required form is invalid. Mocked submit preserves &, +, umlaut and newline content in the encoded mailto. |
| No JavaScript | Page headings/content and mobile disclosures remain available; all six/ten project cards remain in HTML. Filtering is not functional; delivery through a mail client was not exercised. |
| Layout | No horizontal document overflow or text crossing the viewport in the 66 ordinary viewport samples. This is not a blanket visual/cross-browser pass. |
| Images | All 26 img elements declare dimensions; photos use object-fit and defined containers. AVIF variants are selected in the audited browser. Intentional wide/tall editorial image ratios are not treated as accidental distortion. |
| Reduced motion | With reduce set before load, Lenis does not start and no CSS animations run. Changing the preference after load stops CSS animation but leaves Lenis active. |
| Console | No warnings, errors or uncaught exceptions captured in the six-page initial/browser-interaction run. |
| Third parties/security source scan | No third-party requests in baseline navigations; no tracking/storage/network-writing calls in project scripts. No candidate keys/private keys or private-network URLs found by the source-pattern scan. This is not a security certification. |

No modal, carousel, data table, video embed, authenticated state or asynchronous server submission exists to test. Loading/disabled states are therefore not demanded for ordinary navigation links. The site has no dark-mode implementation; one is not proposed without brand direction.

### Performance budget disposition

KB below means 1,000 bytes. Lighthouse values retain Phase 0's simulated mobile settings; real-user p75 is unavailable.

| Budget | Evidence | Disposition |
|---|---|---|
| Mobile LCP ≤2.0s, p75 | Lab: home 2.180s, Expertise 1.954s, Portfolio 49.881s, case index 1.953s, detail 2.104s, About 1.954s | Three lab results exceed 2s; field p75 unmeasured |
| INP ≤200ms | No real-user interaction population; baseline TBT 0–14ms is not INP | Unverified |
| CLS ≤0.05 | All twelve initial-navigation traces: 0 | Within budget for that window only |
| JS compressed ≤30KB | All homepage scripts: 8,722 B gzip 9; 10,892 B measured transfer including overhead | Within initial-page budget |
| CSS compressed ≤25KB | 12,524 B gzip 9; 14,256 B measured transfer including overhead | Within initial-page budget |
| Largest image ≤200KB | Portfolio image resource 9,825,912 B; largest fallback 26,580,990 B | Exceeds |
| Total page ≤800KB | Portfolio mobile 9,964,564 B; other initial loads 139,795–225,896 B | Portfolio exceeds; full-scroll totals not measured |
| Requests ≤30 | Initial navigations: 10–14 requests | Within measured window; full-scroll total unverified |

## Standards interpretation

The enlargement issue is supported by the measured CSS behavior; actual browser text-resizing mechanisms still require testing. WCAG allows responsive changes but requires a way to achieve doubled text, not merely a narrower layout with unchanged visual text size. [W3C Resize Text guidance](https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html).

For target-size findings, spacing exceptions were checked by axe: a target below 24px alone is not enough to establish failure. [W3C Target Size guidance](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html).

The browser-floor finding concerns the documented support range, not a reproduced Safari 16.0 failure. [Tailwind compatibility documentation](https://tailwindcss.com/docs/compatibility).

## 1. Accessibility — WCAG 2.2 AA

```text
[P1] Viewport-scaled root text becomes tiny and counteracts enlargement
File:      styles/main.css:348; styles/main.css:360; styles/08-editorial.css:188
Evidence:  At 390px, root/body text is 7.02px; journey copy is 7.02px, menu text 5.4756px, and form input text 8.424px. At 600→601px the root drops 10.8→6.01px. In 1440px/1× versus 720px/2× reflow-equivalent tests, journey copy changes 14.4→7.2 CSS px, cancelling the 2× enlargement.
Impact:    Small-screen copy and controls are difficult to read. The CSS measurably counteracts zoom-related text enlargement; this is not an assertion that WCAG specifies a minimum body font size.
Fix:       Keep the root at a user-relative size, then use rem-bounded fluid type and independently responsive layout tokens. Re-test actual browser zoom/text resizing and every breakpoint; do not simply change the root and leave the existing rem geometry untouched.
Effort:    L
Risk:      High — site-wide rem geometry must be recalibrated without changing the brand.
```

```text
[P1] Orange text fails contrast on white and paper backgrounds
File:      styles/08-editorial.css:185; styles/08-editorial.css:256; styles/09-page-templates.css:240; styles/09-page-templates.css:293
Evidence:  axe reports #f7911e on #ffffff at 2.32:1 and on #f5f0eb at 2.05:1 across all six pages. Both are below even the 3:1 large-text threshold. Expertise hover changes the card paragraph to orange; its contrast-failing nodes increase from 14 to 17 at 1440px.
Impact:    Fails text contrast in default, selected and hover states, including headings, case metrics, category labels and navigation.
Fix:       Retain brand orange for accents/dark surfaces; introduce an approved darker shade for text on light surfaces. Candidate #995a13 calculates to 5.49:1 on white and 4.85:1 on paper. Verify rendered normal/hover/focus/selected states after token application.
Effort:    M
Risk:      Low — approval needed for the proposed text-only shade; logo and primary brand colour stay unchanged.
```

```text
[P1] Footer links and related-case links fail minimum target spacing
File:      styles/08-editorial.css:349; styles/08-editorial.css:351; styles/09-page-templates.css:248; case-studies/data2ai-platform/index.html:110
Evidence:  At 390px, axe reports eight footer target-size failures on every page, plus two related links on the detail page. Footer link boxes are about 354.9×8.8px; related links are 75.7×9.8px and 76.9×9.8px with only 14.6px safe clickable spacing. These fail the spacing exception, not merely a preferred 44px target.
Impact:    Closely stacked targets are hard to activate accurately and fail SC 2.5.8 in the measured mobile state.
Fix:       Provide at least 24×24px targets with compliant spacing; aim for 44px touch targets. Coordinate with the root-sizing correction and re-run axe, including the open menu.
Effort:    M
Risk:      Low — footer and related-link spacing will increase.
```

```text
[P2] Expertise anchors land with their headings hidden by the header
File:      expertise/index.html:85; expertise/index.html:115; portfolio/index.html:90; styles/09-page-templates.css:208
Evidence:  At /expertise/#engineering and 1440px, the heading occupies y=18.86–65.22px while the sticky header ends at 68.67px: the heading is completely covered. Technology behaves the same. Portfolio's four mode anchors also place the heading partly under the header. The existing scroll margin only covers .page-section[id].
Impact:    Visitors following the category navigation cannot see the destination heading until they scroll back.
Fix:       Apply a shared, header-aware scroll offset to all navigable fragment targets, including nested expertise columns/cards and portfolio modes.
Effort:    S
Risk:      Low — check desktop/mobile header heights and focus placement.
```

```text
[P2] Career and About image alternatives describe people absent from the image
File:      sections/07ab-career.html:4; about-us/index.html:55
Evidence:  Both use engineering.jpg/engineering-900.avif with alt='Zwei Fachleute arbeiten gemeinsam an einer technischen Lösung'. The rendered image shows a glowing processor/circuit illustration, not two people; visible in the contact-390.png capture.
Impact:    Screen-reader users receive a materially different description from the visual content.
Fix:       Use an accurate description of the existing image, or empty alt if it is purely atmospheric. Do not change imagery without brand/content approval.
Effort:    S
Risk:      Low — content/editorial review only.
```

## 2. Performance

```text
[P1] Portfolio hero downloads a 9.8 MB original image
File:      styles/09-page-templates.css:326; styles/09-page-templates.css:330
Evidence:  The hero background directly references assets/brand/data.jpg: 9,825,912 resource bytes / 9,826,188 transferred bytes. Baseline mobile page transfer is 9,964,564 B; Lighthouse performance 75, simulated mobile LCP 49.881s and desktop LCP 8.085s.
Impact:    The single background exceeds the 200KB image and 800KB page budgets by large margins. The LCP seconds are Lighthouse simulated-throttling results, not elapsed production timings.
Fix:       Serve a responsive optimized image via picture/image-set with suitable fallbacks and early discovery/priority. Preserve the existing artwork and overlay; use the available AVIF derivatives as starting assets.
Effort:    S
Risk:      Low — verify crop, overlay contrast and hero layout on both profiles.
```

```text
[P2] JPEG fallbacks bypass the optimized image budget
File:      sections/06-work.html:12; expertise/index.html:67; tools/optimize-brand-images.mjs:1
Evidence:  All photo pictures offer AVIF then reference original JPEGs; there are no WebP sources. Original JPEG sizes range from 6,553,949 B (validation) to 26,580,990 B (pharma). Normal audited Chrome loads selected AVIF, except Portfolio's CSS background.
Impact:    A fallback fetch can be many megabytes; the available fallbacks do not meet the requested largest-image budget. This is not added to the measured AVIF page weights.
Fix:       Produce budgeted WebP/JPEG fallback renditions with matching responsive sizes, preserving the originals as source assets outside the public payload.
Effort:    M
Risk:      Low — inspect encoding quality and verify fallback selection without assuming current AVIF traffic downloads every variant.
```

```text
[P3] Image metadata and decode hints are incomplete
File:      expertise/index.html:67; sections/08-footer.html:1; sections/06-work.html:10
Evidence:  All 26 img elements have dimension attributes, but the Expertise hero declares 5344×3557 while technology.jpg is 8640×5760; the repeated footer logo declares 1022×229 while its PNG is 596×134. No image sets decoding='async'. Baseline CLS is 0.
Impact:    Intrinsic metadata is inconsistent with the files and below-fold decode behavior is left to browser defaults; no measured layout shift is attributed to these near-matching ratios.
Fix:       Correct source dimensions and add async decode hints where appropriate below the fold; retain existing explicit geometry and eager/high-priority hero loading.
Effort:    S
Risk:      Low — confirm picture aspect ratios and avoid lazy-loading the LCP image.
```

```text
[P3] Typeface declarations and shipped font range are not aligned
File:      styles/main.css:270; styles/08-editorial.css:18; css/00-fonts.css:9; css/00-fonts.css:18
Evidence:  CSS prefers Roboto, then Inter; only Inter is shipped. @font-face declares 300–600, but project rules request 700 and some strong elements compute to 900. Font fallback metric overrides are absent; measured baseline CLS remains 0.
Impact:    Typography depends on which local fonts are available and on fallback weight matching; the intended brand face is unclear. No font-swap CLS regression is asserted.
Fix:       Confirm the required brand face, align the CSS stack and loaded weight range, then add a measured metric-compatible fallback if needed. Do not load Roboto or extra weights without approval.
Effort:    M
Risk:      Medium — brand/font licensing and appearance require confirmation.
```

## 3. HTML semantics and forms

```text
[P2] Contact completion depends entirely on an external mail client
File:      sections/07b-sales-cta.html:2; js/06-work.js:57; README.md:26
Evidence:  The only form posts to mailto:jose.caravaca@emposo.eu; JS prevents submission and assigns an encoded mailto URL. There is no HTTP endpoint, receipt or fallback when no mail handler is configured. The VM test confirms recipient/subject/body encoding, not message delivery. README documents this as intentional.
Impact:    The contact path has no reliable completion route for visitors without a configured mail client. This is a launch decision, not a demonstrated outage for all users.
Fix:       Confirm whether mailto-only contact is acceptable. If not, approve an HTTPS form endpoint with an HTML-first submission, accessible success/error responses and suitable spam protection before implementing it.
Effort:    M
Risk:      High — requires explicit backend, privacy and delivery decisions; no service should be added silently.
```

```text
[P3] Homepage footer is nested inside the main landmark
File:      sections/08-footer.html:1; sections/99-close.html:3; index.html:244
Evidence:  The assembly places the footer before </main>; all five subpage footers are outside main.
Impact:    The homepage footer has section-scoped semantics instead of the usual global contentinfo landmark, unlike the other pages.
Fix:       Close main before the shared footer and update the assembly contract; verify the accessibility tree and skip target.
Effort:    S
Risk:      Low — preserve one main element and the fragment assembly order.
```

```text
[P3] Generic elements carry unsupported or redundant accessible names
File:      sections/01-header.html:4; sections/06-work.html:4; case-studies/index.html:84; case-studies/index.html:94; case-studies/data2ai-platform/index.html:96; about-us/index.html:102
Evidence:  axe marks aria-label on the header paragraph, filter wrapper divs, case-result div and location-list div as aria-prohibited-attr incomplete/manual-review results. These are not counted as automatic axe violations.
Impact:    The labels are not reliably exposed on these native roles; the existing visible text or inner named groups already conveys much of the information.
Fix:       Remove redundant ARIA; where grouping needs a name, use suitable native section/list/fieldset semantics and visible labels instead of naming a generic div.
Effort:    S
Risk:      Low — retain all visible text and valid inner group labels.
```

## 4. Tailwind and CSS architecture

```text
[P2] Tailwind content scanning omits every new subpage
File:      styles/main.css:55; styles/main.css:58
Evidence:  source(none) disables automatic scanning. Explicit sources include only sections/, root index.html and js/, not expertise/, portfolio/, case-studies/ or about-us/.
Impact:    Utilities introduced exclusively in those five documents will not be generated. Current custom CSS can conceal this build-coverage gap; no present missing utility is asserted.
Fix:       Add all authored page sources to the Tailwind scan and add a regression fixture/check for a subpage-only utility.
Effort:    S
Risk:      Low — inspect generated CSS delta; do not broadly scan node_modules or audit artifacts.
```

```text
[P2] Declared iOS Safari target extends below Tailwind 4's supported floor
File:      package.json:22; package.json:26; styles/main.css:54
Evidence:  Installed Tailwind is 4.3.3; official Tailwind 4 compatibility documentation starts at Safari 16.4. The requested support target includes iOS Safari 16.0–16.3. Those browsers were not available for testing.
Impact:    The stated support promise cannot be backed by this framework's supported browser range. This is a compatibility gap, not a reproduced old-Safari layout failure.
Fix:       Choose between explicitly supporting Safari 16.4+ or funding/testing an older-browser-compatible styling strategy. Do not silently narrow support or migrate framework versions.
Effort:    M
Risk:      Medium — requires a browser-support decision before implementation.
```

```text
[P3] Most styling bypasses the requested utility/token system
File:      styles/08-editorial.css:5; styles/08-editorial.css:21; styles/09-page-templates.css:17; styles/main.css:125
Evidence:  The two visual-system files use handwritten layout/type/state rules. --em-blue/--em-orange/--em-paper duplicate --color-ink/--color-lemon/--color-paper rather than referencing one token source. Utility-expressible rules remain unlayered alongside Tailwind.
Impact:    The current implementation does not meet the requested styling constraint; parallel tokens and cascade rules increase refactor risk.
Fix:       Establish one approved token source, then move utility-expressible styling into utilities/shared build-time partials. Keep and document only genuine CSS exceptions such as SVG stroke drawing or composite effects.
Effort:    L
Risk:      High — phased visual comparisons are required; no wholesale stylesheet replacement.
```

```text
[P3] Legacy component styles are emitted without markup consumers
File:      styles/00-components.css:29; styles/00-components.css:80; styles/main.css:56
Evidence:  All twelve rules in 00-components.css have no matching class consumers in the six documents. Compiled site.css still contains .heading-xl, .h1-hero, .btn-lemon, .btn-try, .btn-arrow and .text-size-large, among others.
Impact:    Unused component CSS and obsolete migration commentary remain in the delivered stylesheet; CSS is already within the byte budget, so no large speed gain is claimed.
Fix:       Confirm no external templates consume these classes, then remove the unused component rules/import and update comments. Keep source-only assets outside the deploy payload when packaging.
Effort:    S
Risk:      Low — retain any independently confirmed consumers; verify compiled output.
```

```text
[P3] Arbitrary utilities and inline spacing lack a current exception policy
File:      sections/00-skip.html:8; sections/05-industries.html:8; expertise/index.html:163; expertise/index.html:183; portfolio/index.html:164; about-us/index.html:95
Evidence:  Five unique arbitrary markup utilities occur on the homepage skip link: z-[1001], -translate-y-[300%], px-[1.4em], py-[0.9em], shadow-[0_0_0_1px_var(--border-soft)]. Nine inline style attributes remain: five SVG --draw-delay values and four margin-top declarations.
Impact:    Sizing/spacing escapes the proposed token system. Existing SVG delays may be legitimate per-instance data, but that exception is not distinguished from ordinary inline layout.
Fix:       Replace ordinary spacing/z-index/shadow values with named utilities/tokens. Document each retained non-utility exception; move per-instance animation delays to approved tokenized variants if the no-inline-style constraint remains absolute.
Effort:    S
Risk:      Low — verify skip-link visibility and animation sequencing.
```

## 5. JavaScript discipline

```text
[P2] Changing reduced-motion preference does not stop Lenis
File:      js/00-core.js:39; js/00-core.js:47
Evidence:  Lenis is disabled when reduced motion is set before load. When changed from no-preference to reduce after load, CSS animations stop but window.__lenis remains active; the initialization condition is not re-evaluated and the RAF loop continues.
Impact:    Wheel smoothing does not follow a visitor's changed motion preference until reload.
Fix:       Prefer native scrolling; if Lenis is retained, handle media-query changes by stopping/destroying it and cancelling the RAF loop, with safe reinitialization if needed.
Effort:    S
Risk:      Medium — scroll feel and anchor/skip-link behavior must be regression-tested.
```

```text
[P3] Inactive legacy handlers and global lifecycle coupling remain
File:      js/01-header.js:48; js/01-header.js:85; js/06-work.js:51; js/00-core.js:21
Evidence:  No current document contains data-section-link or data-project-filter, yet their branches remain and an active-section scroll listener is registered. The five scripts use globals/ready-queue IIFEs rather than modules. Core failure leaves dependent enhancements unregistered.
Impact:    Unused behavior adds maintenance paths and shared initialization coupling; total JS is already below the 30KB compressed budget.
Fix:       Remove confirmed unused branches first. Where scripts remain, use a small explicit module initialization path and native lifecycle features; retain only necessary shared state.
Effort:    S
Risk:      Low — verify the six-page behavior inventory before deleting selectors or changing initialization order.
```

```text
[P3] Non-functional filter controls remain visible without JavaScript
File:      sections/06-work.html:4; case-studies/index.html:84; js/06-work.js:9
Evidence:  With JS disabled, the six homepage and ten case-index cards remain readable, but both pages still display nine filter buttons that cannot change the selection.
Impact:    The content fallback works, but the controls promise an interaction that is unavailable.
Fix:       Expose/enabled-state the controls only after successful filter initialization, or implement a native filter model. Keep all cards present in the original HTML.
Effort:    S
Risk:      Low — do not hide project content behind enhancement-dependent CSS.
```

## 6. SEO and metadata

```text
[P2] Launch metadata and crawl files are not prepared
File:      index.html:8; expertise/index.html:6; portfolio/index.html:6; case-studies/index.html:6; case-studies/data2ai-platform/index.html:6; about-us/index.html:6
Evidence:  All six documents are intentionally noindex/nofollow. They have no canonical, Open Graph, Twitter card or JSON-LD metadata. /robots.txt and /sitemap.xml return 404 locally. Titles/descriptions are unique and within the requested length limits.
Impact:    The current preview is not launch-ready for indexing and rich sharing. Noindex is documented as intentional, so it is not classified as an accidental production P1.
Fix:       After confirming the public origin and launch date, supply canonical/social metadata with an approved real image, relevant validated structured data, and crawl files. Remove preview noindex only on explicit launch approval.
Effort:    M
Risk:      Medium — premature indexing or invented organisation details must be avoided.
```

```text
[P3] The fallback 404 offers no way back into the site
File:      package.json:14
Evidence:  A nonexistent path returns HTTP 404 correctly, but its body is only '404 — The requested path could not be found'; no title, brand navigation or contact/home link is supplied.
Impact:    Visitors reaching an obsolete or mistyped URL have no useful recovery path.
Fix:       Add a small branded 404 document with home/category/contact links and configure the actual host to preserve HTTP 404 status.
Effort:    S
Risk:      Low — hosting behavior must be confirmed; do not replace unknown URLs with a 200 homepage.
```

## 7. Security and privacy

```text
[P2] All legal and privacy footer links are placeholders
File:      sections/08-footer.html:1; expertise/index.html:197; portfolio/index.html:177; case-studies/index.html:159; case-studies/data2ai-platform/index.html:122; about-us/index.html:114
Evidence:  Each footer links Impressum, Datenschutz and Barrierefreiheit to '#': 18 placeholder anchors across six pages, with no corresponding destination documents.
Impact:    Visitors cannot reach the advertised notices. Legal applicability/completeness has not been assessed and no statutory claim is inferred.
Fix:       Obtain the approved notice content or existing canonical URLs, create/connect the destinations and verify their HTTP responses. Do not fabricate legal copy.
Effort:    M
Risk:      Medium — requires owner-approved content and destinations.
```

## 8. Visual system and states

```text
[P3] Typography has excessive near-duplicate sizes and tight body leading
File:      styles/08-editorial.css:179; styles/08-editorial.css:188; styles/09-page-templates.css:243; styles/09-page-templates.css:296
Evidence:  Source CSS contains 90 distinct font-size expressions and 35 line-height values. At 1440px the homepage renders 38 sampled text sizes; subpages render 21–25. Body rules commonly use 1.35–1.43 leading; .journey-card p is 1.38 and .expertise-card p is 1.38.
Impact:    Type roles are harder to maintain consistently and body text is tighter than the requested ≥1.5 line-height. The line-height preference alone is not a WCAG AA failure.
Fix:       Define a compact semantic scale for display, heading, body and captions; use comfortable body leading and content-width tokens. Review line length after the root-sizing repair instead of shrinking fonts to fit.
Effort:    M
Risk:      Medium — requires visual review and reflow testing.
```

```text
[P3] Subpage stylesheet changes the homepage's section spacing globally
File:      styles/08-editorial.css:197; styles/09-page-templates.css:207
Evidence:  Both files define unscoped .page-section. The later subpage rule changes clamp(6rem,11vw,12rem) to clamp(5.5rem,10vw,10.5rem) on the homepage as well. At 1440px, standard sections resolve to 144px padding; journeys/career resolve to 129.6px.
Impact:    A supposedly cross-page/template-only edit changes homepage rhythm through source order. The differing padding values themselves are not automatically defects.
Fix:       Give section spacing one shared token/utility definition, or explicitly scope a deliberate subpage variation; remove the duplicate global rule.
Effort:    S
Risk:      Low — confirm intended homepage rhythm before changing rendered padding.
```

```text
[P3] The contact select removes its native dropdown affordance
File:      styles/08-editorial.css:336; styles/08-editorial.css:337; sections/07b-sales-cta.html:2
Evidence:  appearance:none applies to input, select and textarea, but no replacement select arrow is provided. The mobile capture presents 'Bitte auswählen' with an underline and no dropdown marker.
Impact:    The select looks similar to a text entry field even though it requires choosing an option; keyboard operation remains native.
Fix:       Retain native select appearance or add a decorative, non-interactive dropdown marker with sufficient padding and contrast.
Effort:    S
Risk:      Low — test native option popup behavior on Safari and touch devices.
```

```text
[P3] Decorative data-flow animation runs indefinitely
File:      styles/08-editorial.css:163; styles/08-editorial.css:238; js/03-connection-system.js:21
Evidence:  After the initial 1,650ms settling period, two flow-pulse animations and one industry-network-flow animation have infinite iterations. There is no page-level pause control; reduced-motion CSS does stop those animations.
Impact:    The decoration continues competing with nearby copy after its introductory purpose. No measured frame-rate degradation or definitive SC 2.2.2 failure is claimed for this non-informational decoration.
Fix:       Prefer a finite introductory animation, or provide a lightweight pause choice if ongoing motion is a deliberate brand requirement. Keep reduced-motion behavior.
Effort:    S
Risk:      Low — confirm the intended motion treatment.
```

## 9. Code quality and maintainability

```text
[P3] Navigation and footers require editing six authored documents
File:      sections/01-header.html:1; sections/08-footer.html:1; expertise/index.html:19; portfolio/index.html:19; case-studies/index.html:20; case-studies/data2ai-platform/index.html:19; about-us/index.html:19
Evidence:  assemble.mjs only produces root index.html. Five subpages duplicate header/footer HTML; footer locations are 197, 177, 159, 122 and 114 respectively. Current-page and local-fragment variants are manually maintained.
Impact:    A shared navigation/legal/brand change must be repeated across six authoring locations, making drift likely.
Fix:       Extend the existing build-time assembly to shared header/footer/card partials with explicit page data and active-route state. Keep the shipped pages static HTML.
Effort:    M
Risk:      Medium — preserve all 241 anchor destinations, current-page states and fragment variants.
```

```text
[P3] Documentation and formatting do not describe the current authoring workflow
File:      README.md:19; styles/main.css:367; styles/00-components.css:3; sections/07b-sales-cta.html:2
Evidence:  README covers running/building but not adding a subpage, scan registration or token ownership. Comments say the migration is complete and legacy classes have consumers, contrary to current sources. Large form/footer/card blocks occupy single lines; no project Prettier/Tailwind-order configuration exists.
Impact:    The actual six-page workflow is harder to maintain and source line-level diffs become unnecessarily broad.
Fix:       Document page creation/shared assembly, Tailwind sources and token ownership; correct obsolete comments. Adopt consistent formatting with the Tailwind plugin only after approving the dev-tool additions.
Effort:    S
Risk:      Low — keep formatting separate from behavior changes.
```

## 10. Verification tooling

```text
[P3] The repository has no automated accessibility, markup or performance guard
File:      package.json:11; package.json:21
Evidence:  The only check rebuilds HTML/CSS and compares them with Git; there is no axe, HTML validator or Lighthouse CI configuration and no repository workflow. Audit tools used here came from an existing external npm cache, not declared project tooling.
Impact:    The measured contrast/target failures and missing subpage scan coverage are not prevented from recurring.
Fix:       With approval, add dev-only Lighthouse CI, axe CLI and html-validate checks over an explicit page list, then a GitHub Action. Start with all-page axe/HTML checks and representative mobile/desktop Lighthouse runs; enforce and measure a two-minute CI budget rather than assuming it.
Effort:    M
Risk:      Low — explicit dependency/CI approval required; retain reports as private/local artifacts.
```

## Supporting visual and maintenance inventories

### Type measurements

Computed values sampled from visible text-bearing elements at 1440px. A size appearing in a nested span still counts once per distinct computed value. Source-expression counts include CSS rules whether or not active in a given viewport.

| Page | Distinct rendered font sizes | Computed weights | Distinct computed line heights |
|---|---:|---|---:|
| Home | 38 | 400, 600, 300, 700 | 49 |
| Expertise | 25 | 400, 600, 300, 700, 900 | 33 |
| Portfolio | 21 | 400, 600, 300, 700, 900 | 31 |
| Case index | 21 | 400, 600, 300, 700, 900 | 29 |
| Case detail | 23 | 400, 600, 300, 700 | 27 |
| About | 23 | 400, 600, 300, 700, 900 | 29 |

Source inventory: **90 font-size expressions, 35 line-height values**. There are three custom depth-shadow recipes plus a separate focus-ring shadow; source transitions include 160–280ms UI changes and 650ms image scaling. These are recorded as the starting system, not individually inflated into severity findings.

### Section rhythm

This lists the actual section-padding groups, including every differing homepage group; no approved spacing scale exists against which to label each numeric value a violation.

| Sections | Top/bottom at 390px | Top/bottom at 1440px |
|---|---:|---:|
| Homepage journeys and career | 35.1px | 129.6px |
| Homepage about, services, industries, work, delivery, proof, FAQ, contact | 39px | 144px |
| All five subpages' non-hero .page-section blocks | 39px | 144px |
| Hero outer sections | 0px; padding is on inner copy/grid | 0px; padding is on inner copy/grid |

The confirmed rhythm issue is the **duplicate unscoped rule**, not the existence of different hero/standard-section padding.

### State and long-content coverage

Default/hover/selected contrast, desktop focus traversal, dropdown opening/Escape, mobile opening/link-close, filter selected/empty states, invalid empty form, career preselection and reduced-motion states were exercised. An Expertise 390px text-spacing override produced no horizontal document overflow, but clipping under every spacing/zoom/browser combination is not certified. A 60-character input value remained editable; a synthetic unbroken 60-character case heading exceeded its own max-width box while remaining inside the mobile viewport. No production-layout failure is inferred from that stress sample.

### Every shared-authoring location

Header/footer changes currently require the homepage fragments plus each standalone subpage:

| Page | Header source | Footer source |
|---|---|---|
| Home | sections/01-header.html:1 | sections/08-footer.html:1 |
| Expertise | expertise/index.html:19 | expertise/index.html:197 |
| Portfolio | portfolio/index.html:19 | portfolio/index.html:177 |
| Case index | case-studies/index.html:20 | case-studies/index.html:159 |
| Case detail | case-studies/data2ai-platform/index.html:19 | case-studies/data2ai-platform/index.html:122 |
| About | about-us/index.html:19 | about-us/index.html:114 |

## Verification tooling recommendation — not installed

With separate approval, use the official [Lighthouse CI CLI](https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/getting-started.md), [axe CLI](https://github.com/dequelabs/axe-core-npm/tree/develop/packages/cli) and [html-validate CLI](https://html-validate.org/usage/cli.html) as dev-only tools. A PR workflow should build, run all-page axe/markup checks, enforce page/CSS/JS budgets on representative mobile/desktop Lighthouse runs, and retain artifacts privately. Measure the workflow against the requested two-minute limit; no CI duration is promised without a run. Do not enable Lighthouse's public report upload by default.

## Decisions and checks still needed

| Area | Needed before the corresponding fix or verification |
|---|---|
| Brand/typeface | Confirm authoritative manual, required font and approval of a darker existing-hue text token. |
| Browser support | Confirm iOS Safari 16.0+ versus 16.4+; provide real-device/browser access if 16.0–16.3 remains in scope. |
| Contact | Confirm whether mailto-only is intentional for launch; choose/approve any HTTP endpoint and data handling. |
| Notices | Supply approved Impressum, Datenschutz and accessibility content/destination URLs. |
| Deployment/SEO/security | Supply live/staging origin and host configuration. Keep preview noindex until launch approval. |
| Headers/transport | CSP/report-only rollout, HSTS, nosniff, referrer/permissions policy, immutable fingerprinted assets, Brotli and HTTP/2/3 remain unverified for production. Local HTTP cannot establish production compliance. |
| Accessibility completion | Review all incomplete axe image/gradient nodes, actual rendered UI boundaries and remaining interaction states; run real zoom, text resizing and screen-reader/cross-browser tests. |
| HTML/CI | Approve dev tooling or an agreed validator mechanism; no W3C validation or GitHub Action has been run. |
| Field performance | Provide CrUX/RUM access or production data; lab results cannot establish p75 LCP/CLS/INP. |
| Multilingual/analytics | Only German content and no analytics are currently configured; hreflang, consent events and analytics anonymisation are not applicable to a non-existent implementation. |

No jurisdiction-wide accessibility/privacy legal conclusion is made from this code review. No new logo, palette identity, copy voice, dark mode or runtime dependency is proposed.

**Phase 1 gate: stop here. No fix plan, code patch or commit has been applied. Approval is required before Phase 2 and each subsequent batch.**

