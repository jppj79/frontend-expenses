<template>
  <div class="flex flex-col gap-6">
    <!-- Page Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Welcome back! Here's your expense overview.</p>
      </div>
      <UBreadcrumb :items="[{ label: 'Dashboard' }]" />
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center p-12">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-primary-500" />
    </div>

    <!-- Dashboard Content -->
    <div v-else class="space-y-6">
      <!-- KPI Cards Row -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <UiKpiCard
          title="Total Spent"
          :value="formatCurrency(metrics.totalSpent)"
          icon="i-heroicons-banknotes"
          variant="primary"
          :trend="metrics.totalTrend"
          :show-chart="true"
          :chart-data="metrics.totalSpentData"
          chart-type="line"
        />
        
        <UiKpiCard
          title="This Month"
          :value="formatCurrency(metrics.thisMonth)"
          icon="i-heroicons-calendar"
          variant="success"
          :trend="metrics.monthTrend"
          :show-chart="true"
          :chart-data="metrics.monthlyData"
          chart-type="line"
        />
        
        <UiKpiCard
          title="Daily Average"
          :value="formatCurrency(metrics.dailyAverage)"
          icon="i-heroicons-chart-bar"
          variant="warning"
          :trend="metrics.dailyTrend"
          :show-chart="true"
          :chart-data="metrics.dailyData"
          chart-type="bar"
        />
        
        <UiKpiCard
          title="Largest Expense"
          :value="formatCurrency(metrics.largestExpense)"
          :description="metrics.largestExpenseDescription"
          icon="i-heroicons-arrow-trending-up"
          variant="violet"
          :show-chart="true"
          :chart-data="metrics.largestExpenseData"
          chart-type="bar"
        />
      </div>

      <!-- Charts Row -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Category Breakdown -->
        <UCard :ui="{ body: { padding: 'p-6' } }">
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Category Breakdown</h3>
              <UBadge color="primary" variant="subtle">{{ expenses.length }} expenses</UBadge>
            </div>
          </template>
          <div class="h-80 w-full" ref="donutChartRef"></div>
        </UCard>

        <!-- Spending Trend -->
        <UCard :ui="{ body: { padding: 'p-6' } }">
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Spending Trend</h3>
              <UBadge color="primary" variant="subtle">Last 7 days</UBadge>
            </div>
          </template>
          <div class="h-80 w-full" ref="trendChartRef"></div>
        </UCard>
      </div>

      <!-- Bottom Row -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Top Category -->
        <UCard :ui="{ body: { padding: 'p-6' } }">
          <template #header>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Top Category</h3>
          </template>
          <div class="flex flex-col items-center">
            <div class="h-40 w-full mb-4" ref="miniPieRef"></div>
            <div class="text-center">
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ topCategory.name }}</p>
              <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">{{ formatCurrency(topCategory.amount) }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-500 mt-1">{{ topCategory.percentage }}% of total</p>
            </div>
          </div>
        </UCard>

        <!-- Recent Expenses -->
        <UCard :ui="{ body: { padding: 'p-6' } }" class="lg:col-span-2">
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Recent Expenses</h3>
              <NuxtLink to="/expenses" class="text-sm text-primary-600 dark:text-primary-400 hover:underline">
                View all
              </NuxtLink>
            </div>
          </template>
          <div class="space-y-3">
            <div 
              v-for="expense in recentExpenses" 
              :key="expense.id"
              class="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <div class="flex items-center gap-3">
                <div 
                  class="w-10 h-10 rounded-lg flex items-center justify-center"
                  :class="getCategoryBgClass(expense.category)"
                >
                  <UIcon :name="getCategoryIcon(expense.category)" class="w-5 h-5" />
                </div>
                <div>
                  <p class="font-medium text-gray-900 dark:text-white">{{ expense.description }}</p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">{{ formatDate(expense.date) }}</p>
                </div>
              </div>
              <div class="text-right">
                <p class="font-semibold text-gray-900 dark:text-white">{{ formatCurrency(expense.amount) }}</p>
                <UBadge :color="getCategoryColor(expense.category)" variant="subtle" size="xs">
                  {{ expense.category }}
                </UBadge>
              </div>
            </div>
          </div>
        </UCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useExpenses } from '~/composables/features/expenses/useExpenses'
