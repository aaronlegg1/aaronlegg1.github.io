# personal_website

Static terminal-style portfolio for Aaron Legg. No build step, no dependencies.
Deployed via GitHub Pages.

## Run locally

Serve over http (not `file://`) so fonts and canvas pixel-sampling behave.

Option A — Live Server extension (easiest):
1. Open this folder in VS Code.
2. Install the "Live Server" extension (Ritwick Dey).
3. Right-click `index.html` -> "Open with Live Server".

Option B — one command, no extension:
```bash
python3 -m http.server 8000
```
Then open http://localhost:8000

## Structure
```
index.html        content + accordion sections
css/styles.css    theme tokens, typography, layout
js/particles.js   name particle animation (Canvas)
js/ascii.js       generative ASCII sidebar (value noise)
js/main.js        light/dark toggle
assets/og.png     link-preview card (1200x630)
assets/resume.pdf resume linked from the hero nav
```

## Deploy
Pushing to `main` publishes automatically via GitHub Pages
(Settings -> Pages -> Source: Deploy from a branch -> `main` / `root`).

```bash
git add -A && git commit -m "..." && git push
```

## Still to fill in
- LinkedIn href in `index.html` (search `YOUR-HANDLE`).
- `assets/resume.pdf` — not committed yet; the hero link 404s until it is.
- `[ADD YOUR ROLE]` internship and `[ADD HACKATHON]` placeholders.
- Project links still on `href="#"`: Kalshi, Dual-Class, UFC, VocaLedger.
- Screenshots: `.shot` tiles are CSS placeholders. Replace each with
  `<img src="assets/...">` inside the `.gallery` div.

## Tuning
- Name text: `NAME` in `js/particles.js`.
- Particle density: `SAMPLE_GAP` (lower = denser, heavier).
- Cursor scatter: `MOUSE_RADIUS`, `MOUSE_FORCE`.
- Sidebar character set / motion: `RAMP` and the frequency/bias in `js/ascii.js`.
- Colors: the `:root` and `html[data-theme="light"]` blocks in `css/styles.css`.
