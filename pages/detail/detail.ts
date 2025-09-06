import { MapContext } from '@douyin-microapp/typings/api/map';

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
    fishTypes: [
      {
        id: 1,
        name: "鲫鱼",
        habits: "底层杂食性",
        baits: "蚯蚓/红虫/面饵",
        icon: "/assets/icons/fish1.png"
      },
      {
        id: 2,
        name: "鲤鱼", 
        habits: "底层杂食性",
        baits: "玉米/薯类/商品饵",
        icon: "/assets/icons/fish2.png"
      },
      {
        id: 3,
        name: "草鱼",
        habits: "中上层草食性",
        baits: "嫩草/蚂蚱/商品饵",
        icon: "/assets/icons/fish3.png"
      }
    ]
  },

  onReady() {
    this.initMap();
  },

  initMap() {
    const mapCtx = tt.createMapContext('detail-map'); // 修正为当前页面的map id
    this.setData({ mapCtx });
  },

  navigateToSpot() {
    const { latitude, longitude, spotName } = this.data;
    tt.openLocation({
      latitude,
      longitude,
      name: spotName,
      address: this.data.address, // 添加详细地址
      scale: 18, // 设置合适的缩放级别
      success: (res) => {
        console.log('导航成功', res);
      },
      fail: (err) => {
        console.error('导航失败:', err);
        tt.showToast({
          title: '导航失败，请检查位置权限',
          icon: 'none'
        });
      },
    });
  },

  showFishDetail: function(e: { currentTarget: { dataset: { id: number } } }) {
    const fishId = e.currentTarget.dataset.id;
    tt.navigateTo({
      url: `/pages/fishDetail/fishDetail?id=${fishId}`,
      success: () => console.log('跳转鱼类详情成功')
    });
  }
});
