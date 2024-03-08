
const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})


exports.main = async (event, context) => {
  //console.log("长度：",event.media.data.lenght)
  try {
    const res = await cloud.openapi.security.imgSecCheck({
      media: {
        contentType: 'image/png',
        value: Buffer.from(event.media)
      }
    })
    return res
  } catch (err) {
    return err
  }
}

