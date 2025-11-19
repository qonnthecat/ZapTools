export function render() {
  return `
    <section class="hero">
      <h2>Selamat Datang di DuniaBercerita</h2>
      <p>Platform artikel + komunitas modern.</p>
      <a href="#/artikel" class="nav-link" style="padding:12px 20px;background:var(--primary);color:white;">Lihat Artikel</a>
    </section>

    <h3 style="margin:20px 0;">Artikel Terbaru</h3>
    <div id="latest"></div>
  `;
}

export function init() {
  const latest = document.getElementById("latest");
  latest.innerHTML = `
    <div class="card-article">
      <h3>Contoh Artikel SPA</h3>
      <p>Artikel ini hanya contoh. Data asli nanti dari database Neon.</p>
      <a href="#/detail?id=1">Baca selengkapnya</a>
    </div>
  `;
}