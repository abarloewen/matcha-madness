# Matcha Madness — Website

Premium, multilingual website for **Matcha Madness** — mobile matcha catering in Köln, Bonn, Düsseldorf, Leverkusen & Bergisch-Gladbach. A complete redesign and expansion of the original [matchakoeln.de](https://www.matchakoeln.de), built by **Ummah Collective**.

## Highlights

- **13 pages** — Home, Anlässe (occasions), Ablauf (how it works), Pakete & Preise, Galerie, Über uns, Testimonials, FAQ, Buchen (booking wizard), Kontakt, Blog, Impressum, Datenschutz.
- **7 languages** with a live switcher and automatic right-to-left for Arabic: 🇩🇪 Deutsch · 🇬🇧 English · 🇸🇦 العربية · 🇹🇷 Türkçe · 🇧🇦 Bosanski · 🇦🇱 Shqip · 🇫🇷 Français.
- **Multi-step booking wizard** — package → flavors → event details → contact → summary, with a live (non-binding) price estimate. Demo only: no payment, no data is transmitted.
- **Original brand identity retained** — the company's real photos, colours (espresso brown + warm creams) and fonts (Libre Baskerville + Almarai), extended with a refined matcha-green accent system.
- **Zero build step** — pure HTML/CSS/JS. Works on any static host.

## Run locally

Because the pages load shared scripts, open them through a local server (not `file://`):

```bash
cd matchakoeln
python3 -m http.server 8080
# then open http://localhost:8080
```

## Project structure

```
matchakoeln/
├── index.html, anlaesse.html, ablauf.html, pakete-preise.html,
│   galerie.html, ueber-uns.html, testimonials.html, faq.html,
│   buchen.html, kontakt.html, blog.html, impressum.html, datenschutz.html
├── assets/
│   ├── css/styles.css            # design system
│   └── js/
│       ├── components.js         # shared header + footer (injected)
│       ├── i18n.js               # language engine (RTL, persistence)
│       ├── translations.js       # 7-language dictionary (384 keys each)
│       ├── main.js               # nav, scroll-reveal, FAQ, lightbox
│       ├── booking.js            # booking wizard
│       └── i18n-data/            # per-language source JSON (build inputs)
├── localize-images.js           # optional: download images for self-hosting
├── .nojekyll                     # for GitHub Pages
└── 404.html
```

## How translations work

German is the source language and lives directly in the HTML markup (great for SEO and as a no-JS fallback). On load, `i18n.js` harvests the German text from the DOM, then `translations.js` supplies the other six languages. To edit copy, change the German in the HTML and the matching values in `assets/js/i18n-data/<lang>.json`, then rebuild `translations.js` (see below).

Rebuild the combined dictionary after editing any `i18n-data/*.json`:

```bash
node -e 'const fs=require("fs");const L=["de","en","ar","tr","bs","sq","fr"];const f={de:"master_de.json"};const d={};L.forEach(l=>d[l]=JSON.parse(fs.readFileSync("assets/js/i18n-data/"+(f[l]||l+".json"))));fs.writeFileSync("assets/js/translations.js","window.I18N = "+JSON.stringify(d)+";")'
```

## Images

The site currently references the client's **original photos** straight from their Squarespace CDN, so it shows the real imagery immediately with no copies. For a fully self-contained deployment (recommended before going live), download the images locally:

```bash
node localize-images.js
```

This downloads every referenced image into `assets/img/` and rewrites the HTML to use local paths.

## Deploy

**GitHub Pages** — push this folder to a repo, then Settings → Pages → deploy from `main` / root. The included `.nojekyll` ensures `assets/` is served correctly.

**Vercel / Netlify** — import the repo (or drag-and-drop the folder). No build command, output directory = root.

---

© Matcha Madness · Site by [Ummah Collective](https://www.ummah-collective.com)
