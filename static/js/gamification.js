// 🎮 Pixel Portfolio Gamification System
class PixelPortfolioGame {
    constructor() {
        this.player = {
            name: 'Developer',
            level: 1,
            xp: 0,
            xpToNextLevel: 100,
            achievements: [],
            stats: {
                pagesVisited: 0,
                projectsViewed: 0,
                skillsLearned: 0,
                timeSpent: 0
            }
        };
        
        this.achievements = [
            {
                id: 'first_visit',
                name: 'First Steps',
                description: 'Welcome to Pixel Portfolio!',
                icon: '🎯',
                xp: 10,
                unlocked: false
            },
            {
                id: 'profile_explorer',
                name: 'Profile Explorer',
                description: 'Viewed your player profile',
                icon: '👤',
                xp: 25,
                unlocked: false
            },
            {
                id: 'quest_master',
                name: 'Quest Master',
                description: 'Viewed all projects in quest log',
                icon: '⚔️',
                xp: 50,
                unlocked: false
            },
            {
                id: 'skill_collector',
                name: 'Skill Collector',
                description: 'Discovered all your skills',
                icon: '🎨',
                xp: 30,
                unlocked: false
            },
            {
                id: 'contact_initiator',
                name: 'Contact Initiator',
                description: 'Reached out through contact form',
                icon: '📧',
                xp: 20,
                unlocked: false
            },
            {
                id: 'speed_runner',
                name: 'Speed Runner',
                description: 'Visited all pages in under 2 minutes',
                icon: '🏃',
                xp: 100,
                unlocked: false
            },
            {
                id: 'easter_egg_hunter',
                name: 'Easter Egg Hunter',
                description: 'Found the Konami code secret',
                icon: '🥚',
                xp: 75,
                unlocked: false
            },
            {
                id: 'theme_changer',
                name: 'Theme Changer',
                description: 'Switched between light and dark themes',
                icon: '🎨',
                xp: 15,
                unlocked: false
            }
        ];
        
        this.init();
    }
    
    init() {
        this.loadGameState();
        this.setupEventListeners();
        this.checkInitialAchievements();
        this.startSessionTimer();
        this.createGameUI();
    }
    
    loadGameState() {
        const saved = localStorage.getItem('pixelPortfolioGame');
        if (saved) {
            const savedState = JSON.parse(saved);
            this.player = { ...this.player, ...savedState.player };
            this.achievements = savedState.achievements;
        }
    }
    
    saveGameState() {
        const gameState = {
            player: this.player,
            achievements: this.achievements
        };
        localStorage.setItem('pixelPortfolioGame', JSON.stringify(gameState));
    }
    
