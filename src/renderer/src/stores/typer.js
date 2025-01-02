import { ref, reactive } from 'vue'
import { defineStore } from 'pinia'

export const useTyperStore = defineStore('typer', () => {
  // 文章信息
  const articleInfo = reactive({
    content: '',
    count: 0,
    segment: 0
  })

  // 输入文本
  const inputText = ref('')

  // 抽屉
  const drawer = ref(false)

  // 发文
  const dialogVisible = ref(false)

  // 历史记录
  const history = reactive({
    total: 0,
    today: 0,
    lastSavedDate: ''
  })

  // 加载文章
  const loadArticle = (article) => {
    const splitArticle = article.trim().split(/\r\n|\n|\r/)

    if (splitArticle.length === 1) {
      setArticleContent(splitArticle[0])
    } else {
      setArticleContent(splitArticle[1])
      articleInfo.segment = extractSegmentNumber(splitArticle[2])
    }
  }

  // 设置文章内容
  const setArticleContent = (content) => {
    articleInfo.content = content
    articleInfo.count = content.length
  }

  // 提取段落编号
  const extractSegmentNumber = (str) => {
    const match = str.match(/第(\d+)段/)
    return match ? parseInt(match[1]) : 1
  }

  // 乱序
  const shuffle = () => {
    const text = articleInfo.content
      .split('')
      .sort(() => Math.random() - 0.5)
      .join('')
    articleInfo.content = text
  }

  // 更新历史记录
  const updateHistory = (value = 0) => {
    history.total += value

    const today = new Date().toDateString()
    if (today !== history.lastSavedDate) {
      history.today = 0
      history.lastSavedDate = today
    }
    history.today += value
    localStorage.setItem('history', JSON.stringify(history))
  }

  const readHistory = () => {
    const savedData = JSON.parse(localStorage.getItem('history') || '{}')
    Object.assign(history, savedData)
    const today = new Date().toDateString()
    if (today !== history.lastSavedDate) {
      history.today = 0
      history.lastSavedDate = today
    }
  }

  return {
    articleInfo,
    inputText,
    drawer,
    dialogVisible,
    history,
    loadArticle,
    shuffle,
    updateHistory,
    readHistory
  }
})
