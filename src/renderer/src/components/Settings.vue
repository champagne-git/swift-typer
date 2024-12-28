<script setup>
import { useTyperStore } from '../stores/typer'
import { storeToRefs } from 'pinia'

const store = useTyperStore()
const { drawer } = storeToRefs(store)
</script>

<template>
  <el-drawer v-model="drawer" title="设置" direction="ltr">
    <span>。。。</span>
  </el-drawer>
</template>

<style lang="scss" scoped></style>
