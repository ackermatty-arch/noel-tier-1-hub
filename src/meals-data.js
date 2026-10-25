/* ============================================================
   🍽️ MEAL PLANNER: the menus (original recipes, Earth & Wonder)
   Every recipe is written for 8 people. The app scales it for 1–20.
   Ingredient: { q: amount, u: unit, t: "text" or ["one", "many"], s: how it scales }
     s: "f" = with guests (default) · "w" = with turkey size · "p" = per pie · "n" = never
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
        ["Meat", [[`${p.w} lb`, "whole turkey (fresh, or frozen and thawed in time)", p.w * 3.3]]],
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
        ["Meat", [[`${p.w} lb`, "fully cooked bone-in ham (not spiral-cut)", p.w * 4]]],
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
          [`${fmtNum(p.w)} lb`, p.roasts > 1 ? `bone-in prime rib, ${p.ribs} ribs in total (ask for 2 roasts)` : `bone-in prime rib (standing rib roast), ${p.ribs} ribs`, p.w * 14],
          [`${fmtNum(shrimp)} lb`, "cooked jumbo shrimp, peeled, tails on", shrimp * 22]
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
          [`${wine}`, pl(wine, "bottle dry red wine (for the jus)", "bottles dry red wine (for the jus)"), wine * 14],
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

  const placeholder = (id, tab, name, icon, blurb) => ({ id, tab, name, icon, blurb, soon: true });
  return {
    tabs: [["traditional", "Traditional"], ["elegant", "Elegant"], ["vegan", "Vegan"], ["dietary", "Dietary"]],
    meals: [
      turkey,
      primerib,
      ham,
      placeholder("lambcrown", "elegant", "Crown Roast of Lamb", "👑", "Recipe coming soon."),
      placeholder("porkcrown", "elegant", "Crown Roast of Pork", "👑", "Recipe coming soon."),
      placeholder("vegan1", "vegan", "Vegan Holiday Dinner", "🌱", "Recipes coming soon."),
      placeholder("diet1", "dietary", "Dietary Holiday Dinner", "🥗", "Recipes coming soon.")
    ],
    plan: { turkey: turkeyPlan, ham: hamPlan, primerib: primeRibPlan },
    doneness: DONENESS,
    frac, hm, fmtNum
  };
})();
