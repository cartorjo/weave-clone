// Page manifest for assemble.mjs. Every shipped HTML document is generated
// from partials/ (head, header, footer) plus its content source:
//   - content: [files…]        → concatenated in the given order (homepage)
//   - content: 'pages/x.html'  → the page's <main> inner content
// nav: which header item is highlighted. navExact: false marks an ancestor
// (aria-current="true" instead of "page"), e.g. a case-study detail page.
import { projects } from './content/site-data.mjs';
// Owner-approved meta descriptions (B-22, 2026-09-26) and the two titles over
// 60 characters, which drop the "Case Study" segment.
const caseMeta = {
  'engineering-wissensbasis': { description: 'Von Wochen auf Stunden: Engineering-Wissen wird ausführbar. Eine vernetzte Wissensbasis senkt den Aufwand bei Testspezifikationen um 83 %, voll nachvollziehbar.' },
  'rechenzentrums-umzug': { description: 'Transformation ohne eine Minute migrationsbedingten Stillstand: Ein Rechenzentrum zieht um, während Produktion und Logistik durchgängig verfügbar bleiben.' },
  'mlops-medizinprodukte': { description: 'KI-Modelle regulatorisch sicher und schneller aktualisieren: MLOps für Medizinprodukte mit über 70 % weniger Prüfaufwand und Updates in Tagen statt Wochen.' },
  'wissens-assistent': { description: 'Technisches Wissen in Sekunden statt Tagen verfügbar: Ein Wissens-Assistent spart in der Engineering-Arbeit bis zu 80.000 EUR Rechercheaufwand pro Monat.' },
  'multi-site-transition': { description: '27+ Beauftragungen termingerecht und auditfest abgenommen: ein Transition-Programm über mehrere Standorte, mit Rollout-Blueprint für weitere Standorte.' },
  'homologationstests': { description: 'Markteinführung über mehrere Fahrzeugwellen abgesichert: Zulassungs- und Homologationstests mit eingehaltenen Terminen und revisionssicheren Nachweisen.' },
  'managed-service': { description: 'Langfristige Betriebssicherheit mit klaren SLAs: ein Managed Service seit 2018, mit über 8 Jahren stabilem Betrieb und ohne SLA-Verletzungen im Energiesektor.' },
  'fahrzeugfunktionen': { title: 'Fahrzeugfunktionen als Langzeit-Werkprogramm | Emposo', description: 'Fünf Jahre planbare Lieferung kompletter Funktionsumfänge: ein Langzeit-Werkprogramm mit termingerechter Lieferung sowie Planungs- und Budgetsicherheit.' },
  'technische-dokumentation': { title: 'Technische Dokumentation als Dauerleistung | Emposo', description: '800 technische Dokumente pro Jahr, skalierbar geliefert: technische Dokumentation als Dauerleistung, die Produktfreigaben seit mehr als 6 Jahren absichert.' },
};

