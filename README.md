# Vibe Web OS 2.0 - Apple HIG Edition

A browser-based operating system inspired by macOS, built following Apple's Human Interface Guidelines. This project improves upon the original vibe-web-os with superior UX, glassmorphism design, and polished interactions.

**🏆 NOW WITH DOOM! - Winner of the "Can It Run DOOM?" Challenge**

![Vibe Web OS 2.0](https://img.shields.io/badge/version-2.0.0-blue)
![DOOM Compatible](https://img.shields.io/badge/DOOM-Compatible-red)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

## ✨ Key Features

### 🎨 Apple-Inspired Design
- **Glassmorphism**: Translucent windows with backdrop blur effects
- **SF Pro Typography**: Apple's system font with responsive sizing
- **Refined Color Palette**: Subtle gradients and elevated shadows
- **Smooth Animations**: 60fps spring-based transitions
- **Light & Dark Themes**: Beautiful themes following Apple's design language

### 🪟 Advanced Window Management
- **Drag & Resize**: Smooth window manipulation with constraints
- **Window Snapping**: Drag to screen edges for automatic tiling
  - Left edge: 50% width, left-aligned
  - Right edge: 50% width, right-aligned
  - Top edge: Fullscreen maximize
- **Minimize to Dock**: Animated minimize with dock integration
- **Keyboard Shortcuts**: Full keyboard navigation

### 🔍 Spotlight Search
- **Global Search**: Cmd+Space to search apps and files
- **Fuzzy Matching**: Find what you need quickly
- **Keyboard Navigation**: Arrow keys and Enter to navigate results
- **Real-time Results**: Instant search as you type

### 🚀 macOS-Style Dock
- **Magnification Effect**: Icons enlarge on hover with spring animation
- **Running Indicators**: Small dots show running applications
- **Right-Click Menus**: Context menus for app management
- **Bounce Animation**: Apps bounce when launching

### 📱 Built-in Applications

#### 📁 Finder
- File manager with sidebar navigation
- Create, rename, and delete files/folders
- Icon grid view with file type indicators
- Upload files from your computer
- Storage usage display with real-time statistics
- Double-click to open files in appropriate apps

#### 💻 CodeEdit
- **Professional code editor** with project management
- File tree sidebar for easy navigation
- Syntax highlighting for multiple languages
- Create and delete files within projects
- Built-in templates (C++, HTML5, JavaScript)
- Run code directly (HTML opens in new window, JS in console)
- Real-time stats (lines, characters)
- Language detection from file extensions
- Tab key support (2 spaces)

#### 📝 TextEdit

- Simple text editor for quick edits
- Save and Save As functionality
- Unsaved changes indicator
- Keyboard shortcuts (Cmd+S to save)

#### 📒 Notes

- **Apple Notes-style interface** with sidebar
- Create, edit, and delete notes
- Auto-save after 1 second of inactivity
- Smart titles from first line of content
- Relative timestamps (Just now, 5m ago, etc.)
- Persistent storage (not shown in Finder)
- Minimum one note requirement

#### 🖼️ Preview

- Image viewer for your files
- Supports common formats (PNG, JPG, GIF, WebP, SVG)
- Clean, distraction-free viewing
- Automatic file detection from Finder

#### 💀 DOOM
- **Classic FPS game from 1993** running in your browser!
- Powered by [js-dos](https://js-dos.com/) emulator
- Full DOS game experience in a window
- Controls: Arrow Keys (move), Ctrl (fire), Space (use), 1-7 (weapons)
- Click inside the window to start playing

#### ⚙️ System Preferences
- **Appearance**: Switch between light and dark themes
- **Wallpaper**: Set custom background images (online URLs only)
  - Default wallpaper from Picsum Photos
  - Preset wallpapers (nature, space)
  - Storage limitation notice (5-10MB localStorage)
- **Dock Settings**: Position and auto-hide options
- **Factory Reset**: Reset all storage to mint state
  - Double confirmation (dialog + type "RESET")
  - Clears all files, notes, settings, and preferences
  - Reloads OS with defaults
- **About**: System information and credits

### ⌨️ Keyboard Shortcuts
- `Cmd+Space` - Open Spotlight search
- `Cmd+W` - Close active window
- `Cmd+M` - Minimize active window
- `Cmd+Q` - Quit application (close all windows)
- `Cmd+S` - Save file (in TextEdit)
- `Esc` - Close Spotlight/modals

### 📡 Offline Support
- Service Worker for offline functionality
- Works after initial load, even without internet
- Cached assets for instant loading

## 🚀 Quick Start

### Option 1: Open Directly
Simply open `index.html` in a modern browser (Chrome 76+, Safari 14+, Firefox 103+).

### Option 2: Local Server
For full functionality (including Service Worker):

```bash
# Using Python 3
python3 -m http.server 8080

# Using Node.js (http-server)
npx http-server -p 8080

# Using PHP
php -S localhost:8080
```

Then visit `http://localhost:8080` in your browser.

## 🏗️ Architecture

### Technology Stack
- **Pure HTML5/CSS3/JavaScript** - No frameworks or build tools
- **Modern Browser Features** - backdrop-filter, CSS Grid, ES6+
- **localStorage** - File system persistence
- **Service Worker** - Offline capability

### Project Structure
```
vibe-web-os-2/
├── index.html              # Single entry point
├── sw.js                   # Service Worker
├── css/
│   ├── variables.css       # Design system tokens
│   ├── base.css            # Base styles & reset
│   ├── layout.css          # Layout & grid
│   ├── utilities.css       # Utility classes
│   └── components/         # Component styles
│       ├── window.css
│       ├── menubar.css
│       ├── dock.css
│       ├── spotlight.css
│       ├── notifications.css
│       └── context-menu.css
├── js/
│   ├── core/               # Core systems
│   │   ├── bus.js          # Event bus
│   │   ├── fs.js           # File system
│   │   ├── window-manager.js
│   │   ├── app-registry.js
│   │   ├── menubar.js
│   │   ├── dock.js
│   │   ├── spotlight.js
│   │   ├── notifications.js
│   │   ├── shell.js
│   │   └── boot.js
│   ├── apps/               # Applications
│   │   ├── finder.js
│   │   ├── textedit.js
│   │   ├── codeedit.js
│   │   ├── notes.js
│   │   ├── settings.js
│   │   ├── preview.js
│   │   └── doom.js
│   └── main.js             # Entry point
└── assets/
    ├── icons/
    └── wallpapers/
```

### Core Systems

**Event Bus** - Pub/sub pattern for decoupled communication
```javascript
Bus.on('window:created', (data) => { ... });
Bus.emit('app:opened', { id, args });
```

**File System** - Virtual FS with localStorage backend
```javascript
FS.write('/root/Desktop/file.txt', 'content');
FS.read('/root/Desktop/file.txt');
FS.mkdir('/root/Documents/newfolder');
```

**Window Manager** - Advanced window management
```javascript
WindowManager.create({ id, title, content, width, height });
WindowManager.minimize(id);
WindowManager.close(id);
```

**App Registry** - Application lifecycle management
```javascript
Apps.register({ id, name, icon, launch });
Apps.open(id, args);
```

## 🎨 Design System

### Color Palette (Dark Theme)
```css
--bg-primary: #1c1c1e;
--bg-secondary: #2c2c2e;
--accent-blue: #007aff;
--text-primary: #ffffff;
```

### Typography
```css
--font-system: -apple-system, BlinkMacSystemFont, "SF Pro Display";
--text-base: 15px;
--weight-medium: 500;
--weight-semibold: 600;
```

### Spacing (8px base)
```css
--space-2: 8px;
--space-4: 16px;
--space-6: 24px;
```

### Shadows & Blur
```css
--shadow-window: 0 20px 60px rgba(0, 0, 0, 0.5);
--blur-md: blur(20px);
--backdrop-window: blur(40px) saturate(180%);
```

## 🔧 Customization

### Creating a New App

```javascript
// Register your app
Apps.register({
  id: 'myapp',
  name: 'My App',
  icon: '🚀',
  description: 'My awesome app',
  category: 'utilities',
  keepInDock: true,
  launch: (args) => {
    const windowId = 'myapp-' + Date.now();

    WindowManager.create({
      id: windowId,
      title: 'My App',
      icon: '🚀',
      content: '<div>Hello World!</div>',
      width: 600,
      height: 400
    });
  }
});
```

### Adding a Custom Theme

1. Create a new CSS file in `css/themes/`
2. Define color variables under `[data-theme="mytheme"]`
3. Add theme switcher in System Preferences

### Custom Wallpapers

Add wallpaper URLs in System Preferences or set programmatically:
```javascript
Shell.setWallpaper('https://example.com/wallpaper.jpg');
```

## 📊 Browser Compatibility

| Browser | Version | Status |
|---------|---------|--------|
| Chrome  | 76+     | ✅ Full support |
| Safari  | 14+     | ✅ Full support |
| Firefox | 103+    | ✅ Full support |
| Edge    | 79+     | ✅ Full support |

**Required Features:**
- CSS `backdrop-filter` for glassmorphism
- CSS Grid & Flexbox
- ES6+ JavaScript (classes, arrow functions, async/await)
- localStorage API
- Service Worker API

## 🎯 Roadmap

### Planned Features (Post-MVP)
- [ ] Mission Control (window overview)
- [ ] Virtual desktops/workspaces
- [ ] Calculator app
- [ ] Safari (simple browser with iframe)
- [ ] App Store (plugin system)
- [ ] Drag & drop file operations
- [ ] Rich text editing in TextEdit
- [ ] File previews (Quick Look)
- [ ] Context menus everywhere
- [ ] Copy/paste between windows

## 🤝 Contributing

This project demonstrates vanilla web technologies following Apple's design principles. Contributions are welcome!

### Guidelines
- Follow Apple HIG for new features
- Maintain zero-dependency philosophy
- Ensure 60fps animations
- Test on Chrome, Safari, and Firefox
- Keep code modular and well-documented

## 📜 License

MIT License - feel free to use this project for learning or as a base for your own OS!

## 🙏 Acknowledgments

- Inspired by [vibe-web-os](https://github.com/AlecKotovichSAM/vibe-web-os)
- Design principles from [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- SF Pro font system by Apple Inc.

## 📞 Support

Found a bug or have a feature request? [Open an issue](../../issues)

---

**Built with ❤️ using vanilla HTML, CSS, and JavaScript**

*No frameworks • No build tools • 100% open source*
