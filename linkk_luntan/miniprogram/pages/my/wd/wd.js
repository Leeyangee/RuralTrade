// miniprogram/pages/wd/wd.js
const app=getApp()
const db = wx.cloud.database()
Page({
  data: {
    userphoto:"/linkk_luntan/miniprogram/images/user/user.png",
    username:"游客",
    anonymous:"",
    login:"未知",
    isVIP:false,
    wenzhang:[],
    message:[],
    message2:[],
    fenxiang:"false",
    phone:999,
    LCU:false,
    isgl:false,
    messagenumber:0,
    adload:true
  },
  /*这是用户授权登录向数据库提交 */
  GetUserInfo(e){
    var s=this;
    console.log(e)
    //此处获取手机号授权，通过云调用取回手机号
    //getPhoneNumber:fail user deny
    //getPhoneNumber:ok
    //
    if(e.detail.errMsg=="getPhoneNumber:fail user deny"){
      wx.showToast({
        title: '您取消了授权',
        icon:"none",
      })
    }else if(e.detail.errMsg=="getPhoneNumber:ok"){
      //这是授权了：
      console.log(e.detail.cloudID)
      wx.cloud.callFunction({
        name:'getphone',
        data:{
          id:e.detail.cloudID
        }
      }).then((res)=>{
        //console.log("取回：",res)
        if(res.errMsg=="cloud.callFunction:ok"){
          var phone=res.result.list[0].data.phoneNumber
          console.log(">>>",phone,"<<<")
          s.setData({
            phone:phone
          })
          
        }else{
          wx.showToast({
            title: '获取号码错误',
            icon:"none",
          })
        }
      })
    }else{
      wx.showToast({
        title: '授权手机错误',
        icon:"none",
      })
    }
    return;
  },
  //检查是否管理员
  isgl(e){
    var mine=false
    var myid=app.userInfo._id
    for(var ii=0; ii<e.length;ii++){
      if(e[ii]==myid){
        mine=true
        break
      }
    }
    this.setData({
      isgl:mine
    })
  },
  //获取(管理id)！！！！！！！！！！！！！！
  getgl(){
    if(app.system1==""||app.system1==undefined){
      //获取写入
      db.collection('system').where({'_id':'system01'})
      .get().then((res)=>{
        //console.log(res)
        app.system1=res.data[0]
        this.setData({
          glids:res.data[0].system.glids
        })
        app.glids=res.data[0].system.glids
        this.isgl(res.data[0].system.glids)
      })
    }else{
      this.setData({
        glids:app.system1.system.glids
      })
      app.glids=app.system1.system.glids
      this.isgl(app.system1.system.glids)
    }
  },
  //获取头像及认证
  getather(){
    wx.getUserProfile({
      desc: '用于获取头像与昵称', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (a) => {
        let userInfo = a.userInfo;
        console.log('DDuanfaxiang');
        console.log(a)
        if(userInfo){
          wx.showLoading({
            title: '登陆中',
          })
          db.collection('users').add({
            data:{
              logintime:new Date().getTime(),
              ban:false,
              msgnb:[0,0], 
              wenzhang:[],
              message:[],
              pinglunguode:[],
              weiguinb:0,
              phone:this.data.phone,
              userinfo:{
                userphoto:userInfo.avatarUrl,
                username:userInfo.nickName,
                anonymous:"",
                isVIP:false,
                login:true,
                LCU:false
              },
            }
          }).then((res)=>{
            this.jianting(res._id)
            app.jianting=true
            app.userInfo._id=res.id
            db.collection('users').doc(res._id).get().then((res)=>{
              app.userInfo=Object.assign(app.userInfo,res.data);
              //console.log(res.data);
              wx.hideLoading()
              this.setData({
                userphoto:app.userInfo.userinfo.userphoto,
                username:app.userInfo.userinfo.username,
                anonymous:app.userInfo.userinfo.anonymous,
                isVIP:app.userInfo.userinfo.isVIP,
                login:true,
                wenzhang:app.userInfo.wenzhang,
                message:app.userInfo.message,
              })
              wx.showToast({
                title: '登陆成功！',
              })
              if(app.fenxiang=="true"){
                app.fenxiang=="false"
                wx.navigateTo({
                  url:"/pages/plate2/plate2?id="+app.fxssid+"&fenxiang=false"
                })
              }
            })
          })
        }
      }
    })
  },
   /*未登录下的重试 */
  weidengluchongshi(){
    let logined=app.userInfo.userinfo.login;
    //console.log(app.userInfo);
    if(logined!=true){
      /*若不是登录状态调用云函数登录*/ 
      wx.showLoading({
        title: '尝试登录',
      })
      wx.cloud.callFunction({
        name:'login',
        data:{}
      }).then((res)=>{
        //console.log(res.result.openid)
        db.collection("users").where({_openid:res.result.openid}).get().then((res)=>{
          //console.log(res);
          app.userInfo=Object.assign(app.userInfo,res.data[0]);
          wx.hideLoading()
          if(app.userInfo.userinfo.login==true){
            if(!app.jianting){
              //开启监听
              this.jianting(app.userInfo._id)
              app.jianting=true
            }
            /*如果有登录信息则加载*/ 
            this.getgl()
            this.checkred()//刷新
            this.setData({
              userphoto:app.userInfo.userinfo.userphoto,
              username:app.userInfo.userinfo.username,
              anonymous:app.userInfo.userinfo.anonymous,
              isVIP:app.userInfo.userinfo.isVIP,
              login:app.userInfo.userinfo.login,
              wenzhang:app.userInfo.wenzhang,
              message:app.userInfo.message,
            })
            this.logintime()
            if(app.fenxiang=="true"){
              app.fenxiang=="false"
              wx.navigateTo({
                url:"/pages/plate2/plate2?id="+app.fxssid+"&fenxiang=false"
              })
            }
          }else{
            this.setData({
              login:false
            })
            app.userInfo.userinfo=Object.assign(app.userInfo.userinfo,{login:false})
            /*付给app下的登录状态为false*/
            wx.showToast({
              title: '还未授权登录',
              icon: 'none',
              duration: 2000,
            })
          }  
        })
      });
    }else{
      if(!app.jianting){
        //开启监听
        this.jianting(app.userInfo._id)
        app.jianting=true
      }
      this.getgl()
      this.checkred()//刷新
    }
  },
  //查看我的头像
  chakantouxiang(){
    
    var url=app.userInfo.userinfo.userphoto
    console.log(url,"url")
    wx.previewImage({
      urls: [url],
    })
  },
  /**生命周期函数--监听页面加载*/
  onLoad: function () {
    this.weidengluchongshi()
  },
  /* 生命周期函数--监听页面显示*/
  onShow: function () {
    this.checkred()//刷新
  },
  //消息监听
  jianting(_id){
    console.log("已经登录，开启监听user")
    // var _id=app.userInfo._id
    var that=this
    app.jianting=true
    this.watcher = db.collection('users').doc(_id).watch({
      onChange: function(e) {
        console.log('监听user数据变化2：', e.docs[0])
        app.userInfo=e.docs[0]
        var message=e.docs[0].message//message数组
        app.message=message
        that.jiantingchuli(message)
      },
      onError: function(err) {
        console.error('监听出现问题！', err)
      }
    })
  },
   /*
  下面存放监听变化代码,进行红点更新
  */
  jiantingchuli(e){
    this.checkred()
    //console.log("监听处理：",e)
    // 1.未读的数一直是数组成员数，0消息则移除红点
    var weidu=e.length//未读消息总数
    //console.log("监听处理1：")
    if(weidu!=0){
      //有未读，设置红点得看页面层级
      var ceng=getCurrentPages()
      if(ceng.length==1){
        //只有tabar页面才可以设置红点
        wx.setTabBarBadge({
          index: 2,
          text: weidu.toString()
        })
        app.hongdian=true
      }
      //console.log("监听处理3：有消息清空红点")
      //2.新的消息震动提醒
      var message=this.data.message2//本地已收到message数组、每条新的消息都纪录进去
      //var newmessage=0
      for(var i=0;i<weidu;i++){
        var id=e[i].id
        var yn=JSON.stringify(message).includes(id)
        if(!yn){
          //说明是新的消息,给他震动提醒
          //newmessage++
          message.push(e[i])
          this.setData({
            message2:message
          })
          //震动
          wx.vibrateLong({
            type:'heavy'
          })
          //console.log("监听处理3：新消息震动")
        }
      }
      
    }else{
      //console.log("监听处理3：无消息清空红点")
      var ceng=getCurrentPages()
      if(ceng.length==1&&app.hongdian){
        //仅可在tabar页面设置红
        wx.removeTabBarBadge({index: 2})
      }
    }
    
  },
  /** 页面相关事件处理函数--监听用户下拉动作*/
  onPullDownRefresh: function () {
    var _id=app.userInfo._id
    db.collection('users').doc(_id).get().then((res)=>{
      console.log("取到信息",res.data)
      this.setData({
        userphoto:res.data.userinfo.userphoto,
        username:res.data.userinfo.username,
        anonymous:res.data.userinfo.anonymous,
        isVIP:res.data.userinfo.isVIP,
        login:res.data.userinfo.login,
        wenzhang:res.data.wenzhang,
        message:res.data.message,
      })
      app.userInfo=res.data
      wx.stopPullDownRefresh({})
      this.checkred()
      wx.showToast({
        title: '刷新成功',
        icon:'none',
        duration:800
      })
    })
  },
  //刷新消息红点(用于更新非tabar页面未设置的红点)
  checkred(){
    var weidu=app.message.length
    if(app.userInfo.userinfo.LCU==true){
      var LCU=true
    }else{
      var LCU=false
    }
    this.setData({
      userphoto:app.userInfo.userinfo.userphoto,
      username:app.userInfo.userinfo.username,
      anonymous:app.userInfo.userinfo.anonymous,
      isVIP:app.userInfo.userinfo.isVIP,
      login:app.userInfo.userinfo.login,
      wenzhang:app.userInfo.wenzhang,
      LCU:LCU
    })
    if(weidu!=0){
      //有未读
      wx.setTabBarBadge({
        index: 2,
        text: weidu.toString()
      })
      app.hongdian=true
      this.setData({
        messagenumber:weidu.toString()
      })
    }else{
      if(app.hongdian){//真的有内容时才移除
        wx.removeTabBarBadge({index: 2})
      }
      this.setData({
        messagenumber:0
      })
    }
  },
  //上传此次登陆的时间
  logintime(){
    var now=new Date().getTime()
    db.collection('users').doc(app.userInfo._id).update({
      data:{
        logintime:now
      }
    })
  },
  //广告加载失败
  adError(){
    this.setData({
      adload:false
    })
  },
})