export default [
  {
    out: 'index.html',
    title: 'Emposo | Wir machen Wandel beherrschbar',
    description: 'Emposo macht Wandel beherrschbar: definierte Leistungen, messbare Ergebnisse und Werkvertrag mit Acceptance. Wir verzahnen Engineering und IT bis zum Outcome.',
    nav: 'home',
    bodyClass: 'wrap-anywhere',
    content: ['sections/02-hero.html', 'sections/02b-expertise.html', 'sections/04-about.html', 'sections/05-industries.html', 'sections/06-work.html', 'sections/03-models.html', 'sections/07b-sales-cta.html'],
    scripts: ['00-core', '01-header', '02-intent-links', '06-work', '07-countup'],
  },
  {
    out: 'portfolio/index.html',
    title: 'Leistungen | Emposo',
    description: 'Emposo Portfolio: optimieren, transformieren, skalieren und verzahnen. Engineering und Technologie aus einer Hand, mit Ergebnisverantwortung bis zur Abnahme.',
    nav: 'portfolio',
    bodyClass: 'subpage wrap-anywhere',
    content: 'pages/portfolio.html',
    scripts: ['00-core', '01-header'],
  },
  {
    out: 'case-studies/index.html',
    title: 'Case Studies | Emposo',
    description: 'Case Studies von Emposo: Herausforderung, Lieferung und messbare Ergebnisse im Überblick, von Data2AI und MLOps bis zu Managed Service und Homologationstests.',
    nav: 'case-studies',
    bodyClass: 'subpage wrap-anywhere',
    content: 'pages/case-studies.html',
    scripts: ['00-core', '01-header', '06-work'],
  },
  {
    out: 'case-studies/data2ai-platform/index.html',
    title: 'Data2AI Plattform | Case Study | Emposo',
    description: 'Case Study Data2AI Plattform: Aus verteilten Engineering-Daten wird produktive KI, mit 7-facher Produktivitätssteigerung und ROI innerhalb von 9 Monaten.',
    nav: 'case-studies',
    navExact: false,
    bodyClass: 'subpage wrap-anywhere',
    content: 'project:data2ai-platform',
    scripts: ['00-core', '01-header'],
  },
  {
    out: 'about-us/index.html',
    title: 'Über uns | Emposo',
    description: 'Emposo ist die Outcome Factory im Hays-Netzwerk: klare Leistungen, Verantwortung bis zur Abnahme und skalierbare Delivery. Seit 2014, mit Hauptsitz in Mannheim.',
    nav: 'about',
    bodyClass: 'subpage wrap-anywhere',
    content: 'pages/about-us.html',
    scripts: ['00-core', '01-header', '07-countup'],
  },
  {
    out: 'branchen/index.html',
    title: 'Branchen | Emposo',
    description: 'Fünf Branchen, ein Anspruch: Engineering- und Technology-Leistungen, die im Betrieb Ihrer Branche ankommen — mit den Nachweisen, die dort zählen.',
    nav: 'branchen',
    bodyClass: 'subpage wrap-anywhere',
    content: 'pages/branchen.html',
    scripts: ['00-core', '01-header', '06-work'],
  },
  {
    out: 'karriere/index.html',
    title: 'Karriere | Emposo',
    description: 'Karriere bei Emposo: Verantwortung übernehmen und mit einem Team bis zum Ergebnis arbeiten, in Engineering, Software, AI und Cyber Security. 250+ Mitarbeitende.',
    nav: 'karriere',
    bodyClass: 'subpage wrap-anywhere',
    content: 'pages/karriere.html',
    scripts: ['00-core', '01-header'],
  },
  {
    out: 'kontakt/index.html',
    title: 'Kontakt | Emposo',
    description: 'Sprechen wir über Ihr Vorhaben: Optimierung, Transformation, Skalierung oder Karriere. Ihre Anfrage wird als E-Mail vorbereitet; Sie prüfen und senden sie.',
    nav: 'kontakt',
    bodyClass: 'subpage wrap-anywhere',
    content: 'pages/kontakt.html',
    scripts: ['00-core', '01-header', '02-intent-links', '06-work'],
  },
  {
    // serve-handler (and most static hosts) deliver /404.html for missing
    // paths with the correct 404 status.
    out: '404.html',
    title: 'Seite nicht gefunden | Emposo',
    description: 'Die angeforderte Seite existiert nicht oder wurde verschoben. Diese Wege führen weiter zu Leistungen, Branchen, Case Studies, Über uns, Karriere und Kontakt.',
    nav: 'none',
    bodyClass: 'subpage wrap-anywhere',
    content: 'pages/404.html',
    scripts: ['00-core', '01-header'],
  },
  ...projects.filter(project=>project.slug !== 'data2ai-platform').map(project=>({
    out:`case-studies/${project.slug}/index.html`, title:caseMeta[project.slug]?.title || `${project.name} | Case Study | Emposo`,
    description:caseMeta[project.slug]?.description || project.headline, nav:'case-studies', navExact:false,
    bodyClass:'subpage wrap-anywhere', content:`project:${project.slug}`, scripts:['00-core','01-header'],
  })),
  ...[
    ['impressum','Impressum','Impressum der Emposo GmbH: Anschrift, Kontakt, Geschäftsführung, Handelsregister und inhaltlich Verantwortliche. Emposo ist eine Tochter der Hays Holding GmbH.'],
    ['datenschutzerklaerung','Datenschutzerklärung','Datenschutzerklärung der Emposo GmbH: wie personenbezogene Daten erfasst, genutzt, gespeichert und geschützt werden, nach der Hays-Datenschutzerklärung.'],
    ['nutzungsbestimmungen','Nutzungsbestimmungen','Nutzungsbestimmungen der Emposo-Website: zulässige Nutzung, Links, geistiges Eigentum, Haftung und anwendbares Recht, ergänzend zu unseren Geschäftsbedingungen.'],
  ].map(([name,label,description])=>({
    out:`${name}/index.html`, title:`${label} | Emposo`, description,
    nav:'none', bodyClass:'subpage wrap-anywhere',
    content:`pages/${name}.html`, scripts:['00-core','01-header'],
  })),
  ...['cookies','barrierefreiheit','sitemap'].map(name=>({
    out:`${name}/index.html`, title:`${{cookies:'Cookies',sitemap:'Sitemap',barrierefreiheit:'Barrierefreiheit'}[name]} | Emposo`,
    description:{
      cookies:'Cookies bei Emposo: Die Website setzt keine Analyse- oder Marketing-Cookies ein; Filter und Formular arbeiten lokal in Ihrem Browser, alles vom selben Server.',
      barrierefreiheit:'Zugänglichkeit der Emposo Website: Tastaturbedienung, Sprung zum Hauptinhalt, skalierbare Schrift, reduzierte Bewegung und wie Sie uns eine Barriere melden.',
      sitemap:'Sitemap der Emposo Website: alle Seiten zu Leistungen, Branchen, Projekten und Unternehmen auf einen Blick, dazu Karriere, Kontakt und rechtliche Informationen.',
    }[name],
    nav:'none', bodyClass:'subpage wrap-anywhere',
    content:`pages/${name}.html`, scripts:['00-core','01-header'],
  })),
];
