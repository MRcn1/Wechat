// vues/coupon/coupon.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		actives: 0,
		sel: 1,
		dataId: [],
		AvailableData: [],
		unavailableData: [],
		indexs: -1,
		money: 0,
		discountCouponRecordId: '',
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.setData({
			dataId: JSON.parse(options.data),
			indexs: options.indexs,
			money: options.money,
			productData: JSON.parse(options.productData),
		})
		if (options.indexs != -1) {
			this.setData({
				sel: 0,
			})
		}
		this.getData()
	},
	getData() {
		let that = this
		wx.request({
			url: getApp().globalData.baseUrl + getApp().globalData.project + 'order/findDiscountCouponListForXcx',
			data: {
				token: getApp().globalData.token,
				productIds: this.data.dataId,
			},
			header: {
				'content-type': 'application/json' // 默认值
			},
			success: function (res) {
				if (res.data.code == 0) {
					that.data.data = res.data.data
					var timestamp = (new Date()).getTime();

					that.data.data.filter(res => {
						let strtime = res.startDeadlineDate
						let endime = res.endDeadlineDate
						var date1 = new Date(strtime.replace(/-/g, '/'));
						var date2 = new Date(endime.replace(/-/g, '/'));
						res.startDeadlineDate = res.startDeadlineDate.substr(0, 10)
						res.endDeadlineDate = res.endDeadlineDate.substr(0, 10)
						if (res.useProductScope == 1) {
							if (date1 < timestamp && date2 > timestamp && that.data.money >= res.useCondition) {
								that.data.AvailableData.push(res)
							} else {
								that.data.unavailableData.push(res)
							}
						} 
						else if (res.useProductScope == 0) {
							console.log(that.data.productData)
							JSON.parse(res.productIds).filter(val => {
								that.data.productData.filter(item => {
									if (val == item.id) {
										if (date1 < timestamp && date2 > timestamp && item.salePrice >= res.useCondition) {
											that.data.AvailableData.push(res)
										} else {
											that.data.unavailableData.push(res)
										}
									}
								})
							})
						}

					})
					that.setData({
						AvailableData: that.data.AvailableData,
						unavailableData: that.data.unavailableData
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
	tosubmitOrder() {
		let data = this.data.AvailableData[this.data.indexs]

		var pages = getCurrentPages();
		if (pages.length > 1) {
			//上一个页面实例对象
			var prePage = pages[pages.length - 2];
			//关键在这里
			if (this.data.indexs == -1) {
				prePage.changeData(false, 0, this.data.indexs, '')
			} else {
				prePage.changeData(true, data.discountContentTypeAmount, this.data.indexs, this.data.discountCouponRecordId)
			}
		}

		wx.navigateBack({
			data: data
		})
	},
	activechange(e) {
		this.data.actives = e.currentTarget.dataset.type
		this.setData({
			actives: this.data.actives
		})
	},
	changeimg(e) {
		if (this.data.indexs == e.currentTarget.dataset.index) {
			this.setData({
				// sel: this.data.sel,
				indexs: -1
			})
		} else {
			this.data.sel = e.currentTarget.dataset.sel
			this.data.indexs = e.currentTarget.dataset.index
			this.setData({
				// sel: this.data.sel,
				indexs: this.data.indexs,
				discountCouponRecordId: this.data.AvailableData[e.currentTarget.dataset.index].discountCouponRecordId
			})
		}

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