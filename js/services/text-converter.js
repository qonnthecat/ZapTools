// js/services/text-converter.js
import translationService from './translation-service.js';

export class TextConverter {
    constructor() {
        this.currentLanguage = translationService.getCurrentLanguage();
        
        window.addEventListener('languageChanged', (e) => {
            this.currentLanguage = e.detail;
        });
    }

    init() {
        const convertTextBtn = document.getElementById('convert-text');
        const copyTextBtn = document.getElementById('copy-text');

        console.log('Initializing Text Converter...');

        if (convertTextBtn) {
            convertTextBtn.addEventListener('click', () => this.convertText());
        }

        if (copyTextBtn) {
            copyTextBtn.addEventListener('click', () => this.copyText());
        }

        // Add input event for real-time character count
        const textInput = document.getElementById('text-input');
        if (textInput) {
            textInput.addEventListener('input', () => this.updateCharacterCount());
            this.updateCharacterCount(); // Initialize count
        }

        console.log('Text Converter initialized successfully');
    }

    convertText() {
        const textInput = document.getElementById('text-input');
        const textFormat = document.getElementById('text-format');
        const textResult = document.getElementById('text-result');
        const copyTextBtn = document.getElementById('copy-text');
        const convertTextBtn = document.getElementById('convert-text');

        const text = textInput.value;
        if (text.trim() === '') {
            this.showAlert(translationService.getAlert('pleaseEnterText'));
            textInput.focus();
            return;
        }

        // Show loading state
        this.showLoading(true, convertTextBtn);

        try {
            const convertedText = this.performTextConversion(text, textFormat.value);
            
            if (textResult) {
                textResult.innerHTML = `<div class="converted-text">${convertedText}</div>`;
            }

            if (copyTextBtn) {
                copyTextBtn.style.display = 'block';
            }

        } catch (error) {
            console.error('Text conversion error:', error);
            this.showAlert('Conversion failed. Please try again.');
        } finally {
            this.showLoading(false, convertTextBtn);
        }
    }

    performTextConversion(text, operation) {
        switch(operation) {
            case 'uppercase':
                return text.toUpperCase();
                
            case 'lowercase':
                return text.toLowerCase();
                
            case 'titlecase':
                return text.replace(/\w\S*/g, function(txt) {
                    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                });
                
            case 'camelcase':
                return text.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
                    return index === 0 ? word.toLowerCase() : word.toUpperCase();
                }).replace(/\s+/g, '');
                
            case 'snakecase':
                return text.toLowerCase().replace(/\s+/g, '_');
                
            case 'reverse':
                return text.split('').reverse().join('');
                
            case 'remove-spaces':
                return text.replace(/\s+/g, '');
                
            default:
                return text;
        }
    }

    copyText() {
        const textResult = document.getElementById('text-result');
        if (textResult) {
            const textToCopy = textResult.textContent;
            
            navigator.clipboard.writeText(textToCopy).then(() => {
                this.showCopySuccess();
            }).catch(err => {
                console.error('Failed to copy text: ', err);
                this.showAlert('Failed to copy text. Please try again.');
            });
        }
    }

    showCopySuccess() {
        const copyTextBtn = document.getElementById('copy-text');
        if (copyTextBtn) {
            const originalText = copyTextBtn.innerHTML;
            copyTextBtn.innerHTML = '✅ Copied!';
            copyTextBtn.disabled = true;
            
            setTimeout(() => {
                copyTextBtn.innerHTML = originalText;
                copyTextBtn.disabled = false;
            }, 2000);
        }

    updateCharacterCount() {
        const textInput = document.getElementById('text-input');
        const characterCount = document.getElementById('character-count');
        
        if (textInput && characterCount) {
            const count = textInput.value.length;
            const words = textInput.value.trim() ? textInput.value.trim().split(/\s+/).length : 0;
            
            characterCount.innerHTML = `
                <span class="count-item">Characters: <strong>${count}</strong></span>
                <span class="count-item">Words: <strong>${words}</strong></span>
            `;
        }
    }

    showLoading(show, button) {
        if (button) {
            if (show) {
                button.disabled = true;
                button.innerHTML = '<span class="loading-spinner"></span> Converting...';
            } else {
                button.disabled = false;
                button.innerHTML = translationService.getTextConverter('convertText');
            }
        }
    }

    showAlert(message) {
        alert(message);
    }
}