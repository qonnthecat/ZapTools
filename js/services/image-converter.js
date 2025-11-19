// js/services/image-converter.js
import translationService from './translation-service.js';

export class ImageConverter {
    constructor() {
        this.currentImageFile = null;
    }

    init() {
        const imageDropArea = document.getElementById('image-drop-area');
        const imageInput = document.getElementById('image-input');
        const imageQuality = document.getElementById('image-quality');
        const qualityValue = document.querySelector('.quality-value');
        const convertImageBtn = document.getElementById('convert-image');

        if (!imageDropArea) return;

        console.log('Initializing Image Converter...');

        // Drag and drop functionality
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            imageDropArea.addEventListener(eventName, this.preventDefaults, false);
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            imageDropArea.addEventListener(eventName, this.highlight, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            imageDropArea.addEventListener(eventName, this.unhighlight, false);
        });

        imageDropArea.addEventListener('drop', (e) => this.handleDrop(e), false);
        imageDropArea.addEventListener('click', () => imageInput.click());
        imageInput.addEventListener('change', (e) => this.handleImageFiles(e.target.files));
        
        // Quality slider
        if (imageQuality && qualityValue) {
            imageQuality.addEventListener('input', function() {
                qualityValue.textContent = `${this.value}%`;
            });
        }

        // Convert button
        if (convertImageBtn) {
            convertImageBtn.addEventListener('click', () => this.convertImage());
        }
    }

    preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    highlight() {
        this.classList.add('active');
    }

    unhighlight() {
        this.classList.remove('active');
    }

    handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        this.handleImageFiles(files);
    }

    handleImageFiles(files) {
        if (files.length > 0) {
            const file = files[0];
            if (file.type.startsWith('image/')) {
                this.currentImageFile = file;
                
                const reader = new FileReader();
                reader.onload = (e) => {
                    const imagePreview = document.getElementById('image-preview');
                    if (imagePreview) {
                        imagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
                    }
                    const fileMsg = document.querySelector('.file-msg');
                    if (fileMsg) {
                        fileMsg.textContent = `File: ${file.name}`;
                    }
                };
                reader.readAsDataURL(file);
            } else {
                this.showAlert(translationService.getAlert('invalidImage'));
            }
        }
    }

    convertImage() {
        if (!this.currentImageFile) {
            this.showAlert(translationService.getAlert('pleaseSelectImage'));
            return;
        }

        const imageFormat = document.getElementById('image-format');
        const imageQuality = document.getElementById('image-quality');
        const imageResult = document.getElementById('image-result');

        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                
                const quality = parseInt(imageQuality.value) / 100;
                const format = imageFormat.value;
                const fileName = this.currentImageFile.name.split('.')[0];
                
                canvas.toBlob((blob) => {
                    const url = URL.createObjectURL(blob);
                    
                    if (imageResult) {
                        imageResult.innerHTML = `
                            <p>${translationService.getImageConverter('imageConverted')} ${format.toUpperCase()}!</p>
                            <p>${translationService.getImageConverter('originalSize')} ${this.formatFileSize(this.currentImageFile.size)}</p>
                            <p>${translationService.getImageConverter('newSize')} ${this.formatFileSize(blob.size)}</p>
                            <p>${translationService.getImageConverter('download')} <a href="${url}" download="${fileName}.${format}" class="download-link">${fileName}.${format}</a></p>
                        `;
                    }
                }, `image/${format}`, quality);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(this.currentImageFile);
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    showAlert(message) {
        alert(message);
    }
}