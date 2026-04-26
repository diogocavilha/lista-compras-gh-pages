# Feature Specification: Edit Shopping List Item

**Feature Branch**: `010-edit-shopping-item`  
**Created**: 2026-04-25  
**Status**: Draft  
**Input**: User description: "Ao tocar em um item da lista de compras, a popup deve abrir novamente com o nome do item para edição"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Edit Shopping Item (Priority: P1)

O usuário toca em um item existente na lista de compras e uma popup abre com o nome do item preenchido para edição.

**Why this priority**: This is the core functionality requested - allowing users to edit existing items by tapping on them.

**Independent Test**: Can be fully tested by tapping an item and verifying the popup opens with correct item name.

**Acceptance Scenarios**:

1. **Given** a shopping list with at least one item, **When** the user taps on that item, **Then** the edit popup opens displaying the item's current name
2. **Given** the edit popup is open with an item name, **When** the user modifies the name and confirms, **Then** the item in the list is updated with the new name

---

### User Story 2 - Cancel Edit (Priority: P2)

O usuário pode cancelar a edição de um item sem fazer alterações.

**Why this priority**: Users need the ability to abort changes and return to the previous state.

**Independent Test**: Can be tested by opening edit popup and pressing cancel to verify item remains unchanged.

**Acceptance Scenarios**:

1. **Given** the edit popup is open with an item name, **When** the user presses cancel or closes the popup without saving, **Then** the original item name is preserved

---

### Edge Cases

- What happens when the item name is empty after editing?
- How does the system handle very long item names?
- What happens when editing an item that has already been deleted by another action?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display an edit popup when user taps on a shopping list item
- **FR-002**: System MUST pre-populate the popup input field with the current item name
- **FR-003**: System MUST allow the user to modify the item name in the popup
- **FR-004**: System MUST save the edited name when the user confirms the change
- **FR-005**: System MUST preserve the original name when the user cancels the edit
- **FR-006**: System MUST allow the user to close the popup

### Key Entities

- **Shopping Item**: Represents an item on the shopping list. Key attributes: name, quantity (if applicable), checked status.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can edit an item name within 3 seconds from tapping to saving
- **SC-002**: 100% of item edits are successfully saved when confirmed
- **SC-003**: Cancelled edits result in zero changes to the original item data

## Assumptions

- Users have a touch-enabled device or mouse to tap items
- The existing popup component will be reused or adapted for editing
- The shopping list already supports adding new items (this is an enhancement to that flow)