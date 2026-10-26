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
  const OFF_ACTS = [["potluck", "🥘 Potluck"], ["catered", "🍽️ Catered meal"], ["gifts", "🎁 Gift exchange"], ["awards", "🏆 Silly Office Awards"], ["games", "🎲 Games & trivia"], ["sweater", "🧶 Ugly sweater contest"], ["charity", "💛 Charity drive"], ["booth", "📸 Photo booth"], ["music", "🎶 Music / DJ"], ["outing", "⛸️ Team outing"]];
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
  const offActs = () => offActList().filter(([k]) => off.acts[k]).map(([k, l]) => k === "gifts" && off.ev.giftLimit ? `${l} (${money(+off.ev.giftLimit)} limit)` : l);
  const offYear = () => (off.ev.date ? +off.ev.date.slice(0, 4) : new Date().getFullYear());

  function renderOffice() {
    const tab = off.tab || "event";
    $("#offTabs").innerHTML = [["event", "📋 Event"], ["approval", "📨 Approval"], ["potluck", "🥘 Potluck"], ["santa", "🎅 Secret Santa"], ["awards", "🏆 Awards"], ["auction", "🔨 Auction"], ["charity", "💛 Charity"], ["handover", "📦 Handover"]].map(([k, l]) =>
      `<button type="button" class="chip${k === tab ? " on" : ""}" data-oftab="${k}">${l}${k === "approval" ? ` <span class="ap-dot ${off.appr.status}"></span>` : ""}</button>`).join("");
    $("#offBody").innerHTML = ({ event: offEventHtml, approval: offApprovalHtml, potluck: offPotHtml, santa: offSantaHtml, awards: offAwardsHtml, auction: offAucHtml, charity: offCharityHtml, handover: offHandoverHtml })[tab]();
  }
  const fld = (k, label, type, ph, extra) => `<label class="off-f${extra === "wide" ? " wide" : ""}"><span class="meal-lab">${label}</span>${type === "area" ? `<textarea class="input" rows="2" data-ev="${k}" maxlength="300" placeholder="${ph || ""}">${esc(off.ev[k] || "")}</textarea>` : `<input class="input" type="${type || "text"}" data-ev="${k}" value="${esc(off.ev[k] ?? "")}" placeholder="${ph || ""}" ${type === "number" ? 'inputmode="decimal" min="0"' : 'maxlength="80"'}>`}</label>`;
  function offEventHtml() {
    if (!off.ev.who) return `<div class="card pt-card"><h3>👥 First, who's invited?</h3><p class="host-rem">This shapes the whole plan: the time of day, the activities, the food and the approval request.</p>
      <div class="who-pick">${OFF_WHO.map(([k, i, l, d]) => `<button type="button" class="who-tile" data-ofwho="${k}"><span class="wt-ico">${i}</span><span><b>${l}</b><small>${d}</small></span></button>`).join("")}</div></div>`;
    const W = offWho();
    const last = off.past[off.past.length - 1], total = offTotal(), hc = Math.max(1, +off.ev.headcount || 1);
    return `${last ? `<div class="card pt-card off-last"><h3>🗂️ Last year (${last.year})</h3><p><b>${esc(last.name || "Holiday party")}</b>${last.organizer ? `, organized by <b>${esc(last.organizer)}</b>` : ""}${last.date ? ` · ${offDate(last.date, { month: "short", day: "numeric" })}` : ""} · ${last.headcount || "?"} people · ${money(last.spent || 0)} spent</p>
        ${last.worked ? `<p>👍 <b>What worked:</b> ${esc(last.worked)}</p>` : ""}${last.change ? `<p>✏️ <b>Change next time:</b> ${esc(last.change)}</p>` : ""}
        ${last.vendors && last.vendors.length ? `<p class="host-rem">Vendors used: ${last.vendors.map(v => esc(v.name) + (v.type ? ` (${esc(v.type)})` : "")).join(", ")}</p>` : ""}</div>` : ""}
      <div class="who-pill"><span>${W[1]} <b>${W[2]}</b></span><button type="button" class="classy-link" data-ofwho="">Change</button></div>
      <div class="card pt-card"><h3>🎉 The event</h3><div class="off-grid">
        ${fld("name", "Event name", "text", "e.g. Holiday Party", "wide")}${fld("date", "Date", "date")}${fld("headcount", "Guests (about)", "number")}${fld("start", "Starts", "time")}${fld("end", "Ends", "time")}
        ${fld("venue", "Venue", "text", "e.g. Boardroom, The Keg", "wide")}${fld("address", "Address", "text", "", "wide")}${fld("theme", "Theme", "text", "e.g. Ugly sweater")}${fld("dress", "Dress code", "text", "e.g. Festive casual")}
        ${fld("organizer", "Organized by", "text", "Your name")}${fld("budget", "Approved budget", "number", "$")}</div></div>
      <div class="card pt-card"><h3>✨ What's planned</h3><div class="apps-filters">${offActList().map(([k, l]) => `<button type="button" class="chip${off.acts[k] ? " on" : ""}" data-ofact="${k}">${off.acts[k] ? "✓ " : ""}${l}</button>`).join("")}</div>
        ${off.acts.gifts ? `<div class="off-grid" style="margin-top:8px">${fld("giftLimit", "Gift exchange limit", "number", "$")}</div>` : ""}</div>
      <div class="card pt-card"><h3>💵 Costs & vendors</h3>
        ${off.costs.map(c => `<div class="off-cost" data-oc="${c.id}"><div><b>${esc(c.type)}</b>${c.name ? ` · ${esc(c.name)}` : ""}${c.contact ? `<small>📞 ${esc(c.contact)}</small>` : ""}</div><span>${money(+c.cost || 0)}</span><button type="button" class="icon-btn" data-ocdel aria-label="Remove">✕</button></div>`).join("") || `<p class="host-rem">Add the venue, caterer, drinks, prizes… Vendors' names and numbers are kept for next year too.</p>`}
        ${off.costs.length ? `<div class="off-cost total"><div><b>Estimated total</b><small>about ${money(Math.round(total / hc * 100) / 100)} per person</small></div><span>${money(total)}</span><i></i></div>` : ""}
        ${+off.ev.budget && total > +off.ev.budget ? `<p class="org-warn">⚠️ ${money(total - off.ev.budget)} over the approved budget.</p>` : ""}
        <form class="org-ev-form" id="offCostForm" autocomplete="off"><div class="org-addr-row"><select class="input" name="type">${OFF_COSTS.map(c => `<option>${c}</option>`).join("")}</select><input class="input" name="cost" type="number" inputmode="decimal" min="0" placeholder="$" style="max-width:96px"></div>
          <input class="input" name="name" maxlength="50" placeholder="Vendor or item (optional), e.g. Sunrise Catering"><input class="input" name="contact" maxlength="60" placeholder="Phone or email (optional)">
          <button class="btn btn-green btn-block" type="submit">➕ Add cost</button></form></div>
      <div class="card pt-card"><h3>📝 Notes</h3>${fld("notes", "", "area", "Anything the approver should know, e.g. half-day Friday, partners welcome")}</div>
      <button type="button" class="btn btn-red btn-block" data-oftab="approval">📨 Next: send it for approval ›</button>`;
  }

  // ---------- 📨 approval request ----------
  function offLetter(update) {
    const e = off.ev, total = offTotal(), hc = Math.max(1, +e.headcount || 1), by = new Date(Date.now() + (off.appr.followDays || 3) * 86400000);
    const lines = [`Hi ${e.approver || "there"},`, "",
      update ? `I've updated the plan for our ${e.name || "holiday party"} based on your feedback. Here's the new version for your approval.` : `I've put together the plan for our ${e.name || "holiday party"} and would love your approval before I book anything.`, "",
      "THE EVENT",
      `• Date: ${e.date ? offDate(e.date) : "to be confirmed"}${e.start ? `, ${offTime(e.start)}${e.end ? ` to ${offTime(e.end)}` : ""}` : ""}`,
      `• Where: ${e.venue || "to be confirmed"}${e.address ? ` (${e.address})` : ""}`,
      `• Guests: about ${hc} people${offWho() ? ` (${{ staff: "staff only", partners: "staff and their partners", family: "staff and their families, kids welcome" }[off.ev.who]})` : ""}`];
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
        <button type="button" class="btn btn-red btn-block" data-print="awards" style="margin-top:10px">🖨️ Print the certificates</button></div>`;
  }
  function awardsDoc() {
    const list = off.awards; if (!list.length) return { error: "🏆 Add some awards first" };
    const co = family || "Our Team", yr = offYear();
    const css = `.cert{box-sizing:border-box;height:4.8in;border:6px double #B8935A;padding:.35in;text-align:center;font-family:Georgia,serif;display:flex;flex-direction:column;justify-content:center;break-inside:avoid;margin-bottom:.3in}
      .cert .c1{font:600 9pt sans-serif;letter-spacing:.3em;text-transform:uppercase;color:#B8935A} .cert .c2{font:400 30pt "Great Vibes",cursive;color:#1E3A2F;margin:6px 0} .cert .c3{font-size:12pt;color:#555} .cert .c4{font-size:22pt;font-weight:bold;color:#b3262e;margin:6px 0 4px;min-height:30pt;border-bottom:1px solid #ccc;display:inline-block;padding:0 30px}
      .cert .c5{font:9pt sans-serif;color:#888;margin-top:10px}`;
    return { noBrand: 1, title: "Silly Office Awards certificates", css, fonts: true, margin: 0.5, file: "Office-Awards", html: list.map(a => `<div class="cert"><div class="c1">Silly Office Awards ${yr}</div><div class="c2">${esc(a.t)}</div><div class="c3">proudly presented to</div><div><span class="c4">${esc(a.w || "")}</span></div><div class="c5">${esc(co)} · ${esc(off.ev.name || "Holiday Party")}</div></div>`).join("") };
  }

  // ---------- 📦 handover ----------
  function offHandoverHtml() {
    return `<div class="card pt-card"><h3>📝 Wrapping up</h3><p class="host-rem">Notes for next year's coordinator (even if that's you!).</p>
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
    off.past = off.past.filter(p => p.year !== y).concat({ year: y, name: e.name, organizer: e.organizer, date: e.date, headcount: e.headcount, spent: T.spent || offTotal(), worked: off.wrap.worked, change: off.wrap.change, vendors: off.costs.filter(c => c.name).map(c => ({ type: c.type, name: c.name, contact: c.contact })) });
    saveOff();
  }

  // ---------- follow-up reminder for the approval ----------
  const offReminders = () => {
    const a = off.appr, out = a.status === "sent" && a.sentAt ? [{ k: "follow" + a.sentAt, t: a.sentAt + a.followDays * 86400000, text: `No answer yet? Follow up with ${off.ev.approver || "your approver"} about the ${off.ev.name || "party"} plan.` }] : [];
    const day = ssDay(); if (ssOn() && day) { const t = new Date(day + "T10:00"); t.setDate(t.getDate() - 3); out.push({ k: "ss" + day, t: t.getTime(), text: `Secret Santa exchange is ${offDate(day, { weekday: "long", month: "short", day: "numeric" })}${+off.ev.giftLimit ? `. Limit ${money(+off.ev.giftLimit)}` : ""}. Remind the team!` }); }
    return out;
  };
  function offSync() { if (SPACE === "office") NoelNative.scheduleList(9100, 9110, offReminders().map(r => ({ t: r.t, title: "📨 " + r.text, body: "Noël Tier 1 Hub · Office" }))); }
  function offAlertItem(id) { if (!String(id).startsWith("off:")) return null; const r = offReminders().find(x => "off:" + x.k === id); return r ? { icon: "📨", name: r.text } : null; }
  if (SPACE === "office") setInterval(() => {
    const now = Date.now(), due = offReminders().filter(r => !off.fired[r.k] && r.t <= now); if (!due.length) return;
    due.forEach(r => { off.fired[r.k] = 1; }); saveOff(); triggerAlert(due.map(r => ({ id: "off:" + r.k })));
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
    const as = t.closest("[data-apset]"); if (as) { const note = ($("#apNote") || {}).value || ""; off.appr.status = as.dataset.apset; off.appr.log.push({ at: Date.now(), s: as.dataset.apset, note: note.trim() }); saveOff(); offSync(); renderOffice(); toast(as.dataset.apset === "approved" ? "🎉 Approved! Time to book everything" : "✏️ Noted. Update the plan, then send the new version"); return; }
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
    if (t.dataset.ev) { const k = t.dataset.ev; off.ev[k] = t.type === "number" ? Math.max(0, parseFloat(t.value) || 0) : t.value.trim(); saveOff(); if (["date", "headcount", "budget", "giftLimit"].includes(k) || off.tab === "approval") renderOffice(); return; }
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
    if (f.id === "offCostForm") { const c = parseFloat(f.cost.value) || 0; if (!c && !f.name.value.trim()) { toast("💵 Add an amount or a vendor"); return; } off.costs.push({ id: uid(), type: f.type.value, name: f.name.value.trim(), contact: f.contact.value.trim(), cost: c }); }
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
        <label class="host-check"><input type="checkbox" id="aucToCh" ${A.toCharity ? "checked" : ""}> 💛 Add the auction total to our charity total</label>
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
    return { title: "Auction winners", css, margin: 0.6, file: "Auction-Winners", html: `<div class="aw"><h1>🔨 Silent Auction Winners</h1><table><tr><th>Item</th><th>Winner</th><th class="num">Bid</th></tr>${won.map(i => `<tr><td>${esc(i.name)}</td><td><b>${esc(i.winner)}</b></td><td class="num">${money(+i.bid || 0)}</td></tr>`).join("")}<tr><td colspan="2"><b>Total raised</b></td><td class="num"><b>${money(aucTotal())}</b></td></tr></table><p>Thank you to everyone who donated and bid! 💛</p></div>` };
  }

  /* ---------- 💛 CHARITY & DONATION DRIVE ---------- */
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
        ${ch && ch.url ? `<button type="button" class="btn btn-red" data-chopen="${esc(ch.url)}">💛 Donate</button>` : ""}</div></div>
      <div class="card pt-card"><h3>🗳️ Let the team choose</h3><p class="host-rem">Add 2–4 charities, email the team to vote, then tap ＋ for each vote as replies come in.</p>
        ${C.options.map((o, i) => `<div class="ch-opt${C.chosen === o.id ? " on" : ""}" data-cho="${o.id}"><span class="ch-letter">${"ABCD"[i]}</span><div><b>${esc(o.name)}</b>${o.url ? `<small>${esc(o.url)}</small>` : ""}</div>
          <div class="stepper sm"><button type="button" data-chv="-1">−</button><output>${o.votes || 0}</output><button type="button" data-chv="1">+</button></div><button type="button" class="icon-btn" data-chdel aria-label="Remove">✕</button></div>`).join("")}
        ${C.options.length < 4 ? `<form class="org-ev-form" id="chOptForm" autocomplete="off"><input class="input" name="name" maxlength="50" placeholder="Charity name, e.g. Local food bank"><input class="input" name="url" maxlength="120" placeholder="Website or donation page (optional)"><button class="btn btn-green btn-block" type="submit">➕ Add charity</button></form>` : ""}
        ${C.options.length > 1 ? `<div class="send-btns" style="margin-top:10px"><button type="button" class="btn btn-ghost" id="chVoteMail">✉️ Email the team to vote</button>${votes ? `<button type="button" class="btn btn-green" data-chpick="${top.id}">🏆 Choose ${esc(top.name)}</button>` : ""}</div>` : ""}
        <p class="host-rem">📍 Find local causes: ${["food bank", "toy drive", "animal shelter", "winter coat drive", "women's shelter"].map(q => `<button type="button" class="chip" data-amap="${q}">${q}</button>`).join(" ")}</p>
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
    const body = `Hi team! 💛\n\nThis year we'd like to give back together. Please help choose our holiday charity by replying with A${C.options.length > 1 ? `, B` : ""}${C.options.length > 2 ? `, C` : ""}${C.options.length > 3 ? ` or D` : ""}:\n\n${C.options.map((o, i) => `${"ABCD"[i]}. ${o.name}${o.url ? `\n   ${o.url}` : ""}`).join("\n\n")}\n\nPlease vote by ${new Date(Date.now() + 5 * 86400000).toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}. Thank you!${off.ev.organizer ? `\n\n${off.ev.organizer}` : ""}`;
    location.href = INVITE.mailHref("", "Help choose our holiday charity 💛", body, to || undefined);
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
    const cp = t.closest("[data-chpick]"); if (cp) { C.chosen = cp.dataset.chpick; saveOff(); renderOffice(); toast("💛 Charity chosen!"); return; }
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
    if (f.id === "chDonForm") { e.preventDefault(); e.stopImmediatePropagation(); const a = parseFloat(f.amt.value) || 0; if (!a) return; C.donations.push({ id: uid(), who: f.who.value.trim(), amt: a }); saveOff(); renderOffice(); toast(`💛 ${money(a)} added`); return; }
  }, true);
  if (SPACE === "office") document.body.classList.toggle("co-kids", off.ev.who === "family");
  offSync();
  /* @office-end */
