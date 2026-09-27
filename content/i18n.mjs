// Locales, the English route map and the UI dictionary.
//
// German is the source language; English is published (docs/i18n.md). `npm run assemble` builds German
// only, byte-identical to the pre-i18n build. `EN=1 node assemble.mjs` also
// builds the English twins into en/ (git-ignored until publication), falling
// back to German for any string not yet translated and listing every fallback
// in .i18n/untranslated.json: that list is the translation catalogue.
//
// Paths are copy too: the English slugs below are proposals until approved.

export const DEFAULT_LOCALE = 'de';
// English published 2026-09-27 (owner decision); the privacy notice is the
// German text until the official English one arrives.
export const PUBLISHED = ['de', 'en'];
export const BUILD_EN = process.env.EN === '1' || PUBLISHED.includes('en');

// German path -> English path. Case studies map through CASE_SLUGS.
export const PATHS = {
  '/': '/en/',
  '/portfolio/': '/en/services/',
  '/branchen/': '/en/industries/',
  '/about-us/': '/en/about-us/',
  '/karriere/': '/en/careers/',
  '/kontakt/': '/en/contact/',
  '/impressum/': '/en/legal-notice/',
  '/datenschutzerklaerung/': '/en/privacy-policy/',
  '/nutzungsbestimmungen/': '/en/terms-of-use/',
  '/cookies/': '/en/cookies/',
  '/barrierefreiheit/': '/en/accessibility/',
  '/sitemap/': '/en/sitemap/',
};

// German case-study slug -> English slug (glossary approved by the owner
// 2026-09-27, docs/i18n-glossary.md). data2ai-platform, multi-site-transition
// and managed-service keep their slugs.
export const CASE_SLUGS = {
  'engineering-wissensbasis': 'engineering-knowledge-base',
  'rechenzentrums-umzug': 'data-center-migration',
  'mlops-medizinprodukte': 'mlops-medical-devices',
  'wissens-assistent': 'knowledge-assistant',
  'homologationstests': 'homologation-testing',
  'software-planung-antriebssteuergeraete': 'powertrain-ecu-software-planning',
  'gewichtsmanagement-sportwagen': 'sports-car-weight-management',
  'qualitaetsarbeit-pharma-diagnostik': 'pharma-diagnostics-quality',
  'ki-testspezifikation': 'ai-test-specification',
  'technische-dokumentation-halbleiter': 'semiconductor-technical-documentation',
  'projektsteuerung-chip-entwicklung': 'chip-development-project-control',
  'auslagerung-zerspanung': 'machining-outsourcing',
  'technische-dokumentation-antriebsumrichter': 'drive-inverter-technical-documentation',
  'virtuelles-kraftwerk': 'virtual-power-plant',
  'plattformen-kreislaufwirtschaft': 'circular-economy-platforms',
  'funktionsbetreuung-infotainment': 'infotainment-function-support',
  'penetrationstests': 'penetration-testing',
  'cybersecurity-post-market': 'post-market-cybersecurity',
  'informationssicherheits-risikomanagement': 'medtech-information-security-risk',
  'fuzzing-firmware': 'firmware-fuzzing',
};

/**
 * A site-relative href in the given locale. Fragments and queries are kept;
 * anything that is not an internal page path (assets, mailto:, external) is
 * returned unchanged.
 */
