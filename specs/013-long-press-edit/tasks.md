# Tasks: Long Press Edit

**Feature**: Long Press Edit
**Feature Directory**: `specs/013-long-press-edit`
**Input**: Implementation plan at `specs/013-long-press-edit/plan.md`

## Summary

- **Total Tasks**: 2
- **User Stories Covered**: 1 (US1)

## Dependencies

```
Phase 1 (Analyze) → Phase 2 (Implement) → Phase 3 (Verify)
```

## Phase 1: Setup

- [x] T001 Analyze current tap logic in src/components/ListItem.tsx

## Phase 2: User Story Implementation

### User Story 1 - Long Press to Edit

**Story Goal**: Edit popup opens after 1 second of holding
**Independent Test**: Hold item for 1 second → edit popup opens

- [x] T002 [US1] Change tap threshold from 200ms to 1000ms in src/components/ListItem.tsx

## Phase 3: Polish & Cross-Cutting

- [x] T003 Verify swipe gestures still work correctly

## Implementation Strategy

**MVP Scope**: T002 only
**Incremental Delivery**: Single change

### Key Files

- `src/components/ListItem.tsx` (line 88)

### Solution (from plan.md)

- Change: `touchDuration < 200` → `touchDuration >= 1000`

## Notes

- No test tasks
- Single file modification
- Quick fix