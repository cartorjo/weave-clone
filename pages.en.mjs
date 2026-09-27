// English page manifest, derived from pages.mjs: same content sources (their
// English twins in pages/en/ and sections/en/ when present), English paths
// from content/i18n.mjs, and English titles and descriptions from META below.
// A page without an English title or description keeps the German one and is
// listed in .i18n/untranslated.json. Titles and descriptions are copy: the
// owner approves them (docs/i18n.md).
import { localizePath, untranslated } from './content/i18n.mjs';

// Keyed by the German page's `out`: { title, description }. American English
// following the approved glossary (docs/i18n-glossary.md).
export const META = {
  "index.html": { title: "Emposo | We make change manageable", description: "Emposo makes change manageable: defined services, measurable results and fixed-scope contracts with acceptance. We integrate engineering and IT all the way to the outcome." },
  "portfolio/index.html": { title: "Services | Emposo", description: "The Emposo portfolio: optimize, transform, scale and integrate. Engineering and technology from a single source, with accountability for outcomes up to acceptance." },
  "case-studies/data2ai-platform/index.html": { title: "Data2AI Platform | Case Study | Emposo", description: "Case study Data2AI Platform: distributed engineering data becomes productive AI, with a 7x productivity increase and ROI within 9 months." },
  "about-us/index.html": { title: "About us | Emposo", description: "Emposo is the Outcome Factory in the Hays network: clear services, responsibility up to acceptance and scalable delivery. Since 2014, headquartered in Mannheim." },
  "branchen/index.html": { title: "Industries | Emposo", description: "Five industries, one standard: engineering and technology services that work in the day-to-day operations of your industry, with the evidence that counts there." },
  "karriere/index.html": { title: "Careers | Emposo", description: "Careers at Emposo: take on responsibility and work with a team all the way to the result, in engineering, software, AI and cyber security. 250+ employees." },
  "kontakt/index.html": { title: "Contact | Emposo", description: "Let’s talk about your project: optimization, transformation, scaling or careers. Your inquiry is prepared as an email; you review it and send it." },
  "404.html": { title: "Page not found | Emposo", description: "The page you requested does not exist or has moved. These paths lead on to services, industries, case studies, about us, careers and contact." },
  "case-studies/engineering-wissensbasis/index.html": { title: "Connected Engineering Knowledge Base | Case Study | Emposo", description: "From weeks to hours: engineering knowledge becomes executable. A connected knowledge base cuts the effort for test specifications by 83%, fully traceable." },
  "case-studies/rechenzentrums-umzug/index.html": { title: "Data Center Migration Without Downtime | Case Study | Emposo", description: "Transformation without a single minute of migration-related downtime: a data center moves while production and logistics remain available throughout." },
  "case-studies/mlops-medizinprodukte/index.html": { title: "MLOps for Medical Devices | Case Study | Emposo", description: "Updating AI models faster and in a regulatory-compliant way: MLOps for medical devices with over 70% less testing effort and updates in days instead of weeks." },
  "case-studies/wissens-assistent/index.html": { title: "Engineering Knowledge Assistant | Case Study | Emposo", description: "Technical knowledge available in seconds instead of days: a knowledge assistant saves up to €80,000 in research effort per month in engineering work." },
  "case-studies/multi-site-transition/index.html": { title: "Multi-Site Transition Program | Case Study | Emposo", description: "27+ work orders accepted on schedule and audit-proof: a transition program across several sites, with a rollout blueprint for further sites." },
  "case-studies/homologationstests/index.html": { title: "Type Approval and Homologation Testing | Case Study | Emposo", description: "Market launch secured across several vehicle waves: type approval and homologation tests with deadlines met and audit-proof evidence." },
  "case-studies/managed-service/index.html": { title: "Managed Service Since 2018 | Case Study | Emposo", description: "Long-term operational reliability with clear SLAs: a managed service since 2018, with over 8 years of stable operation and no SLA breaches in the energy sector." },
  "case-studies/software-planung-antriebssteuergeraete/index.html": { title: "Software Planning for Powertrain ECUs | Case Study | Emposo", description: "Around 100 software deliveries per year planned and tracked" },
  "case-studies/gewichtsmanagement-sportwagen/index.html": { title: "Weight Management for Premium Sports Cars | Case Study | Emposo", description: "Weight data across the entire product development process, since 2016" },
  "case-studies/qualitaetsarbeit-pharma-diagnostik/index.html": { title: "Quality Work for a Pharma Diagnostics Group | Case Study | Emposo", description: "Over 40 fixed-price packages since 2022 under a framework work contract" },
  "case-studies/ki-testspezifikation/index.html": { title: "AI-Assisted Test Specification | Case Study | Emposo", description: "Automated test generation, two pilots at two car manufacturers" },
  "case-studies/technische-dokumentation-halbleiter/index.html": { title: "Technical Documentation as a Fixed-Scope Delivery | Case Study | Emposo", description: "Framework call-off in its seventh year, volume more than ten times larger" },
  "case-studies/projektsteuerung-chip-entwicklung/index.html": { title: "Project Control for Chip Development Projects | Case Study | Emposo", description: "PMO as a fixed-scope delivery in our own offices, four follow-on packages" },
  "case-studies/auslagerung-zerspanung/index.html": { title: "Outsourcing of Machining Services | Case Study | Emposo", description: "Supplier selection and know-how transfer in three work packages" },
  "case-studies/technische-dokumentation-antriebsumrichter/index.html": { title: "Technical Documentation for Drive Inverters | Case Study | Emposo", description: "Security guide and operating manuals for two new inverter families" },
  "case-studies/virtuelles-kraftwerk/index.html": { title: "Virtual Power Plant | Case Study | Emposo", description: "78 fixed-price sprints in three years, continued as an agile team since 2025" },
  "case-studies/plattformen-kreislaufwirtschaft/index.html": { title: "Digital Platforms for the Circular Economy | Case Study | Emposo", description: "Up to five product lines, over 180 fixed-price sprints since 2023" },
  "case-studies/funktionsbetreuung-infotainment/index.html": { title: "Infotainment Function Support | Case Study | Emposo", description: "Around 20 parking and online functions, framework contract from 2020 to 2024" },
  "case-studies/penetrationstests/index.html": { title: "Penetration Testing for SMEs and Critical Infrastructure | Case Study | Emposo", description: "30 tests for 19 clients since 2023, from ECUs to web applications" },
  "case-studies/cybersecurity-post-market/index.html": { title: "Post-Market Cybersecurity for Medical Devices | Case Study | Emposo", description: "Vulnerability scans for 20 product versions in six months" },
  "case-studies/informationssicherheits-risikomanagement/index.html": { title: "Information Security Risk Management in Medical Technology | Case Study | Emposo", description: "Risk assessment and training in ten companies on three continents" },
  "case-studies/fuzzing-firmware/index.html": { title: "Fuzzing for Security-Relevant Firmware | Case Study | Emposo", description: "Three campaigns in three years: Trusted Firmware-M, TPM firmware, Bluetooth stack" },
  "impressum/index.html": { title: "Disclaimer | Emposo", description: "Legal notice of Emposo GmbH: address, contact, managing directors, commercial register and persons responsible for content. Emposo is a subsidiary of Hays Holding GmbH." },
  "datenschutzerklaerung/index.html": { title: "Privacy Policy | Emposo", description: "Privacy policy of Emposo GmbH: how personal data is collected, used, stored and protected, in line with the Hays Privacy Policy." },
  "nutzungsbestimmungen/index.html": { title: "Terms of Use | Emposo", description: "Terms of use of the Emposo website: permitted use, links, intellectual property, liability and applicable law, in addition to our terms of business." },
  "cookies/index.html": { title: "Cookies | Emposo", description: "Cookies at Emposo: the website uses no analytics or marketing cookies; filters and form work locally in your browser, everything from the same server." },
  "barrierefreiheit/index.html": { title: "Accessibility | Emposo", description: "Accessibility of the Emposo website: keyboard operation, skip to main content, scalable text, reduced motion and how to report a barrier to us." },
  "sitemap/index.html": { title: "Sitemap | Emposo", description: "Sitemap of the Emposo website: all pages on services, industries, projects and the company at a glance, plus careers, contact and legal information." },
};

const pathOf = out => out === 'index.html' ? '/' : `/${out.replace(/index\.html$/, '')}`;
const outOf = path => `${path.replace(/^\//, '')}index.html`;

export function pagesEn(pagesDe) {
  return pagesDe.map(page => {
    const out = page.out === '404.html' ? 'en/404.html' : outOf(localizePath(pathOf(page.out), 'en'));
    const meta = META[page.out] ?? {};
    for (const field of ['title', 'description']) if (!meta[field]) untranslated.set(`meta:${page.out}.${field}`, page[field]);
    return { ...page, locale: 'en', out, twinOut: page.out, title: meta.title ?? page.title, description: meta.description ?? page.description };
  });
}
