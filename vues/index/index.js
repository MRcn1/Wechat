//index.js
//获取应用实例
const app = getApp()

Page({
    data: {
        swiperConfig: [],
        hiddenLoading: false,
        content: []
    },

    onLoad: function () {
        let that = this

        let i = 0
        var int = setInterval(function () {
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
                that.getMessage()
                that.swiper()
            }
        }, 100)

    },
    messageclick(e) {
        if (e.currentTarget.dataset.type == 1) {
            wx.navigateTo({
                url: '../order/order',
            })
        } else {
            wx.navigateTo({
                url: '../maca/maca',
            })
        }
    },
    swiper() {
        let that = this
        wx.request({
            url: getApp().globalData.baseUrl + getApp().globalData.project + 'advertisement/findAdvertisementListForXcx',
            data: {
                token: getApp().globalData.token,
                adType: 0,
            },
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function (res) {
                if (res.data.code == 0) {
                    that.setData({
                        swiperConfig: res.data.data
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
    toplaceOrder() {
        wx.navigateTo({
            url: '../placeOrder/index'
        })
    },
    scancode() {
        wx.scanCode({
            success(res) {
                console.log('成功' + res.result)
            },
            fail(res) {
                console.log('失败' + res)
            }
        })
    },
    topmyKaBao() {
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
                        url: '../myKaBao/myKaBao'
                    })
                    // that.setData({
                    // 	status: 1,
                    // 	data: res.data.data
                    // })

                    // wx.navigateTo({
                    // 	url: '../submitOrder/index?json=' + JSON.stringify(that.data.overData) + '&storeId=' + that.data.storeId,
                    // })
                } else {
                    // that.setData({
                    // 	status: 0
                    // })
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
    //下拉刷新
    onPullDownRefresh: function () {
        // 显示顶部刷新图标
        wx.showNavigationBarLoading();
        var that = this;
        this.getMessage()
        this.swiper()
        setTimeout(() => {
            // 隐藏导航栏加载框
            wx.hideNavigationBarLoading();
            // 停止下拉动作
            wx.stopPullDownRefresh();
        }, 500)
    },
    onShow: function () {

        // 只走一次
        // wx.getLocation({
        //   type: 'wgs84',
        //   success: function (res) {

        //     console.log(res)
        //   },
        //   fail: function (res) {
        //     // 进入系统设置
        //     wx.openSetting({
        //       success: function (res) {
        //         if (!res.authSetting["scope.userInfo"] || !res.authSetting["scope.userLocation"]) {
        //           //这里是授权成功之后 填写你重新获取数据的js


        //         }
        //       }
        //     })
        //   }
        // })


    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    getMessage() {
        let that = this
        wx.request({
            url: getApp().globalData.baseUrl + getApp().globalData.project + 'message/findMessageListByXcx',
            data: {
                token: getApp().globalData.token,
                pageNum: '1',
                pageSize: '20',
            },
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function (res) {
                if (res.data.code == 0) {
                    res.data.data.filter(res => {
                        var str = that.getDateDiff(res.createdDate);
                        res.time = str
                    })
                    that.data.content = res.data.data
                    that.setData({
                        content: that.data.content
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
    getDateTimeStamp(dateStr) {
        return Date.parse(dateStr.replace(/-/gi, "/"));
    },
    getDateDiff(dateStr) {
        var publishTime = this.getDateTimeStamp(dateStr) / 1000,
            d_seconds,
            d_minutes,
            d_hours,
            d_days,
            timeNow = parseInt(new Date().getTime() / 1000),
            d,

            date = new Date(publishTime * 1000),
            Y = date.getFullYear(),
            M = date.getMonth() + 1,
            D = date.getDate(),
            H = date.getHours(),
            m = date.getMinutes(),
            s = date.getSeconds();
        //小于10的在前面补0
        if (M < 10) {
            M = '0' + M;
        }
        if (D < 10) {
            D = '0' + D;
        }
        if (H < 10) {
            H = '0' + H;
        }
        if (m < 10) {
            m = '0' + m;
        }
        if (s < 10) {
            s = '0' + s;
        }

        d = timeNow - publishTime;
        d_days = parseInt(d / 86400);
        d_hours = parseInt(d / 3600);
        d_minutes = parseInt(d / 60);
        d_seconds = parseInt(d);

        if (d_days > 0 && d_days < 3) {
            return d_days + '天前';
        } else if (d_days <= 0 && d_hours > 0) {
            return d_hours + '小时前';
        } else if (d_hours <= 0 && d_minutes > 0) {
            return d_minutes + '分钟前';
        } else if (d_seconds < 60) {
            if (d_seconds <= 0) {
                return '刚刚发表';
            } else {
                return d_seconds + '秒前';
            }
        } else if (d_days >= 3 && d_days < 30) {
            return M + '-' + D + '&nbsp;' + H + ':' + m;
        } else if (d_days >= 30) {
            return Y + '-' + M + '-' + D + '&nbsp;' + H + ':' + m;
        }
    }
})