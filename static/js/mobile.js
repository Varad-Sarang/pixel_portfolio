// 📱 Mobile Optimization for Pixel Portfolio
class MobilePortfolio {
    constructor() {
        this.isMobile = window.innerWidth <= 768;
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.touchEndX = 0;
        this.touchEndY = 0;
        this.isDragging = false;
        this.activeElement = null;
        this.longPressTimer = null;
        this.vibrationEnabled = 'vibrate' in navigator;
        
        this.init();
    }
    
    init() {
        if (!this.isMobile) return;
        
        this.setupMobileMeta();
        this.setupTouchEvents();
        this.setupMobileGestures();
        this.setupMobileOptimizations();
        this.setupMobileUI();
        this.setupMobileAccessibility();
        
        console.log('📱 Mobile optimization initialized');
    }
    
    setupMobileMeta() {
        // Add mobile-specific meta tags
        const viewport = document.querySelector('meta[name="viewport"]');
        if (!viewport) {
            const meta = document.createElement('meta');
            meta.name = 'viewport';
            meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';
            document.head.appendChild(meta);
        }
        
        // Add mobile theme color
        const themeColor = document.querySelector('meta[name="theme-color"]');
        if (!themeColor) {
            const meta = document.createElement('meta');
            meta.name = 'theme-color';
            meta.content = '#007AFF';
            document.head.appendChild(meta);
        }
        
        // Add mobile manifest
        const manifest = document.querySelector('link[rel="manifest"]');
        if (!manifest) {
            const link = document.createElement('link');
            link.rel = 'manifest';
            link.href = '/static/manifest.json';
            document.head.appendChild(link);
        }
    }
    
    setupTouchEvents() {
        // Touch start event
        document.addEventListener('touchstart', (e) => {
            this.touchStartX = e.touches[0].clientX;
            this.touchStartY = e.touches[0].clientY;
            this.activeElement = e.target;
            
            // Add touch feedback
            this.addTouchFeedback(e.target);
            
            // Start long press timer
            this.startLongPressTimer(e.target);
        }, { passive: true });
        
        // Touch move event
        document.addEventListener('touchmove', (e) => {
            if (this.isDragging) {
                e.preventDefault();
            }
            
            // Update touch feedback
            this.updateTouchFeedback(e.target);
        }, { passive: false });
        
        // Touch end event
        document.addEventListener('touchend', (e) => {
            this.touchEndX = e.changedTouches[0].clientX;
            this.touchEndY = e.changedTouches[0].clientY;
            
            // Clear long press timer
            this.clearLongPressTimer();
            
            // Remove touch feedback
            this.removeTouchFeedback();
            
            // Handle swipe gestures
            this.handleSwipeGesture();
            
            // Handle tap
            this.handleTap(e.target);
        }, { passive: true });
        
        // Touch cancel event
        document.addEventListener('touchcancel', () => {
            this.clearLongPressTimer();
            this.removeTouchFeedback();
        }, { passive: true });
    }
    
    setupMobileGestures() {
        // Swipe detection
        this.minSwipeDistance = 50;
        
        // Pull to refresh
        let startY = 0;
        let currentY = 0;
        let pullDistance = 0;
        
        document.addEventListener('touchstart', (e) => {
            if (window.scrollY === 0) {
                startY = e.touches[0].clientY;
            }
        }, { passive: true });
        
        document.addEventListener('touchmove', (e) => {
            if (window.scrollY === 0 && startY > 0) {
                currentY = e.touches[0].clientY;
                pullDistance = currentY - startY;
                
                if (pullDistance > 0) {
                    this.showPullToRefresh(pullDistance);
                }
            }
        }, { passive: true });
        
        document.addEventListener('touchend', () => {
            if (pullDistance > 100) {
                this.triggerPullToRefresh();
            }
            this.hidePullToRefresh();
            startY = 0;
            pullDistance = 0;
        }, { passive: true });
    }
    
