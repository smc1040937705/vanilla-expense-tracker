// 格式化工具 - 纯原生实现
const formatAmount = (fen) => {
  const yuan = fen / 100;
  return yuan.toLocaleString('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    minimumFractionDigits: 2
  });
};
