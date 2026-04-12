# Component Contract: List Component

**Purpose**: Display active shopping list with item management UI

**Module**: `src/components/List.tsx`

**Role**: Primary shopping interface for adding/checking items

## Props

```typescript
interface ListProps {
  list: ShoppingList | null;
  onAddItem: (title: string) => void;
  onToggleItem: (itemId: string) => void;
  onDeleteItem: (itemId: string) => void;
  onCreateNewList: () => void;
}
```

### Prop Details

| Prop | Type | Required | Purpose |
|------|------|----------|---------|
| `list` | `ShoppingList \| null` | Yes | Active list state or null if no list |
| `onAddItem` | `(title: string) => void` | Yes | Callback when user submits new item |
| `onToggleItem` | `(itemId: string) => void` | Yes | Callback when user checks/unchecks item |
| `onDeleteItem` | `(itemId: string) => void` | Yes | Callback to remove item from list |
| `onCreateNewList` | `() => void` | Yes | Callback to create new list |

## Behavior

### Rendering

#### No Active List

Component displays:
- Heading: "No active shopping list"
- Button: "Create New Shopping List"
- Subtext: "You can create a new list when ready"

Clicking button calls `onCreateNewList()`

#### Active List Exists

Component displays:
- **List metadata**: Created date in human format (e.g., "Today, 10:30 AM")
- **Item count**: Shows "X items, Y completed"
- **Input field**: Text input for adding items
  - Placeholder: "Enter product name..."
  - Button: "Add Item" or press Enter
  - Allow up to 200 characters per item
- **Item list** (scrollable):
  - Checkbox (left)
  - Product title
  - Completion time (if checked)
  - Delete button (trash icon, hidden on hover reveal)

### User Interactions

#### Adding Item

1. User types in input field
2. Presses Enter or clicks "Add Item"
3. Call `onAddItem(inputValue)`
4. Clear input field
5. Focus stays in input for next item
6. Show toast: "Item added"

**Validation**:
- If input empty, show error toast: "Please enter a product name"
- If title already exists in list, show error: "This item is already in your list"
- If title exceeds 200 chars, truncate silently

#### Checking Item

1. User clicks checkbox next to item
2. Visual feedback: Item text fades/strikethrough
3. Call `onToggleItem(itemId)`
4. If all items now checked:
   - Show toast: "List complete! Shopping trip: 45 minutes"
   - Disable further interactions (optional animation)
   - Show button: "Create New List"

#### Unchecking Item

1. User clicks checked checkbox again
2. Item visually reverts (no strikethrough)
3. Call `onToggleItem(itemId)`
4. No toast

#### Deleting Item

1. User clicks trash icon
2. Show confirmation: "Remove this item?"
3. If confirmed, call `onDeleteItem(itemId)`
4. Item disappears from list
5. Show toast: "Item removed"

**Special Case**: Deleting all items leaves list in 'active' state with 0 items (user can still add new ones)

### Accessibility

- Semantic HTML: `<form>`, `<input>`, `<button>`, `<ul>`
- ARIA labels on form controls
- Keyboard navigation: Tab through inputs/buttons
- Enter key submits form
- Escape clears input (optional UX enhancement)
- Screen reader announces: "List updated", "Item completed"

### Responsive Design

**Mobile (320px+)**:
- Stack layout vertically
- Input field full width
- Buttons full width
- Delete icons always visible (no hover)
- Font size: 16px (avoid iOS zoom on input focus)
- Touch targets minimum 44px

**Tablet (768px+)**:
- Slightly larger spacing
- Delete icons on hover reveal
- Font size: 14px

**Desktop (1024px+)**:
- Max width: 600px (prevents excessively wide lists)
- Hover states more pronounced
- Delete icons on hover

## Integration with Chakra UI

Component uses Chakra components:
- `Box` for layout container
- `VStack` / `HStack` for item arrangement
- `Input` for text input field
- `Button` for action buttons
- `Checkbox` for item completion toggle
- `IconButton` for delete (trash icon)
- `Toast` for success/error messages

Example structure:
```tsx
<Box as="main" m={4}>
  <VStack spacing={4}>
    <Heading as="h1" size="lg">{listMetadata}</Heading>
    <HStack as="form" onSubmit={handleAddItem} w="100%">
      <Input 
        placeholder="Enter product name..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <Button type="submit">Add Item</Button>
    </HStack>
    <UL>
      {list.items.map(item => (
        <ListItem key={item.id} item={item} {...callbacks} />
      ))}
    </UL>
  </VStack>
</Box>
```

## State Management

**Local state** (within component):
- `inputValue`: Current typed text in input field
- `loading`: False (no async operations)

**Props state** (from parent):
- `list`: Passed down from App
- All callbacks passed from App

Component is **stateless in terms of data** — all list data managed by parent via callbacks.

## Error Scenarios

| Scenario | Handling |
|----------|----------|
| User types duplicate item | Show error toast, don't call onAddItem |
| User exceeds char limit | Truncate silently to 200 chars |
| All items deleted | Show "Empty list" state but don't delete list itself |
| Rapid checkbox clicks | Debounce or ignore (backend handles idempotency) |
| localStorage quota hit | Parent app handles, component shows "Storage full" message |

## Testing Notes (Manual)

1. Add 5 items with different names, verify all appear correctly
2. Check 3 items, verify timestamps appear next to title
3. Uncheck 1 item, verify timestamp disappears
4. Check last item, verify "List complete" message appears
5. Delete middle item, verify list updates
6. Try adding duplicate, verify error message
7. Test on mobile (320px width), verify layout is usable
8. Test keyboard navigation: Tab through inputs, Enter adds item
9. Test with long product names (100+ chars), verify no overflow

## Accessibility Checklist

- [ ] All buttons have labels or ARIA labels
- [ ] Form can be submitted with Enter key
- [ ] Checkboxes are native `<input type="checkbox">` or ARIA equivalent
- [ ] Color not sole indicator of state (use text + color for completion)
- [ ] Sufficient contrast ratio (4.5:1 for text)
- [ ] Focus visible on all interactive elements
- [ ] Screen reader announces list updates

## Performance Considerations

- Component re-renders when `list` prop changes
- Each item is a separate component (ListItem) — can optimize with React.memo if needed
- No infinite loops or memory leaks in event handlers
- Input field debounces if validation needed (optional)

---

## Related Components

- **ListItem.tsx**: Renders individual item row
- **App.tsx**: Parents component, manages list callbacks
- **Dashboard.tsx**: Sibling component for analytics view
