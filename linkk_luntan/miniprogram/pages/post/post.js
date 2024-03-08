// miniprogram/pages/post/post.js
var util = require('../../utils/util.js');
const app=getApp()
const db = wx.cloud.database()
Page({
  data: {
    niming:false,
    imgs: [],
    Imgs:[],
    fileID:[],
    wbnr:"",
    index:[0,0],
    heji:[["供应商","收购商","聊天室","求助"],["分享","售卖","订单需求"]],
    sy:"0/299",
    Cheight:800,
    Cwidth:800,
    pixe:0,
    imginfo:{}
  },
  kaishixuanze(e){
    //console.log("第几列",e.detail.column)
    var data={
      index:this.data.index,
      heji:this.data.heji
    }
    switch(e.detail.column){
      case 0:
        switch(e.detail.value){
          case 0:
            data.index=[0,0];
            data.heji[1]=["分享","售卖","订单需求"];
            break;
          case 1:
            data.index=[1,0];
            data.heji[1]=["经验分享","订单需求","售卖"];
            break;
          case 2:
            data.index=[2,0];
            data.heji[1]=["分享"];
            break;
          case 3:
            data.index=[3,0];
            data.heji[1]=["求助"];
            break;
        }
      case 1:
        break;
    }
    this.setData(data)
    //console.log(data)
  },
  xuanzewanbi(e){
    //console.log(e.detail.value)
    this.setData({ index:e.detail.value })
  },
  //文本内容合法性检测
  async checkStr(text) {
    try {
        var res = await wx.cloud.callFunction({
            name: 'checkStr',
            data: {
            text:text,
            }
        });
        //console.log(res.result.errCode);
        if (res.result.errCode == 0)
            return true;
            return false;
    } catch (err) {
        console.log(err);
        return false;
    }
  },
  //图片内容合法性检测
  async checkImg(media) {
    console.log("要检测的buffer",media)
    try {
        var res = await wx.cloud.callFunction({
          name: 'checkImg',
          data: {media}
        });
        console.log("云检测结果",res.result);
        return res.result.errCode
    } catch (err) {
        console.log("云检测错误",err);
        return 1;
    }
  },
  //图片取buffer
  async qubuffer(media){
    //console.log("图片路径",media)
    return new Promise((resolve,reject)=>{
      wx.getFileSystemManager().readFile({
        filePath: media,
        success: res => {
          //console.log("刚转换完",res.data)
          resolve(res.data)
        }
      })
    })
  },
  //图片压缩
  async yasuo(media,number,max){
    //media=media.replace("wxfile","https")
    console.log("要压缩的地址",media)
    var that=this
    return new Promise((resolve)=>{
      //resolve(es.tempFilePath)
      wx.getImageInfo({
        src: media,
        success (res) {
          console.log("图片宽高：",res.width,res.height)
          that.setData({
            imginfo:{
              width:res.width,
              height:res.height
            }
          })
          //---------利用canvas压缩图片--------------
          var canvasWidth = res.width //图片原始长宽
          var canvasHeight = res.height
          //不管长或者宽，限制最长的边等于max
          if(canvasWidth>canvasHeight){
            canvasHeight=Math.trunc(max*canvasHeight/canvasWidth)
            canvasWidth =max
          }else{
            canvasWidth=Math.trunc(max*canvasWidth/canvasHeight)
            canvasHeight =max
          }
          console.log("画布宽高：",canvasWidth,canvasHeight)
          that.setData({
            Cwidth: canvasWidth,
            Cheight: canvasHeight
          })
          //----------绘制图形并取出图片路径--------------
          var ctx = wx.createCanvasContext('huabu',that)
          ctx.clearRect(0, 0,  canvasWidth, canvasHeight),
          ctx.drawImage(media, 0, 0, canvasWidth, canvasHeight)
          ctx.draw(false, setTimeout(function(){
            wx.canvasToTempFilePath({
              canvasId: 'huabu',
              destWidth:canvasWidth,
              destHeight:canvasHeight,
              fileType:'jpg',
              quality: number,
              success: function (res) {
                console.log("压缩成功",res.tempFilePath)//最终图片路径
                resolve(res.tempFilePath)
              },
              fail: function (res) {
                console.log("压缩失败：",res.errMsg)
                resolve(-1)
              }
            })
          },300))    //留一定的时间绘制canvas
        }
      })
    })
  },
  /*提交表单 */
  async tijiao(e){
    wx.getSystemInfo({
      success: (result) => {
        console.log(result)
        this.setData({
          pixe:result.pixelRatio
        })
      },
    })
    console.log(e.detail.value)
    //若未登录，直接到登录页面
    if(app.userInfo.userinfo.login!=true){
      wx.switchTab({
        url: '/pages/my/wd/wd'
      })
      return
    }
    //检测账号是否被封
    var ban=app.userInfo.ban
    if(ban==true){
      wx.showToast({
        title: '账号被封！',
        icon:'none',
        duration:7000
      })
      return
    }
      //console.log(e.detail.value)//bankuai/zilei/niming2匿名内容/niming1是否匿名/wbnr/
      var biaodan=e.detail.value//整个表单数据
      var text=biaodan.wbnr//临时text。文本内容
      if(text.length==0 && this.data.imgs.length==0){
        wx.showToast({
          title: '再多说点吧！',
          icon: 'none',
          duration: 800,
        })
        return//这个return返回，停止继续执行
      }
      //console.log("传过来：",e)
      var bankuai="供应商"
      if(biaodan.fenlei!=null){
        switch(biaodan.fenlei[0]){
          case 0:
            //console.log("其他分类")
            bankuai="供应商"
            break;
          case 1:
            //console.log("供应商")
            bankuai="收购商"
            break;
          case 2:
            //console.log("收购商")
            bankuai="聊天室"
            break;
          case 3:
            //console.log("聊天室")
            bankuai="求助"
            break;
        }
      }
      var _this=this
      wx.showModal({
        title: '提示',
        content: '您即将发送此帖到“'+bankuai+'”板块？',
        showCancel:true,
        confirmText:'是',
        confirmColor:'#000000',
        cancelText:'否',
        cancelColor:'#000000',
        success (res) {
        if (res.confirm) {
          //console.log('用户点击确定')
          _this.tijiao2(biaodan)
          return true
        } else if (res.cancel) {
          //console.log('用户点击取消')
          return false
        }
        }
      })
    
  },
  //（进行提交处理）
  async tijiao2(biaodan){
    console.log("表单：",biaodan)
    var text=biaodan.wbnr//临时text。文本内容
    wx.showLoading({
      title: '准备发送...',
      mask:true
    })

    if(text.length>0){
      var checkOk = await this.checkStr(text);
    }else{
      var checkOk = true
    }
    //开始审核文本
    if(!checkOk){ 
      wx.hideLoading({}),//审核不通过隐藏
      wx.showToast({
        title: '文本含有违法违规内容',
        icon: 'none',
        duration: 5000,
      })
      return//这个return返回，停止继续执行
    }

    var img=this.data.imgs//图片路径赋值给变量img
    var that=this//用that表当前外部对象
    //开始图片审核，图片数量＞0时
    that.setData({
      Imgs:[]
    })
    if(img.length!=0){
      var imgok=await that.imgcheck()
      if(!imgok){
        wx.hideLoading({}),//审核不通过隐藏
        wx.showToast({
          title: '图片检测出现问题',
          icon: 'none',
          duration: 2000,
        })
        //console.log("图片违法")
        return//这个return返回，停止继续执行
      }
    }
    
    //判断 默认选择器分类[0,0]
    biaodan.fenlei=biaodan.fenlei===null?[0,0]:biaodan.fenlei
    console.log("楼主id::::",app.userInfo._id)
    var ss_xx={
      bankuai:biaodan.fenlei[0],
      zilei:biaodan.fenlei[1],
      firsttime:new Date().getTime(),//发布时间
      username:app.userInfo.userinfo.username,//签名
      userphoto:app.userInfo.userinfo.userphoto,//头像
      niming1:biaodan.niming1,//是否匿名
      nr:biaodan.wbnr,//文本
      tp:[],//图片数组！！！！！！！！！数组缺少图片
      huifunr:[],//别人的评论
      huifunb:0,//评论总数
      dianzanid:[],//别人的评论点赞
      dianzannb:0,//点赞数
      jubao:[[],0],//被举报的id合集，前面添加id，加完云函数记个数
      look:0,//记录浏览量 
      lzid:app.userInfo._id//楼主所在主体
    }
    //console.log(ss_xx)
    //上传图片
    var Imgs=that.data.Imgs
    console.log("imgs:",Imgs)
    if(Imgs.length!=0){
      wx.showLoading({
        title: '就快好了...',
        mask:true
      })
      var fileID=[]
      var js=0
      for(var i=0;i<Imgs.length;i++){
        //取图片的大小进行判断
        var time=new Date().getTime()
        //直接拼接出云路径
        fileID[i]="cloud://linkk-4gfa30p2a0709884.6c69-linkk-4gfa30p2a0709884-1319171252/ss_img/"+time.toString()+".jpg"
        //cloud://cloud1-5gsoed6vd0569551.636c-cloud1-5gsoed6vd0569551-1319171252/ss_img/1691648166962.jpg
        //cloud://cloud1-5gsoed6vd0569551.636c-cloud1-5gsoed6vd0569551-1319171252/ss_img/da3d06de64cf0cf80000493829dcb896-1691648166962-0.jpg
        //console.log("的点点滴滴",fileID[i])
        //console.log(time)//取当前时间chuo
        wx.cloud.uploadFile({
          cloudPath: "ss_img/"+time+".jpg", // 上传至云端的路径
          filePath: Imgs[i], // 小程序临时文件路径
          success: res => {
            // 返回文件 ID
            js++//记录成功获取云储存路径的图片数量
            console.log('上传结果：',res)
            if(js==Imgs.length){
              ss_xx.tp=fileID//！！！说说信息中的图片写入完毕
              console.log("说说图片",fileID)
              //带图发帖！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！
              that.post(ss_xx)
            }
          },
           fail: console.log("上传是不知为啥有错")
        })
      }
    }else{
      //纯文本发帖！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！
      that.post(ss_xx)
    }
    
  },
  //图片压缩及审核
  async imgcheck(){
    //审核图片
    try {
      var imgs=this.data.imgs
      var tp=[];
      var tp2=[];
      var that=this
      //--------先进行整体压缩
      wx.showLoading({
        title: '图片压缩...',
        mask:true
      })
      for(var i=0;i<imgs.length;i++){
        //进行图片压缩处理
        tp[i]=await that.yasuo(imgs[i],0.92,2000)
        if(tp[i]==-1){
          return false;//中间有图片压缩失败就返回错误
        }
      }
      console.log("ischeck?:",app.system1.system.tpcheck)
      if(app.system1.system.tpcheck){
        //need
        //--------经过上面过程已经压缩完毕，再整体取buffer检测
        var buffer="";
        wx.showLoading({
          title: '图片审核...',
          mask:true
        })
        for(var i=0;i<imgs.length;i++){
          //进行图片压缩处理
          tp2[i]=await that.yasuo(imgs[i],0.5,400)
          if(tp2[i]==-1){
            return false;//中间有图片压缩失败就返回错误
          }
        }
        for(var i=0;i<imgs.length;i++){
          buffer= await that.qubuffer(tp2[i])
          var checkOk = await that.checkImg(buffer)//开始审核图片
          if(checkOk==87014||checkOk==-604102){ 
            //图片检测出现问题
            return false
          }
        }
      }
      that.setData({
        Imgs:tp
      })
      return true
      //--------返回结果
    }catch (err) {
      console.log("imgcheck错误",err);
      return false;
    }
  },
  //实时获取input,写到data中储存为wbnr
  wbnr(e){
    //console.log(e.detail.value)
    var s=e.detail.value.length
    var y=s+"/"+299
    // console.log(y) 
    this.setData({
      wbnr:e.detail.value,
      sy:y
    })
  },
  //真正的上传说说
  post(ss_xx){
    
    //loading发布中
    wx.showLoading({
      title: '即将完成...',
      mask:true
    })
    //console.log("传过来",ss_xx)
    //var sjk=ss_xx.bankuai.toString()+"0"//@@@转成字符串@@@
    //添加说说记录
    db.collection('ss').add({
      data:{
        ss_xx,
        time:ss_xx.firsttime
      }
    }).then((res)=>{
       //console.log(res._id)//拿到id
      //console.log(ss_xx)

      //ss发送成功了
      //设置app跳转到首页后要刷新
      app.shuaxin=true
      wx.hideLoading({})//发布成功隐藏
      //app跳转到首页
      wx.switchTab({url:'/pages/index/index'})
      var id=res._id
      var jl={
        "time":ss_xx.firsttime,
        "nr":ss_xx.nr,
        "id":id,
        "weigui":false
      }
      if(jl.nr==''){
        jl.nr='分享了'+ss_xx.tp.length+'张图片'
      }
      
      var wenzhang=[]
      //获取之前的文章加到wenzhang
      db.collection("users").doc(app.userInfo._id).get().then((res)=>{
        wenzhang=res.data.wenzhang
        //console.log("取回的",wenzhang)
        wenzhang.push(jl)
        //记录到自己users里
        db.collection("users").doc(app.userInfo._id).update({
          data:{
            wenzhang:wenzhang
          }
        }).then((res)=>{
         
          //进行全局数据我的本地储存
          app.userInfo.wenzhang=wenzhang
          this.setData({
            imgs:[],
            wbnr:""
          })
          
        })
      })
    })
  },
  // 添加图片
  chooseImg: function (e) {
    var that = this;
    var imgs = this.data.imgs;
    var ktj=9-imgs.length
    //console.log(ktj)
    if (ktj<=0) {
      wx.showToast({
        title: '最多添加九张',
        icon: 'none',
        duration: 2000,
      })
    }else{
      wx.chooseImage({
        // count: 1, // 默认9
        sizeType: ['original'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          var tempFilePaths = res.tempFilePaths;
          //console.log(tempFilePaths)
          var imgs = that.data.imgs;
          for (var i = 0; i < tempFilePaths.length; i++) {
            if (imgs.length >= 9) {
              that.setData({
                imgs: imgs
              });
              return false;
            } else {
              imgs.push(tempFilePaths[i]);
              //console.log(imgs)
            }
          }
          //imgs.push(tempFilePaths[0]);//往数组末尾添加元素
          that.setData({
            imgs: imgs
          });
        }
      });
    }
  },
  // 删除图片
  deleteImg: function (e) {
    var imgs = this.data.imgs;
    var index = e.currentTarget.dataset.index;
    imgs.splice(index, 1);
    this.setData({
      imgs: imgs
    });
  },
  // 预览图片
  previewImg: function (e) {
    //获取当前图片的下标
    var index = e.currentTarget.dataset.index;
    //所有图片
    var imgs = this.data.imgs;
    wx.previewImage({
      //当前显示图片
      current: imgs[index],
      //所有图片
      urls: imgs
    })
  },
  onReady: function () {
  },
  /*生命周期函数--监听页面加载*/
  onLoad: function (options) {

  },
  /*** 生命周期函数--监听页面初次渲染完成 */
  onReady: function () {

  },
  /** 生命周期函数--监听页面显示*/
  onShow: function () {
    
  },
})