class Island {
    constructor() {
        this.container = document.getElementById('nova-island-container');
        this.islandNode = document.getElementById('nova-island');
        this.appNameEl = document.getElementById('island-app-name');
        
        // Listen to app focus changes
        document.body.addEventListener('mousedown', (e) => {
            const winEl = e.target.closest('.nova-window');
            if (winEl) {
                const appId = winEl.dataset.appId;
                if (appId) {
                    const app = Apps.get(appId);
                    if (app) this.setAppName(app.name);
                }
            } else if (!e.target.closest('#nova-island') && !e.target.closest('#nova-shelf')) {
                // Clicked on desktop background
                this.setAppName('Nova');
            }
        });

        this.muteBtn = document.getElementById('btn-mute');
        if (this.muteBtn) {
            this.muteBtn.onclick = () => {
                const isMuted = AudioMng.toggleMute();
                if (isMuted) {
                    this.muteBtn.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>';
                } else {
                    this.muteBtn.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>';
                }
            };
        }
    }

    setAppName(name) {
        if (this.appNameEl.textContent !== name) {
            // Quick animation
            this.appNameEl.style.opacity = '0';
            this.appNameEl.style.transform = 'translateY(-5px)';
            setTimeout(() => {
                this.appNameEl.textContent = name;
                this.appNameEl.style.transform = 'translateY(5px)';
                requestAnimationFrame(() => {
                    this.appNameEl.style.transition = 'all 0.2s var(--curve-spring)';
                    this.appNameEl.style.opacity = '1';
                    this.appNameEl.style.transform = 'translateY(0)';
                });
            }, 100);
        }
    }
}
// Will be instantiated in main.js
