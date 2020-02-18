【6小时】记录‘扫码登记’小程序开发过程（云开发，附代码）

# 0.前言
项目需求来自于我的姐姐，突然有一天晚上，她说他们那块需要一个扫码登记的小程序，用于疫情防治。于是当天晚上就通宵到了5点多，做出了这版小程序。用了一个之前注册过但一直没用过的小程序，提交审核后，当天就通过了（赞一下微信审核团队）。

小程序采用云开发，UI框架引入的是[Vant Weapp](https://youzan.github.io/vant-weapp/#/intro)。
之前一个项目也是类似架构，于是在这个旧项目基础上进行的开发，旧项目主要是提前集成了Vant框架，有封装好的增删改查云函数。
# 1.二维码 
扫码登记二维码，每个自建单位都有对应二维码，以下为测试小区。
![扫码登记二维码](https://user-gold-cdn.xitu.io/2020/2/18/17056130a4afc4b0?w=430&h=430&f=jpeg&s=101896)

# 2.代码仓库
[代码仓库，求star](https://github.com/a20086115/Book-keeping.git)

# 3.开发过程
## 3.1 集成Vant框架并引入组件
vant框架的集成可以参考[官方文档](https://youzan.github.io/vant-weapp/#/quickstart)，下载好框架后再app.json中引入所需组件。我为了方便就一次性把所有组件都引入了进来，这样在页面中就可以直接使用了。

![引入组件](https://user-gold-cdn.xitu.io/2020/2/18/170563a008a8f4a3?w=1149&h=779&f=png&s=154152)

## 3.2 封装通用增删改查云函数
程序采用云开发，这里是把我之前写好的增删改查云函数直接引了过来。

![云函数列表](https://user-gold-cdn.xitu.io/2020/2/18/170564382dcee69b?w=311&h=195&f=png&s=7409)
分别为增(insert)、删(delete)、改(update)、查(get)、分页列表(list)五个云函数。
这五个云函数的所查表、条件等均由调用参数来决定。比如get方法，根据参数tbName和query对象来进行查询。

```
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
// 根据表名和query对象查询数据
exports.main = async (event, context) => {
  let openId = event.userInfo.openId;
  let tbName = event.tbName; // 要查询的表名
  let query = event.query;  // 要查询的query条件
  // 如果openId为ture, 则把openId添加到查询条件
  if(query.openId){
    query.openId = openId
  }
  try {
    return await db.collection(tbName).where(query).get()
  } catch (e) {
    console.error(e)
  }
}
```
为了方便在小程序中调用这几个方法，小程序封装了一个utils/cloudFunction.js文件。还是以get为例，将调用云函数的过程进行了封装，如展示loading，失败后提示等。

![](https://user-gold-cdn.xitu.io/2020/2/18/170564b6c020e433?w=553&h=475&f=png&s=34866)

封装好之后，那么使用起来就很方便了，比如查询books这一个集合，name为斗破苍穹。

```
    //在js 中引用该js文件
    import CF from './utils/cloudFunction.js'
    // 第一个参数为表名， 第二个参数为查询条件， 第三个参数为成功回调， 第四个参数为失败回调
    // openId 传ture的意思是查询条件中会增加本人openid。不传或传false,查询条件中将没有openId限制 (因为insert方法中会自动添加openid字段，将创建人的openid保存其中。可查看云函数的实现代码,了解具体逻辑）
    // 此处传了openId,只查本人创建的数据。
    CF.get("books", {openId: true, name:"斗破苍穹"}, (e) => {
      console.log("成功",e.result.data)
    },() => {
      console.log("失败")
    })
```

## 3.3 数据库集合
程序只有三个集合，分别为people存储个人信息、palce存储需要进出的单位信息、history存储进出记录。

## 3.4 界面编写
主要使用的vant里边的宫格、输入框、省市区选择器这几个组件，夸一下这个框架，我觉得太好用啦~

首页是这样的，其中社区、集团、学校、乡镇都是place表，不过type字段不同。居民和员工都是people表来存储，不过员工会让多输入一条工号字段。

![首页](https://user-gold-cdn.xitu.io/2020/2/18/170566125ddf5afa?w=389&h=681&f=png&s=35674)

社区页和子菜单页如下，支持信息修改、出入记录查看、二维码查看。个人信息页面类似。

![社区页](https://user-gold-cdn.xitu.io/2020/2/18/170566331e6a341d?w=393&h=686&f=png&s=18515)

![子菜单](https://user-gold-cdn.xitu.io/2020/2/18/1705663c8608a5c7?w=391&h=683&f=png&s=19900)

![社区信息页](https://user-gold-cdn.xitu.io/2020/2/18/1705664e9ef59ea0?w=407&h=693&f=png&s=25135)

## 3.5 二维码生成与扫码查看
官方文档中有两种二维码生成方式，一种有数量限制，一种没有。程序采用的是没有数量限制的这种，不过可以带参数长度较短只有32位。

生成二维码的方式用http和云函数两种方式，程序自然使用的云函数的方式。

```
const cloud = require('wx-server-sdk')
cloud.init()
exports.main = async (event, context) => {
  try {
    const result = await cloud.openapi.wxacode.getUnlimited({
      scene: event.scene, // 此为参数
      page: 'pages/index/index', // 此为跳转界面
      isHyaline: false
    })
    console.log(result)
    return result
  } catch (err) {
    console.log(err)
    return err
  }
}
```
小程序中以placeId（也就是社区ID为参数），调用云函数获取二维码，并将返回buffer转为base64数据作为图片路径展示。


```
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
```

保存图片到本地，需要先将base64数据转换为临时文件，根据文件路径调用wx.saveImageToPhotosAlbum来进行存储。

```
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
```

## 3.6 扫码查看
扫描二维码跳转的路径是首页，首页监听有无对应参数，存在参数则跳入到登记录入界面。提交后则会增加对应出入记录。

若此人之前录入过个人信息，则将信息展示出来，若未录入，在新增出入记录的同时会将个人信息同步保存起来。

![登记录入](https://user-gold-cdn.xitu.io/2020/2/18/170567149bb5a19b?w=410&h=691&f=png&s=32605)

开发过程中不知道扫码登记该如何测试，用手机扫描的话会提示未登录。网上查了一下，微信开发工具支持自定义编译，在这里自己加上对应的参数或者直接扫描生成的二维码即可。

![自定义编译](https://user-gold-cdn.xitu.io/2020/2/18/170567522bceff28?w=291&h=268&f=png&s=20061)
## 3.7 出入历史
个人出入历史和单位出入历史是共用的一个界面，界面很丑，搜索功能也没完善 点击功能也还没做。
单位查看历史记录不显示单位名称，只显示时间和人名；个人查看出入记录，不显示个人名称，只显示单位名称和时间。

![出入记录](https://user-gold-cdn.xitu.io/2020/2/18/170567ce9168f652?w=410&h=702&f=png&s=49149)

这个界面主要是利用的onPullDownRefresh、onReachBottom两个方法来监听的用户下拉和上拉触底方法。利用云函数list来进行的分页查询。

```
 /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    page = 1;
    canLoadMore = true;
    isRefesh = true;
    this.queryList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    page++;
    isloadmore=true;
    this.queryList();
  },
  
    queryList(){
    if (!canLoadMore){
      Toast.fail("无更多数据");
      return;
    }
    wx.showLoading({
      title: 'loading',
      icon: 'loading'
    })
    CF.list("history", this.data.query, page, size, "", "", (e) => {
      console.log(e)
      if(e.result.data.length < size){
        canLoadMore = false;
      }
      if(page == 1){
        this.setData({
          historys: e.result.data
        })
      }else{
        this.setData({
          historys: this.data.historys.concat(e.result.data)
        })
      }
      if(isRefesh){
        wx.stopPullDownRefresh({
          complete: function (res) {
            wx.hideLoading();
          }
        })
      }else{
        wx.hideLoading();
      }
    })
  },
```
# 4.总结与不足
## 4.1 总结
1. 第一次写这么多字，不知道哪里该描述多一点，哪里该省略着写。希望大家看完之后，多多提出意见建议，一定虚心采纳。项目是周六晚上通宵写的，没有耽误上班哈哈。
[代码仓库，求star](https://github.com/a20086115/Book-keeping.git)
2. 云开发真的好用，弱化了运维、服务器概念，扩容啥的也方便简单。虽然没有云开发我会去用node写接口，但肯定没有现在这么简单方便。
3. vant组件库也很好用，有幸还被采纳过一次merge哈哈~
4. 希望能为防范疫情做一点贡献吧~~祝大家新年快乐~健健康康。

## 4.2 小程序需要改进的地方
增加insertOrUpdate云函数方法、生成二维码图片中添加小区名称、手机号码授权获取、优化出入记录列表页UI及性能、增加出入历史页的搜索功能、增加出入历史页的点击弹框功能。