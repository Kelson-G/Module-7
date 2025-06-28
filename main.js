import recipes from './recipes.mjs';

// Generate a random integer from 0 to num-1
function random(num) {
  return Math.floor(Math.random() * num);
}

// Get a random entry from a list
function getRandomListEntry(list) {
  return list[random(list.length)];
}

// Generate HTML for tags
function tagsTemplate(tags) {
  return tags
    .map(tag => `<span class="tag">${tag}</span>`)
    .join(' ');
}

// Generate HTML for ratings (out of 5)
function ratingTemplate(rating) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  let html = `<span class="rating" role="img" aria-label="Rating: ${rating} out of 5 stars">`;
  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      html += `<span aria-hidden="true" class="icon-star">⭐</span>`;
    } else if (i === fullStars && halfStar) {
      html += `<span aria-hidden="true" class="icon-star">⭐</span>`;
    } else {
      html += `<span aria-hidden="true" class="icon-star-empty">☆</span>`;
    }
  }
  html += `</span>`;
  return html;
}

// Generate HTML for a recipe card
function recipeTemplate(recipe) {
  return `
    <section class="recipe-card">
      <img src="${recipe.image.replace('./', '')}" alt="${recipe.name}">
      <div class="recipe-info">
        ${tagsTemplate(recipe.tags)}
        <h2 class="recipe-title">
          <a href="${recipe.url || '#'}">${recipe.name}</a>
        </h2>
        ${ratingTemplate(recipe.rating)}
        <p class="description">
          ${recipe.description}
        </p>
      </div>
    </section>
  `;
}

// Render a list of recipes to the main element
function renderRecipes(recipeList) {
  const main = document.querySelector('main');
  main.innerHTML = recipeList.map(recipeTemplate).join('');
}

// Filter recipes by query
function filterRecipes(query) {
  const filtered = recipes.filter(recipe => {
    const q = query.toLowerCase();
    return (
      recipe.name.toLowerCase().includes(q) ||
      (recipe.description && recipe.description.toLowerCase().includes(q)) ||
      (recipe.tags && recipe.tags.find(tag => tag.toLowerCase().includes(q))) ||
      (recipe.recipeIngredient && recipe.recipeIngredient.find(ing => ing.toLowerCase().includes(q)))
    );
  });
  return filtered.sort((a, b) => a.name.localeCompare(b.name));
}

// Handle search form submit
function searchHandler(e) {
  e.preventDefault();
  const input = document.querySelector('.search-form input[type="search"]');
  const query = input.value.trim().toLowerCase();
  if (query === '') {
    renderRecipes([getRandomListEntry(recipes)]);
  } else {
    const filtered = filterRecipes(query);
    renderRecipes(filtered.length ? filtered : []);
  }
}

function init() {
  renderRecipes([getRandomListEntry(recipes)]);
  document.querySelector('.search-form').addEventListener('submit', searchHandler);
}

init();