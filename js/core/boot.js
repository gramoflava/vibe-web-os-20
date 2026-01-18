/* ============================================
   Boot Sequence
   Apple-style boot animation
   ============================================ */

const Boot = (() => {
  const bootScreen = document.getElementById('boot-screen');
  const bootProgress = document.getElementById('boot-progress');
  const bootText = document.getElementById('boot-text');
  const desktop = document.getElementById('desktop');

  const bootStages = [
    { progress: 20, text: 'Loading system...', delay: 300 },
    { progress: 40, text: 'Initializing file system...', delay: 300 },
    { progress: 60, text: 'Starting window manager...', delay: 300 },
    { progress: 80, text: 'Loading applications...', delay: 300 },
    { progress: 100, text: 'Ready', delay: 200 }
  ];

  /**
   * Start boot sequence
   */
  async function start() {
    console.log('🍎 Vibe Web OS 2.0 - Booting...');

    // Run boot stages
    for (const stage of bootStages) {
      await runStage(stage);
    }

    // Complete boot
    await complete();
  }

  /**
   * Run a boot stage
   */
  function runStage(stage) {
    return new Promise(resolve => {
      bootText.textContent = stage.text;
      bootProgress.style.width = `${stage.progress}%`;

      setTimeout(resolve, stage.delay);
    });
  }

  /**
   * Complete boot sequence
   */
  async function complete() {
    console.log('✅ Boot complete!');

    // Fade out boot screen
    bootScreen.style.opacity = '0';
    bootScreen.style.transition = 'opacity 0.5s ease';

    // Show desktop
    setTimeout(() => {
      bootScreen.style.display = 'none';
      desktop.style.display = 'flex';

      // Initialize all systems
      initializeSystems();

      Bus.emit('boot:complete');
    }, 500);
  }

  /**
   * Initialize all systems after boot
   */
  function initializeSystems() {
    // Initialize core systems
    Shell.init();
    MenuBar.init();
    Dock.init();
    Spotlight.init();

    // Register service worker
    registerServiceWorker();

    // Show welcome notification
    setTimeout(() => {
      Notifications.show({
        title: 'Welcome to Vibe Web OS 2.0',
        body: 'Press ⌘+Space to open Spotlight search',
        icon: Icons.get('apple'),
        duration: 8000
      });
    }, 500);
  }

  /**
   * Register service worker for offline support
   */
  async function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        await navigator.serviceWorker.register('./sw.js');
        console.log('✅ Service Worker registered');
      } catch (error) {
        console.warn('Service Worker registration failed:', error);
      }
    }
  }

  return {
    start
  };
})();
