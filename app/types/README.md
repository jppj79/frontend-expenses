# Types Organization

TypeScript types and interfaces organized by category:

## Structure

- **`models/`** - Domain entities (Expense, User, Category)
- **`api/`** - API request/response types
- **`shared/`** - Shared types (Pagination, Filters, etc.)

## Naming Convention

- **PascalCase** for types/interfaces: `Expense`, `PaginationMeta`
- **Descriptive suffixes**: `ExpenseInput`, `CategoryStat`
- **File = domain**: `expense.ts` contains all expense-related types

## Usage

```typescript
import type { Expense, ExpenseInput } from '~/types/models/expense'
import type { PaginationMeta } from '~/types/shared/pagination'
```
