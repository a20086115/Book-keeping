// miniprogram/pages/peopleInfo/peopleInfo.js
import province_list from '../../utils/area.js'
import { cloud as CF } from '../../utils/cloudFunction.js'
import Toast from "../../miniprogram_npm/vant-weapp/toast/toast";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    areaList: province_list,
    show_area: false,
    currentPlace:{},
    currentPerson: {
      province: "",
      city: "",
      county: "",
      name: "",
      area: "",
      address: "",
      idcard: "",
      phone: ""
    }
  },
  onLoad: function (options) {
    // const scene = decodeURIComponent(options.scene)
    var scene;
    if(options.scene){
      scene = decodeURIComponent(options.scene)
    }else{
      scene = "1acf1de95e482f37104a16fc5e05ddaf";
    }
    wx.setNavigationBarTitle({ title: "出入登记" })
    if (scene) {
      this.queryPeopleByOpenId();
      this.queryPalceById(scene);
    }else{
      Toast.fail('二维码未携带单位信息');
    }
  

  },
  // 新增或编辑信息
  addHistory() {
    // 参数完整性校验
    console.log(this.data)
    var _this = this;
    var currentPerson = this.data.currentPerson;
    if (currentPerson.address && currentPerson.area && currentPerson.phone && currentPerson.name && currentPerson.idcard) {
      // 判断是否有ID信息
      if (_this.data.currentPerson._id) {
        // 直接新增出入信息
        var obj = {
          personId: _this.data.currentPerson._id,
          placeId: _this.data.currentPlace._id,
          personName: _this.data.currentPerson.name,
          placeName: _this.data.currentPlace.placename
        }
        CF.insert("history", obj, function (data) {
          wx.navigateTo({
            url: '/pages/success/success',
          })
        })
      } else {
        // 没有ID信息，先新增PEOPLE信息，再新增出入记录
        // 新增时将当前类型添加进去
        CF.insert("people", this.data.currentPerson, function (data) {
          console.log("insert", data)
          _this.data.currentPerson._id = data.result._id
          var obj = {
            personId: _this.data.currentPerson._id,
            placeId: _this.data.currentPlace._id,
            personName: _this.data.currentPerson.name,
            placeName: _this.data.currentPlace.placename
          }
          CF.insert("history", obj, function () {
            wx.navigateTo({
              url: '/pages/success/success',
            })
          })
        })
       
      }
    } else {
      Toast.fail('请将信息填写完整');
    }

  },
  // 根据ID查询个人信息
  queryPeopleByOpenId() {
    CF.get("people", { openId: true }, (e) => {
      if (e.result.data && e.result.data.length > 0) {
        this.setData({
          currentPerson: e.result.data[0]
        })
      }
    })
  },  
  // 根据ID查询单位信息
  queryPalceById(palceId) {
    CF.get("places", { _id: palceId }, (e) => {
      console.log(e)
      if (e.result.data && e.result.data.length == 1) {
        this.setData({
          currentPlace: e.result.data[0]
        })
      } else {
        Toast.fail('未找到该单位信息');
        setTimeout(() => {
          wx.navigateBack()
        }, 2000)
      }
    })
  },
  // 点击选择地址按钮
  selectArea() {
    this.setData({
      show_area: true
    })
  },
  // 点击遮罩或取消关闭选择器
  onCloseArea(event) {
    this.setData({
      show_area: false
    })
  },
  // 点击确定，存储信息
  onConfirmArea(event) {
    this.setData({
      show_area: false,
      "currentPerson.province": event.detail.values[0].name,
      "currentPerson.city": event.detail.values[1].name,
      "currentPerson.county": event.detail.values[2].name,
      "currentPerson.areacode": event.detail.values[2].code,
      "currentPerson.area": event.detail.values[0].name + event.detail.values[1].name + event.detail.values[2].name
    })
    console.log(this.data)
  },
  // 输入框
  onValueChange(e) {
    var key = "currentPerson." + e.target.id;
    var obj = {};
    obj[key] = e.detail;
    this.setData(obj)
  }
})