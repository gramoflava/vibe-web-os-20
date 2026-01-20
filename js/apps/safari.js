/* ============================================
   Safari (Old Internet Browser)
   Browse the internet as it was via Wayback Machine
   ============================================ */

(() => {
  /**
   * Launch Safari
   */
  function launch(args = {}) {
    const windowId = 'safari-' + Date.now();
    const initialUrl = args.url || 'https://web.archive.org/web/19961112235908/http://yahoo.com/';

    const content = `
      <div style="display: flex; flex-direction: column; height: 100%; padding: var(--space-3); padding-top: 0; gap: var(--space-3);">
        <!-- Address Bar -->
        <div style="padding: var(--space-3); background: var(--bg-secondary); border: 1px solid var(--border-light); border-radius: var(--radius-inset-md); display: flex; gap: var(--space-2); align-items: center; margin-top: var(--space-3);">
          <button id="safari-back" class="btn" style="padding: var(--space-1) var(--space-2); font-size: var(--text-sm);" title="Back">←</button>
          <button id="safari-forward" class="btn" style="padding: var(--space-1) var(--space-2); font-size: var(--text-sm);" title="Forward">→</button>
          <button id="safari-refresh" class="btn" style="padding: var(--space-1) var(--space-2); font-size: var(--text-sm);" title="Refresh">↻</button>

          <input
            id="safari-url"
            type="text"
            class="input"
            placeholder="Enter a URL or search term..."
            value="${initialUrl}"
            style="flex: 1; font-size: var(--text-sm);"
          />

          <button id="safari-go" class="btn btn-primary" style="padding: var(--space-2) var(--space-4); font-size: var(--text-sm);">Go</button>
          <button id="safari-random" class="btn" style="padding: var(--space-2) var(--space-3); font-size: var(--text-sm); display: flex; align-items: center; gap: 4px;" title="Random old website">
            <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 14px; height: 14px;">
              <rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" stroke-width="1.5" fill="none"/>
              <circle cx="4.67" cy="4.67" r="1" fill="currentColor"/>
              <circle cx="11.33" cy="4.67" r="1" fill="currentColor"/>
              <circle cx="8" cy="8" r="1" fill="currentColor"/>
              <circle cx="4.67" cy="11.33" r="1" fill="currentColor"/>
              <circle cx="11.33" cy="11.33" r="1" fill="currentColor"/>
            </svg>
          </button>
        </div>

        <!-- Browser Frame -->
        <div style="flex: 1; position: relative; background: var(--bg-secondary); border: 1px solid var(--border-light); border-radius: var(--radius-inset-lg); overflow: hidden;">
          <!-- Info Bar -->
          <div id="safari-info" style="padding: var(--space-2) var(--space-3); background: var(--glass-light); border-bottom: 1px solid var(--border-light); font-size: var(--text-xs); color: var(--text-secondary); display: flex; align-items: center; gap: var(--space-2);">
            <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 14px; height: 14px; flex-shrink: 0;">
              <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5" fill="none"/>
              <path d="M8 4V8H11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            <span>Browsing the Old Internet via Wayback Machine</span>
            <button id="safari-help" style="margin-left: auto; background: transparent; border: none; color: var(--accent-blue); cursor: pointer; font-size: var(--text-xs); display: flex; align-items: center; gap: 4px;">
              <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 12px; height: 12px;">
                <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5" fill="none"/>
                <path d="M8 11.33V10.83C8 10.33 8.67 10 9 9.33C9.33 8.67 10 8.33 10 7.33C10 6.22876 9.10457 5.33333 8 5.33333C6.89543 5.33333 6 6.22876 6 7.33333" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                <circle cx="8" cy="12.67" r="0.33" fill="currentColor"/>
              </svg>
              Help
            </button>
          </div>

          <iframe
            id="safari-frame"
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
            style="width: 100%; height: calc(100% - 50px); border: none; background: white;"
            src="${initialUrl}"
          ></iframe>

          <!-- Loading Overlay -->
          <div id="safari-loading" style="display: none; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: var(--glass-dark); backdrop-filter: var(--blur-md); padding: var(--space-6); border-radius: var(--radius-inset-md); text-align: center;">
            <div style="font-size: var(--text-2xl); margin-bottom: var(--space-2);">⏳</div>
            <div style="font-size: var(--text-sm); color: var(--text-secondary);">Loading archived page...</div>
          </div>

          <!-- Status Bar -->
          <div style="position: absolute; bottom: 0; left: 0; right: 0; padding: var(--space-1) var(--space-3); background: var(--bg-secondary); border-top: 1px solid var(--border-light); font-size: var(--text-xs); color: var(--text-tertiary); display: flex; justify-content: space-between;">
            <span id="safari-status">Ready</span>
            <span id="safari-timestamp"></span>
          </div>
        </div>
      </div>
    `;

    WindowManager.create({
      id: windowId,
      title: 'Safari - Old Internet Browser',
      icon: Icons.get('safari'),
      content,
      width: 1000,
      height: 700
    });

    setupEventListeners(windowId);
    updateTimestamp(windowId, initialUrl);
  }

  /**
   * Setup event listeners
   */
  function setupEventListeners(windowId) {
    const windowEl = document.getElementById(`window-${windowId}`);
    if (!windowEl) return;

    const urlInput = windowEl.querySelector('#safari-url');
    const goBtn = windowEl.querySelector('#safari-go');
    const backBtn = windowEl.querySelector('#safari-back');
    const forwardBtn = windowEl.querySelector('#safari-forward');
    const refreshBtn = windowEl.querySelector('#safari-refresh');
    const randomBtn = windowEl.querySelector('#safari-random');
    const helpBtn = windowEl.querySelector('#safari-help');
    const frame = windowEl.querySelector('#safari-frame');

    // Go button
    goBtn?.addEventListener('click', () => {
      const url = urlInput?.value?.trim();
      if (url) {
        navigateTo(windowId, url);
      }
    });

    // Enter key in URL bar
    urlInput?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const url = urlInput?.value?.trim();
        if (url) {
          navigateTo(windowId, url);
        }
      }
    });

    // Navigation buttons
    backBtn?.addEventListener('click', () => {
      try {
        frame?.contentWindow?.history.back();
      } catch (e) {
        Notifications.warning('Navigation', 'Cannot go back');
      }
    });

    forwardBtn?.addEventListener('click', () => {
      try {
        frame?.contentWindow?.history.forward();
      } catch (e) {
        Notifications.warning('Navigation', 'Cannot go forward');
      }
    });

    refreshBtn?.addEventListener('click', () => {
      if (frame) {
        frame.src = frame.src;
      }
    });

    // Random old website
    randomBtn?.addEventListener('click', () => {
      const randomSites = [
        'https://web.archive.org/web/19961112235908/http://yahoo.com/',
        'https://web.archive.org/web/19961017235908/http://www.google.com/',
        'https://web.archive.org/web/19970126045828/http://www.cnn.com/',
        'https://web.archive.org/web/19961220154510/http://www.amazon.com/',
        'https://web.archive.org/web/19961219010247/http://www.apple.com/',
        'https://web.archive.org/web/19970614002711/http://www.ebay.com/',
        'https://web.archive.org/web/19970211090709/http://www.msn.com/',
        'https://web.archive.org/web/19961222130253/http://www.espn.com/',
        'https://web.archive.org/web/19970126054508/http://www.weather.com/',
        'https://web.archive.org/web/19961222035139/http://www.nasa.gov/',
        'https://web.archive.org/web/19970126012447/http://www.bbc.co.uk/',
        'https://web.archive.org/web/19961221174141/http://www.cnet.com/',
        'https://web.archive.org/web/19970126032813/http://www.slashdot.org/',
        'https://web.archive.org/web/19970604083039/http://www.geocities.com/',
        'https://web.archive.org/web/19961023234631/http://www.excite.com/'
      ];

      const randomUrl = randomSites[Math.floor(Math.random() * randomSites.length)];
      navigateTo(windowId, randomUrl);
    });

    // Help button
    helpBtn?.addEventListener('click', () => {
      showHelp();
    });

    // Track loading
    frame?.addEventListener('load', () => {
      const loading = windowEl.querySelector('#safari-loading');
      if (loading) {
        loading.style.display = 'none';
      }
      updateStatus(windowId, 'Page loaded');

      // Try to update URL bar with current frame URL
      try {
        if (frame.contentWindow?.location?.href) {
          if (urlInput) {
            urlInput.value = frame.contentWindow.location.href;
          }
          updateTimestamp(windowId, frame.contentWindow.location.href);
        }
      } catch (e) {
        // Cross-origin restriction, can't access frame URL
      }
    });
  }

  /**
   * Navigate to URL
   */
  function navigateTo(windowId, url) {
    const windowEl = document.getElementById(`window-${windowId}`);
    if (!windowEl) return;

    const frame = windowEl.querySelector('#safari-frame');
    const loading = windowEl.querySelector('#safari-loading');

    if (!frame) return;

    // Show loading
    if (loading) {
      loading.style.display = 'block';
    }

    updateStatus(windowId, 'Loading...');

    // Process URL
    let targetUrl = url;

    // If not a Wayback Machine URL, convert it
    if (!url.includes('web.archive.org')) {
      // Remove http:// or https:// if present
      let cleanUrl = url.replace(/^https?:\/\//, '');

      // Default to late 90s snapshot
      const timestamp = '19971020000000'; // October 20, 1997
      targetUrl = `https://web.archive.org/web/${timestamp}/http://${cleanUrl}`;
    }

    frame.src = targetUrl;

    const urlInput = windowEl.querySelector('#safari-url');
    if (urlInput) {
      urlInput.value = targetUrl;
    }

    updateTimestamp(windowId, targetUrl);
  }

  /**
   * Update status message
   */
  function updateStatus(windowId, message) {
    const windowEl = document.getElementById(`window-${windowId}`);
    if (!windowEl) return;

    const status = windowEl.querySelector('#safari-status');
    if (status) {
      status.textContent = message;
    }
  }

  /**
   * Update timestamp display
   */
  function updateTimestamp(windowId, url) {
    const windowEl = document.getElementById(`window-${windowId}`);
    if (!windowEl) return;

    const timestampEl = windowEl.querySelector('#safari-timestamp');
    if (!timestampEl) return;

    // Extract timestamp from Wayback Machine URL
    const match = url.match(/web\.archive\.org\/web\/(\d{14})\//);
    if (match) {
      const timestamp = match[1];
      // Format: YYYYMMDDHHMMSS
      const year = timestamp.substring(0, 4);
      const month = timestamp.substring(4, 6);
      const day = timestamp.substring(6, 8);

      const date = new Date(year, parseInt(month) - 1, day);
      const dateStr = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      timestampEl.textContent = `Snapshot from ${dateStr}`;
    } else {
      timestampEl.textContent = '';
    }
  }

  /**
   * Show help dialog
   */
  function showHelp() {
    const helpWindowId = 'safari-help-' + Date.now();

    const helpContent = `
      <div style="padding: var(--space-6);">
        <h2 style="margin-bottom: var(--space-4); font-size: var(--text-xl);">Safari - Old Internet Browser</h2>

        <div class="card" style="margin-bottom: var(--space-4);">
          <h3 style="margin-bottom: var(--space-3); font-size: var(--text-lg);">What is this?</h3>
          <p style="font-size: var(--text-sm); line-height: var(--leading-relaxed); color: var(--text-secondary);">
            Safari lets you browse the internet as it was in the late 1990s and early 2000s using the
            <strong>Internet Archive's Wayback Machine</strong>. Experience websites from decades ago
            with their original designs, content, and functionality.
          </p>
        </div>

        <div class="card" style="margin-bottom: var(--space-4);">
          <h3 style="margin-bottom: var(--space-3); font-size: var(--text-lg);">How to use</h3>
          <ul style="font-size: var(--text-sm); line-height: var(--leading-relaxed); color: var(--text-secondary); margin-left: var(--space-4);">
            <li style="margin-bottom: var(--space-2);">
              <strong>Enter a URL:</strong> Type any website address (e.g., "yahoo.com") and press Go
            </li>
            <li style="margin-bottom: var(--space-2);">
              <strong>Random site:</strong> Click the 🎲 button to visit a random website from the 90s
            </li>
            <li style="margin-bottom: var(--space-2);">
              <strong>Navigation:</strong> Use ← → buttons to go back and forward
            </li>
            <li style="margin-bottom: var(--space-2);">
              <strong>Refresh:</strong> Click ↻ to reload the current page
            </li>
          </ul>
        </div>

        <div class="card" style="margin-bottom: var(--space-4);">
          <h3 style="margin-bottom: var(--space-3); font-size: var(--text-lg);">Popular sites to try</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-2); font-size: var(--text-sm);">
            <div style="padding: var(--space-2); background: var(--glass-light); border-radius: var(--radius-md);">
              <strong>yahoo.com</strong><br>
              <span style="color: var(--text-tertiary); font-size: var(--text-xs);">Original web portal</span>
            </div>
            <div style="padding: var(--space-2); background: var(--glass-light); border-radius: var(--radius-md);">
              <strong>google.com</strong><br>
              <span style="color: var(--text-tertiary); font-size: var(--text-xs);">Pre-Google era</span>
            </div>
            <div style="padding: var(--space-2); background: var(--glass-light); border-radius: var(--radius-md);">
              <strong>amazon.com</strong><br>
              <span style="color: var(--text-tertiary); font-size: var(--text-xs);">Online bookstore</span>
            </div>
            <div style="padding: var(--space-2); background: var(--glass-light); border-radius: var(--radius-md);">
              <strong>apple.com</strong><br>
              <span style="color: var(--text-tertiary); font-size: var(--text-xs);">Retro Apple</span>
            </div>
            <div style="padding: var(--space-2); background: var(--glass-light); border-radius: var(--radius-md);">
              <strong>geocities.com</strong><br>
              <span style="color: var(--text-tertiary); font-size: var(--text-xs);">Personal homepages</span>
            </div>
            <div style="padding: var(--space-2); background: var(--glass-light); border-radius: var(--radius-md);">
              <strong>nasa.gov</strong><br>
              <span style="color: var(--text-tertiary); font-size: var(--text-xs);">Space exploration</span>
            </div>
          </div>
        </div>

        <div class="card">
          <h3 style="margin-bottom: var(--space-3); font-size: var(--text-lg);">Tips</h3>
          <ul style="font-size: var(--text-sm); line-height: var(--leading-relaxed); color: var(--text-secondary); margin-left: var(--space-4);">
            <li style="margin-bottom: var(--space-2);">
              Default snapshots are from 1997, the golden age of Web 1.0
            </li>
            <li style="margin-bottom: var(--space-2);">
              Some archived pages may load slowly due to external resources
            </li>
            <li style="margin-bottom: var(--space-2);">
              Interactive features may not work on all archived sites
            </li>
            <li>
              Explore <strong>web.archive.org</strong> directly for more browsing options
            </li>
          </ul>
        </div>

        <div style="margin-top: var(--space-6); text-align: center;">
          <button class="btn btn-primary" onclick="WindowManager.close('${helpWindowId}')">Got it!</button>
        </div>
      </div>
    `;

    WindowManager.create({
      id: helpWindowId,
      title: 'Safari Help',
      icon: Icons.get('help'),
      content: helpContent,
      width: 600,
      height: 650
    });
  }

  // Register app
  Apps.register({
    id: 'safari',
    name: 'Safari',
    icon: Icons.get('safari'),
    description: 'Browse the old internet',
    category: 'internet',
    keepInDock: true,
    launch
  });
})();
