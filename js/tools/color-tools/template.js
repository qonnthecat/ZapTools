// js/tools/color-tools/template.js
export const ColorToolsTemplate = () => {
    return `
        <section id="color-tools" class="section">
            <div class="container">
                <div class="tool-section">
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
};

export default ColorToolsTemplate;