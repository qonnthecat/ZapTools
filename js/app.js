// js/app.js
import { Router } from './router.js';
import { ViewManager, Templates } from './views.js';

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

    init() {
        // Render initial template
        this.viewManager.render(Templates.main());

        // Set up navigation event listener
        window.addEventListener('navigate', (e) => {
            this.router.goTo(e.detail);
        });

        // Initialize services for current route
        this.initializeServices();
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
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ZapToolsApp();
});