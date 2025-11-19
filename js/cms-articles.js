// CMS ARTICLES MANAGEMENT - DuniaBercerita

class CMSArticles {
    constructor() {
        this.container = document.getElementById('articles-list');
        this.statsContainer = {
            totalArticles: document.getElementById('total-articles'),
            totalCategories: document.getElementById('total-categories'),
            latestArticle: document.getElementById('latest-article')
        };
        this.init();
    }

    async init() {
        await this.waitForCMSReady();
        this.setupEventListeners();
        this.loadArticlesList();
        this.updateStats();
    }

    async waitForCMSReady() {
        return new Promise((resolve) => {
            if (window.cmsCore && window.cmsCore.isInitialized) {
                resolve();
            } else {
                document.addEventListener('cms:articlesLoaded', resolve, { once: true });
            }
        });
    }

    setupEventListeners() {
        // Listen for CMS events
        window.cmsCore.on('articleCreated', () => this.handleArticlesChange());
        window.cmsCore.on('articleUpdated', () => this.handleArticlesChange());
        window.cmsCore.on('articleDeleted', () => this.handleArticlesChange());
        window.cmsCore.on('articlesImported', () => this.handleArticlesChange());

        // Listen for editor events
        document.addEventListener('editor:articleCreated', () => this.handleArticlesChange());
        document.addEventListener('editor:articleUpdated', () => this.handleArticlesChange());
    }

    handleArticlesChange() {
        this.loadArticlesList();
        this.updateStats();
        
        // Update search index if search system exists
        if (window.searchSystem) {
            window.searchSystem.updateArticles(window.cmsCore.articles);
        }
    }

    loadArticlesList() {
        if (!this.container) return;

        const articles = window.cmsCore.articles;

        if (!articles || articles.length === 0) {
            this.showEmptyState();
            return;
        }

        this.container.innerHTML = articles.map(article => `
            <div class="article-item" data-article-id="${article.id}">
                <div class="article-info">
                    <h3>${Utils.sanitizeInput(article.title)}</h3>
                    <p class="article-meta">
                        <i class="fas fa-user"></i> ${Utils.sanitizeInput(article.author)} 
                        • <i class="fas fa-calendar"></i> ${Utils.formatDate(article.date)}
                        • <i class="fas fa-tag"></i> ${this.formatCategory(article.category)}
                        ${article.readTime ? `• <i class="fas fa-clock"></i> ${article.readTime} menit` : ''}
                    </p>
                    <p>${Utils.sanitizeInput(article.excerpt)}</p>
                    <div class="article-tags">
                        ${article.tags ? article.tags.map(tag => 
                            `<span class="tag">${Utils.sanitizeInput(tag)}</span>`
                        ).join('') : ''}
                    </div>
                </div>
                <div class="article-actions">
                    <button class="btn btn-small btn-secondary" onclick="window.cmsArticles.editArticle('${article.id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-small btn-danger" onclick="window.cmsArticles.deleteArticle('${article.id}')">
                        <i class="fas fa-trash"></i> Hapus
                    </button>
                    <button class="btn btn-small btn-info" onclick="window.cmsArticles.viewArticle('${article.id}')">
                        <i class="fas fa-eye"></i> Lihat
                    </button>
                </div>
            </div>
        `).join('');

        this.addSortingFunctionality();
    }

