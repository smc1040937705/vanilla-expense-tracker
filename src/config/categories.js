// 分类配置 - 纯原生实现
const categories = {
  expense: [
    { value: 'food', label: '餐饮' },
    { value: 'transport', label: '交通' },
    { value: 'shopping', label: '购物' },
    { value: 'entertainment', label: '娱乐' },
    { value: 'housing', label: '住房' },
    { value: 'medical', label: '医疗' },
    { value: 'education', label: '教育' },
    { value: 'other_expense', label: '其他支出' }
  ],
  income: [
    { value: 'salary', label: '工资' },
    { value: 'bonus', label: '奖金' },
    { value: 'investment', label: '投资收益' },
    { value: 'parttime', label: '兼职' },
    { value: 'other_income', label: '其他收入' }
  ]
};

const getCategoryLabel = (type, value) => {
  const list = categories[type] || [];
  const item = list.find(c => c.value === value);
  return item ? item.label : value;
};
