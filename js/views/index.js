// js/views/index.js
import translationService from '../services/translation-service.js';
import { MainTemplate } from './templates/index.js';
import { toolsLoader } from '../tools/index.js';

export class ViewManager {
    constructor() {
        this.app = document.getElementById('app');
        this.currentView = null;
    }

    async render() {
        try {
            // Initialize translation service first
            await translationService.init();
            
            // Initialize tools loader
            await toolsLoader.init();
            
            // Render main template
            this.app.innerHTML = MainTemplate();
            
            // Load dan inject tools templates
            await this.loadToolsTemplates();
            
            this.initializeComponents();
            this.updateTextContent();
            
        } catch (error) {
            console.error('Error rendering app:', error);
            this.showErrorState();
        }
    }

    async loadToolsTemplates() {
        try {
            const tools = toolsLoader.getAllTools();
            const mainElement = document.querySelector('main');
            
            if (mainElement && tools.length > 0) {
                // Inject tools templates sebelum settings section
                const settingsSection = mainElement.querySelector('#settings');
                
                for (const tool of tools) {
                    const template = await toolsLoader.getToolTemplate(tool.id);
                    if (template && settingsSection) {
                        settingsSection.insertAdjacentHTML('beforebegin', template);
                    }
                }
            }
        } catch (error) {
            console.error('Error loading tools templates:', error);
        }
    }

    showErrorState() {
        this.app.innerHTML = `
            <div style="padding: 40px; text-align: center; font-family: Arial, sans-serif;">
                <h2 style="color: #e74c3c;">Error Loading Application</h2>
                <p>Please check the console for details and refresh the page.</p>
                <button onclick="window.location.reload()" style="padding: 10px 20px; background: #3498db; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    Reload Page
                </button>
            </div>
        `;
    }

    initializeComponents() {
        this.initializeTheme();
        this.initializeNavigation();
        this.initializeLogoWithEffects();
        this.initializeCurrentSection();
    }

    initializeLogoWithEffects() {
        const logo = document.querySelector('.logo');
        if (logo) {
            logo.classList.add('logo-glow');
            logo.style.cursor = 'pointer';
            
            logo.addEventListener('click', () => {
                logo.classList.add('logo-loading');
                setTimeout(() => {
                    logo.classList.remove('logo-loading');
                }, 600);
                
                window.dispatchEvent(new CustomEvent('navigate', { detail: 'home' }));
            });

            logo.addEventListener('mouseenter', () => {
                logo.style.opacity = '0.8';
            });

            logo.addEventListener('mouseleave', () => {
                logo.style.opacity = '1';
            });
        }
    }

    initializeNavigation() {
        const bottomNavLinks = document.querySelectorAll('.bottom-nav-link');
        const featureCards = document.querySelectorAll('.feature-card');
        const categoryItems = document.querySelectorAll('.category-item');

        bottomNavLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = e.currentTarget.getAttribute('href').replace('#', '');
                window.dispatchEvent(new CustomEvent('navigate', { detail: target }));
            });
        });

        featureCards.forEach(card => {
            card.addEventListener('click', () => {
                const target = card.getAttribute('data-route');
                if (target) {
                    window.dispatchEvent(new CustomEvent('navigate', { detail: target }));
                }
            });
        });

        categoryItems.forEach(item => {
            item.addEventListener('click', () => {
                const target = item.getAttribute('data-route');
                if (target) {
                    window.dispatchEvent(new CustomEvent('navigate', { detail: target }));
                }
            });
        });
    }

    initializeTheme() {
        const savedTheme = localStorage.getItem('theme') || 
            (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        
        if (savedTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
        }
    }

    initializeCurrentSection() {
        const sections = document.querySelectorAll('.section');
        const bottomNavLinks = document.querySelectorAll('.bottom-nav-link');
        const currentRoute = window.location.hash.replace('#', '') || 'home';

        sections.forEach(section => {
            section.classList.remove('active');
            if (section.id === currentRoute) {
                section.classList.add('active');
            }
        });

        bottomNavLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentRoute}`) {
                link.classList.add('active');
            }
        });
    }

    updateTextContent() {
        // Update all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = translationService.get(key);
            if (translation) {
                if (element.tagName === 'INPUT' && element.hasAttribute('placeholder')) {
                    element.placeholder = translation;
                } else {
                    element.textContent = translation;
                }
            }
        });

        // Update placeholder elements
        document.querySelectorAll('[data-i18n-ph]').forEach(element => {
            const key = element.getAttribute('data-i18n-ph');
            const translation = translationService.get(key);
            if (translation && element.placeholder !== undefined) {
                element.placeholder = translation;
            }
        });

        // Update title and meta description
        document.title = translationService.getApp('title');
    }

    async setLanguage(lang) {
        await translationService.setLanguage(lang);
        this.updateTextContent();
    }

    getCurrentLanguage() {
        return translationService.getCurrentLanguage();
    }

    showLoading() {
        this.app.classList.add('loading');
    }

    hideLoading() {
        this.app.classList.remove('loading');
    }
}