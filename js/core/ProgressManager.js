import { Storage } from '../utils/storage.js';

export class ProgressManager {
  constructor(franchiseId = 'sonic') {
    this.setFranchise(franchiseId);
  }

  /**
   * Cambia la franquicia activa y carga/sincroniza el progreso desde localStorage.
   * Clave de almacenamiento: "<franchiseId>Progress" (p.ej. "sonicProgress")
   */
  setFranchise(franchiseId) {
    this.franchiseId = franchiseId;
    this.storageKey = `${franchiseId}Progress`;
    this.progress = Storage.get(this.storageKey, {}); // { [gameId]: { [categoryId]: boolean } }
  }

  /** Persiste el progreso actual de la franquicia en localStorage */
  saveProgress() {
    Storage.set(this.storageKey, this.progress);
  }

  /**
   * Marca/desmarca una categoría de un juego.
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
   * Devuelve true si la categoría está completada.
   * @param {string} gameId
   * @param {string} categoryId
   */
  isCompleted(gameId, categoryId) {
    return !!this.progress[gameId]?.[categoryId];
  }

  /** Progreso de un juego (objeto de categorías) */
  getGameProgress(gameId) {
    return this.progress[gameId] || {};
  }

  /** Resetea el progreso de un juego */
  resetGame(gameId) {
    if (this.progress[gameId]) {
      delete this.progress[gameId];
      this.saveProgress();
    }
  }

  /** Limpia todo el progreso de la franquicia actual */
  clearAll() {
    this.progress = {};
    this.saveProgress();
  }
}