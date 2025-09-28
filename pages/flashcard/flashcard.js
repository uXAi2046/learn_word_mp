// pages/flashcard/flashcard.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 当前单词索引
    currentIndex: 0,
    
    // 总单词数
    totalWords: 0,
    
    // 学习进度百分比
    progressPercentage: 0,
    
    // 卡片是否翻转
    isFlipped: false,
    
    // 当前单词数据
    currentWord: {
      word: '',
      phonetic: '',
      partOfSpeech: '',
      meaning: '',
      example: {
        english: '',
        chinese: ''
      },
      difficulty: 'medium',
      difficultyText: '中等'
    },
    
    // 单词列表
    wordList: [],
    
    // 学习统计
    studyStats: {
      studied: 0,
      mastered: 0,
      needReview: 0,
      accuracy: 0
    },
    
    // 显示统计弹窗
    showStats: false,
    
    // 显示完成弹窗
    showComplete: false,
    
    // 学习时间（分钟）
    studyTime: 0,
    
    // 开始学习时间
    startTime: null,
    
    // 用户评估记录
    assessmentRecords: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('闪卡模式页面加载', options);
    this.initPageData();
    this.loadWordList();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setData({
      startTime: Date.now()
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 页面显示时的逻辑
  },

  /**
   * 初始化页面数据
   */
  initPageData: function() {
    this.loadWordList();
    this.setData({
      startTime: Date.now()
    });
  },

  /**
   * 加载单词列表
   */
  loadWordList: function() {
    // 模拟单词数据
    const mockWords = [
      {
        word: 'achievement',
        phonetic: '/əˈtʃiːvmənt/',
        partOfSpeech: 'n.',
        meaning: '成就；完成；达到',
        example: {
          english: 'Her greatest achievement was winning the Nobel Prize.',
          chinese: '她最大的成就是获得诺贝尔奖。'
        },
        difficulty: 'medium',
        difficultyText: '中等'
      },
      {
        word: 'excellent',
        phonetic: '/ˈeksələnt/',
        partOfSpeech: 'adj.',
        meaning: '优秀的；卓越的；极好的',
        example: {
          english: 'She did an excellent job on the project.',
          chinese: '她在这个项目上做得非常出色。'
        },
        difficulty: 'easy',
        difficultyText: '简单'
      },
      {
        word: 'magnificent',
        phonetic: '/mæɡˈnɪfɪsnt/',
        partOfSpeech: 'adj.',
        meaning: '壮丽的；宏伟的；华丽的',
        example: {
          english: 'The view from the mountain top was magnificent.',
          chinese: '从山顶看到的景色非常壮丽。'
        },
        difficulty: 'hard',
        difficultyText: '困难'
      },
      {
        word: 'opportunity',
        phonetic: '/ˌɑːpərˈtuːnəti/',
        partOfSpeech: 'n.',
        meaning: '机会；时机；机遇',
        example: {
          english: 'This is a great opportunity to learn new skills.',
          chinese: '这是学习新技能的好机会。'
        },
        difficulty: 'medium',
        difficultyText: '中等'
      },
      {
        word: 'responsibility',
        phonetic: '/rɪˌspɑːnsəˈbɪləti/',
        partOfSpeech: 'n.',
        meaning: '责任；职责；义务',
        example: {
          english: 'It is our responsibility to protect the environment.',
          chinese: '保护环境是我们的责任。'
        },
        difficulty: 'hard',
        difficultyText: '困难'
      }
    ];

    this.setData({
      wordList: mockWords,
      totalWords: mockWords.length,
      currentWord: mockWords[0] || {},
      progressPercentage: 0
    });
  },

  /**
   * 原有的加载单词列表方法（保留作为备用）
   */
  loadWordListOld: function() {
    console.log('加载单词列表');
    
    // 模拟单词数据
    const mockWords = [
      {
        word: 'achievement',
        phonetic: '/əˈtʃiːvmənt/',
        partOfSpeech: 'n.',
        meaning: '成就；完成；达到',
        example: {
          english: 'Her greatest achievement was winning the Nobel Prize.',
          chinese: '她最大的成就是获得诺贝尔奖。'
        },
        difficulty: 'medium',
        difficultyText: '中等'
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
        difficulty: 'hard',
        difficultyText: '困难'
      },
      {
        word: 'challenge',
        phonetic: '/ˈtʃælɪndʒ/',
        partOfSpeech: 'n./v.',
        meaning: '挑战；质疑',
        example: {
          english: 'Learning a new language is always a challenge.',
          chinese: '学习一门新语言总是一个挑战。'
        },
        difficulty: 'easy',
        difficultyText: '简单'
      },
      {
        word: 'determination',
        phonetic: '/dɪˌtɜːrmɪˈneɪʃn/',
        partOfSpeech: 'n.',
        meaning: '决心；决定',
        example: {
          english: 'His determination to succeed impressed everyone.',
          chinese: '他成功的决心给每个人都留下了深刻印象。'
        },
        difficulty: 'hard',
        difficultyText: '困难'
      },
      {
        word: 'excellent',
        phonetic: '/ˈeksələnt/',
        partOfSpeech: 'adj.',
        meaning: '优秀的；卓越的',
        example: {
          english: 'She did an excellent job on the presentation.',
          chinese: '她的演讲做得非常出色。'
        },
        difficulty: 'easy',
        difficultyText: '简单'
      }
    ];

    this.setData({
      wordList: mockWords,
      totalWords: mockWords.length,
      currentWord: mockWords[0],
      progressPercentage: 0,
      assessmentRecords: new Array(mockWords.length).fill(0)
    });
  },

  /**
   * 翻转卡片
   */
  onFlipCard: function() {
    console.log('翻转卡片');
    
    // 添加翻转前的触觉反馈
    wx.vibrateShort({
      type: 'light'
    });

    // 添加翻转动画延迟，让用户感受到交互反馈
    setTimeout(() => {
      this.setData({
        isFlipped: !this.data.isFlipped
      });
    }, 50);

    // 显示翻转提示
    if (!this.data.isFlipped) {
      wx.showToast({
        title: '查看释义',
        icon: 'none',
        duration: 800
      });
    } else {
      wx.showToast({
        title: '返回单词',
        icon: 'none',
        duration: 800
      });
    }
  },

  /**
   * 播放发音
   */
  onPlayPronunciation: function() {
    console.log('播放发音:', this.data.currentWord.word);
    
    // 显示播放反馈
    wx.showToast({
      title: '正在播放发音',
      icon: 'none',
      duration: 1000
    });

    // 模拟发音播放（实际项目中可以调用微信的语音合成API或播放音频文件）
    const innerAudioContext = wx.createInnerAudioContext();
    
    // 这里可以设置音频文件路径，暂时用系统提示音代替
    // innerAudioContext.src = `https://dict.youdao.com/dictvoice?audio=${this.data.currentWord.word}&type=1`;
    
    innerAudioContext.onPlay(() => {
      console.log('开始播放发音');
    });
    
    innerAudioContext.onError((res) => {
      console.log('播放发音失败', res);
      wx.showToast({
        title: '发音播放失败',
        icon: 'none',
        duration: 1500
      });
    });

    // 暂时用震动反馈代替实际发音
    wx.vibrateShort({
      type: 'medium'
    });
  },

  /**
   * 自评掌握程度
   */
  onAssessment: function(e) {
    const level = e.currentTarget.dataset.level;
    const levelTexts = {
      'hard': '不熟悉',
      'medium': '一般',
      'easy': '熟悉'
    };
    
    console.log('自评掌握程度:', level);

    // 记录评估结果
    const assessmentRecord = {
      wordIndex: this.data.currentIndex,
      word: this.data.currentWord.word,
      assessment: level,
      timestamp: Date.now()
    };

    const updatedRecords = [...this.data.assessmentRecords, assessmentRecord];
    
    // 更新评估记录
    this.setData({
      assessmentRecords: updatedRecords
    });

    // 显示评估反馈
    wx.showToast({
      title: `已标记为${levelTexts[level]}`,
      icon: 'success',
      duration: 1000
    });

    // 计算并更新统计数据
    const stats = this.calculateStats(updatedRecords);
    this.setData({
      studyStats: stats
    });

    // 自动进入下一个单词（延迟1秒）
    setTimeout(() => {
      this.onNext();
    }, 1000);
  },

  /**
   * 计算学习统计
   */
  calculateStats: function(assessmentRecords) {
    if (!assessmentRecords || assessmentRecords.length === 0) {
      return {
        studied: 0,
        mastered: 0,
        needReview: 0,
        accuracy: 0
      };
    }

    const studied = assessmentRecords.length;
    const mastered = assessmentRecords.filter(record => record.assessment === 'easy').length;
    const needReview = assessmentRecords.filter(record => record.assessment === 'hard').length;
    const accuracy = studied > 0 ? Math.round((mastered / studied) * 100) : 0;

    return {
      studied,
      mastered,
      needReview,
      accuracy
    };
  },

  /**
   * 上一个单词
   */
  onPrevious: function() {
    if (this.data.currentIndex > 0) {
      this.updateCurrentWord(this.data.currentIndex - 1);
    } else {
      wx.showToast({
        title: '已经是第一个单词了',
        icon: 'none',
        duration: 1000
      });
    }
  },

  /**
   * 下一个单词
   */
  onNext: function() {
    if (this.data.currentIndex < this.data.totalWords - 1) {
      this.updateCurrentWord(this.data.currentIndex + 1);
    } else {
      // 已经是最后一个单词，显示完成学习
      this.onCompleteStudy();
    }
  },

  /**
   * 更新当前单词
   */
  updateCurrentWord: function(index) {
    const wordList = this.data.wordList;
    if (index >= 0 && index < wordList.length) {
      const progressPercentage = Math.round(((index + 1) / this.data.totalWords) * 100);
      
      this.setData({
        currentIndex: index,
        currentWord: wordList[index],
        progressPercentage: progressPercentage,
        isFlipped: false // 重置翻转状态
      });

      // 添加切换动画反馈
      wx.vibrateShort({
        type: 'light'
      });
    }
  },

  /**
   * 完成学习
   */
  onCompleteStudy: function() {
    console.log('完成学习');
    
    // 计算学习时间
    const endTime = Date.now();
    const studyTimeMinutes = Math.round((endTime - this.data.startTime) / 60000);
    
    // 更新学习统计
    const finalStats = this.calculateStats(this.data.assessmentRecords);
    
    this.setData({
      studyTime: studyTimeMinutes,
      studyStats: finalStats,
      showComplete: true
    });

    // 显示完成反馈
    wx.showToast({
      title: '恭喜完成学习！',
      icon: 'success',
      duration: 2000
    });

    // 添加完成震动反馈
    wx.vibrateShort({
      type: 'heavy'
    });
  },

  /**
   * 重新开始学习
   */
  onRestart: function() {
    console.log('重新开始学习');
    
    this.setData({
      currentIndex: 0,
      progressPercentage: 0,
      isFlipped: false,
      assessmentRecords: [],
      studyStats: {
        studied: 0,
        mastered: 0,
        needReview: 0,
        accuracy: 0
      },
      studyTime: 0,
      startTime: Date.now(),
      showStats: false,
      showComplete: false
    });

    // 重置到第一个单词
    this.updateCurrentWord(0);

    wx.showToast({
      title: '已重新开始',
      icon: 'success',
      duration: 1000
    });
  },

  /**
   * 返回学习详情页
   */
  onBackToDetail: function() {
    console.log('返回学习详情页');
    wx.navigateBack();
  },

  /**
   * 返回上一页
   */
  onBack: function() {
    console.log('返回上一页');
    wx.navigateBack();
  },

  /**
   * 显示学习统计
   */
  onShowSettings: function() {
    console.log('显示学习统计');
    
    // 计算当前学习时间
    const currentTime = Date.now();
    const currentStudyTime = Math.round((currentTime - this.data.startTime) / 60000);
    
    // 更新当前统计
    const currentStats = this.calculateStats(this.data.assessmentRecords);
    
    this.setData({
      studyTime: currentStudyTime,
      studyStats: currentStats,
      showStats: true
    });
  },

  /**
   * 隐藏统计弹窗
   */
  onHideStats: function() {
    console.log('隐藏统计弹窗');
    
    this.setData({
      showStats: false
    });
  },

  /**
   * 隐藏完成弹窗
   */
  onHideComplete: function() {
    console.log('隐藏完成弹窗');
    
    this.setData({
      showComplete: false
    });
  },

  /**
   * 阻止事件冒泡
   */
  stopPropagation: function() {
    // 阻止事件冒泡
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    // 页面隐藏
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log('闪卡模式页面卸载');
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log('下拉刷新');
    this.loadWordList();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // 上拉触底
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '我在用闪卡模式学英语，一起来挑战吧！',
      path: '/pages/flashcard/flashcard'
    };
  }
});