<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import * as echarts from 'echarts'
import type { DashboardCategoryBreakdownResponse } from '@/types/dashboard'
import { formatMoney } from '@/utils/format'

const props = defineProps<{
  data: DashboardCategoryBreakdownResponse[]
}>()

const rootRef = ref<HTMLDivElement | null>(null)
let chart: echarts.ECharts | null = null

const palette = ['#173959', '#b78a4d', '#2f7d5b', '#c94f3c', '#8b5e83', '#4d7298', '#d49a3a']

const option = computed<echarts.EChartsOption>(() => ({
  color: palette,
  tooltip: {
    trigger: 'item',
    formatter: (params: { name: string; value: number }) => `${params.name}<br/>${formatMoney(params.value)}`,
  },
  legend: {
    bottom: 0,
    textStyle: { color: '#627188' },
  },
  series: [
    {
      name: '分类分布',
      type: 'pie',
      radius: ['48%', '72%'],
      center: ['50%', '44%'],
      itemStyle: {
        borderColor: '#f8f3ea',
        borderWidth: 4,
      },
      label: {
        show: true,
        color: '#173959',
        formatter: '{b}',
      },
      data: props.data.map((item) => ({
        name: item.finalCategory,
        value: Number(item.totalExpense),
      })),
    },
  ],
}))

function render() {
  if (!rootRef.value) {
    return
  }
  chart ??= echarts.init(rootRef.value)
  chart.setOption(option.value)
}

function onResize() {
  chart?.resize()
}

onMounted(() => {
  render()
  window.addEventListener('resize', onResize)
})

watch(option, () => render(), { deep: true })

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)
  chart?.dispose()
  chart = null
})
</script>

<template>
  <div ref="rootRef" style="height: 320px; width: 100%" />
</template>
