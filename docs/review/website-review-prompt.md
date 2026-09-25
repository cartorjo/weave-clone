# Website review: benchmark vs. Emposo (technical track)

Role: you are the site-coordinator. Run a fresh benchmark review of structure,
interaction, components, metadata, accessibility and performance, then update
docs/review/benchmark-patterns.md and docs/backlog.md. Copy, messaging and
content strategy are out of scope: do not evaluate or propose text (npm run
check enforces it with check:copy).

Inputs
- Benchmark: https://www.mckinsey.com plus, if reachable: /featured-insights,
  /industries and one service-line page, /capabilities, /careers/home,
  /about-us/overview, /contact-us, and 2-3 article pages linked from the homepage.
- Own site: the local build (npm run build:dist, then read dist/; npm run smoke
  against the dev server) and, if reachable, https://weave-clone-production.up.railway.app.
- Previous findings: docs/review/benchmark-patterns.md, docs/backlog.md,
  docs/components.md.

Steps
1. Delegate benchmark analysis:
   - ux-ia-architect: navigation model, URL structure, page templates, section
     order, card and CTA patterns, interaction states, link map. Evidence: URL
     plus verbatim heading or structure.
   - design-system-engineer: visible component system (card, tile, hero,
     section, CTA, breadcrumb, footer), spacing rhythm, type scale, states.
   - seo-specialist: head tags, title patterns, canonical, OG/Twitter, share
     images, JSON-LD, robots, sitemap, hreflang.
   - a11y-perf-reviewer: skip link, landmarks, heading hierarchy, alt usage,
     focus styles, motion handling, image delivery, script loading.
2. Delegate own-site inspection of dist/ to the same four agents with the same
   checklists.
3. Merge into docs/review/benchmark-patterns.md with sections: IA and
   navigation, Templates, Components, CTAs and forms, Metadata and structured
   data, Accessibility, Performance, Mobile. Mark each finding NEW, CHANGED or
   UNCHANGED versus the previous version, with date, and list benchmark
   anti-patterns separately.
4. Update docs/backlog.md: re-rank (impact x effort), close done items with
   commit hash, add new items with rationale, acceptance criteria, effort and
   agent sequence. Text gaps go to "Later / owner decisions" as NEEDS-OWNER.
5. Output a summary: top 5 changes since the last review, backlog diff, open
   owner decisions.

Rules
- Evidence or it did not happen: every finding cites a URL or a repo path.
- If a page cannot be fetched, say so and continue; never invent structure.
- Patterns only: never copy benchmark markup, images, colors or wording.
- Characters: straight quotes, hyphens, "..." only.
