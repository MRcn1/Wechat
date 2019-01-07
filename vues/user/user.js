// vues/user/user.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		show: false,
		status: 0,
		data: '',
		discountCouponData: '',
		giveScore: '',
		swiperConfig: '',
		list: [{
				name: '我的订单',
				url: 'https://cdn.lastmiles.cn/apps/6478459511253250048.png?size=1387',
				api: 'order'
			},
			{
				name: '我的咖豆',
				url: 'https://cdn.lastmiles.cn/apps/6478459683844665344.png?size=1763',
				api: 'maca'
			},
			{
				name: '我的卡包',
				url: 'https://cdn.lastmiles.cn/apps/6478459742011273216.png?size=1687',
				api: 'myKaBao'
			},
			// {
			// 	name:'收货地址',
			// 	url:'https://cdn.lastmiles.cn/apps/6478459789599846400.png?size=1886',
			// 	api:'maca'
			// },
		]
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		
		this.getImg()
	},
	getImg() {
		let that = this
		wx.request({
			url: getApp().globalData.baseUrl + getApp().globalData.project + 'advertisement/findAdvertisementListForXcx',
			data: {
				token: getApp().globalData.token,
				adType: 2,
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
	getData() {
		let that = this
		wx.request({
			url: getApp().globalData.baseUrl + getApp().globalData.project + 'memberActivity/giveMemberActivityByMemberIdForXcx',
			data: {
				token: getApp().globalData.token
			},
			success(res) {
				console.log(res.data.data.discountCouponData)
				if (res.data.code == 0) {
					that.data.discountCouponData = JSON.parse(res.data.data.discountCouponData)
					that.data.discountCouponData.filter(res => {
						res.startDeadlineDate = res.startDeadlineDate.substr(0, 10)
						res.endDeadlineDate = res.endDeadlineDate.substr(0, 10)
					})
					that.data.giveScore = res.data.data.giveScore
					that.setData({
						discountCouponData: that.data.discountCouponData,
						giveScore: !!that.data.giveScore ? that.data.giveScore : 0,
						show: true,
					})
				}
			},
			fail() {

			}
		})
	},
	zhidao() {
		this.setData({
			show: false
		})
	},
	toPersonal() {
		// wx.navigateTo({
		// 	url: '../personal/personal',
		// })
		if (this.data.status == 0) {
			wx.navigateTo({
				url: '../logs/logs',
			})
		}

	},
	torouter(e) {
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
					let api = e.currentTarget.dataset.id
					wx.navigateTo({
						url: `../${api}/${api}`,
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

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onPullDownRefresh: function () {
		// 显示顶部刷新图标
		wx.showNavigationBarLoading();
		this.getImg()
		setTimeout(() => {
			// 隐藏导航栏加载框
			wx.hideNavigationBarLoading();
			// 停止下拉动作
			wx.stopPullDownRefresh();
		}, 500)
	},
	onShow: function () {
		this.getData()
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
					that.setData({
						status: 1,
						data: res.data.data
					})

					// wx.navigateTo({
					// 	url: '../submitOrder/index?json=' + JSON.stringify(that.data.overData) + '&storeId=' + that.data.storeId,
					// })
				} else {
					that.setData({
						status: 0
					})
					// wx.navigateTo({
					// 	url: '../logs/logs?json=' + JSON.stringify(that.data.overData),
					// })

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

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

	}
})