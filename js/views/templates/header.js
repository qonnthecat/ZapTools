// js/views/templates/header.js
import { LogoComponent } from '../components/logo.js';

export const HeaderTemplate = () => {
    return `
        <header class="header">
            <div class="container">
                ${LogoComponent.render({
                    size: 'medium',
                    showText: true,
                    withGlow: true,
                    clickable: true
                })}
            </div>
        </header>
    `;
};