//获取应用实例
var app = getApp();
Page({
  data: {
    searchPanelShow: false,
    userInfo: {}
  },
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    });
    var TicketUid = wx.getStorageSync('openid');
    var ticketId = options.id;
    var that = this;
    wx.request({
      url: app.globalData.postBase + '/getTicketDetail',
      data: {
        id: ticketId,
        uid: TicketUid
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        for (var i = 0; i < res.data.ticket_list.length; i++) {
          res.data.ticket_list[i].isTicket = false;
        }
        wx.setNavigationBarTitle({
          title: res.data.list.name,
        });
        that.setData({
          tickets: res.data
        })
      }
    });
  },
  onCancelImgTap: function (event) {
    this.setData({
      searchPanelShow: false
    })
  },
  onBindFocus: function (event) {
    this.setData({
      searchPanelShow: true
    })
  },
  onBindConfirm: function (event) {
    var text = event.detail.value;
    var ticketId = this.data.tickets.list.id;
    var that = this;
    wx.request({
      url: app.globalData.postBase + '/getTicketDetail',
      data: {
        id: ticketId,
        keywords: text
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        for (var i = 0; i < res.data.ticket_list.length; i++) {
          res.data.ticket_list[i].isTicket = false;
        }
        that.setData({
          tickets: res.data
        })
      }
    })
  },
  onTicketTap: function (event) {  
    var ticketId = event.currentTarget.dataset.ticketlistid;
    var ticketTid = event.currentTarget.dataset.ticketlisttid;
    var ticketTop = event.currentTarget.dataset.ticketlisttop;
    wx.navigateTo({
      url: 'ticket-detail/ticket-detail?id=' + ticketId + '&tid=' + ticketTid + '&top=' + ticketTop
    })
  },
  TicketTopTab:function(event){
    var ticketTid = event.currentTarget.dataset.tickettid;
    wx.navigateTo({
      url: 'ticket-top/ticket-top?id=' + ticketTid
    })
  },
  onTicketCurrtent: function(event){
    var ticketsId = event.currentTarget.dataset.ticketsid;
    for (var i = 0; i < this.data.tickets.ticket_list.length; i++) {
      if (this.data.tickets.ticket_list[i].id == ticketsId) {
        this.data.tickets.ticket_list[i].isTicket = true
        this.data.tickets.isgiveid = ticketsId;
      } else {
        this.data.tickets.ticket_list[i].isTicket = false;
      }  
    }
    this.setData({
      tickets: this.data.tickets
    })
  },
  OnGiveTicket:function(event){
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
      var ticketId = this.data.tickets.isgiveid;
      var ticketTid = this.data.tickets.list.id;
      var that = this;
      if (!ticketId) {
        wx.showToast({
          title: '请选择投票对象',
          duration: 1000,
          icon: 'success',
          mask: true
        });
      } else {
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
    }
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
  * 用户点击右上角分享
  */
  onShareAppMessage: function (res) {
    var id = this.data.tickets.list.id;
    var title = this.data.tickets.list.name;
    return {
      title: title,
      path: '/pages/index/ticket/ticket?id='+ id,
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
