# Feature Specification: Reverse Chronological Item Ordering

**Feature Branch**: `004-reverse-chronological-items`  
**Created**: 2026-04-12  
**Status**: Draft  
**Input**: User description: "ao adicionar itens na lista, o último item adicionado deve sempre aparecer por primeiro" (When adding items to the list, the last item added should always appear first)

## User Scenarios & Testing

### User Story 1 - New Items Appear at Top (Priority: P1)

A user adds items to their shopping list and sees the most recently added item appear at the top of the list, with older items appearing below. The newest item always appears first, creating a reverse chronological (LIFO - Last In, First Out) ordering.

**Why this priority**: This is the core requirement - the visual ordering of items is fundamental to the user experience. Without this, the list behavior differs from the expected pattern.

**Independent Test**: User can add multiple items and verify that each new item appears at the top of the list above previously added items.

**Acceptance Scenarios**:

1. **Given** user has no items in the list, **When** they add "Milk", **Then** "Milk" appears in the list
2. **Given** "Milk" is in the list, **When** they add "Bread", **Then** "Bread" appears at the top above "Milk"
3. **Given** "Bread" is above "Milk", **When** user adds "Eggs", **Then** "Eggs" appears at the top, followed by "Bread", then "Milk"
4. **Given** multiple items in reverse chronological order, **When** user completes an item, **Then** the order remains unchanged for remaining items

---

### User Story 2 - Order Preserved Across Interactions (Priority: P1)

A user performs various interactions with the list (completing items, refreshing the page, restoring backup) and the reverse chronological order is maintained throughout.

**Why this priority**: The ordering must persist reliably across all operations to provide a consistent user experience.

**Independent Test**: User can complete items, reload the page, and restore backups while verifying that reverse chronological ordering is maintained.

**Acceptance Scenarios**:

1. **Given** items in reverse chronological order, **When** user completes an item, **Then** remaining items maintain their reverse chronological order
2. **Given** items in list, **When** page is refreshed, **Then** items appear in same reverse chronological order
3. **Given** list with items in order, **When** backup is made and restored, **Then** items maintain reverse chronological order
4. **Given** active list with items, **When** list is archived and new list created, **Then** new list starts with new items at top as they're added

---

### User Story 3 - Dashboard and Analytics Unaffected (Priority: P2)

A user views analytics, statistics, and historical data on the dashboard, which correctly reflects list data regardless of the storage order change.

**Why this priority**: Secondary feature - dashboard calculations should be unaffected by ordering, but must be verified to prevent regressions.

**Independent Test**: User can complete a list and view analytics showing correct calculations despite internal reverse chronological ordering.

**Acceptance Scenarios**:

1. **Given** list with items in any order, **When** user completes the list, **Then** analytics show correct item count
2. **Given** completed lists, **When** user views dashboard statistics, **Then** calculations are unaffected by item ordering
3. **Given** list with completed items, **When** user views recent trips, **Then** trip information displays correctly

---

### Edge Cases

- What happens if a user has 0 items and adds the first item? (Should appear in single-item list)
- When items are completed one by one, does the remaining order stay consistent?
- If user interacts with the list while items are being added, does order remain correct?
- When backup is restored with many items, are they in the correct reverse chronological order?
- Does completed items marking affect the ordering of uncompleted items?

## Requirements

### Functional Requirements

- **FR-001**: List items MUST be displayed in reverse chronological order (newest first, oldest last)
- **FR-002**: When a new item is added to the list, it MUST appear at the top of the list
- **FR-003**: The reverse chronological ordering MUST persist when the page is refreshed
- **FR-004**: The reverse chronological ordering MUST persist when a backup is restored
- **FR-005**: The reverse chronological ordering MUST be preserved when items are marked as completed
- **FR-006**: Deleted items MUST be removed while maintaining reverse chronological order of remaining items
- **FR-007**: The reverse chronological ordering MUST NOT affect dashboard statistics or calculations
- **FR-008**: The reverse chronological ordering MUST NOT affect analytics (item count, trip duration, etc.)

### Implementation Assumptions

- The existing item data structure in localStorage will not require modification
- The current data model (ListItem with id, title, completed, completedAt, createdAt) is sufficient for ordering
- Items are already created with createdAt timestamps that can be used for reverse chronological sorting
- The List component handles display logic and doesn't rely on array position for functionality
- No backend changes needed (this is a frontend display-only change)

## Success Criteria

- **Correct Display Order**: All items display in newest-first order in the shopping list view
- **Add Item Behavior**: Each newly added item appears at position 0 (top) of the displayed list
- **Persistence**: Order maintained across page reloads, backup/restore operations, and all interactions
- **No Regressions**: Item completion, deletion, and analytics calculations work identically
- **Consistent UX**: Users experience predictable newest-first ordering in all scenarios
- **Data Integrity**: No data loss or corruption when ordering is applied

## Key Entities

- **ListItem**: Existing item entity with createdAt timestamp used for ordering
- **ShoppingList**: Container for items; items collection will be displayed in reverse chronological order
- **CompletedList**: Historical list data; order maintained in storage for consistency

## Assumptions

1. createdAt timestamp is reliably set for all items (it is - set at item creation in App.tsx)
2. Reverse chronological sorting based on createdAt will work correctly for all browsers
3. Users prefer newest items first (LIFO pattern common in chat, email, and modern UIs)
4. Performance impact of reordering small lists (<100 items) is negligible
5. No external API or state management libraries need configuration changes
6. localStorage structure remains unchanged; only display order changes
