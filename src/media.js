/* ============================================================
   🎬 NOËL MEDIA: turn a flip card or invite into a video or picture
   - Everything is made on the phone. Nothing is uploaded.
   - Video: the card fades in, flips open and plays its own music
     (about 10 seconds, MP4 on iPhone).
   - Picture: the front and inside side by side, as one image.
   - Sharing opens the phone's share sheet (Messages, Mail, WhatsApp…).
   ============================================================ */
(function () {
  "use strict";
  const W = 360, H = 504;                       // card size used by the app (5:7)
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const frame = () => new Promise(r => requestAnimationFrame(() => r()));

  // ---- the card's own styles + built-in fonts, so the snapshot looks identical ----
  let cssCache = null;
  function cardCss() {
    if (cssCache) return cssCache;
    let all = "";
    document.querySelectorAll("style").forEach(s => { all += s.textContent + "\n"; });
    const a = all.indexOf("💌 INVITE CARDS"), b = all.indexOf("/* ---------- 💌 Invites tab");
    const cards = a > -1 && b > a ? all.slice(all.lastIndexOf("/*", a), b) : "";
    const fonts = (document.getElementById("embeddedFonts") || {}).textContent || "";
    cssCache = fonts + "\n" + cards +
      "\n*{animation:none!important;transition:none!important}" +
      ".inv{width:" + W + "px!important;margin:0!important}" +
      ".inv .flip-inner{transform:none!important;width:" + W + "px;height:" + H + "px}" +
      ".inv .face{transform:none!important;backface-visibility:visible!important;-webkit-backface-visibility:visible!important;box-shadow:none!important}" +
      ".inv .rsvp,.inv .rsvp-name,.inv .hint{display:none!important}";
    return cssCache;
  }

  function loadImg(src) {
    return new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = () => rej(new Error("Could not draw the card")); i.src = src; });
  }

  // one face (front or inside) → an image at 2× sharpness
  async function snapshot(face) {
    const clone = face.cloneNode(true);
    const html = '<div xmlns="http://www.w3.org/1999/xhtml" class="inv"><style>' + cardCss() + '</style>' +
      '<div class="flip"><div class="flip-inner">' + new XMLSerializer().serializeToString(clone) + '</div></div></div>';
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + W * 2 + '" height="' + H * 2 + '" viewBox="0 0 ' + W + ' ' + H + '">' +
      '<foreignObject x="0" y="0" width="' + W + '" height="' + H + '">' + html + '</foreignObject></svg>';
    const src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
    await loadImg(src);           // first load warms up the fonts
    await sleep(120);
    return loadImg(src);
  }

  // build the card off screen with the app's own renderer, then photograph both sides
  async function cardImages(buildEl) {
    const host = document.createElement("div");
    host.style.cssText = "position:fixed;left:-10000px;top:0;width:" + W + "px;pointer-events:none";
    host.appendChild(buildEl());
    document.body.appendChild(host);
    try {
      if (document.fonts && document.fonts.ready) await document.fonts.ready;
      await frame(); await frame();
      const front = await snapshot(host.querySelector(".face.front"));
      const inside = await snapshot(host.querySelector(".face.back"));
      return { front, inside };
    } finally { host.remove(); }
  }

  // ---- drawing helpers ----
  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  }
  function drawCard(ctx, img, cx, cy, w, h, sx) {
    const dw = Math.max(0.001, w * sx);
    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,.38)"; ctx.shadowBlur = 40; ctx.shadowOffsetY = 18;
    roundRect(ctx, cx - dw / 2, cy - h / 2, dw, h, 26 * Math.min(1, sx + .2)); ctx.fillStyle = "#fff"; ctx.fill();
    ctx.restore();
    ctx.save(); roundRect(ctx, cx - dw / 2, cy - h / 2, dw, h, 26 * Math.min(1, sx + .2)); ctx.clip();
    ctx.drawImage(img, cx - dw / 2, cy - h / 2, dw, h);
    if (sx < 1) { ctx.fillStyle = "rgba(0,0,0," + (0.35 * (1 - sx)).toFixed(3) + ")"; ctx.fillRect(cx - dw / 2, cy - h / 2, dw, h); }
    ctx.restore();
  }
  // gentle gold sparkles that drift upward
  const SPARKS = Array.from({ length: 34 }, (_, i) => ({ x: (i * 197) % 720, y: (i * 331) % 1280, r: 1.2 + (i % 4) * .7, s: 14 + (i % 5) * 7, p: i * .7 }));
  function background(ctx, t, kicker) {
    const g = ctx.createLinearGradient(0, 0, 720, 1280); g.addColorStop(0, "#21402F"); g.addColorStop(1, "#13281E");
    ctx.fillStyle = g; ctx.fillRect(0, 0, 720, 1280);
    SPARKS.forEach(s => {
      const y = (s.y - t * s.s + 1280) % 1280, a = .25 + .35 * (0.5 + 0.5 * Math.sin(t * 1.6 + s.p));
      ctx.fillStyle = "rgba(217,191,140," + a.toFixed(3) + ")"; ctx.beginPath(); ctx.arc(s.x, y, s.r, 0, Math.PI * 2); ctx.fill();
    });
    ctx.fillStyle = "#D9BF8C"; ctx.textAlign = "center";
    ctx.font = "500 22px Poppins, sans-serif"; spaced(ctx, kicker, 360, 150, 7);
    ctx.fillStyle = "rgba(243,235,218,.45)"; ctx.font = "300 17px Poppins, sans-serif"; spaced(ctx, "MADE WITH NOËL TIER 1 HUB", 360, 1215, 3);
  }
  function spaced(ctx, text, cx, y, gap) {          // letter-spaced capitals
    const chars = [...text], widths = chars.map(c => ctx.measureText(c).width);
    let x = cx - (widths.reduce((a, b) => a + b, 0) + gap * (chars.length - 1)) / 2;
    ctx.textAlign = "left"; chars.forEach((c, i) => { ctx.fillText(c, x, y); x += widths[i] + gap; }); ctx.textAlign = "center";
  }
  const ease = p => p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;

  function pickType() {
    if (!window.MediaRecorder) return null;
    return ["video/mp4;codecs=avc1.42E01E,mp4a.40.2", "video/mp4", "video/webm;codecs=vp9,opus", "video/webm;codecs=vp8,opus", "video/webm"]
      .find(t => { try { return MediaRecorder.isTypeSupported(t); } catch (e) { return false; } }) || null;
  }

  const Media = {
    canVideo: () => !!(pickType() && HTMLCanvasElement.prototype.captureStream),
    cardImages,

    // ⚠️ call straight from a tap so the phone allows the music to play
    async video({ buildEl, songSrc, kicker, onProgress }) {
      const type = pickType(); if (!type) throw new Error("no-video");
      const AC = window.AudioContext || window.webkitAudioContext, ac = AC ? new AC() : null;
      if (ac && ac.state === "suspended") ac.resume();
      const { front, inside } = await cardImages(buildEl);
      const canvas = document.createElement("canvas"); canvas.width = 720; canvas.height = 1280;
      const ctx = canvas.getContext("2d");
      const stream = canvas.captureStream(30);
      let src = null, gain = null;
      if (ac && songSrc) {
        try {
          const buf = await ac.decodeAudioData(await (await fetch(songSrc)).arrayBuffer());
          const dest = ac.createMediaStreamDestination();
          src = ac.createBufferSource(); src.buffer = buf; gain = ac.createGain();
          src.connect(gain).connect(dest);
          dest.stream.getAudioTracks().forEach(t => stream.addTrack(t));
        } catch (e) { src = null; }              // no music is better than no video
      }
      const DUR = 10, FLIP_AT = 3, FLIP = 1.2;
      const cw = 540, ch = 756, cx = 360, cy = 660;
      const draw = t => {
        background(ctx, t, kicker);
        const fade = Math.min(1, t / .6);
        ctx.globalAlpha = fade;
        const p = Math.min(1, Math.max(0, (t - FLIP_AT) / FLIP)), e = ease(p);
        if (p < .5) drawCard(ctx, front, cx, cy, cw, ch, Math.cos(e * Math.PI));
        else drawCard(ctx, inside, cx, cy, cw, ch, -Math.cos(e * Math.PI));
        ctx.globalAlpha = Math.max(0, Math.min(1, (t - (DUR - .6)) / .6));   // soft fade to pine at the end
        if (ctx.globalAlpha > 0) { ctx.fillStyle = "#13281E"; ctx.fillRect(0, 0, 720, 1280); }
        ctx.globalAlpha = 1;
      };
      draw(0);
      const chunks = [], rec = new MediaRecorder(stream, { mimeType: type, videoBitsPerSecond: 3500000 });
      rec.ondataavailable = e => { if (e.data && e.data.size) chunks.push(e.data); };
      const done = new Promise(res => { rec.onstop = res; });
      rec.start(250);
      const t0 = performance.now();
      if (src) { gain.gain.setValueAtTime(1, ac.currentTime + DUR - 1.2); gain.gain.linearRampToValueAtTime(0, ac.currentTime + DUR); src.start(); }
      await new Promise(res => {
        const step = () => {
          const t = (performance.now() - t0) / 1000;
          draw(Math.min(t, DUR)); if (onProgress) onProgress(Math.min(1, t / DUR));
          if (t >= DUR) res(); else requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        // keep drawing even if a frame is missed (e.g. screen dims)
      });
      rec.stop(); await done;
      try { src && src.stop(); } catch (e) {}
      stream.getTracks().forEach(t => t.stop()); if (ac) ac.close();
      const mime = type.split(";")[0];
      return { blob: new Blob(chunks, { type: mime }), ext: mime === "video/mp4" ? "mp4" : "webm" };
    },

    // front and inside, side by side
    async picture({ buildEl }) {
      const { front, inside } = await cardImages(buildEl);
      const c = document.createElement("canvas"); c.width = 1600; c.height = 1180;
      const ctx = c.getContext("2d");
      ctx.fillStyle = "#FBF6EC"; ctx.fillRect(0, 0, c.width, c.height);
      drawCard(ctx, front, 420, 560, 680, 952, 1);
      drawCard(ctx, inside, 1180, 560, 680, 952, 1);
      ctx.fillStyle = "rgba(30,58,47,.45)"; ctx.font = "300 22px Poppins, sans-serif"; ctx.textAlign = "center";
      spaced(ctx, "MADE WITH NOËL TIER 1 HUB", 800, 1125, 4);
      return new Promise(res => c.toBlob(res, "image/jpeg", 0.92));
    },

    // phone share sheet (native app), else the browser's, else download
    async share(blob, name, text) {
      const N = window.NoelNative, fs = N && N.plugin("Filesystem"), sh = N && N.plugin("Share");
      if (fs && sh) {
        const data = await new Promise(res => { const r = new FileReader(); r.onload = () => res(String(r.result).split(",")[1]); r.readAsDataURL(blob); });
        const { uri } = await fs.writeFile({ path: name, data, directory: "CACHE" });
        await sh.share({ title: name, text, files: [uri] });
        return "shared";
      }
      const file = new File([blob], name, { type: blob.type });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try { await navigator.share({ files: [file], text }); return "shared"; }
        catch (e) { if (e && e.name === "AbortError") return "cancelled"; }
      }
      const url = URL.createObjectURL(blob), a = document.createElement("a");
      a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 10000);
      return "saved";
    }
  };
  window.NoelMedia = Media;
})();
