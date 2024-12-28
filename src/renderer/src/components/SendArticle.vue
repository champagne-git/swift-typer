<script setup>
import { useTyperStore } from '../stores/typer'
import { storeToRefs } from 'pinia'

const store = useTyperStore()
const { dialogVisible } = storeToRefs(store)
</script>

<template>
  <el-dialog v-model="dialogVisible" title="Tips" width="500">
    <span>This is a message</span>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="dialogVisible = false"> Confirm </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped></style>
