// Fungsi untuk modal gambar
const galleryItems = document.querySelectorAll('.gallery-item img');
const modal = document.getElementById('imageModal');
const modalImg = document.getElementById('modalImage');
const closeModal = document.querySelector('.close-modal');

if (galleryItems.length > 0 && modal && modalImg && closeModal) {
  galleryItems.forEach(img => {
    img.addEventListener('click', () => {
      modal.style.display = 'flex';
      modalImg.src = img.src;
      modalImg.alt = img.alt;
      document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
    });
    
    // Hilangkan loading indicator ketika gambar selesai dimuat
    img.addEventListener('load', () => {
      const loadingIndicator = img.previousElementSibling;
      if (loadingIndicator && loadingIndicator.classList.contains('image-loading')) {
        loadingIndicator.style.display = 'none';
      }
    });
    
    // Handle error loading image
    img.addEventListener('error', () => {
      const loadingIndicator = img.previousElementSibling;
      if (loadingIndicator && loadingIndicator.classList.contains('image-loading')) {
        loadingIndicator.textContent = 'Gagal memuat gambar';
        loadingIndicator.style.backgroundColor = 'rgba(255, 0, 0, 0.1)';
      }
    });
  });

  closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  });

  // Close modal dengan tombol ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'flex') {
      modal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  });
}

// Image lazy loading dengan Intersection Observer
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove('lazy');
        imageObserver.unobserve(img);
      }
    });
  });

  document.addEventListener('DOMContentLoaded', () => {
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => {
      imageObserver.observe(img);
    });
  });
}