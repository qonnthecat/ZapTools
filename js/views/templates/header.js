// js/views/templates/header.js
export const HeaderTemplate = () => {
    return `
        <header class="header">
            <div class="container">
                <div class="logo">
                    <div class="logo-container">
                        <img src="images/logos/transparent.png" alt="ZapTools Logo" class="logo-image">
                        <div class="logo-text">
                            <h1 data-i18n="app.title">ZapTools</h1>
                            <p data-i18n="app.tagline">Practical online utility tools</p>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    `;
};