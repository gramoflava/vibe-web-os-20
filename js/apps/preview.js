/* ============================================
   Preview App
   Image viewer for pictures and photos
   ============================================ */

(() => {
  /**
   * Launch Preview with an image
   */
  function launch(args = {}) {
    const { filePath } = args;

    if (!filePath) {
      Notifications.error('Preview Error', 'No file specified');
      return;
    }

    const windowId = 'preview-' + Date.now();
    const fileName = filePath.split('/').pop();

    // Read file content
    const fileContent = FS.read(filePath);
    if (!fileContent) {
      Notifications.error('Preview Error', 'Could not read file');
      return;
    }

    const content = `
      <div style="display: flex; flex-direction: column; height: 100%; background: var(--bg-primary);">
        <div class="window-toolbar" style="background: var(--bg-secondary);">
          <div style="display: flex; align-items: center; gap: var(--space-2);">
            <span style="font-size: var(--text-lg);">🖼️</span>
            <span style="font-weight: var(--weight-semibold);">${fileName}</span>
          </div>
          <div style="margin-left: auto; display: flex; gap: var(--space-2); align-items: center;">
            <button id="preview-zoom-out" class="window-toolbar-item" title="Zoom Out">-</button>
            <span id="preview-zoom-level" style="font-size: var(--text-sm); color: var(--text-secondary); min-width: 50px; text-align: center;">100%</span>
            <button id="preview-zoom-in" class="window-toolbar-item" title="Zoom In">+</button>
            <button id="preview-zoom-fit" class="window-toolbar-item" title="Fit to Window">Fit</button>
          </div>
        </div>
        <div style="flex: 1; display: flex; align-items: center; justify-content: center; overflow: auto; padding: var(--space-4);">
          <div id="preview-image-container" style="display: flex; align-items: center; justify-content: center;">
            <img
              id="preview-image"
              src="${fileContent}"
              alt="${fileName}"
              style="max-width: 100%; max-height: 100%; object-fit: contain; transition: transform 0.2s ease; cursor: grab; user-select: none;"
            />
          </div>
        </div>
        <div style="padding: var(--space-2) var(--space-4); background: var(--bg-secondary); border-top: 1px solid var(--border-light); font-size: var(--text-xs); color: var(--text-tertiary); text-align: center;">
          ${fileName} • ${FS.formatSize(fileContent.length)}
        </div>
      </div>
    `;

    WindowManager.create({
      id: windowId,
      title: fileName,
      icon: '🖼️',
      content,
      width: 800,
      height: 600
    });

    setupEventListeners(windowId);
  }

  /**
   * Setup event listeners
   */
  function setupEventListeners(windowId) {
    const windowEl = document.getElementById(`window-${windowId}`);
    if (!windowEl) return;

    const image = windowEl.querySelector('#preview-image');
    const zoomLevel = windowEl.querySelector('#preview-zoom-level');
    const zoomInBtn = windowEl.querySelector('#preview-zoom-in');
    const zoomOutBtn = windowEl.querySelector('#preview-zoom-out');
    const zoomFitBtn = windowEl.querySelector('#preview-zoom-fit');

    let currentZoom = 1.0;

    // Zoom in
    zoomInBtn?.addEventListener('click', () => {
      currentZoom = Math.min(currentZoom + 0.25, 5.0);
      updateZoom();
    });

    // Zoom out
    zoomOutBtn?.addEventListener('click', () => {
      currentZoom = Math.max(currentZoom - 0.25, 0.25);
      updateZoom();
    });

    // Fit to window
    zoomFitBtn?.addEventListener('click', () => {
      currentZoom = 1.0;
      image.style.transform = '';
      image.style.maxWidth = '100%';
      image.style.maxHeight = '100%';
      zoomLevel.textContent = '100%';
    });

    // Mouse wheel zoom
    image?.addEventListener('wheel', (e) => {
      e.preventDefault();
      if (e.deltaY < 0) {
        currentZoom = Math.min(currentZoom + 0.1, 5.0);
      } else {
        currentZoom = Math.max(currentZoom - 0.1, 0.25);
      }
      updateZoom();
    });

    // Drag to pan when zoomed
    let isDragging = false;
    let startX, startY, scrollLeft, scrollTop;

    image?.addEventListener('mousedown', (e) => {
      if (currentZoom > 1.0) {
        isDragging = true;
        image.style.cursor = 'grabbing';
        const container = image.parentElement;
        startX = e.pageX - container.offsetLeft;
        startY = e.pageY - container.offsetTop;
        scrollLeft = container.scrollLeft;
        scrollTop = container.scrollTop;
      }
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const container = image.parentElement;
      const x = e.pageX - container.offsetLeft;
      const y = e.pageY - container.offsetTop;
      const walkX = (x - startX) * 2;
      const walkY = (y - startY) * 2;
      container.scrollLeft = scrollLeft - walkX;
      container.scrollTop = scrollTop - walkY;
    });

    document.addEventListener('mouseup', () => {
      isDragging = false;
      if (image) image.style.cursor = currentZoom > 1.0 ? 'grab' : 'default';
    });

    function updateZoom() {
      image.style.transform = `scale(${currentZoom})`;
      image.style.maxWidth = 'none';
      image.style.maxHeight = 'none';
      zoomLevel.textContent = `${Math.round(currentZoom * 100)}%`;
      image.style.cursor = currentZoom > 1.0 ? 'grab' : 'default';
    }
  }

  // Register app
  Apps.register({
    id: 'preview',
    name: 'Preview',
    icon: '🖼️',
    description: 'Image viewer',
    category: 'utilities',
    keepInDock: false,
    launch
  });
})();
