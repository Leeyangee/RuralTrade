var db=wx.cloud.database()
var app=getApp()
Page({
  //页面的初始数据
  data: {
    ss_xx:[],
    _ss_xx:[],
    bankuai:"",
    yincang:true,
    zuixinorzuire:0,
    index:-1,
    yizhou:"",
    kong:false,
    jiazaizhong:false
  },
  //跳转到详情！！！！！！！！！！！
  xiangqing(){
    wx.navigateTo({
      url:"../plate2/plate2"
    })
  },
  //回到顶部！！！！！！！！！！
  goTop: function (e) {  // 一键回到顶部
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },
  //刷新！！！！！！！！！！
  shuaxin(){
    var shuaxin=true
    this.setData({
      ss_xx:[]
    })
    this.jiazai(shuaxin)
  },
  // 获取滚动条当前位置！！！！！！！！！！！！！！
  onPageScroll: function (e) {
    //console.log(e)
    if (e.scrollTop > 200) {
      this.setData({
        yincang: false
      });
    } else {
      this.setData({
        yincang: true
      });
    }
  },
  //生命周期函数--监听页面加载！！！！！！！！！！！！
  onLoad: function (bankuai) {
    var systeminfo=wx.getSystemInfoSync()
    this.setData({
      bankuai:bankuai.bankuai,
      movehight:systeminfo.windowHeight,
      movehight2:systeminfo.windowHeight-100
    })
    this.jiazai()
  },
  //加载数据(刷新状态下，data内ss_xx数组重新赋值)！！！！！！！！！！！！
  jiazai(shuaxin){
    
    switch(this.data.bankuai){
      case "0":
        wx.setNavigationBarTitle({
          title: "供应商"
      })
      break
      case "1":
        wx.setNavigationBarTitle({
          title: "收购商"
      })
      break
      case "3":
        wx.setNavigationBarTitle({
          title: "聊天室"
      })
      break
      case "4":
        wx.setNavigationBarTitle({
          title: "求助"
      })
      break
    }
    
    var zuixinorzuire=this.data.zuixinorzuire
    if(shuaxin){
      // wx.showLoading({
      //   title: '正在刷新',
      //   mask:true
      // })
      var head=0
      //console.log("toushi0")
    }else{
      // wx.showLoading({
      //   title: '正在加载',
      //   mask:true
      // })
      var head=this.data.ss_xx.length
    }

/////////////////////
if(zuixinorzuire==0){
  //按照时间排取消时间限制，
  zuixinorzuire="time"
  var yizhou=0
}else{
  //按照热度排行
  zuixinorzuire="ss_xx.dianzannb"
  var yizhou=this.data.yizhou
}
/////////////////

    db.collection('ss').where({
      'ss_xx.bankuai':Number(this.data.bankuai),
      'ss_xx.jubao.1':db.command.lte(9),
      time:db.command.gt(yizhou)
    }).orderBy(zuixinorzuire, 'desc').skip(head).get().then(async(res)=>{
      //console.log(res)//这里已经取到了相应的数组
      if(res.data==""){
        this.setData({
          kong:true,
          jiazaizhong:false
        })
        wx.stopPullDownRefresh({})
        // wx.hideLoading({})
        wx.showToast({
          title: '没有更多了',
          icon: 'none',
          duration: 800
        })
        return
      }else if(shuaxin){
        // var ss_xx=res.data
        //var ss_xx=await this.read(res.data)
        var ss_xx=await this.love(res.data)
        //console.log("ss_xx",ss_xx)
      }else{
        var ss_xx=this.data.ss_xx
        //var xx=await this.read(res.data)
        var xx=await this.love(res.data)
        ss_xx.push.apply(ss_xx,xx)
      }
      this.setData({
        ss_xx:ss_xx,
        kong:true,
        jiazaizhong:false
      })
      if(shuaxin){
        //this.goTop()
        // wx.hideLoading({})
        wx.stopPullDownRefresh({})
        wx.showToast({
          title: '刷新成功',
          icon: 'none',
          duration: 800
        })
      }else{
        // wx.hideLoading({})
      }
    })
  },

  //生命周期函数--监听页面初次渲染完成
  onReady: function () {
    //写出一周前的时间戳
    var now=new Date().getTime()//现在的时间
    var yizhou=(now-3600*7000*24)
    this.setData({
      yizhou:yizhou
    })
  },
  //生命周期函数--监听页面显示
  onShow: function () {
    //点赞页面返回更新点赞评论浏览状态
    var index=this.data.index
    var ss_xx=this.data.ss_xx
    console.log("index::::",index)
    if(index>=0){
      ss_xx[index].ss_xx.look=app.ssinfo.looknb
      var loveinfo=app.loveinfo
      //console.log("app.loveinfo:",loveinfo)
      if(loveinfo=='true'){
        console.log("返回点赞：",index)
        ss_xx[index].love=true
        app.loveinfo=""
      }else if(loveinfo=='false'){
        console.log("返回取消点赞：",index)
        ss_xx[index].love=false
        app.loveinfo=""
      }
      ss_xx[index].ss_xx.huifunb=app.ssinfo.plnb
      ss_xx[index].ss_xx.dianzannb=app.ssinfo.lovenb
      this.setData({
        ss_xx:ss_xx,
        index:-1
      })
      
    }
  },
  //生命周期函数--监听页面隐藏
  onHide: function () {},
  //生命周期函数--监听页面卸载
  onUnload: function () {},
  //页面相关事件处理函数--监听用户下拉动作
  onPullDownRefresh: function () {},
  //页面上拉触底事件的处理函数！！！！！！！！！！！！！！！
  onReachBottom: function () {
    if(this.data.jiazaizhong==false){
      this.setData({
        jiazaizhong:true
      })
      this.jiazai()
    }
  },
  //点击跳到详情！！！！！！！！！！！！！！！！
  xiangqing(e){
    //console.log(id.currentTarget.dataset.id)
    var id=e.currentTarget.dataset.id
    var love=e.currentTarget.dataset.love
    var index=e.currentTarget.dataset.index
    wx.cloud.callFunction({
      name:"look",
      data:{
        id:id,
        type:'ss'
      }
    })
    if(love){
      love='true'
    }else{
      love='false'
    }
    wx.navigateTo({
      url:"../plate2/plate2?id="+id+"&fenxiang=false&liuyan=false&love="+love
    })
    this.setData({
      index:index
    })

  },
   // 预览图片
   previewImg: function (e) {
    //获取当前图片的下标
    //console.log(e.currentTarget.dataset.tp)
    var index = e.currentTarget.dataset.tp[0];
    //所有图片
    var imgs = e.currentTarget.dataset.tp[1];
    
    wx.previewImage({
      //当前显示图片
      current: imgs[index],
      //所有图片
      urls: imgs
    })
  },
  //返回组件Tabs的监听
  changetitle(e){
    console.log("title:",e.detail)
    var zuixinorzuire=this.data.zuixinorzuire
    if(e.detail!=zuixinorzuire){
      //暂存待机位
      var zhongjian=this.data._ss_xx
      //赋值待机位
      var _ss_xx=this.data.ss_xx
      var ss_xx=zhongjian
      this.setData({
        zuixinorzuire:e.detail,
        ss_xx:ss_xx,
        _ss_xx:_ss_xx
      })
      console.log(ss_xx)
      if(ss_xx.length==0){
        this.setData({
          kong:false
        })
        console.log("数组空，加载")
        this.jiazai()
      }
    }
  },
  //下拉动作-刷新
  onPullDownRefresh: function () {
    this.shuaxin()
    //setTimeout(function (){wx.stopPullDownRefresh({})},'2000')
  },
  //处理点赞数据
async love(e){
  console.log(e)
  var l=e.length
  for(var i=0;i<l;i++){
    var yn=e[i].ss_xx.dianzanid.indexOf(app.userInfo._id)
    console.log(yn)
    if(yn==-1){
      e[i].love=false
    }else{
      e[i].love=true
    }
  }
  return e
},
  //点赞帖子(这里得加index)
  dianzan(e){
    var _id=app.userInfo._id
    var id=e.currentTarget.dataset.id
    var index=e.currentTarget.dataset.index
    console.log(e.currentTarget.dataset)
    if(app.userInfo.userinfo.login!=true){
      wx.showModal({
        title: '提示',
        content: '登录后才可进行此操作！是否进行授权登录？',
        showCancel:true,
        confirmText:'是',
        confirmColor:'#000000',
        cancelText:'否',
        cancelColor:'#FF4D49',
        success (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.switchTab({url:"../my/wd/wd"})
          return
        } else if (res.cancel) {
        console.log('用户点击取消')
        return
        }
        }
      })
      return
    }
    wx.cloud.callFunction({
      name:"dianzan",
      data:{
        id:id,
        dzrid:_id
      }
    })
    var ss_xx=this.data.ss_xx
    if(this.data.ss_xx[index].love){
      ss_xx[index].love=false
      ss_xx[index].ss_xx.dianzannb--
    }else{
      ss_xx[index].love=true
      ss_xx[index].ss_xx.dianzannb++
    }
    this.setData({
      ss_xx:ss_xx
    })
  },
  //管理封帖子
  guanlifengtiezi(e){
    console.log(e.currentTarget.dataset)
    if(app.userInfo.userinfo.login!=true){
      return//没登录就返回
    }
    var ban=app.userInfo.ban
    if(ban==true){
      wx.showToast({
        title: '账号被封！',
        icon:'none',
        duration:7000
      })
      return
    }
    var mine=false
    var myid=app.userInfo._id
    for(var ii=0; ii<app.glids.length;ii++){
      if(app.glids[ii]==myid){
        mine=true
        break
      }
    } 
    if(mine==true){
      wx.setClipboardData({
        data: e.currentTarget.dataset.ids,
        success (res) {
          console.log("复制成功")
        }
      })
      var that=this
      wx.showModal({
        title: '提示',
        content: '确认封贴？(请勿随意封贴)',
        showCancel:true,
        confirmText:'确认封禁',
        confirmColor:'#FF4D49',
        cancelText:'取消',
        cancelColor:'#000000',
        success (res) {
          if (res.confirm) {
            var ssid=e.currentTarget.dataset.id//取到ssid
            var cc=e.currentTarget.dataset.nr
            if(cc.length==0){
              cc='分享的'+e.currentTarget.dataset.tp+'张图片'
            }
            console.log("cc:",cc)
            wx.cloud.callFunction({
              name:"jubaoplus",
              data:{
                id:ssid,
                time:new Date().getTime(),//发布时间
                ywnr:cc,//这里没有判断空文本的情况！！！
                jbrid:app.userInfo._id//举报人
              }
            })
            wx.showToast({
              title: '封了',
              icon:'none',
              duration:5000
            })
            setTimeout(that.shuaxin,2000)
          } else if (res.cancel) {console.log('用户点击取消')}
        }
      })
    }
    
  },
  //图片预加载zhi ss图预加载
  imageOnLoad2(e){
    //console.log("一次")
    var index0 = e.currentTarget.dataset.index0;
    var index1 = e.currentTarget.dataset.index1;
    //console.log("打印id",id)
    var xx='ss_xx['+index0+'].ss_xx.tp2['+index1+'].loaded'
    this.setData({
      [xx]:true
    })
  },
  //图片预加载失败
  imageOnLoadError(e){
    console.log("预加载失败：",e)
  },
})