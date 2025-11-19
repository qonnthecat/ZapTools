// js/services/settings-manager.js
export class SettingsManager {
    init() {
        console.log('Initializing Settings Manager...');
        this.initializeThemeToggle();
    }

    initializeThemeToggle() {
        const darkModeToggle = document.getElementById('dark-mode-toggle');
        const themeIcon = document.querySelector('.theme-icon');

        if (!darkModeToggle) return;

        // Set initial state
        const savedTheme = localStorage.getItem('theme') || 
            (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        
        darkModeToggle.checked = savedTheme === 'dark';

        // Add event listener
        darkModeToggle.addEventListener('change', (e) => {
            if (e.target.checked) {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
            } else {
                document.documentElement.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
            }
        });
    }
}