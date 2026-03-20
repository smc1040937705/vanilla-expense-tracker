/**
 * 表单校验规则测试
 * 测试场景：表单校验规则
 */

import {
  validateAmount,
  validateCategory,
  validateDate,
  validateNote,
  validateForm
} from '../utils/validator.js';

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
    toBeNull() {
      if (actual !== null) {
        throw new Error(`期望 null，实际得到 ${actual}`);
      }
    },
    toBeTruthy() {
      if (!actual) {
        throw new Error(`期望真值，实际得到 ${actual}`);
      }
    },
    toBeFalsy() {
      if (actual) {
        throw new Error(`期望假值，实际得到 ${actual}`);
      }
    },
    toEqual(expected) {
      if (JSON.stringify(actual) !== JSON.stringify(expected)) {
        throw new Error(`期望 ${JSON.stringify(expected)}，实际得到 ${JSON.stringify(actual)}`);
      }
    }
  };
}

// 获取今天日期的辅助函数
function getToday() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function getTomorrow() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function getYesterday() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// 运行测试
console.log('🧪 表单校验规则测试开始');

describe('validateAmount - 金额验证', () => {
  it('应接受有效金额', () => {
    expect(validateAmount('100')).toBeNull();
    expect(validateAmount('10.5')).toBeNull();
    expect(validateAmount('0.01')).toBeNull();
    expect(validateAmount(100)).toBeNull();
  });
  
  it('应拒绝空值', () => {
    expect(validateAmount('')).toBe('请输入金额');
    expect(validateAmount(null)).toBe('请输入金额');
    expect(validateAmount(undefined)).toBe('请输入金额');
  });
  
  it('应拒绝非数字', () => {
    expect(validateAmount('abc')).toBe('金额必须是数字');
    expect(validateAmount('10.5.5')).toBe('金额必须是数字');
  });
  
  it('应拒绝小于等于0的金额', () => {
    expect(validateAmount('0')).toBe('金额必须大于0');
    expect(validateAmount('-10')).toBe('金额必须大于0');
    expect(validateAmount('-0.01')).toBe('金额必须大于0');
  });
  
  it('应拒绝过大的金额', () => {
    expect(validateAmount('10000000')).toBe('金额超出范围');
    expect(validateAmount('9999999.01')).toBe('金额超出范围');
  });
  
  it('应拒绝超过两位小数', () => {
    expect(validateAmount('10.001')).toBe('金额最多保留两位小数');
    expect(validateAmount('10.123')).toBe('金额最多保留两位小数');
  });
  
  it('应接受边界金额', () => {
    expect(validateAmount('0.01')).toBeNull();
    expect(validateAmount('9999999')).toBeNull();
    expect(validateAmount('9999999.99')).toBeNull();
  });
});

describe('validateCategory - 分类验证', () => {
  it('应接受有效分类', () => {
    expect(validateCategory('餐饮')).toBeNull();
    expect(validateCategory('工资')).toBeNull();
    expect(validateCategory('其他')).toBeNull();
  });
  
  it('应拒绝空值', () => {
    expect(validateCategory('')).toBe('请选择分类');
    expect(validateCategory(null)).toBe('请选择分类');
    expect(validateCategory(undefined)).toBe('请选择分类');
  });
  
  it('应拒绝空白字符', () => {
    expect(validateCategory('  ')).toBe('请选择分类');
    expect(validateCategory('   ')).toBe('请选择分类');
  });
});

describe('validateDate - 日期验证', () => {
  it('应接受有效日期', () => {
    expect(validateDate(getToday())).toBeNull();
    expect(validateDate(getYesterday())).toBeNull();
    expect(validateDate('2024-01-01')).toBeNull();
  });
  
  it('应拒绝空值', () => {
    expect(validateDate('')).toBe('请选择日期');
    expect(validateDate(null)).toBe('请选择日期');
    expect(validateDate(undefined)).toBe('请选择日期');
  });
  
  it('应拒绝无效日期格式', () => {
    expect(validateDate('invalid')).toBe('日期格式不正确');
    expect(validateDate('2024-13-01')).toBe('日期格式不正确');
    expect(validateDate('2024-01-32')).toBe('日期格式不正确');
  });
  
  it('应拒绝未来日期', () => {
    expect(validateDate(getTomorrow())).toBe('不能选择未来日期');
    expect(validateDate('2099-01-01')).toBe('不能选择未来日期');
  });
});

describe('validateNote - 备注验证', () => {
  it('应接受空备注', () => {
    expect(validateNote('')).toBeNull();
    expect(validateNote(null)).toBeNull();
    expect(validateNote(undefined)).toBeNull();
  });
  
  it('应接受有效备注', () => {
    expect(validateNote('午餐')).toBeNull();
    expect(validateNote('这是一段正常的备注')).toBeNull();
  });
  
  it('应拒绝过长的备注', () => {
    const longNote = 'a'.repeat(101);
    expect(validateNote(longNote)).toBe('备注不能超过100个字符');
  });
  
  it('应接受边界长度备注', () => {
    const maxNote = 'a'.repeat(100);
    expect(validateNote(maxNote)).toBeNull();
  });
});

describe('validateForm - 完整表单验证', () => {
  it('应验证通过有效表单', () => {
    const formData = {
      amount: '100',
      category: '餐饮',
      date: getToday(),
      note: '午餐'
    };
    const result = validateForm(formData);
    expect(result.valid).toBe(true);
    expect(Object.keys(result.errors)).toHaveLength(0);
  });
  
  it('应验证通过无备注的表单', () => {
    const formData = {
      amount: '100',
      category: '餐饮',
      date: getToday(),
      note: ''
    };
    const result = validateForm(formData);
    expect(result.valid).toBe(true);
  });
  
  it('应检测多个错误', () => {
    const formData = {
      amount: '',
      category: '',
      date: '',
      note: 'a'.repeat(101)
    };
    const result = validateForm(formData);
    expect(result.valid).toBe(false);
    expect(result.errors.amount).toBe('请输入金额');
    expect(result.errors.category).toBe('请选择分类');
    expect(result.errors.date).toBe('请选择日期');
    expect(result.errors.note).toBe('备注不能超过100个字符');
  });
  
  it('应检测金额错误', () => {
    const formData = {
      amount: '-10',
      category: '餐饮',
      date: getToday(),
      note: ''
    };
    const result = validateForm(formData);
    expect(result.valid).toBe(false);
    expect(result.errors.amount).toBe('金额必须大于0');
  });
  
  it('应检测未来日期', () => {
    const formData = {
      amount: '100',
      category: '餐饮',
      date: getTomorrow(),
      note: ''
    };
    const result = validateForm(formData);
    expect(result.valid).toBe(false);
    expect(result.errors.date).toBe('不能选择未来日期');
  });
});

console.log('\n✨ 表单校验规则测试完成');
