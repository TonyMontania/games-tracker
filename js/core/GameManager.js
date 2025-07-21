export class GameManager {
    constructor() {
        this.currentFranchise = null;
        this.games = [];
        this._ready = false;
        this._readyPromise = null;
    }

    async loadFranchise(franchiseId) {
        try {
            this._ready = false;
            const response = await fetch(`data/franchises/${franchiseId}.json`);
            this.games = await response.json();
            this.currentFranchise = franchiseId;
            this._ready = true;
            return this.games;
        } catch (error) {
            console.error('Error loading franchise:', error);
            this.games = [];
            throw error;
        }
    }

    async ensureGamesLoaded() {
        if (this._ready) return;
        if (!this._readyPromise) {
            this._readyPromise = this.loadFranchise('sonic'); // Default
        }
        await this._readyPromise;
    }

    getGames() {
        return this.games;
    }

    getCurrentFranchise() {
        return this.currentFranchise || 'sonic';
    }
}