export class FilterManager {
  constructor(gameManager) {
    this.gameManager = gameManager;
    this.currentFilters = { searchQuery: '', console: '', year: '' };

    // refs DOM
    this.searchInput = null;
    this.searchButton = null;
    this.consoleFilter = null;
    this.yearFilter = null;
  }

  getStorageKey() {
    const franchiseId = this.gameManager.getCurrentFranchise() || 'sonic';
    return `filters:${franchiseId}`;
  }

  setupFilters() {
    this.searchInput   = document.getElementById('search-input');
    this.searchButton  = document.getElementById('search-button');
    this.consoleFilter = document.getElementById('console-filter');
    this.yearFilter    = document.getElementById('year-filter');

    this.populateConsoleFilter();
    this.populateYearFilter();

    // Cargar filtros guardados (por franquicia) y aplicarlos
    this.loadSavedFilters();  // setea controles y emite 'filtersApplied'

    // Listeners
    this.searchInput?.addEventListener('input', () => {
      this.currentFilters.searchQuery = (this.searchInput.value || '').trim();
      this.saveFilters();
      this.emitFiltersApplied();
    });

    this.searchButton?.addEventListener('click', () => {
      this.currentFilters.searchQuery = (this.searchInput?.value || '').trim();
      this.saveFilters();
      this.emitFiltersApplied();
    });

    this.consoleFilter?.addEventListener('change', () => {
      this.currentFilters.console = this.consoleFilter.value || '';
      this.saveFilters();
      this.emitFiltersApplied();
    });

    this.yearFilter?.addEventListener('change', () => {
      this.currentFilters.year = this.yearFilter.value || '';
      this.saveFilters();
      this.emitFiltersApplied();
    });
  }

  loadSavedFilters() {
    try {
      const raw = localStorage.getItem(this.getStorageKey());
      const parsed = raw ? JSON.parse(raw) : null;
      if (parsed && typeof parsed === 'object') {
        this.currentFilters = {
          searchQuery: parsed.searchQuery || '',
          console: parsed.console || '',
          year: parsed.year || ''
        };
      } else {
        this.currentFilters = { searchQuery: '', console: '', year: '' };
      }
    } catch {
      this.currentFilters = { searchQuery: '', console: '', year: '' };
    }

    // Sincronizar UI
    if (this.searchInput)   this.searchInput.value   = this.currentFilters.searchQuery;
    if (this.consoleFilter) this.consoleFilter.value = this.currentFilters.console;
    if (this.yearFilter)    this.yearFilter.value    = this.currentFilters.year;

    // Render inicial según filtros guardados
    this.emitFiltersApplied();
  }

  saveFilters() {
    try {
      localStorage.setItem(this.getStorageKey(), JSON.stringify(this.currentFilters));
    } catch {}
  }

  resetFilters() {
    this.currentFilters = { searchQuery: '', console: '', year: '' };
    this.saveFilters();
    if (this.searchInput)   this.searchInput.value   = '';
    if (this.consoleFilter) this.consoleFilter.value = '';
    if (this.yearFilter)    this.yearFilter.value    = '';
    this.emitFiltersApplied();
  }

  populateConsoleFilter() {
    if (!this.consoleFilter) return;
    const games = this.gameManager.getGames();
    const set = new Set();

    games.forEach(g => {
      if (Array.isArray(g.console)) g.console.forEach(c => set.add(String(c)));
      else if (g.console) set.add(String(g.console));
    });

    const options = [''].concat(Array.from(set).sort((a,b)=>a.localeCompare(b)));
    this.consoleFilter.innerHTML = options.map(val =>
      `<option value="${val}">${val || 'All Consoles'}</option>`
    ).join('');
  }

  populateYearFilter() {
    if (!this.yearFilter) return;
    const games = this.gameManager.getGames();
    const set = new Set();

    games.forEach(g => { if (g.year != null) set.add(String(g.year)); });

    const options = [''].concat(Array.from(set).sort((a,b)=>Number(a)-Number(b)));
    this.yearFilter.innerHTML = options.map(val =>
      `<option value="${val}">${val || 'All Years'}</option>`
    ).join('');
  }

  applyFilters() {
    const games = this.gameManager.getGames() || [];
    const { searchQuery, console: consoleVal, year } = this.currentFilters;

    const q = (searchQuery || '').toLowerCase();

    const filtered = games.filter(g => {
      // título
      const titleOk = !q || String(g.title || '').toLowerCase().includes(q);

      // consola
      let consoleOk = true;
      if (consoleVal) {
        if (Array.isArray(g.console)) {
          consoleOk = g.console.map(String).some(c => c === consoleVal);
        } else {
          consoleOk = String(g.console || '') === consoleVal;
        }
      }

      // año
      const yearOk = !year || String(g.year || '') === year;

      return titleOk && consoleOk && yearOk;
    });

    return filtered;
  }

  emitFiltersApplied() {
    const result = this.applyFilters();
    document.dispatchEvent(new CustomEvent('filtersApplied', { detail: result }));
  }
}
