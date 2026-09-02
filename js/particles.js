/* Particle name animation.
   Renders "AARON LEGG" to an offscreen canvas, samples its opaque pixels,
   and turns each sampled point into a particle that eases to its target
   position and scatters away from the cursor. */

(function () {
  const canvas = document.getElementById("name-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  const NAME = "AARON LEGG";
  const SAMPLE_GAP = 4;      // px between sampled points (lower = denser)
  const SPRING = 0.045;      // homing force toward target
  const FRICTION = 0.86;     // velocity damping
  const MOUSE_RADIUS = 70;   // repel radius around cursor
  const MOUSE_FORCE = 2.2;

  const reduceMotion =
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let particles = [];
  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  let mouse = { x: -9999, y: -9999 };
  let raf = null;

  function fgColor() {
    return getComputedStyle(document.documentElement)
      .getPropertyValue("--fg").trim() || "#e9e2d0";
  }

  function buildTargets() {
    const rect = canvas.getBoundingClientRect();
    const w = Math.max(1, Math.floor(rect.width));
    const h = Math.max(1, Math.floor(rect.height));

    // Set the visible canvas resolution.
    canvas.width = w * dpr;
    canvas.height = h * dpr;

    // Offscreen render of the text for pixel sampling.
    const off = document.createElement("canvas");
    off.width = w;
    off.height = h;
    const octx = off.getContext("2d");

    // Fit the font size to the width.
    let font = Math.floor(h * 0.72);
    octx.textBaseline = "middle";
    octx.textAlign = "left";
    const setFont = (s) => (octx.font = `700 ${s}px "Space Mono", monospace`);
    setFont(font);
    while (octx.measureText(NAME).width > w * 0.98 && font > 8) {
      font -= 2;
      setFont(font);
    }
    const textW = octx.measureText(NAME).width;
    const startX = Math.max(0, (w - textW) / 2);

    octx.fillStyle = "#fff";
    octx.fillText(NAME, startX, h / 2);

    const data = octx.getImageData(0, 0, w, h).data;
    const targets = [];
    for (let y = 0; y < h; y += SAMPLE_GAP) {
      for (let x = 0; x < w; x += SAMPLE_GAP) {
        const alpha = data[(y * w + x) * 4 + 3];
        if (alpha > 128) targets.push({ x, y });
      }
    }

    // Reuse existing particles where possible so a resize doesn't reset everything.
    const next = targets.map((t, i) => {
      const p = particles[i] || {
        x: Math.random() * w,
        y: Math.random() * h,
        vx: 0,
        vy: 0,
      };
      p.tx = t.x;
      p.ty = t.y;
      return p;
    });
    particles = next;
    return { w, h };
  }

  function frame() {
    const w = canvas.width / dpr;
    const h = canvas.height / dpr;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = fgColor();

    for (const p of particles) {
      // Homing toward target.
      p.vx += (p.tx - p.x) * SPRING;
      p.vy += (p.ty - p.y) * SPRING;

      // Cursor repulsion.
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const dist = Math.hypot(dx, dy);
      if (dist < MOUSE_RADIUS && dist > 0.01) {
        const push = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
        p.vx += (dx / dist) * push * MOUSE_FORCE;
        p.vy += (dy / dist) * push * MOUSE_FORCE;
      }

      p.vx *= FRICTION;
      p.vy *= FRICTION;
      p.x += p.vx;
      p.y += p.vy;

      ctx.fillRect(p.x, p.y, 1.6, 1.6);
    }

    raf = requestAnimationFrame(frame);
  }

  function renderStatic() {
    // Reduced-motion: draw particles straight at their targets, once.
    const w = canvas.width / dpr;
    const h = canvas.height / dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = fgColor();
    for (const p of particles) ctx.fillRect(p.tx, p.ty, 1.6, 1.6);
  }

  function start() {
    buildTargets();
    if (reduceMotion) {
      renderStatic();
    } else {
      // Kick particles in from scattered positions on load.
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      for (const p of particles) {
        p.x = Math.random() * w;
        p.y = Math.random() * h;
      }
      if (raf) cancelAnimationFrame(raf);
      frame();
    }
  }

  // Track cursor in canvas space.
  canvas.addEventListener("pointermove", (e) => {
    const r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left;
    mouse.y = e.clientY - r.top;
  });
  canvas.addEventListener("pointerleave", () => {
    mouse.x = mouse.y = -9999;
  });

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      buildTargets();
      if (reduceMotion) renderStatic();
    }, 150);
  });

  // Re-color on theme change without rebuilding geometry.
  window.__recolorName = () => {
    if (reduceMotion) renderStatic();
  };

  // Wait for the display font so sampled glyph shapes are correct.
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(start);
  } else {
    window.addEventListener("load", start);
  }
})();
