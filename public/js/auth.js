function checkAuth() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    const navLinks = document.getElementById('nav-links');

    if (token && user) {
        let dashboardLink = user.role === 'admin' ? '/admin-dashboard.html' : '/dashboard.html';
        navLinks.innerHTML = `
            <li><a href="${dashboardLink}">Dashboard</a></li>
            <li><a href="#" onclick="logout()">Logout</a></li>
            <li><a href="/post-property.html" class="btn btn-primary">Post Property</a></li>
        `;
    } else {
        navLinks.innerHTML = `
            <li><a href="/login.html">Login</a></li>
            <li><a href="/signup.html" class="btn btn-primary">Sign Up</a></li>
        `;
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login.html';
}

document.addEventListener('DOMContentLoaded', checkAuth);
