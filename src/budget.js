  /* ============================================================
     💰 BUDGET (bottom tab)
     One place for every holiday dollar, with pictures:
       • a pie of where the money went, budget-vs-spent bars, and a
         line that grows day by day as the season goes on
       • a spreadsheet of every purchase (gifts, food, giving and your
         own entries) that downloads as a spreadsheet file for Excel,
         Google Sheets or Numbers on the computer
       • budgets per category, and last year's total to compare
     Gifts, food and giving come in automatically from the rest of the
     app. Santa's gifts show only as one total, never by name.
     ============================================================ */
  const BUD_CATS = [
    ["gifts", "🎁", "Gifts", "#151515"], ["food", "🍽️", "Food & drinks", "#B8935A"], ["decor", "🎄", "Decorations", "#8C8C8C"],
    ["hosting", "🏡", "Hosting & home", "#D9BF8C"], ["party", "🎉", "Parties & outings", "#4A4A4A"], ["cards", "✉️", "Cards & postage", "#C4C4C4"],
    ["travel", "🚗", "Travel", "#6B5A3A"], ["giving", "⭐", "Giving", "#A8A8A8"], ["other", "📦", "Other", "#2B2B2B"]
  ];
  const budCat = k => BUD_CATS.find(c => c[0] === k) || BUD_CATS[BUD_CATS.length - 1];
  let budget = load("budget", null) || { limit: 0, cats: {}, expenses: [], daily: {}, past: [], tab: "overview", sort: "date", filter: "all" };
  // the Organizer's old "other costs" move in here once
  if (typeof org !== "undefined" && org.other && org.other.length) { org.other.forEach(x => budget.expenses.push({ id: x.id, cat: "other", name: x.name, amt: +x.amt || 0, date: "" })); org.other = []; save("organizer", org); }
  const saveBudget = () => save("budget", budget);
  const budToday = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; };

  // every dollar spent, from everywhere in the app
  function budRows() {
    const rows = [];
    gifts.people.forEach(p => p.gifts.forEach(g => { if (isSpent(g) && +g.price) rows.push({ src: "Gift Tracker", cat: "gifts", name: `${g.name} for ${p.name}`, amt: +g.price, date: g.boughtAt || "" }); }));
    const santa = sum(santaGifts(), isSpent); if (santa) rows.push({ src: "Santa's list", cat: "gifts", name: "🎅 Santa's gifts (kept secret)", amt: santa, date: "" });
    foodBudget.items.forEach(x => { if (+x.amt) rows.push({ src: "Food budget", cat: "food", name: x.name, amt: +x.amt, date: x.date || "" }); });
    if (typeof org !== "undefined") org.giving.forEach(x => { if (+x.amt) rows.push({ src: "Giving", cat: "giving", name: x.what, amt: +x.amt, date: x.date || "" }); });
    budget.expenses.forEach(x => rows.push({ src: "", id: x.id, cat: x.cat, name: x.name, amt: +x.amt || 0, date: x.date || "", mine: !!x.mine }));
    return rows;
  }
  const catLimit = k => k === "gifts" ? +gifts.budget || 0 : k === "food" ? +foodBudget.limit || 0 : +budget.cats[k] || 0;
  function budTotals() {
    const rows = budRows(), by = {}; BUD_CATS.forEach(([k]) => { by[k] = 0; }); rows.forEach(r => { by[r.cat] = (by[r.cat] || 0) + r.amt; });
    const spent = rows.reduce((a, r) => a + r.amt, 0), catSum = BUD_CATS.reduce((a, [k]) => a + catLimit(k), 0), limit = +budget.limit || catSum;
    const plannedGifts = sum(gifts.people.flatMap(p => p.gifts).concat(santaGifts()), g => !isSpent(g));
    return { rows, by, spent, limit, catSum, plannedGifts };
  }
  function budRecordDay() {
    const t = budTotals().spent, k = budToday();
    if (budget.daily[k] !== t) { budget.daily[k] = Math.round(t * 100) / 100; saveBudget(); }
  }

  // ---------- 📊 pictures (plain SVG, so they also print sharply) ----------
  function budPie(by, total, limit, size) {
    const r = 70, C = 2 * Math.PI * r; let off = 0;
    const parts = BUD_CATS.filter(([k]) => by[k] > 0);
    const arcs = parts.map(([k, , , col]) => { const len = by[k] / total * C, s = `<circle r="${r}" cx="100" cy="100" fill="none" stroke="${col}" stroke-width="34" stroke-dasharray="${len} ${C - len}" stroke-dashoffset="${-off}" transform="rotate(-90 100 100)"/>`; off += len; return s; }).join("");
    const pct = limit ? Math.round(total / limit * 100) : 0;
    return `<svg viewBox="0 0 200 200" width="${size}" height="${size}" role="img" aria-label="Spending by category">
      <circle r="${r}" cx="100" cy="100" fill="none" stroke="#EBEBEB" stroke-width="34"/>${total ? arcs : ""}
      <text x="100" y="${limit ? 94 : 104}" text-anchor="middle" font-size="22" font-weight="700" fill="#1E3A2F" font-family="Georgia,serif">${money(total)}</text>
      ${limit ? `<text x="100" y="116" text-anchor="middle" font-size="11" fill="#6b7a70" font-family="sans-serif">of ${money(limit)} · ${pct}%</text>` : ""}</svg>`;
  }
  function budBars(by) {
    const cats = BUD_CATS.filter(([k]) => by[k] > 0 || catLimit(k) > 0);
    if (!cats.length) return `<p class="host-rem">Set a budget or add spending to see your bars.</p>`;
    return cats.map(([k, i, l, col]) => { const s = by[k], b = catLimit(k), max = Math.max(s, b, 1), over = b && s > b;
      return `<div class="bud-bar"><div class="bb-top"><span>${i} ${l}</span><b class="${over ? "over" : ""}">${money(s)}${b ? ` <small>of ${money(b)}</small>` : ""}</b></div>
        <div class="bb-track"><i style="width:${Math.min(100, s / max * 100)}%;background:${over ? "#151515" : col}"></i>${b ? `<em style="left:${Math.min(100, b / max * 100)}%"></em>` : ""}</div>
        ${b ? `<small class="bb-left ${over ? "over" : ""}">${over ? `${money(s - b)} over` : `${money(b - s)} left`}</small>` : ""}</div>`; }).join("");
  }
  function budLine(limit, w, h) {
    // running total by purchase date (purchases without a date count from the start)
    const rows = budRows(); if (!rows.length) return "";
    const undated = rows.filter(r => !r.date).reduce((a, r) => a + r.amt, 0), byDay = {};
    rows.filter(r => r.date).forEach(r => { byDay[r.date] = (byDay[r.date] || 0) + r.amt; });
    let run = undated; const pts = Object.keys(byDay).sort().map(d => [d, run += byDay[d]]);
    if (!pts.length || undated) pts.unshift([pts.length ? pts[0][0] : budToday(), undated]);
    const y0 = new Date().getMonth() === 0 ? new Date().getFullYear() - 1 : new Date().getFullYear();
    const start = Math.min(new Date(y0, 10, 1).getTime(), new Date(pts[0][0] + "T00:00").getTime()), end = Math.max(new Date(y0, 11, 31).getTime(), new Date(pts[pts.length - 1][0] + "T23:00").getTime());
    const max = Math.max(limit || 0, ...pts.map(p => p[1]), 1) * 1.1, L = 44, R = 10, T = 12, B = 26;
    const X = t => L + (Math.min(Math.max(t, start), end) - start) / (end - start) * (w - L - R), Y = v => T + (1 - v / max) * (h - T - B);
    const xy = []; pts.forEach(([d, v], i) => { const x = X(new Date(d + "T12:00").getTime()); if (i) xy.push([x, xy[xy.length - 1][1]]); xy.push([x, Y(v)]); });   // steps up on each purchase day
    const today = X(Date.now()); if (xy[xy.length - 1][0] < today) xy.push([today, xy[xy.length - 1][1]]);
    const path = xy.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
    const area = path + ` L${xy[xy.length - 1][0].toFixed(1)} ${Y(0)} L${xy[0][0].toFixed(1)} ${Y(0)} Z`;
    const months = [[new Date(y0, 10, 1), "Nov"], [new Date(y0, 11, 1), "Dec"], [new Date(y0, 11, 25), "🎄 25"]];
    const grid = [0, 0.5, 1].map(f => `<line x1="${L}" x2="${w - R}" y1="${Y(max / 1.1 * f)}" y2="${Y(max / 1.1 * f)}" stroke="#EBEBEB"/><text x="${L - 6}" y="${Y(max / 1.1 * f) + 4}" text-anchor="end" font-size="10" fill="#8a8a8a" font-family="sans-serif">${money(Math.round(max / 1.1 * f))}</text>`).join("");
    return `<svg viewBox="0 0 ${w} ${h}" width="100%" role="img" aria-label="Spending over time">${grid}
      ${months.map(([d, l]) => `<text x="${X(d.getTime())}" y="${h - 8}" font-size="10" fill="#8a8a8a" font-family="sans-serif" text-anchor="${l === "Nov" ? "start" : "middle"}">${l}</text>`).join("")}
      ${limit ? `<line x1="${L}" x2="${w - R}" y1="${Y(limit)}" y2="${Y(limit)}" stroke="#8C8C8C" stroke-width="2" stroke-dasharray="5 4"/><text x="${w - R}" y="${Y(limit) - 5}" text-anchor="end" font-size="10" fill="#6B6B6B" font-family="sans-serif">Budget</text>` : ""}
      <path d="${area}" fill="rgba(184,147,90,.15)"/><path d="${path}" fill="none" stroke="#B8935A" stroke-width="2.5" stroke-linejoin="round"/>
      <circle cx="${xy[xy.length - 1][0]}" cy="${xy[xy.length - 1][1]}" r="4.5" fill="#151515"/></svg>`;
  }

  // ---------- screens ----------
  function renderBudget() {
    budRecordDay();
    const T = budTotals(), tab = budget.tab || "overview";
    $("#budTabs").innerHTML = [["overview", "📊 Overview"], ["sheet", "🧾 Spreadsheet"], ["set", "🎯 Budgets"], ["shared", "🤝 Shared costs"]].map(([k, l]) => `<button type="button" class="chip${k === tab ? " on" : ""}" data-btab="${k}">${l}</button>`).join("");
    $("#budBody").innerHTML = ({ overview: budOverview, sheet: budSheet, set: budSet, shared: budShared })[tab](T);
  }
  function budOverview(T) {
    const left = T.limit - T.spent, pct = T.limit ? T.spent / T.limit : 0, now = new Date();
    const xmas = new Date(now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear(), 11, 25), days = Math.max(0, Math.ceil((xmas - now) / 86400000));
    const status = !T.limit ? "Set a budget on the 🎯 Budgets tab to track how much is left." : pct > 1 ? `⚠️ You're ${money(-left)} over budget.` : pct >= 0.9 ? `🟡 Almost there: ${money(left)} left.` : `✅ On track: ${money(left)} left${days ? `, about ${money(Math.floor(left / days))} a day until Christmas` : ""}.`;
    const top = T.rows.slice().sort((a, b) => b.amt - a.amt)[0];
    const perPerson = gifts.people.map(p => [p.name, sum(p.gifts, () => true)]).filter(x => x[1] > 0).sort((a, b) => b[1] - a[1]).slice(0, 6), ppMax = Math.max(1, ...perPerson.map(x => x[1]));
    const last = budget.past[budget.past.length - 1];
    return `<div class="card bud-hero">${budPie(T.by, T.spent, T.limit, 210)}
        <ul class="bud-legend">${BUD_CATS.filter(([k]) => T.by[k] > 0).map(([k, i, l, col]) => `<li><i style="background:${col}"></i><span>${i} ${l}</span><b>${money(T.by[k])}</b><small>${Math.round(T.by[k] / T.spent * 100)}%</small></li>`).join("") || `<li class="host-rem">Nothing spent yet. Mark gifts as bought, or add spending on the 🧾 Spreadsheet tab.</li>`}</ul>
        <p class="bud-status ${pct > 1 ? "over" : pct >= 0.9 ? "warn" : ""}">${status}</p></div>
      <div class="card pt-card"><h3>📈 Spending as the season goes</h3>${budLine(T.limit, 340, 170) || ""}<p class="host-rem">${T.rows.length ? "Your running total, stepping up on each day you spent. The gold dashed line is your budget." : "Your line appears as soon as you spend something."}</p></div>
      <div class="card pt-card"><h3>🎯 Budget vs spent</h3>${budBars(T.by)}</div>
      ${perPerson.length ? `<div class="card pt-card"><h3>🎁 Gifts by person</h3>${perPerson.map(([n, v]) => `<div class="bud-bar"><div class="bb-top"><span>${esc(n)}</span><b>${money(v)}</b></div><div class="bb-track"><i style="width:${v / ppMax * 100}%;background:#b3262e"></i></div></div>`).join("")}<p class="host-rem">Includes gift ideas you haven't bought yet.</p></div>` : ""}
      <div class="card pt-card bud-facts">
        ${top ? `<p>🏷️ <b>Biggest purchase:</b> ${esc(top.name)} · ${money(top.amt)}</p>` : ""}
        ${T.plannedGifts ? `<p>💡 <b>Gift ideas not bought yet:</b> ${money(T.plannedGifts)}${T.limit ? ` · ${T.spent + T.plannedGifts > T.limit ? "buying them all would go over budget" : "they still fit in your budget"}` : ""}</p>` : ""}
        ${last ? `<p>🗂️ <b>Last Christmas (${last.year}):</b> ${money(last.total)} in total · ${T.spent > last.total ? `${money(T.spent - last.total)} more so far this year` : `${money(last.total - T.spent)} less so far`}</p>` : ""}
        <p>📄 Want it on your computer? Open the <b>🧾 Spreadsheet</b> tab and tap <b>Download spreadsheet</b>.</p></div>
      <button type="button" class="btn btn-ghost btn-block pt-print" data-print="budget">🖨️ Print my budget report</button>`;
  }
  function budSheet(T) {
    const f = budget.filter || "all", s = budget.sort || "date";
    let rows = T.rows.filter(r => f === "all" || r.cat === f);
    rows.sort(s === "amt" ? (a, b) => b.amt - a.amt : s === "cat" ? (a, b) => a.cat.localeCompare(b.cat) || b.amt - a.amt : (a, b) => (b.date || "").localeCompare(a.date || "") || b.amt - a.amt);
    const total = rows.reduce((a, r) => a + r.amt, 0), N = NoelNative.isNative();
    return `<form class="card pt-card org-ev-form" id="budAddForm" autocomplete="off"><h3>➕ Add spending</h3>
        <input class="input" name="name" maxlength="60" placeholder="What was it? e.g. Tree lights" aria-label="What">
        ${fillChips((SPACE === "office" ? [["Decorations", "decor"], ["Prizes", "party"], ["Gift cards", "other"], ["Venue deposit", "party"], ["Catering", "food"], ["Drinks", "food"], ["Plates & napkins", "hosting"], ["Charity donation", "other"]] : [["Tree", "decor"], ["Lights", "decor"], ["Wrapping paper", "other"], ["Christmas cards", "cards"], ["Stamps & postage", "cards"], ["Groceries", "food"], ["Restaurant", "food"], ["Gas", "travel"], ["Flights", "travel"], ["Outfits", "other"], ["Babysitter", "other"], ["Event tickets", "party"], ["Hosting supplies", "hosting"]]).map(([n, c]) => [n, n, { "#budAddForm [name=cat]": c }]), "#budAddForm [name=name]")}
        <div class="org-addr-row"><select class="input" name="cat" aria-label="Category">${BUD_CATS.filter(([k]) => k !== "gifts" && k !== "food" && k !== "giving").concat(BUD_CATS.filter(([k]) => k === "food")).map(([k, i, l]) => `<option value="${k}">${i} ${l}</option>`).join("")}</select>
          <input class="input" name="amt" type="number" inputmode="decimal" min="0" step="0.01" placeholder="$" aria-label="Amount" style="max-width:96px"></div>
        <input class="input" name="date" type="date" value="${budToday()}" aria-label="Date">
        ${SPACE === "office" ? `<label class="host-check"><input type="checkbox" name="mine" checked> 💳 I paid for this myself (add it to my reimbursement list)</label>` : ""}
        <button class="btn btn-green btn-block" type="submit">Add</button>
        <p class="host-rem">Gifts come in when you mark them Bought in the Gift Tracker. Food and giving come from their own pages too.</p></form>
      <div class="apps-filters">${[["all", "All"]].concat(BUD_CATS.filter(([k]) => T.by[k] > 0).map(([k, i, l]) => [k, i + " " + l])).map(([k, l]) => `<button type="button" class="chip${k === f ? " on" : ""}" data-bfilter="${k}">${l}</button>`).join("")}</div>
      <div class="card bud-sheet"><table><thead><tr><th data-bsort="date">Date${s === "date" ? " ▾" : ""}</th><th data-bsort="cat">Item${s === "cat" ? " ▾" : ""}</th><th data-bsort="amt" class="num">Amount${s === "amt" ? " ▾" : ""}</th></tr></thead>
        <tbody>${rows.map(r => { const c = budCat(r.cat); return `<tr><td class="bs-date">${r.date ? new Date(r.date + "T12:00").toLocaleDateString(undefined, { month: "short", day: "numeric" }) : "—"}</td>
          <td><span class="bs-dot" style="background:${c[3]}"></span>${esc(r.name)}<small>${c[1]} ${c[2]}${r.src ? " · from " + r.src : ""}${r.mine ? " · 💳 to reimburse" : ""}</small></td>
          <td class="num">${money(r.amt)}${r.id ? `<button type="button" class="bs-del" data-bdel="${r.id}" aria-label="Remove">✕</button>` : ""}</td></tr>`; }).join("") || `<tr><td colspan="3" class="host-rem">Nothing here yet.</td></tr>`}</tbody>
        <tfoot><tr><td></td><td><b>Total${f === "all" ? "" : " · " + budCat(f)[2]}</b></td><td class="num"><b>${money(total)}</b></td></tr></tfoot></table></div>
      ${SPACE === "office" ? (() => { const mine = T.rows.filter(r => r.mine), tot = mine.reduce((a, r) => a + r.amt, 0);
        return `<div class="card pt-card"><h3>💳 Reimbursement list</h3><p class="host-rem">${mine.length ? `<b>${mine.length}</b> ${mine.length === 1 ? "purchase" : "purchases"} you paid for yourself · <b>${money(tot)}</b> to be paid back.` : "Tick “I paid for this myself” when you add a purchase, and it lands here."}</p>
          ${mine.length ? `<button type="button" class="btn btn-ghost btn-block" data-print="reimburse">🖨️ Reimbursement list for the boss</button>` : ""}</div>`; })() : ""}
      <div class="card pt-card"><button type="button" class="btn btn-red btn-block" id="budCsv">📄 Download spreadsheet</button>
        <p class="host-rem">${N ? "Choose AirDrop, Mail or Save to Files to get it onto your computer." : "It saves to your downloads."} It opens in Excel, Google Sheets or Numbers, with every purchase and the totals by category.</p></div>`;
  }
  function budSet(T) {
    const inp = (k, v, ph) => `<input class="input bud-in" type="number" inputmode="decimal" min="0" step="1" data-blim="${k}" value="${v || ""}" placeholder="${ph || "$"}">`;
    return `<div class="card pt-card"><h3>💰 Total holiday budget</h3>${inp("total", budget.limit, T.catSum ? "Total of categories: " + money(T.catSum) : "$")}
        <p class="host-rem">Leave it empty and Noël adds up your category budgets for you.</p></div>
      <div class="card pt-card"><h3>🎯 Budget for each category</h3>
        ${BUD_CATS.map(([k, i, l]) => `<div class="bud-set-row"><span>${i} ${l}${k === "gifts" ? "<small>Same as the Gift Tracker budget</small>" : k === "food" ? "<small>Same as the Meal Planner food budget</small>" : ""}</span>${inp(k, catLimit(k))}</div>`).join("")}</div>
      <div class="card pt-card bud-facts"><h3>💡 Budget tips</h3><p>• A common rule of thumb: about half for gifts, a quarter for food and entertaining, and the rest for everything else.</p><p>• Set your gift budget per person first, then add it up.</p><p>• Keep a little "oops" money (about 10%) for last-minute extras.</p></div>`;
  }

  // ---------- spreadsheet file & printed report ----------
  function budCsv() {
    const T = budTotals(), q = v => `"${String(v == null ? "" : v).replace(/"/g, '""')}"`, n = v => (Math.round(v * 100) / 100).toFixed(2);
    const lines = [["Date", "Category", "Item", "Amount (" + currency + ")", "From"].map(q).join(",")]
      .concat(T.rows.slice().sort((a, b) => (a.date || "9").localeCompare(b.date || "9")).map(r => [r.date, budCat(r.cat)[2], r.name, n(r.amt), r.src || "Added by hand"].map(q).join(",")))
      .concat(["", ["Category", "Spent", "Budget", "Left"].map(q).join(",")])
      .concat(BUD_CATS.map(([k, , l]) => [l, n(T.by[k]), catLimit(k) ? n(catLimit(k)) : "", catLimit(k) ? n(catLimit(k) - T.by[k]) : ""].map(q).join(",")))
      .concat([["TOTAL", n(T.spent), T.limit ? n(T.limit) : "", T.limit ? n(T.limit - T.spent) : ""].map(q).join(",")]);
    return "﻿" + lines.join("\r\n");
  }
  function budgetDoc() {
    budRecordDay(); const T = budTotals();
    const css = `.bd{font:11pt/1.4 Georgia,serif;color:#222} .bd h1{font-size:22pt;margin:0;color:#1E3A2F} .bd .bd-sub{color:#8a6d3b;font:600 8.5pt sans-serif;letter-spacing:.08em;text-transform:uppercase;margin:2px 0 12px}
      .bd h2{font-size:13pt;color:#1E3A2F;border-bottom:1.5px solid #B8935A;margin:16px 0 6px;padding-bottom:2px} .bd .bd-top{display:flex;gap:24px;align-items:center} .bd table{border-collapse:collapse;width:100%}
      .bd td,.bd th{padding:4px 6px;border-bottom:1px solid #e6e0d2;text-align:left;font-size:10pt} .bd th{background:#f4efe3;font:600 8pt sans-serif;text-transform:uppercase} .bd .num{text-align:right;white-space:nowrap}
      .bd .dot{display:inline-block;width:9px;height:9px;border-radius:50%;margin-right:6px} .bd .bd-foot{margin-top:14px;text-align:center;color:#999;font:8pt sans-serif}`;
    const html = `<div class="bd"><h1>💰 Holiday Budget</h1><p class="bd-sub">${new Date().toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })} · spent ${money(T.spent)}${T.limit ? ` of ${money(T.limit)}` : ""}</p>
      <div class="bd-top">${budPie(T.by, T.spent, T.limit, 200)}<table><tr><th>Category</th><th class="num">Spent</th><th class="num">Budget</th><th class="num">Left</th></tr>
        ${BUD_CATS.filter(([k]) => T.by[k] || catLimit(k)).map(([k, i, l, col]) => `<tr><td><span class="dot" style="background:${col}"></span>${l}</td><td class="num">${money(T.by[k])}</td><td class="num">${catLimit(k) ? money(catLimit(k)) : "—"}</td><td class="num">${catLimit(k) ? money(catLimit(k) - T.by[k]) : "—"}</td></tr>`).join("")}
        <tr><td><b>Total</b></td><td class="num"><b>${money(T.spent)}</b></td><td class="num"><b>${T.limit ? money(T.limit) : "—"}</b></td><td class="num"><b>${T.limit ? money(T.limit - T.spent) : "—"}</b></td></tr></table></div>
      ${T.rows.length ? `<h2>Spending over time</h2>${budLine(T.limit, 680, 200)}` : ""}
      <h2>Every purchase</h2><table><tr><th>Date</th><th>Category</th><th>Item</th><th class="num">Amount</th></tr>${T.rows.slice().sort((a, b) => (a.date || "0").localeCompare(b.date || "0")).map(r => `<tr><td>${r.date || "—"}</td><td>${budCat(r.cat)[2]}</td><td>${esc(r.name)}</td><td class="num">${money(r.amt)}</td></tr>`).join("")}</table>
      <p class="bd-foot">Made with Noël Tier 1 Hub</p></div>`;
    return { title: "Budget report", css, html, margin: 0.5, file: "Holiday-Budget-Report" };
  }
  // 💳 Office space: what the coordinator paid out of pocket
  function reimburseDoc() {
    const rows = budRows().filter(r => r.mine).sort((a, b) => (a.date || "").localeCompare(b.date || "")), tot = rows.reduce((a, r) => a + r.amt, 0);
    if (!rows.length) return { error: "💳 Nothing to reimburse yet" };
    const who = (typeof off !== "undefined" && off.ev.organizer) || "";
    const css = `.rb{font:11pt/1.45 Georgia,serif;color:#222} .rb h1{font-size:20pt;margin:0;color:#1E3A2F} .rb .rb-s{color:#8a6d3b;font:600 8.5pt sans-serif;letter-spacing:.08em;text-transform:uppercase;margin:2px 0 14px}
      .rb table{width:100%;border-collapse:collapse} .rb td,.rb th{padding:5px 6px;border-bottom:1px solid #e3dccb;text-align:left} .rb th{background:#f4efe3;font:600 8pt sans-serif;text-transform:uppercase} .rb .num{text-align:right}
      .rb .rb-sign{margin-top:36px;display:grid;grid-template-columns:1fr 1fr;gap:30px;font-size:9.5pt;color:#555} .rb .rb-sign div{border-top:1px solid #888;padding-top:4px}`;
    const html = `<div class="rb"><h1>Expense Reimbursement</h1><p class="rb-s">${esc(family || "")}${family ? " · " : ""}${esc((typeof off !== "undefined" && off.ev.name) || "Holiday party")}${who ? " · submitted by " + esc(who) : ""} · ${new Date().toLocaleDateString()}</p>
      <table><tr><th>Date</th><th>Category</th><th>Item</th><th class="num">Amount</th></tr>${rows.map(r => `<tr><td>${r.date || "—"}</td><td>${budCat(r.cat)[2]}</td><td>${esc(r.name)}</td><td class="num">${money(r.amt)}</td></tr>`).join("")}
      <tr><td colspan="3"><b>Total to reimburse</b></td><td class="num"><b>${money(tot)}</b></td></tr></table>
      <p style="font-size:9.5pt;color:#666;margin-top:10px">Receipts attached.</p>
      <div class="rb-sign"><div>Submitted by</div><div>Approved by &amp; date</div></div></div>`;
    return { title: "Reimbursement list", css, html, margin: 0.6, file: "Expense-Reimbursement" };
  }
  // keep last year's total when the season is saved (called from Start fresh)
  function budgetArchive(year) {
    const T = budTotals(); budget.past = budget.past.filter(p => p.year !== year).concat({ year, total: Math.round(T.spent * 100) / 100, by: T.by });
    budget.expenses = []; budget.daily = {}; budget.shared = null; saveBudget();
  }

  // ---------- 🤝 Shared costs: who paid, who it was for, who owes whom ----------
  const shr = () => (budget.shared = budget.shared || { people: [], items: [] });
  const shrName = id => (shr().people.find(p => p.id === id) || {}).name || "Someone";
  function shrBalances() {
    const s = shr(), bal = {}; s.people.forEach(p => { bal[p.id] = 0; });
    s.items.forEach(it => {
      const by = (it.by && it.by.length ? it.by : s.people.map(p => p.id)).filter(id => id in bal);
      if (!by.length || !(it.paid in bal)) return;
      bal[it.paid] += it.amt; const share = it.amt / by.length; by.forEach(id => { bal[id] -= share; });
    });
    const cr = [], db = [];
    Object.entries(bal).forEach(([id, v]) => { const c = Math.round(v * 100); if (c > 0) cr.push([id, c]); else if (c < 0) db.push([id, -c]); });
    cr.sort((a, b) => b[1] - a[1]); db.sort((a, b) => b[1] - a[1]);
    const pays = [];
    while (cr.length && db.length) { const m = Math.min(cr[0][1], db[0][1]); pays.push([db[0][0], cr[0][0], m / 100]); cr[0][1] -= m; db[0][1] -= m; if (!cr[0][1]) cr.shift(); if (!db[0][1]) db.shift(); }
    return { bal, pays };
  }
  function shrText() {
    const s = shr(), { pays } = shrBalances(), total = s.items.reduce((a, x) => a + x.amt, 0);
    return `Shared costs: ${money(total)} in total\n` + s.items.map(x => `• ${x.what}: ${money(x.amt)} (paid by ${shrName(x.paid)})`).join("\n") + "\n\nTo settle up:\n" + (pays.length ? pays.map(([a, b, m]) => `${shrName(a)} pays ${shrName(b)} ${money(m)}`).join("\n") : "Everyone is square.");
  }
  function shrDoc() {
    const s = shr(); if (!s.items.length) return { error: "Add a shared cost first" };
    const { bal, pays } = shrBalances(), total = s.items.reduce((a, x) => a + x.amt, 0);
    const css = `.sc{font:11pt/1.45 Georgia,serif;color:#151515} .sc h1{font-size:20pt;margin:0;letter-spacing:.12em;text-transform:uppercase} .sc .sc-s{color:#B08D4E;font:600 8.5pt sans-serif;letter-spacing:.2em;text-transform:uppercase;margin:2px 0 14px}
      .sc h2{font:600 9pt sans-serif;letter-spacing:.25em;text-transform:uppercase;color:#B08D4E;border-bottom:1px solid #C9A45C;padding-bottom:3px;margin:16px 0 6px} .sc table{width:100%;border-collapse:collapse} .sc td,.sc th{padding:5px 6px;border-bottom:1px solid #E3D2A8;text-align:left} .sc th{font:600 8pt sans-serif;letter-spacing:.12em;text-transform:uppercase;color:#B08D4E} .sc .num{text-align:right}`;
    const html = `<div class="sc"><h1>Shared costs</h1><p class="sc-s">${money(total)} in total · ${new Date().toLocaleDateString()}</p>
      <h2>Costs</h2><table><tr><th>What</th><th>Paid by</th><th>Split between</th><th class="num">Amount</th></tr>${s.items.map(x => `<tr><td>${esc(x.what)}</td><td>${esc(shrName(x.paid))}</td><td>${esc((x.by && x.by.length ? x.by : s.people.map(p => p.id)).map(shrName).join(", "))}</td><td class="num">${money(x.amt)}</td></tr>`).join("")}</table>
      <h2>Where everyone stands</h2><table>${s.people.map(p => `<tr><td>${esc(p.name)}</td><td class="num">${bal[p.id] > 0.004 ? "is owed " + money(bal[p.id]) : bal[p.id] < -0.004 ? "owes " + money(-bal[p.id]) : "all square"}</td></tr>`).join("")}</table>
      <h2>To settle up</h2>${pays.length ? `<table>${pays.map(([a, b, m]) => `<tr><td>${esc(shrName(a))} pays ${esc(shrName(b))}</td><td class="num"><b>${money(m)}</b></td></tr>`).join("")}</table>` : "<p>Everyone is square.</p>"}</div>`;
    return { noBrand: 1, title: "Shared costs", css, html, margin: 0.6, file: "Shared-Costs" };
  }
  function budShared() {
    const s = shr(), { bal, pays } = shrBalances(), total = s.items.reduce((a, x) => a + x.amt, 0), many = s.people.length >= 2;
    const fam = (typeof org !== "undefined" && org.members) ? org.members.filter(m => !s.people.some(p => p.name.toLowerCase() === m.name.toLowerCase())) : [];
    return `<div class="card pt-card"><h3>Shared costs</h3><p class="host-rem">Sharing a hotel, groceries, a gift or a party? Add who's in, log each cost with who paid, and Noël works out who owes whom.</p></div>
      <div class="card pt-card"><h3>Who's sharing</h3><div class="shr-people">${s.people.map(p => `<span class="shr-chip">${esc(p.name)}<button type="button" class="shr-x" data-shrp="${p.id}" aria-label="Remove ${esc(p.name)}">✕</button></span>`).join("") || `<small class="host-rem">Nobody yet. Add names below.</small>`}</div>
        <form id="shrPersonForm" class="santa-kid-row" autocomplete="off"><input class="input" name="pname" maxlength="20" placeholder="Name" aria-label="Name"><button class="btn btn-green" type="submit">Add</button></form>
        ${fam.length ? `<button type="button" class="btn btn-ghost btn-block" data-shrfam style="margin-top:8px">Add my family members</button>` : ""}</div>
      ${many ? `<form class="card pt-card" id="shrItemForm" autocomplete="off"><h3>Add a cost</h3>
        <input class="input" name="what" maxlength="40" placeholder="What was it?" aria-label="What" style="width:100%">
        ${fillChips(["Hotel", "Groceries", "Tickets", "Gas", "Restaurant", "Gift", "Other"].map(x => [x, x === "Other" ? "" : x]), "#shrItemForm [name=what]")}
        <div class="org-addr-row"><input class="input" name="amt" type="number" inputmode="decimal" min="0" step="0.01" placeholder="Amount" aria-label="Amount"><select class="input" name="paid" aria-label="Paid by">${s.people.map(p => `<option value="${p.id}">Paid by ${esc(p.name)}</option>`).join("")}</select></div>
        <p class="host-rem" style="margin:6px 0 2px">Split between</p><div class="shr-by">${s.people.map(p => `<label><input type="checkbox" name="by" value="${p.id}" checked><span>${esc(p.name)}</span></label>`).join("")}</div>
        <button class="btn btn-green btn-block" type="submit" style="margin-top:10px">Add cost</button></form>` : `<p class="host-rem">Add at least two people to start.</p>`}
      ${s.items.length ? `<div class="card pt-card"><h3>Costs · ${money(total)}</h3>${s.items.map(x => { const n = (x.by && x.by.length ? x.by : s.people.map(p => p.id)).filter(id => s.people.some(p => p.id === id)).length || 1;
        return `<div class="shr-row"><div><b>${esc(x.what)}</b><small>Paid by ${esc(shrName(x.paid))} · split ${n} ways (${money(x.amt / n)} each)</small></div><span class="shr-amt">${money(x.amt)}</span><button type="button" class="icon-btn" data-shri="${x.id}" aria-label="Remove">✕</button></div>`; }).join("")}</div>
      <div class="card pt-card"><h3>Where everyone stands</h3>${s.people.map(p => `<div class="shr-row"><b>${esc(p.name)}</b><span class="shr-amt">${bal[p.id] > 0.004 ? "is owed " + money(bal[p.id]) : bal[p.id] < -0.004 ? "owes " + money(-bal[p.id]) : "all square"}</span></div>`).join("")}</div>
      <div class="card pt-card shr-settle"><h3>To settle up</h3>${pays.length ? pays.map(([a, b, m]) => `<div class="shr-pay"><span>${esc(shrName(a))} pays ${esc(shrName(b))}</span><b>${money(m)}</b></div>`).join("") : `<p>Everyone is square.</p>`}
        <div class="send-btns" style="margin-top:10px"><button type="button" class="btn btn-green" data-shrshare>Share summary</button><button type="button" class="btn btn-ghost" data-print="shared">Print</button><button type="button" class="btn btn-ghost" data-shrclear>Start over</button></div></div>` : ""}`;
  }
  $("#view-budget").addEventListener("click", async e => {
    const t = e.target, s = shr(), save1 = () => { saveBudget(); renderBudget(); };
    const px = t.closest("[data-shrp]"); if (px) { s.people = s.people.filter(p => p.id !== px.dataset.shrp); save1(); return; }
    const ix = t.closest("[data-shri]"); if (ix) { s.items = s.items.filter(x => x.id !== ix.dataset.shri); save1(); return; }
    if (t.closest("[data-shrfam]")) { org.members.forEach(m => { if (!s.people.some(p => p.name.toLowerCase() === m.name.toLowerCase())) s.people.push({ id: uid(), name: m.name }); }); save1(); return; }
    if (t.closest("[data-shrclear]")) { if (!confirm("Clear all shared costs and start over?")) return; budget.shared = { people: s.people, items: [] }; save1(); return; }
    if (t.closest("[data-shrshare]")) { const text = shrText(); try { if (navigator.share) { await navigator.share({ title: "Shared costs", text }); return; } } catch (err) { if (err && err.name === "AbortError") return; } try { await navigator.clipboard.writeText(text); toast("📋 Summary copied. Paste it into a text or email."); } catch (err) { toast("Couldn't copy the summary"); } }
  });
  $("#view-budget").addEventListener("submit", e => {
    const f = e.target, s = shr();
    if (f.id === "shrPersonForm") { const n = f.pname.value.trim(); if (!n) return; if (!s.people.some(p => p.name.toLowerCase() === n.toLowerCase())) s.people.push({ id: uid(), name: n }); saveBudget(); renderBudget(); return; }
    if (f.id === "shrItemForm") {
      const what = f.what.value.trim(), amt = parseFloat(f.amt.value), by = [...f.querySelectorAll("[name=by]:checked")].map(x => x.value);
      if (!what || !(amt > 0)) { toast("Add what it was and how much"); return; } if (!by.length) { toast("Tick who it was for"); return; }
      s.items.push({ id: uid(), what, amt: Math.round(amt * 100) / 100, paid: f.paid.value, by }); saveBudget(); renderBudget(); toast(`Added ${money(amt)}`);
    }
  });
  // ---------- taps & typing ----------
  $("#view-budget").addEventListener("click", e => {
    const t = e.target;
    const tb = t.closest("[data-btab]"); if (tb) { budget.tab = tb.dataset.btab; saveBudget(); renderBudget(); return; }
    const fl = t.closest("[data-bfilter]"); if (fl) { budget.filter = fl.dataset.bfilter; saveBudget(); renderBudget(); return; }
    const so = t.closest("[data-bsort]"); if (so) { budget.sort = so.dataset.bsort; saveBudget(); renderBudget(); return; }
    const del = t.closest("[data-bdel]"); if (del) { budget.expenses = budget.expenses.filter(x => x.id !== del.dataset.bdel); saveBudget(); renderBudget(); return; }
    if (t.closest("#budCsv")) { NoelMedia.share(new Blob([budCsv()], { type: "text/csv" }), "Holiday-Budget.csv", "Holiday budget").then(h => { if (h === "saved") toast("📄 Spreadsheet saved to your downloads"); }).catch(() => {}); }
  });
  $("#view-budget").addEventListener("change", e => {
    const t = e.target; if (t.dataset.blim == null) return;
    const v = Math.max(0, parseFloat(t.value) || 0), k = t.dataset.blim;
    if (k === "total") budget.limit = v; else if (k === "gifts") { gifts.budget = v; save("gifts", gifts); } else if (k === "food") { foodBudget.limit = v; save("foodBudget", foodBudget); } else budget.cats[k] = v;
    saveBudget(); renderBudget(); toast("💰 Budget saved");
  });
  $("#view-budget").addEventListener("submit", e => {
    e.preventDefault(); const f = e.target; if (f.id !== "budAddForm") return;
    const name = f.name.value.trim(), amt = parseFloat(f.amt.value);
    if (!name || !(amt > 0)) { toast("💰 Add what it was and how much"); return; }
    budget.expenses.push({ id: uid(), cat: f.cat.value, name, amt: Math.round(amt * 100) / 100, date: f.date.value || budToday(), mine: !!(f.mine && f.mine.checked) });
    saveBudget(); renderBudget(); toast(`💰 Added ${money(amt)}`);
  });
  budRecordDay();
  /* @budget-end */
