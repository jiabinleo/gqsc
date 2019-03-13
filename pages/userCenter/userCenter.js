// pages/userCenter/userCenter.js

var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    user: {},
    mask: "mask-close",
    canIUse: wx.canIUse("button.open-type.getUserInfo"),
    token: null,
    loca50010: null,
    userInfo: {},
    hasUserInfo: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {
    if (wx.getStorageSync("token")) {
      this.setData({
        token: wx.getStorageSync("token")
      });
    }
    if (wx.getStorageSync("user")) {
      this.setData({
        user: wx.getStorageSync("user")
      });
      this.setData({
        hasUserInfo: true
      });
      console.log(this.data.user);
    }
    if (app.globalData.loca50010) {
      this.setData({
        loca50010: app.globalData.loca50010
      });
    }
    //获取用户信息
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      });
    } else if (this.data.canIUse) {
      console.log("000");
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        });
      };
    } else {
      console.log("000");
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo;
          console.log(res);
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          });
        }
      });
    }
    wx.setNavigationBarTitle({
      title: "我的"
    });
  },
  getUserInfo: function(e) {
    console.log(e.detail.userInfo);

    wx.login({
      success: res => {
        console.log(res);
        if (res.code) {
          wx.request({
            url: this.data.loca50010 + "/user/xcxLogin",
            method: "post",
            header: {
              "Content-Type": "application/json"
            },
            data: {
              icon: e.detail.userInfo.avatarUrl,
              userName: e.detail.userInfo.nickName,
              sex: e.detail.userInfo.gender,
              js_code: res.code
            },
            success: res => {
              if (res.data.code === "0") {
                this.setData({
                  hasUserInfo: true
                });
                wx.setStorageSync("token", res.data.data.token);
                wx.setStorageSync("user", res.data.data.user);
                this.onLoad();
              }
            }
          });
        } else {
          console.log("获取用户登录态失败！" + res.errMsg);
        }
      }
    });
  },
  bindReleaseTap: function() {
    wx.navigateTo({
      url: "../myRelease/myRelease"
    });
  },
  bindCollectionTap: function() {
    wx.navigateTo({
      url: "../myCollection/myCollection"
    });
  },
  close: function() {
    this.setData({
      mask: "mask-close"
    });
  },
  open: function() {
    this.setData({
      mask: "mask"
    });
  },
  preventTouchMove: function() {},
  supply: function() {
    wx.navigateTo({
      url: "../supply/supply"
    });
    this.setData({
      mask: "mask-close"
    });
  },
  buy: function() {
    wx.navigateTo({
      url: "../buy/buy"
    });
    this.setData({
      mask: "mask-close"
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {}
});
