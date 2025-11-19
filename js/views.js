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
        // Theme now handled in settings
        const savedTheme = localStorage.getItem('theme') || 
            (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        
        if (savedTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
        }
    }

    initializeNavigation() {
        const bottomNavLinks = document.querySelectorAll('.bottom-nav-link');
        const featureCards = document.querySelectorAll('.feature-card');
        const categoryItems = document.querySelectorAll('.category-item');

        // Bottom navigation
        bottomNavLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = e.currentTarget.getAttribute('href').replace('#', '');
                window.dispatchEvent(new CustomEvent('navigate', { detail: target }));
            });
        });

        // Home feature cards navigation
        featureCards.forEach(card => {
            card.addEventListener('click', () => {
                const target = card.getAttribute('data-route');
                if (target) {
                    window.dispatchEvent(new CustomEvent('navigate', { detail: target }));
                }
            });
        });

        // Features list navigation
        categoryItems.forEach(item => {
            item.addEventListener('click', () => {
                const target = item.getAttribute('data-route');
                if (target) {
                    window.dispatchEvent(new CustomEvent('navigate', { detail: target }));
                }
            });
        });
    }

    initializeLogoHandler() {
        const logo = document.querySelector('.logo');
        if (logo) {
            logo.style.cursor = 'pointer';
            
            logo.addEventListener('click', () => {
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

    initializeCurrentSection() {
        const sections = document.querySelectorAll('.section');
        const bottomNavLinks = document.querySelectorAll('.bottom-nav-link');
        const currentRoute = window.location.hash.replace('#', '') || 'home';

        // Update active section
        sections.forEach(section => {
            section.classList.remove('active');
            if (section.id === currentRoute) {
                section.classList.add('active');
            }
        });

        // Update active bottom nav link
        bottomNavLinks.forEach(link => {
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
                    <p>&copy; 2023 ZapTools. Semua hak dilindungi.</p>
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
                            <span class="bottom-nav-text">Beranda</span>
                        </a>
                    </li>
                    <li class="bottom-nav-item">
                        <a href="#features" class="bottom-nav-link">
                            <span class="bottom-nav-icon">📋</span>
                            <span class="bottom-nav-text">Fitur</span>
                        </a>
                    </li>
                    <li class="bottom-nav-item">
                        <a href="#settings" class="bottom-nav-link">
                            <span class="bottom-nav-icon">⚙️</span>
                            <span class="bottom-nav-text">Pengaturan</span>
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
                        <h2>Selamat Datang di ZapTools</h2>
                        <p>Kumpulan alat bantu online yang praktis untuk kebutuhan sehari-hari</p>
                        <div class="feature-grid">
                            <div class="feature-card" data-route="features">
                                <div class="feature-icon">📋</div>
                                <h3>Semua Fitur</h3>
                                <p>Lihat semua alat yang tersedia</p>
                            </div>
                            <div class="feature-card" data-route="image-converter">
                                <div class="feature-icon">🖼️</div>
                                <h3>Konversi Gambar</h3>
                                <p>Ubah format gambar dengan mudah</p>
                            </div>
                            <div class="feature-card" data-route="text-converter">
                                <div class="feature-icon">📝</div>
                                <h3>Konversi Teks</h3>
                                <p>Transformasi teks ke berbagai format</p>
                            </div>
                            <div class="feature-card" data-route="color-tools">
                                <div class="feature-icon">🎨</div>
                                <h3>Color Tools</h3>
                                <p>Generator dan tools warna</p>
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
                        <h2 style="text-align: center; margin-bottom: 30px; color: var(--primary-color);">Semua Fitur</h2>
                        
                        <div class="feature-category">
                            <h3>🖼️ Konversi File</h3>
                            <div class="category-grid">
                                <div class="category-item" data-route="image-converter">
                                    <h4>Konversi Gambar</h4>
                                    <p>Ubah format gambar (JPG, PNG, WebP) dengan kualitas yang dapat disesuaikan</p>
                                </div>
                                <div class="category-item" data-route="text-converter">
                                    <h4>Konversi Teks</h4>
                                    <p>Transformasi teks ke berbagai format seperti uppercase, lowercase, camel case, dll</p>
                                </div>
                            </div>
                        </div>

                        <div class="feature-category">
                            <h3>🎨 Color Tools</h3>
                            <div class="category-grid">
                                <div class="category-item" data-route="color-tools">
                                    <h4>Generator Warna</h4>
                                    <p>Picker warna dengan informasi HEX, RGB, HSL dan palette generator</p>
                                </div>
                                <div class="category-item" data-route="password-generator">
                                    <h4>Password Generator</h4>
                                    <p>Buat kata sandi kuat dengan opsi kustomisasi</p>
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
                        <h2>Konversi Gambar</h2>
                        <div class="converter-card">
                            <h3>Ubah Format Gambar</h3>
                            <div class="file-drop-area" id="image-drop-area">
                                <span class="file-msg">Seret gambar di sini atau klik untuk memilih</span>
                                <input type="file" id="image-input" class="file-input" accept="image/*">
                            </div>
                            <div class="image-preview" id="image-preview"></div>
                            <div class="format-selector">
                                <label for="image-format">Konversi ke format:</label>
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
                        <h2>Konversi Teks</h2>
                        <div class="converter-card">
                            <h3>Transformasi Teks</h3>
                            <textarea id="text-input" placeholder="Masukkan teks di sini..."></textarea>
                            <div class="format-selector">
                                <label for="text-format">Konversi ke:</label>
                                <select id="text-format">
                                    <option value="uppercase">HURUF BESAR</option>
                                    <option value="lowercase">huruf kecil</option>
                                    <option value="titlecase">Judul Kasus</option>
                                    <option value="camelcase">camelCase</option>
                                    <option value="snakecase">snake_case</option>
                                    <option value="reverse">esireveB kiT</option>
                                    <option value="remove-spaces">HapusSemuaSpasi</option>
                                </select>
                            </div>
                            <button id="convert-text" class="btn primary">Konversi Teks</button>
                            <div id="text-result" class="result-area"></div>
                            <button id="copy-text" class="btn secondary" style="display:none; margin-top: 10px;">Salin Teks</button>
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
                        <h2>Color Tools</h2>
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
                        <h2>Password Generator</h2>
                        <div class="tool-card">
                            <h3>Buat Kata Sandi Kuat</h3>
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
                                <button id="generate-password" class="btn primary">Buat Kata Sandi Baru</button>
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
                        <h2 style="text-align: center; margin-bottom: 30px; color: var(--primary-color);">Pengaturan</h2>
                        
                        <div class="settings-group">
                            <h3>🎨 Tampilan</h3>
                            <div class="setting-item">
                                <div class="setting-info">
                                    <h4>Mode Gelap</h4>
                                    <p>Aktifkan tema gelap untuk kenyamanan mata</p>
                                </div>
                                <label class="toggle-switch">
                                    <input type="checkbox" id="dark-mode-toggle">
                                    <span class="toggle-slider"></span>
                                </label>
                            </div>
                        </div>

                        <div class="settings-group">
                            <h3>ℹ️ Tentang</h3>
                            <div class="setting-item">
                                <div class="setting-info">
                                    <h4>Versi Aplikasi</h4>
                                    <p>ZapTools v1.0.0</p>
                                </div>
                            </div>
                            <div class="setting-item">
                                <div class="setting-info">
                                    <h4>Pengembang</h4>
                                    <p>Dibuat dengan ❤️ untuk kemudahan Anda</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }
};