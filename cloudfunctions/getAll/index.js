const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const MAX_LIMIT = 100
exports.main = async (event, context) => {

  let openId = event.userInfo.openId;
  let tbName = event.tbName; // 要查询的表名
  let query = event.query;  // 要查询的query条件
  // 如果openId为ture, 则把openId添加到查询条件
  if(query.openId){
    query.openId = openId
  }

  // 先取出集合记录总数
  const countResult = await db.collection(tbName).where(query).count()
  const total = countResult.total
  // 计算需分几次取
  const batchTimes = Math.ceil(total / 100)
  // 承载所有读操作的 promise 的数组
  const tasks = []
  for (let i = 0; i < batchTimes; i++) {
    const promise = db.collection(tbName).where(query).skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
    tasks.push(promise)
  }
  // 等待所有
  return (await Promise.all(tasks)).reduce((acc, cur) => {
    return {
      data: acc.data.concat(cur.data),
      errMsg: acc.errMsg,
    }
  })

}