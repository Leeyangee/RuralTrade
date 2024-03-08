
const URL = 'https://server.ruraltrade.fun'


import user from '../models/userModel'

class showHelper{
  /*
  static showLoginRural2GetInfo(func){
    wx.showModal({
      title: "提示",
      content: "是否允许 乡村振兴 获取您的微信昵称和头像？",
      success(res) {
        if (res.confirm) {
          wx.getUserProfile({
            desc:"获取你的昵称、头像、地区及性别",
            success: (res) => {
              wx.setStorage({key: "avatarUrl",data: res.userInfo.avatarUrl})
              wx.setStorage({key: "nickName",data: res.userInfo.nickName})
              //console.log('成功获得avatarUrl: ' + wx.getStorageSync('avatarUrl'));
              //console.log('成功获得nickName: ' + wx.getStorageSync('nickName'));
              func();
            },
            fail: (res)=>{
              console.log(res)
            }
          });
        }
      },
    })
  }
  */
}

export default showHelper