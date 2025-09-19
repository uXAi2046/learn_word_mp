// pages/quiz/quiz.js
Page({
  data: {
    // 页面状态
    currentPage: 'mode-selection', // mode-selection, quiz-progress, quiz-result
    
    // 答题模式设置
    quizSettings: {
      questionCount: 10,
      difficulty: 'mixed',
      questionType: 'mixed',
      timeLimit: 'unlimited'
    },
    
    // 选择器数据
    questionCountRange: [5, 10, 15, 20, 30, 50],
    difficultyOptions: [
      { value: 'easy', label: '简单' },
      { value: 'medium', label: '中等' },
      { value: 'hard', label: '困难' },
      { value: 'mixed', label: '混合' }
    ],
    questionTypeOptions: [
      { value: 'choice', label: '选择题' },
      { value: 'fill', label: '填空题' },
      { value: 'mixed', label: '混合题型' }
    ],
    timeLimitOptions: [
      { value: 'unlimited', label: '无限制' },
      { value: '30', label: '30秒/题' },
      { value: '60', label: '60秒/题' },
      { value: '90', label: '90秒/题' }
    ],
    
    // 选择器索引
    questionTypeIndex: 2,
    difficultyIndex: 3,
    timeLimitIndex: 0,
    
    // 选择器显示数组
    questionTypes: ['选择题', '填空题', '混合题型'],
    difficulties: ['简单', '中等', '困难', '混合'],
    timeLimits: ['无限制', '30秒/题', '60秒/题', '90秒/题'],
    
    // 答题进度数据
    quizProgress: {
      currentQuestion: 1,
      totalQuestions: 10,
      timeElapsed: 0,
      accuracy: 100,
      correctCount: 0,
      wrongCount: 0,
      combo: 0
    },
    
    // 当前题目数据
    currentQuestionData: {
      type: 'choice', // choice, fill
      word: 'example',
      phonetic: '/ɪɡˈzæmpl/',
      meaning: '例子，实例',
      prompt: '请选择单词"example"的正确含义：',
      options: [
        { id: 'A', text: '例子，实例' },
        { id: 'B', text: '练习，训练' },
        { id: 'C', text: '考试，测验' },
        { id: 'D', text: '经验，体验' }
      ],
      correctAnswer: 'A',
      explanation: 'Example 意为"例子，实例"，常用于举例说明。',
      exampleSentence: {
        en: 'This is a good example of modern art.',
        zh: '这是现代艺术的一个好例子。'
      },
      memoryTip: '记忆技巧：ex(出来) + ample(充足的) = 拿出充足的例子'
    },
    
    // 用户答案和反馈
    userAnswer: '',
    selectedOption: '',
    showFeedback: false,
    isCorrect: false,
    
    // 答题结果数据
    quizResult: {
      totalQuestions: 10,
      correctCount: 8,
      accuracy: 80,
      totalTime: 180,
      averageTime: 18,
      rating: 4,
      analysis: {
        nounAccuracy: 85,
        verbAccuracy: 75,
        adjectiveAccuracy: 90,
        errorCount: 2
      }
    },
    
    // 定时器
    timer: null,
    
    // 题库数据（示例）
    questionBank: [
      {
        id: 1,
        type: 'choice',
        word: 'apple',
        phonetic: '/ˈæpl/',
        meaning: '苹果',
        options: [
          { id: 'A', text: '苹果' },
          { id: 'B', text: '橙子' },
          { id: 'C', text: '香蕉' },
          { id: 'D', text: '葡萄' }
        ],
        correctAnswer: 'A',
        difficulty: 'easy',
        pos: 'noun',
        explanation: 'Apple 是一种常见的水果，营养丰富。',
        exampleSentence: {
          en: 'I eat an apple every day.',
          zh: '我每天吃一个苹果。'
        }
      },
      {
        id: 2,
        type: 'choice',
        word: 'beautiful',
        phonetic: '/ˈbjuːtɪfl/',
        meaning: '美丽的',
        options: [
          { id: 'A', text: '美丽的' },
          { id: 'B', text: '丑陋的' },
          { id: 'C', text: '普通的' },
          { id: 'D', text: '奇怪的' }
        ],
        correctAnswer: 'A',
        difficulty: 'medium',
        pos: 'adjective',
        explanation: 'Beautiful 用来形容外观或事物的美丽。',
        exampleSentence: {
          en: 'She has beautiful eyes.',
          zh: '她有一双美丽的眼睛。'
        }
      },
      {
        id: 3,
        type: 'choice',
        word: 'happy',
        phonetic: '/ˈhæpi/',
        meaning: '快乐的',
        options: [
          { id: 'A', text: '悲伤的' },
          { id: 'B', text: '快乐的' },
          { id: 'C', text: '愤怒的' },
          { id: 'D', text: '害怕的' }
        ],
        correctAnswer: 'B',
        difficulty: 'easy',
        pos: 'adjective',
        explanation: 'Happy 表示快乐、高兴的情绪状态。',
        exampleSentence: {
          en: 'I am happy to see you.',
          zh: '见到你我很高兴。'
        }
      },
      {
        id: 4,
        type: 'choice',
        word: 'computer',
        phonetic: '/kəmˈpjuːtər/',
        meaning: '计算机',
        options: [
          { id: 'A', text: '电视机' },
          { id: 'B', text: '收音机' },
          { id: 'C', text: '计算机' },
          { id: 'D', text: '电话机' }
        ],
        correctAnswer: 'C',
        difficulty: 'easy',
        pos: 'noun',
        explanation: 'Computer 是现代生活中重要的电子设备。',
        exampleSentence: {
          en: 'I use my computer for work.',
          zh: '我用电脑工作。'
        }
      },
      {
        id: 5,
        type: 'choice',
        word: 'important',
        phonetic: '/ɪmˈpɔːrtənt/',
        meaning: '重要的',
        options: [
          { id: 'A', text: '重要的' },
          { id: 'B', text: '无关紧要的' },
          { id: 'C', text: '困难的' },
          { id: 'D', text: '简单的' }
        ],
        correctAnswer: 'A',
        difficulty: 'medium',
        pos: 'adjective',
        explanation: 'Important 表示某事物具有重要性或意义。',
        exampleSentence: {
          en: 'Education is very important.',
          zh: '教育非常重要。'
        }
      },
      {
        id: 6,
        type: 'choice',
        word: 'friend',
        phonetic: '/frend/',
        meaning: '朋友',
        options: [
          { id: 'A', text: '敌人' },
          { id: 'B', text: '朋友' },
          { id: 'C', text: '陌生人' },
          { id: 'D', text: '老师' }
        ],
        correctAnswer: 'B',
        difficulty: 'easy',
        pos: 'noun',
        explanation: 'Friend 指与你关系亲密、互相信任的人。',
        exampleSentence: {
          en: 'She is my best friend.',
          zh: '她是我最好的朋友。'
        }
      },
      {
        id: 7,
        type: 'choice',
        word: 'difficult',
        phonetic: '/ˈdɪfɪkəlt/',
        meaning: '困难的',
        options: [
          { id: 'A', text: '简单的' },
          { id: 'B', text: '困难的' },
          { id: 'C', text: '有趣的' },
          { id: 'D', text: '无聊的' }
        ],
        correctAnswer: 'B',
        difficulty: 'medium',
        pos: 'adjective',
        explanation: 'Difficult 表示某事物不容易完成或理解。',
        exampleSentence: {
          en: 'This math problem is difficult.',
          zh: '这道数学题很难。'
        }
      },
      {
        id: 8,
        type: 'choice',
        word: 'water',
        phonetic: '/ˈwɔːtər/',
        meaning: '水',
        options: [
          { id: 'A', text: '火' },
          { id: 'B', text: '土' },
          { id: 'C', text: '水' },
          { id: 'D', text: '空气' }
        ],
        correctAnswer: 'C',
        difficulty: 'easy',
        pos: 'noun',
        explanation: 'Water 是生命必需的液体物质。',
        exampleSentence: {
          en: 'I drink water every day.',
          zh: '我每天都喝水。'
        }
      },
      {
        id: 9,
        type: 'choice',
        word: 'interesting',
        phonetic: '/ˈɪntrəstɪŋ/',
        meaning: '有趣的',
        options: [
          { id: 'A', text: '无聊的' },
          { id: 'B', text: '有趣的' },
          { id: 'C', text: '困难的' },
          { id: 'D', text: '简单的' }
        ],
        correctAnswer: 'B',
        difficulty: 'medium',
        pos: 'adjective',
        explanation: 'Interesting 表示能够引起兴趣或注意的。',
        exampleSentence: {
          en: 'This book is very interesting.',
          zh: '这本书很有趣。'
        }
      },
      {
        id: 10,
        type: 'choice',
        word: 'family',
        phonetic: '/ˈfæməli/',
        meaning: '家庭',
        options: [
          { id: 'A', text: '学校' },
          { id: 'B', text: '公司' },
          { id: 'C', text: '家庭' },
          { id: 'D', text: '医院' }
        ],
        correctAnswer: 'C',
        difficulty: 'easy',
        pos: 'noun',
        explanation: 'Family 指由血缘或婚姻关系组成的群体。',
        exampleSentence: {
          en: 'I love my family very much.',
          zh: '我非常爱我的家人。'
        }
      }
    ]
  },

  onLoad(options) {
    console.log('Quiz page loaded with options:', options);
    this.initQuizData();
  },

  // 初始化答题数据
  initQuizData() {
    // 可以从本地存储或服务器获取题库数据
    this.generateQuestions();
  },

  // 生成题目
  generateQuestions() {
    const { questionCount, difficulty, questionType } = this.data.quizSettings;
    // 这里应该根据设置生成相应的题目
    // 暂时使用示例数据
    console.log('Generating questions with settings:', this.data.quizSettings);
  },

  // 开始快速答题
  startQuickQuiz() {
    this.setData({
      currentPage: 'quiz-progress',
      'quizSettings.questionCount': 10,
      'quizSettings.difficulty': 'mixed',
      'quizSettings.questionType': 'mixed'
    });
    this.startQuiz();
  },

  // 开始无尽模式
  startEndlessMode() {
    this.setData({
      currentPage: 'quiz-progress',
      'quizSettings.questionCount': 999,
      'quizSettings.difficulty': 'mixed',
      'quizSettings.questionType': 'mixed'
    });
    this.startQuiz();
  },

  // 开始自定义答题
  startCustomQuiz() {
    this.setData({
      currentPage: 'quiz-progress'
    });
    this.startQuiz();
  },

  // 开始答题
  startQuiz() {
    // 从题库中随机选择题目
    const shuffledQuestions = this.data.questionBank.sort(() => Math.random() - 0.5);
    const selectedQuestions = shuffledQuestions.slice(0, this.data.quizSettings.questionCount);
    
    this.setData({
      questions: selectedQuestions,
      'quizProgress.currentQuestion': 1,
      'quizProgress.totalQuestions': selectedQuestions.length,
      'quizProgress.timeElapsed': 0,
      'quizProgress.accuracy': 100,
      'quizProgress.correctCount': 0,
      'quizProgress.wrongCount': 0,
      'quizProgress.combo': 0,
      showFeedback: false,
      userAnswer: '',
      selectedOption: ''
    });
    
    this.loadNextQuestion();
    this.startTimer();
  },

  // 加载下一题
  loadNextQuestion() {
    const { questions, quizProgress } = this.data;
    const currentIndex = quizProgress.currentQuestion - 1;
    
    if (currentIndex < questions.length) {
      const questionData = questions[currentIndex];
      this.setData({
        currentQuestionData: questionData,
        userAnswer: '',
        selectedOption: '',
        showFeedback: false
      });
    } else {
      // 所有题目完成，结束答题
      this.finishQuiz();
    }
  },

  // 开始计时
  startTimer() {
    if (this.data.timer) {
      clearInterval(this.data.timer);
    }
    
    const timer = setInterval(() => {
      this.setData({
        'quizProgress.timeElapsed': this.data.quizProgress.timeElapsed + 1
      });
    }, 1000);
    
    this.setData({ timer });
  },

  // 停止计时
  stopTimer() {
    if (this.data.timer) {
      clearInterval(this.data.timer);
      this.setData({ timer: null });
    }
  },

  // 设置选项变化
  onQuestionCountChange(e) {
    const index = e.detail.value;
    this.setData({
      'quizSettings.questionCount': this.data.questionCountRange[index]
    });
  },

  onDifficultyChange(e) {
    const index = e.detail.value;
    this.setData({
      'quizSettings.difficulty': this.data.difficultyOptions[index].value
    });
  },

  onQuestionTypeChange(e) {
    const index = e.detail.value;
    this.setData({
      'quizSettings.questionType': this.data.questionTypeOptions[index].value
    });
  },

  onTimeLimitChange(e) {
    const index = e.detail.value;
    this.setData({
      'quizSettings.timeLimit': this.data.timeLimitOptions[index].value
    });
  },

  // 选择选项
  // 选择选项
  selectOption(e) {
    const optionId = e.currentTarget.dataset.option;
    this.setData({
      selectedOption: optionId
    });
  },

  // 输入答案
  onAnswerInput(e) {
    this.setData({
      userAnswer: e.detail.value
    });
  },

  // 播放发音
  playPronunciation() {
    // 这里应该调用语音合成API
    wx.showToast({
      title: '播放发音',
      icon: 'none'
    });
  },

  // 提交答案
  submitAnswer() {
    const { currentQuestionData, selectedOption, userAnswer, showFeedback } = this.data;
    
    // 如果已经显示反馈，则进入下一题
    if (showFeedback) {
      this.nextQuestion();
      return;
    }
    
    // 检查是否已选择答案
    if (currentQuestionData.type === 'choice' && !selectedOption) {
      wx.showToast({
        title: '请选择答案',
        icon: 'none'
      });
      return;
    }
    
    if (currentQuestionData.type === 'fill' && !userAnswer.trim()) {
      wx.showToast({
        title: '请输入答案',
        icon: 'none'
      });
      return;
    }
    
    let isCorrect = false;
    
    if (currentQuestionData.type === 'choice') {
      isCorrect = selectedOption === currentQuestionData.correctAnswer;
    } else if (currentQuestionData.type === 'fill') {
      isCorrect = userAnswer.toLowerCase().trim() === currentQuestionData.correctAnswer.toLowerCase();
    }
    
    this.setData({
      isCorrect,
      showFeedback: true
    });
    
    this.updateProgress(isCorrect);
  },

  // 更新答题进度
  updateProgress(isCorrect) {
    const progress = this.data.quizProgress;
    if (isCorrect) {
      progress.correctCount++;
      progress.combo++;
    } else {
      progress.wrongCount++;
      progress.combo = 0;
    }
    
    // 计算正确率：已回答题目总数 = 正确数 + 错误数
    const answeredQuestions = progress.correctCount + progress.wrongCount;
    progress.accuracy = answeredQuestions > 0 ? Math.round((progress.correctCount / answeredQuestions) * 100) : 100;
    
    // 计算进度百分比
    const progressPercent = Math.round((progress.currentQuestion - 1) / progress.totalQuestions * 100);
    
    this.setData({
      quizProgress: progress,
      progressPercent: progressPercent
    });
  },

  // 下一题
  nextQuestion() {
    const progress = this.data.quizProgress;
    
    if (progress.currentQuestion >= progress.totalQuestions) {
      this.finishQuiz();
      return;
    }
    
    progress.currentQuestion++;
    
    // 计算进度百分比
    const progressPercent = Math.round((progress.currentQuestion - 1) / progress.totalQuestions * 100);
    
    this.setData({
      quizProgress: progress,
      progressPercent: progressPercent
    });
    
    this.loadNextQuestion();
  },

  // 跳过当前题
  skipQuestion() {
    this.setData({
      isCorrect: false,
      showFeedback: true
    });
    
    this.updateProgress(false);
    
    setTimeout(() => {
      this.nextQuestion();
    }, 1000);
  },

  // 完成答题
  finishQuiz() {
    this.stopTimer();
    
    const { quizProgress } = this.data;
    
    // 计算词性分析数据
    const analysis = {
      nounAccuracy: 85,
      verbAccuracy: 75,
      adjectiveAccuracy: 90,
      errorCount: quizProgress.wrongCount
    };
    
    const result = {
      totalQuestions: quizProgress.totalQuestions,
      correctCount: quizProgress.correctCount,
      accuracy: quizProgress.accuracy,
      totalTime: quizProgress.timeElapsed,
      averageTime: Math.round(quizProgress.timeElapsed / quizProgress.totalQuestions),
      rating: this.calculateRating(quizProgress.accuracy),
      analysis: analysis
    };
    
    this.setData({
      currentPage: 'quiz-result',
      quizResult: result
    });
  },

  // 计算评级
  calculateRating(accuracy) {
    if (accuracy >= 90) return 5;
    if (accuracy >= 80) return 4;
    if (accuracy >= 70) return 3;
    if (accuracy >= 60) return 2;
    return 1;
  },

  // 重新开始
  // 重新开始答题
  restartQuiz() {
    // 重置所有数据
    this.setData({
      currentPage: 'mode-selection',
      quizProgress: {
        currentQuestion: 1,
        totalQuestions: 10,
        timeElapsed: 0,
        accuracy: 100,
        correctCount: 0,
        wrongCount: 0,
        combo: 0
      },
      userAnswer: '',
      selectedOption: '',
      showFeedback: false,
      isCorrect: false
    });
    
    // 停止计时器
    this.stopTimer();
  },

  // 查看错题
  viewErrors() {
    wx.navigateTo({
      url: '/pages/errors/errors'
    });
  },

  // 返回首页
  backToHome() {
    wx.switchTab({
      url: '/pages/index/index'
    });
  },

  // 继续学习
  continueStudy() {
    wx.switchTab({
      url: '/pages/study/study'
    });
  },

  onShow() {
    
  },

  onUnload() {
    this.stopTimer();
  }
})