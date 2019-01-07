// pages/submitOrder/index.js
Page({

	/**
	 * 页面的初始数
	 */
	data: {
		index: [],
		active: 0,
		discountCouponRecordId:'',
		data: [],
		cannelJson: [],
		state: 0,
		dec: '',
		code: '',
		array: [],
		index1: 0,
		index: -1,
		numbers: 0,
		money: 0,
		hiddenLoading: true,
		shopListId: 0,
		arrayss: [],
		dataMoney: 0,
		clickStatus: false,
		tickStatus: false,
		show: false,
		H: "",
		m: "",
		allprice: 0,
		Netprice: 0,
		collectType: 0,
		storeId: '',
		remark: '', //备注
		packagePrice: 0, //包装费
		tsbaoz: '', //是否要包装
		baopricr: 0,
		AvailableData: [],
		unavailableData: [],
		yhshow: false,
		offerPrice: 0,
		indexs:-1,
		arrays: [{
				name: '告白',
				value: '1',
				checked: 'true'
			},
			{
				name: '占卜',
				value: '0'
			}

		]
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		wx.setNavigationBarTitle({
			title: '提交订单',
		})
		this.takemeal()
		if (!!options.tickStatus) {
			this.setData({
				tickStatus: options.tickStatus,
				dataMoney: options.dataMoney,
			})
		}
		console.log(JSON.parse(options.json))

		this.setData({
			data: JSON.parse(options.json),
			storeId: options.storeId
			// cannelJson: JSON.parse(options.cannelData)

		})

		this.data.data.filter(res => {
			this.data.allprice += res.numbers * res.salePrices
		})
		this.setData({
			allprice: this.data.allprice.toFixed(2),
			Netprice: this.data.allprice.toFixed(2)
		})
		this.shopList()


		// console.log(this.data.cannelJson)
		let data = this.data.data
		let index = 1

		let numbers = 0 //计算总数
		let money = 0 //计算总金额
		//添加问答
		for (let i = 0; i < this.data.data.length; i++) {
			numbers += parseInt(data[i].numbers)
			money += parseFloat((data[i].salePrice))


			if (i == 0) {
				data[i].state = true //让状态收缩

			} else {
				data[i].state = false //让状态收缩

			}
			let arr = []
			let message = []
			//根据商品的数量加载需要多少个问答  
			for (let j = 0; j < data[i].numbers; j++) {
				arr.push(index)

				//问答初始为空
				let obj = {
					dec: '',
					state: 1
				}
				message.push(obj)
				//index 不断增加 实现问答1~xxx
				index++
			}
			data[i].messageIndex = arr
			data[i].message = message
			console.log(111, data[i].numbers)
			// this.data.packagePrice = data[i].packagePrice * data[i].numbers
			this.data.baopricr = data[i].packagePrice * data[i].numbers
		}
		this.findDiscountCouponListForXcx() //获得优惠券

		this.setData({
			data: data,
			money: money.toFixed(2),
			numbers: numbers,
			baopricr: this.data.baopricr
		})


	},
	findDiscountCouponListForXcx() {
		let that = this
		let arr = []
		for (let i = 0; i < this.data.data.length; i++) {
			arr.push(this.data.data[i].id)
		}
		wx.request({
			url: getApp().globalData.baseUrl + getApp().globalData.project + 'order/findDiscountCouponListForXcx',
			data: {
				token: getApp().globalData.token,
				productIds: arr,
			},
			header: {
				'content-type': 'application/json' // 默认值
			},
			success: function (res) {
				if (res.data.code == 0) {
					let data = res.data.data

					var timestamp = (new Date()).getTime();
					data.filter(res => {
						let strtime = res.startDeadlineDate
						let endime = res.endDeadlineDate
						var date1 = new Date(strtime.replace(/-/g, '/'));
						var date2 = new Date(endime.replace(/-/g, '/'));
						// if (date1 <= timestamp && date2 >= timestamp && that.data.money>=res.useCondition) {
						// 	that.data.AvailableData.push(res)
						// } else {
						// 	that.data.unavailableData.push(res)
						// }

						if (res.useProductScope == 1) {
							if (date1 < timestamp && date2 > timestamp && that.data.money >= res.useCondition) {
								that.data.AvailableData.push(res)
							} else {
								that.data.unavailableData.push(res)
							}
						} 
						else if (res.useProductScope == 0) {
							JSON.parse(res.productIds).filter(val => {
								that.data.data.filter(item => {
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
	changeData(a, b,c,d) {
		this.setData({
			yhshow: a,
			offerPrice: b,
			indexs:c,
			discountCouponRecordId:d
		})
	},
	tocoupon() {
		console.log(this.data.data)
		let data = []
		this.data.data.filter(res => {
			data.push(res.id)
		})
		wx.navigateTo({
			url: '../coupon/coupon?data=' + JSON.stringify(data) +  '&indexs=' + this.data.indexs + '&money=' + this.data.money + '&productData=' + JSON.stringify(this.data.data)
		})
	},
	takemeal() {
		var myDate = new Date()
		let h = myDate.getHours();
		let m = myDate.getMinutes();
		this.data.m = m + 10 > 59 ? '0' + (m - 50) : m + 10
		if (m + 10 > 59) {
			this.data.H = h + 1
			if (h > 23) {
				this.data.H = '00'
			}
		} else {
			this.data.H = h
		}
		this.setData({
			H: this.data.H,
			m: this.data.m
		})
	},
	listenerRadioGroup(e) {
		let index = e.currentTarget.dataset.index
		let indexs = e.currentTarget.dataset.indexs
		let value = e.detail.value
		console.log(e)
		let obj = this.data.data
		obj[indexs].message[index].state = e.detail.value
		this.setData({
			data: obj
		})
		console.log(this.data.data)
	},
	listenerPickerSelected(e) {
		console.log(e)
		let index = e.detail.value
		// let parentIndex = e.currentTarget.dataset.indexs
		console.log(index)

		this.setData({
			shopListId: this.data.arrayss[index].id,
			index: index
		})
		console.log(this.data.arrayss[index].id)
	},
	codes(e) {
		this.setData({
			code: e.detail.value
		})

		if (e.detail.value != '') {
			this.setData({
				clickStatus: true
			})
		} else {
			this.setData({
				clickStatus: false
			})
		}

		// console.log(this.data.name)

	},
	hide() {
		this.setData({
			show: false
		})
	},
	addTick() {
		this.setData({
			show: false
		})
		wx.navigateTo({
			url: '../addTick/index?money=' + this.data.money + '&soterId=' + this.data.shopListId + '&json=' + JSON.stringify(this.data.data),
		})
	},
	add() {
		if (this.data.shopListId == 0) {
			wx.showModal({
				title: '提示',
				content: '请选择门店',
				showCancel: false
			})
			return false
		}
		this.setData({
			show: true
		})
	},
	ss() {
		let that = this
		this.setData({
			show: false
		})

		wx.scanCode({
			success: (res) => {
				this.show = res.result;
				that.setData({
					code: this.show
				})

				wx.request({
					url: getApp().globalData.baseUrl + getApp().globalData.project + 'order/findCouponByCode',
					data: {
						token: getApp().globalData.token,
						storeId: that.data.shopListId,
						code: this.data.code
					},
					header: {
						'content-type': 'application/json' // 默认值
					},
					success: function (res) {

						if (res.data.code == 0) {
							wx.showToast({
								title: '验证成功',
								icon: 'success',
								duration: 2000
							})

							if (res.data.data > that.data.money) {
								wx.navigateTo({
									url: '../tick/tick?money=' + that.data.money + '&tickMoney=' + res.data.data + '&code=' + that.data.code,
								})
								// wx.showModal({
								//   title: '提示',
								//   content: '优惠券金额大于订单总金额',
								//   showCancel:false
								// })
							} else {
								that.setData({
									tickStatus: true
								})
								that.setData({
									dataMoney: res.data.data.toFixed(2)
								})
							}
						} else {
							wx.showModal({
								title: '提示',
								content: res.data.message,
								showCancel: false
							})

							that.setData({
								dataMoney: 0,
								code: ''
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
			fail: (res) => {

			}
		})

	},
	change() {
		if (!this.data.clickStatus) {
			return false
		}
		if (this.data.shopListId == 0) {
			wx.showModal({
				title: '提示',
				content: '请选择门店',
				showCancel: false
			})
			return false
		}
		let that = this
		wx.request({
			url: getApp().globalData.baseUrl + getApp().globalData.project + 'order/findCouponByCode',
			data: {
				token: getApp().globalData.token,
				storeId: that.data.shopListId,
				code: this.data.code
			},
			header: {
				'content-type': 'application/json' // 默认值
			},
			success: function (res) {

				if (res.data.code == 0) {


					if (res.data.data > that.data.money) {
						wx.navigateTo({
							url: '../tick/tick?money=' + that.data.money + '&tickMoney=' + res.data.data + '&code=' + that.data.code,
						})
						// wx.showModal({
						//   title: '提示',
						//   content: '优惠券金额大于订单总金额',
						//   showCancel:false
						// })
					} else {
						that.setData({
							tickStatus: true
						})
						that.setData({
							dataMoney: res.data.data.toFixed(2)
						})
					}
				} else {
					wx.showModal({
						title: '提示',
						content: res.data.message,
						showCancel: false
					})
					that.setData({
						dataMoney: 0
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
	close() {
		this.setData({
			tickStatus: false
		})
		this.setData({
			dataMoney: 0
		})
	},
	bindDec(e) {
		let index = e.currentTarget.dataset.index
		let parentIndex = e.currentTarget.dataset.indexs
		// console.log(index)
		// console.log(parentIndex)
		let obj = this.data.data
		obj[parentIndex].message[index].dec = e.detail.value
		this.setData({
			data: obj
		})
		// console.log(this.data.data)
	},

	submitInfo(e) {
		let id = e.detail.formId
		console.log(id)

		console.log(this.data.shopListId)
		// if (this.data.shopListId == 0) {
		//   wx.showModal({
		//     title: '提示',
		//     content: '请选择门店',
		//     showCancel: false
		//   })
		//   return false
		// }

		let that = this

		this.setData({
			hiddenLoading: false
		})


		let obj = ''
		let arr = []

		let objData = []
		console.log(this.data.data)

		for (let i = 0; i < this.data.data.length; i++) {

			arr = []

			for (let j = 0; j < that.data.data[i].message.length; j++) {
				//  console.log(2)
				let objs = {
					messageType: that.data.data[i].message[j].state,
					messageContent: that.data.data[i].message[j].dec
				}

				arr.push(objs)

			}

			obj = {
				productId: this.data.data[i].id,
				// quantity: this.data.data[i].numbers,
				quantity: this.data.data[i].numbers,

				productSpecificationAttrId: this.data.data[i].productSpecificationAttrId,
				productSpecContent: this.data.data[i].rules,
				messageData: arr

			}

			objData.push(obj)



		}

		let arrData = JSON.stringify(objData)
		wx.request({
			url: getApp().globalData.baseUrl + getApp().globalData.project + 'order/createOrderForXcx',
			data: {
				token: getApp().globalData.token,
				productData: arrData,
				// bookStatus:1,
				formId: id,
				collectType: that.data.active,
				remark: that.data.remark,
				storeId: that.data.storeId,
				couponCode: that.data.code,
				discountCouponRecordId:that.data.discountCouponRecordId,
				paymentAmount: that.data.money - that.data.dataMoney + that.data.packagePrice - that.data.offerPrice >= 0 ? that.data.money - that.data.dataMoney + that.data.packagePrice - that.data.offerPrice : '0.01',
				discountAmount: 0,
				couponAmount: that.data.money - that.data.dataMoney >= 0 ? that.data.dataMoney : that.data.money - 0.01


			},
			header: {
				'content-type': 'application/json' // 默认值
			},
			success: function (res) {
				if (res.data.code == 0) {
					that.setData({
						cannelJson: res.data.data
					})

					//  let arr1 = []
					// //  console.log(that.data.data)
					//  for (let i = 0; i < that.data.data.length; i++) {
					//    console.log(that.data.data[i].message)

					//    for(let j=0;j<that.data.data[i].message.length;j++){
					//     //  console.log(2)
					//    let obj = {
					//      orderId: res.data.data.orderId,
					//      productId: that.data.data[i].id,
					//      messageType: that.data.data[i].message[j].state,
					//      messageContent: that.data.data[i].message[j].dec 
					//    }
					//    arr1.push(obj)
					//    }
					//  }


					//  console.log(arr1)
					//  wx.request({
					//    url: getApp().globalData.baseUrl + getApp().globalData.project + 'order/createOrderLeaveMessageListForXcx',
					//    data: {
					//      token: getApp().globalData.token,
					//      messageData: JSON.stringify(arr1)
					//    },
					//    header: {
					//      'content-type': 'application/json' // 默认值
					//    },
					//    success: function (res) {

					//      if(res.data.code == 0){


					wx.request({
						url: getApp().globalData.baseUrl + 'wechat-api/merchantPay/xcxPay',

						data: {
							token: getApp().globalData.token,
							appId: 'wxec2a29fc787ccf01',
							amount: parseFloat((that.data.cannelJson.amount * 100).toFixed(2)), //单位为分 需要乘以100
							productName: that.data.cannelJson.productName,
							orderNo: that.data.cannelJson.orderNo,
							openId: getApp().globalData.openId,
							notifyUrl: getApp().globalData.baseUrl + getApp().globalData.project + 'order/paymentNotify'
						},
						header: {
							'content-type': 'application/json' // 默认值
						},
						success: function (res) {
							if (res.data.code != 0) {
								wx.showModal({
									title: '提示',
									content: res.data.message,
									showCancel: false
								})
							}
							console.log(res.data)
							console.log(res.data.data.timeStamp)
							console.log(res.data.data.nonceStr)
							console.log(res.data.data.package)
							console.log(res.data.data.sign)

							wx.requestPayment({
								'timeStamp': res.data.data.timeStamp,
								'nonceStr': res.data.data.nonceStr,
								'package': res.data.data.package,
								'signType': res.data.data.signType,
								'paySign': res.data.data.sign,
								'success': function (res) {
									console.log('支付成功')
									that.setData({
										state: 1,
										hiddenLoading: true
									})

									wx.navigateTo({
										url: '../orderMessage/index?id=' + that.data.cannelJson.orderId,
									})


								},
								'fail': function (res) {
									//  wx.showModal({
									//    title: '提示',
									//    content: '支付失败',
									//    showCancel: false
									//  })

									that.setData({
										state: 1,
										hiddenLoading: true
									})

									wx.navigateTo({
										url: '../orderMessage/index?id=' + that.data.cannelJson.orderId,
									})

								}
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
					//  }else{
					//    wx.showModal({
					//      title: '提示',
					//      content: res.data.message,
					//      showCancel:false
					//    })
					//  }

					//  }
					//  })

				} else {
					wx.showModal({
						title: '提示',
						content: res.data.message,
						showCancel: false
					})

					that.setData({
						hiddenLoading: true
					})
				}
			}
		})

	},
	shopList() {
		let that = this
		wx.request({
			url: getApp().globalData.baseUrl + getApp().globalData.project + 'store/findStoreListForXcx',
			data: {
				token: getApp().globalData.token,
			},
			header: {
				'content-type': 'application/json' // 默认值
			},
			success: function (res) {
				if (res.data.code == 0) {
					let obj = res.data.data
					let arr = []

					for (let i = 0; i < obj.length; i++) {
						arr.push(obj[i].storeName)
					}


					that.setData({
						arrayss: res.data.data,
						array: arr
					})

					if (!!arr && arr.length > 0) {

						console.log('id:' + res.data.data[0].id)
					}
				}
			}
		})
	},
	show(e) {
		let index = e.currentTarget.dataset.id
		let data = this.data.data
		data[index].state = !data[index].state
		// console.log(data)


		this.setData({
			data: data
		})
	},
	switch1Change(val) {
		if (val.detail.value) {
			this.data.tsbaoz = true
			this.setData({
				tsbaoz: this.data.tsbaoz,
				packagePrice: this.data.baopricr * 1,
			})
		} else {
			this.data.tsbaoz = false
			this.setData({
				tsbaoz: this.data.tsbaoz,
				packagePrice: 0,
			})
		}

		this.setData({
			tsbaoz: this.data.tsbaoz
		})
	},
	changeactive(e) {
		this.data.active = e.currentTarget.dataset.type
		this.setData({
			active: this.data.active,
			packagePrice: 0
		})
	},
	inputremark(e) {
		this.data.remark = e.detail.value
		this.setData({
			remark: this.data.remark
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
		// console.log(this.data.state)
		if (this.data.state == 1) {
			// console.log(342423)
			wx.switchTab({
				url: '../order/index'
			})
		}
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