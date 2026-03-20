/**
 * 日期工具函数
 */

/**
 * 格式化日期
 * @param {Date|string} date - 日期对象或字符串
 * @param {string} format - 格式，默认 'YYYY-MM-DD'
 * @returns {string} 格式化后的日期字符串
 */
export function formatDate(date, format = 'YYYY-MM-DD') {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  
  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day);
}

/**
 * 获取今天的日期字符串
 * @returns {string} YYYY-MM-DD 格式
 */
export function getToday() {
  return formatDate(new Date());
}

/**
 * 获取最近 N 天的日期数组
 * @param {number} days - 天数
 * @returns {string[]} 日期字符串数组（YYYY-MM-DD）
 */
export function getRecentDays(days = 7) {
  const result = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    result.push(formatDate(date));
  }
  
  return result;
}

/**
 * 判断日期是否在范围内
 * @param {string} date - 日期字符串
 * @param {string} startDate - 开始日期
 * @param {string} endDate - 结束日期
 * @returns {boolean}
 */
export function isDateInRange(date, startDate, endDate) {
  const d = new Date(date);
  const start = startDate ? new Date(startDate) : null;
  const end = endDate ? new Date(endDate) : null;
  
  if (start && d < start) return false;
  if (end && d > end) return false;
  
  return true;
}

/**
 * 获取日期对应的星期
 * @param {string} dateStr - 日期字符串
 * @returns {string} 星期几
 */
export function getWeekDay(dateStr) {
  const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const date = new Date(dateStr);
  return days[date.getDay()];
}
