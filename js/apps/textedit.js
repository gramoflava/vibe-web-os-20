/* ============================================
   TextEdit App
   Simple text editor with save functionality
   ============================================ */

(() => {
  let instanceCounter = 0;

  /**
   * Launch TextEdit
   */
  function launch(args = {}) {
    const instanceId = ++instanceCounter;
    const windowId = `textedit-${instanceId}`;

    let currentFile = args.file || null;
    let initialContent = args.content || '';
    let hasUnsavedChanges = false;

    const content = `
      <div style="display: flex; flex-direction: column; height: 100%;">
        <div class="window-toolbar">
          <input
            id="textedit-filename-${instanceId}"
            type="text"
            placeholder="Untitled.txt"
            value="${currentFile ? currentFile.split('/').pop() : ''}"
            style="flex: 1; max-width: 300px; padding: var(--space-1) var(--space-3); background: var(--glass-light); border: 1px solid var(--border-light); border-radius: var(--radius-md); font-size: var(--text-sm);"
          />
          <button id="textedit-save-${instanceId}" class="window-toolbar-item btn-primary">Save</button>
          <button id="textedit-saveas-${instanceId}" class="window-toolbar-item">Save As...</button>
          <span id="textedit-status-${instanceId}" style="margin-left: var(--space-3); font-size: var(--text-xs); color: var(--text-tertiary);"></span>
        </div>
        <textarea
          id="textedit-content-${instanceId}"
          style="flex: 1; width: 100%; padding: var(--space-4); background: var(--bg-secondary); border: none; color: var(--text-primary); font-family: var(--font-mono); font-size: var(--text-sm); line-height: var(--leading-relaxed); resize: none; outline: none;"
          placeholder="Start typing..."
        >${initialContent}</textarea>
      </div>
    `;

    WindowManager.create({
      id: windowId,
      title: currentFile ? currentFile.split('/').pop() : 'TextEdit',
      icon: Icons.get('textedit'),
      content,
      width: 700,
      height: 500
    });

    setupEventListeners(instanceId, windowId);
  }

  /**
   * Setup event listeners
   */
  function setupEventListeners(instanceId, windowId) {
    const windowEl = document.getElementById(`window-${windowId}`);
    if (!windowEl) return;

    const filenameInput = windowEl.querySelector(`#textedit-filename-${instanceId}`);
    const saveBtn = windowEl.querySelector(`#textedit-save-${instanceId}`);
    const saveAsBtn = windowEl.querySelector(`#textedit-saveas-${instanceId}`);
    const contentTextarea = windowEl.querySelector(`#textedit-content-${instanceId}`);
    const statusSpan = windowEl.querySelector(`#textedit-status-${instanceId}`);

    let currentFile = null;
    let hasUnsavedChanges = false;

    // Content changes
    contentTextarea?.addEventListener('input', () => {
      hasUnsavedChanges = true;
      updateStatus('Unsaved changes', 'var(--warning)');
    });

    // Filename changes update window title
    filenameInput?.addEventListener('input', () => {
      const newFilename = filenameInput.value || 'Untitled';
      WindowManager.setTitle(windowId, newFilename);
    });

    // Save button
    saveBtn?.addEventListener('click', () => {
      save(filenameInput, contentTextarea, statusSpan, false);
      hasUnsavedChanges = false;
    });

    // Save As button
    saveAsBtn?.addEventListener('click', () => {
      save(filenameInput, contentTextarea, statusSpan, true);
      hasUnsavedChanges = false;
    });

    // Cmd+S to save
    contentTextarea?.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        save(filenameInput, contentTextarea, statusSpan, false);
        hasUnsavedChanges = false;
      }
    });

    function updateStatus(message, color = 'var(--text-tertiary)') {
      if (statusSpan) {
        statusSpan.textContent = message;
        statusSpan.style.color = color;

        if (message && message !== 'Unsaved changes') {
          setTimeout(() => {
            statusSpan.textContent = '';
          }, 3000);
        }
      }
    }

    function save(filenameInput, contentTextarea, statusSpan, saveAs) {
      const filename = filenameInput?.value?.trim();
      if (!filename) {
        Notifications.error('Error', 'Please enter a filename');
        return;
      }

      // Default to Desktop if no current file
      let path = currentFile;

      if (!path || saveAs) {
        path = `/root/Desktop/${filename}`;
      }

      const content = contentTextarea?.value || '';

      try {
        FS.write(path, content);
        currentFile = path;
        updateStatus(`Saved at ${new Date().toLocaleTimeString()}`, 'var(--success)');
        Notifications.success('Saved', `File saved to ${path}`);
      } catch (error) {
        updateStatus('Save failed', 'var(--error)');
        Notifications.error('Error', error.message);
      }
    }
  }

  // Register app
  Apps.register({
    id: 'textedit',
    name: 'TextEdit',
    icon: Icons.get('textedit'),
    description: 'Text editor',
    category: 'productivity',
    keepInDock: true,
    launch
  });
})();
