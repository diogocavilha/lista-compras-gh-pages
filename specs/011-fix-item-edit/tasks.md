# Tasks: Fix Item Edit Inconsistency

**Feature**: Fix Item Edit Inconsistency
**Feature Directory**: `specs/011-fix-item-edit`
**Input**: Implementation plan at `specs/011-fix-item-edit/plan.md`

## Summary

- **Total Tasks**: 4
- **User Stories Covered**: 2 (US1, US2)

## Dependencies

```
Phase 1 (Setup)
└── Phase 2 (Foundational - Analyze current logic)
    └── Phase 3 (US1 + US2 - Fix gesture logic)
        └── Phase 4 (Polish - Verify edge cases)
```

## Phase 1: Setup

- [x] T001 Analyze current gesture handling implementation in src/components/ListItem.tsx

## Phase 2: Foundational

- [x] T002 [P] Review the gestureRef logic and identify the exact cause of inconsistent tap behavior

## Phase 3: User Story Implementation

### User Story 1 - Consistent Single-Tap Edit

**Story Goal**: Make edit popup open on first tap every time
**Independent Test**: Tap any item in list → popup opens immediately, 100% success rate

- [x] T003 [US1] Fix tap detection logic in src/components/ListItem.tsx to use consistent threshold
- [x] T004 [US2] Ensure tap works regardless of micro-movements during touch

## Phase 4: Polish & Cross-Cutting

- [x] T005 Verify swipe-to-delete and swipe-to-complete still work correctly after fix

## Implementation Strategy

**MVP Scope**: Tasks T001, T003 (the core fix)
**Incremental Delivery**: User stories are closely related - fixing the gesture logic addresses both US1 and US2 simultaneously

### Key Fix Points (from code analysis)

1. **Line 50**: Threshold for axis detection is 5px - any movement >5px sets axis
2. **Line 79**: Tap only fires when `axis === null` - gets blocked by small movements
3. **Line 84**: Tap threshold is 10px but axis threshold is 5px - inconsistency

**Solution**: Use time-based detection (e.g., <200ms = tap) instead of relying solely on movement distance

## Parallel Execution

ListItem.tsx is the only file modified - tasks are sequential but fast to implement.

## Notes

- No data model or contract changes needed
- No test tasks (project uses manual verification per constitution)
- Fix is contained in single component