    setupMobileOptimizations() {
        // Disable zoom on double tap
        let lastTouchEnd = 0;
        document.addEventListener('touchend', (e) => {
            const now = Date.now();
            if (now - lastTouchEnd <= 300) {
                e.preventDefault();
            }
            lastTouchEnd = now;
        }, { passive: false });
        
        // Optimize scrolling
        document.addEventListener('scroll', () => {
            this.throttle(() => {
                this.updateScrollIndicators();
            }, 16);
        }, { passive: true });
        
        // Handle orientation change
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.handleOrientationChange();
            }, 100);
        });
        
        // Handle resize
        window.addEventListener('resize', () => {
            this.throttle(() => {
                this.handleResize();
            }, 100);
        });
    }
    
    setupMobileUI() {
        // Add mobile status bar
        this.createMobileStatusBar();
        
        // Add mobile home indicator
        this.createMobileHomeIndicator();
        
        // Add mobile scroll indicators
        this.createMobileScrollIndicators();
        
        // Add mobile context menu
        this.createMobileContextMenu();
        
        // Add mobile floating action button
        this.createMobileFAB();
    }
    
    setupMobileAccessibility() {
        // Add mobile-specific ARIA labels
        this.addMobileAriaLabels();
        
        // Setup mobile focus management
        this.setupMobileFocusManagement();
        
        // Setup mobile screen reader support
        this.setupMobileScreenReader();
    }
    
    // Touch feedback methods
    addTouchFeedback(element) {
        if (!element) return;
        
        const feedback = document.createElement('div');
        feedback.className = 'mobile-touch-feedback';
        element.style.position = 'relative';
        element.appendChild(feedback);
        
        setTimeout(() => feedback.classList.add('active'), 10);
    }
    
    updateTouchFeedback(element) {
        const feedback = element?.querySelector('.mobile-touch-feedback');
        if (feedback) {
            feedback.classList.add('active');
        }
    }
    
    removeTouchFeedback() {
        const feedbacks = document.querySelectorAll('.mobile-touch-feedback');
        feedbacks.forEach(feedback => {
            feedback.classList.remove('active');
            setTimeout(() => feedback.remove(), 100);
        });
    }
    
    // Long press methods
    startLongPressTimer(element) {
        this.longPressTimer = setTimeout(() => {
            this.handleLongPress(element);
        }, 500);
    }
    
    clearLongPressTimer() {
        if (this.longPressTimer) {
            clearTimeout(this.longPressTimer);
            this.longPressTimer = null;
        }
    }
    
    handleLongPress(element) {
        this.vibrate(50);
        this.showMobileContextMenu(element);
    }
    
    // Gesture methods
    handleSwipeGesture() {
        const deltaX = this.touchEndX - this.touchStartX;
        const deltaY = this.touchEndY - this.touchStartY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        if (distance < this.minSwipeDistance) return;
        
        const angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;
        
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            // Horizontal swipe
            if (deltaX > 0) {
                this.handleSwipeRight();
            } else {
                this.handleSwipeLeft();
            }
        } else {
            // Vertical swipe
            if (deltaY > 0) {
                this.handleSwipeDown();
            } else {
                this.handleSwipeUp();
            }
        }
    }
    
    handleSwipeLeft() {
        this.vibrate(25);
        this.showNotification('← Swipe Left', 'info');
    }
    
    handleSwipeRight() {
        this.vibrate(25);
        this.showNotification('→ Swipe Right', 'info');
    }
    
    handleSwipeUp() {
        this.vibrate(25);
        this.showNotification('↑ Swipe Up', 'info');
    }
    
    handleSwipeDown() {
        this.vibrate(25);
        this.showNotification('↓ Swipe Down', 'info');
    }
    
    // Tap handling
    handleTap(element) {
        if (!element) return;
        
        // Handle desktop icon taps
        if (element.closest('.desktop-icon')) {
            this.vibrate(25);
            this.handleDesktopIconTap(element.closest('.desktop-icon'));
        }
        
        // Handle button taps
        if (element.closest('.btn')) {
            this.vibrate(25);
        }
        
        // Handle window control taps
        if (element.closest('.window-control')) {
            this.vibrate(25);
        }
    }
    
    handleDesktopIconTap(icon) {
        const windowType = icon.dataset.window;
        if (windowType && window.openWindow) {
            window.openWindow(windowType);
        }
    }
    
    // Pull to refresh methods
    showPullToRefresh(distance) {
        let indicator = document.querySelector('.mobile-pull-indicator');
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.className = 'mobile-pull-indicator';
            indicator.innerHTML = `
                <div class="pull-icon">⬇️</div>
                <div class="pull-text">Pull to refresh</div>
            `;
            document.body.appendChild(indicator);
        }
        
        const progress = Math.min(distance / 100, 1);
        indicator.style.transform = `translateY(${distance}px)`;
        indicator.style.opacity = progress;
        
        if (distance > 100) {
            indicator.querySelector('.pull-text').textContent = 'Release to refresh';
            indicator.querySelector('.pull-icon').textContent = '⬆️';
        }
    }
    
    hidePullToRefresh() {
        const indicator = document.querySelector('.mobile-pull-indicator');
        if (indicator) {
            indicator.style.transform = 'translateY(-100px)';
            indicator.style.opacity = '0';
            setTimeout(() => indicator.remove(), 300);
        }
    }
    
    triggerPullToRefresh() {
        this.showNotification('🔄 Refreshing...', 'info');
        setTimeout(() => {
            location.reload();
        }, 1000);
    }
    
    // Mobile UI creation methods
    createMobileStatusBar() {
        const statusBar = document.createElement('div');
        statusBar.className = 'mobile-status-bar';
        statusBar.innerHTML = `
            <div class="status-time">${new Date().toLocaleTimeString()}</div>
            <div class="status-icons">
                <span class="status-signal">📶</span>
                <span class="status-wifi">📶</span>
                <span class="status-battery">🔋</span>
            </div>
        `;
        document.body.appendChild(statusBar);
        
        // Update time
        setInterval(() => {
            statusBar.querySelector('.status-time').textContent = 
                new Date().toLocaleTimeString();
        }, 1000);
    }
    
    createMobileHomeIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'mobile-home-indicator';
        document.body.appendChild(indicator);
    }
    
    createMobileScrollIndicators() {
        const containers = document.querySelectorAll('.window-content, .start-menu');
        containers.forEach(container => {
            const indicator = document.createElement('div');
            indicator.className = 'mobile-scroll-indicator';
            container.appendChild(indicator);
        });
    }
    
    createMobileContextMenu() {
        const contextMenu = document.createElement('div');
        contextMenu.className = 'mobile-context-menu';
        contextMenu.style.display = 'none';
        contextMenu.innerHTML = `
            <div class="context-menu-item" data-action="open">📂 Open</div>
            <div class="context-menu-item" data-action="copy">📋 Copy</div>
            <div class="context-menu-item" data-action="share">📤 Share</div>
            <div class="context-menu-item" data-action="delete">🗑️ Delete</div>
        `;
        document.body.appendChild(contextMenu);
        
        // Handle context menu actions
        contextMenu.addEventListener('click', (e) => {
            const action = e.target.dataset.action;
            if (action) {
                this.handleContextMenuAction(action);
                this.hideMobileContextMenu();
            }
        });
    }
    
    createMobileFAB() {
        const fab = document.createElement('button');
        fab.className = 'mobile-fab';
        fab.innerHTML = '➕';
        fab.title = 'Quick Actions';
        fab.style.cssText = `
            position: fixed;
            bottom: 80px;
            right: 20px;
            width: 56px;
            height: 56px;
            border-radius: 50%;
            background: var(--ios-primary);
            color: white;
            border: none;
            font-size: 24px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 1000;
            cursor: pointer;
            transition: all 0.2s ease;
        `;
        
        fab.addEventListener('click', () => {
            this.showMobileQuickActions();
        });
        
        fab.addEventListener('touchstart', () => {
            fab.style.transform = 'scale(0.95)';
        });
        
        fab.addEventListener('touchend', () => {
            fab.style.transform = 'scale(1)';
        });
        
        document.body.appendChild(fab);
    }
    
    // Mobile UI interaction methods
    showMobileContextMenu(element) {
        const contextMenu = document.querySelector('.mobile-context-menu');
        if (!contextMenu) return;
        
        const rect = element.getBoundingClientRect();
        contextMenu.style.left = `${rect.left}px`;
        contextMenu.style.top = `${rect.bottom + 10}px`;
        contextMenu.style.display = 'block';
        
        // Hide on outside click
        setTimeout(() => {
            document.addEventListener('click', () => {
                this.hideMobileContextMenu();
            }, { once: true });
        }, 100);
    }
    
    hideMobileContextMenu() {
        const contextMenu = document.querySelector('.mobile-context-menu');
        if (contextMenu) {
            contextMenu.style.display = 'none';
        }
    }
    
    handleContextMenuAction(action) {
        switch (action) {
            case 'open':
                this.showNotification('📂 Opening...', 'info');
                break;
            case 'copy':
                this.showNotification('📋 Copied to clipboard', 'success');
                break;
            case 'share':
                this.showNotification('📤 Sharing...', 'info');
                break;
            case 'delete':
                this.showNotification('🗑️ Deleted', 'info');
                break;
        }
    }
    
    showMobileQuickActions() {
        const actions = [
            { icon: '🏠', label: 'Home', action: () => this.goHome() },
            { icon: '👤', label: 'Profile', action: () => this.openProfile() },
            { icon: '🎮', label: 'Projects', action: () => this.openProjects() },
            { icon: '📧', label: 'Contact', action: () => this.openContact() },
            { icon: '⚙️', label: 'Settings', action: () => this.openSettings() }
        ];
        
        const modal = document.createElement('div');
        modal.className = 'mobile-quick-actions';
        modal.innerHTML = `
            <div class="quick-actions-content">
                <div class="quick-actions-header">
                    <h3>Quick Actions</h3>
                    <button class="close-btn">×</button>
                </div>
                <div class="quick-actions-grid">
                    ${actions.map(action => `
                        <button class="quick-action-btn" data-action="${action.label.toLowerCase()}">
                            <span class="action-icon">${action.icon}</span>
                            <span class="action-label">${action.label}</span>
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
        
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;
        
        const content = modal.querySelector('.quick-actions-content');
        content.style.cssText = `
            background: var(--ios-card);
            border-radius: var(--mobile-border-radius);
            padding: 24px;
            max-width: 90vw;
            max-height: 80vh;
            overflow-y: auto;
        `;
        
        document.body.appendChild(modal);
        
        // Handle actions
        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target.classList.contains('close-btn')) {
                modal.remove();
            }
            
            const actionBtn = e.target.closest('.quick-action-btn');
            if (actionBtn) {
                const action = actionBtn.dataset.action;
                const actionObj = actions.find(a => a.label.toLowerCase() === action);
                if (actionObj) {
                    actionObj.action();
                    modal.remove();
                }
            }
        });
    }
    
    // Navigation methods
    goHome() {
        this.showNotification('🏠 Going home...', 'info');
        // Implement home navigation
    }
    
    openProfile() {
        this.showNotification('👤 Opening profile...', 'info');
        if (window.openWindow) {
            window.openWindow('about');
        }
    }
    
    openProjects() {
        this.showNotification('🎮 Opening projects...', 'info');
        if (window.openWindow) {
            window.openWindow('projects');
        }
    }
    
    openContact() {
        this.showNotification('📧 Opening contact...', 'info');
        if (window.openWindow) {
            window.openWindow('contact');
        }
    }
    
    openSettings() {
        this.showNotification('⚙️ Opening settings...', 'info');
        if (window.openWindow) {
            window.openWindow('settings');
        }
    }
    
    // Utility methods
    vibrate(duration) {
        if (this.vibrationEnabled) {
            navigator.vibrate(duration);
        }
    }
    
    showNotification(message, type = 'info') {
        if (window.showNotification) {
            window.showNotification(message, type);
        } else {
            console.log(`[${type.toUpperCase()}] ${message}`);
        }
    }
    
    throttle(func, delay) {
        let timeoutId;
        return function (...args) {
            if (timeoutId) return;
            timeoutId = setTimeout(() => {
                func.apply(this, args);
                timeoutId = null;
            }, delay);
        };
    }
    
    updateScrollIndicators() {
        const containers = document.querySelectorAll('.window-content, .start-menu');
        containers.forEach(container => {
            const indicator = container.querySelector('.mobile-scroll-indicator');
            if (indicator) {
                const isScrollable = container.scrollHeight > container.clientHeight;
                const isAtBottom = container.scrollTop + container.clientHeight >= container.scrollHeight;
                
                indicator.style.opacity = isScrollable && !isAtBottom ? '0.6' : '0';
            }
        });
    }
    
    handleOrientationChange() {
        this.showNotification('📱 Orientation changed', 'info');
        // Recalculate layouts
        setTimeout(() => {
            this.updateScrollIndicators();
        }, 300);
    }
    
    handleResize() {
        // Handle resize events
        this.updateScrollIndicators();
    }
    
    addMobileAriaLabels() {
        // Add ARIA labels for mobile accessibility
        const icons = document.querySelectorAll('.desktop-icon');
        icons.forEach(icon => {
            const label = icon.querySelector('span')?.textContent || 'Icon';
            icon.setAttribute('aria-label', label);
            icon.setAttribute('role', 'button');
        });
        
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(button => {
            if (!button.getAttribute('aria-label')) {
                button.setAttribute('aria-label', button.textContent.trim());
            }
        });
    }
    
    setupMobileFocusManagement() {
        // Handle focus for mobile accessibility
        document.addEventListener('focusin', (e) => {
            if (e.target.classList.contains('mobile-focus-visible')) {
                e.target.classList.add('focused');
            }
        });
        
        document.addEventListener('focusout', (e) => {
            if (e.target.classList.contains('mobile-focus-visible')) {
                e.target.classList.remove('focused');
            }
        });
    }
    
    setupMobileScreenReader() {
        // Add screen reader announcements
        const announce = (message) => {
            const announcement = document.createElement('div');
            announcement.setAttribute('aria-live', 'polite');
            announcement.setAttribute('aria-atomic', 'true');
            announcement.style.position = 'absolute';
            announcement.style.left = '-10000px';
            announcement.style.width = '1px';
            announcement.style.height = '1px';
            announcement.style.overflow = 'hidden';
            announcement.textContent = message;
            document.body.appendChild(announcement);
            
            setTimeout(() => announcement.remove(), 1000);
        };
        
        // Announce important actions
        window.mobileAnnounce = announce;
    }
}

// Initialize mobile optimization when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.mobilePortfolio = new MobilePortfolio();
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MobilePortfolio;
}
