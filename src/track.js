  /* ============================================================
     🛷 SANTA TRACKER (Games page)
     A festive, fully offline tracker. Before Christmas Eve it counts
     down to take-off with daily news from the North Pole. On Christmas
     Eve Santa flies west with midnight, from the islands of Kiribati
     to Hawaii, reaching each town at about midnight local time. Shows
     where he is now, the next stop, when he reaches YOUR time zone and
     a "time for bed!" alarm. It's a make-believe route worked out on
     the phone: no internet, no tracking of anyone.
     ============================================================ */
  // [town, UTC offset on Christmas Eve, x on the night-sky map (0–100)]
  const ST_STOPS = [
    ["Kiritimati, Kiribati", 14, 4], ["Nukuʻalofa, Tonga", 13, 7], ["Auckland, New Zealand", 13, 9], ["Suva, Fiji", 12, 12], ["Sydney, Australia", 11, 15],
    ["Brisbane, Australia", 10, 18], ["Tokyo, Japan", 9, 21], ["Seoul, South Korea", 9, 23], ["Beijing, China", 8, 26], ["Manila, Philippines", 8, 28],
    ["Bangkok, Thailand", 7, 31], ["Dhaka, Bangladesh", 6, 34], ["New Delhi, India", 5.5, 36], ["Dubai, UAE", 4, 40], ["Nairobi, Kenya", 3, 43],
    ["Moscow, Russia", 3, 45], ["Athens, Greece", 2, 48], ["Cairo, Egypt", 2, 50], ["Rome, Italy", 1, 53], ["Paris, France", 1, 55],
    ["London, England", 0, 58], ["Reykjavík, Iceland", 0, 60], ["Azores, Portugal", -1, 63], ["Rio de Janeiro, Brazil", -3, 66], ["Buenos Aires, Argentina", -3, 68],
    ["St. John's, Newfoundland", -3.5, 70], ["Halifax, Nova Scotia", -4, 72], ["Toronto, Ontario", -5, 75], ["New York, USA", -5, 76], ["Winnipeg, Manitoba", -6, 79],
    ["Chicago, USA", -6, 80], ["Calgary, Alberta", -7, 83], ["Denver, USA", -7, 84], ["Vancouver, B.C.", -8, 87], ["Los Angeles, USA", -8, 88],
    ["Anchorage, Alaska", -9, 91], ["Honolulu, Hawaii", -10, 94], ["Pago Pago, American Samoa", -11, 97]
  ];
  const ST_NEWS = [   // a new North Pole update each day
    "The elves are painting thousands of tiny toy trains.", "Rudolph is practising his nose-glow. Brightness: 100%!", "Mrs. Claus is baking a test batch of gingerbread.",
    "Santa is checking the Nice List. Twice.", "The reindeer are doing laps around the North Pole for fitness.", "The sleigh got a fresh coat of red paint and new jingle bells.",
    "Elves are wrapping presents at record speed. 🎀", "Santa tried on his suit. Still fits (after a few cookies).", "Dasher and Dancer are racing in the snow.",
    "The workshop is so busy the elves are working in shifts.", "Mrs. Claus is knitting a new scarf for Santa's flight.", "Santa is studying maps of the whole world.",
    "Comet and Cupid are practising rooftop landings.", "The magic sleigh dust has been delivered. ✨", "The elves are testing every toy, very seriously.",
    "Santa's reading letters from children all over the world.", "The North Pole weather team is watching the skies.", "Blitzen ate too many carrots and needs a nap.",
    "The toy sacks are being filled, one by one.", "Vixen and Prancer polished the sleigh until it sparkles.", "Santa's hot cocoa thermos is ready for the trip.",
    "The elves are learning a new Christmas song for take-off.", "Donner is helping load the biggest presents.", "Every reindeer has had their hooves checked. All good!"
  ];
  const stYear = () => { const n = new Date(); return n.getMonth() === 11 && n.getDate() >= 26 ? n.getFullYear() + 1 : n.getFullYear(); };
  const stArrive = (off, y) => Date.UTC(y, 11, 25, 0, 0) - off * 3600000 - 15 * 60000;   // a little before local midnight
  const stDepart = y => stArrive(14, y) - 45 * 60000;
  const stHome = y => Date.UTC(y, 11, 25, 12, 30);
  const stMyOff = () => -new Date(stYear(), 11, 24, 20).getTimezoneOffset() / 60;
  let stTimer = null, stAlarm = load("santaAlarm", { on: false, fired: {} });
  function stState(now = Date.now()) {
    const y = stYear(), dep = stDepart(y), home = stHome(y), first = stArrive(14, y), last = stArrive(-11, y), myArrive = stArrive(stMyOff(), y);
    if (now < dep) return { phase: "before", y, dep, myArrive };
    if (now >= home) return { phase: "done", y, myArrive };
    const frac = Math.min(1, Math.max(0, (now - first) / (last - first)));
    let i = ST_STOPS.findIndex(s => stArrive(s[1], y) > now); if (i < 0) i = ST_STOPS.length;
    return { phase: now < first ? "takeoff" : now > last ? "returning" : "flying", y, frac, cur: ST_STOPS[Math.max(0, i - 1)], next: ST_STOPS[i], nextAt: ST_STOPS[i] ? stArrive(ST_STOPS[i][1], y) : home, myArrive, home };
  }
  const stDur = ms => { const s = Math.max(0, Math.floor(ms / 1000)), d = Math.floor(s / 86400), h = Math.floor(s % 86400 / 3600), m = Math.floor(s % 3600 / 60), ss = s % 60; return { d, h, m, s: ss }; };
  const stShort = ms => { const t = stDur(ms); return t.d ? `${t.d} day${t.d === 1 ? "" : "s"}` : t.h ? `${t.h} hr ${t.m} min` : `${t.m} min`; };
  function stSky(st) {
    let x = st.phase === "before" ? 0 : st.phase === "done" ? 100 : st.phase === "takeoff" ? 2 : st.phase === "returning" ? 99 : 4 + st.frac * 93;
    if (st.phase === "flying" && st.next) { const a = stArrive(st.cur[1], st.y), b = stArrive(st.next[1], st.y); x = st.cur[2] + (st.next[2] - st.cur[2]) * Math.min(1, Math.max(0, (Date.now() - a) / Math.max(1, b - a))); }
    const Y = p => 74 - Math.sin(p / 100 * Math.PI) * 44, my = ST_STOPS.reduce((a, s) => Math.abs(s[1] - stMyOff()) < Math.abs(a[1] - stMyOff()) ? s : a, ST_STOPS[0]);
    const stars = Array.from({ length: 40 }, (_, i) => `<circle cx="${(i * 37) % 100}" cy="${(i * 53) % 60 + 4}" r="${i % 3 ? 0.35 : 0.6}" fill="#fff" opacity="${0.4 + (i % 5) / 10}"/>`).join("");
    const path = Array.from({ length: 51 }, (_, i) => `${i ? "L" : "M"}${i * 2} ${Y(i * 2).toFixed(2)}`).join(" ");
    return `<svg viewBox="0 0 100 92" class="st-sky" role="img" aria-label="Santa's route across the night sky">
      <defs><linearGradient id="stNight" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b1a33"/><stop offset="1" stop-color="#22385e"/></linearGradient></defs>
      <rect width="100" height="92" rx="5" fill="url(#stNight)"/>${stars}<circle cx="86" cy="13" r="5" fill="#fdf3c4"/><circle cx="88" cy="11.5" r="4.2" fill="#0f2140"/>
      <path d="${path}" fill="none" stroke="rgba(255,255,255,.35)" stroke-width=".5" stroke-dasharray="1.2 1.2"/>
      ${x > 0 ? `<path d="${path}" fill="none" stroke="#f3c95b" stroke-width=".8" stroke-dasharray="${x * 1.1} 300"/>` : ""}
      ${ST_STOPS.map(s => `<circle cx="${s[2]}" cy="${Y(s[2]).toFixed(2)}" r="${s === my ? 1.3 : 0.6}" fill="${s === my ? "#ff6b6b" : "#f8e6a8"}"/>`).join("")}
      <text x="${my[2]}" y="${(Y(my[2]) + 5).toFixed(2)}" font-size="3" fill="#ffb3b3" text-anchor="middle" font-family="sans-serif">🏠 You</text>
      <rect x="0" y="80" width="100" height="12" fill="#f4f1ea" opacity=".92"/><path d="M0 80 Q 12 76 25 80 T 50 80 T 75 80 T 100 80 V 82 H 0 Z" fill="#f4f1ea"/>
      <text x="2" y="88" font-size="3.2" fill="#2b4a6b" font-family="sans-serif">North Pole ❄️</text>
      <text x="${x}" y="${(Y(x) + 1.5).toFixed(2)}" font-size="7" text-anchor="middle" class="st-sleigh">🛷</text></svg>`;
  }
  function renderTrack() {
    const st = stState(), now = Date.now(), el = $("#stBody"), dayIdx = Math.floor(now / 86400000);
    const clock = ms => { const t = stDur(ms); return `<div class="st-clock">${[[t.d, "days"], [t.h, "hours"], [t.m, "min"], [t.s, "sec"]].map(([v, l]) => `<span><b>${String(v).padStart(2, "0")}</b><small>${l}</small></span>`).join("")}</div>`; };
    const delivered = st.frac != null ? Math.round(st.frac * 2400000000) : st.phase === "done" ? 2400000000 : 0;
    const myAt = new Date(st.myArrive), myLeft = st.myArrive - now;
    let main = "";
    if (st.phase === "before") main = `<p class="st-lab">Santa leaves the North Pole in</p>${clock(st.dep - now)}
        <p class="st-sub">Take-off: ${new Date(st.dep).toLocaleString(undefined, { weekday: "long", month: "long", day: "numeric", hour: "numeric", minute: "2-digit" })} your time</p>`;
    else if (st.phase === "done") main = `<p class="st-lab">🎄 Mission complete!</p><p class="st-big">Santa is home at the North Pole, fast asleep.</p><p class="st-sub">Merry Christmas! He'll be back next year.</p>`;
    else main = `<p class="st-lab">${st.phase === "takeoff" ? "🚀 Take-off! Santa is leaving the North Pole" : st.phase === "returning" ? "🏁 Last stop done! Flying home to the North Pole" : "🛷 Santa is delivering presents in"}</p>
        ${st.phase === "flying" ? `<p class="st-big">${esc(st.cur[0])}</p>` : ""}
        ${st.next ? `<p class="st-sub">Next stop: <b>${esc(st.next[0])}</b> in ${stShort(st.nextAt - now)}</p>` : ""}
        <div class="st-stats"><span><b>${delivered.toLocaleString()}</b><small>presents delivered</small></span><span><b>${Math.round(delivered / 7).toLocaleString()}</b><small>cookies eaten 🍪</small></span></div>`;
    const homeCard = st.phase === "done" ? "" : myLeft > 0 ? `<div class="card pt-card st-home"><h3>🏠 When does Santa reach you?</h3>
        <p>Around <b>${myAt.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}</b> on Christmas Eve night${myLeft < 86400000 * 2 ? `, in <b>${stShort(myLeft)}</b>` : ""}.</p>
        <p class="host-rem">Santa only comes when everyone's asleep, so little ones should be tucked in by about ${new Date(st.myArrive - 3 * 3600000).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}!</p>
        <label class="host-switch"><input type="checkbox" id="stAlarmBox" ${stAlarm.on ? "checked" : ""}><span><b>🔔 "Time for bed!" alarm</b><small>A jingle when Santa is 3 hours away, and again when he's 1 hour away.</small></span></label></div>`
      : `<div class="card pt-card st-home"><h3>🎁 Santa has been to your house!</h3><p>Go and look under the tree… ✨</p></div>`;
    el.innerHTML = `${stSky(st)}<div class="card st-main">${main}</div>${homeCard}
      ${st.phase === "before" ? `<div class="card pt-card"><h3>📰 News from the North Pole</h3><p>${ST_NEWS[dayIdx % ST_NEWS.length]}</p></div>` : ""}
      <div class="card pt-card"><h3>🍪 Christmas Eve checklist</h3><ul class="host-list">${["Cookies and milk for Santa", "Carrots for the reindeer", "Stockings hung up", "A note for Santa", "Everyone in bed!"].map((x, i) => `<li><label class="${stAlarm["c" + i] ? "on" : ""}"><input type="checkbox" data-stc="${i}" ${stAlarm["c" + i] ? "checked" : ""}><span>${x}</span></label></li>`).join("")}</ul></div>
      <p class="photo-credit">Santa's route is a make-believe flight worked out on your phone, following midnight around the world. No internet needed.</p>`;
  }
  function stBanner() {
    const st = stState(), now = Date.now();
    $("#stBannerSub").textContent = st.phase === "before" ? (st.dep - now > 86400000 ? `Santa leaves the North Pole in ${stShort(st.dep - now)}` : `Take-off in ${stShort(st.dep - now)}!`)
      : st.phase === "done" ? "Santa is home, resting. Merry Christmas!" : st.phase === "flying" ? `Live: Santa is over ${st.cur[0]}` : "Santa is in the sky right now!";
  }
  // "time for bed" alarms
  // 🍫 surprise nudges: always on, never listed anywhere (a little helper the family discovers)
  const stSurprise = () => {
    if (SPACE === "office") return [];   // the family side already rings these
    const y = stYear(), n = new Date(), ny = n.getMonth() === 0 ? n.getFullYear() : n.getFullYear() + 1;
    return [
      { k: y + "treats", icon: "🍫", t: new Date(y, 11, 20, 10, 0).getTime(), text: "Don't forget chocolates and treats! 🍫 Stocking stuffers too!" },
      { k: y + "xmas", icon: "🎄", t: new Date(y, 11, 25, 9, 0).getTime(), text: "Merry Christmas! May today be full of joy, laughter and the people you love. ✨" },
      { k: ny + "newyear", icon: "🥂", t: new Date(ny, 0, 1, 12, 0).getTime(), text: "Happy New Year! Wishing you a year full of love, laughter and little moments of magic. ✨" },
      { k: ny + "review", icon: "🎄", t: new Date(ny, 0, 2, 19, 0).getTime(), text: "Close the book on this Christmas: save your memories in your Holiday Review, then your hub is all set for next season." }
    ];
  };
  const stReminders = () => { const sp = stSurprise(); if (!stAlarm.on) return sp; const y = stYear(), a = stArrive(stMyOff(), y); return sp.concat([{ k: y + "b3", t: a - 3 * 3600000, text: "Santa is 3 hours away. Time to get ready for bed!" }, { k: y + "b1", t: a - 3600000, text: "Santa is 1 hour away! Everyone into bed, quick! 🛷" }]); };
  function stSync() { if (NoelNative.isNative()) NoelNative.scheduleList(9000, 9020, stReminders().filter(r => r.t > Date.now()).map(r => ({ t: r.t, title: (r.icon || "🎅") + " " + r.text, body: "Noël Tier 1 Hub · Santa Tracker" }))); }
  function stAlertItem(id) { if (!String(id).startsWith("st:")) return null; const r = stReminders().find(x => "st:" + x.k === id); return r ? { icon: r.icon || "🎅", name: r.text } : null; }
  setInterval(() => {
    stBanner();
    const now = Date.now(), due = stReminders().filter(r => !stAlarm.fired[r.k] && r.t <= now);
    if (due.length) { due.forEach(r => { stAlarm.fired[r.k] = 1; }); save("santaAlarm", stAlarm); const fresh = due.filter(r => now - r.t < 10 * 60000); if (fresh.length) triggerAlert(fresh.map(r => ({ id: "st:" + r.k }))); }
  }, 15000);
  $("#stBanner").addEventListener("click", () => { renderTrack(); openSheet("trackSheet"); clearInterval(stTimer); stTimer = setInterval(() => { if ($("#trackSheet").classList.contains("open")) renderTrackLive(); else clearInterval(stTimer); }, 1000); });
  function renderTrackLive() {   // update just the moving parts each second, so the checkboxes don't jump
    const st = stState(), ae = document.activeElement;
    if (ae && ae.closest && ae.closest("#trackSheet input")) return;
    renderTrack();
  }
  $("#trackSheet").addEventListener("change", e => {
    const t = e.target;
    if (t.id === "stAlarmBox") { stAlarm.on = t.checked; save("santaAlarm", stAlarm); stSync(); getAudio(); toast(t.checked ? "🔔 Santa alarm is on" : "Santa alarm off"); return; }
    if (t.dataset.stc != null) { stAlarm["c" + t.dataset.stc] = t.checked; save("santaAlarm", stAlarm); t.closest("label").classList.toggle("on", t.checked); }
  });
  stBanner(); stSync();
  /* @track-end */
