<script setup>
import { ref, reactive, watch, nextTick } from 'vue'
import StatsPanel from './components/StatsPanel.vue'
import ArticlePanel from './components/ArticlePanel.vue'
import InputPanel from './components/InputPanel.vue'
import HistoryPanel from './components/HistoryPanel.vue'
import { useTyperStore } from './stores/typer'
import { storeToRefs } from 'pinia'
import { ElMessage } from 'element-plus'
import 'element-plus/theme-chalk/el-message.css'

// Store and refs
const store = useTyperStore()
const { inputText, articleInfo } = storeToRefs(store)

// Reactive state
const startTime = ref(null)
const isFinished = ref(false)
const stats = reactive({
  speed: 0,
  keysPerSecond: 0,
  keysPerChar: 0,
  correctionCount: 0,
  backspaceCount: 0,
  keyAccuracy: 0
})

// Refs and state
const inputPanelRef = ref(null)
const articlePanelRef = ref(null)
let timerInterval = null
let totalClicks = 0
let backspaceCount = 0

// Load article from clipboard
const loadArticle = async () => {
  try {
    const article = await navigator.clipboard.readText()
    store.loadArticle(article)
    reset()
    nextTick(() => inputPanelRef.value.focus())
    ElMessage.success('载文成功')
  } catch (error) {
    console.error(error)
    ElMessage.error('读取剪贴板失败')
  }
}

// Watch input text changes
watch(inputText, (newVal, oldVal) => {
  const newLength = newVal.length
  const oldLength = oldVal.length

  if (oldLength === 0 && newLength > 0 && !startTime.value) {
    startTyping()
  }

  if (newLength < oldLength) stats.correctionCount++

  if (newLength === articleInfo.value.count) {
    finishTyping()
  }

  handleAutoScroll(newLength)
})

// Start typing session
const startTyping = () => {
  startTime.value = new Date()
  timerInterval = setInterval(updateStats, 100)
}

// Finish typing session
const finishTyping = async () => {
  isFinished.value = true
  clearInterval(timerInterval)
  updateStats()
  await navigator.clipboard.writeText(getGrade())
}

// Handle auto-scroll
const handleAutoScroll = (newLength) => {
  const articleElement = articlePanelRef.value.getArticleElement()
  const charsElement = articlePanelRef.value.getContentElement()

  if (articleElement.clientHeight + articleElement.scrollTop === articleElement.scrollHeight) return

  if (newLength > 0 && newLength <= articleInfo.value.count) {
    const currentChar = charsElement[newLength - 1]
    if (currentChar) {
      const charRect = currentChar.getBoundingClientRect()
      const articleRect = articleElement.getBoundingClientRect()
      if (charRect.top > (articleRect.bottom - articleRect.top) / 1.5) {
        const lineHeight = parseFloat(window.getComputedStyle(currentChar).lineHeight)
        articleElement.scrollBy({ top: lineHeight, behavior: 'auto' })
      }
    }
  }
}

// Key event handlers
const onKeyUp = () => {
  backspaceCount++
  stats.backspaceCount = backspaceCount - stats.correctionCount
}

const onKeyDown = () => totalClicks++

// Reset everything
const reset = () => {
  store.clear()
  startTime.value = null
  isFinished.value = false
  totalClicks = 0
  backspaceCount = 0
  Object.assign(stats, {
    speed: 0,
    keysPerSecond: 0,
    keysPerChar: 0,
    correctionCount: 0,
    backspaceCount: 0,
    keyAccuracy: 0
  })
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
  nextTick(() => {
    inputPanelRef.value.focus()
    articlePanelRef.value.getArticleElement().scrollTop = 0
  })
}

// Update statistics
const updateStats = () => {
  const timePassed = new Date() - startTime.value
  const totalChars = inputText.value.length

  stats.speed = (totalChars / (timePassed / (1000 * 60))).toFixed(2)
  stats.keysPerSecond = (totalClicks / (timePassed / 1000)).toFixed(2)
  stats.keysPerChar = (totalClicks / totalChars).toFixed(2)
  // stats.keyAccuracy = (((totalClicks - backspaceCount) / totalClicks) * 100).toFixed(1)
}

// Get final grade
const getGrade = () => {
  return `第${articleInfo.value.segment}段 速度${stats.speed} 击键${stats.keysPerSecond} 码长${stats.keysPerChar} 回改${stats.correctionCount} 退格${stats.backspaceCount} 键数${totalClicks} 键准${stats.keyAccuracy}% 小马跟打器v0.1`
}
</script>

<template>
  <div class="container">
    <StatsPanel class="stats-panel" :stats="stats" @load-article="loadArticle" @reset="reset" />
    <div class="typing-panel">
      <ArticlePanel ref="articlePanelRef" />
      <InputPanel
        ref="inputPanelRef"
        :stats="stats"
        :is-finished="isFinished"
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
