import { readFileSync } from 'node:fs';
import { disciplines, industries, jobs, projects } from './site-data.mjs';
const assets = JSON.parse(readFileSync(new URL('../assets/supplied/manifest.json', import.meta.url), 'utf8'));
const disciplineBySlug = Object.fromEntries(disciplines.map(d => [d.slug, d]));
export const escape = value => String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const arrow = '<span aria-hidden="true">→</span>';

// decorative: the image adds nothing beyond adjacent text (card photo, portrait
// beside the name), so it gets alt="" instead of repeating or padding it.
export function picture(key, sizes = '(max-width: 700px) 100vw, 50vw', priority = false, decorative = false) {
  const asset = assets[key];
  if (!asset) throw new Error(`Unknown supplied image: ${key}`);
  return `<picture>${['avif','webp'].map(format => `<source type="image/${format}" srcset="${asset.variants.filter(v=>v.format===format).map(v=>`${v.src} ${v.width}w`).join(', ')}" sizes="${sizes}">`).join('')}<img src="${asset.src}" alt="${decorative ? '' : escape(asset.alt)}" width="${asset.width}" height="${asset.height}" ${priority ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async"></picture>`;
}

// The one breadcrumb: Startseite, an optional parent [href, label], the page label.
export function breadcrumb(label, parent) {
  const sep = '<span aria-hidden="true">/</span>';
  const trail = [parent && `<a href="${parent[0]}">${parent[1]}</a>`, label].filter(Boolean).join(sep);
  return `<p class="page-breadcrumb"><a href="/">Startseite</a>${sep}${trail}</p>`;
}

// The one subpage hero frame. Pages supply only their copy (eyebrow, H1,
// intro) and the image; the frame, grid, breadcrumb and figure are shared.
export function pageHero({ id, crumb, parent, modifier, figureClass, copy, figure }) {
  return `<section class="page-hero${modifier ? ` ${modifier}` : ''}"${id ? ` aria-labelledby="${id}"` : ''}><div class="gutter"><div class="container @container"><div class="page-hero__grid @max-content:grid-cols-1"><div class="page-hero__copy">${breadcrumb(crumb, parent)}${copy}</div>${figure == null ? '' : `<figure class="page-hero__visual${figureClass ? ` ${figureClass}` : ''}">${figure}</figure>`}</div></div></div></section>`;
}

// Released certifications (owner 2026-09-25; TISAX is an assessment, shown
// as a label). The one list behind every trust strip.
const certifications = ['ISO 9001', 'ISO 37301', 'TISAX'];
function trustStrip() {
  return `<div class="trust-strip">${certifications.map(c => `<span>${c}</span>`).join('')}</div>`;
}

export function industryCards() {
  // ONE industry tile everywhere, and it is static content: the Branchen
  // detail subpages were removed (owner 24-09), so tiles carry no link, no
  // arrow, no hover — same behavior on the homepage and on /branchen/.
  return `<div class="industry-cards">${industries.map((industry,i)=>`<div class="industry-tile"><figure>${picture(industry.image,'(max-width: 600px) 100vw, (max-width: 1000px) 50vw, 33vw')}</figure><div class="industry-tile__copy"><span class="industry-tile__number">0${i+1}</span><h3>${escape(industry.name)}</h3>${industry.subtitle ? `<p>${escape(industry.subtitle)}</p>` : ''}</div></div>`).join('')}</div>`;
}

