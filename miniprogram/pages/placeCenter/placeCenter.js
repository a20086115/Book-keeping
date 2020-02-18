// miniprogram/pages/placeCenter/placeCenter.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    modules: [],
    currentPlaceId: [],
    type: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({ title: options.name })
    this.setData({
      type: options.type,
      currentPlaceId: options.id,
      modules: [{
        url: "/pages/addPlace/addPlace?type=" + options.type + "&id=" + options.id + "&name=" + options.name,
        name: "信息修改",
        icon: "../../../images/fieldapplication.png"
      }, {
          url: "/pages/placeHistory/placeHistory?type=" + options.type + "&id=" + options.id + "&name=" + options.name,
        name: "出入记录",
        icon: "../../../images/measuredvalue.png"
      }, {
          url: "/pages/placeQrcode/placeQrcode?type=" + options.type + "&id=" + options.id + "&name=" + options.name,
        name: "二维码查看",
        icon: "../../../images/qrcode.png"
      }]
    })
  },

  // 设置导航标题
  setBarTitle(title) {
    wx.setNavigationBarTitle({
      title: title
    })
  },

})