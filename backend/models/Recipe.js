const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
  category: String,
  items: [String]
}, { _id: false });

const instructionSchema = new mongoose.Schema({
  steps: String,
  items: [String]
}, { _id: false });

const faqSchema = new mongoose.Schema({
  question: String,
  answer: String
}, { _id: false });

const nextSuggestionSchema = new mongoose.Schema({
  label: String,
  title: String,
  link: String
}, { _id: false });

const recipeSchema = new mongoose.Schema({
  id: String,
  title: String,
  description: String,
  imageUrl: String, // preferred
  image: String,    // older records may use this
  quote: String,
  quickInfo: {
    prepTime: String,
    cookTime: String,
    totalTime: String,
    servings: String,
    difficulty: String,
    budget: String
  },
  introduction: [String],
  history: [String],
  inner1: [String],
  ytlink: [String],
  ingredients: [ingredientSchema],
  instructions: [instructionSchema],
  chefsTips: [String],
  servingSuggestions: [String],
  storageAndHeating: [String],
  nutritionalInfo: mongoose.Schema.Types.Mixed,
  faqs: [faqSchema],
  closingMessage: String,
  nextSuggestion: nextSuggestionSchema,
  rating: Number,
  avgRating: Number
}, { timestamps: true });

module.exports = mongoose.models.Recipe || mongoose.model('Recipe', recipeSchema);
