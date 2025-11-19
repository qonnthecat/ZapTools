// js/views/templates/footer.js
import { LogoComponent } from '../components/logo.js';

export const FooterTemplate = () => {
    return `
        <footer class="footer">
            <div class="container">
                <div class="footer-content">
                    ${LogoComponent.renderFooter()}
                    <p data-i18n="app.copyright">© 2023 ZapTools. All rights reserved.</p>
                </div>
            </div>
        </footer>
    `;
};