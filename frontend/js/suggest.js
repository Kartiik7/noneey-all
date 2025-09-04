document.addEventListener('DOMContentLoaded', () => {
    const API_BASE = 'https://remebrer.onrender.com';
    const form = document.getElementById('suggestForm');
    const msg = document.getElementById('msg');

    function showMessage(text, isError = false) {
        msg.textContent = text;
        msg.style.color = isError ? 'crimson' : 'green';
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        showMessage('Submitting...', false);

        const title = document.getElementById('title').value.trim();
        const description = document.getElementById('description').value.trim();
        const ingredientsRaw = document.getElementById('ingredients').value;
        const stepsRaw = document.getElementById('steps').value;
        const authorName = document.getElementById('authorName').value.trim();
        const email = document.getElementById('email').value.trim();
        const image = document.getElementById('image').value.trim() || undefined;
        const video = document.getElementById('video').value.trim() || undefined;

        const ingredients = ingredientsRaw.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
        const steps = stepsRaw.split(/\r?\n/).map(s => s.trim()).filter(Boolean);

        const payload = { title, description, ingredients, steps, authorName, email };
        if (image) payload.image = image;
        if (video) payload.video = video;

        // try to attach bearer token from localStorage (common keys), otherwise rely on cookies
        const token = localStorage.getItem('token') || localStorage.getItem('accessToken') || localStorage.getItem('authToken');
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = 'Bearer ' + token;

        try {
            const res = await fetch(`${API_BASE}/api/suggestions`, {
                method: 'POST',
                headers,
                body: JSON.stringify(payload),
                credentials: token ? 'same-origin' : 'include' // include credentials when relying on cookies
            });
            const text = await res.text();
            let data;
            try { data = text ? JSON.parse(text) : {}; } catch (err) { data = { message: text || 'Invalid JSON response' }; }
            if (res.ok) {
                showMessage(data.message || 'Suggestion submitted, waiting for review.');
                form.reset();
            } else {
                showMessage(data.error || data.message || 'Failed to submit suggestion', true);
            }
        } catch (err) {
            showMessage(err.message || 'Network error', true);
        }
    });
});
