class ScoreManager {
    constructor() {
        this.storageKey = 'nova_scores';
        this.load();
    }

    load() {
        try {
            const data = localStorage.getItem(this.storageKey);
            this.scores = data ? JSON.parse(data) : {};
        } catch(e) {
            this.scores = {};
        }
    }

    save() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.scores));
    }

    addScore(gameId, initials, score) {
        if (!this.scores[gameId]) this.scores[gameId] = [];
        this.scores[gameId].push({ 
            initials: (initials || '???').toUpperCase().substring(0,3), 
            score: score, 
            date: Date.now() 
        });
        this.scores[gameId].sort((a, b) => b.score - a.score);
        this.scores[gameId] = this.scores[gameId].slice(0, 10); // Top 10 max
        this.save();
    }

    getTopScores(gameId) {
        return this.scores[gameId] || [];
    }

    showScorePrompt(gameId, score, isWin, onComplete) {
        const winId = 'score-' + Date.now();
        const html = `
            <div style="padding: 24px; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; text-align: center; background: var(--surface-base);">
                <h2 style="color: ${isWin ? 'var(--accent-tertiary)' : 'var(--accent-secondary)'}; margin-bottom: 8px;">
                    ${isWin ? 'Board Cleared!' : 'Game Over'}
                </h2>
                <div style="font-size: 48px; font-weight: 300; margin-bottom: 24px; color: var(--text-primary);">${score}</div>
                <div style="margin-bottom: 16px; font-size: 14px; color: var(--text-secondary);">Enter 3 initials for the leaderboard:</div>
                <input type="text" id="initials-${winId}" maxlength="3" style="width: 100px; text-align: center; font-size: 24px; letter-spacing: 4px; text-transform: uppercase; background: rgba(128,128,128,0.1); border: 1px solid var(--border-glass-strong); color: var(--text-primary); padding: 8px; border-radius: 8px; margin-bottom: 24px; outline: none; box-shadow: var(--shadow-inset);">
                <button id="save-btn-${winId}" style="background: var(--accent-primary); color: #fff; border: none; padding: 12px 24px; border-radius: 8px; font-size: 16px; cursor: pointer; transition: all 0.2s; font-weight: 500;">Save Score</button>
            </div>
            <style>
                #save-btn-${winId}:hover { filter: brightness(1.1); transform: translateY(-1px); }
                #save-btn-${winId}:active { transform: translateY(1px); }
                #initials-${winId}:focus { border-color: var(--accent-primary); box-shadow: 0 0 0 2px var(--accent-glow); }
            </style>
        `;
        
        WindowManager.create({
            id: winId,
            appId: 'scores', // Virtual app
            title: 'High Score Entry',
            width: 340,
            height: 400,
            content: html
        });

        const btn = document.getElementById(`save-btn-${winId}`);
        const input = document.getElementById(`initials-${winId}`);
        if(input) {
            input.focus();
            input.addEventListener('keyup', (e) => {
                if (e.key === 'Enter') btn.click();
            });
        }

        btn.onclick = () => {
            const initials = input.value || '???';
            this.addScore(gameId, initials, score);
            WindowManager.close(winId);
            if (onComplete) onComplete();
        };
    }

    showLeaderboard(gameName, gameId) {
        const winId = 'leaderboard-' + gameId + '-' + Date.now();
        const scores = this.getTopScores(gameId);
        
        let listHtml = '';
        if(scores.length === 0) {
            listHtml = '<div style="color: var(--text-secondary); text-align: center; padding: 20px;">No scores yet!</div>';
        } else {
            scores.forEach((s, i) => {
                listHtml += `
                    <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid var(--border-glass);">
                        <span style="font-weight: 600; color: var(--text-secondary); width: 30px;">#${i+1}</span>
                        <span style="font-weight: bold; color: var(--text-primary); flex: 1; text-align: left;">${s.initials}</span>
                        <span style="color: var(--accent-primary); font-variant-numeric: tabular-nums;">${s.score}</span>
                    </div>
                `;
            });
        }

        const html = `
            <div style="padding: 24px; display: flex; flex-direction: column; height: 100%; background: var(--surface-base);">
                <h3 style="color: var(--text-primary); margin-bottom: 16px; text-align: center;">${gameName} Leaderboard</h3>
                <div style="flex: 1; overflow-y: auto; padding-right: 8px;">
                    ${listHtml}
                </div>
                <button id="lb-close-${winId}" style="margin-top: 16px; background: rgba(128,128,128,0.1); color: var(--text-primary); border: 1px solid var(--border-glass); padding: 8px 16px; border-radius: 8px; cursor: pointer; transition: background 0.2s;">Close</button>
            </div>
            <style>
                #lb-close-${winId}:hover { background: rgba(128,128,128,0.2); }
            </style>
        `;

        WindowManager.create({
            id: winId,
            appId: 'scores',
            title: 'Scores',
            width: 300,
            height: 400,
            content: html
        });

        document.getElementById(`lb-close-${winId}`).onclick = () => {
            WindowManager.close(winId);
        };
    }
}

window.Scores = new ScoreManager();
