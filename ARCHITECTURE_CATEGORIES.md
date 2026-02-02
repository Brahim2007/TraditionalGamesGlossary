# Categories Feature - Architecture Overview

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        User Interface                        │
└─────────────────────────────────────────────────────────────┘
                             │
        ┌────────────────────┴────────────────────┐
        │                                         │
        ▼                                         ▼
┌──────────────────┐                  ┌──────────────────────┐
│  Homepage        │                  │  Dashboard           │
│  (Public)        │                  │  (Admin/Reviewer)    │
├──────────────────┤                  ├──────────────────────┤
│ • CategoryGrid   │                  │ • Categories Page    │
│ • Shows Active   │                  │ • CategoriesClient   │
│   Categories     │                  │ • Full CRUD UI       │
│ • Links to       │                  │                      │
│   Gallery        │                  │                      │
└──────────────────┘                  └──────────────────────┘
        │                                         │
        └────────────────────┬────────────────────┘
                             ▼
                  ┌─────────────────────┐
                  │   Server Actions    │
                  │  (category.ts)      │
                  ├─────────────────────┤
                  │ • getCategories()   │
                  │ • createCategory()  │
                  │ • updateCategory()  │
                  │ • deleteCategory()  │
                  │ • toggleStatus()    │
                  └─────────────────────┘
                             │
                             ▼
                  ┌─────────────────────┐
                  │  Validation Layer   │
                  │  (Zod Schemas)      │
                  ├─────────────────────┤
                  │ • Input validation  │
                  │ • Type safety       │
                  │ • Error messages    │
                  └─────────────────────┘
                             │
                             ▼
                  ┌─────────────────────┐
                  │  Prisma ORM         │
                  │  (Database Client)  │
                  ├─────────────────────┤
                  │ • Type-safe queries │
                  │ • Migrations        │
                  │ • Relations         │
                  └─────────────────────┘
                             │
                             ▼
                  ┌─────────────────────┐
                  │   PostgreSQL DB     │
                  │   Category Table    │
                  ├─────────────────────┤
                  │ id (PK)             │
                  │ name (UNIQUE)       │
                  │ slug (UNIQUE)       │
                  │ description         │
                  │ icon                │
                  │ order               │
                  │ isActive            │
                  │ color               │
                  │ createdAt           │
                  │ updatedAt           │
                  └─────────────────────┘
```

---

## 🔄 Data Flow

### 1. Display Categories on Homepage

```
┌─────────┐    fetch    ┌──────────────┐    query    ┌──────────┐
│ Browser │ ─────────▶ │ page.tsx     │ ──────────▶ │ Database │
│         │            │ (Server)     │             │          │
└─────────┘            └──────────────┘             └──────────┘
                              │                           │
                              │      ┌────────────────────┘
                              │      │ Active Categories
                              ▼      ▼
                       ┌──────────────────┐
                       │ CategoryGrid     │
                       │ (Client)         │
                       │ • Renders icons  │
                       │ • Shows colors   │
                       │ • Links to       │
                       │   gallery        │
                       └──────────────────┘
```

### 2. Create New Category

```
┌──────────────┐    submit    ┌─────────────────┐    validate    ┌─────────┐
│ Admin UI     │ ───────────▶ │ createCategory()│ ─────────────▶ │ Zod     │
│ (Modal)      │              │ (Server Action) │                │ Schema  │
└──────────────┘              └─────────────────┘                └─────────┘
                                      │                                │
                                      │         ┌──────────────────────┘
                                      │         │ Validated Data
                                      ▼         ▼
                              ┌─────────────────────┐
                              │ Prisma              │
                              │ • Check duplicates  │
                              │ • Insert record     │
                              │ • Return result     │
                              └─────────────────────┘
                                      │
                                      ▼
                              ┌─────────────────────┐
                              │ Revalidate Paths    │
                              │ • /                 │
                              │ • /gallery          │
                              │ • /dashboard/...    │
                              └─────────────────────┘
                                      │
                                      ▼
                              ┌─────────────────────┐
                              │ Update UI           │
                              │ • Show success      │
                              │ • Refresh list      │
                              └─────────────────────┘
