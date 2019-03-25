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
    totalAmount: '',
    minAmount: '',
    price: '',
    contacts: '',
    telephone: '',
    detail: '',
    getAllTreeDiqu: [],
    fl: false,
    dq: false,
    upfile: [],
    upfileWx: [],
    imgUrl: null,
    _areaId: null,
    _cropId: null,
    _title: "请输入标题",
    _detail: null,
    _contacts: null,
    _telephone: null,
    _minAmount: null,
    _totalAmount: null,
    _supplyTime: null,
    _type: 2,
    _price: null,
    supplyTime: "请选择截止日期",
    id: null,
    active1: null,
    active2: null,
    active3: null,
    loca50010: null,
    uploadImg: null,
    token: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (wx.getStorageSync("token")) {
      this.setData({
        token: wx.getStorageSync("token")
      })
    }
    //获取数据
    this.setData({
      id: options.id
    })
    if (app.globalData.loca50010) {
      this.setData({
        loca50010: app.globalData.loca50010
      })
    }
    if (app.globalData.uploadImg) {
      this.setData({
        uploadImg: app.globalData.uploadImg
      })
    }
    wx.request({
      url: this.data.loca50010 + "/supply/detail/" + options.id,
      header: {
        "Content-Type": "application/json"
      },
      success: res => {
        if (res.data.code === "0") {
          var fileList = res.data.data.marketSupply.fileList
          var fileListArr = []
          if (fileList) {
            fileListArr = fileList.split(',')
          }
          var supplyTime = res.data.data.marketSupply.supplyTime
          var supplyTimeStr = ""
          if (supplyTime) {
            var supplyTimeStr = supplyTime.split(' ')[0]
          } else {
            supplyTimeStr = supplyTime
          }
          var fileImg = [],
            upfile = [];
          for (let i = 0; i < fileListArr.length; i++) {
            fileImg.push(this.data.imgUrl + fileListArr[i])
            upfile.push(fileListArr[i])
          }
          this.setData({
            _title: res.data.data.marketSupply.title,
            type: res.data.data.marketSupply.cropName,
            _cropId: res.data.data.marketSupply.cropId,
            are: res.data.data.marketSupply.area,
            _areaId: res.data.data.marketSupply.areaId,
            totalAmount: res.data.data.marketSupply.totalAmount,
            _totalAmount: res.data.data.marketSupply.totalAmount,
            minAmount: res.data.data.marketSupply.minAmount,
            _minAmount: res.data.data.marketSupply.minAmount,
            price: res.data.data.marketSupply.price,
            _price: res.data.data.marketSupply.price,
            supplyTime: supplyTimeStr,
            _supplyTime: supplyTimeStr,
            contacts: res.data.data.marketSupply.contacts,
            _contacts: res.data.data.marketSupply.contacts,
            telephone: res.data.data.marketSupply.telephone,
            _telephone: res.data.data.marketSupply.telephone,
            detail: res.data.data.marketSupply.detail,
            _detail: res.data.data.marketSupply.detail,
            upfile: upfile,
            upfileWx: fileImg
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
        }
      }
    });
    if (app.globalData.imgUrl) {
      this.setData({
        imgUrl: app.globalData.imgUrl
      });
    }
    wx.setNavigationBarTitle({
      title: '我发布的求购'
    })
  },
  fenlei() {
    this.setData({
      fenlei: "fenlei",
      fl: true,
      dq: false,
      active1: null,
      active2: null,
      active3: null
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
      dq: true,
      active1: null,
      active2: null,
      active3: null
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
        this.setData({
          treeThree: this.data.treeTwo[0].children
        });
      } else {
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
          text: e.target.dataset.text,
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
    if (this.data.fl) {
      this.setData({
        type: e.target.dataset.text,
        fenlei: "fenlei-close"
      });
      this.setData({
        _cropId: e.target.id.split("t")[1]
      });
    } else if (this.data.dq) {
      this.setData({
        are: e.target.dataset.text,
        fenlei: "fenlei-close"
      });
      this.setData({
        _areaId: e.target.id.split("t")[1]
      });
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
    });
  },
  totalAmountFn: function (e) {
    this.setData({
      _totalAmount: e.detail.value
    });
  },
  minAmountFn: function (e) {
    this.setData({
      _minAmount: e.detail.value
    });
  },
  priceFn: function (e) {
    this.setData({
      _price: e.detail.value
    });
  },
  contactsFn: function (e) {
    this.setData({
      _contacts: e.detail.value
    });
  },
  telephoneFn: function (e) {
    this.setData({
      _telephone: e.detail.value
    });
  },
  detailFn: function (e) {
    this.setData({
      _detail: e.detail.value
    });
  },
  supplyTimeFn: function (e) {
    this.setData({
      supplyTime: e.detail.value,
      _supplyTime: e.detail.value
    });
  },
  //上传图片
  chooseImage: function () {
    wx.chooseImage({
      count: 1,
      sizeType: ["compressed"],
      sourceType: ["album", "camera"],
      success: res => {
        var tempFilePaths = res.tempFilePaths;
        var fileWx = this.data.upfileWx;
        fileWx.push(tempFilePaths[0]);
        this.setData({
          upfileWx: fileWx
        });
        wx.uploadFile({
          url: this.data.uploadImg + "/upload/img",
          filePath: tempFilePaths[0],
          name: "imgFile",
          header: {
            "Content-Type": "multipart/form-data",
            accept: "application/json"
          },
          formData: {},
          success: res => {
            var result = JSON.parse(res.data);
            var file = this.data.upfile;
            file.push(result.path);
            this.setData({
              upfile: file
            });
          },
          fail: function (res) {}
        });
      }
    });
  },
  save: function () {
    var upfiles = this.data.upfile;
    var _fileList = "";
    for (let i = 0; i < upfiles.length; i++) {
      _fileList += upfiles[i] + ",";
    }
    _fileList = _fileList.slice(0, _fileList.length - 1);
    var priceTip;
    if (this.data._price) {
      priceTip = this.data._price
    } else {
      priceTip = "面议"
    }
    var data = {
      id: this.data.id,
      areaId: this.data._areaId,
      cropId: this.data._cropId,
      title: this.data._title,
      detail: this.data._detail,
      contacts: this.data._contacts,
      telephone: this.data._telephone,
      minAmount: this.data._minAmount,
      totalAmount: this.data._totalAmount,
      price: priceTip,
      supplyTime: this.data._supplyTime,
      type: this.data._type,
      fileList: _fileList
    };
    if (!data.title) {
      wx.showToast({
        title: "请输入标题",
        icon: "none",
        duration: 1000
      });
    } else if (!data.cropId) {
      wx.showToast({
        title: "请选择供应类型",
        icon: "none",
        duration: 1000
      });
    } else if (!data.areaId) {
      wx.showToast({
        title: "请选择地区",
        icon: "none",
        duration: 1000
      });
    } else if (!data.totalAmount) {
      wx.showToast({
        title: "请输入总数量",
        icon: "none",
        duration: 1000
      });
    } else if (!data.minAmount) {
      wx.showToast({
        title: "请输入起售量",
        icon: "none",
        duration: 1000
      });
    } else if (!data.price) {
      wx.showToast({
        title: "请输入供应价格",
        icon: "none",
        duration: 1000
      });
    } else if (!data.supplyTime) {
      wx.showToast({
        title: "请选择供货截止日期",
        icon: "none",
        duration: 1000
      });
    } else if (!data.contacts) {
      wx.showToast({
        title: "请输入联系人",
        icon: "none",
        duration: 1000
      });
    } else if (!data.telephone) {
      wx.showToast({
        title: "请输入11位手机号码",
        icon: "none",
        duration: 1000
      });
    } else if (!data.detail) {
      wx.showToast({
        title: "请输入商品详情",
        icon: "none",
        duration: 1000
      });
    } else if (this.checksum(data.detail) < 25 * 2) {
      wx.showToast({
        title: "商品详情请至少输入25个字",
        icon: "none",
        duration: 1000
      });
    } else if (!data.fileList) {
      wx.showToast({
        title: "请上传至少一张图片",
        icon: "none",
        duration: 1000
      });
    } else {
      wx.request({
        url: this.data.loca50010 + "/supply/save",
        method: "POST",
        header: {
          "Content-Type": "application/json;charset=UTF-8",
          login_token: this.data.token
        },
        data: data,
        success: res => {
          if (res.data.code === "0") {
            wx.showToast({
              title: "修改成功",
              icon: "success",
              duration: 1000
            });
            setTimeout(() => {
              wx.navigateBack({
                delta: 1
              })
            }, 1000)
          } else {
            wx.showToast({
              title: res.data.message,
              icon: "success",
              duration: 1000
            });
            setTimeout(() => {
              wx.navigateBack({
                delta: 1
              })
            }, 1000)
          }
        }
      });
    }
  },
  locFn: function () {
    var address = wx.getStorageSync("address");
    if (address) {
      this.setData({
        _areaId: address.id,
        are: address.fullName
      });
    }
  },
  preventTouchMove: function () {},
  delImg: function (e) {
    this.setData({
      modalFlag: false
    })
    wx.showModal({
      title: "确定删除",
      content: '第 ' + (e.currentTarget.dataset.index + 1) + ' 张图片',
      confirmColor: '#3CC51F',
      success: res => {
        if (res.confirm) {
          var upfile = this.data.upfile
          var upfileWx = this.data.upfileWx
          upfile.splice(e.currentTarget.dataset.index, 1)
          upfileWx.splice(e.currentTarget.dataset.index, 1)
          this.setData({
            upfile: upfile,
            upfileWx: upfileWx
          })
        } else if (res.cancel) {}
      }
    })
  },
  ylImg: function (e) {
    if (this.data.upfile) {
      var imgList = this.data.upfile
      var newImgLIst = []
      for (let i = 0; i < imgList.length; i++) {
        newImgLIst.push(this.data.imgUrl + imgList[i])
      }
      wx.previewImage({
        current: newImgLIst[e.currentTarget.dataset.index], // 当前显示图片的http链接
        urls: newImgLIst // 需要预览的图片http链接列表
      })
    }
  },
  checksum: function (chars) {
    var sum = 0;
    for (var i = 0; i < chars.length; i++) {
      var c = chars.charCodeAt(i);
      if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
        sum++;
      } else {
        sum += 2;
      }
    }
    return sum;
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

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