import { GameManager } from './core/GameManager.js';
import { ProgressManager } from './core/ProgressManager.js';
import { UIManager } from './core/UIManager.js';
import { FilterManager } from './core/FilterManager.js';

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const progressManager = new ProgressManager();
        const gameManager = new GameManager();
        await gameManager.loadFranchise('sonic');
        const filterManager = new FilterManager(gameManager);
        const uiManager = new UIManager(gameManager, filterManager, progressManager);
        
        await uiManager.initialize();

    } catch (error) {
        console.error('App initialization failed:', error);
        const gamesList = document.getElementById('games-list');
        if (gamesList) {
            gamesList.innerHTML = `
                <div class="error">
                    <p>Error loading application</p>
                    <button onclick="window.location.reload()">Try Again</button>
                </div>
            `;
        }
    }
});