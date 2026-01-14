<script setup lang="ts">
const { isSidebarOpen, isSidebarCollapsed, closeSidebar } = useLayout()
const route = useRoute()

// Close sidebar on route change (mobile)
watch(() => route.path, () => {
  closeSidebar()
})

const links = [
  { label: 'Invoices', to: '/', icon: 'i-heroicons-document-text' },
  { label: 'Statistics', to: '/stats', icon: 'i-heroicons-chart-bar' }
]
</script>

<template>
  <div>
    <!-- Mobile Overlay -->
    <div 
      v-if="isSidebarOpen" 
      class="fixed inset-0 bg-gray-900/50 z-40 lg:hidden"
      @click="closeSidebar"
    />

    <!-- Sidebar -->
    <aside 
      class="fixed lg:static inset-y-0 left-0 z-50 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transform transition-all duration-300 ease-in-out flex flex-col h-screen"
      :class="[
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        isSidebarCollapsed ? 'lg:w-0 lg:overflow-hidden lg:border-none' : 'lg:w-64'
      ]"
    >
      <!-- Logo -->
      <div class="h-16 flex items-center px-6 border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded bg-primary-500 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
            J
          </div>
          <span class="font-bold text-xl text-gray-900 dark:text-white tracking-tight whitespace-nowrap">JPEREZ</span>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        <div class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-3 whitespace-nowrap">Menu</div>
        
        <NuxtLink 
          v-for="link in links" 
          :key="link.to" 
          :to="link.to"
          class="flex items-center gap-3 px-3 py-2.5 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-primary-600 dark:hover:text-primary-400 transition-colors group"
          active-class="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium"
        >
          <UIcon :name="link.icon" class="w-5 h-5 flex-shrink-0" />
          <span class="whitespace-nowrap">{{ link.label }}</span>
        </NuxtLink>
      </nav>

    </aside>
  </div>
</template>
