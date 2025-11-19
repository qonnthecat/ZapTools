// CMS EDITOR - DuniaBercerita

class CMSEditor {
    constructor() {
        this.form = document.getElementById('article-form');
        this.currentArticle = null;
        this.autoSaveInterval = null;
        this.isEditing = false;
        this.init();
    }

    async init() {
        if (!this.form) return;

        await this.waitForCMSReady();
        this.setupForm();
        this.setupEventListeners();
        this.setupAutoSave();
        this.loadDraft();
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

    setupForm() {
        // Add character counters
        this.addCharacterCounters();
        
        // Setup category options
        this.setupCategoryOptions();
        
        // Setup tag suggestions
        this.setupTagSuggestions();
        
        // Setup image preview
        this.setupImagePreview();
    }

    setupEventListeners() {
        // Form submission
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        // Real-time validation
        this.setupRealTimeValidation();

        // Image URL validation
        this.setupImageValidation();

        // Tag input handling
        this.setupTagInput();

        // Content formatting
        this.setupContentFormatting();
    }

    setupAutoSave() {
        // Auto-save every 30 seconds
        this.autoSaveInterval = setInterval(() => {
            if (this.hasUnsavedChanges()) {
                this.saveDraft();
            }
        }, 30000);

        // Also save on beforeunload
        window.addEventListener('beforeunload', (e) => {
            if (this.hasUnsavedChanges()) {
                this.saveDraft();
                // Optional: Show confirmation dialog
                // e.preventDefault();
                // e.returnValue = '';
            }
        });
    }

    async handleSubmit(e) {
        e.preventDefault();

        try {
            const formData = this.getFormData();
            
            if (this.isEditing) {
                await this.updateArticle(formData);
            } else {
                await this.createArticle(formData);
            }

        } catch (error) {
            Utils.showNotification(`Error: ${error.message}`, 'error');
            console.error('Form submission error:', error);
        }
    }

    getFormData() {
        const formData = new FormData(this.form);
        
        return {
            title: formData.get('title')?.trim() || '',
            author: formData.get('author')?.trim() || '',
            category: formData.get('category') || '',
            image: formData.get('image')?.trim() || '',
            content: formData.get('content')?.trim() || '',
            tags: Utils.parseTags(formData.get('tags') || ''),
            date: new Date().toISOString().split('T')[0],
            excerpt: Utils.generateExcerpt(formData.get('content') || ''),
            readTime: Utils.calculateReadTime(formData.get('content') || '')
        };
    }

    async createArticle(articleData) {
        this.showLoadingState();

        try {
            const article = await window.cmsCore.createArticle(articleData);
            
            Utils.showNotification(
                `Artikel "${article.title}" berhasil dibuat!`, 
                'success'
            );

            this.clearForm();
            this.clearDraft();
            this.updateUIAfterSubmit();

            // Dispatch custom event for other components
            this.dispatchEditorEvent('articleCreated', { article });

        } catch (error) {
            throw new Error(`Gagal membuat artikel: ${error.message}`);
        } finally {
            this.hideLoadingState();
        }
    }

    async updateArticle(articleData) {
        if (!this.currentArticle) return;

        this.showLoadingState();

        try {
            const article = await window.cmsCore.updateArticle(
                this.currentArticle.id, 
                articleData
            );
            
            Utils.showNotification(
                `Artikel "${article.title}" berhasil diperbarui!`, 
                'success'
            );

            this.clearForm();
            this.clearDraft();
            this.updateUIAfterSubmit();

            this.dispatchEditorEvent('articleUpdated', { article });

        } catch (error) {
            throw new Error(`Gagal memperbarui artikel: ${error.message}`);
        } finally {
            this.hideLoadingState();
        }
    }

    // Draft Management
    saveDraft() {
        const formData = this.getFormData();
        window.cmsCore.saveDraft(formData);
        
        // Show auto-save indicator
        this.showAutoSaveIndicator();
    }

    loadDraft() {
        const draft = window.cmsCore.loadDraft();
        if (draft) {
            this.populateForm(draft);
            Utils.showNotification(
                `Draft tersimpan dari ${Utils.formatDate(draft.lastSaved)} telah dimuat`,
                'info'
            );
        }
    }

    clearDraft() {
        window.cmsCore.clearDraft();
    }

    hasUnsavedChanges() {
        const formData = this.getFormData();
        return Object.values(formData).some(value => 
            value && value.toString().trim().length > 0
        );
    }

    // Form Utilities
    populateForm(data) {
        const fields = ['title', 'author', 'category', 'image', 'content', 'tags'];
        
        fields.forEach(field => {
            const element = document.getElementById(field);
            if (element && data[field] !== undefined) {
                if (field === 'tags' && Array.isArray(data[field])) {
                    element.value = data[field].join(', ');
                } else {
                    element.value = data[field] || '';
                }
            }
        });

        // Update character counters
        this.updateCharacterCounters();
        
        // Update image preview
        this.updateImagePreview(data.image);
    }

    clearForm() {
        this.form.reset();
        this.currentArticle = null;
        this.isEditing = false;
        this.updateSubmitButton();
        this.updateCharacterCounters();
        this.clearImagePreview();
    }

    editArticle(articleId) {
        const article = window.cmsCore.getArticle(articleId);
        if (!article) {
            Utils.showNotification('Artikel tidak ditemukan', 'error');
            return;
        }

        this.currentArticle = article;
        this.isEditing = true;
        this.populateForm(article);
        this.updateSubmitButton();

        Utils.showNotification(`Mengedit: ${article.title}`, 'info');

        // Scroll to form
        this.form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // UI Updates
    updateSubmitButton() {
        const submitBtn = this.form.querySelector('button[type="submit"]');
        if (!submitBtn) return;

        if (this.isEditing) {
            submitBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Perbarui Artikel';
            submitBtn.className = submitBtn.className.replace('btn-primary', 'btn-success');
        } else {
            submitBtn.innerHTML = '<i class="fas fa-save"></i> Simpan Artikel';
            submitBtn.className = submitBtn.className.replace('btn-success', 'btn-primary');
        }
    }

    showLoadingState() {
        const submitBtn = this.form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Menyimpan...';
        }
    }

    hideLoadingState() {
        const submitBtn = this.form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = false;
            this.updateSubmitButton();
        }
    }

