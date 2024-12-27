<script setup>
import { onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import 'element-plus/theme-chalk/el-message.css'

// 定义组件的 emits 和 props
const emits = defineEmits(['loadArticle', 'reset'])
const props = defineProps({
  stats: Object
})

// 从剪贴板加载文章
const loadArticle = async () => {
  try {
    const article = await navigator.clipboard.readText()
    const splitArticle = article.trim().split(/\r\n|\n|\r/)

    if (!splitArticle[0]) {
      return ElMessage.warning('剪贴板为空')
    }

    const articleInfo = {
      content: '',
      count: null,
      paragraph: 0
    }

    if (!splitArticle[1]) {
      articleInfo.content = splitArticle[0]
      articleInfo.count = splitArticle[0].length
    } else {
      articleInfo.content = splitArticle[1]
      articleInfo.count = splitArticle[1].length
      articleInfo.paragraph = extractSegmentNumber(splitArticle[2])
    }

    emits('loadArticle', articleInfo)
    // ElMessage.success('载文成功')
  } catch (error) {
    ElMessage.error('读取剪贴板失败')
  }
}

// 提取段落编号
const extractSegmentNumber = (str) => {
  const match = str.match(/第(\d+)段/)
  return match ? match[1] : null
}

// 处理键盘事件
const handleKeyDown = (event) => {
  switch (event.key) {
    case 'F3':
      event.preventDefault()
      emits('reset')
      break
    case 'F4':
      event.preventDefault()
      loadArticle()
      break
  }
}

// 组件挂载时添加键盘事件监听
onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})
</script>

<template>
  <div class="stats-wrapper">
    <div class="settings">
      <el-button>设置</el-button>
      <el-button @click="loadArticle">载文</el-button>
      <el-button @click="emits('reset')">重打</el-button>
    </div>
    <div class="stats">
      <span>{{ props.stats.speed || '速度' }}</span>
      <span>{{ props.stats.keysPerSecond || '击键' }}</span>
      <span>{{ props.stats.keysPerChar || '码长' }}</span>
      <span>{{ props.stats.keyAccuracy || '键准' }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.stats-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  color: #333333;
  margin-bottom: 5px;
  border-radius: 5px;

  .stats span {
    margin-right: 50px;
  }
}
</style>
