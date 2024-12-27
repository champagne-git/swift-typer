<script setup>
import { ref, computed } from 'vue'

// 定义组件的 emits 和 props
const emits = defineEmits(['update:inputText', 'onKeyUp', 'onKeyDown'])
const props = defineProps({
  inputText: String,
  stats: Object
})

// 创建计算属性，用于双向绑定
const value = computed({
  get: () => props.inputText,
  set: (newValue) => emits('update:inputText', newValue)
})

// 处理键盘抬起事件
const onKeyUp = (event) => {
  if (event.key === 'Backspace') {
    emits('onKeyUp')
  }
}

// 创建对 textarea 元素的引用
const textareaRef = ref(null)

// 暴露组件方法
defineExpose({
  // 聚焦输入框
  focus: () => {
    textareaRef.value.focus()
  },
  // 获取输入元素
  getInputElement: () => textareaRef.value
})
</script>

<template>
  <div class="input-wrapper">
    <textarea
      ref="textareaRef"
      v-model="value"
      placeholder="在这里开始输入..."
      :disabled="props.stats.isFinished"
      @keyup="onKeyUp"
      @keydown="emits('onKeyDown')"
      @paste="(e) => e.preventDefault()"
    ></textarea>
  </div>
</template>

<style scoped lang="scss">
.input-wrapper {
  flex: 1;
  border: 1px solid #cecece;
  border-radius: 5px;
  font-size: 35px;
  line-height: 1.6;
  color: #333333;
  padding: 5px;
  margin-bottom: 5px;

  textarea {
    width: 100%;
    height: 98%;
    border: none;
    outline: none;
    resize: none;
    font-size: inherit;
    font-family: inherit;
    background-color: transparent;
  }
}
</style>
