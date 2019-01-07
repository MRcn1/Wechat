// pages/market/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    score: 0,
    data: [],
    exchangeSource: 0,
    useryn: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData(1)
    this.findMemberSourceForXcx()
  },
  findMemberSourceForXcx() {
    let that = this
    wx.request({
      url: getApp().globalData.baseUrl + getApp().globalData.project + 'member/findMemberSourceForXcx',
      data: {
        token: getApp().globalData.token,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        let score = res.data.data.score
        that.setData({
          score: score
        })
      },
      fail: function (res) {
        wx.showModal({
          title: '提示',
          content: '网络超时',
          showCancel: false
        })
      }
    })
  },
  tovoucher(e) {
    let that = this
    if (e.currentTarget.dataset.type == 1) {  //查看详情
      wx.navigateTo({
        url: '../voucher/voucher?type=' + e.currentTarget.dataset.type + '&id=' + e.currentTarget.dataset.id
      })
      return
    }
    wx.request({
      url: getApp().globalData.baseUrl + getApp().globalData.project + 'member/findOneByOpenIdForXcx',
      data: {
        token: getApp().globalData.token,
        openId: getApp().globalData.openId
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (!!res.data.data) {
          if (e.currentTarget.dataset.type == 2) {  //立即兑换
            wx.showModal({
              title: '温馨提示',
              content: '确定使用' + e.currentTarget.dataset.exchangesource + '咖豆兑换'+e.currentTarget.dataset.productname+'吗？',
              success(res) {
                if (res.confirm) {
                  wx.request({
                    url: getApp().globalData.baseUrl + getApp().globalData.project + 'exchangeProduct/scoreExchangeProduct',
                    data: {
                      token: getApp().globalData.token,
                      exchangeProductId: e.currentTarget.dataset.id,
                    },
                    header: {
                      'content-type': 'application/json' // 默认值
                    },
                    success: function (res) {
                      if (res.data.code == 0) {
                        wx.navigateTo({
                          url: '../voucher/voucher?type=' + e.currentTarget.dataset.type + '&ids=' + res.data.data
                        })
                      } else {
                        wx.showModal({
                          title: '提示',
                          content: res.data.message,
                          showCancel: false
                        })
                      }
                    },
                    fail: function (res) {
                      wx.showModal({
                        title: '提示',
                        content: '网络超时',
                        showCancel: false
                      })
                    }
                  })

                } else if (res.cancel) {

                }
              }
            })
            return
          }
        } else {
          wx.navigateTo({
            url: '../logs/logs',
          })
        }
      },
      fail() {
        wx.showModal({
          title: '提示',
          content: '网络超时',
          showCancel: false
        })
      }
    })
  },
  tomaca() {
    let that = this
    wx.request({
      url: getApp().globalData.baseUrl + getApp().globalData.project + 'member/findOneByOpenIdForXcx',
      data: {
        token: getApp().globalData.token,
        openId: getApp().globalData.openId
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (!!res.data.data) {
          wx.navigateTo({
            url: '../maca/maca'
          })
        } else {
          wx.navigateTo({
            url: '../logs/logs',
          })
        }
      },
      fail() {
        wx.showModal({
          title: '提示',
          content: '网络超时',
          showCancel: false
        })
      }
    })



  },
  getCaDou() {
    let that = this
    wx.request({
      url: getApp().globalData.baseUrl + getApp().globalData.project + 'member/findMemberSourceForXcx',
      data: {
        token: getApp().globalData.token,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        that.setData({
          score: res.data.data.score
        })
      },
      fail: function (res) {
        wx.showModal({
          title: '提示',
          content: '网络超时',
          showCancel: false
        })
      }
    })
  },
  getData(pageNum) {
    let that = this
    wx.request({
      url: getApp().globalData.baseUrl + getApp().globalData.project + 'exchangeProduct/findExchangeProductList',
      data: {
        token: getApp().globalData.token,
        pageNum: pageNum,
        pageSize: 20
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        let data = res.data.data
        that.setData({
          data: data
        })
        console.log(that.data.data)
      },
      fail: function (res) {
        wx.showModal({
          title: '提示',
          content: '网络超时',
          showCancel: false
        })
      }
    })
  },
  onPullDownRefresh: function () {
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    var that = this;
    this.getData(1)
    this.findMemberSourceForXcx()
    setTimeout(() => {
      // 隐藏导航栏加载框
      wx.hideNavigationBarLoading();
      // 停止下拉动作
      wx.stopPullDownRefresh();
    }, 500)
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
    this.getCaDou()
    // let that = this
    // wx.request({
    //   url: getApp().globalData.baseUrl + getApp().globalData.project + 'member/findOneByOpenIdForXcx',
    //   data: {
    //     token: getApp().globalData.token,
    //     openId: getApp().globalData.openId
    //   },
    //   header: {
    //     'content-type': 'application/json' // 默认值
    //   },
    //   success(res) {
    //     if (!!res.data.data) {

    //     } else {
    //       wx.navigateTo({
    //         url: '../logs/logs?json=' + JSON.stringify(that.data.overData),
    //       })
    //     }
    //   },
    //   fail() {
    //     wx.showModal({
    //       title: '提示',
    //       content: '网络超时',
    //       showCancel: false
    //     })
    //   }
    // })
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
})