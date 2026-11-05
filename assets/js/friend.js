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
      <p class="eyebrow">A private request</p>
      <h1 class="q-text" tabindex="-1" data-focus style="font-size:clamp(1.9rem,4vw,2.7rem)">${N} wants to know how you honestly see them.</h1>
      <p style="color:var(--ink-2)">They took a self-reflection test about traits like defensiveness, control, and empathy. Your view helps them see what they might miss about themselves.</p>
      <ul class="list-check" style="margin:22px 0 28px">
        <li><strong>Be honest, not nice.</strong> A kind lie won't help them. A fair, honest answer will.</li>
        <li><strong>It's private.</strong> Nothing you enter is sent anywhere. At the end you'll get a short code, and you choose whether to send it.</li>
        <li><strong>They'll see a combined result</strong>, not your individual answers. With only one or two people, though, they may be able to guess.</li>
        <li><strong>About 3 minutes</strong> and 16 short statements.</li>
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
      <p class="eyebrow">Thank you</p>
      <h1 class="q-text" tabindex="-1" data-focus style="font-size:clamp(1.9rem,4vw,2.6rem)">Send this code back to ${N}.</h1>
      <p style="color:var(--ink-2)">They'll paste it into their results page to compare how they see themselves with how you see them. The code holds only your 16 answers. No names, and nothing else.</p>
      <div class="code-out" style="font-size:1.05rem;margin:22px 0">${code}</div>
      <div class="row"><button class="btn" data-copy>Copy code</button>${navigator.share ? `<button class="btn ghost" data-share>Share…</button>` : ""}</div>
      <div class="callout" style="margin-top:34px">
        <h3>Curious about yourself?</h3>
        <p>The same in-depth reflection test is free for you too. It's private and takes about 15 minutes.</p>
        <p style="margin-top:12px"><a class="btn small" href="../test/">Take the test</a></p>
      </div>
      <p style="color:var(--muted);font-size:.9rem;margin-top:24px">If answering these questions brought up worries about your own safety in this relationship, you can talk to someone confidentially at the <a href="https://www.thehotline.org/" target="_blank" rel="noopener">National Domestic Violence Hotline</a> or find a line near you at <a href="https://findahelpline.com/" target="_blank" rel="noopener">findahelpline.com</a>.</p>
    </div>`);
    node.querySelector("[data-copy]").addEventListener("click", async () => {
      try { await navigator.clipboard.writeText(code); window.HM.toast("Code copied"); } catch (_) { window.HM.toast("Select the code and copy it"); }
    });
    node.querySelector("[data-share]")?.addEventListener("click", () => navigator.share({ text: `Here's my Honest Mirror code for you: ${code}` }).catch(() => {}));
    mount(node);
  };

  welcome();
})();
