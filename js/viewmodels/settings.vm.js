import * as Settings from '../services/settings-manager.js';

window.settingsVM = function() {
  return {
    lang: Settings.get('lang') || 'en',
    dark: Settings.get('dark') || false,
    save() {
      Settings.set('lang', this.lang);
      Settings.set('dark', !!this.dark);
      // optionally apply theme class
      document.documentElement.classList.toggle('dark', !!this.dark);
      alert('Settings saved');
    }
  }
}