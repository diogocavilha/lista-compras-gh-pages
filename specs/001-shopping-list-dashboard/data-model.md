# Phase 1 Data Model: Shopping List Dashboard

**Date**: 2026-04-12  
**Purpose**: Define data structures, persistence schema, and validation rules

## Entity: ShoppingList

Represents the currently active shopping list. Only ONE active list can exist at a time.

### Fields

| Field | Type | Required | Constraints | Notes |
|-------|------|----------|-------------|-------|
| createdAt | `ISO 8601 string` | Yes | Immutable after creation | Date/time user started shopping, becomes list identifier |
| items | `ListItem[]` | Yes | 1+ items to create list | Array of shopping items |
| status | `'active' \| 'completed'` | Yes | Computed from items | 'active' if any items unchecked, 'completed' if all checked |

### Validation Rules

- `createdAt` must be a valid ISO 8601 timestamp
- User cannot create new list if active list exists (warning prompt, can replace)
- At least one item must exist in list
- `items` array is mutable (add/remove items)

---

## Entity: ListItem

Represents a single product to buy in the active list.

### Fields

| Field | Type | Required | Constraints | Notes |
|-------|------|----------|-------------|-------|
| id | `UUID v4 string` | Yes | Unique per list | Generated on creation, immutable |
| title | `string` | Yes | 1-200 characters | Product name, e.g. "Milk", "Whole wheat bread" |
| completed | `boolean` | No | Default: false | Checked off or not |
| completedAt | `ISO 8601 string \| null` | No | Null if incomplete | Automatically set when `completed` becomes true |
| createdAt | `ISO 8601 string` | Yes | Immutable | Timestamp when item added to list (for ordering) |

### Validation Rules

- `title` is required, non-empty, max 200 characters
- `title` cannot be exact duplicate in same list (user gets error message)
- `completedAt` must be null if `completed` is false
- `completedAt` automatically set to current time when `completed` becomes true
- `id` is generated, user cannot set it
- Unchecking item clears `completedAt` timestamp

---

## Entity: CompletedList (Archive)

Represents a historical, completed shopping trip. Stored for analytics.

### Fields

