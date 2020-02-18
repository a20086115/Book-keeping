import { cloud as CF} from '../../utils/cloudFunction.js'
Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    bookList:[],
    modules: [{
      url: "/pages/people/people",
      name: "我是居民",
      icon: "../../../images/jumin.png"
    }, {
        url: "/pages/people/people?type=1",
      name: "我是员工",
      icon: "../../../images/yuangong.png"
    }, {
        url: "/pages/shequ/shequ?type=1",
      name: "社区管理",
        icon: "../../../images/shequ.png"
      }, {
        url: "/pages/shequ/shequ?type=2",
      name: "集团管理",
      icon: "../../../images/jituan.png"
      }, {
        url: "/pages/shequ/shequ?type=3",
      name: "学校管理",
      icon: "../../../images/xuexiao.png"
      }, {
        url: "/pages/shequ/shequ?type=4",
      name: "乡镇管理",
      icon: "../../../images/controlparameter.png"
      // },{
      //   url: "/pages/access/access",
      //   name: "登记测试",
      //   icon: "../../../images/xiangzhen.png"
      }]
  },

  onLoad: function (query) {
    console.log(query)


    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              if(res.userInfo.avatarUrl){
                this.setData({
                  avatarUrl: res.userInfo.avatarUrl,
                  userInfo: res.userInfo
                })
              }
            }
          })
        }
      }
    })

    if (query.scene) {
      wx.navigateTo({
        url: '/pages/access/access?scene=' + query.scene
      })
    }
  },
  onGetUserInfo: function(e) {
    if (!this.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  }
})
