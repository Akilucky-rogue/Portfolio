# Akshat Vora — Portfolio

Live terminal-style portfolio. Dark/light tweakable, Bloomberg-inspired data aesthetic.

**Live:** `https://akilucky-rogue.github.io/portfolio/` *(once deployed)*

## Edit content

All content lives in `data.js` — edit plain JS objects:
- `PROFILE` — name, email, phone, tagline, links
- `METRICS` — 4 hero stats
- `EXPERIENCE` — internships (add to top of array)
- `PROJECTS` — 6 spotlighted projects
- `SKILLS`, `CERTS`, `EDUCATION`, `GH_REPOS`

Save → refresh. No build step.

Swap resume: replace `Akshat_Vora_Resume.pdf` with same filename.

## Deploy (GitHub Pages — 3 min)

1. Create repo `portfolio` on github.com → **Add README** → Create.
2. **"uploading an existing file"** → drag all files from the unzipped folder → commit.
3. **Settings → Pages** → Source: `main` branch, `/ (root)` → Save.
4. Wait ~60s. Live at `https://akilucky-rogue.github.io/portfolio/`

## Files

- `index.html` — entry point (same as Portfolio.html)
- `styles.css` — design system
- `data.js` — all content
- `ui.jsx` — shared components (Ticker, Crosshair, Sparkline, etc.)
- `sections.jsx` — page sections
- `Akshat_Vora_Resume.pdf` — downloadable CV
