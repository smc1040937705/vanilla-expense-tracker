/**
 * 金额计算工具函数
 * 使用整数分单位，避免浮点误差
 */

/**
 * 将元转换为分
 * @param {number|string} yuan - 元为单位的金额
 * @returns {number} 分为单位的金额
 */
export function toCents(yuan) {
  if (typeof yuan === 'string') {
    yuan = parseFloat(yuan);
  }
  if (isNaN(yuan)) {
    return 0;
  }
  return Math.round(yuan * 100);
}

/**
 * 将分转换为元（用于显示）
 * @param {number} cents - 分为单位的金额
 * @param {number} decimals - 小数位数，默认2位
 * @returns {string} 格式化后的金额字符串
 */
export function toYuan(cents, decimals = 2) {
  if (typeof cents !== 'number' || isNaN(cents)) {
    cents = 0;
  }
  return (cents / 100).toFixed(decimals);
}

/**
 * 格式化金额显示
 * @param {number} cents - 分为单位的金额
 * @param {boolean} showSign - 是否显示正负号
 * @returns {string} 格式化后的金额
 */
export function formatMoney(cents, showSign = false) {
  const yuan = toYuan(cents);
  const sign = showSign && cents > 0 ? '+' : '';
  return `¥${sign}${yuan}`;
}

/**
 * 金额加法
 * @param {number} a - 分为单位的金额a
 * @param {number} b - 分为单位的金额b
 * @returns {number} 和（分）
 */
export function add(a, b) {
  return Math.round(a) + Math.round(b);
}

/**
 * 金额减法
 * @param {number} a - 分为单位的金额a
 * @param {number} b - 分为单位为金额b
 * @returns {number} 差（分）
 */
export function subtract(a, b) {
  return Math.round(a) - Math.round(b);
}

/**
 * 计算总和
 * @param {number[]} centsArray - 分为单位的金额数组
 * @returns {number} 总和（分）
 */
export function sum(centsArray) {
  return centsArray.reduce((acc, curr) => acc + Math.round(curr), 0);
}

/**
 * 计算结余（收入 - 支出）
 * @param {number} income - 收入（分）
 * @param {number} expense - 支出（分）
 * @returns {number} 结余（分）
 */
export function calculateBalance(income, expense) {
  return subtract(income, expense);
}
