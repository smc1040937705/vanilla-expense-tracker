import { getToday } from '../utils/date.js';

const CATEGORIES = [
  { value: '', label: '全部分类' },
  { value: '工资', label: '工资' },
  { value: '奖金', label: '奖金' },
  { value: '投资', label: '投资' },
  { value: '兼职', label: '兼职' },
  { value: '其他收入', label: '其他收入' },
  { value: '餐饮', label: '餐饮' },
  { value: '交通', label: '交通' },
  { value: '购物', label: '购物' },
  { value: '娱乐', label: '娱乐' },
  { value: '住房', label: '住房' },
  { value: '医疗', label: '医疗' },
  { value: '教育', label: '教育' },
  { value: '其他支出', label: '其他支出' }
];

/**
 * 筛选栏组件
 * @param {Function} onFilter - 筛选回调
 * @param {Object} initialFilters - 初始筛选条件
 * @returns {string} HTML字符串
 */
export function FilterBar(onFilter, initialFilters = {}) {
  // 存储回调到全局
  window._filterBarCallback = onFilter;
  
  const { type = '', category = '', startDate = '', endDate = '' } = initialFilters;
  
  return `
    <div class="filter-bar">
      <div class="filter-group">
        <label>类型</label>
        <select id="filter-type" onchange="FilterBar.handleChange()">
          <option value="">全部</option>
          <option value="income" ${type === 'income' ? 'selected' : ''}>收入</option>
          <option value="expense" ${type === 'expense' ? 'selected' : ''}>支出</option>
        </select>
      </div>
      
      <div class="filter-group">
        <label>分类</label>
        <select id="filter-category" onchange="FilterBar.handleChange()">
          ${CATEGORIES.map(c => `
            <option value="${c.value}" ${category === c.value ? 'selected' : ''}>${c.label}</option>
          `).join('')}
        </select>
      </div>
      
      <div class="filter-group">
        <label>开始日期</label>
        <input type="date" id="filter-start" value="${startDate}" onchange="FilterBar.handleChange()" />
      </div>
      
      <div class="filter-group">
        <label>结束日期</label>
        <input type="date" id="filter-end" value="${endDate}" onchange="FilterBar.handleChange()" max="${getToday()}" />
      </div>
      
      <button class="filter-btn" onclick="FilterBar.reset()">重置</button>
    </div>
  `;
}

/**
 * 获取当前筛选条件
 * @returns {Object} 筛选条件对象
 */
FilterBar.getFilters = function() {
  const type = document.getElementById('filter-type')?.value || '';
  const category = document.getElementById('filter-category')?.value || '';
  const startDate = document.getElementById('filter-start')?.value || '';
  const endDate = document.getElementById('filter-end')?.value || '';
  
  const filters = {};
  if (type) filters.type = type;
  if (category) filters.category = category;
  if (startDate) filters.startDate = startDate;
  if (endDate) filters.endDate = endDate;
  
  return filters;
};

/**
 * 处理筛选条件变化
 */
FilterBar.handleChange = function() {
  const filters = FilterBar.getFilters();
  window._filterBarCallback?.(filters);
};

/**
 * 重置筛选条件
 */
FilterBar.reset = function() {
  const typeSelect = document.getElementById('filter-type');
  const categorySelect = document.getElementById('filter-category');
  const startInput = document.getElementById('filter-start');
  const endInput = document.getElementById('filter-end');
  
  if (typeSelect) typeSelect.value = '';
  if (categorySelect) categorySelect.value = '';
  if (startInput) startInput.value = '';
  if (endInput) endInput.value = '';
  
  window._filterBarCallback?.({});
};

/**
 * 筛选记录
 * @param {Array} records - 记录数组
 * @param {Object} filters - 筛选条件
 * @returns {Array} 筛选后的记录
 */
FilterBar.filterRecords = function(records, filters) {
  if (!filters || Object.keys(filters).length === 0) {
    return records;
  }
  
  return records.filter(record => {
    // 类型筛选
    if (filters.type && record.type !== filters.type) {
      return false;
    }
    
    // 分类筛选
    if (filters.category && record.category !== filters.category) {
      return false;
    }
    
    // 日期范围筛选
    if (filters.startDate && record.date < filters.startDate) {
      return false;
    }
    if (filters.endDate && record.date > filters.endDate) {
      return false;
    }
    
    return true;
  });
};
