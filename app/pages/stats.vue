<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <h1 class="text-lg font-semibold text-gray-900 dark:text-white">Expense Statistics</h1>
      <UBreadcrumb :items="[{ label: 'Expenses', to: '/' }, { label: 'Statistics' }]" />
    </div>

    <div v-if="loading" class="flex justify-center p-12">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-primary-500" />
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      <!-- Pie Chart (Breakdown) -->
      <UCard :ui="{ body: { padding: 'p-4' } }">
          <template #header>
              <div class="flex items-center justify-between">
                  <h3 class="text-base font-semibold text-gray-900 dark:text-white">Expense Distribution</h3>
              </div>
          </template>
          <div class="h-80 w-full" ref="pieChartRef"></div>
      </UCard>

      <!-- Waterfall Expense Chart -->
      <UCard :ui="{ body: { padding: 'p-4' } }">
          <template #header>
             <div class="flex items-center justify-between">
                  <h3 class="text-base font-semibold text-gray-900 dark:text-white">Expense Waterfall (Cascade)</h3>
              </div>
          </template>
          <div class="h-80 w-full" ref="barChartRef"></div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useExpenses } from '~/composables/features/expenses/useExpenses'
import * as echarts from 'echarts'
// ECharts is client-only, usually safe in onMounted but with SPA mode even safer.

definePageMeta({
  ssr: false
})

const { fetchCategoryStats } = useExpenses()

const loading = ref(true) // Keep loading state for initial fetch

const pieChartRef = ref<HTMLElement | null>(null)
const barChartRef = ref<HTMLElement | null>(null)

