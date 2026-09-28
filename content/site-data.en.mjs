// English text overlay for content/site-data.mjs, keyed by slug. Only the
// human-readable fields are overridden; structural fields (slug, filter,
// outcome, discipline, image) always come from site-data.mjs. American
// English following the approved glossary (docs/i18n-glossary.md): figures and
// qualifiers ("over", "up to", "approx.") are kept exactly, in US number style.
// A missing field falls back to German and is listed in .i18n/untranslated.json.
export const projects = {
  'data2ai-platform': {
    name: 'Data2AI Platform', headline: 'Distributed engineering data becomes productive AI.', industry: 'Automotive', metric: '7×', label: 'productivity increase',
    challenge: 'Distributed engineering data is to become usable as a shared basis for productive AI.',
    solution: 'A Data2AI platform connects engineering data and knowledge for use in operations.',
    results: ['7x productivity increase', 'ROI within 9 months', 'PoC in less than 4 weeks'],
  },
  'engineering-wissensbasis': {
    name: 'Connected Engineering Knowledge Base', headline: 'From weeks to hours: engineering knowledge becomes executable.', industry: 'Automotive', metric: '83%', label: 'less effort for test specifications',
    challenge: 'Engineering knowledge must be available for test specifications and traceable throughout development.',
    solution: 'A connected knowledge base makes engineering knowledge executable and supports the creation of test specifications.',
    results: ['83% less effort for test specifications', 'Complete traceability'],
  },
  'rechenzentrums-umzug': {
    name: 'Data Center Migration Without Downtime', headline: 'Transformation without a single minute of migration-related downtime.', industry: 'Automotive', metric: '0', label: 'minutes of migration-related downtime',
    challenge: 'A data center has to move while production and logistics remain available throughout.',
    solution: 'Migration and integration are aligned with the ongoing operation of production and logistics.',
    results: ['No migration-related interruption of operations', 'Production and logistics available throughout'],
  },
  'mlops-medizinprodukte': {
    name: 'MLOps for Medical Devices', headline: 'Updating AI models faster and in a regulatory-compliant way.', industry: 'Health & Pharma', metric: '>70%', label: 'less testing effort',
    challenge: 'AI models for medical devices have to be updated, and their changes tested in a regulatory-compliant way.',
    solution: 'MLOps connects updating the AI models with the necessary testing and release processes.',
    results: ['Over 70% less testing effort', 'Updates in days instead of weeks'],
  },
  'wissens-assistent': {
    name: 'Engineering Knowledge Assistant', headline: 'Technical knowledge available in seconds instead of days.', industry: 'Industrials & Manufacturing', metric: '', label: '',
    challenge: 'Searching for technical knowledge ties up time in day-to-day engineering work.',
    solution: 'A knowledge assistant makes technical knowledge available for everyday use.',
    results: ['Technical knowledge available in seconds instead of days'],
  },
  'multi-site-transition': {
    name: 'Multi-Site Transition Program', headline: '27+ work orders accepted on schedule and audit-proof.', industry: 'Health & Pharma', metric: '27+', label: 'work orders accepted on schedule and audit-proof',
    challenge: 'A transition program has to be implemented across several sites, on schedule and audit-proof.',
    solution: 'A cross-site program takes the work orders through to acceptance and creates a reusable rollout blueprint.',
    results: ['27+ work orders accepted on schedule and audit-proof', 'Quality team relieved', 'Rollout blueprint established for further sites'],
  },
  'homologationstests': {
    name: 'Type Approval and Homologation Testing', headline: 'Market launch secured across several vehicle waves.', industry: 'Automotive', metric: 'Approval', label: 'secured on schedule',
    challenge: 'Several vehicle waves need reliable tests and evidence for their market launch.',
    solution: 'Type approval and homologation tests secure the releases with complete, audit-proof evidence.',
    results: ['Type approval deadlines met', 'Complete, audit-proof evidence'],
  },
  'managed-service': {
    name: 'Managed Service Since 2018', headline: 'Long-term operational reliability with clear SLAs.', industry: 'Energy & Resources', metric: '8+', label: 'years of stable operation',
    challenge: 'A running service needs consistently reliable performance and clearly defined service levels.',
    solution: 'A long-term managed service takes over operations with clearly agreed SLAs.',
    results: ['Over 8 years of stable operation', 'No SLA breaches'],
  },
  'software-planung-antriebssteuergeraete': {
    name: 'Software Planning for Powertrain ECUs', headline: 'Around 100 software deliveries per year planned and tracked', industry: 'Automotive', metric: '100', label: 'software deliveries per year',
    facts: ['Premium car manufacturer, powertrain electronics at three sites', 'ECUs for V6 and V8 engines, diesel and gasoline, including electrified', 'Software content planning, change documentation and side-effect assessment as a fixed-scope delivery', 'Project: 36 months', 'Unit prices, accepted quarterly'],
    challenge: ['Around 100 software deliveries per year: 30 series maintenance, 70 new development', 'Document every change according to the group process, check for side effects, schedule it', 'Requesters, system supplier and schedule depend on one another', 'Takeover from the previous contractor in three months without a break'],
    solution: ['Plan and track software content per delivery and keep it visible to everyone', 'Change documentation and side-effect assessment according to the group process, including homologation-relevant changes', 'Requirements engineering in the ECU, issue tracking in the client’s tools', 'Weekly status reports and status slides for the committees'],
    results: ['All service items from 2023 to 2025 accepted quarterly', 'Handover and final documentation anchored in the contract'],
  },
  'gewichtsmanagement-sportwagen': {
    name: 'Weight Management for Premium Sports Cars', headline: 'Weight data across the entire product development process, since 2016', industry: 'Automotive', metric: '10', label: 'years of continuous engagement',
    facts: ['Premium sports car manufacturer, complete vehicle development', 'All model series: base scope plus derivatives, twelve milestones per vehicle project', 'Engaged continuously since 2016', 'Current phase: 4 fiscal years', 'Fixed price per milestone with acceptance'],
    challenge: ['Every design change alters the weight and center of gravity of every variant', 'Track weight targets per derivative from project start to production start', 'One database that design, program management and chassis trust'],
    solution: ['Weight forecast per milestone, equipment options at part-number level', 'Weight benchmark against the competition, weighing of components and vehicles', 'Mass moments of inertia and products of inertia for chassis development', 'Individual tasks via a ticket system, acceptance per milestone'],
    results: ['All milestone deliveries from 2023 to 2025 accepted by protocol', 'Ten years of continuous engagement, most recently for three group brands', 'One database for design, chassis and program management'],
  },
  'qualitaetsarbeit-pharma-diagnostik': {
    name: 'Quality Work for a Pharma Diagnostics Group', headline: 'Over 40 fixed-price packages since 2022 under a framework work contract', industry: 'Health & Pharma', metric: '40+', label: 'fixed-price packages since 2022',
    facts: ['Pharma diagnostics group, production and laboratories at two German sites', 'Framework work contract since 2019, individual project contract per package', 'Risk analyses, qualification documentation, SOPs, CAPA, equipment, method verification', 'Scope: over 40 quality packages since 2022', 'Acceptance every two months'],
    challenge: ['Testing and documentation tasks in many departments at once, with capacity lacking', 'Equipment logbooks, risk analyses and qualification documents must be auditable in the client’s system', 'Every gap puts releases, audits and delivery capability at risk'],
    solution: ['Every task as a package with a results list, fixed price and acceptance', 'Pharma quality experts moderate risk analyses, verify methods, review according to GDP and ALCOA+', 'Qualification and validation documentation, equipment management with logbooks', 'SOPs, deviations and CAPA, batch record reviews; GMP responsibility stays with the client'],
    results: ['Every package accepted against its results list', 'Departments have kept reordering since 2019, change request chains of up to nine extensions', 'Backlogs cleared without the client having to add staff'],
  },
  'ki-testspezifikation': {
    name: 'AI-Assisted Test Specification', headline: 'Automated test generation, two pilots at two car manufacturers', industry: 'Automotive', metric: '2', label: 'pilots at two car manufacturers',
    facts: ['Two car manufacturers, premium and volume: test specification and infotainment diagnostics', 'Starting point: specifications, test cases and diagnostic data, around 1,800 test cases', 'Test case generation with AI agents on the Emposo platform Data2AI', 'Fixed price'],
    challenge: ['Test cases are written by hand from requirements and diagnostic specifications', 'Feasibility is to be proven on real data, not on examples', 'Results must run in the test automation without rework'],
    solution: ['AI agents translate requirements into structured, executable test cases in the target format', 'Experts review and assess, with acceptance based on the delivered test cases', 'Installation in the client environment with CI/CD, or operation on Emposo IT under TISAX', 'Commissioned under the AI requirements of the client’s specification (EU AI Act)'],
    results: ['Pilot 1 delivered on time and fully accepted', 'Second manufacturer commissions the same approach six months later', 'Test cases run in the format of the client’s test automation'],
  },
  'technische-dokumentation-halbleiter': {
    name: 'Technical Documentation as a Fixed-Scope Delivery', headline: 'Framework call-off in its seventh year, volume more than ten times larger', industry: 'Semiconductors', metric: '>10×', label: 'call-off volume since 2020',
    facts: ['Global semiconductor manufacturer, documentation service unit of development', 'Manuals, data sheets, errata sheets, application notes, security guidelines', 'Migration to the XML/DITA editorial system and tool development for the editorial team', 'Fixed-scope delivery with framework call-off', 'Acceptance per ticket'],
    challenge: ['Documentation must be ready for product release, with demand fluctuating with product cycles', 'Migrate the FrameMaker and Word inventory to DITA while editing continues', 'Keep product and terminology knowledge stable over years'],
    solution: ['Every package as a ticket: complexity agreed, written acceptance, two-year warranty', 'Well-established editorial team in the client’s publication chain', 'Conversion, validation and test import into the XML/DITA system', 'Tool development: XSLT, DITA plug-ins, Word templates, terminology management'],
    results: ['The client pays only for accepted packages: no minimum purchase, no fixed costs'],
  },
  'projektsteuerung-chip-entwicklung': {
    name: 'Project Control for Chip Development Projects', headline: 'PMO as a fixed-scope delivery in our own offices, four follow-on packages', industry: 'Semiconductors', metric: '4', label: 'follow-on packages at a fixed price',
    facts: ['Global semiconductor manufacturer, automotive microcontrollers, research and development', 'Operational project management for up to six parallel chip projects', 'Service delivered in Emposo offices, the client provides IT access', 'March 2022 to December 2024, four packages', 'Fixed price, written acceptance'],
    challenge: ['A formal milestone process requires complete project data on costs, schedules and risks', 'Recurring work per milestone ties up the project managers', 'Individual external contractors mean a loss of knowledge with every change'],
    solution: ['Project data in the client’s systems: KLUSA, Windchill, Jira, MS Project, Release Manager', 'Prepare and run the milestone process, report progress', 'Status reports, action item lists, change ticket status for the project managers', 'DFMEA coordination in Aris and PLATO, plausibility checks of the data'],
    results: ['Every package accepted in writing, additional needs via change request', 'Project managers decide; the milestone process runs in the Emposo project office'],
  },
  'auslagerung-zerspanung': {
    name: 'Outsourcing of Machining Services', headline: 'Supplier selection and know-how transfer in three work packages', industry: 'Industrials & Manufacturing', metric: '3', label: 'work packages through to final acceptance',
    facts: ['Manufacturer of vacuum technology, commissioned by the production management', 'Outsourcing of turning, milling and turn-milling services to external suppliers', 'On-site coordination of production, purchasing, supply chain, quality and suppliers', 'Project: approx. 5 months', 'Fixed price, acceptance against the specification'],
    challenge: ['Find, assess and qualify suitable suppliers', 'Fully transfer the manufacturing and process knowledge of operators and NC programmers', 'Manage schedules, quantities and quality across all parties involved'],
    solution: ['Supplier list built, assessed and clustered, on-site supplier visits', 'Quotes obtained and compared, recommendation made', 'Process analysis, training materials and key-user training', 'Schedule and quantity coordination, status report every two weeks, defect status weekly'],
    results: ['Qualified supplier base with a recommendation to the production management', 'Manufacturing knowledge transferred in training materials and training sessions', 'Three work packages, payment tied to milestones and final acceptance'],
  },
  'technische-dokumentation-antriebsumrichter': {
    name: 'Technical Documentation for Drive Inverters', headline: 'Security guide and operating manuals for two new inverter families', industry: 'Industrials & Manufacturing', metric: '3×', label: 'volume in the 2025 follow-on order',
    facts: ['Global technology group, drive technology, inverters for motion control', '2023: Industrial Security configuration manual for two software versions', '2025/26: operating manuals for two inverter families, Emposo as information manager', 'third order in the proposal stage'],
    challenge: ['Make industrial security understandable for users, written alongside development from the functional specifications', 'Complete operating manuals by the product release milestone', 'The client’s editorial chain: templates, linguistic review, graphics, six languages'],
    solution: ['Security functions researched from the functional specifications and prepared as a manual', 'Editing in the client’s systems, graphics via the image center, management in Azure DevOps', 'Output as PDF and HTML5 in six languages', 'From 2025 information manager: Emposo manages and reviews the technical writers'],
    results: ['Industrial Security manual published in two editions and six languages', 'Follow-on order in 2025 with three times the volume for the product milestone', 'Framework contracts since 2011 and 2018, third order in preparation'],
  },
  'virtuelles-kraftwerk': {
    name: 'Virtual Power Plant', headline: '78 fixed-price sprints in three years, continued as an agile team since 2025', industry: 'Energy & Resources', metric: '78', label: 'fixed-price sprints in three years',
    facts: ['Operator of a virtual power plant: around 5,000 plants with about 5,000 MW (client figure)', 'Further development of the platform: forecasts, dispatch optimization, customer portal, public API', 'Framework contract for agile projects with individual sprint contracts and defect classes', 'agile team since 2025, extended to the end of 2026'],
    challenge: ['Develop the platform further over years without energy trading standing still', 'Every sprint needs an acceptable increment: no class 1 or class 2 defects', 'Fit forecasts and revenue-optimized schedules into the existing system landscape'],
    solution: ['Every sprint an individual contract with acceptance criteria, acceptance per sprint, contractual penalty for delay', 'Forecasts, dispatch optimization, public API, end-customer portal in React', 'Interfaces to sales and billing, master database with adapter', 'Transition in 04/2025 to continuation without interruption, same project management'],
    results: ['Continuation extended twice since 2025, currently to the end of 2026', 'In 2023 the client also commissioned the platform’s penetration test'],
  },
  'plattformen-kreislaufwirtschaft': {
    name: 'Digital Platforms for the Circular Economy', headline: 'Up to five product lines, over 180 fixed-price sprints since 2023', industry: 'Industrials & Manufacturing', metric: '180+', label: 'fixed-price sprints since 2023',
    facts: ['B2B platforms for the return and remanufacturing of used parts, subsidiary of an industrial group', 'Up to five product lines in parallel, each with a permanent team from Germany and Romania', 'Framework contract for agile development, one order per sprint of two to three weeks', 'Ongoing since 03/2023, over 40 months', 'Fixed price per sprint with acceptance'],
    challenge: ['Develop several product lines with their own roadmaps at the same time', 'Agile speed with certainty of results: order and accept per sprint', 'Start new topics in the same model without renegotiating the contract'],
    solution: ['A permanent team per line, fixed price per sprint based on capacity and sprint length', 'One order number per sprint, acceptance according to the agile approach of the framework contract', 'DevOps roles in the core lines', 'Entry in 2022 via a ticket contingent, fully in the sprint model since 2023'],
    results: ['Over 180 sprints ordered and accepted, 55 sprint orders in 2025 alone', 'Three new product lines started in the same model since 2024', 'Framework contract extended in 2023, collaboration in its fourth year'],
  },
  'funktionsbetreuung-infotainment': {
    name: 'Infotainment Function Support', headline: 'Around 20 parking and online functions, framework contract from 2020 to 2024', industry: 'Automotive', metric: '20', label: 'parking and online functions',
    facts: ['Global car manufacturer, infotainment electronics development', 'Around 20 connected functions: 13 parking functions, 8 online services, two infotainment generations', 'Requirements analysis, test concept and full test, supplier support with ticket handling', 'Fixed-scope contract, catalog price per function, acceptance per package'],
    challenge: ['The scope of functions and the rate of change exceed internal support capacity', 'Every function needs requirements, a test concept and a full test per software version', 'Track defects from validation and the field with suppliers through to resolution'],
    solution: ['Function responsibility per function as a fixed-scope delivery, priced by catalog and complexity', 'Requirements analysis and specification, test concept and full test in the vehicle', 'Supplier support with ticket handling until the defect report is resolved', 'Acceptance per work package, milestone reviews every quarter'],
    results: ['24 call-offs accepted'],
  },
  'penetrationstests': {
    name: 'Penetration Testing for SMEs and Critical Infrastructure', headline: '30 tests for 19 clients since 2023, from ECUs to web applications', industry: 'SMEs & Critical Infrastructure', metric: '30', label: 'tests for 19 clients since 2023',
    facts: ['19 companies from energy, aviation, mechanical engineering, software, healthcare billing and telecommunications', 'Recon, black box, gray box, white box; web, infrastructure, Active Directory, ECUs and hardware', 'Own pentesters and partners under Emposo leadership, permission to attack as a contract annex', 'fixed price since 2024', 'Report and retest'],
    challenge: ['Regular testing with a reliable report, but no in-house offensive security team', 'ECUs and hardware need different methods than web applications', 'Results must be prioritized and verifiable in the retest'],
    solution: ['Scoping per environment, type of test by question', 'Own pentesters, with partners specialized in ECUs and hardware under Emposo leadership', 'Report with prioritized measures and explanations, evidence deleted after 90 days', 'Retest after remediation, annually for repeat clients'],
    results: ['30 orders for 19 clients in three years, three repeat clients', 'ECU pentest for a mechanical engineering group, critical infrastructure tests in energy and aviation', 'Fixed-scope contract clients commission the pentests in addition'],
  },
  'cybersecurity-post-market': {
    name: 'Post-Market Cybersecurity for Medical Devices', headline: 'Vulnerability scans for 20 product versions in six months', industry: 'Health & Pharma', metric: '20', label: 'product versions in six months',
    facts: ['Medical technology manufacturer for ophthalmology, software quality management', 'Cybersecurity monitoring for around 20 product versions in four device families', 'Post-market surveillance according to MDR and FDA, work according to the client’s software SOP', 'Project: 6 months', 'Fixed-scope contract, fixed price in three packages, monthly acceptance'],
    challenge: ['MDR and FDA require cybersecurity monitoring over the entire product lifecycle', 'Scans and monitoring documents for many existing products tie up internal software QM', 'Every piece of evidence must be documented and auditable per product and version'],
    solution: ['Vulnerability scans of the software components (Black Duck) and network interfaces (Nessus)', 'Evaluation of existing assessments, information bases and change logs', 'Drafting of the monitoring documents according to the client SOP, acceptance in the monthly status review'],
    results: ['20 product versions accepted in three work packages', 'Evidence base for the post-market review according to MDR and FDA', 'Duration shortened at the client’s request, fixed price and order budget kept'],
  },
  'informationssicherheits-risikomanagement': {
    name: 'Information Security Risk Management in Medical Technology', headline: 'Risk assessment and training in ten companies on three continents', industry: 'Health & Pharma', metric: '10', label: 'companies on three continents',
    facts: ['Global family-owned medical technology manufacturer, new client in 2024', 'Risk management at headquarters and in ten subsidiaries in North America and Asia', 'Follow-on package: support for an SAP security audit across eight systems', 'February to December 2024', 'Framework contract for fixed-scope delivery, seven packages with partial acceptance'],
    challenge: ['Methodology and templates in place, assessment and rollout into the organization missing', 'Preparation for the ISO/IEC 27001 audit with gap analysis and measures by the end of the year', 'Assess third-party and project risks worldwide using one procedure'],
    solution: ['50 risk assessments according to the client methodology: 25 third parties, 25 projects', 'Four risk catalogs and five process trainings', 'Third-party risk management rolled out in ten subsidiaries, with key-user support', 'On-site strategy workshop, security expertise and evidence for the SAP audit'],
    results: ['Seven work packages accepted with quarterly delivery dates', 'ISO/IEC 27001 audit preparation completed, measures reported every quarter', 'Risks from projects, products and suppliers assessed using one group-wide procedure'],
  },
  'fuzzing-firmware': {
    name: 'Fuzzing for Security-Relevant Firmware', headline: 'Three campaigns in three years: Trusted Firmware-M, TPM firmware, Bluetooth stack', industry: 'Semiconductors', metric: '3', label: 'fuzzing campaigns in three years',
    facts: ['Global semiconductor manufacturer, security software for microcontrollers in IoT and security products', 'Fuzzing against Trusted Firmware-M (2024), TPM firmware (2025), Bluetooth stack (2026)', 'Firmware rehosting, vulnerability reports with CVSS 3.1 and proof of concept', 'Three orders from 2024 to 2026', 'Fixed price with measurable acceptance criteria'],
    challenge: ['Vulnerabilities in the firmware have a direct effect on the clients’ products', 'Systematically test unexpected inputs at the boundary between the secure and non-secure world', 'The client wants to continue fuzzing on its own after the campaign'],
    solution: ['Test firmware and fuzzer configuration per target, coverage target of 80% of functions, 70% of code', 'Validity of the setup proven with deliberately built-in vulnerabilities', 'Every vulnerability with a report, CVSS 3.1 and a reproducible proof of concept', 'Reproducible Docker setup handed over to the client'],
    results: ['Vulnerabilities found, assessed and proven before delivery', '2024 and 2025 campaigns accepted against coverage targets, the third is ongoing', 'The same requester commissions three campaigns in three years'],
  },
};

