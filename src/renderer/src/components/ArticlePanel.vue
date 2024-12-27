<script setup>
import { reactive, ref } from 'vue'

// 定义组件的 emits 和 props
const props = defineProps({
  articleInfo: Object,
  inputText: String
})

// 获取字符的样式类
const getCharClass = (index) => {
  if (index < props.inputText.length) {
    return props.inputText[index] === props.articleInfo.content[index] ? 'correct' : 'error'
  }
  return ''
}

// 文章元素的引用
const articleRef = ref(null)

// 存储每个字符元素的引用
const charRefs = reactive({})

// 暴露组件方法
defineExpose({
  getArticleElement: () => articleRef.value,
  getContentElement: () => charRefs
})
</script>

<template>
  <div ref="articleRef" class="article-wrapper">
    <span
      v-for="(char, index) in props.articleInfo.content"
      :ref="
        (el) => {
          if (el) charRefs[index] = el
        }
      "
      :key="index"
      :class="getCharClass(index)"
      >{{ char }}</span
    >
  </div>
</template>

<style scoped lang="scss">
.article-wrapper {
  flex: 2;
  font-size: 35px;
  line-height: 1.6;
  overflow-y: auto;
  color: #333333;
  border: 1px solid #cecece;
  margin-bottom: 5px;
  border-radius: 5px;
  padding: 5px;

  span {
    &.correct {
      background-color: #adadad;
    }

    &.error {
      background-color: #ff7a7a;
    }
  }
}
</style>