// Company Kennzahlen: ONE homogeneous component with ONE content set (owner
// 24-09, homepage version is the reference) — values, icons and labels live
// only here (icons follow the CD handbook's Anwendungsbeispiel, page 5). Every
// page renders the identical row via the company-facts fragment; never
// hand-write the markup or fork the labels.
const companyFactData = [
  {icon:'building-line',         value:'2014',   label:'gegründet'},
  {icon:'users-group-line',      value:'250+',   label:'Mitarbeitende'},
  {icon:'settings-cog-2-line',   value:'2.900+', label:'Projekte & Services'},
  {icon:'map-pin-simple-2-line', value:'4',      label:'Standorte in Deutschland und Rumänien'},
];
function companyFacts() {
  return `<dl class="company-facts">${companyFactData.map(f=>`<div><dt><span class="company-facts__icon">{{icon:${f.icon}}}</span><span class="company-facts__value">${f.value}</span></dt><dd>${escape(f.label)}</dd></div>`).join('')}</dl>`;
}

function metric(project) {
  return `<div class="result-metric"><strong${project.metric.length>8?' class="result-metric__word"':''}>${escape(project.metric)}</strong><span>${escape(project.label)}</span></div>`;
}
export function projectCards(selection = projects, filterable = false, collage = false) {
  // The collage variant restores the first draft's mixed-size grid (owner
  // correction): cards 2 and 3 run wide, 1 and 4 stay narrow and portrait.
  const sizes = index => collage
    ? (index === 1 || index === 2 ? '(max-width: 700px) 100vw, (max-width: 1000px) 50vw, 58vw' : '(max-width: 700px) 100vw, (max-width: 1000px) 50vw, 42vw')
    : '(max-width: 700px) 100vw, 50vw';
  return `<div class="reference-grid${collage ? ' reference-grid--collage' : ''}"${filterable ? ' data-project-grid' : ''}>${selection.map((project,index)=>`<a class="reference-card" href="/case-studies/${project.slug}/"${filterable ? ` data-project data-industry="${project.filter}" data-discipline="${project.discipline}"` : ''}><figure>${picture(project.image,sizes(index),false,true)}</figure><div class="reference-card__copy"><div class="reference-card__meta"><span>${escape(project.industry)}</span><span>${escape(disciplineBySlug[project.discipline].name)}</span></div><h3>${escape(project.name)}</h3><p>${escape(project.headline)}</p>${metric(project)}<span class="text-link">Case Study lesen ${arrow}</span></div></a>`).join('')}</div>`;
}

function filters() {
  // Dimensions per workbook v2: Branche + Leistungen (the eight service-portfolio
  // terms), not Wirkung. All eight disciplines are offered; the empty state
  // covers the ones without a published reference yet. Buttons sort A–Z
  // (owner review 24-09), "Alle" stays first.
  const az = choices => choices.sort((a,b)=>a[1].localeCompare(b[1],'de'));
  // "Alle" hangs in its own grid column so wrapped chip lines align with the
  // first named chip, not with "Alle" (owner review 24-09).
  const chip = (group,[key,name]) => `<button class="filter-button min-h-11${key==='all'?' is-active':''}" type="button" data-filter-group="${group.key}" data-filter-value="${key}" aria-pressed="${key==='all'}"><svg class="filter-button__check" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M3 8.5l3.2 3L13 4.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>${escape(name)}</button>`;
  const groups = [
    {key:'industry', label:'Branche', aria:'Nach Branche filtern', choices:[['all','Alle'],...az([['aerospace','Aerospace & Defense'],['energy','Energy & Resources'],['health','Health & Pharma'],['industrial','Industrials & Manufacturing'],['automotive','Automotive'],['technology','Technology, Telecoms & Media']])]},
    {key:'discipline', label:'Leistung', aria:'Nach Leistung filtern', choices:[['all','Alle'],...az(disciplines.map(d=>[d.slug,d.name]))]},
  ];
  return `<div class="work-filter js-only">${groups.map(group=>`<div class="filter-group"><span>${group.label}</span><div role="group" aria-label="${group.aria}">${chip(group,group.choices[0])}<div class="filter-choices">${group.choices.slice(1).map(choice=>chip(group,choice)).join('')}</div></div></div>`).join('')}</div><p class="work-count" id="project-count" aria-live="polite">${projects.length} Projekte</p>${projectCards(projects,true)}<p class="work-empty" id="project-empty" hidden>Für diese Auswahl ist noch keine Referenz veröffentlicht. <a href="/kontakt/">Sprechen Sie mit uns über Ihre Branche.</a></p>`;
}

