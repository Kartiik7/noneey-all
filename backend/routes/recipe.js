const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');

// GET /api/recipes?cuisine=Italian&difficulty=Easy&search=pasta&prepTime=20
router.get('/', recipeController.filterRecipes);

// GET /api/recipes/:id
router.get('/:id', recipeController.getRecipeById);

// POST /api/recipes  -> create a new recipe (admin/dev)
router.post('/', recipeController.createRecipe);

// PUT /api/recipes/:id -> update a recipe
router.put('/:id', recipeController.updateRecipe);

// DELETE /api/recipes/:id -> delete a recipe
router.delete('/:id', recipeController.deleteRecipe);

module.exports = router;
