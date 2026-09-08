// Page manifest for assemble.mjs. Every shipped HTML document is generated
// from partials/ (head, header, footer) plus its content source:
//   - content: 'sections'      → concatenate sections/*.html (homepage)
//   - content: 'pages/x.html'  → the page's <main> inner content
// nav: which header item is highlighted. navExact: false marks an ancestor
// (aria-current="true" instead of "page"), e.g. a case-study detail page.
export default [
  {
    out: 'index.html',
    title: 'Emposo | Die Outcome Factory der Hays-Gruppe',
    description: 'Emposo macht Wandel beherrschbar: definierte Leistungen, messbare Ergebnisse und Werkvertrag mit Acceptance.',
    nav: 'home',
    bodyClass: 'wrap-anywhere',
    content: 'sections',
    scripts: ['00-core', '01-header', '02-intent-links', '03-connection-system', '06-work'],
  },
  {
    out: 'expertise/index.html',
    title: 'Expertise | Emposo',
    description: 'Engineering und Technology: acht Lieferdisziplinen für messbare Ergebnisse im Betrieb.',
    nav: 'expertise',
    bodyClass: 'subpage wrap-anywhere',
    content: 'pages/expertise.html',
    scripts: ['00-core', '01-header'],
  },
  {
    out: 'portfolio/index.html',
    title: 'Portfolio | Emposo',
    description: 'Das Emposo Portfolio: optimieren, transformieren, skalieren und verzahnen als Ergebnisverantwortung.',
    nav: 'portfolio',
    bodyClass: 'subpage wrap-anywhere',
    content: 'pages/portfolio.html',
    scripts: ['00-core', '01-header'],
  },
  {
    out: 'case-studies/index.html',
    title: 'Case Studies | Emposo',
    description: 'Case Studies von Emposo: Herausforderung, Lieferung und messbare Ergebnisse im Überblick.',
    nav: 'case-studies',
    bodyClass: 'subpage wrap-anywhere',
    content: 'pages/case-studies.html',
    scripts: ['00-core', '01-header', '06-work'],
  },
  {
    out: 'case-studies/data2ai-platform/index.html',
    title: 'Data2AI Plattform | Case Study | Emposo',
    description: 'Case Study Data2AI Plattform: Aus verteilten Engineering-Daten wird produktive KI.',
    nav: 'case-studies',
    navExact: false,
    bodyClass: 'subpage wrap-anywhere',
    content: 'pages/case-study-data2ai-platform.html',
    scripts: ['00-core', '01-header'],
  },
  {
    out: 'about-us/index.html',
    title: 'Über uns | Emposo',
    description: 'Emposo ist die Outcome Factory der Hays-Gruppe: klare Leistungen, Verantwortung bis zur Abnahme und skalierbare Delivery.',
    nav: 'about',
    bodyClass: 'subpage wrap-anywhere',
    content: 'pages/about-us.html',
    scripts: ['00-core', '01-header'],
  },
];
