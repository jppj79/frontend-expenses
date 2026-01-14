<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Expense Statistics</h1>
      <UBreadcrumb :items="[{ label: 'Expenses', to: '/' }, { label: 'Statistics' }]" />
    </div>

    <div v-if="loading" class="flex justify-center p-12">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-primary-500" />
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      <!-- Pie Chart: Distribution -->
      <UCard>
        <template #header>
          <h3 class="font-semibold text-gray-900 dark:text-white">Expenses by Category</h3>
        </template>
        <div ref="pieChartRef" class="h-80 w-full"></div>
      </UCard>

      <!-- Bar Chart: Total Amount -->
      <UCard>
        <template #header>
           <h3 class="font-semibold text-gray-900 dark:text-white">Total Amount per Category</h3>
        </template>
        <div ref="barChartRef" class="h-80 w-full"></div>
      </UCard>

    </div>
  </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'

definePageMeta({
  ssr: false
})

const { fetchCategoryStats } = useExpenses()

const loading = ref(true)
const stats = ref<any[]>([])

const pieChartRef = ref<HTMLElement | null>(null)
const barChartRef = ref<HTMLElement | null>(null)
let pieChart: echarts.ECharts | null = null
let barChart: echarts.ECharts | null = null

onMounted(async () => {
    loading.value = true
    stats.value = await fetchCategoryStats()
    loading.value = false
    
    // Allow DOM to update
    await nextTick()
    
    initCharts()
    window.addEventListener('resize', resizeCharts)
})

onUnmounted(() => {
    window.removeEventListener('resize', resizeCharts)
    pieChart?.dispose()
    barChart?.dispose()
})

const resizeCharts = () => {
    pieChart?.resize()
    barChart?.resize()
}

const initCharts = () => {
    if (!stats.value.length) return

    // Pie Chart
    if (pieChartRef.value) {
        pieChart = echarts.init(pieChartRef.value)
        const pieOption = {
            tooltip: {
                trigger: 'item',
                formatter: '{b}: {c} ({d}%)'
            },
            legend: {
                bottom: '0%',
                left: 'center'
            },
            series: [
                {
                    name: 'Category',
                    type: 'pie',
                    radius: ['40%', '70%'],
                    avoidLabelOverlap: false,
                    itemStyle: {
                        borderRadius: 10,
                        borderColor: '#fff',
                        borderWidth: 2
                    },
                    label: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: 20,
                            fontWeight: 'bold'
                        }
                    },
                    labelLine: {
                        show: false
                    },
                    data: stats.value.map(s => ({ value: s.totalAmount, name: s.category }))
                }
            ]
        }
        pieChart.setOption(pieOption)
    }

    // Bar Chart
    if (barChartRef.value) {
        barChart = echarts.init(barChartRef.value)
        const barOption = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    data: stats.value.map(s => s.category),
                    axisTick: {
                        alignWithLabel: true
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: [
                {
                    name: 'Total Amount',
                    type: 'bar',
                    barWidth: '60%',
                    data: stats.value.map(s => s.totalAmount),
                    itemStyle: {
                        color: '#34d399' // Emerald-400ish
                    }
                }
            ]
        }
        barChart.setOption(barOption)
    }
}
</script>
