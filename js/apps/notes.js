/* ============================================
   Notes App
   Apple Notes-style note-taking with sidebar
   ============================================ */

(() => {
  const STORAGE_KEY = 'webos.notes.v2';
  let notes = [];
  let currentNoteId = null;
  let autoSaveTimeout = null;
  let windowId = null;

  /**
   * Load notes from localStorage
   */
  function loadNotes() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        notes = JSON.parse(data);
      } else {
        // Create welcome note
        notes = [
          {
            id: Date.now(),
            title: 'Welcome to Notes',
            content: 'Start typing to create your first note...',
            created: new Date().toISOString(),
            modified: new Date().toISOString()
          }
        ];
        saveNotes();
      }
    } catch (error) {
      console.error('Failed to load notes:', error);
      notes = [];
    }
  }

  /**
   * Save notes to localStorage
   */
  function saveNotes() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
      // Emit event for storage calculation
      Bus.emit('storage:changed');
    } catch (error) {
      console.error('Failed to save notes:', error);
    }
  }

  /**
   * Get note title from content (first line)
   */
  function getNoteTitle(content) {
    if (!content || content.trim() === '') {
      return 'New Note';
    }
    const firstLine = content.split('\n')[0].trim();
    return firstLine.substring(0, 50) || 'New Note';
  }

  /**
   * Launch Notes
   */
  function launch() {
    windowId = 'notes-' + Date.now();
    loadNotes();

    // Select first note if available
    if (notes.length > 0) {
      currentNoteId = notes[0].id;
    }

    const content = `
      <div style="display: flex; height: 100%;">
        <!-- Sidebar -->
        <div style="width: 220px; background: var(--bg-secondary); border-right: 1px solid var(--border-light); display: flex; flex-direction: column;">
          <!-- Sidebar header -->
          <div style="padding: var(--space-3); border-bottom: 1px solid var(--border-light); display: flex; align-items: center; justify-content: space-between;">
            <span style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-primary);">Notes</span>
            <button id="notes-new" class="window-toolbar-item" title="New Note" style="padding: var(--space-1) var(--space-2);">+</button>
          </div>

          <!-- Notes list -->
          <div id="notes-list" style="flex: 1; overflow-y: auto;">
            <!-- Notes will be inserted here -->
          </div>
        </div>

        <!-- Editor -->
        <div style="flex: 1; display: flex; flex-direction: column;">
          <!-- Toolbar -->
          <div class="window-toolbar" style="background: var(--bg-secondary); border-bottom: 1px solid var(--border-light);">
            <button id="notes-delete" class="window-toolbar-item" title="Delete Note">🗑️</button>
            <span id="notes-status" style="margin-left: auto; font-size: var(--text-xs); color: var(--text-tertiary);"></span>
          </div>

          <!-- Content -->
          <textarea
            id="notes-content"
            style="flex: 1; width: 100%; padding: var(--space-4); background: var(--bg-primary); border: none; color: var(--text-primary); font-size: var(--text-base); line-height: var(--leading-relaxed); resize: none; outline: none;"
            placeholder="Start typing..."
          ></textarea>
        </div>
      </div>
    `;

    WindowManager.create({
      id: windowId,
      title: 'Notes',
      icon: Icons.get('notes'),
      content,
      width: 800,
      height: 600
    });

    setupEventListeners();
    renderNotesList();
    loadCurrentNote();
  }

  /**
   * Setup event listeners
   */
  function setupEventListeners() {
    const windowEl = document.getElementById(`window-${windowId}`);
    if (!windowEl) return;

    const contentTextarea = windowEl.querySelector('#notes-content');
    const newBtn = windowEl.querySelector('#notes-new');
    const deleteBtn = windowEl.querySelector('#notes-delete');

    // New note button
    newBtn?.addEventListener('click', createNewNote);

    // Delete note button
    deleteBtn?.addEventListener('click', deleteCurrentNote);

    // Auto-save on input
    contentTextarea?.addEventListener('input', () => {
      updateStatus('Editing...');

      // Clear existing timeout
      if (autoSaveTimeout) {
        clearTimeout(autoSaveTimeout);
      }

      // Save after 1 second of inactivity
      autoSaveTimeout = setTimeout(() => {
        saveCurrentNote();
      }, 1000);
    });
  }

  /**
   * Render notes list
   */
  function renderNotesList() {
    const windowEl = document.getElementById(`window-${windowId}`);
    if (!windowEl) return;

    const listEl = windowEl.querySelector('#notes-list');
    if (!listEl) return;

    // Sort notes by modified date (newest first)
    const sortedNotes = [...notes].sort((a, b) =>
      new Date(b.modified) - new Date(a.modified)
    );

    listEl.innerHTML = sortedNotes.map(note => {
      const title = getNoteTitle(note.content);
      const date = new Date(note.modified);
      const dateStr = formatDate(date);
      const preview = note.content.split('\n').slice(1).join(' ').substring(0, 60);
      const isSelected = note.id === currentNoteId;

      return `
        <div
          class="notes-list-item ${isSelected ? 'selected' : ''}"
          data-note-id="${note.id}"
          style="
            padding: var(--space-3);
            border-bottom: 1px solid var(--border-light);
            cursor: pointer;
            transition: background var(--duration-fast) var(--ease-out);
            background: ${isSelected ? 'var(--glass-light)' : 'transparent'};
          "
        >
          <div style="font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-primary); margin-bottom: var(--space-1);">${title}</div>
          <div style="font-size: var(--text-xs); color: var(--text-tertiary); margin-bottom: var(--space-1);">${dateStr}</div>
          ${preview ? `<div style="font-size: var(--text-xs); color: var(--text-secondary); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${preview}</div>` : ''}
        </div>
      `;
    }).join('');

    // Add click handlers
    listEl.querySelectorAll('.notes-list-item').forEach(item => {
      item.addEventListener('click', () => {
        const noteId = parseInt(item.dataset.noteId);
        selectNote(noteId);
      });
    });
  }

  /**
   * Format date for display
   */
  function formatDate(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString();
  }

  /**
   * Select a note
   */
  function selectNote(noteId) {
    // Save current note before switching
    if (currentNoteId && currentNoteId !== noteId) {
      saveCurrentNote();
    }

    currentNoteId = noteId;
    loadCurrentNote();
    renderNotesList();
  }

  /**
   * Load current note into editor
   */
  function loadCurrentNote() {
    const windowEl = document.getElementById(`window-${windowId}`);
    if (!windowEl) return;

    const contentTextarea = windowEl.querySelector('#notes-content');
    if (!contentTextarea) return;

    const note = notes.find(n => n.id === currentNoteId);
    if (note) {
      contentTextarea.value = note.content;
    } else {
      contentTextarea.value = '';
    }
  }

  /**
   * Save current note
   */
  function saveCurrentNote() {
    const windowEl = document.getElementById(`window-${windowId}`);
    if (!windowEl) return;

    const contentTextarea = windowEl.querySelector('#notes-content');
    if (!contentTextarea) return;

    const note = notes.find(n => n.id === currentNoteId);
    if (!note) return;

    note.content = contentTextarea.value;
    note.title = getNoteTitle(note.content);
    note.modified = new Date().toISOString();

    saveNotes();
    renderNotesList();
    updateStatus('Saved ✓');

    setTimeout(() => {
      updateStatus('');
    }, 2000);
  }

  /**
   * Create new note
   */
  function createNewNote() {
    // Save current note first
    if (currentNoteId) {
      saveCurrentNote();
    }

    const newNote = {
      id: Date.now(),
      title: 'New Note',
      content: '',
      created: new Date().toISOString(),
      modified: new Date().toISOString()
    };

    notes.push(newNote);
    saveNotes();

    currentNoteId = newNote.id;
    renderNotesList();
    loadCurrentNote();

    // Focus editor
    const windowEl = document.getElementById(`window-${windowId}`);
    const contentTextarea = windowEl?.querySelector('#notes-content');
    contentTextarea?.focus();
  }

  /**
   * Delete current note
   */
  function deleteCurrentNote() {
    if (!currentNoteId || notes.length <= 1) {
      Notifications.warning('Cannot Delete', 'You must have at least one note');
      return;
    }

    const note = notes.find(n => n.id === currentNoteId);
    if (!note) return;

    const title = getNoteTitle(note.content);

    // Confirm deletion
    if (!confirm(`Delete note "${title}"?`)) {
      return;
    }

    // Remove note
    notes = notes.filter(n => n.id !== currentNoteId);
    saveNotes();

    // Select first remaining note
    if (notes.length > 0) {
      currentNoteId = notes[0].id;
    } else {
      currentNoteId = null;
    }

    renderNotesList();
    loadCurrentNote();

    Notifications.success('Note Deleted', `"${title}" has been deleted`);
  }

  /**
   * Update status message
   */
  function updateStatus(message) {
    const windowEl = document.getElementById(`window-${windowId}`);
    if (!windowEl) return;

    const statusSpan = windowEl.querySelector('#notes-status');
    if (statusSpan) {
      statusSpan.textContent = message;
    }
  }

  /**
   * Get total size of all notes
   */
  function getTotalSize() {
    const data = localStorage.getItem(STORAGE_KEY) || '';
    return new Blob([data]).size;
  }

  // Register app
  Apps.register({
    id: 'notes',
    name: 'Notes',
    icon: Icons.get('notes'),
    description: 'Note-taking',
    category: 'productivity',
    keepInDock: true,
    launch,
    getTotalSize // Expose for storage calculation
  });
})();
