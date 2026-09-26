# Komponenten-Kanon

Stand: 26.09.2026 (Konsolidierung 24.09., technical track 25./26.09.). Kanonische Klassen leben in
`styles/11-components.css` (letzter Import — gewinnt Gleichstände gegen
07–10). `tools/check-content.mjs` lehnt die pensionierten Klassennamen im
generierten Output ab; wer eine neue Variante braucht, erweitert den Kanon
statt eine Parallel-Klasse zu erfinden.

## Grundregeln

- **Motion-Tokens:** `--duration-fast` 180ms (Farben, Linien, Pfeile),
  `--duration-medium` 320ms (Box-Invertierung, Overlays, Unterstriche),
  `--duration-slow` 560ms (Bild-Zooms). Easing immer `var(--ease-em)`.
  Countup: `--duration-countup` 900ms, von js/07-countup.js gelesen (bindet
  `.company-facts__value`; Ease-out-cubic in JS). Lenis-Scroll: lerp 0.1
  (js/00-core.js).
- **Hover-Policy:** Hover nur auf Klickbarem. Alle Hover-Regeln in
  `@media (hover: hover)`, jeweils mit ungegatetem `:focus-visible`-Zwilling.
  Kein font-weight-Wechsel im Hover (Reflow). Navy-Box-Bleed auf Karten
  einheitlich 1.1rem.
- **Farbe auf Dunkel:** Inhalte auf Ink-/Deep-Flächen nutzen nur die
  Rollen `--color-on-dark` (Weiß), `--color-on-dark-muted` (72 %, Fließtext,
  Ledes, Bildunterschriften) und `--color-on-dark-faint` (62 %, Breadcrumb,
  Footer-Metatext); Linien `--color-line-light` (22 %) bzw.
  `--color-line-light-strong` (45 %, Formularfelder, Footer-Kante). Keine
  `#fff`/`rgba(255,255,255,…)`-Literale in Komponenten; weiße Flächen sind
  `--color-bg`.
- **State-Layer (Hover/Press):** EINE Overlay-Schicht in der Inhaltsfarbe
  (`::before` zwischen Grund und Inhalt, `--state-hover` .08,
  `--state-press` .1), definiert in `styles/11-components.css`. Press gilt für
  alles Klickbare; das Hover-Overlay nur dort, wo es keine eigene
  Hover-Behandlung gibt (Summaries, Menü-Links, Logo, aktiver Filter-Chip) —
  Invertierungen, Farbwechsel und Pfeil-Slides bleiben wie abgenommen.
  Text-Controls bekommen eine Pill mit .6rem Überstand, Karten reichen bis zum
  Navy-Halo (1.1rem). `::before` ist auf diesen Komponenten dafür reserviert.
  Formularfelder: Hover verstärkt die Linie (`--color-on-dark-muted`).
- **Zielgröße 44px (Owner-Entscheid 25.09.):** Mindesthöhe klickbarer
  Elemente 44px (`min-h-11`, `.text-link`) — WCAG 2.5.5 AAA erfüllt,
  bewusste Abweichung von M3s 48dp. Breadcrumb-Links bekommen die 44px per
  überstehender Box, ohne die Zeile zu erhöhen. Inline-Links im Fließtext
  (z. B. Datenschutz im Formularhinweis) sind nach WCAG 2.5.8 ausgenommen.
