// pages/detail/detail.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    marketSupply: '',
    fileList: [],
    publishTime: '',
    supplyTime: '',
    isZan: '',
    isCollection: '',
    phoneNumber: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (app.globalData.imgUrl) {
      this.setData({
        imgUrl: app.globalData.imgUrl
      });
    }
    var that = this
    console.log(options.id)
    console.log(44)
    wx.request({
      url: "http://120.78.209.238:50010/v1/supply/detail/" + options.id,
      header: {
        "Content-Type": "application/json"
      },
      success: function(res) {
        var _marketSupply = res.data.data.marketSupply
        var icon = _marketSupply.icon
        if (icon) {
          if (icon.indexOf("/")) {} else {
            _marketSupply.icon = that.data.imgUrl + icon;
          }
        } else {
          _marketSupply.icon = "";
        }
        var _fileList = []
        for (let i = 0; i < _marketSupply.fileList.split(',').length; i++) {
          _fileList.push(that.data.imgUrl + _marketSupply.fileList.split(',')[i])
        }
        var publishTime = _marketSupply.publishTime.split(' ')[0]
        var supplyTime = _marketSupply.supplyTime.split(' ')[0].split('-')
        var _supplyTime = supplyTime[0] + '年' + supplyTime[1] + '月' + supplyTime[2] + '日'
        if (_marketSupply.isZan) {
          that.setData({
            isZan: '../../images/dz_pre.png'
          })
        } else {
          that.setData({
            isZan: '../../images/dz.png'
          })
        }
        if (_marketSupply.isCollection) {
          that.setData({
            isCollection: '../../images/sc_pre.png'
          })
        } else {
          that.setData({
            isCollection: '../../images/sc.png'
          })
        }
        that.setData({
          marketSupply: _marketSupply,
          fileList: _fileList,
          publishTime: publishTime,
          supplyTime: _supplyTime,
          phoneNumber: _marketSupply.telephone
        })

      }
    });

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  tel: function() {
    console.log()
    wx.makePhoneCall({
      phoneNumber: this.data.phoneNumber
    })
  }
})