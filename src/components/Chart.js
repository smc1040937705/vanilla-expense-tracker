// 图表组件 - 纯原生实现
const PRIMARY_COLOR = '#1d90f5';
const DANGER_COLOR = '#f44336';
const SUCCESS_COLOR = '#4caf50';
const GRID_COLOR = '#e0e0e0';
const TEXT_COLOR = '#666666';

const renderChart = () => {
  const canvas = document.getElementById('trend-chart');
  const ctx = canvas.getContext('2d');
  
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * window.devicePixelRatio;
  canvas.height = rect.height * window.devicePixelRatio;
  ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  
  const width = rect.width;
  const height = rect.height;
  const padding = { top: 30, right: 30, bottom: 50, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  
  const data = store.getLast7DaysData();
  
  const maxValue = Math.max(
    ...data.map(d => Math.max(d.income, d.expense)),
    1
  );
  
  ctx.clearRect(0, 0, width, height);
  
  drawGrid(ctx, padding, chartWidth, chartHeight, maxValue);
  drawBars(ctx, data, padding, chartWidth, chartHeight, maxValue);
  drawLabels(ctx, data, padding, chartWidth, chartHeight);
};

const drawGrid = (ctx, padding, chartWidth, chartHeight, maxValue) => {
  ctx.strokeStyle = GRID_COLOR;
  ctx.lineWidth = 1;
  
  const horizontalLines = 5;
  for (let i = 0; i <= horizontalLines; i++) {
    const y = padding.top + (chartHeight / horizontalLines) * i;
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(padding.left + chartWidth, y);
    ctx.stroke();
    
    const value = maxValue * (1 - i / horizontalLines);
    ctx.fillStyle = TEXT_COLOR;
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(formatChartValue(value), padding.left - 10, y + 4);
  }
};

const drawBars = (ctx, data, padding, chartWidth, chartHeight, maxValue) => {
  const barGroupWidth = chartWidth / data.length;
  const barWidth = barGroupWidth * 0.35;
  const barGap = barGroupWidth * 0.15;
  
  data.forEach((item, index) => {
    const x = padding.left + barGroupWidth * index + barGap;
    const incomeHeight = (item.income / maxValue) * chartHeight;
    const expenseHeight = (item.expense / maxValue) * chartHeight;
    
    ctx.fillStyle = SUCCESS_COLOR;
    ctx.fillRect(
      x,
      padding.top + chartHeight - incomeHeight,
      barWidth,
      Math.max(incomeHeight, 1)
    );
    
    ctx.fillStyle = DANGER_COLOR;
    ctx.fillRect(
      x + barWidth + barGap,
      padding.top + chartHeight - expenseHeight,
      barWidth,
      Math.max(expenseHeight, 1)
    );
  });
  
  const legendX = padding.left + chartWidth / 2 - 60;
  const legendY = padding.top + chartHeight + 30;
  
  ctx.fillStyle = SUCCESS_COLOR;
  ctx.fillRect(legendX, legendY, 16, 12);
  ctx.fillStyle = TEXT_COLOR;
  ctx.font = '12px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('收入', legendX + 22, legendY + 10);
  
  ctx.fillStyle = DANGER_COLOR;
  ctx.fillRect(legendX + 70, legendY, 16, 12);
  ctx.fillStyle = TEXT_COLOR;
  ctx.fillText('支出', legendX + 92, legendY + 10);
};

const drawLabels = (ctx, data, padding, chartWidth, chartHeight) => {
  const barGroupWidth = chartWidth / data.length;
  
  ctx.fillStyle = TEXT_COLOR;
  ctx.font = '12px sans-serif';
  ctx.textAlign = 'center';
  
  data.forEach((item, index) => {
    const x = padding.left + barGroupWidth * index + barGroupWidth / 2;
    const y = padding.top + chartHeight + 20;
    ctx.fillText(item.label, x, y);
  });
};

const formatChartValue = (fen) => {
  const yuan = fen / 100;
  if (yuan >= 1000) {
    return (yuan / 1000).toFixed(1) + 'k';
  }
  return yuan.toFixed(0);
};
