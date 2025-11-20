// js/views/templates/home.js
import { CardComponents } from '../components/cards.js';

export const HomeTemplate = () => {
    const featureCards = [
        {
            icon: '🚀',
            title: 'home.allFeatures',
            description: 'home.welcomeSubtitle',
            route: 'features',
            accentColor: '#667eea',
            badge: 'popular'
        },
        {
            icon: '🖼️',
            title: 'home.imageConversion',
            description: 'home.imageConversionDesc',
            route: 'image-converter',
            accentColor: '#fc8181',
            badge: 'new'
        },
        {
            icon: '📝',
            title: 'home.textConversion',
            description: 'home.textConversionDesc',
            route: 'text-converter',
            accentColor: '#68d391'
        },
        {
            icon: '🎨',
            title: 'home.colorTools',
            description: 'home.colorToolsDesc',
            route: 'color-tools',
            accentColor: '#f6ad55'
        }
    ];

    const featureCardsHTML = featureCards.map((card, index) => 
        CardComponents.renderFeatureCard({...card, animationDelay: index * 100})
    ).join('');

    return `
        <section id="home" class="section active">
            <div class="home-container">
                <!-- Hero Section -->
                <div class="home-hero">
                    <div class="hero-content">
                        <h1 class="hero-title" data-i18n="home.welcomeTitle">
                            Selamat Datang di ZapTools
                        </h1>
                        <p class="hero-subtitle" data-i18n="home.welcomeSubtitle">
                            Kumpulan alat bantu online yang praktis untuk kebutuhan sehari-hari
                        </p>
                        <div class="hero-stats">
                            <div class="stat">
                                <span class="stat-number">4+</span>
                                <span class="stat-label">Alat Tersedia</span>
                            </div>
                            <div class="stat">
                                <span class="stat-number">100%</span>
                                <span class="stat-label">Gratis</span>
                            </div>
                            <div class="stat">
                                <span class="stat-number">⚡</span>
                                <span class="stat-label">Cepat</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Features Grid -->
                <div class="home-features">
                    <div class="features-header">
                        <h2 class="features-title">Alat yang Tersedia</h2>
                        <p class="features-subtitle">Pilih alat yang Anda butuhkan</p>
                    </div>
                    
                    <div class="features-grid">
                        ${featureCardsHTML}
                    </div>
                </div>

                <!-- CTA Section -->
                <div class="home-cta">
                    <div class="cta-content">
                        <h3 class="cta-title">Butuh alat lainnya?</h3>
                        <p class="cta-text">Sarankan fitur baru untuk pengembangan selanjutnya</p>
                        <button class="cta-button" onclick="showFeatureRequest()">
                            💡 Sarankan Fitur
                        </button>
                    </div>
                </div>
            </div>
        </section>
    `;
};