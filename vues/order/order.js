// pages/order/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    data: '',
    hiddenLoading: false,
    typeAc: 0,
    undoneData: [],
    completeData:[]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    wx.setNavigationBarTitle({
      title: '订单'
    })

  },
  changeType(e) {
    this.setData({
      typeAc: e.currentTarget.dataset.id,
    })
  },

  orderMessage(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../orderMessage/index?id=' + id,
    })
  },

  pay(e) {

    let that = this
    let index = e.currentTarget.dataset.index
    let id = e.currentTarget.dataset.id
    console.log(id)


    wx.request({
      url: getApp().globalData.baseUrl + 'wechat-api/merchantPay/xcxPay',

      data: {
        token: getApp().globalData.token,
        appId: 'wx917db86f615a99a6',
        amount: parseFloat((that.data.data[index].amount * 100).toFixed(2)), //单位为分 需要乘以100
        productName: that.data.data[index].productName,
        orderNo: that.data.data[index].orderNo,
        openId: getApp().globalData.openId,
        notifyUrl: getApp().globalData.baseUrl + getApp().globalData.project + 'order/paymentNotify'
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (res.data.code != 0) {
          wx.showModal({
            title: '提示',
            content: res.data.message,
            showCancel: false
          })
        }
        console.log(res.data)
        console.log(res.data.data.timeStamp)
        console.log(res.data.data.nonceStr)
        console.log(res.data.data.package)
        console.log(res.data.data.sign)

        wx.requestPayment({
          'timeStamp': res.data.data.timeStamp,
          'nonceStr': res.data.data.nonceStr,
          'package': res.data.data.package,
          'signType': res.data.data.signType,
          'paySign': res.data.data.sign,
          'success': function (res) {
            console.log('支付成功')
            wx.navigateTo({
              url: '../orderMessage/index?id=' + id,
            })

          },
          'fail': function (res) {
            console.log(res)
            wx.showModal({
              title: '提示',
              content: '支付失败',
              showCancel: false
            })

          }
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this

    var int = setInterval(function () {
      // console.log(!!getApp().globalData.token)
      if (!!getApp().globalData.token) {
        clearInterval(int)
        that.setData({
          hiddenLoading: true
        })
        that.list()

      }
    }, 100)


  },
  cannel(e) {
    let data = ''
    if(this.data.typeAc==0){
      data = this.data.data
    }else if(this.data.typeAc==1){
      data = this.data.undoneData
    }else if(this.data.typeAc==2){
      data = this.data.completeData
    }
    let that = this
    let index = e.currentTarget.dataset.index
    console.log(index)
    // return false
    wx.request({
      url: getApp().globalData.baseUrl + getApp().globalData.project + 'order/updateCancelOrderForXcx',
      data: {
        token: getApp().globalData.token,
        orderId: data[index].orderId
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (res.data.code == 0) {
          that.list()
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
  },
  list() {
    let that = this
    this.setData({
      hiddenLoading: false
    })
    wx.request({
      url: getApp().globalData.baseUrl + getApp().globalData.project + 'order/findOrderListForXcx',
      data: {
        token: getApp().globalData.token
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        that.setData({
          hiddenLoading: true
        })
        if (res.data.code == 0) {

          console.log(res.data.data)

          if (!!res.data.data) {
            that.setData({
              show: true
            })
            that.setData({
              data: res.data.data
            })

            let data = []
            res.data.data.filter(res => {
              if (res.orderStatus == 0 || res.orderStatus == 2) {
                data.push(res)
              }
            })
            that.data.undoneData = data
            that.setData({
              undoneData: that.data.undoneData
            })

            let data2 = []
            res.data.data.filter(res => {
              if (res.orderStatus == 1 || res.orderStatus == 3) {
                data2.push(res)
              }
            })
            that.data.completeData = data2
            that.setData({
              completeData: that.data.completeData
            })

          } else {
            that.setData({
              show: false
            })
          }



        }
      },
      fail: function (res) {
        wx.showModal({
          title: '提示',
          content: '网络超时',
          showCancel: false
        })

        that.setData({
          hiddenLoading: true
        })
      }
    })
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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },


})