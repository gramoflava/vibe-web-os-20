/* ============================================
   Context Menu System
   Global context menu handler
   ============================================ */

const ContextMenu = (() => {
  let currentMenu = null;

  /**
   * Show a context menu
   */
  function show(items, x, y) {
    // Close any existing menu
    close();

    const menu = document.createElement('div');
    menu.className = 'context-menu';

    items.forEach(item => {
      if (item.divider) {
        const divider = document.createElement('div');
        divider.className = 'context-menu-divider';
        menu.appendChild(divider);
      } else {
        const button = document.createElement('button');
        button.className = 'context-menu-item';
        if (item.disabled) {
          button.classList.add('disabled');
        }

        button.innerHTML = `
          <span class="context-menu-icon">${item.icon || ''}</span>
          <span class="context-menu-label">${item.label}</span>
          ${item.shortcut ? `<span class="context-menu-shortcut">${item.shortcut}</span>` : ''}
        `;

        if (!item.disabled && item.action) {
          button.addEventListener('click', (e) => {
            e.stopPropagation();
            item.action();
            close();
          });
        }

        menu.appendChild(button);
      }
    });

    // Position menu
    document.body.appendChild(menu);

    // Adjust position if menu would go off-screen
    const rect = menu.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let finalX = x;
    let finalY = y;

    if (x + rect.width > viewportWidth) {
      finalX = viewportWidth - rect.width - 10;
    }

    if (y + rect.height > viewportHeight) {
      finalY = viewportHeight - rect.height - 10;
    }

    menu.style.left = `${finalX}px`;
    menu.style.top = `${finalY}px`;

    currentMenu = menu;

    // Close on click outside
    setTimeout(() => {
      document.addEventListener('click', close);
      document.addEventListener('contextmenu', close);
    }, 0);
  }

  /**
   * Close the current menu
   */
  function close() {
    if (currentMenu) {
      currentMenu.remove();
      currentMenu = null;
      document.removeEventListener('click', close);
      document.removeEventListener('contextmenu', close);
    }
  }

  return {
    show,
    close
  };
})();
