const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
  id: Number,
  title: String,
  image: String,
  cookingTime: String,
  difficulty: String,
  budget: String,
  rating: String,
  link: String
});

module.exports = mongoose.model("Recipe", recipeSchema, "recipes");
// 3rd arg "recipes" ensures it uses the "recipes" collection in recipeDB
