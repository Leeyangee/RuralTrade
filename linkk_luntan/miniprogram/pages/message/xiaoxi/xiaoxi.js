var app=getApp()
var db=wx.cloud.database()
Page({
  data: {
    message:[],
    id:999,
    msgnb:[],
    animationData: {},
    x:[],
    xx:[]
  },
  onLoad(){
    
  },
  //刷新消息页面
  shuaxin(){
    var message=app.message
    var zs=message.length
    var x=[]
    for(var i=0;i<zs;i++){
      x[i]=0
    }
    this.setData({
      message:message,
      x:x,
      xx:x
    })
    wx.stopPullDownRefresh({})
  },  
  //查看评论的说说
  chakan(e){
    //要查看的说说的id
    console.log("e:",e)
    var ssid=e.currentTarget.dataset.ssid
    var id=e.currentTarget.dataset.id
    var liuyan=e.currentTarget.dataset.liuyan
    console.log("id:::",id)
    //console.log(ssid)
    this.setData({
      id:id
    })
    
    //删除消息记录
    db.collection("users").doc(app.userInfo._id)
    .update({
      data:{
        message:db.command.pull({
          "id":db.command.eq(id)//这里不知道行不
        })
      }
    }).then((res)=>{
      console.log("删消息（已读）",res)
    })
    wx.navigateTo({
      url:"../../plate2/plate2?liuyan="+liuyan+"&id="+ssid
    })
  },
  //生命周期函数--监听页面显示
  onShow: function () {
    this.shuaxin()
  },

  //滑动删除
  change(e){
    console.log(e.detail.x)
    var x=e.detail.x
    var xx=this.data.xx
    var index=e.currentTarget.dataset.index
    var zs=this.data.message.length
    if(xx[index]==0 && x<-37.5){
      xx[index]=-75
    }else if(xx[index]==-75 && x>-37.5){
      xx[index]=0
    }
    for(var i=0;i<zs;i++){
      if(i!=index){
        xx[i]=0
      }else{
        console.log("indexqq:",index,i)
      }
    }
    this.setData({
      xx:xx
    })
    
  },
  change1(e){
    var x=this.data.xx
    this.setData({
      x:x
    })
  },
  //删除消息
  delete(e){
    console.log(e.currentTarget.dataset.id)
    console.log(e.currentTarget.dataset.index)
    console.log(e.currentTarget.dataset.ssid)
    var id=e.currentTarget.dataset.id
    var index=e.currentTarget.dataset.index
    //删除users里的message记录
    //删除消息记录
    var message=this.data.message

    db.collection("users").doc(app.userInfo._id)
    .update({
      data:{
        message:db.command.pull({
          "id":db.command.eq(id)//这里不知道行不
        })
      }
    }).then((res)=>{
      console.log("删消息（已读）",res)
    })

    //把本地改一下
    
    message.splice(index,1)
    var zs=message.length
    var x=[]
    for(var i=0;i<zs;i++){
      x[i]=0
    }

    this.setData({
      message:message,
      x:x,
      xx:x
    })
  },
  //移动回弹
  huitan(){
    var message=this.data.message
    var zs=message.length
    var x=[]
    for(var i=0;i<zs;i++){
      x[i]=0
    }
    this.setData({
      x:x,
      xx:x
    })
    console.log("回弹")
  },
  //刷新1
  shuaxin1(){
    wx.showToast({
      title: '刷新了...',
      icon:'none',
      duration:500
    })
    this.shuaxin()
  },
  //下拉动作-刷新
  onPullDownRefresh: function () {
    this.shuaxin1()
  },
  //
})