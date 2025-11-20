export default /*html*/ `
<div id="page-text-converter" class="page" x-data="textConverterVM">
    <h1 class="title">Text Converter</h1>

    <textarea x-model="input" class="form-input" placeholder="Masukkan teks"></textarea>

    <div class="btn-group">
        <button @click="toUpper()" class="btn">Uppercase</button>
        <button @click="toLower()" class="btn">Lowercase</button>
        <button @click="reverse()" class="btn">Reverse</button>
    </div>

    <textarea x-model="output" class="form-input" placeholder="Hasil" readonly></textarea>

    <a href="#tools" class="back">Kembali</a>
</div>
`;