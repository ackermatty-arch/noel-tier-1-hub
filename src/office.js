  /* ============================================================
     🏢 OFFICE PARTY PLAN (Office Edition → Office space only)
     📋 Event · 📨 Approval · 🥘 Potluck · 🏆 Awards · 📦 Handover
     - Event: details, activities, costs & vendors, and last year's notes
     - Approval: writes a professional approval request, sends it by
       email or as a PDF, tracks the answer and nudges you to follow up
     - Potluck sign-ups (with a printable sign-up sheet for the lunchroom)
     - Silly Office Awards with printable certificates
     - Handover: Year-End Report, a password-locked handover file for the
       next coordinator, and "remove the office plans from this phone"
     ============================================================ */
  const OFF_ACTS = [["potluck", "🥘 Potluck"], ["catered", "🍽️ Catered meal"], ["gifts", "🎁 Gift exchange"], ["awards", "🏆 Silly Office Awards"], ["games", "🎲 Games & trivia"], ["sweater", "🧶 Ugly sweater contest"], ["charity", "⭐ Charity drive"], ["booth", "📸 Photo booth"], ["elephant", "🎁 White elephant"], ["santa", "🎅 Santa visit"], ["teamb", "🧩 Team building"], ["music", "🎶 Music / DJ"], ["outing", "⛸️ Team outing"]];
  // 👥 who's invited shapes the whole party
  const OFF_WHO = [["staff", "💼", "Staff only", "Just the team. Great for a lunch, an after-work party or a team outing."],
    ["partners", "🥂", "Staff + partners", "Spouses and partners welcome. Usually an evening party, a little dressier."],
    ["family", "👨‍👩‍👧", "Family party", "Kids welcome! Daytime fun with crafts, games and maybe a visit from Santa."]];
  const OFF_KID_ACTS = [["santavisit", "🎅 Santa visit"], ["kidcraft", "🎨 Kids' craft table"], ["cookies", "🍪 Cookie decorating"], ["kidgames", "🧩 Kids' games corner"]];
  const offWho = () => OFF_WHO.find(w => w[0] === off.ev.who);
  const OFF_COSTS = ["Venue", "Catering", "Drinks", "Entertainment", "Decorations", "Prizes & awards", "Gifts", "Supplies", "Transportation", "Other"];
  const OFF_POT = [["mains", "🍗 Mains", 0.2], ["sides", "🥔 Sides", 0.2], ["salads", "🥗 Salads & veggies", 0.15], ["apps", "🧀 Appetizers", 0.15], ["desserts", "🍰 Desserts", 0.2], ["drinks", "🥤 Drinks", 0.1], ["supplies", "🍽️ Plates, cups & napkins", 0]];
  const OFF_DIET = [["V", "Vegetarian"], ["VG", "Vegan"], ["GF", "Gluten-free"], ["DF", "Dairy-free"], ["N", "Contains nuts"]];
  const OFF_AWARDS = ["Most Likely to Reply-All", "The Coffee Champion", "Best Desk Snacks", "Queen/King of Spreadsheets", "The Unmute Award (\"You're on mute!\")", "Office DJ", "Best Out-of-Office Message", "The Plant Whisperer", "Most Creative Excuse for Being Late", "Calendar Tetris Champion", "The Fridge Detective", "Best Holiday Sweater", "Most Emojis per Email", "The Office Comedian", "Most Likely to Bring Treats", "Unsung Hero of the Year"];
  let off = load("office", null) || {
    tab: "event", ev: { name: "Holiday Party", date: "", start: "17:00", end: "21:00", venue: "", address: "", headcount: 20, budget: 0, theme: "", dress: "", giftLimit: 25, organizer: "", approver: "", approverEmail: "", notes: "" },
    acts: { potluck: 1, gifts: 1, awards: 1, games: 1 }, costs: [], appr: { status: "draft", log: [], followDays: 3 },
    pot: [], awards: OFF_AWARDS.slice(0, 8).map(t => ({ id: uid(), t, w: "" })), wrap: { worked: "", change: "" }, past: [], fired: {}
  };
  const saveOff = () => save("office", off);
  const offDate = (d, o) => d ? new Date(d + "T12:00").toLocaleDateString(undefined, o || { weekday: "long", month: "long", day: "numeric", year: "numeric" }) : "";
  const offTime = hm => hm ? mclock(new Date(`2026-01-01T${hm}`)) : "";
  const offTotal = () => off.costs.reduce((a, c) => a + (+c.cost || 0), 0);
  const offActList = () => OFF_ACTS.concat(off.ev.who === "family" ? OFF_KID_ACTS : []);
  const offActs = () => offActList().filter(([k]) => off.acts[k]).map(([k, l]) => k === "gifts" && off.ev.giftLimit ? `${l} (${money(+off.ev.giftLimit)} limit)` : k === "teamb" && (off.tbPick || []).length ? `${l}: ${off.tbPick.join(", ")}` : l);
  const offYear = () => (off.ev.date ? +off.ev.date.slice(0, 4) : new Date().getFullYear());

  // ---------- 🔗 vendor links + order-by dates ----------
  const offUrl = u => /^https?:\/\//i.test(u) ? u : "https://" + u;
  const offDays = ymd => Math.ceil((new Date(ymd + "T12:00").getTime() - Date.now()) / 864e5);
  function offLinks(c) {
    const ct = (c.contact || "").trim(), out = [];
    if (/@/.test(ct)) out.push(`<a class="of-lnk" href="mailto:${esc(ct.split(/[\s,;]+/).find(x => /@/.test(x)) || ct)}">Email</a>`);
    else if (/\d{3}[\s.\-)]*\d{3,4}/.test(ct)) out.push(`<a class="of-lnk" href="tel:${esc(ct.replace(/[^\d+]/g, ""))}">Call</a>`);
    if (c.url) out.push(`<a class="of-lnk" href="${esc(offUrl(c.url))}" target="_blank" rel="noopener">Order online</a>`);
    return out.join("");
  }
  function offOrderHtml(c) {
    let by = "";
    if (c.orderBy) { const d = offDays(c.orderBy); by = c.ordered ? `<small>✓ Ordered</small>` : `<small>Order by ${esc(offDate(c.orderBy, { month: "short", day: "numeric" }))}${d < 0 ? " · date has passed" : d <= 7 ? ` · ${d} ${d === 1 ? "day" : "days"} left` : ""}</small>`; }
    const links = offLinks(c);
    return by + (links || c.orderBy ? `<span class="of-acts">${links}${c.orderBy || c.url ? `<button type="button" class="of-lnk of-done" data-ocdone="${c.id}">${c.ordered ? "Undo" : "Mark ordered"}</button>` : ""}</span>` : "");
  }
  const OFF_STATUS = { draft: "Not sent yet", sent: "Waiting", changes: "Changes asked", approved: "Approved", declined: "Declined" };
  // ============================================================
  // 🗓️ OFFICE YEAR: many events, starter checklists, a 12-month calendar,
  // birthdays & anniversaries, and one yearly budget
  // `off` is always the event you have open; the others wait in `oy.events`.
  // ============================================================
  const OY_MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const OY_CATS = { rec: "Recognition", well: "Wellness", team: "Team fun", comm: "Community", learn: "Learning", cele: "Celebration" };
  const OY_GEN = [[21, "Pick the date and book the space"], [14, "Decide the food and order it"], [7, "Send the invitation"], [2, "Confirm the headcount"], [0, "Set up and enjoy it"]];
  const OY_TYPES = [
    { id: "kickoff", name: "New Year kick-off lunch", m: 1, cat: "cele", start: "12:00", end: "13:30", acts: ["catered", "games"], theme: "Fresh start", sign: "Happy New Year! Add your goal to the board.", chk: [[21, "Pick a date and book the room"], [14, "Choose catered or potluck"], [7, "Send the invitation"], [3, "Set up a goals board or flip chart"], [0, "Welcome everyone and share the year's plan"]] },
    { id: "kindness", name: "Random acts of kindness week", m: 2, cat: "comm", start: "09:00", end: "17:00", acts: ["games"], sign: "Kindness week. Do one kind thing today and tell us about it.", chk: [[14, "Choose the week and tell the team"], [7, "Make a kindness board or jar"], [3, "Buy small treats to hand out"], [0, "Start the week and share a kind act each day"]] },
    { id: "appreciation", name: "Employee Appreciation Day", m: 3, cat: "rec", start: "12:00", end: "13:30", acts: ["catered"], theme: "Thank you", hint: "Often the first Friday in March. Check the date for your country.", sign: "Thank you for everything you do.", chk: [[21, "Get the budget approved"], [14, "Choose a lunch or treat"], [10, "Ask each manager for a thank-you note"], [7, "Order the food"], [2, "Print the thank-you cards"], [0, "Hand out cards and treats"]] },
    { id: "adminpros", name: "Administrative Professionals Week", m: 4, cat: "rec", start: "12:00", end: "13:30", acts: ["catered", "gifts"], theme: "Thank you", hint: "Usually the last full week of April. Check the date.", sign: "Thank you to the people who keep us running.", chk: [[21, "Get the budget approved"], [14, "Pick a lunch spot or gift"], [10, "Collect thank-you notes from the team"], [7, "Book or order"], [2, "Print the cards"], [0, "Celebrate"]] },
    { id: "earth", name: "Earth Day clean-up", m: 4, cat: "comm", start: "12:00", end: "14:00", acts: ["charity"], theme: "Earth Day, April 22", sign: "Earth Day clean-up starts here.", chk: [[14, "Choose the area to clean up"], [10, "Get permission from the owner"], [7, "Send the sign-up sheet"], [3, "Buy gloves, bags and water"], [0, "Clean up, then share lunch"]] },
    { id: "wellness", name: "Wellness walk challenge", m: 5, cat: "well", start: "12:00", end: "13:00", acts: ["games"], theme: "Mental health month", sign: "Walk with us at noon.", chk: [[14, "Pick the route and the challenge dates"], [7, "Share the sign-up sheet"], [2, "Prepare small prizes"], [0, "Walk together"]] },
    { id: "pizza", name: "Pizza party", m: 5, cat: "team", start: "12:00", end: "13:30", acts: ["catered"], sign: "Pizza is here!", chk: [[10, "Count heads and ask about allergies"], [7, "Pick the pizza place and get a quote"], [2, "Order, with vegetarian and vegan options"], [0, "Set out plates, napkins and drinks"]] },
    { id: "bbq", name: "Summer BBQ or picnic", m: 6, cat: "cele", start: "11:30", end: "14:00", acts: ["potluck", "games", "music"], theme: "Summer", sign: "Summer BBQ. Grab a plate.", chk: [[28, "Choose the date and a rain plan"], [21, "Book the park or patio"], [14, "Send the invitation and the potluck sheet"], [7, "Order the meat, buns and drinks"], [2, "Confirm the headcount"], [0, "Set up tables, shade and games"]] },
    { id: "icecream", name: "Ice cream social", m: 7, cat: "team", start: "14:00", end: "15:00", acts: ["catered"], sign: "Ice cream social. Build your own sundae.", chk: [[10, "Pick the date and the budget"], [5, "Order ice cream and toppings"], [2, "Get a cooler or freezer space"], [0, "Set up the topping bar"]] },
    { id: "learning", name: "Learning lunch", m: 9, cat: "learn", start: "12:00", end: "13:30", acts: ["catered", "teamb"], theme: "Lunch and learn", sign: "Lunch and learn today.", chk: [[21, "Choose a topic and a speaker"], [14, "Book the room and any screen"], [7, "Send the invitation"], [2, "Order lunch"], [0, "Set up and welcome everyone"]] },
    { id: "boss", name: "Boss's Day", m: 10, cat: "rec", start: "15:00", end: "15:30", acts: ["catered"], hint: "October 16 in many countries. Check yours.", sign: "Thank you for leading us.", chk: [[14, "Decide on a card or small gift"], [10, "Pass the card around"], [3, "Order a treat or flowers"], [0, "Present it"]] },
    { id: "costume", name: "Costume or pumpkin contest", m: 10, cat: "team", start: "15:00", end: "16:30", acts: ["games", "sweater"], theme: "Fall fun", sign: "Costume contest. Vote at 3:30.", chk: [[14, "Pick the date and the rules"], [7, "Send the invitation"], [3, "Buy small prizes"], [0, "Set up voting slips and snacks"]] },
    { id: "thanksgiving", name: "Thanksgiving potluck", m: 11, cat: "cele", start: "12:00", end: "13:30", acts: ["potluck"], theme: "Gratitude", hint: "The date differs by country. Check yours.", sign: "Thankful for this team.", chk: [[21, "Pick the date and the room"], [14, "Send the potluck sign-up sheet"], [7, "Remind people what is still needed"], [2, "Gather plates, cutlery and serving spoons"], [0, "Set up the table and share what you are thankful for"]] },
    { id: "drive", name: "Food or toy drive", m: 11, cat: "comm", start: "09:00", end: "17:00", acts: ["charity"], sign: "Drop your donation here.", chk: [[28, "Choose the charity and ask what they need"], [21, "Set a goal"], [14, "Announce it and put out a collection box"], [3, "Remind the team"], [0, "Count and deliver the donations"]] },
    { id: "holiday", name: "Holiday Party", m: 12, cat: "cele", start: "17:00", end: "21:00", acts: ["potluck", "gifts", "awards", "games"], theme: "", sign: "Happy holidays!", chk: [[56, "Get the budget and date approved"], [42, "Book the venue or caterer"], [28, "Send the save-the-date"], [21, "Plan activities and the gift exchange"], [14, "Order food and drinks"], [7, "Confirm the headcount and allergies"], [2, "Print signs and certificates"], [0, "Set up and celebrate"]] },
    { id: "custom", name: "My own event", m: 0, cat: "cele", start: "12:00", end: "13:30", acts: [], sign: "", chk: OY_GEN }
  ];
  let oy = load("officeyear", null) || { events: [], active: "", people: [], budget: 0, gift: 0, sub: "cal", year: new Date().getFullYear(), fired: {} };
  oy.fired = oy.fired || {}; oy.people = oy.people || []; oy.year = oy.year || new Date().getFullYear();
  const saveOy = () => save("officeyear", oy);
  const oyType = id => OY_TYPES.find(t => t.id === id) || OY_TYPES[OY_TYPES.length - 1];
  const oyCopy = o => JSON.parse(JSON.stringify(o));
  const oyPad = n => String(n).padStart(2, "0");
  const oyYmd = d => `${d.getFullYear()}-${oyPad(d.getMonth() + 1)}-${oyPad(d.getDate())}`;
  const oyAdd = (ymd, n) => { const d = new Date(ymd + "T12:00"); d.setDate(d.getDate() + n); return oyYmd(d); };
  const oyIn = ymd => { const a = new Date(); a.setHours(0, 0, 0, 0); return Math.round((new Date(ymd + "T00:00") - a) / 864e5); };
  const oyDay = ymd => offDate(ymd, { weekday: "short", month: "short", day: "numeric" });
  const oyMergePast = (a, b) => { const m = {}; a.concat(b).forEach(p => { m[p.year + "|" + p.name] = p; }); return Object.values(m).sort((x, y) => x.year - y.year); };
  function oyEnsure() {
    if (oy.events.length) return;
    const id = uid(); oy.events.push({ id, type: off.oyType || "holiday", name: off.ev.name || "Holiday Party", date: off.ev.date || "", month: off.ev.date ? +off.ev.date.slice(5, 7) : 12, year: offYear(), snap: null }); oy.active = id; saveOy();
  }
  function oySyncCur() {
    oyEnsure(); const s = oy.events.find(x => x.id === oy.active); if (!s) return;
    s.name = off.ev.name || s.name; s.date = off.ev.date || ""; if (s.date) { s.month = +s.date.slice(5, 7); s.year = +s.date.slice(0, 4); }
  }
  const oyCost = e => e.id === oy.active ? offTotal() : ((e.snap && e.snap.costs) || []).reduce((a, c) => a + (+c.cost || 0), 0);
  const oyBudgetOf = e => e.id === oy.active ? (+off.ev.budget || 0) : ((e.snap && e.snap.ev && +e.snap.ev.budget) || 0);
  const offChk = () => { if (!off.chk) off.chk = oyType(off.oyType || "holiday").chk.map(([d, t]) => ({ id: uid(), d, t, done: 0 })); return off.chk; };
  const oyDue = c => off.ev.date ? oyAdd(off.ev.date, -c.d) : "";
  function oyMake(typeId, o) {
    o = o || {}; oySyncCur(); const T = oyType(typeId), cur = oy.events.find(x => x.id === oy.active); if (cur) cur.snap = oyCopy(off);
    const id = uid(), base = o.base, acts = {}; T.acts.forEach(k => { acts[k] = 1; });
    const n = { tab: "event", oyType: T.id, ev: Object.assign({ name: o.name || T.name, date: o.date || "", start: T.start, end: T.end, venue: "", address: "", headcount: 20, budget: 0, theme: T.theme || "", dress: "", giftLimit: 25, organizer: "", approver: "", approverEmail: "", notes: "" },
        { organizer: off.ev.organizer, approver: off.ev.approver, approverEmail: off.ev.approverEmail, headcount: off.ev.headcount, giftLimit: off.ev.giftLimit }, { who: "staff" }),
      acts, costs: [], appr: { status: "draft", log: [], followDays: 3 }, pot: [], awards: OFF_AWARDS.slice(0, 8).map(t => ({ id: uid(), t, w: "" })), wrap: { worked: "", change: "" }, past: off.past || [], fired: {},
      chk: T.chk.map(([d, t]) => ({ id: uid(), d, t, done: 0 })), guests: (off.guests || []).map(g => Object.assign({}, g, { status: "pending" })) };
    if (base) { Object.assign(n.ev, { venue: base.ev.venue, address: base.ev.address, headcount: base.ev.headcount, theme: base.ev.theme, dress: base.ev.dress, giftLimit: base.ev.giftLimit, who: base.ev.who || "staff" }); n.acts = oyCopy(base.acts || {}); n.costs = (base.costs || []).map(c => Object.assign({}, c, { id: uid(), ordered: 0, orderBy: "" })); }
    oy.events.push({ id, type: T.id, name: n.ev.name, date: n.ev.date, month: o.month || T.m || (new Date().getMonth() + 1), year: o.year || oy.year, snap: null });
    oy.active = id; off = n; saveOy(); saveOff(); offSync(); offScreen = "build"; document.body.classList.toggle("co-kids", n.ev.who === "family");
  }
  function oySwitch(id) {
    if (id !== oy.active) {
      oySyncCur(); const cur = oy.events.find(x => x.id === oy.active), t = oy.events.find(x => x.id === id); if (!t || !t.snap) return;
      if (cur) cur.snap = oyCopy(off);
      const past = oyMergePast(off.past || [], t.snap.past || []); off = t.snap; off.past = past; t.snap = null; oy.active = id;
    }
    off.tab = "event"; saveOy(); saveOff(); offSync(); offScreen = "build"; document.body.classList.toggle("co-kids", off.ev.who === "family"); renderOffice(); renderCoDash(); window.scrollTo(0, 0);
  }
  function oyRepeat(id) {
    const e = oy.events.find(x => x.id === id); if (!e) return; const src = id === oy.active ? off : e.snap; if (!src) return;
    const date = e.date ? oyAdd(e.date, 365) : "", y = e.date ? +date.slice(0, 4) : (e.year || oy.year) + 1;
    oyMake(e.type, { base: src, date, month: e.month, year: y, name: src.ev.name }); oy.year = y; saveOy(); renderOffice(); window.scrollTo(0, 0); toast("🔁 Planned again for " + y + ". Vendors and the room are copied over");
  }
  function oyRemove(id) {
    const e = oy.events.find(x => x.id === id); if (!e || id === oy.active) return;
    if (!confirm(`Remove "${e.name}" from your year? Its plan and costs are deleted.`)) return;
    oy.events = oy.events.filter(x => x.id !== id); saveOy(); renderOffice();
  }
  // ---------- 🎂 people ----------
  function oyMilestones(days) {
    const out = [], today = new Date(); today.setHours(12, 0, 0, 0);
    const nxt = (m, d) => { let dt = new Date(today.getFullYear(), m - 1, d, 12); if (dt < today) dt = new Date(today.getFullYear() + 1, m - 1, d, 12); return dt; };
    oy.people.forEach(p => {
      if (p.bd) { const [m, d] = p.bd.split("-").map(Number); out.push({ p, kind: "bday", dt: nxt(m, d), n: 0 }); }
      if (p.start) { const [y, m, d] = p.start.split("-").map(Number), dt = nxt(m, d), n = dt.getFullYear() - y; if (n >= 1) out.push({ p, kind: "anniv", dt, n }); }
    });
    return out.map(x => Object.assign(x, { in: Math.round((x.dt - today) / 864e5) })).filter(x => x.in <= days).sort((a, b) => a.in - b.in);
  }
  const oyMsLabel = m => esc(m.p.name) + " · " + (m.kind === "bday" ? "birthday" : m.n + (m.n === 1 ? "-year" : "-year") + " anniversary");
  const oyMsWhen = m => m.in === 0 ? "today" : m.in === 1 ? "tomorrow" : `${oyDay(oyYmd(m.dt))} · in ${m.in} days`;
  function oyPeopleHtml() {
    const up = oyMilestones(30), P = oy.people.slice().sort((a, b) => a.name.localeCompare(b.name));
    return `<div class="card pt-card"><h3>🎂 Coming up in the next 30 days</h3>
      ${up.length ? up.map(m => `<div class="oy-ms"><div><b>${oyMsLabel(m)}</b><small>${oyMsWhen(m)}${+oy.gift ? ` · about ${money(+oy.gift)} for a card or small gift` : ""}</small></div><button type="button" class="btn btn-ghost btn-sm" data-print="oycard:${m.p.id}:${m.kind}">🖨️ Card</button></div>`).join("") : `<p class="host-rem">${P.length ? "Nothing in the next 30 days." : "Add your team below and the app will remind you a week ahead."}</p>`}
      <label class="off-f wide" style="margin-top:8px"><span class="meal-lab">Budget for each card or small gift</span><input class="input" type="number" inputmode="decimal" min="0" data-oygift value="${+oy.gift || ""}" placeholder="$"></label></div>
    <div class="card pt-card"><h3>👥 My team</h3>
      ${P.map(p => `<div class="oy-ppl" data-oyp="${p.id}"><div><b>${esc(p.name)}</b><small>${p.bd ? "Birthday " + OY_MONTHS[+p.bd.slice(0, 2) - 1].slice(0, 3) + " " + +p.bd.slice(3) : ""}${p.bd && p.start ? " · " : ""}${p.start ? "Started " + esc(p.start.slice(0, 4)) : ""}</small></div><button type="button" class="icon-btn" data-oypdel aria-label="Remove ${esc(p.name)}">✕</button></div>`).join("")}
      <form class="org-ev-form" id="oyPersonForm" autocomplete="off"><input class="input" name="name" maxlength="40" placeholder="First name" required>
        <div class="org-addr-row"><select class="input" name="bm" aria-label="Birthday month"><option value="">Birthday month</option>${OY_MONTHS.map((m, i) => `<option value="${oyPad(i + 1)}">${m}</option>`).join("")}</select><select class="input" name="bd" aria-label="Birthday day" style="max-width:88px"><option value="">Day</option>${Array.from({ length: 31 }, (_, i) => `<option>${i + 1}</option>`).join("")}</select></div>
        <label class="off-ob"><span>Started on (optional)</span><input class="input" name="start" type="date"></label>
        <button class="btn btn-green btn-block" type="submit">➕ Add to my team</button></form>
      <p class="host-rem">Everything stays on this phone, locked. Keep only what your team is happy to share: a first name, a birthday month and day, and a start date. Nothing else is needed.</p></div>`;
  }
  // ---------- 💵 yearly budget ----------
  function oyMsCount(Y) { return oy.people.reduce((a, p) => a + (p.bd ? 1 : 0) + (p.start && +p.start.slice(0, 4) < Y ? 1 : 0), 0); }
  function oyBudgetHtml() {
    const Y = oy.year, evs = oy.events.filter(e => e.year === Y).sort((a, b) => (a.month || 0) - (b.month || 0)), by = Array(12).fill(0);
    evs.forEach(e => { by[Math.max(0, (e.month || 1) - 1)] += oyCost(e); });
    const evTot = by.reduce((a, b) => a + b, 0), ms = oyMsCount(Y) * (+oy.gift || 0), total = evTot + ms, lim = +oy.budget || 0, mx = Math.max(1, ...by);
    return `<div class="card pt-card"><h3>💵 ${Y} office events budget</h3>
      <label class="off-f wide"><span class="meal-lab">Yearly budget for all events</span><input class="input" type="number" inputmode="decimal" min="0" data-oybud value="${lim || ""}" placeholder="$"></label>
      <div class="oy-sum"><div><b>${money(total)}</b><small>planned in ${Y}</small></div>${lim ? `<div><b>${money(Math.abs(lim - total))}</b><small>${total > lim ? "over budget" : "left"}</small></div>` : ""}</div>
      ${lim ? `<div class="oy-meter"><i style="width:${Math.min(100, Math.round(total / lim * 100))}%" class="${total > lim ? "over" : ""}"></i></div>` : ""}
      ${total > lim && lim ? `<p class="org-warn">⚠️ ${money(total - lim)} over the yearly budget.</p>` : ""}
      <div class="oy-bars" role="img" aria-label="Planned spending by month">${by.map((v, i) => `<div><em>${v ? money(v) : ""}</em><span><u style="height:${Math.round(v / mx * 100)}%"></u></span><small>${OY_MONTHS[i].slice(0, 3)}</small></div>`).join("")}</div></div>
    <div class="card pt-card"><h3>📋 By event</h3>
      ${evs.map(e => { const c = oyCost(e), b = oyBudgetOf(e); return `<div class="off-cost"><div><b>${esc(e.name)}</b><small>${OY_MONTHS[Math.max(0, (e.month || 1) - 1)]}${b ? ` · approved ${money(b)}` : ""}${b && c > b ? " · over" : ""}</small></div><span>${money(c)}</span><i></i></div>`; }).join("") || `<p class="host-rem">No events in ${Y} yet. Add some on the Calendar.</p>`}
      ${ms ? `<div class="off-cost"><div><b>Birthdays and anniversaries</b><small>${oyMsCount(Y)} × ${money(+oy.gift)}</small></div><span>${money(ms)}</span><i></i></div>` : ""}</div>`;
  }
  // ---------- 🗓️ calendar ----------
  function oyCalHtml() {
    const Y = oy.year, now = new Date(), curM = now.getFullYear() === Y ? now.getMonth() + 1 : 0, evs = oy.events.filter(e => e.year === Y), used = new Set(evs.map(e => e.type));
    const soon = oy.events.filter(e => e.date && oyIn(e.date) >= 0 && oyIn(e.date) <= 30).sort((a, b) => a.date < b.date ? -1 : 1);
    return `${soon.length ? `<div class="card pt-card oy-soonbox"><h3>⏰ Coming up</h3>${soon.map(e => `<button type="button" class="oy-soon" data-oyopen="${e.id}"><b>${esc(e.name)}</b><small>${oyDay(e.date)} · ${oyIn(e.date) === 0 ? "today" : "in " + oyIn(e.date) + " days"}</small></button>`).join("")}</div>` : ""}
      <div class="oy-yr"><button type="button" data-oyyr="-1" aria-label="Previous year">‹</button><b>${Y}</b><button type="button" data-oyyr="1" aria-label="Next year">›</button></div>
      <p class="host-rem">Tap an event to open it. Tap a suggestion to add it to your year, with a ready checklist.</p>
      <div class="oy-year">${OY_MONTHS.map((mn, i) => { const m = i + 1, here = evs.filter(e => e.month === m), sug = OY_TYPES.filter(t => t.m === m && !used.has(t.id));
        return `<div class="oy-m${m === curM ? " now" : ""}"><h4>${mn}</h4>${here.map(e => `<div class="oy-e${e.id === oy.active ? " on" : ""}"><button type="button" data-oyopen="${e.id}"><b>${esc(e.name)}</b><small>${e.date ? oyDay(e.date) : "date not set"} · ${money(oyCost(e))}</small></button>${e.id === oy.active ? "" : `<button type="button" class="icon-btn" data-oyrm="${e.id}" aria-label="Remove ${esc(e.name)}">✕</button>`}</div>${Y <= now.getFullYear() ? `<button type="button" class="classy-link oy-rep" data-oyrep="${e.id}">Plan again in ${Y + 1}</button>` : ""}`).join("")}
          ${sug.map(t => `<button type="button" class="oy-s" data-oyadd="${t.id}" data-oym="${m}"${t.hint ? ` title="${esc(t.hint)}"` : ""}>+ ${esc(t.name)}</button>`).join("")}</div>`; }).join("")}</div>
      <form class="card pt-card org-ev-form" id="oyAddForm" autocomplete="off"><h3>➕ Add my own</h3>
        <input class="input" name="name" maxlength="50" placeholder="Event name, e.g. Team trivia afternoon">
        <div class="org-addr-row"><select class="input" name="type" aria-label="Starter checklist">${OY_TYPES.map(t => `<option value="${t.id}"${t.id === "custom" ? " selected" : ""}>${t.id === "custom" ? "Basic checklist" : esc(t.name) + " checklist"}</option>`).join("")}</select><select class="input" name="month" aria-label="Month">${OY_MONTHS.map((m, i) => `<option value="${i + 1}"${i === now.getMonth() ? " selected" : ""}>${m}</option>`).join("")}</select></div>
        <button class="btn btn-green btn-block" type="submit">➕ Add to ${Y}</button></form>`;
  }
  function offYearHtml() {
    oySyncCur(); const sub = oy.sub || "cal";
    return `<div class="off-sub">${[["cal", "🗓️ Calendar"], ["people", "🎂 People"], ["bud", "💵 Budget"]].map(([k, l]) => `<button type="button" class="chip${k === sub ? " on" : ""}" data-oysub="${k}">${l}</button>`).join("")}</div>` + (sub === "people" ? oyPeopleHtml() : sub === "bud" ? oyBudgetHtml() : oyCalHtml());
  }
  // ---------- ✅ checklist ----------
  function offChkHtml() {
    const C = offChk(), T = oyType(off.oyType || "holiday"), n = C.filter(c => c.done).length, has = !!off.ev.date;
    const rows = C.slice().sort((a, b) => b.d - a.d).map(c => {
      const due = oyDue(c), dd = due ? oyIn(due) : null, st = c.done ? "done" : dd == null ? "" : dd < 0 ? "late" : dd <= 3 ? "soon" : "";
      const when = due ? (c.done ? "Done · " : dd < 0 ? "Was due " : dd === 0 ? "Due today · " : "") + oyDay(due) + (!c.done && dd > 0 ? ` · in ${dd} days` : "") : (c.d ? c.d + (c.d === 1 ? " day" : " days") + " before" : "On the day");
      return `<div class="oy-chk ${st}" data-oyc="${c.id}"><button type="button" class="oy-box" data-oychk="${c.id}" aria-pressed="${!!c.done}" aria-label="Mark done">${c.done ? "✓" : ""}</button><div><b>${esc(c.t)}</b><small>${when}</small></div><button type="button" class="icon-btn" data-oycdel aria-label="Remove step">✕</button></div>`;
    }).join("");
    return `<div class="card pt-card"><h3>✅ ${esc(off.ev.name || T.name)} checklist</h3>
      <p class="host-rem">${n} of ${C.length} done.${has ? "" : " Set the date on the Event tab to see when each step is due."}${T.hint ? " " + esc(T.hint) : ""}</p>
      <div class="oy-meter"><i style="width:${C.length ? Math.round(n / C.length * 100) : 0}%"></i></div>${rows}
      <form class="org-ev-form" id="oyChkForm" autocomplete="off"><input class="input" name="t" maxlength="80" placeholder="Add a step" required>
        <div class="org-addr-row"><select class="input" name="d" aria-label="When">${[[0, "On the day"], [1, "1 day before"], [2, "2 days before"], [3, "3 days before"], [7, "1 week before"], [14, "2 weeks before"], [21, "3 weeks before"], [30, "A month before"]].map(([v, l]) => `<option value="${v}">${l}</option>`).join("")}</select></div>
        <button class="btn btn-green btn-block" type="submit">➕ Add step</button></form></div>
      <div class="card pt-card"><h3>🖨️ Print for this event</h3><p class="host-rem">A sign for the door or the table, and a sheet for people to sign up on.</p>
        <button type="button" class="btn btn-red btn-block" data-print="oysign">🪧 Event sign</button><button type="button" class="btn btn-ghost btn-block" data-print="oysheet" style="margin-top:8px">📝 Sign-up sheet</button></div>`;
  }
  function oyDoc(key) {
    const e = off.ev, T = oyType(off.oyType || "holiday");
    const base = `.oy{font-family:Georgia,serif;color:#222} .oy h1{color:#1E3A2F;margin:0} .oy small{font:9pt sans-serif;color:#8a6d3b;letter-spacing:.08em;text-transform:uppercase}`;
    if (key === "oysign") {
      const when = [e.date ? offDate(e.date) : "", e.start ? offTime(e.start) + (e.end ? " to " + offTime(e.end) : "") : "", e.venue].filter(Boolean).map(esc).join("<br>");
      return { noBrand: 1, title: "Event sign", margin: 0.6, file: "Event-Sign", css: base + ` .sg{text-align:center;padding-top:34mm} .sg h1{font-size:44pt;line-height:1.1;margin-bottom:10mm} .sg p{font-size:20pt;margin:3mm 0;line-height:1.4} .sg .big{font-size:26pt;color:#8a6d3b;margin-top:16mm} .sg .rule{width:40mm;border-top:2px solid #B8935A;margin:0 auto 10mm}`,
        html: `<div class="oy sg"><h1>${esc(e.name || T.name)}</h1><div class="rule"></div><p>${when}</p>${T.sign ? `<p class="big">${esc(T.sign)}</p>` : ""}</div>` };
    }
    if (key === "oysheet") {
      const rows = Array.from({ length: 18 }, () => `<tr><td></td><td></td></tr>`).join("");
      return { noBrand: 1, title: "Sign-up sheet", margin: 0.6, file: "Sign-Up-Sheet", css: base + ` .oy h1{font-size:24pt} .oy table{width:100%;border-collapse:collapse;margin-top:6mm} .oy th{text-align:left;font:600 9pt sans-serif;letter-spacing:.08em;text-transform:uppercase;color:#8a6d3b;border-bottom:2px solid #B8935A;padding:4px} .oy td{height:11mm;border-bottom:1px solid #ccc} .oy td:first-child{width:50%}`,
        html: `<div class="oy"><h1>${esc(e.name || T.name)}</h1><p>${[e.date ? offDate(e.date) : "", e.start ? offTime(e.start) : "", e.venue].filter(Boolean).map(esc).join(" · ")}</p><table><tr><th>Name</th><th>Bringing or notes</th></tr>${rows}</table></div>` };
    }
    const [, pid, kind] = key.split(":"), p = oy.people.find(x => x.id === pid); if (!p) return { error: "That person is no longer on your team list" };
    const m = oyMilestones(366).find(x => x.p.id === pid && x.kind === kind), line = kind === "bday" ? "Happy Birthday" : m && m.n ? `Congratulations on ${m.n} ${m.n === 1 ? "year" : "years"}` : "Thank you";
    return { noBrand: 1, title: "Card", margin: 0.6, file: "Card-" + p.name.replace(/[^A-Za-z0-9]+/g, "-"), css: base + ` .cd{border:1px dashed #bbb;height:120mm;width:90mm;margin:0 auto;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:8mm} .cd h1{font-size:26pt;line-height:1.2} .cd .nm{font-size:30pt;color:#8a6d3b;margin:6mm 0} .cd p{font-size:12pt;color:#555} .cd .ln{width:60mm;border-top:1px solid #999;margin-top:12mm}`,
      html: `<div class="oy"><div class="cd"><h1>${esc(line)}</h1><div class="nm">${esc(p.name)}</div><p>${kind === "bday" ? "Wishing you a wonderful day." : "Thank you for everything you bring to the team."}</p><div class="ln"></div><p style="font-size:9pt">Signed by the team</p></div><p style="text-align:center;font:9pt sans-serif;color:#888;margin-top:6mm">Print, fold in half and pass it around for signatures.</p></div>` };
  }
  function oyYearEndHtml() {
    oySyncCur(); const Y = offYear(), evs = oy.events.filter(e => e.year === Y).sort((a, b) => (a.month || 0) - (b.month || 0)); if (evs.length < 2) return "";
    const tot = evs.reduce((a, e) => a + oyCost(e), 0);
    return `<h2>All ${Y} events</h2><table><tr><th>Event</th><th>When</th><th class="num">Planned</th></tr>${evs.map(e => `<tr><td>${esc(e.name)}</td><td>${e.date ? offDate(e.date, { month: "short", day: "numeric" }) : OY_MONTHS[Math.max(0, (e.month || 1) - 1)]}</td><td class="num">${money(oyCost(e))}</td></tr>`).join("")}<tr><td colspan="2"><b>Total planned</b>${+oy.budget ? ` (yearly budget ${money(+oy.budget)})` : ""}</td><td class="num"><b>${money(tot)}</b></td></tr></table>`;
  }
  // ---------- taps & typing for the Office Year ----------
  $("#view-office").addEventListener("click", e => {
    const t = e.target, q = s => t.closest(s); let b;
    if ((b = q("[data-oysub]"))) { oy.sub = b.dataset.oysub; saveOy(); renderOffice(); return; }
    if ((b = q("[data-oyyr]"))) { oy.year += +b.dataset.oyyr; saveOy(); renderOffice(); return; }
    if ((b = q("[data-oyopen]"))) { oySwitch(b.dataset.oyopen); return; }
    if ((b = q("[data-oyadd]"))) { oyMake(b.dataset.oyadd, { month: +b.dataset.oym, year: oy.year }); renderOffice(); renderCoDash(); window.scrollTo(0, 0); toast("✅ Added. Your checklist is ready"); return; }
    if ((b = q("[data-oyrm]"))) { oyRemove(b.dataset.oyrm); return; }
    if ((b = q("[data-oyrep]"))) { oyRepeat(b.dataset.oyrep); return; }
    if ((b = q("[data-oychk]"))) { const c = offChk().find(x => x.id === b.dataset.oychk); if (c) { c.done = c.done ? 0 : 1; saveOff(); offSync(); renderOffice(); } return; }
    if ((b = q("[data-oycdel]"))) { const id = b.closest("[data-oyc]").dataset.oyc; off.chk = offChk().filter(x => x.id !== id); saveOff(); offSync(); renderOffice(); return; }
    if ((b = q("[data-oypdel]"))) { const id = b.closest("[data-oyp]").dataset.oyp; oy.people = oy.people.filter(x => x.id !== id); saveOy(); offSync(); renderOffice(); return; }
  });
  $("#view-office").addEventListener("submit", e => {
    const f = e.target, v = k => (f.elements[k] ? f.elements[k].value : "").trim();
    if (f.id === "oyAddForm") { e.preventDefault(); const T = oyType(v("type")); oyMake(T.id, { month: +v("month"), year: oy.year, name: v("name") || (T.id === "custom" ? "My own event" : T.name) }); renderOffice(); renderCoDash(); window.scrollTo(0, 0); toast("✅ Added to your year"); return; }
    if (f.id === "oyChkForm") { e.preventDefault(); if (!v("t")) return; offChk().push({ id: uid(), d: +v("d") || 0, t: v("t"), done: 0 }); saveOff(); offSync(); renderOffice(); return; }
    if (f.id === "oyPersonForm") {
      e.preventDefault(); if (!v("name")) return; const bm = v("bm"), bd = v("bd");
      oy.people.push({ id: uid(), name: v("name"), bd: bm && bd ? bm + "-" + oyPad(+bd) : "", start: v("start") }); saveOy(); offSync(); renderOffice(); toast("🎂 Added"); return;
    }
  });
  $("#view-office").addEventListener("change", e => {
    const t = e.target;
    if (t.dataset.oybud != null) { oy.budget = Math.max(0, +t.value || 0); saveOy(); renderOffice(); return; }
    if (t.dataset.oygift != null) { oy.gift = Math.max(0, +t.value || 0); saveOy(); renderOffice(); return; }
  });
  function renderCoDash() {
    const els = [$("#coDash"), $("#offDash")].filter(Boolean); if (!els.length || hubMode !== "company") return;
    const e = off.ev, hasG = offGuests().length > 0, hc = hasG ? offAttend() : Math.max(0, +e.headcount || 0), total = offTotal(), lim = +e.budget || 0, pct = lim ? Math.min(100, Math.round(total / lim * 100)) : 0;
    const d = e.date ? offDays(e.date) : null;
    const todo = off.costs.filter(c => c.orderBy && !c.ordered).sort((a, b) => a.orderBy < b.orderBy ? -1 : 1).slice(0, 3);
    const dashHtml = `<div class="card co-dash"><div class="cd-head"><span class="cd-k">Your event</span><b>${esc(e.name || "Holiday Party")}</b><small>${e.date ? esc(offDate(e.date)) + (e.start ? " · " + esc(offTime(e.start)) : "") : "Set the date to start the countdown"}</small></div>
      <div class="cd-tiles"><button type="button" data-coto="event" data-cofocus="date"><b>${d == null ? "–" : d < 0 ? "Done" : d}</b><small>${d == null ? "date" : d < 0 ? "event over" : d === 1 ? "day to go" : "days to go"}</small></button>
      <button type="button" data-coto="${hasG ? "guests" : "event"}" data-cofocus="headcount"><b>${hc || "–"}</b><small>${hasG ? "coming" : "guests"}</small></button>
      <button type="button" data-coto="approval"><b>${esc(OFF_STATUS[off.appr.status] || off.appr.status)}</b><small>approval</small></button></div>
      <button type="button" class="btn btn-ghost btn-block" data-coto="year" style="margin-bottom:10px">🗓️ My year of events (${Math.max(1, oy.events.length)}) ›</button>
      ${off.appr.status === "approved" ? `<button type="button" class="btn btn-gold btn-block" data-coto="plan" style="margin-bottom:10px">📄 Open my approved plan ›</button>` : ""}
      <button type="button" class="cd-bud" data-coto="event" data-cofocus="budget"><span><b>${money(total)}</b> planned${lim ? ` of <b>${money(lim)}</b> approved` : ""}</span>${lim ? `<i><u style="width:${pct}%"></u></i>` : `<small>Add the approved budget on the Event tab</small>`}</button>
      ${(off.saved || []).length ? `<button type="button" class="btn btn-ghost btn-block" data-coto="saved" style="margin-top:10px">📁 My saved plans (${off.saved.length})</button>` : ""}
      ${todo.length ? `<div class="cd-todo"><h4>To order</h4>${todo.map(c => `<div class="cd-ord"><div><b>${esc(c.name || c.type)}</b><small>Order by ${esc(offDate(c.orderBy, { month: "short", day: "numeric" }))}${offDays(c.orderBy) < 0 ? " · date has passed" : ""}</small></div><span class="of-acts">${offLinks(c)}<button type="button" class="of-lnk of-done" data-ocdone="${c.id}">Mark ordered</button></span></div>`).join("")}</div>` : ""}</div>`;
    els.forEach(el => { el.innerHTML = dashHtml; });
  }
  window.__offPicks = () => { const F = offFoodCfg(); return F.picks && F.picks.length ? F.picks.slice() : OFF_DEFAULT_PICKS.slice(); };
  document.addEventListener("click", e => {
    const b = e.target.closest("[data-coto]"); if (b) { off.tab = b.dataset.coto; saveOff(); showView("office");
      const fk = b.dataset.cofocus;   // already on this page? jump down to the box and open it
      setTimeout(() => {
        const f = fk && off.tab === "event" && !(fk === "headcount" && offGuests().length) ? $(`#offBody [data-ev="${fk}"]`) : null, body = $("#offBody");
        if (f) { f.scrollIntoView({ block: "center", behavior: "smooth" }); setTimeout(() => { try { f.focus(); if (fk === "date") f.click(); } catch (er) {} }, 350); }
        else if (body) body.scrollIntoView({ block: "start", behavior: "smooth" });
      }, 60);
      return; }
    const od = e.target.closest("#coDash [data-ocdone]"); if (od) { const c = off.costs.find(x => x.id === od.dataset.ocdone); if (c) { c.ordered = !c.ordered; saveOff(); renderCoDash(); } }
  });

  const OFF_GROUP = { year: "year", checklist: "plan", event: "plan", guests: "plan", food: "plan", acts: "plan", approval: "approve", plan: "run", more: "more", saved: "more", savedone: "more", polls: "more", potluck: "more", santa: "more", awards: "more", auction: "more", charity: "more", handover: "more" };
  const OFF_SUB = [["event", "📋 Event"], ["checklist", "✅ Checklist"], ["guests", "👥 Guests"], ["food", "🍽️ Food"], ["acts", "🎭 Activities"]];
  const OFF_MORE = [["saved", "📁", "My saved plans", "Approved plans, print any time"], ["polls", "🗳️", "Votes", "Pick a date or a caterer"], ["potluck", "🥘", "Potluck", "Who brings what"], ["santa", "🎅", "Secret Santa", "Draw names"], ["awards", "🏆", "Awards", "Silly office awards"], ["auction", "🔨", "Auction", "Silent auction"], ["charity", "⭐", "Charity", "Give back"], ["handover", "📦", "Handover", "Survey, report, next year"]];
  function offMoreHtml() {
    return `<div class="card pt-card"><h3>🆕 Plans changed?</h3><p class="host-rem">Venue cancelled, or the plan is now something different? Start a new plan. The old one is saved first.</p><button type="button" class="btn btn-ghost btn-block" data-offnew>Start a new plan</button></div>` + `<div class="org-tiles">${OFF_MORE.map(([k, i, l, d]) => `<button type="button" class="org-tile" data-oftab="${k}"><span class="ot-ico">${i}</span><b>${l}</b><small>${d}</small></button>`).join("")}</div>`;
  }
  function renderOffice() {
    renderOffMenu();
    const tab = off.tab || "event", G = OFF_GROUP[tab] || "plan", st = off.appr.status, ok = st === "approved";
    const steps = [["plan", "event", "1", "Plan", !!off.confirmed || st !== "draft"], ["approve", "approval", "2", "Approve", ok], ["run", "plan", "3", "Run it", false], ["more", "more", "", "More", false]];
    let sub = "";
    if (G === "plan") sub = `<div class="off-sub">${OFF_SUB.map(([k, l]) => `<button type="button" class="chip${k === tab ? " on" : ""}" data-oftab="${k}">${l}</button>`).join("")}</div>`;
    else if (G === "more" && tab !== "more") sub = `<div class="off-sub"><button type="button" class="chip" data-oftab="more">‹ More</button><span class="off-subt">${(OFF_MORE.find(m => m[0] === tab) || [0, "", ""])[1]} ${(OFF_MORE.find(m => m[0] === tab) || [0, 0, ""])[2]}</span></div>`;
    $("#offTabs").innerHTML = `<button type="button" class="oy-bar${tab === "year" ? " on" : ""}" data-oftab="year"><span>🗓️ <b>${esc(off.ev.name || "Holiday Party")}</b></span><small>My year · ${Math.max(1, oy.events.length)} event${oy.events.length > 1 ? "s" : ""} ›</small></button><div class="off-steps">${steps.map(([g, t, n, l, done]) => `<button type="button" class="off-step${g === G ? " on" : ""}${done ? " done" : ""}" data-oftab="${t}">${n ? `<i>${done ? "✓" : n}</i>` : ""}<span>${l}</span></button>`).join("")}</div>${sub}`;
    renderCoDash();
    $("#offBody").innerHTML = ({ year: offYearHtml, checklist: offChkHtml, event: offEventHtml, guests: offGuestsHtml, polls: offPollsHtml, food: offFoodHtml, acts: offActsHtml, approval: offApprovalHtml, plan: offPlanHtml, potluck: offPotHtml, santa: offSantaHtml, awards: offAwardsHtml, auction: offAucHtml, charity: offCharityHtml, handover: offHandoverHtml, more: offMoreHtml, saved: offSavedHtml, savedone: offSavedOne })[tab]() + (G === "plan" && tab !== "event" ? `<button type="button" class="btn btn-gold btn-block" data-offreview style="margin-top:12px">📄 See my plan ›</button>` : "");
  }
  const fld = (k, label, type, ph, extra) => `<label class="off-f${extra === "wide" ? " wide" : ""}"><span class="meal-lab">${label}</span>${type === "area" ? `<textarea class="input" rows="2" data-ev="${k}" maxlength="300" placeholder="${ph || ""}">${esc(off.ev[k] || "")}</textarea>` : `<input class="input" type="${type || "text"}" data-ev="${k}" value="${esc(off.ev[k] ?? "")}" placeholder="${ph || ""}" ${type === "number" ? 'inputmode="decimal" min="0"' : 'maxlength="80"'}>`}</label>`;
  function offEventHtml() {
    if (!off.ev.who) return `<div class="card pt-card"><h3>👥 First, who's invited?</h3><p class="host-rem">This shapes the whole plan: the time of day, the activities, the food and the approval request.</p>
      <div class="who-pick">${OFF_WHO.map(([k, i, l, d]) => `<button type="button" class="who-tile" data-ofwho="${k}"><span class="wt-ico">${i}</span><span><b>${l}</b><small>${d}</small></span></button>`).join("")}</div></div>`;
    const W = offWho();
    const last = off.past.filter(p => p.name === off.ev.name).pop() || off.past[off.past.length - 1], total = offTotal(), hc = Math.max(1, +off.ev.headcount || 1);
    return `${last ? `<div class="card pt-card off-last"><h3>🗂️ Last year (${last.year})</h3><p><b>${esc(last.name || "Holiday party")}</b>${last.organizer ? `, organized by <b>${esc(last.organizer)}</b>` : ""}${last.date ? ` · ${offDate(last.date, { month: "short", day: "numeric" })}` : ""} · ${last.headcount || "?"} people · ${money(last.spent || 0)} spent</p>
        ${last.worked ? `<p>👍 <b>What worked:</b> ${esc(last.worked)}</p>` : ""}${last.change ? `<p>✏️ <b>Change next time:</b> ${esc(last.change)}</p>` : ""}
        ${last.vendors && last.vendors.length ? `<p class="host-rem">Vendors used: ${last.vendors.map(v => esc(v.name) + (v.type ? ` (${esc(v.type)})` : "")).join(", ")}</p>` : ""}</div>` : ""}
      <div class="who-pill"><span>${W[1]} <b>${W[2]}</b></span><button type="button" class="classy-link" data-ofwho="">Change</button></div>
      ${offWhereHtml()}
      <div class="card pt-card"><h3>🎉 The event</h3><div class="off-grid">
        ${fld("name", "Event name", "text", "e.g. Holiday Party", "wide")}${fld("date", "Date", "date")}${fld("headcount", off.ev.who === "family" ? "Adults (about)" : "Guests (about)", "number")}${off.ev.who === "family" ? fld("kids", "Kids (about)", "number") : ""}${fld("start", "Starts", "time")}${fld("end", "Ends", "time")}
        ${fld("venue", "Venue", "text", "e.g. Boardroom, The Keg", "wide")}${fld("address", "Address", "text", "", "wide")}${fld("theme", "Theme", "text", "e.g. Ugly sweater")}${fld("dress", "Dress code", "text", "e.g. Festive casual")}
        ${fld("organizer", "Organized by", "text", "Your name")}${fld("budget", "Approved budget", "number", "$")}</div></div>
      ${offAlcCardHtml()}
      <div class="card pt-card"><h3>✨ What's planned</h3><div class="apps-filters">${offActList().map(([k, l]) => `<button type="button" class="chip${off.acts[k] ? " on" : ""}" data-ofact="${k}">${off.acts[k] ? "✓ " : ""}${l}</button>`).join("")}</div>
        ${off.acts.gifts ? `<div class="off-grid" style="margin-top:8px">${fld("giftLimit", "Gift exchange limit", "number", "$")}</div>` : ""}</div>
      <div class="card pt-card"><h3>💵 Costs & vendors</h3>
        ${off.costs.map(c => `<div class="off-cost" data-oc="${c.id}"><div><b>${esc(c.type)}</b>${c.name ? ` · ${esc(c.name)}` : ""}${c.contact ? `<small>📞 ${esc(c.contact)}</small>` : ""}${offOrderHtml(c)}</div><span>${money(+c.cost || 0)}</span><button type="button" class="icon-btn" data-ocdel aria-label="Remove">✕</button></div>`).join("") || `<p class="host-rem">Add the venue, caterer, drinks, prizes… Vendors' names and numbers are kept for next year too.</p>`}
        ${off.costs.length ? `<div class="off-cost total"><div><b>Estimated total</b><small>about ${money(Math.round(total / hc * 100) / 100)} per person</small></div><span>${money(total)}</span><i></i></div>` : ""}
        ${+off.ev.budget && total > +off.ev.budget ? `<p class="org-warn">⚠️ ${money(total - off.ev.budget)} over the approved budget.</p>` : ""}
        <form class="org-ev-form" id="offCostForm" autocomplete="off"><div class="org-addr-row"><select class="input" name="type">${OFF_COSTS.map(c => `<option>${c}</option>`).join("")}</select><input class="input" name="cost" type="number" inputmode="decimal" min="0" placeholder="$" style="max-width:96px"></div>
          <input class="input" name="name" maxlength="50" placeholder="Vendor or item (optional), e.g. Sunrise Catering"><input class="input" name="contact" maxlength="60" placeholder="Phone or email (optional)"><input class="input" name="url" maxlength="120" inputmode="url" placeholder="Website to order from (optional)"><label class="off-ob"><span>Order by</span><input class="input" name="orderBy" type="date"></label>
          <button class="btn btn-green btn-block" type="submit">➕ Add cost</button></form>
        ${offNear("Find vendors near me", [["🎧 DJs", "DJ for parties"], ["📸 Photo booth rentals", "photo booth rental"], ["🪑 Party rentals (tables, chairs)", "party rentals"], ["💐 Florists", "florist"]].concat(off.ev.who === "family" ? [["🎅 Santa for hire", "santa claus for hire"], ["🎈 Kids' entertainers", "kids party entertainer"]] : []))}</div>
      <div class="card pt-card"><h3>📝 Notes</h3>${fld("notes", "", "area", "Anything the approver should know, e.g. half-day Friday, partners welcome")}</div>
      <button type="button" class="btn btn-red btn-block" data-offreview>📄 See my plan ›</button>`;
  }

  // ---------- 📨 approval request ----------
  function offLetter(update) {
    const e = off.ev, total = offTotal(), hc = Math.max(1, +e.headcount || 1), by = new Date(Date.now() + (off.appr.followDays || 3) * 86400000);
    const lines = [`Hi ${e.approver || "there"},`, "",
      update ? `I've updated the plan for our ${e.name || "holiday party"} based on your feedback. Here's the new version for your approval.` : `I've put together the plan for our ${e.name || "holiday party"} and would love your approval before I book anything.`, "",
      "THE EVENT",
      `• Date: ${e.date ? offDate(e.date) : "to be confirmed"}${e.start ? `, ${offTime(e.start)}${e.end ? ` to ${offTime(e.end)}` : ""}` : ""}`,
      `• Where: ${e.venue || "to be confirmed"}${e.address ? ` (${e.address})` : ""}${e.where ? ` · ${{ office: "in the office", venue: "rented venue", outing: "team outing", home: "at a home" }[e.where]}` : ""}`,
      `• Guests: about ${hc}${e.who === "family" && +e.kids ? ` adults and ${+e.kids} kids` : " people"}${offWho() ? ` (${{ staff: "staff only", partners: "staff and their partners", family: "staff and their families, kids welcome" }[off.ev.who]})` : ""}`];
    const fd = (off.food || {}).style; if (fd) lines.push(`• Food: ${{ apps: "appetizers we'll make ourselves", catered: "catered / ordered in", potluck: "potluck (everyone brings a dish)", venue: "provided by the venue" }[fd]}`);
    if (e.alcohol) lines.push(`• Drinks: ${e.alcohol === "none" ? "alcohol-free (mocktails, cider, punch, coffee and tea)" : "alcohol served, with plenty of non-alcoholic choices"}`);
    if (e.theme || e.dress) lines.push(`• ${[e.theme && `Theme: ${e.theme}`, e.dress && `Dress code: ${e.dress}`].filter(Boolean).join(" · ")}`);
    const acts = offActs(); if (acts.length) lines.push("", "WHAT'S PLANNED", ...acts.map(a => "• " + a.replace(/^\S+\s/, "")));
    lines.push("", "BUDGET");
    if (off.costs.length) lines.push(...off.costs.map(c => `• ${c.type}${c.name ? ` (${c.name})` : ""}: ${money(+c.cost || 0)}`), `Estimated total: ${money(total)} (about ${money(Math.round(total / hc * 100) / 100)} per person)`);
    else lines.push("• Costs to be confirmed");
    if (+e.budget) lines.push(`Budget requested: ${money(+e.budget)}`);
    if (e.notes) lines.push("", "NOTES", e.notes);
    lines.push("", `Could you let me know by ${by.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })} if this is approved, or if you'd like any changes?`, "", "Thank you!", e.organizer || "");
    return { subject: `${update ? "Updated plan" : "Approval request"}: ${e.name || "Holiday party"}${e.date ? " on " + offDate(e.date, { month: "short", day: "numeric" }) : ""}`, body: lines.join("\n") };
  }
  const AP_TXT = { draft: ["📝", "Not sent yet"], sent: ["📨", "Waiting for an answer"], approved: ["✅", "Approved!"], changes: ["✏️", "Changes requested"] };
  function offApprovalHtml() {
    const a = off.appr, L = offLetter(a.status === "changes"), last = a.log[a.log.length - 1];
    const missing = [!off.ev.date && "a date", !off.ev.venue && "a venue", !off.costs.length && "costs", !off.ev.organizer && "your name"].filter(Boolean);
    return `<div class="card pt-card ap-status ${a.status}"><div class="ap-big">${AP_TXT[a.status][0]}</div><div><b>${AP_TXT[a.status][1]}</b>
        <small>${a.status === "sent" && a.sentAt ? `Sent ${new Date(a.sentAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })} to ${esc(off.ev.approver || "your approver")}. Noël will remind you to follow up in ${a.followDays} days if you haven't heard back.` : a.status === "approved" ? `Go ahead and book everything! 🎉${last && last.note ? `<br>“${esc(last.note)}”` : ""}` : a.status === "changes" ? `${last && last.note ? `“${esc(last.note)}”<br>` : ""}Update the plan on the Event tab, then send the new version below.` : "Fill in the plan, check the letter below, then send it."}</small></div></div>
      ${a.status === "approved" ? `<button type="button" class="btn btn-gold btn-block" data-oftab="plan" style="margin-bottom:12px">📄 Open my approved plan ›</button>` : ""}
      ${a.status !== "approved" ? `<div class="card pt-card"><h3>🙋 No one to ask?</h3><p class="host-rem">Own the business or make this call yourself? Skip the request and mark it approved. Your plan opens right away.</p><button type="button" class="btn btn-green btn-block" data-apset="approved" data-apnote="Approved by me, no request needed">✅ I approve it myself</button></div>` : ""}
      <div class="card pt-card"><h3>👤 Who approves it?</h3><div class="off-grid">${fld("approver", "Name", "text", "e.g. Mike")}${fld("approverEmail", "Email", "email", "boss@company.com")}</div></div>
      ${missing.length ? `<p class="org-warn">Tip: add ${missing.join(", ")} on the 📋 Event tab so the request is complete.</p>` : ""}
      <div class="card pt-card"><h3>✉️ ${a.status === "changes" ? "Your updated request" : "Your approval request"}</h3><p class="ap-subj"><b>Subject:</b> ${esc(L.subject)}</p><pre class="ap-letter">${esc(L.body)}</pre>
        <div class="send-btns"><button type="button" class="btn btn-red" id="apEmail">✉️ Send by email</button><button type="button" class="btn btn-ghost" data-print="approval">📄 Send as a PDF</button><button type="button" class="btn btn-ghost" id="apCopy">📋 Copy</button></div>
        <label class="host-rem ap-follow">Remind me to follow up after <select class="input" id="apFollow">${[2, 3, 5, 7].map(d => `<option value="${d}" ${d === a.followDays ? "selected" : ""}>${d} days</option>`).join("")}</select></label></div>
      ${a.status !== "draft" ? `<div class="card pt-card"><h3>📬 Got an answer?</h3><div class="send-btns"><button type="button" class="btn btn-green" data-apset="approved">✅ It's approved</button><button type="button" class="btn btn-ghost" data-apset="changes">✏️ Changes requested</button></div>
        <input class="input" id="apNote" maxlength="160" placeholder="Their comments (optional), e.g. Keep it under $1,200" style="margin-top:8px"></div>` : ""}
      ${a.log.length ? `<div class="card pt-card"><h3>🕓 History</h3><ul class="cal-list">${a.log.slice().reverse().map(l => `<li><span class="cl-time">${new Date(l.at).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</span><span class="cl-txt">${AP_TXT[l.s][0]} ${AP_TXT[l.s][1].replace("Waiting for an answer", "Sent for approval")}${l.note ? `<small>“${esc(l.note)}”</small>` : ""}</span></li>`).join("")}</ul></div>` : ""}`;
  }
  function apMarkSent() { off.appr.status = "sent"; off.appr.sentAt = Date.now(); off.appr.log.push({ at: Date.now(), s: "sent" }); delete off.fired.follow; saveOff(); offSync(); renderOffice(); }
  function approvalDoc() {
    const L = offLetter(off.appr.status === "changes");
    const css = `.ap{font:11.5pt/1.5 Georgia,serif;color:#222} .ap h1{font-size:20pt;margin:0 0 2px;color:#1E3A2F} .ap .ap-s{color:#8a6d3b;font:600 9pt sans-serif;letter-spacing:.08em;text-transform:uppercase;margin:0 0 18px} .ap pre{white-space:pre-wrap;font:inherit;margin:0}`;
    return { title: "Approval request", css, margin: 0.75, file: "Approval-Request", html: `<div class="ap"><h1>${esc(off.ev.name || "Holiday Party")}</h1><p class="ap-s">${esc(L.subject)}</p><pre>${esc(L.body)}</pre></div>` };
  }

  // ---------- 🥘 potluck ----------
  function offPotHtml() {
    const hc = Math.max(1, +off.ev.headcount || 1);
    return `<div class="card pt-card"><p class="host-rem">For about <b>${hc} people</b>. If everyone brings one thing, aim for the numbers below so there's a good mix. Print the sign-up sheet for the lunchroom, or add names here as people sign up.</p>
        <div class="pot-cats">${OFF_POT.map(([k, l, share]) => { const n = off.pot.filter(p => p.cat === k).length, want = share ? Math.max(1, Math.round(hc * share)) : 2;
          return `<div class="pot-cat ${n >= want ? "full" : ""}"><span>${l}</span><b>${n} / ${want}</b></div>`; }).join("")}</div>
        <button type="button" class="btn btn-red btn-block" data-print="potluck" style="margin-top:10px">🖨️ Print the sign-up sheet</button></div>
      <div class="card pt-card"><h3>🙋 Who's bringing what</h3><ul class="host-list">${off.pot.map(p => `<li data-op="${p.id}"><label><span><b>${esc(p.who)}</b> · ${esc(p.dish)}<small>${(OFF_POT.find(c => c[0] === p.cat) || OFF_POT[0])[1]}${p.diet && p.diet.length ? " · " + p.diet.join(", ") : ""}</small></span></label><button type="button" class="icon-btn" data-opdel aria-label="Remove">✕</button></li>`).join("") || `<li class="host-rem">No sign-ups yet.</li>`}</ul>
        <form class="org-ev-form" id="offPotForm" autocomplete="off"><div class="org-addr-row"><input class="input" name="who" maxlength="30" placeholder="Name"><input class="input" name="dish" maxlength="50" placeholder="Dish"></div>
          <select class="input" name="cat">${OFF_POT.map(([k, l]) => `<option value="${k}">${l}</option>`).join("")}</select>
          <div class="apps-filters">${OFF_DIET.map(([k, l]) => `<label class="chip pot-diet"><input type="checkbox" name="diet" value="${k}"> ${l}</label>`).join("")}</div>
          <button class="btn btn-green btn-block" type="submit">➕ Add</button></form>
        ${off.pot.length ? `<button type="button" class="btn btn-ghost btn-block" id="potShare" style="margin-top:8px">💬 Share the list with the team</button>` : ""}</div>`;
  }
  function potText() {
    const e = off.ev; return `🥘 Potluck for our ${e.name || "holiday party"}${e.date ? " on " + offDate(e.date, { weekday: "long", month: "long", day: "numeric" }) : ""}\n\n` +
      OFF_POT.map(([k, l]) => { const l2 = off.pot.filter(p => p.cat === k); return l2.length ? `${l}\n${l2.map(p => `• ${p.who}: ${p.dish}${p.diet && p.diet.length ? ` (${p.diet.join(", ")})` : ""}`).join("\n")}` : ""; }).filter(Boolean).join("\n\n") + "\n\nPlease label your dish if it has nuts or other allergens. Thank you! 🎄";
  }
  function potluckDoc() {
    const hc = Math.max(1, +off.ev.headcount || 1), e = off.ev;
    const css = `.pl{font:11pt/1.4 Georgia,serif;color:#222} .pl h1{margin:0;font-size:22pt;color:#1E3A2F;text-align:center} .pl .pl-s{text-align:center;color:#8a6d3b;font:600 9pt sans-serif;letter-spacing:.08em;text-transform:uppercase;margin:4px 0 14px}
      .pl h2{font-size:12pt;margin:12px 0 4px;color:#1E3A2F} .pl table{width:100%;border-collapse:collapse} .pl td{border-bottom:1px solid #bbb;height:24px;padding:2px 6px;font-size:10.5pt} .pl td:first-child{width:38%} .pl th{text-align:left;font:600 8pt sans-serif;text-transform:uppercase;color:#777;padding:2px 6px}
      .pl .pl-foot{margin-top:12px;font:9pt sans-serif;color:#666;text-align:center}`;
    const html = `<div class="pl"><h1>🥘 Potluck Sign-Up</h1><p class="pl-s">${esc(e.name || "Holiday Party")}${e.date ? " · " + offDate(e.date, { weekday: "long", month: "long", day: "numeric" }) : ""}${e.venue ? " · " + esc(e.venue) : ""}</p>
      ${OFF_POT.map(([k, l, share]) => { const have = off.pot.filter(p => p.cat === k), want = Math.max(have.length, share ? Math.max(1, Math.round(hc * share)) : 2);
        return `<h2>${l}</h2><table><tr><th>Name</th><th>Dish</th><th>Allergens / diet</th></tr>${Array.from({ length: want }, (_, i) => { const p = have[i]; return `<tr><td>${p ? esc(p.who) : ""}</td><td>${p ? esc(p.dish) : ""}</td><td>${p && p.diet ? esc(p.diet.join(", ")) : ""}</td></tr>`; }).join("")}</table>`; }).join("")}
      <p class="pl-foot">Please label your dish if it contains nuts, gluten, dairy or other allergens. Thank you! 🎄</p></div>`;
    return { title: "Potluck sign-up sheet", css, html, margin: 0.5, file: "Potluck-Sign-Up" };
  }

  // ---------- 🏆 Silly Office Awards ----------
  function offAwardsHtml() {
    const unused = OFF_AWARDS.filter(t => !off.awards.some(a => a.t === t));
    return `<div class="card pt-card"><p class="host-rem">Keep it kind and fun! Type each winner's name, then print a certificate for everyone on the night.</p>
        <ul class="host-list">${off.awards.map(a => `<li data-oa="${a.id}" class="aw-row"><span class="aw-t">🏆 ${esc(a.t)}</span><input class="input who-in" data-aww maxlength="30" placeholder="Winner" value="${esc(a.w || "")}"><button type="button" class="icon-btn" data-awdel aria-label="Remove">✕</button></li>`).join("")}</ul>
        ${unused.length ? `<div class="apps-filters" style="margin-top:10px">${unused.slice(0, 8).map(t => `<button type="button" class="chip" data-awadd="${esc(t)}">＋ ${esc(t)}</button>`).join("")}</div>` : ""}
        <form class="santa-kid-row" id="offAwardForm" autocomplete="off" style="margin-top:10px"><input class="input" name="t" maxlength="50" placeholder="Make up your own award"><button class="btn btn-green" type="submit">Add</button></form>
        <button type="button" class="btn btn-red btn-block" data-print="awards" style="margin-top:10px">🖨️ Print the certificates</button>
        ${offNear("Trophies & prizes near me", [["🏆 Trophy & engraving shops", "trophy engraving shop"], ["🖨️ Print shops (for nicer paper)", "print shop"], ["🎁 Gift card & prize stores", "gift shop"]])}</div>`;
  }
  function awardsDoc() {
    const list = off.awards; if (!list.length) return { error: "🏆 Add some awards first" };
    const co = family || "Our Team", yr = offYear();
    const css = `.cert{box-sizing:border-box;height:4.8in;border:6px double #B8935A;padding:.35in;text-align:center;font-family:Georgia,serif;display:flex;flex-direction:column;justify-content:center;break-inside:avoid;margin-bottom:.3in}
      .cert .c1{font:600 9pt sans-serif;letter-spacing:.3em;text-transform:uppercase;color:#B8935A} .cert .c2{font:400 30pt "Great Vibes",cursive;color:#1E3A2F;margin:6px 0} .cert .c3{font-size:12pt;color:#555} .cert .c4{font-size:22pt;font-weight:bold;color:#b3262e;margin:6px 0 4px;min-height:30pt;border-bottom:1px solid #ccc;display:inline-block;padding:0 30px}
      .cert .c5{font:9pt sans-serif;color:#888;margin-top:10px}`;
    return { noBrand: 1, title: "Silly Office Awards certificates", css, fonts: true, margin: 0.5, file: "Office-Awards", html: list.map(a => `<div class="cert"><div class="c1">Silly Office Awards ${yr}</div><div class="c2">${esc(a.t)}</div><div class="c3">proudly presented to</div><div><span class="c4">${esc(a.w || "")}</span></div><div class="c5">${esc(co)} · ${esc(off.ev.name || "Holiday Party")}</div></div>`).join("") };
  }

  // ---------- 👥 guests · 🗳️ polls · 📝 team survey ----------
  const GS_NEXT = { pending: "yes", yes: "remote", remote: "no", no: "pending" }, GS_LAB = { pending: "Waiting", yes: "Yes", remote: "Joining online", no: "No" };
  const GS_DIET = [["V", "Vegetarian"], ["VG", "Vegan"], ["GF", "Gluten-free"], ["DF", "Dairy-free"], ["N", "Nut allergy"], ["O", "Other allergy"]];
  const offGuests = () => (off.guests = off.guests || []), offPolls = () => (off.polls = off.polls || []), offSurvey = () => (off.survey = off.survey || []);
  const gsIn = g => g.status === "yes" || g.status === "remote";
  const offAttend = () => offGuests().filter(gsIn).reduce((a, g) => a + 1 + (+g.plus || 0), 0);
  function offDietTally() { const t = {}; offGuests().filter(gsIn).forEach(g => (g.diet || []).forEach(k => { t[k] = (t[k] || 0) + 1; })); return t; }
  function offDietLine() {
    const t = offDietTally(), parts = GS_DIET.filter(([k]) => t[k]).map(([k, l]) => `${t[k]} ${l.toLowerCase()}`);
    return parts.length ? `<p class="host-rem"><b>Your guests need:</b> ${parts.join(", ")}. Ask for these when you order.</p>` : "";
  }
  async function offShareText(text, title) {
    try { if (navigator.share) { await navigator.share({ title, text }); return; } } catch (err) { if (err && err.name === "AbortError") return; }
    try { await navigator.clipboard.writeText(text); toast("📋 Copied! Paste it into a message or email"); } catch (err) { toast("Select and copy the text from the screen"); }
  }
  function offGuestsHtml() {
    const g = offGuests(), n = k => g.filter(x => x.status === k).length, att = offAttend(), tally = offDietTally(), notes = g.filter(x => gsIn(x) && x.note);
    return `<div class="card pt-card"><h3>👥 Who's coming</h3>
        <div class="gs-tiles">${["yes", "remote", "pending", "no"].map(k => `<div><b>${n(k)}</b><small>${GS_LAB[k]}</small></div>`).join("")}</div>
        <p class="host-rem">${g.length ? `<b>${att}</b> coming, counting plus-ones.` : "Add each person, then tap their status as replies come in."}</p>
        ${g.length && att && att !== +off.ev.headcount ? `<button type="button" class="btn btn-ghost btn-block" data-gsuse>Use ${att} as my headcount</button>` : ""}
        ${n("pending") ? `<button type="button" class="btn btn-ghost btn-block" data-gsnudge style="margin-top:6px">💬 Message the ${n("pending")} still waiting</button>` : ""}</div>
      ${Object.keys(tally).length || notes.length ? `<div class="card pt-card"><h3>🍽️ Dietary needs</h3><div class="gs-diet">${GS_DIET.filter(([k]) => tally[k]).map(([k, l]) => `<span><b>${tally[k]}</b> ${l}</span>`).join("")}</div>${notes.length ? `<ul class="host-list">${notes.map(x => `<li><span><b>${esc(x.name)}</b>: ${esc(x.note)}</span></li>`).join("")}</ul>` : ""}<p class="host-rem">Only people who said Yes or Joining online are counted. Use it when you order food.</p></div>` : ""}
      <div class="card pt-card"><h3>➕ Add a guest</h3>
        <form class="org-ev-form" id="gsForm" autocomplete="off"><div class="org-addr-row"><input class="input" name="name" maxlength="40" placeholder="Name"><input class="input" name="plus" type="number" inputmode="numeric" min="0" max="9" placeholder="+ guests" style="max-width:96px"></div>
          <select class="input" name="status">${Object.keys(GS_LAB).map(k => `<option value="${k}">${GS_LAB[k]}</option>`).join("")}</select>
          <div class="apps-filters">${GS_DIET.map(([k, l]) => `<label class="chip pot-diet"><input type="checkbox" name="diet" value="${k}"> ${l}</label>`).join("")}</div>
          <input class="input" name="note" maxlength="80" placeholder="Dietary note (optional), e.g. no shellfish">
          <button class="btn btn-green btn-block" type="submit">➕ Add</button></form></div>
      ${g.length ? `<div class="card pt-card"><h3>The list</h3><ul class="host-list gs-list">${g.map(x => `<li data-gs="${x.id}"><span><b>${esc(x.name)}</b>${+x.plus ? ` +${+x.plus}` : ""}<small>${(x.diet || []).map(k => (GS_DIET.find(d => d[0] === k) || [0, k])[1]).concat(x.note ? [esc(x.note)] : []).join(" · ")}</small></span><button type="button" class="gs-st ${x.status}" data-gsst>${GS_LAB[x.status]}</button><button type="button" class="icon-btn" data-gsdel aria-label="Remove">✕</button></li>`).join("")}</ul></div>` : ""}`;
  }
  function plLabel(p, o) { return p.kind === "date" ? offDate(o.val, { weekday: "short", month: "short", day: "numeric" }) + (o.time ? " · " + offTime(o.time) : "") : o.val; }
  function offPollsHtml() {
    const P = offPolls();
    const card = p => { const tot = p.opts.reduce((a, o) => a + o.n, 0), top = Math.max(0, ...p.opts.map(o => o.n)), win = top > 0 ? p.opts.filter(o => o.n === top) : [];
      return `<div class="card pt-card" data-pl="${p.id}"><h3>${p.kind === "date" ? "📅 Which day works?" : "🍽️ Where should we order from?"}</h3>
        ${p.opts.map(o => `<div class="pl-opt${win.includes(o) ? " win" : ""}" data-plo="${o.id}"><div class="pl-top"><b>${esc(plLabel(p, o))}</b><span class="pl-n">${o.n}</span></div><i><u style="width:${tot ? Math.round(o.n / tot * 100) : 0}%"></u></i>
          <div class="of-acts"><button type="button" class="of-lnk" data-plv="1">+1 vote</button><button type="button" class="of-lnk" data-plv="-1">−1</button>${o.url ? `<a class="of-lnk" href="${esc(offUrl(o.url))}" target="_blank" rel="noopener">Website</a>` : ""}<button type="button" class="of-lnk" data-plodel>Remove</button></div></div>`).join("") || `<p class="host-rem">Add two or three options below.</p>`}
        ${win.length === 1 ? `<button type="button" class="btn btn-gold btn-block" data-plwin="${win[0].id}">${p.kind === "date" ? `Use ${esc(plLabel(p, win[0]))} as the event date` : `Add ${esc(win[0].val)} to Costs &amp; vendors`}</button>` : win.length > 1 ? `<p class="host-rem">It's a tie. Ask for one more vote.</p>` : ""}
        <form class="org-ev-form pl-form" data-plform="${p.id}" autocomplete="off">${p.kind === "date" ? `<div class="org-addr-row"><input class="input" name="val" type="date"><input class="input" name="time" type="time" style="max-width:130px"></div>` : `<input class="input" name="val" maxlength="50" placeholder="e.g. Sunrise Catering"><input class="input" name="url" maxlength="120" inputmode="url" placeholder="Website (optional)">`}<button class="btn btn-green btn-block" type="submit">➕ Add option</button></form>
        <div class="ms-acts"><button type="button" class="btn btn-ghost" data-plshare>💬 Share the question</button><button type="button" class="btn btn-ghost" data-pldel>Delete this poll</button></div></div>`; };
    return `<div class="card pt-card"><h3>🗳️ Quick votes</h3><p class="host-rem">Send the options in one message, then tap +1 for each reply you get. The winner can fill in your event date or add a caterer to Costs &amp; vendors.</p>
        <div class="ms-acts"><button type="button" class="btn btn-red" data-plnew="date">📅 Date poll</button><button type="button" class="btn btn-red" data-plnew="menu">🍽️ Food vote</button></div></div>` + P.map(card).join("");
  }
  function plText(p) {
    const L = "ABCDEFG", e = off.ev;
    return `${p.kind === "date" ? "📅 Which day works for the " : "🍽️ Where should we order from for the "}${e.name || "holiday party"}?\n\n` + p.opts.map((o, i) => `${L[i]}) ${plLabel(p, o)}`).join("\n") + "\n\nReply with the letter you like best!";
  }
  const svAvg = () => { const r = offSurvey().filter(x => +x.rate); return r.length ? Math.round(r.reduce((a, x) => a + +x.rate, 0) / r.length * 10) / 10 : 0; };
  function offSurveyHtml() {
    const S = offSurvey(), avg = svAvg();
    return `<div class="card pt-card"><h3>📝 Team survey</h3><p class="host-rem">Two questions to ask after the party. Share them, then type in each answer you get.</p>
        <button type="button" class="btn btn-ghost btn-block" data-svshare>💬 Share the two questions</button>
        ${S.length ? `<div class="sv-sum"><b>${avg}</b> out of 5<small>${S.length} ${S.length === 1 ? "answer" : "answers"}</small></div><ul class="host-list">${S.map(x => `<li data-sv="${x.id}"><span><b>${"★".repeat(+x.rate || 0)}</b>${x.next ? ` ${esc(x.next)}` : ""}</span><button type="button" class="icon-btn" data-svdel aria-label="Remove">✕</button></li>`).join("")}</ul>` : ""}
        <form class="org-ev-form" id="svForm" autocomplete="off"><div class="org-addr-row"><select class="input" name="rate" style="max-width:130px"><option value="5">5 stars</option><option value="4">4 stars</option><option value="3">3 stars</option><option value="2">2 stars</option><option value="1">1 star</option></select><input class="input" name="next" maxlength="100" placeholder="What should we do next year?"></div>
          <button class="btn btn-green btn-block" type="submit">➕ Add an answer</button></form></div>`;
  }
  function offSurveyYE() {
    const S = offSurvey(), g = offGuests(); let out = "";
    if (g.length) out += `<h2>Guests</h2><p>${g.filter(x => x.status === "yes").length} yes · ${g.filter(x => x.status === "remote").length} joining online · ${g.filter(x => x.status === "no").length} no · ${g.filter(x => x.status === "pending").length} no reply. ${offAttend()} attended or joined online.</p>`;
    if (S.length) out += `<h2>Team survey</h2><p>Average rating <b>${svAvg()} out of 5</b> from ${S.length} ${S.length === 1 ? "person" : "people"}.</p>${S.some(x => x.next) ? `<p><b>Ideas for next year:</b> ${S.filter(x => x.next).map(x => esc(x.next)).join(" · ")}</p>` : ""}`;
    return out;
  }
  $("#view-office").addEventListener("click", e => {
    const t = e.target, again = () => { saveOff(); renderOffice(); renderCoDash(); };
    const st = t.closest("[data-gsst]"); if (st) { const g = offGuests().find(x => x.id === st.closest("[data-gs]").dataset.gs); if (g) { g.status = GS_NEXT[g.status]; again(); } return; }
    const gd = t.closest("[data-gsdel]"); if (gd) { off.guests = offGuests().filter(x => x.id !== gd.closest("[data-gs]").dataset.gs); again(); return; }
    if (t.closest("[data-gsuse]")) { off.ev.headcount = offAttend(); again(); toast("👥 Headcount updated"); return; }
    if (t.closest("[data-gsnudge]")) { const w = offGuests().filter(x => x.status === "pending").map(x => x.name); offShareText(`Hi ${w.join(", ")}! Are you able to join the ${off.ev.name || "holiday party"}${off.ev.date ? " on " + offDate(off.ev.date, { weekday: "long", month: "long", day: "numeric" }) : ""}? Please reply Yes, No or Joining online, and let me know about any food allergies. Thank you!`, "RSVP"); return; }
    const pn = t.closest("[data-plnew]"); if (pn) { offPolls().push({ id: uid(), kind: pn.dataset.plnew, opts: [] }); again(); return; }
    const pc = t.closest("[data-pl]"); if (pc) {
      const p = offPolls().find(x => x.id === pc.dataset.pl); if (!p) return;
      const pv = t.closest("[data-plv]"); if (pv) { const o = p.opts.find(x => x.id === pv.closest("[data-plo]").dataset.plo); if (o) { o.n = Math.max(0, o.n + +pv.dataset.plv); again(); } return; }
      if (t.closest("[data-plodel]")) { p.opts = p.opts.filter(x => x.id !== t.closest("[data-plo]").dataset.plo); again(); return; }
      if (t.closest("[data-pldel]")) { if (confirm("Delete this poll?")) { off.polls = offPolls().filter(x => x.id !== p.id); again(); } return; }
      if (t.closest("[data-plshare]")) { offShareText(plText(p), "Vote"); return; }
      const w = t.closest("[data-plwin]"); if (w) { const o = p.opts.find(x => x.id === w.dataset.plwin); if (!o) return;
        if (p.kind === "date") { off.ev.date = o.val; if (o.time) off.ev.start = o.time; again(); toast("📅 Event date set"); }
        else { if (!off.costs.some(c => c.name === o.val)) off.costs.push({ id: uid(), type: "Catering", name: o.val, contact: "", url: o.url || "", orderBy: "", cost: 0 }); again(); toast("🍽️ Added to Costs & vendors"); }
        return; }
    }
    if (t.closest("[data-svshare]")) { offShareText(`Thanks for coming to the ${off.ev.name || "holiday party"}! Two quick questions:\n1) How was it, from 1 to 5?\n2) What should we do next year?`, "Quick survey"); return; }
    const sd = t.closest("[data-svdel]"); if (sd) { off.survey = offSurvey().filter(x => x.id !== sd.closest("[data-sv]").dataset.sv); again(); return; }
  });
  $("#view-office").addEventListener("submit", e => {
    const f = e.target, again = () => { saveOff(); renderOffice(); renderCoDash(); };
    if (f.id === "gsForm") { e.preventDefault(); e.stopImmediatePropagation(); const nm = f.name.value.trim(); if (!nm) { toast("👥 Add a name"); return; }
      offGuests().push({ id: uid(), name: nm, plus: Math.max(0, Math.min(9, parseInt(f.plus.value) || 0)), status: f.status.value, diet: [...f.querySelectorAll("[name=diet]:checked")].map(x => x.value), note: f.note.value.trim() }); again(); return; }
    if (f.dataset.plform) { e.preventDefault(); e.stopImmediatePropagation(); const p = offPolls().find(x => x.id === f.dataset.plform); const v = f.val.value.trim(); if (!p || !v) { toast("Add an option first"); return; }
      p.opts.push({ id: uid(), val: v, n: 0, time: f.time ? f.time.value : "", url: f.url ? f.url.value.trim() : "" }); again(); return; }
    if (f.id === "svForm") { e.preventDefault(); e.stopImmediatePropagation(); offSurvey().push({ id: uid(), rate: +f.rate.value, next: f.next.value.trim() }); again(); return; }
  }, true);

  // ---------- 📄 the plan: review card → approval → final plan ----------
  const OFF_FOOD_LABEL = { apps: "Appetizers we make", catered: "Catered or ordered in", potluck: "Potluck", venue: "The venue provides it" };
  const offMin = m => { const x = ((m % 1440) + 1440) % 1440; return offTime(String(Math.floor(x / 60)).padStart(2, "0") + ":" + String(x % 60).padStart(2, "0")); };
  function offRunOfShow() {
    const e = off.ev, [sh, sm] = (e.start || "17:00").split(":").map(Number), [eh, em] = (e.end || "21:00").split(":").map(Number);
    const S = sh * 60 + sm, E = Math.max(S + 60, eh * 60 + em), F = offFoodCfg().style, out = [], add = (m, t) => out.push([m, t]);
    add(S - 120, "Set up the room: tables, chairs, decorations and music");
    if (F === "catered") add(S - 60, "Caterer arrives, or pick up the food");
    if (F === "apps") add(S - 60, "Prepare and plate the appetizers");
    add(S - 30, "Set out food, drinks, plates and name tags");
    add(S, "Doors open and welcome everyone");
    if (off.acts.booth) add(S + 15, "Photo booth opens");
    let t = S + 20;
    if (F) { add(t, "Food is served"); t += 40; }
    [["games", "Games and icebreakers"], ["teamb", "Team-building activity"], ["sweater", "Ugly sweater contest and voting"], ["gifts", "Gift exchange"], ["elephant", "White elephant gift swap"], ["awards", "Silly Office Awards"], ["charity", "Charity drive update and thank-you"]].forEach(([k, l]) => { if (off.acts[k] && t < E - 30) { add(t, l); t += 30; } });
    if (off.acts.santa) { const sv = off.santa || {}, label = "Santa visit and photos" + (sv.who ? ` (${sv.who})` : ""); if (sv.time) { const [a, b] = sv.time.split(":").map(Number); add(a * 60 + b, label); } else if (t < E - 30) { add(t, label); t += 30; } }
    add(E - 20, "Thank everyone, group photo and leftovers");
    add(E, "Party ends");
    add(E + 30, "Clean up and return borrowed items");
    return out.sort((a, b) => a[0] - b[0]).map(([m, t2]) => [offMin(m), t2]);
  }
  function offApprovedLog() { return off.appr.log.slice().reverse().find(l => l.s === "approved"); }
  function offLastNote() { const l = off.appr.log.slice().reverse().find(l => l.s === "changes"); return l ? l.note : ""; }
  function offPlanBody() {
    const e = off.ev, hc = Math.max(1, +e.headcount || 1), total = offTotal(), F = offFoodCfg().style, g = offGuests(), t = offDietTally();
    const row = (k, v) => v ? `<tr><td style="width:130px"><b>${k}</b></td><td>${v}</td></tr>` : "";
    return `<h1>${esc(e.name || "Holiday Party")}</h1><p class="pl-s">${esc(family || "")}${family ? " · " : ""}${offYear()} · Event plan</p>
      <table>${row("Date", e.date ? esc(offDate(e.date)) + (e.start ? `, ${offTime(e.start)}–${offTime(e.end)}` : "") : "")}${row("Venue", esc([e.venue, e.address].filter(Boolean).join(", ")))}${row("Guests", hc + (offWho() ? ` · ${esc(offWho()[2])}` : ""))}${row("Organized by", esc(e.organizer))}${row("Food", F ? esc(OFF_FOOD_LABEL[F]) : "")}${row("Theme / dress", esc([e.theme, e.dress].filter(Boolean).join(" · ")))}${row("Activities", esc(offActs().join(" · ")))}${row("Budget", `${money(total)} planned (about ${money(Math.round(total / hc * 100) / 100)} per person)${+e.budget ? ` of ${money(+e.budget)} approved` : ""}`)}</table>
      <h2>Run of show</h2><table>${offRunOfShow().map(([a, b]) => `<tr><td style="width:90px"><b>${a}</b></td><td>${esc(b)}</td></tr>`).join("")}</table>
      ${(() => { let m = ""; if (F === "apps") { const X = offFoodPlan(); m = `<p><b>Appetizers:</b> ${X.items.map(i => `${esc(i.n)} (${i.pieces} pieces)`).join(", ") || "none picked yet"}</p>${X.dItems.length ? `<p><b>Drinks:</b> ${X.dItems.map(i => esc(i.n)).join(", ")}</p>` : ""}`; } else if (F === "potluck") m = off.pot.length ? `<p>${off.pot.map(x => `${esc(x.who)}: ${esc(x.dish)}`).join(" · ")}</p>` : "<p>Sign-ups still open.</p>"; else if (F === "catered") m = `<p>${off.costs.filter(c => c.type === "Catering").map(c => esc(c.name || "Caterer") + (c.cost ? " (" + money(+c.cost) + ")" : "")).join(" · ") || "Caterer to be chosen."}</p>`; else if (F === "venue") m = "<p>The venue provides the food.</p>"; return F ? `<h2>Food and drinks</h2><p><b>${esc(OFF_FOOD_LABEL[F])}</b></p>${m}` : ""; })()}
      ${(() => { const L = []; if (off.acts.santa) L.push(`<p><b>Santa:</b> ${esc((off.santa || {}).who || "to be chosen")}${(off.santa || {}).time ? " at " + offTime(off.santa.time) : ""}</p>`); if (off.acts.elephant && (off.wep || {}).players && off.wep.players.length) L.push(`<p><b>White elephant players:</b> ${(off.wep.order || off.wep.players).map(esc).join(", ")}</p>`); if (off.acts.teamb && (off.tbPick || []).length) L.push(`<p><b>Team building:</b> ${off.tbPick.map(esc).join(", ")}</p>`); if (off.acts.booth) L.push("<p><b>Photo booth:</b> yes</p>"); return L.length ? `<h2>Activity details</h2>${L.join("")}` : ""; })()}
      ${off.costs.length ? `<h2>Orders and vendors</h2><table><tr><th>What</th><th>Vendor</th><th>Contact</th><th>Order by</th><th class="num">Cost</th></tr>${off.costs.map(c => `<tr><td>${esc(c.type)}</td><td>${esc(c.name || "")}</td><td>${esc([c.contact, c.url].filter(Boolean).join(" · "))}</td><td>${c.orderBy ? esc(offDate(c.orderBy, { month: "short", day: "numeric" })) + (c.ordered ? " ✓" : "") : ""}</td><td class="num">${money(+c.cost || 0)}</td></tr>`).join("")}</table>` : ""}
      ${g.length ? `<h2>Guests</h2><p>${g.map(x => `${esc(x.name)}${+x.plus ? " +" + (+x.plus) : ""} (${GS_LAB[x.status].toLowerCase()})`).join(", ")}</p><p>${g.filter(x => x.status === "yes").length} yes · ${g.filter(x => x.status === "remote").length} joining online · ${g.filter(x => x.status === "pending").length} waiting · ${g.filter(x => x.status === "no").length} no. ${offAttend()} expected, counting plus-ones.</p>${Object.keys(t).length ? `<p><b>Dietary needs:</b> ${GS_DIET.filter(([k]) => t[k]).map(([k, l]) => `${t[k]} ${l.toLowerCase()}`).join(", ")}</p>` : ""}` : ""}
      ${e.notes ? `<h2>Notes</h2><p>${esc(e.notes)}</p>` : ""}`;
  }
  const OFF_PLAN_CSS = `.pl{font:10.5pt/1.45 Georgia,serif;color:#222} .pl h1{font-size:20pt;margin:0;color:#1E3A2F} .pl .pl-s{color:#8a6d3b;font:600 8.5pt sans-serif;letter-spacing:.08em;text-transform:uppercase;margin:2px 0 12px} .pl h2{font-size:12.5pt;color:#1E3A2F;border-bottom:1.5px solid #B8935A;margin:14px 0 5px;padding-bottom:2px} .pl table{width:100%;border-collapse:collapse} .pl td,.pl th{padding:4px 6px;border-bottom:1px solid #e6dcc6;text-align:left;vertical-align:top;font-size:10pt} .pl .num{text-align:right}`;
  function offPlanDoc() { return { title: "Event plan", css: OFF_PLAN_CSS, html: `<div class="pl">${offPlanBody()}<p class="pl-s" style="margin-top:16px">Made with Noël Tier 1 Hub · Office Edition</p></div>`, margin: 0.5, file: "Event-Plan" }; }
  function offSavedDoc(id) { const s = (off.saved || []).find(x => x.id === id); return s ? { title: s.name, css: OFF_PLAN_CSS, html: `<div class="pl">${s.html}<p class="pl-s" style="margin-top:16px">Made with Noël Tier 1 Hub · Office Edition</p></div>`, margin: 0.5, file: "Event-Plan" } : null; }
  function offNewPlan() {
    if (!confirm("Start a new plan? A copy of this plan is saved to My saved plans first. Then the event, costs, food, activities and approval are cleared so you can build a new one. Your name and approver stay.")) return;
    offSavePlan(); const last = off.saved[off.saved.length - 1]; if (last) last.name += " (replaced)";
    const keep = { organizer: off.ev.organizer, approver: off.ev.approver, approverEmail: off.ev.approverEmail, headcount: off.ev.headcount, giftLimit: off.ev.giftLimit };
    off.ev = Object.assign({ name: "Holiday Party", date: "", start: "17:00", end: "21:00", venue: "", address: "", headcount: 20, budget: 0, theme: "", dress: "", giftLimit: 25, organizer: "", approver: "", approverEmail: "", notes: "" }, keep);
    off.acts = { potluck: 1, gifts: 1, awards: 1, games: 1 }; off.costs = []; off.pot = []; off.polls = []; off.tbPick = []; off.santa = { time: "", who: "" }; off.food = null; off.confirmed = null;
    off.guests = (off.guests || []).map(g => Object.assign({}, g, { status: "pending" })); if (off.wep) off.wep.order = null;
    off.appr = { status: "draft", log: [], followDays: (off.appr && off.appr.followDays) || 3 }; off.tab = "event";
    saveOff(); offSync(); renderOffice(); renderCoDash(); window.scrollTo(0, 0); toast("🆕 Fresh plan. The old one is in My saved plans");
  }
  function offSavePlan() {
    off.saved = off.saved || []; const ap = offApprovedLog();
    off.saved.push({ id: uid(), at: Date.now(), name: (off.ev.name || "Holiday Party") + (ap ? ` · approved ${new Date(ap.at).toLocaleDateString(undefined, { month: "short", day: "numeric" })}` : ""), html: offPlanBody() });
    off.saved = off.saved.slice(-10);
  }
  function offReview() {
    const old = document.getElementById("planReview"); if (old) old.remove();
    const e = off.ev, hc = Math.max(1, +e.headcount || 1), total = offTotal(), lim = +e.budget || 0, F = offFoodCfg().style;
    const missing = [!e.date && "a date", !e.name && "a name"].filter(Boolean);
    const el = document.createElement("div"); el.id = "planReview"; el.className = "pr-overlay"; el.setAttribute("role", "dialog"); el.setAttribute("aria-modal", "true");
    el.innerHTML = `<div class="pr-card"><p class="menu-star">✦</p><h3 class="pr-title">Your plan</h3><p class="pr-sub">Check the details. Next you will write the approval request${e.approver ? ` for ${esc(e.approver)}` : ""}.</p>
      <div class="pr-meal"><h4>${esc(e.name || "Holiday Party")}</h4>
        <p class="pr-when">${missing.length ? `Add ${missing.join(" and ")} on the Event tab first.` : `<b>${hc}</b> guest${hc > 1 ? "s" : ""}${offWho() ? ` · ${esc(offWho()[2])}` : ""}<br>${esc(offDate(e.date))}${e.start ? `<br>${offTime(e.start)} to ${offTime(e.end)}` : ""}`}</p>
        ${e.venue ? `<p class="pr-add"><b>Where</b></p><ul class="pr-steps"><li><span>${esc(e.venue)}</span></li></ul>` : ""}
        ${F ? `<p class="pr-add"><b>Food</b></p><ul class="pr-steps"><li><span>${esc(OFF_FOOD_LABEL[F])}</span></li></ul>` : ""}
        ${offActs().length ? `<p class="pr-add"><b>Activities</b></p><ul class="pr-steps">${offActs().map(a => `<li><span>${esc(a)}</span></li>`).join("")}</ul>` : ""}
        <p class="pr-add"><b>Cost</b></p><ul class="pr-steps"><li><span>${money(total)} planned, about ${money(Math.round(total / hc * 100) / 100)} per person${lim ? `<br><small>${total > lim ? `${money(total - lim)} over` : `${money(lim - total)} under`} the approved ${money(lim)}</small>` : ""}</span></li></ul></div>
      <div class="pr-btns"><button type="button" class="btn btn-ghost" data-prback>Go back</button><button type="button" class="btn btn-gold" data-prok ${missing.length ? "disabled" : ""}>Confirm</button></div></div>`;
    document.body.appendChild(el);
    el.addEventListener("click", ev => {
      if (ev.target === el || ev.target.closest("[data-prback]")) { el.remove(); return; }
      if (ev.target.closest("[data-prok]")) { el.remove(); off.confirmed = Date.now(); off.tab = "approval"; saveOff(); showView("office"); renderOffice(); window.scrollTo(0, 0); toast("✅ Plan confirmed. Now send it for approval"); }
    });
  }
  function offSavedList() {
    const saved = off.saved || [];
    return saved.length ? `<div class="card pt-card"><h3>📁 My saved plans</h3><ul class="host-list">${saved.slice().reverse().map(x => `<li data-plsv="${x.id}"><span><b>${esc(x.name)}</b><small>${new Date(x.at).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</small></span><button type="button" class="of-lnk of-done" data-plopen="${x.id}">Open</button><button type="button" class="of-lnk" data-print="offsaved:${x.id}">Print</button><button type="button" class="icon-btn" data-plsvdel aria-label="Delete">✕</button></li>`).join("")}</ul></div>` : "";
  }
  function offSavedOne() {
    const x = (off.saved || []).find(y => y.id === off.svId); if (!x) return offSavedHtml();
    return `<button type="button" class="chip" data-oftab="saved" style="margin-bottom:10px">‹ My saved plans</button><div class="card pt-card pl-view"><div class="pl">${x.html}</div></div><div class="send-btns"><button type="button" class="btn btn-red" data-print="offsaved:${x.id}">🖨️ Print</button><button type="button" class="btn btn-ghost" data-oftab="saved">Back</button></div>`;
  }
  function offSavedHtml() { return offSavedList() || `<div class="card pt-card"><h3>📁 My saved plans</h3><p class="host-rem">Nothing saved yet. When your plan is approved a copy is saved here automatically. You can also tap "Save a copy" on the Run it step.</p></div>`; }
  function offPlanHtml() {
    const st = off.appr.status, e = off.ev, ap = offApprovedLog(), saved = off.saved || [];
    const savedHtml = offSavedList();
    const _unused = saved.length ? `<div class="card pt-card"><h3>📁 My saved plans</h3><ul class="host-list">${saved.slice().reverse().map(s => `<li data-plsv="${s.id}"><span><b>${esc(s.name)}</b><small>${new Date(s.at).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</small></span><button type="button" class="of-lnk" data-print="offsaved:${s.id}">Print</button><button type="button" class="icon-btn" data-plsvdel aria-label="Delete">✕</button></li>`).join("")}</ul></div>` : "";
    if (st === "draft") return `<div class="card pt-card"><h3>📄 Your plan</h3><p class="host-rem">Review it, confirm it, then send it for approval. Your final plan appears here once it's approved.</p><button type="button" class="btn btn-gold btn-block" data-offreview>See my plan ›</button></div>` + savedHtml;
    if (st === "sent") return `<div class="card pt-card ap-status sent"><div class="ap-big">📨</div><div><b>Waiting for ${esc(e.approver || "approval")}</b><small>Your final plan appears here as soon as you tap "It's approved" on the Approval tab.</small></div></div><button type="button" class="btn btn-ghost btn-block" data-oftab="approval">Go to Approval ›</button>` + savedHtml;
    if (st === "changes") return `<div class="card pt-card ap-status changes"><div class="ap-big">✏️</div><div><b>Changes requested</b><small>${offLastNote() ? esc(offLastNote()) : "Update the plan, then send the new version."}</small></div></div>
      <div class="send-btns"><button type="button" class="btn btn-ghost" data-oftab="event">✏️ Edit the plan</button><button type="button" class="btn btn-gold" data-offreview>Review and resend ›</button></div>` + savedHtml;
    const run = offRunOfShow(), tot = offTotal();
    return `<div class="card pt-card ap-status approved"><div class="ap-big">✅</div><div><b>Approved${ap ? ` on ${new Date(ap.at).toLocaleDateString(undefined, { month: "short", day: "numeric" })}` : ""}</b><small>${e.approver ? `by ${esc(e.approver)}. ` : ""}Here is your plan. Book and order everything below.</small></div></div>
      <div class="card pt-card"><h3>${esc(e.name || "Holiday Party")}</h3><p class="host-rem">${e.date ? esc(offDate(e.date)) : "Date to be set"}${e.start ? `<br>${offTime(e.start)} to ${offTime(e.end)}` : ""}${e.venue ? `<br>${esc(e.venue)}` : ""}</p></div>
      <div class="card pt-card"><h3>🕒 Run of show</h3><ul class="cal-list">${run.map(([a, b]) => `<li><span class="cl-time">${a}</span><span class="cl-txt">${esc(b)}</span></li>`).join("")}</ul></div>
      <div class="card pt-card"><h3>🛒 Book and order</h3>${off.costs.map(c => `<div class="off-cost" data-oc="${c.id}"><div><b>${esc(c.type)}</b>${c.name ? ` · ${esc(c.name)}` : ""}${c.contact ? `<small>📞 ${esc(c.contact)}</small>` : ""}${offOrderHtml(c)}</div><span>${money(+c.cost || 0)}</span><i></i></div>`).join("") || `<p class="host-rem">No costs added yet. Add vendors on the Event tab.</p>`}${off.costs.length ? `<div class="off-cost total"><div><b>Total</b></div><span>${money(tot)}</span><i></i></div>` : ""}
        <button type="button" class="btn btn-ghost btn-block" data-oftab="food" style="margin-top:8px">🍽️ Open the Food plan ›</button></div>
      <div class="card pt-card"><h3>👥 Guests</h3><p class="host-rem">${offGuests().length ? `<b>${offAttend()}</b> expected.` : "No guest list yet."}</p>${offDietLine()}<button type="button" class="btn btn-ghost btn-block" data-oftab="guests">Open Guests ›</button></div>
      <div class="send-btns"><button type="button" class="btn btn-red" data-print="offplan">🖨️ Print the plan</button><button type="button" class="btn btn-gold" data-plsave>📁 Save a copy</button></div><div class="card pt-card"><h3>🆕 Plans changed?</h3><p class="host-rem">If the plan is cancelled or replaced, start a new one. This plan is saved first.</p><button type="button" class="btn btn-ghost btn-block" data-offnew>Start a new plan</button></div>` + savedHtml;
  }
  document.addEventListener("click", e => {
    if (e.target.closest("[data-offreview]")) { offReview(); return; }
    if (e.target.closest("[data-offnew]")) { offNewPlan(); return; }
    if (!e.target.closest("#view-office")) return;
    if (e.target.closest("[data-plsave]")) { offSavePlan(); saveOff(); renderOffice(); toast("📁 Saved to My saved plans"); return; }
    const po = e.target.closest("[data-plopen]"); if (po) { off.svId = po.dataset.plopen; off.tab = "savedone"; saveOff(); renderOffice(); window.scrollTo(0, 0); return; }
    const d = e.target.closest("[data-plsvdel]"); if (d) { if (confirm("Delete this saved plan?")) { off.saved = (off.saved || []).filter(x => x.id !== d.closest("[data-plsv]").dataset.plsv); saveOff(); renderOffice(); } }
  });

  // ---------- 🎭 activities: white elephant · photo booth · Santa · team building ----------
  const TB_IDEAS = [
    ["Two truths and a holiday", 15, "Free", "Everyone shares two true holiday facts and one made-up one. The team guesses.", "Pen and paper"],
    ["Gift-wrap relay", 20, "About $10", "Teams race to wrap a box. Judge on speed and style.", "Wrapping paper, tape, boxes"],
    ["Holiday trivia face-off", 25, "Free", "Two teams, a quizmaster and a buzzer. Use the printable trivia in Games.", "Printed trivia, a bell"],
    ["Cookie decorating contest", 30, "About $40", "Plain cookies, icing and sprinkles. Vote for the best design.", "Cookies, icing, sprinkles, plates"],
    ["Office holiday bingo", 20, "Free", "Spot the classic party moments. First to a line wins a small prize. Printable in Games.", "Printed cards, pens"],
    ["Festive hat or sweater contest", 15, "Free", "Quick runway walk, then everyone votes. Add silly awards.", "Ballot slips"],
    ["Paper snowball toss", 15, "Free", "Crumple paper into snowballs and toss them into a bucket. Teams take turns.", "Paper, a bucket"],
    ["Guess whose holiday photo", 20, "Free", "Ask staff for a childhood holiday photo ahead of time. Guess who is who.", "Printed photos"],
    ["Charity wrap drive", 30, "Donated gifts", "Wrap gifts for a local charity together. Team building and giving back.", "Paper, tape, tags"],
    ["Holiday charades", 20, "Free", "Teams act out holiday words and movies. Prepare the slips in advance.", "Slips of paper, a hat"],
    ["Gingerbread house challenge", 40, "About $60", "Small teams build with candy kits. Judge on creativity.", "Gingerbread kits, icing"],
    ["Gratitude wall", 15, "About $5", "Everyone writes a thank-you to a coworker on a sticky note and posts it on a wall.", "Sticky notes, pens"]
  ];
  const WE_RULES = ["Everyone brings one wrapped gift, no names on it. Keep it under the limit.", "Draw numbers. Number 1 goes first and opens a gift from the pile.", "Next players choose: open a new gift, or steal an opened gift from someone.", "If your gift is stolen, you may steal another or open a new one. You cannot steal the same gift straight back.", "A gift can be stolen up to 2 times. After that it is locked with its owner.", "The last player can swap with any gift that is not locked. Then the game is over."];
  const PB_CHECK = ["A backdrop (fabric, tinsel curtain or wrapping paper)", "A box of props: hats, glasses, signs, scarves", "Good light on faces, not behind the backdrop", "A phone stand or tripod and a timer", "A small table or basket for the props", "A sign with the event name and a hashtag", "Someone in charge of the booth", "A shared folder or album so everyone can get the pictures"];
  const PB_SIGNS = ["Merry and Bright", "Naughty List", "Nice List", "Santa's Helpers", "Team Cheer", "Ho Ho Ho", "Cheers to the Year", "Best Team Ever", "Elf on a Shelf", "Dashing Through the Snow", "Sweater Weather", "Peace, Love and Cookies"];
  const offWE = () => (off.wep = off.wep || { players: [], order: null });
  const offPB = () => (off.pb = off.pb || {});
  const offSanta = () => (off.santa = off.santa || { time: "", who: "" });
  const offTB = () => (off.tbPick = off.tbPick || []);
  function offActsHtml() {
    const W = offWE(), PB = offPB(), SN = offSanta(), TB = offTB();
    return `<div class="card pt-card"><h3>🎭 Activities</h3><p class="host-rem">Pick what to add. Everything you add shows up in your plan and the run of show.</p>${offActs().length ? `<p class="host-rem"><b>In your plan so far:</b> ${offActs().map(esc).join(" · ")}</p><button type="button" class="btn btn-gold btn-block" data-offreview>See my plan ›</button>` : ""}
        <div class="apps-filters">${[["elephant", "🎁 White elephant"], ["booth", "📸 Photo booth"], ["santa", "🎅 Santa visit"], ["teamb", "🧩 Team building"]].map(([k, l]) => `<button type="button" class="chip${off.acts[k] ? " on" : ""}" data-ofact="${k}">${off.acts[k] ? "✓ " : ""}${l}</button>`).join("")}</div></div>
      <details class="card pt-card ss-swap" data-dk="we" ${(off.open || {}).we ? "open" : ""}><summary>🎁 White elephant game</summary>
        <p class="host-rem">Gift limit: <b>${+off.ev.giftLimit ? money(+off.ev.giftLimit) : "set it on the Event tab"}</b></p><ol>${WE_RULES.map(r => `<li>${r}</li>`).join("")}</ol>
        <h4 class="ms-h">Draw the order</h4>
        <form class="org-ev-form" id="weForm" autocomplete="off"><div class="santa-kid-row"><input class="input" name="n" maxlength="30" placeholder="Player's name"><button class="btn btn-green" type="submit">Add</button></div></form>
        ${W.players.length ? `<div class="apps-filters">${W.players.map((n, i) => `<span class="chip on">${esc(n)} <button type="button" class="chip-x" data-wedel="${i}" aria-label="Remove ${esc(n)}">✕</button></span>`).join("")}</div>` : ""}
        ${W.players.length > 1 ? `<button type="button" class="btn btn-gold btn-block" data-wedraw style="margin-top:8px">🎲 Draw the numbers</button>` : ""}
        ${W.order ? `<ol class="we-order">${W.order.map(n => `<li>${esc(n)}</li>`).join("")}</ol><button type="button" class="btn btn-ghost btn-block" data-weclear>Start over</button>` : ""}
        <button type="button" class="btn btn-red btn-block" data-print="wecard" style="margin-top:8px">🖨️ Print the rules card</button></details>
      <details class="card pt-card ss-swap" data-dk="pb" ${(off.open || {}).pb ? "open" : ""}><summary>📸 Photo booth set-up</summary>
        <ul class="host-list">${PB_CHECK.map((t, i) => `<li><label class="${PB[i] ? "on" : ""}"><input type="checkbox" data-pbtick="${i}" ${PB[i] ? "checked" : ""}><span>${t}</span></label></li>`).join("")}</ul>
        <p class="host-rem">Tip: put it near the entrance but away from the food, so people can queue without blocking anyone.</p>
        <button type="button" class="btn btn-red btn-block" data-print="pbsigns">🖨️ Print the prop signs</button>
        ${offNear("Rent or buy for it", [["📸 Photo booth rentals", "photo booth rental"], ["🎈 Party supply stores", "party supply store"], ["🪟 Backdrop and props", "photo backdrop party supplies"]])}</details>
      <details class="card pt-card ss-swap" data-dk="sn" ${(off.open || {}).sn ? "open" : ""}><summary>🎅 Santa visit and photos</summary>
        <ol><li>Decide who plays Santa: a hired Santa, a team member or a volunteer.</li><li>Choose a 30-minute window and a photo spot with a chair and a simple backdrop.</li><li>Have a small gift or candy canes ready for each child or guest.</li><li>If children are there, get a parent's OK before photos are shared.</li><li>Use the photo booth set-up, or ask a coworker to take photos on their phone.</li></ol>
        <form class="org-ev-form" id="santaForm" autocomplete="off"><div class="org-addr-row"><label class="off-ob"><span>Santa arrives</span><input class="input" name="time" type="time" value="${esc(SN.time)}"></label><input class="input" name="who" maxlength="40" placeholder="Who is Santa?" value="${esc(SN.who)}"></div><button class="btn btn-green btn-block" type="submit">Save</button></form>
        ${offNear("Find a Santa", [["🎅 Santa for hire", "santa claus for hire"], ["📸 Event photographers", "event photographer"]])}</details>
      <div class="card pt-card"><h3>🧩 Team-building ideas</h3><p class="host-rem">For 5 to 20 people. Tap Add to put one in your plan.</p>
        ${TB_IDEAS.map(([n, m, c, how, sup]) => `<div class="tb-idea${TB.includes(n) ? " on" : ""}"><div class="tb-top"><b>${n}</b><span>${m} min · ${c}</span></div><p>${how}</p><small>You need: ${sup}</small><div class="of-acts"><button type="button" class="of-lnk${TB.includes(n) ? " of-done" : ""}" data-tbpick="${esc(n)}">${TB.includes(n) ? "✓ In my plan" : "Add to my plan"}</button></div></div>`).join("")}</div>`;
  }
  const offWEdoc = () => ({ title: "White elephant rules", css: OFF_PLAN_CSS + ` .pl ol{font-size:13pt;line-height:1.6} .pl li{margin:8px 0}`, html: `<div class="pl"><h1>White Elephant</h1><p class="pl-s">${esc(off.ev.name || "Holiday Party")}${+off.ev.giftLimit ? " · gift limit " + money(+off.ev.giftLimit) : ""}</p><ol>${WE_RULES.map(r => `<li>${r}</li>`).join("")}</ol></div>`, margin: 0.75, file: "White-Elephant-Rules" });
  const offPBdoc = () => ({ title: "Photo booth signs", css: OFF_PLAN_CSS + ` .pb{display:flex;flex-wrap:wrap;gap:12px} .pb div{width:46%;border:2px solid #B8935A;padding:26px 8px;text-align:center;font:600 20pt Georgia,serif;color:#1E3A2F}`, html: `<div class="pl"><h1>Photo Booth Signs</h1><p class="pl-s">Cut out and glue to sticks</p><div class="pb">${PB_SIGNS.map(t => `<div>${t}</div>`).join("")}</div></div>`, margin: 0.5, file: "Photo-Booth-Signs" });
  $("#view-office").addEventListener("toggle", e => { const d = e.target.closest && e.target.closest("[data-dk]"); if (d) { off.open = off.open || {}; off.open[d.dataset.dk] = d.open; saveOff(); } }, true);
  $("#view-office").addEventListener("click", e => {
    const t = e.target, again = () => { saveOff(); renderOffice(); renderCoDash(); };
    const tb = t.closest("[data-tbpick]"); if (tb) { const n = tb.dataset.tbpick, L = offTB(); off.tbPick = L.includes(n) ? L.filter(x => x !== n) : L.concat(n); off.acts.teamb = off.tbPick.length ? 1 : 0; again(); toast(off.tbPick.includes(n) ? "🧩 Added to your plan" : "Removed from your plan"); return; }
    const wd = t.closest("[data-wedel]"); if (wd) { const W = offWE(); W.players.splice(+wd.dataset.wedel, 1); W.order = null; again(); return; }
    if (t.closest("[data-wedraw]")) { const W = offWE(), a = W.players.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } W.order = a; off.acts.elephant = 1; again(); return; }
    if (t.closest("[data-weclear]")) { offWE().order = null; again(); return; }
    const pt = t.closest("[data-pbtick]"); if (pt) { offPB()[pt.dataset.pbtick] = pt.checked; saveOff(); return; }
  });
  $("#view-office").addEventListener("submit", e => {
    const f = e.target;
    if (f.id === "weForm") { e.preventDefault(); e.stopImmediatePropagation(); const n = f.n.value.trim(); if (n) { const W = offWE(); W.players.push(n); W.order = null; saveOff(); renderOffice(); } return; }
    if (f.id === "santaForm") { e.preventDefault(); e.stopImmediatePropagation(); off.santa = { time: f.time.value, who: f.who.value.trim() }; off.acts.santa = 1; saveOff(); renderOffice(); renderCoDash(); toast("🎅 Santa visit saved"); return; }
  }, true);

  // ---------- 📦 handover ----------
  function offHandoverHtml() {
    return offSurveyHtml() + `<div class="card pt-card"><h3>📝 Wrapping up</h3><p class="host-rem">Notes for next year's coordinator (even if that's you!).</p>
        <label class="off-f wide"><span class="meal-lab">👍 What worked</span><textarea class="input" rows="2" data-wrap="worked" maxlength="300" placeholder="e.g. Lunch-hour potluck was a hit; the awards got big laughs">${esc(off.wrap.worked || "")}</textarea></label>
        <label class="off-f wide"><span class="meal-lab">✏️ Change next time</span><textarea class="input" rows="2" data-wrap="change" maxlength="300" placeholder="e.g. Book the caterer by early November">${esc(off.wrap.change || "")}</textarea></label>
        <button type="button" class="btn btn-red btn-block" data-print="yearend" style="margin-top:10px">🖨️ Year-End Report for the boss</button></div>
      <div class="card pt-card"><h3>📦 Hand over the office plans</h3><p class="host-rem">Saves everything in the Office space (event, costs and vendors, approvals, potluck, awards, budget, notes) into one password-locked file. Email it to your boss or the next coordinator, or save it to the company's shared drive. Your Family space is never included.</p>
        <form class="org-ev-form" id="offExportForm" autocomplete="off"><input class="input" name="pw" type="password" minlength="4" maxlength="40" placeholder="Choose a password for the file (4+ characters)" autocomplete="new-password">
          <button class="btn btn-green btn-block" type="submit">📦 Save the handover file</button></form>
        <p class="host-rem">Share the password separately, for example by text. Without it, the file can't be opened.</p></div>
      <div class="card pt-card"><h3>📥 Open a handover file</h3><p class="host-rem">Got last year's file? Open it here to pick up where they left off. It replaces the office plans on this phone.</p>
        <label class="btn btn-ghost btn-block off-file">📂 Choose the file<input type="file" id="offImportFile" accept=".noel,application/octet-stream,text/plain,application/json" hidden></label></div>
      <div class="card pt-card"><h3>🧹 Start fresh or step away</h3>
        <button type="button" class="btn btn-ghost btn-block" id="offNewYear">🎄 Start next year's party (keeps vendors & last year's notes)</button>
        <button type="button" class="btn btn-ghost btn-block off-danger" id="offRemove" style="margin-top:8px">🗑️ Remove the office plans from this phone</button>
        <p class="host-rem">Removing only clears the Office space. Your Family space stays exactly as it is.</p></div>`;
  }
  function yearEndDoc() {
    const e = off.ev, T = budTotals(), total = offTotal(), hc = Math.max(1, +e.headcount || 1), a = off.appr;
    const css = `.ye{font:10.5pt/1.45 Georgia,serif;color:#222} .ye h1{font-size:22pt;margin:0;color:#1E3A2F} .ye .ye-s{color:#8a6d3b;font:600 8.5pt sans-serif;letter-spacing:.08em;text-transform:uppercase;margin:2px 0 12px}
      .ye h2{font-size:12.5pt;color:#1E3A2F;border-bottom:1.5px solid #B8935A;margin:14px 0 5px;padding-bottom:2px} .ye table{width:100%;border-collapse:collapse} .ye td,.ye th{padding:3px 6px;border-bottom:1px solid #e6e0d2;text-align:left;font-size:10pt} .ye th{background:#f4efe3;font:600 8pt sans-serif;text-transform:uppercase}
      .ye .num{text-align:right} .ye .ye-foot{margin-top:14px;text-align:center;color:#999;font:8pt sans-serif}`;
    const row = (k, v) => v ? `<tr><td style="width:150px"><b>${k}</b></td><td>${v}</td></tr>` : "";
    const html = `<div class="ye"><h1>${esc(e.name || "Holiday Party")}: Year-End Report</h1><p class="ye-s">${esc(family || "")}${family ? " · " : ""}${offYear()}</p>
      <table>${row("Organized by", esc(e.organizer))}${row("Date", e.date ? offDate(e.date) + (e.start ? `, ${offTime(e.start)}–${offTime(e.end)}` : "") : "")}${row("Venue", esc([e.venue, e.address].filter(Boolean).join(", ")))}${row("Guests", hc + " people" + (offWho() ? ` · ${offWho()[2]}` : ""))}${row("Theme / dress", esc([e.theme, e.dress].filter(Boolean).join(" · ")))}${row("Approval", a.status === "approved" ? `Approved by ${esc(e.approver || "")}${a.log.length ? " on " + new Date(a.log.filter(l => l.s === "approved").pop()?.at || Date.now()).toLocaleDateString() : ""}` : AP_TXT[a.status][1])}${row("What we did", esc(offActs().map(x => x.replace(/^\S+\s/, "")).join(", ")))}</table>
      <h2>Costs & vendors</h2><table><tr><th>What</th><th>Vendor</th><th>Contact</th><th class="num">Planned</th></tr>${off.costs.map(c => `<tr><td>${esc(c.type)}</td><td>${esc(c.name || "")}</td><td>${esc(c.contact || "")}</td><td class="num">${money(+c.cost || 0)}</td></tr>`).join("")}<tr><td colspan="3"><b>Planned total</b> (about ${money(Math.round(total / hc * 100) / 100)} per person)</td><td class="num"><b>${money(total)}</b></td></tr></table>
      ${T.spent ? `<h2>Actual spending</h2><table>${BUD_CATS.filter(([k]) => T.by[k]).map(([k, , l]) => `<tr><td>${l}</td><td class="num">${money(T.by[k])}</td></tr>`).join("")}<tr><td><b>Total spent</b>${+e.budget ? ` (budget ${money(+e.budget)})` : ""}</td><td class="num"><b>${money(T.spent)}</b></td></tr></table>` : ""}
      ${off.pot.length ? `<h2>Potluck</h2><p>${off.pot.map(p => `${esc(p.who)}: ${esc(p.dish)}`).join(" · ")}</p>` : ""}
      ${ssOn() && offSS().people.length ? `<h2>Secret Santa</h2><p>${offSS().people.length} people took part${+off.ev.giftLimit ? `, ${money(+off.ev.giftLimit)} limit` : ""}${ssDay() ? `, exchanged ${offDate(ssDay(), { month: "short", day: "numeric" })}` : ""}.</p>` : ""}
      ${offAuc().items.length ? `<h2>Silent auction</h2><table>${offAuc().items.map(i => `<tr><td>${esc(i.name)}${i.donor ? ` <small>(donated by ${esc(i.donor)})</small>` : ""}</td><td>${esc(i.winner || "")}</td><td class="num">${+i.bid ? money(+i.bid) : "—"}</td></tr>`).join("")}<tr><td colspan="2"><b>Total raised</b></td><td class="num"><b>${money(aucTotal())}</b></td></tr></table>` : ""}
      ${chRaised() ? `<h2>Charity</h2><p>Raised <b>${money(chRaised())}</b>${chChosen() ? ` for <b>${esc(chChosen().name)}</b>` : ""}${+offCh().goal ? ` (goal ${money(+offCh().goal)})` : ""}${offCh().drive.count ? ` · ${offCh().drive.count} ${esc(offCh().drive.unit || "items")} collected` : ""}.</p>` : ""}
      ${off.awards.some(x => x.w) ? `<h2>Silly Office Awards</h2><p>${off.awards.filter(x => x.w).map(x => `🏆 ${esc(x.t)}: <b>${esc(x.w)}</b>`).join("<br>")}</p>` : ""}
      ${offSurveyYE()}
      ${oyYearEndHtml()}
      <h2>Notes for next year</h2><p><b>What worked:</b> ${esc(off.wrap.worked || "—")}</p><p><b>Change next time:</b> ${esc(off.wrap.change || "—")}</p>
      <p class="ye-foot">Made with Noël Tier 1 Hub · Office Edition</p></div>`;
    return { title: "Year-End Report", css, html, margin: 0.5, file: "Office-Year-End-Report" };
  }
  // password-locked handover file (PBKDF2 → AES-GCM), made and opened on the phone
  async function offKey(pw, salt) {
    const base = await crypto.subtle.importKey("raw", new TextEncoder().encode(pw), "PBKDF2", false, ["deriveKey"]);
    return crypto.subtle.deriveKey({ name: "PBKDF2", hash: "SHA-256", salt, iterations: 200000 }, base, { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
  }
  const b64u = a => { let s = ""; for (let i = 0; i < a.length; i += 0x8000) s += String.fromCharCode.apply(null, a.subarray(i, i + 0x8000)); return btoa(s); };
  async function offExport(pw) {
    offSnapshotPast();
    const data = {}; NoelVault.keys().filter(k => k.startsWith(PREFIX)).forEach(k => { data[k.slice(PREFIX.length)] = NoelVault.getItem(k); });
    const payload = JSON.stringify({ app: "noel-office", v: 1, savedAt: Date.now(), by: off.ev.organizer || "", company: family || "", data });
    const salt = crypto.getRandomValues(new Uint8Array(16)), iv = crypto.getRandomValues(new Uint8Array(12));
    const ct = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv }, await offKey(pw, salt), new TextEncoder().encode(payload)));
    const file = JSON.stringify({ noel: "office-handover", v: 1, salt: b64u(salt), iv: b64u(iv), data: b64u(ct) });
    const name = `${(family || "Office").replace(/[^A-Za-z0-9]+/g, "-")}-Holiday-Handover-${offYear()}.noel`;
    return NoelMedia.share(new Blob([file], { type: "application/octet-stream" }), name, "Office holiday plans (handover file)");
  }
  async function offImport(text, pw) {
    const f = JSON.parse(text); if (f.noel !== "office-handover") throw new Error("not a handover file");
    const un = s => Uint8Array.from(atob(s), c => c.charCodeAt(0));
    const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv: un(f.iv) }, await offKey(pw, un(f.salt)), un(f.data));
    const p = JSON.parse(new TextDecoder().decode(plain)); if (p.app !== "noel-office") throw new Error("not a handover file");
    return p;
  }
  // a one-paragraph memory of this year, kept when handing over or starting fresh
  function offSnapshotPast() {
    const e = off.ev; if (!e.date && !off.costs.length) return;
    const y = offYear(), T = budTotals();
    off.past = off.past.filter(p => !(p.year === y && p.name === e.name)).concat({ year: y, name: e.name, organizer: e.organizer, date: e.date, headcount: e.headcount, spent: T.spent || offTotal(), worked: off.wrap.worked, change: off.wrap.change, vendors: off.costs.filter(c => c.name).map(c => ({ type: c.type, name: c.name, contact: c.contact })) });
    saveOff();
  }

  // ---------- follow-up reminder for the approval ----------
  const offReminders = () => {
    const a = off.appr, out = a.status === "sent" && a.sentAt ? [{ k: "follow" + a.sentAt, t: a.sentAt + a.followDays * 86400000, text: `No answer yet? Follow up with ${off.ev.approver || "your approver"} about the ${off.ev.name || "party"} plan.` }] : [];
    const day = ssDay(); if (ssOn() && day) { const t = new Date(day + "T10:00"); t.setDate(t.getDate() - 3); out.push({ k: "ss" + day, t: t.getTime(), text: `Secret Santa exchange is ${offDate(day, { weekday: "long", month: "short", day: "numeric" })}${+off.ev.giftLimit ? `. Limit ${money(+off.ev.giftLimit)}` : ""}. Remind the team!` }); }
    (off.chk || []).forEach(c => { if (c.done || !off.ev.date) return; const t = new Date(oyDue(c) + "T09:00").getTime(); if (t > Date.now() - 6 * 36e5) out.push({ k: "chk" + c.id, t, text: `${off.ev.name || "Event"}: ${c.t}` }); });
    oyMilestones(14).forEach(m => { const t = m.in <= 7 ? new Date(oyYmd(new Date()) + "T09:00").getTime() : new Date(oyAdd(oyYmd(m.dt), -7) + "T09:00").getTime(); out.push({ g: 1, k: "ms" + m.p.id + m.kind + m.dt.getFullYear(), t, text: m.kind === "bday" ? `${m.p.name}'s birthday is ${oyMsWhen(m).split(" · ")[0]}` : `${m.p.name}'s ${m.n}-year anniversary is ${oyMsWhen(m).split(" · ")[0]}` }); });
    return out;
  };
  function offSync() { if (SPACE === "office") NoelNative.scheduleList(9100, 9110, offReminders().filter(r => r.t > Date.now()).sort((a, b) => a.t - b.t).slice(0, 10).map(r => ({ t: r.t, title: "📨 " + r.text, body: "Noël Tier 1 Hub · Office" }))); }
  function offAlertItem(id) { if (!String(id).startsWith("off:")) return null; const r = offReminders().find(x => "off:" + x.k === id); return r ? { icon: "📨", name: r.text } : null; }
  if (SPACE === "office") setInterval(() => {
    const now = Date.now(), due = offReminders().filter(r => !off.fired[r.k] && !oy.fired[r.k] && r.t <= now); if (!due.length) return;
    due.forEach(r => { (r.g ? oy.fired : off.fired)[r.k] = 1; }); saveOff(); saveOy(); triggerAlert(due.map(r => ({ id: "off:" + r.k })));
  }, 15000);

  // ---------- taps & typing ----------
  $("#view-office").addEventListener("click", async e => {
    const t = e.target;
    const tb = t.closest("[data-oftab]"); if (tb) { off.tab = tb.dataset.oftab; saveOff(); renderOffice(); window.scrollTo({ top: 0 }); return; }
    const wh = t.closest("[data-ofwho]");
    if (wh) {
      const k = wh.dataset.ofwho; off.ev.who = k;
      if (k && off.ev.start === "17:00" && off.ev.end === "21:00") Object.assign(off.ev, { family: { start: "13:00", end: "16:00" }, partners: { start: "18:00", end: "23:00" }, staff: { start: "17:00", end: "21:00" } }[k]);
      if (k === "family") { off.acts.santavisit = 1; off.acts.kidcraft = 1; if (!off.ev.dress) off.ev.dress = "Festive & comfy"; }
      if (k === "partners" && !off.ev.dress) off.ev.dress = "Cocktail";
      document.body.classList.toggle("co-kids", k === "family"); saveOff(); renderOffice(); window.scrollTo({ top: 0 }); return;
    }
    const ac = t.closest("[data-ofact]"); if (ac) { off.acts[ac.dataset.ofact] = off.acts[ac.dataset.ofact] ? 0 : 1; saveOff(); renderOffice(); return; }
    const od = t.closest("[data-ocdone]"); if (od) { const c = off.costs.find(x => x.id === od.dataset.ocdone); if (c) { c.ordered = !c.ordered; saveOff(); renderOffice(); renderCoDash(); } return; }
    const cd = t.closest("[data-ocdel]"); if (cd) { off.costs = off.costs.filter(c => c.id !== cd.closest("[data-oc]").dataset.oc); saveOff(); renderOffice(); return; }
    const pd = t.closest("[data-opdel]"); if (pd) { off.pot = off.pot.filter(p => p.id !== pd.closest("[data-op]").dataset.op); saveOff(); renderOffice(); return; }
    const ad = t.closest("[data-awdel]"); if (ad) { off.awards = off.awards.filter(a => a.id !== ad.closest("[data-oa]").dataset.oa); saveOff(); renderOffice(); return; }
    const aa = t.closest("[data-awadd]"); if (aa) { off.awards.push({ id: uid(), t: aa.dataset.awadd, w: "" }); saveOff(); renderOffice(); return; }
    if (t.closest("#apEmail")) {
      const L = offLetter(off.appr.status === "changes");
      if (!off.ev.approverEmail) toast("📨 Add the approver's email above, or choose it in your email app");
      location.href = INVITE.mailHref(off.ev.approverEmail || "", L.subject, L.body); setTimeout(apMarkSent, 800); return;
    }
    if (t.closest("#apCopy")) { const L = offLetter(off.appr.status === "changes"); try { await navigator.clipboard.writeText(L.subject + "\n\n" + L.body); toast("📋 Copied! Paste it into an email or message"); } catch (err) { toast("Couldn't copy on this device"); } if (off.appr.status === "draft" || off.appr.status === "changes") setTimeout(() => { if (confirm("Mark the request as sent?")) apMarkSent(); }, 400); return; }
    const as = t.closest("[data-apset]"); if (as) { const note = as.dataset.apnote || ($("#apNote") || {}).value || ""; off.appr.status = as.dataset.apset; off.appr.log.push({ at: Date.now(), s: as.dataset.apset, note: note.trim() }); if (as.dataset.apset === "approved") offSavePlan(); off.tab = "plan"; saveOff(); offSync(); renderOffice(); toast(as.dataset.apset === "approved" ? "🎉 Approved! Your plan is ready" : "✏️ Noted. Update the plan, then send the new version"); return; }
    if (t.closest("#potShare")) { NoelMedia.share(new Blob([potText()], { type: "text/plain" }), "Potluck.txt", potText()).catch(() => {}); return; }
    if (t.closest("#offNewYear")) {
      if (!confirm("Start next year's party? This year's details are saved as \"Last year\" (with the vendors and your notes), then the event, approval, potluck and award winners are cleared.")) return;
      offSnapshotPast();
      Object.assign(off.ev, { date: "", headcount: off.ev.headcount, budget: 0, organizer: "", notes: "" }); off.costs = []; off.pot = []; off.awards.forEach(a => { a.w = ""; }); if (off.ss) { off.ss.pairs = null; off.ss.seen = {}; off.ss.mailed = {}; } if (off.auc) off.auc.items.forEach(i => { i.winner = ""; i.bid = 0; }); if (off.ch) { off.ch.donations = []; off.ch.options.forEach(o => { o.votes = 0; }); off.ch.drive.count = 0; } off.appr = { status: "draft", log: [], followDays: off.appr.followDays || 3 }; off.wrap = { worked: "", change: "" }; off.tab = "event";
      saveOff(); offSync(); renderOffice(); toast("🎄 Fresh start! Last year's notes are at the top"); return;
    }
    if (t.closest("#offRemove")) {
      if (!confirm("Remove all the office plans from this phone? Save a handover file first if anyone will need them.")) return;
      if (!confirm("Remove them now? This can't be undone.")) return;
      NoelVault.keys().filter(k => k.startsWith(PREFIX)).forEach(k => NoelVault.removeItem(k)); NoelNative.scheduleList(0, 19999, []);
      NoelVault.setItem("xmasHub_space", JSON.stringify("family")); try { await NoelVault.flush(); } catch (err) {} location.reload(); return;
    }
  });
  $("#view-office").addEventListener("change", async e => {
    const t = e.target;
    if (t.dataset.ev) { const k = t.dataset.ev; off.ev[k] = t.type === "number" ? Math.max(0, parseFloat(t.value) || 0) : t.value.trim(); saveOff(); if (["date", "headcount", "kids", "budget", "giftLimit"].includes(k) || off.tab === "approval") renderOffice(); return; }
    if (t.dataset.wrap) { off.wrap[t.dataset.wrap] = t.value.trim(); saveOff(); return; }
    if (t.dataset.aww != null) { const a = off.awards.find(x => x.id === t.closest("[data-oa]").dataset.oa); if (a) { a.w = t.value.trim(); saveOff(); } return; }
    if (t.id === "apFollow") { off.appr.followDays = +t.value; saveOff(); offSync(); renderOffice(); return; }
    if (t.id === "offImportFile" && t.files[0]) {
      const text = await t.files[0].text(); t.value = "";
      const pw = prompt("Password for this handover file:"); if (!pw) return;
      let p; try { p = await offImport(text, pw); } catch (err) { toast("🔒 That password didn't work, or it isn't a handover file"); return; }
      if (!confirm(`Open the office plans${p.by ? ` from ${p.by}` : ""}${p.company ? ` (${p.company})` : ""}, saved ${new Date(p.savedAt).toLocaleDateString()}? They replace the office plans on this phone.`)) return;
      NoelVault.keys().filter(k => k.startsWith(PREFIX)).forEach(k => NoelVault.removeItem(k));
      Object.entries(p.data).forEach(([k, v]) => NoelVault.setItem(PREFIX + k, v));
      try { await NoelVault.flush(); } catch (err) {} toast("📥 Opened! Loading the plans…"); setTimeout(() => location.reload(), 700);
    }
  });
  $("#view-office").addEventListener("submit", async e => {
    e.preventDefault(); const f = e.target;
    if (f.id === "offCostForm") { const c = parseFloat(f.cost.value) || 0; if (!c && !f.name.value.trim()) { toast("💵 Add an amount or a vendor"); return; } off.costs.push({ id: uid(), type: f.type.value, name: f.name.value.trim(), contact: f.contact.value.trim(), url: f.url.value.trim(), orderBy: f.orderBy.value, cost: c }); }
    if (f.id === "offPotForm") { const who = f.who.value.trim(), dish = f.dish.value.trim(); if (!who || !dish) { toast("🥘 Add a name and a dish"); return; } off.pot.push({ id: uid(), who, dish, cat: f.cat.value, diet: [...f.querySelectorAll("[name=diet]:checked")].map(x => x.value) }); }
    if (f.id === "offAwardForm") { const tt = f.t.value.trim(); if (!tt) return; off.awards.push({ id: uid(), t: tt, w: "" }); }
    if (f.id === "offExportForm") { const pw = f.pw.value; if (pw.length < 4) { toast("🔒 Use at least 4 characters"); return; } try { const r = await offExport(pw); if (r === "saved") toast("📦 Handover file saved to your downloads"); } catch (err) { toast("Couldn't make the file"); } f.pw.value = ""; renderOffice(); return; }
    saveOff(); renderOffice();
  });

  /* ---------- 🎅 SECRET SANTA (office only) ---------- */
  const offSS = () => (off.ss = off.ss || { on: 1, people: [], avoid: [], pairs: null, seen: {}, mailed: {}, day: "" });
  const ssOn = () => !!off.acts.gifts && offSS().on;
  const ssDay = () => offSS().day || off.ev.date || "";
  const ssName = id => (offSS().people.find(p => p.id === id) || {}).name || "?";
  function ssDraw() {
    const S = offSS(), ids = S.people.map(p => p.id), bad = (a, b) => a === b || S.avoid.some(([x, y]) => (x === a && y === b) || (x === b && y === a));
    for (let tries = 0; tries < 2000; tries++) {
      const r = ids.slice(); for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; }
      if (ids.every((g, i) => !bad(g, r[i]))) { const pairs = {}; ids.forEach((g, i) => { pairs[g] = r[i]; }); return pairs; }
    }
    return null;
  }
  const ssMsg = (g, forEmail) => { const S = offSS(), r = S.people.find(p => p.id === S.pairs[g]) || {}, giver = S.people.find(p => p.id === g) || {};
    return `Hi ${giver.name}! 🎅\n\nYou're the Secret Santa for: ${r.name}\n${r.hint ? `\nTheir wish hint: ${r.hint}\n` : ""}\nSpending limit: ${+off.ev.giftLimit ? money(+off.ev.giftLimit) : "see the organizer"}\nGift exchange: ${ssDay() ? offDate(ssDay(), { weekday: "long", month: "long", day: "numeric" }) : "to be announced"}\n\nShh, keep it a secret! 🤫${forEmail && off.ev.organizer ? `\n\n${off.ev.organizer}` : ""}`; };
  function offSantaHtml() {
    const S = offSS(), N = S.people.length, drawn = !!S.pairs;
    if (!off.acts.gifts) return `<div class="card pt-card"><p>Turn on <b>🎁 Gift exchange</b> on the 📋 Event tab to use Secret Santa.</p><button type="button" class="btn btn-green btn-block" data-ofact="gifts">🎁 Turn on the gift exchange</button></div>`;
    return `<div class="card pt-card"><div class="off-grid"><label class="off-f"><span class="meal-lab">Spending limit</span><input class="input" type="number" inputmode="decimal" min="0" data-ev="giftLimit" value="${esc(off.ev.giftLimit || "")}" placeholder="$"></label>
        <label class="off-f"><span class="meal-lab">Exchange day</span><input class="input" type="date" data-ss="day" value="${esc(ssDay())}"></label></div>
        <p class="host-rem">🔔 A reminder rings 3 days before the exchange.</p></div>
      <div class="card pt-card"><h3>👥 Who's in (${N})</h3>
        <ul class="host-list">${S.people.map(p => `<li data-ssp="${p.id}"><label><span><b>${esc(p.name)}</b>${p.email ? `<small>${esc(p.email)}</small>` : ""}${p.hint ? `<small>💡 ${esc(p.hint)}</small>` : ""}</span></label>${drawn ? (S.seen[p.id] ? `<span class="ss-ok">✓ seen</span>` : S.mailed[p.id] ? `<span class="ss-ok">✓ emailed</span>` : "") : `<button type="button" class="icon-btn" data-ssdel aria-label="Remove">✕</button>`}</li>`).join("") || `<li class="host-rem">Add everyone taking part.</li>`}</ul>
        ${drawn ? "" : `<form class="org-ev-form" id="ssAddForm" autocomplete="off"><div class="org-addr-row"><input class="input" name="name" maxlength="30" placeholder="Name"><input class="input" name="email" type="email" maxlength="60" placeholder="Email (optional)"></div>
          <input class="input" name="hint" maxlength="80" placeholder="Wish hint (optional), e.g. loves coffee, no candles"><button class="btn btn-green btn-block" type="submit">➕ Add</button></form>`}</div>
      ${!drawn && N > 2 ? `<div class="card pt-card"><h3>🚫 Don't pair these</h3><p class="host-rem">For example, a couple who both work here, or a manager and their direct report.</p>
        ${S.avoid.map((a, i) => `<p class="ss-avoid">${esc(ssName(a[0]))} ↔ ${esc(ssName(a[1]))} <button type="button" class="chip-x" data-ssunavoid="${i}" aria-label="Remove">✕</button></p>`).join("")}
        <div class="org-addr-row"><select class="input" id="ssA">${S.people.map(p => `<option value="${p.id}">${esc(p.name)}</option>`).join("")}</select><select class="input" id="ssB">${S.people.map((p, i) => `<option value="${p.id}" ${i === 1 ? "selected" : ""}>${esc(p.name)}</option>`).join("")}</select><button type="button" class="btn btn-ghost" id="ssAvoid">Add</button></div></div>` : ""}
      ${drawn ? `<div class="card pt-card ss-drawn"><h3>🎉 Names are drawn!</h3><p class="host-rem">The matches are hidden, even from you. Choose how everyone finds out:</p>
          <button type="button" class="btn btn-red btn-block" id="ssPass">📱 Pass the phone: each person taps their name</button>
          <button type="button" class="btn btn-ghost btn-block" data-print="ssslips" style="margin-top:8px">🖨️ Print folded secret slips</button>
          <details class="ss-mail"><summary>📧 Email each person</summary><p class="host-rem">Each email opens ready to send. Heads-up: you'll see their match as you send it.</p>
            ${S.people.map(p => `<button type="button" class="chip${S.mailed[p.id] ? " on" : ""}" data-ssmail="${p.id}" ${p.email ? "" : "disabled"}>${S.mailed[p.id] ? "✓ " : "✉️ "}${esc(p.name)}${p.email ? "" : " (no email)"}</button>`).join("")}</details>
          <div class="ss-tools"><button type="button" class="classy-link" id="ssPeek">👀 Peek at all matches</button><button type="button" class="classy-link" id="ssRedraw">↻ Draw again</button></div></div>`
        : `<button type="button" class="btn btn-red btn-block" id="ssDraw" ${N < 3 ? "disabled" : ""}>🎅 Draw the names${N < 3 ? " (3 or more people)" : ""}</button>`}
      <details class="card pt-card ss-swap"><summary>🎁 Prefer a White Elephant (Yankee Swap)? No draw needed</summary><ol>
        <li>Everyone brings one wrapped gift within the limit and puts it on the table.</li><li>Draw numbers to decide the order.</li><li>Person #1 opens a gift. Each next person either opens a new gift or <b>steals</b> one already opened.</li>
        <li>A gift can only be stolen twice, then it's "frozen" with its owner.</li><li>When someone is stolen from, they open a new gift or steal another (no stealing straight back).</li><li>Person #1 gets one last chance to swap at the end.</li></ol></details>`;
  }
  function ssSlipsDoc() {
    const S = offSS(); if (!S.pairs) return { error: "🎅 Draw the names first" };
    const css = `.slips{display:grid;grid-template-columns:1fr 1fr;gap:0} .slip{box-sizing:border-box;height:2.45in;border:1px dashed #aaa;display:grid;grid-template-rows:1fr 1fr;font-family:Georgia,serif;text-align:center;break-inside:avoid}
      .slip .s-out{display:flex;flex-direction:column;justify-content:center;border-bottom:1px dotted #bbb;font-size:14pt;color:#1E3A2F} .slip .s-out small{font:8pt sans-serif;color:#999}
      .slip .s-in{display:flex;flex-direction:column;justify-content:center;transform:rotate(180deg);font-size:10pt;color:#444;padding:0 10px} .slip .s-in b{font-size:15pt;color:#b3262e;display:block;margin:2px 0} .s-tip{font:9pt sans-serif;color:#777;margin:0 0 8px}`;
    return { noBrand: 1, title: "Secret Santa slips", css, margin: 0.4, file: "Secret-Santa-Slips", html: `<p class="s-tip">Cut along the dashed lines, fold on the dotted line so the writing is inside, and hand each person their slip. 🤫</p><div class="slips">${S.people.map(p => { const r = S.people.find(x => x.id === S.pairs[p.id]) || {};
      return `<div class="slip"><div class="s-out">🎅 For <b>${esc(p.name)}</b><small>only! Fold here</small></div><div class="s-in">You're Secret Santa for<b>${esc(r.name || "")}</b>${r.hint ? `💡 ${esc(r.hint)}<br>` : ""}${+off.ev.giftLimit ? `Limit ${money(+off.ev.giftLimit)}` : ""}${ssDay() ? ` · ${offDate(ssDay(), { month: "short", day: "numeric" })}` : ""}</div></div>`; }).join("")}</div>` };
  }
  // pass-the-phone reveal
  function ssPassOpen(step, id) {
    const S = offSS(), box = $("#ssReveal");
    if (step === "list") box.querySelector(".alert-box").innerHTML = `<div class="door-big">🎅</div><p class="door-type">Secret Santa</p><p class="door-text">Find your name and tap it. No peeking at anyone else's!</p>
      <div class="ss-names">${S.people.map(p => `<button type="button" class="chip${S.seen[p.id] ? " on" : ""}" data-ssme="${p.id}">${S.seen[p.id] ? "✓ " : ""}${esc(p.name)}</button>`).join("")}</div><button type="button" class="btn btn-ghost btn-block" data-ssclose style="margin-top:12px">Done</button>`;
    if (step === "ready") box.querySelector(".alert-box").innerHTML = `<div class="door-big">🤫</div><p class="door-text">${esc(ssName(id))}, is it really you?<br><small>Make sure nobody's looking!</small></p><button type="button" class="btn btn-red btn-block" data-ssshow="${id}">🎁 Show my match</button><button type="button" class="btn btn-ghost btn-block" data-sslist style="margin-top:8px">‹ Back</button>`;
    if (step === "show") { const r = S.people.find(x => x.id === S.pairs[id]) || {};
      box.querySelector(".alert-box").innerHTML = `<div class="door-big">🎅</div><p class="door-type">You're Secret Santa for</p><p class="ss-big">${esc(r.name || "")}</p>${r.hint ? `<p class="door-text" style="font-size:16px">💡 ${esc(r.hint)}</p>` : ""}<p class="host-rem">${+off.ev.giftLimit ? `Limit ${money(+off.ev.giftLimit)}` : ""}${ssDay() ? ` · Exchange ${offDate(ssDay(), { weekday: "short", month: "short", day: "numeric" })}` : ""}</p>
        <button type="button" class="btn btn-green btn-block" data-sshide="${id}">🙈 Hide it & pass the phone</button>`; }
    box.classList.add("show");
  }
  $("#ssReveal").addEventListener("click", e => {
    const t = e.target, S = offSS();
    const me = t.closest("[data-ssme]"); if (me) { ssPassOpen("ready", me.dataset.ssme); return; }
    const sh = t.closest("[data-ssshow]"); if (sh) { ssPassOpen("show", sh.dataset.ssshow); return; }
    const hd = t.closest("[data-sshide]"); if (hd) { S.seen[hd.dataset.sshide] = 1; saveOff(); ssPassOpen("list"); return; }
    if (t.closest("[data-sslist]")) { ssPassOpen("list"); return; }
    if (t.closest("[data-ssclose]")) { $("#ssReveal").classList.remove("show"); renderOffice(); }
  });

  /* ---------- 🔨 SILENT AUCTION ---------- */
  const offAuc = () => (off.auc = off.auc || { items: [], toCharity: 1 });
  const aucTotal = () => offAuc().items.reduce((a, i) => a + (+i.bid || 0), 0);
  function offAucHtml() {
    const A = offAuc();
    return `<div class="card pt-card"><p class="host-rem">Add the donated items, print a bid sheet for each one to set beside it, then type in the winning bids when bidding closes.</p>
        ${A.items.map(i => `<div class="auc-item" data-ai="${i.id}"><div class="host-row"><b>${esc(i.name)}</b><button type="button" class="icon-btn" data-aidel aria-label="Remove">✕</button></div>
          <small>${i.donor ? `Donated by ${esc(i.donor)} · ` : ""}${+i.value ? `Value ${money(+i.value)} · ` : ""}Starts at ${money(+i.start || 0)}, raise by ${money(+i.step || 1)}</small>
          <div class="org-addr-row"><input class="input" data-aiw="winner" maxlength="30" placeholder="Winner" value="${esc(i.winner || "")}"><input class="input" data-aiw="bid" type="number" inputmode="decimal" min="0" placeholder="Winning bid $" value="${+i.bid || ""}"></div></div>`).join("") || ""}
        <form class="org-ev-form" id="aucForm" autocomplete="off"><input class="input" name="name" maxlength="50" placeholder="Item, e.g. Gift basket, a day off, parking spot of the month">
          <input class="input" name="donor" maxlength="40" placeholder="Donated by (optional)">
          <div class="org-addr-row"><input class="input" name="value" type="number" inputmode="decimal" min="0" placeholder="Value $"><input class="input" name="start" type="number" inputmode="decimal" min="0" placeholder="Start bid $"><input class="input" name="step" type="number" inputmode="decimal" min="1" placeholder="Raise by $"></div>
          <button class="btn btn-green btn-block" type="submit">➕ Add item</button></form></div>
      ${A.items.length ? `<div class="card pt-card"><div class="org-total"><span>Total raised</span><b>${money(aucTotal())}</b></div>
        <label class="host-check"><input type="checkbox" id="aucToCh" ${A.toCharity ? "checked" : ""}> ⭐ Add the auction total to our charity total</label>
        <div class="send-btns" style="margin-top:10px"><button type="button" class="btn btn-red" data-print="bidsheets">🖨️ Print bid sheets</button>${A.items.some(i => i.winner) ? `<button type="button" class="btn btn-ghost" data-print="aucwinners">🏅 Winners list</button>` : ""}</div></div>` : ""}`;
  }
  function bidSheetsDoc() {
    const A = offAuc(); if (!A.items.length) return { error: "🔨 Add some auction items first" };
    const css = `.bs{break-after:page;font-family:Georgia,serif;color:#222} .bs:last-child{break-after:auto} .bs h1{font-size:26pt;margin:0;text-align:center;color:#1E3A2F} .bs .b-s{text-align:center;color:#8a6d3b;font:600 9pt sans-serif;letter-spacing:.1em;text-transform:uppercase;margin:4px 0 6px}
      .bs .b-m{text-align:center;font-size:11pt;margin:0 0 14px} .bs table{width:100%;border-collapse:collapse} .bs th{text-align:left;font:600 8.5pt sans-serif;text-transform:uppercase;border-bottom:2px solid #1E3A2F;padding:4px} .bs td{border-bottom:1px solid #bbb;height:30px;padding:2px 6px;font-size:11pt} .bs td.amt{width:22%;color:#999}`;
    return { title: "Silent auction bid sheets", css, margin: 0.5, file: "Bid-Sheets", html: A.items.map(i => { const st = +i.start || 0, sp = +i.step || 5;
      return `<div class="bs"><p class="b-s">Silent Auction · ${esc(off.ev.name || "Holiday Party")}</p><h1>${esc(i.name)}</h1><p class="b-m">${i.donor ? `Donated by ${esc(i.donor)} · ` : ""}${+i.value ? `Value ${money(+i.value)} · ` : ""}Starting bid <b>${money(st)}</b> · Raise by at least <b>${money(sp)}</b></p>
        <table><tr><th>Name</th><th>Phone or desk</th><th>Bid</th></tr>${Array.from({ length: 16 }, (_, k) => `<tr><td></td><td></td><td class="amt">${money(st + k * sp)}</td></tr>`).join("")}</table></div>`; }).join("") };
  }
  function aucWinnersDoc() {
    const A = offAuc(), won = A.items.filter(i => i.winner); if (!won.length) return { error: "🔨 Add the winners first" };
    const css = `.aw{font:11pt/1.45 Georgia,serif} .aw h1{font-size:20pt;margin:0 0 10px;color:#1E3A2F} .aw table{width:100%;border-collapse:collapse} .aw td,.aw th{padding:6px;border-bottom:1px solid #e3dccb;text-align:left} .aw .num{text-align:right}`;
    return { title: "Auction winners", css, margin: 0.6, file: "Auction-Winners", html: `<div class="aw"><h1>🔨 Silent Auction Winners</h1><table><tr><th>Item</th><th>Winner</th><th class="num">Bid</th></tr>${won.map(i => `<tr><td>${esc(i.name)}</td><td><b>${esc(i.winner)}</b></td><td class="num">${money(+i.bid || 0)}</td></tr>`).join("")}<tr><td colspan="2"><b>Total raised</b></td><td class="num"><b>${money(aucTotal())}</b></td></tr></table><p>Thank you to everyone who donated and bid! ⭐</p></div>` };
  }

  /* ---------- ⭐ CHARITY & DONATION DRIVE ---------- */
  const offCh = () => (off.ch = off.ch || { options: [], chosen: "", goal: 0, match: 0, donations: [], drive: { unit: "", count: 0, where: "" } });
  const chChosen = () => offCh().options.find(o => o.id === offCh().chosen);
  const chGiven = () => offCh().donations.reduce((a, d) => a + (+d.amt || 0), 0);
  const chRaised = () => { const C = offCh(), g = chGiven(); return g + Math.min(+C.match || 0, g) + (offAuc().toCharity ? aucTotal() : 0); };
  const offOpen = url => { if (!/^https?:\/\//.test(url)) url = "https://" + url; const br = NoelNative.plugin("Browser"); if (br) br.open({ url }).catch(() => window.open(url, "_blank")); else window.open(url, "_blank", "noopener"); };
  function chThermo(raised, goal) {
    const f = goal ? Math.min(1, raised / goal) : 0, H = 150, fill = Math.round((H - 20) * f);
    return `<svg viewBox="0 0 70 ${H + 40}" class="ch-thermo" role="img" aria-label="Raised ${money(raised)} of ${money(goal)}">
      <rect x="25" y="8" width="20" height="${H}" rx="10" fill="#f1e9d8" stroke="#d8c9a6"/><rect x="29" y="${8 + H - 14 - fill}" width="12" height="${fill + 14}" rx="6" fill="#c0392b"/>
      <circle cx="35" cy="${H + 18}" r="17" fill="#c0392b" stroke="#d8c9a6"/>${[0.25, 0.5, 0.75, 1].map(x => `<line x1="47" x2="54" y1="${8 + H - 14 - (H - 20) * x}" y2="${8 + H - 14 - (H - 20) * x}" stroke="#bfae86"/>`).join("")}</svg>`;
  }
  function offCharityHtml() {
    const C = offCh(), ch = chChosen(), raised = chRaised(), goal = +C.goal || 0, votes = C.options.reduce((a, o) => a + (o.votes || 0), 0);
    const top = C.options.slice().sort((a, b) => (b.votes || 0) - (a.votes || 0))[0];
    return `<div class="card pt-card ch-hero">${chThermo(raised, goal)}<div><p class="st-lab" style="margin:0">${ch ? `For ${esc(ch.name)}` : "Our charity drive"}</p><p class="ch-big">${money(raised)}</p><p class="host-rem">${goal ? `raised of our ${money(goal)} goal · ${Math.round(raised / goal * 100)}%` : "raised so far · set a goal below"}</p>
        ${ch && ch.url ? `<button type="button" class="btn btn-red" data-chopen="${esc(ch.url)}">⭐ Donate</button>` : ""}</div></div>
      <div class="card pt-card"><h3>🗳️ Let the team choose</h3><p class="host-rem">Add 2–4 charities, email the team to vote, then tap ＋ for each vote as replies come in.</p>
        ${C.options.map((o, i) => `<div class="ch-opt${C.chosen === o.id ? " on" : ""}" data-cho="${o.id}"><span class="ch-letter">${"ABCD"[i]}</span><div><b>${esc(o.name)}</b>${o.url ? `<small>${esc(o.url)}</small>` : ""}</div>
          <div class="stepper sm"><button type="button" data-chv="-1">−</button><output>${o.votes || 0}</output><button type="button" data-chv="1">+</button></div><button type="button" class="icon-btn" data-chdel aria-label="Remove">✕</button></div>`).join("")}
        ${C.options.length < 4 ? `<form class="org-ev-form" id="chOptForm" autocomplete="off"><input class="input" name="name" maxlength="50" placeholder="Charity name, e.g. Local food bank"><input class="input" name="url" maxlength="120" placeholder="Website or donation page (optional)"><button class="btn btn-green btn-block" type="submit">➕ Add charity</button></form>` : ""}
        ${C.options.length > 1 ? `<div class="send-btns" style="margin-top:10px"><button type="button" class="btn btn-ghost" id="chVoteMail">✉️ Email the team to vote</button>${votes ? `<button type="button" class="btn btn-green" data-chpick="${top.id}">🏆 Choose ${esc(top.name)}</button>` : ""}</div>` : ""}
        ${offNear("Find local causes near me", [["🥫 Food banks", "food bank"], ["🧸 Toy drives", "toy drive"], ["🐾 Animal shelters", "animal shelter"], ["🧥 Winter coat drives", "winter coat drive"], ["🏠 Women's shelters", "women's shelter"]])}
        <p class="host-rem">✅ Check a charity is registered: <button type="button" class="classy-link" data-chopen="${currency === "USD" ? "https://www.irs.gov/charities-non-profits/search-for-tax-exempt-organizations" : "https://www.canada.ca/en/revenue-agency/services/charities-giving/charities-listings.html"}">${currency === "USD" ? "IRS charity search" : "Canada Revenue Agency charity list"} ›</button></p></div>
      <div class="card pt-card"><h3>💵 Donations</h3><div class="off-grid"><label class="off-f"><span class="meal-lab">Goal</span><input class="input" type="number" inputmode="decimal" min="0" data-ch="goal" value="${+C.goal || ""}" placeholder="$"></label>
        <label class="off-f"><span class="meal-lab">Company matches up to</span><input class="input" type="number" inputmode="decimal" min="0" data-ch="match" value="${+C.match || ""}" placeholder="$"></label></div>
        <ul class="host-list" style="margin-top:8px">${C.donations.map(d => `<li data-chd="${d.id}"><label><span>${esc(d.who || "Anonymous")} · ${money(+d.amt || 0)}</span></label><button type="button" class="icon-btn" data-chddel aria-label="Remove">✕</button></li>`).join("")}</ul>
        <form class="org-addr-row" id="chDonForm" autocomplete="off" style="margin-top:8px"><input class="input" name="who" maxlength="30" placeholder="Name (or leave blank)"><input class="input" name="amt" type="number" inputmode="decimal" min="0" placeholder="$" style="max-width:90px"><button class="btn btn-green" type="submit">Add</button></form>
        <p class="host-rem">${+C.match ? `Company match: ${money(Math.min(+C.match, chGiven()))}. ` : ""}${offAuc().toCharity && aucTotal() ? `Auction: ${money(aucTotal())}.` : ""}</p></div>
      <div class="card pt-card"><h3>🥫 Food, toy or coat drive</h3><div class="off-grid"><label class="off-f"><span class="meal-lab">Collecting</span><input class="input" data-chd2="unit" maxlength="30" value="${esc(C.drive.unit || "")}" placeholder="e.g. cans, toys, coats"></label>
        <label class="off-f"><span class="meal-lab">Drop-off</span><input class="input" data-chd2="where" maxlength="60" value="${esc(C.drive.where || "")}" placeholder="e.g. Front desk box"></label></div>
        <div class="host-row" style="margin-top:10px"><span class="meal-lab">Collected</span><div class="stepper"><button type="button" data-chc="-1">−</button><output>${C.drive.count || 0}</output><button type="button" data-chc="1">+</button></div><button type="button" class="chip" data-chc="10">＋10</button></div></div>`;
  }
  function chVoteMail() {
    const C = offCh(), to = offSS().people.map(p => p.email).filter(Boolean).join(",");
    const body = `Hi team! ⭐\n\nThis year we'd like to give back together. Please help choose our holiday charity by replying with A${C.options.length > 1 ? `, B` : ""}${C.options.length > 2 ? `, C` : ""}${C.options.length > 3 ? ` or D` : ""}:\n\n${C.options.map((o, i) => `${"ABCD"[i]}. ${o.name}${o.url ? `\n   ${o.url}` : ""}`).join("\n\n")}\n\nPlease vote by ${new Date(Date.now() + 5 * 86400000).toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}. Thank you!${off.ev.organizer ? `\n\n${off.ev.organizer}` : ""}`;
    location.href = INVITE.mailHref("", "Help choose our holiday charity ⭐", body, to || undefined);
  }

  // ---------- taps for Secret Santa, Auction & Charity ----------
  $("#view-office").addEventListener("click", e => {
    const t = e.target, S = offSS(), A = offAuc(), C = offCh();
    const sd = t.closest("[data-ssdel]"); if (sd) { const id = sd.closest("[data-ssp]").dataset.ssp; S.people = S.people.filter(p => p.id !== id); S.avoid = S.avoid.filter(a => !a.includes(id)); saveOff(); renderOffice(); return; }
    const su = t.closest("[data-ssunavoid]"); if (su) { S.avoid.splice(+su.dataset.ssunavoid, 1); saveOff(); renderOffice(); return; }
    if (t.closest("#ssAvoid")) { const a = $("#ssA").value, b = $("#ssB").value; if (a === b) { toast("Pick two different people"); return; } S.avoid.push([a, b]); saveOff(); renderOffice(); return; }
    if (t.closest("#ssDraw") || t.closest("#ssRedraw")) {
      if (t.closest("#ssRedraw") && !confirm("Draw again? Everyone gets a new match, so anyone who already saw theirs will need to look again.")) return;
      const pairs = ssDraw(); if (!pairs) { toast("🎅 Those \"don't pair\" rules make a draw impossible. Remove one and try again"); return; }
      S.pairs = pairs; S.seen = {}; S.mailed = {}; saveOff(); offSync(); renderOffice(); toast("🎅 Names drawn! The matches are hidden"); return;
    }
    if (t.closest("#ssPass")) { ssPassOpen("list"); return; }
    if (t.closest("#ssPeek")) { if (!confirm("Peek at every match? It spoils the surprise for you!")) return; alert(S.people.map(p => `${p.name} → ${ssName(S.pairs[p.id])}`).join("\n")); return; }
    const sm = t.closest("[data-ssmail]"); if (sm) { const p = S.people.find(x => x.id === sm.dataset.ssmail); if (!p || !p.email) return; location.href = INVITE.mailHref(p.email, "🎅 Your Secret Santa match", ssMsg(p.id, true)); S.mailed[p.id] = 1; saveOff(); setTimeout(renderOffice, 600); return; }
    const ai = t.closest("[data-aidel]"); if (ai) { A.items = A.items.filter(i => i.id !== ai.closest("[data-ai]").dataset.ai); saveOff(); renderOffice(); return; }
    const co = t.closest("[data-chopen]"); if (co) { offOpen(co.dataset.chopen); return; }
    const mp = t.closest("[data-amap]"); if (mp) { openMapSearch(mp.dataset.amap); return; }
    const cv = t.closest("[data-chv]"); if (cv) { const o = C.options.find(x => x.id === cv.closest("[data-cho]").dataset.cho); o.votes = Math.max(0, (o.votes || 0) + +cv.dataset.chv); saveOff(); renderOffice(); return; }
    const cdl = t.closest("[data-chdel]"); if (cdl) { const id = cdl.closest("[data-cho]").dataset.cho; C.options = C.options.filter(o => o.id !== id); if (C.chosen === id) C.chosen = ""; saveOff(); renderOffice(); return; }
    const cp = t.closest("[data-chpick]"); if (cp) { C.chosen = cp.dataset.chpick; saveOff(); renderOffice(); toast("⭐ Charity chosen!"); return; }
    if (t.closest("#chVoteMail")) { chVoteMail(); return; }
    const dd = t.closest("[data-chddel]"); if (dd) { C.donations = C.donations.filter(d => d.id !== dd.closest("[data-chd]").dataset.chd); saveOff(); renderOffice(); return; }
    const cc = t.closest("[data-chc]"); if (cc) { C.drive.count = Math.max(0, (C.drive.count || 0) + +cc.dataset.chc); saveOff(); renderOffice(); return; }
  });
  $("#view-office").addEventListener("change", e => {
    const t = e.target, S = offSS(), A = offAuc(), C = offCh();
    if (t.dataset.ss === "day") { S.day = t.value; saveOff(); offSync(); return; }
    if (t.dataset.aiw) { const i = A.items.find(x => x.id === t.closest("[data-ai]").dataset.ai); i[t.dataset.aiw] = t.dataset.aiw === "bid" ? Math.max(0, parseFloat(t.value) || 0) : t.value.trim(); saveOff(); renderOffice(); return; }
    if (t.id === "aucToCh") { A.toCharity = t.checked ? 1 : 0; saveOff(); renderOffice(); return; }
    if (t.dataset.ch) { C[t.dataset.ch] = Math.max(0, parseFloat(t.value) || 0); saveOff(); renderOffice(); return; }
    if (t.dataset.chd2) { C.drive[t.dataset.chd2] = t.value.trim(); saveOff(); return; }
  });
  $("#view-office").addEventListener("submit", e => {
    const f = e.target, S = offSS(), A = offAuc(), C = offCh();
    if (f.id === "ssAddForm") { e.preventDefault(); e.stopImmediatePropagation(); const n = f.name.value.trim(); if (!n) return; S.people.push({ id: uid(), name: n, email: f.email.value.trim(), hint: f.hint.value.trim() }); saveOff(); renderOffice(); setTimeout(() => { const i = $("#ssAddForm [name=name]"); if (i) i.focus(); }, 50); return; }
    if (f.id === "aucForm") { e.preventDefault(); e.stopImmediatePropagation(); const n = f.name.value.trim(); if (!n) return; A.items.push({ id: uid(), name: n, donor: f.donor.value.trim(), value: parseFloat(f.value.value) || 0, start: parseFloat(f.start.value) || 0, step: parseFloat(f.step.value) || 5, winner: "", bid: 0 }); saveOff(); renderOffice(); return; }
    if (f.id === "chOptForm") { e.preventDefault(); e.stopImmediatePropagation(); const n = f.name.value.trim(); if (!n) return; C.options.push({ id: uid(), name: n, url: f.url.value.trim(), votes: 0 }); if (C.options.length === 1) C.chosen = C.options[0].id; saveOff(); renderOffice(); return; }
    if (f.id === "chDonForm") { e.preventDefault(); e.stopImmediatePropagation(); const a = parseFloat(f.amt.value) || 0; if (!a) return; C.donations.push({ id: uid(), who: f.who.value.trim(), amt: a }); saveOff(); renderOffice(); toast(`⭐ ${money(a)} added`); return; }
  }, true);

  /* ---------- 📍 WHERE: in the office, a rented venue, an outing or a home ---------- */
  // 📍 one-tap "find near me": opens the phone's own Maps app (Noël never sees the location)
  const offNear = (title, list, note) => `<div class="near-card"><p class="near-t">📍 ${title}</p><div class="near-btns">${list.map(([l, q]) => `<button type="button" class="near-btn" data-amap="${esc(q)}">${l}</button>`).join("")}</div>${note ? `<p class="host-rem" style="margin:6px 0 0">${note}</p>` : ""}</div>`;
  const OFF_WHERE = [
    ["office", "🏢", "In the office", "Cozy and personal, no venue costs.", [["🪑 Boardroom or meeting room", "Book the room, push the table to the wall for a buffet, and check how many people it holds."], ["🖥️ Around our desks", "Keep it relaxed: snacks on a shared table, each team decorates their pod, and a desk-hop for treats."], ["☕ Break room or kitchen", "Handy for food and fridge space. Plan a plug-in spot for slow cookers and a garbage station."], ["🛋️ Lobby or reception", "Great for mingling and photos. Put a sign on the door if clients might drop in."], ["🏬 The whole floor", "Spread out stations: food in one spot, games in another, a quiet corner for chatting."]]],
    ["venue", "🏛️", "Rent a venue", "More room, less clean-up. Best for bigger or family parties.", [["🍽️ Restaurant private room", "Ask about a set menu or appetizer package and the minimum spend."], ["🏛️ Banquet or community hall", "Lots of space for families. Check if outside food and decorations are allowed."], ["🏨 Hotel event room", "Catering, tables and clean-up are usually included."], ["🍺 Brewery, winery or café", "Relaxed and festive. Ask about non-alcoholic options and parking."]]],
    ["outing", "⛸️", "Team outing", "Get out of the office and do something together.", [["🎳 Bowling", "Book lanes and ask about a food package."], ["⛸️ Skating", "Check public skate times or rent the rink for an hour."], ["🔐 Escape room", "Split into teams of 4–6 and book back-to-back rooms."], ["🍳 Cooking or craft class", "Many studios host private group classes in December."], ["🍽️ Lunch or dinner out", "Reserve early. December fills up fast!"]]],
    ["home", "🏡", "Someone's home", "Warm and personal for small teams.", [["🏡 The boss's home", "Agree on parking, coats, kids and pets, and who helps clean up."], ["🏡 A team member's home", "Offer to cover food and supplies so it's not on the host."]]]
  ];
  const OFF_ASK = ["How many people does it hold (seated and standing)?", "Deposit, payment and cancellation policy?", "Is food included, or can we bring our own?", "Music, screen or microphone available?", "Parking and accessibility?", "Set-up and clean-up times?", "Is it kid-friendly? (family parties)"];
  function offWhereHtml() {
    const w = OFF_WHERE.find(x => x[0] === off.ev.where), hc = (+off.ev.headcount || 0) + (off.ev.who === "family" ? +off.ev.kids || 0 : 0);
    const hint = (!w || w[0] === "office" || w[0] === "home") && (hc > 25 || (off.ev.who === "family" && hc > 15)) ? `<p class="org-warn">With about ${hc} people${off.ev.who === "family" ? " including kids" : ""}, a rented room may be more comfortable. Most offices are snug past 25.</p>` : "";
    const spot = w && w[4].find(x => x[0] === off.ev.spot);
    return `<div class="card pt-card"><h3>📍 Where's the party?</h3>
        <div class="where-pick">${OFF_WHERE.map(([k, i, l, d]) => `<button type="button" class="who-tile${off.ev.where === k ? " on" : ""}" data-ofwhere="${k}"><span class="wt-ico">${i}</span><span><b>${l}</b><small>${d}</small></span></button>`).join("")}</div>
        ${hint}
        ${w ? `<p class="fill-lab">${w[0] === "office" ? "Where in the office?" : "What kind?"}</p><div class="apps-filters">${w[4].map(([l]) => `<button type="button" class="chip${off.ev.spot === l ? " on" : ""}" data-ofspot="${esc(l)}">${l}</button>`).join("")}</div>
          ${spot ? `<p class="where-tip">💡 ${spot[1]}</p>` : ""}
          ${w[0] === "venue" || w[0] === "outing" ? `${w[0] === "venue" ? offNear("Find a venue near me", [["🏛️ Event venues", "event venue"], ["🏛️ Banquet halls", "banquet hall"], ["🍽️ Restaurant private rooms", "restaurant with private room"], ["🏨 Hotel event rooms", "hotel event space"], ["🏘️ Community halls", "community hall rental"], ["🍺 Breweries & wineries", "brewery event space"]], "Opens your Maps app. Call two or three and compare using the questions below.")
              : offNear("Find an outing near me", [["🎳 Bowling", "bowling"], ["⛸️ Skating rinks", "skating rink"], ["🔐 Escape rooms", "escape room"], ["🍳 Cooking classes", "cooking class"], ["🎨 Paint & craft studios", "paint and sip studio"], ["🍽️ Restaurants for groups", "restaurant for large groups"]], "Ask about group rates and a food package.")}
            <details class="where-ask"><summary>✅ Questions to ask the venue</summary><ul class="host-list">${OFF_ASK.map((q, i) => `<li><label class="${(off.ask || {})[i] ? "on" : ""}"><input type="checkbox" data-ofask="${i}" ${(off.ask || {})[i] ? "checked" : ""}><span>${q}</span></label></li>`).join("")}</ul></details>` : ""}` : ""}</div>`;
  }

  /* ---------- 🍽️ FOOD: appetizers we make, catered, potluck or the venue ---------- */
  const OFF_FOOD = [["apps", "🍢", "Appetizers we make", "Pick the bites. Noël works out how many, the cost and the shopping list."], ["catered", "🍽️", "Catered or ordered in", "How much to order for your group."], ["potluck", "🥘", "Potluck", "Everyone brings something."], ["venue", "🍴", "The venue provides it", "Just note the menu and cost."]];
  const KID_APPS = ["Pigs in a Blanket", "Pinwheel Roll-Ups", "Veggie Cups", "Mini Sliders", "Cookie Platter", "Party Snack Mix", "Chocolate-Dipped Strawberries"];
  const OFF_DEFAULT_PICKS = ["Caprese Skewers", "Charcuterie Board", "Mini Sliders", "Spinach Artichoke Dip", "Pinwheel Roll-Ups", "Mini Cheesecake Bites"];
  const offFoodCfg = () => (off.food = off.food || { style: "", mode: "meal", picks: null, got: {} });
  function offPeople() { const a = Math.max(1, +off.ev.headcount || 1), k = off.ev.who === "family" ? Math.max(0, +off.ev.kids || 0) : 0; return { a, k, eq: a + k * 0.6, all: a + k }; }
  function offFoodPlan() {
    const F = offFoodCfg(), MD2 = window.NOEL_MEALS || {}, SHOP = MD2.appShop || {}, DR = MD2.drinkApps || [], P = offPeople();
    const all = (window.NOEL_APPS || []).map(r => r[1]);
    let picks = F.picks || (off.ev.who === "family" ? ["Pigs in a Blanket", "Pinwheel Roll-Ups", "Veggie Cups", "Mini Sliders", "Charcuterie Board", "Cookie Platter", "Sparkling Punch"] : OFF_DEFAULT_PICKS);
    picks = picks.filter(n => all.includes(n));
    const food = picks.filter(n => !DR.includes(n)), drinks = picks.filter(n => DR.includes(n));
    const per = F.mode === "meal" ? 12 : 5, total = Math.ceil(P.eq * per), each = food.length ? Math.ceil(total / food.length) : 0;
    const cost = (n, batches) => ((SHOP[n] || [0, []])[1].reduce((t, x) => t + (x[1] || 0), 0)) * batches * fx();
    const items = food.map(n => { const batch = (SHOP[n] || [24])[0], b = Math.max(1, Math.ceil(each / batch - 1e-9)); return { n, row: (window.NOEL_APPS || []).find(r => r[1] === n), pieces: each, b, cost: cost(n, b) }; });
    const dItems = drinks.map(n => { const batch = (SHOP[n] || [16])[0], b = Math.max(1, Math.ceil(P.all * 1.5 / batch - 1e-9)); return { n, row: (window.NOEL_APPS || []).find(r => r[1] === n), b, cost: cost(n, b) }; });
    return { P, picks, items, dItems, total, each, all, sum: items.concat(dItems).reduce((t, i) => t + i.cost, 0) };
  }

  /* ---------- 🥂 DRINKS POLICY: no alcohol or alcohol, decided with the boss, then built into the menu ---------- */
  const OFF_ALC = [["none", "🧃", "No alcohol", "Mocktails, cider, punch, coffee and tea"], ["yes", "🥂", "Alcohol served", "Wine, beer and bubbly, plus non-alcoholic choices"], ["", "❓", "Not decided yet", "Ask your boss or staff first"]];
  const OFF_ALC_ASK = "Quick question for the holiday party: should we serve alcohol, or keep it alcohol-free? Either way, I'll make sure there are plenty of non-alcoholic choices. Let me know what you'd like so I can plan the menu. Thank you!";
  function offAlcTiles() {
    return `<div class="who-pick">${OFF_ALC.map(([k, i, l, d]) => `<button type="button" class="who-tile${(off.ev.alcohol || "") === k ? " on" : ""}" data-ofalc="${k}"><span class="wt-ico">${i}</span><span><b>${l}</b><small>${d}</small></span></button>`).join("")}</div>`;
  }
  function offAlcCardHtml() {
    const a = off.ev.alcohol || "";
    return `<div class="card pt-card"><h3>🥂 Drinks at the party</h3><p class="host-rem">Will there be alcohol? Check with your boss or staff, then choose. Your drinks menu changes to match.</p>${offAlcTiles()}
      ${a === "" ? `<div class="off-ask"><p class="host-rem" style="margin:10px 0 6px"><b>Not sure?</b> Send this to your boss, HR or the planning team:</p><p class="off-quote">${esc(OFF_ALC_ASK)}</p>
        <div class="send-btns"><button type="button" class="btn btn-ghost" data-ofalcask="share">Send it</button><button type="button" class="btn btn-ghost" data-ofalcask="copy">Copy it</button></div></div>` : `<p class="host-rem" style="margin-top:10px">${a === "none" ? "Alcohol-free. Your menu has mocktails and warm drinks." : "Alcohol served. Your menu adds wine, beer and bubbly, and always keeps non-alcoholic choices."} Find it on the 🍽️ Food tab.</p>`}</div>`;
  }
  function offHours() {
    const s = off.ev.start, e = off.ev.end; if (!s || !e) return 3;
    const [a, b] = s.split(":").map(Number), [c, d] = e.split(":").map(Number); let m = c * 60 + d - (a * 60 + b); if (m <= 0) m += 1440;
    return Math.min(8, Math.max(1, Math.round(m / 60 * 2) / 2));
  }
  function offDrinksPlan(P) {
    const a = off.ev.alcohol || "", n = P.all, h = offHours(), c = Math.ceil, plural = (k, one, many) => `${k} ${k === 1 ? one : many}`;
    if (!a) return null;
    if (a === "none") return { mode: a, groups: [["Mocktails & cold drinks", [
        ["Sparkling Cranberry-Orange Punch", plural(c(n / 10), "batch", "batches") + " (about 16 cups each)"], ["Cucumber-Mint Lime Spritz (mocktail)", plural(c(n / 12), "pitcher", "pitchers")], ["Sparkling water and ginger ale", `${c(n * 1.2)} cans, mixed`]]],
      ["Warm drinks", [["Hot Spiced Apple Cider", plural(c(n / 12), "pot", "pots") + " (a slow cooker works well)"], ["Coffee and tea", plural(c(n / 8), "carafe", "carafes") + ", with tea bags, milk and sugar"]]]], tips: [] };
    const drinkers = c(P.a * 0.7), total = drinkers * (h + 1), wine = c(total * 0.5 / 5), beer = c(total * 0.3), bub = c(total * 0.2 / 6);
    return { mode: a, groups: [["Alcohol (a rough guide)", [
        ["Wine, red and white", `${plural(wine, "bottle", "bottles")} (5 glasses each)`], ["Beer, regular and light", `${beer} beers (about ${plural(c(beer / 6), "six-pack", "six-packs")})`], ["Sparkling wine for the toast", `${plural(bub, "bottle", "bottles")} (6 glasses each)`]]],
      ["Non-alcoholic choices (always have these)", [["Sparkling water, juice and ginger ale", `${c(n * 1.5)} cans, mixed`], ["Sparkling Cranberry-Orange Punch", plural(c(n / 12), "batch", "batches")], ["Coffee and tea", plural(c(n / 10), "carafe", "carafes")]]]],
      tips: ["Serve food all evening and keep water out.", "Drink tickets (two each) keep it comfortable.", "Plan safe rides home: a ride-share code or a taxi list.", "Check the venue's alcohol rules with HR first.", "Make it clear that having a drink is optional."], note: `Guide: about ${drinkers} drinkers, ${total} drinks over ${h} ${h === 1 ? "hour" : "hours"}.` };
  }
  function offDrinksHtml(P) {
    const D = offDrinksPlan(P);
    const head = `<div class="card pt-card"><h3>🥤 Drinks menu</h3>${offAlcTiles()}`;
    if (!D) return head + `<p class="host-rem" style="margin-top:10px">Choose No alcohol or Alcohol served and your drinks menu appears here. Not sure? Ask your boss or staff first. The question is on the 📋 Event tab.</p></div>`;
    return head + D.groups.map(([g, rows]) => `<h4 class="shop-dept">${g}</h4><ul class="cat-list">${rows.map(([n, q]) => `<li><b>${esc(n)}</b><span>${esc(q)}</span></li>`).join("")}</ul>`).join("") +
      (D.tips.length ? `<h4 class="shop-dept">Hosting tips</h4><ul class="cat-list">${D.tips.map(t => `<li><span>${esc(t)}</span></li>`).join("")}</ul>` : "") + (D.note ? `<p class="host-rem">${esc(D.note)}</p>` : "") + `</div>`;
  }
  function offFoodHtml() {
    const F = offFoodCfg(), P = offPeople();
    const pick = `<div class="card pt-card"><h3>🍽️ How are you feeding everyone?</h3><div class="who-pick">${OFF_FOOD.map(([k, i, l, d]) => `<button type="button" class="who-tile${F.style === k ? " on" : ""}" data-offood="${k}"><span class="wt-ico">${i}</span><span><b>${l}</b><small>${d}</small></span></button>`).join("")}</div></div>`;
    const ppl = `<p class="host-rem">For <b>${P.a} ${P.a === 1 ? "adult" : "adults"}</b>${P.k ? ` and <b>${P.k} kids</b> (kids count as a little over half a portion)` : ""}. Change the numbers on the 📋 Event tab.</p>`;
    if (!F.style) return pick;
    if (F.style === "potluck") return pick + `<div class="card pt-card">${ppl}<button type="button" class="btn btn-red btn-block" data-oftab="potluck">🥘 Open the potluck sign-ups ›</button></div>` + offSuppliesHtml(P);
    if (F.style === "venue") return pick + `<div class="card pt-card">${ppl}<p>Note the menu and price on the 📋 Event tab under <b>Costs &amp; vendors</b> (choose "Catering"), so it shows in the approval request.</p><p class="host-rem">💡 Ask about dietary options (vegetarian, gluten-free, nut allergies) and kids' meals${off.ev.who === "family" ? ", since kids are coming" : ""}.</p></div>`;
    if (F.style === "catered") {
      const A = P.a, K = P.k, pizzas = Math.ceil((A * 3 + K * 2) / 8), wraps = Math.ceil(A * 1.5 + K), salads = Math.max(1, Math.ceil(P.all / 12)), dessert = Math.ceil(P.all * 1.5), drinks = Math.ceil(P.all * 2.5);
      return pick + `<div class="card pt-card"><h3>📋 How much to order</h3>${ppl}<ul class="cat-list">
          <li><b>🍕 Pizza</b><span>${pizzas} large pizzas <small>(about 3 slices per adult, 2 per child)</small></span></li>
          <li><b>🥪 Sandwich or wrap platters</b><span>${wraps} pieces <small>(1½ per adult, 1 per child)</small></span></li>
          <li><b>🥗 Salads</b><span>${salads} large ${salads === 1 ? "bowl" : "bowls"} <small>(one per 12 people)</small></span></li>
          <li><b>🍰 Desserts</b><span>${dessert} pieces <small>(cookies, squares or cupcakes)</small></span></li>
          <li><b>🥤 Drinks</b><span>${drinks} drinks <small>(2–3 per person; add coffee and tea)</small></span></li></ul>
        <p class="host-rem">Choose one main (pizza or platters), not both, unless it's a long party. Order 1–2 weeks ahead in December, and ask for vegetarian and gluten-free portions.</p>${offDietLine()}
        <button type="button" class="btn btn-ghost btn-block" data-oftab="event">💵 Add the quote to Costs &amp; vendors ›</button></div>
        ${offDrinksHtml(P)}
        <div class="card pt-card">${offNear("Order from someone local", [["🍽️ Caterers", "catering"], ["🍕 Pizza delivery", "pizza delivery"], ["🥪 Sandwich & wrap platters", "sandwich platter catering"], ["🛒 Grocery store party platters", "grocery store party platters"], ["🧁 Bakeries", "bakery"], ["☕ Coffee for groups", "coffee catering"]], "Opens your Maps app with places near you. Most have menus and phone numbers right there.")}</div>` + offSuppliesHtml(P);
    }
    // 🍢 appetizers we make ourselves
    const X = offFoodPlan();
    return pick + `<div class="card pt-card"><div class="seg sub-tabs" role="group"><button type="button" data-offmode="light" aria-pressed="${F.mode !== "meal"}">Light bites (~5 each)</button><button type="button" data-offmode="meal" aria-pressed="${F.mode === "meal"}">Appetizers are the meal (~12)</button></div>${ppl}
        <p class="app-sum">🍢 <b>${X.items.length} appetizers</b> · about <b>${X.total} bites</b>${X.items.length ? ` (${X.each} of each)` : ""} · about <b>${cad0(X.sum)} ${currency}</b>, roughly ${cad(X.sum / Math.max(1, X.P.all))} per person</p></div>
      <div class="card pt-card"><h3>✨ Tap to choose</h3><p class="host-rem">${off.ev.who === "family" ? "⭐ marks kid favourites." : "Mix warm, cold and one sweet bite."}</p>
        <div class="apps-filters">${(window.NOEL_APPS || []).map(r => `<button type="button" class="chip${X.picks.includes(r[1]) ? " on" : ""}" data-offapp="${esc(r[1])}">${X.picks.includes(r[1]) ? "✓ " : ""}${r[0]} ${esc(r[1])}${off.ev.who === "family" && KID_APPS.includes(r[1]) ? " ⭐" : ""}</button>`).join("")}</div></div>
      ${X.items.length || X.dItems.length ? `<div class="card pt-card"><h3>🧾 Your menu</h3><ul class="cat-list">${X.items.map(i => `<li><b>${i.row[0]} ${esc(i.n)}</b><span>${i.pieces} pieces · ${i.b} ${i.b === 1 ? "batch" : "batches"} · ${cad(i.cost)}<small>💡 ${esc(i.row[3])}</small></span></li>`).join("")}${X.dItems.map(i => `<li><b>${i.row[0]} ${esc(i.n)}</b><span>${i.b} ${i.b === 1 ? "batch" : "batches"} · ${cad(i.cost)}</span></li>`).join("")}</ul>
        <div class="send-btns"><button type="button" class="btn btn-red" data-print="offfood">🖨️ Menu &amp; shopping list</button><button type="button" class="btn btn-ghost" id="offFoodCost">💵 Add ${cad0(X.sum)} to costs</button></div></div>` : ""}
      ${offDrinksHtml(X.P)}
      <div class="card pt-card">${offNear("Shop for it near me", [["🛒 Grocery stores", "grocery store"], ["📦 Warehouse & bulk stores", "warehouse club store"], ["🧁 Bakeries", "bakery"], ["🥤 Party supply stores", "party supply store"]], "Short on time? Grocery stores sell ready-made party platters too.")}</div>` + offSuppliesHtml(X.P);
  }
  // 🛒 one-tap shopping: pick a store, then tap what you need (opens that store's search)
  const OFF_SHOP = [["🍽️ Plates", "holiday party paper plates"], ["🧻 Napkins", "christmas party napkins"], ["🥤 Cups", "holiday party cups"], ["🍴 Cutlery", "disposable cutlery set"], ["🎄 Tablecloths", "christmas plastic tablecloths"], ["✨ Decorations", "christmas party decorations"], ["🎈 Balloons", "christmas balloons"], ["🏆 Prizes", "office party prizes"], ["🎁 Gift exchange gifts", "secret santa gifts under 25"], ["📸 Photo props", "christmas photo booth props"], ["🔥 Chafing dishes", "chafing dish buffet set"], ["🧊 Coolers & ice bins", "party ice bucket beverage tub"]];
  function offShopHtml() {
    const st = giStores(), cur = st.find(x => x[0] === off.store) || st[0];
    return `<div class="card pt-card"><h3>🛒 Buy party supplies online</h3><p class="host-rem">Pick a store, then tap what you need. It opens that store's search, great for ordering big-party supplies in bulk.</p>
      <div class="apps-filters">${st.map(([n]) => `<button type="button" class="chip${n === cur[0] ? " on" : ""}" data-ofstore="${esc(n)}">${esc(n)}</button>`).join("")}</div>
      <div class="apps-filters" style="margin-top:8px">${OFF_SHOP.map(([l, q]) => `<button type="button" class="chip fill-chip" data-ofbuy="${esc(q)}">${l}</button>`).join("")}</div>
      <p class="host-rem">Order early in December. Shipping slows down closer to the party.</p>
      ${offNear("Or pick it up today", [["🎈 Party supply stores", "party supply store"], ["💲 Dollar stores", "dollar store"]])}</div>`;
  }
  function offSuppliesHtml(P) {
    const n = P.all;
    return offShopHtml() + `<div class="card pt-card"><h3>🍽️ Plates, cups &amp; extras</h3><ul class="cat-list"><li><b>Plates</b><span>${Math.ceil(n * 1.5)} <small>(1½ per person)</small></span></li><li><b>Napkins</b><span>${n * 3}</span></li><li><b>Cups</b><span>${n * 3}</span></li><li><b>Cutlery sets</b><span>${n}</span></li><li><b>Ice</b><span>${Math.ceil(n / 8)} ${Math.ceil(n / 8) === 1 ? "bag" : "bags"}</span></li><li><b>Garbage &amp; recycling bags</b><span>a few, plus a labelled recycling bin</span></li></ul></div>`;
  }
  function offFoodDoc() {
    const X = offFoodPlan(), SHOP = (window.NOEL_MEALS || {}).appShop || {};
    if (!X.items.length && !X.dItems.length) return { error: "🍢 Pick some appetizers first" };
    const css = `.of{font:10.5pt/1.45 Georgia,serif;color:#222} .of h1{font-size:20pt;margin:0;color:#1E3A2F} .of .of-s{color:#8a6d3b;font:600 8.5pt sans-serif;letter-spacing:.08em;text-transform:uppercase;margin:2px 0 12px}
      .of h2{font-size:12.5pt;color:#1E3A2F;border-bottom:1.5px solid #B8935A;margin:14px 0 5px;padding-bottom:2px} .of table{width:100%;border-collapse:collapse} .of td,.of th{padding:4px 6px;border-bottom:1px solid #e6e0d2;text-align:left;font-size:10pt;vertical-align:top} .of th{background:#f4efe3;font:600 8pt sans-serif;text-transform:uppercase} .of ul{list-style:none;margin:0;padding:0;columns:2;column-gap:18px} .of li{margin:2px 0;break-inside:avoid}`;
    const html = `<div class="of"><h1>🍢 ${esc(off.ev.name || "Office Party")} Menu</h1><p class="of-s">${X.P.a} adults${X.P.k ? ` + ${X.P.k} kids` : ""} · about ${X.total} bites · about ${cad0(X.sum)} ${currency}</p>
      <h2>The menu</h2><table><tr><th>Appetizer</th><th>How many</th><th>Make ahead</th></tr>${X.items.map(i => `<tr><td><b>${esc(i.n)}</b></td><td>${i.pieces} pieces (${i.b} ${i.b === 1 ? "batch" : "batches"})</td><td>${esc(i.row[3])}</td></tr>`).join("")}${X.dItems.map(i => `<tr><td><b>${esc(i.n)}</b></td><td>${i.b} ${i.b === 1 ? "batch" : "batches"}</td><td>${esc(i.row[3])}</td></tr>`).join("")}</table>
      <h2>Shopping list</h2><ul>${X.items.concat(X.dItems).flatMap(i => (SHOP[i.n] || [0, []])[1].map(([t, pr]) => `<li>☐ ${i.b > 1 ? `<b>${i.b} ×</b> ` : ""}${esc(t)}${pr ? ` · ${cad(pr * i.b * fx())}` : ""} <small style="color:#999">(${esc(i.n)})</small></li>`)).join("")}</ul>
      ${(DD => DD ? `<h2>Drinks menu (${DD.mode === "none" ? "alcohol-free" : "alcohol served"})</h2>` + DD.groups.map(([g, rows]) => `<h3>${esc(g)}</h3><table>${rows.map(([n, q]) => `<tr><td><b>${esc(n)}</b></td><td>${esc(q)}</td></tr>`).join("")}</table>`).join("") + (DD.tips.length ? `<ul>${DD.tips.map(t => `<li>• ${esc(t)}</li>`).join("")}</ul>` : "") : "")(offDrinksPlan(X.P))}
      <h2>Plates, cups &amp; extras</h2><ul><li>☐ ${Math.ceil(X.P.all * 1.5)} plates</li><li>☐ ${X.P.all * 3} napkins</li><li>☐ ${X.P.all * 3} cups</li><li>☐ ${X.P.all} cutlery sets</li><li>☐ ${Math.ceil(X.P.all / 8)} bags of ice</li><li>☐ Garbage &amp; recycling bags</li></ul></div>`;
    return { title: "Office party menu & shopping list", css, html, margin: 0.5, file: "Office-Party-Menu" };
  }
  $("#view-office").addEventListener("click", e => {
    const t = e.target, F = offFoodCfg();
    const wh = t.closest("[data-ofwhere]"); if (wh) { off.ev.where = wh.dataset.ofwhere; off.ev.spot = ""; saveOff(); renderOffice(); return; }
    const sp = t.closest("[data-ofspot]"); if (sp) { off.ev.spot = sp.dataset.ofspot; const clean = sp.dataset.ofspot.replace(/^\S+\s/, ""); if (!off.ev.venue || OFF_WHERE.some(w => w[4].some(x => x[0].replace(/^\S+\s/, "") === off.ev.venue))) off.ev.venue = clean; saveOff(); renderOffice(); return; }
    const al = t.closest("[data-ofalc]"); if (al) { off.ev.alcohol = al.dataset.ofalc; saveOff(); renderOffice(); return; }
    const aq = t.closest("[data-ofalcask]"); if (aq) { (async () => { try { if (aq.dataset.ofalcask === "share" && navigator.share) { await navigator.share({ title: "Holiday party drinks", text: OFF_ALC_ASK }); return; } } catch (err) { if (err && err.name === "AbortError") return; } try { await navigator.clipboard.writeText(OFF_ALC_ASK); toast("Copied. Paste it into a message to your boss."); } catch (err) { toast("Couldn't copy the question"); } })(); return; }
    const fs = t.closest("[data-offood]"); if (fs) { F.style = fs.dataset.offood; if (F.style === "potluck") off.acts.potluck = 1; if (F.style === "catered") off.acts.catered = 1; saveOff(); renderOffice(); return; }
    const so = t.closest("[data-ofstore]"); if (so) { off.store = so.dataset.ofstore; saveOff(); renderOffice(); return; }
    const by = t.closest("[data-ofbuy]"); if (by) { const st = giStores(), cur = st.find(x => x[0] === off.store) || st[0]; openStore(cur[2](by.dataset.ofbuy)); return; }
    const fm = t.closest("[data-offmode]"); if (fm) { F.mode = fm.dataset.offmode; saveOff(); renderOffice(); return; }
    const fa = t.closest("[data-offapp]"); if (fa) { const X = offFoodPlan(), n = fa.dataset.offapp; F.picks = X.picks.includes(n) ? X.picks.filter(x => x !== n) : X.picks.concat(n); saveOff(); renderOffice(); return; }
    if (t.closest("#offFoodCost")) { const X = offFoodPlan(), ex = off.costs.find(c => c.auto === "food"); if (ex) ex.cost = Math.round(X.sum); else off.costs.push({ id: uid(), type: "Catering", name: "Homemade appetizers", contact: "", cost: Math.round(X.sum), auto: "food" }); saveOff(); toast(`💵 ${cad0(X.sum)} added to Costs & vendors`); return; }
  });
  $("#view-office").addEventListener("change", e => { const t = e.target; if (t.dataset.ofask != null) { off.ask = off.ask || {}; off.ask[t.dataset.ofask] = t.checked; saveOff(); t.closest("label").classList.toggle("on", t.checked); } });
  if (SPACE === "office") document.body.classList.toggle("co-kids", off.ev.who === "family");
  offSync();

  /* ---------- 📖 the Office menu: a quick first page, then "Start planning" opens the planner ---------- */
  const offHasWork = () => !!(off.ev.who || off.ev.date || off.costs.length || off.appr.status !== "draft" || (off.guests || []).length || (off.saved || []).length);
  let offScreen = offHasWork() ? "build" : "menu";
  function renderOffMenu() {
    const el = $("#offMenu"), v = $("#view-office"); if (!el) return;
    const on = offScreen === "menu"; v.classList.toggle("on-menu", on); el.hidden = !on; if (!on || el.dataset.built) return; el.dataset.built = "1";
    const go = `<button type="button" class="menu-go" data-offgo>Noël's plans <span>›</span></button>`, own = `<button type="button" class="menu-go menu-skip" data-offown>My own plans</button>`, dot = " <i>·</i> ";
    const blk = (n, b) => `<div class="menu-dish"><h4>${n}</h4>${b}</div><p class="menu-rule sm"><span></span>✦<span></span></p>`, line = x => `<p class="menu-items">${x}</p>`;
    const plain = l => l.replace(/^\S+\s/, "");
    el.innerHTML = `<div class="menu-top">${own}${go}</div>
      <p class="menu-star">✦</p><h2 class="menu-title">Office Events, All Year</h2><p class="menu-sub">Plan any event, get it approved and leave a tidy record for next year</p><p class="menu-rule"><span></span>✦<span></span></p>
      <h3 class="menu-group">All Year Long</h3>` +
      blk("A calendar of events", line(`Appreciation Day${dot}Summer BBQ${dot}Boss's Day${dot}Thanksgiving potluck${dot}Holiday party`) + `<p class="menu-sub2">Starter checklists, birthdays and anniversaries, and one yearly budget</p>`) +
      `<h3 class="menu-group">The Party</h3>` +
      blk("Who's invited", line(OFF_WHO.map(w => esc(w[2])).join(dot))) +
      blk("Where", line(`In the office${dot}Rent a venue${dot}Team outing${dot}Someone's home`)) +
      `<h3 class="menu-group">Food</h3>` +
      blk("Feed everyone", line(`Appetizers we make${dot}Catered or ordered in${dot}Potluck${dot}The venue provides it`) + `<p class="menu-sub2">Menu, amounts, cost and shopping list included</p>`) +
      `<h3 class="menu-group">Drinks</h3>` +
      blk("No alcohol", line(`Sparkling Cranberry-Orange Punch${dot}Cucumber-Mint Lime Spritz${dot}Hot Spiced Apple Cider${dot}Coffee and tea`)) +
      blk("Alcohol served", line(`Wine${dot}Beer${dot}Sparkling wine for the toast`) + `<p class="menu-drinks"><b>Always</b> non-alcoholic choices too</p><p class="menu-sub2">Not sure? We write the question to ask your boss</p>`) +
      `<h3 class="menu-group">Activities</h3>` +
      blk("Pick what's planned", line(OFF_ACTS.map(a => esc(plain(a[1]))).concat(["Secret Santa", "Silent auction"]).join(dot))) +
      `<h3 class="menu-group">Planning Tools</h3>` +
      blk("Behind the scenes", line(`Approval request for your boss${dot}Budget, costs and vendors${dot}Potluck sign-ups${dot}Printable menu and shopping list${dot}Handover file for next year's planner`)) +
      `<p class="menu-note">Everything you plan is saved and can be reviewed any time.</p>
      <div class="menu-bottom"><p class="menu-ready">Ready to plan your party?</p>${go}</div>`;
  }
  document.addEventListener("click", e => {
    if (e.target.closest && e.target.closest("[data-goview=office]")) { offScreen = offHasWork() ? "build" : "menu"; setTimeout(renderOffMenu, 0); }
  }, true);
  $("#view-office").addEventListener("click", e => {
    if (e.target.closest("[data-offown]")) { showView("own"); window.scrollTo(0, 0); return; }
    if (e.target.closest("[data-offgo]")) { offScreen = "build"; renderOffMenu(); window.scrollTo(0, 0); }
    if (e.target.closest("[data-offmenu]")) { offScreen = "menu"; renderOffMenu(); window.scrollTo(0, 0); }
  });
  /* @office-end */
