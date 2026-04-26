# Feature Specification: Long Press Edit

**Feature Branch**: `013-long-press-edit`  
**Created**: 2026-04-26  
**Status**: Draft  
**Input**: User description: "A popup de edição do item deve ser aberta após tocar e segurar o item por 1 segundo"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Long Press to Edit (Priority: P1)

O usuário toca e segura um item da lista de compras por 1 segundo e a popup de edição abre.

**Why this priority**: Este é o comportamento core solicitado - editar items via long press.

**Independent Test**: Can be tested by pressing and holding an item for 1 second and verifying edit popup opens.

**Acceptance Scenarios**:

1. **Given** a shopping list with at least one item, **When** the user touches and holds that item for 1 second, **Then** the edit popup opens
2. **Given** the user releases before 1 second, **When** the user touches but does not hold, **Then** the edit popup does not open

---

### Edge Cases

- What happens if user swipes instead of holding? Should not trigger edit.
- What happens with very fast taps? Should not trigger edit.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST open edit popup when user long presses item for 1 second
- **FR-002**: System MUST NOT open edit popup for taps shorter than 1 second
- **FR-003**: System MUST distinguish between long press and swipe gestures

### Key Entities

- **Shopping Item**: Item on the shopping list.
- **Edit Popup**: Modal for editing item name.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Edit popup opens after exactly 1 second of holding
- **SC-002**: Zero false positives from short taps

## Assumptions

- The existing edit popup component will be reused
- Gesture detection logic in ListItem.tsx handles both tap and swipe