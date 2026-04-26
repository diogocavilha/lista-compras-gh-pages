# Tasks: Visual Item States

**Input**: Design documents from `/specs/009-visual-item-states/`
**Prerequisites**: spec.md (required for user stories), plan.md

## Phase 1: Implementation

### User Story 1 - Completed Items Visual (Priority: P1)

**Goal**: Make completed items clearly distinguishable with vibrant green color

**Independent Test**: Mark an item as completed (swipe right) and verify vibrant green background appears

- [X] T001 [US1] Update Card bgcolor to vibrant green for completed items in src/components/ListItem.tsx
- [X] T002 [US1] Verify strikethrough text styling for completed items in src/components/ListItem.tsx

**Checkpoint**: Completed items display with vibrant green background

### User Story 2 - Canceled Items Visual (Priority: P2)

**Goal**: Make canceled/deleted items clearly distinguishable with vibrant red color

**Independent Test**: Delete an item (swipe left) and verify vibrant red background appears

- [X] T003 [US2] Update Card bgcolor to vibrant red for deleted items in src/components/ListItem.tsx
- [X] T004 [US2] Ensure canceled items do NOT display check icon (verify existing logic)

**Checkpoint**: Canceled items display with vibrant red background, no check icon

---

## Phase 2: Polish & Verification

**Purpose**: Ensure visual consistency across themes

- [ ] T005 Verify visual states work in light theme (default)
- [ ] T006 Verify visual states work in dark theme

**Checkpoint**: Both themes display distinct visual states

---

## Dependencies & Execution Order

### Phase Dependencies

- Phase 1 (Implementation): No setup required - can start immediately
- Phase 2 (Polish): Depends on Phase 1 completion

### Within Each User Story

1. US1 (Completed) → US2 (Canceled) → Polish

### Parallel Opportunities

- T001 and T002 are sequential (same file)
- T003 and T004 are sequential (same file)
- T005 and T006 can run in parallel (different themes)

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete T001-T002 for User Story 1
2. **STOP and VALIDATE**: Test completed items visual
3. Deploy if ready

### Incremental Delivery

1. US1 complete → Test → Demo
2. US2 complete → Test → Demo
3. Polish complete → Final validation

---

## Notes

- No tests needed (per project constitution - manual verification only)
- Single component file: src/components/ListItem.tsx
- Colors: Use MUI palette directly (success/main, error/main for vibrant colors)