| Field | Type | Required | Constraints | Notes |
|-------|------|----------|-------------|-------|
| id | `UUID v4 string` | Yes | Unique across all lists | Generated when list completed |
| createdAt | `ISO 8601 string` | Yes | Immutable | When shopping trip started |
| completedAt | `ISO 8601 string` | Yes | Immutable | When last item was checked (final item's completedAt) |
| durationMs | `number` | Yes | Computed | `completedAt - createdAt`, in milliseconds |
| itemCount | `number` | Yes | 1+ | Total items in the completed list |

### Validation Rules

- `completedAt` must be >= `createdAt`
- `durationMs` = `Date.parse(completedAt) - Date.parse(createdAt)`, must be non-negative
- Cannot be edited after creation (archive is immutable)

---

## TypeScript Interfaces

```typescript
// types/index.ts

export interface ListItem {
  id: string;              // UUID generated
  title: string;           // 1-200 chars
  completed: boolean;
  completedAt: string | null;  // ISO 8601 or null
  createdAt: string;       // ISO 8601
}

export interface ShoppingList {
  createdAt: string;       // ISO 8601, also serves as list ID
  items: ListItem[];
  status: 'active' | 'completed';  // Computed from items
}

export interface CompletedList {
  id: string;              // UUID
  createdAt: string;       // ISO 8601
  completedAt: string;     // ISO 8601
  durationMs: number;      // milliseconds
  itemCount: number;
}

export interface StorageSchema {
  activeList: ShoppingList | null;
  completedLists: CompletedList[];
  theme: 'light' | 'dark';  // Persisted theme preference
}
```

---

## localStorage Persistence Schema

**Key**: `shopping-list-data` (single root key)

**Full structure**:

```json
{
  "activeList": {
    "createdAt": "2026-04-12T10:30:00.000Z",
    "status": "active",
    "items": [
      {
        "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
        "title": "Milk",
        "completed": true,
        "completedAt": "2026-04-12T10:35:00.000Z",
        "createdAt": "2026-04-12T10:30:00.000Z"
      },
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "title": "Bread",
        "completed": false,
        "completedAt": null,
        "createdAt": "2026-04-12T10:31:00.000Z"
      }
    ]
  },
  "completedLists": [
    {
      "id": "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
      "createdAt": "2026-04-11T09:00:00.000Z",
      "completedAt": "2026-04-11T09:45:00.000Z",
      "durationMs": 2700000,
      "itemCount": 12
    },
    {
      "id": "6ba7b811-9dad-11d1-80b4-00c04fd430c8",
      "createdAt": "2026-04-10T15:00:00.000Z",
      "completedAt": "2026-04-10T15:52:00.000Z",
      "durationMs": 3120000,
      "itemCount": 15
    }
  ],
  "theme": "light"
}
```

---

## Analytics Calculations

### For Active List

- **Current Duration**: `now - createdAt` (only if list is active)
- **Completion %**: `completed items / total items * 100`

### For Completed Lists (Dashboard)

- **Single List Duration**: Pre-calculated and stored in `CompletedList.durationMs`
- **Average Duration**: `sum(completedLists[].durationMs) / count(completedLists)`
- **Total Trips**: `count(completedLists)`
- **Average Items per Trip**: `sum(completedLists[].itemCount) / count(completedLists)`

### Time Formatting for Display

- **Under 1 minute**: "30 seconds"
- **1-60 minutes**: "15 minutes", "1 hour 20 minutes"
- **1+ hours**: "2 hours", "3 hours 45 minutes"

---

## State Transitions

### ShoppingList Status

```
List created (active) → Items added (still active) 
  → User checks items (still active) 
  → User checks last item (→ 'completed' status)
  → System archives to CompletedLists
  → User can create new list (activeList becomes null)
```

### ListItem Completion

```
Item created (completed: false, completedAt: null)
  → User checks item (completed: true, completedAt: ISO string)
  → [Optional] User unchecks (completed: false, completedAt: null)
```

---

## Data Validation & Error Handling

### On List Creation
- Check no active list exists (warn user, offer to replace)
- Validate createdAt is valid timestamp
- Auto-initialize items array to empty

### On Item Addition
- Validate title: non-empty, max 200 chars
- Check for duplicate title in current list (error: "Item already in list")
- Generate UUID for item
- Set createdAt to current timestamp

### On Item Completion Toggle
- If `completed` becomes true: auto-set `completedAt`
- If `completed` becomes false: auto-clear `completedAt`
- If all items now completed: mark list as 'completed', archive it

### On Storage Quota
- Monitor localStorage usage
- Alert user if approaching limit
- Recommend backup export if >90% capacity

---

## Backup Export Format

**File format**: `shopping-list-backup-YYYY-MM-DD.json`

**Content**: Full `StorageSchema` as JSON (exported CompletedLists + activeList)

**On Restore**:
1. Parse JSON
2. Validate all required fields
3. Warn user: "This will replace your current list. Continue?"
4. Merge or overwrite based on user choice:
   - **Merge**: Append imported completedLists, keep current activeList
   - **Replace**: Full overwrite (recommended default)

---

## Constraints & Limits

| Constraint | Limit | Rationale |
|-----------|-------|-----------|
| Item title length | 200 chars | Reasonable for product names |
| Active items | No hard limit | Typical shopping trip ~20-50 items |
| Completed lists stored | As many as localStorage allows | ~50-100 lists typical usage |
| Storage quota | ~5-10MB | Browser default, sufficient for typical user |
| Item count display | All visible (scrollable on mobile) | Keep UI simple, no pagination |

---

## Future Extensibility (Out of Scope)

If future versions need:
- **Categories**: Add `category` field to ListItem
- **Quantities**: Add `quantity` and `unit` fields
- **Prices**: Add `price` field, calculate trip cost
- **Notes**: Add `notes` field to ListItem
- **Recurring items**: Add `frequency` field, auto-populate templates

All would require migration helper, not adding now per YAGNI principle.
