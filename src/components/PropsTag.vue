<template>
  <n-tag :bordered="false" size="small">
    {{ text }}
  </n-tag>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { priorityOptions } from '@/config'

interface Props {
  propName: number;
}
const props = defineProps<Props>()

const text = computed(() => {
  let t
  priorityOptions.map(item => {
    if (item.value === props.propName) {
      t = item.label
    }
  })
  return t
})
</script>

<style lang="scss" scoped></style>
