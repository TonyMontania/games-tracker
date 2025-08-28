import { escapeHTML } from '../utils/helpers.js';

export class GameCard {
  constructor(game, progressManager, franchiseId) {
    this.game = game;
    this.progressManager = progressManager;
    this.franchiseId = franchiseId;
  }

  getCompletionStatus() {
    return this.game.categories?.every(cat =>
      this.progressManager.isCompleted(this.game.id, cat.id)
    ) || false;
  }

  render() {
    const allCompleted = this.getCompletionStatus();
    const imagePath = `assets/covers/${this.franchiseId}/${this.game.image}`;

    const safeTitle = escapeHTML(this.game.title || '');
    const safeGeneration = escapeHTML(this.game.generation || '');
    const safeYear = escapeHTML(String(this.game.year ?? ''));

    const consoles = Array.isArray(this.game.console)
      ? this.game.console.map(c => `<span>${escapeHTML(c)}</span>`).join('')
      : `<span>${escapeHTML(this.game.console || '')}</span>`;

    return `
      <div class="game-card ${allCompleted ? 'all-completed' : ''}" data-game-id="${escapeHTML(this.game.id)}">
        <h3>${safeTitle}</h3>
        <div class="game-meta">
          <div class="consoles-container">${consoles}</div>
          <div class="year-gen">${safeYear} | ${safeGeneration}</div>
        </div>
        <img src="${imagePath}" alt="${safeTitle}" loading="lazy" onerror="this.src='assets/no-image.png'">

        ${allCompleted ? '<div class="completed-badge">Completed!</div>' : ''}

        <!-- NUEVO: acciones masivas -->
        <div class="bulk-actions">
          <button class="btn-bulk btn-select-all" data-game="${escapeHTML(this.game.id)}">Select all</button>
          <button class="btn-bulk btn-clear-all" data-game="${escapeHTML(this.game.id)}">Clear all</button>
        </div>

        <div class="progress-options">
          ${this.game.categories?.map(cat => this.renderCheckbox(cat)).join('') || ''}
        </div>
      </div>
    `;
  }

  renderCheckbox(category) {
    const checked = this.progressManager.isCompleted(this.game.id, category.id) ? 'checked' : '';
    const safeName = escapeHTML(category.name || '');
    const safeCat = escapeHTML(category.id || '');
    const safeGame = escapeHTML(this.game.id || '');
    return `
      <label>
        <input type="checkbox" 
               class="progress-checkbox"
               aria-label="${safeName}"
               data-game="${safeGame}" 
               data-category="${safeCat}"
               ${checked}>
        <span>${safeName}</span>
      </label>
    `;
  }
}