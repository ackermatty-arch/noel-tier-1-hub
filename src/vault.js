/* ============================================================
   🔐 NOËL VAULT: encrypted on-device storage
   - Every saved list and setting is encrypted with AES-256-GCM
     before it touches the phone's storage.
   - The key never leaves the device:
       iPhone app  → kept in the iOS Keychain (Android: Keystore)
       web version → a locked (non-exportable) key in the browser
   - Nothing is ever sent anywhere. No accounts, no servers.
   - Older plain data is encrypted automatically on first launch.
   ============================================================ */
(function () {
  "use strict";
  const PREFIX = "xmasHub_";          // same prefix the app has always used
  const TAG = "enc1:";                // marks a value as encrypted
  const KEY_NAME = "noel_vault_key";
  const cache = new Map();            // decrypted values, in memory only
  const pending = new Map();          // key -> latest value waiting to be written
  let cryptoKey = null, writing = null, failed = [];

  const b64 = buf => { let s = ""; const a = new Uint8Array(buf); for (let i = 0; i < a.length; i += 0x8000) s += String.fromCharCode.apply(null, a.subarray(i, i + 0x8000)); return btoa(s); };
  const unb64 = s => Uint8Array.from(atob(s), c => c.charCodeAt(0));
  const enc = new TextEncoder(), dec = new TextDecoder();

  const nativeStore = () => (window.NoelNative && NoelNative.plugin("SecureStoragePlugin")) || null;

  // ---- web: keep a non-exportable key in IndexedDB ----
  function idb(mode, fn) {
    return new Promise((res, rej) => {
      const open = indexedDB.open("noel-vault", 1);
      open.onupgradeneeded = () => open.result.createObjectStore("keys");
      open.onerror = () => rej(open.error);
      open.onsuccess = () => {
        const tx = open.result.transaction("keys", mode), st = tx.objectStore("keys");
        const r = fn(st); tx.oncomplete = () => res(r && r.result); tx.onerror = () => rej(tx.error);
      };
    });
  }
  async function getKey() {
    const ns = nativeStore();
    if (ns) {                                   // 📱 Keychain / Keystore
      let raw = null;
      try { raw = (await ns.get({ key: KEY_NAME })).value; } catch (e) { raw = null; }
      if (!raw) { raw = b64(crypto.getRandomValues(new Uint8Array(32))); await ns.set({ key: KEY_NAME, value: raw }); }
      return crypto.subtle.importKey("raw", unb64(raw), "AES-GCM", false, ["encrypt", "decrypt"]);
    }
    let k = await idb("readonly", st => st.get(KEY_NAME));   // 🌐 browser
    if (!k) {
      k = await crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
      await idb("readwrite", st => st.put(k, KEY_NAME));
    }
    return k;
  }
  async function seal(text) {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const ct = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, cryptoKey, enc.encode(text));
    const out = new Uint8Array(12 + ct.byteLength); out.set(iv); out.set(new Uint8Array(ct), 12);
    return TAG + b64(out);
  }
  async function open(stored) {
    const a = unb64(stored.slice(TAG.length));
    return dec.decode(await crypto.subtle.decrypt({ name: "AES-GCM", iv: a.subarray(0, 12) }, cryptoKey, a.subarray(12)));
  }

  // ---- write queue: values are written one after another, newest wins ----
  function pump() {
    if (writing || !pending.size) return writing || Promise.resolve();
    writing = (async () => {
      await null;   // let "writing" be set first (a delete alone finishes without waiting)
      while (pending.size) {
        const [k, v] = pending.entries().next().value; pending.delete(k);
        try {
          if (v === null) localStorage.removeItem(k);
          else localStorage.setItem(k, await seal(v));
        } catch (e) { console.warn("Noël: could not save", k, e); }
      }
      writing = null;
    })();
    return writing;
  }

  const Vault = {
    encrypted: false,
    failedKeys: () => failed.slice(),
    async ready() {
      if (!window.crypto || !crypto.subtle) throw new Error("This device can't encrypt data");
      cryptoKey = await getKey();
      const keys = [];
      for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k && k.startsWith(PREFIX)) keys.push(k); }
      for (const k of keys) {
        const v = localStorage.getItem(k);
        if (v === null) continue;
        if (v.startsWith(TAG)) {
          try { cache.set(k, await open(v)); }
          catch (e) { failed.push(k); }       // keep the stored copy; never wipe data we can't read
        } else { cache.set(k, v); pending.set(k, v); }   // old plain data → encrypt it now
      }
      pump();
      Vault.encrypted = true;
    },
    getItem: k => (cache.has(k) ? cache.get(k) : null),
    setItem(k, v) { v = String(v); cache.set(k, v); pending.set(k, v); pump(); },
    removeItem(k) { cache.delete(k); pending.set(k, null); pump(); },
    keys: () => Array.from(cache.keys()),
    flush: () => pump()
  };
  // save anything still queued when the app goes to the background
  document.addEventListener("visibilitychange", () => { if (document.hidden) Vault.flush(); });
  window.addEventListener("pagehide", () => Vault.flush());
  window.NoelVault = Vault;
})();
