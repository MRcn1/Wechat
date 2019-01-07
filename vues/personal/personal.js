// vues/personal/personal.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		list: [{
				name: '头像',
				id: 0
			},
			{
				name: '昵称',
				id: 1
			},
			{
				name: '性别',
				id: 2
			},
			{
				name: '绑定手机',
				id: 3
			},
		]
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.getData()
	},
	getData() {
		wx.request({
			url: getApp().globalData.baseUrl + getApp().globalData.project + 'member/findMemberByIdForXcx',
			data: {
				token: getApp().globalData.token,
			},
			header: {
				'content-type': 'application/json' // 默认值
			},
			success: function (res) {
				
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