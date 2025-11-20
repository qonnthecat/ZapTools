export default /*html*/ `
<div id="page-history" class="page" x-data="historyVM">
    <h1 class="title">Riwayat</h1>

    <div class="history-list">
        <template x-for="item in items">
            <div class="history-item" x-text="item"></div>
        </template>
    </div>

    <button class="btn danger" @click="clear()">Hapus Semua</button>

    <a href="#tools" class="back">Kembali</a>
</div>
`;