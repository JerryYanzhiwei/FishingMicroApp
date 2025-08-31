// f:\FinSpotFinder\FinSpotFinder\pages\main\main.ts

type TabPropsType = 'hottest' | 'latest' | 'highest';

Page({
  data: {
    searchQuery: '',
    activeTab: 'latest', // 默认选中"最新钓点"
  },

  onLoad: function (options) {
    // 页面加载时的初始化逻辑
  },

  onReady: function () {
    // 页面初次渲染完成时执行的逻辑
  },

  onSearchInput: function (e: { detail: { value: any } }) {
    this.setData({
      searchQuery: e.detail.value,
    });
  },

  onSearch: function () {
    const { searchQuery } = this.data;

    if (searchQuery.trim()) {
      console.log('执行搜索:', searchQuery);
      // 这里可以添加实际搜索逻辑
      tt.showToast({
        title: `搜索: ${searchQuery}`,
        icon: 'none',
      });
    } else {
      tt.showToast({
        title: '请输入搜索内容',
        icon: 'none',
      });
    }
  },

  // 处理标签点击
  onTabClick: function (e: { currentTarget: { dataset: { tab: any } } }) {
    const tab = e.currentTarget.dataset.tab;

    this.setData({
      activeTab: tab,
    });

    // 根据选中的标签执行相应的数据加载逻辑
    this.loadDataByTab(tab);
  },

  // 根据选中的标签加载对应数据
  loadDataByTab: function (tab: TabPropsType) {
    console.log(`加载${this.getTabName(tab)}数据`);

    // 这里可以添加实际的数据加载逻辑
    tt.showToast({
      title: `切换到${this.getTabName(tab)}`,
      icon: 'none',
    });
  },

  // 获取标签显示名称
  getTabName: function (tab: TabPropsType) {
    const tabNames: { [key in TabPropsType]: string } = {
      hottest: '最热钓点',
      latest: '最新钓点',
      highest: '评分最高',
    };

    return tabNames[tab] || '';
  },
});
