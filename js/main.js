// Kode JavaScript Dark Mode
const toggleBtn = document.getElementById('theme-toggle');
const body = document.body;

// Cek localStorage
if (localStorage.getItem('theme') === 'dark') {
  body.classList.add('dark');
  if (toggleBtn) {
    toggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
  }
}

if (toggleBtn) {
  toggleBtn.addEventListener('click', () => {
    body.classList.toggle('dark');
    if(body.classList.contains('dark')){
      toggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
      localStorage.setItem('theme', 'dark');
    } else {
      toggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
      localStorage.setItem('theme', 'light');
    }
  });
}

// Menu mobile toggle
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const navMenu = document.getElementById('nav-menu');

if (mobileMenuBtn && navMenu) {
  mobileMenuBtn.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    if (navMenu.classList.contains('active')) {
      mobileMenuBtn.innerHTML = '<i class="fas fa-times"></i>';
    } else {
      mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    }
  });
}

// Aktifkan menu navigasi
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    // Jika link adalah anchor link, biarkan default behavior
    if (link.getAttribute('href').startsWith('#')) {
      return;
    }
    
    // Hapus kelas active dari semua link
    navLinks.forEach(l => l.classList.remove('active'));
    // Tambahkan kelas active ke link yang diklik
    e.target.classList.add('active');
    
    // Tutup menu mobile jika terbuka
    if (window.innerWidth <= 768 && navMenu) {
      navMenu.classList.remove('active');
      if (mobileMenuBtn) {
        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
      }
    }
  });
});

// Smooth scrolling untuk anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Fungsi untuk berbagi
const shareBtn = document.getElementById('share-btn');
const shareTwitter = document.getElementById('share-twitter');
const shareFacebook = document.getElementById('share-facebook');
const shareLinkedin = document.getElementById('share-linkedin');
const shareWhatsapp = document.getElementById('share-whatsapp');

const shareUrl = encodeURIComponent(window.location.href);
const shareTitle = encodeURIComponent(document.title);

if (shareBtn) {
  shareBtn.addEventListener('click', () => {
    if (navigator.share) {
      navigator.share({
        title: document.title,
        url: window.location.href
      });
    } else {
      alert('Fungsi berbagi tidak didukung di browser ini. Gunakan tombol berbagi spesifik platform.');
    }
  });
}

if (shareTwitter) {
  shareTwitter.addEventListener('click', () => {
    window.open(`https://twitter.com/intent/tweet?text=${shareTitle}&url=${shareUrl}`, '_blank');
  });
}

if (shareFacebook) {
  shareFacebook.addEventListener('click', () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`, '_blank');
  });
}

if (shareLinkedin) {
  shareLinkedin.addEventListener('click', () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`, '_blank');
  });
}

if (shareWhatsapp) {
  shareWhatsapp.addEventListener('click', () => {
    window.open(`https://wa.me/?text=${shareTitle}%20${shareUrl}`, '_blank');
  });
}

// Search functionality
const searchBtn = document.getElementById('search-btn');
if (searchBtn) {
  searchBtn.addEventListener('click', () => {
    const searchQuery = prompt('Masukkan kata kunci pencarian:');
    if (searchQuery) {
      alert(`Fitur pencarian untuk "${searchQuery}" akan segera tersedia!`);
      // Di sini bisa diimplementasikan fungsi pencarian sebenarnya
    }
  });
}

// Animasi scroll untuk elements
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Terapkan animasi pada elements saat dimuat
document.addEventListener('DOMContentLoaded', () => {
  const animatedElements = document.querySelectorAll('.article-card, .category-card, .hero-content, .hero-image');
  
  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
});

// Loading indicator untuk gambar
window.addEventListener('load', () => {
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    if (img.complete) {
      const loadingIndicator = img.previousElementSibling;
      if (loadingIndicator && loadingIndicator.classList.contains('image-loading')) {
        loadingIndicator.style.display = 'none';
      }
    }
  });
});