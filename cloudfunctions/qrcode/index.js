const cloud = require('wx-server-sdk')
cloud.init()
exports.main = async (event, context) => {
  try {
    const result = await cloud.openapi.wxacode.getUnlimited({
      scene: event.scene,
      page: 'pages/index/index',
      isHyaline: false
    })
    console.log(result)
    return result
  } catch (err) {
    console.log(err)
    return err
  }
}