/**
 * Pagination metadata
 */
export interface PaginationMeta {
    page: number
    limit: number
    total: number
    totalPages: number
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
    data: T[]
    meta: PaginationMeta
}

/**
 * Filter parameters
 */
export interface FilterParams {
    query?: string
    category?: string
    page?: number
    limit?: number
}
