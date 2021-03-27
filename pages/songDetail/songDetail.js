// pages/songDetail/songDetail.js
import request from '../../utils/request'
import PubSub from 'pubsub-js'
import moment from 'moment'

//获取全局实例
const appInstance = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay:false,
    song:{},//歌曲数据
    musicId: '', // 音乐id
    musicLink: '', // 音乐的链接
    currentTime:'00:00',
    durationTime:'00:00',
    currentWidth:0,//进度条的实时宽度
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 判断当前页面音乐是否在播放
    if(appInstance.globalData.isMusicPlay && appInstance.globalData.musicId === musicId){
      // 修改当前页面音乐播放状态为true
      this.setData({
        isPlay: true
      })
    }
    //options是路由跳转时上个页面传入的内容，音乐的id
    //console.log(options)
    let musicId = options.musicId
    this.setData({
      musicId
    })
    this.getMusicInfo(musicId)

    // 创建控制音乐播放的实例
    this.backgroundAudioManager = wx.getBackgroundAudioManager()

    //监听背景音乐的播放和暂停
    this.backgroundAudioManager.onPlay(() => {
      this.setData({
        isPlay:true
      }) 
      // 修改全局音乐播放的状态
      appInstance.globalData.musicId = musicId
      appInstance.globalData.isMusicPlay = true
    })
    this.backgroundAudioManager.onPause(() => {
      this.setData({
        isPlay:false
      })
      appInstance.globalData.isMusicPlay = false
    })
    this.backgroundAudioManager.onStop(() => {
      this.setData({
        isPlay:false
      })
      appInstance.globalData.isMusicPlay = false
    })
    //监听音乐播放进度
    this.backgroundAudioManager.onTimeUpdate(() => {
      let currentTime = moment(this.backgroundAudioManager.currentTime * 1000).format('mm:ss')
      let currentWidth = (this.backgroundAudioManager.currentTime/this.backgroundAudioManager.duration) * 450 
      this.setData({
      currentTime,
      currentWidth
      })
    })
    //监听音乐播放自动结束
    this.backgroundAudioManager.onEnded(() => {
      //自动切换自下一首音乐并自动播放，音乐条长度变成0
      PubSub.publish('switchType',type)
      this.setData({
        currentTime:'00:00',
        currentWidth:0,
      })
    })
  },
  //获取歌曲数据
  async getMusicInfo(musicId){
    let musicData = await request('/song/detail',{ids:musicId})

    //将音乐长度时间转化为需要的格式
    let durationTime = moment(musicData.songs[0].dt).format('mm:ss')
    this.setData({
      song:musicData.songs[0],
      durationTime
    })
    // 动态修改窗口标题
    wx.setNavigationBarTitle({
      title: this.data.song.name
    })
  },
  //控制音乐播放的按钮
  handlePlay(){
    let isPlay = !this.data.isPlay
    // 修改是否播放的状态,放到 this.backgroundAudioManager里监听
    /* this.setData({
      isPlay
    }) */
    let {musicId,musicLink} = this.data
    //调用控制音乐的函数
    this.musicPlay(isPlay,musicId,musicLink)
  },
  //定义控制音乐播放的函数
  async musicPlay(isPlay,musicId,musicLink){
    //console.log(musicId);

    if(isPlay){//播放音乐
      if(!musicLink){
        //获取音乐的播放链接
      let musicLinkData = await request('/song/url',{id:musicId})
      musicLink = musicLinkData.data[0].url
      this.setData({
        musicLink
      })
      }
      //添加src和title属性才可以播放
      this.backgroundAudioManager.src = musicLink
      this.backgroundAudioManager.title = this.data.song.name
    }else{//暂停音乐
      this.backgroundAudioManager.pause()
    } 
  },
  //前后按钮控制切换歌曲的函数
  handleSwitch(event){
   // console.log(event)
    
    let type = event.currentTarget.id
    //关闭当前音乐
    this.backgroundAudioManager.stop()

    //接收recommendSong页面返回的数据musicId
    PubSub.subscribe('musicId',(msg,musicId) => {
      //console.log(musicId)

      //获取音乐信息，并播放
      this.getMusicInfo(musicId)
      this.musicPlay(true,musicId)
      //取消订阅
      PubSub.unsubscribe('musicId')
    })
    //定义发布给recommendSong页面的消息，切换歌曲
    PubSub.publish('switchType',type)
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