    setupEventListeners() {
        // Track page visits
        document.addEventListener('DOMContentLoaded', () => {
            this.recordPageVisit();
        });
        
        // Track project views
        document.addEventListener('click', (e) => {
            if (e.target.closest('.quest-card')) {
                this.recordProjectView();
            }
        });
        
        // Track theme changes
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.checkAchievement('theme_changer');
            });
        }
        
        // Track contact form submissions
        const contactForm = document.querySelector('form');
        if (contactForm) {
            contactForm.addEventListener('submit', () => {
                this.checkAchievement('contact_initiator');
            });
        }
    }
    
    recordPageVisit() {
        this.player.stats.pagesVisited++;
        this.checkAchievement('first_visit');
        this.saveGameState();
    }
    
    recordProjectView() {
        this.player.stats.projectsViewed++;
        if (this.player.stats.projectsViewed >= 4) {
            this.checkAchievement('quest_master');
        }
        this.saveGameState();
    }
    
    checkAchievement(achievementId) {
        const achievement = this.achievements.find(a => a.id === achievementId);
        if (achievement && !achievement.unlocked) {
            achievement.unlocked = true;
            this.player.xp += achievement.xp;
            this.showAchievementUnlocked(achievement);
            this.checkLevelUp();
            this.saveGameState();
        }
    }
    
    checkInitialAchievements() {
        // Check for profile page visit
        if (window.location.pathname.includes('/about/')) {
            this.checkAchievement('profile_explorer');
        }
        
        // Check for projects page visit
        if (window.location.pathname.includes('/projects/')) {
            this.recordProjectView();
        }
        
        // Check for contact page visit
        if (window.location.pathname.includes('/contact/')) {
            this.player.stats.pagesVisited++;
        }
    }
    
    startSessionTimer() {
        this.sessionStartTime = Date.now();
        setInterval(() => {
            this.player.stats.timeSpent += 1;
            this.saveGameState();
        }, 1000);
    }
    
    checkLevelUp() {
        while (this.player.xp >= this.player.xpToNextLevel) {
            this.player.xp -= this.player.xpToNextLevel;
            this.player.level++;
            this.player.xpToNextLevel = Math.floor(this.player.xpToNextLevel * 1.5);
            this.showLevelUp();
        }
    }
    
    showAchievementUnlocked(achievement) {
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-content">
                <div class="achievement-icon">${achievement.icon}</div>
                <div class="achievement-text">
                    <div class="achievement-title">${achievement.name}</div>
                    <div class="achievement-desc">${achievement.description}</div>
                    <div class="achievement-xp">+${achievement.xp} XP</div>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Auto remove
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 500);
        }, 4000);
    }
    
    showLevelUp() {
        const notification = document.createElement('div');
        notification.className = 'level-up-notification';
        notification.innerHTML = `
            <div class="level-up-content">
                <div class="level-up-icon">⭐</div>
                <div class="level-up-text">
                    <div class="level-up-title">LEVEL UP!</div>
                    <div class="level-up-desc">You are now level ${this.player.level}</div>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Auto remove
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    }
    
    createGameUI() {
        // Create XP bar
        const xpBar = document.createElement('div');
        xpBar.className = 'xp-bar';
        xpBar.innerHTML = `
            <div class="xp-info">
                <span class="xp-level">LVL ${this.player.level}</span>
                <span class="xp-text">${this.player.xp}/${this.player.xpToNextLevel} XP</span>
            </div>
            <div class="xp-progress">
                <div class="xp-fill" style="width: ${(this.player.xp / this.player.xpToNextLevel) * 100}%"></div>
            </div>
        `;
        
        // Position XP bar
        xpBar.style.cssText = `
            position: fixed;
            top: 80px;
            left: 20px;
            background: rgba(26, 26, 46, 0.9);
            border: 2px solid var(--pixel-primary);
            padding: 10px;
            border-radius: 5px;
            z-index: 1000;
            min-width: 200px;
            backdrop-filter: blur(10px);
        `;
        
        document.body.appendChild(xpBar);
        
        // Create achievements button
        const achievementsBtn = document.createElement('button');
        achievementsBtn.className = 'achievements-btn pixel-btn';
        achievementsBtn.innerHTML = '🏆';
        achievementsBtn.title = 'View Achievements';
        achievementsBtn.style.cssText = `
            position: fixed;
            top: 140px;
            left: 20px;
            z-index: 1000;
            padding: 10px;
            font-size: 16px;
        `;
        
        achievementsBtn.addEventListener('click', () => this.showAchievements());
        document.body.appendChild(achievementsBtn);
        
        // Update XP bar periodically
        setInterval(() => {
            this.updateXPBar(xpBar);
        }, 1000);
    }
    
    updateXPBar(xpBar) {
        const xpFill = xpBar.querySelector('.xp-fill');
        const xpLevel = xpBar.querySelector('.xp-level');
        const xpText = xpBar.querySelector('.xp-text');
        
        xpFill.style.width = `${(this.player.xp / this.player.xpToNextLevel) * 100}%`;
        xpLevel.textContent = `LVL ${this.player.level}`;
        xpText.textContent = `${this.player.xp}/${this.player.xpToNextLevel} XP`;
    }
    
    showAchievements() {
        const modal = document.createElement('div');
        modal.className = 'achievements-modal';
        modal.innerHTML = `
            <div class="achievements-content">
                <div class="achievements-header">
                    <h2>🏆 ACHIEVEMENTS</h2>
                    <button class="close-btn">×</button>
                </div>
                <div class="achievements-grid">
                    ${this.achievements.map(achievement => `
                        <div class="achievement-item ${achievement.unlocked ? 'unlocked' : 'locked'}">
                            <div class="achievement-icon">${achievement.icon}</div>
                            <div class="achievement-info">
                                <div class="achievement-name">${achievement.name}</div>
                                <div class="achievement-desc">${achievement.description}</div>
                                <div class="achievement-xp">${achievement.xp} XP</div>
                            </div>
                            <div class="achievement-status">
                                ${achievement.unlocked ? '✅' : '🔒'}
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="player-stats">
                    <h3>📊 PLAYER STATS</h3>
                    <div class="stats-grid">
                        <div class="stat-item">
                            <span class="stat-label">Level:</span>
                            <span class="stat-value">${this.player.level}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Total XP:</span>
                            <span class="stat-value">${this.player.xp}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Pages Visited:</span>
                            <span class="stat-value">${this.player.stats.pagesVisited}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Projects Viewed:</span>
                            <span class="stat-value">${this.player.stats.projectsViewed}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Time Spent:</span>
                            <span class="stat-value">${Math.floor(this.player.stats.timeSpent / 60)}m ${this.player.stats.timeSpent % 60}s</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Style the modal
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            backdrop-filter: blur(10px);
        `;
        
        const content = modal.querySelector('.achievements-content');
        content.style.cssText = `
            background: var(--pixel-dark);
            border: 3px solid var(--pixel-primary);
            border-radius: 10px;
            padding: 2rem;
            max-width: 800px;
            max-height: 80vh;
            overflow-y: auto;
            color: var(--pixel-text);
        `;
        
        document.body.appendChild(modal);
        
        // Close button functionality
        const closeBtn = modal.querySelector('.close-btn');
        closeBtn.addEventListener('click', () => modal.remove());
        
        // Close on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
        
        // Add styles for achievements
        this.addAchievementStyles();
    }
    
    addAchievementStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .achievement-notification {
                position: fixed;
                top: 100px;
                right: 20px;
                background: var(--pixel-primary);
                color: var(--pixel-dark);
                padding: 1rem;
                border-radius: 10px;
                transform: translateX(400px);
                transition: transform 0.3s ease;
                z-index: 1002;
                max-width: 300px;
                border: 2px solid var(--pixel-primary);
            }
            
            .achievement-notification.show {
                transform: translateX(0);
            }
            
            .achievement-content {
                display: flex;
                align-items: center;
                gap: 1rem;
            }
            
            .achievement-icon {
                font-size: 2rem;
            }
            
            .achievement-title {
                font-weight: bold;
                margin-bottom: 0.5rem;
            }
            
            .achievement-desc {
                font-size: 0.8rem;
                opacity: 0.8;
            }
            
            .achievement-xp {
                color: var(--pixel-accent);
                font-weight: bold;
                margin-top: 0.5rem;
            }
            
            .level-up-notification {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) scale(0);
                background: var(--pixel-accent);
                color: var(--pixel-dark);
                padding: 2rem;
                border-radius: 15px;
                z-index: 1002;
                border: 3px solid var(--pixel-accent);
                text-align: center;
                transition: transform 0.3s ease;
            }
            
            .level-up-notification.show {
                transform: translate(-50%, -50%) scale(1);
            }
            
            .level-up-icon {
                font-size: 3rem;
                margin-bottom: 1rem;
            }
            
            .level-up-title {
                font-size: 1.5rem;
                font-weight: bold;
                margin-bottom: 0.5rem;
            }
            
            .achievements-modal .achievements-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 2rem;
                border-bottom: 2px solid var(--pixel-primary);
                padding-bottom: 1rem;
            }
            
            .close-btn {
                background: var(--pixel-secondary);
                color: var(--pixel-dark);
                border: none;
                padding: 0.5rem 1rem;
                border-radius: 5px;
                cursor: pointer;
                font-size: 1.5rem;
            }
            
            .achievements-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 1rem;
                margin-bottom: 2rem;
            }
            
            .achievement-item {
                display: flex;
                align-items: center;
                gap: 1rem;
                padding: 1rem;
                border: 2px solid var(--pixel-border);
                border-radius: 8px;
                transition: all 0.3s ease;
            }
            
            .achievement-item.unlocked {
                border-color: var(--pixel-primary);
                background: rgba(0, 255, 136, 0.1);
            }
            
            .achievement-item.locked {
                opacity: 0.5;
            }
            
            .player-stats {
                border-top: 2px solid var(--pixel-primary);
                padding-top: 1rem;
            }
            
            .stats-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 1rem;
                margin-top: 1rem;
            }
            
            .stat-item {
                display: flex;
                justify-content: space-between;
                padding: 0.5rem;
                background: rgba(78, 205, 196, 0.1);
                border-radius: 5px;
            }
            
            .stat-value {
                color: var(--pixel-primary);
                font-weight: bold;
            }
        `;
        
        document.head.appendChild(style);
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.pixelGame = new PixelPortfolioGame();
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PixelPortfolioGame;
}
