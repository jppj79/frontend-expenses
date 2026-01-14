<template>
  <div class="container mx-auto px-4 py-8 max-w-7xl">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Expense Tracker</h1>
        <p class="text-gray-500 dark:text-gray-400 mt-1">Manage your business expenses efficiently.</p>
      </div>
      <UButton 
        icon="i-heroicons-plus" 
        size="lg" 
        color="primary" 
        variant="solid" 
        label="New Expense" 
        @click="openCreateModal"
      />
    </div>

    <!-- Filters -->
    <UCard class="mb-8" :ui="{ body: { padding: 'p-4 sm:p-6' } }">
      <div class="flex flex-col md:flex-row gap-4">
        <div class="flex-1">
          <UInput
            v-model="filters.query"
            icon="i-heroicons-magnifying-glass-20-solid"
            size="md"
            color="white"
            :trailing="false"
            placeholder="Search by description..."
            @input="debounceSearch"
          />
        </div>
        <div class="w-full md:w-64">
           <USelect
            v-model="filters.category"
            :items="filterItems"
            placeholder="All Categories"
            @change="fetchData" 
            class="w-full"
          />
           <!-- Note: USelect options should be objects if we want label/value, or just array of strings. 
                Using simple strings for now based on typical examples or assume specific categories. 
                User didn't specify categories list, so I'll put a placeholder list or make it editable text if backend accepts any.
                The prompt mentioned 'selector de categorías'. I will assume fixed categories for UI or string. -->
        </div>
      </div>
    </UCard>

    <!-- Content -->
    <UCard class="w-full" :ui="{ body: { padding: 'p-0' } }">
        <UTable
          :data="expenses"
          :columns="columns"
          :loading="loading"
          class="w-full"
        >
          <!-- Amount Column -->
          <template #amount-cell="{ row }">
            <span class="font-medium font-mono">
              {{ formatCurrency(row.original.amount) }}
            </span>
          </template>

          <!-- Date Column -->
          <template #date-cell="{ row }">
            <span>{{ formatDate(row.original.date) }}</span>
          </template>

           <!-- Category Column -->
          <template #category-cell="{ row }">
            <UBadge :color="getCategoryColor(row.original.category)" variant="subtle">
              {{ row.original.category }}
            </UBadge>
          </template>

          <!-- Actions Column -->
          <template #actions-cell="{ row }">
            <div class="flex gap-2">
              <UButton
                icon="i-heroicons-pencil-square"
                size="sm"
                color="neutral"
                variant="ghost"
                @click="openEditModal(row.original)"
              />
              <UButton
                icon="i-heroicons-trash"
                size="sm"
                color="error"
                variant="ghost"
                @click="confirmDelete(row.original)"
              />
            </div>
          </template>
          
           <!-- Empty State -->
           <template #empty-state>
            <div class="flex flex-col items-center justify-center py-12 gap-3">
              <span class="italic text-sm text-gray-500">No expenses found matching your criteria.</span>
            </div>
          </template>

        </UTable>

        <!-- Pagination -->
        <div class="flex justify-between items-center px-4 py-4 border-t border-gray-200 dark:border-gray-700">
           <span class="text-sm text-gray-500">
             Showing {{ ((pagination.page - 1) * pagination.limit) + 1 }} to {{ Math.min(pagination.page * pagination.limit, pagination.total) }} of {{ pagination.total }} results
           </span>
            <UPagination
                v-model="pagination.page"
                :page-count="pagination.limit"
                :total="pagination.total"
                @update:model-value="onPageChange"
            />
        </div>
    </UCard>
    
    <!-- Create/Edit Modal -->
    <UModal v-model:open="isModalOpen">
      <template #content>
        <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                {{ editingId ? 'Edit Expense' : 'New Expense' }}
              </h3>
              <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="isModalOpen = false" />
            </div>
          </template>

          <UForm :schema="schema" :state="form" class="space-y-4" @submit="onSubmit">
              <UFormField label="Description" name="description" required>
                  <UInput v-model="form.description" autofocus placeholder="e.g. Business Lunch" class="w-full" />
              </UFormField>
               <UFormField label="Amount" name="amount" required>
                  <UInput v-model.number="form.amount" type="number" step="0.01" placeholder="0.00" class="w-full">
                       <template #leading>
                          <span class="text-gray-500 dark:text-gray-400 text-xs">$</span>
                      </template>
                  </UInput>
              </UFormField>
              <UFormField label="Date" name="date" required>
                  <UInput v-model="form.date" type="date" class="w-full" />
              </UFormField>
               <UFormField label="Category" name="category" required>
                     <USelect
                          v-model="form.category"
                          :items="categories" 
                          placeholder="Select a category"
                          class="w-full"
                      />
              </UFormField>
              
              <div class="flex justify-end gap-2 mt-6">
                  <UButton label="Cancel" color="neutral" variant="ghost" @click="isModalOpen = false" />
                  <UButton :label="editingId ? 'Save Changes' : 'Create Expense'" type="submit" color="primary" variant="solid" :loading="loading" />
              </div>
          </UForm>


        </UCard>
      </template>
    </UModal>

    <!-- Delete Confirmation Modal -->
    <UModal v-model:open="isDeleteModalOpen">
      <template #content>
         <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
             <template #header>
                 <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">Confirm Deletion</h3>
             </template>
             <div class="py-2">
                 <p>Are you sure you want to delete this expense? This action cannot be undone.</p>
             </div>
              <template #footer>
                <div class="flex justify-end gap-2">
                    <UButton label="Cancel" color="gray" variant="ghost" @click="isDeleteModalOpen = false" />
                    <UButton label="Delete" color="red" variant="solid" :loading="loading" @click="executeDelete" />
                </div>
              </template>
         </UCard>
      </template>
    </UModal>

  </div>
