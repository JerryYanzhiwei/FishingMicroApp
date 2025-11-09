const app = getApp();

Page({
  data: {
    longitude: 0,
    latitude: 0,
    scale: 13, // 确保缩放级别设置为合适的值（推荐范围：5-18）
    enableScroll: true,
    enableTraffic: true,
    // 新增：广告实例
    rewardedVideoAd: null as any,
    // 新增：广告状态
    adLoading: false,
    adError: false,
    spotId: null,
    markers: [{
      id: 1,
      latitude: 0,
      longitude: 0,
      iconPath: '/assets/icons/fishing_marker.png',
      width: 30,
      height: 30,
      title: '钓点',
    }]
  },

  onLoad(options: any) {
    if (options && options.id) {
      this.setData({
        spotId: options.id,
        longitude: parseFloat(options.longitude),
        latitude: parseFloat(options.latitude),
      });
      // 加载数据后更新标记点位置
      this.updateMapMarkers();
    } else {
      // 提供默认位置，防止标记点无法显示
      this.setData({
        longitude: 120.1551,
        latitude: 30.2741,
      });
      this.updateMapMarkers();
    }
    // 初始化激励视频广告
    this.initRewardedVideoAd();
  },

  onReady: function () {
    this.initMap();
  },

  updateMapMarkers() {
    console.log('更新标记点位置:', this.data.latitude, this.data.longitude);
    this.setData({
      markers: [{
        id: 1,
        latitude: this.data.latitude,
        longitude: this.data.longitude,
        iconPath: '/assets/icons/fishing_marker.png',
        width: 30,
        height: 30,
        title: '钓点',
      }]
    });
  },

  initMap() {
    const MapCtx = tt.createMapContext('finMap');
    // const that = this;
    // tt.getLocation({
    //   type: 'gcj02',
    //   success(res) {
    //     that.setData({
    //       longitude: res.longitude,
    //       latitude: res.latitude,
    //     });
    //   },
    //   fail(res) {
    //     console.log(res);
    //   },
    // });
    
  },

  // 新增：初始化激励视频广告
  initRewardedVideoAd() {
    try {
      // 创建激励视频广告实例
      // 注意：adUnitId 需要替换为您在抖音开放平台获取的实际广告位ID
      const rewardedVideoAd = tt.createRewardedVideoAd({
        adUnitId: '22hjqfdh9z1hv2l09a' // 请替换为实际的广告位ID
      });

      // 监听广告加载完成事件
      rewardedVideoAd.onLoad(() => {
        this.setData({
          adLoading: false,
          adError: false
        });
      });

      // 监听广告错误事件
      rewardedVideoAd.onError((err: any) => {
        this.setData({
          adLoading: false,
          adError: true
        });
        
        // 根据错误码处理不同情况
        switch (err.errCode) {
          case 1004:
            tt.showToast({
              title: '暂无可用广告',
              icon: 'none'
            });
            break;
          default:
            tt.showToast({
              title: '广告加载失败',
              icon: 'none'
            });
        }
      });

      // 监听广告关闭事件
      rewardedVideoAd.onClose((res: any) => {
        
        if (res.isEnded) {
          // 用户完整观看了视频，给予奖励
          this.rewardUserForWatchingAd();
        } else {
          // 用户未完整观看视频
          tt.showToast({
            title: '请完整观看广告解锁功能',
            icon: 'none'
          });
        }
      });

      this.setData({
        rewardedVideoAd: rewardedVideoAd
      });

      // 预加载广告
      this.preloadAd();

    } catch (error) {
      console.error('初始化激励视频广告失败:', error);
      this.setData({
        adError: true
      });
    }
  },

  // 新增：预加载广告
  preloadAd() {
    const { rewardedVideoAd } = this.data;
    if (rewardedVideoAd) {
      this.setData({ adLoading: true });
      rewardedVideoAd.load().catch((err: any) => {
        console.error('广告预加载失败:', err);
        this.setData({ adLoading: false });
      });
    }
  },

  unlockFinSpot() {
    const { rewardedVideoAd, adLoading } = this.data;
    
    if (adLoading) {
      tt.showToast({
        title: '广告加载中，请稍候',
        icon: 'none'
      });
      return;
    }

    if (!rewardedVideoAd) {
      tt.showToast({
        title: '广告初始化失败',
        icon: 'none'
      });
      return;
    }

    
    // 展示加载提示
    tt.showLoading({
      title: '准备广告中...',
      mask: true
    });

    // 展示激励视频广告
    rewardedVideoAd.show().then(() => {
      tt.hideLoading();
    }).catch((err: any) => {
      tt.hideLoading();
      tt.showToast({
        title: '广告展示失败',
        icon: 'none'
      });
      
      // 重新加载广告
      this.preloadAd();
    });
  },

  // 用户观看广告后的奖励逻辑
  rewardUserForWatchingAd() {
    // 这里实现解锁钓点功能的具体逻辑
    
    tt.showToast({
      title: '解锁成功！',
      icon: 'success',
      duration: 500
    });

    // 示例：2秒后跳转到detail页面，使用redirectTo替换navigateTo
    setTimeout(() => {
      tt.redirectTo({
        url: `/pages/detail/detail?id=${this.data.spotId}`,
        success: (res) => {
          console.log('跳转成功');
        },
        fail: (res) => {
          console.error('跳转失败:', res);
        },
      });
    }, 2000);
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
