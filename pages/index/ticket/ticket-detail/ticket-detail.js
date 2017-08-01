var WxParse = require('../../../../wxParse/wxParse.js');
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
    var ticketId = options.id;
    var tickettId = options.tid;
    var tickettTop = options.top;
    var that = this;
    wx.request({
      url: app.globalData.postBase + '/getTicketObjDetail',
      data: {
        id: ticketId,
        tid: tickettId,
        top: tickettTop
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        wx.setNavigationBarTitle({
          title: res.data.name + '-' + res.data.title,
        });
        var article = res.data.content;
        WxParse.wxParse('article', 'html', article, that, 5);
        that.setData({
          tickets: res.data
        })
      }
    })
  },
  OnGiveTicket: function (event) {
    var TicketUid = wx.getStorageSync('openid');
    if (!TicketUid) {
      wx.openSetting({
        success: (res) => {
          if (res.authSetting["scope.userInfo"]) {
            wx.login({
              success: function (res) {
                var code = res.code;
                app.getUserInfo(function (userInfo) {
                  wx.request({
                    url: app.globalData.postBase + '/getOpenId',
                    data: {
                      code: code,
                      userInfo: userInfo
                    },
                    header: {
                      'content-type': 'application/json'
                    },
                    success: function (res) {
                      wx.setStorageSync('openid', res.data);
                    },
                    fali: function (res) {
                      console.log(res.data);
                    }
                  })
                });
              }
            });
          }
        }
      })
    }else{
      var TicketUid = wx.getStorageSync('openid');
      var ticketId = this.data.tickets.id;
      var ticketTid = this.data.tickets.tid;
      var that = this;
      wx.request({
        url: app.globalData.postBase + '/take_tickets',
        data: {
          id: ticketId,
          tid: ticketTid,
          uid: TicketUid
        },
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          wx.showToast({
            title: res.data.msg,
            duration: 1000,
            icon: 'success',
            mask: true
          });
        }
      })
    }
  },
  OnGiveTickets: function (event) {
    wx.showToast({
      title: '投票已结束，选择其他投票活动吧！',
      duration: 1000,
      icon: 'success',
      mask: true
    });
  },
  OnGiveTicketss: function (event) {
    wx.showToast({
      title: '投票未开始，选择其他投票活动吧！',
      duration: 1000,
      icon: 'success',
      mask: true
    });
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
    console.log(this.data.tickets);
    var id = this.data.tickets.id;
    var tid = this.data.tickets.tid;
    var top = this.data.tickets.top;
    var title = this.data.tickets.name + '-' + this.data.tickets.title;
    return {
      title: title,
      path: '/pages/index/ticket/ticket-detail/ticket-detail?id=' + id + '&tid=' + tid + '&top=' + top,
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