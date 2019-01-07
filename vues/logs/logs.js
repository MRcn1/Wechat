// pages/phone/idnex.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		index: 1,
		minus: 60,
		codeState: true,
		stated: true,
		phone: '',
		code: '',
		state: 0,
		types: 0,
		data: '',
		arrData: '',
		hiddenLoading: true,
		phones: '',
		userDatas: ''

	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		// wx.setNavigationBarTitle({
		// 	title: '绑定手机号码',
		// })

		//从下单进来的
		if (!!options.json) {
			this.setData({
				data: options.json,
				types: 1,
				storeId:options.storeId,
			})
		}

		console.log(this.data.types)
	},
	phoneNumber(e) {

		this.setData({
			phone: e.detail.value
		})
		// console.log(this.data.name)

	},

	codeNumber(e) {

		this.setData({
			code: e.detail.value
		})
		// console.log(this.data.name)

	},

	onGotUserInfo: function (e) {
		console.log(e.detail.errMsg)

		let that = this


		if (e.detail.errMsg == 'getUserInfo:ok') {
			console.log('ok')
			console.log(e.detail.userInfo)
			console.log(e.detail.rawData)
			this.setData({
				userDatas: e.detail.userInfo
			})

			//如果是授权框绑定的 获取个人信息后显示绑定手机号码
			// if (that.data.index == 0) {
			// 	this.setData({
			// 		stated: false
			// 	})
			// 	wx.showModal({
			// 		title: '提示',
			// 		content: '授权成功，请点击绑定手机号码',
			// 		showCancel: false
			// 	})
			// }

			//手动绑定校验
			if (that.data.phone == '' && that.data.index == 1) {
				wx.showModal({
					title: '提示',
					content: '手机号码不能为空',
					showCancel: false
				})

				return false
			}
			

			//判断验证码
			// if (that.data.code == '' && that.data.index == 1) {
			// 	wx.showModal({
			// 		title: '提示',
			// 		content: '验证码不能为空',
			// 		showCancel: false
			// 	})

			// 	return false
			// }

			//手动绑定校验
			if (that.data.phone.length != 11 && that.data.index == 1) {
				wx.showModal({
					title: '提示',
					content: '手机号码应为11位数',
					showCancel: false
				})

				return false
			}

			if (that.data.code == '' && that.data.index == 1) {
				wx.showModal({
					title: '提示',
					content: '验证码不能为空',
					showCancel: false
				})

				return false
			}

			if (this.data.state == 0 && this.data.index == 1) {
				this.setData({
					hiddenLoading: false
				})
				//校验验证码
				wx.request({
					url: getApp().globalData.baseUrl + getApp().globalData.project + 'member/validateCodeForXcx',
					data: {
						token: getApp().globalData.token,
						code: this.data.code
					},
					header: {
						'content-type': 'application/json' // 默认值
					},
					success: function (res) {
						if (res.data.code == 0) {
							//验证码正确 绑定手机号码
							that.bindPhone()

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
			}
		}
	},
	bindPhone() {
		let that = this
		console.log(this.data.phones)
		wx.request({
			url: getApp().globalData.baseUrl + getApp().globalData.project + 'member/loginForXcx',
			data: {
				token: getApp().globalData.token,
				openId: getApp().globalData.openId,
				nickName: this.data.userDatas.nickName,
				gender: this.data.userDatas.gender,
				language: this.data.userDatas.language,
				city: this.data.userDatas.city,
				province: this.data.userDatas.province,
				country: this.data.userDatas.country,
				avatarUrl: this.data.userDatas.avatarUrl,
				phone: that.data.index == 1 ? this.data.phone : this.data.phones
			},
			header: {
				'content-type': 'application/json' // 默认值
			},
			success: function (res) {
				console.log("信息储存到后台")
				that.setData({
					state: 1
				})


				//判断是从哪个页面进入
				if (that.data.types == 0) {
					wx.navigateBack({
						nickName: that.data.userDatas.nickName,
						avatarUrl: that.data.userDatas.avatarUrl,
						phone: that.data.index == 1 ? that.data.phone : that.data.phones,
						status:1
					})
				} else {

					wx.redirectTo({
						url: '../submitOrder/index?json=' + that.data.data   + '&storeId='+that.data.storeId,
					})

					// wx.request({
					//   url: getApp().globalData.baseUrl + getApp().globalData.project + 'order/createOrderForXcx',
					//   data: {
					//     token: getApp().globalData.token,
					//     productData: that.data.arrData
					//   },
					//   header: {
					//     'content-type': 'application/json' // 默认值
					//   },
					//   success: function (res) {
					//     that.setData({
					//       hiddenLoading: true
					//     })
					//     wx.redirectTo({
					//       url: '../submitOrder/index?json=' + that.data.data + '&cannelData=' + JSON.stringify(res.data.data),
					//     })

					//   }
					// })

				}
			},
			fail: function (res) {
				wx.showModal({
					title: '提示',
					content: '网络超时',
					showCancel: false
				})
			}
		});
	},
	bind() {
		wx.navigateTo({
			url: '../submitOrder/index',
		})
	},
	getPhoneNumber: function (e) {
		console.log(123)
		console.log(e.detail.errMsg)
		console.log(e.detail)
		let that = this
		// console.log(e.detail)
		if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
			wx.showModal({
				title: '提示',
				showCancel: false,
				content: '未授权',
				success: function (res) {}
			})
		} else {
			wx.request({
				url: getApp().globalData.baseUrl + 'wechat-api/miniProgram/getPhoneNumber',
				data: {
					token: getApp().globalData.token,
					sessionKey: getApp().globalData.sessionKey,
					encryptedData: e.detail.encryptedData,
					iv: e.detail.iv
				},
				header: {
					'content-type': 'application/json' // 默认值
				},
				success: function (res) {
					if (res.data.code == 0) {
						that.setData({
							phones: res.data.data.phoneNumber
						})

						that.setData({
							hiddenLoading: false
						})


						that.bindPhone()
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
		}
	},
	tabs(e) {
		let index = e.currentTarget.dataset.id
		this.setData({
			index: index
		})
	},
	code() {
		if (this.data.codeState) {
			// 发送验证码
			this.sendCode()

		}
	},
	//获得验证码
	sendCode() {
		let that = this

		if (this.data.phone == '') {
			wx.showModal({
				title: '提示',
				content: '手机号码不能为空',
				showCancel: false
			})

			return false
		}

		wx.request({
			url: getApp().globalData.baseUrl + getApp().globalData.project + 'member/sendMessageForXcx',
			data: {
				token: getApp().globalData.token,
				phone: this.data.phone
			},
			header: {
				'content-type': 'application/json' // 默认值
			},
			success: function (res) {
				if (res.data.code == 0) {
					that.setData({
						codeState: false
					})

					var int = setInterval(function () {
						if (that.data.minus > 0) {
							that.setData({
								minus: that.data.minus - 1
							})
						} else {
							clearInterval(int)
							that.setData({
								minus: 60,
								codeState: true
							})
						}
					}, 1000)
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


})