// controllers/recipeController.js
const Recipe = require('../model/recipeModel');

// controllers/recipeController.js
exports.filterRecipes = async (req, res) => {
	try {
		const filter = {};

		// Cuisine filter
		if (req.query.cuisine) filter.cuisine = req.query.cuisine;

		// Difficulty filter (case-insensitive)
		if (req.query.difficulty)
			filter['quickInfo.difficulty'] = new RegExp('^' + req.query.difficulty + '$', 'i');

		// Title search (case-insensitive)
		if (req.query.search)
			filter.title = new RegExp(req.query.search, 'i');

		// Pagination & Sorting
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 10;
		const sortField = req.query.sort || 'title'; // default sort by title

		let recipes = await Recipe.find(filter)
			.sort({ [sortField]: 1 }) // 1 for ascending, -1 for descending
			.skip((page - 1) * limit)
			.limit(limit);

		// PrepTime filtering (still works after Mongo filter)
		if (req.query.prepTime) {
			const maxPrep = Number(req.query.prepTime);
			recipes = recipes.filter(r => {
				if (!r.quickInfo || !r.quickInfo.prepTime) return false;
				const match = r.quickInfo.prepTime.match(/(\d+)/);
				const prep = match ? Number(match[1]) : 0;
				return prep <= maxPrep;
			});
		}

		res.json({
			page,
			limit,
			count: recipes.length,
			recipes,
		});
	} catch (err) {
		res.status(500).json({ error: 'Failed to filter recipes', details: err.message });
	}
};


// controllers/recipeController.js
exports.getRecipeById = async (req, res) => {
	try {
		const recipe = await Recipe.findById(req.params.id);
		if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
		res.json(recipe);
	} catch (err) {
		res.status(500).json({ error: 'Failed to fetch recipe', details: err.message });
	}
};

// Create a new recipe
exports.createRecipe = async (req, res) => {
	try {
		const payload = req.body;
		const newRecipe = new Recipe(payload);
		await newRecipe.save();
		res.status(201).json(newRecipe);
	} catch (err) {
		res.status(500).json({ error: 'Failed to create recipe', details: err.message });
	}
};

// Update existing recipe
exports.updateRecipe = async (req, res) => {
	try {
		const updated = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
		if (!updated) return res.status(404).json({ message: 'Recipe not found' });
		res.json(updated);
	} catch (err) {
		res.status(500).json({ error: 'Failed to update recipe', details: err.message });
	}
};

// Delete a recipe
exports.deleteRecipe = async (req, res) => {
	try {
		const deleted = await Recipe.findByIdAndDelete(req.params.id);
		if (!deleted) return res.status(404).json({ message: 'Recipe not found' });
		res.json({ message: 'Recipe deleted' });
	} catch (err) {
		res.status(500).json({ error: 'Failed to delete recipe', details: err.message });
	}
};
