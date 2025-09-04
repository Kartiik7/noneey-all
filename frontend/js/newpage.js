// ✅ Get recipe ID from URL
function getRecipeId() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id"); // e.g., newPage.html?id=1
}

// ✅ Render Ingredients
function renderIngredients(ingredientsData) {
  const container = document.getElementById("ingredients");
  container.innerHTML = "<h3>Ingredients</h3>"; 
  const ul = document.createElement("ul");
  ingredientsData.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    ul.appendChild(li);
  });
  container.appendChild(ul);
}

// ✅ Render Instructions
function renderSteps(stepsData) {
  const container = document.getElementById("instructions");
  container.innerHTML = "<h3>Instructions</h3>";
  const ol = document.createElement("ol");
  stepsData.forEach(step => {
    const li = document.createElement("li");
    li.textContent = step;
    ol.appendChild(li);
  });
  container.appendChild(ol);
}

// ✅ Render Chef’s Tips
function renderChefsTips(tips) {
  const container = document.getElementById("chefs-tips");
  container.innerHTML = "<h3>Chef’s Tips</h3>";
  const ul = document.createElement("ul");
  tips.forEach(tip => {
    const li = document.createElement("li");
    li.textContent = tip;
    ul.appendChild(li);
  });
  container.appendChild(ul);
}

// ✅ Render Serving Suggestions
function renderServingSuggestions(suggestions) {
  const container = document.getElementById("serving-suggestions");
  container.innerHTML = "<h3>Serving Suggestions</h3>";
  const ul = document.createElement("ul");
  suggestions.forEach(s => {
    const li = document.createElement("li");
    li.textContent = s;
    ul.appendChild(li);
  });
  container.appendChild(ul);
}

// ✅ Render Storage
function renderStorage(storageData) {
  const container = document.getElementById("storage-and-heating");
  container.innerHTML = "<h3>Storage and Heating</h3>";
  const ul = document.createElement("ul");
  storageData.forEach(s => {
    const li = document.createElement("li");
    li.textContent = s;
    ul.appendChild(li);
  });
  container.appendChild(ul);
}

// ✅ Render Nutritional Info
function renderNutritionalInfo(info) {
  const container = document.getElementById("nutritional-info");
  container.innerHTML = "<h3>Nutritional Info (per Serving)</h3>";
  const ul = document.createElement("ul");
  Object.keys(info).forEach(key => {
    if (key !== "Note") {
      const li = document.createElement("li");
      li.textContent = `${key}: ${info[key]}`;
      ul.appendChild(li);
    }
  });
  if (info.Note) {
    const note = document.createElement("i");
    note.textContent = info.Note;
    ul.appendChild(note);
  }
  container.appendChild(ul);
}

// ✅ Render FAQs
function renderFaqs(faqs) {
  const faqDiv = document.querySelector(".faqs");
  faqDiv.innerHTML = "<h2>Frequently Asked Questions</h2>";
  const ul = document.createElement("ul");
  faqs.forEach(f => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>Q:</strong> ${f.question}<br><strong>A:</strong> ${f.answer}`;
    ul.appendChild(li);
  });
  faqDiv.appendChild(ul);
}

// ✅ Render Closing Box
function renderClosingBox(message) {
  const box = document.querySelector(".closing-box span i");
  box.textContent = message;
}

// ✅ Render Next Suggestion
function renderNextSuggestion(next) {
  const suggestionBox = document.querySelector(".next-suggestion");
  const label = suggestionBox.querySelector(".label");
  const link = suggestionBox.querySelector(".next-link");

  if (next) {
    label.textContent = "Continue with";
    link.href = next.link;
    link.innerHTML = `${next.title} <i class="fa-solid fa-arrow-right-long"></i>`;
  } else {
    suggestionBox.style.display = "none"; 
  }
}

// ✅ Fetch Recipe Data from JSON
async function loadRecipe() {
  try {
    const response = await fetch("../data/recipes.json"); // adjust path
    if (!response.ok) throw new Error("Failed to load recipes.json");

    const data = await response.json();
    const recipeId = getRecipeId();
    const recipe = data.find(r => r.id == recipeId);

    if (!recipe) {
      document.querySelector(".main-container2").innerHTML =
        "<h2>Recipe not found</h2>";
      return;
    }

    // ✅ Fill top-level details
    document.querySelector(".main-container2 > h1").textContent = recipe.title;
    document.getElementById("description-para").textContent = recipe.description || "";
    document.getElementById("main-img").src = recipe.image || "../img/default.png";

    // ✅ Call renderers
    if (recipe.ingredients) renderIngredients(recipe.ingredients);
    if (recipe.instructions) renderSteps(recipe.instructions);
    if (recipe.chefsTips) renderChefsTips(recipe.chefsTips);
    if (recipe.servingSuggestions) renderServingSuggestions(recipe.servingSuggestions);
    if (recipe.storage) renderStorage(recipe.storage);
    if (recipe.nutritionalInfo) renderNutritionalInfo(recipe.nutritionalInfo);
    if (recipe.faqs) renderFaqs(recipe.faqs);
    if (recipe.closingMessage) renderClosingBox(recipe.closingMessage);
    if (recipe.next) renderNextSuggestion(recipe.next);

  } catch (err) {
    console.error("Error loading recipe:", err);
  }
}

// ✅ Run on page load
// loadRecipe();
