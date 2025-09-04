const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const userRoutes = require('./routes/userRoutes');
const signupRoutes = require('./routes/signup');
const loginRoutes = require('./routes/login');
const refreshRoutes = require('./routes/refresh');
const recipeFilter = require('./routes/recipe');
const authRoutes = require("./routes/authRoutes");
const suggestionRoutes = require("./routes/suggestionRoutes");
const recipeRoutes = require("./routes/recipeRoutes");
const recipeCardRoutes = require('./routes/recipeCardRoutes');
require('dotenv').config();
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Connect only once
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

// Import the Recipe model
const Recipe = require('./models/Recipe');

// Middlewares
app.use(cors({ origin: true, credentials: true }));
app.use('/frontend', express.static(path.join(__dirname, '..', 'frontend')));
app.use('/img', express.static(path.join(__dirname, '..', 'frontend', 'img'))); // serve images
app.use(cookieParser());
app.use(bodyParser.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/signup', signupRoutes);
app.use('/api/login', loginRoutes);
app.use('/api/refresh', refreshRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/recipesFilter', recipeFilter);
app.use("/api/suggestions", suggestionRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/recipesCard", recipeCardRoutes); 

// Test route
app.get('/', (req, res) => {
    res.send("Recipe backend running");
});

// Helper to ensure absolute image URL
function ensureAbsoluteImageUrl(doc, req) {
    if (!doc || !doc.imageUrl) return;
    if (!/^https?:\/\//i.test(doc.imageUrl)) {
        const fileName = doc.imageUrl.replace(/^\/?img\//, '');
        doc.imageUrl = `${req.protocol}://${req.get('host')}/img/${fileName}`;
    }
}

// API endpoint to get a recipe by ID
app.get('/api/recipes/:id', async (req, res) => {
    try {
        let recipe = await Recipe.findById(req.params.id).lean();
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }
        ensureAbsoluteImageUrl(recipe, req);
        res.json(recipe);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
