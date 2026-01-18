/* ============================================
   File System Module
   Virtual file system with localStorage backend
   Enhanced with better metadata and operations
   ============================================ */

const FS = (() => {
  const STORAGE_KEY = 'webos.fs.v2';
  let root = null;

  /**
   * Initialize file system with default structure
   */
  function initDefault() {
    return {
      name: 'root',
      path: '/root',
      isDirectory: true,
      created: new Date().toISOString(),
      modified: new Date().toISOString(),
      children: [
        createDirectory('Desktop', '/root/Desktop'),
        createDirectory('Documents', '/root/Documents'),
        createDirectory('Downloads', '/root/Downloads'),
        createDirectory('Pictures', '/root/Pictures'),
        createDirectory('Music', '/root/Music')
      ]
    };
  }

  /**
   * Create a directory node
   */
  function createDirectory(name, path) {
    return {
      name,
      path,
      isDirectory: true,
      created: new Date().toISOString(),
      modified: new Date().toISOString(),
      children: []
    };
  }

  /**
   * Create a file node
   */
  function createFile(name, path, content = '') {
    return {
      name,
      path,
      isDirectory: false,
      content,
      size: new Blob([content]).size,
      created: new Date().toISOString(),
      modified: new Date().toISOString()
    };
  }

  /**
   * Find a node by path
   */
  function find(path) {
    if (!path || path === '/root') return root;

    const parts = path.replace(/^\/root\/?/, '').split('/').filter(Boolean);
    let current = root;

    for (const part of parts) {
      if (!current.isDirectory) return null;
      current = current.children.find(child => child.name === part);
      if (!current) return null;
    }

    return current;
  }

  /**
   * List directory contents
   */
  function ls(path = '/root') {
    const node = find(path);
    if (!node || !node.isDirectory) return null;
    return node.children || [];
  }

  /**
   * Read file content
   */
  function read(path) {
    const node = find(path);
    if (!node || node.isDirectory) return null;
    return node.content;
  }

  /**
   * Write file (create or update)
   */
  function write(path, content) {
    const parentPath = path.substring(0, path.lastIndexOf('/')) || '/root';
    const fileName = path.substring(path.lastIndexOf('/') + 1);
    const parent = find(parentPath);

    if (!parent || !parent.isDirectory) {
      throw new Error('Parent directory not found');
    }

    // Check if file exists
    const existing = parent.children.find(child => child.name === fileName);

    if (existing) {
      // Update existing file
      if (existing.isDirectory) {
        throw new Error('Cannot write to a directory');
      }
      existing.content = content;
      existing.size = new Blob([content]).size;
      existing.modified = new Date().toISOString();
    } else {
      // Create new file
      parent.children.push(createFile(fileName, path, content));
      parent.modified = new Date().toISOString();
    }

    save();
    Bus.emit('fs:changed', { path, action: 'write' });
    return true;
  }

  /**
   * Create directory
   */
  function mkdir(path) {
    const parentPath = path.substring(0, path.lastIndexOf('/')) || '/root';
    const dirName = path.substring(path.lastIndexOf('/') + 1);
    const parent = find(parentPath);

    if (!parent || !parent.isDirectory) {
      throw new Error('Parent directory not found');
    }

    // Check if already exists
    if (parent.children.find(child => child.name === dirName)) {
      throw new Error('Directory already exists');
    }

    parent.children.push(createDirectory(dirName, path));
    parent.modified = new Date().toISOString();

    save();
    Bus.emit('fs:changed', { path, action: 'mkdir' });
    return true;
  }

  /**
   * Remove file or directory
   */
  function rm(path) {
    if (path === '/root') {
      throw new Error('Cannot delete root directory');
    }

    const parentPath = path.substring(0, path.lastIndexOf('/')) || '/root';
    const name = path.substring(path.lastIndexOf('/') + 1);
    const parent = find(parentPath);

    if (!parent || !parent.isDirectory) {
      throw new Error('Parent directory not found');
    }

    const index = parent.children.findIndex(child => child.name === name);
    if (index === -1) {
      throw new Error('File or directory not found');
    }

    parent.children.splice(index, 1);
    parent.modified = new Date().toISOString();

    save();
    Bus.emit('fs:changed', { path, action: 'rm' });
    return true;
  }

  /**
   * Rename file or directory
   */
  function rename(path, newName) {
    const node = find(path);
    if (!node) {
      throw new Error('File or directory not found');
    }

    const parentPath = path.substring(0, path.lastIndexOf('/')) || '/root';
    const parent = find(parentPath);

    // Check if new name already exists
    if (parent.children.find(child => child.name === newName && child !== node)) {
      throw new Error('A file or directory with that name already exists');
    }

    const oldName = node.name;
    node.name = newName;
    node.path = `${parentPath}/${newName}`;
    node.modified = new Date().toISOString();

    // Update paths of children recursively if it's a directory
    if (node.isDirectory) {
      updateChildPaths(node);
    }

    save();
    Bus.emit('fs:changed', { path: node.path, oldPath: path, action: 'rename' });
    return true;
  }

  /**
   * Copy file or directory
   */
  function copy(sourcePath, destPath) {
    const source = find(sourcePath);
    if (!source) {
      throw new Error('Source not found');
    }

    const parentPath = destPath.substring(0, destPath.lastIndexOf('/')) || '/root';
    const parent = find(parentPath);

    if (!parent || !parent.isDirectory) {
      throw new Error('Destination directory not found');
    }

    const copy = JSON.parse(JSON.stringify(source));
    copy.path = destPath;
    copy.name = destPath.substring(destPath.lastIndexOf('/') + 1);
    copy.created = new Date().toISOString();
    copy.modified = new Date().toISOString();

    if (copy.isDirectory) {
      updateChildPaths(copy);
    }

    parent.children.push(copy);
    save();
    Bus.emit('fs:changed', { path: destPath, action: 'copy' });
    return true;
  }

  /**
   * Move file or directory
   */
  function move(sourcePath, destPath) {
    copy(sourcePath, destPath);
    rm(sourcePath);
    Bus.emit('fs:changed', { path: destPath, oldPath: sourcePath, action: 'move' });
    return true;
  }

  /**
   * Get file/directory metadata
   */
  function getMetadata(path) {
    const node = find(path);
    if (!node) return null;

    return {
      name: node.name,
      path: node.path,
      isDirectory: node.isDirectory,
      size: node.size || 0,
      created: node.created,
      modified: node.modified,
      itemCount: node.isDirectory ? node.children?.length : undefined
    };
  }

  /**
   * Update child paths recursively
   */
  function updateChildPaths(node) {
    if (!node.isDirectory) return;

    node.children.forEach(child => {
      child.path = `${node.path}/${child.name}`;
      if (child.isDirectory) {
        updateChildPaths(child);
      }
    });
  }

  /**
   * Save to localStorage
   */
  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(root));
    } catch (error) {
      console.error('Failed to save file system:', error);
    }
  }

  /**
   * Load from localStorage
   */
  function load() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        root = JSON.parse(data);
      } else {
        root = initDefault();
        save();
      }
    } catch (error) {
      console.error('Failed to load file system:', error);
      root = initDefault();
    }
  }

  /**
   * Reset to default
   */
  function reset() {
    root = initDefault();
    save();
    Bus.emit('fs:reset');
  }

  /**
   * Calculate total size of a node recursively
   */
  function calculateSize(node) {
    if (!node) return 0;

    if (!node.isDirectory) {
      return node.size || 0;
    }

    let total = 0;
    if (node.children) {
      for (const child of node.children) {
        total += calculateSize(child);
      }
    }
    return total;
  }

  /**
   * Get storage information
   */
  function getStorageInfo() {
    let used = calculateSize(root);

    // Add Notes app storage if available
    try {
      const notesData = localStorage.getItem('webos.notes.v2') || '';
      used += new Blob([notesData]).size;
    } catch (e) {
      // Ignore if notes not available
    }

    // Get localStorage limit (usually 5-10MB, we'll estimate)
    let total = 5 * 1024 * 1024; // 5MB default

    // Try to detect actual limit
    try {
      const testKey = 'webos.storage.test';
      let data = localStorage.getItem(STORAGE_KEY) || '';
      total = data.length * 2; // Rough estimate based on current usage

      // Cap at reasonable limits
      if (total < 5 * 1024 * 1024) total = 5 * 1024 * 1024;
      if (total > 10 * 1024 * 1024) total = 10 * 1024 * 1024;
    } catch (e) {
      // Use default
    }

    return {
      used,
      total,
      available: total - used,
      percentUsed: (used / total) * 100
    };
  }

  /**
   * Format bytes to human-readable size
   */
  function formatSize(bytes) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Get file icon based on extension
   */
  function getIcon(filename) {
    if (!filename) return '📄';

    const ext = filename.split('.').pop().toLowerCase();
    const iconMap = {
      txt: '📄',
      md: '📝',
      pdf: '📕',
      doc: '📘',
      docx: '📘',
      jpg: '🖼️',
      jpeg: '🖼️',
      png: '🖼️',
      gif: '🖼️',
      svg: '🖼️',
      mp4: '🎬',
      mov: '🎬',
      avi: '🎬',
      mp3: '🎵',
      wav: '🎵',
      js: '📜',
      html: '🌐',
      css: '🎨',
      json: '⚙️',
      zip: '📦',
      folder: '📁'
    };

    return iconMap[ext] || '📄';
  }

  // Initialize on load
  load();

  return {
    find,
    ls,
    read,
    write,
    mkdir,
    rm,
    rename,
    copy,
    move,
    getMetadata,
    save,
    load,
    reset,
    getIcon,
    getStorageInfo,
    formatSize
  };
})();
