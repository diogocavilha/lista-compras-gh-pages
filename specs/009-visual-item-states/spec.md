# Feature Specification: Visual Item States

**Feature Branch**: `009-visual-item-states`  
**Created**: 2026-04-26  
**Status**: Draft  
**Input**: User description: "Melhorar o visual de itens concluídos e cancelados"

## User Scenarios & Testing

### User Story 1 - Distinct Visual States for Completed Items (Priority: P1)

When users mark an item as completed, the item should have a visually distinct appearance that clearly communicates its completed state.

**Why this priority**: Completed items are the most common state change users encounter during shopping. Clear visual feedback improves user confidence and reduces uncertainty about which items are done.

**Independent Test**: Can be fully tested by marking an item as completed and verifying its visual appearance changes.

**Acceptance Scenarios**:

1. **Given** an active item in the shopping list, **When** the user marks it as completed (swipe right), **Then** the item background changes to a vibrant green color and the text displays with a strikethrough style.

2. **Given** a completed item, **When** the user views it, **Then** a check icon is visible indicating completion.

---

### User Story 2 - Distinct Visual States for Canceled Items (Priority: P2)

When users cancel/delete an item, the item should have a visually distinct appearance that clearly communicates its canceled state, differentiating it from completed items.

**Why this priority**: Canceled items should be visually distinguishable from completed items to avoid user confusion about item status.

**Independent Test**: Can be fully tested by deleting an item and verifying its visual appearance changes.

**Acceptance Scenarios**:

1. **Given** an active item in the shopping list, **When** the user deletes it (swipe left), **Then** the item background changes to a vibrant red color.

2. **Given** a canceled item, **When** the user views it, **Then** no check icon is visible (differentiation from completed).

---

### Edge Cases

- How does the system handle visual consistency across light and dark themes?
- How do the new visual states interact with existing swipe gestures?

## Requirements

### Functional Requirements

- **FR-001**: System MUST display completed items with a vibrant green background color that is clearly distinguishable from the default item background.
- **FR-002**: System MUST display canceled/deleted items with a vibrant red background color that is clearly distinguishable from the default item background.
- **FR-003**: Completed items MUST maintain strikethrough text styling to reinforce their completed state.
- **FR-004**: Visual states MUST maintain visual distinction in both light and dark themes.
- **FR-005**: Completed items MUST display a check icon to provide additional visual confirmation.
- **FR-006**: Canceled items MUST NOT display a check icon to differentiate from completed state.
- **FR-007**: Colors MUST provide sufficient contrast for accessibility compliance.

### Key Entities

- **ListItem**: Shopping list item with states `completed` (boolean) and `deleted` (boolean). The visual rendering should reflect these states with appropriate color schemes.

## Success Criteria

### Measurable Outcomes

- **SC-001**: 100% of completed items display with vibrant green background within 100ms of state change.
- **SC-002**: 100% of canceled items display with vibrant red background within 100ms of state change.
- **SC-003**: Visual distinction between completed and canceled items is immediately apparent to users (tested via user observation).
- **SC-004**: Both light and dark themes maintain clear visual distinction between item states.

## Assumptions

- The existing MUI theme system will be leveraged for color definitions.
- Colors will follow the project's existing design language while being more vibrant than current implementation.
- This is a visual-only change with no impact on data model or business logic.
