import requestHelper from '../helpers/requestHelper'
import showHelper from '../helpers/showHelper'
const leeya_bug = require('../leeya_bug.js')

class user{
  static init(){
    if(false){
      console.log('未获得用户信息，开始获取');
      showHelper.showLoginRural2GetInfo(function(){
        user.register(true,
          user.login
        );
      });
    }else{
      console.log('已获得用户信息，直接登录');
      user.register(false,
        user.login
      );
    }
  }
  static register(isShowToast, callBackFunc){
    var openId = user.getOpenId();
    requestHelper.request(
      '/admin/register',
      {
        "email": "",
        "icon": openId,
        "nickName": openId,
        "note": "",
        "openId": openId,
        "password": openId,
        "username": openId
      },
      function (result){
        console.log(result);
        if(result.data.code == 200){
          console.log('注册成功');
        }else{
          console.log('注册失败');
        }
        callBackFunc(isShowToast)
      }
    )
  }
  static login(isShowToast){
    var openId = user.getOpenId();
    requestHelper.request(
      '/admin/login',
      {
        "password": openId,
        "username": openId
      },
      function (result){
        console.log(result);
        if(result.data.code == 200){
          console.log('登录成功');
          if(isShowToast){
            wx.showToast({
              title: '登录成功',
            })
          }
          var tokenHead = result.data.data.tokenHead;
          var token = result.data.data.token;
          console.log(JSON.stringify({tokenHead: token}))
          wx.setStorage({key: "ruralToken",data: JSON.stringify({tokenHead: token})});
        }else{
          console.log('登录失败');
        }
      }
    )
  }
  




  //基础操作
  static checkValid(){
    console.log('--完整性验证中')
    console.log('--是否获得OpenId: ' + !(this.getOpenId() == -1) )
    console.log('--是否获得后端TOken: ' + !(this.getTokenJson() == -1) )
    return !(this.getOpenId() == -1 
    || this.getTokenJson() == -1)
  }
  static getOpenId(){                              //获得用户openId
    var data = wx.getStorageSync("openId")
    return data == undefined || data == null || data == "" ? -1 : data
  }
  static getTokenJson(){                           //获得后端唯一标识
    try{
      return JSON.parse(wx.getStorageSync('ruralToken'));
    }catch(err){
      return -1;
    }
  }
  //头像操作
  static setAvatar(avatar){
    console.log('用户头像保存成功')
    wx.setStorage({key: "avatar",data: avatar})
  }
  static getAvatar(){
    var avatar = wx.getStorageSync('avatar')
    if(avatar == undefined || avatar == null || avatar == "" ){
      return "/images/default.png"
    }else{
      return avatar
    }
  }
  //昵称操作
  static setName(name){
    console.log('保存名称成功')
    wx.setStorage({key: "name",data: name})
  }
  static getName(){
    var name = wx.getStorageSync('name')
    if(name == undefined || name == null || name == "" ){
      return "请输入您的昵称"
    }else{
      return name
    }
  }
  //位置操作
  static setPos(latitude, longitude){
    console.log('保存位置信息成功: ' + latitude + ' ' + longitude)
    wx.setStorage({key: "latitude",data: latitude})
    wx.setStorage({key: "longitude",data: longitude})
  }
  static getPos(){
    var latitude = wx.getStorageSync('latitude')
    var longitude = wx.getStorageSync('longitude')
    if((latitude == undefined || latitude == null || latitude == "" ) && (longitude == undefined || longitude == null || longitude == "" )){
      return -1, -1
    }else{
      return latitude, longitude
    }
  }
}

export default user;