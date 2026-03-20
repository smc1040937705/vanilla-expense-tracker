// Mock数据生成 - 纯原生实现
const generateMockData = () => {
  const now = new Date();
  const records = [];
  
  const expenseCategories = ['food', 'transport', 'shopping', 'entertainment', 'housing'];
  const incomeCategories = ['salary', 'bonus', 'investment', 'parttime'];
  const expenseRemarks = ['午餐', '地铁', '网购', '电影', '房租', '超市购物', '加油', '咖啡'];
  const incomeRemarks = ['月薪', '年终奖', '基金收益', '周末兼职', '项目奖金'];
  
  for (let i = 0; i < 30; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    
    const isExpense = Math.random() > 0.3;
    const type = isExpense ? 'expense' : 'income';
    const categoryList = isExpense ? expenseCategories : incomeCategories;
    const remarkList = isExpense ? expenseRemarks : incomeRemarks;
    
    const amount = isExpense 
      ? Math.floor(Math.random() * 50000) + 1000  // 10-500元
      : Math.floor(Math.random() * 500000) + 10000;  // 100-5000元
    
    records.push({
      id: Date.now() + i,
      type,
      category: categoryList[Math.floor(Math.random() * categoryList.length)],
      amount,
      remark: remarkList[Math.floor(Math.random() * remarkList.length)],
      date: date.toISOString().split('T')[0]
    });
  }
  
  return records.sort((a, b) => new Date(b.date) - new Date(a.date));
};
