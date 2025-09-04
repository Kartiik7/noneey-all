const mongoose = require('mongoose');

// Check if the model is already defined
if (mongoose.models && mongoose.models.Recipe) {
    module.exports = mongoose.models.Recipe;
} else {
    const recipeSchema = new mongoose.Schema({
        title: String,
        description: String,
        imageUrl: String,
        ingredients: [String],
        instructions: [String],
        prepTime: String,
        cookTime: String,
        totalTime: String,
        servings: String,
        difficulty: String,
        videoUrl: String,
        whyLove: [String],
        chefsTips: [String],
        servingSuggestions: String,
        storageAndHeating: String,
        nutritionalInfo: String,
        otherInfo: String
    });

    module.exports = mongoose.model('Recipe', recipeSchema);
}
