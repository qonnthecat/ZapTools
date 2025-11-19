// js/views/templates/text-converter.js
export const TextConverterTemplate = () => {
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
};