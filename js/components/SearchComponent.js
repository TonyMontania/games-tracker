import { debounce } from '../utils/helpers.js';

export class SearchComponent {
  constructor(filterManager) {
    this.filterManager = filterManager;
    this.initSearch();
  }

  initSearch() {
    const input = document.getElementById('search-input');
    const button = document.getElementById('search-button');
    
    if (input) {
      input.addEventListener('input', debounce(this.handleSearch.bind(this), 300));
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') this.handleSearch(e);
      });
    }
    
    if (button) button.addEventListener('click', () => this.handleSearch({
      target: document.getElementById('search-input')
    }));
  }

  handleSearch(e) {
    this.filterManager.currentFilters.searchQuery = e.target.value.toLowerCase().trim();
    this.filterManager.applyFilters();
  }
}