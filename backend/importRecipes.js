// importRecipes.js
require('dotenv').config();
const mongoose = require('mongoose');
const Recipe = require('./model/recipeModel');
const fs = require('fs');
const path = require('path');

// Accept an env var FILE or CLI arg for which file to import (default: recipes.json)
const fileArg = process.env.FILE || process.argv[2] || 'recipes.json';
const dataPath = path.join(__dirname, '..', 'frontend', 'data', fileArg);

if (!fs.existsSync(dataPath)) {
    console.error('File not found:', dataPath);
    process.exit(1);
}

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(async () => {
    try {
        const raw = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        let docs = raw;

        // If importing recipeCards (summary objects), map them to the schema minimally
        if (fileArg.toLowerCase().includes('recipecard')) {
            docs = raw.map(r => ({
                id: r.id,
                title: r.title,
                description: '',
                image: r.image,
                quickInfo: {
                    cookTime: r.cookingTime || '',
                    difficulty: r.difficulty || ''
                }
            }));
        }

        await Recipe.insertMany(docs, { ordered: false });
        console.log('Recipes imported successfully from', fileArg);
    } catch (err) {
        console.error('Error importing recipes:', err.message || err);
    } finally {
        mongoose.disconnect();
    }
}).catch(err => {
    console.error('MongoDB connection error:', err.message || err);
});