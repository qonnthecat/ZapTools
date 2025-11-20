export default /*html*/ `
<div id="page-password-generator" class="page" x-data="passwordVM">
    <h1 class="title">Password Generator</h1>

    <label>Length</label>
    <input type="number" min="4" max="64" x-model="length" class="form-input">

    <div>
        <label><input type="checkbox" x-model="useUpper"> Uppercase</label>
        <label><input type="checkbox" x-model="useNumbers"> Numbers</label>
        <label><input type="checkbox" x-model="useSymbols"> Symbols</label>
    </div>

    <button @click="generate()" class="btn">Generate</button>

    <input type="text" class="form-input" x-model="password" readonly>

    <a href="#tools" class="back">Kembali</a>
</div>
`;