## Current Structure

```
components/
├── layout/              # ✅ Layout components
│   ├── AppSidebar.vue
│   ├── AppHeader.vue
│   └── UserDropdown.vue
│
├── ui/                  # ✅ Reusable UI components
│   └── CustomPagination.vue
│
├── features/            # 📁 Feature-specific (ready for future)
│   ├── expenses/
│   └── stats/
│
└── shared/              # 📁 Shared components (ready for future)
```

## Auto-Import Naming

Nuxt auto-imports components with folder prefixes:

- `layout/AppSidebar.vue` → `<LayoutAppSidebar />`
- `ui/CustomPagination.vue` → `<UiCustomPagination />`
- `features/expenses/Form.vue` → `<FeaturesExpensesForm />`

## Benefits

✅ **Scalable**: Easy to add new features
✅ **Organized**: Clear separation of concerns  
✅ **Discoverable**: Components grouped by purpose
✅ **Maintainable**: Easy to find and update components
