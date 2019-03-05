// pages/supply/supply.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    getAllTreeFenlei: [],
    treeOne: [],
    treeTwo: [],
    treeThree: [],
    fenlei: "fenlei-close",
    type: "请选择类型",
    are: "请选择地区",
    getAllTreeDiqu: [],
    fl: false,
    dq: false,
    upfile: [],
    imgUrl: null,
    _areaId: null,
    _categoryId: null,
    _title: null,
    _detail: null,
    _contacts: null,
    _telephone: null,
    _minAmount: null,
    _totalAmount: null,
    _supplyTime: null,
    _type: 1,
    _price: null,
    supplyTime: '请选择截止日期'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
    if (app.globalData.imgUrl) {
      this.setData({
        imgUrl: app.globalData.imgUrl
      });
    }
  },
  fenlei() {
    this.setData({
      fenlei: "fenlei",
      fl: true,
      dq: false
    });
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
    this.setData({
      fenlei: "fenlei",
      fl: false,
      dq: true
    });
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
          this.setData({
            treeThree: this.data.treeTwo[0].children
          });
        }
      }
    }
  },
  oneTag(e) {
    console.log();
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
    }
  },
  threeTag(e) {
    console.log(e._relatedInfo.anchorTargetText);
    console.log(e.target);
    if (this.data.fl) {
      this.setData({
        type: e._relatedInfo.anchorTargetText,
        fenlei: "fenlei-close"
      });
      this.setData({
        _categoryId: e.target.id.split('t')[1]
      })
    } else if (this.data.dq) {
      this.setData({
        are: e._relatedInfo.anchorTargetText,
        fenlei: "fenlei-close"
      });
      this.setData({
        _areaId: e.target.id.split('t')[1]
      })
    }
  },
  hideFenlei: function () {
    this.setData({
      fenlei: "fenlei-close"
    });
  },
  zsmp: function () {},
  //数据双向绑定
  titleFn: function (e) {
    this.setData({
      _title: e.detail.value
    })
  },
  totalAmountFn: function (e) {
    this.setData({
      _totalAmount: e.detail.value
    })
  },
  minAmountFn: function (e) {
    this.setData({
      _minAmount: e.detail.value
    })
  },
  priceFn: function (e) {
    this.setData({
      _price: e.detail.value
    })
  },
  contactsFn: function (e) {
    this.setData({
      _contacts: e.detail.value
    })
  },
  telephoneFn: function (e) {
    this.setData({
      _telephone: e.detail.value
    })
  },
  detailFn: function (e) {
    this.setData({
      _detail: e.detail.value
    })
  },
  supplyTimeFn: function (e) {
    console.log(e.detail.value)

    this.setData({
      supplyTime: e.detail.value,
      _supplyTime: e.detail.value
    })
  },
  //上传图片
  chooseImage: function () {
    var openid = wx.getStorageSync("openid");
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ["original", "compressed"],
      sourceType: ["album", "camera"],
      success: res => {
        var tempFilePaths = res.tempFilePaths;
        wx.uploadFile({
          url: "http://120.78.209.238:50001/upload/img",
          filePath: tempFilePaths[0],
          name: "imgFile",
          header: {
            "Content-Type": "multipart/form-data",
            accept: "application/json"
          },
          formData: {},
          success: res => {
            console.log(res.data)
            var result = JSON.parse(res.data)
            var file = this.data.upfile;
            file.push(result.path);
            this.setData({
              upfile: file
            });
          },
          fail: function (res) {
            console.log("fail");
          }
        });
      }
    });
  },
  save: function () {
    var upfiles = this.data.upfile
    var _fileList = ""
    for (let i = 0; i < upfiles.length; i++) {
      _fileList += upfiles[i] + ","
    }
    _fileList = _fileList.slice(0, _fileList.length - 1)
    var data = {
      areaId: this.data._areaId,
      categoryId: this.data._categoryId,
      title: this.data._title,
      detail: this.data._detail,
      contacts: this.data._contacts,
      telephone: this.data._telephone,
      minAmount: this.data._minAmount,
      totalAmount: this.data._totalAmount,
      price: this.data._price,
      supplyTime: this.data._supplyTime,
      type: this.data._type
    }
    var my_token = wx.getStorageSync('token')
    wx.request({
      url: "http://120.78.209.238:50010/v1/supply/save",
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: data,
      beforeSend: function (xhr) {
        xhr.setRequestHeader("login_token", my_token);
      },
      success: res => {
        console.log(res)
        // wx.navigateBack({
        //   delta: 1
        // })
        wx.showToast({
          title: '供应信息发布成功',
          icon: 'success',
          duration: 2000
        })
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  // onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {}
  // preventTouchMove: function() {}
});