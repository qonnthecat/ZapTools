// js/views/templates/history.js
import { CardComponents } from '../components/cards.js';

export const HistoryTemplate = () => {
    return `
        <section id="history" class="section">
            <div class="container">
                <div class="history-container">
                    <h2 data-i18n="history.title" style="text-align: center; margin-bottom: 30px; color: var(--primary-color);">Conversion History</h2>
                    
                    <div class="history-actions">
                        <button id="clear-history" class="btn secondary" data-i18n="history.clearHistory">Clear History</button>
                    </div>

                    <div class="history-content">
                        <div id="history-list" class="history-list">
                            <!-- History items will be dynamically loaded here -->
                            <div class="empty-state" id="empty-history">
                                <div class="empty-icon">📊</div>
                                <h3 data-i18n="history.noHistory">No conversion history yet</h3>
                                <p>Your recent conversions will appear here</p>
                            </div>
                        </div>
                    </div>

                    <div class="history-stats">
                        <div class="stat-card">
                            <div class="stat-icon">🖼️</div>
                            <div class="stat-info">
                                <span class="stat-number" id="image-count">0</span>
                                <span class="stat-label" data-i18n="history.imageConversion">Image Conversions</span>
                            </div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-icon">📝</div>
                            <div class="stat-info">
                                <span class="stat-number" id="text-count">0</span>
                                <span class="stat-label" data-i18n="history.textConversion">Text Conversions</span>
                            </div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-icon">🎨</div>
                            <div class="stat-info">
                                <span class="stat-number" id="color-count">0</span>
                                <span class="stat-label" data-i18n="history.colorTool">Color Tools</span>
                            </div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-icon">🔐</div>
                            <div class="stat-info">
                                <span class="stat-number" id="password-count">0</span>
                                <span class="stat-label" data-i18n="history.passwordGeneration">Password Generations</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    `;
};