import { toCents } from '../utils/money.js';
import { getToday } from '../utils/date.js';
import { validateForm } from '../utils/validator.js';

const CATEGORIES = {
  income: ['工资', '奖金', '投资', '兼职', '其他收入'],
  expense: ['餐饮', '交通', '购物', '娱乐', '住房', '医疗', '教育', '其他支出']
};

/**
 * 记录表单组件
 * @param {Function} onSubmit - 提交回调
 * @returns {string} HTML字符串
 */
export function RecordForm(onSubmit) {
  // 存储回调函数到全局，供事件处理使用
  window._recordFormSubmit = onSubmit;
  
  return `
    <form class="record-form" id="record-form">
      <div class="form-group">
        <label for="record-type">类型</label>
        <select id="record-type" name="type" onchange="RecordForm.updateCategories()">
          <option value="expense">支出</option>
          <option value="income">收入</option>
        </select>
      </div>
      
      <div class="form-group">
        <label for="record-amount">金额</label>
        <input 
          type="number" 
          id="record-amount" 
          name="amount" 
          placeholder="0.00" 
          step="0.01"
          min="0"
        />
        <span class="form-error" id="error-amount"></span>
      </div>
      
      <div class="form-group">
        <label for="record-category">分类</label>
        <select id="record-category" name="category">
          ${CATEGORIES.expense.map(c => `<option value="${c}">${c}</option>`).join('')}
        </select>
        <span class="form-error" id="error-category"></span>
      </div>
      
      <div class="form-group">
        <label for="record-date">日期</label>
        <input type="date" id="record-date" name="date" value="${getToday()}" max="${getToday()}" />
        <span class="form-error" id="error-date"></span>
      </div>
      
      <div class="form-group">
        <label for="record-note">备注</label>
        <textarea id="record-note" name="note" placeholder="可选填"></textarea>
        <span class="form-error" id="error-note"></span>
      </div>
      
      <div class="form-actions">
        <button type="submit" class="btn btn--primary">添加记录</button>
        <button type="button" class="btn btn--secondary" onclick="RecordForm.reset()">重置</button>
      </div>
    </form>
  `;
}

/**
 * 更新分类选项
 */
RecordForm.updateCategories = function() {
  const typeSelect = document.getElementById('record-type');
  const categorySelect = document.getElementById('record-category');
  const type = typeSelect.value;
  
  categorySelect.innerHTML = CATEGORIES[type]
    .map(c => `<option value="${c}">${c}</option>`)
    .join('');
};

/**
 * 重置表单
 */
RecordForm.reset = function() {
  const form = document.getElementById('record-form');
  if (form) {
    form.reset();
    document.getElementById('record-date').value = getToday();
    RecordForm.updateCategories();
    RecordForm.clearErrors();
  }
};

/**
 * 清除错误信息
 */
RecordForm.clearErrors = function() {
  document.querySelectorAll('.form-error').forEach(el => el.textContent = '');
  document.querySelectorAll('.form-group--error').forEach(el => {
    el.classList.remove('form-group--error');
  });
};

/**
 * 显示错误信息
 * @param {Object} errors - 错误对象
 */
RecordForm.showErrors = function(errors) {
  RecordForm.clearErrors();
  
  Object.entries(errors).forEach(([field, message]) => {
    const errorEl = document.getElementById(`error-${field}`);
    const inputEl = document.querySelector(`[name="${field}"]`);
    
    if (errorEl) errorEl.textContent = message;
    if (inputEl) inputEl.closest('.form-group')?.classList.add('form-group--error');
  });
};

/**
 * 获取表单数据
 * @returns {Object|null} 表单数据或null（验证失败）
 */
RecordForm.getData = function() {
  const form = document.getElementById('record-form');
  if (!form) return null;
  
  const formData = new FormData(form);
  const data = {
    type: formData.get('type'),
    amount: formData.get('amount'),
    category: formData.get('category'),
    date: formData.get('date'),
    note: formData.get('note') || ''
  };
  
  const validation = validateForm(data);
  
  if (!validation.valid) {
    RecordForm.showErrors(validation.errors);
    return null;
  }
  
  // 转换为存储格式
  return {
    type: data.type,
    amount: toCents(data.amount),
    category: data.category,
    date: data.date,
    note: data.note
  };
};

/**
 * 初始化表单事件
 */
RecordForm.init = function() {
  const form = document.getElementById('record-form');
  if (!form) return;
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const data = RecordForm.getData();
    if (data && window._recordFormSubmit) {
      window._recordFormSubmit(data);
      RecordForm.reset();
    }
  });
};
