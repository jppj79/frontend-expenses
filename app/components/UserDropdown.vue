<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'

const isOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

// Close on click outside
onClickOutside(dropdownRef, () => {
    isOpen.value = false
})

const toggleDropdown = () => {
    isOpen.value = !isOpen.value
}
</script>

<template>
  <div class="relative" ref="dropdownRef">
    <!-- Trigger -->
    <div @click="toggleDropdown" class="flex items-center gap-2 cursor-pointer select-none">
        <UAvatar src="https://avatars.githubusercontent.com/u/739984?v=4" alt="Marcus" size="sm" />
        <span class="text-sm font-medium text-gray-700 dark:text-gray-200 hidden sm:block">Marcus</span>
        <UIcon 
            name="i-heroicons-chevron-down" 
            class="w-4 h-4 text-gray-400 transition-transform duration-200"
            :class="{ 'rotate-180': isOpen }" 
        />
    </div>

    <!-- Dropdown Menu -->
    <div v-if="isOpen" class="absolute right-0 mt-2 w-56 origin-top-right bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50 animate-in fade-in slide-in-from-top-2 duration-100">
        <div class="p-3 border-b border-gray-100 dark:border-gray-700">
            <p class="text-xs text-gray-500 dark:text-gray-400">Signed in as</p>
            <p class="text-sm font-medium text-gray-900 dark:text-white truncate">ben@example.com</p>
        </div>
        
        <div class="py-1">
            <a href="#" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2">
                <UIcon name="i-heroicons-cog-8-tooth" class="w-4 h-4 text-gray-400" />
                Settings
            </a>
            <a href="#" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2">
                 <UIcon name="i-heroicons-book-open" class="w-4 h-4 text-gray-400" />
                Documentation
            </a>
            <a href="#" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2">
                <UIcon name="i-heroicons-arrow-left-on-rectangle" class="w-4 h-4 text-gray-400" />
                Sign out
            </a>
        </div>
    </div>
  </div>
</template>
