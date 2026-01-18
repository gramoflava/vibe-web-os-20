/* ============================================
   Notifications System
   Toast notifications with stacking
   ============================================ */

const Notifications = (() => {
  const container = document.getElementById('notifications-container');
  let notificationId = 0;

  /**
   * Show a notification
   */
  function show({ title, body, icon = '📄', type = 'info', duration = 5000, actions = [] }) {
    const id = ++notificationId;

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
    return show({ title, body, icon: '✅', type: 'success' });
  }

  /**
   * Show error notification
   */
  function error(title, body) {
    return show({ title, body, icon: '❌', type: 'error' });
  }

  /**
   * Show warning notification
   */
  function warning(title, body) {
    return show({ title, body, icon: '⚠️', type: 'warning' });
  }

  /**
   * Show info notification
   */
  function info(title, body) {
    return show({ title, body, icon: 'ℹ️', type: 'info' });
  }

  return {
    show,
    dismiss,
    clearAll,
    success,
    error,
    warning,
    info
  };
})();
