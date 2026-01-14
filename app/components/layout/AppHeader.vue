<script setup lang="ts">
import { useLayout } from '~/composables/useLayout'

const { toggleSidebar } = useLayout()
</script>

<template>
  <header class="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
    <!-- Left: Sidebar Toggle -->
    <div class="flex items-center gap-4">
      <UButton 
        icon="i-heroicons-bars-3" 
        color="gray" 
        variant="ghost" 
        @click="toggleSidebar"
      /> 
      <!-- Can add more left-side elements here if needed -->
    </div>

    <!-- Right: Actions -->
    <div class="flex items-center gap-3">
        <!-- Optional placeholders matching Minible -->
        <UButton icon="i-heroicons-globe-alt" color="gray" variant="ghost" />
        <UButton icon="i-heroicons-squares-2x2" color="gray" variant="ghost" />
        <div class="relative">
             <UButton icon="i-heroicons-bell" color="gray" variant="ghost">
                <UBadge color="red" :ui="{ rounded: 'rounded-full' }" class="absolute top-1 right-1 w-2 h-2 p-0 border-2 border-white dark:border-gray-900" />
             </UButton>
        </div>
        
        <UDivider orientation="vertical" class="h-6 mx-2" />

        <LayoutUserDropdown />
        
        <UButton icon="i-heroicons-cog-6-tooth" color="gray" variant="ghost" />
    </div>
  </header>
</template>
