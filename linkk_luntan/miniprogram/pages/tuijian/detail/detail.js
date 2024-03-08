// miniprogram/pages/tuijian/detail/detail.js
Page({
  data: {
    address:"https://www.baidu.com"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log(options)
    var address=options.address
    this.setData({
      address:address
    })
    console.log(this.data.address)
  },
  onReady: function () { },

  onShow: function () { },

  onShareAppMessage: function () { },
  bindload: function (e) {
    console.log('成功')
  },
  binderror: function (e) {
    console.log('失败')
  }
})