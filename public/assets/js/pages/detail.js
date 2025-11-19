export function render() {
  return `<div id="detail">Loading...</div>`;
}

export function init() {
  const params = new URLSearchParams(location.hash.split("?")[1]);
  const id = params.get("id");

  document.getElementById("detail").innerHTML = `
    <h2>Artikel #${id}</h2>
    <p>Isi artikel diambil dari database nanti. Ini dummy.</p>
  `;
}