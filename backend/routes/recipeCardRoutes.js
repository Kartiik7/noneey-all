const express = require("express");
const router = express.Router();
const Recipe = require("../model/recipeModel"); // adjust path if needed

// Get all recipes (but only card data)
router.get("/", async (req, res) => {
  try {
    const recipes = await Recipe.find({}, "title image description");
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
