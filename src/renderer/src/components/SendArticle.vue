<script setup>
// import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useTyperStore } from '../stores/typer'
import { useFileStore } from '../stores/file'

const store = useTyperStore()
const { dialogVisible } = storeToRefs(store)

const fileStore = useFileStore()
const { isSending, currentFile, sendInfo } = storeToRefs(fileStore)

const handleChange = async (value) => {
  await fileStore.readFile(value)
  fileStore.getTextSegment()
}

const send = async () => {
  dialogVisible.value = false
  await navigator.clipboard.writeText(sendInfo.value.segment)
  store.loadArticle(sendInfo.value.segment)
  isSending.value = true
}
</script>

<template>
  <el-dialog v-model="dialogVisible" title="发文" width="70%">
    <div class="file-reader">
      <el-select v-model="currentFile" placeholder="Select" @change="handleChange">
        <el-option
          v-for="(file, index) in fileStore.files"
          :key="index"
          :label="file"
          :value="file"
        />
      </el-select>
      <el-slider
        v-model="sendInfo.charsPerSegment"
        :step="50"
        :min="50"
        :max="2000"
        @change="
          () => {
            fileStore.getTextSegment()
          }
        "
      />
    </div>
    <div class="content">{{ sendInfo.segment }}</div>
    <el-slider
      v-model="sendInfo.segmentIndex"
      :max="sendInfo.totalSegments"
      show-input
      @change="
        () => {
          fileStore.getTextSegment()
        }
      "
    />
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="send">发文</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.el-dialog {
  .content {
    height: 30vh;
    margin-top: 10px;
    overflow-y: auto;
  }
}
</style>
