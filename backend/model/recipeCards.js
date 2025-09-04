fetch('/frontend/data/recipeCards.json')
  .then(response => response.json())
  .then(data => {
    const container = document.querySelector('.main-container-recipe');

    data.forEach(recipe => {
      const card = document.createElement('div');
      card.classList.add('recipe1');

      card.innerHTML = `
        <div class="in1">
          <img src="${recipe.image}" alt="${recipe.title}">
          <li><a href="${recipe.link}">${recipe.title}</a></li>
        </div>
        <div class="ou2">
          <ul>
            <li>Cooking Time: ${recipe.cookingTime}</li>
            <li>${recipe.difficulty} Friendly</li>
          </ul>
          <ul>
            <li>Budget: ${recipe.budget}</li>
            <li>Rating: ${recipe.rating}</li>
          </ul>
        </div>
      `;

      container.appendChild(card);
    });
  })
  .catch(err => console.error('Error loading recipe cards:', err));
