/* ============================================
   Finder App
   File manager with sidebar navigation
   ============================================ */

(() => {
  let currentPath = '/root/Desktop';
  let windowId = null;

  /**
   * Launch Finder
   */
  function launch(args = {}) {
    if (args.path) {
      currentPath = args.path;
    }

    windowId = 'finder-' + Date.now();

    const content = `
      <div class="window-with-sidebar">
        <div class="window-sidebar">
          <div style="padding: var(--space-4) 0; display: flex; flex-direction: column; height: 100%;">
            <div style="flex: 1;">
              <div style="font-size: var(--text-xs); font-weight: var(--weight-semibold); color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: var(--space-2);">Favorites</div>
              <button class="btn finder-sidebar-btn" data-path="/root/Desktop" style="width: 100%; justify-content: flex-start; margin-bottom: var(--space-1); gap: var(--space-2);">
                <span style="width: 16px; height: 16px; opacity: 0.7;">${Icons.get('desktop')}</span>
                <span>Desktop</span>
              </button>
              <button class="btn finder-sidebar-btn" data-path="/root/Documents" style="width: 100%; justify-content: flex-start; margin-bottom: var(--space-1); gap: var(--space-2);">
                <span style="width: 16px; height: 16px; opacity: 0.7;">${Icons.get('document')}</span>
                <span>Documents</span>
              </button>
              <button class="btn finder-sidebar-btn" data-path="/root/Downloads" style="width: 100%; justify-content: flex-start; margin-bottom: var(--space-1); gap: var(--space-2);">
                <span style="width: 16px; height: 16px; opacity: 0.7;">${Icons.get('download')}</span>
                <span>Downloads</span>
              </button>
              <button class="btn finder-sidebar-btn" data-path="/root/Pictures" style="width: 100%; justify-content: flex-start; margin-bottom: var(--space-1); gap: var(--space-2);">
                <span style="width: 16px; height: 16px; opacity: 0.7;">${Icons.get('picture')}</span>
                <span>Pictures</span>
              </button>
              <button class="btn finder-sidebar-btn" data-path="/root/Music" style="width: 100%; justify-content: flex-start; gap: var(--space-2);">
                <span style="width: 16px; height: 16px; opacity: 0.7;">${Icons.get('music')}</span>
                <span>Music</span>
              </button>
            </div>

            <!-- Storage Info -->
            <div id="finder-storage-info" style="margin-top: auto; padding: var(--space-3); background: var(--glass-light); border-radius: var(--radius-md); border: 1px solid var(--border-light);">
              <div style="font-size: var(--text-xs); font-weight: var(--weight-semibold); color: var(--text-tertiary); margin-bottom: var(--space-2);">Storage</div>
              <div id="finder-storage-bar" style="height: 6px; background: var(--bg-tertiary); border-radius: var(--radius-full); overflow: hidden; margin-bottom: var(--space-2);">
                <div id="finder-storage-fill" style="height: 100%; background: var(--accent-blue); border-radius: var(--radius-full); transition: width 0.3s ease;"></div>
              </div>
              <div id="finder-storage-text" style="font-size: var(--text-xs); color: var(--text-secondary);"></div>
            </div>
          </div>
        </div>
        <div class="window-main">
          <div class="window-toolbar">
            <button id="finder-back" class="window-toolbar-item" title="Back">←</button>
            <button id="finder-forward" class="window-toolbar-item" title="Forward">→</button>
            <span id="finder-path" style="flex: 1; font-size: var(--text-sm); color: var(--text-secondary); margin: 0 var(--space-4);"></span>
            <button id="finder-upload" class="window-toolbar-item">⬆ Upload</button>
            <button id="finder-new-folder" class="window-toolbar-item">+ Folder</button>
            <button id="finder-new-file" class="window-toolbar-item">+ File</button>
            <input type="file" id="finder-file-input" multiple style="display: none;">
          </div>
          <div id="finder-content" class="window-content" style="padding: var(--space-6); display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: var(--space-4); align-content: start;">
            <!-- File grid will be rendered here -->
          </div>
        </div>
      </div>
    `;

    WindowManager.create({
      id: windowId,
      title: 'Finder',
      icon: Icons.get('finder'),
      content,
      width: 800,
      height: 600
    });

    setupEventListeners();
    render();
  }

  /**
   * Setup event listeners
   */
  function setupEventListeners() {
    const windowEl = document.getElementById(`window-${windowId}`);
    if (!windowEl) return;

    // Sidebar navigation
    windowEl.querySelectorAll('.window-sidebar button[data-path]').forEach(btn => {
      btn.addEventListener('click', () => {
        currentPath = btn.dataset.path;
        render();
      });
    });

    // Toolbar buttons
    const newFolderBtn = windowEl.querySelector('#finder-new-folder');
    const newFileBtn = windowEl.querySelector('#finder-new-file');
    const uploadBtn = windowEl.querySelector('#finder-upload');
    const fileInput = windowEl.querySelector('#finder-file-input');

    newFolderBtn?.addEventListener('click', createFolder);
    newFileBtn?.addEventListener('click', createFile);
    uploadBtn?.addEventListener('click', () => fileInput?.click());

    fileInput?.addEventListener('change', handleFileUpload);

    // Listen for file system changes
    Bus.on('fs:changed', () => {
      render();
    });

    // Listen for storage changes (e.g., from Notes app)
    Bus.on('storage:changed', () => {
      updateStorageInfo();
    });
  }

  /**
   * Render file list
   */
  function render() {
    const windowEl = document.getElementById(`window-${windowId}`);
    if (!windowEl) return;

    const pathEl = windowEl.querySelector('#finder-path');
    const contentEl = windowEl.querySelector('#finder-content');

    if (!pathEl || !contentEl) return;

    // Update path display
    pathEl.textContent = currentPath;

    // Get files and folders
    const items = FS.ls(currentPath) || [];

    // Sort: folders first, then files, alphabetically
    items.sort((a, b) => {
      if (a.isDirectory && !b.isDirectory) return -1;
      if (!a.isDirectory && b.isDirectory) return 1;
      return a.name.localeCompare(b.name);
    });

    // Render grid
    let html = '';

    // Add parent directory if not root
    if (currentPath !== '/root') {
      html += `
        <div class="finder-item" data-path=".." style="display: flex; flex-direction: column; align-items: center; gap: var(--space-2); padding: var(--space-3); border-radius: var(--radius-md); cursor: pointer; transition: all var(--duration-fast) var(--ease-out);">
          <div style="width: 48px; height: 48px; color: var(--accent-blue);">${Icons.folder}</div>
          <div style="font-size: var(--text-sm); text-align: center; word-break: break-word;">..</div>
        </div>
      `;
    }

    items.forEach(item => {
      const icon = item.isDirectory ? Icons.folder : FS.getIcon(item.name);
      const iconColor = item.isDirectory ? 'var(--accent-blue)' : 'currentColor';
      html += `
        <div class="finder-item" data-path="${item.path}" data-is-dir="${item.isDirectory}" style="display: flex; flex-direction: column; align-items: center; gap: var(--space-2); padding: var(--space-3); border-radius: var(--radius-md); cursor: pointer; transition: all var(--duration-fast) var(--ease-out);">
          <div style="width: 48px; height: 48px; color: ${iconColor};">${icon}</div>
          <div style="font-size: var(--text-sm); text-align: center; word-break: break-word;">${item.name}</div>
        </div>
      `;
    });

    contentEl.innerHTML = html;

    // Add event listeners to items
    contentEl.querySelectorAll('.finder-item').forEach(item => {
      item.addEventListener('dblclick', () => handleItemDoubleClick(item));
      item.addEventListener('contextmenu', (e) => handleItemContextMenu(e, item));

      // Hover effect
      item.addEventListener('mouseenter', () => {
        item.style.background = 'var(--glass-light)';
      });

    // Update storage info
    updateStorageInfo();
      item.addEventListener('mouseleave', () => {
        item.style.background = 'transparent';
      });
    });
  }

  /**
   * Handle item double click
   */
  function handleItemDoubleClick(itemEl) {
    const path = itemEl.dataset.path;
    const isDir = itemEl.dataset.isDir === 'true';

    if (path === '..') {
      // Go to parent directory
      const parts = currentPath.split('/').filter(Boolean);
      parts.pop();
      currentPath = '/' + parts.join('/');
      if (currentPath === '/') currentPath = '/root';
      render();
    } else if (isDir) {
      // Navigate to directory
      currentPath = path;
      render();
    } else {
      // Determine which app to open based on file type
      const fileName = path.split('/').pop();
      const ext = fileName.split('.').pop().toLowerCase();
      const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'bmp'];

      if (imageExts.includes(ext)) {
        // Open in Preview
        Apps.open('preview', { filePath: path });
      } else {
        // Open in TextEdit
        const content = FS.read(path);
        Apps.open('textedit', { file: path, content });
      }
    }
  }

  /**
   * Handle item context menu
   */
  function handleItemContextMenu(e, itemEl) {
    e.preventDefault();
    const path = itemEl.dataset.path;
    if (path === '..') return;

    // Simple delete for now
    if (confirm(`Delete "${path.split('/').pop()}"?`)) {
      try {
        FS.rm(path);
        Notifications.success('Deleted', 'Item deleted successfully');
      } catch (error) {
        Notifications.error('Error', error.message);
      }
    }
  }

  /**
   * Create new folder
   */
  function createFolder() {
    const name = prompt('Enter folder name:');
    if (!name) return;

    const path = `${currentPath}/${name}`;

    try {
      FS.mkdir(path);
      Notifications.success('Created', `Folder "${name}" created`);
    } catch (error) {
      Notifications.error('Error', error.message);
    }
  }

  /**
   * Create new file
   */
  function createFile() {
    const name = prompt('Enter file name:');
    if (!name) return;

    const path = `${currentPath}/${name}`;

    try {
      FS.write(path, '');
      Notifications.success('Created', `File "${name}" created`);
    } catch (error) {
      Notifications.error('Error', error.message);
    }
  }

  /**
   * Handle file upload
   */
  async function handleFileUpload(event) {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    let successCount = 0;
    let errorCount = 0;

    for (const file of files) {
      try {
        const content = await readFileAsText(file);
        const path = `${currentPath}/${file.name}`;

        FS.write(path, content);
        successCount++;
      } catch (error) {
        console.error(`Failed to upload ${file.name}:`, error);
        errorCount++;
      }
    }

    if (successCount > 0) {
      Notifications.success('Upload Complete', `${successCount} file(s) uploaded`);
    }

    if (errorCount > 0) {
      Notifications.warning('Upload Warning', `${errorCount} file(s) failed to upload`);
    }

    // Reset file input
    event.target.value = '';
    render();
  }

  /**
   * Read file as text
   */
  function readFileAsText(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        resolve(e.target.result);
      };

      reader.onerror = (e) => {
        reject(new Error('Failed to read file'));
      };

      // For text files, read as text
      if (file.type.startsWith('text/') || file.name.endsWith('.txt') || file.name.endsWith('.md') || file.name.endsWith('.json')) {
        reader.readAsText(file);
      } else {
        // For other files, read as data URL (base64)
        reader.readAsDataURL(file);
      }
    });
  }

  /**
   * Update storage info display
   */
  function updateStorageInfo() {
    const windowEl = document.getElementById(`window-${windowId}`);
    if (!windowEl) return;

    const storageInfo = FS.getStorageInfo();
    const fillEl = windowEl.querySelector('#finder-storage-fill');
    const textEl = windowEl.querySelector('#finder-storage-text');

    if (fillEl && textEl) {
      fillEl.style.width = `${storageInfo.percentUsed}%`;

      // Change color based on usage
      if (storageInfo.percentUsed > 90) {
        fillEl.style.background = 'var(--error)';
      } else if (storageInfo.percentUsed > 75) {
        fillEl.style.background = 'var(--warning)';
      } else {
        fillEl.style.background = 'var(--accent-blue)';
      }

      textEl.textContent = `${FS.formatSize(storageInfo.used)} of ${FS.formatSize(storageInfo.total)} used`;
    }
  }

  // Register app
  Apps.register({
    id: 'finder',
    name: 'Finder',
    icon: Icons.get('finder'),
    description: 'File manager',
    category: 'utilities',
    keepInDock: true,
    launch
  });
})();
