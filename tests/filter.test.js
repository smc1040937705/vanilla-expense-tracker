/**
 * 筛选逻辑测试
 * 测试场景：筛选逻辑正确性
 */

import { FilterBar } from '../components/FilterBar.js';

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

// 模拟数据
const mockRecords = [
  { id: '1', type: 'income', amount: 10000, category: '工资', date: '2024-03-15' },
  { id: '2', type: 'expense', amount: 5000, category: '餐饮', date: '2024-03-15' },
  { id: '3', type: 'expense', amount: 3000, category: '交通', date: '2024-03-16' },
  { id: '4', type: 'income', amount: 5000, category: '兼职', date: '2024-03-17' },
  { id: '5', type: 'expense', amount: 2000, category: '餐饮', date: '2024-03-17' },
  { id: '6', type: 'expense', amount: 10000, category: '购物', date: '2024-03-18' },
];

// 运行测试
console.log('🧪 筛选逻辑测试开始');

describe('FilterBar.filterRecords - 类型筛选', () => {
  it('应筛选出所有收入记录', () => {
    const result = FilterBar.filterRecords(mockRecords, { type: 'income' });
    expect(result).toHaveLength(2);
    expect(result.every(r => r.type === 'income')).toBe(true);
  });
  
  it('应筛选出所有支出记录', () => {
    const result = FilterBar.filterRecords(mockRecords, { type: 'expense' });
    expect(result).toHaveLength(4);
    expect(result.every(r => r.type === 'expense')).toBe(true);
  });
  
  it('无类型筛选时应返回所有记录', () => {
    const result = FilterBar.filterRecords(mockRecords, {});
    expect(result).toHaveLength(6);
  });
});

describe('FilterBar.filterRecords - 分类筛选', () => {
  it('应按分类筛选记录', () => {
    const result = FilterBar.filterRecords(mockRecords, { category: '餐饮' });
    expect(result).toHaveLength(2);
    expect(result.every(r => r.category === '餐饮')).toBe(true);
  });
  
  it('应筛选工资收入', () => {
    const result = FilterBar.filterRecords(mockRecords, { category: '工资' });
    expect(result).toHaveLength(1);
    expect(result[0].category).toBe('工资');
  });
  
  it('不存在的分类应返回空数组', () => {
    const result = FilterBar.filterRecords(mockRecords, { category: '不存在' });
    expect(result).toHaveLength(0);
  });
});

describe('FilterBar.filterRecords - 日期范围筛选', () => {
  it('应按开始日期筛选', () => {
    const result = FilterBar.filterRecords(mockRecords, { startDate: '2024-03-16' });
    expect(result).toHaveLength(4);
    expect(result.every(r => r.date >= '2024-03-16')).toBe(true);
  });
  
  it('应按结束日期筛选', () => {
    const result = FilterBar.filterRecords(mockRecords, { endDate: '2024-03-16' });
    expect(result).toHaveLength(3);
    expect(result.every(r => r.date <= '2024-03-16')).toBe(true);
  });
  
  it('应按日期范围筛选', () => {
    const result = FilterBar.filterRecords(mockRecords, { 
      startDate: '2024-03-16',
      endDate: '2024-03-17'
    });
    expect(result).toHaveLength(3);
  });
  
  it('空日期范围应返回所有记录', () => {
    const result = FilterBar.filterRecords(mockRecords, { startDate: '', endDate: '' });
    expect(result).toHaveLength(6);
  });
});

describe('FilterBar.filterRecords - 组合筛选', () => {
  it('应支持类型和分类组合筛选', () => {
    const result = FilterBar.filterRecords(mockRecords, { 
      type: 'expense',
      category: '餐饮'
    });
    expect(result).toHaveLength(2);
    expect(result.every(r => r.type === 'expense' && r.category === '餐饮')).toBe(true);
  });
  
  it('应支持类型和日期组合筛选', () => {
    const result = FilterBar.filterRecords(mockRecords, { 
      type: 'income',
      startDate: '2024-03-16'
    });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('4');
  });
  
  it('应支持所有条件组合筛选', () => {
    const result = FilterBar.filterRecords(mockRecords, { 
      type: 'expense',
      category: '餐饮',
      startDate: '2024-03-16',
      endDate: '2024-03-18'
    });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('5');
  });
  
  it('严格条件组合应返回空数组', () => {
    const result = FilterBar.filterRecords(mockRecords, { 
      type: 'income',
      category: '餐饮'
    });
    expect(result).toHaveLength(0);
  });
});

describe('FilterBar.filterRecords - 边界情况', () => {
  it('空记录数组应返回空数组', () => {
    const result = FilterBar.filterRecords([], { type: 'income' });
    expect(result).toHaveLength(0);
  });
  
  it('无筛选条件应返回原数组', () => {
    const result = FilterBar.filterRecords(mockRecords, {});
    expect(result).toHaveLength(6);
    expect(result).toEqual(mockRecords);
  });
  
  it('null筛选条件应返回原数组', () => {
    const result = FilterBar.filterRecords(mockRecords, null);
    expect(result).toHaveLength(6);
  });
  
  it('undefined筛选条件应返回原数组', () => {
    const result = FilterBar.filterRecords(mockRecords, undefined);
    expect(result).toHaveLength(6);
  });
});

console.log('\n✨ 筛选逻辑测试完成');
