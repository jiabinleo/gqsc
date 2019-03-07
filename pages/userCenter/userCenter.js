// pages/userCenter/userCenter.js

var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: {
      icon: null
    },
    mask: "mask-close"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(app.globalData.userInfo)
    if (wx.getStorageSync('user')) {
      this.setData({
        user: wx.getStorageSync('user'),
      })
    }
    wx.setNavigationBarTitle({
      title: '我的'
    })
  },
  bindReleaseTap: function () {
    wx.navigateTo({
      url: "../myRelease/myRelease"
    });
  },
  bindCollectionTap: function () {
    wx.navigateTo({
      url: "../myCollection/myCollection"
    });
  },
  close: function () {
    this.setData({
      mask: "mask-close"
    });
  },
  open: function () {
    this.setData({
      mask: "mask"
    });
  },
  preventTouchMove: function () {},
  supply: function () {
    wx.navigateTo({
      url: "../supply/supply"
    });
    this.setData({
      mask: "mask-close"
    });
  },
  buy: function () {
    wx.navigateTo({
      url: "../buy/buy"
    });
    this.setData({
      mask: "mask-close"
    });
  },
  bindIndexTap: function () {
    wx.navigateTo({
      url: "../index/index"
    });
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