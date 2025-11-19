// CMS CORE FUNCTIONALITY - DuniaBercerita

class CMSCore {
    constructor() {
        this.articles = [];
        this.currentArticle = null;
        this.ARTICLES_DATA_URL = 'data/articles.json';
        this.STORAGE_KEY = 'duniabercerita_articles';
        this.DRAFT_KEY = 'duniabercerita_article_draft';
        this.isInitialized = false;
    }

    async initialize() {
        if (this.isInitialized) return;

        try {
            await this.loadArticles();
            this.isInitialized = true;
            this.dispatchEvent('cmsInitialized', { articles: this.articles });
        } catch (error) {
            console.error('CMS initialization failed:', error);
            this.dispatchEvent('cmsError', { error: error });
            throw error;
        }
    }

    async loadArticles() {
        try {
            // Coba load dari localStorage dulu untuk performance
            const cachedArticles = Utils.loadFromStorage(this.STORAGE_KEY);
            
            if (cachedArticles && cachedArticles.length > 0) {
                this.articles = cachedArticles;
                console.log('Loaded articles from cache:', this.articles.length);
            }

            // Always try to load from server for fresh data
            const serverArticles = await Utils.loadJSON(this.ARTICLES_DATA_URL);
            
            if (serverArticles && serverArticles.length > 0) {
                this.articles = serverArticles;
                Utils.saveToStorage(this.STORAGE_KEY, this.articles);
                console.log('Loaded articles from server:', this.articles.length);
            }

            if (this.articles.length === 0) {
                console.warn('No articles found, using sample data');
                this.articles = this.getSampleArticles();
                Utils.saveToStorage(this.STORAGE_KEY, this.articles);
            }

            this.dispatchEvent('articlesLoaded', { articles: this.articles });
            return this.articles;

        } catch (error) {
            console.error('Error loading articles:', error);
            
            // Fallback to cached or sample data
            const cachedArticles = Utils.loadFromStorage(this.STORAGE_KEY);
            if (cachedArticles && cachedArticles.length > 0) {
                this.articles = cachedArticles;
                console.log('Using cached articles as fallback');
            } else {
                this.articles = this.getSampleArticles();
                Utils.saveToStorage(this.STORAGE_KEY, this.articles);
                console.log('Using sample articles as fallback');
            }

            this.dispatchEvent('articlesLoaded', { articles: this.articles });
            return this.articles;
        }
    }

    async saveArticles() {
        try {
            Utils.saveToStorage(this.STORAGE_KEY, this.articles);
            
            // In real application, you would send to server here
            // await this.syncWithServer();
            
            this.dispatchEvent('articlesSaved', { articles: this.articles });
            return true;
        } catch (error) {
            console.error('Error saving articles:', error);
            this.dispatchEvent('cmsError', { error: error });
            return false;
        }
    }

