// 统计卡片组件 - 纯原生实现
const renderStatCards = () => {
  const container = document.getElementById('stat-cards');
  const stats = store.getStatistics();
  
  container.innerHTML = `
    <div class="stat-card income">
      <h3>💵 总收入</h3>
      <div class="value">${formatAmount(stats.income)}</div>
    </div>
    <div class="stat-card expense">
      <h3>💸 总支出</h3>
      <div class="value">${formatAmount(stats.expense)}</div>
    </div>
    <div class="stat-card balance">
      <h3>💰 结余</h3>
      <div class="value">${formatAmount(stats.balance)}</div>
    </div>
  `;
};
