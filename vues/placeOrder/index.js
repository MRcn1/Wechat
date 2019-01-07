// pages/placeOrder/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    indexsss: 0,
    parenIndexs: '',
    lists: [],
    list: [],
    toView: 'eeede',
    active: [],
    indexs: '',
    showM: false,
    data: [],
    shopCarShow: false,
    specificationList: [],
    listData: [],
    salePrice: 0,
    productSpecificationAttrId: 0,
    specificationdetailimage: '',
    specificationdescription: '',
    overData: [],
    data: {},
    hiddenLoading: false,
    sumPrice: 0,
    sumNumber: 0,
    cHeight: 0,
    sHeight: 0,
    listShop: [],
    categoryName: '',
    storeList: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    var int = setInterval(function () {
      // console.log(!!getApp().globalData.token)
      if (!!getApp().globalData.token) {
        clearInterval(int)




        // 获取门店分类
        that.classf()
        that.findStoreListForXcx()
        console.log(that.data.listShop)
      }
    }, 100)

  },
  findStoreListForXcx() {
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
        that.setData({
          hiddenLoading: true
        })

        if (res.data.code == 0) {
          that.data.storeList = res.data.data[0]
          that.setData({
            storeList: that.data.storeList,
            storeId: that.data.storeList.id
          })
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
  scroll(e) {
    let topValue = e.detail.scrollTop
    // console.log('bottom:' + e.detail.scrollBottom)
    console.log(topValue)
    let that = this

    //获取计算的特定高度 - 盒子
    var query = wx.createSelectorQuery()
    query.select('#isTop').boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(function (res) {
      // console.log(res[0].height)
      that.setData({
        cHeight: res[0].height
      })
    })

    //获取计算的特定高度 - 标题
    var query1 = wx.createSelectorQuery()
    query1.select('#isTopTitle').boundingClientRect()
    query1.selectViewport().scrollOffset()
    query1.exec(function (res) {
      // console.log(res[0].height)
      that.setData({
        sHeight: res[0].height
      })
    })

    // 获取每个分类各自的高度  盒子高度*length+标题高度
    let arr = []
    let h = 0
    // console.log(this.data.list)
    for (let i = 0; i < this.data.list.length; i++) {
      let length = this.data.list[i].productList.length
      h += this.data.sHeight + this.data.cHeight * length


      arr.push(h)

    }

    // console.log(arr)

    for (let i = 0; i < arr.length; i++) {
      //判断所处区间 改变所选的值
      if (topValue >= arr[i] && topValue <= arr[i + 1]) {
        // console.log('到'+(i+1)+'个')
        this.setData({
          indexsss: i + 1
        })

        // console.log(this.data.indexsss)
      }
    }

    //小于第二个标题时回到第一个
    if (topValue < arr[0]) {
      // console.log('到'+(i+1)+'个')
      this.setData({
        indexsss: 0
      })


    }

  },
  classf() {
    let that = this
    wx.request({
      url: getApp().globalData.baseUrl + getApp().globalData.project + 'product/findProductCategoryForXcx',
      data: {
        token: getApp().globalData.token,

      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        that.setData({
          hiddenLoading: true
        })
        if (res.data.code == 0) {


          that.setData({
            list: res.data.data
          })

          if (res.data.data.length > 0) {
            that.setData({
              categoryName: res.data.data[0].categoryName
            })
            that.shop(res.data.data[0].id)

          }

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
  shop(id) {
    let that = this


    wx.request({
      url: getApp().globalData.baseUrl + getApp().globalData.project + 'product/findProductListByProductCategoryIdForXcx',
      data: {
        token: getApp().globalData.token,
        productCategoryId: id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        that.setData({
          hiddenLoading: true
        })
        if (res.data.code == 0) {

          let data = res.data.data

          if (!!data) {
            for (let i = 0; i < res.data.data.length; i++) {
              data[i].numbers = 0
              data[i].number = 0
            }

            console.log(that.data.overData)

            for (let i = 0; i < data.length; i++) {
              for (let j = 0; j < that.data.overData.length; j++) {
                if (data[i].productId == that.data.overData[j].id) {
                  console.log(12121)
                  data[i].number = that.data.overData[j].numbers
                  data[i].numbers = that.data.overData[j].numbers
                }
              }
            }
          }
          that.setData({
            listShop: data
          })
          console.log(that.data.listShop)
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
  clear() {
    //清空购物车
    let list = this.data.listShop
    for (let i = 0; i < list.length; i++) {

      list[i].numbers = 0

    }
    this.setData({
      overData: [],
      listShop: list,
      shopCarShow: false
    })
  },
  hide() {
    //隐藏规格框
    this.setData({
      showM: false,
      listData: []
    })
  },
  over() {
    if (this.data.overData.length == 0) {
      wx.showModal({
        title: '提示',
        content: '你的购物车是空的呦',
        showCancel: false
      })

      return false
    }
    this.setData({
      hiddenLoading: false
    })
    let that = this
    console.log(this.data.overData)
    let arr = []
    for (let i = 0; i < this.data.overData.length; i++) {
      let obj = {
        productId: this.data.overData[i].id,
        quantity: this.data.overData[i].numbers,
        productSpecificationAttrId: this.data.overData[i].productSpecificationAttrId,
        productSpecContent: this.data.overData[i].rules
      }
      arr.push(obj)
    }
    let arrData = JSON.stringify(arr)

    //  wx.navigateTo({
    //   url: '../submitOrder/index?json='+JSON.stringify(that.data.overData),
    // })

    // console.log('openID:' + getApp().globalData.openId)

    wx.request({
      url: getApp().globalData.baseUrl + getApp().globalData.project + 'member/findOneByOpenIdForXcx',
      data: {
        token: getApp().globalData.token,
        openId: getApp().globalData.openId
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res)
        if (res.data.code == 0) {
          if (!!res.data.data) {

            that.setData({
              hiddenLoading: true
            })

            wx.navigateTo({
              url: '../submitOrder/index?json=' + JSON.stringify(that.data.overData) + '&storeId=' + that.data.storeId,
            })

            // wx.request({
            //   url: getApp().globalData.baseUrl + getApp().globalData.project + 'order/createOrderForXcx',
            //   data: {
            //     token: getApp().globalData.token,
            //     productData: arrData
            //   },
            //   header: {
            //     'content-type': 'application/json' // 默认值
            //   },
            //   success: function (res) {

            //     that.setData({
            //       hiddenLoading: true
            //     })

            //     if (res.data.code == 0) {
            //       wx.navigateTo({
            //         url: '../submitOrder/index?json=' + JSON.stringify(that.data.overData) + '&cannelData=' + JSON.stringify(res.data.data),
            //       })
            //     } else {
            //       wx.showModal({
            //         title: '提示',
            //         content: res.data.message,
            //         showCancel: false
            //       })
            //     }
            //   },
            //   fail: function (res) {
            //     wx.showModal({
            //       title: '提示',
            //       content: '网络超时',
            //       showCancel: false
            //     })
            //   }
            // })


          } else {
            that.setData({
              hiddenLoading: true
            })
            wx.navigateTo({
              url: '../logs/logs?json=' + JSON.stringify(that.data.overData) + '&storeId=' + that.data.storeId,
            })

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
  clicks(e) {
    //思路 通过改变规格值所在位置的state ，并将除了点击自己外的其他关闭选中状态

    //选中规格
    let index = e.currentTarget.dataset.indexs //获取选中的index（子）
    let parenIndex = e.currentTarget.dataset.index //当前处于的规格分类index（父）

    let obj = this.data.listData //规格值

    //每一个规格只能一个选中
    for (let i = 0; i < obj[parenIndex].specificationValueList.length; i++) {
      //除了选中的 其他取消选中
      if (i != index) {
        obj[parenIndex].specificationValueList[i].state = false
      } else {
        // 改变当前点击选中的状态
        obj[parenIndex].specificationValueList[i].state = true
      }
    }
    //组合id
    this.jsonID(obj)

    this.setData({
      listData: obj
    })

    // console.log(this.data.listData)

  },

  jsonID(obj) {
    //思路 组成‘父id,子id-父id,子id’搜索该组合的价格

    //组合id 通过组合ID获取该组合价格
    let char = ''


    for (let i = 0; i < obj.length; i++) {
      console.log(obj[i].specificationValueList)

      for (let j = 0; j < obj[i].specificationValueList.length; j++) {
        // 如果选中规格，获取规格分类和规格值id
        if (obj[i].specificationValueList[j].state) {
          // console.log(obj[i].ptSpecificationId)
          // console.log(obj[i].specificationValueList[j].specificationValId)
          char += obj[i].ptSpecificationId + ',' + obj[i].specificationValueList[j].specificationValId + '-'
        }
      }
    }

    //删掉最后的一个 ‘-’
    char = char.substr(0, char.length - 1)
    console.log(char)
    console.log(this.data.data.data.specificationPriceList)

    for (let i = 0; i < this.data.data.data.specificationPriceList.length; i++) {
      if (char == this.data.data.data.specificationPriceList[i].specificationAttribute) {
        // 获取组合ID与组合价格
        console.log('salePrice:' + this.data.data.data.specificationPriceList[i].salePrice)
        this.setData({
          salePrice: this.data.data.data.specificationPriceList[i].salePrice.toFixed(2),
          productSpecificationAttrId: this.data.data.data.specificationPriceList[i].productSpecificationAttrId
        })
      }
    }

  },
  sumData() {
    //计算购物车总数
    let sumNumber = 0
    let sumPrice = 0
	  console.log(this.data.overData)

    for (let i = 0; i < this.data.overData.length; i++) {
      sumNumber += parseInt(this.data.overData[i].numbers)
      sumPrice += parseFloat(this.data.overData[i].salePrice)
      // console.log(this.data.overData[i].sumPrice)

    }


    this.setData({
      sumNumber: sumNumber,
      sumPrice: sumPrice.toFixed(2)
    })
  },
  addCar() {

    //思路 如果该商品已存在 则通过组合ID判断是否存在 存在则数量+1 不存在则加入购物车

    // 添加购物车
    // console.log(this.data.data.data.specificationList)
    let index = this.data.indexs //位置 - 子
    let parenIndex = this.data.parenIndexs //位置-父
    let list = this.data.listShop //总数据列表

    // console.log('parenIndex:' + parenIndex)
    // console.log('index:' + index)
    console.log(list[index])


    // 该商品数量+1
    list[index].numbers = parseInt(list[index].numbers) + 1

    // console.log(list[parenIndex].productList[index].numbers)

    // let obj = {
    //   name: list[index].name
    // }


    let arr = ''
    for (let i = 0; i < this.data.listData.length; i++) {
      for (let j = 0; j < this.data.listData[i].specificationValueList.length; j++) {
        // 每一个规格值追加选中状态
        // console.log(this.data.listData[i].specificationValueList)
        //购物车里的规格值
        if (this.data.listData[i].specificationValueList[j].state == true) {
          // console.log(this.data.listData[i].specificationValueList[j].value)
          arr += this.data.listData[i].specificationValueList[j].value + '/'
        }


      }
    }


    let overData = this.data.overData //购物车数据
    let state = 0 //判断添加的是不是同样规格的商品
    // console.log('id:' + this.data.productSpecificationAttrId)
    

    for (let i = 0; i < this.data.overData.length; i++) {
      // console.log(overData[i].productSpecificationAttrId)
      //规格值ID 相同说明选的是同样规格的商品
      if (overData[i].productSpecificationAttrId == this.data.productSpecificationAttrId) {
		  console.log(overData[i])

        // 购物车该件商品数量+1
        overData[i].numbers = parseInt(overData[i].numbers) + 1
        //该件商品价格
		  console.log(overData[i].numbers)
		  console.log(overData[i].salePrice)
		  let price = overData[i].salePrices
		  overData[i].salePrice = parseFloat(overData[i].numbers * price).toFixed(2)
        state = 1
        break;
      }
    }

    //如果购物车没数据或者不是同样商品
    if (this.data.overData.length == 0 || state == 0) {
      let data = {
        productSpecificationAttrId: this.data.productSpecificationAttrId,
        salePrice: parseFloat(this.data.salePrice).toFixed(2),
        salePrices: this.data.salePrice, //低价，用来计算
        rules: arr.substr(0, arr.length - 1),
        numbers: 1,
        indexs: this.data.indexs,
        parenIndexs: parenIndex,
        id: list[index].productId,
        name: list[index].productName,
        packagePrice: list[index].packagePrice
      }


      // 创建购物车数据


      overData.push(data)
    }

    this.setData({
      listShop: list, //总数据
      showM: false, //隐藏规格框
      overData: overData, //购物车数据
      listData: []
    })

    this.sumData()
  },
  show() {
    if (this.data.overData.length > 0) {
      this.setData({
        shopCarShow: !this.data.shopCarShow
      })
    }

  },
  minus(e) {
    let that = this
    let index = e.currentTarget.dataset.indexs
    let parenIndex = e.currentTarget.dataset.index
    // let that = this

    let list = that.data.listShop
    let overData = this.data.overData

    //有规格时
    if (e.currentTarget.dataset.rule == 0) {
      wx.showModal({
        title: '提示',
        content: '含有规格的商品只能再购物车里删减',
        showCancel: false,
        success() {
          that.setData({
            shopCarShow: true
          })
        }
      })
    } else {
      //无规格
      //数量-1
      list[index].numbers = parseInt(list[index].numbers) - 1

      let state = 0

      //商品id 作为标识
      for (let i = 0; i < this.data.overData.length; i++) {

        if (overData[i].id == list[index].productId) {
			// console.log(parseFloat(overData[i]))

          // 处理购物车里相同商品
          overData[i].numbers = parseInt(overData[i].numbers) - 1
          overData[i].salePrice = parseFloat(overData[i].numbers * overData[i].salePrices).toFixed(2)
          state = 1

          // 如果数量为0，则删除该条数据
          if (overData[i].numbers == 0) {
            overData.splice(i, 1)

          }
          break;
        }
      }

      this.setData({
        listShop: list,
        overData: overData
      })

      this.sumData()
    }
  },
  plus(e) {
    //点击添加时记录是哪条数据
    console.log(e.currentTarget.dataset)
    let id = e.currentTarget.dataset.id
    let index = e.currentTarget.dataset.indexs
    let parenIndex = e.currentTarget.dataset.index
    let specificationdetailimage = e.currentTarget.dataset.specificationdetailimage
    let specificationdescription = e.currentTarget.dataset.specificationdescription
    this.setData({
      specificationdetailimage: specificationdetailimage,
      specificationdescription: specificationdescription,
    })
    let that = this

    let list = that.data.listShop
    let overData = this.data.overData

    //有规格
    if (e.currentTarget.dataset.rule == 0) {
      let taht = this
      this.setData({
        hiddenLoading: false
      })
      wx.request({
        url: getApp().globalData.baseUrl + getApp().globalData.project + 'product/findProductSpecificationByProductIdForXcx',
        data: {
          token: getApp().globalData.token,
          productId: id
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          that.setData({
            hiddenLoading: true
          })
          
          if (res.data.code == 0) {

            let data = res.data
            //处理内层规格值
            let objdata = data.data.specificationList


            for (let i = 0; i < data.data.specificationList.length; i++) {
              for (let j = 0; j < data.data.specificationList[i].specificationValueList.length; j++) {
                // 每一个规格值追加选中状态
                if (j == 0) {
                  //默认选中第一个
                  objdata[i].specificationValueList[j].state = true
                } else {
                  objdata[i].specificationValueList[j].state = false
                }
              }

            }
            that.setData({
              listData: objdata,
              data: res.data
            })

            // 获取组合ID
            that.jsonID(objdata)

            // console.log(that.data.listData)
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

      // console.log(parenIndex)
      // console.log(index)

      this.setData({
        indexs: index,
        parenIndexs: parenIndex,
        showM: true,
        rule: []
      })
    } else {
      //无规格
      list[index].numbers = parseInt(list[index].numbers) + 1

      let state = 0

      //商品id 作为标识
      for (let i = 0; i < this.data.overData.length; i++) {

        if (overData[i].id == list[index].productId) {
          // console.log(222)
          // 处理同件商品
          overData[i].numbers = parseInt(overData[i].numbers) + 1
          overData[i].salePrice = parseFloat(overData[i].numbers * parseFloat(overData[i].salePrices)).toFixed(2)
          state = 1
          break;
        }
      }

      if (this.data.overData.length == 0 || state == 0) {
        let data = {
          productSpecificationAttrId: '',
          salePrice: parseFloat((list[index].salePrice)).toFixed(2),
          packagePrice: parseFloat((list[index].packagePrice)).toFixed(2),
          salePrices: list[index].salePrice, //低价，用来计算
          rules: '',
          numbers: 1,
          indexs: index,
          parenIndexs: parenIndex,
          id: list[index].productId,
          name: list[index].productName
        }


        // 追加购物车数据

        overData.push(data)
        console.log(overData)
      }

      this.setData({
        listShop: list,
        overData: overData
      })
      this.sumData()

    }

  },

  minuss(e) {

    // 购物车里面的减数量

    let index = e.currentTarget.dataset.id
    //属于那件商品
    let indexs = e.currentTarget.dataset.ids
    // console.log(indexs)
    let list = this.data.listShop

    let obj = this.data.overData
    // console.log(obj)
    let index1 = obj[index].parenIndexs
    let index2 = obj[index].indexs


    if (parseInt(list[index2].numbers) >= 0) {

      // 数量大于0
      console.log(index1)
      console.log(index2)
      // 数量-1
      list[index2].numbers = parseInt(list[index2].numbers) - 1

      obj[index].numbers = parseInt(this.data.overData[index].numbers) - 1
      obj[index].salePrice = (parseFloat(this.data.overData[index].salePrices) * obj[index].numbers).toFixed(2)

      // 数量为空则删除
      if (this.data.overData[index].numbers == 0) {
        obj.splice(index, 1)
      }
      this.setData({
        listShop: list,
        overData: obj
      })

      this.setData({
        listShop: list
      })
      console.log(12121)
      if (this.data.overData.length == 0) {
        this.setData({
          shopCarShow: false

        })
      }
      this.sumData()
    } else {
      console.log('到底了')
    }

  },
  pluss(e) {
    // .data.overData
    // 购物车里的加
    let index = e.currentTarget.dataset.id
    //属于那件商品
    let indexs = e.currentTarget.dataset.ids
    // console.log(indexs)


    // if (parseInt(this.data.list[index].numbers) > 0) {
    let list = this.data.listShop

    let obj = this.data.overData
    console.log(obj)
    let index1 = obj[index].parenIndexs
    let index2 = obj[index].indexs

    console.log(index1)
    console.log(index2)

    // 商品数量+1
    list[index2].numbers = parseInt(list[index2].numbers) + 1

    // 购物车数量+1
    obj[index].numbers = parseInt(this.data.overData[index].numbers) + 1
    console.log(parseInt(this.data.overData[index].salePrices))
    console.log(parseInt(obj[index].numbers))
    obj[index].salePrice = (parseFloat(this.data.overData[index].salePrices) * obj[index].numbers).toFixed(2)
    console.log(obj)

    this.setData({
      listShop: list,
      overData: obj
    })
    this.sumData()

  },
  tabs(e) {
    this.setData({
      indexsss: e.currentTarget.dataset.id,

      toView: 'list' + e.currentTarget.dataset.opt,
      hiddenLoading: false
    })

    let id = e.currentTarget.dataset.ids

    this.shop(id)

    console.log(e.currentTarget.dataset.id)

    this.setData({
      categoryName: this.data.list[this.data.indexsss].categoryName
    })

    // console.log(this.data.toView)
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