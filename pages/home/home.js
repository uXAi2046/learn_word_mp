// pages/home/home.js
const app = getApp()

Page({
  data: {
    userInfo: {},
    dailyGoal: 20,
    currentProgress: 12,
    goalProgress: 60,
    continuousDays: 7,
    userLevel: 5,
    weeklyQuestions: 89,
    correctRate: 85,
    selectedTextbook: '',
    recentAchievements: [
      {
        id: 1,
        icon: '🥇',
        title: '连续学习一周达成!'
      },
      {
        id: 2,
        icon: '🥈',
        title: '单词掌握数突破100!'
      }
    ]
  },

  onLoad() {
    this.initPageData()
  },

  onShow() {
    // 每次显示页面时刷新数据
    this.refreshUserData()
  },

  // 初始化页面数据
  initPageData() {
    const userData = app.getUserData()
    if (userData) {
      this.setData({
        userInfo: {
          nickname: userData.nickname,
          avatar: userData.avatar
        },
        dailyGoal: userData.studyGoal || 20,
        selectedTextbook: userData.selectedTextbook,
        continuousDays: userData.continuousStudyDays || 0,
        userLevel: userData.level || 1
      })
    }

    // 计算今日进度
    this.calculateDailyProgress()
    
    // 获取学习统计
    this.getStudyStats()
    
    // 获取最近成就
    this.getRecentAchievements()
  },

  // 刷新用户数据
  refreshUserData() {
    const userData = app.getUserData()
    if (userData) {
      this.setData({
        userInfo: {
          nickname: userData.nickname,
          avatar: userData.avatar
        },
        continuousDays: userData.continuousStudyDays || 0,
        userLevel: userData.level || 1
      })
    }
  },

  // 计算今日进度
  calculateDailyProgress() {
    // 从本地存储获取今日学习进度
    const today = new Date().toDateString()
    const todayProgress = wx.getStorageSync(`progress_${today}`) || 0
    const goalProgress = Math.min((todayProgress / this.data.dailyGoal) * 100, 100)
    
    this.setData({
      currentProgress: todayProgress,
      goalProgress: goalProgress
    })
  },

  // 获取学习统计
  getStudyStats() {
    // 从本地存储获取本周统计数据
    const weeklyStats = wx.getStorageSync('weeklyStats') || {
      questions: 0,
      correctRate: 0
    }
    
    this.setData({
      weeklyQuestions: weeklyStats.questions,
      correctRate: weeklyStats.correctRate
    })
  },

  // 获取最近成就
  getRecentAchievements() {
    const achievements = wx.getStorageSync('achievements') || []
    const recentAchievements = achievements
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 2)
    
    this.setData({
      recentAchievements: recentAchievements.length > 0 ? recentAchievements : this.data.recentAchievements
    })
  },

  // 头像点击事件
  onAvatarTap() {
    wx.switchTab({
      url: '/pages/profile/profile'
    })
  },

  // 设置按钮点击事件
  onSettingsTap() {
    wx.navigateTo({
      url: '/pages/settings/settings'
    })
  },

  // 继续学习按钮点击事件
  onContinueStudy() {
    if (this.data.currentProgress >= this.data.dailyGoal) {
      wx.showToast({
        title: '今日目标已完成！',
        icon: 'success'
      })
      return
    }
    
    wx.switchTab({
      url: '/pages/quiz/quiz'
    })
  },

  // 查看详情按钮点击事件
  onViewDetails() {
    wx.navigateTo({
      url: '/pages/study-report/study-report'
    })
  },

  // 答题模式点击事件
  onQuizTap() {
    wx.switchTab({
      url: '/pages/quiz/quiz'
    })
  },

  // 单词库点击事件
  onWordbankTap() {
    wx.switchTab({
      url: '/pages/wordbank/wordbank'
    })
  },

  // 知识点点击事件
  onKnowledgeTap() {
    wx.switchTab({
      url: '/pages/knowledge/knowledge'
    })
  },

  // 个人中心点击事件
  onProfileTap() {
    wx.switchTab({
      url: '/pages/profile/profile'
    })
  },

  // 查看全部成就点击事件
  onViewAllAchievements() {
    wx.navigateTo({
      url: '/pages/achievements/achievements'
    })
  },

  // 选择教材点击事件
  onSelectTextbook() {
    wx.navigateTo({
      url: '/pages/textbook-selector/textbook-selector'
    })
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.refreshUserData()
    this.calculateDailyProgress()
    this.getStudyStats()
    this.getRecentAchievements()
    
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1000)
  },

  // 分享功能
  onShareAppMessage() {
    return {
      title: '英语单词背诵 - 专为中学生设计',
      path: '/pages/home/home',
      imageUrl: '/images/share-cover.jpg'
    }
  },

  onShareTimeline() {
    return {
      title: '英语单词背诵 - 专为中学生设计',
      query: '',
      imageUrl: '/images/share-cover.jpg'
    }
  }
})