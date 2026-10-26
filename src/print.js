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
  function printDoc(key) {
    let d = null;
    if (key.startsWith("meal:")) { const m = mealById(key.slice(5)); d = m ? mealDoc(m) : null; }
    else if (key.startsWith("shop:")) { const m = mealById(key.slice(5)); d = m ? shopDoc(m) : null; }
    else if (key.startsWith("theme:")) d = themeDoc(key.slice(6));
    else if (key === "place") d = placeDoc();
    else if (key === "fridge") d = fridgeDoc();
    else if (key === "chores") d = choresDoc();
    else if (key === "budget") d = budgetDoc();
    else if (key === "approval") d = approvalDoc();
    else if (key === "potluck") d = potluckDoc();
    else if (key === "awards") d = awardsDoc();
    else if (key === "yearend") d = yearEndDoc();
    else if (key === "reimburse") d = reimburseDoc();
    else if (key === "ssslips") d = ssSlipsDoc();
    else if (key === "bidsheets") d = bidSheetsDoc();
    else if (key === "aucwinners") d = aucWinnersDoc();
    else if (key === "labels" || key === "return") d = labelDoc(key);
    return d || { error: "That page isn't available any more" };
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
    $("#printAskBtns").innerHTML = `<button type="button" class="btn btn-red btn-block" data-pa="now">🖨️ Print now</button>
      ${N ? `<button type="button" class="btn btn-ghost btn-block" data-pa="share">📤 Send or save as a PDF</button>` : ""}
      ${meal && !meal.addon ? `<button type="button" class="btn btn-ghost btn-block" data-pa="shop">🛒 Just the shopping list</button>` : ""}
      <button type="button" class="btn btn-green btn-block" data-pa="tray" ${inTray ? "disabled" : ""}>${inTray ? "✓ Already in your Print Tray" : "＋ Add to Print Tray"}</button>`;
    $("#printAskHow").textContent = N ? "Send or save lets you AirDrop it to your computer, email it, or save it to Files for a print shop." : "Tip: collect pages in the Print Tray and print them all at once.";
    $("#printAsk").classList.add("show");
  }
  const closeAsk = () => $("#printAsk").classList.remove("show");
  document.addEventListener("click", e => {
    const b = e.target.closest("[data-print]"); if (b) { e.preventDefault(); printAsk(b.dataset.print); }
  });
  $("#printAsk").addEventListener("click", async e => {
    if (e.target === $("#printAsk") || e.target.closest("#printAskClose")) { closeAsk(); return; }
    const b = e.target.closest("[data-pa]"); if (!b || !printKey) return;
    const act = b.dataset.pa;
    if (act === "tray") { trayAdd(printKey); closeAsk(); return; }
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