export const disciplines = {
  'system-engineering': { name: 'Systems Engineering & Development', topics: 'Requirements, modeling, development and embedded systems.', promise: 'We take on defined development scopes, from the requirement to the validated function.' },
  'produktion-industrialisierung': { name: 'Production & Industrialization', topics: 'Quality, logistics, automation, plant integration and process optimization.', promise: 'We industrialize processes, data flows and technical workflows for stable operations.' },
  'test-validierung': { name: 'Test, Validation & Integration', topics: 'Integration and testing, safety, quality gates and audit-proof evidence.', promise: 'We make quality, safety and release decisions reliable.' },
  'engineering-services': { name: 'Engineering Services', topics: 'PMO, change, audit and technical documentation.', promise: 'We deliver technical management and documentation as a measurable, clearly scoped fixed-scope delivery.' },
  'ai-daten': { name: 'AI Transformation & Data', topics: 'AI strategy, agentic AI, data platforms, MLOps and training.', promise: 'We turn data and knowledge into productive, traceable AI applications.' },
  'software-cloud': { name: 'Software, Cloud & Architecture', topics: 'Solution architecture, multi-cloud, full stack and DevSecOps.', promise: 'We build and transform platforms, applications and architectures all the way to production.' },
  'cyber-compliance': { name: 'Cyber & Compliance', topics: 'Cyber security, penetration testing, GxP and the EU AI Act.', promise: 'We build security and compliance into architecture, processes and delivery.' },
  'enterprise-services': { name: 'Enterprise Services', topics: 'Managed services, migration, integration and S/4HANA.', promise: 'We take over migration, integration and operations with clear accountability for service and outcomes.' },
};

