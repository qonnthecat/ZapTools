import * as TextService from '../services/text-converter.js';

export default function register() {
  window.textConverterVM = function() {
    return {
      input: '',
      output: '',
      get wordCount() { return this.input.trim() ? this.input.trim().split(/\s+/).length : 0; },
      toUpper() { this.output = TextService.toUpper(this.input); },
      toLower() { this.output = TextService.toLower(this.input); },
      trim() { this.output = TextService.trim(this.input); },
      removeDuplicates() { this.output = TextService.removeDuplicates(this.input); },
      copyOutput() { navigator.clipboard.writeText(this.output || ''); }
    };
  }
}

register();