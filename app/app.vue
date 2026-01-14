<template>
  <UApp>
    <!-- Global Loading Overlay -->
    <div v-if="isLoading" class="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-100 dark:bg-gray-900 transition-opacity duration-500" :class="{ 'opacity-0 pointer-events-none': !isLoading }">
        <div class="flex flex-col items-center gap-4">
            <!-- Simple SVG Spinner -->
            <svg class="animate-spin h-12 w-12 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <div class="text-gray-500 font-medium animate-pulse">Loading App...</div>
        </div>
    </div>

    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

<script setup lang="ts">
const colorMode = useColorMode()
const isLoading = ref(true)

// Force light mode on mount to override any local storage
onMounted(() => {
  colorMode.preference = 'light'
  colorMode.value = 'light'
  
  // Fake brief delay to show spinner (smoothness) then hide
  setTimeout(() => {
    isLoading.value = false
  }, 800)
})
</script>
