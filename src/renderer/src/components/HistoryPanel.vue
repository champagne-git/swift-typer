<script setup>
import { storeToRefs } from 'pinia'
import { useTyperStore } from '../stores/typer'
import { useFileStore } from '../stores/file'
const store = useTyperStore()

const fileStore = useFileStore()
const { isSending } = storeToRefs(fileStore)
</script>

<template>
  <div class="history-panel">
    <div class="history">
      <span>今日打了：{{ store.history.today }}字</span>
      <span>一共打了：{{ store.history.total }}字</span>
    </div>
    <div class="is-sending">
      <!-- <el-button v-if="isSending" size="small" @click="isSending = false">结束发文</el-button> -->
      <span>{{ isSending ? '正在发文中' : '' }} </span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.history-panel {
  color: #333333;
  border: 1px solid #cecece;
  margin-bottom: 5px;
  border-radius: 5px;
  padding: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .history {
    span {
      margin-right: 15px;
      font-size: 14px;
      font-weight: 500;
      padding: 3px 8px;
      border-radius: 3px;

      &:last-child {
        margin-right: 0;
      }
    }
  }

  .is-sending {
    display: flex;
    align-items: center;
    color: rgb(255, 128, 0);
    span {
      margin-left: 10px;
    }
  }
}
</style>
