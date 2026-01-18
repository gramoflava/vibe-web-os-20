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
        icon: '▶️',
        action: () => Apps.open(appId),
        disabled: isRunning
      },
      {
        label: 'Quit',
        icon: '⏹️',
        action: () => quitApp(appId),
        disabled: !isRunning
      },
      { divider: true },
      {
        label: app.keepInDock ? 'Remove from Dock' : 'Keep in Dock',
        icon: '📌',
        action: () => toggleKeepInDock(appId)
      }
    ];

    // TODO: Show context menu
    console.log('Dock context menu:', menuItems);
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
