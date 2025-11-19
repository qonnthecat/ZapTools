export function loadNavbar() {
  document.getElementById("navbar").innerHTML = `

    <!-- DESKTOP NAV -->
    <nav class="top-nav">
      <a href="#/" class="nav-item"><i class="fas fa-home"></i> Beranda</a>
      <a href="#/artikel" class="nav-item"><i class="fas fa-book"></i> Artikel</a>
      <a href="#/komunitas" class="nav-item"><i class="fas fa-users"></i> Komunitas</a>
      <a href="#/tentang" class="nav-item"><i class="fas fa-info-circle"></i> Tentang</a>
      <a href="#/kontak" class="nav-item"><i class="fas fa-envelope"></i> Kontak</a>
      <button id="theme-toggle" class="nav-item" style="border:none;background:none;cursor:pointer;">
        <i class="fas fa-moon"></i>
      </button>
    </nav>

    <!-- MOBILE NAV -->
    <nav class="bottom-nav">
      <a href="#/" class="nav-item"><i class="fas fa-home"></i><span>Home</span></a>
      <a href="#/artikel" class="nav-item"><i class="fas fa-book"></i><span>Artikel</span></a>
      <a href="#/komunitas" class="nav-item"><i class="fas fa-users"></i><span>Forum</span></a>
      <a href="#/tentang" class="nav-item"><i class="fas fa-info-circle"></i><span>Tentang</span></a>
    </nav>
  `;
}