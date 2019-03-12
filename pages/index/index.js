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
    token: "",
    user: null,
    mask: "mask-close",
    active1: null,
    active2: null,
    active3: null,
    loca50010: null
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: "../logs/logs"
    });
  },
  bindUserTap: function () {
    wx.navigateTo({
      url: "../userCenter/userCenter"
    });
  },
  onLoad: function () {
    if (wx.getStorageSync('token')) {
      this.setData({
        token: wx.getStorageSync('token')
      })
    }
    if (app.globalData.loca50010) {
      this.setData({
        loca50010: app.globalData.loca50010
      })
    }
    //获取用户信息
    if (wx.getStorageSync("user")) {
      this.setData({
        user: wx.getStorageSync("user")
      })
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
            icon: 'none',
            duration: 2000
          })
        }
      }
    });
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
          var treeFenlei = this.data.getAllTreeFenlei
          treeFenlei.unshift({
            id: "",
            pid: "",
            text: "全部",
            children: []
          })
          for (let i = 0; i < treeFenlei.length; i++) {
            treeFenlei[i].children.unshift({
              id: treeFenlei[i].id,
              pid: treeFenlei[i].pid,
              text: treeFenlei[i].text,
              children: []
            })
            for (let j = 0; j < treeFenlei[i].children.length; j++) {
              treeFenlei[i].children[j].children.unshift({
                id: treeFenlei[i].children[j].id,
                pid: treeFenlei[i].children[j].pid,
                text: treeFenlei[i].children[j].text
              })
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
          var treeDiqu = this.data.getAllTreeDiqu
          treeDiqu.unshift({
            id: "",
            pid: "",
            text: "全部",
            children: []
          })
          for (let i = 0; i < treeDiqu.length; i++) {
            treeDiqu[i].children.unshift({
              id: treeDiqu[i].id,
              pid: treeDiqu[i].pid,
              text: treeDiqu[i].text,
              children: []
            })
            for (let j = 0; j < treeDiqu[i].children.length; j++) {
              treeDiqu[i].children[j].children.unshift({
                id: treeDiqu[i].children[j].id,
                pid: treeDiqu[i].children[j].pid,
                text: treeDiqu[i].children[j].text
              })
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
    console.log();
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
    this.setData({
      active1: null,
      active2: null,
      active3: null
    })
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
    this.setData({
      active1: null,
      active2: null,
      active3: null
    })
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
    this.setData({
      active1: null,
      active2: null,
      active3: null
    })
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
    this.setData({
      active1: e.target.dataset.id,
      active2: null,
      active3: null
    })
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
    this.setData({
      active2: e.target.dataset.id
    })
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
    console.log(e._relatedInfo.anchorTargetText)
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
  loadInfo: function () {
    var that = this;
    wx.getLocation({
      type: "gcj02", //返回可以用于wx.openLocation的经纬度
      success: function (res) {
        var latitude = res.latitude; //维度
        var longitude = res.longitude; //经度
        that.loadCity(latitude, longitude);
      }
    });
  },
  loadCity: function (latitude, longitude) {
    var myAmapFun = new amapFile.AMapWX({
      key: markersData.key
    });
    myAmapFun.getRegeo({
      location: "" + longitude + "," + latitude + "", //location的格式为'经度,纬度'
      success: function (data) {
        // console.log(data);
      },
      fail: function (info) {}
    });

    myAmapFun.getWeather({
      success: data => {
        this.setData({
          weather: data
        });
        this.liveData(data.liveData.adcode);
        //成功回调
      },
      fail: function (info) {
        //失败回调
        console.log(info);
      }
    });
  },
  liveData: function (adcode) {
    console.log(adcode);
    wx.request({
      url: this.data.loca50010 + "/area/getAreaIdByCode?code=" + adcode,
      header: {
        "Content-Type": "application/json"
      },
      success: res => {
        console.log(res)
        wx.request({
          url: this.data.loca50010 + "/area/getParentList?id=" +
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
            this.setData({
              dqMsg: res.data.data.list[res.data.data.list.length - 1].areaName
            })
          }
        });
      }
    });
  },
  getPage: function (pageData) {
    console.log(pageData);
    var that = this;
    var icon = null;
    var fileList = null;
    wx.request({
      url: this.data.loca50010 + "/supply/getPage",
      header: {
        "Content-Type": "application/json",
        "login_token": this.data.token
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
        }
        this.setData({
          newList: newsList
        });
      }
    });
  },
  onReachBottom: function () {
    this.data.pageData.pageNum += 1;
    var pageData = this.data.pageData;
    var that = this;
    var icon = null;
    var fileList = null;
    wx.request({
      url: this.data.loca50010 + "/supply/getPage",
      header: {
        "Content-Type": "application/json",
        "login_token": this.data.token
      },
      data: {
        type: pageData.type,
        areaId: pageData.areaId,
        pageNum: pageData.pageNum,
        pageSize: pageData.pageSize,
        order: pageData.order
      },
      success: function (res) {
        if (this.data.newList.length === res.data.data.page.total) {
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
  onTouch: function (e) {
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
  shouCang: function (e) {
    if (e.currentTarget.dataset.iz) {
      wx.request({
        url: this.data.loca50010 + "/user/collection/cancel",
        method: "post",
        header: {
          "Content-Type": "application/json",
          login_token: this.data.token
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
        url: this.data.loca50010 + "/user/collection/save",
        method: "post",
        header: {
          "Content-Type": "application/json",
          "login_token": this.data.token
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
          } else if (res.data.code === "9") {
            this.toLoginPage()
          }
        }
      });
    }
  },
  toLoginPage: function () {
    wx.showModal({
      title: '未登录',
      content: '确认跳转到登录页面',
      success(res) {
        if (res.confirm) {
          wx.navigateTo({
            url: "../userCenter/userCenter"
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {}
});