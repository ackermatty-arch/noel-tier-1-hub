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
  // ⏰ running plans with their alarms. More than one can run: Christmas Eve AND Christmas Day.
  let mealPlans = load("mealPlans", null);
  if (!Array.isArray(mealPlans)) { const old = load("mealPlan", null); mealPlans = old ? [old] : []; }
  mealPlans = mealPlans.filter(p => p && p.at > Date.now() - 2 * 86400000);   // tidy up finished nights
  const planOf = id => mealPlans.find(p => p.id === id);
  const saveMealPlans = () => save("mealPlans", mealPlans);
  // the Christmas Day dinner (for hosting reminders and the calendar): a sit-down plan that isn't on Christmas Eve
  const mainDinnerPlan = () => mealPlans.find(p => !p.party && !p.svc && !/-12-24$/.test(ymdOf(p.at))) || mealPlans.find(p => !p.party && !p.svc);
  const ymdOf = t => { const d = new Date(t); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; };
  const eveYmd = () => MD.eveDate(), dayYmd = () => nextXmasDate();
  // ⛪ Christmas Eve service (Midnight Mass, candlelight service): time + a reminder to leave
  let eveSvc = load("eveSvc", { time: "23:00", lead: 45, name: "" });
  let mealTicks = load("mealTicks", {});             // shopping list ticks
  let mealPrices = load("mealPrices", {});           // the buyer's own prices, saved as a ratio of our estimate
  let foodBudget = load("foodBudget", { limit: 0, items: [] });   // 💵 separate from the gift budget
  let mealAddons = load("mealAddons", {});           // 🌱 dietary add-ons switched on: { squash: true }
  // add-ons that join a main dinner (none for an add-on viewed on its own)
  const activeAddons = m => m.addon || m.party ? [] : MD.meals.filter(a => a.addon && mealAddons[a.id]).map(a => { const ac = cfgFor(a.id); return { a, c: ac, p: mealSizes(a, ac) }; });
  const addonSig = m => activeAddons(m).map(x => x.a.id + ":" + x.c.guests).join(",") + (m.party ? JSON.stringify([cfgFor(m.id).mode, cfgFor(m.id).picks]) : "");
  const recipesOf = (m, p) => m.recipesFor ? m.recipesFor(p) : m.recipes;
  // 💱 currency: our estimates are Canadian; US prices are roughly ¾ of the Canadian figure
  // first time: pick from the phone's region (en-US → USD, en-CA/fr-CA → CAD); the person's own choice always wins
  function guessCurrency() {
    try {
      const langs = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || ""];
      for (const l of langs) { const r = (String(l).split("-")[1] || "").toUpperCase(); if (r === "US") return "USD"; if (r === "CA") return "CAD"; }
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
      if (/^America\/(Toronto|Vancouver|Edmonton|Winnipeg|Halifax|Regina|St_Johns|Moncton|Whitehorse|Yellowknife|Iqaluit|Dawson_Creek|Glace_Bay|Goose_Bay|Swift_Current|Inuvik|Rankin_Inlet|Resolute|Cambridge_Bay|Atikokan|Creston|Fort_Nelson|Dawson)$/.test(tz)) return "CAD";
      if (/^(America\/(New_York|Chicago|Denver|Los_Angeles|Phoenix|Anchorage|Detroit|Boise|Indiana\/|Kentucky\/|North_Dakota\/)|Pacific\/Honolulu)/.test(tz)) return "USD";
    } catch (e) {}
    return "CAD";
  }
  let currency = load("currency", null) || guessCurrency();
  const FX = { CAD: 1, USD: 0.75 }, fx = () => FX[currency] || 1;
  const curName = () => currency === "USD" ? "US" : "Canadian";
  const currencySwitchHtml = () => `<div class="cur-switch" role="group" aria-label="Currency"><button type="button" data-cur="CAD" aria-pressed="${currency === "CAD"}">🇨🇦 CAD</button><button type="button" data-cur="USD" aria-pressed="${currency === "USD"}">🇺🇸 USD</button></div>`;
  const cad = x => "$" + (Math.round(x * 100) / 100).toFixed(2);
  const cad0 = x => "$" + Math.round(x).toLocaleString();
  function pricedShop(m, f, p) {
    const pf = mealPrices[m.id] || {}, ticks = mealTicks[m.id] || {};
    let total = 0, left = 0;
    const item = prefix => ([q, name, est], dept) => {
      if (est != null) est = est * fx();   // estimates in the chosen currency
      const key = prefix + dept + "|" + name, price = est == null ? null : est * (pf[key] || 1);
      if (price != null) { total += price; if (!ticks[key]) left += price; }
      return { q, name, key, est, price, on: !!ticks[key], edited: !!pf[key] };
    };
    const groups = m.shop(f, p).map(([dept, items]) => [dept, items.map(it => item("")(it, dept))]);
    activeAddons(m).forEach(({ a, c: ac, p: ap }) => {   // 🌱 each add-on gets its own section
      groups.push([`${a.icon} ${a.name} (${ac.guests} ${ac.guests === 1 ? "person" : "people"})`, a.shop(ap.f, ap).flatMap(([dept, items]) => items.map(it => item(a.id + "|")(it, dept)))]);
    });
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
    const c = mealCfg[id] || {}, meal = mealById(id) || {}, ad = meal.addon, mx = ad ? 5 : 20;
    return { guests: Math.min(mx, Math.max(1, +c.guests || (ad ? 2 : 12))), date: c.date || (meal.defaultDate ? meal.defaultDate() : nextXmasDate()), time: c.time || meal.defaultTime || "17:00",
      doneness: c.doneness || "mediumrare", gf: !!c.gf, mode: c.mode || "meal", picks: c.picks || null };
  }
  const dinnerAt = c => { const [y, mo, d] = c.date.split("-").map(Number), [h, mi] = c.time.split(":").map(Number); return new Date(y, mo - 1, d, h, mi).getTime(); };
  const mclock = t => new Date(t).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  const dayName = t => new Date(t).toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });

  // ---- amounts: scale, then show in friendly kitchen units ----
  function ingLine(ing, f, p) {
    if (ing.head) return { head: ing.head };
    let t = typeof ing.t === "function" ? ing.t(p) : ing.t;
    if (ing.q == null) return { text: Array.isArray(t) ? t[0] : t };
    const k = ing.s === "n" ? 1 : ing.s === "w" ? p.w / (p.wBase || 13) : ing.s === "p" ? p.pies : ing.s === "b" ? (p.batches || 1) : f;
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

  function mealSizes(m, c) { return MD.plan[m.id] ? MD.plan[m.id](c.guests, c) : { g: c.guests, f: c.guests / 8, pies: 1, dishes: 1 }; }

  // ---- the day's alarms, as real times ----
  function buildSteps(m, c) {
    const p = mealSizes(m, c), D = dinnerAt(c), out = [];
    m.ahead(p).forEach(([days, hour, icon, text], i) => {
      const d = new Date(D); d.setDate(d.getDate() - days); d.setHours(hour, 0, 0, 0);
      out.push({ k: "a" + i, t: d.getTime(), icon, text, alarm: true, ahead: true });
    });
    m.timeline(p).forEach((s, i) => out.push({ k: "s" + i, m: s.m, t: D + s.m * 60000, icon: s.icon, text: s.text, alarm: s.alarm, main: s.main }));
    activeAddons(m).forEach(({ a, p: ap }) => a.timeline(ap).forEach((s, i) => { if (s.m !== 0) out.push({ k: "x" + a.id + i, m: s.m, t: D + s.m * 60000, icon: s.icon, text: s.text, alarm: s.alarm }); }));
    activeAddons(m).forEach(({ a, p: ap }) => a.ahead(ap).forEach(([days, hour, icon, text], i) => {
      const d = new Date(D); d.setDate(d.getDate() - days); d.setHours(hour, 0, 0, 0);
      out.push({ k: "y" + a.id + i, t: d.getTime(), icon, text, alarm: true, ahead: true });
    }));
    return out.sort((a, b) => a.t - b.t);
  }

  // ---- screens ----
  const mealCardHtml = (m, eve) => `
      <button type="button" class="card meal-card${m.soon ? " soon" : ""}" data-meal="${m.id}"${eve ? ` data-meve="1"` : ""}>
        <span class="meal-ico">${m.icon}</span>
        <span class="meal-txt"><b>${esc(m.name)}</b><small>${esc(m.blurb)}</small>${m.addon ? `<span class="addon-tag">${mealAddons[m.id] ? "✓ Added to your dinner" : "Add-on for 1–5 people"}</span>` : ""}${nightTag(m)}</span>
        <span class="meal-go">${m.soon ? "Soon" : "›"}</span>
      </button>`;
  // a little tag on a dinner card: which night it's planned for
  function nightTag(m) {
    if (m.addon || m.tab === "nye" || m.soon) return "";
    const pl = planOf(m.id), d = pl ? ymdOf(pl.at) : (mealCfg[m.id] && mealCfg[m.id].date);
    if (!d || (d !== eveYmd() && d !== dayYmd())) return "";
    return `<span class="addon-tag night-tag">${d === eveYmd() ? "🕯️ Christmas Eve" : "🎄 Christmas Day"}${pl ? " · ⏰ alarms on" : ""}</span>`;
  }
  // 🕯️🎄 both nights at a glance
  function nightsHtml() {
    const forDay = ymd => { const pl = mealPlans.find(p => !p.svc && ymdOf(p.at) === ymd); if (pl) return { n: pl.name, on: true, id: pl.id };
      const m = MD.meals.find(x => !x.addon && !x.soon && x.tab !== "nye" && mealCfg[x.id] && mealCfg[x.id].date === ymd); return m ? { n: m.name, on: false, id: m.id } : null; };
    const row = (ico, lab, ymd, tab) => { const x = forDay(ymd);
      return `<button type="button" class="night-row" ${x ? `data-meal="${x.id}"` : `data-mtab="${tab}"`}><span class="nr-ico">${ico}</span><span><b>${lab}</b><small>${x ? `${esc(x.n)}${x.on ? " · ⏰ alarms on" : " · alarms not started"}` : "Nothing planned yet. Tap to choose"}</small></span><span class="meal-go">›</span></button>`; };
    return `<div class="card nights-card"><h3>🌟 Your Christmas nights</h3>${row("🕯️", "Christmas Eve", eveYmd(), "eve")}${row("🎄", "Christmas Day", dayYmd(), "traditional")}
      <p class="host-rem" style="margin:6px 0 0">Plan one night or both. Each dinner has its own alarms, and they can all run at once.</p></div>`;
  }
  function svcHtml() {
    const on = !!planOf("evesvc"), sp = svcPlan();
    const near = [["⛪ Midnight Mass", "midnight mass"], ["🕯️ Candlelight services", "christmas eve candlelight service"], ["🎶 Carol services", "christmas eve carol service"], ["👨‍👩‍👧 Family services", "christmas eve family service"]];
    return `<div class="card svc-card"><h3>⛪ Christmas Eve service</h3><p class="host-rem">Midnight Mass, a candlelight service or carols. Find one near you, then set a reminder to leave on time.</p>
      <div class="near-card" style="margin-top:6px"><p class="near-t">📍 Find a service near me</p><div class="near-btns">${near.map(([l, q]) => `<button type="button" class="near-btn" data-amap="${q}">${l}</button>`).join("")}</div><p class="host-rem" style="margin:6px 0 0">Opens your Maps app. Most churches post their Christmas Eve times on their website.</p></div>
      <div class="meal-row two" style="margin-top:12px"><label><span class="meal-lab">Service name (optional)</span><input class="input" id="svcName" maxlength="40" placeholder="e.g. Midnight Mass" value="${esc(eveSvc.name || "")}"></label>
        <label><span class="meal-lab">Starts at</span><input class="input" type="time" id="svcTime" value="${esc(eveSvc.time || "23:00")}"></label></div>
      <label style="display:block;margin-top:8px"><span class="meal-lab">Leave home</span><select class="input" id="svcLead">${[15, 30, 45, 60].map(n => `<option value="${n}" ${+eveSvc.lead === n ? "selected" : ""}>${n} minutes before it starts</option>`).join("")}</select></label>
      <p class="host-rem">💡 Midnight Mass fills up fast. Arrive early for a seat.</p>
      ${on ? `<p class="meal-on">✅ Reminder set: leave at <b>${mclock(sp.at - eveSvc.lead * 60000)}</b> for ${esc(sp.name)} at ${mclock(sp.at)}.</p><button type="button" class="btn btn-ghost btn-block" id="svcOff">⏹ Turn off the reminder</button>`
        : `<button type="button" class="btn btn-red btn-block" id="svcOn">⏰ Remind me when to leave</button>`}</div>`;
  }
  function renderMealHome() {
    $("#mealDietNote").hidden = mealSel.tab !== "dietary";
    $("#mealTabs").innerHTML = MD.tabs.map(([k, l]) => `<button type="button" data-mtab="${k}" aria-pressed="${mealSel.tab === k}">${l}</button>`).join("");
    const list = MD.meals.filter(m => m.tab === mealSel.tab).map(m => mealCardHtml(m)).join("");
    if (mealSel.tab === "eve") {
      const mains = MD.meals.filter(m => ["traditional", "elegant", "vegan"].includes(m.tab) && !m.soon);
      $("#mealList").innerHTML = nightsHtml() + `<p class="eve-intro">Many families celebrate on Christmas Eve. Make it a cozy appetizer night or a seafood supper, or have a full dinner, then plan Christmas Day too.</p>` + list +
        `<h4 class="eve-sub">🍽️ Or a sit-down dinner on Christmas Eve</h4><p class="host-rem">Tap any dinner to plan it for Christmas Eve. You can pick a different one for Christmas Day.</p>` + mains.map(m => mealCardHtml(m, true)).join("") + svcHtml();
    } else $("#mealList").innerHTML = (mealSel.tab === "dietary" ? "" : nightsHtml()) + list;
  }
  function openMeal(id) {
    const m = mealById(id); if (!m) return;
    if (m.soon) { toast("🍽️ This menu is coming soon"); return; }
    mealSel.id = id; save("mealSel", mealSel); renderMeals(); window.scrollTo({ top: 0 });
  }
  // 🌱 the dietary dishes card at the bottom: open or print any one on its own
  function renderDietBottom() {
    $("#mealDietList").innerHTML = MD.meals.filter(a => a.addon).map(a => { const g = cfgFor(a.id).guests;
      return `<div class="diet-row"><div class="diet-head"><span class="meal-ico">${a.icon}</span><span><b>${esc(a.name)}</b><small>${esc(a.tags || "")}</small></span></div>
        <div class="diet-acts"><div class="stepper sm" title="People"><button type="button" data-dg="${a.id}:-1" aria-label="Fewer people">−</button><output aria-label="People">${g}</output><button type="button" data-dg="${a.id}:1" aria-label="More people">+</button></div>
        <button type="button" class="btn btn-ghost" data-dopen="${a.id}">📖 Open</button><button type="button" class="btn btn-green" data-print="meal:${a.id}">🖨️ Print</button></div></div>`; }).join("");
  }
  function renderMeals() {
    renderDietBottom();
    const m = mealSel.id && mealById(mealSel.id);
    $("#mealHome").hidden = !!m; $("#mealDetail").hidden = !m;
    if (!m || m.soon) { mealSel.id = null; $("#mealHome").hidden = false; $("#mealDetail").hidden = true; renderMealHome(); }
    else renderMealDetail(m);
    renderMaster();
  }

  function renderMealDetail(m) {
    const c = cfgFor(m.id), p = mealSizes(m, c), f = p.f, D = dinnerAt(c);
    const mealPlan = planOf(m.id), active = !!mealPlan;
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
        <div class="shop-note">${currencySwitchHtml()}Rough ${curName()} prices (${currency}). Tap any price to match your store. Pantry staples you likely have aren't counted.</div>` +
        ps.groups.map(([dept, items]) => `<h4 class="shop-dept">${esc(dept)}</h4><ul class="shop-list">` + items.map(it =>
          `<li><label class="${it.on ? "on" : ""}"><input type="checkbox" data-shop="${esc(it.key)}" ${it.on ? "checked" : ""}><span>${it.q ? `<b>${esc(it.q)}</b> ` : ""}${esc(it.name)}</span></label>` +
          (it.price != null ? `<span class="shop-cad">$</span><input class="shop-price${it.edited ? " edited" : ""}" data-price="${esc(it.key)}" data-est="${it.est}" inputmode="decimal" value="${it.price.toFixed(2)}" aria-label="Price for ${esc(it.name)}">` : "") + `</li>`
        ).join("") + `</ul>`).join("") +
        `<div class="send-btns"><button type="button" class="btn btn-ghost" id="shopClear">Untick everything</button><button type="button" class="btn btn-ghost" id="priceReset">Reset prices</button></div>`;
    } else if (pane === "recipes") {
      body = allRecipesHtml(m, f, p, false);
    } else {
      body = allMenu(m).map(([course, items]) => `<h4 class="shop-dept">${esc(course)}</h4><ul class="menu-list">${items.map(i => `<li>${esc(i)}</li>`).join("")}</ul>`).join("") +
        `<h4 class="shop-dept">Drink pairings</h4>` + m.drinks.map(([k, v]) => `<p class="drink"><b>${esc(k)}:</b> ${esc(v)}</p>`).join("");
    }
    $("#mealDetail").innerHTML = `
      <button type="button" class="meal-back" id="mealBack">${m.tab === "nye" ? "‹ New Year's Eve" : "‹ All meals"}</button>
      <h3 class="meal-title">${m.icon} ${esc(m.name)}</h3>
      <div class="card meal-setup">
        <div class="meal-row"><span class="meal-lab">${m.addon ? "People (1–5)" : "Guests"}</span>
          <div class="stepper"><button type="button" data-g="-1" aria-label="Fewer guests">−</button><output id="mealGuests">${c.guests}</output><button type="button" data-g="1" aria-label="More guests">+</button></div></div>
        <div class="meal-row two">
          <label><span class="meal-lab">${m.party ? "Party date" : "Dinner date"}</span><input class="input" type="date" id="mealDate" value="${c.date}"></label>
          <label><span class="meal-lab">${m.party ? "Party starts" : "Dinner time"}</span><input class="input" type="time" id="mealTime" value="${c.time}"></label></div>
        ${m.tab === "nye" || m.addon ? "" : `<div class="night-pick"><span class="meal-lab">Which night?</span><div class="seg sub-tabs" role="group" aria-label="Which night"><button type="button" data-night="eve" aria-pressed="${c.date === eveYmd()}">🕯️ Christmas Eve</button><button type="button" data-night="day" aria-pressed="${c.date === dayYmd()}">🎄 Christmas Day</button></div></div>`}
        ${m.options && m.options.doneness ? `<span class="meal-lab">How do you like it?</span><div class="seg seg4 sub-tabs meal-done" role="group" aria-label="Doneness">${(Array.isArray(m.options.doneness) ? m.options.doneness : MD.doneness).map(([k, l]) => `<button type="button" data-done="${k}" aria-pressed="${c.doneness === k}">${l}</button>`).join("")}</div>` : ""}
        ${m.options && m.options.gf ? `<label class="meal-gf"><input type="checkbox" id="mealGf" ${c.gf ? "checked" : ""}> Make it gluten-free</label>` : ""}
        ${m.party ? partyControlsHtml(c, p, m) : ""}
        ${m.addon ? `<label class="meal-gf addon-join"><input type="checkbox" data-addon="${m.id}" ${mealAddons[m.id] ? "checked" : ""}> Add this to my main dinner</label>
          <p class="meal-addon-sub">${m.tags}. When it's added, it joins whichever dinner you plan (its steps, alarms, shopping and recipe go right in). No main dinner? Just set a time below and start its alarms on their own.</p>` : (m.party ? "" : addonPickerHtml())}
        ${p.partySummary ? `<p class="meal-sum">${p.partySummary}</p>` : ""}
        ${p.w || p.mainLabel ? `<p class="meal-sum">${p.icon} <b>${p.w ? `${p.w} lb ${p.meat}` : p.mainLabel}</b> · ${p.verb} about ${p.roastText} · into the oven at <b>${tIn ? mclock(tIn.t) : ""}</b>${p.bigNote ? `<br><small>${p.bigNote}</small>` : ""}</p>` : ""}
        <div class="send-btns">
          ${active ? `<button type="button" class="btn btn-ghost" id="mealStop">⏹ Stop dinner alarms</button>` : `<button type="button" class="btn btn-red" id="mealStart">⏰ Start my dinner alarms</button>`}
          <button type="button" class="btn btn-green" id="mealPrint" data-print="meal:${m.id}">🖨️ Print</button>
        </div>
        ${active ? `<p class="meal-on">✅ Alarms are set. Noël will ring for every step${NoelNative.isNative() ? ", even when the app is closed" : ". Keep Noël open on this device"}.</p>` : ""}
      </div>
      <div class="seg seg4 sub-tabs" id="mealPanes">${panes.map(([k, l]) => `<button type="button" data-mpane="${k}" aria-pressed="${k === pane}">${l}</button>`).join("")}</div>
      <div class="card meal-body">${body}</div>`;
    if (active && (mealPlan.guests !== c.guests || mealPlan.at !== D || (mealPlan.addons || "") !== addonSig(m) || (m.options && (mealPlan.doneness !== c.doneness || !!mealPlan.gf !== c.gf)))) $("#mealDetail .meal-on").innerHTML = "⚠️ You changed your dinner details. Tap <b>Stop</b>, then <b>Start</b> again to update the alarms.";
  }

  // 🥂 New Year's party: party style + pick the appetizers (from Appetizer Ideas)
  function partyControlsHtml(c, p, m) {
    const picked = new Set(p.items.concat(p.drinkItems).map(i => i.name));
    return `<span class="meal-lab">Party style</span><div class="seg sub-tabs meal-done" role="group" aria-label="Party style">
      <button type="button" data-pmode="meal" aria-pressed="${c.mode !== "before"}">Appetizers are the meal</button><button type="button" data-pmode="before" aria-pressed="${c.mode === "before"}">Before dinner</button></div>
      <span class="meal-lab">Pick your appetizers (${picked.size})</span>
      <p class="party-total">Estimated total <b>${cad0(pricedShop(m, p.f, p).total)}</b> · about ${cad(pricedShop(m, p.f, p).total / c.guests)} per guest<small>${currency} · ${m.eve ? "includes the hot cocoa bar" : "includes the midnight toast"}. Prices beside each appetizer are for ${c.guests} guests; tap to add or remove.</small></p>
      <div class="apps-filters party-picks">${(window.NOEL_APPS || []).map(a => `<button type="button" class="chip${picked.has(a[1]) ? " on" : ""}" data-pick="${esc(a[1])}">${a[0]} ${esc(a[1])} <span class="chip-price">${picked.has(a[1]) ? "" : "+"}${cad0(MD.appCost(a[1], p) * fx())}</span></button>`).join("")}</div>`;
  }
  // 🌱 the "dietary guests" picker shown on every main dinner
  function addonPickerHtml() {
    const list = MD.meals.filter(a => a.addon);
    if (!list.length) return "";
    return `<div class="meal-addons"><span class="meal-lab">Dietary guests?</span>
      <p class="meal-addon-sub">Add a vegan, gluten-free, dairy-free dish for 1–5 people. It joins this dinner's timeline, alarms and shopping list.</p>` +
      list.map(a => { const on = !!mealAddons[a.id], g = cfgFor(a.id).guests;
        return `<div class="addon-row"><label><input type="checkbox" data-addon="${a.id}" ${on ? "checked" : ""}> ${a.icon} ${esc(a.name)}</label>` +
          (on ? `<div class="stepper sm"><button type="button" data-ag="${a.id}:-1" aria-label="Fewer people">−</button><output>${g}</output><button type="button" data-ag="${a.id}:1" aria-label="More people">+</button></div>` : "") + `</div>`; }).join("") + `</div>`;
  }
  function allMenu(m) {
    if (m.menuFor) return m.menuFor(mealSizes(m, cfgFor(m.id)));
    const extra = activeAddons(m).map(({ a, c: ac }) => `${a.name} (for ${ac.guests} ${ac.guests === 1 ? "guest" : "guests"}, vegan & gluten-free)`);
    return extra.length ? [...m.menu, ["Dietary add-ons", extra]] : m.menu;
  }
  function allRecipesHtml(m, f, p, open) {
    const o = h => open ? h.replace("<details", "<details open") : h;
    return recipesOf(m, p).map(r => o(recipeHtml(r, f, p))).join("") +
      activeAddons(m).map(({ a, p: ap }) => a.recipes.map(r => o(recipeHtml(r, ap.f, ap))).join("")).join("");
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
    if (D < now) { toast(`🕰️ That ${m.party ? "party" : "dinner"} time has passed. Pick a time in the future.`); return; }
    const steps = buildSteps(m, c).map(s => ({ k: s.k, t: s.t, icon: s.icon, text: s.text, alarm: s.alarm, fired: s.t <= now }));
    const pp = mealSizes(m, c);
    const clash = mealPlans.find(p => p.id !== m.id && !p.svc && ymdOf(p.at) === ymdOf(D));
    if (clash && !confirm(`${clash.name} is already planned for that day. Run both sets of alarms?`)) return;
    mealPlans = mealPlans.filter(p => p.id !== m.id).concat({ id: m.id, name: m.name, guests: c.guests, at: D, doneness: c.doneness, gf: c.gf, addons: addonSig(m), party: !!m.party, eve: !!m.eve, mid: m.party && pp.toMidnight ? D + pp.toMidnight * 60000 : null, steps });
    saveMealPlans(); syncMealNative(); getAudio();
    const missed = steps.filter(s => s.fired).length, other = mealPlans.filter(p => p.id !== m.id && !p.svc).length;
    toast(missed ? `⏰ ${m.party ? "Party" : "Dinner"} alarms set. ${missed} earlier step${missed > 1 ? "s were" : " was"} already past.` : `⏰ ${m.party ? "Party" : "Dinner"} alarms are set!${other ? " Your other night's alarms are still on too." : ""}`);
    renderMeals();
  }
  function stopMealPlan(m) {
    mealPlans = mealPlans.filter(p => p.id !== m.id); saveMealPlans(); syncMealNative(); renderMeals(); toast("⏹ Alarms stopped for " + m.name);
  }
  // ⛪ the service reminder rides along as its own little "plan"
  function svcPlan() {
    const [y, mo, d] = eveYmd().split("-").map(Number), [h, mi] = String(eveSvc.time || "23:00").split(":").map(Number);
    let at = new Date(y, mo - 1, d, h, mi).getTime(); if (h < 6) at += 86400000;   // a 12:00 a.m. service is really Christmas morning
    const what = eveSvc.name || "Christmas Eve service";
    return { id: "evesvc", svc: true, name: what, at, steps: [
      { k: "dress", t: at - (eveSvc.lead + 30) * 60000, icon: "🧥", text: `Get ready for ${what}: coats, boots and car keys`, alarm: true },
      { k: "leave", t: at - eveSvc.lead * 60000, icon: "⛪", text: `Time to leave for ${what}`, alarm: true }].map(s => Object.assign(s, { fired: s.t <= Date.now() })) };
  }
  function syncMealNative() {
    if (!NoelNative.isNative()) return;
    const items = [];
    mealPlans.forEach(pl => pl.steps.filter(s => s.alarm && !s.fired && s.t > Date.now() + 1000).forEach(s => items.push({ t: s.t, title: `${s.icon} ${s.text}`, body: pl.svc ? "Noël Tier 1 Hub · Christmas Eve" : `${pl.name} · ${pl.party ? "starts" : "dinner"} at ${mclock(pl.at)}` })));
    NoelNative.scheduleList(3000, 5000, items.sort((a, b) => a.t - b.t));
  }
  function mealTick() {
    if (!mealPlans.length) return;
    const now = Date.now(), fresh = []; let changed = false;
    mealPlans.forEach(pl => pl.steps.filter(s => s.alarm && !s.fired && s.t <= now).forEach(s => {
      s.fired = true; changed = true;
      if (now - s.t < 10 * 60000) fresh.push({ id: "meal:" + pl.id + "|" + s.k });   // don't ring for steps long past (e.g. phone was off)
    }));
    if (!changed) return;
    saveMealPlans();
    if (fresh.length) triggerAlert(fresh);
    if ($("#view-meals").classList.contains("active")) renderMeals();
  }
  function mealStep(id) {
    const m = String(id).match(/^meal:([^|]+)\|(.+)$/); if (!m) return null;
    const pl = planOf(m[1]), s = pl && pl.steps.find(x => x.k === m[2]);
    return s ? { pl, s } : null;
  }
  function mealAlertItem(id) { const x = mealStep(id); return x ? { icon: x.s.icon, name: x.s.text } : null; }
  function mealSnooze(ids) {
    let any = false;
    ids.forEach(id => { const x = mealStep(id); if (x) { x.s.t = Date.now() + 300000; x.s.fired = false; any = true; } });
    if (any) { saveMealPlans(); syncMealNative(); }
  }

  // ---- master timer: one countdown to the next night, with what's now and next ----
  function renderMaster() {
    const el = $("#mealMaster"), now = Date.now();
    const live = mealPlans.filter(p => !p.svc && now <= (p.mid || p.at) + 3 * 3600000).sort((a, b) => a.at - b.at), mealPlan = live[0];
    if (!mealPlan) { el.hidden = true; return; }
    const toMid = mealPlan.mid && now >= mealPlan.at, left = (toMid ? mealPlan.mid : mealPlan.at) - now;
    const next = mealPlan.steps.find(s => s.t > now), last = [...mealPlan.steps].reverse().find(s => s.t <= now);
    const fmt = ms => { const s = Math.max(0, Math.floor(ms / 1000)), d = Math.floor(s / 86400), h = Math.floor(s % 86400 / 3600), m = Math.floor(s % 3600 / 60), ss = s % 60;
      return d ? `${d}d ${h}h ${m}m` : `${h ? h + ":" : ""}${String(m).padStart(h ? 2 : 1, "0")}:${String(ss).padStart(2, "0")}`; };
    const nye = mealPlan.party && !mealPlan.eve;
    el.hidden = false;
    el.innerHTML = `<div class="mm-k">${left > 0 ? (toMid ? "Midnight in" : mealPlan.eve ? "Christmas Eve starts in" : mealPlan.party ? "Party starts in" : (/-12-24$/.test(ymdOf(mealPlan.at)) ? "Christmas Eve dinner in" : "Dinner is served in")) : (nye ? "Happy New Year!" : mealPlan.eve ? "Merry Christmas Eve!" : "Dinner time!")}</div>
      <div class="mm-time">${left > 0 ? fmt(left) : (nye ? "🎆" : mealPlan.eve ? "🕯️" : "🍽️")}</div>
      ${last ? `<div class="mm-row"><b>Now</b> ${last.icon} ${esc(last.text)}</div>` : ""}
      ${next ? `<div class="mm-row"><b>Next</b> ${next.icon} ${esc(next.text)} · ${mclock(next.t)} <small>(in ${fmt(next.t - now)})</small></div>` : ""}
      ${live[1] ? `<div class="mm-row"><b>Then</b> ${live[1].eve ? "🕯️" : "🍽️"} ${esc(live[1].name)} · ${esc(dayName(live[1].at))}</div>` : ""}`;
  }
  setInterval(() => { if ($("#view-meals").classList.contains("active")) renderMaster(); }, 1000);

  // ---- print (paper backup) ----
  function mealDoc(m) {
    const c = cfgFor(m.id), p = mealSizes(m, c), f = p.f, steps = buildSteps(m, c);
    let lastDay = "";
    const html = `<h1>${esc(m.name)}</h1><p class="pm-sub">${c.guests} ${m.addon ? (c.guests === 1 ? "person" : "people") : "guests"} · ${m.party ? "party starts" : "dinner"} ${esc(dayName(dinnerAt(c)))} at ${mclock(dinnerAt(c))}${p.doneLabel ? ` · ${esc(p.doneLabel)}` : ""}${p.gf ? " · gluten-free" : ""}${p.w ? ` · ${p.w} lb ${p.meat}, about ${p.roastText}` : ""}</p>
      <h2>Timeline</h2><table class="pm-tl">${steps.map(s => { const d = dayName(s.t), h = d !== lastDay ? `<tr><th colspan="2">${esc(d)}</th></tr>` : ""; lastDay = d; return h + `<tr><td>${s.ahead ? "All day" : mclock(s.t)}</td><td>☐ ${esc(s.text)}</td></tr>`; }).join("")}</table>
      <h2>Shopping list</h2>${(ps => `<p><b>Estimated total: ${cad0(ps.total)} ${currency}</b> (about ${cad(ps.total / c.guests)} per guest)</p>` + ps.groups.map(([dept, items]) => `<h3>${esc(dept)}</h3><ul>${items.map(it => `<li>☐ ${it.q ? `<b>${esc(it.q)}</b> ` : ""}${esc(it.name)}${it.price != null ? ` · ${cad(it.price)}` : ""}</li>`).join("")}</ul>`).join(""))(pricedShop(m, f, p))}
      <h2>Menu</h2>${allMenu(m).map(([k, v]) => `<p><b>${esc(k)}:</b> ${esc(v.join(", "))}</p>`).join("")}
      ${m.drinks.map(([k, v]) => `<p><b>${esc(k)}:</b> ${esc(v)}</p>`).join("")}
      <h2>Recipes</h2>${allRecipesHtml(m, f, p, true)}
      <p class="pm-foot">Made with Noël Tier 1 Hub</p>`;
    return { title: m.name + (m.addon ? "" : " plan"), css: PRINT_CSS, html, margin: 0.5, file: m.name.replace(/[^A-Za-z0-9]+/g, "-") + "-Plan" };
  }
  function shopDoc(m) {   // just the shopping list, to take to the store
    const c = cfgFor(m.id), p = mealSizes(m, c), ps = pricedShop(m, p.f, p);
    const html = `<h1>🛒 ${esc(m.name)}: shopping list</h1><p class="pm-sub">${c.guests} ${m.addon ? (c.guests === 1 ? "person" : "people") : "guests"} · estimated total ${cad0(ps.total)} ${currency}</p>` +
      ps.groups.map(([dept, items]) => `<h3>${esc(dept)}</h3><ul>${items.map(it => `<li>☐ ${it.q ? `<b>${esc(it.q)}</b> ` : ""}${esc(it.name)}${it.price != null ? ` · ${cad(it.price)}` : ""}</li>`).join("")}</ul>`).join("") + `<p class="pm-foot">Made with Noël Tier 1 Hub</p>`;
    return { title: m.name + " shopping list", css: PRINT_CSS, html, margin: 0.5, file: m.name.replace(/[^A-Za-z0-9]+/g, "-") + "-Shopping-List" };
  }
  const PRINT_CSS = `body{font:12pt/1.45 Georgia,serif;color:#222} h1{font-size:22pt;margin:0} h2{font-size:15pt;border-bottom:1.5px solid #B8935A;margin:22px 0 8px;padding-bottom:3px} h3{font-size:12pt;margin:12px 0 4px}
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
    const card = t.closest("[data-meal]");
    if (card) {
      const id = card.dataset.meal;
      if (card.dataset.meve && !planOf(id)) { const c = cfgFor(id); if (c.date !== eveYmd()) { c.date = eveYmd(); if (!mealCfg[id] || !mealCfg[id].time) c.time = "18:00"; mealCfg[id] = c; save("mealCfg", mealCfg); toast("🕯️ Planned for Christmas Eve. Change the night anytime."); } }
      openMeal(id); return;
    }
    if (t.closest("#svcOn")) { mealPlans = mealPlans.filter(p => p.id !== "evesvc").concat(svcPlan()); saveMealPlans(); syncMealNative(); getAudio(); renderMealHome(); toast("⛪ We'll remind you when it's time to leave"); return; }
    if (t.closest("#svcOff")) { mealPlans = mealPlans.filter(p => p.id !== "evesvc"); saveMealPlans(); syncMealNative(); renderMealHome(); toast("Reminder turned off"); return; }
    const amp = t.closest("[data-amap]"); if (amp && t.closest(".svc-card")) { openMapSearch(amp.dataset.amap); return; }
    const cur = t.closest("[data-cur]");
    if (cur) { currency = cur.dataset.cur; save("currency", currency); renderMeals(); renderFoodBudget(); toast(currency === "USD" ? "🇺🇸 Showing US dollar estimates" : "🇨🇦 Showing Canadian dollar estimates"); return; }
    const dg = t.closest("[data-dg]");
    if (dg) { const [aid, d] = dg.dataset.dg.split(":"), ac = cfgFor(aid); ac.guests = Math.min(5, Math.max(1, ac.guests + +d)); mealCfg[aid] = ac; save("mealCfg", mealCfg); renderMeals(); return; }
    const dop = t.closest("[data-dopen]"); if (dop) { openMeal(dop.dataset.dopen); return; }
    if (t.closest("#mealBack")) { const wasNye = mealSel.id && (mealById(mealSel.id) || {}).tab === "nye"; mealSel.id = null; save("mealSel", mealSel); renderMeals(); if (wasNye) showView("nye"); return; }
    const m = mealSel.id && mealById(mealSel.id); if (!m) return;
    const ag = t.closest("[data-ag]");
    if (ag) { const [aid, d] = ag.dataset.ag.split(":"), ac = cfgFor(aid); ac.guests = Math.min(5, Math.max(1, ac.guests + +d)); mealCfg[aid] = ac; save("mealCfg", mealCfg); renderMealDetail(m); return; }
    const g = t.closest("[data-g]");
    if (g) { const c = cfgFor(m.id); c.guests = Math.min(m.addon ? 5 : 20, Math.max(1, c.guests + +g.dataset.g)); mealCfg[m.id] = c; save("mealCfg", mealCfg); renderMealDetail(m); return; }
    const pm = t.closest("[data-pmode]");
    if (pm) { const c = cfgFor(m.id); c.mode = pm.dataset.pmode; mealCfg[m.id] = c; save("mealCfg", mealCfg); renderMealDetail(m); return; }
    const pk = t.closest("[data-pick]");
    if (pk) {
      const c = cfgFor(m.id), cur = new Set(mealSizes(m, c).items.concat(mealSizes(m, c).drinkItems).map(i => i.name)), n = pk.dataset.pick;
      if (cur.has(n)) cur.delete(n); else cur.add(n);
      if (![...cur].some(x => x !== "Sparkling Punch")) { toast("🥂 Keep at least one appetizer"); return; }
      c.picks = [...cur]; mealCfg[m.id] = c; save("mealCfg", mealCfg); renderMealDetail(m); return;
    }
    const dn = t.closest("[data-done]");
    if (dn) { const c = cfgFor(m.id); c.doneness = dn.dataset.done; mealCfg[m.id] = c; save("mealCfg", mealCfg); renderMealDetail(m); return; }
    const pn = t.closest("[data-mpane]"); if (pn) { mealSel.pane = pn.dataset.mpane; save("mealSel", mealSel); renderMealDetail(m); return; }
    if (t.closest("#mealStart")) { startMealPlan(m); return; }
    if (t.closest("#mealStop")) { if (confirm("Stop all the alarms for this meal?")) stopMealPlan(m); return; }
    const nt = t.closest("[data-night]");
    if (nt) { const c = cfgFor(m.id); c.date = nt.dataset.night === "eve" ? eveYmd() : dayYmd(); mealCfg[m.id] = c; save("mealCfg", mealCfg); renderMealDetail(m); toast(nt.dataset.night === "eve" ? "🕯️ Set for Christmas Eve" : "🎄 Set for Christmas Day"); return; }
    if (t.closest("#shopToBudget")) {
      const c = cfgFor(m.id), p = mealSizes(m, c), ps = pricedShop(m, p.f, p);
      const amt = Math.round(ps.total * 100) / 100, name = `${m.name} (${c.guests} guests)`;
      const it = foodBudget.items.find(x => x.meal === m.id);
      if (it) { it.name = name; it.amt = amt; } else foodBudget.items.push({ id: uid(), meal: m.id, name, amt, date: budToday() });
      save("foodBudget", foodBudget); renderFoodBudget();
      toast(`💵 ${cad0(amt)} ${it ? "updated in" : "added to"} your food budget`); return;
    }
    if (t.closest("#priceReset")) { if (confirm("Go back to Noël's estimated prices?")) { mealPrices[m.id] = {}; save("mealPrices", mealPrices); renderMealDetail(m); } return; }
    if (t.closest("#shopClear")) { if (confirm("Untick everything on the shopping list?")) { mealTicks[m.id] = {}; save("mealTicks", mealTicks); renderMealDetail(m); } return; }
  });
  $("#view-meals").addEventListener("change", e => {
    const sv = e.target;
    if (["svcName", "svcTime", "svcLead"].includes(sv.id)) {
      if (sv.id === "svcName") eveSvc.name = sv.value.trim().slice(0, 40); else if (sv.id === "svcTime") { if (sv.value) eveSvc.time = sv.value; } else eveSvc.lead = +sv.value || 45;
      save("eveSvc", eveSvc);
      if (planOf("evesvc")) { mealPlans = mealPlans.filter(p => p.id !== "evesvc").concat(svcPlan()); saveMealPlans(); syncMealNative(); }
      renderMealHome(); return;
    }
    const m = mealSel.id && mealById(mealSel.id); if (!m) return;
    const t = e.target;
    if (t.dataset.addon) {
      mealAddons[t.dataset.addon] = t.checked; save("mealAddons", mealAddons); renderMealDetail(m);
      toast(t.checked ? "🌱 Added. It now appears in your dinner's timeline, shopping list and recipes" : "Removed from your dinner"); return;
    }
    if (t.id === "mealGf") { const c = cfgFor(m.id); c.gf = t.checked; mealCfg[m.id] = c; save("mealCfg", mealCfg); renderMealDetail(m); return; }
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
    const c = cfgFor(m.id), p = mealSizes(m, c), el = $("#shopTotal");
    if (el) el.innerHTML = shopTotalHtml(pricedShop(m, p.f, p), c.guests);
  }

  // ---- 💵 food budget (separate from gifts) ----
  function renderFoodBudget() {
    $("#fbCurrency").innerHTML = currencySwitchHtml() + `<span>Amounts in ${curName()} dollars (${currency}).</span>`;
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
    foodBudget.items.push({ id: uid(), name: name.slice(0, 50), amt: Math.round(amt * 100) / 100, date: budToday() }); save("foodBudget", foodBudget);
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
