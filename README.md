# 云开发 quickstart

这是云开发的快速启动指引，其中演示了如何上手使用云开发的三大基础能力：

- 数据库：一个既可在小程序前端操作，也能在云函数中读写的 JSON 文档型数据库
- 文件存储：在小程序前端直接上传/下载云端文件，在云开发控制台可视化管理
- 云函数：在云端运行的代码，微信私有协议天然鉴权，开发者只需编写业务逻辑代码

## 参考文档

- [云开发文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)



## 云函数增删改查封装使用说明
1. 对云函数通用方法增删改查进行了封装，使用更加方便，具体封装可以查看utils/cloudFunction.js 文件及云函数目录下的insert\get\delete\update四个云函数（若没有云函数，右键同步云函数列表）。
2. 在app.js 中引用该js文件
```
import CF from './utils/cloudFunction.js'
```
2. 举例使用
---- 
- 查询账本(index/index.js)

```
    // 查询账本信息 
    // 第一个参数为表名， 第二个参数为查询条件， 第三个参数为成功回调， 第四个参数为失败回调
    // openId 传ture的意思是查询条件中会增加本人openid。不传或传false,查询条件中将没有openId限制 可查看云函数的实现代码
    // 此处传了openId,只查本人的账本， 若传false, 将查所有人账本
    CF.get("books", {openId: true}, (e) => {
      console.log("成功")
    },() => {
      console.log("失败")
    })

```
- 创建账本(createBook/index.js)

```
    // 创建账本
    // 第一个参数是表名， 第二个参数是存储的内容， 第三个参数为成功回调， 第四个参数为失败回调
    CF.insert("books", {
      name: this.data.bookName,
      children: []
    },function(){

    },function()[
      
    ])
```