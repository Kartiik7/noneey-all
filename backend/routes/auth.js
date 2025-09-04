const express = require('express');
const router = express.Router();
const { handleRefreshToken } = require('../controller/authController');

router.get('/refresh', handleRefreshToken);

module.exports = router;