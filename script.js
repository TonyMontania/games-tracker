let games = [];

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('games.json');
        if (!response.ok) throw new Error('Network response was not ok');
        games = await response.json();
        initFilters();
        displayGames(games);
        setupThemeToggle();
    } catch (error) {
        console.error('Error loading games:', error);
        document.getElementById('games-list').innerHTML = `
            <div class="error">Error loading games. Please try again later.</div>
        `;
    }
});

function initFilters() {
    const consoles = [...new Set(games.map(game => game.console))];
    const generations = [...new Set(games.map(game => game.generation))];
    
    const filtersHTML = `
        <select id="console-filter" class="filter-select">
            <option value="">All Consoles</option>
            ${consoles.map(c => `<option value="${c}">${c}</option>`).join('')}
        </select>
        <select id="generation-filter" class="filter-select">
            <option value="">All Generations</option>
            ${generations.map(g => `<option value="${g}">${g}</option>`).join('')}
        </select>
        <button id="reset-filters" class="filter-button">Reset Filters</button>
    `;
    
    document.getElementById('filters-container').innerHTML = filtersHTML;
    
    document.getElementById('console-filter').addEventListener('change', filterGames);
    document.getElementById('generation-filter').addEventListener('change', filterGames);
    document.getElementById('reset-filters').addEventListener('click', resetFilters);
}

function filterGames() {
    const consoleValue = document.getElementById('console-filter').value;
    const generationValue = document.getElementById('generation-filter').value;
    
    const filteredGames = games.filter(game => {
        return (!consoleValue || game.console === consoleValue) &&
               (!generationValue || game.generation === generationValue);
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
    
    gamesToDisplay.forEach(game => {
        const completedCategories = game.categories.filter(cat => isCompleted(game.id, cat.id)).length;
        const allCompleted = completedCategories === game.categories.length;
        
        const gameEl = document.createElement('div');
        gameEl.className = `game-card ${allCompleted ? 'all-completed' : ''}`;
        gameEl.innerHTML = `
            <h3>${game.title}</h3>
            <div class="game-meta">
                <span>${game.console}</span>
                <span>${game.generation}</span>
                <span>${game.year}</span>
            </div>
            <img src="assets/${game.image}" alt="${game.title}">
            ${allCompleted ? '<div class="completed-badge">Completed!</div>' : ''}
            <div class="progress-options">
                ${game.categories.map(cat => `
                    <label>
                        <input type="checkbox" 
                               class="emerald-checkbox"
                               data-game="${game.id}" 
                               data-category="${cat.id}"
                               ${isCompleted(game.id, cat.id) ? 'checked' : ''}
                               style="background-image: url('assets/${isCompleted(game.id, cat.id) ? 'emerald-green.png' : 'emerald-grey.png'}')">
                        <span>${cat.name}</span>
                    </label>
                `).join('')}
            </div>
        `;
        container.appendChild(gameEl);
    });
    
    document.querySelectorAll('.progress-options input').forEach(checkbox => {
        checkbox.addEventListener('change', function(e) {
            const gameId = e.target.dataset.game;
            const categoryId = e.target.dataset.category;
            const completed = e.target.checked;
            
            let progress = JSON.parse(localStorage.getItem('sonicProgress')) || {};
            if (!progress[gameId]) progress[gameId] = {};
            progress[gameId][categoryId] = completed;
            
            localStorage.setItem('sonicProgress', JSON.stringify(progress));
            
            // Actualizar la imagen de la esmeralda
            e.target.style.backgroundImage = `url('assets/${completed ? 'emerald-green.png' : 'emerald-grey.png'})`;
            
            // Actualizar el estado "Completed" del juego
            displayGames(games);
        });
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
    displayGames(games);
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

document.getElementById('export-button').addEventListener('click', exportProgress);

function exportProgress() {
    const progressData = JSON.parse(localStorage.getItem('sonicProgress')) || {};
    const dataStr = JSON.stringify(progressData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `sonic-tracker-progress-${new Date().toISOString().slice(0,10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}