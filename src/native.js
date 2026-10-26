/* ============================================================
   📱 NOËL NATIVE: iPhone app extras (does nothing in a browser)
   - Duty timers ring as phone notifications, even if Noël is closed.
   - Weekly check-ins become phone reminders (no calendar or Google needed).
   All reminders are scheduled on the phone itself. Nothing is sent anywhere.
   ============================================================ */
(function () {
  "use strict";
  const plugins = {};
  function isNative() { const C = window.Capacitor; return !!(C && C.isNativePlatform && C.isNativePlatform()); }
  function plugin(name) {
    if (!isNative()) return null;
    if (plugins[name]) return plugins[name];
    const C = window.Capacitor, reg = (window.capacitorExports && window.capacitorExports.registerPlugin) || C.registerPlugin;
    plugins[name] = reg ? reg(name) : (C.Plugins && C.Plugins[name]) || null;
    return plugins[name];
  }
  const LN = () => plugin("LocalNotifications");
  const DUTY_BASE = 1000, CHECKIN_BASE = 5000;

  async function allowed() {
    const ln = LN(); if (!ln) return false;
    try {
      let p = await ln.checkPermissions();
      if (p.display === "prompt" || p.display === "prompt-with-rationale") p = await ln.requestPermissions();
      return p.display === "granted";
    } catch (e) { return false; }
  }
  async function cancelRange(lo, hi) {
    const ln = LN(); if (!ln) return;
    lo += Native.offset; hi += Native.offset;   // 🏢 the Office space keeps its own range
    try {
      const { notifications } = await ln.getPending();
      const ids = (notifications || []).filter(n => n.id >= lo && n.id < hi).map(n => ({ id: n.id }));
      if (ids.length) await ln.cancel({ notifications: ids });
    } catch (e) { /* nothing pending */ }
  }

  let dutyQueue = Promise.resolve();
  const Native = {
    offset: 0,
    isNative,
    plugin,
    // called every time the timers are saved: phone alarms always match the app
    syncDuties(duties) {
      if (!isNative()) return;
      dutyQueue = dutyQueue.then(async () => {
        await cancelRange(DUTY_BASE, CHECKIN_BASE);
        const now = Date.now();
        const running = (duties || []).map((d, i) => ({ d, i })).filter(x => x.d.status === "running" && x.d.endAt > now + 1500);
        if (!running.length || !(await allowed())) return;
        await LN().schedule({ notifications: running.map(({ d, i }) => ({
          id: Native.offset + DUTY_BASE + i,
          title: `${d.icon || "⏰"} ${d.name || "Timer"}`,
          body: "⏰ Time's up! Tap to open Noël.",
          schedule: { at: new Date(d.endAt), allowWhileIdle: true }
        })) });
      }).catch(() => {});
    },
    // weekly "time to check in" reminders through Christmas
    async scheduleCheckins(dates) {
      if (!isNative()) return false;
      if (!(await allowed())) return false;
      await cancelRange(CHECKIN_BASE, CHECKIN_BASE + 100);
      const now = Date.now(), future = dates.filter(d => d.getTime() > now).slice(0, 60);
      if (future.length) await LN().schedule({ notifications: future.map((d, i) => ({
        id: Native.offset + CHECKIN_BASE + i, title: "🎄 Time to check in!", body: "Open Noël to check your list, gifts and budget.",
        schedule: { at: d, allowWhileIdle: true }
      })) });
      return true;
    },
    cancelCheckins: () => cancelRange(CHECKIN_BASE, CHECKIN_BASE + 100),
    // any list of { t, title, body } as phone notifications, using ids lo…hi (replaces what was there)
    scheduleList(lo, hi, items) {
      if (!isNative()) return;
      dutyQueue = dutyQueue.then(async () => {
        await cancelRange(lo, hi);
        const list = items.filter(x => x.t > Date.now() + 1000).slice(0, hi - lo);
        if (!list.length || !(await allowed())) return;
        await LN().schedule({ notifications: list.map((x, i) => ({ id: Native.offset + lo + i, title: x.title, body: x.body || "", schedule: { at: new Date(x.t), allowWhileIdle: true } })) });
      }).catch(() => {});
    }
  };
  window.NoelNative = Native;
})();
