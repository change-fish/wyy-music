// pages/personal/personal.js

import request from "../../utils/request";

let startY = 0; // 手指起始的坐标,这是本页面的全局变量
let moveY = 0; // 手指移动的坐标
let moveDistance = 0; // 手指移动的距离
Page({
  /**
   * 页面的初始数据
   */
  data: {
    coverTransform:`translateY(0)`,//设定会员图片处的位移起始值为0
    //startY:0,
    coveTransition: '',
    userInfo: {}, // 用户信息
    recentPlayList: [], // 用户播放记录
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 读取用户的基本信息
    let userInfo = wx.getStorageSync('userInfo');
    console.log(userInfo)
    if(userInfo){ // 用户登录，判断是否有登录内容
      // 更新userInfo的状态
      this.setData({
        userInfo: JSON.parse(userInfo)
      })
      
      // 获取用户播放记录
      this.getUserRecentPlayList(this.data.userInfo.userId)
    } 
  },
  // 获取用户播放记录的功能函数
  async getUserRecentPlayList(userId){
    let recentPlayListData = await request('/user/record', {uid: userId, type: 0});
    let index = 0;
    //allData.splice(0, 10)截取需要的数据的十条
    //.map对数组进行加工
    let recentPlayList = recentPlayListData.allData.splice(0, 10).map(item => {
      item.id = index++;
      return item;
    })
    //console.log(recentPlayList)
    this.setData({
      recentPlayList
    })
  }, 
  handleTouchStart(event){
      //console.log('start');
      //获取手指的起始坐标，touches是一个数组，第一个手指的操作是0
      //startY的值是手指相对于顶部盗汗懒得位置，是一个正值，手指向上移动，值变小，移动距离的值是负值，向下移动，距离是正值
      startY = event.touches[0].clientY
      this.setData({
        coveTransition: ''
      })
  },
  handleTouchMove(event){
      //console.log()
      let moveY = event.touches[0].clientY
      let moveDistance = moveY - startY
      //console.log(moveDistance);

      if(moveDistance <= 0){
        return;
      }
      if(moveDistance >= 80){
        moveDistance = 80;
      }
      //动态监听coverTransform的状态值
      this.setData({
      coverTransform:`translateY(${moveDistance}rpx)`
      })
  },
  handleTouchEnd(){
      //console.log('end');
      // 动态更新coverTransform的状态值
    this.setData({
      coverTransform: `translateY(0rpx)`,
      coveTransition: 'transform 1s linear'//设置过渡效果
    })
  },
  // 跳转至登录login页面的回调
  toLogin(){
    wx.navigateTo({
      url: '/pages/login/login'
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