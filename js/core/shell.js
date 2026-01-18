/* ============================================
   Shell
   Desktop environment controller
   ============================================ */

const Shell = (() => {
  /**
   * Initialize the desktop shell
   */
  function init() {
    setupWallpaper();
    setupTheme();
  }

  /**
   * Setup wallpaper
   */
  function setupWallpaper() {
    const wallpaper = localStorage.getItem('webos.wallpaper');
    if (wallpaper && wallpaper !== 'none') {
      setWallpaper(wallpaper);
    } else if (!wallpaper) {
      // Set default wallpaper on first load
      const defaultWallpaper = 'https://picsum.photos/1920/1080';
      setWallpaper(defaultWallpaper);
    }
  }

  /**
   * Setup theme
   */
  function setupTheme() {
    const theme = localStorage.getItem('webos.theme') || 'dark';
    setTheme(theme);
  }

  /**
   * Set wallpaper
   */
  function setWallpaper(url) {
    const desktop = document.getElementById('desktop');
    if (url && url !== 'none') {
      desktop.style.backgroundImage = `url(${url})`;
      desktop.setAttribute('data-wallpaper', 'true');
    } else {
      desktop.style.backgroundImage = '';
      desktop.removeAttribute('data-wallpaper');
    }
    localStorage.setItem('webos.wallpaper', url);
  }

  /**
   * Set theme
   */
  function setTheme(theme) {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    localStorage.setItem('webos.theme', theme);
    Bus.emit('theme:changed', { theme });
  }

  /**
   * Get current theme
   */
  function getTheme() {
    return localStorage.getItem('webos.theme') || 'dark';
  }

  return {
    init,
    setWallpaper,
    setTheme,
    getTheme
  };
})();
