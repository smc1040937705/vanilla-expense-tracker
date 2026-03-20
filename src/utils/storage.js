// 存储工具 - 纯原生实现
const STORAGE_KEY = 'expense_records';

const storage = {
  get() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },
  
  set(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      console.error('Failed to save to localStorage');
    }
  },
  
  clear() {
    localStorage.removeItem(STORAGE_KEY);
  }
};
