Page({
    data: {
        userInfo: {
            avatar: '/assets/icons/user.png',
            nickname: '钓鱼达人',
            userId: '123456'
        }
    },
    onLoad: function (options) {
        // 可以在这里加载用户信息
    },
    navigateToMySpots: function () {
        tt.switchTab({
            url: '/pages/main/main',
            success: (res) => {
                console.log('跳转到我的钓点成功');
            },
            fail: (err) => {
                console.error('跳转到我的钓点失败:', err);
            }
        });
    },
    navigateToHistory: function () {
        tt.navigateTo({
            url: '/pages/history/history',
            success: (res) => {
                console.log('跳转到浏览历史成功');
            },
            fail: (err) => {
                console.error('跳转到浏览历史失败:', err);
            }
        });
    },
    navigateToSettings: function () {
        tt.navigateTo({
            url: '/pages/settings/settings',
            success: (res) => {
                console.log('跳转到设置成功');
            },
            fail: (err) => {
                console.error('跳转到设置失败:', err);
            }
        });
    },
    handleLogout: function () {
        tt.showModal({
            title: '提示',
            content: '确定要退出登录吗？',
            success: (res) => {
                if (res.confirm) {
                    console.log('用户点击确定');
                    // 执行退出登录逻辑
                }
            }
        });
    }
});
