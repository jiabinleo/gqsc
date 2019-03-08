// pages/myRelease/myRelease.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageData: {
      type: 1,
      pageNum: 1,
      pageSize: 6
    },
    pageRows: [],
    imgUrl: null,
    modalFlag: true,
    btn1: 'btn',
    btn2: '',
    pageType: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      imgUrl: app.globalData.imgUrl
    })
    wx.setNavigationBarTitle({
      title: '我的收藏'
    })
    this.getMyPage()
  },
  getMyPage: function() {
    var pageData = this.data.pageData
    var my_token = wx.getStorageSync("token");
    wx.request({
      url: "http://120.78.209.238:50010/v1/user/collection/list",
      header: {
        "Content-Type": "application/json",
        login_token: my_token
      },
      success: res => {
        if (res.data.code === "0") {
          console.log(res)
          var pageRows = res.data.data.list
          for (let i = 0; i < pageRows.length; i++) {
            // if (pageRows[i].icon) {
            pageRows[i].icon = this.data.imgUrl + pageRows[i].icon
            pageRows[i].time = pageRows[i].updateTime
            // } else {
            //   pageRows[i].icon = pageRows[i].icon
            //   pageRows[i].time = pageRows[i].updateTime
            // }
          }
          this.setData({
            pageRows: pageRows
          })
        } else if (res.data.code === "9") {
          wx.showToast({
            title: "正在重新登录",
            icon: "none",
            duration: 2000
          });
          this.autoLogin(
            app.globalData.openid,
            app.globalData.userInfo.avatarUrl,
            app.globalData.userInfo.nickName,
            app.globalData.userInfo.gender
          );
        }
      }
    });
  },
  autoLogin: function(openId, icon, userName, sex) {
    wx.request({
      url: "http://120.78.209.238:50010/v1/user/otherLogin",
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
        console.log(res);
        if (res.data.code == 0) {
          wx.setStorageSync("token", res.data.data.token);
          wx.setStorageSync("user", res.data.data.user);
          console.log(res.data.data.token);
          this.setData({
            token: res.data.data.token,
            user: res.data.data.user
          });
          this.getMyPage()
        }
      }
    });
  },
  // onReachBottom: function () {
  //   this.data.pageData.pageNum += 1;
  //   var pageData = this.data.pageData;
  //   var my_token = wx.getStorageSync("token");
  //   wx.request({
  //     url: "http://120.78.209.238:50010/v1/user/collection/cancel",
  //     method: "POST",
  //     header: {
  //       "Content-Type": "application/json",
  //       login_token: my_token
  //     },
  //     data: {
  //       id: e.currentTarget.dataset.detailid,
  //       code: 'gqsc'
  //     },
  //     success: res => {
  //       if (this.data.pageRows.length === res.data.data.page.total) {
  //         return;
  //       }
  //       var newsList = res.data.data.page.rows;
  //       for (let i = 0; i < newsList.length; i++) {
  //         if (newsList[i].fileList) {
  //           newsList[i].imgFile0 = newsList[i].fileList.split(',')[0]
  //           newsList[i].time = newsList[i].publishTime.split(' ')[0]
  //           this.data.pageRows.push(newsList[i]);
  //         } else {
  //           newsList[i].imgFile0 = newsList[i].fileList
  //           newsList[i].time = newsList[i].publishTime
  //           this.data.pageRows.push(newsList[i]);
  //         }

  //       }
  //       var news = this.data.pageRows;
  //       this.setData({
  //         pageRows: news
  //       });
  //     }
  //   });
  // },
  delMsg: function(e) {
    console.log(e)
    this.setData({
      modalFlag: false
    })
    wx.showModal({
      title: "确定取消收藏",
      content: e.currentTarget.dataset.title + '',
      confirmColor: '#3CC51F',
      success: res => {
        if (res.confirm) {
          var my_token = wx.getStorageSync("token");
          wx.request({
            url: "http://120.78.209.238:50010/v1/user/collection/cancel",
            method: "POST",
            header: {
              "Content-Type": "application/json",
              login_token: my_token
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
    console.log(e.currentTarget.dataset.type)
    var pageData = this.data.pageData
    pageData.type = Number(e.currentTarget.dataset.type)
    pageData.pageNum = 1
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
    this.setData({
      pageData: pageData
    })
    this.getMyPage()
  },
  onTouch: function(e) {
    wx.navigateTo({
      url: "../detail/detail?id=" + e.currentTarget.dataset.detailid
    });
  },
  onPullDownRefresh() {
    console.log('刷新了')
    wx.stopPullDownRefresh();
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

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  preventTouchMove: function() {},
  /**
   * 页面上拉触底事件的处理函数
   */

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})