(() => {
  const D = window.HM_DATA;
  const KEY = "hm-state-v1";
  const FKEY = "hm-friends-v1";
  const SPEAK_KEY = "hm-speak";
  const stage = document.getElementById("stage");
  const progressShell = document.getElementById("progress");
  const progressBar = document.getElementById("progress-bar");
  const progressMod = document.getElementById("progress-mod");
  const progressCount = document.getElementById("progress-count");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const SHORT = { grand: "Grandiosity", ent: "Entitlement", vuln: "Fragile worth", emp: "Empathy gap", acct: "Defensiveness", manip: "Manipulation", ctrl: "Control", self: "Self-focus" };
  const LIKERT = ["Strongly disagree", "Disagree", "Not sure", "Agree", "Strongly agree"];
  const FREQ = ["Never", "Once or twice", "A few times", "Often"];
  const FAM = ["Never heard of it", "Heard the name", "Could explain a little", "Know it well"];
  const REASONS = [
    ["called", "Someone called me a narcissist, manipulative, controlling, or selfish"],
    ["worried", "I'm worried about how I treat people"],
    ["curious", "I'm just curious about myself"],
    ["other", "I'm trying to figure out if someone else is one"]
  ];
  const W = { likert: 1, frequency: 1.25, scenario: 1.1, pair: 0.7, reading: 0.8, slider: 0.6, overclaim: 1.2, quick: 1.4 };

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const el = (html) => { const t = document.createElement("template"); t.innerHTML = html.trim(); return t.content.firstElementChild; };
  const clamp01 = (x) => Math.max(0, Math.min(1, x));
  const hash = (str) => { let h = 2166136261; for (const c of str) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
  const rng = (seed) => { let s = seed | 0; return () => { s = (s + 0x6d2b79f5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };
  const shuffle = (arr, seed) => { const r = rng(seed); const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const median = (xs) => { if (!xs.length) return 0; const s = xs.slice().sort((a, b) => a - b); const m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };

  const fresh = () => ({ v: 1, seed: Math.floor(Math.random() * 1e9), idx: 0, reason: null, ans: {}, rt: {}, quick: null, startedAt: Date.now(), finishedAt: null });
  const load = () => { try { const s = JSON.parse(localStorage.getItem(KEY)); return s && s.v === 1 ? s : null; } catch (_) { return null; } };
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (_) {} };
  const loadFriends = () => { try { return JSON.parse(localStorage.getItem(FKEY)) || []; } catch (_) { return []; } };
  const saveFriends = (f) => { try { localStorage.setItem(FKEY, JSON.stringify(f)); } catch (_) {} };

  let st = load() || fresh();
  let resumeAt = 0;
  let shownAt = performance.now();
  let busy = false;
  let keyHandler = null;
  let speakOn = false;
  try { speakOn = localStorage.getItem(SPEAK_KEY) === "1"; } catch (_) {}

  const steps = [{ type: "welcome" }];
  D.modules.forEach((m, mi) => {
    steps.push({ type: "intro", m, mi });
    if (m.type === "familiarity" || m.type === "quick") steps.push({ type: m.type, m, mi, item: m.items[0], ii: 0 });
    else m.items.forEach((item, ii) => steps.push({ type: m.type, m, mi, item, ii }));
  });
  steps.push({ type: "results" });
  const isQuestion = (s) => !["welcome", "intro", "results"].includes(s.type);
  const answerable = steps.filter(isQuestion).length;

  /* ---------- Art ---------- */
  const palette = ["#a998dc", "#e9a27a", "#8fbcd8", "#d98a9a", "#7cc5b9", "#e8c27a"];
  const defs = (id, a, b) => `<defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs>`;
  const ART = {
    self: () => `<svg viewBox="0 0 160 160" aria-hidden="true">${defs("ga", "#a998dc", "#7cc5b9")}<circle cx="80" cy="80" r="70" fill="url(#ga)" opacity=".18"/><ellipse cx="80" cy="78" rx="40" ry="54" fill="none" stroke="url(#ga)" stroke-width="5"/><ellipse cx="80" cy="78" rx="30" ry="44" fill="url(#ga)" opacity=".35"/><path d="M64 52c6-8 16-12 26-10" stroke="#fff" stroke-width="5" stroke-linecap="round" fill="none" opacity=".8"/><rect x="74" y="132" width="12" height="16" rx="4" fill="url(#ga)"/></svg>`,
    self2: () => `<svg viewBox="0 0 160 160" aria-hidden="true">${defs("gb", "#e9a27a", "#a998dc")}<circle cx="80" cy="80" r="70" fill="url(#gb)" opacity=".18"/><ellipse cx="68" cy="80" rx="34" ry="48" fill="none" stroke="url(#gb)" stroke-width="5"/><ellipse cx="94" cy="80" rx="34" ry="48" fill="url(#gb)" opacity=".3"/><path d="M54 58c5-7 13-10 21-9" stroke="#fff" stroke-width="4" stroke-linecap="round" fill="none" opacity=".8"/></svg>`,
    moments: () => `<svg viewBox="0 0 160 160" aria-hidden="true">${defs("gc", "#7cc5b9", "#8fbcd8")}<circle cx="80" cy="80" r="70" fill="url(#gc)" opacity=".16"/><rect x="22" y="36" width="82" height="54" rx="20" fill="url(#gc)"/><path d="M42 88l-6 18 20-14z" fill="#7cc5b9"/><rect x="58" y="76" width="82" height="50" rx="20" fill="#e9a27a" opacity=".9"/><path d="M122 124l8 16-22-12z" fill="#e9a27a" opacity=".9"/><circle cx="84" cy="101" r="4" fill="#fff"/><circle cx="99" cy="101" r="4" fill="#fff"/><circle cx="114" cy="101" r="4" fill="#fff"/></svg>`,
    pairs: () => `<svg viewBox="0 0 160 160" aria-hidden="true">${defs("gd", "#a998dc", "#d98a9a")}<circle cx="80" cy="80" r="70" fill="url(#gd)" opacity=".14"/><circle cx="56" cy="80" r="34" fill="url(#gd)"/><circle cx="104" cy="80" r="34" fill="#8fbcd8" opacity=".85"/><path d="M80 52a34 34 0 0 1 0 56a34 34 0 0 1 0-56z" fill="#fff" opacity=".55"/></svg>`,
    reading: () => `<svg viewBox="0 0 160 160" aria-hidden="true">${defs("ge", "#d98a9a", "#e9a27a")}<circle cx="80" cy="80" r="70" fill="url(#ge)" opacity=".16"/><circle cx="80" cy="80" r="52" fill="none" stroke="url(#ge)" stroke-width="3" opacity=".5"/><circle cx="80" cy="80" r="36" fill="url(#ge)" opacity=".85"/><path d="M62 74q6-6 12 0M86 74q6-6 12 0" stroke="#fff" stroke-width="4" stroke-linecap="round" fill="none"/><path d="M66 92q14 10 28 0" stroke="#fff" stroke-width="4" stroke-linecap="round" fill="none"/></svg>`,
    month: () => { let d = ""; for (let r = 0; r < 5; r++) for (let c = 0; c < 6; c++) { const on = (r * 6 + c) % 4 === 1 || (r * 6 + c) % 7 === 3; d += `<rect x="${30 + c * 17}" y="${46 + r * 17}" width="12" height="12" rx="4" fill="${on ? "#7cc5b9" : "#8fbcd8"}" opacity="${on ? 1 : 0.3}"/>`; } return `<svg viewBox="0 0 160 160" aria-hidden="true"><circle cx="80" cy="80" r="70" fill="#8fbcd8" opacity=".14"/><rect x="22" y="28" width="116" height="10" rx="5" fill="#a998dc" opacity=".7"/>${d}</svg>`; },
    compare: () => `<svg viewBox="0 0 160 160" aria-hidden="true">${defs("gf", "#7cc5b9", "#a998dc")}<circle cx="80" cy="80" r="70" fill="url(#gf)" opacity=".14"/><rect x="34" y="84" width="16" height="40" rx="6" fill="#8fbcd8" opacity=".6"/><rect x="56" y="64" width="16" height="60" rx="6" fill="#8fbcd8" opacity=".6"/><rect x="78" y="40" width="16" height="84" rx="6" fill="url(#gf)"/><rect x="100" y="70" width="16" height="54" rx="6" fill="#8fbcd8" opacity=".6"/><circle cx="86" cy="28" r="6" fill="#e9a27a"/></svg>`,
    knowledge: () => `<svg viewBox="0 0 160 160" aria-hidden="true">${defs("gg", "#e8c27a", "#e9a27a")}<circle cx="80" cy="80" r="70" fill="url(#gg)" opacity=".16"/><path d="M28 50q26-10 52 4v66q-26-14-52-4z" fill="url(#gg)"/><path d="M132 50q-26-10-52 4v66q26-14 52-4z" fill="#a998dc" opacity=".85"/><path d="M40 64q14-4 28 2M40 78q14-4 28 2M92 66q14-6 28-2M92 80q14-6 28-2" stroke="#fff" stroke-width="3" stroke-linecap="round" fill="none" opacity=".8"/></svg>`,
    quick: () => `<svg viewBox="0 0 160 160" aria-hidden="true">${defs("gh", "#e9a27a", "#d98a9a")}<circle cx="80" cy="80" r="70" fill="url(#gh)" opacity=".14"/><circle cx="80" cy="84" r="46" fill="none" stroke="#8fbcd8" stroke-width="8" opacity=".35"/><path d="M80 38a46 46 0 0 1 44 58" fill="none" stroke="url(#gh)" stroke-width="8" stroke-linecap="round"/><path d="M86 56l-18 32h14l-6 24 22-34h-14z" fill="url(#gh)"/></svg>`
  };

  const scene = (key) => {
    const r = rng(hash(key));
    const pick = () => palette[Math.floor(r() * palette.length)];
    const c1 = pick(); let c2 = pick(); if (c2 === c1) c2 = palette[(palette.indexOf(c1) + 2) % palette.length];
    const bg = pick();
    const x1 = 140 + r() * 80, x2 = 330 + r() * 100;
    const lean = (r() - 0.5) * 12;
    const blobs = Array.from({ length: 4 }, () => `<circle cx="${(r() * 600).toFixed(0)}" cy="${(r() * 120).toFixed(0)}" r="${(20 + r() * 60).toFixed(0)}" fill="${pick()}" opacity=".18"/>`).join("");
    const figure = (x, c, s, flip) => `<g transform="translate(${x.toFixed(0)} 0) rotate(${(flip ? -lean : lean).toFixed(1)} 0 110)"><circle cx="0" cy="${(46 * s + 12).toFixed(0)}" r="${(16 * s).toFixed(1)}" fill="${c}"/><rect x="${(-22 * s).toFixed(1)}" y="${(66 * s + 10).toFixed(1)}" width="${(44 * s).toFixed(1)}" height="${(70 * s).toFixed(1)}" rx="${(20 * s).toFixed(1)}" fill="${c}" opacity=".85"/></g>`;
    return `<svg viewBox="0 0 600 110" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="600" height="110" fill="${bg}" opacity=".12"/>${blobs}${figure(x1, c1, 1, false)}${figure(x2, c2, 0.92, true)}<rect x="0" y="100" width="600" height="10" fill="${bg}" opacity=".25"/></svg>`;
  };

  /* ---------- Speech ---------- */
  const canSpeak = "speechSynthesis" in window;
  const speak = (text) => {
    if (!canSpeak) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.98;
    const voices = speechSynthesis.getVoices();
    const v = voices.find((x) => /^en/i.test(x.lang) && /natural|samantha|google us|aria|jenny|daniel/i.test(x.name)) || voices.find((x) => /^en/i.test(x.lang));
    if (v) u.voice = v;
    speechSynthesis.speak(u);
  };
  const speakBtn = () => canSpeak ? `<button type="button" class="icon-btn speak-btn ${speakOn ? "on" : ""}" data-speak aria-pressed="${speakOn}" aria-label="Read questions aloud" title="Read aloud"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M19 5a10 10 0 0 1 0 14"/></svg></button>` : "";
  const wireSpeak = (node, text) => {
    const b = node.querySelector("[data-speak]");
    if (!b) return;
    b.addEventListener("click", () => {
      speakOn = !speakOn;
      try { localStorage.setItem(SPEAK_KEY, speakOn ? "1" : "0"); } catch (_) {}
      b.classList.toggle("on", speakOn);
      b.setAttribute("aria-pressed", String(speakOn));
      if (speakOn) speak(text); else speechSynthesis.cancel();
    });
    if (speakOn) setTimeout(() => speak(text), 250);
  };

  /* ---------- Navigation ---------- */
  const mount = (node) => {
    keyHandler = null;
    const old = stage.querySelector(".screen");
    const place = () => {
      stage.replaceChildren(node);
      shownAt = performance.now();
      busy = false;
      node.querySelector("[data-focus]")?.focus({ preventScroll: true });
    };
    if (old && !reduced) { old.classList.add("leaving"); setTimeout(place, 170); } else place();
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  };

  const updateProgress = () => {
    const s = steps[st.idx];
    if (!s || !s.m) { progressShell.hidden = true; return; }
    progressShell.hidden = false;
    const done = steps.slice(0, st.idx).filter(isQuestion).length;
    progressBar.style.width = `${(done / answerable) * 100}%`;
    progressMod.textContent = `Part ${s.mi + 1} of ${D.modules.length} · ${s.m.title}`;
    progressCount.textContent = `${Math.round((done / answerable) * 100)}%`;
  };

  const go = (i) => {
    st.idx = Math.max(0, Math.min(steps.length - 1, i));
    save();
    if (canSpeak) speechSynthesis.cancel();
    render();
  };
  const next = () => go(st.idx + 1);
  const back = () => go(st.idx - 1);

  const answer = (id, val, delay = 240) => {
    if (busy) return;
    busy = true;
    st.ans[id] = val;
    st.rt[id] = Math.round(performance.now() - shownAt);
    save();
    setTimeout(next, reduced ? 60 : delay);
  };

  document.addEventListener("keydown", (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (/input|textarea|select/i.test(document.activeElement?.tagName || "")) return;
    keyHandler?.(e);
  });

  const backBtn = () => `<button type="button" class="linkish" data-back><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M15 18l-6-6 6-6"/></svg>Back</button>`;
  const wireBack = (node) => node.querySelector("[data-back]")?.addEventListener("click", back);
  const kicker = (s) => `<div class="q-kicker"><span>${esc(s.m.title)} · ${s.ii + 1} of ${s.m.items.length}</span>${speakBtn()}</div>`;

  const optionsKeyHandler = (node, keys) => (e) => {
    const i = keys.indexOf(e.key.toLowerCase());
    if (i >= 0) { node.querySelectorAll("[data-opt]")[i]?.click(); e.preventDefault(); }
    else if (e.key === "Backspace") { back(); e.preventDefault(); }
  };

  /* ---------- Screens ---------- */
  const renderWelcome = () => {
    const answered = Object.keys(st.ans).length;
    const finished = !!st.finishedAt;
    const inProgress = !finished && resumeAt > 0 && answered > 0;
    const node = el(`<div class="screen">
      <p class="eyebrow">Before you begin</p>
      <h1 class="q-text" tabindex="-1" data-focus style="font-size:clamp(1.9rem,4vw,2.6rem)">A few honest things first.</h1>
      <ul class="list-check" style="margin-bottom:28px">
        <li><strong>This is not a diagnosis.</strong> Only a licensed mental health professional can diagnose a personality disorder, and they'd use hours of interviews, not a website.</li>
        <li><strong>Nothing leaves your device.</strong> Your answers are saved only in this browser so you can pause and come back. There's no account, no tracking, and no server.</li>
        <li><strong>It takes about 15 to 20 minutes.</strong> There are nine short parts, each designed to make honest answers easier than flattering ones.</li>
        <li><strong>Answer as you are, not as you wish you were.</strong> Everyone has some of every trait here. The goal is understanding, not a verdict.</li>
      </ul>
      ${finished ? `<div class="callout" style="margin-bottom:22px"><p>You've already finished. You can view your results again or start fresh.</p><div class="row" style="margin-top:14px"><button class="btn small" data-view>View my results</button><button class="btn small ghost" data-restart>Start over</button></div></div>` : ""}
      ${inProgress ? `<div class="callout" style="margin-bottom:22px"><p>You have a test in progress (${Math.min(99, Math.round((answered / answerable) * 100))}% answered).</p><div class="row" style="margin-top:14px"><button class="btn small" data-continue>Continue where I left off</button><button class="btn small ghost" data-restart>Start over</button></div></div>` : ""}
      <h2 style="font-size:1.3rem;font-family:var(--font-sans);font-weight:600;letter-spacing:0;margin-top:8px">What brings you here today?</h2>
      <p class="q-sub" style="margin:0 0 16px">Optional. It only changes which notes you see on your results.</p>
      <div class="options" role="radiogroup">${REASONS.map(([k, t], i) => `<button type="button" class="opt" role="radio" aria-checked="${st.reason === k}" data-opt data-reason="${k}"><span class="key">${i + 1}</span>${esc(t)}</button>`).join("")}</div>
      <div id="reason-note"></div>
      <div class="q-actions"><span></span><button class="btn" data-start>${inProgress || finished ? "Start fresh" : "I understand. Let's begin"}</button></div>
    </div>`);
    const note = node.querySelector("#reason-note");
    const showNote = () => {
      note.innerHTML = st.reason === "other" ? `<div class="callout warm" style="margin-top:16px"><p>This test is built for looking at <em>yourself</em>. Answering it for someone else won't give you meaningful results. If you're trying to understand someone in your life, our <a href="../learn/">guide</a> can help. If you feel unsafe, please reach out to a support line like the <a href="https://www.thehotline.org/" rel="noopener" target="_blank">National Domestic Violence Hotline</a>.</p></div>` : "";
    };
    showNote();
    node.querySelectorAll("[data-reason]").forEach((b) => b.addEventListener("click", () => {
      st.reason = b.dataset.reason; save();
      node.querySelectorAll("[data-reason]").forEach((x) => x.setAttribute("aria-checked", String(x === b)));
      showNote();
    }));
    const restart = () => { const r = st.reason; st = fresh(); st.reason = r; resumeAt = 0; save(); };
    node.querySelector("[data-start]").addEventListener("click", () => { if (inProgress || finished) restart(); go(1); });
    node.querySelector("[data-continue]")?.addEventListener("click", () => go(resumeAt));
    node.querySelector("[data-view]")?.addEventListener("click", () => go(steps.length - 1));
    node.querySelectorAll("[data-restart]").forEach((b) => b.addEventListener("click", () => { restart(); render(); }));
    keyHandler = (e) => { const n = "1234".indexOf(e.key); if (n >= 0) { node.querySelectorAll("[data-reason]")[n]?.click(); e.preventDefault(); } };
    mount(node);
  };

  const renderIntro = (s) => {
    const m = s.m;
    const count = m.type === "familiarity" ? "16 terms" : m.type === "quick" ? "16 words" : `${m.items.length} questions`;
    const mins = { likert: 3, scenario: 3, pair: 2, reading: 2, frequency: 2, slider: 1, familiarity: 1, quick: 1 }[m.type];
    const node = el(`<div class="screen module-intro">
      <div class="art">${ART[m.art]()}</div>
      <p class="eyebrow" style="justify-content:center">Part ${s.mi + 1} of ${D.modules.length}</p>
      <h2 tabindex="-1" data-focus>${esc(m.title)}</h2>
      <p>${esc(m.intro)}</p>
      <div class="meta"><span>${count}</span><span>·</span><span>About ${mins} min</span></div>
      <div class="why"><strong>Why this part?</strong> ${esc(m.why)}</div>
      <div class="row" style="justify-content:center"><button class="btn" data-go>Start</button></div>
      <div style="margin-top:18px;display:flex;justify-content:center">${backBtn()}</div>
    </div>`);
    node.querySelector("[data-go]").addEventListener("click", next);
    wireBack(node);
    keyHandler = (e) => { if (e.key === "Enter") { next(); e.preventDefault(); } };
    mount(node);
  };

  const renderScale = (s, labels, cls) => {
    const it = s.item;
    const isFreq = s.type === "frequency";
    const prompt = isFreq ? "In the last 30 days, how often have you…" : "";
    const spoken = (prompt ? prompt + " " : "") + it.t;
    const cur = st.ans[it.id];
    const node = el(`<div class="screen">
      ${kicker(s)}
      ${prompt ? `<p class="q-sub" style="margin:0 0 8px">${prompt}</p>` : ""}
      <h2 class="q-text" tabindex="-1" data-focus>${esc(it.t)}</h2>
      <div class="likert ${cls}" role="radiogroup" aria-label="Your answer">
        ${labels.map((l, i) => { const v = isFreq ? i : i + 1; return `<button type="button" class="opt" role="radio" aria-checked="${cur === v}" data-opt data-v="${v}"><span class="dot"></span>${l}</button>`; }).join("")}
      </div>
      <div class="q-actions">${backBtn()}<span class="tag">Keys ${labels.map((_, i) => i + 1).join(" ")}</span></div>
    </div>`);
    node.querySelectorAll("[data-v]").forEach((b) => b.addEventListener("click", () => {
      node.querySelectorAll("[data-v]").forEach((x) => x.setAttribute("aria-checked", String(x === b)));
      answer(it.id, +b.dataset.v);
    }));
    wireBack(node);
    wireSpeak(node, spoken);
    keyHandler = optionsKeyHandler(node, labels.map((_, i) => String(i + 1)));
    mount(node);
  };

  const renderChoice = (s) => {
    const it = s.item;
    const isReading = s.type === "reading";
    const order = shuffle(it.opts.map((_, i) => i), hash(st.seed + it.id));
    const q = isReading ? it.q : "What would you most likely do?";
    const cur = st.ans[it.id];
    const letters = ["a", "b", "c", "d"];
    const node = el(`<div class="screen">
      ${kicker(s)}
      <div class="story"><div class="story-art">${scene(it.id + it.art)}</div><p>${esc(it.story)}</p></div>
      <h2 class="q-text" tabindex="-1" data-focus style="font-size:clamp(1.25rem,2.6vw,1.6rem);margin-bottom:18px">${esc(q)}</h2>
      <div class="options" role="radiogroup">
        ${order.map((oi, k) => `<button type="button" class="opt" role="radio" aria-checked="${cur === oi}" data-opt data-v="${oi}"><span class="key">${letters[k].toUpperCase()}</span>${esc(isReading ? it.opts[oi] : it.opts[oi].t)}</button>`).join("")}
      </div>
      <div class="q-actions">${backBtn()}<span class="tag">Keys A B C D</span></div>
    </div>`);
    node.querySelectorAll("[data-v]").forEach((b) => b.addEventListener("click", () => {
      node.querySelectorAll("[data-v]").forEach((x) => x.setAttribute("aria-checked", String(x === b)));
      answer(it.id, +b.dataset.v, 320);
    }));
    wireBack(node);
    wireSpeak(node, `${it.story} ${q} ${order.map((oi, k) => `${letters[k]}: ${isReading ? it.opts[oi] : it.opts[oi].t}.`).join(" ")}`);
    const byLetter = optionsKeyHandler(node, letters);
    keyHandler = (e) => { const n = "1234".indexOf(e.key); if (n >= 0) { node.querySelectorAll("[data-opt]")[n]?.click(); e.preventDefault(); } else byLetter(e); };
    mount(node);
  };

  const renderPair = (s) => {
    const it = s.item;
    const order = shuffle(["a", "b"], hash(st.seed + it.id));
    const cur = st.ans[it.id];
    const spoken = `${it.prompt} ${it[order[0]].t}. Or, ${it[order[1]].t}.`;
    const node = el(`<div class="screen">
      ${kicker(s)}
      <h2 class="q-text" tabindex="-1" data-focus>${esc(it.prompt)}</h2>
      <div class="pair" role="radiogroup">
        <button type="button" class="opt" role="radio" aria-checked="${cur === order[0]}" data-opt data-v="${order[0]}">${esc(it[order[0]].t)}</button>
        <span class="or">or</span>
        <button type="button" class="opt" role="radio" aria-checked="${cur === order[1]}" data-opt data-v="${order[1]}">${esc(it[order[1]].t)}</button>
      </div>
      <div class="q-actions">${backBtn()}<span class="tag">Keys ← →</span></div>
    </div>`);
    node.querySelectorAll("[data-v]").forEach((b) => b.addEventListener("click", () => {
      node.querySelectorAll("[data-v]").forEach((x) => x.setAttribute("aria-checked", String(x === b)));
      answer(it.id, b.dataset.v, 300);
    }));
    wireBack(node);
    wireSpeak(node, spoken);
    keyHandler = (e) => {
      const opts = node.querySelectorAll("[data-opt]");
      if (e.key === "ArrowLeft" || e.key === "1") { opts[0].click(); e.preventDefault(); }
      else if (e.key === "ArrowRight" || e.key === "2") { opts[1].click(); e.preventDefault(); }
      else if (e.key === "Backspace") { back(); e.preventDefault(); }
    };
    mount(node);
  };

  const renderSlider = (s) => {
    const it = s.item;
    const max = it.kind === "pct" ? 100 : it.max;
    const cur = st.ans[it.id] ?? Math.round(max / 2);
    const fmt = (v) => it.kind === "pct" ? `${v}<small> / 100</small>` : `${v} <small>${esc(it.unit)}</small>`;
    const node = el(`<div class="screen">
      ${kicker(s)}
      <h2 class="q-text" tabindex="-1" data-focus>${esc(it.t)}</h2>
      ${it.kind === "pct" ? `<p class="q-sub">50 means exactly average. 90 means better than 90 out of 100 people.</p>` : ""}
      <div class="slider-wrap">
        <div class="slider-val" aria-hidden="true">${fmt(cur)}</div>
        <input type="range" min="0" max="${max}" step="1" value="${cur}" aria-label="${esc(it.t)}">
        <div class="slider-ends"><span>${esc(it.lo)}</span><span>${esc(it.hi)}</span></div>
      </div>
      <div class="q-actions">${backBtn()}<button class="btn" data-next>Next</button></div>
    </div>`);
    const input = node.querySelector("input");
    const val = node.querySelector(".slider-val");
    const paint = () => { input.style.setProperty("--fill", `${(input.value / max) * 100}%`); val.innerHTML = fmt(input.value); };
    paint();
    input.addEventListener("input", paint);
    input.addEventListener("keydown", (e) => { if (e.key === "Enter") { node.querySelector("[data-next]").click(); e.preventDefault(); } });
    node.querySelector("[data-next]").addEventListener("click", () => answer(it.id, +input.value, 0));
    wireBack(node);
    wireSpeak(node, it.t);
    keyHandler = (e) => { if (e.key === "Enter") { node.querySelector("[data-next]").click(); e.preventDefault(); } };
    mount(node);
  };

  const renderFamiliarity = (s) => {
    const f = s.item;
    const terms = shuffle([...f.real, ...f.fake], hash(st.seed + "fam"));
    const cur = Object.assign({}, st.ans.fam || {});
    const node = el(`<div class="screen">
      <div class="q-kicker"><span>${esc(s.m.title)}</span></div>
      <h2 class="q-text" tabindex="-1" data-focus>How familiar are you with each of these?</h2>
      <div class="options" style="gap:14px">
        ${terms.map((t) => `<div class="story" style="padding:16px 18px;margin:0" data-term="${esc(t)}"><p style="font-weight:600;color:var(--ink);margin:0 0 10px">${esc(t)}</p><div class="fam-scale" role="radiogroup" aria-label="${esc(t)}">${FAM.map((l, v) => `<button type="button" class="opt" role="radio" aria-checked="${cur[t] === v}" data-v="${v}">${l}</button>`).join("")}</div></div>`).join("")}
      </div>
      <div class="q-actions">${backBtn()}<button class="btn" data-next ${terms.every((t) => cur[t] != null) ? "" : "disabled"}>Next</button></div>
    </div>`);
    const nextBtn = node.querySelector("[data-next]");
    node.querySelectorAll("[data-term]").forEach((row) => {
      const t = row.dataset.term;
      row.querySelectorAll("[data-v]").forEach((b) => b.addEventListener("click", () => {
        cur[t] = +b.dataset.v;
        row.querySelectorAll("[data-v]").forEach((x) => x.setAttribute("aria-checked", String(x === b)));
        nextBtn.disabled = !terms.every((x) => cur[x] != null);
        st.ans.fam = cur; save();
      }));
    });
    nextBtn.addEventListener("click", () => { st.ans.fam = cur; save(); next(); });
    wireBack(node);
    mount(node);
  };

  const renderQuick = (s) => {
    const q = s.item;
    const words = shuffle([...q.grand.map((w) => ({ w, g: true })), ...q.humble.map((w) => ({ w, g: false }))], hash(st.seed + "quick"));
    const LIMIT = 3000;
    const node = el(`<div class="screen">
      <div class="q-kicker"><span>${esc(s.m.title)}</span></div>
      <h2 class="q-text" tabindex="-1" data-focus>Does this word describe you?</h2>
      <p class="q-sub">Go with your gut. Tap the buttons, or press <span class="kbd">F</span> for Me and <span class="kbd">J</span> for Not me.</p>
      <div class="qs-card" aria-live="assertive"><span class="word">Ready when you are</span></div>
      <div class="qs-btns">
        <button class="btn" data-me disabled>Me <span class="kbd">F</span></button>
        <button class="btn ghost" data-not disabled>Not me <span class="kbd">J</span></button>
      </div>
      <div class="q-actions">${backBtn()}<button class="btn" data-begin>Begin</button></div>
    </div>`);
    const card = node.querySelector(".qs-card");
    const meB = node.querySelector("[data-me]");
    const notB = node.querySelector("[data-not]");
    const beginB = node.querySelector("[data-begin]");
    const out = [];
    let i = -1, t0 = 0, tid = null, cd = null, running = false, live = false;
    const stop = () => { running = live = false; clearTimeout(tid); clearInterval(cd); };
    const show = () => {
      i++;
      if (i >= words.length) return finish();
      card.innerHTML = `<span class="word">${esc(words[i].w)}</span><div class="timer"></div>`;
      card.querySelector(".timer").animate?.([{ transform: "scaleX(1)" }, { transform: "scaleX(0)" }], { duration: LIMIT, easing: "linear", fill: "forwards" });
      t0 = performance.now();
      live = true;
      clearTimeout(tid);
      tid = setTimeout(() => record(null), LIMIT);
    };
    const record = (me) => {
      if (!running || !live) return;
      live = false;
      clearTimeout(tid);
      out.push({ w: words[i].w, g: words[i].g, me, rt: Math.round(performance.now() - t0) });
      show();
    };
    const finish = () => {
      stop();
      st.quick = out; save();
      card.innerHTML = `<span class="word">Done</span>`;
      meB.disabled = notB.disabled = true;
      setTimeout(next, reduced ? 50 : 700);
    };
    beginB.addEventListener("click", () => {
      beginB.hidden = true;
      meB.disabled = notB.disabled = false;
      running = true;
      let n = 3;
      card.innerHTML = `<span class="word">${n}</span>`;
      cd = setInterval(() => { n--; if (n > 0) card.innerHTML = `<span class="word">${n}</span>`; else { clearInterval(cd); show(); } }, 650);
    });
    meB.addEventListener("click", () => record(true));
    notB.addEventListener("click", () => record(false));
    node.querySelector("[data-back]").addEventListener("click", () => { stop(); back(); });
    keyHandler = (e) => {
      const k = e.key.toLowerCase();
      if (!running) { if (e.key === "Enter" && !beginB.hidden) { beginB.click(); e.preventDefault(); } return; }
      if (k === "f" || e.key === "ArrowLeft") { record(true); e.preventDefault(); }
      else if (k === "j" || e.key === "ArrowRight") { record(false); e.preventDefault(); }
    };
    mount(node);
  };

  /* ---------- Scoring ---------- */
  const score = () => {
    const acc = Object.fromEntries(D.dimOrder.map((d) => [d, { s: 0, w: 0 }]));
    const add = (d, x, w) => { if (acc[d] && w > 0) { acc[d].s += clamp01(x) * w; acc[d].w += w; } };
    const notable = [];
    const likertVals = [];
    const rts = [];
    const mod = (type) => D.modules.find((m) => m.type === type);

    for (const m of D.modules) {
      if (m.type === "likert" || m.type === "frequency") {
        const isFreq = m.type === "frequency";
        const min = isFreq ? 0 : 1, max = isFreq ? 3 : 5;
        for (const it of m.items) {
          const v = st.ans[it.id];
          if (v == null) continue;
          if (!isFreq) likertVals.push(v);
          if (st.rt[it.id]) rts.push(st.rt[it.id]);
          if (!Object.keys(it.w).length) continue;
          let x = (v - min) / (max - min);
          if (it.rev) x = 1 - x;
          for (const [d, w] of Object.entries(it.w)) add(d, x, w * W[m.type]);
          if (x >= 0.66) {
            notable.push({
              q: isFreq ? `In the last month: ${it.t.charAt(0).toLowerCase()}${it.t.slice(1)}` : it.t,
              a: isFreq ? FREQ[v] : LIKERT[v - 1],
              weight: x * Math.max(...Object.values(it.w)) * W[m.type]
            });
          }
        }
      } else if (m.type === "scenario") {
        for (const it of m.items) {
          const v = st.ans[it.id];
          if (v == null) continue;
          const chosen = it.opts[v];
          const dimsHere = new Set(it.opts.flatMap((o) => Object.keys(o.w)));
          for (const d of dimsHere) {
            const maxW = Math.max(...it.opts.map((o) => o.w[d] || 0));
            add(d, (chosen.w[d] || 0) / maxW, W.scenario);
          }
          const top = Math.max(0, ...Object.values(chosen.w));
          if (top >= 2) notable.push({ q: it.story, a: chosen.t, weight: top * 0.6 * W.scenario });
        }
      } else if (m.type === "pair") {
        for (const it of m.items) {
          const v = st.ans[it.id];
          if (v == null) continue;
          for (const d of new Set([...Object.keys(it.a.w), ...Object.keys(it.b.w)])) add(d, it[v].w[d] || 0, W.pair);
        }
      } else if (m.type === "reading") {
        for (const it of m.items) {
          const v = st.ans[it.id];
          if (v != null) add("emp", v === it.correct ? 0 : 1, W.reading);
        }
      } else if (m.type === "slider") {
        for (const it of m.items) {
          const v = st.ans[it.id];
          if (v == null) continue;
          const [lo, hi] = it.map;
          for (const [d, w] of Object.entries(it.w)) add(d, (v - lo) / (hi - lo), w * W.slider);
        }
      }
    }

    const fam = st.ans.fam || {};
    const famData = mod("familiarity").items[0];
    const fakeVals = famData.fake.map((t) => fam[t]).filter((v) => v != null);
    const fakeMean = fakeVals.length ? fakeVals.reduce((a, b) => a + b, 0) / fakeVals.length / 3 : 0;
    const fakeClaimed = fakeVals.filter((v) => v >= 2).length;
    const fakeHeard = fakeVals.filter((v) => v >= 1).length;
    if (fakeVals.length) add("grand", fakeMean * 1.6, W.overclaim);

    const quick = st.quick || [];
    const qg = quick.filter((x) => x.g && x.me != null);
    const qh = quick.filter((x) => !x.g && x.me != null);
    const grandMeN = qg.filter((x) => x.me).length;
    const humbleNotN = qh.filter((x) => !x.me).length;
    const timeouts = quick.filter((x) => x.me == null).length;
    if (qg.length + qh.length >= 8) add("grand", 0.6 * (qg.length ? grandMeN / qg.length : 0) + 0.4 * (qh.length ? humbleNotN / qh.length : 0), W.quick);

    const scores = Object.fromEntries(D.dimOrder.map((d) => [d, acc[d].w ? Math.round((acc[d].s / acc[d].w) * 100) : 0]));

    const allLikert = D.modules.filter((m) => m.type === "likert").flatMap((m) => m.items);
    const sdItems = allLikert.filter((i) => i.sd);
    const sdNeverItems = mod("frequency").items.filter((i) => i.sdNever);
    const sdCount = sdItems.filter((i) => (st.ans[i.id] || 0) >= 4).length + sdNeverItems.filter((i) => st.ans[i.id] === 0).length;
    const sdTotal = sdItems.length + sdNeverItems.length;

    const attnFails = allLikert.filter((i) => i.attn).filter((i) => {
      const v = st.ans[i.id];
      return v != null && (i.attn === 2 ? v > 2 : v >= 3);
    }).length;

    const pairsMap = {};
    for (const it of allLikert) if (it.pair) (pairsMap[it.pair] ||= []).push(it);
    let incon = 0, pairN = 0;
    for (const [a, b] of Object.values(pairsMap)) {
      const va = st.ans[a.id], vb = st.ans[b.id];
      if (va == null || vb == null) continue;
      pairN++;
      const na = a.rev ? 6 - va : va, nb = b.rev ? 6 - vb : vb;
      if (Math.abs(na - nb) >= 3) incon++;
    }

    const medRt = median(rts);
    const counts = [1, 2, 3, 4, 5].map((v) => likertVals.filter((x) => x === v).length);
    const straight = likertVals.length ? Math.max(...counts) / likertVals.length : 0;
    const enhanceVals = mod("slider").items.filter((i) => i.enhance).map((i) => st.ans[i.id]).filter((v) => v != null);
    const enhanceMean = enhanceVals.length ? enhanceVals.reduce((a, b) => a + b, 0) / enhanceVals.length : 50;

    const flags = [];
    let reliabilityWarns = 0;
    if (sdCount >= 3) { reliabilityWarns++; flags.push({ warn: true, title: "Your answers leaned toward a very ideal picture", text: `You agreed with ${sdCount} of ${sdTotal} statements that almost nobody can honestly say yes to, like never feeling jealous or always admitting mistakes right away. That's very human; most of us want to be good people. But it means your scores here are probably lower than they would be with less self-protection.` }); }
    else if (sdCount === 2) flags.push({ warn: true, title: "A slight lean toward the ideal", text: "A couple of your answers described a nearly perfect version of yourself. That's common. Just keep in mind your scores may be a little lower than reality." });
    else flags.push({ warn: false, title: "Your answers looked candid", text: "You admitted to ordinary human flaws, which is exactly what honest answers look like. That makes the rest of these results more meaningful." });
    if (attnFails) { reliabilityWarns++; flags.push({ warn: true, title: "An attention check was missed", text: "A couple of questions asked for a specific answer to check focus. Missing them happens when you're tired or rushing. Results may be less reliable." }); }
    if (pairN && incon >= 2) { reliabilityWarns++; flags.push({ warn: true, title: "Some answers contradicted each other", text: `A few statements appeared twice, worded in opposite ways. In ${incon} of ${pairN} pairs your answers pointed in different directions. That can mean you rushed, or that your feelings on those topics genuinely vary.` }); }
    else if (pairN) flags.push({ warn: false, title: "Your answers were consistent", text: "When we asked about the same thing twice in different words, your answers lined up." });
    if (medRt && medRt < 1300) { reliabilityWarns++; flags.push({ warn: true, title: "You moved very quickly", text: `Your typical answer took about ${(medRt / 1000).toFixed(1)} seconds. That's fast enough that some statements may not have been fully read.` }); }
    if (straight >= 0.85) { reliabilityWarns++; flags.push({ warn: true, title: "Many identical answers", text: "You picked the same response for most statements, which makes it harder to see real patterns." }); }
    if (fakeClaimed >= 1 || fakeHeard >= 3) flags.push({ warn: true, title: "About those “general knowledge” terms…", text: `Six of the terms in that section don't exist. We made them up. ${fakeClaimed ? `You said you could explain or knew ${fakeClaimed} of them.` : `You said you'd at least heard of ${fakeHeard} of them.`} Research on “overclaiming” links this to wanting to seem knowledgeable. It's a small nudge toward self-enhancement, not proof of anything, and honest people do it too.` });
    else if (fakeVals.length) flags.push({ warn: false, title: "You didn't overclaim", text: "Six of the “general knowledge” terms were made up, and you didn't claim to know them. That's a good sign of candid answers." });
    if (enhanceMean >= 85) flags.push({ warn: true, title: "You rated yourself near the top on everything", text: `On average you placed yourself around ${Math.round(enhanceMean)} out of 100 for intelligence, friendship, and fairness. Most people rate themselves above average, but this was higher than typical.` });
    if (timeouts > 5) flags.push({ warn: true, title: "Several quick reactions timed out", text: "That part had less data than usual, so it counted for less." });

    const confidence = reliabilityWarns === 0
      ? { label: "Good", color: "var(--accent)", text: "Your answers passed our consistency and candor checks." }
      : reliabilityWarns === 1
        ? { label: "Fair", color: "var(--peach)", text: "One of our checks raised a question. See the notes below." }
        : { label: "Low", color: "var(--rose)", text: "Several checks raised questions. Treat these results loosely." };

    notable.sort((a, b) => b.weight - a.weight);
    const reading = mod("reading").items;
    return {
      scores, flags, confidence,
      notable: notable.slice(0, 5),
      quickInfo: { grandMe: grandMeN, grandN: qg.length },
      readingCorrect: reading.filter((it) => st.ans[it.id] === it.correct).length,
      readingN: reading.length
    };
  };

  const band = (v) => v < 22 ? { i: 0, label: "Faint" } : v < 42 ? { i: 1, label: "Some" } : v < 60 ? { i: 2, label: "Noticeable" } : { i: 3, label: "Strong" };

  /* ---------- Friend codes ---------- */
  const parseCode = (raw) => {
    const m = String(raw).trim().match(/HM1-([0-9])([1-5])-([1-5]{16})-([0-9a-z])/i);
    if (!m) return null;
    const digits = m[1] + m[2] + m[3];
    const chk = ([...digits].reduce((a, c) => a + +c, 0) % 36).toString(36);
    if (chk !== m[4].toLowerCase()) return null;
    return { rel: +m[1], know: +m[2], a: [...m[3]].map(Number), code: `HM1-${m[1]}${m[2]}-${m[3]}-${chk}` };
  };
  const friendScores = (f) => {
    const acc = Object.fromEntries(D.dimOrder.map((d) => [d, { s: 0, w: 0 }]));
    D.observer.forEach((it, i) => {
      let x = (f.a[i] - 1) / 4;
      if (it.rev) x = 1 - x;
      for (const [d, w] of Object.entries(it.w)) { acc[d].s += x * w; acc[d].w += w; }
    });
    return Object.fromEntries(D.dimOrder.map((d) => [d, Math.round((acc[d].s / acc[d].w) * 100)]));
  };

  /* ---------- Radar ---------- */
  const radar = (scores, other) => {
    const n = D.dimOrder.length, cx = 230, cy = 210, R = 150;
    const pt = (i, v) => { const a = (Math.PI * 2 * i) / n - Math.PI / 2; return [cx + Math.cos(a) * R * v, cy + Math.sin(a) * R * v].map((z) => z.toFixed(1)); };
    const rings = [0.25, 0.5, 0.75, 1].map((r) => `<polygon class="grid-line" points="${D.dimOrder.map((_, i) => pt(i, r).join(",")).join(" ")}"/>`).join("");
    const axes = D.dimOrder.map((_, i) => { const [x, y] = pt(i, 1); return `<line class="axis" x1="${cx}" y1="${cy}" x2="${x}" y2="${y}"/>`; }).join("");
    const labels = D.dimOrder.map((d, i) => { const [x, y] = pt(i, 1.12).map(Number); const anchor = Math.abs(x - cx) < 10 ? "middle" : x > cx ? "start" : "end"; return `<text x="${x}" y="${y + 4}" text-anchor="${anchor}">${SHORT[d]}</text>`; }).join("");
    const poly = (sc, cls) => `<polygon class="area ${cls} draw" points="${D.dimOrder.map((d, i) => pt(i, Math.max(0.03, sc[d] / 100)).join(",")).join(" ")}"/>`;
    const dots = D.dimOrder.map((d, i) => { const [x, y] = pt(i, Math.max(0.03, scores[d] / 100)); return `<circle class="pt draw" cx="${x}" cy="${y}" r="3.5"/>`; }).join("");
    return `<svg class="radar" viewBox="0 0 460 420" role="img" aria-label="Chart of your eight trait scores">${rings}${axes}${other ? poly(other, "other") : ""}${poly(scores, "")}${dots}${labels}</svg>`;
  };

  /* ---------- Results ---------- */
  const renderResults = () => {
    if (!st.finishedAt) { st.finishedAt = Date.now(); save(); }
    const r = score();
    const sc = r.scores;
    const friends = loadFriends().map(parseCode).filter(Boolean);
    const fAvg = friends.length ? Object.fromEntries(D.dimOrder.map((d) => [d, Math.round(friends.map(friendScores).reduce((a, f) => a + f[d], 0) / friends.length)])) : null;

    const narc = Math.round(0.26 * sc.grand + 0.26 * sc.ent + 0.18 * sc.emp + 0.15 * sc.acct + 0.15 * sc.vuln);
    const gStyle = (sc.grand + sc.ent) / 2, vStyle = (sc.vuln + sc.ent) / 2;
    const top = D.dimOrder.slice().sort((a, b) => sc[b] - sc[a]).filter((d) => sc[d] >= 42).slice(0, 3);

    let headline, summary;
    if (narc < 30) {
      headline = "No strong narcissistic pattern showed up in your answers.";
      summary = "Across the different kinds of questions, your answers didn't cluster around the traits that define narcissism. That doesn't make you flawless; nobody is. And it doesn't mean the people who used that word were lying. It may describe specific moments or one relationship rather than who you are.";
    } else if (narc < 48) {
      headline = "Some traits came through, the way they do for most people.";
      summary = "You showed a mix of traits that everyone has to some degree. Nothing here points to a fixed pattern, but a few areas are worth honest reflection, especially if they match what people have told you.";
    } else if (narc < 62) {
      headline = "Several narcissistic traits came through noticeably.";
      summary = "Your answers leaned toward a few of the traits associated with narcissism. That is not a diagnosis, and it isn't a judgment of your worth. Traits like these usually develop for understandable reasons, often as protection, and they can change. Talking with a therapist would be a meaningful next step.";
    } else {
      headline = "A strong pattern of narcissistic traits came through.";
      summary = "Many of your answers pointed in the same direction. This still isn't a diagnosis; only a qualified professional can make one. But it is a real signal, and looking at it honestly matters. These patterns usually come from somewhere, and people do change them with support. Please consider talking to a licensed therapist.";
    }
    let style = "";
    if (narc >= 35) {
      if (gStyle - vStyle > 10) style = "Your pattern leaned toward the <strong>grandiose</strong> side: confidence, wanting recognition, and expecting things to go your way.";
      else if (vStyle - gStyle > 10) style = "Your pattern leaned toward the <strong>vulnerable</strong> side: sensitivity to criticism and needing reassurance, sometimes turning into quiet resentment. This side is often missed because it looks more like insecurity than arrogance.";
      else style = "Your pattern was a <strong>mix</strong> of grandiose and vulnerable traits: confidence on the outside, with sensitivity underneath. Many people with narcissistic traits move between the two.";
    }

    const otherWords = ["manip", "ctrl", "self"].filter((d) => sc[d] >= 42);
    const reasonNote = st.reason === "called"
      ? `<div class="callout warm" style="margin-top:22px"><h3>About being called this</h3><p>When a word like “narcissist” keeps coming up, it usually means one of three things. It may be pointing at a real pattern.${top.length ? ` Your highest areas here were <strong>${top.map((d) => D.dims[d].name.toLowerCase()).join("</strong>, <strong>")}</strong>, which are good places to start.` : ""} It may be a loose way of saying “you hurt me and I don't feel heard.” Or it may be used against you in a way that isn't fair. More than one can be true at once. Our <a href="../learn/#called">guide on being called a narcissist</a> walks through how to tell the difference.</p></div>`
      : st.reason === "worried"
        ? `<div class="callout" style="margin-top:22px"><h3>You came here worried about how you treat people</h3><p>Hold on to that concern. Caring about your impact is where changing it starts, whatever your scores say. The “what to try” notes under each trait are small, practical places to begin.</p></div>`
        : "";

    const dimCards = D.dimOrder.map((d) => {
      const v = sc[d], b = band(v), info = D.dims[d];
      const fv = fAvg ? fAvg[d] : null;
      let gap = "";
      if (fv != null) {
        if (fv - v >= 15) gap = `<p><strong>The people you invited see more of this than you report</strong> (${fv} vs. your ${v}). That gap is worth asking them about, gently and with curiosity.</p>`;
        else if (v - fv >= 15) gap = `<p><strong>You're harder on yourself here than the people you invited</strong> (${fv} vs. your ${v}).</p>`;
        else gap = `<p>The people you invited see you about the same way here (${fv}).</p>`;
      }
      const body = b.i >= 2 ? info.high : b.i === 0 ? info.low : `<em>This came through moderately, which is where most people land.</em> At its stronger end, it looks like this: ${info.high}`;
      return `<article class="dim">
        <div class="dim-head"><h3>${info.name}</h3><span class="band-tag band-${b.i}">${b.label} · ${v}</span></div>
        <div class="aka">${esc(info.aka)}</div>
        <div class="meter" aria-hidden="true"><span class="pin" data-left="${v}"></span>${fv != null ? `<span class="pin other" data-left="${fv}" title="People who know you"></span>` : ""}</div>
        <p>${body}</p>
        ${gap}
        <details><summary>What this isn't, and what to try</summary><p>${esc(info.notIt)}</p><ul>${info.tips.map((t) => `<li>${esc(t)}</li>`).join("")}</ul></details>
      </article>`;
    }).join("");

    const notable = r.notable.length ? `<h2>Answers worth sitting with</h2><p class="intro">These specific answers pulled your results up the most. They aren't “wrong.” They're just the clearest windows into the pattern.</p><div class="validity">${r.notable.map((n) => `<div class="flag"><div class="fi" style="background:var(--surface-2);font-family:var(--font-serif);font-size:1.3rem">“</div><div><h4>${esc(n.q)}</h4><p>You answered: <strong>${esc(n.a)}</strong></p></div></div>`).join("")}</div>` : "";

    const friendList = friends.length ? `<p style="margin-top:16px;color:var(--ink-2)">${friends.length} ${friends.length === 1 ? "person has" : "people have"} added their view (${friends.map((f) => esc(D.relations[f.rel] || "Other")).join(", ")}). On the chart, their average is the dashed orange shape.</p>` : "";

    const node = el(`<div class="screen wide results">
      <div class="result-hero">
        <p class="eyebrow" style="justify-content:center">Your reflection</p>
        <h1 tabindex="-1" data-focus style="font-size:clamp(2rem,4.4vw,3.1rem);max-width:22ch;margin-inline:auto">${headline}</h1>
        <div class="confidence"><i style="background:${r.confidence.color}"></i><span>Answer quality: <strong>${r.confidence.label}</strong>. ${r.confidence.text}</span></div>
        <p>${summary}</p>
        ${style ? `<p>${style}</p>` : ""}
        ${otherWords.length ? `<p>Beyond narcissism itself, <strong>${otherWords.map((d) => D.dims[d].name.toLowerCase()).join("</strong> and <strong>")}</strong> also came through. These overlap with narcissism but aren't the same thing. Plenty of people struggle with them without being narcissistic at all.</p>` : ""}
      </div>
      ${reasonNote}
      <div class="radar-box">
        <div>${radar(sc, fAvg)}${fAvg ? `<div class="legend"><span><i style="background:var(--accent)"></i>You</span><span><i style="background:var(--peach)"></i>People who know you</span></div>` : ""}</div>
        <div class="summary-card">
          <h3>How to read this</h3>
          <p>Each score from 0 to 100 shows how strongly a trait came through <em>in your answers here</em>, combining eight different kinds of questions. It isn't a percentile, and it hasn't been validated in a clinical study.</p>
          <p style="margin:0;display:flex;gap:6px;flex-wrap:wrap"><span class="band-tag band-0">Faint</span><span class="band-tag band-1">Some</span><span class="band-tag band-2">Noticeable</span><span class="band-tag band-3">Strong</span></p>
          <p style="margin-top:14px;margin-bottom:0">You read ${r.readingCorrect} of ${r.readingN} emotional situations the way most people do${r.quickInfo.grandN ? `, and picked ${r.quickInfo.grandMe} of ${r.quickInfo.grandN} “big” words to describe yourself in the quick-reaction round` : ""}.</p>
        </div>
      </div>

      <h2>Trait by trait</h2>
      <p class="intro">Open “What this isn't, and what to try” on any trait for context and small things to practice.</p>
      <div class="dim-list">${dimCards}</div>

      <h2>How honest were the answers?</h2>
      <p class="intro">No test can stop someone from bending the truth, but these checks show how far your results can be trusted.</p>
      <div class="validity">${r.flags.map((f) => `<div class="flag ${f.warn ? "warn" : "ok"}"><div class="fi">${f.warn ? "!" : "✓"}</div><div><h4>${esc(f.title)}</h4><p>${esc(f.text)}</p></div></div>`).join("")}</div>

      ${notable}

      <h2 id="others">The hardest part to fake: other people</h2>
      <p class="intro">The most reliable check is comparing your answers with how people who know you see you. Send this private link to someone you trust: a partner, friend, sibling, or coworker. They answer 16 short questions about you and get a code to send back. Nothing is uploaded anywhere.</p>
      <div class="summary-card no-print">
        <div class="field"><label for="fname">Your first name, or what they call you</label><input id="fname" maxlength="30" placeholder="e.g. Alex" autocomplete="given-name"></div>
        <div class="row"><button class="btn small" data-invite>Create invite link</button><button class="btn small ghost" data-share hidden>Share…</button></div>
        <div class="code-out" data-link hidden style="margin-top:14px"></div>
        <hr style="border:0;border-top:1px solid var(--line);margin:24px 0">
        <div class="field"><label for="fcode">Got a code back? Paste it here</label><textarea id="fcode" placeholder="HM1-…"></textarea><div class="err" data-err role="alert"></div></div>
        <div class="row"><button class="btn small" data-addcode>Add their view</button>${friends.length ? `<button class="btn small ghost" data-clearcodes>Remove all views</button>` : ""}</div>
        ${friendList}
      </div>

      <h2>Where to go from here</h2>
      <div class="cards" style="margin-top:20px">
        <div class="card"><h3>Talk to a professional</h3><p>A licensed therapist can tell you far more than any website. Look for affordable options through <a href="https://openpathcollective.org/" target="_blank" rel="noopener">Open Path Collective</a> or the <a href="https://www.psychologytoday.com/us/therapists" target="_blank" rel="noopener">Psychology Today directory</a>.</p></div>
        <div class="card"><h3>Understand the words</h3><p>Read our plain-language <a href="../learn/">guide</a> to what narcissism, manipulation, and control really mean, and what they don't.</p></div>
        <div class="card"><h3>If you're hurting</h3><p>Being labeled can hurt badly. If you're in crisis, call or text <strong>988</strong> in the US, or find a line in your country at <a href="https://findahelpline.com/" target="_blank" rel="noopener">findahelpline.com</a>.</p></div>
      </div>

      <div class="row no-print" style="justify-content:center;margin-top:48px">
        <button class="btn ghost small" data-print>Save as PDF / print</button>
        <button class="btn ghost small" data-copy>Copy summary</button>
        <button class="btn ghost small" data-restart>Retake the test</button>
      </div>
      <p style="text-align:center;color:var(--muted);font-size:.88rem;margin-top:28px">This tool is for self-understanding and education only. It is not a medical or psychological assessment and cannot diagnose Narcissistic Personality Disorder or any other condition.</p>
    </div>`);

    setTimeout(() => node.querySelectorAll(".pin").forEach((p) => { p.style.left = `${p.dataset.left}%`; }), 350);

    const nameIn = node.querySelector("#fname");
    const linkOut = node.querySelector("[data-link]");
    const shareB = node.querySelector("[data-share]");
    try { nameIn.value = localStorage.getItem("hm-name") || ""; } catch (_) {}
    let link = "";
    node.querySelector("[data-invite]").addEventListener("click", async () => {
      const nm = nameIn.value.trim().slice(0, 30);
      if (!nm) { nameIn.focus(); window.HM.toast("Add a name so they know who it's about"); return; }
      try { localStorage.setItem("hm-name", nm); } catch (_) {}
      link = new URL(`../friend/?n=${encodeURIComponent(nm)}`, location.href).href;
      linkOut.hidden = false;
      linkOut.textContent = link;
      if (navigator.share) shareB.hidden = false;
      try { await navigator.clipboard.writeText(link); window.HM.toast("Link copied"); } catch (_) { window.HM.toast("Link ready. Copy it below"); }
    });
    shareB.addEventListener("click", () => navigator.share?.({ title: "How do you see me?", text: "Would you answer a few honest questions about me? It's private and takes about 3 minutes.", url: link }).catch(() => {}));

    const err = node.querySelector("[data-err]");
    node.querySelector("[data-addcode]").addEventListener("click", () => {
      const raw = node.querySelector("#fcode").value;
      const parsed = (raw.match(/HM1-[0-9][1-5]-[1-5]{16}-[0-9a-z]/gi) || []).map(parseCode).filter(Boolean);
      if (!parsed.length) { err.textContent = "That code doesn't look right. Check that it was copied in full."; return; }
      const existing = loadFriends();
      for (const p of parsed) if (!existing.includes(p.code)) existing.push(p.code);
      saveFriends(existing);
      window.HM.toast(parsed.length === 1 ? "Their view was added" : `${parsed.length} views added`);
      renderResults();
      setTimeout(() => document.getElementById("others")?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" }), 400);
    });
    node.querySelector("[data-clearcodes]")?.addEventListener("click", () => { saveFriends([]); renderResults(); });
    node.querySelector("[data-print]").addEventListener("click", () => window.print());
    node.querySelector("[data-copy]").addEventListener("click", async () => {
      const lines = [headline, "", ...D.dimOrder.map((d) => `${D.dims[d].name}: ${sc[d]} (${band(sc[d]).label})`), "", `Answer quality: ${r.confidence.label}`, "Self-reflection only, not a diagnosis. Made by SirStig."];
      try { await navigator.clipboard.writeText(lines.join("\n")); window.HM.toast("Summary copied"); } catch (_) { window.HM.toast("Couldn't copy"); }
    });
    node.querySelector("[data-restart]").addEventListener("click", () => {
      if (!confirm("Start over? Your current answers will be cleared from this browser.")) return;
      const reason = st.reason; st = fresh(); st.reason = reason; resumeAt = 0; save(); go(0);
    });
    mount(node);
  };

  const render = () => {
    const s = steps[st.idx];
    updateProgress();
    switch (s.type) {
      case "welcome": return renderWelcome();
      case "intro": return renderIntro(s);
      case "likert": return renderScale(s, LIKERT, "");
      case "frequency": return renderScale(s, FREQ, "four");
      case "scenario": case "reading": return renderChoice(s);
      case "pair": return renderPair(s);
      case "slider": return renderSlider(s);
      case "familiarity": return renderFamiliarity(s);
      case "quick": return renderQuick(s);
      case "results": return renderResults();
    }
  };

  if (st.finishedAt && location.hash === "#results") {
    st.idx = steps.length - 1;
  } else {
    resumeAt = st.finishedAt ? 0 : Math.min(st.idx, steps.length - 2);
    st.idx = 0;
  }
  render();
})();
