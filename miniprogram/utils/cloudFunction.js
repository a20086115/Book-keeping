// 云函数 增删改查封装

import dayjs from './day.min.js'
var cloud = {
  // 增
  insert: function(tbName, data, cb, errcb){
    wx.showLoading({
      title: '加载中...',
    })
    data.createon = dayjs().format("YYYY-MM-DD HH:mm:ss");
    console.log(data)
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
      }
    }).catch(() => {
      wx.hideLoading();
      wx.showToast({
        icon: 'none',
        title: '网络出小差了,请稍后再试...'
      })
      if (typeof errcb == "function") {
        errcb();
      }
    })
  },
  // 删
  delete: function (tbName, query, cb, errcb) {
    wx.showLoading({
      title: '加载中...',
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
      }
    }).catch(() => {
      wx.hideLoading();
      wx.showToast({
        icon: 'none',
        title: '网络出小差了,请稍后再试...',
      })
      if (typeof errcb == "function") {
        errcb();
      }
    })
  },
  update: function(tbName, query, data, cb, errcb) {
    wx.showLoading({
      title: '加载中...',
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
      }
    }).catch(() => {
      wx.hideLoading();
      wx.showToast({
        icon: 'none',
        title: '网络出小差了,请稍后再试...',
      })
      if (typeof errcb == "function") {
        errcb();
      }
    })
  },
  get: function (tbName, query, cb, errcb) {
    wx.showLoading({
      title: '加载中...',
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
      }
    }).catch(() => {
      wx.hideLoading();
      wx.showToast({
        icon: 'none',
        title: '网络出小差了,请稍后再试...',
      })
      if (typeof errcb == "function") {
        errcb();
      }
    })
  }, 
  list: function (tbName, query, page, size, field, order, cb, errcb) {
    wx.showLoading({
      title: '加载中...',
    })
    wx.cloud.callFunction({
      name: 'list',
      data: {
        tbName: tbName, // 数据库表名
        query: query, // 查询条件
        page: page, 
        size: size, 
        field: field, 
        order: order
      }
    }).then(function (e) {
      wx.hideLoading();
      if (typeof cb == "function") {
        cb(e);
      }
    }).catch(() => {
      wx.hideLoading();
      wx.showToast({
        icon: 'none',
        title: '网络出小差了,请稍后再试...',
      })
      if (typeof errcb == "function") {
        errcb();
      }
    })
  },
}
export {cloud};