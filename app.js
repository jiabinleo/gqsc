//app.js
App({
  onLaunch: function() {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    });
    wx.checkSession({
      success() {
        // session_key 未过期，并且在本生命周期一直有效
        wx.login() // 重新登录
      },
      fail() {
        // session_key 已经失效，需要重新执行登录流程
        wx.login() // 重新登录
      }
    })
  },

  globalData: {
    userInfo: null,
    imgUrl: "https://www.kwantler.com.cn",
    uploadImg: 'https://www.kwantler.com.cn',
    loca50010: 'https://www.kwantler.com.cn/v1',
  }
})