const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register a new user (basic public signup)
const register = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        const savedUser = await newUser.save();

        res.status(201).json({
            message: 'User registered successfully',
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

// Login
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid email or password' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

        const accessToken = jwt.sign(
            { id: user._id, username: user.username, email: user.email },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '15m' }
        );

        const refreshToken = jwt.sign(
            { id: user._id, email: user.email },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '7d' }
        );

        user.refreshToken = refreshToken;
        await user.save();

        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            secure: false, // set true in prod
            sameSite: 'Strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({ accessToken });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Refresh token
const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);

    const refreshToken = cookies.jwt;
    try {
        const foundUser = await User.findOne({ refreshToken });
        if (!foundUser) return res.sendStatus(403);

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if (err || foundUser.email !== decoded.email) return res.sendStatus(403);

            const accessToken = jwt.sign(
                { id: foundUser._id, username: foundUser.username, email: foundUser.email },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '15m' }
            );

            res.json({ accessToken });
        });
    } catch (error) {
        console.error('Refresh token error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Logout: invalidate refresh token server-side and clear cookie
const logout = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.status(204).end(); // Nothing to do
    const refreshToken = cookies.jwt;
    try {
        const user = await User.findOne({ refreshToken });
        if (user) {
            user.refreshToken = '';
            await user.save();
        }
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'Strict', secure: false });
        return res.json({ message: 'Logged out' });
    } catch (err) {
        return res.status(500).json({ message: 'Server error' });
    }
};

// Return current authenticated user (requires verifyToken middleware)
const me = async (req, res) => {
    if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
    const { _id, username, email, role, createdAt, updatedAt } = req.user;
    res.json({ id: _id, username, email, role, createdAt, updatedAt });
};

module.exports = { login, handleRefreshToken, register, logout, me };