export const industries = {
  'aerospace-defense': { name: 'Aerospace & Defense', intro: 'Engineering, integration and reliable evidence for complex technical systems.', challenge: 'Complex systems need end-to-end requirements, coordinated development processes and traceable releases.' },
  'energy-resources': { name: 'Energy & Resources', intro: 'Stable systems and reliable services for an industry in transition.', challenge: 'Critical processes have to run reliably while technologies and requirements continue to evolve.' },
  'health-pharma': { name: 'Health & Pharma', intro: 'Technology, validation and quality in a regulated environment.', challenge: 'New technologies and updated AI models have to fit into regulated testing and release processes.' },
  'industrials-manufacturing': { name: 'Industrials & Manufacturing', subtitle: 'Including automotive', intro: 'From vehicle development to the plant: engineering and technology work hand in hand.', challenge: 'Distributed engineering knowledge, complex vehicle functions and industrial processes need a shared technical foundation.' },
  'technology-telecoms-media': { name: 'Technology, Telecoms & Media', intro: 'Digital products, secure platforms and scalable architectures.', challenge: 'Applications, data and existing systems have to connect reliably, even as requirements grow.' },
};

const JOB_META = ['Germany-wide', 'Remote / hybrid', 'Permanent position', 'Start: by arrangement'];
const JOB_OFFER = ['Exciting projects with well-known clients and leading companies across many industries', 'Plenty of creative freedom and personal responsibility', 'Modern technologies and innovative software projects', 'Continuous training and certification opportunities', 'Flexible working hours and mostly remote work', 'Flat hierarchies and fast decision-making', 'Personal development opportunities in a growing company', 'Collegial environment with an open company culture'];
const JOB_APPLY = 'We look forward to your application, including your earliest possible start date and your salary expectations.';

