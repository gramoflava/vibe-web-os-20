/* ============================================
   Dock Controller
   macOS-style dock with magnification
   ============================================ */

const Dock = (() => {
  const dockEl = document.getElementById('dock');
  const dockIcons = new Map();

  /**
   * Initialize dock
   */
  function init() {
    // Add favorite apps to dock
    addFavoriteApps();

    // Listen for app events
    Bus.on('app:opened', ({ id }) => {
      updateRunningIndicator(id, true);
    });

    Bus.on('window:closed', ({ id }) => {
      // Extract app ID from window ID
      const appId = id.split('-')[0];
      checkIfAppStillRunning(appId);
    });
  }

  /**
   * Add favorite apps to dock
   */
  function addFavoriteApps() {
    const apps = Apps.list().filter(app => app.keepInDock);

    apps.forEach(app => {
      addIcon(app.id, app.icon, app.name);
    });
  }

  /**
   * Add an icon to the dock
   */
  function addIcon(appId, icon, name) {
    if (dockIcons.has(appId)) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'dock-icon-wrapper';
    wrapper.dataset.appId = appId;

    wrapper.innerHTML = `
      <div class="dock-icon">
        <div class="dock-icon-image">${icon}</div>
      </div>
      <div class="dock-tooltip">${name}</div>
    `;

    // Click to open/focus app
    wrapper.addEventListener('click', () => {
      handleDockIconClick(appId);
    });

    // Right-click for context menu
    wrapper.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      showDockContextMenu(appId, e.clientX, e.clientY);
    });

    dockEl.appendChild(wrapper);
    dockIcons.set(appId, wrapper);
  }

  /**
   * Remove icon from dock
   */
  function removeIcon(appId) {
    const wrapper = dockIcons.get(appId);
    if (!wrapper) return;

    wrapper.remove();
    dockIcons.delete(appId);
  }

  /**
   * Handle dock icon click
   */
  function handleDockIconClick(appId) {
    // Check if app has open windows
    const allWindows = WindowManager.getAll();
    const appWindows = allWindows.filter(w => w.id.startsWith(appId));

    if (appWindows.length > 0) {
      // If window is minimized, restore it
      const firstWindow = appWindows[0];
      if (firstWindow.state === 'minimized') {
        WindowManager.restore(firstWindow.id);
      } else {
        // Focus the window
        WindowManager.focus(firstWindow.id);
      }
    } else {
      // Launch app
      Apps.open(appId);

      // Add bounce animation
      const wrapper = dockIcons.get(appId);
      if (wrapper) {
        wrapper.classList.add('bouncing');
        setTimeout(() => wrapper.classList.remove('bouncing'), 500);
      }
    }
  }

  /**
   * Update running indicator
   */
  function updateRunningIndicator(appId, isRunning) {
    const wrapper = dockIcons.get(appId);
    if (!wrapper) return;

    let indicator = wrapper.querySelector('.dock-running-indicator');

    if (isRunning && !indicator) {
      indicator = document.createElement('div');
      indicator.className = 'dock-running-indicator';
      wrapper.appendChild(indicator);
    } else if (!isRunning && indicator) {
      indicator.remove();
    }
  }

  /**
   * Check if app still has running windows
   */
  function checkIfAppStillRunning(appId) {
    const allWindows = WindowManager.getAll();
    const hasWindows = allWindows.some(w => w.id.startsWith(appId));

    if (!hasWindows) {
      updateRunningIndicator(appId, false);
    }
  }

  /**
   * Show dock context menu
   */
  function showDockContextMenu(appId, x, y) {
    const app = Apps.get(appId);
    if (!app) return;

    const isRunning = Apps.isRunning(appId);

    const menuItems = [
      {
        label: 'Open',
        icon: `<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 16px; height: 16px;">
                <path d="M3.33333 2L12.6667 8L3.33333 14V2Z" fill="currentColor" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>`,
        action: () => Apps.open(appId),
        disabled: isRunning
      },
      {
        label: 'Quit',
        icon: `<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 16px; height: 16px;">
                <rect x="4" y="4" width="8" height="8" rx="1.5" fill="currentColor" stroke="currentColor" stroke-width="1.5"/>
              </svg>`,
        action: () => quitApp(appId),
        disabled: !isRunning
      },
      { divider: true },
      {
        label: app.keepInDock ? 'Remove from Dock' : 'Keep in Dock',
        icon: `<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 16px; height: 16px;">
                <path d="M10.6667 2V4.66667C10.6667 5.33333 11.3333 6 12 6H12.6667C13 6 13.3333 6.13333 13.6 6.4C13.8667 6.66667 14 7 14 7.33333C14 7.66667 13.8667 8 13.6 8.26667C13.3333 8.53333 13 8.66667 12.6667 8.66667H3.33333C3 8.66667 2.66667 8.53333 2.4 8.26667C2.13333 8 2 7.66667 2 7.33333C2 7 2.13333 6.66667 2.4 6.4C2.66667 6.13333 3 6 3.33333 6H4C4.66667 6 5.33333 5.33333 5.33333 4.66667V2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M8 8.66667V14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>`,
        action: () => toggleKeepInDock(appId)
      }
    ];

    ContextMenu.show(menuItems, x, y);
  }

  /**
   * Quit all windows for an app
   */
  function quitApp(appId) {
    const allWindows = WindowManager.getAll();
    const appWindows = allWindows.filter(w => w.id.startsWith(appId));

    appWindows.forEach(w => {
      WindowManager.close(w.id);
    });
  }

  /**
   * Toggle keep in dock
   */
  function toggleKeepInDock(appId) {
    const app = Apps.get(appId);
    if (!app) return;

    app.keepInDock = !app.keepInDock;

    if (!app.keepInDock && !Apps.isRunning(appId)) {
      removeIcon(appId);
    } else if (app.keepInDock && !dockIcons.has(appId)) {
      addIcon(appId, app.icon, app.name);
    }
  }

  return {
    init,
    addIcon,
    removeIcon
  };
})();
