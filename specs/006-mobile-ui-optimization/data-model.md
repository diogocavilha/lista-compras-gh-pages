# Data Model: Otimização da Interface para Mobile

> The domain data model is **unchanged** from the existing implementation. This document records the entities and their relationships for reference during implementation, and adds the new UI-state entities introduced by this feature.

---

## Domain Entities (unchanged)

### `ListItem`
```
id:          string   — UUID, unique identifier
title:       string   — product name, max 200 chars, unique within list
completed:   boolean  — whether the item has been checked off
completedAt: string | null — ISO 8601 timestamp when completed, null if pending
createdAt:   string   — ISO 8601 timestamp when created
```

### `ShoppingList`
```
createdAt: string        — ISO 8601 timestamp
items:     ListItem[]    — ordered list of items (newest first when displayed)
status:    'active'      — always active while in use; archived via CompletedList
```

### `CompletedList`
```
id:          string — UUID
createdAt:   string — ISO 8601 start of shopping trip
completedAt: string — ISO 8601 end of shopping trip (last item checked)
durationMs:  number — trip duration in milliseconds
itemCount:   number — total items in the completed trip
```

---

## UI State Entities (new — not persisted)

### `AppState` (managed in `App.tsx`)
```
activeTab:    0 | 1 | 2      — current bottom navigation index (0=Compras, 1=Painel, 2=Configurações)
themeMode:    'light' | 'dark' — current theme mode (persisted to localStorage)
addItemOpen:  boolean         — whether the Add Item dialog is open
confirmDialog: ConfirmDialogState | null — active confirmation dialog state, or null
snackbar:     SnackbarState | null       — active snackbar notification, or null
```

### `ConfirmDialogState`
```
title:     string    — dialog heading
message:   string    — body text
onConfirm: () => void
onCancel:  () => void
```

### `SnackbarState`
```
message:  string
severity: 'success' | 'error' | 'info' | 'warning'
```

### `DragState` (managed in `List.tsx` or `ListItem.tsx`)
```
draggingItemId: string | null — ID of the item currently being dragged, null if none
isDragOver:     boolean       — whether the dragged item is currently over the trash zone
```

---

## State Transitions

### Item lifecycle
```
Created (completed=false) → Toggled (completed=true, completedAt=now)
                          → Toggled back (completed=false, completedAt=null)
                          → Deleted (removed from list)
All items completed → List auto-archived as CompletedList → activeList=null
```

### Drag-to-trash lifecycle
```
Idle → [long press 1s] → DragMode (item follows pointer, trash zone visible)
     → [release over trash] → ConfirmDialog → [confirm] → Deleted
     → [release not over trash] → Idle (item snaps back)
     → [release during confirm] → ConfirmDialog open
```

### Add-item dialog lifecycle
```
Closed → [FAB tap] → Open (TextField focused)
       → [Enter / Add button] → Item added → Closed
       → [Cancel / Escape / backdrop tap] → Closed
```
