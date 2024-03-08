const WXAPI = require('apifm-wxapi')
const CONFIG = require('../config.js')
const AUTH = require('../utils/auth')
const { objectMapping} = require('./lib.js')
const { objectCopy,example_theirGood,example_theirCategorie,example_theirGoodPic,example_theirShop,getOurMiniProgramData} = require('./lib.js')
const testdata = require('./OurApi.js')
const TEST = require('./OurApi.js')

import user from './models/userModel'
import showHelper from './helpers/showHelper'
import test from './models/test'
const URL = 'https://server.ruraltrade.fun'
//将乡村振兴数据 格式化为 原程序数
//方法名格式: setOur***, getOur***
module.exports = {

  //用户类函数
  //written by leeya_bug
  //2023-07-29
  setOurStorage:function() {                            //设置全缓存
    wx.setStorage({key: "mallName",data: "乡村振兴"})
  },
  startUser:function(){
      wx.login({
        success:function(res){
          console.log('成功获得code: ' + res.code);
          let data = getOurMiniProgramData();
          if(!user.checkValid()){
            wx.request({
              url: `https://api.weixin.qq.com/sns/jscode2session?appid=${data.appid}&secret=${data.secret}&js_code=${res.code}&grant_type=authorization_code`,
              success:(res) => {
                console.log(res.data)
                if(res.data.openid == undefined || res.data.openid == null || res.data.openid == "") {
                  res.data.openid = "NotSetOpenid3";
                }
                wx.setStorage({
                  key: "openId",
                  data: res.data.openid
                })
                console.log('获得openid成功: ' + res.data.openid);
                user.init();
              }
            })
          }
        }
      })
  },

  //功能类函数
  //written by leeya_bug
  //2023-07-29

  getOurGoodsByCategorieId:function(categorieId){       //由分类ID -> 获得商品                  (分类栏)
    var data = testdata.apiGetOurGoodsByCategorieId(categorieId);
    var example_good = objectCopy(example_theirGood);
    var goods = {
      "code": 0,
      "data": {
        "result": [],
        "totalPage": 1,
        "totalRow": data.length
      },
      "msg": "success"
    }
    goods.data.result = objectMapping(example_good,data);
    return goods;
  },
  getOurGoodsListByUserId:function(userId){             //由用户ID -> 获得商品列表            (首页栏 -> 商品列表)
    var data = testdata.apiGetOurGoodsListByUserId(userId);
    var example_good = objectCopy(example_theirGood);
    var goodsList = objectMapping(example_good, data);
    return goodsList;
  },
  getOurBaoGoodsListByUserId:function(userId){          //由用户ID -> 获得爆品商品            (首页栏 -> 爆品推荐)
    var data = testdata.apiGetOurBaoGoodsListByUserId(userId);
    var example_good = objectCopy(example_theirGood);
    var baoGoods = objectMapping(example_good,data);
    return baoGoods;
  },
  /*待完成*/getOurGoodsDetailsBy:function(userId,goodsId){        //由用户ID + 商品ID -> 获得商品详情   (商品详情)
    var data = testdata.apiGetOurGoodsDetailsBy(userId,goodsId);
    var example_good = objectCopy(example_theirGood);
    var example_goodPic = objectCopy(example_theirGoodPic);
    var goods = {
      "code": 0,
      "data": {
        basicInfo: objectMapping(example_good, [data.good])[0],
        extJson: {},
        extJson2: {},
        content: data.content,
        pics: objectMapping(example_goodPic, data.pics),
        properties: [
          {
            id: 870,
            name: "测试尺码",
            dateAdd: "1970-01-01 00:00:01",
            childsCurGoods: [
              {
                id: 1582,
                name: "绿色橘子",
                propertyId: 870,
              },{
                id: 1583,
                name: "橙色橘子",
                propertyId: 870,
              },
            ]
          }
        ],
        skuList: [
          {
            fxType: 2,
            goodsId: data.good.id,
            id: 6315996,
            originalPrice: 12.96,
            pingtuanPrice: 0,
            price: 9.0,
            propertyChildIds: "870:1582",
            propertyChildNames: "测试尺码:绿色橘子",
            score: 0,
            stores: 59863,
          },{
            fxType: 2,
            goodsId: data.good.id,
            id: 6315997,
            originalPrice: 12.96,
            pingtuanPrice: 1,
            price: 9.0,
            propertyChildIds: "870:1583",
            propertyChildNames: "测试尺码:橙色橘子",
            score: 0,
            stores: 59863,
          }
        ]
        
      },
      "msg": "success"
    }
    return goods;
  },
  /*待完成*/getOurShopDetailsBy:function(userId,shopId){                 //由店铺ID -> 获得店铺详情            (商户详情)
    var goods = {
      "code": 0,
      "data": {
        extJson: {},
        info:example_theirShop
      },
      "msg": "success"
    }
    return goods;
  },
  getOurGoodsDynamic:function(userId){                  //获得动态展示商品                    (首页栏 -> xxx 购买了 xxx)
    var data = testdata.apiGetOurGoodsDynamic(userId);
    return {
      code:0,
      "data": data
    };
  },
  getOurBanners:function(userId,type){                  //获得首页轮播图                      (首页栏 -> 轮播图)
    var data = testdata.apiGetOurBanners(userId,type)
    return {
      code: 0,
      data: data
    }
  },




















    //没用的函数，继续放在这里是为了兼容性
    getOurOpenId:function(){                              //获得用户openId
      var data = wx.getStorageSync("openId")
      return data == undefined || data == null || data == "" ? "-1" : data
    },
    getOurAvatarUrl:function(){                           //获得用户微信头像url
      var data = wx.getStorageSync("avatarUrl")
      return data == undefined || data == null || data == "" ? "-1" : data
    },
    getOurNickName:function(){                            //获得用户微信昵称
      var data = wx.getStorageSync("nickName")
      return data == undefined || data == null || data == "" ? "-1" : data
    },
}
