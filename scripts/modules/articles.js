class ArticlesModule {
    constructor() {
        this.articles = [];
    }

    // Ambil artikel dari database
    async loadFeaturedArticles() {
        try {
            const response = await fetch(`${API_BASE}/articles`);
            this.articles = await response.json();
            this.displayFeaturedArticles();
        } catch (error) {
            console.error('Error loading articles:', error);
        }
    }

    // Tampilkan artikel di homepage
    displayFeaturedArticles() {
        const container = document.getElementById('featuredArticles');
        if (!container) return;

        const featured = this.articles.slice(0, 6); // Ambil 6 artikel pertama
        container.innerHTML = featured.map(article => `
            <div class="article-card">
                <img src="${article.image || '/assets/images/default-article.jpg'}" 
                     alt="${article.title}" class="article-image">
                <div class="article-content">
                    <h3 class="article-title">${article.title}</h3>
                    <p class="article-excerpt">${article.excerpt}</p>
                    <div class="article-meta">
                        <span>${this.formatDate(article.created_at)}</span>
                        <span>${article.category}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Format tanggal
    formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    }

    // Cari artikel
    async searchArticles(query) {
        try {
            const response = await fetch(`${API_BASE}/articles/search?q=${encodeURIComponent(query)}`);
            return await response.json();
        } catch (error) {
            console.error('Error searching articles:', error);
            return [];
        }
    }
}

// Initialize articles module
const articlesModule = new ArticlesModule();