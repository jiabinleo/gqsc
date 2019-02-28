//index.js
//获取应用实例
const app = getApp()
const order = ['red', 'yellow', 'blue', 'green', 'red']
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    //
    bannerList: [],
    indicatorDots: true,
    vertical: false,
    autoplay: false,
    circular: false,
    interval: 2000,
    duration: 500,
    navActive: true,
    ///
    toView: 'red',
    scrollTop: 100,
    //
    getAllTreeFenlei: [],
    getAllTreeDiqu: [],
    getAllTreePaixu: [],
    treeOne: [],
    treeTwo: [],
    treeThree: []
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    var _this = this;
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    //banner
    if (app.globalData.imgUrl) {
      this.setData({
        imgUrl: app.globalData.imgUrl
      })
    }
    wx.request({
      url: 'http://120.78.209.238:50010/v1/supply/bannerList',
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log(res.data.data.bannerList)
        _this.setData({
          bannerList: res.data.data.bannerList
        })
      }
    })
    //分类
    wx.request({
      url: 'http://120.78.209.238:50010/v1/goodsCategory/getAllTree',
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log(res.data.code)
        if (res.data.code === "0") {
          _this.setData({
            getAllTreeFenlei: res.data.data.trees
          })
        }

      }
    })
    //地区
    wx.request({
      url: 'http://120.78.209.238:50010/v1/area/getAllTree',
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log(res.data.code)
        if (res.data.code === "0") {
          _this.setData({
            getAllTreeDiqu: res.data.data.trees
          })
        }

      }
    })
  },
  //nav
  gongying: function (e) {
    this.setData({
      navActive: true
    })
  },
  qiugou: function (e) {
    this.setData({
      navActive: false
    })
  },
  /////
  upper(e) {
    console.log(e)
  },
  lower(e) {
    console.log(e)
  },
  scroll(e) {
    console.log(e)
  },
  tap(e) {
    if (this.getAllTree) {
      for (let i = 0; i < getAllTree.length; ++i) {
        console.log(getAllTree[i + 1])
        // if (order[i] === this.data.toView) {
        //   this.setData({
        //     toView: order[i + 1]
        //   })
        //   break
        // }
      }
    }

  },
  tapMove(e) {
    this.setData({
      scrollTop: this.data.scrollTop + 10
    })
  },
  fenlei() {
    if (this.data.getAllTreeFenlei) {
      this.setData({
        treeOne: this.data.getAllTreeFenlei
      })
      if (this.data.treeOne) {
        console.log()
        this.setData({
          treeTwo: this.data.treeOne[0].children
        })
        if (this.data.treeTwo) {
          console.log()
          this.setData({
            treeThree: this.data.treeTwo[0].children
          })

        }
      }
    }

  },
  diqu() {
    this.setData({
      treeOne: this.data.getAllTreeDiqu,
      treeTwo: this.data.getAllTreeDiqu[0].children
    })
  },
  paixu() {
    this.setData({
      treeOne: this.data.getAllTreePaixu,
      treeTwo: this.data.getAllTreePaixu[0].children
    })
  },
  oneTag(e) {
    console.log(e.target.dataset.id)
    console.log(this.data.treeOne[e.target.dataset.id].children)
    this.setData({
      treeTwo: this.data.treeOne[e.target.dataset.id].children
    })
  }
})