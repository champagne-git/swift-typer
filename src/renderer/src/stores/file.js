import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'
const ipcRenderer = window.electron.ipcRenderer

export const useFileStore = defineStore('file', () => {
  const isSending = ref(false)
  const files = ref([])
  const currentFile = ref('')
  const selectedFileContent = ref('')
  const sendInfo = reactive({
    segmentIndex: 0,
    totalSegments: 0,
    segment: '',
    charsPerSegment: 100
  })

  // 每次读取的块大小（比如 1MB）
  const CHUNK_SIZE = 1024 * 1024

  // 获取文件列表
  const getFiles = async () => {
    files.value = await ipcRenderer.invoke('get-files')
  }

  const initialize = async () => {
    await getFiles()
    currentFile.value = files.value[0]
  }

  // 读取文件
  const readFile = async (filename) => {
    try {
      selectedFileContent.value = ''

      const fileInfo = await ipcRenderer.invoke('read-file-info', filename)
      const fileSize = fileInfo.size
      // fileEncoding.value = fileInfo.encoding

      for (let start = 0; start < fileSize; start += CHUNK_SIZE) {
        const end = Math.min(start + CHUNK_SIZE, fileSize)
        const chunk = await ipcRenderer.invoke(
          'read-file-chunk',
          filename,
          start,
          end,
          fileInfo.encoding
        )
        selectedFileContent.value += chunk.replace(/\s/g, '')
      }
      // console.log(selectedFileContent.value.length)
    } catch (error) {
      console.error('读取文件失败:', error)
    }
  }

  const getTextSegment = () => {
    const length = selectedFileContent.value.length
    sendInfo.totalSegments = Math.ceil(length / sendInfo.charsPerSegment)
    const start = sendInfo.segmentIndex * sendInfo.charsPerSegment
    const end = Math.min(start + sendInfo.charsPerSegment, length)
    sendInfo.segment = `${currentFile.value}\n${selectedFileContent.value.slice(start, end)}\n-----第${sendInfo.segmentIndex + 1}段 进度${start}/${length} 小马跟打器 1.0.0`
    // console.log(sendInfo)
  }

  return {
    isSending,
    files,
    currentFile,
    selectedFileContent,
    sendInfo,
    getFiles,
    readFile,
    initialize,
    getTextSegment
  }
})
