// 记录列表组件 - 纯原生实现
let currentRecords = [];
let eventListenerBound = false;

const renderRecordList = (filters = {}) => {
  const container = document.getElementById('record-list');
  const records = store.filterRecords(filters);
  currentRecords = records;
  
  if (!eventListenerBound) {
    bindRecordEvents();
    eventListenerBound = true;
  }
  
  if (records.length === 0) {
    container.innerHTML = `
      <h2>📝 收支记录</h2>
      <div class="empty-state">
        <p>暂无记录，点击右下角按钮添加第一条记录</p>
      </div>
    `;
    return;
  }
  
  container.innerHTML = `
    <h2>📝 收支记录 (共${records.length}条)</h2>
    ${records.map(record => `
      <div class="record-item" data-id="${record.id}">
        <span class="type ${record.type}">${record.type === 'income' ? '收入' : '支出'}</span>
        <span class="category">${getCategoryLabel(record.type, record.category)}</span>
        <span class="remark">${record.remark || '-'}</span>
        <span class="date">${record.date}</span>
        <span class="amount ${record.type}">${record.type === 'income' ? '+' : '-'}${formatAmount(record.amount)}</span>
        <div class="actions">
          <button class="edit-btn" data-id="${record.id}">编辑</button>
          <button class="delete-btn" data-id="${record.id}">删除</button>
        </div>
      </div>
    `).join('')}
  `;
};

const bindRecordEvents = () => {
  const container = document.getElementById('record-list');
  
  container.addEventListener('click', (e) => {
    const editBtn = e.target.closest('.edit-btn');
    const deleteBtn = e.target.closest('.delete-btn');
    
    if (editBtn) {
      const id = parseInt(editBtn.dataset.id);
      const record = store.getRecordById(id);
      if (record) {
        window.dispatchEvent(new CustomEvent('editRecord', { detail: record }));
      }
    }
    
    if (deleteBtn) {
      const id = parseInt(deleteBtn.dataset.id);
      if (confirm('确定要删除这条记录吗？')) {
        store.deleteRecord(id);
      }
    }
  });
};

const getCurrentRecords = () => currentRecords;
