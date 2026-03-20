import { formatMoney } from '../utils/money.js';

/**
 * 统计卡片组件
 * @param {Object} props
 * @param {string} props.title - 标题
 * @param {number} props.amount - 金额（分）
 * @param {string} props.type - 类型: 'income' | 'expense' | 'balance'
 */
export function StatCard({ title, amount, type }) {
  const typeClass = `stat-card--${type}`;
  
  return `
    <div class="stat-card ${typeClass}">
      <div class="stat-card__title">${title}</div>
      <div class="stat-card__amount">${formatMoney(amount)}</div>
    </div>
  `;
}

/**
 * 渲染统计卡片组
 * @param {Object} stats
 * @param {number} stats.income - 总收入
 * @param {number} stats.expense - 总支出
 * @param {number} stats.balance - 结余
 * @returns {string} HTML字符串
 */
export function renderStatCards({ income, expense, balance }) {
  return `
    ${StatCard({ title: '总收入', amount: income, type: 'income' })}
    ${StatCard({ title: '总支出', amount: expense, type: 'expense' })}
    ${StatCard({ title: '结余', amount: balance, type: 'balance' })}
  `;
}
