# Service Contract: StorageService

**Purpose**: Encapsulate all localStorage operations for ShoppingList data persistence

**Module**: `src/services/storageService.ts`

## Type Definitions

```typescript
import { ShoppingList, CompletedList, StorageSchema } from '../types/index'

// Storage key constant
const STORAGE_KEY = 'shopping-list-data'

// Default/empty storage
const DEFAULT_STORAGE: StorageSchema = {
  activeList: null,
  completedLists: [],
  theme: 'light'
}
```

## Public Interface

### `getActiveList(): ShoppingList | null`

Returns the currently active shopping list, or null if none exists.

**Returns**: `ShoppingList | null`

**Throws**: Nothing (returns null on parse error or missing data)

**Example**:
```typescript
const list = getActiveList()
if (list) {
  console.log(`${list.items.length} items in active list`)
}
```

---

### `setActiveList(list: ShoppingList | null): void`

Set or clear the active shopping list. Persists to localStorage immediately.

**Parameters**:
- `list`: ShoppingList object, or null to clear active list

**Throws**: Never (catches quota errors gracefully)

**Side Effects**: Persists to localStorage

**Example**:
```typescript
const newList: ShoppingList = {
  createdAt: new Date().toISOString(),
  items: [],
  status: 'active'
}
setActiveList(newList)
```

---

### `getCompletedLists(): CompletedList[]`

Returns array of all completed shopping trips (sorted newest first).

**Returns**: `CompletedList[]`

**Example**:
```typescript
const history = getCompletedLists()
const avgTime = history.reduce((sum, l) => sum + l.durationMs, 0) / history.length
```

---

### `addCompletedList(list: CompletedList): void`

Archive a completed list to history. Called when user checks final item.

**Parameters**:
- `list`: CompletedList object (with duration pre-calculated)

**Throws**: Never (catches quota errors)

**Side Effects**: Appends to completedLists, persists to localStorage

**Example**:
```typescript
const completed: CompletedList = {
  id: generateUUID(),
  createdAt: activeList.createdAt,
  completedAt: new Date().toISOString(),
  durationMs: Date.now() - Date.parse(activeList.createdAt),
  itemCount: activeList.items.length
}
addCompletedList(completed)
```

---

### `deleteCompletedList(id: string): void`

Remove a completed list from history (if user wants to discard old data).

**Parameters**:
- `id`: UUID of CompletedList to delete

**Throws**: Never

**Side Effects**: Removes from array, persists to localStorage

---

### `getTheme(): 'light' | 'dark'`

Get user's saved theme preference.

**Returns**: `'light' | 'dark'`

**Example**:
```typescript
const theme = getTheme()
if (theme === 'dark') {
  document.body.classList.add('dark-mode')
}
```

---

### `setTheme(theme: 'light' | 'dark'): void`

Save user's theme preference. Persists to localStorage.

**Parameters**:
- `theme`: Theme value to save

**Side Effects**: Persists to localStorage, does NOT apply theme (component handles that via Chakra)

---

### `clearAllData(): void`

⚠️ **DESTRUCTIVE** — Wipe all data from localStorage (after confirmation from user).

**Side Effects**: Clears entire storage, resets to DEFAULT_STORAGE

**Usage**: Only called from Settings/Backup UI after user confirmation

---

### `getStorageUsage(): { used: number; total: number; percent: number }`

Check current localStorage usage for quota management.

**Returns**: Object with bytes used, total available, and percentage

**Example**:
```typescript
const usage = getStorageUsage()
if (usage.percent > 90) {
  showWarning('Storage nearly full, consider backing up')
}
```

---

## Error Handling

- **Quota Exceeded**: Caught and logged; UI should check `getStorageUsage()` before adding large data
- **Parse Error**: Invalid JSON in storage → logs error, returns defaults
- **Missing Key**: Returns null or empty array (graceful fallback)

---

## Testing Notes (Manual)

1. Create list, refresh page → verify list persists
2. Check item, refresh page → verify timestamps persist
3. Open DevTools → `localStorage.getItem('shopping-list-data')` → verify JSON structure
4. Test quota: Open DevTools, artificially fill storage, verify error handling

---

## Performance

- All operations O(1) or O(n) where n = number of completed lists (~50 max)
- localStorage read/write: 1-5ms typical
- No blocking operations

---

## Future Deprecations

If data schema changes:
1. Detect old version in localStorage
2. Implement migration helper in this service
3. Update DEFAULT_STORAGE with new schema
4. Document migration path
