import { Storage } from '../utils/storage.js';

export class ProgressManager {
  constructor(franchiseId = 'sonic') {
    this.setFranchise(franchiseId);
  }


  setFranchise(franchiseId) {
    this.franchiseId = franchiseId;
    this.storageKey = `${franchiseId}Progress`;
    this.progress = Storage.get(this.storageKey, {});
  }

  saveProgress() {
    Storage.set(this.storageKey, this.progress);
  }

  /**
   * Select/deselect a game category.
   * @param {string} gameId
   * @param {string} categoryId
   * @param {boolean} completed
   */
  updateProgress(gameId, categoryId, completed) {
    if (!this.progress[gameId]) this.progress[gameId] = {};
    this.progress[gameId][categoryId] = completed;
    this.saveProgress();
  }

  /**
   * Returns true if the category is complete.
   * @param {string} gameId
   * @param {string} categoryId
   */
  isCompleted(gameId, categoryId) {
    return !!this.progress[gameId]?.[categoryId];
  }

  getGameProgress(gameId) {
    return this.progress[gameId] || {};
  }

  resetGame(gameId) {
    if (this.progress[gameId]) {
      delete this.progress[gameId];
      this.saveProgress();
    }
  }

  clearAll() {
    this.progress = {};
    this.saveProgress();
  }
}