```

### 3. Toggle Category Status

```
┌──────────────┐    click     ┌────────────────┐    fetch    ┌──────────┐
│ Admin        │ ───────────▶ │ toggleStatus() │ ──────────▶ │ Database │
│ (Toggle Btn) │              │ (Server Action)│             │ Get      │
└──────────────┘              └────────────────┘             │ Current  │
                                     │                       │ Status   │
                                     │    ┌──────────────────┘
                                     │    │
                                     ▼    ▼
                              ┌────────────────┐
                              │ Update Record  │
                              │ isActive = !... │
                              └────────────────┘
                                     │
                                     ▼
                              ┌────────────────┐
                              │ Revalidate     │
                              │ Homepage       │
                              └────────────────┘
                                     │
                                     ▼
                              ┌────────────────┐
                              │ Category       │
                              │ appears/       │
                              │ disappears     │
                              └────────────────┘
```

---

## 🗂️ File Structure

```
TraditionalGamesGlossary/
│
├── prisma/
│   ├── schema.prisma                      # ← Updated (Category model)
│   └── migrations/
│       └── 002_add_category_table.sql     # ← New (Migration SQL)
│
├── lib/
│   └── actions/
│       └── category.ts                    # ← New (Server Actions)
│
├── components/
│   └── public/
│       └── CategoryGrid.tsx               # ← Updated (Fetch from DB)
│
├── app/
│   ├── (public)/
│   │   └── page.tsx                       # ← Updated (Pass categories)
│   │
│   └── dashboard/
│       ├── DashboardSidebar.tsx           # ← Updated (Add link)
│       └── categories/
│           ├── page.tsx                   # ← New (Server page)
│           └── CategoriesClient.tsx       # ← New (Client UI)
│
├── scripts/
│   └── apply-category-migration.js        # ← New (Helper script)
│
└── docs/
    ├── تحديث_التصنيفات.md                 # ← New (Arabic guide)
    ├── ملخص_تحديث_التصنيفات.md            # ← New (Arabic summary)
    ├── CATEGORIES_FEATURE_SUMMARY.md      # ← New (English summary)
    └── ARCHITECTURE_CATEGORIES.md         # ← New (This file)
```

---

## 🔐 Security Model

```
┌─────────────────────────────────────────────────────────────┐
│                     User Authentication                      │
│                     (getCurrentUser)                         │
└─────────────────────────────────────────────────────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│   Viewer     │   │   Editor     │   │   Reviewer   │
├──────────────┤   ├──────────────┤   ├──────────────┤
│ • No Access  │   │ • No Access  │   │ • View       │
│              │   │              │   │ • Create     │
│              │   │              │   │ • Edit       │
│              │   │              │   │ • Toggle     │
└──────────────┘   └──────────────┘   └──────────────┘
                                              │
                                              ▼
                                     ┌──────────────┐
                                     │    Admin     │
                                     ├──────────────┤
                                     │ • All Above  │
                                     │ • Delete     │
                                     └──────────────┘
```

---

## 📊 Database Schema Details

```sql
CREATE TABLE "Category" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL UNIQUE,
    "slug" TEXT NOT NULL UNIQUE,
    "description" TEXT,
    "icon" TEXT NOT NULL DEFAULT 'LayoutGrid',
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "color" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX "Category_order_idx" ON "Category"("order");
CREATE INDEX "Category_isActive_idx" ON "Category"("isActive");

-- Unique constraints
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");
```

### Relationships
```
Category (standalone)
  ↓
  Currently no direct relations
  Future: Could link to Tags or Games
```

---

## 🎨 Component Hierarchy

```
app/(public)/page.tsx (Server Component)
│
├─ getActiveCategories() ─────────┐
│                                  │
└─ CategoryGrid (Client)           │
    │                              │
    ├─ receives: categories[]  ◀───┘
    │
    └─ renders:
        ├─ Link (to /gallery?category=...)
        │   └─ Icon + Name + Color
        └─ onClick → Navigate with filter