export function disciplineGrid() {
  // No per-service subpages (owner IA) — the disciplines render as a calm 2×4
  // table (owner review 24-09): group headers, icons, continuous rules; grid
  // rows are shared across both columns so the promises align per row.
  const cell = d => `<article class="discipline-cell" id="${d.slug}"><span class="discipline-cell__icon" aria-hidden="true">{{icon:${d.icon}}}</span><h4>${escape(d.name)}</h4><p>${escape(d.topics)}</p><p class="discipline-cell__promise">${escape(d.promise)}</p></article>`;
  return `<div class="discipline-table">${['Engineering','Technology'].map(group=>`<h3 class="discipline-table__head">${group}</h3>${disciplines.filter(d=>d.group===group).map(cell).join('')}`).join('')}</div>`;
}

// Applications and enquiries go to the shared inbox (owner decision 2026-09-25).
const APPLY_EMAIL = 'info@emposo.eu';

export function jobsList() {
  // Stellenausschreibungen (owner deck 24-09) on /karriere/: flat IA — no
  // subpages, the full posting sits in the canonical expander. Visible state:
  // title, meta chips, tagline and the first paragraph.
  return `<div class="job-list">${jobs.map(job=>`<article class="job-card" id="${job.slug}"><h3>${escape(job.title)}</h3><p class="job-card__meta">${job.meta.map(m=>`<span class="tag">${escape(m)}</span>`).join('')}</p><p class="job-card__tagline">${escape(job.tagline)}</p><p class="job-card__text">${escape(job.intro[0])}</p><details class="expander"><summary class="min-h-11"><span class="expander__open">Zur vollständigen Ausschreibung</span><span class="expander__close">Weniger anzeigen</span><span class="sr-only"> – ${escape(job.title)}</span></summary>${job.intro.slice(1).map(text=>`<p class="job-card__text">${escape(text)}</p>`).join('')}${job.sections.map(section=>`<h4>${escape(section.title)}</h4><ul class="result-list result-list--compact">${section.items.map(item=>`<li>${escape(item)}</li>`).join('')}</ul>`).join('')}<p class="job-card__text">${escape(job.apply)}</p><p class="job-card__apply"><a class="text-link" href="mailto:${APPLY_EMAIL}?subject=${encodeURIComponent(`Bewerbung: ${job.title}`)}">Bewerbung an ${APPLY_EMAIL}<span class="sr-only"> – ${escape(job.title)}</span> <span aria-hidden="true">→</span></a></p></details></article>`).join('')}</div><p class="job-list__apply">Keine passende Position dabei? Schick uns Deine Initiativbewerbung an <a href="mailto:${APPLY_EMAIL}?subject=Initiativbewerbung">${APPLY_EMAIL}</a>.</p>`;
}

