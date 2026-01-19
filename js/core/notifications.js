/* ============================================
   Notifications System
   Toast notifications with stacking
   ============================================ */

const Notifications = (() => {
  const container = document.getElementById('notifications-container');
  let notificationId = 0;
  let notificationHistory = [];

  /**
   * Show a notification
   */
  function show({ title, body, icon, type = 'info', duration = 5000, actions = [] }) {
    // Default icon if not provided
    if (!icon) {
      icon = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 24px; height: 24px;">
                <path d="M7 2H14L19 7V20C19 21.1046 18.1046 22 17 22H7C5.89543 22 5 21.1046 5 20V4C5 2.89543 5.89543 2 7 2Z" fill="currentColor" opacity="0.3"/>
                <path d="M14 2V7H19" stroke="currentColor" stroke-width="1.5" fill="none"/>
              </svg>`;
    }
    const id = ++notificationId;

    // Add to history
    notificationHistory.unshift({
      id,
      title,
      body,
      icon,
      type,
      timestamp: new Date(),
      read: false
    });

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.dataset.id = id;

    notification.innerHTML = `
      <div class="notification-icon">${icon}</div>
      <div class="notification-content">
        <div class="notification-title">${title}</div>
        ${body ? `<div class="notification-body">${body}</div>` : ''}
        ${actions.length > 0 ? `
          <div class="notification-actions">
            ${actions.map((action, index) => `
              <button class="notification-action ${action.primary ? 'primary' : ''}" data-action="${index}">
                ${action.label}
              </button>
            `).join('')}
          </div>
        ` : ''}
      </div>
      <button class="notification-close" aria-label="Close">×</button>
    `;

    // Add to container
    container.appendChild(notification);

    // Setup event listeners
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => dismiss(id));

    // Handle action buttons
    if (actions.length > 0) {
      notification.querySelectorAll('.notification-action').forEach(btn => {
        btn.addEventListener('click', () => {
          const actionIndex = parseInt(btn.dataset.action);
          if (actions[actionIndex] && actions[actionIndex].callback) {
            actions[actionIndex].callback();
          }
          dismiss(id);
        });
      });
    }

    // Click to dismiss
    notification.addEventListener('click', (e) => {
      if (!e.target.closest('.notification-action')) {
        dismiss(id);
      }
    });

    // Auto-dismiss
    if (duration > 0) {
      setTimeout(() => dismiss(id), duration);
    }

    Bus.emit('notification:shown', { id, title });

    return id;
  }

  /**
   * Dismiss a notification
   */
  function dismiss(id) {
    const notification = container.querySelector(`[data-id="${id}"]`);
    if (!notification) return;

    notification.classList.add('exiting');

    setTimeout(() => {
      notification.remove();
      Bus.emit('notification:dismissed', { id });
    }, 250);
  }

  /**
   * Clear all notifications
   */
  function clearAll() {
    const notifications = container.querySelectorAll('.notification');
    notifications.forEach(n => {
      const id = parseInt(n.dataset.id);
      dismiss(id);
    });
  }

  /**
   * Show success notification
   */
  function success(title, body) {
    const icon = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 24px; height: 24px; color: var(--success);">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>`;
    return show({ title, body, icon, type: 'success' });
  }

  /**
   * Show error notification
   */
  function error(title, body) {
    const icon = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 24px; height: 24px; color: var(--error);">
                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>`;
    return show({ title, body, icon, type: 'error' });
  }

  /**
   * Show warning notification
   */
  function warning(title, body) {
    const icon = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 24px; height: 24px; color: var(--warning);">
                    <path d="M12 2L2 20H22L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                    <path d="M12 9V13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    <circle cx="12" cy="17" r="0.5" fill="currentColor" stroke="currentColor"/>
                  </svg>`;
    return show({ title, body, icon, type: 'warning' });
  }

  /**
   * Show info notification
   */
  function info(title, body) {
    const icon = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 24px; height: 24px; color: var(--accent-blue);">
                    <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2" fill="none"/>
                    <path d="M12 16V12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    <circle cx="12" cy="8" r="0.5" fill="currentColor" stroke="currentColor"/>
                  </svg>`;
    return show({ title, body, icon, type: 'info' });
  }

  /**
   * Get notification history
   */
  function getHistory() {
    return notificationHistory;
  }

  /**
   * Mark notification as read
   */
  function markAsRead(id) {
    const notification = notificationHistory.find(n => n.id === id);
    if (notification) {
      notification.read = true;
    }
  }

  /**
   * Mark all notifications as read
   */
  function markAllAsRead() {
    notificationHistory.forEach(n => n.read = true);
  }

  /**
   * Get unread count
   */
  function getUnreadCount() {
    return notificationHistory.filter(n => !n.read).length;
  }

  /**
   * Clear history
   */
  function clearHistory() {
    notificationHistory = [];
  }

  return {
    show,
    dismiss,
    clearAll,
    success,
    error,
    warning,
    info,
    getHistory,
    markAsRead,
    markAllAsRead,
    getUnreadCount,
    clearHistory
  };
})();
