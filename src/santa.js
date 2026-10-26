  /* ============================================================
     🎅 SANTA'S SECRET LIST (Gifts → Santa)
     Gifts "from Santa" behind their own grown-ups-only PIN, so little
     ones can't peek. Locks again when you leave the tab, when the phone
     goes to the background, or after 3 minutes. The amounts still count
     in the gift budget, but no names or items show anywhere else.
     The PIN is never stored, only a salted fingerprint of it.
     ============================================================ */
  let santa2 = load("santaList", { pin: null, kids: [] });
  let santaOpen = false, santaTimer = null, santaSetFirst = "";
  const santaGifts = () => santa2.kids.flatMap(k => k.gifts.concat((k.stock || []).map(x => ({ price: x.price, status: x.got ? "bought" : "idea" }))));   // 🧦 stocking stuffers count too
  async function santaHash(pin, saltB64) {
    const salt = Uint8Array.from(atob(saltB64), c => c.charCodeAt(0));
    const base = await crypto.subtle.importKey("raw", new TextEncoder().encode(pin), "PBKDF2", false, ["deriveBits"]);
    const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt, iterations: 150000 }, base, 256);
    return btoa(String.fromCharCode(...new Uint8Array(bits)));
  }
  function santaLock() { santaOpen = false; clearTimeout(santaTimer); santaSetFirst = ""; if (!$("#paneSanta").hidden) renderSanta2(); }
  function santaPoke() { clearTimeout(santaTimer); santaTimer = setTimeout(santaLock, 180000); }
  document.addEventListener("visibilitychange", () => { if (document.hidden) santaLock(); });

  function renderSanta2() {
    const el = $("#paneSanta");
    if (!santaOpen) {
      const setting = !santa2.pin;
      el.innerHTML = `<div class="card santa-lock">
        <div class="santa-hat">🎅</div>
        <h3>Santa's Secret List</h3>
        <p class="review-sub">${setting ? "Grown-ups only! Choose a Santa PIN (4–8 numbers) that the kids don't know. Keep it different from your phone's passcode." : "Grown-ups only. Enter the Santa PIN to open the list."}</p>
        <form id="santaPinForm" autocomplete="off">
          <input class="input santa-pin" id="santaPin" type="password" inputmode="numeric" pattern="[0-9]*" maxlength="8" placeholder="${setting ? (santaSetFirst ? "Type it again" : "New Santa PIN") : "Santa PIN"}" aria-label="Santa PIN">
          <button class="btn btn-red btn-block" type="submit">${setting ? (santaSetFirst ? "Save PIN" : "Next") : "🔓 Open Santa's list"}</button>
        </form>
        <div class="santa-warn"><b>⚠️ Write your PIN down somewhere safe, away from this app.</b><br>There is no backup and no way to recover a lost PIN, not even for us. If it's forgotten, the only way back in is to erase Santa's list and start again.<br><small>Ideas: a note in your wallet, your password manager, or tucked inside a book only grown-ups use.</small></div>
        ${setting ? "" : `<button type="button" class="classy-link santa-forgot" id="santaForgot">Forgot the PIN?</button>`}
      </div>`;
      setTimeout(() => { const i = $("#santaPin"); if (i) i.focus(); }, 100);
      return;
    }
    const all = santaGifts(), spent = sum(all, isSpent), planned = sum(all, () => true);
    el.innerHTML = `<div class="card santa-head"><div><b>🎅 Santa's Secret List</b><small>${all.length} ${all.length === 1 ? "gift" : "gifts"} · ${money(spent)} spent · ${money(planned)} planned</small></div>
        <button type="button" class="btn btn-ghost" id="santaLockBtn">🔒 Lock</button></div>
      <p class="santa-note">These amounts count in your gift budget, but nothing here shows anywhere else in the app.</p>
      ${santa2.kids.map(k => `<div class="card person" data-skid="${k.id}">
        <div class="person-head"><span class="p-avatar">🎁</span><div class="p-name">${esc(k.name)}<small>${money(sum(k.gifts, () => true))} from Santa</small></div>
          <button class="icon-btn" data-sact="delkid" aria-label="Remove ${esc(k.name)}">✕</button></div>
        <ul class="gift-items">${k.gifts.map(g => { const s = STATUSES.find(x => x.key === g.status) || STATUSES[0];
          return `<li class="gift-item ${s.key}" data-sgid="${g.id}"><button class="status-chip s-${s.key}" data-sact="status">${s.icon} ${s.label}</button>
            <span class="g-name">${esc(g.name)}${g.spot ? `<small class="santa-spot">📍 Hidden: ${esc(g.spot)}</small>` : ""}</span><span class="g-price">${money(+g.price || 0)}</span>
            <button class="icon-btn" data-sact="delgift" aria-label="Remove">✕</button></li>`; }).join("")}</ul>
        ${stockHtml(k)}
        <form class="santa-add" data-skadd autocomplete="off">
          <input class="input" name="name" maxlength="60" placeholder="Gift from Santa" aria-label="Gift">
          <input class="input" name="price" type="number" inputmode="decimal" min="0" placeholder="$" aria-label="Price">
          <input class="input" name="spot" maxlength="40" placeholder="Hiding spot (optional)" aria-label="Hiding spot">
          <button class="btn btn-green" type="submit">Add</button>
        </form></div>`).join("")}
      <form class="card add-task santa-kid" id="santaKidForm" autocomplete="off">
        <h3>➕ Add a child (or anyone with a stocking)</h3>
        <div class="santa-kid-row"><input class="input" name="kid" maxlength="30" placeholder="Name" aria-label="Name"><button class="btn btn-green" type="submit">Add</button></div>
      </form>
      <button type="button" class="btn btn-ghost btn-block" id="santaChangePin">Change the Santa PIN</button>`;
  }

  // 🧦 stocking stuffers for each person, with quick ideas
  function stockHtml(k) {
    const st = k.stock || [], tot = st.reduce((a, x) => a + (+x.price || 0), 0), have = new Set(st.map(x => x.name));
    const ideas = (GIDEAS.stocking || []).filter(x => !have.has(x[0])), pick = ideas.slice((k.ideaAt || 0) % Math.max(1, ideas.length)).concat(ideas).slice(0, 4);
    return `<div class="stock-box"><div class="stock-head"><b>🧦 Stocking</b><small>${st.length} ${st.length === 1 ? "item" : "items"} · ${money(tot)}</small></div>
      <ul class="host-list">${st.map(x => `<li data-stk="${x.id}"><label class="${x.got ? "on" : ""}"><input type="checkbox" data-stgot ${x.got ? "checked" : ""}><span>${esc(x.name)}${+x.price ? ` · ${money(+x.price)}` : ""}</span></label><button type="button" class="icon-btn" data-sact="delstock" aria-label="Remove">✕</button></li>`).join("")}</ul>
      <div class="apps-filters stock-ideas">${pick.map(x => `<button type="button" class="chip" data-stidea="${esc(x[0])}" data-stp="${Math.round((x[2] + x[3]) / 2)}">＋ ${esc(x[0])}</button>`).join("")}<button type="button" class="chip" data-sact="moreideas">↻ More ideas</button></div>
      <form class="santa-add stock-add" data-stadd autocomplete="off"><input class="input" name="name" maxlength="50" placeholder="Stocking stuffer" aria-label="Stocking stuffer"><input class="input" name="price" type="number" inputmode="decimal" min="0" placeholder="$" aria-label="Price"><button class="btn btn-green" type="submit">Add</button></form></div>`;
  }
  $("#paneSanta").addEventListener("change", e => {
    if (!santaOpen || e.target.dataset.stgot == null) return; santaPoke();
    const k = santa2.kids.find(x => x.id === e.target.closest("[data-skid]").dataset.skid), it = k && (k.stock || []).find(x => x.id === e.target.closest("[data-stk]").dataset.stk);
    if (it) { it.got = e.target.checked; save("santaList", santa2); renderSanta2(); renderGifts(); }
  });
  $("#paneSanta").addEventListener("submit", async e => {
    e.preventDefault(); const f = e.target;
    if (f.id === "santaPinForm") {
      const pin = $("#santaPin").value.trim();
      if (!santa2.pin) {
        if (!/^\d{4,8}$/.test(pin)) { toast("🎅 Use 4 to 8 numbers"); return; }
        if (!santaSetFirst) { santaSetFirst = pin; renderSanta2(); return; }
        if (pin !== santaSetFirst) { santaSetFirst = ""; toast("Those didn't match. Let's try again"); renderSanta2(); return; }
        const salt = btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(16))));
        santa2.pin = { salt, hash: await santaHash(pin, salt) }; save("santaList", santa2);
        santaSetFirst = ""; santaOpen = true; santaPoke(); renderSanta2(); toast("🎅 Santa PIN saved. Write it down somewhere safe!"); return;
      }
      if (await santaHash(pin, santa2.pin.salt) === santa2.pin.hash) { santaOpen = true; santaPoke(); renderSanta2(); }
      else { toast("🎅 That's not the Santa PIN"); $("#santaPin").value = ""; if (navigator.vibrate) navigator.vibrate([30, 40, 30]); }
      return;
    }
    if (!santaOpen) return;
    santaPoke();
    if (f.id === "santaKidForm") {
      const n = f.kid.value.trim(); if (!n) return;
      santa2.kids.push({ id: uid(), name: n, gifts: [] }); save("santaList", santa2); renderSanta2(); renderGifts(); return;
    }
    if (f.hasAttribute("data-stadd")) {
      const k = santa2.kids.find(x => x.id === f.closest("[data-skid]").dataset.skid), name = f.name.value.trim(); if (!k || !name) return;
      (k.stock = k.stock || []).push({ id: uid(), name, price: parseFloat(f.price.value) || 0, got: false });
      save("santaList", santa2); renderSanta2(); renderGifts(); toast("🧦 Into the stocking!"); return;
    }
    if (f.hasAttribute("data-skadd")) {
      const k = santa2.kids.find(x => x.id === f.closest("[data-skid]").dataset.skid), name = f.name.value.trim(); if (!k || !name) return;
      k.gifts.push({ id: uid(), name, price: parseFloat(f.price.value) || 0, status: "idea", spot: f.spot.value.trim() });
      save("santaList", santa2); renderSanta2(); renderGifts(); toast("🎅 Added to Santa's list");
    }
  });
  $("#paneSanta").addEventListener("click", e => {
    const t = e.target;
    if (t.closest("#santaForgot")) {
      if (!confirm("Forgot the Santa PIN? The only way back in is to erase Santa's list and start over.")) return;
      if (!confirm("Erase Santa's secret list and PIN? This can't be undone.")) return;
      santa2 = { pin: null, kids: [] }; save("santaList", santa2); renderSanta2(); renderGifts(); return;
    }
    if (!santaOpen) return;
    santaPoke();
    if (t.closest("#santaLockBtn")) { santaLock(); toast("🔒 Santa's list is locked"); return; }
    if (t.closest("#santaChangePin")) { santa2.pin = null; save("santaList", santa2); santaOpen = false; renderSanta2(); toast("🎅 Choose a new Santa PIN"); return; }
    const idea = t.closest("[data-stidea]");
    if (idea) { const k = santa2.kids.find(x => x.id === idea.closest("[data-skid]").dataset.skid); (k.stock = k.stock || []).push({ id: uid(), name: idea.dataset.stidea, price: +idea.dataset.stp || 0, got: false }); save("santaList", santa2); renderSanta2(); renderGifts(); toast("🧦 Into the stocking!"); return; }
    const b = t.closest("[data-sact]"); if (!b) return;
    const k = santa2.kids.find(x => x.id === b.closest("[data-skid]").dataset.skid); if (!k) return;
    const act = b.dataset.sact;
    if (act === "moreideas") { k.ideaAt = (k.ideaAt || 0) + 4; save("santaList", santa2); renderSanta2(); return; }
    if (act === "delstock") { k.stock = (k.stock || []).filter(x => x.id !== b.closest("[data-stk]").dataset.stk); save("santaList", santa2); renderSanta2(); renderGifts(); return; }
    if (act === "delkid") { if (!confirm(`Remove ${k.name} and their Santa gifts?`)) return; santa2.kids = santa2.kids.filter(x => x !== k); }
    else {
      const g = k.gifts.find(x => x.id === b.closest("[data-sgid]").dataset.sgid); if (!g) return;
      if (act === "status") { const i = STATUSES.findIndex(s => s.key === g.status); g.status = STATUSES[(i + 1) % STATUSES.length].key; }
      if (act === "delgift") k.gifts = k.gifts.filter(x => x !== g);
    }
    save("santaList", santa2); renderSanta2(); renderGifts();
  });
  /* @santa-end */
