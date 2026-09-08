# Phase 2 — Reviewable fix plan

Authorization: “fix evertything you found,” 8 September 2026. The original batch review gates remain in effect: complete and verify A, then wait before B. No production deployment, outbound form submission, indexing change, dependency installation or legal-content invention is implied.

All 30 Phase 1 findings are mapped below. S/M/L are planning estimates, not measured time. Baseline and audit evidence remain immutable; verification evidence is recorded separately. Existing uncommitted website work is preserved. Permission to checkpoint that work is requested before making isolated fix commits.

## Batch A — Correctness and accessibility

| Finding | Work | Effort | Risk |
|---|---|---|---|
| P1 viewport-scaled root | User-relative root; responsive display utilities; reflow and enlarged-text checks across all pages | L | High: rem geometry throughout site |
| P1 orange contrast | Same-hue `accent-text` #995a13 on light surfaces, including hover/selected states; retain original decorative/dark-surface orange | M | Medium: inheritance and hover backgrounds |
| P1 target spacing | 44px default-size link/control targets, wrapping footer links | S | Low |
| P2 hidden anchor headings | Offset nested Expertise/Portfolio targets below sticky header | S | Low |
| P2 inaccurate image alternatives | Describe the actual processor/connection image in Career/About | S | Low |
| P3 footer landmark | Close main before homepage footer | S | Low |
| P3 redundant generic ARIA | Remove unsupported redundant names without removing native landmarks or their labels | S | Low |
| P2 incomplete Tailwind scan | Include every authored page directory so new utilities compile | S | Low; required dependency for A |

Existing editorial/template rules move to the component layer so explicit Tailwind accessibility utilities can take effect. This is the minimum dependency on C, not a wholesale styling rewrite. No new handwritten custom classes are introduced. The named menu-width token bounds an enlarged menu to the viewport. Existing legacy classes are retained pending C.

Verification: production build; raw axe on all six pages at desktop/mobile plus hover/open-menu states; all prescribed viewport widths; keyboard/skip/disclosure behavior; no-JS navigation; 40 filter combinations; unchanged link/form/script inventory; text-enlargement and text-spacing stress tests; screenshots. Emulation is labelled honestly and does not substitute for real Safari/browser-UI zoom tests.

## Batch B — Performance and remaining JavaScript

| Finding | Work | Effort | Risk |
|---|---|---|---|
| P1 Portfolio 9.8 MB image | Replace original background request with responsive optimized media, preserving composition | S | Low |
| P2 original JPEG fallbacks | Build bounded WebP/JPEG fallbacks using installed Sharp; preserve source masters | M | Medium: quality/format fallback |
| P3 image metadata/decode | Correct intrinsic dimensions; async decode below fold; retain hero priority | S | Low |
| P3 font mismatch | Align stack/weights/preload after brand typeface decision; do not silently replace brand font | M | Medium |
| P2 live reduced motion | Prefer removing Lenis for native scrolling; preserve fragment/focus behavior | M | Medium |
| P3 legacy JS/global coupling | Remove unused branches and avoid unnecessary global lifecycle code | M | Medium |
| P3 no-JS filters | Only expose enhanced filtering controls after successful initialization; keep all cards in HTML | S | Low |

Verification: same twelve Lighthouse profiles as baseline, asset bytes/requests and full-scroll totals, format fallback, reduced preference at load and changed live, no-JS/contact-intent/filter regression checks. Do not equate lab TBT with INP or lab LCP with field p75.

## Batch C — Tokens, Tailwind and authoring

| Finding | Work | Effort | Risk |
|---|---|---|---|
| P2 Safari floor mismatch | Retain 16.0 compatibility or raise floor to 16.4 only after owner choice; do not silently change support/dependencies | L | High |
| P3 competing styling/token duplication | Consolidate brand/spacing/type/state tokens and migrate utility-mappable styles | L | High |
| P3 unused component CSS | Remove the twelve verified unused component rules | S | Low |
| P3 arbitrary values/inline spacing | Replace with named tokens/utilities; document genuine SVG geometry exceptions | M | Medium |
| P3 duplicated shared markup | Extend build-time includes to headers/footers across all six static pages | M | Medium: active nav and relative paths |
| P3 authoring docs/formatting | Document page generation, tokens, asset build and checks; add formatter only with approval | S | Low |

Verification: deterministic build, CSS byte delta, source/class scan, page content/link equivalence, navigation variants and complete viewport matrix. No runtime framework or new runtime dependency.

## Batch D — Visual corrections

| Finding | Work | Effort | Risk |
|---|---|---|---|
| P3 typography/leading | Consolidate sizes and establish comfortable body leading using C's tokens | M | Medium |
| P3 section spacing leak | Scope shared spacing intentionally; remove accidental global override | S | Medium |
| P3 select affordance | Restore native select indicator and preserve keyboard interaction | S | Low |
| P3 indefinite animation | Bound decorative motion and respect live reduced-motion preference | S | Low |

Verification: default/hover/focus/active and applicable empty/error states; all viewports, large text, long content, reduced motion, screenshot comparisons. No new colours, logo treatment, dark mode or aesthetic redesign.

## Batch E — Launch, metadata, privacy and guards

| Finding | Work | Effort | Risk |
|---|---|---|---|
| P2 mail-client-only contact | Preserve current mailto until approved HTTPS submission endpoint and handling/privacy requirements are supplied | M | High: real data delivery |
| P2 launch metadata/crawl files | Canonicals, social image, structured data and crawl files using confirmed origin/launch state; retain preview noindex until authorized | M | Medium |
| P2 legal placeholders | Use approved legal/privacy/accessibility URLs/content; do not fabricate notices | S | High: needs owner material |
| P3 unhelpful 404 | Add useful navigation and verify actual 404 response on target host | S | Low |
| P3 no regression guard | Propose Lighthouse CI, axe and HTML validation with a scoped CI workflow; install only after approval | M | Medium |

Review production CSP report-only, HSTS, nosniff, referrer/permissions policy, compression and cache headers once the deployment target is known. These were not measured production failures in Phase 1. Do not invent analytics, cookie consent, redirects, telemetry uploads or security-header enforcement without a real requirement/configuration.

## Decisions still required

- Live/staging origin, hosting/deployment target and whether this is still a non-indexable preview.
- Approved font authority: Inter is supplied, but the current stack names Roboto first.
- Required Safari floor: retain iOS Safari 16.0 or approve 16.4+.
- Contact endpoint/provider, recipient/handling requirements and approved privacy notice.
- Approved legal/privacy/accessibility destinations or content.
- Permission for dev-only formatter/validation/CI dependencies (none installed in A).
- Permission to checkpoint existing uncommitted work before fix commits.

## Phase 3 — Evidence, not assumed passes

After all approved batches, re-run the Phase 0 inventory and twelve Lighthouse profiles; produce `03-results.md` with the before/after table and every Definition of Done line marked pass/fail/unverified with evidence. Keep unavailable real-device, browser-UI zoom, full manual contrast, production headers, actual form delivery, field p75/INP and unapproved launch items explicit. No overall “everything fixed” claim while these remain open.
