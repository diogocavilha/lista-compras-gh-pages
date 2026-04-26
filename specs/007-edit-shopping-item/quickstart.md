# Quickstart: Edit Shopping List Item

## Overview

Add the ability to edit shopping list items by tapping on them.

## Changes Required

### 1. App.tsx

Add `onEditItem` prop:

```typescript
interface AppProps {
  onEditItem: (itemId: string, newTitle: string) => void
}
```

### 2. ListItem.tsx

Add `onEditItem` callback prop and detect tap (vs swipe):

```typescript
interface ListItemProps {
  onEditItem?: (itemId: string) => void  // Add this
}
```

Handle tap when axis is null after pointer events settle.

### 3. List.tsx

Add edit dialog state and handler:

```typescript
const [editItemOpen, setEditItemOpen] = useState(false)
const [editItemId, setEditItemId] = useState<string | null>(null)
const [editInputValue, setEditInputValue] = useState('')

const handleEditItem = (itemId: string) => {
  const item = list?.items.find(i => i.id === itemId)
  if (item) {
    setEditItemId(itemId)
    setEditInputValue(item.title)
    setEditItemOpen(true)
  }
}

const handleSaveEdit = () => {
  // Validate and call onEditItem or onToggleItem (based on project)
  // Similar validation to handleAddItem
}
```

## Verification Steps

1. Open app and add an item
2. Tap on the item (not swipe)
3. Verify edit dialog opens with item name pre-filled
4. Modify the name and confirm
5. Verify list updates with new name
6. Tap cancel and verify original name preserved