/**
 * Expense Model
 * Represents an expense entry in the system
 */
export interface Expense {
    id: number
    description: string
    amount: number
    date: string
    category: string
}

/**
 * Expense creation/update payload
 */
export interface ExpenseInput {
    description: string
    amount: number
    date: string
    category: string
}

/**
 * Category statistics
 */
export interface CategoryStat {
    category: string
    total: number
    count: number
}
