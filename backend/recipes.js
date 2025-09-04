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
    Object.keys(info).forEach(key => {
        if (key !== "Note") {
            const li = document.createElement("li");
            li.textContent = `${key}: ${info[key]}`;
            ul.appendChild(li);
        }
    });

    const note = document.createElement("i");
    note.textContent = info.Note;
    ul.appendChild(note);

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
    nextDiv.innerHTML = `
    <span>Continue with <i class="fa-solid fa-arrow-right"></i></span><br>
    <span>${next.label} <a href="${next.link}"><i class="fa-solid fa-arrow-right-long"></i></a></span>
  `;
}

// Example usage after fetching recipe JSON
renderChefsTips(recipe.chefsTips);
renderServingSuggestions(recipe.servingSuggestions);
renderStorage(recipe.storageAndHeating);
renderNutritionalInfo(recipe.nutritionalInfo);
renderFaqs(recipe.faqs);
renderClosingBox(recipe.closingMessage);
renderNextSuggestion(recipe.nextSuggestion);
