const App = getApp()

Page({
  data: {
    indicatorDots: !1,
    autoplay: !1,
    current: 0,
    interval: 3000,
    duration: 1000,
    circular: !1,
  },
  onLoad() { },
  onShow() { 
    var that = this;
    setTimeout(function(){
      // getUserInfo: 若用户授权过小程序，进入success回调，返回用户信息；
      // 用户未授权，进入fail，跳转到授权界面。
      console.log("获取授权信息....")
        wx.getUserInfo({
          success: function (result) {
            console.log("获取授权信息成功....")
            // 将获取到的userinfo保存至全局变量。
            App.globalData.userInfo = result.userInfo;
            // 获取myUserInfo, 内部user表
            console.log("调用云函数login.获取myUserInfo")
            wx.cloud.callFunction({
              name: 'login',
            }).then(function (e) {
              console.log("调用云函数login成功，跳转到首页",e)
              that.goIndex();
            })
          },
          fail: function (result) {
            console.log("获取授权信息失败，跳转到授权页....")
            that.goLogin();
          }
        })
      
    }, 2000)
  },
  goIndex() {
    wx.switchTab({ url: '/pages/index/index' })
  },
  goLogin() {
    wx.redirectTo({
      url:'/pages/login/index'
    })
  },
})
