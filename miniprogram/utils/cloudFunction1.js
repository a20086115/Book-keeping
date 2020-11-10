// 云函数 增删改查封装
var cloud = {
  // 增
  insert: function(tbName, data, cb, errcb, hide){
    console.log("insert", tbName, data, cb, errcb)
    if(!hide){
      wx.showLoading({
        title: '加载中...',
        icon: 'loading',
      })
    }

    wx.cloud.callFunction({
      name: 'insert',
      data: {
        "tbName": tbName, // 数据库表名
        "data": data // 要存储的内容
      }
    }).then(function (e) {
      wx.hideLoading();
      if(typeof cb == "function"){
        cb(e);
      } else {
        console.log(cb)
        console.log("不是正确的回调函数" + typeof cb)
      }
    }).catch((err) => {
      wx.hideLoading();
      wx.showToast({
        title: '网络出小差了,请重试...',
        icon: 'none',
      })
      if (typeof errcb == "function") {
        errcb(err);
      } else {
        console.log(errcb)
        console.log("不是正确的错误回调函数" + typeof errcb)
      }
    })
  },
  // 删
  delete: function (tbName, query, cb, errcb) {
    console.log("delete", tbName, query, cb, errcb)
    wx.showLoading({
      title: '加载中...',
      icon: 'loading',
    })
    wx.cloud.callFunction({
      name: 'delete',
      data: {
        tbName: tbName, // 数据库表名
        query: query // 查询条件
      }
    }).then(function (e) {
      wx.hideLoading();
      if (typeof cb == "function") {
        cb(e);
      } else {
        console.log(cb)
        console.log("不是正确的回调函数" + typeof cb)
      }
    }).catch((err) => {
      wx.hideLoading();
      wx.showToast({
        title: '网络出小差了,请稍后再试...',
        icon: 'none',
      })
      if (typeof errcb == "function") {
        errcb(err);
      } else {
        console.log(errcb)
        console.log("不是正确的回调函数" + typeof errcb)
      }
    })
  },
  // 改
  update: function (tbName, query, data, cb, errcb) {
    console.log("update", tbName, query, data, cb, errcb)
    wx.showLoading({
      title: '加载中...',
      icon: 'loading',
    })
    wx.cloud.callFunction({
      name: 'update',
      data: {
        tbName: tbName, // 数据库表名
        query: query, // 查询条件
        data: data
      }
    }).then(function (e) {
      wx.hideLoading();
      if (typeof cb == "function") {
        cb(e);
      } else {
        console.log(cb)
        console.log("不是正确的回调函数" + typeof cb)
      }
    }).catch(() => {
      wx.hideLoading();
      wx.showToast({
        title: '网络出小差了,请稍后再试...',
        icon: 'none',
      })
      if (typeof errcb == "function") {
        errcb();
      } else {
        console.log(errcb)
        console.log("不是正确的回调函数" + typeof errcb)
      }
    })
  },
  // 查
  get: function (tbName, query, cb, errcb, hideError) {
    console.log("get", tbName, query, cb, errcb)
    wx.showLoading({
      title: '加载中...',
      icon: 'loading',
    })
    wx.cloud.callFunction({
      name: 'get',
      data: {
        tbName: tbName, // 数据库表名
        query: query // 查询条件
      }
    }).then(function (e) {
      wx.hideLoading();
      if (typeof cb == "function") {
        cb(e);
      } else {
        console.log(cb)
        console.log("不是正确的回调函数" + typeof cb)
      }
    }).catch(() => {
      wx.hideLoading();
      if (!hideError){
        wx.showToast({
          title: '网络出小差了,请稍后再试...',
          icon: 'none',
        })
      }

      if (typeof errcb == "function") {
        errcb();
      }else{
        console.log(errcb)
        console.log("不是正确的回调函数" + typeof errcb)
      }
    })
  },
}
export {cloud};