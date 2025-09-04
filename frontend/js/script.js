(function () {
    const bySel = (s, root = document) => root.querySelector(s);
    const byAll = (s, root = document) => Array.from(root.querySelectorAll(s));

    const setText = (sel, text) => {
        const el = bySel(sel);
        if (el && text != null) el.textContent = text;
    };

    const setHTML = (sel, html) => {
        const el = bySel(sel);
        if (el && html != null) el.innerHTML = html;
    };

    const setAttr = (sel, attr, value) => {
        const el = bySel(sel);
        if (el && value != null) el.setAttribute(attr, value);
    };

    const getIdFromURL = () => {
        const params = new URLSearchParams(window.location.search);
        return params.get("id");
    };

    const pickRecipe = (data) => {
        const idParam = getIdFromURL();
        // Support array OR single object JSON
        const recipes = Array.isArray(data) ? data : [data];

        if (!recipes.length) return null;

        if (!idParam) return recipes[0]; // default to first

        const idNum = Number(idParam);
        // match number or string id
        return recipes.find(r => r.id == idNum) || recipes[0];
    };

    const buildList = (items) =>
        `<ul>${(items || []).map(it => `<li>${it}</li>`).join("")}</ul>`;

    const buildOl = (items) =>
        `<ol>${(items || []).map(it => `<li>${it}</li>`).join("")}</ol>`;

    const renderRecipe = (recipe) => {
        if (!recipe) {
            setHTML(".main-container2", `<p>Recipe not found.</p>`);
            return;
        }

        // Title, description, image, quote
        setText(".main-container2 h1", recipe.title);
        setText("#description-para", recipe.description);
        setAttr("#main-img", "src", recipe.image);
        setAttr("#main-img", "alt", recipe.title);
        const quoteI = bySel(".img-div span i");
        if (quoteI) quoteI.textContent = recipe.quote || "";

        // Quick info
        const vals = [
            recipe.quickInfo?.prepTime,
            recipe.quickInfo?.cookTime,
            recipe.quickInfo?.totalTime,
            recipe.quickInfo?.servings,
            recipe.quickInfo?.difficulty
        ];
        byAll(".quick-info-table .column li").forEach((li, i) => {
            if (vals[i] != null) li.textContent = vals[i];
        });

        // Introduction
        setHTML(".intro-box",
            `<h2>Introduction</h2>${buildList(recipe.introduction)}`
        );

        // History
        setHTML(".history-box",
            `<h2>Origin of Shahi Biryani</h2>${buildList(recipe.history)}`
        );

        // Why you'll love
        setHTML("#inner1",
            `<h3>Why you'll Love this Recipe</h3>${buildList(recipe.inner1)}`
        );

        // YouTube
        const yt = recipe.ytlink?.[0];
        if (yt) setAttr(".yt-vid iframe", "src", yt);

        // Ingredients
        const ingHTML = (recipe.ingredients || []).map(g => `
      <h4>${g.category}</h4>
      ${buildList(g.items)}
    `).join("");
        setHTML("#ingredients", `<h3>Ingredients</h3>${ingHTML}`);

        // Instructions
        const stepsHTML = (recipe.instructions || []).map(s => `
      <h4>${s.steps}</h4>
      ${buildOl(s.items)}
    `).join("");
        setHTML("#instructions", `<h3>Instructions</h3>${stepsHTML}`);

        // Chef’s tips
        setHTML("#chefs-tips", `<h3>Chef’s Tips</h3>${buildList(recipe.chefsTips)}`);

        // Other info (Serving + Storage)
        const other = bySel(".other-info");
        if (other) {
            other.innerHTML = `
        <h3>Serving Suggestions</h3>
        ${buildList(recipe.servingSuggestions)}
        <h3>Storage and Heating</h3>
        ${buildList(recipe.storageAndHeating)}
        <section id="nutritional-info"></section>
        <div class="faqs"></div>
      `;
        }

        // Nutrition
        const n = recipe.nutritionalInfo || {};
        setHTML("#nutritional-info", `
      <h3>Nutrional Info(per Serving)</h3>
      <ul>
        <li>Calories: ${n.Calories || "-"}</li>
        <li>Protein: ${n.Protein || "-"}</li>
        <li>Carbs: ${n.Carbs || "-"}</li>
        <li>Fat: ${n.Fat || "-"}</li>
        <li>Fiber: ${n.Fiber || "-"}</li>
        <i>${n.Note || ""}</i>
      </ul>
    `);

        // FAQs
        const faqs = bySel(".faqs");
        if (faqs) {
            faqs.innerHTML = `
        <h2>Frequently Asked Questions</h2>
        <ul>
          ${(recipe.faqs || []).map(f => `
            <li><span>${f.question}</span> ${f.answer}</li>
          `).join("")}
        </ul>
      `;
        }

        // Closing
        const closingI = bySel(".closing-box span i");
        if (closingI) closingI.textContent = recipe.closingMessage || "";

        // Next suggestion
        const next = recipe.nextSuggestion || {};
        const nextBox = bySel(".next-suggestion");
        if (nextBox) {
            nextBox.innerHTML = `
        <span>${next.label || "Continue with"} <i class="fa-solid fa-arrow-right"></i></span><br>
        <span>${next.title || ""} <a href="${next.link || "#"}">
          <i class="fa-solid fa-arrow-right-long"></i></a></span>
      `;
        }
    };

    // Load data
    fetch("https://remebrer.onrender.com/api/recipes")   // unified deployed backend
    .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
    })
    .then(data => {
        // Assuming you already have functions renderRecipe() & pickRecipe()
        renderRecipe(pickRecipe(data));
    })
    .catch(err => {
        console.error("Error fetching recipe(s):", err);
        const root = document.querySelector(".main-container2");
        if (root) {
            root.insertAdjacentHTML("afterbegin",
                `<p style="color:#b00">Failed to load recipes. Check console.</p>`
            );
        }
    });
})();
