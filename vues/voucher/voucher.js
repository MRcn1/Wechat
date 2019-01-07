// vues/voucher/voucher.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		type: 1,
		data: '',
		id: '',
		ids: '',
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.setData({
			type: options.type,
			id: options.id,
			ids: options.ids
		})
		if (options.type == 2) {
			wx.setNavigationBarTitle({
				title: '兑换结果',
			})
		}
		this.findOneById()
	},
	findOneById() {
		let that = this
		wx.request({
			url: getApp().globalData.baseUrl + getApp().globalData.project + 'exchangeProduct/findOneById',
			data: {
				token: getApp().globalData.token,
				id: this.data.id,
			},
			header: {
				'content-type': 'application/json' // 默认值
			},
			success: function (res) {
				that.setData({
					data: res.data.data
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
	tomarket() {
		console.log(111)
		wx.switchTab({
			url: '../market/index',
		})
	},
	touse() {
		wx.navigateTo({
			url: '../redemption/redemption?id=' + this.data.ids,
		})
	},
	result() {
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
					wx.showModal({
						title: '温馨提示',
						content: '确定使用' + that.data.data.exchangeSource + '咖豆兑换'+that.data.data.productName+'吗？',
						success(res) {
							if (res.confirm) {
								wx.request({
									url: getApp().globalData.baseUrl + getApp().globalData.project + 'exchangeProduct/scoreExchangeProduct',
									data: {
										token: getApp().globalData.token,
										exchangeProductId: that.data.id,
									},
									header: {
										'content-type': 'application/json' // 默认值
									},
									success: function (res) {
										if (res.data.code == 0) {
											that.setData({
												type: 2,
												ids: res.data.data
											})
											wx.setNavigationBarTitle({
												title: '兑换结果',
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
			},


			// wx.showModal({
			// 	title: '提示',
			// 	showCancel:false,
			// 	content: '你的咖豆不足以兑换该券',
			// 	success(res) {

			// 	}
			// })
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

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

	}
})