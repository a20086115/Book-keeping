// miniprogram/pages/lolPlayers/lolPlayersList.js
import { cloud as CF } from '../../utils/cloudFunctionPromise.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    users:[]
  },
  onShow(){

    this.getUsers()
  },
  /**
   * 生命周期函数--监听页面加载
   */
 
  getUsers(){
    CF.get("lolPlayer", {})
    .then(res => {
      console.log(res)
      this.setData({
        users: res.result.data
      })
    })
  },
  goToDetail(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/lolPlayers/lolPlayerDetail?id=' + id ,
    })

  },
 
})