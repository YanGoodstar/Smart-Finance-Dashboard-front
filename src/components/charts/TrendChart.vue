<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import * as echarts from 'echarts/core'
import { BarChart, LineChart } from 'echarts/charts'
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import type { BarSeriesOption, LineSeriesOption } from 'echarts/charts'
import type { GridComponentOption, LegendComponentOption, TooltipComponentOption } from 'echarts/components'
import type { DashboardTrendPointResponse } from '@/types/dashboard'

echarts.use([LineChart, BarChart, GridComponent, TooltipComponent, LegendComponent, CanvasRenderer])

type TrendChartOption = echarts.ComposeOption<
  BarSeriesOption | LineSeriesOption | GridComponentOption | LegendComponentOption | TooltipComponentOption
>

const props = defineProps<{
  data: DashboardTrendPointResponse[]
}>()

const rootRef = ref<HTMLDivElement | null>(null)
let chart: echarts.ECharts | null = null

const option = computed<TrendChartOption>(() => ({
  tooltip: { trigger: 'axis' },
  legend: {
    top: 8,
    textStyle: { color: '#627188' },
  },
  grid: {
    left: 12,
    right: 12,
    bottom: 12,
    top: 54,
    containLabel: true,
  },
  xAxis: {
    type: 'category',
    data: props.data.map((item) => item.date),
    axisLine: { lineStyle: { color: 'rgba(21, 35, 58, 0.12)' } },
    axisLabel: { color: '#627188' },
  },
  yAxis: {
    type: 'value',
    axisLine: { show: false },
    splitLine: { lineStyle: { color: 'rgba(21, 35, 58, 0.08)' } },
    axisLabel: { color: '#627188' },
  },
  series: [
    {
      name: '收入',
      type: 'line',
      smooth: true,
      data: props.data.map((item) => Number(item.incomeAmount)),
      lineStyle: { color: '#2f7d5b', width: 3 },
      itemStyle: { color: '#2f7d5b' },
      areaStyle: { color: 'rgba(47, 125, 91, 0.12)' },
    },
    {
      name: '支出',
      type: 'line',
      smooth: true,
      data: props.data.map((item) => Number(item.expenseAmount)),
      lineStyle: { color: '#c94f3c', width: 3 },
      itemStyle: { color: '#c94f3c' },
      areaStyle: { color: 'rgba(201, 79, 60, 0.08)' },
    },
    {
      name: '净额',
      type: 'bar',
      data: props.data.map((item) => Number(item.netAmount)),
      itemStyle: { color: '#b78a4d', borderRadius: [10, 10, 0, 0] },
      barMaxWidth: 22,
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
