/**
 * 金额计算工具测试
 * 测试场景：金额计算精度验证
 */

import {
  toCents,
  toYuan,
  formatMoney,
  add,
  subtract,
  sum,
  calculateBalance
} from '../utils/money.js';

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
    toBeCloseTo(expected, precision = 2) {
      const diff = Math.abs(actual - expected);
      const epsilon = Math.pow(10, -precision);
      if (diff > epsilon) {
        throw new Error(`期望接近 ${expected}，实际得到 ${actual}`);
      }
    }
  };
}

// 运行测试
console.log('🧪 金额计算工具测试开始');

describe('toCents - 元转分', () => {
  it('应正确转换整数金额', () => {
    expect(toCents(100)).toBe(10000);
    expect(toCents(0)).toBe(0);
    expect(toCents(1)).toBe(100);
  });
  
  it('应正确转换小数金额', () => {
    expect(toCents(10.5)).toBe(1050);
    expect(toCents(0.01)).toBe(1);
    expect(toCents(99.99)).toBe(9999);
  });
  
  it('应正确处理字符串输入', () => {
    expect(toCents('100')).toBe(10000);
    expect(toCents('10.5')).toBe(1050);
  });
  
  it('应避免浮点精度问题', () => {
    // 0.1 + 0.2 问题
    expect(toCents(0.1) + toCents(0.2)).toBe(30);
    expect(toCents(10.03)).toBe(1003);
    expect(toCents(19.99)).toBe(1999);
  });
  
  it('应处理无效输入', () => {
    expect(toCents('')).toBe(0);
    expect(toCents(null)).toBe(0);
    expect(toCents(undefined)).toBe(0);
    expect(toCents('abc')).toBe(0);
  });
});

describe('toYuan - 分转元', () => {
  it('应正确转换分为元', () => {
    expect(toYuan(10000)).toBe('100.00');
    expect(toYuan(0)).toBe('0.00');
    expect(toYuan(100)).toBe('1.00');
  });
  
  it('应正确处理小数位', () => {
    expect(toYuan(1050)).toBe('10.50');
    expect(toYuan(1)).toBe('0.01');
    expect(toYuan(9999)).toBe('99.99');
  });
  
  it('应支持自定义小数位数', () => {
    expect(toYuan(10000, 0)).toBe('100');
    expect(toYuan(1050, 1)).toBe('10.5');
  });
});

describe('formatMoney - 格式化金额', () => {
  it('应正确格式化金额', () => {
    expect(formatMoney(10000)).toBe('¥100.00');
    expect(formatMoney(0)).toBe('¥0.00');
    expect(formatMoney(1050)).toBe('¥10.50');
  });
  
  it('应支持显示正负号', () => {
    expect(formatMoney(10000, true)).toBe('¥+100.00');
    expect(formatMoney(0, true)).toBe('¥0.00');
  });
});

describe('add - 金额加法', () => {
  it('应正确相加两个金额', () => {
    expect(add(10000, 5000)).toBe(15000);
    expect(add(0, 100)).toBe(100);
  });
  
  it('应处理浮点数输入', () => {
    expect(add(100.5, 200.7)).toBe(301);
  });
});

describe('subtract - 金额减法', () => {
  it('应正确相减两个金额', () => {
    expect(subtract(10000, 5000)).toBe(5000);
    expect(subtract(5000, 10000)).toBe(-5000);
  });
});

describe('sum - 金额求和', () => {
  it('应正确计算数组总和', () => {
    expect(sum([1000, 2000, 3000])).toBe(6000);
    expect(sum([])).toBe(0);
    expect(sum([100])).toBe(100);
  });
  
  it('应处理浮点数数组', () => {
    expect(sum([100.5, 200.7, 300.3])).toBe(602);
  });
});

describe('calculateBalance - 计算结余', () => {
  it('应正确计算结余', () => {
    expect(calculateBalance(10000, 5000)).toBe(5000);
    expect(calculateBalance(5000, 10000)).toBe(-5000);
    expect(calculateBalance(10000, 10000)).toBe(0);
  });
  
  it('应处理零值', () => {
    expect(calculateBalance(0, 0)).toBe(0);
    expect(calculateBalance(10000, 0)).toBe(10000);
    expect(calculateBalance(0, 10000)).toBe(-10000);
  });
});

describe('精度验证 - 避免浮点误差', () => {
  it('应正确处理 0.1 + 0.2', () => {
    const a = toCents(0.1);
    const b = toCents(0.2);
    expect(add(a, b)).toBe(30); // 0.3元 = 30分
  });
  
  it('应正确处理复杂计算', () => {
    // 模拟多次交易
    const amounts = [10.03, 20.05, 30.07, 15.99];
    const cents = amounts.map(toCents);
    const total = sum(cents);
    expect(total).toBe(7614); // 76.14元
  });
  
  it('应正确处理大金额', () => {
    const large = toCents(999999.99);
    expect(large).toBe(99999999);
    expect(toYuan(large)).toBe('999999.99');
  });
});

console.log('\n✨ 金额计算工具测试完成');
