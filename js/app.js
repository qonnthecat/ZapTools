// js/app.js
import { Router } from './router.js';
import { ViewManager, Templates } from './views.js';
import translationService from './services/translation-service.js';

class ZapToolsApp {
    constructor() {
        this.viewManager = new ViewManager();
        this.router = new Router([
            { path: 'home', handler: () => this.showHome() },
            { path: 'features', handler: () => this.showFeatures() },
            { path: 'image-converter', handler: () => this.showImageConverter() },
            { path: 'text-converter', handler: () => this.showTextConverter() },
            { path: 'color-tools', handler: () => this.showColorTools() },
            { path: 'password-generator', handler: () => this.showPasswordGenerator() },
            { path: 'settings', handler: () => this.showSettings() }
        ]);

        this.init();
    }

    async init() {
        // Initialize translation service first
        await translationService.init();
        
        this.viewManager.render(Templates.main());

        window.addEventListener('navigate', (e) => {
            this.router.goTo(e.detail);
        });

        this.initializeLanguageSelector();
        this.initializeServices();
    }

    initializeLanguageSelector() {
        const languageSelector = document.getElementById('language-selector');
        if (languageSelector) {
            // Set current language
            const currentLang = translationService.getCurrentLanguage();
            languageSelector.value = currentLang;

            // Add change event listener
            languageSelector.addEventListener('change', async (e) => {
                const newLang = e.target.value;
                await this.viewManager.setLanguage(newLang);
                
                // Re-initialize services to update their language
                this.initializeServices();
            });
        }
    }

    async initializeServices() {
        const currentRoute = this.router.getCurrentRoute() || 'home';
        await this.loadRouteServices(currentRoute);
    }

    async loadRouteServices(route) {
        try {
            switch(route) {
                case 'image-converter':
                    const { ImageConverter } = await import('./services/image-converter.js');
                    new ImageConverter().init();
                    break;
                case 'text-converter':
                    const { TextConverter } = await import('./services/text-converter.js');
                    new TextConverter().init();
                    break;
                case 'color-tools':
                    const { ColorTools } = await import('./services/color-tools.js');
                    new ColorTools().init();
                    break;
                case 'password-generator':
                    const { PasswordGenerator } = await import('./services/password-generator.js');
                    new PasswordGenerator().init();
                    break;
                case 'settings':
                    const { SettingsManager } = await import('./services/settings-manager.js');
                    new SettingsManager().init();
                    break;
            }
            console.log(`${route} services loaded`);
        } catch (error) {
            console.error(`Error loading ${route} services:`, error);
        }
    }

    showHome() {
        this.viewManager.initializeCurrentSection();
    }

    showFeatures() {
        this.viewManager.initializeCurrentSection();
    }

    async showImageConverter() {
        this.viewManager.initializeCurrentSection();
        await this.loadRouteServices('image-converter');
    }

    async showTextConverter() {
        this.viewManager.initializeCurrentSection();
        await this.loadRouteServices('text-converter');
    }

    async showColorTools() {
        this.viewManager.initializeCurrentSection();
        await this.loadRouteServices('color-tools');
    }

    async showPasswordGenerator() {
        this.viewManager.initializeCurrentSection();
        await this.loadRouteServices('password-generator');
    }

    async showSettings() {
        this.viewManager.initializeCurrentSection();
        await this.loadRouteServices('settings');
        
        // Re-initialize language selector for settings page
        this.initializeLanguageSelector();
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ZapToolsApp();
});