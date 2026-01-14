# Project Structure

This project follows a professional, scalable folder organization:

## 📁 Directory Structure

```
app/
├── components/          # Vue components
│   ├── layout/         # Layout components (Sidebar, Header)
│   ├── ui/             # Reusable UI components
│   ├── features/       # Feature-specific components
│   └── shared/         # Shared components
│
├── composables/        # Vue composables
│   ├── core/          # System composables (layout, auth)
│   ├── features/      # Domain composables (expenses, stats)
│   └── shared/        # Utility composables
│
├── pages/             # Nuxt pages (auto-routing)
│   ├── index.vue     # Expense list
│   └── stats.vue     # Statistics
│
├── types/             # TypeScript types
│   ├── models/       # Domain models
│   ├── api/          # API types
│   └── shared/       # Shared types
│
├── utils/             # Pure utility functions
│   ├── formatters/   # Formatting functions
│   ├── validators/   # Validation logic
│   └── helpers/      # General helpers
│
└── layouts/           # Nuxt layouts
    └── default.vue   # Default layout
```

## 🎯 Naming Conventions

- **Files**: kebab-case (`use-expenses.ts`, `expense-form.vue`)
- **Components**: PascalCase or kebab-case (prefer kebab-case)
- **Functions**: camelCase (`fetchExpenses`, `formatCurrency`)
- **Types**: PascalCase (`Expense`, `PaginationMeta`)
- **Composables**: `use` prefix (`useExpenses`, `useLayout`)

## 📚 Documentation

Each major directory has a README.md explaining its purpose and conventions.
