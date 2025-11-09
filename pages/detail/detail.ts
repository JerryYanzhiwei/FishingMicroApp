import { MapContext } from '@douyin-microapp/typings/api/map';
import { finSpotApi } from '../../api';

Page({
  data: {
    mapCtx: null as MapContext | null,
    latitude: 30.2741, // 示例纬度
    longitude: 120.1551, // 示例经度
    spotName: '西湖钓点',
    address: '杭州市西湖区西湖风景名胜区',
    markers: [
      {
        id: 1,
        latitude: 30.2741,
        longitude: 120.1551,
        iconPath: '/assets/icons/fishing_marker.png',
        title: '西湖钓点',
        width: 30,
        height: 30,
      },
    ],
    surroundings: [
      { id: 1, name: '停车场', distance: 0.5 },
      { id: 2, name: '便利店', distance: 0.8 },
      { id: 3, name: '餐厅', distance: 1.2 },
    ],
    fishTypes: [],
    desc:''
  },

  // 修复：正确接收页面参数
  onLoad(options: any) {
    // 检查是否存在id参数
    if (options && options.id) {
      const spotId = options.id;

      // 根据ID加载对应的钓点数据
      this.getSpotDetail(spotId);
    } else {
      tt.showToast({
        title: '参数错误',
        icon: 'none',
      });
    }
  },

  onReady() {
    this.initMap();
    // 完全禁用右滑返回
    this.disableSwipeBack();
  },

  onShow() {
    // 确保右滑返回被禁用
    this.disableSwipeBack();
  },

  // 新增：禁用右滑返回功能
  disableSwipeBack() {
    try {
      tt.setSwipeBackMode(0);
    } catch (error) {
      console.error('禁用右滑返回失败:', error);
    }
  },

  // 新增：隐藏返回首页按钮
  hideHomeButton() {
    tt.hideHomeButton({
      success: () => {
      },
      fail: (err) => {
        console.error('隐藏返回首页按钮失败:', err);
      }
    });
  },

  initMap() {
    const mapCtx = tt.createMapContext('detail-map');
    this.setData({ mapCtx });
  },

  async getSpotDetail(id: string) {
    try {
      const result = await finSpotApi.getSpotDetail(id);

      // 如果API返回数据，更新页面数据
      if (result) {
        this.updateSpotData(result);
      }
    } catch (error) {
      console.error('获取钓点详情失败:', error);
      tt.showToast({
        title: '获取详情失败',
        icon: 'none',
      });
    }
  },

  // 新增：根据API返回数据更新页面
  updateSpotData(spotData: any) {
    this.setData({
      spotName: spotData.title || '未知钓点',
      address: spotData.location || '未知地址',
      latitude: spotData.latitude || this.data.latitude,
      longitude: spotData.longitude || this.data.longitude,
      fishTypes: spotData.fishTypes || this.data.fishTypes,
      desc: spotData.desc || this.data.desc,
    });

    // 更新地图标记
    this.updateMapMarkers();
  },

  // 新增：更新地图标记
  updateMapMarkers() {
    const { latitude, longitude, spotName } = this.data;
    this.setData({
      markers: [
        {
          id: 1,
          latitude: latitude,
          longitude: longitude,
          iconPath: '/assets/icons/fishing_marker.png',
          title: spotName,
          width: 30,
          height: 30,
        },
      ],
    });
  },

  navigateToSpot() {
    const { latitude, longitude, spotName } = this.data;
    tt.openLocation({
      latitude,
      longitude,
      name: spotName,
      address: this.data.address,
      scale: 18,
      success: (res) => {
        console.log('导航成功', res);
      },
      fail: (err) => {
        console.error('导航失败:', err);
        tt.showToast({
          title: '导航失败，请检查位置权限',
          icon: 'none',
        });
      },
    });
  },

  showFishDetail: function (e: { currentTarget: { dataset: { id: number } } }) {
    const fishId = e.currentTarget.dataset.id;
    tt.navigateTo({
      url: `/pages/fishDetail/fishDetail?id=${fishId}`,
    });
  },
});
