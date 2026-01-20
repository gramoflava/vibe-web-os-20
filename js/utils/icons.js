/* ============================================
   Icon System
   SVG icon library for apps
   ============================================ */

const Icons = {
  /**
   * Finder - Folder icon
   */
  finder: `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="folderGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#66B3FF;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#0088FF;stop-opacity:1" />
        </linearGradient>
      </defs>
      <path d="M8 16C8 13.7909 9.79086 12 12 12H24L28 16H52C54.2091 16 56 17.7909 56 20V48C56 50.2091 54.2091 52 52 52H12C9.79086 52 8 50.2091 8 48V16Z"
        fill="url(#folderGradient)" stroke="#0066CC" stroke-width="2"/>
    </svg>
  `,

  /**
   * TextEdit - Pencil/Document icon
   */
  textedit: `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="pencilGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#FFD700;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#FFA500;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect x="12" y="8" width="32" height="48" rx="4" fill="white" stroke="#CCC" stroke-width="2"/>
      <line x1="16" y1="16" x2="36" y2="16" stroke="#666" stroke-width="2" stroke-linecap="round"/>
      <line x1="16" y1="24" x2="36" y2="24" stroke="#999" stroke-width="1.5" stroke-linecap="round"/>
      <line x1="16" y1="30" x2="30" y2="30" stroke="#999" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M34 32L40 26L46 32L40 38L34 32Z M40 26L48 18L54 24L46 32L40 26Z"
        fill="url(#pencilGradient)" stroke="#CC8800" stroke-width="1.5" stroke-linejoin="round"/>
    </svg>
  `,

  /**
   * Notes - Notepad icon
   */
  notes: `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="notesGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#FFE57F;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#FFD54F;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect x="14" y="8" width="36" height="48" rx="2" fill="url(#notesGradient)" stroke="#E6B800" stroke-width="2"/>
      <line x1="14" y1="16" x2="50" y2="16" stroke="#E6B800" stroke-width="2"/>
      <line x1="20" y1="24" x2="44" y2="24" stroke="#CCA000" stroke-width="1.5" stroke-linecap="round"/>
      <line x1="20" y1="32" x2="44" y2="32" stroke="#CCA000" stroke-width="1.5" stroke-linecap="round"/>
      <line x1="20" y1="40" x2="38" y2="40" stroke="#CCA000" stroke-width="1.5" stroke-linecap="round"/>
    </svg>
  `,

  /**
   * Settings - Gear icon
   */
  settings: `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gearGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#A8A8A8;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#666666;stop-opacity:1" />
        </linearGradient>
      </defs>
      <path d="M32 8L36 16H44L48 24L56 28L56 36L48 40L44 48H36L32 56L28 48H20L16 40L8 36L8 28L16 24L20 16H28L32 8Z"
        fill="url(#gearGradient)" stroke="#444" stroke-width="2"/>
      <circle cx="32" cy="32" r="8" fill="#333" stroke="#222" stroke-width="2"/>
    </svg>
  `,

  /**
   * DOOM - Skull icon
   */
  doom: `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="skullGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#E0E0E0;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#B0B0B0;stop-opacity:1" />
        </linearGradient>
      </defs>
      <!-- Skull shape -->
      <ellipse cx="32" cy="28" rx="18" ry="20" fill="url(#skullGradient)" stroke="#888" stroke-width="2"/>
      <!-- Eye sockets -->
      <ellipse cx="24" cy="24" rx="5" ry="7" fill="#333"/>
      <ellipse cx="40" cy="24" rx="5" ry="7" fill="#333"/>
      <!-- Nose -->
      <path d="M30 34L32 38L34 34L32 35L30 34Z" fill="#333"/>
      <!-- Teeth -->
      <rect x="22" y="42" width="4" height="6" rx="1" fill="white" stroke="#888" stroke-width="0.5"/>
      <rect x="28" y="42" width="4" height="6" rx="1" fill="white" stroke="#888" stroke-width="0.5"/>
      <rect x="34" y="42" width="4" height="6" rx="1" fill="white" stroke="#888" stroke-width="0.5"/>
      <rect x="40" y="42" width="4" height="6" rx="1" fill="white" stroke="#888" stroke-width="0.5"/>
    </svg>
  `,

  /**
   * Apple logo
   */
  apple: `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M42 10C42 10 40 8 38 8C36 8 34 10 32 10C30 10 28 8 26 8C24 8 22 10 22 10C22 10 18 12 18 18C18 24 22 32 24 36C26 40 28 42 30 42C32 42 32 40 34 40C36 40 36 42 38 42C40 42 42 40 44 36C46 32 50 24 50 18C50 12 46 10 42 10Z"
        fill="currentColor"/>
      <path d="M36 8C36 8 36 4 32 4C28 4 28 8 28 8"
        stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/>
    </svg>
  `,

  /**
   * Home icon
   */
  home: `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 12L5 10M5 10L12 3L19 10M5 10V20C5 20.5523 5.44772 21 6 21H9M19 10L21 12M19 10V20C19 20.5523 18.5523 21 18 21H15M9 21C9.55228 21 10 20.5523 10 20V16C10 15.4477 10.4477 15 11 15H13C13.5523 15 14 15.4477 14 16V20C14 20.5523 14.4477 21 15 21M9 21H15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `,

  /**
   * Desktop icon
   */
  desktop: `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="4" width="20" height="12" rx="2" fill="currentColor" opacity="0.3"/>
      <rect x="8" y="16" width="8" height="1" fill="currentColor" opacity="0.5"/>
      <rect x="6" y="17" width="12" height="2" rx="1" fill="currentColor" opacity="0.3"/>
    </svg>
  `,

  /**
   * Document icon
   */
  document: `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 2H14L19 7V20C19 21.1046 18.1046 22 17 22H7C5.89543 22 5 21.1046 5 20V4C5 2.89543 5.89543 2 7 2Z"
        fill="currentColor" opacity="0.3"/>
      <path d="M14 2V7H19" stroke="currentColor" stroke-width="1.5" fill="none"/>
    </svg>
  `,

  /**
   * Downloads icon
   */
  download: `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 3V15M12 15L8 11M12 15L16 11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M3 15V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `,

  /**
   * Picture/Image icon
   */
  picture: `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="18" height="18" rx="2" fill="currentColor" opacity="0.3"/>
      <circle cx="8.5" cy="8.5" r="2" fill="currentColor" opacity="0.6"/>
      <path d="M3 15L8 10L13 15L18 10L21 13" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `,

  /**
   * Music icon
   */
  music: `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 18V5L20 3V16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="6" cy="18" r="3" fill="currentColor" opacity="0.3"/>
      <circle cx="17" cy="16" r="3" fill="currentColor" opacity="0.3"/>
    </svg>
  `,

  /**
   * Safari - Compass icon
   */
  safari: `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="safariGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#6FB8FF;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#0088FF;stop-opacity:1" />
        </linearGradient>
      </defs>
      <!-- Outer circle -->
      <circle cx="32" cy="32" r="24" fill="url(#safariGradient)" stroke="#0066CC" stroke-width="2"/>
      <!-- Inner circle -->
      <circle cx="32" cy="32" r="18" fill="white" opacity="0.2" stroke="#0066CC" stroke-width="1"/>
      <!-- Compass needle -->
      <path d="M32 16L28 32L32 48L36 32Z" fill="#FF3B30" stroke="#CC0000" stroke-width="1.5"/>
      <path d="M32 16L36 32L32 48L28 32Z" fill="white" stroke="#0066CC" stroke-width="1.5"/>
      <!-- Center dot -->
      <circle cx="32" cy="32" r="3" fill="#333"/>
      <!-- Cardinal points -->
      <circle cx="32" cy="12" r="1.5" fill="white"/>
      <circle cx="32" cy="52" r="1.5" fill="white"/>
      <circle cx="12" cy="32" r="1.5" fill="white"/>
      <circle cx="52" cy="32" r="1.5" fill="white"/>
    </svg>
  `,

  /**
   * Preview - Image/Eye icon
   */
  preview: `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="previewGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#A855F7;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#7C3AED;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect x="10" y="16" width="44" height="32" rx="4" fill="url(#previewGradient)" stroke="#6D28D9" stroke-width="2"/>
      <circle cx="20" cy="26" r="3" fill="white" opacity="0.8"/>
      <path d="M10 38L20 28L30 38L44 24L54 34V44C54 46.2091 52.2091 48 50 48H14C11.7909 48 10 46.2091 10 44V38Z" fill="white" opacity="0.3"/>
    </svg>
  `,

  /**
   * CodeEdit - Code brackets icon
   */
  codeedit: `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="codeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#34D399;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#10B981;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect x="12" y="12" width="40" height="40" rx="4" fill="url(#codeGradient)" stroke="#059669" stroke-width="2"/>
      <!-- Code symbols -->
      <path d="M22 26L18 32L22 38" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M42 26L46 32L42 38" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      <line x1="34" y1="24" x2="30" y2="40" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
    </svg>
  `,

  /**
   * Help icon
   */
  help: `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2" fill="none"/>
      <path d="M12 17V16.5C12 15.5 13 15 13.5 14C14 13 15 12.5 15 11C15 9.34315 13.6569 8 12 8C10.3431 8 9 9.34315 9 11" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <circle cx="12" cy="19" r="0.5" fill="currentColor"/>
    </svg>
  `,

  /**
   * Search/Magnifying glass icon
   */
  search: `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="10" r="7" stroke="currentColor" stroke-width="2" fill="none"/>
      <path d="M15 15L21 21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `,

  /**
   * Bell/Notifications icon
   */
  bell: `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      <path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `,

  /**
   * Checkmark/Success icon
   */
  checkmark: `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `,

  /**
   * X/Close/Error icon
   */
  xmark: `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `,

  /**
   * Warning/Alert icon
   */
  warning: `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L2 20H22L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      <path d="M12 9V13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <circle cx="12" cy="17" r="0.5" fill="currentColor" stroke="currentColor"/>
    </svg>
  `,

  /**
   * Info icon
   */
  info: `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2" fill="none"/>
      <path d="M12 16V12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <circle cx="12" cy="8" r="0.5" fill="currentColor" stroke="currentColor"/>
    </svg>
  `,

  /**
   * Trash/Delete icon
   */
  trash: `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 6H5H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `,

  /**
   * Play icon
   */
  play: `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 3L19 12L5 21V3Z" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `,

  /**
   * Stop icon
   */
  stop: `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor" stroke="currentColor" stroke-width="2"/>
    </svg>
  `,

  /**
   * Pin icon
   */
  pin: `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 3V7C16 8 17 9 18 9H19C19.5304 9 20.0391 9.21071 20.4142 9.58579C20.7893 9.96086 21 10.4696 21 11V11C21 11.5304 20.7893 12.0391 20.4142 12.4142C20.0391 12.7893 19.5304 13 19 13H5C4.46957 13 3.96086 12.7893 3.58579 12.4142C3.21071 12.0391 3 11.5304 3 11V11C3 10.4696 3.21071 9.96086 3.58579 9.58579C3.96086 9.21071 4.46957 9 5 9H6C7 9 8 8 8 7V3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M12 13V21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `,

  /**
   * Folder icon (simple)
   */
  folder: `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 7C3 5.89543 3.89543 5 5 5H9L11 7H19C20.1046 7 21 7.89543 21 9V17C21 18.1046 20.1046 19 19 19H5C3.89543 19 3 18.1046 3 17V7Z" fill="currentColor" opacity="0.3" stroke="currentColor" stroke-width="2"/>
    </svg>
  `,

  /**
   * Save/Disk icon
   */
  save: `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3H16L21 8V19C21 20.1046 20.1046 21 19 21Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      <path d="M17 21V13H7V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M7 3V8H15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `,

  /**
   * Gear/Settings icon (simple)
   */
  gear: `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" fill="none"/>
      <path d="M12 1V4M12 20V23M4.22 4.22L6.34 6.34M17.66 17.66L19.78 19.78M1 12H4M20 12H23M4.22 19.78L6.34 17.66M17.66 6.34L19.78 4.22" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `,

  /**
   * Globe/Web icon
   */
  globe: `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2" fill="none"/>
      <path d="M2 12H22M12 2C14.5 4.5 16 8 16 12C16 16 14.5 19.5 12 22M12 2C9.5 4.5 8 8 8 12C8 16 9.5 19.5 12 22" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `,

  /**
   * Dice/Random icon
   */
  dice: `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" stroke-width="2" fill="none"/>
      <circle cx="7" cy="7" r="1.5" fill="currentColor"/>
      <circle cx="17" cy="7" r="1.5" fill="currentColor"/>
      <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
      <circle cx="7" cy="17" r="1.5" fill="currentColor"/>
      <circle cx="17" cy="17" r="1.5" fill="currentColor"/>
    </svg>
  `,

  /**
   * Video/Film icon
   */
  video: `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="6" width="20" height="12" rx="2" stroke="currentColor" stroke-width="2" fill="none"/>
      <circle cx="6" cy="10" r="1" fill="currentColor"/>
      <circle cx="6" cy="14" r="1" fill="currentColor"/>
      <circle cx="18" cy="10" r="1" fill="currentColor"/>
      <circle cx="18" cy="14" r="1" fill="currentColor"/>
    </svg>
  `,

  /**
   * Palette/Color icon
   */
  palette: `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C13.66 22 15 20.66 15 19V18.5C15 17.95 15.45 17.5 16 17.5H18C20.21 17.5 22 15.71 22 13.5C22 7.14 17.52 2 12 2Z" stroke="currentColor" stroke-width="2" fill="none"/>
      <circle cx="7" cy="10" r="1.5" fill="currentColor"/>
      <circle cx="11" cy="7" r="1.5" fill="currentColor"/>
      <circle cx="16" cy="10" r="1.5" fill="currentColor"/>
      <circle cx="10" cy="14" r="1.5" fill="currentColor"/>
    </svg>
  `,

  /**
   * Chart/Stats icon
   */
  chart: `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 3V21H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M7 16L12 11L16 15L21 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `,

  /**
   * Package/Box icon
   */
  package: `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 7L12 3L4 7M20 7L12 11M20 7V17L12 21M12 11L4 7M12 11V21M4 7V17L12 21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `,

  /**
   * New file/Plus icon
   */
  plus: `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `,

  /**
   * Get icon HTML
   */
  get(iconName) {
    return this[iconName] || this.finder;
  }
};
