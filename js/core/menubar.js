/* ============================================
   Menu Bar Controller
   Top menu bar with clock and controls
   ============================================ */

const MenuBar = (() => {
  let clockInterval = null;

  /**
   * Initialize menu bar
   */
  function init() {
    setupClock();
    setupSpotlightTrigger();
    setupNotificationsTrigger();

    // Listen for window focus changes to update app name
    Bus.on('window:focused', ({ id }) => {
      const windowData = WindowManager.get(id);
      if (windowData) {
        updateAppName(windowData.title);
      }
    });

    Bus.on('window:closed', () => {
      const allWindows = WindowManager.getAll();
      if (allWindows.length === 0) {
        updateAppName('Finder');
      }
    });
  }

  /**
   * Setup and start the clock
   */
  function setupClock() {
    const clockEl = document.getElementById('menubar-clock');
    if (!clockEl) return;

    function updateClock() {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12;

      clockEl.textContent = `${displayHours}:${minutes} ${ampm}`;
    }

    updateClock();
    clockInterval = setInterval(updateClock, 1000);
  }

  /**
   * Setup spotlight search trigger
   */
  function setupSpotlightTrigger() {
    const trigger = document.getElementById('spotlight-trigger');
    if (!trigger) return;

    trigger.addEventListener('click', () => {
      Spotlight.toggle();
    });
  }

  /**
   * Setup notifications trigger
   */
  function setupNotificationsTrigger() {
    const trigger = document.getElementById('notifications-trigger');
    if (!trigger) return;

    trigger.addEventListener('click', () => {
      // TODO: Show notifications center
      Notifications.show({
        title: 'Notifications',
        body: 'No new notifications',
        icon: '🔔'
      });
    });
  }

  /**
   * Update the app name in menu bar
   */
  function updateAppName(name) {
    const appNameEl = document.getElementById('menubar-app-name');
    if (appNameEl) {
      appNameEl.textContent = name;
    }
  }

  /**
   * Cleanup
   */
  function destroy() {
    if (clockInterval) {
      clearInterval(clockInterval);
      clockInterval = null;
    }
  }

  return {
    init,
    updateAppName,
    destroy
  };
})();
