// f:\FinSpotFinder\FinSpotFinder\pages\main\main.ts

import { finSpotApi } from "../../api";

type TabPropsType = 'hottest' | 'latest' | 'highest';

Page({
  data: {
    searchQuery: '',
    activeTab: 'latest', // 默认选中"最新钓点"
    listData: [
      {
        id: 1,
        imageUrl: 'https://picsum.photos/200/300',
        title: '西湖钓点',
        description: '风景优美，适合休闲钓鱼',
        location: '杭州市西湖区',
        distance: 5.2,
        rate: 4.5,
        record: 100,
      },
    ],
  },

  onLoad: function (options) {
    // 页面加载时的初始化逻辑
    this.getSpotList()
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
    this.getSpotList()
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

  // 获取钓点列表
  getSpotList: function () {
    finSpotApi.getSpotList({page: 1, pageSize: 100, keyword: this.data.searchQuery}).then((res) => {
      this.setData({
        listData: res,
      })
    })
  },

  // 根据选中的标签加载对应数据
  loadDataByTab: function (tab: TabPropsType) {
    if (tab === 'highest') {
      this.setData({
        listData: this.data.listData.sort((a, b) => b.rate - a.rate), // 按评分排序
      });
    }
    if (tab === 'latest') {
      this.getSpotList()
    }

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

  toDetail: function (e: { currentTarget: { dataset: { id: number,longitude: number, latitude: number  } } }) {
    const { id, longitude, latitude } = e.currentTarget.dataset;
    tt.navigateTo({
      url: `/pages/index/index?id=${id}&longitude=${longitude}&latitude=${latitude}`,
      success: (res) => {
        console.log('跳转成功');
      },
      fail: (res) => {
        console.error('跳转失败:', res);
      },
    });
  },
});
