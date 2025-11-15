import { finSpotApi } from "../../api";

type TabPropsType = 'hottest' | 'latest' | 'highest' | 'nearest' ;

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
        latitude: 0, // 钓点纬度
        longitude: 0  // 钓点经度
      },
    ],
    userLocation: null as { latitude: number, longitude: number } | null,
  },

  onLoad: function (options) {
    // 页面加载时的初始化逻辑
    this.getUserLocation();
  },

  // 新增：获取用户位置
  getUserLocation() {
    tt.getLocation({
      type: 'gcj02',
      isHighAccuracy: false,
      success: (res) => {
        this.setData({
          userLocation: {
            latitude: res.latitude,
            longitude: res.longitude
          }
        }, () => {
          // 用户位置获取成功后再加载钓点列表
          this.getSpotList();
        });
      },
      fail: (err) => {
        console.error('获取用户位置失败:', err);
        // 即使获取位置失败，仍加载钓点列表，但不显示距离
        this.getSpotList();
        
        // 显示错误提示
        tt.showToast({
          title: '无法获取位置，无法显示距离',
          icon: 'none',
          duration: 3000
        });
      }
    });
  },

  // 新增：计算两点经纬度之间的距离（单位：公里）
  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    // 将角度转换为弧度
    const toRadians = (degrees: number) => degrees * Math.PI / 180;
    
    const R = 6371; // 地球半径（公里）
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const distance = R * c;
    
    // 保留一位小数
    return Math.round(distance * 10) / 10;
  },

  onSearchInput: function (e: { detail: { value: any } }) {
    this.setData({
      searchQuery: e.detail.value,
    });
  },

  onSearch: function () {
    this.setData({
      activeTab: 'latest',
    });
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
      // 获取当前用户位置与数据经纬度的距离
      const { userLocation } = this.data;
      let processedData = res;
      
      // 如果获取到用户位置，则计算每个钓点的距离
      if (userLocation) {
        processedData = res.map((spot: any) => {
          // 确保钓点有经纬度信息
          if (spot.latitude && spot.longitude) {
            const distance = this.calculateDistance(
              userLocation.latitude, 
              userLocation.longitude, 
              spot.latitude, 
              spot.longitude
            );
            
            return {
              ...spot,
              distance: distance // 添加距离属性
            };
          }
          return spot;
        });
      }
      
      this.setData({
        listData: processedData,
      })
    })
  },

  // 根据选中的标签加载对应数据
  loadDataByTab: function (tab: TabPropsType) {
    if (tab === 'nearest') {
      // 按距离排序（最近的在前）
      this.setData({
        listData: [...this.data.listData].sort((a, b) => a.distance - b.distance),
      });
    }
    if (tab === 'highest') {
      this.setData({
        listData: this.data.listData.sort((a, b) => b.rate - a.rate), // 按评分排序
      });
    }
    if (tab === 'latest') {
      this.getSpotList()
    }
    if (tab === 'hottest') {
      // 按距离排序（最近的在前）
      this.setData({
        listData: [...this.data.listData].sort((a, b) => a.distance - b.distance),
      });
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
