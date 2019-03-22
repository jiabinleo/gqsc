// pages/myRelease/myRelease.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageRows: [],
    imgUrl: null,
    modalFlag: true,
    btn1: 'btn',
    btn2: '',
    pageType: 1,
    loca50010: null,
    token: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (app.globalData.imgUrl) {
      this.setData({
        imgUrl: app.globalData.imgUrl
      })
    }
    if (wx.getStorageSync("token")) {
      this.setData({
        token: wx.getStorageSync("token")
      })
    }
    wx.setNavigationBarTitle({
      title: '我的收藏'
    })
    if (app.globalData.loca50010) {
      this.setData({
        loca50010: app.globalData.loca50010
      })
    }
    this.getMyPage()
  },
  getMyPage: function() {
    wx.request({
      url: this.data.loca50010 + "/user/collection/list",
      header: {
        "Content-Type": "application/json",
        "login_token": this.data.token
      },
      success: res => {
        if (res.data.code === "0") {
          var pageRows = res.data.data.list
          for (let i = 0; i < pageRows.length; i++) {
            pageRows[i].icon = this.data.imgUrl + pageRows[i].icon
            pageRows[i].time = pageRows[i].updateTime
          }
          this.setData({
            pageRows: pageRows
          })
        }
      }
    });
  },
  delMsg: function(e) {
    this.setData({
      modalFlag: false
    })
    wx.showModal({
      title: "确定取消收藏",
      content: e.currentTarget.dataset.title + '',
      confirmColor: '#3CC51F',
      success: res => {
        if (res.confirm) {
          wx.request({
            url: this.data.loca50010 + "/user/collection/cancel",
            method: "POST",
            header: {
              "Content-Type": "application/json",
              "login_token": this.data.token
            },
            data: {
              id: e.currentTarget.dataset.detailid,
              code: 'gqsc'
            },
            success: res => {
              if (res.data.code === "0") {
                var result = this.data.pageRows
                result.splice(e.currentTarget.dataset.index, 1)
                this.setData({
                  pageRows: result
                })
              }
              wx.showToast({
                title: res.data.message,
                icon: 'success',
                duration: 2000
              })
            }
          });
        }
      }
    })
  },
  gq: function(e) {
    this.setData({
      pageType: e.currentTarget.dataset.type
    })
    if (e.currentTarget.dataset.type == '1') {
      this.setData({
        btn1: 'btn',
        btn2: ''
      })
    } else if (e.currentTarget.dataset.type == '2') {
      this.setData({
        btn2: 'btn',
        btn1: ''
      })
    }
    this.getMyPage()
  },
  onTouch: function(e) {
    wx.navigateTo({
      url: "../detail/detail?id=" + e.currentTarget.dataset.detailid
    });
  },
  onPullDownRefresh() {
    this.onLoad();
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
    this.onLoad();
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
  onPullDownRefresh: function() {
    wx.stopPullDownRefresh();
    this.onLoad();
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  preventTouchMove: function() {
    this.onLoad()
  },
  /**
   * 页面上拉触底事件的处理函数
   */

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})