    showEmptyState() {
        if (!this.container) return;

        this.container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-newspaper"></i>
                <h3>Belum ada artikel</h3>
                <p>Mulai dengan membuat artikel pertama Anda!</p>
                <button class="btn btn-primary" onclick="window.cmsEditor.clearForm()">
                    <i class="fas fa-plus"></i> Buat Artikel Pertama
                </button>
            </div>
        `;
    }

    addSortingFunctionality() {
        // Bisa ditambahkan sorting functionality di sini
        // Untuk sekarang, articles sudah diurutkan berdasarkan tanggal (terbaru dulu)
    }

    updateStats() {
        const stats = window.cmsCore.getStats();

        if (this.statsContainer.totalArticles) {
            this.statsContainer.totalArticles.textContent = stats.totalArticles;
        }

        if (this.statsContainer.totalCategories) {
            this.statsContainer.totalCategories.textContent = stats.totalCategories;
        }

        if (this.statsContainer.latestArticle) {
            this.statsContainer.latestArticle.textContent = 
                stats.latestArticle ? Utils.formatDate(stats.latestArticle.date) : '-';
        }

        // Update charts jika ada
        this.updateCharts(stats);
    }

    updateCharts(stats) {
        // Implementasi chart untuk stats
        // Bisa menggunakan Chart.js atau library lainnya
        console.log('Stats for charts:', stats);
    }

    // Article Actions
    editArticle(articleId) {
        if (window.cmsEditor) {
            window.cmsEditor.editArticle(articleId);
        } else {
            Utils.showNotification('Editor tidak tersedia', 'error');
        }
    }

    async deleteArticle(articleId) {
        const article = window.cmsCore.getArticle(articleId);
        if (!article) {
            Utils.showNotification('Artikel tidak ditemukan', 'error');
            return;
        }

        if (!confirm(`Apakah Anda yakin ingin menghapus artikel "${article.title}"? Tindakan ini tidak dapat dibatalkan.`)) {
            return;
        }

        try {
            await window.cmsCore.deleteArticle(articleId);
            Utils.showNotification(`Artikel "${article.title}" berhasil dihapus`, 'success');
        } catch (error) {
            Utils.showNotification(`Gagal menghapus artikel: ${error.message}`, 'error');
            console.error('Delete article error:', error);
        }
    }

    viewArticle(articleId) {
        window.open(`article.html?id=${articleId}`, '_blank');
    }

    // Bulk Actions
    async deleteSelectedArticles() {
        const selectedArticles = this.getSelectedArticles();
        if (selectedArticles.length === 0) {
            Utils.showNotification('Tidak ada artikel yang dipilih', 'warning');
            return;
        }

        if (!confirm(`Apakah Anda yakin ingin menghapus ${selectedArticles.length} artikel?`)) {
            return;
        }

        try {
            for (const articleId of selectedArticles) {
                await window.cmsCore.deleteArticle(articleId);
            }
            
            Utils.showNotification(
                `${selectedArticles.length} artikel berhasil dihapus`, 
                'success'
            );
        } catch (error) {
            Utils.showNotification(`Gagal menghapus artikel: ${error.message}`, 'error');
        }
    }

    getSelectedArticles() {
        const checkboxes = document.querySelectorAll('.article-checkbox:checked');
        return Array.from(checkboxes).map(cb => cb.value);
    }

    // Export/Import
    async exportArticles() {
        try {
            await window.cmsCore.exportArticles();
            Utils.showNotification('Artikel berhasil diexport', 'success');
        } catch (error) {
            Utils.showNotification(`Gagal export artikel: ${error.message}`, 'error');
        }
    }

    async importArticles(event) {
        const file = event.target.files[0];
        if (!file) return;

        if (!file.name.endsWith('.json')) {
            Utils.showNotification('File harus berupa JSON', 'error');
            return;
        }

        try {
            const text = await this.readFileAsText(file);
            const success = await window.cmsCore.importArticles(text);
            
            if (success) {
                Utils.showNotification('Artikel berhasil diimport', 'success');
                // Reset file input
                event.target.value = '';
            }
        } catch (error) {
            Utils.showNotification(`Gagal import artikel: ${error.message}`, 'error');
        }
    }

    readFileAsText(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = e => resolve(e.target.result);
            reader.onerror = reject;
            reader.readAsText(file);
        });
    }

    // Search and Filter
    searchArticles(query) {
        if (!query || query.length < 2) {
            this.loadArticlesList();
            return;
        }

        const results = window.cmsCore.searchArticles(query, {
            searchInTitle: true,
            searchInContent: true,
            searchInExcerpt: true,
            searchInTags: true
        });

        this.displaySearchResults(results, query);
    }

    displaySearchResults(results, query) {
        if (!this.container) return;

        if (results.length === 0) {
            this.container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-search"></i>
                    <h3>Tidak ditemukan hasil untuk "${query}"</h3>
                    <button class="btn btn-secondary" onclick="window.cmsArticles.loadArticlesList()">
                        Tampilkan Semua Artikel
                    </button>
                </div>
            `;
            return;
        }

