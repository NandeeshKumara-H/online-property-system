document.addEventListener('DOMContentLoaded', () => {

    // --- LOGIN (Password) ---
    const loginForm = document.getElementById('login-form');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            try {
                const res = await api.post('/login-password', { email, password });
                if (res.token) {
                    localStorage.setItem('token', res.token);
                    localStorage.setItem('user', JSON.stringify(res.user));
                    window.location.href = '/dashboard.html';
                } else {
                    alert(res.message || 'Login failed');
                }
            } catch (err) {
                console.error('Login Error:', err);
                alert('Error logging in: ' + (err.message || 'Unknown error'));
            }
        });
    }

    // --- SIGNUP (OTP) ---
    const signupStep1 = document.getElementById('signup-step-1');
    const signupStep2 = document.getElementById('signup-step-2');

    if (signupStep1) {
        signupStep1.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('signup-email').value;
            const phone = document.getElementById('signup-phone').value;

            try {
                const res = await api.post('/signup/initiate', { email, phone });
                if (res.message.includes('OTP sent')) {
                    signupStep1.style.display = 'none';
                    signupStep2.style.display = 'block';
                } else {
                    alert(res.message || 'Failed to send OTP');
                }
            } catch (err) {
                alert('Error sending OTP');
            }
        });

        signupStep2.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('signup-name').value;
            const email = document.getElementById('signup-email').value;
            const phone = document.getElementById('signup-phone').value;
            const password = document.getElementById('signup-password').value;
            const otp = document.getElementById('signup-otp').value;

            try {
                const res = await api.post('/signup/verify', { name, email, phone, password, otp });
                if (res.token) {
                    localStorage.setItem('token', res.token);
                    localStorage.setItem('user', JSON.stringify(res.user));
                    window.location.href = '/dashboard.html';
                } else {
                    alert(res.message || 'Signup failed');
                }
            } catch (err) {
                alert('Error verifying OTP');
            }
        });
    }

    // --- ADMIN LOGIN ---
    const adminLoginForm = document.getElementById('admin-login-form');
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            try {
                const res = await api.post('/admin/login', { username, password });
                if (res.token) {
                    localStorage.setItem('token', res.token);
                    localStorage.setItem('user', JSON.stringify(res.admin));
                    window.location.href = '/admin-dashboard.html';
                } else {
                    alert(res.message || 'Login failed');
                }
            } catch (err) {
                alert('An error occurred');
            }
        });
    }
});
