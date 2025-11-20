export default /*html*/ `
<div id="page-color-tools" class="page" x-data="colorToolsVM">
    <h1 class="title">Color Tools</h1>

    <input type="text" x-model="inputColor" placeholder="Masukkan warna (hex/rgb)" class="form-input">

    <button @click="convert()" class="btn">Convert</button>

    <div class="result-box" x-show="output">
        <p><strong>Hasil:</strong></p>
        <p x-text="output"></p>
    </div>

    <a href="#tools" class="back">Kembali</a>
</div>
`;