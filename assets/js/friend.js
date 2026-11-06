(() => {
  const D = window.HM_DATA;
  const stage = document.getElementById("stage");
  const bar = document.getElementById("progress-bar");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const LIKERT = ["Strongly disagree", "Disagree", "Not sure", "Agree", "Strongly agree"];
  const KNOW = ["Barely", "A little", "Fairly well", "Well", "Very well"];
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const el = (html) => { const t = document.createElement("template"); t.innerHTML = html.trim(); return t.content.firstElementChild; };

  const raw = new URLSearchParams(location.search).get("n") || "";
  const name = raw.trim().slice(0, 30) || "your friend";
  const N = esc(name);
  const ans = new Array(D.observer.length).fill(null);
  let rel = null, know = null, idx = 0, busy = false, keyHandler = null;

  document.title = `How do you see ${name}? · Honest Mirror`;

  const mount = (node) => {
    keyHandler = null;
    const old = stage.querySelector(".screen");
    const place = () => { stage.replaceChildren(node); busy = false; node.querySelector("[data-focus]")?.focus({ preventScroll: true }); };
    if (old && !reduced) { old.classList.add("leaving"); setTimeout(place, 170); } else place();
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  };
  document.addEventListener("keydown", (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (/input|textarea|select/i.test(document.activeElement?.tagName || "")) return;
    keyHandler?.(e);
  });

  const total = D.observer.length + 1;
  const setBar = (i) => { bar.style.width = `${(i / total) * 100}%`; };

  const welcome = () => {
    setBar(0);
    const node = el(`<div class="screen">
      <h1 class="screen-title" tabindex="-1" data-focus>${N} wants to know how you honestly see them.</h1>
      <p class="screen-lead">They took a self-reflection test about traits like defensiveness, control, and empathy. Your view shows them what they might miss.</p>
      <ul class="rows" style="margin:24px 0 32px">
        <li><h3>Be honest, not nice.</h3><p>A kind lie won't help them. A fair answer will.</p></li>
        <li><h3>It's private.</h3><p>Nothing you enter is sent anywhere. At the end you get a short code, and you choose whether to send it.</p></li>
        <li><h3>They see a combined result.</h3><p>Not your individual answers. With only one or two people, though, they may be able to guess.</p></li>
        <li><h3>About 3 minutes.</h3><p>16 short statements.</p></li>
      </ul>
      <div class="field"><label for="rel">How do you know ${N}?</label><select id="rel"><option value="">Choose one</option>${D.relations.map((r, i) => `<option value="${i}">${esc(r)}</option>`).join("")}</select></div>
      <div class="field"><label>How well do you know them?</label><div class="likert" role="radiogroup" aria-label="How well do you know them">${KNOW.map((k, i) => `<button type="button" class="opt" role="radio" aria-checked="false" data-know="${i + 1}"><span class="dot"></span>${k}</button>`).join("")}</div></div>
      <div class="q-actions"><span></span><button class="btn" data-start disabled>Begin</button></div>
    </div>`);
    const sel = node.querySelector("#rel");
    const start = node.querySelector("[data-start]");
    const check = () => { start.disabled = !(sel.value !== "" && know); };
    if (rel != null) sel.value = String(rel);
    sel.addEventListener("change", () => { rel = sel.value === "" ? null : +sel.value; check(); });
    node.querySelectorAll("[data-know]").forEach((b) => {
      if (+b.dataset.know === know) b.setAttribute("aria-checked", "true");
      b.addEventListener("click", () => {
        know = +b.dataset.know;
        node.querySelectorAll("[data-know]").forEach((x) => x.setAttribute("aria-checked", String(x === b)));
        check();
      });
    });
    check();
    start.addEventListener("click", () => { idx = 0; question(); });
    mount(node);
  };

  const question = () => {
    setBar(idx + 1);
    const it = D.observer[idx];
    const text = it.t.replaceAll("{n}", name);
    const node = el(`<div class="screen">
      <div class="q-kicker"><span>About ${N} · ${idx + 1} of ${D.observer.length}</span></div>
      <h2 class="q-text" tabindex="-1" data-focus>${esc(text)}</h2>
      <div class="likert" role="radiogroup" aria-label="Your answer">${LIKERT.map((l, i) => `<button type="button" class="opt" role="radio" aria-checked="${ans[idx] === i + 1}" data-opt data-v="${i + 1}"><span class="dot"></span>${l}</button>`).join("")}</div>
      <div class="q-actions"><button type="button" class="linkish" data-back><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M15 18l-6-6 6-6"/></svg>Back</button><span class="tag">Keys 1 2 3 4 5</span></div>
    </div>`);
    node.querySelectorAll("[data-v]").forEach((b) => b.addEventListener("click", () => {
      if (busy) return;
      busy = true;
      ans[idx] = +b.dataset.v;
      node.querySelectorAll("[data-v]").forEach((x) => x.setAttribute("aria-checked", String(x === b)));
      setTimeout(() => { idx++; idx >= D.observer.length ? done() : question(); }, reduced ? 50 : 240);
    }));
    node.querySelector("[data-back]").addEventListener("click", () => { if (idx === 0) welcome(); else { idx--; question(); } });
    keyHandler = (e) => {
      const n = "12345".indexOf(e.key);
      if (n >= 0) { node.querySelectorAll("[data-opt]")[n].click(); e.preventDefault(); }
      else if (e.key === "Backspace") { node.querySelector("[data-back]").click(); e.preventDefault(); }
    };
    mount(node);
  };

  const done = () => {
    setBar(total);
    const digits = `${rel}${know}${ans.join("")}`;
    const chk = ([...digits].reduce((a, c) => a + +c, 0) % 36).toString(36);
    const code = `HM1-${rel}${know}-${ans.join("")}-${chk}`;
    const node = el(`<div class="screen">
      <h1 class="screen-title" tabindex="-1" data-focus>Send this code back to ${N}.</h1>
      <p class="screen-lead">They'll paste it into their results to compare how they see themselves with how you see them. The code holds only your answers and how you know them. No names.</p>
      <div class="code-out big">${code}</div>
      <div class="row"><button class="btn" data-copy>Copy code</button>${navigator.share ? `<button class="btn ghost" data-share>Share</button>` : ""}</div>
      <div class="callout" style="margin-top:40px">
        <h3>Curious about yourself?</h3>
        <p>The same test is free and private, and takes 15 to 20 minutes.</p>
        <p style="margin-top:14px"><a class="btn small" href="../test/">Take the test</a></p>
      </div>
      <p class="fine" style="margin-top:24px">If these questions brought up worries about your own safety in this relationship, you can talk to someone confidentially at the <a href="https://www.thehotline.org/" target="_blank" rel="noopener">National Domestic Violence Hotline</a>, or find a line near you at <a href="https://findahelpline.com/" target="_blank" rel="noopener">findahelpline.com</a>.</p>
    </div>`);
    node.querySelector("[data-copy]").addEventListener("click", async () => {
      try { await navigator.clipboard.writeText(code); window.HM.toast("Code copied"); } catch (_) { window.HM.toast("Select the code and copy it"); }
    });
    node.querySelector("[data-share]")?.addEventListener("click", () => navigator.share({ text: `Here's my Honest Mirror code for you: ${code}` }).catch(() => {}));
    mount(node);
  };

  welcome();
})();
