// index.js
// 获取应用实例

const app = getApp()

import request from '../../utils/request.js'

//注册整个页面
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    bannerList:[],//轮播图数据
    recommendList:[],//推荐歌单
    topList:[],//排行榜
  },
  // 事件处理函数
  /* toLogs() {
    wx.navigateTo({
      //相对路径
      url: '../logs/logs'
    })
  }, */

  //onLoad监听页面加载
  onLoad: async function() {
    //console.log(this)//this是当前页面的实例对象

    /* 请求/banner页面的数据 await等待数据请求完毕
     let bannerData = await request('/banner',{type:2})
    this.setData({
      bannerList:bannerData.banners
    })  
    console.log(bannerList)*/

    /* 请求轮播图数据 */
    request('/banner',{type:2}).then( res => {
      //console.log(res)
      let bannerData = res
      this.setData({
        bannerList:bannerData.banners
      })
    })
    /* 请求推荐歌单数据 */
    request('/personalized',{limit:10}).then( res => {
      //console.log(res)
      let recommendData = res
      this.setData({
        recommendList:recommendData.result
      })
    })
    /* 请求排行榜数据 */   /* idx可选值0-20 ，我们使用0-4，需要发五次请求*/
    let topListArr = []
    for(let i = 0; i < 5; i++){
      let topListData = await request('/top/list', {idx: i})
      let topListItem = {name: topListData.playlist.name, tracks: topListData.playlist.tracks.slice(0, 3)};
      topListArr.push(topListItem)
        this.setData({
          topList:topListArr
        })

      /* request('/top/list',{idx:i}).then( res => {
        //console.log(res)
        let topListData = {
          name:res.playlist.name,
          tracks:res.playlist.tracks.slice(0,3)//截取0-2的数据
        }
        topListArr.push(topListData)
        this.setData({
          topList:topListArr
        }) 
      })*/
    }
    /* this.setData({
      topList:topListArr
    }) */
  },
  //跳转到推荐歌曲页面
  toRecommendSong(){
    wx.reLaunch({
      url:'/pages/recommendSong/recommendSong'
    })
  },

  getUserInfo(e) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    //console.log(e)
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  //此函数暂时无法使用
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  
})

/* onLoad(){
  授权后自动获取用户信息
     wx.getUserInfo({
      success:(res) => {
       //console.log(res)
       this.setData({
        userInfo: res.userInfo,
        hasUserInfo: true
      })
      },
      fail: (err) => {
        //console.log(err)
      },
    }) 
    
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    } 
}
*/