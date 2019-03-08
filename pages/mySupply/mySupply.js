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
    _type: 1,
    _price: null,
    supplyTime: "请选择截止日期",
    id: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.id)
    //获取数据
    this.setData({
      id: options.id
    })
    wx.request({
      url: "http://120.78.209.238:50010/v1/supply/detail/" + options.id,
      header: {
        "Content-Type": "application/json"
      },
      success: res => {
        if (res.data.code === "0") {
          console.log(res.data.data.marketSupply)
          console.log(res.data.data.marketSupply.title)
          var fileList = res.data.data.marketSupply.fileList
          console.log(fileList)
          var fileListArr = []
          if (fileList) {
            fileListArr = fileList.split(',')
          }
          console.log(fileListArr)
          var supplyTime = res.data.data.marketSupply.supplyTime
          var supplyTimeStr = ""
          if (supplyTime) {
            var supplyTimeStr = supplyTime.split(' ')[0]
          } else {
            supplyTimeStr = supplyTime
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
            upfile: fileListArr
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
    if (app.globalData.imgUrl) {
      this.setData({
        imgUrl: app.globalData.imgUrl
      });
    }
    wx.setNavigationBarTitle({
      title: '我发布的供应'
    })
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
        _cropId: e.target.id.split("t")[1]
      });
    } else if (this.data.dq) {
      this.setData({
        are: e._relatedInfo.anchorTargetText,
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
    console.log(e.detail.value);

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
        console.log(tempFilePaths[0])
        var fileWx = this.data.upfileWx;
        fileWx.push(tempFilePaths[0]);
        this.setData({
          upfileWx: fileWx
        });
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
            console.log(res.data);
            var result = JSON.parse(res.data);
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
    var upfiles = this.data.upfile;
    var _fileList = "";
    for (let i = 0; i < upfiles.length; i++) {
      _fileList += upfiles[i] + ",";
    }
    _fileList = _fileList.slice(0, _fileList.length - 1);
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
      price: this.data._price,
      supplyTime: this.data._supplyTime,
      type: this.data._type,
      fileList: _fileList
    };
    var my_token = wx.getStorageSync("token");
    wx.request({
      url: "http://120.78.209.238:50010/v1/supply/save",
      method: "POST",
      header: {
        "Content-Type": "application/json;charset=UTF-8",
        login_token: my_token
      },
      data: data,
      success: res => {
        console.log(res);
        if (res.data.code === "0") {
          console.log('000000')
          wx.showToast({
            title: "修改成功",
            icon: "success",
            duration: 2000
          });
          wx.navigateBack({
            delta: 1
          })
        } else if (res.data.code === "9") {
          console.log('99999999')
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
  autoLogin: function (openId, icon, userName, sex) {
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
          this.save();
        }
      }
    });
  },
  locFn: function () {
    var address = wx.getStorageSync("address");
    console.log(address);
    if (address) {
      this.setData({
        _areaId: address.id,
        are: address.areaName
      });
    }
  },
  preventTouchMove: function () {},
  delImg: function (e) {
    console.log(e)
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
          upfile.splice(e.currentTarget.dataset.index, 1)
          this.setData({
            upfile: upfile
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
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