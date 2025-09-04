const express = require('express');
const router = express.Router();
const User = require('../model/User');
const { signup } = require('../controllers/userController');
const { verifyToken, checkRole } = require('../middleware/authMiddleware');

// User registration/signup
router.post('/signup', signup);

// Change user role (admin only)
router.patch('/:id/role', verifyToken, checkRole('admin'), async (req, res) => {
	try {
		const { role } = req.body;
		if (!['user', 'moderator', 'admin'].includes(role)) {
			return res.status(400).json({ message: 'Invalid role' });
		}
		const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
		if (!user) return res.status(404).json({ message: 'User not found' });
		res.json({ message: 'Role updated successfully', user });
	} catch (err) {
		res.status(500).json({ message: 'Server error', error: err.message });
	}
});

module.exports = router;
