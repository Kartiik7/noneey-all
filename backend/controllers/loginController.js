const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
    const { email, password } = req.body || {};
    try {
        // Basic body validation
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        console.log('[LOGIN] Phase 1: lookup user');
        const user = await User.findOne({ email }).catch(e => { throw Object.assign(new Error('DB_FIND_ERROR:' + e.message), { phase: 'FIND' }); });
        if (!user) return res.status(400).json({ message: 'Invalid email or password' });

        console.log('[LOGIN] Phase 2: compare password');
        const isMatch = await bcrypt.compare(password, user.password).catch(e => { throw Object.assign(new Error('BCRYPT_ERROR:' + e.message), { phase: 'BCRYPT' }); });
        if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

        // Ensure secrets exist (avoid opaque 500 jwt errors)
        const accessSecret = process.env.ACCESS_TOKEN_SECRET;
        const refreshSecret = process.env.REFRESH_TOKEN_SECRET;
        if (!accessSecret || !refreshSecret) {
            console.error('[LOGIN] Missing JWT secrets. ACCESS_TOKEN_SECRET or REFRESH_TOKEN_SECRET not set.');
            return res.status(500).json({ message: 'Server config error: token secret missing' });
        }

        let accessToken, refreshToken;
        try {
            console.log('[LOGIN] Phase 3: sign tokens');
            accessToken = jwt.sign(
                { id: user._id, username: user.username, email: user.email, role: user.role },
                accessSecret,
                { expiresIn: '15m' }
            );
            refreshToken = jwt.sign(
                { id: user._id, email: user.email },
                refreshSecret,
                { expiresIn: '7d' }
            );
        } catch (tokenErr) {
            console.error('[LOGIN] JWT sign error:', tokenErr);
            return res.status(500).json({ message: 'Server error generating token' });
        }

        console.log('[LOGIN] Phase 4: save refresh token');
        user.refreshToken = refreshToken;
        await user.save().catch(saveErr => { throw Object.assign(new Error('SAVE_ERROR:' + saveErr.message), { phase: 'SAVE' }); });

        // Use secure cookie in production (https) - Render provides HTTPS
        const secureCookie = process.env.NODE_ENV === 'production';
        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            secure: secureCookie,
            sameSite: secureCookie ? 'None' : 'Strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({ accessToken });
    } catch (err) {
        console.error('[LOGIN] Unhandled error:', err);
        // TEMP: include non-sensitive diagnostic detail to help trace phase
        const response = { message: 'Server error' };
        if (err && (err.phase || err.message)) {
            response.detail = err.message;
            response.phase = err.phase || 'UNKNOWN';
        }
        return res.status(500).json(response);
    }
};

module.exports = { login };
