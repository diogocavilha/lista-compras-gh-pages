# Data Model: Edit Shopping List Item

## Entities

### ListItem

Represents a single product in the shopping list.

| Field | Type | Constraints | Description |
|-------|------|------------|-------------|
| id | string | UUID v4 | Unique identifier |
| title | string | 1-200 chars, unique per list | Product name |
| completed | boolean | - | Whether item has been checked |
| completedAt | string \| null | ISO 8601 | When item was marked complete |
| createdAt | string | ISO 8601 | When item was added |
| deleted | boolean | - | Soft delete flag |
| deletedAt | string \| null | ISO 8601 | When item was deleted |

### ShoppingList

Container for list items.

| Field | Type | Description |
|-------|------|-------------|
| createdAt | string | ISO 8601, serves as list ID |
| items | ListItem[] | All items in the list |
| status | 'active' \| 'completed' | Computed from item states |

## State Transitions

### Item Edit Flow

```
[Item in List]
     │
     │ tap (not swipe)
     ▼
[Edit Dialog Opens]
     │
     ├──[Modify title]──→[Confirm]──→[Title Updated in List]
     │
     └──[Cancel/Close]──→[Dialog Closed, No Change]
```

### Edit Validation

Same rules as item creation:
1. Title must not be empty
2. Title must not exceed 200 characters
3. Title must be unique (case-insensitive check against other items)