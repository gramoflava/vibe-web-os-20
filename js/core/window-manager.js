/* ============================================
   Window Manager
   Enhanced window management with glassmorphism,
   drag, resize, snap, and smooth animations
   ============================================ */

const WindowManager = (() => {
  let windows = new Map();
  let zIndexCounter = 100;
  let activeWindow = null;
  let dragState = null;
  let resizeState = null;
  let snapIndicator = null;

  const SNAP_THRESHOLD = 50; // pixels from edge to trigger snap
  const MIN_WIDTH = 320;
  const MIN_HEIGHT = 200;

  /**
   * Create a new window
   */
  function create({ id, title, content, icon = '📄', width = 600, height = 400, x, y }) {
    if (windows.has(id)) {
      focus(id);
      return id;
    }

    // Calculate center position if not provided
    const menubarHeight = 28;
    const dockHeight = 80;
    const availableHeight = window.innerHeight - menubarHeight - dockHeight;
    const centerX = x ?? (window.innerWidth - width) / 2;
    const centerY = y ?? menubarHeight + (availableHeight - height) / 2;

    const windowEl = document.createElement('div');
    windowEl.className = 'window';
    windowEl.id = `window-${id}`;
    windowEl.style.width = `${width}px`;
    windowEl.style.height = `${height}px`;
    windowEl.style.left = `${centerX}px`;
    windowEl.style.top = `${centerY}px`;
    windowEl.style.zIndex = ++zIndexCounter;

    windowEl.innerHTML = `
      <div class="window-titlebar">
        <div class="window-controls">
          <button class="window-control-btn close" data-action="close" aria-label="Close">
            <svg viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L7 7M7 1L1 7" stroke="rgba(0,0,0,0.7)" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </button>
          <button class="window-control-btn minimize" data-action="minimize" aria-label="Minimize">
            <svg viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 4H7" stroke="rgba(0,0,0,0.7)" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </button>
          <button class="window-control-btn maximize" data-action="maximize" aria-label="Maximize">
            <svg viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 1V7M1 4H7" stroke="rgba(0,0,0,0.7)" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
        <span class="window-title">${title}</span>
        <div class="window-spacer"></div>
      </div>
      <div class="window-content">${content}</div>
      <div class="window-resize-handle"></div>
    `;

    document.getElementById('desktop-content').appendChild(windowEl);

    const windowData = {
      id,
      element: windowEl,
      title,
      icon,
      state: 'normal', // normal, minimized, maximized
      savedBounds: null // For restoring from maximized
    };

    windows.set(id, windowData);

    // Setup event listeners
    setupWindowEvents(windowEl, windowData);

    // Focus new window
    focus(id);

    // Emit event
    Bus.emit('window:created', { id, title, icon });

    return id;
  }

  /**
   * Setup window event listeners
   */
  function setupWindowEvents(windowEl, windowData) {
    const titlebar = windowEl.querySelector('.window-titlebar');
    const resizeHandle = windowEl.querySelector('.window-resize-handle');
    const controls = windowEl.querySelectorAll('.window-control-btn');

    // Titlebar drag
    titlebar.addEventListener('mousedown', (e) => {
      if (e.target.closest('.window-control-btn')) return;
      startDrag(windowData.id, e);
    });

    // Resize handle
    resizeHandle.addEventListener('mousedown', (e) => {
      startResize(windowData.id, e);
    });

    // Control buttons
    controls.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const action = btn.dataset.action;
        if (action === 'close') close(windowData.id);
        else if (action === 'minimize') minimize(windowData.id);
        else if (action === 'maximize') toggleMaximize(windowData.id);
      });
    });

    // Focus on click
    windowEl.addEventListener('mousedown', () => {
      focus(windowData.id);
    });
  }

  /**
   * Start dragging a window
   */
  function startDrag(id, e) {
    const windowData = windows.get(id);
    if (!windowData) return;

    const windowEl = windowData.element;

    // If window is maximized or snapped, restore it first
    if (windowData.state === 'maximized' || windowData.state.startsWith('snapped')) {
      // Restore to saved bounds
      if (windowData.savedBounds) {
        windowEl.classList.remove('maximized');
        windowEl.style.width = `${windowData.savedBounds.width}px`;
        windowEl.style.height = `${windowData.savedBounds.height}px`;

        // Position window under cursor, centered horizontally
        const newX = e.clientX - windowData.savedBounds.width / 2;
        const newY = e.clientY - 20; // 20px below cursor (roughly titlebar height)

        windowEl.style.left = `${newX}px`;
        windowEl.style.top = `${newY}px`;

        windowData.state = 'normal';
      }
    }

    const rect = windowEl.getBoundingClientRect();

    dragState = {
      id,
      startX: e.clientX,
      startY: e.clientY,
      initialX: rect.left,
      initialY: rect.top
    };

    focus(id);

    document.addEventListener('mousemove', handleDrag);
    document.addEventListener('mouseup', stopDrag);

    e.preventDefault();
  }

  /**
   * Handle drag movement
   */
  function handleDrag(e) {
    if (!dragState) return;

    const deltaX = e.clientX - dragState.startX;
    const deltaY = e.clientY - dragState.startY;

    let newX = dragState.initialX + deltaX;
    let newY = dragState.initialY + deltaY;

    const windowData = windows.get(dragState.id);
    const windowEl = windowData.element;

    // Update position
    windowEl.style.left = `${newX}px`;
    windowEl.style.top = `${newY}px`;

    // Check for snap zones
    checkSnapZones(e.clientX, e.clientY);
  }

  /**
   * Stop dragging
   */
  function stopDrag(e) {
    if (!dragState) return;

    const windowData = windows.get(dragState.id);

    // Apply snap if in zone
    applySnap(e.clientX, e.clientY, windowData);

    // Hide snap indicator
    hideSnapIndicator();

    dragState = null;

    document.removeEventListener('mousemove', handleDrag);
    document.removeEventListener('mouseup', stopDrag);
  }

  /**
   * Check if cursor is in snap zone
   */
  function checkSnapZones(x, y) {
    const snapZone = getSnapZone(x, y);

    if (snapZone) {
      showSnapIndicator(snapZone);
    } else {
      hideSnapIndicator();
    }
  }

  /**
   * Get snap zone based on cursor position
   */
  function getSnapZone(x, y) {
    const { innerWidth, innerHeight } = window;
    const menubarHeight = 28;
    const dockHeight = 70;

    if (y < menubarHeight + SNAP_THRESHOLD) {
      return 'maximize';
    }
    if (x < SNAP_THRESHOLD) {
      return 'left';
    }
    if (x > innerWidth - SNAP_THRESHOLD) {
      return 'right';
    }

    return null;
  }

  /**
   * Show snap indicator overlay
   */
  function showSnapIndicator(zone) {
    if (!snapIndicator) {
      snapIndicator = document.createElement('div');
      snapIndicator.className = 'window-snap-indicator';
      document.getElementById('desktop-content').appendChild(snapIndicator);
    }

    const menubarHeight = 28;
    const dockHeight = 70;

    // Position indicator based on zone
    if (zone === 'maximize') {
      snapIndicator.style.left = '0';
      snapIndicator.style.top = `${menubarHeight}px`;
      snapIndicator.style.width = '100%';
      snapIndicator.style.height = `calc(100% - ${menubarHeight + dockHeight}px)`;
    } else if (zone === 'left') {
      snapIndicator.style.left = '0';
      snapIndicator.style.top = `${menubarHeight}px`;
      snapIndicator.style.width = '50%';
      snapIndicator.style.height = `calc(100% - ${menubarHeight + dockHeight}px)`;
    } else if (zone === 'right') {
      snapIndicator.style.left = '50%';
      snapIndicator.style.top = `${menubarHeight}px`;
      snapIndicator.style.width = '50%';
      snapIndicator.style.height = `calc(100% - ${menubarHeight + dockHeight}px)`;
    }

    snapIndicator.style.display = 'block';
  }

  /**
   * Hide snap indicator
   */
  function hideSnapIndicator() {
    if (snapIndicator) {
      snapIndicator.style.display = 'none';
    }
  }

  /**
   * Apply snap based on zone
   */
  function applySnap(x, y, windowData) {
    const zone = getSnapZone(x, y);
    if (!zone) return;

    const windowEl = windowData.element;
    const menubarHeight = 28;
    const dockHeight = 70;

    // Save current bounds for restore
    if (windowData.state === 'normal') {
      windowData.savedBounds = {
        left: windowEl.offsetLeft,
        top: windowEl.offsetTop,
        width: windowEl.offsetWidth,
        height: windowEl.offsetHeight
      };
    }

    if (zone === 'maximize') {
      windowData.state = 'maximized';
      windowEl.classList.add('maximized');
      windowEl.style.left = '0';
      windowEl.style.top = `${menubarHeight}px`;
      windowEl.style.width = '100%';
      windowEl.style.height = `calc(100% - ${menubarHeight + dockHeight}px)`;
    } else if (zone === 'left') {
      windowData.state = 'snapped-left';
      windowEl.style.left = '0';
      windowEl.style.top = `${menubarHeight}px`;
      windowEl.style.width = '50%';
      windowEl.style.height = `calc(100% - ${menubarHeight + dockHeight}px)`;
    } else if (zone === 'right') {
      windowData.state = 'snapped-right';
      windowEl.style.left = '50%';
      windowEl.style.top = `${menubarHeight}px`;
      windowEl.style.width = '50%';
      windowEl.style.height = `calc(100% - ${menubarHeight + dockHeight}px)`;
    }

    Bus.emit('window:snapped', { id: windowData.id, zone });
  }

  /**
   * Start resizing a window
   */
  function startResize(id, e) {
    const windowData = windows.get(id);
    if (!windowData || windowData.state !== 'normal') return;

    const windowEl = windowData.element;
    const rect = windowEl.getBoundingClientRect();

    resizeState = {
      id,
      startX: e.clientX,
      startY: e.clientY,
      initialWidth: rect.width,
      initialHeight: rect.height
    };

    document.addEventListener('mousemove', handleResize);
    document.addEventListener('mouseup', stopResize);

    e.preventDefault();
    e.stopPropagation();
  }

  /**
   * Handle resize movement
   */
  function handleResize(e) {
    if (!resizeState) return;

    const deltaX = e.clientX - resizeState.startX;
    const deltaY = e.clientY - resizeState.startY;

    const newWidth = Math.max(MIN_WIDTH, resizeState.initialWidth + deltaX);
    const newHeight = Math.max(MIN_HEIGHT, resizeState.initialHeight + deltaY);

    const windowData = windows.get(resizeState.id);
    const windowEl = windowData.element;

    windowEl.style.width = `${newWidth}px`;
    windowEl.style.height = `${newHeight}px`;
  }

  /**
   * Stop resizing
   */
  function stopResize() {
    resizeState = null;
    document.removeEventListener('mousemove', handleResize);
    document.removeEventListener('mouseup', stopResize);
  }

  /**
   * Focus a window
   */
  function focus(id) {
    const windowData = windows.get(id);
    if (!windowData) return;

    // Remove focus from all windows
    windows.forEach(w => w.element.classList.remove('focused'));

    // Add focus to this window
    windowData.element.classList.add('focused');
    windowData.element.style.zIndex = ++zIndexCounter;

    activeWindow = id;

    Bus.emit('window:focused', { id });
  }

  /**
   * Minimize window
   */
  function minimize(id) {
    const windowData = windows.get(id);
    if (!windowData) return;

    windowData.state = 'minimized';
    windowData.element.style.display = 'none';

    Bus.emit('window:minimized', { id });
  }

  /**
   * Restore minimized window
   */
  function restore(id) {
    const windowData = windows.get(id);
    if (!windowData) return;

    windowData.state = 'normal';
    windowData.element.style.display = 'flex';

    focus(id);

    Bus.emit('window:restored', { id });
  }

  /**
   * Toggle maximize
   */
  function toggleMaximize(id) {
    const windowData = windows.get(id);
    if (!windowData) return;

    const windowEl = windowData.element;

    if (windowData.state === 'maximized' || windowData.state.startsWith('snapped')) {
      // Restore
      if (windowData.savedBounds) {
        windowEl.classList.remove('maximized');
        windowEl.style.left = `${windowData.savedBounds.left}px`;
        windowEl.style.top = `${windowData.savedBounds.top}px`;
        windowEl.style.width = `${windowData.savedBounds.width}px`;
        windowEl.style.height = `${windowData.savedBounds.height}px`;
        windowData.state = 'normal';
      }
    } else {
      // Maximize
      applySnap(window.innerWidth / 2, 10, windowData);
    }
  }

  /**
   * Close window
   */
  function close(id) {
    const windowData = windows.get(id);
    if (!windowData) return;

    windowData.element.remove();
    windows.delete(id);

    if (activeWindow === id) {
      activeWindow = null;
    }

    Bus.emit('window:closed', { id });
  }

  /**
   * Update window title
   */
  function setTitle(id, title) {
    const windowData = windows.get(id);
    if (!windowData) return;

    const titleEl = windowData.element.querySelector('.window-title');
    if (titleEl) {
      titleEl.textContent = title;
      windowData.title = title;
    }

    Bus.emit('window:title-changed', { id, title });
  }

  /**
   * Get window data
   */
  function get(id) {
    return windows.get(id);
  }

  /**
   * Get all windows
   */
  function getAll() {
    return Array.from(windows.values());
  }

  return {
    create,
    close,
    minimize,
    restore,
    toggleMaximize,
    focus,
    setTitle,
    get,
    getAll
  };
})();
