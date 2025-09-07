const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

function makeAbsoluteImage(img, req) {
  if (!img) return "";
  if (/^https?:\/\//i.test(img)) return img;
  if (img.startsWith('/')) return `${req.protocol}://${req.get('host')}${img}`;
  if (img.startsWith('img/') || img.startsWith('frontend/') || img.startsWith('assets/')) {
    return `${req.protocol}://${req.get('host')}/${img.replace(/^\/+/, '')}`;
  }
  return `${req.protocol}://${req.get('host')}/img/${img.replace(/^\/+/, '')}`;
}

// GET /api/recipesCard  -> read from recipeDB.recipeCards
router.get('/', async (req, res) => {
  try {
    const db = mongoose.connection.useDb('recipeDB', { useCache: true });
    const col = db.collection('recipeCards');
    const docs = await col.find({}).toArray();

    const cards = (docs || []).map(d => {
      const id = d.id || d._id;
      const rawImg = d.imageUrl || d.image || d.img || "";
      const img = makeAbsoluteImage(rawImg, req);
      return {
        id,
        title: d.title || d.name || "Untitled",
        imageUrl: img,
        image: img,
        quickInfo: d.quickInfo || {},
        cookTime: d.cookingTime || d.quickInfo?.cookTime || d.cookTime || "-",
        difficulty: d.difficulty || d.quickInfo?.difficulty || "-",
        budget: d.budget || d.quickInfo?.budget || "-",
        rating: (d.rating !== undefined && d.rating !== null) ? d.rating : (d.avgRating !== undefined ? d.avgRating : "-"),
        link: d.link || null
      };
    });

    console.log(`recipeCardRoutes: returning ${cards.length} card(s) from recipeDB.recipeCards`);
    res.json(cards);
  } catch (err) {
    console.error('Error in /api/recipesCard:', err);
    res.status(500).json({ message: 'Failed to load recipe cards', error: String(err) });
  }
});

module.exports = router;
