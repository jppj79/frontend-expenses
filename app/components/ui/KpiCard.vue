<template>
  <div 
    class="group relative overflow-hidden rounded-xl border transition-all duration-300 hover:shadow-lg"
    :class="[
      variant === 'primary' ? 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800' :
      variant === 'success' ? 'bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900 border-emerald-200 dark:border-emerald-800' :
      variant === 'warning' ? 'bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900 border-amber-200 dark:border-amber-800' :
      variant === 'violet' ? 'bg-gradient-to-br from-violet-50 to-violet-100 dark:from-violet-950 dark:to-violet-900 border-violet-200 dark:border-violet-800' :
      'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
    ]"
  >
    <div class="p-3">
      <!-- Header -->
      <div class="flex items-start justify-between mb-2">
        <div>
          <p class="text-xs font-medium text-gray-600 dark:text-gray-400 mb-0.5">{{ title }}</p>
          <h3 class="text-xl font-bold text-gray-900 dark:text-white">{{ value }}</h3>
          <p v-if="description" class="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">{{ description }}</p>
        </div>
        <div 
          v-if="icon"
          class="w-10 h-10 rounded-lg flex items-center justify-center"
          :class="[
            variant === 'primary' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' :
            variant === 'success' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
            variant === 'warning' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' :
            variant === 'violet' ? 'bg-violet-500/10 text-violet-600 dark:text-violet-400' :
            'bg-gray-500/10 text-gray-600 dark:text-gray-400'
          ]"
        >
          <UIcon :name="icon" class="w-5 h-5" />
        </div>
      </div>

      <!-- Trend Indicator -->
      <div v-if="trend !== undefined" class="flex items-center gap-2 mb-2">
        <div 
          class="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
          :class="[
            trend > 0 ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' :
            trend < 0 ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' :
            'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400'
          ]"
        >
          <UIcon 
            :name="trend > 0 ? 'i-heroicons-arrow-trending-up' : trend < 0 ? 'i-heroicons-arrow-trending-down' : 'i-heroicons-minus'" 
            class="w-3 h-3" 
          />
          <span>{{ Math.abs(trend) }}%</span>
        </div>
        <span class="text-xs text-gray-500 dark:text-gray-400">{{ trendLabel }}</span>
      </div>

      <!-- Chart Container -->
      <div v-if="showChart" class="h-10 -mx-1" ref="chartRef"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'

interface Props {
  title: string
  value: string | number
  description?: string
  icon?: string
  trend?: number
  trendLabel?: string
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'violet'
  showChart?: boolean
  chartData?: number[]
  chartType?: 'line' | 'bar'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  showChart: false,
  chartType: 'line',
  trendLabel: 'vs last month'
})

const chartRef = ref<HTMLElement | null>(null)

onMounted(() => {
  if (props.showChart && chartRef.value && props.chartData) {
    const chart = echarts.init(chartRef.value)
    
    const color = 
      props.variant === 'primary' ? '#3b82f6' :
      props.variant === 'success' ? '#10b981' :
      props.variant === 'warning' ? '#f59e0b' :
      '#6b7280'

    const option = {
      grid: {
        left: 0,
        right: 0,
        top: 5,
        bottom: 5
      },
      xAxis: {
        type: 'category',
        show: false,
        data: props.chartData.map((_, i) => i)
      },
      yAxis: {
        type: 'value',
        show: false
      },
      series: [
        {
          data: props.chartData,
          type: props.chartType,
          smooth: true,
          symbol: 'none',
          lineStyle: {
            width: 2,
            color: color
          },
          areaStyle: props.chartType === 'line' ? {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: color + '40' },
                { offset: 1, color: color + '00' }
              ]
            }
          } : undefined,
          itemStyle: {
            color: color
          }
        }
      ]
    }
    
    chart.setOption(option)

    // Responsive resize
    const resizeObserver = new ResizeObserver(() => {
      chart.resize()
    })
    resizeObserver.observe(chartRef.value)

    onUnmounted(() => {
      resizeObserver.disconnect()
      chart.dispose()
    })
  }
})
</script>
