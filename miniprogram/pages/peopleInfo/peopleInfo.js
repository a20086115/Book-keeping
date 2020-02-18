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
    currentPerson: {
      province: "",
      city: "",
      county: "",
      name: "",
      area: "",
      address: "",
      idcard: "",
      phone: "",
      jobNumber:""
    },
    type: "0"
  },
  onLoad: function (options) {
    console.log(options)
    if(options.type){
      this.setData({
        type: options.type
      })
    }
    this.queryPeopleByOpenId();

    wx.setNavigationBarTitle({ title: "信息修改"})
   
  },
  // 新增或编辑信息
  addPerson() {
    // 参数完整性校验
    console.log(this.data)
    var currentPerson = this.data.currentPerson;
    if (currentPerson.address && currentPerson.area && currentPerson.phone && currentPerson.name && currentPerson.idcard) {
      // 判断是否有ID信息
      if (this.data.currentPerson._id) {
        // 更新的查询条件
        var queryObj = {
          _id: this.data.currentPerson._id,
          openId: true
        }
        // 删除掉ID建再进行更新
        delete this.data.currentPerson._id
        CF.update("people", queryObj, this.data.currentPerson, function (data) {
          console.log("update", data)
          Toast.success('更新成功');
        })
      } else {
        // 新增时将当前类型添加进去
        CF.insert("people", this.data.currentPerson, function (data) {
          console.log("insert", data)
          Toast.success('保存成功');
        })
      }
    } else {
      Toast.fail('请将信息填写完整');
    }

  },
  // 根据ID查询单位信息
  queryPeopleByOpenId() {
    CF.get("people", { openId: true}, (e) => {
      if (e.result.data && e.result.data.length > 0) {
        this.setData({
          currentPerson: e.result.data[0]
        })
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