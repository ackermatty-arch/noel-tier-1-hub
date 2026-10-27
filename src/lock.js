/* ============================================================
   🔒 NOËL LOCK: optional PIN / Face ID lock
   - Off until the person turns it on (Review tab → Privacy).
   - The PIN is never stored, only a salted PBKDF2 fingerprint of it,
     inside the encrypted vault. Face ID / fingerprint runs on the
     phone itself (iPhone app only). Nothing leaves the device.
   - Locks when the app opens, and again after 1 minute in the background.
   ============================================================ */
(function () {
  "use strict";
  const KEY = "xmasHub_lock", ITER = 200000, RELOCK_MS = 60000;
  const $ = s => document.querySelector(s);
  const enc = new TextEncoder();
  const b64 = a => btoa(String.fromCharCode.apply(null, new Uint8Array(a)));
  const unb64 = s => Uint8Array.from(atob(s), c => c.charCodeAt(0));
  let mode = "unlock", firstPin = "", resolveGate = null, tries = 0, waitUntil = 0, hiddenAt = 0;

  const cfg = () => { try { return JSON.parse(NoelVault.getItem(KEY) || "null"); } catch (e) { return null; } };
  const bioPlugin = () => (window.NoelNative && NoelNative.plugin("NativeBiometric")) || null;

  async function hashPin(pin, salt) {
    const base = await crypto.subtle.importKey("raw", enc.encode(pin), "PBKDF2", false, ["deriveBits"]);
    return b64(await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt, iterations: ITER }, base, 256));
  }
  async function bioAvailable() {
    const p = bioPlugin(); if (!p) return false;
    try { return !!(await p.isAvailable()).isAvailable; } catch (e) { return false; }
  }
  async function tryBio() {
    const p = bioPlugin(), c = cfg(); if (!p || !c || !c.bio) return false;
    try { await p.verifyIdentity({ reason: "Unlock Noël Tier 1 Hub", title: "Unlock Noël" }); return true; } catch (e) { return false; }
  }

  function show(m) {
    mode = m; firstPin = "";
    const set = m !== "unlock";
    $("#lockMsg").textContent = set ? "Choose a PIN of 4 to 8 numbers." : "Enter your PIN to open your lists.";
    $("#lockSubmit").textContent = set ? "NEXT" : "UNLOCK";
    $("#lockForgot").hidden = set; $("#lockCancel").hidden = !set;
    $("#lockBio").hidden = true;
    if (!set && cfg() && cfg().bio && bioPlugin()) $("#lockBio").hidden = false;
    $("#lockErr").textContent = ""; $("#lockInput").value = "";
    $("#lockScreen").hidden = false; document.body.classList.add("lock");
    setTimeout(() => $("#lockInput").focus(), 250);
  }
  function hide() {
    $("#lockScreen").hidden = true;
    if (!document.querySelector(".sheet.open, .alert-overlay.show")) document.body.classList.remove("lock");
    if (resolveGate) { const r = resolveGate; resolveGate = null; r(); }
  }
  function err(t) { $("#lockErr").textContent = t; $("#lockInput").value = ""; if (navigator.vibrate) navigator.vibrate([30, 40, 30]); }

  async function submit(e) {
    e.preventDefault();
    const pin = $("#lockInput").value.trim();
    if (mode === "unlock") {
      if (Date.now() < waitUntil) { err(`Too many tries. Wait ${Math.ceil((waitUntil - Date.now()) / 1000)} seconds.`); return; }
      const c = cfg(); if (!c) { hide(); return; }
      if (await hashPin(pin, unb64(c.salt)) === c.hash) { tries = 0; hide(); return; }
      tries++; if (tries >= 5) { waitUntil = Date.now() + 30000; tries = 0; }
      err("That PIN doesn't match."); return;
    }
    if (!/^\d{4,8}$/.test(pin)) { err("Use 4 to 8 numbers."); return; }
    if (mode === "set") { firstPin = pin; mode = "confirm"; $("#lockMsg").textContent = "Type the same PIN again."; $("#lockSubmit").textContent = "SAVE PIN"; $("#lockInput").value = ""; $("#lockErr").textContent = ""; return; }
    if (pin !== firstPin) { mode = "set"; firstPin = ""; $("#lockMsg").textContent = "Choose a PIN of 4 to 8 numbers."; $("#lockSubmit").textContent = "NEXT"; err("Those didn't match. Let's try again."); return; }
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const old = cfg();
    NoelVault.setItem(KEY, JSON.stringify({ salt: b64(salt), hash: await hashPin(pin, salt), bio: !!(old && old.bio) }));
    await NoelVault.flush();
    hide(); Lock.refreshCard();
    alert("🔒 App lock is on.\n\nPlease remember your PIN. If you forget it, the only way back in is to erase this phone's Noël data and restore a backup.");
  }

  const Lock = {
    // called before the app starts: waits until unlocked (or returns at once if the lock is off)
    async check() {
      wire();
      const preview = !cfg() && /[?&]lock\b/.test(location.search);   // ?lock = preview the login screen (no PIN needed)
      if (!cfg() && !preview) return;
      await new Promise(res => { resolveGate = res; show("unlock"); if (preview) { $("#lockForgot").hidden = true; $("#lockMsg").textContent = "Enter your PIN to open your lists. (Preview: tap UNLOCK to go in.)"; } tryBio().then(ok => { if (ok) hide(); }); });
    },
    async refreshCard() {
      const c = cfg(), on = !!c;
      $("#lockStatus").textContent = on ? "App lock is on." : "App lock is off.";
      $("#lockSet").textContent = on ? "Change PIN" : "🔒 Set a PIN";
      $("#lockOff").hidden = !on;
      const bio = on && await bioAvailable();
      $("#lockBioRow").style.display = bio ? "flex" : "none";
      $("#lockBioToggle").checked = !!(c && c.bio);
    }
  };

  let wired = false;
  function wire() {
    if (wired) return; wired = true;
    $("#lockForm").addEventListener("submit", submit);
    $("#lockBio").addEventListener("click", async () => { if (await tryBio()) hide(); });
    $("#lockCancel").addEventListener("click", () => { $("#lockScreen").hidden = true; if (!document.querySelector(".sheet.open, .alert-overlay.show")) document.body.classList.remove("lock"); });
    $("#lockForgot").addEventListener("click", () => {
      if (!confirm("Forgot your PIN?\n\nThe only way back in is to erase all Noël data on this phone. You can then restore a backup if you saved one.")) return;
      if (!confirm("Erase everything on this phone and start fresh? This can't be undone.")) return;
      Object.keys(localStorage).filter(k => k.startsWith("xmasHub_")).forEach(k => localStorage.removeItem(k));
      location.reload();
    });
    $("#lockSet").addEventListener("click", () => show("set"));
    $("#lockOff").addEventListener("click", async () => {
      if (!confirm("Turn off app lock? Anyone with your phone will be able to open Noël.")) return;
      NoelVault.removeItem(KEY); await NoelVault.flush(); Lock.refreshCard();
    });
    $("#lockBioToggle").addEventListener("change", async e => {
      const c = cfg(); if (!c) return;
      if (e.target.checked && !(await bioPlugin().verifyIdentity({ reason: "Turn on Face ID for Noël", title: "Unlock Noël" }).then(() => true, () => false))) { e.target.checked = false; return; }
      c.bio = e.target.checked; NoelVault.setItem(KEY, JSON.stringify(c));
    });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) { hiddenAt = Date.now(); return; }
      if (cfg() && hiddenAt && Date.now() - hiddenAt > RELOCK_MS && $("#lockScreen").hidden) { show("unlock"); tryBio().then(ok => { if (ok) hide(); }); }
    });
    Lock.refreshCard();
  }
  window.NoelLock = Lock;
})();
