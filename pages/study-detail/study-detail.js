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

    // 加载状态
    loading: false,
    loadingText: '正在加载...'
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
    // 刷新学习进度
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

    this.setData({
      studyModes: modes
    });

    // 显示选择反馈
    const selectedMode = modes.find(mode => mode.id === modeId);
    wx.showToast({
      title: `已选择${selectedMode.name}`,
      icon: 'none',
      duration: 1000
    });
  },

  /**
   * 开始学习
   */
  onStartStudy: function() {
    console.log('开始学习');
    
    const activeMode = this.data.studyModes.find(mode => mode.active);
    if (!activeMode) {
      wx.showToast({
        title: '请先选择学习模式',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    // 显示加载状态
    this.setData({
      loading: true,
      loadingText: `正在进入${activeMode.name}...`
    });

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