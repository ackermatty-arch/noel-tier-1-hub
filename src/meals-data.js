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
      const add = (m, icon, text, alarm = true) => out.push({ m, icon, text, alarm });
      add(tIn - 60, "🦃", "Take the turkey out of the fridge");
      add(tIn - 35, "🔥", "Heat the oven to 325°F and butter the turkey");
      add(tIn, "🦃", `Turkey into the oven (${p.w} lb, about ${p.roastText})`);
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

    // 🛒 Shopping list for f = guests ÷ 8, w = turkey lb, pies
    shop(f, p) {
      const wf = p.w / 13, up = (x, step = 1) => Math.ceil(x / step - 1e-9) * step, n = x => Math.max(1, Math.ceil(x - 1e-9));
      const lb = x => `${fmtNum(up(x, 0.5))} lb`;
      const butterTbsp = 8 * wf + 9 * f + 8 * f + 3 * f + 8 * p.pies + 2;
      const sticks = n(butterTbsp / 8);
      const creamCups = 0.5 * f + 2 * p.pies, milkCups = 1 * f + 0.5 * p.pies;
      const stockCups = 2 + 5 * f + 2.75 * f;
      const cloves = 3 * wf + 3 * f + 6 * f + 1 * f;
      return [
        ["Produce", [
          [`${2 + n(2 * f)}`, "yellow onions"],
          [`${n((2 + 3 * f) / 8)}`, n((2 + 3 * f) / 8) > 1 ? "bunches celery" : "bunch celery"],
          [`${1 + n(cloves / 10)}`, "heads garlic"],
          [lb(4 * f), "Yukon Gold potatoes"],
          [lb(2 * f), "Brussels sprouts"],
          [lb(2 * f + 0.25), "carrots"],
          [`${n(f)} × 12 oz`, n(f) > 1 ? "bags fresh cranberries (plus a handful for the punch)" : "bag fresh cranberries (plus a handful for the punch)"],
          [`${Math.max(2, 1 + n(f / 2))}`, "lemons"],
          [`${n(f) + n(f)}`, "oranges"],
          [`${n((2 * wf + 2 * f + 2) / 8)}`, "bunch fresh sage"],
          [`${n((wf + 1.7 * f + 2) / 8)}`, "bunch fresh thyme"],
          [`${n((wf + 2 + f) / 6)}`, "bunch fresh rosemary"],
          [`${n((2 * wf + 5 * f) / 16)}`, "bunch fresh flat-leaf parsley"],
          [`${n(4 * f / 8)}`, "bunch fresh chives"]
        ]],
        ["Meat", [[`${p.w} lb`, "whole turkey (fresh, or frozen and thawed in time)"]]],
        ["Dairy & Refrigerated", [
          [`${sticks} sticks`, `unsalted butter (${fmtNum(up(sticks / 4, 0.25))} lb)`],
          [`${fmtNum(up(creamCups, 0.5))} cups`, `heavy cream (${n(creamCups / 2)} × 500 ml / 1 pint)`],
          [`${fmtNum(up(milkCups, 0.5))} cups`, `whole milk (${n(milkCups / 4)} × 1 L / 1 quart)`],
          [`${up(2 * f) + 3 * p.pies}`, "large eggs"],
          [`${n(f)} × 8 oz`, "cream cheese"]
        ]],
        ["Pantry & Dry Goods", [
          [`${n(stockCups / 4)} × 1 L`, `low-sodium chicken or turkey stock (about ${Math.ceil(stockCups)} cups)`],
          [`${n(f)} × 1 lb`, "crusty white or sourdough bread"],
          [`${n(f)}`, n(f) > 1 ? "French baguettes" : "French baguette"],
          [`${p.pies} × 15 oz`, p.pies > 1 ? "cans pure pumpkin purée" : "can pure pumpkin purée"],
          [`${fmtNum(up(0.25 * f + 1.5 * p.pies, 0.5))} cups`, "all-purpose flour"],
          [`${fmtNum(up(0.75 * f + 0.2 * p.pies, 0.25))} cups`, "granulated sugar"],
          [`${fmtNum(up(0.75 * p.pies, 0.25))} cups`, "brown sugar"],
          [`${Math.ceil(3 * f)} tbsp`, "honey"],
          [`${Math.ceil(6 * f)} tbsp`, "olive oil"],
          ["", "vanilla extract"],
          ["", "balsamic vinegar (optional)"],
          ["", "kosher salt and black pepper"],
          ["", "ground cinnamon (plus a cinnamon stick, optional)"],
          ["", "ground ginger, ground nutmeg, ground cloves"]
        ]],
        ["Drinks", [
          [`${fmtNum(up(4 * f / 4, 0.5))} L`, "cranberry juice"],
          [`${fmtNum(up(2.75 * f / 4, 0.5))} L`, "orange juice"],
          [`${fmtNum(up(4 * f / 4, 0.5))} L`, "sparkling water or ginger ale"],
          ["", "optional: sparkling apple cider, wine (1 bottle for every 3–4 adults), coffee, tea"]
        ]],
        ["Kitchen Supplies", [
          ["", "instant-read meat thermometer"],
          ["", "large roasting pan with a rack"],
          [`${p.dishes}`, p.dishes > 1 ? "baking dishes (9×13-inch)" : "baking dish (9×13-inch)"],
          [`${p.pies}`, p.pies > 1 ? "pie dishes (9-inch)" : "pie dish (9-inch)"],
          ["", "kitchen twine, foil, parchment paper, pie weights or dried beans"]
        ]]
      ];
    }
  };

  // sizes for a turkey dinner: weight, roast time, rest, pies, dishes
  function turkeyPlan(guests) {
    const g = Math.min(20, Math.max(1, guests | 0));
    const w = Math.min(24, Math.max(8, Math.round(g <= 12 ? g * 1.5 : 18 + (g - 12) * 0.75)));
    const pts = [[8, 165], [12, 180], [14, 210], [18, 245], [20, 262], [24, 285]];   // lb → minutes at 325°F, unstuffed
    let roast = pts[pts.length - 1][1];
    for (let i = 1; i < pts.length; i++) if (w <= pts[i][0]) { const [a, ma] = pts[i - 1], [b, mb] = pts[i]; roast = Math.round((ma + (mb - ma) * (w - a) / (b - a)) / 5) * 5; break; }
    const f = g / 8;
    return { g, f, w, roast, roastText: hm(roast), rest: w < 12 ? 30 : 40, thawDays: Math.ceil(w / 4.5), pies: Math.max(1, Math.ceil(g / 8)), dishes: Math.max(1, Math.ceil(f - 0.25)) };
  }

  // ---- small text helpers ----
  function hm(min) { const h = Math.floor(min / 60), m = min % 60; return (h ? h + (h === 1 ? " hour" : " hours") : "") + (h && m ? " " : "") + (m ? m + " min" : ""); }
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
      placeholder("beef", "traditional", "Roast Beef Dinner", "🥩", "Recipe coming soon."),
      placeholder("ham", "traditional", "Glazed Ham Dinner", "🍖", "Recipe coming soon."),
      placeholder("crown1", "elegant", "Crown Roast", "👑", "Recipe coming soon."),
      placeholder("crown2", "elegant", "Crown Roast (second)", "👑", "Recipe coming soon."),
      placeholder("vegan1", "vegan", "Vegan Holiday Dinner", "🌱", "Recipes coming soon."),
      placeholder("diet1", "dietary", "Dietary Holiday Dinner", "🥗", "Recipes coming soon.")
    ],
    plan: { turkey: turkeyPlan },
    frac, hm, fmtNum
  };
})();
