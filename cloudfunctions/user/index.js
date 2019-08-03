// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  let { userInfo } = event
  let { openId } = userInfo // 这里获取到的 openId 和 appId 是可信的
  try {
    return await db.collection('users').add({
      data: {
        openId: openId,
        userInfo: event.datas
      }
    })
  } catch (e) {
    console.error(e)
  }
}