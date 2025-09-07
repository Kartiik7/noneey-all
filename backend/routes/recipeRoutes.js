const express = require("express");
const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');
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

// GET all recipes (full objects) from test.recipes
router.get("/", async (req, res) => {
  try {
    const db = mongoose.connection.useDb('test', { useCache: true });
    const col = db.collection('recipes');
    const docs = await col.find({}).toArray();
    const mapped = (docs || []).map(d => {
      const out = Object.assign({}, d);
      out.id = d.id || d._id;
      out.imageUrl = makeAbsoluteImage(d.imageUrl || d.image || "", req);
      return out;
    });
    res.json(mapped);
  } catch (err) {
    console.error("Error in GET /api/recipes:", err);
    res.status(500).json({ message: err.message || String(err) });
  }
});

// GET recipe by ID from test.recipes
router.get("/:id", async (req, res) => {
  try {
    const db = mongoose.connection.useDb('test', { useCache: true });
    const col = db.collection('recipes');
    const idParam = req.params.id;
    let query = {};

    // try ObjectId first, otherwise match on id field
    if (ObjectId.isValid(idParam)) {
      query = { $or: [{ _id: new ObjectId(idParam) }, { id: idParam }] };
    } else {
      query = { id: idParam };
    }

    const recipe = await col.findOne(query);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });
    recipe.id = recipe.id || recipe._id;
    recipe.imageUrl = makeAbsoluteImage(recipe.imageUrl || recipe.image || "", req);
    res.json(recipe);
  } catch (err) {
    console.error("Error in GET /api/recipes/:id:", err);
    res.status(500).json({ message: err.message || String(err) });
  }
});

module.exports = router;