    // Article CRUD Operations
    async createArticle(articleData) {
        const validation = this.validateArticle(articleData);
        if (!validation.isValid) {
            throw new Error(validation.errors.join(', '));
        }

        const article = {
            ...articleData,
            id: Utils.generateId(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        this.articles.unshift(article);
        await this.saveArticles();

        this.dispatchEvent('articleCreated', { article });
        return article;
    }

    async updateArticle(articleId, updates) {
        const index = this.articles.findIndex(article => article.id === articleId);
        if (index === -1) {
            throw new Error('Article not found');
        }

        const validation = this.validateArticle(updates, true);
        if (!validation.isValid) {
            throw new Error(validation.errors.join(', '));
        }

        this.articles[index] = {
            ...this.articles[index],
            ...updates,
            updatedAt: new Date().toISOString()
        };

        await this.saveArticles();

        this.dispatchEvent('articleUpdated', { 
            article: this.articles[index],
            previous: this.articles[index]
        });

        return this.articles[index];
    }

    async deleteArticle(articleId) {
        const index = this.articles.findIndex(article => article.id === articleId);
        if (index === -1) {
            throw new Error('Article not found');
        }

        const deletedArticle = this.articles.splice(index, 1)[0];
        await this.saveArticles();

        this.dispatchEvent('articleDeleted', { article: deletedArticle });
        return deletedArticle;
    }

    // Article retrieval
    getArticle(articleId) {
        return this.articles.find(article => article.id === articleId);
    }

    getArticlesByCategory(category) {
        if (!category) return this.articles;
        return this.articles.filter(article => article.category === category);
    }

    getRecentArticles(limit = 5) {
        return this.articles
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, limit);
    }

    getCategories() {
        const categories = [...new Set(this.articles.map(article => article.category))];
        return categories.sort();
    }

    getTags() {
        const allTags = this.articles.flatMap(article => article.tags || []);
        const uniqueTags = [...new Set(allTags)];
        return uniqueTags.sort();
    }

    // Validation
    validateArticle(articleData, isUpdate = false) {
        const errors = [];
        const data = articleData;

        if (!isUpdate || data.title !== undefined) {
            if (!data.title || data.title.trim().length === 0) {
                errors.push('Judul artikel harus diisi');
            } else if (data.title.length < 5) {
                errors.push('Judul artikel terlalu pendek (minimal 5 karakter)');
            } else if (data.title.length > 200) {
                errors.push('Judul artikel terlalu panjang (maksimal 200 karakter)');
            }
        }

        if (!isUpdate || data.author !== undefined) {
            if (!data.author || data.author.trim().length === 0) {
                errors.push('Penulis harus diisi');
            }
        }

        if (!isUpdate || data.category !== undefined) {
            if (!data.category) {
                errors.push('Kategori harus dipilih');
            }
        }

        if (!isUpdate || data.content !== undefined) {
            if (!data.content || data.content.trim().length === 0) {
                errors.push('Konten artikel harus diisi');
            } else if (data.content.length < 50) {
                errors.push('Konten artikel terlalu pendek (minimal 50 karakter)');
            }
        }

        if (data.image && !Utils.isValidImageUrl(data.image)) {
            errors.push('URL gambar tidak valid');
        }

        if (data.tags && data.tags.length > 10) {
            errors.push('Maksimal 10 tags diperbolehkan');
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    // Draft management
    saveDraft(articleData) {
        const draft = {
            ...articleData,
            lastSaved: new Date().toISOString()
        };
        Utils.saveToStorage(this.DRAFT_KEY, draft);
        this.dispatchEvent('draftSaved', { draft });
    }

    loadDraft() {
        return Utils.loadFromStorage(this.DRAFT_KEY);
    }

    clearDraft() {
        localStorage.removeItem(this.DRAFT_KEY);
        this.dispatchEvent('draftCleared');
    }

    hasDraft() {
        return !!Utils.loadFromStorage(this.DRAFT_KEY);
    }

    // Statistics
    getStats() {
        const totalArticles = this.articles.length;
        const categories = this.getCategories();
        const tags = this.getTags();
        const latestArticle = this.articles[0];
        
        // Calculate articles per category
        const articlesByCategory = {};
        categories.forEach(category => {
            articlesByCategory[category] = this.getArticlesByCategory(category).length;
        });

        // Calculate monthly stats
        const monthlyStats = this.calculateMonthlyStats();

        return {
            totalArticles,
            totalCategories: categories.length,
            totalTags: tags.length,
            latestArticle: latestArticle ? {
                title: latestArticle.title,
                date: latestArticle.date
            } : null,
            articlesByCategory,
            monthlyStats
        };
    }

    calculateMonthlyStats() {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const recentArticles = this.articles.filter(article => 
            new Date(article.date) >= sixMonthsAgo
        );

        const monthlyCount = {};
        recentArticles.forEach(article => {
            const month = new Date(article.date).toLocaleDateString('id-ID', { 
                year: 'numeric', 
                month: 'long' 
            });
            monthlyCount[month] = (monthlyCount[month] || 0) + 1;
        });

        return monthlyCount;
    }

    // Search functionality
    searchArticles(query, options = {}) {
        const {
            searchInTitle = true,
            searchInContent = true,
            searchInExcerpt = true,
            searchInTags = true,
            searchInAuthor = false,
            category = null,
            limit = 10
        } = options;

        if (!query || query.length < 2) {
            return [];
        }

        const searchTerm = query.toLowerCase();
        let results = this.articles;

        // Filter by category if specified
        if (category) {
            results = results.filter(article => article.category === category);
        }

        // Search in specified fields
        results = results.filter(article => {
            let match = false;

            if (searchInTitle && article.title.toLowerCase().includes(searchTerm)) {
                match = true;
            }
            if (searchInContent && article.content.toLowerCase().includes(searchTerm)) {
                match = true;
            }
            if (searchInExcerpt && article.excerpt.toLowerCase().includes(searchTerm)) {
                match = true;
            }
            if (searchInTags && article.tags) {
                match = match || article.tags.some(tag => 
                    tag.toLowerCase().includes(searchTerm)
                );
            }
            if (searchInAuthor && article.author.toLowerCase().includes(searchTerm)) {
                match = true;
            }

            return match;
        });

        return results.slice(0, limit);
    }

    // Event system
    dispatchEvent(eventName, detail = {}) {
        const event = new CustomEvent(`cms:${eventName}`, { 
            detail: { ...detail, timestamp: new Date() }
        });
        document.dispatchEvent(event);
    }

    on(eventName, callback) {
        document.addEventListener(`cms:${eventName}`, callback);
    }

    off(eventName, callback) {
        document.removeEventListener(`cms:${eventName}`, callback);
    }

    // Sample data for fallback
    getSampleArticles() {
        return [
            {
                id: Utils.generateId(),
                title: "Selamat Datang di DuniaBercerita",
                author: "Admin",
                category: "berita",
                image: Utils.getDefaultImage(),
                content: "Ini adalah contoh artikel pertama Anda. Mulailah dengan membuat artikel baru melalui panel admin!",
                excerpt: "Selamat datang di platform DuniaBercerita Anda.",
                tags: ["selamat-datang", "panduan"],
                date: new Date().toISOString().split('T')[0],
                readTime: 1,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        ];
    }

    // Utility methods
    async exportArticles() {
        const data = {
            exportedAt: new Date().toISOString(),
            version: '1.0',
            articles: this.articles
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { 
            type: 'application/json' 
        });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `duniabercerita-articles-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    async importArticles(jsonData) {
        try {
            const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
            
            if (!data.articles || !Array.isArray(data.articles)) {
                throw new Error('Format data tidak valid');
            }

            // Validate each article
            for (const article of data.articles) {
                const validation = this.validateArticle(article);
                if (!validation.isValid) {
                    throw new Error(`Artikel tidak valid: ${validation.errors.join(', ')}`);
                }
            }

            this.articles = data.articles;
            await this.saveArticles();

            this.dispatchEvent('articlesImported', { 
                count: data.articles.length 
            });

            return true;
        } catch (error) {
            console.error('Error importing articles:', error);
            this.dispatchEvent('cmsError', { error });
            return false;
        }
    }
}

// Global CMS instance
window.cmsCore = new CMSCore();

// Auto-initialize
document.addEventListener('DOMContentLoaded', async function() {
    try {
        await window.cmsCore.initialize();
        console.log('CMS Core initialized successfully');
    } catch (error) {
        console.error('CMS Core initialization failed:', error);
    }
});

// Export untuk penggunaan modular
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CMSCore;
}