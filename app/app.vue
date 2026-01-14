<template>
  <UApp>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

<script setup lang="ts">
const colorMode = useColorMode()
// Force light mode on mount to override any local storage
onMounted(() => {
  colorMode.preference = 'light'
  colorMode.value = 'light'
})
</script>