export const jobs = {
  'fullstack-solution-architect': {
    title: 'Fullstack Solution Architect (m/f/d)', meta: JOB_META,
    tagline: 'Shape the future of modern software solutions with us',
    intro: [
      'Are you passionate about modern software architectures and want to help shape innovative applications from the first idea all the way to production? Are you excited about full-stack development, cloud technologies and modern DevOps approaches?',
      'Then join Emposo and support our clients in developing future-proof software solutions. As a Fullstack Solution Architect (m/f/d), you play a central role in the technical consulting, architecture and implementation of demanding software projects. You develop innovative solutions, advise clients on strategic technology decisions and accompany projects from requirements gathering to a successful go-live.',
    ],
    sections: [
      { title: 'Your responsibilities', items: ['Technical consulting and solution development during project initiation with clients', 'Design and implementation of modern software and web solutions across frontend, backend and DevOps', 'Preparation of technical proposals, concepts and effort estimates', 'Responsibility for the architecture, quality, maintainability and scalability of the solutions developed', 'Analysis of business requirements and their translation into sustainable technical architectures', 'Selection and evaluation of suitable technologies, frameworks and platforms', 'Close collaboration with internal stakeholders, clients and external partners', 'Technical leadership and support of interdisciplinary project teams', 'Running architecture reviews, workshops and technical presentations', 'Accompanying projects from the concept phase to production rollout'] },
      { title: 'Your profile', items: ['Several years of professional experience as a Fullstack Solution Architect, Software Architect, Solution Architect, Lead Developer or in a comparable role', 'Many years of experience developing modern software solutions with technologies such as Java, Node.js, JavaScript/TypeScript, .NET, Python or PHP', 'Very good knowledge of modern frontend technologies such as React, Angular or comparable frameworks', 'Experience with cloud platforms such as Microsoft Azure, AWS or Google Cloud', 'Sound knowledge of DevOps, CI/CD and container technologies such as Docker and Kubernetes', 'Deep understanding of software architectures, design patterns and best practices in modern software development', 'Experience in client communication, technical project management and project and contract initiation', 'Strong communication skills, initiative and a solution-oriented mindset', 'Business-fluent German and good English'] },
      { title: 'Nice to have', items: ['Experience with microservices architectures and event-driven architectures', 'Knowledge of WPF, WCF or other enterprise technologies', 'Experience with infrastructure as code (Terraform, Bicep or comparable)', 'Certifications in cloud, software architecture or DevOps (e.g. Azure, AWS, Kubernetes, iSAQB or TOGAF)', 'Experience in the technical leadership of engineering teams and large software projects'] },
      { title: 'What you can expect at Emposo', items: JOB_OFFER },
      { title: 'Terms', items: ['Permanent position', 'Full time (40 hours/week)', 'Germany-wide, mostly remote', 'Attractive compensation model', 'Start by arrangement'] },
    ],
    apply: JOB_APPLY,
  },
  'data-ai-solution-architect': {
    title: 'Data & AI Solution Architect (m/f/d)', meta: JOB_META,
    tagline: 'Shape the future of data & AI with us',
    intro: [
      'Do you want to help companies create real value from data and develop innovative AI solutions? Are you excited about modern data platforms, cloud technologies and generative AI?',
      'Then join Emposo and shape the next generation of data-driven solutions together with our clients. As a Data & AI Solution Architect (m/f/d), you play a central role in developing modern data and AI architectures. You advise clients on strategic technology decisions and develop innovative solutions around data analytics, cloud and artificial intelligence.',
    ],
    sections: [
      { title: 'Your responsibilities', items: ['Design and architecture of modern data, analytics and AI solutions', 'Development of scalable data platforms based on data lakes and data warehouses', 'Design and rollout of generative AI solutions such as large language models (LLMs), retrieval-augmented generation (RAG) and AI agents', 'Analysis of business requirements and their translation into sustainable technical solution architectures', 'Advising our clients on data strategies, cloud architectures and AI use cases', 'Selection and evaluation of suitable technologies and platforms', 'Definition of architecture, security and governance standards', 'Accompanying projects from the idea phase through proofs of concept to production rollout', 'Technical management and support of interdisciplinary project teams', 'Running workshops and architecture reviews with clients'] },
      { title: 'Your profile', items: ['Several years of professional experience as a Solution Architect, Data Architect, AI Architect or comparable', 'Sound knowledge of data engineering, analytics and cloud technologies', 'Experience with modern data platforms such as Databricks, Snowflake or comparable solutions', 'Hands-on experience in machine learning and generative AI', 'Knowledge of Microsoft Azure, AWS or Google Cloud', 'Experience with data architectures, data governance and security concepts', 'Strong communication and consulting skills', 'Business-fluent German and good English'] },
      { title: 'Nice to have', items: ['Experience with MLOps and AI platforms', 'Knowledge of RAG architectures, vector databases and AI agents', 'Certifications in cloud, data or enterprise architecture (e.g. Azure, AWS, Databricks, TOGAF)', 'Experience leading technical teams or large transformation projects'] },
      { title: 'What you can expect at Emposo', items: ['Exciting projects with well-known clients across different industries', 'Plenty of creative freedom and personal responsibility', 'Modern technologies around data, cloud and artificial intelligence', 'Continuous training and certification opportunities', 'Flexible working hours and mostly remote work', 'Flat hierarchies and fast decision-making', 'Personal development opportunities in a growing company', 'Collegial environment with an open company culture'] },
      { title: 'Terms', items: ['Permanent position', 'Full time (40 hours/week)', 'Germany-wide, mostly remote', 'Attractive compensation model', 'Start as soon as possible'] },
    ],
    apply: JOB_APPLY,
  },
};

