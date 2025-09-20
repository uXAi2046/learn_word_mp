// pages/wordbank/wordbank.js
Page({
  data: {
    // 筛选器状态
    selectedTextbook: '全部',
    selectedGrade: '全部', 
    selectedUnit: '全部',
    selectedImportance: '全部',
    searchKeyword: '',
    
    // 显示模式
    displayMode: 'list', // list | card
    sortBy: 'textbook', // textbook | alphabet | importance | favorite
    
    // 筛选选项
    textbookOptions: ['全部', '人教版', '外研版', '牛津版', '北师大版'],
    gradeOptions: ['全部', '七年级', '八年级', '九年级'],
    unitOptions: ['全部', 'Unit 1', 'Unit 2', 'Unit 3', 'Unit 4', 'Unit 5', 'Unit 6'],
    importanceOptions: ['全部', '必考', '常考', '了解'],
    
    // 单词数据
    wordList: [],
    filteredWordList: [],
    
    // 页面状态
    loading: false,
    showFilters: false,
    
    // 学习进度统计
    todayTarget: 20,
    todayLearned: 12,
    todayProgress: 60
  },

  onLoad() {
    this.initMockData()
    this.filterWords()
  },

  onShow() {
    // 刷新学习进度
    this.updateLearningProgress()
  },

  // 添加更多Mock数据以测试筛选功能
  initMockData() {
    const mockWords = [
      {
        id: 1,
        word: 'abandon',
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
        createdTime: '2024-01-15'
      },
      {
        id: 2,
        word: 'ability',
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
        createdTime: '2024-01-10'
      },
      {
        id: 3,
        word: 'about',
        translation: '关于，大约',
        partOfSpeech: 'prep.',
        exampleSentence: 'Tell me about your school.',
        exampleTranslation: '告诉我关于你学校的情况。',
        textbook: '外研版',
        grade: '七年级',
        unit: 'Unit 1',
        importance: '必考',
        isFavorite: true,
        masteryLevel: 95,
        lastReviewTime: '今天',
        createdTime: '2024-01-05'
      },
      {
        id: 4,
        word: 'excellent',
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
        createdTime: '2024-01-20'
      },
      {
        id: 5,
        word: 'magnificent',
        translation: '壮丽的，宏伟的',
        partOfSpeech: 'adj.',
        exampleSentence: 'The view from the mountain top was magnificent.',
        exampleTranslation: '山顶的景色非常壮丽。',
        textbook: '牛津版',
        grade: '九年级',
        unit: 'Unit 2',
        importance: '了解',
        isFavorite: true,
        masteryLevel: 30,
        lastReviewTime: '5天前',
        createdTime: '2024-01-25'
      },
      {
        id: 6,
        word: 'beautiful',
        translation: '美丽的，漂亮的',
        partOfSpeech: 'adj.',
        exampleSentence: 'What a beautiful day!',
        exampleTranslation: '多么美好的一天！',
        textbook: '外研版',
        grade: '七年级',
        unit: 'Unit 3',
        importance: '必考',
        isFavorite: true,
        masteryLevel: 90,
        lastReviewTime: '今天',
        createdTime: '2024-01-08'
      },
      {
        id: 7,
        word: 'computer',
        translation: '计算机，电脑',
        partOfSpeech: 'n.',
        exampleSentence: 'I use my computer every day.',
        exampleTranslation: '我每天都使用电脑。',
        textbook: '北师大版',
        grade: '八年级',
        unit: 'Unit 1',
        importance: '常考',
        isFavorite: false,
        masteryLevel: 75,
        lastReviewTime: '3天前',
        createdTime: '2024-01-12'
      },
      {
        id: 8,
        word: 'difficult',
        translation: '困难的，艰难的',
        partOfSpeech: 'adj.',
        exampleSentence: 'This math problem is very difficult.',
        exampleTranslation: '这道数学题很难。',
        textbook: '牛津版',
        grade: '八年级',
        unit: 'Unit 4',
        importance: '了解',
        isFavorite: false,
        masteryLevel: 55,
        lastReviewTime: '4天前',
        createdTime: '2024-01-18'
      }
    ]
    
    this.setData({
      wordList: mockWords
    })
  },

  // 更新学习进度
  updateLearningProgress() {
    const { wordList } = this.data
    const todayLearned = wordList.filter(word => word.lastReviewTime === '今天').length
    const todayProgress = Math.round((todayLearned / this.data.todayTarget) * 100)
    
    this.setData({
      todayLearned,
      todayProgress
    })
  },

  // 筛选单词
  filterWords() {
    const { 
      wordList, 
      selectedTextbook, 
      selectedGrade, 
      selectedUnit, 
      selectedImportance,
      searchKeyword,
      sortBy
    } = this.data
    
    let filtered = wordList.filter(word => {
      // 教材筛选
      if (selectedTextbook !== '全部' && word.textbook !== selectedTextbook) {
        return false
      }
      
      // 年级筛选
      if (selectedGrade !== '全部' && word.grade !== selectedGrade) {
        return false
      }
      
      // 单元筛选
      if (selectedUnit !== '全部' && word.unit !== selectedUnit) {
        return false
      }
      
      // 重要程度筛选
      if (selectedImportance !== '全部' && word.importance !== selectedImportance) {
        return false
      }
      
      // 搜索关键词 - 增强搜索逻辑
      if (searchKeyword) {
        const keyword = searchKeyword.toLowerCase()
        return word.word.toLowerCase().includes(keyword) || 
               word.translation.includes(searchKeyword) ||
               word.partOfSpeech.toLowerCase().includes(keyword) ||
               (word.exampleSentence && word.exampleSentence.toLowerCase().includes(keyword)) ||
               (word.exampleTranslation && word.exampleTranslation.includes(searchKeyword))
      }
      
      return true
    })
    
    // 排序
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'alphabet':
          return a.word.localeCompare(b.word)
        case 'importance':
          const importanceOrder = { '必考': 3, '常考': 2, '了解': 1 }
          return importanceOrder[b.importance] - importanceOrder[a.importance]
        case 'favorite':
          return b.isFavorite - a.isFavorite
        default: // textbook
          return a.createdTime.localeCompare(b.createdTime)
      }
    })
    
    this.setData({
      filteredWordList: filtered
    })
  },

  // 增强搜索功能，支持模糊匹配和多字段搜索
  onSearchInput(e) {
    const keyword = e.detail.value.trim()
    this.setData({
      searchKeyword: keyword
    })
    
    // 实时搜索，延迟300ms避免频繁触发
    clearTimeout(this.searchTimer)
    this.searchTimer = setTimeout(() => {
      this.filterWords()
    }, 300)
  },

  // 清空搜索
  clearSearch() {
    this.setData({
      searchKeyword: ''
    })
    this.filterWords()
  },

  // 切换筛选器显示
  toggleFilters() {
    this.setData({
      showFilters: !this.data.showFilters
    })
  },
  resetFilters() {
    this.setData({
      selectedTextbook: '全部',
      selectedGrade: '全部',
      selectedUnit: '全部',
      selectedImportance: '全部',
      searchKeyword: '',
      showFilters: false
    })
    this.filterWords()
  },

  // 应用筛选条件并关闭筛选器
  applyFilters() {
    this.setData({
      showFilters: false
    })
    this.filterWords()
  },

  // 选择教材
  onTextbookChange(e) {
    const selectedIndex = e.detail.value
    this.setData({
      selectedTextbook: this.data.textbookOptions[selectedIndex]
    })
    this.filterWords()
  },

  // 选择年级
  onGradeChange(e) {
    const selectedIndex = e.detail.value
    this.setData({
      selectedGrade: this.data.gradeOptions[selectedIndex]
    })
    this.filterWords()
  },

  // 选择单元
  onUnitChange(e) {
    const selectedIndex = e.detail.value
    this.setData({
      selectedUnit: this.data.unitOptions[selectedIndex]
    })
    this.filterWords()
  },

  // 选择重要程度
  onImportanceChange(e) {
    const selectedIndex = e.detail.value
    this.setData({
      selectedImportance: this.data.importanceOptions[selectedIndex]
    })
    this.filterWords()
  },

  // 切换显示模式
  toggleDisplayMode() {
    this.setData({
      displayMode: this.data.displayMode === 'list' ? 'card' : 'list'
    })
  },

  // 切换排序方式
  onSortChange(e) {
    this.setData({
      sortBy: e.currentTarget.dataset.sort
    })
    this.filterWords()
  },

  // 切换收藏状态
  toggleFavorite(e) {
    const wordId = e.currentTarget.dataset.id
    const { wordList } = this.data
    
    const updatedWordList = wordList.map(word => {
      if (word.id === wordId) {
        return { ...word, isFavorite: !word.isFavorite }
      }
      return word
    })
    
    this.setData({
      wordList: updatedWordList
    })
    this.filterWords()
  },

  // 查看单词详情
  viewWordDetail(e) {
    const wordId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/word-detail/word-detail?id=${wordId}`
    })
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.setData({ loading: true })
    
    // 模拟刷新数据
    setTimeout(() => {
      this.initMockData()
      this.filterWords()
      this.setData({ loading: false })
      wx.stopPullDownRefresh()
    }, 1000)
  }
})