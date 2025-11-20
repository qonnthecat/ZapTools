export default /*html*/ `
<div id="page-settings" class="page" x-data="settingsVM">
    <h1 class="title">Pengaturan</h1>

    <label>Pilih Bahasa</label>
    <select x-model="lang" @change="apply()" class="form-input">
        <option value="id">Indonesia</option>
        <option value="en">English</option>
    </select>

    <label>Tema</label>
    <select x-model="theme" @change="apply()" class="form-input">
        <option value="light">Light</option>
        <option value="dark">Dark</option>
    </select>

    <a href="#home" class="back">Kembali</a>
</div>
`;