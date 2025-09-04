const mongoose = require("mongoose");

const recipeSuggestionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    ingredients: [String],
    steps: [String],
    image: String,
    video: String,
    authorName: { type: String, required: true },
    email: { type: String, required: true },
    status: { type: String, default: "pending" }, // pending, approved, rejected
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("RecipeSuggestion", recipeSuggestionSchema);
