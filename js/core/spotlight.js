/* ============================================
   Spotlight Search
   Global search for apps, files, and settings
   ============================================ */

const Spotlight = (() => {
  let isOpen = false;
  let selectedIndex = 0;
  let results = [];

  const overlay = document.getElementById('spotlight-overlay');
  const input = document.getElementById('spotlight-input');
  const resultsContainer = document.getElementById('spotlight-results');

  /**
   * Initialize spotlight
   */
  function init() {
    setupEventListeners();
    setupKeyboardShortcuts();
  }

  /**
   * Setup event listeners
   */
  function setupEventListeners() {
    // Input changes
    input.addEventListener('input', (e) => {
      handleSearch(e.target.value);
    });

    // Keyboard navigation
    input.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        selectNext();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        selectPrevious();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        executeSelected();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        close();
      }
    });

    // Click outside to close
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        close();
      }
    });
  }

  /**
   * Setup keyboard shortcuts
   */
  function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Cmd+Space or Ctrl+Space
      if ((e.metaKey || e.ctrlKey) && e.code === 'Space') {
        e.preventDefault();
        toggle();
      }
    });
  }

  /**
   * Handle search query
   */
  function handleSearch(query) {
    if (!query.trim()) {
      results = [];
      renderResults();
      return;
    }

    const lowerQuery = query.toLowerCase();

    // Search apps
    const apps = Apps.list().filter(app =>
      app.name.toLowerCase().includes(lowerQuery) ||
      app.description.toLowerCase().includes(lowerQuery)
    ).map(app => ({
      type: 'app',
      id: app.id,
      title: app.name,
      description: app.description || 'Application',
      icon: app.icon,
      action: () => {
        Apps.open(app.id);
        close();
      }
    }));

    // Search files (simple implementation)
    const files = searchFiles(lowerQuery).map(file => ({
      type: 'file',
      id: file.path,
      title: file.name,
      description: file.path,
      icon: FS.getIcon(file.name),
      action: () => {
        // Open file in appropriate app
        openFile(file.path);
        close();
      }
    }));

    results = [...apps, ...files];
    selectedIndex = results.length > 0 ? 0 : -1;
    renderResults();
  }

  /**
   * Search files recursively
   */
  function searchFiles(query, path = '/root', maxResults = 10) {
    const found = [];

    function searchNode(node) {
      if (found.length >= maxResults) return;

      if (node.name.toLowerCase().includes(query)) {
        found.push({
          name: node.name,
          path: node.path,
          isDirectory: node.isDirectory
        });
      }

      if (node.isDirectory && node.children) {
        node.children.forEach(child => searchNode(child));
      }
    }

    const rootNode = FS.find(path);
    if (rootNode) {
      searchNode(rootNode);
    }

    return found;
  }

  /**
   * Open file in appropriate app
   */
  function openFile(path) {
    const content = FS.read(path);
    if (content !== null) {
      Apps.open('textedit', { file: path, content });
    }
  }

  /**
   * Render search results
   */
  function renderResults() {
    if (results.length === 0) {
      resultsContainer.innerHTML = '<div class="spotlight-empty">No results found</div>';
      return;
    }

    const groupedResults = groupResultsByType(results);
    let html = '';

    for (const [type, items] of Object.entries(groupedResults)) {
      html += `
        <div class="spotlight-group">
          <div class="spotlight-group-title">${type}</div>
          ${items.map((item, index) => {
            const globalIndex = results.indexOf(item);
            const isSelected = globalIndex === selectedIndex;
            return `
              <button class="spotlight-item ${isSelected ? 'selected' : ''}" data-index="${globalIndex}">
                <div class="spotlight-item-icon">${item.icon}</div>
                <div class="spotlight-item-text">
                  <div class="spotlight-item-title">${item.title}</div>
                  <div class="spotlight-item-description">${item.description}</div>
                </div>
              </button>
            `;
          }).join('')}
        </div>
      `;
    }

    resultsContainer.innerHTML = html;

    // Add click handlers
    resultsContainer.querySelectorAll('.spotlight-item').forEach(item => {
      item.addEventListener('click', () => {
        const index = parseInt(item.dataset.index);
        if (results[index]) {
          results[index].action();
        }
      });
    });
  }

  /**
   * Group results by type
   */
  function groupResultsByType(results) {
    const grouped = {};
    results.forEach(result => {
      const type = result.type === 'app' ? 'Applications' : 'Files';
      if (!grouped[type]) {
        grouped[type] = [];
      }
      grouped[type].push(result);
    });
    return grouped;
  }

  /**
   * Select next result
   */
  function selectNext() {
    if (results.length === 0) return;
    selectedIndex = (selectedIndex + 1) % results.length;
    renderResults();
  }

  /**
   * Select previous result
   */
  function selectPrevious() {
    if (results.length === 0) return;
    selectedIndex = selectedIndex <= 0 ? results.length - 1 : selectedIndex - 1;
    renderResults();
  }

  /**
   * Execute selected result
   */
  function executeSelected() {
    if (selectedIndex >= 0 && results[selectedIndex]) {
      results[selectedIndex].action();
    }
  }

  /**
   * Open spotlight
   */
  function open() {
    isOpen = true;
    overlay.style.display = 'flex';
    input.value = '';
    input.focus();
    results = [];
    selectedIndex = -1;
    renderResults();
    Bus.emit('spotlight:opened');
  }

  /**
   * Close spotlight
   */
  function close() {
    isOpen = false;
    overlay.style.display = 'none';
    input.value = '';
    results = [];
    Bus.emit('spotlight:closed');
  }

  /**
   * Toggle spotlight
   */
  function toggle() {
    if (isOpen) {
      close();
    } else {
      open();
    }
  }

  return {
    init,
    open,
    close,
    toggle
  };
})();
