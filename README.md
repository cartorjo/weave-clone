# Emposo website

An editorial, work-first static site for Emposo — the Outcome Factory of the
Hays Group. It uses the supplied Emposo corporate-design manual, logo assets,
project material and image library.

## Run locally

```bash
npm run dev
```

Open the local address printed by the server. For a one-off production build:

```bash
npm run build
```

## Structure

- `sections/` — ordered HTML fragments assembled into `index.html`
- `styles/08-editorial.css` — the custom editorial visual system
- `js/06-work.js` — local project filters and contact-form mail client fallback
- `assets/brand/` — supplied Emposo logos and curated source imagery

The contact form intentionally prepares a `mailto:` message: no form backend
or visitor data processor has been configured yet.
