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
    $("#navNye").hidden = false;   // New Year's has its own tab on both sides; Meals stays family-only
    $("#navMeals").hidden = hubMode === "company";
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
  const nyeSaved = () => savedMenus.filter(x => x.names.some(n => /new year/i.test(n)));
  const nyeTheme = () => { try { return ptTheme(); } catch (e) { return null; } };
  function renderNyeParty() {
    const m = mealById("nyeparty"); if (!m) return;
    const c = cfgFor("nyeparty"), p = mealSizes(m, c), active = !!planOf("nyeparty");
    const ps = pricedShop(m, p.f, p);
    if (!mealCfg.nyeparty || !mealCfg.nyeparty.guests) { mealCfg.nyeparty = Object.assign({}, mealCfg.nyeparty, { guests: 6 }); save("mealCfg", mealCfg); return renderNyeParty(); }
    const th = nyeTheme();
    $("#nyePartySum").innerHTML = `<h4 class="nye-step"><span>1</span> Who is coming, and when</h4>
      <div class="wz-row"><div class="stepper"><button type="button" data-nyeg="-1" aria-label="Fewer guests">−</button><output>${c.guests}</output><button type="button" data-nyeg="1" aria-label="More guests">+</button></div><span class="wz-lab">guests</span>
      <label class="wz-time"><span class="wz-lab">Party starts</span><input class="input" type="time" id="nyeTime" value="${esc(c.time)}"></label></div>
      <h4 class="nye-step"><span>2</span> How much food</h4>
      <div class="seg sub-tabs meal-done pm-two" role="group" aria-label="Will you serve dinner too?">
        <button type="button" data-nyemode="meal" aria-pressed="${c.mode !== "before"}"><b>Appetizers are the meal</b><small>About 12 bites per guest</small></button><button type="button" data-nyemode="before" aria-pressed="${c.mode === "before"}"><b>Light bites before dinner</b><small>About 5 bites per guest</small></button></div>
      <h4 class="nye-step"><span>3</span> Your appetizers</h4>
      <div class="seg sub-tabs meal-done pm-two" role="group" aria-label="Which appetizers">
        <button type="button" data-nyeoff="set" aria-pressed="${!c.picks}"><b>Our set menu</b><small>Ready to go</small></button><button type="button" data-nyeown aria-pressed="${!!c.picks}"><b>Choose my own ›</b><small>${c.picks ? c.picks.length + " picked" : "Browse 30 ideas"}</small></button></div>
      <h4 class="nye-step"><span>4</span> A party theme <i>(optional)</i></h4>
      <button type="button" class="btn btn-ghost btn-block nye-theme-btn" data-nyetheme>${th ? esc(th.name) + " · Change theme ›" : "Add a party theme ›"}</button>
      <p class="cf-fine">${th ? "Your theme adds the decorations, games, music and a timeline for the night." : "Just want appetizers? Skip this step. A theme adds decorations, games, music and a timeline."}</p>
      <p class="party-total">About <b>${cad0(ps.total)}</b> · ${cad(ps.total / c.guests)} per guest<small>${currency} · ${c.picks ? "your own appetizer menu" : "our set New Year's Eve menu"}, includes the midnight toast.</small></p>` +
      (hubMode === "company" && window.__offPicks ? `<div class="seg sub-tabs meal-done pm-two nye-offmenu" role="group" aria-label="Which appetizer menu">
        <button type="button" data-nyeoff="set" aria-pressed="${!c.picks}"><b>Set New Year's menu</b><small>Our ready-made list</small></button><button type="button" data-nyeoff="office" aria-pressed="${!!c.picks}"><b>My office party menu</b><small>${window.__offPicks().length} appetizers from Food</small></button></div>` : "") +
      (active ? `<p class="nye-on">✅ Party alarms are set</p>` : "") + (active || nyeSaved().length ? `<button type="button" class="btn btn-ghost btn-block" data-nyestop>Cancel my New Year's plan</button>` : "") + (nyeSaved().length ? `<button type="button" class="btn btn-gold btn-block" data-print="savedmenu:${nyeSaved()[0].id}">Print my menu and shopping list</button>` : "") + (savedMenus.length ? `<button type="button" class="btn btn-ghost btn-block" data-nyesaved>My saved menus (${savedMenus.length})</button>` : "");
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
  document.addEventListener("click", e => {
    const b = e.target.closest("[data-nyeoff]"); if (!b) return;
    const c = cfgFor("nyeparty"); c.picks = b.dataset.nyeoff === "office" && window.__offPicks ? window.__offPicks() : null;
    mealCfg.nyeparty = c; save("mealCfg", mealCfg); renderNyeParty();
    toast(c.picks ? "🥂 Using your office party menu" : "🥂 Back to the set New Year's menu");
  });
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

  function renderNye() { renderNyeCount(); renderNyeParty(); renderJar(); renderNyeMenu(); }
  setInterval(() => { if ($("#view-nye").classList.contains("active")) renderNyeCount(); }, 1000);
  setInterval(applySeasonNav, 60000);

  // ---------- taps ----------
  $("#nyeBig").addEventListener("click", () => openShow(midnightTarget(), false));
  $("#nyePractice").addEventListener("click", () => openShow(Date.now() + 10500, true));
  $("#nyeShowClose").addEventListener("click", closeShow);
  $("#nyePlan").addEventListener("click", () => { planReview(["nyeparty"], "nye"); });
  $("#view-nye").addEventListener("click", e => {
    const g = e.target.closest("[data-nyeg]");
    if (g) { const c = cfgFor("nyeparty"); c.guests = Math.min(20, Math.max(1, c.guests + +g.dataset.nyeg)); mealCfg.nyeparty = c; save("mealCfg", mealCfg); if (planOf("nyeparty")) startMealPlan(mealById("nyeparty"), true); renderNyeParty(); return; }
    const md = e.target.closest("[data-nyemode]");
    if (md) { const c = cfgFor("nyeparty"); c.mode = md.dataset.nyemode; mealCfg.nyeparty = c; save("mealCfg", mealCfg); if (planOf("nyeparty")) startMealPlan(mealById("nyeparty"), true); renderNyeParty(); return; }
    if (e.target.closest("[data-nyeown]")) { const o = $("#view-nye [data-open=appsSheet]"); if (o) o.click(); return; }
    if (e.target.closest("[data-nyetheme]")) { const c = cfgFor("nyeparty"); try { pt.guests = Math.max(2, c.guests); pt.start = c.time; savePt(); } catch (err) {} $("#ptOpen").click(); return; }
    if (e.target.closest("[data-nyestop]")) { if (confirm("Cancel your New Year's Eve plan? This turns off its alarms and deletes the saved New Year's menu.")) { mealPlans = mealPlans.filter(p => p.id !== "nyeparty"); saveMealPlans(); syncMealNative(); savedMenus = savedMenus.filter(x => !nyeSaved().includes(x)); saveSaved(); renderNyeParty(); toast("Your New Year's plan is cancelled."); } return; }
    if (e.target.closest("[data-nyesaved]")) { mealView = "saved"; showView("meals"); window.scrollTo(0, 0); }
  });
  $("#view-nye").addEventListener("change", e => {
    if (e.target.id !== "nyeTime" || !e.target.value) return;
    const c = cfgFor("nyeparty"); c.time = e.target.value; mealCfg.nyeparty = c; save("mealCfg", mealCfg); if (planOf("nyeparty")) startMealPlan(mealById("nyeparty"), true); renderNyeParty();
  });
  $("#nyeCard").addEventListener("click", () => { ecard.d = "nyc"; save("ecard", ecard); syncCards(); showView("invites"); showPane("cards"); toast("🥂 Midnight Champagne card selected"); });
  document.addEventListener("click", e => { const g = e.target.closest("[data-goview]"); if (g) showView(g.dataset.goview); });

  // ---------- 📖 the New Year's menu: a quick first page, then "Build my party" opens the planner ----------
  let nyeScreen = "menu";
  const NYE_THEMES = [["Pajama & Champagne Gala", "Ultra-comfy clothes, fancy bites and bubbly"], ["Masquerade", "Masks on until the stroke of midnight"], ["Black, White & Gold Gala", "Classy, glam and very photogenic"],
    ["Family & Kids Countdown", "Early countdown, big fun, little ones in bed on time"], ["Vintage Casino Royale", "A high-stakes 1960s lounge"], ["Neon Glow Party", "Blacklights, glow sticks and high energy"], ["End of the World Lounge", "Cheeky, dramatic, last-night-on-Earth glamour"]];
  function renderNyeMenu() {
    const el = $("#nyeMenu"), v = $("#view-nye"); if (!el) return;
    const on = nyeScreen === "menu"; v.classList.toggle("on-menu", on); el.hidden = !on; if (!on || el.dataset.built) return; el.dataset.built = "1";
    const go = `<button type="button" class="menu-go" data-nyego>Noël's plans <span>›</span></button>`;
    const m = mealById("nyeparty"), all = m ? (m.menuFor ? m.menuFor(mealSizes(m, cfgFor("nyeparty"))) : m.menu) : [];
    const clean = i => esc(String(i).replace(/\s*\(24 pieces\)/, ""));
    const food = all.filter(([c]) => !/drink|pairing/i.test(c)).flatMap(([, it]) => it.map(clean)), drinks = all.filter(([c]) => /drink/i.test(c)).flatMap(([, it]) => it.map(clean));
    const dot = " <i>·</i> ", blk = (name, body) => `<div class="menu-dish"><h4>${name}</h4>${body}</div><p class="menu-rule sm"><span></span>✦<span></span></p>`;
    const own = `<button type="button" class="menu-go menu-skip" data-nyeown>My own plans</button>`;
    el.innerHTML = `<div class="menu-top">${own}${go}</div>
      <p class="menu-star">✦</p><h2 class="menu-title">New Year's Eve</h2><p class="menu-sub">Party bites, games and a midnight countdown, all planned for you</p><p class="menu-rule"><span></span>✦<span></span></p>
      <h3 class="menu-group">The Party</h3>` +
      blk("New Year's Eve Party", `<p class="menu-items">${food.join(dot)}</p><p class="menu-drinks"><b>Drinks</b> ${drinks.join(dot)}</p>`) +
      `<h3 class="menu-group">Party Themes</h3>` +
      blk("Pick your style", `<p class="menu-items">${NYE_THEMES.map(t => esc(t[0])).join(dot)}</p>`) +
      `<h3 class="menu-group">Games</h3>` +
      blk("Pass the phone and play", `<p class="menu-items">Who Wrote It?${dot}Would You Rather${dot}Who's Most Likely To${dot}Two Truths &amp; a Midnight Lie${dot}Guess the Resolution${dot}Draw the Countdown${dot}Happy New Year Categories${dot}10-Second Countdown${dot}Year-in-Review Quiz</p>`) +
      `<h3 class="menu-group">Midnight</h3>` +
      blk("The finishing touches", `<p class="menu-items">Big Countdown with fireworks${dot}Wishes Jar${dot}Midnight Champagne card${dot}Appetizer Ideas${dot}Printable Party Planner</p>`) +
      `<p class="menu-note">Choose your guests and start time, and Noël builds the rest.</p>
      <div class="menu-bottom"><p class="menu-ready">Ready to build your night?</p>${go}<button type="button" class="menu-own" data-nyecount>Just here for the countdown? Open it ›</button></div>`;
  }
  document.addEventListener("click", e => {   // opening My Own Dinner from anywhere but New Year's resets its back buttons
    if (e.target.closest && e.target.closest("[data-goview=own],[data-menuskip],[data-svown],[data-offown]")) {
      const f = $("#view-own .meal-back.fam-only"), c = $("#view-own .meal-back.co-only");
      if (f) { f.dataset.goview = "meals"; f.textContent = "‹ The Noël menu"; } if (c) { c.dataset.goview = "planner"; c.textContent = "‹ Planner"; }
    }
  }, true);
  document.addEventListener("click", e => {
    const nav = e.target.closest && e.target.closest("[data-goview=nye],[data-view=nye]");
    if (nav) { nyeScreen = "menu"; setTimeout(renderNyeMenu, 0); }
  }, true);
  $("#view-nye").addEventListener("click", e => {
    if (e.target.closest("[data-nyeown]")) {   // 📝 my own plans: the typed notebook, set up for New Year's Eve
      const co = hubMode === "company", nm = co ? "New Year's Eve party" : "My New Year's Eve";
      let d = ownDinners.find(x => x.title === nm);
      if (!d) { d = ownNew(); d.title = nm; const n = new Date(), y = n.getMonth() === 0 ? n.getFullYear() - 1 : n.getFullYear(); d.date = y + "-12-31"; d.time = "20:00"; ownDinners.push(d); }
      ownId = d.id; saveOwn(); showView("own");
      $$("#view-own .meal-back").forEach(b => { b.dataset.goview = "nye"; b.textContent = "‹ New Year's Eve"; });
      window.scrollTo(0, 0); return;
    }
    if (e.target.closest("[data-nyego]")) { nyeScreen = "build"; renderNyeMenu(); window.scrollTo(0, 0); }
    if (e.target.closest("[data-nyemenu]")) { nyeScreen = "menu"; renderNyeMenu(); window.scrollTo(0, 0); }
    if (e.target.closest("[data-nyecount]")) { nyeScreen = "build"; renderNyeMenu(); window.scrollTo(0, 0); }
  });
  /* @nye-end */
