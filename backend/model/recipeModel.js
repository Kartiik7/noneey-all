// Node.js/Mongoose Recipe model template
const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
    id: Number,
    title: String,
    description: String,
    image: String,
    quote: String,
    quickInfo: {
        prepTime: String,
        cookTime: String,
        totalTime: String,
        servings: String,
        difficulty: String
    },
    introduction: [String],
    history: [String],
    inner1: [String],
    ytlink: [String],
    ingredients: [
        {
            category: String,
            items: [String]
        }
    ],
    instructions: [
        {
            steps: String,
            items: [String]
        }
    ],
    chefsTips: [String],
    servingSuggestions: [String],
    storageAndHeating: [String],
    nutritionalInfo: mongoose.Schema.Types.Mixed,
    faqs: [
        {
            question: String,
            answer: String
        }
    ],
    closingMessage: String,
    nextSuggestion: {
        label: String,
        title: String,
        link: String
    }
});

module.exports = mongoose.model('Recipe', RecipeSchema);

// ✅ Corrected renderNextSuggestion
function renderNextSuggestion(next) {
    const suggestionBox = document.querySelector(".next-suggestion");
    const label = suggestionBox.querySelector(".label");
    const link = suggestionBox.querySelector(".next-link");

    if (next) {
        label.textContent = next.label || "Continue with";
        link.href = next.link;

        const icon = link.querySelector("i");
        link.textContent = next.title;
        if (icon) link.appendChild(icon);
    } else {
        suggestionBox.style.display = "none";
    }
}

function renderIngredients(ingredientsData) {
    const container = document.getElementById("ingredients");
    container.innerHTML = "<h3>Ingredients</h3>"; // reset section with heading

    ingredientsData.forEach(group => {
        // create category heading
        const h4 = document.createElement("h4");
        h4.textContent = group.category;
        container.appendChild(h4);

        // create list
        const ul = document.createElement("ul");
        group.items.forEach(item => {
            const li = document.createElement("li");
            li.textContent = item;
            ul.appendChild(li);
        });

        container.appendChild(ul);
    });
}

function renderSteps(InstructionSteps) {
    const container = document.getElementById("instructions");
    container.innerHTML = "<h3>Instructions</h3>";

    InstructionSteps.forEach(grp => {
        const h4 = document.createElement("h4");
        h4.textContent = grp.steps;
        container.appendChild(h4);

        const ol = document.createElement("ol");
        grp.items.forEach(item => {
            const li = document.createElement("li");
            li.textContent = item;
            ol.appendChild(li);
        })
        container.appendChild(ol);
    });
}

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
    const suggestionBox = document.querySelector(".next-suggestion");
    const label = suggestionBox.querySelector(".label");
    const link = suggestionBox.querySelector(".next-link");

    if (next) {
        label.textContent = "Continue with";
        link.href = next.link;
        link.innerHTML = `${next.title} <i class="fa-solid fa-arrow-right-long"></i>`;
    } else {
        suggestionBox.style.display = "none"; // hide if no suggestion
    }
}


