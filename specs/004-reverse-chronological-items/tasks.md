# Tasks: Reverse Chronological Item Ordering

**Feature**: Display shopping list items in reverse chronological order (newest first)  
**Input**: Design documents from `/specs/004-reverse-chronological-items/`  
**Prerequisites**: ✅ plan.md, spec.md, data-model.md, quickstart.md  

**Tests**: Manual testing only (per project constitution - no automated test framework)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Implementation Strategy

1. **MVP Scope**: User Story 1 (P1) - Core requirement: Display items newest-first
2. **Parallel Testing**: Test all interaction scenarios (page reload, backup/restore, etc.)
3. **Risk Mitigation**: Minimal code change reduces regression risk
4. **Build Verification**: Ensure production build stays ≤140 KB

---

## Phase 1: Setup

**Purpose**: Project already initialized; minimal setup needed for this feature

- [ ] T001 Review current List.tsx implementation and identify render location for reverse ordering
- [ ] T002 Read design documents (plan.md, data-model.md, quickstart.md)

---

## Phase 2: Foundational (No Blocking Prerequisites)

**Purpose**: All dependencies already in place; no foundational work needed

✅ **Status**: Ready to implement user stories immediately

---

## Phase 3: User Story 1 - New Items Appear at Top (Priority: P1) 🎯 MVP

**Goal**: Display newly added items at the top of the list in reverse chronological order

**Independent Test**: User can add multiple items and verify that each new item appears at the top above previously added items

### Implementation for User Story 1

- [ ] T003 [P] [US1] Implement reverse chronological ordering in List.tsx (apply `.reverse()` to items in render at `src/components/List.tsx` line ~150)
- [ ] T004 [US1] Manual test: Add single item to empty list → verify item appears in list
- [ ] T005 [US1] Manual test: Add second item → verify it appears above first item
- [ ] T006 [US1] Manual test: Add 5+ items in sequence → verify newest item at top, oldest at bottom
- [ ] T007 [US1] Manual test: Verify item text and properties display correctly despite reverse order

**Checkpoint**: User Story 1 complete - items display newest-first ✅

---

## Phase 4: User Story 2 - Order Preserved Across Interactions (Priority: P1)

**Goal**: Reverse chronological ordering persists reliably across all user interactions (page reloads, backup/restore, item completion, deletion)

**Independent Test**: User can complete items, reload the page, and restore backups while verifying that reverse chronological ordering is maintained

### Implementation for User Story 2

- [ ] T008 [US2] Manual test: Add items → complete one → verify remaining items maintain order
- [ ] T009 [US2] Manual test: Add items → refresh page → verify items reappear in reverse chronological order
- [ ] T010 [US2] Manual test: Add items → create backup → verify backup captures items
- [ ] T011 [US2] Manual test: Create list → add items → clear all → restore backup → verify items in reverse chronological order
- [ ] T012 [US2] Manual test: Add items to active list → archive → create new list → verify new list starts with new items at top

**Checkpoint**: User Story 2 complete - ordering persists across all interactions ✅

---

## Phase 5: User Story 3 - Dashboard and Analytics Unaffected (Priority: P2)

**Goal**: Verify that dashboard statistics and analytics remain accurate despite item display order changes

**Independent Test**: User can complete a list and view analytics showing correct calculations despite internal reverse chronological ordering

### Implementation for User Story 3

- [ ] T013 [P] [US3] Manual test: Create list with 3 items → complete all → verify dashboard shows correct item count (3 items completed)
- [ ] T014 [P] [US3] Manual test: Complete multiple lists → view Dashboard tab → verify total statistics are accurate
- [ ] T015 [US3] Manual test: Complete list with items added at different times → verify "Recent Trips" section shows correct data and timestamps
- [ ] T016 [US3] Manual test: Verify analytics calculations (averages, counts, etc.) match between active lists and completed lists

**Checkpoint**: User Story 3 complete - no regressions detected ✅

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final verification and deployment readiness

- [ ] T017 Code review: Ensure List.tsx change is clean and uses `.reverse()` idiomatically
- [ ] T018 Verify TypeScript compilation passes without errors: `npm run build`
- [ ] T019 Verify production build size ≤140 KB gzipped: Check dist/ output after build
- [ ] T020 Manual smoke test: `npm run dev` → add items → verify order is correct → complete items → verify still correct
- [ ] T021 Final verification: All user story tests pass, no console errors, no regressions detected
- [ ] T022 Commit implementation changes with clear message: "feat: display items in reverse chronological order"
- [ ] T023 Deploy to GitHub Pages: Production build ready for release

