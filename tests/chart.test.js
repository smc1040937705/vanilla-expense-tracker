/**
 * 图表数据聚合测试
 * 测试场景：图表数据聚合结果
 */

import { Chart } from '../components/Chart.js';

// 测试工具函数
function describe(name, fn) {
  console.log(`\n📦 ${name}`);
  fn();
}

function it(name, fn) {
  try {
    fn();
    console.log(`  ✅ ${name}`);
  } catch (e) {
    console.log(`  ❌ ${name}`);
    console.error(`     ${e.message}`);
  }
}

function expect(actual) {
  return {
    toBe(expected) {
      if (actual !== expected) {
        throw new Error(`期望 ${expected}，实际得到 ${actual}`);
      }
    },
    toEqual(expected) {
      if (JSON.stringify(actual) !== JSON.stringify(expected)) {
        throw new Error(`期望 ${JSON.stringify(expected)}，实际得到 ${JSON.stringify(actual)}`);
      }
    },
    toHaveLength(expected) {
      if (actual.length !== expected) {
        throw new Error(`期望长度 ${expected}，实际得到 ${actual.length}`);
      }
    }
  };
}

// 获取今天和最近日期的辅助函数
function getToday() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function getDateString(daysAgo) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// 运行测试
console.log('🧪 图表数据聚合测试开始');

describe('Chart.aggregateData - 基本功能', () => {
  it('应返回7天的数据结构', () => {
    const result = Chart.aggregateData([]);
    expect(result.labels).toHaveLength(7);
    expect(result.income).toHaveLength(7);
    expect(result.expense).toHaveLength(7);
  });
  
  it('空数据时所有值为0', () => {
    const result = Chart.aggregateData([]);
    expect(result.income.every(v => v === 0)).toBe(true);
    expect(result.expense.every(v => v === 0)).toBe(true);
  });
  
  it('应正确聚合单日数据', () => {
    const today = getDateString(0);
    const records = [
      { type: 'income', amount: 10000, date: today },
      { type: 'expense', amount: 5000, date: today }
    ];
    const result = Chart.aggregateData(records);
    
    // 最后一天（今天）的数据
    expect(result.income[6]).toBe(10000);
    expect(result.expense[6]).toBe(5000);
  });
});

describe('Chart.aggregateData - 多日数据聚合', () => {
  it('应正确聚合多日收入', () => {
    const records = [
      { type: 'income', amount: 1000, date: getDateString(2) },
      { type: 'income', amount: 2000, date: getDateString(2) },
      { type: 'income', amount: 3000, date: getDateString(1) }
    ];
    const result = Chart.aggregateData(records);
    
    // 倒数第3天（2天前）的收入总和
    expect(result.income[4]).toBe(3000);
    // 倒数第2天（1天前）的收入
    expect(result.income[5]).toBe(3000);
  });
  
  it('应正确聚合多日支出', () => {
    const records = [
      { type: 'expense', amount: 500, date: getDateString(0) },
      { type: 'expense', amount: 500, date: getDateString(0) },
      { type: 'expense', amount: 1000, date: getDateString(1) }
    ];
    const result = Chart.aggregateData(records);
    
    // 今天（最后一天）的支出总和
    expect(result.expense[6]).toBe(1000);
    // 昨天的支出
    expect(result.expense[5]).toBe(1000);
  });
  
  it('应同时处理收入和支出', () => {
    const records = [
      { type: 'income', amount: 10000, date: getDateString(0) },
      { type: 'expense', amount: 3000, date: getDateString(0) },
      { type: 'expense', amount: 2000, date: getDateString(0) }
    ];
    const result = Chart.aggregateData(records);
    
    expect(result.income[6]).toBe(10000);
    expect(result.expense[6]).toBe(5000);
  });
});

describe('Chart.aggregateData - 日期范围处理', () => {
  it('应忽略7天之前的数据', () => {
    const records = [
      { type: 'income', amount: 99999, date: getDateString(10) },
      { type: 'income', amount: 1000, date: getDateString(5) }
    ];
    const result = Chart.aggregateData(records);
    
    // 所有收入应该只有1000（7天内的数据）
    const totalIncome = result.income.reduce((a, b) => a + b, 0);
    expect(totalIncome).toBe(1000);
  });
  
  it('应忽略未来日期', () => {
    const tomorrow = getDateString(-1); // 负数表示未来
    const records = [
      { type: 'income', amount: 99999, date: tomorrow },
      { type: 'income', amount: 1000, date: getDateString(0) }
    ];
    const result = Chart.aggregateData(records);
    
    const totalIncome = result.income.reduce((a, b) => a + b, 0);
    expect(totalIncome).toBe(1000);
  });
});

describe('Chart.aggregateData - 数据准确性', () => {
  it('应准确计算复杂场景', () => {
    const records = [];
    // 为最近7天每天添加数据
    for (let i = 0; i < 7; i++) {
      records.push(
        { type: 'income', amount: (i + 1) * 1000, date: getDateString(6 - i) },
        { type: 'expense', amount: (i + 1) * 500, date: getDateString(6 - i) }
      );
    }
    
    const result = Chart.aggregateData(records);
    
    // 验证收入：1000, 2000, 3000, 4000, 5000, 6000, 7000
    expect(result.income).toEqual([1000, 2000, 3000, 4000, 5000, 6000, 7000]);
    
    // 验证支出：500, 1000, 1500, 2000, 2500, 3000, 3500
    expect(result.expense).toEqual([500, 1000, 1500, 2000, 2500, 3000, 3500]);
  });
  
  it('应处理同一天多条记录', () => {
    const today = getDateString(0);
    const records = [
      { type: 'income', amount: 1000, date: today },
      { type: 'income', amount: 2000, date: today },
      { type: 'income', amount: 3000, date: today },
      { type: 'expense', amount: 500, date: today },
      { type: 'expense', amount: 1500, date: today }
    ];
    const result = Chart.aggregateData(records);
    
    expect(result.income[6]).toBe(6000);
    expect(result.expense[6]).toBe(2000);
  });
});

describe('Chart.aggregateData - 边界情况', () => {
  it('应处理null记录', () => {
    const result = Chart.aggregateData(null);
    expect(result.labels).toHaveLength(7);
    expect(result.income).toHaveLength(7);
    expect(result.expense).toHaveLength(7);
  });
  
  it('应处理undefined记录', () => {
    const result = Chart.aggregateData(undefined);
    expect(result.labels).toHaveLength(7);
  });
  
  it('应处理空数组', () => {
    const result = Chart.aggregateData([]);
    expect(result.income.every(v => v === 0)).toBe(true);
    expect(result.expense.every(v => v === 0)).toBe(true);
  });
  
  it('labels应为日期格式', () => {
    const result = Chart.aggregateData([]);
    // 验证标签格式为 M/D
    const labelPattern = /^\d{1,2}\/\d{1,2}$/;
    expect(result.labels.every(l => labelPattern.test(l))).toBe(true);
  });
});

console.log('\n✨ 图表数据聚合测试完成');
