var db=wx.cloud.database()
var app=getApp()
Page({

  data: {
    about:"",
    ID:"",
  },
  onLoad(){
    wx.showLoading({
      title: '加载中...',
      mask:true
    })
    this.huoqu()
    this.setData({
      ID:app.userInfo._id
    })
  },
  //复制邮箱
  fuzhi(e){
    //console.log(e.currentTarget.dataset.item)
    wx.setClipboardData({
      data: e.currentTarget.dataset.item,
      success (res) {
        console.log("成功")
      }
    })
  },
  //获取
  huoqu(){
    console.log(app.system1)
    if(app.system1==""||app.system1==undefined){
      //获取写入
      db.collection('system').where({'_id':'system01'})
      .get().then((res)=>{
        //console.log(res)
        app.system1=res.data[0]
        this.setData({
          about:res.data[0].system.about
        })
        wx.hideLoading({})
      })
    }else{
      this.setData({
        about:app.system1.system.about
      })
      wx.hideLoading({})
    }
  }
})