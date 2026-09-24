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
  Countup-JS: 900ms (js/07-countup.js, bindet `.company-facts__value`).
- **Hover-Policy:** Hover nur auf Klickbarem. Alle Hover-Regeln in
  `@media (hover: hover)`, jeweils mit ungegatetem `:focus-visible`-Zwilling.
  Kein font-weight-Wechsel im Hover (Reflow). Navy-Box-Bleed auf Karten
  einheitlich 1.1rem.
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
| CTA | `.page-cta` via `cta()` in content/render.mjs | Eyebrow immer „Ihr nächster Schritt“; handgeschriebene CTAs (karriere, portfolio, case-studies) folgen exakt derselben Form. |
| Referenzkarte | `.reference-card` | Navy-Box-Hover (320ms), Bild-Zoom 560ms/1.03, Pfeil-Slide .35rem. |
| Branchen-Kachel | `.industry-tile` | EIN Verhalten überall (Owner 24.09., zweiter Entscheid am selben Tag): statische Inhaltskachel — kein Link, kein Pfeil, kein Hover, da die Branchen-Unterseiten entfernt wurden. Bild, Nummer, Name, optionale Subline. |
| Management-Karte | `.management-card`, `__more`, `__facts` | Foto (grayscale, kein Hover), Name, Rolle, 48-Wort-Teaser; Fakten + Rest-Bio + LinkedIn im `<details>`-Expander. |
| Kennzahlen | `.company-facts`, `__icon`, `__value` — NUR via `companyFacts()` in content/render.mjs (`content:company-facts`) | EINE homogene Zahlenreihe mit EINEM Inhalt (Owner 24.09., Startseiten-Version ist die Referenz): 2014 / 250+ / 2.900+ / 4, identisch auf Startseite, Über-uns und Karriere. Werte, Icons und Labels leben einmal in `companyFactData` — Markup nie von Hand schreiben, Labels nie pro Seite forken. Nicht klickbar → kein Hover. |
| Standorte | `partials/locations-map.html`, `partials/location-list.html` | Byte-identische Blöcke, einmal definiert (karriere + kontakt). |
| Header/Menü | `.site-nav`, `.header-contact`, `.mobile-menu` | Links weight 500; Hover/aktiv = 2px-Ink-Unterstrich (scaleX). CTA = Lemon-Pill mit Ink-Pfeilkreis, Hover invertiert. 1280px-Sync mit js/01-header.js. |

## Bewusste Zwillinge (keine Duplikate)

- `.result-metric` (Karten-Kennzahl, klein) vs. `.page-hero__metric`
  (Lemon-Badge im Projekt-Hero) — unterschiedliche Rollen, bleiben getrennt.

## Pensioniert (Guard in tools/check-content.mjs)

page-eyebrow, page-kicker, page-display, page-title, page-cta__title,
display-hero, page-link, lede-boxes, portfolio-model, about-principles,
about-facts, expertise-proof, expertise-case-strip, header-careers,
mobile-menu__label, page-rule, case-* (außer case-facets).
