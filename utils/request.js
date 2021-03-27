/* 网络请求封装内容，发送ajax请求*/

//下面两行莫名其妙出现的代码
//import { rejects } from "node:assert";
//import { resolve } from "node:path";

/* 封装功能函数
  1.功能点明确
  2.函数内部保留固定代码
  3.将动态数据抽取成形参，使用者根据使用传入实参
  4.好的功能函数应设置形参的默认值，可以使用ES6的形参默认值
*/
/* 
   封装功能组件
   1.功能点明确
   2.组件内部保留固定代码
   3.将动态数据抽取成props参数，使用者根据使用以标签的形式动态传入props数据
   4.好的组件应设置组件必要性及数据类型
*/
import config from './config'
export default (url,data = {},method = 'GET') => {
  return new Promise((resolve,reject) => {
    wx.request({
      url:config.host + url, 
      /* url:config.mobileHost + url, */
      data,
      method,
      header:{
        cookie: wx.getStorageSync('cookies')?wx.getStorageSync('cookies').find(item => item.indexOf('MUSIC') !== -1):''
      },
      success: (res) => {
        //如果登陆成功，将cookies存储在本地
        if(data.isLogin){
          wx.setStorage({
            key: 'cookies',
            data:res.cookies
          })   
        }
        //console.log(res)
        resolve(res.data)
      },
      fail:(err) => {
        //console.log(err)
        reject(err)
      },
    })
  })
  
}


