/* ============================================
   App Registry
   Central registry for all applications
   ============================================ */

const Apps = (() => {
  const registry = new Map();

  /**
   * Register an application
   */
  function register({ id, name, icon, description = '', category = '', launch, keepInDock = false }) {
    if (registry.has(id)) {
      console.warn(`App with id "${id}" is already registered`);
      return;
    }

    registry.set(id, {
      id,
      name,
      icon,
      description,
      category,
      launch,
      keepInDock,
      windows: []
    });

    Bus.emit('app:registered', { id, name, icon });
  }

  /**
   * Unregister an application
   */
  function unregister(id) {
    if (!registry.has(id)) {
      console.warn(`App with id "${id}" is not registered`);
      return;
    }

    registry.delete(id);
    Bus.emit('app:unregistered', { id });
  }

  /**
   * Get application by ID
   */
  function get(id) {
    return registry.get(id);
  }

  /**
   * Get all registered applications
   */
  function list() {
    return Array.from(registry.values());
  }

  /**
   * Get apps by category
   */
  function listByCategory(category) {
    return list().filter(app => app.category === category);
  }

  /**
   * Open/launch an application
   */
  function open(id, args = {}) {
    const app = registry.get(id);
    if (!app) {
      console.error(`App with id "${id}" not found`);
      return;
    }

    try {
      // Call the app's launch function
      app.launch(args);

      // Emit event
      Bus.emit('app:opened', { id, args });
    } catch (error) {
      console.error(`Failed to launch app "${id}":`, error);
      Bus.emit('app:error', { id, error: error.message });
    }
  }

  /**
   * Check if app is running (has open windows)
   */
  function isRunning(id) {
    const app = registry.get(id);
    if (!app) return false;

    // Check if app has any windows open
    const allWindows = WindowManager.getAll();
    return allWindows.some(w => w.id.startsWith(id));
  }

  return {
    register,
    unregister,
    get,
    list,
    listByCategory,
    open,
    isRunning
  };
})();
