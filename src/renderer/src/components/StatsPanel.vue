<script setup>
import { onMounted } from 'vue'

// 定义组件的 emits 和 props
const emits = defineEmits(['loadArticle', 'reset'])
const props = defineProps({
  stats: Object
})

// 处理键盘事件
const handleKeyDown = (event) => {
  switch (event.key) {
    case 'F3':
      event.preventDefault()
      emits('reset')
      break
    case 'F4':
      event.preventDefault()
      emits('loadArticle')
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
      <el-button @click="emits('loadArticle')">载文</el-button>
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
