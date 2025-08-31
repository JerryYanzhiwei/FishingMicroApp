const app = getApp();

Page({
  data: {
    longitude: 0,
    latitude: 0,
    scale: 10,
    enableScroll: true,
    enableTraffic: true,
  },
  onReady: function () {
    this.initMap();
  },

  initMap() {
    const MapCtx = tt.createMapContext('finMap');
    const that = this;
    console.log(321123);
    tt.getLocation({
      type: 'gcj02',
      success(res) {
        that.setData({
          longitude: res.longitude,
          latitude: res.latitude,
        });
      },
      fail(res) {
        console.log(res);
      },
    });
  },

  unlockFinSpot() {
    const MapCtx = tt.createMapContext('finMap');
    console.log('解锁钓点功能');
    // TODO 接入广告跳转
  },

  // 跳转到main页面
  navigateToMainPage() {
    tt.switchTab({
      url: '/pages/main/main',
      success() {
        console.log('成功跳转到main页面');
      },
      fail(err) {
        console.error('跳转main页面失败:', err);
      }
    });
  }
});
