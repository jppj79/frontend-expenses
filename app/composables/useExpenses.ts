import type { Expense, ExpenseFilters, PaginatedResult } from '../types'

export const useExpenses = () => {
    const config = useRuntimeConfig()
    const toast = useToast()

    // State
    const loading = ref(false)
    const expenses = ref<Expense[]>([])
    const pagination = reactive({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
    })

    // Filters State - sync with URL or local component state
    // We'll accept filters as arguments to fetch, or keep them here.
    // Letting the component manage filters might be more flexible for UI binding, 
    // but we can provide helper to build the query.

    const fetchExpenses = async (filters: ExpenseFilters) => {
        loading.value = true
        try {
            const { data, meta } = await $fetch<PaginatedResult<Expense>>('/expenses', {
                baseURL: config.public.apiBase,
                params: {
                    page: filters.page,
                    limit: filters.limit,
                    category: filters.category || undefined,
                    query: filters.query || undefined
                }
            })

            expenses.value = data
            pagination.page = meta.page
            pagination.limit = meta.limit
            pagination.total = meta.total
            pagination.totalPages = meta.totalPages

        } catch (error: any) {
            toast.add({
                title: 'Error fetching expenses',
                description: error.message || 'Unknown error',
                color: 'error'
            })
        } finally {
            loading.value = false
        }
    }

    const createExpense = async (expense: Omit<Expense, 'id'>) => {
        loading.value = true
        try {
            await $fetch('/expenses', {
                baseURL: config.public.apiBase,
                method: 'POST',
                body: expense
            })
            toast.add({ title: 'Expense created', color: 'success' })
            return true
        } catch (error: any) {
            toast.add({
                title: 'Error creating expense',
                description: error.message,
                color: 'error'
            })
            return false
        } finally {
            loading.value = false
        }
    }

    const updateExpense = async (id: number, expense: Partial<Omit<Expense, 'id'>>) => {
        loading.value = true
        try {
            await $fetch(`/expenses/${id}`, {
                baseURL: config.public.apiBase,
                method: 'PUT',
                body: expense
            })
            toast.add({ title: 'Expense updated', color: 'success' })
            return true
        } catch (error: any) {
            toast.add({
                title: 'Error updating expense',
                description: error.message,
                color: 'error'
            })
            return false
        } finally {
            loading.value = false
        }
    }

    const deleteExpense = async (id: number) => {
        // loading state for delete might be separate or general
        try {
            await $fetch(`/expenses/${id}`, {
                baseURL: config.public.apiBase,
                method: 'DELETE'
            })
            toast.add({ title: 'Expense deleted', color: 'success' })
            return true
        } catch (error: any) {
            toast.add({
                title: 'Error deleting expense',
                description: error.message,
                color: 'error'
            })
            return false
        }
    }

    const fetchCategoryStats = async () => {
        try {
            const data = await $fetch<any[]>('/expenses/stats/category', {
                baseURL: config.public.apiBase
            })
            return data
        } catch (error: any) {
            toast.add({
                title: 'Error fetching stats',
                description: error.message,
                color: 'error'
            })
            return []
        }
    }

    return {
        expenses,
        loading,
        pagination,
        fetchExpenses,
        createExpense,
        updateExpense,
        deleteExpense,
        fetchCategoryStats
    }
}
