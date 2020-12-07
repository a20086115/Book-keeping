// miniprogram/pages/lolAnalyse/lolAnalyse.js
import {
  cloud as CF
} from '../../utils/cloudFunctionPromise.js'
import dayjs from '../../utils/day.min.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    calList:[],
    beginDate:"",
    endDate:"",
    minDate: new Date(2020, 8, 1).getTime(),
    maxDate: new Date().getTime(),
    date: '',
    show: false,
    userList: [],
    userMap: {
      "鲨鱼辣椒": {
        mvpTimes: 0,
        pvmTimes: 0,
        times: 0,
        winMoney: 0,
        loseMoney: 0,
        point: 0,
        calPoint: 0
      },
      "蝎子莱莱": {
        mvpTimes: 0,
        pvmTimes: 0,
        times: 0,
        winMoney: 0,
        loseMoney: 0,
        point: 0,
        calPoint: 0
      },
      "金龟次郎": {
        mvpTimes: 0,
        pvmTimes: 0,
        times: 0,
        winMoney: 0,
        loseMoney: 0,
        point: 0,
        calPoint: 0
      },
      "蟑螂恶霸": {
        mvpTimes: 0,
        pvmTimes: 0,
        times: 0,
        winMoney: 0,
        loseMoney: 0,
        point: 0,
        calPoint: 0
      },
      "根根": {
        mvpTimes: 0,
        pvmTimes: 0,
        times: 0,
        winMoney: 0,
        loseMoney: 0,
        point: 0,
        calPoint: 0
      },
      "牛逼": {
        mvpTimes: 0,
        pvmTimes: 0,
        times: 0,
        winMoney: 0,
        loseMoney: 0,
        point: 0,
        calPoint: 0
      },
    },
    users: [],
    sIndexArray: ["总", "S1", "S2"],
    sIndex: 0,
    winIndex: 0,
    option1: [{
        text: '全部赛季',
        value: 0
      },
      {
        text: 'S1',
        value: 1
      },
      {
        text: 'S2',
        value: 2
      },
    ],
    totalCountList: [],
    option2: [{
        text: '全部记录',
        value: 0
      },
      {
        text: '胜利',
        value: 1
      },
      {
        text: '失败',
        value: 2
      },
    ],
  },
  selectToday(){
    this.setData({
      beginDate: dayjs().format("YYYY-MM-DD"),
      endDate: dayjs().format("YYYY-MM-DD")
    })
    this.calData()
  },
  selectLastDay(){
    this.setData({
      beginDate: dayjs().add(-1, 'day').format("YYYY-MM-DD"),
      endDate: dayjs().add(-1, 'day').format("YYYY-MM-DD")
    })
    this.calData()
  },
  selectLastWeek(){
    this.setData({
      beginDate: dayjs().add(-7, 'day').format("YYYY-MM-DD"),
      endDate: dayjs().format("YYYY-MM-DD")
    })
    this.calData()
  },
  selectLastMonth(){
    this.setData({
      beginDate: dayjs().add(-31, 'day').format("YYYY-MM-DD"),
      endDate: dayjs().format("YYYY-MM-DD")
    })
    this.calData()
  },
  goToDetail(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/lolRecords/addRecord?id=' + id ,
    })
  },
  clearBeginDate(){
    this.setData({
      beginDate: ""
    })
  },
  clearEndDate(){
    this.setData({
      endDate: ""
    })
  },
  // 展示时间弹框
  onDisplay(event) {
    this.data.key = event.currentTarget.dataset.key
    this.setData({
      show: true
    });
  },
  // 关闭时间弹框
  onClose() {
    this.setData({
      show: false
    });
  },
  // 选择时间
  onConfirm(event) {
    console.log(event)
    const date = event.detail;
    this.setData({
      show: false,
      [this.data.key]: dayjs(date).format("YYYY-MM-DD"),
    });
    this.calData()
  },
  // 赛季切换
  onIndexChange(event) {
    this.data.sIndex = event.detail
    this.calData()
  },
  // 胜负战绩切换
  onWinIndexChange(event) {
    this.data.winIndex = event.detail
    this.calData()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 查询所有比赛记录
    this.queryAllList()
  },
  // 动态查询users列表
  queryUsers() {
    CF.get("lolPlayer", {}, (e) => {
      let users = e.result.data;
      this.setData({
        users: users
      })
      this.queryAllList()
    })
  },
  clearMap() {
    // let map = {}
    // for(let user of this.data.users){
    //   map[user.name] = { mvpTimes:0, pvmTimes:0, times: 0, winMoney:0,loseMoney:0,point: 0, calPoint: 0}
    // }
    this.data.userMap = {
      "鲨鱼辣椒": {
        mvpTimes: 0,
        pvmTimes: 0,
        times: 0,
        winMoney: 0,
        loseMoney: 0,
        point: 0,
        calPoint: 0
      },
      "蝎子莱莱": {
        mvpTimes: 0,
        pvmTimes: 0,
        times: 0,
        winMoney: 0,
        loseMoney: 0,
        point: 0,
        calPoint: 0
      },
      "金龟次郎": {
        mvpTimes: 0,
        pvmTimes: 0,
        times: 0,
        winMoney: 0,
        loseMoney: 0,
        point: 0,
        calPoint: 0
      },
      "蟑螂恶霸": {
        mvpTimes: 0,
        pvmTimes: 0,
        times: 0,
        winMoney: 0,
        loseMoney: 0,
        point: 0,
        calPoint: 0
      },
      "根根": {
        mvpTimes: 0,
        pvmTimes: 0,
        times: 0,
        winMoney: 0,
        loseMoney: 0,
        point: 0,
        calPoint: 0
      },
      "牛逼": {
        mvpTimes: 0,
        pvmTimes: 0,
        times: 0,
        winMoney: 0,
        loseMoney: 0,
        point: 0,
        calPoint: 0
      },
    }
  },
  calData() {
    
    // 先清除上次计算的数据
    this.clearMap()

    // 根据查询条件进行过滤
    let sIndex = this.data.sIndex;
    let type = this.data.winIndex
    let list
    if (type === 0) {
      list = this.data.list.filter(item => {
        return (item.sIndex == sIndex || sIndex == 0)
      })
    } else if (type === 1) {
      list = this.data.list.filter(item => {
        return item.win && (item.sIndex == sIndex || sIndex == 0)
      })
    } else if (type === 2) {
      list = this.data.list.filter(item => {
        return !item.win && (item.sIndex == sIndex || sIndex == 0)
      })

    }

    // 过滤时间
    if(this.data.beginDate){
      let begin = this.data.beginDate + " 00:00:00"
      list = list.filter(item => {
        return item.createon >= begin
      })
    }
    if(this.data.endDate){
      let end = this.data.endDate + " 23:59:59"
      list = list.filter(item => {
        return  item.createon <= end
      })
    }


    this.setData( {
      calList: list
    })
    

    this.calTotalCount(list);

    let userMap = this.data.userMap
    list.forEach(item => {
      let pvm = item.pvm
      let mvp = item.mvp
      userMap[mvp].mvpTimes++ // Mvp次数加1
      userMap[mvp].winMoney += item.winAmount // Mvp金钱增加
      userMap[pvm].loseMoney += item.loseAmount //  PVM金钱减少
      userMap[pvm].pvmTimes++ // PVM次数加1
      let users = item.users
      users.forEach(user => {
        let name = user.name
        if (user.value) {
          userMap[name].times++ // 游戏次数加1
        }
        userMap[name].point += user.value // 评分++
        userMap[name].calPoint += user.calValue // 评分++
      })
    })
    let userList = []
    for (let name in userMap) {
      userMap[name].winMoney = userMap[name].winMoney.toFixed(2);
      userMap[name].loseMoney = userMap[name].loseMoney.toFixed(2);
      userMap[name].name = name.substr(0, 2);
      userMap[name].point = (userMap[name].point / userMap[name].times).toFixed(2);
      userMap[name].calPoint = (userMap[name].calPoint / userMap[name].times).toFixed(2);
      userList.push(userMap[name])
    }
    console.log(userList)
    this.setData({
      userList: userList
    })
  },
  // 查询所有战绩
  queryAllList() { 
    CF.ajax("getAll", {
      "tbName": 'lolRecord', // 数据库表名
      "query": {
      }
    }).then(res => {
      let list = res.result.data;
      this.data.list = list
      this.calData(0)
    })
  },
  calTotalCount(list) {
    let totalCount = list.length
    let winCount = 0;
    let failCount = 0;
    list.forEach(item => {
      item.win ? winCount++ : failCount++
    })
    this.setData({
      totalCountList: [{
          icon: "friends",
          text: '全部记录 ' + totalCount,
          value: 0,
          count: totalCount,
          color: "#073b4c"
        },
        {
          icon: "checked",
          text: '胜利' + winCount,
          value: 1,
          count: winCount,
          color: "red"
        },
        {
          icon: "clear",
          text: '失败 ' + failCount,
          value: 2,
          count: failCount,
          color: "#ef476f"
        }
      ]
    })
  }
})