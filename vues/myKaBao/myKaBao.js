// vues/myKaBao/myKaBao.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		actives: 0,
		data: [],
		Unused: 0,
		Userecord: 0,
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {

	},
	activechange(e) {
		this.data.actives = e.currentTarget.dataset.type
		this.setData({
			actives: this.data.actives
		})
	},
	tosubmitOrder() {
		wx.scanCode({
			success(val) {
				console.log('成功' + val.result)
				wx.request({
					url: getApp().globalData.baseUrl + getApp().globalData.project + 'coupon/purchaseCouponCodeForXcx',
					data: {
						token: getApp().globalData.token,
						couponCodeId: val.result
					},
					header: {
						'content-type': 'application/json' // 默认值
					},
					success: function (res) {
						if (res.data.code == 0) {
							wx.navigateTo({
								url: '../successful/successful'
							})
						} else {
							wx.showModal({
								title: '提示',
								showCancel: false,
								content: res.data.message,
								success(res) {
									if (res.confirm) {
										console.log('用户点击确定')
									} else if (res.cancel) {
										console.log('用户点击取消')
									}
								}
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
			fail(res) {
				console.log('失败' + val)
			}
		})
	},
	getData() {
		let that = this
		wx.request({
			url: getApp().globalData.baseUrl + getApp().globalData.project + 'coupon/findMemberCouponListForXcx',
			data: {
				token: getApp().globalData.token,
			},
			header: {
				'content-type': 'application/json' // 默认值
			},
			success: function (res) {
				res.data.data.filter(res => {
					if (res.useStatus == 0) {
						that.data.Unused++
					}
					if (res.useStatus == 1) {
						that.data.Userecord++
					}
				})
				res.data.data.filter(res => {
					if (!!res.startDate) {
						res.startDate = res.startDate.substr(0, 10)
						res.endDate = res.endDate.substr(0, 10)
					}
				})
				that.setData({
					data: res.data.data,
					Unused: that.data.Unused,
					Userecord: that.data.Userecord
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
	toscoreShop(e) {
		wx.navigateTo({
			url: "../scoreShop/scoreShop?id="+e.currentTarget.dataset.id
		})
	},
	toredemption(e){
		wx.navigateTo({
			url: "../redemption/redemption?id="+e.currentTarget.dataset.id
		})
	},
	tovoucher() {
		wx.navigateTo({
			url: "../voucher/voucher"
		})
	},
	use() {
		wx.navigateTo({
			url: '../placeOrder/index',
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
		this.setData({
			Unused: 0,
			Userecord: 0,
		})
		this.getData()
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

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

	}
})