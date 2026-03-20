import { getRecentDays, formatDate } from '../utils/date.js';
import { formatMoney, toYuan } from '../utils/money.js';

/**
 * 图表组件 - Canvas 柱状图
 * @param {Array} records - 记录数组
 * @returns {string} HTML字符串
 */
export function Chart(records) {
  // 使用 setTimeout 确保 DOM 渲染后再绘制
  setTimeout(() => Chart.draw(records), 0);
  
  return `
    <div class="chart-container">
      <canvas id="trend-chart" class="chart-canvas"></canvas>
    </div>
  `;
}

/**
 * 聚合近7天数据
 * @param {Array} records - 记录数组
 * @returns {Object} { labels: [], income: [], expense: [] }
 */
Chart.aggregateData = function(records) {
  const recentDays = getRecentDays(7);
  const data = {
    labels: recentDays.map(date => {
      const d = new Date(date);
      return `${d.getMonth() + 1}/${d.getDate()}`;
    }),
    income: new Array(7).fill(0),
    expense: new Array(7).fill(0)
  };
  
  if (!records) return data;
  
  records.forEach(record => {
    const dayIndex = recentDays.indexOf(record.date);
    if (dayIndex > -1) {
      if (record.type === 'income') {
        data.income[dayIndex] += record.amount;
      } else {
        data.expense[dayIndex] += record.amount;
      }
    }
  });
  
  return data;
};

/**
 * 绘制图表
 * @param {Array} records - 记录数组
 */
Chart.draw = function(records) {
  const canvas = document.getElementById('trend-chart');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const data = Chart.aggregateData(records);
  
  // 设置 canvas 尺寸
  const container = canvas.parentElement;
  const dpr = window.devicePixelRatio || 1;
  const rect = container.getBoundingClientRect();
  
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  canvas.style.width = rect.width + 'px';
  canvas.style.height = rect.height + 'px';
  
  ctx.scale(dpr, dpr);
  
  const width = rect.width;
  const height = rect.height;
  
  // 边距
  const padding = { top: 40, right: 20, bottom: 50, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  
  // 清空画布
  ctx.clearRect(0, 0, width, height);
  
  // 计算最大值
  const maxValue = Math.max(
    ...data.income,
    ...data.expense,
    100 // 最小刻度
  );
  
  // 颜色
  const incomeColor = '#4caf50';
  const expenseColor = '#f44336';
  const gridColor = '#e0e0e0';
  const textColor = '#666666';
  
  // 绘制网格线和Y轴标签
  const gridLines = 5;
  ctx.strokeStyle = gridColor;
  ctx.lineWidth = 1;
  ctx.fillStyle = textColor;
  ctx.font = '12px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  
  for (let i = 0; i <= gridLines; i++) {
    const y = padding.top + (chartHeight / gridLines) * i;
    const value = maxValue * (1 - i / gridLines);
    
    // 网格线
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(width - padding.right, y);
    ctx.stroke();
    
    // Y轴标签
    ctx.fillText('¥' + toYuan(value, 0), padding.left - 8, y);
  }
  
  // 绘制柱状图
  const barGroupWidth = chartWidth / data.labels.length;
  const barWidth = barGroupWidth * 0.35;
  const barGap = barGroupWidth * 0.1;
  
  data.labels.forEach((label, index) => {
    const x = padding.left + barGroupWidth * index + barGroupWidth / 2;
    
    // 收入柱
    const incomeHeight = (data.income[index] / maxValue) * chartHeight;
    const incomeY = padding.top + chartHeight - incomeHeight;
    
    ctx.fillStyle = incomeColor;
    ctx.fillRect(x - barWidth - barGap / 2, incomeY, barWidth, incomeHeight);
    
    // 支出柱
    const expenseHeight = (data.expense[index] / maxValue) * chartHeight;
    const expenseY = padding.top + chartHeight - expenseHeight;
    
    ctx.fillStyle = expenseColor;
    ctx.fillRect(x + barGap / 2, expenseY, barWidth, expenseHeight);
    
    // X轴标签
    ctx.fillStyle = textColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(label, x, padding.top + chartHeight + 8);
  });
  
  // 绘制图例
  const legendY = 20;
  const legendX = width - padding.right - 120;
  
  // 收入图例
  ctx.fillStyle = incomeColor;
  ctx.fillRect(legendX, legendY - 6, 12, 12);
  ctx.fillStyle = textColor;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('收入', legendX + 18, legendY);
  
  // 支出图例
  ctx.fillStyle = expenseColor;
  ctx.fillRect(legendX + 60, legendY - 6, 12, 12);
  ctx.fillStyle = textColor;
  ctx.fillText('支出', legendX + 78, legendY);
};

/**
 * 重新绘制图表（响应窗口大小变化）
 * @param {Array} records - 记录数组
 */
Chart.redraw = function(records) {
  Chart.draw(records);
};
