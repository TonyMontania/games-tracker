import { GameManager } from './core/GameManager.js';
import { ProgressManager } from './core/ProgressManager.js';
import { UIManager } from './core/UIManager.js';
import { FilterManager } from './core/FilterManager.js';

document.addEventListener('DOMContentLoaded', function() {
    // Configuración inicial del tema
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Botón de cambio de tema
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        // Configura el ícono inicial
        themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
        
        // Manejador del evento click
        themeToggle.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            // Aplica el nuevo tema
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            // Cambia el ícono del botón
            themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
            
            // Actualiza la hoja de estilos
            const themeStyle = document.getElementById('theme-style');
            if (themeStyle) {
                themeStyle.href = `styles/themes/${newTheme}.css`;
            }
        });
    }
});