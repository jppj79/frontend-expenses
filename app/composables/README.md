# Composables Organization

Composables are organized by purpose and domain:

## Structure

- **`core/`** - System-level composables (layout, auth, config)
- **`features/`** - Domain-specific composables organized by feature
  - `expenses/` - Expense management logic
  - `stats/` - Statistics and analytics
- **`shared/`** - Reusable utilities (debounce, localStorage, etc.)

## Naming Convention

- Always use `use` prefix: `useExpenses`, `useAuth`
- Be specific: ✅ `useExpenseForm` ❌ `useForm`
- Return descriptive object properties

## Auto-Import

Nuxt auto-imports composables from nested folders:
```typescript
// Automatically available in components
const { expenses, loading } = useExpenses()
const { toggleSidebar } = useLayout()
```
