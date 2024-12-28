<script setup>
import { useTyperStore } from '../stores/typer'
import { storeToRefs } from 'pinia'

const store = useTyperStore()
const { drawer, dialogVisible } = storeToRefs(store)

// 定义组件的 emits 和 props
const emits = defineEmits(['loadArticle', 'reset'])
const props = defineProps({
  stats: Object
})
</script>

<template>
  <div class="stats-wrapper">
    <div class="settings">
      <el-button @click="drawer = true">设置</el-button>
      <el-button @click="dialogVisible = true">发文</el-button>
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
