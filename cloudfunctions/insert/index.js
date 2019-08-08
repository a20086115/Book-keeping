// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
// 云函数入口函数
// 向某表中插入一条数据
exports.main = async (event, context) => {
  let openId = event.userInfo.openId;
  let tbName = event.tbName; // 要插入的表名
  let data = event.data;  // 要插入的对象
  data.openId = openId;
  try {
    return await db.collection(tbName).add({
      data: data
    })
  } catch (e) {
    console.error(e)
  }
}