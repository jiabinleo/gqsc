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
    bannerList: [],
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    circular: true,
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
      pageSize: 6,
      order: ""
    },
    token: "",
    user: null,
    mask: "mask-close",
    active1: null,
    active2: null,
    active3: null,
    loca50010: null,
    loginMask: "loginMask-close"
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: "../logs/logs"
    });
  },
  onLoad: function () {
    var pageData = this.data.pageData;
    pageData.pageNum = 1;
    this.setData({
      pageData: pageData
    });
    if (wx.getStorageSync("token")) {
      this.setData({
        token: wx.getStorageSync("token")
      });
    }
    if (app.globalData.loca50010) {
      this.setData({
        loca50010: app.globalData.loca50010
      });
    }
    //获取用户信息
    if (wx.getStorageSync("user")) {
      this.setData({
        user: wx.getStorageSync("user")
      });
    }
    //banner
    if (app.globalData.imgUrl) {
      this.setData({
        imgUrl: app.globalData.imgUrl
      });
    }
    wx.request({
      url: this.data.loca50010 + "/supply/bannerList",
      header: {
        "Content-Type": "application/json"
      },
      success: res => {
        if (res.data.code == "0") {
          this.setData({
            bannerList: res.data.data.bannerList
          });
        } else {
          wx.showToast({
            title: res.data.message,
            icon: "none",
            duration: 2000
          });
        }
      }
    });
    this.getPage(pageData)
    //分类
    wx.request({
      url: this.data.loca50010 + "/goodsCategory/getAllTree",
      header: {
        "Content-Type": "application/json"
      },
      success: res => {
        if (res.data.code === "0") {
          this.setData({
            getAllTreeFenlei: res.data.data.trees
          });
          var treeFenlei = this.data.getAllTreeFenlei;
          treeFenlei.unshift({
            id: "",
            pid: "",
            text: "不限"
          });
          for (let i = 0; i < treeFenlei.length; i++) {
            if ("children" in treeFenlei[i]) {
              if (treeFenlei[i].children.length) {
                treeFenlei[i].children.unshift({
                  id: treeFenlei[i].id,
                  pid: treeFenlei[i].pid,
                  text: treeFenlei[i].text,
                  showText: "不限"
                });
                for (let j = 0; j < treeFenlei[i].children.length; j++) {
                  if ("children" in treeFenlei[i].children[j]) {
                    if (treeFenlei[i].children[j].children.length) {
                      treeFenlei[i].children[j].children.unshift({
                        id: treeFenlei[i].children[j].id,
                        pid: treeFenlei[i].children[j].pid,
                        text: treeFenlei[i].children[j].text,
                        showText: "不限"
                      });
                    }
                  }
                }
              }
            }
          }
          this.setData({
            getAllTreeFenlei: treeFenlei
          });
        }
      }
    });
    //地区
    wx.request({
      url: this.data.loca50010 + "/area/getAllTree",
      header: {
        "Content-Type": "application/json"
      },
      success: res => {
        if (res.data.code === "0") {
          this.setData({
            getAllTreeDiqu: res.data.data.trees
          });
          var treeDiqu = this.data.getAllTreeDiqu;
          treeDiqu.unshift({
            id: "",
            pid: "",
            text: "不限"
          });
          for (let i = 0; i < treeDiqu.length; i++) {
            if ("children" in treeDiqu[i]) {
              if (treeDiqu[i].children.length) {
                treeDiqu[i].children.unshift({
                  id: treeDiqu[i].id,
                  pid: treeDiqu[i].pid,
                  text: treeDiqu[i].text,
                  showText: "不限"
                });
                for (let j = 0; j < treeDiqu[i].children.length; j++) {
                  if ("children" in treeDiqu[i].children[j]) {
                    treeDiqu[i].children[j].children.unshift({
                      id: treeDiqu[i].children[j].id,
                      pid: treeDiqu[i].children[j].pid,
                      text: treeDiqu[i].children[j].text,
                      showText: "不限"
                    });
                  }
                }
              }
            }
          }
          this.setData({
            getAllTreeDiqu: treeDiqu
          });
        }
      }
    });
    //定位
    this.loadInfo();
  },
  //nav
  gongying: function () {
    this.setData({
      navActive: true,
      fl: false,
      dq: false,
      px: false,
      viewHeight: 0,
      active1: null,
      active2: null,
      active3: null
    });
    this.data.pageData.type = 1;
    this.data.pageData.pageNum = 1;
    this.getPage(this.data.pageData);
  },
  qiugou: function () {
    this.setData({
      navActive: false,
      fl: false,
      dq: false,
      px: false,
      viewHeight: 0,
      active1: null,
      active2: null,
      active3: null
    });
    this.data.pageData.type = 2;
    this.data.pageData.pageNum = 1;
    this.getPage(this.data.pageData);
  },
  tapMove(e) {
    this.setData({
      scrollTop: this.data.scrollTop + 10
    });
  },
  fenlei() {
    this.setData({
      treeOne: [],
      treeTwo: [],
      treeThree: [],
      active1: null,
      active2: null,
      active3: null
    });
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
    }
  },
  diqu() {
    this.setData({
      treeOne: [],
      treeTwo: [],
      treeThree: [],
      active1: null,
      active2: null,
      active3: null
    });
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
    }
  },
  paixu() {
    this.setData({
      treeOne: [],
      treeTwo: [],
      treeThree: [],
      active1: null,
      active2: null,
      active3: null
    });
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
      treeTwo: this.data.getAllTreePaixu
    });
  },
  oneTag(e) {
    this.setData({
      active1: e.target.dataset.id,
      active2: null,
      active3: null,
      treeTwo: [],
      treeThree: []
    });
    if ("children" in this.data.treeOne[e.target.dataset.id]) {
      if (this.data.treeOne[e.target.dataset.id].children.length) {
        this.setData({
          treeTwo: this.data.treeOne[e.target.dataset.id].children
        });
      } else {
        if (this.data.fl) {
          var pageData = this.data.pageData;
          pageData.cropId = e.target.id.split("t")[1];
          this.setData({
            pageData: pageData,
            flMsg: e.target.dataset.text
          });
        } else if (this.data.dq) {
          var pageData = this.data.pageData;
          pageData.cropId = e.target.id.split("t")[1];
          this.setData({
            pageData: pageData,
            dqMsg: e.target.dataset.text
          });
        }
        this.getPage(this.data.pageData);
        this.setData({
          fl: false,
          dq: false,
          px: false,
          viewHeight: 0
        });
      }
    } else {
      if (this.data.fl) {
        var pageData = this.data.pageData;
        pageData.cropId = "";
        pageData.pageNum = 1;
        this.setData({
          pageData: pageData,
          flMsg: e.target.dataset.text
        });
      } else if (this.data.dq) {
        var pageData = this.data.pageData;
        pageData.areaId = "";
        pageData.pageNum = 1;
        this.setData({
          pageData: pageData,
          dqMsg: e.target.dataset.text
        });
      }
      this.getPage(this.data.pageData);
      this.setData({
        fl: false,
        dq: false,
        px: false,
        viewHeight: 0
      });
    }
  },
  twoTag(e) {
    var pageData = this.data.pageData;
    if (this.data.px) {
      pageData.pageNum = 1;
      pageData.order = this.data.getAllTreePaixu[e.target.dataset.id].id;
      this.setData({
        pxMsg: e.target.dataset.text,
        pageData: pageData
      });
      this.getPage(this.data.pageData);
      this.setData({
        fl: false,
        dq: false,
        px: false,
        viewHeight: 0
      });
    } else {
      this.setData({
        active2: e.target.dataset.id,
        treeThree: []
      });
      if ("children" in this.data.treeTwo[e.target.dataset.id]) {
        if (this.data.treeTwo[e.target.dataset.id].children.length) {
          this.setData({
            treeThree: this.data.treeTwo[e.target.dataset.id].children
          });
        } else {
          if (this.data.fl) {
            pageData.cropId = e.target.id.split("t")[1];
            pageData.pageNum = 1;
            this.setData({
              pageData: pageData,
              flMsg: e.target.dataset.text
            });
          } else if (this.data.dq) {
            var pageData = this.data.pageData;
            pageData.areaId = e.target.id.split("t")[1];
            pageData.pageNum = 1;
            this.setData({
              pageData: pageData,
              dqMsg: e.target.dataset.text
            });
          }
          this.getPage(this.data.pageData);
          this.setData({
            fl: false,
            dq: false,
            px: false,
            viewHeight: 0
          });
        }
      } else {
        if (this.data.fl) {
          var pageData = this.data.pageData;
          pageData.cropId = e.target.id.split("t")[1];
          pageData.pageNum = 1;
          this.setData({
            pageData: pageData,
            flMsg: e.target.dataset.text
          });
        } else if (this.data.dq) {
          var pageData = this.data.pageData;
          pageData.areaId = e.target.id.split("t")[1];
          pageData.pageNum = 1;
          this.setData({
            pageData: pageData,
            dqMsg: e.target.dataset.text
          });
        }
        this.getPage(this.data.pageData);
        this.setData({
          fl: false,
          dq: false,
          px: false,
          viewHeight: 0
        });
      }
    }
  },
  threeTag(e) {
    var pageData = this.data.pageData;
    if (this.data.fl) {
      pageData.cropId = e.target.id.split("t")[1];
      this.setData({
        pageData: pageData,
        flMsg: e.target.dataset.text
      });
    } else if (this.data.dq) {
      pageData.areaId = e.target.id.split("t")[1];
      this.setData({
        pageData: pageData,
        dqMsg: e.target.dataset.text
      });
    }
    this.getPage(this.data.pageData);
    this.setData({
      fl: false,
      dq: false,
      px: false,
      viewHeight: 0
    });
  },
  //定位
  loadInfo: function () {
    wx.getLocation({
      type: "gcj02", //返回可以用于wx.openLocation的经纬度
      success: res => {
        var latitude = res.latitude; //维度
        var longitude = res.longitude; //经度
        this.loadCity(latitude, longitude);
      }
    });
  },
  loadCity: function (latitude, longitude) {
    var myAmapFun = new amapFile.AMapWX({
      key: markersData.key
    });

    myAmapFun.getWeather({
      success: data => {
        this.liveData(data.liveData.adcode);
        //成功回调
      },
      fail: function (info) {
        //失败回调
      }
    });
  },
  liveData: function (adcode) {
    wx.request({
      url: this.data.loca50010 + "/area/getAreaIdByCode?code=" + adcode,
      header: {
        "Content-Type": "application/json"
      },
      success: res => {
        wx.request({
          url: this.data.loca50010 +
            "/area/getParentList?id=" +
            res.data.data.area.id,
          header: {
            "Content-Type": "application/json"
          },
          success: res => {
            wx.setStorageSync(
              "address",
              res.data.data.list[res.data.data.list.length - 1]
            );
          }
        });
      }
    });
  },
  getPage: function (pageData) {
    var icon = null;
    var fileList = null;
    wx.showLoading({
      title: "加载中"
    });
    wx.request({
      url: this.data.loca50010 + "/supply/getPage",
      header: {
        "Content-Type": "application/json",
        login_token: this.data.token
      },
      data: {
        cropId: pageData.cropId,
        type: pageData.type,
        areaId: pageData.areaId,
        pageNum: pageData.pageNum,
        pageSize: pageData.pageSize,
        order: pageData.order
      },
      success: res => {
        wx.hideLoading();
        if (res.data.code === "0") {
          var newsList = res.data.data.page.rows;
          for (let i = 0; i < res.data.data.page.rows.length; i++) {
            icon = res.data.data.page.rows[i].icon;
            fileList = res.data.data.page.rows[i].fileList;
            if (icon) {
              if (icon.indexOf("/")) {} else {
                newsList[i].icon = this.data.imgUrl + icon;
              }
            } else {
              newsList[i].icon = "";
            }
            if (newsList[i].fileList) {
              newsList[i].fileList = fileList.split(",");
              for (let j = 0; j < newsList[i].fileList.length; j++) {
                newsList[i].fileList[j] =
                  this.data.imgUrl + newsList[i].fileList[j];
              }
            }
            newsList[i].time = this.timeConversion(newsList[i].updateTime)
          }
          this.setData({
            newList: newsList
          });
        } else {
          wx.showToast({
            title: res.data.message,
            icon: "none",
            duration: 1000
          });
        }

      }
    });
  },
  onReachBottom: function () {
    wx.showLoading({
      title: "加载中"
    });
    var pageData = this.data.pageData;
    pageData.pageNum++;
    this.setData({
      pageData: pageData
    });
    var icon = null;
    var fileList = null;
    wx.request({
      url: this.data.loca50010 + "/supply/getPage",
      header: {
        "Content-Type": "application/json",
        login_token: this.data.token
      },
      data: pageData,
      success: res => {
        wx.hideLoading();
        if (this.data.newList.length === res.data.data.page.total) {
          wx.showToast({
            title: "没有新的内容",
            icon: "none",
            duration: 1000
          });
          pageData.pageNum--;
          this.setData({
            pageData: pageData
          });
          return;
        }
        var newsList = res.data.data.page.rows;
        for (let i = 0; i < res.data.data.page.rows.length; i++) {
          icon = res.data.data.page.rows[i].icon;
          fileList = res.data.data.page.rows[i].fileList;
          if (icon) {
            if (icon.indexOf("/")) {} else {
              newsList[i].icon = this.data.imgUrl + icon;
            }
          } else {
            newsList[i].icon = "";
          }
          if (newsList[i].fileList) {
            newsList[i].fileList = fileList.split(",");
            for (let j = 0; j < newsList[i].fileList.length; j++) {
              newsList[i].fileList[j] =
                this.data.imgUrl + newsList[i].fileList[j];
            }
          }
          newsList[i].time = this.timeConversion(newsList[i].updateTime)
        }
        for (let i = 0; i < newsList.length; i++) {
          this.data.newList.push(newsList[i]);
        }
        var news = this.data.newList;
        this.setData({
          newList: news
        });
      }
    });
  },
  onTouch: function (e) {
    var user = this.data.user
    if (user && user.id) {
      if (user.id === e.currentTarget.dataset.user) {
        wx.request({
          url: this.data.loca50010 + "/user/collection/list",
          header: {
            "Content-Type": "application/json",
            "login_token": this.data.token
          },
          success: res => {
            if (res.data.code === "0") {
              if (this.data.pageData.type == 1) {
                wx.navigateTo({
                  url: "../mySupply/mySupply?id=" + e.currentTarget.dataset.id
                });
              } else if (this.data.pageData.type == 2) {
                wx.navigateTo({
                  url: "../myBuy/myBuy?id=" + e.currentTarget.dataset.id
                });
              }
            } else {
              wx.navigateTo({
                url: "../detail/detail?id=" + e.currentTarget.dataset.id
              });
            }
          }
        });

      } else {
        wx.navigateTo({
          url: "../detail/detail?id=" + e.currentTarget.dataset.id
        });
      }
    } else {
      wx.navigateTo({
        url: "../detail/detail?id=" + e.currentTarget.dataset.id
      });
    }

  },
  onPullDownRefresh() {
    wx.stopPullDownRefresh();
    this.setData({
      pageData: {
        cropId: "",
        areaId: "",
        type: 1,
        pageNum: 1,
        pageSize: 6,
        order: ""
      },
      flMsg: "选择分类",
      dqMsg: "选择地区",
      pxMsg: "排序方式"
    });
    this.onLoad();
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
    wx.request({
      url: this.data.loca50010 + "/user/collection/list",
      header: {
        "Content-Type": "application/json",
        "login_token": this.data.token
      },
      success: res => {
        if (res.data.code === "0") {
          wx.navigateTo({
            url: "../supply/supply"
          });
          this.setData({
            mask: "mask-close"
          });
        } else if (res.data.code === "9") {
          this.setData({
            loginMask: "loginMask"
          });
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 1000
          })
        }
      }
    })
  },
  buy: function () {
    wx.request({
      url: this.data.loca50010 + "/user/collection/list",
      header: {
        "Content-Type": "application/json",
        login_token: this.data.token
      },
      success: res => {
        if (res.data.code === "0") {
          wx.navigateTo({
            url: "../buy/buy"
          });
          this.setData({
            mask: "mask-close"
          });
        } else if (res.data.code === "9") {
          this.setData({
            loginMask: "loginMask"
          });
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 1000
          })
        }
      }
    })
  },
  shouCang: function (e) {
    this.getToken()
    if (e.currentTarget.dataset.iz) {
      wx.request({
        url: this.data.loca50010 + "/user/collection/cancel",
        method: "post",
        header: {
          "Content-Type": "application/json",
          login_token: this.data.token
        },
        data: {
          id: e.currentTarget.dataset.id,
          code: "gqsc"
        },
        success: res => {
          if (res.data.code === "0") {
            var asd = this.data.newList;
            asd[e.currentTarget.dataset.index].isCollection = false;
            asd[e.currentTarget.dataset.index].collectionNum -= 1;
            this.setData({
              newList: asd
            });
            wx.showToast({
              title: "取消收藏",
              icon: "none",
              duration: 2000
            });
          }
        }
      });
    } else {
      wx.request({
        url: this.data.loca50010 + "/user/collection/save",
        method: "post",
        header: {
          "Content-Type": "application/json",
          login_token: this.data.token
        },
        data: {
          id: e.currentTarget.dataset.id,
          code: "gqsc"
        },
        success: res => {
          if (res.data.code === "0") {
            var asd = this.data.newList;
            asd[e.currentTarget.dataset.index].isCollection = true;
            asd[e.currentTarget.dataset.index].collectionNum += 1;
            this.setData({
              newList: asd
            });
            wx.showToast({
              title: "收藏成功",
              icon: "success",
              duration: 2000
            });
          } else if (res.data.code === "9") {
            this.setData({
              loginMask: "loginMask"
            });
          }
        }
      });
    }
  },
  getUserInfo: function (e) {
    wx.showLoading({
      title: "加载中"
    });
    this.setData({
      loginMask: "loginMask-close"
    });
    wx.login({
      success: res => {
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
  hideMask: function () {
    this.setData({
      loginMask: "loginMask-close"
    });
  },
  timeConversion: function timeConversion(oldTime, tipMsg) {
    var timeText = ""
    if (tipMsg == undefined) {
      var tipMsg = "刚刚发布";
    }
    var disTime = Date.parse(new Date()) - new Date(oldTime).getTime();
    if (disTime < 60 * 1000) {
      timeText = tipMsg;
    } else if (disTime < 60 * 60 * 1000) {
      timeText = parseInt(disTime / 60 / 1000) + "\u5206\u949F\u524D";
    } else if (disTime < 24 * 60 * 60 * 1000) {
      timeText = parseInt(disTime / 60 / 60 / 1000) + "\u5C0F\u65F6\u524D";
    } else {
      timeText = oldTime.split(' ')[0];
    }
    return timeText;
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},
  getToken: function () {
    if (wx.getStorageSync("token")) {
      this.setData({
        token: wx.getStorageSync("token")
      })
    }
  }
});