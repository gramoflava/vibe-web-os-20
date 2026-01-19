/* ============================================
   Doom App
   Classic FPS game running in js-dos emulator
   ============================================ */

(() => {
  /**
   * Launch Doom
   */
  function launch() {
    const windowId = 'doom-' + Date.now();

    const content = `
      <div style="display: flex; flex-direction: column; height: 100%; background: #000;">
        <div class="window-toolbar" style="background: var(--bg-secondary);">
          <div style="display: flex; align-items: center; gap: var(--space-2);">
            <span style="font-size: var(--text-lg);">💀</span>
            <span style="font-weight: var(--weight-semibold);">DOOM</span>
          </div>
          <div style="margin-left: auto; display: flex; gap: var(--space-2); align-items: center;">
            <span style="font-size: var(--text-xs); color: var(--text-tertiary);">
              Controls: Arrow Keys = Move, Ctrl = Fire, Space = Use, 1-7 = Weapons
            </span>
          </div>
        </div>
        <div style="flex: 1; display: flex; align-items: center; justify-content: center; background: #000; position: relative; overflow: hidden;">
          <div id="doom-loading-${windowId}" style="position: absolute; z-index: 10; text-align: center; color: #fff;">
            <div style="font-size: 48px; margin-bottom: var(--space-4); animation: pulse 2s infinite;">💀</div>
            <div style="font-size: var(--text-xl); font-weight: var(--weight-semibold); margin-bottom: var(--space-2);">Loading DOOM...</div>
            <div style="font-size: var(--text-sm); color: rgba(255,255,255,0.6);">Initializing DOS emulator</div>
            <div style="margin-top: var(--space-4); font-size: var(--text-xs); color: rgba(255,255,255,0.4);">
              This may take a moment on first load
            </div>
          </div>
          <iframe
            id="doom-iframe-${windowId}"
            src="https://js-dos.com/games/doom.exe.html"
            style="width: 100%; height: 100%; border: none; opacity: 0; transition: opacity 0.5s ease;"
            allowfullscreen
            allow="autoplay"
          ></iframe>
        </div>
        <div style="padding: var(--space-2) var(--space-4); background: var(--bg-secondary); border-top: 1px solid var(--border-light); font-size: var(--text-xs); color: var(--text-tertiary); text-align: center;">
          DOOM © 1993 id Software • Running in js-dos emulator • Click inside to play
        </div>
      </div>
    `;

    WindowManager.create({
      id: windowId,
      title: 'DOOM',
      icon: Icons.get('doom'),
      content,
      width: 960,
      height: 720
    });

    setupEventListeners(windowId);

    // Show notification
    Notifications.show({
      title: 'DOOM Launched',
      body: 'Click inside the game window to start playing!',
      icon: Icons.get('doom'),
      duration: 6000
    });
  }

  /**
   * Setup event listeners
   */
  function setupEventListeners(windowId) {
    const windowEl = document.getElementById(`window-${windowId}`);
    if (!windowEl) return;

    const iframe = windowEl.querySelector(`#doom-iframe-${windowId}`);
    const loading = windowEl.querySelector(`#doom-loading-${windowId}`);

    if (!iframe || !loading) return;

    // Hide loading screen when iframe loads
    iframe.addEventListener('load', () => {
      setTimeout(() => {
        loading.style.opacity = '0';
        loading.style.transition = 'opacity 0.5s ease';
        iframe.style.opacity = '1';

        setTimeout(() => {
          loading.style.display = 'none';
        }, 500);
      }, 1500); // Give it a moment to initialize
    });

    // Handle errors
    iframe.addEventListener('error', () => {
      loading.innerHTML = `
        <div style="margin-bottom: var(--space-4);">
          <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 48px; height: 48px; color: var(--error);">
            <path d="M32 4L4 53.33H60L32 4Z" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
            <path d="M32 20V34.67" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
            <circle cx="32" cy="45.33" r="1" fill="currentColor" stroke="currentColor"/>
          </svg>
        </div>
        <div style="font-size: var(--text-xl); font-weight: var(--weight-semibold); margin-bottom: var(--space-2); color: var(--error);">Failed to Load DOOM</div>
        <div style="font-size: var(--text-sm); color: rgba(255,255,255,0.6); margin-bottom: var(--space-4);">
          Unable to connect to js-dos server
        </div>
        <button class="btn btn-primary" onclick="location.reload()">Retry</button>
      `;
    });
  }

  // Register app
  Apps.register({
    id: 'doom',
    name: 'DOOM',
    icon: Icons.get('doom'),
    description: 'Classic FPS game (1993)',
    category: 'games',
    keepInDock: true,
    launch
  });
})();
