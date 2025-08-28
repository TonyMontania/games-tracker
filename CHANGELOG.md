# 📑 Changelog
All important release notes for **Games Tracker**.  
This format follows the convention of [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)  
and semantic versioning [SemVer](https://semver.org/).

---

## [v1.1.0] - 2025-08-27
### Added
- Franchise buttons (Sonic, Mario, Zelda) with themed colors.
- Light/dark theme toggle.
- Custom checkboxes:
  - Sonic → Chaos Emeralds 💎
  - Mario → Stars ⭐
  - Zelda → Triforce 🔺
- Import/Export progress with validations.
- **Select All / Clear All** buttons per game.
- Persistence of filters (search / console / year) per franchise.
- Persistence of theme and franchise in `localStorage`.

### Changed
- Better organization of CSS in modules (`styles/components/...`).
- Refactor of `UIManager.js` and `FilterManager.js` to support persistence.
- README.md updated with badges, Roadmap, and Progress.

---

## [Unreleased]
### Planned
- Autocomplete in the search engine (`#search-suggestions`).
- Global progress statistics (by franchise and total).
- Export all progress in a single JSON.
- Visual category editor.
- Support for new franchises (Kirby, Metroid, Pokémon...).
- Multi-language translations.
- Cloud synchronization.