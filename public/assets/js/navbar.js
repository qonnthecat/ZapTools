export function loadNavbar() {
  document.getElementById("navbar").innerHTML = `
    <header>
      <nav class="nav-menu">
        <a href="#/" class="nav-link">Beranda</a>
        <a href="#/artikel" class="nav-link">Artikel</a>
        <a href="#/komunitas" class="nav-link">Komunitas</a>
        <a href="#/galeri" class="nav-link">Galeri</a>
        <a href="#/tentang" class="nav-link">Tentang</a>
        <a href="#/kontak" class="nav-link">Kontak</a>

        <button id="theme-toggle" style="margin-left:auto;">🌙</button>
      </nav>
    </header>
  `;
}