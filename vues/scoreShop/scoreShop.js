// vues/voucher/voucher.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		type: 1,
		id: '',
		memberCouponData: '',
		memberCoupon:'',
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.setData({
			type: options.type,
			id: options.id
		})
		this.getData()
		if (options.type == 2) {
			wx.setNavigationBarTitle({
				title: '兑换结果',
			})
		}
	},
	getData() {
		let that = this
		wx.request({
			url: getApp().globalData.baseUrl + getApp().globalData.project + 'coupon/findMemberCouponDetailByIdForXcx',
			data: {
				token: getApp().globalData.token,
				id: this.data.id
			},
			header: {
				'content-type': 'application/json' // 默认值
			},
			success: function (res) {
				if (res.data.code == 0) {
					if (res.data.data.memberCoupon.couponType == 2) {
						res.data.data.memberCouponData.startDeadlineDate = res.data.data.memberCouponData.startDeadlineDate.substr(0, 10)
						res.data.data.memberCouponData.endDeadlineDate = res.data.data.memberCouponData.endDeadlineDate.substr(0, 10)
						that.data.data = res.data.data.memberCouponData
						that.data.memberCoupon = res.data.data.memberCoupon
						that.setData({
							memberCouponData: that.data.data,
							memberCoupon: that.data.memberCoupon,
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
			}
		})
	},
	tomarket() {
		wx.switchTab({
			url: '../market/index',
		})
	},
	result() {
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