// The one CTA block. Variants are content, never copied markup; pages include
// them as <!-- content:cta-<name> -->, case studies use the default.
const ctas = {
  default: { title: 'Jetzt Kontakt aufnehmen!', copy: ['Ob konkretes Vorhaben, erste Orientierung oder weitere Fragen: Erzählen Sie uns kurz, worum es geht.'], link: true },
  'case-studies': { title: 'Lassen Sie uns Ihr nächstes Ergebnis <em>definieren.</em>', copy: ['Wir starten mit Ihrer Herausforderung und dem gewünschten Outcome.'], link: true },
  portfolio: { id: 'portfolio-cta-title', title: 'Welche Leistung sollen wir für Sie <em>liefern?</em>', copy: ['Von der bestehenden Leistung bis zum neuen Use Case: Sprechen wir über die Ergebnisdefinition und den sinnvollsten Einstieg.'], link: true },
  karriere: { id: 'karriere-statement-title', eyebrow: 'Warum Emposo', title: 'Wir entwickeln nicht nur Technologien.<br>Wir schaffen <em>Ergebnisse.</em>', copy: ['Dafür suchen wir Menschen, die neugierig sind, Verantwortung übernehmen und Dinge ins Ziel bringen wollen. Ob Engineering, Software, AI, Cyber Security oder Projektmanagement: Bei Emposo arbeitest Du an Projekten, die sichtbar etwas bewegen. Gemeinsam mit erfahrenen Kolleginnen und Kollegen, starken Kunden und der Skalierungskraft der Hays Gruppe.', '<strong>Tomorrow, created today.</strong>'], link: false },
};
function cta(name = 'default') {
  const c = ctas[name];
  if (!c) throw new Error(`Unknown CTA: ${name}`);
  const labelled = c.id ? ` aria-labelledby="${c.id}"` : '';
  const id = c.id ? ` id="${c.id}"` : '';
  const link = c.link ? '<a class="text-link text-link--light" href="/kontakt/">Projekt besprechen <span aria-hidden="true">→</span></a>' : '';
  return `<section class="page-section page-section--deep"${labelled}><div class="gutter"><div class="container @container"><div class="page-cta @max-content:grid-cols-1"><div><p class="eyebrow eyebrow--light">${c.eyebrow || 'Ihr nächster Schritt'}</p><h2 class="display-large display-large--light"${id}>${c.title}</h2></div><div class="page-cta__copy">${c.copy.map(p => `<p>${p}</p>`).join('')}${link}</div></div></div></div></section>`;
}

export function projectPage(slug) {
  const p = projects.find(p=>p.slug===slug);
  if (!p) throw new Error(`Unknown project: ${slug}`);
  const d = disciplineBySlug[p.discipline];
  // Detail layout per Sabrina's template (review 24-09): hero = image + title
  // (+ outcome metric), then a "Projekt" section with three icon columns
  // (Herausforderung / Lösung / Ergebnis). The final long-form texts are still
  // owed by the owner (Roman/Nico) — the columns render the supplied copy.
  const related = [
    ...projects.filter(other=>other.slug!==p.slug && other.discipline===p.discipline),
    ...projects.filter(other=>other.slug!==p.slug && other.discipline!==p.discipline && other.industry===p.industry),
  ].slice(0,2);
  return `${pageHero({ id: 'project-title', parent: ['/case-studies/', 'Projekte'], copy: `<p class="eyebrow eyebrow--light">${escape(p.industry)}</p><h1 class="display-large display-large--light" id="project-title">${escape(p.name)}</h1><p class="page-hero__intro">${escape(p.headline)}</p>`, figure: `${picture(p.image,'(max-width: 900px) 100vw, 50vw',true)}<div class="page-hero__metric"><strong${p.metric.length>8?' class="page-hero__metric--word"':''}>${escape(p.metric)}</strong><span>${escape(p.label)}</span></div>` })}
  <section class="page-section"><div class="gutter"><div class="container"><h2 class="display-large" id="projekt-title">Projekt</h2><p class="section-lede">${escape(p.industry)} · ${escape(d.name)}</p><div class="company-values case-facets"><article><span class="company-values__icon" aria-hidden="true">{{icon:document-paper-line}}</span><h3>Herausforderung</h3><p>${escape(p.challenge)}</p></article><article><span class="company-values__icon" aria-hidden="true">{{icon:lightbulb-shine-line}}</span><h3>Lösung</h3><p>${escape(p.solution)}</p></article><article><span class="company-values__icon" aria-hidden="true">{{icon:check-discount-line}}</span><h3>Ergebnis</h3><ul class="result-list">${p.results.map(r=>`<li>${escape(r)}</li>`).join('')}</ul></article></div><p class="section-more"><a class="text-link" href="/portfolio/#${d.slug}">${escape(d.name)} ${arrow}</a></p></div></div></section>
  <section class="page-section page-section--paper"><div class="gutter"><div class="container"><p class="eyebrow">Weitere Projekte</p><h2 class="display-large">Expertise, die Ergebnisse liefert.</h2>${projectCards(related)}<p class="section-more"><a class="text-link" href="/case-studies/">Alle Projekte ${arrow}</a></p></div></div></section>${cta()}`;
}


