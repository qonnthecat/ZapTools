export function render() {
  return `
    <h2>Semua Artikel</h2>
    <div id="article-list">Memuat...</div>
  `;
}

export function init() {
  document.getElementById("article-list").innerHTML = `
    <div class="card-article">
      <h3>Sample Artikel 1</h3>
      <a href="#/detail?id=1">Baca</a>
    </div>
  `;
}