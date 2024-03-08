const WXAPI = require('apifm-wxapi')
const CONFIG = require('../config.js')
const AUTH = require('../utils/auth')

//乡村振兴示例数据
//注意，商品数据格式某些数据是非必须的，而陈列在以下示例中的格式是必须的
module.exports = {
  //获得分类
  // Request:
  //
  // Response: 
  // [
  //   {
  //     name: "农蔬类",
  //     icon: "/leeya_bug/images/categories/番茄.png",
  //     id: 1872
  //   },
  //   ......
  // ]
  apiGetOurCategories: function(){
    return [
      {
        name: "农蔬类",
        icon: "/leeya_bug/images/categories/番茄.png",
        id: 1872
      },{
        name: "应季水果",
        icon: "/leeya_bug/images/categories/李子.png",
        id: 1873
      },{
        name: "干果类",
        icon: "/leeya_bug/images/categories/核桃.png",
        id: 1875
      },{
        name: "时令水果",
        icon: "/leeya_bug/images/categories/橘子.png",
        id: 1906
      },{
        name: "苗木花草",
        icon: "/leeya_bug/images/categories/核桃.png",
        id: 1906
      },{
        name: "粮油米面",
        icon: "/leeya_bug/images/categories/橘子.png",
        id: 1906
      },{
        name: "种子",
        id: 1906
      },{
        name: "农药杀虫剂",
        id: 1906
      },{
        name: "有机肥料",
        id: 1906
      },{
        name: "农副产品",
        id: 1906
      }
    ];
  },

  //由分类ID -> 获得商品
  // Request:
  // {
  //   categorieId: "1872"
  // }
  // Response: 
  // [
  //   {
  //     name: "应季水果测试商品1",
  //     categoryId: "1872",
  //     minBuyNumber: 1,
  //     minPrice: 10,
  //     numberSells: 20,
  //     pic: "https://dcdn.it120.cc/2019/12/06/ebf49ac6-4521-4bcc-92fd-8bbbd4131167.jpg"
  //   },
  //   ......
  // ]
  apiGetOurGoodsByCategorieId: function(categoriesId){
    switch(categoriesId){
      case 1:return [
        {
          id: 235853,
          name: "农蔬测试商品1",
          categoryId: "1872",
          minBuyNumber: 1,
          minPrice: 10,
          numberSells: 20,
          pic: "/leeya_bug/images/categories/橘子.png"
        },{
          id: 235853,
          name: "农蔬测试商品2",
          categoryId: "1872",
          minBuyNumber: 1,
          minPrice: 10,
          numberSells: 20,
          pic: "/leeya_bug/images/categories/橘子.png"
        },{
          id: 235853,
          name: "农蔬测试商品3",
          categoryId: "1872",
          minBuyNumber: 1,
          minPrice: 10,
          numberSells: 20,
          pic: "/leeya_bug/images/categories/橘子.png"
        }
      ];
      case 88:return [
        {
          id: 235853,
          name: "应季水果测试商品1",
          categoryId: "1872",
          minBuyNumber: 1,
          minPrice: 10,
          numberSells: 20,
          pic: "/leeya_bug/images/categories/橘子.png"
        },{
          id: 235853,
          name: "应季水果测试商品2",
          categoryId: "1872",
          minBuyNumber: 1,
          minPrice: 10,
          numberSells: 15,
          pic: "/leeya_bug/images/categories/橘子.png"
        }
      ]
    }
    return [];
  },

  //由用户ID -> 获得商品列表 数据格式
  // Request:
  // {
  //   userId: 985
  // }
  // Response:
  // [
  //   {
  //     name: "农蔬测试商品1",
  //     categoryId: "1872",
  //     minPrice: 10,
  //     characteristic: "别名",
  //     pic: "https://dcdn.it120.cc/2019/12/06/ebf49ac6-4521-4bcc-92fd-8bbbd4131167.jpg"
  //   },
  //   ......
  // ]
  apiGetOurGoodsListByUserId: function(userId){
    return [
        {
          id: 235853,
          name: "测试商品1",
          categoryId: "1872",
          minPrice: 10,
          originalPrice: 19,
          characteristic: "别名1",
          pic: "/leeya_bug/images/categories/橘子.png"
        },{
          id: 235853,
          name: "测试商品2",
          categoryId: "1872",
          minPrice: 10,
          originalPrice: 19,
          characteristic: "别名2",
          pic: "/leeya_bug/images/categories/橘子.png"
        },{
          id: 235853,
          name: "测试商品3",
          categoryId: "1872",
          minPrice: 10,
          originalPrice: 19,
          characteristic: "别名3",
          pic: "/leeya_bug/images/categories/橘子.png"
        },{
          id: 235853,
          name: "测试商品4",
          categoryId: "1872",
          minPrice: 10,
          originalPrice: 19,
          characteristic: "别名4",
          pic: "/leeya_bug/images/categories/橘子.png"
        },{
          id: 235853,
          name: "测试商品5",
          categoryId: "1872",
          minPrice: 10,
          originalPrice: 19,
          characteristic: "别名5",
          pic: "/leeya_bug/images/categories/橘子.png"
        }
      ]
  },

  //由用户ID -> 获得爆品商品 数据格式
  // Request:
  // {
  //   userId: 985
  // }
  // Response:
  // [
  //   {
  //     name: "测试商品1",
  //     categoryId: "1872",
  //     minPrice: 10,
  //     originalPrice: 19,
  //     characteristic: "别名1",
  //     pic: "/leeya_bug/images/categories/番茄.png"
  //   },{
  //     name: "测试商品1",
  //     categoryId: "1872",
  //     minPrice: 10,
  //     originalPrice: 19,
  //     characteristic: "别名1",
  //     pic: "/leeya_bug/images/categories/番茄.png"
  //   }
  // ]
  apiGetOurBaoGoodsListByUserId: function(userId) {
    return [
      {
        id: 235853,
        name: "测试商品1",
        categoryId: "1872",
        minPrice: 10,
        originalPrice: 19,
        characteristic: "别名1",
        pic: "/leeya_bug/images/categories/番茄.png"
      },{
        id: 235853,
        name: "测试商品2",
        categoryId: "1872",
        minPrice: 10,
        originalPrice: 19,
        characteristic: "别名2",
        pic: "/leeya_bug/images/categories/番茄.png"
      },
    ]
  },

  /*待完成*/apiGetOurGoodsDetailsBy: function(userId,goodsId){
    return {
      good: {
        id: 235853,
        name: "测试商品1",
        categoryId: "1872",
        minPrice: 10,
        originalPrice: 19,
        characteristic: "测试商品1的详细描述",
        pic: "/leeya_bug/images/categories/橘子.png",
      },
      pics: [
        {
          goodsId: 235853,
          id: 6195431,
          pic: "/leeya_bug/images/categories/李子.png",
          userId: 951,
        },{
          goodsId: 235853,
          id: 6195431,
          pic: "/leeya_bug/images/categories/核桃.png",
          userId: 951,
        },{
          goodsId: 235853,
          id: 6195431,
          pic: "/leeya_bug/images/categories/橘子.png",
          userId: 951,
        }
      ],
      content: "<div><p>hello,world!</p><p>这里放的是html代码</p><p>可以展示图片</p></div>",
    }
  },

  //获得动态展示商品
  // Request:
  //
  // Response: 
  // [
  //   {
  //     avatarUrl: "/leeya_bug/images/categories/橘子.png",
  //     goodsName: "测试橘子",
  //     goodsId: 810285
  //   }
  //   ...
  // ]
  apiGetOurGoodsDynamic: function(userId){
    return [
      {
        avatarUrl: "/leeya_bug/images/categories/橘子.png",
        goodsName: "测试橘子",
        goodsId: 810285
      },{
        avatarUrl: "/leeya_bug/images/categories/核桃.png",
        goodsName: "测试核桃",
        goodsId: 810285
      },{
        avatarUrl: "/leeya_bug/images/categories/李子.png",
        goodsName: "测试李子",
        goodsId: 810285
      }
    ];
  },

  //获得动态展示商品
  // Request:
  //
  // Response: 
  // [
  //   {
  //     linkUrl:"https://www.baidu.com",
  //     picUrl:"/leeya_bug/images/banners/轮播乡村振兴.jpg"
  //   }
  //   ...
  // ]
  apiGetOurBanners: function(userId,type){
    return [
      {
        linkUrl:"https://www.baidu.com",
        picUrl:"/leeya_bug/images/banners/轮播乡村振兴.jpg"
      },{
        linkUrl:"https://www.baidu.com",
        picUrl:"/leeya_bug/images/banners/轮播橘子.jpg"
      }
    ]
  }
}