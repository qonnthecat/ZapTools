import * as HistoryService from '../services/history-service.js';

window.historyVM = function() {
  return {
    items: HistoryService.load() || [],
    remove(idx) {
      this.items.splice(idx, 1);
      HistoryService.save(this.items);
    }
  }
}