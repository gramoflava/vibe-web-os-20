/* ============================================
   Main Application Entry Point
   Orchestrates the entire system
   ============================================ */

// Wait for DOM to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

/**
 * Initialize the operating system
 */
function init() {
  console.log('%c🍎 Vibe Web OS 2.0%c\nApple HIG Edition', 'font-size: 24px; font-weight: bold;', 'font-size: 12px; color: #666;');

  // Start boot sequence
  Boot.start();

  // Setup keyboard shortcuts
  setupGlobalKeyboardShortcuts();

  // Setup error handling
  setupErrorHandling();
}

/**
 * Setup global keyboard shortcuts
 */
function setupGlobalKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    // Cmd+W or Ctrl+W - Close active window
    if ((e.metaKey || e.ctrlKey) && e.key === 'w') {
      e.preventDefault();
      const allWindows = WindowManager.getAll();
      const focused = allWindows.find(w => w.element.classList.contains('focused'));
      if (focused) {
        WindowManager.close(focused.id);
      }
    }

    // Cmd+M or Ctrl+M - Minimize active window
    if ((e.metaKey || e.ctrlKey) && e.key === 'm') {
      e.preventDefault();
      const allWindows = WindowManager.getAll();
      const focused = allWindows.find(w => w.element.classList.contains('focused'));
      if (focused) {
        WindowManager.minimize(focused.id);
      }
    }

    // Cmd+Q or Ctrl+Q - Quit app (close all windows of focused app)
    if ((e.metaKey || e.ctrlKey) && e.key === 'q') {
      e.preventDefault();
      const allWindows = WindowManager.getAll();
      const focused = allWindows.find(w => w.element.classList.contains('focused'));
      if (focused) {
        const appId = focused.id.split('-')[0];
        const appWindows = allWindows.filter(w => w.id.startsWith(appId));
        appWindows.forEach(w => WindowManager.close(w.id));
      }
    }
  });
}

/**
 * Setup global error handling
 */
function setupErrorHandling() {
  window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
    Notifications.error('Error', e.message);
  });

  window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
    Notifications.error('Error', 'An unexpected error occurred');
  });
}
