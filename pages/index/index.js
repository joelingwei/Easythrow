// pages/index/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    });
    var that = this;
    wx.request({
      url: app.globalData.postBase +'/getTicketList',
      header:{
        'content-type':'application/json'
      },
      success:function(res){
        that.setData({
          tickets:res.data
        })
      }
    });
    wx.request({
      url: app.globalData.postBase + '/getBanner',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({
          banners: res.data
        })
      }
    });
    var openid = wx.getStorageSync('openid');
    if (!openid){
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
  },
  onTicketsTap: function (event) {
    var ticketId = event.currentTarget.dataset.ticketid;
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
                      wx.navigateTo({
                        url: 'ticket/ticket?id=' + ticketId
                      })
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
      });
    }else{
      wx.navigateTo({
        url: 'ticket/ticket?id=' + ticketId
      })
    }
  },
  onBannerTap: function (event){
    var ticketId = event.currentTarget.dataset.ticketid;
    wx.navigateTo({
      url: 'ticket/ticket?id=' + ticketId
    })
  },
  MakeTicket:function(){
    wx.showModal({
      title: '提示',
      content: '请联系客服为您分配【投票发起】账号',
      success: function (res) {
        if (res.confirm) {
          wx.makePhoneCall({
            phoneNumber: '13027198557'
          })
        } else if (res.cancel) {
          
        }
      }
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
    wx.showLoading({
      title: '加载中',
    });
    wx.showNavigationBarLoading();
    var that = this;
    wx.request({
      url: app.globalData.postBase + '/getTicketList',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({
          tickets: res.data
        })
      }
    });
    wx.request({
      url: app.globalData.postBase + '/getBanner',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {        
        that.setData({
          banners: res.data
        })
      }
    });
    wx.hideNavigationBarLoading();
    wx.hideLoading();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    wx.showLoading({
      title: '加载中',
    });
    wx.showNavigationBarLoading();
    var that = this;
    wx.request({
      url: app.globalData.postBase + '/getTicketList',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({
          tickets: res.data
        })
      }
    });
    wx.request({
      url: app.globalData.postBase + '/getBanner',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({
          banners: res.data
        })
      }
    });
    wx.hideNavigationBarLoading();
    wx.hideLoading();
    wx.stopPullDownRefresh();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    return {
      title: '轻松投',
      path: '/pages/index/index',
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
        if (res.errMsg == 'shareAppMessage:fail cancel'){
          wx.showToast({
            title: '您已取消分享',
            duration: 1000,
            icon: 'success',
            mask: true
          });
        }else{
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