  /* ============================================================
     🏡 HOSTING & LOGISTICS (Family edition)
     Guests & arrivals · Rooms & sleeping · Table & seating (with
     printable place cards) · Deep-clean countdown · Host supplies ·
     House info card for guests · Helpful little reminders.
     Reminders are timed from the Christmas dinner in the Meal Planner
     (or Christmas Day at 5 PM if no dinner is planned).
     The "surprise" helpers are deliberately not listed on screen.
     ============================================================ */
  const HOST_ROOM_CHECKS = [["sheets", "Fresh sheets"], ["towels", "Towels"], ["blanket", "Extra blanket"], ["light", "Nightlight"], ["charger", "Phone charger"], ["wifi", "Wi-Fi card"], ["water", "Water glass"]];
  const HOST_CLEAN = [   // [id, days before dinner, task]
    ["entry", 14, "Declutter the entryway and make space for coats and boots"],
    ["bedding", 10, "Wash the guest bedding and towels"],
    ["oven", 7, "Clean the oven (before the big roast!)"],
    ["kitchen", 7, "Wipe down kitchen cabinets, counters and appliances"],
    ["living", 5, "Dust and vacuum the living and dining rooms"],
    ["fridge", 4, "Clean out the fridge to make room before the big grocery shop"],
    ["windows", 3, "Wash windows and mirrors"],
    ["silver", 3, "Polish serving dishes, silverware and glasses"],
    ["bath", 2, "Deep clean the guest bathroom: fresh soap, towels and extra toilet paper"],
    ["floors", 2, "Mop the floors"],
    ["tidy", 1, "Quick tidy-up; take out the garbage and recycling"],
    ["final", 0, "Final bathroom touch-up and fresh hand towels"]
  ];
  const HOST_SUPPLIES = [
    ["Gifts & wrapping", ["Wrapping paper", "Tape", "Gift tags and ribbon", "Scissors", "Gift bags and tissue paper"]],
    ["Just in case", ["Flashlight", "Batteries (AA, AAA, 9V, C)", "Extension cord", "First-aid kit and pain reliever", "Candles and a lighter", "Stain remover"]],
    ["Kitchen & table", ["Napkins", "Paper towels", "Foil and plastic wrap", "Containers for leftovers", "Dish soap and dishwasher pods", "Ice", "Coffee, tea and creamer"]],
    ["Bathroom & cleaning", ["Toilet paper", "Hand soap", "Garbage bags", "Recycling bags"]],
    ["For guests", ["Extra chairs", "Extra blankets and pillows", "Air mattress pump", "Phone chargers", "Coat hangers", "Kids' activities: colouring, puzzles, games"]]
  ];
  let host = load("hosting", null) || {
    remind: false, fired: {}, guests: [], clean: {}, supplies: {}, custom: [], tab: "away",
    rooms: [["Guest room", "🛏️", 2], ["Kids' room", "🧸", 2], ["Basement", "🛋️", 2], ["Couch", "🛋️", 1], ["Air mattress", "🌬️", 2]].map(([name, icon, beds]) => ({ id: uid(), name, icon, beds, ready: {} })),
    table: { shape: "rect", seats: 10, names: [], kids: false, kseats: 6, knames: [], style: "casual" },
    house: { wifi: "", pass: "", parking: "", rules: "", kids: "" }
  };
  host.trips = host.trips || []; host.out = host.out || { done: {}, custom: [] }; host.leave = host.leave || { done: {}, custom: [] };
  const HOST_LEAVE = [["alarm", "Turn on the house alarm"], ["appl", "Check all appliances are off (stove, oven, iron, coffee maker, space heaters)"], ["lock", "Lock every door and window"], ["heat", "Set the thermostat and turn off the lights"], ["trash", "Take out the garbage and empty the fridge of anything that will spoil"], ["mail", "Ask someone to collect the mail and check on the house"]];
  const HOST_OUT = [["test", "Test every string of lights before hanging"], ["buy", "Replace any burnt-out bulbs and buy what is missing"], ["cord", "Outdoor extension cord, timer and clips or hooks"], ["hang", "Hang the lights (roofline, trees, railings)"], ["deco", "Wreath, garland and other outdoor decorations"], ["plug", "Plug in and check the timer works"], ["walk", "Clear and light the walkway and steps"], ["porch", "Porch light and welcome mat ready for guests"]];
  host.who = host.who || {}; host.jobs = host.jobs || []; host.jobDone = host.jobDone || {};
  const HOST_JOBS = [   // jobs on the big day: [id, job, when]
    ["greet", "Greet guests and take coats", "As guests arrive"], ["drinks", "Pour drinks and refill glasses", "All evening"], ["kids", "Keep the kids busy (games, crafts, a movie)", "All day"],
    ["table", "Set the table", "Before dinner"], ["carve", "Carve the roast", "Dinner time"], ["serve", "Bring the dishes to the table", "Dinner time"],
    ["clear", "Clear the plates", "After dinner"], ["dessert", "Serve dessert and coffee", "After dinner"], ["wash", "Wash the dishes", "After dinner"],
    ["dry", "Dry and put away", "After dinner"], ["leftovers", "Pack up the leftovers", "After dinner"], ["garbage", "Take out the garbage and recycling", "End of the night"]
  ];
  const saveHost = () => save("hosting", host);
  const hostDinner = () => {   // the Christmas dinner time the reminders are built around
    const mp = mainDinnerPlan(); if (mp) return mp.at;
    const now = new Date(); let y = now.getFullYear(); if (now > new Date(y, 11, 25, 23)) y++;
    return new Date(y, 11, 25, 17, 0).getTime();
  };
  const atDay = (D, days, h, m = 0) => { const d = new Date(D); d.setDate(d.getDate() - days); d.setHours(h, m, 0, 0); return d.getTime(); };
  const hostFmt = t => new Date(t).toLocaleString(undefined, { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });

  // every reminder this page can ring: { k, t, icon, text }
  function hostReminders() {
    return [];   // no hosting alarms or nudges at all (cleaning countdown and helpers were scrapped)
    const D = hostDinner(), out = [], add = (k, t, icon, text) => out.push({ k, t, icon, text });
    // 🎁 the little surprise helpers
    add("s-phone1", atDay(D, 1, 21), "🔋", "Plug your phone in tonight so it's fully charged for the big day.");
    add("s-phone2", D - 6 * 3600000, "🔋", "Quick check: is your phone charged? Plug it in before the cooking starts.");
    add("s-batt", atDay(D, 3, 18), "🔋", "Batteries! Make sure you have the right ones for new toys and gadgets.");
    add("s-space", atDay(D, 2, 19), "📸", "Free up some space on your phone for all the Christmas photos.");
    add("s-smoke", atDay(D, 1, 11), "🚨", "Test the smoke alarm before the big cooking day.");
    add("s-ice", atDay(D, 1, 15), "🧊", "Fill the freezer with ice (or grab a bag on your way home).");
    add("s-dish", D - 4 * 3600000, "🍽️", "Run the dishwasher now so it's empty for the after-dinner dishes.");
    add("s-porch", D - 75 * 60000, "💡", "Porch light on and walkway clear for arriving guests.");
    add("s-photo", D - 2 * 60000, "📸", "Snap a photo of the table before anyone digs in!");
    // 🧽 deep-clean countdown
    HOST_CLEAN.forEach(([id, days, text]) => { if (!host.clean[id]) add("c-" + id, days ? atDay(D, days, 10) : D - 5 * 3600000, "🧽", text); });
    // 🛏️ rooms, 📦 supplies
    const firstGuest = host.guests.map(g => g.arrive ? new Date(g.arrive).getTime() : 0).filter(Boolean).sort((a, b) => a - b)[0];
    add("r-rooms", atDay(firstGuest || D, 1, 14), "🛏️", "Make up the guest rooms: fresh sheets, towels and a nightlight.");
    if (HOST_SUPPLIES.some(([, l]) => l.some(i => !host.supplies[i]))) add("p-check", atDay(D, 5, 10), "📦", "Check your host supplies list (tape, batteries, napkins…).");
    // ✈️ travel away: a nudge the evening before, and another three hours ahead
    host.trips.filter(x => x.k === "trip" && x.b).forEach(x => {
      const t = new Date(x.b).getTime(); if (!t) return;
      add("t1-" + x.id, atDay(t, 1, 18), "🧳", `Pack tonight and check in: ${x.a} leaves tomorrow at ${mclock(t)}.`);
      add("t2-" + x.id, t - 3 * 3600000, "✈️", `Time to head out: ${x.a} leaves at ${mclock(t)}.`);
    });
    host.trips.filter(x => x.k === "gtrip" && x.b).forEach(x => {
      const t = new Date(x.b).getTime(); if (!t) return;
      add("gt1-" + x.id, atDay(t, 1, 18), "🛬", `${x.a} arrives tomorrow at ${mclock(t)}. Who is picking them up?`);
      add("gt2-" + x.id, t - 90 * 60000, "🚗", `Time to leave to pick up ${x.a}, arriving ${mclock(t)}.`);
    });
    // 🚗 guests
    host.guests.forEach(g => {
      if (!g.arrive) return; const t = new Date(g.arrive).getTime();
      if (g.pickup) add("g-" + g.id, t - 60 * 60000, "🚗", `Leave to pick up ${g.name}${g.flight ? ` (flight ${g.flight})` : ""}, arriving ${mclock(t)}`);
      else add("g-" + g.id, t - 30 * 60000, "🚪", `${g.name} arrive${/ and |family|s$/i.test(g.name) ? "" : "s"} in about 30 minutes`);
    });
    out.forEach(r => { const sn = (host.snooze || {})[r.k]; if (sn) r.t = sn; });   // snoozed reminders ring again later
    return out.sort((a, b) => a.t - b.t);
  }
  function hostSnooze(ids) {
    host.snooze = host.snooze || {};
    ids.filter(id => String(id).startsWith("host:")).forEach(id => { const k = id.slice(5); host.snooze[k] = Date.now() + 300000; delete host.fired[k]; });
    saveHost(); hostSync();
  }
  function hostSync() {
    if (!NoelNative.isNative()) return;
    const items = host.remind ? hostReminders().filter(r => !host.fired[r.k] && r.t > Date.now()).map(r => ({ t: r.t, title: `${r.icon} ${r.text}`, body: "Noël Tier 1 Hub" })) : [];
    NoelNative.scheduleList(6000, 7000, items);
  }
  function hostTick() {
    if (!host.remind) return;
    const now = Date.now(), due = hostReminders().filter(r => !host.fired[r.k] && r.t <= now);
    if (!due.length) return;
    due.forEach(r => { host.fired[r.k] = 1; }); saveHost();
    const fresh = due.filter(r => now - r.t < 10 * 60000);
    if (fresh.length) triggerAlert(fresh.map(r => ({ id: "host:" + r.k })));
  }
  setInterval(hostTick, 15000);
  function hostAlertItem(id) {
    if (!String(id).startsWith("host:")) return null;
    const r = hostReminders().find(x => "host:" + x.k === id); return r ? { icon: r.icon, name: r.text } : null;
  }

  // ---------- screens ----------
  const HOST_TABS = [["away", "✈️ Travel plans"], ["guests", "🚗 Guests"], ["table", "🍽️ Table arrangement"], ["house", "📶 House info"], ["cards", "💌 Ecards & invites"]];
  const TASK_TABS = [["supplies", "📦 Supplies"], ["out", "💡 Outdoor & lights"]];   // these now live on the Tasks page
  function renderHost() {
    const fr = $("#hostFridge");
    if (fr) fr.innerHTML = (host.tab || "away") === "away"
      ? `<span class="hf-ico">✈️</span><span class="hf-txt"><b>Travel sheet</b><small>Flights and trains, guests' travel, pet care, passports and your leaving-home checklist, all on one printed page.</small></span><button type="button" class="btn btn-red" data-print="travel">🖨️ Print</button>`
      : `<span class="hf-ico">🧲</span><span class="hf-txt"><b>Fridge sheet</b><small>Travel plans, guests, seating, supplies and house info, all on one printed page.</small></span><button type="button" class="btn btn-red" data-print="fridge">🖨️ Print</button>`;
    const tab = HOST_TABS.some(x => x[0] === host.tab) ? host.tab : "away";
    $("#hostTabs").innerHTML = HOST_TABS.map(([k, l]) => `<button type="button" class="chip${k === tab ? " on" : ""}" data-htab="${k}">${l}</button>`).join("");
    if ($("#hostTaskBody")) $("#hostTaskBody").innerHTML = hostSuppliesHtml() + hostOutHtml();   // supplies and outdoor & lights run on below the checklist
    $("#hostBody").innerHTML = ({ guests: hostGuestsHtml, rooms: hostRoomsHtml, table: hostTableHtml, clean: hostCleanHtml, supplies: hostSuppliesHtml, house: hostHouseHtml, away: hostAwayHtml, out: hostOutHtml })[tab]();
  }
  const roomOpts = sel => `<option value="">Not staying over</option>` + host.rooms.map(r => `<option value="${r.id}" ${r.id === sel ? "selected" : ""}>${r.icon} ${esc(r.name)}</option>`).join("");
  function hostGuestsHtml() {
    return host.guests.map(g => `<div class="card host-card" data-hg="${g.id}">
        <div class="host-row"><b>${esc(g.name)}</b><span class="host-pill">${g.people || 1} ${(+g.people || 1) === 1 ? "person" : "people"}</span><button class="icon-btn" data-hdel="guest" aria-label="Remove">✕</button></div>
        <div class="host-grid">
          <label class="host-wide"><span class="meal-lab">Arriving</span><input class="input" type="datetime-local" data-hf="arrive" value="${g.arrive || ""}"></label>
          <label><span class="meal-lab">Leaving</span><input class="input" type="date" data-hf="leave" value="${g.leave || ""}"></label>
          <label><span class="meal-lab">Getting here</span><select class="input" data-hf="travel"><option value="drive" ${g.travel !== "fly" ? "selected" : ""}>🚗 Driving</option><option value="fly" ${g.travel === "fly" ? "selected" : ""}>✈️ Flying</option></select></label>
          <label><span class="meal-lab">People</span><input class="input" type="number" min="1" max="12" data-hf="people" value="${g.people || 1}"></label>
          ${g.travel === "fly" ? `<label><span class="meal-lab">Flight</span><input class="input" data-hf="flight" maxlength="12" value="${esc(g.flight || "")}" placeholder="e.g. AC 215"></label>` : ""}
          <label><span class="meal-lab">Sleeping</span><select class="input" data-hf="room">${roomOpts(g.room)}</select></label>
          <label class="host-check"><input type="checkbox" data-hf="pickup" ${g.pickup ? "checked" : ""}> Needs a pickup</label>
        </div>
        <input class="input host-notes" data-hf="notes" maxlength="120" value="${esc(g.notes || "")}" placeholder="Allergies, dietary needs, kids, pets…">
        ${g.arrive ? `<p class="host-rem">🔔 ${g.pickup ? "Pickup reminder 1 hour before" : "Heads-up 30 minutes before"} they arrive</p>` : ""}
      </div>`).join("") + `<form class="card add-task host-add" id="hostGuestForm" autocomplete="off"><h3>➕ Add a guest or family</h3>
        <div class="santa-kid-row"><input class="input" name="gname" maxlength="40" placeholder="e.g. Grandma & Grandpa" aria-label="Guest name"><button class="btn btn-green" type="submit">Add</button></div></form>`;
  }
  function hostRoomsHtml() {
    return host.rooms.map(r => {
      const who = host.guests.filter(g => g.room === r.id), used = who.reduce((a, g) => a + (+g.people || 1), 0), over = used > r.beds;
      const ready = HOST_ROOM_CHECKS.filter(([k]) => r.ready[k]).length;
      return `<div class="card host-card" data-hr="${r.id}">
        <div class="host-row"><span class="host-ico">${r.icon}</span><input class="input host-rname" data-hrf="name" value="${esc(r.name)}" aria-label="Room name"><button class="icon-btn" data-hdel="room" aria-label="Remove room">✕</button></div>
        <div class="host-row"><span class="meal-lab">Sleeps</span><div class="stepper sm"><button type="button" data-hbeds="-1">−</button><output>${r.beds}</output><button type="button" data-hbeds="1">+</button></div>
          <span class="host-pill ${over ? "over" : ""}">${used} of ${r.beds} ${over ? "· too many!" : "booked"}</span></div>
        <p class="host-who">${who.length ? "🛏️ " + who.map(g => esc(g.name)).join(", ") : "Nobody yet. Choose a room for each guest on the Guests tab."}</p>
        <div class="apps-filters">${HOST_ROOM_CHECKS.map(([k, l]) => `<button type="button" class="chip${r.ready[k] ? " on" : ""}" data-hready="${k}">${r.ready[k] ? "✓ " : ""}${l}</button>`).join("")}</div>
        <p class="host-rem">${ready === HOST_ROOM_CHECKS.length ? "✨ Ready for guests!" : `${ready} of ${HOST_ROOM_CHECKS.length} ready`}</p>
      </div>`; }).join("") + `<form class="card add-task host-add" id="hostRoomForm" autocomplete="off"><h3>➕ Add a room or bed</h3>
        <div class="santa-kid-row"><input class="input" name="rname" maxlength="30" placeholder="e.g. Pull-out sofa" aria-label="Room name"><button class="btn btn-green" type="submit">Add</button></div></form>`;
  }
  function seatsHtml(n, names, shape, prefix) {
    const pos = i => {
      if (shape === "round") { const a = -Math.PI / 2 + i * 2 * Math.PI / n; return `left:${50 + 42 * Math.cos(a)}%;top:${50 + 40 * Math.sin(a)}%`; }
      const side = Math.ceil(n / 2), top = i < side, j = top ? i : i - side, cnt = top ? side : n - side;
      return `left:${(j + 0.5) / cnt * 100}%;top:${top ? 8 : 92}%`;
    };
    return `<div class="seat-map ${shape}"><div class="seat-table">${shape === "round" ? "" : "Table"}</div>${Array.from({ length: n }, (_, i) => `<button type="button" class="seat${names[i] ? " named" : ""}" style="${pos(i)}" data-hseat="${prefix}${i}">${names[i] ? esc(names[i].split(" ")[0]) : i + 1}</button>`).join("")}</div>`;
  }
  function hostTableHtml() {
    const t = host.table, all = hostNames();
    return `<div class="card host-card">
        <div class="seg sub-tabs" role="group"><button type="button" data-hshape="rect" aria-pressed="${t.shape !== "round"}">▭ Long table</button><button type="button" data-hshape="round" aria-pressed="${t.shape === "round"}">◯ Round table</button></div>
        <div class="host-row" style="margin-top:10px"><span class="meal-lab">Seats</span><div class="stepper sm"><button type="button" data-hseats="-1">−</button><output>${t.seats}</output><button type="button" data-hseats="1">+</button></div></div>
        ${seatsHtml(t.seats, t.names, t.shape, "m")}
        <p class="host-rem">Tap a seat to type a name. Names from your guest list are suggested.</p>
        <label class="host-check"><input type="checkbox" id="hostKids" ${t.kids ? "checked" : ""}> Add a kids' table</label>
        ${t.kids ? `<div class="host-row"><span class="meal-lab">Kids' seats</span><div class="stepper sm"><button type="button" data-hkseats="-1">−</button><output>${t.kseats}</output><button type="button" data-hkseats="1">+</button></div></div>${seatsHtml(t.kseats, t.knames, "rect", "k")}` : ""}
        <p class="host-rem" style="margin-bottom:4px">Choose a card design. Your guests' names are printed on it.</p>
        <div class="pc-pick" role="group" aria-label="Place card design">${PC_DESIGNS.map(d => `<button type="button" class="pc-opt" data-hdesign="${d.id}" aria-pressed="${(t.design || "classic") === d.id}">${d.arts.length ? `<img src="${d.arts[0]}" alt="">` : `<b class="pc-cl">✦</b>`}<span>${esc(d.name)}</span></button>`).join("")}</div>
        <button type="button" class="btn btn-red btn-block" id="hostPlaceCards" data-print="place">🖨️ Print place cards</button>
        <datalist id="hostNameList">${all.map(n => `<option value="${esc(n)}">`).join("")}</datalist>
      </div>
      <div class="card host-card"><h3>🍴 How to set the table</h3>
        <div class="seg sub-tabs" role="group"><button type="button" data-hstyle="casual" aria-pressed="${t.style !== "formal"}">Casual</button><button type="button" data-hstyle="formal" aria-pressed="${t.style === "formal"}">Formal</button></div>
        ${tableSettingSvg(t.style === "formal")}
        <p class="host-rem">${t.style === "formal" ? "Forks on the left, knives (blade facing in) and spoons on the right. Use cutlery from the outside in. The dessert spoon and fork sit above the plate." : "Fork on the left, knife (blade facing the plate) and spoon on the right, glass above the knife, napkin on the plate or under the fork."}</p></div>`;
  }
  function tableSettingSvg(formal) {
    const L = (x, y, t) => `<text x="${x}" y="${y}" font-size="9" text-anchor="middle" fill="#6b7a70">${t}</text>`;
    const fork = x => `<rect x="${x}" y="70" width="4" height="56" rx="2" fill="#B8935A"/><rect x="${x - 3}" y="62" width="10" height="14" rx="2" fill="#B8935A"/>`;
    const knife = x => `<rect x="${x}" y="62" width="5" height="64" rx="2.5" fill="#9aa7a0"/>`;
    const spoon = x => `<rect x="${x + 1}" y="74" width="3" height="52" rx="1.5" fill="#9aa7a0"/><ellipse cx="${x + 2.5}" cy="68" rx="5" ry="8" fill="#9aa7a0"/>`;
    const glass = (x, y) => `<circle cx="${x}" cy="${y}" r="9" fill="none" stroke="#7fa6c9" stroke-width="2"/>`;
    return `<svg viewBox="0 0 300 150" class="set-svg" role="img" aria-label="Table setting diagram">
      <circle cx="150" cy="95" r="38" fill="#fff" stroke="#e9e0cd" stroke-width="3"/><circle cx="150" cy="95" r="26" fill="none" stroke="#e9e0cd"/>
      ${formal ? `<rect x="118" y="46" width="64" height="9" rx="4" fill="#f4efe3"/>${fork(70)}${fork(88)}${knife(200)}${spoon(216)}${spoon(232)}${glass(205, 38)}${glass(226, 30)}${glass(246, 40)}<circle cx="78" cy="40" r="12" fill="none" stroke="#e9e0cd" stroke-width="2"/>
        ${L(79, 140, "Salad · Dinner fork")}${L(222, 140, "Knife · Spoons")}${L(226, 14, "Water · Wine glasses")}${L(150, 40, "Dessert")}${L(78, 22, "Bread plate")}`
      : `<rect x="54" y="78" width="30" height="34" rx="3" fill="#f4efe3"/>${fork(88)}${knife(200)}${spoon(216)}${glass(205, 42)}${L(80, 140, "Napkin · Fork")}${L(212, 140, "Knife · Spoon")}${L(205, 24, "Glass")}`}
      ${L(150, 147, "Plate")}</svg>`;
  }
  function hostNames() {
    const n = new Set(host.guests.map(g => g.name)); gifts.people.forEach(p => n.add(p.name));
    if (family) n.add(familyTitle(family));
    return [...n].filter(Boolean);
  }
  const whoIn = (key, label) => `<input class="input who-in" data-hwho="${key}" list="hostWhoList" maxlength="24" placeholder="Who?" value="${esc(host.who[key] || "")}" aria-label="Who does ${esc(label)}">`;
  const whoNames = () => [...new Set(hostNames().concat(typeof org !== "undefined" ? org.members.map(m => m.name) : []))];
  function hostCleanHtml() {
    const D = hostDinner(), done = HOST_CLEAN.filter(([id]) => host.clean[id]).length;
    const jobs = HOST_JOBS.map(([id, text, when]) => ({ id, text, when })).concat(host.jobs.map(j => Object.assign({ mine: true }, j)));
    return `<div class="card host-card"><h3>🧽 Deep-clean countdown</h3><p class="host-rem">${done} of ${HOST_CLEAN.length} done · spread over the two weeks before dinner${host.remind ? ". Each one rings a reminder on its day." : "."} Type a name in <b>Who?</b> to share the jobs out.</p>
      <ul class="host-list chore-list">${HOST_CLEAN.map(([id, days, text]) => `<li><label class="${host.clean[id] ? "on" : ""}"><input type="checkbox" data-hclean="${id}" ${host.clean[id] ? "checked" : ""}><span>${esc(text)}<small>${days ? new Date(atDay(D, days, 10)).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" }) : "The morning of"}</small></span></label>${whoIn("c:" + id, text)}</li>`).join("")}</ul></div>
      <div class="card host-card"><h3>🙋 Jobs on the big day</h3><p class="host-rem">Many hands make light work! Leave a job blank and it prints with a line to write a name in.</p>
      <ul class="host-list chore-list">${jobs.map(j => `<li data-hjob="${j.id}"><label class="${host.jobDone[j.id] ? "on" : ""}"><input type="checkbox" data-hjobdone="${j.id}" ${host.jobDone[j.id] ? "checked" : ""}><span>${esc(j.text)}${j.when ? `<small>${esc(j.when)}</small>` : ""}</span></label>${whoIn("j:" + j.id, j.text)}${j.mine ? `<button type="button" class="icon-btn" data-hdeljob aria-label="Remove">✕</button>` : ""}</li>`).join("")}</ul>
      <form class="org-ev-form" id="hostJobForm" autocomplete="off"><div class="org-addr-row"><input class="input" name="job" maxlength="50" placeholder="Add a chore, e.g. Walk the dog" aria-label="Chore"><input class="input" name="when" maxlength="24" placeholder="When (optional)" aria-label="When"></div><button class="btn btn-green btn-block" type="submit">➕ Add chore</button></form></div>
      <div class="card host-fridge"><span class="hf-ico">📋</span><span class="hf-txt"><b>Chore chart</b><small>Every chore with who's doing it and a tick box. Blank names print as a line to fill in.</small></span><button type="button" class="btn btn-red" data-print="chores">🖨️ Print</button></div>
      <datalist id="hostWhoList">${whoNames().map(n => `<option value="${esc(n)}">`).join("")}</datalist>`;
  }
  function choresDoc() {
    const D = hostDinner(), day = t => new Date(t).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
    const who = k => host.who[k] ? esc(host.who[k]) : "";
    const row = (text, when, k, done) => `<tr><td class="ch-box">${done ? "☑" : "☐"}</td><td>${esc(text)}</td><td class="ch-when">${esc(when)}</td><td class="ch-who">${who(k)}</td></tr>`;
    const css = `.ch{font:11pt/1.4 Georgia,serif;color:#222} .ch h1{font-size:22pt;margin:0;color:#1E3A2F} .ch .ch-sub{margin:2px 0 12px;color:#8a6d3b;font:600 8.5pt sans-serif;letter-spacing:.08em;text-transform:uppercase}
      .ch h2{font-size:13pt;color:#1E3A2F;border-bottom:1.5px solid #B8935A;margin:16px 0 4px;padding-bottom:2px} .ch table{border-collapse:collapse;width:100%}
      .ch th{text-align:left;background:#f4efe3;font:600 8pt sans-serif;text-transform:uppercase;letter-spacing:.06em;padding:4px 6px} .ch td{padding:7px 6px;border-bottom:1px solid #e3dccb;vertical-align:bottom}
      .ch .ch-box{width:18px;font-size:13pt} .ch .ch-when{width:120px;color:#666;font-size:9.5pt} .ch .ch-who{width:150px;border-bottom:2px solid #555;font-weight:bold;color:#1E3A2F} .ch .ch-foot{margin-top:16px;text-align:center;color:#999;font:8pt sans-serif}`;
    const head = `<tr><th></th><th>Chore</th><th>When</th><th>Who</th></tr>`;
    const html = `<div class="ch"><h1>📋 Holiday Chore Chart</h1><p class="ch-sub">Many hands make light work · dinner ${esc(hostFmt(D))}</p>
      <h2>Deep-clean countdown</h2><table>${head}${HOST_CLEAN.map(([id, days, text]) => row(text, days ? day(atDay(D, days, 10)) : "Dinner day", "c:" + id, host.clean[id])).join("")}</table>
      <h2>Jobs on the big day</h2><table>${head}${HOST_JOBS.map(([id, text, when]) => row(text, when, "j:" + id, host.jobDone[id])).join("")}${host.jobs.map(j => row(j.text, j.when || "", "j:" + j.id, host.jobDone[j.id])).join("")}</table>
      <p class="ch-foot">Made with Noël Tier 1 Hub</p></div>`;
    return { title: "Holiday chore chart", css, html, margin: 0.5, file: "Holiday-Chore-Chart" };
  }
  function hostSuppliesHtml() {
    const all = HOST_SUPPLIES.flatMap(([, l]) => l).concat(host.custom), have = all.filter(i => host.supplies[i]).length;
    return `<div class="card host-card"><p class="host-rem">${have} of ${all.length} ready</p>${HOST_SUPPLIES.concat(host.custom.length ? [["Your extras", host.custom]] : []).map(([sec, items]) => `<h4 class="shop-dept">${esc(sec)}</h4><ul class="host-list">${items.map(i => `<li><label class="${host.supplies[i] ? "on" : ""}"><input type="checkbox" data-hsup="${esc(i)}" ${host.supplies[i] ? "checked" : ""}><span>${esc(i)}</span></label></li>`).join("")}</ul>`).join("")}
      <form class="santa-kid-row" id="hostSupForm" autocomplete="off" style="margin-top:12px"><input class="input" name="sup" maxlength="40" placeholder="Add your own item" aria-label="Add your own item"><button class="btn btn-green" type="submit">Add</button></form></div>`;
  }
  const AWAY = [
    ["trip", "✈️", "Flights & trains", "Where to · which flight or train", "e.g. Toronto, AC 215", "datetime-local", "Leaves"],
    ["gtrip", "🛬", "Guests' travel", "Guest · flight or train", "e.g. Grandma, AC 215", "datetime-local", "Arrives"],
    ["pet", "🐾", "Pet care", "Pet", "e.g. Max the dog", "text", "Who is looking after them"],
    ["pass", "🛂", "Passports", "Whose passport", "e.g. Mum", "date", "Expires"],
    ["other", "🧳", "Other", "What else do you need", "e.g. Hotel, car rental, travel insurance", "text", "Details (optional)"]
  ];
  function hostAwayHtml() {
    return AWAY.map(([k, ico, title, l1, ph, t2, l2]) => {
      const items = host.trips.filter(x => x.k === k);
      const fmt = x => (k === "trip" || k === "gtrip") && x.b ? (k === "gtrip" ? "arrives " : "") + new Date(x.b).toLocaleString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) : k === "pass" && x.b ? "expires " + x.b : x.b || "";
      const warn = x => k === "pass" && x.b && new Date(x.b).getTime() < Date.now() + 183 * 864e5 ? ` <b class="host-pill over">${new Date(x.b).getTime() < Date.now() ? "expired" : "renew soon"}</b>` : "";
      return `<div class="card host-card"><h3>${ico} ${title}</h3>${k === "gtrip" ? `<p class="host-rem">Guests flying or taking the train to you? Add them here and Noël will put their arrival in your calendar, with a reminder to pick them up.</p>` : ""}${k === "trip" ? `<p class="host-rem">If travelling before your Christmas home plans, Noël will add your travel dates, with reminders, to your calendar.</p>` : ""}
        ${items.length ? `<ul class="host-list">${items.map(x => `<li data-htrip="${x.id}"><span><b>${esc(x.a)}</b>${x.b ? `<small>${esc(fmt(x))}</small>` : ""}${warn(x)}</span><button type="button" class="icon-btn" data-hdeltrip aria-label="Remove">✕</button></li>`).join("")}</ul>` : `<p class="host-rem">Nothing added yet.</p>`}
        <form class="host-away-form" data-htripform="${k}" autocomplete="off">
          <label><span class="meal-lab">${l1}</span><input class="input" name="a" maxlength="60" placeholder="${ph}" required></label>
          <label><span class="meal-lab">${l2}</span><input class="input" name="b" type="${t2}" ${t2 === "text" ? 'maxlength="60"' : ""}></label>
          <button class="btn btn-green btn-block" type="submit">Add</button></form></div>`;
    }).join("") + hostLeaveHtml();
  }
  function hostLeaveHtml() {
    const all = HOST_LEAVE.concat(host.leave.custom.map(c => [c.id, c.text, 1])), n = all.filter(([k]) => host.leave.done[k]).length;
    return `<div class="card host-card"><h3>🔑 Before you leave home</h3><p class="host-rem">${n} of ${all.length} done. Tick each one on your way out the door.</p>
      <ul class="host-list chore-list">${all.map(([k, t, mine]) => `<li><label class="${host.leave.done[k] ? "on" : ""}"><input type="checkbox" data-hleave="${k}" ${host.leave.done[k] ? "checked" : ""}><span>${esc(t)}</span></label>${mine ? `<button type="button" class="icon-btn" data-hdelleave="${k}" aria-label="Remove">✕</button>` : ""}</li>`).join("")}</ul>
      <form class="host-away-form" id="hostLeaveForm" autocomplete="off"><label><span class="meal-lab">Add your own</span><input class="input" name="t" maxlength="80" placeholder="e.g. Water the plants" required></label><button class="btn btn-green btn-block" type="submit">Add</button></form></div>`;
  }
  function hostOutHtml() {
    const all = HOST_OUT.concat(host.out.custom.map(c => [c.id, c.text, 1])), n = all.filter(([k]) => host.out.done[k]).length;
    return `<div class="card host-card"><h3>💡 Outdoor decor &amp; lights</h3><p class="host-rem">${n} of ${all.length} done. Do the lights first, while it is still warm enough to stand on a ladder.</p>
      <ul class="host-list chore-list">${all.map(([k, t, mine]) => `<li><label class="${host.out.done[k] ? "on" : ""}"><input type="checkbox" data-hout="${k}" ${host.out.done[k] ? "checked" : ""}><span>${esc(t)}</span></label>${mine ? `<button type="button" class="icon-btn" data-hdelout="${k}" aria-label="Remove">✕</button>` : ""}</li>`).join("")}</ul>
      <form class="host-away-form" id="hostOutForm" autocomplete="off"><label><span class="meal-lab">Add your own</span><input class="input" name="t" maxlength="80" placeholder="e.g. Inflatable snowman" required></label><button class="btn btn-green btn-block" type="submit">Add</button></form></div>`;
  }
  function hostHouseHtml() {
    const h = host.house, f = (k, l, ph, area) => `<label><span class="meal-lab">${l}</span>${area ? `<textarea class="input" rows="2" data-hhouse="${k}" maxlength="200" placeholder="${ph}">${esc(h[k] || "")}</textarea>` : `<input class="input" data-hhouse="${k}" maxlength="60" value="${esc(h[k] || "")}" placeholder="${ph}">`}</label>`;
    return `<div class="card host-card host-house"><p class="host-rem">Everything guests ask about, on one pretty card. Share it as a picture by text before they arrive.</p>
      ${f("wifi", "Wi-Fi name", "e.g. SmithHome")}${f("pass", "Wi-Fi password", "e.g. jinglebells24")}${f("parking", "Parking", "e.g. Driveway, or the street on the left", true)}${f("rules", "House notes", "e.g. Shoes off at the door; coffee is in the left cupboard", true)}${f("kids", "Little ones", "e.g. Bedtime 8 PM; please keep the gate closed", true)}
      <button type="button" class="btn btn-red btn-block" id="hostShareCard">🖼️ Share as a picture</button></div>`;
  }

  // ---------- print place cards (goes through the Print Tray helper) ----------
  function placeDoc() {
    const names = host.table.names.slice(0, host.table.seats).concat(host.table.kids ? host.table.knames.slice(0, host.table.kseats) : []).filter(Boolean);
    if (!names.length) return { error: "🍽️ Add some names to the seats first" };
    const des = PC_DESIGNS.find(d => d.id === host.table.design) || PC_DESIGNS[0];
    if (des.kind === "classic") {
      const card = n => `<div class="pc"><div class="pc-half"></div><div class="pc-half"><div class="pc-star">✦</div><div class="pc-name">${esc(n)}</div><div class="pc-sub">Merry Christmas</div></div></div>`;
      const css = `.pcs{display:grid;grid-template-columns:1fr 1fr;gap:8mm;font-family:Georgia,serif} .pc{border:1px dashed #bbb;height:62mm;display:grid;grid-template-rows:1fr 1fr;break-inside:avoid}
      .pc-half:first-child{border-bottom:1px dotted #ccc} .pc-half:last-child{display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}
      .pc-star{color:#B8935A;font-size:14pt} .pc-name{font:400 30pt "Great Vibes",cursive;color:#1E3A2F;line-height:1.2} .pc-sub{font:500 8pt sans-serif;letter-spacing:.3em;text-transform:uppercase;color:#B8935A} .pc-tip{font:10pt sans-serif;color:#777;margin:0 0 6mm}`;
      return { noBrand: 1, title: "Place cards", css, fonts: true, margin: 0.5, file: "Place-Cards",
        html: `<p class="pc-tip">Cut along the dashed lines and fold along the dotted line, so each card stands up like a little tent.</p><div class="pcs">${names.map(card).join("")}</div>` };
    }
    // designs with art: six fold-over cards per page, the guest's name on both sides of the fold
    const H = 34, W = Math.min(34 * des.asp, 40), corner = des.kind === "corner";
    const half = (n, i, back) => {
      const len = n.length, fs = len <= 9 ? 27 : len <= 14 ? 22 : len <= 20 ? 17 : 13;
      if (des.kind === "band") return `<div class="pch${back ? " bk" : ""}"><div class="pnm" style="padding:0 3mm 14mm;font-size:${fs}pt">${esc(n)}</div><img class="pband" src="${des.arts[0]}" alt=""></div>`;
      return `<div class="pch${back ? " bk" : ""}"><div class="pnm" style="padding-right:${(W + (corner ? 4 : 11)).toFixed(1)}mm;font-size:${fs}pt">${esc(n)}</div>${corner ? "" : `<i class="pln" style="right:${(W + 6).toFixed(1)}mm"></i>`}<img class="pa${corner ? " pcor" : ""}${des.border ? " pbd" : ""}" src="${des.arts[i % des.arts.length]}" style="height:${(corner ? 36 : H)}mm;width:${(corner ? 36 : H) * des.asp > 40 ? 40 : (corner ? 36 : H) * des.asp}mm" alt=""></div>`;
    };
    const cards = names.map((n, i) => `<div class="pcc">${half(n, i, true)}${half(n, i, false)}</div>`);
    const pages = []; for (let i = 0; i < cards.length; i += 6) pages.push(`<div class="pcd">${cards.slice(i, i + 6).join("")}</div>`);
    const css = `.pcd{display:grid;grid-template-columns:repeat(2,minmax(0,91.4mm));justify-content:center;page-break-after:always} .pcd:last-child{page-break-after:auto}
      .pcc{min-width:0;height:81mm;box-sizing:border-box;border:.25mm dashed #bbb;display:grid;grid-template-rows:1fr 1fr;break-inside:avoid;background:#fff}
      .pch{position:relative;overflow:hidden;display:flex;align-items:center;box-sizing:border-box} .pch.bk{transform:rotate(180deg);border-bottom:.25mm dotted #999} .pch.bk + .pch{border-top:0}
      .pnm{flex:1;box-sizing:border-box;padding-left:3mm;text-align:center;font-family:"Great Vibes",cursive;color:#1E3A2F;line-height:1.15;overflow-wrap:break-word}
      .pa{position:absolute;right:3mm;top:50%;transform:translateY(-50%);object-fit:contain} .pa.pcor{top:1.5mm;right:1.5mm;transform:none} .pa.pbd{border:.25mm solid #C9A45C}
      .pband{position:absolute;left:50%;bottom:1.5mm;transform:translateX(-50%);height:15mm;width:auto;max-width:80mm} .pln{position:absolute;top:7mm;bottom:7mm;width:.3mm;background:#C9A45C} .pc-tip{font:9pt sans-serif;color:#777;margin:0 0 3mm;text-align:center}`;
    return { noBrand: 1, title: "Place cards", css, fonts: true, margin: 0.5, file: "Place-Cards",
      html: `<p class="pc-tip">Cut along the dashed lines and fold along the dotted line, so each card stands up like a little tent.</p>${pages.join("")}` };
  }
  // ---------- 🧲 the fridge sheet: the whole hosting plan on one page ----------
  function travelDoc() {
    const kinds = [["trip", "✈️ Flights & trains"], ["gtrip", "🛬 Guests' travel"], ["pet", "🐾 Pet care"], ["pass", "🛂 Passports"], ["other", "🧳 Other"]];
    const when = x => !x.b ? "" : x.k === "trip" || x.k === "gtrip" ? (x.k === "gtrip" ? "arrives " : "") + new Date(x.b).toLocaleString([], { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) : x.k === "pass" ? "expires " + x.b : x.b;
    const sec = kinds.map(([k, l]) => { const it = host.trips.filter(x => x.k === k).sort((a, b) => (a.b || "").localeCompare(b.b || "")); return it.length ? `<h2>${l}</h2><table>${it.map(x => `<tr><td><b>${esc(x.a)}</b></td><td>${esc(when(x))}</td></tr>`).join("")}</table>` : ""; }).join("");
    const all = HOST_LEAVE.concat(host.leave.custom.map(c => [c.id, c.text])), box = on => on ? "☑" : "☐";
    const css = `.fr{font:11pt/1.4 Georgia,serif;color:#222} .fr h1{font-size:20pt;margin:0;color:#1E3A2F} .fr .fr-sub{margin:2px 0 10px;color:#8a6d3b;letter-spacing:.08em;text-transform:uppercase;font:600 8pt sans-serif}
      .fr h2{font-size:12pt;color:#1E3A2F;border-bottom:1.5px solid #B8935A;margin:12px 0 4px;padding-bottom:2px} .fr table{border-collapse:collapse;width:100%} .fr td{text-align:left;padding:4px 6px;border-bottom:1px solid #e6e0d2} .fr ul{list-style:none;margin:0;padding:0} .fr li{margin:3px 0} .fr-foot{margin-top:14px;font:8pt sans-serif;color:#999;text-align:center}`;
    const html = `<div class="fr"><h1>✈️ Our Travel Plans</h1><p class="fr-sub">Before we go</p>${sec || "<p>No travel added yet.</p>"}
      <h2>🔑 Before we leave home</h2><ul>${all.map(([k, t]) => `<li>${box(host.leave.done[k])} ${esc(t)}</li>`).join("")}</ul>
      <p class="fr-foot">Made with Noël Tier 1 Hub</p></div>`;
    return { title: "Travel plans", css, html, margin: 0.5, file: "Travel-Plans" };
  }
  function fridgeDoc() {
    const D = hostDinner(), day = t => new Date(t).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
    const room = id => { const r = host.rooms.find(x => x.id === id); return r ? r.name : ""; };
    const guests = host.guests.slice().sort((a, b) => (a.arrive || "z").localeCompare(b.arrive || "z"));
    const box = on => on ? "☑" : "☐";
    const trips = host.trips.slice().sort((a, b) => ["trip", "gtrip", "pet", "pass", "other"].indexOf(a.k) - ["trip", "gtrip", "pet", "pass", "other"].indexOf(b.k) || (a.b || "").localeCompare(b.b || ""));
    const cleanByDay = {}; HOST_CLEAN.forEach(([id, days, text]) => { const k = days ? day(atDay(D, days, 10)) : "Dinner day"; (cleanByDay[k] = cleanByDay[k] || []).push(`${box(host.clean[id])} ${esc(text)}${host.who["c:" + id] ? ` <b>(${esc(host.who["c:" + id])})</b>` : ""}`); });
    const need = HOST_SUPPLIES.flatMap(([, l]) => l).concat(host.custom).filter(i => !host.supplies[i]);
    const t = host.table, main = t.names.slice(0, t.seats), kids = t.kids ? t.knames.slice(0, t.kseats) : [];
    const seatList = arr => arr.map((n, i) => `<span>${i + 1}. ${n ? esc(n) : "<i>open</i>"}</span>`).join("");
    const h = host.house, house = [["Wi-Fi", h.wifi], ["Password", h.pass], ["Parking", h.parking], ["House notes", h.rules], ["Little ones", h.kids]].filter(([, v]) => v);
    const css = `.fr{font:10pt/1.35 Georgia,serif;color:#222} .fr h1{font-size:20pt;margin:0;color:#1E3A2F} .fr .fr-sub{margin:2px 0 10px;color:#8a6d3b;letter-spacing:.08em;text-transform:uppercase;font:600 8.5pt sans-serif}
      .fr h2{font-size:12pt;color:#1E3A2F;border-bottom:1.5px solid #B8935A;margin:10px 0 4px;padding-bottom:2px} .fr table{border-collapse:collapse;width:100%} .fr td,.fr th{text-align:left;padding:3px 5px;border-bottom:1px solid #e6e0d2;vertical-align:top;font-size:9.5pt}
      .fr th{background:#f4efe3;font:600 8pt sans-serif;text-transform:uppercase;letter-spacing:.06em} .fr .fr-cols{display:grid;grid-template-columns:1fr 1fr;gap:0 18px} .fr .fr-seats{display:grid;grid-template-columns:1fr 1fr;gap:1px 10px;font-size:9.5pt}
      .fr ul{list-style:none;margin:0;padding:0} .fr li{margin:1px 0;font-size:9.5pt} .fr .fr-day{font-weight:bold;margin-top:4px;font-size:9.5pt} .fr .fr-need{columns:3;column-gap:12px} .fr .fr-need li{font-size:8.5pt} .fr p{margin:0 0 3px} .fr .fr-clean td{font-size:8.5pt;padding:2px 4px} .fr .fr-clean td:first-child{white-space:nowrap;font-weight:bold;width:62px} .fr .fr-foot{margin-top:12px;text-align:center;color:#999;font:8pt sans-serif}`;
    const html = `<div class="fr"><h1>🎄 Our Christmas Hosting Plan</h1><p class="fr-sub">Dinner · ${esc(hostFmt(D))}</p>
      <h2>Guests &amp; arrivals</h2>${guests.length ? `<table><tr><th>Who</th><th>Arriving</th><th>Getting here</th><th>Sleeping</th><th>Notes</th></tr>${guests.map(g => `<tr><td><b>${esc(g.name)}</b> (${g.people || 1})</td><td>${g.arrive ? esc(hostFmt(new Date(g.arrive))) : "—"}</td><td>${g.travel === "fly" ? `✈️ ${esc(g.flight || "Flying")}` : "🚗 Driving"}${g.pickup ? "<br><b>Needs a pickup</b>" : ""}</td><td>${esc(room(g.room)) || "—"}</td><td>${esc(g.notes || "")}</td></tr>`).join("")}</table>` : `<p>No guests added yet.</p>`}
      <div><div><h2>Seating</h2>${main.some(Boolean) ? `<div class="fr-seats">${seatList(main)}</div>` : "<p>Not set yet.</p>"}${kids.some(Boolean) ? `<p class="fr-day">Kids' table</p><div class="fr-seats">${seatList(kids)}</div>` : ""}</div>
        </div>
      <h2>Still to get</h2>${need.length ? `<ul class="fr-need">${need.map(i => `<li>☐ ${esc(i)}</li>`).join("")}</ul>` : "<p>Everything's ready! ✨</p>"}
      ${house.length ? `<h2>House info</h2><table>${house.map(([k, v]) => `<tr><td style="width:90px"><b>${k}</b></td><td>${esc(v)}</td></tr>`).join("")}</table>` : ""}
      <p class="fr-foot">Made with Noël Tier 1 Hub</p></div>`;
    return { title: "Hosting fridge sheet", css, html, margin: 0.45, file: "Hosting-Fridge-Sheet" };
  }
  function hostListDoc() {   // 🖨️ Master Hostess List: everything still to get, by category, with tick boxes
    const cats = HOST_SUPPLIES.map(([c, l]) => [c, l.filter(i => !host.supplies[i])]).concat([["Your extras", host.custom.filter(i => !host.supplies[i])]]).filter(([, l]) => l.length);
    const total = cats.reduce((n, [, l]) => n + l.length, 0), all = HOST_SUPPLIES.flatMap(([, l]) => l).concat(host.custom).length;
    const css = `.ml{font:11pt/1.45 Georgia,serif;color:#1a1a1a} .ml-head{text-align:center;border-top:2px solid #B8935A;border-bottom:1px solid #B8935A;padding:14px 0 12px;margin:0 0 16px} .ml-k{font:600 8pt sans-serif;letter-spacing:.34em;text-transform:uppercase;color:#8a6d3b;margin:0 0 6px} .ml-head h1{font:400 26pt/1.1 Georgia,serif;margin:0} .ml-sub{margin:6px 0 0;color:#555;font-style:italic;font-size:10.5pt}
      .ml-grid{columns:2;column-gap:28px} .ml-cat{break-inside:avoid;margin:0 0 14px} .ml-cat h2{font:600 9pt sans-serif;letter-spacing:.22em;text-transform:uppercase;color:#8a6d3b;border-bottom:1px solid #B8935A;margin:0 0 5px;padding-bottom:3px} .ml-cat ul{list-style:none;margin:0;padding:0} .ml-cat li{padding:4px 2px;border-bottom:1px dotted #ccc;font-size:11pt}
      .ml-foot{margin-top:18px;text-align:center;color:#888;font:8pt sans-serif;letter-spacing:.14em;text-transform:uppercase} .ml-done{text-align:center;font-size:13pt;margin:30px 0}
      @media (max-width:640px){.ml-grid{columns:1}}`;
    const body = cats.length ? `<div class="ml-grid">${cats.map(([c, l]) => `<div class="ml-cat"><h2>${esc(c)}</h2><ul>${l.map(i => `<li>☐ ${esc(i)}</li>`).join("")}</ul></div>`).join("")}</div>` : `<p class="ml-done">Everything is ready. Nothing left to get.</p>`;
    const html = `<div class="ml"><div class="ml-head"><p class="ml-k">Noël Tier 1 Hub</p><h1>Master Hostess List</h1><p class="ml-sub">${total ? `${total} item${total === 1 ? "" : "s"} still to get` : "All ready"} · ${all - total} of ${all} ready</p></div>${body}<p class="ml-foot">Made with Noël Tier 1 Hub</p></div>`;
    return { title: "Master Hostess List", css, html, margin: 0.6, file: "Master-Hostess-List", noBrand: true };
  }
  function planAllDoc() {   // 🖨️ everything on the Plan page (travel, guests, seating, supplies, house info) as one printout
    const a = travelDoc(), b = fridgeDoc();
    return { title: "Everything for your home", css: a.css + " " + b.css + " .pa-break{page-break-before:always;break-before:page}", html: a.html + `<div class="pa-break"></div>` + b.html, margin: 0.45, file: "Home-Plans" };
  }
  // ---------- house info card as a picture ----------
  async function shareHouseCard() {
    const h = host.house, rows = [["📶 Wi-Fi", h.wifi], ["🔑 Password", h.pass], ["🚗 Parking", h.parking], ["🏡 House notes", h.rules], ["🧸 Little ones", h.kids]].filter(r => r[1]);
    if (!rows.length) { toast("📶 Fill in a few details first"); return; }
    const c = document.createElement("canvas"); c.width = 1080; c.height = 1350; const x = c.getContext("2d");
    x.fillStyle = "#1E3A2F"; x.fillRect(0, 0, 1080, 1350); x.strokeStyle = "rgba(217,191,140,.6)"; x.lineWidth = 3; x.strokeRect(50, 50, 980, 1250); x.strokeRect(64, 64, 952, 1222);
    x.textAlign = "center"; x.fillStyle = "#D9BF8C"; x.font = "500 26px Poppins, sans-serif"; x.fillText("W E L C O M E   T O", 540, 190);
    x.fillStyle = "#fff"; x.font = "italic 400 76px Lora, Georgia, serif"; x.fillText(familyTitle(family) || "Our Home", 540, 290);
    let y = 420; x.textAlign = "left";
    const wrap = (txt, max) => { const words = String(txt).split(" "), lines = []; let l = ""; words.forEach(w => { const t = l ? l + " " + w : w; if (x.measureText(t).width > max) { lines.push(l); l = w; } else l = t; }); if (l) lines.push(l); return lines; };
    rows.forEach(([k, v]) => { x.fillStyle = "#D9BF8C"; x.font = "500 30px Poppins, sans-serif"; x.fillText(k, 140, y); y += 50; x.fillStyle = "#F3EBDA"; x.font = "400 40px Lora, Georgia, serif"; wrap(v, 800).forEach(l => { x.fillText(l, 140, y); y += 54; }); y += 36; });
    x.textAlign = "center"; x.fillStyle = "rgba(243,235,218,.5)"; x.font = "300 22px Poppins, sans-serif"; x.fillText("Made with Noël Tier 1 Hub", 540, 1240);
    const blob = await new Promise(r => c.toBlob(r, "image/png"));
    try { await NoelMedia.share(blob, "House-Info.png", "Welcome! Here's everything you need for your stay."); } catch (e) {}
  }

  // ---------- taps & typing ----------
  document.addEventListener("click", e => {
    if (!e.target.closest("#hostWrap, #hostTaskWrap")) return;
    const t = e.target;
    const ttb = t.closest("[data-ttab]"); if (ttb) { host.ttab = ttb.dataset.ttab; saveHost(); renderHost(); return; }
    const tb = t.closest("[data-htab]"); if (tb && tb.dataset.htab === "cards") { showView("invites"); showPane("cards"); window.scrollTo(0, 0); return; }
    if (tb) { host.tab = tb.dataset.htab; saveHost(); renderHost(); return; }
    const card = t.closest("[data-hg]"), room = t.closest("[data-hr]");
    if (t.closest("[data-hdel]")) {
      if (card && confirm("Remove this guest?")) { host.guests = host.guests.filter(g => g.id !== card.dataset.hg); }
      if (room && confirm("Remove this room?")) { host.rooms = host.rooms.filter(r => r.id !== room.dataset.hr); host.guests.forEach(g => { if (g.room === room.dataset.hr) g.room = ""; }); }
      saveHost(); renderHost(); hostSync(); return;
    }
    const bd = t.closest("[data-hbeds]"); if (bd && room) { const r = host.rooms.find(x => x.id === room.dataset.hr); r.beds = Math.max(1, Math.min(12, r.beds + +bd.dataset.hbeds)); saveHost(); renderHost(); return; }
    const rd = t.closest("[data-hready]"); if (rd && room) { const r = host.rooms.find(x => x.id === room.dataset.hr); r.ready[rd.dataset.hready] = !r.ready[rd.dataset.hready]; saveHost(); renderHost(); return; }
    const dz = t.closest("[data-hdesign]"); if (dz) { host.table.design = dz.dataset.hdesign; saveHost(); renderHost(); return; }
    const sh = t.closest("[data-hshape]"); if (sh) { host.table.shape = sh.dataset.hshape; saveHost(); renderHost(); return; }
    const st = t.closest("[data-hstyle]"); if (st) { host.table.style = st.dataset.hstyle; saveHost(); renderHost(); return; }
    const ss = t.closest("[data-hseats]"); if (ss) { host.table.seats = Math.max(2, Math.min(24, host.table.seats + +ss.dataset.hseats)); saveHost(); renderHost(); return; }
    const ks = t.closest("[data-hkseats]"); if (ks) { host.table.kseats = Math.max(2, Math.min(16, host.table.kseats + +ks.dataset.hkseats)); saveHost(); renderHost(); return; }
    const seat = t.closest("[data-hseat]");
    if (seat) {
      const kid = seat.dataset.hseat[0] === "k", i = +seat.dataset.hseat.slice(1), arr = kid ? host.table.knames : host.table.names;
      const box = document.createElement("div"); box.className = "seat-edit";
      box.innerHTML = `<input class="input" list="hostNameList" maxlength="30" placeholder="Seat ${i + 1}: name" value="${esc(arr[i] || "")}"><button type="button" class="btn btn-green">OK</button>`;
      const old = $("#hostWrap .seat-edit"); if (old) old.remove();
      seat.closest(".seat-map").after(box); const inp = box.querySelector("input"); inp.focus();
      const done = () => { arr[i] = inp.value.trim(); saveHost(); renderHost(); };
      box.querySelector("button").onclick = done; inp.onkeydown = ev => { if (ev.key === "Enter") done(); };
      return;
    }
    if (t.closest("#hostShareCard")) { shareHouseCard(); return; }
    const dlv = t.closest("[data-hdelleave]"); if (dlv) { host.leave.custom = host.leave.custom.filter(x => x.id !== dlv.dataset.hdelleave); delete host.leave.done[dlv.dataset.hdelleave]; saveHost(); renderHost(); return; }
    const dout = t.closest("[data-hdelout]"); if (dout) { host.out.custom = host.out.custom.filter(x => x.id !== dout.dataset.hdelout); delete host.out.done[dout.dataset.hdelout]; saveHost(); renderHost(); return; }
    const dt = t.closest("[data-hdeltrip]"); if (dt) { const id = dt.closest("[data-htrip]").dataset.htrip; host.trips = host.trips.filter(x => x.id !== id); saveHost(); renderHost(); hostSync(); return; }
    const dj = t.closest("[data-hdeljob]"); if (dj) { const id = dj.closest("[data-hjob]").dataset.hjob; host.jobs = host.jobs.filter(j => j.id !== id); delete host.who["j:" + id]; delete host.jobDone[id]; saveHost(); renderHost(); return; }
  });
  document.addEventListener("change", async e => {
    if (!e.target.closest("#hostWrap, #hostTaskWrap")) return;
    const t = e.target;
    if (t.id === "hostRemindBox") {
      host.remind = t.checked; saveHost(); renderHost(); getAudio();
      if (host.remind && NoelNative.isNative()) hostSync(); else hostSync();
      toast(host.remind ? "🔔 Helpful reminders are on" : "Reminders off"); return;
    }
    if (t.id === "hostKids") { host.table.kids = t.checked; saveHost(); renderHost(); return; }
    const card = t.closest("[data-hg]");
    if (card && t.dataset.hf) {
      const g = host.guests.find(x => x.id === card.dataset.hg), k = t.dataset.hf;
      g[k] = t.type === "checkbox" ? t.checked : k === "people" ? Math.max(1, +t.value || 1) : t.value;
      saveHost(); hostSync(); if (["travel", "arrive", "pickup", "room", "people"].includes(k)) renderHost(); return;
    }
    const room = t.closest("[data-hr]"); if (room && t.dataset.hrf) { host.rooms.find(x => x.id === room.dataset.hr).name = t.value.trim() || "Room"; saveHost(); return; }
    if (t.dataset.hclean) { host.clean[t.dataset.hclean] = t.checked; saveHost(); hostSync(); t.closest("label").classList.toggle("on", t.checked); return; }
    if (t.dataset.hwho) { const v = t.value.trim(); if (v) host.who[t.dataset.hwho] = v; else delete host.who[t.dataset.hwho]; saveHost(); return; }
    if (t.dataset.hjobdone) { host.jobDone[t.dataset.hjobdone] = t.checked; saveHost(); t.closest("label").classList.toggle("on", t.checked); return; }
    if (t.dataset.hleave) { host.leave.done[t.dataset.hleave] = t.checked; saveHost(); t.closest("label").classList.toggle("on", t.checked); return; }
    if (t.dataset.hout) { host.out.done[t.dataset.hout] = t.checked; saveHost(); t.closest("label").classList.toggle("on", t.checked); return; }
    if (t.dataset.hsup) { host.supplies[t.dataset.hsup] = t.checked; saveHost(); t.closest("label").classList.toggle("on", t.checked); return; }
    if (t.dataset.hhouse) { host.house[t.dataset.hhouse] = t.value.trim(); saveHost(); return; }
  });
  document.addEventListener("submit", e => {
    if (!e.target.closest("#hostWrap, #hostTaskWrap")) return;
    e.preventDefault(); const f = e.target;
    if (f.dataset.htripform) { const n = f.a.value.trim(); if (!n) return; host.trips.push({ id: uid(), k: f.dataset.htripform, a: n, b: f.b.value.trim() }); saveHost(); renderHost(); hostSync(); return; }
    if (f.id === "hostLeaveForm") { const n = f.t.value.trim(); if (!n) return; host.leave.custom.push({ id: uid(), text: n }); saveHost(); renderHost(); return; }
    if (f.id === "hostOutForm") { const n = f.t.value.trim(); if (!n) return; host.out.custom.push({ id: uid(), text: n }); saveHost(); renderHost(); return; }
    if (f.id === "hostGuestForm") { const n = f.gname.value.trim(); if (!n) return; host.guests.push({ id: uid(), name: n, people: 1, travel: "drive", room: "", pickup: false }); }
    if (f.id === "hostRoomForm") { const n = f.rname.value.trim(); if (!n) return; host.rooms.push({ id: uid(), name: n, icon: "🛏️", beds: 2, ready: {} }); }
    if (f.id === "hostJobForm") { const n = f.job.value.trim(); if (!n) return; host.jobs.push({ id: uid(), text: n, when: f.when.value.trim() }); }
    if (f.id === "hostSupForm") { const n = f.sup.value.trim(); if (!n || host.custom.includes(n)) return; host.custom.push(n); }
    saveHost(); renderHost(); hostSync();
  });
  /* @host-end */
