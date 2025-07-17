let games = [];

document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Cargar juegos
        const response = await fetch('games.json');
        if (!response.ok) throw new Error('Error al cargar los juegos');
        games = await response.json();
        
        // Inicializar componentes
        initFilters();
        displayGames(games);
        setupThemeToggle();
        
        console.log('Tracker cargado correctamente');
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('games-list').innerHTML = `
            <div class="error">
                Error al cargar los datos. Verifica la consola para más detalles.
                <br><br>
                ${error.message}
            </div>
        `;
    }
});

function initFilters() {
    const consoles = [...new Set(games.map(game => game.console))];
    const generations = [...new Set(games.map(game => game.generation))];
    
    const filtersHTML = `
        <div class="filter-group">
            <select id="console-filter" class="filter-select">
                <option value="">Todas las consolas</option>
                ${consoles.map(c => `<option value="${c}">${c}</option>`).join('')}
            </select>
        </div>
        <div class="filter-group">
            <select id="generation-filter" class="filter-select">
                <option value="">Todas las generaciones</option>
                ${generations.map(g => `<option value="${g}">${g}</option>`).join('')}
            </select>
        </div>
        <button id="reset-filters" class="filter-button">Resetear Filtros</button>
    `;
    
    document.getElementById('filters-container').innerHTML = filtersHTML;
    
    // Event listeners
    document.getElementById('console-filter').addEventListener('change', filterGames);
    document.getElementById('generation-filter').addEventListener('change', filterGames);
    document.getElementById('reset-filters').addEventListener('click', resetFilters);
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

function resetFilters() {
    document.getElementById('console-filter').value = '';
    document.getElementById('generation-filter').value = '';
    filterGames();
}

function displayGames(gamesToDisplay) {
    const container = document.getElementById('games-list');
    container.innerHTML = '';
    
    if (!gamesToDisplay || gamesToDisplay.length === 0) {
        container.innerHTML = '<div class="no-games">No se encontraron juegos con estos filtros</div>';
        return;
    }
    
    gamesToDisplay.forEach(game => {
        const gameEl = document.createElement('div');
        gameEl.className = 'game-card';
        
        // Verificar si todos los logros están completados
        const allCompleted = game.categories.every(cat => isCompleted(game.id, cat.id));
        if (allCompleted) gameEl.classList.add('completed');
        
        gameEl.innerHTML = `
            <h3>${game.title}</h3>
            <div class="game-meta">
                <span class="console-badge">${game.console}</span>
                <span class="generation-badge">${game.generation} Gen</span>
            </div>
            <img src="assets/${game.image}" alt="${game.title}" onerror="this.style.display='none'">
            <div class="progress-options">
                ${game.categories.map(cat => `
                    <label>
                        <input type="checkbox" 
                               data-game="${game.id}" 
                               data-category="${cat.id}"
                               ${isCompleted(game.id, cat.id) ? 'checked' : ''}>
                        ${cat.name}
                        ${isCompleted(game.id, cat.id) ? 
                          '<img src="assets/emerald.png" class="achievement-badge" alt="Completed">' : ''}
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

function updateProgress(e) {
    const gameId = e.target.dataset.game;
    const categoryId = e.target.dataset.category;
    const completed = e.target.checked;
    
    let progress = JSON.parse(localStorage.getItem('sonicProgress')) || {};
    if (!progress[gameId]) progress[gameId] = {};
    progress[gameId][categoryId] = completed;
    
    localStorage.setItem('sonicProgress', JSON.stringify(progress));
    
    // Actualizar visualización
    const gameCard = e.target.closest('.game-card');
    const allChecked = Array.from(gameCard.querySelectorAll('input[type="checkbox"]'))
                          .every(checkbox => checkbox.checked);
    
    if (allChecked) {
        gameCard.classList.add('completed');
    } else {
        gameCard.classList.remove('completed');
    }
}

function isCompleted(gameId, categoryId) {
    const progress = JSON.parse(localStorage.getItem('sonicProgress')) || {};
    return progress[gameId] && progress[gameId][categoryId];
}

function setupThemeToggle() {
    const toggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme') || '';
    
    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
        toggle.textContent = currentTheme === 'dark' ? '☀️' : '🌙';
    }
    
    toggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? '' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        toggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
        localStorage.setItem('theme', newTheme);
    });
}