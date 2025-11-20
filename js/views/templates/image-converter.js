export default /*html*/ `
<div id="page-image-converter" class="page" x-data="imageConverterVM">
    <h1 class="title">Image Converter</h1>

    <input type="file" @change="loadFile($event)" class="form-input">

    <select x-model="format" class="form-input">
        <option value="png">PNG</option>
        <option value="jpg">JPG</option>
        <option value="webp">WEBP</option>
    </select>

    <button @click="convert()" class="btn">Convert</button>

    <div class="result-box" x-show="output">
        <a :href="output" download="converted.png" class="btn">Download</a>
    </div>

    <a href="#tools" class="back">Kembali</a>
</div>
`;