import { MapContext } from '@douyin-microapp/typings/api/map';
import { finSpotApi } from '../../api';

Page({
  data: {
    mapCtx: null as MapContext | null,
    latitude: 30.2741, // 示例纬度
    longitude: 120.1551, // 示例经度
    navLatitude: 30.2741, // 导航纬度
    navLongitude: 120.1551, // 导航经度
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
    
    // 检查位置权限并获取位置
    this.checkLocationPermission();
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
    const { navLatitude, navLongitude, spotName } = this.data;
    tt.openLocation({
      latitude: navLatitude,
      longitude:navLongitude,
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

  // 修改：检查位置权限
checkLocationPermission() {
    // 首先检查是否支持getLocation API
    const canIUseLocation = tt.canIUse('getLocation');
    if (!canIUseLocation) {
        tt.showToast({
            title: '当前环境不支持位置服务',
            icon: 'none',
            duration: 3000
        });
        return;
    }

    // 获取系统设置
    tt.getSetting({
        success: (res) => {
            const authStatus = res.authSetting['scope.userLocation'];
            console.log(authStatus, 'authStatus');
            
            // 已授权但仍失败，很可能是平台权限未开通
            if (authStatus === true) {
                this.getUserLocation();
            } 
            // 未授权，正常申请流程
            else if (authStatus === false) {
                this.showAuthDeniedModal();
            }
            // 新增：首次使用，从未授权过
            else {
                this.requestLocationAuth();
            }
        },
        fail: (err) => {
            console.error('获取设置信息失败:', err);
            this.showPlatformAuthError();
        }
    });
},

  // 新增：平台权限未开通错误提示
  showPlatformAuthError() {
      tt.showModal({
          title: '功能暂不可用',
          content: '位置服务权限正在申请中，我们将尽快为您开通。您可以先浏览钓点详情。',
          showCancel: false,
          confirmText: '我知道了',
          success: () => {
              // 使用默认位置信息
              this.useDefaultLocation();
          }
      });
  },

  // 新增：使用默认位置
  useDefaultLocation() {
      console.log('使用默认位置信息');
      // 可以在这里加载预设的热门钓点数据
  },

  // 修改：请求位置权限
  requestLocationAuth() {
      tt.chooseLocation({
          success: (res) => {
            console.log('用户选择了位置:', res);
          },
          fail: (err) => {
            console.error('获取位置失败', err);
            this.setData({
              checkResult: '⚠️ 获取位置失败，请重试'
            });
          }
      })
  },

  // 新增：授权被拒提示
  showAuthDeniedModal() {
      tt.chooseLocation({
          success: (res) => {
            console.log('用户选择了位置:', res);
          },
          fail: (err) => {
            console.error('获取位置失败', err);
            this.setData({
              checkResult: '⚠️ 获取位置失败，请重试'
            });
          }
      })
  },

  // 新增：获取用户位置
  getUserLocation() {
      tt.getLocation({
          type: 'gcj02', // 使用国内加密坐标系，适配地图组件
          isHighAccuracy: false, // 常规精度满足需求，减少耗电
          success: (res) => {
              console.log('位置获取成功:', res);
              // 可以在这里更新地图中心到用户位置
              this.setData({
                  navLongitude: this.data.longitude,
                  navLatitude: this.data.latitude
              });
          },
          fail: (res) => {
              console.error('getLocation调用失败:', res);
              
              // 根据错误码给出具体提示
              let errorMsg = '获取位置失败，请重试';
              if (res.errNo === 10201) {
                  errorMsg = '请在设置中开启位置权限';
              } else if (res.errNo === 10202) {
                  errorMsg = '隐私协议未声明位置权限';
              }
              
              tt.showToast({
                  title: errorMsg,
                  icon: 'none',
                  duration: 3000
              });
          }
      });
  },

// ... existing code ...
});