    showAutoSaveIndicator() {
        // Create or update auto-save indicator
        let indicator = document.getElementById('auto-save-indicator');
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.id = 'auto-save-indicator';
            indicator.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: #4caf50;
                color: white;
                padding: 8px 12px;
                border-radius: 4px;
                font-size: 12px;
                z-index: 1000;
            `;
            document.body.appendChild(indicator);
        }

        indicator.textContent = `Disimpan ${new Date().toLocaleTimeString('id-ID')}`;
        indicator.style.display = 'block';

        setTimeout(() => {
            indicator.style.display = 'none';
        }, 2000);
    }

    updateUIAfterSubmit() {
        // Refresh articles list if exists
        if (typeof window.loadArticlesList === 'function') {
            window.loadArticlesList();
        }

        // Update stats if exists
        if (typeof window.updateStats === 'function') {
            window.updateStats();
        }
    }

    // Advanced Form Features
    addCharacterCounters() {
        const fields = [
            { id: 'title', max: 200 },
            { id: 'excerpt', max: 300 },
            { id: 'content', max: 10000 }
        ];

        fields.forEach(({ id, max }) => {
            const field = document.getElementById(id);
            if (!field) return;

            const counter = document.createElement('div');
            counter.className = 'character-counter';
            counter.style.cssText = `
                font-size: 12px;
                color: var(--meta-color);
                text-align: right;
                margin-top: 5px;
            `;

            field.parentNode.appendChild(counter);

            const updateCounter = () => {
                const length = field.value.length;
                counter.textContent = `${length}/${max} karakter`;
                counter.style.color = length > max ? '#f44336' : 'var(--meta-color)';
            };

            field.addEventListener('input', updateCounter);
            updateCounter();
        });
    }

    updateCharacterCounters() {
        document.querySelectorAll('.character-counter').forEach(counter => {
            const field = counter.previousElementSibling;
            if (field && field.value !== undefined) {
                const length = field.value.length;
                const max = counter.textContent.split('/')[1]?.replace(' karakter', '') || 0;
                counter.textContent = `${length}/${max} karakter`;
                counter.style.color = length > max ? '#f44336' : 'var(--meta-color)';
            }
        });
    }

    setupCategoryOptions() {
        const categorySelect = document.getElementById('category');
        if (!categorySelect) return;

        // Clear existing options except first
        while (categorySelect.children.length > 1) {
            categorySelect.removeChild(categorySelect.lastChild);
        }

        // Add categories from CMS
        const categories = window.cmsCore.getCategories();
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = this.formatCategoryName(category);
            categorySelect.appendChild(option);
        });
    }

    setupTagSuggestions() {
        const tagsInput = document.getElementById('tags');
        if (!tagsInput) return;

        let suggestions = document.getElementById('tag-suggestions');
        if (!suggestions) {
            suggestions = document.createElement('div');
            suggestions.id = 'tag-suggestions';
            suggestions.className = 'tag-suggestions';
            tagsInput.parentNode.appendChild(suggestions);
        }

        tagsInput.addEventListener('input', Utils.debounce(() => {
            this.showTagSuggestions(tagsInput.value);
        }, 300));

        tagsInput.addEventListener('blur', () => {
            setTimeout(() => suggestions.style.display = 'none', 200);
        });
    }

    showTagSuggestions(input) {
        const suggestions = document.getElementById('tag-suggestions');
        if (!suggestions || !input) {
            suggestions.style.display = 'none';
            return;
        }

        const allTags = window.cmsCore.getTags();
        const matchingTags = allTags.filter(tag => 
            tag.toLowerCase().includes(input.toLowerCase())
        ).slice(0, 5);

        if (matchingTags.length === 0) {
            suggestions.style.display = 'none';
            return;
        }

        suggestions.innerHTML = matchingTags.map(tag => `
            <div class="tag-suggestion" onclick="window.cmsEditor.addTag('${tag}')">
                ${tag}
            </div>
        `).join('');

        suggestions.style.display = 'block';
    }

    addTag(tag) {
        const tagsInput = document.getElementById('tags');
        const currentTags = Utils.parseTags(tagsInput.value);
        
        if (!currentTags.includes(tag)) {
            currentTags.push(tag);
            tagsInput.value = currentTags.join(', ');
        }

        document.getElementById('tag-suggestions').style.display = 'none';
        tagsInput.focus();
    }

    setupImagePreview() {
        const imageInput = document.getElementById('image');
        if (!imageInput) return;

        let preview = document.getElementById('image-preview');
        if (!preview) {
            preview = document.createElement('div');
            preview.id = 'image-preview';
            preview.className = 'image-preview';
            imageInput.parentNode.appendChild(preview);
        }

        imageInput.addEventListener('blur', () => {
            this.updateImagePreview(imageInput.value);
        });
    }

    updateImagePreview(imageUrl) {
        const preview = document.getElementById('image-preview');
        if (!preview) return;

        if (imageUrl && Utils.isValidImageUrl(imageUrl)) {
            preview.innerHTML = `
                <img src="${imageUrl}" alt="Preview" onerror="this.style.display='none'">
                <small>Preview Gambar</small>
            `;
            preview.style.display = 'block';
        } else {
            preview.style.display = 'none';
        }
    }

    clearImagePreview() {
        const preview = document.getElementById('image-preview');
        if (preview) {
            preview.style.display = 'none';
        }
    }

    setupRealTimeValidation() {
        const fields = ['title', 'author', 'content'];
        
        fields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.addEventListener('blur', () => {
                    this.validateField(fieldId, field.value);
                });
            }
        });
    }

    validateField(fieldId, value) {
        // Simple validation logic
        switch (fieldId) {
            case 'title':
                if (!value || value.length < 5) {
                    this.showFieldError(fieldId, 'Judul harus minimal 5 karakter');
                } else {
                    this.clearFieldError(fieldId);
                }
                break;
            case 'author':
                if (!value) {
                    this.showFieldError(fieldId, 'Penulis harus diisi');
                } else {
                    this.clearFieldError(fieldId);
                }
                break;
            case 'content':
                if (!value || value.length < 50) {
                    this.showFieldError(fieldId, 'Konten harus minimal 50 karakter');
                } else {
                    this.clearFieldError(fieldId);
                }
                break;
        }
    }

    showFieldError(fieldId, message) {
        this.clearFieldError(fieldId);
        
        const field = document.getElementById(fieldId);
        const error = document.createElement('div');
        error.className = 'field-error';
        error.textContent = message;
        error.style.cssText = `
            color: #f44336;
            font-size: 12px;
            margin-top: 5px;
        `;
        
        field.parentNode.appendChild(error);
        field.style.borderColor = '#f44336';
    }

    clearFieldError(fieldId) {
        const field = document.getElementById(fieldId);
        if (field) {
            field.style.borderColor = '';
            const existingError = field.parentNode.querySelector('.field-error');
            if (existingError) {
                existingError.remove();
            }
        }
    }

    setupImageValidation() {
        const imageInput = document.getElementById('image');
        if (imageInput) {
            imageInput.addEventListener('blur', (e) => {
                const url = e.target.value.trim();
                if (url && !Utils.isValidImageUrl(url)) {
                    this.showFieldError('image', 'URL gambar tidak valid');
                } else {
                    this.clearFieldError('image');
                }
            });
        }
    }

    setupTagInput() {
        const tagsInput = document.getElementById('tags');
        if (tagsInput) {
            tagsInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    // Bisa ditambahkan logika untuk menambah tag dengan Enter
                }
            });
        }
    }

    setupContentFormatting() {
        const contentTextarea = document.getElementById('content');
        if (!contentTextarea) return;

        // Basic formatting toolbar bisa ditambahkan di sini
        // Untuk sekarang, kita skip dulu untuk simplicity
    }

    // Utility Methods
    formatCategoryName(category) {
        const names = {
            'berita': 'Berita',
            'fakta-unik': 'Fakta Unik',
            'inovasi': 'Inovasi',
            'tips': 'Tips Praktis',
            'teknologi': 'Teknologi',
            'sains': 'Sains',
            'kesehatan': 'Kesehatan',
            'budaya': 'Budaya'
        };
        return names[category] || category;
    }

    dispatchEditorEvent(eventName, detail = {}) {
        const event = new CustomEvent(`editor:${eventName}`, { 
            detail: { ...detail, editor: this }
        });
        document.dispatchEvent(event);
    }

    // Cleanup
    destroy() {
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
        }
        this.clearDraft();
    }
}

// Global Editor instance
window.cmsEditor = new CMSEditor();

// Export untuk penggunaan modular
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CMSEditor;
}