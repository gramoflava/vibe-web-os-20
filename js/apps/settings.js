/* ============================================
   System Preferences App
   Settings and customization
   ============================================ */

(() => {
  /**
   * Launch System Preferences
   */
  function launch() {
    const windowId = 'settings-' + Date.now();
    const currentTheme = Shell.getTheme();

    const content = `
      <div style="padding: var(--space-4);">
        <h2 style="margin-bottom: var(--space-4);">System Preferences</h2>

        <!-- Appearance Section -->
        <div class="card" style="margin-bottom: var(--space-6);">
          <h3 style="margin-bottom: var(--space-4); font-size: var(--text-lg);">Appearance</h3>

          <div style="margin-bottom: var(--space-4);">
            <label style="display: block; margin-bottom: var(--space-2); font-size: var(--text-sm); font-weight: var(--weight-medium);">Theme</label>
            <div style="display: flex; gap: var(--space-2);">
              <button id="theme-dark" class="btn ${currentTheme === 'dark' ? 'btn-primary' : ''}" style="flex: 1;">Dark</button>
              <button id="theme-light" class="btn ${currentTheme === 'light' ? 'btn-primary' : ''}" style="flex: 1;">Light</button>
            </div>
          </div>
        </div>

        <!-- Wallpaper Section -->
        <div class="card" style="margin-bottom: var(--space-6);">
          <h3 style="margin-bottom: var(--space-4); font-size: var(--text-lg);">Wallpaper</h3>

          <div style="margin-bottom: var(--space-3); padding: var(--space-3); background: var(--glass-light); border-radius: var(--radius-md); font-size: var(--text-xs); color: var(--text-secondary); border-left: 3px solid var(--accent-blue); display: flex; gap: var(--space-2);">
            <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 16px; height: 16px; flex-shrink: 0; color: var(--accent-blue);">
              <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5" fill="none"/>
              <path d="M8 10.67V8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              <circle cx="8" cy="5.33" r="0.33" fill="currentColor" stroke="currentColor"/>
            </svg>
            <div><strong style="color: var(--text-primary);">Note:</strong> Due to limited localStorage (5-10MB), only online wallpapers are available at this time. Images are loaded from external URLs and not stored locally.</div>
          </div>

          <div style="margin-bottom: var(--space-4);">
            <label style="display: block; margin-bottom: var(--space-2); font-size: var(--text-sm); font-weight: var(--weight-medium);">Background Image URL</label>
            <input
              id="wallpaper-url"
              type="text"
              class="input"
              placeholder="https://picsum.photos/1920/1080"
              value="${localStorage.getItem('webos.wallpaper') || ''}"
            />
          </div>

          <div style="display: flex; gap: var(--space-2);">
            <button id="wallpaper-apply" class="btn btn-primary">Apply Wallpaper</button>
            <button id="wallpaper-remove" class="btn">Remove Wallpaper</button>
          </div>

          <div style="margin-top: var(--space-4); padding: var(--space-3); background: var(--glass-dark); border-radius: var(--radius-md); font-size: var(--text-xs); color: var(--text-secondary);">
            <div style="margin-bottom: var(--space-2);"><strong>Suggested wallpapers:</strong></div>
            <div style="display: flex; flex-direction: column; gap: var(--space-1);">
              <button class="wallpaper-preset" data-url="https://picsum.photos/1920/1080" style="text-align: left; padding: var(--space-1); background: transparent; border: none; color: var(--accent-blue); cursor: pointer; font-size: var(--text-xs); display: flex; align-items: center; gap: 4px;">
                <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 12px; height: 12px;">
                  <rect x="2" y="2" width="12" height="12" rx="1.5" fill="currentColor" opacity="0.3"/>
                  <circle cx="5.67" cy="5.67" r="1.33" fill="currentColor" opacity="0.6"/>
                  <path d="M2 10L5.33 6.67L8.67 10L12 6.67L14 8.67" stroke="currentColor" stroke-width="1" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Random landscape (Picsum)
              </button>
              <button class="wallpaper-preset" data-url="https://source.unsplash.com/1920x1080/?nature" style="text-align: left; padding: var(--space-1); background: transparent; border: none; color: var(--accent-blue); cursor: pointer; font-size: var(--text-xs); display: flex; align-items: center; gap: 4px;">
                <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 12px; height: 12px;">
                  <rect x="2" y="2" width="12" height="12" rx="1.5" fill="currentColor" opacity="0.3"/>
                  <circle cx="5.67" cy="5.67" r="1.33" fill="currentColor" opacity="0.6"/>
                  <path d="M2 10L5.33 6.67L8.67 10L12 6.67L14 8.67" stroke="currentColor" stroke-width="1" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Nature (Unsplash)
              </button>
              <button class="wallpaper-preset" data-url="https://source.unsplash.com/1920x1080/?space" style="text-align: left; padding: var(--space-1); background: transparent; border: none; color: var(--accent-blue); cursor: pointer; font-size: var(--text-xs); display: flex; align-items: center; gap: 4px;">
                <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 12px; height: 12px;">
                  <rect x="2" y="2" width="12" height="12" rx="1.5" fill="currentColor" opacity="0.3"/>
                  <circle cx="5.67" cy="5.67" r="1.33" fill="currentColor" opacity="0.6"/>
                  <path d="M2 10L5.33 6.67L8.67 10L12 6.67L14 8.67" stroke="currentColor" stroke-width="1" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Space (Unsplash)
              </button>
            </div>
          </div>
        </div>

        <!-- Dock Section -->
        <div class="card" style="margin-bottom: var(--space-6);">
          <h3 style="margin-bottom: var(--space-4); font-size: var(--text-lg);">Dock</h3>

          <div style="margin-bottom: var(--space-4);">
            <label style="display: block; margin-bottom: var(--space-2); font-size: var(--text-sm); font-weight: var(--weight-medium);">Position</label>
            <select id="dock-position" class="input">
              <option value="bottom" selected>Bottom</option>
              <option value="left">Left</option>
              <option value="right">Right</option>
            </select>
          </div>

          <div style="margin-bottom: var(--space-4);">
            <label style="display: flex; align-items: center; gap: var(--space-2); cursor: pointer;">
              <input type="checkbox" id="dock-autohide" />
              <span style="font-size: var(--text-sm);">Automatically hide and show the Dock</span>
            </label>
          </div>
        </div>

        <!-- System Section -->
        <div class="card" style="margin-bottom: var(--space-6);">
          <h3 style="margin-bottom: var(--space-4); font-size: var(--text-lg);">System</h3>

          <div style="margin-bottom: var(--space-4);">
            <label style="display: block; margin-bottom: var(--space-2); font-size: var(--text-sm); font-weight: var(--weight-medium); color: var(--text-primary);">Factory Reset</label>
            <p style="margin-bottom: var(--space-3); font-size: var(--text-xs); color: var(--text-secondary); line-height: var(--leading-relaxed);">
              Reset Vibe Web OS to its original state. This will permanently delete all files, notes, settings, and preferences. The OS will reload with default settings.
            </p>
            <button id="factory-reset" class="btn" style="background: var(--error); color: white; border: 1px solid var(--error-hover); display: flex; align-items: center; gap: var(--space-2);">
              <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 16px; height: 16px;">
                <path d="M8 1.33L1.33 13.33H14.67L8 1.33Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                <path d="M8 6V8.67" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                <circle cx="8" cy="11.33" r="0.33" fill="currentColor" stroke="currentColor"/>
              </svg>
              Factory Reset
            </button>
          </div>
        </div>

        <!-- About Section -->
        <div class="card">
          <h3 style="margin-bottom: var(--space-4); font-size: var(--text-lg);">About</h3>

          <div style="font-size: var(--text-sm); line-height: var(--leading-relaxed);">
            <p style="margin-bottom: var(--space-2);"><strong>Vibe Web OS 2.0</strong></p>
            <p style="margin-bottom: var(--space-2); color: var(--text-secondary);">Apple HIG Edition</p>
            <p style="margin-bottom: var(--space-4); color: var(--text-tertiary); font-size: var(--text-xs);">
              A browser-based operating system following Apple's Human Interface Guidelines
            </p>

            <div class="divider"></div>

            <p style="margin-top: var(--space-4); color: var(--text-tertiary); font-size: var(--text-xs);">
              Built with vanilla HTML, CSS, and JavaScript<br>
              No frameworks • No build tools • 100% open source
            </p>
          </div>
        </div>
      </div>
    `;

    WindowManager.create({
      id: windowId,
      title: 'System Preferences',
      icon: Icons.get('settings'),
      content,
      width: 700,
      height: 700
    });

    setupEventListeners(windowId);
  }

  /**
   * Setup event listeners
   */
  function setupEventListeners(windowId) {
    const windowEl = document.getElementById(`window-${windowId}`);
    if (!windowEl) return;

    // Theme buttons
    const darkBtn = windowEl.querySelector('#theme-dark');
    const lightBtn = windowEl.querySelector('#theme-light');

    darkBtn?.addEventListener('click', () => {
      Shell.setTheme('dark');
      darkBtn.classList.add('btn-primary');
      lightBtn.classList.remove('btn-primary');
      Notifications.success('Theme Changed', 'Dark theme applied');
    });

    lightBtn?.addEventListener('click', () => {
      Shell.setTheme('light');
      lightBtn.classList.add('btn-primary');
      darkBtn.classList.remove('btn-primary');
      Notifications.success('Theme Changed', 'Light theme applied');
    });

    // Wallpaper
    const wallpaperUrl = windowEl.querySelector('#wallpaper-url');
    const applyBtn = windowEl.querySelector('#wallpaper-apply');
    const removeBtn = windowEl.querySelector('#wallpaper-remove');

    applyBtn?.addEventListener('click', () => {
      const url = wallpaperUrl?.value?.trim();
      if (!url) {
        Notifications.error('Error', 'Please enter a wallpaper URL');
        return;
      }

      // Test if image loads
      const img = new Image();
      img.onload = () => {
        Shell.setWallpaper(url);
        Notifications.success('Wallpaper Applied', 'Background updated successfully');
      };
      img.onerror = () => {
        Notifications.error('Error', 'Failed to load image. Please check the URL.');
      };
      img.src = url;
    });

    removeBtn?.addEventListener('click', () => {
      Shell.setWallpaper('none');
      if (wallpaperUrl) wallpaperUrl.value = '';
      Notifications.success('Wallpaper Removed', 'Background restored to default');
    });

    // Wallpaper presets
    windowEl.querySelectorAll('.wallpaper-preset').forEach(btn => {
      btn.addEventListener('click', () => {
        const url = btn.dataset.url;
        if (wallpaperUrl) {
          wallpaperUrl.value = url;
        }

        // Auto-apply
        const img = new Image();
        img.onload = () => {
          Shell.setWallpaper(url);
          Notifications.success('Wallpaper Applied', 'Background updated successfully');
        };
        img.onerror = () => {
          Notifications.error('Error', 'Failed to load image. Please try again.');
        };
        img.src = url;
      });
    });

    // Dock settings
    const dockPosition = windowEl.querySelector('#dock-position');
    const dockAutohide = windowEl.querySelector('#dock-autohide');

    dockPosition?.addEventListener('change', () => {
      const position = dockPosition.value;
      const dockContainer = document.getElementById('dock-container');
      if (dockContainer) {
        dockContainer.setAttribute('data-position', position);
        Notifications.info('Dock Position', `Dock moved to ${position}`);
      }
    });

    dockAutohide?.addEventListener('change', () => {
      const autohide = dockAutohide.checked;
      const dockContainer = document.getElementById('dock-container');
      if (dockContainer) {
        dockContainer.setAttribute('data-hidden', autohide);
        Notifications.info('Dock Auto-hide', autohide ? 'Enabled' : 'Disabled');
      }
    });

    // Factory reset
    const factoryResetBtn = windowEl.querySelector('#factory-reset');
    factoryResetBtn?.addEventListener('click', () => {
      performFactoryReset();
    });
  }

  /**
   * Perform factory reset
   */
  function performFactoryReset() {
    // First confirmation
    const confirm1 = confirm(
      '⚠️ Factory Reset Warning\n\n' +
      'This will permanently delete:\n' +
      '• All files and folders\n' +
      '• All notes\n' +
      '• All settings and preferences\n' +
      '• Wallpaper and theme settings\n\n' +
      'This action cannot be undone.\n\n' +
      'Do you want to continue?'
    );

    if (!confirm1) return;

    // Second confirmation (typing required)
    const confirm2 = prompt(
      'To confirm factory reset, type "RESET" (in capital letters):'
    );

    if (confirm2 !== 'RESET') {
      if (confirm2 !== null) {
        Notifications.warning('Factory Reset Cancelled', 'Incorrect confirmation text');
      }
      return;
    }

    // Show notification
    Notifications.info('Factory Reset', 'Resetting system... Please wait.');

    // Perform reset after short delay
    setTimeout(() => {
      try {
        // Clear all localStorage
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('webos.')) {
            keysToRemove.push(key);
          }
        }

        keysToRemove.forEach(key => localStorage.removeItem(key));

        // Show success notification
        Notifications.success('Factory Reset Complete', 'Reloading system...');

        // Reload page after short delay
        setTimeout(() => {
          window.location.reload();
        }, 1500);

      } catch (error) {
        Notifications.error('Factory Reset Failed', error.message);
      }
    }, 500);
  }

  // Register app
  Apps.register({
    id: 'settings',
    name: 'System Preferences',
    icon: Icons.get('settings'),
    description: 'System settings',
    category: 'utilities',
    keepInDock: true,
    launch
  });
})();
