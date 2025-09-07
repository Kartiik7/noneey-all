// Runs after DOM is ready (or use <script defer>)
document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".main-container-recipe");
  if (!container) {
    console.error("Container .main-container-recipe not found");
    return;
  }

  const API_BASE = "https://noneey-all-1.onrender.com";

  async function loadRecipeCards() {
    try {
      const res = await fetch(`${API_BASE}/api/recipesCard`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const raw = await res.json();
      const recipes = Array.isArray(raw) ? raw : [];
      if (!recipes.length) throw new Error("Empty recipe list");

      // debug first item to verify server shape during development
      console.debug("Loaded recipe cards (sample):", recipes[0]);

      renderCards(recipes);
    } catch (err) {
      console.error("Error loading recipe cards from backend:", err);
      container.insertAdjacentHTML(
        "afterbegin",
        `<p style="color:#b00">Could not load recipes from server. Check backend or console.</p>`
      );
    }
  }
  loadRecipeCards();

  function renderCards(recipes) {
    const frag = document.createDocumentFragment();

    recipes.forEach((r) => {
      const id = r.id || r._id || "";
      const title = r.title || r.name || "Untitled";

      // image fallbacks commonly used in DBs
      const img = r.imageUrl || r.image || r.img || r.imagePath || "";

      // prefer explicit fields used in your recipeCards collection
      const cookTime =
        r.cookingTime ||
        r.cookTime ||
        (r.quickInfo && r.quickInfo.cookTime) ||
        "-";
      const difficulty =
        r.difficulty ||
        (r.quickInfo && r.quickInfo.difficulty) ||
        "-";
      const budget =
        r.budget ||
        (r.quickInfo && r.quickInfo.budget) ||
        "-";
      const rating =
        r.rating !== undefined && r.rating !== null && r.rating !== ""
          ? r.rating
          : r.avgRating !== undefined
          ? r.avgRating
          : "-";

      // prefer DB-provided link if present (may already include ?id=...)
      const link = r.link
        ? r.link
        : id
        ? `newpage.html?id=${encodeURIComponent(id)}`
        : "#";

      const card = document.createElement("div");
      card.className = "recipe1";
      card.innerHTML = `
        <div class="in1">
          <a href="${link}">
            <img src="${img}" alt="${title}">
          </a>
          <li><a href="${link}">${title}</a></li>
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