const WXAPI = require('apifm-wxapi')
const CONFIG = require('config.js')
const AUTH = require('utils/auth')
App({
  onLaunch: function() {
    const subDomain = wx.getExtConfigSync().subDomain
    if (subDomain) {
      WXAPI.init(subDomain)
    } else {
      WXAPI.init(CONFIG.subDomain)
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: 'linkk-4gfa30p2a0709884',
        traceUser: true,
      })
      WXAPI.setMerchantId(CONFIG.merchantId)
    }
    //linkk_luntan
    this.kbs={
      cookies:"",
      money:"0.00"
    }
    this.system1=""
    this.hongdian=false//标记当前tabar上是否有红点、文本
    this.shuaxin=false
    this.fenxiang="false"
    this.fxssid=""
    this.jianting=false
    this.glids=["9999"]
    this.message=[]
    this.globalData = {}
    this.systeminfo=""
    this.loveinfo=""
    this.ssinfo={
      lovenb:"",
      plnb:"",
      looknb:""
    }
    this.userInfo={
      ban:false,
      msgnb:[0,0],
      _openid:"",
      _id:"",
      wenzhang:[],
      message:[],
      pinglunguode:[],
      userinfo:{
        userphoto:"/linkk_luntan/miniprogram/images/user/user.png",
        username:"匿名用户",
        anonymous:"",
        isVIP:false,
        login:"未知",
      },
      
    }
    const that = this;
    // 检测新版本
    const updateManager = wx.getUpdateManager()
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success(res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })
    /**
     * 初次加载判断网络情况
     * 无网络状态下根据实际情况进行调整
     */
    wx.getNetworkType({
      success(res) {
        const networkType = res.networkType
        if (networkType === 'none') {
          that.globalData.isConnected = false
          wx.showToast({
            title: '当前无网络',
            icon: 'loading',
            duration: 2000
          })
        }
      }
    });
    /**
     * 监听网络状态变化
     * 可根据业务需求进行调整
     */
    wx.onNetworkStatusChange(function(res) {
      if (!res.isConnected) {
        that.globalData.isConnected = false
        wx.showToast({
          title: '网络已断开',
          icon: 'loading',
          duration: 2000
        })
      } else {
        that.globalData.isConnected = true
        wx.hideToast()
      }
    })
    WXAPI.queryConfigBatch('mallName,WITHDRAW_MIN,ALLOW_SELF_COLLECTION,order_hx_uids,subscribe_ids,share_profile,adminUserIds,goodsDetailSkuShowType,shopMod,needIdCheck,balance_pay_pwd,shipping_address_gps,shipping_address_region_level,shopping_cart_vop_open,cps_open,recycle_open,categoryMod,hide_reputation,show_seller_number,show_goods_echarts,show_buy_dynamic,goods_search_show_type,show_3_seller,show_quan_exchange_score,show_score_exchange_growth,show_score_sign,fx_subscribe_ids,share_pic,orderPeriod_open,order_pay_user_balance,wxpay_api_url,sphpay_open,fx_type').then(res => {
      if (res.code == 0) {
        res.data.forEach(config => {
          wx.setStorageSync(config.key, config.value)
        })
        if (this.configLoadOK) {
          this.configLoadOK()
        }
        // wx.setStorageSync('shopMod', '1') // 测试用，不要取消注释
      }
    })
    // ---------------检测navbar高度
    let menuButtonObject = wx.getMenuButtonBoundingClientRect();
    console.log("小程序胶囊信息",menuButtonObject)
    wx.getSystemInfo({
      success: res => {
        let statusBarHeight = res.statusBarHeight,
          navTop = menuButtonObject.top,//胶囊按钮与顶部的距离
          navHeight = statusBarHeight + menuButtonObject.height + (menuButtonObject.top - statusBarHeight)*2;//导航高度
        this.globalData.navHeight = navHeight;
        this.globalData.navTop = navTop;
        this.globalData.windowHeight = res.windowHeight;
        this.globalData.menuButtonObject = menuButtonObject;
        console.log("navHeight",navHeight);
      },
      fail(err) {
        console.log(err);
      }
    })
  },

  onShow (e) {
    // 保存邀请人
    if (e && e.query && e.query.inviter_id) {
      wx.setStorageSync('referrer', e.query.inviter_id)
      if (e.shareTicket) {
        wx.getShareInfo({
          shareTicket: e.shareTicket,
          success: res => {
            wx.login({
              success(loginRes) {
                if (loginRes.code) {
                  WXAPI.shareGroupGetScore(
                    loginRes.code,
                    e.query.inviter_id,
                    res.encryptedData,
                    res.iv
                  ).then(_res => {
                    console.log(_res)
                  }).catch(err => {
                    console.error(err)
                  })
                } else {
                  console.error('登录失败！' + loginRes.errMsg)
                }
              }
            })
          }
        })
      }
    }
    
    // 自动登录
    AUTH.checkHasLogined().then(isLogined => {
      if (!isLogined) {
        AUTH.authorize().then( aaa => {
          AUTH.bindSeller()
        })
      } else {
        AUTH.bindSeller()
      }
    })
  },
  checkUpdate: function() {
    var n = wx.getUpdateManager();
    n.onCheckForUpdate(function(t) {
      console.log("检查更新：",t)
        t.hasUpdate && (n.onUpdateReady(function() {
            wx.showModal({
                title: "更新提示",
                content: "新版本已经准备好，请重启应用",
                showCancel: !1,
                confirmColor: "#00cc11",
                success: function(t) {
                    t.confirm && n.applyUpdate();
                }
            });
        }), n.onUpdateFailed(function(n) {
            wx.showModal({
                title: "已经有新版本了哟~",
                content: "自动更新失败，请重启试试~"
            });
        }));
    });
  },
  globalData: {
    isConnected: true,
    sdkAppID: CONFIG.sdkAppID
  }
})