import * as echarts from 'echarts'
import { formatCurrency } from '~/utils/formatters/number'
import { formatDate } from '~/utils/formatters/date'

definePageMeta({
  ssr: false
})

const { expenses, loading, fetchExpenses, fetchCategoryStats } = useExpenses()

const donutChartRef = ref<HTMLElement | null>(null)
const trendChartRef = ref<HTMLElement | null>(null)
const miniPieRef = ref<HTMLElement | null>(null)

// Metrics calculation
const metrics = computed(() => {
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()
  
  // Total spent
  const totalSpent = expenses.value.reduce((sum, e) => sum + Number(e.amount), 0)
  
  // This month
  const thisMonth = expenses.value
    .filter(e => {
      const date = new Date(e.date)
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear
    })
    .reduce((sum, e) => sum + Number(e.amount), 0)
  
  // Daily average (last 30 days)
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  const last30Days = expenses.value.filter(e => new Date(e.date) >= thirtyDaysAgo)
  const dailyAverage = last30Days.length > 0 ? last30Days.reduce((sum, e) => sum + Number(e.amount), 0) / 30 : 0
  
  // Generate sparkline data (last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(now.getTime() - (6 - i) * 24 * 60 * 60 * 1000)
    const dayExpenses = expenses.value.filter(e => {
      const eDate = new Date(e.date)
      return eDate.toDateString() === date.toDateString()
    })
    return dayExpenses.reduce((sum, e) => sum + Number(e.amount), 0)
  })
  
  // Largest expense
  const largestExpenseItem = expenses.value.length > 0
    ? expenses.value.reduce((max, e) => Number(e.amount) > Number(max.amount) ? e : max, expenses.value[0])
    : null
  
  const largestExpense = largestExpenseItem ? Number(largestExpenseItem.amount) : 0
  const largestExpenseDescription = largestExpenseItem 
    ? `${largestExpenseItem.description} • ${largestExpenseItem.category}`
    : 'No expenses yet'
  
  // Create comparison data for largest expense chart (showing it's significantly higher)
  const avgExpense = expenses.value.length > 0 
    ? expenses.value.reduce((sum, e) => sum + Number(e.amount), 0) / expenses.value.length 
    : 0
  const largestExpenseData = [
    avgExpense * 0.6,  // Lower expenses
    avgExpense * 0.8,  // Mid expenses
    avgExpense,        // Average
    avgExpense * 1.5,  // Higher expenses
    largestExpense * 0.7, // Build up
    largestExpense * 0.85, // Build up
    largestExpense     // Largest (peak)
  ]
  
  return {
    totalSpent,
    thisMonth,
    dailyAverage,
    largestExpense,
    largestExpenseDescription,
    largestExpenseData,
    totalTrend: 12.5, // Mock trend
    monthTrend: 8.2,
    dailyTrend: -3.1,
    totalSpentData: last7Days,
    monthlyData: last7Days,
    dailyData: last7Days
  }
})

// Top category
const topCategory = computed(() => {
  const categoryTotals = expenses.value.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + Number(e.amount)
    return acc
  }, {} as Record<string, number>)
  
  const sorted = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])
  const top = sorted[0] || ['N/A', 0]
  const total = metrics.value.totalSpent
  
  return {
    name: top[0],
    amount: top[1],
    percentage: total > 0 ? Math.round((top[1] / total) * 100) : 0
  }
})

// Recent expenses
const recentExpenses = computed(() => {
  return [...expenses.value]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)
})

