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
      const url = `data/franchises/${franchiseId}.json`;

      const response = await fetch(url, { cache: "no-cache" });
      if (!response.ok) {
        throw new Error(`No pude cargar ${url} (HTTP ${response.status})`);
      }

      this.games = await response.json();
      this.currentFranchise = franchiseId;
      this._ready = true;
      return this.games;
    } catch (err) {
      console.error('[GameManager] loadFranchise error:', err);
      this._ready = false;
      this.games = [];
      throw err;
    }
  }

  async ensureReady() {
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
