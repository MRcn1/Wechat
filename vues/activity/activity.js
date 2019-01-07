// vues/activity/activity.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		index: 0,
		pageNum: 1,
		totalPages: 0,
		data: [],
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.getData(this.data.index)
	},
	active(e) {
		this.data.index = e.currentTarget.dataset.index
		this.setData({
			index: this.data.index,
			pageNum: 1,
			data: []
		})
		this.getData(this.data.index)

	},
	getData(n) {
		let that = this
		wx.request({
			url: getApp().globalData.baseUrl + getApp().globalData.project + 'subject/findSubjectListForXcx',
			data: {
				token: getApp().globalData.token,
				pageNum: this.data.pageNum,
				pageSize: 20,
				subjectCategory: n,
			},
			header: {
				'content-type': 'application/json' // 默认值
			},
			success: function (res) {
				if (res.data.code == 0) {
					that.data.data = that.data.data.concat(res.data.data.content)
					that.setData({
						totalPages: res.data.data.totalPages,
						data: that.data.data
					})
				} else {
					wx.showModal({
						title: '提示',
						content: res.data.message,
					})
					that.setData({
						hiddenLoading: true
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
	onReachBottom: function () {
		if (this.data.pageNum == this.data.totalPages) {
			return
		}
		this.data.pageNum++
		this.setData({
			pageNum: this.data.pageNum
		})
		this.getData(this.data.index)
		console.log(this.data.pageNum)
	},
	tospecial(e){
		wx.navigateTo({
			url: '../special/special?id=' + e.currentTarget.dataset.id,
		})
	},
	clickForXcx(e) {
		console.log(e.currentTarget.dataset.id)
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
					console.log(that.data.data[e.currentTarget.dataset.index])
					wx.request({
						url: getApp().globalData.baseUrl + getApp().globalData.project + 'subject/createSubjectByClickForXcx',
						data: {
							token: getApp().globalData.token,
							id: e.currentTarget.dataset.id
						},
						header: {
							'content-type': 'application/json' // 默认值
						},
						success: function (res) {
							if (res.data.code == 0) {
								let obj = that.data.data
								obj[e.currentTarget.dataset.index].clickStatus = 0
								obj[e.currentTarget.dataset.index].clickNum == obj[e.currentTarget.dataset.index].clickNum++
								that.setData({
									data: obj
								})
								console.log(that.data.data[e.currentTarget.dataset.index])
							} else {
								wx.showModal({
									title: '提示',
									content: res.data.message,
								})
								that.setData({
									hiddenLoading: true
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



		// wx.request({
		// 	url: getApp().globalData.baseUrl + getApp().globalData.project + 'subject/createSubjectByClickForXcx',
		// 	data: {
		// 		token: getApp().globalData.token,
		// 		id: e.currentTarget.dataset.id
		// 	},
		// 	header: {
		// 		'content-type': 'application/json' // 默认值
		// 	},
		// 	success: function (res) {
		// 		if (res.data.code == 0) {
		// 			that.getData(that.data.index)
		// 		} else {
		// 			wx.showModal({
		// 				title: '提示',
		// 				content: res.data.message,
		// 			})
		// 			that.setData({
		// 				hiddenLoading: true
		// 			})
		// 		}
		// 	},
		// 	fail: function (res) {
		// 		wx.showModal({
		// 			title: '提示',
		// 			content: '网络超时',
		// 			showCancel: false
		// 		})
		// 	}
		// })
	}
})