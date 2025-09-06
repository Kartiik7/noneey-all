// session.js - central client auth state + nav swap
// Assumes access token stored in localStorage under 'token'. Will attempt refresh if missing/expired.
(function () {
    const API_BASE = 'https://noneey-all.onrender.com';

    function qs(sel, root = document) { return root.querySelector(sel); }
    function ce(tag, cls) { const el = document.createElement(tag); if (cls) el.className = cls; return el; }

    // Build dynamic nav buttons
    function buildAuthedNav(user) {
        const nav = document.querySelector('.navbar-links');
        if (!nav) return;
        // Remove existing auth buttons & any static legacy login/signup anchors
        nav.querySelectorAll('[data-auth-btn], a[href$="login.html"], a[href$="signup.html"]').forEach(b => b.remove());

        const profile = ce('a', 'navbar-link btn');
        profile.textContent = 'Profile';
        profile.href = '/frontend/views/profile.html';
        profile.setAttribute('data-auth-btn', 'profile');

        const logout = ce('button', 'navbar-link');
        logout.textContent = 'Logout';
        logout.type = 'button';
        logout.setAttribute('data-auth-btn', 'logout');
        logout.style.cursor = 'pointer';
        logout.addEventListener('click', async () => {
            try {
                await fetch(API_BASE + '/api/auth/logout', { method: 'POST', credentials: 'include' });
            } catch (e) { /* ignore */ }
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            location.href = '/frontend/views/index.html';
        });

        nav.appendChild(profile);
        nav.appendChild(logout);
    }

    function buildGuestNav() {
        const nav = document.querySelector('.navbar-links');
        if (!nav) return;
        nav.querySelectorAll('[data-auth-btn]').forEach(b => b.remove());
        // Only add if missing
        if (!nav.querySelector('a[href$="login.html"]')) {
            const login = ce('a', 'navbar-link');
            login.href = 'login.html';
            login.textContent = 'Log In';
            login.setAttribute('data-auth-btn', 'login');
            nav.appendChild(login);
        }
        if (!nav.querySelector('a[href$="signup.html"]')) {
            const signup = ce('a', 'navbar-link btn');
            signup.href = 'signup.html';
            signup.textContent = 'Sign Up';
            signup.setAttribute('data-auth-btn', 'signup');
            nav.appendChild(signup);
        }
    }

    async function fetchMe(token) {
        const headers = token ? { 'Authorization': 'Bearer ' + token } : {};
        try {
            let res = await fetch(API_BASE + '/api/auth/me', { headers });
            if (res.status === 404) {
                // fallback to alternative endpoint if deployed backend missing /api/auth/me
                res = await fetch(API_BASE + '/me', { headers });
            }
            if (!res.ok) return null;
            return await res.json();
        } catch (e) { return null; }
    }

    async function init() {
        const token = localStorage.getItem('token');
        if (!token) { buildGuestNav(); return; }
        let user = await fetchMe(token);
        if (!user) {
            // attempt refresh
            try {
                const r = await fetch(API_BASE + '/api/auth/refresh', { credentials: 'include' });
                if (r.ok) {
                    const data = await r.json();
                    if (data.accessToken) {
                        localStorage.setItem('token', data.accessToken);
                        user = await fetchMe(data.accessToken);
                    }
                }
            } catch (e) { /* ignore */ }
        }
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
            buildAuthedNav(user);
        } else {
            buildGuestNav();
        }
    }

    document.addEventListener('DOMContentLoaded', init);
})();
