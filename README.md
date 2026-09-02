# aaron-portfolio

Static terminal-style portfolio. No build step, no dependencies.

## Run in VS Code

Serve it over http (not `file://`) so fonts and canvas sampling behave.

Option A — Live Server extension (easiest):
1. Open this folder in VS Code.
2. Install the "Live Server" extension (Ritwick Dey) if you don't have it.
3. Right-click `index.html` -> "Open with Live Server".

Option B — one command, no extension:
```bash
cd aaron-portfolio
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
```

## Fill these in
- `index.html`: linkedin / github / resume hrefs (search `YOUR-HANDLE`), and the `#` project links.
- Screenshots: the `.shot` tiles are placeholders. Replace each with
  `<img src="assets/...">` inside the `.gallery` div, or restyle `.shot` in CSS.
- Drop your resume at `assets/resume.pdf`.
- EXPERIENCE and HACKATHONS have `[ADD ...]` placeholders.

## Tuning
- Name text: `NAME` in `js/particles.js`.
- Particle density: `SAMPLE_GAP` (lower = denser, heavier).
- Cursor scatter: `MOUSE_RADIUS`, `MOUSE_FORCE`.
- Sidebar character set / motion: `RAMP` and the frequency/bias in `js/ascii.js`.
- Colors: the `:root` and `html[data-theme="light"]` blocks in `css/styles.css`.
