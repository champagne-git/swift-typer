import { ref, reactive } from 'vue'
import { defineStore } from 'pinia'

export const useTyperStore = defineStore('typer', () => {
  // 文章信息
  const articleInfo = reactive({
    content: '的一是了不在有个人这',
    count: 10,
    segment: 1
  })

  // 输入文本
  const inputText = ref('')

  // 从剪贴板加载文章
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

  // 重置输入
  const clear = () => (inputText.value = '')

  return { articleInfo, inputText, loadArticle, clear }
})
