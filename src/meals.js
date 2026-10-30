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
      return { q, name, key, dept, est, price, on: !!ticks[key], edited: !!pf[key] };
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
  const mealCardHtml = (m, eve, day) => `
      <button type="button" class="card meal-card${m.soon ? " soon" : ""}" data-meal="${m.id}"${eve ? ` data-meve="1"` : ""}${day ? ` data-mday="1"` : ""}>
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
    renderWizard();
    $("#mealDietNote").hidden = mealSel.tab !== "dietary";
    $("#mealTabs").innerHTML = MD.tabs.map(([k, l]) => `<button type="button" data-mtab="${k}" aria-pressed="${mealSel.tab === k}">${l}</button>`).join("");
    const list = MD.meals.filter(m => m.tab === mealSel.tab).map(m => mealCardHtml(m)).join("") +
      MD.meals.filter(m => m.alsoTab === mealSel.tab).map(m => mealCardHtml(m, false, true)).join("");
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
    const sub = mealView === "confirm" || mealView === "saved" || mealView === "savedOne";
    $("#view-meals").classList.toggle("on-sub", sub);
    if (sub) { $("#view-meals").classList.remove("on-menu"); const mm = $("#mealMenu"); if (mm) mm.hidden = true; renderConfirm(); renderSaved(); return; }
    renderConfirm(); renderSaved();
    renderDietBottom();
    const m = mealSel.id && mealById(mealSel.id);
    $("#mealHome").hidden = !!m || msOpen; $("#mealDetail").hidden = !m || msOpen;
    if (!m || m.soon) { mealSel.id = null; $("#mealHome").hidden = msOpen; $("#mealDetail").hidden = true; renderMealHome(); }
    else renderMealDetail(m);
    renderMasterShop();
    renderMaster();
    renderMealMenu();
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
        `<div class="shop-timing"><p><b>Buy now:</b> pantry, frozen, drinks and anything that keeps.</p><p><b>Buy 48 hours before:</b> produce, dairy, bread, fresh meat and fish.</p></div>` +
        ps.groups.map(g => [g, /produce|veg|fruit|herb|dairy|egg|bakery|bread|meat|poultry|fish|seafood|deli|fresh|cheese|butcher/i.test(g[0].replace(/\(.*\)/, ""))]).sort((a, b) => a[1] - b[1]).map(([[dept, items], later]) => `<h4 class="shop-dept">${esc(dept)}<span class="shop-when${later ? "" : " now"}">${later ? "48 hrs before" : "Buy now"}</span></h4><ul class="shop-list">` + items.map(it =>
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
      <div class="card meal-body">${/crown$/.test(m.id) ? `<div class="crown-warn box"><b>✦ Order your crown roast now</b>Crown roasts are a special order and butchers run out fast, especially in December. Call your butcher or meat counter today, tell them the date you need it, and ask for it frenched and tied.</div>` : ""}${body}</div>`;
    if (active && (mealPlan.guests !== c.guests || mealPlan.at !== D || (mealPlan.addons || "") !== addonSig(m) || (m.options && (mealPlan.doneness !== c.doneness || !!mealPlan.gf !== c.gf)))) $("#mealDetail .meal-on").innerHTML = "⚠️ You changed your dinner details. Tap <b>Stop</b>, then <b>Start</b> again to update the alarms.";
  }

  // 🥂 New Year's party: party style + pick the appetizers (from Appetizer Ideas)
  function partyControlsHtml(c, p, m) {
    const picked = new Set(p.items.concat(p.drinkItems).map(i => i.name));
    return `<span class="meal-lab">Will you serve dinner too?</span><div class="seg sub-tabs meal-done pm-two" role="group" aria-label="Will you serve dinner too?">
      <button type="button" data-pmode="meal" aria-pressed="${c.mode !== "before"}"><b>No, appetizers are the meal</b><small>About 12 bites per guest</small></button><button type="button" data-pmode="before" aria-pressed="${c.mode === "before"}"><b>Yes, light bites before dinner</b><small>About 5 bites per guest</small></button></div>
      <p class="host-rem" style="margin:6px 0 12px">Cooking a dinner as well? Plan it from the Meals menu, or use your own timers.</p>
      ${m.party ? `<p class="party-total">Estimated total <b>${cad0(pricedShop(m, p.f, p).total)}</b> · about ${cad(pricedShop(m, p.f, p).total / c.guests)} per guest<small>${currency} · our set ${m.eve ? "Christmas Eve menu, includes the hot cocoa bar" : "New Year's Eve menu, includes the midnight toast"}.</small></p>` : `<span class="meal-lab">Pick your appetizers (${picked.size})</span>
      <p class="party-total">Estimated total <b>${cad0(pricedShop(m, p.f, p).total)}</b> · about ${cad(pricedShop(m, p.f, p).total / c.guests)} per guest<small>${currency} · ${m.eve ? "includes the hot cocoa bar" : "includes the midnight toast"}. Prices beside each appetizer are for ${c.guests} guests; tap to add or remove.</small></p>
      <div class="apps-filters party-picks">${(window.NOEL_APPS || []).map(a => `<button type="button" class="chip${picked.has(a[1]) ? " on" : ""}" data-pick="${esc(a[1])}">${a[0]} ${esc(a[1])} <span class="chip-price">${picked.has(a[1]) ? "" : "+"}${cad0(MD.appCost(a[1], p) * fx())}</span></button>`).join("")}</div>`}`;
  }
  // 🌱 the "dietary guests" picker shown on every main dinner
  function addonPickerHtml() {
    const list = MD.meals.filter(a => a.addon);
    if (!list.length) return "";
    return `<div class="meal-addons"><span class="meal-lab">Add a vegan dish?</span>
      <p class="meal-addon-sub">Add a vegan dish for 1–5 people. It joins this dinner's timeline, alarms and shopping list.</p>` +
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
  function startMealPlan(m, quiet) {
    const c = cfgFor(m.id), D = dinnerAt(c), now = Date.now();
    if (D < now) { if (quiet) return false; toast(`🕰️ That ${m.party ? "party" : "dinner"} time has passed. Pick a time in the future.`); return; }
    const steps = buildSteps(m, c).map(s => ({ k: s.k, t: s.t, icon: s.icon, text: s.text, alarm: s.alarm, fired: s.t <= now }));
    const pp = mealSizes(m, c);
    const clash = mealPlans.find(p => p.id !== m.id && !p.svc && ymdOf(p.at) === ymdOf(D));
    if (clash && !quiet && !confirm(`${clash.name} is already planned for that day. Run both sets of alarms?`)) return;
    mealPlans = mealPlans.filter(p => p.id !== m.id).concat({ id: m.id, name: m.name, guests: c.guests, at: D, doneness: c.doneness, gf: c.gf, addons: addonSig(m), party: !!m.party, eve: !!m.eve, mid: m.party && pp.toMidnight ? D + pp.toMidnight * 60000 : null, steps });
    saveMealPlans(); syncMealNative(); getAudio();
    if (quiet) return true;
    const missed = steps.filter(s => s.fired).length, other = mealPlans.filter(p => p.id !== m.id && !p.svc).length;
    toast(missed ? `⏰ ${m.party ? "Party" : "Dinner"} alarms set. ${missed} earlier step${missed > 1 ? "s were" : " was"} already past.` : `⏰ ${m.party ? "Party" : "Dinner"} alarms are set!${other ? " Your other night's alarms are still on too." : ""}`);
    renderMeals();
    return true;
  }
  // 🧾 the review card: see everything first, nothing is set until Confirm
  function planReview(ids, from) {
    const old = document.getElementById("planReview"); if (old) old.remove();
    const now = Date.now(), clock = t => new Date(t).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
    let allOk = true, grand = 0;
    const blocks = ids.map(id => {
      const m = mealById(id); if (!m) return "";
      const c = cfgFor(id), D = dinnerAt(c), past = D < now; if (past) allOk = false;
      const adds = activeAddons(m), cost = msBuild([id]).total; grand += cost;
      return `<div class="pr-meal"><h4>${esc(m.name)}</h4>
        ${m.party && typeof ptTheme === "function" && (() => { try { return ptTheme(); } catch (e) { return null; } })() ? `<p class="pr-menu"><b>Party theme</b> ${esc(ptTheme().name)}</p>` : ""}
        ${m.party ? allMenu(m).filter(([k]) => !/pairing/i.test(k)).map(([k, it]) => `<p class="pr-menu"><b>${esc(k)}</b> ${it.map(i => esc(String(i).replace(/\s*\(\d+ pieces\)/, ""))).join(" · ")}</p>`).join("") : ""}
        <p class="pr-when">${past ? "That time has passed. Go back and pick a later time." : `<b>${c.guests}</b> guest${c.guests > 1 ? "s" : ""}<br>${esc(whenLong(D))}`}</p>
        ${adds.length ? `<p class="pr-add"><b>Vegan add-on${adds.length > 1 ? "s" : ""}</b></p><ul class="pr-steps">${adds.map(x => `<li><span>${esc(x.a.name)} <small>(${x.c.guests} portion${x.c.guests > 1 ? "s" : ""})</small></span></li>`).join("")}</ul>` : ""}${cost ? `<p class="pr-cost">Estimated cost <b>${cad0(cost)} ${esc(currency)}</b></p>` : ""}</div>`;
    }).join("");
    const el = document.createElement("div"); el.id = "planReview"; el.className = "pr-overlay"; el.setAttribute("role", "dialog"); el.setAttribute("aria-modal", "true");
    el.innerHTML = `<div class="pr-card"><p class="menu-star">✦</p><h3 class="pr-title">Your plan</h3><p class="pr-sub">Here is what you planned. Next you will see your full menu and shopping list.</p>${blocks}${grand && ids.length > 1 ? `<p class="pr-cost pr-grand">All dinners together <b>${cad0(grand)} ${esc(currency)}</b></p>` : ""}
      <div class="pr-btns"><button type="button" class="btn btn-ghost" data-prback>Go back</button><button type="button" class="btn btn-gold" data-prok ${allOk ? "" : "disabled"}>Confirm</button></div></div>`;
    document.body.appendChild(el);
    el.addEventListener("click", e => {
      if (e.target === el || e.target.closest("[data-prback]")) { el.remove(); return; }
      if (e.target.closest("[data-prok]")) {
        el.remove(); cf = { ids: ids.filter(id => mealById(id)), night: from ? null : wiz.night, have: {}, from: from || "" }; mealView = "confirm"; if (from === "nye") showView("meals"); renderMeals(); window.scrollTo(0, 0);
      }
    });
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
      if (card.dataset.mday && !planOf(id)) { const c = cfgFor(id); if (c.date !== dayYmd()) { c.date = dayYmd(); mealCfg[id] = c; save("mealCfg", mealCfg); toast("🎄 Planned for Christmas Day. Change the night anytime."); } }
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
    if (t.closest("#mealStart")) { planReview([m.id]); return; }
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



  // ---- 🎄 guided planner: night → dinners → guests and time → next steps ----
  const WN = { day: "Christmas Day", eve: "Christmas Eve Elegant", eved: "Christmas Eve Traditional" };
  let wiz = load("wiz", null);
  if (!wiz || !wiz.sel) {
    const at = n => mealPlans.filter(p => !p.svc && ymdOf(p.at) === (n === "day" ? dayYmd() : eveYmd()) && (n === "day" || (n === "eve") === ((mealById(p.id) || {}).tab === "eve"))).map(p => p.id);
    wiz = { night: null, sel: { day: at("day"), eve: at("eve"), eved: at("eved") }, time: {}, guests: {} };
  }
  if (!wiz.sel.eved) wiz.sel.eved = [];
  if (wiz.night && !WN[wiz.night]) wiz.night = null;
  const wizSave = () => save("wiz", wiz);
  const wizDate = n => n === "day" ? dayYmd() : eveYmd();
  const wizTime = n => wiz.time[n] || (n === "day" ? "17:00" : "18:00");
  const wizGuests = n => wiz.guests[n] || 2;
  const wizOpts = n => {
    const mains = MD.meals.filter(m => !m.soon && !m.addon && ["traditional", "elegant", "vegan"].includes(m.tab));
    return n === "eve" ? MD.meals.filter(m => !m.soon && !m.addon && m.tab === "eve") : mains;
  };
  function wizApply(n) {
    const t = wizTime(n), g = wizGuests(n);
    wiz.sel[n].forEach(id => { const c = cfgFor(id); c.date = wizDate(n); c.time = t; c.guests = Math.min(20, Math.max(1, g)); mealCfg[id] = c; });
    save("mealCfg", mealCfg);
    wiz.sel[n].forEach(id => { if (planOf(id)) startMealPlan(mealById(id), true); });
  }
  function wizGuestHtml(n) {
    const g = wizGuests(n);
    return `<div class="wz-step"><span class="wz-n">3</span>How many guests, and what time?</div>
        <div class="wz-row"><div class="stepper"><button type="button" data-wzg="-1" aria-label="Fewer guests">−</button><output>${g}</output><button type="button" data-wzg="1" aria-label="More guests">+</button></div><span class="wz-lab">guests</span>
        <label class="wz-time"><span class="wz-lab">Dinner at</span><input class="input" type="time" id="wizTime" value="${esc(wizTime(n))}"></label></div>
        <p class="wz-hint">Every recipe and the shopping list are sized for <b>${g}</b> guest${g > 1 ? "s" : ""}.</p>`;
  }
  function renderWizard() {
    const box = $("#wizBox"); if (!box) return;
    const n = wiz.night, sel = n ? wiz.sel[n] : [];
    const dayBtn = k => `<button type="button" class="wz-night" data-wznight="${k}" aria-pressed="${n === k}"><b>${WN[k]}</b><small>${wiz.sel[k].length ? wiz.sel[k].length + " dinner" + (wiz.sel[k].length > 1 ? "s" : "") + " chosen" : "Tap to plan"}</small></button>`;
    let h = `<div class="wz-top"><button type="button" class="meal-back" data-wzmenu>‹ The menu</button><button type="button" class="meal-back" data-wzsaved>My saved menus</button></div><div class="card wz"><h3 class="wz-t">Plan your Christmas dinner</h3>
      <div class="wz-step"><span class="wz-n">1</span>Which night?</div><div class="wz-nights">${dayBtn("eve")}${dayBtn("eved")}${dayBtn("day")}</div>`;
    if (n) {
      h += `<div class="wz-step"><span class="wz-n">2</span>What are you cooking? <small>Tap one or more. Chosen dinners turn black.</small></div><div class="wz-opts">` +
        wizOpts(n).map(m => `<button type="button" class="wz-opt" data-wzpick="${m.id}" aria-pressed="${sel.includes(m.id)}"><span><b>${esc(m.name)}</b><small>${esc(m.blurb)}</small></span><i>${sel.includes(m.id) ? "✓" : "+"}</i></button>`).join("") + `</div>`;
      if (sel.length) h += wizGuestHtml(n) + wizDietHtml();
    }
    if (n && sel.length) {
      const g = wizGuests(n), planned = sel.filter(id => planOf(id)).length;
      h += `<div class="wz-step"><span class="wz-n">4</span>Ready? See your plan first</div>
        <ul class="wz-list">${sel.map(id => `<li><button type="button" data-wzopen="${id}"><b>${esc(mealById(id).name)}</b><small>Recipes, timeline and prices</small><span class="meal-go">›</span></button></li>`).join("")}</ul>
        ${planned === sel.length ? `<p class="wz-on">Alarms are on. Noël will ring at each step.</p><button type="button" class="btn btn-ghost btn-block" data-wzstop>Turn alarms off</button>` : `<button type="button" class="btn btn-gold btn-block" data-wzalarm>See my plan</button><p class="wz-hint">You will check everything first. Nothing is set until you save.</p>`}`;
    }
    $("#wizBox").innerHTML = h + `</div>`;
  }
  $("#view-meals").addEventListener("click", e => {
    const t = e.target, n = wiz.night;
    const nt = t.closest("[data-wznight]"); if (nt) { wiz.night = nt.dataset.wznight; wizSave(); renderWizard(); return; }
    const pk = t.closest("[data-wzpick]");
    if (pk && n) {
      const id = pk.dataset.wzpick, arr = wiz.sel[n], i = arr.indexOf(id);
      if (i >= 0) { arr.splice(i, 1); if (planOf(id)) { mealPlans = mealPlans.filter(p => p.id !== id); saveMealPlans(); syncMealNative(); } }
      else { ["day", "eve", "eved"].forEach(k => { if (k !== n) { const j = wiz.sel[k].indexOf(id); if (j >= 0) wiz.sel[k].splice(j, 1); } }); arr.push(id); wizApply(n); }
      wizSave(); renderMeals(); return;
    }
    const wg = t.closest("[data-wzg]"); if (wg && n) { wiz.guests[n] = Math.min(20, Math.max(1, wizGuests(n) + +wg.dataset.wzg)); wizSave(); wizApply(n); renderMeals(); return; }
    const wo = t.closest("[data-wzopen]"); if (wo) { openMeal(wo.dataset.wzopen); return; }
    if (t.closest("[data-wzshop]") && n) { msSel = [...wiz.sel[n]]; save("masterSel", msSel); msOpen = true; renderMeals(); window.scrollTo(0, 0); return; }
    if (t.closest("[data-wzalarm]") && n) { wizApply(n); planReview([...wiz.sel[n]]); return; }
    if (t.closest("[data-wzstop]") && n) { if (confirm("Turn off the alarms for these dinners?")) { mealPlans = mealPlans.filter(p => !wiz.sel[n].includes(p.id)); saveMealPlans(); syncMealNative(); renderMeals(); } return; }
  });
  $("#view-meals").addEventListener("change", e => {
    if (e.target.id !== "wizTime" || !wiz.night || !e.target.value) return;
    wiz.time[wiz.night] = e.target.value; wizSave(); wizApply(wiz.night); renderMeals();
  });


  // ---- 📖 the menu: a restaurant-style first page, then "Plan my dinner" opens the builder ----
  let mealScreen = mealSel.id ? "build" : "menu";
  const MENU_GROUPS = [["Christmas Eve", ["eveparty", "seafood"], "Christmas Eve"], ["Traditional", ["turkey", "primerib", "ham"], "Christmas Dinner"], ["Elegant", ["lambcrown", "porkcrown"]], ["Vegan", ["vegan"]]];
  function renderMealMenu() {
    const el = $("#mealMenu"), v = $("#view-meals"); if (!el) return;
    const on = mealScreen === "menu" && !msOpen && !(mealSel.id && mealById(mealSel.id) && !mealById(mealSel.id).soon);
    v.classList.toggle("on-menu", on); el.hidden = !on; if (!on) return;
    const hasPlan = mealPlans.some(p => !p.svc), sig = currency + (hasPlan ? "plan" : "none") + savedMenus.length + "/" + ownDinners.filter(o => o.title || o.shop.some(r => r.name)).length;
    if (el.dataset.built === sig) return; el.dataset.built = sig;
    const go = `<button type="button" class="menu-go" data-menugo>Noël's dinner plans <span>›</span></button>`;
    const svN = savedMenus.length + ownDinners.filter(o => o.title || o.shop.some(r => r.name)).length, sv = svN ? `<button type="button" class="menu-go menu-saved" data-menusaved>My saved menus (${svN}) <span>›</span></button>` : "";
    el.innerHTML = `<div class="menu-top"><button type="button" class="menu-go menu-skip" data-menuskip>My own dinner plans</button>${go}</div>${sv ? `<div class="menu-top menu-top2">${sv}</div>` : ""}
      <p class="menu-star">✦</p><h2 class="menu-title">The Noël Menu</h2><p class="menu-sub">Christmas dinners, planned from the first thaw to the last dessert</p><p class="menu-rule"><span></span>✦<span></span></p>` +
      MENU_GROUPS.map(([g, ids, band]) => (band ? `<h3 class="menu-group">${band}</h3>` : "") + (band === g ? "" : `<h3 class="menu-subgroup">${g}</h3>`) + ids.map(id => {
        const m = mealById(id); if (!m || m.soon) return "";
        const all = (m.menuFor ? m.menuFor(mealSizes(m, cfgFor(id))) : m.menu).filter(([c]) => !/pairing/i.test(c)), clean = i => esc(String(i).replace(/\s*\(\d+ pieces\)/, ""));
        const dr = all.filter(([c]) => /drink/i.test(c)), food = all.filter(([c]) => !/drink/i.test(c));
        let drinks = dr.flatMap(([, items]) => items.map(clean));
        if (!drinks.length) { const names = [...(m.drinks || []).map(d => d[1]).join(" ").matchAll(/((?:[A-Z][\w'’-]*\s)*[A-Z][\w'’-]*)\s*\(recipe included\)/g)].map(x => x[1]); drinks = [...names.map(esc), "wine pairings"]; }
        const est = (() => { try { const c8 = Object.assign({}, cfgFor(id), { guests: 8 }), p8 = mealSizes(m, c8); return m.shop(p8.f, p8).reduce((a, [, items]) => a + items.reduce((b, [, , e]) => b + (e != null ? e * fx() : 0), 0), 0); } catch (e) { return 0; } })();
        return `<div class="menu-dish"><h4>${esc(m.name)}</h4><p class="menu-items">${food.flatMap(([, items]) => items.map(clean)).join(" <i>·</i> ")}</p>` + (/crown$/.test(id) ? `<p class="crown-warn">✦ Order your crown roast now. Butchers run out fast.</p>` : "") + (est ? `<p class="menu-est">Estimated about <b>${cad0(est)}</b> ${currency} for 8 guests<small> · dinner wine and pantry staples extra</small></p>` : "") +
          `<p class="menu-drinks"><b>Drinks</b> ${drinks.join(" <i>·</i> ")}</p>${m.party ? "" : '<p class="menu-sub2">Vegan dish available to add</p>'}<a class="menu-pic" href="https://www.google.com/search?tbm=isch&q=${encodeURIComponent(m.name)}" target="_blank" rel="noopener">See a picture example ›</a></div><p class="menu-rule sm"><span></span>✦<span></span></p>`;
      }).join("")).join("") +
      `<p class="menu-note">Have vegan guests? Choose a vegan dish to add when you plan your dinner.</p>
      <div class="menu-bottom"><p class="menu-ready">Ready to build yours?</p>${go}</div>`;
  }
  document.addEventListener("click", e => {
    const nav = e.target.closest && e.target.closest("[data-view=meals]");
    if (nav && !$("#view-meals").classList.contains("active")) { mealView = ""; cf = null; mealScreen = mealSel.id ? "build" : "menu"; setTimeout(renderMeals, 0); }
  }, true);
  $("#view-meals").addEventListener("click", e => {
    if (e.target.closest("[data-menugo]")) { mealScreen = "build"; renderMeals(); window.scrollTo(0, 0); }
    if (e.target.closest("[data-menuskip]")) { showView("own"); window.scrollTo(0, 0); return; }
    if (e.target.closest("[data-menuown]")) { mealScreen = "build"; renderMeals(); setTimeout(() => { const o = $("#mealOwn"); if (o) o.scrollIntoView({ behavior: "smooth", block: "start" }); }, 50); }
    if (e.target.closest("[data-wzmenu]")) { mealScreen = "menu"; renderMeals(); window.scrollTo(0, 0); }
  });

  // ---- 🛒 master shopping list: the chosen recipes merged into one list, repeats added up ----
  let msSel = load("masterSel", null);               // null = whichever dinners you've planned; or the ids you picked
  let msTicks = load("masterTicks", {});             // what's already in the cart
  let msOpen = false, msHide = false;
  const FRAC_N = { "½": .5, "¼": .25, "¾": .75, "⅓": 1 / 3, "⅔": 2 / 3 };
  const msNum = x => { const r = Math.round(x * 100) / 100; return Number.isInteger(r) ? String(r) : String(r); };
  const msIds = () => (Array.isArray(msSel) ? msSel : mealPlans.filter(p => !p.svc).map(p => p.id)).filter(id => { const m = mealById(id); return m && !m.soon && !m.addon && m.shop; });
  function msParse(q) {
    const m = String(q || "").trim().match(/^(\d+(?:\.\d+)?)?\s*([½¼¾⅓⅔])?\s*(.*)$/);
    return { n: (m[1] ? +m[1] : 0) + (m[2] ? FRAC_N[m[2]] : 0), u: (m[3] || "").trim() };
  }
  const msNorm = name => String(name).toLowerCase().replace(/\(.*?\)/g, "").split(/[^a-z0-9]+/).filter(Boolean).map(w =>
    /ies$/.test(w) ? w.slice(0, -3) + "y" : /(ch|sh|ss|x)es$/.test(w) ? w.slice(0, -2) : /oes$/.test(w) ? w.slice(0, -2) : /[^s]s$/.test(w) ? w.slice(0, -1) : w).join(" ");
  function msBuild(idsArg) {
    const ids = idsArg ? idsArg.filter(id => { const m = mealById(id); return m && !m.soon && !m.addon && m.shop; }) : msIds(), map = new Map(), depts = [];
    ids.forEach(id => {
      const m = mealById(id), c = cfgFor(id), p = mealSizes(m, c), ps = pricedShop(m, p.f, p);
      ps.groups.forEach(([, items]) => items.forEach(it => {
        const key = msNorm(it.name); let e = map.get(key);
        if (!e) { e = { key, dept: it.dept, units: {}, price: null, meals: [], best: -1, name: it.name }; map.set(key, e); if (!depts.includes(it.dept)) depts.push(it.dept); }
        const { n, u } = msParse(it.q); e.units[u] = (e.units[u] || 0) + n;
        if (it.price != null) e.price = (e.price || 0) + it.price;
        if (!e.meals.includes(m.name)) e.meals.push(m.name);
        if (n >= e.best) { e.best = n; e.name = it.name; }
      }));
    });
    const items = [...map.values()].map(e => Object.assign(e, { name: Object.values(e.units).reduce((a, n) => a + n, 0) > 1 ? e.name.replace(/^bunch\b/, "bunches") : e.name, q: Object.entries(e.units).map(([u, n]) => (n ? msNum(n) : "") + (u ? (n ? " " : "") + u : "")).filter(Boolean).join(" + "), on: !!msTicks[e.key] }));
    const groups = depts.map(d => [d, items.filter(i => i.dept === d)]);
    let total = 0, left = 0, done = 0;
    items.forEach(i => { if (i.price != null) { total += i.price; if (!i.on) left += i.price; } if (i.on) done++; });
    return { ids, groups, items, total, left, done };
  }
  const msTextOf = b => `Noël shopping list (${b.ids.map(id => mealById(id).name).join(", ")})\nEstimated ${cad0(b.total)} ${currency}\n` +
    b.groups.map(([d, its]) => `\n${d.toUpperCase()}\n` + its.map(i => `${i.on ? "☑" : "☐"} ${i.q ? i.q + " " : ""}${i.name}`).join("\n")).join("\n");
  function msStatsHtml(b) {
    const pct = b.items.length ? Math.round(100 * b.done / b.items.length) : 0;
    return `<div class="ms-count"><b>${b.done}</b> of ${b.items.length} in the cart</div><div class="ms-bar" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100"><i style="width:${pct}%"></i></div>
      <div class="ms-money"><span>Estimated total <b>${cad0(b.total)}</b></span><span>Still to buy <b>${cad0(b.left)}</b></span></div>`;
  }
  function renderMasterShop() {
    const entry = $("#msEntry") || document.createElement("div"), box = $("#mealShopAll"); if (!box) return;
    const inDetail = !!(mealSel.id && mealById(mealSel.id) && !mealById(mealSel.id).soon);
    entry.hidden = msOpen || inDetail; box.hidden = !msOpen;
    if (!entry.hidden) {
      const b = msBuild();
      entry.innerHTML = `<button type="button" class="card ms-entry" data-msopen><span class="meal-txt"><b>Master shopping list</b><small>${b.ids.length ? `${b.ids.length} recipe${b.ids.length > 1 ? "s" : ""} · ${b.items.length} items · about ${cad0(b.total)} ${currency}. One combined list, no repeats.` : "Choose a few recipes and get one combined list with no repeats, saved on your phone for the store."}</small></span><span class="meal-go">›</span></button>`;
    }
    if (!msOpen) return;
    const b = msBuild(), pick = new Set(b.ids);
    const chips = MD.meals.filter(m => !m.soon && !m.addon && m.shop).map(m => `<button type="button" class="ms-chip" data-mssel="${m.id}" aria-pressed="${pick.has(m.id)}">${esc(m.name)}</button>`).join("");
    box.innerHTML = `<button type="button" class="meal-back" id="msBack">‹ All meals</button>
      <h3 class="meal-title">Master shopping list</h3>
      <p class="view-intro">Pick the recipes you're cooking. Noël merges them into one list and adds up repeats like onions and butter. It's saved on this phone, so it works in the store with no signal.</p>
      <div class="card"><h4 class="ms-h">Recipes on this list</h4><div class="ms-chips">${chips}</div></div>` +
      (b.items.length ? `<div class="card ms-stats" id="msStats">${msStatsHtml(b)}</div>
      <div class="ms-acts">
        <button type="button" class="btn btn-gold" data-print="mastershop">Print or save PDF</button>
        <button type="button" class="btn btn-ghost" data-msshare>Send to a phone</button>
        <button type="button" class="btn btn-ghost" data-mssms>Text it</button>
        <button type="button" class="btn btn-ghost" data-msmail>Email it</button>
        <button type="button" class="btn btn-ghost" data-mscopy>Copy list</button>
        <button type="button" class="btn btn-ghost" id="msHide" aria-pressed="${msHide}">${msHide ? "Show ticked items" : "Hide ticked items"}</button>
      </div>
      <div class="shop-note">${currencySwitchHtml()}Rough ${curName()} prices. Tick each item as it goes in your cart.</div>
      <div class="card ms-list${msHide ? " hide-on" : ""}">` + b.groups.map(([d, its]) => `<h4 class="ms-dept">${esc(d)}</h4><ul class="ms-items">` + its.map(i =>
        `<li class="${i.on ? "on" : ""}"><label><input type="checkbox" data-mstick="${esc(i.key)}" ${i.on ? "checked" : ""}><span class="ms-t">${i.q ? `<b>${esc(i.q)}</b> ` : ""}${esc(i.name)}${i.meals.length > 1 ? `<small>used in ${i.meals.length} recipes</small>` : `<small>${esc(i.meals[0])}</small>`}</span></label></li>`).join("") + `</ul>`).join("") +
      `<div class="send-btns"><button type="button" class="btn btn-ghost" id="msClear">Untick everything</button></div></div>` : `<div class="card"><p class="review-sub">Tap a recipe above to start your list.</p></div>`);
  }
  function masterShopDoc() {
    const b = msBuild(); if (!b.items.length) return { error: "Choose a recipe first" };
    const css = PRINT_CSS + ` .ms-c{column-count:2;column-gap:28px} .ms-c h3{font:600 9pt sans-serif;letter-spacing:.22em;text-transform:uppercase;color:#B08D4E;border-bottom:1px solid #C9A45C;padding-bottom:3px;margin:14px 0 5px;break-after:avoid} .ms-c li{margin:3px 0;break-inside:avoid;font-size:11pt} .ms-c small{color:#777;font-size:8.5pt}`;
    const html = `<h1>Shopping list</h1><p class="pm-sub">${esc(b.ids.map(id => mealById(id).name).join(" · "))}<br>${b.items.length} items · estimated ${cad0(b.total)} ${currency}</p><div class="ms-c">` +
      b.groups.map(([d, its]) => `<h3>${esc(d)}</h3><ul>${its.map(i => `<li>☐ ${i.q ? `<b>${esc(i.q)}</b> ` : ""}${esc(i.name)}${i.price != null ? ` <small>${cad(i.price)}</small>` : ""}</li>`).join("")}</ul>`).join("") + `</div><p class="pm-foot">Made with Noël Tier 1 Hub. Repeated items are already added together.</p>`;
    return { title: "Master shopping list", css, html, margin: 0.5, file: "Master-Shopping-List" };
  }
  $("#view-meals").addEventListener("click", async e => {
    const t = e.target;
    if (t.closest("[data-msopen]")) { msOpen = true; renderMeals(); window.scrollTo(0, 0); return; }
    if (!msOpen) return;
    if (t.closest("#msBack")) { msOpen = false; renderMeals(); return; }
    const sel = t.closest("[data-mssel]");
    if (sel) { const cur = new Set(msIds()); cur.has(sel.dataset.mssel) ? cur.delete(sel.dataset.mssel) : cur.add(sel.dataset.mssel); msSel = [...cur]; save("masterSel", msSel); renderMasterShop(); return; }
    if (t.closest("#msHide")) { msHide = !msHide; renderMasterShop(); return; }
    if (t.closest("#msClear")) { if (confirm("Untick everything on the master list?")) { msTicks = {}; save("masterTicks", msTicks); renderMasterShop(); } return; }
    const text = () => msTextOf(msBuild());
    if (t.closest("[data-msshare]")) { const x = text(); try { if (navigator.share) { await navigator.share({ title: "Shopping list", text: x }); return; } } catch (err) { if (err && err.name === "AbortError") return; } try { await navigator.clipboard.writeText(x); toast("List copied. Paste it into a text or email."); } catch (err) { toast("Couldn't copy the list"); } return; }
    if (t.closest("[data-mscopy]")) { try { await navigator.clipboard.writeText(text()); toast("List copied. Paste it anywhere."); } catch (err) { toast("Couldn't copy the list"); } return; }
    if (t.closest("[data-mssms]")) { location.href = "sms:?&body=" + encodeURIComponent(text()); return; }
    if (t.closest("[data-msmail]")) { location.href = "mailto:?subject=" + encodeURIComponent("Shopping list") + "&body=" + encodeURIComponent(text()); return; }
  });
  $("#view-meals").addEventListener("change", e => {
    const t = e.target; if (!msOpen || !t.dataset.mstick) return;
    if (t.checked) msTicks[t.dataset.mstick] = 1; else delete msTicks[t.dataset.mstick];
    save("masterTicks", msTicks); t.closest("li").classList.toggle("on", t.checked);
    const b = msBuild(), st = $("#msStats"); if (st) st.innerHTML = msStatsHtml(b);
  });


  // ---- 🧾 full menu + shopping list page, Save, and "My saved menus" ----
  let mealView = "", cf = null, svId = null;                 // "" | "confirm" | "saved" | "savedOne"
  let savedMenus = load("savedMenus", []);
  const saveSaved = () => save("savedMenus", savedMenus);
  const whenLong = t => new Date(t).toLocaleString(undefined, { weekday: "long", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
  const whenShort = t => new Date(t).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
  function wizDietHtml() {
    const list = MD.meals.filter(a => a.addon); if (!list.length || wiz.night === "eve") return "";
    return `<div class="wz-diet"><div class="wz-step"><span class="wz-n">+</span>Add a vegan dish <small>Optional. For vegan guests, 1–5 people, added to your plan.</small></div>` +
      list.map(a => { const on = !!mealAddons[a.id], g = cfgFor(a.id).guests;
        return `<div class="addon-row"><label><input type="checkbox" data-wzadd="${a.id}" ${on ? "checked" : ""}> ${esc(a.name)}</label>` +
          (on ? `<div class="wz-por"><small>How many portions?</small><div class="stepper sm"><button type="button" data-wzag="${a.id}:-1" aria-label="Fewer portions">−</button><output>${g}</output><button type="button" data-wzag="${a.id}:1" aria-label="More portions">+</button></div></div>` : "") + `</div>`; }).join("") + `</div>`;
  }
  function cfBuild() {
    const b = msBuild(cf.ids); let total = 0, toBuy = 0, have = 0;
    b.items.forEach(i => { i.have = !!cf.have[i.key]; if (i.have) have++; if (i.price != null) { total += i.price; if (!i.have) toBuy += i.price; } });
    b.total = total; b.toBuy = toBuy; b.haveN = have; return b;
  }
  const cfStatsHtml = b => `<div class="cf-big"><small>Estimated cost to buy</small><b>${cad0(b.toBuy)}</b></div>
    <div class="ms-money"><span>${b.items.length - b.haveN} items to buy</span><span>${b.haveN} already at home</span></div>
    <p class="cf-fine">Full dinner cost ${cad0(b.total)} ${currency}. Rough prices.</p>`;
  function cfMenuHtml(ids) {
    return ids.map(id => { const m = mealById(id), c = cfgFor(id), D = dinnerAt(c);
      return `<div class="cf-dish"><h4>${esc(m.name)}</h4><p class="cf-when">${esc(whenLong(D))} · ${c.guests} guest${c.guests > 1 ? "s" : ""}</p>` +
        allMenu(m).map(([course, items]) => `<p class="cf-course"><b>${esc(course)}</b> ${items.map(i => esc(String(i))).join(" <i>·</i> ")}</p>`).join("") + `</div>`; }).join("");
  }
  function renderConfirm() {
    const box = $("#mealConfirm"); if (!box) return;
    if (mealView !== "confirm" || !cf) { box.hidden = true; return; }
    box.hidden = false;
    const b = cfBuild();
    box.innerHTML = `<button type="button" class="meal-back" data-cfback>‹ Back to my plan</button>
      <h3 class="meal-title">Your menu and shopping list</h3>
      <p class="view-intro">Everything is ticked because you need to buy it. Untick anything you already have at home, then tap Save.</p>
      <div class="card cf-menu"><h4 class="ms-h">Your menu</h4>${cfMenuHtml(cf.ids)}</div>
      <div class="card cf-stats" id="cfStats">${cfStatsHtml(b)}</div>
      <div class="card ms-list">` + (b.groups.map(([d, its]) => `<h4 class="ms-dept">${esc(d)}</h4><ul class="ms-items">` + its.map(i =>
        `<li class="${i.have ? "have" : ""}"><label><input type="checkbox" data-cftick="${esc(i.key)}" ${i.have ? "" : "checked"}><span class="ms-t">${i.q ? `<b>${esc(i.q)}</b> ` : ""}${esc(i.name)}<small>${i.have ? "Already have it" : (i.price != null ? cad(i.price) : "")}</small></span></label></li>`).join("") + `</ul>`).join("")) + `</div>
      <button type="button" class="btn btn-gold btn-block cf-save" data-cfsave>Save my menu and set alarms</button>`;
  }
  function cfSave() {
    const b = cfBuild(), now = Date.now(), from = cf.from;
    let ok = 0; cf.ids.forEach(id => { if (startMealPlan(mealById(id), true)) ok++; });
    const snap = { id: "sm" + now.toString(36), savedAt: now, night: cf.night || null,
      at: Math.min(...cf.ids.map(id => dinnerAt(cfgFor(id)))), names: cf.ids.map(id => mealById(id).name),
      menu: cf.ids.map(id => { const m = mealById(id), c = cfgFor(id); return { name: m.name, at: dinnerAt(c), guests: c.guests, courses: allMenu(m).map(([k, items]) => [k, items.map(String)]) }; }),
      shop: b.groups.map(([d, its]) => [d, its.map(i => ({ key: i.key, q: i.q, name: i.name, price: i.price, have: !!i.have }))]),
      bought: {}, total: b.total, toBuy: b.toBuy, cur: currency };
    savedMenus.unshift(snap); saveSaved();
    const old = $("#planReview"); if (old) old.remove();
    const el = document.createElement("div"); el.id = "planReview"; el.className = "pr-overlay"; el.setAttribute("role", "dialog"); el.setAttribute("aria-modal", "true");
    el.innerHTML = `<div class="pr-card"><p class="menu-star">✦</p><h3 class="pr-title">Saved</h3>
      <p class="pr-sub">${esc(snap.names.join(" and "))}<br>${esc(whenLong(snap.at))}</p>
      <div class="pr-meal"><p class="pr-when">Estimated cost to buy <b>${cad0(snap.toBuy)}</b><br>${ok ? "Your alarms are set." : "That time has passed, so no alarms were set."}</p></div>
      <button type="button" class="btn btn-gold btn-block" data-print="savedmenu:${snap.id}" style="margin:0 0 10px">Print menu and shopping list</button>
      <div class="pr-btns"><button type="button" class="btn btn-ghost" data-svlist>My saved menus</button><button type="button" class="btn btn-gold" data-svdone>Done</button></div></div>`;
    document.body.appendChild(el);
    el.addEventListener("click", e => {
      if (e.target.closest("[data-svlist]")) { el.remove(); mealView = "saved"; renderMeals(); window.scrollTo(0, 0); }
      else if (e.target.closest("[data-svdone]") || e.target === el) { el.remove(); mealView = ""; mealScreen = "menu"; if (from === "nye") showView("nye"); else renderMeals(); window.scrollTo(0, 0); }
    });
    cf = null; mealView = "";
    mealScreen = "menu"; renderMeals();
  }
  const svBuyList = s => s.shop.map(([d, its]) => [d, its.filter(i => !i.have)]).filter(([, its]) => its.length);
  function renderSaved() {
    const box = $("#mealSaved"); if (!box) return;
    if (mealView !== "saved" && mealView !== "savedOne") { box.hidden = true; return; }
    box.hidden = false;
    if (mealView === "saved") {
      box.innerHTML = `<button type="button" class="meal-back" data-svback>‹ The menu</button><h3 class="meal-title">My saved menus</h3>` +
        (savedMenus.length ? savedMenus.map(s => `<div class="card sv-card"><b>${esc(s.names.join(" and "))}</b><small>${esc(whenLong(s.at))}</small><small>To buy ${cad0(s.toBuy)} ${esc(s.cur || "")}</small>
          <div class="sv-acts"><button type="button" class="btn btn-gold" data-svopen="${s.id}">Open</button><button type="button" class="btn btn-ghost" data-svdel="${s.id}">Delete</button></div></div>`).join("")
          : (ownDinners.length ? "" : `<div class="card"><p class="review-sub">Nothing saved yet. Plan a dinner, tap See my plan, then Save.</p></div>`)) +
        ownDinners.map(o => `<div class="card sv-card"><b>${esc(ownName(o))}</b><small>My own dinner${o.date ? " · " + esc(whenShort(new Date(o.date + "T12:00").getTime())) : ""}</small><small>Total ${cad(ownTotals(o).total)}</small>
          <div class="sv-acts"><button type="button" class="btn btn-gold" data-svown="${o.id}">Open</button><button type="button" class="btn btn-ghost" data-svowndel="${o.id}">Delete</button></div></div>`).join("");
      return;
    }
    const s = savedMenus.find(x => x.id === svId); if (!s) { mealView = "saved"; renderSaved(); return; }
    const buy = svBuyList(s), n = buy.reduce((a, [, its]) => a + its.length, 0), done = buy.reduce((a, [, its]) => a + its.filter(i => s.bought[i.key]).length, 0);
    const haveItems = s.shop.flatMap(([, its]) => its.filter(i => i.have));
    box.innerHTML = `<button type="button" class="meal-back" data-svlistback>‹ My saved menus</button><h3 class="meal-title">${esc(s.names.join(" and "))}</h3>
      <div class="card cf-menu"><h4 class="ms-h">Menu</h4>${s.menu.map(m => `<div class="cf-dish"><h4>${esc(m.name)}</h4><p class="cf-when">${esc(whenLong(m.at))} · ${m.guests} guest${m.guests > 1 ? "s" : ""}</p>` +
        m.courses.map(([k, items]) => `<p class="cf-course"><b>${esc(k)}</b> ${items.map(esc).join(" <i>·</i> ")}</p>`).join("") + `</div>`).join("")}</div>
      <div class="card cf-stats"><div class="cf-big"><small>Estimated cost to buy</small><b>${cad0(s.toBuy)}</b></div><p class="cf-fine" id="svCount">${done} of ${n} in the cart</p></div>
      <div class="ms-acts"><button type="button" class="btn btn-gold" data-print="savedmenu:${s.id}">Print or save PDF</button><button type="button" class="btn btn-ghost" data-svcopy="${s.id}">Copy list</button></div>
      <div class="card ms-list">` + buy.map(([d, its]) => `<h4 class="ms-dept">${esc(d)}</h4><ul class="ms-items">` + its.map(i =>
        `<li class="${s.bought[i.key] ? "on" : ""}"><label><input type="checkbox" data-svtick="${esc(i.key)}" ${s.bought[i.key] ? "checked" : ""}><span class="ms-t">${i.q ? `<b>${esc(i.q)}</b> ` : ""}${esc(i.name)}</span></label></li>`).join("") + `</ul>`).join("") +
      (haveItems.length ? `<h4 class="ms-dept">Already at home</h4><p class="cf-fine">${haveItems.map(i => esc(i.name)).join(", ")}</p>` : "") + `</div>
      <div class="send-btns"><button type="button" class="btn btn-ghost" data-svdel="${s.id}">Delete this saved menu</button></div>`;
  }
  const svText = s => `Noël menu (${s.names.join(", ")})\n${whenLong(s.at)}\nEstimated to buy ${cad0(s.toBuy)} ${s.cur || ""}\n` + svBuyList(s).map(([d, its]) => `\n${d.toUpperCase()}\n` + its.map(i => `${s.bought[i.key] ? "☑" : "☐"} ${i.q ? i.q + " " : ""}${i.name}`).join("\n")).join("\n");
  function savedMenuDoc(id) {
    const s = savedMenus.find(x => x.id === id); if (!s) return { error: "That saved menu isn't here any more" };
    const css = PRINT_CSS + ` .ms-c{column-count:2;column-gap:28px} .ms-c h3{font:600 9pt sans-serif;letter-spacing:.22em;text-transform:uppercase;color:#B08D4E;border-bottom:1px solid #C9A45C;padding-bottom:3px;margin:14px 0 5px;break-after:avoid} .ms-c li{margin:3px 0;break-inside:avoid;font-size:11pt} .sm-d{margin:0 0 12px} .sm-d h2{font-size:15pt;margin:0 0 2px} .sm-d p{margin:2px 0;font-size:10.5pt}`;
    const menu = s.menu.map(m => `<div class="sm-d"><h2>${esc(m.name)}</h2><p>${esc(whenLong(m.at))} · ${m.guests} guest${m.guests > 1 ? "s" : ""}</p>` + m.courses.map(([k, items]) => `<p><b>${esc(k)}:</b> ${items.map(esc).join(" · ")}</p>`).join("") + `</div>`).join("");
    const html = `<h1>Menu and shopping list</h1><p class="pm-sub">${esc(s.names.join(" · "))}<br>Estimated to buy ${cad0(s.toBuy)} ${esc(s.cur || "")}</p>${menu}<div class="ms-c">` +
      svBuyList(s).map(([d, its]) => `<h3>${esc(d)}</h3><ul>${its.map(i => `<li>☐ ${i.q ? `<b>${esc(i.q)}</b> ` : ""}${esc(i.name)}</li>`).join("")}</ul>`).join("") + `</div><p class="pm-foot">Made with Noël Tier 1 Hub.</p>`;
    return { title: "Menu and shopping list", css, html, margin: 0.5, file: "My-Noel-Menu" };
  }
  $("#view-meals").addEventListener("click", async e => {
    const t = e.target;
    const ag = t.closest("[data-wzag]");
    if (ag) { const [aid, d] = ag.dataset.wzag.split(":"), ac = cfgFor(aid); ac.guests = Math.min(5, Math.max(1, ac.guests + +d)); mealCfg[aid] = ac; save("mealCfg", mealCfg); if (wiz.night) wizApply(wiz.night); renderMeals(); return; }
    if (t.closest("[data-menusaved]") || t.closest("[data-wzsaved]")) { mealView = "saved"; renderMeals(); window.scrollTo(0, 0); return; }
    if (t.closest("[data-cfback]")) { const f = cf && cf.from; mealView = ""; cf = null; if (f === "nye") showView("nye"); else renderMeals(); window.scrollTo(0, 0); return; }
    if (t.closest("[data-cfsave]")) { cfSave(); window.scrollTo(0, 0); return; }
    if (t.closest("[data-svback]")) { mealView = ""; mealScreen = "menu"; renderMeals(); window.scrollTo(0, 0); return; }
    if (t.closest("[data-svlistback]")) { mealView = "saved"; renderMeals(); window.scrollTo(0, 0); return; }
    const so = t.closest("[data-svown]"); if (so) { ownId = so.dataset.svown; saveOwn(); showView("own"); window.scrollTo(0, 0); return; }
    const sd = t.closest("[data-svowndel]"); if (sd) { if (confirm("Delete this dinner?")) { ownDinners = ownDinners.filter(x => x.id !== sd.dataset.svowndel); foodBudget.items = foodBudget.items.filter(x => x.meal !== "own:" + sd.dataset.svowndel); save("foodBudget", foodBudget); ownId = ownDinners[0] ? ownDinners[0].id : null; saveOwn(); renderMeals(); } return; }
    const op = t.closest("[data-svopen]"); if (op) { svId = op.dataset.svopen; mealView = "savedOne"; renderMeals(); window.scrollTo(0, 0); return; }
    const dl = t.closest("[data-svdel]"); if (dl) { if (confirm("Delete this saved menu?")) { savedMenus = savedMenus.filter(x => x.id !== dl.dataset.svdel); saveSaved(); mealView = "saved"; renderMeals(); } return; }
    const cp = t.closest("[data-svcopy]"); if (cp) { const s = savedMenus.find(x => x.id === cp.dataset.svcopy); if (s) { try { await navigator.clipboard.writeText(svText(s)); toast("List copied. Paste it anywhere."); } catch (err) { toast("Couldn't copy the list"); } } return; }
  });
  $("#view-meals").addEventListener("change", e => {
    const t = e.target;
    if (t.dataset.wzadd) { mealAddons[t.dataset.wzadd] = t.checked; save("mealAddons", mealAddons); if (wiz.night) wizApply(wiz.night); renderMeals(); return; }
    if (t.dataset.cftick && cf) {
      if (t.checked) delete cf.have[t.dataset.cftick]; else cf.have[t.dataset.cftick] = 1;
      const li = t.closest("li"); li.classList.toggle("have", !t.checked);
      const sm = li.querySelector("small"); const b = cfBuild(); const it = b.items.find(i => i.key === t.dataset.cftick);
      if (sm && it) sm.textContent = !t.checked ? "Already have it" : (it.price != null ? cad(it.price) : "");
      $("#cfStats").innerHTML = cfStatsHtml(b); return;
    }
    if (t.dataset.svtick) {
      const s = savedMenus.find(x => x.id === svId); if (!s) return;
      if (t.checked) s.bought[t.dataset.svtick] = 1; else delete s.bought[t.dataset.svtick];
      saveSaved(); t.closest("li").classList.toggle("on", t.checked);
      const buy = svBuyList(s), n = buy.reduce((a, [, its]) => a + its.length, 0), d = buy.reduce((a, [, its]) => a + its.filter(i => s.bought[i.key]).length, 0);
      const c = $("#svCount"); if (c) c.textContent = `${d} of ${n} in the cart`;
    }
  });


  // ---- 📓 My Own Dinner: a fill-in notebook for people cooking their own dinner ----
  let ownDinners = load("ownDinners", []), ownId = load("ownId", null);
  const saveOwn = () => { save("ownDinners", ownDinners); save("ownId", ownId); };
  const OWN_COURSES = [["app", "Appetizers"], ["main", "Main"], ["sides", "Sides"], ["dessert", "Dessert"], ["drinks", "Drinks"]];
  const ownNew = () => ({ id: "od" + Date.now().toString(36), title: "", guests: "", date: dayYmd(), time: "17:00", course: {}, bring: [{ id: uid(), who: "", dish: "" }],
    shop: [{ id: uid(), name: "", price: "", got: false }], limit: "", steps: [{ id: uid(), time: "", text: "" }], notes: "", updated: Date.now() });
  const ownCur = () => ownDinners.find(d => d.id === ownId);
  const ownNum = v => { const n = parseFloat(String(v).replace(/[^0-9.]/g, "")); return isFinite(n) ? n : 0; };
  const ownTotals = d => { let total = 0, spent = 0; d.shop.forEach(i => { const v = ownNum(i.price); total += v; if (i.got) spent += v; }); const lim = ownNum(d.limit); return { total, spent, left: total - spent, lim, over: lim ? total - lim : 0 }; };
  const ownName = d => d.title.trim() || (hubMode === "company" ? "My own event" : "My own dinner");
  const coWords = s => hubMode !== "company" ? s : [["The dinner", "The event"], ["e.g. Christmas Day at our house", "e.g. Team lunch on Dec 18"], [">Menu<", ">Menu or catering order<"], ["Shopping list and prices", "Orders, supplies and prices"], ["Type each item and its price. Tick it when it is in your cart at the grocery store.", "Type each order or supply and its price. Tick it when it is ordered or picked up."], ["In the cart", "Ordered or picked up"], ["My budget for this dinner (optional)", "Approved budget for this event (optional)"], ["Cooking timeline", "Run of show"], ["Type a time and a step. Tap Timer to set a countdown for it (up to 24 hours ahead).", "Type a time and a step, like caterer arrives or doors open. Tap Timer to set a countdown for it."], ["Guest notes", "Notes"], [">Shopping list<", ">Orders and supplies<"], ["Allergies, who is coming, seating ideas", "Dietary needs, RSVPs, who is helping"], ["Delete this dinner", "Delete this event"], ["My own dinner", "My own event"]].reduce((a, [f, t]) => a.split(f).join(t), s);
  function ownTotHtml(d) {
    const t = ownTotals(d);
    return `<b>${cad(t.total)}</b> total · ${cad(t.spent)} bought · ${cad(t.left)} still to buy` + (t.lim ? `<br>${t.over > 0 ? `<span class="own-over">${cad(t.over)} over your ${cad(t.lim)} budget</span>` : `${cad(-t.over)} left of your ${cad(t.lim)} budget`}` : "");
  }
  const ownPaintTot = () => { const d = ownCur(), el = $("#ownTot"); if (d && el) el.innerHTML = ownTotHtml(d); };
  function renderOwn() {
    const box = $("#ownBody"); if (!box) return;
    if (!ownDinners.length) { const n = ownNew(); ownDinners.push(n); ownId = n.id; saveOwn(); }
    if (!ownCur()) { ownId = ownDinners[0].id; saveOwn(); }
    const d = ownCur();
    const row = (arr, id) => arr;
    box.innerHTML = coWords(`<div class="ms-chips own-chips">${ownDinners.map(x => `<button type="button" class="ms-chip" data-ownpick="${x.id}" aria-pressed="${x.id === d.id}">${esc(ownName(x))}</button>`).join("")}<button type="button" class="ms-chip" data-ownnew>+ New dinner</button></div>
      <div class="card own-card"><h4 class="ms-h">The dinner</h4>
        <label class="calc-field"><span>Name</span><input class="input" data-ownf="title" maxlength="50" placeholder="e.g. Christmas Day at our house" value="${esc(d.title)}"></label>
        <div class="own-row own-r3"><label class="calc-field"><span>Guests</span><input class="input" data-ownf="guests" inputmode="numeric" maxlength="3" value="${esc(d.guests)}"></label>
        <label class="calc-field"><span>Date</span><input class="input" type="date" data-ownf="date" value="${esc(d.date)}"></label>
        <label class="calc-field"><span>Time</span><input class="input" type="time" data-ownf="time" value="${esc(d.time)}"></label></div></div>
      <div class="card own-card"><h4 class="ms-h">Menu</h4><p class="cf-fine">One dish per line.</p>${OWN_COURSES.map(([k, n]) => `<label class="calc-field"><span>${n}</span><textarea class="input" rows="2" data-ownc="${k}" placeholder="Type your dishes">${esc(d.course[k] || "")}</textarea></label>`).join("")}</div>
      <div class="card own-card"><h4 class="ms-h">Who is bringing what</h4>${d.bring.map(r => `<div class="own-row own-r2"><input class="input" data-own="bring" data-id="${r.id}" data-k="who" placeholder="Name" value="${esc(r.who)}"><input class="input" data-own="bring" data-id="${r.id}" data-k="dish" placeholder="Dish" value="${esc(r.dish)}"><button type="button" class="icon-btn" data-owndel="bring:${r.id}" aria-label="Remove">✕</button></div>`).join("")}
        <button type="button" class="btn btn-ghost btn-block" data-ownadd="bring">+ Add a person</button></div>
      <div class="card own-card"><h4 class="ms-h">Shopping list and prices</h4><p class="cf-fine">Type each item and its price. Tick it when it is in your cart at the grocery store.</p>
        <div class="cf-stats own-tot" id="ownTot">${ownTotHtml(d)}</div>
        ${d.shop.map(r => `<div class="own-row own-r4"><input type="checkbox" data-own="shop" data-id="${r.id}" data-k="got" ${r.got ? "checked" : ""} aria-label="In the cart"><input class="input" data-own="shop" data-id="${r.id}" data-k="name" placeholder="Item" value="${esc(r.name)}"><input class="input own-price" data-own="shop" data-id="${r.id}" data-k="price" inputmode="decimal" placeholder="$" value="${esc(r.price)}"><button type="button" class="icon-btn" data-owndel="shop:${r.id}" aria-label="Remove">✕</button></div>`).join("")}
        <button type="button" class="btn btn-ghost btn-block" data-ownadd="shop">+ Add an item</button>
        <label class="calc-field own-lim"><span>My budget for this dinner (optional)</span><input class="input" data-ownf="limit" inputmode="decimal" placeholder="e.g. 150" value="${esc(d.limit)}"></label>
        <button type="button" class="btn btn-gold btn-block" data-ownbudget>Add this total to my Budget</button></div>
      <div class="card own-card"><h4 class="ms-h">Cooking timeline</h4><p class="cf-fine">Type a time and a step. Tap Timer to set a countdown for it (up to 24 hours ahead).</p>
        ${d.steps.map(r => `<div class="own-row own-r5"><input class="input" type="time" data-own="steps" data-id="${r.id}" data-k="time" value="${esc(r.time)}"><input class="input" data-own="steps" data-id="${r.id}" data-k="text" placeholder="e.g. Turkey into the oven" value="${esc(r.text)}"><button type="button" class="btn btn-ghost btn-sm own-tm" data-owntimer="${r.id}">Timer</button><button type="button" class="icon-btn" data-owndel="steps:${r.id}" aria-label="Remove">✕</button></div>`).join("")}
        <button type="button" class="btn btn-ghost btn-block" data-ownadd="steps">+ Add a step</button></div>
      <div class="card own-card"><h4 class="ms-h">Guest notes</h4><textarea class="input" rows="3" data-ownf="notes" placeholder="Allergies, who is coming, seating ideas">${esc(d.notes)}</textarea></div>
      <div class="ms-acts"><button type="button" class="btn btn-gold" data-print="owndinner:${d.id}">Print or save PDF</button><button type="button" class="btn btn-ghost" data-owndrop="${d.id}">Delete this dinner</button><p class="own-more">Need more timers? Find them in the <b>calendar</b> (top right), or ask the microphone to <b>“show timers”</b>.</p></div>`);
  }
  function ownDinnerDoc(id) {
    const d = ownDinners.find(x => x.id === id); if (!d) return { error: "That dinner isn't here any more" };
    const t = ownTotals(d), blank = n => Array.from({ length: n }, () => `<li class="own-bl">&nbsp;</li>`).join("");
    const css = PRINT_CSS + ` .od h3{font:600 9pt sans-serif;letter-spacing:.22em;text-transform:uppercase;color:#B08D4E;border-bottom:1px solid #C9A45C;padding-bottom:3px;margin:14px 0 5px} .od ul{list-style:none;padding:0;margin:0} .od li{margin:4px 0;font-size:11pt} .own-bl{border-bottom:1px solid #ccc;height:16px} .od .pr{float:right}`;
    const dateTxt = d.date ? new Date(d.date + "T12:00").toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" }) : "";
    const menu = OWN_COURSES.map(([k, n]) => { const lines = String(d.course[k] || "").split("\n").map(x => x.trim()).filter(Boolean); return `<p><b>${n}:</b> ${lines.length ? lines.map(esc).join(" · ") : "________________________________"}</p>`; }).join("");
    const bring = d.bring.filter(r => r.who || r.dish);
    const shop = d.shop.filter(r => r.name || r.price);
    const steps = d.steps.filter(r => r.time || r.text);
    const html = coWords(`<div class="od"><h1>${esc(ownName(d))}</h1><p class="pm-sub">${[dateTxt, d.time, d.guests ? d.guests + " guests" : ""].filter(Boolean).map(esc).join(" · ")}</p>
      <h3>Menu</h3>${menu}
      <h3>Who is bringing what</h3><ul>${bring.length ? bring.map(r => `<li>${esc(r.who)}: ${esc(r.dish)}</li>`).join("") : blank(4)}</ul>
      <h3>Shopping list</h3><ul>${shop.length ? shop.map(r => `<li>${r.got ? "☑" : "☐"} ${esc(r.name)}${ownNum(r.price) ? `<span class="pr">${cad(ownNum(r.price))}</span>` : ""}</li>`).join("") + `<li><b>Total ${cad(t.total)}</b>${t.lim ? ` of ${cad(t.lim)} budget` : ""}</li>` : blank(8)}</ul>
      <h3>Cooking timeline</h3><ul>${steps.length ? steps.map(r => `<li><b>${esc(r.time)}</b> ${esc(r.text)}</li>`).join("") : blank(6)}</ul>
      <h3>Guest notes</h3><p>${d.notes ? esc(d.notes).replace(/\n/g, "<br>") : "________________________________"}</p></div><p class="pm-foot">Made with Noël Tier 1 Hub.</p>`);
    return { title: ownName(d), css, html, margin: 0.5, file: hubMode === "company" ? "My-Own-Event" : "My-Own-Dinner" };
  }
  $("#view-own").addEventListener("input", e => {
    const t = e.target, d = ownCur(); if (!d) return;
    if (t.dataset.ownf) d[t.dataset.ownf] = t.value;
    else if (t.dataset.ownc) d.course[t.dataset.ownc] = t.value;
    else if (t.dataset.own) { const r = d[t.dataset.own].find(x => x.id === t.dataset.id); if (!r) return; r[t.dataset.k] = t.type === "checkbox" ? t.checked : t.value; }
    else return;
    d.updated = Date.now(); saveOwn(); ownPaintTot();
    if (t.dataset.ownf === "title") { const c = $(`[data-ownpick="${d.id}"]`); if (c) c.textContent = ownName(d); }
  });
  $("#view-own").addEventListener("click", e => {
    const t = e.target, d = ownCur();
    const pk = t.closest("[data-ownpick]"); if (pk) { ownId = pk.dataset.ownpick; saveOwn(); renderOwn(); return; }
    if (t.closest("[data-ownnew]")) { const n = ownNew(); ownDinners.push(n); ownId = n.id; saveOwn(); renderOwn(); window.scrollTo(0, 0); return; }
    if (!d) return;
    const ad = t.closest("[data-ownadd]");
    if (ad) { const k = ad.dataset.ownadd; d[k].push(k === "bring" ? { id: uid(), who: "", dish: "" } : k === "shop" ? { id: uid(), name: "", price: "", got: false } : { id: uid(), time: "", text: "" }); saveOwn(); renderOwn(); return; }
    const dl = t.closest("[data-owndel]"); if (dl) { const [k, id] = dl.dataset.owndel.split(":"); d[k] = d[k].filter(x => x.id !== id); if (!d[k].length) d[k].push(k === "bring" ? { id: uid(), who: "", dish: "" } : k === "shop" ? { id: uid(), name: "", price: "", got: false } : { id: uid(), time: "", text: "" }); saveOwn(); renderOwn(); return; }
    const tm = t.closest("[data-owntimer]");
    if (tm) {
      const r = d.steps.find(x => x.id === tm.dataset.owntimer); if (!r || !r.time) { toast("Type a time first"); return; }
      const [y, mo, da] = (d.date || dayYmd()).split("-").map(Number), [h, mi] = r.time.split(":").map(Number), secs = (new Date(y, mo - 1, da, h, mi).getTime() - Date.now()) / 1000;
      if (secs <= 10) { toast("That time has passed"); return; }
      if (secs > 86400) { toast("Timers can run up to 24 hours. Set this one the day before."); return; }
      getAudio(); calcTimer("own-" + r.id, r.text || "Dinner step", "⏰", Math.round(secs)); toast("⏰ Timer set for " + r.time); return;
    }
    if (t.closest("[data-ownbudget]")) {
      const tot = ownTotals(d).total; if (!tot) { toast("Add some prices first"); return; }
      const key = "own:" + d.id, it = foodBudget.items.find(x => x.meal === key), name = "My dinner: " + ownName(d);
      if (it) { it.name = name; it.amt = Math.round(tot * 100) / 100; } else foodBudget.items.push({ id: uid(), meal: key, name, amt: Math.round(tot * 100) / 100, date: budToday() });
      save("foodBudget", foodBudget); toast(`Added ${cad(tot)} to your Budget`); return;
    }
    const dr = t.closest("[data-owndrop]"); if (dr) { if (confirm("Delete this dinner?")) { ownDinners = ownDinners.filter(x => x.id !== dr.dataset.owndrop); foodBudget.items = foodBudget.items.filter(x => x.meal !== "own:" + dr.dataset.owndrop); save("foodBudget", foodBudget); ownId = ownDinners[0] ? ownDinners[0].id : null; saveOwn(); renderOwn(); } }
  });

  $("#mealSkip").addEventListener("click", e => { e.preventDefault(); $("#mealOwn").scrollIntoView({ behavior: "smooth", block: "start" }); });
  /* @meals-end */
