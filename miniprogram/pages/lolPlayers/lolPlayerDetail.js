// miniprogram/pages/lolPlayers/lolPlayerDetail.js

import { cloud as CF } from '../../utils/cloudFunctionPromise.js'
import Toast from "../../miniprogram_npm/vant-weapp/toast/toast";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentRecord:{
      name: '',
      xs: ''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 判断参数是否有ID，如果有ID则是修改信息
    if(options.id){
      this.queryUserById(options.id);
    } else{
      
    }
  },
   // 根据ID查询信息
   queryUserById(Id){
    CF.get("lolPlayer", {_id: Id}).then((e) => {
      console.log(e)
      if (e.result.data && e.result.data.length == 1){
        this.setData({
          currentRecord: e.result.data[0]
        })
      }else{
        Toast.fail('系统异常，未找到该单位');
         setTimeout(() => {
          wx.navigateBack()
        }, 2000)
      }
    })
  },
  updatePlayer(){
    console.log(this.data.currentRecord)
    let updateId = this.data.currentRecord._id
    // 删除掉ID建再进行更新
    delete this.data.currentRecord._id
    CF.update('lolPlayer', {_id: updateId}, this.data.currentRecord).then(res => {
      wx.navigateBack()
    })
  },
  // 输入框
  onValueChange(e){
    console.log(e.target.id)
    var key = "currentRecord." + e.target.id;
    var obj = {};
    obj[key] = e.detail;
    this.setData(obj)
   },
 
})