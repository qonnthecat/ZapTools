// js/app.js
import { Router } from './router.js';
import { ViewManager } from './views/index.js';
import translationService from './services/translation-service.js';
import { toolsLoader } from './tools/index.js';

class ZapToolsApp {
    constructor() {
        this.viewManager = new ViewManager();
        this.router = null;
        this.initialized = false;
    }

    async init() {
        if (this.initialized) return;

        try {
            console.log('Initializing ZapTools App...');

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

            this.initialized = true;
            console.log('ZapTools app initialized successfully');

        } catch (error) {
            console.error('Failed to initialize ZapTools app:', error);
            this.showErrorState(error);
        }
    }

    showErrorState(error) {
        const app = document.getElementById('app');
        if (app) {
            app.innerHTML = `
                <div style="padding: 40px; text-align: center; font-family: Arial, sans-serif;">
                    <h2 style="color: #e74c3c;">Application Error</h2>
                    <p>${error.message}</p>
                    <button onclick="window.location.reload()" style="padding: 10px 20px; background: #3498db; color: white; border: none; border-radius: 5px; cursor: pointer;">
                        Reload Page
                    </button>
                </div>
            `;
        }
    }

    generateRoutes() {
        const baseRoutes = [
            { path: 'home', handler: () => this.showHome() },
            { path: 'features', handler: () => this.showFeatures() },
            { path: 'settings', handler: () => this.showSettings() }
        ];

        // Tambahkan routes untuk setiap tool
        const tools = toolsLoader.getAllTools();
        const toolRoutes = tools.map(tool => ({
            path: tool.route,
            handler: () => this.showTool(tool.id)
        }));

        return [...baseRoutes, ...toolRoutes];
    }

    async loadRouteServices(route) {
        try {
            console.log(`Loading services for route: ${route}`);
            
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
        const tool = toolsLoader.getTool(toolId);
        console.log(`Navigated to ${tool?.name || toolId}`);
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
    console.log('DOM Content Loaded - Starting app...');
    window.zapToolsApp = new ZapToolsApp();
    window.zapToolsApp.init().catch(error => {
        console.error('App initialization failed:', error);
    });
});

// Global error handlers
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
});

export default ZapToolsApp;