import { GameCard } from '../components/GameCard.js';

export class UIManager {
    constructor(gameManager, filterManager, progressManager) {
        this.gameManager = gameManager;
        this.filterManager = filterManager;
        this.progressManager = progressManager;
        this.currentTheme = localStorage.getItem('theme') || 'light';
    }

    async initialize() {
        try {
            this.setupTheme();
            this.filterManager.setupFilters();
            this.setupEventListeners();
            this.displayGames(this.filterManager.applyFilters());
        } catch (error) {
            console.error('UI initialization failed:', error);
            throw error;
        }
    }

    setupTheme() {
        const toggle = document.getElementById('theme-toggle');
        if (!toggle) return;

        document.documentElement.setAttribute('data-theme', this.currentTheme);
        toggle.textContent = this.currentTheme === 'dark' ? '☀️' : '🌙';

        toggle.addEventListener('click', () => {
            this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', this.currentTheme);
            toggle.textContent = this.currentTheme === 'dark' ? '☀️' : '🌙';
            localStorage.setItem('theme', this.currentTheme);
        });
    }

    setupEventListeners() {
        // Escuchar el evento de filtros aplicados
        document.addEventListener('filtersApplied', (e) => {
            this.displayGames(e.detail);
        });

        // Event listener para checkboxes de progreso
        document.addEventListener('change', (e) => {
            if (e.target.classList.contains('emerald-checkbox')) {
                const gameId = e.target.dataset.game;
                const categoryId = e.target.dataset.category;
                this.progressManager.updateProgress(gameId, categoryId, e.target.checked);
                this.updateGameCard(gameId);
            }
        });
        
        // Event listeners para botones de exportar/importar
        document.getElementById('export-button')?.addEventListener('click', () => this.exportProgress());
        document.getElementById('import-button')?.addEventListener('click', () => this.importProgress());

        // Event listener para resetear filtros
        document.getElementById('reset-filters')?.addEventListener('click', () => {
            this.filterManager.currentFilters = { searchQuery: '', console: '', year: '' };
            this.displayGames(this.filterManager.applyFilters());
        });
    }

    displayGames(games = []) {
        const container = document.getElementById('games-list');
        if (!container) return;

        // Mostrar mensaje si no hay resultados
        if (games.length === 0) {
            container.innerHTML = `
                <div class="no-results">
                    <p>No se encontraron juegos que coincidan con los filtros</p>
                    <button onclick="document.getElementById('reset-filters').click()">
                        Resetear filtros
                    </button>
                </div>
            `;
            return;
        }

        container.innerHTML = games.map(game => this.createGameCard(game)).join('');
    }

    createGameCard(game) {
        const card = new GameCard(game, this.progressManager);
        return card.render();
    }

    updateGameCard(gameId) {
        const game = this.gameManager.getGames().find(g => g.id === gameId);
        if (!game) return;
        
        const gameCard = document.querySelector(`.game-card[data-game-id="${gameId}"]`);
        if (gameCard) {
            gameCard.outerHTML = this.createGameCard(game);
        }
    }

    exportProgress() {
        const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(this.progressManager.progress))}`;
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute('href', dataStr);
        downloadAnchor.setAttribute('download', `sonic-progress-${new Date().toISOString().slice(0,10)}.json`);
        downloadAnchor.click();
    }

    async importProgress() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        return new Promise((resolve) => {
            input.onchange = async e => {
                const file = e.target.files[0];
                if (!file) return;
                
                try {
                    const reader = new FileReader();
                    reader.onload = event => {
                        this.progressManager.progress = JSON.parse(event.target.result);
                        this.progressManager.saveProgress();
                        this.displayGames(this.filterManager.applyFilters());
                        this.showToast('Progress imported successfully!', 'success');
                        resolve(true);
                    };
                    reader.readAsText(file);
                } catch (error) {
                    console.error('Error importing progress:', error);
                    this.showToast('Error importing progress', 'error');
                    resolve(false);
                }
            };
            input.click();
        });
    }

    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
}