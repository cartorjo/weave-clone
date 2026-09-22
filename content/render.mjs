import { readFileSync } from 'node:fs';
import { disciplines, industries, projects } from './site-data.mjs';
const assets = JSON.parse(readFileSync(new URL('../assets/supplied/manifest.json', import.meta.url), 'utf8'));
const disciplineBySlug = Object.fromEntries(disciplines.map(d => [d.slug, d]));
export const escape = value => String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const arrow = '<span aria-hidden="true">→</span>';

export function picture(key, sizes = '(max-width: 700px) 100vw, 50vw', priority = false) {
  const asset = assets[key];
  if (!asset) throw new Error(`Unknown supplied image: ${key}`);
  return `<picture>${['avif','webp'].map(format => `<source type="image/${format}" srcset="${asset.variants.filter(v=>v.format===format).map(v=>`${v.src} ${v.width}w`).join(', ')}" sizes="${sizes}">`).join('')}<img src="${asset.src}" alt="${escape(asset.alt)}" width="${asset.width}" height="${asset.height}" ${priority ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async"></picture>`;
}

export function industryCards() {
  return `<div class="industry-cards">${industries.map((industry,i)=>`<a class="industry-tile" href="/branchen/${industry.slug}/"><figure>${picture(industry.image,'(max-width: 600px) 100vw, (max-width: 1000px) 50vw, 33vw')}</figure><div class="industry-tile__copy"><span class="industry-tile__number">0${i+1}</span><h3>${escape(industry.name)}</h3>${industry.subtitle ? `<p>${escape(industry.subtitle)}</p>` : ''}<span class="industry-tile__arrow" aria-hidden="true">→</span></div></a>`).join('')}</div>`;
}

function metric(project) {
  return `<div class="result-metric"><strong${project.metric.length>8?' class="result-metric__word"':''}>${escape(project.metric)}</strong><span>${escape(project.label)}</span></div>`;
}
export function projectCards(selection = projects, filterable = false) {
  return `<div class="reference-grid"${filterable ? ' data-project-grid' : ''}>${selection.map(project=>`<a class="reference-card" href="/case-studies/${project.slug}/"${filterable ? ` data-project data-industry="${project.filter}" data-discipline="${project.discipline}"` : ''}><figure>${picture(project.image,'(max-width: 700px) 100vw, 50vw')}</figure><div class="reference-card__meta"><span>${escape(project.industry)}</span><span>${escape(disciplineBySlug[project.discipline].name)}</span></div><h3>${escape(project.name)}</h3><p>${escape(project.headline)}</p>${metric(project)}<span class="text-link">Case Study lesen ${arrow}</span></a>`).join('')}</div>`;
}

function filters() {
  // Dimensions per workbook v2: Branche + Leistungen (the eight service-portfolio
  // terms), not Wirkung. All eight disciplines are offered; the empty state
  // covers the ones without a published reference yet.
  const groups = [
    {key:'industry', label:'Branche', aria:'Nach Branche filtern', choices:[['all','Alle'],['aerospace','Aerospace & Defense'],['energy','Energy & Resources'],['health','Health & Pharma'],['industrial','Industrials & Manufacturing'],['automotive','Automotive'],['technology','Technology, Telecoms & Media']]},
    {key:'discipline', label:'Leistung', aria:'Nach Leistung filtern', choices:[['all','Alle'],...disciplines.map(d=>[d.slug,d.name])]},
  ];
  return `<div class="work-filter js-only">${groups.map(group=>`<div class="filter-group"><span>${group.label}</span><div role="group" aria-label="${group.aria}">${group.choices.map(([key,name])=>`<button class="filter-button min-h-11${key==='all'?' is-active':''}" type="button" data-filter-group="${group.key}" data-filter-value="${key}" aria-pressed="${key==='all'}">${escape(name)}</button>`).join('')}</div></div>`).join('')}</div><p class="work-count" id="project-count" aria-live="polite">${projects.length} Projekte</p>${projectCards(projects,true)}<p class="work-empty" id="project-empty" hidden>Für diese Auswahl ist noch keine Referenz veröffentlicht. <a href="/kontakt/">Sprechen Sie mit uns über Ihre Branche.</a></p>`;
}

