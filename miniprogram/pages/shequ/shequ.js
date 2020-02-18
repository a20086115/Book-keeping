
import { cloud as CF } from '../../utils/cloudFunction.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: "",
    places: [],
    typeObj:{
      "1" : "社区管理",
      "2": "集团管理",
      "3": "学校管理",
      "4": "乡镇管理"
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      type: options.type,
      places: [{
        url: "/pages/addPlace/addPlace?type=" + options.type,
        name: "新增",
        icon: "../../../images/add.png"
      }]
    })
    this.setBarTitle(options.type);
  },

  // 设置导航标题
  setBarTitle(queryType){
    wx.setNavigationBarTitle({
      title: this.data.typeObj[queryType]
    })
  },

  // 查询列表信息
  queryPlaceList(queryType){
    CF.get("places", { openId: true, type: queryType }, (e) => {
      // 循环处理，增加URL和ICON信息
      var url = "../../../images/shequ.png";
      if (queryType == "1"){
        url = "../../../images/shequ.png";
      }else if(queryType == "2"){
        url = "../../../images/jituan.png";
      } else if (queryType == "3") {
        url = "../../../images/xuexiao.png";
      } else if (queryType == "4") {
        url = "../../../images/xiangzhen.png";
      }
      for(let item of e.result.data){
        item.icon = url;
        item.url = "/pages/placeCenter/placeCenter?type=" + queryType +"&id="+item._id+"&name="+item.placename;
      }

      e.result.data.push({
        url: "/pages/addPlace/addPlace?type=" + queryType,
        placename: "新增",
        icon: "../../../images/add.png"
      });
      console.log(e)
      this.setData({
        places: e.result.data
      })
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.queryPlaceList(this.data.type);
  }
})