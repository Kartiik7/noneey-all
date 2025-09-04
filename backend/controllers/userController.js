const User = require('../model/User');
const bcrypt = require('bcrypt');

// Signup
const signup = async (req, res) => {
    const { username, email, password, role } = req.body;
    try {
        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role: role && ['user', 'moderator', 'admin'].includes(role) ? role : undefined
        });

        // save user in DB
        const savedUser = await newUser.save();

        res.status(201).json({
            message: "User created successfully",
            user: {
                id: savedUser._id,
                username: savedUser.username,
                email: savedUser.email,
                role: savedUser.role
            }
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { signup };
