// js/services/image-converter.js
import translationService from './translation-service.js';
import { HistoryManager } from './history-manager.js';

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

        console.log('Image Converter initialized successfully');
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
                        imagePreview.innerHTML = `
                            <div class="image-info">
                                <img src="${e.target.result}" alt="Preview">
                                <div class="image-details">
                                    <p><strong>File:</strong> ${file.name}</p>
                                    <p><strong>Size:</strong> ${this.formatFileSize(file.size)}</p>
                                    <p><strong>Type:</strong> ${file.type}</p>
                                </div>
                            </div>
                        `;
                    }
                    const fileMsg = document.querySelector('.file-msg');
                    if (fileMsg) {
                        fileMsg.textContent = `File selected: ${file.name}`;
                    }
                };
                reader.readAsDataURL(file);
            } else {
                this.showAlert(translationService.getAlert('invalidImage'));
            }
        }
    }

    async convertImage() {
        if (!this.currentImageFile) {
            this.showAlert(translationService.getAlert('pleaseSelectImage'));
            return;
        }

        const imageFormat = document.getElementById('image-format');
        const imageQuality = document.getElementById('image-quality');
        const imageResult = document.getElementById('image-result');
        const convertImageBtn = document.getElementById('convert-image');

        if (!imageFormat || !imageQuality || !imageResult) return;

        // Show loading state
        this.showLoading(true, convertImageBtn);

        try {
            const result = await this.performConversion(imageFormat.value, imageQuality.value);
            
            if (imageResult) {
                imageResult.innerHTML = `
                    <div class="conversion-result">
                        <div class="result-success">
                            <span class="success-icon">✅</span>
                            <p><strong>${translationService.getImageConverter('imageConverted')} ${result.format.toUpperCase()}!</strong></p>
                        </div>
                        <div class="result-details">
                            <p>${translationService.getImageConverter('originalSize')} <strong>${this.formatFileSize(result.originalSize)}</strong></p>
                            <p>${translationService.getImageConverter('newSize')} <strong>${this.formatFileSize(result.newSize)}</strong></p>
                            <p class="compression-ratio">Compression: <strong>${result.compressionRatio}%</strong> smaller</p>
                        </div>
                        <div class="download-section">
                            <p>${translationService.getImageConverter('download')}</p>
                            <a href="${result.url}" download="${result.fileName}.${result.format}" class="btn primary download-link">
                                📥 Download ${result.fileName}.${result.format}
                            </a>
                        </div>
                    </div>
                `;
            }

            // Record in history
            HistoryManager.recordConversion('image', {
                fromFormat: this.getFileExtension(this.currentImageFile.name),
                toFormat: result.format,
                fileName: this.currentImageFile.name,
                originalSize: result.originalSize,
                newSize: result.newSize,
                compressionRatio: result.compressionRatio
            });

        } catch (error) {
            console.error('Conversion error:', error);
            this.showAlert('Conversion failed. Please try again.');
        } finally {
            this.showLoading(false, convertImageBtn);
        }
    }

    performConversion(format, quality) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0);
                    
                    const qualityValue = parseInt(quality) / 100;
                    const fileName = this.currentImageFile.name.split('.')[0];
                    
                    canvas.toBlob((blob) => {
                        if (!blob) {
                            reject(new Error('Failed to convert image'));
                            return;
                        }

                        const url = URL.createObjectURL(blob);
                        const compressionRatio = Math.round((1 - (blob.size / this.currentImageFile.size)) * 100);
                        
                        resolve({
                            format: format,
                            fileName: fileName,
                            url: url,
                            originalSize: this.currentImageFile.size,
                            newSize: blob.size,
                            compressionRatio: compressionRatio
                        });
                    }, `image/${format}`, qualityValue);
                };
                img.onerror = () => reject(new Error('Failed to load image'));
                img.src = e.target.result;
            };
            
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsDataURL(this.currentImageFile);
        });
    }

    getFileExtension(filename) {
        return filename.split('.').pop().toLowerCase();
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    showLoading(show, button) {
        if (button) {
            if (show) {
                button.disabled = true;
                button.innerHTML = '<span class="loading-spinner"></span> Converting...';
            } else {
                button.disabled = false;
                button.innerHTML = translationService.getImageConverter('convertImage');
            }
        }
    }

    showAlert(message) {
        // Create a better alert system (could be replaced with toast notifications)
        alert(message);
    }
}