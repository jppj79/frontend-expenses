export interface Expense {
  id: number;
  description: string;
  amount: number;
  date: string;
  category: string;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ExpenseFilters {
  page: number;
  limit: number;
  category?: string;
  query?: string;
}
