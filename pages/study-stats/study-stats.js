// pages/study-stats/study-stats.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 基础统计数据
    totalDays: 7,
    currentLevel: 'Lv.5',
    totalWords: 856,
    accuracy: 85,
    
    // 本周进度数据
    weekTarget: 100,
    weekCompleted: 68,
    weekRemaining: 32,
    weekProgress: 68,
    
    // 学习时长统计
    todayTime: 25,
    weekTime: 3.2,
    totalTime: 28.5,
    
    // 答题统计
    totalQuestions: 245,
    correctAnswers: 208,
    wrongAnswers: 37,
    
    // 最近学习记录
    recentRecords: [
      {
        id: 1,
        date: '今天',
        title: '快速答题模式',
        wordsCount: 20,
        duration: 8,
        accuracy: 90,
        score: 180
      },
      {
        id: 2,
        date: '昨天',
        title: '单词库学习',
        wordsCount: 15,
        duration: 12,
        accuracy: 87,
        score: 150
      },
      {
        id: 3,
        date: '前天',
        title: '错题复习',
        wordsCount: 8,
        duration: 6,
        accuracy: 75,
        score: 80
      },
      {
        id: 4,
        date: '3天前',
        title: '无尽模式练习',
        wordsCount: 25,
        duration: 15,
        accuracy: 88,
        score: 220
      }
    ],
    
    // 成就数据
    achievements: [
      {
        id: 1,
        icon: '🏆',
        name: '连续学习一周',
        description: '坚持每天学习，养成良好习惯',
        date: '今天获得',
        isNew: true
      },
      {
        id: 2,
        icon: '🎯',
        name: '单词掌握数突破800',
        description: '累计掌握单词数达到800个',
        date: '2天前获得',
        isNew: false
      },
      {
        id: 3,
        icon: '⭐',
        name: '答题正确率达85%',
        description: '总体答题正确率超过85%',
        date: '3天前获得',
        isNew: false
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.loadUserStats();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    // 页面渲染完成后的操作
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // 每次显示页面时刷新数据
    this.refreshStats();
  },

  /**
   * 加载用户统计数据
   */
  loadUserStats() {
    // 从本地存储或服务器获取用户统计数据
    try {
      const userStats = wx.getStorageSync('userStats');
      if (userStats) {
        this.setData({
          totalDays: userStats.totalDays || 7,
          currentLevel: userStats.currentLevel || 'Lv.5',
          totalWords: userStats.totalWords || 856,
          accuracy: userStats.accuracy || 85
        });
      }
    } catch (error) {
      console.error('加载用户统计数据失败:', error);
    }
    
    this.calculateWeekProgress();
    this.loadLearningTime();
    this.loadQuizStats();
    this.loadRecentRecords();
    this.loadAchievements();
  },

  /**
   * 计算本周学习进度
   */
  calculateWeekProgress() {
    const weekCompleted = this.data.weekCompleted;
    const weekTarget = this.data.weekTarget;
    const weekProgress = Math.round((weekCompleted / weekTarget) * 100);
    const weekRemaining = weekTarget - weekCompleted;
    
    this.setData({
      weekProgress: weekProgress,
      weekRemaining: weekRemaining
    });
  },

  /**
   * 加载学习时长数据
   */
  loadLearningTime() {
    try {
      const timeStats = wx.getStorageSync('timeStats');
      if (timeStats) {
        this.setData({
          todayTime: timeStats.todayTime || 25,
          weekTime: timeStats.weekTime || 3.2,
          totalTime: timeStats.totalTime || 28.5
        });
      }
    } catch (error) {
      console.error('加载学习时长数据失败:', error);
    }
  },

  /**
   * 加载答题统计数据
   */
  loadQuizStats() {
    try {
      const quizStats = wx.getStorageSync('quizStats');
      if (quizStats) {
        const totalQuestions = quizStats.totalQuestions || 245;
        const correctAnswers = quizStats.correctAnswers || 208;
        const wrongAnswers = totalQuestions - correctAnswers;
        const accuracy = Math.round((correctAnswers / totalQuestions) * 100);
        
        this.setData({
          totalQuestions: totalQuestions,
          correctAnswers: correctAnswers,
          wrongAnswers: wrongAnswers,
          accuracy: accuracy
        });
      }
    } catch (error) {
      console.error('加载答题统计数据失败:', error);
    }
  },

  /**
   * 加载最近学习记录
   */
  loadRecentRecords() {
    try {
      const recentRecords = wx.getStorageSync('recentRecords');
      if (recentRecords && recentRecords.length > 0) {
        this.setData({
          recentRecords: recentRecords.slice(0, 4) // 只显示最近4条记录
        });
      }
    } catch (error) {
      console.error('加载学习记录失败:', error);
    }
  },

  /**
   * 加载成就数据
   */
  loadAchievements() {
    try {
      const achievements = wx.getStorageSync('achievements');
      if (achievements && achievements.length > 0) {
        this.setData({
          achievements: achievements.slice(0, 3) // 只显示最近3个成就
        });
      }
    } catch (error) {
      console.error('加载成就数据失败:', error);
    }
  },

  /**
   * 刷新统计数据
   */
  refreshStats() {
    wx.showLoading({
      title: '刷新中...'
    });
    
    setTimeout(() => {
      this.loadUserStats();
      wx.hideLoading();
      wx.showToast({
        title: '刷新成功',
        icon: 'success',
        duration: 1500
      });
    }, 1000);
  },

  /**
   * 开始学习按钮点击事件
   */
  startLearning() {
    wx.navigateTo({
      url: '/pages/quiz/quiz'
    });
  },

  /**
   * 查看错题本按钮点击事件
   */
  viewErrorBook() {
    wx.showToast({
      title: '错题本功能开发中',
      icon: 'none',
      duration: 2000
    });
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    this.refreshStats();
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 1500);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    return {
      title: '我的英语学习统计',
      path: '/pages/study-stats/study-stats',
      imageUrl: '/images/share-stats.png'
    };
  }
});