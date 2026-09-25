# Benchmark patterns - mckinsey.com (technical track)

Last review: 2026-09-25. Patterns and anti-patterns only; no copy.

## IA and navigation
- Five top-level doors: Industries, Capabilities, Featured Insights, Careers, About.
- URLs mirror the IA: /industries/<industry>/how-we-help-clients/<service>,
  /<practice>/our-insights/<slug>, /careers/<audience>, /about-us/overview/<topic>.
- Parent link or breadcrumb above every H1 on subpages.
- Series and section "More ..." links; "Keep exploring" link lists at page ends.
- Contact is decentralized: global /contact-us plus practice-level forms.

## Templates
- Service-line page: breadcrumb -> H1 -> one-sentence intro -> segment list ->
  examples block -> featured experts block -> related insights cards.
- Article: H1 -> standfirst -> stat callouts with sources -> body -> about the
  authors -> related -> download (PDF with page count).
- Careers: split path (learn more / ready to apply) -> audience segmentation ->
  job search -> exploring links -> compliance statements.

## Components
- Card: type eyebrow (ARTICLE, REPORT), title, optional date; fixed aspect
  ratios (16:9, 42:25, 1:1); image served with server-side size, crop and
  focal-point parameters.
- Section: H2 + optional H3 lead + card grid or link list.
- Newsletter block, podcast block, app-promo block are reusable modules.
- Data exhibits are SVG with descriptive alt.

## CTAs and forms
- Multiple conversion paths per page: subscribe, contact (practice-specific),
  participate (panel, events), careers, download.
- Forms are inline and complete the action on site.

## Metadata and structured data
- Every page: canonical, og:*, twitter:card summary_large_image, robots.
- Title pattern "<Page> | <Section> | Brand".
- Editorial metadata exposed as meta tags (content type, authors, date,
  practice, tags) and used to generate listings.
- Next.js front end (meta-next-head-count).

## Accessibility
- Skip link on every page; descriptive alt on most editorial images;
  accessibility contact published.

## Performance
- Responsive image parameters per breakpoint; heavy cookie-consent and
  third-party layer (do not copy).

## Anti-patterns observed (avoid)
- Placeholder og:image (seoimageplaceholder.jpg) and a broken twitter:image.
- Card titles as H5/H6 for size; duplicated H1 for desktop/mobile on Careers.
- Empty alt on some content images.
- Animated counters rendering "0%" and "$0B" in server HTML.
