  /* ============================================================
     🍽️ MEAL PLANNER (Family edition)
     Pick a dinner → guests (1–20) + dinner time → Noël scales every
     recipe and the shopping list, builds the day's timeline and sets
     all the alarms. Print gives a paper backup for power cuts.
     Recipes live in NOEL_MEALS (the "noel-meals-data" script).
     ============================================================ */
  const MD = window.NOEL_MEALS;
  let mealSel = load("mealSel", { id: null, tab: "traditional", pane: "timeline" });
  let mealCfg = load("mealCfg", {});                 // { turkey: { guests, date, time } }
  let mealPlan = load("mealPlan", null);             // the running plan with its alarms
  let mealTicks = load("mealTicks", {});             // shopping list ticks
  let mealPrices = load("mealPrices", {});           // the buyer's own prices, saved as a ratio of our estimate
  let foodBudget = load("foodBudget", { limit: 0, items: [] });   // 💵 separate from the gift budget
  const cad = x => "$" + (Math.round(x * 100) / 100).toFixed(2);
  const cad0 = x => "$" + Math.round(x).toLocaleString();
  function pricedShop(m, f, p) {
    const pf = mealPrices[m.id] || {}, ticks = mealTicks[m.id] || {};
    let total = 0, left = 0;
    const groups = m.shop(f, p).map(([dept, items]) => [dept, items.map(([q, name, est]) => {
      const key = dept + "|" + name, price = est == null ? null : est * (pf[key] || 1);
      if (price != null) { total += price; if (!ticks[key]) left += price; }
      return { q, name, key, est, price, on: !!ticks[key], edited: !!pf[key] };
    })]);
    return { groups, total, left };
  }
  const mealById = id => MD.meals.find(m => m.id === id);
  const UNIT_TSP = { cup: 48, tbsp: 3, tsp: 1 };

  function nextXmasDate() {
    const now = new Date(); let y = now.getFullYear();
    if (now > new Date(y, 11, 25, 23, 59)) y++;
    return `${y}-12-25`;
  }
  function cfgFor(id) {
    const c = mealCfg[id] || {};
    return { guests: Math.min(20, Math.max(1, +c.guests || 12)), date: c.date || nextXmasDate(), time: c.time || "17:00" };
  }
  const dinnerAt = c => { const [y, mo, d] = c.date.split("-").map(Number), [h, mi] = c.time.split(":").map(Number); return new Date(y, mo - 1, d, h, mi).getTime(); };
  const mclock = t => new Date(t).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  const dayName = t => new Date(t).toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });

  // ---- amounts: scale, then show in friendly kitchen units ----
  function ingLine(ing, f, p) {
    if (ing.head) return { head: ing.head };
    let t = typeof ing.t === "function" ? ing.t(p) : ing.t;
    if (ing.q == null) return { text: Array.isArray(t) ? t[0] : t };
    const k = ing.s === "n" ? 1 : ing.s === "w" ? p.w / (p.wBase || 13) : ing.s === "p" ? p.pies : f;
    let v = ing.q * k, amt = "", many = v > 1.0001;
    if (UNIT_TSP[ing.u]) {
      const tsp = v * UNIT_TSP[ing.u];
      if (tsp >= 12 - 1e-9) { const c = Math.round(tsp / 48 * 8) / 8; amt = MD.frac(c) + (c > 1 ? " cups" : " cup"); }
      else if (tsp >= 3 - 1e-9) { const tb = Math.round(tsp / 3 * 2) / 2; amt = MD.frac(tb) + " tbsp"; }
      else { const ts = tsp < 0.2 ? 0.125 : Math.round(tsp * 4) / 4; amt = MD.frac(ts) + " tsp"; }
    } else if (ing.u === "lb") { amt = MD.frac(Math.max(0.25, Math.round(v * 4) / 4)) + " lb"; }
    else if (ing.u === "oz") { amt = v >= 16 ? MD.frac(Math.round(v / 16 * 4) / 4) + " lb" : Math.round(v) + " oz"; }
    else { const c = ing.up ? Math.ceil(v - 1e-9) : Math.max(1, Math.round(v)); amt = String(c); many = c > 1; }
    if (Array.isArray(t)) t = many ? t[1] : t[0];
    return { amt, text: t };
  }
  const val = (x, f, p) => typeof x === "function" ? x(f, p) : x;

  function mealSizes(m, guests) { return MD.plan[m.id] ? MD.plan[m.id](guests) : { g: guests, f: guests / 8, pies: 1, dishes: 1 }; }

  // ---- the day's alarms, as real times ----
  function buildSteps(m, c) {
    const p = mealSizes(m, c.guests), D = dinnerAt(c), out = [];
    m.ahead(p).forEach(([days, hour, icon, text], i) => {
      const d = new Date(D); d.setDate(d.getDate() - days); d.setHours(hour, 0, 0, 0);
      out.push({ k: "a" + i, t: d.getTime(), icon, text, alarm: true, ahead: true });
    });
    m.timeline(p).forEach((s, i) => out.push({ k: "s" + i, m: s.m, t: D + s.m * 60000, icon: s.icon, text: s.text, alarm: s.alarm, main: s.main }));
    return out.sort((a, b) => a.t - b.t);
  }

  // ---- screens ----
  function renderMealHome() {
    $("#mealTabs").innerHTML = MD.tabs.map(([k, l]) => `<button type="button" data-mtab="${k}" aria-pressed="${mealSel.tab === k}">${l}</button>`).join("");
    $("#mealList").innerHTML = MD.meals.filter(m => m.tab === mealSel.tab).map(m => `
      <button type="button" class="card meal-card${m.soon ? " soon" : ""}" data-meal="${m.id}">
        <span class="meal-ico">${m.icon}</span>
        <span class="meal-txt"><b>${esc(m.name)}</b><small>${esc(m.blurb)}</small></span>
        <span class="meal-go">${m.soon ? "Soon" : "›"}</span>
      </button>`).join("");
  }
  function openMeal(id) {
    const m = mealById(id); if (!m) return;
    if (m.soon) { toast("🍽️ This menu is coming soon"); return; }
    mealSel.id = id; save("mealSel", mealSel); renderMeals(); window.scrollTo({ top: 0 });
  }
  function renderMeals() {
    const m = mealSel.id && mealById(mealSel.id);
    $("#mealHome").hidden = !!m; $("#mealDetail").hidden = !m;
    if (!m || m.soon) { mealSel.id = null; $("#mealHome").hidden = false; $("#mealDetail").hidden = true; renderMealHome(); }
    else renderMealDetail(m);
    renderMaster();
  }

  function renderMealDetail(m) {
    const c = cfgFor(m.id), p = mealSizes(m, c.guests), f = p.f, D = dinnerAt(c);
    const active = mealPlan && mealPlan.id === m.id;
    const steps = buildSteps(m, c), tIn = steps.find(s => s.main);
    const panes = [["timeline", "⏰ Timeline"], ["shop", "🛒 Shopping"], ["recipes", "📖 Recipes"], ["menu", "🥂 Menu"]];
    const pane = panes.some(x => x[0] === mealSel.pane) ? mealSel.pane : "timeline";
    let body = "";
    if (pane === "timeline") {
      let lastDay = "";
      body = `<ol class="meal-tl">` + steps.map(s => {
        const day = dayName(s.t), head = day !== lastDay ? `<li class="tl-day">${esc(day)}</li>` : ""; lastDay = day;
        const st = active && mealPlan.steps.find(x => x.k === s.k), past = st && st.fired;
        return head + `<li class="${past ? "done" : ""}${s.m === 0 ? " serve" : ""}"><time>${s.ahead ? "All day" : mclock(s.t)}</time><span>${s.icon} ${esc(s.text)}</span></li>`;
      }).join("") + `</ol>`;
    } else if (pane === "shop") {
      const ps = pricedShop(m, f, p);
      body = `<div class="shop-total" id="shopTotal">${shopTotalHtml(ps, c.guests)}</div>
        <button type="button" class="btn btn-gold btn-block" id="shopToBudget">💵 Add to my food budget</button>
        <p class="shop-note">Rough Canadian prices (CAD). Tap any price to match your store. Pantry staples you likely have aren't counted.</p>` +
        ps.groups.map(([dept, items]) => `<h4 class="shop-dept">${esc(dept)}</h4><ul class="shop-list">` + items.map(it =>
          `<li><label class="${it.on ? "on" : ""}"><input type="checkbox" data-shop="${esc(it.key)}" ${it.on ? "checked" : ""}><span>${it.q ? `<b>${esc(it.q)}</b> ` : ""}${esc(it.name)}</span></label>` +
          (it.price != null ? `<span class="shop-cad">$</span><input class="shop-price${it.edited ? " edited" : ""}" data-price="${esc(it.key)}" data-est="${it.est}" inputmode="decimal" value="${it.price.toFixed(2)}" aria-label="Price for ${esc(it.name)}">` : "") + `</li>`
        ).join("") + `</ul>`).join("") +
        `<div class="send-btns"><button type="button" class="btn btn-ghost" id="shopClear">Untick everything</button><button type="button" class="btn btn-ghost" id="priceReset">Reset prices</button></div>`;
    } else if (pane === "recipes") {
      body = m.recipes.map(r => recipeHtml(r, f, p)).join("");
    } else {
      body = m.menu.map(([course, items]) => `<h4 class="shop-dept">${esc(course)}</h4><ul class="menu-list">${items.map(i => `<li>${esc(i)}</li>`).join("")}</ul>`).join("") +
        `<h4 class="shop-dept">Drink pairings</h4>` + m.drinks.map(([k, v]) => `<p class="drink"><b>${esc(k)}:</b> ${esc(v)}</p>`).join("");
    }
    $("#mealDetail").innerHTML = `
      <button type="button" class="meal-back" id="mealBack">‹ All meals</button>
      <h3 class="meal-title">${m.icon} ${esc(m.name)}</h3>
      <div class="card meal-setup">
        <div class="meal-row"><span class="meal-lab">Guests</span>
          <div class="stepper"><button type="button" data-g="-1" aria-label="Fewer guests">−</button><output id="mealGuests">${c.guests}</output><button type="button" data-g="1" aria-label="More guests">+</button></div></div>
        <div class="meal-row two">
          <label><span class="meal-lab">Dinner date</span><input class="input" type="date" id="mealDate" value="${c.date}"></label>
          <label><span class="meal-lab">Dinner time</span><input class="input" type="time" id="mealTime" value="${c.time}"></label></div>
        ${p.w ? `<p class="meal-sum">${p.icon} <b>${p.w} lb ${p.meat}</b> · ${p.verb} about ${p.roastText} · into the oven at <b>${tIn ? mclock(tIn.t) : ""}</b>${p.bigNote ? `<br><small>${p.bigNote}</small>` : ""}</p>` : ""}
        <div class="send-btns">
          ${active ? `<button type="button" class="btn btn-ghost" id="mealStop">⏹ Stop dinner alarms</button>` : `<button type="button" class="btn btn-red" id="mealStart">⏰ Start my dinner alarms</button>`}
          <button type="button" class="btn btn-green" id="mealPrint">🖨️ Print everything</button>
        </div>
        ${active ? `<p class="meal-on">✅ Alarms are set. Noël will ring for every step${NoelNative.isNative() ? ", even when the app is closed" : ". Keep Noël open on this device"}.</p>` : ""}
      </div>
      <div class="seg seg4 sub-tabs" id="mealPanes">${panes.map(([k, l]) => `<button type="button" data-mpane="${k}" aria-pressed="${k === pane}">${l}</button>`).join("")}</div>
      <div class="card meal-body">${body}</div>`;
    if (active && (mealPlan.guests !== c.guests || mealPlan.at !== D)) $("#mealDetail .meal-on").innerHTML = "⚠️ You changed the guests or time. Tap <b>Stop</b>, then <b>Start</b> again to update the alarms.";
  }

  function shopTotalHtml(ps, guests) {
    return `<div><span>Estimated total</span><b>${cad0(ps.total)}</b><small>about ${cad(ps.total / guests)} per guest</small></div>
      <div><span>Still to buy</span><b>${cad0(ps.left)}</b><small>items not ticked off</small></div>`;
  }
  function recipeHtml(r, f, p) {
    const note = val(r.note, f, p);
    return `<details class="recipe"><summary><span class="r-course">${esc(r.course)}</span>${esc(r.name)}</summary>
      <p class="r-meta">Prep ${esc(val(r.prep, p) || "")} · Cook ${esc(typeof r.cook === "function" ? r.cook(p) : r.cook)}${r.rest ? " · Rest " + esc(typeof r.rest === "function" ? r.rest(p) : r.rest) : ""} · Makes ${esc(val(r.yieldText, f, p))}</p>
      ${note ? `<p class="r-note">${esc(note)}</p>` : ""}
      <ul class="r-ing">${r.ing.map(i => { const l = ingLine(i, f, p); return l.head ? `<li class="r-head">${esc(l.head)}</li>` : `<li>${l.amt ? `<b>${esc(l.amt)}</b> ` : ""}${esc(l.text)}</li>`; }).join("")}</ul>
      <ol class="r-steps">${r.steps.map(s => `<li>${esc(typeof s === "function" ? s(p) : s)}</li>`).join("")}</ol>
      ${r.tip ? `<p class="r-tip"><b>Chef's tip:</b> ${esc(r.tip)}</p>` : ""}</details>`;
  }

  // ---- alarms ----
  function startMealPlan(m) {
    const c = cfgFor(m.id), D = dinnerAt(c), now = Date.now();
    if (D < now) { toast("🕰️ That dinner time has passed. Pick a time in the future."); return; }
    const steps = buildSteps(m, c).map(s => ({ k: s.k, t: s.t, icon: s.icon, text: s.text, alarm: s.alarm, fired: s.t <= now }));
    mealPlan = { id: m.id, name: m.name, guests: c.guests, at: D, steps };
    save("mealPlan", mealPlan); syncMealNative(); getAudio();
    const missed = steps.filter(s => s.fired).length;
    toast(missed ? `⏰ Dinner alarms set. ${missed} earlier step${missed > 1 ? "s were" : " was"} already past.` : "⏰ Dinner alarms are set!");
    renderMeals();
  }
  function stopMealPlan() {
    mealPlan = null; save("mealPlan", null); syncMealNative(); renderMeals(); toast("⏹ Dinner alarms stopped");
  }
  function syncMealNative() {
    if (!NoelNative.isNative()) return;
    const items = mealPlan ? mealPlan.steps.filter(s => s.alarm && !s.fired && s.t > Date.now() + 1000).map(s => ({ t: s.t, title: `${s.icon} ${s.text}`, body: `${mealPlan.name} · dinner at ${mclock(mealPlan.at)}` })) : [];
    NoelNative.scheduleList(3000, 5000, items);
  }
  function mealTick() {
    if (!mealPlan) return;
    const now = Date.now(), due = mealPlan.steps.filter(s => s.alarm && !s.fired && s.t <= now);
    if (!due.length) return;
    due.forEach(s => { s.fired = true; });
    save("mealPlan", mealPlan);
    const fresh = due.filter(s => now - s.t < 10 * 60000);   // don't ring for steps long past (e.g. phone was off)
    if (fresh.length) triggerAlert(fresh.map(s => ({ id: "meal:" + s.k })));
    if ($("#view-meals").classList.contains("active")) renderMeals();
  }
  function mealAlertItem(id) {
    if (!mealPlan || !String(id).startsWith("meal:")) return null;
    const s = mealPlan.steps.find(x => "meal:" + x.k === id);
    return s ? { icon: s.icon, name: s.text } : null;
  }
  function mealSnooze(ids) {
    if (!mealPlan) return;
    ids.forEach(id => { const s = mealPlan.steps.find(x => "meal:" + x.k === id); if (s) { s.t = Date.now() + 300000; s.fired = false; } });
    save("mealPlan", mealPlan); syncMealNative();
  }

  // ---- master timer: one countdown to dinner, with what's now and next ----
  function renderMaster() {
    const el = $("#mealMaster");
    if (!mealPlan || Date.now() > mealPlan.at + 3 * 3600000) { el.hidden = true; return; }
    const now = Date.now(), left = mealPlan.at - now;
    const next = mealPlan.steps.find(s => s.t > now), last = [...mealPlan.steps].reverse().find(s => s.t <= now);
    const fmt = ms => { const s = Math.max(0, Math.floor(ms / 1000)), d = Math.floor(s / 86400), h = Math.floor(s % 86400 / 3600), m = Math.floor(s % 3600 / 60), ss = s % 60;
      return d ? `${d}d ${h}h ${m}m` : `${h ? h + ":" : ""}${String(m).padStart(h ? 2 : 1, "0")}:${String(ss).padStart(2, "0")}`; };
    el.hidden = false;
    el.innerHTML = `<div class="mm-k">${left > 0 ? "Dinner is served in" : "Dinner time!"}</div>
      <div class="mm-time">${left > 0 ? fmt(left) : "🍽️"}</div>
      ${last ? `<div class="mm-row"><b>Now</b> ${last.icon} ${esc(last.text)}</div>` : ""}
      ${next ? `<div class="mm-row"><b>Next</b> ${next.icon} ${esc(next.text)} · ${mclock(next.t)} <small>(in ${fmt(next.t - now)})</small></div>` : ""}`;
  }
  setInterval(() => { if ($("#view-meals").classList.contains("active")) renderMaster(); }, 1000);

  // ---- print (paper backup) ----
  function printMeal(m) {
    const c = cfgFor(m.id), p = mealSizes(m, c.guests), f = p.f, steps = buildSteps(m, c);
    let lastDay = "";
    const html = `<h1>${esc(m.name)}</h1><p class="pm-sub">${c.guests} guests · dinner ${esc(dayName(dinnerAt(c)))} at ${mclock(dinnerAt(c))}${p.w ? ` · ${p.w} lb ${p.meat}, about ${p.roastText}` : ""}</p>
      <h2>Timeline</h2><table class="pm-tl">${steps.map(s => { const d = dayName(s.t), h = d !== lastDay ? `<tr><th colspan="2">${esc(d)}</th></tr>` : ""; lastDay = d; return h + `<tr><td>${s.ahead ? "All day" : mclock(s.t)}</td><td>☐ ${esc(s.text)}</td></tr>`; }).join("")}</table>
      <h2>Shopping list</h2>${(ps => `<p><b>Estimated total: ${cad0(ps.total)} CAD</b> (about ${cad(ps.total / c.guests)} per guest)</p>` + ps.groups.map(([dept, items]) => `<h3>${esc(dept)}</h3><ul>${items.map(it => `<li>☐ ${it.q ? `<b>${esc(it.q)}</b> ` : ""}${esc(it.name)}${it.price != null ? ` · ${cad(it.price)}` : ""}</li>`).join("")}</ul>`).join(""))(pricedShop(m, f, p))}
      <h2>Menu</h2>${m.menu.map(([k, v]) => `<p><b>${esc(k)}:</b> ${esc(v.join(", "))}</p>`).join("")}
      ${m.drinks.map(([k, v]) => `<p><b>${esc(k)}:</b> ${esc(v)}</p>`).join("")}
      <h2>Recipes</h2>${m.recipes.map(r => recipeHtml(r, f, p).replace("<details", "<details open")).join("")}
      <p class="pm-foot">Made with Noël Tier 1 Hub · Earth &amp; Wonder</p>`;
    $("#printArea").innerHTML = html;
    if (NoelNative.isNative()) {   // 📱 iPhone: open the print-ready page in the share sheet (Print is in the list)
      const doc = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>${PRINT_CSS}</style></head><body><div id="printArea">${html}</div></body></html>`;
      NoelMedia.share(new Blob([doc], { type: "text/html" }), m.name.replace(/[^A-Za-z0-9]+/g, "-") + "-Plan.html", m.name).catch(() => {});
      return;
    }
    setTimeout(() => window.print(), 50);
  }
  const PRINT_CSS = `body{font:12pt/1.45 Georgia,serif;color:#222;margin:24px} h1{font-size:22pt;margin:0} h2{font-size:15pt;border-bottom:1.5px solid #B8935A;margin:22px 0 8px;padding-bottom:3px} h3{font-size:12pt;margin:12px 0 4px}
    .pm-sub{color:#555;margin:4px 0 0} table{border-collapse:collapse;width:100%} td,th{text-align:left;padding:3px 6px;vertical-align:top;border-bottom:1px solid #eee} th{background:#f4efe3} td:first-child{white-space:nowrap;width:80px}
    ul{margin:0;padding-left:0;list-style:none} details{margin:14px 0;break-inside:avoid-page} summary{font-weight:bold;font-size:13pt;list-style:none} .r-course{display:block;font-size:9pt;letter-spacing:.15em;text-transform:uppercase;color:#8a6d3b}
    .r-meta,.r-note{color:#555;font-size:10.5pt;margin:4px 0} .r-ing li{margin:1px 0} .r-head{font-weight:bold;margin-top:6px!important} .r-steps{padding-left:20px} .r-tip{font-style:italic} .pm-foot{margin-top:24px;color:#888;font-size:9pt;text-align:center}`;

  // ---- your own timers (when a meal plan isn't needed) ----
  $("#mealOwnForm").addEventListener("submit", e => {
    e.preventDefault();
    const fm = e.target, name = fm.oname.value.trim() || "Dinner timer";
    const secs = ((parseInt(fm.ohours.value, 10) || 0) * 60 + (parseInt(fm.omins.value, 10) || 0)) * 60;
    if (secs < 60) { toast("⏲️ Set at least 1 minute"); return; }
    const d = { id: "c-" + uid(), icon: "🍽️", name: name.slice(0, 40), custom: true, duration: secs, remaining: secs, endAt: null, status: "idle" };
    duties.push(d); startDuty(d, secs); commitDuties();
    fm.oname.value = ""; fm.ohours.value = ""; fm.omins.value = "";
    toast(`⏲️ "${d.name}" started. You'll find it in Alarms too.`);
    renderOwnTimers();
  });
  function renderOwnTimers() {
    const mine = duties.filter(d => d.icon === "🍽️" && d.custom && d.status === "running");
    $("#mealOwnList").innerHTML = mine.map(d => `<li>🍽️ ${esc(d.name)} · rings at ${mclock(d.endAt)}</li>`).join("");
  }

  // ---- taps ----
  $("#view-meals").addEventListener("click", e => {
    const t = e.target;
    const tab = t.closest("[data-mtab]"); if (tab) { mealSel.tab = tab.dataset.mtab; save("mealSel", mealSel); renderMealHome(); return; }
    const card = t.closest("[data-meal]"); if (card) { openMeal(card.dataset.meal); return; }
    if (t.closest("#mealBack")) { mealSel.id = null; save("mealSel", mealSel); renderMeals(); return; }
    const m = mealSel.id && mealById(mealSel.id); if (!m) return;
    const g = t.closest("[data-g]");
    if (g) { const c = cfgFor(m.id); c.guests = Math.min(20, Math.max(1, c.guests + +g.dataset.g)); mealCfg[m.id] = c; save("mealCfg", mealCfg); renderMealDetail(m); return; }
    const pn = t.closest("[data-mpane]"); if (pn) { mealSel.pane = pn.dataset.mpane; save("mealSel", mealSel); renderMealDetail(m); return; }
    if (t.closest("#mealStart")) { startMealPlan(m); return; }
    if (t.closest("#mealStop")) { if (confirm("Stop all the dinner alarms for this meal?")) stopMealPlan(); return; }
    if (t.closest("#mealPrint")) { printMeal(m); return; }
    if (t.closest("#shopToBudget")) {
      const c = cfgFor(m.id), p = mealSizes(m, c.guests), ps = pricedShop(m, p.f, p);
      const amt = Math.round(ps.total * 100) / 100, name = `${m.name} (${c.guests} guests)`;
      const it = foodBudget.items.find(x => x.meal === m.id);
      if (it) { it.name = name; it.amt = amt; } else foodBudget.items.push({ id: uid(), meal: m.id, name, amt });
      save("foodBudget", foodBudget); renderFoodBudget();
      toast(`💵 ${cad0(amt)} ${it ? "updated in" : "added to"} your food budget`); return;
    }
    if (t.closest("#priceReset")) { if (confirm("Go back to Noël's estimated prices?")) { mealPrices[m.id] = {}; save("mealPrices", mealPrices); renderMealDetail(m); } return; }
    if (t.closest("#shopClear")) { if (confirm("Untick everything on the shopping list?")) { mealTicks[m.id] = {}; save("mealTicks", mealTicks); renderMealDetail(m); } return; }
  });
  $("#view-meals").addEventListener("change", e => {
    const m = mealSel.id && mealById(mealSel.id); if (!m) return;
    const t = e.target;
    if (t.id === "mealDate" || t.id === "mealTime") {
      const c = cfgFor(m.id); if (t.id === "mealDate" && t.value) c.date = t.value; if (t.id === "mealTime" && t.value) c.time = t.value;
      mealCfg[m.id] = c; save("mealCfg", mealCfg); renderMealDetail(m); return;
    }
    if (t.dataset.shop) {
      const tk = mealTicks[m.id] = mealTicks[m.id] || {};
      if (t.checked) tk[t.dataset.shop] = 1; else delete tk[t.dataset.shop];
      save("mealTicks", mealTicks); t.closest("label").classList.toggle("on", t.checked);
      refreshShopTotal(m);
    }
    if (t.dataset.price) {
      const pf = mealPrices[m.id] = mealPrices[m.id] || {}, est = +t.dataset.est, v = parseFloat(String(t.value).replace(/[^0-9.]/g, ""));
      if (!isFinite(v) || v < 0 || !est) delete pf[t.dataset.price]; else pf[t.dataset.price] = v / est;
      save("mealPrices", mealPrices); refreshShopTotal(m);
      t.classList.toggle("edited", !!pf[t.dataset.price]);
      if (pf[t.dataset.price]) t.value = v.toFixed(2); else t.value = est.toFixed(2);
    }
  });
  function refreshShopTotal(m) {
    const c = cfgFor(m.id), p = mealSizes(m, c.guests), el = $("#shopTotal");
    if (el) el.innerHTML = shopTotalHtml(pricedShop(m, p.f, p), c.guests);
  }

  // ---- 💵 food budget (separate from gifts) ----
  function renderFoodBudget() {
    const spent = foodBudget.items.reduce((a, x) => a + (+x.amt || 0), 0), lim = +foodBudget.limit || 0;
    if (document.activeElement !== $("#fbLimit")) $("#fbLimit").value = lim ? lim : "";
    const pct = lim ? Math.min(100, spent / lim * 100) : 0, over = lim && spent > lim;
    $("#fbSummary").innerHTML = `<div class="fb-nums"><span>Planned <b>${cad0(spent)}</b></span>${lim ? `<span>${over ? "Over by" : "Left"} <b class="${over ? "over" : ""}">${cad0(Math.abs(lim - spent))}</b></span>` : ""}</div>` +
      (lim ? `<div class="fb-bar"><i style="width:${pct}%" class="${over ? "over" : ""}"></i></div>` : "");
    $("#fbList").innerHTML = foodBudget.items.map(x => `<li data-fb="${x.id}"><span>${x.meal ? "🍽️" : "🧾"} ${esc(x.name)}</span><b>${cad(+x.amt || 0)}</b><button type="button" class="icon-btn" data-fbdel aria-label="Remove ${esc(x.name)}">✕</button></li>`).join("") ||
      `<li class="fb-empty">Nothing added yet. Tap “Add to my food budget” on a meal's shopping list, or add your own below.</li>`;
  }
  $("#fbLimit").addEventListener("change", e => { const v = parseFloat(String(e.target.value).replace(/[^0-9.]/g, "")); foodBudget.limit = isFinite(v) && v > 0 ? v : 0; save("foodBudget", foodBudget); renderFoodBudget(); });
  $("#fbAdd").addEventListener("submit", e => {
    e.preventDefault(); const fm = e.target, name = fm.fname.value.trim(), amt = parseFloat(String(fm.famt.value).replace(/[^0-9.]/g, ""));
    if (!name || !isFinite(amt)) { toast("💵 Add a name and an amount"); return; }
    foodBudget.items.push({ id: uid(), name: name.slice(0, 50), amt: Math.round(amt * 100) / 100 }); save("foodBudget", foodBudget);
    fm.fname.value = ""; fm.famt.value = ""; renderFoodBudget();
  });
  $("#fbList").addEventListener("click", e => {
    const b = e.target.closest("[data-fbdel]"); if (!b) return;
    const id = b.closest("[data-fb]").dataset.fb, it = foodBudget.items.find(x => x.id === id);
    if (it && confirm(`Remove “${it.name}” from your food budget?`)) { foodBudget.items = foodBudget.items.filter(x => x !== it); save("foodBudget", foodBudget); renderFoodBudget(); }
  });
  renderFoodBudget();

  $("#mealSkip").addEventListener("click", e => { e.preventDefault(); $("#mealOwn").scrollIntoView({ behavior: "smooth", block: "start" }); });
  /* @meals-end */
