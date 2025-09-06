const express = require('express');
const router = express.Router();
const { login, handleRefreshToken, register, logout, me } = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');
// Register route
router.post('/register', register);

// Login route
router.post('/login', login);

// Refresh token route
router.get('/refresh', handleRefreshToken);

// Current user
router.get('/me', verifyToken, me);

// Logout
router.post('/logout', logout);

module.exports = router;
