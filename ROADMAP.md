# 🧭 Roadmap – Games Series Progress Tracker

> Este roadmap es una guía de ideas y objetivos. No es un compromiso rígido: ¡PRs y sugerencias son bienvenidas!

## 🎯 Objetivos (Short term)
- **Nuevas franquicias**: Kirby (base de datos + portadas + categorías)
- **UX**
  - Guardado/recuperación de filtros entre sesiones
  - Botón “Select all / Clear all” por juego
  - Buscador con sugerencias (autocomplete simple)
- **Import/Export**
  - Exportar **todas** las franquicias a un único JSON
  - Validación visual de import (resumen de cambios)
- **Accesibilidad**
  - Navegación completa por teclado
  - Focus visible mejorado

## 🚀 Objetivos (Mid term)
- **Estadísticas**
  - % global por franquicia y total
  - Gráficos simples (progreso por año / por generación)
- **Plantillas**
  - Editor visual de categorías por franquicia (UI para templates)
  - Versión/Compatibilidad de templates (migraciones suaves)
- **Sincronización** (opt-in)
  - Backups a archivo y recordatorios
  - Analizar proveedores de sincronización (Dropbox/GDrive) – *exploratorio*

## 🌌 Objetivos (Long term)
- **Más franquicias**: Metroid, Pokémon, Castlevania
- **Perfil público** (opcional) con progreso compartible (requiere backend o gist)
- **i18n** (multi-idioma) – español/inglés
- **Modo “Speedrun”** con categorías especiales y tiempos estimados

## 🏗️ Infraestructura y Código
- Mantener arquitectura modular (core / components / utils / data)
- Tests básicos (unitarios para helpers y validación de import)
- GitHub Actions
  - Lint + build (estático)
  - Deploy automático a GitHub Pages

## 🤝 Contribuciones
- Mirar **Issues** con etiquetas:
  - `good first issue`, `help wanted`, `enhancement`, `data:franchise`
- Sugerir nuevas franquicias con:
  - Lista de juegos (ID, título, año, generación, consolas)
  - Portadas (PNG 280x400 aprox.) en `assets/covers/<franchise>/`
  - Categorías comunes + específicas (ver `template.schema.json`)
- PRs:
  - Rama desde `main`: `feature/<nombre>`
  - Describir cambios y adjuntar capturas cuando afecte UI

## 🗂️ Documentos útiles
- [README](./README.md)
- [CHANGELOG](./CHANGELOG.md)
- [Esquemas](./data/schemas) – `progress.schema.json` / `template.schema.json`