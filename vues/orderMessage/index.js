// pages/orderMessage/idnex.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    state: true,
    show: [],
    hiddenLoading:false,
    data:'',
    id:'',
    datas:'',
    m:'',
    d:'',
    discountAmount:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '订单详情',
    })
    this.setData({
      id:options.id
    })

    let that = this
    let i = 0
    var int = setInterval(function () {
      // console.log(!!getApp().globalData.token)
      i++

      if (i == 80) {
        wx.showModal({
          title: '提示',
          content: '网络异常',
          showCancel: false
        })
        clearInterval(int)
      }
      if (!!getApp().globalData.token) {

        clearInterval(int)
        that.setData({
          hiddenLoading: true

        })

        that.list()
      }
    }, 100)
    
    
  },
  codes(e){
    let id = e.currentTarget.dataset.id
    let code = e.currentTarget.dataset.code

    wx.navigateTo({
      url: '../code/index?id='+id+'&codes='+this.data.m+'-'+this.data.d+'/'+code+'&&code='+code,
    })
  },
  cannel() {
    let that = this
    
    wx.request({
      url: getApp().globalData.baseUrl + getApp().globalData.project + 'order/updateCancelOrderForXcx',
      data: {
        token: getApp().globalData.token,
        orderId: this.data.data.orderId
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

  list(){
    let that = this
    wx.request({
      url: getApp().globalData.baseUrl + getApp().globalData.project + 'order/findOrderByOrderIdForXcx',
      data: {
        token: getApp().globalData.token,
        orderId: this.data.id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        that.setData({
          hiddenLoading: true
        })
        if (res.data.code == 0) {
          that.setData({
            data: res.data.data,
            datas: res.data.data.specificationAttributeList,
            time: that.gettime(res.data.data.createdDate),
            discountAmount: !!res.data.data.discountAmount ? res.data.data.discountAmount:0
          })
          // console.log(res.data.data.specificationAttributeList)

          //默认添加一个下拉查看占卜的 false是隐藏 true是展开
          let ddata = that.data.datas
          for (let i = 0; i < that.data.datas.length;i++){
            ddata[i].state = false
          }

          that.setData({
            datas: ddata
          })
          console.log(that.data.datas)
        }
        else {
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

        that.setData({
          hiddenLoading: true
        })
      }
    })
  },

  listUrl(){

    wx.switchTab({
      url: '../order/index',
    })
  },

  pay(e) {

    let that = this
    let index = e.currentTarget.dataset.index
  console.log(that.data.data)
    wx.request({
      url: getApp().globalData.baseUrl + 'wechat-api/merchantPay/xcxPay',

      data: {
        token: getApp().globalData.token,
        appId: 'wx917db86f615a99a6',
        amount: parseFloat((that.data.data.paymentAmount * 100).toFixed(2)), //单位为分 需要乘以100
        productName: that.data.data.productName,
        orderNo: that.data.data.orderNo,
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
            that.list()

          },
          'fail': function (res) {
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

  //栅格化时间
  gettime(value) {
    // console.log(value/100*100)
    let date = new Date(value / 100 * 100);
    // console.log(date)    
    let Y = date.getFullYear();
    let m = date.getMonth() + 1;
    let d = date.getDate();
    let H = date.getHours();
    let i = date.getMinutes();
    let s = date.getSeconds();
    m = m < 10 ? '0' + m : m;
    d = d < 10 ? '0' + d : d;
    H = H < 10 ? '0' + H : H;
    i = i < 10 ? '0' + i : i;
    s = s < 10 ? '0' + s : s;
    let t = `${Y}-${m}-${d} ${H}:${i}:${s}`;

    this.setData({
      m:m,
      d:d
    })

    return t;
  },

  show(e) {
    let index = e.currentTarget.dataset.id
    let data = this.data.datas
    
    data[index].state = !data[index].state

    this.setData({
      datas:data
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