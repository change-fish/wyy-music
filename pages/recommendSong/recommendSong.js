// pages/recommendSong/recommendSong.js
import request from '../../utils/request'
import PubSub from 'pubsub-js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    day:'',
    month:'',
    recommendList:[],//推荐歌曲的数据
    index:0,//歌曲在列表中的索引
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //先判断用户是否登录
    let userInfo = wx.getStorageSync('userInfo')
    if(!userInfo){
      wx.showToast({
        title:'请先登录',
        icon:none,
        //跳转至登录界面
        success:() => {
          wx.reLaunch({
            url:'/pages/login/login'
          })
        }
      })
    }
    this.setData({
      //小程序内有自带的获取日期的方法
      day: new Date().getDate(),
      month: new Date().getMonth() + 1
    })
    //获取每日推荐歌曲的数据
    this.getRecommendList()

    //订阅来自songdetail页面发布的消息,'switchType'是名称msg,type是传入的id
    PubSub.subscribe('switchType',(msg,type) => {
      //console.log(msg,type)//pre,next

      //获取当当前歌曲的索引
      let {recommendList,index} = this.data
      if(type === 'pre'){
        (index === 0) && (index = recommendList.length)
        index --
      }else{
        if(index = recommendList.length - 1){
          index = 0
        }else{
          index ++
        }
      }
      this.setData({
        index
      })

      //获取上一首或下一首歌曲的id，并回传给songdetail页面
      let musicId = recommendList[index].id
      PubSub.publish('musicId',musicId)
    })
  },
  //定义获取数据的函数
  async getRecommendList(){
    let data = await request('/recommend/songs')
    this.setData({
      recommendList: data.recommend
    })
  },
  //跳转到歌曲播放页面
  // 路由跳转传参： query参数
  toSongDetail(event){
    let {song,index} = event.currentTarget.dataset
    this.setData({
      index
    })
    //将song传入播放页
    // 不能直接将song对象作为参数传递，长度过长，会被自动截取掉
    wx.navigateTo({
      url:'/pages/songDetail/songDetail?musicId=' + song.id
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})