// 表单组件 - 纯原生实现
let currentType = 'expense';
let editingId = null;

const initRecordForm = () => {
  bindFormEvents();
  setDefaultDate();
};

const openForm = (record = null) => {
  const modal = document.getElementById('form-modal');
  const modalTitle = document.getElementById('modal-title');
  const form = document.getElementById('record-form');
  
  editingId = record ? record.id : null;
  
  if (record) {
    modalTitle.textContent = '编辑记录';
    fillForm(record);
  } else {
    modalTitle.textContent = '添加记录';
    form.reset();
    setDefaultDate();
    currentType = 'expense';
    updateCategoryOptions();
    updateTypeButtons();
  }
  
  clearErrors();
  modal.classList.add('show');
};

const closeForm = () => {
  const modal = document.getElementById('form-modal');
  modal.classList.remove('show');
  editingId = null;
};

const bindFormEvents = () => {
  const modal = document.getElementById('form-modal');
  const form = document.getElementById('record-form');
  const closeBtn = modal.querySelector('.close-btn');
  const cancelBtn = modal.querySelector('.cancel-btn');
  const typeBtns = modal.querySelectorAll('.type-btn');
  
  closeBtn.addEventListener('click', closeForm);
  cancelBtn.addEventListener('click', closeForm);
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeForm();
    }
  });
  
  typeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      currentType = btn.dataset.type;
      updateTypeButtons();
      updateCategoryOptions();
    });
  });
  
  form.addEventListener('submit', handleSubmit);
};

const updateTypeButtons = () => {
  const typeBtns = document.querySelectorAll('.type-btn');
  typeBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.type === currentType);
  });
};

const updateCategoryOptions = () => {
  const categorySelect = document.getElementById('category');
  const categoryList = categories[currentType] || [];
  
  const currentValue = categorySelect.value;
  
  categorySelect.innerHTML = `
    <option value="">请选择分类</option>
    ${categoryList.map(c => `<option value="${c.value}">${c.label}</option>`).join('')}
  `;
  
  categorySelect.value = currentValue;
};

const setDefaultDate = () => {
  const dateInput = document.getElementById('date');
  dateInput.value = new Date().toISOString().split('T')[0];
};

const fillForm = (record) => {
  const amountInput = document.getElementById('amount');
  const categorySelect = document.getElementById('category');
  const dateInput = document.getElementById('date');
  const remarkInput = document.getElementById('remark');
  
  currentType = record.type;
  updateTypeButtons();
  updateCategoryOptions();
  
  amountInput.value = (record.amount / 100).toFixed(2);
  categorySelect.value = record.category;
  dateInput.value = record.date;
  remarkInput.value = record.remark || '';
};

const validateForm = () => {
  const amountInput = document.getElementById('amount');
  const categorySelect = document.getElementById('category');
  const dateInput = document.getElementById('date');
  
  let isValid = true;
  
  const amount = parseFloat(amountInput.value);
  if (!amountInput.value || isNaN(amount) || amount <= 0) {
    showError('amount', '请输入有效的金额');
    isValid = false;
  } else if (amount > 9999999.99) {
    showError('amount', '金额不能超过9999999.99');
    isValid = false;
  } else {
    hideError('amount');
  }
  
  if (!categorySelect.value) {
    showError('category', '请选择分类');
    isValid = false;
  } else {
    hideError('category');
  }
  
  if (!dateInput.value) {
    showError('date', '请选择日期');
    isValid = false;
  } else {
    hideError('date');
  }
  
  return isValid;
};

const showError = (field, message) => {
  const input = document.getElementById(field);
  const error = document.getElementById(`${field}-error`);
  input.classList.add('error');
  error.textContent = message;
  error.classList.add('show');
};

const hideError = (field) => {
  const input = document.getElementById(field);
  const error = document.getElementById(`${field}-error`);
  input.classList.remove('error');
  error.classList.remove('show');
};

const clearErrors = () => {
  ['amount', 'category', 'date'].forEach(hideError);
};

const handleSubmit = (e) => {
  e.preventDefault();
  
  if (!validateForm()) {
    return;
  }
  
  const amountInput = document.getElementById('amount');
  const categorySelect = document.getElementById('category');
  const dateInput = document.getElementById('date');
  const remarkInput = document.getElementById('remark');
  
  const record = {
    type: currentType,
    amount: Math.round(parseFloat(amountInput.value) * 100),
    category: categorySelect.value,
    date: dateInput.value,
    remark: remarkInput.value.trim()
  };
  
  if (editingId) {
    store.updateRecord(editingId, record);
  } else {
    store.addRecord(record);
  }
  
  closeForm();
};
