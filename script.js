let games = [];

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('games.json');
        if (!response.ok) throw new Error('Unable to load game list');
        const data = await response.json();
        
        games = Array.isArray(data) ? data : Object.values(data).flat();
        
        initSearch();
        displayGames(games);
        setupThemeToggle();
        
        document.getElementById('export-button').addEventListener('click', exportProgress);
        document.getElementById('import-button').addEventListener('click', importProgress);
        
    } catch (error) {
        console.error('Error:', error);
        const gamesList = document.getElementById('games-list');
        if (gamesList) {
            gamesList.innerHTML = `<div class="error">Error loading games: ${error.message}</div>`;
        }
    }
});

function initSearch() {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const suggestionsContainer = document.getElementById('search-suggestions');
    const consoleFilter = document.getElementById('console-filter');
    const yearFilter = document.getElementById('year-filter');
    const categoryFilter = document.getElementById('category-filter');
    const resetButton = document.getElementById('reset-filters');

    // Llenar filtros dinámicamente
    function fillFilters() {
        // Limpiar selects primero
        consoleFilter.innerHTML = '<option value="">Todas las consolas</option>';
        yearFilter.innerHTML = '<option value="">Todos los años</option>';
        categoryFilter.innerHTML = '<option value="">Todas las categorías</option>';

        // Consolas
        const allConsoles = [...new Set(games.flatMap(g => 
            Array.isArray(g.console) ? g.console : [g.console]
        ))].sort((a, b) => a.localeCompare(b));
        
        allConsoles.forEach(c => {
            const option = document.createElement('option');
            option.value = c;
            option.textContent = c;
            consoleFilter.appendChild(option);
        });
        
        // Años
        const allYears = [...new Set(games.map(g => g.year))].sort((a, b) => a - b);
        allYears.forEach(y => {
            const option = document.createElement('option');
            option.value = y;
            option.textContent = y;
            yearFilter.appendChild(option);
        });
        
        // Categorías
        const allCategories = [...new Set(games.flatMap(g => 
            Array.isArray(g.category) ? g.category : [g.category]
        ))].sort((a, b) => a.localeCompare(b));
        
        allCategories.forEach(c => {
            const option = document.createElement('option');
            option.value = c;
            option.textContent = c.replace(/_/g, ' ');
            categoryFilter.appendChild(option);
        });
    }

    function handleSearchInput() {
        const query = searchInput.value.toLowerCase();
        if (query.length < 2) {
            suggestionsContainer.style.display = 'none';
            return;
        }
        
        const matches = games.filter(game => 
            game.title.toLowerCase().includes(query) ||
            (Array.isArray(game.console) ? 
                game.console.some(c => c.toLowerCase().includes(query)) :
                game.console.toLowerCase().includes(query)) ||
            (game.categories && game.categories.some(cat => 
                cat.name.toLowerCase().includes(query)))
        ).slice(0, 5);
        
        showSuggestions(matches, query);
    }

    function showSuggestions(matches, query) {
        suggestionsContainer.innerHTML = '';
        
        if (matches.length === 0) {
            const noResults = document.createElement('div');
            noResults.className = 'suggestion-item';
            noResults.textContent = 'No se encontraron juegos';
            suggestionsContainer.appendChild(noResults);
        } else {
            matches.forEach(game => {
                const item = document.createElement('div');
                item.className = 'suggestion-item';
                
                const title = highlightMatch(game.title, query);
                const consoleText = Array.isArray(game.console) ? 
                    game.console.join(', ') : game.console;
                
                item.innerHTML = `
                    <div><strong>${title}</strong></div>
                    <small>${consoleText} • ${game.year}</small>
                `;
                
                item.addEventListener('click', () => {
                    searchInput.value = game.title;
                    applyFilters();
                    suggestionsContainer.style.display = 'none';
                });
                
                suggestionsContainer.appendChild(item);
            });
        }
        
        suggestionsContainer.style.display = 'block';
    }

    function highlightMatch(text, query) {
        const index = text.toLowerCase().indexOf(query.toLowerCase());
        if (index >= 0) {
            const before = text.substring(0, index);
            const match = text.substring(index, index + query.length);
            const after = text.substring(index + query.length);
            return `${before}<span class="highlight">${match}</span>${after}`;
        }
        return text;
    }

    function applyFilters() {
        const searchQuery = searchInput.value.toLowerCase();
        const consoleValue = consoleFilter.value;
        const yearValue = yearFilter.value;
        const categoryValue = categoryFilter.value;
        const activeCategory = document.querySelector('.category-btn.active')?.dataset.category || 'all';
        
        const filtered = games.filter(game => {
            // Filtro de búsqueda
            const matchesSearch = 
                game.title.toLowerCase().includes(searchQuery) ||
                (Array.isArray(game.console) ? 
                    game.console.some(c => c.toLowerCase().includes(searchQuery)) :
                    game.console.toLowerCase().includes(searchQuery)) ||
                (game.categories && game.categories.some(cat => 
                    cat.name.toLowerCase().includes(searchQuery)));
            
            // Filtro de consola
            const matchesConsole = !consoleValue || 
                (Array.isArray(game.console) ? 
                    game.console.includes(consoleValue) :
                    game.console === consoleValue);
            
            // Filtro de año
            const matchesYear = !yearValue || game.year === yearValue;
            
            // Filtro de categoría (dropdown)
            const matchesCategoryFilter = !categoryValue || 
                (Array.isArray(game.category) ? 
                    game.category.includes(categoryValue) :
                    game.category === categoryValue);
            
            // Filtro de categoría (sidebar)
            const matchesCategorySidebar = activeCategory === 'all' || 
                (Array.isArray(game.category) ? 
                    game.category.includes(activeCategory) :
                    game.category === activeCategory);
            
            return matchesSearch && matchesConsole && matchesYear && matchesCategoryFilter && matchesCategorySidebar;
        });
        
        displayGames(filtered);
        suggestionsContainer.style.display = 'none';
        updateCurrentCategory();
    }

    function resetFilters() {
        searchInput.value = '';
        consoleFilter.value = '';
        yearFilter.value = '';
        categoryFilter.value = '';
        
        // Resetear categoría activa
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.category === 'all') {
                btn.classList.add('active');
            }
        });
        
        applyFilters();
    }

    function updateCurrentCategory() {
        const categoryHeader = document.querySelector('.current-category');
        const activeCategory = document.querySelector('.category-btn.active');
        
        if (activeCategory && activeCategory.dataset.category !== 'all') {
            categoryHeader.textContent = activeCategory.textContent;
        } else {
            categoryHeader.textContent = 'All Games';
        }
    }

    // Inicialización
    fillFilters();
    
    // Event listeners
    searchInput.addEventListener('input', handleSearchInput);
    searchButton.addEventListener('click', applyFilters);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') applyFilters();
    });
    
    consoleFilter.addEventListener('change', applyFilters);
    yearFilter.addEventListener('change', applyFilters);
    categoryFilter.addEventListener('change', applyFilters);
    resetButton.addEventListener('click', resetFilters);
    
    // Cerrar sugerencias al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !suggestionsContainer.contains(e.target)) {
            suggestionsContainer.style.display = 'none';
        }
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
    const yearValue = document.getElementById('year-filter').value;
    const categoryValue = document.getElementById('category-filter').value;
    const searchQuery = document.getElementById('search-input').value.toLowerCase();
    const activeCategory = document.querySelector('.category-btn.active')?.dataset.category || 'all';
    
    const filtered = games.filter(game => {
        const categories = Array.isArray(game.category) ? game.category : [game.category];
        const categoryMatch = activeCategory === 'all' || categories.includes(activeCategory);
    
        const consoles = Array.isArray(game.console) ? game.console : [game.console];
        const consoleMatch = !consoleValue || consoles.includes(consoleValue);
        
        const yearMatch = !yearValue || game.year === yearValue;
        
        const categoryFilterMatch = !categoryValue || 
            (Array.isArray(game.category) ? 
                game.category.includes(categoryValue) :
                game.category === categoryValue);
        
        const searchMatch = 
            game.title.toLowerCase().includes(searchQuery) ||
            (Array.isArray(game.console) ? 
                game.console.some(c => c.toLowerCase().includes(searchQuery)) :
                game.console.toLowerCase().includes(searchQuery)) ||
            (game.categories && game.categories.some(cat => 
                cat.name.toLowerCase().includes(searchQuery)));
    
        return categoryMatch && consoleMatch && yearMatch && categoryFilterMatch && searchMatch;
    });
    
    displayGames(filtered);
}

