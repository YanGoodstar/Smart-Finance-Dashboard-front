<script setup lang="ts">
import { computed } from 'vue'
import { categorySourceLabel, importStatusLabel, warningLabel } from '@/utils/format'

const props = withDefaults(
  defineProps<{
    value?: string | null
    mode?: 'warning' | 'source' | 'health' | 'duplicate' | 'import-status'
  }>(),
  {
    value: null,
    mode: 'warning',
  },
)

const type = computed(() => {
  if (props.mode === 'source') {
    if (props.value === 'AUTO') return 'success'
    if (props.value === 'MANUAL') return 'warning'
    return 'info'
  }
  if (props.mode === 'health') {
    return props.value === 'UP' ? 'success' : props.value === 'DOWN' ? 'danger' : 'info'
  }
  if (props.mode === 'duplicate') {
    return props.value === 'YES' ? 'warning' : 'info'
  }
  if (props.mode === 'import-status') {
    if (props.value === 'SUCCESS') return 'success'
    if (props.value === 'PARTIAL_SUCCESS') return 'warning'
    if (props.value === 'FAILED') return 'danger'
    return 'info'
  }
  if (props.value === 'OVER_BUDGET') return 'danger'
  if (props.value === 'NEAR_LIMIT') return 'warning'
  if (props.value === 'NORMAL') return 'success'
  return 'info'
})

const label = computed(() => {
  if (props.mode === 'source') {
    return categorySourceLabel(props.value)
  }
  if (props.mode === 'health') {
    if (props.value === 'UP') return '后端正常'
    if (props.value === 'DOWN') return '接口异常'
    return '状态未知'
  }
  if (props.mode === 'duplicate') {
    return props.value === 'YES' ? '疑似重复' : '正常'
  }
  if (props.mode === 'import-status') {
    return importStatusLabel(props.value)
  }
  return warningLabel(props.value)
})
</script>

<template>
  <el-tag :type="type" effect="dark" round>
    {{ label }}
  </el-tag>
</template>
