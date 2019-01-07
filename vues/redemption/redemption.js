// vues/redemption/redemption.js
var wxbarcode = require('../../utils/index.js');
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		id:'',
		memberCoupon:'',
		memberCouponData:'',
		timer:null,
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.setData({
			id: options.id
		})
		this.getData()
		wxbarcode.barcode('barcode', options.id, 539,180);
		wxbarcode.qrcode('qrcode', options.id, 300,300);
		this.data.timer = setInterval(()=>{
			this.getData()
		},3000)
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {

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
					if (res.data.data.memberCoupon.couponType == 1) {
						that.data.data = res.data.data.memberCouponData
						that.data.memberCoupon = res.data.data.memberCoupon
						that.setData({
							memberCouponData: that.data.data,
							memberCoupon: that.data.memberCoupon,
						})
					} else if (res.data.data.memberCoupon.couponType == 0) {
						that.data.data = {
							productImageUrl: 'https://cdn.lastmiles.cn/apps/6483222961544245248.png?size=23088',
							productName: 'HEJMO咖啡电子赠饮券',
							useDesc1: '1、凭此券和实体券可到羿玛又一城店换取任意一杯中杯饮品；',
							useDesc2: '2、电子券使用期限跟实体券上的一致，过期作废。'
						}
						that.data.memberCoupon = res.data.data.memberCoupon

						that.setData({
							memberCouponData: that.data.data,
							memberCoupon: that.data.memberCoupon,
						})
					}

					if(res.data.data.memberCoupon.useStatus==1){
						clearInterval(that.data.timer)
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
		clearInterval(this.data.timer)
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