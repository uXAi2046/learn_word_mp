// pages/splash/splash.js
const app = getApp()

Page({
  data: {
    loadingIndex: -1
  },

  onLoad() {
    // 开始加载动画
    this.startLoadingAnimation()
    
    // 模拟初始化过程
    this.initializeApp()
  },

  // 开始加载动画
  startLoadingAnimation() {
    let index = 0
    const timer = setInterval(() => {
      this.setData({
        loadingIndex: index
      })
      index++
      
      if (index > 4) {
        clearInterval(timer)
        // 加载完成后跳转到首页
        setTimeout(() => {
          this.navigateToHome()
        }, 500)
      }
    }, 300)
  },

  // 初始化应用
  initializeApp() {
    // 获取系统信息
    wx.getSystemInfo({
      success: (res) => {
        app.globalData.systemInfo = res
        console.log('系统信息获取成功', res)
      }
    })

    // 检查更新
    if (wx.getUpdateManager) {
      const updateManager = wx.getUpdateManager()
      
      updateManager.onCheckForUpdate((res) => {
        console.log('检查更新结果', res.hasUpdate)
      })

      updateManager.onUpdateReady(() => {
        wx.showModal({
          title: '更新提示',
          content: '新版本已经准备好，是否重启应用？',
          success: (res) => {
            if (res.confirm) {
              updateManager.applyUpdate()
            }
          }
        })
      })

      updateManager.onUpdateFailed(() => {
        console.log('新版本下载失败')
      })
    }

    // 预加载数据
    this.preloadData()
  },

  // 预加载数据
  preloadData() {
    // 这里可以预加载一些必要的数据
    // 比如用户信息、单词库等
    console.log('预加载数据完成')
  },

  // 跳转到首页
  navigateToHome() {
    wx.switchTab({
      url: '/pages/home/home',
      success: () => {
        console.log('跳转到首页成功')
      },
      fail: (err) => {
        console.error('跳转到首页失败', err)
      }
    })
  },

  onShow() {
    // 页面显示时的逻辑
  },

  onHide() {
    // 页面隐藏时的逻辑
  },

  onUnload() {
    // 页面卸载时的逻辑
  }
})