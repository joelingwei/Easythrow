// pages/index/ticket-top/ticket-top.js
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    });
    var ticketTid = options.id;
    var that = this;
    wx.request({
      url: app.globalData.postBase + '/getTop',
      data: {
        id: ticketTid
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        wx.setNavigationBarTitle({
          title: '排行榜 -' + res.data.list.name,
        })
        that.setData({
          tops: res.data
        })
      }
    })
  },
  onTicketsTap:function(event){
    var ticketId = event.currentTarget.dataset.ticketlistid;
    var ticketTid = event.currentTarget.dataset.ticketlisttid;
    var ticketTop = event.currentTarget.dataset.ticketlisttop;
    wx.navigateTo({
      url: '../ticket-detail/ticket-detail?id=' + ticketId + '&tid=' + ticketTid + '&top=' + ticketTop
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.hideLoading();
    var TicketUid = wx.getStorageSync('openid');
    //获取访问者手机系统信息
    wx.getSystemInfo({
      success: function (res) {
        //console.log(res);
        wx.request({
          url: app.globalData.postBase + '/getSystemInfo',
          data: {
            SystemInfo: res,
            uid: TicketUid
          },
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            //console.log(res);
          }
        });
      },
    });
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
  onShareAppMessage: function (res) {
    var id = this.data.tops.list.id;
    console.log(id);
    var title = '排行榜 -' + this.data.tops.list.name;
    return {
      title: title,
      path: '/pages/index/ticket/ticket-top/ticket-top?id=' + id,
      success: function (res) {
        // 转发成功
        wx.showToast({
          title: '分享成功',
          duration: 1000,
          icon: 'success',
          mask: true
        });
      },
      fail: function (res) {
        // 转发失败
        if (res.errMsg == 'shareAppMessage:fail cancel') {
          wx.showToast({
            title: '您已取消分享',
            duration: 1000,
            icon: 'success',
            mask: true
          });
        } else {
          wx.showToast({
            title: '分享失败，请重试！',
            duration: 1000,
            icon: 'success',
            mask: true
          });
        }
      }
    }
  }
})