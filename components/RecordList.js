import { formatMoney } from '../utils/money.js';
import { formatDate, getWeekDay } from '../utils/date.js';

/**
 * 记录列表组件
 * @param {Array} records - 记录数组
 * @param {Function} onDelete - 删除回调
 * @returns {string} HTML字符串
 */
export function RecordList(records, onDelete) {
  // 存储回调到全局
  window._recordListDelete = onDelete;
  
  if (!records || records.length === 0) {
    return '<div class="record-list__empty">暂无记录</div>';
  }
  
  return `
    <div class="record-list">
      ${records.map(record => RecordItem(record)).join('')}
    </div>
  `;
}

/**
 * 单个记录项
 * @param {Object} record
 * @returns {string} HTML字符串
 */
function RecordItem(record) {
  const isIncome = record.type === 'income';
  const typeText = isIncome ? '收' : '支';
  const typeClass = isIncome ? 'income' : 'expense';
  const amountClass = `record-item__amount--${typeClass}`;
  const sign = isIncome ? '+' : '-';
  
  const dateStr = formatDate(record.date, 'MM-DD');
  const weekDay = getWeekDay(record.date);
  
  return `
    <div class="record-item" data-id="${record.id}">
      <div class="record-item__type record-item__type--${typeClass}">
        ${typeText}
      </div>
      <div class="record-item__info">
        <span class="record-item__category">${record.category}</span>
        ${record.note ? `<span class="record-item__note">${record.note}</span>` : ''}
      </div>
      <div class="record-item__amount ${amountClass}">
        ${sign}${formatMoney(record.amount).replace('¥', '')}
      </div>
      <div class="record-item__date">${dateStr} ${weekDay}</div>
      <button class="record-item__delete" onclick="RecordList.delete('${record.id}')">删除</button>
    </div>
  `;
}

/**
 * 删除记录
 * @param {string} id - 记录ID
 */
RecordList.delete = function(id) {
  if (confirm('确定要删除这条记录吗？')) {
    window._recordListDelete?.(id);
  }
};

/**
 * 渲染记录列表
 * @param {Array} records - 记录数组
 * @param {Function} onDelete - 删除回调
 * @param {HTMLElement} container - 容器元素
 */
RecordList.render = function(records, onDelete, container) {
  if (container) {
    container.innerHTML = RecordList(records, onDelete);
  }
};