export function disciplineGrid() {
  // No per-service subpages (workbook v2 correction) — the disciplines render as
  // static cards; the Engineering/Technology overview pages carry the detail.
  return `<div class="expertise-matrix">${['Engineering','Technology'].map(group=>`<section class="expertise-column" aria-labelledby="disciplines-${group}"><h3 class="expertise-column__title" id="disciplines-${group}">${group}</h3><div class="expertise-list">${disciplines.filter(d=>d.group===group).map(d=>`<article class="expertise-card"><h4>${escape(d.name)}</h4><p>${escape(d.topics)}</p><span class="expertise-card__promise">${escape(d.promise)}</span></article>`).join('')}</div></section>`).join('')}</div>`;
}

function cta(title='Jetzt Kontakt aufnehmen!') {
  return `<section class="page-section page-section--deep"><div class="gutter"><div class="container"><div class="page-cta"><div><p class="page-eyebrow page-eyebrow--light">Ihr nächster Schritt</p><h2 class="page-cta__title">${title}</h2></div><div class="page-cta__copy"><p>Ob konkretes Vorhaben, erste Orientierung oder weitere Fragen: Erzählen Sie uns kurz, worum es geht.</p><a class="page-link page-link--light" href="/kontakt/">Projekt besprechen</a></div></div></div></div></section>`;
}

export function projectPage(slug) {
  const p = projects.find(p=>p.slug===slug);
  if (!p) throw new Error(`Unknown project: ${slug}`);
  const d = disciplineBySlug[p.discipline];
  return `<section class="page-hero"><div class="gutter"><div class="container"><div class="page-hero__grid"><div class="page-hero__copy"><p class="page-breadcrumb"><a href="/">Startseite</a><span aria-hidden="true">/</span><a href="/case-studies/">Case Studies</a></p><p class="page-kicker">${escape(p.industry)}</p><h1 class="page-display">${escape(p.name)}</h1><p class="page-hero__intro">${escape(p.headline)}</p></div><figure class="page-hero__visual">${picture(p.image,'(max-width: 900px) 100vw, 50vw',true)}</figure></div></div></div></section>
  <section class="page-section"><div class="gutter"><div class="container"><div class="case-story"><div><p class="eyebrow">Der Outcome</p>${metric(p)}</div><div><h2>Die Herausforderung</h2><p>${escape(p.challenge)}</p><h2>Unsere Lösung</h2><p>${escape(p.solution)}</p><h2>Das Ergebnis</h2><ul class="result-list">${p.results.map(r=>`<li>${escape(r)}</li>`).join('')}</ul><a class="text-link" href="${d.overview}">${escape(d.name)} ${arrow}</a></div></div></div></div></section>
  <section class="page-section page-section--paper"><div class="gutter"><div class="container"><p class="eyebrow">Weitere Referenzen</p><h2 class="page-title">Expertise, die Ergebnisse liefert.</h2>${projectCards(projects.filter(other=>other.slug!==p.slug && other.discipline===p.discipline).slice(0,2).length ? projects.filter(other=>other.slug!==p.slug && other.discipline===p.discipline).slice(0,2) : projects.filter(other=>other.slug!==p.slug).slice(0,2))}<p class="section-more"><a class="text-link" href="/case-studies/">Alle Case Studies ${arrow}</a></p></div></div></section>${cta()}`;
}

export function industryPage(slug) {
  const i = industries.find(i=>i.slug===slug);
  if (!i) throw new Error(`Unknown industry: ${slug}`);
  const related = projects.filter(p=>i.cases.includes(p.slug));
  return `<section class="page-hero"><div class="gutter"><div class="container"><div class="page-hero__grid"><div class="page-hero__copy"><p class="page-breadcrumb"><a href="/">Startseite</a><span aria-hidden="true">/</span><a href="/branchen/">Branchen</a></p><p class="page-kicker">${escape(i.subtitle || 'Branchenwissen in Anwendung')}</p><h1 class="page-display">${escape(i.name)}</h1><p class="page-hero__intro">${escape(i.intro)}</p></div><figure class="page-hero__visual">${picture(i.image,'(max-width: 900px) 100vw, 50vw',true)}</figure></div></div></div></section>
  <section class="page-section"><div class="gutter"><div class="container"><div class="page-section__top"><div><p class="eyebrow">Ihre Branche. Unsere Expertise.</p><h2 class="page-title">Unsere Teams kommen direkt aus Ihrer Branche.</h2></div><div class="page-section__lede"><p>${escape(i.challenge)}</p><p>${escape(i.delivery)}</p></div></div><div class="industry-disciplines">${i.disciplines.map(slug=>{const d=disciplineBySlug[slug];return `<article class="expertise-card"><h3>${escape(d.name)}</h3><p>${escape(d.promise)}</p></article>`;}).join('')}</div></div></div></section>
  ${related.length ? `<section class="page-section page-section--paper"><div class="gutter"><div class="container"><p class="eyebrow">Referenzprojekte</p><h2 class="page-title">Unsere Erfolge sprechen für sich.</h2>${projectCards(related)}<p class="section-more"><a class="text-link" href="/case-studies/?branche=${i.filter}#referenzen">Alle passenden Referenzen ${arrow}</a></p></div></div></section>` : ''}${cta()}`;
}

