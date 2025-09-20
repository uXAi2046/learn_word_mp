// pages/word-detail/word-detail.js
Page({
  data: {
    wordId: null,
    wordInfo: null,
    loading: true,
    
    // 学习相关状态
    isPlaying: false,
    masteryLevel: 0,
    studyCount: 0,
    
    // 相关单词
    relatedWords: [],
    
    // 记忆技巧
    memoryTips: [],
    
    // 学习历史
    studyHistory: []
  },

  onLoad(options) {
    const { id } = options
    if (id) {
      this.setData({ wordId: id })
      this.loadWordDetail(id)
    } else {
      wx.showToast({
        title: '参数错误',
        icon: 'error'
      })
      setTimeout(() => {
        wx.navigateBack()
      }, 1500)
    }
  },

  // 加载单词详情
  loadWordDetail(wordId) {
    this.setData({ loading: true })
    
    // 模拟从单词库中获取数据
    const mockWordData = this.getMockWordData(wordId)
    
    if (mockWordData) {
      this.setData({
        wordInfo: mockWordData,
        masteryLevel: mockWordData.masteryLevel,
        studyCount: mockWordData.studyCount || 0,
        loading: false
      })
      
      // 加载相关数据
      this.loadRelatedWords(mockWordData.word)
      this.loadMemoryTips(mockWordData.word)
      this.loadStudyHistory(wordId)
    } else {
      wx.showToast({
        title: '单词不存在',
        icon: 'error'
      })
      setTimeout(() => {
        wx.navigateBack()
      }, 1500)
    }
  },

  // 获取Mock单词数据
  getMockWordData(wordId) {
    const mockWords = {
      '1': {
        id: 1,
        word: 'abandon',
        pronunciation: '/əˈbændən/',
        translation: '放弃，抛弃',
        partOfSpeech: 'v.',
        exampleSentence: 'Don\'t abandon hope.',
        exampleTranslation: '不要放弃希望。',
        textbook: '人教版',
        grade: '八年级',
        unit: 'Unit 1',
        importance: '常考',
        isFavorite: true,
        masteryLevel: 85,
        lastReviewTime: '2天前',
        studyCount: 12,
        definitions: [
          '放弃，抛弃（某人或某物）',
          '中止，停止（某项活动）',
          '沉溺于，放纵于'
        ],
        synonyms: ['desert', 'forsake', 'give up'],
        antonyms: ['keep', 'maintain', 'continue'],
        etymology: '来自古法语 abandoner，意为"交给，放弃"'
      },
      '2': {
        id: 2,
        word: 'ability',
        pronunciation: '/əˈbɪləti/',
        translation: '能力，才能',
        partOfSpeech: 'n.',
        exampleSentence: 'She has the ability to learn quickly.',
        exampleTranslation: '她有快速学习的能力。',
        textbook: '人教版',
        grade: '七年级',
        unit: 'Unit 2',
        importance: '必考',
        isFavorite: false,
        masteryLevel: 45,
        lastReviewTime: '从未',
        studyCount: 3,
        definitions: [
          '能力，本领',
          '才能，天赋',
          '技能，技巧'
        ],
        synonyms: ['capability', 'skill', 'talent'],
        antonyms: ['inability', 'incapacity'],
        etymology: '来自拉丁语 habilis，意为"容易处理的，有技能的"'
      },
      '3': {
        id: 3,
        word: 'excellent',
        pronunciation: '/ˈeksələnt/',
        translation: '优秀的，卓越的',
        partOfSpeech: 'adj.',
        exampleSentence: 'She is an excellent student.',
        exampleTranslation: '她是一个优秀的学生。',
        textbook: '人教版',
        grade: '八年级',
        unit: 'Unit 3',
        importance: '常考',
        isFavorite: false,
        masteryLevel: 70,
        lastReviewTime: '1天前',
        studyCount: 8,
        definitions: [
          '优秀的，杰出的',
          '极好的，出色的',
          '卓越的，超群的'
        ],
        synonyms: ['outstanding', 'superb', 'exceptional'],
        antonyms: ['poor', 'terrible', 'awful'],
        etymology: '来自拉丁语 excellere，意为"超越，胜过"'
      }
    }
    
    return mockWords[wordId]
  },

  // 加载相关单词
  loadRelatedWords(word) {
    // 模拟相关单词数据
    const relatedWords = [
      { word: 'desert', translation: '抛弃；沙漠', relation: '同义词' },
      { word: 'forsake', translation: '放弃，抛弃', relation: '同义词' },
      { word: 'keep', translation: '保持，保留', relation: '反义词' },
      { word: 'maintain', translation: '维持，保持', relation: '反义词' }
    ]
    
    this.setData({ relatedWords })
  },

  // 加载记忆技巧
  loadMemoryTips(word) {
    const memoryTips = [
      {
        type: '词根记忆',
        content: 'a- (离开) + band (绑) + -on → 解开绑定 → 放弃'
      },
      {
        type: '联想记忆',
        content: '想象一个人 abandon (放弃) 了一条被绑住的狗'
      },
      {
        type: '例句记忆',
        content: 'Never abandon hope, even in the darkest times.'
      }
    ]
    
    this.setData({ memoryTips })
  },

  // 加载学习历史
  loadStudyHistory(wordId) {
    const studyHistory = [
      { date: '2024-01-25', action: '查看详情', masteryBefore: 80, masteryAfter: 85 },
      { date: '2024-01-23', action: '答题练习', masteryBefore: 75, masteryAfter: 80 },
      { date: '2024-01-20', action: '首次学习', masteryBefore: 0, masteryAfter: 75 }
    ]
    
    this.setData({ studyHistory })
  },

  // 播放发音
  playPronunciation() {
    if (this.data.isPlaying) return
    
    this.setData({ isPlaying: true })
    
    // 模拟发音播放
    wx.showToast({
      title: '播放发音',
      icon: 'none',
      duration: 1000
    })
    
    // 实际项目中这里会调用语音合成API
    setTimeout(() => {
      this.setData({ isPlaying: false })
    }, 1000)
  },

  // 切换收藏状态
  toggleFavorite() {
    const { wordInfo } = this.data
    const newFavoriteStatus = !wordInfo.isFavorite
    
    this.setData({
      'wordInfo.isFavorite': newFavoriteStatus
    })
    
    wx.showToast({
      title: newFavoriteStatus ? '已收藏' : '已取消收藏',
      icon: 'success',
      duration: 1000
    })
    
    // 这里应该调用API更新收藏状态
  },

  // 更新掌握程度
  updateMasteryLevel(e) {
    const level = e.currentTarget.dataset.level
    const masteryLevel = parseInt(level)
    
    this.setData({
      masteryLevel,
      'wordInfo.masteryLevel': masteryLevel,
      studyCount: this.data.studyCount + 1
    })
    
    wx.showToast({
      title: '掌握程度已更新',
      icon: 'success'
    })
    
    // 记录学习行为
    this.recordStudyAction('更新掌握程度', masteryLevel)
  },

  // 记录学习行为
  recordStudyAction(action, newMastery) {
    const { studyHistory, masteryLevel } = this.data
    const newRecord = {
      date: new Date().toISOString().split('T')[0],
      action,
      masteryBefore: masteryLevel,
      masteryAfter: newMastery
    }
    
    studyHistory.unshift(newRecord)
    this.setData({ studyHistory })
  },

  // 开始练习
  startPractice() {
    const { wordId } = this.data
    wx.navigateTo({
      url: `/pages/word-practice/word-practice?id=${wordId}`
    })
  },

  // 查看相关单词
  viewRelatedWord(e) {
    const word = e.currentTarget.dataset.word
    wx.showToast({
      title: `查看单词: ${word}`,
      icon: 'none'
    })
  },

  // 分享单词
  shareWord() {
    const { wordInfo } = this.data
    return {
      title: `学习单词: ${wordInfo.word}`,
      path: `/pages/word-detail/word-detail?id=${wordInfo.id}`,
      imageUrl: '/images/share-word.png'
    }
  },

  // 页面分享
  onShareAppMessage() {
    return this.shareWord()
  },

  onShareTimeline() {
    return this.shareWord()
  }
})