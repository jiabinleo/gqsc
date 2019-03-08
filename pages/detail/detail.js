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
    priceDW: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (app.globalData.imgUrl) {
      this.setData({
        imgUrl: app.globalData.imgUrl
      });
    }
    console.log(options)
    var my_token = wx.getStorageSync("token");
    wx.request({
      url: "http://120.78.209.238:50010/v1/supply/detail/" + options.id,
      header: {
        "Content-Type": "application/json",
        "login_token": my_token
      },
      success: res => {
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
  shouCang: function(e) {
    console.log(e)
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
            this.setData({
              isCollection: true
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
  ylImg: function() {
    console.log("预览图片")
    if (this.data.fileList) {
      wx.previewImage({
        current: this.data.fileList[0], // 当前显示图片的http链接
        urls: this.data.fileList // 需要预览的图片http链接列表
      })
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  tel: function() {
    console.log()
    wx.makePhoneCall({
      phoneNumber: this.data.phoneNumber
    })
  }
})