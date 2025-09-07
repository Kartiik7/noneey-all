const express = require('express');
const router = express.Router();
const { login, handleRefreshToken, register } = require('../controllers/authController');
// Register route
router.post('/register', register);

// Login route
router.post('/login', login);

// Refresh token route
router.get('/refresh', handleRefreshToken);

module.exports = router;
