# Komponenten-Kanon

Stand: 24.09.2026 (Konsolidierungs-Pass). Kanonische Klassen leben in
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
  Modifier im Kanon, keine Parallel-Implementierungen.

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
| Referenzkarte | `.reference-card` | Navy-Box-Hover (320ms), Bild-Zoom 560ms/1.03, Pfeil-Slide .35rem. |
| Branchen-Kachel | `.industry-tile` | EIN Verhalten überall (Owner 24.09., zweiter Entscheid am selben Tag): statische Inhaltskachel — kein Link, kein Pfeil, kein Hover, da die Branchen-Unterseiten entfernt wurden. Bild, Nummer, Name, optionale Subline. |
| Expander | `.expander`, `__open`, `__close` | DER kanonische `<details>`-Expander (Mehr-lesen-Muster): Open/Close-Label-Spans, rotierendes Lemon-Plus. Konsumenten: Management-Karten, Stellenausschreibungen. Ersetzt management-card__more. |
| Management-Karte | `.management-card` | Foto (grayscale, kein Hover), Name, Rolle, 48-Wort-Teaser; Rest-Bio + LinkedIn im `.expander`. |
| Stellenausschreibung | `.job-list`, `.job-card`, `__meta`, `__tagline`, `__text` (+ `.result-list--compact`) | Karriere-Stellen aus `jobs` in site-data.mjs via `jobsList()` (`content:jobs`): Titel, statische Meta-Tags (`.tag`: weiß gefüllt, ohne Outline — nie im Chip-Look), Tagline, erster Absatz sichtbar; volle Ausschreibung im `.expander`, KEIN Bewerben-Link (Owner 25.09.: Karriere ohne CTAs). Owner-Copy wörtlich, keine Unterseiten. |
| Kennzahlen | `.company-facts`, `__icon`, `__value` — NUR via `companyFacts()` in content/render.mjs (`content:company-facts`) | EINE homogene Zahlenreihe mit EINEM Inhalt (Owner 24.09., Startseiten-Version ist die Referenz): 2014 / 250+ / 2.900+ / 4, identisch auf Startseite, Über-uns und Karriere. Werte, Icons und Labels leben einmal in `companyFactData` — Markup nie von Hand schreiben, Labels nie pro Seite forken. Nicht klickbar → kein Hover. |
| Header/Menü | `.site-nav`, `.header-contact`, `.mobile-menu` | Der Formular-Submit auf /kontakt/ ist dieselbe `.header-contact`-Pille (Owner 25.09.). Grund = Sand (`--color-surface-veil`, Papier-RGB bei 96 %, Owner 25.09.) — hebt die Leiste vom Browser ab. Links weight 500; Hover/aktiv = 2px-Ink-Unterstrich (scaleX). CTA = Lemon-Pill mit Ink-Pfeilkreis, Hover/Fokus invertiert (Desktop und Mobile-Menü teilen eine Regel). Inline-Navigation ab `--breakpoint-nav` 75rem (1200px bei Standard-Textgröße; größere Browserschrift übergibt ans Mobile-Menü), Sync mit js/01-header.js. |

## Bewusste Zwillinge (keine Duplikate)

- `.result-metric` (Karten-Kennzahl, klein) vs. `.page-hero__metric`
  (Lemon-Badge im Projekt-Hero) — unterschiedliche Rollen, bleiben getrennt.

## Pensioniert (Guard in tools/check-content.mjs)

page-eyebrow, page-kicker, page-display, page-title, page-cta__title,
display-hero, page-link, lede-boxes, portfolio-model, about-principles,
about-facts, expertise-proof, expertise-case-strip, header-careers,
mobile-menu__label, page-rule, case-* (außer case-facets).

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

