// js/tools/password-generator/template.js
export const PasswordGeneratorTemplate = () => {
    return `
        <section id="password-generator" class="section">
            <div class="container">
                <div class="tool-section">
                    <h2 data-i18n="passwordGenerator.title">Password Generator</h2>
                    <div class="tool-card">
                        <h3 data-i18n="passwordGenerator.createStrongPassword">Create Strong Password</h3>
                        <div class="password-generator">
                            <div class="password-display">
                                <input type="text" id="password-output" readonly>
                                <button id="copy-password" class="btn icon">📋</button>
                            </div>
                            <div class="password-strength">
                                <div class="strength-meter">
                                    <div class="strength-bar" id="strength-bar"></div>
                                </div>
                                <span id="strength-text" data-i18n="passwordGenerator.strength">Strength</span>
                            </div>
                            <div class="password-options">
                                <label>
                                    <input type="number" id="password-length" min="6" max="32" value="12">
                                    <span data-i18n="passwordGenerator.length">Length</span>
                                </label>
                                <label>
                                    <input type="checkbox" id="include-uppercase" checked>
                                    <span data-i18n="passwordGenerator.includeUppercase">Uppercase Letters</span>
                                </label>
                                <label>
                                    <input type="checkbox" id="include-numbers" checked>
                                    <span data-i18n="passwordGenerator.includeNumbers">Numbers</span>
                                </label>
                                <label>
                                    <input type="checkbox" id="include-symbols">
                                    <span data-i18n="passwordGenerator.includeSymbols">Symbols</span>
                                </label>
                            </div>
                            <button id="generate-password" class="btn primary" data-i18n="passwordGenerator.generatePassword">Generate New Password</button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    `;
};

export default PasswordGeneratorTemplate;