        this.container.innerHTML = results.map(article => `
            <div class="article-item search-result" data-article-id="${article.id}">
                <div class="article-info">
                    <h3>${Utils.highlightText(article.title, query)}</h3>
                    <p class="article-meta">
                        <i class="fas fa-user"></i> ${article.author} 
                        • <i class="fas fa-calendar"></i> ${Utils.formatDate(article.date)}
                        • <i class="fas fa-tag"></i> ${this.formatCategory(article.category)}
                    </p>
                    <p>${Utils.highlightText(article.excerpt, query)}</p>
                    <div class="search-highlight">
                        Ditemukan dalam: 
                        ${this.getSearchContext(article, query)}
                    </div>
                </div>
                <div class="article-actions">
                    <button class="btn btn-small btn-secondary" onclick="window.cmsArticles.editArticle('${article.id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-small btn-info" onclick="window.cmsArticles.viewArticle('${article.id}')">
                        <i class="fas fa-eye"></i> Lihat
                    </button>
                </div>
            </div>
        `).join('');
    }

    getSearchContext(article, query) {
        const contexts = [];
        const queryLower = query.toLowerCase();

        if (article.title.toLowerCase().includes(queryLower)) {
            contexts.push('Judul');
        }
        if (article.excerpt.toLowerCase().includes(queryLower)) {
            contexts.push('Ringkasan');
        }
        if (article.content.toLowerCase().includes(queryLower)) {
            contexts.push('Konten');
        }
        if (article.tags && article.tags.some(tag => tag.toLowerCase().includes(queryLower))) {
            contexts.push('Tags');
        }

        return contexts.join(', ');
    }

    filterByCategory(category) {
        const articles = category ? 
            window.cmsCore.getArticlesByCategory(category) : 
            window.cmsCore.articles;

        this.displayFilteredArticles(articles, category);
    }

    displayFilteredArticles(articles, category) {
        if (!this.container) return;

        if (articles.length === 0) {
            this.container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-filter"></i>
                    <h3>Tidak ada artikel dalam kategori "${this.formatCategory(category)}"</h3>
                    <button class="btn btn-secondary" onclick="window.cmsArticles.loadArticlesList()">
                        Tampilkan Semua Artikel
                    </button>
                </div>
            `;
            return;
        }

        this.container.innerHTML = articles.map(article => `
            <div class="article-item" data-article-id="${article.id}">
                <div class="article-info">
                    <h3>${Utils.sanitizeInput(article.title)}</h3>
                    <p class="article-meta">
                        <i class="fas fa-user"></i> ${Utils.sanitizeInput(article.author)} 
                        • <i class="fas fa-calendar"></i> ${Utils.formatDate(article.date)}
                        • <i class="fas fa-tag"></i> ${this.formatCategory(article.category)}
                    </p>
                    <p>${Utils.sanitizeInput(article.excerpt)}</p>
                </div>
                <div class="article-actions">
                    <button class="btn btn-small btn-secondary" onclick="window.cmsArticles.editArticle('${article.id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-small btn-danger" onclick="window.cmsArticles.deleteArticle('${article.id}')">
                        <i class="fas fa-trash"></i> Hapus
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Utility Methods
    formatCategory(category) {
        const categoryMap = {
            'berita': 'Berita',
            'fakta-unik': 'Fakta Unik',
            'inovasi': 'Inovasi',
            'tips': 'Tips Praktis',
            'teknologi': 'Teknologi',
            'sains': 'Sains',
            'kesehatan': 'Kesehatan',
            'budaya': 'Budaya'
        };
        return categoryMap[category] || category;
    }

    // Cleanup
    destroy() {
        // Cleanup event listeners jika diperlukan
    }
}

// Global Articles instance
window.cmsArticles = new CMSArticles();

// Export untuk penggunaan modular
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CMSArticles;
}