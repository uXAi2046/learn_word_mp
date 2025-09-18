// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log('登录成功', res.code)
      }
    })

    // 初始化用户数据
    this.initUserData()
  },

  onShow() {
    // 应用显示时的逻辑
    console.log('应用显示')
  },

  onHide() {
    // 应用隐藏时的逻辑
    console.log('应用隐藏')
  },

  // 初始化用户数据
  initUserData() {
    const userData = wx.getStorageSync('userData')
    if (!userData) {
      // 设置默认用户数据
      const defaultUserData = {
        nickname: '新同学',
        avatar: '',
        level: 1,
        exp: 0,
        totalStudyDays: 0,
        continuousStudyDays: 0,
        totalQuestions: 0,
        correctRate: 0,
        achievements: [],
        studyGoal: 20, // 每日学习目标
        selectedTextbook: 'renjiao', // 默认人教版
        grade: 'grade7' // 默认七年级
      }
      wx.setStorageSync('userData', defaultUserData)
      this.globalData.userData = defaultUserData
    } else {
      this.globalData.userData = userData
    }
  },

  // 更新用户数据
  updateUserData(newData) {
    const userData = { ...this.globalData.userData, ...newData }
    this.globalData.userData = userData
    wx.setStorageSync('userData', userData)
  },

  // 获取用户数据
  getUserData() {
    return this.globalData.userData
  },

  // 全局数据
  globalData: {
    userData: null,
    systemInfo: null
  }
})