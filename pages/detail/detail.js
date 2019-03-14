// pages/detail/detail.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    marketSupply: '',
    fileList: [],
    publishTime: '',
    supplyTime: '',
    phoneNumber: '',
    isCollection: false,
    priceDW: "",
    loca50010: null,
    loginMask: "loginMask-close"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: "加载中"
    });
    if (app.globalData.imgUrl) {
      this.setData({
        imgUrl: app.globalData.imgUrl
      });
    }
    if (app.globalData.loca50010) {
      this.setData({
        loca50010: app.globalData.loca50010
      });
    }
    console.log(options)
    var my_token = wx.getStorageSync("token");
    wx.request({
      url: this.data.loca50010 + "/supply/detail/" + options.id,
      header: {
        "Content-Type": "application/json",
        "login_token": my_token
      },
      success: res => {
        wx.hideLoading();
        var _marketSupply = res.data.data.marketSupply
        this.setData({
          isCollection: _marketSupply.isCollection
        })
        var icon = _marketSupply.icon
        if (icon) {
          if (icon.indexOf("/")) {} else {
            _marketSupply.icon = this.data.imgUrl + icon;
          }
        } else {
          _marketSupply.icon = "";
        }
        var _fileList = []
        if (_marketSupply.fileList) {
          for (let i = 0; i < _marketSupply.fileList.split(',').length; i++) {
            _fileList.push(this.data.imgUrl + _marketSupply.fileList.split(',')[i])
          }
        } else {
          _fileList = _marketSupply.fileList
        }
        var publishTime = _marketSupply.publishTime.split(' ')[0]
        var supplyTime = _marketSupply.supplyTime.split(' ')[0].split('-')
        var _supplyTime = supplyTime[0] + '年' + supplyTime[1] + '月' + supplyTime[2] + '日'
        console.log(_marketSupply.price)
        var reg = /^[0-9]+.?[0-9]*$/
        if (!reg.test(_marketSupply.price)) {
          if (_marketSupply.price) {} else {
            this.setData({
              priceDW: "面议"
            })
          }
        } else {
          this.setData({
            priceDW: "元/斤"
          })
        }
        this.setData({
          marketSupply: _marketSupply,
          fileList: _fileList,
          publishTime: publishTime,
          supplyTime: _supplyTime,
          phoneNumber: _marketSupply.telephone
        })
      }
    });
  },
  shouCang: function (e) {
    var my_token = wx.getStorageSync("token");
    if (e.currentTarget.dataset.iz) {
      wx.request({
        url: this.data.loca50010 + "/user/collection/cancel",
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
            this.setData({
              isCollection: false
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
          login_token: my_token
        },
        data: {
          "id": e.currentTarget.dataset.id,
          "code": "gqsc"
        },
        success: res => {
          console.log(res);
          if (res.data.code === "0") {
            this.setData({
              isCollection: true
            })
            wx.showToast({
              title: '收藏成功',
              icon: 'success',
              duration: 2000
            })
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
      });
    }
  },
  ylImg: function (e) {
    console.log("预览图片")
    console.log(e)
    if (this.data.fileList) {
      wx.previewImage({
        current: this.data.fileList[0], // 当前显示图片的http链接
        urls: this.data.fileList // 需要预览的图片http链接列表
      })
    }
  },
  getUserInfo: function (e) {
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  tel: function () {
    console.log()
    wx.makePhoneCall({
      phoneNumber: this.data.phoneNumber
    })
  }
})