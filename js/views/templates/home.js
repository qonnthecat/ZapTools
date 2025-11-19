// js/views/templates/home.js
export const HomeTemplate = () => {
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
};