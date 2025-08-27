function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    html.setAttribute('data-theme', newTheme);
    
    localStorage.setItem('theme', newTheme);
    
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
    }
    
    const themeStyle = document.getElementById('theme-style');
    if (themeStyle) {
        themeStyle.href = `styles/themes/${newTheme}.css?version=${new Date().getTime()}`;
    }
}

function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
        themeToggle.addEventListener('click', toggleTheme);
    }
}

document.addEventListener('DOMContentLoaded', initTheme);