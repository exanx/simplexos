# Simplex OS 🚀

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge&logo=rocket)](https://your-username.github.io/simplex-os/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

Simplex OS is a feature-rich, web-based desktop environment built entirely with vanilla HTML, CSS, and JavaScript. It's a playground for exploring UI/UX concepts, demonstrating the power of modern browser capabilities, and creating a persistent, customizable user experience without any backend or frameworks.

![Simplex OS Desktop Screenshot](./screenshots/simplex_os_desktop.png)

## ✨ Key Features

-   **Complete Window Management:** Draggable, resizable, minimizable, and maximizable windows with active/inactive states.
-   **Persistent State:** Your settings, installed apps, notes, and desktop shortcuts are saved in `localStorage`, so your session is just as you left it.
-   **Taskbar & Start Menu:** A fully functional taskbar with an app list, running window indicators, and a searchable Start Menu with both list and grid views.
-   **Rich Theming & Personalization:**
    -   Multiple built-in themes (Dark, Light, Hacker, etc.).
    -   Customize desktop wallpapers (from a default list or your own images).
    -   Use color pickers to change the accent colors of the Start button, icons, and active window borders.
    -   Load your own custom CSS file for ultimate control.
-   **Built-in Application Suite:**
    -   **Productivity:** Notes, TextPad, Calculator, Clock (with Timer/Stopwatch).
    -   **Creativity:** A robust Paint application with various brushes, shapes, and tools.
    -   **Media:** Image Viewer with editing tools (crop, rotate, filters) and a Media Player for local audio/video and YouTube links.
    -   **System:** Settings, App Installer, and a simple Browser.
-   **Dynamic App Installation:** Install new, custom-built applications from a `.js` file or the official App Library without needing to refresh the page.
-   **Desktop Experience:** Add and remove desktop shortcuts for your favorite apps, and place interactive widgets like a clock, to-do list, or image frame.
-   **Lock Screen:** A demonstration of a secure lock screen and password setup flow (using a simple hash, for conceptual purposes).

## 🖥️ Live Demo

Experience Simplex OS directly in your browser. No installation required!

### [**➡️ Try Simplex OS Now!**](https://your-username.github.io/simplex-os/)

*(Note: Replace `your-username.github.io/simplex-os` with your actual deployment link.)*

## 📸 Screenshots

| Deep Personalization in Settings                                                                 | Searchable Start Menu (Grid View)                                                                  |
| ------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------- |
| [![Settings App Screenshot](./screenshots/settings_app.png)](./screenshots/settings_app.png)     | [![Start Menu Grid View Screenshot](./screenshots/start_menu_grid.png)](./screenshots/start_menu_grid.png) |
| **Feature-Rich Paint App**                                                                       | **Notes App with Rich Text**                                                                       |
| [![Paint App Screenshot](./screenshots/paint_app.png)](./screenshots/paint_app.png)               | [![Notes App Screenshot](./screenshots/notes_app.png)](./screenshots/notes_app.png)                 |
| **Hacker Theme**                                                                                 | **Interactive Desktop Widgets**                                                                    |
| [![Hacker Theme Screenshot](./screenshots/hacker_theme.png)](./screenshots/hacker_theme.png) | [![Desktop Widgets Screenshot](./screenshots/desktop_widgets.png)](./screenshots/desktop_widgets.png) |

*(You should create a `screenshots` folder in your repository and place your images there for these links to work.)*

## 🚀 Getting Started

Interacting with Simplex OS is designed to be intuitive:

1.  **Explore:** Use the **Start Menu** to discover and launch built-in applications.
2.  **Organize:** Right-click on apps in the Start Menu to add shortcuts to your desktop.
3.  **Multitask:** Drag windows by their title bars, resize from the corners, and use the taskbar to switch between open applications.
4.  **Personalize:** Open the **Settings** app to change your wallpaper, theme, and accent colors.
5.  **Expand:** Open the **App Installer** to add new applications from the App Library or your own `.js` files.

## 🛠️ Creating Your Own Apps

Simplex OS has a simple and powerful API for creating your own custom applications. All you need is a single JavaScript file.

The core of any app is the `simplexOS_AppConfig` object, where you define its name, icon, and initialization logic.

```javascript
// MyAwesomeApp.js
var simplexOS_AppConfig = {
  name: "My Awesome App",
  icon: '<i class="fa-solid fa-star"></i>',
  defaultSize: { width: 400, height: 250 },

  init: function(contentEl, windowId) {
    // Your app's HTML and logic goes here
    contentEl.innerHTML = `<h3>Hello from ${this.name}!</h3>`;
  }
};


For a complete walkthrough on building, styling, and adding functionality to your apps, check out the official guide:

Read the Full App Development Guide »

(This link assumes you host the HTML guide I wrote for you at this path.)

💻 Running Locally

No complex build process is required to run Simplex OS locally.

Clone the repository:

Generated bash
git clone https://github.com/your-username/simplex-os.git
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
Bash
IGNORE_WHEN_COPYING_END

Navigate to the directory:

Generated bash
cd simplex-os
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
Bash
IGNORE_WHEN_COPYING_END

Open index.html:
You can open the index.html file directly in your browser. For the best experience and to ensure all features (like the media player's visualizer) work correctly, it's recommended to use a local web server. A great tool for this is the Live Server extension for VS Code.

💡 Future Goals

A simple, abstracted "File System" for apps to read/write from.

More interactive widgets (Weather, RSS Feed).

System-wide keyboard shortcuts.

Improved accessibility and touch-screen interactions.

❤️ Contributing

Contributions are welcome! Whether it's a bug fix, a new feature, a new theme, or a new built-in app, feel free to fork the repository and submit a pull request.

Fork the Project

Create your Feature Branch (git checkout -b feature/AmazingFeature)

Commit your Changes (git commit -m 'Add some AmazingFeature')

Push to the Branch (git push origin feature/AmazingFeature)

Open a Pull Request

📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

Generated code
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
IGNORE_WHEN_COPYING_END
