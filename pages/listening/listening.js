// pages/listening/listening.js
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
    
    // 当前单词数据
    currentWord: {
      word: '',
      phonetic: '',
      meaning: '',
      difficulty: 'medium'
    },
    
    // 单词列表
    wordList: [],
    
    // 练习模式 (listen, speak, dictation)
    practiceMode: 'listen',
    
    // 是否显示单词
    showWord: false,
    
    // 是否显示释义
    showMeaning: false,
    
    // 音频播放状态
    isPlaying: false,
    
    // 播放次数
    playCount: 0,
    
    // 听音识词选项
    listenOptions: [],
    
    // 选中的选项
    selectedOption: null,
    
    // 是否显示答案
    showAnswer: false,
    
    // 录音状态
    isRecording: false,
    
    // 录音时间
    recordingTime: 0,
    
    // 发音评分
    pronunciationScore: null,
    
    // 听写输入
    dictationInput: '',
    
    // 听写输入框焦点
    dictationFocus: false,
    
    // 听写状态 (normal, correct, incorrect)
    dictationStatus: 'normal',
    
    // 当前句子
    currentSentence: {
      text: '',
      translation: ''
    },
    
    // 是否显示句子
    showSentence: false,
    
    // 显示结果弹窗
    showResult: false,
    
    // 结果类型 (correct, incorrect)
    resultType: 'correct',
    
    // 错误分析
    errorAnalysis: [],
    
    // 练习统计
    stats: {
      correct: 0,
      incorrect: 0,
      accuracy: 0,
      totalPronunciationScore: 0,
      pronunciationCount: 0
    },
    
    // 显示完成弹窗
    showComplete: false,
    
    // 练习时间
    practiceTime: 0,
    
    // 开始时间
    startTime: null,
    
    // 平均发音分数
    averagePronunciation: 0,
    
    // 成就列表
    achievements: [],
    
    // 显示帮助
    showHelp: false,
    
    // 音频上下文
    audioContext: null,
    
    // 录音管理器
    recorderManager: null,
    
    // 录音定时器
    recordingTimer: null,
    
    // 用户答案记录
    answerRecords: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('听力训练页面加载', options);
    this.initPageData();
    this.loadWordList();
    this.initRecorder();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setData({
      startTime: Date.now()
    });
    
    // 创建音频上下文
    this.setData({
      audioContext: wx.createInnerAudioContext()
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 页面显示时自动播放当前单词
    setTimeout(() => {
      this.onPlayAudio();
    }, 500);
  },

  /**
   * 初始化页面数据
   */
  initPageData: function() {
    console.log('初始化听力训练页面数据');
    
    // 设置导航栏标题
    wx.setNavigationBarTitle({
      title: '听力训练'
    });
  },

  /**
   * 初始化录音管理器
   */
  initRecorder: function() {
    const recorderManager = wx.getRecorderManager();
    
    recorderManager.onStart(() => {
      console.log('开始录音');
      this.setData({
        isRecording: true,
        recordingTime: 0
      });
      this.startRecordingTimer();
    });

    recorderManager.onStop((res) => {
      console.log('录音结束', res);
      this.setData({
        isRecording: false
      });
      this.stopRecordingTimer();
      this.analyzePronunciation(res.tempFilePath);
    });

    recorderManager.onError((err) => {
      console.error('录音错误', err);
      wx.showToast({
        title: '录音失败',
        icon: 'none',
        duration: 2000
      });
      this.setData({
        isRecording: false
      });
      this.stopRecordingTimer();
    });

    this.setData({
      recorderManager: recorderManager
    });
  },

  /**
   * 加载单词列表
   */
  loadWordList: function() {
    console.log('加载单词列表');
    
    // 模拟单词数据
    const mockWords = [
      {
        word: 'achievement',
        phonetic: '/əˈtʃiːvmənt/',
        meaning: '成就；完成；达到',
        difficulty: 'medium'
      },
      {
        word: 'brilliant',
        phonetic: '/ˈbrɪljənt/',
        meaning: '聪明的；杰出的；明亮的',
        difficulty: 'hard'
      },
      {
        word: 'challenge',
        phonetic: '/ˈtʃælɪndʒ/',
        meaning: '挑战；质疑',
        difficulty: 'easy'
      },
      {
        word: 'determination',
        phonetic: '/dɪˌtɜːrmɪˈneɪʃn/',
        meaning: '决心；决定',
        difficulty: 'hard'
      },
      {
        word: 'excellent',
        phonetic: '/ˈeksələnt/',
        meaning: '优秀的；卓越的',
        difficulty: 'easy'
      }
    ];

    // 模拟句子数据
    const mockSentences = [
      {
        text: 'His achievement in science is remarkable.',
        translation: '他在科学方面的成就是非凡的。'
      },
      {
        text: 'She has a brilliant mind for mathematics.',
        translation: '她在数学方面有着聪明的头脑。'
      },
      {
        text: 'This challenge requires careful planning.',
        translation: '这个挑战需要仔细的规划。'
      },
      {
        text: 'Her determination helped her succeed.',
        translation: '她的决心帮助她成功了。'
      },
      {
        text: 'The performance was excellent.',
        translation: '表演非常出色。'
      }
    ];

    this.setData({
      wordList: mockWords,
      totalWords: mockWords.length,
      currentWord: mockWords[0],
      currentSentence: mockSentences[0],
      progressPercentage: 0,
      answerRecords: new Array(mockWords.length).fill(null)
    });

    this.generateListenOptions();
  },

  /**
   * 生成听音识词选项
   */
  generateListenOptions: function() {
    const currentWord = this.data.currentWord;
    const allWords = this.data.wordList;
    
    // 创建选项数组，包含正确答案和3个干扰项
    const options = [{ word: currentWord.word, isCorrect: true }];
    
    // 随机选择3个其他单词作为干扰项
    const otherWords = allWords.filter(w => w.word !== currentWord.word);
    const shuffledOthers = otherWords.sort(() => Math.random() - 0.5);
    
    for (let i = 0; i < Math.min(3, shuffledOthers.length); i++) {
      options.push({ word: shuffledOthers[i].word, isCorrect: false });
    }
    
    // 打乱选项顺序
    const shuffledOptions = options.sort(() => Math.random() - 0.5);
    
    this.setData({
      listenOptions: shuffledOptions
    });
  },

  /**
   * 选择练习模式
   */
  onSelectMode: function(e) {
    const mode = e.currentTarget.dataset.mode;
    console.log('选择练习模式:', mode);
    
    this.setData({
      practiceMode: mode,
      selectedOption: null,
      showAnswer: false,
      pronunciationScore: null,
      dictationInput: '',
      dictationStatus: 'normal',
      showWord: mode === 'speak',
      showMeaning: mode === 'speak',
      showSentence: false
    });

    // 根据模式调整显示内容
    if (mode === 'dictation') {
      this.setData({
        dictationFocus: true
      });
    }
  },

  /**
   * 播放音频
   */
  onPlayAudio: function() {
    console.log('播放音频:', this.data.currentWord.word);
    
    if (this.data.isPlaying) {
      // 暂停播放
      this.setData({
        isPlaying: false
      });
      return;
    }

    // 开始播放
    this.setData({
      isPlaying: true,
      playCount: this.data.playCount + 1
    });

    // 模拟音频播放
    wx.showToast({
      title: `播放 ${this.data.currentWord.word}`,
      icon: 'none',
      duration: 1000
    });

    // 模拟播放时长
    setTimeout(() => {
      this.setData({
        isPlaying: false
      });
    }, 2000);

    // 实际项目中可以使用真实的音频文件
    // const audioContext = this.data.audioContext;
    // audioContext.src = `audio/${this.data.currentWord.word}.mp3`;
    // audioContext.play();
  },

  /**
   * 慢速播放
   */
  onSlowPlay: function() {
    console.log('慢速播放');
    wx.showToast({
      title: '慢速播放',
      icon: 'none',
      duration: 1000
    });
    // 实际实现中可以调整播放速度
  },

  /**
   * 重复播放
   */
  onRepeatPlay: function() {
    console.log('重复播放');
    this.onPlayAudio();
  },

  /**
   * 播放句子
   */
  onPlaySentence: function() {
    console.log('播放句子:', this.data.currentSentence.text);
    
    wx.showToast({
      title: '播放句子',
      icon: 'none',
      duration: 1000
    });

    // 实际项目中播放句子音频
  },

  /**
   * 选择选项
   */
  onSelectOption: function(e) {
    if (this.data.showAnswer) return;
    
    const index = e.currentTarget.dataset.index;
    console.log('选择选项:', index);
    
    this.setData({
      selectedOption: index
    });
  },

  /**
   * 切换录音状态
   */
  onToggleRecording: function() {
    if (this.data.isRecording) {
      // 停止录音
      this.data.recorderManager.stop();
    } else {
      // 开始录音
      this.data.recorderManager.start({
        duration: 10000, // 最长录音10秒
        sampleRate: 16000,
        numberOfChannels: 1,
        encodeBitRate: 96000,
        format: 'mp3'
      });
    }
  },

  /**
   * 开始录音计时
   */
  startRecordingTimer: function() {
    this.data.recordingTimer = setInterval(() => {
      this.setData({
        recordingTime: this.data.recordingTime + 1
      });
      
      // 最长录音10秒
      if (this.data.recordingTime >= 10) {
        this.data.recorderManager.stop();
      }
    }, 1000);
  },

  /**
   * 停止录音计时
   */
  stopRecordingTimer: function() {
    if (this.data.recordingTimer) {
      clearInterval(this.data.recordingTimer);
      this.setData({
        recordingTimer: null
      });
    }
  },

  /**
   * 分析发音
   */
  analyzePronunciation: function(audioPath) {
    console.log('分析发音:', audioPath);
    
    // 模拟发音评分
    const score = Math.floor(Math.random() * 40) + 60; // 60-100分
    
    // 更新统计
    const stats = { ...this.data.stats };
    stats.totalPronunciationScore += score;
    stats.pronunciationCount++;
    
    this.setData({
      pronunciationScore: score,
      stats: stats
    });

    // 触觉反馈
    wx.vibrateShort({
      type: score >= 80 ? 'light' : 'medium'
    });

    // 实际项目中可以调用语音识别API进行发音评估
  },

  /**
   * 听写输入
   */
  onDictationInput: function(e) {
    const value = e.detail.value;
    this.setData({
      dictationInput: value,
      dictationStatus: 'normal'
    });
  },

  /**
   * 检查听写
   */
  onCheckDictation: function() {
    const userInput = this.data.dictationInput.trim().toLowerCase();
    const correctAnswer = this.data.currentSentence.text.toLowerCase();
    
    if (!userInput) {
      wx.showToast({
        title: '请输入听写内容',
        icon: 'none',
        duration: 1500
      });
      return;
    }

    console.log('检查听写:', userInput, '正确答案:', correctAnswer);

    // 计算相似度
    const similarity = this.calculateSimilarity(userInput, correctAnswer);
    const isCorrect = similarity >= 0.8; // 80%相似度认为正确
    
    this.setData({
      dictationStatus: isCorrect ? 'correct' : 'incorrect',
      showSentence: true
    });

    // 显示结果
    setTimeout(() => {
      this.showResult(isCorrect, []);
    }, 1000);
  },

  /**
   * 计算字符串相似度
   */
  calculateSimilarity: function(str1, str2) {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const editDistance = this.levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  },

  /**
   * 计算编辑距离
   */
  levenshteinDistance: function(str1, str2) {
    const matrix = [];
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    return matrix[str2.length][str1.length];
  },

  /**
   * 显示提示
   */
  onShowHint: function() {
    console.log('显示提示');
    
    if (this.data.practiceMode === 'listen') {
      this.setData({
        showWord: true,
        showMeaning: true
      });
      
      wx.showToast({
        title: '提示已显示',
        icon: 'none',
        duration: 1000
      });
    }
  },

  /**
   * 提交答案
   */
  onSubmitAnswer: function() {
    if (this.data.showAnswer) {
      this.onNextWord();
      return;
    }

    let isCorrect = false;
    let errorAnalysis = [];

    if (this.data.practiceMode === 'listen') {
      // 听音识词模式
      if (this.data.selectedOption === null) {
        wx.showToast({
          title: '请选择一个选项',
          icon: 'none',
          duration: 1500
        });
        return;
      }

      const selectedOption = this.data.listenOptions[this.data.selectedOption];
      isCorrect = selectedOption.isCorrect;
      
      if (!isCorrect) {
        errorAnalysis = [
          `正确答案是：${this.data.currentWord.word}`,
          `你选择了：${selectedOption.word}`,
          '建议多听几遍单词发音，注意音节和重音'
        ];
      }
    } else if (this.data.practiceMode === 'speak') {
      // 跟读练习模式
      if (this.data.pronunciationScore === null) {
        wx.showToast({
          title: '请先录音练习',
          icon: 'none',
          duration: 1500
        });
        return;
      }

      isCorrect = this.data.pronunciationScore >= 70;
      
      if (!isCorrect) {
        errorAnalysis = [
          `发音评分：${this.data.pronunciationScore}分`,
          '建议多练习发音，注意单词的重音和音节',
          '可以多听标准发音进行对比'
        ];
      }
    } else if (this.data.practiceMode === 'dictation') {
      // 听写练习模式已在onCheckDictation中处理
      return;
    }

    this.showResult(isCorrect, errorAnalysis);
  },

  /**
   * 显示结果
   */
  showResult: function(isCorrect, errorAnalysis) {
    // 记录答案
    const answerRecords = [...this.data.answerRecords];
    answerRecords[this.data.currentIndex] = {
      mode: this.data.practiceMode,
      isCorrect: isCorrect,
      pronunciationScore: this.data.pronunciationScore
    };

    // 更新统计
    const stats = { ...this.data.stats };
    if (isCorrect) {
      stats.correct++;
    } else {
      stats.incorrect++;
    }
    stats.accuracy = Math.round((stats.correct / (stats.correct + stats.incorrect)) * 100);

    this.setData({
      answerRecords: answerRecords,
      stats: stats,
      resultType: isCorrect ? 'correct' : 'incorrect',
      errorAnalysis: errorAnalysis,
      showAnswer: true,
      showResult: true
    });

    // 触觉反馈
    wx.vibrateShort({
      type: isCorrect ? 'light' : 'medium'
    });
  },

  /**
   * 跳过单词
   */
  onSkipWord: function() {
    console.log('跳过单词');
    
    wx.showModal({
      title: '确认跳过',
      content: '跳过这个单词将记为错误，确定要跳过吗？',
      success: (res) => {
        if (res.confirm) {
          // 记录为错误
          const answerRecords = [...this.data.answerRecords];
          answerRecords[this.data.currentIndex] = {
            mode: this.data.practiceMode,
            isCorrect: false,
            skipped: true
          };

          const stats = { ...this.data.stats };
          stats.incorrect++;
          stats.accuracy = Math.round((stats.correct / (stats.correct + stats.incorrect)) * 100);

          this.setData({
            answerRecords: answerRecords,
            stats: stats
          });

          this.onNextWord();
        }
      }
    });
  },

  /**
   * 播放结果音频
   */
  onPlayResultAudio: function() {
    this.onPlayAudio();
  },

  /**
   * 下一个单词
   */
  onNextWord: function() {
    if (this.data.currentIndex < this.data.totalWords - 1) {
      const newIndex = this.data.currentIndex + 1;
      this.updateCurrentWord(newIndex);
    } else {
      this.onCompleteListening();
    }
    
    this.setData({
      showResult: false
    });
  },

  /**
   * 更新当前单词
   */
  updateCurrentWord: function(index) {
    const progressPercentage = Math.round(((index + 1) / this.data.totalWords) * 100);
    
    this.setData({
      currentIndex: index,
      currentWord: this.data.wordList[index],
      progressPercentage: progressPercentage,
      selectedOption: null,
      showAnswer: false,
      pronunciationScore: null,
      dictationInput: '',
      dictationStatus: 'normal',
      showWord: this.data.practiceMode === 'speak',
      showMeaning: this.data.practiceMode === 'speak',
      showSentence: false,
      playCount: 0
    });

    this.generateListenOptions();
    
    // 自动播放新单词
    setTimeout(() => {
      this.onPlayAudio();
    }, 500);
  },

  /**
   * 完成听力训练
   */
  onCompleteListening: function() {
    console.log('完成听力训练');
    
    // 计算练习时间
    const practiceTime = Math.round((Date.now() - this.data.startTime) / 60000);
    
    // 计算平均发音分数
    const averagePronunciation = this.data.stats.pronunciationCount > 0 
      ? Math.round(this.data.stats.totalPronunciationScore / this.data.stats.pronunciationCount)
      : 0;
    
    // 计算成就
    const achievements = this.calculateAchievements();
    
    this.setData({
      practiceTime: practiceTime,
      averagePronunciation: averagePronunciation,
      achievements: achievements,
      showComplete: true
    });

    // 触觉反馈
    wx.vibrateShort({
      type: 'heavy'
    });
  },

  /**
   * 计算成就
   */
  calculateAchievements: function() {
    const achievements = [];
    const { stats } = this.data;
    
    if (stats.accuracy === 100) {
      achievements.push({
        icon: '🎯',
        name: '听力满分'
      });
    } else if (stats.accuracy >= 90) {
      achievements.push({
        icon: '👂',
        name: '听力高手'
      });
    } else if (stats.accuracy >= 80) {
      achievements.push({
        icon: '🎵',
        name: '听力达人'
      });
    }
    
    if (this.data.averagePronunciation >= 90) {
      achievements.push({
        icon: '🗣️',
        name: '发音标准'
      });
    }
    
    if (this.data.practiceTime <= 5) {
      achievements.push({
        icon: '⚡',
        name: '闪电听力'
      });
    }
    
    return achievements;
  },

  /**
   * 重新开始练习
   */
  onRestart: function() {
    console.log('重新开始练习');
    
    this.setData({
      currentIndex: 0,
      currentWord: this.data.wordList[0],
      progressPercentage: 0,
      selectedOption: null,
      showAnswer: false,
      pronunciationScore: null,
      dictationInput: '',
      dictationStatus: 'normal',
      showWord: this.data.practiceMode === 'speak',
      showMeaning: this.data.practiceMode === 'speak',
      showSentence: false,
      playCount: 0,
      showComplete: false,
      startTime: Date.now(),
      stats: {
        correct: 0,
        incorrect: 0,
        accuracy: 0,
        totalPronunciationScore: 0,
        pronunciationCount: 0
      },
      answerRecords: new Array(this.data.totalWords).fill(null)
    });

    this.generateListenOptions();
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
   * 显示帮助
   */
  onShowHelp: function() {
    this.setData({
      showHelp: true
    });
  },

  /**
   * 隐藏帮助
   */
  onHideHelp: function() {
    this.setData({
      showHelp: false
    });
  },

  /**
   * 隐藏结果弹窗
   */
  onHideResult: function() {
    this.setData({
      showResult: false
    });
  },

  /**
   * 隐藏完成弹窗
   */
  onHideComplete: function() {
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
    // 停止音频播放
    if (this.data.audioContext) {
      this.data.audioContext.stop();
    }
    
    // 停止录音
    if (this.data.isRecording) {
      this.data.recorderManager.stop();
    }
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log('听力训练页面卸载');
    
    // 销毁音频上下文
    if (this.data.audioContext) {
      this.data.audioContext.destroy();
    }
    
    // 清理录音定时器
    this.stopRecordingTimer();
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '我在练习英语听力，一起来挑战吧！',
      path: '/pages/listening/listening'
    };
  }
});