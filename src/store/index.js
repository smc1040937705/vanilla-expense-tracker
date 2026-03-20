// 状态管理 - 纯原生实现
class Store {
  constructor() {
    this.records = [];
    this.listeners = [];
    this.init();
  }
  
  init() {
    const stored = storage.get();
    if (stored && stored.length > 0) {
      this.records = stored;
    } else {
      this.records = generateMockData();
      this.save();
    }
  }
  
  getRecords() {
    return [...this.records];
  }
  
  addRecord(record) {
    const newRecord = {
      ...record,
      id: Date.now()
    };
    this.records.unshift(newRecord);
    this.save();
    this.notify();
  }
  
  updateRecord(id, record) {
    const index = this.records.findIndex(r => r.id === id);
    if (index !== -1) {
      this.records[index] = { ...this.records[index], ...record };
      this.save();
      this.notify();
    }
  }
  
  deleteRecord(id) {
    this.records = this.records.filter(r => r.id !== id);
    this.save();
    this.notify();
  }
  
  getRecordById(id) {
    return this.records.find(r => r.id === id);
  }
  
  getStatistics() {
    const income = this.records
      .filter(r => r.type === 'income')
      .reduce((sum, r) => sum + r.amount, 0);
    
    const expense = this.records
      .filter(r => r.type === 'expense')
      .reduce((sum, r) => sum + r.amount, 0);
    
    return {
      income,
      expense,
      balance: income - expense
    };
  }
  
  filterRecords({ type, category, startDate, endDate }) {
    return this.records.filter(record => {
      if (type && record.type !== type) return false;
      if (category && record.category !== category) return false;
      if (startDate && record.date < startDate) return false;
      if (endDate && record.date > endDate) return false;
      return true;
    });
  }
  
  getLast7DaysData() {
    const result = [];
    const now = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayRecords = this.records.filter(r => r.date === dateStr);
      const income = dayRecords
        .filter(r => r.type === 'income')
        .reduce((sum, r) => sum + r.amount, 0);
      const expense = dayRecords
        .filter(r => r.type === 'expense')
        .reduce((sum, r) => sum + r.amount, 0);
      
      result.push({
        date: dateStr,
        label: `${date.getMonth() + 1}/${date.getDate()}`,
        income,
        expense
      });
    }
    
    return result;
  }
  
  save() {
    storage.set(this.records);
  }
  
  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }
  
  notify() {
    this.listeners.forEach(listener => listener());
  }
  
  reset() {
    this.records = [];
    this.listeners = [];
  }
}

const store = new Store();
