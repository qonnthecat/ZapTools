// js/views/templates/footer.js
export const FooterTemplate = () => {
    return `
        <footer class="footer">
            <div class="container">
                <div class="footer-content">
                    <div class="footer-logo">
                        <img src="images/logos/transparent.png" alt="ZapTools" class="footer-logo-image">
                        <span data-i18n="app.title">ZapTools</span>
                    </div>
                    <p data-i18n="app.copyright">© 2023 ZapTools. All rights reserved.</p>
                </div>
            </div>
        </footer>
    `;
};