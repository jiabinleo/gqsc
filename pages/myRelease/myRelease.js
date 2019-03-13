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
    pageType: 1,
    loca50010: null,
    token: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      imgUrl: app.globalData.imgUrl
    })
    if (wx.getStorageSync("token")) {
      this.setData({
        token: wx.getStorageSync("token")
      })
    }
    wx.setNavigationBarTitle({
      title: '我的发布'
    })
    if (app.globalData.loca50010) {
      this.setData({
        loca50010: app.globalData.loca50010
      })
    }
    this.getMyPage()
  },
  getMyPage: function() {
    var pageData = this.data.pageData
    wx.request({
      url: this.data.loca50010 + "/supply/getMyPage",
      header: {
        "Content-Type": "application/json",
        "login_token": this.data.token
      },
      data: {
        type: pageData.type,
        pageNum: 1,
        pageSize: pageData.pageSize
      },
      success: res => {
        if (res.data.code === "0") {
          var pageRows = res.data.data.page.rows
          for (let i = 0; i < pageRows.length; i++) {
            if (pageRows[i].fileList) {
              pageRows[i].imgFile0 = pageRows[i].fileList.split(',')[0]
              pageRows[i].time = pageRows[i].publishTime.split(' ')[0]
            } else {
              pageRows[i].imgFile0 = pageRows[i].fileList
              pageRows[i].time = pageRows[i].publishTime.split(' ')[0]
            }
          }
          this.setData({
            pageRows: pageRows
          })
        }
      }
    });
  },
  onReachBottom: function() {
    this.data.pageData.pageNum += 1;
    var pageData = this.data.pageData;
    wx.request({
      url: this.data.loca50010 + "/supply/getMyPage",
      header: {
        "Content-Type": "application/json",
        "login_token": this.data.token
      },
      data: {
        type: pageData.type,
        pageNum: pageData.pageNum,
        pageSize: pageData.pageSize
      },
      success: res => {
        if (this.data.pageRows.length === res.data.data.page.total) {
          return;
        }
        var newsList = res.data.data.page.rows;
        for (let i = 0; i < newsList.length; i++) {
          if (newsList[i].fileList) {
            newsList[i].imgFile0 = newsList[i].fileList.split(',')[0]
            newsList[i].time = newsList[i].publishTime.split(' ')[0]
            this.data.pageRows.push(newsList[i]);
          } else {
            newsList[i].imgFile0 = newsList[i].fileList
            newsList[i].time = newsList[i].publishTime
            this.data.pageRows.push(newsList[i]);
          }

        }
        var news = this.data.pageRows;
        this.setData({
          pageRows: news
        });
      }
    });
  },
  delMsg: function(e) {
    console.log(e)
    this.setData({
      modalFlag: false
    })
    wx.showModal({
      title: "确定删除",
      content: e.currentTarget.dataset.title + '',
      confirmColor: '#3CC51F',
      success: res => {
        if (res.confirm) {
          wx.request({
            url: this.data.loca50010 + "/supply/cancel/" + e.currentTarget.dataset.id,
            header: {
              "Content-Type": "application/json",
              "login_token": this.data.token
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
  touchList: function(e) {
    console.log(e.currentTarget.dataset.id)
    console.log('=======')
  },
  onTouch: function(e) {
    console.log(e.currentTarget.dataset.type)
    if (e.currentTarget.dataset.type == 1) {
      wx.navigateTo({
        url: "../mySupply/mySupply?id=" + e.currentTarget.dataset.id
      });
    } else if (e.currentTarget.dataset.type == 2) {
      wx.navigateTo({
        url: "../myBuy/myBuy?id=" + e.currentTarget.dataset.id
      });
    }

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