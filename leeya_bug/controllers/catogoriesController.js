import requestHelper from '../helpers/requestHelper'

const { objectMapping} = require('../lib.js')
const { objectCopy,example_theirGood,example_theirCategorie,example_theirGoodPic,example_theirShop,getOurMiniProgramData} = require('../lib.js')
const testdata = require('../OurApi.js')

class catogoriesController{
  static getCatogories(instance){
    requestHelper.requestGet(
      '/tdProductCategory/ignored/',
      function(result){
        var result1 = []
        for(var i in result.data.data){
          result1.push({
            isUse: true,
            key: "2",
            level: 1,
            paixu: 0,
            pid: 0,
            shopId: 0,
            type: "",
            userId: 0,
            name: result.data.data[i].parent.title,
            id: result.data.data[i].parent.id,
            icon: result.data.data[i].parent.img
          });
        }
        instance.categories(result1);
        console.log(result1);
      },
    )
  }

  static getGoodsByCategoryId(instance, categoryId){
    requestHelper.requestGet(
      '/tdFarmProduct/ignored/get/' + categoryId,
      function(result){
        var result1 = []
        for(var i in result.data.data){
          result1.push({
            isUse: true,
            key: "2",
            level: 1,
            paixu: 0,
            pid: 0,
            shopId: 0,
            type: "",
            userId: 0,
            name: result.data.data[i].parent.title,
            id: result.data.data[i].parent.id,
            icon: result.data.data[i].parent.icon
          });
        }
        instance.categories(result1);
        console.log(result1);
      },
    )
  }
}

export default catogoriesController