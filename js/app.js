// js/app.js
import { Router } from './router.js';
import { ViewManager } from './views/index.js';
import translationService from './services/translation-service.js';
import { toolsLoader } from './tools/index.js';

class ZapToolsApp {
    constructor() {
        this.viewManager = new ViewManager();
        this.router = null;
    }

    async init() {
        try {
            // Initialize translation service first
            await translationService.init();
            
            // Initialize tools loader
            await toolsLoader.init();

            // Create router dengan routes yang dinamis
            this.router = new Router(this.generateRoutes());
            
            // Render the main template
            await this.viewManager.render();

            // Set up navigation event listener
            window.addEventListener('navigate', (e) => {
                this.router.goTo(e.detail);
            });

            // Set up language change listener
            window.addEventListener('languageChanged', () => {
                this.initializeLanguageSelector();
            });

            // Initialize components
            this.initializeLanguageSelector();

            console.log('ZapTools app initialized successfully');
        } catch (error) {
            console.error('Failed to initialize ZapTools app:', error);
        }
    }

    generateRoutes() {
        const baseRoutes = [
            { path: 'home', handler: () => this.showHome() },
            { path: 'features', handler: () => this.showFeatures() },
            { path: 'settings', handler: () => this.showSettings() }
        ];

        // Tambahkan routes untuk setiap tool
        const toolRoutes = toolsLoader.getAllTools().map(tool => ({
            path: tool.route,
            handler: () => this.showTool(tool.id)
        }));

        return [...baseRoutes, ...toolRoutes];
    }

    async loadRouteServices(route) {
        try {
            // Cari tool berdasarkan route
            const tool = toolsLoader.getAllTools().find(t => t.route === route);
            
            if (tool) {
                await toolsLoader.initToolService(tool.id);
                console.log(`${tool.name} service loaded`);
            } else if (route === 'settings') {
                const { SettingsManager } = await import('./services/settings-manager.js');
                new SettingsManager().init();
                console.log('Settings Manager service loaded');
            }
        } catch (error) {
            console.error(`Error loading ${route} services:`, error);
        }
    }

    showHome() {
        this.viewManager.initializeCurrentSection();
        console.log('Navigated to Home');
    }

    showFeatures() {
        this.viewManager.initializeCurrentSection();
        console.log('Navigated to Features');
    }

    async showTool(toolId) {
        this.viewManager.initializeCurrentSection();
        await this.loadRouteServices(toolId);
        console.log(`Navigated to ${toolsLoader.getTool(toolId)?.name}`);
    }

    async showSettings() {
        this.viewManager.initializeCurrentSection();
        await this.loadRouteServices('settings');
        this.initializeLanguageSelector();
        console.log('Navigated to Settings');
    }

    initializeLanguageSelector() {
        const languageSelector = document.getElementById('language-selector');
        if (languageSelector) {
            const currentLang = translationService.getCurrentLanguage();
            languageSelector.value = currentLang;

            languageSelector.addEventListener('change', async (e) => {
                const newLang = e.target.value;
                try {
                    await this.viewManager.setLanguage(newLang);
                    console.log(`Language changed to: ${newLang}`);
                } catch (error) {
                    console.error('Failed to change language:', error);
                }
            });
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.zapToolsApp = new ZapToolsApp();
});

export default ZapToolsApp;