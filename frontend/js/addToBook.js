// addToBook.js - modular LocalStorage handler for "My Book"
(function () {
  const KEY = "myBook";

  const getStored = () => {
    try {
      return JSON.parse(localStorage.getItem(KEY)) || [];
    } catch (e) {
      console.error("Failed to parse myBook from localStorage", e);
      return [];
    }
  };

  const saveStored = (arr) => {
    try {
      localStorage.setItem(KEY, JSON.stringify(arr));
    } catch (e) {
      console.error("Failed to save myBook to localStorage", e);
    }
  };

  const getRecipeIdFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
  };

  // Synchronous save by normalized id (used as fallback)
  const addRecipeByIdSync = (idStr) => {
    if (!idStr) return { ok: false, reason: "no-id" };
    const normalized = String(idStr);
    const list = getStored();
    if (list.includes(normalized)) return { ok: false, reason: "exists" };
    list.push(normalized);
    saveStored(list);
    return { ok: true };
  };

  // Async: attempt to resolve canonical backend id (_id or id) before saving
  async function addRecipeById(id) {
    if (!id) return { ok: false, reason: "no-id" };
    const origins = [];
    // prefer local backend first
    origins.push('http://localhost:5000');
    origins.push('https://noneey-all-1.onrender.com');
    if (window.location && window.location.origin && window.location.origin !== 'null') origins.push(window.location.origin);

    for (const origin of origins) {
      try {
        const url = `${origin.replace(/\/$/, '')}/api/recipes/${id}`;
        const resp = await fetch(url, { cache: 'no-store' });
        if (!resp.ok) continue;
        const data = await resp.json();
        const canonical = data._id || data.id || id;
        return addRecipeByIdSync(canonical);
      } catch (e) {
        // try next origin
      }
    }

    // fallback: save the raw id string so UX isn't blocked
    return addRecipeByIdSync(id);
  }

  // Public: attach behavior to button if present
  function init() {
    const btn = document.getElementById("addToBookBtn") || document.getElementById("add-to-book");
    if (!btn) return;

    btn.addEventListener("click", async (ev) => {
      ev.preventDefault();
      const id = getRecipeIdFromUrl();
      const res = await addRecipeById(id);
      if (res.ok) {
        alert("Recipe added to My Book!");
      } else if (res.reason === "exists") {
        alert("This recipe is already in My Book.");
      } else {
        alert("Unable to add recipe (missing id).");
      }
    });
  }

  // auto init on DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // export for future extension
  window.MyBook = window.MyBook || {};
  window.MyBook.addRecipeById = addRecipeById;
  window.MyBook.getAll = getStored;
})();