- **Orange Linien** (#F7911E) nur unter Zahlen/Labels — Ausnahme: der
  aktive/gehoverte Menülink trägt einen 2px-Ink-Unterstrich (Owner-Entscheid
  24.09., gilt nur im Menü).
- **Keine Seiten-Forks:** dieselbe Komponente verhält sich auf jeder Seite
  gleich (Owner 24.09.). Die frühere Startseiten-Sonderform (statische
  Branchen-Kacheln, pfeillose Karten-Links) ist aufgehoben; Varianten sind
  Modifier im Kanon, keine Parallel-Implementierungen. Auf der Startseite
  sind nur Referenzkarten Links (29dd713); alle Komponenten dort verhalten
  sich wie auf jeder anderen Seite (Branchen-Kacheln überall statisch).

## Kanon-Komponenten

| Komponente | Klasse(n) | Zweck / Varianten |
| --- | --- | --- |
| Eyebrow | `.eyebrow`, `--light` | Sektions-Label mit Lemon-Rule danach. Ersetzt page-eyebrow, page-kicker. |
| Display-Heading | `.display-large`, `--light` | Die eine große Überschrift (H1/H2). `em` = bold, Farbe erbt. Ersetzt display-hero, page-display, page-title, page-cta__title. |
| Text-Link | `.text-link`, `--light` | Pfeil-Link; Pfeil IMMER als `<span aria-hidden="true">→</span>` im Markup. 44px-Target eingebaut. Ersetzt page-link. |
| Fakten/Nummern-Grid | `.fact-grid`, `--5`, `__label`, `__label--display` | Hairline-Zellen-Grid für Phasen (NICHT für Kennzahlen — die sind immer `.company-facts`). `--display` = Phasen-Ziffern in Kennzahlen-Größe mit Lemon-Rule. Einziger Konsument: das 5-Stufen-Modell auf /portfolio/. Ersetzt portfolio-model, about-principles, about-facts. |
| Box-Trio | `.company-values`, `--paper`, `--2`, `__icon` | Artikel-Grid mit Lemon-Top-Rule; `--paper` = gefüllte Papier-Boxen (ex lede-boxes), `--2` = zweispaltig. `.case-facets` ist der bewusste Projekt-Override (Icon-Spalten). |
| CTA | `.page-cta` NUR via `cta()` in content/render.mjs (`content:cta-<name>`) | EIN Generator, Varianten sind Inhalte in `ctas` (default für Case Studies, case-studies, portfolio, karriere): Eyebrow (Standard „Ihr nächster Schritt“), Titel, Absätze, optionaler Kontakt-Link. Nie von Hand schreiben. |
| Filter-Chip | `.filter-button`, `__check` — via `chip()` in content/render.mjs | Toggle-Chip der Projektfilter: Ruhe-Outline `--color-line-strong` (3:1), ausgewählt = Lemon + Ink-Outline + führender Haken, Hover (unausgewählt) nur Tönung. Eine Tab-Station pro Gruppe, Pfeiltasten/Home/End wechseln (js/06-work.js). |
| Seiten-Hero | `<page-hero id crumb [parent] [modifier] [figure-class] [image]>` in pages/*.html → `pageHero()` in content/render.mjs | EIN Rahmen für alle Unterseiten-Heros (Grid, Breadcrumb, Figur); die Seite liefert nur Eyebrow, H1, Intro. Case Studies nutzen denselben Renderer. Handgeschriebene Heros lehnt check:content ab. |
| Breadcrumb | `<page-crumb label>` bzw. `crumb`/`parent` am Hero → `breadcrumb()` | Startseite / [Eltern] / Seite; speist auch die BreadcrumbList-JSON-LD. Nie von Hand schreiben. |
| Referenzkarte | `.reference-card` | Navy-Box-Hover (320ms), Bild-Zoom 560ms/1.03, Pfeil-Slide .35rem. |
| Branchen-Kachel | `.industry-tile` | EIN Verhalten überall (Owner 24.09., zweiter Entscheid am selben Tag): statische Inhaltskachel — kein Link, kein Pfeil, kein Hover, da die Branchen-Unterseiten entfernt wurden. Bild, Nummer, Name, optionale Subline. |
| Expander | `.expander`, `__open`, `__close` | DER kanonische `<details>`-Expander (Mehr-lesen-Muster): Open/Close-Label-Spans, rotierendes Lemon-Plus. Konsumenten: Management-Karten, Stellenausschreibungen. Ersetzt management-card__more. |
| Management-Karte | `.management-card` | Foto (grayscale, kein Hover), Name, Rolle, 48-Wort-Teaser; Rest-Bio + LinkedIn im `.expander`. |
| Stellenausschreibung | `.job-list`, `.job-card`, `__meta`, `__tagline`, `__text` (+ `.result-list--compact`) | Karriere-Stellen aus `jobs` in site-data.mjs via `jobsList()` (`content:jobs`): Titel, statische Meta-Tags (`.tag`: weiß gefüllt, ohne Outline — nie im Chip-Look), Tagline, erster Absatz sichtbar; volle Ausschreibung im `.expander`, endet mit dem Bewerbungslink „Bewerbung an info@emposo.eu“ (mailto, Betreff = Stelle; Owner 25.09., B-16) und der Initiativbewerbungs-Zeile unter der Liste. Die Kartenflächen bleiben linkfrei. Owner-Copy wörtlich, keine Unterseiten. |
| Kennzahlen | `.company-facts`, `__icon`, `__value` — NUR via `companyFacts()` in content/render.mjs (`content:company-facts`) | EINE homogene Zahlenreihe mit EINEM Inhalt (Owner 24.09., Startseiten-Version ist die Referenz): 2014 / 250+ / 2.900+ / 4, identisch auf Startseite und Über-uns (Karriere seit 826952c, 24.09., ohne Kennzahlen). Werte, Icons und Labels leben einmal in `companyFactData` — Markup nie von Hand schreiben, Labels nie pro Seite forken. Nicht klickbar → kein Hover. |
| Header/Menü | `.site-nav`, `.header-contact`, `.mobile-menu` | Der Formular-Submit auf /kontakt/ ist dieselbe `.header-contact`-Pille (Owner 25.09.). Grund = Sand (`--color-surface-veil`, Papier-RGB bei 96 %, Owner 25.09.) — hebt die Leiste vom Browser ab. Links weight 500; Hover/aktiv = 2px-Ink-Unterstrich (scaleX). CTA = Lemon-Pill mit Ink-Pfeilkreis, Hover/Fokus invertiert (Desktop und Mobile-Menü teilen eine Regel). Inline-Navigation ab `--breakpoint-nav` 75rem (1200px bei Standard-Textgröße; größere Browserschrift übergibt ans Mobile-Menü), Sync mit js/01-header.js. |

## Bewusste Zwillinge (keine Duplikate)

- `.result-metric` (Karten-Kennzahl, klein) vs. `.page-hero__metric`
  (Lemon-Badge im Projekt-Hero) — unterschiedliche Rollen, bleiben getrennt.

## Pensioniert (Guard in tools/check-content.mjs)

page-eyebrow, page-kicker, page-display, page-title, page-cta__title,
display-hero, page-link, lede-boxes, portfolio-model, about-principles,
about-facts, expertise-proof, expertise-case-strip, header-careers,
mobile-menu__label, page-rule, case-* (außer case-facets).

## Kontrast-Nachweis (B-10, gemessen 2026-09-26)

`npm run contrast` misst jede Komponente in Ruhe, Hover, Fokus und gedrückt
gegen den tatsächlichen Grund (Vorfahren-Gründe und State-Layer
verrechnet) und scheitert unter WCAG AA (Text 4.5:1, groß 3:1; Grenzen
und Fokusring 3:1). Minimum über alle Zustände:

| Komponente | min. Text | min. Grenze | Fokusring |
| --- | --- | --- | --- |
| nav link | 13.91:1 | – | 17.25:1 |
| header CTA | 8.35:1 | – | 17.25:1 |
| mobile menu toggle | 13.91:1 | – | 17.25:1 |
| mobile menu link | 16.35:1 | – | – |
| mobile menu CTA | 8.35:1 | – | 19.43:1 |
| filter chip | 15.63:1 | 3.17:1 | – |
| filter chip selected | 6.86:1 | 19.43:1 | 19.43:1 |
| reference card | 19.43:1 | – | 19.43:1 |
| text link (light) | 15.63:1 | – | 19.43:1 |
| text link (on dark) | 15.61:1 | – | 19.43:1 |
| expander toggle | 13.84:1 | – | 17.16:1 |
| breadcrumb link (on dark) | 7.5:1 | – | 19.43:1 |
| breadcrumb link (light) | 15.63:1 | – | 19.43:1 |
| footer link | 7.5:1 | – | 19.43:1 |
| text field | 19.43:1 | 4.41:1 | 19.43:1 |
| form submit | 8.35:1 | – | 19.43:1 |
| expertise card | 15.61:1 | – | 19.43:1 |
| tag (static) | 19.43:1 | – | – |

## Vertragsvorlage (technical track, B-01)

Every component in the canon above gets one contract in this form
(English, so the agents in .claude/agents/ can fill it):

```
## <component-name>
- Purpose:
- Renderer: content/render.mjs -> <function> (or: static markup in <file>)
- CSS: styles/11-components.css -> .<block>
- Props (required):
- Props (optional):
- Slots:
- States: default, hover, focus-visible, active, disabled, error, success
- Variants:
- Accessibility: roles, aria, focus order, contrast checked
- Example call:
- Status: active / deprecated (replacement: ...)
```


## Verträge (B-01)

Contracts for the canon above, in the template's form. "Props" are renderer
arguments or the data fields a renderer reads; text always comes from the page
source or content/site-data.mjs (never from the renderer).

### page-hero
- Purpose: the one subpage hero frame (breadcrumb, eyebrow, H1, intro, photo).
- Renderer: content/render.mjs -> pageHero(); pages use `<page-hero …>` (assemble.mjs).
- CSS: styles/09-page-templates.css, 10-feedback.css -> .page-hero, __grid, __copy, __visual
- Props (required): id (the H1 id; labels the section), crumb (current label) or parent
- Props (optional): parent "href|label", modifier (e.g. portfolio-hero), figure-class, image (supplied key; omitted = no figure)
- Slots: copy = eyebrow + H1 + intro, authored in the page
- States: static. Variants: with/without figure; case-study figure carries .page-hero__metric
- Accessibility: section aria-labelledby = H1; one H1; hero image fetchpriority=high, never lazy
- Example call: `<page-hero id="karriere-title" crumb="Karriere" image="technology-team">…</page-hero>`
- Status: active

### breadcrumb
- Purpose: Startseite / [parent] / page; also feeds the BreadcrumbList JSON-LD.
- Renderer: breadcrumb(label, parent); pages use `<page-crumb label="…">`
- CSS: .page-breadcrumb (light and on-dark variants by section ground)
- Props: label (optional when a parent ends the trail), parent [href, label]
- States: rest, hover (lemon on dark; ink 2px underline on light), focus-visible, press
- Accessibility: links 44px tall via overhanging box; separator aria-hidden
- Status: active

### cta
- Purpose: the closing call to action of a page.
- Renderer: cta(name) from the `ctas` table; pages use `<!-- content:cta-<name> -->`; case studies use the default
- CSS: .page-cta, __copy (11-components.css / 10-feedback.css)
- Props: eyebrow (default "Ihr nächster Schritt"), title (HTML), copy (paragraphs), link (bool: contact text-link), id (labels the section)
- Variants: default, case-studies, portfolio, karriere (no link)
- Accessibility: section labelled by its H2 when id is set
- Status: active; hand-written CTAs rejected by check:content

### filter-chip
- Purpose: single-select toggle for the project filters (/branchen/, /case-studies/).
- Renderer: chip() inside filters(); JS js/06-work.js
- CSS: 11-components.css -> .filter-button, __check
- Props: group, value, label; the first chip of a group ("Alle") starts selected
- States: rest (3.17:1 outline), hover (15% lemon tint, unselected only), selected (lemon + ink outline + check), selected hover/press (state layer), focus-visible
- Accessibility: buttons with aria-pressed inside role=group; one Tab stop per group, Arrow/Home/End move; the filter bar is .js-only (without JS all projects show)
- Status: active

### reference-card
- Purpose: whole-card link to a case study.
- Renderer: projectCards(selection, filterable, collage)
- CSS: 10-feedback.css -> .reference-card, __copy, __meta; .result-metric
- Props (data): slug, name, headline, industry, discipline label, metric, label, image
- States: rest, hover/focus-visible = navy invert with --invert-bleed halo, press (state layer), image zoom 1.03 on hover
- Variants: grid, collage (mixed sizes), filterable (data-project attributes)
- Accessibility: one link per card; photo decorative (alt=""), the title names the link
- Status: active

### industry-tile
- Purpose: static industry content tile (owner 24.09: no link, no hover).
- Renderer: industryCards(); CSS: .industry-tile, __copy, __number
- Props (data): name, image, optional subline; States: static only
- Status: active

### company-facts
- Purpose: the one Kennzahlen row (home, about-us, karriere).
- Renderer: companyFacts() from companyFactData; CSS: .company-facts, __icon, __value
- Props (data): icon, value (final value in HTML), label
- States: static; countup animates only when motion is allowed (reads --duration-countup)
- Accessibility: dl/dt/dd; value text present without JS (gated)
- Status: active

### expander
- Purpose: the canonical "Mehr lesen" disclosure (management cards, job postings).
- CSS: 11-components.css -> .expander, __open, __close
- Slots: summary (open/close labels + screen-reader " – <name>"), body
- States: closed, open (+ rotates 45°), hover (state layer), focus-visible, press
- Accessibility: native details/summary; accessible name includes the item
- Status: active

### job-card / tag
- Purpose: job postings on /karriere/; .tag = static label (never the chip look).
- Renderer: jobsList() from `jobs`; CSS: .job-card, __meta, __text, __apply; .tag
- Props (data): slug, title, meta[], tagline, intro[], sections[], apply
- Slots: expander with the full posting, ending in the mailto application link
- Status: active

### text-field
- Purpose: the contact form's underline field (M3 filled field, no container).
- Markup: partials/contact-form.html; CSS: 11-components.css (Text field block)
- States: rest (4.41:1 underline), hover (muted underline), focus (lemon, 2px), error (--color-error-on-dark + supporting text), filled
- Accessibility: label per control, aria-describedby -> supporting text, aria-invalid; German messages from js/06-work.js; works without JS (native validation)
- Status: active

### state-layer (primitive)
- Purpose: the one hover/press overlay for clickables (::before, currentColor).
- CSS: 11-components.css; tokens --state-hover .08, --state-press .1, --state-inset
- States: hover only where no bespoke hover exists; press everywhere (press beats hover)
- Status: active

### trust-strip
- Purpose: the released certification labels (ISO 9001, ISO 37301, TISAX).
- Renderer: trustStrip() from `certifications`; `<!-- content:trust-strip -->`
- Status: active; hand-written strips rejected by check:content

### Remaining shared markup (by design, not duplicates)
- .eyebrow, .display-large, .text-link, .section-lede: primitive classes with page-specific text.
- .company-values: one CSS component, different content per page (about-us, portfolio).

### Shared frames (B-36)

#### page-section
- Purpose: the vertical section frame of every page (24/24).
- Markup: `<section class="page-section[ --paper| --dark| --deep]">` > `.gutter` > `.container`.
- CSS: 09-page-templates.css `.page-section` (padding-block `--spacing-section`), variants set the ground; --dark/--deep flip `color`, `--line-hairline` and `--accent-ink` for on-dark content.
- Props: variant (none = white, paper, dark, deep); optional id (anchor; scroll-margin clears the header, B-24); optional aria-labelledby (its H2).
- Accessibility: one H2 per section when it has a heading; on-dark text uses the --color-on-dark roles (>= 7.58:1).
- Status: active.

#### site-footer
- Purpose: the global footer (partials/footer.html), on every page.
- CSS: 08-editorial.css / 10-feedback.css `.site-footer`, `__top`, `__brand`, `__contact`, `__bottom`.
- Slots: brand (logo SVG + screen-reader name), two labelled navs, contact column, bottom row (copyright + legal links).
- States: links hover lemon, focus-visible ring, press (state layer).
- Accessibility: contentinfo landmark without a redundant label; every link >= 44px tall.
- Status: active. Known: copyright sits ~13px above the legal links' baseline (B-40).

#### reference-grid
- Purpose: the grid of reference cards.
- Renderer: projectCards(selection, filterable, collage).
- CSS: 10-feedback.css `.reference-grid`, `--collage` (12-column mixed sizes on desktop; stacks below `--breakpoint-stack`, spans reset via `:nth-child(n)`, B-25).
- Variants: default 2-up, collage (home), filterable (data-project attributes for js/06-work.js).
- Status: active.

#### section-more
- Purpose: the closing text link of a section (e.g. "Alle Referenzen"), 11 pages.
- CSS: `.section-more` wrapping one `.text-link`.
- Status: active.

#### legal-copy
- Purpose: long-form legal/info pages (Impressum, Datenschutz, Nutzungsbestimmungen, Cookies, Barrierefreiheit).
- CSS: 10-feedback.css `.legal-copy` (55rem measure; h2/h3/list/inline-link/table styles; `.legal-table` = labelled, focusable scroll region).
- Accessibility: tables scroll inside `role="region"` with a numbered aria-label and tabindex=0; inline links underlined.
- Status: active.

#### Smaller blocks
- **management-card** (about-us): renderer management(); photo (decorative, grayscale), name (h3), role, teaser; rest in `.expander`.
- **fact-grid** (portfolio 5-step model): hairline cell grid, `__label--display` digits with lemon rule; not for Kennzahlen.
- **discipline-table** (portfolio): renderer disciplineGrid(); `.discipline-cell` per discipline with its slug as id (B-27 anchor target).
- **connection-step** (home): icon chip (`--icon-lg`, `--color-info` on the "how" variant), h3, text.
- **portfolio-mode** (portfolio): number, h3, copy, outcome; ids optimieren/transformieren/skalieren/verzahnen.
- **work-filter / work-count / work-empty**: the filter bar (.js-only), live count, empty state with the contact route; see filter-chip.
