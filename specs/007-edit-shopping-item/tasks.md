# Tasks: Edit Shopping List Item

**Input**: Design documents from `/specs/007-edit-shopping-item/`
**Prerequisites**: plan.md, spec.md, data-model.md, quickstart.md

**Tests**: None - project uses manual verification per constitution

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

## Phase 1: Setup (Minimal - Project Exists)

**Purpose**: Verify existing project structure is ready

- [X] T001 Review existing project structure in src/components/List.tsx and src/components/ListItem.tsx

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Understand existing patterns before implementation

- [X] T002 Analyze existing add-item dialog pattern in List.tsx lines 232-257
- [X] T003 Understand ListItem gesture handling in ListItem.tsx lines 36-107

**Checkpoint**: Existing patterns understood - user story implementation can begin

---

## Phase 3: User Story 1 - Edit Shopping Item (Priority: P1) 🎯 MVP

**Goal**: User taps an item and an edit dialog opens with the item name pre-filled

**Independent Test**: Open app, tap on any item, verify edit dialog opens with that item's name

### Implementation for User Story 1

- [X] T004 [P] [US1] Add `onEditItem` prop to ListItemProps interface in src/components/ListItem.tsx
- [X] T005 [P] [US1] Add `onEditItem` prop to ListProps interface in src/components/List.tsx
- [X] T006 [US1] Handle tap gesture (non-swipe) in ListItem.tsx to trigger onEditItem callback
- [X] T007 [US1] Add edit dialog state (editItemOpen, editItemId, editInputValue) in src/components/List.tsx
- [X] T008 [US1] Create handleEditItem function in src/components/List.tsx to open dialog with item name
- [X] T009 [US1] Add Edit Dialog component in src/components/List.tsx (similar to add-item dialog)
- [X] T010 [US1] Create handleSaveEdit function with validation (empty check, 200 char limit, duplicate check) in src/components/List.tsx
- [X] T011 [US1] Connect edit dialog to ListItem in src/components/List.tsx

**Checkpoint**: At this point, User Story 1 should be fully functional - tap an item, edit name, save

---

## Phase 4: User Story 2 - Cancel Edit (Priority: P2)

**Goal**: User can cancel editing without making changes

**Independent Test**: Open edit dialog, click cancel, verify original item name is unchanged

### Implementation for User Story 2

- [X] T012 [US2] Add Cancel button handler to close dialog without saving in src/components/List.tsx
- [X] T013 [US2] Add handleDialogClose to reset state on cancel in src/components/List.tsx

**Checkpoint**: Cancel functionality working - original name preserved on cancel

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Integration and edge case handling

- [X] T014 [P] Wire onEditItem callback in src/App.tsx to update item title
- [X] T015 Validate edit works correctly with deleted items section (edge case)
- [X] T016 Run manual verification per quickstart.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - verify structure
- **Foundational (Phase 2)**: Depends on Setup - understand existing code
- **User Story 1 (Phase 3)**: Depends on Foundational - core edit functionality
- **User Story 2 (Phase 4)**: Depends on User Story 1 - cancel builds on edit dialog
- **Polish (Phase 5)**: Depends on all stories - final integration

### User Story Dependencies

- **User Story 1 (P1)**: Core feature - tap to edit
- **User Story 2 (P2)**: Depends on US1 dialog being in place

### Parallel Opportunities

- T004 and T005 can run in parallel (different files)
- T007 and T008 are sequential (state before handler)
- T010 depends on T007, T008

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1-2: Setup and review
2. Complete Phase 3: User Story 1
3. **STOP and VALIDATE**: Test tap-to-edit flow
4. Deploy/demo if ready

### Incremental Delivery

1. Complete Phase 3: Edit functionality → Test → MVP!
2. Add Phase 4: Cancel functionality → Test → Better UX
3. Add Phase 5: Polish and integration

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each phase completion
- Stop at any checkpoint to validate story independently
- Existing add-item dialog is the pattern to follow for edit dialog