<script setup>
import { ref, reactive, watch, nextTick } from 'vue'
import StatsPanel from './components/StatsPanel.vue'
import ArticlePanel from './components/ArticlePanel.vue'
import InputPanel from './components/InputPanel.vue'
import HistoryPanel from './components/HistoryPanel.vue'

// 统计数据
const stats = reactive({
  startTime: null,
  isFinished: false,
  speed: 0,
  keysPerSecond: 0,
  keysPerChar: 0,
  correctionCount: 0,
  backspaceCount: 0,
  keyAccuracy: 0
})

// 文章信息
const articleInfo = reactive({
  content: '的一是了不在有个人这',
  count: 10,
  paragraph: 1
})

// 引用和状态
const inputPanelRef = ref(null)
const articlePanelRef = ref(null)
const inputText = ref('')
let timerInterval = null
let totalClicks = 0
let backspaceCount = 0

// 加载文章
const loadArticle = (article) => {
  Object.assign(articleInfo, article)
  reset()
  nextTick(() => {
    inputPanelRef.value.focus()
  })
}

// 监听输入文本变化
watch(inputText, async (newVal, oldVal) => {
  const newLength = newVal.length
  const oldLength = oldVal.length

  // 开始跟打
  if (oldLength === 0 && newLength > 0) {
    stats.startTime = new Date()
    timerInterval = setInterval(updateStats, 100)
  }

  // 回改
  if (newLength < oldLength) stats.correctionCount++

  // 结束跟打
  if (newLength === articleInfo.count) {
    stats.isFinished = true
    clearInterval(timerInterval)
    updateStats()
    await navigator.clipboard.writeText(getGrade())
  }

  // 自动滚动
  handleAutoScroll(newLength)
})

// 处理自动滚动
const handleAutoScroll = (newLength) => {
  const articleElement = articlePanelRef.value.getArticleElement()
  const charsElement = articlePanelRef.value.getContentElement()

  if (articleElement.clientHeight + articleElement.scrollTop === articleElement.scrollHeight) {
    return // 到底则不滚动
  }

  if (newLength > 0 && newLength <= articleInfo.count) {
    const currentChar = charsElement[newLength - 1]
    if (currentChar) {
      const charRect = currentChar.getBoundingClientRect()
      const articleRect = articleElement.getBoundingClientRect()

      if (charRect.top > (articleRect.bottom - articleRect.top) / 2) {
        const style = window.getComputedStyle(currentChar)
        const lineHeight = parseFloat(style.lineHeight)

        // 平滑滚动一行的距离
        articleElement.scrollBy({
          top: lineHeight,
          behavior: 'auto'
        })
      }
    }
  }
}

// 按键事件处理
const onKeyUp = () => {
  backspaceCount++
  stats.backspaceCount = backspaceCount - stats.correctionCount
}

const onKeyDown = () => totalClicks++

// 重置
const reset = () => {
  Object.assign(stats, {
    startTime: null,
    isFinished: false,
    speed: 0,
    keysPerSecond: 0,
    keysPerChar: 0,
    correctionCount: 0,
    backspaceCount: 0,
    keyAccuracy: 0
  })
  inputText.value = ''
  totalClicks = 0
  backspaceCount = 0
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
  // 自动获取焦点
  nextTick(() => {
    inputPanelRef.value.focus()
  })
  // 滚动条置顶
  articlePanelRef.value.getArticleElement().scrollTop = 0
}

// 更新统计数据
const updateStats = () => {
  const timePassed = new Date() - stats.startTime
  const totalChars = inputText.value.length

  stats.speed = (totalChars / (timePassed / (1000 * 60))).toFixed(2)
  stats.keysPerSecond = (totalClicks / (timePassed / 1000)).toFixed(2)
  stats.keysPerChar = (totalClicks / totalChars).toFixed(2)
  // stats.keyAccuracy = (((totalClicks - backspaceCount) / totalClicks) * 100).toFixed(1)
}

// 获取成绩
const getGrade = () => {
  return `第${articleInfo.paragraph}段 速度${stats.speed} 击键${stats.keysPerSecond} 码长${stats.keysPerChar} 回改${stats.correctionCount} 退格${stats.backspaceCount} 键数${totalClicks} 键准${stats.keyAccuracy}% 小马跟打器v0.1`
}
</script>

<template>
  <div class="container">
    <StatsPanel class="stats-panel" :stats="stats" @load-article="loadArticle" @reset="reset" />
    <div class="typing-panel">
      <ArticlePanel ref="articlePanelRef" :article-info="articleInfo" :input-text="inputText" />
      <InputPanel
        ref="inputPanelRef"
        v-model:input-text="inputText"
        :stats="stats"
        @on-key-up="onKeyUp"
        @on-key-down="onKeyDown"
      />
    </div>
    <HistoryPanel class="history-panel" />
  </div>
</template>

<style lang="scss">
.container {
  width: 100%;
  height: 100%;
  padding: 5px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: #f5f5f5;

  .stats-panel {
    height: 6%;
  }

  .typing-panel {
    height: 88%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .history-panel {
    height: 6%;
  }
}
</style>
