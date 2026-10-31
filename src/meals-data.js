/* ============================================================
   🍽️ MEAL PLANNER: the menus (original recipes, Earth & Wonder)
   Every recipe is written for 8 people. The app scales it for 1–20.
   Ingredient: { q: amount, u: unit, t: "text" or ["one", "many"], s: how it scales }
     s: "f" = with guests (default) · "w" = with roast size · "p" = per dessert batch · "b" = per main batch · "n" = never
     u: "cup" "tbsp" "tsp" "lb" "oz" or "" for a count
   ✏️ To add a meal, copy one block in MEALS and change it.
   ============================================================ */
window.NOEL_MEALS = (function () {
  const turkey = {
    id: "turkey",
    tab: "traditional",
    name: "Christmas Turkey Dinner",
    icon: "🦃",
    blurb: "Herb butter roast turkey, gravy, stuffing, three sides and pumpkin pie.",
    menu: [
      ["Appetizer", ["Herbed Cream Cheese Crostini with Cranberry"]],
      ["Main", ["Herb Butter Roast Turkey", "Giblet Pan Gravy"]],
      ["Stuffing", ["Classic Herb & Onion Bread Stuffing"]],
      ["Sides", ["Garlic Mashed Potatoes", "Roasted Brussels Sprouts", "Honey-Glazed Carrots", "Fresh Orange-Cranberry Sauce"]],
      ["Dessert", ["Spiced Pumpkin Pie with Whipped Cream"]]
    ],
    drinks: [
      ["With dinner", "A light red such as Pinot Noir, or a dry white such as Riesling or unoaked Chardonnay."],
      ["Non-alcoholic", "Sparkling Cranberry-Orange Punch (recipe included) or chilled sparkling apple cider."],
      ["With dessert", "Hot coffee, black tea or warm spiced apple cider."]
    ],
    recipes: [
      {
        id: "crostini", course: "Appetizer", name: "Herbed Cream Cheese Crostini with Cranberry",
        prep: "15 min", cook: "10 min", yieldText: f => `about ${Math.round(30 * f)} pieces`,
        ing: [
          { q: 1, u: "", t: ["French baguette, cut into ½-inch slices", "French baguettes, cut into ½-inch slices"] },
          { q: 3, u: "tbsp", t: "olive oil" },
          { q: 8, u: "oz", t: "cream cheese, softened" },
          { q: 2, u: "tbsp", t: "fresh chives, finely chopped" },
          { q: 1, u: "tbsp", t: "fresh flat-leaf parsley, finely chopped" },
          { q: 1, u: "", t: ["small garlic clove, finely grated", "small garlic cloves, finely grated"] },
          { q: 0.5, u: "tsp", t: "lemon zest" },
          { q: 0.25, u: "tsp", t: "kosher salt" },
          { q: 0.5, u: "cup", t: "Orange-Cranberry Sauce (from the recipe below)" }
        ],
        steps: [
          "Heat the oven to 400°F (200°C).",
          "Arrange the bread slices on baking sheets and brush the tops lightly with olive oil.",
          "Toast for 8–10 minutes, until golden and crisp. Cool completely.",
          "Beat the cream cheese, chives, parsley, garlic, lemon zest and salt until smooth.",
          "Just before serving, spread each toast with the herb cheese and top with a small spoonful of cranberry sauce."
        ],
        tip: "Toast the crostini the day before and store them airtight, so the oven is free for the turkey. Assemble no more than 30 minutes before guests arrive so they stay crisp."
      },
      {
        id: "turkey", course: "Main", name: "Herb Butter Roast Turkey",
        prep: "30 min", cook: p => p.roastText, rest: p => p.rest + " min", yieldText: (f, p) => `one ${p.w} lb turkey`,
        ing: [
          { q: 1, u: "", s: "n", t: p => `whole turkey, ${p.w} lb, fully thawed, neck and giblets removed and saved for the gravy` },
          { q: 2, u: "cup", s: "n", t: "low-sodium chicken or turkey stock, for the roasting pan" },
          { q: 1, u: "tbsp", s: "w", t: "kosher salt" },
          { q: 1, u: "tsp", s: "w", t: "black pepper" },
          { head: "Herb butter" },
          { q: 0.5, u: "cup", s: "w", t: "unsalted butter, softened" },
          { q: 2, u: "tbsp", s: "w", t: "fresh sage, chopped" },
          { q: 1, u: "tbsp", s: "w", t: "fresh thyme leaves" },
          { q: 1, u: "tbsp", s: "w", t: "fresh rosemary, finely chopped" },
          { q: 2, u: "tbsp", s: "w", t: "fresh flat-leaf parsley, chopped" },
          { q: 3, u: "", s: "w", t: ["garlic clove, minced", "garlic cloves, minced"] },
          { q: 1, u: "tsp", s: "w", t: "lemon zest" },
          { q: 1.5, u: "tsp", s: "w", t: "kosher salt" },
          { q: 0.5, u: "tsp", s: "w", t: "black pepper" },
          { head: "For the cavity" },
          { q: 1, u: "", s: "n", t: "yellow onion, quartered" },
          { q: 1, u: "", s: "n", t: "lemon, halved (the one you zested)" },
          { q: 1, u: "", s: "n", t: "head of garlic, halved crosswise" },
          { q: null, u: "", s: "n", t: "A few sprigs each of sage, thyme and rosemary" }
        ],
        steps: [
          p => `Thaw the turkey in the refrigerator, allowing about 24 hours for every 4–5 lb. A ${p.w} lb turkey needs about ${p.thawDays} days.`,
          "Take the turkey out of the refrigerator 1 hour before roasting.",
          "Place a rack in the lower third of the oven and heat it to 325°F (165°C).",
          "Pat the turkey completely dry inside and out with paper towels. Dry skin browns better.",
          "Mash together all the herb butter ingredients until evenly mixed.",
          "Gently loosen the breast skin with your fingers. Spread about two-thirds of the herb butter on the meat under the skin, and rub the rest over the outside.",
          "Season the outside and the cavity with the salt and pepper.",
          "Fill the cavity loosely with the onion, lemon, garlic and herb sprigs. Tuck the wing tips under and tie the legs loosely with kitchen twine.",
          "Set the turkey breast-side up on a rack in a large roasting pan and pour the stock into the pan.",
          p => `Roast for about ${p.roastText}. Baste with the pan juices every 45 minutes. If the breast browns too quickly, cover it loosely with foil.`,
          "Start checking 30 minutes before the expected finish. The turkey is done when a thermometer in the thickest part of the thigh, not touching the bone, reads 165°F (74°C).",
          p => `Move the turkey to a cutting board, cover loosely with foil and rest for ${p.rest} minutes before carving. Keep the pan drippings for the gravy.`
        ],
        tip: "Resting time is your best friend: while the turkey rests, the oven is free for the stuffing and sprouts. An instant-read thermometer is the only reliable way to know it's done."
      },
      {
        id: "gravy", course: "Main", name: "Giblet Pan Gravy",
        prep: "10 min", cook: "1 hour for the stock (hands-off), then 10–15 min", yieldText: f => `about ${fmtCups(4 * f)} of gravy`,
        ing: [
          { head: "Giblet stock" },
          { q: null, u: "", s: "n", t: "Turkey neck and giblets (heart and gizzard; leave out the liver)" },
          { q: 5, u: "cup", t: "low-sodium chicken or turkey stock" },
          { q: 1, u: "", t: ["yellow onion, quartered", "yellow onions, quartered"] },
          { q: 2, u: "", t: ["celery rib, cut in chunks", "celery ribs, cut in chunks"] },
          { q: 1, u: "", t: ["carrot, cut in chunks", "carrots, cut in chunks"] },
          { head: "Gravy" },
          { q: null, u: "", s: "n", t: "Pan drippings from the roasted turkey" },
          { q: 0.25, u: "cup", t: "turkey fat skimmed from the drippings (top up with butter if needed)" },
          { q: 0.25, u: "cup", t: "all-purpose flour" },
          { q: 4, u: "cup", t: "giblet stock (from above)" },
          { q: 1, u: "tsp", t: "fresh thyme leaves" },
          { q: null, u: "", s: "n", t: "Kosher salt and black pepper, to taste" }
        ],
        steps: [
          "While the turkey roasts, put the neck, giblets, onion, celery and carrot in a saucepan with the stock.",
          "Bring to a boil, then simmer gently, uncovered, for 1 hour.",
          "Strain and discard the solids. Top up with plain stock if you're short.",
          "When the turkey comes out, pour the drippings into a heatproof cup and let them settle for 5 minutes. Spoon the fat from the top into a saucepan.",
          "Heat the fat over medium heat. Whisk in the flour and cook, whisking, for 2–3 minutes until golden and nutty-smelling.",
          "Slowly whisk in the warm giblet stock, then the remaining drippings with the fat skimmed off.",
          "Simmer, whisking often, for 5–8 minutes until smooth and thick enough to coat a spoon.",
          "Stir in the thyme and season with salt and pepper."
        ],
        tip: "Pour a little stock into the empty roasting pan and scrape up the browned bits, then add that liquid to the gravy for deeper flavour."
      },
      {
        id: "stuffing", course: "Stuffing", name: "Classic Herb & Onion Bread Stuffing",
        prep: "25 min, plus drying the bread", cook: "55–60 min", yieldText: f => servings(f),
        note: (f, p) => p.dishes > 1 ? `For this many guests, use ${p.dishes} baking dishes (9×13-inch).` : "",
        ing: [
          { q: 1, u: "lb", t: "crusty white or sourdough bread, cut into 1-inch cubes" },
          { q: 0.5, u: "cup", t: "unsalted butter, plus extra for the dish" },
          { q: 2, u: "", t: ["medium yellow onion, diced", "medium yellow onions, diced"] },
          { q: 3, u: "", t: ["celery rib, diced", "celery ribs, diced"] },
          { q: 3, u: "", t: ["garlic clove, minced", "garlic cloves, minced"] },
          { q: 2, u: "tbsp", t: "fresh sage, chopped" },
          { q: 1, u: "tbsp", t: "fresh thyme leaves" },
          { q: 0.25, u: "cup", t: "fresh flat-leaf parsley, chopped" },
          { q: 1, u: "tsp", t: "kosher salt" },
          { q: 0.5, u: "tsp", t: "black pepper" },
          { q: 2, u: "", up: true, t: ["large egg", "large eggs"] },
          { q: 2.75, u: "cup", t: "low-sodium chicken or turkey stock (use a little less or more as needed)" }
        ],
        steps: [
          "Dry the bread: spread the cubes on baking sheets and leave them out overnight, or bake at 300°F (150°C) for 15–20 minutes until dry but not browned.",
          "Butter the baking dish.",
          "Melt the butter in a large skillet over medium heat. Cook the onions and celery for 8–10 minutes until soft.",
          "Add the garlic, sage and thyme and cook 1 minute more.",
          "In a very large bowl, toss the bread with the vegetables, parsley, salt and pepper.",
          "Whisk the eggs with most of the stock. Pour over the bread and toss gently. Add more stock if it seems dry.",
          "Spread in the dish and cover tightly with foil.",
          "Bake covered at 325°F (165°C) for 40 minutes, alongside the turkey.",
          "When the turkey comes out, raise the oven to 425°F (220°C). Uncover and bake 15–20 minutes more until golden and crisp on top."
        ],
        tip: "Baking stuffing in its own dish is safer than inside the bird and gives crispy edges. You can assemble it up to 4 hours ahead and refrigerate it; add 10 minutes to the covered time."
      },
      {
        id: "potatoes", course: "Sides", name: "Garlic Mashed Potatoes",
        prep: "15 min", cook: "25 min", yieldText: f => servings(f),
        note: f => f > 1.5 ? "For this many guests, cook the potatoes in two large pots." : "",
        ing: [
          { q: 4, u: "lb", t: "Yukon Gold potatoes, peeled and cut into 2-inch chunks" },
          { q: 6, u: "", t: ["garlic clove, peeled", "garlic cloves, peeled"] },
          { q: 1, u: "tbsp", t: "kosher salt, for the cooking water" },
          { q: 0.5, u: "cup", t: "unsalted butter" },
          { q: 1, u: "cup", t: "whole milk" },
          { q: 0.5, u: "cup", t: "heavy cream" },
          { q: null, u: "", s: "n", t: "Kosher salt and black pepper, to taste" },
          { q: 2, u: "tbsp", t: "fresh chives, chopped" }
        ],
        steps: [
          "Put the potatoes and garlic in a large pot, cover with cold water by 1 inch and add the salt.",
          "Bring to a boil, then simmer 20–25 minutes until a knife slides through easily.",
          "Meanwhile, warm the butter, milk and cream together until the butter melts. Don't let it boil.",
          "Drain well and return to the hot pot over low heat for 1 minute to dry off.",
          "Mash until smooth, then stir in the warm milk mixture.",
          "Season with salt and pepper and sprinkle with chives."
        ],
        tip: "Mashed potatoes hold for up to an hour in a covered pot over the lowest heat, or in a slow cooker on warm. Stir in a splash of warm milk before serving."
      },
      {
        id: "sprouts", course: "Sides", name: "Roasted Brussels Sprouts",
        prep: "10 min", cook: "20–25 min", yieldText: f => servings(f),
        note: f => f > 1.5 ? "For a big crowd, use both oven racks and swap the sheets halfway through." : "",
        ing: [
          { q: 2, u: "lb", t: "Brussels sprouts, trimmed and halved" },
          { q: 3, u: "tbsp", t: "olive oil" },
          { q: 1, u: "tsp", t: "kosher salt" },
          { q: 0.5, u: "tsp", t: "black pepper" },
          { q: 1, u: "tbsp", t: "balsamic vinegar or fresh lemon juice (optional)" }
        ],
        steps: [
          "Heat the oven to 425°F (220°C).",
          "Toss the sprouts with the olive oil, salt and pepper.",
          "Spread in a single layer, cut side down, on baking sheets. Don't crowd them, or they steam instead of browning.",
          "Roast 20–25 minutes, until the cut sides are deep golden and the centres are tender.",
          "Drizzle with balsamic or lemon juice just before serving, if using."
        ],
        tip: "Trim and halve the sprouts the day before and refrigerate them in a bag. They go into the oven the moment the turkey comes out."
      },
      {
        id: "carrots", course: "Sides", name: "Honey-Glazed Carrots",
        prep: "10 min", cook: "15–17 min", yieldText: f => servings(f),
        ing: [
          { q: 2, u: "lb", t: "carrots, peeled and sliced ½-inch thick on the diagonal" },
          { q: 3, u: "tbsp", t: "unsalted butter" },
          { q: 3, u: "tbsp", t: "honey" },
          { q: 0.5, u: "tsp", t: "kosher salt" },
          { q: 0.5, u: "cup", t: "water" },
          { q: 1, u: "tsp", t: "fresh thyme leaves or chopped parsley" }
        ],
        steps: [
          "Put the carrots, butter, honey, salt and water in a large skillet.",
          "Bring to a simmer, cover and cook 8–10 minutes until just tender.",
          "Uncover, turn the heat to medium-high and cook 5–7 minutes, stirring often, until the liquid becomes a shiny glaze.",
          "Sprinkle with thyme or parsley."
        ],
        tip: "This one cooks on the stovetop, so it never competes for oven space."
      },
      {
        id: "cranberry", course: "Sides", name: "Fresh Orange-Cranberry Sauce",
        prep: "5 min", cook: "12 min", yieldText: f => `about ${fmtCups(2.5 * f)}`,
        ing: [
          { q: 12, u: "oz", t: "fresh or frozen cranberries" },
          { q: 0.75, u: "cup", t: "granulated sugar" },
          { q: 0.75, u: "cup", t: "orange juice" },
          { q: 0.25, u: "cup", t: "water" },
          { q: 1, u: "", t: ["orange, zested", "oranges, zested"] },
          { q: null, u: "", s: "n", t: "Pinch of kosher salt" },
          { q: 1, u: "", t: ["cinnamon stick (optional)", "cinnamon sticks (optional)"] }
        ],
        steps: [
          "Put everything in a saucepan over medium heat.",
          "Bring to a simmer, stirring until the sugar dissolves.",
          "Simmer 10–12 minutes, stirring now and then, until most berries burst and the sauce thickens.",
          "Remove the cinnamon stick and cool. It thickens more as it cools.",
          "Refrigerate until serving."
        ],
        tip: "Make it up to 5 days ahead. Set aside some for the crostini."
      },
      {
        id: "pie", course: "Dessert", name: "Spiced Pumpkin Pie with Whipped Cream",
        prep: "30 min, plus chilling", cook: "about 1 hour 15 min", rest: "cool 2 hours",
        yieldText: (f, p) => p.pies > 1 ? `${p.pies} pies (9-inch), 8 slices each` : "one 9-inch pie (8 slices)",
        note: (f, p) => p.pies > 1 ? `Amounts below are for all ${p.pies} pies together. Make each crust separately.` : "",
        ing: [
          { head: "All-butter crust" },
          { q: 1.25, u: "cup", s: "p", t: "all-purpose flour, plus extra for rolling" },
          { q: 1, u: "tbsp", s: "p", t: "granulated sugar" },
          { q: 0.25, u: "tsp", s: "p", t: "kosher salt" },
          { q: 0.5, u: "cup", s: "p", t: "cold unsalted butter, cubed" },
          { q: 3.5, u: "tbsp", s: "p", t: "ice water, about" },
          { head: "Filling" },
          { q: 1, u: "", s: "p", t: ["can (15 oz) pure pumpkin purée (not pie filling)", "cans (15 oz each) pure pumpkin purée (not pie filling)"] },
          { q: 0.75, u: "cup", s: "p", t: "packed brown sugar" },
          { q: 1.5, u: "tsp", s: "p", t: "ground cinnamon" },
          { q: 1, u: "tsp", s: "p", t: "ground ginger" },
          { q: 0.25, u: "tsp", s: "p", t: "ground nutmeg" },
          { q: 0.125, u: "tsp", s: "p", t: "ground cloves" },
          { q: 0.5, u: "tsp", s: "p", t: "kosher salt" },
          { q: 3, u: "", s: "p", t: ["large egg", "large eggs"] },
          { q: 1, u: "cup", s: "p", t: "heavy cream" },
          { q: 0.5, u: "cup", s: "p", t: "whole milk" },
          { q: 1, u: "tsp", s: "p", t: "vanilla extract" },
          { head: "Whipped cream" },
          { q: 1, u: "cup", s: "p", t: "cold heavy cream" },
          { q: 2, u: "tbsp", s: "p", t: "granulated sugar" },
          { q: 0.5, u: "tsp", s: "p", t: "vanilla extract" }
        ],
        steps: [
          "Crust: mix the flour, sugar and salt. Cut in the butter until it looks like coarse crumbs with some pea-sized pieces.",
          "Sprinkle in the ice water a tablespoon at a time, tossing with a fork, until the dough holds together when squeezed.",
          "Shape into a disk, wrap and chill at least 1 hour.",
          "Roll into a 12-inch circle, fit into a 9-inch pie dish and crimp the edges. Chill 30 minutes.",
          "Heat the oven to 400°F (200°C). Line the crust with parchment and fill with pie weights or dried beans. Bake 15 minutes, remove the weights and bake 5 minutes more.",
          "Lower the oven to 350°F (175°C).",
          "Filling: whisk the pumpkin, brown sugar, spices and salt until smooth. Whisk in the eggs one at a time, then the cream, milk and vanilla.",
          "Pour into the warm crust and bake 45–55 minutes, until the edges are set and the centre jiggles only slightly. Cover the crust edges with foil if they brown too fast.",
          "Cool on a rack at least 2 hours.",
          "Just before serving, beat the cold cream, sugar and vanilla to soft peaks."
        ],
        tip: "Bake the pie the day before. It sets beautifully overnight in the fridge, and your oven stays free on Christmas Day."
      },
      {
        id: "punch", course: "Drinks", name: "Sparkling Cranberry-Orange Punch",
        prep: "5 min", cook: "none", yieldText: f => `about ${Math.round(10 * f)} cups`,
        ing: [
          { q: 4, u: "cup", t: "cranberry juice, chilled" },
          { q: 2, u: "cup", t: "orange juice, chilled" },
          { q: 4, u: "cup", t: "sparkling water or ginger ale, chilled" },
          { q: 1, u: "", t: ["orange, thinly sliced", "oranges, thinly sliced"] },
          { q: null, u: "", s: "n", t: "A handful of fresh cranberries and a few rosemary sprigs" }
        ],
        steps: [
          "Stir the cranberry and orange juice together in a large pitcher or punch bowl.",
          "Just before serving, add the sparkling water or ginger ale.",
          "Float the orange slices, cranberries and rosemary on top. Serve over ice."
        ],
        tip: "For adult guests, top individual glasses with sparkling wine, so the bowl stays family-friendly."
      }
    ],

    // ⏰ The day's plan, counted back from dinner time (minutes). p = sizes worked out for this meal.
    timeline(p) {
      const out = [], R = p.roast, rest = p.rest, tIn = -(rest + R), tOut = -rest;
      const add = (m, icon, text, alarm = true, main = false) => out.push({ m, icon, text, alarm, main });
      add(tIn - 60, "🦃", "Take the turkey out of the fridge");
      add(tIn - 35, "🔥", "Heat the oven to 325°F and butter the turkey");
      add(tIn, "🦃", `Turkey into the oven (${p.w} lb, about ${p.roastText})`, true, true);
      add(tIn + 25, "🍲", "Start the giblet stock (simmers 1 hour)");
      for (let b = tIn + 45; b < tOut - 35; b += 45) add(b, "🥄", "Baste the turkey");
      add(tIn + 85, "🍲", "Strain the giblet stock");
      add(Math.max(tIn + 30, tOut - 100), "🍞", "Assemble the stuffing and refrigerate it");
      add(-105, "🥤", "Mix the punch base and chill it");
      add(tOut - 40, "🍞", "Stuffing into the oven, covered");
      add(tOut - 30, "🌡️", "Start checking the turkey: 165°F in the thickest part of the thigh");
      add(-75, "🥔", "Peel and cut the potatoes");
      add(-60, "🥔", "Potatoes on to boil");
      add(-60, "🥂", "Set out the crostini and punch for arriving guests");
      add(tOut, "🦃", "Turkey out to rest. Oven up to 425°F. Uncover the stuffing");
      add(tOut + 5, "🥬", "Brussels sprouts into the oven (20–25 min)");
      add(-30, "🥕", "Mash the potatoes and keep warm. Start the carrots");
      add(-25, "🫗", "Make the gravy");
      add(tOut + 20, "🍞", "Stuffing out of the oven");
      add(tOut + 27, "🥬", "Brussels sprouts out of the oven");
      add(-10, "🔪", "Carve the turkey");
      add(0, "🍽️", "Dinner is served!");
      add(60, "🥧", "Whip the cream and serve the pie");
      return out.sort((a, b) => a.m - b.m);
    },
    // days before dinner: [days before, hour, icon, text]
    ahead(p) {
      return [
        [p.thawDays, 9, "🧊", `If your turkey is frozen, move it to the fridge to thaw today (${p.w} lb needs about ${p.thawDays} days)`],
        [1, 10, "📋", `Prep day: make the cranberry sauce, bake ${p.pies > 1 ? p.pies + " pumpkin pies" : "the pumpkin pie"}, dry the bread cubes, toast the crostini, make the herb butter, trim the sprouts and slice the carrots`]
      ];
    },

    // 🛒 Shopping list for f = guests ÷ 8, w = turkey lb, pies.
    // Each line: [amount, item, estimated price in CAD (null = pantry staple, not counted)]
    // ✏️ Prices are rough Canadian grocery estimates (fall 2026). Buyers can tap a price to change it.
    shop(f, p) {
      const wf = p.w / 13, up = (x, step = 1) => Math.ceil(x / step - 1e-9) * step, n = x => Math.max(1, Math.ceil(x - 1e-9));
      const butterTbsp = 8 * wf + 9 * f + 8 * f + 3 * f + 8 * p.pies + 2;
      const sticks = n(butterTbsp / 8);
      const creamCups = 0.5 * f + 2 * p.pies, milkCups = 1 * f + 0.5 * p.pies;
      const stockCups = 2 + 5 * f + 2.75 * f;
      const cloves = 3 * wf + 3 * f + 6 * f + 1 * f;
      const onions = 2 + n(2 * f), celery = n((2 + 3 * f) / 8), garlic = 1 + n(cloves / 10);
      const pot = up(4 * f, 0.5), spr = up(2 * f, 0.5), car = up(2 * f + 0.25, 0.5), cran = n(f);
      const lemons = Math.max(2, 1 + n(f / 2)), oranges = n(f) + n(f);
      const sage = n((2 * wf + 2 * f + 2) / 8), thyme = n((wf + 1.7 * f + 2) / 8), rose = n((wf + 2 + f) / 6), pars = n((2 * wf + 5 * f) / 16), chive = n(4 * f / 8);
      const cream = n(creamCups / 2), milk = n(milkCups / 4), eggs = up(2 * f) + 3 * p.pies, cc = n(f);
      const stock = n(stockCups / 4), bread = n(f), bag = n(f);
      const flour = up(0.25 * f + 1.5 * p.pies, 0.5), sugar = up(0.75 * f + 0.2 * p.pies, 0.25), brown = up(0.75 * p.pies, 0.25);
      const cj = up(f, 0.5), oj = up(2.75 * f / 4, 0.5), fizz = up(f, 0.5);
      const pl = (k, one, many) => k > 1 ? many : one;
      return [
        ["Produce", [
          [`${onions}`, "yellow onions", onions * 0.6],
          [`${celery}`, pl(celery, "bunch celery", "bunches celery"), celery * 3.5],
          [`${garlic}`, "heads garlic", garlic * 1],
          [`${fmtNum(pot)} lb`, "Yukon Gold potatoes", pot * 1.1],
          [`${fmtNum(spr)} lb`, "Brussels sprouts", spr * 4],
          [`${fmtNum(car)} lb`, "carrots", car * 1],
          [`${cran} × 12 oz`, pl(cran, "bag fresh cranberries (plus a handful for the punch)", "bags fresh cranberries (plus a handful for the punch)"), cran * 4.5],
          [`${lemons}`, "lemons", lemons * 1],
          [`${oranges}`, "oranges", oranges * 1],
          [`${sage}`, pl(sage, "bunch fresh sage", "bunches fresh sage"), sage * 3],
          [`${thyme}`, pl(thyme, "bunch fresh thyme", "bunches fresh thyme"), thyme * 3],
          [`${rose}`, pl(rose, "bunch fresh rosemary", "bunches fresh rosemary"), rose * 3],
          [`${pars}`, pl(pars, "bunch fresh flat-leaf parsley", "bunches fresh flat-leaf parsley"), pars * 2],
          [`${chive}`, pl(chive, "bunch fresh chives", "bunches fresh chives"), chive * 3]
        ]],
        ["Meat", [[`${p.w} lb`, "whole turkey (fresh, or frozen and thawed in time)", p.w * 4.49]]],
        ["Dairy & Refrigerated", [
          [`${sticks} sticks`, `unsalted butter (${fmtNum(up(sticks / 4, 0.25))} lb)`, sticks * 1.75],
          [cupsT(up(creamCups, 0.5)), `heavy cream (${cream} × 500 ml)`, cream * 4.5],
          [cupsT(up(milkCups, 0.5)), `whole milk (${milk} × 1 L)`, milk * 2.8],
          [`${eggs}`, "large eggs", eggs * 0.45],
          [`${cc} × 8 oz`, "cream cheese", cc * 4.5]
        ]],
        ["Pantry & Dry Goods", [
          [`${stock} × 1 L`, `low-sodium chicken or turkey stock (about ${Math.ceil(stockCups)} cups)`, stock * 3.5],
          [`${bread} × 1 lb`, pl(bread, "loaf crusty white or sourdough bread", "loaves crusty white or sourdough bread"), bread * 4.5],
          [`${bag}`, pl(bag, "French baguette", "French baguettes"), bag * 3.5],
          [`${p.pies} × 15 oz`, pl(p.pies, "can pure pumpkin purée", "cans pure pumpkin purée"), p.pies * 3.5],
          [cupsT(flour), "all-purpose flour", flour * 0.25],
          [cupsT(sugar), "granulated sugar", sugar * 0.4],
          [cupsT(brown), "brown sugar", brown * 0.6],
          [`${Math.ceil(3 * f)} tbsp`, "honey", Math.ceil(3 * f) * 0.3],
          [`${Math.ceil(6 * f)} tbsp`, "olive oil", Math.ceil(6 * f) * 0.25],
          ["", "vanilla extract", null],
          ["", "balsamic vinegar (optional)", null],
          ["", "kosher salt and black pepper", null],
          ["", "ground cinnamon (plus a cinnamon stick, optional)", null],
          ["", "ground ginger, ground nutmeg, ground cloves", null]
        ]],
        ["Drinks", [
          [`${fmtNum(cj)} L`, "cranberry juice", cj * 3.5],
          [`${fmtNum(oj)} L`, "orange juice", oj * 4.5],
          [`${fmtNum(fizz)} L`, "sparkling water or ginger ale", fizz * 1.75],
          ["", "optional: sparkling apple cider, wine (1 bottle for every 3–4 adults), coffee, tea", null]
        ]],
        ["Kitchen Supplies", [
          ["", "instant-read meat thermometer", null],
          ["", "large roasting pan with a rack", null],
          [`${p.dishes}`, pl(p.dishes, "baking dish (9×13-inch)", "baking dishes (9×13-inch)"), null],
          [`${p.pies}`, pl(p.pies, "pie dish (9-inch)", "pie dishes (9-inch)"), null],
          ["", "kitchen twine, foil, parchment paper, pie weights or dried beans", null]
        ]]
      ];
    }
  };

  const ham = {
    id: "ham",
    tab: "traditional",
    name: "Christmas Glazed Ham Dinner",
    icon: "🍖",
    blurb: "Brown sugar & orange glazed ham, cheesy scalloped potatoes, green beans, winter salad and gingerbread.",
    menu: [
      ["Appetizer", ["Cranberry Pecan Cheese Ball with Crackers"]],
      ["Main", ["Brown Sugar & Orange Glazed Ham"]],
      ["Sides", ["Cheesy Scalloped Potatoes", "Garlic Green Beans with Toasted Almonds", "Winter Pear & Pomegranate Salad"]],
      ["Dessert", ["Old-Fashioned Gingerbread Cake with Whipped Cream"]]
    ],
    drinks: [
      ["With dinner", "An off-dry Riesling or Gewürztraminer, or a light, fruity red such as Pinot Noir. Their gentle sweetness loves a salty glazed ham."],
      ["Non-alcoholic", "Hot Spiced Apple Cider (recipe included) or chilled sparkling pear or apple juice."],
      ["With dessert", "Hot coffee, chai tea or a mug of the spiced cider."]
    ],
    recipes: [
      {
        id: "cheeseball", course: "Appetizer", name: "Cranberry Pecan Cheese Ball with Crackers",
        prep: "20 min, plus 2 hours chilling", cook: "none", yieldText: f => f > 1.25 ? `${Math.ceil(f - 0.25)} cheese balls` : "1 cheese ball (serves 8)",
        ing: [
          { q: 8, u: "oz", t: "cream cheese, softened" },
          { q: 1, u: "cup", t: "sharp white cheddar, finely shredded" },
          { q: 0.25, u: "cup", t: "dried cranberries, chopped" },
          { q: 2, u: "tbsp", t: "green onion, thinly sliced" },
          { q: 1, u: "", t: ["small garlic clove, finely grated", "small garlic cloves, finely grated"] },
          { q: 0.25, u: "tsp", t: "black pepper" },
          { q: 0.75, u: "cup", t: "pecans, toasted and finely chopped" },
          { q: 2, u: "tbsp", t: "fresh flat-leaf parsley, finely chopped" },
          { q: 8, u: "oz", t: "crackers, for serving" }
        ],
        steps: [
          "Beat the cream cheese until smooth. Stir in the cheddar, cranberries, green onion, garlic and pepper.",
          "Scrape onto plastic wrap, gather into a ball and chill for at least 2 hours, until firm.",
          "Mix the pecans and parsley on a plate. Unwrap the ball and roll it in the mixture, pressing gently so it sticks.",
          "Rewrap and chill until 20 minutes before serving. Serve with crackers."
        ],
        tip: "Make the cheese ball the day before. It needs no oven at all, which leaves plenty of room for the ham and potatoes."
      },
      {
        id: "ham", course: "Main", name: "Brown Sugar & Orange Glazed Ham",
        prep: "15 min", cook: p => p.roastText, rest: p => p.rest + " min", yieldText: (f, p) => `one ${p.w} lb ham`,
        ing: [
          { q: 1, u: "", s: "n", t: p => `fully cooked bone-in ham, ${p.w} lb (not spiral-cut)` },
          { q: 1, u: "cup", s: "n", t: "water, for the roasting pan" },
          { q: null, u: "", s: "n", t: "Whole cloves, for studding (optional)" },
          { head: "Glaze" },
          { q: 1, u: "cup", s: "w", t: "packed brown sugar" },
          { q: 0.33, u: "cup", s: "w", t: "orange juice" },
          { q: 0.25, u: "cup", s: "w", t: "honey" },
          { q: 2, u: "tbsp", s: "w", t: "Dijon mustard" },
          { q: 1, u: "tbsp", s: "w", t: "apple cider vinegar" },
          { q: 2, u: "tbsp", s: "w", t: "unsalted butter" },
          { q: 0.5, u: "tsp", s: "w", t: "ground cinnamon" },
          { q: 0.25, u: "tsp", s: "w", t: "ground cloves" },
          { q: 0.25, u: "tsp", s: "w", t: "black pepper" }
        ],
        steps: [
          p => `If your ham is frozen, thaw it in the refrigerator, allowing about 5 hours per pound. A ${p.w} lb ham needs about ${p.thawDays} ${p.thawDays === 1 ? "day" : "days"}.`,
          "Take the ham out of the refrigerator 1 hour before baking.",
          "Place a rack in the lower third of the oven and heat it to 325°F (165°C).",
          "With a sharp knife, score the fat in a diamond pattern about ¼ inch deep. Press a whole clove into the centre of each diamond, if you like.",
          "Set the ham, flat cut side down, on a rack in a roasting pan. Pour the water into the pan and cover the ham loosely with foil.",
          p => `Bake for about ${p.roastText} in total, until a thermometer in the thickest part (not touching the bone) reads 140°F (60°C).`,
          "While it bakes, make the glaze: simmer all the glaze ingredients in a small saucepan for 4–5 minutes, stirring, until syrupy.",
          "For the last 30 minutes, remove the foil and brush the ham generously with glaze. Brush again every 10 minutes.",
          p => `Move the ham to a carving board, tent loosely with foil and rest for ${p.rest} minutes. Carve thin slices across the grain and spoon any extra glaze over the top.`
        ],
        tip: "A fully cooked ham only needs warming through, so the glaze is where the magic happens. Keep the foil on until the last 30 minutes, so the meat stays moist."
      },
      {
        id: "scalloped", course: "Sides", name: "Cheesy Scalloped Potatoes",
        prep: "30 min", cook: "about 1 hour 35 min", rest: "10 min", yieldText: f => servings(f),
        note: (f, p) => p.dishes > 1 ? `For this many guests, use ${p.dishes} baking dishes (9×13-inch).` : "",
        ing: [
          { q: 3, u: "lb", t: "Yukon Gold potatoes, peeled and sliced ⅛ inch thick" },
          { q: 3, u: "tbsp", t: "unsalted butter, plus extra for the dish" },
          { q: 2, u: "", t: ["garlic clove, minced", "garlic cloves, minced"] },
          { q: 3, u: "tbsp", t: "all-purpose flour" },
          { q: 2.5, u: "cup", t: "whole milk, warmed" },
          { q: 0.5, u: "cup", t: "heavy cream" },
          { q: 1.5, u: "tsp", t: "kosher salt" },
          { q: 0.5, u: "tsp", t: "black pepper" },
          { q: 0.25, u: "tsp", t: "ground nutmeg" },
          { q: 1, u: "tbsp", t: "fresh thyme leaves" },
          { q: 1.5, u: "cup", t: "Gruyère or Swiss cheese, shredded" },
          { q: 0.5, u: "cup", t: "sharp white cheddar, shredded" }
        ],
        steps: [
          "Butter the baking dish.",
          "Melt the butter in a saucepan over medium heat. Add the garlic and cook 30 seconds.",
          "Whisk in the flour and cook 1 minute. Slowly whisk in the warm milk, then the cream.",
          "Simmer, whisking, for 3–4 minutes until slightly thickened. Stir in the salt, pepper, nutmeg and thyme.",
          "Layer a third of the potatoes in the dish, overlapping them. Pour over a third of the sauce and sprinkle with a third of the cheeses. Repeat twice more, ending with cheese.",
          "Cover tightly with foil and bake at 325°F (165°C) for 75 minutes, alongside the ham.",
          "When the ham comes out, raise the oven to 400°F (200°C). Uncover the potatoes and bake 20 minutes more, until golden, bubbling and tender.",
          "Rest 10 minutes before serving, so the sauce sets."
        ],
        tip: "Slice the potatoes the same thickness so they cook evenly. If baking on their own: 375°F (190°C) for 45 minutes covered, then 30 minutes uncovered."
      },
      {
        id: "beans", course: "Sides", name: "Garlic Green Beans with Toasted Almonds",
        prep: "10 min", cook: "10 min", yieldText: f => servings(f),
        ing: [
          { q: 2, u: "lb", t: "green beans, trimmed" },
          { q: 1, u: "tbsp", t: "kosher salt, for the cooking water" },
          { q: 3, u: "tbsp", t: "unsalted butter" },
          { q: 0.5, u: "cup", t: "sliced almonds" },
          { q: 2, u: "", t: ["garlic clove, thinly sliced", "garlic cloves, thinly sliced"] },
          { q: 1, u: "tsp", t: "lemon zest" },
          { q: 1, u: "tbsp", t: "fresh lemon juice" },
          { q: 0.5, u: "tsp", t: "kosher salt" },
          { q: 0.25, u: "tsp", t: "black pepper" }
        ],
        steps: [
          "Bring a large pot of water to a boil with the salt. Fill a large bowl with ice water.",
          "Boil the beans 3–4 minutes, until bright green and just tender. Drain and plunge into the ice water, then drain well and pat dry.",
          "Just before dinner, melt the butter in a large skillet over medium heat. Add the almonds and stir 2–3 minutes until golden.",
          "Add the garlic and cook 30 seconds. Add the beans and toss 3–4 minutes until hot.",
          "Stir in the lemon zest, lemon juice, salt and pepper."
        ],
        tip: "Blanch the beans the day before and keep them in the fridge. On the day, they're ready in 5 minutes on the stove, with no oven needed."
      },
      {
        id: "salad", course: "Sides", name: "Winter Pear & Pomegranate Salad",
        prep: "15 min", cook: "none", yieldText: f => servings(f),
        ing: [
          { q: 10, u: "oz", t: "mixed greens (spinach, arugula or spring mix)" },
          { q: 2, u: "", t: ["ripe pear, thinly sliced", "ripe pears, thinly sliced"] },
          { q: 0.5, u: "cup", t: "pomegranate seeds" },
          { q: 0.5, u: "cup", t: "crumbled feta or goat cheese" },
          { q: 0.5, u: "cup", t: "pecans, toasted and roughly chopped" },
          { head: "Maple-Dijon vinaigrette" },
          { q: 0.33, u: "cup", t: "olive oil" },
          { q: 2, u: "tbsp", t: "apple cider vinegar" },
          { q: 1, u: "tbsp", t: "maple syrup" },
          { q: 1, u: "tsp", t: "Dijon mustard" },
          { q: 1, u: "", t: ["small shallot, finely minced", "small shallots, finely minced"] },
          { q: 0.25, u: "tsp", t: "kosher salt" },
          { q: null, u: "", s: "n", t: "Pinch of black pepper" }
        ],
        steps: [
          "Shake all the vinaigrette ingredients together in a jar until creamy.",
          "Arrange the greens in a large bowl or platter.",
          "Top with the pear slices, pomegranate seeds, cheese and pecans.",
          "Drizzle with the vinaigrette just before serving, or pass it at the table."
        ],
        tip: "Make the vinaigrette up to 3 days ahead. Slice the pears at the last minute so they stay pale and crisp."
      },
      {
        id: "gingerbread", course: "Dessert", name: "Old-Fashioned Gingerbread Cake with Whipped Cream",
        prep: "15 min", cook: "30–35 min", rest: "cool 1 hour",
        yieldText: (f, p) => p.pies > 1 ? `${p.pies} cakes (9-inch square), 9 pieces each` : "one 9-inch square cake (9 pieces)",
        note: (f, p) => p.pies > 1 ? `Amounts below are for all ${p.pies} cakes together. Bake each in its own pan.` : "",
        ing: [
          { q: 1.5, u: "cup", s: "p", t: "all-purpose flour" },
          { q: 1, u: "tsp", s: "p", t: "baking soda" },
          { q: 1.5, u: "tsp", s: "p", t: "ground ginger" },
          { q: 1, u: "tsp", s: "p", t: "ground cinnamon" },
          { q: 0.25, u: "tsp", s: "p", t: "ground cloves" },
          { q: 0.25, u: "tsp", s: "p", t: "kosher salt" },
          { q: 0.5, u: "cup", s: "p", t: "unsalted butter, melted" },
          { q: 0.5, u: "cup", s: "p", t: "packed brown sugar" },
          { q: 0.5, u: "cup", s: "p", t: "molasses (not blackstrap)" },
          { q: 1, u: "", s: "p", t: ["large egg", "large eggs"] },
          { q: 0.5, u: "cup", s: "p", t: "boiling water" },
          { head: "Whipped cream" },
          { q: 1, u: "cup", s: "p", t: "cold heavy cream" },
          { q: 2, u: "tbsp", s: "p", t: "granulated sugar" }
        ],
        steps: [
          "Heat the oven to 350°F (175°C). Butter a 9-inch square pan and line the bottom with parchment.",
          "Whisk the flour, baking soda, ginger, cinnamon, cloves and salt in a bowl.",
          "In a large bowl, whisk the melted butter, brown sugar, molasses and egg until smooth.",
          "Stir the dry ingredients into the wet ones until just combined. Carefully stir in the boiling water. The batter will be thin.",
          "Pour into the pan and bake 30–35 minutes, until a toothpick in the centre comes out clean.",
          "Cool in the pan at least 1 hour.",
          "Just before serving, whip the cold cream and sugar to soft peaks. Serve squares of cake with a spoonful of cream."
        ],
        tip: "Gingerbread tastes even better the next day, so bake it the day before and keep it covered at room temperature."
      },
      {
        id: "cider", course: "Drinks", name: "Hot Spiced Apple Cider",
        prep: "5 min", cook: "20 min", yieldText: f => `about ${Math.round(8 * f)} cups`,
        ing: [
          { q: 8, u: "cup", t: "apple cider or unfiltered apple juice" },
          { q: 2, u: "", t: ["cinnamon stick", "cinnamon sticks"] },
          { q: 6, u: "", t: ["whole clove", "whole cloves"] },
          { q: 1, u: "", t: ["orange, sliced into rounds", "oranges, sliced into rounds"] },
          { q: 2, u: "tbsp", t: "maple syrup (optional)" }
        ],
        steps: [
          "Put everything in a large pot over medium-low heat.",
          "Bring just to a gentle simmer, then turn the heat to low and steep 20 minutes. Don't let it boil.",
          "Keep warm on the lowest heat or in a slow cooker. Ladle into mugs, leaving the spices behind."
        ],
        tip: "For adult guests, a splash of dark rum or brandy can go into individual mugs."
      }
    ],

    timeline(p) {
      const out = [], H = p.roast, tOut = -35, tIn = tOut - H;
      const add = (m, icon, text, alarm = true, main = false) => out.push({ m, icon, text, alarm, main });
      add(tIn - 60, "🍖", "Take the ham out of the fridge");
      add(tIn - 20, "🔥", "Heat the oven to 325°F and score the ham");
      add(tIn, "🍖", `Ham into the oven, covered with foil (${p.w} lb, about ${p.roastText})`, true, true);
      add(tOut - 105, "🥔", "Slice the potatoes and assemble the scalloped potatoes");
      add(tOut - 75, "🥔", "Scalloped potatoes into the oven, covered");
      add(-80, "🍎", "Start the hot spiced cider (keep warm on low)");
      add(tOut - 40, "🍯", "Make the glaze (simmer 5 minutes)");
      add(tOut - 30, "🍖", "Uncover the ham and brush on the first coat of glaze");
      add(tOut - 20, "🍖", "Brush the ham with glaze again");
      add(tOut - 10, "🍖", "Last coat of glaze, and check it reads 140°F");
      add(-60, "🧀", "Set out the cheese ball, crackers and cider for arriving guests");
      add(tOut, "🍖", "Ham out to rest. Oven up to 400°F. Uncover the potatoes");
      add(-20, "🥗", "Slice the pears and assemble the salad");
      add(-15, "🥔", "Scalloped potatoes out to rest");
      add(-12, "🫛", "Finish the green beans on the stove (5 minutes)");
      add(-10, "🔪", "Carve the ham");
      add(0, "🍽️", "Dinner is served!");
      add(45, "🍰", "Whip the cream and serve the gingerbread");
      return out.sort((a, b) => a.m - b.m);
    },
    ahead(p) {
      return [
        [p.thawDays, 9, "🧊", `If your ham is frozen, move it to the fridge to thaw today (${p.w} lb needs about ${p.thawDays} ${p.thawDays === 1 ? "day" : "days"})`],
        [1, 10, "📋", `Prep day: make the cheese ball, bake ${p.pies > 1 ? p.pies + " gingerbread cakes" : "the gingerbread"}, blanch the green beans, make the salad dressing, toast the nuts and shred the cheese`]
      ];
    },

    shop(f, p) {
      const hf = p.w / 9, up = (x, step = 1) => Math.ceil(x / step - 1e-9) * step, n = x => Math.max(1, Math.ceil(x - 1e-9));
      const pl = (k, one, many) => k > 1 ? many : one;
      const cloves = 1 * f + 2 * f + 2 * f, garlic = n(cloves / 10);
      const pot = up(3 * f, 0.5), beans = up(2 * f, 0.5), lemons = n(f), greens = n(2 * f), pears = Math.ceil(2 * f), pom = n(f / 2), shallots = n(f);
      const butterTbsp = 2 * hf + 3 * f + 1 + 3 * f + 8 * p.pies, sticks = n(butterTbsp / 8);
      const milkCups = 2.5 * f, milk = n(milkCups / 4), creamCups = 0.5 * f + 1 * p.pies, cream = n(creamCups / 2);
      const cc = n(f), ched = n(6 * f / 7), gru = n(f), feta = n(f / 2.5), eggs = p.pies;
      const brown = up(1 * hf + 0.5 * p.pies, 0.25), flour = up(0.2 * f + 1.5 * p.pies, 0.5), molasses = n(0.5 * p.pies / 1.5);
      const pecans = n(1.25 * f / 2), almonds = n(f / 2), cran = n(f / 4), crackers = n(f), cider = n(8 * f / 7.5), oranges = n(f);
      return [
        ["Produce", [
          [`${garlic}`, pl(garlic, "head garlic", "heads garlic"), garlic * 1],
          [`${fmtNum(pot)} lb`, "Yukon Gold potatoes", pot * 1.1],
          [`${fmtNum(beans)} lb`, "green beans", beans * 3.5],
          [`${greens} × 5 oz`, pl(greens, "container mixed greens", "containers mixed greens"), greens * 5],
          [`${pears}`, pl(pears, "ripe pear", "ripe pears"), pears * 1.2],
          [`${pom}`, pl(pom, "pomegranate (or 1 small tub of seeds)", "pomegranates (or tubs of seeds)"), pom * 3],
          [`${shallots}`, pl(shallots, "shallot", "shallots"), shallots * 0.75],
          [`${lemons}`, pl(lemons, "lemon", "lemons"), lemons * 1],
          [`${oranges}`, pl(oranges, "orange (for the cider)", "oranges (for the cider)"), oranges * 1],
          ["1", "bunch green onions", 1.5],
          ["1", "bunch fresh flat-leaf parsley", 2],
          ["1", "bunch fresh thyme", 3]
        ]],
        ["Meat", [[`${p.w} lb`, "fully cooked bone-in ham (not spiral-cut)", p.w * 5.49]]],
        ["Dairy & Refrigerated", [
          [`${sticks} sticks`, `unsalted butter (${fmtNum(up(sticks / 4, 0.25))} lb)`, sticks * 1.75],
          [cupsT(up(milkCups, 0.5)), `whole milk (${milk} × 1 L)`, milk * 2.8],
          [cupsT(up(creamCups, 0.5)), `heavy cream (${cream} × 500 ml)`, cream * 4.5],
          [`${cc} × 8 oz`, "cream cheese", cc * 4.5],
          [`${ched} × 7 oz`, pl(ched, "block sharp white cheddar", "blocks sharp white cheddar"), ched * 6],
          [`${gru} × 6 oz`, "Gruyère or Swiss cheese", gru * 8],
          [`${feta} × 7 oz`, "crumbled feta or goat cheese", feta * 5],
          [`${eggs}`, pl(eggs, "large egg", "large eggs"), eggs * 0.45]
        ]],
        ["Pantry & Baking", [
          [`${crackers} × 8 oz`, pl(crackers, "box crackers", "boxes crackers"), crackers * 4],
          [`${pecans} × 200 g`, pl(pecans, "bag pecans", "bags pecans"), pecans * 7],
          [`${almonds} × 100 g`, pl(almonds, "bag sliced almonds", "bags sliced almonds"), almonds * 3.5],
          [`${cran}`, "bag dried cranberries", cran * 4],
          [cupsT(brown), "brown sugar", brown * 0.6],
          [cupsT(flour), "all-purpose flour", flour * 0.25],
          [`${molasses}`, "jar molasses (not blackstrap)", molasses * 5],
          ["1", "small carton orange juice (for the glaze)", 3],
          ["", "honey", null],
          ["", "maple syrup", null],
          ["", "Dijon mustard", null],
          ["", "apple cider vinegar", null],
          ["", "olive oil", null],
          ["", "granulated sugar and baking soda", null]
        ]],
        ["Spices", [
          ["", "whole cloves", null],
          ["", "cinnamon sticks and ground cinnamon", null],
          ["", "ground ginger, ground cloves, ground nutmeg", null],
          ["", "kosher salt and black pepper", null]
        ]],
        ["Drinks", [
          [`${cider} × 1.89 L`, pl(cider, "jug apple cider or unfiltered apple juice", "jugs apple cider or unfiltered apple juice"), cider * 5],
          ["", "optional: sparkling pear or apple juice, Riesling or Pinot Noir, coffee, chai", null]
        ]],
        ["Kitchen Supplies", [
          ["", "instant-read meat thermometer", null],
          ["", "roasting pan with a rack, foil, pastry brush", null],
          [`${p.dishes}`, pl(p.dishes, "baking dish (9×13-inch)", "baking dishes (9×13-inch)"), null],
          [`${p.pies}`, pl(p.pies, "square cake pan (9-inch)", "square cake pans (9-inch)"), null],
          ["", "plastic wrap and parchment paper", null]
        ]]
      ];
    }
  };

  // sizes for a ham dinner: about ¾ lb of bone-in ham per guest, warmed at 325°F
  function hamPlan(guests) {
    const g = Math.min(20, Math.max(1, guests | 0)), f = g / 8;
    const w = Math.min(18, Math.max(5, Math.round(g * 0.75)));
    const perLb = w <= 8 ? 20 : w >= 14 ? 15 : 20 - (w - 8) * 5 / 6;   // smaller hams take longer per pound
    const roast = Math.round(w * perLb / 5) * 5;
    return { g, f, w, wBase: 9, icon: "🍖", meat: "ham", verb: "bakes", bigNote: "", roast, roastText: hm(roast), rest: 25,
      thawDays: Math.max(1, Math.ceil(w * 5 / 24)), pies: Math.max(1, Math.ceil(g / 9)), dishes: Math.max(1, Math.ceil(f - 0.25)) };
  }

  const DONENESS = [["rare", "Rare", 115, "120–125°F", 0.9], ["mediumrare", "Med-rare", 120, "130–135°F", 1], ["medium", "Medium", 130, "140–145°F", 1.12], ["mediumwell", "Med-well", 140, "150°F", 1.25]];
  const gfNote = p => p.gf ? "Gluten-free: check that it's labelled gluten-free." : "";
  const primerib = {
    id: "primerib",
    tab: "traditional",
    name: "Prime Rib Roast Beef Dinner",
    icon: "🥩",
    blurb: "Garlic-herb prime rib with red wine jus, Yorkshire puddings, crispy potatoes, creamed spinach and chocolate pots de crème.",
    options: { doneness: true, gf: true },
    menu: [
      ["Appetizer", ["Shrimp Cocktail with Zesty Horseradish Sauce"]],
      ["Main", ["Garlic-Herb Crusted Prime Rib", "Red Wine Pan Jus", "Creamy Horseradish Sauce"]],
      ["Sides", ["Yorkshire Puddings", "Crispy Rosemary Roast Potatoes", "Steakhouse Creamed Spinach"]],
      ["Dessert", ["Chocolate Pots de Crème"]]
    ],
    drinks: [
      ["With dinner", "A bold red: Cabernet Sauvignon, Malbec or Syrah stands up beautifully to rich prime rib."],
      ["Non-alcoholic", "Pomegranate-Rosemary Sparkler (recipe included)."],
      ["With dessert", "Espresso or strong coffee, or a small glass of port."]
    ],
    recipes: [
      {
        id: "shrimp", course: "Appetizer", name: "Shrimp Cocktail with Zesty Horseradish Sauce",
        prep: "15 min", cook: "none", yieldText: f => servings(f), note: (f, p) => p.gf ? "Gluten-free: check the ketchup, horseradish and hot sauce labels." : "",
        ing: [
          { q: 1, u: "lb", t: "cooked jumbo shrimp, peeled with tails on (thawed if frozen)" },
          { q: 0.75, u: "cup", t: "ketchup" },
          { q: 2, u: "tbsp", t: "prepared horseradish" },
          { q: 1, u: "tbsp", t: "fresh lemon juice" },
          { q: 0.5, u: "tsp", t: "hot sauce (optional)" },
          { q: 0.25, u: "tsp", t: "black pepper" },
          { q: 1, u: "", t: ["lemon, cut into wedges", "lemons, cut into wedges"] }
        ],
        steps: [
          "Stir together the ketchup, horseradish, lemon juice, hot sauce and pepper. Chill until serving.",
          "Pat the shrimp dry and keep them cold.",
          "To serve, spoon the sauce into a small bowl and arrange the shrimp around it over crushed ice or lettuce leaves, with lemon wedges."
        ],
        tip: "The sauce is even better made the day before. Keep the shrimp on ice so they stay cold and firm."
      },
      {
        id: "rib", course: "Main", name: "Garlic-Herb Crusted Prime Rib",
        prep: "20 min, plus seasoning the day before", cook: p => p.roastText, rest: p => p.rest + " min", yieldText: (f, p) => `${p.ribs} ribs, about ${fmtNum(p.w)} lb`,
        note: (f, p) => `Your doneness: ${p.doneLabel}. Pull the roast out at ${p.pull}°F. It rises to about ${p.final} while it rests.` + (p.roasts > 1 ? ` For this many guests, roast 2 roasts side by side (about ${fmtNum(p.w / 2)} lb each) and check each one.` : ""),
        ing: [
          { q: null, u: "", s: "n", t: p => p.roasts > 1 ? `2 bone-in standing rib roasts (${p.ribs} ribs in total, about ${fmtNum(p.w)} lb)` : `1 bone-in standing rib roast, ${p.ribs} ribs (about ${fmtNum(p.w)} lb)` },
          { q: 2, u: "tbsp", s: "w", t: "kosher salt (about ¾ tsp per pound)" },
          { q: 2, u: "tsp", s: "w", t: "coarsely ground black pepper" },
          { head: "Garlic-herb paste" },
          { q: 6, u: "", s: "w", t: ["garlic clove, finely minced", "garlic cloves, finely minced"] },
          { q: 2, u: "tbsp", s: "w", t: "fresh rosemary, finely chopped" },
          { q: 1, u: "tbsp", s: "w", t: "fresh thyme leaves" },
          { q: 1, u: "tbsp", s: "w", t: "Dijon mustard" },
          { q: 3, u: "tbsp", s: "w", t: "olive oil" }
        ],
        steps: [
          p => `If your roast is frozen, thaw it in the refrigerator, allowing about 5 hours per pound (about ${p.thawDays} ${p.thawDays === 1 ? "day" : "days"}).`,
          "The day before: pat the roast dry, rub it all over with the salt and pepper, and set it on a rack in the refrigerator, uncovered, overnight. This seasons the meat deeply and dries the surface for a beautiful crust.",
          "Take the roast out of the refrigerator 2 hours before it goes in the oven.",
          "Heat the oven to 450°F (230°C) with a rack in the lower third.",
          "Stir together the garlic, rosemary, thyme, Dijon and olive oil, and spread the paste over the top and sides of the roast.",
          "Set the roast bone-side down in a roasting pan. The bones act as a natural rack.",
          "Roast for 15 minutes at 450°F to start the crust, then turn the oven down to 325°F (165°C) without opening the door.",
          p => `Keep roasting until a thermometer in the very centre reads ${p.pull}°F for ${p.doneLabel.toLowerCase()}, about ${p.roastText} in total. Start checking 45 minutes early. Every roast and oven is a little different, so trust the thermometer, not the clock.`,
          p => `Move the roast to a carving board, tent loosely with foil and rest ${p.rest} minutes. The temperature keeps climbing to about ${p.final}.`,
          "To carve, slice along the bones to remove them in one piece, then cut the meat into thick slices across the grain."
        ],
        tip: "Doneness guide (pull temperature → after resting): Rare 115°F → 120–125°F · Medium-rare 120°F → 130–135°F · Medium 130°F → 140–145°F · Medium-well 140°F → 150°F."
      },
      {
        id: "jus", course: "Main", name: "Red Wine Pan Jus",
        prep: "5 min", cook: "15 min", yieldText: f => `about ${fmtCups(2 * f)}`, note: (f, p) => p.gf ? "Gluten-free: this jus is thickened with cornstarch. Check the beef stock label." : "",
        ing: [
          { q: null, u: "", s: "n", t: "Pan drippings from the roast" },
          { q: 1, u: "", t: ["shallot, finely minced", "shallots, finely minced"] },
          { q: 1, u: "cup", t: "dry red wine" },
          { q: 2, u: "cup", t: "low-sodium beef stock" },
          { q: 2, u: "", t: ["sprig fresh thyme", "sprigs fresh thyme"] },
          { q: 1, u: "tbsp", t: "cornstarch mixed with 2 tbsp cold water (optional, for a thicker jus)" },
          { q: 1, u: "tbsp", t: "cold unsalted butter" },
          { q: null, u: "", s: "n", t: "Kosher salt and black pepper, to taste" }
        ],
        steps: [
          "While the roast rests, pour off all but about 2 tablespoons of fat from the roasting pan.",
          "Set the pan over medium heat (across two burners if needed). Add the shallot and cook 2 minutes.",
          "Pour in the wine and scrape up all the browned bits. Simmer until reduced by half, about 5 minutes.",
          "Add the stock and thyme and simmer 8–10 minutes, until reduced by about a third.",
          "For a thicker jus, stir in the cornstarch mixture and simmer 1 minute.",
          "Off the heat, swirl in the butter. Season, strain into a warm jug and serve alongside."
        ],
        tip: "Add any juices from the carving board to the jus. They're full of flavour."
      },
      {
        id: "horseradish", course: "Main", name: "Creamy Horseradish Sauce",
        prep: "5 min", cook: "none", yieldText: f => `about ${fmtCups(1.25 * f)}`, note: (f, p) => p.gf ? "Gluten-free: check the horseradish label." : "",
        ing: [
          { q: 1, u: "cup", t: "sour cream" },
          { q: 0.25, u: "cup", t: "prepared horseradish, drained" },
          { q: 1, u: "tsp", t: "Dijon mustard" },
          { q: 1, u: "tsp", t: "fresh lemon juice" },
          { q: 1, u: "tbsp", t: "fresh chives, finely chopped" },
          { q: 0.25, u: "tsp", t: "kosher salt" }
        ],
        steps: ["Stir everything together.", "Cover and chill at least 1 hour so the flavours blend."],
        tip: "Make it the day before. Add more horseradish if your family likes a kick."
      },
      {
        id: "yorkshire", course: "Sides", name: "Yorkshire Puddings",
        prep: "10 min, plus 30 min resting", cook: "20–22 min", yieldText: (f, p) => `about ${Math.round(12 * f)} puddings`,
        note: (f, p) => (p.tins > 1 ? `You'll need ${p.tins} twelve-cup muffin tins. ` : "") + (p.gf ? "Gluten-free: made with a 1:1 gluten-free flour blend. They rise a little less but are just as delicious." : ""),
        ing: [
          { q: 4, u: "", up: true, t: ["large egg, at room temperature", "large eggs, at room temperature"] },
          { q: 1, u: "cup", t: "whole milk, at room temperature" },
          { q: 1, u: "cup", t: p => p.gf ? "gluten-free 1:1 flour blend (with xanthan gum)" : "all-purpose flour" },
          { q: 0.5, u: "tsp", t: "kosher salt" },
          { q: 0.25, u: "cup", t: "beef drippings from the roast, or vegetable oil" }
        ],
        steps: [
          "Whisk the eggs and milk until frothy. Whisk in the flour and salt until completely smooth.",
          "Let the batter rest at room temperature for at least 30 minutes (up to 2 hours).",
          "With the oven at 425°F (220°C), put 1 teaspoon of drippings or oil into each muffin cup and heat the tin in the oven for 10 minutes, until smoking hot.",
          "Working quickly, pour the batter into the hot cups, about half full.",
          "Bake 20–22 minutes, until tall, puffed and deep golden. Don't open the oven door for the first 15 minutes, or they'll sink.",
          "Serve right away."
        ],
        tip: "The secret is a smoking-hot tin and a batter at room temperature. Bake them while the roast rests."
      },
      {
        id: "potatoes", course: "Sides", name: "Crispy Rosemary Roast Potatoes",
        prep: "15 min", cook: "about 1 hour 30 min", yieldText: f => servings(f),
        ing: [
          { q: 4, u: "lb", t: "Yukon Gold or russet potatoes, peeled and cut into 2-inch chunks" },
          { q: 1, u: "tbsp", t: "kosher salt, for the cooking water" },
          { q: 0.33, u: "cup", t: "olive oil or beef drippings" },
          { q: 4, u: "", t: ["garlic clove, smashed", "garlic cloves, smashed"] },
          { q: 2, u: "tbsp", t: "fresh rosemary, chopped" },
          { q: 1, u: "tsp", t: "flaky or kosher salt" },
          { q: 0.5, u: "tsp", t: "black pepper" }
        ],
        steps: [
          "Put the potatoes in a pot of cold salted water, bring to a boil and cook 8–10 minutes, until the edges are soft.",
          "Drain well, then shake them in the colander to rough up the edges. Those rough edges become the crispy bits.",
          "Toss with the oil and garlic on a large rimmed baking sheet.",
          "Roast on the lower rack at 325°F for 60 minutes alongside the beef, turning once.",
          "When the roast comes out, raise the oven to 425°F and move the potatoes to the top rack for 25–30 minutes, until crisp and golden.",
          "Toss with the rosemary, salt and pepper and serve hot."
        ],
        tip: "Roasting on their own? 425°F for 45–50 minutes, turning once."
      },
      {
        id: "spinach", course: "Sides", name: "Steakhouse Creamed Spinach",
        prep: "10 min", cook: "12 min", yieldText: f => servings(f), note: (f, p) => p.gf ? "Gluten-free: this recipe has no flour." : "",
        ing: [
          { q: 3, u: "", t: ["package (10 oz) frozen chopped spinach, thawed and squeezed very dry", "packages (10 oz each) frozen chopped spinach, thawed and squeezed very dry"] },
          { q: 2, u: "tbsp", t: "unsalted butter" },
          { q: 1, u: "", t: ["shallot, finely minced", "shallots, finely minced"] },
          { q: 2, u: "", t: ["garlic clove, minced", "garlic cloves, minced"] },
          { q: 1.5, u: "cup", t: "heavy cream" },
          { q: 4, u: "oz", t: "cream cheese, cubed" },
          { q: 0.5, u: "cup", t: "Parmesan, finely grated" },
          { q: 0.25, u: "tsp", t: "ground nutmeg" },
          { q: 0.5, u: "tsp", t: "kosher salt" },
          { q: 0.25, u: "tsp", t: "black pepper" }
        ],
        steps: [
          "Melt the butter in a wide pan over medium heat. Cook the shallot 2 minutes, then the garlic 30 seconds.",
          "Pour in the cream and simmer 4–5 minutes, until slightly reduced.",
          "Whisk in the cream cheese and Parmesan until smooth.",
          "Stir in the spinach, nutmeg, salt and pepper and heat through, 3–4 minutes."
        ],
        tip: "Squeeze the spinach really dry in a clean tea towel. You can make it a day ahead and reheat gently with a splash of cream."
      },
      {
        id: "pots", course: "Dessert", name: "Chocolate Pots de Crème",
        prep: "20 min", cook: "10 min", rest: "chill 4 hours", yieldText: f => `${Math.round(8 * f)} small pots`, note: (f, p) => p.gf ? "Gluten-free: naturally gluten-free. Check the chocolate label." : "",
        ing: [
          { q: 6, u: "oz", t: "bittersweet chocolate (60–70%), finely chopped" },
          { q: 1.5, u: "cup", t: "heavy cream" },
          { q: 0.5, u: "cup", t: "whole milk" },
          { q: 5, u: "", up: true, t: ["large egg yolk", "large egg yolks"] },
          { q: 0.25, u: "cup", t: "granulated sugar" },
          { q: null, u: "", s: "n", t: "Pinch of kosher salt" },
          { q: 1, u: "tsp", t: "vanilla extract" },
          { head: "To serve" },
          { q: 0.5, u: "cup", t: "cold heavy cream, whipped with 1 tbsp sugar" },
          { q: null, u: "", s: "n", t: "Fresh raspberries or chocolate shavings" }
        ],
        steps: [
          "Put the chopped chocolate in a heatproof bowl and set a fine sieve over it.",
          "Heat the cream and milk in a saucepan until steaming, with small bubbles at the edges.",
          "Whisk the yolks, sugar and salt together. Slowly whisk in half the hot cream, then pour it all back into the pan.",
          "Stir constantly over low heat for 3–5 minutes, until the custard thickens enough to coat a spoon (170–175°F). Don't let it boil.",
          "Pour through the sieve onto the chocolate. Wait 2 minutes, then whisk until smooth and glossy. Stir in the vanilla.",
          "Divide among small cups or ramekins, cover and chill at least 4 hours or overnight.",
          "Top with whipped cream and raspberries or chocolate shavings just before serving."
        ],
        tip: "Make these the day before. No oven needed, and they're naturally gluten-free."
      },
      {
        id: "sparkler", course: "Drinks", name: "Pomegranate-Rosemary Sparkler",
        prep: "5 min", cook: "none", yieldText: f => `about ${Math.round(7 * f)} cups`,
        ing: [
          { q: 3, u: "cup", t: "pomegranate juice, chilled" },
          { q: 0.25, u: "cup", t: "fresh lime juice" },
          { q: 2, u: "tbsp", t: "honey or maple syrup (optional)" },
          { q: 4, u: "cup", t: "sparkling water, chilled" },
          { q: null, u: "", s: "n", t: "Rosemary sprigs and pomegranate seeds, to garnish" }
        ],
        steps: [
          "Stir the pomegranate juice, lime juice and honey together in a pitcher until the honey dissolves.",
          "Just before serving, add the sparkling water.",
          "Pour over ice and garnish each glass with a rosemary sprig and a few pomegranate seeds."
        ],
        tip: "For adult guests, top glasses with sparkling wine instead of water."
      }
    ],

    timeline(p) {
      const out = [], R = p.roast, tOut = -(p.rest + 10), tIn = tOut - R;
      const add = (m, icon, text, alarm = true, main = false) => out.push({ m, icon, text, alarm, main });
      add(tIn - 120, "🥩", "Take the roast out of the fridge (2 hours to warm up)");
      add(tIn - 20, "🔥", "Heat the oven to 450°F and spread on the garlic-herb paste");
      add(tIn, "🥩", `Prime rib into the oven at 450°F (${fmtNum(p.w)} lb, about ${p.roastText} in total)`, true, true);
      add(tIn + 15, "🌡️", "Turn the oven down to 325°F (don't open the door)");
      add(-120, "🥚", "Make the Yorkshire pudding batter and let it rest");
      add(tOut - 80, "🥔", "Parboil the potatoes (8–10 minutes)");
      add(tOut - 60, "🥔", "Potatoes into the oven on the lower rack");
      add(tOut - 45, "🌡️", `Start checking the roast: pull it at ${p.pull}°F for ${p.doneLabel.toLowerCase()}`);
      add(-75, "🥤", "Mix the sparkler juices and chill");
      add(-60, "🍤", "Set out the shrimp cocktail and sparklers for arriving guests");
      add(tOut, "🥩", "Roast out to rest under foil. Oven up to 425°F. Potatoes to the top rack");
      add(tOut + 5, "🧁", "Muffin tin with drippings into the oven to heat (10 minutes)");
      add(tOut + 15, "🧁", "Pour in the Yorkshire batter. Don't open the door for 15 minutes");
      add(-25, "🍷", "Make the red wine jus from the pan drippings");
      add(-18, "🥬", "Make the creamed spinach");
      add(-10, "🔪", "Carve the prime rib");
      add(tOut + 36, "🧁", "Yorkshire puddings and potatoes out of the oven");
      add(0, "🍽️", "Dinner is served!");
      add(45, "🍫", "Top the pots de crème with cream and serve");
      return out.sort((a, b) => a.m - b.m);
    },
    ahead(p) {
      return [
        [p.thawDays + 1, 9, "🧊", `If your roast is frozen, move it to the fridge to thaw today (${fmtNum(p.w)} lb needs about ${p.thawDays} ${p.thawDays === 1 ? "day" : "days"})`],
        [1, 10, "📋", "Prep day: salt the roast and leave it uncovered in the fridge overnight, make the horseradish sauce and cocktail sauce, and make the chocolate pots de crème"]
      ];
    },

    shop(f, p) {
      const wf = p.w / 8.5, up = (x, step = 1) => Math.ceil(x / step - 1e-9) * step, n = x => Math.max(1, Math.ceil(x - 1e-9));
      const pl = (k, one, many) => k > 1 ? many : one;
      const cloves = 6 * wf + 4 * f + 2 * f, garlic = n(cloves / 10), shallots = n(2 * f);
      const rose = n((2 * wf + 2 * f + 2) / 6), lemons = n(1.3 * f), limes = n(2 * f), pot = up(4 * f, 0.5), rasp = n(f / 2), pom = n(f / 2);
      const shrimp = up(f, 0.5), spin = Math.ceil(3 * f - 1e-9);
      const sticks = n(3 * f / 8), creamCups = 3.5 * f, cream = n(creamCups / 2), milkCups = 1.5 * f, milk = n(milkCups / 4);
      const sour = n(f / 2), cc = n(f / 2), parm = n(f / 2.5), eggs = Math.ceil(4 * f - 1e-9) + Math.ceil(5 * f - 1e-9);
      const stock = n(2 * f / 4), wine = n(f / 3), horse = n(6 * f / 16), flourC = up(f, 0.5), choc = n(6 * f / 3.5);
      const pj = n(3 * f / 4), fizz = n(f);
      const list = [
        ["Produce", [
          [`${garlic}`, pl(garlic, "head garlic", "heads garlic"), garlic * 1],
          [`${shallots}`, "shallots", shallots * 0.75],
          [`${rose}`, pl(rose, "bunch fresh rosemary", "bunches fresh rosemary"), rose * 3],
          ["1", "bunch fresh thyme", 3],
          ["1", "bunch fresh chives", 3],
          [`${fmtNum(pot)} lb`, "Yukon Gold or russet potatoes", pot * 1.1],
          [`${lemons}`, pl(lemons, "lemon", "lemons"), lemons * 1],
          [`${limes}`, "limes", limes * 0.6],
          [`${rasp} × 170 g`, pl(rasp, "container raspberries (optional)", "containers raspberries (optional)"), rasp * 5],
          [`${pom}`, pl(pom, "pomegranate, for garnish (optional)", "pomegranates, for garnish (optional)"), pom * 3]
        ]],
        ["Meat & Seafood", [
          [`${fmtNum(p.w)} lb`, p.roasts > 1 ? `bone-in prime rib, ${p.ribs} ribs in total (ask for 2 roasts)` : `bone-in prime rib (standing rib roast), ${p.ribs} ribs`, p.w * 22.99],
          [`${fmtNum(shrimp)} lb`, "cooked jumbo shrimp, peeled, tails on", shrimp * 23]
        ]],
        ["Frozen", [[`${spin} × 10 oz`, pl(spin, "package frozen chopped spinach", "packages frozen chopped spinach"), spin * 3]]],
        ["Dairy & Refrigerated", [
          [cupsT(up(creamCups, 0.5)), `heavy cream (${cream} × 500 ml)`, cream * 4.5],
          [cupsT(up(milkCups, 0.5)), `whole milk (${milk} × 1 L)`, milk * 2.8],
          [`${eggs}`, "large eggs", eggs * 0.45],
          [`${sour} × 500 ml`, pl(sour, "tub sour cream", "tubs sour cream"), sour * 3.5],
          [`${cc} × 8 oz`, "cream cheese", cc * 4.5],
          [`${parm} × 150 g`, pl(parm, "wedge Parmesan", "wedges Parmesan"), parm * 6],
          [`${sticks}`, pl(sticks, "stick unsalted butter", "sticks unsalted butter"), sticks * 1.75]
        ]],
        ["Pantry & Baking", [
          [`${stock} × 1 L`, "low-sodium beef stock", stock * 3.5],
          [`${wine}`, pl(wine, "bottle dry red wine (for the jus)", "bottles dry red wine (for the jus)"), wine * 16],
          [`${horse}`, pl(horse, "jar prepared horseradish (250 ml)", "jars prepared horseradish (250 ml)"), horse * 4],
          [cupsT(flourC), p.gf ? "gluten-free 1:1 flour blend (with xanthan gum)" : "all-purpose flour", flourC * (p.gf ? 1 : 0.25)],
          [`${choc} × 100 g`, pl(choc, "bar bittersweet chocolate (60–70%)", "bars bittersweet chocolate (60–70%)"), choc * 4],
          ["", "ketchup", null],
          ["", "Dijon mustard", null],
          ["", "olive oil", null],
          ["", "cornstarch", null],
          ["", "granulated sugar and vanilla extract", null],
          ["", "honey or maple syrup, hot sauce (optional)", null]
        ]],
        ["Spices", [["", "kosher salt, coarse black pepper, ground nutmeg", null]]],
        ["Drinks", [
          [`${pj} × 946 ml`, pl(pj, "bottle pomegranate juice", "bottles pomegranate juice"), pj * 6],
          [`${fizz} × 1 L`, "sparkling water", fizz * 1.75],
          ["", "optional: Cabernet Sauvignon, Malbec or Syrah, port, coffee", null]
        ]],
        ["Kitchen Supplies", [
          ["", "instant-read meat thermometer (essential for prime rib)", null],
          ["", "roasting pan, large rimmed baking sheet, foil", null],
          [`${p.tins}`, pl(p.tins, "12-cup muffin tin", "12-cup muffin tins"), null],
          [`${Math.round(8 * f)}`, "small cups or ramekins (for the pots de crème)", null],
          ["", "fine sieve", null]
        ]]
      ];
      if (p.gf) list[4][1].push(["", "gluten-free check: beef stock, horseradish, ketchup, hot sauce and chocolate labels", null]);
      return list;
    }
  };

  // sizes for prime rib: about 1 rib for every 2 guests (≈2.1 lb per rib); time depends on size and doneness
  function primeRibPlan(guests, c = {}) {
    const g = Math.min(20, Math.max(1, guests | 0)), f = g / 8;
    const ribs = Math.max(2, Math.ceil(g / 2)), roasts = ribs > 7 ? 2 : 1, w = Math.round(ribs * 2.1 * 2) / 2;
    const d = DONENESS.find(x => x[0] === c.doneness) || DONENESS[1];
    const per = w / roasts, pts = [[4, 110], [6, 135], [8, 155], [10, 175], [12, 200], [16, 245], [20, 290]];   // lb → minutes for medium-rare (450°F sear, then 325°F)
    let base = pts[pts.length - 1][1];
    if (per <= pts[0][0]) base = pts[0][1];
    else for (let i = 1; i < pts.length; i++) if (per <= pts[i][0]) { const [a, ma] = pts[i - 1], [b, mb] = pts[i]; base = ma + (mb - ma) * (per - a) / (b - a); break; }
    const roast = Math.round(base * d[4] * (roasts > 1 ? 1.1 : 1) / 5) * 5;
    return { g, f, w, wBase: 8.5, icon: "🥩", meat: `prime rib (${ribs} ribs${roasts > 1 ? ", 2 roasts" : ""})`, verb: "roasts",
      bigNote: `Pull it out at ${d[2]}°F for ${d[1].toLowerCase().replace("med-", "medium-")}. It rises to about ${d[3]} as it rests.`,
      roast, roastText: hm(roast), rest: 30, thawDays: Math.max(1, Math.ceil(w * 5 / 24)), pies: 1, dishes: 1,
      ribs, roasts, pull: d[2], final: d[3], doneLabel: d[1].replace("Med-", "Medium-"), gf: !!c.gf, tins: Math.max(1, Math.ceil(f - 0.1)) };
  }

  const porkcrown = {
    id: "porkcrown",
    tab: "elegant",
    name: "Crown Roast of Pork",
    icon: "👑",
    blurb: "Garlic-herb crown roast filled with wild rice stuffing, cider gravy, truffle mash and brioche bread pudding.",
    menu: [
      ["Signature drinks", ["Spiced Bourbon Apple Cider", "Cranberry-Ginger Fizz (alcohol-free)"]],
      ["Appetizers", ["Baked Brie in Puff Pastry with Fig & Walnuts (warm)", "Prosciutto-Wrapped Pears with Arugula & Balsamic (cold)"]],
      ["Main", ["Garlic-Herb Crown Roast of Pork", "Apple Cider & Thyme Pan Gravy"]],
      ["In the crown", ["Wild Rice, Pecan & Cranberry Stuffing"]],
      ["Sides", ["Truffle & Parmesan Mashed Potatoes", "Balsamic-Maple Roasted Brussels Sprouts"]],
      ["Dessert", ["Brioche Bread Pudding with Bourbon Caramel"]]
    ],
    drinks: [
      ["With the appetizers", "Champagne, Crémant or a dry sparkling wine. The bubbles cut through rich brie and salty prosciutto."],
      ["With the crown roast", "Pinot Noir, Beaujolais Cru or a lightly off-dry Chenin Blanc (Vouvray). Bright fruit flatters pork and cider gravy."],
      ["Alcohol-free", "Cranberry-Ginger Fizz (recipe included) or sparkling apple cider."],
      ["With dessert", "A small pour of bourbon or tawny port, or coffee."]
    ],
    recipes: [
      {
        id: "bourboncider", course: "Drinks", name: "Spiced Bourbon Apple Cider",
        prep: "5 min", cook: "15 min", yieldText: f => `${Math.round(8 * f)} drinks`,
        ing: [
          { q: 6, u: "cup", t: "apple cider or unfiltered apple juice" },
          { q: 2, u: "", t: ["cinnamon stick, plus extra to garnish", "cinnamon sticks, plus extra to garnish"] },
          { q: 4, u: "", t: ["whole clove", "whole cloves"] },
          { q: 2, u: "", t: ["star anise (optional)", "star anise (optional)"] },
          { q: 1, u: "", t: ["orange, sliced", "oranges, sliced"] },
          { q: 2, u: "tbsp", t: "maple syrup" },
          { q: 1.5, u: "cup", t: "bourbon (1½ oz per drink)" }
        ],
        steps: [
          "Warm the cider, spices, orange and maple syrup over low heat for 15 minutes. Don't let it boil.",
          "Keep warm on the lowest setting.",
          "Pour 1½ oz of bourbon into each mug and top with the hot cider. Garnish with a cinnamon stick."
        ],
        tip: "Add the bourbon by the mug rather than to the pot, so guests can choose."
      },
      {
        id: "fizz", course: "Drinks", name: "Cranberry-Ginger Fizz (alcohol-free)",
        prep: "5 min", cook: "none", yieldText: f => `about ${Math.round(7 * f)} cups`,
        ing: [
          { q: 3, u: "cup", t: "cranberry juice, chilled" },
          { q: 0.25, u: "cup", t: "fresh lime juice" },
          { q: 4, u: "cup", t: "non-alcoholic ginger beer, chilled" },
          { q: null, u: "", s: "n", t: "Lime wheels, rosemary sprigs and a few cranberries, to garnish" }
        ],
        steps: ["Stir the cranberry and lime juice together in a pitcher.", "Just before serving, add the ginger beer.", "Pour over ice and garnish with lime and rosemary."],
        tip: "A rosemary sprig in each glass makes it look like a proper cocktail."
      },
      {
        id: "brie", course: "Appetizer", name: "Baked Brie in Puff Pastry with Fig & Walnuts",
        prep: "15 min", cook: "40–45 min at 325°F (or 20–25 min at 400°F)", rest: "15 min", yieldText: f => servings(f),
        ing: [
          { q: 1, u: "", up: true, t: ["wheel of brie (about 8 oz)", "wheels of brie (about 8 oz each)"] },
          { q: 1, u: "", up: true, t: ["sheet frozen puff pastry, thawed in the fridge", "sheets frozen puff pastry, thawed in the fridge"] },
          { q: 0.25, u: "cup", t: "fig jam (or cranberry sauce)" },
          { q: 0.25, u: "cup", t: "walnuts, toasted and chopped" },
          { q: 1, u: "tsp", t: "fresh thyme leaves" },
          { q: 1, u: "", s: "n", t: ["large egg, beaten (for brushing)", "large eggs, beaten (for brushing)"] },
          { q: 1, u: "", up: true, t: ["baguette, sliced, or crackers for serving", "baguettes, sliced, or crackers for serving"] }
        ],
        steps: [
          "Line a baking sheet with parchment. Roll the pastry out slightly and set the brie in the centre.",
          "Spread the jam over the top of the brie and scatter on the walnuts and thyme.",
          "Fold the pastry up over the cheese, pleating it neatly, and trim any thick excess. Turn it seam-side down.",
          "Brush all over with beaten egg and cut two small vents on top.",
          "Bake at 325°F alongside the roast for 40–45 minutes, until deep golden. (On its own: 400°F for 20–25 minutes.)",
          "Rest 15 minutes before cutting, so the cheese is molten but not runny. Serve with baguette slices or crackers."
        ],
        tip: "Assemble it in the morning and keep it chilled. Cold pastry puffs better in the oven."
      },
      {
        id: "pears", course: "Appetizer", name: "Prosciutto-Wrapped Pears with Arugula & Balsamic",
        prep: "20 min", cook: "none", yieldText: f => `${Math.round(24 * f)} pieces`,
        ing: [
          { q: 2, u: "", t: ["ripe but firm pear (Bosc or Anjou)", "ripe but firm pears (Bosc or Anjou)"] },
          { q: 1, u: "tbsp", t: "fresh lemon juice" },
          { q: 6, u: "oz", t: "thinly sliced prosciutto (about 12 slices), halved lengthwise" },
          { q: 1, u: "cup", t: "baby arugula" },
          { q: 2, u: "tbsp", t: "balsamic glaze" },
          { q: null, u: "", s: "n", t: "Freshly cracked black pepper" }
        ],
        steps: [
          "Cut each pear into 12 slim wedges, remove the core, and toss with the lemon juice so they don't brown.",
          "Lay a few arugula leaves on a pear wedge and wrap it snugly in a half-slice of prosciutto.",
          "Arrange on a platter, drizzle with balsamic glaze and finish with black pepper."
        ],
        tip: "Make them up to 2 hours ahead and keep them covered in the fridge. Drizzle the glaze just before serving."
      },
      {
        id: "crown", course: "Main", name: "Garlic-Herb Crown Roast of Pork",
        prep: "25 min", cook: p => p.roastText, rest: p => p.rest + " min", yieldText: (f, p) => `${p.ribs} ribs (about ${fmtNum(p.w)} lb)`,
        note: (f, p) => `Pull the roast at 140°F. It rises to a juicy, safe 145°F while it rests.` + (p.g < 10 ? " A crown needs at least 10 ribs to hold its shape, so you'll have delicious leftovers." : ""),
        ing: [
          { q: null, u: "", s: "n", t: p => `1 crown roast of pork, ${p.ribs} ribs (about ${fmtNum(p.w)} lb), frenched and tied by your butcher` },
          { head: "Garlic-herb crust" },
          { q: 6, u: "", s: "w", t: ["garlic clove, finely minced", "garlic cloves, finely minced"] },
          { q: 2, u: "tbsp", s: "w", t: "fresh rosemary, finely chopped" },
          { q: 1, u: "tbsp", s: "w", t: "fresh thyme leaves" },
          { q: 1, u: "tbsp", s: "w", t: "fresh sage, finely chopped" },
          { q: 2, u: "tbsp", s: "w", t: "Dijon mustard" },
          { q: 3, u: "tbsp", s: "w", t: "olive oil" },
          { q: 1, u: "tbsp", s: "w", t: "kosher salt" },
          { q: 1.5, u: "tsp", s: "w", t: "black pepper" },
          { head: "For the pan" },
          { q: 1, u: "", s: "n", t: "yellow onion, quartered" },
          { q: 1, u: "cup", s: "n", t: "apple cider" }
        ],
        steps: [
          p => `Order ahead: ask your butcher for a ${p.ribs}-rib crown roast, frenched (bones scraped clean) and tied into a crown. If your roast is frozen, thaw it in the fridge for about ${p.thawDays} ${p.thawDays === 1 ? "day" : "days"}.`,
          "Take the roast out of the refrigerator 1 hour before roasting and pat it dry.",
          "Heat the oven to 450°F (230°C) with a rack in the lower third.",
          "Stir together the garlic, herbs, Dijon, olive oil, salt and pepper. Rub it all over the meat, inside the crown and out.",
          "Stand the roast in a roasting pan. Scrunch a ball of foil into the centre to hold the crown's shape, and wrap each bone tip in a small piece of foil so it doesn't burn.",
          "Scatter the onion around it and pour the cider into the pan.",
          "Roast 15 minutes at 450°F, then turn the oven down to 325°F (165°C) without opening the door.",
          p => `Roast until a thermometer in the thickest part of the meat, not touching bone, reads 140°F (60°C), about ${p.roastText} in total. Start checking 30 minutes early.`,
          p => `Move to a platter, tent with foil and rest ${p.rest} minutes. It will rise to 145°F, juicy with a hint of blush.`,
          "Remove the foil ball and bone caps. Fill the centre with the hot wild rice stuffing and decorate the bones with rosemary or paper frills.",
          "Carve at the table by slicing down between the bones into thick chops."
        ],
        tip: "Pork is safe and juiciest at 145°F after resting, which is why you pull it at 140°F. Never let it go past 150°F. Bake the stuffing separately and spoon it in at the end, so the roast cooks evenly and the stuffing stays safe."
      },
      {
        id: "wildrice", course: "In the crown", name: "Wild Rice, Pecan & Cranberry Stuffing",
        prep: "20 min", cook: "about 1 hour 20 min", yieldText: f => servings(f),
        ing: [
          { q: 1.5, u: "cup", t: "wild rice blend, rinsed" },
          { q: 4, u: "cup", t: "low-sodium chicken stock, plus ½ cup more for baking" },
          { q: 3, u: "tbsp", t: "unsalted butter" },
          { q: 1, u: "", t: ["yellow onion, diced", "yellow onions, diced"] },
          { q: 2, u: "", t: ["celery rib, diced", "celery ribs, diced"] },
          { q: 1, u: "", t: ["crisp apple (such as Honeycrisp), diced", "crisp apples (such as Honeycrisp), diced"] },
          { q: 2, u: "", t: ["garlic clove, minced", "garlic cloves, minced"] },
          { q: 1, u: "tbsp", t: "fresh sage, chopped" },
          { q: 2, u: "tsp", t: "fresh thyme leaves" },
          { q: 0.75, u: "cup", t: "dried cranberries" },
          { q: 0.75, u: "cup", t: "pecans, toasted and chopped" },
          { q: 0.25, u: "cup", t: "fresh flat-leaf parsley, chopped" },
          { q: 0.5, u: "tsp", t: "kosher salt" },
          { q: 0.25, u: "tsp", t: "black pepper" }
        ],
        steps: [
          "Simmer the wild rice in the stock, covered, for 45–50 minutes until tender and some grains have split. Drain off any extra liquid.",
          "Meanwhile, melt the butter in a large skillet and cook the onion and celery for 8 minutes until soft.",
          "Add the apple, garlic, sage and thyme and cook 2 minutes more.",
          "Fold together the rice, vegetables, cranberries, pecans, parsley, salt and pepper.",
          "Spoon into a buttered baking dish, drizzle with the extra stock, cover with foil and keep warm in the 325°F oven for 30 minutes.",
          "Spoon into the centre of the crown just before serving, with the rest in a bowl alongside."
        ],
        tip: "Cook the wild rice the day before to save time. It's naturally gluten-free if your stock is."
      },
      {
        id: "trufflemash", course: "Sides", name: "Truffle & Parmesan Mashed Potatoes",
        prep: "15 min", cook: "25 min", yieldText: f => servings(f),
        ing: [
          { q: 4, u: "lb", t: "Yukon Gold potatoes, peeled and cut into 2-inch chunks" },
          { q: 1, u: "tbsp", t: "kosher salt, for the cooking water" },
          { q: 0.5, u: "cup", t: "unsalted butter" },
          { q: 1, u: "cup", t: "whole milk" },
          { q: 0.5, u: "cup", t: "heavy cream" },
          { q: 0.75, u: "cup", t: "Parmesan, finely grated" },
          { q: 1.5, u: "tsp", t: "truffle oil, or to taste" },
          { q: null, u: "", s: "n", t: "Kosher salt, white or black pepper, and chopped chives" }
        ],
        steps: [
          "Cover the potatoes with cold water by 1 inch, add the salt, bring to a boil and simmer 20–25 minutes until very tender.",
          "Warm the butter, milk and cream together until the butter melts.",
          "Drain the potatoes, return them to the hot pot for a minute to dry, then mash until smooth.",
          "Stir in the warm milk mixture and the Parmesan.",
          "Off the heat, stir in the truffle oil a little at a time and season. Top with chives."
        ],
        tip: "Truffle oil is powerful and fades with heat, so add it at the very end and taste as you go."
      },
      {
        id: "balsamicsprouts", course: "Sides", name: "Balsamic-Maple Roasted Brussels Sprouts",
        prep: "10 min", cook: "25 min", yieldText: f => servings(f),
        ing: [
          { q: 2, u: "lb", t: "Brussels sprouts, trimmed and halved" },
          { q: 3, u: "tbsp", t: "olive oil" },
          { q: 1, u: "tsp", t: "kosher salt" },
          { q: 0.5, u: "tsp", t: "black pepper" },
          { q: 2, u: "tbsp", t: "balsamic vinegar" },
          { q: 1, u: "tbsp", t: "maple syrup" }
        ],
        steps: [
          "Toss the sprouts with the oil, salt and pepper and spread cut side down on large baking sheets.",
          "Roast at 425°F for 20–25 minutes, until deeply golden.",
          "Whisk the balsamic and maple syrup together, drizzle over the hot sprouts and toss."
        ],
        tip: "They roast while the crown rests. Use two sheets so they brown rather than steam."
      },
      {
        id: "cidergravy", course: "Main", name: "Apple Cider & Thyme Pan Gravy",
        prep: "5 min", cook: "15 min", yieldText: f => `about ${fmtCups(3 * f)}`,
        ing: [
          { q: null, u: "", s: "n", t: "Pan drippings from the roast" },
          { q: 3, u: "tbsp", t: "unsalted butter (or fat from the drippings)" },
          { q: 1, u: "", t: ["shallot, finely minced", "shallots, finely minced"] },
          { q: 0.25, u: "cup", t: "all-purpose flour" },
          { q: 1, u: "cup", t: "apple cider" },
          { q: 2, u: "cup", t: "low-sodium chicken stock" },
          { q: 2, u: "tsp", t: "fresh thyme leaves" },
          { q: 1, u: "tsp", t: "Dijon mustard" },
          { q: 1, u: "tsp", t: "apple cider vinegar" },
          { q: null, u: "", s: "n", t: "Kosher salt and black pepper, to taste" }
        ],
        steps: [
          "Strain the pan juices into a cup and skim off the fat.",
          "Melt the butter in a saucepan over medium heat and cook the shallot 2 minutes.",
          "Whisk in the flour and cook 2 minutes until golden.",
          "Slowly whisk in the cider, then the stock and the skimmed pan juices.",
          "Simmer 8–10 minutes, whisking, until smooth and glossy.",
          "Stir in the thyme, Dijon and vinegar, and season to taste."
        ],
        tip: "The splash of vinegar at the end wakes up the apple flavour."
      },
      {
        id: "breadpudding", course: "Dessert", name: "Brioche Bread Pudding with Bourbon Caramel",
        prep: "20 min, plus 30 min soaking", cook: "45–50 min", yieldText: f => servings(f),
        note: (f, p) => p.dishes > 1 ? `For this many guests, use ${p.dishes} baking dishes (9×13-inch).` : "",
        ing: [
          { q: 1, u: "lb", t: "day-old brioche or challah, cut into 1-inch cubes" },
          { q: 2, u: "tbsp", t: "unsalted butter, for the dish" },
          { q: 5, u: "", up: true, t: ["large egg", "large eggs"] },
          { q: 2, u: "cup", t: "whole milk" },
          { q: 1, u: "cup", t: "heavy cream" },
          { q: 0.75, u: "cup", t: "packed brown sugar" },
          { q: 2, u: "tsp", t: "vanilla extract" },
          { q: 1.5, u: "tsp", t: "ground cinnamon" },
          { q: 0.5, u: "tsp", t: "ground nutmeg" },
          { q: 0.25, u: "tsp", t: "kosher salt" },
          { head: "Bourbon caramel" },
          { q: 1, u: "cup", t: "packed brown sugar" },
          { q: 0.5, u: "cup", t: "unsalted butter" },
          { q: 0.5, u: "cup", t: "heavy cream" },
          { q: 2, u: "tbsp", t: "bourbon (or 1 tsp vanilla for an alcohol-free sauce)" },
          { q: null, u: "", s: "n", t: "Pinch of flaky salt" }
        ],
        steps: [
          "Butter a 9×13-inch baking dish and spread the bread cubes in it.",
          "Whisk the eggs, milk, cream, brown sugar, vanilla, spices and salt until smooth.",
          "Pour over the bread, press down gently and let it soak at least 30 minutes (or cover and refrigerate overnight).",
          "Bake at 350°F (175°C) for 45–50 minutes, until puffed, golden and set in the centre.",
          "Caramel: melt the butter and brown sugar together over medium heat, stirring, for 3 minutes. Whisk in the cream and simmer 2–3 minutes until glossy. Off the heat, stir in the bourbon and salt.",
          "Serve warm, with the caramel poured over at the table."
        ],
        tip: "It goes into the oven just as you sit down to dinner, so it comes out warm and fragrant for dessert. The caramel can be made 3 days ahead and rewarmed."
      }
    ],

    timeline(p) {
      const out = [], R = p.roast, tOut = -(p.rest + 10), tIn = tOut - R;
      const add = (m, icon, text, alarm = true, main = false) => out.push({ m, icon, text, alarm, main });
      add(tIn - 60, "👑", "Take the crown roast out of the fridge");
      add(tIn - 20, "🔥", "Heat the oven to 450°F. Rub on the herb crust and cap the bones with foil");
      add(tIn, "👑", `Crown roast into the oven at 450°F (${fmtNum(p.w)} lb, about ${p.roastText} in total)`, true, true);
      add(tIn + 15, "🌡️", "Turn the oven down to 325°F (don't open the door)");
      add(tOut - 100, "🍚", "Wild rice on to simmer (45–50 minutes)");
      add(-110, "🧀", "Brie into the oven at 325°F, beside the roast");
      add(-90, "🍞", "Assemble the bread pudding and leave it to soak");
      add(-80, "🍐", "Wrap the prosciutto pears");
      add(-75, "🍎", "Warm the spiced cider; mix the cranberry fizz base");
      add(-65, "🥔", "Peel the potatoes and put them on to boil");
      add(-60, "🧀", "Brie out to rest. Drinks and appetizers out for guests");
      add(tOut - 40, "🍚", "Finish the stuffing, cover it and put it in the oven");
      add(tOut - 30, "🌡️", "Start checking the roast: pull it at 140°F");
      add(tOut, "👑", "Crown roast out to rest under foil. Oven up to 425°F. Stuffing out (keep covered)");
      add(tOut + 5, "🥬", "Brussels sprouts into the oven (20–25 minutes)");
      add(-25, "🥔", "Mash the potatoes, then stir in the truffle oil");
      add(-22, "🍎", "Make the apple cider gravy");
      add(-10, "👑", "Fill the crown with stuffing and bring it to the table to carve");
      add(tOut + 30, "🥬", "Sprouts out. Toss with balsamic and maple. Oven down to 350°F");
      add(0, "🍽️", "Dinner is served!");
      add(2, "🍞", "Bread pudding into the 350°F oven (45–50 minutes)");
      add(42, "🍯", "Warm the bourbon caramel");
      add(48, "🍮", "Bread pudding out. Serve warm with caramel");
      return out.sort((a, b) => a.m - b.m);
    },
    ahead(p) {
      return [
        [p.thawDays + 1, 9, "🧊", `Order or pick up the crown roast. If it's frozen, move it to the fridge to thaw today (${fmtNum(p.w)} lb needs about ${p.thawDays} ${p.thawDays === 1 ? "day" : "days"})`],
        [1, 10, "📋", "Prep day: cube the brioche to dry out, make the bourbon caramel, cook the wild rice, toast the nuts, trim the sprouts and assemble the brie"]
      ];
    },

    shop(f, p) {
      const wf = p.w / 8, up = (x, step = 1) => Math.ceil(x / step - 1e-9) * step, n = x => Math.max(1, Math.ceil(x - 1e-9));
      const pl = (k, one, many) => k > 1 ? many : one;
      const wheels = n(f), sheets = n(wheels / 2), cloves = 6 * wf + 2 * f, garlic = n(cloves / 10);
      const pears = Math.ceil(2 * f - 1e-9), onions = 1 + n(f), apples = n(f), pot = up(4 * f, 0.5), spr = up(2 * f, 0.5), shallots = n(f);
      const rose = n((2 * wf + 1) / 6), thyme = n((wf + 1.5 * f) / 8), sage = n((wf + f) / 8), limes = n(2 * f), oranges = n(f), arug = n(f / 3);
      const prosc = n(6 * f / 3.5);
      const butterTbsp = 3 * f + 8 * f + 3 * f + 2 * p.dishes + 8 * f, sticks = n(butterTbsp / 8);
      const milkCups = 1 * f + 2 * f, milk = n(milkCups / 4), creamCups = 0.5 * f + 1.5 * f, cream = n(creamCups / 2);
      const parm = n(65 * f / 150), eggs = Math.ceil(5 * f - 1e-9) + 1;
      const rice = n(1.5 * f / 2.5), cran = n(0.75 * f / 1.5), pecans = n(0.75 * f / 2), walnuts = n(0.25 * f / 1);
      const stockCups = 6.5 * f, stock = n(stockCups / 4), brown = up(1.75 * f, 0.25), brioche = n(f), baguette = n(f);
      const cider = n((7 * f + 1) / 8), bourbon = n(1.6 * f / 3.2), cj = n(3 * f / 8), gb = n(4 * f / 6);
      return [
        ["Meat & Seafood", [
          [`${fmtNum(p.w)} lb`, `crown roast of pork, ${p.ribs} ribs, frenched and tied (order ahead from your butcher)`, p.w * 14.99],
          [`${prosc} × 100 g`, pl(prosc, "package thinly sliced prosciutto", "packages thinly sliced prosciutto"), prosc * 6]
        ]],
        ["Produce", [
          [`${garlic}`, pl(garlic, "head garlic", "heads garlic"), garlic],
          [`${onions}`, "yellow onions", onions * 0.6],
          ["1", "bunch celery", 3.5],
          [`${shallots}`, pl(shallots, "shallot", "shallots"), shallots * 0.75],
          [`${apples}`, pl(apples, "crisp apple (Honeycrisp)", "crisp apples (Honeycrisp)"), apples * 1.2],
          [`${pears}`, "ripe but firm pears (Bosc or Anjou)", pears * 1.2],
          [`${fmtNum(pot)} lb`, "Yukon Gold potatoes", pot * 1.1],
          [`${fmtNum(spr)} lb`, "Brussels sprouts", spr * 4],
          [`${arug} × 5 oz`, pl(arug, "container baby arugula", "containers baby arugula"), arug * 5],
          [`${rose}`, pl(rose, "bunch fresh rosemary", "bunches fresh rosemary"), rose * 3],
          [`${thyme}`, pl(thyme, "bunch fresh thyme", "bunches fresh thyme"), thyme * 3],
          [`${sage}`, pl(sage, "bunch fresh sage", "bunches fresh sage"), sage * 3],
          ["1", "bunch fresh flat-leaf parsley", 2],
          ["1", "bunch fresh chives", 3],
          ["1", "lemon", 1],
          [`${limes}`, "limes", limes * 0.6],
          [`${oranges}`, pl(oranges, "orange", "oranges"), oranges]
        ]],
        ["Dairy & Refrigerated", [
          [`${wheels} × 8 oz`, pl(wheels, "wheel of brie", "wheels of brie"), wheels * 8],
          [`${sticks}`, `sticks unsalted butter (${fmtNum(up(sticks / 4, 0.25))} lb)`, sticks * 1.75],
          [cupsT(up(milkCups, 0.5)), `whole milk (${milk} × 1 L)`, milk * 2.8],
          [cupsT(up(creamCups, 0.5)), `heavy cream (${cream} × 500 ml)`, cream * 4.5],
          [`${parm} × 150 g`, pl(parm, "wedge Parmesan", "wedges Parmesan"), parm * 6],
          [`${eggs}`, "large eggs", eggs * 0.45],
          [`${sheets}`, pl(sheets, "box frozen puff pastry (2 sheets)", "boxes frozen puff pastry (2 sheets each)"), sheets * 5]
        ]],
        ["Pantry, Grains & Spices", [
          [`${rice} × 454 g`, pl(rice, "bag wild rice blend", "bags wild rice blend"), rice * 7],
          [`${stock} × 1 L`, `low-sodium chicken stock (about ${Math.ceil(stockCups)} cups)`, stock * 3.5],
          [`${cran}`, pl(cran, "bag dried cranberries", "bags dried cranberries"), cran * 4],
          [`${pecans} × 200 g`, pl(pecans, "bag pecans", "bags pecans"), pecans * 7],
          [`${walnuts} × 100 g`, pl(walnuts, "bag walnuts", "bags walnuts"), walnuts * 4],
          ["1", "jar fig jam", 6],
          ["1", "bottle balsamic glaze", 6],
          ["1", "small bottle truffle oil", 12],
          [`${brioche} × 1 lb`, pl(brioche, "loaf brioche or challah", "loaves brioche or challah"), brioche * 6],
          [`${baguette}`, pl(baguette, "baguette (or a box of crackers)", "baguettes (or boxes of crackers)"), baguette * 3.5],
          [cupsT(brown), "brown sugar", brown * 0.6],
          ["", "all-purpose flour, Dijon mustard, olive oil, maple syrup", null],
          ["", "balsamic vinegar, apple cider vinegar, vanilla extract", null],
          ["", "cinnamon sticks, whole cloves, star anise (optional)", null],
          ["", "ground cinnamon, ground nutmeg, kosher salt, black pepper, flaky salt", null]
        ]],
        ["Wine, Spirits & Mixers", [
          [`${cider} × 1.89 L`, pl(cider, "jug apple cider", "jugs apple cider"), cider * 5],
          [`${bourbon} × 750 ml`, pl(bourbon, "bottle bourbon", "bottles bourbon"), bourbon * 45],
          [`${cj} × 1.89 L`, pl(cj, "jug cranberry juice", "jugs cranberry juice"), cj * 5],
          [`${gb} × 4-pack`, "non-alcoholic ginger beer", gb * 6],
          ["", "optional: Champagne or Crémant, Pinot Noir or Chenin Blanc, port", null]
        ]],
        ["Baking & Miscellaneous", [
          ["", "butcher's twine and heavy-duty aluminum foil", null],
          ["", "instant-read meat thermometer", null],
          ["", "roasting pan, 2 large baking sheets, parchment paper", null],
          [`${p.dishes * 2}`, "baking dishes (9×13-inch), for the stuffing and the bread pudding", null],
          ["", "paper frills for the bones (optional)", null]
        ]]
      ];
    }
  };

  // sizes for a crown roast: 1 rib per guest (a crown needs at least 10), about 0.65 lb per rib
  function porkCrownPlan(guests) {
    const g = Math.min(20, Math.max(1, guests | 0)), f = g / 8;
    const ribs = Math.min(20, Math.max(10, g)), w = Math.round(ribs * 0.65 * 2) / 2;
    const roast = Math.round((15 + w * 15) / 5) * 5;
    return { g, f, w, wBase: 8, icon: "👑", meat: `crown roast (${ribs} ribs)`, verb: "roasts",
      bigNote: "Pull it out at 140°F. It rises to a juicy 145°F as it rests." + (g < 10 ? " A crown needs at least 10 ribs, so expect leftovers." : ""),
      roast, roastText: hm(roast), rest: 25, thawDays: Math.max(1, Math.ceil(w * 5 / 24)), pies: 1, dishes: Math.max(1, Math.ceil(f - 0.25)), ribs };
  }

  // lamb doneness: [key, label, pull °F, after resting, time factor]
  const LAMB_DONENESS = [["rare", "Rare", 120, "125°F", 0.85], ["mediumrare", "Med-rare", 130, "135°F", 1], ["medium", "Medium", 135, "140–145°F", 1.12], ["mediumwell", "Med-well", 145, "150°F", 1.25]];
  const lambcrown = {
    id: "lambcrown",
    tab: "elegant",
    name: "Crown Roast of Lamb",
    icon: "🐑",
    blurb: "Garlic-rosemary-Dijon lamb crown filled with roasted wild mushrooms, fingerlings, charred asparagus and berry pavlova.",
    options: { doneness: LAMB_DONENESS },
    menu: [
      ["Signature drinks", ["Pomegranate-Rosemary Prosecco Fizz", "Cucumber-Mint Lime Spritz (alcohol-free)"]],
      ["Appetizers", ["Warm Goat Cheese & Fig Crostini with Honey (warm)", "Smoked Salmon Bites with Dill Cream (light)"]],
      ["Main", ["Garlic, Rosemary & Dijon Crown Roast of Lamb", "Quick Red Wine & Mint Demi-Glace"]],
      ["In the crown", ["Herb-Roasted Wild Mushrooms & Pearl Onions"]],
      ["Sides", ["Lemon-Herb Roasted Fingerling Potatoes", "Charred Asparagus with Lemon Zest"]],
      ["Dessert", ["Winter Berry Pavlova"]]
    ],
    drinks: [
      ["With the starters", "Sauvignon Blanc or Sancerre with the goat cheese and salmon, or keep pouring the Prosecco."],
      ["With the lamb", "Bordeaux-style red, Rioja Reserva or Syrah. Their savoury depth loves rosemary and garlic."],
      ["Alcohol-free", "Cucumber-Mint Lime Spritz (recipe included)."],
      ["With dessert", "A late-harvest or ice wine, or coffee."]
    ],
    recipes: [
      {
        id: "pomfizz", course: "Drinks", name: "Pomegranate-Rosemary Prosecco Fizz",
        prep: "10 min, plus cooling the syrup", cook: "5 min", yieldText: f => `${Math.round(8 * f)} drinks`,
        ing: [
          { q: 0.5, u: "cup", t: "granulated sugar" },
          { q: 0.5, u: "cup", t: "water" },
          { q: 3, u: "", t: ["sprig fresh rosemary, plus extra to garnish", "sprigs fresh rosemary, plus extra to garnish"] },
          { q: 1, u: "cup", t: "pomegranate juice, chilled" },
          { q: 1, u: "", up: true, t: ["bottle (750 ml) Prosecco, chilled", "bottles (750 ml) Prosecco, chilled"] },
          { q: null, u: "", s: "n", t: "Pomegranate seeds, to garnish" }
        ],
        steps: [
          "Rosemary syrup: simmer the sugar, water and rosemary for 3 minutes, stirring until the sugar dissolves. Cool, then remove the rosemary.",
          "For each drink, add 1 oz pomegranate juice and ½ oz rosemary syrup to a flute.",
          "Top with Prosecco and garnish with a few pomegranate seeds and a small rosemary sprig."
        ],
        tip: "Make the syrup up to a week ahead and keep it in the fridge."
      },
      {
        id: "spritz", course: "Drinks", name: "Cucumber-Mint Lime Spritz (alcohol-free)",
        prep: "10 min", cook: "none", yieldText: f => `about ${Math.round(6 * f)} cups`,
        ing: [
          { q: 0.5, u: "", up: true, t: ["English cucumber, thinly sliced", "English cucumbers, thinly sliced"] },
          { q: 0.5, u: "cup", t: "fresh mint leaves" },
          { q: 0.5, u: "cup", t: "fresh lime juice" },
          { q: 0.33, u: "cup", t: "honey, dissolved in the same amount of warm water" },
          { q: 4, u: "cup", t: "sparkling water, chilled" }
        ],
        steps: [
          "In a large pitcher, gently press the mint with a spoon to release its scent.",
          "Add the cucumber, lime juice and honey water and stir.",
          "Just before serving, add the sparkling water and pour over ice."
        ],
        tip: "Mint and lamb are classic partners, so this ties the whole menu together."
      },
      {
        id: "goatcrostini", course: "Appetizer", name: "Warm Goat Cheese & Fig Crostini with Honey",
        prep: "15 min", cook: "10 min", yieldText: f => `about ${Math.round(24 * f)} pieces`,
        ing: [
          { q: 1, u: "", up: true, t: ["baguette, cut into ½-inch slices", "baguettes, cut into ½-inch slices"] },
          { q: 2, u: "tbsp", t: "olive oil" },
          { q: 8, u: "oz", t: "soft goat cheese, at room temperature" },
          { q: 0.5, u: "cup", t: "fig jam" },
          { q: 2, u: "tbsp", t: "honey" },
          { q: 1, u: "tsp", t: "fresh thyme leaves" },
          { q: null, u: "", s: "n", t: "Flaky salt and cracked black pepper" }
        ],
        steps: [
          "Brush the bread slices lightly with olive oil and toast at 425°F for 5 minutes, until just crisp.",
          "Spread each toast with goat cheese and top with a small spoonful of fig jam.",
          "Return to the oven for 4–5 minutes, until the cheese is warm and soft.",
          "Drizzle with honey and finish with thyme, flaky salt and pepper. Serve warm."
        ],
        tip: "Toast the bread the day before. On the day, they need only a few minutes in the hot oven."
      },
      {
        id: "salmonbites", course: "Appetizer", name: "Smoked Salmon Bites with Dill Cream",
        prep: "20 min", cook: "none", yieldText: f => `about ${Math.round(24 * f)} pieces`,
        ing: [
          { q: 1, u: "", up: true, t: ["English cucumber, cut into ½-inch rounds", "English cucumbers, cut into ½-inch rounds"] },
          { q: 4, u: "oz", t: "cream cheese, softened" },
          { q: 2, u: "tbsp", t: "sour cream" },
          { q: 1, u: "tbsp", t: "fresh dill, chopped, plus sprigs to garnish" },
          { q: 1, u: "tsp", t: "lemon zest" },
          { q: 8, u: "oz", t: "smoked salmon, cut into small strips" },
          { q: 1, u: "tbsp", t: "capers, drained" }
        ],
        steps: [
          "Pat the cucumber rounds dry.",
          "Mix the cream cheese, sour cream, dill and lemon zest until smooth.",
          "Pipe or spoon a little dill cream onto each cucumber round.",
          "Top with a curl of smoked salmon, a caper and a tiny sprig of dill."
        ],
        tip: "Light, fresh and naturally gluten-free. Assemble up to 1 hour ahead and keep chilled."
      },
      {
        id: "lamb", course: "Main", name: "Garlic, Rosemary & Dijon Crown Roast of Lamb",
        prep: "30 min (tie the crown the day before)", cook: p => p.roastText, rest: p => p.rest + " min", yieldText: (f, p) => `${p.ribs} ribs (${p.racks} racks${p.crowns > 1 ? ", 2 crowns" : ""})`,
        note: (f, p) => `Your doneness: ${p.doneLabel}. Pull the lamb out at ${p.pull}°F. It rises to about ${p.final} while it rests.` + (p.crowns > 1 ? " For this many guests, make 2 crowns and roast them side by side." : ""),
        ing: [
          { q: null, u: "", s: "n", t: p => `${p.racks} frenched racks of lamb, 8 ribs each (about ${fmtNum(p.w)} lb in total)` },
          { head: "Garlic, rosemary & Dijon crust" },
          { q: 4, u: "", s: "w", t: ["garlic clove, finely minced", "garlic cloves, finely minced"] },
          { q: 3, u: "tbsp", s: "w", t: "Dijon mustard" },
          { q: 2, u: "tbsp", s: "w", t: "fresh rosemary, finely chopped" },
          { q: 1, u: "tbsp", s: "w", t: "fresh thyme leaves" },
          { q: 2, u: "tbsp", s: "w", t: "olive oil" },
          { q: 0.33, u: "cup", s: "w", t: "panko breadcrumbs (optional, for extra crunch)" },
          { q: 2, u: "tsp", s: "w", t: "kosher salt" },
          { q: 1, u: "tsp", s: "w", t: "black pepper" }
        ],
        steps: [
          "Shape the crown (the day before is easiest): stand each rack upright with the bones pointing up and the fat side facing out.",
          "To help them bend, make small 1-inch cuts between the ribs at the base of the meat, on the inside of the curve.",
          "Curve the racks into a circle and interlock the end bones where the racks meet, so they hold each other.",
          "Tie butcher's twine snugly around the crown in two places: once around the base and once around the middle. Knot it securely.",
          "Wrap each exposed bone tip in a small square of foil so it doesn't burn, and set a ball of foil in the centre to hold the shape. Refrigerate until needed.",
          "On the day, take the lamb out of the fridge 1 hour before roasting and season it all over with the salt and pepper.",
          "Stir together the garlic, Dijon, rosemary, thyme and olive oil and spread it over the outside of the meat. Press on the panko, if using.",
          "Roast at 450°F (230°C) for 15 minutes, then turn the oven down to 375°F (190°C).",
          p => `Roast until a thermometer in the thickest part of the meat (not touching bone) reads ${p.pull}°F for ${p.doneLabel.toLowerCase()}, about ${p.roastText} in total. Lamb cooks quickly, so start checking after 25 minutes.`,
          p => `Rest ${p.rest} minutes, loosely tented with foil. It rises to about ${p.final}, tender and rosy pink.`,
          "Remove the foil ball and bone caps, fill the centre with the roasted mushrooms and carve at the table by slicing between the bones."
        ],
        tip: "Lamb doneness (pull → after resting): Rare 120°F → 125°F · Medium-rare 130°F → 135°F · Medium 135°F → 140–145°F · Medium-well 145°F → 150°F. A 15-minute rest is crucial for juicy, pink meat."
      },
      {
        id: "mushrooms", course: "In the crown", name: "Herb-Roasted Wild Mushrooms & Pearl Onions",
        prep: "15 min", cook: "25 min", yieldText: f => servings(f),
        ing: [
          { q: 2, u: "lb", t: "mixed mushrooms (cremini, shiitake, oyster), trimmed and halved or torn" },
          { q: 10, u: "oz", t: "frozen pearl onions, thawed and patted dry" },
          { q: 2, u: "", t: ["shallot, thinly sliced", "shallots, thinly sliced"] },
          { q: 4, u: "", t: ["garlic clove, sliced", "garlic cloves, sliced"] },
          { q: 3, u: "tbsp", t: "olive oil" },
          { q: 2, u: "tbsp", t: "unsalted butter, melted" },
          { q: 1, u: "tbsp", t: "fresh thyme leaves" },
          { q: 1, u: "tsp", t: "kosher salt" },
          { q: 0.5, u: "tsp", t: "black pepper" },
          { q: 1, u: "tbsp", t: "sherry vinegar or balsamic vinegar" },
          { q: 2, u: "tbsp", t: "fresh flat-leaf parsley, chopped" }
        ],
        steps: [
          "Heat the oven to 425°F (220°C).",
          "Toss the mushrooms, pearl onions, shallots and garlic with the oil, butter, thyme, salt and pepper.",
          "Spread on two large baking sheets so nothing is crowded.",
          "Roast 25 minutes, stirring once, until golden and the edges are crisp.",
          "Toss with the vinegar and parsley. Keep warm, and rewarm 5 minutes in the oven while the lamb rests.",
          "Pile into the centre of the crown just before serving."
        ],
        tip: "Don't crowd the pans. Mushrooms need space to roast instead of steam."
      },
      {
        id: "fingerlings", course: "Sides", name: "Lemon-Herb Roasted Fingerling Potatoes",
        prep: "10 min", cook: "about 45 min", yieldText: f => servings(f),
        ing: [
          { q: 3, u: "lb", t: "fingerling potatoes, halved lengthwise" },
          { q: 3, u: "tbsp", t: "olive oil" },
          { q: 1, u: "tsp", t: "kosher salt" },
          { q: 0.5, u: "tsp", t: "black pepper" },
          { q: 1, u: "", t: ["lemon, zested and juiced", "lemons, zested and juiced"] },
          { q: 2, u: "tbsp", t: "fresh parsley and chives, chopped" }
        ],
        steps: [
          "Toss the potatoes with the oil, salt and pepper and spread cut side down on a baking sheet.",
          "Roast on the lower rack alongside the lamb: 15 minutes at 450°F, then at 375°F until the lamb comes out.",
          "While the lamb rests, turn the oven back up to 450°F and give the potatoes 10 more minutes until crisp.",
          "Toss with the lemon zest, a squeeze of lemon juice and the herbs."
        ],
        tip: "Roasting on their own? 425°F for 30–35 minutes, cut side down, until golden."
      },
      {
        id: "asparagus", course: "Sides", name: "Charred Asparagus with Lemon Zest",
        prep: "5 min", cook: "8–10 min", yieldText: f => servings(f),
        ing: [
          { q: 2, u: "lb", t: "asparagus, woody ends snapped off" },
          { q: 2, u: "tbsp", t: "olive oil" },
          { q: 0.5, u: "tsp", t: "kosher salt" },
          { q: 0.25, u: "tsp", t: "black pepper" },
          { q: 1, u: "tsp", t: "lemon zest" },
          { q: null, u: "", s: "n", t: "Flaky salt and a squeeze of lemon, to finish" }
        ],
        steps: [
          "Toss the asparagus with the oil, salt and pepper on a baking sheet in a single layer.",
          "Roast on the top rack at 450°F for 8–10 minutes, until tender with charred tips.",
          "Finish with lemon zest, flaky salt and a squeeze of lemon."
        ],
        tip: "It roasts in the hot oven while the lamb rests."
      },
      {
        id: "demiglace", course: "Main", name: "Quick Red Wine & Mint Demi-Glace",
        prep: "5 min", cook: "30 min (make ahead)", yieldText: f => `about ${fmtCups(1.25 * f)}`,
        ing: [
          { q: 1, u: "tbsp", t: "olive oil" },
          { q: 1, u: "", t: ["shallot, finely minced", "shallots, finely minced"] },
          { q: 1, u: "", t: ["garlic clove, minced", "garlic cloves, minced"] },
          { q: 1, u: "cup", t: "dry red wine" },
          { q: 2.5, u: "cup", t: "low-sodium beef or lamb stock" },
          { q: 2, u: "", t: ["sprig fresh rosemary", "sprigs fresh rosemary"] },
          { q: 2, u: "tbsp", t: "cold unsalted butter" },
          { q: 2, u: "tbsp", t: "fresh mint, finely chopped" },
          { q: 1, u: "tsp", t: "red wine vinegar" },
          { q: null, u: "", s: "n", t: "Kosher salt and black pepper, to taste" }
        ],
        steps: [
          "Warm the oil in a saucepan and cook the shallot and garlic for 2 minutes.",
          "Add the wine and simmer until reduced by half.",
          "Add the stock and rosemary and simmer 20–25 minutes, until reduced to about a cup and glossy enough to coat a spoon.",
          "Strain. You can refrigerate it now for up to 3 days.",
          "To serve, rewarm it and stir in any juices from the roasting pan.",
          "Off the heat, swirl in the butter, then the mint and vinegar. Season to taste."
        ],
        tip: "A true demi-glace takes hours; this quick reduction gives the same silky richness. Add the mint at the very end so it stays bright green."
      },
      {
        id: "pavlova", course: "Dessert", name: "Winter Berry Pavlova",
        prep: "20 min", cook: "1 hour 30 min, plus cooling in the oven", yieldText: (f, p) => p.pies > 1 ? `${p.pies} pavlovas (8 servings each)` : "one pavlova (8 servings)",
        note: (f, p) => p.pies > 1 ? `Amounts below are for all ${p.pies} pavlovas. Bake each on its own tray.` : "",
        ing: [
          { q: 4, u: "", s: "p", t: ["large egg white, at room temperature", "large egg whites, at room temperature"] },
          { q: 1, u: "cup", s: "p", t: "superfine (caster) sugar" },
          { q: 2, u: "tsp", s: "p", t: "cornstarch" },
          { q: 1, u: "tsp", s: "p", t: "white vinegar" },
          { q: 1, u: "tsp", s: "p", t: "vanilla extract" },
          { head: "Topping" },
          { q: 1.5, u: "cup", s: "p", t: "cold heavy cream" },
          { q: 2, u: "tbsp", s: "p", t: "icing sugar" },
          { q: 4, u: "cup", s: "p", t: "mixed berries (raspberries, blueberries, blackberries)" },
          { q: null, u: "", s: "n", t: "Pomegranate seeds and mint leaves, to garnish" }
        ],
        steps: [
          "Heat the oven to 250°F (120°C). Draw an 8-inch circle on parchment and flip it over onto a baking sheet.",
          "Beat the egg whites to soft peaks. Add the sugar a spoonful at a time, beating until thick, glossy and the sugar has dissolved (rub a little between your fingers; it should feel smooth).",
          "Beat in the cornstarch, vinegar and vanilla.",
          "Spread the meringue inside the circle, building up the sides to make a shallow nest.",
          "Bake 1 hour 30 minutes, then turn the oven off and leave the pavlova inside, door closed, until completely cool (or overnight).",
          "Just before serving, whip the cream with the icing sugar to soft peaks, pile it into the nest and top with berries, pomegranate seeds and mint."
        ],
        tip: "Naturally gluten-free. Bake it the day before and store it airtight at room temperature, never in the fridge. Top it only at the last minute so it stays crisp."
      }
    ],

    timeline(p) {
      const out = [], R = p.roast, tOut = -(p.rest + 5), tIn = tOut - R;
      const add = (m, icon, text, alarm = true, main = false) => out.push({ m, icon, text, alarm, main });
      add(Math.min(-120, tIn - 60), "🐑", "Take the lamb crown out of the fridge");
      add(-120, "🔥", "Heat the oven to 425°F");
      add(-105, "🍄", "Mushrooms and pearl onions into the oven (25 minutes)");
      add(-90, "🐑", "Season the lamb and spread on the garlic-rosemary-Dijon crust");
      add(-80, "🍄", "Mushrooms out. Keep them warm");
      add(-78, "🥖", "Crostini into the oven (toast 5 min, then add cheese and fig for 5 min)");
      add(-70, "🐟", "Assemble the smoked salmon bites");
      add(-65, "🔥", "Crostini out. Turn the oven up to 450°F for the lamb");
      add(-62, "🍸", "Mix the spritz base. Set out the rosemary syrup and Prosecco");
      add(-60, "🥂", "Drinks and appetizers out for arriving guests");
      add(tIn - 5, "🥔", "Toss the fingerling potatoes with oil and seasoning");
      add(tIn, "🐑", `Lamb crown in on the middle rack and potatoes below, at 450°F (about ${p.roastText} in total)`, true, true);
      add(tIn + 15, "🌡️", "Turn the oven down to 375°F");
      add(Math.max(tIn + 25, tOut - 12), "🌡️", `Start checking the lamb: pull it at ${p.pull}°F for ${p.doneLabel.toLowerCase()}`);
      add(tOut, "🐑", "Lamb out to rest 15 minutes. Oven up to 450°F");
      add(tOut + 2, "🥬", "Asparagus in on the top rack. Mushrooms back in to rewarm");
      add(-14, "🍷", "Rewarm the demi-glace with the pan juices; finish with butter and mint");
      add(-8, "🥔", "Asparagus and potatoes out. Toss the potatoes with lemon and herbs");
      add(-5, "🐑", "Fill the crown with mushrooms and bring it to the table to carve");
      add(0, "🍽️", "Dinner is served!");
      add(45, "🍓", "Whip the cream and top the pavlova with berries");
      return out.sort((a, b) => a.m - b.m);
    },
    ahead(p) {
      return [
        [Math.max(2, p.thawDays + 1), 9, "🧊", `Pick up the lamb racks. If they're frozen, move them to the fridge to thaw today (about ${p.thawDays} ${p.thawDays === 1 ? "day" : "days"})`],
        [1, 10, "📋", `Prep day: bake ${p.pies > 1 ? p.pies + " pavlovas" : "the pavlova"} and leave to cool in the oven, tie the lamb crown, make the demi-glace and rosemary syrup, make the dill cream and toast the crostini bread`]
      ];
    },

    shop(f, p) {
      const wf = p.w / 3.5, up = (x, step = 1) => Math.ceil(x / step - 1e-9) * step, n = x => Math.max(1, Math.ceil(x - 1e-9));
      const pl = (k, one, many) => k > 1 ? many : one;
      const cloves = 4 * wf + 4 * f + 1 * f, garlic = n(cloves / 10), shallots = n(3 * f), mush = up(2 * f, 0.5), pearl = n(10 * f / 14);
      const fing = up(3 * f, 0.5), asp = up(2 * f, 0.5), lemons = n(1.5 * f), limes = n(4 * f), cukes = n(f) + n(f / 2);
      const berries = n(4 * f), salmon = n(f), goat = n(2 * f), cc = n(f / 2), sour = 1;
      const cream = n(1.5 * p.pies / 2), sticks = n(4 * f / 8), eggs = 4 * p.pies;
      const stock = n(2.5 * f / 4), wine = n(f / 3), bag = n(f), sugarC = up(1 * p.pies + 0.5 * f, 0.25);
      const prosecco = n(f), pj = n(f / 4), fizz = n(f);
      return [
        ["Meat & Seafood", [
          [`${p.racks} racks`, `frenched racks of lamb, 8 ribs each (about ${fmtNum(p.w)} lb total)`, p.racks * 55],
          [`${salmon} × 8 oz`, "smoked salmon", salmon * 12]
        ]],
        ["Produce", [
          [`${fmtNum(mush)} lb`, "mixed mushrooms (cremini, shiitake, oyster)", mush * 8],
          [`${garlic}`, pl(garlic, "head garlic", "heads garlic"), garlic],
          [`${shallots}`, "shallots", shallots * 0.75],
          [`${fmtNum(fing)} lb`, "fingerling potatoes", fing * 3],
          [`${fmtNum(asp)} lb`, "asparagus", asp * 5],
          [`${cukes}`, "English cucumbers", cukes * 1.5],
          [`${lemons}`, pl(lemons, "lemon", "lemons"), lemons],
          [`${limes}`, "limes", limes * 0.6],
          [`${berries} × 170 g`, "containers mixed berries (raspberries, blueberries, blackberries)", berries * 5],
          ["1", "pomegranate, for garnish", 3],
          [`${n((2 * wf + 3 * f + 3) / 6)}`, "bunch fresh rosemary (extra for drinks and garnish)", n((2 * wf + 3 * f + 3) / 6) * 3],
          [`${n((wf + 1.5 * f) / 8)}`, "bunch fresh thyme", n((wf + 1.5 * f) / 8) * 3],
          [`${n(f)}`, pl(n(f), "bunch fresh mint", "bunches fresh mint"), n(f) * 3],
          ["1", "bunch fresh dill", 3],
          ["1", "bunch fresh flat-leaf parsley", 2],
          ["1", "bunch fresh chives", 3]
        ]],
        ["Frozen", [[`${pearl} × 400 g`, pl(pearl, "bag frozen pearl onions", "bags frozen pearl onions"), pearl * 4]]],
        ["Dairy & Refrigerated", [
          [`${goat} × 4 oz`, "soft goat cheese logs", goat * 5],
          [`${cc} × 8 oz`, "cream cheese", cc * 4.5],
          [`${sour} × 250 ml`, "sour cream", sour * 2.5],
          [`${cream} × 500 ml`, "heavy cream", cream * 4.5],
          [`${sticks}`, pl(sticks, "stick unsalted butter", "sticks unsalted butter"), sticks * 1.75],
          [`${eggs}`, "large eggs (for the egg whites)", eggs * 0.45]
        ]],
        ["Pantry, Grains & Spices", [
          [`${bag}`, pl(bag, "baguette", "baguettes"), bag * 3.5],
          ["1", "jar fig jam", 6],
          ["1", "small jar capers", 4],
          [`${stock} × 1 L`, "low-sodium beef or lamb stock", stock * 3.5],
          ["1", "small box panko breadcrumbs (optional)", 3],
          [cupsT(sugarC), "superfine (caster) sugar", sugarC * 0.6],
          ["", "Dijon mustard, olive oil, honey", null],
          ["", "sherry or balsamic vinegar, red wine vinegar, white vinegar", null],
          ["", "cornstarch, vanilla extract, icing sugar", null],
          ["", "kosher salt, flaky salt, black pepper", null]
        ]],
        ["Wine, Spirits & Mixers", [
          [`${prosecco} × 750 ml`, pl(prosecco, "bottle Prosecco", "bottles Prosecco"), prosecco * 20],
          [`${wine}`, pl(wine, "bottle dry red wine (for the demi-glace)", "bottles dry red wine (for the demi-glace)"), wine * 16],
          [`${pj} × 946 ml`, "pomegranate juice", pj * 6],
          [`${fizz} × 1 L`, "sparkling water", fizz * 1.75],
          ["", "optional: Bordeaux, Rioja Reserva or Syrah; Sauvignon Blanc; ice wine", null]
        ]],
        ["Baking & Miscellaneous", [
          ["", "butcher's twine and heavy-duty aluminum foil", null],
          ["", "instant-read meat thermometer", null],
          ["", "roasting pan, 3 large baking sheets, parchment paper", null],
          ["", "piping bag (optional), paper frills for the bones (optional)", null]
        ]]
      ];
    }
  };

  // sizes for a lamb crown: about 2 ribs per guest, racks of 8 ribs; 2 crowns for big groups
  function lambCrownPlan(guests, c = {}) {
    const g = Math.min(20, Math.max(1, guests | 0)), f = g / 8;
    const racks = Math.max(2, Math.ceil(g * 2 / 8)), crowns = racks > 3 ? 2 : 1, w = racks * 1.75;
    const d = LAMB_DONENESS.find(x => x[0] === c.doneness) || LAMB_DONENESS[1];
    const per = racks / crowns, base = per <= 2 ? 35 : 35 + (per - 2) * 10;
    const roast = Math.round((base * d[4] + (crowns > 1 ? 5 : 0)) / 5) * 5;
    return { g, f, w, wBase: 3.5, icon: "🐑", meat: `lamb crown (${racks * 8} ribs${crowns > 1 ? ", 2 crowns" : ""})`, verb: "roasts",
      bigNote: `Pull it out at ${d[2]}°F for ${d[1].toLowerCase().replace("med-", "medium-")}. It rises to about ${d[3]} as it rests.`,
      roast, roastText: hm(roast), rest: 15, thawDays: 1, pies: Math.max(1, Math.ceil(g / 8)), dishes: 1,
      ribs: racks * 8, racks, crowns, pull: d[2], final: d[3], doneLabel: d[1].replace("Med-", "Medium-") };
  }

  const vegan = {
    id: "vegan",
    tab: "vegan",
    name: "Vegan Wellington Dinner",
    icon: "🌱",
    blurb: "Mushroom & lentil Wellington, wild mushroom stuffing, maple sprouts, umami gravy and deep-dish pecan pie. 100% plant-based.",
    menu: [
      ["Drinks", ["Spiced Vegan Cashew Eggnog", "Festive Cranberry-Rosemary Spritzer (with gin or vodka, or alcohol-free)"]],
      ["Appetizer", ["Pistachio & Pomegranate Vegan Cheese Ball"]],
      ["Main", ["Classic Mushroom & Lentil Vegan Wellington", "Rich Umami Vegan Gravy"]],
      ["Sides", ["Wild Mushroom Stuffing with Sage & Rosemary", "Maple Roasted Brussels Sprouts with Toasted Hazelnuts"]],
      ["Dessert", ["Deep-Dish Vegan Pecan Pie"]]
    ],
    drinks: [
      ["With dinner", "A vegan-friendly Pinot Noir or Gamay (Beaujolais). Light-bodied, with earthy cherry notes that echo the mushrooms and lentils without overpowering them. Look for \"vegan\" or \"unfined\" on the label: some wines are clarified with egg whites or fish products."],
      ["Lighter option", "A dry Riesling or Grüner Veltliner. Crisp acidity cuts through the rich pastry and gravy."],
      ["Spritzer", "The Cranberry-Rosemary Spritzer (recipe included) pairs beautifully with the cheese ball, and it's just as festive without the spirits."],
      ["With dessert", "The spiced cashew eggnog, or coffee with oat milk."]
    ],
    recipes: [
      {
        id: "nog", course: "Drinks", name: "Spiced Vegan Cashew Eggnog",
        prep: "10 min, plus soaking and chilling", cook: "none", yieldText: f => `about ${Math.round(6 * f)} cups`,
        ing: [
          { q: 1, u: "cup", t: "raw cashews, soaked 4 hours or overnight, then drained" },
          { q: 3, u: "cup", t: "unsweetened almond or oat milk" },
          { q: 1, u: "", t: ["can (13.5 oz) full-fat coconut milk", "cans (13.5 oz each) full-fat coconut milk"] },
          { q: 0.5, u: "cup", t: "pure maple syrup" },
          { q: 2, u: "tsp", t: "vanilla extract" },
          { q: 1, u: "tsp", t: "ground cinnamon" },
          { q: 0.5, u: "tsp", t: "ground nutmeg, plus extra to serve" },
          { q: 0.25, u: "tsp", t: "ground cloves" },
          { q: 0.125, u: "tsp", t: "ground turmeric (optional, for a golden colour)" },
          { q: null, u: "", s: "n", t: "Pinch of salt" }
        ],
        steps: [
          "Blend everything in a high-speed blender for 2 minutes, until completely silky.",
          "Chill at least 2 hours. It thickens as it chills.",
          "Shake or stir, pour into small glasses and dust with nutmeg.",
          "For adults, add 1 oz dark rum or bourbon to each glass, if you like."
        ],
        tip: "Make it the day before. It keeps 3 days in the fridge."
      },
      {
        id: "spritzer", course: "Drinks", name: "Festive Cranberry-Rosemary Spritzer",
        prep: "5 min", cook: "none", yieldText: f => `${Math.round(8 * f)} drinks`,
        ing: [
          { q: 2, u: "cup", t: "cranberry juice, chilled" },
          { q: 0.5, u: "cup", t: "fresh lime juice" },
          { q: 3, u: "cup", t: "ginger beer, chilled" },
          { q: 1.5, u: "cup", t: "gin or vodka (optional: 1½ oz per drink)" },
          { q: null, u: "", s: "n", t: "Rosemary sprigs, lime wheels and fresh cranberries, to garnish" }
        ],
        steps: [
          "Fill glasses with ice and add 1½ oz gin or vodka, if using.",
          "Add about ¼ cup cranberry juice and a splash of lime juice to each glass.",
          "Top with ginger beer and garnish with a rosemary sprig, lime wheel and a few cranberries."
        ],
        tip: "Leave out the spirits for a festive alcohol-free version that everyone can enjoy."
      },
      {
        id: "veganball", course: "Appetizer", name: "Pistachio & Pomegranate Vegan Cheese Ball",
        prep: "20 min, plus soaking and 4 hours chilling", cook: "none", yieldText: f => servings(f),
        ing: [
          { q: 1.5, u: "cup", t: "raw cashews, soaked 4 hours or overnight, then drained" },
          { q: 2, u: "tbsp", t: "fresh lemon juice" },
          { q: 2, u: "tbsp", t: "nutritional yeast" },
          { q: 2, u: "tbsp", t: "refined coconut oil, melted (this helps it firm up)" },
          { q: 1, u: "", t: ["small garlic clove", "small garlic cloves"] },
          { q: 0.5, u: "tsp", t: "salt" },
          { q: 3, u: "tbsp", t: "water, as needed" },
          { q: 0.5, u: "cup", t: "shelled pistachios, chopped" },
          { q: 0.33, u: "cup", t: "pomegranate seeds" },
          { q: 1, u: "tbsp", t: "fresh chives or parsley, chopped" },
          { q: null, u: "", s: "n", t: "Vegan crackers and apple slices, for serving" }
        ],
        steps: [
          "Blend the cashews, lemon juice, nutritional yeast, coconut oil, garlic and salt until very smooth, adding water a spoonful at a time only as needed. Scrape down the sides often.",
          "Scrape onto plastic wrap, shape into a ball, wrap tightly and chill at least 4 hours (or overnight) until firm.",
          "Mix the pistachios, pomegranate seeds and herbs on a plate.",
          "Unwrap the ball and roll it in the topping, pressing gently so it sticks.",
          "Let it sit out 15 minutes before serving with crackers and apple slices."
        ],
        tip: "Make it the day before. The coconut oil sets it firm in the fridge."
      },
      {
        id: "wellington", course: "Main", name: "Classic Mushroom & Lentil Vegan Wellington",
        prep: "45 min, plus chilling", cook: "40–45 min", rest: "10 min",
        yieldText: (f, p) => p.batches > 1 ? `${p.batches} Wellingtons (about 6 servings each)` : "1 Wellington (about 6 servings)",
        note: (f, p) => (p.batches > 1 ? `Amounts below are for all ${p.batches} Wellingtons together. Bake them two to a large baking sheet, with space between. ` : "") + "Check that the puff pastry is labelled vegan. Many store brands are made with oil instead of butter.",
        ing: [
          { q: 1, u: "tbsp", s: "b", t: "olive oil" },
          { q: 1, u: "", s: "b", t: ["yellow onion, finely diced", "yellow onions, finely diced"] },
          { q: 2, u: "", s: "b", t: ["garlic clove, minced", "garlic cloves, minced"] },
          { q: 1, u: "lb", s: "b", t: "cremini mushrooms, finely chopped" },
          { q: 1, u: "tbsp", s: "b", t: "fresh thyme leaves" },
          { q: 1, u: "tbsp", s: "b", t: "fresh rosemary, finely chopped" },
          { q: 1, u: "tbsp", s: "b", t: "tomato paste" },
          { q: 1, u: "tbsp", s: "b", t: "soy sauce or tamari" },
          { q: 0.25, u: "cup", s: "b", t: "dry red wine or vegetable broth" },
          { q: 1, u: "", s: "b", t: ["can (15 oz) lentils, rinsed and drained (or 1½ cups cooked)", "cans (15 oz each) lentils, rinsed and drained"] },
          { q: 0.5, u: "cup", s: "b", t: "walnuts, toasted and finely chopped" },
          { q: 0.75, u: "cup", s: "b", t: "panko or fresh breadcrumbs (vegan)" },
          { q: 2, u: "tbsp", s: "b", t: "ground flaxseed mixed with 5 tbsp water (a \"flax egg\")" },
          { q: 0.5, u: "tsp", s: "b", t: "salt" },
          { q: 0.25, u: "tsp", s: "b", t: "black pepper" },
          { q: 1, u: "", s: "b", t: ["sheet vegan puff pastry, thawed in the fridge", "sheets vegan puff pastry, thawed in the fridge"] },
          { q: 2, u: "tbsp", s: "b", t: "unsweetened plant milk mixed with 1 tsp maple syrup, for brushing" }
        ],
        steps: [
          "Stir the flaxseed and water together and set aside for 10 minutes to thicken.",
          "Heat the oil in a large skillet over medium heat. Cook the onion 5 minutes until soft, then the garlic for 30 seconds.",
          "Add the mushrooms and cook 10–12 minutes, stirring now and then, until all their liquid has cooked away and they're browned.",
          "Stir in the thyme, rosemary, tomato paste, soy sauce and wine. Cook 2 minutes until the pan is almost dry. Cool for 10 minutes.",
          "In a large bowl, lightly mash half the lentils. Add the rest of the lentils, the mushroom mixture, walnuts, breadcrumbs, flax egg, salt and pepper and mix well. Chill 30 minutes so it firms up.",
          "On a sheet of parchment, roll the pastry into a rectangle about 11 × 14 inches.",
          "Shape the filling into a firm log down the centre, about 3 inches wide, leaving 1 inch clear at each end.",
          "Fold the pastry over the filling, pressing the seam and ends to seal. Roll it seam-side down onto the parchment and slide it onto a baking sheet. Chill 15–20 minutes.",
          "Heat the oven to 400°F (200°C). Brush the pastry with the milk and maple glaze. Score a shallow criss-cross pattern on top and cut 2 small steam vents.",
          "Bake 40–45 minutes, until deeply golden, puffed and crisp underneath.",
          "Rest 10 minutes, then slice thickly with a serrated knife."
        ],
        tip: "Cook the mushrooms until they're truly dry. Moisture is the enemy of crisp pastry. You can make the filling the day before."
      },
      {
        id: "vgravy", course: "Main", name: "Rich Umami Vegan Gravy",
        prep: "15 min (includes soaking)", cook: "15 min", yieldText: f => `about ${fmtCups(3 * f)}`,
        ing: [
          { q: 0.5, u: "oz", t: "dried porcini mushrooms, soaked 10 minutes in 1 cup hot water" },
          { q: 3, u: "tbsp", t: "plant-based butter or olive oil" },
          { q: 1, u: "", t: ["shallot, finely minced", "shallots, finely minced"] },
          { q: 0.25, u: "cup", t: "all-purpose flour" },
          { q: 2, u: "cup", t: "vegetable broth" },
          { q: 2, u: "tbsp", t: "soy sauce or tamari" },
          { q: 1, u: "tbsp", t: "nutritional yeast" },
          { q: 1, u: "tsp", t: "Dijon mustard" },
          { q: 1, u: "tsp", t: "fresh thyme leaves" },
          { q: null, u: "", s: "n", t: "Black pepper, to taste" }
        ],
        steps: [
          "Lift the porcini out of their soaking water and chop finely. Save the soaking liquid, leaving any grit at the bottom of the bowl.",
          "Melt the butter in a saucepan over medium heat. Cook the shallot and porcini for 3 minutes.",
          "Whisk in the flour and cook 2 minutes, until golden and nutty.",
          "Slowly whisk in the porcini liquid and the broth until smooth.",
          "Add the soy sauce, nutritional yeast, Dijon and thyme. Simmer 8–10 minutes, whisking, until thick and glossy.",
          "Season with pepper. Strain for a silky gravy, or leave the mushrooms in for a rustic one."
        ],
        tip: "The porcini and soy sauce give deep, savoury flavour. Make it the day before and rewarm, adding a splash of broth if it's too thick."
      },
      {
        id: "vstuffing", course: "Sides", name: "Wild Mushroom Stuffing with Sage & Rosemary",
        prep: "25 min, plus drying the bread", cook: "40 min", yieldText: f => servings(f),
        note: (f, p) => (p.dishes > 1 ? `For this many guests, use ${p.dishes} baking dishes (9×13-inch). ` : "") + "Check that the bread is vegan (most crusty loaves are).",
        ing: [
          { q: 1, u: "lb", t: "crusty bread, cut into 1-inch cubes and dried" },
          { q: 0.33, u: "cup", t: "plant-based butter, plus extra for the dish" },
          { q: 1, u: "", t: ["yellow onion, diced", "yellow onions, diced"] },
          { q: 3, u: "", t: ["celery rib, diced", "celery ribs, diced"] },
          { q: 12, u: "oz", t: "mixed wild mushrooms (shiitake, oyster, cremini), chopped" },
          { q: 3, u: "", t: ["garlic clove, minced", "garlic cloves, minced"] },
          { q: 2, u: "tbsp", t: "fresh sage, chopped" },
          { q: 1, u: "tbsp", t: "fresh rosemary, finely chopped" },
          { q: 0.25, u: "cup", t: "fresh parsley, chopped" },
          { q: 1, u: "tsp", t: "salt" },
          { q: 0.5, u: "tsp", t: "black pepper" },
          { q: 2.75, u: "cup", t: "vegetable broth (a little more or less as needed)" }
        ],
        steps: [
          "Dry the bread cubes overnight on a baking sheet, or bake at 300°F for 15–20 minutes.",
          "Melt the butter in a large skillet. Cook the onion and celery 8 minutes until soft.",
          "Add the mushrooms and cook 8 minutes until golden, then the garlic, sage and rosemary for 1 minute.",
          "Toss the bread with the mushroom mixture, parsley, salt and pepper.",
          "Pour in most of the broth and toss until evenly moist, adding more if it seems dry.",
          "Spread in a buttered baking dish and cover with foil.",
          "Bake at 400°F for 25 minutes covered, then 15 minutes uncovered, until golden and crisp on top."
        ],
        tip: "Assemble it up to 4 hours ahead. It holds well, covered, while the Wellington bakes, and gets a quick rewarm at the end."
      },
      {
        id: "maplesprouts", course: "Sides", name: "Maple Roasted Brussels Sprouts with Toasted Hazelnuts",
        prep: "10 min", cook: "25–30 min", yieldText: f => servings(f),
        ing: [
          { q: 2, u: "lb", t: "Brussels sprouts, trimmed and halved" },
          { q: 3, u: "tbsp", t: "olive oil" },
          { q: 1, u: "tsp", t: "salt" },
          { q: 0.5, u: "tsp", t: "black pepper" },
          { q: 3, u: "tbsp", t: "pure maple syrup" },
          { q: 0.5, u: "cup", t: "hazelnuts, toasted and roughly chopped" }
        ],
        steps: [
          "Toss the sprouts with the oil, salt and pepper and spread cut side down on a large baking sheet.",
          "Roast at 400°F for 20 minutes, until the undersides are deep golden.",
          "Drizzle with the maple syrup, toss, and roast 5–8 minutes more until glossy and caramelized.",
          "Scatter with the toasted hazelnuts."
        ],
        tip: "Add the maple syrup near the end. If it goes in at the start, it burns."
      },
      {
        id: "veganpecan", course: "Dessert", name: "Deep-Dish Vegan Pecan Pie",
        prep: "30 min, plus chilling", cook: "about 55 min", rest: "cool 3 hours, then chill overnight",
        yieldText: (f, p) => p.pies > 1 ? `${p.pies} deep-dish pies (8 slices each)` : "one 9-inch deep-dish pie (8 slices)",
        note: (f, p) => p.pies > 1 ? `Amounts below are for all ${p.pies} pies together.` : "",
        ing: [
          { head: "Crust" },
          { q: 1.25, u: "cup", s: "p", t: "all-purpose flour" },
          { q: 1, u: "tbsp", s: "p", t: "granulated sugar" },
          { q: 0.25, u: "tsp", s: "p", t: "salt" },
          { q: 0.5, u: "cup", s: "p", t: "cold plant-based butter (block style), cubed" },
          { q: 3.5, u: "tbsp", s: "p", t: "ice water, about" },
          { head: "Filling" },
          { q: 1, u: "", s: "p", t: ["can (13.5 oz) full-fat coconut milk", "cans (13.5 oz each) full-fat coconut milk"] },
          { q: 0.75, u: "cup", s: "p", t: "pure maple syrup" },
          { q: 0.5, u: "cup", s: "p", t: "packed brown sugar" },
          { q: 0.25, u: "cup", s: "p", t: "cornstarch" },
          { q: 0.5, u: "tsp", s: "p", t: "salt" },
          { q: 2, u: "tbsp", s: "p", t: "plant-based butter, melted" },
          { q: 2, u: "tsp", s: "p", t: "vanilla extract" },
          { q: 0.5, u: "tsp", s: "p", t: "ground cinnamon" },
          { q: 2, u: "cup", s: "p", t: "pecan halves (1½ cups chopped for the filling, ½ cup whole for the top)" }
        ],
        steps: [
          "Crust: mix the flour, sugar and salt. Cut in the cold butter until it looks like coarse crumbs. Sprinkle in ice water a spoonful at a time until the dough holds together. Shape into a disk, wrap and chill 1 hour.",
          "Roll into a 12-inch circle and fit into a 9-inch deep-dish pie plate. Crimp the edges and chill 30 minutes.",
          "Heat the oven to 400°F (200°C). Line the crust with parchment and pie weights. Bake 15 minutes, remove the weights, and bake 5 minutes more until pale golden.",
          "Lower the oven to 350°F (175°C).",
          "Filling: whisk the coconut milk, maple syrup, brown sugar, cornstarch and salt in a saucepan. Cook over medium heat, whisking constantly, 5–7 minutes, until it bubbles and thickens like pudding.",
          "Off the heat, stir in the melted butter, vanilla, cinnamon and the chopped pecans.",
          "Pour into the crust and arrange the whole pecan halves on top.",
          "Bake 30–35 minutes, until bubbling at the edges and the centre looks set with only a slight wobble. Cover the crust edges with foil if they brown too fast.",
          "Cool 3 hours at room temperature, then chill overnight so the custard sets for clean slices."
        ],
        tip: "This pie must be made the day before. Serve it chilled or at room temperature, with whipped coconut cream if you like."
      }
    ],

    timeline(p) {
      const out = [];
      const add = (m, icon, text, alarm = true, main = false) => out.push({ m, icon, text, alarm, main });
      add(-180, "🔪", "Chop all the vegetables and herbs. Make the Wellington filling if you didn't yesterday");
      add(-150, "🥟", `Shape the Wellington${p.batches > 1 ? "s" : ""} in puff pastry and chill`);
      add(-120, "🍞", "Assemble the stuffing in its baking dish");
      add(-110, "🔥", "Heat the oven to 400°F");
      add(-95, "🍞", "Stuffing into the oven, covered (25 minutes)");
      add(-80, "🧀", "Take the cheese ball out of the fridge. Chill the spritzer mixers");
      add(-70, "🍞", "Uncover the stuffing (15 minutes more)");
      add(-60, "🥂", "Cheese ball, crackers, eggnog and spritzers out for arriving guests");
      add(-58, "🥟", "Brush the Wellington with glaze, score the top and cut steam vents");
      add(-55, "🥟", `Wellington${p.batches > 1 ? "s" : ""} into the oven on the middle rack (40–45 minutes). Stuffing out, keep covered`, true, true);
      add(-40, "🥬", "Toss the Brussels sprouts with oil, salt and pepper");
      add(-35, "🥬", "Sprouts into the oven on the top rack (20 minutes)");
      add(-20, "🫗", "Rewarm the umami gravy");
      add(-15, "🍁", "Drizzle maple syrup over the sprouts, toss and return to the oven");
      add(-10, "🥟", "Wellington out to rest 10 minutes. Stuffing back in to rewarm");
      add(-8, "🥬", "Sprouts out. Scatter with toasted hazelnuts");
      add(-3, "🔪", "Stuffing out. Slice the Wellington with a serrated knife");
      add(0, "🍽️", "Dinner is served!");
      add(45, "🥧", "Slice the pecan pie and pour the eggnog");
      return out.sort((a, b) => a.m - b.m);
    },
    ahead(p) {
      return [
        [2, 18, "🥜", "Soak the cashews overnight (for the cheese ball and eggnog). Thaw the puff pastry in the fridge"],
        [1, 10, "📋", `Prep day: blend the eggnog, make the cheese ball, bake ${p.pies > 1 ? p.pies + " pecan pies so they set" : "the pecan pie so it sets"} overnight, make the gravy, dry the bread cubes, toast the nuts and make the Wellington filling`]
      ];
    },

    shop(f, p) {
      const B = p.batches, P = p.pies, up = (x, step = 1) => Math.ceil(x / step - 1e-9) * step, n = x => Math.max(1, Math.ceil(x - 1e-9));
      const pl = (k, one, many) => k > 1 ? many : one;
      const onions = B + n(f), garlic = n((2 * B + 3 * f + f) / 10), cremini = B, wild = up(0.75 * f, 0.5), celery = n(3 * f / 8), spr = up(2 * f, 0.5);
      const thyme = n((2 * B + f) / 8), rose = n((B + f + 2) / 6), sage = n(2 * f / 8), lemons = n(f), limes = n(4 * f), pom = n(f / 2.5), shallots = n(f);
      const cashews = n(2.5 * f / 2.7), pist = n(f / 1.1), hazel = n(f / 0.8), walnuts = n(0.5 * B), pecans = 2 * P / 2 > 0 ? n(2 * P / 2) : 1;
      const lentils = B, bread = n(f), crackers = n(f), porcini = n(f);
      const mapleCups = 0.5 * f + 0.19 * f + 0.75 * P + 0.05 * B, maple = n(mapleCups / 2.25);
      const brothCups = 2.75 * f + 2 * f + 0.25 * B, broth = n(brothCups / 3.8);
      const pastry = n(B / 2), butterTbsp = 5.3 * f + 3 * f + 10 * P, butter = n(butterTbsp / 32);
      const milk = n((3 * f + 0.15 * B) / 8), coconut = n(f) + P;
      const spirit = n(1.5 * f / 3.2), cj = n(2 * f / 8), gb = n(3 * f / 6);
      return [
        ["Produce", [
          [`${fmtNum(cremini)} lb`, "cremini mushrooms (for the Wellington)", cremini * 5],
          [`${fmtNum(wild)} lb`, "mixed wild mushrooms (for the stuffing)", wild * 8],
          [`${onions}`, "yellow onions", onions * 0.6],
          [`${shallots}`, pl(shallots, "shallot", "shallots"), shallots * 0.75],
          [`${garlic}`, pl(garlic, "head garlic", "heads garlic"), garlic],
          [`${celery}`, pl(celery, "bunch celery", "bunches celery"), celery * 3.5],
          [`${fmtNum(spr)} lb`, "Brussels sprouts", spr * 4],
          [`${thyme}`, pl(thyme, "bunch fresh thyme", "bunches fresh thyme"), thyme * 3],
          [`${rose}`, pl(rose, "bunch fresh rosemary (extra for the spritzers)", "bunches fresh rosemary (extra for the spritzers)"), rose * 3],
          [`${sage}`, pl(sage, "bunch fresh sage", "bunches fresh sage"), sage * 3],
          ["1", "bunch fresh parsley", 2],
          ["1", "bunch fresh chives", 3],
          [`${pom}`, pl(pom, "pomegranate", "pomegranates"), pom * 3],
          [`${lemons}`, pl(lemons, "lemon", "lemons"), lemons],
          [`${limes}`, "limes", limes * 0.6],
          ["", "apples, for serving with the cheese ball (optional)", null]
        ]],
        ["Pantry & Baking", [
          [`${cashews} × 400 g`, pl(cashews, "bag raw cashews", "bags raw cashews"), cashews * 12],
          [`${pist} × 150 g`, pl(pist, "bag shelled pistachios", "bags shelled pistachios"), pist * 7],
          [`${hazel} × 100 g`, pl(hazel, "bag hazelnuts", "bags hazelnuts"), hazel * 5],
          [`${walnuts} × 100 g`, pl(walnuts, "bag walnuts", "bags walnuts"), walnuts * 4],
          [`${pecans} × 200 g`, pl(pecans, "bag pecan halves", "bags pecan halves"), pecans * 7],
          [`${lentils} × 15 oz`, pl(lentils, "can lentils", "cans lentils"), lentils * 2],
          [`${maple} × 540 ml`, pl(maple, "bottle pure maple syrup", "bottles pure maple syrup"), maple * 12],
          [`${broth} × 900 ml`, `vegetable broth (about ${Math.ceil(brothCups)} cups)`, broth * 3.5],
          [`${porcini} × 14 g`, pl(porcini, "pack dried porcini mushrooms", "packs dried porcini mushrooms"), porcini * 5],
          [`${bread} × 1 lb`, pl(bread, "loaf crusty bread (vegan)", "loaves crusty bread (vegan)"), bread * 4.5],
          [`${crackers}`, pl(crackers, "box vegan crackers", "boxes vegan crackers"), crackers * 4],
          ["1", "bag nutritional yeast", 8],
          ["1", "bag ground flaxseed", 5],
          ["1", "small jar refined coconut oil", 7],
          ["1", "box panko breadcrumbs (vegan)", 3],
          ["1", "tube tomato paste", 2],
          ["", "all-purpose flour, cornstarch, granulated and brown sugar", null],
          ["", "soy sauce or tamari, Dijon mustard, olive oil, vanilla extract", null],
          ["", "ground cinnamon, nutmeg, cloves, turmeric (optional), salt, black pepper", null]
        ]],
        ["Refrigerated & Frozen", [
          [`${pastry}`, pl(pastry, "box vegan puff pastry (2 sheets), frozen", "boxes vegan puff pastry (2 sheets each), frozen"), pastry * 6],
          [`${butter} × 454 g`, pl(butter, "block plant-based butter", "blocks plant-based butter"), butter * 7],
          [`${milk} × 1.89 L`, pl(milk, "carton unsweetened almond or oat milk", "cartons unsweetened almond or oat milk"), milk * 5],
          [`${coconut} × 400 ml`, pl(coconut, "can full-fat coconut milk", "cans full-fat coconut milk"), coconut * 2.5]
        ]],
        ["Spirits & Beverages", [
          [`${cj} × 1.89 L`, pl(cj, "jug cranberry juice", "jugs cranberry juice"), cj * 5],
          [`${gb} × 4-pack`, "ginger beer", gb * 6],
          [`${spirit} × 750 ml`, "gin or vodka (optional)", null],
          ["", "optional: vegan Pinot Noir or Gamay, dry Riesling, dark rum for the eggnog", null]
        ]],
        ["Kitchen Supplies", [
          ["", "high-speed blender (for the cheese ball and eggnog)", null],
          ["", "2 large baking sheets, parchment paper, plastic wrap, foil", null],
          [`${p.dishes}`, pl(p.dishes, "baking dish (9×13-inch)", "baking dishes (9×13-inch)"), null],
          [`${P}`, pl(P, "deep-dish pie plate (9-inch)", "deep-dish pie plates (9-inch)"), null],
          ["", "pie weights or dried beans, serrated knife", null]
        ]]
      ];
    }
  };

  // sizes for the vegan dinner: 1 Wellington per 6 guests, 1 pie per 8
  function veganPlan(guests) {
    const g = Math.min(20, Math.max(1, guests | 0)), f = g / 8, batches = Math.max(1, Math.ceil(g / 6));
    return { g, f, icon: "🌱", mainLabel: batches > 1 ? `${batches} Wellingtons` : "1 Wellington", verb: "bakes", bigNote: "100% plant-based: no meat, dairy or eggs.",
      roast: 45, roastText: "40–45 min", rest: 10, batches, pies: Math.max(1, Math.ceil(g / 8)), dishes: Math.max(1, Math.ceil(f - 0.25)) };
  }

  // 🌱 DIETARY ADD-ONS: vegan, gluten-free, dairy-free dishes for 1–5 people.
  // They can be added to any dinner (they join its timeline, alarms and shopping list) or used on their own.
  const squash = {
    id: "squash", tab: "dietary", addon: true,
    name: "Stuffed Holiday Squash", icon: "🎃",
    blurb: "Acorn squash filled with wild rice, mushrooms, pecans and cranberries. Vegan, gluten-free and dairy-free.",
    tags: "Vegan · Gluten-free · Dairy-free",
    menu: [["Dietary add-on", ["Stuffed Holiday Squash (vegan, gluten-free, dairy-free)"]]],
    drinks: [["Pairing", "A Pinot Noir, an oaked Chardonnay or sparkling apple cider. All love the nutty, earthy squash."]],
    recipes: [{
      id: "squash", course: "Dietary add-on", name: "Stuffed Holiday Squash",
      prep: "20 min", cook: "50 min", yieldText: (f, p) => p.g + (p.g === 1 ? " serving" : " servings"),
      note: () => "Vegan, gluten-free and dairy-free. Check that the vegetable broth is labelled gluten-free.",
      ing: [
        { head: "Squash" },
        { q: 2, u: "", up: true, t: ["acorn squash, halved and seeds removed", "acorn squashes, halved and seeds removed"] },
        { q: 2, u: "tbsp", t: "olive oil" },
        { q: null, u: "", s: "n", t: "Salt and black pepper" },
        { head: "Filling" },
        { q: 1, u: "cup", t: "wild rice blend" },
        { q: 2, u: "cup", t: "low-sodium vegetable broth" },
        { q: 1, u: "tbsp", t: "olive oil" },
        { q: 1, u: "cup", t: "yellow onion, diced" },
        { q: 1, u: "cup", t: "celery, diced" },
        { q: 1.5, u: "cup", t: "cremini mushrooms, chopped" },
        { q: 3, u: "", t: ["garlic clove, minced", "garlic cloves, minced"] },
        { q: 1, u: "tbsp", t: "fresh thyme leaves" },
        { q: 1, u: "tbsp", t: "fresh rosemary, finely chopped" },
        { q: 0.5, u: "cup", t: "pecans, chopped" },
        { q: 0.5, u: "cup", t: "dried cranberries" },
        { q: null, u: "", s: "n", t: "Salt, black pepper and fresh herbs to garnish" }
      ],
      steps: [
        "Roast the squash: heat the oven to 400°F (200°C). Slice a thin sliver off the bottom of each squash half so it sits flat. Brush with olive oil, season with salt and pepper, and roast flesh-side down on parchment for 35–40 minutes, until tender.",
        "Cook the rice: bring the wild rice and broth to a boil in a saucepan, cover, turn the heat to low and simmer 40–45 minutes, until tender.",
        "Make the stuffing: heat the oil in a skillet over medium heat. Cook the onion and celery 5 minutes. Add the mushrooms, garlic, thyme and rosemary and cook 5–7 minutes.",
        "Off the heat, stir in the cooked rice, pecans and cranberries. Season to taste.",
        "Flip the squash halves flesh-side up and spoon in the stuffing.",
        "Bake 10 minutes more to crisp the top. Garnish with fresh herbs."
      ],
      tip: "Sharing the oven with a main dinner? Squash is happy anywhere from 375°F to 425°F. Just check it a few minutes early or late. Half a squash per person makes a generous main."
    }],
    timeline(p) {
      return [
        { m: -75, icon: "🎃", text: "Stuffed squash: start the wild rice (simmers 40–45 minutes)", alarm: true },
        { m: -60, icon: "🎃", text: "Stuffed squash: squash halves into the oven, cut side down (400°F, 35–40 minutes)", alarm: true },
        { m: -28, icon: "🎃", text: "Stuffed squash: sauté the mushroom and herb stuffing", alarm: true },
        { m: -20, icon: "🎃", text: "Stuffed squash: flip, fill with stuffing and bake 10 minutes more", alarm: true },
        { m: -10, icon: "🎃", text: "Stuffed squash out. Garnish with fresh herbs", alarm: true },
        { m: 0, icon: "🍽️", text: "Dinner is served!", alarm: false }
      ];
    },
    ahead: () => [],
    shop(f, p) {
      const n = x => Math.max(1, Math.ceil(x - 1e-9)), up = (x, s = 1) => Math.ceil(x / s - 1e-9) * s, pl = (k, a, b) => k > 1 ? b : a;
      const sq = Math.ceil(2 * f - 1e-9), on = n(f), mush = up(0.5 * f, 0.5), rice = n(f / 2.5), broth = n(2 * f / 3.8), pec = n(f / 2), cran = n(f / 3);
      return [
        ["Produce", [
          [`${sq}`, pl(sq, "acorn squash", "acorn squashes"), sq * 2.5],
          [`${on}`, pl(on, "yellow onion", "yellow onions"), on * 0.6],
          ["1", "bunch celery", 3.5],
          [`${fmtNum(mush)} lb`, "cremini mushrooms", mush * 5],
          ["1", "head garlic", 1],
          ["1", "bunch fresh rosemary", 3],
          ["1", "bunch fresh thyme", 3]
        ]],
        ["Pantry", [
          [`${rice} × 454 g`, pl(rice, "bag wild rice blend", "bags wild rice blend"), rice * 7],
          [`${broth} × 900 ml`, "low-sodium vegetable broth (gluten-free)", broth * 3.5],
          [`${pec} × 100 g`, pl(pec, "bag pecans", "bags pecans"), pec * 4],
          [`${cran}`, pl(cran, "bag dried cranberries", "bags dried cranberries"), cran * 4],
          ["", "olive oil, salt, black pepper", null]
        ]]
      ];
    }
  };

  const shepherd = {
    id: "shepherd", tab: "dietary", addon: true,
    name: "Mushroom & Lentil Shepherd's Pie", icon: "🥧",
    blurb: "Savoury lentil and vegetable filling under a golden mashed potato crust. Vegan, gluten-free and dairy-free.",
    tags: "Vegan · Gluten-free · Dairy-free",
    menu: [["Dietary add-on", ["Mushroom & Lentil Shepherd's Pie (vegan, gluten-free, dairy-free)"]]],
    drinks: [["Pairing", "A Côtes du Rhône, a Merlot or a dark, non-alcoholic ginger beer."]],
    recipes: [{
      id: "shepherd", course: "Dietary add-on", name: "Mushroom & Lentil Shepherd's Pie",
      prep: "25 min", cook: "45 min", rest: "10 min", yieldText: (f, p) => p.g + (p.g === 1 ? " serving" : " servings"),
      note: (f, p) => (p.g <= 2 ? "For 1–2 people, bake it in individual ramekins (one each). " : p.g <= 3 ? "Use an 8×8-inch dish, or individual ramekins. " : "Use an 8×8 or 9×11-inch baking dish, or individual ramekins. ") + "Vegan, gluten-free and dairy-free. Check that the tamari and broth are labelled gluten-free.",
      ing: [
        { head: "Potato topping" },
        { q: 2.5, u: "lb", t: "Russet or Yukon Gold potatoes, peeled and chopped" },
        { q: 2, u: "tbsp", t: "olive oil" },
        { q: 0.33, u: "cup", t: "unsweetened plant milk (almond, oat or soy)" },
        { q: 0.5, u: "tsp", t: "garlic powder" },
        { q: null, u: "", s: "n", t: "Salt and black pepper" },
        { head: "Filling" },
        { q: 1, u: "tbsp", t: "olive oil" },
        { q: 1, u: "cup", t: "yellow onion, diced" },
        { q: 1, u: "cup", t: "carrots, diced" },
        { q: 2, u: "cup", t: "cremini mushrooms, chopped small" },
        { q: 4, u: "", t: ["garlic clove, minced", "garlic cloves, minced"] },
        { q: 1, u: "", up: true, t: ["can (15 oz) brown or green lentils, drained and rinsed", "cans (15 oz each) brown or green lentils, drained and rinsed"] },
        { q: 1, u: "cup", t: "frozen peas" },
        { q: 1, u: "cup", t: "frozen corn" },
        { q: 2, u: "tbsp", t: "tomato paste" },
        { q: 2, u: "tbsp", t: "gluten-free tamari or soy sauce" },
        { q: 1, u: "tbsp", t: "balsamic vinegar" },
        { q: 1, u: "tbsp", t: "fresh thyme leaves" },
        { q: 1, u: "tsp", t: "fresh rosemary, finely chopped" },
        { q: 2, u: "cup", t: "low-sodium vegetable broth" },
        { q: 1, u: "tbsp", t: "cornstarch dissolved in 2 tbsp water" },
        { q: null, u: "", s: "n", t: "Salt and black pepper, to taste" }
      ],
      steps: [
        "Potato topping: boil the potatoes in salted water for 15–20 minutes, until fork-tender. Drain, then mash with the olive oil, plant milk, garlic powder, salt and pepper until smooth. Cover and set aside.",
        "Heat the oven to 400°F (200°C). Heat the oil in a skillet over medium heat and cook the onion and carrots 6–8 minutes. Add the mushrooms and garlic and cook 5 minutes. Stir in the tomato paste and cook 1 minute.",
        "Pour in the broth, tamari, balsamic, thyme and rosemary. Stir in the lentils, peas and corn and simmer 5 minutes.",
        "Stir in the cornstarch mixture and keep stirring 1–2 minutes, until the gravy thickens. Remove from the heat.",
        "Pour the filling into the baking dish (or divide among ramekins). Spread the mashed potatoes over the top, sealing them to the edges, and drag a fork across to make ridges.",
        "Bake 20–25 minutes (15–20 for ramekins), until bubbling and the potato peaks are golden brown.",
        "Let it cool 10 minutes before serving."
      ],
      tip: "Make-ahead: assemble it a day ahead, cover and refrigerate; add 10 minutes to the baking time. To freeze, wrap the unbaked pie well for up to 3 months, thaw overnight in the fridge and bake as above."
    }],
    timeline(p) {
      return [
        { m: -80, icon: "🥧", text: "Shepherd's pie: boil the potatoes (15–20 minutes)", alarm: true },
        { m: -60, icon: "🥧", text: "Shepherd's pie: mash the potatoes, then make the lentil filling", alarm: true },
        { m: -40, icon: "🥧", text: "Shepherd's pie: assemble and bake at 400°F (20–25 min; ramekins 15–20 min)", alarm: true },
        { m: -15, icon: "🥧", text: "Shepherd's pie out to cool for 10 minutes", alarm: true },
        { m: 0, icon: "🍽️", text: "Dinner is served!", alarm: false }
      ];
    },
    ahead: () => [],
    shop(f, p) {
      const n = x => Math.max(1, Math.ceil(x - 1e-9)), up = (x, s = 1) => Math.ceil(x / s - 1e-9) * s, pl = (k, a, b) => k > 1 ? b : a;
      const pot = up(2.5 * f, 0.5), on = n(f), car = n(2 * f), mush = up(0.5 * f, 0.5), lent = n(f), broth = n(2 * f / 3.8);
      return [
        ["Produce", [
          [`${fmtNum(pot)} lb`, "Russet or Yukon Gold potatoes", pot * 1.1],
          [`${on}`, pl(on, "yellow onion", "yellow onions"), on * 0.6],
          [`${car}`, pl(car, "carrot", "carrots"), car * 0.4],
          [`${fmtNum(mush)} lb`, "cremini mushrooms", mush * 5],
          ["1", "head garlic", 1],
          ["1", "bunch fresh thyme", 3],
          ["1", "bunch fresh rosemary", 3]
        ]],
        ["Pantry & Freezer", [
          [`${lent} × 15 oz`, pl(lent, "can brown or green lentils", "cans brown or green lentils"), lent * 2],
          ["1", "bag frozen peas", 3],
          ["1", "bag frozen corn", 3],
          [`${broth} × 900 ml`, "low-sodium vegetable broth (gluten-free)", broth * 3.5],
          ["1", "tube tomato paste", 2],
          ["1", "bottle gluten-free tamari", 5],
          ["1", "small carton unsweetened plant milk", 3],
          ["", "balsamic vinegar, olive oil, cornstarch, garlic powder, salt, black pepper", null]
        ]]
      ];
    }
  };
  const mousse = {
    id: "mousse", tab: "dietary", addon: true,
    name: "Dark Chocolate Avocado Mousse with Raspberry Coulis", icon: "🍫",
    blurb: "Silky, decadent chocolate mousse with a bright raspberry sauce. Vegan, gluten-free and dairy-free.",
    tags: "Vegan · Gluten-free · Dairy-free dessert",
    menu: [["Dietary dessert", ["Dark Chocolate Avocado Mousse with Raspberry Coulis (vegan, gluten-free, dairy-free)"]]],
    drinks: [["Pairing", "A ruby port, a glass of sparkling rosé, or an espresso."]],
    recipes: [{
      id: "mousse", course: "Dietary dessert", name: "Dark Chocolate Avocado Mousse with Raspberry Coulis",
      prep: "20 min", cook: "7 min (coulis)", rest: "chill at least 2 hours", yieldText: (f, p) => p.g + (p.g === 1 ? " serving" : " servings"),
      note: () => "Vegan, gluten-free and dairy-free. Check that the chocolate chips are labelled dairy-free.",
      ing: [
        { head: "Chocolate mousse" },
        { q: 3, u: "", up: true, t: ["large ripe Hass avocado, pitted and scooped", "large ripe Hass avocados, pitted and scooped"] },
        { q: 0.5, u: "cup", t: "unsweetened high-quality cocoa powder" },
        { q: 0.33, u: "cup", t: "dairy-free dark chocolate chips, melted and slightly cooled" },
        { q: 0.5, u: "cup", t: "canned coconut cream (or the thick top of a chilled can of full-fat coconut milk)" },
        { q: 0.5, u: "cup", t: "pure maple syrup (or agave nectar)" },
        { q: 2, u: "tsp", t: "pure vanilla extract" },
        { q: null, u: "", s: "n", t: "Pinch of sea salt" },
        { head: "Raspberry coulis" },
        { q: 12, u: "oz", t: "fresh or frozen raspberries" },
        { q: 0.25, u: "cup", t: "coconut sugar or regular sugar" },
        { q: 1, u: "tbsp", t: "fresh lemon juice" },
        { q: 1, u: "tbsp", t: "water" },
        { q: null, u: "", s: "n", t: "Fresh raspberries or mint sprigs, to garnish" }
      ],
      steps: [
        "Melt the chocolate chips in a heatproof bowl set over a pot of simmering water (or microwave in 15-second bursts, stirring between each). Let it cool slightly.",
        "In a high-speed blender or food processor, blend the avocados, cocoa, melted chocolate, coconut cream, maple syrup, vanilla and salt on high for 2–3 minutes. Scrape down the sides as needed, until completely smooth and silky with no green flecks.",
        "Divide among dessert glasses or ramekins. Cover and refrigerate at least 2 hours to set and let the flavour deepen.",
        "Coulis: simmer the raspberries, sugar, lemon juice and water in a small saucepan over medium heat for 5–7 minutes, until the berries break down.",
        "Press through a fine sieve to remove the seeds. Cool completely, then refrigerate.",
        "Just before serving, pour a generous layer of chilled coulis over each mousse and garnish with a fresh raspberry or a sprig of mint."
      ],
      tip: "Choosing avocados: buy them firm 3–4 days ahead and ripen on the counter. They're ready when they yield to gentle pressure and the little stem cap flicks off to show green underneath (brown means overripe). The mousse keeps up to 2 days, covered tightly, in the fridge."
    }],
    timeline(p) {
      return [
        { m: -240, icon: "🍫", text: "Chocolate mousse: melt the chocolate, blend the mousse and chill (at least 2 hours)", alarm: true },
        { m: -220, icon: "🍫", text: "Chocolate mousse: make the raspberry coulis, then cool and chill it", alarm: true },
        { m: 40, icon: "🍫", text: "Chocolate mousse: pour on the coulis, garnish and serve", alarm: true }
      ];
    },
    ahead: () => [],
    shop(f, p) {
      const n = x => Math.max(1, Math.ceil(x - 1e-9)), pl = (k, a, b) => k > 1 ? b : a;
      const av = Math.ceil(3 * f - 1e-9), rasp = n(12 * f / 21), choc = n(0.33 * f / 1.6), coco = n(0.5 * f / 1.6), maple = n(0.5 * f / 2.25);
      return [
        ["Produce", [
          [`${av}`, pl(av, "large ripe Hass avocado", "large ripe Hass avocados"), av * 1.75],
          ["1", "lemon", 1],
          ["1", "container fresh raspberries, to garnish (optional)", 5],
          ["", "fresh mint, to garnish (optional)", null]
        ]],
        ["Pantry & Frozen", [
          [`${rasp} × 600 g`, pl(rasp, "bag frozen raspberries (or fresh)", "bags frozen raspberries (or fresh)"), rasp * 6],
          ["1", "tin unsweetened cocoa powder", 6],
          [`${choc}`, pl(choc, "bag dairy-free dark chocolate chips", "bags dairy-free dark chocolate chips"), choc * 6],
          [`${coco} × 160 ml`, pl(coco, "can coconut cream", "cans coconut cream"), coco * 3],
          [`${maple} × 540 ml`, pl(maple, "bottle pure maple syrup", "bottles pure maple syrup"), maple * 12],
          ["", "vanilla extract, coconut or regular sugar, sea salt", null]
        ]]
      ];
    }
  };
  const vgravyAddon = {
    id: "vgravy2", tab: "dietary", addon: true,
    name: "Rich Savory Vegan Gravy", icon: "🫗",
    blurb: "Glossy, ultra-savoury gravy for potatoes, stuffing and every vegan dish. Vegan, gluten-free and dairy-free.",
    tags: "Vegan · Gluten-free · Dairy-free sauce",
    menu: [["Dietary sauce", ["Rich Savory Vegan Gravy (vegan, gluten-free, dairy-free)"]]],
    drinks: [["Goes with", "Mashed potatoes, stuffing, the Stuffed Holiday Squash, the Shepherd's Pie or the Vegan Wellington."]],
    recipes: [{
      id: "vgravy2", course: "Dietary sauce", name: "Rich Savory Vegan Gravy",
      prep: "5 min", cook: "15 min", yieldText: (f, p) => `about ${fmtCups(2 * f)} (${p.g} ${p.g === 1 ? "serving" : "servings"})`,
      note: () => "Vegan, gluten-free and dairy-free. Check that the tamari, broth and Dijon are labelled gluten-free.",
      ing: [
        { head: "Base & aromatics" },
        { q: 2, u: "tbsp", t: "olive oil (or vegan butter)" },
        { q: 0.5, u: "cup", t: "yellow onion or shallot, finely minced" },
        { q: 2, u: "", t: ["garlic clove, minced", "garlic cloves, minced"] },
        { q: 0.5, u: "cup", t: "cremini or button mushrooms, finely chopped (optional, for depth)" },
        { q: 0.5, u: "tsp", t: "dried thyme" },
        { q: 0.5, u: "tsp", t: "dried rosemary" },
        { head: "Liquid" },
        { q: 2, u: "cup", t: "low-sodium vegetable broth" },
        { q: 2, u: "tbsp", t: "gluten-free tamari or soy sauce" },
        { q: 1, u: "tbsp", t: "balsamic vinegar" },
        { q: 1, u: "tsp", t: "Dijon mustard" },
        { q: 1, u: "tsp", t: "pure maple syrup" },
        { head: "Thickener" },
        { q: 2, u: "tbsp", t: "cornstarch (or arrowroot) dissolved in an equal amount of cold water" },
        { q: null, u: "", s: "n", t: "Salt and black pepper, to taste" }
      ],
      steps: [
        "Heat the oil in a small saucepan over medium heat. Cook the onion (and mushrooms, if using) for 5–6 minutes until soft and lightly browned. Stir in the garlic, thyme and rosemary and cook 1 minute until fragrant.",
        "Pour in the broth, tamari, balsamic, Dijon and maple syrup and whisk well to break up the mustard. Bring to a gentle boil, then simmer on low for 5 minutes.",
        "Stir the cornstarch mixture, then slowly pour it into the simmering gravy, whisking constantly. Cook 2–3 minutes as it bubbles, thickens and turns glossy. Season with salt and pepper.",
        "For a perfectly velvety gravy, pour it through a fine-mesh strainer into a warm gravy boat."
      ],
      tip: "Flavour boosts: add a splash of dry white wine after the aromatics and let it bubble away, or whisk in 1 tbsp nutritional yeast for extra depth. Make-ahead: it keeps 3 days in the fridge. Rewarm gently with a splash of broth, and whisk in a little more cornstarch mixture if it thins."
    }],
    timeline(p) {
      return [
        { m: -20, icon: "🫗", text: "Vegan gravy: sauté the onion, garlic and herbs", alarm: true },
        { m: -12, icon: "🫗", text: "Vegan gravy: simmer, thicken with the cornstarch, strain and keep warm", alarm: true }
      ];
    },
    ahead: () => [],
    shop(f, p) {
      const n = x => Math.max(1, Math.ceil(x - 1e-9)), broth = n(2 * f / 3.8);
      return [
        ["Produce", [
          ["1", "small yellow onion or shallot", 0.75],
          ["1", "head garlic", 1],
          ["1 × 227 g", "pack cremini mushrooms (optional)", 3]
        ]],
        ["Pantry", [
          [`${broth} × 900 ml`, "low-sodium vegetable broth (gluten-free)", broth * 3.5],
          ["1", "bottle gluten-free tamari", 5],
          ["", "balsamic vinegar, Dijon mustard, maple syrup, cornstarch or arrowroot", null],
          ["", "dried thyme, dried rosemary, olive oil, salt, black pepper", null]
        ]]
      ];
    }
  };
  // the vegan menu's pecan pie, also offered on its own as a dietary dessert (with a gluten-free crust)
  const pieBase = vegan.recipes.find(r => r.id === "veganpecan");
  const pecanAddon = {
    id: "pecanpie", tab: "dietary", addon: true,
    name: "Deep-Dish Vegan Pecan Pie", icon: "🥧",
    blurb: "Custard-style maple and coconut pecan pie in a gluten-free crust. Vegan, gluten-free and dairy-free.",
    tags: "Vegan · Gluten-free · Dairy-free dessert",
    menu: [["Dietary dessert", ["Deep-Dish Vegan Pecan Pie (gluten-free crust)"]]],
    drinks: [["Pairing", "Coffee, chai, or a small glass of bourbon or tawny port."]],
    recipes: [Object.assign({}, pieBase, {
      id: "pecanpie", course: "Dietary dessert", name: "Deep-Dish Vegan Pecan Pie (gluten-free crust)",
      yieldText: () => "one 9-inch deep-dish pie (8 slices): plenty for up to 5, with seconds",
      note: () => "Vegan, gluten-free and dairy-free. The crust uses a 1:1 gluten-free flour blend. Gluten-free dough is more delicate, so roll it between two sheets of parchment and press any cracks together in the pie plate. Check that the brown sugar and plant-based butter are labelled vegan.",
      ing: pieBase.ing.map(i => i.t === "all-purpose flour" ? Object.assign({}, i, { t: "gluten-free 1:1 flour blend (with xanthan gum)" }) : i)
    })],
    timeline(p) { return [{ m: 45, icon: "🥧", text: "Pecan pie: slice and serve (chilled or at room temperature)", alarm: true }]; },
    ahead: () => [[1, 11, "🥧", "Pecan pie: bake it today so it can set in the fridge overnight"]],
    shop(f, p) {
      return [
        ["Pantry & Baking", [
          ["1 × 200 g", "bag pecan halves", 7],
          ["1 × 540 ml", "bottle pure maple syrup", 12],
          ["1 bag", "gluten-free 1:1 flour blend (with xanthan gum)", 7],
          ["", "brown sugar, granulated sugar, cornstarch, vanilla extract, ground cinnamon, salt", null]
        ]],
        ["Refrigerated", [
          ["1 × 454 g", "block plant-based butter", 7],
          ["1 × 400 ml", "can full-fat coconut milk", 2.5]
        ]],
        ["Kitchen Supplies", [["1", "deep-dish pie plate (9-inch), parchment paper, pie weights or dried beans", null]]]
      ];
    }
  };
  // 🥂 NEW YEAR'S EVE PARTY: built from the Appetizer Ideas list (window.NOEL_APPS)
  // What to buy for one batch of each appetizer: [bites per batch, [[item, price CAD], ...]]  (null price = pantry staple)
  // ✏️ Prices are rough Canadian estimates. Buyers can change any price.
  const APP_SHOP = {
    "Caprese Skewers": [24, [["pint cherry tomatoes", 5], ["tub (200 g) mini bocconcini", 6], ["bunch fresh basil", 3], ["balsamic glaze, skewers", null]]],
    "Deviled Eggs": [24, [["dozen eggs", 5.4], ["bunch fresh chives", 3], ["mayonnaise, Dijon, paprika", null]]],
    "Baked Brie": [16, [["wheel (200 g) brie", 8], ["sheet puff pastry (half a box)", 3], ["jar jam or honey", 5], ["box crackers", 4]]],
    "Bacon-Wrapped Dates": [24, [["box (454 g) Medjool dates", 9], ["pack bacon", 7], ["toothpicks", null]]],
    "Slow Cooker Meatballs": [40, [["bag (907 g) frozen meatballs", 14], ["bottle chili sauce", 4], ["jar grape jelly", 4]]],
    "Pinwheel Roll-Ups": [32, [["large tortillas (half a pack)", 2], ["tub (250 g) cream cheese", 4.5], ["pack (175 g) deli turkey or ham", 5], ["handful baby spinach", 2]]],
    "Stuffed Mushrooms": [24, [["lb large white mushrooms (about 24)", 4], ["half tub cream cheese", 2.5], ["wedge (50 g) Parmesan", 2], ["garlic, breadcrumbs", null]]],
    "Shrimp Cocktail": [30, [["lb cooked shrimp, tails on", 22], ["jar cocktail sauce", 4], ["lemon", 1]]],
    "Bruschetta": [24, [["baguette", 3.5], ["Roma tomatoes (4)", 3], ["bunch fresh basil", 3], ["garlic, olive oil", null]]],
    "Charcuterie Board": [30, [["pack (200 g) cured meats", 10], ["cheeses (400 g total)", 14], ["box crackers", 4], ["lb grapes", 4], ["jar olives", 5], ["bag (100 g) nuts", 4]]],
    "Pigs in a Blanket": [24, [["pack (375 g) cocktail sausages", 6], ["tube crescent dough or puff pastry", 4]]],
    "Cucumber Bites": [24, [["English cucumber", 1.5], ["tub (227 g) herb & garlic cream cheese", 5], ["bunch fresh dill", 3]]],
    "Antipasto Skewers": [24, [["pack (150 g) salami", 5], ["pack (350 g) fresh cheese tortellini", 6], ["jar olives", 5], ["jar roasted red peppers", 4]]],
    "Smoked Salmon Crostini": [24, [["baguette", 3.5], ["pack (113 g) smoked salmon", 8], ["half tub cream cheese", 2.5], ["jar capers", 4]]],
    "Mini Quiches": [24, [["box (24) frozen mini tart shells", 6], ["half dozen eggs", 2.7], ["cup milk or cream", 2], ["bag (170 g) shredded cheese", 4], ["bacon bits or spinach", 3]]],
    "Spinach Artichoke Dip": [24, [["box (300 g) frozen spinach", 3], ["can artichoke hearts", 3], ["tub (250 g) cream cheese", 4.5], ["bag shredded mozzarella", 4], ["wedge Parmesan", 3], ["bag tortilla chips or a baguette", 5]]],
    "Garlic Herb Cheese Ball": [24, [["tubs (250 g) cream cheese (2)", 9], ["bag shredded cheddar", 4], ["bag (100 g) pecans", 4], ["box crackers", 4]]],
    "Veggie Cups": [24, [["tub (500 g) hummus or ranch", 6], ["lb carrots", 1.5], ["bunch celery", 3], ["English cucumber", 1.5], ["bell peppers (2)", 4], ["pack clear cups", 4]]],
    "Prosciutto & Melon": [24, [["cantaloupe", 4], ["pack (100 g) prosciutto", 6]]],
    "Mini Sliders": [24, [["pack (12) slider buns", 5], ["1½ lb ground beef", 9], ["pack cheese slices", 4], ["pickles, ketchup, mustard", null]]],
    "Crispy Cauliflower Bites": [30, [["head cauliflower", 4], ["bottle buffalo or sweet chili sauce", 4], ["flour, panko", null]]],
    "Spanakopita Triangles": [24, [["box (24) frozen spanakopita", 12]]],
    "Seven-Layer Dip": [24, [["can refried beans", 2.5], ["tub (400 g) guacamole", 6], ["tub (500 ml) sour cream", 3.5], ["jar salsa", 4], ["bag shredded cheese", 4], ["tomato, green onions, olives", 4], ["bags tortilla chips (2)", 8]]],
    "Honey Garlic Wings": [24, [["2 lb chicken wings", 14], ["honey, garlic, soy sauce", 2]]],
    "Party Snack Mix": [40, [["box cereal squares", 5], ["bag pretzels", 4], ["can (300 g) mixed nuts", 8], ["butter, seasoning", null]]],
    "Chocolate-Dipped Strawberries": [24, [["2 lb large strawberries", 8], ["bar (200 g) chocolate", 5]]],
    "Mini Cheesecake Bites": [24, [["tubs (250 g) cream cheese (2)", 9], ["box graham crumbs", 4], ["container berries", 5], ["sugar, eggs, vanilla", 1]]],
    "Cookie Platter": [30, [["box assorted cookies (or Christmas leftovers)", 8]]],
    "Cheese Fondue": [30, [["wedge (200 g) Gruyère", 9], ["block (200 g) Swiss or Emmental", 7], ["bottle dry white wine (or apple cider)", 12], ["crusty loaf, cubed", 4.5], ["apples (2)", 2.4], ["broccoli or baby potatoes, for dipping", 4], ["garlic, cornstarch, lemon", null]]],
    "Chocolate Fondue": [30, [["bars (300 g) chocolate", 7], ["carton (250 ml) whipping cream", 3], ["lb strawberries", 5], ["bag marshmallows", 3], ["bag pretzels", 3]]],
    "Sparkling Punch": [10, [["bottles (750 ml) sparkling juice (2)", 8], ["carton (1 L) cranberry juice", 4], ["oranges (2)", 2]]]
  };
  const DRINK_APPS = ["Sparkling Punch"];
  // 📖 Appetizer recipes: ingredients and steps for ONE batch (batch sizes are in APP_SHOP above)
  const APP_RECIPES = {"Caprese Skewers": {"ing": ["1 pint cherry tomatoes", "1 tub (200 g) mini bocconcini", "1 bunch fresh basil", "24 small skewers or toothpicks", "balsamic glaze", "salt and pepper"], "steps": ["Rinse the tomatoes and basil and pat dry. Drain the bocconcini.", "Thread one tomato, one basil leaf and one bocconcini onto each skewer.", "Chill on a tray, covered, up to 6 hours.", "Drizzle with balsamic glaze, add a pinch of salt and pepper, and serve."]}, "Deviled Eggs": {"ing": ["12 large eggs", "1/3 cup mayonnaise", "2 tsp Dijon mustard", "1 tsp white vinegar", "salt and pepper", "paprika and chives to finish"], "steps": ["Cover the eggs with cold water, bring to a boil, then turn off the heat, cover and let stand 12 minutes. Cool in ice water and peel.", "Halve the eggs lengthwise. Pop the yolks into a bowl.", "Mash the yolks with the mayonnaise, mustard, vinegar, salt and pepper until smooth.", "Spoon or pipe the filling back into the whites. Dust with paprika and chives. Keep chilled until serving."]}, "Baked Brie": {"ing": ["1 wheel (200 g) brie", "1 sheet puff pastry, thawed", "3 tbsp cranberry sauce or jam", "2 tbsp chopped pecans", "1 egg, beaten", "crackers or sliced baguette to serve"], "steps": ["Heat the oven to 400°F (200°C). Line a baking sheet with parchment.", "Roll the pastry slightly and place the brie in the middle. Top with the cranberry sauce and pecans.", "Fold the pastry up over the brie and press the edges to seal. Turn it seam-side down and brush with egg.", "Bake 20 to 25 minutes until deep golden. Rest 10 minutes, then serve warm with crackers."]}, "Bacon-Wrapped Dates": {"ing": ["1 box (454 g) Medjool dates, pitted", "12 slices bacon, cut in half", "24 almonds (optional)", "toothpicks"], "steps": ["Heat the oven to 400°F (200°C) and line a baking sheet with foil and a rack if you have one.", "Tuck an almond into each date, if using. Wrap each in half a slice of bacon and secure with a toothpick.", "Bake 20 to 25 minutes, turning once, until the bacon is crisp.", "Drain on paper towel and serve warm."]}, "Slow Cooker Meatballs": {"ing": ["1 bag (907 g) frozen meatballs", "1 bottle (340 g) chili sauce or BBQ sauce", "1 jar (250 g) grape jelly (or cranberry sauce)", "toothpicks"], "steps": ["Put the frozen meatballs in the slow cooker.", "Stir the sauce and jelly together and pour over the meatballs.", "Cook on low 4 hours (or high 2 hours), stirring once or twice.", "Switch to warm for the party and serve with toothpicks."]}, "Pinwheel Roll-Ups": {"ing": ["4 large tortillas", "1 tub (250 g) cream cheese, softened", "1 pack (about 150 g) sliced deli ham or turkey", "1 cup shredded cheddar", "1 cup baby spinach", "1/2 tsp garlic powder"], "steps": ["Mix the cream cheese with the garlic powder and spread it over each tortilla, right to the edges.", "Layer the ham, cheddar and spinach over the top.", "Roll up tightly and wrap in plastic. Chill at least 1 hour (up to the night before).", "Trim the ends and slice each roll into about 8 rounds. Serve cold."]}, "Stuffed Mushrooms": {"ing": ["24 large white mushrooms", "1 tub (250 g) cream cheese, softened", "1/2 cup grated parmesan", "2 cloves garlic, minced", "1/2 cup breadcrumbs", "2 tbsp olive oil", "parsley, salt and pepper"], "steps": ["Heat the oven to 375°F (190°C). Wipe the mushrooms and pop out the stems. Finely chop the stems.", "Cook the stems and garlic in the olive oil for 3 minutes. Cool slightly, then stir into the cream cheese with the parmesan, breadcrumbs, salt and pepper.", "Fill each cap with a heaped spoonful and set on a lined baking sheet.", "Bake 18 to 22 minutes until golden. Sprinkle with parsley and serve warm."]}, "Shrimp Cocktail": {"ing": ["2 lb cooked shrimp, tails on, thawed", "1 cup ketchup", "3 tbsp prepared horseradish", "1 tbsp lemon juice plus lemon wedges", "a few dashes hot sauce", "ice"], "steps": ["Pat the shrimp dry and chill on a platter.", "Stir the ketchup, horseradish, lemon juice and hot sauce together for the cocktail sauce. Taste and add more horseradish for heat.", "Put the sauce in a small bowl in the middle of a platter over ice. Arrange the shrimp and lemon wedges around it."]}, "Bruschetta": {"ing": ["1 baguette", "6 Roma tomatoes", "2 cloves garlic", "1/4 cup fresh basil, chopped", "3 tbsp olive oil plus extra for brushing", "1 tbsp balsamic vinegar", "salt and pepper"], "steps": ["Heat the oven to 400°F (200°C). Slice the baguette into 24 rounds, brush with olive oil and toast 8 minutes until crisp.", "Dice the tomatoes. Mix with the minced garlic, basil, olive oil, balsamic, salt and pepper. Let stand 10 minutes.", "Spoon onto the toasts just before serving so they stay crisp."]}, "Charcuterie Board": {"ing": ["1 pack (200 g) cured meats", "400 g cheese in 3 different styles", "1 box crackers", "1 lb grapes", "1 jar olives", "1 bag (100 g) nuts", "honey or jam"], "steps": ["Set the cheeses on a large board or tray first, with space between them. Take them out of the fridge an hour before serving.", "Fold or fan the cured meats in small piles around the cheese.", "Fill the gaps with grapes, olives and nuts. Put crackers in a basket or along one edge.", "Add a small bowl of honey or jam and a knife for each cheese."]}, "Pigs in a Blanket": {"ing": ["1 pack (375 g) cocktail sausages", "1 tube (about 235 g) crescent roll dough, or 1 sheet puff pastry", "1 egg, beaten", "mustard for dipping"], "steps": ["Heat the oven to 375°F (190°C) and line a baking sheet.", "Cut the dough into strips about 1 inch wide and 3 inches long. Roll each sausage in a strip.", "Place seam-side down on the sheet and brush with egg.", "Bake 12 to 15 minutes until puffed and golden. Serve warm with mustard."]}, "Cucumber Bites": {"ing": ["1 English cucumber", "1 tub (200 g) herbed cream cheese", "1 pack (about 100 g) smoked salmon (optional)", "fresh dill", "salt and pepper"], "steps": ["Cut the cucumber into 24 thick rounds, about 1/2 inch.", "Spoon or pipe a little cream cheese on each round.", "Top with a small piece of smoked salmon, a sprig of dill and a pinch of pepper.", "Chill until serving, up to 2 hours."]}, "Antipasto Skewers": {"ing": ["1 pack (150 g) salami", "1 tub (200 g) mini bocconcini", "1 jar marinated artichoke hearts", "1 jar pitted olives", "1 pint cherry tomatoes", "24 skewers or toothpicks"], "steps": ["Drain the artichokes, olives and bocconcini well.", "Fold a slice of salami in half twice. Thread onto a skewer with a tomato, bocconcini, an artichoke piece and an olive.", "Lay the skewers on a tray, cover and chill up to 6 hours. Serve cold."]}, "Smoked Salmon Crostini": {"ing": ["1 baguette", "1 pack (about 150 g) smoked salmon", "1 tub (200 g) cream cheese", "1 tbsp capers", "fresh dill", "lemon wedges", "olive oil"], "steps": ["Heat the oven to 400°F (200°C). Slice the baguette into 24 rounds, brush with olive oil and toast about 8 minutes.", "Stir a squeeze of lemon and a little chopped dill into the cream cheese.", "Spread each crostini with cream cheese. Top with a fold of salmon, a few capers and a dill sprig.", "Assemble within an hour of serving."]}, "Mini Quiches": {"ing": ["1 box (24) frozen mini tart shells", "4 large eggs", "1/2 cup cream or milk", "1 cup shredded cheese", "1/2 cup cooked bacon bits or chopped spinach", "salt and pepper"], "steps": ["Heat the oven to 350°F (175°C). Set the tart shells on a baking sheet.", "Whisk the eggs, cream, salt and pepper. Put a pinch of cheese and bacon (or spinach) in each shell.", "Pour in the egg mixture, filling each shell about 3/4 full.", "Bake 18 to 22 minutes until set and lightly golden. Serve warm."]}, "Spinach Artichoke Dip": {"ing": ["1 box (300 g) frozen chopped spinach, thawed and squeezed dry", "1 can (398 ml) artichoke hearts, drained and chopped", "1 tub (250 g) cream cheese, softened", "1/2 cup sour cream", "1 cup shredded mozzarella", "1/2 cup grated parmesan", "2 cloves garlic, minced", "tortilla chips or sliced baguette"], "steps": ["Heat the oven to 375°F (190°C).", "Mix everything except half of the mozzarella in a bowl. Spread in a baking dish and top with the rest of the mozzarella.", "Bake 25 minutes until bubbling and golden at the edges.", "Serve hot with chips or bread."]}, "Garlic Herb Cheese Ball": {"ing": ["2 tubs (250 g each) cream cheese, softened", "1 cup shredded cheddar", "2 cloves garlic, minced", "2 tbsp chopped chives or parsley", "1 cup chopped nuts or extra herbs for coating", "crackers"], "steps": ["Beat the cream cheese, cheddar, garlic and herbs until well mixed.", "Shape into a ball on plastic wrap and chill at least 2 hours (up to 2 days).", "Roll in the chopped nuts or herbs just before serving. Serve with crackers."]}, "Veggie Cups": {"ing": ["1 tub (500 g) hummus or ranch dip", "3 carrots", "1 English cucumber", "1 bell pepper", "1 pint cherry tomatoes", "24 small clear cups"], "steps": ["Spoon about 2 tablespoons of dip into the bottom of each cup.", "Cut the carrots, cucumber and pepper into sticks about 4 inches long.", "Stand the vegetables upright in the cups, with a tomato or two on top.", "Chill until serving, up to 4 hours."]}, "Prosciutto & Melon": {"ing": ["1 cantaloupe", "1 pack (about 100 g) prosciutto", "fresh mint (optional)", "24 toothpicks or small skewers", "black pepper"], "steps": ["Peel and seed the melon and cut it into 24 bite-sized wedges.", "Cut each prosciutto slice in half lengthwise. Wrap a strip around each wedge.", "Skewer, add a mint leaf and a twist of pepper. Serve chilled."]}, "Mini Sliders": {"ing": ["1 pack (12) slider buns", "1 lb ground beef (or chicken or turkey)", "6 slices cheese, halved", "2 tbsp butter, melted", "pickles, ketchup, mustard", "salt and pepper"], "steps": ["Heat the oven to 375°F (190°C). Season the meat with salt and pepper and press into a thin layer to match the bun size. Cook in a pan or the oven until done through, then cut into 12 pieces.", "Put the bottom buns in a baking dish. Add a piece of meat and half a slice of cheese to each. Add the bun tops.", "Brush with melted butter. Cover with foil and warm 10 minutes, then uncover 5 minutes.", "Serve warm with pickles and sauces on the side."]}, "Crispy Cauliflower Bites": {"ing": ["1 head cauliflower, cut into small florets", "1 cup flour", "1 cup milk (or plant milk)", "1 tsp garlic powder", "1 tsp salt", "1 cup panko breadcrumbs", "1/2 cup hot sauce or sweet chili sauce", "ranch or dipping sauce"], "steps": ["Heat the oven to 450°F (230°C) and grease a baking sheet.", "Whisk the flour, milk, garlic powder and salt into a batter. Dip the florets, let the excess drip off, then roll in panko.", "Bake 20 minutes, turning once, until crisp.", "Toss with the sauce and bake 5 more minutes. Serve hot with dip."]}, "Spanakopita Triangles": {"ing": ["1 box (24) frozen spanakopita triangles", "olive oil spray or melted butter", "tzatziki for dipping"], "steps": ["Heat the oven to 375°F (190°C). Place the frozen triangles on a lined baking sheet, not touching.", "Spray or brush lightly with oil.", "Bake 20 to 25 minutes (check the box) until golden and crisp. Serve warm with tzatziki."]}, "Seven-Layer Dip": {"ing": ["1 can (398 ml) refried beans", "1 cup sour cream", "1 cup guacamole", "1 cup salsa", "1 cup shredded cheddar", "1 small tomato, diced", "1/4 cup sliced green onions or olives", "tortilla chips"], "steps": ["Spread the refried beans in the bottom of a 9×13 dish or a clear bowl.", "Layer on the sour cream, guacamole and salsa. Sprinkle with cheese.", "Top with the tomato and green onions or olives.", "Chill at least 1 hour. Serve with chips."]}, "Honey Garlic Wings": {"ing": ["2 lb chicken wings (split)", "1/2 cup honey", "1/4 cup soy sauce", "3 cloves garlic, minced", "1 tbsp cornstarch", "1 tsp baking powder", "salt and pepper"], "steps": ["Heat the oven to 425°F (220°C). Pat the wings very dry. Toss with salt, pepper and baking powder.", "Bake on a rack over a baking sheet for 40 to 45 minutes, turning once, until crisp.", "Meanwhile simmer the honey, soy sauce and garlic 3 minutes. Stir the cornstarch with 1 tbsp water, add to the pan and cook until glossy.", "Toss the hot wings in the sauce and serve."]}, "Party Snack Mix": {"ing": ["4 cups cereal squares", "2 cups mini pretzels", "1 cup mixed nuts", "1/3 cup melted butter", "2 tbsp Worcestershire sauce", "1 tsp garlic powder", "1 tsp seasoned salt"], "steps": ["Heat the oven to 250°F (120°C).", "Stir the butter, Worcestershire, garlic powder and salt together. Toss with the cereal, pretzels and nuts in a large roasting pan.", "Bake 45 minutes, stirring every 15 minutes. Cool completely. Store airtight up to a week."]}, "Chocolate-Dipped Strawberries": {"ing": ["2 lb large strawberries, washed and dried well", "300 g semi-sweet chocolate chips or chopped chocolate", "1 tsp coconut oil or shortening", "sprinkles or white chocolate to finish"], "steps": ["Line a tray with parchment. Make sure the berries are completely dry.", "Melt the chocolate with the coconut oil in 30-second bursts in the microwave, stirring until smooth.", "Hold each berry by the stem, dip about two thirds in the chocolate and let the extra drip off.", "Set on the parchment, add sprinkles, and chill 20 minutes. Best eaten the same day."]}, "Mini Cheesecake Bites": {"ing": ["2 tubs (250 g each) cream cheese, softened", "1/2 cup sugar", "2 eggs", "1 tsp vanilla", "1 cup graham cracker crumbs", "3 tbsp melted butter", "jam or fruit to top"], "steps": ["Heat the oven to 325°F (160°C). Line a 24-cup mini muffin tin with liners.", "Mix the crumbs and butter and press a spoonful into each cup.", "Beat the cream cheese, sugar, eggs and vanilla until smooth. Divide among the cups.", "Bake 15 to 18 minutes until just set. Cool, then chill 2 hours. Top with jam or fruit."]}, "Cookie Platter": {"ing": ["1 box assorted cookies (or Christmas cookies)", "fresh berries or sliced fruit (optional)", "small paper liners"], "steps": ["Choose 3 or 4 kinds of cookies in different shapes and colours.", "Arrange in overlapping rows on a platter, with a few fruit pieces in the gaps.", "Add small liners for sticky or crumbly cookies. Cover with plastic until serving."]}, "Cheese Fondue": {"ing": ["1 wedge (200 g) Gruyère, grated", "1 wedge (200 g) Emmental or Swiss, grated", "1 clove garlic, halved", "1 cup dry white wine or apple juice", "1 tbsp cornstarch", "1 tbsp lemon juice", "nutmeg and pepper", "cubed bread, apples and vegetables to dip"], "steps": ["Rub the inside of the fondue pot or heavy saucepan with the cut garlic.", "Toss the cheese with the cornstarch. Warm the wine and lemon juice over medium heat until it just steams.", "Add the cheese a handful at a time, stirring until smooth. Season with nutmeg and pepper.", "Keep warm over a low flame and serve with dippers and long forks."]}, "Chocolate Fondue": {"ing": ["2 bars (150 g each) good chocolate, chopped", "3/4 cup cream", "1 tsp vanilla", "strawberries, bananas, marshmallows, pretzels and cubes of cake to dip"], "steps": ["Heat the cream in a saucepan or the fondue pot until it just steams. Do not boil.", "Remove from the heat, add the chocolate and let stand 1 minute, then stir until smooth. Stir in the vanilla.", "Keep warm over a low flame and serve with dippers and long forks."]}, "Sparkling Punch": {"ing": ["2 bottles (750 ml each) sparkling juice or ginger ale", "1 bottle (1 L) cranberry or pomegranate juice, chilled", "1 cup orange juice", "1 orange, sliced", "1 cup frozen cranberries", "ice"], "steps": ["Chill all the liquids well ahead.", "In a punch bowl or large jug, stir the cranberry and orange juice with the sliced orange and cranberries.", "Add the sparkling juice and ice just before serving so it stays fizzy. Ladle into glasses."]}};
  const NYE_DEFAULT = ["Charcuterie Board", "Slow Cooker Meatballs", "Spinach Artichoke Dip", "Caprese Skewers", "Pigs in a Blanket", "Chocolate-Dipped Strawberries", "Sparkling Punch"];
  const appRow = name => (window.NOEL_APPS || []).find(a => a[1] === name);

  function nyeDate() { const now = new Date(); let y = now.getFullYear(); if (now.getMonth() === 0 && now.getDate() <= 6) y--; return `${y}-12-31`; }
  function nyePartyPlan(guests, c = {}) {
    const g = Math.min(20, Math.max(1, guests | 0)), f = g / 8, mode = c.mode === "before" ? "before" : "meal";
    let names = (c.picks && c.picks.length ? c.picks : NYE_DEFAULT).filter(n => appRow(n));
    const food = names.filter(n => !DRINK_APPS.includes(n)), drinks = names.filter(n => DRINK_APPS.includes(n));
    const per = mode === "meal" ? 12 : 5, total = g * per, each = food.length ? Math.ceil(total / food.length) : 0;
    const items = food.map(n => { const [batch] = APP_SHOP[n] || [24]; return { name: n, row: appRow(n), pieces: each, batches: Math.max(1, Math.ceil(each / batch - 1e-9)) }; });
    const drinkItems = drinks.map(n => { const [batch] = APP_SHOP[n]; return { name: n, row: appRow(n), batches: Math.max(1, Math.ceil(g * 1.5 / batch - 1e-9)) }; });
    const [h, mi] = String(c.time || "20:00").split(":").map(Number), startMin = h * 60 + mi, toMidnight = startMin >= 360 ? 1440 - startMin : null;
    return { g, f, mode, items, drinkItems, total, each, toMidnight, pies: 1, dishes: 1,
      partySummary: `🥂 <b>${food.length} appetizers</b> · about <b>${total} bites</b> (${each} of each)${drinks.length ? " · " + drinks.join(", ") : ""}<br><small>${mode === "meal" ? "Appetizers are the meal: about 12 bites per guest through the night." : "Light bites before dinner: about 5 per guest."}${toMidnight ? ` Midnight is ${Math.floor(toMidnight / 60)}h${toMidnight % 60 ? " " + (toMidnight % 60) + "m" : ""} after the party starts.` : ""}</small>` };
  }
  // 🕯️ CHRISTMAS EVE: a cozy appetizer night (same appetizer engine, no midnight countdown)
  function eveDate() { const now = new Date(); let y = now.getFullYear(); if (now > new Date(y, 11, 24, 23, 59)) y++; return `${y}-12-24`; }
  const EVE_DEFAULT = ["Charcuterie Board", "Baked Brie", "Slow Cooker Meatballs", "Pigs in a Blanket", "Shrimp Cocktail", "Sparkling Punch"];
  function evePartyPlan(guests, c = {}) {
    const p = nyePartyPlan(guests, Object.assign({}, c, { picks: c.picks && c.picks.length ? c.picks : EVE_DEFAULT }));
    const food = p.items.length, drinks = p.drinkItems.map(i => i.name);
    p.toMidnight = null;
    p.partySummary = `🕯️ <b>${food} appetizers</b> · about <b>${p.total} bites</b> (${p.each} of each)${drinks.length ? " · " + drinks.join(", ") : ""}<br><small>${p.mode === "meal" ? "Appetizers are the meal: about 12 bites per guest through the evening." : "Light bites before dinner: about 5 per guest."}</small>`;
    return p;
  }
  const nyeparty = {
    id: "nyeparty", tab: "nye", party: true,
    name: "New Year's Eve Party", icon: "🥂",
    blurb: "Appetizer party with a midnight countdown.",
    defaultTime: "20:00", defaultDate: nyeDate,
    get menu() { return [["Your party menu", ["Pick your appetizers above"]]]; },
    menuFor(p) {
      return [["Appetizers", p.items.map(i => `${i.name} (${i.pieces} pieces)`)], ["Drinks", p.drinkItems.map(i => i.name).concat(["Midnight toast: sparkling wine and sparkling juice"])]];
    },
    drinks: [
      ["Midnight toast", "Plan one glass of bubbly per guest: a 750 ml bottle pours about 6 glasses. Have sparkling juice ready for kids and non-drinkers."],
      ["Through the night", "Sparkling Punch keeps it family-friendly. Add a sparkling wine for adults, and water for everyone."]
    ],
    recipesFor(p) {
      return p.items.concat(p.drinkItems).map(i => ({
        id: "app-" + i.name, course: DRINK_APPS.includes(i.name) ? "Drink" : (i.row[4].includes("sweet") ? "Sweet bite" : "Appetizer"), name: i.name,
        prep: i.row[5], cook: i.row[4].includes("warm") ? "served warm" : "no cooking needed",
        yieldText: () => i.pieces ? `about ${i.pieces} pieces (${i.batches} ${i.batches === 1 ? "batch" : "batches"})` : `${i.batches} ${i.batches === 1 ? "batch" : "batches"}`,
        ing: (APP_SHOP[i.name] || [0, []])[1].map(([n]) => ({ q: null, u: "", s: "n", t: (i.batches > 1 ? i.batches + " × " : "") + n })),
        steps: [i.row[2], "Make-ahead: " + i.row[3]], tip: ""
      }));
    },
    recipes: [],
    timeline(p) {
      const out = [], add = (m, icon, text, alarm = true) => out.push({ m, icon, text, alarm });
      const tag = t => p.items.filter(i => i.row[4].split(" ").includes(t)).map(i => i.name);
      const fondue = n => /Fondue/.test(n), hasP = n => p.items.some(i => i.name === n);
      const warm = tag("warm").filter(n => !fondue(n) && n !== "Slow Cooker Meatballs"), cold = p.items.filter(i => !i.row[4].includes("warm") && !i.row[4].includes("sweet")).map(i => i.name), sweet = tag("sweet");
      add(-180, "🧊", "Put the bubbly, juices and sparkling water in the fridge to chill");
      if (p.items.some(i => i.name === "Slow Cooker Meatballs")) add(-180, "🍝", "Slow cooker meatballs on low (3 hours)");
      if (cold.length) add(-90, "🥗", "Prep the cold bites: " + cold.join(", "));
      if (warm.length) add(-40, "🔥", "Oven on for the warm bites: " + warm.join(", "));
      add(-15, "🍽️", "Set out the platters, napkins and drinks");
      if (hasP("Cheese Fondue")) add(-10, "🫕", "Melt the cheese fondue and keep it warm over a low flame. Set out the dippers");
      add(0, "🎉", "Party time! Welcome your guests");
      add(60, "🎲", "Party games! Open New Year's Party Games on the New Year screen");
      if (warm.length) add(120, "🔥", "Refresh the platters with a second round of warm bites");
      if (p.toMidnight) {
        const M = p.toMidnight;
        add(M - 60, "📰", "Play the Year-in-Review quiz together");
        add(M - 45, "💫", "Everyone seals a wish for next year in the Wishes Jar");
        const sweetOut = sweet.filter(n => !fondue(n));
        if (sweetOut.length) add(M - 30, "🍓", "Set out the sweet bites: " + sweetOut.join(", "));
        if (hasP("Chocolate Fondue")) add(M - 35, "🍫", "Melt the chocolate fondue and set out the fruit, marshmallows and pretzels");
        add(M - 15, "🥂", "Pour the bubbly and sparkling juice. Hand out noisemakers");
        add(M - 2, "🎆", "Open the big countdown on the New Year screen!");
        add(M, "🎆", "HAPPY NEW YEAR!");
      }
      return out.sort((a, b) => a.m - b.m);
    },
    ahead(p) {
      const make = p.items.filter(i => i.row[4].includes("make")).map(i => i.name);
      return [[2, 11, "🛒", "Shop for the New Year's Eve party today (the list is in the Meal Planner)"]].concat(make.length ? [[1, 11, "📋", "Make ahead today: " + make.join(", ")]] : []);
    },
    shop(f, p) {
      const groups = p.items.concat(p.drinkItems).map(i => [`${i.row[0]} ${i.name}${i.pieces ? ` (${i.pieces} pieces)` : ""}`,
        (APP_SHOP[i.name] || [0, []])[1].map(([n, price]) => [price == null ? "" : String(i.batches), n, price == null ? null : price * i.batches])]);
      const bubbly = Math.ceil(p.g / 6);
      groups.push(["🥂 Midnight toast", [[String(bubbly), `bottle${bubbly > 1 ? "s" : ""} sparkling wine (750 ml, about 6 glasses each)`, bubbly * 16], [String(bubbly), `bottle${bubbly > 1 ? "s" : ""} sparkling juice, for kids and non-drinkers`, bubbly * 5], ["", "sparkling water and ice", null]]]);
      groups.push(["🎉 Party supplies", [["1", "pack noisemakers and party hats (optional)", 8], ["", "napkins, small plates, toothpicks and skewers", null]]]);
      return groups;
    }
  };
  const eveparty = Object.assign({}, nyeparty, {
    id: "eveparty", tab: "eve", party: true, eve: true,
    name: "Christmas Appetizer Night", icon: "🕯️",
    blurb: "Charcuterie board, baked brie, slow cooker meatballs, pigs in a blanket and shrimp cocktail.",
    defaultTime: "17:30", defaultDate: eveDate,
    menu: [["Your Christmas Eve menu", ["Pick your appetizers above"]]],
    menuFor(p) {
      return [["Appetizers", p.items.map(i => `${i.name} (${i.pieces} pieces)`)], ["Drinks", p.drinkItems.map(i => i.name).concat(["Hot cocoa bar", "Eggnog or mulled wine for the grown-ups"])]];
    },
    drinks: [
      ["Cozy drinks", "Set up a hot cocoa bar: cocoa, mini marshmallows, whipped cream and candy canes to stir."],
      ["For the grown-ups", "Eggnog, mulled wine or a sparkling punch. Keep water and juice out for everyone."]
    ],
    timeline(p) {
      const out = [], add = (m, icon, text, alarm = true) => out.push({ m, icon, text, alarm });
      const tag = t => p.items.filter(i => i.row[4].split(" ").includes(t)).map(i => i.name);
      const fondue = n => /Fondue/.test(n), hasP = n => p.items.some(i => i.name === n);
      const warm = tag("warm").filter(n => !fondue(n) && n !== "Slow Cooker Meatballs"), cold = p.items.filter(i => !i.row[4].includes("warm") && !i.row[4].includes("sweet")).map(i => i.name), sweet = tag("sweet");
      add(-180, "🧊", "Put the drinks in the fridge to chill");
      if (hasP("Slow Cooker Meatballs")) add(-180, "🍝", "Slow cooker meatballs on low (3 hours)");
      if (cold.length) add(-90, "🥗", "Prep the cold bites: " + cold.join(", "));
      if (warm.length) add(-40, "🔥", "Oven on for the warm bites: " + warm.join(", "));
      add(-15, "🍽️", "Set out the platters, napkins and drinks. Put on the Christmas music");
      if (hasP("Cheese Fondue")) add(-10, "🫕", "Melt the cheese fondue and keep it warm over a low flame. Set out the dippers");
      add(0, "🕯️", "Christmas Eve begins! Welcome everyone");
      add(60, "🎁", "Christmas Eve gift: everyone opens one present (new pajamas are a classic)");
      add(90, "🎬", "Christmas movie time. Make the hot cocoa");
      const sweetOut = sweet.filter(n => !fondue(n));
      if (sweetOut.length) add(120, "🍪", "Set out the sweet bites: " + sweetOut.join(", "));
      if (hasP("Chocolate Fondue")) add(115, "🍫", "Melt the chocolate fondue and set out the fruit, marshmallows and pretzels");
      add(165, "🎅", "Check where Santa is on the Santa Tracker");
      add(180, "📖", "Read 'Twas the Night Before Christmas together");
      add(200, "🛏️", "Little ones to bed. Santa only comes when everyone is asleep!");
      return out.sort((a, b) => a.m - b.m);
    },
    ahead(p) {
      const make = p.items.filter(i => i.row[4].includes("make")).map(i => i.name);
      return [[2, 11, "🛒", "Shop for Christmas Eve today (the list is in the Meal Planner)"]].concat(make.length ? [[1, 11, "📋", "Make ahead today: " + make.join(", ")]] : []);
    },
    shop(f, p) {
      const groups = p.items.concat(p.drinkItems).map(i => [`${i.row[0]} ${i.name}${i.pieces ? ` (${i.pieces} pieces)` : ""}`,
        (APP_SHOP[i.name] || [0, []])[1].map(([n, price]) => [price == null ? "" : String(i.batches), n, price == null ? null : price * i.batches])]);
      const tins = Math.max(1, Math.ceil(p.g / 10));
      groups.push(["☕ Hot cocoa bar", [[String(tins), `tin${tins > 1 ? "s" : ""} hot chocolate mix`, tins * 6], ["1", "bag mini marshmallows", 3], ["1", "can whipped cream", 4], ["1", "box candy canes", 3]]]);
      return groups;
    }
  });

  // 🦐 CHRISTMAS EVE SEAFOOD SUPPER (Feast of the Seven Fishes-inspired). Written for 8, scales 1–20.
  function seafoodPlan(guests) {
    const g = Math.min(20, Math.max(1, guests | 0)), f = g / 8;
    return { g, f, pies: 1, dishes: 1, pots: g > 10 ? 2 : 1 };
  }
  const seafood = {
    id: "seafood", tab: "eve", alsoTab: "elegant",   // 🎄 also offered with the Christmas Day dinners
    name: "Seafood Cioppino Supper", icon: "🦐",
    blurb: "A Christmas Eve favourite: seafood cioppino with garlic bread, a cranberry-rosemary spritz and vanilla bean panna cotta.",
    defaultTime: "18:00", defaultDate: eveDate,
    menu: [
      ["Main", ["Classic Seafood Cioppino", "Toasted Garlic Bread"]],
      ["Dessert", ["Vanilla Bean Panna Cotta with Raspberry Coulis"]],
      ["Drinks", ["Cranberry Rosemary Holiday Spritz"]]
    ],
    drinks: [
      ["With dinner", "A crisp white such as Pinot Grigio or Sauvignon Blanc (the same wine you cook with), or a dry sparkling wine."],
      ["Non-alcoholic", "The Cranberry Rosemary Spritz topped with sparkling water (recipe included)."],
      ["With dessert", "Coffee, or a small glass of Prosecco with the panna cotta."]
    ],
    recipes: [
      {
        id: "cioppino", course: "Main", name: "Classic Seafood Cioppino",
        prep: "20 min", cook: "30 min", yieldText: f => servings(f),
        note: (f, p) => p.pots > 1 ? "For this many guests, split it between 2 large pots (or use one very large stockpot)." : "Use a large Dutch oven or soup pot.",
        ing: [
          { q: 3, u: "tbsp", t: "unsalted butter" },
          { q: 3, u: "tbsp", t: "olive oil" },
          { q: 1, u: "", t: ["large fennel bulb, thinly sliced", "large fennel bulbs, thinly sliced"] },
          { q: 1, u: "", t: ["large yellow onion, chopped", "large yellow onions, chopped"] },
          { q: 6, u: "", t: ["garlic clove, minced", "garlic cloves, minced"] },
          { q: 0.33, u: "tsp", t: "red pepper flakes" },
          { q: 1.5, u: "cup", t: "dry white wine (Pinot Grigio or Sauvignon Blanc)" },
          { q: 1, u: "", t: ["can (28 oz) crushed tomatoes", "cans (28 oz) crushed tomatoes"] },
          { q: 2, u: "", t: ["can (14 oz) diced tomatoes", "cans (14 oz) diced tomatoes"] },
          { q: 4, u: "cup", t: "seafood stock or clam juice" },
          { q: 1.5, u: "lb", t: "firm white fish (cod or halibut), cut into 2-inch chunks" },
          { q: 1.5, u: "lb", t: "mussels, scrubbed and debearded" },
          { q: 0.75, u: "lb", t: "sea scallops" },
          { q: 1.5, u: "lb", t: "large shrimp, peeled and deveined" },
          { q: null, u: "", s: "n", t: "Kosher salt and black pepper, to taste" },
          { q: 0.5, u: "cup", t: "fresh flat-leaf parsley, chopped" }
        ],
        steps: [
          "Melt the butter with the olive oil in a large Dutch oven over medium heat. Add the fennel and onion and sauté for 7 minutes, until soft.",
          "Add the garlic and red pepper flakes and cook for 1 minute.",
          "Pour in the wine, scraping up any browned bits. Simmer until it reduces by half, about 5 minutes.",
          "Stir in the crushed tomatoes, diced tomatoes and stock. Bring to a boil, then turn the heat to low, cover and simmer for 15 minutes so the flavours marry.",
          "Season the broth with salt and pepper. Add the fish, mussels and scallops, cover and cook for 3 minutes.",
          "Add the shrimp, cover again and cook 3 minutes more, until the shrimp are pink and the mussels have opened. Throw away any mussels that stay closed.",
          "Sprinkle with parsley and serve right away in warm bowls, with the garlic bread for dipping."
        ],
        tip: "Make the broth (steps 1–4) earlier in the day and keep it in the fridge. At dinner time, bring it back to a simmer and the seafood is done in 6 minutes."
      },
      {
        id: "garlicbread", course: "Main", name: "Toasted Garlic Bread",
        prep: "5 min", cook: "5 min", yieldText: f => `${Math.max(1, Math.ceil(f - 1e-9))} ${Math.ceil(f - 1e-9) > 1 ? "loaves" : "loaf"}`,
        ing: [
          { q: 1, u: "", t: ["loaf crusty sourdough bread, sliced", "loaves crusty sourdough bread, sliced"] },
          { q: 4, u: "tbsp", t: "unsalted butter, softened" },
          { q: 2, u: "", t: ["garlic clove, finely grated", "garlic cloves, finely grated"] },
          { q: 1, u: "tbsp", t: "fresh parsley, finely chopped" }
        ],
        steps: [
          "Mash the butter, garlic and parsley together.",
          "Spread on the bread slices and lay them on a baking sheet.",
          "Toast under the broiler for 2–3 minutes, watching closely, until golden at the edges."
        ],
        tip: "Toast the bread while the shrimp cook, so everything is hot at the same time."
      },
      {
        id: "pannacotta", course: "Dessert", name: "Vanilla Bean Panna Cotta with Raspberry Coulis",
        prep: "15 min", cook: "5 min", rest: "chill at least 4 hours", yieldText: f => `${Math.round(8 * f)} small glasses or ramekins`,
        ing: [
          { q: 3.75, u: "tsp", t: "unflavoured gelatin powder (one envelope holds about 2½ tsp)" },
          { q: 5, u: "tbsp", t: "cold water" },
          { q: 3, u: "cup", t: "heavy cream" },
          { q: 1.5, u: "cup", t: "whole milk" },
          { q: 0.75, u: "cup", t: "granulated sugar" },
          { q: 1.5, u: "", t: ["vanilla bean, split (or 3 tsp vanilla bean paste)", "vanilla beans, split (or vanilla bean paste)"] },
          { head: "Raspberry coulis" },
          { q: 15, u: "oz", t: "frozen raspberries" },
          { q: 3, u: "tbsp", t: "water" },
          { q: 1.5, u: "tbsp", t: "granulated sugar" }
        ],
        steps: [
          "Sprinkle the gelatin over the cold water in a small bowl and let it sit 5 minutes to soften.",
          "In a saucepan, combine the cream, milk and sugar. Scrape in the vanilla seeds and add the pod. Warm over medium heat just until bubbles form around the edges. Do not boil.",
          "Take it off the heat and remove the pod. Stir in the softened gelatin until completely dissolved.",
          "Pour into small glasses or ramekins and refrigerate at least 4 hours, until set.",
          "For the coulis, simmer the raspberries with the water and sugar for 5 minutes. Blend, then press through a sieve to remove the seeds. Chill.",
          "Just before serving, spoon the coulis over each panna cotta."
        ],
        tip: "Panna cotta is happiest made the day before. Cover the glasses and they'll keep perfectly for 2 days."
      },
      {
        id: "spritz", course: "Drinks", name: "Cranberry Rosemary Holiday Spritz",
        prep: "10 min", cook: "10 min, plus cooling", yieldText: f => `${Math.round(8 * f)} drinks`,
        ing: [
          { head: "Cranberry-rosemary syrup" },
          { q: 1, u: "cup", t: "fresh cranberries, plus extra to garnish" },
          { q: 0.5, u: "cup", t: "granulated sugar" },
          { q: 0.5, u: "cup", t: "water" },
          { q: 2, u: "", t: ["sprig fresh rosemary, plus extra to garnish", "sprigs fresh rosemary, plus extra to garnish"] },
          { head: "To serve" },
          { q: 2, u: "", t: ["lime", "limes"] },
          { q: 6, u: "cup", t: "sparkling water, club soda or Prosecco" },
          { q: null, u: "", s: "n", t: "Ice" }
        ],
        steps: [
          "Combine the cranberries, sugar, water and rosemary in a small saucepan.",
          "Bring to a simmer over medium heat, lightly mashing the cranberries as they burst. Simmer 5 minutes.",
          "Let it cool completely, then strain through a fine sieve and refrigerate.",
          "To serve, fill glasses with ice. Add 2 tbsp syrup and a squeeze of lime.",
          "Top with sparkling water for a mocktail, or Prosecco for grown-ups. Garnish with a rosemary sprig and a few cranberries."
        ],
        tip: "Set out the syrup, limes and both toppers and let guests make their own, mocktail or cocktail."
      }
    ],
    timeline(p) {
      const out = [], add = (m, icon, text, alarm = true, main = false) => out.push({ m, icon, text, alarm, main });
      add(-300, "🍮", "Make the panna cotta (15 min), pour into glasses and chill for 4 hours");
      add(-240, "🍒", "Simmer the cranberry-rosemary syrup (10 min), then let it cool");
      add(-180, "🧊", "Chill the sparkling water and Prosecco");
      add(-120, "🍒", "Strain the syrup and put it in the fridge");
      add(-60, "🦪", "Scrub and debeard the mussels. Throw away any that are cracked or stay open when tapped");
      add(-45, "🥬", "Start the broth: sauté the fennel, onion and garlic (10 min)");
      add(-35, "🍷", "Add the wine and let it reduce by half (5 min)");
      add(-30, "🍅", "Add the tomatoes and stock. Cover and simmer 15 minutes");
      add(-25, "🍓", "Make the raspberry coulis (5 min), then blend and strain");
      add(-15, "🥖", "Make the garlic butter and spread it on the bread");
      add(-10, "🐟", "Broth back to a gentle simmer. Add the fish, scallops and mussels. Cover for 3 minutes", true, true);
      add(-7, "🦐", "Add the shrimp. Cover for 3 more minutes. Garlic bread under the broiler");
      add(-4, "🥂", "Pour the spritzes: ice, syrup, a squeeze of lime, then the bubbles");
      add(0, "🍽️", "Dinner is served! Ladle the cioppino and pass the garlic bread");
      add(45, "🍮", "Spoon the coulis over the panna cotta and serve dessert");
      return out.sort((a, b) => a.m - b.m);
    },
    ahead(p) {
      return [
        [2, 11, "🛒", "Shop for the pantry items, dairy and produce today (the list is in the Meal Planner)"],
        [0, 10, "🐟", "Pick up the fresh seafood this morning and keep it in the coldest part of the fridge"]
      ];
    },
    shop(f, p) {
      const up = (x, step = 1) => Math.ceil(x / step - 1e-9) * step, n = x => Math.max(1, Math.ceil(x - 1e-9)), pl = (k, one, many) => k > 1 ? many : one;
      const fish = up(1.5 * f, 0.25), shrimp = up(1.5 * f, 0.25), mussels = up(1.5 * f, 0.5), scallops = up(0.75 * f, 0.25);
      const fennel = n(f), onion = n(f), garlic = n(8 * f / 10), limes = n(2 * f), cran = n(f), loaves = n(f);
      const butterTbsp = 7 * f, sticks = n(butterTbsp / 8), creamCups = 3 * f, cream = n(creamCups / 2), milk = n(1.5 * f / 4);
      const wine = n(1.5 * f / 3), crushed = n(f), diced = n(2 * f), stock = n(4 * f / 4), gel = n(1.5 * f / 4), van = n(1.5 * f), rasp = n(15 * f / 21), bubbly = n(6 * f / 4);
      return [
        ["Seafood", [
          [`${fmtNum(fish)} lb`, "firm white fish (cod or halibut)", fish * 22],
          [`${fmtNum(shrimp)} lb`, "large shrimp, peeled and deveined", shrimp * 23],
          [`${fmtNum(mussels)} lb`, "fresh mussels", mussels * 8],
          [`${fmtNum(scallops)} lb`, "sea scallops", scallops * 42]
        ]],
        ["Produce", [
          [`${fennel}`, pl(fennel, "large fennel bulb", "large fennel bulbs"), fennel * 3],
          [`${onion}`, pl(onion, "large yellow onion", "large yellow onions"), onion * 1],
          [`${garlic}`, pl(garlic, "head garlic", "heads garlic"), garlic * 1],
          ["1", "bunch fresh flat-leaf parsley", 2],
          ["1", "bunch fresh rosemary", 3],
          [`${cran} × 12 oz`, pl(cran, "bag fresh cranberries", "bags fresh cranberries"), cran * 4],
          [`${limes}`, pl(limes, "lime", "limes"), limes * 0.75]
        ]],
        ["Dairy & Refrigerated", [
          [`${sticks} ${pl(sticks, "stick", "sticks")}`, "unsalted butter", sticks * 1.75],
          [cupsT(up(creamCups, 0.5)), `heavy cream (${cream} × 500 ml)`, cream * 4.5],
          ["1 L", "whole milk", milk * 2.8]
        ]],
        ["Pantry & Bakery", [
          [`${wine}`, pl(wine, "bottle dry white wine (Pinot Grigio or Sauvignon Blanc)", "bottles dry white wine"), wine * 17],
          [`${crushed} × 28 oz`, pl(crushed, "can crushed tomatoes", "cans crushed tomatoes"), crushed * 2.5],
          [`${diced} × 14 oz`, pl(diced, "can diced tomatoes", "cans diced tomatoes"), diced * 1.5],
          [`${stock} × 1 L`, "seafood stock (or bottles of clam juice)", stock * 4],
          [`${gel}`, "box unflavoured gelatin", gel * 3],
          [`${van}`, pl(van, "vanilla bean (or vanilla bean paste)", "vanilla beans (or vanilla bean paste)"), van * 5],
          [`${rasp} × 600 g`, pl(rasp, "bag frozen raspberries", "bags frozen raspberries"), rasp * 6],
          [`${loaves}`, pl(loaves, "loaf crusty sourdough bread", "loaves crusty sourdough bread"), loaves * 5],
          ["", "olive oil, red pepper flakes, granulated sugar", null],
          ["", "kosher salt and black pepper", null]
        ]],
        ["Drinks", [
          [`${bubbly} × 1 L`, "sparkling water or club soda", bubbly * 2],
          ["", "optional: Prosecco for grown-ups, ice", null]
        ]],
        ["Kitchen Supplies", [
          [`${p.pots}`, pl(p.pots, "large Dutch oven or soup pot", "large pots"), null],
          ["", `${Math.round(8 * f)} small glasses or ramekins, fine sieve, blender`, null]
        ]]
      ];
    }
  };
  // add-on sizes: 1–5 people
  const addonPlan = base => guests => { const g = Math.min(5, Math.max(1, guests | 0)); return { g, f: g / base, pies: 1, dishes: 1, batches: 1 }; };

  // sizes for a turkey dinner: weight, roast time, rest, pies, dishes
  function turkeyPlan(guests) {
    const g = Math.min(20, Math.max(1, guests | 0));
    const w = Math.min(24, Math.max(8, Math.round(g <= 12 ? g * 1.5 : 18 + (g - 12) * 0.75)));
    const pts = [[8, 165], [12, 180], [14, 210], [18, 245], [20, 262], [24, 285]];   // lb → minutes at 325°F, unstuffed
    let roast = pts[pts.length - 1][1];
    for (let i = 1; i < pts.length; i++) if (w <= pts[i][0]) { const [a, ma] = pts[i - 1], [b, mb] = pts[i]; roast = Math.round((ma + (mb - ma) * (w - a) / (b - a)) / 5) * 5; break; }
    const f = g / 8;
    return { g, f, w, wBase: 13, icon: "🦃", meat: "turkey", verb: "roasts", bigNote: g >= 17 ? "For a big crowd, a 24 lb turkey is about the largest most ovens hold." : "", roast, roastText: hm(roast), rest: w < 12 ? 30 : 40, thawDays: Math.ceil(w / 4.5), pies: Math.max(1, Math.ceil(g / 8)), dishes: Math.max(1, Math.ceil(f - 0.25)) };
  }

  // ---- small text helpers ----
  function hm(min) { const h = Math.floor(min / 60), m = min % 60; return (h ? h + (h === 1 ? " hour" : " hours") : "") + (h && m ? " " : "") + (m ? m + " min" : ""); }
  function cupsT(x) { return fmtNum(x) + (Math.abs(x - 1) < 1e-9 ? " cup" : " cups"); }
  function fmtNum(x) { return Number.isInteger(x) ? String(x) : x.toFixed(2).replace(/0+$/, "").replace(/\.$/, ""); }
  function fmtCups(c) { return frac(Math.round(c * 4) / 4) + (c > 1 ? " cups" : " cup"); }
  function servings(f) { const s = Math.round(8 * f); return s + (s === 1 ? " serving" : " servings"); }
  function frac(x) {
    const whole = Math.floor(x + 1e-9), r = x - whole;
    const map = [[0, ""], [0.125, "⅛"], [0.25, "¼"], [1 / 3, "⅓"], [0.5, "½"], [2 / 3, "⅔"], [0.75, "¾"], [1, ""]];
    let best = map[0], d = 9; map.forEach(m => { const dd = Math.abs(m[0] - r); if (dd < d) { d = dd; best = m; } });
    const w = best[0] === 1 ? whole + 1 : whole;
    return (w ? String(w) : "") + (best[1] ? (w ? " " : "") + best[1] : "") || "0";
  }

  // ---- more dinners (their shopping lists are built from the recipes) ----
  const pickR = (m, id, over) => Object.assign({}, m.recipes.find(r => r.id === id), over || {});
  const clampG = g => Math.min(20, Math.max(1, g | 0));
  const DEPT_PRICE = { "Produce": { cup: 1.8, lb: 2.4, n: 0.9 }, "Dairy & Refrigerated": { cup: 2.4, lb: 6.5, n: 0.55 }, "Pantry & Baking": { cup: 1.0, lb: 3.5, n: 2.2 }, "Meat & Fish": { cup: 4, lb: 8, n: 4 } };
  function deptOf(t) {
    const s = String(t).toLowerCase();
    if (/\b(duck|chicken breast|beef|tenderloin|pork|salmon|shrimp|sausage|bacon|prosciutto|pancetta|turkey breast|ground turkey)\b/.test(s) && !/stock|broth/.test(s)) return "Meat & Fish";
    if (/\b(butter|cream|milk|cheese|egg|eggs|parmesan|mascarpone|ricotta|yogurt|mozzarella|gruy|feta|brie|buttermilk|goat)\b/.test(s) && !/cream of tartar|peanut butter|coconut/.test(s)) return "Dairy & Refrigerated";
    if (/dried (cranberries|figs|apricots|cherries)|cranberry sauce|\bjam\b/.test(s)) return "Pantry & Baking";
    if (/\bfresh\b/.test(s) && !/fresh (pasta)/.test(s)) return "Produce";
    if (/\b(ground (cinnamon|ginger|nutmeg|cloves|cumin|allspice)|nutmeg|cinnamon|paprika|cayenne|bay leaf|bay leaves|oregano|red pepper flakes|kosher salt|black pepper|flaky salt|sea salt|salt|pepper|garlic powder|onion powder|dried \w+|italian seasoning|whole cloves?)\b/.test(s) && !/bell pepper|peppers?\b.*(roasted|jar)|peppercorn/.test(s)) return "Spices";
    if (/\b(onion|garlic|shallot|potato|potatoes|carrot|sprout|beans?\b|pear|orange|lemon|lime|apple|thyme|rosemary|sage|parsley|dill|chive|mushroom|spinach|celery|greens|cranberr|pomegranate|arugula|herb|ginger|squash|leek|cucumber|tomato|basil|bell pepper|fennel|lettuce|parsnip)\b/.test(s) && !/juice|stock|powder|dried|paste|sauce/.test(s)) return "Produce";
    return "Pantry & Baking";
  }
  function qtyText(v, dim) {   // v is in tsp (volume), oz (weight) or a plain count
    if (dim === "vol") { if (v >= 12) return frac(Math.round(v / 48 * 4) / 4 || 0.25) + (v / 48 > 1.1 ? " cups" : " cup"); if (v >= 3) return frac(Math.round(v / 3 * 2) / 2) + " tbsp"; return frac(Math.max(0.25, Math.round(v * 4) / 4)) + " tsp"; }
    if (dim === "wt") return v >= 16 ? frac(Math.max(0.5, Math.ceil(v / 16 * 2 - 1e-9) / 2)) + " lb" : Math.ceil(v - 1e-9) + " oz";
    return String(Math.max(1, Math.ceil(v - 1e-9)));
  }
  function autoShop(recipes, extra) {
    return (f, p) => {
      const rows = new Map(), staples = new Map();
      recipes.forEach(r => (r.ing || []).forEach(ing => {
        if (ing.head) return;
        let t = typeof ing.t === "function" ? ing.t(p) : ing.t; const one = Array.isArray(t) ? t[0] : t, many = Array.isArray(t) ? t[1] : t;
        if (/^(water|ice)\b/i.test(one)) return;
        const dept = ing.d || deptOf(one);
        if (dept === "Spices" || ing.q == null) { const nm = String(one).replace(/\s*\(.*?\)/g, "").replace(/,.*$/, "").replace(/^(Pinch of|A pinch of)\s*/i, "").trim(); const kk = nm.toLowerCase(); if (!staples.has(kk)) staples.set(kk, nm.charAt(0).toUpperCase() + nm.slice(1)); return; }
        const k = ing.s === "n" ? 1 : ing.s === "w" ? p.w / (p.wBase || 13) : ing.s === "p" ? p.pies : ing.s === "b" ? (p.batches || 1) : f;
        const v = ing.q * k, tspU = { cup: 48, tbsp: 3, tsp: 1 }[ing.u], dim = tspU ? "vol" : (ing.u === "lb" || ing.u === "oz") ? "wt" : "n";
        const base = tspU ? v * tspU : ing.u === "lb" ? v * 16 : v;
        const nm = String(one).replace(/,.*$/, "").replace(/\s*\(.*?\)/g, "").trim(), key = dept + "|" + nm.toLowerCase() + "|" + dim, row = rows.get(key) || { dept, one, many, dim, v: 0, cost: 0, items: 0 };
        row.v += base; row.items += v;
        const pr = DEPT_PRICE[dept] || DEPT_PRICE["Pantry & Baking"];
        const cups = { cup: 1, tbsp: 1 / 16, tsp: 1 / 48 }[ing.u];
        row.cost += ing.cost != null ? (typeof ing.cost === "function" ? ing.cost(p, f) : ing.cost) : cups ? v * cups * pr.cup : ing.u === "lb" ? v * pr.lb : ing.u === "oz" ? v / 16 * pr.lb : Math.ceil(v) * pr.n;
        rows.set(key, row);
      }));
      const out = {};
      rows.forEach(r => { const q = qtyText(r.v, r.dim); const nm = (r.dim === "n" && r.v > 1.0001 && r.many) ? r.many : r.one; (out[r.dept] = out[r.dept] || []).push([q, String(nm).replace(/\s*\(.*?\)/g, "").replace(/,.*$/, "").trim(), Math.round(Math.max(r.cost, 0.3) * 100) / 100]); });
      const order = ["Produce", "Meat & Fish", "Dairy & Refrigerated", "Pantry & Baking"];
      const groups = order.filter(d => out[d]).map(d => [d, out[d]]);
      if (staples.size) groups.push(["Spices & Staples", [...staples.values()].map(n => ["", n, null])]);
      return groups.concat(extra ? extra(f, p) : []);
    };
  }
  const roastPlan = o => guests => {
    const g = clampG(guests), f = g / 8, x = o.size(g), w = x.w;
    return { g, f, w, wBase: o.wBase, icon: o.icon, meat: x.meat, verb: o.verb || "roasts", bigNote: x.note || "", roast: x.roast, roastText: hm(x.roast), rest: o.rest,
      thawDays: Math.max(1, Math.ceil((w || 4) * 5 / 24)), pies: Math.max(1, Math.ceil(g / 9)), dishes: Math.max(1, Math.ceil(f - 0.25)), batches: x.n || 1, n: x.n || 1, mainLabel: x.label };
  };
  const stdDrinks = (list) => (f, p) => [["Drinks", list.map(([n, c]) => ["", n, c == null ? null : c])], ["Kitchen Supplies", [["", "instant-read meat thermometer, foil, parchment paper", null], [`${p.dishes}`, p.dishes > 1 ? "baking dishes (9×13-inch)" : "baking dish (9×13-inch)", null]]]];

  // ---------- 🦆 roast duck ----------
  const duckMain = {
    id: "duck", course: "Main", name: "Roast Duck with Orange-Cranberry Glaze",
    prep: "25 min, plus overnight air-drying", cook: p => p.roastText, rest: p => p.rest + " min", yieldText: (f, p) => p.n === 1 ? "1 duck (serves 3–4)" : `${p.n} ducks (about 5 lb each)`,
    ing: [
      { q: 3, u: "", s: "w", up: true, d: "Meat & Fish", cost: (p) => p.n * 34, t: ["whole duck, about 5 lb (thawed)", "whole ducks, about 5 lb each (thawed)"] },
      { q: 3, u: "tbsp", s: "w", t: "kosher salt, for the skin" },
      { q: 3, u: "", s: "w", t: ["orange, quartered", "oranges, quartered"] },
      { q: 2, u: "", s: "w", t: ["onion, quartered", "onions, quartered"] },
      { q: 9, u: "", s: "w", t: ["sprig fresh thyme", "sprigs fresh thyme"] },
      { head: "Glaze" },
      { q: 1, u: "cup", s: "w", t: "orange juice" },
      { q: 0.5, u: "cup", s: "w", t: "whole-berry cranberry sauce" },
      { q: 0.33, u: "cup", s: "w", t: "honey" },
      { q: 2, u: "tbsp", s: "w", t: "soy sauce" },
      { q: 1, u: "tbsp", s: "w", t: "balsamic vinegar" },
      { q: 0.5, u: "tsp", s: "w", t: "ground ginger" }
    ],
    steps: [
      p => `If your duck${p.n > 1 ? "s are" : " is"} frozen, thaw in the refrigerator, allowing about 1 day per 4–5 lb. Remove the neck and giblets from the cavity.`,
      "The day before, pat the duck very dry. Prick the skin all over with a skewer, angling it so you pierce the fat but not the meat. Rub with the kosher salt and leave uncovered on a rack in the refrigerator overnight. Dry skin is what makes it crisp.",
      "Take the duck out 1 hour before roasting. Heat the oven to 325°F (165°C) with a rack in the lower third.",
      "Stuff the cavity with the orange quarters, onion and thyme. Tie the legs together and tuck the wing tips under.",
      "Set the duck breast-side up on a rack in a roasting pan. Roast for the first hour, then carefully pour off the fat from the pan into a heatproof jar (save it for roast potatoes).",
      "Meanwhile, simmer all the glaze ingredients in a small saucepan for 8–10 minutes, until syrupy.",
      p => `Raise the oven to 400°F (200°C). Brush the duck with glaze and roast for the last 20–30 minutes, glazing every 10 minutes, until the skin is deep golden and a thermometer in the thickest part of the thigh reads 175°F (80°C). Total roasting time is about ${p.roastText}.`,
      p => `Move the duck to a carving board, tent loosely with foil and rest for ${p.rest} minutes. Carve the breasts off the bone in slices and cut the legs apart. Serve with the extra glaze.`
    ],
    tip: "Duck is rich, so a little goes a long way. The overnight air-drying in the fridge is the secret to shatteringly crisp skin."
  };
  const duck = {
    id: "duck", tab: "elegant", name: "Roast Duck Dinner", icon: "🦆",
    blurb: "Crisp-skinned roast duck with orange-cranberry glaze, baked brie, truffle mash, balsamic sprouts and bread pudding.",
    menu: [
      ["Appetizer", ["Baked Brie in Puff Pastry with Fig & Walnuts"]],
      ["Main", ["Roast Duck with Orange-Cranberry Glaze"]],
      ["Sides", ["Truffle & Parmesan Mashed Potatoes", "Balsamic-Maple Roasted Brussels Sprouts", "Honey-Glazed Carrots"]],
      ["Dessert", ["Brioche Bread Pudding with Bourbon Caramel"]]
    ],
    drinks: [
      ["With dinner", "Pinot Noir or a Beaujolais. Their bright fruit cuts through the richness of duck."],
      ["Non-alcoholic", "Sparkling cranberry-orange juice or chilled sparkling apple cider."],
      ["With dessert", "Coffee, or a small pour of tawny port."]
    ],
    recipes: [pickR(porkcrown, "brie"), duckMain, pickR(porkcrown, "trufflemash"), pickR(porkcrown, "balsamicsprouts"), pickR(turkey, "carrots"), pickR(porkcrown, "breadpudding")],
    timeline(p) {
      const out = [], tOut = -(p.rest + 10), tIn = tOut - p.roast;
      const add = (m, icon, text, alarm = true, main = false) => out.push({ m, icon, text, alarm, main });
      add(tIn - 60, "🦆", "Take the duck out of the fridge");
      add(tIn - 20, "🔥", "Heat the oven to 325°F, stuff the duck with orange, onion and thyme");
      add(tIn, "🦆", `Duck into the oven (${p.w} lb, about ${p.roastText})`, true, true);
      add(tIn + 60, "🥄", "Pour the fat off the pan and save it");
      add(tOut - 60, "🥔", "Peel and boil the potatoes for the mash");
      add(tOut - 30, "🍯", "Make the glaze, then raise the oven to 400°F and start glazing the duck");
      add(tOut - 10, "🦆", "Last coat of glaze. Check the thigh reads 175°F");
      add(tOut, "🦆", "Duck out to rest. Oven up to 425°F");
      add(tOut + 2, "🥬", "Brussels sprouts into the oven");
      add(-60, "🧀", "Brie into the oven (or serve from the morning bake) for arriving guests");
      add(-25, "🥔", "Mash the potatoes and warm the carrots");
      add(-12, "🥬", "Drizzle balsamic maple over the sprouts");
      add(-10, "🔪", "Carve the duck");
      add(0, "🍽️", "Dinner is served!");
      add(5, "🍮", "Bread pudding into the oven (it bakes while you eat)");
      add(50, "🍮", "Warm the bourbon caramel and serve the bread pudding");
      return out.sort((a, b) => a.m - b.m);
    },
    ahead(p) { return [[1, 9, "🧂", `Salt and prick the duck${p.n > 1 ? "s" : ""}, then leave uncovered in the fridge overnight`], [p.thawDays + 1, 9, "🧊", `If the duck is frozen, move it to the fridge to thaw today`], [1, 10, "📋", "Prep day: make the caramel, soak the bread pudding overnight, trim the sprouts, assemble the brie"]]; },
    shop: null
  };
  duck.shop = autoShop(duck.recipes, stdDrinks([["Pinot Noir or Beaujolais", null], ["sparkling cranberry-orange juice", 6], ["coffee", null]]));

  // ---------- 🥩 beef tenderloin ----------
  const tenderMain = {
    id: "tenderloin", course: "Main", name: "Herb-Crusted Beef Tenderloin",
    prep: "20 min, plus 1 hour at room temperature", cook: p => p.roastText, rest: p => p.rest + " min", yieldText: (f, p) => `${p.w} lb tenderloin (${p.n === 1 ? "1 roast" : p.n + " roasts"})`,
    ing: [
      { q: 1, u: "lb", s: "n", d: "Meat & Fish", cost: p => p.w * 31, t: p => `whole beef tenderloin, trimmed and tied, ${p.w} lb in total` },
      { q: 2, u: "tbsp", s: "w", t: "olive oil" },
      { q: 1, u: "tbsp", s: "w", t: "kosher salt" },
      { q: 1, u: "tsp", s: "w", t: "coarsely ground black pepper" },
      { head: "Herb crust" },
      { q: 3, u: "tbsp", s: "w", t: "Dijon mustard" },
      { q: 2, u: "", s: "w", t: ["garlic clove, grated", "garlic cloves, grated"] },
      { q: 2, u: "tbsp", s: "w", t: "fresh rosemary, finely chopped" },
      { q: 2, u: "tbsp", s: "w", t: "fresh thyme leaves" },
      { q: 2, u: "tbsp", s: "w", t: "fresh flat-leaf parsley, chopped" }
    ],
    steps: [
      p => `Take the tenderloin out of the refrigerator 1 hour before roasting. Pat it very dry, tuck the thin tail end under and tie with kitchen string every 1½ inches so it cooks evenly. (Ask your butcher to trim and tie it.)${p.n > 1 ? " Cook the roasts side by side on one pan." : ""}`,
      "Heat the oven to 425°F (220°C) with a rack in the middle. Rub the beef all over with the olive oil, salt and pepper.",
      "Sear in a very hot pan, 1–2 minutes per side, until browned all over. Set on a rack in a roasting pan.",
      "Mix the mustard, garlic and herbs. Brush it over the top and sides of the beef.",
      p => `Roast for about ${p.roastText}, until a thermometer in the thickest part reads 120–125°F (50–52°C) for medium-rare.`,
      p => `Rest the beef, loosely tented with foil, for ${p.rest} minutes. It will rise to about 130°F. Remove the string and slice into ¾-inch rounds.`
    ],
    tip: "Tenderloin is lean and goes from perfect to dry quickly, so trust the thermometer, not the clock."
  };
  const peppercorn = {
    id: "peppercorn", course: "Main", name: "Creamy Peppercorn Sauce",
    prep: "5 min", cook: "15 min", yieldText: f => servings(f),
    ing: [
      { q: 3, u: "tbsp", t: "unsalted butter" },
      { q: 3, u: "", t: ["shallot, finely minced", "shallots, finely minced"] },
      { q: 2, u: "tbsp", t: "whole green or black peppercorns, lightly crushed" },
      { q: 0.5, u: "cup", t: "brandy or beef stock" },
      { q: 1, u: "cup", t: "beef stock" },
      { q: 1, u: "cup", t: "heavy cream" },
      { q: 2, u: "tsp", t: "Dijon mustard" }
    ],
    steps: [
      "Melt the butter in a small saucepan over medium heat. Cook the shallots 3 minutes, until soft. Add the peppercorns and cook 1 minute.",
      "Add the brandy (or stock) and simmer until almost gone, about 2 minutes.",
      "Pour in the stock and simmer 6–8 minutes until reduced by half. Stir in the cream and mustard and simmer 3–4 minutes until it coats a spoon. Season to taste."
    ],
    tip: "Make it a day ahead and rewarm gently. Spoon it over the beef at the table."
  };
  const tenderloin = {
    id: "tenderloin", tab: "elegant", name: "Beef Tenderloin Dinner", icon: "🥩",
    blurb: "Herb-crusted beef tenderloin with peppercorn sauce, shrimp cocktail, creamed spinach, truffle mash and chocolate pots de crème.",
    menu: [
      ["Appetizer", ["Shrimp Cocktail with Zesty Horseradish Sauce"]],
      ["Main", ["Herb-Crusted Beef Tenderloin", "Creamy Peppercorn Sauce"]],
      ["Sides", ["Truffle & Parmesan Mashed Potatoes", "Steakhouse Creamed Spinach", "Garlic Green Beans with Toasted Almonds"]],
      ["Dessert", ["Chocolate Pots de Crème"]]
    ],
    drinks: [
      ["With dinner", "Cabernet Sauvignon, Merlot or a Rhône-style red. Big, smooth reds suit tender beef."],
      ["Non-alcoholic", "Sparkling pomegranate juice with a sprig of rosemary."],
      ["With dessert", "Espresso, or a small pour of port."]
    ],
    recipes: [pickR(primerib, "shrimp"), tenderMain, peppercorn, pickR(porkcrown, "trufflemash"), pickR(primerib, "spinach"), pickR(ham, "beans"), pickR(primerib, "pots")],
    timeline(p) {
      const out = [], tOut = -(p.rest + 10), tIn = tOut - p.roast;
      const add = (m, icon, text, alarm = true, main = false) => out.push({ m, icon, text, alarm, main });
      add(tIn - 70, "🥩", "Take the tenderloin out of the fridge");
      add(tIn - 25, "🔥", "Heat the oven to 425°F. Pat the beef dry and rub with oil, salt and pepper");
      add(tIn - 12, "🍳", "Sear the tenderloin on all sides, then brush with the herb mustard");
      add(tIn, "🥩", `Tenderloin into the oven (${p.w} lb, about ${p.roastText})`, true, true);
      add(-75, "🍤", "Set out the shrimp cocktail on ice");
      add(-55, "🥔", "Peel and boil the potatoes for the mash");
      add(-35, "🍶", "Make the peppercorn sauce");
      add(tOut - 10, "🥩", "Check the beef reads 120–125°F");
      add(tOut, "🥩", "Beef out to rest, tented with foil");
      add(-22, "🥬", "Make the creamed spinach");
      add(-20, "🥔", "Mash the potatoes");
      add(-12, "🫛", "Finish the green beans on the stove (5 minutes)");
      add(-10, "🔪", "Slice the beef and warm the sauce");
      add(0, "🍽️", "Dinner is served!");
      add(45, "🍫", "Serve the chocolate pots de crème");
      return out.sort((a, b) => a.m - b.m);
    },
    ahead(p) { return [[p.thawDays, 9, "🧊", "If the tenderloin is frozen, move it to the fridge to thaw today"], [1, 10, "📋", "Prep day: make the pots de crème and peppercorn sauce, blanch the green beans, trim and tie the tenderloin"]]; },
    shop: null
  };
  tenderloin.shop = autoShop(tenderloin.recipes, stdDrinks([["Cabernet Sauvignon or Merlot", null], ["sparkling pomegranate juice", 7], ["espresso or coffee", null]]));

  // ---------- 🐟 salmon wellington ----------
  const salmonMain = {
    id: "wellington", course: "Main", name: "Salmon Wellington with Spinach & Herbs",
    prep: "35 min", cook: "35–40 min", rest: "10 min", yieldText: (f, p) => `${p.n} Wellington${p.n > 1 ? "s" : ""} (serves 8 each)`,
    ing: [
      { q: 2.5, u: "lb", s: "b", d: "Meat & Fish", cost: p => p.n * 38, t: "centre-cut salmon fillet, skinless, about 2½ lb" },
      { q: 2, u: "", s: "b", d: "Pantry & Baking", cost: p => p.n * 11, t: ["sheet all-butter puff pastry (about 14 oz)", "sheets all-butter puff pastry (about 14 oz)"] },
      { q: 10, u: "oz", s: "b", t: "fresh baby spinach" },
      { q: 4, u: "oz", s: "b", t: "cream cheese, softened" },
      { q: 2, u: "tbsp", s: "b", t: "fresh dill, chopped" },
      { q: 1, u: "tbsp", s: "b", t: "lemon zest" },
      { q: 2, u: "", s: "b", t: ["garlic clove, minced", "garlic cloves, minced"] },
      { q: 2, u: "tbsp", s: "b", t: "Dijon mustard" },
      { q: 1, u: "", s: "b", t: ["large egg, beaten (egg wash)", "large eggs, beaten (egg wash)"] },
      { q: 2, u: "tbsp", s: "b", t: "unsalted butter" },
      { q: 1, u: "tsp", s: "b", t: "kosher salt" }
    ],
    steps: [
      "Cook the garlic in the butter for 30 seconds. Add the spinach and stir until wilted, 2–3 minutes. Tip into a clean towel, cool, then squeeze out as much moisture as you can. Chop finely.",
      "Mix the spinach with the cream cheese, dill and lemon zest. Season with salt and pepper.",
      "Heat the oven to 400°F (200°C). Line a baking sheet with parchment.",
      "Roll one sheet of pastry on a floured surface, slightly longer and wider than the salmon, and set it on the sheet. Pat the salmon dry, season, and brush with the mustard.",
      "Spread the spinach mixture on the pastry, set the salmon on top, then cover with the second sheet of pastry, tucking it snugly around the fish. Trim the edges, press to seal, and crimp with a fork.",
      "Brush with egg wash and score a light diamond pattern on top without cutting through. Chill 15 minutes.",
      p => `Bake ${p.roast} minutes, until the pastry is deep golden and the thickest part of the salmon reads 125°F (52°C) for medium.`,
      "Rest 10 minutes, then slice with a serrated knife. Serve with the lemon-dill sauce."
    ],
    tip: "Squeezing the spinach dry is the whole trick. Wet spinach makes the pastry soggy underneath."
  };
  const dillSauce = {
    id: "dillsauce", course: "Main", name: "Lemon-Dill Cream Sauce",
    prep: "5 min", cook: "8 min", yieldText: f => servings(f),
    ing: [
      { q: 2, u: "tbsp", t: "unsalted butter" },
      { q: 1, u: "", t: ["shallot, minced", "shallots, minced"] },
      { q: 0.5, u: "cup", t: "dry white wine or chicken stock" },
      { q: 1, u: "cup", t: "heavy cream" },
      { q: 2, u: "tbsp", t: "lemon juice" },
      { q: 2, u: "tbsp", t: "fresh dill, chopped" }
    ],
    steps: [
      "Melt the butter and cook the shallot 2 minutes. Add the wine and simmer until reduced by half.",
      "Pour in the cream and simmer 4–5 minutes, until it lightly coats a spoon.",
      "Off the heat, stir in the lemon juice and dill. Season to taste and serve warm."
    ],
    tip: "Add the dill and lemon at the very end so the sauce stays bright and fresh."
  };
  const lemonPosset = {
    id: "posset", course: "Dessert", name: "Lemon Posset with Shortbread",
    prep: "10 min", cook: "5 min", rest: "chill 4 hours", yieldText: f => `${Math.round(8 * f)} small glasses`,
    ing: [
      { q: 3, u: "cup", t: "heavy cream" },
      { q: 0.75, u: "cup", t: "granulated sugar" },
      { q: 0.5, u: "cup", t: "fresh lemon juice" },
      { q: 1, u: "tbsp", t: "lemon zest" },
      { q: 8, u: "", t: ["shortbread cookie, for serving", "shortbread cookies, for serving"] }
    ],
    steps: [
      "Warm the cream and sugar in a saucepan over medium heat, stirring, until the sugar dissolves. Boil gently for exactly 3 minutes.",
      "Take off the heat and whisk in the lemon juice and zest. Let cool 10 minutes.",
      "Pour into small glasses or cups and chill at least 4 hours, until set like a soft pudding. Serve with a shortbread cookie."
    ],
    tip: "Only three real ingredients, and it sets by itself. Make it the day before so dinner day has one less job."
  };
  const salmon = {
    id: "salmon", tab: "elegant", name: "Salmon Wellington Dinner", icon: "🐟",
    blurb: "Salmon wrapped in puff pastry with spinach and dill, lemon-dill sauce, garlic mash, winter salad and lemon posset.",
    menu: [
      ["Appetizer", ["Herbed Cream Cheese Crostini with Cranberry"]],
      ["Main", ["Salmon Wellington with Spinach & Herbs", "Lemon-Dill Cream Sauce"]],
      ["Sides", ["Garlic Mashed Potatoes", "Garlic Green Beans with Toasted Almonds", "Winter Pear & Pomegranate Salad"]],
      ["Dessert", ["Lemon Posset with Shortbread"]]
    ],
    drinks: [
      ["With dinner", "Chardonnay (lightly oaked), Chablis or a dry Riesling."],
      ["Non-alcoholic", "Sparkling water with lemon and fresh dill, or white grape sparkling juice."],
      ["With dessert", "Tea or coffee."]
    ],
    recipes: [pickR(turkey, "crostini", { tip: "Toast the crostini the day before and store them airtight. Assemble no more than 30 minutes before guests arrive so they stay crisp." }), salmonMain, dillSauce, pickR(turkey, "potatoes"), pickR(ham, "beans"), pickR(ham, "salad"), lemonPosset],
    timeline(p) {
      const out = [], tOut = -(10 + 10), tIn = tOut - p.roast;
      const add = (m, icon, text, alarm = true, main = false) => out.push({ m, icon, text, alarm, main });
      add(tIn - 70, "🥬", "Wilt and squeeze the spinach, make the filling");
      add(tIn - 40, "🐟", "Assemble the Wellington and chill it");
      add(tIn - 20, "🔥", "Heat the oven to 400°F");
      add(tIn, "🐟", `Salmon Wellington into the oven (about ${p.roastText})`, true, true);
      add(-75, "🥂", "Set out the crostini for arriving guests");
      add(-50, "🥔", "Peel and boil the potatoes");
      add(-35, "🥗", "Assemble the salad (dressing on at the last minute)");
      add(-25, "🍋", "Make the lemon-dill sauce");
      add(tOut, "🐟", "Wellington out to rest");
      add(-20, "🥔", "Mash the potatoes");
      add(-12, "🫛", "Finish the green beans on the stove (5 minutes)");
      add(-8, "🔪", "Slice the Wellington with a serrated knife");
      add(0, "🍽️", "Dinner is served!");
      add(45, "🍋", "Serve the lemon posset with shortbread");
      return out.sort((a, b) => a.m - b.m);
    },
    ahead(p) { return [[1, 10, "📋", "Prep day: make the lemon posset, blanch the green beans, toast the almonds, make the salad dressing"], [1, 14, "🥬", "Make the spinach filling (keep chilled)"]]; },
    shop: null
  };
  salmon.shop = autoShop(salmon.recipes, stdDrinks([["Chardonnay or Chablis", null], ["white grape sparkling juice", 6], ["tea or coffee", null], ["baguette, for the crostini", 4]]));

  // ---------- 🐔 stuffed chicken roulade ----------
  const rouladeMain = {
    id: "roulade", course: "Main", name: "Spinach, Feta & Sun-Dried Tomato Chicken Roulade",
    prep: "40 min", cook: p => p.roastText, rest: p => p.rest + " min", yieldText: f => `${Math.round(8 * f)} roulades`,
    ing: [
      { q: 8, u: "", s: "f", d: "Meat & Fish", cost: (p, f) => 8 * f * 3.4, t: ["large boneless, skinless chicken breast (6–7 oz)", "large boneless, skinless chicken breasts (6–7 oz each)"] },
      { q: 5, u: "oz", t: "fresh baby spinach" },
      { q: 4, u: "oz", t: "feta, crumbled" },
      { q: 0.5, u: "cup", t: "sun-dried tomatoes in oil, chopped" },
      { q: 4, u: "oz", t: "cream cheese, softened" },
      { q: 3, u: "", t: ["garlic clove, minced", "garlic cloves, minced"] },
      { q: 3, u: "tbsp", t: "olive oil" },
      { q: 2, u: "tsp", t: "smoked paprika" },
      { q: 1, u: "tsp", t: "kosher salt" },
      { q: 8, u: "", d: "Meat & Fish", cost: (p, f) => 8 * f * 1.2, t: ["slice bacon or prosciutto (to wrap)", "slices bacon or prosciutto (to wrap)"] }
    ],
    steps: [
      "Cook the garlic in 1 tbsp of the oil for 30 seconds. Add the spinach and stir until wilted. Cool, then squeeze dry and chop.",
      "Mix the spinach with the feta, tomatoes and cream cheese. Season with pepper.",
      "Slice each chicken breast open sideways almost all the way through, like a book, then pound to an even ½ inch between two sheets of plastic wrap.",
      "Season with salt, paprika and pepper. Spread a few spoonfuls of filling over each, leaving a border, and roll up snugly. Wrap each in a slice of bacon or prosciutto, seam side down, and secure with a toothpick.",
      "Heat the oven to 400°F (200°C). Set the roulades in a lightly oiled baking dish and brush with the remaining oil.",
      p => `Bake about ${p.roastText}, until the chicken reads 165°F (74°C) and the wrapping is golden.`,
      p => `Rest ${p.rest} minutes, then slice each roulade on a slant into rounds. Spoon the mushroom-thyme sauce over the top.`
    ],
    tip: "Assemble the roulades the day before, cover and refrigerate. Add 5 minutes to the baking time if they go in cold."
  };
  const mushroomSauce = {
    id: "mushroomsauce", course: "Main", name: "Creamy Mushroom & Thyme Sauce",
    prep: "10 min", cook: "15 min", yieldText: f => servings(f),
    ing: [
      { q: 3, u: "tbsp", t: "unsalted butter" },
      { q: 12, u: "oz", t: "cremini mushrooms, sliced" },
      { q: 2, u: "", t: ["shallot, minced", "shallots, minced"] },
      { q: 2, u: "", t: ["garlic clove, minced", "garlic cloves, minced"] },
      { q: 2, u: "tbsp", t: "all-purpose flour" },
      { q: 1.5, u: "cup", t: "low-sodium chicken stock" },
      { q: 0.5, u: "cup", t: "heavy cream" },
      { q: 1, u: "tbsp", t: "fresh thyme leaves" }
    ],
    steps: [
      "Melt the butter in a wide pan over medium-high heat. Cook the mushrooms 6–8 minutes, until golden and the liquid has cooked off.",
      "Add the shallots and garlic and cook 2 minutes. Sprinkle in the flour and stir for 1 minute.",
      "Whisk in the stock, bring to a simmer and cook 4–5 minutes until thickened. Stir in the cream and thyme, season and keep warm."
    ],
    tip: "Don't crowd the pan. Cook the mushrooms in two batches if needed so they brown instead of steaming."
  };
  const roulade = {
    id: "roulade", tab: "elegant", name: "Stuffed Chicken Roulade Dinner", icon: "🐔",
    blurb: "Spinach and feta stuffed chicken with mushroom-thyme sauce, cheese ball, garlic mash, honey carrots and gingerbread.",
    menu: [
      ["Appetizer", ["Cranberry Pecan Cheese Ball with Crackers"]],
      ["Main", ["Spinach, Feta & Sun-Dried Tomato Chicken Roulade", "Creamy Mushroom & Thyme Sauce"]],
      ["Sides", ["Garlic Mashed Potatoes", "Honey-Glazed Carrots", "Garlic Green Beans with Toasted Almonds"]],
      ["Dessert", ["Old-Fashioned Gingerbread Cake with Whipped Cream"]]
    ],
    drinks: [
      ["With dinner", "Chardonnay, Pinot Gris or a light Pinot Noir."],
      ["Non-alcoholic", "Sparkling apple cider with a slice of orange."],
      ["With dessert", "Coffee, chai or hot tea."]
    ],
    recipes: [pickR(ham, "cheeseball"), rouladeMain, mushroomSauce, pickR(turkey, "potatoes"), pickR(turkey, "carrots"), pickR(ham, "beans"), pickR(ham, "gingerbread")],
    timeline(p) {
      const out = [], tOut = -(p.rest + 10), tIn = tOut - p.roast;
      const add = (m, icon, text, alarm = true, main = false) => out.push({ m, icon, text, alarm, main });
      add(tIn - 60, "🥬", "Wilt and squeeze the spinach, mix the filling");
      add(tIn - 35, "🐔", "Stuff, roll and wrap the chicken");
      add(tIn - 15, "🔥", "Heat the oven to 400°F");
      add(tIn, "🐔", `Chicken roulades into the oven (about ${p.roastText})`, true, true);
      add(-60, "🧀", "Set out the cheese ball and crackers for arriving guests");
      add(-50, "🥔", "Peel and boil the potatoes");
      add(-30, "🥕", "Glaze the carrots on the stove");
      add(-25, "🍄", "Make the mushroom-thyme sauce");
      add(tOut, "🐔", "Roulades out to rest");
      add(-20, "🥔", "Mash the potatoes");
      add(-12, "🫛", "Finish the green beans on the stove (5 minutes)");
      add(-8, "🔪", "Slice the roulades and spoon on the sauce");
      add(0, "🍽️", "Dinner is served!");
      add(45, "🍰", "Whip the cream and serve the gingerbread");
      return out.sort((a, b) => a.m - b.m);
    },
    ahead(p) { return [[1, 10, "📋", `Prep day: make the cheese ball, bake ${p.pies > 1 ? p.pies + " gingerbread cakes" : "the gingerbread"}, blanch the green beans, assemble the roulades and chill them`]]; },
    shop: null
  };
  roulade.shop = autoShop(roulade.recipes, stdDrinks([["Chardonnay or Pinot Gris", null], ["sparkling apple cider", 5], ["coffee or chai", null]]));

  // ---------- 🦃 roast turkey breast ----------
  const breastMain = {
    id: "breast", course: "Main", name: "Herb-Butter Roast Turkey Breast",
    prep: "15 min", cook: p => p.roastText, rest: p => p.rest + " min", yieldText: (f, p) => `${p.n === 1 ? "one" : p.n} bone-in breast${p.n > 1 ? "s" : ""}, ${p.w} lb in total`,
    ing: [
      { q: 1, u: "lb", s: "n", d: "Meat & Fish", cost: p => p.w * 8.5, t: p => `bone-in turkey breast, ${p.w} lb in total (thawed)` },
      { q: 0.5, u: "cup", s: "w", t: "unsalted butter, softened" },
      { q: 3, u: "", s: "w", t: ["garlic clove, minced", "garlic cloves, minced"] },
      { q: 2, u: "tbsp", s: "w", t: "fresh thyme leaves" },
      { q: 1, u: "tbsp", s: "w", t: "fresh rosemary, finely chopped" },
      { q: 1, u: "tbsp", s: "w", t: "fresh sage, chopped" },
      { q: 1, u: "", s: "w", up: true, t: ["lemon, zested", "lemons, zested"] },
      { q: 1, u: "", s: "w", t: ["onion, thickly sliced (for the pan)", "onions, thickly sliced (for the pan)"] },
      { q: 1, u: "cup", s: "n", t: "chicken stock, for the pan" }
    ],
    steps: [
      p => `If frozen, thaw in the refrigerator for about ${p.thawDays} ${p.thawDays === 1 ? "day" : "days"}. Take the turkey out of the fridge 1 hour before roasting and pat very dry.`,
      "Heat the oven to 325°F (165°C) with a rack in the lower third.",
      "Mash the butter with the garlic, herbs, lemon zest, 1 tsp kosher salt and ½ tsp pepper. Loosen the skin over the breast with your fingers and spread two thirds of the butter underneath. Rub the rest over the skin.",
      "Scatter the onion in a roasting pan, pour in the stock and set the breast on top, skin side up.",
      p => `Roast about ${p.roastText}, basting once or twice with the pan juices, until a thermometer in the thickest part reads 160°F (71°C). The skin should be golden; cover loosely with foil if it browns too fast.`,
      p => `Rest ${p.rest} minutes (it rises to 165°F). Carve the breast off the bone and slice across the grain. Strain the pan juices for the gravy.`
    ],
    tip: "A bone-in breast gives you all the turkey flavour in a fraction of the time, and no wrestling with a whole bird."
  };
  const panGravy = {
    id: "pangravy", course: "Main", name: "Herb Pan Gravy",
    prep: "5 min", cook: "10 min", yieldText: f => servings(f),
    ing: [
      { q: 3, u: "tbsp", t: "unsalted butter" },
      { q: 3, u: "tbsp", t: "all-purpose flour" },
      { q: 2.5, u: "cup", t: "low-sodium chicken stock" },
      { q: 1, u: "tsp", t: "fresh thyme leaves" }
    ],
    steps: [
      "Pour the pan juices through a sieve, skim off most of the fat and keep the juices.",
      "Melt the butter, whisk in the flour and cook 2 minutes until golden.",
      "Slowly whisk in the stock and the pan juices. Simmer 6–8 minutes until it coats a spoon. Add the thyme, season and keep warm."
    ],
    tip: "Cold stock into hot roux, or hot stock into cool roux, keeps the gravy lump free."
  };
  const turkeybreast = {
    id: "turkeybreast", tab: "traditional", name: "Roast Turkey Breast Dinner", icon: "🦃",
    blurb: "A smaller, easier turkey: herb-butter roast breast, gravy, stuffing, mash, sprouts, cranberry sauce and pumpkin pie.",
    menu: [
      ["Appetizer", ["Herbed Cream Cheese Crostini with Cranberry"]],
      ["Main", ["Herb-Butter Roast Turkey Breast", "Herb Pan Gravy"]],
      ["Stuffing", ["Classic Herb & Onion Bread Stuffing"]],
      ["Sides", ["Garlic Mashed Potatoes", "Roasted Brussels Sprouts", "Fresh Orange-Cranberry Sauce"]],
      ["Dessert", ["Spiced Pumpkin Pie with Whipped Cream"]]
    ],
    drinks: [
      ["With dinner", "Pinot Noir, or a dry Riesling or unoaked Chardonnay."],
      ["Non-alcoholic", "Sparkling cranberry-orange punch or chilled sparkling apple cider."],
      ["With dessert", "Hot coffee, black tea or warm spiced apple cider."]
    ],
    recipes: [pickR(turkey, "crostini"), breastMain, panGravy, pickR(turkey, "stuffing"), pickR(turkey, "potatoes"), pickR(turkey, "sprouts"), pickR(turkey, "cranberry"), pickR(turkey, "pie")],
    timeline(p) {
      const out = [], tOut = -(p.rest + 10), tIn = tOut - p.roast;
      const add = (m, icon, text, alarm = true, main = false) => out.push({ m, icon, text, alarm, main });
      add(tIn - 60, "🦃", "Take the turkey breast out of the fridge");
      add(tIn - 20, "🔥", "Heat the oven to 325°F. Rub the herb butter under the skin");
      add(tIn, "🦃", `Turkey breast into the oven (${p.w} lb, about ${p.roastText})`, true, true);
      add(tOut - 55, "🥖", "Stuffing into the oven, covered");
      add(-70, "🥂", "Set out the crostini for arriving guests");
      add(-50, "🥔", "Peel and boil the potatoes");
      add(tOut - 10, "🦃", "Check the turkey reads 160°F");
      add(tOut, "🦃", "Turkey out to rest. Oven up to 425°F, uncover the stuffing, sprouts in");
      add(-25, "🍶", "Make the gravy from the pan juices");
      add(-20, "🥔", "Mash the potatoes");
      add(-10, "🔪", "Carve the turkey breast");
      add(0, "🍽️", "Dinner is served!");
      add(45, "🥧", "Whip the cream and serve the pumpkin pie");
      return out.sort((a, b) => a.m - b.m);
    },
    ahead(p) { return [[p.thawDays, 9, "🧊", `If the turkey breast is frozen, move it to the fridge to thaw today (about ${p.thawDays} ${p.thawDays === 1 ? "day" : "days"})`], [1, 10, "📋", `Prep day: bake ${p.pies > 1 ? p.pies + " pumpkin pies" : "the pumpkin pie"}, make the cranberry sauce, cube and dry the bread, trim the sprouts`]]; },
    shop: null
  };
  turkeybreast.shop = autoShop(turkeybreast.recipes, stdDrinks([["Pinot Noir or Riesling", null], ["sparkling cranberry-orange punch ingredients", 8], ["coffee or tea", null], ["baguette, for the crostini", 4]]));

  // ---------- 🍝 lasagna ----------
  const lasagnaMain = {
    id: "lasagna", course: "Main", name: "Classic Meat Lasagna",
    prep: "45 min", cook: "1 hour 15 min", rest: "20 min", yieldText: (f, p) => `${p.n} lasagna${p.n > 1 ? "s" : ""} (9×13-inch, serves 8 each)`,
    ing: [
      { q: 1, u: "lb", s: "b", t: "ground beef" },
      { q: 1, u: "lb", s: "b", t: "mild Italian sausage, casings removed" },
      { q: 1, u: "", s: "b", t: ["onion, finely chopped", "onions, finely chopped"] },
      { q: 4, u: "", s: "b", t: ["garlic clove, minced", "garlic cloves, minced"] },
      { q: 2, u: "", s: "b", d: "Pantry & Baking", cost: p => p.n * 4.5, t: ["can (28 oz) crushed tomatoes", "cans (28 oz each) crushed tomatoes"] },
      { q: 1, u: "", s: "b", d: "Pantry & Baking", cost: p => p.n * 1.6, t: ["can (6 oz) tomato paste", "cans (6 oz each) tomato paste"] },
      { q: 1, u: "tbsp", s: "b", t: "dried Italian seasoning" },
      { q: 1, u: "", s: "b", d: "Pantry & Baking", cost: p => p.n * 3.5, t: ["box (9 oz) oven-ready lasagna noodles", "boxes (9 oz each) oven-ready lasagna noodles"] },
      { head: "Cheese layers" },
      { q: 15, u: "oz", s: "b", t: "ricotta" },
      { q: 2, u: "", s: "b", t: ["large egg", "large eggs"] },
      { q: 0.5, u: "cup", s: "b", t: "grated Parmesan" },
      { q: 3, u: "tbsp", s: "b", t: "fresh flat-leaf parsley, chopped" },
      { q: 16, u: "oz", s: "b", t: "shredded mozzarella" }
    ],
    steps: [
      "Brown the beef and sausage with the onion in a large pot, breaking up the meat, 8–10 minutes. Add the garlic and cook 1 minute. Drain off excess fat.",
      "Stir in the crushed tomatoes, tomato paste, Italian seasoning, 1 tsp kosher salt and a pinch of sugar. Simmer 25–30 minutes, until thick.",
      "Mix the ricotta with the eggs, half the Parmesan and the parsley.",
      "Heat the oven to 375°F (190°C). Spread a thin layer of sauce in a 9×13-inch dish. Layer noodles, ricotta mixture, mozzarella and sauce, repeating 3 times and ending with sauce and the rest of the mozzarella and Parmesan.",
      "Cover tightly with foil (spray it so the cheese doesn't stick). Bake 45 minutes, then uncover and bake 25–30 minutes more, until bubbling and golden.",
      "Rest 20 minutes before cutting so the layers hold together."
    ],
    tip: "Assemble the day before and keep it covered in the fridge. Add 15 minutes to the covered baking time if it goes in cold."
  };
  const garlicBread = {
    id: "garlicbread", course: "Sides", name: "Cheesy Garlic Bread",
    prep: "10 min", cook: "12 min", yieldText: f => `${Math.round(8 * f)} servings`,
    ing: [
      { q: 1, u: "", s: "f", d: "Pantry & Baking", cost: 3.5, up: true, t: ["large baguette or ciabatta loaf", "large baguettes or ciabatta loaves"] },
      { q: 0.5, u: "cup", t: "unsalted butter, softened" },
      { q: 4, u: "", t: ["garlic clove, grated", "garlic cloves, grated"] },
      { q: 2, u: "tbsp", t: "fresh flat-leaf parsley, chopped" },
      { q: 1, u: "cup", t: "shredded mozzarella" }
    ],
    steps: [
      "Heat the oven to 400°F (200°C) once the lasagna comes out.",
      "Mash the butter with the garlic and parsley. Slice the bread in half lengthways and spread the butter on the cut sides.",
      "Top with the mozzarella and bake 10–12 minutes, until golden and bubbling. Slice and serve warm."
    ],
    tip: "Mix the garlic butter the day before. It spreads best at room temperature."
  };
  const tiramisu = {
    id: "tiramisu", course: "Dessert", name: "No-Bake Tiramisu",
    prep: "25 min", cook: "none", rest: "chill 6 hours", yieldText: f => servings(f),
    ing: [
      { q: 4, u: "", t: ["large egg yolk", "large egg yolks"] },
      { q: 0.5, u: "cup", t: "granulated sugar" },
      { q: 16, u: "oz", t: "mascarpone" },
      { q: 1, u: "cup", t: "heavy cream" },
      { q: 1.5, u: "cup", t: "strong brewed coffee, cooled" },
      { q: 2, u: "tbsp", t: "coffee liqueur or marsala (optional)" },
      { q: 24, u: "", t: ["ladyfinger", "ladyfingers"] },
      { q: 2, u: "tbsp", t: "unsweetened cocoa powder" }
    ],
    steps: [
      "Whisk the egg yolks and sugar in a heatproof bowl set over simmering water for 5–6 minutes, until pale and thick. Cool, then beat in the mascarpone until smooth.",
      "Whip the cream to stiff peaks and fold it into the mascarpone mixture.",
      "Mix the coffee and liqueur. Dip each ladyfinger very briefly, then lay a layer in an 8×8-inch dish. Cover with half the cream, repeat, and smooth the top.",
      "Cover and chill at least 6 hours, or overnight. Dust with cocoa just before serving."
    ],
    tip: "Dip the ladyfingers for just a second. Soaked biscuits turn mushy, but a quick dip softens them perfectly overnight."
  };
  const lasagna = {
    id: "lasagna", tab: "traditional", name: "Lasagna Christmas Dinner", icon: "🍝",
    blurb: "Classic meat lasagna, cheesy garlic bread, winter pear salad, cheese ball starter and tiramisu. Easy to make ahead.",
    menu: [
      ["Appetizer", ["Cranberry Pecan Cheese Ball with Crackers"]],
      ["Main", ["Classic Meat Lasagna"]],
      ["Sides", ["Cheesy Garlic Bread", "Winter Pear & Pomegranate Salad"]],
      ["Dessert", ["No-Bake Tiramisu"]]
    ],
    drinks: [
      ["With dinner", "Chianti, Montepulciano or Sangiovese. Bright, savoury reds love tomato sauce."],
      ["Non-alcoholic", "Sparkling water with a splash of pomegranate juice and a sprig of rosemary."],
      ["With dessert", "Espresso or a small pour of Vin Santo."]
    ],
    recipes: [pickR(ham, "cheeseball"), lasagnaMain, garlicBread, pickR(ham, "salad"), tiramisu],
    timeline(p) {
      const out = [], tOut = -(p.rest + 5), tIn = tOut - p.roast;
      const add = (m, icon, text, alarm = true, main = false) => out.push({ m, icon, text, alarm, main });
      add(tIn - 20, "🔥", "Heat the oven to 375°F");
      add(tIn, "🍝", `Lasagna into the oven, covered with foil (about ${p.roastText})`, true, true);
      add(tIn + 45, "🍝", "Uncover the lasagna for the golden finish");
      add(-60, "🧀", "Set out the cheese ball and crackers for arriving guests");
      add(-35, "🥗", "Assemble the salad (dressing on at the last minute)");
      add(tOut, "🍝", "Lasagna out to rest. Oven up to 400°F, garlic bread in");
      add(-12, "🥖", "Garlic bread out of the oven");
      add(-8, "🥗", "Dress the salad");
      add(0, "🍽️", "Dinner is served!");
      add(45, "☕", "Dust the tiramisu with cocoa and serve");
      return out.sort((a, b) => a.m - b.m);
    },
    ahead(p) { return [[1, 10, "📋", "Prep day: make the tiramisu, make the cheese ball, cook the sauce and assemble the lasagna (cover and refrigerate), mix the garlic butter"]]; },
    shop: null
  };
  lasagna.shop = autoShop(lasagna.recipes, stdDrinks([["Chianti or Sangiovese", null], ["pomegranate juice and sparkling water", 6], ["espresso or coffee", null]]));

  const duckPlan = roastPlan({ icon: "🦆", wBase: 15, rest: 20, size: g => { const n = Math.max(1, Math.ceil(g / 3.5 - 1e-9)); return { w: n * 5, n, meat: n > 1 ? `ducks (${n} × 5 lb)` : "duck", roast: Math.round((140 + (n - 1) * 10) / 5) * 5, note: "Duck needs the fat poured off after the first hour." }; } });
  const tenderPlan = roastPlan({ icon: "🥩", wBase: 4, rest: 20, size: g => { const w = Math.max(2, Math.round(g * 0.5 * 2) / 2), n = Math.ceil(w / 5), per = w / n; return { w, n, meat: n > 1 ? `beef tenderloin (${n} roasts)` : "beef tenderloin", roast: Math.round((20 + per * 6.5) / 5) * 5, note: "Pull it out at 120–125°F for medium-rare. It rises to about 130°F as it rests." }; } });
  const salmonPlan = roastPlan({ icon: "🐟", wBase: 2.5, rest: 10, verb: "bakes", size: g => { const n = Math.max(1, Math.ceil(g / 8 - 1e-9)); return { n, meat: "", roast: n > 1 ? 45 : 40, label: `${n} salmon Wellington${n > 1 ? "s" : ""}`, note: n > 1 ? "Bake the Wellingtons on separate sheets, rotating halfway." : "" }; } });
  const roulPlan = roastPlan({ icon: "🐔", wBase: 4, rest: 10, verb: "bakes", size: g => { const w = Math.max(1, Math.round(g * 0.5 * 2) / 2); return { w, meat: "stuffed chicken breasts", roast: g > 12 ? 45 : 40, note: "The chicken is done at 165°F." }; } });
  const breastPlan = roastPlan({ icon: "🦃", wBase: 6, rest: 20, size: g => { const w = Math.min(14, Math.max(3, Math.round(g * 0.75))), n = Math.ceil(w / 7), per = w / n; return { w, n, meat: n > 1 ? `bone-in turkey breasts (${n})` : "bone-in turkey breast", roast: Math.round((per * 22 + (n > 1 ? 10 : 0)) / 5) * 5, note: "Pull it out at 160°F. It rises to a safe 165°F as it rests." }; } });
  const lasaPlan = roastPlan({ icon: "🍝", wBase: 8, rest: 20, verb: "bakes", size: g => { const n = Math.max(1, Math.ceil(g / 8 - 1e-9)); return { n, meat: "", roast: 75, label: `${n} lasagna${n > 1 ? "s" : ""} (9×13-inch)`, note: n > 1 ? "Bake the pans side by side; if your oven only holds one rack, bake them on two racks and swap halfway." : "" }; } });

  const placeholder = (id, tab, name, icon, blurb) => ({ id, tab, name, icon, blurb, soon: true });
  return {
    tabs: [["eve", "🕯️ Christmas Eve"], ["traditional", "Traditional"], ["elegant", "Elegant"], ["vegan", "Vegan"], ["dietary", "Dietary"]],
    meals: [
      turkey,
      turkeybreast,
      primerib,
      ham,
      lasagna,
      lambcrown,
      porkcrown,
      tenderloin,
      duck,
      salmon,
      roulade,
      vegan,
      squash,
      shepherd,
      vgravyAddon,
      mousse,
      pecanAddon,
      nyeparty,
      seafood
    ],
    eveDate,
    // approximate cost of one appetizer for a party plan (if it's not picked yet: the cost of adding it)
    appCost(name, p) {
      const sh = APP_SHOP[name]; if (!sh) return 0;
      const [batch, items] = sh, perBatch = items.reduce((t, x) => t + (x[1] || 0), 0);
      if (DRINK_APPS.includes(name)) return perBatch * Math.max(1, Math.ceil(p.g * 1.5 / batch - 1e-9));
      const picked = p.items.find(i => i.name === name);
      const each = picked ? picked.pieces : Math.ceil(p.total / (p.items.length + 1));
      return perBatch * Math.max(1, Math.ceil(each / batch - 1e-9));
    },
    plan: { turkeybreast: breastPlan, lasagna: lasaPlan, tenderloin: tenderPlan, duck: duckPlan, salmon: salmonPlan, roulade: roulPlan, turkey: turkeyPlan, ham: hamPlan, primerib: primeRibPlan, porkcrown: porkCrownPlan, lambcrown: lambCrownPlan, vegan: veganPlan, squash: addonPlan(4), shepherd: addonPlan(5), mousse: addonPlan(4), vgravy2: addonPlan(5), pecanpie: addonPlan(8), nyeparty: nyePartyPlan, eveparty: evePartyPlan, seafood: seafoodPlan },
    doneness: DONENESS,
    appShop: APP_SHOP, appRecipes: APP_RECIPES, drinkApps: DRINK_APPS,   // 🏢 the office food planner uses the same appetizer shopping data
    frac, hm, fmtNum
  };
})();
