// js/app.js
import { Router } from './router.js';
import { ViewManager } from './views/index.js';
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
        try {
            // Initialize translation service first
            await translationService.init();
            
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
            await this.initializeServices();

            console.log('ZapTools app initialized successfully');
        } catch (error) {
            console.error('Failed to initialize ZapTools app:', error);
        }
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
                try {
                    await this.viewManager.setLanguage(newLang);
                    
                    // Re-initialize services to update their language
                    await this.initializeServices();
                    
                    console.log(`Language changed to: ${newLang}`);
                } catch (error) {
                    console.error('Failed to change language:', error);
                }
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
                    console.log('Image Converter service loaded');
                    break;
                    
                case 'text-converter':
                    const { TextConverter } = await import('./services/text-converter.js');
                    new TextConverter().init();
                    console.log('Text Converter service loaded');
                    break;
                    
                case 'color-tools':
                    const { ColorTools } = await import('./services/color-tools.js');
                    new ColorTools().init();
                    console.log('Color Tools service loaded');
                    break;
                    
                case 'password-generator':
                    const { PasswordGenerator } = await import('./services/password-generator.js');
                    new PasswordGenerator().init();
                    console.log('Password Generator service loaded');
                    break;
                    
                case 'settings':
                    const { SettingsManager } = await import('./services/settings-manager.js');
                    new SettingsManager().init();
                    console.log('Settings Manager service loaded');
                    break;
                    
                default:
                    // No services needed for home and features pages
                    break;
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

    async showImageConverter() {
        this.viewManager.initializeCurrentSection();
        await this.loadRouteServices('image-converter');
        console.log('Navigated to Image Converter');
    }

    async showTextConverter() {
        this.viewManager.initializeCurrentSection();
        await this.loadRouteServices('text-converter');
        console.log('Navigated to Text Converter');
    }

    async showColorTools() {
        this.viewManager.initializeCurrentSection();
        await this.loadRouteServices('color-tools');
        console.log('Navigated to Color Tools');
    }

    async showPasswordGenerator() {
        this.viewManager.initializeCurrentSection();
        await this.loadRouteServices('password-generator');
        console.log('Navigated to Password Generator');
    }

    async showSettings() {
        this.viewManager.initializeCurrentSection();
        await this.loadRouteServices('settings');
        
        // Re-initialize language selector for settings page
        this.initializeLanguageSelector();
        console.log('Navigated to Settings');
    }

    // Utility method for error handling
    handleError(error, context) {
        console.error(`Error in ${context}:`, error);
    }

    // Method to show loading state
    showLoading() {
        this.viewManager.showLoading();
    }

    // Method to hide loading state
    hideLoading() {
        this.viewManager.hideLoading();
    }

    // Method to get current route
    getCurrentRoute() {
        return this.router.getCurrentRoute();
    }

    // Method to navigate programmatically
    navigateTo(route) {
        this.router.goTo(route);
    }

    // Method to get current language
    getCurrentLanguage() {
        return this.viewManager.getCurrentLanguage();
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Create global app instance for debugging
    window.zapToolsApp = new ZapToolsApp();
    
    // Add error handling for uncaught errors
    window.addEventListener('error', (event) => {
        console.error('Uncaught error:', event.error);
    });
    
    // Handle promise rejections
    window.addEventListener('unhandledrejection', (event) => {
        console.error('Unhandled promise rejection:', event.reason);
    });
});

export default ZapToolsApp;