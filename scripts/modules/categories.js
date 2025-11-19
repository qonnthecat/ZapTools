class CategoriesModule {
    constructor() {
        this.categories = [
            { id: 1, name: 'Alam & Lingkungan', icon: '🌿' },
            { id: 2, name: 'Budaya & Tradisi', icon: '🎎' },
            { id: 3, name: 'Sejarah & Peradaban', icon: '🏛️' },
            { id: 4, name: 'Teknologi & Inovasi', icon: '💻' },
            { id: 5, name: 'Sains & Pengetahuan', icon: '🔬' },
            { id: 6, name: 'Sosial & Kemanusiaan', icon: '🤝' },
            { id: 7, name: 'Wisata & Travel', icon: '✈️' }
        ];
    }

    // Tampilkan kategori di homepage
    displayCategories() {
        const container = document.getElementById('categoriesList');
        if (!container) return;

        container.innerHTML = this.categories.map(category => `
            <a href="/pages/categories/index.html?category=${category.id}" class="category-card">
                <div class="category-icon">${category.icon}</div>
                <h3>${category.name}</h3>
            </a>
        `).join('');
    }
}

// Initialize categories module
const categoriesModule = new CategoriesModule();