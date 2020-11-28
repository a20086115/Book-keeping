// miniprogram/pages/placeHistory/placeHistory.js
import { cloud as CF } from '../../utils/cloudFunction.js'
import Toast from "../../miniprogram_npm/vant-weapp/toast/toast";
var page=1,size = 20,sidx="_id";
let isRefesh = false; //正在下拉更多
let isloadmore = false; //正在下载更多
let canLoadMore = true;
Page({

  /**
   * 这个是列表界面
   * 页面的初始数据
   */
  data: {
    historys:[],
    money: "*",
    query:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    page = 1;
    canLoadMore = true;
    wx.setNavigationBarTitle({ title: "比赛记录"})
   
  },
  goAnalyse(){
    wx.navigateTo({
      url: '/pages/lolAnalyse/lolAnalyse',
    })
  },
  goPlayer(){
    wx.navigateTo({
      url: '/pages/lolPlayers/lolPlayersList',
    })
  },
  addRecord(){
    wx.navigateTo({
      url: '/pages/lolRecords/addRecord',
    })
  },
  goToDetail(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/lolRecords/addRecord?id=' + id ,
    })

  },
  queryMoney(){
    CF.get("money",{}, (e) =>{
      let money = e.result.data[0].total
      this.setData({
        money: money
      })
    })
  },
  queryList(){
    if (!canLoadMore){
      Toast.fail("无更多数据");
      return;
    }
    wx.showLoading({
      title: 'loading',
      icon: 'loading'
    })
    CF.list("lolRecord", this.data.query, page, size, "", "", (e) => {
      console.log(e)
      if(e.result.data.length < size){
        canLoadMore = false;
      }
      if(page == 1){
        this.setData({
          historys: e.result.data
        })
      }else{
        this.setData({
          historys: this.data.historys.concat(e.result.data)
        })
      }
      if(isRefesh){
        wx.stopPullDownRefresh({
          complete: function (res) {
            wx.hideLoading();
          }
        })
      }else{
        wx.hideLoading();
      }
    })
  },
  

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    page = 1;
    canLoadMore = true;
    isRefesh = true;
    this.queryList();
    this.queryMoney()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("")
    page++;
    isloadmore=true;
    this.queryList();
  },
  upper(e) {
    console.log(e)
  },

  lower(e) {
    console.log(e)
  },

  scroll(e) {
    console.log(e)
  },
  onShow(){
    this.onPullDownRefresh()
  },
  onShareAppMessage: function () {
    // return custom share data when user share.
    return {
      title: '比赛记录'
    }
  },
})