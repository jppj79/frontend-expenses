# Utils Organization

Pure utility functions organized by purpose:

## Structure

- **`formatters/`** - Formatting functions (currency, date, number)
- **`validators/`** - Validation logic
- **`helpers/`** - General helper functions

## Naming Convention

- **camelCase** for functions: `formatCurrency`, `validateExpense`
- **Verb-based names**: `format`, `validate`, `calculate`
- **Named exports**: `export function formatCurrency()`

## Usage

```typescript
import { formatCurrency } from '~/utils/formatters/number'
import { formatDate } from '~/utils/formatters/date'

const formatted = formatCurrency(1234) // "$1,234"
```

## Guidelines

- Pure functions only (no side effects)
- Well-documented with JSDoc
- Unit testable