onMounted(async () => {
    loading.value = true
    // Fetch data
    const stats = await fetchCategoryStats()
    loading.value = false

    await nextTick()

    // --- Color Palette Maintenance ---
    // Define a professional, Minible-style palette
    const palette = [
        '#3b82f6', // blue-500
        '#10b981', // emerald-500
        '#f59e0b', // amber-500        
        '#8b5cf6', // violet-500
        '#ec4899', // pink-500
        '#06b6d4', // cyan-500
        '#84cc16', // lime-500
        '#ef4444', // red-500
    ]

    // Create a deterministic map: CategoryName -> HexColor
    const categoryColorMap: Record<string, string> = {}
    stats.forEach((item, index) => {
        // Recycle colors if we have more categories than colors
        categoryColorMap[item.category] = palette[index % palette.length]
    })
    
    // Helper to get color
    const getColor = (name: string) => categoryColorMap[name] || '#9ca3af' // default gray

    // Helper for currency formatting
    const formatNumber = (num: number) => num.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })

    // 1. Pie Chart Configuration
    if (pieChartRef.value) {
        const pieChart = echarts.init(pieChartRef.value)
        const pieOptions = {
            tooltip: {
                trigger: 'item',
                // Custom formatter to add commas
                valueFormatter: (value: number) => formatNumber(value)
            },
            legend: {
                orient: 'vertical',
                left: 'left'
            },
            series: [
                {
                    name: 'Category',
                    type: 'pie',
                    radius: '75%', // Solid pie
                    label: {
                        show: true,
                        position: 'inside',
                        formatter: '{d}%' // Show percentage inside
                    },
                    data: stats.map(s => ({
                        value: s.totalAmount,
                        name: s.category,
                        itemStyle: {
                            color: getColor(s.category)
                        }
                    })),
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        }
        pieChart.setOption(pieOptions)
    }

    // 2. Waterfall (Cascade) Chart Configuration
    if (barChartRef.value) {
        const barChart = echarts.init(barChartRef.value)
        
        // Sort stats by total descending
        const sortedStats = [...stats].sort((a, b) => b.totalAmount - a.totalAmount)
        
        // Calculate total amount
        const totalAmount = sortedStats.reduce((sum, item) => sum + item.totalAmount, 0)

        // Prepare data for Waterfall
        const categories = sortedStats.map(s => s.category)
        const values = sortedStats.map(s => s.totalAmount)
        
        // Add "Total" column
        categories.push('Total')
        
        const helpData = []
        let currentSum = 0
        for (let i = 0; i < values.length; i++) {
            helpData.push(currentSum)
            currentSum += values[i]
        }
        // For the Total bar, start from 0
        helpData.push(0)
        
        // Values for the main series. The last one is the Total sum.
        const seriesData = [...values, totalAmount]

        const barOptions = {
            tooltip: {
                trigger: 'axis',
                axisPointer: { type: 'shadow' },
                formatter: function (params: any) {
                    const tar = params[1]; // The visible part
                    return tar.name + '<br/>' + tar.seriesName + ' : ' + formatNumber(tar.value);
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                splitLine: { show: false },
                data: categories
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    name: 'Placeholder',
                    type: 'bar',
                    stack: 'Total',
                    itemStyle: {
                        borderColor: 'transparent',
                        color: 'transparent'
                    },
                    emphasis: {
                        itemStyle: {
                            borderColor: 'transparent',
                            color: 'transparent'
                        }
                    },
                    data: helpData
                },
                {
                    name: 'Amount', // The visible bar
                    type: 'bar',
                    stack: 'Total',
                     // label: { // Removed this label, now it's in data item
                    //     show: true,
                    //     position: 'top', // Default position for the Amount
                    //     formatter: (params: any) => formatNumber(params.value)
                    // },
                    data: seriesData.map((val, index) => {
                         // Calculate percentage relative to Total Amount
                         // If it's the Total bar, it's 100%
                         const percentage = ((val / totalAmount) * 100).toFixed(1) + '%'
                         
                         return {
                             value: val,
                             // We can pass the percentage as label for 'inside'
                             label: {
                                 show: true,
                                 position: 'inside',
                                 formatter: percentage,
                                 color: '#fff' // White text for inside percentage
                             }
                         }
                    }),
                    // BUT WAIT, ECharts 'data' item 'label' overrides series 'label'.
                    // The user wants: Amount on TOP, Percentage INSIDE.
                    // ECharts allows multiple labels in newer versions using 'rich' text or 'markPoint', but simplest way is TWO series or using formater tricks.
                    // However, "Inside" and "Top" are distinct.
                    // Let's try to add a second series for the TOP label which is transparent but shows labels.
                    
                    itemStyle: {
                         color: (params: any) => {
                             if (params.dataIndex === values.length) {
                                 return '#374151' // Dark gray/black for Total
                             }
                             const categoryName = categories[params.dataIndex]
                             return getColor(categoryName)
                        }
                    }
                },
                // Series for "Top Label" (The Amount) - using a bar with 0 height or scattering?
                // Actually, a better way is to simply enable the label on the visible series for 'inside' (percentage)
                // and use another transparent bar on top (stack) for the 'top' label? No, that would stack.
                // We can use a Scatter series on top of the bars to show the value?
                // Or simply: ECharts 5 supports multiple labels? No.
                // Workaround: Use the 'Amount' series for Percentage (Inside).
                // Use a 'Bar' series with 0 value on top? No.
                // Use 'markPoint'? 
                // Let's use a separate Bar series with exact same values but transparent color, placed on top (stack? no, barGap -100%).
                // Series for "Top Label" - using a zero-height bar stacked on top
                {
                    name: 'Amount Label',
                    type: 'bar',
                    stack: 'Total', // Stack on top of the 'Amount' bar
                    data: seriesData.map(val => ({
                        value: 0, // Zero height so it sits exactly on top
                        realValue: val
                    })),
                    itemStyle: {
                        color: 'transparent'
                    },
                    label: {
                        show: true,
                        position: 'top',
                        formatter: (params: any) => formatNumber(params.data.realValue),
                        color: '#374151', // Explicit dark color
                        fontWeight: 'bold'
                    },
                    tooltip: { show: false }
                }
            ]
        }
        barChart.setOption(barOptions)
    }
})
</script>
