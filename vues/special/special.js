// vues/special/special.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		id:'',
		data:[],
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.setData({
			id: options.id
		})
		this.getData()
	},
	getData(){
		let that = this
		wx.request({
			url: getApp().globalData.baseUrl + getApp().globalData.project + 'subject/createSubjectByReadForXcx',
			data: {
				token: getApp().globalData.token,
				id:this.data.id
			},
			header: {
				'content-type': 'application/json' // 默认值
			},
			success: function (res) {
				if (res.data.code == 0) {
					that.setData({
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