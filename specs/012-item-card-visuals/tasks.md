# Tasks: Item Card Visuals - Light Theme

**Feature**: Item Card Visuals - Light Theme
**Feature Directory**: `specs/012-item-card-visuals`
**Input**: Implementation plan at `specs/012-item-card-visuals/plan.md`

## Summary

- **Total Tasks**: 3
- **User Stories Covered**: 1 (US1)

## Dependencies

```
Phase 1 (Setup) → Phase 2 (Implement theme colors) → Phase 3 (Polish)
```

## Phase 1: Setup

- [x] T001 Analyze current theme configuration in src/context/ThemeContext.tsx

## Phase 2: User Story Implementation

### User Story 1 - Darker Card in Light Theme

**Story Goal**: Item cards have darker background in light theme
**Independent Test**: View shopping list in light theme → cards are visibly darker than background

- [x] T002 [US1] Add custom background.paper color in ThemeContext.tsx for light mode
- [x] T003 [US1] Update ListItem.tsx to use theme.palette.background.paper

## Phase 3: Polish & Cross-Cutting

- [x] T004 Verify completed and deleted items also use theme colors

## Implementation Strategy

**MVP Scope**: T002 + T003 (theme config + ListItem update)
**Incremental Delivery**: Single user story, all tasks needed together

### Key Files

1. `src/context/ThemeContext.tsx` - Add palette.background.paper
2. `src/components/ListItem.tsx` - Use theme color

### Solution (from plan.md)

1. In ThemeContext.tsx: Create theme with custom background colors
2. In ListItem.tsx: Use `theme.palette.background.paper` for card bgcolor

## Notes

- No data model changes
- No test tasks (manual verification per constitution)
- Two files to modify: ThemeContext.tsx and ListItem.tsx