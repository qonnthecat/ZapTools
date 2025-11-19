// js/services/translation-service.js
class TranslationService {
    constructor() {
        this.currentLanguage = localStorage.getItem('language') || 'en';
        this.translations = {};
        this.initialized = false;
    }

    async init() {
        if (this.initialized) return;
        
        try {
            await this.loadTranslations(this.currentLanguage);
            this.initialized = true;
            console.log('Translation service initialized');
        } catch (error) {
            console.error('Failed to initialize translation service:', error);
        }
    }

    async loadTranslations(lang) {
        try {
            const response = await fetch(`languages/${lang}.json`);
            if (!response.ok) {
                throw new Error(`Failed to load ${lang} translations`);
            }
            this.translations[lang] = await response.json();
        } catch (error) {
            console.error(`Error loading ${lang} translations:`, error);
            // Fallback to English if translation file fails to load
            if (lang !== 'en') {
                await this.loadTranslations('en');
            }
        }
    }

    async setLanguage(lang) {
        if (!this.translations[lang]) {
            await this.loadTranslations(lang);
        }
        
        this.currentLanguage = lang;
        localStorage.setItem('language', lang);
        
        // Dispatch event for other components to update
        window.dispatchEvent(new CustomEvent('languageChanged', { 
            detail: lang 
        }));
    }

    get(key, fallback = '') {
        if (!this.initialized) {
            console.warn('Translation service not initialized');
            return fallback;
        }

        const keys = key.split('.');
        let value = this.translations[this.currentLanguage];

        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                // Fallback to English if key not found
                if (this.currentLanguage !== 'en') {
                    value = this.getFromLanguage('en', key);
                    if (value) return value;
                }
                console.warn(`Translation key not found: ${key}`);
                return fallback;
            }
        }

        return value || fallback;
    }

    getFromLanguage(lang, key) {
        const keys = key.split('.');
        let value = this.translations[lang];

        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                return null;
            }
        }

        return value;
    }

    getCurrentLanguage() {
        return this.currentLanguage;
    }

    // Helper method to get alert messages
    getAlert(key) {
        return this.get(`alerts.${key}`, key);
    }

    // Helper method to get app strings
    getApp(key) {
        return this.get(`app.${key}`, key);
    }

    // Helper method to get navigation strings
    getNav(key) {
        return this.get(`navigation.${key}`, key);
    }

    // Helper method to get home page strings
    getHome(key) {
        return this.get(`home.${key}`, key);
    }

    // Helper method to get features strings
    getFeatures(key) {
        return this.get(`features.${key}`, key);
    }

    // Helper method to get image converter strings
    getImageConverter(key) {
        return this.get(`imageConverter.${key}`, key);
    }

    // Helper method to get text converter strings
    getTextConverter(key) {
        return this.get(`textConverter.${key}`, key);
    }

    // Helper method to get color tools strings
    getColorTools(key) {
        return this.get(`colorTools.${key}`, key);
    }

    // Helper method to get password generator strings
    getPasswordGenerator(key) {
        return this.get(`passwordGenerator.${key}`, key);
    }

    // Helper method to get settings strings
    getSettings(key) {
        return this.get(`settings.${key}`, key);
    }
}

// Create singleton instance
const translationService = new TranslationService();

export default translationService;