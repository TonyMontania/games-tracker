# Games Tracker

🎮 A customizable web tracker to keep track of game progress by saga or franchise. Inspired by the style of [1ccTracker de Touhou](https://doopu.github.io/1ccTracker/), this project is completely **offline**, self-hosted and easy to modify.

---

## 📸 Screenshots

![Screenshot1](assets/github/screenshot1.png)
![Screenshot2](assets/github/screenshot2.png)
![Screenshot3](assets/github/screenshot3.png)
![Screenshot4](assets/github/screenshot4.png)

---

## 🧩 Features.

- 🌙 Dark and light theme.
- 🔎 Search and filtering by name, console and progress status.
- 💾 Progress stored locally in `user_progress.json`.
- 🧠 Separation between data, interface and logic.
- ✏️ Easy to edit, add games or create new franchises.
- 📁 Completely static: works in any browser.

---

## 🛠️ Project Structure.

```
├── index.html                  # Main HTML file
├── js/                         # Main JavaScript code
│   ├── components/            # Visual components
│   ├── core/                  # Tracker main logic
│   └── utils/                 # General utilities
├── styles/                    # CSS files
│   ├── components/           # Styles per component
│   └── themes/               # Light and dark themes
├── assets/                    # Graphic resources
│   ├── covers/               # Game covers
│   ├── emeralds/             # Progress icons
│   ├── github/               # Project screenshots
│   └── icons/                # General icons
├── data/                      # JSON data of the project
│   ├── franchises/           # Listing of games by franchise
│   ├── progress/             # User progress and templates
│   └── schemas/              # JSON schemas for validation
└── README.md / LICENSE / .gitignore
```

---

## ⚙️ Tools and Technologies

- HTML5, CSS3 and modern JavaScript.
- Data management with `.json` files.
- LocalStorage for progress persistence.
- No frameworks or external dependencies required.

---

## 🚀 Installation

1. Clone the repository:

```bash
git clone https://github.com/TonyMontania/games-tracker.git
```

2. Open `index.html` in your browser.

You are done! No server required.

---

## 🗃️ Customization

- To modify the games of a franchise, edit the files in:

```
data/franchises/
```

- To create a new franchise, add a new `.json` file similar to the existing ones (`mario.json`, `sonic.json`).
- To edit the progress directly: `data/progress/user_progress.json`.

---

## 🧪 Data Validation.

JSON schemas are used to validate both templates and progress:

- `data/schemas/progress.schema.json`
- `data/schemas/template.schema.json`

---

## 📜 License

This project is licensed under the MIT license. See [LICENSE](LICENSE) for more details.

---

## ✍️ Author.

Made with 💙 by [TonyMontania](https://github.com/TonyMontania)
