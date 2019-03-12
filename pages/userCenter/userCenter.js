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
  onLoad: function () {
    if (wx.getStorageSync('token')) {
      this.setData({
        token: wx.getStorageSync('token')
      })
    }
    if (wx.getStorageSync('user')) {
      this.setData({
        user: wx.getStorageSync('user')
      })
    }
    if (app.globalData.loca50010) {
      this.setData({
        loca50010: app.globalData.loca50010
      })
    }
    //获取用户信息
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      });
    } else if (this.data.canIUse) {
      console.log("000")
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        });
      };
    } else {
      console.log("000")
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo;
          console.log(res)
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          });
        }
      });
    }
    wx.setNavigationBarTitle({
      title: '我的'
    })
  },
  getUserInfo: function (e) {
    wx.login({
      success: res => {
        console.log(res);
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          //发起网络请求
          wx.request({
            url: "https://api.weixin.qq.com/sns/jscode2session?appid=wx2623aa28384009f5&secret=0063ddf49973e5cb547661200a8e3b21&js_code=" +
              res.code +
              "&grant_type=authorization_code",
            data: {
              code: res.code
            },
            success: res => {
              if (res.data.openid) {
                console.log(res)
                console.log(e)
                app.globalData.userInfo = e.detail.userInfo;
                this.autoLogin(
                  res.data.openid,
                  e.detail.userInfo.avatarUrl,
                  e.detail.userInfo.nickName,
                  e.detail.userInfo.gender
                );
              } else {
                this.getUserInfo();
              }
            }
          });
        } else {
          console.log("获取用户登录态失败！" + res.errMsg);
        }
      }
    });
  },
  autoLogin: function (openId, icon, userName, sex) {
    wx.request({
      url: this.data.loca50010 + "/user/otherLogin",
      method: "post",
      header: {
        "Content-Type": "application/json"
      },
      data: {
        otherLogin: "wx",
        openId: openId,
        icon: icon,
        userName: userName,
        sex: sex
      },
      success: res => {
        if (res.data.code == 0) {
          console.log(res)
          wx.setStorageSync('token', res.data.data.token)
          wx.setStorageSync('user', res.data.data.user)
          // wx.setStorageSync('openId', openId)
          this.onLoad();
        }
      }
    });
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