function management() {
  // Roles and biographies as supplied in the owner's workbook (sheet 06 Management),
  // in the sheet's row order. Hans Lang has no supplied role, bio or portrait and
  // stays a name-only tile.
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
  const list = profiles.map(person=>`<article class="management-profile"><figure class="management-profile__media--wide">${picture(person.image,'(max-width: 700px) 100vw, 25vw')}</figure><div><h3>${escape(person.name)}</h3><p class="management-profile__role">${person.roles.map(escape).join('<br>')}</p>${person.bio.map(text=>`<p>${escape(text)}</p>`).join('')}${person.link ? `<a class="text-link" href="${person.link.href}">${escape(person.link.label)} ${arrow}</a>` : ''}</div></article>`).join('');
  return `<section class="page-section page-section--paper" id="management" aria-labelledby="management-title"><div class="gutter"><div class="container"><p class="eyebrow">Management</p><h2 class="page-title" id="management-title">Menschen, die Verantwortung übernehmen.</h2><div class="management-list">${list}</div><ul class="management-grid" aria-label="Weitere Mitglieder des Management-Teams"><li><div class="management-grid__initials" aria-hidden="true">HL</div><span>Hans Lang</span></li></ul></div></div></section>`;
}

export function fragment(name) {
  switch (name) {
    case 'industry-cards': return industryCards();
    case 'projects-featured': return projectCards(projects.filter(p=>['data2ai-platform','engineering-wissensbasis','mlops-medizinprodukte','multi-site-transition'].includes(p.slug)));
    case 'projects-all': return filters();
    case 'projects-ai': return projectCards(projects.filter(p=>p.discipline==='ai-daten' && p.slug!=='data2ai-platform'));
    case 'projects-engineering': return projectCards(projects.filter(p=>disciplineBySlug[p.discipline].group==='Engineering'));
    case 'projects-technology': return projectCards(projects.filter(p=>p.discipline==='enterprise-services'));
    case 'projects-optimize': return projectCards(projects.filter(p=>p.outcome==='optimize'));
    case 'projects-scale': return projectCards(projects.filter(p=>p.outcome==='scale'));
    case 'projects-verzahnen': return projectCards(projects.filter(p=>p.slug==='multi-site-transition'));
    case 'projects-transform': return projectCards(projects.filter(p=>p.outcome==='transform' && p.slug!=='data2ai-platform'));
    case 'disciplines': return disciplineGrid();
    case 'management': return management();
    case 'sitemap': return `<div><h2>Leistungen</h2><a href="/">Startseite</a><a href="/portfolio/">Unsere Leistungen</a><a href="/expertise/">Alle Disziplinen</a><a href="/expertise/engineering/">Engineering im Überblick</a><a href="/expertise/technology/">Technology im Überblick</a>${['optimieren','transformieren','skalieren','verzahnen'].map(slug=>`<a href="/portfolio/${slug}/">Wir ${slug}</a>`).join('')}</div><div><h2>Branchen</h2><a href="/branchen/">Alle Branchen</a>${industries.map(i=>`<a href="/branchen/${i.slug}/">${escape(i.name)}</a>`).join('')}<h2>Unternehmen</h2><a href="/about-us/">Über uns</a><a href="/about-us/#management">Management</a><a href="/karriere/">Karriere</a><a href="/kontakt/">Kontakt</a><a href="/zertifizierungen/">Zertifizierungen</a><a href="/cookies/">Cookies</a><a href="/barrierefreiheit/">Barrierefreiheit</a><a href="https://emposo.de/impressum/">Impressum</a><a href="https://emposo.de/datenschutzerklaerung/">Datenschutz</a></div><div><h2>Referenzprojekte</h2><a href="/case-studies/">Alle Case Studies</a>${projects.map(p=>`<a href="/case-studies/${p.slug}/">${escape(p.name)}</a>`).join('')}</div>`;
    default: throw new Error(`Unknown content fragment: ${name}`);
  }
}
