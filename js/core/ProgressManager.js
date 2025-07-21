import { Storage } from '../utils/storage.js';

export class ProgressManager {
  constructor() {
    this.progress = Storage.get('sonicProgress', {});
  }

    loadProgress() {
        try {
            const saved = localStorage.getItem('sonicProgress');
            return saved ? JSON.parse(saved) : {};
        } catch (e) {
            console.error('Error cargando progreso:', e);
            return {};
        }
    }

    saveProgress() {
        Storage.set('sonicProgress', this.progress);
    }

    updateProgress(gameId, categoryId, completed) {
        if (!this.progress[gameId]) this.progress[gameId] = {};
        this.progress[gameId][categoryId] = completed;
        this.saveProgress();
    }

    isCompleted(gameId, categoryId) {
        return !!this.progress[gameId]?.[categoryId];
    }
}