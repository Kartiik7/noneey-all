// Runs after DOM is ready (or use <script defer>)
document.addEventListener("DOMContentLoaded", () => {
    const container = document.querySelector(".main-container-recipe");
    if (!container) {
        console.error("Container .main-container-recipe not found");
        return;
    }

    fetch("../data/recipeCards.json") // adjust path if needed
        .then((res) => {
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return res.json();
        })
        .then((data) => {
            const recipes = Array.isArray(data) ? data : [data]; // tolerate single object
            const frag = document.createDocumentFragment();

            recipes.forEach((r) => {
                const card = document.createElement("div");
                card.className = "recipe1";

                // build the exact structure you showed
                card.innerHTML = `
          <div class="in1">
            <img src="${r.image || ""}" alt="${r.title || "Recipe"}">
            <li><a href="${r.link || `newpage.html?id=${r.id}`}">${r.title || "Untitled"}</a></li>
          </div>
          <div class="ou2">
            <ul>
              <li>Cooking Time: ${r.cookingTime || "-"}</li>
              <li>${r.difficulty || "-"}</li>
            </ul>
            <ul>
              <li>Budget: ${r.budget || "-"}</li>
              <li>Rating: ${r.rating || "-"}</li>
            </ul>
          </div>
        `;
                frag.appendChild(card);
            });

            // clear and append
            container.innerHTML = "";
            container.appendChild(frag);
        })
        .catch((err) => {
            console.error("Error fetching recipesList.json:", err);
            container.insertAdjacentHTML(
                "afterbegin",
                `<p style="color:#b00">Could not load recipes. Check Console.</p>`
            );
        });
});
