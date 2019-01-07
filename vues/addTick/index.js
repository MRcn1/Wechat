// pages/addTick/inde.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    code:'',
    clickStatus:false,
    storeId:'',
    money:'',
    json:'',
    show:false,
    tickMoney:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      wx.setNavigationBarTitle({
        title: '输入券码',
      })
      this.setData({
        storeId: options.soterId,
        money: options.money,
        json:options.json
      })
  },
  codes(e) {

    this.setData({
      code: e.detail.value
    })

    if (e.detail.value != '') {
      this.setData({
        clickStatus: true
      })
    } else {
      this.setData({
        clickStatus: false
      })
    }

    // console.log(this.data.name)

  },
  change() {
    if (!this.data.clickStatus) {
      wx.showModal({
        title: '提示',
        content: '请输入优惠码',
        showCancel:false
      })
      return false
    }
   
    let that = this
    wx.request({
      url: getApp().globalData.baseUrl + getApp().globalData.project + 'order/findCouponByCode',
      data: {
        token: getApp().globalData.token,
        storeId: that.data.storeId,
        code: this.data.code
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {

        if (res.data.code == 0) {


          if (res.data.data > that.data.money) {
          

            that.setData({
                show:true,
                tickMoney:res.data.data
            }) 
            wx.setNavigationBarTitle({
              title: '确认',
            })
           
          } else {
            var pages = getCurrentPages();
            var Page = pages[pages.length - 1];//当前页
            var prevPage = pages[pages.length - 2];  //上一个页面
            var info = prevPage.data //取上页data里的数据也可以修改
            console.log(that.data.code)
            prevPage.setData({
              dataMoney: res.data.data,
              code: that.data.code,
              tickStatus: true
            })//设置数据

            wx.navigateBack()
          }
        } else {
          wx.showModal({
            title: '提示',
            content: res.data.message,
            showCancel: false
          })
          that.setData({
            dataMoney: 0
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

  },

  over() {
    var pages = getCurrentPages();
    var Page = pages[pages.length - 1];//当前页
    var prevPage = pages[pages.length - 2];  //上一个页面
    var info = prevPage.data //取上页data里的数据也可以修改
    prevPage.setData({
      dataMoney: this.data.tickMoney,
      code: this.data.code,
      tickStatus: true
    })//设置数据

    wx.navigateBack()
  },
  cannel() {
    this.setData({
      show:false
    })
    wx.setNavigationBarTitle({
      title: '输入券码',
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