// vues/maca/maca.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		cadou: 0,
		data: [],
		pageNum: 1
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.getCaDou()
		this.getCaDouList()
	},
	getCaDou() {
		let that = this
		wx.request({
			url: getApp().globalData.baseUrl + getApp().globalData.project + 'member/findMemberSourceForXcx',
			data: {
				token: getApp().globalData.token,
			},
			header: {
				'content-type': 'application/json' // 默认值
			},
			success: function (res) {
				that.setData({
					cadou: res.data.data.score
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
	getCaDouList() {
		let that = this
		wx.request({
			url: getApp().globalData.baseUrl + getApp().globalData.project + 'member/findMemberSourceRecordListForXcx',
			data: {
				token: getApp().globalData.token,
				pageNum: '1',
				pageSize: '20',
			},
			header: {
				'content-type': 'application/json' // 默认值
			},
			success: function (res) {
				res.data.data.filter(res=>{
					if(res.changeType==0){
						res.changeTypename = '购物消费送积分'
					}else if(res.changeType==1){
						res.changeTypename = '活动送积分'
					}else if(res.changeType==2){
						res.changeTypename = '积分兑换'
					}else if(res.changeType==3){
						res.changeTypename = '手动修改积分'
					}else if(res.changeType==4){
						res.changeTypename = '积分初始化'
					}
				})
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
	onReachBottom: function () {
		var that = this;
		// 显示加载图标
		wx.showLoading({
			title: '玩命加载中',
		})
		// 页数+1
		this.data.pageNum + 1;
		this.setData({
			pageNum: this.data.pageNum
		})
		wx.request({
			url: getApp().globalData.baseUrl + getApp().globalData.project + 'member/findMemberSourceRecordListForXcx',
			data: {
				token: getApp().globalData.token,
				pageNum: this.pageNum,
				pageSize: '20',
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