---

## Dependency Graph & Execution Order

```
T001, T002 (Setup)
    ↓
T003 (Implement core feature)
    ↓
T004-T007 (Test US1 - New Items Appear at Top)
    ↓
T008-T012 (Test US2 - Order Preserved) - Can start after T003
    ↓
T013-T016 (Test US3 - Analytics Unaffected) - Can start after T003
    ↓
T017-T023 (Final Verification & Deployment)
```

---

## Parallel Execution Opportunities

### Execution Schedule Option A: Sequential (Safest for small feature)
```
T001 → T002 → T003 → T004-T007 → T008-T012 → T013-T016 → T017-T023
Total Time: ~2 hours (most conservative, verifies end-to-end)
```

### Execution Schedule Option B: Optimized Parallel (Recommended)
```
T001-T002 (Setup: 10 min)
    ↓
T003 (Implementation: 5 min)
    ↓
T004-T007 (US1 Tests: 15 min)
    ↓
[PARALLEL]
  T008-T012 (US2 Tests: 20 min) + T013-T016 (US3 Tests: 15 min)
    ↓
T017-T023 (Final Verification & Deployment: 15 min)
Total Time: ~80 minutes
```

**Recommendation**: Use Execution Schedule Option B for faster delivery while maintaining quality verification.

---

## Success Criteria by User Story

### User Story 1 ✅ Complete When:
- [x] List.tsx modified with `.reverse()` operation
- [x] New items appear at top of list
- [x] Item properties display correctly
- [x] Manual tests T004-T007 pass

### User Story 2 ✅ Complete When:
- [x] Manual tests T008-T012 pass
- [x] Ordering persists across page reload
- [x] Ordering preserved after backup/restore
- [x] No data loss or corruption

### User Story 3 ✅ Complete When:
- [x] Manual tests T013-T016 pass
- [x] Analytics calculations correct
- [x] No regressions in Dashboard display
- [x] Trip data displays accurately

### Feature 004 ✅ Complete When:
- [x] All user stories pass their tests
- [x] Build size ≤140 KB (T019)
- [x] TypeScript compilation succeeds (T018)
- [x] No console errors or warnings
- [x] Deployed to GitHub Pages (T023)

---

## Implementation Notes

### File Changes Summary
- **Primary**: `src/components/List.tsx` (1-2 lines changed)
- **Data**: No data model changes
- **Storage**: No storage format changes
- **Other Components**: No changes needed

### Why This Task Structure Works
1. **Minimal Scope**: Feature change is small and focused (single `.reverse()` call)
2. **Low Risk**: No data mutation, no architectural changes
3. **Fast Execution**: Can be implemented and tested in <2 hours
4. **High Confidence**: Clear test scenarios verify correctness
5. **No Dependencies**: Feature works independently

### Rollback Plan (If Needed)
If issues arise:
1. Remove `.reverse()` from List.tsx line ~150
2. Rebuild with `npm run build`
3. Redeploy to GitHub Pages
4. All lists revert to chronological order (oldest first)
5. No data is lost or corrupted

---

## Quick Reference: Task Summary

| Phase | Task ID | Type | Summary |
|-------|---------|------|---------|
| 1 | T001-T002 | Setup | Review code and docs |
| 2 | - | Foundation | N/A (no blockers) |
| 3 | T003 | Implement | Add `.reverse()` to List.tsx |
| 3 | T004-T007 | Tests | Verify items appear newest-first |
| 4 | T008-T012 | Tests | Verify persistence across interactions |
| 5 | T013-T016 | Tests | Verify no analytics regressions |
| 6 | T017-T023 | Polish | Review, build, verify, deploy |

**Total Tasks**: 23  
**MVP Tasks** (US1 + Setup): T001-T007 (7 tasks, ~30 min)  
**Full Feature** (All Stories): T001-T023 (23 tasks, ~2 hours)  

---

## Testing Approach (Manual)

Per project constitution, testing is manual verification of critical paths and edge cases:

**Critical Paths to Verify**:
1. Adding items → newest appears first
2. Completing items → order preserved
3. Page refresh → order persists
4. Backup/restore → order correct
5. Analytics → calculations unchanged

**Edge Cases to Check**:
- Empty list → add first item (should appear)
- Single item → add second item (should appear above)
- Rapid additions → order correct even with fast clicks
- Items in different states (completed/uncompleted) → order correct for all
