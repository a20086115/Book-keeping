// miniprogram/pages/placeQrcode/placeQrcode.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageurl: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getQrcode(options.id);
  },

  // 获取二维码信息
  getQrcode(queryId) {
    wx.showLoading({
      title: '获取二维码中',
    })
    var _this = this;
    // 请求云函数生成二维码,参数是当前用户的社区id
    wx.cloud.callFunction({
      name: 'qrcode',
      data: {
        scene: queryId
      },
      // 成功回调
      success: function (res) {
        console.log(res.result.buffer);
        let imagebase64 = wx.arrayBufferToBase64(res.result.buffer);
        let imgUrl = 'data:image/jpg;base64,' + imagebase64;
        _this.setData({
          imageurl: imgUrl
        })
        wx.hideLoading();
      },
    })
  },
  /**
   * 保存图片到手机
   */
  saveQrcode: function () {
    var _this = this;
    wx.showLoading({
      title: '保存二维码中',
    })
    _this.base64src(this.data.imageurl, res => {
      wx.saveImageToPhotosAlbum({
        filePath: res,
        success(res) {
          wx.showToast({
            title: '保存成功',
            icon: 'success',
            duration: 2000
          })
        }
      })
      wx.hideLoading();
    });
  },
  /**
   * 将base64格式图片转为url地址
   */
  base64src: function (base64data, cb) {
    const [, format, bodyData] = /data:image\/(\w+);base64,(.*)/.exec(base64data) || [];
    if (!format) {
      return (new Error('ERROR_BASE64SRC_PARSE'));
    }
    const filePath = `${wx.env.USER_DATA_PATH}/${'wx_qrcode'}.${format}`;
    const buffer = wx.base64ToArrayBuffer(bodyData);
    wx.getFileSystemManager().writeFile({
      filePath,
      data: buffer,
      encoding: 'binary',
      success() {
        cb(filePath);
      },
      fail() {
        return (new Error('ERROR_BASE64SRC_WRITE'));
      },
    })
  },
})