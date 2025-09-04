const RecipeSuggestion = require("../model/recipeSuggestionModel");
const Recipe = require("../model/recipeModel");  // your main recipe model
const { validationResult } = require('express-validator');

// 1. User submits suggestion
exports.submitSuggestion = async (req, res) => {
    try {
        // Validate required fields
        const { title, authorName, email } = req.body;
        if (!title || !authorName || !email) {
            return res.status(400).json({ 
                error: "Missing required fields: title, authorName, and email are required" 
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Invalid email format" });
        }

        const newSuggestion = new RecipeSuggestion({
            ...req.body,
            status: "pending"
        });
        await newSuggestion.save();
        res.status(201).json({ message: "Suggestion submitted, waiting for review." });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// 2. Admin fetches all suggestions
exports.getSuggestions = async (req, res) => {
    try {
        const suggestions = await RecipeSuggestion.find({ status: "pending" });
        res.json(suggestions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 3. Admin approves -> move to main recipes collection
exports.approveSuggestion = async (req, res) => {
    try {
        const suggestion = await RecipeSuggestion.findById(req.params.id);
        if (!suggestion) return res.status(404).json({ message: "Not found" });

        // normalize suggestion data to match Recipe schema expectations
        const transformIngredients = (ing) => {
            // RecipeSchema expects [{ category, items: [String] }]
            if (!ing) return [];
            if (Array.isArray(ing) && ing.length && typeof ing[0] === 'string') {
                return [{ category: 'Main', items: ing }];
            }
            return ing; // assume already in correct shape
        };

        const transformInstructions = (steps) => {
            // RecipeSchema expects [{ steps: String, items: [String] }]
            if (!steps) return [];
            if (Array.isArray(steps) && steps.length && typeof steps[0] === 'string') {
                return [{ steps: 'Steps', items: steps }];
            }
            return steps; // assume already in correct shape
        };

        const newRecipe = new Recipe({
            title: suggestion.title,
            description: suggestion.description,
            ingredients: transformIngredients(suggestion.ingredients),
            instructions: transformInstructions(suggestion.steps),
            image: suggestion.image,
            video: suggestion.video,
            authorName: suggestion.authorName,
            email: suggestion.email,
            approvedBy: req.user?.username || req.user
        });
        await newRecipe.save();

        suggestion.status = "approved";
        await suggestion.save();

        res.json({ message: "Suggestion approved and published", recipe: newRecipe });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 4. Admin rejects/deletes suggestion
exports.rejectSuggestion = async (req, res) => {
    try {
        await RecipeSuggestion.findByIdAndDelete(req.params.id);
        res.json({ message: "Suggestion rejected/deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
