var wxbarcode = require('../../utils/index.js');

Page({

  data: {
    code:''
  },
  onLoad: function (options) {
    this.setData({
      code: options.code,
      codes:options.codes
    })
    wxbarcode.barcode('barcode', options.codes, 680, 200);
    wxbarcode.qrcode('qrcode', options.codes, 420, 420);

  },
  code(){
    this.setData({
      oneShow:true
    })
  }
})