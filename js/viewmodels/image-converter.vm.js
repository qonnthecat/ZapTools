import * as ImageService from '../services/image-converter.js';

window.imageConverterVM = function() {
  return {
    file: null,
    previewSrc: null,
    format: 'image/png',
    quality: 90,
    async onFile(e) {
      const f = e.target.files[0];
      if (!f) return;
      this.file = f;
      this.previewSrc = URL.createObjectURL(f);
    },
    async convert() {
      if (!this.file) return alert('No file');
      try {
        const blob = await ImageService.convertBlob(this.file, this.format, this.quality/100);
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'converted.' + (this.format.split('/')[1] || 'png');
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      } catch (err) { console.error(err); alert('Conversion failed'); }
    }
  }
}