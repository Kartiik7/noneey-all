const express = require("express");
const router = express.Router();
const Recipe = require("../model/recipeModel");

// GET all recipes
router.get("/", async (req, res) => {
  try {
    const recipes = await Recipe.find(); // fetch all from MongoDB
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET recipe by ID
router.get("/:id", async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