// Management profiles, keyed by the portrait's image key: { roles, bio }.
export const people = {
  'aleksandar-amidzic': {
    roles: ['Managing Director Emposo Germany & Romania', 'Managing Director Hays Professional Solutions GmbH'],
    bio: [
      'For many years, Aleksandar Amidzic has shaped the development of technology services in the German-speaking region. Since 2020 he has led Emposo in Germany and Romania, deliberately establishing the company as a reliable and high-performing partner for innovative, technology-driven solutions.',
      'As Managing Director of Hays Professional Solutions GmbH, Aleksandar has also been responsible since 2017 for a central part of Hays’ German project business, having taken on and successfully shaped numerous leadership roles since joining Hays in 2008.',
      'Aleksandar stands for a clear focus on solutions, partnership on equal terms and a deliberate combination of technological expertise with the concrete requirements of modern companies. He places particular emphasis on developing sustainable, scalable and client-focused results that create measurable value.',
    ],
  },
  'markus-auer': {
    roles: ['Chief Financial Officer Hays AG / Managing Director Emposo'],
    bio: [
      'After starting his career in 1996 at the construction group Bilfinger and working as commercial head of division at the industrial services provider Pöyry, Markus Auer became CFO of the Lahmeyer Group, which specializes in planning and consulting services, in 2011.',
      'In July 2016, the business graduate was appointed Chief Financial Officer (CFO) of Hays. There, in addition to finance, he is responsible for the service functions and the further development of the organization, among other areas.',
    ],
  },
  'roman-bretz': {
    roles: ['Technical Director Emposo'],
    bio: [
      'Roman Bretz began his career in 2001 at Siemens Healthineers, where he most recently helped shape the development of cancer therapy centers as a system architect. From 2010, as CTO at LieberLieber Software, he brought a new product for systems engineering to market and advised international industrial clients. In 2018 he co-founded a start-up for explainable AI.',
      'He has been with Emposo since 2021. As Technical Director, he is responsible for the solution portfolio across all business lines and works with the teams on its further development. The industrialization of AI and digital transformation are his core topics, both internally and externally: he drives them at Emposo itself and advises clients on them.',
    ],
  },
  'claus-thierbach': {
    roles: ['Director Emposo Professional Partner Solutions'],
    bio: [
      'The mechanical engineering graduate began his career in 1996 in plant engineering and later in aircraft construction. In 2015, Claus Thierbach joined Emposo. In business development, in his responsibility for operations and in building the site in Romania, he helped shape the company’s development.',
      'Since July 2026 he has been responsible for the Emposo Professional Partner Solutions business line, the partner business and the expansion of the partner network.',
    ],
  },
  'michael-schmitt': {
    roles: ['Head of the Digital Solutions Business Unit'],
    bio: [
      'Michael Schmitt started his career as a research associate at DaimlerChrysler Research (Dornier), focusing on simulation, logistics and production organization. He then moved to the space industry, where he took on various leadership roles at Airbus Defence & Space in the field of earth observation and radar systems, most recently heading the German satellite ground segments. In these roles he was responsible for international development projects, building organizations and leading interdisciplinary and international teams. From 2017 to 2018 he was Managing Director of RST Radar Systemtechnik GmbH. He then managed a project portfolio in the automotive, semiconductor and life sciences divisions as Senior Project Director at ALTEN.',
      'Since 2025, Michael Schmitt has been responsible for the Digital Solutions business unit at Emposo. Together with his team, he supports companies in their digital transformation, with a focus on software and cloud solutions, cyber security and data & AI (artificial intelligence). Based on automation and AI, highly productive engineering services are offered as well. He also manages the operations of Emposo’s Romanian subsidiary.',
    ],
  },
  'marcus-hefele': {
    roles: ['Head of Sales Emposo'],
    bio: [
      'As Head of Sales at Emposo, Marcus Hefele is responsible for developing strategic client partnerships and positioning innovative solutions for engineering, digitalization and transformation. His focus is on helping companies turn complex challenges into measurable business results.',
      'Over the course of his career, he has gained extensive experience in building new business areas and in working with companies from a wide range of industries. He combines a deep understanding of client requirements with a clear view of sustainable value creation.',
      'His aim is to develop solutions together with his clients that go beyond mere concepts, achieve measurable results and create lasting value for day-to-day operations.',
    ],
  },
};
