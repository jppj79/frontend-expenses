<template>
  <div class="flex flex-col gap-6">
    <!-- Page Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Expense List</h1>
      <UBreadcrumb :items="[{ label: 'Expenses', to: '/' }, { label: 'Expense List' }]" />
    </div>

    <!-- Actions -->
    <div>
        <UButton 
            icon="i-heroicons-plus"
            label="Add Expense"
            color="primary"
            class="bg-emerald-500 hover:bg-emerald-600 text-white border-none ring-0"
            @click="openCreateModal" 
        />
    </div>

    <!-- Main Card -->
    <div class="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
        
        <!-- Controls Header -->
        <div class="p-6 border-b border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <!-- Entries Selector -->
            <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span>Show</span>
                <USelect 
                    v-model="pagination.limit" 
                    :options="[5, 10, 25, 50]" 
                    size="sm"
                    class="w-20"
                    @change="onPageChange(1)"
                />
                <span>entries</span>
            </div>

            <!-- Search -->
            <div class="flex items-center gap-2 w-full md:w-auto">
                 <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Search:</span>
                 <UInput
                    v-model="filters.query"
                    placeholder=""
                    size="sm"
                    class="w-full md:w-64"
                    @input="debounceSearch"
                />
            </div>
        </div>

        <!-- Table -->
        <UTable
          :data="expenses"
          :columns="columns"
          :loading="loading"
          class="w-full"
          :ui="{ 
             th: { base: 'uppercase text-xs font-semibold text-gray-500 bg-gray-50 dark:bg-gray-800' },
             td: { base: 'text-sm text-gray-700 dark:text-gray-200 py-4' },
             divide: 'divide-gray-100 dark:divide-gray-800'
          }"
        >
          <!-- Checkbox Column (Visual mostly, mimicking Minible) -->
          <template #select-header>
              <UCheckbox color="primary" />
          </template>
          <template #select-cell>
               <UCheckbox color="primary" />
          </template>

          <!-- Amount Column -->
          <template #amount-cell="{ row }">
            <span class="font-medium font-mono text-gray-900 dark:text-white">
              {{ formatCurrency(row.original.amount) }}
            </span>
          </template>

          <!-- Date Column -->
          <template #date-cell="{ row }">
            <span>{{ formatDate(row.original.date) }}</span>
          </template>

           <!-- Category Column -->
          <template #category-cell="{ row }">
            <UBadge :color="getCategoryColor(row.original.category)" variant="subtle" :ui="{ rounded: 'rounded' }">
              {{ row.original.category }}
            </UBadge>
          </template>

          <!-- Actions Column -->
          <template #actions-cell="{ row }">
            <div class="flex gap-2 justify-end px-4">
               <!-- Tooltip for Edit mimicking the hover menu in image effectively by just showing icons -->
              <UButton
                icon="i-heroicons-pencil-square"
                size="xs"
                color="primary"
                variant="ghost"
                class="bg-blue-50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/20"
                @click="openEditModal(row.original)"
              />
              <UButton
                icon="i-heroicons-trash"
                size="xs"
                color="red"
                variant="ghost"
                class="bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20"
                @click="confirmDelete(row.original)"
              />
            </div>
          </template>
          
           <!-- Empty State -->
           <template #empty-state>
            <div class="flex flex-col items-center justify-center py-12 gap-3 text-gray-500">
               <UIcon name="i-heroicons-document-magnifying-glass" class="w-10 h-10 text-gray-300" />
               <span class="italic text-sm">No expenses found matching your criteria.</span>
            </div>
          </template>

        </UTable>

        <!-- Pagination Footer -->
        <div class="flex justify-between items-center px-6 py-4 border-t border-gray-200 dark:border-gray-800">
           <span class="text-sm text-gray-500">
             Showing {{ pagination.total === 0 ? 0 : ((pagination.page - 1) * pagination.limit) + 1 }} to {{ Math.min(pagination.page * pagination.limit, pagination.total) }} of {{ pagination.total }} entries
           </span>
            <UPagination
                v-model="pagination.page"
                :page-count="pagination.limit"
                :total="pagination.total"
                :ui="{ wrapper: 'gap-1', rounded: 'rounded-full' }"
                @update:model-value="onPageChange"
            />
        </div>

    </div>

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
})

// Categories
const categories = ['Food', 'Transport', 'Office', 'Entertainment', 'Utilities', 'Tools', 'Other']

const filterItems = computed(() => {
    return [
        { label: 'All Categories', value: 'ALL' },
        ...categories.map(c => ({ label: c, value: c }))
    ]
})

// Table Columns (Added ID mock column for checkbox placeholder if needed)
const columns = [
  { id: 'select', header: '' },
  { accessorKey: 'description', header: 'Description' },
  { accessorKey: 'date', header: 'Date' },
  { accessorKey: 'category', header: 'Category' },
  { accessorKey: 'amount', header: 'Amount' },
  { id: 'actions', header: 'Action' }
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
    // pagination state is reactive in composable, but we sync filters to it or vice-versa
    // Actually useExpenses manages pagination state. We should update filters from pagination if triggered by page change.
    // fetchExpenses takes filters.
    
    fetchExpenses({
        page: pagination.page,
        limit: pagination.limit,
        // category seems not used in new design for now, but keeping logic compatible
        category: filters.category === 'ALL' ? undefined : (filters.category || undefined), 
        query: filters.query,
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
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(value)
}

const formatDate = (dateString: string) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

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
