// THEME MANAGEMENT - DuniaBercerita

class ThemeManager {
    constructor() {
        this.toggleBtn = document.getElementById('theme-toggle');
        this.body = document.body;
        this.currentTheme = 'light';
        this.init();
    }

    init() {
        this.loadTheme();
        this.bindEvents();
        this.setupSystemPreferenceListener();
    }

    loadTheme() {
        // Cek localStorage untuk tema yang disimpan
        const savedTheme = localStorage.getItem('duniabercerita_theme');
        
        // Cek preferensi sistem
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        // Prioritize saved theme, fallback to system preference, then default to light
        if (savedTheme === 'dark') {
            this.enableDarkMode();
        } else if (savedTheme === 'light') {
            this.enableLightMode();
        } else if (systemPrefersDark) {
            this.enableDarkMode();
        } else {
            this.enableLightMode();
        }
    }

    bindEvents() {
        if (this.toggleBtn) {
            this.toggleBtn.addEventListener('click', () => this.toggleTheme());
        } else {
            console.warn('Theme toggle button not found');
        }
    }

    setupSystemPreferenceListener() {
        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            // Only follow system preference if user hasn't manually set a theme
            if (!localStorage.getItem('duniabercerita_theme')) {
                if (e.matches) {
                    this.enableDarkMode();
                } else {
                    this.enableLightMode();
                }
            }
        });
    }

    toggleTheme() {
        console.log('Toggle theme clicked, current theme:', this.currentTheme);
        
        if (this.currentTheme === 'dark') {
            this.enableLightMode();
        } else {
            this.enableDarkMode();
        }
    }

    enableDarkMode() {
        console.log('Enabling dark mode');
        this.body.classList.add('dark');
        this.body.classList.remove('light');
        this.currentTheme = 'dark';
        localStorage.setItem('duniabercerita_theme', 'dark');
        this.updateToggleButton();
        this.dispatchThemeChangeEvent();
    }

    enableLightMode() {
        console.log('Enabling light mode');
        this.body.classList.add('light');
        this.body.classList.remove('dark');
        this.currentTheme = 'light';
        localStorage.setItem('duniabercerita_theme', 'light');
        this.updateToggleButton();
        this.dispatchThemeChangeEvent();
    }

    updateToggleButton() {
        if (this.toggleBtn) {
            if (this.currentTheme === 'dark') {
                this.toggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
                this.toggleBtn.setAttribute('title', 'Mode Terang');
                this.toggleBtn.setAttribute('aria-label', 'Switch to light mode');
            } else {
                this.toggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
                this.toggleBtn.setAttribute('title', 'Mode Gelap');
                this.toggleBtn.setAttribute('aria-label', 'Switch to dark mode');
            }
        }
    }

    dispatchThemeChangeEvent() {
        const event = new CustomEvent('themeChanged', {
            detail: { 
                theme: this.currentTheme,
                timestamp: new Date()
            }
        });
        document.dispatchEvent(event);
        
        // Also update any charts or components that need theme updates
        this.updateThemeDependentComponents();
    }

    updateThemeDependentComponents() {
        // Update any components that depend on theme
        // For example, charts or visualizations
        const event = new CustomEvent('themeUpdated', {
            detail: { theme: this.currentTheme }
        });
        window.dispatchEvent(event);
    }

    getCurrentTheme() {
        return this.currentTheme;
    }

    // Method to manually set theme from outside
    setTheme(theme) {
        if (theme === 'dark') {
            this.enableDarkMode();
        } else if (theme === 'light') {
            this.enableLightMode();
        } else {
            console.warn('Invalid theme:', theme);
        }
    }

    // Method to check if dark mode is active
    isDarkMode() {
        return this.currentTheme === 'dark';
    }
}

// Fallback theme detection for older browsers
function detectThemeFallback() {
    const savedTheme = localStorage.getItem('duniabercerita_theme');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemDark)) {
        document.body.classList.add('dark');
    } else {
        document.body.classList.add('light');
    }
}

// Enhanced initialization with error handling
function initializeThemeManager() {
    try {
        window.themeManager = new ThemeManager();
        console.log('Theme manager initialized successfully');
    } catch (error) {
        console.error('Failed to initialize theme manager:', error);
        // Fallback to basic theme detection
        detectThemeFallback();
    }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeThemeManager);
} else {
    initializeThemeManager();
}

// Export untuk penggunaan modular
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThemeManager;
}