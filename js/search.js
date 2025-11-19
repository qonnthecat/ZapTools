// SEARCH SYSTEM - DuniaBercerita

class SearchSystem {
    constructor() {
        this.searchInput = document.getElementById('search-input');
        this.searchResults = document.getElementById('search-results');
        this.searchSubmit = document.getElementById('search-submit');
        this.articles = [];
        this.searchIndex = [];
        this.init();
    }

    async init() {
        await this.loadArticles();
        this.buildSearchIndex();
        this.bindEvents();
    }

    async loadArticles() {
        try {
            this.articles = await Utils.loadJSON('data/articles.json');
        } catch (error) {
            console.error('Error loading articles for search:', error);
            Utils.showNotification('Gagal memuat data pencarian', 'error');
            this.articles = [];
        }
    }

    buildSearchIndex() {
        this.searchIndex = this.articles.map(article => ({
            id: article.id,
            title: article.title.toLowerCase(),
            content: article.content.toLowerCase(),
            excerpt: article.excerpt.toLowerCase(),
            author: article.author.toLowerCase(),
            tags: article.tags ? article.tags.map(tag => tag.toLowerCase()) : [],
            category: article.category.toLowerCase()
        }));
    }

    bindEvents() {
        if (this.searchInput) {
            // Real-time search dengan debounce
            this.searchInput.addEventListener('input', 
                Utils.debounce((e) => this.handleSearch(e.target.value), 300)
            );

            // Focus event
            this.searchInput.addEventListener('focus', () => {
                if (this.searchInput.value.length >= 2) {
                    this.handleSearch(this.searchInput.value);
                }
            });

            // Enter key
            this.searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleSearch(this.searchInput.value, true);
                }
            });
        }

        if (this.searchSubmit) {
            this.searchSubmit.addEventListener('click', () => {
                this.handleSearch(this.searchInput.value, true);
            });
        }

        // Close results when clicking outside
        document.addEventListener('click', (e) => {
            if (this.searchResults && 
                !this.searchResults.contains(e.target) && 
                !this.searchInput.contains(e.target)) {
                this.hideResults();
            }
        });
    }

    handleSearch(query, isExplicit = false) {
        if (!query || query.length < 2) {
            this.hideResults();
            return;
        }

        const results = this.performSearch(query);
        this.displayResults(results, query);

        // Jika explicit search (Enter/button click), redirect ke search page
        if (isExplicit && results.length > 0) {
            this.redirectToSearchPage(query);
        }
    }

    performSearch(query) {
        const searchTerm = query.toLowerCase();
        const results = [];

        this.searchIndex.forEach((article, index) => {
            let score = 0;

            // Scoring system
            if (article.title.includes(searchTerm)) score += 10;
            if (article.tags.some(tag => tag.includes(searchTerm))) score += 8;
            if (article.author.includes(searchTerm)) score += 6;
            if (article.excerpt.includes(searchTerm)) score += 4;
            if (article.content.includes(searchTerm)) score += 2;
            if (article.category.includes(searchTerm)) score += 1;

            if (score > 0) {
                results.push({
                    ...this.articles[index],
                    score: score
                });
            }
        });

        // Sort by score (descending)
        return results.sort((a, b) => b.score - a.score).slice(0, 10); // Max 10 results
    }

    displayResults(results, query) {
        if (!this.searchResults) return;

        if (results.length === 0) {
            this.searchResults.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <p>Tidak ditemukan artikel untuk "${query}"</p>
                    <small>Coba dengan kata kunci yang berbeda</small>
                </div>
            `;
        } else {
            this.searchResults.innerHTML = results.map(article => `
                <div class="search-result-item" onclick="window.searchSystem.navigateToArticle('${article.id}')">
                    <h4>${Utils.highlightText(article.title, query)}</h4>
                    <p>${Utils.highlightText(article.excerpt, query)}</p>
                    <small class="article-meta">
                        <i class="fas fa-user"></i> ${article.author} 
                        • <i class="fas fa-calendar"></i> ${Utils.formatDate(article.date)}
                        ${article.readTime ? `• <i class="fas fa-clock"></i> ${article.readTime} menit` : ''}
                    </small>
                </div>
            `).join('');
        }

        this.showResults();
    }

    showResults() {
        if (this.searchResults) {
            this.searchResults.classList.add('active');
        }
    }

    hideResults() {
        if (this.searchResults) {
            this.searchResults.classList.remove('active');
        }
    }

    navigateToArticle(articleId) {
        window.location.href = `article.html?id=${articleId}`;
    }

    redirectToSearchPage(query) {
        // Untuk implementasi search page yang lebih advanced
        // window.location.href = `search.html?q=${encodeURIComponent(query)}`;
        
        // Untuk sekarang, cukup log saja
        console.log('Search query:', query);
    }

    // Update articles data (untuk real-time updates)
    updateArticles(newArticles) {
        this.articles = newArticles;
        this.buildSearchIndex();
    }

    // Clear search
    clearSearch() {
        if (this.searchInput) {
            this.searchInput.value = '';
        }
        this.hideResults();
    }
}

// Auto-initialize search system
document.addEventListener('DOMContentLoaded', async function() {
    window.searchSystem = new SearchSystem();
});

// Export untuk penggunaan modular
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SearchSystem;
}