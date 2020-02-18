// miniprogram/pages/people/people.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    modules: [{
        url: "/pages/peopleInfo/peopleInfo",
      name: "信息修改",
      icon: "../../../images/fieldapplication.png"
    }, {
      url: "/pages/placeHistory/placeHistory",
      name: "出入记录",
      icon: "../../../images/measuredvalue.png"
    }],
  },
  onLoad(options) {
    if(options.type){
      for(let item of this.data.modules){
        item.url = item.url + "?type="+options.type
      }
      wx.setNavigationBarTitle({ title: "员工信息" })
    }else{
      wx.setNavigationBarTitle({ title: "居民信息" })
    }
    this.setData({
      modules: this.data.modules
    })
  }

})