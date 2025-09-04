const express = require("express");
const router = express.Router();
const suggestionController = require("../controllers/suggestionController");
const { verifyToken, checkRole } = require("../middleware/authMiddleware");

// User routes
router.post("/", verifyToken, suggestionController.submitSuggestion);

// Admin routes
router.get("/", verifyToken, checkRole('admin'), suggestionController.getSuggestions);
router.patch("/:id/approve", verifyToken, checkRole('admin'), suggestionController.approveSuggestion);
router.delete("/:id", verifyToken, checkRole('admin'), suggestionController.rejectSuggestion);

module.exports = router;
