// pages/detail/detail.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    marketSupply: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.imgUrl) {
      this.setData({
        imgUrl: app.globalData.imgUrl
      });
    }
    var that = this
    console.log(options.id)
    console.log(44)
    wx.request({
      url: "http://120.78.209.238:50010/v1/supply/detail/" + 44,
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {
        var _marketSupply = res.data.data.marketSupply
        var icon = _marketSupply.icon
        if (icon) {
          if (icon.indexOf("/")) {} else {
            _marketSupply.icon = that.data.imgUrl + icon;
          }
        } else {
          _marketSupply.icon = "";
        }
        that.setData({
          marketSupply: _marketSupply
        })
      }
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