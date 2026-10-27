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
  /* Gold & black night scene (Santa sleigh silhouette over a gold globe) */
  const SLEIGH = "M18.9 2.9 L18.3 8.8 L20.0 18.3 L23.6 24.8 L28.9 28.9 L34.8 35.4 L37.7 43.0 L39.5 54.8 L38.3 55.4 L30.7 51.9 L32.4 45.4 L32.4 40.1 L30.1 34.8 L27.7 45.4 L26.5 46.6 L24.2 44.8 L18.3 32.4 L16.5 33.0 L18.3 44.8 L17.7 46.6 L7.7 34.2 L6.5 34.8 L7.7 41.3 L12.4 48.3 L17.1 51.9 L34.8 60.1 L37.7 62.5 L36.6 63.7 L29.5 64.9 L15.3 73.7 L1.8 76.7 L0.0 79.6 L1.2 84.3 L6.5 89.0 L11.2 90.2 L25.9 90.8 L29.5 92.0 L22.4 110.8 L18.9 131.5 L20.6 149.8 L25.4 162.7 L10.0 162.7 L5.3 163.9 L2.4 166.3 L2.4 171.6 L4.1 175.1 L44.2 222.9 L51.3 225.2 L66.0 235.8 L74.9 238.8 L80.2 238.2 L80.2 235.3 L78.4 231.7 L72.5 224.6 L69.6 224.6 L66.6 227.0 L60.7 220.5 L61.9 219.3 L66.6 218.8 L64.3 213.4 L60.7 209.9 L53.7 208.1 L51.3 205.8 L44.2 192.2 L45.4 191.0 L58.4 185.7 L80.8 194.0 L113.2 198.7 L130.3 210.5 L142.7 215.8 L150.4 222.9 L153.9 228.8 L156.2 235.8 L158.6 260.0 L162.1 268.3 L168.6 274.8 L176.3 279.5 L179.8 280.1 L181.0 277.1 L178.1 267.7 L175.1 264.7 L169.8 263.6 L165.7 257.7 L164.5 240.6 L167.5 218.8 L167.5 212.3 L165.7 209.3 L157.4 204.6 L151.5 199.3 L148.6 194.6 L148.6 189.9 L153.3 178.1 L155.1 168.0 L189.3 178.7 L189.9 202.2 L191.0 208.1 L195.8 220.5 L178.1 221.1 L174.5 224.1 L174.5 229.4 L183.4 273.0 L185.7 279.5 L190.4 284.8 L197.5 288.9 L204.6 291.3 L209.9 290.7 L201.7 275.9 L194.6 274.8 L191.0 271.8 L185.7 258.3 L186.3 255.9 L192.2 263.6 L197.5 267.7 L205.2 270.0 L211.7 269.5 L210.5 264.2 L206.4 258.8 L203.4 257.1 L196.9 255.9 L192.2 250.6 L189.9 242.9 L189.9 238.8 L191.6 235.3 L208.1 241.7 L218.8 272.4 L226.4 290.7 L234.7 299.5 L242.3 303.7 L248.2 305.4 L255.3 304.8 L254.7 301.3 L251.2 295.4 L247.1 291.3 L238.8 291.3 L235.8 288.3 L233.5 283.0 L241.2 281.2 L240.6 276.5 L239.4 274.2 L234.7 270.0 L227.0 269.5 L225.2 267.7 L221.1 257.7 L221.7 248.8 L222.9 247.6 L225.2 247.6 L257.1 255.3 L285.4 258.3 L290.7 261.2 L297.2 268.3 L299.5 269.5 L308.4 278.3 L313.1 286.0 L318.4 301.3 L323.1 328.4 L326.7 335.5 L336.1 343.8 L344.3 347.9 L346.1 347.9 L347.3 346.7 L346.1 340.8 L342.6 333.1 L340.2 330.8 L336.1 330.8 L332.5 328.4 L330.2 324.3 L327.2 314.3 L326.7 297.8 L327.8 283.6 L329.0 282.4 L331.4 282.4 L336.1 286.0 L337.3 288.9 L343.2 325.5 L345.5 333.7 L348.5 339.6 L356.1 347.9 L361.4 351.4 L368.5 354.4 L374.4 354.4 L373.2 347.3 L369.7 341.4 L366.2 338.4 L360.3 337.9 L356.1 335.5 L353.2 332.0 L350.2 324.9 L348.5 314.9 L348.5 294.8 L350.8 277.7 L350.2 271.2 L346.1 268.3 L330.2 263.0 L326.1 259.4 L324.9 257.1 L324.9 252.4 L333.1 221.7 L367.9 230.0 L369.1 231.1 L369.1 255.3 L372.6 268.3 L377.9 280.1 L369.1 281.8 L363.2 284.2 L360.8 287.1 L360.8 291.9 L363.2 296.6 L409.2 349.1 L419.2 355.0 L431.0 358.5 L435.7 357.9 L435.7 354.4 L434.0 350.8 L427.5 342.6 L418.0 342.6 L408.0 335.5 L402.7 330.2 L380.9 301.9 L379.1 298.3 L379.7 297.2 L403.9 299.5 L436.3 309.0 L470.5 311.9 L482.9 318.4 L499.4 329.6 L505.9 336.7 L510.6 346.1 L514.7 357.9 L520.6 383.3 L524.8 390.3 L533.6 398.0 L542.5 402.1 L546.6 402.1 L547.2 398.0 L543.6 390.3 L539.5 386.8 L533.0 385.6 L529.5 382.1 L527.7 378.5 L521.2 350.2 L521.2 336.7 L521.8 336.1 L527.1 337.9 L531.2 341.4 L538.9 363.2 L543.0 380.9 L546.6 388.6 L556.6 398.6 L568.4 404.5 L572.5 403.3 L572.5 399.8 L568.4 391.5 L564.3 388.0 L559.6 388.0 L556.6 386.8 L553.1 383.3 L550.1 377.4 L546.0 359.1 L541.3 329.6 L539.5 324.9 L536.6 321.9 L525.9 316.6 L521.2 311.9 L518.3 306.0 L517.7 294.2 L519.5 288.3 L520.0 279.5 L516.5 264.2 L520.6 263.6 L556.0 265.9 L606.7 265.9 L645.6 264.2 L655.7 265.9 L664.5 264.7 L668.6 263.0 L669.2 266.5 L666.3 274.8 L646.8 301.3 L639.7 316.6 L635.6 335.5 L636.8 346.1 L643.3 359.1 L655.1 370.3 L664.5 376.2 L673.9 380.3 L687.5 384.4 L705.8 387.4 L707.5 389.2 L704.6 395.0 L699.9 399.8 L664.5 396.8 L656.2 396.8 L654.5 398.6 L654.5 402.7 L658.0 405.1 L694.0 407.4 L696.9 409.8 L693.4 412.1 L686.3 412.1 L645.0 408.0 L621.5 404.5 L609.1 400.4 L597.9 393.9 L582.5 380.3 L576.1 369.1 L574.3 362.6 L573.7 354.4 L574.9 347.3 L577.8 340.2 L586.7 330.2 L594.3 326.1 L600.2 324.9 L611.4 326.7 L616.7 329.6 L621.5 334.3 L625.0 341.4 L625.0 352.0 L621.5 359.1 L613.2 365.0 L605.5 365.6 L600.2 363.8 L594.9 359.1 L592.6 353.8 L593.2 346.1 L596.7 342.0 L599.1 340.8 L604.4 340.8 L607.3 342.0 L609.7 344.3 L609.7 346.7 L606.7 350.8 L607.3 352.0 L610.3 353.2 L613.2 352.0 L615.0 349.6 L615.6 346.1 L613.2 341.4 L609.7 337.9 L605.5 335.5 L600.8 334.9 L596.7 336.1 L593.2 338.4 L589.6 342.6 L587.3 349.6 L588.4 357.9 L593.8 365.6 L597.9 368.5 L603.2 370.3 L613.8 369.7 L622.6 365.0 L627.4 359.1 L629.1 355.0 L630.3 344.9 L626.8 333.7 L620.9 326.7 L616.7 323.7 L609.7 320.8 L597.3 320.2 L585.5 324.3 L575.5 332.5 L569.6 342.6 L567.2 351.4 L567.8 367.3 L572.5 379.7 L577.8 387.4 L584.9 394.5 L596.7 402.7 L609.1 409.2 L618.5 412.7 L629.7 415.7 L642.1 417.5 L790.7 429.2 L954.0 444.0 L959.3 439.9 L957.0 436.3 L954.0 434.6 L888.6 428.7 L884.4 425.7 L885.6 423.9 L931.0 427.5 L933.4 426.3 L935.7 423.3 L932.2 419.2 L882.7 415.1 L879.1 411.6 L876.2 401.5 L879.7 399.8 L893.3 398.0 L907.4 392.1 L917.5 385.0 L928.1 373.8 L936.9 360.3 L942.8 346.7 L958.1 290.1 L962.9 278.3 L964.0 277.1 L971.7 280.1 L980.0 280.1 L990.6 275.4 L997.6 266.5 L999.4 261.2 L999.4 251.2 L996.5 243.5 L992.3 238.2 L984.1 232.3 L968.2 224.6 L968.8 214.6 L967.0 209.9 L962.9 205.8 L955.8 203.4 L947.5 205.2 L944.0 207.5 L937.5 214.6 L929.8 219.9 L921.0 222.9 L909.2 224.6 L895.0 231.7 L887.4 215.8 L889.7 212.3 L889.7 207.5 L888.0 202.8 L896.8 191.0 L908.0 196.9 L909.2 205.2 L911.6 208.1 L913.9 209.3 L921.0 209.3 L923.9 207.0 L925.7 202.8 L925.7 199.9 L922.2 195.2 L914.5 192.8 L911.6 189.9 L905.7 175.1 L899.8 168.0 L895.0 165.1 L885.0 162.7 L867.9 162.1 L858.5 166.9 L849.1 173.3 L847.3 177.5 L848.5 183.4 L842.6 194.0 L843.2 195.8 L833.1 197.5 L836.7 202.8 L830.2 210.5 L828.4 214.0 L827.8 220.5 L830.2 228.8 L830.2 233.5 L825.5 237.6 L820.8 237.6 L813.1 234.1 L808.4 228.8 L800.7 226.4 L797.2 214.6 L791.9 219.3 L787.1 215.8 L781.2 213.4 L778.3 213.4 L779.5 221.1 L776.5 232.9 L761.2 234.1 L679.2 234.1 L630.9 232.3 L568.4 228.2 L508.8 222.3 L445.8 214.0 L406.8 207.5 L405.7 204.0 L404.5 189.9 L416.3 184.6 L419.2 181.6 L421.0 175.7 L414.5 174.5 L401.5 177.5 L399.2 174.5 L422.8 169.8 L433.4 165.1 L441.0 158.0 L445.8 152.1 L452.8 150.4 L459.3 146.8 L462.3 143.9 L465.2 138.6 L464.6 132.1 L461.7 134.4 L458.7 139.7 L454.0 143.9 L451.1 145.0 L448.1 145.0 L446.3 143.9 L451.7 129.7 L452.8 122.6 L452.2 115.0 L449.3 109.7 L447.5 114.4 L445.8 127.9 L443.4 133.3 L441.0 135.6 L438.7 133.3 L435.1 118.5 L432.2 114.4 L431.0 130.3 L429.8 130.3 L419.8 119.7 L419.2 123.2 L421.6 129.1 L426.9 134.4 L435.7 140.9 L437.5 144.5 L437.5 148.0 L434.6 153.9 L425.7 162.1 L425.1 159.8 L426.3 155.1 L426.3 148.6 L422.8 142.7 L421.0 154.5 L417.5 161.6 L412.7 165.1 L405.7 165.7 L405.1 164.5 L409.2 150.4 L409.2 146.8 L408.0 144.5 L406.8 144.5 L405.1 148.0 L404.5 152.7 L402.1 156.8 L395.6 162.1 L391.5 143.9 L391.5 141.5 L397.4 134.4 L399.8 128.5 L399.8 124.4 L398.0 120.3 L396.8 119.7 L393.9 131.5 L390.3 135.0 L389.2 135.0 L385.0 125.6 L382.7 108.5 L379.7 115.0 L380.3 129.1 L379.1 129.7 L373.8 121.5 L371.5 105.5 L369.7 105.0 L367.9 109.1 L368.5 122.1 L373.2 131.5 L380.9 137.4 L385.0 142.7 L388.0 151.5 L388.6 161.6 L386.8 162.1 L380.3 159.2 L382.1 152.7 L382.1 145.0 L380.3 142.1 L378.5 142.1 L377.4 150.4 L375.6 153.3 L374.4 152.7 L369.7 142.7 L366.7 140.3 L365.6 142.7 L366.7 149.2 L366.2 152.7 L356.1 140.3 L355.0 140.9 L355.0 145.6 L359.1 153.3 L364.4 158.0 L389.2 170.4 L385.0 172.2 L381.5 172.2 L375.6 173.9 L366.2 181.6 L349.1 185.7 L347.9 186.9 L347.9 189.9 L352.0 196.9 L348.5 197.5 L344.3 195.8 L338.4 188.1 L333.7 192.8 L327.8 192.8 L234.7 171.0 L231.7 169.8 L228.8 166.9 L227.0 137.4 L240.6 131.5 L243.5 127.9 L245.9 120.9 L227.6 124.4 L223.5 123.8 L222.9 121.5 L242.9 117.9 L252.9 113.8 L261.8 107.3 L267.1 100.8 L275.9 98.5 L281.8 95.5 L287.7 88.4 L288.9 84.3 L287.1 80.2 L280.1 89.6 L277.7 91.4 L274.2 92.6 L271.2 92.6 L270.0 91.4 L274.8 75.5 L274.8 63.7 L273.6 59.6 L271.2 56.6 L270.0 59.6 L268.3 75.5 L265.9 81.4 L263.0 84.9 L255.9 59.6 L254.7 59.6 L252.9 61.9 L252.9 67.8 L254.1 72.5 L254.1 76.7 L252.9 79.0 L243.5 66.6 L241.7 67.8 L244.7 76.1 L258.8 88.4 L260.0 90.8 L260.0 96.1 L256.5 102.0 L249.4 107.9 L249.4 95.5 L246.5 91.4 L244.7 99.1 L241.2 107.9 L235.8 112.6 L227.6 113.2 L227.0 112.6 L230.5 106.7 L232.9 100.2 L232.9 93.8 L231.7 91.4 L229.4 89.0 L227.6 100.2 L225.8 103.8 L219.9 109.1 L217.6 107.9 L214.0 92.0 L214.0 89.0 L219.9 83.1 L221.7 79.6 L222.9 74.3 L222.3 68.4 L220.5 66.0 L217.0 77.8 L214.6 80.8 L211.1 82.5 L207.0 65.4 L207.0 58.4 L205.2 56.6 L203.4 58.4 L202.8 60.7 L203.4 77.2 L202.2 78.4 L196.3 67.8 L193.4 53.1 L192.2 53.1 L190.4 59.0 L191.6 70.8 L195.2 77.8 L205.8 88.4 L209.3 94.9 L211.1 101.4 L211.1 110.8 L209.3 111.4 L202.8 108.5 L205.2 100.8 L205.2 94.3 L202.2 89.6 L200.5 97.9 L198.1 101.4 L190.4 87.9 L188.7 88.4 L190.4 97.3 L189.9 101.4 L187.5 99.6 L179.8 89.6 L178.7 90.2 L178.7 94.9 L182.8 102.6 L187.5 106.7 L212.3 119.1 L199.9 122.1 L188.7 129.1 L174.5 132.7 L171.6 134.4 L171.6 137.4 L175.7 143.9 L179.8 146.8 L189.9 146.8 L199.3 149.2 L199.9 150.9 L196.9 159.2 L194.6 159.8 L160.4 149.8 L159.8 135.0 L158.6 134.4 L150.9 142.1 L148.0 143.3 L142.7 143.3 L128.5 138.0 L93.8 127.4 L57.8 110.8 L54.2 106.1 L54.2 82.5 L66.6 74.3 L69.0 71.9 L70.2 67.8 L64.9 66.6 L56.0 69.0 L51.3 69.0 L48.9 67.8 L48.9 66.0 L67.2 63.7 L80.8 58.4 L87.9 52.5 L93.8 44.8 L99.6 43.6 L106.1 40.7 L110.3 36.6 L112.0 33.0 L112.6 26.5 L112.0 25.4 L110.8 25.4 L107.9 31.3 L104.4 35.4 L97.9 37.7 L96.1 37.1 L100.2 8.3 L97.3 3.5 L96.1 6.5 L94.3 21.2 L92.0 26.5 L89.0 29.5 L87.3 26.5 L82.5 7.1 L80.8 7.7 L80.2 24.8 L69.6 13.6 L69.0 17.1 L70.2 20.0 L79.0 29.5 L84.3 33.6 L86.1 36.6 L86.7 40.7 L82.5 48.3 L75.5 54.8 L75.5 42.5 L73.1 36.6 L71.3 45.4 L67.2 54.2 L61.9 57.8 L54.8 58.4 L54.2 57.8 L59.0 46.6 L59.0 41.9 L56.6 36.6 L55.4 44.2 L53.1 48.9 L48.9 53.1 L45.4 54.8 L41.3 36.6 L47.2 28.9 L48.9 24.8 L49.5 18.3 L47.8 13.0 L46.0 15.9 L43.6 25.9 L39.5 28.9 L35.4 20.6 L33.0 2.9 L30.1 9.4 L30.1 23.0 L26.5 20.0 L24.8 16.5 L21.8 0.0ZM705.2 411.6 L709.3 409.2 L868.5 422.2 L874.4 423.3 L876.2 425.7 L876.2 427.5 L870.3 428.1 L706.4 413.9ZM711.7 399.8 L715.8 391.5 L717.6 389.7 L721.7 388.6 L740.0 390.9 L856.1 399.8 L865.6 401.5 L868.5 406.2 L870.9 413.9 L866.2 414.5 L712.9 401.5ZM521.8 260.0 L528.9 242.9 L647.4 243.5 L645.6 259.4 L640.9 260.6 L607.3 262.4 L557.2 262.4ZM809.0 261.2 L802.5 265.9 L800.7 265.9 L793.6 260.0 L784.8 254.7 L776.5 254.1 L772.4 255.9 L768.9 258.8 L756.5 276.5 L752.4 280.7 L745.9 280.7 L744.1 282.4 L744.1 286.6 L742.9 287.7 L740.0 288.3 L736.4 285.4 L735.3 280.7 L730.5 274.8 L724.6 280.7 L724.6 286.6 L733.5 317.8 L735.3 319.6 L740.0 319.6 L751.2 316.0 L755.9 322.5 L745.9 329.6 L738.8 333.1 L730.0 335.5 L719.3 336.1 L701.1 332.5 L693.4 328.4 L686.3 321.3 L680.4 310.1 L679.2 305.4 L679.8 301.3 L689.9 290.1 L693.4 284.2 L695.8 277.7 L696.3 263.6 L695.2 259.4 L696.3 258.3 L779.5 241.7 L788.9 241.2 L790.1 242.3 L788.9 244.7 L788.9 248.2 L790.7 252.4 L795.4 255.3 L801.3 255.3ZM780.7 237.6 L780.1 238.8 L699.9 254.1 L694.0 253.5 L685.1 241.7 L691.0 240.6 L767.1 237.0ZM415.1 232.3 L418.0 231.7 L517.7 242.3 L518.3 243.5 L512.4 250.0 L505.9 251.2 L498.8 247.1 L487.6 243.5 L426.9 239.4 L419.2 236.4ZM333.7 216.4 L335.5 215.8 L369.7 222.9 L370.9 224.1 L368.5 225.2 L363.2 225.2 L352.6 223.5 L339.0 219.3ZM405.7 211.7 L408.6 211.1 L457.5 219.3 L528.3 228.2 L593.2 234.1 L646.2 237.0 L652.1 238.2 L647.4 239.4 L529.5 239.4 L525.4 236.4 L524.2 233.5 L523.0 235.8 L518.9 238.8 L493.5 237.0 L413.3 227.0 L409.8 224.1ZM335.5 212.3 L343.8 199.9 L376.2 205.2 L377.4 206.4 L372.1 219.9 L336.7 213.4ZM16.5 176.9 L28.3 179.8 L31.8 182.8 L46.0 208.1 L44.2 210.5 L27.7 194.0 L15.9 178.1ZM231.1 174.5 L232.3 173.9 L330.2 196.9 L331.4 198.1 L327.2 201.7 L324.3 202.2 L313.1 195.8 L303.1 193.4 L242.3 187.5 L238.8 185.7 L233.5 180.4ZM152.7 156.8 L158.0 153.3 L161.0 153.3 L195.2 163.3 L191.6 171.6 L155.1 159.8 L152.7 158.0ZM56.6 115.0 L57.8 114.4 L97.9 133.3 L84.9 133.3 L67.8 128.5 L63.7 126.2 L59.0 121.5Z";
  function stNight(st, delivered) {
    const now = Date.now(), G = "#C9A45C", L = "#F3DFA8", IV = "#F6EFD9";
    const p = st.phase === "before" ? 0 : st.phase === "done" ? 1 : st.phase === "takeoff" ? .02 : st.phase === "returning" ? .98 : st.frac;
    const t = .74 - .3 * p, P0 = [15, 170], P1 = [180, 40], P2 = [345, 170];
    const bz = (u, i) => (1 - u) * (1 - u) * P0[i] + 2 * (1 - u) * u * P1[i] + u * u * P2[i];
    const sx = bz(t, 0), sy = bz(t, 1), dx = 2 * (1 - t) * (P1[0] - P0[0]) + 2 * t * (P2[0] - P1[0]), dy = 2 * (1 - t) * (P1[1] - P0[1]) + 2 * t * (P2[1] - P1[1]);
    const ang = Math.atan2(dy, dx) * 180 / Math.PI;
    const sp = (x, y, r, c = L, o = 1) => `<path d="M${x} ${y - r}Q${x + r * .12} ${y - r * .12} ${x + r} ${y}Q${x + r * .12} ${y + r * .12} ${x} ${y + r}Q${x - r * .12} ${y + r * .12} ${x - r} ${y}Q${x - r * .12} ${y - r * .12} ${x} ${y - r}Z" fill="${c}" opacity="${o}"/>`;
    const stars = Array.from({ length: 30 }, (_, i) => { const x = (i * 83) % 340 + 10, y = (i * 47) % 130 + 6; return i % 4 === 0 ? sp(x, y, 3 + i % 3, L, .85) : `<circle cx="${x}" cy="${y}" r="${i % 3 ? .6 : 1}" fill="${L}" opacity="${.35 + (i % 5) / 8}"/>`; }).join("");
    const constel = `<g stroke="${G}" stroke-width=".5" opacity=".55" fill="none"><path d="M232 34L256 22L282 38L300 28L322 54"/></g>` + [[232, 34], [256, 22], [282, 38], [300, 28], [322, 54]].map(c => `<circle cx="${c[0]}" cy="${c[1]}" r="1.4" fill="${L}"/>`).join("");
    const blobs = [
      "M-10 250C20 215 70 205 105 222C125 236 112 262 80 272C40 280 -5 285 -10 250Z",
      "M118 214C140 196 178 190 205 200C222 210 214 226 196 232C186 246 200 262 188 280C172 296 150 276 146 252C138 236 110 232 118 214Z",
      "M222 222C246 206 286 210 312 224C334 238 332 262 308 270C288 280 268 266 252 270C232 262 214 240 222 222Z",
      "M262 288C286 280 318 288 340 300C330 322 296 330 270 318C254 308 252 294 262 288Z",
      "M40 300C62 292 92 296 108 310C100 328 66 332 46 322C34 314 32 304 40 300Z"
    ].map(d => `<path d="${d}" fill="url(#xGold)" opacity=".92"/>`).join("");
    const lights = Array.from({ length: 70 }, (_, i) => { const x = 100 + (i * 59) % 240, y = 205 + (i * 31) % 110; return `<circle cx="${x}" cy="${y}" r="${i % 5 ? .7 : 1.3}" fill="#fff" opacity="${.35 + (i % 4) / 6}"/>`; }).join("");
    const globeLines = [60, 105, 150, 195, 232].map(Y => { const rx = Math.sqrt(252 * 252 - Y * Y); return `<ellipse cx="180" cy="${420 - Y}" rx="${rx.toFixed(1)}" ry="${(rx * .16).toFixed(1)}" fill="none" stroke="#121212" stroke-width=".8" opacity=".7"/>`; }).join("") + [0, 25, 50, 72].map(a => `<ellipse cx="180" cy="420" rx="${(252 * Math.cos(a * Math.PI / 180)).toFixed(1)}" ry="252" fill="none" stroke="#121212" stroke-width=".8" opacity=".7"/>`).join("");
    const trail = Array.from({ length: 14 }, (_, i) => { const u = Math.min(1, t + .01 * (i + 1)); const x = bz(u, 0), y = bz(u, 1) + Math.sin(i * 2.3) * 5; return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${i % 3 ? .8 : 1.5}" fill="${L}" opacity="${Math.max(.1, .9 - i / 30)}"/>`; }).join("");
    const deer = (x, y, r, k) => `<g transform="translate(${x} ${y}) rotate(${r})"><use href="#xDeer"/>${k ? "" : ""}</g>`;
    const scene = `<svg viewBox="0 0 360 290" class="stx-svg" role="img" aria-label="Santa's sleigh flying over the world">
      <defs>
        <linearGradient id="xGold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F3DFA8"/><stop offset=".55" stop-color="#C9A45C"/><stop offset="1" stop-color="#8f6f2a"/></linearGradient>
        <radialGradient id="xGlobe" cx=".38" cy=".1" r=".95"><stop offset="0" stop-color="#F8E7B0"/><stop offset=".55" stop-color="#C9A45C"/><stop offset="1" stop-color="#8f6f2a"/></radialGradient>
        <filter id="xGlow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="5"/></filter>
        <clipPath id="xClip"><circle cx="180" cy="420" r="252"/></clipPath>
        <g id="xDeer">
          <path d="M-10 4 L-16 15 M-5 5 L-4 15 M8 4 L15 10 L18 14 M4 5 L10 12 L12 16" stroke="${G}" stroke-width="1.5" stroke-linecap="round" fill="none"/>
          <ellipse cx="0" cy="0" rx="12" ry="5.2" fill="${IV}" stroke="${G}" stroke-width=".7"/>
          <path d="M8 -2 L15 -11" stroke="${IV}" stroke-width="5" stroke-linecap="round"/><path d="M9 -1 L16 -10" stroke="${G}" stroke-width="1.3" opacity=".9"/>
          <ellipse cx="18" cy="-12.5" rx="4.4" ry="2.6" transform="rotate(-20 18 -12.5)" fill="${IV}" stroke="${G}" stroke-width=".7"/>
          <path d="M16 -15 L14 -23 M14 -23 L10 -25 M14 -23 L18 -27 M18 -15 L20 -22 M20 -22 L24 -24" stroke="${G}" stroke-width="1" fill="none" stroke-linecap="round"/>
          <path d="M-12 -2 Q-16 -4 -15 -8" stroke="${IV}" stroke-width="2.6" fill="none" stroke-linecap="round"/>
        </g>
      </defs>
      ${stars}${constel}
      <circle cx="180" cy="430" r="256" fill="${G}" opacity=".35" filter="url(#xGlow)"/>
      <circle cx="180" cy="420" r="252" fill="url(#xGlobe)"/>
      <g clip-path="url(#xClip)">${globeLines}<ellipse cx="120" cy="190" rx="60" ry="12" fill="#fff" opacity=".28" transform="rotate(-14 120 190)"/></g>
      <circle cx="180" cy="420" r="252" fill="none" stroke="#121212" stroke-width="1.2" opacity=".85"/>
      <path d="M15 170Q180 40 345 170" pathLength="100" fill="none" stroke="${G}" stroke-width="1.4" stroke-dasharray=".1 2.2" stroke-linecap="round" opacity=".7"/>
      <path d="M345 170Q180 40 15 170" pathLength="100" fill="none" stroke="${L}" stroke-width="1.8" stroke-dasharray="${((1 - t) * 100).toFixed(1)} 200" stroke-linecap="round" opacity=".55"/>
      ${trail}
      <g transform="translate(${sx.toFixed(1)} ${sy.toFixed(1)}) rotate(${ang.toFixed(1)}) scale(.19) translate(-500 -222)">
        <path d="${SLEIGH}" fill="${L}" opacity=".35" filter="url(#xGlow)" fill-rule="evenodd" transform="translate(0 -6)"/>
        <path d="${SLEIGH}" fill="url(#xGold)" fill-rule="evenodd"/>
      </g>
      ${sp(40, 150, 5, "#fff", .9)}${sp(318, 124, 4, L, .9)}${sp(96, 62, 3.5, L, .8)}
    </svg>`;
    const mini = `<svg viewBox="0 0 120 96" class="stx-mini" role="img" aria-label="Map"><rect width="120" height="96" fill="#090c17"/>
      <g stroke="${G}" stroke-width=".5" opacity=".35" fill="none"><path d="M0 20L120 30M0 50L120 44M0 76L120 70M22 0L30 96M54 0L50 96M86 0L96 96M0 8L120 90M10 96L110 0"/></g>
      <path d="M0 62C30 54 50 78 80 64S110 66 120 58" stroke="${G}" stroke-width="3" opacity=".25" fill="none"/>
      ${Array.from({ length: 26 }, (_, i) => `<circle cx="${(i * 41) % 116 + 2}" cy="${(i * 29) % 90 + 3}" r="${i % 4 ? .8 : 1.5}" fill="${L}" opacity=".7"/>`).join("")}
      <path d="M60 22C50 22 44 29 44 37C44 49 60 66 60 66C60 66 76 49 76 37C76 29 70 22 60 22Z" fill="url(#xGold)" stroke="#0b0b0b" stroke-width="1"/><circle cx="60" cy="37" r="5" fill="#0b0b0b"/></svg>`;
    const left = Math.max(0, new Date(st.y, 11, 25, 0, 0).getTime() - now), ct = stDur(left);
    const cd = ct.d ? `${ct.d}d ${ct.h}h ${ct.m}m` : `${ct.h}h ${String(ct.m).padStart(2, "0")}m ${String(ct.s).padStart(2, "0")}s`;
    const cur = st.phase === "flying" ? st.cur[0] : st.phase === "returning" ? "On the way home" : st.phase === "done" ? "North Pole" : st.phase === "takeoff" ? "Leaving the North Pole" : "North Pole";
    const nxt = st.next ? st.next[0] : st.phase === "before" ? ST_STOPS[0][0] : "North Pole";
    const status = st.phase === "flying" || st.phase === "takeoff" ? "DELIVERING PRESENTS!" : st.phase === "done" ? "MISSION COMPLETE!" : st.phase === "returning" ? "HEADING HOME!" : "PREPARING FOR TAKE-OFF";
    const speed = st.phase === "flying" || st.phase === "takeoff" || st.phase === "returning" ? (284000 + Math.round(Math.sin(now / 4000) * 1800)).toLocaleString() + " km/h" : "Resting";
    return `<div class="stx">
      <div class="stx-head"><div class="stx-orn"><i></i>${sp(10, 10, 6, G)}<i></i></div><div class="stx-title">Santa Tracker</div>
        <div class="stx-pill">${st.phase === "done" ? "MERRY CHRISTMAS" : "UNTIL CHRISTMAS"} <b>${st.phase === "done" ? "✓".replace("✓", "") : cd}</b></div></div>
      ${scene}
      <div class="stx-loc"><div class="stx-mapcol">${mini}<div class="stx-bar">${status}</div></div>
        <div class="stx-info"><small>CURRENT LOCATION</small><b>${esc(cur)}</b><span class="stx-rule"></span><small>NEXT STOP</small><b>${esc(nxt)}</b></div></div>
      <div class="stx-stats"><span><small>DEPARTED</small><b>North Pole</b></span><span><small>CURRENT SPEED</small><b>${speed}</b></span><span><small>GIFTS DELIVERED</small><b>${delivered >= 1e9 ? (delivered / 1e9).toFixed(1) + " billion" : delivered ? Math.round(delivered / 1e6) + " million" : "0"}</b></span></div>
    </div>`;
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
    el.innerHTML = `${stNight(st, delivered)}${homeCard}
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