export function localizePath(href, locale) {
  if (locale === DEFAULT_LOCALE || !href.startsWith('/') || href.startsWith('/assets/') || href.startsWith('/css/') || href.startsWith('/js/')) return href;
  const [, path, rest = ''] = href.match(/^([^?#]*)(.*)$/);
  if (PATHS[path]) return PATHS[path] + rest;
  const study = path.match(/^\/case-studies\/([^/]+)\/$/);
  if (study) return `/en/case-studies/${CASE_SLUGS[study[1]] ?? study[1]}/` + rest;
  return href;
}

/** The German path of an English one (the inverse of localizePath). */
export function dePath(path) {
  for (const [de, en] of Object.entries(PATHS)) if (en === path) return de;
  const study = path.match(/^\/en\/case-studies\/([^/]+)\/$/);
  if (study) {
    const de = Object.entries(CASE_SLUGS).find(([, en]) => en === study[1])?.[0] ?? study[1];
    return `/case-studies/${de}/`;
  }
  return null;
}

// UI strings used by partials ({{t:key}}) and content/render.mjs (t()). The
// German entries are today's wording, verbatim; English entries arrive with
// the approved translation (docs/i18n.md) and stay empty until then.
export const STRINGS = {
  de: {
    'skip': 'Zum Inhalt springen',
    'lang.label': 'Sprache:',
    'logo.label': 'Emposo — Startseite',
    'nav.label': 'Hauptnavigation',
    'nav.portfolio': 'Leistungen',
    'nav.branchen': 'Branchen &amp; Projekte',
    'nav.about': 'Über uns',
    'nav.karriere': 'Karriere',
    'nav.contact': 'Projekt besprechen',
    'menu.open': 'Menü öffnen',
    'menu': 'Menü',
    'footer.brand': 'Emposo — The Outcome Factory',
    'footer.business': 'Für Unternehmen',
    'footer.portfolio': 'Leistungen',
    'footer.branchen': 'Branchen',
    'footer.projects': 'Alle Projekte',
    'footer.company': 'Unternehmen',
    'footer.about': 'Über uns',
    'footer.karriere': 'Karriere',
    'footer.contact': 'Kontakt',
    'footer.discuss': 'Projekt besprechen',
    'footer.locations': 'Mannheim · Düsseldorf<br>Ingolstadt · Bukarest',
    'footer.impressum': 'Impressum',
    'footer.privacy': 'Datenschutz',
    'footer.terms': 'Nutzungsbestimmungen',
    'footer.accessibility': 'Barrierefreiheit',
    'footer.cookies': 'Cookies',
    'footer.sitemap': 'Sitemap',
    'form.name': 'Ihr Name',
    'form.company': 'Unternehmen (optional)',
    'form.email': 'E-Mail-Adresse',
    'form.interest': 'Worum geht es?',
    'form.choose': 'Bitte auswählen',
    'form.opt.optimize': 'Optimierung einer bestehenden Leistung',
    'form.opt.transform': 'Transformation / AI-Use-Case',
    'form.opt.scale': 'Skalierung eines Programms',
    'form.opt.career': 'Karriere bei Emposo',
    'form.opt.other': 'Anderes Anliegen',
    'form.message': 'Ihre Nachricht',
    'form.submit': 'Anfrage vorbereiten',
    'form.explain': 'Das Formular öffnet Ihr E-Mail-Programm. Dort können Sie die Anfrage prüfen und absenden.',
    'form.privacy': 'Datenschutz',
    'crumb.home': 'Startseite',
    'crumb.label': 'Brotkrümelnavigation',
    'crumb.projects': 'Projekte',
    'card.read': 'Case Study lesen',
    'filter.industry': 'Branche',
    'filter.industry.aria': 'Nach Branche filtern',
    'filter.discipline': 'Leistung',
    'filter.discipline.aria': 'Nach Leistung filtern',
    'filter.all': 'Alle',
    'filter.count': 'Projekte',
    'filter.empty': 'Für diese Auswahl ist noch keine Referenz veröffentlicht.',
    'filter.empty.link': 'Sprechen Sie mit uns über Ihre Branche.',
    'project.section': 'Projekt',
    'project.challenge': 'Herausforderung',
    'project.solution': 'Lösung',
    'project.result': 'Ergebnis',
    'project.more.eyebrow': 'Weitere Projekte',
    'project.more.title': 'Expertise, die Ergebnisse liefert.',
    'project.more.all': 'Alle Projekte',
    'jobs.open': 'Zur vollständigen Ausschreibung',
    'jobs.close': 'Weniger anzeigen',
    'jobs.apply': 'Bewerbung an',
    'jobs.subject': 'Bewerbung',
    'jobs.initiative': 'Keine passende Position dabei? Schick uns Deine Initiativbewerbung an',
    'jobs.initiative.subject': 'Initiativbewerbung',
    'management.eyebrow': 'Management',
    'management.title': 'Menschen, die Verantwortung übernehmen.',
    'management.more': 'Mehr lesen',
    'management.less': 'Weniger anzeigen',
    'management.linkedin': 'auf LinkedIn',
    'explore.title': 'Weiter entdecken',
    'explore.portfolio': 'Leistungen',
    'explore.branchen': 'Branchen',
    'explore.about': 'Über uns',
    'cta.eyebrow': 'Ihr nächster Schritt',
    'cta.link': 'Projekt besprechen',
    'cta.default.title': 'Jetzt Kontakt aufnehmen!',
    'cta.default.copy': 'Ob konkretes Vorhaben, erste Orientierung oder weitere Fragen: Erzählen Sie uns kurz, worum es geht.',
    'cta.portfolio.title': 'Welche Leistung sollen wir für Sie <em>liefern?</em>',
    'cta.portfolio.copy': 'Von der bestehenden Leistung bis zum neuen Use Case: Sprechen wir über die Ergebnisdefinition und den sinnvollsten Einstieg.',
    'cta.karriere.eyebrow': 'Warum Emposo',
    'cta.karriere.title': 'Wir entwickeln nicht nur Technologien.<br>Wir schaffen <em>Ergebnisse.</em>',
    'cta.karriere.copy1': 'Dafür suchen wir Menschen, die neugierig sind, Verantwortung übernehmen und Dinge ins Ziel bringen wollen. Ob Engineering, Software, AI, Cyber Security oder Projektmanagement: Bei Emposo arbeitest Du an Projekten, die sichtbar etwas bewegen. Gemeinsam mit erfahrenen Kolleginnen und Kollegen, starken Kunden und der Skalierungskraft der Hays Gruppe.',
    'cta.karriere.copy2': '<strong>Tomorrow, created today.</strong>',
    'facts.founded': 'gegründet',
    'facts.founded.value': '2014',
    'facts.people.value': '250+',
    'facts.projects.value': '2.900+',
    'facts.locations.value': '4',
    'facts.people': 'Mitarbeitende',
    'facts.projects': 'Projekte & Services',
    'facts.locations': 'Standorte in Deutschland und Rumänien',
    'sitemap.services': 'Leistungen',
    'sitemap.home': 'Startseite',
    'sitemap.portfolio': 'Unsere Leistungen',
    'sitemap.branchen': 'Branchen',
    'sitemap.allBranchen': 'Alle Branchen',
    'sitemap.company': 'Unternehmen',
    'sitemap.about': 'Über uns',
    'sitemap.management': 'Management',
    'sitemap.karriere': 'Karriere',
    'sitemap.kontakt': 'Kontakt',
    'sitemap.cookies': 'Cookies',
    'sitemap.accessibility': 'Barrierefreiheit',
    'sitemap.impressum': 'Impressum',
    'sitemap.privacy': 'Datenschutz',
    'sitemap.terms': 'Nutzungsbestimmungen',
    'sitemap.projects': 'Projekte',
    'sitemap.allProjects': 'Alle Projekte',
  },
  // American English, following the approved glossary (docs/i18n-glossary.md).
  en: {
    'skip': "Skip to content",
    'lang.label': 'Language:',
    'logo.label': "Emposo — Home",
    'nav.label': "Main navigation",
    'nav.portfolio': "Services",
    'nav.branchen': "Industries &amp; Projects",
    'nav.about': "About us",
    'nav.karriere': "Careers",
    'nav.contact': "Discuss your project",
    'menu.open': "Open menu",
    'menu': "Menu",
    'footer.brand': "Emposo — The Outcome Factory",
    'footer.business': "For businesses",
    'footer.portfolio': "Services",
    'footer.branchen': "Industries",
    'footer.projects': "All projects",
    'footer.company': "Company",
    'footer.about': "About us",
    'footer.karriere': "Careers",
    'footer.contact': "Contact",
    'footer.discuss': "Discuss your project",
    'footer.locations': "Mannheim · Düsseldorf<br>Ingolstadt · Bucharest",
    'footer.impressum': "Legal notice",
    'footer.privacy': "Privacy",
    'footer.terms': "Terms of use",
    'footer.accessibility': "Accessibility",
    'footer.cookies': "Cookies",
    'footer.sitemap': "Sitemap",
    'form.name': "Your name",
    'form.company': "Company (optional)",
    'form.email': "Email address",
    'form.interest': "What is it about?",
    'form.choose': "Please select",
    'form.opt.optimize': "Optimizing an existing service",
    'form.opt.transform': "Transformation / AI use case",
    'form.opt.scale': "Scaling a program",
    'form.opt.career': "Careers at Emposo",
    'form.opt.other': "Something else",
    'form.message': "Your message",
    'form.submit': "Prepare your inquiry",
    'form.explain': "The form opens your email program, where you can review and send your inquiry.",
    'form.privacy': "Privacy",
    'crumb.home': "Home",
    'crumb.label': "Breadcrumb",
    'crumb.projects': "Projects",
    'card.read': "Read case study",
    'filter.industry': "Industry",
    'filter.industry.aria': "Filter by industry",
    'filter.discipline': "Service",
    'filter.discipline.aria': "Filter by service",
    'filter.all': "All",
    'filter.count': "projects",
    'filter.empty': "No project has been published for this selection yet.",
    'filter.empty.link': "Talk to us about your industry.",
    'project.section': "Project",
    'project.challenge': "Challenge",
    'project.solution': "Solution",
    'project.result': "Result",
    'project.more.eyebrow': "More projects",
    'project.more.title': "Expertise that delivers results.",
    'project.more.all': "All projects",
    'jobs.open': "See the full job posting",
    'jobs.close': "Show less",
    'jobs.apply': "Apply to",
    'jobs.subject': "Application",
    'jobs.initiative': "Don’t see the right role? Send us your open application at",
    'jobs.initiative.subject': "Open application",
    'management.eyebrow': "Management",
    'management.title': "People who take responsibility.",
    'management.more': "Read more",
    'management.less': "Show less",
    'management.linkedin': "on LinkedIn",
    'explore.title': "Keep exploring",
    'explore.portfolio': "Services",
    'explore.branchen': "Industries",
    'explore.about': "About us",
    'cta.eyebrow': "Your next step",
    'cta.link': "Discuss your project",
    'cta.default.title': "Get in touch now!",
    'cta.default.copy': "Whether you have a concrete project, need initial guidance or have other questions: tell us briefly what it is about.",
    'cta.portfolio.title': "Which service should we <em>deliver</em> for you?",
    'cta.portfolio.copy': "From an existing service to a new use case: let’s talk about how to define the outcome and the best place to start.",
    'cta.karriere.eyebrow': "Why Emposo",
    'cta.karriere.title': "We don’t just develop technologies.<br>We create <em>results.</em>",
    'cta.karriere.copy1': "That’s why we are looking for people who are curious, take on responsibility and want to get things across the finish line. Whether engineering, software, AI, cyber security or project management: at Emposo you work on projects that visibly make a difference. Together with experienced colleagues, strong clients and the scaling power of the Hays Group.",
    'cta.karriere.copy2': "<strong>Tomorrow, created today.</strong>",
    'facts.founded': "founded",
    'facts.founded.value': "2014",
    'facts.people': "employees",
    'facts.people.value': "250+",
    'facts.projects': "projects & services",
    'facts.projects.value': "2,900+",
    'facts.locations': "locations in Germany and Romania",
    'facts.locations.value': "4",
    'sitemap.services': "Services",
    'sitemap.home': "Home",
    'sitemap.portfolio': "Our services",
    'sitemap.branchen': "Industries",
    'sitemap.allBranchen': "All industries",
    'sitemap.company': "Company",
    'sitemap.about': "About us",
    'sitemap.management': "Management",
    'sitemap.karriere': "Careers",
    'sitemap.kontakt': "Contact",
    'sitemap.cookies': "Cookies",
    'sitemap.accessibility': "Accessibility",
    'sitemap.impressum': "Legal notice",
    'sitemap.privacy': "Privacy",
    'sitemap.terms': "Terms of use",
    'sitemap.projects': "Projects",
    'sitemap.allProjects': "All projects",
  },
};

// Every German fallback taken while building an English page, for the catalogue.
export const untranslated = new Map();

/** A UI string. English falls back to German (recorded) until translated. */
export function t(locale, key) {
  const de = STRINGS.de[key];
  if (de === undefined) throw new Error(`Unknown i18n key: ${key}`);
  if (locale === DEFAULT_LOCALE) return de;
  const value = STRINGS[locale]?.[key];
  if (value) return value;
  untranslated.set(`ui:${key}`, de);
  return de;
}
