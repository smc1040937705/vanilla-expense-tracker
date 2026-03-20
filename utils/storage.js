/**
 * localStorage 存储工具
 */

const STORAGE_KEY = 'expense_tracker_records';

/**
 * 获取所有记录
 * @returns {Array} 记录数组
 */
export function getRecords() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('读取本地数据失败:', e);
    return [];
  }
}

/**
 * 保存所有记录
 * @param {Array} records - 记录数组
 */
export function saveRecords(records) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch (e) {
    console.error('保存数据失败:', e);
  }
}

/**
 * 添加记录
 * @param {Object} record - 记录对象
 * @returns {Object} 添加了id的记录
 */
export function addRecord(record) {
  const records = getRecords();
  const newRecord = {
    ...record,
    id: Date.now().toString(),
    createdAt: new Date().toISOString()
  };
  records.push(newRecord);
  saveRecords(records);
  return newRecord;
}

/**
 * 删除记录
 * @param {string} id - 记录ID
 * @returns {boolean} 是否删除成功
 */
export function deleteRecord(id) {
  const records = getRecords();
  const index = records.findIndex(r => r.id === id);
  if (index > -1) {
    records.splice(index, 1);
    saveRecords(records);
    return true;
  }
  return false;
}

/**
 * 更新记录
 * @param {string} id - 记录ID
 * @param {Object} updates - 更新的字段
 * @returns {Object|null} 更新后的记录
 */
export function updateRecord(id, updates) {
  const records = getRecords();
  const index = records.findIndex(r => r.id === id);
  if (index > -1) {
    records[index] = { ...records[index], ...updates };
    saveRecords(records);
    return records[index];
  }
  return null;
}

/**
 * 清空所有记录
 */
export function clearRecords() {
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * 初始化 mock 数据
 */
export function initMockData() {
  const existing = getRecords();
  if (existing.length === 0) {
    const mockData = generateMockData();
    saveRecords(mockData);
  }
}

/**
 * 生成 mock 数据
 * @returns {Array} mock 记录数组
 */
function generateMockData() {
  const categories = {
    income: ['工资', '奖金', '投资', '兼职'],
    expense: ['餐饮', '交通', '购物', '娱乐', '住房', '医疗']
  };
  
  const records = [];
  const now = new Date();
  
  // 生成最近30天的数据
  for (let i = 0; i < 50; i++) {
    const isIncome = Math.random() > 0.6;
    const type = isIncome ? 'income' : 'expense';
    const categoryList = categories[type];
    const category = categoryList[Math.floor(Math.random() * categoryList.length)];
    
    // 随机日期（最近30天）
    const date = new Date(now);
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    
    // 金额（分）
    const amountCents = isIncome 
      ? Math.floor(Math.random() * 500000) + 10000  // 100-5000元
      : Math.floor(Math.random() * 20000) + 1000;   // 10-200元
    
    records.push({
      id: Date.now().toString() + i,
      type,
      amount: amountCents,
      category,
      note: `${category}支出`,
      date: date.toISOString().split('T')[0],
      createdAt: date.toISOString()
    });
  }
  
  return records.sort((a, b) => new Date(b.date) - new Date(a.date));
}
