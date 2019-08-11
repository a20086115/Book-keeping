import { cloud as CF } from '../../utils/cloudFunction.js'
Page({
  data: {
    event: "",
    bookName: '',
    loading: false
  },
  onLoad(option){
    if(option.id){
      console.log("存在id")
    }else{
      console.log("不存在")
    }
  },
  onChange(event) {
    this.data.bookName = event.detail;
  },
  btnClick(){
    // 创建账本
    CF.insert("books", {
      name: this.data.bookName,
      homie: []
    },function(){

    })
  }
});