// js/services/color-tools.js
export class ColorTools {
    init() {
        const colorPicker = document.getElementById('color-picker');
        
        console.log('Initializing Color Tools...');

        if (colorPicker) {
            colorPicker.addEventListener('input', (e) => this.updateColorInfo(e.target.value));
            this.updateColorInfo(colorPicker.value);
        }
    }

    updateColorInfo(hex) {
        const hexValue = document.getElementById('hex-value');
        const rgbValue = document.getElementById('rgb-value');
        const hslValue = document.getElementById('hsl-value');
        const colorPalette = document.getElementById('color-palette');

        if (hexValue) hexValue.textContent = hex;
        
        // Convert hex to RGB
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        
        if (rgbValue) rgbValue.textContent = `rgb(${r}, ${g}, ${b})`;
        
        // Convert RGB to HSL
        const hsl = this.rgbToHsl(r, g, b);
        if (hslValue) hslValue.textContent = `hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%)`;

        // Generate color palette
        if (colorPalette) this.generateColorPalette(hex, colorPalette);
    }

    rgbToHsl(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;
        
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        
        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            
            h /= 6;
        }
        
        return {
            h: h * 360,
            s: s * 100,
            l: l * 100
        };
    }

    generateColorPalette(baseColor, container) {
        container.innerHTML = '';
        
        const baseHex = baseColor.slice(1);
        const r = parseInt(baseHex.slice(0, 2), 16);
        const g = parseInt(baseHex.slice(2, 4), 16);
        const b = parseInt(baseHex.slice(4, 6), 16);
        
        const variations = [
            { r: Math.min(255, r + 40), g: Math.min(255, g + 40), b: Math.min(255, b + 40) },
            { r: Math.min(255, r + 20), g: Math.min(255, g + 20), b: Math.min(255, b + 20) },
            { r, g, b },
            { r: Math.max(0, r - 20), g: Math.max(0, g - 20), b: Math.max(0, b - 20) },
            { r: Math.max(0, r - 40), g: Math.max(0, g - 40), b: Math.max(0, b - 40) }
        ];
        
        variations.forEach(variation => {
            const hex = `#${this.componentToHex(variation.r)}${this.componentToHex(variation.g)}${this.componentToHex(variation.b)}`;
            const swatch = document.createElement('div');
            swatch.className = 'color-swatch';
            swatch.style.backgroundColor = hex;
            swatch.title = hex;
            swatch.addEventListener('click', () => {
                const colorPicker = document.getElementById('color-picker');
                if (colorPicker) {
                    colorPicker.value = hex;
                    this.updateColorInfo(hex);
                }
            });
            container.appendChild(swatch);
        });
    }

    componentToHex(c) {
        const hex = c.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }
}