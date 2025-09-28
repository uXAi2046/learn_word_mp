// pages/spelling/spelling.js
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
    
    // 用户输入
    userInput: '',
    
    // 输入框状态 (normal, correct, incorrect)
    inputStatus: 'normal',
    
    // 输入框焦点
    inputFocus: true,
    
    // 是否显示提示
    showHints: false,
    
    // 字母提示
    letterHints: [],
    
    // 音频播放状态
    isPlaying: false,
    
    // 音频加载状态
    audioLoading: false,
    
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
      hintsUsed: 0
    },
    
    // 显示完成弹窗
    showComplete: false,
    
    // 练习时间
    practiceTime: 0,
    
    // 开始时间
    startTime: null,
    
    // 成就列表
    achievements: [],
    
    // 显示帮助
    showHelp: false,
    
    // 音频上下文
    audioContext: null,
    
    // 用户答案记录
    answerRecords: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('拼写练习页面加载', options);
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
    console.log('初始化拼写练习页面数据');
    
    // 设置导航栏标题
    wx.setNavigationBarTitle({
      title: '拼写练习'
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

    this.setData({
      wordList: mockWords,
      totalWords: mockWords.length,
      currentWord: mockWords[0],
      progressPercentage: 0,
      answerRecords: new Array(mockWords.length).fill(null)
    });

    this.initLetterHints();
  },

  /**
   * 初始化字母提示
   */
  initLetterHints: function() {
    const word = this.data.currentWord.word;
    const hints = word.split('').map(letter => ({
      letter: letter,
      revealed: false
    }));
    
    this.setData({
      letterHints: hints
    });
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

    // 显示加载状态
    this.setData({
      audioLoading: true
    });

    // 模拟加载延迟
    setTimeout(() => {
      // 开始播放
      this.setData({
        audioLoading: false,
        isPlaying: true
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
    }, 300);

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
   * 输入变化
   */
  onInputChange: function(e) {
    const value = e.detail.value.toLowerCase().trim();
    this.setData({
      userInput: value,
      inputStatus: 'normal'
    });
  },

  /**
   * 提交拼写
   */
  onSubmitSpelling: function() {
    const userInput = this.data.userInput.toLowerCase().trim();
    const correctAnswer = this.data.currentWord.word.toLowerCase();
    
    if (!userInput) {
      wx.showToast({
        title: '请输入单词',
        icon: 'none',
        duration: 1500
      });
      return;
    }

    console.log('提交拼写:', userInput, '正确答案:', correctAnswer);

    // 记录答案
    const answerRecords = [...this.data.answerRecords];
    answerRecords[this.data.currentIndex] = {
      userAnswer: userInput,
      correctAnswer: correctAnswer,
      isCorrect: userInput === correctAnswer,
      hintsUsed: this.data.showHints
    };

    // 判断正误
    const isCorrect = userInput === correctAnswer;
    const resultType = isCorrect ? 'correct' : 'incorrect';
    
    // 更新统计
    const stats = { ...this.data.stats };
    if (isCorrect) {
      stats.correct++;
    } else {
      stats.incorrect++;
    }
    stats.accuracy = Math.round((stats.correct / (stats.correct + stats.incorrect)) * 100);

    // 错误分析
    let errorAnalysis = [];
    if (!isCorrect) {
      errorAnalysis = this.analyzeSpellingError(userInput, correctAnswer);
    }

    this.setData({
      answerRecords: answerRecords,
      stats: stats,
      resultType: resultType,
      errorAnalysis: errorAnalysis,
      inputStatus: resultType,
      showResult: true,
      inputFocus: false
    });

    // 触觉反馈
    wx.vibrateShort({
      type: isCorrect ? 'light' : 'medium'
    });
  },

  /**
   * 分析拼写错误
   */
  analyzeSpellingError: function(userInput, correctAnswer) {
    const analysis = [];
    
    // 长度比较
    if (userInput.length !== correctAnswer.length) {
      if (userInput.length < correctAnswer.length) {
        analysis.push(`单词长度不足，应为 ${correctAnswer.length} 个字母`);
      } else {
        analysis.push(`单词长度过长，应为 ${correctAnswer.length} 个字母`);
      }
    }

    // 字母比较
    const userLetters = userInput.split('');
    const correctLetters = correctAnswer.split('');
    const wrongPositions = [];
    
    for (let i = 0; i < Math.max(userLetters.length, correctLetters.length); i++) {
      if (userLetters[i] !== correctLetters[i]) {
        wrongPositions.push(i + 1);
      }
    }

    if (wrongPositions.length > 0 && wrongPositions.length <= 3) {
      analysis.push(`第 ${wrongPositions.join('、')} 位字母有误`);
    }

    // 相似度分析
    const similarity = this.calculateSimilarity(userInput, correctAnswer);
    if (similarity > 0.7) {
      analysis.push('拼写很接近了，再仔细听听发音');
    } else if (similarity > 0.4) {
      analysis.push('部分字母正确，注意单词的整体结构');
    } else {
      analysis.push('建议重新听发音，注意每个音节');
    }

    return analysis;
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
    
    const stats = { ...this.data.stats };
    stats.hintsUsed++;
    
    this.setData({
      showHints: true,
      stats: stats
    });

    // 添加触觉反馈
    wx.vibrateShort();

    wx.showToast({
      title: '点击字母位置查看提示',
      icon: 'none',
      duration: 2000
    });
  },

  /**
   * 隐藏提示
   */
  onHideHint: function() {
    console.log('隐藏提示');
    
    this.setData({
      showHints: false
    });

    wx.showToast({
      title: '提示已隐藏',
      icon: 'none',
      duration: 1000
    });
  },

  /**
   * 揭示字母
   */
  onRevealLetter: function(e) {
    const index = e.currentTarget.dataset.index;
    const letterHints = [...this.data.letterHints];
    
    if (!letterHints[index].revealed) {
      letterHints[index].revealed = true;
      this.setData({
        letterHints: letterHints
      });

      wx.showToast({
        title: `第${index + 1}个字母：${letterHints[index].letter}`,
        icon: 'none',
        duration: 1500
      });
    }
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
            userAnswer: '',
            correctAnswer: this.data.currentWord.word,
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
   * 下一题
   */
  onNextWord: function() {
    console.log('下一题');
    
    // 隐藏结果弹窗
    this.setData({
      showResult: false,
      userInput: '',
      inputStatus: 'normal'
    });

    // 检查是否完成所有单词
    if (this.data.currentIndex >= this.data.totalWords - 1) {
      // 完成练习
      this.onCompleteSpelling();
    } else {
      // 继续下一题
      const nextIndex = this.data.currentIndex + 1;
      this.updateCurrentWord(nextIndex);
      
      // 重新获得焦点
      setTimeout(() => {
        this.setData({
          inputFocus: true
        });
      }, 100);
    }
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
      userInput: '',
      inputStatus: 'normal',
      inputFocus: false, // 先设为false
      showHints: false
    });

    this.initLetterHints();

    // 延迟设置焦点，确保页面渲染完成
    setTimeout(() => {
      this.setData({
        inputFocus: true
      });
    }, 200);
    
    // 自动播放新单词
    setTimeout(() => {
      this.onPlayAudio();
    }, 500);
  },

  /**
   * 完成拼写练习
   */
  onCompleteSpelling: function() {
    console.log('完成拼写练习');
    
    // 确保所有弹窗都已隐藏
    this.setData({
      showResult: false,
      showHelp: false
    });
    
    // 计算练习时间
    const practiceTime = Math.round((Date.now() - this.data.startTime) / 60000);
    
    // 计算成就
    const achievements = this.calculateAchievements();
    
    // 延迟显示完成弹窗，确保其他弹窗已完全隐藏
    setTimeout(() => {
      this.setData({
        practiceTime: practiceTime,
        achievements: achievements,
        showComplete: true
      });

      // 触觉反馈
      wx.vibrateShort({
        type: 'heavy'
      });
    }, 150);
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
        name: '完美拼写'
      });
    } else if (stats.accuracy >= 90) {
      achievements.push({
        icon: '⭐',
        name: '拼写高手'
      });
    } else if (stats.accuracy >= 80) {
      achievements.push({
        icon: '👍',
        name: '拼写达人'
      });
    }
    
    if (stats.hintsUsed === 0) {
      achievements.push({
        icon: '🧠',
        name: '独立思考'
      });
    }
    
    if (this.data.practiceTime <= 5) {
      achievements.push({
        icon: '⚡',
        name: '闪电拼写'
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
      userInput: '',
      inputStatus: 'normal',
      inputFocus: false, // 先设为false
      showHints: false,
      showResult: false,
      showComplete: false,
      stats: {
        correct: 0,
        incorrect: 0,
        accuracy: 0,
        hintsUsed: 0
      },
      answerRecords: [],
      startTime: Date.now()
    });

    // 更新当前单词
    this.updateCurrentWord(0);
  },

  /**
   * 返回学习详情页
   */
  onBackToDetail: function() {
    console.log('返回学习详情页');
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
    
    // 重新获得焦点
    setTimeout(() => {
      this.setData({
        inputFocus: true
      });
    }, 100);
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
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log('拼写练习页面卸载');
    
    // 销毁音频上下文
    if (this.data.audioContext) {
      this.data.audioContext.destroy();
    }
  },

  /**
   * 返回上一页
   */
  onBack: function() {
    console.log('返回上一页');
    wx.navigateBack({
      delta: 1
    });
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
      title: '我在练习英语拼写，一起来挑战吧！',
      path: '/pages/spelling/spelling'
    };
  }
});