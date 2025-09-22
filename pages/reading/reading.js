// pages/reading/reading.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 学习进度
    currentIndex: 0,
    totalWords: 10,
    completedCount: 0,
    progress: 0,

    // 当前单词
    currentWord: {
      id: 1,
      word: 'example',
      phonetic: '/ɪɡˈzæmpl/',
      meaning: '例子；榜样',
      difficulty: 'medium'
    },

    // 阅读模式
    readingMode: 'context', // context, comprehension, vocabulary

    // 语境阅读相关
    currentPassage: {
      title: '学习的重要性',
      level: '中级',
      content: 'Learning is a lifelong process that helps us grow and develop. For example, when we study new languages, we expand our understanding of different cultures. This example shows how education can broaden our perspectives and make us more open-minded individuals.',
      translation: '学习是一个终身的过程，帮助我们成长和发展。例如，当我们学习新语言时，我们扩展了对不同文化的理解。这个例子展示了教育如何能够拓宽我们的视野，使我们成为更加开放的人。'
    },
    showTranslation: false,
    showWordPopup: false,
    selectedWord: {},
    popupPosition: { x: 0, y: 0 },

    // 理解测试相关
    questions: [
      {
        question: '根据文章内容，学习的主要作用是什么？',
        options: [
          '帮助我们赚更多钱',
          '帮助我们成长和发展',
          '让我们变得更聪明',
          '提高我们的社会地位'
        ],
        correctAnswer: 1,
        explanation: '文章开头明确提到"Learning is a lifelong process that helps us grow and develop"，说明学习的主要作用是帮助我们成长和发展。'
      }
    ],
    currentQuestionIndex: 0,
    currentQuestion: {},
    selectedOption: -1,
    showResult: false,

    // 词汇标注相关
    annotationText: [],
    annotatedCount: 0,
    targetCount: 3,
    accuracy: 0,

    // 音频播放
    isPlaying: false,
    playCount: 0,

    // 统计数据
    stats: {
      correctCount: 0,
      incorrectCount: 0,
      accuracy: 0
    },

    // 弹窗状态
    showResultModal: false,
    showCompleteModal: false,
    showHelpModal: false,
    isCorrect: false,
    errorAnalysis: {},

    // 完成统计
    readingTime: '00:00',
    achievements: [],

    // 学习数据
    wordList: [
      {
        id: 1,
        word: 'example',
        phonetic: '/ɪɡˈzæmpl/',
        meaning: '例子；榜样',
        difficulty: 'medium',
        passage: {
          title: '学习的重要性',
          content: 'Learning is a lifelong process that helps us grow and develop. For example, when we study new languages, we expand our understanding of different cultures.',
          translation: '学习是一个终身的过程，帮助我们成长和发展。例如，当我们学习新语言时，我们扩展了对不同文化的理解。'
        },
        questions: [
          {
            question: '文章中"example"这个词的作用是什么？',
            options: ['举例说明', '强调重点', '总结观点', '引出话题'],
            correctAnswer: 0,
            explanation: '"For example"是典型的举例说明的表达方式。'
          }
        ]
      }
    ],

    // 计时器
    startTime: null,
    timer: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log('阅读理解页面加载', options);
    
    // 获取传递的参数
    const { wordId, mode } = options;
    
    // 初始化页面数据
    this.initPageData(wordId, mode);
    
    // 开始计时
    this.startTimer();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    console.log('阅读理解页面渲染完成');
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    console.log('阅读理解页面显示');
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    console.log('阅读理解页面隐藏');
    this.pauseTimer();
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    console.log('阅读理解页面卸载');
    this.stopTimer();
  },

  /**
   * 初始化页面数据
   */
  initPageData(wordId, mode) {
    const wordList = this.data.wordList;
    const currentWord = wordList[0]; // 模拟获取当前单词
    
    // 初始化阅读模式
    const readingMode = mode || 'context';
    
    // 初始化当前问题
    const currentQuestion = currentWord.questions[0];
    
    // 初始化标注文本
    const annotationText = this.initAnnotationText(currentWord.passage.content, currentWord.word);
    
    this.setData({
      currentWord,
      readingMode,
      currentPassage: currentWord.passage,
      currentQuestion,
      questions: currentWord.questions,
      annotationText,
      targetCount: this.countTargetWords(annotationText),
      totalWords: wordList.length
    });
  },

  /**
   * 初始化标注文本
   */
  initAnnotationText(content, targetWord) {
    const words = content.split(/(\s+|[.,!?;:])/);
    return words.map((text, index) => ({
      text,
      isTarget: text.toLowerCase() === targetWord.toLowerCase(),
      isAnnotated: false,
      index
    }));
  },

  /**
   * 计算目标单词数量
   */
  countTargetWords(annotationText) {
    return annotationText.filter(item => item.isTarget).length;
  },

  /**
   * 开始计时
   */
  startTimer() {
    this.setData({
      startTime: Date.now()
    });
    
    this.data.timer = setInterval(() => {
      const elapsed = Date.now() - this.data.startTime;
      const minutes = Math.floor(elapsed / 60000);
      const seconds = Math.floor((elapsed % 60000) / 1000);
      const timeStr = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      
      this.setData({
        readingTime: timeStr
      });
    }, 1000);
  },

  /**
   * 暂停计时
   */
  pauseTimer() {
    if (this.data.timer) {
      clearInterval(this.data.timer);
    }
  },

  /**
   * 停止计时
   */
  stopTimer() {
    if (this.data.timer) {
      clearInterval(this.data.timer);
      this.setData({
        timer: null
      });
    }
  },

  /**
   * 返回上一页
   */
  onBack() {
    wx.navigateBack();
  },

  /**
   * 播放单词音频
   */
  onPlayAudio() {
    console.log('播放音频:', this.data.currentWord.word);
    
    this.setData({
      isPlaying: true,
      playCount: this.data.playCount + 1
    });

    // 模拟音频播放
    setTimeout(() => {
      this.setData({
        isPlaying: false
      });
    }, 1500);

    // 这里应该调用实际的音频播放API
    // wx.createInnerAudioContext()
  },

  /**
   * 选择阅读模式
   */
  onSelectMode(e) {
    const mode = e.currentTarget.dataset.mode;
    console.log('选择阅读模式:', mode);
    
    this.setData({
      readingMode: mode,
      selectedOption: -1,
      showResult: false,
      showWordPopup: false
    });

    // 重置相关状态
    if (mode === 'vocabulary') {
      this.resetAnnotation();
    }
  },

  /**
   * 切换翻译显示
   */
  onToggleTranslation() {
    this.setData({
      showTranslation: !this.data.showTranslation
    });
  },

  /**
   * 高亮单词
   */
  onHighlightWord() {
    console.log('高亮目标单词');
    // 实现单词高亮逻辑
    wx.showToast({
      title: '已高亮目标单词',
      icon: 'success'
    });
  },

  /**
   * 朗读文章
   */
  onPlayPassage() {
    console.log('朗读文章');
    // 实现文章朗读逻辑
    wx.showToast({
      title: '开始朗读文章',
      icon: 'success'
    });
  },

  /**
   * 选择文本（显示词汇弹窗）
   */
  onSelectText(e) {
    // 模拟选择单词
    const selectedWord = {
      word: 'learning',
      phonetic: '/ˈlɜːrnɪŋ/',
      meaning: '学习；学问'
    };

    this.setData({
      selectedWord,
      showWordPopup: true,
      popupPosition: { x: 100, y: 200 } // 模拟位置
    });
  },

  /**
   * 播放弹窗单词音频
   */
  onPlayWordAudio() {
    console.log('播放弹窗单词音频');
    // 实现音频播放
  },

  /**
   * 添加到收藏
   */
  onAddToCollection() {
    console.log('添加到收藏');
    wx.showToast({
      title: '已添加到收藏',
      icon: 'success'
    });
    this.onClosePopup();
  },

  /**
   * 关闭弹窗
   */
  onClosePopup() {
    this.setData({
      showWordPopup: false
    });
  },

  /**
   * 选择选项
   */
  onSelectOption(e) {
    const index = e.currentTarget.dataset.index;
    console.log('选择选项:', index);
    
    this.setData({
      selectedOption: index
    });
  },

  /**
   * 标注单词
   */
  onAnnotateWord(e) {
    const index = e.currentTarget.dataset.index;
    const annotationText = [...this.data.annotationText];
    
    if (annotationText[index]) {
      annotationText[index].isAnnotated = !annotationText[index].isAnnotated;
      
      const annotatedCount = annotationText.filter(item => item.isAnnotated).length;
      const correctCount = annotationText.filter(item => item.isAnnotated && item.isTarget).length;
      const accuracy = annotatedCount > 0 ? Math.round((correctCount / annotatedCount) * 100) : 0;
      
      this.setData({
        annotationText,
        annotatedCount,
        accuracy
      });
    }
  },

  /**
   * 重置标注
   */
  onResetAnnotation() {
    const annotationText = this.data.annotationText.map(item => ({
      ...item,
      isAnnotated: false
    }));
    
    this.setData({
      annotationText,
      annotatedCount: 0,
      accuracy: 0
    });
  },

  /**
   * 检查标注
   */
  onCheckAnnotation() {
    const { annotationText, targetCount } = this.data;
    const correctCount = annotationText.filter(item => item.isAnnotated && item.isTarget).length;
    const incorrectCount = annotationText.filter(item => item.isAnnotated && !item.isTarget).length;
    
    const isCorrect = correctCount === targetCount && incorrectCount === 0;
    
    this.showResult(isCorrect, {
      reason: isCorrect ? '标注完全正确！' : '标注存在错误',
      suggestion: isCorrect ? '继续保持！' : '请仔细检查标注的单词'
    });
  },

  /**
   * 显示提示
   */
  onShowHint() {
    let hintText = '';
    
    switch (this.data.readingMode) {
      case 'context':
        hintText = '仔细阅读文章，理解单词在语境中的含义';
        break;
      case 'comprehension':
        hintText = '回到文章中寻找相关信息来回答问题';
        break;
      case 'vocabulary':
        hintText = `目标单词是 "${this.data.currentWord.word}"，请在文章中找出所有出现的位置`;
        break;
    }
    
    wx.showModal({
      title: '提示',
      content: hintText,
      showCancel: false
    });
  },

  /**
   * 提交答案
   */
  onSubmitAnswer() {
    let isCorrect = false;
    let errorAnalysis = {};
    
    switch (this.data.readingMode) {
      case 'context':
        // 语境阅读模式，直接完成
        this.completeCurrentWord();
        return;
        
      case 'comprehension':
        // 理解测试模式
        if (this.data.selectedOption === -1) {
          wx.showToast({
            title: '请选择一个答案',
            icon: 'none'
          });
          return;
        }
        
        isCorrect = this.data.selectedOption === this.data.currentQuestion.correctAnswer;
        errorAnalysis = {
          reason: isCorrect ? '理解正确！' : '理解有误，请重新阅读相关内容',
          suggestion: isCorrect ? '继续保持！' : '注意关键词和上下文关系'
        };
        break;
        
      case 'vocabulary':
        // 词汇标注模式
        const { annotationText, targetCount } = this.data;
        const correctCount = annotationText.filter(item => item.isAnnotated && item.isTarget).length;
        const incorrectCount = annotationText.filter(item => item.isAnnotated && !item.isTarget).length;
        
        isCorrect = correctCount === targetCount && incorrectCount === 0;
        errorAnalysis = {
          reason: isCorrect ? '标注完全正确！' : `正确标注${correctCount}个，错误标注${incorrectCount}个`,
          suggestion: isCorrect ? '继续保持！' : '请仔细检查每个标注的单词'
        };
        break;
    }
    
    this.showResult(isCorrect, errorAnalysis);
  },

  /**
   * 显示结果
   */
  showResult(isCorrect, errorAnalysis) {
    // 更新统计
    const stats = { ...this.data.stats };
    if (isCorrect) {
      stats.correctCount++;
    } else {
      stats.incorrectCount++;
    }
    stats.accuracy = Math.round((stats.correctCount / (stats.correctCount + stats.incorrectCount)) * 100);
    
    this.setData({
      showResultModal: true,
      showResult: true,
      isCorrect,
      errorAnalysis,
      stats
    });
  },

  /**
   * 播放结果音频
   */
  onPlayResultAudio() {
    this.onPlayAudio();
  },

  /**
   * 下一个单词
   */
  onNextWord() {
    this.setData({
      showResultModal: false
    });
    
    this.completeCurrentWord();
  },

  /**
   * 完成当前单词
   */
  completeCurrentWord() {
    const { currentIndex, totalWords, completedCount } = this.data;
    
    if (currentIndex + 1 >= totalWords) {
      // 完成所有单词
      this.completeReading();
    } else {
      // 继续下一个单词
      const newIndex = currentIndex + 1;
      const newCompletedCount = completedCount + 1;
      const progress = Math.round((newCompletedCount / totalWords) * 100);
      
      this.setData({
        currentIndex: newIndex,
        completedCount: newCompletedCount,
        progress,
        selectedOption: -1,
        showResult: false
      });
      
      // 加载下一个单词（这里应该从实际数据源获取）
      this.loadNextWord(newIndex);
    }
  },

  /**
   * 加载下一个单词
   */
  loadNextWord(index) {
    // 模拟加载下一个单词
    console.log('加载下一个单词:', index);
  },

  /**
   * 跳过单词
   */
  onSkipWord() {
    wx.showModal({
      title: '确认跳过',
      content: '确定要跳过当前单词吗？',
      success: (res) => {
        if (res.confirm) {
          this.completeCurrentWord();
        }
      }
    });
  },

  /**
   * 完成阅读
   */
  completeReading() {
    // 计算成就
    const achievements = this.calculateAchievements();
    
    this.setData({
      showCompleteModal: true,
      achievements
    });
    
    this.stopTimer();
  },

  /**
   * 计算成就
   */
  calculateAchievements() {
    const achievements = [];
    const { stats } = this.data;
    
    if (stats.accuracy >= 90) {
      achievements.push({ icon: '🏆', name: '阅读大师' });
    }
    if (stats.accuracy >= 80) {
      achievements.push({ icon: '⭐', name: '理解达人' });
    }
    if (stats.correctCount >= 5) {
      achievements.push({ icon: '📚', name: '勤奋学习' });
    }
    
    return achievements;
  },

  /**
   * 重新开始阅读
   */
  onRestartReading() {
    this.setData({
      showCompleteModal: false,
      currentIndex: 0,
      completedCount: 0,
      progress: 0,
      stats: {
        correctCount: 0,
        incorrectCount: 0,
        accuracy: 0
      },
      selectedOption: -1,
      showResult: false
    });
    
    this.initPageData();
    this.startTimer();
  },

  /**
   * 返回详情页
   */
  onBackToDetail() {
    wx.navigateBack();
  },

  /**
   * 显示帮助
   */
  onShowHelp() {
    this.setData({
      showHelpModal: true
    });
  },

  /**
   * 关闭帮助
   */
  onCloseHelp() {
    this.setData({
      showHelpModal: false
    });
  }
});