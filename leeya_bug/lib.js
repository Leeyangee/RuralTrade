const WXAPI = require('apifm-wxapi')
const CONFIG = require('../config.js')
const AUTH = require('../utils/auth')

module.exports = {
  objectCopy: function(object){return JSON.parse(JSON.stringify(object))},
  objectMapping: function(example, object) {
    var field = [];
    for(var i = 0;i < object.length;i++){
      field.push(JSON.parse(JSON.stringify(example)));
      for(var key in object[i]){
        field[i][key] = object[i][key]
      }
    }
    return field;
  },
  getOurMiniProgramData: function(){
    return {
      appid:"wx2e9e01d34789ff54",
      secret:"fa0b7e23684e7c27a2abd37c9aa175af"
    }
  },
  example_theirGood: {
    "afterSale": "0,1,2",
    "barCode": "6932719822120",
    "brandId": 4,
    "categoryId": 1875,//分类Id
    "characteristic": "测试描述",//商品描述
    "commission": 0.00,
    "commissionSettleType": 0,
    "commissionType": 0,
    "commissionUserType": 0,
    "dateAdd": "1970-01-01",
    "dateEnd": "1970-01-01",
    "dateStart": "1970-01-01",
    "dateUpdate": "1970-01-01",
    "discountPrice": 0.00,
    "expiryMillis": 0,
    "fxType": 2,
    "gotScore": 0,
    "gotScoreType": 0,
    "hasAddition": false,
    "hasTourJourney": false,
    "hidden": 0,
    "id": 235853,
    "kanjia": false,
    "kanjiaPrice": 0.00,
    "limitation": true,
    "logisticsId": 386,
    "maxCoupons": 1,
    "miaosha": true,
    "minBuyNumber": 1,//最低出售数量
    "minPrice": 9.90,//最低价格(展示出的价格)
    "minScore": 1,
    "name": "测试商品",//名称
    "numberFav": 103,
    "numberGoodReputation": 40,
    "numberOrders": 47, 
    "numberReputation": 12,
    "numberSells": 10,//已售数量
    "originalPrice": 10,//原价
    "overseas": false,
    "paixu": 0,
    "persion": 1,
    "pic": "/leeya_bug/images/橘子.jpg",//图片
    "pingtuan": false,
    "pingtuanPrice": 0.00,
    "priceShopSell": 0.00,
    "propertyIds": ",870,",
    "recommendStatus": 0,
    "recommendStatusStr": "精良",
    "seckillBuyNumber": 0,
    "sellEnd": true,
    "sellStart": true,
    "shopId": 6040,//商店Id
    "status": 0,
    "statusStr": "上架",
    "storeAlert": false,
    "stores": 999999,
    "stores0Unsale": false,
    "storesExt1": 0,
    "storesExt2": 0,
    "subName": "测试别名",//别名
    "tax": 0.000,
    "type": 0,
    "unit": "个",//商品单位
    "unusefulNumber": 0,
    "usefulNumber": 0,
    "userId": 951,
    "vetStatus": 1,
    "views": 33602,
    "weight": 1.50,
  },
  example_theirCategorie: {
    "icon": "/leeya_bug/images/暂无图片.jpg",
    "id": 0,
    "isUse": true, 
    "key": "2",
    "level":1,
    "name":"暂无商品",
    "paixu":0,
    "pid":0,
    "shopId":0,
    "type":"",
    "userId": 0
  },
  example_theirGoodPic:{
    goodsId: 235853,
    id: 6195431,
    pic: "/leeya_bug/images/categories/李子.png",
    userId: 951,
  },
  example_theirShop: {
    address: "美国 加利福尼亚州 库比蒂诺 坦陶大道北10600号",//商店地址(商店描述)
    cityId: "330100000000",
    cyTablePayMod: 1,
    dateAdd: "2020-02-20 14:40:06",
    dateUpdate: "2023-05-26 14:20:00",
    districtId: "330110000000",
    goodsNeedCheck: false,
    id: 6040,
    latitude: 30.359991,
    linkMan: "测试联系人",//联系人
    linkPhone: "057128180512",//联系电话
    linkPhoneShow: true,
    longitude: 120.057228,
    name: "测试商店",//商店名称
    numberFav: 0,
    numberGoodReputation: 5,
    numberOrder: 7,
    numberReputation: 5,
    openScan: true,
    openWaimai: true,
    openZiqu: true,
    openingHours: "8:30AM ~ 10:30PM",
    paixu: 0,
    pic: "/leeya_bug/images/categories/核桃.png",//商店图片
    provinceId: "330000000000",
    recommendStatus: 0,
    status: 1,
    statusStr: "正常",
    taxGst: 0,
    taxService: 0,
    userId: 951,
    workStatus: 0,
  },
}