// Runs after DOM is ready (or use <script defer>)
document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".main-container-recipe");
  if (!container) {
    console.error("Container .main-container-recipe not found");
    return;
  }

  // Always use deployed Render backend
  const API_BASE = "https://remebrer.onrender.com";

  // Primary fetch: recipeCards endpoint (no limit)
  fetch(`${API_BASE}/api/recipesCard`)
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then((raw) => {
      const recipes = Array.isArray(raw) ? raw : [];
      if (!recipes.length) throw new Error("Empty recipe list");
      renderCards(recipes);
    })
    .catch((err) => {
      console.warn("Falling back to local recipeCards.json:", err.message);

      // Fallback: local static JSON
      // fetch("../data/recipeCards.json")
      //   .then((r) =>
      //     r.ok ? r.json() : Promise.reject(new Error(`Fallback HTTP ${r.status}`))
      //   )
      //   .then((data) => renderCards(Array.isArray(data) ? data : [data]))
      //   .catch((fbErr) => {
      //     console.error("Error loading any recipes:", fbErr);
      //     container.insertAdjacentHTML(
      //       "afterbegin",
      //       `<p style="color:#b00">Could not load recipes. Check Console.</p>`
      //     );
      //   });
    });

  function renderCards(recipes) {
    const frag = document.createDocumentFragment();

    recipes.forEach((r) => {
      const id = r._id || r.id || "";
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
