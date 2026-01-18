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
   * Get icon HTML
   */
  get(iconName) {
    return this[iconName] || this.finder;
  }
};
