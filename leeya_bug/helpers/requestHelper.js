
const URL = 'https://server.ruraltrade.fun'
const contentType = {'Content-Type': 'application/json'};

import user from '../models/userModel'

class requestHelper{
  static request(path, data, sucFunc){
    wx.request({
      url: URL + path,
      method: "POST",
      data: data,
      header: {...contentType},
      dataType: 'json',
      success: sucFunc,
    });
  }
  static requestGet(path, sucFunc){
    wx.request({
      url: URL + path,
      method: 'Get',
      header: {...contentType},
      success: sucFunc,
    });
  }
  static requestByHeader(path, data, sucFunc,headers){
    wx.request({
      url: URL + path,
      method: "POST",
      data: data,
      header: {...contentType, ...headers},
      dataType: 'json',
      success: sucFunc,
    });
  }
  static requestWithToken(path, data, sucFunc){
    var token = user.getTokenJson()
    if(token == -1){
      console.log('token失效，无法登陆，正在尝试重新登陆');
      user.init();
      token = use.getTokenJson()
    }
    this.requestByHeader(path, data, function (result){
      sucFunc(result)
    },token)
  }
}

export default requestHelper