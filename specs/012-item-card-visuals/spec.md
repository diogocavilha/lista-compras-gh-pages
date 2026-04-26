# Feature Specification: Item Card Visuals - Light Theme

**Feature Branch**: `012-item-card-visuals`  
**Created**: 2026-04-26  
**Status**: Draft  
**Input**: User description: "Alterar visual dos itens da lista quando o usar o tema claro. Os cards dos itens são brancos atualmente, deve ser um pouco mais escuro para contrastar com a cor de fundo do app"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Darker Card in Light Theme (Priority: P1)

O usuário visualiza a lista de compras com o tema claro e os cards dos itens possuem uma cor mais escura que contrasta com o fundo do aplicativo.

**Why this priority**: O contraste visual improved a legibilidade e experiência do usuário ao usar o app no tema claro.

**Independent Test**: Can be tested by viewing the shopping list in light theme and verifying card color is darker than background.

**Acceptance Scenarios**:

1. **Given** the app is in light theme, **When** the user views the shopping list, **Then** the item cards are darker than the app background
2. **Given** the app is in light theme, **When** the user adds a new item, **Then** the new item card has the same darker color as existing cards

---

### Edge Cases

- What happens when switching from dark to light theme? Card color should update immediately.
- What happens with completed items? They should also have the darker card color.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display item cards with darker background color in light theme
- **FR-002**: System MUST maintain visual consistency across all item cards
- **FR-003**: System MUST differentiate card colors by item state (active vs completed vs deleted)

### Key Entities

- **Shopping Item Card**: Visual component displaying list items.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Item cards are visibly darker than background in light theme
- **SC-002**: All item types (active, completed, deleted) have appropriate card colors

## Assumptions

- The theme system already supports light/dark mode switching
- Card colors for completed and deleted states will also be adjusted for consistency