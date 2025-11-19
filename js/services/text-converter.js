// js/services/text-converter.js
export class TextConverter {
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
    }

    convertText() {
        const textInput = document.getElementById('text-input');
        const textFormat = document.getElementById('text-format');
        const textResult = document.getElementById('text-result');
        const copyTextBtn = document.getElementById('copy-text');

        const text = textInput.value;
        if (text.trim() === '') {
            alert('Silakan masukkan teks terlebih dahulu.');
            return;
        }

        let convertedText;
        switch(textFormat.value) {
            case 'uppercase':
                convertedText = text.toUpperCase();
                break;
            case 'lowercase':
                convertedText = text.toLowerCase();
                break;
            case 'titlecase':
                convertedText = text.replace(/\w\S*/g, function(txt) {
                    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                });
                break;
            case 'camelcase':
                convertedText = text.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
                    return index === 0 ? word.toLowerCase() : word.toUpperCase();
                }).replace(/\s+/g, '');
                break;
            case 'snakecase':
                convertedText = text.toLowerCase().replace(/\s+/g, '_');
                break;
            case 'reverse':
                convertedText = text.split('').reverse().join('');
                break;
            case 'remove-spaces':
                convertedText = text.replace(/\s+/g, '');
                break;
            default:
                convertedText = text;
        }

        if (textResult) {
            textResult.innerHTML = `<p>${convertedText}</p>`;
        }
        if (copyTextBtn) {
            copyTextBtn.style.display = 'block';
        }
    }

    copyText() {
        const textResult = document.getElementById('text-result');
        if (textResult) {
            const textToCopy = textResult.textContent;
            navigator.clipboard.writeText(textToCopy).then(() => {
                alert('Teks berhasil disalin!');
            });
        }
    }
}