// script.js

const toggleBtn = document.getElementById('theme-toggle');
const body = document.body;

// Cek localStorage (Persistensi) saat halaman dimuat
if (localStorage.getItem('theme') === 'dark') {
  body.classList.add('dark');
  toggleBtn.textContent = '☀️ Mode Terang';
}

// Tambahkan event listener untuk mengalihkan tema
toggleBtn.addEventListener('click', () => {
  body.classList.toggle('dark');
  
  if(body.classList.contains('dark')){
    toggleBtn.textContent = '☀️ Mode Terang';
    localStorage.setItem('theme', 'dark'); // Menyimpan status 'dark'
  } else {
    toggleBtn.textContent = '🌙 Mode Gelap';
    localStorage.setItem('theme', 'light'); // Menyimpan status 'light'
  }
});
