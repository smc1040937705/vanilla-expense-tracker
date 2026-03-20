// 主入口文件 - 纯原生实现
const init = () => {
  renderStatCards();
  initFilterBar(handleFilterChange);
  renderChart();
  renderRecordList();
  initRecordForm();
  
  const addBtn = document.getElementById('add-record-btn');
  addBtn.addEventListener('click', () => openForm());
  
  window.addEventListener('editRecord', (e) => {
    openForm(e.detail);
  });
  
  store.subscribe(() => {
    renderStatCards();
    renderChart();
    renderRecordList();
  });
  
  window.addEventListener('resize', () => {
    renderChart();
  });
};

const handleFilterChange = (filters) => {
  renderRecordList(filters);
};

document.addEventListener('DOMContentLoaded', init);
