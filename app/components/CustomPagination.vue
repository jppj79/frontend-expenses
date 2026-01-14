<template>
  <div class="flex items-center gap-2">
    <!-- First Page -->
    <button
      class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200"
      :class="modelValue === 1 
        ? 'text-gray-300 cursor-not-allowed' 
        : 'text-gray-600 hover:bg-gray-100 cursor-pointer'"
      :disabled="modelValue === 1"
      @click="$emit('update:modelValue', 1)"
    >
      «
    </button>
    
    <!-- Previous Page -->
    <button
      class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200"
      :class="modelValue === 1 
        ? 'text-gray-300 cursor-not-allowed' 
        : 'text-gray-600 hover:bg-gray-100 cursor-pointer'"
      :disabled="modelValue === 1"
      @click="$emit('update:modelValue', Math.max(1, modelValue - 1))"
    >
      ‹
    </button>
    
    <!-- Page Numbers -->
    <template v-for="page in totalPages" :key="page">
      <button
        class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200"
        :class="modelValue === page 
          ? 'bg-blue-500 text-white shadow-md' 
          : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'"
        @click="$emit('update:modelValue', page)"
      >
        {{ page }}
      </button>
    </template>
    
    <!-- Next Page -->
    <button
      class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200"
      :class="modelValue >= totalPages 
        ? 'text-gray-300 cursor-not-allowed' 
        : 'text-gray-600 hover:bg-gray-100 cursor-pointer'"
      :disabled="modelValue >= totalPages"
      @click="$emit('update:modelValue', Math.min(totalPages, modelValue + 1))"
    >
      ›
    </button>
    
    <!-- Last Page -->
    <button
      class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200"
      :class="modelValue >= totalPages 
        ? 'text-gray-300 cursor-not-allowed' 
        : 'text-gray-600 hover:bg-gray-100 cursor-pointer'"
      :disabled="modelValue >= totalPages"
      @click="$emit('update:modelValue', totalPages)"
    >
      »
    </button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: number
  total: number
  pageCount: number
}>()

defineEmits<{
  'update:modelValue': [value: number]
}>()

const totalPages = computed(() => {
  return Math.ceil(props.total / props.pageCount) || 1
})
</script>
