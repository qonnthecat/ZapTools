import * as PwService from '../services/password-generator.js';

window.passwordGeneratorVM = function() {
  return {
    length: 16,
    includeSymbols: true,
    includeNumbers: true,
    excludeAmbiguous: true,
    password: '',
    get strength() {
      const l = this.length;
      if (l >= 20) return 'Very Strong';
      if (l >= 14) return 'Strong';
      if (l >= 10) return 'Medium';
      return 'Weak';
    },
    generate() {
      this.password = PwService.generate({
        length: this.length,
        symbols: this.includeSymbols,
        numbers: this.includeNumbers,
        excludeAmbiguous: this.excludeAmbiguous
      });
    },
    copy() { navigator.clipboard.writeText(this.password || ''); }
  }
}