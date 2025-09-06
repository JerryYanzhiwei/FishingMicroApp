Page({
    data: {
        notifyEnabled: true
    },
    toggleNotify: function (e: { detail: { value: boolean } }) {
        this.setData({ notifyEnabled: e.detail.value });
    }
});
