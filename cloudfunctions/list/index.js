const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
// 根据表名和query对象查询数据
exports.main = async (event, context) => {
  let openId = event.userInfo.openId;
  let tbName = event.tbName; // 要查询的表名
  let query = event.query;  // 要查询的query条件
  let page = event.page;
  let size = event.size;
  let field = event.field;
  let order = event.order;
  if (!field){
    field = "createon"
  } 
  if (!order) {
    order = "desc"
  }
  // 如果openId为ture, 则把openId添加到查询条件
  if (query.openId) {
    query.openId = openId
  }
  console.log(event.query)
  try {
    return await db.collection(tbName).where(query).orderBy(field, order).skip((page - 1) * size).limit(size).get()
  } catch (e) {
    console.error(e)
  }
}