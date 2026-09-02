/* Theme toggle: persists to localStorage, defaults to system preference. */

(function () {
  const root = document.documentElement;
  const btn = document.getElementById("theme-toggle");

  function apply(theme) {
    root.setAttribute("data-theme", theme);
    // Label shows the theme you can switch TO.
    if (btn) btn.textContent = theme === "dark" ? "[light]" : "[dark]";
    if (typeof window.__recolorName === "function") window.__recolorName();
  }

  function initial() {
    const saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "dark") return saved;
    const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
    return prefersLight ? "light" : "dark";
  }

  apply(initial());

  if (btn) {
    btn.addEventListener("click", () => {
      const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      localStorage.setItem("theme", next);
      apply(next);
    });
  }
})();
