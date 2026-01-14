<script setup lang="ts">
const { isSidebarOpen, isSidebarCollapsed, closeSidebar } = useLayout()
const route = useRoute()

// Close sidebar on route change (mobile)
watch(() => route.path, () => {
  closeSidebar()
})

// Menu Structure
const menuSections = ref([
    {
        title: 'MENU',
        items: [
            { label: 'Home', icon: 'i-heroicons-home', to: '/dashboard', badge: '01', badgeColor: 'primary' }
        ]
    },
    {
        title: 'APPS',
        items: [
            //{ label: 'Calendar', icon: 'i-heroicons-calendar', to: '#' },
            //{ label: 'Chat', icon: 'i-heroicons-chat-bubble-left-right', to: '#', badge: 'New', badgeColor: 'orange' },
            { 
                label: 'Expenses', 
                icon: 'i-heroicons-document-text', 
                children: [
                    { label: 'Expenses List', to: '/expenses' },
                    //{ label: 'Expenses Detail', to: '#' }
                ]
            },
            {
                label: 'Statistics',
                icon: 'i-heroicons-chart-bar',
                // Using stats as child or separate? User image didn't show stats explicitly, keeping it accessible
                // Let's integrate it nicely or keep it as direct link
                 children: [
                    { label: 'Charts', to: '/expenses/stats' }
                ]
            },
            //{ label: 'Contacts', icon: 'i-heroicons-users', to: '#' }
        ]
    }
])

// Submenu State
const openSubmenus = ref<Set<string>>(new Set(['Invoices'])) // Default open for demo

const toggleSubmenu = (label: string) => {
    if (openSubmenus.value.has(label)) {
        openSubmenus.value.delete(label)
    } else {
        openSubmenus.value.add(label)
    }
}

const isSubmenuOpen = (label: string) => openSubmenus.value.has(label)

const isActiveParent = (item: any) => {
    if (!item.children) return false
    return item.children.some((child: any) => child.to === route.path)
}

// Ensure parent is open if child is active on mount
onMounted(() => {
    menuSections.value.forEach(section => {
        section.items.forEach((item: any) => {
            if (isActiveParent(item)) {
                openSubmenus.value.add(item.label)
            }
        })
    })
})
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
      <nav class="flex-1 overflow-y-auto py-4 px-3 space-y-4">
        
        <div v-for="(section, sIndex) in menuSections" :key="sIndex">
            <div v-if="section.title" class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-3 whitespace-nowrap">
                {{ section.title }}
            </div>

            <div class="space-y-1">
                <div v-for="item in section.items" :key="item.label">
                    <!-- Item with Children -->
                    <div v-if="item.children && item.children.length > 0">
                        <button 
                            @click="toggleSubmenu(item.label)"
                            class="w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-primary-600 dark:hover:text-primary-400 transition-colors group cursor-pointer"
                            :class="{ 'text-primary-600 dark:text-primary-400 bg-gray-50 dark:bg-gray-800': isSubmenuOpen(item.label) || isActiveParent(item) }"
                        >
                            <div class="flex items-center gap-3 overflow-hidden">
                                <UIcon :name="item.icon || 'i-heroicons-circle'" class="w-5 h-5 flex-shrink-0" />
                                <span class="whitespace-nowrap">{{ item.label }}</span>
                            </div>
                            <UIcon 
                                name="i-heroicons-chevron-right" 
                                class="w-4 h-4 transition-transform duration-200"
                                :class="{ 'rotate-90': isSubmenuOpen(item.label) }"
                            />
                        </button>
                        
                        <!-- Submenu -->
                        <div v-show="isSubmenuOpen(item.label)" class="ml-4 mt-1 space-y-1 border-l border-gray-100 dark:border-gray-700 pl-2 transition-all duration-300">
                             <NuxtLink 
                                v-for="child in item.children" 
                                :key="child.to" 
                                :to="child.to"
                                class="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                                active-class="text-primary-600 dark:text-primary-400 font-medium bg-blue-50 dark:bg-blue-900/10"
                            >
                                <span class="whitespace-nowrap">{{ child.label }}</span>
                            </NuxtLink>
                        </div>
                    </div>

                    <!-- Single Item -->
                    <NuxtLink 
                        v-else
                        :to="item.to"
                        class="flex items-center justify-between gap-3 px-3 py-2.5 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-primary-600 dark:hover:text-primary-400 transition-colors group"
                        active-class="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium"
                    >
                        <div class="flex items-center gap-3 overflow-hidden">
                            <UIcon :name="item.icon || 'i-heroicons-circle'" class="w-5 h-5 flex-shrink-0" />
                            <span class="whitespace-nowrap">{{ item.label }}</span>
                        </div>
                        <UBadge v-if="item.badge" :label="item.badge" size="xs" :color="item.badgeColor || 'primary'" variant="solid" class="rounded-full px-2" />
                    </NuxtLink>
                </div>
            </div>
        </div>

      </nav>
    </aside>
  </div>
</template>
