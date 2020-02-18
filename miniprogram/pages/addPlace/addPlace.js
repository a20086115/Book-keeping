// miniprogram/pages/addPlace/addPlace.js
import  province_list from '../../utils/area.js'
import { cloud as CF } from '../../utils/cloudFunction.js'
import Toast from "../../miniprogram_npm/vant-weapp/toast/toast";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentType: "",
    typeObj: {
      "1": "社区",
      "2": "集团",
      "3": "学校",
      "4": "乡镇"
    },
    buttonText:"新增",
    areaList: province_list,
    show_area: false,
    currentPlace:{
      province: "",
      city: "",
      county: "",
      placename: "",
      area: "",
      address: "",
      username: "",
      phone: ""
    }
   
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.currentType = options.type;

    // 判断参数是否有ID，如果有ID则是修改信息
    if(options.id){
      this.queryPalceById(options.id);
      this.setData({
        buttonText: "保存"
      });
      
      wx.setNavigationBarTitle({title: "修改" + this.data.typeObj[options.type]})
    } else {
      wx.setNavigationBarTitle({  title: "新增" + this.data.typeObj[options.type] })
    }
  },
  
  // 新增或编辑信息
  addPlace(){
    // 参数完整性校验
    console.log(this.data)
    var currentPlace = this.data.currentPlace;
    if (currentPlace.address && currentPlace.area && currentPlace.phone && currentPlace.username && currentPlace.placename){
      // 判断是否有ID信息
      if (this.data.currentPlace._id) {
        // 更新的查询条件
        var queryObj = {
          _id: this.data.currentPlace._id,
          openId: true
        }
        // 删除掉ID建再进行更新
        delete this.data.currentPlace._id
        CF.update("places", queryObj, this.data.currentPlace, function (data) {
          console.log("update", data)
          Toast.success('更新成功，即将返回');
          setTimeout(() =>{
            wx.navigateBack()
          },2000)
        })
      } else {
        // 新增时将当前类型添加进去
        this.data.currentPlace.type = this.data.currentType;
        CF.insert("places", this.data.currentPlace, function (data) {
          console.log("insert", data)
          Toast.success('新增成功，即将返回'); 
          setTimeout(() => {
            wx.navigateBack()
          }, 2000)
        })
      }
    }else{
      Toast.fail('请将信息填写完整');
    }

  },
  // 根据ID查询单位信息
  queryPalceById(palceId){
    CF.get("places", { openId: true, _id: palceId}, (e) => {
      console.log(e)
      if (e.result.data && e.result.data.length == 1){
        this.setData({
          currentPlace: e.result.data[0]
        })
      }else{
        Toast.fail('系统异常，未找到该单位');
         setTimeout(() => {
          wx.navigateBack()
        }, 2000)
      }
    })
  },

  // 点击选择地址按钮
  selectArea(){
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
  onConfirmArea(event){
    this.setData({
      show_area: false, 
      "currentPlace.province": event.detail.values[0].name,
      "currentPlace.city": event.detail.values[1].name,
      "currentPlace.county": event.detail.values[2].name,
      "currentPlace.areacode": event.detail.values[2].code,
      "currentPlace.area": event.detail.values[0].name + event.detail.values[1].name + event.detail.values[2].name
    })
    console.log(this.data)
  },
  // 输入框
  onValueChange(e){
    var key = "currentPlace." + e.target.id;
    var obj = {};
    obj[key] = e.detail;
    this.setData(obj)
  }

})