// Helper functions
const getCategoryColor = (category: string) => {
  switch (category.toLowerCase()) {
    case 'food': return 'warning'
    case 'transport': return 'info'
    case 'office': return 'neutral'
    case 'entertainment': return 'success'
    case 'utilities': return 'error'
    case 'tools': return 'primary'
    default: return 'neutral'
  }
}

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'food': return 'i-heroicons-cake'
    case 'transport': return 'i-heroicons-truck'
    case 'office': return 'i-heroicons-building-office'
    case 'entertainment': return 'i-heroicons-film'
    case 'utilities': return 'i-heroicons-bolt'
    case 'tools': return 'i-heroicons-wrench-screwdriver'
    default: return 'i-heroicons-shopping-bag'
  }
}

const getCategoryBgClass = (category: string) => {
  switch (category.toLowerCase()) {
    case 'food': return 'bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400'
    case 'transport': return 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
    case 'office': return 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
    case 'entertainment': return 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
    case 'utilities': return 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400'
    case 'tools': return 'bg-violet-100 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400'
    default: return 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
  }
}

// Initialize charts
onMounted(async () => {
  await fetchExpenses({ page: 1, limit: 1000 })
  const stats = await fetchCategoryStats()
  
  await nextTick()
  
  // Color palette
  const palette = [
    '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', 
    '#ec4899', '#06b6d4', '#84cc16', '#ef4444'
  ]
  
  const categoryColorMap: Record<string, string> = {}
  stats.forEach((item, index) => {
    categoryColorMap[item.category] = palette[index % palette.length]
  })
  
  const getColor = (name: string) => categoryColorMap[name] || '#9ca3af'
  
  // Donut Chart
  if (donutChartRef.value) {
    const donutChart = echarts.init(donutChartRef.value)
    donutChart.setOption({
      tooltip: {
        trigger: 'item',
        formatter: '{b}: ${c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        textStyle: {
          color: '#6b7280'
        }
      },
      series: [
        {
          name: 'Category',
          type: 'pie',
          radius: ['45%', '70%'],
          avoidLabelOverlap: false,
          label: {
            show: true,
            position: 'outside',
            formatter: '{b}\n{d}%'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 16,
              fontWeight: 'bold'
            }
          },
          data: stats.map(s => ({
            value: s.totalAmount,
            name: s.category,
            itemStyle: { color: getColor(s.category) }
          }))
        }
      ]
    })
  }
  
  // Trend Area Chart
  if (trendChartRef.value) {
    const trendChart = echarts.init(trendChartRef.value)
    const last7DaysData = metrics.value.totalSpentData
    const dates = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000)
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    })
    
    trendChart.setOption({
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'cross' }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: dates
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: '${value}'
        }
      },
      series: [
        {
          name: 'Spending',
          type: 'line',
          smooth: true,
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: '#3b82f640' },
                { offset: 1, color: '#3b82f600' }
              ]
            }
          },
          lineStyle: {
            width: 3,
            color: '#3b82f6'
          },
          itemStyle: {
            color: '#3b82f6'
          },
          data: last7DaysData
        }
      ]
    })
  }
  
  // Mini Pie Chart
  if (miniPieRef.value) {
    const miniPie = echarts.init(miniPieRef.value)
    const topCat = topCategory.value
    const others = metrics.value.totalSpent - topCat.amount
    
    miniPie.setOption({
      tooltip: {
        trigger: 'item'
      },
      series: [
        {
          name: 'Category',
          type: 'pie',
          radius: '70%',
          label: { show: false },
          emphasis: {
            label: {
              show: true,
              fontSize: 14,
              fontWeight: 'bold'
            }
          },
          data: [
            { value: topCat.amount, name: topCat.name, itemStyle: { color: '#10b981' } },
            { value: others, name: 'Others', itemStyle: { color: '#e5e7eb' } }
          ]
        }
      ]
    })
  }
})
</script>
