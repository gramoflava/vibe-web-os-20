/* ============================================
   CodeEdit App
   Code editor with project tree and syntax highlighting
   ============================================ */

(() => {
  let instanceCounter = 0;

  /**
   * Launch CodeEdit
   */
  function launch(args = {}) {
    const instanceId = ++instanceCounter;
    const windowId = `codeedit-${instanceId}`;

    let currentProject = args.project || '/root/Documents/MyProject';
    let currentFile = args.file || null;
    let hasUnsavedChanges = false;

    // Ensure project directory exists
    try {
      if (!FS.find(currentProject)) {
        FS.mkdir(currentProject);
      }
    } catch (e) {
      // Directory might already exist
    }

    const content = `
      <div style="display: flex; height: 100%; padding: var(--space-3); padding-top: 0; gap: var(--space-3);">
        <!-- File Tree Sidebar -->
        <div style="width: 240px; background: var(--bg-secondary); border: 1px solid var(--border-light); border-radius: var(--radius-inset-lg); display: flex; flex-direction: column; margin-top: var(--space-3); overflow: hidden;">
          <!-- Project header -->
          <div style="padding: var(--space-3); border-bottom: 1px solid var(--border-light); display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; flex-direction: column; gap: var(--space-1); flex: 1; min-width: 0;">
              <span style="font-size: var(--text-xs); font-weight: var(--weight-semibold); color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 0.05em;">Project</span>
              <span id="codeedit-project-name-${instanceId}" style="font-size: var(--text-sm); font-weight: var(--weight-medium); color: var(--text-primary); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${currentProject}">${currentProject.split('/').pop()}</span>
            </div>
            <button id="codeedit-project-menu-${instanceId}" class="window-toolbar-item" title="Project menu" style="padding: var(--space-1);">
              <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 14px; height: 14px;">
                <circle cx="8" cy="8" r="2" stroke="currentColor" stroke-width="1.5" fill="none"/>
                <path d="M8 0.67V2.67M8 13.33V15.33M2.81 2.81L4.23 4.23M11.77 11.77L13.19 13.19M0.67 8H2.67M13.33 8H15.33M2.81 13.19L4.23 11.77M11.77 4.23L13.19 2.81" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </button>
          </div>

          <!-- File tree toolbar -->
          <div style="padding: var(--space-2); border-bottom: 1px solid var(--border-light); display: flex; gap: var(--space-1);">
            <button id="codeedit-new-file-${instanceId}" class="window-toolbar-item" title="New File" style="flex: 1; display: flex; align-items: center; justify-content: center; gap: 4px;">
              <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 12px; height: 12px;">
                <path d="M4.67 1.33H9.33L12.67 4.67V13.33C12.67 13.687 12.5262 14.0261 12.2761 14.2761C12.0261 14.5262 11.687 14.6667 11.3333 14.6667H4.67C4.31304 14.6667 3.97391 14.5262 3.72386 14.2761C3.47381 14.0261 3.33333 13.687 3.33333 13.33V2.67C3.33333 2.31304 3.47381 1.97391 3.72386 1.72386C3.97391 1.47381 4.31304 1.33333 4.67 1.33333Z" fill="currentColor" opacity="0.3"/>
                <path d="M9.33 1.33V4.67H12.67" stroke="currentColor" stroke-width="1" fill="none"/>
              </svg>
              New
            </button>
            <button id="codeedit-new-folder-${instanceId}" class="window-toolbar-item" title="New Folder" style="flex: 1; display: flex; align-items: center; justify-content: center; gap: 4px;">
              <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 12px; height: 12px;">
                <path d="M2 4.67C2 3.93 2.597 3.33 3.33 3.33H6L7.33 4.67H12.67C13.403 4.67 14 5.267 14 6V11.33C14 12.063 13.403 12.67 12.67 12.67H3.33C2.597 12.67 2 12.063 2 11.33V4.67Z" fill="currentColor" opacity="0.3" stroke="currentColor" stroke-width="1.5"/>
              </svg>
              Folder
            </button>
          </div>

          <!-- File tree -->
          <div id="codeedit-tree-${instanceId}" style="flex: 1; overflow-y: auto; padding: var(--space-2);">
            <!-- Tree will be rendered here -->
          </div>

          <!-- Quick templates -->
          <div style="padding: var(--space-3); border-top: 1px solid var(--border-light);">
            <div style="font-size: var(--text-xs); font-weight: var(--weight-semibold); color: var(--text-tertiary); margin-bottom: var(--space-2); text-transform: uppercase; letter-spacing: 0.05em;">Templates</div>
            <div style="display: flex; flex-direction: column; gap: var(--space-1);">
              <button class="codeedit-template-btn" data-template="cpp" style="width: 100%; justify-content: flex-start; padding: var(--space-1) var(--space-2); font-size: var(--text-xs);">C++ Main</button>
              <button class="codeedit-template-btn" data-template="html" style="width: 100%; justify-content: flex-start; padding: var(--space-1) var(--space-2); font-size: var(--text-xs);">HTML5</button>
              <button class="codeedit-template-btn" data-template="js" style="width: 100%; justify-content: flex-start; padding: var(--space-1) var(--space-2); font-size: var(--text-xs);">JavaScript</button>
            </div>
          </div>
        </div>

        <!-- Editor Area -->
        <div style="flex: 1; display: flex; flex-direction: column; gap: var(--space-3); margin-top: var(--space-3);">
          <!-- Editor Toolbar -->
          <div class="window-toolbar" style="background: var(--bg-secondary); border: 1px solid var(--border-light); border-radius: var(--radius-inset-md); margin: 0;">
            <span id="codeedit-filename-${instanceId}" style="font-size: var(--text-sm); font-weight: var(--weight-medium); color: var(--text-secondary); margin-right: var(--space-4);">No file open</span>
            <button id="codeedit-save-${instanceId}" class="window-toolbar-item btn-primary" disabled style="display: flex; align-items: center; gap: 4px;">
              <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 14px; height: 14px;">
                <path d="M12.67 14H3.33C2.597 14 2 13.403 2 12.67V3.33C2 2.597 2.597 2 3.33 2H10.67L14 5.33V12.67C14 13.403 13.403 14 12.67 14Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                <path d="M11.33 14V8.67H4.67V14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M4.67 2V5.33H10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Save
            </button>
            <button id="codeedit-run-${instanceId}" class="window-toolbar-item" title="Run code" style="display: flex; align-items: center; gap: 4px;">
              <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 14px; height: 14px;">
                <path d="M3.33 2L12.67 8L3.33 14V2Z" fill="currentColor" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Run
            </button>
            <span id="codeedit-status-${instanceId}" style="margin-left: auto; font-size: var(--text-xs); color: var(--text-tertiary);"></span>
          </div>

          <!-- Editor -->
          <div style="flex: 1; display: flex; flex-direction: column; position: relative; background: var(--bg-secondary); border: 1px solid var(--border-light); border-radius: var(--radius-inset-lg); overflow: hidden;">
            <div style="display: flex; background: var(--bg-tertiary); padding: var(--space-2) var(--space-4); font-size: var(--text-xs); color: var(--text-tertiary); border-bottom: 1px solid var(--border-light); font-family: var(--font-mono);">
              <span id="codeedit-language-${instanceId}">Plain Text</span>
              <span style="margin-left: auto;">
                Lines: <span id="codeedit-lines-${instanceId}">1</span> |
                Chars: <span id="codeedit-chars-${instanceId}">0</span>
              </span>
            </div>
            <textarea
              id="codeedit-content-${instanceId}"
              spellcheck="false"
              style="flex: 1; width: 100%; padding: var(--space-4); background: var(--bg-primary); border: none; color: var(--text-primary); font-family: var(--font-mono); font-size: var(--text-sm); line-height: 1.6; resize: none; outline: none; tab-size: 2; -moz-tab-size: 2; box-sizing: border-box;"
              placeholder="Select a file from the project tree or create a new one..."
            ></textarea>
          </div>
        </div>
      </div>
    `;

    WindowManager.create({
      id: windowId,
      title: 'CodeEdit',
      icon: '💻',
      content,
      width: 1000,
      height: 700
    });

    setupEventListeners(instanceId, windowId, currentProject);
    renderFileTree(instanceId, currentProject);
  }

  /**
   * Setup event listeners
   */
  function setupEventListeners(instanceId, windowId, projectPath) {
    const windowEl = document.getElementById(`window-${windowId}`);
    if (!windowEl) return;

    const contentTextarea = windowEl.querySelector(`#codeedit-content-${instanceId}`);
    const filenameSpan = windowEl.querySelector(`#codeedit-filename-${instanceId}`);
    const saveBtn = windowEl.querySelector(`#codeedit-save-${instanceId}`);
    const runBtn = windowEl.querySelector(`#codeedit-run-${instanceId}`);
    const statusSpan = windowEl.querySelector(`#codeedit-status-${instanceId}`);
    const newFileBtn = windowEl.querySelector(`#codeedit-new-file-${instanceId}`);
    const newFolderBtn = windowEl.querySelector(`#codeedit-new-folder-${instanceId}`);
    const languageSpan = windowEl.querySelector(`#codeedit-language-${instanceId}`);
    const linesSpan = windowEl.querySelector(`#codeedit-lines-${instanceId}`);
    const charsSpan = windowEl.querySelector(`#codeedit-chars-${instanceId}`);

    let currentFile = null;
    let hasUnsavedChanges = false;

    // Content changes
    contentTextarea?.addEventListener('input', () => {
      hasUnsavedChanges = true;
      saveBtn.disabled = false;
      updateStatus('Unsaved changes', 'var(--warning)');
      updateStats();
    });

    // Update stats
    function updateStats() {
      const content = contentTextarea?.value || '';
      const lines = content.split('\n').length;
      const chars = content.length;

      if (linesSpan) linesSpan.textContent = lines;
      if (charsSpan) charsSpan.textContent = chars;
    }

    // Save button
    saveBtn?.addEventListener('click', () => {
      if (currentFile) {
        saveFile();
      }
    });

    // Run button
    runBtn?.addEventListener('click', () => {
      runCode();
    });

    // New file
    newFileBtn?.addEventListener('click', () => {
      createNewFile();
    });

    // New folder
    newFolderBtn?.addEventListener('click', () => {
      createNewFolder();
    });

    // Template buttons
    windowEl.querySelectorAll('.codeedit-template-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const template = btn.dataset.template;
        applyTemplate(template);
      });
    });

    // Cmd+S to save
    contentTextarea?.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        if (currentFile) {
          saveFile();
        }
      }
    });

    // Tab key support (insert 2 spaces)
    contentTextarea?.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        const start = contentTextarea.selectionStart;
        const end = contentTextarea.selectionEnd;
        const value = contentTextarea.value;

        contentTextarea.value = value.substring(0, start) + '  ' + value.substring(end);
        contentTextarea.selectionStart = contentTextarea.selectionEnd = start + 2;

        // Trigger input event
        contentTextarea.dispatchEvent(new Event('input'));
      }
    });

    // Listen for file system changes
    Bus.on('fs:changed', () => {
      renderFileTree(instanceId, projectPath);
    });

    function openFile(path) {
      // Save current file if has changes
      if (currentFile && hasUnsavedChanges) {
        if (!confirm('You have unsaved changes. Continue?')) {
          return;
        }
      }

      try {
        const content = FS.read(path);
        if (content !== null) {
          currentFile = path;
          contentTextarea.value = content;
          const filename = path.split('/').pop();
          filenameSpan.textContent = filename;
          saveBtn.disabled = false;
          hasUnsavedChanges = false;
          updateStatus('');
          updateStats();
          updateLanguage(filename);
        }
      } catch (error) {
        Notifications.error('Error', `Failed to open file: ${error.message}`);
      }
    }

    function saveFile() {
      if (!currentFile) return;

      try {
        const content = contentTextarea?.value || '';
        FS.write(currentFile, content);
        hasUnsavedChanges = false;
        updateStatus('Saved ✓', 'var(--success)');
        Notifications.success('Saved', 'File saved successfully');

        setTimeout(() => {
          updateStatus('');
        }, 2000);
      } catch (error) {
        updateStatus('Save failed', 'var(--error)');
        Notifications.error('Error', error.message);
      }
    }

    function createNewFile() {
      const filename = prompt('Enter filename (e.g., main.cpp, index.html):');
      if (!filename) return;

      const path = `${projectPath}/${filename}`;

      try {
        // Check if file exists
        if (FS.find(path)) {
          Notifications.warning('File exists', 'A file with that name already exists');
          return;
        }

        FS.write(path, '');
        renderFileTree(instanceId, projectPath);
        openFile(path);
        Notifications.success('Created', `${filename} created`);
      } catch (error) {
        Notifications.error('Error', error.message);
      }
    }

    function createNewFolder() {
      const foldername = prompt('Enter folder name:');
      if (!foldername) return;

      const path = `${projectPath}/${foldername}`;

      try {
        FS.mkdir(path);
        renderFileTree(instanceId, projectPath);
        Notifications.success('Created', `Folder ${foldername} created`);
      } catch (error) {
        Notifications.error('Error', error.message);
      }
    }

    function updateLanguage(filename) {
      const ext = filename.split('.').pop().toLowerCase();
      const languageMap = {
        'js': 'JavaScript',
        'ts': 'TypeScript',
        'cpp': 'C++',
        'c': 'C',
        'h': 'C/C++ Header',
        'hpp': 'C++ Header',
        'py': 'Python',
        'java': 'Java',
        'html': 'HTML',
        'css': 'CSS',
        'json': 'JSON',
        'xml': 'XML',
        'md': 'Markdown',
        'txt': 'Plain Text'
      };

      const language = languageMap[ext] || 'Plain Text';
      if (languageSpan) {
        languageSpan.textContent = language;
      }
    }

    function applyTemplate(templateName) {
      const templates = {
        cpp: `#include <iostream>

int main() {
    std::cout << "Hello, World!" << std::endl;
    return 0;
}`,
        html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <h1>Hello, World!</h1>
</body>
</html>`,
        js: `// JavaScript
console.log('Hello, World!');

function main() {
    // Your code here
}

main();`
      };

      const template = templates[templateName];
      if (template && contentTextarea) {
        if (contentTextarea.value && !confirm('Replace current content with template?')) {
          return;
        }

        contentTextarea.value = template;
        contentTextarea.dispatchEvent(new Event('input'));
        updateStatus('Template applied');
      }
    }

    function runCode() {
      if (!currentFile) {
        Notifications.warning('No file', 'Please open a file first');
        return;
      }

      const ext = currentFile.split('.').pop().toLowerCase();
      const content = contentTextarea?.value || '';

      if (ext === 'html') {
        // Open HTML in new window
        const previewWindow = window.open('', '_blank');
        previewWindow.document.write(content);
        previewWindow.document.close();
        Notifications.success('Running', 'HTML opened in new window');
      } else if (ext === 'js') {
        // Execute JavaScript in console
        try {
          console.clear();
          console.log('=== CodeEdit: Running JavaScript ===');
          eval(content);
          console.log('=== Execution complete ===');
          Notifications.success('Running', 'Check browser console for output');
        } catch (error) {
          console.error('Error:', error);
          Notifications.error('Error', error.message);
        }
      } else {
        Notifications.info('Run', `Cannot run ${ext} files in browser. Code saved for external compilation.`);
      }
    }

    function updateStatus(message, color = 'var(--text-tertiary)') {
      if (statusSpan) {
        statusSpan.textContent = message;
        statusSpan.style.color = color;
      }
    }

    // Store functions for file tree callbacks
    windowEl._codeEditOpenFile = openFile;

    // Initialize stats
    updateStats();
  }

  /**
   * Render file tree
   */
  function renderFileTree(instanceId, projectPath) {
    const windowEl = document.getElementById(`window-codeedit-${instanceId}`);
    if (!windowEl) return;

    const treeEl = windowEl.querySelector(`#codeedit-tree-${instanceId}`);
    if (!treeEl) return;

    const projectNode = FS.find(projectPath);
    if (!projectNode || !projectNode.isDirectory) {
      treeEl.innerHTML = '<div style="padding: var(--space-2); color: var(--text-tertiary); font-size: var(--text-xs);">Project not found</div>';
      return;
    }

    treeEl.innerHTML = renderTreeNode(projectNode, 0, windowEl);
  }

  /**
   * Render a tree node
   */
  function renderTreeNode(node, depth, windowEl) {
    if (!node) return '';

    const indent = depth * 16;
    const icon = node.isDirectory ? Icons.folder : getFileIcon(node.name);
    const iconColor = node.isDirectory ? 'var(--accent-blue)' : 'currentColor';

    let html = '';

    if (depth > 0) {
      html += `
        <div
          class="codeedit-tree-item"
          data-path="${node.path}"
          data-is-dir="${node.isDirectory}"
          style="
            padding: var(--space-1) var(--space-2);
            padding-left: ${indent}px;
            cursor: pointer;
            font-size: var(--text-sm);
            color: var(--text-primary);
            display: flex;
            align-items: center;
            gap: var(--space-2);
            border-radius: var(--radius-sm);
            transition: background var(--duration-fast) var(--ease-out);
          "
        >
          <span style="width: 16px; height: 16px; display: flex; align-items: center; color: ${iconColor};">${icon}</span>
          <span style="flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${node.name}</span>
          ${!node.isDirectory ? `<button class="codeedit-delete-btn" data-path="${node.path}" style="opacity: 0; padding: 0 var(--space-1); font-size: var(--text-xs); background: var(--error); border: none; border-radius: var(--radius-sm); color: white; cursor: pointer;" title="Delete">×</button>` : ''}
        </div>
      `;
    }

    // Add children for directories
    if (node.isDirectory && node.children) {
      const sortedChildren = [...node.children].sort((a, b) => {
        if (a.isDirectory && !b.isDirectory) return -1;
        if (!a.isDirectory && b.isDirectory) return 1;
        return a.name.localeCompare(b.name);
      });

      for (const child of sortedChildren) {
        html += renderTreeNode(child, depth + 1, windowEl);
      }
    }

    // Add event listeners after rendering
    setTimeout(() => {
      const items = windowEl.querySelectorAll('.codeedit-tree-item');
      items.forEach(item => {
        // Click to open file
        item.addEventListener('click', (e) => {
          if (e.target.classList.contains('codeedit-delete-btn')) return;

          const path = item.dataset.path;
          const isDir = item.dataset.isDir === 'true';

          if (!isDir && windowEl._codeEditOpenFile) {
            windowEl._codeEditOpenFile(path);
          }
        });

        // Show delete button on hover
        item.addEventListener('mouseenter', () => {
          const deleteBtn = item.querySelector('.codeedit-delete-btn');
          if (deleteBtn) {
            deleteBtn.style.opacity = '1';
          }
        });

        item.addEventListener('mouseleave', () => {
          const deleteBtn = item.querySelector('.codeedit-delete-btn');
          if (deleteBtn) {
            deleteBtn.style.opacity = '0';
          }
        });

        // Delete button
        const deleteBtn = item.querySelector('.codeedit-delete-btn');
        if (deleteBtn) {
          deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const path = deleteBtn.dataset.path;
            const filename = path.split('/').pop();

            if (confirm(`Delete ${filename}?`)) {
              try {
                FS.rm(path);
                Notifications.success('Deleted', `${filename} deleted`);
              } catch (error) {
                Notifications.error('Error', error.message);
              }
            }
          });
        }
      });

      // Hover effect
      items.forEach(item => {
        item.addEventListener('mouseenter', () => {
          item.style.background = 'var(--glass-light)';
        });
        item.addEventListener('mouseleave', () => {
          item.style.background = 'transparent';
        });
      });
    }, 0);

    return html;
  }

  /**
   * Get file icon based on extension
   */
  function getFileIcon(filename) {
    const ext = filename.split('.').pop().toLowerCase();
    const iconMap = {
      'js': Icons.document,
      'ts': Icons.document,
      'cpp': Icons.gear,
      'c': Icons.gear,
      'h': Icons.document,
      'hpp': Icons.document,
      'py': Icons.document,
      'java': Icons.document,
      'html': Icons.globe,
      'css': Icons.palette,
      'json': Icons.chart,
      'xml': Icons.document,
      'md': Icons.document,
      'txt': Icons.document
    };

    return iconMap[ext] || Icons.document;
  }

  // Register app
  Apps.register({
    id: 'codeedit',
    name: 'CodeEdit',
    icon: '💻',
    description: 'Code editor with project support',
    category: 'development',
    keepInDock: true,
    launch
  });
})();
