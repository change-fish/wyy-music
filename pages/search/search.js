// pages/search/search.js
import request from '../../utils/request.js'
let isSend = false
Page({

  /**
   * 页面的初始数据
   */
  data: {
    placeholderContent:'',//搜索框默认内容
    hostList:[],//热搜榜
    searchContent:'',//用户输入的关键字内容
    searchList:[],//根据关键字获取的模糊查询结果
    historyList:[],//历史搜索记录
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getInitData()
  },
  //获取初始化数据的函数
  async getInitData(){
    let placeholderData = await request('/search/default')
    let hotListData = await request('/search/hot/detail')
    this.setData({
      placeholderContent: placeholderData.data.showKeyword,
      hotList: hotListData.data
    })
    
  },
  //表单输入的回调函数
  handleInputChange(event){
    //console.log(object)

    this.setData({
      //trim()清理空格
      searchContent:event.detail.value.trim()
    })
    if(isSend){
      return
    }
    isSend = true
    //函数节流
    setTimeout(async ()=> {
      if(!this.data.searchContent){
        return
      }

      let {searchContent,historyList} = this.data
      //发送请求，获取查询数据
      let searchListData = await request('/search', {keywords:searchContent,limit:10})
      
      this.setData({
        searchList:searchListData.result.songs
      })
      isSend = false

      //将搜索的关键字添加到搜索搜索历史记录中
      historyList.unshift(searchContent)
      this.setData({
        historyList
      })
    },500)
  },
  //清空搜索内容
  clearSearchContent(){
    this.setData({
      searchContent:''
    })
  },
  //清空搜索记录
  deleteSearchHistory(){
    this.setData({
      historyList:[]
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