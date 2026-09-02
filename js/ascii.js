/* Generative ASCII sidebar.
   Builds a character grid and animates a scrolling value-noise field,
   mapping each cell's noise value onto a density ramp. No dependencies. */

(function () {
  const el = document.getElementById("ascii");
  if (!el) return;

  const RAMP = " .:-=+*|#%@";
  const reduceMotion =
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let cols = 0;
  let rows = 0;
  let raf = null;
  let t = 0;

  // --- cheap 2D value noise (hash + smooth interpolation) ---
  function hash(x, y) {
    let h = x * 374761393 + y * 668265263;
    h = (h ^ (h >> 13)) * 1274126177;
    return ((h ^ (h >> 16)) >>> 0) / 4294967295;
  }
  function smooth(a, b, w) {
    const t = w * w * (3 - 2 * w);
    return a + (b - a) * t;
  }
  function valueNoise(x, y) {
    const xi = Math.floor(x), yi = Math.floor(y);
    const xf = x - xi, yf = y - yi;
    const tl = hash(xi, yi), tr = hash(xi + 1, yi);
    const bl = hash(xi, yi + 1), br = hash(xi + 1, yi + 1);
    return smooth(smooth(tl, tr, xf), smooth(bl, br, xf), yf);
  }

  function measure() {
    // Derive grid size from the rendered box and font metrics.
    const rect = el.getBoundingClientRect();
    if (rect.width < 4) { cols = rows = 0; return; }
    const cs = getComputedStyle(el);
    const fs = parseFloat(cs.fontSize) || 12;
    const lh = parseFloat(cs.lineHeight) || fs * 1.05;
    const charW = fs * 0.6; // monospace advance approximation
    cols = Math.max(4, Math.floor((rect.width - 6) / charW));
    rows = Math.max(4, Math.floor(rect.height / lh));
  }

  function draw() {
    if (cols === 0) return;
    let out = "";
    const fx = 0.14, fy = 0.10; // field frequency
    for (let y = 0; y < rows; y++) {
      let line = "";
      for (let x = 0; x < cols; x++) {
        // two octaves for a bit of structure
        let v =
          valueNoise(x * fx, y * fy + t) * 0.65 +
          valueNoise(x * fx * 2.3, y * fy * 2.3 - t * 1.7) * 0.35;
        // bias toward emptiness so the field reads as sparse, like the reference
        v = Math.pow(v, 1.7);
        const idx = Math.min(RAMP.length - 1, Math.floor(v * RAMP.length));
        line += RAMP[idx];
      }
      out += line + "\n";
    }
    el.textContent = out;
  }

  function loop() {
    t += 0.012;
    draw();
    raf = requestAnimationFrame(loop);
  }

  function start() {
    measure();
    if (reduceMotion) {
      draw();
    } else {
      if (raf) cancelAnimationFrame(raf);
      loop();
    }
  }

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(start, 150);
  });

  window.addEventListener("load", start);
})();
