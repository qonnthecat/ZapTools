// js/views/templates/image-converter.js
export const ImageConverterTemplate = () => {
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
};