import { SearchComponent } from '../components/SearchComponent.js';

export class FilterManager {
    constructor(gameManager) {
        this.gameManager = gameManager;
        this.currentFilters = {
            searchQuery: '',
            console: '',
            year: ''
        };
        this.searchComponent = new SearchComponent(this);
    }

    setupFilters() {
        this.populateConsoleFilter();
        this.populateYearFilter();
        this.setupFilterEvents();
        this.setupReset();
    }

    populateConsoleFilter() {
        const filter = document.getElementById('console-filter');
        if (!filter) return;
        
        filter.innerHTML = '<option value="">All Consoles</option>';
        
        const consoles = new Set();
        this.gameManager.getGames().forEach(game => {
            const platforms = Array.isArray(game.console) ? game.console : [game.console];
            platforms.forEach(c => consoles.add(c));
        });
        
        Array.from(consoles).sort().forEach(console => {
            filter.appendChild(new Option(console, console));
        });
    }

    populateYearFilter() {
        const filter = document.getElementById('year-filter');
        if (!filter) return;
        
        filter.innerHTML = '<option value="">All Years</option>';
        
        const years = new Set(this.gameManager.getGames().map(g => g.year));
        Array.from(years).sort((a, b) => b - a).forEach(year => {
            filter.appendChild(new Option(year, year));
        });
    }

    setupFilterEvents() {
        const consoleFilter = document.getElementById('console-filter');
        const yearFilter = document.getElementById('year-filter');
        
        if (consoleFilter) {
            consoleFilter.addEventListener('change', (e) => {
                this.currentFilters.console = e.target.value;
                this.applyFilters();
            });
        }
        
        if (yearFilter) {
            yearFilter.addEventListener('change', (e) => {
                this.currentFilters.year = e.target.value;
                this.applyFilters();
            });
        }
    }

    setupReset() {
        const button = document.getElementById('reset-filters');
        if (!button) return;
        
        button.addEventListener('click', () => {
            this.currentFilters = { searchQuery: '', console: '', year: '' };
            document.getElementById('search-input').value = '';
            document.getElementById('console-filter').value = '';
            document.getElementById('year-filter').value = '';
            this.applyFilters();
        });
    }

    applyFilters() {
        const filtered = this.gameManager.getGames().filter(game => {
            const matchesSearch = !this.currentFilters.searchQuery || 
                game.title.toLowerCase().includes(this.currentFilters.searchQuery) ||
                (Array.isArray(game.console) ? 
                    game.console.some(c => c.toLowerCase().includes(this.currentFilters.searchQuery)) :
                    game.console.toLowerCase().includes(this.currentFilters.searchQuery));
            
            const matchesConsole = !this.currentFilters.console || 
                (Array.isArray(game.console) ? 
                    game.console.includes(this.currentFilters.console) :
                    game.console === this.currentFilters.console);
            
            const matchesYear = !this.currentFilters.year || 
                game.year.toString() === this.currentFilters.year;
            
            return matchesSearch && matchesConsole && matchesYear;
        });
        
        // Disparar evento personalizado con los resultados filtrados
        const event = new CustomEvent('filtersApplied', { detail: filtered });
        document.dispatchEvent(event);
        
        return filtered;
    }
}