// miniprogram/pages/lolAnalyse/lolAnalyse.js
import { cloud as CF } from '../../utils/cloudFunctionPromise.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentIndex: 0,
    totalCountList:[],
    userList:[],
    userMap:{
       "鲨鱼辣椒": { mvpTimes:0, pvmTimes:0, times: 0, winMoney:0,loseMoney:0,point: 0, calPoint: 0},
       "蝎子莱莱": { mvpTimes:0, pvmTimes:0, times: 0, winMoney:0,loseMoney:0,point: 0, calPoint: 0},
       "金龟次郎": { mvpTimes:0, pvmTimes:0, times: 0, winMoney:0,loseMoney:0,point: 0, calPoint: 0},
       "蟑螂恶霸": { mvpTimes:0, pvmTimes:0, times: 0, winMoney:0,loseMoney:0,point: 0, calPoint: 0},
       "根根": { mvpTimes:0, pvmTimes:0, times: 0, winMoney:0,loseMoney:0,point: 0, calPoint: 0},
       "牛逼": { mvpTimes:0, pvmTimes:0, times: 0, winMoney:0,loseMoney:0,point: 0, calPoint: 0},
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.queryAllList()
  },
  clickTotalType(e){
    this.clearMap()
    let index = e.target.dataset.index
    this.calData(index)
    this.setData({
      currentIndex: index
    })
  },
  clearMap(){
    this.data.userMap = {
      "鲨鱼辣椒": { mvpTimes:0, pvmTimes:0, times: 0, winMoney:0,loseMoney:0,point: 0, calPoint: 0},
      "蝎子莱莱": { mvpTimes:0, pvmTimes:0, times: 0, winMoney:0,loseMoney:0,point: 0, calPoint: 0},
      "金龟次郎": { mvpTimes:0, pvmTimes:0, times: 0, winMoney:0,loseMoney:0,point: 0, calPoint: 0},
      "蟑螂恶霸": { mvpTimes:0, pvmTimes:0, times: 0, winMoney:0,loseMoney:0,point: 0, calPoint: 0},
      "根根": { mvpTimes:0, pvmTimes:0, times: 0, winMoney:0,loseMoney:0,point: 0, calPoint: 0},
      "牛逼": { mvpTimes:0, pvmTimes:0, times: 0, winMoney:0,loseMoney:0,point: 0, calPoint: 0},
   }
  },
  calData(type){
    let list
    if(type === 0){
      list = this.data.list
    }else if(type === 1){
      list = this.data.list.filter(item => {
        return item.win
      })
    }else if(type === 2){
      list = this.data.list.filter(item => {
        return !item.win
      })
    }
      
      let userMap = this.data.userMap
      list.forEach(item => {
        let pvm = item.pvm
        let mvp = item.mvp
        userMap[mvp].mvpTimes++ // Mvp次数加1
        userMap[mvp].winMoney+=item.winAmount // Mvp金钱增加
        userMap[pvm].loseMoney+=item.loseAmount //  PVM金钱减少
        userMap[pvm].pvmTimes++ // PVM次数加1
        let users = item.users
        users.forEach(user => {
          let name = user.name
          if(user.value){
            userMap[name].times++ // 游戏次数加1
          }
          userMap[name].point+= user.value // 评分++
          userMap[name].calPoint+= user.calValue // 评分++
        })
      })
      let userList = []
      for(let name in userMap){
        userMap[name].winMoney = userMap[name].winMoney.toFixed(2);
        userMap[name].loseMoney = userMap[name].loseMoney.toFixed(2);
        userMap[name].name = name.substr(0,2);
        userMap[name].point = (userMap[name].point / userMap[name].times).toFixed(2);
        userMap[name].calPoint = (userMap[name].calPoint / userMap[name].times).toFixed(2);
        userList.push(userMap[name])
      }
      console.log(userList)
      this.setData({
        userList:userList
      })
  },
  queryAllList(){
    CF.ajax("getAll", {
      "tbName": 'lolRecord', // 数据库表名
      "query": {
        
      }
    }).then(res =>{
      let list = res.result.data;
      let totalCount = list.length
      let winCount = 0;
      let failCount = 0;
      list.forEach(item => {
        item.win ? winCount++ : failCount++
      })
      this.setData({
        totalCountList:[
          {icon: "like", count: totalCount, color: "#073b4c"},
          {icon: "smile", count: winCount, color: "red"},
          {icon: "warning", count: failCount, color: "#ef476f"}
        ]
      })
      this.data.list = list
      this.calData(0)
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

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})