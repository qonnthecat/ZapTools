// js/views.js
import translationService from './services/translation-service.js';

export class ViewManager {
    constructor() {
        this.app = document.getElementById('app');
        this.currentView = null;
    }

    async render(template) {
        // Initialize translation service first
        await translationService.init();
        
        this.app.innerHTML = template;
        this.initializeComponents();
        this.updateTextContent();
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

// Template generator (using translation keys in data-i18n attributes)
export const Templates = {
    main() {
        return `
            <header class="header">
                <div class="container">
                    <div class="logo">
                        <div class="logo-container">
                            <img src="images/logos/transparent.png" alt="ZapTools Logo" class="logo-image">
                            <div class="logo-text">
                                <h1 data-i18n="app.title">ZapTools</h1>
                                <p data-i18n="app.tagline">Practical online utility tools</p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main class="main">
                ${this.home()}
                ${this.features()}
                ${this.imageConverter()}
                ${this.textConverter()}
                ${this.colorTools()}
                ${this.passwordGenerator()}
                ${this.settings()}
            </main>

            ${this.bottomBar()}

            <footer class="footer">
                <div class="container">
                    <div class="footer-content">
                        <div class="footer-logo">
                            <img src="images/logos/transparent.png" alt="ZapTools" class="footer-logo-image">
                            <span data-i18n="app.title">ZapTools</span>
                        </div>
                        <p data-i18n="app.copyright">© 2023 ZapTools. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        `;
    },

    bottomBar() {
        return `
            <nav class="bottom-bar">
                <ul class="bottom-nav">
                    <li class="bottom-nav-item">
                        <a href="#home" class="bottom-nav-link active">
                            <span class="bottom-nav-icon">🏠</span>
                            <span class="bottom-nav-text" data-i18n="navigation.home">Home</span>
                        </a>
                    </li>
                    <li class="bottom-nav-item">
                        <a href="#features" class="bottom-nav-link">
                            <span class="bottom-nav-icon">📋</span>
                            <span class="bottom-nav-text" data-i18n="navigation.features">Features</span>
                        </a>
                    </li>
                    <li class="bottom-nav-item">
                        <a href="#settings" class="bottom-nav-link">
                            <span class="bottom-nav-icon">⚙️</span>
                            <span class="bottom-nav-text" data-i18n="navigation.settings">Settings</span>
                        </a>
                    </li>
                </ul>
            </nav>
        `;
    },

    home() {
        return `
            <section id="home" class="section active">
                <div class="container">
                    <div class="hero">
                        <h2 data-i18n="home.welcomeTitle">Welcome to ZapTools</h2>
                        <p data-i18n="home.welcomeSubtitle">A collection of practical online tools for everyday needs</p>
                        <div class="feature-grid">
                            <div class="feature-card" data-route="features">
                                <div class="feature-icon">📋</div>
                                <h3 data-i18n="home.allFeatures">All Features</h3>
                                <p data-i18n="home.welcomeSubtitle">Browse all available tools</p>
                            </div>
                            <div class="feature-card" data-route="image-converter">
                                <div class="feature-icon">🖼️</div>
                                <h3 data-i18n="home.imageConversion">Image Conversion</h3>
                                <p data-i18n="home.imageConversionDesc">Convert image formats easily</p>
                            </div>
                            <div class="feature-card" data-route="text-converter">
                                <div class="feature-icon">📝</div>
                                <h3 data-i18n="home.textConversion">Text Conversion</h3>
                                <p data-i18n="home.textConversionDesc">Transform text to various formats</p>
                            </div>
                            <div class="feature-card" data-route="color-tools">
                                <div class="feature-icon">🎨</div>
                                <h3 data-i18n="home.colorTools">Color Tools</h3>
                                <p data-i18n="home.colorToolsDesc">Color generator and design tools</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `;
    },

    features() {
        return `
            <section id="features" class="section">
                <div class="container">
                    <div class="features-list">
                        <h2 data-i18n="features.allFeaturesTitle" style="text-align: center; margin-bottom: 30px; color: var(--primary-color);">All Features</h2>
                        
                        <div class="feature-category">
                            <h3>🖼️ <span data-i18n="features.fileConversion">File Conversion</span></h3>
                            <div class="category-grid">
                                <div class="category-item" data-route="image-converter">
                                    <h4 data-i18n="features.imageConverter">Image Converter</h4>
                                    <p data-i18n="features.imageConverterDesc">Convert image formats (JPG, PNG, WebP) with adjustable quality</p>
                                </div>
                                <div class="category-item" data-route="text-converter">
                                    <h4 data-i18n="features.textConverter">Text Converter</h4>
                                    <p data-i18n="features.textConverterDesc">Transform text to various formats like uppercase, lowercase, camel case, etc</p>
                                </div>
                            </div>
                        </div>

                        <div class="feature-category">
                            <h3>🎨 <span data-i18n="features.colorToolsCategory">Color Tools</span></h3>
                            <div class="category-grid">
                                <div class="category-item" data-route="color-tools">
                                    <h4 data-i18n="features.colorGenerator">Color Generator</h4>
                                    <p data-i18n="features.colorGeneratorDesc">Color picker with HEX, RGB, HSL information and palette generator</p>
                                </div>
                                <div class="category-item" data-route="password-generator">
                                    <h4 data-i18n="features.passwordGenerator">Password Generator</h4>
                                    <p data-i18n="features.passwordGeneratorDesc">Create strong passwords with customization options</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `;
    },

    imageConverter() {
        return `
            <section id="image-converter" class="section">
                <div class="container">
                    <div class="converter-section">
                        <h2 data-i18n="imageConverter.title">Image Converter</h2>
                        <div class="converter-card">
                            <h3 data-i18n="imageConverter.changeImageFormat">Change Image Format</h3>
                            <div class="file-drop-area" id="image-drop-area">
                                <span class="file-msg" data-i18n="imageConverter.dragDropImage">Drag image here or click to select</span>
                                <input type="file" id="image-input" class="file-input" accept="image/*">
                            </div>
                            <div class="image-preview" id="image-preview"></div>
                            <div class="format-selector">
                                <label for="image-format" data-i18n="imageConverter.convertToFormat">Convert to format:</label>
                                <select id="image-format">
                                    <option value="jpg">JPG</option>
                                    <option value="png">PNG</option>
                                    <option value="webp">WebP</option>
                                </select>
                            </div>
                            <div class="quality-selector">
                                <label for="image-quality" data-i18n="imageConverter.quality">Quality (0-100):</label>
                                <input type="range" id="image-quality" min="0" max="100" value="80">
                                <span class="quality-value">80%</span>
                            </div>
                            <button id="convert-image" class="btn primary" data-i18n="imageConverter.convertImage">Convert Image</button>
                            <div id="image-result" class="result-area"></div>
                        </div>
                    </div>
                </div>
            </section>
        `;
    },

    textConverter() {
        return `
            <section id="text-converter" class="section">
                <div class="container">
                    <div class="converter-section">
                        <h2 data-i18n="textConverter.title">Text Converter</h2>
                        <div class="converter-card">
                            <h3 data-i18n="textConverter.textTransformation">Text Transformation</h3>
                            <textarea id="text-input" placeholder="Enter your text here..." data-i18n-ph="textConverter.enterTextHere"></textarea>
                            <div class="format-selector">
                                <label for="text-format" data-i18n="textConverter.convertTo">Convert to:</label>
                                <select id="text-format">
                                    <option value="uppercase" data-i18n="textConverter.uppercase">UPPERCASE</option>
                                    <option value="lowercase" data-i18n="textConverter.lowercase">lowercase</option>
                                    <option value="titlecase" data-i18n="textConverter.titlecase">Title Case</option>
                                    <option value="camelcase" data-i18n="textConverter.camelcase">camelCase</option>
                                    <option value="snakecase" data-i18n="textConverter.snakecase">snake_case</option>
                                    <option value="reverse" data-i18n="textConverter.reverse">Reverse Text</option>
                                    <option value="remove-spaces" data-i18n="textConverter.removeSpaces">Remove Spaces</option>
                                </select>
                            </div>
                            <button id="convert-text" class="btn primary" data-i18n="textConverter.convertText">Convert Text</button>
                            <div id="text-result" class="result-area"></div>
                            <button id="copy-text" class="btn secondary" style="display:none; margin-top: 10px;" data-i18n="textConverter.copyText">Copy Text</button>
                        </div>
                    </div>
                </div>
            </section>
        `;
    },

    colorTools() {
        return `
            <section id="color-tools" class="section">
                <div class="container">
                    <div class="color-tools-section">
                        <h2 data-i18n="colorTools.title">Color Tools</h2>
                        <div class="tool-card">
                            <h3 data-i18n="colorTools.colorGeneratorTitle">Color Generator</h3>
                            <div class="color-picker-container">
                                <input type="color" class="color-picker" id="color-picker" value="#3498db">
                                <div class="color-info">
                                    <p>HEX: <span id="hex-value">#3498db</span></p>
                                    <p>RGB: <span id="rgb-value">rgb(52, 152, 219)</span></p>
                                    <p>HSL: <span id="hsl-value">hsl(204, 70%, 53%)</span></p>
                                </div>
                                <div class="color-palette" id="color-palette"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `;
    },
    
    passwordGenerator() {
        return `
            <section id="password-generator" class="section">
                <div class="container">
                    <div class="color-tools-section">
                        <h2 data-i18n="passwordGenerator.title">Password Generator</h2>
                        <div class="tool-card">
                            <h3 data-i18n="passwordGenerator.createStrongPassword">Create Strong Password</h3>
                            <div class="password-generator">
                                <div class="password-display">
                                    <input type="text" id="password-output" readonly>
                                    <button id="copy-password" class="btn icon">📋</button>
                                </div>
                                <div class="password-strength">
                                    <div class="strength-meter">
                                        <div class="strength-bar" id="strength-bar"></div>
                                    </div>
                                    <span id="strength-text" data-i18n="passwordGenerator.strength">Strength</span>
                                </div>
                                <div class="password-options">
                                    <label>
                                        <input type="number" id="password-length" min="6" max="32" value="12">
                                        <span data-i18n="passwordGenerator.length">Length</span>
                                    </label>
                                    <label>
                                        <input type="checkbox" id="include-uppercase" checked>
                                        <span data-i18n="passwordGenerator.includeUppercase">Uppercase Letters</span>
                                    </label>
                                    <label>
                                        <input type="checkbox" id="include-numbers" checked>
                                        <span data-i18n="passwordGenerator.includeNumbers">Numbers</span>
                                    </label>
                                    <label>
                                        <input type="checkbox" id="include-symbols">
                                        <span data-i18n="passwordGenerator.includeSymbols">Symbols</span>
                                    </label>
                                </div>
                                <button id="generate-password" class="btn primary" data-i18n="passwordGenerator.generatePassword">Generate New Password</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `;
    },

    settings() {
        return `
            <section id="settings" class="section">
                <div class="container">
                    <div class="settings-container">
                        <h2 data-i18n="settings.title" style="text-align: center; margin-bottom: 30px; color: var(--primary-color);">Settings</h2>
                        
                        <div class="settings-group">
                            <h3>🎨 <span data-i18n="settings.appearance">Appearance</span></h3>
                            <div class="setting-item">
                                <div class="setting-info">
                                    <h4 data-i18n="settings.darkMode">Dark Mode</h4>
                                    <p data-i18n="settings.darkModeDesc">Enable dark theme for eye comfort</p>
                                </div>
                                <label class="toggle-switch">
                                    <input type="checkbox" id="dark-mode-toggle">
                                    <span class="toggle-slider"></span>
                                </label>
                            </div>
                            <div class="setting-item">
                                <div class="setting-info">
                                    <h4 data-i18n="settings.language">Language</h4>
                                    <p data-i18n="settings.languageDesc">Choose your preferred language</p>
                                </div>
                                <select id="language-selector" class="form-control">
                                    <option value="en" data-i18n="settings.english">English</option>
                                    <option value="id" data-i18n="settings.indonesian">Indonesian</option>
                                </select>
                            </div>
                        </div>

                        <div class="settings-group">
                            <h3>ℹ️ <span data-i18n="settings.about">About</span></h3>
                            <div class="setting-item">
                                <div class="setting-info">
                                    <h4 data-i18n="settings.appVersion">App Version</h4>
                                    <p data-i18n="settings.version">ZapTools v1.0.0</p>
                                </div>
                            </div>
                            <div class="setting-item">
                                <div class="setting-info">
                                    <h4 data-i18n="settings.developer">Developer</h4>
                                    <p data-i18n="settings.developerDesc">Made with ❤️ for your convenience</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }
};