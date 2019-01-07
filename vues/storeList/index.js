Page({
  /**
   * 页面的初始数据
   */
  data: {
    res: "",
    src: ""
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /*判断是第一次加载还是从position页面返回
    如果从position页面返回，会传递用户选择的地点*/
    if (options.res != null && options.res != '') {
      //设置变量 address 的值
      this.setData({
        res: options.res
      });
    } else {
     
    }
  },
  onChangeAddress: function (e) {
    wx.navigateTo({
      url: "/pages/position/index"
    });
  }

})