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
        const savedTheme = localStorage.getItem('duniabercerita_theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
            this.enableDarkMode();
        } else {
            this.enableLightMode();
        }
    }

    bindEvents() {
        if (this.toggleBtn) {
            this.toggleBtn.addEventListener('click', () => this.toggleTheme());
        }
    }

    setupSystemPreferenceListener() {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            // Hanya ikuti system preference jika user belum memilih manual
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
        if (this.body.classList.contains('dark')) {
            this.enableLightMode();
        } else {
            this.enableDarkMode();
        }
    }

    enableDarkMode() {
        this.body.classList.add('dark');
        this.body.classList.remove('light');
        this.currentTheme = 'dark';
        localStorage.setItem('duniabercerita_theme', 'dark');
        this.updateToggleButton();
        this.dispatchThemeChangeEvent();
    }

    enableLightMode() {
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
                this.toggleBtn.setAttribute('title', 'Switch to Light Mode');
            } else {
                this.toggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
                this.toggleBtn.setAttribute('title', 'Switch to Dark Mode');
            }
        }
    }

    dispatchThemeChangeEvent() {
        const event = new CustomEvent('themeChanged', {
            detail: { theme: this.currentTheme }
        });
        document.dispatchEvent(event);
    }

    getCurrentTheme() {
        return this.currentTheme;
    }
}

// Auto-initialize theme manager
document.addEventListener('DOMContentLoaded', function() {
    window.themeManager = new ThemeManager();
});

// Export untuk penggunaan modular
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThemeManager;
}