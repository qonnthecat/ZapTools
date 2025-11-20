import * as ColorService from '../services/color-tools.js';

window.colorToolsVM = function() {
  return {
    hex: '#ffffff',
    rgb: '',
    toRgb() {
      try { this.rgb = ColorService.hexToRgb(this.hex); } catch(e) { this.rgb = 'Invalid'; }
    }
  }
}