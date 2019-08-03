const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
exports.main = async (event, context) => {
  let { userInfo} = event
  let { openId } = userInfo // 这里获取到的 openId 和 appId 是可信的
  try {
    return await db.collection('users').where({
      openId: openId, // 填入当前用户 openid
    }).get()
  } catch (e) {
    console.error(e)
  }
}