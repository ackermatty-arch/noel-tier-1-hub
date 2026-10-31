  /* ============================================================
     🖨️ PRINTING & THE PRINT TRAY
     Every print button (data-print="key") opens one small choice:
       Print now · Send or save as a PDF · Add to the Print Tray
     The tray works like a shopping cart for printing: collect pages
     while planning, untick anything you don't need, then make ONE PDF
     for a home printer, your computer, or a print shop (Staples etc.).
     The tray remembers WHAT to print, not a copy, so it always prints
     your latest plans. On iPhone a real letter-size PDF is made on the
     phone itself (NoelPdf); nothing is uploaded anywhere.
     ============================================================ */
  let tray = load("printTray", []).filter(k => typeof k === "string");
  let trayOff = {}, trayDone = false, printKey = null;
  const saveTray = () => save("printTray", tray);
  function addrDoc(key) {   // ✉ address book: labels to tape on envelopes, or a tick-off checklist
    const a = (load("addrbook", []) || []).filter(x => x.t !== "E-card" || key === "addrlist");
    if (!a.length) return { error: "Add someone to your address book first" };
    if (key === "addrlabels") {
      const css = `.al{display:grid;grid-template-columns:1fr 1fr;gap:6px 10px;font:11pt/1.35 Georgia,serif;color:#111} .al div{border:1px dashed #cfc3a5;padding:10px 12px;min-height:62px} .al b{display:block}`;
      return { title: "Address labels", css, html: `<div class="al">${a.map(x => `<div><b>${esc(x.n)}</b>${esc(x.s)}${x.s && x.c ? "<br>" : ""}${esc(x.c)}</div>`).join("")}</div>`, margin: 0.5, file: "Address-Labels" };
    }
    const css = `.ac{font:10.5pt/1.4 Georgia,serif;color:#111} .ac h1{font-size:18pt;margin:0 0 8px} .ac h2{font-size:11pt;letter-spacing:.14em;text-transform:uppercase;border-bottom:1px solid #B8935A;margin:12px 0 4px} .ac table{width:100%;border-collapse:collapse} .ac td{padding:4px 5px;border-bottom:1px solid #e6e0d0;vertical-align:top} .ac td.k{width:46px;text-align:center;font-size:8pt;font-family:sans-serif}`;
    const html = `<div class="ac"><h1>Holiday Card Checklist</h1>${["Family","Friends","Work","Neighbours"].map(g => { const l = a.filter(x => x.g === g); return l.length ? `<h2>${g}</h2><table><tr><td class="k">Sent</td><td class="k">Got</td><td></td></tr>${l.map(x => `<tr><td class="k">${x.sent ? "✓" : "☐"}</td><td class="k">${x.got ? "✓" : "☐"}</td><td><b>${esc(x.n)}</b> <i>(${esc(x.t)})</i><br>${esc([x.s, x.c].filter(Boolean).join(", "))}</td></tr>`).join("")}</table>` : ""; }).join("")}</div>`;
    return { title: "Card checklist", css, html, margin: 0.55, file: "Card-Checklist" };
  }
  function printDoc(key) {
    let d = null;
    if (key.startsWith("meal:")) { const m = mealById(key.slice(5)); d = m ? mealDoc(m) : null; }
    else if (key.startsWith("shop:")) { const m = mealById(key.slice(5)); d = m ? shopDoc(m) : null; }
    else if (key.startsWith("theme:")) d = themeDoc(key.slice(6));
    else if (key === "survival") d = survivalDoc();
    else if (key === "selfcare") d = selfCareDoc();
    else if (key === "place") d = placeDoc();
    else if (key === "oysign" || key === "oysheet" || key.startsWith("oycard:")) d = oyDoc(key);
    else if (key === "fridge") d = fridgeDoc();
    else if (key === "travel") d = travelDoc();
    else if (key === "planall") d = planAllDoc();
    else if (key === "addrlabels" || key === "addrlist") d = addrDoc(key);
    else if (key === "chores") d = choresDoc();
    else if (key === "budget") d = budgetDoc();
    else if (key === "shared") d = shrDoc();
    else if (key === "approval") d = approvalDoc();
    else if (key === "potluck") d = potluckDoc();
    else if (key === "awards") d = awardsDoc();
    else if (key === "yearend") d = yearEndDoc();
    else if (key === "reimburse") d = reimburseDoc();
    else if (key === "ssslips") d = ssSlipsDoc();
    else if (key === "offfood") d = offFoodDoc();
    else if (key === "bidsheets") d = bidSheetsDoc();
    else if (key === "aucwinners") d = aucWinnersDoc();
    else if (key === "offplan") d = offPlanDoc();
    else if (key === "wecard") d = offWEdoc();
    else if (key === "pbsigns") d = offPBdoc();
    else if (key.startsWith("offsaved:")) d = offSavedDoc(key.slice(9));
    else if (key === "labels" || key === "return") d = labelDoc(key);
    else if (key === "calendar") d = calendarDoc();
    else if (key === "mastershop") d = masterShopDoc();
    else if (key.startsWith("savedmenu:")) d = savedMenuDoc(key.slice(10));
    else if (key.startsWith("owndinner:")) d = ownDinnerDoc(key.slice(10));
    if (!d) return { error: "That page isn't available any more" };
    // 🏷️ the family (or company) name across the top of every printed page set
    const who = familyTitle(family);
    if (who && !d.error && !d.noBrand && !d.branded) { d.html = `<div class="pt-brand">${esc(who)}</div>` + d.html; d.css += ` .pt-brand{font:600 8.5pt/1 sans-serif;letter-spacing:.28em;text-transform:uppercase;color:#a8823c;text-align:center;border-bottom:1px solid #e3d6b8;padding:0 0 6px;margin:0 0 14px}`; d.branded = 1; }
    return lowInk(d);
  }
  // 🖨️ low-ink look for every printable: black and grey text, no colour fills, a thin light-gold trim
  const INK_KEEP = "★☆✦✓✕☐✧";
  const LOWINK_CSS = ` html,body{background:#fff!important} *{color:#222!important;background:transparent!important;box-shadow:none!important;text-shadow:none!important;border-color:#D9BF86!important;outline-color:#D9BF86!important}
    h1,h2,h3,h4,b,strong,summary{color:#151515!important} h1{letter-spacing:.04em} h1:after{content:"";display:block;width:100%;border-bottom:1px solid #D9BF86;margin-top:7px}
    h2{border-bottom:1px solid #D9BF86!important} th{background:transparent!important;border-bottom:1px solid #D9BF86!important} td{border-color:#E8D7AE!important}
    li,p,td,span,small,i{color:#2a2a2a!important} .pt-brand{color:#8a7440!important;border-color:#D9BF86!important}`;
  function lowInk(d) {
    if (!d || d.error) return d;
    const sw = { "✅": "✓", "✔": "✓", "☑": "✓", "⛔": "✕", "🚫": "✕", "❌": "✕", "⭐": "★", "🌟": "★", "✨": "✦" };
    d.html = String(d.html).replace(/[✅✔☑⛔🚫❌⭐🌟✨]/gu, c => sw[c]).replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{2300}-\u{23FF}\uFE0F]/gu, c => INK_KEEP.includes(c) ? c : "");
    d.css = String(d.css) + LOWINK_CSS;
    return d;
  }
  // 🕯️ Holiday Self-Care: gentle reminders, a calm plan and a permission slip
  // 🌟 Jenn's original pages (Family side): gold frame, holly, gold star bullets
  const ORIG_CSS = `.og{box-sizing:border-box;min-height:9.25in;border:1.5px solid #c9a24f;outline:.5px solid #c9a24f;outline-offset:-7px;border-radius:16px;padding:.35in .55in .3in;font-family:Georgia,serif;color:#33302a;position:relative}
    .og .og-top{text-align:center;color:#c9a24f;font-size:13pt;letter-spacing:.5em;margin:0} .og .og-holly{font-size:20pt;letter-spacing:0} .og .og-lab{text-align:center;font:600 8pt sans-serif;letter-spacing:.35em;text-transform:uppercase;color:#b8913f;margin:14px 0 4px}
    .og h1{text-align:center;font:400 30pt/1.15 Georgia,serif!important;color:#1e4a33;margin:0!important} .og .og-sub{text-align:center;font:italic 12.5pt Georgia,serif;color:#444;margin:6px 0 4px}
    .og .og-div{text-align:center;color:#c9a24f;margin:4px 0 18px} .og .og-div span{display:inline-block;width:1.3in;border-top:1px solid #c9a24f;vertical-align:middle;margin:0 10px}
    .og .tip{display:grid;grid-template-columns:34px 1fr;gap:6px;margin:0 0 16px} .og .tip i{font-style:normal;color:#c9a24f;font-size:21pt;line-height:1} .og .tip b{display:block;font:600 16pt/1.2 Georgia,serif;color:#1e4a33;margin-bottom:3px} .og .tip span{font:11pt/1.5 sans-serif;color:#444}
    .og .og-close{border:1px solid #c9a24f;border-radius:12px;width:4.6in;margin:22px auto 0;padding:12px;text-align:center;font:italic 13pt/1.45 Georgia,serif;color:#1e4a33;position:relative}
    .og .og-close:before,.og .og-close:after{content:"★";color:#c9a24f;position:absolute;top:50%;transform:translateY(-50%);font-style:normal;font-size:10pt} .og .og-close:before{left:-6px} .og .og-close:after{right:-6px}`;
  function origPage(lab, title, sub, tips, close) {
    return `<div class="og"><p class="og-top">★ ★ <span class="og-holly">🌿</span> ★ ★</p><p class="og-lab">${lab}</p><h1>${title}</h1><p class="og-sub">${sub}</p><p class="og-div"><span></span>★<span></span></p>
      ${tips.map(([h, t]) => `<div class="tip"><i>★</i><div><b>${h}</b><span>${t}</span></div></div>`).join("")}<div class="og-close">${close}</div></div>`;
  }
  function origSelfCare() {
    return { title: "Holiday Self-Care", css: ORIG_CSS + " .og h1{font-size:36pt!important} .og .og-sub{font-size:13.5pt} .og .og-div{margin:8px 0 34px} .og .tip{margin:0 0 34px} .og .tip b{font-size:18.5pt} .og .tip span{font-size:12.5pt} .og .og-close{margin-top:40px;font-size:14pt}", margin: 0.45, file: "Holiday-Self-Care", html: origPage("A gentle reminder", "Holiday Self-Care", "Because you deserve a merry season too", [
      ["Breathe before you begin", "Take three slow breaths before a busy task or a full room."], ["Say no with love", "You don't have to do it all. Protect a few quiet evenings."],
      ["Keep your basics", "Water, sleep and a proper meal make every day a little easier."], ["Step outside", "Ten minutes of fresh air and winter light can lift your whole mood."],
      ["Let it be enough", "Imperfect is still magical. The people matter more than the plans."]], "Be as kind to yourself as you are<br>to everyone you love.") };
  }
  function origSurvival() {
    return { title: "Advanced Family & Social Survival", css: ORIG_CSS + " .og .og-div{margin:6px 0 24px} .og .tip{margin:0 0 15px} .og h1{font-size:26pt!important} .og .tip b{font-size:17pt} .og .tip span{font-size:11.5pt} .og .og-close{margin-top:28px}", margin: 0.45, file: "Advanced-Family-Social-Survival", html: origPage("A holiday survival guide", "Advanced Family &amp; Social Survival", "For when the eggnog runs out before the patience does", [
      ["Establish a Secret Escape Signal", "Agree on a codeword or a frantic eye-twitch with your partner to instantly trigger a fake “plumbing emergency” at family gatherings."],
      ["Mute the Notification Avalanche", "Silence any group chat containing more than four relatives discussing the logistics of a potluck."],
      ["Nod and Smile in Neutral", "Practice your best blank customer-service face for when an aunt comments on your career, hair, or relationship status."],
      ["Redefine Festive Baking", "Buy a box of bakery cookies, transfer them to a plate, dust them with powdered sugar, and look exhausted when you serve them."],
      ["The “Looking for an Ingredient” Strategy", "Stare deeply into the back of the pantry or freezer for five full minutes, pretending to look for nutmeg, just to enjoy the cold silence."],
      ["The “Irish Goodbye” Masterclass", "Slip out of the family gathering while everyone is distracted by a fierce board game argument. Send a text from your couch two hours later: “So sorry, got swept away by the Christmas magic!”"]],
      "Stay merry. Stay hydrated.<br>Always know where the exits are.") };
  }
  function selfCareDoc() {
    const O = hubMode === "company";
    if (!O) return origSelfCare();
    const R = [["🌬️", "Breathe before you rush", "When the to-do list gets loud, stop for three slow breaths. The cookies can wait 30 seconds."],
      ["🎁", "Good enough is wonderful", "Nobody remembers if the bows matched. They remember that you were there and you laughed."],
      ["🙅", "No is a full sentence", "You don't have to go to every party or bake for every event. Choose the ones that light you up."],
      ["🚶", "Step outside every day", "Ten minutes of fresh air, Christmas lights or snow does more than another hour of scrolling."],
      ["⭐", "Fill your own cup too", "Rest, water, a real meal and one small thing just for you. You can't pour from an empty mug."]];
    const perm = O ? ["Leave the party early", "Bring store-bought treats", "Turn on my out-of-office", "Take a real lunch break", "Say no to one more committee", "Not check email over the holidays"]
      : ["Skip a party (or two)", "Buy store-bought cookies", "Take a nap", "Say no without explaining", "Wear pajamas all day", "Not make it perfect"];
    const css = `.sc{font:12pt/1.5 Georgia,serif;color:#2a2a2a} .sc h1{font-size:26pt;margin:0;text-align:center;color:#1E3A2F} .sc .sc-sub{text-align:center;font:italic 10.5pt Georgia,serif;color:#8a6d3b;margin:4px 0 20px}
      .sc .rem{display:grid;grid-template-columns:32px 1fr;gap:12px;align-items:start;margin:0 0 14px} .sc .rem span{font-size:21pt;line-height:1} .sc .rem b{display:block;color:#b3262e;font-size:13pt}
      .sc h2{font-size:13pt;margin:20px 0 6px;color:#1E3A2F;border-bottom:1.5px solid #e3d6b8;padding-bottom:2px} .sc .line{border-bottom:1px solid #bbb;height:30px;margin:0 0 4px}
      .sc .cols{display:grid;grid-template-columns:1fr 1fr;gap:4px 22px} .sc .perm{border:2px dashed #c9b48a;border-radius:10px;padding:14px 18px;margin-top:22px} .sc .perm h3{margin:0 0 6px;font-size:14pt;color:#b3262e;text-align:center}
      .sc .perm ul{list-style:none;margin:0;padding:0;columns:2} .sc .perm li{margin:5px 0} .sc .sign{margin-top:8px;text-align:right;font-size:10pt} .sc .sign span{display:inline-block;width:2.2in;border-bottom:1px solid #999}`;
    const html = `<div class="sc"><h1>🕯️ Holiday Self-Care</h1><p class="sc-sub">Five gentle reminders for a calmer, merrier season</p>
      ${R.map(([i, t, d]) => `<div class="rem"><span>${i}</span><div><b>${t}</b>${d}</div></div>`).join("")}
      <div class="cols"><div><h2>🌿 This week, just for me</h2><div class="line"></div><div class="line"></div><div class="line"></div><div class="line"></div></div>
        <div><h2>⭐ Things I can let go of</h2><div class="line"></div><div class="line"></div><div class="line"></div><div class="line"></div></div></div>
      <div class="perm"><h3>📜 Official Permission Slip</h3><p style="text-align:center;margin:0 0 6px">I hereby give myself permission to:</p><ul>${perm.map(x => `<li>☐ ${x}</li>`).join("")}</ul>
        <p class="sign">Signed: <span></span></p></div></div>`;
    return { title: "Holiday Self-Care", css, html, margin: 0.55, file: "Holiday-Self-Care" };
  }
  // 😅 the Holiday Survival Guide (Family) / Office Party Survival Guide (Office)
  function survivalDoc() {
    const O = hubMode === "company";
    if (!O) return origSurvival();
    return { title: "Advanced Office & Social Survival", css: ORIG_CSS + " .og .og-div{margin:6px 0 24px} .og .tip{margin:0 0 15px} .og h1{font-size:26pt!important} .og .tip b{font-size:17pt} .og .tip span{font-size:11.5pt} .og .og-close{margin-top:28px}", margin: 0.45, file: "Advanced-Office-Social-Survival",
      html: origPage("An office survival guide", "Advanced Office &amp; Social Survival", "For when the eggnog runs out before the patience does", [
        ["Establish a Secret Escape Signal", "Agree on a codeword or a frantic eye-twitch with your work bestie to instantly trigger a fake “urgent client call” at the office party."],
        ["Mute the Notification Avalanche", "Silence any group chat containing more than four coworkers discussing the logistics of a potluck."],
        ["Nod and Smile in Neutral", "Practice your best blank customer-service face for when a coworker comments on your workload, haircut, or holiday plans."],
        ["Redefine Festive Baking", "Buy a box of bakery cookies, transfer them to a plate, dust them with powdered sugar, and look exhausted when you set them in the break room."],
        ["The “Looking for a Stapler” Strategy", "Stare deeply into the back of the supply closet for five full minutes, pretending to look for staples, just to enjoy the quiet."],
        ["The “Irish Goodbye” Masterclass", "Slip out of the office party while everyone is distracted by a fierce gift-exchange steal. Send a message from your couch two hours later: “So sorry, got swept away by the holiday magic!”"]],
        "Stay merry. Stay hydrated.<br>Always know where the exits are.") };
    const G = O ? {
      title: "The Office Party Survival Guide", sub: "For surviving the most wonderful (and most awkward) time of the work year",
      kit: ["A name tag (even if everyone knows you)", "Breath mints", "Comfy shoes for the conga line", "A fully charged phone", "Your famous dip, labelled", "A polite reason to leave at 9", "A gift within the limit (really)", "Stain remover pen"],
      rules: [["The Reply-All Rule", "Never reply-all to the party invite. Ever."], ["Potluck Law", "If you didn't bring a dish, you bring the compliments."], ["The Last Cookie Standoff", "It belongs to whoever cut it in half first."], ["Karaoke Clause", "What happens at karaoke stays at karaoke."], ["The Gift Limit Pact", "$25 means $25. The fancy candle is not \"basically $25.\""], ["Shop-Talk Ban", "First person to mention a deadline refills the punch."]],
      safe: ["Weekend plans", "Best snack on the table", "Holiday traditions", "Pets (always pets)", "Which holiday movie is best"], avoid: ["Salaries", "Politics", "Who ate whose lunch in March", "\"Let's circle back in January\""],
      sos: [["Forgot your Secret Santa gift?", "\"It's on back-order. From the North Pole.\""], ["Spilled the punch?", "It's festive now."], ["Stuck in a long conversation?", "\"I promised I'd help with the awards!\""], ["Boss starts a speech?", "Nod, smile, clap at the pauses."]],
      bingo: ["Someone wears a reindeer sweater", "Boss gives a speech", "Somebody talks about work anyway", "Last-cookie standoff", "\"New year, new me\"", "Printer jams on the awards", "Someone's famous dip appears", "Out-of-office set early", "Ugly sweater photo"]
    } : {
      title: "The Official Holiday Survival Guide", sub: "For surviving the most wonderful (and most exhausting) time of the year",
      kit: ["Stretchy pants (for after dinner)", "Extra tape (it always disappears)", "Batteries in every size", "A secret chocolate stash", "Phone charger (hidden from the teens)", "Earplugs for the new drum set", "Coffee", "More coffee"],
      rules: [["The Cookie Rule", "Cookies eaten standing up don't count."], ["Leftover Law", "If it's still in the fridge on Dec 30, it's officially a snack."], ["The Thermostat Treaty", "Whoever touches the thermostat does the dishes."], ["The Wrapping Rule", "If it's a weird shape, it goes in a bag. No shame."], ["The Elf Clause", "The elf may \"forget\" to move once. He's tired too."], ["The Nap Accord", "Anyone asleep on the couch after dinner may not be disturbed (or photographed… much)."]],
      safe: ["How good the food is", "Pets", "Favourite Christmas movie (careful…)", "The weather", "Best gift you ever got"], avoid: ["Politics", "\"So, are you seeing anyone?\"", "\"When are you having kids?\"", "Who won Monopoly in 2019"],
      sos: [["Forgot a gift?", "\"It's being shipped from the North Pole. Delays, you know.\""], ["Burnt the rolls?", "They're \"rustic.\""], ["Out of tape?", "Bows hide everything."], ["Kids awake at 4 AM?", "\"Santa's still nearby. Back to bed!\""]],
      bingo: ["Someone falls asleep on the couch", "A toy needs batteries you don't have", "The dog steals food", "\"It's the thought that counts\"", "Song stuck in your head", "Wrapping-paper fort", "Someone wears new PJs all day", "Lost a gift receipt", "Someone cries at a movie"]
    };
    const bingo = G.bingo.slice(0, 4).concat(["⭐ FREE SPACE<br>You survived!"], G.bingo.slice(4, 8));
    const css = `.sv{font:10.5pt/1.4 Georgia,serif;color:#222} .sv h1{font-size:22pt;margin:0;text-align:center;color:#1E3A2F} .sv .sv-sub{text-align:center;font:italic 10.5pt Georgia,serif;color:#8a6d3b;margin:2px 0 12px}
      .sv h2{font-size:12pt;margin:10px 0 4px;color:#b3262e;border-bottom:1.5px solid #e3d6b8;padding-bottom:2px} .sv .cols{display:grid;grid-template-columns:1fr 1fr;gap:4px 22px} .sv ul{margin:0;padding:0;list-style:none} .sv li{margin:2px 0}
      .sv .rule b{color:#1E3A2F} .sv table{width:100%;border-collapse:collapse;margin-top:4px} .sv td{border:1.5px solid #c9b48a!important;width:33.3%!important;height:.62in;text-align:center!important;vertical-align:middle!important;font-size:9.5pt;padding:4px!important;line-height:1.25;white-space:normal!important}
      .sv td.free{background:#f6efdc;font-weight:bold;color:#b3262e} .sv .cert{margin-top:12px;text-align:center;font-size:11pt} .sv .cert span{display:inline-block;border-bottom:1px solid #999;width:2.6in}`;
    const html = `<div class="sv"><h1>😅 ${G.title}</h1><p class="sv-sub">${G.sub}</p>
      <div class="cols"><div><h2>🧰 Your Survival Kit</h2><ul>${G.kit.map(x => `<li>☐ ${esc(x)}</li>`).join("")}</ul></div>
        <div><h2>📜 The Official Rules</h2><ul>${G.rules.map(([a, b]) => `<li class="rule"><b>${esc(a)}:</b> ${esc(b)}</li>`).join("")}</ul></div></div>
      <div class="cols"><div><h2>🗣️ Safe Topics</h2><ul>${G.safe.map(x => `<li>✅ ${esc(x)}</li>`).join("")}</ul><h2>🚫 Danger Zone</h2><ul>${G.avoid.map(x => `<li>⛔ ${esc(x)}</li>`).join("")}</ul></div>
        <div><h2>🆘 Emergency Plans</h2><ul>${G.sos.map(([a, b]) => `<li><b>${esc(a)}</b> ${esc(b)}</li>`).join("")}</ul></div></div>
      <h2>🎯 ${O ? "Office Party" : "Holiday"} Survival Bingo</h2><table>${[0, 1, 2].map(r => `<tr>${bingo.slice(r * 3, r * 3 + 3).map(x => `<td class="${/FREE/.test(x) ? "free" : ""}">${/FREE/.test(x) ? x : esc(x)}</td>`).join("")}</tr>`).join("")}</table>
      <p class="cert">🏅 Certified ${O ? "Office Party" : "Holiday"} Survivor: <span></span></p></div>`;
    return { title: G.title, css, html, margin: 0.5, file: O ? "Office-Party-Survival-Guide" : "Holiday-Survival-Guide" };
  }
  // rough page count: lay the page out at letter width in a sealed-off box and measure it
  function estPages(d) {
    if (d.pages) return d.pages;
    const host = document.createElement("div");
    host.style.cssText = "position:fixed;left:-9999px;top:0;visibility:hidden";
    document.body.appendChild(host);
    const root = host.attachShadow ? host.attachShadow({ mode: "open" }) : host;
    root.innerHTML = `<style>${d.css}</style><div style="width:${8.5 - 2 * d.margin}in;font:12pt/1.45 Georgia,serif">${d.html}</div>`;
    const h = root.lastElementChild.scrollHeight; host.remove();
    return Math.max(1, Math.ceil(h / ((11 - 2 * d.margin) * 96) - 0.08));
  }
  const pagesTxt = n => `${n} ${n === 1 ? "page" : "pages"}`;
  const fullHtml = d => `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>${d.fonts ? (document.getElementById("embeddedFonts") || {}).textContent || "" : ""}${d.css} html,body{margin:0;padding:0;background:#fff;-webkit-print-color-adjust:exact;print-color-adjust:exact}</style></head><body>${d.html}</body></html>`;

  // make the PDF (iPhone) or open the print window (web) for a list of pages
  async function runPrint(docs, how, fileName) {
    const N = NoelNative.isNative(), pdf = N && NoelNative.plugin("NoelPdf");
    if (N && pdf) {
      toast("🖨️ Making your PDF…");
      try {
        const r = await pdf.make({ docs: docs.map(d => ({ html: fullHtml(d), margin: d.margin })), fileName: fileName + ".pdf" });
        if (how === "print") { const p = await pdf.print({ uri: r.uri, name: fileName.replace(/-/g, " ") }); return p && p.printed ? "printed" : "cancelled"; }
        const sh = NoelNative.plugin("Share"); await sh.share({ title: fileName + ".pdf", files: [r.uri] }); return "shared";
      } catch (e) {
        if (/cancel/i.test(String(e && e.message))) return "cancelled";
        // older app build without the PDF maker: fall back to a print-ready page in the share sheet
        const page = docs.map((d, i) => `<section style="${i ? "break-before:page;page-break-before:always;" : ""}padding:${d.margin}in">${d.html}</section>`).join("");
        const css = [...new Set(docs.map(d => d.css))].join("\n");
        return NoelMedia.share(new Blob([fullHtml({ css, html: page, fonts: docs.some(d => d.fonts) })], { type: "text/html" }), fileName + ".html", fileName).catch(() => "cancelled");
      }
    }
    // 🌐 web: everything goes into the print area, one section per page set, then the browser's print window
    const css = [...new Set(docs.map(d => d.css))].join("\n");
    $("#printArea").innerHTML = `<style>@page{margin:.5in} @page zero{margin:0} @media print { ${css} #printArea .pt-zero{page:zero} #printArea .pt-sec + .pt-sec{break-before:page;page-break-before:always} }</style>` +
      docs.map(d => `<section class="pt-sec${d.margin ? "" : " pt-zero"}">${d.html}</section>`).join("");
    setTimeout(() => window.print(), 60);
    return "printed";
  }

  // ---------- the small choice window ----------
  function printAsk(key) {
    const d = printDoc(key); if (d.error) { toast(d.error); return; }
    printKey = key;
    const meal = key.startsWith("meal:") && mealById(key.slice(5)), inTray = tray.includes(key), N = NoelNative.isNative();
    $("#printAskTitle").textContent = d.title;
    $("#printAskSub").textContent = `About ${pagesTxt(estPages(d))}${d.note ? " · " + d.note : ""}`;
    $("#printAskBtns").innerHTML = `<button type="button" class="btn btn-ghost btn-block" data-pa="view">Look at it first</button><button type="button" class="btn btn-red btn-block" data-pa="now">🖨️ Print now</button>
      ${N ? `<button type="button" class="btn btn-ghost btn-block" data-pa="share">📤 Send or save as a PDF</button>` : ""}
      ${meal && !meal.addon ? `<button type="button" class="btn btn-ghost btn-block" data-pa="shop">🛒 Just the shopping list</button>` : ""}
      <button type="button" class="btn btn-green btn-block" data-pa="tray" ${inTray ? "disabled" : ""}>${inTray ? "✓ Already in your Print Tray" : "＋ Add to Print Tray"}</button>`;
    $("#printAskHow").textContent = N ? "Send or save lets you AirDrop it to your computer, email it, or save it to Files for a print shop." : "Tip: collect pages in the Print Tray and print them all at once.";
    $("#printAsk").classList.add("show");
  }
  const closeAsk = () => $("#printAsk").classList.remove("show");
  // 👁 look at the page first, before printing or saving
  function printPreview(d) {
    const old = document.getElementById("printView"); if (old) old.remove();
    const el = document.createElement("div"); el.id = "printView"; el.className = "pv-overlay"; el.setAttribute("role", "dialog"); el.setAttribute("aria-modal", "true");
    el.innerHTML = `<div class="pv-bar"><b>${esc(d.title)}</b><button type="button" class="btn btn-ghost btn-sm" data-pvclose>Back</button></div><iframe class="pv-frame" title="Preview"></iframe>`;
    document.body.appendChild(el);
    // 📄 pages with a margin are shown as real paper: a white letter-size sheet on a soft backdrop, shrunk to fit the phone
    let pd = d;
    if (d.margin) {
      const sheets = String(d.html).split('<div class="pa-break"></div>').map(h => `<div class="pv-sheet">${h}</div>`).join("");
      pd = Object.assign({}, d, { html: sheets,
        css: d.css + ` html,body{background:#E4DFD3 !important} body{padding:10px 10px 24px !important} .pv-sheet{box-sizing:border-box;max-width:8.5in;margin:0 auto 14px;padding:22px 18px;background:#fff !important;box-shadow:0 2px 10px rgba(0,0,0,.25);border-top:3px solid #C9A45C;overflow:hidden;font-size:15px} .pv-sheet h1{font-size:22px} .pv-sheet h2{font-size:16px} .pv-sheet table{font-size:14px}` });
    }
    el.querySelector("iframe").srcdoc = fullHtml(pd);
    el.addEventListener("click", e => { if (e.target.closest("[data-pvclose]")) el.remove(); });
  }
  document.addEventListener("click", e => {
    const b = e.target.closest("[data-print]"); if (b) { e.preventDefault(); printAsk(b.dataset.print); }
  });
  $("#printAsk").addEventListener("click", async e => {
    if (e.target === $("#printAsk") || e.target.closest("#printAskClose")) { closeAsk(); return; }
    const b = e.target.closest("[data-pa]"); if (!b || !printKey) return;
    const act = b.dataset.pa;
    if (act === "tray") { trayAdd(printKey); closeAsk(); return; }
    if (act === "view") { const dv = printDoc(printKey); if (dv.error) { toast(dv.error); return; } printPreview(dv); return; }
    if (act === "shop") { printKey = "shop:" + printKey.slice(5); printAsk(printKey); return; }
    const d = printDoc(printKey); if (d.error) { toast(d.error); return; }
    closeAsk(); await runPrint([d], act === "share" ? "share" : "print", d.file || "Noel-Printable");
  });

  // ---------- the tray ----------
  function trayAdd(key) {
    if (!tray.includes(key)) { tray.push(key); saveTray(); }
    trayDone = false; trayBadge();
    toast(`🖨️ Added to your Print Tray (${tray.length})`);
    const b = $("#trayBtn"); b.classList.remove("bump"); void b.offsetWidth; b.classList.add("bump");
  }
  function trayBadge() { $("#trayCount").textContent = tray.length; $("#trayCount").hidden = !tray.length; }   // the tray button always shows; the number only when there's something in it
  function renderTray() {
    const items = tray.map(k => ({ k, d: printDoc(k) }));
    const on = items.filter(x => !x.d.error && !trayOff[x.k]), total = on.reduce((a, x) => a + estPages(x.d), 0), N = NoelNative.isNative();
    $("#trayBody").innerHTML = !items.length ? `<div class="card tray-empty"><div class="tray-big">🖨️</div><h3>Your Print Tray is empty</h3><p>Whenever you tap a 🖨️ Print button, choose <b>＋ Add to Print Tray</b>. Collect everything you need, then print it all in one go.</p></div>` : `
      ${trayDone ? `<div class="card tray-done"><p>✅ All done? Clear the printed pages out of your tray.</p><button type="button" class="btn btn-green btn-block" id="trayClearDone">🧹 Clear the tray</button></div>` : ""}
      <div class="card tray-list">${items.map(({ k, d }) => `<label class="tray-item${d.error ? " bad" : ""}" data-tk="${esc(k)}">
          <input type="checkbox" ${!d.error && !trayOff[k] ? "checked" : ""} ${d.error ? "disabled" : ""}>
          <span class="ti-txt"><b>${esc(d.title || "Page")}</b><small>${d.error ? esc(d.error.replace(/^\W+/, "")) : `About ${pagesTxt(estPages(d))}${d.note ? " · " + esc(d.note) : ""}`}</small></span>
          <button type="button" class="icon-btn" data-tdel aria-label="Remove from tray">✕</button></label>`).join("")}</div>
      <div class="card tray-go"><p class="tray-total">${on.length ? `<b>${on.length}</b> ${on.length === 1 ? "item" : "items"} · about <b>${pagesTxt(total)}</b>` : "Tick at least one item"}</p>
        <button type="button" class="btn btn-red btn-block" id="trayPrint" ${on.length ? "" : "disabled"}>🖨️ Print on my printer</button>
        ${N ? `<button type="button" class="btn btn-ghost btn-block" id="trayShare" ${on.length ? "" : "disabled"}>📤 Send to my computer or save the PDF</button>` : `<p class="host-rem">To save a PDF instead, choose "Save as PDF" in the print window.</p>`}
        <button type="button" class="classy-link tray-clear" id="trayClear">Empty the tray</button></div>
      <details class="card tray-shop"><summary>🏪 No printer? Print at Staples or another print shop</summary>
        <ol>
          <li>Tap <b>${N ? "📤 Send to my computer or save the PDF" : "🖨️ Print"}</b>${N ? ", then <b>Save to Files</b>" : " and choose <b>Save as PDF</b>"}. You'll get one PDF with everything ticked above.</li>
          <li>Open your print shop's website or app (most have "upload to print"), or email the PDF to the store. You can also bring it on a USB stick.</li>
          <li>Ask for <b>letter size (8½ × 11)</b>, printed at <b>actual size / 100%</b>, not "fit to page".</li>
          <li>Printing mailing labels? Bring your own <b>Avery 5160</b> label sheets, or ask if they stock them.</li>
        </ol>
        <p class="host-rem">Noël never sends your plans anywhere by itself. You choose where the PDF goes.</p></details>`;
  }
  function trayOpen() { renderTray(); openSheet("traySheet"); }
  $("#trayBtn").addEventListener("click", trayOpen);
  $("#traySheet").addEventListener("change", e => {
    const it = e.target.closest("[data-tk]"); if (it && e.target.type === "checkbox") { trayOff[it.dataset.tk] = !e.target.checked; renderTray(); }
  });
  $("#traySheet").addEventListener("click", async e => {
    const t = e.target;
    const del = t.closest("[data-tdel]"); if (del) { e.preventDefault(); const k = del.closest("[data-tk]").dataset.tk; tray = tray.filter(x => x !== k); delete trayOff[k]; saveTray(); trayBadge(); renderTray(); return; }
    if (t.closest("#trayClear") || t.closest("#trayClearDone")) {
      if (t.closest("#trayClear") && !confirm("Empty the Print Tray?")) return;
      const keep = t.closest("#trayClearDone") ? tray.filter(k => trayOff[k]) : [];
      tray = keep; trayOff = {}; trayDone = false; saveTray(); trayBadge(); renderTray();
      if (!tray.length) toast("🧹 Print Tray cleared");
      return;
    }
    const pr = t.closest("#trayPrint"), sh = t.closest("#trayShare"); if (!pr && !sh) return;
    const docs = tray.filter(k => !trayOff[k]).map(printDoc).filter(d => !d.error); if (!docs.length) return;
    const r = await runPrint(docs, sh ? "share" : "print", "Noel-Printables");
    if (r !== "cancelled") { trayDone = true; renderTray(); }
  });
  trayBadge();
  /* @print-end */