app/dashboard/categories/page.tsx (Server Component)
│
├─ getCurrentUser() ───────────┐
├─ getCategories() ────────────┤
│                               │
└─ CategoriesClient             │
    │                           │
    ├─ receives:                │
    │   ├─ categories[]  ◀──────┘
    │   └─ userRole
    │
    └─ renders:
        ├─ Category Cards
        │   ├─ Icon + Name + Description
        │   ├─ Status Badge (Active/Inactive)
        │   └─ Action Buttons
        │       ├─ Edit
        │       ├─ Toggle
        │       └─ Delete (admin only)
        │
        └─ Add/Edit Modal
            ├─ Form Inputs
            ├─ Icon Picker
            ├─ Color Picker
            └─ Submit/Cancel
```

---

## ⚡ Performance Optimizations

### 1. Database Indexes
```sql
-- Fast lookups
Index on: order (for sorting)
Index on: isActive (for filtering)

-- Prevent duplicates
Unique index on: name
Unique index on: slug
```

### 2. Query Optimization
```typescript
// Only fetch active categories for homepage
getActiveCategories() {
  where: { isActive: true }  // ← Filter at DB level
  orderBy: { order: 'asc' }  // ← Sort at DB level
}
```

### 3. Caching & Revalidation
```typescript
// Next.js automatically caches Server Components
// Revalidate on changes:
revalidatePath('/')
revalidatePath('/gallery')
revalidatePath('/dashboard/categories')
```

### 4. Client-Side Efficiency
```typescript
// CategoryGrid: No state management needed
// Pure presentation based on props
// Links instead of click handlers (better SEO)
```

---

## 🧪 Testing Strategy

### Unit Tests (Recommended)
```typescript
// lib/actions/category.test.ts
describe('Category Actions', () => {
  test('createCategory validates input')
  test('createCategory prevents duplicates')
  test('updateCategory checks permissions')
  test('deleteCategory requires admin role')
  test('toggleCategoryStatus works correctly')
})
```

### Integration Tests (Recommended)
```typescript
// app/dashboard/categories/page.test.tsx
describe('Categories Page', () => {
  test('displays all categories')
  test('opens add modal on button click')
  test('submits new category successfully')
  test('toggles category status')
  test('deletes category with confirmation')
})
```

### E2E Tests (Recommended)
```typescript
// tests/e2e/categories.spec.ts
describe('Categories Management', () => {
  test('user can create category')
  test('category appears on homepage')
  test('hidden category not visible to public')
  test('admin can delete category')
})
```

---

## 🔄 Migration Path

### Before (Static)
```typescript
// Hard-coded in component
const categories = [
  { id: 'الكل', label: 'الكل', icon: LayoutGrid },
  { id: 'ألعاب حركية', label: 'ألعاب حركية', icon: Activity },
  // ...
]
```

### After (Dynamic)
```typescript
// Fetched from database
const { categories } = await getActiveCategories()
```

### Backward Compatibility
- ✅ Same UI/UX for end users
- ✅ Same component names
- ✅ Same routes
- ✅ Additional dashboard functionality

---

## 📈 Scalability Considerations

### Current Implementation
- ✅ Handles up to ~100 categories efficiently
- ✅ Indexed queries for fast lookups
- ✅ Server-side rendering (no client state)

### Future Scaling Options
1. **Pagination** (if > 100 categories)
2. **Search/Filter** in dashboard
3. **Category Groups** (nested hierarchy)
4. **Lazy Loading** for icons
5. **CDN Caching** for category list

---

## 🎯 Success Criteria

✅ **Completed**
- [x] Categories stored in database
- [x] Full CRUD operations
- [x] Role-based permissions
- [x] Homepage integration
- [x] Dashboard UI
- [x] Validation & error handling
- [x] Auto-slug generation
- [x] Icon & color customization
- [x] Active/inactive toggle
- [x] Documentation

🚀 **Future Enhancements**
- [ ] Drag & drop reordering
- [ ] Bulk operations
- [ ] Category analytics
- [ ] Import/Export
- [ ] Custom images
- [ ] Subcategories

---

**Architecture Status:** ✅ **Production Ready**  
**Last Updated:** February 2, 2026  
**Version:** 1.0.0
