  /* ============================================================
     📒 ORGANIZER: six simple tools, each on its own clean screen
     ✉️ Card List (address book, sent/received, Avery 5160 labels, CSV)
     📅 Calendar (your family's events + everything Noël has planned)
     🙏 Thank-Yous · 📦 Packages · ⭐ Giving · 🗂️ Spending at a glance
     Everything stays encrypted on the phone.
     ============================================================ */
  let org = load("organizer", null) || {
    view: "home", me: { name: "", street: "", city: "", region: "", postal: "" }, contacts: [],
    members: [], events: [], calMonth: null, calDay: null, thanks: [], packages: [], giving: [], other: [], fired: {}
  };
  const saveOrg = () => save("organizer", org);
  const orgYear = () => { const n = new Date(); return n.getMonth() === 0 && n.getDate() <= 15 ? n.getFullYear() - 1 : n.getFullYear(); };
  const ymd = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const parseYmd = s => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
  const shortDate = s => parseYmd(s).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
  const MEMBER_EMOJI = ["★", "◆", "●", "▲", "■", "✦", "☾", "✿", "❖", "✚"];   // plain gold-style symbols (coloured emoji are stripped app-wide, which left this picker empty)
  function renderOrg() {   // Calendar tab (calendar + packages); Card list and Thank-yous live in the Cards tab
    if (org.view !== "packages") org.view = "cal";
    const tabs = $("#orgTabs"); if (tabs) tabs.innerHTML = [["cal", "Calendar / Timers"], ["packages", "Packages"]].map(([k, l]) => `<button type="button" data-otool="${k}" aria-pressed="${org.view === k}">${l}</button>`).join("");
    const tool = $("#orgTool"); if (tool) tool.innerHTML = org.view === "packages" ? orgPackagesHtml() : orgCalHtml();
    const cl = $("#paneCardList"), th = $("#paneThanks");
    if (cl && !cl.hidden) cl.innerHTML = orgCardsHtml();
    if (th && !th.hidden) th.innerHTML = orgThanksHtml();
  }
  const orgRoots = () => ["#view-org", "#paneCardList", "#paneThanks"].map(x => $(x)).filter(Boolean);

  // ---------- ✉️ Card list ----------
  function orgCardsHtml() {
    const y = orgYear(), on = org.contacts.filter(c => c.list !== false);
    const sent = on.filter(c => (c.sent || {})[y]).length, got = org.contacts.filter(c => (c.recv || {})[y]).length;
    const forgot = org.contacts.filter(c => (c.recv || {})[y] && !(c.sent || {})[y]);
    return `<div class="card org-card"><div class="org-stats"><span><b>${on.length}</b> on the list</span><span><b>${sent}</b> sent</span><span><b>${got}</b> received</span></div>
        ${forgot.length ? `<p class="org-warn">📬 Sent you a card, but not on your sent list yet: ${forgot.map(c => esc(c.name)).join(", ")}</p>` : ""}
        <div class="send-btns"><button type="button" class="btn btn-red" id="orgLabels" data-print="labels">🖨️ Mailing labels</button><button type="button" class="btn btn-ghost" id="orgReturn" data-print="return">🏠 Return labels</button><button type="button" class="btn btn-ghost" id="orgCsv">📄 Spreadsheet</button></div>
        <p class="host-rem">Labels print on Avery 5160 sheets (30 per page). Print at 100% scale ("actual size"). A reminder comes on December 10 to get your cards in the mail.</p></div>
      ${org.contacts.map(c => { const s = (c.sent || {})[y], r = (c.recv || {})[y], ls = (c.sent || {})[y - 1], lr = (c.recv || {})[y - 1];
        return `<div class="card org-item" data-oc="${c.id}"><div class="host-row"><b>${esc(c.name)}</b><button class="icon-btn" data-odel aria-label="Remove">✕</button></div>
          <p class="org-addr">${esc([c.street, [c.city, c.region].filter(Boolean).join(", "), c.postal].filter(Boolean).join(" · ")) || "<i>No address yet. Tap ✏️ to add it.</i>"}</p>
          <div class="org-toggles"><button type="button" class="chip${s ? " on" : ""}" data-osent>${s ? "✓ " : ""}We sent</button><button type="button" class="chip${r ? " on" : ""}" data-orecv>${r ? "✓ " : ""}They sent us</button>
            <button type="button" class="chip${c.list === false ? "" : " on"}" data-olist>${c.list === false ? "Not this year" : "📮 On this year's list"}</button><button type="button" class="chip" data-oedit>✏️</button></div>
          ${ls || lr ? `<p class="host-rem">Last year: ${[ls && "we sent", lr && "they sent"].filter(Boolean).join(" · ")}</p>` : ""}
          ${org.editing === c.id ? orgAddrForm(c, "oc") : ""}</div>`; }).join("")}
      <form class="card add-task host-add" id="orgContactForm" autocomplete="off"><h3>${hubMode === "company" ? "➕ Add a client, vendor or team member" : "➕ Add a household"}</h3><div class="santa-kid-row"><input class="input" name="cname" maxlength="50" placeholder="${hubMode === "company" ? "e.g. Smith &amp; Co. or Jane Smith" : "e.g. The Patel Family"}" aria-label="Name"><button class="btn btn-green" type="submit">Add</button></div></form>
      <div class="card org-card"><h3>🏠 Your return address</h3>${orgAddrForm(org.me, "me")}</div>`;
  }
  const orgAddrForm = (c, kind) => `<div class="org-addr-form" data-oaf="${kind}">${kind === "me" ? `<input class="input" data-oa="name" maxlength="50" placeholder="Your name (e.g. The Smith Family)" value="${esc(c.name || "")}">` : ""}
      <input class="input" data-oa="street" maxlength="80" placeholder="Street address" value="${esc(c.street || "")}">
      <div class="org-addr-row"><input class="input" data-oa="city" maxlength="40" placeholder="City" value="${esc(c.city || "")}"><input class="input" data-oa="region" maxlength="20" placeholder="${currency === "USD" ? "State" : "Province"}" value="${esc(c.region || "")}"><input class="input" data-oa="postal" maxlength="12" placeholder="${currency === "USD" ? "ZIP" : "Postal code"}" value="${esc(c.postal || "")}"></div>
      ${kind === "oc" ? `<button type="button" class="btn btn-green btn-block" data-odone>Done</button>` : ""}</div>`;
  function labelLines(c) { return [c.name, c.street, [c.city, c.region].filter(Boolean).join(", ") + (c.postal ? "  " + c.postal : "")].filter(s => s && s.trim()); }
  function labelDoc(kind) {
    const list = kind === "return" ? (labelLines(org.me).length < 2 ? [] : Array(30).fill(labelLines(org.me))) : org.contacts.filter(c => c.list !== false && c.street).map(labelLines);
    if (!list.length) return { error: kind === "return" ? "🏠 Fill in your return address on the Card List first" : "✉️ Add some addresses to your Card List first" };
    const css = `.lblsheet{width:8.5in;padding:.5in .1875in 0;box-sizing:border-box;display:grid;grid-template-columns:repeat(3,2.625in);column-gap:.125in;grid-auto-rows:1in;break-after:page;page-break-after:always}
      .lblsheet:last-child{break-after:auto;page-break-after:auto} .lbl{box-sizing:border-box;padding:.1in .18in;display:flex;flex-direction:column;justify-content:center;font:10.5pt/1.25 Georgia,serif;overflow:hidden} .lbl b{font-weight:600}`;
    const pages = []; for (let i = 0; i < list.length; i += 30) pages.push(list.slice(i, i + 30));
    return { noBrand: 1, title: kind === "return" ? "Return address labels" : "Christmas card mailing labels", css, margin: 0, pages: pages.length, file: kind === "return" ? "Return-Address-Labels" : "Christmas-Card-Labels", note: "Avery 5160 · print at actual size (100%)",
      html: pages.map(pg => `<div class="lblsheet">${pg.map(l => `<div class="lbl">${l.map((x, i) => i ? `<span>${esc(x)}</span>` : `<b>${esc(x)}</b>`).join("")}</div>`).join("")}</div>`).join("") };
  }

  // ---------- 📅 Calendar ----------
  function calEvents() {
    const out = org.events.map(e => Object.assign({ mine: true }, e));
    const add = (date, icon, title, time) => out.push({ date, icon, title, time: time || "", auto: true });
    if (hubMode === "company") {   // 🏢 the office calendar shows the office plan, never family things
      if (typeof off !== "undefined") {
        const e = off.ev || {}, A = off.appr || {};
        if (e.date) add(e.date, "🎉", (e.name || "Office party") + (e.venue ? ` at ${e.venue}` : ""), e.start || "");
        if (e.date && off.acts && off.acts.santa && off.santa && off.santa.time) add(e.date, "🎅", "Santa visit" + (off.santa.who ? ` (${off.santa.who})` : ""), off.santa.time);
        (off.costs || []).forEach(c => { if (c.orderBy && !c.ordered) add(c.orderBy, "📦", "Order: " + (c.name || c.type)); });
        if (A.status === "sent" && A.sentAt) add(ymd(new Date(A.sentAt + (A.followDays || 3) * 864e5)), "📨", "Follow up on your approval request");
      }
      org.packages.forEach(p => { if (p.eta && !p.arrived) add(p.eta, "📦", p.item + " arrives"); });
      add(`${orgYear()}-12-10`, "✉️", "Send your client cards");
      return out.sort((a, b) => (a.date + (a.time || "99")).localeCompare(b.date + (b.time || "99")));
    }
    const D = hostDinner(), dd = new Date(D);
    const mdp = mainDinnerPlan();
    add(ymd(dd), "🍽️", mdp ? mdp.name : "Christmas dinner", `${String(dd.getHours()).padStart(2, "0")}:${String(dd.getMinutes()).padStart(2, "0")}`);
    add(`${orgYear()}-12-25`, "🎄", "Christmas Day"); add(`${orgYear()}-12-31`, "🥂", "New Year's Eve");
    mealPlans.filter(pl => pl !== mdp).forEach(pl => { { const p = new Date(pl.at); add(ymd(p), pl.svc ? "⛪" : pl.eve ? "🕯️" : pl.party ? "🎉" : "🍽️", pl.svc ? pl.name : pl.party && !pl.eve ? "New Year's Eve party" : pl.name, `${String(p.getHours()).padStart(2, "0")}:${String(p.getMinutes()).padStart(2, "0")}`); } });
    host.trips.filter(x => x.k === "trip" && x.b).forEach(x => { const t = new Date(x.b); if (isNaN(t)) return; add(ymd(t), "✈️", x.a, x.b.slice(11, 16)); const pk = new Date(t.getTime() - 864e5); add(ymd(pk), "🧳", "Pack & check in: " + x.a); });
    host.trips.filter(x => x.k === "gtrip" && x.b).forEach(x => { const t = new Date(x.b); if (isNaN(t)) return; add(ymd(t), "🛬", "Pick up: " + x.a, x.b.slice(11, 16)); });
    host.guests.forEach(g => { if (g.arrive) { const t = new Date(g.arrive); add(ymd(t), g.pickup ? "🚗" : "🚪", (g.pickup ? "Pick up " : "") + g.name + (g.pickup ? "" : " arrive"), g.arrive.slice(11, 16)); } });
    const cleanDays = {}; HOST_CLEAN.forEach(([id, days]) => { if (!host.clean[id] && days) { const k = ymd(new Date(atDay(D, days, 10))); cleanDays[k] = (cleanDays[k] || 0) + 1; } });
    Object.entries(cleanDays).forEach(([k, n]) => add(k, "🧽", `Cleaning day: ${n} ${n === 1 ? "task" : "tasks"} on your Hosting list`));
    org.packages.forEach(p => { if (p.eta && !p.arrived) add(p.eta, "📦", p.item + " arrives"); });
    add(`${orgYear()}-12-10`, "✉️", "Mail your Christmas cards");
    return out.sort((a, b) => (a.date + (a.time || "99")).localeCompare(b.date + (b.time || "99")));
  }
  // 🖨️ printable month: grid with the day's plans, then the month's list
  function calendarDoc() {
    const m0 = parseYmd(org.calMonth || calDefault()), y = m0.getFullYear(), mo = m0.getMonth(), first = new Date(y, mo, 1).getDay(), days = new Date(y, mo + 1, 0).getDate();
    const pre = `${y}-${String(mo + 1).padStart(2, "0")}`, evs = calEvents().filter(e => e.date.startsWith(pre)), byDay = {}; evs.forEach(e => { (byDay[e.date] = byDay[e.date] || []).push(e); });
    const who = e => { const m = e.mine && e.who ? org.members.find(z => z.id === e.who) : null; return m ? m.name : ""; };
    const t12 = t => t ? new Date(2000, 0, 1, +t.slice(0, 2), +t.slice(3, 5)).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" }) : "";
    const cells = []; for (let i = 0; i < first; i++) cells.push(`<div class="cc blank"></div>`);
    for (let d = 1; d <= days; d++) { const k = `${pre}-${String(d).padStart(2, "0")}`, list = byDay[k] || [];
      cells.push(`<div class="cc"><b>${d}</b>${list.slice(0, 3).map(e => `<span>${e.time ? t12(e.time) + " " : ""}${esc(e.title)}${who(e) ? " · " + esc(who(e)) : ""}</span>`).join("")}${list.length > 3 ? `<em>+${list.length - 3} more</em>` : ""}</div>`); }
    while (cells.length % 7) cells.push(`<div class="cc blank"></div>`);
    const css = `.cp{box-sizing:border-box;border:1.5px solid #C9A45C;outline:.5px solid #C9A45C;outline-offset:-7px;padding:.3in .35in .25in;font-family:Georgia,serif;color:#151515}
      .cp h1{text-align:center;font:600 27pt/1.1 Georgia,serif!important;letter-spacing:.2em;text-transform:uppercase;margin:0!important;color:#151515!important} .cp .cp-s{text-align:center;font:600 8pt sans-serif;letter-spacing:.35em;text-transform:uppercase;color:#B08D4E;margin:6px 0 14px}
      .cg{display:grid;grid-template-columns:repeat(7,1fr);border-left:1px solid #C9A45C;border-top:1px solid #151515} .cdw{text-align:center;font:600 7pt sans-serif;letter-spacing:.22em;color:#B08D4E;padding:5px 0;border-right:1px solid #C9A45C;border-bottom:1px solid #151515}
      .cc{box-sizing:border-box;min-height:.98in;max-height:.98in;overflow:hidden;padding:3px 4px;border-right:1px solid #C9A45C;border-bottom:1px solid #C9A45C} .cc.blank{background:#f4f4f4} .cc b{font:600 9.5pt Georgia,serif;color:#151515}
      .cc span{display:block;font:6.8pt/1.2 Georgia,serif;margin-top:2px;border-left:2px solid #C9A45C;padding-left:3px} .cc em{display:block;font:italic 6.5pt Georgia,serif;color:#B08D4E;margin-top:2px}
      .cp h2{font:600 9pt sans-serif!important;letter-spacing:.3em;text-transform:uppercase;color:#B08D4E;margin:16px 0 6px!important;border-bottom:1px solid #C9A45C;padding-bottom:4px} .cl{display:grid;grid-template-columns:.9in 0.8in 1fr;gap:2px 8px;font:9pt/1.35 Georgia,serif} .cl i{font-style:normal;color:#B08D4E}`;
    const html = `<div class="cp"><h1>${m0.toLocaleDateString(undefined, { month: "long" })}</h1><p class="cp-s">${y}${familyTitle(family) ? " · " + esc(familyTitle(family)) : ""}</p>
      <div class="cg">${["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map(x => `<div class="cdw">${x}</div>`).join("")}${cells.join("")}</div>
      ${evs.length ? `<h2>This month's plans</h2><div class="cl">${evs.map(e => `<i>${parseYmd(e.date).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}</i><i>${e.time ? t12(e.time) : "All day"}</i><span>${esc(e.title)}${who(e) ? " · " + esc(who(e)) : ""}</span>`).join("")}</div>` : ""}</div>`;
    return { noBrand: 1, title: m0.toLocaleDateString(undefined, { month: "long", year: "numeric" }) + " calendar", css, html, margin: 0.5, file: "Calendar-" + pre };
  }
  // 📅 every month of the year as a tap strip (swipe the grid works too)
  const monthChips = (m0, attr) => { const y = m0.getFullYear(), now = new Date(); return `<div class="mc-months" data-mcscroll>${Array.from({ length: 12 }, (_, i) => `<button type="button" class="mc-chip${i === m0.getMonth() ? " on" : ""}${now.getFullYear() === y && now.getMonth() === i ? " now" : ""}" ${attr}="${ymd(new Date(y, i, 1))}">${new Date(y, i, 1).toLocaleDateString(undefined, { month: "short" })}</button>`).join("")}</div>`; };
  function orgCalHtml() {
    const today = new Date(), month = org.calMonth || calDefault();
    const m0 = parseYmd(month), y = m0.getFullYear(), mo = m0.getMonth(), first = new Date(y, mo, 1).getDay(), days = new Date(y, mo + 1, 0).getDate();
    const evs = calEvents(), byDay = {}; evs.forEach(e => { (byDay[e.date] = byDay[e.date] || []).push(e); });
    const sel = org.calDay || ymd(today), cells = [];
    for (let i = 0; i < first; i++) cells.push(`<span class="cal-cell blank"></span>`);
    for (let d = 1; d <= days; d++) { const k = ymd(new Date(y, mo, d)), list = byDay[k] || [];
      cells.push(`<button type="button" class="cal-cell${k === sel ? " sel" : ""}${k === ymd(today) ? " today" : ""}${list.length ? " has" : ""}" data-oday="${k}"><span>${d}</span><i>${list.slice(0, 3).map(() => "●").join("")}</i></button>`); }
    const dayList = byDay[sel] || [];
    return `<div class="card org-card cal-card"><div class="cal-head"><button type="button" class="icon-btn" data-omonth="-1" aria-label="Previous month">‹</button><b>${m0.toLocaleDateString(undefined, { month: "long", year: "numeric" })}</b><button type="button" class="icon-btn" data-omonth="1" aria-label="Next month">›</button></div>
        ${monthChips(m0, "data-omgo")}<p class="mc-hint">Swipe left or right to change month</p>
        <div class="cal-grid">${["S", "M", "T", "W", "T", "F", "S"].map(d => `<span class="cal-dow">${d}</span>`).join("")}${cells.join("")}</div><div class="send-btns" style="margin-top:10px"><button type="button" class="btn btn-ghost" data-print="calendar">🖨️ Print this month</button></div></div>
      <div class="card org-card"><h3>${shortDate(sel)}</h3>
        ${dayList.length ? `<ul class="cal-list">${dayList.map(e => `<li class="${e.auto ? "auto" : ""}" ${e.mine ? `data-oev="${e.id}"` : ""}><span class="cl-time">${e.time ? mclock(parseYmd(e.date).setHours(...e.time.split(":").map(Number))) : "All day"}</span><span class="cl-txt">${e.mine ? memberEmoji(e.who) : e.icon} ${esc(e.title)}${e.notes ? `<small>${esc(e.notes)}</small>` : ""}${e.auto ? `<small>From your Noël plans</small>` : ""}</span>${e.mine ? `<button class="icon-btn" data-odelev aria-label="Remove">✕</button>` : ""}</li>`).join("")}</ul>` : `<p class="host-rem">Nothing planned yet.</p>`}
        <form id="orgEventForm" class="org-ev-form" autocomplete="off">
          <input class="input" name="title" maxlength="60" placeholder="Type your own or pick below" aria-label="Event">
          ${fillChips((hubMode === "company" ? ["🎉 Office party", "🎁 Gift exchange", "🥘 Potluck lunch", "📞 Client gifts go out", "🏖️ Office closed"] : ["🎶 School concert", "⭐ Christmas pageant", "🎅 Photos with Santa", "🎄 Tree lighting", "⛪ Christmas Eve service", "💼 Work party", "🏒 Hockey game", "🍪 Cookie exchange", "🎁 Gift exchange", "🛍️ Holiday shopping day", "✈️ Travel day", "🦃 Family dinner", "✏️ Other (type your own)"]).map(x => [x, /Other/.test(x) ? "" : x.replace(/^\S+\s/, "")]), "#orgEventForm [name=title]")}
          <div class="org-addr-row"><input class="input" name="time" type="time" aria-label="Time"><select class="input" name="who" aria-label="Who"><option value="">Everyone</option>${org.members.map(m => `<option value="${m.id}">${m.emoji} ${esc(m.name)}</option>`).join("")}</select></div>
          <input class="input" name="notes" maxlength="80" placeholder="Notes, e.g. bring 24 cupcakes, wear red" aria-label="Notes">
          <label class="host-check"><input type="checkbox" name="remind" checked> 🔔 Remind me the evening before${" "}and 1 hour before</label>
          <button class="btn btn-green btn-block" type="submit">➕ Add to ${shortDate(sel)}</button></form></div>
      <div class="card org-card"><h3>${hubMode === "company" ? "👥 Team members" : "👪 Family members"}</h3><div class="apps-filters">${org.members.map(m => `<span class="chip on">${m.emoji} ${esc(m.name)} <button type="button" class="chip-x" data-odelmem="${m.id}" aria-label="Remove ${esc(m.name)}">✕</button></span>`).join("")}</div>
        <form id="orgMemberForm" class="org-addr-row" autocomplete="off"><select class="input" name="emoji" aria-label="Emoji">${MEMBER_EMOJI.map(e => `<option>${e}</option>`).join("")}</select><input class="input" name="mname" maxlength="20" placeholder="Name" aria-label="Name"><button class="btn btn-green" type="submit">Add</button></form>
        <p class="host-rem">Each person's symbol shows on their days, so you can see whose event it is at a glance.</p></div>`;
  }
  const calDefault = () => { const n = new Date(), m = n.getMonth(); return m === 10 || m === 11 || m === 0 ? ymd(new Date(n.getFullYear(), m, 1)) : ymd(new Date(orgYear(), 11, 1)); };
  const memberEmoji = id => (org.members.find(m => m.id === id) || {}).emoji || "📌";

  // ---------- 📅 the tiny calendar in the header (opens as a small popup anywhere in the app) ----------
  let miniM = "", miniD = "";
  function calBtnIcon() {
    const b = $("#calBtn"); if (!b) return;
    b.innerHTML = `<span class="cal-txt">Timers<br>/Cal</span>`;
  }
  // 👆 swipe the calendar grid left or right to change month (mini popup and full calendar)
  (() => { let x0 = 0, y0 = 0, on = false;
    document.addEventListener("touchstart", e => { const g = e.target.closest(".cal-grid"); on = !!g && !!(g.closest("#miniCal") || g.closest(".cal-card")); if (on) { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; } }, { passive: true });
    document.addEventListener("touchend", e => { if (!on) return; on = false; const dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0; if (Math.abs(dx) < 50 || Math.abs(dy) > Math.abs(dx) * .7) return;
      const step = dx < 0 ? "1" : "-1", b = document.querySelector(`#miniCal [data-mcmonth="${step}"]`) || document.querySelector(`.cal-card [data-omonth="${step}"]`); if (b) b.click(); }, { passive: true });
  })();
  // keep the chosen month in view in the month strip
  new MutationObserver(() => { document.querySelectorAll(".mc-months:not([data-ctr])").forEach(st => { const on = st.querySelector(".on"); if (!on) return; st.dataset.ctr = 1; st.scrollLeft = on.offsetLeft - (st.clientWidth - on.offsetWidth) / 2; }); }).observe(document.body, { childList: true, subtree: true });
  function closeMini() { const el = $("#miniCal"); if (el) el.remove(); }
  function openMiniCal() {
    if ($("#miniCal")) { closeMini(); return; }
    const t = new Date(); miniM = ymd(new Date(t.getFullYear(), t.getMonth(), 1)); miniD = ymd(t);
    const el = document.createElement("div"); el.id = "miniCal"; el.className = "pr-overlay mc-overlay"; el.setAttribute("role", "dialog"); el.setAttribute("aria-modal", "true"); document.body.appendChild(el);
    renderMini();
    const touched = () => { saveOrg(); orgSync(); renderMini(); calBtnIcon(); if ($("#view-org") && $("#view-org").classList.contains("active")) renderOrg(); };
    el.addEventListener("click", e => {
      const t2 = e.target;
      if (t2 === el || t2.closest("[data-mcclose]")) { closeMini(); return; }
      const mo = t2.closest("[data-mcmonth]"); if (mo) { const m0 = parseYmd(miniM); miniM = ymd(new Date(m0.getFullYear(), m0.getMonth() + +mo.dataset.mcmonth, 1)); renderMini(); return; }
      const go = t2.closest("[data-mcgo]"); if (go) { miniM = go.dataset.mcgo; renderMini(); return; }
      const dy = t2.closest("[data-mcday]"); if (dy) { miniD = dy.dataset.mcday; renderMini(); return; }
      const dl = t2.closest("[data-mcdel]"); if (dl) { if (confirm("Remove this event?")) { org.events = org.events.filter(x => x.id !== dl.dataset.mcdel); touched(); } return; }
      if (t2.closest("[data-mcfull]")) { closeMini(); org.view = "cal"; org.calDay = miniD; saveOrg(); showView("org"); renderOrg(); window.scrollTo(0, 0); }
    });
    el.addEventListener("change", e => {
      const mv = e.target.closest("[data-mcmove]"); if (!mv || !mv.value) return;
      const ev = org.events.find(x => x.id === mv.dataset.mcmove); if (!ev) return;
      ev.date = mv.value; miniD = mv.value; miniM = ymd(new Date(parseYmd(mv.value).getFullYear(), parseYmd(mv.value).getMonth(), 1)); toast("📅 Moved to " + shortDate(mv.value)); touched();
    });
    el.addEventListener("submit", e => {
      e.preventDefault(); const f = e.target; if (f.id !== "mcForm") return; const ti = f.title.value.trim(); if (!ti) { toast("📅 Give it a name"); return; }
      org.events.push({ id: uid(), date: miniD, time: f.time.value, title: ti, who: "", notes: "", remind: true }); toast("📅 Added"); touched();
    });
  }
  function renderMini() {
    const el = $("#miniCal"); if (!el) return;
    const today = ymd(new Date()), m0 = parseYmd(miniM), y = m0.getFullYear(), mo = m0.getMonth(), first = new Date(y, mo, 1).getDay(), days = new Date(y, mo + 1, 0).getDate();
    const evs = calEvents(), byDay = {}; evs.forEach(e => { (byDay[e.date] = byDay[e.date] || []).push(e); });
    const cells = []; for (let i = 0; i < first; i++) cells.push(`<span class="cal-cell blank"></span>`);
    for (let d = 1; d <= days; d++) { const k = ymd(new Date(y, mo, d)), n = (byDay[k] || []).length; cells.push(`<button type="button" class="cal-cell${k === miniD ? " sel" : ""}${k === today ? " today" : ""}${n ? " has" : ""}" data-mcday="${k}"><span>${d}</span><i>${n ? "●" : ""}</i></button>`); }
    const list = byDay[miniD] || [], t12 = t => t ? mclock(parseYmd(miniD).setHours(...t.split(":").map(Number))) : "All day";
    el.innerHTML = `<div class="pr-card mc-card"><div class="cal-head"><button type="button" class="icon-btn" data-mcmonth="-1" aria-label="Previous month">‹</button><b>${m0.toLocaleDateString(undefined, { month: "long", year: "numeric" })}</b><button type="button" class="icon-btn" data-mcmonth="1" aria-label="Next month">›</button><button type="button" class="icon-btn mc-x" data-mcclose aria-label="Close">✕</button></div>
      ${monthChips(m0, "data-mcgo")}
      <div class="cal-grid">${["S", "M", "T", "W", "T", "F", "S"].map(d => `<span class="cal-dow">${d}</span>`).join("")}${cells.join("")}</div>
      <div class="mc-day"><h4>${shortDate(miniD)}</h4>
        ${list.length ? `<ul class="cal-list">${list.map(e => `<li><span class="cl-time">${t12(e.time)}</span><span class="cl-txt">${esc(e.title)}${e.auto ? `<small>${hubMode === "company" ? "From your plan" : "Added for you"}</small>` : `<small><label class="mc-mv">Move to <input type="date" class="input" data-mcmove="${e.id}" value="${e.date}"></label> <button type="button" class="of-lnk" data-mcdel="${e.id}">Remove</button></small>`}</span></li>`).join("")}</ul>` : `<p class="host-rem">Nothing booked.</p>`}
        <form id="mcForm" class="mc-add" autocomplete="off"><input class="input" name="title" maxlength="60" placeholder="Add something on this day"><input class="input" name="time" type="time" aria-label="Time"><button class="btn btn-green" type="submit">Add</button></form>
        <button type="button" class="classy-link" data-mcfull>Open the full calendar ›</button></div></div>`;
  }

  // ---------- 🙏 Thank-yous ----------
  function orgThanksHtml() {
    const done = org.thanks.filter(t => t.done).length;
    return `<div class="card org-card"><p class="host-rem">${org.thanks.length ? `${done} of ${org.thanks.length} thank-yous sent${done === org.thanks.length ? " 🎉" : ""}` : "Jot down gifts as they're opened, then tick each thank-you as it's sent."}</p>
      <ul class="host-list">${org.thanks.map(t => `<li data-ot="${t.id}"><label class="${t.done ? "on" : ""}"><input type="checkbox" data-otdone ${t.done ? "checked" : ""}><span><b>${esc(t.from)}</b>${t.gift ? ` · ${esc(t.gift)}` : ""}</span></label><button type="button" class="chip" data-otnote>✉️ Note</button><button class="icon-btn" data-odel aria-label="Remove">✕</button></li>`).join("")}</ul>
      <form id="orgThanksForm" class="org-ev-form" autocomplete="off"><div class="org-addr-row"><input class="input" name="from" list="orgNames" maxlength="40" placeholder="From" aria-label="From"><input class="input" name="gift" maxlength="50" placeholder="Gift" aria-label="Gift"></div><button class="btn btn-green btn-block" type="submit">➕ Add</button></form>
      <datalist id="orgNames">${[...new Set(org.contacts.map(c => c.name).concat(gifts.people.map(p => p.name)))].map(n => `<option value="${esc(n)}">`).join("")}</datalist></div>`;
  }
  // ✉️ ready-to-send thank-you wording, personalised with who & what
  const TY_TPL = [
    ["⭐ Heartfelt", "Dear {from},\n\nThank you so much for the {gift}! It was so thoughtful of you, and we absolutely love it. Wishing you a wonderful new year!"],
    ["😊 Friendly", "Hi {from}! Just wanted to say a big thank you for the {gift}. You always know exactly what we'll love. ⭐"],
    ["🧒 From the kids", "Dear {from},\n\nThank you for the {gift}! I really like it and I use it every day. Thank you for thinking of me!\n\nLove, "],
    ["💵 Money or gift card", "Dear {from},\n\nThank you for your generous gift! We're planning to put it toward something special, and we'll think of you when we do."],
    ["💬 Quick text", "Thank you for the {gift}, {from}! Loved it. Merry Christmas! 🎄"],
    ["💼 Work", "Thank you for the {gift}! It was such a kind surprise and really made my day. Happy holidays!"]
  ];
  function showTy(t) {
    $("#tyTitle").textContent = `Thank-you for ${t.from}`;
    $("#tyBody").innerHTML = TY_TPL.map(([l, txt], i) => { const msg = txt.replace(/\{from\}/g, t.from).replace(/\{gift\}/g, t.gift || "lovely gift");
      return `<div class="ty-tpl"><b>${l}</b><p>${esc(msg)}</p><div class="send-btns"><button type="button" class="btn btn-ghost" data-tycopy="${i}">📋 Copy</button><button type="button" class="btn btn-green" data-tyshare="${i}">💬 Send</button></div></div>`; }).join("");
    $("#tyPop").dataset.t = t.id; $("#tyPop").classList.add("show");
  }
  $("#tyPop").addEventListener("click", async e => {
    if (e.target.id === "tyPop" || e.target.closest("#tyClose")) { $("#tyPop").classList.remove("show"); return; }
    const c = e.target.closest("[data-tycopy],[data-tyshare]"); if (!c) return;
    const msg = c.closest(".ty-tpl").querySelector("p").textContent, t = org.thanks.find(x => x.id === $("#tyPop").dataset.t);
    if (c.dataset.tycopy != null) { try { await navigator.clipboard.writeText(msg); toast("📋 Copied! Paste it into a card, text or email"); } catch (err) { toast("Couldn't copy on this device"); } }
    else { const sh = NoelNative.plugin("Share"); try { if (sh) await sh.share({ text: msg }); else if (navigator.share) await navigator.share({ text: msg }); else location.href = "sms:?&body=" + encodeURIComponent(msg); } catch (err) {} }
    if (t && !t.done && confirm("Mark this thank-you as sent?")) { t.done = true; saveOrg(); renderOrg(); $("#tyPop").classList.remove("show"); }
  });
  // ---------- 📦 Packages ----------
  function orgPackagesHtml() {
    const today = ymd(new Date());
    return `<div class="card org-card"><p class="host-rem">Track online orders so nothing goes missing. You'll get a nudge on each delivery day, plus a reminder in mid-December to check stores' last order dates for Christmas delivery.</p></div>
      ${org.packages.map(p => { const late = p.eta && p.eta < today && !p.arrived;
        return `<div class="card org-item${p.arrived ? " done" : ""}" data-op="${p.id}"><div class="host-row"><b>${esc(p.item)}</b><button class="icon-btn" data-odel aria-label="Remove">✕</button></div>
          <p class="org-addr">${esc(p.store || "")}${p.eta ? ` · expected ${shortDate(p.eta)}` : ""}${p.track ? ` · #${esc(p.track)}` : ""}</p>
          ${late ? `<p class="org-warn">⚠️ Running late. Check the tracking or contact the store.</p>` : ""}
          <button type="button" class="chip${p.arrived ? " on" : ""}" data-oarrived>${p.arrived ? "✓ Arrived" : "Mark as arrived"}</button></div>`; }).join("")}
      <form class="card add-task org-ev-form" id="orgPackageForm" autocomplete="off"><h3>➕ Add an order</h3>
        <input class="input" name="item" maxlength="60" placeholder="What did you order?" aria-label="Item">
        ${fillChips((currency === "USD" ? ["Amazon", "Walmart", "Target", "Best Buy", "Costco", "Etsy"] : ["Amazon", "Walmart", "Canadian Tire", "Best Buy", "Costco", "Etsy"]).map(x => [x]), "#orgPackageForm [name=store]")}
        <div class="org-addr-row"><input class="input" name="store" maxlength="30" placeholder="Store" aria-label="Store"><input class="input" name="eta" type="date" aria-label="Expected delivery"></div>
        <input class="input" name="track" maxlength="40" placeholder="Tracking number (optional)" aria-label="Tracking number">
        <button class="btn btn-green btn-block" type="submit">Add</button></form>`;
  }
  // ---------- ⭐ Giving ----------
  const GIVE_IDEAS = ["Food bank donation", "Toy drive", "Winter coat drive", "Animal shelter", "Volunteer shift", "Sponsor a family", "Gift for a neighbour in need"];
  function orgGivingHtml() {
    const total = org.giving.reduce((a, g) => a + (+g.amt || 0), 0);
    return `<div class="card org-card"><div class="org-stats"><span><b>${org.giving.length}</b> acts of kindness</span><span><b>${money(total)}</b> given</span></div>
        <p class="host-rem">Tap an idea to add it, or type your own.</p><div class="apps-filters">${GIVE_IDEAS.map(i => `<button type="button" class="chip" data-ogive="${esc(i)}">＋ ${esc(i)}</button>`).join("")}</div></div>
      <div class="card org-card"><ul class="host-list">${org.giving.map(g => `<li data-og="${g.id}"><label class="${g.done ? "on" : ""}"><input type="checkbox" data-ogdone ${g.done ? "checked" : ""}><span>${esc(g.what)}${+g.amt ? ` · ${money(+g.amt)}` : ""}</span></label><button class="icon-btn" data-odel aria-label="Remove">✕</button></li>`).join("") || `<li class="host-rem">Nothing yet.</li>`}</ul>
        <form id="orgGiveForm" class="org-addr-row" autocomplete="off" style="margin-top:10px"><input class="input" name="what" maxlength="50" placeholder="e.g. Toys for the hospital" aria-label="What"><input class="input" name="amt" type="number" inputmode="decimal" min="0" placeholder="$" aria-label="Amount" style="max-width:80px"><button class="btn btn-green" type="submit">Add</button></form></div>`;
  }
  // ---------- 🗂️ Spending ----------
  function orgSpendHtml() {
    const T = budTotals();
    return `<div class="card org-card" style="text-align:center">${budPie(T.by, T.spent, T.limit, 180)}
        <p class="host-rem">Your full budget, with charts, a spreadsheet and category budgets, now has its own tab at the bottom.</p>
        <button type="button" class="btn btn-red btn-block" data-goview="budget">💰 Open the Budget tab</button></div>`;
  }
  // ---------- reminders (calendar events, deliveries, card mailing, order cut-off) ----------
  function orgReminders() {
    const out = [], y = orgYear(), add = (k, t, icon, text) => out.push({ k, t, icon, text });
    org.events.forEach(e => {
      if (!e.remind) return; const day = parseYmd(e.date);
      const eve = new Date(day); eve.setDate(eve.getDate() - 1); eve.setHours(18, 30, 0, 0);
      add("e1-" + e.id, eve.getTime(), memberEmoji(e.who), `Tomorrow: ${e.title}${e.notes ? ` (${e.notes})` : ""}`);
      if (e.time) { const [h, m] = e.time.split(":").map(Number); const t = new Date(day); t.setHours(h, m, 0, 0); add("e2-" + e.id, t.getTime() - 3600000, memberEmoji(e.who), `In 1 hour: ${e.title}`); }
    });
    org.packages.forEach(p => { if (p.eta && !p.arrived) { const t = parseYmd(p.eta); t.setHours(9, 0, 0, 0); add("p-" + p.id, t.getTime(), "📦", `${p.item} should arrive today${p.store ? ` from ${p.store}` : ""}`); } });
    if (org.contacts.length) add("cards-" + y, new Date(y, 11, 10, 10).getTime(), "✉️", "Time to mail your Christmas cards! Check the post office's holiday cut-off dates.");
    if (org.packages.length) add("cutoff-" + y, new Date(y, 11, 12, 10).getTime(), "📦", "Ordering gifts online? Check each store's last order date for Christmas delivery.");
    return out.sort((a, b) => a.t - b.t);
  }
  function orgSync() {
    if (!NoelNative.isNative()) return;
    NoelNative.scheduleList(7000, 8000, orgReminders().filter(r => !org.fired[r.k] && r.t > Date.now()).map(r => ({ t: r.t, title: `${r.icon} ${r.text}`, body: "Noël Tier 1 Hub" })));
  }
  function orgTick() {
    const now = Date.now(), due = orgReminders().filter(r => !org.fired[r.k] && r.t <= now);
    if (!due.length) return; due.forEach(r => { org.fired[r.k] = 1; }); saveOrg();
    const fresh = due.filter(r => now - r.t < 10 * 60000); if (fresh.length) triggerAlert(fresh.map(r => ({ id: "org:" + r.k })));
  }
  setInterval(orgTick, 15000);
  function orgAlertItem(id) { if (!String(id).startsWith("org:")) return null; const r = orgReminders().find(x => "org:" + x.k === id); return r ? { icon: r.icon, name: r.text } : null; }

  // ---------- taps & typing ----------
  function renderCardBar() {
    const el = $("#clBar"); if (!el) return;
    const y = orgYear(), on = org.contacts.filter(c => c.list !== false), sent = on.filter(c => (c.sent || {})[y]).length;
    const co = hubMode === "company";
    el.innerHTML = org.contacts.length
      ? `<span class="cl-t"><b>${sent} of ${on.length}</b> ${co ? "client and staff cards" : "Christmas cards"} sent<small>${on.length - sent ? `${on.length - sent} still to send` : "Everyone on your list is done"}</small></span><button type="button" class="btn btn-ghost btn-sm" data-clopen>${co ? "Client list" : "My card list"} ›</button>`
      : `<span class="cl-t"><b>${co ? "Your client card list" : "Your Christmas card list"}</b><small>${co ? "Add clients, vendors and staff with their addresses, then tick them off as you send" : "Add names and addresses, then tick people off as you send"}</small></span><button type="button" class="btn btn-ghost btn-sm" data-clopen>Start my list ›</button>`;
    const dl = $("#cardNames"); if (dl) dl.innerHTML = org.contacts.map(c => `<option value="${esc(c.name)}">`).join("");
  }
  document.addEventListener("click", e => { if (e.target.closest("[data-clopen]")) { org.editing = null; saveOrg(); showView("invites"); showPane("cardlist"); window.scrollTo(0, 0); } });
  const orgChanged = () => { saveOrg(); renderOrg(); orgSync(); renderCardBar(); };
  const orgH_click = e => {
    const t = e.target, y = orgYear();
    const tool = t.closest("[data-otool]"); if (tool) { org.view = tool.dataset.otool; org.editing = null; saveOrg(); renderOrg(); window.scrollTo({ top: 0 }); return; }
    if (t.closest("#orgCsv")) {
      const q = v => `"${String(v || "").replace(/"/g, '""')}"`;
      const csv = ["Name,Street,City,Province/State,Postal/ZIP,Sent " + y + ",Received " + y].concat(org.contacts.map(c => [c.name, c.street, c.city, c.region, c.postal, (c.sent || {})[y] ? "yes" : "", (c.recv || {})[y] ? "yes" : ""].map(q).join(","))).join("\r\n");
      NoelMedia.share(new Blob([csv], { type: "text/csv" }), "Christmas-Card-List.csv", "Christmas card list").then(h => { if (h === "saved") toast("📄 Spreadsheet saved to your downloads"); }).catch(() => {}); return;
    }
    const og = t.closest("[data-omgo]"); if (og) { org.calMonth = og.dataset.omgo; saveOrg(); renderOrg(); return; }
    const mo = t.closest("[data-omonth]"); if (mo) { const m0 = parseYmd(org.calMonth || calDefault()); org.calMonth = ymd(new Date(m0.getFullYear(), m0.getMonth() + +mo.dataset.omonth, 1)); saveOrg(); renderOrg(); return; }
    const day = t.closest("[data-oday]"); if (day) { org.calDay = day.dataset.oday; saveOrg(); renderOrg(); return; }
    const dm = t.closest("[data-odelmem]"); if (dm) { org.members = org.members.filter(m => m.id !== dm.dataset.odelmem); orgChanged(); return; }
    const dev = t.closest("[data-odelev]"); if (dev) { org.events = org.events.filter(x => x.id !== dev.closest("[data-oev]").dataset.oev); orgChanged(); return; }
    const gi2 = t.closest("[data-ogive]"); if (gi2) { org.giving.push({ id: uid(), what: gi2.dataset.ogive, amt: 0, done: false }); orgChanged(); toast("⭐ Added"); return; }
    const c = t.closest("[data-oc]"), ct = c && org.contacts.find(x => x.id === c.dataset.oc);
    if (ct) {
      if (t.closest("[data-osent]")) { ct.sent = ct.sent || {}; ct.sent[y] = !ct.sent[y]; }
      else if (t.closest("[data-orecv]")) { ct.recv = ct.recv || {}; ct.recv[y] = !ct.recv[y]; }
      else if (t.closest("[data-olist]")) ct.list = ct.list === false;
      else if (t.closest("[data-oedit]")) org.editing = org.editing === ct.id ? null : ct.id;
      else if (t.closest("[data-odone]")) org.editing = null;
      else if (t.closest("[data-odel]")) { if (!confirm(`Remove ${ct.name}?`)) return; org.contacts = org.contacts.filter(x => x !== ct); }
      else return;
      orgChanged(); return;
    }
    const pk = t.closest("[data-op]"), p = pk && org.packages.find(x => x.id === pk.dataset.op);
    if (p) { if (t.closest("[data-oarrived]")) { p.arrived = !p.arrived; if (p.arrived) toast("📦 Arrived!"); } else if (t.closest("[data-odel]")) org.packages = org.packages.filter(x => x !== p); else return; orgChanged(); return; }
    const tn = t.closest("[data-otnote]"); if (tn) { const x = org.thanks.find(z => z.id === tn.closest("[data-ot]").dataset.ot); if (x) showTy(x); return; }
    if (t.closest("[data-odel]")) {
      const th = t.closest("[data-ot]"), gv = t.closest("[data-og]"), ot = t.closest("[data-oo]");
      if (th) org.thanks = org.thanks.filter(x => x.id !== th.dataset.ot);
      if (gv) org.giving = org.giving.filter(x => x.id !== gv.dataset.og);
      if (ot) org.other = org.other.filter(x => x.id !== ot.dataset.oo);
      orgChanged();
    }
  };
  orgRoots().forEach(r => r.addEventListener("click", orgH_click));
  const orgH_change = e => {
    const t = e.target;
    const af = t.closest("[data-oaf]");
    if (af && t.dataset.oa) { const tgt = af.dataset.oaf === "me" ? org.me : org.contacts.find(x => x.id === t.closest("[data-oc]").dataset.oc); if (tgt) { tgt[t.dataset.oa] = t.value.trim(); saveOrg(); } return; }
    if (t.dataset.otdone != null) { const x = org.thanks.find(z => z.id === t.closest("[data-ot]").dataset.ot); x.done = t.checked; saveOrg(); renderOrg(); return; }
    if (t.dataset.ogdone != null) { const x = org.giving.find(z => z.id === t.closest("[data-og]").dataset.og); x.done = t.checked; saveOrg(); renderOrg(); return; }
  };
  orgRoots().forEach(r => r.addEventListener("change", orgH_change));
  const orgH_submit = e => {
    e.preventDefault(); const f = e.target;
    if (f.id === "orgContactForm") { const n = f.cname.value.trim(); if (!n) return; const c = { id: uid(), name: n, sent: {}, recv: {} }; org.contacts.push(c); org.editing = c.id; }
    if (f.id === "orgEventForm") { const ti = f.title.value.trim(); if (!ti) { toast("📅 Give the event a name"); return; } org.events.push({ id: uid(), date: org.calDay || ymd(new Date()), time: f.time.value, title: ti, who: f.who.value, notes: f.notes.value.trim(), remind: f.remind.checked }); toast("📅 Added to your calendar"); }
    if (f.id === "orgMemberForm") { const n = f.mname.value.trim(); if (!n) return; org.members.push({ id: uid(), name: n, emoji: f.emoji.value }); }
    if (f.id === "orgThanksForm") { const fr = f.from.value.trim(); if (!fr) return; org.thanks.push({ id: uid(), from: fr, gift: f.gift.value.trim(), done: false }); }
    if (f.id === "orgPackageForm") { const it = f.item.value.trim(); if (!it) return; org.packages.push({ id: uid(), item: it, store: f.store.value.trim(), eta: f.eta.value, track: f.track.value.trim(), arrived: false }); }
    if (f.id === "orgGiveForm") { const w = f.what.value.trim(); if (!w) return; org.giving.push({ id: uid(), what: w, amt: parseFloat(f.amt.value) || 0, done: false, date: budToday() }); }
    if (f.id === "orgOtherForm") { const n = f.name.value.trim(); if (!n) return; org.other.push({ id: uid(), name: n, amt: parseFloat(f.amt.value) || 0 }); }
    orgChanged();
  };
  orgRoots().forEach(r => r.addEventListener("submit", orgH_submit));
  // ✉️ a card sent from the Outbox ticks that person off the Christmas card list
  window.__orgTickSent = name => { const ct = org.contacts.find(c => String(c.name || "").trim().toLowerCase() === name); if (ct) { ct.sent = ct.sent || {}; ct.sent[orgYear()] = true; orgChanged(); return true; } return false; };
  renderCardBar();
  /* @org-end */
