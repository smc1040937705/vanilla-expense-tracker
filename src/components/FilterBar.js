// 筛选栏组件 - 纯原生实现
let currentFilters = {
  type: '',
  category: '',
  startDate: '',
  endDate: ''
};

let onFilterChange = null;

const initFilterBar = (callback) => {
  onFilterChange = callback;
  renderFilterBar();
  bindFilterEvents();
};

const renderFilterBar = () => {
  const container = document.getElementById('filter-bar');
  
  const allCategories = [
    ...categories.expense.map(c => ({ ...c, type: 'expense' })),
    ...categories.income.map(c => ({ ...c, type: 'income' }))
  ];
  
  container.innerHTML = `
    <div class="filter-group">
      <label>类型：</label>
      <select id="filter-type">
        <option value="">全部</option>
        <option value="income">收入</option>
        <option value="expense">支出</option>
      </select>
    </div>
    <div class="filter-group">
      <label>分类：</label>
      <select id="filter-category">
        <option value="">全部</option>
        ${allCategories.map(c => `<option value="${c.value}">${c.label}</option>`).join('')}
      </select>
    </div>
    <div class="filter-group">
      <label>开始日期：</label>
      <input type="date" id="filter-start-date">
    </div>
    <div class="filter-group">
      <label>结束日期：</label>
      <input type="date" id="filter-end-date">
    </div>
    <div class="filter-group">
      <button type="button" id="filter-reset">重置</button>
    </div>
  `;
};

const bindFilterEvents = () => {
  const filterType = document.getElementById('filter-type');
  const filterCategory = document.getElementById('filter-category');
  const filterStartDate = document.getElementById('filter-start-date');
  const filterEndDate = document.getElementById('filter-end-date');
  const filterReset = document.getElementById('filter-reset');
  
  const handleFilter = () => {
    currentFilters = {
      type: filterType.value,
      category: filterCategory.value,
      startDate: filterStartDate.value,
      endDate: filterEndDate.value
    };
    if (onFilterChange) {
      onFilterChange(currentFilters);
    }
  };
  
  filterType.addEventListener('change', handleFilter);
  filterCategory.addEventListener('change', handleFilter);
  filterStartDate.addEventListener('change', handleFilter);
  filterEndDate.addEventListener('change', handleFilter);
  
  filterReset.addEventListener('click', () => {
    filterType.value = '';
    filterCategory.value = '';
    filterStartDate.value = '';
    filterEndDate.value = '';
    currentFilters = {
      type: '',
      category: '',
      startDate: '',
      endDate: ''
    };
    if (onFilterChange) {
      onFilterChange(currentFilters);
    }
  });
};

const getCurrentFilters = () => currentFilters;
