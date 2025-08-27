import { GameManager } from './core/GameManager.js';
import { ProgressManager } from './core/ProgressManager.js';
import { UIManager } from './core/UIManager.js';
import { FilterManager } from './core/FilterManager.js';

document.addEventListener('DOMContentLoaded', function() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
        
        themeToggle.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
            
            const themeStyle = document.getElementById('theme-style');
            if (themeStyle) {
                themeStyle.href = `styles/themes/${newTheme}.css`;
            }
        });
    }
});