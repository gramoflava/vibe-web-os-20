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

    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      showNotificationsCenter();
    });

    // Update badge on new notifications
    Bus.on('notification:shown', updateNotificationBadge);
  }

  /**
   * Show notifications center panel
   */
  function showNotificationsCenter() {
    const history = Notifications.getHistory();
    const rect = document.getElementById('notifications-trigger').getBoundingClientRect();

    const menuItems = [];

    if (history.length === 0) {
      menuItems.push({
        label: 'No notifications',
        icon: `<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 16px; height: 16px;">
                <path d="M12 5.33333C12 4.27247 11.5786 3.25505 10.8284 2.50491C10.0783 1.75476 9.06087 1.33333 8 1.33333C6.93913 1.33333 5.92172 1.75476 5.17157 2.50491C4.42143 3.25505 4 4.27247 4 5.33333C4 10 2 11.3333 2 11.3333H14C14 11.3333 12 10 12 5.33333Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
              </svg>`,
        disabled: true
      });
    } else {
      // Add recent notifications (last 5)
      history.slice(0, 5).forEach(notification => {
        menuItems.push({
          label: notification.title,
          icon: notification.icon,
          action: () => {
            Notifications.markAsRead(notification.id);
            updateNotificationBadge();
          }
        });
      });

      if (history.length > 0) {
        menuItems.push({ divider: true });
        menuItems.push({
          label: 'Clear All',
          icon: `<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 16px; height: 16px;">
                  <path d="M2 4H3.33333H14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M5.33333 4V2.66667C5.33333 2.31304 5.47381 1.97391 5.72386 1.72386C5.97391 1.47381 6.31304 1.33333 6.66667 1.33333H9.33333C9.68696 1.33333 10.0261 1.47381 10.2761 1.72386C10.5262 1.97391 10.6667 2.31304 10.6667 2.66667V4M12.6667 4V13.3333C12.6667 13.687 12.5262 14.0261 12.2761 14.2761C12.0261 14.5262 11.687 14.6667 11.3333 14.6667H4.66667C4.31304 14.6667 3.97391 14.5262 3.72386 14.2761C3.47381 14.0261 3.33333 13.687 3.33333 13.3333V4H12.6667Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>`,
          action: () => {
            Notifications.clearHistory();
            updateNotificationBadge();
          }
        });
      }
    }

    ContextMenu.show(menuItems, rect.right - 250, rect.bottom + 5);
    Notifications.markAllAsRead();
    updateNotificationBadge();
  }

  /**
   * Update notification badge
   */
  function updateNotificationBadge() {
    const trigger = document.getElementById('notifications-trigger');
    if (!trigger) return;

    const unreadCount = Notifications.getUnreadCount();

    // Remove existing badge
    let badge = trigger.querySelector('.notification-badge');
    if (badge) {
      badge.remove();
    }

    // Add badge if there are unread notifications
    if (unreadCount > 0) {
      badge = document.createElement('span');
      badge.className = 'notification-badge';
      badge.textContent = unreadCount > 9 ? '9+' : unreadCount;
      trigger.appendChild(badge);
    }
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
