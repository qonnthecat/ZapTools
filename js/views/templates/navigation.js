// js/views/templates/navigation.js
export const NavigationTemplate = () => {
    return `
        <nav class="bottom-bar">
            <ul class="bottom-nav">
                <li class="bottom-nav-item">
                    <a href="#home" class="bottom-nav-link active">
                        <span class="bottom-nav-icon">🏠</span>
                        <span class="bottom-nav-text" data-i18n="navigation.home">Home</span>
                    </a>
                </li>
                <li class="bottom-nav-item">
                    <a href="#features" class="bottom-nav-link">
                        <span class="bottom-nav-icon">📋</span>
                        <span class="bottom-nav-text" data-i18n="navigation.features">Features</span>
                    </a>
                </li>
                <!-- HAPUS ITEM HISTORY -->
                <li class="bottom-nav-item">
                    <a href="#settings" class="bottom-nav-link">
                        <span class="bottom-nav-icon">⚙️</span>
                        <span class="bottom-nav-text" data-i18n="navigation.settings">Settings</span>
                    </a>
                </li>
            </ul>
        </nav>
    `;
};