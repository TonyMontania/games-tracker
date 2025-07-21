import { Storage } from '../utils/storage.js';

export class GameCard {
  constructor(game, progressManager) {
    this.game = game;
    this.progressManager = progressManager;
  }

  getCompletionStatus() {
    return this.game.categories?.every(cat => 
      this.progressManager.isCompleted(this.game.id, cat.id)
    ) || false;
  }

  render() {
    const allCompleted = this.getCompletionStatus();

    return `
      <div class="game-card ${allCompleted ? 'all-completed' : ''}" data-game-id="${this.game.id}">
        <h3>${this.game.title}</h3>
        <div class="game-meta">
          <div class="consoles-container">
            ${Array.isArray(this.game.console) ? this.game.console.join(' | ') : this.game.console}
          </div>
          <div class="year-gen">${this.game.year} | ${this.game.generation}</div>
        </div>
        <img src="assets/covers/sonic/${this.game.image}" alt="${this.game.title}" onerror="this.src='assets/no-image.png'">
        ${allCompleted ? '<div class="completed-badge">Completed!</div>' : ''}
        <div class="progress-options">
          ${this.game.categories?.map(cat => this.renderCheckbox(cat)).join('') || ''}
        </div>
      </div>
    `;
  }

  renderCheckbox(category) {
    const checked = this.progressManager.isCompleted(this.game.id, category.id) ? 'checked' : '';
    return `
      <label>
        <input type="checkbox" 
               class="emerald-checkbox"
               data-game="${this.game.id}" 
               data-category="${category.id}"
               ${checked}>
        <span>${category.name}</span>
      </label>
    `;
  }
}