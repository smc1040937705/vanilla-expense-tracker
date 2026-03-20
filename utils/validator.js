/**
 * 表单验证工具
 */

/**
 * 验证金额
 * @param {string|number} value - 金额值
 * @returns {string|null} 错误信息或null
 */
export function validateAmount(value) {
  if (value === '' || value === null || value === undefined) {
    return '请输入金额';
  }
  
  const num = parseFloat(value);
  if (isNaN(num)) {
    return '金额必须是数字';
  }
  
  if (num <= 0) {
    return '金额必须大于0';
  }
  
  if (num > 9999999) {
    return '金额超出范围';
  }
  
  // 检查小数位数
  const decimalStr = value.toString().split('.')[1];
  if (decimalStr && decimalStr.length > 2) {
    return '金额最多保留两位小数';
  }
  
  return null;
}

/**
 * 验证分类
 * @param {string} value - 分类值
 * @returns {string|null} 错误信息或null
 */
export function validateCategory(value) {
  if (!value || value.trim() === '') {
    return '请选择分类';
  }
  return null;
}

/**
 * 验证日期
 * @param {string} value - 日期值
 * @returns {string|null} 错误信息或null
 */
export function validateDate(value) {
  if (!value) {
    return '请选择日期';
  }
  
  const date = new Date(value);
  if (isNaN(date.getTime())) {
    return '日期格式不正确';
  }
  
  // 不能选择未来日期
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  if (date > today) {
    return '不能选择未来日期';
  }
  
  return null;
}

/**
 * 验证备注
 * @param {string} value - 备注值
 * @returns {string|null} 错误信息或null
 */
export function validateNote(value) {
  if (value && value.length > 100) {
    return '备注不能超过100个字符';
  }
  return null;
}

/**
 * 验证整个表单
 * @param {Object} formData - 表单数据
 * @returns {Object} { valid: boolean, errors: Object }
 */
export function validateForm(formData) {
  const errors = {};
  
  const amountError = validateAmount(formData.amount);
  if (amountError) errors.amount = amountError;
  
  const categoryError = validateCategory(formData.category);
  if (categoryError) errors.category = categoryError;
  
  const dateError = validateDate(formData.date);
  if (dateError) errors.date = dateError;
  
  const noteError = validateNote(formData.note);
  if (noteError) errors.note = noteError;
  
  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
}
