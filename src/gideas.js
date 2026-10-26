  /* ============================================================
     💡 GIFT IDEAS (Gifts → Ideas)
     Ideas sorted by who they're for, with one-tap store searches
     (Amazon, Walmart, Target or Canadian Tire, Best Buy). Links open
     a search page, never a specific product, so they never go stale.
     Generic names only (no brands). Prices are rough CAD estimates.
     ✏️ Edit freely: [name, why it's great, low $, high $, interests, eco (1 = yes)]
     interests: creative outdoors science reading games cozy kitchen music tech active
     ============================================================ */
  const GIDEA_CATS = [
    ["little", "🧸", "Little Ones", "Ages 2–5", "for toddlers"],
    ["kids", "🪁", "Kids", "Ages 6–10", "for kids"],
    ["tweens", "🎧", "Tweens", "Ages 11–14", "for tweens"],
    ["teens", "🎮", "Teens", "Ages 15–18", "for teens"],
    ["adults", "☕", "Adults", "Grown-ups", ""],
    ["grand", "👵", "Grandparents", "Grandma & Grandpa", "for grandparents"],
    ["stocking", "🧦", "Stocking Stuffers", "Under $15", "stocking stuffer"],
    ["teachers", "🍎", "Teachers & Neighbours", "Thank-you gifts", "thank you gift"],
    ["exchange", "🎁", "Gift Exchange", "$20–30", "gift"],
    ["pets", "🐾", "Pets", "Dogs & cats", "for pets"],
    ["experience", "🎟️", "Experiences", "No clutter", ""]
  ];
  const GIDEAS = {
    little: [
      ["Magnetic building tiles", "Open-ended building that grows with them for years.", 35, 70, "creative science", 0],
      ["Wooden balance board", "Rocks, bridges and slides: burns energy indoors.", 50, 100, "active", 1],
      ["Play kitchen with food set", "Hours of pretend cooking and \"restaurant\".", 60, 150, "creative kitchen", 0],
      ["Dress-up costume trunk", "Capes, crowns and costumes for big imaginations.", 30, 60, "creative", 0],
      ["Three-wheel kids scooter", "Stable, easy to steer and great for confidence.", 50, 90, "outdoors active", 0],
      ["Picture book bundle", "A stack of beautiful read-alouds for bedtime.", 25, 50, "reading", 1],
      ["Wooden puzzle set", "Fine-motor fun with no batteries needed.", 20, 35, "games", 1],
      ["Kids art easel", "Chalkboard on one side, whiteboard on the other.", 50, 90, "creative", 0],
      ["Balance bike", "The easiest way to learn to ride a bike.", 70, 150, "outdoors active", 0],
      ["Kids play tent", "A cozy reading nook of their very own.", 40, 80, "cozy reading", 0],
      ["Toddler musical instrument set", "Drums, shakers and a xylophone for little musicians.", 25, 50, "music", 0],
      ["Stuffed animal and matching book", "A cuddly friend that goes with a favourite story.", 25, 40, "cozy reading", 0]
    ],
    kids: [
      ["Science experiment kit", "Volcanoes, crystals and slime, with real lessons.", 25, 50, "science", 0],
      ["Building bricks set", "Follow the instructions or invent their own creations.", 30, 120, "creative science", 0],
      ["Walkie talkie set", "Backyard missions and sleepover secrets.", 25, 45, "outdoors games", 0],
      ["Kids art studio kit", "Markers, paints and sketchbooks in one carry case.", 30, 60, "creative", 0],
      ["Family board game", "Something everyone can play on a snowy night.", 25, 50, "games", 0],
      ["Beginner telescope for kids", "Moon craters and Saturn's rings from the backyard.", 70, 150, "science outdoors", 0],
      ["Graphic novel box set", "Gets even reluctant readers hooked.", 30, 60, "reading", 0],
      ["Remote control car", "Fast, sturdy and fun indoors or out.", 35, 80, "tech outdoors", 0],
      ["Bike helmet with lights", "Safety that actually looks cool.", 30, 60, "active outdoors", 0],
      ["Friendship bracelet kit", "Make one for every friend.", 15, 30, "creative", 0],
      ["Kids cookbook and baking set", "Real recipes with child-sized tools.", 30, 50, "kitchen", 0],
      ["Magic tricks kit", "Amaze the whole family at dinner.", 20, 40, "games", 0]
    ],
    tweens: [
      ["Mini instant camera", "Print photos on the spot to stick on the wall.", 80, 130, "creative tech", 0],
      ["Coding robot for kids", "Learn real coding by making it move.", 70, 150, "science tech", 0],
      ["Hanging hammock chair", "The coziest spot to read or chat with friends.", 50, 100, "cozy", 0],
      ["Bead and bracelet making kit", "Endless designs to make and share.", 25, 45, "creative", 0],
      ["LED string lights for bedroom", "An instant cool-room upgrade.", 15, 30, "cozy tech", 0],
      ["Portable Bluetooth speaker", "Music for the bedroom, backyard or sleepovers.", 30, 80, "music tech", 0],
      ["Sketchbook and alcohol marker set", "For budding artists who want pro tools.", 30, 70, "creative", 0],
      ["Strategy board game", "Clever games to play with friends.", 30, 60, "games", 0],
      ["Book series box set", "A big series to binge over the holidays.", 35, 70, "reading", 0],
      ["Skateboard", "For practising tricks all spring and summer.", 60, 130, "active outdoors", 0],
      ["Escape room game box", "Puzzles and codes to crack with the family.", 25, 40, "games", 0],
      ["Insulated water bottle", "Stylish, goes everywhere and cuts plastic waste.", 20, 45, "active", 1]
    ],
    teens: [
      ["Wireless earbuds", "Always useful, always appreciated.", 60, 200, "music tech", 0],
      ["LED strip lights", "Sets the mood for gaming or studying.", 25, 50, "tech cozy", 0],
      ["35mm film camera", "Retro photos are back in a big way.", 60, 150, "creative", 0],
      ["Portable phone charger", "For long days at school and work.", 25, 60, "tech", 0],
      ["Oversized hoodie", "Comfy, cozy and always in style.", 40, 90, "cozy", 0],
      ["Skincare gift set", "A little self-care routine they'll actually use.", 25, 60, "cozy", 0],
      ["Gaming headset", "Clear sound and chat for marathon sessions.", 40, 150, "games tech", 0],
      ["Beginner cookbook and chef knife", "Independence in the kitchen.", 40, 90, "kitchen", 0],
      ["Journal and fine pen set", "For thoughts, plans and doodles.", 20, 45, "creative reading", 0],
      ["Mini projector", "Movie nights on the bedroom wall.", 80, 200, "tech cozy", 0],
      ["Desk lamp with wireless charger", "A tidy study spot that charges the phone.", 35, 70, "tech", 0],
      ["Thermal travel mug", "Hot chocolate on the go, with less waste.", 20, 40, "kitchen", 1]
    ],
    adults: [
      ["Weighted blanket", "Like a cozy hug for winter nights.", 60, 150, "cozy", 0],
      ["Pasta maker set", "A fun date-night project.", 40, 100, "kitchen", 0],
      ["Indoor herb garden kit", "Fresh basil on the windowsill all winter.", 40, 120, "kitchen", 1],
      ["Cast iron skillet", "Lasts a lifetime and gets better with age.", 35, 80, "kitchen", 1],
      ["Wireless charging stand", "A tidy nightstand, always charged.", 30, 60, "tech", 0],
      ["Coffee sampler gift set", "A tour of the world from their mug.", 25, 50, "kitchen cozy", 0],
      ["1000 piece jigsaw puzzle", "A calm, screen-free evening.", 20, 40, "games cozy", 0],
      ["Smart speaker", "Music, timers and answers by voice.", 50, 130, "tech music", 0],
      ["Cozy slippers", "Pure winter comfort from the first step.", 30, 80, "cozy", 0],
      ["Hiking daypack", "Ready for weekend adventures.", 50, 120, "outdoors active", 0],
      ["Beeswax wraps and reusable bags", "Pretty, practical and plastic-free.", 20, 40, "kitchen", 1],
      ["Bestselling novel", "Thoughtful, personal and easy to wrap.", 20, 40, "reading", 0]
    ],
    grand: [
      ["Digital photo frame", "Load it with family photos before you wrap it.", 80, 180, "tech cozy", 0],
      ["Grandparent memory journal", "Guided questions to capture their life stories.", 25, 45, "reading", 0],
      ["Heated throw blanket", "Warmth at the push of a button.", 50, 100, "cozy", 0],
      ["Blank family recipe book", "Collect everyone's favourite recipes in one keepsake.", 30, 60, "kitchen", 0],
      ["Large print puzzle books", "Crosswords, word searches and sudoku.", 20, 35, "games reading", 0],
      ["Window bird feeder", "Front-row nature watching from the kitchen.", 30, 70, "outdoors", 1],
      ["Photo calendar", "A family smile for every month of the year.", 25, 45, "creative", 0],
      ["Ergonomic garden tool set", "Easy-grip tools for happy hours in the garden.", 30, 60, "outdoors", 0],
      ["Cozy cardigan", "Soft, warm and classic.", 40, 90, "cozy", 0],
      ["Audiobook gift membership", "Stories without the eye strain.", 45, 60, "reading", 0],
      ["Tablet stand for video calls", "Makes seeing the grandkids easy.", 30, 60, "tech", 0],
      ["Tea and honey gift basket", "Simple, warm and lovely.", 30, 60, "kitchen cozy", 0]
    ],
    stocking: [
      ["Novelty socks", "A Christmas morning classic.", 8, 15, "cozy", 0],
      ["Lip balm gift set", "Small, useful and loved by everyone.", 8, 15, "cozy", 1],
      ["Puzzle cube", "Hours of fidget-friendly brain teasing.", 8, 15, "games", 0],
      ["Hot chocolate bombs", "Drop in warm milk and watch it melt open.", 8, 15, "kitchen", 0],
      ["Pocket card game", "Fun for the whole family after dinner.", 10, 15, "games", 0],
      ["Reusable hand warmers", "Warm hands on winter walks, again and again.", 10, 15, "outdoors", 1],
      ["Bath bombs", "A fizzy, relaxing treat.", 8, 15, "cozy", 0],
      ["Pocket notebook and gel pens", "For lists, doodles and secret notes.", 8, 15, "creative", 0],
      ["Phone grip stand", "Handy for selfies and video calls.", 8, 15, "tech", 0],
      ["Mini LED headlamp", "Perfect for camping, reading or power outages.", 10, 15, "outdoors", 0],
      ["Flower and herb seed packets", "A promise of spring in their stocking.", 6, 12, "outdoors", 1],
      ["Chocolate orange", "The stocking-toe classic.", 5, 10, "kitchen", 0],
      ["Mini putty or slime tin", "Squishy, stretchy fidget fun for kids.", 5, 10, "creative", 0],
      ["Stickers and temporary tattoos", "Cheap, cheerful and always a hit with little ones.", 4, 10, "creative", 0],
      ["Glow sticks and bracelets", "Instant fun on Christmas night.", 4, 8, "games", 0],
      ["Magic trick card set", "Learn a trick and show the whole family.", 8, 15, "games", 0],
      ["Mini jigsaw puzzle", "A small puzzle for a quiet Boxing Day.", 8, 15, "games", 0],
      ["Fun toothbrush and toothpaste", "A sneaky, useful classic (after all that candy!).", 4, 8, "cozy", 0],
      ["Hair clips and scrunchies", "Pretty, practical and tiny enough to fit.", 6, 12, "cozy", 0],
      ["Candy canes and mini chocolates", "Fill the gaps and the toe of the stocking.", 3, 8, "kitchen", 0],
      ["Gourmet coffee or tea sampler", "A cozy treat for the grown-ups.", 8, 15, "kitchen cozy", 0],
      ["Small hot sauce or spice blend", "A fun foodie surprise for adults.", 8, 15, "kitchen", 0],
      ["Keychain flashlight or multi-tool", "Handy every day of the year.", 8, 15, "outdoors tech", 0],
      ["Store or coffee shop gift card", "Always the right size and always welcome.", 10, 25, "", 0]
    ],
    teachers: [
      ["Coffee shop gift card", "Fuel for the busiest weeks of the year.", 10, 25, "kitchen", 0],
      ["Hand cream gift set", "A little luxury for chalk-dusty hands.", 15, 30, "cozy", 0],
      ["Succulent in a pot", "Brightens a desk and is almost impossible to kill.", 10, 25, "outdoors", 1],
      ["Fine pen set", "Teachers always need good pens.", 15, 30, "creative", 0],
      ["Insulated tumbler", "Keeps coffee hot through recess duty.", 20, 35, "kitchen", 1],
      ["Cookie jar gift mix", "Homemade-feeling and delicious.", 10, 15, "kitchen", 0],
      ["Scented candle", "A cozy thank-you for the holidays.", 15, 30, "cozy", 0],
      ["Bookstore gift card", "Let them choose their next great read.", 15, 30, "reading", 0],
      ["Classroom supplies bundle", "Tissues, markers and sticky notes: always welcome.", 20, 40, "creative", 0],
      ["Personalized ornament", "A keepsake from their class.", 10, 20, "creative", 0]
    ],
    exchange: [
      ["Cozy throw blanket", "Everyone loves a soft blanket.", 25, 30, "cozy", 0],
      ["Party card game", "Guaranteed laughs at the next gathering.", 20, 30, "games", 0],
      ["Candle gift set", "Classic, cozy and safe for anyone.", 20, 30, "cozy", 0],
      ["Gourmet hot sauce set", "A fun one for the foodies.", 20, 30, "kitchen", 0],
      ["Bluetooth shower speaker", "Sing-alongs in the shower.", 20, 30, "music tech", 0],
      ["Desk organizer", "Tidy desk, happy mind.", 20, 30, "", 0],
      ["Popcorn seasoning gift set", "Movie night, upgraded.", 20, 30, "kitchen", 0],
      ["Mini waffle maker", "Tiny waffles, huge smiles.", 25, 30, "kitchen", 0],
      ["Houseplant in a pot", "Green, cheerful and long-lasting.", 20, 30, "outdoors", 1],
      ["500 piece jigsaw puzzle", "A relaxing weekend project.", 20, 30, "games", 0],
      ["Funny mug and cocoa", "A smile with every sip.", 20, 25, "kitchen", 0],
      ["Insulated wine tumbler", "Keeps drinks cold or hot for hours.", 20, 30, "kitchen", 1]
    ],
    pets: [
      ["Dog puzzle feeder toy", "Keeps clever pups busy and happy.", 15, 35, "games", 0],
      ["Cozy pet bed", "The best nap spot in the house.", 35, 80, "cozy", 0],
      ["Holiday pet sweater", "Festive photos guaranteed.", 20, 35, "cozy", 0],
      ["Durable dog chew toys", "Built to last through serious chewing.", 15, 30, "active", 0],
      ["Cat tree with scratching post", "Climbing, scratching and lounging in one.", 40, 120, "active", 0],
      ["Natural pet treat sampler", "Healthy goodies for good boys and girls.", 15, 30, "kitchen", 0],
      ["Personalized pet ID tag", "Safety with style.", 10, 20, "", 0],
      ["Custom pet portrait", "A keepsake painting from your favourite photo.", 40, 120, "creative", 0],
      ["Interactive cat toy", "Feathers, lights and endless pouncing.", 10, 25, "games", 0],
      ["Pet grooming brush", "Less shedding, more cuddles.", 15, 35, "", 0]
    ],
    experience: [
      ["Cooking class gift card", "A night out that teaches a new skill.", 60, 150, "kitchen", 1],
      ["Movie night gift basket", "Gift card, popcorn and candy for a cozy night in.", 30, 60, "cozy", 0],
      ["Museum or zoo membership", "A whole year of family outings.", 80, 200, "science", 1],
      ["Spa gift card", "Pure relaxation after the holiday rush.", 80, 200, "cozy", 1],
      ["Concert or theatre tickets", "A night they'll never forget.", 60, 200, "music", 1],
      ["Climbing gym day pass", "An exciting first try for the adventurous.", 25, 50, "active", 1],
      ["Pottery or painting class", "Hands-on fun and something to take home.", 50, 120, "creative", 1],
      ["Ski or skating day pass", "A winter day out in the fresh air.", 40, 120, "outdoors active", 1],
      ["Escape room gift card", "Teamwork, puzzles and laughs.", 60, 150, "games", 1],
      ["Monthly subscription box", "A happy surprise in the mail every month.", 25, 50, "", 0],
      ["Family photo session", "Beautiful photos to treasure for years.", 100, 300, "creative", 1],
      ["Hot air balloon ride", "A once-in-a-lifetime view.", 200, 400, "outdoors", 1]
    ]
  };
  const GI_INTERESTS = [["creative", "🎨 Creative"], ["outdoors", "🌲 Outdoors"], ["science", "🔬 Science"], ["reading", "📚 Reading"], ["games", "🎲 Games"], ["cozy", "🧣 Cozy"], ["kitchen", "🍳 Kitchen"], ["music", "🎵 Music"], ["tech", "🔌 Tech"], ["active", "⚽ Active"]];
  const GI_BUDGETS = [["any", "Any price"], ["u25", "Under $25"], ["25", "$25–50"], ["50", "$50–100"], ["100", "$100+"]];
  let gi = load("giftIdeas", { cat: "little", budget: "any", interest: "", eco: false, saved: {} });
  let giAddFor = null;   // idea being added to the tracker

  // 🛒 stores follow the currency switch (Target left Canada, so Canadians get Canadian Tire)
  const giEnc = encodeURIComponent;
  function giStores() {
    return currency === "USD" ? [
      ["Amazon", "https://www.amazon.com", q => `https://www.amazon.com/s?k=${giEnc(q)}`],
      ["Walmart", "https://www.walmart.com", q => `https://www.walmart.com/search?q=${giEnc(q)}`],
      ["Target", "https://www.target.com", q => `https://www.target.com/s?searchTerm=${giEnc(q)}`],
      ["Best Buy", "https://www.bestbuy.com", q => `https://www.bestbuy.com/site/searchpage.jsp?st=${giEnc(q)}`]
    ] : [
      ["Amazon", "https://www.amazon.ca", q => `https://www.amazon.ca/s?k=${giEnc(q)}`],
      ["Walmart", "https://www.walmart.ca", q => `https://www.walmart.ca/search?q=${giEnc(q)}`],
      ["Canadian Tire", "https://www.canadiantire.ca", q => `https://www.canadiantire.ca/en/search-results.html?q=${giEnc(q)}`],
      ["Best Buy", "https://www.bestbuy.ca", q => `https://www.bestbuy.ca/en-ca/search?search=${giEnc(q)}`]
    ];
  }
  // opens the store in a pop-up browser (iPhone app: tap Done to come straight back) or a new browser tab
  async function openStore(url) {
    const br = NoelNative.plugin("Browser");
    if (br) { try { await br.open({ url, presentationStyle: "popover" }); return; } catch (e) {} }
    window.open(url, "_blank", "noopener");
  }
  const giMid = x => (x[2] + x[3]) / 2 * fx();
  // an idea fits a budget when its price range overlaps it
  const giInBudget = x => { if (gi.budget === "any") return true; const lo = x[2] * fx(), hi = x[3] * fx();
    const [a, b] = { u25: [0, 25], "25": [25, 50], "50": [50, 100], "100": [100, 1e9] }[gi.budget]; return lo < b && hi >= a; };
  const giKey = (cat, x) => cat + "|" + x[0];
  const giRange = x => { const lo = Math.round(x[2] * fx()), hi = Math.round(x[3] * fx()); return lo === hi ? `$${lo}` : `$${lo}–${hi}`; };

  function renderIdeas() {
    const cat = GIDEA_CATS.find(c => c[0] === gi.cat) || GIDEA_CATS[0];
    const stores = giStores();
    $("#giStores").innerHTML = stores.map(([n, home]) => `<button type="button" class="gi-store" data-gihome="${home}">${esc(n)}</button>`).join("");
    $("#giCats").innerHTML = GIDEA_CATS.map(c => `<button type="button" class="gi-cat${c[0] === gi.cat ? " on" : ""}" data-gicat="${c[0]}"><span>${c[1]}</span><b>${esc(c[2])}</b><small>${esc(c[3])}</small></button>`).join("") +
      `<button type="button" class="gi-cat${gi.cat === "saved" ? " on" : ""}" data-gicat="saved"><span>♥</span><b>Saved</b><small>${Object.keys(gi.saved).length} ideas</small></button>`;
    $("#giFilters").innerHTML = GI_BUDGETS.map(([k, l]) => `<button type="button" class="chip${gi.budget === k ? " on" : ""}" data-gibudget="${k}">${l}</button>`).join("") +
      `<button type="button" class="chip${gi.eco ? " on" : ""}" data-gieco="1">🌿 Eco picks</button>` +
      `<span class="gi-break"></span>` + GI_INTERESTS.map(([k, l]) => `<button type="button" class="chip${gi.interest === k ? " on" : ""}" data-giint="${k}">${l}</button>`).join("");
    let list = gi.cat === "saved"
      ? Object.keys(gi.saved).map(k => { const [c, n] = k.split("|"); const x = (GIDEAS[c] || []).find(y => y[0] === n); return x ? [c, x] : null; }).filter(Boolean)
      : (GIDEAS[cat[0]] || []).map(x => [cat[0], x]);
    list = list.filter(([, x]) => giInBudget(x) && (!gi.eco || x[5]) && (!gi.interest || x[4].split(" ").includes(gi.interest)));
    const people = gifts.people;
    $("#giList").innerHTML = list.length ? list.map(([c, x]) => {
      const k = giKey(c, x), suffix = (GIDEA_CATS.find(z => z[0] === c) || [])[4] || "", q = (x[0] + " " + suffix).trim(), adding = giAddFor === k;
      return `<div class="card gi-card" data-gik="${esc(k)}">
        <div class="gi-top"><div><h4>${esc(x[0])}${x[5] ? ` <span class="gi-eco">🌿 Eco</span>` : ""}</h4><p>${esc(x[1])}</p></div>
          <button type="button" class="app-fav" data-gisave aria-pressed="${gi.saved[k] ? "true" : "false"}" aria-label="Save ${esc(x[0])}">${gi.saved[k] ? "♥" : "♡"}</button></div>
        <div class="gi-meta"><span class="gi-price">${giRange(x)}</span>${gi.cat === "saved" ? `<span class="gi-for">${esc((GIDEA_CATS.find(z => z[0] === c) || [])[2] || "")}</span>` : ""}</div>
        <div class="gi-find"><span>Find it:</span>${stores.map(([n, , s]) => `<button type="button" class="gi-store sm" data-giurl="${esc(s(q))}">${esc(n)}</button>`).join("")}</div>
        ${adding ? `<div class="gi-add"><select class="input" data-giperson>${people.map(p => `<option value="${p.id}">${esc(p.name)}</option>`).join("")}<option value="__new">➕ Someone new…</option></select>
            <input class="input" data-ginew placeholder="Their name" maxlength="40" ${people.length ? "hidden" : ""}>
            <button type="button" class="btn btn-green" data-giaddgo>Add</button></div>`
          : `<button type="button" class="btn btn-ghost btn-block gi-addbtn" data-giadd>➕ Add to my gift tracker</button>`}
      </div>`;
    }).join("") : `<p class="apps-empty">${gi.cat === "saved" ? "Tap ♡ on any idea to save it here." : "No ideas match those filters. Try another price or interest."}</p>`;
    if (giAddFor) { const sel = $("#giList [data-giperson]"); if (sel && !gifts.people.length) sel.value = "__new"; }
  }

  $("#paneIdeas").addEventListener("click", e => {
    const t = e.target, save1 = () => save("giftIdeas", gi);
    const home = t.closest("[data-gihome]"); if (home) { openStore(home.dataset.gihome); return; }
    const url = t.closest("[data-giurl]"); if (url) { openStore(url.dataset.giurl); return; }
    const c = t.closest("[data-gicat]"); if (c) { gi.cat = c.dataset.gicat; giAddFor = null; save1(); renderIdeas(); return; }
    const b = t.closest("[data-gibudget]"); if (b) { gi.budget = b.dataset.gibudget; save1(); renderIdeas(); return; }
    if (t.closest("[data-gieco]")) { gi.eco = !gi.eco; save1(); renderIdeas(); return; }
    const i = t.closest("[data-giint]"); if (i) { gi.interest = gi.interest === i.dataset.giint ? "" : i.dataset.giint; save1(); renderIdeas(); return; }
    const card = t.closest("[data-gik]"); if (!card) return;
    const k = card.dataset.gik;
    if (t.closest("[data-gisave]")) { if (gi.saved[k]) delete gi.saved[k]; else { gi.saved[k] = 1; toast("♥ Saved to your ideas"); } save1(); renderIdeas(); return; }
    if (t.closest("[data-giadd]")) { giAddFor = k; renderIdeas(); return; }
    if (t.closest("[data-giaddgo]")) {
      const [cat, name] = k.split("|"), x = (GIDEAS[cat] || []).find(y => y[0] === name); if (!x) return;
      let pid = card.querySelector("[data-giperson]").value, p = gifts.people.find(z => z.id === pid);
      if (pid === "__new") {
        const nm = card.querySelector("[data-ginew]").value.trim(); if (!nm) { toast("✏️ Type their name first"); return; }
        p = gifts.people.find(z => z.name.toLowerCase() === nm.toLowerCase()) || null;
        if (!p) { p = { id: uid(), name: nm, gifts: [] }; gifts.people.push(p); }
      }
      if (!p) return;
      p.gifts.push({ id: uid(), name: x[0], price: Math.round(giMid(x)), status: "idea" });
      save("gifts", gifts); renderGifts(); giAddFor = null; renderIdeas();
      toast(`🎁 Added to ${p.name}'s list at about $${Math.round(giMid(x))}`);
    }
  });
  $("#paneIdeas").addEventListener("change", e => {
    const sel = e.target.closest("[data-giperson]"); if (!sel) return;
    sel.parentElement.querySelector("[data-ginew]").hidden = sel.value !== "__new";
  });
  /* @gideas-end */
