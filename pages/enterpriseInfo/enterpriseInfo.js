// 获取全局应用程序实例对象
const app = getApp();

// 创建页面实例对象
Page({
  /**
   * 页面名称
   */
  name: "enterpriseInfo",
  /**
   * 页面的初始数据
   */

  data: {
    boothId: '',
    amt: '',
    canConfirm: false
  },

  onLoad: function (option) {
    var that = this;
    that.setData({
      boothId: option.id,
      amt: option.amount
    });
  },

  insertCompany: function (e) {
    var that = this;
    var canFirm = that.data.canConfirm;
    if (!canFirm) {
      wx.showModal({
        title: '提示',
        content: '请将信息填写完整或正确',
        showCancel: false
      })
    } else {
      var enterpriseId = app.globalData.companyId;
      if (enterpriseId != null) {
        wx.navigateTo({
          url: '../pay/pay?boothId=' + that.data.boothId + '&companyId=' + enterpriseId + '&amt=' + that.data.amt
        })
      } else {
        var companyName = e.detail.value.input1;
        var companyPhone = e.detail.value.input2;
        wx.request({
          url: 'https://561job.cn/company/insert',
          data: {
            openId: wx.getStorageSync('openId'),
            companyName: companyName,
            phone: companyPhone,
            boothId: that.data.boothId
          },
          method: 'GET',
          success: function (res) {
            if (res.data.retCode == '00') {
              var companyId = res.data.retData.keyID;
              app.globalData.companyId = res.data.retData.keyID;
              // wx.navigateTo({
              //   url: '../ResumeCollected/ResumeCollected'
              // })
              wx.redirectTo({
                url: '../pay/pay?boothId=' + that.data.boothId + '&companyId=' + companyId + '&amt=' + that.data.amt
              })
            } else {
              wx.showModal({
                title: '意外',
                content: '出了点小差错！'
              })
            }
          }
        })
      }
    }
  },

  checkOut1: function (e) {
    var str = e.detail.value;
    if (str.length > 32) {
      this.setData({
        canConfirm: false
      })
      wx.showModal({
        title: '错误',
        content: '名字超长！',
      })
    } else if (str.length < 1) {
      this.setData({
        canConfirm: false
      })
      wx.showModal({
        title: '错误',
        content: '请填写完整的公司名称',
      })
    } else {
      this.setData({
        canConfirm: true
      })
    }
  },

  checkOut2: function (e) {
    var str = e.detail.value;
    var flag = false;
    if (!(/(^1[3|4|5|7|8]\d{9}$)|(^09\d{8}$)/.test(str))) {
      if (!(/^(\d{3,4}\-)?\d{7,8}$/i).test(str)) {
        if (!(/^0(([1-9]\d)|([3-9]\d{2}))\d{8}$/).test(str)) {
          flag = false;
        } else {
          flag = true;
        }
      } else {
        flag = true;
      }
    } else {
      flag = true;
    }
    if (!flag) {
      this.setData({
        canConfirm: false
      })
      wx.showModal({
        title: '错误',
        content: '电话号码格式不正确',
      })
    } else {
      this.setData({
        canConfirm: true
      })
    }
  },

  showTip: function () {
    wx.showModal({
      title: '购买须知',
      content: '保险公司和无营业执照的公司购买后不提供展位',
      showCancel: false
    })
  },

  customService: function () {
    wx.makePhoneCall({
      phoneNumber: '0561-2321060'
    })
  }
})