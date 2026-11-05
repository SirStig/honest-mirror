(() => {
  const root = document.documentElement;
  root.classList.remove("no-js");

  const themeBtn = document.querySelector("[data-theme-toggle]");
  const setTheme = (t) => {
    root.dataset.theme = t;
    try { localStorage.setItem("hm-theme", t); } catch (_) {}
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = t === "dark" ? "#121117" : "#f7f4ee";
  };
  themeBtn?.addEventListener("click", () => setTheme(root.dataset.theme === "dark" ? "light" : "dark"));

  const nav = document.querySelector(".nav");
  const navBtn = document.querySelector(".nav-toggle");
  navBtn?.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    navBtn.setAttribute("aria-expanded", String(open));
  });

  const revealables = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      }
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    revealables.forEach((el) => io.observe(el));
  } else {
    revealables.forEach((el) => el.classList.add("in"));
  }

  document.querySelectorAll("[data-year]").forEach((el) => { el.textContent = new Date().getFullYear(); });

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
