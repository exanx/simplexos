# Simplex OS 🚀

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge&logo=rocket)](https://exanx.github.io/SimplexOS/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

Simplex OS is a feature-rich, web-based desktop environment built entirely with vanilla HTML, CSS, and JavaScript. It's a playground for exploring UI/UX concepts, demonstrating the power of modern browser capabilities, and creating a persistent, customizable user experience without any backend or frameworks.

![Simplex OS Desktop Screenshot showing multiple apps open](https://raw.githubusercontent.com/exanx/SimplexOS/refs/heads/main/screenshots/Screenshot_9-7-2025_203957_exanx.github.io.jpeg)

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

### [**➡️ Try Simplex OS Now!**](https://exanx.github.io/SimplexOS/)

## 📸 Screenshots

| Deep Personalization                                                                                                                               | Searchable Start Menu                                                                                                                            |
| -------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| ![Settings App Screenshot](https://raw.githubusercontent.com/exanx/SimplexOS/refs/heads/main/screenshots/Screenshot_9-7-2025_204131_exanx.github.io.jpeg) | ![Start Menu Screenshot](https://raw.githubusercontent.com/exanx/SimplexOS/refs/heads/main/screenshots/Screenshot_9-7-2025_204615_exanx.github.io.jpeg)     |
| **Custom Context Menus**                                                                                                                           | **Feature-Rich Apps**                                                                                                                            |
| ![Context Menu Screenshot](https://raw.githubusercontent.com/exanx/SimplexOS/refs/heads/main/screenshots/Screenshot_9-7-2025_204057_exanx.github.io.jpeg)   | ![Paint App Screenshot](https://raw.githubusercontent.com/exanx/SimplexOS/refs/heads/main/screenshots/Screenshot_9-7-2025_204036_exanx.github.io.jpeg)          |


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
