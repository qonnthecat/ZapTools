// js/views.js
export class ViewManager {
    constructor() {
        this.app = document.getElementById('app');
        this.currentView = null;
    }

    render(template) {
        this.app.innerHTML = template;
        this.initializeComponents();
    }

    initializeComponents() {
        // Initialize theme
        this.initializeTheme();

        // Initialize navigation
        this.initializeNavigation();

        // Initialize logo click handler
        this.initializeLogoHandler();

        // Initialize current section
        this.initializeCurrentSection();
    }

    initializeTheme() {
        const themeSwitcher = document.getElementById('theme-switcher');
        const themeIcon = document.querySelector('.theme-icon');
        
        if (!themeSwitcher) return;

        const savedTheme = localStorage.getItem('theme') || 
            (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        
        if (savedTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            if (themeIcon) themeIcon.textContent = '☀️';
        }

        themeSwitcher.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            if (currentTheme === 'light') {
                document.documentElement.setAttribute('data-theme', 'dark');
                if (themeIcon) themeIcon.textContent = '☀️';
                localStorage.setItem('theme', 'dark');
            } else {
                document.documentElement.setAttribute('data-theme', 'light');
                if (themeIcon) themeIcon.textContent = '🌙';
                localStorage.setItem('theme', 'light');
            }
        });
    }

    initializeNavigation() {
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        const navLinks = document.querySelectorAll('.nav-link');
        const featureCards = document.querySelectorAll('.feature-card');

        // Mobile menu toggle
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
            });
        }

        // Navigation links
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = e.target.getAttribute('href').replace('#', '');
                window.dispatchEvent(new CustomEvent('navigate', { detail: target }));
                
                // Close mobile menu
                if (navMenu) navMenu.classList.remove('active');
            });
        });

        // Feature cards navigation
        featureCards.forEach(card => {
            card.addEventListener('click', () => {
                const target = card.querySelector('h3').textContent.toLowerCase();
                let route;
                switch(target) {
                    case 'konversi file': route = 'converter'; break;
                    case 'color tools': route = 'tools'; break;
                    default: route = 'home';
                }
                window.dispatchEvent(new CustomEvent('navigate', { detail: route }));
            });
        });
    }

    initializeLogoHandler() {
        const logo = document.querySelector('.logo');
        if (logo) {
            // Make logo clickable with cursor pointer
            logo.style.cursor = 'pointer';
            
            logo.addEventListener('click', () => {
                console.log('Logo clicked, navigating to home');
                window.dispatchEvent(new CustomEvent('navigate', { detail: 'home' }));
                
                // Close mobile menu if open
                const navMenu = document.querySelector('.nav-menu');
                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                }
            });

            // Add hover effect
            logo.addEventListener('mouseenter', () => {
                logo.style.opacity = '0.8';
            });

            logo.addEventListener('mouseleave', () => {
                logo.style.opacity = '1';
            });
        }
    }

    initializeCurrentSection() {
        const sections = document.querySelectorAll('.section');
        const navLinks = document.querySelectorAll('.nav-link');
        const currentRoute = window.location.hash.replace('#', '') || 'home';

        // Update active section
        sections.forEach(section => {
            section.classList.remove('active');
            if (section.id === currentRoute) {
                section.classList.add('active');
            }
        });

        // Update active nav link
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentRoute}`) {
                link.classList.add('active');
            }
        });
    }

    showLoading() {
        this.app.classList.add('loading');
    }

    hideLoading() {
        this.app.classList.remove('loading');
    }
}

// Template generator
export const Templates = {
    main() {
        return `
            <header class="header">
                <div class="container">
                    <div class="logo">
                        <h1>ZapTools</h1>
                        <p>Alat bantu online yang praktis</p>
                    </div>
                    <nav class="nav">
                        <button class="nav-toggle" aria-label="Toggle navigation">
                            <span></span>
                            <span></span>
                            <span></span>
                        </button>
                        <ul class="nav-menu">
                            <li><a href="#home" class="nav-link active">Beranda</a></li>
                            <li><a href="#converter" class="nav-link">Konversi File</a></li>
                            <li><a href="#tools" class="nav-link">Color Tools</a></li>
                        </ul>
                    </nav>
                    <div class="theme-toggle">
                        <button id="theme-switcher" class="theme-btn" aria-label="Toggle dark mode">
                            <span class="theme-icon">🌙</span>
                        </button>
                    </div>
                </div>
            </header>

            <main class="main">
                ${this.home()}
                ${this.converter()}
                ${this.tools()}
            </main>

            <footer class="footer">
                <div class="container">
                    <p>&copy; 2023 ZapTools. Semua hak dilindungi.</p>
                </div>
            </footer>
        `;
    },

    home() {
        return `
            <section id="home" class="section active">
                <div class="container">
                    <div class="hero">
                        <h2>Selamat Datang di ZapTools</h2>
                        <p>Kumpulan alat bantu online yang praktis untuk kebutuhan sehari-hari</p>
                        <div class="feature-grid">
                            <div class="feature-card">
                                <div class="feature-icon">📄</div>
                                <h3>Konversi File</h3>
                                <p>Konversi berbagai format file dengan mudah</p>
                            </div>
                            <div class="feature-card">
                                <div class="feature-icon">🎨</div>
                                <h3>Color Tools</h3>
                                <p>Generator warna dan alat bantu desain</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `;
    },

    converter() {
        return `
            <section id="converter" class="section">
                <div class="container">
                    <h2>Konversi File</h2>
                    <div class="converter-container">
                        <div class="converter-card">
                            <h3>Konversi Gambar</h3>
                            <div class="file-drop-area" id="image-drop-area">
                                <span class="file-msg">Seret gambar di sini atau klik untuk memilih</span>
                                <input type="file" id="image-input" class="file-input" accept="image/*">
                            </div>
                            <div class="image-preview" id="image-preview"></div>
                            <div class="format-selector">
                                <label for="image-format">Konversi ke:</label>
                                <select id="image-format">
                                    <option value="jpg">JPG</option>
                                    <option value="png">PNG</option>
                                    <option value="webp">WebP</option>
                                </select>
                            </div>
                            <div class="quality-selector">
                                <label for="image-quality">Kualitas (0-100):</label>
                                <input type="range" id="image-quality" min="0" max="100" value="80">
                                <span class="quality-value">80%</span>
                            </div>
                            <button id="convert-image" class="btn primary">Konversi Gambar</button>
                            <div id="image-result" class="result-area"></div>
                        </div>

                        <div class="converter-card">
                            <h3>Konversi Teks</h3>
                            <textarea id="text-input" placeholder="Masukkan teks di sini..."></textarea>
                            <div class="format-selector">
                                <label for="text-format">Konversi ke:</label>
                                <select id="text-format">
                                    <option value="uppercase">Huruf Besar</option>
                                    <option value="lowercase">Huruf Kecil</option>
                                    <option value="titlecase">Judul Kasus</option>
                                    <option value="camelcase">Camel Case</option>
                                    <option value="snakecase">Snake Case</option>
                                    <option value="reverse">Balik Teks</option>
                                    <option value="remove-spaces">Hapus Spasi</option>
                                </select>
                            </div>
                            <button id="convert-text" class="btn primary">Konversi Teks</button>
                            <div id="text-result" class="result-area"></div>
                            <button id="copy-text" class="btn secondary" style="display:none;">Salin Teks</button>
                        </div>
                    </div>
                </div>
            </section>
        `;
    },

    tools() {
        return `
            <section id="tools" class="section">
                <div class="container">
                    <h2>Color Tools</h2>
                    <div class="tools-grid">
                        <div class="tool-card">
                            <h3>Generator Warna</h3>
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
                        <div class="tool-card">
                            <h3>Pembuat Kata Sandi</h3>
                            <div class="password-generator">
                                <div class="password-display">
                                    <input type="text" id="password-output" readonly>
                                    <button id="copy-password" class="btn icon">📋</button>
                                </div>
                                <div class="password-strength">
                                    <div class="strength-meter">
                                        <div class="strength-bar" id="strength-bar"></div>
                                    </div>
                                    <span id="strength-text">Kekuatan</span>
                                </div>
                                <div class="password-options">
                                    <label>
                                        <input type="number" id="password-length" min="6" max="32" value="12">
                                        Panjang
                                    </label>
                                    <label>
                                        <input type="checkbox" id="include-uppercase" checked>
                                        Huruf Besar
                                    </label>
                                    <label>
                                        <input type="checkbox" id="include-numbers" checked>
                                        Angka
                                    </label>
                                    <label>
                                        <input type="checkbox" id="include-symbols">
                                        Simbol
                                    </label>
                                </div>
                                <button id="generate-password" class="btn primary">Buat Kata Sandi</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }
};