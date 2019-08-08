const App = getApp()

Page({
  data: {
    logged: false,
  },
  onLoad() { },
  onShow() {
  },
  getUserInfoFun(result) {
    var that = this;
    if (result.detail.encryptedData) {
      // 把授权获得的数据 存到全局属性
      App.globalData.userInfo = result.detail.userInfo;
      // 从网络获取
      wx.showLoading({
        title: '努力加载中...',
      })
      // 第一次授权，注册新用户
      wx.cloud.callFunction({
        // 云函数名称
        name: 'user',
        data: {
          datas: App.globalData.userInfo
        }
      }).then(function (e) {
        wx.hideLoading();
        wx.switchTab({ url: '/pages/index/index' })
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '您取消了授权，可能会造成使用受限',
        showCancel: false,
      })
      return false
    }
  }
})