</template>

<script setup lang="ts">
import { z } from 'zod'
import { useDebounceFn } from '@vueuse/core'
import type { Expense } from '../types'

definePageMeta({
  ssr: false
})

const { expenses, loading, pagination, fetchExpenses, createExpense, updateExpense, deleteExpense } = useExpenses()
const toast = useToast()

// Filters
const filters = reactive({
    query: '',
    category: '',
    page: 1,
    limit: 10
})

// Categories
// Hardcoded for now, ideal would be to fetch from API if available
const categories = ['Food', 'Transport', 'Office', 'Entertainment', 'Utilities', 'Tools','Other']

const filterItems = computed(() => {
    return [
        { label: 'All Categories', value: 'ALL' },
        ...categories.map(c => ({ label: c, value: c }))
    ]
})

// Table Columns
const columns = [
  { accessorKey: 'description', header: 'Description' },
  { accessorKey: 'amount', header: 'Amount' },
  { accessorKey: 'date', header: 'Date' },
  { accessorKey: 'category', header: 'Category' },
  { id: 'actions', header: '' }
]

// Modal State
const isModalOpen = ref(false)
const isDeleteModalOpen = ref(false)
const editingId = ref<number | null>(null)
const selectedExpenseDetails = ref<Expense | null>(null)

// Form State
const form = reactive({
    description: '',
    amount: 0,
    date: '',
    category: ''
})

// Initial Fetch
onMounted(() => {
    fetchData()
})

const fetchData = () => {
    filters.page = pagination.page // Ensure we sync pagination
    fetchExpenses({
        page: pagination.page,
        limit: pagination.limit,
        query: filters.query,
        category: filters.category === 'ALL' ? undefined : (filters.category || undefined),
    })
}

// Debounced Search
const debounceSearch = useDebounceFn(() => {
    pagination.page = 1 // Reset to page 1 on search
    fetchData()
}, 300)

const onPageChange = (newPage: number) => {
    pagination.page = newPage
    fetchData()
}

// Helpers
const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
}

const formatDate = (dateString: string) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('en-US')
}

const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
        case 'food': return 'warning' // orange -> warning
        case 'transport': return 'info' // blue -> info
        case 'office': return 'secondary' // purple -> secondary (or plain color if supported) - Nuxt UI v3 theme colors are usually primary, secondary, success, info, warning, error, neutral
        case 'entertainment': return 'success'
        case 'utilities': return 'info'
        default: return 'neutral'
    }
}

// Modal Actions
const resetForm = () => {
    form.description = ''
    form.amount = 0
    form.date = new Date().toISOString().split('T')[0] // Default to today
    form.category = ''
}

const openCreateModal = () => {
    editingId.value = null
    resetForm()
    isModalOpen.value = true
}

const openEditModal = (row: Expense) => {
    editingId.value = row.id
    form.description = row.description
    form.amount = Number(row.amount)
    form.date = row.date ? new Date(row.date).toISOString().split('T')[0] : ''
    form.category = row.category
    isModalOpen.value = true
}

const schema = z.object({
  description: z.string().min(3, 'Description must be at least 3 characters'),
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  date: z.string().refine((date) => new Date(date).toString() !== 'Invalid Date', 'Invalid date'),
  category: z.string().min(1, 'Please select a category')
})

const onSubmit = async () => {
    // No manual validation needed, UForm handles it based on schema
    let success = false
    if (editingId.value) {
        success = await updateExpense(editingId.value, { ...form })
    } else {
        success = await createExpense({ ...form })
    }

    if (success) {
        isModalOpen.value = false
        fetchData()
    }
}

// Delete Actions
const confirmDelete = (row: Expense) => {
    selectedExpenseDetails.value = row
    isDeleteModalOpen.value = true
}

const executeDelete = async () => {
    if (selectedExpenseDetails.value) {
        const success = await deleteExpense(selectedExpenseDetails.value.id)
        if (success) {
            isDeleteModalOpen.value = false
            fetchData()
        }
    }
}
</script>
