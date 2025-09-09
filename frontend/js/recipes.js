function renderChefsTips(tips) {
    const section = document.getElementById("chefs-tips");
    section.innerHTML = "<h3>Chef’s Tips</h3>";
    const ul = document.createElement("ul");
    tips.forEach(tip => {
        const li = document.createElement("li");
        li.textContent = tip;
        ul.appendChild(li);
    });
    section.appendChild(ul);
}

function renderServingSuggestions(suggestions) {
    const container = document.querySelector(".other-info");
    const servingH3 = document.createElement("h3");
    servingH3.textContent = "Serving Suggestions";
    container.appendChild(servingH3);

    const ul = document.createElement("ul");
    suggestions.forEach(s => {
        const li = document.createElement("li");
        li.textContent = s;
        ul.appendChild(li);
    });
    container.appendChild(ul);
}

function renderStorage(storageData) {
    const container = document.querySelector(".other-info");
    const storageH3 = document.createElement("h3");
    storageH3.textContent = "Storage and Heating";
    container.appendChild(storageH3);

    const ul = document.createElement("ul");
    storageData.forEach(s => {
        const li = document.createElement("li");
        li.textContent = s;
        ul.appendChild(li);
    });
    container.appendChild(ul);
}

function renderNutritionalInfo(info) {
    const section = document.getElementById("nutritional-info");
    section.innerHTML = "<h3>Nutritional Info (per Serving)</h3>";
    const ul = document.createElement("ul");
    Object.keys(info || {}).forEach(key => {
        if (key !== "Note") {
            const li = document.createElement("li");
            li.textContent = `${key}: ${info[key]}`;
            ul.appendChild(li);
        }
    });

    if (info && info.Note) {
        const noteLi = document.createElement('li');
        noteLi.innerHTML = `<i>${info.Note}</i>`;
        ul.appendChild(noteLi);
    }

    section.appendChild(ul);
}

function renderFaqs(faqs) {
    const faqDiv = document.querySelector(".faqs");
    faqDiv.innerHTML = "<h2>Frequently Asked Questions</h2>";
    const ul = document.createElement("ul");

    faqs.forEach(f => {
        const li = document.createElement("li");
        const span = document.createElement("span");
        span.textContent = f.question;
        li.appendChild(span);
        li.appendChild(document.createTextNode(" " + f.answer));
        ul.appendChild(li);
    });

    faqDiv.appendChild(ul);
}

function renderClosingBox(message) {
    const box = document.querySelector(".closing-box span i");
    box.textContent = `"${message}"`;
}

function renderNextSuggestion(next) {
    const nextDiv = document.querySelector(".next-suggestion");
    const title = (next && next.title) ? next.title : '';
    const link = (next && next.link) ? next.link : '#';
    nextDiv.innerHTML = `\n    <span>Continue with <i class="fa-solid fa-arrow-right"></i></span>\n    <span><h3 id="next-title">${title}</h3><a href="${link}"><i class="fa-solid fa-arrow-right-long"></i></a></span>\n  `;
}

// Initialize: try loading local data first; avoid assuming a global `recipe`.
(async function init() {
    try {
        const res = await fetch('/data/recipes.json');
        if (!res.ok) throw new Error('Local data not available');
        const data = await res.json();
        // if file contains array, pick first recipe for this page
        const recipe = Array.isArray(data) ? data[0] : data;
        if (!recipe) throw new Error('No recipe data found in /data/recipes.json');

        renderChefsTips(recipe.chefsTips || []);
        renderServingSuggestions(recipe.servingSuggestions || []);
        renderStorage(recipe.storageAndHeating || []);
        renderNutritionalInfo(recipe.nutritionalInfo || {});
        renderFaqs(recipe.faqs || []);
        renderClosingBox(recipe.closingMessage || '');
        renderNextSuggestion(recipe.nextSuggestion || {});
    } catch (err) {
        console.error('Error loading recipe data locally:', err);
        // expose renderers to window so other scripts (or manual initialization) can call them
        window.renderChefsTips = renderChefsTips;
        window.renderServingSuggestions = renderServingSuggestions;
        window.renderStorage = renderStorage;
        window.renderNutritionalInfo = renderNutritionalInfo;
        window.renderFaqs = renderFaqs;
        window.renderClosingBox = renderClosingBox;
        window.renderNextSuggestion = renderNextSuggestion;
    }
})();

// Examples / notes:
// If you must fetch from a remote API, ensure CORS is enabled on that server or use a server-side proxy.
// Example local fetch: fetch('/data/recipes.json').then(res => res.json()).then(data => ...)
// When building image src, use '/img/' prefix: imgElement.src = '/img/' + fileName;
