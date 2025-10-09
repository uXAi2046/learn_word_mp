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
    
    // 显示练习完成弹窗
    showCompletion: false,
    
    // 练习统计数据（用于完成弹窗）
    practiceStats: {
      correct: 0,
      incorrect: 0,
      accuracy: 0,
      timeUsed: '0分钟',
      achievements: []
    },
    
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
    answerRecords: [],

    // 测试功能控制
    showTestButtons: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('拼写练习页面加载', options);
    
    // 确保页面数据初始化
    try {
      this.initPageData();
      this.loadWordList();
      
      // 确保当前单词被正确设置
      if (this.data.wordList && this.data.wordList.length > 0) {
        this.setCurrentWord(0);
      }
    } catch (error) {
      console.error('页面初始化错误:', error);
      // 显示错误提示
      wx.showToast({
        title: '加载失败，请重试',
        icon: 'none',
        duration: 2000
      });
    }
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
    
    // 初始化开始时间
    this.setData({
      startTime: Date.now(),
      stats: {
        correct: 0,
        incorrect: 0,
        accuracy: 0,
        hintsUsed: 0
      },
      practiceStats: {
        correct: 0,
        incorrect: 0,
        accuracy: 0,
        timeUsed: '0分钟',
        achievements: []
      }
    });
  },

  /**
   * 加载单词列表
   */
  /**
   * 设置当前单词
   */
  setCurrentWord: function(index) {
    if (!this.data.wordList || this.data.wordList.length === 0) {
      console.error('单词列表为空');
      return;
    }
    
    if (index < 0 || index >= this.data.wordList.length) {
      console.error('单词索引超出范围');
      return;
    }
    
    const currentWord = this.data.wordList[index];
    
    // 重置用户输入和状态
    this.setData({
      currentIndex: index,
      currentWord: currentWord,
      userInput: '',
      inputStatus: 'normal',
      showHints: false,
      letterHints: Array.from(currentWord.word).map(letter => ({
        letter: letter,
        revealed: false
      }))
    });
    
    // 更新进度
    this.updateProgress();
  },
  
  /**
   * 更新进度
   */
  updateProgress: function() {
    const progress = ((this.data.currentIndex + 1) / this.data.totalWords) * 100;
    this.setData({
      progressPercentage: progress
    });
  },
  
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
    
    // 设置单词列表和总数
    this.setData({
      wordList: mockWords,
      totalWords: mockWords.length,
      currentWord: mockWords.length > 0 ? mockWords[0] : null,
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
      inputFocus: false,
      currentResult: {
        word: this.data.currentWord.word,
        phonetic: this.data.currentWord.phonetic,
        meaning: this.data.currentWord.meaning,
        userAnswer: userInput,
        correctAnswer: correctAnswer,
        isCorrect: isCorrect,
        errorAnalysis: isCorrect ? null : errorAnalysis
      }
    });

    // 防止页面滚动并确保弹窗在视口中央
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 0
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
    const timeUsed = practiceTime > 0 ? `${practiceTime}分钟` : '不到1分钟';
    
    // 获取当前最新的统计数据
    const currentStats = this.data.stats;
    console.log('当前统计数据:', currentStats);
    
    // 计算成就
    const achievements = this.calculateAchievements();
    
    // 准备练习统计数据，确保数据结构与WXML一致
    const practiceStats = {
      correct: currentStats.correct,
      incorrect: currentStats.incorrect,
      accuracy: currentStats.accuracy || 0,
      timeUsed: timeUsed,
      achievements: achievements // 确保成就数据在practiceStats中
    };
    
    console.log('练习统计数据:', practiceStats);
    
    // 延迟显示完成弹窗，确保其他弹窗已完全隐藏
    setTimeout(() => {
      this.setData({
        practiceTime: practiceTime,
        practiceStats: practiceStats,
        achievements: achievements, // 保持向后兼容
        showCompletion: true
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
  onRestartPractice: function() {
    console.log('重新开始练习');
    
    this.setData({
      currentIndex: 0,
      userInput: '',
      inputStatus: 'normal',
      inputFocus: false, // 先设为false
      showHints: false,
      showResult: false,
      showCompletion: false,
      stats: {
        correct: 0,
        incorrect: 0,
        accuracy: 0,
        hintsUsed: 0
      },
      practiceStats: {
        correct: 0,
        incorrect: 0,
        accuracy: 0,
        timeUsed: '0分钟',
        achievements: []
      },
      answerRecords: [],
      startTime: Date.now()
    });

    // 更新当前单词
    this.updateCurrentWord(0);
    
    // 隐藏完成弹窗后重新获得焦点
    setTimeout(() => {
      this.setData({
        inputFocus: true
      });
    }, 300);
  },

  /**
   * 返回首页
   */
  onBackToHome: function() {
    console.log('返回首页');
    wx.reLaunch({
      url: '/pages/index/index'
    });
  },

  /**
   * 完成弹窗确认按钮处理
   */
  onConfirmCompletion: function() {
    // 关闭完成弹窗
    this.setData({
      showCompletion: false
    });
    // 恢复页面滚动并聚焦输入框
    this.enablePageScroll && this.enablePageScroll();
    setTimeout(() => {
      this.setData({
        inputFocus: true
      });
    }, 100);
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
   * 显示结果弹窗 - 优化交互方式，确保点击按钮时正确显示弹窗浮层
   */
  onShowResult: function() {
    // 设置弹窗显示状态
    this.setData({
      showResult: true,
      // 禁用输入框焦点，防止键盘弹出
      inputFocus: false
    });
    
    // 防止页面滚动
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 0
    });
    
    // 阻止页面滚动
    this.disablePageScroll();
    
    // 添加弹窗显示类名以触发动画
    setTimeout(() => {
      const query = wx.createSelectorQuery();
      query.select('.result-overlay').boundingClientRect().exec((res) => {
        if (Array.isArray(res) && res[0]) {
          // 触发显示动画
          this.triggerResultAnimation();
          
          // 播放反馈音效
          this.playFeedbackSound(this.data.resultType);
        }
      });
    }, 50);
  },

  /**
   * 触发结果弹窗动画 - 增强视觉反馈
   */
  triggerResultAnimation: function() {
    // 为错误分析区域添加展开动画
    if (this.data.resultType === 'incorrect') {
      setTimeout(() => {
      const query = wx.createSelectorQuery();
      query.select('.error-analysis-section').boundingClientRect().exec((res) => {
          if (Array.isArray(res) && res[0]) {
          // 为错误分析添加渐入动画
          wx.createAnimation({
            duration: 300,
            timingFunction: 'ease-out'
          }).opacity(1).step();
        }
      });
      }, 300);
    }
    
    // 为单词卡片添加缩放动画
    setTimeout(() => {
      const query = wx.createSelectorQuery();
      query.select('.word-details-section').boundingClientRect().exec((res) => {
        if (Array.isArray(res) && res[0]) {
          // 可以在这里添加单词卡片的动画
        }
      });
    }, 150);
  },

  /**
   * 播放反馈音效
   */
  playFeedbackSound: function(resultType) {
    const soundUrl = resultType === 'correct' ? 
      '/assets/sounds/correct.mp3' : 
      '/assets/sounds/incorrect.mp3';
    
    // 播放对应的音效
    const audioContext = wx.createInnerAudioContext();
    audioContext.src = soundUrl;
    audioContext.play();
  },

  /**
   * 禁用页面滚动
   */
  disablePageScroll: function() {
    // 设置页面样式，禁止滚动
    wx.setPageStyle({
      style: {
        overflow: 'hidden'
      }
    }).catch(err => {
      console.log('设置页面样式失败', err);
    });
  },

  /**
   * 启用页面滚动
   */
  enablePageScroll: function() {
    // 恢复页面滚动
    wx.setPageStyle({
      style: {
        overflow: 'auto'
      }
    }).catch(err => {
      console.log('恢复页面样式失败', err);
    });
  },

  /**
   * 隐藏结果弹窗 - 优化交互方式
   */
  onHideResult: function() {
    // 添加淡出动画
    const query = wx.createSelectorQuery();
    query.select('.result-overlay').boundingClientRect().exec((res) => {
      if (Array.isArray(res) && res[0]) {
        // 添加淡出动画类
        this.setData({
          resultOverlayFadeOut: true
        });
        
        // 延迟隐藏弹窗，等待动画完成
        setTimeout(() => {
          this.setData({
            showResult: false,
            resultOverlayFadeOut: false
          });
          
          // 恢复页面滚动
          this.enablePageScroll();
          
          // 重新获得焦点
          setTimeout(() => {
            this.setData({
              inputFocus: true
            });
          }, 100);
        }, 300);
      } else {
        // 直接隐藏弹窗
        this.setData({
          showResult: false
        });
        
        // 恢复页面滚动
        this.enablePageScroll();
        
        // 重新获得焦点
        setTimeout(() => {
          this.setData({
            inputFocus: true
          });
        }, 100);
      }
    });
  },

  /**
   * 播放结果音频 - 点击"再听一遍"按钮
   */
  onPlayResultAudio: function() {
    // 播放当前单词音频
    this.playWordAudio();
    
    // 添加按钮点击反馈
    this.setData({
      playButtonActive: true
    });
    
    // 重置按钮状态
    setTimeout(() => {
      this.setData({
        playButtonActive: false
      });
    }, 300);
  },

  /**
   * 下一题按钮点击处理
   */
  onNextWord: function() {
    // 隐藏结果弹窗
    this.onHideResult();
    
    // 延迟加载下一题，等待弹窗动画完成
    setTimeout(() => {
      // 加载下一个单词
      this.loadNextWord();
    }, 350);
  },

  /**
   * 显示完成弹窗 - 优化交互方式
   */
  onShowCompletion: function() {
    // 设置弹窗显示状态
    this.setData({
      showCompletion: true,
      // 禁用输入框焦点
      inputFocus: false
    });
    
    // 防止页面滚动
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 0
    });
    
    // 阻止页面滚动
    this.disablePageScroll();
    
    // 添加弹窗显示类名以触发动画
    setTimeout(() => {
      const query = wx.createSelectorQuery();
      query.select('.completion-overlay').boundingClientRect().exec((res) => {
        if (Array.isArray(res) && res[0]) {
          // 触发统计数据动画
          this.triggerStatsAnimation();
          
          // 播放完成音效
          this.playCompletionSound();
        }
      });
    }, 50);
  },

  /**
   * 触发统计数据动画
   */
  triggerStatsAnimation: function() {
    // 统计数据依次显示动画已在CSS中定义
    // 这里可以添加额外的交互逻辑
    
    // 如果有成就徽章，触发徽章动画
    if (this.data.practiceStats.achievements && this.data.practiceStats.achievements.length > 0) {
      setTimeout(() => {
        // 成就徽章浮动动画已在CSS中定义
      }, 500);
    }
  },

  /**
   * 隐藏练习完成弹窗
   */
  onHideCompletion: function() {
    // 添加淡出动画
    const query = wx.createSelectorQuery();
    query.select('.completion-overlay').boundingClientRect().exec((res) => {
      if (Array.isArray(res) && res[0]) {
        // 移除显示类名以触发隐藏动画
        setTimeout(() => {
          this.setData({
            showCompletion: false
          });
        }, 200);
      } else {
        this.setData({
          showCompletion: false
        });
      }
    });
  },

  /**
   * 优化的音频播放反馈
   */
  onPlayResultAudio: function() {
    console.log('播放结果音频:', this.data.currentWord.word);
    
    // 添加视觉反馈
    const query = wx.createSelectorQuery();
    query.select('.action-button.secondary').boundingClientRect().exec((res) => {
      if (Array.isArray(res) && res[0]) {
        // 按钮按下效果已在CSS中定义
      }
    });
    
    // 播放音频逻辑
    this.onPlayAudio();
  },

  /**
   * 优化的下一题交互
   */
  onNextWord: function() {
    console.log('下一题');
    
    // 添加按钮反馈动画
    const query = wx.createSelectorQuery();
    query.select('.action-button.primary').boundingClientRect().exec((res) => {
      if (Array.isArray(res) && res[0]) {
        // 按钮按下效果已在CSS中定义
      }
    });
    
    // 隐藏结果弹窗
    this.onHideResult();
    
    // 延迟执行下一题逻辑，确保动画完成
    setTimeout(() => {
      const nextIndex = this.data.currentIndex + 1;
      
      if (nextIndex >= this.data.totalWords) {
        // 完成所有练习
        this.onCompleteSpelling();
      } else {
        // 更新到下一个单词
        this.updateCurrentWord(nextIndex);
        
        // 清空输入
        this.setData({
          userInput: '',
          inputStatus: 'normal'
        });
        
        // 重新获得焦点
        setTimeout(() => {
          this.setData({
            inputFocus: true
          });
        }, 100);
      }
    }, 300);
  },

  /**
   * 优化的重新开始交互
   */
  onRestartPractice: function() {
    console.log('重新开始练习');
    
    // 添加按钮反馈
    const query = wx.createSelectorQuery();
    query.select('.completion-action-button.primary').boundingClientRect().exec((res) => {
      if (Array.isArray(res) && res[0]) {
        // 按钮按下效果已在CSS中定义
      }
    });
    
    // 隐藏完成弹窗
    this.onHideCompletion();
    
    // 延迟重置数据，确保动画完成
    setTimeout(() => {
      // 重置所有数据
      this.setData({
        currentIndex: 0,
        userInput: '',
        inputStatus: 'normal',
        showResult: false,
        showCompletion: false,
        stats: {
          correct: 0,
          incorrect: 0,
          accuracy: 0,
          hintsUsed: 0
        },
        practiceStats: {
          correct: 0,
          incorrect: 0,
          accuracy: 0,
          timeUsed: '0分钟',
          achievements: []
        },
        practiceTime: 0,
        startTime: Date.now(),
        achievements: [],
        answerRecords: new Array(this.data.totalWords).fill(null)
      });
      
      // 重新加载第一个单词
      this.updateCurrentWord(0);
      
      // 重新获得焦点
      setTimeout(() => {
        this.setData({
          inputFocus: true
        });
      }, 100);
    }, 300);
  },

  /**
   * 优化的返回首页交互
   */
  onBackToHome: function() {
    console.log('返回首页');
    
    // 添加按钮反馈
    const query = wx.createSelectorQuery();
    query.select('.completion-action-button.secondary').boundingClientRect().exec((res) => {
      if (Array.isArray(res) && res[0]) {
        // 按钮按下效果已在CSS中定义
      }
    });
    
    // 延迟导航，确保动画完成
    setTimeout(() => {
      wx.navigateBack();
    }, 200);
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
   * 显示结果弹窗
   */
  onShowResult: function() {
    this.setData({
      showResult: true
    });
    // 防止页面滚动
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 0
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
   * 显示完成弹窗
   */
  onShowCompletion: function() {
    this.setData({
      showCompletion: true
    });
    // 防止页面滚动
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 0
    });
  },

  /**
   * 隐藏练习完成弹窗
   */
  onHideCompletion: function() {
    this.setData({
      showCompletion: false
    });
  },

  /**
   * 阻止事件冒泡
   */
  stopPropagation: function() {
    // 阻止事件冒泡
  },

  /**
   * 键盘弹起时的处理
   */
  onKeyboardShow: function() {
    // 当键盘弹起时，如果有弹窗显示，调整页面位置
    if (this.data.showResult || this.data.showCompletion) {
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 200
      });
    }
  },

  /**
   * 键盘收起时的处理
   */
  onKeyboardHide: function() {
    // 键盘隐藏时的处理
    if (this.data.showResult || this.data.showCompletion) {
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 300
      });
    }
  },

  // 测试功能方法
  onToggleTestButtons: function() {
    console.log('切换测试按钮显示');
    this.setData({
      showTestButtons: !this.data.showTestButtons
    });
  },

  onTestCorrectAnswer: function() {
    console.log('测试正确答案');
    const correctAnswer = this.data.currentWord.word;
    
    // 设置输入框为正确答案
    this.setData({
      userInput: correctAnswer,
      inputStatus: 'correct'
    });

    // 更新统计
    const stats = { ...this.data.stats };
    stats.correct++;
    stats.accuracy = Math.round((stats.correct / (stats.correct + stats.incorrect)) * 100);

    // 记录答案
    const answerRecords = [...this.data.answerRecords];
    answerRecords[this.data.currentIndex] = {
      userAnswer: correctAnswer,
      correctAnswer: correctAnswer,
      isCorrect: true,
      testMode: true
    };

    this.setData({
      answerRecords: answerRecords,
      stats: stats,
      resultType: 'correct',
      errorAnalysis: [],
      showResult: true,
      inputFocus: false,
      currentResult: {
        word: this.data.currentWord.word,
        phonetic: this.data.currentWord.phonetic,
        meaning: this.data.currentWord.meaning,
        userAnswer: correctAnswer,
        correctAnswer: correctAnswer,
        isCorrect: true,
        errorAnalysis: null
      }
    });

    // 防止页面滚动
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 0
    });

    // 触觉反馈
    wx.vibrateShort({
      type: 'light'
    });
  },

  onTestIncorrectAnswer: function() {
    console.log('测试错误答案');
    const correctAnswer = this.data.currentWord.word;
    const incorrectAnswer = correctAnswer.substring(0, correctAnswer.length - 1); // 模拟错误答案
    
    // 设置输入框为错误答案
    this.setData({
      userInput: incorrectAnswer,
      inputStatus: 'incorrect'
    });

    // 更新统计
    const stats = { ...this.data.stats };
    stats.incorrect++;
    stats.accuracy = Math.round((stats.correct / (stats.correct + stats.incorrect)) * 100);

    // 错误分析
    const errorAnalysis = this.analyzeSpellingError(incorrectAnswer, correctAnswer);

    // 记录答案
    const answerRecords = [...this.data.answerRecords];
    answerRecords[this.data.currentIndex] = {
      userAnswer: incorrectAnswer,
      correctAnswer: correctAnswer,
      isCorrect: false,
      testMode: true
    };

    this.setData({
      answerRecords: answerRecords,
      stats: stats,
      resultType: 'incorrect',
      errorAnalysis: errorAnalysis,
      showResult: true,
      inputFocus: false,
      currentResult: {
        word: this.data.currentWord.word,
        phonetic: this.data.currentWord.phonetic,
        meaning: this.data.currentWord.meaning,
        userAnswer: incorrectAnswer,
        correctAnswer: correctAnswer,
        isCorrect: false,
        errorAnalysis: errorAnalysis
      }
    });

    // 防止页面滚动
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 0
    });

    // 触觉反馈
    wx.vibrateShort({
      type: 'medium'
    });
  },

  onTestCompletion: function() {
    console.log('测试完成弹窗');
    
    // 模拟完成统计数据
    const mockStats = {
      correct: 8,
      incorrect: 2,
      accuracy: 80,
      hintsUsed: 1
    };

    // 计算练习时间
    const practiceTime = Math.round((Date.now() - this.data.startTime) / 60000);
    const timeUsed = practiceTime > 0 ? `${practiceTime}分钟` : '3分钟'; // 使用模拟时间

    // 计算成就
    const achievements = ['🏆 首次完成', '⚡ 速度达人'];

    // 准备练习统计数据
    const practiceStats = {
      correct: mockStats.correct,
      incorrect: mockStats.incorrect,
      accuracy: mockStats.accuracy,
      timeUsed: timeUsed,
      achievements: achievements
    };

    console.log('测试模式练习统计数据:', practiceStats);

    // 隐藏其他弹窗
    this.setData({
      showResult: false,
      showHelp: false
    });

    // 延迟显示完成弹窗
    setTimeout(() => {
      this.setData({
        stats: mockStats, // 更新当前统计
        practiceStats: practiceStats,
        achievements: achievements,
        showCompletion: true
      });

      // 触觉反馈
      wx.vibrateShort({
        type: 'heavy'
      });
    }, 150);
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