  /* ============================================================
     🎭 NEW YEAR'S EVE PARTY THEMES
     Pick a theme → one clean page with: the night's timeline (with
     alarms), food & drinks, a priced shopping list, the music mood,
     three games, and photo-booth ideas. Prices are rough CAD guides
     (converted for USD). Includes "Who Wrote It?", a pass-the-phone
     resolutions guessing game, and an early kids' countdown.
     ============================================================ */
  // shopping item: [name, how many per guest (or a fixed number if fixed=1), unit, CAD price each, fixed]
  const PT_BASE = [
    ["Party noisemakers & horns", 1, "", 0.75],
    ["Cups (or rent glassware)", 3, "", 0.25],
    ["Cocktail napkins", 4, "", 0.05],
    ["Bags of ice", 0.25, "bags", 4],
    ["Sparkling water & mixers (2 L)", 0.25, "bottles", 2.5],
    ["Garbage & recycling bags", 1, "box", 6, 1]
  ];
  const PT_BOOTH = [
    ["Gold & silver tinsel fringe curtains", 3, "", 6, 1],
    ["Warm-white fairy lights", 2, "strings", 10, 1],
    ["Photo props: giant glasses, boas, top hats, signs", 1, "kit", 25, 1],
    ["Instant camera film (Instax/Polaroid, 10 shots)", 0.3, "packs", 16],
    ["Blank guestbook or scrapbook + gel pens", 1, "", 18, 1],
    ["Washi tape for sticking photos", 2, "rolls", 4, 1]
  ];
  const PARTY_THEMES = [
    { id: "pajama", icon: "🥂", name: "Pajama & Champagne Gala", tag: "Ultra-comfy clothes, fancy bites and bubbly",
      dress: "Strict dress code: silk pajamas, robes, slippers or matching loungewear sets. Prize for the most luxurious PJs.",
      decor: ["Floor cushions, throws and every pillow in the house in a cozy lounge corner", "Champagne tower or a bubbly bar on a tray with gold napkins", "Candles and fairy lights instead of overhead lights", "A cozy-movie projected on a wall with the sound off"],
      arrive: "Hand each guest a glass of bubbly (or sparkling juice) and a pair of fuzzy socks at the door",
      food: ["Mini croissants with smoked salmon & cream cheese", "Pancake or waffle bites with berries (a 'breakfast at midnight' station)", "Charcuterie & cheese board", "Truffle popcorn in paper cones", "Chocolate-dipped strawberries"],
      drinks: ["Champagne or prosecco", "Mimosa bar: orange, grapefruit & cranberry juice", "Hot chocolate bar with marshmallows & whipped cream"],
      signature: ["The Silk Robe: prosecco topped with a splash of elderflower and a raspberry", "Sleepy-Time Spritz (no alcohol): sparkling apple juice, pomegranate seeds and mint"],
      late: "Midnight pancakes or waffle bites",
      midnight: "Champagne toast in your PJs, then a group photo on the couch",
      music: ["Smooth R&B, soul and acoustic covers early on", "Feel-good singalong pop from 10 PM", "A big anthem at midnight, then slow jams to wind down"],
      search: "cozy lounge R&B · feel-good singalongs",
      games: [["Pajama Fashion Show", "Everyone walks a 'runway' in their PJs while someone narrates like a fashion host. Vote for Best Dressed, Comfiest and Most Unexpected."], ["Who Wrote It?", "Everyone secretly types a resolution or a confession from the year into the phone. It's read out, and everyone guesses who wrote it.", "wwi"], ["Year-in-Review Quiz", "The quiz on the New Year's screen: pop culture, music and news from the year. Play in teams on the couch.", "quiz"]],
      shop: [["Bottles of champagne / prosecco", 0.5, "bottles", 18], ["Sparkling juice for non-drinkers", 0.25, "bottles", 4], ["Orange & grapefruit juice", 0.15, "cartons", 5], ["Fuzzy socks (welcome gift)", 1, "pairs", 3], ["Hot chocolate mix, marshmallows & whipped cream", 1, "set", 15, 1], ["Waffle or pancake mix + berries", 0.2, "packs", 6], ["Candles (unscented pillars)", 6, "", 3, 1], ["Gold paper napkins", 2, "", 0.15]] },
    { id: "masq", icon: "🎭", name: "Masquerade", tag: "Masks on until the stroke of midnight",
      dress: "Formal or cocktail wear with a mask. Masks stay on until midnight: that's the rule!",
      decor: ["A mask-making table right at the entrance", "Deep reds, black and gold: velvet table runners, candelabras, feathers", "Dim lighting with lots of candles (battery candles near masks and feathers)", "A gilded mirror for guests to admire their masks"],
      arrive: "Guests head straight to the mask station to design their Venetian identity for the night",
      food: ["Mini beef Wellingtons or puff-pastry bites", "Shrimp cocktail shooters", "Caprese skewers with balsamic", "Stuffed mushrooms", "Dark chocolate truffles and macarons"],
      drinks: ["Red wine and sparkling wine", "A dark, moody signature cocktail", "Pomegranate spritzers"],
      signature: ["The Venetian: prosecco with a splash of blood-orange juice and an orange twist", "Midnight Mystery (no alcohol): blackberry & lemon sparkling water"],
      late: "Chocolate fondue with strawberries",
      midnight: "The Grand Unmasking: everyone removes their mask at the stroke of twelve, then the toast",
      music: ["Classical and string covers of pop songs for arrivals", "Dramatic tango and electro-swing for the middle of the night", "Big pop anthems for the unmasking"],
      search: "string quartet pop covers · electro swing",
      games: [["Mask Customisation Station", "Blank papier-mâché masks, feathers, sequins, fabric markers and glue guns. Everyone designs a mask and invents a secret 'masquerade name'."], ["Guess Who Behind the Mask", "Each guest gets a secret card naming one other guest. Through the night, chat and find who's who. Write your guess on the card before midnight; correct guesses win a prize at the unmasking."], ["Who Wrote It?", "Secret resolutions typed into the phone, read aloud, and everyone guesses the writer. Even better when everyone's masked!", "wwi"]],
      shop: [["Blank papier-mâché masks", 1, "", 3], ["Feathers, sequins & gems (craft packs)", 0.2, "packs", 6], ["Low-temp glue guns + glue sticks", 2, "", 10, 1], ["Fabric markers & paint pens", 1, "set", 12, 1], ["Battery tea-light candles", 2, "", 0.75], ["Velvet or satin table runner", 2, "", 12, 1], ["Bottles of red & sparkling wine", 0.5, "bottles", 17], ["Small prizes for the guessing game", 3, "", 5, 1]] },
    { id: "gala", icon: "✨", name: "Black, White & Gold Gala", tag: "Classy, glam and very photogenic",
      dress: "Black, white or gold only. Suits, sequins, little black dresses and sparkle encouraged.",
      decor: ["Black and white balloons with gold confetti balloons", "Gold chargers or placemats, white flowers in clear vases", "A gold balloon arch or number balloons for the new year", "Gold sparkler candles for the midnight toast"],
      arrive: "Welcome glass of bubbly and a gold-foil name card for each guest",
      food: ["Smoked salmon blinis with crème fraîche", "Bacon-wrapped dates", "Gold-dusted deviled eggs", "Mini crab cakes", "White and dark chocolate-dipped pretzels with gold sprinkles"],
      drinks: ["Champagne or prosecco", "A classic martini or old fashioned bar", "Sparkling grape juice in champagne flutes"],
      signature: ["Black Tie Gimlet: gin, lime and a little elderflower, served up", "Golden Hour (no alcohol): sparkling white grape juice with a sugared rim"],
      late: "Mini sliders or late-night grilled cheese bites",
      midnight: "Gold confetti cannons, sparklers in the glasses and a champagne toast",
      music: ["Jazz standards and swing for cocktail hour", "Disco and Motown from 10 PM", "Dance-floor hits until midnight, then a slow dance"],
      search: "cocktail jazz · disco classics",
      games: [["Red-Carpet Arrivals", "Film every guest's grand entrance on the phone with a 'paparazzi' cheering. Award Best Look at midnight."], ["Year-in-Review Quiz", "The trivia game on the New Year's screen: the biggest songs, moments and news of the year. Play in teams; the winners get a gold medal.", "quiz"], ["Champagne Pong", "Like table tennis cup toss with plastic flutes of sparkling juice. Teams of two, first to clear the cups wins."]],
      shop: [["Black, white & gold balloons", 2, "", 0.5], ["Gold confetti balloons", 6, "", 1.5, 1], ["Confetti cannons (one per 4 guests)", 0.25, "", 6], ["Gold sparkler candles", 1, "", 0.5], ["Bottles of champagne / prosecco", 0.5, "bottles", 18], ["White flowers for vases", 2, "bunches", 10, 1], ["Gold chocolate coins", 0.1, "bags", 5], ["Plastic flutes for champagne pong", 1, "pack", 8, 1]] },
    { id: "kids", icon: "🧒", name: "Family & Kids Countdown", tag: "Early countdown, big fun, little ones in bed on time", early: true,
      dress: "Party hats, sparkly tops and pajamas for the kids, ready for bed after the countdown.",
      decor: ["A 'Countdown Wall' with a goodie bag to open every hour", "Balloons, streamers and glow sticks", "A blanket fort or cozy movie corner", "Big printed numbers counting down the hours"],
      arrive: "Kids decorate their own party hat and noisemaker at the craft table",
      food: ["Mini pizzas", "Pigs in a blanket", "Fruit kebabs and veggie cups with dip", "Popcorn bar with toppings", "Decorate-your-own cupcakes"],
      drinks: ["Sparkling apple juice in plastic flutes for the toast", "Hot chocolate", "Coffee and wine for the grown-ups"],
      signature: ["Kids' Bubbly: sparkling apple or white grape juice with a gummy on the rim", "Grown-up Cranberry Fizz: prosecco with cranberry juice"],
      late: "Grown-ups' late snack after the kids are asleep",
      midnight: "Kids' countdown! Fireworks on the phone, the balloon drop and a sparkling juice toast",
      music: ["Kids' party songs and movie soundtracks", "Freeze-dance favourites for the games", "A calm lullaby playlist for bedtime"],
      search: "kids party songs · freeze dance",
      games: [["Hourly Countdown Bags", "Hang one bag for every hour of the party, each with a small activity: glow sticks, a dance-off, a joke to tell, a craft. Open one each hour."], ["Balloon Drop Countdown", "Fill a big bag or tablecloth on the ceiling with balloons and release it at the kids' countdown. No ceiling? Toss them all from a big blanket."], ["Freeze Dance & Musical Chairs", "Classic party games with the music on. Pause and everyone freezes; wobblers are out until the next round."]],
      shop: [["Party hats & blowers", 1, "", 1], ["Glow sticks & bracelets", 3, "", 0.3], ["Paper goodie bags (hourly countdown)", 6, "", 0.5, 1], ["Small treats & toys for the bags", 6, "", 3, 1], ["Balloons for the balloon drop", 3, "", 0.3], ["Sparkling apple juice", 0.2, "bottles", 4], ["Cupcakes, icing & sprinkles", 1, "", 1.2], ["Craft supplies: stickers, markers, pom-poms", 1, "set", 12, 1]] },
    { id: "casino", icon: "🃏", name: "Vintage Casino Royale", tag: "A high-stakes 1960s lounge",
      dress: "Black tie, tuxedos, cocktail dresses and spy-movie glamour.",
      decor: ["Green felt or green tablecloths on card tables", "Playing cards, dice and poker chips scattered as decor", "A 'bar' with a bow-tied bartender (a willing friend)", "Low gold lighting and red accents"],
      arrive: "Each guest gets a stack of play chips (no real money) and a 'high roller' name tag",
      food: ["Shrimp cocktail", "Mini sliders", "Oysters or smoked salmon toasts", "Cheese and cracker board", "Chocolate 'poker chip' cookies"],
      drinks: ["Martinis: shaken, not stirred", "Whisky or bourbon tasting", "Sparkling wine"],
      signature: ["The Vesper: gin, vodka and a lemon twist (strong, so sip slowly!)", "High Roller (no alcohol): ginger beer, lime and a splash of cranberry"],
      late: "Pigs in a blanket for the night owls",
      midnight: "Cash in the chips: the biggest stack wins a prize, then the toast",
      music: ["Lounge jazz and big band early", "Classic spy-movie themes and swing", "Rat Pack crooners for the final hour, then a big countdown anthem"],
      search: "lounge jazz · Rat Pack crooners",
      games: [["Blackjack & Poker Tables", "Play with fake chips only. A friend deals; take turns being the dealer. Biggest stack at 11:45 wins."], ["Roulette Wheel", "A cheap toy roulette wheel or a free app. Guests bet chips on red, black, odd or even."], ["Who Wrote It?", "Secret resolutions typed into the phone and read aloud; bet chips on who wrote each one!", "wwi"]],
      shop: [["Play poker chips set", 1, "set", 25, 1], ["Decks of playing cards", 4, "", 3, 1], ["Toy roulette wheel", 1, "", 20, 1], ["Green tablecloths or felt", 2, "", 10, 1], ["Gin, vodka & vermouth (for martinis)", 0.15, "bottles", 30], ["Olives & lemons", 1, "set", 8, 1], ["Bow ties for the 'dealer' and bartender", 2, "", 5, 1], ["A prize for the biggest stack", 1, "", 15, 1]] },
    { id: "neon", icon: "🌈", name: "Neon Glow Party", tag: "Blacklights, glow sticks and high energy",
      dress: "Bright whites or fluorescent colours, so everything glows under the blacklight.",
      decor: ["Blacklight bulbs or a blacklight bar in every room", "Glow sticks, glow bracelets and glow balloons everywhere", "Neon tape shapes on walls (removable painter's tape that glows)", "A face-paint station with UV paint"],
      arrive: "Glow bracelets and a dab of neon face paint at the door",
      food: ["Rainbow veggie platter with dip", "Neon jello cups (made with tonic water, they glow under blacklight)", "Mini tacos", "Popcorn with neon candy melts", "Rainbow cupcakes"],
      drinks: ["Tonic water cocktails (tonic glows under blacklight!)", "Bright fruit punch", "Energy-free mocktails with neon straws"],
      signature: ["Glow Getter: vodka, tonic and a splash of blue curaçao (glows under blacklight)", "Neon Lemonade (no alcohol): tonic water, lemonade and a glow-stick stirrer outside the glass"],
      late: "Late-night nachos",
      midnight: "Glow-stick crack-off: everyone snaps a new glow stick at midnight and throws confetti",
      music: ["Upbeat electronic and synth-pop early", "Dance and EDM hits from 10 PM", "Biggest party anthems for the countdown"],
      search: "synth pop party · EDM anthems",
      games: [["Glow Limbo", "Hold a glow-stick-wrapped broom or pool noodle. How low can you go?"], ["Neon Face-Paint Contest", "Partners paint each other's faces in 5 minutes. Vote for the best design under the blacklight."], ["Dance-Off Battles", "Two at a time, 30 seconds each. The crowd's cheers pick the winner. Keep going until there's a dance champion."]],
      shop: [["Blacklight bulbs or LED blacklight bar", 2, "", 15, 1], ["Glow sticks & bracelets", 6, "", 0.25], ["Glow balloons (LED)", 1, "", 0.8], ["UV neon face paint set", 1, "set", 18, 1], ["Neon painter's tape", 3, "rolls", 6, 1], ["Tonic water (1 L)", 0.3, "bottles", 2.5], ["Neon straws & cups", 2, "", 0.2], ["Confetti", 2, "bags", 4, 1]] },
    { id: "apoc", icon: "☄️", name: "End of the World Lounge", tag: "Cheeky, dramatic, last-night-on-Earth glamour",
      dress: "Dress as if it's your last night on Earth: your fanciest outfit, a costume, or full survival gear.",
      decor: ["'Caution' tape and 'Evacuate the Dance Floor' signs", "Candles, lanterns and a 'bunker' snack shelf of tins and jars", "Sparkly disco ball for doomsday disco", "A 'Last Words' board for guests to sign"],
      arrive: "Guests sign the 'Last Words' board and pick a survival ration (a mini snack bag)",
      food: ["'Bunker' snack board: crackers, nuts, jerky, cheese", "Mini sausage rolls", "Loaded potato skins", "'Meteor' meatballs with dipping sauces", "Chocolate 'asteroid' truffles and brownie bites"],
      drinks: ["'Survival-themed' cocktails in mason jars", "Beer in a bucket of ice", "Sparkling cider"],
      signature: ["The Last Call: dark rum, ginger beer and lime in a mason jar", "Fallout Fizz (no alcohol): ginger beer, orange juice and a cherry"],
      late: "Midnight 'last meal' pizza",
      midnight: "Dramatic speeches: everyone shares one thing they'd do if the world really ended, then the toast",
      music: ["Moody indie and retro synth for arrivals", "Doomsday disco: 70s and 80s dance hits", "The most dramatic anthem you can find for midnight"],
      search: "doomsday disco · 80s dance hits",
      games: [["Survival Bunker Draft", "In teams, you can only bring 5 things to the bunker. Each team argues for their picks; everyone votes for the team most likely to survive."], ["Last-Night Confessions", "'Who Wrote It?' with a twist: everyone types something they've never told anyone (keep it fun!), and the group guesses who.", "wwi"], ["Doomsday Charades", "Act out disaster-movie scenes and survival situations. Teams guess against a 60-second timer."]],
      shop: [["Caution tape", 2, "rolls", 4, 1], ["Mason jars (for drinks)", 1, "", 1.5], ["Lanterns or battery candles", 4, "", 5, 1], ["Mini snack bags (survival rations)", 1, "", 1.5], ["Disco ball", 1, "", 15, 1], ["Large poster board + markers ('Last Words')", 1, "set", 10, 1], ["Dark rum & ginger beer", 0.3, "bottles", 15], ["Beer or cider", 1.5, "cans", 2.5]] }
  ];
  let pt = load("partyTheme", null) || { id: null, guests: 10, start: "20:00", end: "01:00", tab: "night", got: {}, remind: false, fired: {} };
  const savePt = () => save("partyTheme", pt);
  const ptTheme = () => PARTY_THEMES.find(t => t.id === pt.id);
  const ptYear = () => { const n = new Date(); return n.getMonth() === 0 && n.getDate() <= 6 ? n.getFullYear() - 1 : n.getFullYear(); };
  const ptTime = hm => { const [h, m] = hm.split(":").map(Number), y = ptYear(); return h < 12 ? new Date(y + 1, 0, 1, h, m).getTime() : new Date(y, 11, 31, h, m).getTime(); };
  const roundQ = t => Math.round(t / 900000) * 900000;   // nearest 15 minutes
  function ptTimeline(t) {
    const S = ptTime(pt.start), E = Math.max(ptTime(pt.end), S + 3600000), M = t.early ? roundQ(S + (E - S) * 0.72) : new Date(ptYear() + 1, 0, 1, 0, 0).getTime();
    const g = t.games, out = [], add = (at, icon, text, k) => out.push({ t: at, icon, text, k });
    add(S - 7200000, "🎨", "Set up: decor, photo booth and the game supplies", "setup");
    add(S - 3600000, "🧊", "Chill the drinks, fill the ice bucket and plate the make-ahead food", "chill");
    add(S - 900000, "🎶", "Music on, lights low, candles lit. You're ready!", "ready");
    add(S, "🚪", "Guests arrive. " + t.arrive, "arrive");
    const gameEnd = Math.min(M - 3600000, E - 3600000), span = Math.max(gameEnd - (S + 1800000), 0);
    add(S + 1800000, "🎲", "Game: " + g[0][0], "g1");
    add(roundQ(S + 1800000 + span * 0.4), "🍽️", "Bring out the food: " + t.food.slice(0, 3).join(", ").toLowerCase() + "…", "food");
    add(roundQ(S + 1800000 + span * 0.6), "🎲", "Game: " + g[1][0], "g2");
    if (gameEnd > S + 2700000) add(gameEnd, "🎲", "Game: " + g[2][0], "g3");
    add(M - 900000, "🥂", t.early ? "Pour the sparkling juice and hand out noisemakers" : "Pour the bubbly, hand out noisemakers and gather everyone", "pour");
    add(M - 120000, "🎆", t.early ? "Start the 1-minute kids' countdown (tap it on this theme's page)" : "Open the big countdown on the New Year's screen", "count");
    add(M, t.early ? "🎉" : "🕛", t.early ? t.midnight : "Midnight! " + t.midnight, "mid");
    if (!t.early) add(M + 900000, "🍕", "Late-night snack: " + t.late, "late");
    else add(M + 1800000, "🛏️", "Bedtime for the little ones. " + t.late, "late");
    if (!t.early) add(E - 1800000, "🌙", "Wind down: slower music, water and coffee out, and safe rides home sorted", "wind");
    add(E, "👋", "Party's over. Happy New Year!", "end");
    return out.filter(x => x.t >= S - 7200000 && x.t <= E).sort((a, b) => a.t - b.t);
  }
  function ptShop(t) {
    const g = Math.max(1, pt.guests);
    return [["For the " + t.name.toLowerCase(), t.shop], ["Party basics", PT_BASE], ["📸 Photo booth", PT_BOOTH]].map(([sec, list]) => [sec, list.map(([name, per, unit, price, fixed]) => {
      const n = fixed ? per : Math.max(1, Math.ceil(g * per)); return { name, n, unit, cost: n * price };
    })]);
  }
  const ptKey = (t, name) => t.id + ":" + name;
  function renderPt() {
    const t = ptTheme(), el = $("#ptBody");
    if (!t) {
      el.innerHTML = `<p class="advent-intro">Pick a theme and Noël plans the whole night: a timeline with alarms, food and drinks, a priced shopping list, the music mood and three games that fit.</p>
        <div class="pt-tiles">${PARTY_THEMES.map(x => `<button type="button" class="pt-tile" data-pt="${x.id}"><span class="pt-ico">${x.icon}</span><b>${esc(x.name)}</b><small>${esc(x.tag)}</small></button>`).join("")}</div>`;
      return;
    }
    const tab = pt.tab || "night", shop = ptShop(t), total = shop.reduce((a, [, l]) => a + l.reduce((b, i) => b + i.cost, 0), 0);
    const tabs = [["night", "🕗 The night"], ["food", "🍽️ Food & drinks"], ["shop", "🛒 Shopping"], ["music", "🎶 Music"], ["games", "🎲 Games"], ["booth", "📸 Photo booth"]];
    const opt = (v, sel, lab) => `<option value="${v}" ${v === sel ? "selected" : ""}>${lab}</option>`;
    const times = (sel, from, to) => { let o = ""; for (let m = from; m <= to; m += 30) { const h = Math.floor(m / 60) % 24, v = `${String(h).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`; o += opt(v, sel, mclock(new Date(2026, 0, 1, h, m % 60))); } return o; };
    const body = {
      night: () => `<div class="card pt-card"><p class="pt-dress"><b>Dress code:</b> ${esc(t.dress)}</p>
          <ul class="cal-list">${ptTimeline(t).map(x => `<li><span class="cl-time">${mclock(x.t)}</span><span class="cl-txt">${x.icon} ${esc(x.text)}</span></li>`).join("")}</ul>
          ${t.early ? `<button type="button" class="btn btn-gold btn-block" id="ptKids">🎆 Start a 1-minute kids' countdown now</button>` : ""}</div>
        <div class="card pt-card"><label class="host-switch"><input type="checkbox" id="ptRemind" ${pt.remind ? "checked" : ""}><span><b>🔔 Party alarms</b><small>${pt.remind ? "On. Noël rings for each moment above, from setup to the last goodbye." : "Turn on to get a ring for each moment of the night."}</small></span></label></div>
        <div class="card pt-card"><h3>🎨 Decorations</h3><ul class="pt-list">${t.decor.map(d => `<li>${esc(d)}</li>`).join("")}</ul></div>`,
      food: () => `<div class="card pt-card"><h3>🍢 Bites</h3><ul class="pt-list">${t.food.map(d => `<li>${esc(d)}</li>`).join("")}</ul>
          <p class="host-rem">Make-ahead tip: choose 2 or 3 bites you can make the day before, and ask guests to bring one each. Hosting is more fun when you're not stuck in the kitchen.</p>
          <button type="button" class="btn btn-ghost btn-block" id="ptApps">🥂 Choose my appetizers and see prices</button></div>
        <div class="card pt-card"><h3>🍸 Drinks</h3><ul class="pt-list">${t.drinks.map(d => `<li>${esc(d)}</li>`).join("")}</ul>
          <h4 class="shop-dept">Signature drinks</h4><ul class="pt-list">${t.signature.map(d => `<li>${esc(d)}</li>`).join("")}</ul>
          <p class="host-rem">Plan about 1 drink per guest per hour, half a bottle of bubbly per adult for the toast, and plenty of water. Always have a tasty no-alcohol option.</p></div>`,
      shop: () => `<div class="card pt-card"><p class="tray-total">About <b>${cad0(total)} ${currency}</b> for ${pt.guests} guests · roughly ${cad(total / pt.guests)} each</p>
          ${shop.map(([sec, l]) => `<h4 class="shop-dept">${esc(sec)}</h4><ul class="host-list">${l.map(i => { const k = ptKey(t, i.name); return `<li><label class="${pt.got[k] ? "on" : ""}"><input type="checkbox" data-ptgot="${esc(k)}" ${pt.got[k] ? "checked" : ""}><span>${i.n > 1 || i.unit ? `<b>${i.n}${i.unit ? " " + i.unit : ""}</b> ` : ""}${esc(i.name)}<small>${cad(i.cost)}</small></span></label></li>`; }).join("")}</ul>`).join("")}
          <p class="host-rem">Prices are rough guides. Dollar stores and party stores often have décor for much less.</p></div>`,
      music: () => `<div class="card pt-card"><h3>🎶 The music mood</h3><ol class="pt-list pt-ol">${t.music.map(d => `<li>${esc(d)}</li>`).join("")}</ol>
          <p class="pt-search">🔎 In your music app, search for: <b>${esc(t.search)}</b></p>
          <p class="host-rem">Build the energy slowly: keep the volume low while guests arrive and chat, turn it up after the food, and save your biggest song for the stroke of midnight. Play something slow at the end so guests know it's time to head home.</p></div>`,
      games: () => t.games.map(([n, how, kind]) => `<div class="card pt-card"><h3>🎲 ${esc(n)}</h3><p>${esc(how)}</p>${kind === "wwi" ? `<button type="button" class="btn btn-red btn-block" id="ptWwi">▶ Play Who Wrote It? on the phone</button>` : kind === "quiz" ? `<button type="button" class="btn btn-red btn-block" data-open="quizSheet" data-quiz="yir">▶ Play the quiz</button>` : ""}</div>`).join("") +
        `<div class="card pt-card"><h3>💫 Also on the New Year's screen</h3><p>The Wishes Jar, 7 pass-the-phone party games and the big midnight countdown with fireworks.</p></div>`,
      booth: () => `<div class="card pt-card"><h3>📸 DIY photo booth</h3><ul class="pt-list">
          <li><b>Metallic backdrop:</b> hang silver and gold tinsel fringe curtains on a blank wall and light them with fairy lights.</li>
          <li><b>Prop basket:</b> oversized glasses, feather boas, top hats, tiaras and New Year's signs${t.id === "masq" ? ", plus spare masks" : t.id === "neon" ? ", glow glasses and glow necklaces" : t.id === "casino" ? ", fake money and oversized playing cards" : ""}.</li>
          <li><b>Instant memories:</b> leave a couple of instant cameras out with plenty of film. Guests snap a picture and stick it in a guestbook with a note.</li>
          <li><b>The 11:59 clock:</b> a big clock prop (cardboard or a party store clock) set to 11:59 PM as the backdrop centrepiece.</li>
          <li><b>Phone tip:</b> prop a phone on a tripod with a timer, or use your phone's burst mode for fun action shots.</li></ul></div>
        <div class="card pt-card"><h3>💎 Splurge idea</h3><p>Rent a 360° video booth. It films slow-motion clips of guests dancing and posing. Book it early; December 31 sells out fast.</p></div>`
    }[tab]();
    el.innerHTML = `<button type="button" class="meal-back" data-pt="">‹ All themes</button>
      <h3 class="meal-title">${t.icon} ${esc(t.name)}</h3><p class="review-sub">${esc(t.tag)}</p>
      <div class="card pt-card pt-set"><div class="host-row"><span class="meal-lab">Guests</span><div class="stepper sm"><button type="button" data-ptg="-1">−</button><output>${pt.guests}</output><button type="button" data-ptg="1">+</button></div></div>
        <div class="org-addr-row"><label><span class="meal-lab">Starts</span><select class="input" id="ptStart">${times(pt.start, t.early ? 15 * 60 : 17 * 60, 23 * 60)}</select></label>
          <label><span class="meal-lab">Ends</span><select class="input" id="ptEnd">${times(pt.end, t.early ? 18 * 60 : 22 * 60, 27 * 60)}</select></label></div></div>
      <div class="apps-filters host-tabs">${tabs.map(([k, l]) => `<button type="button" class="chip${k === tab ? " on" : ""}" data-pttab="${k}">${l}</button>`).join("")}</div>
      ${body}
      <button type="button" class="btn btn-ghost btn-block pt-print" data-print="theme:${t.id}">🖨️ Print the whole party plan</button>`;
  }
  function themeDoc(id) {
    const t = PARTY_THEMES.find(x => x.id === id); if (!t) return null;
    const shop = ptShop(t), total = shop.reduce((a, [, l]) => a + l.reduce((b, i) => b + i.cost, 0), 0);
    const html = `<h1>${t.icon} ${esc(t.name)}</h1><p class="pm-sub">${pt.guests} guests · ${mclock(ptTime(pt.start))} to ${mclock(ptTime(pt.end))} · ${esc(t.dress)}</p>
      <h2>The night</h2><table>${ptTimeline(t).map(x => `<tr><td>${mclock(x.t)}</td><td>☐ ${esc(x.text)}</td></tr>`).join("")}</table>
      <h2>Decorations</h2><ul>${t.decor.map(d => `<li>• ${esc(d)}</li>`).join("")}</ul>
      <h2>Food &amp; drinks</h2><p><b>Bites:</b> ${esc(t.food.join(", "))}</p><p><b>Drinks:</b> ${esc(t.drinks.join(", "))}</p><ul>${t.signature.map(d => `<li>🍸 ${esc(d)}</li>`).join("")}</ul>
      <h2>Shopping list</h2><p><b>About ${cad0(total)} ${currency}</b></p>${shop.map(([sec, l]) => `<h3>${esc(sec)}</h3><ul>${l.map(i => `<li>☐ ${i.n > 1 || i.unit ? `<b>${i.n}${i.unit ? " " + i.unit : ""}</b> ` : ""}${esc(i.name)} · ${cad(i.cost)}</li>`).join("")}</ul>`).join("")}
      <h2>Music</h2><ul>${t.music.map(d => `<li>• ${esc(d)}</li>`).join("")}</ul><p>Search your music app for: ${esc(t.search)}</p>
      <h2>Games</h2>${t.games.map(([n, how]) => `<h3>${esc(n)}</h3><p>${esc(how)}</p>`).join("")}
      <h2>Photo booth</h2><p>Tinsel fringe backdrop with fairy lights · a basket of props · instant cameras and a guestbook · a big clock set to 11:59</p>
      <p class="pm-foot">Made with Noël Tier 1 Hub</p>`;
    return { title: t.name + " party plan", css: PRINT_CSS, html, margin: 0.5, file: t.name.replace(/[^A-Za-z0-9]+/g, "-") + "-Party-Plan" };
  }

  // ---------- alarms ----------
  const ptReminders = () => { const t = ptTheme(); return t && pt.remind ? ptTimeline(t).map(x => ({ k: t.id + x.k + x.t, t: x.t, icon: x.icon, text: x.text })) : []; };
  function ptSync() { if (NoelNative.isNative()) NoelNative.scheduleList(8000, 9000, ptReminders().filter(r => !pt.fired[r.k] && r.t > Date.now()).map(r => ({ t: r.t, title: `${r.icon} ${r.text}`, body: "Noël Tier 1 Hub · New Year's Eve" }))); }
  function ptTick() {
    const now = Date.now(), due = ptReminders().filter(r => !pt.fired[r.k] && r.t <= now); if (!due.length) return;
    due.forEach(r => { pt.fired[r.k] = 1; }); savePt();
    const fresh = due.filter(r => now - r.t < 10 * 60000); if (fresh.length) triggerAlert(fresh.map(r => ({ id: "pt:" + r.k })));
  }
  setInterval(ptTick, 15000);
  function ptAlertItem(id) { if (!String(id).startsWith("pt:")) return null; const r = ptReminders().find(x => "pt:" + x.k === id); return r ? { icon: r.icon, name: r.text } : null; }

  // ---------- 🔮 Who Wrote It? (pass the phone) ----------
  let wwi = { stage: "add", list: [], i: 0, shown: false };
  function renderWwi() {
    const el = $("#wwiBody");
    if (wwi.stage === "add") {
      el.innerHTML = `<div class="card pt-card"><p>Pass the phone around. Each person types their name and a secret resolution, a confession from the year, or a funny truth. Nobody else looks!</p>
        <form id="wwiForm" class="org-ev-form" autocomplete="off"><input class="input" name="who" maxlength="30" placeholder="Your name"><textarea class="input" name="what" rows="3" maxlength="160" placeholder="e.g. This year I'll finally learn to cook something other than toast"></textarea>
        <button class="btn btn-green btn-block" type="submit">🔒 Hide it & pass the phone</button></form>
        <p class="tray-total"><b>${wwi.list.length}</b> secret${wwi.list.length === 1 ? "" : "s"} in the bowl${wwi.list.length ? `: ${wwi.list.map(x => esc(x.who)).join(", ")}` : ""}</p>
        <button type="button" class="btn btn-red btn-block" id="wwiStart" ${wwi.list.length < 3 ? "disabled" : ""}>🎲 Everyone's in, start reading! ${wwi.list.length < 3 ? "(3+ players)" : ""}</button></div>`;
      return;
    }
    if (wwi.i >= wwi.list.length) { el.innerHTML = `<div class="card pt-card pt-center"><div class="tray-big">🎉</div><h3>That's every secret!</h3><button type="button" class="btn btn-green btn-block" id="wwiAgain">Play again</button></div>`; return; }
    const x = wwi.list[wwi.i];
    el.innerHTML = `<div class="card pt-card pt-center"><p class="meal-lab">Secret ${wwi.i + 1} of ${wwi.list.length}</p><p class="wwi-quote">“${esc(x.what)}”</p>
      <p class="review-sub">Read it out loud. Who wrote it? Everyone guesses!</p>
      ${wwi.shown ? `<p class="wwi-who">✍️ ${esc(x.who)}</p><button type="button" class="btn btn-green btn-block" id="wwiNext">Next secret ›</button>` : `<button type="button" class="btn btn-red btn-block" id="wwiShow">👀 Reveal who wrote it</button>`}</div>`;
  }
  $("#wwiSheet").addEventListener("submit", e => {
    e.preventDefault(); const f = e.target, who = f.who.value.trim(), what = f.what.value.trim();
    if (!who || !what) { toast("✍️ Add your name and your secret"); return; }
    wwi.list.push({ who, what }); renderWwi(); toast("🔒 Hidden! Pass the phone");
  });
  $("#wwiSheet").addEventListener("click", e => {
    const t = e.target;
    if (t.closest("#wwiStart")) { for (let i = wwi.list.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [wwi.list[i], wwi.list[j]] = [wwi.list[j], wwi.list[i]]; } wwi.stage = "read"; wwi.i = 0; wwi.shown = false; }
    else if (t.closest("#wwiShow")) wwi.shown = true;
    else if (t.closest("#wwiNext")) { wwi.i++; wwi.shown = false; }
    else if (t.closest("#wwiAgain")) wwi = { stage: "add", list: [], i: 0, shown: false };
    else return;
    renderWwi();
  });
  const openWwi = () => { wwi = { stage: "add", list: [], i: 0, shown: false }; renderWwi(); openSheet("wwiSheet"); };

  // ---------- taps ----------
  function ptToPlan() {   // plan and theme share one guest count and start time
    const c = cfgFor("nyeparty"); c.guests = Math.max(1, Math.min(20, pt.guests)); c.time = pt.start; mealCfg.nyeparty = c; save("mealCfg", mealCfg);
    renderNyeParty();
  }
  $("#ptOpen").addEventListener("click", () => { renderPt(); openSheet("themeSheet"); });
  $("#wwiOpen").addEventListener("click", openWwi);
  $("#themeSheet").addEventListener("click", e => {
    const t = e.target;
    const pick = t.closest("[data-pt]"); if (pick) { pt.id = pick.dataset.pt || null; if (pt.id) { const th = ptTheme(); if (th.early && ptTime(pt.start) > ptTime("19:00")) { pt.start = "17:00"; pt.end = "21:00"; } if (!th.early && ptTime(pt.start) < ptTime("18:00")) { pt.start = "20:00"; pt.end = "01:00"; } pt.tab = "night"; } savePt(); renderPt(); ptSync(); $("#themeSheet .sheet-body").scrollTop = 0; return; }
    const tb = t.closest("[data-pttab]"); if (tb) { pt.tab = tb.dataset.pttab; savePt(); renderPt(); return; }
    const g = t.closest("[data-ptg]"); if (g) { pt.guests = Math.max(2, Math.min(60, pt.guests + +g.dataset.ptg)); savePt(); ptToPlan(); renderPt(); return; }
    if (t.closest("#ptKids")) { openShow(Date.now() + 60500, "kids"); return; }
    if (t.closest("#ptApps")) { closeSheet("themeSheet"); nyeScreen = "build"; showView("nye"); renderNyeMenu(); window.scrollTo(0, 0); const o = $("#view-nye [data-open=appsSheet]"); if (o) o.click(); return; }
    if (t.closest("#ptWwi")) { openWwi(); return; }
  });
  $("#themeSheet").addEventListener("change", e => {
    const t = e.target;
    if (t.id === "ptStart" || t.id === "ptEnd") { pt[t.id === "ptStart" ? "start" : "end"] = t.value; savePt(); if (t.id === "ptStart") ptToPlan(); renderPt(); ptSync(); return; }
    if (t.id === "ptRemind") { pt.remind = t.checked; savePt(); renderPt(); ptSync(); getAudio(); if (pt.remind) toast("🔔 Party alarms are on"); return; }
    if (t.dataset.ptgot) { pt.got[t.dataset.ptgot] = t.checked; savePt(); t.closest("label").classList.toggle("on", t.checked); }
  });
  ptSync();
  /* @themes-end */
