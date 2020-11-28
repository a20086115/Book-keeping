// miniprogram/pages/addPlace/addPlace.js
import  province_list from '../../utils/area.js'
import { cloud as CF } from '../../utils/cloudFunction.js'
import Toast from "../../miniprogram_npm/vant-weapp/toast/toast";
let S_INDEX = 2; // 当前赛季
Page({

  /**
   * 这个是添加界面
   * 页面的初始数据
   */
  data: {
    money: "*",
    currentRecord:{
      mvp: "",
      pvm: "",
      win: false,
      winAmount: 0,
      loseAmount:0,
      users: [
        { name: "丶鲨鱼辣椒丶", sup: true, xs: 0.85, value: 0, calValue: 0 },
        { name: "丶金龟次郎丶", sup: false, xs: 1.00, value: 0, calValue: 0 },
        { name: "丶蝎子莱莱丶", sup: false, xs: 0.75, value: 0, calValue: 0 },
        { name: "丶张狼恶霸丶", sup: false, xs: 1.05, value: 0, calValue: 0 },
        { name: "丶根根", sup: false, xs: 1.05, value: 0, calValue: 0 },
        { name: "算你牛笔让你走", sup: false, xs: 1, value: 0, calValue: 0 }
      ]
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 判断参数是否有ID，如果有ID则是修改信息
    if(options.id){
      this.queryPalceById(options.id);
    } else{
      // 查询一下奖金池额度
      this.queryMoney()

      // 查询users系数
      this.queryUsers()
    }
  },
  // 动态查询users 系数
  queryUsers(){
    CF.get("lolPlayer",{}, (e) =>{
      let users = e.result.data;

      // 补充基础信息
      for(let user of users){
        if(user.name.indexOf("鲨鱼") != -1) {
          user.sup = true
        }else{
          user.sup = false;
        }
        user.value = 0;
        user.calValue = 0;

        delete user.openId
        delete user.createon
      }

      this.setData({
        "currentRecord.users": users
      })
    })
  },
  
  queryMoney(){
    CF.get("money",{}, (e) =>{
      let money = e.result.data[0].total
      this.setData({
        money: money
      })
      this.changeWin()
    })
  },
  // 新增或编辑信息
  addRecord(){
    // 参数完整性校验 处理数据

    this.data.currentRecord.users.forEach(user => {
      user.value = parseFloat(user.value)
    })
    
    // 判断是否有ID信息
    if (this.data.currentRecord._id) {
      // 更新的查询条件
      var queryObj = {
        _id: this.data.currentRecord._id,
        openId: true
      }
      // 删除掉ID建再进行更新
      delete this.data.currentRecord._id
      CF.update("lolRecord", queryObj, this.data.currentRecord, function (data) {
        console.log("update", data)
        Toast.success('更新成功，即将返回');
        setTimeout(() =>{
          wx.navigateBack()
        },2000)
      })
    } else {
      // 新增
      this.data.currentRecord.sIndex = S_INDEX;
      CF.insert("lolRecord", this.data.currentRecord, (data) => {
        console.log("insert", data)
        let diff = 0;
        if(this.data.currentRecord.win){
          diff = -1 * parseFloat(this.data.currentRecord.winAmount)
        }else{
          diff =  3
        }
        let money = this.data.money + diff
        CF.update("money", {}, {total: parseFloat(money.toFixed(2))}, ()=>{
          Toast.success('新增成功，即将返回'); 
          setTimeout(() => {
            wx.navigateBack()
          }, 2000)
        })
      })
    }
    

  },
  // 根据ID查询单位信息
  queryPalceById(palceId){
    CF.get("lolRecord", { _id: palceId}, (e) => {
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
  // 输入框
  onValueChange(e){
    console.log(e.target.id)
    var key = "currentRecord." + e.target.id;
    var obj = {};
    obj[key] = e.detail;
    this.setData(obj)
    this.calUsers()
   },
   calUsers(){
    // 计算users的值
    this.data.currentRecord.users.forEach(user => {
      if(user.sup){
        user.calValue = parseFloat((user.value * user.xs * 1.1).toFixed(2))
      }else{
        user.calValue = parseFloat((user.value * user.xs).toFixed(2))
      }
    })
    let mvpUser = {}
    let pvmUser = {}
    // 计算users的值
    this.data.currentRecord.users.forEach(user => {
      if(user.calValue){
        if(!mvpUser.calValue || user.calValue > mvpUser.calValue){
          mvpUser = user
        }
        if(!pvmUser.calValue || user.calValue < pvmUser.calValue){
          pvmUser = user
        }
      }
    })
    this.data.currentRecord.mvp = mvpUser.name
    this.data.currentRecord.pvm = pvmUser.name

    this.setData({
      currentRecord: this.data.currentRecord
    })
   },
  // 第几个是辅助
  changeSup(e){
    let index = e.currentTarget.dataset.index;
    this.data.currentRecord.users.forEach(user => {
      user.sup = false
    })
    this.data.currentRecord.users[index].sup = true
    this.calUsers()
  },
  changeWin(){
    this.data.currentRecord.win = !this.data.currentRecord.win
    
    if(this.data.currentRecord.win){
      this.data.currentRecord.winAmount = parseFloat((this.data.money ? this.data.money/2 : 0).toFixed(2))
      this.data.currentRecord.loseAmount = 0
    }else{
      this.data.currentRecord.winAmount = 0
      this.data.currentRecord.loseAmount = 5
    }
    this.setData({
      currentRecord: this.data.currentRecord
    })
  }

})