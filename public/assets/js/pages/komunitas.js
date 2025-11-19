export function render() {
  return `
    <h2>Komunitas</h2>
    <button id="new-post">Tulis Cerita</button>
    <div id="posts">Memuat...</div>
  `;
}

export function init() {
  const box = document.getElementById("posts");

  setTimeout(() => {
    box.innerHTML = `
      <div class="card-article">
        <h3>Postingan Komunitas Pertama</h3>
        <p>Ini cuma contoh. Nanti bisa tambah komentar.</p>
        <a href="#/detail?id=99">Lihat</a>
      </div>
    `;
  }, 500);
}