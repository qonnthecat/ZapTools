// js/views/templates/home.js
import { CardComponents } from '../components/cards.js';

export const HomeTemplate = () => {
    const featureCards = [
        {
            icon: '📋',
            title: 'home.allFeatures',
            description: 'home.welcomeSubtitle',
            route: 'features'
        },
        {
            icon: '🖼️',
            title: 'home.imageConversion',
            description: 'home.imageConversionDesc',
            route: 'image-converter'
        },
        {
            icon: '📝',
            title: 'home.textConversion',
            description: 'home.textConversionDesc',
            route: 'text-converter'
        },
        {
            icon: '🎨',
            title: 'home.colorTools',
            description: 'home.colorToolsDesc',
            route: 'color-tools'
        }
    ];

    const featureCardsHTML = featureCards.map(card => 
        CardComponents.renderFeatureCard(card)
    ).join('');

    return `
        <section id="home" class="section active">
            <div class="container">
                <div class="hero">
                    <h2 data-i18n="home.welcomeTitle">Welcome to ZapTools</h2>
                    <p data-i18n="home.welcomeSubtitle">A collection of practical online tools for everyday needs</p>
                    <div class="feature-grid">
                        ${featureCardsHTML}
                    </div>
                </div>
            </div>
        </section>
    `;
};