function resetFilters() {
    document.getElementById('console-filter').value = '';
    document.getElementById('year-filter').value = '';
    document.getElementById('category-filter').value = '';
    document.getElementById('search-input').value = '';
    document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector('.category-btn[data-category="all"]').classList.add('active');
    document.querySelector('.current-category').textContent = 'All Games';
    applyCombinedFilters();
}

function displayGames(gamesToDisplay) {
    const container = document.getElementById('games-list');
    container.innerHTML = '';
    
    gamesToDisplay.forEach(game => {
        const allCompleted = game.categories.every(cat => isCompleted(game.id, cat.id));
        const gameEl = document.createElement('div');
        gameEl.className = `game-card ${allCompleted ? 'all-completed' : ''}`;
        
        const consoles = Array.isArray(game.console) ? game.console : [game.console];
        const consolesHTML = consoles.map(console => `<span>${console}</span>`).join('');
        
        const categoriesDisplay = Array.isArray(game.category) ? game.category.join(", ") : game.category;
        
        gameEl.innerHTML = `
            <h3>${game.title}</h3>
            <div class="game-meta">
                <div class="consoles-container">${consolesHTML}</div>
                <span class="year-gen">${game.year} | ${game.generation}</span>
                <span class="game-categories">${categoriesDisplay.replace(/_/g, ' ')}</span>
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
    
    const checkbox = e.target;
    checkbox.disabled = true;
    setTimeout(() => {
        checkbox.disabled = false;
    }, 300);
    
    applyCombinedFilters();
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