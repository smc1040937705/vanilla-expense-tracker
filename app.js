import { renderStatCards } from './components/StatCard.js';
import { RecordForm } from './components/RecordForm.js';
import { RecordList } from './components/RecordList.js';
import { Chart } from './components/Chart.js';
import { FilterBar } from './components/FilterBar.js';
import { getRecords, addRecord, deleteRecord, initMockData } from './utils/storage.js';
import { sum, calculateBalance } from './utils/money.js';

/**
 * 主应用类
 */
class ExpenseTracker {
  constructor() {
    this.records = [];
    this.filteredRecords = [];
    this.currentFilters = {};
    
    // DOM 元素
    this.statsContainer = document.getElementById('stats-container');
    this.chartContainer = document.getElementById('chart-container');
    this.filterContainer = document.getElementById('filter-container');
    this.formContainer = document.getElementById('form-container');
    this.listContainer = document.getElementById('list-container');
    
    this.init();
  }
  
  /**
   * 初始化应用
   */
  init() {
    // 初始化 mock 数据
    initMockData();
    
    // 加载数据
    this.loadRecords();
    
    // 渲染组件
    this.renderFilterBar();
    this.renderForm();
    this.renderAll();
    
    // 绑定窗口大小变化事件
    window.addEventListener('resize', () => {
      this.renderChart();
    });
  }
  
  /**
   * 加载记录
   */
  loadRecords() {
    this.records = getRecords();
    this.applyFilters();
  }
  
  /**
   * 应用筛选条件
   */
  applyFilters() {
    this.filteredRecords = FilterBar.filterRecords(this.records, this.currentFilters);
  }
  
  /**
   * 计算统计数据
   */
  calculateStats() {
    const income = sum(
      this.records.filter(r => r.type === 'income').map(r => r.amount)
    );
    const expense = sum(
      this.records.filter(r => r.type === 'expense').map(r => r.amount)
    );
    const balance = calculateBalance(income, expense);
    
    return { income, expense, balance };
  }
  
  /**
   * 渲染统计卡片
   */
  renderStats() {
    const stats = this.calculateStats();
    this.statsContainer.innerHTML = renderStatCards(stats);
  }
  
  /**
   * 渲染图表
   */
  renderChart() {
    this.chartContainer.innerHTML = Chart(this.records);
  }
  
  /**
   * 渲染筛选栏
   */
  renderFilterBar() {
    this.filterContainer.innerHTML = FilterBar(
      (filters) => this.handleFilter(filters),
      this.currentFilters
    );
  }
  
  /**
   * 渲染表单
   */
  renderForm() {
    this.formContainer.innerHTML = RecordForm((data) => this.handleAddRecord(data));
    // 延迟初始化表单事件
    setTimeout(() => RecordForm.init(), 0);
  }
  
  /**
   * 渲染记录列表
   */
  renderList() {
    this.listContainer.innerHTML = RecordList(
      this.filteredRecords,
      (id) => this.handleDeleteRecord(id)
    );
  }
  
  /**
   * 渲染所有组件
   */
  renderAll() {
    this.renderStats();
    this.renderChart();
    this.renderList();
  }
  
  /**
   * 处理筛选
   */
  handleFilter(filters) {
    this.currentFilters = filters;
    this.applyFilters();
    this.renderList();
  }
  
  /**
   * 处理添加记录
   */
  handleAddRecord(data) {
    addRecord(data);
    this.loadRecords();
    this.renderAll();
  }
  
  /**
   * 处理删除记录
   */
  handleDeleteRecord(id) {
    deleteRecord(id);
    this.loadRecords();
    this.renderAll();
  }
}

// 启动应用
document.addEventListener('DOMContentLoaded', () => {
  new ExpenseTracker();
});
