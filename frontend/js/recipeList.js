// Runs after DOM is ready (or use <script defer>)
document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".main-container-recipe");
  if (!container) {
    console.error("Container .main-container-recipe not found");
    return;
  }

  // Always use deployed Render backend
  const API_BASE = "https://noneey-all.onrender.com";

  // Primary fetch: recipeCards endpoint (no limit) using async/await
  async function loadRecipeCards() {
    try {
      const res = await fetch(`${API_BASE}/api/recipesCard`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const raw = await res.json();
      const recipes = Array.isArray(raw) ? raw : [];
      if (!recipes.length) throw new Error("Empty recipe list");
      renderCards(recipes);
    } catch (err) {
      console.warn("Falling back to local recipeCards.json:", err.message);
      // Fallback: local static JSON
      try {
        const r = await fetch("../data/recipeCards.json");
        if (!r.ok) throw new Error(`Fallback HTTP ${r.status}`);
        const data = await r.json();
        renderCards(Array.isArray(data) ? data : [data]);
      } catch (fbErr) {
        console.error("Error loading any recipes:", fbErr);
        container.insertAdjacentHTML(
          "afterbegin",
          `<p style="color:#b00">Could not load recipes. Check Console.</p>`
        );
      }
    }
  }
  loadRecipeCards();

  function renderCards(recipes) {
    const frag = document.createDocumentFragment();

    recipes.forEach((r) => {
      const id = r.id || r._id || "";
      const title = r.title || "Untitled";
      const img = r.imageUrl || r.image || "";
      const cookTime =
        (r.quickInfo && r.quickInfo.cookTime) ||
        r.cookTime ||
        r.cookingTime ||
        "-";
      const difficulty =
        (r.quickInfo && r.quickInfo.difficulty) ||
        r.difficulty ||
        "-";
      const budget =
        (r.quickInfo && r.quickInfo.budget) ||
        r.budget ||
        "-";

      const rating =
        r.rating !== undefined && r.rating !== null && r.rating !== ""
          ? r.rating
          : r.avgRating !== undefined
          ? r.avgRating
          : "-";

      const card = document.createElement("div");
      card.className = "recipe1";
      card.innerHTML = `
        <div class="in1">
          <img src="${img}" alt="${title}">
          <li><a href="newpage.html?id=${id}">${title}</a></li>
        </div>
        <div class="ou2">
          <ul>
            <li>Cooking Time: ${cookTime}</li>
            <li>${difficulty}</li>
          </ul>
          <ul>
            <li>Budget: ${budget}</li>
            <li>Rating: ${rating}</li>
          </ul>
        </div>
      `;
      frag.appendChild(card);
    });

    container.innerHTML = "";
    container.appendChild(frag);
  }
});
