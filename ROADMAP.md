# 🧭 Roadmap – Games Series Progress Tracker

> This roadmap is a guide to ideas and goals. It is not a rigid commitment: PRs and suggestions are welcome!

## 🎯 Objectives (Short term)
- **New franchises**: Kirby (database + covers + categories)
- **UX**
  - ~~Saving/retrieving filters between sessions~~
  - ~~“Select all / Clear all” button per game~~
  - Search engine with suggestions (simple autocomplete)
- **Import/Export**
  - Export **all** franchises to a single JSON file
  - Visual import validation (summary of changes)
- **Accessibility**
  - Full keyboard navigation
  - Improved visible focus

## 🚀 Objectives (Mid term)
- **Statistics**
  - Overall % per franchise and total
  - Simple graphs (progress per year / per generation)
- **Templates**
  - Visual editor of categories per franchise (UI for templates)
  - Template version/compatibility (smooth migrations)
- **Synchronization** (opt-in)
  - File backups and reminders
  - Analyze synchronization providers (Dropbox/GDrive) – *exploratory*

## 🌌 Objectives (Long term)
- **More franchises**: Metroid, Pokémon, Castlevania
- **Public profile** (optional) with shareable progress (requires backend or gist)
- **i18n** (multi-language) – Spanish/English
- **“Speedrun” mode** with special categories and estimated times

## 🏗️ Infrastructure and Code
- Maintain modular architecture (core / components / utils / data)
- Basic tests (unit tests for helpers and import validation)
- GitHub Actions
  - Lint + build (static)
  - Automatic deployment to GitHub Pages

## 🤝 Contributions
- Look at **Issues** with tags:
  - `good first issue`, `help wanted`, `enhancement`, `data:franchise`
- Suggest new franchises with:
  - List of games (ID, title, year, generation, consoles)
  - Covers (PNG 280x400 approx.) in `assets/covers/<franchise>/`
  - Common + specific categories (see `template.schema.json`)
- PRs:
  - Branch from `main`: `feature/<name>`
  - Describe changes and attach screenshots when affecting UI

## 🗂️ Useful documents
- [README](./README.md)
- [CHANGELOG](./CHANGELOG.md)
- [Schemas](./data/schemas) – `progress.schema.json` / `template.schema.json`
