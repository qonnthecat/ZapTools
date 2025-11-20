// js/views/templates/features.js
export const FeaturesTemplate = () => {
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
};