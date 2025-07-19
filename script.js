let games = [];

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('games.json');
        if (!response.ok) throw new Error('Unable to load game list');
        const data = await response.json();
        
        games = Array.isArray(data) ? data : Object.values(data).flat();
        
        initFilters();
        displayGames(games);
        setupThemeToggle();
        
        document.getElementById('export-button').addEventListener('click', exportProgress);
        document.getElementById('import-button').addEventListener('click', importProgress);
        
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('games-list').innerHTML = `
            <div class="error">Error loading games: ${error.message}</div>
        `;
    }
});

function initFilters() {
    const allConsoles = [...new Set(games.flatMap(g => 
        Array.isArray(g.console) ? g.console : [g.console]
    ))].sort((a, b) => a.localeCompare(b));

    const filtersHTML = `
        <select id="console-filter" class="filter-select">
            <option value="">All consoles</option>
            ${allConsoles.map(c => `<option value="${c}">${c}</option>`).join('')}
        </select>
        <button id="reset-filters" class="filter-button">Reset filters</button>
        <button id="import-button" class="filter-button">Import JSON</button>
        <button id="export-button" class="filter-button">Export JSON</button>
    `;
    document.getElementById('filters-container').innerHTML = filtersHTML;
    
    document.getElementById('console-filter').addEventListener('change', filterGames);
    document.getElementById('reset-filters').addEventListener('click', resetFilters);
    
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const category = this.dataset.category;
            filterByCategory(category);
        });
    });
}

function filterByCategory(category) {
    const categoryName = category === 'all' ? 'All Games' : 
        document.querySelector(`.category-btn[data-category="${category}"]`).textContent;
    
    document.querySelector('.current-category').textContent = categoryName;
    
    applyCombinedFilters();
}

function applyCombinedFilters() {
    const consoleValue = document.getElementById('console-filter').value;
    const activeCategory = document.querySelector('.category-btn.active')?.dataset.category || 'all';
    
    const filtered = games.filter(game => {
        const categoryMatch = activeCategory === 'all' || game.category === activeCategory;
        
        const consoles = Array.isArray(game.console) ? game.console : [game.console];
        const consoleMatch = !consoleValue || consoles.includes(consoleValue);
        
        return categoryMatch && consoleMatch;
    });
    
    displayGames(filtered);
}

function filterGames() {
    applyCombinedFilters();
}

function resetFilters() {
    document.getElementById('console-filter').value = '';
    document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector('.category-btn[data-category="all"]').classList.add('active');
    applyCombinedFilters();
}

function displayGames(gamesToDisplay) {
    const container = document.getElementById('games-list');
    container.innerHTML = '';
    
    gamesToDisplay.forEach(game => {
        const allCompleted = game.categories.every(cat => isCompleted(game.id, cat.id));
        const gameEl = document.createElement('div');
        gameEl.className = `game-card ${allCompleted ? 'all-completed' : ''}`;
        gameEl.innerHTML = `
            <h3>${game.title}</h3>
            <div class="game-meta">
                <span>${Array.isArray(game.console) ? game.console.join(" | ") : game.console}</span>
                <span class="year-gen">${game.year} | ${game.generation}</span>
            </div>
            <img src="assets/covers/${game.image}" alt="${game.title}" onerror="this.src='assets/no-image.png'">
            ${allCompleted ? '<div class="completed-badge">Completed!</div>' : ''}
            <div class="progress-options">
                ${game.categories.map(cat => `
                    <label>
                        <input type="checkbox" 
                                class="emerald-checkbox"
                                data-game="${game.id}" 
                                data-category="${cat.id}"
                                ${isCompleted(game.id, cat.id) ? 'checked' : ''}>
                        <span>${cat.name}</span>
                    </label>
                `).join('')}
            </div>
        `;
        container.appendChild(gameEl);
    });
    
    document.querySelectorAll('.progress-options input').forEach(checkbox => {
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
    displayGames(games);
}

function isCompleted(gameId, categoryId) {
    const progress = JSON.parse(localStorage.getItem('sonicProgress')) || {};
    return !!progress[gameId]?.[categoryId];
}

function exportProgress() {
    const progress = JSON.parse(localStorage.getItem('sonicProgress')) || {};
    const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(progress, null, 2))}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `sonic-progress-${new Date().toISOString().slice(0,10)}.json`);
    downloadAnchor.click();
    showToast('✅ Progress exported', 'success');
}

function importProgress() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const data = JSON.parse(await file.text());
            if (!data || typeof data !== 'object') throw new Error('Invalid file');
            
            const isValid = Object.values(data).every(gameProgress => 
                typeof gameProgress === 'object' && !Array.isArray(gameProgress)
            );
            
            if (!isValid) throw new Error('Incorrect file structure');
            
            localStorage.setItem('sonicProgress', JSON.stringify(data));
            displayGames(games);
            showToast('✅ Progress imported correctly', 'success');
        } catch (error) {
            console.error('Import error:', error);
            showToast(`❌ Error while importing: ${error.message}`, 'error');
        }
    };
    
    input.click();
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function setupThemeToggle() {
    const toggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme') || '';
    
    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
        toggle.textContent = currentTheme === 'dark' ? '☀️' : '🌙';
    }
    
    toggle.addEventListener('click', () => {
        const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? '' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        toggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
        localStorage.setItem('theme', newTheme);
    });
}