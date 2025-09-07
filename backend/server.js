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
const authRoutes = require("./routes/auth"); // changed to match provided file: auth.js
const suggestionRoutes = require("./routes/suggestionRoutes");
const recipeRoutes = require("./routes/recipeRoutes");
let recipeCardRoutes;
try {
    recipeCardRoutes = require('./routes/recipeCardRoutes');
} catch (e) {
    console.warn('Optional route ./routes/recipeCardRoutes not found or failed to load — continuing without it.');
    recipeCardRoutes = null;
}
const { verifyToken } = require('./middleware/authMiddleware');
require('dotenv').config();
const cookieParser = require('cookie-parser');

const app = express();
// Change default port to 5000 to match frontend fetches to localhost:5000
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
app.use('/frontend', express.static(path.join(__dirname, '..', 'frontend')));
app.use('/img', express.static(path.join(__dirname, '..', 'frontend', 'img'))); // serve images
app.use(cookieParser());
app.use(bodyParser.json());

// CORS config
const allowedOrigins = [
    'http://127.0.0.1:5500',
    'http://localhost:5500',
    'http://localhost:3001',
    'https://noneey-all-1.onrender.com',
    'http://127.0.0.1:5000',
    // add other dev origins as needed
];

app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin (like curl, Postman, or same-origin)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1) {
            return callback(null, true);
        } else {
            return callback(new Error('CORS: Origin not allowed'), false);
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));

// Ensure OPTIONS preflight requests are handled
app.options(/.*/, cors());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/signup', signupRoutes);
app.use('/api/login', loginRoutes);
app.use('/api/refresh', refreshRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/recipesFilter', recipeFilter);
app.use("/api/suggestions", suggestionRoutes);
app.use("/api/recipes", recipeRoutes);
// mount recipeCardRoutes if available (new file)
if (recipeCardRoutes) {
    app.use("/api/recipesCard", recipeCardRoutes);
} else {
    // fallback: provide a simple handler so frontend gets informative 500-level response
    app.get('/api/recipesCard', (req, res) => {
        res.status(500).json({ message: "recipeCardRoutes not available on server" });
    });
}

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

// Fallback current user endpoint if /api/auth/me unavailable on some deployments
app.get('/api/me', verifyToken, (req, res) => {
    if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
    const { _id, username, email, role, createdAt, updatedAt } = req.user;
    res.json({ id: _id, username, email, role, createdAt, updatedAt });
});


// DB health check (quick diagnostic)
app.get('/api/health', (req, res) => {
    const state = mongoose.connection.readyState; // 0 disconnected, 1 connected, 2 connecting, 3 disconnecting
    res.json({ status: 'ok', mongooseState: state });
});

// Seed route: inserts one sample recipe if collection is empty (useful for local testing)
app.get('/api/seed-recipes', async (req, res) => {
    try {
        const count = await Recipe.countDocuments().exec();
        if (count > 0) {
            return res.json({ message: 'DB already has recipes', count });
        }

        const sample = {
            title: "Sample Shahi Veg Biryani",
            description: "A small seeded recipe for testing.",
            imageUrl: "/img/biryani1.png",
            quickInfo: { prepTime: "15 mins", cookTime: "30 mins", totalTime: "45 mins", servings: "4", difficulty: "Easy", budget: "Medium" },
            introduction: ["Fragrant rice and spiced vegetables."],
            history: ["A royal recipe adapted for home kitchens."],
            inner1: ["Layered flavors", "Aromatic spices"],
            ytlink: [],
            ingredients: [{ category: "Rice", items: ["2 cups basmati rice", "Water", "Salt"] }, { category: "Veg", items: ["1 cup mixed vegetables", "Spices"] }],
            instructions: [{ steps: "Cooking rice", items: ["Rinse rice", "Boil until 70% done"] }, { steps: "Make masala", items: ["Saute veggies", "Add spices"] }],
            chefsTips: ["Use fresh spices for best aroma."],
            servingSuggestions: ["Serve with raita."],
            storageAndHeating: ["Refrigerate up to 2 days."],
            nutritionalInfo: { Calories: "400" },
            faqs: [{ question: "Can I use frozen veg?", answer: "Yes, adjust cooking time." }],
            closingMessage: "Enjoy your meal!",
            nextSuggestion: { label: "Try next:", title: "Curd Rice", link: "newpage.html?id=2" }
        };

        const created = await Recipe.create(sample);
        console.log('Seeded recipe id:', created._id);
        res.json({ message: 'Seeded sample recipe', createdId: created._id });
    } catch (err) {
        console.error('Error in /api/seed-recipes:', err);
        res.status(500).json({ message: 'Seeding failed', error: String(err) });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Call GET /api/health to check DB state and GET /api/seed-recipes to insert a sample recipe for testing.');
});
// });
//     if(!req.user) return res.status(401).json({ message: 'Not authenticated' });
//     const { _id, username, email, role, createdAt, updatedAt } = req.user;
//     res.json({ id:_id, username, email, role, createdAt, updatedAt });
// });
// });
