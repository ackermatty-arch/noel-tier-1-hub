  /* ============================================================
     🥂 NEW YEAR'S EVE SCREEN
     - Live countdown to midnight + a full-screen 10-second countdown
       with fireworks, beeps and music (and a 10-second practice run)
     - Party planner (opens the NYE party in the Meal Planner engine)
     - Party games, appetizer ideas, printable planner, New Year's card
     - Wishes Jar: everyone seals a wish to open next New Year's Eve
     - The 🥂 button replaces Meals in the menu from Dec 26 to Jan 6
     ============================================================ */
  const nyeSeason = (d = new Date()) => (d.getMonth() === 11 && d.getDate() >= 26) || (d.getMonth() === 0 && d.getDate() <= 6);
  function applySeasonNav() {
    const nye = nyeSeason();
    $("#navNye").hidden = !nye || hubMode === "company";   // the New Year's screen is a family thing
    $("#navMeals").hidden = hubMode === "company" || nye;
  }
  const midnightTarget = () => { const n = new Date(); return new Date(n.getFullYear() + 1, 0, 1).getTime(); };
  const isNewYearsDay = () => { const n = new Date(); return n.getMonth() === 0 && n.getDate() === 1; };
  const two = x => String(x).padStart(2, "0");

  function renderNyeCount() {
    const el = $("#nyeCount"); if (!el) return;
    if (isNewYearsDay()) { el.innerHTML = `<div class="nc-k">It's here!</div><div class="nc-big">Happy New Year ${new Date().getFullYear()}!</div>`; return; }
    const ms = Math.max(0, midnightTarget() - Date.now()), s = Math.floor(ms / 1000);
    const d = Math.floor(s / 86400), h = Math.floor(s % 86400 / 3600), m = Math.floor(s % 3600 / 60), ss = s % 60;
    el.innerHTML = `<div class="nc-k">Midnight in</div>
      <div class="nc-big">${d ? `<span>${d}<small>${d === 1 ? "day" : "days"}</small></span>` : ""}<span>${two(h)}<small>hrs</small></span><span>${two(m)}<small>min</small></span><span>${two(ss)}<small>sec</small></span></div>
      <div class="nc-sub">Welcome to ${new Date(midnightTarget()).getFullYear()}</div>`;
    // open the big countdown by itself in the last minute, if this screen is showing
    if (s <= 60 && s > 0 && $("#view-nye").classList.contains("active") && !$("#nyeShow").classList.contains("show")) openShow(midnightTarget(), false);
  }

  // ---------- 🎆 the big countdown ----------
  let showTarget = 0, showTimer = null, lastBeep = null, fwRun = false, showAudio = null, showPractice = false;
  function beep(freq, len) {
    const ac = getAudio(); if (!ac) return;
    try {
      const o = ac.createOscillator(), g = ac.createGain(); o.type = "sine"; o.frequency.value = freq;
      g.gain.setValueAtTime(0.0001, ac.currentTime); g.gain.exponentialRampToValueAtTime(0.35, ac.currentTime + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + len);
      o.connect(g).connect(ac.destination); o.start(); o.stop(ac.currentTime + len + 0.05);
    } catch (e) {}
  }
  function openShow(target, practice) {
    getAudio(); if (!music.paused) pauseMusic();
    showTarget = target; showPractice = practice; lastBeep = null;
    $("#nyeShowMsg").textContent = ""; $("#nyeShowBig").textContent = ""; $("#nyeShowSub").textContent = practice === "kids" ? "Kids' countdown!" : practice ? "Practice run" : "until midnight";
    $("#nyeShow").classList.add("show"); document.body.classList.add("lock");
    clearInterval(showTimer); showTimer = setInterval(stepShow, 100); stepShow();
  }
  function stepShow() {
    const left = showTarget - Date.now(), s = Math.ceil(left / 1000);
    const big = $("#nyeShowBig");
    if (left > 10000) {
      const t = Math.floor(left / 1000), h = Math.floor(t / 3600), m = Math.floor(t % 3600 / 60), ss = t % 60;
      big.className = "ns-clock"; big.textContent = (h ? h + ":" + two(m) : m) + ":" + two(ss);
    } else if (left > 0) {
      big.className = "ns-num"; if (big.textContent !== String(s)) { big.textContent = String(s); big.classList.remove("pop"); void big.offsetWidth; big.classList.add("pop"); }
      if (lastBeep !== s) { lastBeep = s; beep(s <= 3 ? 1046 : 880, 0.18); if (navigator.vibrate) navigator.vibrate(40); }
      $("#nyeShowSub").textContent = "";
    } else {
      clearInterval(showTimer);
      const yr = showPractice ? new Date(midnightTarget()).getFullYear() : new Date(showTarget + 1000).getFullYear();
      big.className = "ns-msg"; big.textContent = "Happy New Year!";
      $("#nyeShowSub").textContent = String(yr);
      [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => beep(f, 0.6), i * 120));
      if (navigator.vibrate) navigator.vibrate([200, 100, 200, 100, 400]);
      try { showAudio = new Audio((window.CARD_SONGS && window.CARD_SONGS.newyear) || ""); showAudio.play().catch(() => {}); } catch (e) {}
      fireworks();
    }
  }
  function closeShow() {
    clearInterval(showTimer); fwRun = false; if (showAudio) { showAudio.pause(); showAudio = null; }
    $("#nyeShow").classList.remove("show"); if (!$(".sheet.open")) document.body.classList.remove("lock");
  }
  function fireworks() {
    const cv = $("#nyeFw"), ctx = cv.getContext("2d"), dpr = Math.min(2, window.devicePixelRatio || 1);
    const W = cv.width = innerWidth * dpr, H = cv.height = innerHeight * dpr;
    const cols = ["#D9BF8C", "#f2d68a", "#ffffff", "#e85a5a", "#7fb3ff", "#9ee6a8"], parts = [];
    let lastBurst = 0; const start = performance.now(); fwRun = true;
    const burst = () => {
      const x = W * (0.15 + Math.random() * 0.7), y = H * (0.12 + Math.random() * 0.4), c = cols[Math.random() * cols.length | 0], n = 70;
      for (let i = 0; i < n; i++) { const a = Math.PI * 2 * i / n, v = (1.5 + Math.random() * 3.5) * dpr; parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 1, c }); }
    };
    const frame = now => {
      if (!fwRun) { ctx.clearRect(0, 0, W, H); return; }
      ctx.globalCompositeOperation = "destination-out"; ctx.fillStyle = "rgba(0,0,0,0.22)"; ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = "lighter";
      if (now - lastBurst > 450 && now - start < 25000) { burst(); lastBurst = now; }
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i]; p.x += p.vx; p.y += p.vy; p.vy += 0.05 * dpr; p.vx *= 0.985; p.vy *= 0.985; p.life -= 0.012;
        if (p.life <= 0) { parts.splice(i, 1); continue; }
        ctx.globalAlpha = p.life; ctx.fillStyle = p.c; ctx.beginPath(); ctx.arc(p.x, p.y, 2.2 * dpr, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;
      if (now - start < 32000 || parts.length) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }

  // ---------- 🎉 party planner card ----------
  function renderNyeParty() {
    const m = mealById("nyeparty"); if (!m) return;
    const c = cfgFor("nyeparty"), p = mealSizes(m, c), active = !!planOf("nyeparty");
    const ps = pricedShop(m, p.f, p);
    $("#nyePartySum").innerHTML = `<b>${c.guests} guests</b> · starts ${mclock(dinnerAt(c))} · ${p.items.length} appetizers · about <b>${cad0(ps.total)}</b>` +
      (active ? `<br><span class="nye-on">✅ Party alarms are set</span>` : "");
  }

  // ---------- 💫 wishes jar ----------
  let wishesJar = load("wishesJar", { items: [] });   // { y: season year, name, text, at }
  const seasonYear = () => { const n = new Date(); return n.getMonth() === 0 && n.getDate() <= 6 ? n.getFullYear() - 1 : n.getFullYear(); };
  const revealAt = y => new Date(y + 1, 11, 31, 18, 0).getTime();   // a year later, on New Year's Eve at 6 PM
  function renderJar() {
    const y = seasonYear(), mine = wishesJar.items.filter(w => w.y === y);
    const ready = wishesJar.items.filter(w => w.y < y && Date.now() >= revealAt(w.y));
    const sealed = wishesJar.items.filter(w => w.y < y && Date.now() < revealAt(w.y));
    $("#jarSealed").innerHTML = mine.length ? `🔒 <b>${mine.length}</b> ${mine.length === 1 ? "wish" : "wishes"} sealed this year: ${mine.map(w => esc(w.name)).join(", ")}<br><small>They open on New Year's Eve ${y + 1}.</small>` : "No wishes sealed yet. Pass the phone around!";
    $("#jarReveal").innerHTML = ready.length ? `<h4>🎁 Your wishes from last year</h4>` + ready.map(w => `<p class="wish-open"><b>${esc(w.name)}</b> (${w.y + 1}): “${esc(w.text)}”</p>`).join("") :
      sealed.length ? `<p class="wish-wait">🔒 ${sealed.length} older ${sealed.length === 1 ? "wish is" : "wishes are"} still sealed.</p>` : "";
  }
  $("#jarForm").addEventListener("submit", e => {
    e.preventDefault(); const f = e.target, name = f.wname.value.trim(), text = f.wtext.value.trim();
    if (!name || !text) { toast("💫 Add your name and your wish"); return; }
    wishesJar.items.push({ y: seasonYear(), name: name.slice(0, 30), text: text.slice(0, 200), at: Date.now() }); save("wishesJar", wishesJar);
    f.wname.value = ""; f.wtext.value = ""; renderJar(); toast("🔒 Sealed! Pass the phone to the next person");
  });
  $("#jarPeek").addEventListener("click", () => {
    const mine = wishesJar.items.filter(w => w.y === seasonYear());
    if (!mine.length) { toast("No wishes sealed yet"); return; }
    if (!confirm("Peek at this year's wishes? They're meant to stay secret until next New Year's Eve!")) return;
    $("#jarReveal").innerHTML = `<h4>👀 This year's wishes</h4>` + mine.map(w => `<p class="wish-open"><b>${esc(w.name)}</b>: “${esc(w.text)}”</p>`).join("");
  });

  function renderNye() { renderNyeCount(); renderNyeParty(); renderJar(); }
  setInterval(() => { if ($("#view-nye").classList.contains("active")) renderNyeCount(); }, 1000);
  setInterval(applySeasonNav, 60000);

  // ---------- taps ----------
  $("#nyeBig").addEventListener("click", () => openShow(midnightTarget(), false));
  $("#nyePractice").addEventListener("click", () => openShow(Date.now() + 10500, true));
  $("#nyeShowClose").addEventListener("click", closeShow);
  $("#nyePlan").addEventListener("click", () => { showView("meals"); openMeal("nyeparty"); });
  $("#nyeCard").addEventListener("click", () => { ecard.d = "nyc"; save("ecard", ecard); syncCards(); showView("invites"); showPane("cards"); toast("🥂 Midnight Champagne card selected"); });
  document.addEventListener("click", e => { const g = e.target.closest("[data-goview]"); if (g) showView(g.dataset.goview); });
  /* @nye-end */
