// GALLERY MANAGEMENT - DuniaBercerita

class GalleryManager {
    constructor() {
        this.modal = null;
        this.currentImageIndex = 0;
        this.images = [];
        this.init();
    }

    init() {
        this.createModal();
        this.setupGallery();
    }

    createModal() {
        // Create modal element if it doesn't exist
        if (!document.getElementById('imageModal')) {
            this.modal = document.createElement('div');
            this.modal.id = 'imageModal';
            this.modal.className = 'image-modal';
            this.modal.innerHTML = `
                <span class="close-modal">&times;</span>
                <div class="modal-nav">
                    <button class="nav-btn prev-btn"><i class="fas fa-chevron-left"></i></button>
                    <button class="nav-btn next-btn"><i class="fas fa-chevron-right"></i></button>
                </div>
                <div class="modal-content">
                    <img id="modalImage" src="" alt="">
                    <div class="image-caption" id="imageCaption"></div>
                </div>
            `;
            document.body.appendChild(this.modal);
            this.setupModalEvents();
        } else {
            this.modal = document.getElementById('imageModal');
            this.setupModalEvents();
        }
    }

    setupModalEvents() {
        const closeBtn = this.modal.querySelector('.close-modal');
        const prevBtn = this.modal.querySelector('.prev-btn');
        const nextBtn = this.modal.querySelector('.next-btn');

        closeBtn.addEventListener('click', () => this.closeModal());
        prevBtn.addEventListener('click', () => this.showPrevImage());
        nextBtn.addEventListener('click', () => this.showNextImage());

        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (this.modal.style.display === 'flex') {
                if (e.key === 'Escape') this.closeModal();
                if (e.key === 'ArrowLeft') this.showPrevImage();
                if (e.key === 'ArrowRight') this.showNextImage();
            }
        });
    }

    setupGallery() {
        // Find all gallery images
        const galleryImages = document.querySelectorAll('.image-gallery img, .article-image img');
        
        galleryImages.forEach((img, index) => {
            img.style.cursor = 'pointer';
            img.addEventListener('click', () => {
                this.openModal(index, Array.from(galleryImages));
            });

            // Add loading state
            img.addEventListener('load', () => {
                this.hideLoadingIndicator(img);
            });

            img.addEventListener('error', () => {
                this.handleImageError(img);
            });
        });
    }

    openModal(index, images) {
        this.images = images;
        this.currentImageIndex = index;
        this.showImage(index);
        this.modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        this.modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        this.images = [];
    }

    showImage(index) {
        if (index < 0 || index >= this.images.length) return;

        const img = this.images[index];
        const modalImg = this.modal.querySelector('#modalImage');
        const caption = this.modal.querySelector('#imageCaption');

        modalImg.src = img.src;
        modalImg.alt = img.alt;
        caption.textContent = img.alt || '';

        this.currentImageIndex = index;
        this.updateNavigation();
    }

    showPrevImage() {
        if (this.currentImageIndex > 0) {
            this.showImage(this.currentImageIndex - 1);
        } else {
            this.showImage(this.images.length - 1); // Loop to last
        }
    }

    showNextImage() {
        if (this.currentImageIndex < this.images.length - 1) {
            this.showImage(this.currentImageIndex + 1);
        } else {
            this.showImage(0); // Loop to first
        }
    }

    updateNavigation() {
        const prevBtn = this.modal.querySelector('.prev-btn');
        const nextBtn = this.modal.querySelector('.next-btn');

        // Show/hide buttons based on current position
        if (this.images.length <= 1) {
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
        } else {
            prevBtn.style.display = 'flex';
            nextBtn.style.display = 'flex';
        }
    }

    hideLoadingIndicator(img) {
        const loadingIndicator = img.previousElementSibling;
        if (loadingIndicator && loadingIndicator.classList.contains('image-loading')) {
            loadingIndicator.style.display = 'none';
        }
    }

    handleImageError(img) {
        const loadingIndicator = img.previousElementSibling;
        if (loadingIndicator && loadingIndicator.classList.contains('image-loading')) {
            loadingIndicator.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Gagal memuat gambar';
            loadingIndicator.style.backgroundColor = 'rgba(244, 67, 54, 0.1)';
        }

        // Set placeholder image
        img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkdhbWJhciB0aWRhayBkYXBhdCBkaW11dGFrPC90ZXh0Pjwvc3ZnPg==';
        img.alt = 'Gambar tidak tersedia';
    }
}

// Initialize gallery when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    new GalleryManager();
});

// Export for Node.js environment
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GalleryManager };
}