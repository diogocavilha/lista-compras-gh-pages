# Implementation Plan: Edit Shopping List Item

**Branch**: `010-edit-shopping-item` | **Date**: 2026-04-25 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/speckit.specify` command

## Summary

Allow users to edit existing shopping list items by tapping on them. A dialog opens pre-populated with the current item name, allowing modification or cancellation.

## Technical Context

**Language/Version**: TypeScript 5.1  
**Primary Dependencies**: React 18, MUI 9, Vite 5  
**Storage**: localStorage (via existing storageService)  
**Testing**: Manual verification only (per project constitution)  
**Target Platform**: Web browsers (desktop and mobile)  
**Project Type**: Single-page web application  
**Performance Goals**: Dialog opens within 200ms  
**Constraints**: Mobile-first, touch-friendly interactions  
**Scale/Scope**: Single shopping list per user, < 100 items typical  

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Gate | Status | Notes |
|------|--------|-------|
| Clean Code - small focused functions | PASS | Single responsibility for edit dialog |
| Small & Clear Scope | PASS | One feature: tap to edit |
| No Over-Engineering | PASS | Reuse existing add-item dialog pattern |
| No Automated Tests | PASS | Manual verification only |

## Project Structure

### Documentation (this feature)

```text
specs/007-edit-shopping-item/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Not needed (no external research required)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Not applicable (no external interfaces)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── List.tsx         # Add edit dialog state and handler
│   └── ListItem.tsx     # Handle tap to trigger edit
├── types/
│   └── index.ts         # Entity definitions (already complete)
├── services/
│   └── storageService.ts # Data persistence (already complete)
└── App.tsx             # Parent component wiring
```

**Structure Decision**: Standard React component structure. Edit functionality added to existing List.tsx and ListItem.tsx components.

## Phase 0: Outline & Research

N/A - No external dependencies or unclear technologies. Feature uses existing patterns:
- Same dialog pattern as "Add Item" (List.tsx lines 232-257)
- Same entity types already defined (types/index.ts)
- Same storage pattern via props

## Phase 1: Design & Contracts

### Data Model

Entity: `ListItem`
- `id`: string (UUID v4) - unique identifier
- `title`: string - product name (1-200 chars)
- `completed`: boolean - checked state
- `completedAt`: string | null - ISO timestamp
- `createdAt`: string - ISO timestamp
- `deleted`: boolean - soft delete flag
- `deletedAt`: string | null - ISO timestamp

**Validation Rules** (from existing code):
- Title must be 1-200 characters
- Title must be unique within list (case-insensitive)
- Empty titles are rejected

**State Transitions**:
- NEW → exists in items array
- EDITED → title updated in-place
- DELETED → `deleted: true` flag set
- COMPLETED → `completed: true` flag set

### Interface Contracts

N/A - Internal SPA with no external interfaces

### Quickstart

1. Edit `src/App.tsx`: Add `onEditItem` callback prop
2. Edit `src/components/List.tsx`: 
   - Add `onEditItem` prop and edit dialog state
   - Add `handleEditItem` function
   - Add edit Dialog component
3. Edit `src/components/ListItem.tsx`:
   - Add `onEditItem` callback prop
   - Handle tap gesture (not swipe) to trigger edit

### Agent Context Update