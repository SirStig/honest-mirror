(() => {
  const root = document.documentElement;

  const syncTheme = () => {
    const light = root.dataset.theme === "light";
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = light ? "#f5f4f0" : "#0f1a1e";
    document.querySelector("[data-theme-toggle]")?.setAttribute("aria-label", light ? "Switch to dark theme" : "Switch to light theme");
  };
  if (!root.dataset.theme) root.dataset.theme = "dark";
  syncTheme();
  document.querySelector("[data-theme-toggle]")?.addEventListener("click", () => {
    root.dataset.theme = root.dataset.theme === "light" ? "dark" : "light";
    try { localStorage.setItem("hm-theme", root.dataset.theme); } catch (_) {}
    syncTheme();
  });

  window.HM = window.HM || {};
  window.HM.toast = (msg) => {
    let t = document.querySelector(".toast");
    if (!t) {
      t = document.createElement("div");
      t.className = "toast";
      t.setAttribute("role", "status");
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(t._h);
    t._h = setTimeout(() => t.classList.remove("show"), 2400);
  };
})();
