// js/views/templates/home.js
import { CardComponents } from '../components/cards.js';
import { toolsLoader } from '../../../tools/index.js';

export const HomeTemplate = () => {
    const tools = toolsLoader.getAllTools();
    const featuredTools = tools.slice(0, 4);

    const featureCardsHTML = featuredTools.map((tool, index) => 
        CardComponents.renderFeatureCard({
            icon: tool.icon,
            title: tool.name,
            description: tool.description,
            route: tool.route,
            accentColor: getAccentColor(tool.category),
            animationDelay: index * 100
        })
    ).join('');

    return `
        <section id="home" class="section active">
            <div class="home-container">
                <div class="home-hero">
                    <div class="hero-content">
                        <h1 class="hero-title" data-i18n="home.welcomeTitle">Selamat Datang di ZapTools</h1>
                        <p class="hero-subtitle" data-i18n="home.welcomeSubtitle">Kumpulan alat bantu online yang praktis</p>
                        <div class="hero-stats">
                            <div class="stat">
                                <span class="stat-number">${tools.length}+</span>
                                <span class="stat-label">Alat Tersedia</span>
                            </div>
                            <div class="stat">
                                <span class="stat-number">${toolsLoader.getCategories().length}</span>
                                <span class="stat-label">Kategori</span>
                            </div>
                            <div class="stat">
                                <span class="stat-number">100%</span>
                                <span class="stat-label">Gratis</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="home-features">
                    <div class="features-header">
                        <h2 class="features-title">Alat Unggulan</h2>
                        <p class="features-subtitle">Pilih alat yang Anda butuhkan</p>
                    </div>
                    
                    <div class="features-grid">
                        ${featureCardsHTML}
                    </div>
                </div>

                ${tools.length > 4 ? `
                <div class="home-cta">
                    <div class="cta-content">
                        <h3 class="cta-title">Masih Ada Lagi!</h3>
                        <p class="cta-text">Jelajahi ${tools.length - 4} alat lainnya</p>
                        <button class="cta-button" onclick="window.dispatchEvent(new CustomEvent('navigate', { detail: 'features' }))">
                            📋 Lihat Semua Alat
                        </button>
                    </div>
                </div>
                ` : ''}
            </div>
        </section>
    `;
};

function getAccentColor(category) {
    const colorMap = {
        'generators': '#68d391',
        'designers': '#f6ad55', 
        'converters': '#fc8181',
        'analyzers': '#667eea'
    };
    return colorMap[category] || '#3498db';
}