const WXAPI = require('apifm-wxapi')
const CONFIG = require('../../config.js')
const AUTH = require('../../utils/auth')
const LEEYA_BUG = require('../../leeya_bug/leeya_bug.js')

Page({
  data: {
    banners:[],
    swiperMaxNumber: 0,
    swiperCurrent: 0
  },
  onLoad(e){
    // e.shopId = 6040 // 测试，测试完了注释掉
    this.data.shopId = e.shopId
    this.readConfigVal()
    // 补偿写法
    getApp().configLoadOK = () => {
      this.readConfigVal()
    }
  },
  onShow:function(){
    
  },
  async readConfigVal() {
    LEEYA_BUG.setOurStorage();
    const mallName = wx.getStorageSync('mallName')
    
    if (!mallName) {
      return
    }
    wx.setNavigationBarTitle({
      title: wx.getStorageSync('mallName')
    })
    let shopMod = wx.getStorageSync('shopMod')
    if (!shopMod) {
      shopMod = 0
    }
    const app_show_pic_version = wx.getStorageSync('app_show_pic_version')
    if (app_show_pic_version && app_show_pic_version == CONFIG.version) {
      if (shopMod==1) {
        this.goShopSelectPage()
      } else {
        wx.switchTab({
          url: '/pages/index/index',
        })
      }
    } else {
      // 展示启动页
      const res = await WXAPI.banners({
        type: 'app'
      })
      // 以后要用标记一下
      if (1) {
        if (shopMod==1) {
          this.goShopSelectPage()
        } else {
          wx.switchTab({
            url: '/pages/index/index',
          })
        }
      } else {
        this.setData({
          banners: res.data,
          swiperMaxNumber: res.data.length
        });
      }
    }
  },
  swiperchange: function (e) {
    //console.log(e.detail.current)
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  goToIndex: function (e) {
    let shopMod = wx.getStorageSync('shopMod')
    if (!shopMod) {
      shopMod = 0
    }
    if (getApp().globalData.isConnected) {
      wx.setStorage({
        key: 'app_show_pic_version',
        data: CONFIG.version
      })
      if (shopMod == 1) {
        this.goShopSelectPage()
      } else {
        wx.switchTab({
          url: '/pages/index/index',
        });
      }
    } else {
      wx.showToast({
        title: '当前无网络',
        icon: 'none',
      })
    }
  },
  imgClick(){
    if (this.data.swiperCurrent + 1 != this.data.swiperMaxNumber) {
      wx.showToast({
        title: '左滑进入',
        icon: 'none',
      })
    }
  },
  async goShopSelectPage() {
    if (!this.data.shopId) {
      wx.redirectTo({
        url: '/pages/shop/select'
      })
      return
    }
    // 有传入门店ID
    const res = await WXAPI.shopSubdetail(this.data.shopId)
    if (res.code != 0) {
      wx.redirectTo({
        url: '/pages/shop/select'
      })
      return
    }
    wx.setStorageSync('shopInfo', res.data.info)
    wx.setStorageSync('shopIds', res.data.info.id)
    wx.switchTab({
      url: '/pages/index/index'
    })
  }
});