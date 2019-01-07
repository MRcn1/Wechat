//app.js
App({
	onLaunch: function () {
		// 展示本地存储能力
		var logs = wx.getStorageSync('logs') || []
		logs.unshift(Date.now())
		wx.setStorageSync('logs', logs)


		//更新微信
		if (wx.openBluetoothAdapter) {
			wx.openBluetoothAdapter()
		} else {
			// 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
			wx.showModal({
				title: '提示',
				content: '当前微信版本过低，无法使用部分功能，请升级到最新微信版本后重试。'
			})
		}

		//强制更新机制
		const updateManager = wx.getUpdateManager()

		updateManager.onCheckForUpdate(function (res) {
			// 请求完新版本信息的回调
			console.log('新版本:' + res.hasUpdate)
		})

		updateManager.onUpdateReady(function () {
			// wx.showModal({
			//   title: '更新提示',
			//   content: '新版本已经准备好，是否重启应用？',
			//   success: function (res) {
			//     if (res.confirm) {

			//     }
			//   }
			// })
			// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
			updateManager.applyUpdate()

		})

		updateManager.onUpdateFailed(function () {
			// 新的版本下载失败
		})

		// 登录
		wx.login({
			success: res => {
				// 发送 res.code 到后台换取 openId, sessionKey, unionId
				console.log('登陆成功')
				console.log(res)
				if (res.code) {
					wx.request({
						url: 'https://coffee-test.lastmiles.cn/wechat-api/miniProgram/loginAuthorization?appId=wxec2a29fc787ccf01&secret=acf0c755aef68b72f789f29ccdff5e19&jsCode=' + res.code + '&grant_type=authorization_code',
						header: {
							'content-type': 'application/json'
						},
						success: res => {
							console.log(res)
							console.log('注册成功')
							this.globalData.token = res.data.data.token;
							this.globalData.openId = res.data.data.openId;
							this.globalData.sessionKey = res.data.data.sessionKey;
							console.log(res.data.data.openId)
							let that = this;
							console.log(res.data.data.token)
						}
					})
				}
			}
		})
		// 每一个小时获取一个新的token(防止用户停留在页面太久导致token过期)
		setInterval(function () {
			// 登录
			wx.login({
				success: res => {
					// 发送 res.code 到后台换取 openId, sessionKey, unionId
					console.log('登陆成功')
					console.log(res)
					if (res.code) {
						wx.request({
							url: 'https://coffee-test.lastmiles.cn/wechat-api/miniProgram/loginAuthorization?appId=wxec2a29fc787ccf01&secret=acf0c755aef68b72f789f29ccdff5e19&jsCode=' + res.code + '&grant_type=authorization_code',
							header: {
								'content-type': 'application/json'
							},
							success: res => {
								console.log(res)
								console.log('注册成功')
								this.globalData.token = res.data.data.token;
								this.globalData.openId = res.data.data.openId;
								this.globalData.sessionKey = res.data.data.sessionKey;
								console.log(res.data.data.openId)
								let that = this;
							}
						})
					}
				}
			})
		}, 3600000)

	},
	globalData: {
		userInfo: null,
		token: null,
		openId: null,
		sessionKey: null,
		// baseUrl: 'https://coffee-xcx-api.lastmiles.cn/',
		baseUrl: 'https://coffee-test.lastmiles.cn/',
		project: 'lastmiles-coffee-xcx-api/',
	}
})