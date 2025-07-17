// Cargar datos de juegos
async function loadGames() {
    const response = await fetch('games.json');
    const games = await response.json();
    displayGames(games);
}

// Mostrar juegos en la interfaz
function displayGames(games) {
    const container = document.getElementById('games-list');
    
    games.forEach(game => {
        const gameEl = document.createElement('div');
        gameEl.className = 'game-card';
        gameEl.innerHTML = `
            <h3>${game.title}</h3>
            <img src="assets/${game.image}" alt="${game.title}">
            <div class="progress-options">
                ${game.categories.map(cat => `
                    <label>
                        <input type="checkbox" data-game="${game.id}" data-category="${cat.id}"
                                ${isCompleted(game.id, cat.id) ? 'checked' : ''}>
                        ${cat.name}
                        ${isCompleted(game.id, cat.id) ? 
                            '<img src="assets/badge.png" class="achievement-badge" alt="Completed">' : ''}
                    </label>
                `).join('')}
            </div>
        `;
        container.appendChild(gameEl);
    });
    
    // Agregar event listeners a los checkboxes
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', updateProgress);
    });
}

// Actualizar progreso en LocalStorage
function updateProgress(e) {
    const gameId = e.target.dataset.game;
    const categoryId = e.target.dataset.category;
    const completed = e.target.checked;
    
    let progress = JSON.parse(localStorage.getItem('sonicProgress')) || {};
    if (!progress[gameId]) progress[gameId] = {};
    progress[gameId][categoryId] = completed;
    
    localStorage.setItem('sonicProgress', JSON.stringify(progress));
}

// Verificar si un logro está completado
function isCompleted(gameId, categoryId) {
    const progress = JSON.parse(localStorage.getItem('sonicProgress')) || {};
    return progress[gameId] && progress[gameId][categoryId];
}

function addFilters(games) {
    // Crear filtros dinámicos
    const consoles = [...new Set(games.map(g => g.console))];
    const generations = [...new Set(games.map(g => g.generation))];
    
    const filterHTML = `
        <div class="filters">
            <select id="console-filter">
                <option value="">Todas las consolas</option>
                ${consoles.map(c => `<option value="${c}">${c}</option>`).join('')}
            </select>
            <select id="generation-filter">
                <option value="">Todas las generaciones</option>
                ${generations.map(g => `<option value="${g}">${g}</option>`).join('')}
            </select>
        </div>
    `;
    document.querySelector('.container').insertAdjacentHTML('afterbegin', filterHTML);
    
    // Event listeners para filtros
    document.getElementById('console-filter').addEventListener('change', () => filterGames());
    document.getElementById('generation-filter').addEventListener('change', () => filterGames());
}

function filterGames() {
    const consoleFilter = document.getElementById('console-filter').value;
    const generationFilter = document.getElementById('generation-filter').value;
    
    const filteredGames = games.filter(game => {
        return (!consoleFilter || game.console === consoleFilter) &&
               (!generationFilter || game.generation === generationFilter);
    });
    
    displayGames(filteredGames);
}

function setupThemeToggle() {
    const toggle = document.createElement('button');
    toggle.className = 'theme-toggle';
    toggle.textContent = '🌙';
    document.body.appendChild(toggle);
    
    toggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? '' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        toggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
        localStorage.setItem('theme', newTheme);
    });
    
    // Cargar tema guardado
    const savedTheme = localStorage.getItem('theme') || '';
    document.documentElement.setAttribute('data-theme', savedTheme);
    toggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
}

// Inicializar
document.addEventListener('DOMContentLoaded', loadGames);