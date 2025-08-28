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
      this.setupFranchiseUI(this.gameManager.getCurrentFranchise());
      this.filterManager.setupFilters();     // emite "filtersApplied" inicial
      this.setupEventListeners();
    } catch (error) {
      console.error('UI initialization failed:', error);
      throw error;
    }
  }

  /* ===== Tema claro/oscuro ===== */
  setupTheme() {
    const toggle = document.getElementById('theme-toggle');
    const themeLink = document.getElementById('theme-style');
    if (!themeLink) return;

    this.applyThemeLink(this.currentTheme, themeLink);
    document.documentElement.setAttribute('data-theme', this.currentTheme);
    document.documentElement.setAttribute('data-series', this.gameManager.getCurrentFranchise());
    if (toggle) toggle.textContent = this.currentTheme === 'dark' ? '☀️' : '🌙';

    toggle?.addEventListener('click', () => {
      this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
      this.applyThemeLink(this.currentTheme, themeLink);
      document.documentElement.setAttribute('data-theme', this.currentTheme);
      if (toggle) toggle.textContent = this.currentTheme === 'dark' ? '☀️' : '🌙';
      localStorage.setItem('theme', this.currentTheme);
    });
  }

  applyThemeLink(theme, themeLink) {
    themeLink.href = `styles/themes/${theme}.css?v=${Date.now()}`;
  }

  /* ===== Eventos y UI ===== */
  setupEventListeners() {
    document.addEventListener('filtersApplied', (e) => {
      this.displayGames(e.detail);
    });

    document.addEventListener('change', (e) => {
      if (e.target.classList.contains('progress-checkbox')) {
        const gameId = e.target.dataset.game;
        const categoryId = e.target.dataset.category;
        this.progressManager.updateProgress(gameId, categoryId, e.target.checked);
        this.updateGameCard(gameId);
      }
    });

    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('btn-select-all') || e.target.closest('.btn-select-all')) {
        const btn = e.target.closest('.btn-select-all');
        const gameId = btn?.dataset.game;
        this.bulkSetGame(gameId, true);
      }
      if (e.target.classList.contains('btn-clear-all') || e.target.closest('.btn-clear-all')) {
        const btn = e.target.closest('.btn-clear-all');
        const gameId = btn?.dataset.game;
        this.bulkSetGame(gameId, false);
      }
    });

    document.getElementById('export-button')?.addEventListener('click', () => this.exportProgress());
    document.getElementById('import-button')?.addEventListener('click', () => this.importProgress());

    document.getElementById('reset-filters')?.addEventListener('click', () => {
      this.filterManager.resetFilters();
    });

    document.querySelectorAll('.btn-franchise').forEach(btn => {
      btn.addEventListener('click', () => this.switchFranchise(btn.dataset.franchise));
    });

    const select = document.getElementById('franchise-select');
    if (select) {
      select.addEventListener('change', (e) => this.switchFranchise(e.target.value));
      select.value = this.gameManager.getCurrentFranchise();
    }
  }

  bulkSetGame(gameId, completed) {
    if (!gameId) return;
    const game = this.gameManager.getGames().find(g => g.id === gameId);
    if (!game || !Array.isArray(game.categories)) return;

    for (const cat of game.categories) {
      this.progressManager.updateProgress(gameId, cat.id, completed);
    }
    this.updateGameCard(gameId);
  }

  async switchFranchise(franchiseId) {
    const current = this.gameManager.getCurrentFranchise();
    if (current === franchiseId) return;

    try {
      await this.gameManager.loadFranchise(franchiseId);
      this.progressManager.setFranchise(franchiseId);

      document.documentElement.setAttribute('data-series', franchiseId);
      localStorage.setItem('franchise', franchiseId);

      this.setupFranchiseUI(franchiseId);
      const select = document.getElementById('franchise-select');
      if (select) select.value = franchiseId;

      this.filterManager.populateConsoleFilter();
      this.filterManager.populateYearFilter();
      this.filterManager.loadSavedFilters(); // << acá estaba el error, ahora ok
    } catch (err) {
      console.error('[UIManager] switchFranchise error:', err);
      this.showToast(
        `No pude cargar la franquicia "${franchiseId}". Revisá que exista data/franchises/${franchiseId}.json`,
        'error'
      );
    }
  }

  setupFranchiseUI(franchiseId) {
    document.querySelectorAll('.btn-franchise').forEach(b => {
      b.classList.toggle('active', b.dataset.franchise === franchiseId);
    });
  }

  displayGames(games = []) {
    const container = document.getElementById('games-list');
    if (!container) return;

    if (games.length === 0) {
      container.innerHTML = `
        <div class="no-results">
          <p>No se encontraron juegos que coincidan con los filtros</p>
          <button onclick="document.getElementById('reset-filters').click()">
            Resetear filtros
          </button>
        </div>`;
      return;
    }

    const franchiseId = this.gameManager.getCurrentFranchise();
    container.innerHTML = games.map(game => this.createGameCard(game, franchiseId)).join('');
  }

  createGameCard(game, franchiseId) {
    const card = new GameCard(game, this.progressManager, franchiseId);
    return card.render();
  }

  updateGameCard(gameId) {
    const game = this.gameManager.getGames().find(g => g.id === gameId);
    if (!game) return;
    const franchiseId = this.gameManager.getCurrentFranchise();

    const gameCard = document.querySelector(`.game-card[data-game-id="${gameId}"]`);
    if (gameCard) {
      gameCard.outerHTML = this.createGameCard(game, franchiseId);
    }
  }

  exportProgress() {
    const franchiseId = this.gameManager.getCurrentFranchise();
    const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(this.progressManager.progress))}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${franchiseId}-progress-${new Date().toISOString().slice(0,10)}.json`);
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
            const parsed = JSON.parse(event.target.result);
            if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
              throw new Error('Invalid progress file');
            }
            for (const gameId of Object.keys(parsed)) {
              const catMap = parsed[gameId];
              if (typeof catMap !== 'object' || Array.isArray(catMap)) {
                throw new Error('Invalid progress structure');
              }
              for (const val of Object.values(catMap)) {
                if (typeof val !== 'boolean') throw new Error('Invalid progress values');
              }
            }

            this.progressManager.progress = parsed;
            this.progressManager.saveProgress();
            this.filterManager.emitFiltersApplied();
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
    setTimeout(() => toast.remove(), 3000);
  }
}