function management() {
  // Roles and biographies as supplied in the owner's workbook (sheet 06 Management),
  // in the sheet's row order. Hans Lang was removed per owner request (24-09).
  const profiles = [
    {name:'Aleksandar Amidzic', image:'aleksandar-amidzic', roles:['Geschäftsführer Emposo Deutschland & Rumänien','Geschäftsführer Hays Professional Solutions GmbH'], bio:[
      'Aleksandar Amidzic prägt seit vielen Jahren die Weiterentwicklung technologischer Dienstleistungen im deutschsprachigen Raum. Seit 2020 führt er die Emposo in Deutschland sowie Rumänien und hat dabei das Unternehmen gezielt als verlässlichen sowie leistungsstarken Partner für innovative technologiegetriebene Lösungen etabliert.',
      'Als Geschäftsführer der Hays Professional Solutions GmbH verantwortet Aleksandar zudem seit 2017 einen zentralen Teil des deutschen Projektgeschäfts von Hays, nachdem er seit seinem Einstieg bei Hays im Jahr 2008 zahlreiche Führungsrollen übernommen und erfolgreich gestaltet hat.',
      'Aleksandar steht für klare Lösungsorientierung, partnerschaftliche Zusammenarbeit auf Augenhöhe und eine gezielte Verbindung von technologischer Kompetenz mit den konkreten Anforderungen moderner Unternehmen. Dabei legt er besonderen Wert auf die Entwicklung von nachhaltigen, skalierbaren und kundennahen Ergebnissen, die messbaren Mehrwert schaffen.',
    ]},
    {name:'Markus Auer', image:'markus-auer', roles:['Chief Financial Officer Hays AG / Geschäftsführer Emposo'], bio:[
      'Nach seinem Karrierestart im Jahr 1996 beim Baukonzern Bilfinger und einem Engagement als kaufmännischer Spartenleiter beim Industriedienstleister Pöyry wurde Markus Auer 2011 Finanzvorstand der auf Planungs- und Beratungsleistungen spezialisierten Lahmeyer-Gruppe.',
      'Im Juli 2016 wurde der Diplom-Betriebswirt zum Chief Financial Officer (CFO) von Hays bestellt. Dort ist er neben den Finanz- unter anderem auch für die Service-Bereiche sowie die Weiterentwicklung der Organisation zuständig.',
    ]},
    {name:'Roman Bretz', image:'roman-bretz', roles:['Technischer Direktor Emposo'], bio:[
      'Roman Bretz begann seine Laufbahn 2001 bei Siemens Healthineers und gestaltete dort zuletzt als Systemarchitekt die Entwicklung von Krebstherapiezentren mit. Ab 2010 führte er bei LieberLieber Software als CTO ein neues Produkt für Systems Engineering zur Marktreife und beriet internationale Industriekunden. 2018 baute er ein Start-up für Explainable AI mit auf.',
      'Seit 2021 ist er bei Emposo. Als Technischer Direktor verantwortet er das Lösungsportfolio über alle Business Lines und arbeitet mit den Teams an dessen Weiterentwicklung. Die Industrialisierung von KI und die digitale Transformation sind seine zentralen Themen, nach innen wie nach außen: Er treibt sie bei Emposo selbst voran und berät dazu die Kunden.',
    ], link:{href:'https://www.linkedin.com/in/romanbretz', label:'Roman Bretz auf LinkedIn'}},
    {name:'Claus Thierbach', image:'claus-thierbach', roles:['Director Emposo Professional Partner Solutions'], bio:[
      'Der Diplom-Ingenieur für Maschinenbau startete seine Karriere 1996 im Anlagen- und später im Flugzeugbau. 2015 wurde Claus Thierbach Teil von Emposo. In Business Development, der Verantwortung für das operative Geschäft und beim Aufbau des Standortes in Rumänien hat er die Entwicklung des Unternehmens mitgestaltet.',
      'Seit Juli 2026 verantwortet er die Businessline Emposo Professional Partner Solutions, das Geschäft mit Partnern und den Aufbau des Partnernetzwerkes.',
    ]},
    {name:'Dr. Michael Schmitt', image:'michael-schmitt', roles:['Leiter des Geschäftsbereichs Digital Solutions'], bio:[
      'Nach seinem Karrierestart als wissenschaftlicher Mitarbeiter in der DaimlerChrysler-Forschung (Dornier) mit den Schwerpunkten Simulation, Logistik und Produktionsorganisation wechselte Michael Schmitt in die Raumfahrtindustrie und übernahm bei Airbus Defence & Space verschiedene Führungsaufgaben im Umfeld von Erdbeobachtungs- und Radarsystemen – zuletzt die Leitung der deutschen Satelliten-Bodensegmente. Dabei verantwortete er internationale Entwicklungsprojekte, den Ausbau von Organisationen sowie die Führung interdisziplinärer und internationaler Teams. Von 2017 bis 2018 war er Geschäftsführer der RST Radar Systemtechnik GmbH. Anschließend leitete er als Senior Project Director bei ALTEN ein Projektportfolio in den Sparten Automotive, Halbleiter und Life-Science.',
      'Seit 2025 verantwortet Michael Schmitt bei Emposo die Business Unit Digital Solutions. Gemeinsam mit seinem Team unterstützt er Unternehmen bei der digitalen Transformation mit Schwerpunkten in den Bereichen Software- und Cloud-Lösungen, Cyber Security sowie Data & AI (Künstliche Intelligenz). Auf Basis von Automatisierung und KI werden auch hochproduktive Engineering-Leistungen angeboten. Zusätzlich steuert er das operative Geschäft der rumänischen Emposo-Tochtergesellschaft.',
    ]},
    {name:'Marcus Hefele', image:'marcus-hefele', roles:['Head of Sales Emposo'], bio:[
      'Als Head of Sales bei Emposo verantwortet Marcus Hefele die Entwicklung strategischer Kundenpartnerschaften sowie die Positionierung innovativer Lösungen für Engineering, Digitalisierung und Transformation. Sein Fokus liegt darauf, Unternehmen dabei zu unterstützen, komplexe Herausforderungen in messbare Geschäftsergebnisse zu überführen.',
      'In seiner beruflichen Laufbahn hat er umfangreiche Erfahrung im Aufbau neuer Geschäftsfelder sowie in der Zusammenarbeit mit Unternehmen unterschiedlicher Branchen gesammelt. Dabei verbindet er ein tiefes Verständnis für Kundenanforderungen mit einem klaren Blick auf nachhaltige Wertschöpfung.',
      'Sein Anspruch ist es, gemeinsam mit seinen Kunden Lösungen zu entwickeln, die über reine Konzepte hinausgehen, messbare Ergebnisse erzielen und nachhaltigen Mehrwert für das operative Geschäft schaffen.',
    ]},
  ];
  // Card presentation per owner review 24-09 (facts removed same day): visible
  // state = photo, name, role and the first bio paragraph; the Mehr-lesen
  // expander holds the remaining paragraphs, then LinkedIn. No photo hover:
  // the photo is not clickable (hover policy 24-09). Photos render grayscale
  // for a uniform scheme.
  // The visible teaser is capped at 48 words, cut at the nearest sentence
  // boundary below the cap so it never breaks mid-sentence; everything after
  // sits behind the Mehr-lesen expander.
  const TEASER_WORDS = 48;
  const splitBio = paragraphs => {
    const teaser = [], rest = [];
    let count = 0, full = false;
    for (const paragraph of paragraphs) {
      if (full) { rest.push(paragraph); continue; }
      let keep = '', spill = '';
      for (const sentence of paragraph.match(/[^.!?]+[.!?]+["']?(\s+|$)/g) ?? [paragraph]) {
        const words = sentence.trim().split(/\s+/).length;
        if (!full && count + words <= TEASER_WORDS) { keep += sentence; count += words; }
        else { full = true; spill += sentence; }
      }
      if (keep.trim()) teaser.push(keep.trim());
      if (spill.trim()) rest.push(spill.trim());
    }
    return {teaser, rest};
  };
  const cards = profiles.map(person=>{
    const {teaser, rest} = splitBio(person.bio);
    const more = `<details class="expander"><summary class="min-h-11"><span class="expander__open">Mehr lesen</span><span class="expander__close">Weniger anzeigen</span><span class="sr-only"> – ${escape(person.name)}</span></summary>${rest.map(text=>`<p class="management-card__bio">${escape(text)}</p>`).join('')}${person.link ? `<p class="management-card__bio"><a class="text-link" href="${person.link.href}">${escape(person.name)} auf LinkedIn ${arrow}</a></p>` : ''}</details>`;
    return `<article class="management-card"><figure>${picture(person.image,'(max-width: 700px) 100vw, 33vw',false,true)}</figure><h3>${escape(person.name)}</h3><p class="management-card__role">${person.roles.map(escape).join('<br>')}</p>${teaser.map(text=>`<p class="management-card__bio">${escape(text)}</p>`).join('')}${more}</article>`;
  }).join('');
  return `<section class="page-section page-section--paper" id="management" aria-labelledby="management-title"><div class="gutter"><div class="container"><p class="eyebrow">Management</p><h2 class="display-large" id="management-title">Menschen, die Verantwortung übernehmen.</h2><div class="management-cards">${cards}</div></div></div></section>`;
}

export function fragment(name) {
  switch (name) {
    case 'industry-cards': return industryCards();
    case 'trust-strip': return trustStrip();
    case 'cta-case-studies': return cta('case-studies');
    case 'cta-portfolio': return cta('portfolio');
    case 'cta-karriere': return cta('karriere');
    case 'company-facts': return companyFacts();
    case 'jobs': return jobsList();
    case 'projects-featured': return projectCards(projects.filter(p=>['data2ai-platform','engineering-wissensbasis','mlops-medizinprodukte','multi-site-transition'].includes(p.slug)), false, true);
    case 'projects-all': return filters();
    case 'disciplines': return disciplineGrid();
    case 'management': return management();
    case 'sitemap': return `<div><h2>Leistungen</h2><a href="/">Startseite</a><a href="/portfolio/">Unsere Leistungen</a></div><div><h2>Branchen</h2><a href="/branchen/">Alle Branchen</a><h2>Unternehmen</h2><a href="/about-us/">Über uns</a><a href="/about-us/#management">Management</a><a href="/karriere/">Karriere</a><a href="/kontakt/">Kontakt</a><a href="/cookies/">Cookies</a><a href="/barrierefreiheit/">Barrierefreiheit</a><a href="/impressum/">Impressum</a><a href="/datenschutzerklaerung/">Datenschutz</a><a href="/nutzungsbestimmungen/">Nutzungsbestimmungen</a></div><div><h2>Projekte</h2><a href="/case-studies/">Alle Projekte</a>${projects.map(p=>`<a href="/case-studies/${p.slug}/">${escape(p.name)}</a>`).join('')}</div>`;
    default: throw new Error(`Unknown content fragment: ${name}`);
  }
}
