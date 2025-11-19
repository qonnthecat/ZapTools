// js/app.js
import { Router } from './router.js';
import { ViewManager, Templates } from './views.js';

class ZapToolsApp {
    constructor() {
        this.viewManager = new ViewManager();
        this.router = new Router([
            { path: 'home', handler: () => this.showHome() },
            { path: 'converter', handler: () => this.showConverter() },
            { path: 'tools', handler: () => this.showTools() }
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
        
        // Load services based on current route
        switch(currentRoute) {
            case 'converter':
                await this.loadConverterServices();
                break;
            case 'tools':
                await this.loadToolsServices();
                break;
        }
    }

    async loadConverterServices() {
        try {
            const { ImageConverter } = await import('./services/image-converter.js');
            const { TextConverter } = await import('./services/text-converter.js');
            
            new ImageConverter().init();
            new TextConverter().init();
            
            console.log('Converter services loaded');
        } catch (error) {
            console.error('Error loading converter services:', error);
        }
    }

    async loadToolsServices() {
        try {
            const { ColorTools } = await import('./services/color-tools.js');
            const { PasswordGenerator } = await import('./services/password-generator.js');
            
            new ColorTools().init();
            new PasswordGenerator().init();
            
            console.log('Tools services loaded');
        } catch (error) {
            console.error('Error loading tools services:', error);
        }
    }

    showHome() {
        this.viewManager.initializeCurrentSection();
    }

    async showConverter() {
        this.viewManager.initializeCurrentSection();
        await this.loadConverterServices();
    }

    async showTools() {
        this.viewManager.initializeCurrentSection();
        await this.loadToolsServices();
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ZapToolsApp();
});