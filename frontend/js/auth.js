document.addEventListener('DOMContentLoaded', () => {
    // Unified deployed backend base URL
    const API_BASE = 'https://remebrer.onrender.com';
    // Login page
    const loginForm = document.querySelector('body > form.signup-main');
    if (loginForm && loginForm.querySelector('h2')?.textContent?.toLowerCase().includes('log in')) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = loginForm.querySelector('#email').value.trim();
            const password = loginForm.querySelector('#password').value.trim();
            try {
                const res = await fetch(`${API_BASE}/api/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password }),
                    credentials: 'include'
                });
                // safe JSON parse: server may respond with empty body or HTML on error
                const text = await res.text();
                let data;
                try { data = text ? JSON.parse(text) : {}; } catch (err) { data = { message: text || 'Invalid JSON response' }; }
                if (!res.ok) {
                    alert(data.message || 'Login failed');
                    return;
                }
                // store access token for Authorization header usage
                if (data.accessToken) localStorage.setItem('token', data.accessToken);
                // redirect to home or suggestion page
                window.location.href = '/frontend/views/index.html';
            } catch (err) {
                alert(err.message || 'Network error');
            }
        });
    }

    // Signup page
    const signupForm = document.querySelector('body > form.signup-main');
    if (signupForm && signupForm.querySelector('h2')?.textContent?.toLowerCase().includes('sign up')) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = signupForm.querySelector('#email').value.trim();
            const password = signupForm.querySelector('#password').value.trim();
            const username = email.split('@')[0];
            try {
                const res = await fetch(`${API_BASE}/api/signup`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, email, password }),
                    credentials: 'include'
                });
                const text = await res.text();
                let data;
                try { data = text ? JSON.parse(text) : {}; } catch (err) { data = { message: text || 'Invalid JSON response' }; }
                if (!res.ok) {
                    alert(data.message || 'Signup failed');
                    return;
                }
                alert('Signup successful — please log in');
                window.location.href = '/frontend/views/login.html';
            } catch (err) {
                alert(err.message || 'Network error');
            }
        });
    }
});
