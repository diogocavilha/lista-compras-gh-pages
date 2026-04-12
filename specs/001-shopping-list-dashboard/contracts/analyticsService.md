# Service Contract: AnalyticsService

**Purpose**: Calculate time-based metrics for dashboard display

**Module**: `src/services/analyticsService.ts`

## Functions

### `calculateListDuration(startTime: string, endTime: string): number`

Calculate duration in milliseconds between two ISO 8601 timestamps.

**Parameters**:
- `startTime`: ISO 8601 string (list creation time)
- `endTime`: ISO 8601 string (last item completion time)

**Returns**: Duration in milliseconds as number

**Example**:
```typescript
const duration = calculateListDuration(
  '2026-04-12T10:00:00Z',
  '2026-04-12T10:45:00Z'
)
// Returns 2700000 (45 minutes in ms)
```

---

### `formatDuration(durationMs: number): string`

Convert milliseconds to human-readable format.

**Parameters**:
- `durationMs`: Duration in milliseconds

**Returns**: Formatted string, e.g. "15 minutes", "1 hour 20 minutes", "30 seconds"

**Examples**:
```typescript
formatDuration(30000)      // "30 seconds"
formatDuration(900000)     // "15 minutes"
formatDuration(5400000)    // "1 hour 30 minutes"
formatDuration(7260000)    // "2 hours 1 minute"
```

**Rules**:
- Under 1 minute: "X seconds"
- 1 minute+: "X minutes"
- 60+ minutes: "X hours Y minutes" (omit minutes if 0)
- Show singular "minute" / "hour" when =1, plural otherwise

---

### `calculateAverageDuration(completedLists: CompletedList[]): number`

Calculate mean duration across completed lists.

**Parameters**:
- `completedLists`: Array of completed lists from storage

**Returns**: Average duration in milliseconds, or 0 if no completed lists

**Example**:
```typescript
const lists: CompletedList[] = [
  { durationMs: 2700000, ... },  // 45 min
  { durationMs: 3600000, ... }   // 60 min
]
const avg = calculateAverageDuration(lists)
// Returns 3150000 (52.5 minutes avg)
```

---

### `calculateCompletionPercent(items: ListItem[]): number`

Calculate percentage of items completed in active list.

**Parameters**:
- `items`: Array of items from active list

**Returns**: Integer 0-100

**Example**:
```typescript
const items: ListItem[] = [
  { completed: true, ... },
  { completed: true, ... },
  { completed: false, ... }
]
const percent = calculateCompletionPercent(items)
// Returns 66 (2 of 3 items completed)
```

**Edge Cases**:
- Empty array: returns 0
- All unchecked: returns 0
- All checked: returns 100

---

### `getRecentTrips(completedLists: CompletedList[], limit: number = 5): CompletedList[]`

Get most recent completed lists for dashboard display.

**Parameters**:
- `completedLists`: Full history from storage
- `limit`: Number of recent trips to return (default 5)

**Returns**: Array of CompletedList sorted newest first, max length = limit

**Example**:
```typescript
const recent = getRecentTrips(allLists, 10)
// Returns up to 10 most recent completed lists
```

---

### `getDashboardStats(completedLists: CompletedList[]): DashboardStats`

Calculate all metrics needed for dashboard at once.

**Parameters**:
- `completedLists`: Full history from storage

**Returns**: `DashboardStats` object

```typescript
interface DashboardStats {
  totalTrips: number;
  averageDuration: number;
  averageDurationFormatted: string;
  shortestTrip: CompletedList | null;
  longestTrip: CompletedList | null;
  totalItemsShipped: number;
}
```

**Example**:
```typescript
const stats = getDashboardStats(completedLists)
console.log(`You've completed ${stats.totalTrips} shopping trips`)
console.log(`Average time: ${stats.averageDurationFormatted}`)
```

---

## Error Handling

- Invalid timestamps: Returns 0 or N/A (no exception thrown)
- Empty array: Returns 0 or "No data"
- Null values: Filters out, calculates on valid entries

---

## Testing Notes (Manual)

1. Create 3 lists with different durations, verify average calculates correctly
2. Complete 2 items of 5-item list, verify `calculateCompletionPercent` returns 40
3. Test edge cases: 0 items, 1 item, all items done
4. Verify `formatDuration` handles seconds/minutes/hours correctly
5. Test with completed lists spanning multiple days

---

## Performance

All functions O(n) where n = number of completed lists (~50 max):
- Even looping through 50 lists takes <1ms
- No API calls, no async operations
- Safe to call frequently from render functions
