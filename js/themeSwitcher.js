// Función para cambiar el tema - SOLUCIÓN ALTERNATIVA COMPLETA
function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    // Cambia el atributo data-theme
    html.setAttribute('data-theme', newTheme);
    
    // Guarda la preferencia
    localStorage.setItem('theme', newTheme);
    
    // Actualiza el ícono del botón
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
    }
    
    // Fuerza la recarga del CSS (solución para caché)
    const themeStyle = document.getElementById('theme-style');
    if (themeStyle) {
        themeStyle.href = `styles/themes/${newTheme}.css?version=${new Date().getTime()}`;
    }
}

// Inicialización del tema
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