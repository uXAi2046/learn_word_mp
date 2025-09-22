// 学习详情页面逻辑
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 学习进度数据
    progress: {
      percentage: 68,
      current: 34,
      total: 50,
      studyTime: '25分钟',
      todayTarget: 50
    },

    // 当前学习单词
    currentWord: {
      word: 'achievement',
      phonetic: '/əˈtʃiːvmənt/',
      partOfSpeech: 'n.',
      meaning: '成就；完成；达到',
      example: {
        english: 'Her greatest achievement was winning the Nobel Prize.',
        chinese: '她最大的成就是获得诺贝尔奖。'
      },
      masteryLevel: 75,
      masteryText: '熟练'
    },

    // 学习模式
    studyModes: [
      {
        id: 'flashcard',
        name: '闪卡模式',
        description: '快速记忆',
        icon: '📚',
        active: true
      },
      {
        id: 'spelling',
        name: '拼写练习',
        description: '强化记忆',
        icon: '✍️',
        active: false
      },
      {
        id: 'listening',
        name: '听力训练',
        description: '发音练习',
        icon: '🎧',
        active: false
      },
      {
        id: 'reading',
        name: '阅读理解',
        description: '语境学习',
        icon: '📖',
        active: false
      }
    ],

    // 学习统计
    stats: {
      todayWords: 12,
      totalWords: 156,
      accuracy: 85,
      streak: 7
    },

    // 学习提示
    showTip: true,
    tipText: '💡 建议每次学习20-30分钟，效果更佳！',

    // 当前选中的学习模式
    selectedMode: null,

    // 加载状态
    loading: false,
    loadingText: '正在加载...',

    // 学习状态管理
    studyState: {
      isStudying: false,        // 是否正在学习中
      isPaused: false,          // 是否暂停
      sessionStartTime: null,   // 学习会话开始时间
      currentSessionWords: 0,   // 当前会话学习的单词数
      totalStudyTime: 0,        // 总学习时间（秒）
      lastActiveTime: null      // 最后活跃时间
    },

    // 学习历史记录
    studyHistory: [],

    // 按钮状态
    buttonStates: {
      startStudyText: '开始学习',
      pauseStudyText: '暂停学习',
      nextWordText: '下一个单词',
      showStartButton: true,
      showPauseButton: false,
      showNextButton: false
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('学习详情页面加载', options);
    this.initPageData();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log('学习详情页面渲染完成');
    // 添加页面加载动画
    this.addPageAnimation();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('学习详情页面显示');
    
    // 尝试恢复学习进度
    this.restoreStudyProgress();
    
    // 刷新页面数据
    this.refreshProgress();
  },

  /**
   * 初始化页面数据
   */
  initPageData: function() {
    // 模拟从服务器获取数据
    this.setData({
      loading: true,
      loadingText: '正在加载学习数据...'
    });

    // 设置默认选中的学习模式（闪卡模式）
    const defaultMode = this.data.studyModes.find(mode => mode.active);
    this.setData({
      selectedMode: defaultMode
    });

    // 模拟网络请求延迟
    setTimeout(() => {
      this.setData({
        loading: false
      });
      
      // 模拟数据更新
      this.updateWordData();
    }, 1000);
  },

  /**
   * 添加页面动画
   */
  addPageAnimation: function() {
    // 为卡片添加淡入动画
    const cards = wx.createSelectorQuery().selectAll('.card');
    cards.boundingClientRect((rects) => {
      rects.forEach((rect, index) => {
        setTimeout(() => {
          // 添加淡入效果
        }, index * 100);
      });
    }).exec();
  },

  /**
   * 刷新学习进度
   */
  refreshProgress: function() {
    // 模拟进度更新
    const currentProgress = this.data.progress;
    this.setData({
      'progress.percentage': Math.min(currentProgress.percentage + 2, 100)
    });
  },

  /**
   * 更新单词数据
   */
  updateWordData: function() {
    // 模拟单词库数据
    const words = [
      {
        word: 'achievement',
        phonetic: '/əˈtʃiːvmənt/',
        partOfSpeech: 'n.',
        meaning: '成就；完成；达到',
        example: {
          english: 'Her greatest achievement was winning the Nobel Prize.',
          chinese: '她最大的成就是获得诺贝尔奖。'
        },
        masteryLevel: 75,
        masteryText: '熟练'
      },
      {
        word: 'brilliant',
        phonetic: '/ˈbrɪljənt/',
        partOfSpeech: 'adj.',
        meaning: '聪明的；杰出的；明亮的',
        example: {
          english: 'She came up with a brilliant solution to the problem.',
          chinese: '她想出了一个绝妙的解决方案。'
        },
        masteryLevel: 60,
        masteryText: '一般'
      },
      {
        word: 'challenge',
        phonetic: '/ˈtʃælɪndʒ/',
        partOfSpeech: 'n./v.',
        meaning: '挑战；质疑',
        example: {
          english: 'Learning English is a challenge, but it\'s worth it.',
          chinese: '学英语是个挑战，但很值得。'
        },
        masteryLevel: 90,
        masteryText: '精通'
      }
    ];

    // 随机选择一个单词
    const randomWord = words[Math.floor(Math.random() * words.length)];
    this.setData({
      currentWord: randomWord
    });
  },

  /**
   * 播放单词发音
   */
  onPlayPronunciation: function() {
    console.log('播放发音:', this.data.currentWord.word);
    
    // 显示播放状态
    wx.showToast({
      title: '正在播放发音',
      icon: 'none',
      duration: 1000
    });

    // 模拟发音播放（实际项目中需要调用语音API）
    // wx.createInnerAudioContext() 可以用来播放音频
  },

  /**
   * 收藏单词
   */
  onFavoriteWord: function() {
    console.log('收藏单词:', this.data.currentWord.word);
    
    wx.showToast({
      title: '已收藏',
      icon: 'success',
      duration: 1000
    });

    // 实际项目中需要调用收藏API
  },

  /**
   * 选择学习模式
   */
  onSelectMode: function(e) {
    const modeId = e.currentTarget.dataset.mode;
    console.log('选择学习模式:', modeId);

    // 更新模式选择状态
    const modes = this.data.studyModes.map(mode => ({
      ...mode,
      active: mode.id === modeId
    }));

    // 获取选中的模式
    const selectedMode = modes.find(mode => mode.id === modeId);

    this.setData({
      studyModes: modes,
      selectedMode: selectedMode
    });

    // 显示选择反馈
    if (selectedMode) {
      wx.showToast({
        title: `已选择${selectedMode.name}`,
        icon: 'none',
        duration: 1000
      });
    }
  },

  /**
   * 开始学习/下一题
   */
  onStartStudy: function() {
    console.log('开始学习/下一题');
    
    const activeMode = this.data.studyModes.find(mode => mode.active);
    if (!activeMode) {
      wx.showToast({
        title: '请先选择学习模式',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    // 根据当前学习状态决定操作
    if (this.data.studyState.isStudying && this.data.currentWord) {
      // 如果正在学习且有当前单词，执行下一题操作
      this.goToNextWord();
    } else {
      // 否则开始新的学习会话
      this.startStudySession(activeMode);
    }
  },

  /**
   * 开始学习会话
   */
  startStudySession: function(activeMode) {
    // 显示加载状态
    this.setData({
      loading: true,
      loadingText: `正在进入${activeMode.name}...`
    });

    const now = Date.now();
    
    // 更新学习状态
    this.setData({
      'studyState.isStudying': true,
      'studyState.isPaused': false,
      'studyState.sessionStartTime': now,
      'studyState.currentSessionWords': 0,
      'studyState.lastActiveTime': now,
      'buttonStates.showStartButton': false,
      'buttonStates.showPauseButton': true,
      'buttonStates.showNextButton': false
    });

    // 保存学习会话到本地存储
    const studySession = {
      mode: activeMode.id,
      startTime: now,
      wordsStudied: 0,
      isActive: true
    };
    
    try {
      wx.setStorageSync('currentStudySession', studySession);
    } catch (error) {
      console.error('保存学习会话失败:', error);
    }

    // 模拟跳转延迟
    setTimeout(() => {
      this.setData({
        loading: false
      });

      // 根据不同模式跳转到不同页面
      switch (activeMode.id) {
        case 'flashcard':
          wx.navigateTo({
            url: '/pages/flashcard/flashcard'
          });
          break;
        case 'spelling':
          wx.navigateTo({
            url: '/pages/spelling/spelling'
          });
          break;
        case 'listening':
          wx.navigateTo({
            url: '/pages/listening/listening'
          });
          break;
        case 'reading':
          wx.navigateTo({
            url: '/pages/reading/reading'
          });
          break;
        default:
          wx.showToast({
            title: '功能开发中',
            icon: 'none',
            duration: 2000
          });
      }
    }, 1500);
  },

  /**
   * 下一题/下一个单词
   */
  goToNextWord: function() {
    console.log('下一个单词');
    
    // 显示加载状态
    this.setData({
      loading: true,
      loadingText: '正在加载下一个单词...'
    });

    // 模拟获取下一个单词
    setTimeout(() => {
      // 更新进度
      const currentProgress = this.data.progress;
      const newCurrent = Math.min(currentProgress.current + 1, currentProgress.total);
      const newPercentage = Math.round((newCurrent / currentProgress.total) * 100);
      
      // 模拟下一个单词数据
      const nextWords = [
        {
          word: 'challenge',
          phonetic: '/ˈtʃælɪndʒ/',
          partOfSpeech: 'n.',
          meaning: '挑战；质疑',
          example: {
            english: 'Learning English is a challenge, but it\'s worth it.',
            chinese: '学英语是个挑战，但很值得。'
          },
          masteryLevel: 60,
          masteryText: '一般'
        },
        {
          word: 'opportunity',
          phonetic: '/ˌɒpəˈtuːnəti/',
          partOfSpeech: 'n.',
          meaning: '机会；时机',
          example: {
            english: 'This is a great opportunity to improve your skills.',
            chinese: '这是提高技能的好机会。'
          },
          masteryLevel: 45,
          masteryText: '较差'
        },
        {
          word: 'experience',
          phonetic: '/ɪkˈspɪəriəns/',
          partOfSpeech: 'n.',
          meaning: '经验；经历',
          example: {
            english: 'Experience is the best teacher.',
            chinese: '经验是最好的老师。'
          },
          masteryLevel: 80,
          masteryText: '良好'
        }
      ];
      
      const randomWord = nextWords[Math.floor(Math.random() * nextWords.length)];
      
      // 更新数据
      this.setData({
        loading: false,
        currentWord: randomWord,
        progress: {
          ...currentProgress,
          current: newCurrent,
          percentage: newPercentage
        },
        'studyState.currentSessionWords': this.data.studyState.currentSessionWords + 1,
        'studyState.lastActiveTime': Date.now(),
        'buttonStates.showNextButton': true,
        'buttonStates.startStudyText': '下一个单词'
      });

      // 更新学习统计和历史记录
      this.updateStudyStats();
      this.addToStudyHistory(randomWord);
      
      wx.showToast({
        title: '加载完成',
        icon: 'success',
        duration: 1000
      });
    }, 1000);
  },

  /**
   * 更新学习统计
   */
  updateStudyStats: function() {
    const currentStats = this.data.stats;
    this.setData({
      stats: {
        ...currentStats,
        todayWords: currentStats.todayWords + 1
      }
    });

    // 更新本地存储的学习会话
    try {
      const session = wx.getStorageSync('currentStudySession');
      if (session) {
        session.wordsStudied = this.data.studyState.currentSessionWords;
        wx.setStorageSync('currentStudySession', session);
      }
    } catch (error) {
      console.error('更新学习会话失败:', error);
    }
  },

  /**
   * 添加到学习历史记录
   */
  addToStudyHistory: function(word) {
    const historyItem = {
      word: word.word,
      meaning: word.meaning,
      studiedAt: Date.now(),
      masteryLevel: word.masteryLevel
    };

    const currentHistory = this.data.studyHistory;
    currentHistory.unshift(historyItem); // 添加到开头
    
    // 限制历史记录数量，最多保留50条
    if (currentHistory.length > 50) {
      currentHistory.pop();
    }

    this.setData({
      studyHistory: currentHistory
    });
  },

  /**
   * 暂停学习
   */
  onPauseStudy: function() {
    console.log('暂停学习');
    
    // 检查是否正在学习中
    if (!this.data.studyState.isStudying) {
      wx.showToast({
        title: '当前没有进行学习',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    wx.showModal({
      title: '暂停学习',
      content: '确定要暂停当前学习吗？学习进度将会保存。',
      confirmText: '确定暂停',
      cancelText: '继续学习',
      success: (res) => {
        if (res.confirm) {
          // 用户确认暂停
          this.pauseStudySession();
        }
      }
    });
  },

  /**
   * 暂停学习会话
   */
  pauseStudySession: function() {
    const now = Date.now();
    const sessionStartTime = this.data.studyState.sessionStartTime;
    const studyDuration = sessionStartTime ? Math.floor((now - sessionStartTime) / 1000) : 0;

    // 更新学习状态
    this.setData({
      'studyState.isPaused': true,
      'studyState.isStudying': false,
      'studyState.totalStudyTime': this.data.studyState.totalStudyTime + studyDuration,
      'studyState.lastActiveTime': now,
      'buttonStates.showStartButton': true,
      'buttonStates.showPauseButton': false,
      'buttonStates.startStudyText': '继续学习'
    });

    // 保存学习进度
    this.saveStudyProgress();

    wx.showToast({
      title: '学习已暂停',
      icon: 'success',
      duration: 2000
    });

    // 延迟返回上一页或首页
    setTimeout(() => {
      wx.navigateBack({
        fail: () => {
          wx.switchTab({
            url: '/pages/index/index'
          });
        }
      });
    }, 2000);
  },

  /**
   * 保存学习进度
   */
  saveStudyProgress: function() {
    const progressData = {
      currentWord: this.data.currentWord,
      progress: this.data.progress,
      selectedMode: this.data.studyModes.find(mode => mode.active),
      studyState: this.data.studyState,
      stats: this.data.stats,
      studyHistory: this.data.studyHistory,
      savedAt: Date.now()
    };

    try {
      wx.setStorageSync('studyProgress', progressData);
      console.log('学习进度已保存');
    } catch (error) {
      console.error('保存学习进度失败:', error);
    }
  },

  /**
   * 恢复学习进度
   */
  restoreStudyProgress: function() {
    try {
      const savedProgress = wx.getStorageSync('studyProgress');
      if (savedProgress) {
        // 恢复数据，但保持一些状态的重置
        this.setData({
          currentWord: savedProgress.currentWord,
          progress: savedProgress.progress,
          stats: savedProgress.stats,
          studyHistory: savedProgress.studyHistory || [],
          'studyState.isPaused': true,
          'studyState.isStudying': false,
          'studyState.currentSessionWords': savedProgress.studyState?.currentSessionWords || 0,
          'studyState.totalStudyTime': savedProgress.studyState?.totalStudyTime || 0,
          'buttonStates.startStudyText': '继续学习'
        });

        // 恢复选中的学习模式
        if (savedProgress.selectedMode) {
          const updatedModes = this.data.studyModes.map(mode => ({
            ...mode,
            active: mode.id === savedProgress.selectedMode.id
          }));
          this.setData({
            studyModes: updatedModes
          });
        }

        console.log('学习进度已恢复');
        return true;
      }
    } catch (error) {
      console.error('恢复学习进度失败:', error);
    }
    return false;
  },

  /**
   * 查看学习报告
   */
  onViewReport: function() {
    console.log('查看学习报告');
    
    wx.navigateTo({
      url: '/pages/report/report'
    });
  },

  /**
   * 关闭提示
   */
  onCloseTip: function() {
    this.setData({
      showTip: false
    });
  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh: function() {
    console.log('下拉刷新');
    
    // 刷新页面数据
    this.initPageData();
    
    // 停止下拉刷新
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 1000);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    console.log('上拉触底');
    // 可以在这里加载更多单词数据
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      title: '我正在学习英语单词，一起来挑战吧！',
      path: '/pages/study-detail/study-detail',
      imageUrl: '/images/share-study.png'
    };
  },

  /**
   * 用户点击右上角分享朋友圈
   */
  onShareTimeline: function() {
    return {
      title: '英语学习进行中，每天进步一点点！',
      imageUrl: '/images/share-timeline.png'
    };
  },

  /**
   * 页面卸载
   */
  onUnload: function() {
    console.log('学习详情页面卸载');
    // 清理定时器等资源
  }
});