//index.js
//获取应用实例
const app = getApp();
var amapFile = require("../../libs/amap-wx.js");
var markersData = {
  latitude: "",
  longitude: "",
  key: "91f73a47961dd8ee8fdd64cbb0232bfe"
};
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse("button.open-type.getUserInfo"),
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
    toView: "red",
    scrollTop: 100,
    //
    getAllTreeFenlei: [],
    getAllTreeDiqu: [],
    getAllTreePaixu: [{
        text: "不限",
        id: ""
      },
      {
        text: "时间最新",
        id: "time_desc"
      },
      {
        text: "距离最近",
        id: "distance"
      },
      {
        text: "人气最高",
        id: "hot_desc"
      }
    ],
    treeOne: [],
    treeTwo: [],
    treeThree: [],
    viewHeight: 0,
    //
    fl: false,
    dq: false,
    px: false,
    flMsg: "选择分类",
    dqMsg: "选择地区",
    pxMsg: "排序方式",
    newList: [],
    pageData: {
      cropId: "",
      areaId: "",
      type: 1,
      pageNum: 1,
      pageSize: 3,
      order: ""
    },
    token: null,
    user: null,
    mask: "mask-close",
    openid: null
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: "../logs/logs"
    });
  },
  bindUserTap: function() {
    wx.navigateTo({
      url: "../userCenter/userCenter"
    });
  },
  onLoad: function() {
    var _this = this;
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      });
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        });
      };
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo;
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          });
        }
      });
    }
    //获取用户信息
    if (wx.getStorageSync("token")) {
      this.data.token = wx.getStorageSync("token");
    }
    if (wx.getStorageSync("user")) {
      this.data.user = wx.getStorageSync("user");
    }
    //banner
    if (app.globalData.imgUrl) {
      this.setData({
        imgUrl: app.globalData.imgUrl
      });
    }
    wx.request({
      url: "http://120.78.209.238:50010/v1/supply/bannerList",
      header: {
        "Content-Type": "application/json"
      },
      success: res => {
        console.log(res)
        if (res.data.code == "0") {
          this.setData({
            bannerList: res.data.data.bannerList
          });
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 2000
          })
        }

      }
    });
    //分类
    wx.request({
      url: "http://120.78.209.238:50010/v1/goodsCategory/getAllTree",
      header: {
        "Content-Type": "application/json"
      },
      success: res => {
        if (res.data.code === "0") {
          this.setData({
            getAllTreeFenlei: res.data.data.trees
          });
        }
      }
    });
    //地区
    wx.request({
      url: "http://120.78.209.238:50010/v1/area/getAllTree",
      header: {
        "Content-Type": "application/json"
      },
      success: res => {
        if (res.data.code === "0") {
          this.setData({
            getAllTreeDiqu: res.data.data.trees
          });
        }
      }
    });
    //定位
    this.loadInfo();
    console.log();
  },
  //nav
  gongying: function() {
    this.setData({
      navActive: true,
      fl: false,
      dq: false,
      px: false,
      viewHeight: 0
    });
    this.data.pageData.type = 1;
    this.data.pageData.pageNum = 1;
    this.getPage(this.data.pageData);
  },
  qiugou: function() {
    this.setData({
      navActive: false,
      fl: false,
      dq: false,
      px: false,
      viewHeight: 0
    });
    this.data.pageData.type = 2;
    this.data.pageData.pageNum = 1;
    this.getPage(this.data.pageData);
  },
  /////
  upper(e) {
    // console.log(e);
  },
  lower(e) {
    // console.log(e);
  },
  scroll(e) {
    // console.log(e);
  },
  tap(e) {
    // console.log(e);
  },
  tapMove(e) {
    this.setData({
      scrollTop: this.data.scrollTop + 10
    });
  },
  fenlei() {
    if (this.data.fl) {
      this.setData({
        fl: false,
        dq: false,
        px: false,
        viewHeight: 0
      });
    } else {
      this.setData({
        fl: true,
        dq: false,
        px: false,
        viewHeight: 200
      });
    }
    if (this.data.getAllTreeFenlei) {
      this.setData({
        treeOne: this.data.getAllTreeFenlei
      });
      if (this.data.treeOne) {
        // if (this.data.treeOne[0].children) {
        this.setData({
          treeTwo: this.data.treeOne[0].children
        });
        if (this.data.treeTwo) {
          this.setData({
            treeThree: this.data.treeTwo[0].children
          });
        }
      }
    }
  },
  diqu() {
    if (this.data.dq) {
      this.setData({
        fl: false,
        dq: false,
        px: false,
        viewHeight: 0
      });
    } else {
      this.setData({
        fl: false,
        dq: true,
        px: false,
        viewHeight: 200
      });
    }
    if (this.data.getAllTreeDiqu) {
      this.setData({
        treeOne: this.data.getAllTreeDiqu
      });
      if (this.data.treeOne) {
        // if (this.data.treeOne[0].children) {
        this.setData({
          treeTwo: this.data.treeOne[0].children
        });
        if (this.data.treeTwo) {
          console.log(this.data.treeTwo);
          this.setData({
            treeThree: this.data.treeTwo[0].children
          });
        }
      }
    }
  },
  paixu() {
    if (this.data.px) {
      this.setData({
        fl: false,
        dq: false,
        px: false,
        viewHeight: 0
      });
    } else {
      this.setData({
        fl: false,
        dq: false,
        px: true,
        viewHeight: 200
      });
    }
    this.setData({
      treeOne: [],
      treeTwo: this.data.getAllTreePaixu,
      treeThree: []
    });
  },
  oneTag(e) {
    console.log(e);
    if (this.data.treeOne[e.target.dataset.id].children.length) {
      this.setData({
        treeTwo: this.data.treeOne[e.target.dataset.id].children
      });
      if (this.data.treeTwo[0].children.length) {
        console.log(e.target);
        this.setData({
          treeThree: this.data.treeTwo[0].children
        });
      } else {
        console.log(this.data.treeTwo);
        this.setData({
          treeThree: [{
            text: this.data.treeTwo[0].text,
            id: this.data.treeTwo[0].id
          }]
        });
      }
    } else {
      this.setData({
        treeTwo: [{
          text: e._relatedInfo.anchorTargetText,
          id: e.target.id.split("t")[1]
        }]
      });
      this.setData({
        treeThree: [{
          text: this.data.treeTwo[0].text,
          id: e.target.id.split("t")[1]
        }]
      });
    }
  },
  twoTag(e) {
    if (this.data.treeTwo[e.target.dataset.id].hasOwnProperty("children")) {
      console.log(e.target.dataset.id);
      if (this.data.treeTwo[e.target.dataset.id].children.length) {
        this.setData({
          treeThree: this.data.treeTwo[e.target.dataset.id].children
        });
      } else {
        this.setData({
          treeThree: [{
            text: this.data.treeTwo[e.target.dataset.id].text,
            id: e.target.id.split("t")[1]
          }]
        });
      }
    } else {
      if (this.data.px) {
        this.setData({
          fl: false,
          dq: false,
          px: false,
          viewHeight: 0
        });
        this.data.pageData.pageNum = 1;
        this.data.pageData.order = this.data.getAllTreePaixu[
          e.target.dataset.id
        ].id;
        this.getPage(this.data.pageData);
        this.setData({
          pxMsg: e._relatedInfo.anchorTargetText
        });
      }
    }
  },
  threeTag(e) {
    if (this.data.fl) {
      this.data.pageData.cropId = e.target.id.split("t")[1];
      this.setData({
        flMsg: e._relatedInfo.anchorTargetText
      });
    } else if (this.data.dq) {
      this.data.pageData.areaId = e.target.id.split("t")[1];
      this.setData({
        dqMsg: e._relatedInfo.anchorTargetText
      });
    }
    this.setData({
      fl: false,
      dq: false,
      px: false,
      viewHeight: 0
    });
    this.getPage(this.data.pageData);
  },
  //定位
  loadInfo: function() {
    var that = this;
    wx.getLocation({
      type: "gcj02", //返回可以用于wx.openLocation的经纬度
      success: function(res) {
        var latitude = res.latitude; //维度
        var longitude = res.longitude; //经度
        that.loadCity(latitude, longitude);
      }
    });
  },
  loadCity: function(latitude, longitude) {
    var that = this;
    var myAmapFun = new amapFile.AMapWX({
      key: markersData.key
    });
    myAmapFun.getRegeo({
      location: "" + longitude + "," + latitude + "", //location的格式为'经度,纬度'
      success: function(data) {
        // console.log(data);
      },
      fail: function(info) {}
    });

    myAmapFun.getWeather({
      success: function(data) {
        that.setData({
          weather: data
        });
        that.liveData(data.liveData.adcode);
        //成功回调
      },
      fail: function(info) {
        //失败回调
        console.log(info);
      }
    });
  },
  liveData: function(adcode) {
    console.log(adcode);
    var that = this;
    wx.request({
      url: "http://120.78.209.238:50010/v1/area/getAreaIdByCode?code=" + adcode,
      header: {
        "Content-Type": "application/json"
      },
      success: res => {
        wx.request({
          url: "http://120.78.209.238:50010/v1/area/getParentList?id=" +
            res.data.data.area.id,
          header: {
            "Content-Type": "application/json"
          },
          success: res => {
            this.data.pageData.areaId =
              res.data.data.list[res.data.data.list.length - 1].id;
            this.getPage(this.data.pageData);
            console.log();
            wx.setStorageSync(
              "address",
              res.data.data.list[res.data.data.list.length - 1]
            );
          }
        });
      }
    });
  },
  getPage: function(pageData) {
    console.log(pageData);
    var that = this;
    var icon = null;
    var fileList = null;
    var my_token = wx.getStorageSync("token");
    wx.request({
      url: "http://120.78.209.238:50010/v1/supply/getPage",
      header: {
        "Content-Type": "application/json",
        "login_token": my_token
      },
      data: {
        cropId: pageData.cropId,
        type: pageData.type,
        areaId: pageData.areaId,
        pageNum: pageData.pageNum,
        pageSize: pageData.pageSize,
        order: pageData.order
      },
      success: function(res) {
        var newsList = res.data.data.page.rows;
        for (let i = 0; i < res.data.data.page.rows.length; i++) {
          icon = res.data.data.page.rows[i].icon;
          fileList = res.data.data.page.rows[i].fileList;
          if (icon) {
            if (icon.indexOf("/")) {} else {
              newsList[i].icon = that.data.imgUrl + icon;
            }
          } else {
            newsList[i].icon = "";
          }
          if (newsList[i].fileList) {
            newsList[i].fileList = fileList.split(",");
            for (let j = 0; j < newsList[i].fileList.length; j++) {
              newsList[i].fileList[j] =
                that.data.imgUrl + newsList[i].fileList[j];
            }
          }
        }
        that.setData({
          newList: newsList
        });
      }
    });
  },
  onReachBottom: function() {
    this.data.pageData.pageNum += 1;
    var pageData = this.data.pageData;
    var that = this;
    var icon = null;
    var fileList = null;
    var my_token = wx.getStorageSync("token");
    wx.request({
      url: "http://120.78.209.238:50010/v1/supply/getPage",
      header: {
        "Content-Type": "application/json",
        "login_token": my_token
      },
      data: {
        type: pageData.type,
        areaId: pageData.areaId,
        pageNum: pageData.pageNum,
        pageSize: pageData.pageSize,
        order: pageData.order
      },
      success: function(res) {
        if (that.data.newList.length === res.data.data.page.total) {
          return;
        }
        var newsList = res.data.data.page.rows;
        for (let i = 0; i < res.data.data.page.rows.length; i++) {
          icon = res.data.data.page.rows[i].icon;
          fileList = res.data.data.page.rows[i].fileList;
          if (icon) {
            if (icon.indexOf("/")) {} else {
              newsList[i].icon = that.data.imgUrl + icon;
            }
          } else {
            newsList[i].icon = "";
          }
          if (newsList[i].fileList) {
            newsList[i].fileList = fileList.split(",");
            for (let j = 0; j < newsList[i].fileList.length; j++) {
              newsList[i].fileList[j] =
                that.data.imgUrl + newsList[i].fileList[j];
            }
          }
        }
        for (let i = 0; i < newsList.length; i++) {
          that.data.newList.push(newsList[i]);
        }
        var news = that.data.newList;
        that.setData({
          newList: news
        });
      }
    });
  },
  onTouch: function(e) {
    wx.navigateTo({
      url: "../detail/detail?id=" + e.currentTarget.dataset.id
    });
  },
  onPullDownRefresh() {
    wx.stopPullDownRefresh();
    this.setData({
      pageData: {
        cropId: "",
        areaId: "",
        type: 1,
        pageNum: 1,
        pageSize: 3,
        order: ""
      },
      flMsg: '选择分类',
      dqMsg: '选择地区',
      pxMsg: '排序方式'
    })
    this.onLoad();
    console.log(this.data.pageData);
    console.log("下拉刷新");
  },
  getUserInfo: function(e) {
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
                app.globalData.userInfo = e.detail.userInfo;
                this.setData({
                  userInfo: e.detail.userInfo,
                  hasUserInfo: true
                });
                console.log(e.detail.userInfo);
                var userInfo = e.detail.userInfo;
                this.setData({
                  openid: res.data.openid
                });
                this.autoLogin(
                  res.data.openid,
                  userInfo.avatarUrl,
                  userInfo.nickName,
                  userInfo.gender
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
          this.onLoad();
        }
      }
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
  shouCang: function(e) {
    console.log(e.currentTarget.dataset.iz);
    console.log(e.currentTarget.dataset.id);
    console.log(e.currentTarget.dataset.index);
    var my_token = wx.getStorageSync("token");
    if (e.currentTarget.dataset.iz) {
      wx.request({
        url: "http://120.78.209.238:50010/v1/user/collection/cancel",
        method: "post",
        header: {
          "Content-Type": "application/json",
          login_token: my_token
        },
        data: {
          "id": e.currentTarget.dataset.id,
          "code": "gqsc"
        },
        success: res => {
          console.log(res);
          if (res.data.code === "0") {

            var asd = this.data.newList
            asd[e.currentTarget.dataset.index].isCollection = false
            asd[e.currentTarget.dataset.index].collectionNum -= 1
            this.setData({
              newList: asd
            })
            wx.showToast({
              title: '取消收藏',
              icon: 'none',
              duration: 2000
            })
          }
        }
      });
    } else {
      wx.request({
        url: "http://120.78.209.238:50010/v1/user/collection/save",
        method: "post",
        header: {
          "Content-Type": "application/json",
          login_token: my_token
        },
        data: {
          "id": e.currentTarget.dataset.id,
          "code": "gqsc"
        },
        success: res => {
          console.log(res);
          if (res.data.code === "0") {

            var asd = this.data.newList
            asd[e.currentTarget.dataset.index].isCollection = true
            asd[e.currentTarget.dataset.index].collectionNum += 1
            this.setData({
              newList: asd
            })
            wx.showToast({
              title: '收藏成功',
              icon: 'success',
              duration: 2000
            })
          }
        }
      });
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {}
});